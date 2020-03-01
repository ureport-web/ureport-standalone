uuid = require('uuid/v4')
session = require('express-session')
mongoose = require('mongoose')
MongoStore = require('connect-mongo')(session)

config = require('config')

console.log("Connect to db " + config.DBHost)
mongoose = require('mongoose');
mongoose.connect(config.DBHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

# add & configure middleware
module.exports =  session({
    genid: (req) -> return uuid(),
    secret: 'uReport',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'sessions',
      # clear_interval: 1*60 #In seconds -> 1 minutes (works even when commented)
      #  autoRemove: 'interval',
    }),
    cookie: {
        maxAge: 60 * 120 * 1000, #In ms --> 5 minutes
    }
})