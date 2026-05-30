#load application models
server = require('../../app')
_ = require('underscore');
relation = require('../api_objects/test_relations_api_object')
# build = require('../api_objects/build_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp
