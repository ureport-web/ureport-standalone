express = require('express')
router = express.Router()
moment = require('moment');

Template = require('../models/dashboard_template')
ObjectId = require('mongoose').Types.ObjectId;
async = require("async")

AccessControl = require('../utils/ac_grants')
component = 'dashboard_template'

router.get '/:id',  (req, res, next) ->
  Template.findOne({_id: req.params.id}).
  exec((err, rs) ->
    if(err)
      return next(err)

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Template with id " + req.params.id}
  );

# get all template
# router.get '/user/:userId',  (req, res, next) ->
#   Template.find({user: req.params.userId}).
#   exec((err, rs) ->
#     if(err)
#       return next(err)

#     if(rs)
#       res.json rs
#     else
#       res.status(404)
#       res.json {"error": "Cannot find Template with user " + req.params.userId}
#   );

router.get '/view/all',  (req, res, next) ->
  Template.find().
  exec((err, rs) ->
    if(err)
      return next(err)

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Dashboards with user " + req.params.userId}
  );

router.get '/view/public/all',  (req, res, next) ->
  # find all shared Template does not belongs to a user
  Template.find({is_public: true } ).
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
    return res.json {error: "UserID is mandatory@"}

  if(req.body._id != undefined)
    if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})
    condition = { _id: new ObjectId(req.body._id) }  
    Template.findOneAndUpdate(condition, req.body, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
      (err, rs) ->
        if err
          return next(err)
        res.json rs
    );
  else
    if (!AccessControl.canAccessCreateAny(req.user.role, component))
      return res.status(403).json({"error": "You don't have permission to perform this action!"})
    rs = new Template(req.body)
    rs.save((err, rs) ->
      if err
        return next(err)
      res.json rs
    );

# # Update dashboard
router.put '/:id',  (req, res, next) ->
  if(!req.body.user)
    res.status(400)
    return res.json {error: "UserID is mandatory"}

  if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})

  Template.findOne({_id: req.params.id}).
  exec((err, template) ->
    if err
      return next(err)

    if template
      #perform update
      Template.update(template, req.body)
      template.save (err, rs) ->
        if err
          return next(err)

        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Template with id " + req.params.id}
  );

# Delete Template
router.post '/:id',  (req, res, next) ->
  if(!req.body.user)
    res.status(400)
    return res.json {error: "UserID is mandatory"}

  if (!AccessControl.canAccessDeleteAnyIfOwn(req.user, req.body.user, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  Template.deleteOne({_id: req.params.id}).
  exec((err, rs) ->
    if err
      return next(err)
    res.json rs
  );

router.post '/widget/:id',  (req, res, next) ->
  if(!req.body.user)
    res.status(400)
    return res.json {error: " UserID is mandatory "}

  if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.body.user, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  Template.findOne({_id: req.params.id}).
  exec((err, template) ->
    if err
      return next(err)

    if template
      #perform update
      Template.addWidget(template, req.body)
      template.save (err, rs) ->
        if err
          return next(err)
        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find template with id " + req.params.id}
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
