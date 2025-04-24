#load application models
server = require('../../app')
_ = require('underscore');
invTest = require('../api_objects/investigated_test_api_object')
build = require('../api_objects/build_api_object')
auth = require('../api_objects/auth_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User can ', ->
    existInvestigatedTest = undefined;
    cookies = undefined;
    before (done) ->
        payload = {
            product: 'SeedProduct',
            type:  "UI"
        }
        auth.login(server, {username: "test@test.com", password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                invTest.getByPage(server,cookies, 1,1, 200,
                    (res) ->
                        existInvestigatedTest = res.body[0]
                        done()
                )
        )
        return

    describe 'create new investigated test/update exist one', ->
        it 'should create new investigated test', (done) ->
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
            invTest.create(server, cookies,  payload,  200,
                (res) ->
                    res.body.uid.should.equal 'AAA12345'
                    res.body.product.should.equal 'GreatProject'
                    res.body.type.should.equal 'API'
                    res.body.failure.message.should.equal 'some message'
                    res.body.caused_by.should.equal 'Defect'
                    done()
            )
            
            return

        it 'should update exist investigated test', (done) ->
            payload = {
                _id: existInvestigatedTest._id
                uid: 'AAA12345',
                product: "SeedProductUpdate",
                type: "API",
                failure: {
                    message: "some updated message",
                    token: "AA_AA",
                    stack_trace: "trace"
                }
            }
            invTest.create(server, cookies, payload,  200,
                (res) ->
                    res.body.uid.should.equal 'AAA12345'
                    res.body.product.should.equal 'SeedProductUpdate'
                    res.body.type.should.equal 'API'
                    res.body.failure.message.should.equal 'some updated message'
                    res.body.failure.token.should.equal 'AA_AA'
                    res.body.failure.stack_trace.should.equal 'trace'
                    res.body.caused_by.should.equal 'maintenance'
                    done()
            )
            return

        it 'should delete investigated test', (done) ->
            invTest.create(server, cookies, existInvestigatedTest._id,  200,
                (res) ->
                    # console.log(res.body)
                    done()
            )
            return
