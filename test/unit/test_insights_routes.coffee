chai = require('chai')
chai.use(require('chai-http'))
chai.should()
express = require('express')
{ setCachedState, invalidateCache } = require('../../src/utils/license')

# Route tests without a database: the models the routes read are replaced in the require cache before the
# router loads. Each fake records the query it was asked and answers with the rows a test set up.
stubbed = []
stub = (modulePath, exports) ->
  resolved = require.resolve(modulePath)
  stubbed.push { resolved: resolved, previous: require.cache[resolved] }
  require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports: exports }
restoreStubs = ->
  for s in stubbed
    if s.previous then require.cache[s.resolved] = s.previous else delete require.cache[s.resolved]

liveRows = []
historyRows = []
triageRows = []
assignmentRows = []
userRows = []
userReadError = null
queries = { live: [], history: [], triage: [], assignment: [], users: [], selects: [] }
readError = null

fakeModel = (name, rows, error = -> readError) ->
  find: (query) ->
    queries[name].push query
    chain =
      select: (fields) -> queries.selects.push(fields); chain
      limit: -> chain
      lean: -> chain
      exec: (cb) -> if error() then cb(error()) else cb(null, rows())
    chain

stub('../../src/models/quarantined_test', fakeModel('live', -> liveRows))
stub('../../src/models/quarantine_history', fakeModel('history', -> historyRows))
stub('../../src/models/investigated_test', fakeModel('triage', -> triageRows))
stub('../../src/models/assignment', fakeModel('assignment', -> assignmentRows))
stub('../../src/models/user', fakeModel('users', (-> userRows), -> userReadError))

freshRouter = (modulePath) ->
  resolved = require.resolve(modulePath)
  stubbed.push { resolved: resolved, previous: require.cache[resolved] }
  delete require.cache[resolved]
  require(modulePath)
insightsRouter = freshRouter('../../src/routes/insights')
restoreStubs()

makeApp = ->
  app = express()
  app.use('/api/insights', insightsRouter)
  app.use (err, req, res, next) -> res.status(500).json({ message: err.message })
  app

# chai-http rejects on 4xx/5xx; these tests assert on error responses, so always resolve with the response.
get = (path) ->
  req = chai.request(makeApp()).get(path)
  then: (ok, fail) ->
    new Promise((resolve) -> req.end (err, res) -> resolve(err?.response or res)).then(ok, fail)

setLicense = (isCommunity) ->
  setCachedState { valid: true, plan: (if isCommunity then 'community' else 'business'), features: [], isCommunity: isCommunity }

period = 'since=2026-03-01&until=2026-03-08'

