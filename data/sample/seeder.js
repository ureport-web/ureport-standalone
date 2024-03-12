process.env.NODE_ENV = 'seed_dev'
Promise = require("bluebird")
mongoose = require('mongoose')
config = require('config')
process.env.PORT = config.PORT

const data = require('./data_seeds')
const setting = require('./setting_seeds')

// Builds
buildSchema = require('./schema/build')
Build = mongoose.model('Build', buildSchema);

// Tests
testSchema = require('./schema/test')
Test = mongoose.model('Test', testSchema);

// Relations
relationSchema = require('./schema/relation')
Relation = mongoose.model('TestRelation', relationSchema);

// Investigated Test
invTestSchema = require('./schema/investigated')
Investigated = mongoose.model('InvestigatedTest', invTestSchema)

// Setting
settingSchema = require('./schema/plSetting')
Setting = mongoose.model('Setting', settingSchema)

// connect to data base
mongoose.connect(config.DBHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Promise.all([
    Build.create(data.builds),
    Test.create(data.tests),
    Relation.create(data.relations),
    Investigated.create(data.investigatedTests),
    Setting.create(setting)
]).then( (values) =>{
    // console.log(values)
    process.exit(0)
}).catch((err) => console.log(err.message))

