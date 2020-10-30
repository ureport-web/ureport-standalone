express = require('express')
request = require('request');
router = express.Router()
DependencyRelation = require('../models/dependency_relation')

AccessControl = require('../utils/ac_grants')
component = 'dependency'

router.post '/dependingOn',  (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  
  request 'https://dev-fender-api-crystal-main.scaffold-workers-test-us.dev.cld.touchtunes.com/v1/components/dependenciesOf/' + req.body.key + "?depth=2", (error, response, body) ->
    if !error and response.statusCode == 200
      res.json response.body
      # Show the HTML for the Google homepage. 
    return

module.exports = router