describe 'GET /api/insights/quarantine', ->

  beforeEach ->
    setLicense(false)
    liveRows = []
    historyRows = []
    readError = null
    queries = { live: [], history: [], triage: [], assignment: [], users: [], selects: [] }

  after -> invalidateCache()

  it 'reads the stays in progress or exempt, and every stay that ended in or after the period', ->
    get("/api/insights/quarantine?#{period}").then (res) ->
      res.status.should.equal 200
      queries.live[0].should.eql { $or: [{ is_active: true }, { is_exempt: true }] }
      Object.keys(queries.history[0]).should.eql ['resolved_at']
      new Date(queries.history[0].resolved_at.$gte).toISOString().should.equal '2026-03-01T00:00:00.000Z'
      # no upper bound: the stays that came after the period are how "came back" is worked out
      queries.history[0].resolved_at.should.not.have.property '$lte'

  it 'asks only for the fields it counts', ->
    get("/api/insights/quarantine?#{period}").then ->
      queries.selects.join(' ').should.contain 'quarantined_at'
      queries.selects.join(' ').should.contain 'cycle'
      queries.selects.join(' ').should.contain 'scope'
      queries.selects.join(' ').should.not.contain 'fail_snapshot'

  it 'answers with the period and the numbers', ->
    liveRows = [{ _id: 'a', uid: 'checkout works', product: 'shop', type: 'ui', rule_name: 'many failures', is_active: true, is_exempt: false, cycle: 2, quarantined_at: new Date('2026-03-03T00:00:00Z') }]
    historyRows = [{ uid: 'login works', product: 'shop', type: 'ui', rule_name: 'many failures', resolved_by: 'auto', quarantined_at: new Date('2026-03-02T00:00:00Z'), resolved_at: new Date('2026-03-04T00:00:00Z') }]
    get("/api/insights/quarantine?#{period}").then (res) ->
      res.body.period.since.should.equal '2026-03-01T00:00:00.000Z'
      [res.body.activeNow, res.body.entered, res.body.left, res.body.repeatOffenders].should.eql [1, 2, 1, 1]
      res.body.leftBy.should.eql { auto: 1, manual: 0, exempt: 0 }
      res.body.byLane[0].product.should.equal 'shop'
      res.body.series.granularity.should.equal 'day'

  it 'narrows the numbers by product and type but keeps every lane', ->
    liveRows = [
      { _id: 'a', uid: 'a', product: 'shop', type: 'ui', is_active: true, cycle: 1, quarantined_at: new Date('2026-03-03T00:00:00Z') }
      { _id: 'b', uid: 'b', product: 'app', type: 'ui', is_active: true, cycle: 1, quarantined_at: new Date('2026-03-03T00:00:00Z') }
    ]
    get("/api/insights/quarantine?#{period}&product=shop").then (res) ->
      res.body.activeNow.should.equal 1
      res.body.byLane.length.should.equal 2

  it 'defaults to the week before now', ->
    get('/api/insights/quarantine').then (res) ->
      res.status.should.equal 200
      (new Date(res.body.period.until) - new Date(res.body.period.since)).should.equal 7 * 86400000

  it 'follows the viewer time zone for the days of the trend', ->
    historyRows = [{ uid: 'a', product: 'shop', type: 'ui', resolved_by: 'auto', quarantined_at: new Date('2026-03-02T23:30:00Z'), resolved_at: new Date('2026-03-05T00:00:00Z') }]
    get("/api/insights/quarantine?since=2026-03-01T00:00:00Z&until=2026-03-04T00:00:00Z&tz_offset=-120").then (res) ->
      day = (start) -> res.body.series.buckets.filter((b) -> b.start is start)[0]
      day('2026-03-03').outcomes.entered.should.equal 1
      day('2026-03-02').outcomes.entered.should.equal 0

  it 'passes a read error on', ->
    readError = new Error('db down')
    get("/api/insights/quarantine?#{period}").then (res) ->
      res.status.should.equal 500
      res.body.message.should.equal 'db down'

  describe 'the community period limit', ->
    quarter = 'since=2026-01-01&until=2026-04-01'

    it 'a community licence may ask for a month but not three', ->
      setLicense(true)
      get("/api/insights/quarantine?#{period}").then (ok) ->
        ok.status.should.equal 200
        get("/api/insights/quarantine?#{quarter}").then (refused) ->
          refused.status.should.equal 403
          refused.body.error.should.match /Team plan/
          # the refusal comes before any read
          queries.live.length.should.equal 1

    it 'a paid licence may ask for three months', ->
      setLicense(false)
      get("/api/insights/quarantine?#{quarter}").then (res) -> res.status.should.equal 200

    it 'no period given is a week, which community may have', ->
      setLicense(true)
      get('/api/insights/quarantine').then (res) -> res.status.should.equal 200


