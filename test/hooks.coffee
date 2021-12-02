process.env.NODE_ENV = 'test'
mongoose = require('mongoose')
config = require('config')

process.env.PORT = config.PORT

Promise = require("bluebird")
async = require("async")

ObjectId = mongoose.Types.ObjectId;

Setting = require('../src/models/setting')
settings_data = require('./seed/settings')

Assignment = require('../src/models/assignment')
assignments_data = require('./seed/assignments')

Build = require('../src/models/build')
builds_data = require('./seed/builds')

Dashboard = require('../src/models/dashboard')
dashboards_data = require('./seed/dashboards')

Test = require('../src/models/test')
tests_data = require('./seed/tests')
batch_data = require('./seed/batch')

InvestigatedTest = require('../src/models/investigated_test')
investigated_tests_data = require('./seed/investigated_tests')

TestRelation = require('../src/models/test_relation')
test_relation_data = require('./seed/test_relations')

User = require('../src/models/user')
user_data = require('./seed/users')

Audit = require('../src/models/audit')


#load models
before (done) ->
  this.timeout(30000);
  console.log "Perform DB setup"
  if config != undefined
    mongoose = require('mongoose')
    mongoose.connect(config.DBHost, {
        useNewUrlParser: true
    });
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    Promise.all([
      Build.create(builds_data),
      User.create(user_data),
      InvestigatedTest.create(investigated_tests_data),
      TestRelation.create(test_relation_data),
      Setting.create(settings_data),
      Assignment.create(assignments_data),
    ]).then( (values) ->
      async.filter(values[0].concat(values[1]),
        (item, callback) ->
          callback(null, (item.product && item.product == 'UpdateProduct' || item.username!=undefined))
        (err,results) ->
          if(results)
            # set build id to test
            i = 0
            while i < tests_data.length
              tests_data[i].build = new ObjectId(results[0]._id)
              i++
            # set user to dashboard
            dashboards_data[0].user = new ObjectId(results[1]._id) #test@test.com' operator
            dashboards_data[1].user = new ObjectId(results[3]._id) #admin@test.com admin

            Promise.all([
              Test.create(tests_data),
              Test.create(batch_data),
              Dashboard.create(dashboards_data)
            ]).then( ->
              console.log "===== Finish DB setup ====="
              done()
            )
      )
    ).catch((err) ->
      console.log(err.message);
    );
  return

after (done) ->
  console.log "Perform global DB clean up"
  Promise.all([
    Setting.deleteMany({}).exec(),
    Setting.collection.dropIndexes(),
    User.deleteMany({}).exec(),
    User.collection.dropIndexes(),
    Build.deleteMany({}).exec(),
    Test.deleteMany({}).exec(),
    InvestigatedTest.deleteMany({}).exec()
    TestRelation.deleteMany().exec(),
    Assignment.deleteMany().exec(),
    Dashboard.deleteMany().exec(),
    Audit.deleteMany().exec()
  ]).then ->
    console.log "Finish DB cleanup"
    done()
  return
