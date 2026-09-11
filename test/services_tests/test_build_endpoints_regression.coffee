###
Regression tests for uncovered build endpoints.

Lock in CURRENT behaviour for:
  POST /search          — lanes grouped by all 7 optional dims
  POST /entity/recommend — lane combos filtered by optional fields
  POST /entity/others   — distinct values per field given condition
  GET  /entity/read     — returns 6 entity-type arrays (no platform/stage yet)
  POST /status/latest   — latest build per lane group
  POST /total           — count filtered by optional fields
  POST /purge/calculate — returns {builds, test_count}
  POST /:page/:perPage  — pagination with aggregate_previous_runs

Run NOW → all must pass.
After implementing custom-params feature → run again → must still pass.

Each describe uses a unique product prefix to avoid seeded-data collisions.
All created builds are cleaned up in after().
###

server   = require('../../app')
chai     = require('chai')
chaiHttp = require('chai-http')
Build    = require('../../src/models/build')
auth     = require('../api_objects/auth_api_object')
build    = require('../api_objects/build_api_object')

should = chai.should()
chai.use chaiHttp

TYPE = 'EndpointReg'

# ─── helpers ────────────────────────────────────────────────────────────────

createBuilds = (server, cookies, payloads, cb) ->
  created = 0
  ids = []
  for p in payloads
    do (p) ->
      build.create server, cookies, p, 200, (res) ->
        ids.push res.body._id
        created++
        if created == payloads.length
          cb(ids)

# ─── POST /search ─────────────────────────────────────────────────────────

describe 'Regression: POST /search — optional field lane grouping', ->
  PROD = 'GapTest_Search'
  cookies = undefined
  buildIds = []

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        { product: PROD, type: TYPE, build: 1, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null }
        { product: PROD, type: TYPE, build: 2, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null }
        { product: PROD, type: TYPE, build: 3, browser: 'firefox', team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null }
        { product: PROD, type: TYPE, build: 4, browser: 'chrome',  team: 'Dev', version: '2.0', device: null, platform: null, platform_version: null, stage: null }
        { product: PROD, type: TYPE, build: 5, browser: 'chrome',  team: 'QA',  version: '1.0', platform: 'ios', platform_version: '15', stage: 'staging', device: null }
      ]
      createBuilds server, cookies, payloads, (ids) ->
        buildIds = ids
        done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'each lane has product and type', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((l) -> l.product == PROD and l.type == TYPE).should.be.true
      done()
    return

  it 'different browser values produce separate lanes', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      # chrome/QA/1.0, firefox/QA/1.0, chrome/Dev/2.0, chrome/QA/1.0/ios/15/staging = 4 lanes
      res.body.length.should.equal 4
      done()
    return

  it 'filter by browser narrows to chrome lanes only', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res) ->
      res.body.every((l) -> l.browser == 'chrome').should.be.true
      done()
    return

  it 'filter by team narrows to QA lanes only', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE, team: 'QA' }, 200, (res) ->
      res.body.every((l) -> l.team == 'QA').should.be.true
      done()
    return

  it 'filter by version narrows correctly', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE, version: '2.0' }, 200, (res) ->
      res.body.every((l) -> l.version == '2.0').should.be.true
      done()
    return

  it 'filter by platform narrows to ios lane', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.every((l) -> l.platform == 'ios').should.be.true
      done()
    return

  it 'filter by platform_version narrows correctly', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE, platform_version: '15' }, 200, (res) ->
      res.body.every((l) -> l.platform_version == '15').should.be.true
      done()
    return

  it 'filter by stage narrows to staging lane', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE, stage: 'staging' }, 200, (res) ->
      res.body.every((l) -> l.stage == 'staging').should.be.true
      done()
    return

  it 'each lane has aggregate_previous_runs array', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((l) -> Array.isArray(l.aggregate_previous_runs)).should.be.true
      done()
    return

  it 'lane with 2 builds has previous run in aggregate_previous_runs', (done) ->
    build.search server, cookies, { product: PROD, type: TYPE, browser: 'chrome', team: 'QA', version: '1.0' }, 200, (res) ->
      # chrome/QA/1.0 with no platform → builds 1 and 2 → at least 1 previous run
      chromeQa = res.body.filter (l) -> l.browser == 'chrome' and l.team == 'QA' and l.version == '1.0' and !l.platform
      chromeQa.length.should.equal 1
      chromeQa[0].aggregate_previous_runs.length.should.be.at.least 1
      done()
    return

  it 'returns 400 when product missing', (done) ->
    build.search server, cookies, { type: TYPE }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

  it 'returns 400 when type missing', (done) ->
    build.search server, cookies, { product: PROD }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

