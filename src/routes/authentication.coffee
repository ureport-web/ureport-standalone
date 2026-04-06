express = require('express')
router = express.Router()
User = require('../models/user')
passport = require('passport')
async = require('async');
crypto = require('crypto');
signature = require('cookie-signature');

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
    
    # Validate required fields
    if !username || !email || !password
        return res.status(400).json({ message: 'Username, email, and password are required' })
    
    # Create new user with pending status
    newUser = new User({
        username: username,
        displayname: displayname || username,
        email: email,
        password: password,
        role: 'viewer',
        status: 'pending'
    })
    
    newUser.save (err) ->
        if err
            if err.code == 11000
                return res.status(400).json({ message: 'Username already exists' })
            return res.status(500).json({ message: err.message || 'Error creating user' })
        
        res.json({ 
            message: 'Account created successfully. Waiting for admin approval.',
            userId: newUser._id 
        })

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