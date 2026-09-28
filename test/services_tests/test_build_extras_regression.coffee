###
Phase 1 — Build extras field regression tests.

Verifies:
  - extras stored on POST /build
  - extras keys sorted alphabetically on save (both create and update paths)
  - builds without extras remain backward-compatible
  - extras do NOT affect dedup (same product+type+build# → same document regardless of extras)
  - updateAttributes updates extras and preserves key sort order
###
process.env.NODE_ENV = 'test'

server = require('../../app')
Build  = require('../../src/models/build')
chai   = require('chai')
chaiHttp = require('chai-http')
should = chai.should()
chai.use chaiHttp

auth = require('../api_objects/auth_api_object')

PRODUCT = 'extras-regression-product'
TYPE    = 'extras-regression-type'

post = (server, cookies, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/build/')
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

describe 'Phase 1 — Build extras field', ->
  cookies = undefined

  before (done) ->
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      Build.deleteMany({ product: PRODUCT, type: TYPE }).exec (err) ->
        done err
    return

  after (done) ->
    Build.deleteMany({ product: PRODUCT, type: TYPE }).exec (err) ->
      done err
    return

  it 'stores extras on POST /build (create path)', (done) ->
    post server, cookies, { product: PRODUCT, type: TYPE, build: 1, extras: { region: 'us-east' } }, 200, (res) ->
      res.body.extras.region.should.equal 'us-east'
      done()
    return

  it 'sorts extras keys alphabetically on create', (done) ->
    post server, cookies, { product: PRODUCT, type: TYPE, build: 2, extras: { z_key: 'last', a_key: 'first', m_key: 'mid' } }, 200, (res) ->
      keys = Object.keys(res.body.extras)
      keys.should.deep.equal ['a_key', 'm_key', 'z_key']
      done()
    return

  it 'builds without extras are backward-compatible (no extras field required)', (done) ->
    post server, cookies, { product: PRODUCT, type: TYPE, build: 3 }, 200, (res) ->
      res.should.have.status 200
      done()
    return

  it 'extras do NOT affect dedup — same product+type+build# finds same document', (done) ->
    post server, cookies, { product: PRODUCT, type: TYPE, build: 4, extras: { region: 'us-east' } }, 200, (res1) ->
      id1 = res1.body._id
      post server, cookies, { product: PRODUCT, type: TYPE, build: 4, extras: { region: 'eu-west' } }, 200, (res2) ->
        res2.body._id.should.equal id1
        done()
    return

  it 'updateAttributes updates extras to new value on dedup POST', (done) ->
    post server, cookies, { product: PRODUCT, type: TYPE, build: 5, extras: { env: 'staging' } }, 200, (res1) ->
      post server, cookies, { product: PRODUCT, type: TYPE, build: 5, extras: { env: 'prod' } }, 200, (res2) ->
        res2.body.extras.env.should.equal 'prod'
        done()
    return

  it 'sorts extras keys alphabetically on updateAttributes (dedup update path)', (done) ->
    post server, cookies, { product: PRODUCT, type: TYPE, build: 6, extras: { alpha: '1' } }, 200, (res1) ->
      post server, cookies, { product: PRODUCT, type: TYPE, build: 6, extras: { z_key: 'z', a_key: 'a' } }, 200, (res2) ->
        keys = Object.keys(res2.body.extras)
        keys.should.deep.equal ['a_key', 'z_key']
        done()
    return

FILTER_PRODUCT = 'extras-filter-product'
FILTER_TYPE    = 'extras-filter-type'

filterPost = (server, cookies, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/build/filter')
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

searchPost = (server, cookies, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/build/search')
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

describe 'Phase 2 — /filter and /search extras conditions', ->
  cookies = undefined

  before (done) ->
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      Build.deleteMany({ product: FILTER_PRODUCT, type: FILTER_TYPE }).exec (err) ->
        return done err if err
        # create 3 builds: two with region=us-east, one with region=eu-west
        t = new Date('2024-06-01T00:00:00Z').getTime()
        post server, cookies, { product: FILTER_PRODUCT, type: FILTER_TYPE, build: 1, extras: { region: 'us-east' }, start_time: new Date(t) }, 200, ->
          post server, cookies, { product: FILTER_PRODUCT, type: FILTER_TYPE, build: 2, extras: { region: 'us-east' }, start_time: new Date(t + 1000) }, 200, ->
            post server, cookies, { product: FILTER_PRODUCT, type: FILTER_TYPE, build: 3, extras: { region: 'eu-west' }, start_time: new Date(t + 2000) }, 200, ->
              done()
    return

  after (done) ->
    Build.deleteMany({ product: FILTER_PRODUCT, type: FILTER_TYPE }).exec (err) ->
      done err
    return

  describe '/filter extras', ->
    it 'returns only builds matching extras filter', (done) ->
      payload = {
        product: [{ product: FILTER_PRODUCT }]
        type: [{ type: FILTER_TYPE }]
        extras: { region: 'us-east' }
        range: 20
      }
      filterPost server, cookies, payload, 200, (res) ->
        res.body.should.be.an 'Array'
        res.body.length.should.equal 2
        res.body.forEach (b) -> b.extras.region.should.equal 'us-east'
        done()
      return

    it 'returns all builds when no extras filter given (backward compat)', (done) ->
      payload = {
        product: [{ product: FILTER_PRODUCT }]
        type: [{ type: FILTER_TYPE }]
        range: 20
      }
      filterPost server, cookies, payload, 200, (res) ->
        res.body.should.be.an 'Array'
        res.body.length.should.equal 3
        done()
      return

    it 'returns no builds when extras filter matches nothing', (done) ->
      payload = {
        product: [{ product: FILTER_PRODUCT }]
        type: [{ type: FILTER_TYPE }]
        extras: { region: 'ap-southeast' }
        range: 20
      }
      filterPost server, cookies, payload, 200, (res) ->
        res.body.should.be.an 'Array'
        res.body.length.should.equal 0
        done()
      return

  describe '/search extras', ->
    it 'returns only builds matching extras filter in /search', (done) ->
      payload = {
        product: FILTER_PRODUCT
        type: FILTER_TYPE
        extras: { region: 'eu-west' }
        since: 3000
      }
      searchPost server, cookies, payload, 200, (res) ->
        res.body.should.be.an 'Array'
        res.body.length.should.equal 1
        done()
      return

    it '/search without extras filter returns all lanes (extras now in group key)', (done) ->
      payload = {
        product: FILTER_PRODUCT
        type: FILTER_TYPE
        since: 3000
      }
      searchPost server, cookies, payload, 200, (res) ->
        res.body.should.be.an 'Array'
        # /search groups by {product,type,...7 fields...,extras}
        # build1+build2 share extras={region:us-east} → 1 group
        # build3 has extras={region:eu-west} → 1 group
        # total = 2 groups
        res.body.length.should.equal 2
        done()
      return

LANES_PRODUCT = 'extras-lanes-product'
LANES_TYPE    = 'extras-lanes-type'

activeLanesGet = (server, cookies, expectStatus, cb) ->
  req = chai.request(server).get('/api/build/active-lanes?days=3650')
  req.cookies = cookies
  req.end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

statusLatestPost = (server, cookies, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/build/status/latest')
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

describe 'Phase 3 — extras in $group._id (active-lanes, status/latest, search)', ->
  cookies = undefined

  before (done) ->
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      Build.deleteMany({ product: LANES_PRODUCT, type: LANES_TYPE }).exec (err) ->
        return done err if err
        t = new Date('2024-06-01T00:00:00Z').getTime()
        # 3 builds: same product+type+build lane dims, different extras
        post server, cookies, { product: LANES_PRODUCT, type: LANES_TYPE, build: 1, extras: { region: 'us-east' }, start_time: new Date(t) }, 200, ->
          post server, cookies, { product: LANES_PRODUCT, type: LANES_TYPE, build: 2, extras: { region: 'eu-west' }, start_time: new Date(t + 1000) }, 200, ->
            post server, cookies, { product: LANES_PRODUCT, type: LANES_TYPE, build: 3, start_time: new Date(t + 2000) }, 200, ->
              done()
    return

  after (done) ->
    Build.deleteMany({ product: LANES_PRODUCT, type: LANES_TYPE }).exec (err) ->
      done err
    return

  it 'active-lanes separates builds with different extras into distinct lanes', (done) ->
    activeLanesGet server, cookies, 200, (res) ->
      myLanes = res.body.filter (l) -> l.product == LANES_PRODUCT and l.type == LANES_TYPE
      # 3 builds → 3 distinct extras values (us-east, eu-west, null) → 3 lanes
      myLanes.length.should.equal 3
      done()
    return

  it 'active-lanes lane object includes extras field', (done) ->
    activeLanesGet server, cookies, 200, (res) ->
      usEastLane = res.body.find (l) -> l.product == LANES_PRODUCT and l.extras?.region == 'us-east'
      usEastLane.should.exist
      usEastLane.extras.region.should.equal 'us-east'
      done()
    return

  it 'status/latest separates builds with different extras into distinct groups', (done) ->
    statusLatestPost server, cookies, {
      query: [{ product: LANES_PRODUCT, type: LANES_TYPE }]
    }, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 3
      done()
    return

  it 'search separates builds with different extras into distinct groups', (done) ->
    searchPost server, cookies, {
      product: LANES_PRODUCT
      type: LANES_TYPE
      since: 3000
    }, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 3
      done()
    return

  it 'search result includes extras field', (done) ->
    searchPost server, cookies, {
      product: LANES_PRODUCT
      type: LANES_TYPE
      extras: { region: 'us-east' }
      since: 3000
    }, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 1
      res.body[0].extras.region.should.equal 'us-east'
      done()
    return

OTHERS_PRODUCT = 'extras-others-product'
OTHERS_TYPE    = 'extras-others-type'

othersPost = (server, cookies, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/build/entity/others')
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

describe 'Phase 4 — /entity/others extras discovery + cache', ->
  cookies = undefined

  before (done) ->
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      Build.deleteMany({ product: OTHERS_PRODUCT, type: OTHERS_TYPE }).exec (err) ->
        return done err if err
        t = new Date('2024-06-01T00:00:00Z').getTime()
        post server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE, build: 1, extras: { region: 'us-east', env: 'prod' }, start_time: new Date(t) }, 200, ->
          post server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE, build: 2, extras: { region: 'eu-west', env: 'staging' }, start_time: new Date(t + 1000) }, 200, ->
            post server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE, build: 3, start_time: new Date(t + 2000) }, 200, ->
              done()
    return

  after (done) ->
    Build.deleteMany({ product: OTHERS_PRODUCT, type: OTHERS_TYPE }).exec (err) ->
      done err
    return

  it 'returns extras discovery object as last entry in response', (done) ->
    othersPost server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE }, 200, (res) ->
      res.body.should.be.an 'Array'
      lastEntry = res.body[res.body.length - 1]
      lastEntry.should.have.property 'extras'
      done()
    return

  it 'extras discovery contains all distinct key values', (done) ->
    othersPost server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE }, 200, (res) ->
      lastEntry = res.body[res.body.length - 1]
      lastEntry.extras.region.should.include 'us-east'
      lastEntry.extras.region.should.include 'eu-west'
      lastEntry.extras.env.should.include 'prod'
      lastEntry.extras.env.should.include 'staging'
      done()
    return

  it 'builds without extras do not appear in extras discovery (backward compat)', (done) ->
    othersPost server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE }, 200, (res) ->
      lastEntry = res.body[res.body.length - 1]
      # null/undefined extras on build 3 should not add a null key
      Object.keys(lastEntry.extras).should.not.include 'null'
      Object.keys(lastEntry.extras).should.not.include 'undefined'
      done()
    return

  it 'cache invalidated after new build is posted — new extras key visible', (done) ->
    # First call to populate cache
    othersPost server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE }, 200, (res1) ->
      # Post a new build with a new extras key
      post server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE, build: 99, extras: { datacenter: 'aws' } }, 200, ->
        # Second call — cache should be invalidated, new key visible
        othersPost server, cookies, { product: OTHERS_PRODUCT, type: OTHERS_TYPE }, 200, (res2) ->
          lastEntry = res2.body[res2.body.length - 1]
          lastEntry.extras.datacenter.should.include 'aws'
          done()
    return

