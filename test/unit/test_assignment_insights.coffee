chai = require('chai')
chai.should()
{ computeAssignmentInsights } = require('../../src/utils/assignment_insights')

HOUR = 3600000
DAY = 24 * HOUR
T0 = new Date('2026-03-10T00:00:00Z')
at = (days, extraMs = 0) -> new Date(T0.getTime() + days * DAY + extraMs)
period = { since: at(0), until: at(7) }
now = at(8)

assignment = (fields) ->
  Object.assign({ _id: Math.random().toString(36).slice(2), uid: 'a test', product: 'shop', type: 'ui', username: 'alice', assigned_by_username: 'lead', state: 'OPEN', assign_at: at(2) }, fields)
compute = (docs, extra = {}) ->
  computeAssignmentInsights(docs, Object.assign({}, period, { now: now }, extra))

describe 'assignment insights', ->

  describe 'open and assigned', ->
    it 'counts what is open now, whenever it was assigned, and what was assigned in the period', ->
      r = compute([assignment({ assign_at: at(2) }), assignment({ assign_at: at(-20) }), assignment({ state: 'RESOLVED', assign_at: at(3) }), assignment({ state: 'RESOLVED', assign_at: at(-9) })])
      [r.openNow, r.assigned].should.eql [2, 2]

    it 'of what was assigned in the period, counts how many were resolved and how many unassigned, apart', ->
      r = compute([assignment({ state: 'RESOLVED' }), assignment({ state: 'CLOSE' }), assignment({ state: 'CLOSE' }), assignment({})])
      [r.resolved, r.unassigned].should.eql [1, 2]

    it 'counts a state it does not know with the unassigned ones, so nothing closed goes missing', ->
      compute([assignment({ state: 'WEIRD' })]).unassigned.should.equal 1

    it 'an assignment resolved before the period does not count as resolved in it', ->
      compute([assignment({ state: 'RESOLVED', assign_at: at(-9) })]).resolved.should.equal 0

  describe 'how long open work has waited', ->
    it 'puts open assignments in under three days, three to seven, and over a week', ->
      # now is at(8): these have waited 1, 4, 8 and 13 days
      r = compute([assignment({ assign_at: at(7) }), assignment({ assign_at: at(4) }), assignment({ assign_at: at(0) }), assignment({ assign_at: at(-5) })])
      r.ageBuckets.should.eql { under3d: 1, d3to7: 1, over7d: 2 }
      r.overWeek.should.equal 2

    it 'exactly three days and exactly seven days both count as three to seven', ->
      r = compute([assignment({ assign_at: at(5) }), assignment({ assign_at: at(1) })])
      r.ageBuckets.should.eql { under3d: 0, d3to7: 2, over7d: 0 }

    it 'leaves out the assignments that are not open', ->
      compute([assignment({ state: 'RESOLVED', assign_at: at(-30) })]).ageBuckets.should.eql { under3d: 0, d3to7: 0, over7d: 0 }

    it 'reports the oldest open one, and nothing when none is open', ->
      compute([assignment({ assign_at: at(1) }), assignment({ assign_at: at(6) })]).oldestMs.should.equal 7 * DAY
      (compute([]).oldestMs is null).should.equal true

  describe 'workload', ->
    it 'counts open work per assignee, most first, naming an assignment with nobody', ->
      r = compute([assignment({ username: 'alice' }), assignment({ username: 'alice' }), assignment({ username: 'bob' }), assignment({ username: undefined }), assignment({ username: 'carol', state: 'RESOLVED' })])
      r.byAssignee.should.eql [{ assignee: 'alice', open: 2 }, { assignee: 'bob', open: 1 }, { assignee: '(nobody)', open: 1 }]
      r.assignees.should.equal 3

    it 'keeps ten assignees at most', ->
      r = compute((assignment({ username: "user #{i}" }) for i in [1..12]))
      r.byAssignee.length.should.equal 10
      r.assignees.should.equal 12

  describe 'the longest open', ->
    it 'lists open assignments oldest first with who has it, who assigned it and how long', ->
      r = compute([assignment({ uid: 'new', assign_at: at(6) }), assignment({ uid: 'old', assign_at: at(-2), username: 'bob', assigned_by_username: 'boss' }), assignment({ uid: 'done', state: 'RESOLVED', assign_at: at(-9) })])
      r.longest.map((x) -> x.uid).should.eql ['old', 'new']
      r.longest[0].should.contain { assignee: 'bob', assignedBy: 'boss', ageMs: 10 * DAY }

    it 'caps the list at the limit given', ->
      compute((assignment({ uid: "t#{i}" }) for i in [1..30]), { listLimit: 5 }).longest.length.should.equal 5

  describe 'the trend', ->
    it 'has a bucket per day with what was assigned that day, by whether it is open or not today', ->
      r = compute([assignment({ assign_at: at(1, HOUR) }), assignment({ assign_at: at(1, 2 * HOUR), state: 'RESOLVED' }), assignment({ assign_at: at(4, HOUR), state: 'RESOLVED' })])
      r.series.granularity.should.equal 'day'
      r.series.buckets.length.should.equal 8
      r.series.buckets[1].outcomes.should.eql { open: 1, resolved: 1, unassigned: 0 }
      r.series.buckets[4].outcomes.should.eql { open: 0, resolved: 1, unassigned: 0 }

  describe 'product and type', ->
    docs = [assignment({ product: 'shop', type: 'ui' }), assignment({ product: 'shop', type: 'api' }), assignment({ product: 'app', type: 'ui' })]

    it 'narrow the numbers and the lists', ->
      r = compute(docs, { product: 'shop', type: 'ui' })
      [r.openNow, r.assigned, r.longest.length].should.eql [1, 1, 1]

    it 'do not narrow by lane, which keeps every lane to compare', ->
      compute(docs, { product: 'shop' }).byLane.length.should.equal 3

  describe 'by lane', ->
    it 'has one row per product and type with open, assigned, resolved, over a week and the oldest', ->
      r = compute([
        assignment({ product: 'shop', type: 'ui', assign_at: at(1) })
        assignment({ product: 'shop', type: 'ui', assign_at: at(-5) })
        assignment({ product: 'shop', type: 'ui', state: 'RESOLVED', assign_at: at(2) })
        assignment({ product: 'app', type: 'api', assign_at: at(-9), state: 'RESOLVED' })
      ])
      shop = r.byLane.filter((l) -> l.product is 'shop')[0]
      shop.should.eql { product: 'shop', type: 'ui', openNow: 2, assigned: 2, resolvedOnRecord: 1, unassignedOnRecord: 0, overWeek: 1, oldestMs: 13 * DAY }
      r.byLane[0].product.should.equal 'shop'

    it 'a lane with only closed work from before the period still appears, with what is closed on record', ->
      r = compute([
        assignment({ product: 'old', type: 'ui', state: 'RESOLVED', assign_at: at(-60) })
        assignment({ product: 'old', type: 'ui', state: 'CLOSE', assign_at: at(-50) })
        assignment({ product: 'old', type: 'ui', state: 'CLOSE', assign_at: at(-40) })
      ])
      old = r.byLane[0]
      [old.openNow, old.assigned, old.resolvedOnRecord, old.unassignedOnRecord].should.eql [0, 0, 1, 2]
      (old.oldestMs is null).should.equal true

  it 'handles nothing at all', ->
    r = compute([])
    [r.openNow, r.assigned, r.resolved, r.unassigned, r.overWeek, r.assignees].should.eql [0, 0, 0, 0, 0, 0]
    r.byAssignee.should.eql []
    r.byLane.should.eql []
    r.longest.should.eql []