# ─── POST /entity/recommend ──────────────────────────────────────────────

describe 'Regression: POST /entity/recommend — optional field filtering', ->
  PROD = 'GapTest_Recommend'
  cookies = undefined

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        { product: PROD, type: TYPE, build: 1, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: 'ios',     platform_version: '15', stage: 'staging' }
        { product: PROD, type: TYPE, build: 2, browser: 'firefox', team: 'Dev', version: '2.0', device: null, platform: 'android', platform_version: '12', stage: 'prod' }
        { product: PROD, type: TYPE, build: 3, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: 'ios',     platform_version: '15', stage: 'staging' }
      ]
      createBuilds server, cookies, payloads, -> done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 with recommends array', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.recommends.should.be.an 'Array'
      done()
    return

  it 'recommend includes total count', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.total.should.be.a 'number'
      done()
    return

  it 'unique lane combos form distinct recommends', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      # 2 unique lane combos: chrome/QA/1.0/ios/15/staging and firefox/Dev/2.0/android/12/prod
      res.body.total.should.equal 2
      done()
    return

  it 'filter by browser=chrome narrows recommends to 1', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res) ->
      res.body.total.should.equal 1
      res.body.recommends[0].browser.should.equal 'chrome'
      done()
    return

  it 'filter by team=Dev narrows recommends to 1', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      res.body.total.should.equal 1
      res.body.recommends[0].team.should.equal 'Dev'
      done()
    return

  it 'filter by platform=ios narrows recommends to 1', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.total.should.equal 1
      res.body.recommends[0].platform.should.equal 'ios'
      done()
    return

  it 'filter by stage=prod narrows recommends to 1', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE, stage: 'prod' }, 200, (res) ->
      res.body.total.should.equal 1
      res.body.recommends[0].stage.should.equal 'prod'
      done()
    return

  it 'filter by version narrowing works (regex)', (done) ->
    build.entityRecommend server, cookies, { product: PROD, type: TYPE, version: '2' }, 200, (res) ->
      res.body.total.should.equal 1
      res.body.recommends[0].version.should.equal '2.0'
      done()
    return

  it 'returns 400 when product missing', (done) ->
    build.entityRecommend server, cookies, { type: TYPE }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

  it 'returns 400 when type missing', (done) ->
    build.entityRecommend server, cookies, { product: PROD }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

# ─── POST /entity/others ────────────────────────────────────────────────

