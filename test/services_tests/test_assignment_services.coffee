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
                'product' : [{ product: 'ProductA' }],
                'type' : [{ type: 'API' }],
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
                'product' : [{ product: 'ProductA' }],
                'type' : [{ type: 'API' }],
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
  
