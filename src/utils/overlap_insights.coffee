# The numbers behind the Overlap insights: tests that several workflows are holding at the same moment.
# Pure: the route reads, this counts.
#
# A test can be in quarantine, have an open assignment, and have a triage, all at once. That is not wrong, but
# a test in all three and still unresolved is where the effort is going without an answer. This is a snapshot
# of right now. It has no period, because none of the three keeps the dates that would make one meaningful.
#
# A test is told apart by product, type and uid. Lane scope is ignored on purpose: whoever looks at a
# quarantined test wants to know about the test, in any scope.

{ ms } = require('./insights_math')
{ expiresAt } = require('./triage_insights')

# every combination of areas, named; the key is the areas joined in this order: quarantine, assignment, triage
COMBOS = {
  'quarantine': 'quarantineOnly'
  'assignment': 'assignmentOnly'
  'triage': 'triageOnly'
  'quarantine+assignment': 'quarantineAssignment'
  'quarantine+triage': 'quarantineTriage'
  'assignment+triage': 'assignmentTriage'
  'quarantine+assignment+triage': 'all'
}

testKey = (r) -> [r.product or '', r.type or '', r.uid or ''].join('\u0000')

# An auto-triage past its TTL stays in the database but no longer applies, so it is not holding the test
inEffect = (triage, now) ->
  e = expiresAt(triage)
  not e or e.getTime() > now.getTime()

# quarantined  the tests in quarantine now (active live rows)
# assignments  the open assignments
# triages      every triage on record
# opts         { now, product, type, listLimit }
# product and type narrow everything except `byLane`, which keeps every lane to compare.
computeOverlapInsights = (quarantined, assignments, triages, opts) ->
  now = opts.now or new Date()
  listLimit = opts.listLimit or 20

  tests = {}
  slot = (r) -> tests[testKey(r)] ?= { uid: r.uid, product: r.product or '', type: r.type or '', quarantine: null, assignments: [], triage: null }
  for q in quarantined
    t = slot(q)
    # the same test can be quarantined in more than one scope: keep the longest stay
    t.quarantine = q if not t.quarantine or new Date(q.quarantined_at) < new Date(t.quarantine.quarantined_at)
  slot(a).assignments.push a for a in assignments
  for d in triages when inEffect(d, now)
    t = slot(d)
    # the newest triage speaks for the test
    t.triage = d if not t.triage or new Date(d.create_at or 0) > new Date(t.triage.create_at or 0)

  areasOf = (t) ->
    list = []
    list.push 'quarantine' if t.quarantine
    list.push 'assignment' if t.assignments.length
    list.push 'triage' if t.triage
    list

  all = (t for k, t of tests)
  inLane = (t) -> (not opts.product or t.product is opts.product) and (not opts.type or t.type is opts.type)
  mine = all.filter inLane

  combos = { quarantineOnly: 0, assignmentOnly: 0, triageOnly: 0, quarantineAssignment: 0, quarantineTriage: 0, assignmentTriage: 0, all: 0 }
  counts = { quarantine: 0, assignment: 0, triage: 0 }
  for t in mine
    list = areasOf(t)
    counts[a]++ for a in list
    combos[COMBOS[list.join('+')]]++ if list.length

  quarantinedAndWorked = (mine.filter (t) -> t.quarantine and (t.assignments.length or t.triage)).length

  # every lane, whatever the filter
  lanes = {}
  (lanes["#{t.product}\u0000#{t.type}"] ?= { product: t.product, type: t.type, rows: [] }).rows.push t for t in all
  byLane = for k, l of lanes
    c = { tests: l.rows.length, quarantined: 0, assigned: 0, triaged: 0, multi: 0, all: 0 }
    for t in l.rows
      list = areasOf(t)
      c.quarantined++ if t.quarantine
      c.assigned++ if t.assignments.length
      c.triaged++ if t.triage
      c.multi++ if list.length >= 2
      c.all++ if list.length is 3
    { product: l.product, type: l.type, tests: c.tests, quarantined: c.quarantined, assigned: c.assigned, triaged: c.triaged, multi: c.multi, all: c.all }
  byLane.sort (a, b) -> (b.multi - a.multi) or (b.tests - a.tests) or a.product.localeCompare(b.product) or a.type.localeCompare(b.type)

  # the tests holding the most attention: in the most areas, then the longest in quarantine
  describe = (t) ->
    oldestAssignment = t.assignments.slice().sort((a, b) -> new Date(a.assign_at) - new Date(b.assign_at))[0]
    {
      uid: t.uid, product: t.product or null, type: t.type or null
      areas: areasOf(t)
      quarantineAgeMs: if t.quarantine then ms(t.quarantine.quarantined_at, now) else null
      rule: t.quarantine?.rule_name or null
      cycle: t.quarantine?.cycle or null
      assignee: oldestAssignment?.username or null
      assignmentAgeMs: if oldestAssignment then ms(oldestAssignment.assign_at, now) else null
      cause: t.triage?.caused_by or null
    }
  crowded = mine.filter((t) -> areasOf(t).length >= 2)
  crowded.sort (a, b) ->
    (areasOf(b).length - areasOf(a).length) or
    ((if b.quarantine then ms(b.quarantine.quarantined_at, now) else 0) - (if a.quarantine then ms(a.quarantine.quarantined_at, now) else 0)) or
    String(a.uid).localeCompare(String(b.uid))

  {
    asOf: now
    tests: mine.length
    inQuarantine: counts.quarantine
    assigned: counts.assignment
    triaged: counts.triage
    inTwoOrMore: crowded.length
    inAll: combos.all
    quarantinedAndWorked: quarantinedAndWorked
    combos: combos
    byLane: byLane
    crowded: crowded.slice(0, listLimit).map(describe)
  }

module.exports = { computeOverlapInsights }
