express = require('express')
router = express.Router()

Build = require('../models/build')
Test = require('../models/test')

toMatch = (val) -> if Array.isArray(val) then { $in: val } else val

buildMatchFromBody = (body, sinceDate) ->
  { product, type, team, version, browser, device, platform, platform_version, stage } = body
  match = { product, type, start_time: { $gte: sinceDate } }
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

  buildMatch = buildMatchFromBody(req.body, new Date(0))
  delete buildMatch.start_time
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
      { build: b.build, start_time: b.start_time, passRate }

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

  buildMatch = buildMatchFromBody(req.body, new Date(0))
  delete buildMatch.start_time
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
      _id: '$posIndex',
      build: { $first: '$entries.build' },
      start_time: { $min: '$entries.start_time' },
      end_time: { $max: '$entries.end_time' }
    }},
    { $sort: { _id: 1 } },
    { $limit: lim }
  ]).exec (err, builds) ->
    if err then return next(err)
    results = builds
      .filter (b) -> b.start_time and b.end_time
      .map (b) ->
        durationMs = new Date(b.end_time).getTime() - new Date(b.start_time).getTime()
        { build: b.build, start_time: b.start_time, durationMs }
    res.json results.reverse()  # chronological order

module.exports = router
