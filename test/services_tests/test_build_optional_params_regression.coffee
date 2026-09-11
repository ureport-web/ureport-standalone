###
Regression tests for build optional parameter handling.

These lock in CURRENT behaviour for all 7 optional lane fields
(version, team, browser, device, platform, platform_version, stage).

Run NOW → all must pass.
After implementing custom-params feature → run again → must still pass.

Uses a distinct product "RegressionTestApp" to avoid colliding with seeded data.
Cleans up created builds in after().
###

server  = require('../../app')
chai    = require('chai')
chaiHttp = require('chai-http')
mongoose = require('mongoose')
moment  = require('moment')
Build   = require('../../src/models/build')
auth    = require('../api_objects/auth_api_object')
build   = require('../api_objects/build_api_object')

should = chai.should()
chai.use chaiHttp

PRODUCT = 'RegressionTestApp'
TYPE    = 'OptionalParamTest'

describe 'Regression: optional build params — filter endpoint', ->
  cookies  = undefined
  buildIds = []

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      # Create test builds with distinct optional params
      payloads = [
        { product: PRODUCT, type: TYPE, build: 1001, version: '1.0', browser: 'chrome',  team: 'QA',  device: null,     platform: 'ios',     platform_version: '15', stage: 'staging' }
        { product: PRODUCT, type: TYPE, build: 1002, version: '2.0', browser: 'firefox', team: 'Dev', device: null,     platform: 'android', platform_version: '12', stage: 'prod' }
        { product: PRODUCT, type: TYPE, build: 1003, version: '1.0', browser: 'chrome',  team: 'QA',  device: null,     platform: 'ios',     platform_version: '15', stage: 'prod' }
        { product: PRODUCT, type: TYPE, build: 1004, version: '3.0', browser: null,       team: null,  device: 'tablet', platform: null,      platform_version: null, stage: null }
      ]
      created = 0
      for p in payloads
        do (p) ->
          build.create server, cookies, p, 200, (res) ->
            buildIds.push res.body._id
            created++
            if created == payloads.length
              done()
    return

  after (done) ->
    @timeout 15000
    Build.deleteMany({ product: PRODUCT }).exec (err) ->
      done()
    return

  # ── filter by version ───────────────────────────────────────────────────────

  it 'filter by version returns only matching builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      version: [{ version: '1.0' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 2
      res.body.every((b) -> b.version == '1.0').should.be.true
      done()
    return

  it 'filter by version returns zero when no match', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      version: [{ version: '99.0' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 0
      done()
    return

  # ── filter by browser ───────────────────────────────────────────────────────

  it 'filter by browser returns only chrome builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      browser: [{ browser: 'chrome' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 2
      res.body.every((b) -> b.browser == 'chrome').should.be.true
      done()
    return

  it 'filter by browser returns only firefox builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      browser: [{ browser: 'firefox' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 1
      res.body[0].browser.should.equal 'firefox'
      done()
    return

  # ── filter by team ──────────────────────────────────────────────────────────

  it 'filter by team returns only QA builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      team: [{ team: 'QA' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 2
      res.body.every((b) -> b.team == 'QA').should.be.true
      done()
    return

  # ── filter by platform ──────────────────────────────────────────────────────

  it 'filter by platform returns only ios builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      platform: [{ platform: 'ios' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 2
      res.body.every((b) -> b.platform == 'ios').should.be.true
      done()
    return

  it 'filter by platform_version returns only matching builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      platform_version: [{ platform_version: '15' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 2
      res.body.every((b) -> b.platform_version == '15').should.be.true
      done()
    return

  # ── filter by stage ─────────────────────────────────────────────────────────

  it 'filter by stage returns only staging builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      stage: [{ stage: 'staging' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 1
      res.body[0].stage.should.equal 'staging'
      done()
    return

  # ── filter by device ────────────────────────────────────────────────────────

  it 'filter by device returns only matching builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      device: [{ device: 'tablet' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 1
      res.body[0].device.should.equal 'tablet'
      done()
    return

  # ── combined filters ────────────────────────────────────────────────────────

  it 'combined version + browser + team returns exact match', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      version: [{ version: '1.0' }]
      browser: [{ browser: 'chrome' }]
      team: [{ team: 'QA' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 2
      done()
    return

  it 'combined version + stage narrows to single build', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      version: [{ version: '1.0' }]
      stage: [{ stage: 'staging' }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 1
      done()
    return

  # ── no filter = all builds ──────────────────────────────────────────────────

  it 'no optional filter returns all 4 test builds', (done) ->
    payload =
      is_archive: false
      product: [{ product: PRODUCT }]
      type: [{ type: TYPE }]
      range: 20
    build.filter server, cookies, payload, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 4
      done()
    return


describe 'Regression: build dedup — POST / (create or update)', ->
  cookies  = undefined

  before (done) ->
    @timeout 10000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PRODUCT + '_Dedup' }).exec (err) -> done()
    return

  it 'same build# + same optional params → returns existing build (not a new one)', (done) ->
    PROD = PRODUCT + '_Dedup'
    first  = { product: PROD, type: 'T', build: 500, version: '1.0', browser: 'chrome', team: null, device: null, platform: null, platform_version: null, stage: null }
    second = { product: PROD, type: 'T', build: 500, version: '1.0', browser: 'chrome', team: null, device: null, platform: null, platform_version: null, stage: null }
    build.create server, cookies, first, 200, (res1) ->
      id1 = res1.body._id
      build.create server, cookies, second, 200, (res2) ->
        id2 = res2.body._id
        id1.should.equal id2  # same document updated, not a new one
        done()
    return

  it 'same build# + different version → creates a new separate build', (done) ->
    PROD = PRODUCT + '_Dedup'
    first  = { product: PROD, type: 'T', build: 501, version: '1.0', browser: null, team: null, device: null, platform: null, platform_version: null, stage: null }
    second = { product: PROD, type: 'T', build: 501, version: '2.0', browser: null, team: null, device: null, platform: null, platform_version: null, stage: null }
    build.create server, cookies, first, 200, (res1) ->
      id1 = res1.body._id
      build.create server, cookies, second, 200, (res2) ->
        id2 = res2.body._id
        id1.should.not.equal id2  # different documents
        done()
    return

  it 'same build# + different browser → creates a new separate build', (done) ->
    PROD = PRODUCT + '_Dedup'
    first  = { product: PROD, type: 'T', build: 502, version: null, browser: 'chrome', team: null, device: null, platform: null, platform_version: null, stage: null }
    second = { product: PROD, type: 'T', build: 502, version: null, browser: 'firefox', team: null, device: null, platform: null, platform_version: null, stage: null }
    build.create server, cookies, first, 200, (res1) ->
      id1 = res1.body._id
      build.create server, cookies, second, 200, (res2) ->
        id2 = res2.body._id
        id1.should.not.equal id2
        done()
    return

  it 'same build# + different stage → creates a new separate build', (done) ->
    PROD = PRODUCT + '_Dedup'
    first  = { product: PROD, type: 'T', build: 503, version: null, browser: null, team: null, device: null, platform: null, platform_version: null, stage: 'staging' }
    second = { product: PROD, type: 'T', build: 503, version: null, browser: null, team: null, device: null, platform: null, platform_version: null, stage: 'prod' }
    build.create server, cookies, first, 200, (res1) ->
      id1 = res1.body._id
      build.create server, cookies, second, 200, (res2) ->
        id2 = res2.body._id
        id1.should.not.equal id2
        done()
    return

  it 'same build# + no optional params → finds existing (backward compat)', (done) ->
    PROD = PRODUCT + '_Dedup'
    first  = { product: PROD, type: 'T', build: 504 }
    second = { product: PROD, type: 'T', build: 504 }
    build.create server, cookies, first, 200, (res1) ->
      id1 = res1.body._id
      build.create server, cookies, second, 200, (res2) ->
        id2 = res2.body._id
        id1.should.equal id2
        done()
    return


describe 'Regression: active-lanes grouping', ->
  cookies  = undefined

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        { product: PRODUCT + '_Lanes', type: 'T', build: 601, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null }
        { product: PRODUCT + '_Lanes', type: 'T', build: 602, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null }
        { product: PRODUCT + '_Lanes', type: 'T', build: 603, browser: 'firefox', team: 'Dev', version: '2.0', device: null, platform: null, platform_version: null, stage: null }
      ]
      created = 0
      for p in payloads
        do (p) ->
          build.create server, cookies, p, 200, (res) ->
            created++
            if created == payloads.length
              done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PRODUCT + '_Lanes' }).exec (err) -> done()
    return

  it 'active-lanes endpoint returns 200', (done) ->
    req = chai.request(server).get('/api/build/active-lanes?days=7')
    req.cookies = cookies
    req.end (err, res) ->
      res.should.have.status 200
      res.body.should.be.an 'Array'
      done()
    return

  it 'builds with same 7 optional field values form one lane', (done) ->
    # builds 601 and 602 have identical lane dims → should collapse to 1 lane
    req = chai.request(server).get('/api/build/active-lanes?days=7')
    req.cookies = cookies
    req.end (err, res) ->
      lanes = res.body.filter (l) -> l.product == PRODUCT + '_Lanes'
      lanes.length.should.equal 2  # chrome/QA/1.0 and firefox/Dev/2.0
      done()
    return
