#load application models
server = require('../../app')
_ = require('underscore');
user = require('../api_objects/user_api_object')
auth = require('../api_objects/auth_api_object')

mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')
moment = require('moment')

should = chai.should()
chai.use chaiHttp

describe 'User with viewer access', ->
    cookies = undefined;
    himself = "ToBeUpdateViewer3"
    before (done) ->
        auth.login(server, {username: himself, password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                done()
        )
        return

    it 'cannot update user', (done) ->
        payload = {
            role: "viewer",
            email: "test@test.com"
        }
        user.update(server, cookies, "ToBeUpdateViewer1", payload, 403,
            (rs) ->
                rs.body.error.should.equal 'You don\'t have permission'
                done()
            )
        return

    it 'can only update himself', (done) ->
        payload = {
            email: "updateemail@test.com",
            position: "QA Manager",
            displayname: "#1 Boss",
            settings: {
                language: "fr",
                theme : {
                    name: "slate",
                    type: "dark"
                }
                report: {
                    assignmentRI : 30,
                    displaySearchAndFilterBoxInStep: true,
                    displaySelfAN: false,
                }
            }
        }
        user.update(server, cookies, himself, payload, 200,
            (rs) ->
                rs.body.username.should.equal himself
                rs.body.email.should.equal 'updateemail@test.com'
                rs.body.displayname.should.equal '#1 Boss'
                rs.body.role.should.equal 'viewer'
                rs.body.position.should.equal 'QA Manager'

                rs.body.settings.language.should.equal 'fr'
                rs.body.settings.theme.name.should.equal 'slate'
                rs.body.settings.theme.type.should.equal 'dark'
                rs.body.settings.report.assignmentRI.should.equal 30
                rs.body.settings.report.displaySearchAndFilterBoxInStep.should.equal true
                rs.body.settings.report.displaySelfAN.should.equal false
                done()
            )
        return

    describe 'User with viewer access', ->
        viewer = null
        before (done) ->
            auth.login(server, {username: "admin@test.com", password:"password"}, 200, 
            (res)->
                # login as admin to get a id of operator
                user.search(server,res.headers['set-cookie'].pop().split(';')[0],{username:"ToBeUpdateViewer3"},200,
                (r) ->
                    viewer = r.body[0]
                    done()
                )
            )

            return

        it 'can update his preference - theme', (done) ->
            payload = {
                user: viewer._id,
                theme : {
                    name: "slate",
                    type: "dark"
                }
            }
            user.updatePreference(server, cookies, payload, 200, "theme"
                (rs) ->
                    rs.body.settings.theme.name.should.equal 'slate'
                    rs.body.settings.theme.type.should.equal 'dark'
                    done()
                )
            return

        it 'can update his preference - language', (done) ->
            payload = {
                user: viewer._id,
                language: "ch"
            }
            user.updatePreference(server, cookies, payload, 200, "language"
                (rs) ->
                    rs.body.settings.language.should.equal 'ch'
                    done()
                )
            return

        it 'can update his preference - report', (done) ->
            payload = {
                user: viewer._id,
                report: {
                    assignmentRI : 30,
                    displaySearchAndFilterBoxInStep: true,
                    displaySelfAN: false,
                }
            }
            user.updatePreference(server, cookies, payload, 200, "report"
                (rs) ->
                    rs.body.settings.report.assignmentRI.should.equal 30
                    rs.body.settings.report.displaySearchAndFilterBoxInStep.should.equal true
                    rs.body.settings.report.displaySelfAN.should.equal false
                    done()
                )
            return

        it 'can update his preference - dashboard', (done) ->
            payload = {
                user: viewer._id,
                dashboard : {
                    isShowWidgetBorder: false,
                    isExpandMenu: true,
                    isWidgetBarOnHover: false,
                    isExpandMenu1: "doesnot exist"
                }
            }
            user.updatePreference(server, cookies, payload, 200, "dashboard"
                (rs) ->
                    rs.body.settings.dashboard.isShowWidgetBorder.should.equal false
                    rs.body.settings.dashboard.isExpandMenu.should.equal true
                    rs.body.settings.dashboard.isWidgetBarOnHover.should.equal false
                    rs.body.settings.dashboard.should.not.have.property "isExpandMenu1"
                    done()
                )
            return

describe 'User with operator access', ->
    cookies = undefined;
    himself = "ToBeUpdateViewer2"
    before (done) ->
        auth.login(server, {username: himself, password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                done()
        )
        return

    it 'cannot update user', (done) ->
        payload = {
            role: "viewer",
            email: "test@test.com"
        }
        user.update(server, cookies, "ToBeUpdateViewer1", payload, 403,
            (rs) ->
                rs.body.error.should.equal 'You don\'t have permission'
                done()
            )
        return

    it 'cannot update role even to himself', (done) ->
        payload = {
            role: "admin"
        }
        user.update(server, cookies, himself, payload, 400,
            (rs) ->
                rs.body.error.should.equal 'You are not admin, and you cannot update the role field.'
                done()
            )
        return

    it 'can only update himself', (done) ->
        payload = {
            email: "updateemail@test.com",
            position: "QA Manager",
            displayname: "#1 Boss",
            settings: {
                language: "fr",
                theme : {
                    name: "slate",
                    type: "dark"
                }
                report: {
                    assignmentRI : 30,
                    displaySearchAndFilterBoxInStep: true,
                    displaySelfAN: false,
                }
            }
        }
        user.update(server, cookies, himself, payload, 200,
            (rs) ->
                rs.body.username.should.equal 'ToBeUpdateViewer2'
                rs.body.email.should.equal 'updateemail@test.com'
                rs.body.displayname.should.equal '#1 Boss'
                rs.body.role.should.equal 'operator'
                rs.body.position.should.equal 'QA Manager'

                rs.body.settings.language.should.equal 'fr'
                rs.body.settings.theme.name.should.equal 'slate'
                rs.body.settings.theme.type.should.equal 'dark'
                rs.body.settings.report.assignmentRI.should.equal 30
                rs.body.settings.report.displaySearchAndFilterBoxInStep.should.equal true
                rs.body.settings.report.displaySelfAN.should.equal false
                done()
            )
        return

describe 'User with admin access', ->
    cookies = undefined;
    before (done) ->
        auth.login(server, {username: "admin@test.com", password:"password"}, 200, 
            (res)->
                cookies = res.headers['set-cookie'].pop().split(';')[0];
                done()
        )
        return

    it 'can sign up user and billing table', (done) ->
        payload = {
            username: "TestSignUpUser",
            password: "TestSignUpUser",
            role: "admin",
            email: "test@test.com",
            settings: {
                report: {
                    assignmentRI : 15,
                    displaySearchAndFilterBoxInStep: false,
                    displaySelfAN: true,
                    fieldDoesnotExist: "12"
                }
            }
        }
        user.create(server, cookies, payload,  200,
        (rs) ->
            rs.body.username.should.equal 'TestSignUpUser'
            rs.body.email.should.equal 'test@test.com'
            rs.body.displayname.should.equal 'TestSignUpUser'
            rs.body.role.should.equal 'admin'
            rs.body.settings.language.should.equal 'en'
            rs.body.settings.theme.name.should.equal 'bootstrap'
            rs.body.settings.theme.type.should.equal 'light'
            rs.body.settings.report.assignmentRI.should.equal 15
            rs.body.settings.report.displaySearchAndFilterBoxInStep.should.equal false
            rs.body.settings.report.displaySelfAN.should.equal true
            rs.body.settings.report.should.not.have.property "fieldDoesnotExist"
            done()
        )
        return

    it 'cannot update user password using update endpoint', (done) ->
        payload = {
            password: "updateemail@test.com"
        }
        user.update(server, cookies, "ToBeUpdateViewer1", payload, 400,
            (rs) ->
                rs.body.error.should.equal 'Cannot update password through user update, please use /reset to update the password'
                done()
            )
        return
    
    it 'cannot update username to a exist username', (done) ->
        payload = {
            username: "ToBeUpdateViewer2",
        }
        user.update(server, cookies, "ToBeUpdateViewer1", payload, 400,
            (rs) ->
                rs.body.error.should.equal 'Cannot update username to ToBeUpdateViewer2. It has been taken already! Please choose a different one.'
                done()
            )
        return

    it 'can update user', (done) ->
        payload = {
            role: "operator",
            email: "updateemail@test.com",
            position: "QA Manager",
            displayname: "#1 Boss",
            settings: {
                language: "fr",
                theme : {
                    name: "slate",
                    type: "dark"
                }
                report: {
                    assignmentRI : 30,
                    displaySearchAndFilterBoxInStep: true,
                    displaySelfAN: false,
                    status: {
                        all: false
                        fail: true
                        ki: true
                        not_pass: false
                        out: true
                        pass: false
                        rerun: false
                        skip: false
                    }
                }
            }
        }
        user.update(server, cookies, "ToBeUpdateViewer1", payload, 200,
            (rs) ->
                rs.body.username.should.equal 'ToBeUpdateViewer1'
                rs.body.email.should.equal 'updateemail@test.com'
                rs.body.displayname.should.equal '#1 Boss'
                rs.body.role.should.equal 'operator'
                rs.body.position.should.equal 'QA Manager'

                rs.body.settings.language.should.equal 'fr'
                rs.body.settings.theme.name.should.equal 'slate'
                rs.body.settings.theme.type.should.equal 'dark'
                rs.body.settings.report.assignmentRI.should.equal 30
                rs.body.settings.report.displaySearchAndFilterBoxInStep.should.equal true
                rs.body.settings.report.displaySelfAN.should.equal false

                # rs.body.settings.report.displaySelfAN.should.equal false
                done()
            )
        return
