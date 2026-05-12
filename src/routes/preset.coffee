express = require('express')
router = express.Router()

Preset = require('../models/preset')
AccessControl = require('../utils/ac_grants')

component = 'setting'

validateLanes = (lanes) ->
  return 'At least one lane is required' unless lanes and lanes.length > 0
  firstProduct = lanes[0].product
  firstType    = lanes[0].type
  for lane in lanes
    if lane.product isnt firstProduct or lane.type isnt firstType
      return 'All lanes must share the same product and type'
  null

router.get '/', (req, res, next) ->
  Preset.find({}).sort({ name: 1 }).exec (err, presets) ->
    if err then return next(err)
    res.json presets

router.post '/', (req, res, next) ->
  if (!AccessControl.canAccessCreateAny(req.user.role, component))
    return res.status(403).json({ message: 'Admin access required' })
  error = validateLanes(req.body.lanes)
  if error
    return res.status(400).json({ message: error })
  preset = new Preset(req.body)
  preset.save (err, saved) ->
    if err
      if err.code is 11000
        return res.status(400).json({ message: 'A preset with that name already exists' })
      return next(err)
    res.status(201).json saved

router.put '/:id', (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role, component))
    return res.status(403).json({ message: 'Admin access required' })
  error = validateLanes(req.body.lanes)
  if error
    return res.status(400).json({ message: error })
  Preset.findById(req.params.id).exec (err, preset) ->
    if err then return next(err)
    unless preset
      return res.status(404).json({ message: 'Preset not found' })
    preset.name        = req.body.name        if req.body.name        isnt undefined
    preset.description = req.body.description if req.body.description isnt undefined
    preset.lanes       = req.body.lanes       if req.body.lanes       isnt undefined
    preset.save (err2, saved) ->
      if err2
        if err2.code is 11000
          return res.status(400).json({ message: 'A preset with that name already exists' })
        return next(err2)
      res.json saved

router.delete '/:id', (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role, component))
    return res.status(403).json({ message: 'Admin access required' })
  Preset.findByIdAndDelete(req.params.id).exec (err) ->
    if err then return next(err)
    res.json({ message: 'Deleted' })

module.exports = router