describe 'Regression: POST /entity/others — distinct values per field', ->
  PROD = 'GapTest_Others'
  cookies = undefined

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        { product: PROD, type: TYPE, build: 1, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: 'ios',     platform_version: '15', stage: 'staging' }
        { product: PROD, type: TYPE, build: 2, browser: 'firefox', team: 'Dev', version: '2.0', device: null, platform: 'android', platform_version: '12', stage: 'prod' }
        { product: PROD, type: TYPE, build: 3, browser: 'safari',  team: 'QA',  version: '1.0', device: null, platform: 'ios',     platform_version: '15', stage: 'staging' }
      ]
      createBuilds server, cookies, payloads, -> done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array of 7 entity objects', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 7
      done()
    return

  it 'returns version distinct values', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      versionObj = res.body.find (o) -> o.version isnt undefined
      versionObj.version.should.include '1.0'
      versionObj.version.should.include '2.0'
      done()
    return

  it 'returns team distinct values', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      teamObj = res.body.find (o) -> o.team isnt undefined
      teamObj.team.should.include 'QA'
      teamObj.team.should.include 'Dev'
      done()
    return

  it 'returns browser distinct values', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      browserObj = res.body.find (o) -> o.browser isnt undefined
      browserObj.browser.should.include 'chrome'
      browserObj.browser.should.include 'firefox'
      browserObj.browser.should.include 'safari'
      done()
    return

  it 'returns platform distinct values', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      platformObj = res.body.find (o) -> o.platform isnt undefined
      platformObj.platform.should.include 'ios'
      platformObj.platform.should.include 'android'
      done()
    return

  it 'returns platform_version distinct values', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      pvObj = res.body.find (o) -> o.platform_version isnt undefined
      pvObj.platform_version.should.include '15'
      pvObj.platform_version.should.include '12'
      done()
    return

  it 'returns stage distinct values', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      stageObj = res.body.find (o) -> o.stage isnt undefined
      stageObj.stage.should.include 'staging'
      stageObj.stage.should.include 'prod'
      done()
    return

  it 'narrows browser options when team is fixed', (done) ->
    # With team=Dev, only firefox exists
    build.entityOthers server, cookies, { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      browserObj = res.body.find (o) -> o.browser isnt undefined
      browserObj.browser.should.deep.equal ['firefox']
      done()
    return

  it 'narrows stage options when platform=android', (done) ->
    build.entityOthers server, cookies, { product: PROD, type: TYPE, platform: 'android' }, 200, (res) ->
      stageObj = res.body.find (o) -> o.stage isnt undefined
      stageObj.stage.should.deep.equal ['prod']
      done()
    return

  it 'returns 400 when product missing', (done) ->
    build.entityOthers server, cookies, { type: TYPE }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

  it 'returns 400 when type missing', (done) ->
    build.entityOthers server, cookies, { product: PROD }, 400, (res) ->
      res.body.error.should.be.a 'string'
      done()
    return

# ─── GET /entity/read ───────────────────────────────────────────────────

describe 'Regression: GET /entity/read — entity array structure', ->
  cookies = undefined

  before (done) ->
    @timeout 10000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      done()
    return

  it 'returns 200 and array', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'returns exactly 6 entity objects', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      res.body.length.should.equal 6
      done()
    return

  it 'includes product entity', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasProduct = res.body.some (o) -> o.product isnt undefined
      hasProduct.should.be.true
      done()
    return

  it 'includes type entity', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasType = res.body.some (o) -> o.type isnt undefined
      hasType.should.be.true
      done()
    return

  it 'includes version entity', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasVersion = res.body.some (o) -> o.version isnt undefined
      hasVersion.should.be.true
      done()
    return

  it 'includes device entity', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasDevice = res.body.some (o) -> o.device isnt undefined
      hasDevice.should.be.true
      done()
    return

  it 'includes team entity', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasTeam = res.body.some (o) -> o.team isnt undefined
      hasTeam.should.be.true
      done()
    return

  it 'includes browser entity', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasBrowser = res.body.some (o) -> o.browser isnt undefined
      hasBrowser.should.be.true
      done()
    return

  it 'does NOT include platform entity (not in /entity/read yet)', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasPlatform = res.body.some (o) -> o.platform isnt undefined
      hasPlatform.should.be.false
      done()
    return

  it 'does NOT include stage entity (not in /entity/read yet)', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      hasStage = res.body.some (o) -> o.stage isnt undefined
      hasStage.should.be.false
      done()
    return

  it 'each entity value is an array', (done) ->
    build.entityRead server, cookies, 200, (res) ->
      res.body.every((o) -> Array.isArray(Object.values(o)[0])).should.be.true
      done()
    return

# ─── POST /status/latest ────────────────────────────────────────────────

describe 'Regression: POST /status/latest — latest build per lane', ->
  PROD = 'GapTest_Latest'
  cookies = undefined
  createdBuilds = []

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      # Explicit start_time stagger: endpoint sorts by start_time ASC then takes $last,
      # so build 2 must have a strictly later start_time than build 1 to be deterministic.
      t = new Date('2024-01-01T00:00:00Z').getTime()
      payloads = [
        { product: PROD, type: TYPE, build: 1, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null, start_time: new Date(t) }
        { product: PROD, type: TYPE, build: 2, browser: 'chrome',  team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null, start_time: new Date(t + 1000) }
        { product: PROD, type: TYPE, build: 3, browser: 'firefox', team: 'QA',  version: '1.0', device: null, platform: null, platform_version: null, stage: null, start_time: new Date(t + 2000) }
        { product: PROD, type: TYPE, build: 4, browser: 'chrome',  team: 'QA',  version: '1.0', platform: 'ios', platform_version: '15', stage: 'staging', device: null, start_time: new Date(t + 3000) }
      ]
      createBuilds server, cookies, payloads, (ids) ->
        createdBuilds = ids
        done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array for valid query', (done) ->
    query = [{ product: PROD, type: TYPE }]
    build.statusLatest server, cookies, { query: query }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'groups builds by all 7 optional dims — different browser = separate lane', (done) ->
    query = [{ product: PROD, type: TYPE }]
    build.statusLatest server, cookies, { query: query }, 200, (res) ->
      lanes = res.body.filter (l) -> l.product == PROD
      # chrome/QA/1.0, firefox/QA/1.0, chrome/QA/1.0/ios/15/staging = 3 lanes
      lanes.length.should.equal 3
      done()
    return

  it 'latest build per lane is the highest build number', (done) ->
    query = [{ product: PROD, type: TYPE, browser: 'chrome', team: 'QA', version: '1.0' }]
    build.statusLatest server, cookies, { query: query }, 200, (res) ->
      # status/latest projects product/type/build/status/start_time at top level;
      # browser/team/version/platform are inside _id only
      lanes = res.body.filter (l) -> l.product == PROD and l._id.browser == 'chrome' and !l._id.platform
      lanes.length.should.equal 1
      # builds 1 and 2 → last is build 2
      lanes[0].build.should.equal 2
      done()
    return

  it 'platform dims isolate lane correctly', (done) ->
    query = [{ product: PROD, type: TYPE, platform: 'ios' }]
    build.statusLatest server, cookies, { query: query }, 200, (res) ->
      lanes = res.body.filter (l) -> l.product == PROD
      lanes.length.should.equal 1
      lanes[0].build.should.equal 4
      done()
    return

  it 'returns 400 when query is empty', (done) ->
    build.statusLatest server, cookies, { query: [] }, 400, (res) ->
      res.body.message.should.be.a 'string'
      done()
    return

  it 'returns 400 when query is missing', (done) ->
    build.statusLatest server, cookies, {}, 400, (res) ->
      res.body.message.should.be.a 'string'
      done()
    return

# ─── POST /total ────────────────────────────────────────────────────────

describe 'Regression: POST /total — count filtered by optional fields', ->
  PROD = 'GapTest_Total'
  cookies = undefined

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        { product: PROD, type: TYPE, build: 1, browser: 'chrome',  team: 'QA',  version: '1.0', platform: 'ios',     platform_version: '15', stage: 'staging', device: null }
        { product: PROD, type: TYPE, build: 2, browser: 'firefox', team: 'Dev', version: '2.0', platform: 'android', platform_version: '12', stage: 'prod',    device: null }
        { product: PROD, type: TYPE, build: 3, browser: 'chrome',  team: 'QA',  version: '1.0', platform: 'ios',     platform_version: '15', stage: 'staging', device: null }
        { product: PROD, type: TYPE, build: 4, browser: 'chrome',  team: 'QA',  version: '3.0', platform: null,      platform_version: null, stage: null,       device: 'tablet' }
      ]
      createBuilds server, cookies, payloads, -> done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and a number for product+type', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.a 'number'
      res.body.should.equal 4
      done()
    return

  it 'filter by browser=chrome returns 3', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res) ->
      res.body.should.equal 3
      done()
    return

  it 'filter by team=Dev returns 1', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      res.body.should.equal 1
      done()
    return

  it 'filter by version=1.0 returns 2', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, version: '1.0' }, 200, (res) ->
      res.body.should.equal 2
      done()
    return

  it 'filter by platform=ios returns 2', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.should.equal 2
      done()
    return

  it 'filter by platform_version=12 returns 1', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, platform_version: '12' }, 200, (res) ->
      res.body.should.equal 1
      done()
    return

  it 'filter by stage=staging returns 2', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, stage: 'staging' }, 200, (res) ->
      res.body.should.equal 2
      done()
    return

  it 'filter by device=tablet returns 1', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, device: 'tablet' }, 200, (res) ->
      res.body.should.equal 1
      done()
    return

  it 'combined browser+team filters correctly', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, browser: 'chrome', team: 'QA' }, 200, (res) ->
      res.body.should.equal 3
      done()
    return

  it 'no-match filter returns 0', (done) ->
    build.total server, cookies, { product: PROD, type: TYPE, browser: 'safari' }, 200, (res) ->
      res.body.should.equal 0
      done()
    return

