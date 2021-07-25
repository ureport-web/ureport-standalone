express = require('express')
router = express.Router()
moment = require('moment');

Dashboard = require('../models/dashboard')
ObjectId = require('mongoose').Types.ObjectId;
async = require("async")

AccessControl = require('../utils/ac_grants')
component = 'dashboard'

router.get '/:id',  (req, res, next) ->
  Dashboard.findOne({_id: req.params.id}).
  exec((err, rs) ->
    if(err)
      return next(err)

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Dashboard with id " + req.params.id}
  );

router.get '/byUser/:userId',  (req, res, next) ->
  Dashboard.find({user: req.params.userId}).
  exec((err, rs) ->
    if(err)
      return next(err)

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Dashboards with user " + req.params.userId}
  );

router.get '/shared/:userId',  (req, res, next) ->
  # find all shared dashboard dashboard does not belongs to a user
  Dashboard.find({is_public: true, user: { $ne: req.params.userId } } ).
  exec((err, rs) ->
    if(err)
      return next(err)

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Dashboards with user " + req.params.userId}
  );

# Create/update dashboard
router.post '/',  (req, res, next) ->
  if(!req.body.user)
    res.status(400)
    return res.json {error: " UserID is mandatory "}

  if (!AccessControl.canAccessCreateAnyIfOwn(req.user, req.body.user, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  if(req.body._id != undefined)
    condition = { _id: new ObjectId(req.body._id) }  
    Dashboard.findOneAndUpdate(condition, req.body, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      (err, rs) ->
        if err
          return next(err)
        res.json rs
    );
  else
    dashboard = new Dashboard(req.body)
    dashboard.save((err, rs) ->
      if err
        return next(err)
      res.json rs
    );

# Update dashboard
router.put '/:id',  (req, res, next) ->
  if(!req.body.user)
    res.status(400)
    return res.json {error: "UserID is mandatory"}

  if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})

  Dashboard.findOne({_id: req.params.id}).
  exec((err, dashboard) ->
    if err
      return next(err)

    if dashboard
      #perform update
      Dashboard.update(dashboard, req.body)
      dashboard.save (err, rs) ->
        if err
          return next(err)

        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Dashboard with id " + req.params.id}
  );

# Delete dashboard
router.post '/:id',  (req, res, next) ->
  if(!req.body.user)
    res.status(400)
    return res.json {error: "UserID is mandatory"}

  if (!AccessControl.canAccessDeleteAnyIfOwn(req.user, req.body.user, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  Dashboard.deleteOne({_id: req.params.id}).
  exec((err, rs) ->
    if err
      return next(err)
    res.json rs
  );

router.post '/widget/:id',  (req, res, next) ->
  if(!req.body.user)
    res.status(400)
    return res.json {error: "UserID is mandatory"}

  if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  Dashboard.findOne({_id: req.params.id}).
  exec((err, dashboard) ->
    if err
      return next(err)

    if dashboard
      #perform update
      Dashboard.addWidget(dashboard, req.body)
      dashboard.save (err, rs) ->
        if err
          return next(err)
        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find dashboard with id " + req.params.id}
  );

# router.post '/comment/:id',  (req, res, next) ->
#   Dashboard.findOne({_id: req.params.id}).
#   exec((err, dashboard) ->
#     if err
#       return next(err)

#     if dashboard
#       Dashboard.addComment(dashboard, req.body)
#       dashboard.save (err, rs) ->
#         if err
#           return next(err)
#         res.json rs
#     else
#       res.status(404)
#       res.json {"error": "Cannot find Dashboard with id " + req.params.id}
#   );

module.exports = router
