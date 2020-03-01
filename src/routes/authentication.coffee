express = require('express')
router = express.Router()
User = require('../models/user')
passport = require('passport')
async = require('async');
crypto = require('crypto');

router.post '/login', (req, res, next) -> 
    passport.authenticate('local', (err, user, info) -> 
        if (info)
            return next(info)
        if (err)
            return next(err)
        if (!user)
            return res.redirect('/login')
        req.login user, (err) -> 
            if (err) 
                return next(err)
            return res.json({session: req.session})
    )(req, res, next);

router.post '/logout', (req, res, next) -> 
    req.logout()
    res.json { msg:  'You are log out'}

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