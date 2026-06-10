express = require('express')
router = express.Router()

Build = require('../models/build')
Test = require('../models/test')

toMatch = (val) -> if Array.isArray(val) then { $in: val } else val

buildMatchFromBody = (body, sinceDate) ->
  { product, type, team, version, browser, device, platform, platform_version, stage } = body
  match = { product, type, is_archive: false, start_time: { $gte: sinceDate } }
  if team then match.team = toMatch(team)
  if version then match.version = toMatch(version)
  if browser then match.browser = toMatch(browser)
  if device then match.device = toMatch(device)
  if platform then match.platform = toMatch(platform)
  if platform_version then match.platform_version = toMatch(platform_version)
  if stage then match.stage = toMatch(stage)
  match

router.post '/top-failures', (req, res, next) ->
  { product, type, since, limit = 10 } = req.body

  if !product or !type
    return res.status(400).json({ error: 'product and type are required' })

  sinceDate = if since then new Date(since) else new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  buildMatch = buildMatchFromBody(req.body, sinceDate)

  Build.find(buildMatch).select('_id').lean().exec (err, builds) ->
    if err then return next(err)
    buildIds = builds.map (b) -> b._id
    if buildIds.length is 0 then return res.json []

    Test.aggregate([
      { $match: { build: { $in: buildIds }, status: 'FAIL', is_rerun: false } },
      { $group: { _id: '$uid', name: { $first: '$name' }, failCount: { $sum: 1 }, lastFailedAt: { $max: '$start_time' } } },
      { $sort: { failCount: -1 } },
      { $limit: parseInt(limit) }
    ]).exec (err, results) ->
      if err then return next(err)
      res.json results

router.post '/slowest-tests', (req, res, next) ->
  { product, type, since, limit = 10 } = req.body

  if !product or !type
    return res.status(400).json({ error: 'product and type are required' })

  sinceDate = if since then new Date(since) else new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  buildMatch = buildMatchFromBody(req.body, sinceDate)

  Build.find(buildMatch).select('_id').lean().exec (err, builds) ->
    if err then return next(err)
    buildIds = builds.map (b) -> b._id
    if buildIds.length is 0 then return res.json []

    Test.aggregate([
      { $match: {
        build: { $in: buildIds },
        is_rerun: false,
        status: { $in: ['PASS', 'FAIL', 'RERUN_PASS'] },
        start_time: { $ne: null },
        end_time: { $ne: null }
      } },
      { $group: {
        _id: '$uid',
        name: { $first: '$name' },
        avgDuration: { $avg: { $subtract: ['$end_time', '$start_time'] } },
        maxDuration: { $max: { $subtract: ['$end_time', '$start_time'] } },
        runCount: { $sum: 1 }
      } },
      { $sort: { avgDuration: -1 } },
      { $limit: parseInt(limit) }
    ]).exec (err, results) ->
      if err then return next(err)
      res.json results

router.post '/pass-rate-history', (req, res, next) ->
  { product, type, limit = 20 } = req.body
  if !product or !type then return res.status(400).json({ error: 'product and type are required' })

  since = req.body.since || 90
  sinceDate = new Date(Date.now() - since * 24 * 60 * 60 * 1000)
  buildMatch = buildMatchFromBody(req.body, sinceDate)
  lim = parseInt(limit)

  # Group by lane dimensions (same approach as /build/search), collect per-lane history,
  # then unwind by position index and sum across lanes at each position.
  Build.aggregate([
    { $match: buildMatch },
    { $sort: { start_time: -1 } },
    { $group: {
      _id: { product: '$product', type: '$type', team: '$team', version: '$version', browser: '$browser', device: '$device', platform: '$platform', platform_version: '$platform_version', stage: '$stage' },
      entries: { $push: { build: '$build', start_time: '$start_time', pass: '$status.pass', total: '$status.total' } }
    }},
    { $project: { entries: { $slice: ['$entries', lim] } } },
    { $unwind: { path: '$entries', includeArrayIndex: 'posIndex' } },
    { $group: {
      _id: '$posIndex',
      build: { $first: '$entries.build' },
      builds: { $addToSet: '$entries.build' },
      configCount: { $sum: 1 },
      start_time: { $min: '$entries.start_time' },
      totalPass: { $sum: '$entries.pass' },
      totalTotal: { $sum: '$entries.total' }
    }},
    { $sort: { _id: 1 } },
    { $limit: lim }
  ]).exec (err, builds) ->
    if err then return next(err)
    builds = builds.reverse()  # chronological order (oldest first)
    rates = builds.map (b) ->
      passRate = if b.totalPass and b.totalTotal then Math.floor(b.totalPass / b.totalTotal * 100) else 0
      { build: b.build, builds: b.builds, configCount: b.configCount, start_time: b.start_time, passRate, totalTests: b.totalTotal }

    if rates.length >= 3
      mean = rates.reduce(((s, r) -> s + r.passRate), 0) / rates.length
      variance = rates.reduce(((s, r) -> s + Math.pow(r.passRate - mean, 2)), 0) / rates.length
      stddev = Math.sqrt(variance)
      rates = rates.map (r) ->
        zScore = if stddev > 0 then Math.round((r.passRate - mean) / stddev * 100) / 100 else 0
        Object.assign {}, r, { zScore, isAnomaly: zScore < -1.5, mean: Math.round(mean) }
    else
      rates = rates.map (r) -> Object.assign {}, r, { zScore: 0, isAnomaly: false, mean: r.passRate }

    res.json rates

