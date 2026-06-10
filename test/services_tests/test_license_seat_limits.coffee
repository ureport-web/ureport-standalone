server = require('../../app')
mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')

should = chai.should()
chai.use chaiHttp

User = require('../../src/models/user')
{ setCachedState, invalidateCache } = require('../../src/utils/license')

# ── Test-env cache shim ───────────────────────────────────────────────────────
# server.js initializes app.locals.systemSettingCache, but tests load app.js
# directly (server.js is never required). Provide a minimal shim so
# getSystemSetting() doesn't crash and falls back to the real DB.
before (done) ->
  unless server.locals.systemSettingCache
    server.locals.systemSettingCache =
      get: (key) -> Promise.resolve({ err: null, value: {} })
      set: (key, val) -> Promise.resolve({ err: null })
      getStats: -> Promise.resolve({ err: null })
  done()
  return

# ──────────────────────────────────────────────────────────────────────────────
# POST /signup — admin create seat limit
# ──────────────────────────────────────────────────────────────────────────────
describe 'POST /signup — admin create seat limit', ->
  adminCookies = null
  testUsername = 'seatLimitCreateUser'

  before (done) ->
    chai.request(server)
      .post('/api/login')
      .send({ username: 'admin@test.com', password: 'password' })
      .end (err, res) ->
        res.should.have.status 200
        adminCookies = res.headers['set-cookie'].pop().split(';')[0]
        done()
    return

  afterEach (done) ->
    invalidateCache()
    p = User.deleteMany({ username: testUsername }).exec()
    p.then -> done()
    p['catch'] (err) -> done(err)
    return

  it 'returns 403 when at seat limit', (done) ->
    setCachedState({ seats: 0, lanes: 3, dashboards: 3, valid: true, plan: 'pro', isCommunity: false })
    req = chai.request(server).post('/api/signup')
    req.cookies = adminCookies
    req.send({
      username: testUsername
      email: 'seatlimitcreate@test.com'
      password: 'password123'
      role: 'viewer'
      adminCreated: true
    }).end (err, res) ->
      res.should.have.status 403
      res.body.error.should.equal 'User seat limit reached'
      res.body.limit.should.equal 0
      done()
    return

  it 'returns 200 when under seat limit', (done) ->
    setCachedState({ seats: 9999, lanes: 3, dashboards: 3, valid: true, plan: 'pro', isCommunity: false })
    req = chai.request(server).post('/api/signup')
    req.cookies = adminCookies
    req.send({
      username: testUsername
      email: 'seatlimitcreate@test.com'
      password: 'password123'
      role: 'viewer'
      adminCreated: true
    }).end (err, res) ->
      res.should.have.status 200
      res.body.message.should.equal 'User created successfully.'
      done()
    return

# ──────────────────────────────────────────────────────────────────────────────
# PUT /approve/:id — seat limit
# ──────────────────────────────────────────────────────────────────────────────
describe 'PUT /approve/:id — seat limit', ->
  adminCookies = null
  pendingUserId = null

  before (done) ->
    chai.request(server)
      .post('/api/login')
      .send({ username: 'admin@test.com', password: 'password' })
      .end (err, res) ->
        res.should.have.status 200
        adminCookies = res.headers['set-cookie'].pop().split(';')[0]
        done()
    return

  beforeEach (done) ->
    p = User.create({
      username: 'pendingTestUser'
      email: 'pendingtestuser@test.com'
      password: 'password123'
      role: 'viewer'
      status: 'pending'
    })
    p.then (user) ->
      pendingUserId = user._id.toString()
      done()
    p['catch'] (err) -> done(err)
    return

  afterEach (done) ->
    invalidateCache()
    p = User.deleteMany({ username: 'pendingTestUser' }).exec()
    p.then -> done()
    p['catch'] (err) -> done(err)
    return

  it 'returns 403 when at seat limit', (done) ->
    setCachedState({ seats: 0, lanes: 3, dashboards: 3, valid: true, plan: 'pro', isCommunity: false })
    req = chai.request(server).put('/api/user/approve/' + pendingUserId)
    req.cookies = adminCookies
    req.send({}).end (err, res) ->
      res.should.have.status 403
      res.body.error.should.equal 'User seat limit reached'
      done()
    return

  it 'returns 200 and activates user when under seat limit', (done) ->
    setCachedState({ seats: 9999, lanes: 3, dashboards: 3, valid: true, plan: 'pro', isCommunity: false })
    req = chai.request(server).put('/api/user/approve/' + pendingUserId)
    req.cookies = adminCookies
    req.send({}).end (err, res) ->
      res.should.have.status 200
      res.body.status.should.equal 'active'
      done()
    return

# ──────────────────────────────────────────────────────────────────────────────
# GET /confirm-email/:token — seat limit
# ──────────────────────────────────────────────────────────────────────────────
describe 'GET /confirm-email/:token — seat limit', ->
  testToken = 'test-confirm-token-seat-abc'

  beforeEach (done) ->
    p = User.create({
      username: 'emailConfirmUser'
      email: 'emailconfirmuser@test.com'
      password: 'password123'
      role: 'viewer'
      status: 'pending'
      confirmationToken: testToken
      confirmationTokenExpires: new Date(Date.now() + 3600000)
    })
    p.then -> done()
    p['catch'] (err) -> done(err)
    return

  afterEach (done) ->
    invalidateCache()
    p = User.deleteMany({ username: 'emailConfirmUser' }).exec()
    p.then -> done()
    p['catch'] (err) -> done(err)
    return

  it 'returns 403 when at seat limit', (done) ->
    setCachedState({ seats: 0, lanes: 3, dashboards: 3, valid: true, plan: 'pro', isCommunity: false })
    chai.request(server)
      .get('/api/confirm-email/' + testToken)
      .end (err, res) ->
        res.should.have.status 403
        done()
    return

  it 'activates user and returns 200 when under seat limit', (done) ->
    setCachedState({ seats: 9999, lanes: 3, dashboards: 3, valid: true, plan: 'pro', isCommunity: false })
    chai.request(server)
      .get('/api/confirm-email/' + testToken)
      .end (err, res) ->
        res.should.have.status 200
        res.body.message.should.include 'Email confirmed'
        done()
    return
