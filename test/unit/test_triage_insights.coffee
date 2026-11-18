chai = require('chai')
chai.should()
{ computeTriageInsights, expiresAt } = require('../../src/utils/triage_insights')

HOUR = 3600000
DAY = 24 * HOUR
T0 = new Date('2026-03-10T00:00:00Z')
at = (days, extraMs = 0) -> new Date(T0.getTime() + days * DAY + extraMs)
period = { since: at(0), until: at(7) }
now = at(8)

triage = (fields) ->
  Object.assign({ _id: Math.random().toString(36).slice(2), uid: 'a test', product: 'shop', type: 'ui', user: 'u1', caused_by: 'Defect', create_at: at(2), is_auto_triaged: false }, fields)
compute = (docs, names = { u1: 'alice' }, extra = {}) ->
  computeTriageInsights(docs, names, Object.assign({}, period, { now: now }, extra))

describe 'triage insights', ->

  describe 'what was created', ->
    it 'counts the triages created in the period, and all on record, whenever they were created', ->
      r = compute([triage({ create_at: at(2) }), triage({ create_at: at(-30) }), triage({ create_at: at(20) })])
      r.triaged.should.equal 1
      r.onRecord.should.equal 3

    it 'a triage with no creation date is on record but not in any period', ->
      r = compute([triage({ create_at: undefined })])
      [r.onRecord, r.triaged].should.eql [1, 0]

  describe 'manual and auto', ->
    docs = [
      triage({}), triage({}),
      triage({ is_auto_triaged: true, auto_triage_match_type: 'token' }),
      triage({ is_auto_triaged: true, auto_triage_match_type: 'exact' }),
      triage({ is_auto_triaged: true, auto_triage_match_type: 'stack' }),
      triage({ is_auto_triaged: true, auto_triage_match_type: 'something new' })
    ]

    it 'says how many were auto-triaged and what share that is', ->
      r = compute(docs)
      [r.triaged, r.auto, r.autoRate].should.eql [6, 4, 66.7]

    it 'splits by how each was made, with an unknown way counted as other', ->
      compute(docs).byMethod.should.eql { manual: 2, token: 1, exact: 1, stack: 1, other: 1 }

    it 'an auto-triage with no match type is other', ->
      compute([triage({ is_auto_triaged: true })]).byMethod.other.should.equal 1

  describe 'tickets', ->
    it 'counts the share of the triages created in the period that have a ticket linked', ->
      r = compute([triage({ tracking: { track_number: 'QA-1' } }), triage({ tracking: { track_number: '  ' } }), triage({ tracking: {} }), triage({}), triage({ tracking: { track_number: 'QA-2' }, create_at: at(-9) })])
      r.ticketRate.should.equal 25

    it 'has no rate when nothing was created', ->
      r = compute([])
      (r.ticketRate is null).should.equal true
      (r.autoRate is null).should.equal true

  describe 'expiry of auto-triages', ->
    it 'works out the day an auto-triage stops applying from its creation date and its TTL', ->
      expiresAt(triage({ is_auto_triaged: true, configuration: { ttl: 5 }, create_at: at(2) })).getTime().should.equal at(7).getTime()

    it 'a permanent one (-1 or none), or a manual one, never expires', ->
      (expiresAt(triage({ is_auto_triaged: true, configuration: { ttl: -1 } })) is null).should.equal true
      (expiresAt(triage({ is_auto_triaged: true })) is null).should.equal true
      (expiresAt(triage({ configuration: { ttl: 5 } })) is null).should.equal true

    it 'counts the ones past their date, and the ones still provisional', ->
      r = compute([
        triage({ is_auto_triaged: true, configuration: { ttl: 3 }, create_at: at(2) })   # ended at(5)
        triage({ is_auto_triaged: true, configuration: { ttl: 30 }, create_at: at(2) })  # ends at(32)
        triage({ is_auto_triaged: true, configuration: { ttl: -1 } })
        triage({})
      ])
      [r.expired, r.provisional].should.eql [1, 1]

    it 'lists the provisional ones that expire soonest first, with the time left', ->
      r = compute([
        triage({ uid: 'later', is_auto_triaged: true, auto_triage_match_type: 'stack', configuration: { ttl: 30 }, create_at: at(2) })
        triage({ uid: 'soon', is_auto_triaged: true, auto_triage_match_type: 'exact', configuration: { ttl: 7 }, create_at: at(2) })
        triage({ uid: 'done', is_auto_triaged: true, configuration: { ttl: 1 }, create_at: at(2) })
      ])
      r.expiring.map((x) -> x.uid).should.eql ['soon', 'later']
      r.expiring[0].msLeft.should.equal 1 * DAY
      r.expiring[0].matchType.should.equal 'exact'

    it 'caps the list at the limit given', ->
      docs = (triage({ uid: "t#{i}", is_auto_triaged: true, configuration: { ttl: 30 }, create_at: at(2) }) for i in [1..30])
      compute(docs, {}, { listLimit: 5 }).expiring.length.should.equal 5

  describe 'causes and people', ->
    it 'counts the causes of what was created, most often first, naming a missing one', ->
      r = compute([triage({ caused_by: 'Defect' }), triage({ caused_by: 'Defect' }), triage({ caused_by: 'Environment' }), triage({ caused_by: undefined }), triage({ caused_by: 'Old', create_at: at(-9) })])
      r.byCause.should.eql [{ cause: 'Defect', count: 2 }, { cause: 'Environment', count: 1 }, { cause: '(no cause given)', count: 1 }]

    it 'keeps ten causes at most', ->
      compute((triage({ caused_by: "cause #{i}" }) for i in [1..12])).byCause.length.should.equal 10

    it 'counts who triaged by hand, leaving out the auto-triages, with a placeholder for someone not found', ->
      r = compute(
        [triage({ user: 'u1' }), triage({ user: 'u1' }), triage({ user: 'u2' }), triage({ user: 'gone' }), triage({ user: 'u1', is_auto_triaged: true }), triage({ user: undefined })],
        { u1: 'alice', u2: 'bob' }
      )
      r.byUser.should.eql [{ user: 'alice', count: 2 }, { user: '(unknown)', count: 2 }, { user: 'bob', count: 1 }]

    it 'on a tie a real name comes before the placeholder', ->
      r = compute([triage({ user: 'gone' }), triage({ user: 'u1' })])
      r.byUser.map((x) -> x.user).should.eql ['alice', '(unknown)']

  describe 'the trend', ->
    it 'has a bucket per day with how many were made by hand and how many automatically', ->
      r = compute([triage({ create_at: at(1, HOUR) }), triage({ create_at: at(1, 2 * HOUR), is_auto_triaged: true }), triage({ create_at: at(3, HOUR) })])
      r.series.granularity.should.equal 'day'
      r.series.buckets.length.should.equal 8
      r.series.buckets[1].outcomes.should.eql { manual: 1, auto: 1 }
      r.series.buckets[3].outcomes.should.eql { manual: 1, auto: 0 }

  describe 'product and type', ->
    docs = [triage({ product: 'shop', type: 'ui' }), triage({ product: 'shop', type: 'api' }), triage({ product: 'app', type: 'ui' })]

    it 'narrow the numbers and the lists', ->
      r = compute(docs, {}, { product: 'shop', type: 'ui' })
      [r.onRecord, r.triaged].should.eql [1, 1]

    it 'do not narrow by lane, which keeps every lane to compare', ->
      compute(docs, {}, { product: 'shop' }).byLane.length.should.equal 3

  describe 'by lane', ->
    it 'has one row per product and type with what is on record, created, the auto and ticket shares and expired ones', ->
      r = compute([
        triage({ product: 'shop', type: 'ui', tracking: { track_number: 'QA-1' } })
        triage({ product: 'shop', type: 'ui', is_auto_triaged: true, configuration: { ttl: 3 } })
        triage({ product: 'shop', type: 'ui', create_at: at(-30) })
        triage({ product: 'app', type: 'api' })
      ])
      shop = r.byLane.filter((l) -> l.product is 'shop')[0]
      shop.should.eql { product: 'shop', type: 'ui', onRecord: 3, triaged: 2, autoRate: 50, ticketRate: 50, expired: 1 }
      r.byLane[0].product.should.equal 'shop'

    it 'a lane with nothing created in the period still appears', ->
      r = compute([triage({ product: 'old', type: 'ui', create_at: at(-60) })])
      old = r.byLane[0]
      [old.onRecord, old.triaged].should.eql [1, 0]
      (old.autoRate is null).should.equal true

  it 'handles nothing at all', ->
    r = compute([])
    [r.onRecord, r.triaged, r.auto, r.expired, r.provisional].should.eql [0, 0, 0, 0, 0]
    r.byCause.should.eql []
    r.byLane.should.eql []
    r.expiring.should.eql []
