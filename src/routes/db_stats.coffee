express = require('express')
router = express.Router()
mongoose = require('mongoose')
AccessControl = require('../utils/ac_grants')

Build = require('../models/build')
Test  = require('../models/test')

TRACKED = ['builds', 'tests']
BATCH_SIZE  = 200
CONCURRENCY = 5

countTestsForBuilds = (buildIds, callback) ->
  return callback(null, 0) unless buildIds.length

  batches = []
  i = 0
  while i < buildIds.length
    batches.push(buildIds.slice(i, i + BATCH_SIZE))
    i += BATCH_SIZE

  total = 0
  runGroup = (start) ->
    if start >= batches.length
      return callback(null, total)
    group = batches.slice(start, start + CONCURRENCY)
    Promise.all(group.map (batch) -> Test.countDocuments({ build: { $in: batch } }).exec())
    .then (counts) ->
      total += counts.reduce ((s, c) -> s + c), 0
      runGroup(start + CONCURRENCY)
    .catch (err) -> callback(err)
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

  db = mongoose.connection.db
  cutoff = new Date(untilDate)
  if isNaN(cutoff.getTime())
    return res.status(400).json({ error: 'untilDate is not a valid date' })

  timeQuery = { $lt: cutoff }
  if fromDate
    from = new Date(fromDate)
    if isNaN(from.getTime())
      return res.status(400).json({ error: 'fromDate is not a valid date' })
    timeQuery.$gte = from

  Promise.all([
    Build.countDocuments({ start_time: timeQuery }).exec()
    Test.countDocuments({ start_time: timeQuery }).exec()
    db.command({ collStats: 'builds' }).catch -> null
    db.command({ collStats: 'tests'  }).catch -> null
  ]).then ([buildCount, testCount, buildStats, testStats]) ->
    buildAvg = buildStats?.avgObjSize or 0
    testAvg  = testStats?.avgObjSize  or 0
    estimatedBytes = (buildCount * buildAvg) + (testCount * testAvg)
    res.json
      buildCount:     buildCount
      testCount:      testCount
      estimatedBytes: estimatedBytes
      sizeFormatted:  formatBytes(estimatedBytes)
  .catch (e) -> next(e)

# Passed Test Details: estimate bytes freed by removing steps from PASS tests
router.post '/estimate/pass-steps', (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, 'setting'))
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  unless req.body.untilDate
    return res.status(400).json({ error: 'untilDate is required' })

  untilCutoff = new Date(req.body.untilDate)
  if isNaN(untilCutoff.getTime())
    return res.status(400).json({ error: 'untilDate is not a valid date' })

  db = mongoose.connection.db
  query =
    status: { $in: ['PASS', 'RERUN_PASS'] }
    start_time: { $lt: untilCutoff }
    $or: [{ setup: { $exists: true } }, { body: { $exists: true } }, { teardown: { $exists: true } }]

  estimatePassSteps(query, db, res, next)

estimatePassSteps = (query, db, res, next) ->
  Promise.all([
    Test.countDocuments(query).exec()
    db.command({ collStats: 'tests' }).catch -> null
  ]).then ([passCount, testStats]) ->
    testAvg = testStats?.avgObjSize or 0
    estimatedBytes = passCount * testAvg * 0.7
    res.json
      passTestCount:  passCount
      estimatedBytes: estimatedBytes
      sizeFormatted:  formatBytes(estimatedBytes)
      note:           'Estimate: ~70% of avg doc size assumed to be step data'
  .catch (e) -> next(e)

# Level 3: estimate bytes freed by deleting all builds under product+type
router.post '/estimate/by-lane', (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, 'setting'))
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  { product, type } = req.body
  unless product and type
    return res.status(400).json({ error: 'product and type are required' })

  db = mongoose.connection.db
  Promise.all([
    Build.find({ product, type }).select('_id').lean().exec()
    db.command({ collStats: 'builds' }).catch -> null
    db.command({ collStats: 'tests'  }).catch -> null
  ]).then ([builds, buildStats, testStats]) ->
    buildAvg   = buildStats?.avgObjSize or 0
    testAvg    = testStats?.avgObjSize  or 0
    buildCount = builds.length
    if buildCount is 0
      return res.json { buildCount: 0, testCount: 0, estimatedBytes: 0, sizeFormatted: '0 B' }
    buildIds = builds.map (b) -> b._id
    countTestsForBuilds buildIds, (err2, testCount) ->
      return next(err2) if err2
      estimatedBytes = (buildCount * buildAvg) + (testCount * testAvg)
      res.json
        buildCount:     buildCount
        testCount:      testCount
        estimatedBytes: estimatedBytes
        sizeFormatted:  formatBytes(estimatedBytes)
  .catch (e) -> next(e)

module.exports = router
