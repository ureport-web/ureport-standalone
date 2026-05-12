express = require('express')
router = express.Router()
moment = require('moment');

SystemSetting = require('../models/system_setting')
getSystemSetting = require('../utils/getSystemSetting')

ObjectId = require('mongoose').Types.ObjectId;
async = require("async")
AccessControl = require('../utils/ac_grants')
component = 'setting'

MASKED = '••••'

maskCredentials = (setting) ->
  obj = setting.toObject?() or setting
  if obj.ai
    obj.ai = Object.assign({}, obj.ai)
    if obj.ai.api_key               then obj.ai.api_key               = MASKED
    if obj.ai.aws_access_key_id     then obj.ai.aws_access_key_id     = MASKED
    if obj.ai.aws_secret_access_key then obj.ai.aws_secret_access_key = MASKED
    if obj.ai.aws_session_token     then obj.ai.aws_session_token     = MASKED
  if obj.notification?.email?.password
    obj.notification = JSON.parse(JSON.stringify(obj.notification))
    obj.notification.email.password = MASKED
  obj

guardCredentials = (body, existing) ->
  if body.ai
    if !body.ai.api_key or body.ai.api_key is MASKED
      body.ai.api_key = existing?.ai?.api_key or ''
    if !body.ai.aws_access_key_id or body.ai.aws_access_key_id is MASKED
      body.ai.aws_access_key_id = existing?.ai?.aws_access_key_id or ''
    if !body.ai.aws_secret_access_key or body.ai.aws_secret_access_key is MASKED
      body.ai.aws_secret_access_key = existing?.ai?.aws_secret_access_key or ''
    if !body.ai.aws_session_token or body.ai.aws_session_token is MASKED
      body.ai.aws_session_token = existing?.ai?.aws_session_token or ''
  if body.notification?.email
    if !body.notification.email.password or body.notification.email.password is MASKED
      body.notification.email.password = existing?.notification?.email?.password or ''
  body

router.get '/:name',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
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
              res.json maskCredentials(systemSetting)
          )
        else
          if(key != 'SYSTEM_SETTING')
            res.status(404)
            res.json {"error": "Cannot find System Setting with name " + key}
          else
            res.json {"error": "Cannot find System Setting with name " + key}
      );
    else
      req.app.locals.systemSettingCache.getStats()
      .then( (rs) ->
          return next(rs.err) if rs.err
          res.json maskCredentials(crs.value[key])
      )
  )

router.put '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  SystemSetting.findOne({_id: req.params.id}).
  exec((err, systemSetting) ->
    if err
      return next(err)

    if systemSetting
      guardCredentials(req.body, systemSetting)
      #perform update
      SystemSetting.updateSetting(systemSetting, req.body)
      systemSetting.save (err, results) ->
        if err
          next err
        req.app.locals.systemSettingCache.set(systemSetting.name, systemSetting)
        .then( (result) ->
            return next(result.err) if result.err
            res.json maskCredentials(systemSetting)
        )
    else
      res.status(404)
      res.json {"error": "Cannot find System Setting with id " + req.params.id}
  );

router.post '/',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  SystemSetting.findOne({name: 'SYSTEM_SETTING'}).exec (err, existing) ->
    if err
      return next(err)
    guardCredentials(req.body, existing)
    SystemSetting.findOneAndUpdate({name: 'SYSTEM_SETTING'}, req.body,
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }, (err, systemSetting) ->
        if err
          return next(err)

        req.app.locals.systemSettingCache.set(systemSetting.name, systemSetting)
        .then( (result) ->
            return next(result.err) if result.err
            res.json maskCredentials(systemSetting)
        )
    )

module.exports = router