describe 'GET /api/insights/triage', ->

  beforeEach ->
    setLicense(false)
    triageRows = []
    userRows = []
    userReadError = null
    readError = null
    queries = { live: [], history: [], triage: [], assignment: [], users: [], selects: [] }

  after -> invalidateCache()

  row = (fields) -> Object.assign({ _id: Math.random().toString(36).slice(2), uid: 'a test', product: 'shop', type: 'ui', user: 'u1', caused_by: 'Defect', create_at: new Date('2026-03-03T00:00:00Z'), is_auto_triaged: false }, fields)

  it 'reads every triage, asking only for the fields it counts', ->
    get("/api/insights/triage?#{period}").then (res) ->
      res.status.should.equal 200
      queries.triage[0].should.eql {}
      queries.selects[0].should.contain 'create_at'
      queries.selects[0].should.contain 'tracking.track_number'
      queries.selects[0].should.not.contain 'failure'
      queries.selects[0].should.not.contain 'comments'

  it 'answers with the period and the numbers', ->
    triageRows = [row({}), row({ is_auto_triaged: true, auto_triage_match_type: 'exact', configuration: { ttl: 100000 } }), row({ create_at: new Date('2025-12-01T00:00:00Z') })]
    get("/api/insights/triage?#{period}").then (res) ->
      res.body.period.since.should.equal '2026-03-01T00:00:00.000Z'
      [res.body.onRecord, res.body.triaged, res.body.auto, res.body.provisional].should.eql [3, 2, 1, 1]
      res.body.byMethod.exact.should.equal 1

  it 'looks up the names of the people who triaged by hand in the period, and only those', ->
    userRows = [{ _id: 'u1', username: 'alice' }]
    triageRows = [row({ user: 'u1' }), row({ user: 'u2', create_at: new Date('2025-12-01T00:00:00Z') }), row({ user: 'u3', is_auto_triaged: true })]
    get("/api/insights/triage?#{period}").then (res) ->
      queries.users[0].should.eql { _id: { $in: ['u1'] } }
      res.body.byUser.should.eql [{ user: 'alice', count: 1 }]

  it 'does not look anyone up when nobody triaged by hand in the period', ->
    triageRows = [row({ is_auto_triaged: true })]
    get("/api/insights/triage?#{period}").then (res) ->
      res.status.should.equal 200
      queries.users.length.should.equal 0

  it 'still answers when the names cannot be read, with a placeholder for them', ->
    triageRows = [row({ user: 'u1' })]
    userReadError = new Error('users down')
    get("/api/insights/triage?#{period}").then (res) ->
      res.status.should.equal 200
      res.body.triaged.should.equal 1
      res.body.byUser.should.eql [{ user: '(unknown)', count: 1 }]

  it 'narrows the numbers by product and type but keeps every lane', ->
    triageRows = [row({ product: 'shop' }), row({ product: 'app' })]
    get("/api/insights/triage?#{period}&product=shop").then (res) ->
      res.body.triaged.should.equal 1
      res.body.byLane.length.should.equal 2

  it 'passes a read error on', ->
    readError = new Error('db down')
    get("/api/insights/triage?#{period}").then (res) ->
      res.status.should.equal 500

  it 'a community licence may ask for a month but not three', ->
    setLicense(true)
    get("/api/insights/triage?#{period}").then (ok) ->
      ok.status.should.equal 200
      get('/api/insights/triage?since=2026-01-01&until=2026-04-01').then (refused) ->
        refused.status.should.equal 403
        refused.body.error.should.match /Team plan/
        queries.triage.length.should.equal 1


