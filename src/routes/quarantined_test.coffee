express = require('express')
router = express.Router()
QuarantinedTest = require('../models/quarantined_test')
ObjectId = require('mongoose').Types.ObjectId
registerAudit = require('../utils/register_audit')

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

# PUT /:id — manual resolve (set is_active: false, optionally is_exempt: true)
router.put '/:id', (req, res, next) ->
  registerAudit(req, res, 'QUARANTINE_RESOLVE', 'Resolve Quarantine', 'quarantine', { uid: req.params.id, product: 'SYSTEM', type: 'QUARANTINE' })
  update = { is_active: false, resolved_at: new Date() }
  update.is_exempt = true if req.body.is_exempt == true
  update.is_exempt = false if req.body.is_exempt == false
  QuarantinedTest.findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    update,
    { new: true },
    (err, doc) ->
      if err
        return next err
      if doc
        res.json doc
      else
        res.status(404).json { error: 'Not found' }
  )

# DELETE /:id — hard delete
router.delete '/:id', (req, res, next) ->
  registerAudit(req, res, 'RELEASE', 'Release Quarantine', 'quarantine', { uid: req.params.id, product: 'SYSTEM', type: 'QUARANTINE' })
  QuarantinedTest.findOneAndRemove({ _id: new ObjectId(req.params.id) }).exec (err, doc) ->
    if err
      return next err
    res.json doc

module.exports = router