# ─── POST /purge/calculate ──────────────────────────────────────────────

describe 'Regression: POST /purge/calculate — returns build list and test count', ->
  PROD = 'GapTest_Purge'
  cookies = undefined

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        { product: PROD, type: TYPE, build: 1, browser: 'chrome',  team: 'QA',  version: '1.0', platform: 'ios', platform_version: '15', stage: 'staging', device: null }
        { product: PROD, type: TYPE, build: 2, browser: 'firefox', team: 'Dev', version: '2.0', platform: null,  platform_version: null, stage: 'prod',    device: null }
        { product: PROD, type: TYPE, build: 3, browser: 'chrome',  team: 'QA',  version: '1.0', platform: 'ios', platform_version: '15', stage: 'staging', device: null }
      ]
      createBuilds server, cookies, payloads, -> done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 with builds array and test_count', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.have.property 'builds'
      res.body.should.have.property 'test_count'
      res.body.builds.should.be.an 'Array'
      res.body.test_count.should.be.a 'number'
      done()
    return

  it 'builds count equals total builds for product+type', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.builds.length.should.equal 3
      done()
    return

  it 'filter by browser=chrome narrows builds to 2', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE, browser: 'chrome' }, 200, (res) ->
      res.body.builds.length.should.equal 2
      done()
    return

  it 'filter by team=Dev narrows builds to 1', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      res.body.builds.length.should.equal 1
      done()
    return

  it 'filter by platform=ios narrows builds to 2', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.builds.length.should.equal 2
      done()
    return

  it 'filter by stage=prod narrows builds to 1', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE, stage: 'prod' }, 200, (res) ->
      res.body.builds.length.should.equal 1
      done()
    return

  it 'test_count is 0 when no tests exist for these builds', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.test_count.should.equal 0
      done()
    return

  it 'no-match filter returns empty builds list', (done) ->
    build.purgeCalculate server, cookies, { product: PROD, type: TYPE, browser: 'safari' }, 200, (res) ->
      res.body.builds.length.should.equal 0
      res.body.test_count.should.equal 0
      done()
    return

