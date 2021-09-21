express = require('express')
router = express.Router()

v = require('../../version.json');
router.get '/version',  (req, res, next) ->
  generalInfo = JSON.parse(JSON.stringify(v));
  generalInfo['isDemo'] = process.env.UREPORT_IS_DEMO
  res.json(generalInfo)

module.exports = router
