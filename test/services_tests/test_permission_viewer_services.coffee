#load application models
server = require('../../app')
_ = require('underscore');
invTest = require('../api_objects/investigated_test_api_object')
assignment = require('../api_objects/assignment_api_object')
dashboard = require('../api_objects/dashboard_api_object')
setting = require('../api_objects/setting_api_object')

build = require('../api_objects/build_api_object')
auth = require('../api_objects/auth_api_object')
user_api = require('../api_objects/user_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User with Viewer permission', ->
    existInvestigatedTest = undefined;
    cookies = undefined;
    before (done) ->
        payload = {
            product: 'SeedProductPermission',
            type:  "UI"
        }
        auth.login(server, {username: "Viewer", password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                done()
        )
        return
    
    #investigated test
    describe 'should not ', ->
        it 'create new outage', (done) ->
            payload={
                pattern: '^\s*Nullpointer exception\s*$',
                search_type: 'regex',
                caused_by: 'System Error',
                tracking: {
                    'number' : 'JIRA-2234'
                },
                exceptions: [
                    'TEST2234', 'TEST2235'
                ],
                impact_test:{
                    fail: 6,
                    skip: 4,
                    warning: 0
                }
            }
            build.addOutage(server, cookies,
                "NONE",
                payload,
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'create new investigated test', (done) ->
            payload = {
                uid: 'AAA12345',
                product: "GreatProject",
                type: "API",
                failure: {
                    message: "some message",
                    token: "AA_AA",
                    stack_trace: "trace"
                },
                tracking: {
                    'number' : 'JIRA-2234'
                }
            }
            invTest.create(server, cookies,  payload,  403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update investigated test', (done) ->
            payload = {
                # _id: existInvestigatedTest._id
                uid: 'AAA12345',
                product: "SeedProductUpdate",
                type: "API",
                failure: {
                    message: "some updated message",
                    token: "AA_AA",
                    stack_trace: "trace"
                }
            }
            invTest.create(server, cookies, payload,  403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'delete investigated test', (done) ->
            invTest.delete(server, cookies, "111",  403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
    
    #settings
    describe 'should not', ->
        it 'create a new setting', (done) ->
            payload = {
                'product' : 'TestProductData',
                'type' : 'API'
            }
            setting.create(server, cookies,
                payload,
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update setting', (done) ->
            setting.update(server, cookies,
                "NONE", {},
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
        
        it 'delete setting', (done) ->
            setting.delete(server, cookies,
                "NONE",
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

    #dashboard
    describe 'should not', ->
        it 'create a new dashboard', (done) ->
            payload = {
                "user": "5c6e06d76525937d6d7389ef",
                "name": "my dashboard EEEEE",
                "widgets": [{
                    "name": "someName",
                    "type": "asdfasdfasdf",
                    "cols": 1, "rows": 1, "y": 11, "x": 8, "dragEnabled": false, "resizeEnabled": false,
                    "pattern": {
                        "status": {
                            "all": true,
                            "rerun": false,
                            "pass": false,
                            "fail": false,
                            "skip": false,
                            "ki": false
                        },
                        "relations" : {},
                    },
                    "status": {"name" : "AAAAA"}
                }]
            }
            dashboard.create(server, cookies,
                payload,
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update dashboard', (done) ->
            dashboard.update(server, cookies,
                "NONE", { user : "5c6e06d76525937d6d7389ef"},
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update widget dashboard', (done) ->
            dashboard.updateWidget(server, cookies,
                "NONE", { user : "5c6e06d76525937d6d7389ef"},
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'delete dashboard', (done) ->
            dashboard.delete(server, cookies,
                "NONE",{ user : "5c6e06d76525937d6d7389ef"},
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
   
    #assignemnts
    describe 'should not', ->
        it 'create a new assignment', (done) ->
            payload = {
                'product' : 'TestProductData',
                'type' : 'API',
                'user' : '5c6e06d76525937d6d7389ef',
                'username' : 'TESTAAAA',
                'uid' : '1245',
                'failure': {
                    'reason': '1111',
                    'stackTrace': 'this is a stack trace',
                    'token': 'AAAA'
                }
            }
            assignment.create(server, cookies,
                payload,
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update assignment', (done) ->
            assignment.unassign(server, cookies,
                "NONE", {},
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
        
        it 'delete assignment', (done) ->
            assignment.delete(server, cookies,
                "NONE",
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
    
    #perefernce
    describe 'should not', ->
        operator = null
        before (done) ->
            auth.login(server, {username: "admin@test.com", password:"password"}, 200, 
            (res)->
                # login as admin to get a id of operator
                user_api.search(server,res.headers['set-cookie'].pop().split(';')[0],{username:"test@test.com"},200,
                (res) ->
                    operator = res.body[0]
                    done()
                )
            )

            return
        
        it 'update other user preference - theme', (done) ->
            payload = {
                "user" : operator._id,
                "theme" : {
                    "111": "aaa",
                    "2222": "bbb"
                }
            }
            user_api.updatePreference(server, cookies,
                payload,
                403,
                'theme',
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
        
        it 'update other user preference - language', (done) ->
            payload = {
                "user" : operator._id,
                "language" : 'en'
            }
            user_api.updatePreference(server, cookies,
                payload,
                403,
                'language',
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update other user preference - report', (done) ->
            payload = {
                "user" : operator._id,
                "language" : 'en'
            }
            user_api.updatePreference(server, cookies,
                payload,
                403,
                'report',
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update other user preference - dashboard', (done) ->
            payload = {
                "user" : operator._id,
                "report" : 'en'
            }
            user_api.updatePreference(server, cookies,
                payload,
                403,
                'dashboard',
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
    #builds
    describe 'should not', ->
        existbuild = undefined;
        existbuildWithCommentAndOutage = undefined;
        before (done) ->
            payload = {
                "is_archive" : false,
                "product" : [
                    { "product" : "UpdateProduct" },
                    { "product" : "UpdateCommentAndOutage" }
                ],
                "type" : [
                    { "type" : "API" }
                ],
                "team" : [
                    { "team" : "UpdateTeam" }
                ],
                "range" : 20
            }
            build.filter(server,cookies, payload, 200,
            (res) ->
                #only two builds should be returned
                if(res.body[0].product == 'UpdateProduct')
                    existbuild = res.body[0]
                    existbuildWithCommentAndOutage = res.body[1]
                else
                    existbuild = res.body[1]
                    existbuildWithCommentAndOutage = res.body[0]
                done()
            )
            return

        it 'update a build parameter', (done) ->
            date = new Date("2015-03-25T12:00:00.000Z")
            build.update(server,cookies,
                existbuild._id,
                {
                    device: 'update device',
                    start_time: date,
                    end_time: date
                    owner: 'Tester'
                },
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update a build pass status', (done) ->
            build.updateStatus(server,cookies,
                existbuild._id,
                {
                    pass: 18,
                    fail: undefined,
                    skip: "4",
                    warning: null
                },
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update a build status', (done) ->
            build.updateStatus(server,cookies,
                existbuild._id,
                {
                    pass: 8,
                    fail: 2,
                    skip: 4,
                    warning: 0
                },
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return

        it 'update a build comments', (done) ->
            build.update(server,cookies,
                existbuildWithCommentAndOutage._id,
                {
                    comments: [{
                        user: 'Update user',
                        message: 'this is just a updated message.',
                        time: moment().add(4, 'hour').format()
                    },{
                        user: 'Update user',
                        message: 'this is just another updated message.',
                        time: moment().add(4, 'hour').format()
                    }]
                },
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return