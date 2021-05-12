process.env.NODE_ENV = 'dev'
mongoose = require('mongoose')
config = require('config')
moment = require('moment')

Promise = require("bluebird")

User = require('./src/models/user')
Build = require('./src/models/build')
Test = require('./src/models/test')

users = [{ 
    "username" : "admin",
    "email" : "localuser@local.com",
    "password" : "1234",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate",
            "type" : "dark"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "admin",
    "position" : ""
}]
builds = [{
  'type': 'UI',
  'product': 'UReport',
  'build': '1',
  'start_time': moment().format(),
  'end_time': moment().add(1, 'hour').format(),
  'status': {
    'pass': 4,
    'fail': 5,
    'skip': 5
  }
},
{
  'type': 'UI',
  'product': 'UReport',
  'build': '2',
  'start_time': moment().format(),
  'end_time': moment().add(1, 'hour').format(),
  'status': {
    'pass': 9,
    'fail': 0,
    'skip': 5
  }
}]

mongoose = require('mongoose')
mongoose.connect(config.DBHost, {
    useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Promise.all([
  User.create(users),
  Build.create(builds)
]).then( (values) ->
  process.exit();
).catch((err) ->
  console.log(err.message);
  process.exit(1);
);

