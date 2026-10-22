###
Regression tests for analytics endpoints.

Lock in CURRENT behaviour for all 4 per-lane analytics routes:
  POST /api/analytics/top-failures
  POST /api/analytics/slowest-tests
  POST /api/analytics/pass-rate-history
  POST /api/analytics/build-duration-history

Tests verify:
  - 200 response and correct shape
  - optional field filters (team, version, browser, platform, platform_version, stage)
    narrow the build set used for analytics
  - 400 when required fields (product, type) are missing

Run NOW → all must pass.
After implementing custom-params feature → run again → must still pass.

Uses unique product prefix GapTest_Analytics_* to avoid seeded-data collisions.
All created builds/tests are cleaned up in after().
###

server   = require('../../app')
chai     = require('chai')
chaiHttp = require('chai-http')
mongoose = require('mongoose')
moment   = require('moment')
Build    = require('../../src/models/build')
Test     = require('../../src/models/test')
auth     = require('../api_objects/auth_api_object')

should = chai.should()
chai.use chaiHttp

TYPE = 'AnalyticsReg'

# ─── helpers ────────────────────────────────────────────────────────────────

analyticsPost = (server, cookies, route, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/analytics/' + route)
  req.cookies = cookies
  req.send(payload)
  .end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

# Create a build and return its _id (callback style)
createBuild = (server, cookies, payload, cb) ->
  req = chai.request(server).post('/api/build/')
  req.cookies = cookies
  req.send(payload)
  .end (err, res) ->
    cb(if err then null else res.body._id)

createBuilds = (server, cookies, payloads, cb) ->
  created = 0
  ids = []
  for p in payloads
    do (p) ->
      createBuild server, cookies, p, (id) ->
        ids.push id if id
        created++
        if created == payloads.length then cb(ids)

# ─── pass-rate-history (Build-only, no Test documents needed) ────────────

describe 'Regression: POST /analytics/pass-rate-history — optional field filtering', ->
  PROD = 'GapTest_Analytics_PassRate'
  cookies = undefined

  before (done) ->
    @timeout 20000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      now = new Date()
      payloads = [
        {
          product: PROD, type: TYPE, build: 1
          browser: 'chrome', team: 'QA', version: '1.0'
          platform: null, platform_version: null, stage: null, device: null
          start_time: moment().subtract(1, 'day').toDate()
          end_time:   moment().subtract(1, 'day').add(1, 'hour').toDate()
          status: { pass: 10, fail: 2, skip: 0, warning: 0, total: 12 }
        }
        {
          product: PROD, type: TYPE, build: 2
          browser: 'chrome', team: 'QA', version: '1.0'
          platform: null, platform_version: null, stage: null, device: null
          start_time: moment().subtract(2, 'day').toDate()
          end_time:   moment().subtract(2, 'day').add(1, 'hour').toDate()
          status: { pass: 8, fail: 4, skip: 0, warning: 0, total: 12 }
        }
        {
          product: PROD, type: TYPE, build: 3
          browser: 'firefox', team: 'Dev', version: '2.0'
          platform: 'android', platform_version: '12', stage: 'prod', device: null
          start_time: moment().subtract(1, 'day').toDate()
          end_time:   moment().subtract(1, 'day').add(2, 'hour').toDate()
          status: { pass: 5, fail: 5, skip: 0, warning: 0, total: 10 }
        }
        {
          product: PROD, type: TYPE, build: 4
          browser: 'chrome', team: 'QA', version: '1.0'
          platform: 'ios', platform_version: '15', stage: 'staging', device: null
          start_time: moment().subtract(1, 'day').toDate()
          end_time:   moment().subtract(1, 'day').add(1, 'hour').toDate()
          status: { pass: 9, fail: 1, skip: 0, warning: 0, total: 10 }
        }
      ]
      createBuilds server, cookies, payloads, -> done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'each entry has passRate field', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((r) -> r.passRate isnt undefined).should.be.true
      done()
    return

  it 'each entry has totalTests field', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((r) -> r.totalTests isnt undefined).should.be.true
      done()
    return

  it 'filter by browser=chrome reduces configCount', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE }, 200, (res) ->
      allConfigCount = res.body.reduce ((s, r) -> s + r.configCount), 0

      analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res2) ->
        chromeConfigCount = res2.body.reduce ((s, r) -> s + r.configCount), 0
        chromeConfigCount.should.be.at.most allConfigCount
        done()
    return

  it 'filter by team=Dev returns only Dev-lane history', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      # Dev only has 1 build → 1 data point
      res.body.length.should.equal 1
      done()
    return

  it 'filter by platform=ios returns only ios-lane history', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by stage=staging returns only staging-lane history', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE, stage: 'staging' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by platform_version=12 returns only android-lane history', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE, platform_version: '12' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'no-match filter returns empty array', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD, type: TYPE, browser: 'safari' }, 200, (res) ->
      res.body.should.deep.equal []
      done()
    return

  it 'returns 400 when product missing', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { type: TYPE }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

  it 'returns 400 when type missing', (done) ->
    analyticsPost server, cookies, 'pass-rate-history', { product: PROD }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

