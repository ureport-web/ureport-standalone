#load application models
server = require('../../app')
_ = require('underscore');
assignment = require('../api_objects/assignment_api_object')
auth = require('../api_objects/auth_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User can perform action on assignment collection', ->
    cookies = undefined;
    before (done) ->
        auth.login(server, {username: "test@test.com", password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                done()
        )
        return

    describe 'filter assignemnt', ->
        it 'should find all assignments with given time', (done) ->
            payload = {
                'product' : 'ProductA',
                'type' : 'API',
                'after': moment().subtract(60, 'days').format()
            }
            assignment.filter(server,cookies,
                payload,
                200,
                (res) ->
                    res.body.should.be.an 'Array'
                    res.body.length.should.equal 6
                    done()
            )
            return

        it 'should find all new assignment with current time', (done) ->
            payload = {
                'product' : 'ProductA',
                'type' : 'API',
            }
            assignment.filter(server,cookies,
                payload,
                200,
                (res) ->
                    res.body.should.be.an 'Array'
                    res.body.length.should.equal 2
                    done()
            )
            return

    describe 'assign to', ->
        create_assignment_id = undefined
        it 'should create a new assignment with min params', (done) ->
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
                200,
                (res) ->
                    create_assignment_id = res.body._id
                    res.body.should.be.an 'Object'
                    res.body.product.should.be.equal 'TestProductData'
                    res.body.type.should.be.equal 'API'
                    res.body.user.should.be.equal '5c6e06d76525937d6d7389ef'
                    res.body.username.should.be.equal 'TESTAAAA'
                    res.body.uid.should.be.equal '1245'
                    res.body.failure.should.be.an 'Object'
                    should.exist(res.body.assign_at)
                    done()
            )
            return

        after (done) ->
            assignment.delete(server,cookies, create_assignment_id, 200,
                (res) ->
                    done()
            )
            return
  
    describe 'unassign to', ->
        create_assignment_id = undefined
        it 'should unassign a test', (done) ->
            payload = {
                'product' : 'TestProductUnassign',
                'type' : 'API',
                'user' : '5c6e06d76525937d6d7389ef',
                'username' : 'TEST_UNASSIGN',
                'uid' : '2234',
                'failure': {
                    'reason': '33333',
                    'stackTrace': 'this is a stack trace will be unassign',
                    'token': 'AAAABBBB'
                }
            }
            assignment.create(server, cookies,
                payload,
                200,
                (res) ->
                    create_assignment_id = res.body._id
                    res.body.state.should.be.equal 'OPEN'
                    assignment.unassign(server, cookies,
                        create_assignment_id,
                        {
                            'state': 'CLOSE'
                        },
                        200,
                        (res) ->
                            res.body.should.be.an 'Object'
                            res.body.product.should.be.equal 'TestProductUnassign'
                            res.body.type.should.be.equal 'API'
                            res.body.user.should.be.equal '5c6e06d76525937d6d7389ef'
                            res.body.username.should.be.equal 'TEST_UNASSIGN'
                            res.body.uid.should.be.equal '2234'
                            res.body.state.should.be.equal 'CLOSE'
                            res.body.failure.should.be.an 'Object'
                            should.exist(res.body.assign_at)
                            done()
                    )
            )
            return

        after (done) ->
            assignment.delete(server, cookies ,create_assignment_id, 200,
            (res) ->
                done()
            )
            return

    describe 'create assignemnt with missing params', ->
        it 'should not create a new assignment at all', (done) ->
            payload = {
                'product' : 'TestProductData'
            }
            assignment.create(server, cookies,
                payload,
                400,
                (res) ->
                    res.body.error.should.equal 'key user or username is requried'
                    done()
            )
            return
  
    describe 'create assignemnt with failure when found existing assignment', ->
        
        assWithSameToken = undefined;
        assWithSameFailure = undefined;

        before (done) ->
            assignment.getByUser(server,cookies,
                '5c7e06d76525937d6d7389ef',
                200,
                (res) ->
                    assWithSameFailure = res.body[0]
                    assWithSameToken = res.body[1]
                    res.body.should.be.an 'Array'
                    res.body.length.should.equal 2
                    done()
            )
            return
        
        it 'should create a new assignment when reason is not the same', (done) ->
            payload = {
                'type': 'API',
                'product': 'ProductSameFailure',
                'uid': "11111",
                'user' : '6c6e06d76525937d6d7389ef',
                'username' : 'Test',
                'failure': {
                    'reason': 'soem diff java.lang.AssertionError: expected [404] but found [200]',
                    'stackTrace': 'this is a stack trace',
                }
            }
            assignment.create(server,cookies,
                payload,
                200,
                (res) ->
                    res.body._id.should.not.be.equal assWithSameFailure._id

                    res.body.should.be.an 'Object'
                    res.body.product.should.be.equal 'ProductSameFailure'
                    res.body.type.should.be.equal 'API'
                    res.body.uid.should.be.equal '11111'
                    res.body.username.should.be.equal 'Test'
                    res.body.user.should.be.equal '6c6e06d76525937d6d7389ef'
                    res.body.failure.should.be.an 'Object'
                    done()
            )
            return

        it 'should not create a new assignment when reason is the same but replace user name', (done) ->
            payload = {
                'type': 'API',
                'product': 'ProductSameFailure',
                'uid': "11111",
                'user' : '7c6e06d76525937d6d7389ef',
                'username' : 'TEST SAME Failure',
                'failure': {
                    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
                    'stackTrace': 'this is a stack trace'
                    'token': null
                },    
                "comments" : [ 
                    {
                        "user" : "admin",
                        "time" : "2019-10-18T02:51:47.520Z",
                        "message" : "3"
                    }, 
                    {
                        "user" : "admin",
                        "time" : "2019-10-18T02:51:50.041Z",
                        "message" : "4"
                    }
                ]
            }
            assignment.create(server,cookies,
                payload,
                200,
                (res) ->
                    res.body.should.be.an 'Object'
                    res.body._id.should.be.equal assWithSameFailure._id
                    
                    res.body.product.should.be.equal 'ProductSameFailure'
                    res.body.type.should.be.equal 'API'
                    res.body.username.should.be.equal 'TEST SAME Failure'
                    res.body.user.should.be.equal '7c6e06d76525937d6d7389ef'

                    res.body.uid.should.be.equal '11111'
                    res.body.failure.should.be.an 'Object'
                    res.body.comments.should.be.an 'Array'
                    res.body.comments.length.should.equal 4
                    done()
            )
            return

        it 'should not create a new assignment when token is the same but replace user name', (done) ->
            payload = {
                'type': 'API',
                'product': 'ProductSameToken',
                'uid': "11111",
                'user' : '8c6e06d76525937d6d7389ef',
                'username' : 'TEST SAME TOKEN',
                'failure': {
                    'reason': '11 java.lang.AssertionError: expected [404] but found [200]',
                    'stackTrace': 'this is a stack trace',
                    'token': '{89=[91], 82=[], 67=[]}'
                }
            }
            assignment.create(server,cookies,
                payload,
                200,
                (res) ->
                    res.body.should.be.an 'Object'
                    res.body._id.should.be.equal assWithSameToken._id

                    res.body.product.should.be.equal 'ProductSameToken'
                    res.body.type.should.be.equal 'API'
                    res.body.uid.should.be.equal '11111'
                    res.body.username.should.be.equal 'TEST SAME TOKEN'
                    res.body.user.should.be.equal '8c6e06d76525937d6d7389ef'

                    res.body.failure.should.be.an 'Object'
                    done()
            )
            return