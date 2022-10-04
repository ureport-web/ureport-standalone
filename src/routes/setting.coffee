express = require('express')
router = express.Router()
moment = require('moment');

Setting = require('../models/setting')
ObjectId = require('mongoose').Types.ObjectId;
async = require("async")

AccessControl = require('../utils/ac_grants')
component = 'setting'

router.get '/:id',  (req, res, next) ->
  Setting.findOne({_id: req.params.id}).
  exec((err, setting) ->
    if(err)
      next err

    if(setting)
      res.json setting
    else
      res.status(404)
      res.json {"error": "Cannot find setting with id " + req.params.id}
  );

router.get '/find/all',  (req, res, next) ->
  Setting.find({}).
  exec((err, settings) ->
    if(err)
      return next(err)
    res.json settings
  );

router.post '/',  (req, res, next) ->
  if (!AccessControl.canAccessCreateAny(req.user.role,component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})
  setting = new Setting(req.body)
  setting.save((err, setting) ->
    if err
      if (err.name == 'MongoError' && err.code == 11000)
        return res.status(400).send({
          message: 'A setting already exists with the Product and Test Type'
        });
        # return next(new Error('A setting already exists with the Product and Test Type'))
      else
        return next(err)

    res.json setting
  )

router.put '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})
  Setting.findOne({_id: req.params.id}).
  exec((err, setting) ->
    if err
      return next(err)

    if setting
      #perform update
      Setting.update(setting, req.body)
      setting.save (err, results) ->
        if err
          return next(err)
        res.json setting
    else
      res.status(404)
      res.json {"error": "Cannot find setting with id " + req.params.id}
  );

router.delete '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role,component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})
  Setting.deleteOne({_id: req.params.id}).
  exec((err, setting) ->
    if err
      return next(err)
    res.json setting
  );

router.post '/filter',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}
  conditions = []
  conditions.push({ product : req.body.product })
  conditions.push({ type : req.body.type })
  query = {
      $and : conditions
  }
  Setting.find(query).
  limit(1).
  exec((err, cases) ->
    if(err)
      return next(err)
    res.json cases
  );

router.post '/share/with',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}
  
  conditions = []
  conditions.push({ "share_with.product" : req.body.product })
  conditions.push({ "share_with.type" : req.body.type })
  query = {
    $and : conditions
  }
  Setting.aggregate().
  match({ $and : conditions }).
  limit(1).
  exec((err, cases) ->
    if(err)
      return next(err)
    res.json cases
  );
module.exports = router
