#load application models
server = require('../../app')
_ = require('underscore');
dashboard = require('../api_objects/dashboard_api_object')
auth = require('../api_objects/auth_api_object')
user = require('../api_objects/user_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User with operator permission', ->
    cookies = undefined;
    operator = undefined;
    create_dashboard_id = undefined
    before (done) ->
        auth.login(server, {username: "test@test.com", password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                user.search(server,cookies,{username:"test@test.com"},200,
                    (res) ->
                        operator = res.body[0]
                        done()
                )
        )
        return

    it 'should create a new dashboard', (done) ->
        payload = {
            "user": operator._id,
            "name": "Created from test"
            "widgets": [{
                "name": "someName",
                "type": "someType",
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
            200,
            (res) ->
                create_dashboard_id = res.body._id
                res.body.name.should.equal 'Created from test'
                res.body.user.should.equal operator._id
                res.body.widgets.should.be.an 'Array'
                res.body.widgets.length.should.equal 1

                res.body.widgets[0].name.should.be.equal "someName"
                res.body.widgets[0].type.should.be.equal "someType"
                res.body.widgets[0].pattern.should.exists
                done()
        )
        return
    
    it 'should update a new dashboard', (done) ->
        payload = {
            "user": operator._id,
            "_id": create_dashboard_id,
            "name": "Updated Created from test"
            "widgets": [{
                "name": "Updated someName",
                "type": "Updated someType",
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
            },{
                "name": "Updated someName",
                "type": "Updated someType",
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
            200,
            (res) ->
                create_dashboard_id = res.body._id
                res.body.name.should.equal 'Updated Created from test'
                res.body.user.should.equal operator._id
                res.body.widgets.should.be.an 'Array'
                res.body.widgets.length.should.equal 2

                res.body.widgets[0].name.should.be.equal "Updated someName"
                res.body.widgets[0].type.should.be.equal "Updated someType"
                res.body.widgets[0].pattern.should.exists
                done()
        )
        return

    after (done) ->
      dashboard.delete(server,cookies, create_dashboard_id, {user: operator._id}, 200,
        (res) ->
            res.body.ok.should.be.equal 1
            done()
      )
      return

    describe 'with missing params', ->
        it 'should not create a new dashboard at all', (done) ->
            payload = {
                "user": operator._id,
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
                500,
                (res) ->
                    res.body.error.should.be.an 'Object'
                    res.body.error.name.should.equal 'ValidationError'
                    done()
            )
            return
