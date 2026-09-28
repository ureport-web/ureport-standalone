uuid = require('uuid/v4')
session = require('express-session')
mongoose = require('mongoose')
MongoStore = require('connect-mongo')(session)

config = require('config')
logger = require('../utils/logger')

mongoose = require('mongoose');
sanitizeDbUrl = (url) -> url.replace(/\/\/[^@]+@/, '//***:***@')

if(process.env.DBHost != undefined)
    logger.info("Connect to db " + sanitizeDbUrl(process.env.DBHost))
    mongoose.connect(process.env.DBHost, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
else
    logger.info("Connect to db " + sanitizeDbUrl(config.DBHost))
    mongoose.connect(config.DBHost, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

# add & configure middleware
SESSION_TTL_DAYS = 7

module.exports =  session({
    genid: (req) -> return uuid(),
    secret: 'uReport',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'sessions',
      ttl: SESSION_TTL_DAYS * 24 * 60 * 60,  # explicit TTL in seconds — must match cookie maxAge
      touchAfter: 24 * 60 * 60,              # only update session in DB once per 24h (rolling still resets cookie)
    }),
    cookie: {
        maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'lax',
    }
})