#load application models
server = require('../../app')
_ = require('underscore');
setting = require('../api_objects/setting_api_object')

build = require('../api_objects/build_api_object')
auth = require('../api_objects/auth_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User with Operatpr permission cannot', ->
    existInvestigatedTest = undefined;
    cookies = undefined;
    before (done) ->
        auth.login(server, {username: "test@test.com", password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                done()
        )
        return
    
    describe 'manipulate setting', ->
        it 'should not create a new setting', (done) ->
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

        it 'should not update setting', (done) ->
            setting.update(server, cookies,
                "NONE", {},
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return
        
        it 'should not delete setting', (done) ->
            setting.delete(server, cookies,
                "NONE",
                403,
                (res) ->
                    res.body.error.should.equal "You don't have permission to perform this action"
                    done()
            )
            return