# ─── build-duration-history (Build-only) ───────────────────────────────

describe 'Regression: POST /analytics/build-duration-history — optional field filtering', ->
  PROD = 'GapTest_Analytics_Duration'
  cookies = undefined

  before (done) ->
    @timeout 20000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        {
          product: PROD, type: TYPE, build: 1
          browser: 'chrome', team: 'QA', version: '1.0'
          platform: null, platform_version: null, stage: null, device: null
          start_time: moment().subtract(2, 'day').toDate()
          end_time:   moment().subtract(2, 'day').add(2, 'hour').toDate()
          status: { pass: 10, fail: 0, skip: 0, warning: 0, total: 10 }
        }
        {
          product: PROD, type: TYPE, build: 2
          browser: 'chrome', team: 'QA', version: '1.0'
          platform: null, platform_version: null, stage: null, device: null
          start_time: moment().subtract(1, 'day').toDate()
          end_time:   moment().subtract(1, 'day').add(3, 'hour').toDate()
          status: { pass: 10, fail: 0, skip: 0, warning: 0, total: 10 }
        }
        {
          product: PROD, type: TYPE, build: 3
          browser: 'firefox', team: 'Dev', version: '2.0'
          platform: 'android', platform_version: '12', stage: 'prod', device: null
          start_time: moment().subtract(1, 'day').toDate()
          end_time:   moment().subtract(1, 'day').add(1, 'hour').toDate()
          status: { pass: 5, fail: 1, skip: 0, warning: 0, total: 6 }
        }
      ]
      createBuilds server, cookies, payloads, -> done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'each entry has durationMs field', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((r) -> r.durationMs isnt undefined).should.be.true
      done()
    return

  it 'durationMs is positive', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((r) -> r.durationMs > 0).should.be.true
      done()
    return

  it 'filter by browser=chrome returns fewer entries than unfiltered', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE }, 200, (res) ->
      total = res.body.length
      analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res2) ->
        res2.body.length.should.be.at.most total
        done()
    return

  it 'filter by team=Dev returns only Dev-lane history', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by platform=android returns only android-lane history', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE, platform: 'android' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by stage=prod returns only prod-lane history', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE, stage: 'prod' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'no-match filter returns empty array', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD, type: TYPE, browser: 'safari' }, 200, (res) ->
      res.body.should.deep.equal []
      done()
    return

  it 'returns 400 when product missing', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { type: TYPE }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

  it 'returns 400 when type missing', (done) ->
    analyticsPost server, cookies, 'build-duration-history', { product: PROD }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

# ─── top-failures (requires Test documents) ───────────────────────────

describe 'Regression: POST /analytics/top-failures — optional field filtering', ->
  PROD = 'GapTest_Analytics_TopFail'
  cookies = undefined
  buildIds = []

  before (done) ->
    @timeout 20000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      chromePayload =
        product: PROD, type: TYPE, build: 1
        browser: 'chrome', team: 'QA', version: '1.0'
        platform: null, platform_version: null, stage: null, device: null
        start_time: moment().subtract(1, 'day').toDate()
        end_time:   moment().subtract(1, 'day').add(1, 'hour').toDate()
        status: { pass: 5, fail: 3, skip: 0, warning: 0, total: 8 }
      firefoxPayload =
        product: PROD, type: TYPE, build: 2
        browser: 'firefox', team: 'Dev', version: '2.0'
        platform: 'ios', platform_version: '15', stage: 'staging', device: null
        start_time: moment().subtract(1, 'day').toDate()
        end_time:   moment().subtract(1, 'day').add(1, 'hour').toDate()
        status: { pass: 3, fail: 2, skip: 0, warning: 0, total: 5 }
      # Create builds sequentially so we know which ID belongs to which browser
      createBuild server, cookies, chromePayload, (chromeBuildId) ->
        createBuild server, cookies, firefoxPayload, (firefoxBuildId) ->
          ObjectId = mongoose.Types.ObjectId
          testDocs = [
            { build: new ObjectId(chromeBuildId),  uid: 'uid-test-a', name: 'Test Alpha', status: 'FAIL', is_rerun: false, start_time: moment().subtract(1, 'day').toDate() }
            { build: new ObjectId(chromeBuildId),  uid: 'uid-test-b', name: 'Test Beta',  status: 'FAIL', is_rerun: false, start_time: moment().subtract(1, 'day').toDate() }
            { build: new ObjectId(chromeBuildId),  uid: 'uid-test-c', name: 'Test Gamma', status: 'PASS', is_rerun: false, start_time: moment().subtract(1, 'day').toDate() }
            { build: new ObjectId(firefoxBuildId), uid: 'uid-test-d', name: 'Test Delta', status: 'FAIL', is_rerun: false, start_time: moment().subtract(1, 'day').toDate() }
          ]
          Test.create testDocs, (err) -> done()
    return

  after (done) ->
    @timeout 10000
    Build.find({ product: PROD }).select('_id').lean().exec (err, builds) ->
      ids = builds.map (b) -> b._id
      Test.deleteMany({ build: { $in: ids } }).exec ->
        Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'returns FAIL tests across all lanes when no optional filter', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE }, 200, (res) ->
      # 3 unique failing test uids across 2 builds
      res.body.length.should.equal 3
      done()
    return

  it 'each result has name and failCount', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((r) -> r.name isnt undefined and r.failCount isnt undefined).should.be.true
      done()
    return

  it 'filter by browser=chrome limits failures to chrome-lane tests', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res) ->
      # Only chrome build → 2 failing tests (uid-test-a, uid-test-b)
      res.body.length.should.equal 2
      done()
    return

  it 'filter by browser=firefox limits failures to firefox-lane tests', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE, browser: 'firefox' }, 200, (res) ->
      # Only firefox build → 1 failing test (uid-test-d)
      res.body.length.should.equal 1
      done()
    return

  it 'filter by team=Dev limits to Dev-lane failures', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by platform=ios limits to ios-lane failures', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by stage=staging limits to staging-lane failures', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE, stage: 'staging' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'no-match filter returns empty array', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD, type: TYPE, browser: 'safari' }, 200, (res) ->
      res.body.should.deep.equal []
      done()
    return

  it 'returns 400 when product missing', (done) ->
    analyticsPost server, cookies, 'top-failures', { type: TYPE }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

  it 'returns 400 when type missing', (done) ->
    analyticsPost server, cookies, 'top-failures', { product: PROD }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

