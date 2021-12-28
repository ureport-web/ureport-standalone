#load application models
server = require('../../app')
_ = require('underscore');
build = require('../api_objects/build_api_object')
auth = require('../api_objects/auth_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User can perform action on builds collection ', ->
  cookies = undefined;
  before (done) ->
    auth.login(server, {username: "admin@test.com", password:"password"}, 200, 
        (res)->
            cookies = res.headers['set-cookie'].pop().split(';')[0];
            done()
    )
    return

  describe 'filter builds', ->
    it 'should return all builds with filter', (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "uReport" }
          ],
          "type" : [
              { "type" : "API" }
          ],
          "team" : [
              { "team" : "Team1" }
          ],
          "range" : 20
      }
      build.filter(server,cookies, payload, 200,
        (res) ->
            res.body.should.be.an 'Array'
            res.body.length.should.equal 8
            done()
      )
      return

    it 'should return all builds with given range', (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "uReport" }
          ],
          "type" : [
              { "type" : "API" }
          ],
          "team" : [
              { "team" : "Team1" }
          ],
          "range" : 3
      }
      build.filter(server,cookies, payload, 200,
        (res) ->
          res.body.should.be.an 'Array'
          res.body.length.should.equal 3
          done()
      )
      return

    it 'should return all archvied builds', (done) ->
      payload = {
          "is_archive" : true,
          "product" : [
              { "product" : "uReport" }
          ],
          "type" : [
              { "type" : "UI" }
          ],
          "team" : [
              { "team" : "Team2" }
          ],
          "range" : 3
      }
      build.filter(server,cookies, payload, 200,
        (res) ->
          res.body.should.be.an 'Array'
          res.body.length.should.equal 1
          done()
      )
      return

    it 'should not assign any default browser when it is not given.', (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "uReport" }
          ],
          "type" : [
              { "type" : "UI" }
          ],
          "team" : [
              { "team" : "Team2" }
          ],
          "range" : 20
      }
      build.filter(server,cookies, payload, 200,
        (res) ->
          res.body.should.be.an 'Array'
          res.body.length.should.equal 7
          done()
      )
      return

    it 'should return provided version', (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "uReport" }
          ],
          "type" : [
              { "type" : "UI" }
          ],
          "version" : [
              { "version" : "2.1" }
          ]
          "range" : 20
      }
      build.filter(server,cookies, payload, 200,
        (res) ->
          res.body.should.be.an 'Array'
          res.body.length.should.equal 1
          done()
      )
      return

    it 'should return provided device', (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "uReport" }
          ],
          "type" : [
              { "type" : "UI" }
          ],
          "device" : [
              { "device" : "iPhoneX" }
          ]
          "range" : 20
      }
      build.filter(server,cookies, payload, 200,
        (res) ->
          res.body.should.be.an 'Array'
          res.body.length.should.equal 1
          done()
      )
      return

    it 'should return provided browser type', (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "uReport" }
          ],
          "type" : [
              { "type" : "UI" }
          ],
          "team" : [
              { "team" : "Team2" }
          ],
          "browser" : [
            { "browser" : {$regex: "ie", $options:"i"}}
          ],
          "range" : 20
      }
      build.filter(server,cookies, payload, 200,
        (res) ->
          res.body.should.be.an 'Array'
          res.body.length.should.equal 3
          done()
      )
      return

    it 'should return error when product is not given', (done) ->
      payload = {
          "is_archive" : false,
          "type" : [
              { "type" : "UI" }
          ],
          "team" : [
              { "team" : "Team2" }
          ],
          "browser" : [
            { "browser" : "ie"}
          ],
          "range" : 20
      }
      build.filter(server,cookies, payload, 400,
        (res) ->
          res.body.should.be.an 'Object'
          res.body.error.should.include "mandatory"
          done()
      )
      return

    it 'should return error when type is not given', (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "uReport" }
          ],
          "team" : [
              { "team" : "Team2" }
          ],
          "browser" : [
            { "browser" : "ie"}
          ],
          "range" : 20
      }
      build.filter(server,cookies, payload, 400,
        (res) ->
          res.body.should.be.an 'Object'
          res.body.error.should.include "mandatory"
          done()
      )
      return

  describe 'find build by ID', ->
    existbuild = undefined;
    before (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "UpdateProduct" }
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
          existbuild = res.body[0]
          done()
      )
      return

    it 'should find a build', (done) ->
      build.findById(server, cookies, existbuild._id, 200,
        (res) ->
          res.body.should.be.an 'Object'
          res.body.product.should.be.equal 'UpdateProduct'
          done()
      )
      return

    it 'should not find a build when ID is not valid', (done) ->
      build.findById(server, cookies, "598f5d31fa965603f86b2d35", 404,
        (res) ->
          res.error.should.exist
          res.error.text.should.contains "598f5d31fa965603f86b2d35"
          done()
      )
      return

  describe 'update build info', ->
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
          ]
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

    it 'should update a build parameter', (done) ->
        date = new Date("2015-03-25T12:00:00.000Z")
        build.update(server,cookies,
            existbuild._id,
            {
                start_time: date,
                end_time: date
                owner: 'Tester'
                is_archive: false
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateProduct'
                res.body.owner.should.be.equal 'Tester'
                res.body.start_time.should.be.equal "2015-03-25T12:00:00.000Z"
                res.body.end_time.should.be.equal "2015-03-25T12:00:00.000Z"
                done()
        )
        return

    it 'should update a build pass status', (done) ->
        build.updateStatus(server,cookies,
            existbuild._id,
            {
                pass: 18,
                fail: undefined,
                skip: "4",
                warning: null
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateProduct'
                res.body.status.pass.should.be.equal 28
                res.body.status.fail.should.be.equal 9
                res.body.status.skip.should.be.equal 11
                res.body.status.warning.should.be.equal 12
                res.body.status.total.should.be.equal 60
                done()
        )
        return

    it 'should update a build status', (done) ->
        build.updateStatus(server,cookies,
            existbuild._id,
            {
                pass: 0,
                fail: 2,
                skip: 4,
                warning: 0
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateProduct'
                res.body.status.pass.should.be.equal 28
                res.body.status.fail.should.be.equal 11
                res.body.status.skip.should.be.equal 15
                res.body.status.warning.should.be.equal 12

                done()
        )
        return

    it 'should update a build comments', (done) ->
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
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateCommentAndOutage'
                res.body.comments.should.be.an 'Array'
                res.body.comments.length.should.equal 2

                res.body.comments[0].user.should.be.equal "Update user"
                res.body.comments[0].message.should.be.equal "this is just a updated message."
                res.body.comments[0].time.should.exists
                res.body.comments[1].user.should.be.equal "Update user"
                res.body.comments[1].message.should.be.equal 'this is just another updated message.'
                res.body.comments[1].time.should.exists

                done()
        )
        return

    it 'should not update a build product, type and team', (done) ->
      build.update(server,cookies,
        existbuild._id,
        {
          product: "some product"
          type: "some type"
          team: "some team"
        },
        200,
        (res) ->
          res.error.should.exist
          res.body.product.should.be.equal 'UpdateProduct'
          res.body.type.should.be.equal 'API'
          res.body.team.should.be.equal 'UpdateTeam'
          done()
      )
      return

    it 'should not update a build when ID is not valid', (done) ->
      build.update(server, cookies, "598f5d31fa965603f86b2d35", {}, 404,
        (res) ->
            res.error.should.exist
            res.error.text.should.contains "598f5d31fa965603f86b2d35"
            done()
      )
      return

  describe 'add Comments and Outages', ->
    existbuild = undefined;
    existbuildWithoutComment = undefined;
    before (done) ->
      payload = {
          "is_archive" : false,
          "product" : [
              { "product" : "UpdateProduct" },
              { "product" : "UpdateComment" }
          ],
          "type" : [
              { "type" : "API" }
          ],
          "browser" : [
              { "browser" : null }
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
                existbuildWithoutComment = res.body[1]
            else
                existbuild = res.body[1]
                existbuildWithoutComment = res.body[0]
            done()
      )
      return

    it 'should add comment to a build does not have comment', (done) ->
        # date = new Date("2015-03-25T12:00:00.000Z")
        build.addComment(server,cookies,
            existbuildWithoutComment._id,
            {
                comment:{ 
                    user: "Mike"
                    message: "This build is very bad, everything is broken."
                }
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateComment'
                res.body.comments.should.be.an 'Array'
                res.body.comments.length.should.equal 1
                res.body.comments[0].user.should.be.equal "Mike"
                res.body.comments[0].message.should.be.equal "This build is very bad, everything is broken."
                res.body.comments[0].time.should.exists
                done()
        )
        return

    it 'should add comment to a build has comment', (done) ->
        # date = new Date("2015-03-25T12:00:00.000Z")
        build.addComment(server,cookies,
            existbuild._id,
            {
                comment:{ 
                    user: "Jason"
                    message: "Come on, everything is broken."
                }
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateProduct'
                res.body.comments.should.be.an 'Array'
                res.body.comments.length.should.equal 2

                res.body.comments[0].user.should.be.equal "Super user"
                res.body.comments[0].message.should.be.equal "this is just a message."
                res.body.comments[0].time.should.exists
                res.body.comments[1].user.should.be.equal "Jason"
                res.body.comments[1].message.should.be.equal "Come on, everything is broken."
                res.body.comments[1].time.should.exists
                done()
        )
        return

    it 'should add outage to a build does not have outage', (done) ->
        build.addOutage(server,cookies,
            existbuildWithoutComment._id,
            {
                pattern: '^\s*Nullpointer exception\s*$',
                search_type: 'regex',
                caused_by: 'System Error',
                tracking: {
                    number : 'JIRA-2234'
                },
                exceptions: [
                    'TEST2234', 'TEST2235'
                ],
                impact_test:{
                    fail: 6,
                    skip: 4,
                    warning: 0
                }
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateComment'
                res.body.outages.should.be.an 'Array'
                res.body.outages.length.should.equal 1
                res.body.outages[0].pattern.should.be.equal "^\s*Nullpointer exception\s*$"
                res.body.outages[0].search_type.should.be.equal "regex"
                res.body.outages[0].caused_by.should.be.equal "System Error"
                res.body.outages[0].tracking.number.should.be.equal 'JIRA-2234'
                res.body.outages[0].impact_test.should.be.an 'Object'
                res.body.outages[0].impact_test.warning.should.be.equal 0
                res.body.outages[0].exceptions.length.should.be.equal 2
                done()
        )
        return

    it 'should update outage to a build has outage', (done) ->
        build.addOutage(server,cookies,
            existbuild._id,
            {
                pattern: 'Nullpointer exception',
                search_type: 'STRING',
                caused_by: 'System Error',
                tracking: {
                    'number' : 'JIRA-8888'
                },
                exceptions: [
                    'TEST2234', 'TEST2235','TEST2236', 'TEST2237'
                ],
                impact_test:{
                    fail: 16,
                    skip: 14,
                    warning: 0
                }
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateProduct'
                res.body.type.should.be.equal 'API'
                res.body.device.should.be.equal 'Windows 7'

                res.body.outages.should.be.an 'Array'
                res.body.outages.length.should.equal 1

                res.body.outages[0].pattern.should.be.equal "Nullpointer exception"
                res.body.outages[0].search_type.should.be.equal "STRING"
                res.body.outages[0].caused_by.should.be.equal "System Error"

                res.body.outages[0].impact_test.should.be.an 'Object'
                res.body.outages[0].impact_test.fail.should.be.equal 16
                res.body.outages[0].impact_test.skip.should.be.equal 14
                res.body.outages[0].exceptions.length.should.be.equal 4
                done()
        )
        return

    it 'should update comment to exist outage', (done) ->
        build.addOutageComment(server,cookies,
            existbuild._id,
            {
                pattern: 'Nullpointer exception',
                search_type: 'STRING',
                comment: {
                    'user': 'Super user',
                    'message': 'this is just a message.',
                    'time': moment().add(4, 'hour').format()
                }
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateProduct'
                res.body.type.should.be.equal 'API'
                res.body.device.should.be.equal 'Windows 7'

                res.body.outages.should.be.an 'Array'
                res.body.outages.length.should.equal 1

                res.body.outages[0].comments.should.be.an 'Array'
                res.body.outages[0].comments.length.should.equal 1
                done()
        )
        return

    it 'should add outage to a build has outage', (done) ->
        build.addOutage(server,cookies,
            existbuild._id,
            {
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
            },
            200,
            (res) ->
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'UpdateProduct'
                res.body.outages.should.be.an 'Array'
                res.body.outages.length.should.equal 2

                res.body.outages[1].pattern.should.be.equal "^\s*Nullpointer exception\s*$"
                res.body.outages[1].search_type.should.be.equal "regex"
                res.body.outages[1].caused_by.should.be.equal "System Error"
                res.body.outages[1].impact_test.should.be.an 'Object'
                res.body.outages[1].impact_test.warning.should.be.equal 0
                res.body.outages[1].exceptions.length.should.be.equal 2
                done()
        )
        return

  describe 'create build', ->
    create_build_id = undefined
    it 'should create a new build with min params', (done) ->
        payload = {
            'product' : 'TestProductData',
            'type' : 'API',
            'team' : 'TeamX',
            'build' : 1
        }
        build.create(server,cookies,
            payload,
            200,
            (res) ->
                create_build_id = res.body._id
                res.body.should.be.an 'Object'
                res.body.product.should.be.equal 'TestProductData'
                res.body.type.should.be.equal 'API'
                res.body.team.should.be.equal 'TeamX'
                res.body.build.should.be.equal 1
                res.body.is_archive.should.be.equal false
                res.body.status.should.be.an 'Object'
                res.body.status.total.should.be.equal 0
                res.body.status.pass.should.be.equal 0
                res.body.status.fail.should.be.equal 0
                res.body.status.skip.should.be.equal 0
                res.body.status.warning.should.be.equal 0
                res.body.outages.length.should.equal 0
                res.body.comments.length.should.equal 0
                done()
        )
        return

    after (done) ->
      build.delete(server,cookies, create_build_id, 200,
        (res) ->
          done()
      )
      return

  describe 'create build with missing params', ->
    it 'should not create a new build', (done) ->
        payload = {
            'product' : 'TestProductData'
        }
        build.create(server,cookies,
            payload,
            400,
            (res) ->
                res.body.error.should.equal 'Type is mandatory'
                done()
        )
        return

    it 'should not create a new build when miss build', (done) ->
        payload = {
            'product' : 'TestProductData',
            'type' : 'API',
            'team' : 'TEAMTest'
        }
        build.create(server,cookies,
            payload,
            400,
            (res) ->
                res.body.error.should.equal 'Build is mandatory'
                done()
        )
        return

    describe 'update status batch', ->
        it 'should calculate tests status and not update build info', (done) ->
            buildId = "6156f5ad744820091c9305b0"
            # check build before update
            build.findById(server, cookies, buildId, 200,
                (res) ->
                    res.body.status.total.should.be.equal 10
                    res.body.status.skip.should.be.equal 3
                    res.body.status.fail.should.be.equal 3
                    res.body.status.pass.should.be.equal 4
                    
                    build.endBatch(server,cookies,buildId, {is_update_build_status: false}
                        200,
                        (res) ->
                            console.log(res.body)
                            res.body.status.total.should.equal 21
                            res.body.status.skip.should.equal 7
                            res.body.status.fail.should.equal 7
                            res.body.status.pass.should.equal 7
                            # check build after update
                            build.findById(server, cookies, buildId, 200,
                                (res) ->
                                    res.body.should.be.an 'Object'
                                    res.body.status.total.should.be.equal 10
                                    res.body.status.skip.should.be.equal 3
                                    res.body.status.fail.should.be.equal 3
                                    res.body.status.pass.should.be.equal 4
                                    done()
                            )
                    )
            )
            return

        it 'should calculate tests status and update build info', (done) ->
            buildId = "6156f5ad744820091c9305b0"
            # check build before update
            build.findById(server, cookies, buildId, 200,
                (res) ->
                    res.body.status.total.should.be.equal 10
                    res.body.status.skip.should.be.equal 3
                    res.body.status.fail.should.be.equal 3
                    res.body.status.pass.should.be.equal 4
                    
                    build.endBatch(server,cookies,buildId, {}
                        200,
                        (res) ->
                            res.body.status.total.should.equal 21
                            res.body.status.skip.should.equal 7
                            res.body.status.fail.should.equal 7
                            res.body.status.pass.should.equal 7
                            # check build after update
                            build.findById(server, cookies, buildId, 200,
                                (res) ->
                                    res.body.should.be.an 'Object'
                                    res.body.status.total.should.be.equal 21
                                    res.body.status.skip.should.be.equal 7
                                    res.body.status.fail.should.be.equal 7
                                    res.body.status.pass.should.be.equal 7
                                    done()
                            )
                    )
            )
            return
        it 'should calculate tests status and set pass to 0 if not found', (done) ->
            buildId = "6156f5ad744820091c9305b2"
            # check build before update
            build.findById(server, cookies, buildId, 200,
                (res) ->
                    res.body.status.total.should.be.equal 0
                    res.body.status.skip.should.be.equal 0
                    res.body.status.fail.should.be.equal 0
                    res.body.status.pass.should.be.equal 0
                    
                    build.endBatch(server,cookies,buildId, {}
                        200,
                        (res) ->
                            console.log(res.body)
                            res.body.status.total.should.equal 1
                            res.body.status.skip.should.equal 1
                            res.body.status.pass.should.equal 0
                            res.body.status.fail.should.equal 0
                            # check build after update
                            build.findById(server, cookies, buildId, 200,
                                (res) ->
                                    res.body.should.be.an 'Object'
                                    res.body.status.total.should.be.equal 1
                                    res.body.status.skip.should.be.equal 1
                                    res.body.status.pass.should.be.equal 0
                                    res.body.status.fail.should.be.equal 0
                                    done()
                            )
                    )
            )
            return
        it 'should return message for build has no tests', (done) ->
            build.endBatch(server,cookies, "6156f5ad744820091c9305b3", {}
                404,
                (res) ->
                    res.body.message.should.equal "Cannot find any tests with build id 6156f5ad744820091c9305b3"
                    done()
            )
            return