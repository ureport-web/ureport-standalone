express = require('express')
router = express.Router()
QuarantinedTest = require('../models/quarantined_test')
ObjectId = require('mongoose').Types.ObjectId

# POST /filter — filter by product/type/is_active
router.post '/filter', (req, res, next) ->
  query = {}
  if req.body.product
    query.product = req.body.product
  if req.body.type
    query.type = req.body.type
  if req.body.is_active != undefined
    query.is_active = req.body.is_active

  QuarantinedTest.find(query).exec (err, docs) ->
    if err
      return next err
    res.json docs

# PUT /:id — manual resolve (set is_active: false, optionally is_exempt: true)
router.put '/:id', (req, res, next) ->
  update = { is_active: false, resolved_at: new Date() }
  update.is_exempt = true if req.body.is_exempt == true
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
  QuarantinedTest.findOneAndRemove({ _id: new ObjectId(req.params.id) }).exec (err, doc) ->
    if err
      return next err
    res.json doc

module.exports = router
