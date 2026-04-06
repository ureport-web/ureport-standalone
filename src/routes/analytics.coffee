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

module.exports = router