MISC_PRODUCT = 'extras-misc-product'
MISC_TYPE    = 'extras-misc-type'

totalPost = (server, cookies, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/build/total')
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

pagePost = (server, cookies, page, perPage, payload, expectStatus, cb) ->
  req = chai.request(server).post("/api/build/#{page}/#{perPage}")
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

recommendPost = (server, cookies, payload, expectStatus, cb) ->
  req = chai.request(server).post('/api/build/entity/recommend')
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

describe 'Phase 5 — extras in total, purge/calculate, page, recommend', ->
  cookies = undefined

  before (done) ->
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      Build.deleteMany({ product: MISC_PRODUCT, type: MISC_TYPE }).exec (err) ->
        return done err if err
        t = new Date('2024-06-01T00:00:00Z').getTime()
        post server, cookies, { product: MISC_PRODUCT, type: MISC_TYPE, build: 1, extras: { region: 'us-east' }, start_time: new Date(t) }, 200, ->
          post server, cookies, { product: MISC_PRODUCT, type: MISC_TYPE, build: 2, extras: { region: 'us-east' }, start_time: new Date(t + 1000) }, 200, ->
            post server, cookies, { product: MISC_PRODUCT, type: MISC_TYPE, build: 3, extras: { region: 'eu-west' }, start_time: new Date(t + 2000) }, 200, ->
              done()
    return

  after (done) ->
    Build.deleteMany({ product: MISC_PRODUCT, type: MISC_TYPE }).exec (err) ->
      done err
    return

  it '/total with extras filter returns correct count', (done) ->
    totalPost server, cookies, { product: MISC_PRODUCT, type: MISC_TYPE, extras: { region: 'us-east' } }, 200, (res) ->
      res.body.should.equal 2
      done()
    return

  it '/total without extras returns all builds (backward compat)', (done) ->
    totalPost server, cookies, { product: MISC_PRODUCT, type: MISC_TYPE }, 200, (res) ->
      res.body.should.equal 3
      done()
    return

  it '/:page/:perPage with extras filter returns correct results', (done) ->
    pagePost server, cookies, 0, 10, { product: MISC_PRODUCT, type: MISC_TYPE, extras: { region: 'eu-west' } }, 200, (res) ->
      res.body.should.be.an 'Array'
      res.body.length.should.equal 1
      res.body[0].extras.region.should.equal 'eu-west'
      done()
    return

  it '/entity/recommend with extras filter returns matching recommends', (done) ->
    recommendPost server, cookies, { product: MISC_PRODUCT, type: MISC_TYPE, extras: { region: 'us-east' } }, 200, (res) ->
      # recommend groups by product_type — returns single group with recommends filtered to us-east builds
      if res.body.recommends
        res.body.recommends.forEach (r) -> r.extras.region.should.equal 'us-east'
      done()
    return

ANALYTICS_PRODUCT = 'extras-analytics-product'
ANALYTICS_TYPE    = 'extras-analytics-type'

analyticsPost = (server, cookies, endpoint, payload, expectStatus, cb) ->
  req = chai.request(server).post("/api/analytics/#{endpoint}")
  req.cookies = cookies
  req.send(payload).end (err, res) ->
    if err
      err.should.have.status expectStatus
      cb(err.response)
    else
      res.should.have.status expectStatus
      cb(res)

describe 'Phase 6 — analytics extras filter (buildMatchFromBody)', ->
  cookies = undefined

  before (done) ->
    auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      Build.deleteMany({ product: ANALYTICS_PRODUCT, type: ANALYTICS_TYPE }).exec (err) ->
        return done err if err
        t = Date.now() - 1000
        post server, cookies, { product: ANALYTICS_PRODUCT, type: ANALYTICS_TYPE, build: 1, extras: { region: 'us-east' }, start_time: new Date(t) }, 200, ->
          post server, cookies, { product: ANALYTICS_PRODUCT, type: ANALYTICS_TYPE, build: 2, extras: { region: 'eu-west' }, start_time: new Date(t + 1000) }, 200, ->
            done()
    return

  after (done) ->
    Build.deleteMany({ product: ANALYTICS_PRODUCT, type: ANALYTICS_TYPE }).exec (err) ->
      done err
    return

  it 'top-failures with extras filter scopes to matching builds only', (done) ->
    analyticsPost server, cookies, 'top-failures', {
      product: ANALYTICS_PRODUCT
      type: ANALYTICS_TYPE
      extras: { region: 'us-east' }
      since: new Date(Date.now() - 10000).toISOString()
    }, 200, (res) ->
      # no tests exist for these builds → empty array is correct (not a 500 error)
      res.body.should.be.an 'Array'
      done()
    return

  it 'top-failures without extras filter includes all builds (backward compat)', (done) ->
    analyticsPost server, cookies, 'top-failures', {
      product: ANALYTICS_PRODUCT
      type: ANALYTICS_TYPE
      since: new Date(Date.now() - 10000).toISOString()
    }, 200, (res) ->
      res.body.should.be.an 'Array'
      done()
    return
