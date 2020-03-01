express = require('express')
router = express.Router()
moment = require('moment');

SystemSetting = require('../models/system_setting')
getSystemSetting = require('../utils/getSystemSetting')

ObjectId = require('mongoose').Types.ObjectId;
async = require("async")

router.get '/test',  (req, res, next) ->
  getSystemSetting(req,"SYSTEM_SETTING", false,
  (rs) ->
    res.json {error: "No setting found"} if !rs
    res.json rs
  )

router.get '/:name',  (req, res, next) ->
  if(!req.params.name)
    res.status(400)
    res.json {error: "Setting name is required"}
  key = req.params.name

  req.app.locals.systemSettingCache.get(key)
  .then( (crs) ->
    if crs.err
      return next(err)
    if crs.value[key] == undefined || req.query.isforce == 'true'
      SystemSetting.findOne({name: key}).
      exec((err, systemSetting) ->
        if(err)
          return next err

        if(systemSetting)
          req.app.locals.systemSettingCache.set(key, systemSetting)
          .then( (result) ->
              return next(result.err) if result.err
              res.json systemSetting
          )
        else
          res.status(404)
          res.json {"error": "Cannot find System Setting with name " + key}
      );
    else
      req.app.locals.systemSettingCache.getStats()
      .then( (rs) ->
          return next(rs.err) if rs.err
          res.json crs.value[key]
      )
  )

router.put '/:id',  (req, res, next) ->
  SystemSetting.findOne({_id: req.params.id}).
  exec((err, systemSetting) ->
    if err
      return next(err)

    if systemSetting
      #perform update
      SystemSetting.updateSetting(systemSetting, req.body)
      systemSetting.save (err, results) ->
        if err
          next err
        req.app.locals.systemSettingCache.set(systemSetting.name, systemSetting)
        .then( (result) ->
            return next(result.err) if result.err
            res.json systemSetting
        )
    else
      res.status(404)
      res.json {"error": "Cannot find System Setting with id " + req.params.id}
  );

module.exports = router
