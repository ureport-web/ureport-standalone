express = require('express')
router = express.Router()
QuarantinedTest = require('../models/quarantined_test')
QuarantineHistory = require('../models/quarantine_history')
ObjectId = require('mongoose').Types.ObjectId
registerAudit = require('../utils/register_audit')
logger = require('../utils/logger')
{ extrasToKey } = require('../utils/quarantine_evaluator')

SCOPE_FIELDS = ['version', 'team', 'browser', 'device', 'platform', 'platform_version', 'stage']

# Build a MongoDB query for scope matching.
# An empty string in the stored record means "wildcard — match any build value".
# For each field: if the build has a value, match records with that value OR empty (broad rule).
# If the build has no value for a field, match only records with empty (avoids false matches).
applyScopeQuery = (query, buildScope) ->
  SCOPE_FIELDS.forEach (f) ->
    raw = buildScope[f]
    vals = if Array.isArray(raw) then raw.filter((v) -> v) else if raw then [raw] else []
    if vals.length > 0
      query['scope.' + f] = { $in: [''].concat(vals) }
    else
      query['scope.' + f] = ''
  rawKey = buildScope.extras_key
  if Array.isArray(rawKey)
    extraKeys = rawKey.filter((k) -> k)
  else if rawKey
    extraKeys = [rawKey]
  else
    k = extrasToKey(buildScope.extras or {})
    extraKeys = if k then [k] else []
  if extraKeys.length > 0
    query['scope.extras_key'] = { $in: [''].concat(extraKeys) }
  else
    query['scope.extras_key'] = ''

# GET / — return uid array, filter by product/type/is_active/scope query params
router.get '/', (req, res, next) ->
  query = {}
  if req.query.product
    query.product = req.query.product
  if req.query.type
    query.type = req.query.type
  if req.query.is_active != undefined
    query.is_active = req.query.is_active == 'true'
  if req.query.scope
    try
      applyScopeQuery(query, JSON.parse(req.query.scope))
    catch e
      return res.status(400).json { error: 'Invalid scope JSON' }

  QuarantinedTest.find(query).select('uid').exec (err, docs) ->
    if err
      return next err
    res.json { quarantine: docs.map (d) -> d.uid }

# POST /filter — filter by product/type/is_active/scope
router.post '/filter', (req, res, next) ->
  query = {}
  if req.body.product
    query.product = req.body.product
  if req.body.type
    query.type = req.body.type
  if req.body.is_active != undefined
    query.is_active = req.body.is_active
  if req.body.scope
    applyScopeQuery(query, req.body.scope)

  QuarantinedTest.find(query).exec (err, docs) ->
    if err
      return next err
    res.json docs

# GET /history/:uid — quarantine cycle history for a test uid
router.get '/history/:uid', (req, res, next) ->
  query = { uid: req.params.uid }
  query.product = req.query.product if req.query.product
  query.type = req.query.type if req.query.type
  QuarantineHistory.find(query).sort({ quarantined_at: -1 }).exec (err, docs) ->
    if err
      return next err
    res.json docs

# PUT /:id — manual resolve (set is_active: false, optionally is_exempt: true)
router.put '/:id', (req, res, next) ->
  registerAudit(req, res, 'QUARANTINE_RESOLVE', 'Resolve Quarantine', 'quarantine', { uid: req.params.id, product: 'SYSTEM', type: 'QUARANTINE' })
  resolvedAt = new Date()
  update = { is_active: false, resolved_at: resolvedAt }
  update.is_exempt = true if req.body.is_exempt == true
  update.is_exempt = false if req.body.is_exempt == false
  resolvedBy = if req.body.is_exempt == true then 'exempt' else 'manual'
  QuarantinedTest.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    update,
    { new: false },
    (err, oldDoc) ->
      if err
        return next err
      unless oldDoc
        return res.status(404).json { error: 'Not found' }
      QuarantineHistory.create({
        uid:            oldDoc.uid,
        product:        oldDoc.product,
        type:           oldDoc.type,
        scope:          oldDoc.scope,
        rule_id:        oldDoc.rule_id,
        rule_name:      oldDoc.rule_name,
        triggered_mode: oldDoc.triggered_mode,
        fail_snapshot:  oldDoc.fail_snapshot,
        build_snapshot: oldDoc.build_snapshot,
        quarantined_at: oldDoc.quarantined_at,
        resolved_at:    resolvedAt,
        resolved_by:    resolvedBy,
        cycle:          oldDoc.cycle or 1
      }, (hErr) ->
        if hErr
          logger.error '[quarantine] history create error', hErr
      )
      updatedDoc = Object.assign(oldDoc.toObject(), update)
      res.json updatedDoc
  )

# DELETE / — bulk hard delete by ids array
router.delete '/', (req, res, next) ->
  ids = req.body?.ids
  unless Array.isArray(ids) and ids.length > 0
    return res.status(400).json { error: 'ids array required' }
  objectIds = ids.map (id) -> new ObjectId(id)
  QuarantinedTest.deleteMany({ _id: { $in: objectIds } }).exec (err, result) ->
    if err
      return next err
    res.json { deleted: result.deletedCount }

# DELETE /:id — hard delete
router.delete '/:id', (req, res, next) ->
  registerAudit(req, res, 'RELEASE', 'Release Quarantine', 'quarantine', { uid: req.params.id, product: 'SYSTEM', type: 'QUARANTINE' })
  QuarantinedTest.findOneAndRemove({ _id: new ObjectId(req.params.id) }).exec (err, doc) ->
    if err
      return next err
    res.json doc

module.exports = router
