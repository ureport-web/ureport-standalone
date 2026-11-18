chai = require('chai')
chai.should()
{ computeOverlapInsights } = require('../../src/utils/overlap_insights')

HOUR = 3600000
DAY = 24 * HOUR
T0 = new Date('2026-03-10T00:00:00Z')
at = (days) -> new Date(T0.getTime() + days * DAY)
now = at(10)

quarantined = (fields) -> Object.assign({ uid: 'a test', product: 'shop', type: 'ui', rule_name: 'many failures', cycle: 1, quarantined_at: at(2) }, fields)
assignment = (fields) -> Object.assign({ uid: 'a test', product: 'shop', type: 'ui', username: 'alice', assign_at: at(5) }, fields)
triage = (fields) -> Object.assign({ uid: 'a test', product: 'shop', type: 'ui', caused_by: 'Defect', create_at: at(6), is_auto_triaged: false }, fields)
compute = (q, a, t, extra = {}) -> computeOverlapInsights(q, a, t, Object.assign({ now: now }, extra))

describe 'overlap insights', ->

  describe 'counting tests, not rows', ->
    it 'counts a test once however many rows it has, and counts each area it is in', ->
      r = compute([quarantined({})], [assignment({}), assignment({ username: 'bob' })], [triage({}), triage({ create_at: at(8) })])
      [r.tests, r.inQuarantine, r.assigned, r.triaged].should.eql [1, 1, 1, 1]

    it 'tells tests apart by product, type and uid', ->
      r = compute([quarantined({}), quarantined({ product: 'app' }), quarantined({ type: 'api' }), quarantined({ uid: 'other' })], [], [])
      r.tests.should.equal 4

    it 'a test quarantined in two lane scopes is one test, with its longest stay', ->
      r = compute([quarantined({ scope: { browser: 'chrome' }, quarantined_at: at(7) }), quarantined({ scope: { browser: 'firefox' }, quarantined_at: at(1) })], [assignment({})], [])
      r.tests.should.equal 1
      r.crowded[0].quarantineAgeMs.should.equal 9 * DAY

  describe 'which areas a test is in', ->
    it 'names each combination and counts the tests in it', ->
      r = compute(
        [quarantined({ uid: 'q' }), quarantined({ uid: 'qa' }), quarantined({ uid: 'qt' }), quarantined({ uid: 'all' })]
        [assignment({ uid: 'a' }), assignment({ uid: 'qa' }), assignment({ uid: 'at' }), assignment({ uid: 'all' })]
        [triage({ uid: 't' }), triage({ uid: 'qt' }), triage({ uid: 'at' }), triage({ uid: 'all' })]
      )
      r.combos.should.eql { quarantineOnly: 1, assignmentOnly: 1, triageOnly: 1, quarantineAssignment: 1, quarantineTriage: 1, assignmentTriage: 1, all: 1 }
      [r.tests, r.inTwoOrMore, r.inAll].should.eql [7, 4, 1]

    it 'counts the tests in quarantine that are also being worked on', ->
      r = compute([quarantined({ uid: 'x' }), quarantined({ uid: 'y' }), quarantined({ uid: 'z' })], [assignment({ uid: 'x' })], [triage({ uid: 'y' })])
      r.quarantinedAndWorked.should.equal 2

    it 'the combinations add up to the tests', ->
      r = compute([quarantined({ uid: 'a' }), quarantined({ uid: 'b' })], [assignment({ uid: 'b' }), assignment({ uid: 'c' })], [triage({ uid: 'c' })])
      (v for k, v of r.combos).reduce(((n, x) -> n + x), 0).should.equal r.tests

  describe 'triages in effect', ->
    it 'a triage past its TTL stays on record but is not holding the test', ->
      expired = triage({ is_auto_triaged: true, configuration: { ttl: 3 }, create_at: at(2) })    # ended at(5)
      r = compute([], [], [expired])
      [r.tests, r.triaged].should.eql [0, 0]

    it 'a provisional, permanent or manual triage is', ->
      r = compute([], [], [
        triage({ uid: 'p', is_auto_triaged: true, configuration: { ttl: 30 }, create_at: at(8) })
        triage({ uid: 'm', is_auto_triaged: true, configuration: { ttl: -1 } })
        triage({ uid: 'h' })
      ])
      r.triaged.should.equal 3

  describe 'product and type', ->
    q = [quarantined({ product: 'shop', type: 'ui' }), quarantined({ uid: 'b', product: 'app', type: 'ui' })]
    a = [assignment({ product: 'shop', type: 'ui' }), assignment({ uid: 'b', product: 'app', type: 'ui' })]

    it 'narrow the counts and the list', ->
      r = compute(q, a, [], { product: 'shop' })
      [r.tests, r.inQuarantine, r.inTwoOrMore, r.crowded.length].should.eql [1, 1, 1, 1]

    it 'do not narrow by lane, which keeps every lane to compare', ->
      compute(q, a, [], { product: 'shop' }).byLane.length.should.equal 2

  describe 'by lane', ->
    it 'has one row per product and type, with how many tests are in each area, in two or more, and in all three', ->
      r = compute(
        [quarantined({ uid: 'a' }), quarantined({ uid: 'b' })]
        [assignment({ uid: 'a' }), assignment({ uid: 'c' })]
        [triage({ uid: 'a' }), triage({ uid: 'c', product: 'app' })]
      )
      shop = r.byLane.filter((l) -> l.product is 'shop')[0]
      shop.should.eql { product: 'shop', type: 'ui', tests: 3, quarantined: 2, assigned: 2, triaged: 1, multi: 1, all: 1 }
      r.byLane[0].product.should.equal 'shop'

  describe 'the crowded list', ->
    it 'puts tests in the most areas first, then the longest in quarantine', ->
      r = compute(
        [quarantined({ uid: 'old', quarantined_at: at(1) }), quarantined({ uid: 'new', quarantined_at: at(8) }), quarantined({ uid: 'three', quarantined_at: at(9) })]
        [assignment({ uid: 'old' }), assignment({ uid: 'new' }), assignment({ uid: 'three' })]
        [triage({ uid: 'three' })]
      )
      r.crowded.map((x) -> x.uid).should.eql ['three', 'old', 'new']

    it 'leaves out tests in only one area', ->
      compute([quarantined({})], [], []).crowded.should.eql []

    it 'describes each test: its areas, how long in quarantine, the rule, who has it and the cause', ->
      r = compute([quarantined({ cycle: 3 })], [assignment({ username: 'bob', assign_at: at(7) })], [triage({ caused_by: 'Environment' })])
      r.crowded[0].should.eql {
        uid: 'a test', product: 'shop', type: 'ui', areas: ['quarantine', 'assignment', 'triage']
        quarantineAgeMs: 8 * DAY, rule: 'many failures', cycle: 3, assignee: 'bob', assignmentAgeMs: 3 * DAY, cause: 'Environment'
      }

    it 'a test with two open assignments shows the oldest', ->
      r = compute([quarantined({})], [assignment({ username: 'new one', assign_at: at(9) }), assignment({ username: 'old one', assign_at: at(3) })], [])
      r.crowded[0].assignee.should.equal 'old one'

    it 'the newest triage speaks for the test', ->
      r = compute([quarantined({})], [], [triage({ caused_by: 'Old', create_at: at(1) }), triage({ caused_by: 'New', create_at: at(9) })])
      r.crowded[0].cause.should.equal 'New'

    it 'caps the list at the limit given', ->
      docs = (quarantined({ uid: "t#{i}" }) for i in [1..30])
      compute(docs, (assignment({ uid: "t#{i}" }) for i in [1..30]), [], { listLimit: 5 }).crowded.length.should.equal 5

  it 'handles nothing at all', ->
    r = compute([], [], [])
    [r.tests, r.inTwoOrMore, r.inAll, r.quarantinedAndWorked].should.eql [0, 0, 0, 0]
    r.byLane.should.eql []
    r.crowded.should.eql []
