# The numbers behind the Quarantine insights, from plain rows. Pure: the route reads, this counts.
#
# Two collections feed it:
#   QuarantinedTest   one row per test and lane. is_active true = in quarantine now, and its
#                     quarantined_at / cycle are those of the CURRENT stay. is_exempt true = taken out for good.
#   QuarantineHistory one row per stay that has ENDED, written when it ends (auto, manual or exempt).
# So a stay is exactly one of: an active live row, or a history row. A resolved live row repeats the last
# history row and is never counted.

{ ms, durationStats, bucketSeries } = require('./insights_math')

UNNAMED_RULE = '(no rule name)'
OUTCOME_KEYS = ['entered', 'left']
LEFT_BY = ['auto', 'manual', 'exempt']

SCOPE_FIELDS = ['version', 'team', 'browser', 'device', 'platform', 'platform_version', 'stage', 'extras_key']
scopeKey = (scope) -> (((scope or {})[f] or '') for f in SCOPE_FIELDS).join('\u0001')
# One test in one lane scope: the thing a stay belongs to
testKey = (r) -> [r.product or '', r.type or '', r.uid or '', scopeKey(r.scope)].join('\u0000')

laneKey = (r) -> "#{r.product or ''}\u0000#{r.type or ''}"
rate = (n, of_) -> if of_ > 0 then Math.round(n / of_ * 1000) / 10 else null
inRange = (date, since, untilDate) ->
  return false unless date
  t = new Date(date).getTime()
  t >= since.getTime() and t <= untilDate.getTime()

# One stay that ended inside the period: how long it lasted
stayLength = (h) -> ms(h.quarantined_at, h.resolved_at)

summarizeLane = (active, history, since, untilDate, now) ->
  entered = (active.filter (a) -> inRange(a.quarantined_at, since, untilDate)).length +
            (history.filter (h) -> inRange(h.quarantined_at, since, untilDate)).length
  left = history.filter (h) -> inRange(h.resolved_at, since, untilDate)
  lengths = (stayLength(h) for h in left when stayLength(h) isnt null)
  {
    activeNow: active.length
    entered: entered
    left: left.length
    repeat: (active.filter (a) -> (a.cycle or 1) > 1).length
    medianMs: durationStats(lengths).medianMs
  }

