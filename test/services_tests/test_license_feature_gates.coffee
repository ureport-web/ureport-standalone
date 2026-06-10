server = require('../../app')
mongoose = require('mongoose')
chai = require('chai')
chaiHttp = require('chai-http')

should = chai.should()
chai.use chaiHttp

Setting = require('../../src/models/setting')
Dashboard = require('../../src/models/dashboard')
User = require('../../src/models/user')
{ setCachedState, invalidateCache } = require('../../src/utils/license')

dashboard = require('../api_objects/dashboard_api_object')

# ── Test-env cache shim ───────────────────────────────────────────────────────
before (done) ->
  unless server.locals.systemSettingCache
    server.locals.systemSettingCache =
      get: (key) -> Promise.resolve({ err: null, value: {} })
      set: (key, val) -> Promise.resolve({ err: null })
      getStats: -> Promise.resolve({ err: null })
  done()
  return

# ──────────────────────────────────────────────────────────────────────────────
# PUT /setting/:id — notification rules license gate
# ──────────────────────────────────────────────────────────────────────────────
describe 'PUT /setting/:id — notification rules license gate', ->
  adminCookies = null
  testSettingId = null

  before (done) ->
    chai.request(server)
      .post('/api/login')
      .send({ username: 'admin@test.com', password: 'password' })
      .end (err, res) ->
        res.should.have.status 200
        adminCookies = res.headers['set-cookie'].pop().split(';')[0]
        p = Setting.create({ product: 'gate-test-product', type: 'gate-test-type' })
        p.then (s) ->
          testSettingId = s._id.toString()
          done()
        p['catch'] (err) -> done(err)
    return

  after (done) ->
    invalidateCache()
    p = Setting.deleteMany({ product: 'gate-test-product' }).exec()
    p.then -> done()
    p['catch'] (err) -> done(err)
    return

  afterEach (done) ->
    invalidateCache()
    done()
    return

  it 'returns 403 with community license when notification rules present', (done) ->
    setCachedState({ seats: 5, lanes: 3, dashboards: 3, features: [], valid: true, plan: 'community', isCommunity: true })
    req = chai.request(server).put('/api/setting/' + testSettingId)
    req.cookies = adminCookies
    req.send({
      product: 'gate-test-product'
      type: 'gate-test-type'
      notification: { rules: [{ event: 'build_fail', channel: 'email', recipients: ['a@b.com'] }] }
    }).end (err, res) ->
      res.should.have.status 403
      res.body.error.should.equal 'Notification rules require a Pro license'
      done()
    return

  it 'returns 200 with pro license when notification rules present', (done) ->
    setCachedState({ seats: 5, lanes: 3, dashboards: 3, features: ['notifications'], valid: true, plan: 'pro', isCommunity: false })
    req = chai.request(server).put('/api/setting/' + testSettingId)
    req.cookies = adminCookies
    req.send({
      product: 'gate-test-product'
      type: 'gate-test-type'
      notification: { rules: [{ event: 'build_fail', channel: 'email', recipients: ['a@b.com'] }] }
    }).end (err, res) ->
      res.should.have.status 200
      done()
    return

  it 'returns 200 with community license when no notification rules', (done) ->
    setCachedState({ seats: 5, lanes: 3, dashboards: 3, features: [], valid: true, plan: 'community', isCommunity: true })
    req = chai.request(server).put('/api/setting/' + testSettingId)
    req.cookies = adminCookies
    req.send({
      product: 'gate-test-product'
      type: 'gate-test-type'
    }).end (err, res) ->
      res.should.have.status 200
      done()
    return

  it 'returns 200 with community license when notification rules is empty array', (done) ->
    setCachedState({ seats: 5, lanes: 3, dashboards: 3, features: [], valid: true, plan: 'community', isCommunity: true })
    req = chai.request(server).put('/api/setting/' + testSettingId)
    req.cookies = adminCookies
    req.send({
      product: 'gate-test-product'
      type: 'gate-test-type'
      notification: { rules: [] }
    }).end (err, res) ->
      res.should.have.status 200
      done()
    return

# ──────────────────────────────────────────────────────────────────────────────
# POST /dashboard/:id/share — dashboard sharing license gate
# ──────────────────────────────────────────────────────────────────────────────
describe 'POST /dashboard/:id/share — dashboard sharing license gate', ->
  adminCookies = null
  testDashboardId = null
  adminUserId = null

  before (done) ->
    chai.request(server)
      .post('/api/login')
      .send({ username: 'admin@test.com', password: 'password' })
      .end (err, res) ->
        res.should.have.status 200
        adminCookies = res.headers['set-cookie'].pop().split(';')[0]
        p = User.findOne({ username: 'admin@test.com' }).exec()
        p.then (u) ->
          adminUserId = u._id.toString()
          return Dashboard.create({ user: adminUserId, name: 'share-gate-test', widgets: [] })
        .then (d) ->
          testDashboardId = d._id.toString()
          done()
        p['catch'] (err) -> done(err)
    return

  after (done) ->
    invalidateCache()
    p = Dashboard.deleteMany({ name: 'share-gate-test' }).exec()
    p.then -> done()
    p['catch'] (err) -> done(err)
    return

  afterEach (done) ->
    invalidateCache()
    done()
    return

  it 'returns 403 with community license on POST share', (done) ->
    setCachedState({ seats: 5, lanes: 3, dashboards: null, features: [], valid: true, plan: 'community', isCommunity: true })
    dashboard.share server, adminCookies, testDashboardId, 403, (res) ->
      res.body.error.should.equal 'Dashboard sharing requires a Pro license'
      done()
    return

  it 'returns 200 with pro license on POST share', (done) ->
    setCachedState({ seats: 5, lanes: 3, dashboards: null, features: ['dashboard_sharing'], valid: true, plan: 'pro', isCommunity: false })
    dashboard.share server, adminCookies, testDashboardId, 200, (res) ->
      res.body.should.have.property 'share_token'
      done()
    return

  it 'returns 403 with community license on DELETE share', (done) ->
    setCachedState({ seats: 5, lanes: 3, dashboards: null, features: [], valid: true, plan: 'community', isCommunity: true })
    dashboard.unshare server, adminCookies, testDashboardId, 403, (res) ->
      res.body.error.should.equal 'Dashboard sharing requires a Pro license'
      done()
    return
