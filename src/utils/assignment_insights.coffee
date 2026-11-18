# The numbers behind the Assignment insights, from plain Assignment rows. Pure: the route reads, this counts.
#
# An assignment has the day it was made and a state (OPEN, or anything else once it is closed), but no date
# for when it was closed. So this counts what was assigned in the period, what is open now and how long it
# has been open, and never how long an assignment took to resolve.

{ ms, bucketSeries, DAY_MS } = require('./insights_math')

UNASSIGNED = '(nobody)'
OUTCOME_KEYS = ['open', 'resolved', 'unassigned']
SHORT_WAIT_MS = 3 * DAY_MS
LONG_WAIT_MS = 7 * DAY_MS

isPlaceholder = (name) -> if name.charAt(0) is '(' then 1 else 0
laneKey = (r) -> "#{r.product or ''}\u0000#{r.type or ''}"
isOpen = (a) -> a.state is 'OPEN'
# Closed two ways: resolved when the test was triaged, unassigned when someone took the assignment off.
# 'CLOSE' is the unassign state, and any other state that is not open is counted with it.
isResolved = (a) -> a.state is 'RESOLVED'
isUnassigned = (a) -> not isOpen(a) and not isResolved(a)
outcomeOf = (a) -> if isOpen(a) then 'open' else if isResolved(a) then 'resolved' else 'unassigned'
inRange = (date, since, untilDate) ->
  return false unless date
  t = new Date(date).getTime()
  t >= since.getTime() and t <= untilDate.getTime()

summarizeLane = (rows, since, untilDate, now) ->
  open = rows.filter isOpen
  assigned = rows.filter (a) -> inRange(a.assign_at, since, untilDate)
  ages = (ms(a.assign_at, now) for a in open when ms(a.assign_at, now) isnt null)
  {
    openNow: open.length
    assigned: assigned.length
    resolvedOnRecord: (rows.filter isResolved).length
    unassignedOnRecord: (rows.filter isUnassigned).length
    overWeek: (age for age in ages when age > LONG_WAIT_MS).length
    oldestMs: if ages.length then Math.max.apply(null, ages) else null
  }

# docs  every assignment row
# opts  { since, until, tzOffsetMin, now, product, type, listLimit }
# product and type narrow everything except `byLane`, which keeps every lane to compare.
computeAssignmentInsights = (docs, opts) ->
  since = opts.since
  untilDate = opts.until
  now = opts.now or new Date()
  listLimit = opts.listLimit or 20
  inLane = (r) -> (not opts.product or r.product is opts.product) and (not opts.type or r.type is opts.type)

  rows = docs.filter inLane
  open = rows.filter isOpen
  assigned = rows.filter (a) -> inRange(a.assign_at, since, untilDate)
  age = (a) -> ms(a.assign_at, now)

  buckets = { under3d: 0, d3to7: 0, over7d: 0 }
  for a in open
    w = age(a)
    continue if w is null
    if w < SHORT_WAIT_MS then buckets.under3d++
    else if w <= LONG_WAIT_MS then buckets.d3to7++
    else buckets.over7d++

  workload = {}
  workload[a.username or UNASSIGNED] = (workload[a.username or UNASSIGNED] or 0) + 1 for a in open
  byAssignee = ({ assignee: k, open: v } for k, v of workload)
  # most first; on a tie a real name comes before the placeholder
  byAssignee.sort (a, b) -> (b.open - a.open) or (isPlaceholder(a.assignee) - isPlaceholder(b.assignee)) or a.assignee.localeCompare(b.assignee)

  ages = (age(a) for a in open when age(a) isnt null)
  lanes = {}
  (lanes[laneKey(a)] ?= { product: a.product or '', type: a.type or '', rows: [] }).rows.push a for a in docs
  byLane = for k, l of lanes
    s = summarizeLane(l.rows, since, untilDate, now)
    { product: l.product, type: l.type, openNow: s.openNow, assigned: s.assigned, resolvedOnRecord: s.resolvedOnRecord, unassignedOnRecord: s.unassignedOnRecord, overWeek: s.overWeek, oldestMs: s.oldestMs }
  byLane.sort (a, b) -> ((b.openNow + b.assigned + b.resolvedOnRecord + b.unassignedOnRecord) - (a.openNow + a.assigned + a.resolvedOnRecord + a.unassignedOnRecord)) or a.product.localeCompare(b.product) or a.type.localeCompare(b.type)

  longest = open
    .filter((a) -> age(a) isnt null)
    .sort((a, b) -> new Date(a.assign_at) - new Date(b.assign_at))
    .slice(0, listLimit)
    .map (a) ->
      {
        id: String(a._id), uid: a.uid, product: a.product or null, type: a.type or null
        assignee: a.username or null, assignedBy: a.assigned_by_username or null
        assignedAt: a.assign_at, ageMs: age(a)
      }

  {
    openNow: open.length
    assigned: assigned.length
    resolved: (assigned.filter isResolved).length
    unassigned: (assigned.filter isUnassigned).length
    overWeek: buckets.over7d
    oldestMs: if ages.length then Math.max.apply(null, ages) else null
    assignees: byAssignee.length
    ageBuckets: buckets
    byAssignee: byAssignee.slice(0, 10)
    series: bucketSeries(
      assigned.map((a) -> { date: a.assign_at, key: outcomeOf(a) }),
      { since: since, until: untilDate, tzOffsetMin: opts.tzOffsetMin or 0, keys: OUTCOME_KEYS }
    )
    byLane: byLane
    longest: longest
  }

module.exports = { computeAssignmentInsights }
