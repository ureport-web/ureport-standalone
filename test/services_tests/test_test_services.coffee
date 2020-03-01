#load application models
server = require('../../app')
_ = require('underscore');
test = require('../api_objects/test_api_object')
build = require('../api_objects/build_api_object')
auth = require('../api_objects/auth_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User can perform action on tests collection ', ->
    existbuild = undefined;
    cookies = null;
    before (done) ->
        payload = {
            is_archive: false,
            product: [
              { "product" : "UpdateProduct" }
            ],
            type: [
              { "type" : "API" }
            ],
            team: [
              { "team" : "UpdateTeam" }
            ]
        }
        auth.login(server, {username: "test@test.com", password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                build.filter(server,cookies, payload, 200,
                (res) ->
                    existbuild = res.body[0]
                    done()
                )
        )
        
        return

    describe 'Filter tests based on status', ->
        it 'should return all passsed tests', (done) ->
            payload = {
                build: existbuild._id,
                status: ["PASS"],
                exclude: ["failure",'info']
            }
            test.filter(server,payload, 200,
                (res) ->
                    res.body.should.be.an 'Array'
                    res.body.length.should.equal 1
                    res.body[0].uid.should.equal '165427'
                    res.body[0].name.should.equal 'test some basic function 3'
                    res.body[0].is_rerun.should.equal false
                    should.not.exist(res.body[0].failure)
                    should.not.exist(res.body[0].info)
                    done()
                )
            return

        it 'should return all tests with all status', (done) ->
            payload = {
                build: existbuild._id,
                status: ["PASS","FAIL","WARNING","SKIP"]
            }
            test.filter(server,payload, 200,
                (res) ->
                    res.body.should.be.an 'Array'
                    res.body.length.should.equal 4
                    done()
                )
            return

        it 'should return all tests with status "ALL"', (done) ->
            payload = {
                build: existbuild._id,
                status: ["All"]
            }
            test.filter(server,payload, 200,
                (res) ->
                    res.body.should.be.an 'Array'
                    res.body.length.should.equal 4
                    done()
                )
            return

    describe 'Add tests steps', ->
        existTest = undefined;
        before (done) ->
            payload = {
                build: existbuild._id,
                status: ["PASS"],
                exclude: ["failure",'info']
            }
            test.filter(server,payload, 200,
            (res) ->
                existTest = res.body[0]
                done()
            )
            return
        it 'should add steps to exist test', (done) ->
            payload = {
                setup: [
                    {
                        'status': "PASS",
                        'step': "<div> This is a first setup step </div>",
                        'timestamp' : moment().add(4, 'hour').format()
                    },
                    {
                        'status': "PASS",
                        'step': "<div> This is a second setup step </div>",
                        'timestamp' : moment().add(4, 'hour').format()
                    }
                ],
                body: [
                    {
                        'status': "PASS",
                        'step': "<div> This is a first step </div>",
                        'timestamp' : moment().add(4, 'hour').format()
                    },
                    {
                        'status': "FAIL",
                        'step': "<div> This is a second step </div>",
                        'timestamp' : moment().add(4, 'hour').format()
                    }
                ],
                teardowns: ["failure",'info']
            }
            test.addStep(server, existTest._id, payload,  200,
            (res) ->
                res.body.setup.should.be.an 'Array'
                res.body.body.should.be.an 'Array'
                res.body.setup.length.should.equal 2
                res.body.body.length.should.equal 2
                should.not.exist(res.body.teardown)
                done()
            )
            return

    describe 'Add tests', ->
        it 'should add tests to exist build with full success', (done) ->
            payload = {
                tests: [
                    {
                        'status': "PASS",
                        'uid': "1111",
                        "name": "new test 111",
                        'build' : existbuild._id
                    },
                    {
                        'status': "PASS",
                        'uid': "222",
                        "name": "new test 222",
                        'build' : existbuild._id
                    },{
                        'status': "PASS",
                        'uid': "333",
                        "name": "new test 333",
                        'build' : existbuild._id
                    },{
                        'status': "PASS",
                        'uid': "444",
                        "name": "new test 444",
                        'build' : existbuild._id
                    }
                ]
            }
            test.create(server, cookies, payload,  200,
            (res) ->
                res.body.state.should.be.equal 'Success'
                res.body.provided.should.be.equal 4
                res.body.saved.should.be.equal 4
                done()
            )
            return

        it 'should add tests to exist build with partial success', (done) ->
                payload = {
                    tests: [
                        {
                            'status': "PASS",
                            'uid': "1111",
                            "name": "new test 111",
                            'build' : existbuild._id
                        },
                        {
                            'status': "PASS",
                            "name": "new test 222",
                            'build' : existbuild._id
                        },{
                            'status': "PASS",
                            'uid': "333",
                            "name": "new test 333",
                            'build' : existbuild._id
                        },{
                            'status': "PASS",
                            'uid': "444",
                            "name": "new test 444",
                            'build' : existbuild._id
                        }
                    ],
                    isOrdered: false
                }
                test.create(server, cookies, payload,  200,
                (res) ->
                    res.body.state.should.be.equal 'Partial Success, you might have missing field in your paylaod, not all tests are saved.'
                    res.body.provided.should.be.equal 4
                    res.body.saved.should.be.equal 3
                    done()
                )
                return

        it 'should add tests to exist build with error in payload', (done) ->
                payload = {
                    tests: [
                        {
                            'status': "PASS",
                            'uid': "1111",
                            "name": "new test 111",
                            'build' : existbuild._id
                        },
                        {
                            'status': "PASS",
                            "name": "new test 222",
                            'build' : existbuild._id
                        },{
                            'status': "PASS",
                            'uid': "333",
                            "name": "new test 333",
                            'build' : existbuild._id
                        },{
                            'status': "PASS",
                            'uid': "444",
                            "name": "new test 444",
                            'build' : existbuild._id
                        }
                    ]
                }
                test.create(server, cookies, payload,  500,
                (res) ->
                    done()
                )
                return
    
