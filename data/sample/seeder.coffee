process.env.NODE_ENV = 'seed_dev'
mongoose = require('mongoose')
config = require('config')
moment = require('moment')

Promise = require("bluebird")

User = require('../../src/models/user')
DashboardTemplate = require('../../src/models/dashboard_template')
SystemSetting = require("../../src/models/system_setting")
Build = require("../../src/models/build")
Test = require("../../src/models/test")
Relation = require("../../src/models/test_relation")
Investigated = require("../../src/models/investigated_test")
Setting = require("../../src/models/setting")
Dashboard = require("../../src/models/dashboard")

users = require('./seeds/users')
templates = require('./seeds/templates')
system_settings = require('./seeds/system_settings')
data = require('./seeds/data_seeds')
setting = require('./seeds/setting_seeds')
dashboards = require('./seeds/dashboard_seeds')

mongoose = require('mongoose')
mongoose.connect(config.DBHost, {
    useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Promise.all([
  User.create(users),
  DashboardTemplate.create(templates),
  SystemSetting.create(system_settings),
  Build.create(data.builds),
  Test.create(data.tests),
  Relation.create(data.relations),
  Investigated.create(data.investigatedTests),
  Setting.create(setting)
]).then( (values) ->
  adminUserId = values[0][0]._id
  dashboards
  # set user to dashboard
  dashboards[0].user = new ObjectId(adminUserId)
  dashboards[1].user = new ObjectId(adminUserId)
  dashboards[2].user = new ObjectId(adminUserId)
  Promise.all([
    Dashboard.create(dashboards)
  ]).then( (vals) ->
      process.exit();
  )
).catch((err) ->
  console.log(err.message);
  process.exit(1);
);

