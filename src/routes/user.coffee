express = require('express')
router = express.Router()
User = require('../models/user')
UserBilling = require('../models/userBilling')

AccessControl = require('../utils/ac_grants')
component = 'user'

router.post '/:page/:perPage',  (req, res, next) ->
    if (!AccessControl.canAccessReadAny(req.user.role,component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    if (!req.params.perPage)
        size = 10
    else if (req.params.perPage <= 0)
        size = 10
    else if (req.params.perPage > 50)
        size = 50
    else
        size = parseInt(req.params.perPage);

    page = parseInt(req.params.page)
    if (page < 0)
        response = { error: true, message: "invalid page number, should start with 0" };
        return res.json(response)

    query = {}
    if(req.body.filter)
        query.username = {'$regex': req.body.filter}

    pagnition = {
        skip: size * page
    }

    if(req.body.sort)
        sort = req.body.sort
    else
        sort = {username: 'desc'}
    # invTest filter and condition
    User.find(query, { password:0 }, pagnition)
    .limit(size)
    .sort(sort)
    .exec((err, users) ->
        if err
            return next(err)
        res.json users
    );

router.post '/total',  (req, res, next) ->
    query = {}

    if(req.body.filter)
        query.uid = {'$regex': req.body.filter}
    # invTest filter and condition
    User.find(query)
    .count()
    .exec((err, count) ->
        if err
            return next(err)
        res.json count
    );

#create the login get and post routes
router.post '/search', (req, res, next) ->
    if (!AccessControl.canAccessReadAny(req.user.role,component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    if(!req.body.username)
        res.status(400)
        return res.json {error: "Please provide a user name"}

    regex = new RegExp(req.body.username.trim())
    User.find({
      username: { $regex: regex, $options: 'i' }
    }, { password:0 }).
    exec((err, users) ->
        if(err)
            return next(err)
        res.json users
    );

router.post '/signup',  (req, res, next) ->
  if (!AccessControl.canAccessCreateAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  if req.body && !req.body.settings
    req.body.settings = {}

  User.findOne({
    username: req.body.username
  }).
  exec((err, user) ->
    if(err)
      return next(err)
    if(user)
      res.json { msg: "User [" + req.body.username + "] already exists!"}
    else
      user = new User(req.body)
      user.save((err, rs) ->
        if err
          return next(err)
        # save use for billing
        userBilling = new UserBilling(req.body, { _id: false })
        userBilling.save((error, disgard) ->
          if error
            return next(error)
          rs['password'] = undefined
          res.json rs
      )
    );
  );

# update
router.put '/update/:username',  (req, res, next) ->
  if(!AccessControl.canAccessUpdateAny(req.user.role, component))
    if (!AccessControl.canAccessUpdateAnyIfOwnByName(req.user, req.params.username, component))
      return res.status(403).json({"error": "You don't have permission"})
  if(req.body.password)
    return res.status(400).json({"error": "Cannot update password through user update, please use /reset to update the password"})
  
  if(req.user.role !='admin' && req.body.role)
    return res.status(400).json({"error": "You are not admin, and you cannot update the role field."})

  # in case user update username, we need to see if the new username exist or not in the system
  if(req.body.username && req.body.username != req.params.username)
    User.findOne({
      username: req.body.username
    }).exec((err, user) ->
      if(err)
        return next(err)
      if(user)
        return res.status(400).json({"error": "Cannot update username to "+ req.body.username+". It has been taken already! Please choose a different one."})
      else
        User.findOne({
        username: req.params.username
        }).
        exec((err, user) ->
            if(err)
              return next(err)
            if(user)
              User.updateOne(user, req.body)
              user.save (err, rs) ->
                if err
                  return next err
                res.json rs
        );
    );
  else
    User.findOne({
      username: req.params.username
    }).
    exec((err, user) ->
        if(err)
          return next(err)
        if(user)
          User.updateOne(user, req.body)
          user.save (err, rs) ->
            if err
              return next err
            res.json rs
        else
          return res.status(400).json({"error": "Cannot find username "+ req.params.username+" to update."})
    );

# Delete dashboard
router.delete '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  User.deleteOne({_id: req.params.id}).
  exec((err, rs) ->
    if err
      return next(err)
    res.json rs
  );

module.exports = router