# ─── slowest-tests (requires Test documents) ──────────────────────────

describe 'Regression: POST /analytics/slowest-tests — optional field filtering', ->
  PROD = 'GapTest_Analytics_Slowest'
  cookies = undefined

  before (done) ->
    @timeout 20000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      chromePayload =
        product: PROD, type: TYPE, build: 1
        browser: 'chrome', team: 'QA', version: '1.0'
        platform: null, platform_version: null, stage: null, device: null
        start_time: moment().subtract(1, 'day').toDate()
        end_time:   moment().subtract(1, 'day').add(1, 'hour').toDate()
        status: { pass: 2, fail: 0, skip: 0, warning: 0, total: 2 }
      firefoxPayload =
        product: PROD, type: TYPE, build: 2
        browser: 'firefox', team: 'Dev', version: '2.0'
        platform: 'ios', platform_version: '15', stage: 'staging', device: null
        start_time: moment().subtract(1, 'day').toDate()
        end_time:   moment().subtract(1, 'day').add(1, 'hour').toDate()
        status: { pass: 1, fail: 0, skip: 0, warning: 0, total: 1 }
      # Create builds sequentially so we know which ID belongs to which browser
      createBuild server, cookies, chromePayload, (chromeBuildId) ->
        createBuild server, cookies, firefoxPayload, (firefoxBuildId) ->
          ObjectId = mongoose.Types.ObjectId
          t0 = moment().subtract(1, 'day').toDate()
          t1 = moment().subtract(1, 'day').add(30, 'minute').toDate()  # 30 min
          t2 = moment().subtract(1, 'day').add(10, 'minute').toDate()  # 10 min
          t3 = moment().subtract(1, 'day').add(15, 'minute').toDate()  # 15 min
          testDocs = [
            { build: new ObjectId(chromeBuildId),  uid: 'uid-slow-a', name: 'Slow Alpha', status: 'PASS', is_rerun: false, start_time: t0, end_time: t1 }
            { build: new ObjectId(chromeBuildId),  uid: 'uid-slow-b', name: 'Fast Beta',  status: 'PASS', is_rerun: false, start_time: t0, end_time: t2 }
            { build: new ObjectId(firefoxBuildId), uid: 'uid-slow-c', name: 'Mid Gamma',  status: 'PASS', is_rerun: false, start_time: t0, end_time: t3 }
          ]
          Test.create testDocs, (err) -> done()
    return

  after (done) ->
    @timeout 10000
    Build.find({ product: PROD }).select('_id').lean().exec (err, builds) ->
      ids = builds.map (b) -> b._id
      Test.deleteMany({ build: { $in: ids } }).exec ->
        Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'returns all 3 tests when no optional filter', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.length.should.equal 3
      done()
    return

  it 'each result has avgDuration and name', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((r) -> r.avgDuration isnt undefined and r.name isnt undefined).should.be.true
      done()
    return

  it 'filter by browser=chrome limits to chrome-lane tests', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res) ->
      res.body.length.should.equal 2
      done()
    return

  it 'filter by browser=firefox limits to firefox-lane tests', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE, browser: 'firefox' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by team=Dev limits to Dev-lane tests', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by platform=ios limits to ios-lane tests', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'filter by stage=staging limits to staging-lane tests', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE, stage: 'staging' }, 200, (res) ->
      res.body.length.should.equal 1
      done()
    return

  it 'no-match filter returns empty array', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD, type: TYPE, browser: 'safari' }, 200, (res) ->
      res.body.should.deep.equal []
      done()
    return

  it 'returns 400 when product missing', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { type: TYPE }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

  it 'returns 400 when type missing', (done) ->
    analyticsPost server, cookies, 'slowest-tests', { product: PROD }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return