router.post '/build-duration-history', (req, res, next) ->
  { product, type, limit = 20 } = req.body
  if !product or !type then return res.status(400).json({ error: 'product and type are required' })

  since = req.body.since || 90
  sinceDate = new Date(Date.now() - since * 24 * 60 * 60 * 1000)
  buildMatch = buildMatchFromBody(req.body, sinceDate)
  lim = parseInt(limit)

  Build.aggregate([
    { $match: buildMatch },
    { $sort: { start_time: -1 } },
    { $group: {
      _id: { product: '$product', type: '$type', team: '$team', version: '$version', browser: '$browser', device: '$device', platform: '$platform', platform_version: '$platform_version', stage: '$stage' },
      entries: { $push: { build: '$build', start_time: '$start_time', end_time: '$end_time' } }
    }},
    { $project: { entries: { $slice: ['$entries', lim] } } },
    { $unwind: { path: '$entries', includeArrayIndex: 'posIndex' } },
    { $group: {
      _id: { pos: '$posIndex', build: '$entries.build' },
      start_time: { $min: '$entries.start_time' },
      end_time: { $max: '$entries.end_time' },
      count: { $sum: 1 }
    }},
    { $sort: { '_id.pos': 1, count: -1 } },
    { $group: {
      _id: '$_id.pos',
      build: { $first: '$_id.build' },
      builds: { $push: '$_id.build' },
      configCount: { $sum: '$count' },
      start_time: { $first: '$start_time' },
      end_time: { $first: '$end_time' }
    }},
    { $sort: { _id: 1 } },
    { $limit: lim }
  ]).exec (err, builds) ->
    if err then return next(err)
    results = builds
      .filter (b) -> b.start_time and b.end_time
      .map (b) ->
        durationMs = new Date(b.end_time).getTime() - new Date(b.start_time).getTime()
        return null if durationMs <= 0
        { build: b.build, builds: b.builds, configCount: b.configCount, start_time: b.start_time, durationMs }
      .filter (b) -> b isnt null
    res.json results.reverse()  # chronological order

parseSinceDuration = (since) ->
  if !since then return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  if typeof since is 'string' and /^\d+d$/.test(since)
    days = parseInt(since)
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  if typeof since is 'number'
    return new Date(Date.now() - since * 24 * 60 * 60 * 1000)
  return new Date(since)

_topFailuresCache = {}
_unstableCache = {}
CACHE_TTL = 2 * 60 * 60 * 1000

router.post '/global-top-failures', (req, res, next) ->
  { since, limit = 10 } = req.body
  cacheKey = "#{since}:#{limit}"
  now = Date.now()
  if _topFailuresCache[cacheKey]?.data and now < _topFailuresCache[cacheKey].expires
    return res.json _topFailuresCache[cacheKey].data

  sinceDate = parseSinceDuration(since)
  lim = parseInt(limit)

  Build.find({ start_time: { $gte: sinceDate }, is_archive: false })
  .sort({ start_time: -1 }).limit(1000)
  .select('_id product type').lean().exec (err, builds) ->
    if err then return next(err)
    if builds.length is 0 then return res.json []

    buildMap = {}
    buildIds = builds.map (b) ->
      buildMap[b._id.toString()] = { product: b.product, type: b.type }
      b._id

    Test.aggregate([
      { $match: { build: { $in: buildIds }, status: 'FAIL', is_rerun: false } },
      { $group: {
        _id: '$uid',
        name: { $first: '$name' },
        failCount: { $sum: 1 },
        lastFailedAt: { $max: '$start_time' },
        lastBuild: { $last: '$build' }
      }},
      { $sort: { failCount: -1 } },
      { $limit: lim }
    ]).exec (err, results) ->
      if err then return next(err)

      data = results.map (r) ->
        lane = buildMap[r.lastBuild?.toString()] or {}
        {
          test_uid: r._id
          test_name: r.name
          product: lane.product or ''
          type: lane.type or ''
          fail_count: r.failCount
          last_failed: r.lastFailedAt
        }

      _topFailuresCache[cacheKey] = { data: data, expires: Date.now() + CACHE_TTL }
      res.json data

router.post '/global-unstable-count', (req, res, next) ->
  { since } = req.body
  cacheKey = since
  now = Date.now()
  if _unstableCache[cacheKey]?.data isnt undefined and now < _unstableCache[cacheKey].expires
    return res.json _unstableCache[cacheKey].data

  sinceDate = parseSinceDuration(since)

  Build.find({ start_time: { $gte: sinceDate }, is_archive: false })
  .sort({ start_time: -1 }).limit(1000)
  .select('_id').lean().exec (err, builds) ->
    if err then return next(err)
    if builds.length is 0
      result = { count: 0 }
      _unstableCache[cacheKey] = { data: result, expires: Date.now() + CACHE_TTL }
      return res.json result

    buildIds = builds.map (b) -> b._id

    Test.aggregate([
      { $match: { build: { $in: buildIds }, status: { $in: ['PASS', 'FAIL'] }, is_rerun: false } },
      { $group: { _id: '$uid', statuses: { $addToSet: '$status' } } },
      { $match: { statuses: { $all: ['PASS', 'FAIL'] } } },
      { $count: 'count' }
    ]).exec (err, results) ->
      if err then return next(err)
      result = { count: if results.length > 0 then results[0].count else 0 }
      _unstableCache[cacheKey] = { data: result, expires: Date.now() + CACHE_TTL }
      res.json result

module.exports = router
