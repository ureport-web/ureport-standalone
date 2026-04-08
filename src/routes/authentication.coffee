express = require('express')
router = express.Router()
User = require('../models/user')
passport = require('passport')
async = require('async');
crypto = require('crypto');
signature = require('cookie-signature');
getSystemSetting = require('../utils/getSystemSetting')
sendConfirmationEmail = require('../utils/send_confirmation_email')

router.post '/login', (req, res, next) -> 
    passport.authenticate('local', (err, user, info) -> 
        if (info)
            return next(info)
        if (err)
            return next(err)
        if (!user)
            return res.redirect('/login')
        # Check user status
        if user.status != 'active'
            return res.status(403).json({ message: 'Account not active. Please contact administrator.' })
        req.login user, (err) -> 
            if (err) 
                return next(err)
            # Sign the session ID with the same secret used by express-session
            signedSessionId = 's:' + signature.sign(req.sessionID, 'uReport')
            return res.json({
                session: req.session,
                sessionId: signedSessionId
            })
    )(req, res, next);

router.post '/signup', (req, res, next) ->
    { username, displayname, email, password } = req.body

    if !username || !email || !password
        return res.status(400).json({ message: 'Username, email, and password are required' })

    isAdminCreating = req.isAuthenticated() && req.user?.role == 'admin' && req.body.adminCreated == true

    getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
        newUser = new User({
            username: username,
            displayname: displayname || username,
            email: email,
            password: password,
            role: if isAdminCreating then (req.body.role || 'viewer') else 'viewer',
            status: if isAdminCreating then 'active' else 'pending'
        })

        hasEmailConfig = setting?.notification?.email?.user && setting?.notification?.email?.password

        if hasEmailConfig && !isAdminCreating
            confirmToken = crypto.randomBytes(32).toString('hex')
            newUser.confirmationToken = confirmToken
            newUser.confirmationTokenExpires = new Date(Date.now() + 24 * 3600000)

        newUser.save (err) ->
            if err
                if err.code == 11000
                    return res.status(400).json({ message: 'Username already exists' })
                return res.status(500).json({ message: err.message || 'Error creating user' })

            if hasEmailConfig && !isAdminCreating
                sendConfirmationEmail(req, newUser, confirmToken)
                res.json({
                    message: 'Please check your email to confirm your account.',
                    requiresEmailConfirmation: true
                })
            else if isAdminCreating
                res.json({
                    message: 'User created successfully.',
                    requiresEmailConfirmation: false
                })
            else
                res.json({
                    message: 'Account created. Waiting for admin approval.',
                    requiresEmailConfirmation: false
                })

router.get '/confirm-email/:token', (req, res, next) ->
    User.findOne({
        confirmationToken: req.params.token,
        confirmationTokenExpires: { $gt: Date.now() }
    }).exec (err, user) ->
        if err then return next(err)
        if !user then return res.status(400).json({ message: 'Invalid or expired confirmation token.' })
        user.status = 'active'
        user.confirmationToken = undefined
        user.confirmationTokenExpires = undefined
        user.save (err) ->
            if err then return next(err)
            res.json({ message: 'Email confirmed! You can now log in.' })

router.post '/logout', (req, res, next) ->
    req.logout()
    res.json { msg:  'You are log out'}

router.post '/token', (req, res, next) ->
  if !req.isAuthenticated()
    return res.status(401).json({ message: 'Login required to generate a token.' })
  token = crypto.randomBytes(32).toString('hex')
  User.findOne({_id: req.user._id}).exec (err, user) ->
    if err
      return next(err)
    if !user
      return res.status(404).json({ message: 'User not found.' })
    user.apiToken = token
    user.save (err) ->
      if err
        return next(err)
      res.json({ apiToken: token })

router.delete '/token', (req, res, next) ->
  if !req.isAuthenticated()
    return res.status(401).json({ message: 'Login required.' })
  User.findOne({_id: req.user._id}).exec (err, user) ->
    if err
      return next(err)
    if !user
      return res.status(404).json({ message: 'User not found.' })
    user.apiToken = undefined
    user.save (err) ->
      if err
        return next(err)
      res.json({ message: 'API token revoked.' })

router.post '/forgot', (req, res, next) ->
    async.waterfall [
        (done) ->
            crypto.randomBytes 20, (err, buf) ->
                token = buf.toString('hex')
                done(err, token)
        (token, done) ->
            User.findOne { email: req.body.email }, (err, user) ->
                if !user
                    res.json { "msg": 'No account with that email address exists.' }
                user.resetPasswordToken = token
                user.resetPasswordExpires = Date.now() + 3600000
                # 1 hour
                user.save (err) ->
                    done(err, token, user)
        (token, user, done) ->
            done(null, {
                token : token
            })
        ], (err, data) ->
            if err
                return next(err)
            res.json { success: true, token: data.token }

router.get '/reset/:token', (req, res, next) ->
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: $gt: Date.now()
    })
    .exec((err, user) ->
        return next(err) if err
        if !user
            res.json { "msg": 'Password reset token is invalid or has expired.'}
        res.json { success: true, user: user }
    );

router.post '/reset/:token', (req, res, next) ->
    async.waterfall [
        (done) ->
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: $gt: Date.now()
            })
            .exec((err, user) ->
                return next(err) if err
                if !user
                    res.json { success: false, msg: 'Password reset token is invalid or has expired.'}
                
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save (err) ->
                    req.logIn user, (err) ->
                        done(err, user)
            );
        (user, done) ->
            done(null, {
                user : user
            })
        ], (err, data) ->
            if err
                return next(err)
            res.json { success: true, msg: 'Reset now at ' + data.link }

module.exports = router