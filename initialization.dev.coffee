process.env.NODE_ENV = 'dev'
mongoose = require('mongoose')
config = require('config')
moment = require('moment')

Promise = require("bluebird")

User = require('./src/models/user')
DashboardTemplate = require('./src/models/dashboard_template')
SystemSetting = require("./src/models/system_setting")

users = require('./data/users')
templates = require('./data/templates')
system_settings = require('./data/system_settings')

mongoose = require('mongoose')
mongoose.connect(config.DBHost, {
    useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Promise.all([
  User.create(users),
  DashboardTemplate.create(templates),
  SystemSetting.create(system_settings)
]).then( (values) ->
  process.exit();
).catch((err) ->
  console.log(err.message);
  process.exit(1);
);

