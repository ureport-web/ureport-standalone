SystemSetting = require('../models/system_setting')

module.exports = (req, key, isForced, callback) ->
  if(req.app.locals.systemSettingCache == undefined)
    callback undefined

  req.app.locals.systemSettingCache.get(key)
  .then( (crs) ->
    if crs.err
      callback undefined
    if crs.value[key] == undefined || isForced == true
      SystemSetting.findOne({name: key}).
      exec((err, systemSetting) ->
        if(err)
          callback undefined

        if(systemSetting)
          req.app.locals.systemSettingCache.set(key, systemSetting)
          .then( (result) ->
              callback undefined if result.err
              callback systemSetting
          )
        else
          callback undefined
      );
    else
      req.app.locals.systemSettingCache.getStats()
      .then( (rs) ->
          callback undefined if rs.err
          callback crs.value[key]
      )
  )