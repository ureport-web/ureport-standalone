express = require('express')
router = express.Router()
User = require('../models/user')

AccessControl = require('../utils/ac_grants')
component = 'preference'
#create the login get and post routes
router.post '/update/dashboard', (req, res, next) ->
    if(!req.body.user)
        return res.status(400).json {error: "UserID is mandatory"}

    if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    User.updateDashboardSetting req.body.user, req.body, (user) ->
      if (!user)
        res.status(404)
        res.json {"error": "Cannot find User with id " + req.body.user}
      else
        user.save({ validateBeforeSave: false }, (err, rs) ->
            if err
                return next(err)
            rs['password'] = undefined
            res.json rs
        )

router.post '/update/report', (req, res, next) ->
    if(!req.body.user)
        res.status(400)
        return res.json {error: "userID is mandatory"}

    if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    User.updateReportSetting req.body.user, req.body, (user) ->
      if (!user)
        res.status(404)
        res.json {"error": "Cannot find User with id " + req.body.user}
      else
        user.save({ validateBeforeSave: false }, (err, rs) ->
            if err
                return next(err)
            rs['password'] = undefined
            res.json rs
        )

router.post '/update/language', (req, res, next) ->
    if(!req.body.user)
        return res.status(400).json {error: "UserID is mandatory"}

    if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    User.updateLanguage req.body.user, req.body, (user) ->
      if (!user)
        res.status(404)
        res.json {"error": "Cannot find User with id " + req.body.user}
      else
        user.save({ validateBeforeSave: false }, (err, rs) ->
            if err
                return next(err)
            rs['password'] = undefined
            res.json rs
        )

router.post '/update/theme', (req, res, next) ->
    if(!req.body.user)
        return res.status(400).json {error: "UserID is mandatory"}

    if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    User.updateTheme req.body.user, req.body, (user) ->
      if (!user)
        res.status(404)
        res.json {"error": "Cannot find User with id " + req.body.user}
      else
        user.save({ validateBeforeSave: false }, (err, rs) ->
            if err
                return next(err)
            rs['password'] = undefined
            res.json rs
        )
        # User.update( {_id: user._id},  { settting.theme: user.settings.theme}, (err, rs) ->
        #     if err
        #         return next(err)
        #     res.json rs
        # )

module.exports = router