process.env.NODE_ENV = 'dev'
mongoose = require('mongoose')
config = require('config')

Promise = require("bluebird")

User = require('./src/models/user')
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
console.log(config)

mongoose = require('mongoose')
mongoose.connect(config.DBHost, {
    useNewUrlParser: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

# Promise.all([
#   User.create(users)
# ]).then( (values) ->
#   console.log(values);
#   process.exit();
# ).catch((err) ->
#   console.log(err.message);
#   process.exit(1);
# );

