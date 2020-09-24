uuid = require('uuid/v4')
session = require('express-session')
mongoose = require('mongoose')
MongoStore = require('connect-mongo')(session)

config = require('config')

mongoose = require('mongoose');
if(process.env.DBHost != undefined)
    console.log("Connect to db " + process.env.DBHost)
    mongoose.connect(process.env.DBHost, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
else
    console.log("Connect to db " + config.DBHost)
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
        maxAge: 600 * 120 * 1000, #In ms --> 5 minutes
    }
})