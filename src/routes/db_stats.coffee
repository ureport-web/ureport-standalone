express = require('express')
router = express.Router()
mongoose = require('mongoose')
bsonLib = require('bson')
bsonInst = new bsonLib.BSON()
AccessControl = require('../utils/ac_grants')

Build = require('../models/build')
Test  = require('../models/test')

TRACKED = ['builds', 'tests']
BATCH_SIZE  = 200
CONCURRENCY = 5
SAMPLE_SIZE = 300

# On-disk bytes per document averaged across the whole collection.
# storageSize = total compressed on-disk bytes; count = total document count.
# Stable and consistent with the totals shown on the stats page.
perDocDiskBytes = (stats) ->
  return 0 unless stats?.count > 0
  stats.storageSize / stats.count

# Derive compression ratio for pass-steps BSON delta calculation only.
# collStats.size = total uncompressed logical bytes; storageSize = compressed on-disk.
compressionRatio = (stats) ->
  return 1 unless stats?.size > 0
  ratio = stats.storageSize / stats.size
  Math.min(1, Math.max(0.05, ratio))

countTestsForBuilds = (buildIds) ->
  return Promise.resolve(0) unless buildIds.length

  batches = []
  i = 0
  while i < buildIds.length
    batches.push(buildIds.slice(i, i + BATCH_SIZE))
    i += BATCH_SIZE

  total = 0
  runGroup = (start) ->
    if start >= batches.length
      return Promise.resolve(total)
    group = batches.slice(start, start + CONCURRENCY)
    Promise.all(group.map (batch) -> Test.countDocuments({ build: { $in: batch } }).exec())
    .then (counts) ->
      total += counts.reduce ((s, c) -> s + c), 0
      runGroup(start + CONCURRENCY)
  runGroup(0)

formatBytes = (bytes) ->
  return 'N/A' unless bytes? and bytes >= 0
  if bytes < 1000
    "#{bytes} B"
  else if bytes < 1000 * 1000
    "#{(bytes / 1000).toFixed(1)} KB"
  else if bytes < 1000 * 1000 * 1000
    "#{(bytes / (1000 * 1000)).toFixed(2)} MB"
  else
    "#{(bytes / (1000 * 1000 * 1000)).toFixed(2)} GB"

router.get '/stats', (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, 'setting'))
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  db = mongoose.connection.db

  Promise.all([
    db.command({ collStats: 'builds' }).catch -> null
    db.command({ collStats: 'tests'  }).catch -> null
  ]).then ([buildStats, testStats]) ->
    buildCount      = buildStats?.count          or 0
    testCount       = testStats?.count           or 0
    buildStorage    = buildStats?.storageSize    or 0
    testStorage     = testStats?.storageSize     or 0
    buildIndexSize  = buildStats?.totalIndexSize or 0
    testIndexSize   = testStats?.totalIndexSize  or 0

    res.json
      collections: [
        { name: 'builds', count: buildCount, storageSize: buildStorage, sizeFormatted: formatBytes(buildStorage), indexSize: buildIndexSize, indexSizeFormatted: formatBytes(buildIndexSize) }
        { name: 'tests',  count: testCount,  storageSize: testStorage,  sizeFormatted: formatBytes(testStorage),  indexSize: testIndexSize,  indexSizeFormatted: formatBytes(testIndexSize)  }
      ]
      total:
        storageSize:        buildStorage + testStorage
        sizeFormatted:      formatBytes(buildStorage + testStorage)
        indexSize:          buildIndexSize + testIndexSize
        indexSizeFormatted: formatBytes(buildIndexSize + testIndexSize)
      raw:
        builds: buildStats
        tests:  testStats
  .catch (e) ->
    next(e)

# Level 1: estimate bytes freed by deleting builds+tests before a date
router.post '/estimate/before-date', (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, 'setting'))
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  { untilDate, fromDate } = req.body
  unless untilDate
    return res.status(400).json({ error: 'untilDate is required' })

  cutoff = new Date(untilDate)
  if isNaN(cutoff.getTime())
    return res.status(400).json({ error: 'untilDate is not a valid date' })

  timeQuery = { $lt: cutoff }
  if fromDate
    from = new Date(fromDate)
    if isNaN(from.getTime())
      return res.status(400).json({ error: 'fromDate is not a valid date' })
    timeQuery.$gte = from

  buildQuery = { start_time: timeQuery }
  testQuery  = { start_time: timeQuery }
  db = mongoose.connection.db

  Promise.all([
    Build.countDocuments(buildQuery).exec()
    Test.countDocuments(testQuery).exec()
    db.command({ collStats: 'builds' }).catch -> null
    db.command({ collStats: 'tests'  }).catch -> null
  ]).then ([buildCount, testCount, buildStats, testStats]) ->
    buildPerDoc = perDocDiskBytes(buildStats)
    testPerDoc  = perDocDiskBytes(testStats)
    estimatedBytes = (buildCount * buildPerDoc) + (testCount * testPerDoc)
    res.json
      buildCount:     buildCount
      testCount:      testCount
      estimatedBytes: Math.round(estimatedBytes)
      sizeFormatted:  formatBytes(estimatedBytes)
  .catch (e) -> next(e)

