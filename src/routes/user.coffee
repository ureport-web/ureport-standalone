express = require('express')
router = express.Router()

escapeRegex = (s) -> s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
bcrypt = require('bcrypt')
User = require('../models/user')
UserBilling = require('../models/userBilling')
{ getLicenseState } = require('../utils/license')

AccessControl = require('../utils/ac_grants')
registerAudit = require('../utils/register_audit')
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
        query.username = {'$regex': escapeRegex(req.body.filter)}
    if(req.body.status)
        query.status = req.body.status

    pagnition = {
        skip: size * page
    }

    if(req.body.sort)
        sort = req.body.sort
    else
        sort = {username: 'desc'}
    # invTest filter and condition
    User.find(query, { password:0, apiToken:0 }, pagnition)
    .limit(size)
    .sort(sort)
    .exec((err, users) ->
        if err
            return next(err)
        res.json users
    );

router.post '/total',  (req, res, next) ->
    if (!AccessControl.canAccessReadAny(req.user.role, component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    query = {}

    if(req.body.filter)
        query.username = {'$regex': escapeRegex(req.body.filter)}
    if(req.body.status)
        query.status = req.body.status
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

    regex = new RegExp(escapeRegex(req.body.username.trim()))
    User.find({
      username: { $regex: regex, $options: 'i' }
    }, { password:0, apiToken:0 }).
    exec((err, users) ->
        if(err)
            return next(err)
        res.json users
    );

# update user
router.put '/update/:username',  (req, res, next) ->
  if(!AccessControl.canAccessUpdateAny(req.user.role, component))
    if (!AccessControl.canAccessUpdateAnyIfOwnByName(req.user, req.params.username, component))
      return res.status(403).json({"error": "You don't have permission"})
  if(req.body.password)
    return res.status(400).json({"error": "Cannot update password through user update, please use /reset to update the password"})

  if(req.user.role !='admin' && req.body.role)
    return res.status(400).json({"error": "You are not admin, and you cannot update the role field."})
  if(req.body.role)
    registerAudit(req, res, 'USER_ROLE_CHANGE', 'User Role Changed', 'user', { uid: req.params.username, product: 'SYSTEM', type: 'USER' })

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

# Delete user
router.delete '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  registerAudit(req, res, 'USER_DELETE', 'Delete User', 'user', { uid: req.params.id, product: 'SYSTEM', type: 'USER' })
  User.deleteOne({_id: req.params.id}).
  exec((err, rs) ->
    if err
      return next(err)
    res.json rs
  );

# Get pending users
router.get '/pending',  (req, res, next) ->
  if (!AccessControl.canAccessReadAny(req.user.role, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  
  User.find({ status: 'pending' }, { password: 0, apiToken: 0 })
  .sort({ _id: -1 })
  .exec((err, users) ->
    if err
      return next(err)
    res.json users
  );

# Approve user
router.put '/approve/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  registerAudit(req, res, 'USER_APPROVE', 'Approve User', 'user', { uid: req.params.id, product: 'SYSTEM', type: 'USER' })

  User.findOne({_id: req.params.id}).exec (err, user) ->
    if err
      return next(err)
    if !user
      return res.status(404).json({ error: "User not found" })

    state = getLicenseState()
    if state.seats isnt null
      User.countDocuments({ status: 'active' }).exec (err, count) ->
        if err then return next(err)
        if count >= state.seats
          return res.status(403).json({ error: 'User seat limit reached', limit: state.seats })
        user.status = 'active'
        user.save (err, rs) ->
          if err then return next(err)
          rs.password = undefined
          rs.apiToken = undefined
          res.json rs
    else
      user.status = 'active'
      user.save (err, rs) ->
        if err
          return next(err)
        rs.password = undefined
        rs.apiToken = undefined
        res.json rs

# Reject user
router.put '/reject/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  registerAudit(req, res, 'USER_REJECT', 'Reject User', 'user', { uid: req.params.id, product: 'SYSTEM', type: 'USER' })

  User.findOne({_id: req.params.id}).exec (err, user) ->
    if err
      return next(err)
    if !user
      return res.status(404).json({ error: "User not found" })

    user.status = 'rejected'
    user.save (err, rs) ->
      if err
        return next(err)
      rs.password = undefined
      rs.apiToken = undefined
      res.json rs

# Admin reset password (no current password required)
router.put '/reset-password/:username', (req, res, next) ->
  if req.user.role isnt 'admin'
    return res.status(403).json({ error: 'Only admins can reset passwords' })
  registerAudit(req, res, 'PASSWORD_RESET', 'Admin Password Reset', 'user', { uid: req.params.username, product: 'SYSTEM', type: 'USER' })
  { newPassword } = req.body
  if !newPassword
    return res.status(400).json({ error: 'newPassword is required' })

  User.findOne({ username: req.params.username }).exec (err, user) ->
    if err
      return next(err)
    if !user
      return res.status(404).json({ error: 'User not found' })
    user.password = newPassword
    user.save (err) ->
      if err
        return next(err)
      res.json({ message: 'Password reset successfully' })

router.post '/change-password', (req, res, next) ->
  { currentPassword, newPassword } = req.body
  if !currentPassword || !newPassword
    return res.status(400).json({ error: 'currentPassword and newPassword are required' })

  User.findOne({ _id: req.user._id }).exec (err, user) ->
    if err
      return next(err)
    if !user
      return res.status(404).json({ error: 'User not found' })

    bcrypt.compare currentPassword, user.password, (err, isMatch) ->
      if err
        return next(err)
      if !isMatch
        return res.status(400).json({ error: 'Current password is incorrect' })

      user.password = newPassword
      user.save (err) ->
        if err
          return next(err)
        res.json({ message: 'Password updated successfully' })

module.exports = router