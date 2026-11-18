/**
 * Shared by the core insights endpoints (quarantine, triage, assignment). The auto-heal plugin keeps its
 * own copy of the same maths in plugins/auto-heal/signal-stats.js, because a plugin must not depend on a
 * file a particular host version might not have.
 */

const DAY_MS = 24 * 60 * 60 * 1000
// A month. The week, two-week and month periods fit; 3 months and long custom ranges do not.
const COMMUNITY_MAX_PERIOD_DAYS = 31
const DEFAULT_PERIOD_DAYS = 7
const MAX_DAILY_SPAN = 35
const MAX_BUCKETS = 400

const parseDate = (value) => {
  const d = value ? new Date(value) : null
  return d && !isNaN(d.getTime()) ? d : null
}

/**
 * The period a request asks for: `until` (default now) and `since` (default a week before until).
 * An unreadable date counts as missing.
 */
function periodFromQuery(query, now = new Date()) {
  const until = parseDate(query.until) || now
  const since = parseDate(query.since) || new Date(until.getTime() - DEFAULT_PERIOD_DAYS * DAY_MS)
  return { since, until }
}

/** The viewer's time zone in minutes (what `Date#getTimezoneOffset` gives in a browser); 0 when it is not sensible. */
function tzOffsetFromQuery(query) {
  const n = parseInt(query.tz_offset, 10)
  return Number.isFinite(n) && Math.abs(n) <= 15 * 60 ? n : 0
}

/** Whether a period is longer than a community licence may ask for. */
function exceedsCommunityPeriod(since, until) {
  return new Date(until).getTime() - new Date(since).getTime() > COMMUNITY_MAX_PERIOD_DAYS * DAY_MS
}

/** Milliseconds from one time to another; null when either is missing or the second is earlier. */
function ms(from, to) {
  if (!from || !to) return null
  const d = new Date(to).getTime() - new Date(from).getTime()
  return Number.isFinite(d) && d >= 0 ? d : null
}

/** Nearest-rank percentile of a list of numbers; null when the list is empty. */
function percentile(values, p) {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)]
}

function durationStats(values) {
  return { count: values.length, medianMs: percentile(values, 50), p90Ms: percentile(values, 90) }
}

// Day number since the epoch in the viewer's time zone: local = UTC - offset.
const localDay = (date, tzOffsetMin) => Math.floor((new Date(date).getTime() - tzOffsetMin * 60000) / DAY_MS)
const dayLabel = (day) => new Date(day * DAY_MS).toISOString().slice(0, 10)

/**
 * Counts per day, or per week once the period is longer than 35 days, with every bucket present so a quiet
 * day shows as a gap. Days are the viewer's, not the server's.
 * @param {{ date: Date|string, key: string }[]} events  each counted in the bucket of its date, under its key
 * @param {{ since: Date, until: Date, tzOffsetMin?: number, keys: string[] }} opts
 * @returns {{ granularity: 'day'|'week', buckets: { start: string, total: number, outcomes: object }[] }}
 */
function bucketSeries(events, { since, until, tzOffsetMin = 0, keys }) {
  const first = localDay(since, tzOffsetMin)
  const last = Math.max(first, localDay(until, tzOffsetMin))
  const span = last - first + 1
  const granularity = span <= MAX_DAILY_SPAN ? 'day' : 'week'
  const step = granularity === 'day' ? 1 : 7
  const count = Math.min(Math.ceil(span / step), MAX_BUCKETS)

  const buckets = Array.from({ length: count }, (_, i) => ({
    start: dayLabel(first + i * step),
    total: 0,
    outcomes: Object.fromEntries(keys.map((k) => [k, 0])),
  }))
  for (const e of events) {
    const idx = Math.floor((localDay(e.date, tzOffsetMin) - first) / step)
    if (idx < 0 || idx >= count) continue
    buckets[idx].total++
    buckets[idx].outcomes[e.key] = (buckets[idx].outcomes[e.key] || 0) + 1
  }
  return { granularity, buckets }
}

module.exports = {
  COMMUNITY_MAX_PERIOD_DAYS, DAY_MS,
  periodFromQuery, tzOffsetFromQuery, exceedsCommunityPeriod,
  ms, percentile, durationStats, bucketSeries,
}
