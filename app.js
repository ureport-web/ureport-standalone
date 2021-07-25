require('coffee-script/register')
// if (process.env.NODE_ENV == undefined) {
//   process.env.NODE_ENV = "dev"
// }

config = require('config')

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser');

// swaggerUI
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const DisableTryItOutPlugin = function() {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          allowTryItOutFor: () => () => false
        }
      }
    }
  }
}
const options = {
  swaggerOptions: {
      plugins: [
           DisableTryItOutPlugin
      ]
   }
};
let app = undefined;

/**
 * Connect to DB
 **/
if (config !== undefined) {
  const passport = require('./src/configuration/authStrategy')
  const session = require('./src/configuration/sessions')
  app = express()

  // set static file to dist folder.
  app.use(express.static(path.join(__dirname, 'dist')))
  // app.use(express.static(path.join(__dirname, 'public')))

  //API doc
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));

  /**
   * sessions
   */

  app.use(cookieParser());
  // This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
  // This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
  app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');
    }
    next();
  });

  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());
 
  /*
   * security guard
   */
  const helmet = require('helmet')
  app.use(helmet())

   /*
   * gzip response
   */
  const compression = require('compression')
  app.use(compression())

  /*
   * bodyParser
   */
  const bodyParser = require('body-parser')
  app.use(bodyParser.json({
    limit: '50mb',
    type: 'application/json'
  }))
  app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: false
  }))
  /*
   * loging
   */
  const morgan = require('morgan')
  const rfs = require('rotating-file-stream')
  const fs = require('fs')
  const logDirectory = path.join(__dirname, 'log')
  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

  app.use(morgan('dev', {
    skip: function (req, res) {
      return res.statusCode < 400
    }
  }))
  
  // log all requests to access.log
  app.use(morgan('combined', {
    stream: rfs('access.log', {
      interval: '1d', // rotate daily
      path: logDirectory
    })
  }))

  /**
  * Email setup
   */
  const nodemailer = require('nodemailer');
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "robert.stamm7@ethereal.email", // generated ethereal user
      pass: "jAZxCwTJ6wF7hsKJ4A" // generated ethereal password
    }
  });
  /*
   * Middle ware
   */
  var isAuthenticatedMid = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/api/unauthorized')
    }
  }

  // skip authorization if it is test environment
  if(process.env.NODE_ENV !== "test"){
    app.use('/api/test', isAuthenticatedMid)
    app.use('/api/test_relation', isAuthenticatedMid)
    app.use('/api/user', isAuthenticatedMid)
  }
  app.use('/api/build', isAuthenticatedMid)
  app.use('/api/investigated_test', isAuthenticatedMid)
  app.use('/api/dashboard', isAuthenticatedMid)
  app.use('/api/dashboard/template', isAuthenticatedMid)
  app.use('/api/setting', isAuthenticatedMid)
  app.use('/api/assignment', isAuthenticatedMid)
  app.use('/api/tracking', isAuthenticatedMid)
  app.use('/api/search', isAuthenticatedMid)
  app.use('/api/dependency', isAuthenticatedMid)

  app.get('/api/unauthorized', (req, res) => {
    res.status(401)
    res.send(`You need to login first!`)
  })
  app.get('/api/authrequired', isAuthenticatedMid, (req, res) => {
    res.send(`You are login`)
  })
  /**
   * routing
   */
  const authenticate = require('./src/routes/authentication')
  const dashboard = require('./src/routes/dashboard')
  const dashboardTemplate = require('./src/routes/dashboard_template')

  const setting = require('./src/routes/setting')
  const systemSetting = require('./src/routes/system_setting')

  const build = require('./src/routes/build')
  const test = require('./src/routes/test')
  const audit = require('./src/routes/audit')
  const investigatedTest = require('./src/routes/investigated_test')
  const testRelation = require('./src/routes/test_relation')
  const preference = require('./src/routes/preference')
  const assignment = require('./src/routes/assignment')
  const user = require('./src/routes/user')
  const userFav = require('./src/routes/user_favorite')
  const trackingJIRA = require('./src/routes/tracking/jira')
  const searching = require('./src/routes/search/solr')
  const dependency = require('./src/routes/dependency')
  const dependencyRelation = require('./src/routes/dependency_relation')

  // list of endpoints for readonly page
  const noauth = require('./src/routes/noauth/noauth')

  app.use('/api', authenticate)
  app.use('/api/setting', setting)
  app.use('/api/system/setting', systemSetting)
  app.use('/api/build', build)
  app.use('/api/test', test)
  app.use('/api/audit', audit)
  app.use('/api/investigated_test', investigatedTest)
  app.use('/api/test_relation', testRelation)
  app.use('/api/dashboard', dashboard)
  app.use('/api/template', dashboardTemplate)
  app.use('/api/assignment', assignment)
  app.use('/api/user', user)
  app.use('/api/user/preference', preference)
  app.use('/api/user/favorite', userFav)
  app.use('/api/tracking/jira', trackingJIRA)
  app.use('/api/search', searching)
  app.use('/api/dependency', dependency)
  app.use('/api/dependency_relation', dependencyRelation)
  
  app.use('/api/noauth', noauth)

  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }
    console.log("Internal Error:",err)
    res.status(500).json({
      error: err
    })
  })

  // app.listen(config.PORT, () => console.log('Using port ' + config.PORT))

} else {
  console.error("Cannot find configuration file, Server will not be started.")
}

module.exports = app