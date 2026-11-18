# The numbers behind the Triage insights, from plain InvestigatedTest rows. Pure: the route reads, this counts.
#
# A triage row has a creation date and no end: a manual one stays until someone deletes it, and an auto-triaged
# one with a TTL stays in the database after it expires (the test just stops being treated as triaged). So
# what is countable is what was created in the period, and what is on record now. Nothing here says when a
# triage "ended", because the data does not.

{ durationStats, ms, bucketSeries, DAY_MS } = require('./insights_math')

NO_CAUSE = '(no cause given)'
UNKNOWN_USER = '(unknown)'
OUTCOME_KEYS = ['manual', 'auto']

isPlaceholder = (name) -> if name.charAt(0) is '(' then 1 else 0
laneKey = (r) -> "#{r.product or ''}\u0000#{r.type or ''}"
rate = (n, of_) -> if of_ > 0 then Math.round(n / of_ * 1000) / 10 else null
inRange = (date, since, untilDate) ->
  return false unless date
  t = new Date(date).getTime()
  t >= since.getTime() and t <= untilDate.getTime()

hasTicket = (d) ->
  n = d.tracking?.track_number
  n? and String(n).trim() isnt ''

# When an auto-triage stops applying, from its own creation date. The real check counts from the test's run
# time, so this is the nearest a count of rows can come: good for "about to expire", not to the minute.
expiresAt = (d) ->
  ttl = d.configuration?.ttl
  return null unless d.is_auto_triaged and ttl > 0 and d.create_at
  new Date(new Date(d.create_at).getTime() + ttl * DAY_MS)

# manual, or auto by how it matched: token (permanent), exact message, stack
methodOf = (d) ->
  return 'manual' unless d.is_auto_triaged
  if d.auto_triage_match_type in ['token', 'exact', 'stack'] then d.auto_triage_match_type else 'other'

summarizeLane = (rows, since, untilDate, now) ->
  created = rows.filter (d) -> inRange(d.create_at, since, untilDate)
  auto = created.filter (d) -> d.is_auto_triaged
  expired = rows.filter (d) -> (e = expiresAt(d)) and e.getTime() <= now.getTime()
  {
    onRecord: rows.length
    triaged: created.length
    autoRate: rate(auto.length, created.length)
    ticketRate: rate(created.filter(hasTicket).length, created.length)
    expired: expired.length
  }

# docs       every triage row, with the fields below
# userNames  { "<user id>": "alice" } for the people who triaged in the period
# opts       { since, until, tzOffsetMin, now, product, type, listLimit }
# product and type narrow everything except `byLane`, which keeps every lane to compare.
computeTriageInsights = (docs, userNames, opts) ->
  since = opts.since
  untilDate = opts.until
  now = opts.now or new Date()
  listLimit = opts.listLimit or 20
  inLane = (r) -> (not opts.product or r.product is opts.product) and (not opts.type or r.type is opts.type)

  rows = docs.filter inLane
  created = rows.filter (d) -> inRange(d.create_at, since, untilDate)
  autoCreated = created.filter (d) -> d.is_auto_triaged
  manualCreated = created.filter (d) -> not d.is_auto_triaged

  expired = rows.filter (d) -> (e = expiresAt(d)) and e.getTime() <= now.getTime()
  provisional = rows.filter (d) -> (e = expiresAt(d)) and e.getTime() > now.getTime()

  byMethod = { manual: 0, token: 0, exact: 0, stack: 0, other: 0 }
  byMethod[methodOf(d)]++ for d in created

  top = (counts, limit) ->
    list = ({ name: k, count: v } for k, v of counts)
    # most first; on a tie a real name comes before a placeholder such as "(unknown)"
    list.sort (a, b) -> (b.count - a.count) or (isPlaceholder(a.name) - isPlaceholder(b.name)) or a.name.localeCompare(b.name)
    list.slice(0, limit)

  causes = {}
  causes[d.caused_by or NO_CAUSE] = (causes[d.caused_by or NO_CAUSE] or 0) + 1 for d in created

  people = {}
  for d in manualCreated
    name = (d.user? and userNames[String(d.user)]) or UNKNOWN_USER
    people[name] = (people[name] or 0) + 1

  lanes = {}
  (lanes[laneKey(d)] ?= { product: d.product or '', type: d.type or '', rows: [] }).rows.push d for d in docs
  byLane = for k, l of lanes
    s = summarizeLane(l.rows, since, untilDate, now)
    { product: l.product, type: l.type, onRecord: s.onRecord, triaged: s.triaged, autoRate: s.autoRate, ticketRate: s.ticketRate, expired: s.expired }
  byLane.sort (a, b) -> ((b.triaged + b.onRecord) - (a.triaged + a.onRecord)) or a.product.localeCompare(b.product) or a.type.localeCompare(b.type)

  expiring = provisional
    .slice()
    .sort((a, b) -> expiresAt(a) - expiresAt(b))
    .slice(0, listLimit)
    .map (d) ->
      {
        id: String(d._id), uid: d.uid, product: d.product or null, type: d.type or null
        matchType: d.auto_triage_match_type or null, createdAt: d.create_at
        expiresAt: expiresAt(d), msLeft: ms(now, expiresAt(d))
      }

  {
    onRecord: rows.length
    triaged: created.length
    auto: autoCreated.length
    autoRate: rate(autoCreated.length, created.length)
    ticketRate: rate(created.filter(hasTicket).length, created.length)
    expired: expired.length
    provisional: provisional.length
    byMethod: byMethod
    byCause: top(causes, 10).map (c) -> { cause: c.name, count: c.count }
    byUser: top(people, 10).map (c) -> { user: c.name, count: c.count }
    series: bucketSeries(
      created.map((d) -> { date: d.create_at, key: if d.is_auto_triaged then 'auto' else 'manual' }),
      { since: since, until: untilDate, tzOffsetMin: opts.tzOffsetMin or 0, keys: OUTCOME_KEYS }
    )
    byLane: byLane
    expiring: expiring
  }

module.exports = { computeTriageInsights, expiresAt }
