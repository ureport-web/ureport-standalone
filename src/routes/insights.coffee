# Insights: counts and timings over a period, one endpoint per area. Reads only, and everything is
# computed here from a plain read of the area's rows.
express = require('express')
router = express.Router()
QuarantinedTest = require('../models/quarantined_test')
QuarantineHistory = require('../models/quarantine_history')
InvestigatedTest = require('../models/investigated_test')
Assignment = require('../models/assignment')
User = require('../models/user')
logger = require('../utils/logger')
{ limitInsightsPeriod } = require('../utils/route_guards')
{ tzOffsetFromQuery } = require('../utils/insights_math')
{ computeQuarantineInsights } = require('../utils/quarantine_insights')
{ computeTriageInsights } = require('../utils/triage_insights')
{ computeAssignmentInsights } = require('../utils/assignment_insights')
{ computeOverlapInsights } = require('../utils/overlap_insights')

LIVE_FIELDS = 'uid product type scope rule_name is_active is_exempt cycle quarantined_at'
HISTORY_FIELDS = 'uid product type scope rule_name resolved_by cycle quarantined_at resolved_at'
# Not the failure or the comments: they are large and not counted
TRIAGE_FIELDS = 'uid product type user caused_by tracking.track_number create_at is_auto_triaged auto_triage_match_type configuration.ttl'
ASSIGNMENT_FIELDS = 'uid product type username state assign_at assigned_by_username'
OVERLAP_QUARANTINE_FIELDS = 'uid product type rule_name cycle quarantined_at'
OVERLAP_ASSIGNMENT_FIELDS = 'uid product type username assign_at'
OVERLAP_TRIAGE_FIELDS = 'uid product type caused_by create_at is_auto_triaged configuration.ttl'

# GET /quarantine?since&until&tz_offset&product&type
# since / until: ISO dates, default the week before now. A community licence may ask for 31 days at most.
# product / type narrow everything except `byLane`, which always lists every lane to compare.
router.get '/quarantine', limitInsightsPeriod, (req, res, next) ->
  { since, until: untilDate } = req.insightsPeriod
  # Every stay that ended in or after the period: that covers the ones that started or ended inside it, and the
  # later stays of the same tests, which "came back" is worked out from. (History rows exist only for stays
  # that have ended, so a stay that started in the period and has not ended is a live row.)
  QuarantinedTest.find({ $or: [{ is_active: true }, { is_exempt: true }] })
    .select(LIVE_FIELDS).limit(50000).lean().exec (liveErr, live) ->
      if liveErr
        logger.error '[insights] quarantine live read error', liveErr
        return next liveErr
      QuarantineHistory.find({ resolved_at: { $gte: since } })
        .select(HISTORY_FIELDS).limit(50000).lean().exec (histErr, history) ->
          if histErr
            logger.error '[insights] quarantine history read error', histErr
            return next histErr
          result = computeQuarantineInsights(live or [], history or [], {
            since: since
            until: untilDate
            tzOffsetMin: tzOffsetFromQuery(req.query)
            product: req.query.product
            type: req.query.type
          })
          res.json Object.assign({ period: { since: since, until: untilDate } }, result)

# GET /triage?since&until&tz_offset&product&type
# Triage rows have a creation date and no end, so this counts what was created in the period and what is
# on record now. Same period rules and filters as /quarantine.
router.get '/triage', limitInsightsPeriod, (req, res, next) ->
  { since, until: untilDate } = req.insightsPeriod
  InvestigatedTest.find({}).select(TRIAGE_FIELDS).limit(50000).lean().exec (err, docs) ->
    if err
      logger.error '[insights] triage read error', err
      return next err
    docs = docs or []
    # Names of the people who triaged in the period; the rows only hold their ids
    userIds = []
    seen = {}
    for d in docs when d.user? and not d.is_auto_triaged and d.create_at and since <= new Date(d.create_at) <= untilDate
      id = String(d.user)
      unless seen[id]
        seen[id] = true
        userIds.push id
    finish = (userNames) ->
      result = computeTriageInsights(docs, userNames, {
        since: since
        until: untilDate
        tzOffsetMin: tzOffsetFromQuery(req.query)
        product: req.query.product
        type: req.query.type
      })
      res.json Object.assign({ period: { since: since, until: untilDate } }, result)
    return finish({}) unless userIds.length
    User.find({ _id: { $in: userIds } }).select('username').lean().exec (uErr, users) ->
      # a missing name only costs the label, not the numbers
      logger.error '[insights] triage user read error', uErr if uErr
      names = {}
      names[String(u._id)] = u.username for u in (users or [])
      finish names

# GET /assignment?since&until&tz_offset&product&type
# Assignments have the day they were made and a state, but no date for when they were closed, so this counts
# what was assigned in the period, what is open now and for how long, and never how long one took to resolve.
router.get '/assignment', limitInsightsPeriod, (req, res, next) ->
  { since, until: untilDate } = req.insightsPeriod
  Assignment.find({}).select(ASSIGNMENT_FIELDS).limit(50000).lean().exec (err, docs) ->
    if err
      logger.error '[insights] assignment read error', err
      return next err
    result = computeAssignmentInsights(docs or [], {
      since: since
      until: untilDate
      tzOffsetMin: tzOffsetFromQuery(req.query)
      product: req.query.product
      type: req.query.type
    })
    res.json Object.assign({ period: { since: since, until: untilDate } }, result)

# GET /overlap?product&type
# Tests that several workflows hold at once: in quarantine, with an open assignment, with a triage in effect.
# A snapshot of now, so there is no period and no licence limit on one.
router.get '/overlap', (req, res, next) ->
  fail = (what) -> (err) ->
    logger.error "[insights] overlap #{what} read error", err
    next err
  QuarantinedTest.find({ is_active: true }).select(OVERLAP_QUARANTINE_FIELDS).limit(50000).lean().exec (qErr, quarantined) ->
    return fail('quarantine')(qErr) if qErr
    Assignment.find({ state: 'OPEN' }).select(OVERLAP_ASSIGNMENT_FIELDS).limit(50000).lean().exec (aErr, assignments) ->
      return fail('assignment')(aErr) if aErr
      InvestigatedTest.find({}).select(OVERLAP_TRIAGE_FIELDS).limit(50000).lean().exec (tErr, triages) ->
        return fail('triage')(tErr) if tErr
        res.json computeOverlapInsights(quarantined or [], assignments or [], triages or [], {
          product: req.query.product
          type: req.query.type
        })

module.exports = router