describe 'GET /api/insights/assignment', ->

  beforeEach ->
    setLicense(false)
    assignmentRows = []
    readError = null
    queries = { live: [], history: [], triage: [], assignment: [], users: [], selects: [] }

  after -> invalidateCache()

  row = (fields) -> Object.assign({ _id: Math.random().toString(36).slice(2), uid: 'a test', product: 'shop', type: 'ui', username: 'alice', assigned_by_username: 'lead', state: 'OPEN', assign_at: new Date('2026-03-03T00:00:00Z') }, fields)

  it 'reads every assignment, asking only for the fields it counts', ->
    get("/api/insights/assignment?#{period}").then (res) ->
      res.status.should.equal 200
      queries.assignment[0].should.eql {}
      queries.selects[0].should.contain 'assign_at'
      queries.selects[0].should.not.contain 'failure'
      queries.selects[0].should.not.contain 'comments'

  it 'answers with the period and the numbers', ->
    assignmentRows = [row({}), row({ state: 'RESOLVED' }), row({ assign_at: new Date('2025-12-01T00:00:00Z') })]
    get("/api/insights/assignment?#{period}").then (res) ->
      res.body.period.until.should.equal '2026-03-08T00:00:00.000Z'
      [res.body.openNow, res.body.assigned, res.body.resolved, res.body.unassigned].should.eql [2, 2, 1, 0]
      res.body.byAssignee[0].should.eql { assignee: 'alice', open: 2 }

  it 'narrows the numbers by product but keeps every lane', ->
    assignmentRows = [row({ product: 'shop' }), row({ product: 'app' })]
    get("/api/insights/assignment?#{period}&product=app").then (res) ->
      res.body.openNow.should.equal 1
      res.body.byLane.length.should.equal 2

  it 'follows the viewer time zone for the days of the trend', ->
    assignmentRows = [row({ assign_at: new Date('2026-03-02T23:30:00Z') })]
    get("/api/insights/assignment?since=2026-03-01T00:00:00Z&until=2026-03-04T00:00:00Z&tz_offset=-120").then (res) ->
      day = (start) -> res.body.series.buckets.filter((b) -> b.start is start)[0]
      day('2026-03-03').outcomes.open.should.equal 1

  it 'passes a read error on', ->
    readError = new Error('db down')
    get("/api/insights/assignment?#{period}").then (res) ->
      res.status.should.equal 500

  it 'a community licence may ask for a month but not three', ->
    setLicense(true)
    get("/api/insights/assignment?#{period}").then (ok) ->
      ok.status.should.equal 200
      get('/api/insights/assignment?since=2026-01-01&until=2026-04-01').then (refused) ->
        refused.status.should.equal 403
        queries.assignment.length.should.equal 1


describe 'GET /api/insights/overlap', ->

  beforeEach ->
    liveRows = []
    assignmentRows = []
    triageRows = []
    readError = null
    queries = { live: [], history: [], triage: [], assignment: [], users: [], selects: [] }

  it 'reads the tests in quarantine, the open assignments and every triage, asking only for the fields it counts', ->
    get('/api/insights/overlap').then (res) ->
      res.status.should.equal 200
      queries.live[0].should.eql { is_active: true }
      queries.assignment[0].should.eql { state: 'OPEN' }
      queries.triage[0].should.eql {}
      queries.selects.join(' ').should.not.contain 'failure'
      queries.selects.join(' ').should.not.contain 'comments'

  it 'answers with the tests in several areas', ->
    liveRows = [{ _id: 'q', uid: 'checkout works', product: 'shop', type: 'ui', rule_name: 'many failures', cycle: 2, quarantined_at: new Date('2026-03-01T00:00:00Z') }]
    assignmentRows = [{ _id: 'a', uid: 'checkout works', product: 'shop', type: 'ui', username: 'alice', assign_at: new Date('2026-03-02T00:00:00Z') }]
    triageRows = [{ _id: 't', uid: 'login works', product: 'shop', type: 'ui', caused_by: 'Defect', create_at: new Date('2026-03-03T00:00:00Z'), is_auto_triaged: false }]
    get('/api/insights/overlap').then (res) ->
      [res.body.tests, res.body.inQuarantine, res.body.assigned, res.body.triaged, res.body.inTwoOrMore].should.eql [2, 1, 1, 1, 1]
      res.body.crowded[0].uid.should.equal 'checkout works'
      res.body.crowded[0].areas.should.eql ['quarantine', 'assignment']
      res.body.should.not.have.property 'period'

  it 'narrows by product and type but keeps every lane', ->
    liveRows = [{ _id: 'q1', uid: 'a', product: 'shop', type: 'ui', quarantined_at: new Date('2026-03-01T00:00:00Z') }, { _id: 'q2', uid: 'b', product: 'app', type: 'ui', quarantined_at: new Date('2026-03-01T00:00:00Z') }]
    get('/api/insights/overlap?product=shop').then (res) ->
      res.body.tests.should.equal 1
      res.body.byLane.length.should.equal 2

  it 'has no period limit: a community licence is not refused', ->
    setLicense(true)
    get('/api/insights/overlap?since=2020-01-01&until=2026-04-01').then (res) ->
      res.status.should.equal 200
      setLicense(false)

  it 'passes a read error on', ->
    readError = new Error('db down')
    get('/api/insights/overlap').then (res) ->
      res.status.should.equal 500