# docs     live rows that are active or exempt
# history  stay rows that ENDED in or after the period (that is every stay that started or ended in it, and the
#          stays that came after them, which "came back" needs)
# opts     { since, until, tzOffsetMin, now, product, type, listLimit }
# product and type narrow everything except `byLane`, which keeps every lane to compare.
computeQuarantineInsights = (docs, history, opts) ->
  since = opts.since
  untilDate = opts.until
  now = opts.now or new Date()
  tzOffsetMin = opts.tzOffsetMin or 0
  listLimit = opts.listLimit or 20
  inLane = (r) -> (not opts.product or r.product is opts.product) and (not opts.type or r.type is opts.type)

  allActive = docs.filter (d) -> d.is_active
  active = allActive.filter inLane
  exemptNow = (docs.filter (d) -> d.is_exempt and inLane(d)).length
  hist = history.filter inLane

  enteredEvents = []
  for a in active when inRange(a.quarantined_at, since, untilDate)
    enteredEvents.push { date: a.quarantined_at, key: 'entered', rule: a.rule_name }
  for h in hist when inRange(h.quarantined_at, since, untilDate)
    enteredEvents.push { date: h.quarantined_at, key: 'entered', rule: h.rule_name }
  leftRows = hist.filter (h) -> inRange(h.resolved_at, since, untilDate)

  leftBy = { auto: 0, manual: 0, exempt: 0 }
  for h in leftRows
    leftBy[if h.resolved_by in LEFT_BY then h.resolved_by else 'manual']++

  leftLengths = (stayLength(h) for h in leftRows when stayLength(h) isnt null)
  activeAges = (ms(a.quarantined_at, now) for a in active when ms(a.quarantined_at, now) isnt null)

  # by rule: tests that entered under it in the period, and how many are in quarantine under it now
  rules = {}
  slot = (name) -> rules[name or UNNAMED_RULE] ?= { rule: (name or UNNAMED_RULE), entered: 0, activeNow: 0 }
  slot(e.rule).entered++ for e in enteredEvents
  slot(a.rule_name).activeNow++ for a in active
  byRule = (v for k, v of rules)
  byRule.sort (a, b) -> (b.entered - a.entered) or (b.activeNow - a.activeNow) or a.rule.localeCompare(b.rule)

  # Rule effectiveness: of the stays a rule released in the period, how many came back. A stay came back when
  # the same test has a later one: an active row, or a history row, with a higher cycle number. Exempt stays
  # are left out, since the test was meant never to return. A stay released only just now has had no time to
  # come back, so the rate reads low for a short or recent period.
  highestCycle = {}
  for r in allActive.concat(history)
    k = testKey(r)
    highestCycle[k] = Math.max(highestCycle[k] or 0, r.cycle or 1)
  released = leftRows.filter (h) -> h.resolved_by isnt 'exempt'
  effect = {}
  effectSlot = (name) -> effect[name or UNNAMED_RULE] ?= { rule: (name or UNNAMED_RULE), released: 0, auto: 0, returned: 0, lengths: [], activeNow: 0 }
  for h in released
    e = effectSlot(h.rule_name)
    e.released++
    e.auto++ if h.resolved_by is 'auto'
    e.returned++ if (highestCycle[testKey(h)] or 1) > (h.cycle or 1)
    len = stayLength(h)
    e.lengths.push len if len isnt null
  effectSlot(a.rule_name).activeNow++ for a in active
  ruleEffectiveness = for k, e of effect
    { rule: e.rule, released: e.released, autoRate: rate(e.auto, e.released), returned: e.returned, returnRate: rate(e.returned, e.released), medianMs: durationStats(e.lengths).medianMs, activeNow: e.activeNow }
  ruleEffectiveness.sort (a, b) -> (b.released - a.released) or (b.activeNow - a.activeNow) or a.rule.localeCompare(b.rule)

  describe = (a) ->
    {
      id: String(a._id), uid: a.uid, product: a.product or null, type: a.type or null
      rule: a.rule_name or null, cycle: a.cycle or 1, quarantinedAt: a.quarantined_at
      ageMs: ms(a.quarantined_at, now)
    }
  longest = active.slice().sort((a, b) -> new Date(a.quarantined_at) - new Date(b.quarantined_at)).slice(0, listLimit).map(describe)
  repeatRows = active.filter((a) -> (a.cycle or 1) > 1)
  repeat = repeatRows.slice().sort((a, b) -> ((b.cycle or 1) - (a.cycle or 1)) or (new Date(a.quarantined_at) - new Date(b.quarantined_at))).slice(0, listLimit).map(describe)

  # every lane, whatever the filter
  lanes = {}
  laneSlot = (r) -> lanes[laneKey(r)] ?= { product: r.product or '', type: r.type or '', active: [], history: [] }
  laneSlot(a).active.push a for a in allActive
  laneSlot(h).history.push h for h in history
  byLane = for k, l of lanes
    row = summarizeLane(l.active, l.history, since, untilDate, now)
    { product: l.product, type: l.type, activeNow: row.activeNow, entered: row.entered, left: row.left, repeat: row.repeat, medianMs: row.medianMs }
  # A lane with nothing in quarantine and nothing entering or leaving in the period would read 0 everywhere
  byLane = byLane.filter (l) -> l.activeNow + l.entered + l.left > 0
  byLane.sort (a, b) -> ((b.activeNow + b.entered) - (a.activeNow + a.entered)) or a.product.localeCompare(b.product) or a.type.localeCompare(b.type)

  {
    activeNow: active.length
    entered: enteredEvents.length
    left: leftRows.length
    net: enteredEvents.length - leftRows.length
    repeatOffenders: repeatRows.length
    exemptNow: exemptNow
    leftBy: leftBy
    timeInQuarantine: { left: durationStats(leftLengths), active: durationStats(activeAges) }
    byRule: byRule.slice(0, 10)
    ruleEffectiveness: ruleEffectiveness.slice(0, 15)
    series: bucketSeries(
      enteredEvents.map((e) -> { date: e.date, key: 'entered' }).concat(leftRows.map((h) -> { date: h.resolved_at, key: 'left' })),
      { since: since, until: untilDate, tzOffsetMin: tzOffsetMin, keys: OUTCOME_KEYS }
    )
    byLane: byLane
    longest: longest
    repeat: repeat
  }

module.exports = { computeQuarantineInsights }
