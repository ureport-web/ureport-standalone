chai = require('chai')
chai.should()
{ computeQuarantineInsights } = require('../../src/utils/quarantine_insights')

MIN = 60000
HOUR = 60 * MIN
DAY = 24 * HOUR
T0 = new Date('2026-03-10T00:00:00Z')
at = (days, extraMs = 0) -> new Date(T0.getTime() + days * DAY + extraMs)

period = { since: at(0), until: at(7) }
now = at(8)

live = (fields) ->
  Object.assign({ _id: Math.random().toString(36).slice(2), uid: 'a test', product: 'shop', type: 'ui', rule_name: 'many failures', is_active: true, is_exempt: false, cycle: 1, quarantined_at: at(1) }, fields)
stay = (fields) ->
  Object.assign({ uid: 'a test', product: 'shop', type: 'ui', rule_name: 'many failures', resolved_by: 'auto', quarantined_at: at(1), resolved_at: at(3) }, fields)
compute = (docs, history, extra = {}) ->
  computeQuarantineInsights(docs, history, Object.assign({}, period, { now: now }, extra))

describe 'quarantine insights', ->

  describe 'counting stays', ->
    it 'a stay in progress that started in the period entered; one that started before did not', ->
      r = compute([live({ quarantined_at: at(2) }), live({ quarantined_at: at(-5) })], [])
      r.activeNow.should.equal 2
      r.entered.should.equal 1
      r.left.should.equal 0

    it 'a finished stay is counted once where it started and once where it ended, whichever days those are', ->
      # started and ended in the period
      r = compute([], [stay({ quarantined_at: at(1), resolved_at: at(3) })])
      [r.entered, r.left, r.net].should.eql [1, 1, 0]
      # started before, ended in the period
      r = compute([], [stay({ quarantined_at: at(-4), resolved_at: at(2) })])
      [r.entered, r.left].should.eql [0, 1]
      # started in the period, ended after it
      r = compute([], [stay({ quarantined_at: at(6), resolved_at: at(20) })])
      [r.entered, r.left].should.eql [1, 0]

    it 'a live row that was resolved repeats a history row and is not counted', ->
      r = compute([live({ is_active: false, quarantined_at: at(1) })], [stay({ quarantined_at: at(1), resolved_at: at(3) })])
      r.activeNow.should.equal 0
      r.entered.should.equal 1

    it 'a test that came back counts its second stay as well as the first', ->
      r = compute([live({ cycle: 2, quarantined_at: at(5) })], [stay({ quarantined_at: at(1), resolved_at: at(3), cycle: 1 })])
      [r.entered, r.left, r.activeNow, r.repeatOffenders].should.eql [2, 1, 1, 1]

    it 'net is entered minus left, so a growing quarantine is positive', ->
      r = compute([live({ quarantined_at: at(2) }), live({ quarantined_at: at(3) })], [stay({ quarantined_at: at(-3), resolved_at: at(4) })])
      r.net.should.equal 1

  describe 'how stays ended', ->
    it 'splits the stays that ended in the period by auto, manual and exempt', ->
      r = compute([], [
        stay({ resolved_by: 'auto' }), stay({ resolved_by: 'auto' }), stay({ resolved_by: 'manual' }), stay({ resolved_by: 'exempt' }),
        stay({ resolved_by: 'auto', resolved_at: at(30) })
      ])
      r.leftBy.should.eql { auto: 2, manual: 1, exempt: 1 }

    it 'a stay with no recorded way out counts as manual', ->
      compute([], [stay({ resolved_by: undefined })]).leftBy.manual.should.equal 1

  describe 'time in quarantine', ->
    it 'measures the stays that ended in the period, and separately the ones still going', ->
      r = compute(
        [live({ quarantined_at: at(7, -2 * HOUR) }), live({ quarantined_at: at(7, -6 * HOUR) })],
        [stay({ quarantined_at: at(1), resolved_at: at(2) }), stay({ quarantined_at: at(1), resolved_at: at(4) })]
      )
      r.timeInQuarantine.left.should.eql { count: 2, medianMs: 1 * DAY, p90Ms: 3 * DAY }
      # now is at(8): one has been there 26h, the other 30h
      r.timeInQuarantine.active.count.should.equal 2
      r.timeInQuarantine.active.medianMs.should.equal 26 * HOUR
      r.timeInQuarantine.active.p90Ms.should.equal 30 * HOUR

    it 'is empty with nothing to measure', ->
      r = compute([], [])
      r.timeInQuarantine.left.should.eql { count: 0, medianMs: null, p90Ms: null }

  describe 'by rule', ->
    it 'counts entries per rule, with how many are in quarantine now, most entries first', ->
      r = compute(
        [live({ rule_name: 'a', quarantined_at: at(2) }), live({ rule_name: 'b', quarantined_at: at(-9) })],
        [stay({ rule_name: 'a' }), stay({ rule_name: 'a' }), stay({ rule_name: 'c' })]
      )
      r.byRule.should.eql [
        { rule: 'a', entered: 3, activeNow: 1 }
        { rule: 'c', entered: 1, activeNow: 0 }
        { rule: 'b', entered: 0, activeNow: 1 }
      ]

    it 'names a missing rule rather than dropping it', ->
      compute([live({ rule_name: undefined })], []).byRule[0].rule.should.equal '(no rule name)'

    it 'keeps ten rules at most', ->
      history = (stay({ rule_name: "rule #{i}" }) for i in [1..12])
      compute([], history).byRule.length.should.equal 10

  describe 'rule effectiveness', ->
    scoped = (scope) -> { scope: scope }

    it 'counts what a rule released, how much of it was automatic, and the median stay', ->
      r = compute([], [
        stay({ rule_name: 'a', resolved_by: 'auto', quarantined_at: at(1), resolved_at: at(2) })
        stay({ rule_name: 'a', resolved_by: 'auto', quarantined_at: at(1), resolved_at: at(4), uid: 'other' })
        stay({ rule_name: 'a', resolved_by: 'manual', quarantined_at: at(1), resolved_at: at(3), uid: 'third' })
      ])
      row = r.ruleEffectiveness[0]
      [row.rule, row.released, row.autoRate, row.returned, row.returnRate, row.medianMs].should.eql ['a', 3, 66.7, 0, 0, 2 * DAY]

    it 'a stay came back when the same test has an active stay with a higher cycle', ->
      r = compute(
        [live({ uid: 'flaky one', cycle: 2, quarantined_at: at(6) })],
        [stay({ uid: 'flaky one', cycle: 1, rule_name: 'many failures' }), stay({ uid: 'steady one', cycle: 1, rule_name: 'many failures' })]
      )
      row = r.ruleEffectiveness.filter((x) -> x.rule is 'many failures')[0]
      [row.released, row.returned, row.returnRate].should.eql [2, 1, 50]

    it 'a stay came back when a later stay of the same test has itself ended', ->
      r = compute([], [stay({ cycle: 1, resolved_at: at(2) }), stay({ cycle: 2, quarantined_at: at(3), resolved_at: at(5) })])
      row = r.ruleEffectiveness[0]
      # the first stay came back; the second has not (yet)
      [row.released, row.returned].should.eql [2, 1]

    it 'a later stay in another lane scope, or of another test, is not a return', ->
      r = compute(
        [live({ uid: 'a test', cycle: 2, scope: { browser: 'firefox' } }), live({ uid: 'someone else', cycle: 2 })],
        [stay({ uid: 'a test', cycle: 1, scope: { browser: 'chrome' } })]
      )
      r.ruleEffectiveness.filter((x) -> x.released > 0)[0].returned.should.equal 0

    it 'a stay with no cycle counts as the first', ->
      r = compute([live({ cycle: 2 })], [stay({ cycle: undefined })])
      r.ruleEffectiveness.filter((x) -> x.released > 0)[0].returned.should.equal 1

    it 'leaves exempt stays out: those tests were meant never to return', ->
      r = compute([], [stay({ resolved_by: 'exempt' }), stay({ resolved_by: 'auto' })])
      r.ruleEffectiveness[0].released.should.equal 1

    it 'only counts the stays that ended in the period', ->
      r = compute([], [stay({ resolved_at: at(3) }), stay({ resolved_at: at(30) })])
      r.ruleEffectiveness[0].released.should.equal 1

    it 'lists a rule with tests in quarantine now but nothing released, with no rates', ->
      r = compute([live({ rule_name: 'new rule' })], [])
      row = r.ruleEffectiveness[0]
      [row.rule, row.released, row.activeNow].should.eql ['new rule', 0, 1]
      (row.returnRate is null).should.equal true
      (row.autoRate is null).should.equal true
      (row.medianMs is null).should.equal true

    it 'puts the rule that released most first and names a missing rule', ->
      r = compute([], [stay({ rule_name: 'a' }), stay({ rule_name: 'b' }), stay({ rule_name: 'b' }), stay({ rule_name: undefined })])
      r.ruleEffectiveness[0].rule.should.equal 'b'
      r.ruleEffectiveness.map((x) -> x.rule).should.include '(no rule name)'

    it 'narrows by product and type like the rest', ->
      r = compute([], [stay({ product: 'shop' }), stay({ product: 'app' })], { product: 'shop' })
      r.ruleEffectiveness[0].released.should.equal 1

    it 'keeps fifteen rules at most', ->
      compute([], (stay({ rule_name: "rule #{i}" }) for i in [1..20])).ruleEffectiveness.length.should.equal 15

  describe 'repeat offenders and the longest stays', ->
    it 'lists the stays in progress oldest first, with their age, rule and cycle', ->
      r = compute([live({ uid: 'new', quarantined_at: at(6) }), live({ uid: 'old', quarantined_at: at(1), cycle: 3 })], [])
      r.longest.map((x) -> x.uid).should.eql ['old', 'new']
      r.longest[0].ageMs.should.equal 7 * DAY
      r.longest[0].cycle.should.equal 3
      r.longest[0].rule.should.equal 'many failures'

    it 'lists tests quarantined before, most often first, and only those', ->
      r = compute([live({ uid: 'once', cycle: 1 }), live({ uid: 'twice', cycle: 2 }), live({ uid: 'thrice', cycle: 3 })], [])
      r.repeat.map((x) -> x.uid).should.eql ['thrice', 'twice']
      r.repeatOffenders.should.equal 2

    it 'a row with no cycle count is the first stay', ->
      compute([live({ cycle: undefined })], []).repeatOffenders.should.equal 0

    it 'caps the lists at the limit given', ->
      docs = (live({ uid: "t#{i}", cycle: 2 }) for i in [1..30])
      r = compute(docs, [], { listLimit: 5 })
      r.longest.length.should.equal 5
      r.repeat.length.should.equal 5

  describe 'exempt tests', ->
    it 'counts the tests exempted from quarantine', ->
      compute([live({ is_active: false, is_exempt: true }), live({ is_active: false, is_exempt: true }), live({})], []).exemptNow.should.equal 2

  describe 'the trend', ->
    it 'has a bucket per day with how many stays started and ended', ->
      r = compute([], [stay({ quarantined_at: at(1, HOUR), resolved_at: at(3, HOUR) }), stay({ quarantined_at: at(1, 2 * HOUR), resolved_at: at(1, 5 * HOUR) })])
      r.series.granularity.should.equal 'day'
      r.series.buckets.length.should.equal 8
      r.series.buckets[1].outcomes.should.eql { entered: 2, left: 1 }
      r.series.buckets[3].outcomes.should.eql { entered: 0, left: 1 }
      r.series.buckets[0].total.should.equal 0

  describe 'product and type', ->
    docs = [live({ uid: 'a', product: 'shop', type: 'ui', quarantined_at: at(2) }), live({ uid: 'b', product: 'app', type: 'ui', quarantined_at: at(2) })]
    history = [stay({ product: 'shop', type: 'ui' }), stay({ product: 'app', type: 'api' })]

    it 'narrow the numbers and the lists', ->
      r = compute(docs, history, { product: 'shop' })
      [r.activeNow, r.entered, r.left].should.eql [1, 2, 1]
      r.longest.map((x) -> x.uid).should.eql ['a']
      r2 = compute(docs, history, { product: 'app', type: 'api' })
      [r2.activeNow, r2.entered, r2.left].should.eql [0, 1, 1]

    it 'do not narrow by lane, which keeps every lane to compare', ->
      r = compute(docs, history, { product: 'shop' })
      r.byLane.map((l) -> "#{l.product}/#{l.type}").sort().should.eql ['app/api', 'app/ui', 'shop/ui']

  describe 'by lane', ->
    it 'has one row per product and type with what is in quarantine, what entered and left, repeat offenders and the median stay', ->
      r = compute(
        [live({ product: 'shop', type: 'ui', quarantined_at: at(2) }), live({ product: 'shop', type: 'ui', cycle: 2, quarantined_at: at(3) })],
        [stay({ product: 'shop', type: 'ui', quarantined_at: at(1), resolved_at: at(2) }), stay({ product: 'shop', type: 'ui', quarantined_at: at(1), resolved_at: at(4) }), stay({ product: 'app', type: 'api' })]
      )
      shop = r.byLane.filter((l) -> l.product is 'shop')[0]
      shop.should.eql { product: 'shop', type: 'ui', activeNow: 2, entered: 4, left: 2, repeat: 1, medianMs: 1 * DAY }
      r.byLane[0].product.should.equal 'shop'

    it 'a lane with only stays that ended long ago is left out, since every column would read 0', ->
      r = compute([], [stay({ product: 'old', type: 'ui', quarantined_at: at(-40), resolved_at: at(-30) })])
      r.byLane.filter((l) -> l.product is 'old').should.eql []

  it 'handles nothing at all', ->
    r = compute([], [])
    [r.activeNow, r.entered, r.left, r.net, r.repeatOffenders, r.exemptNow].should.eql [0, 0, 0, 0, 0, 0]
    r.byRule.should.eql []
    r.byLane.should.eql []
    r.longest.should.eql []
