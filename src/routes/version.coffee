express = require('express')
router = express.Router()
getSystemSetting = require('../utils/getSystemSetting')
v = require('../../version.json');

router.get '/version', (req, res, next) ->
  getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
    generalInfo = JSON.parse(JSON.stringify(v))
    generalInfo['isDemo'] = process.env.UREPORT_IS_DEMO
    generalInfo['smtpConfigured'] = !!(setting?.notification?.email?.user and setting?.notification?.email?.password)
    res.json(generalInfo)

module.exports = router
