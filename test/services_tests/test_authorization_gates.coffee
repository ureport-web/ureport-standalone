###
Role / licence gates for privileged endpoints (BUG-005) and malformed-id handling (BUG-004).
Frontend permission checks are presentation only; these routes must enforce roles themselves.
###
server = require('../../app')
auth = require('../api_objects/auth_api_object')
chai = require('chai')
chaiHttp = require('chai-http')
should = chai.should()
chai.use chaiHttp

VALID_ID = '5f0000000000000000000001'

login = (username, cb) ->
  auth.login server, { username: username, password: 'password' }, 200, (res) ->
    cb res.headers['set-cookie'].pop().split(';')[0]

call = (method, path, cookies, body, cb) ->
  req = chai.request(server)[method](path)
  req.cookies = cookies
  req.send(body or {}).end (err, res) ->
    cb(if err then err.response else res)

describe 'Authorization gates', ->
  cookies = {}

  before (done) ->
    login 'Viewer', (c) ->
      cookies.viewer = c
      login 'test@test.com', (c) ->
        cookies.operator = c
        login 'admin@test.com', (c) ->
          cookies.admin = c
          done()
    return

  # [method, path, body]
  adminOnly = [
    ['post',   "/api/plugins/x/install", {}]
    ['post',   "/api/plugins/x/load", {}]
    ['post',   "/api/admin/db/purge/strip-steps", { untilDate: '2000-01-01' }]
    ['delete', "/api/quarantine/#{VALID_ID}", {}]
    ['delete', "/api/quarantine", { ids: [VALID_ID] }]
  ]
  operatorPlus = [
    ['post', "/api/build/comment/#{VALID_ID}", { comment: { message: 'x' } }]
    ['put',  "/api/build/comment/#{VALID_ID}", { comments: [] }]
    ['put',  "/api/assignment/resolve/bulk", { ids: [VALID_ID] }]
    ['post', "/api/assignment/followup", { ids: [VALID_ID] }]
    ['post', "/api/ai/analyze-test/#{VALID_ID}", {}]
  ]

  describe 'admin-only endpoints', ->
    for [method, path, body] in adminOnly
      do (method, path, body) ->
        for role in ['viewer', 'operator']
          do (role) ->
            it "#{role} cannot #{method.toUpperCase()} #{path}", (done) ->
              call method, path, cookies[role], body, (res) ->
                res.should.have.status 403
                done()
              return

  describe 'operator+ endpoints', ->
    for [method, path, body] in operatorPlus
      do (method, path, body) ->
        it "viewer cannot #{method.toUpperCase()} #{path}", (done) ->
          call method, path, cookies.viewer, body, (res) ->
            res.should.have.status 403
            done()
          return

    it 'operator can resolve/bulk (gate passes)', (done) ->
      call 'put', '/api/assignment/resolve/bulk', cookies.operator, { ids: [VALID_ID] }, (res) ->
        res.should.have.status 200
        done()
      return

    it 'admin can strip-steps (gate passes)', (done) ->
      call 'post', '/api/admin/db/purge/strip-steps', cookies.admin, { untilDate: '2000-01-01' }, (res) ->
        res.should.have.status 200
        done()
      return

  describe 'analyze-test licence gate', ->
    it 'operator is refused without the auto-triage feature', (done) ->
      call 'post', "/api/ai/analyze-test/#{VALID_ID}", cookies.operator, {}, (res) ->
        res.should.have.status 403
        res.body.error.should.match /auto-triage/
        done()
      return

  describe 'malformed ids', ->
    for [method, path] in [['get', '/api/build/not-an-id'], ['delete', '/api/build/not-an-id'], ['put', '/api/build/not-an-id'], ['delete', '/api/quarantine/not-an-id'], ['get', '/api/assignment/not-an-id']]
      do (method, path) ->
        it "#{method.toUpperCase()} #{path} returns 400, not 500", (done) ->
          call method, path, cookies.admin, {}, (res) ->
            res.should.have.status 400
            res.body.error.should.match /^Invalid /
            done()
          return

describe 'GET /api/version', ->
  it 'does not expose the raw licence token to anonymous callers', (done) ->
    chai.request(server).get('/api/version').end (err, res) ->
      res.should.have.status 200
      res.body.should.not.have.property 'licenseToken'
      res.body.should.have.property('license').that.has.property('isCommunity')
      done()
    return
