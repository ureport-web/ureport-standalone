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
describe 'User can perform update status on test relations collection ', ->
    existRelation = undefined;
    before (done) ->
        payload = {
            product: 'SeedProduct',
            type:  "API"
        }
        relation.filter(server,payload, 200,
            (res) ->
                existRelation = res.body[0]
                done()
        )
        return

    describe 'update team status', ->
        it 'should update team status correctly', (done) ->
            payload = {
                _id: existRelation._id,
                teams:  [{name:'TeamUpdate1'}, {name: 'TeamUpdate1'}, {name: 'TeamUpdate1'}, {name:'TeamUpdate1'}]
            }
            relation.updateStatus(server,  payload,  200,
                (res) ->
                    res.body.uid.should.equal '165426'
                    res.body.product.should.equal 'SeedProduct'
                    res.body.type.should.equal 'API'

                    res.body.teams.should.be.an 'Array'
                    res.body.teams.length.should.equal 4

                    res.body.tags.should.be.an 'Array'
                    res.body.tags.length.should.equal 2

                    res.body.components.name.should.equal 'com.company.test.component.b'
                    done()
            )
            return

describe 'User can perform action on test relations collection ', ->
    existRelation = undefined;
    before (done) ->
        payload = {
            product: 'SeedProduct',
            type:  "UI"
        }
        relation.filter(server,payload, 200,
            (res) ->
                existRelation = res.body[0]
                done()
        )
        return

    describe 'create new test relation/update exist one', ->
        it 'should create new test relation', (done) ->
            payload = {
                uid: '165427',
                product: "GreatProject",
                type: "API",
                components: {
                    name: 'com.company.test.component.testCreated'
                },
                teams:  [{'name':'Team1'}, {'name':'Team2'}]
                ,
                tags: [{name:'TagCreated'}, {name:'TagCreated2'}],
                file: 'my file.rb',
                path: 'C:/aaaa/bbb/cccc/ddd eeee/'
            }
            relation.create(server,  payload,  200,
                (res) ->
                    res.body.uid.should.equal '165427'
                    res.body.product.should.equal 'GreatProject'
                    res.body.type.should.equal 'API'

                    res.body.teams.should.be.an 'Array'
                    res.body.teams.length.should.equal 2

                    res.body.tags.should.be.an 'Array'
                    res.body.tags.length.should.equal 2

                    res.body.components.name.should.equal 'com.company.test.component.testCreated'
                    res.body.file.should.equal 'my file.rb'
                    res.body.path.should.equal 'C:/aaaa/bbb/cccc/ddd eeee/'

                    done()
            )
            return

        it 'should update exist test relation', (done) ->
            payload = {
                _id: existRelation._id
                product: "SeedProductUpdate",
                type: "UI",
                components: {
                    name: 'com.company.test.component.testUpdate'
                },
                teams: [{'name': 'TeamUpdate'}, {'name':'TeamUpdate'}, {'name':'TeamUpdate'}]
                ,
                tags: [{name:'TagUpdate1'}, {name:'TagUpdate2'}, {name:'TagUpdate3'}],
                file: 'my update file.rb',
                path: 'd:/cccc/ddd eeee/'
                
            }
            relation.create(server,  payload,  200,
                (res) ->
                    res.body.uid.should.equal '165425'
                    res.body.product.should.equal 'SeedProductUpdate'
                    res.body.type.should.equal 'UI'

                    res.body.teams.should.be.an 'Array'
                    res.body.teams.length.should.equal 3

                    res.body.tags.should.be.an 'Array'
                    res.body.tags.length.should.equal 3
                    res.body.tags[0].name.should.equal 'TagUpdate1'

                    res.body.components.name.should.equal 'com.company.test.component.testUpdate'
                    res.body.file.should.equal 'my update file.rb'
                    res.body.path.should.equal 'd:/cccc/ddd eeee/'

                    done()
            )
            return