# ─── POST /:page/:perPage ───────────────────────────────────────────────

describe 'Regression: POST /:page/:perPage — pagination with optional fields', ->
  PROD = 'GapTest_Page'
  cookies = undefined

  before (done) ->
    @timeout 15000
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      payloads = [
        { product: PROD, type: TYPE, build: 1, browser: 'chrome',  team: 'QA',  version: '1.0', platform: null,  platform_version: null, stage: null, device: null }
        { product: PROD, type: TYPE, build: 2, browser: 'chrome',  team: 'QA',  version: '1.0', platform: null,  platform_version: null, stage: null, device: null }
        { product: PROD, type: TYPE, build: 3, browser: 'firefox', team: 'Dev', version: '2.0', platform: null,  platform_version: null, stage: null, device: null }
        { product: PROD, type: TYPE, build: 4, browser: 'chrome',  team: 'QA',  version: '1.0', platform: 'ios', platform_version: '15', stage: 'staging', device: null }
        { product: PROD, type: TYPE, build: 5, browser: 'chrome',  team: 'QA',  version: '1.0', platform: null,  platform_version: null, stage: null, device: null }
      ]
      createBuilds server, cookies, payloads, -> done()
    return

  after (done) ->
    @timeout 10000
    Build.deleteMany({ product: PROD }).exec (err) -> done()
    return

  it 'returns 200 and array for page 0', (done) ->
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return

  it 'returns all 5 builds on page 0 with perPage 10', (done) ->
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.length.should.equal 5
      done()
    return

  it 'perPage limits result count', (done) ->
    build.paginate server, cookies, 0, 2, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.length.should.equal 2
      done()
    return

  it 'page 1 with perPage 2 returns next 2 builds', (done) ->
    build.paginate server, cookies, 1, 2, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.length.should.equal 2
      done()
    return

  it 'each result has aggregate_previous_runs array', (done) ->
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.every((b) -> Array.isArray(b.aggregate_previous_runs)).should.be.true
      done()
    return

  it 'build with a prior same-lane build has aggregate_previous_runs populated', (done) ->
    # builds 1, 2, 5 share chrome/QA/1.0/null lane → builds 2 and 5 have previous runs
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE, browser: 'chrome', team: 'QA', version: '1.0' }, 200, (res) ->
      # filter out platform=ios build; only null-platform builds
      nullPlatform = res.body.filter (b) -> !b.platform
      # all but the first build in this lane should have a previous run
      withPrev = nullPlatform.filter (b) -> b.aggregate_previous_runs.length > 0
      withPrev.length.should.be.at.least 1
      done()
    return

  it 'filter by browser=firefox returns only firefox builds', (done) ->
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE, browser: 'firefox' }, 200, (res) ->
      res.body.every((b) -> b.browser == 'firefox').should.be.true
      done()
    return

  it 'filter by platform=ios returns only ios builds', (done) ->
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE, platform: 'ios' }, 200, (res) ->
      res.body.every((b) -> b.platform == 'ios').should.be.true
      done()
    return

  it 'filter by stage=staging returns only staging builds', (done) ->
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE, stage: 'staging' }, 200, (res) ->
      res.body.every((b) -> b.stage == 'staging').should.be.true
      done()
    return

  it 'filter by team=Dev returns only Dev builds', (done) ->
    build.paginate server, cookies, 0, 10, { product: PROD, type: TYPE, team: 'Dev' }, 200, (res) ->
      res.body.every((b) -> b.team == 'Dev').should.be.true
      done()
    return

  it 'negative page returns error object', (done) ->
    build.paginate server, cookies, -1, 10, { product: PROD, type: TYPE }, 200, (res) ->
      res.body.should.be.an 'Object'
      res.body.error.should.be.true
      done()
    return
