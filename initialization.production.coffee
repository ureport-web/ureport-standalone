process.env.NODE_ENV = 'production'
mongoose = require('mongoose')
config = require('config')
moment = require('moment')

Promise = require("bluebird")

User = require('./src/models/user')
DashboardTemplate = require('./src/models/dashboard_template')
Setting = require("./src/models/system_setting")

users = require('./data/sample/seeds/users')
templates = require('./data/sample/seeds/templates')
settings = require('./data/sample/seeds/system_settings')
mongoose = require('mongoose')
mongoose.connect(config.DBHost, {
    useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Promise.all([
  User.create(users),
  DashboardTemplate.create(templates),
  Setting.create(settings)
]).then( (values) ->
  process.exit();
).catch((err) ->
  console.log(err.message);
  process.exit(1);
);

