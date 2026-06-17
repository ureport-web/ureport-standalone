express = require('express')
router = express.Router()
User = require('../models/user')
passport = require('passport')
async = require('async');
crypto = require('crypto');
signature = require('cookie-signature');
nodemailer = require('nodemailer')
mongoose = require('mongoose')
getSystemSetting = require('../utils/getSystemSetting')
sendConfirmationEmail = require('../utils/send_confirmation_email')
logger = require('../utils/logger')
{ getLicenseState } = require('../utils/license')
Audit = require('../models/audit')

createAuthAudit = (req, audit_type, action, username) ->
    ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() or req.ip or ""
    audit = new Audit({
        audit_type: audit_type,
        action: action,
        uid: username or "",
        product: 'SYSTEM',
        type: 'AUTH',
        username: username or "",
        entity_type: 'auth',
        ip: ip
    })
    audit.save (err) ->
        return

router.post '/login', (req, res, next) ->
    passport.authenticate('local', (err, user, info) ->
        if (err)
            return next(err)
        if (!user)
            createAuthAudit(req, 'LOGIN_FAIL', 'Login Failed', req.body.username)
            return res.status(401).json({ message: 'Invalid username or password' })
        # Check user status
        if user.status != 'active'
            createAuthAudit(req, 'LOGIN_FAIL', 'Login Failed - Account Inactive', user.username)
            return res.status(403).json({ message: 'Account not active. Please contact administrator.' })
        # Terminate all existing sessions for this user
        sessionColl = mongoose.connection.db.collection('sessions')
        userIdStr = user._id.toString()
        sessionColl.find({ session: { $regex: userIdStr } }).toArray (findErr, docs) ->
            updates = (docs or []).map (doc) ->
                try
                    data = JSON.parse(doc.session)
                    data.terminated = true
                    sessionColl.updateOne({ _id: doc._id }, { $set: { session: JSON.stringify(data) } })
                catch e
                    Promise.resolve()
            Promise.all(updates).then ->
                req.session.regenerate (err) ->
                    if (err)
                        return next(err)
                    req.login user, (err) ->
                        if (err)
                            return next(err)
                        createAuthAudit(req, 'LOGIN', 'Login Success', user.username)
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

        saveUser = ->
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

        if isAdminCreating
            state = getLicenseState()
            if state.seats isnt null
                User.countDocuments({ status: 'active' }).exec (err, count) ->
                    if err then return next(err)
                    if count >= state.seats
                        return res.status(403).json({ error: 'User seat limit reached', limit: state.seats })
                    saveUser()
            else
                saveUser()
        else
            saveUser()

router.get '/confirm-email/:token', (req, res, next) ->
    User.findOne({
        confirmationToken: req.params.token,
        confirmationTokenExpires: { $gt: Date.now() }
    }).exec (err, user) ->
        if err then return next(err)
        if !user then return res.status(400).json({ message: 'Invalid or expired confirmation token.' })

        state = getLicenseState()
        activateUser = ->
            user.status = 'active'
            user.confirmationToken = undefined
            user.confirmationTokenExpires = undefined
            user.save (err) ->
                if err then return next(err)
                res.json({ message: 'Email confirmed! You can now log in.' })

        if state.seats isnt null
            User.countDocuments({ status: 'active' }).exec (err, count) ->
                if err then return next(err)
                if count >= state.seats
                    return res.status(403).json({ message: 'Seat limit reached. Please contact your administrator.' })
                activateUser()
        else
            activateUser()

router.post '/logout', (req, res, next) ->
    username = if req.user then req.user.username else ""
    createAuthAudit(req, 'LOGOUT', 'Logout', username)
    req.logout()
    req.session.destroy (err) ->
        res.json { msg: 'You are log out' }

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
            identifier = req.body.identifier or ''
            query = if identifier.indexOf('@') >= 0 then { email: identifier } else { username: identifier }
            User.findOne query, (err, user) ->
                if !user
                    return res.json { msg: 'No account with that email or username exists.' }
                user.resetPasswordToken = token
                user.resetPasswordExpires = Date.now() + 3600000
                user.save (err) ->
                    done(err, token, user)
        (token, user, done) ->
            getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
                if !setting?.notification?.email?.user or !setting?.notification?.email?.password
                    logger.info("Email not configured, skipping password reset email")
                    return done(null)
                sender = setting.notification.email.user
                baseUrl = setting.notification.url or (req.protocol + '://' + req.get('host'))
                resetUrl = baseUrl + '/reset-password/' + token
                transporter = nodemailer.createTransport(
                    service: 'Gmail'
                    auth:
                        user: sender
                        pass: setting.notification.email.password
                )
                mailOptions =
                    from: sender
                    to: user.email
                    subject: 'UReport: Password Reset Request'
                    text: 'Click the link to reset your password: ' + resetUrl
                    html: '<p>You requested a password reset. Click below to set a new password (link expires in 1 hour):</p><p><a href="' + resetUrl + '">Reset Password</a></p><p>If you did not request this, ignore this email.</p>'
                transporter.sendMail mailOptions, (err, info) ->
                    if err then logger.error err
                    done(null)
        ], (err) ->
            if err
                return next(err)
            res.json { success: true }

router.get '/reset/:token', (req, res, next) ->
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }).exec (err, user) ->
        return next(err) if err
        if !user
            return res.json { valid: false, msg: 'Password reset token is invalid or has expired.' }
        res.json { valid: true, username: user.username }

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
                    return res.json { success: false, msg: 'Password reset token is invalid or has expired.'}
                
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
            res.json { success: true, msg: 'Password has been reset.' }

module.exports = router