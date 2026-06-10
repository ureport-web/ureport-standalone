express = require('express')
router = express.Router()
getSystemSetting = require('../utils/getSystemSetting')
{ getLicenseState, COMMUNITY_JWT } = require('../utils/license')
v = require('../../package.json');

router.get '/version', (req, res, next) ->
  getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
    generalInfo = JSON.parse(JSON.stringify(v))
    generalInfo['isDemo'] = process.env.UREPORT_IS_DEMO
    generalInfo['smtpConfigured'] = !!(setting?.notification?.email?.user and setting?.notification?.email?.password)
    state = getLicenseState()
    generalInfo['licenseToken'] = setting?.license_key or COMMUNITY_JWT
    generalInfo['license'] =
      valid:       state.valid
      licensee:    state.licensee
      seats:       state.seats
      lanes:       state.lanes
      dashboards:  state.dashboards
      plan:        state.plan
      features:    state.features
      expiresAt:   if state.expiresAt then state.expiresAt.toISOString() else null
      isCommunity: state.isCommunity
    res.json(generalInfo)

module.exports = router