# Strip Steps: estimate bytes freed by removing steps from ALL tests before a date
router.post '/estimate/strip-steps', (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, 'setting'))
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  unless req.body.untilDate
    return res.status(400).json({ error: 'untilDate is required' })

  untilCutoff = new Date(req.body.untilDate)
  if isNaN(untilCutoff.getTime())
    return res.status(400).json({ error: 'untilDate is not a valid date' })

  query =
    start_time: { $lt: untilCutoff }

  estimateStripSteps(query, res, next)

estimateStripSteps = (query, res, next) ->
  db = mongoose.connection.db
  Promise.all([
    Test.countDocuments(query).exec()
    Test.find(query).limit(SAMPLE_SIZE).lean().exec()
    db.command({ collStats: 'tests' }).catch -> null
  ]).then ([totalCount, docs, testStats]) ->
    if docs.length is 0
      return res.json { testCount: 0, estimatedBytes: 0, sizeFormatted: '0 B', note: 'No matching tests found' }

    # Use perDocDiskBytes (storageSize/count) — stable, actual on-disk avg that already accounts
    # for real compression. Derive step fraction from BSON (compression-neutral): stepDelta/totalDocBson.
    # Estimate = totalCount * fractionWithSteps * perDocDiskBytes * avgStepBsonFraction.
    # Avoids applying collection-average compression ratio to step data which compresses much better.
    diskBytesPerDoc = perDocDiskBytes(testStats)

    docsWithSteps = docs.filter (doc) -> doc.setup or doc.body or doc.teardown
    fractionWithSteps = docsWithSteps.length / docs.length

    if docsWithSteps.length is 0
      return res.json { testCount: 0, estimatedBytes: 0, sizeFormatted: '0 B', note: 'No tests with steps found in sample' }

    totalStepFraction = docsWithSteps.reduce (sum, doc) ->
      totalBson = bsonInst.calculateObjectSize(doc)
      return sum if totalBson is 0
      withoutSteps = bsonInst.calculateObjectSize(Object.assign({}, doc, { body: undefined, setup: undefined, teardown: undefined }))
      stepDelta = Math.max(0, totalBson - withoutSteps)
      sum + (stepDelta / totalBson)
    , 0

    avgStepBsonFraction = totalStepFraction / docsWithSteps.length
    estimatedTestCount  = Math.round(totalCount * fractionWithSteps)
    estimatedBytes      = estimatedTestCount * diskBytesPerDoc * avgStepBsonFraction
    res.json
      testCount:      estimatedTestCount
      estimatedBytes: Math.round(estimatedBytes)
      sizeFormatted:  formatBytes(estimatedBytes)
      note:           "#{docsWithSteps.length}/#{docs.length} sampled docs have steps (#{Math.round(fractionWithSteps * 100)}%); steps avg #{Math.round(avgStepBsonFraction * 100)}% of doc BSON"
  .catch (e) -> next(e)

# Strip Steps purge: remove setup/body/teardown from all tests before a date
router.post '/purge/strip-steps', (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, 'setting'))
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  unless req.body.untilDate
    return res.status(400).json({ error: 'untilDate is required' })

  untilCutoff = new Date(req.body.untilDate)
  if isNaN(untilCutoff.getTime())
    return res.status(400).json({ error: 'untilDate is not a valid date' })

  query =
    start_time: { $lt: untilCutoff }
    $or: [{ setup: { $exists: true } }, { body: { $exists: true } }, { teardown: { $exists: true } }]

  Test.updateMany(query, { $unset: { setup: '', body: '', teardown: '' } }).exec (err, result) ->
    if err then return next(err)
    res.json { modifiedCount: result.nModified }

# Level 3: estimate bytes freed by deleting all builds under product+type
router.post '/estimate/by-lane', (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, 'setting'))
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  { product, type } = req.body
  unless product and type
    return res.status(400).json({ error: 'product and type are required' })

  laneQuery = { product, type }
  db = mongoose.connection.db

  Promise.all([
    Build.find(laneQuery).select('_id').lean().exec()
    db.command({ collStats: 'builds' }).catch -> null
    db.command({ collStats: 'tests'  }).catch -> null
  ]).then ([builds, buildStats, testStats]) ->
    buildCount = builds.length
    if buildCount is 0
      return res.json { buildCount: 0, testCount: 0, estimatedBytes: 0, sizeFormatted: '0 B' }
    buildIds    = builds.map (b) -> b._id
    buildPerDoc = perDocDiskBytes(buildStats)
    testPerDoc  = perDocDiskBytes(testStats)
    countTestsForBuilds(buildIds)
    .then (testCount) ->
      estimatedBytes = (buildCount * buildPerDoc) + (testCount * testPerDoc)
      res.json
        buildCount:     buildCount
        testCount:      testCount
        estimatedBytes: Math.round(estimatedBytes)
        sizeFormatted:  formatBytes(estimatedBytes)
    .catch (e) -> next(e)
  .catch (e) -> next(e)

module.exports = router
