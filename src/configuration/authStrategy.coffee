
passport = require('passport')
bcrypt = require('bcrypt')
LocalStrategy = require('passport-local').Strategy;
User = require('../models/user')

# configure passport.js to use the local strategy
passport.use new LocalStrategy {usernameField: 'username'}, (username, password, done) ->
  User.findByName username, (user) ->
    if (!user) 
      return done(null, false, { message: 'Invalid username.'})
    else
      bcrypt.compare password, user.password, (err, result) -> 
          if (result)
            return done(null, user);
          else
            return done(null, false, { message: 'Invalid credentials.'})
        

passport.deserializeUser (data, done) -> 
  User.findById data._id, (user) ->
      if (!user)
        done(null, false);
      else 
        done(null, user);

# tell passport how to serialize the user
passport.serializeUser (user, done) -> 
  done(null, { 
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      position: user.position,
      displayname: user.displayname,
      settings: user.settings
    }
  );

module.exports = passport