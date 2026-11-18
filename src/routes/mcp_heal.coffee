mongoose = require('mongoose')
{ z } = require('zod')
HealSignal    = require('../models/heal_signal')
HealExclusion = require('../models/heal_exclusion')
Preset        = require('../models/preset')

# Auto-heal tools for the MCP server. Read-only: nothing here creates, changes or deletes a signal or a rule.
# Outputs are trimmed (long text cut, progress reduced to messages) so an AI client is not flooded.

SIGNAL_STATUSES = ['pending', 'queued', 'running', 'open', 'claimed', 'completed', 'pr_created', 'test_failed', 'bug_confirmed', 'error', 'timed_out', 'no_agent']
MAX_DAYS = 90   # signals are deleted after 90 days

cut = (text, max) ->
  return null unless text
  s = String(text)
  if s.length > max then s.substring(0, max) + '… [truncated, ' + (s.length - max) + ' more chars]' else s

reply = (data) ->
  { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] }

# One line per signal: enough to list and decide which one to open
compactSignal = (s) ->
  id:                s._id.toString()
  status:            s.status
  completion_reason: s.completion_reason or null
  test_uid:          s.test_uid or null
  test_name:         s.test_name or null
  product:           s.product
  type:              s.type
  lane:              s.lane or null
  build_id:          s.build_id?.toString() or null
  test_id:           s.test_id?.toString() or null
  triggered_by:      s.triggered_by or null
  triggered_at:      s.triggered_at
  completed_at:      s.completed_at or null
  dispatch_mode:     s.dispatch_mode or 'agent'
  pr_url:            s.pr_url or null
  branch:            s.branch or null
  bug_tracking_url:  s.bug_report?.tracking_url or null
  error_message:     cut(s.failure_snapshot?.error_message, 300)
  summary:           cut(s.agent_analysis or s.diff_summary, 500)

detailSignal = (s) ->
  d = compactSignal(s)
  d.playbook           = s.playbook_snapshot?.name or null
  d.failure_group_id   = s.failure_group_id or null
  d.affected_test_uids = s.affected_test_uids or []
  d.stack_trace        = cut(s.failure_snapshot?.stack_trace, 4000)
  d.agent_analysis     = cut(s.agent_analysis, 4000)
  d.diff_summary       = cut(s.diff_summary, 2000)
  d.attempted_diff     = cut(s.attempted_diff, 4000)
  d.test_output        = cut(s.test_output, 4000)
  d.error_detail       = cut(s.error_detail, 2000)
  d.bug_report         = s.bug_report or null
  d.external_ref       = s.external_ref or null
  d.claimed_by         = s.claimed_by or null
  d.steps_completed    = s.steps_completed or 0
  d.ai                 = s.ai or null
  d.lane_history       = s.lane_history or []
  # Last 15 steps, message only; the full output stays in the UI
  d.progress           = (s.progress_log or []).slice(-15).map((e) ->
    { at: e.received_at, step: e.step_id, status: e.status, message: cut(e.message, 200) })
  d

# Heal info that goes next to a test. `signals` are all signals of the test uid in the lane, newest first.
# `isCurrent(signal)` says whether a signal belongs to the run being shown; only that one is the test's heal status,
# the rest is history (same rule as the UI).
healOfTest = (signals, isCurrent) ->
  current = null
  for s in signals
    if isCurrent(s)
      current = s
      break
  history = signals.filter((s) -> s isnt current)
  out =
    heal: if current then {
      signal_id:         current._id.toString()
      status:            current.status
      completion_reason: current.completion_reason or null
      pr_url:            current.pr_url or null
      triggered_by:      current.triggered_by or null
      triggered_at:      current.triggered_at
    } else null
    heal_history_count: history.length
  if history.length > 0
    latest = history[0]
    out.heal_history_latest = { signal_id: latest._id.toString(), status: latest.status, pr_url: latest.pr_url or null, triggered_at: latest.triggered_at }
  out

# Signals of the given test uids in one lane (product + type), newest first, grouped by uid.
signalsByUid = (uids, productRegex, typeRegex) ->
  new Promise((resolve, reject) ->
    if uids.length is 0 then return resolve({})
    HealSignal.find({ product: productRegex, type: typeRegex, test_uid: { $in: uids } })
      .sort({ triggered_at: -1 })
      .select('test_id test_uid build_id status completion_reason pr_url triggered_by triggered_at')
      .exec((err, signals) ->
        if err then return reject(err)
        byUid = {}
        signals.forEach((s) -> (byUid[s.test_uid] ?= []).push(s))
        resolve(byUid)
      )
  )

# get_tests: heal status of each test run. `tests` are Test documents (with _id).
# A PASS that is a rerun whose heal signal completed was most likely set by auto-heal, not by a person.
healForTests = (tests, productRegex, typeRegex) ->
  signalsByUid(tests.map((t) -> t.uid).filter(Boolean), productRegex, typeRegex).then((byUid) ->
    tests.map((t) ->
      info = healOfTest(byUid[t.uid] or [], (s) -> s.test_id?.toString() is t._id.toString())
      if info.heal and info.heal.status is 'completed' and t.is_rerun and t.status is 'PASS'
        info.test_marked_pass_by_heal = true
      info
    )
  )

# get_new_failures: heal status of each failing uid in the latest builds. `latestBuildIds` are ObjectIds.
healForNewFailures = (uids, latestBuildIds, productRegex, typeRegex) ->
  latest = new Set(latestBuildIds.map((id) -> id.toString()))
  signalsByUid(uids, productRegex, typeRegex).then((byUid) ->
    result = {}
    uids.forEach((uid) ->
      result[uid] = healOfTest(byUid[uid] or [], (s) -> latest.has(s.build_id?.toString()))
    )
    result
  )

register = (server, helpers) ->
  { ciExact } = helpers

  # Product + type from a preset name, or the explicit pair. Callback gets (err, { product, type }).
  resolveLane = (preset, product, type, callback) ->
    if preset
      Preset.findOne({ name: ciExact(preset) }).exec((err, doc) ->
        if err then return callback(err)
        unless doc and doc.lanes?.length then return callback(new Error("Preset '#{preset}' not found"))
        callback(null, { product: doc.lanes[0].product, type: doc.lanes[0].type })
      )
    else if product and type
      callback(null, { product: product, type: type })
    else
      callback(new Error('Provide either preset, or product and type'))

  sinceDate = (days) -> new Date(Date.now() - Math.min(days, MAX_DAYS) * 24 * 60 * 60 * 1000)

  server.tool('get_heal_signals',
    'List Auto-Heal signals (attempts to fix a failing test), newest first. Read-only. Filter by product+type (case-insensitive), test_uid, status, dispatch_mode, since_days. Statuses: completed = finished with no pull request (test passed on rerun, see completion_reason flaky / not_reproducible), pr_created = a fix PR exists (pr_url), test_failed = fix tried, still failing, bug_confirmed = real product bug (bug_tracking_url), error / timed_out / no_agent = did not run to the end, pending / queued / running / open / claimed = in flight. Signals are kept for 90 days. Call get_heal_signal for the full detail of one.',
    {
      product:       z.string().optional()
      type:          z.string().optional()
      test_uid:      z.string().optional()
      test_name:     z.string().optional()
      status:        z.enum(SIGNAL_STATUSES).optional()
      dispatch_mode: z.enum(['agent', 'external']).optional()
      since_days:    z.number().int().min(1).max(MAX_DAYS).optional().default(30)
      limit:         z.number().int().min(1).max(100).optional().default(25)
    },
    ({ product, type, test_uid, test_name, status, dispatch_mode, since_days, limit }) ->
      new Promise((resolve, reject) ->
        query = { triggered_at: { $gte: sinceDate(since_days) } }
        if product   then query.product  = ciExact(product)
        if type      then query.type     = ciExact(type)
        if test_uid  then query.test_uid = test_uid
        if test_name then query.test_name = new RegExp(test_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        if status    then query.status   = status
        if dispatch_mode
          # Signals from before dispatch_mode existed have no value and count as agent
          query.dispatch_mode = if dispatch_mode is 'agent' then { $in: ['agent', null] } else 'external'
        HealSignal.find(query)
          .sort({ triggered_at: -1 })
          .limit(limit)
          .select('-progress_log -step_outputs -playbook_snapshot -attempted_diff -test_output')
          .exec((err, signals) ->
            if err then return reject(err)
            resolve(reply({ total: signals.length, signals: signals.map(compactSignal) }))
          )
      )
  )

  server.tool('get_heal_signal',
    'Get one Auto-Heal signal in full: failure (error + stack trace), AI analysis, diff summary, attempted diff, test output, bug report, PR link and the last steps of the run. Read-only. Long text is truncated. Get signal_id from get_heal_signals, or from the heal field of get_tests / get_new_failures.',
    { signal_id: z.string() },
    ({ signal_id }) ->
      new Promise((resolve, reject) ->
        unless mongoose.Types.ObjectId.isValid(signal_id)
          return resolve(reply({ error: 'signal_id is not a valid id' }))
        HealSignal.findById(signal_id).exec((err, signal) ->
          if err then return reject(err)
          unless signal then return resolve(reply({ error: 'Signal not found (signals are deleted after 90 days)' }))
          resolve(reply(detailSignal(signal)))
        )
      )
  )

  server.tool('get_heal_summary',
    'Summarise Auto-Heal for a lane over the last N days: signals by status, how many ended with a PR, passed on rerun without a code change (flaky), or confirmed a product bug, who triggered them (auto vs a user), average minutes to finish, the most common failure groups and the latest PRs. Read-only. Give a preset name (from list_presets) or product+type. A preset is scoped by the product and type of its first lane.',
    {
      preset:  z.string().optional()
      product: z.string().optional()
      type:    z.string().optional()
      days:    z.number().int().min(1).max(MAX_DAYS).optional().default(7)
    },
    ({ preset, product, type, days }) ->
      new Promise((resolve, reject) ->
        resolveLane(preset, product, type, (err, lane) ->
          if err then return reject(err)
          query = { product: ciExact(lane.product), type: ciExact(lane.type), triggered_at: { $gte: sinceDate(days) } }
          HealSignal.find(query)
            .sort({ triggered_at: -1 })
            .limit(5000)
            .select('status completion_reason triggered_by triggered_at completed_at failure_group_id test_name test_uid pr_url failure_snapshot.error_message dispatch_mode')
            .lean()
            .exec((err2, signals) ->
              if err2 then return reject(err2)
              byStatus = {}
              byReason = {}
              auto = 0
              minutes = []
              groups = {}
              signals.forEach((s) ->
                byStatus[s.status] = (byStatus[s.status] or 0) + 1
                if s.status is 'completed'
                  key = s.completion_reason or 'unspecified'
                  byReason[key] = (byReason[key] or 0) + 1
                if s.triggered_by is 'auto' then auto++
                if s.completed_at and s.triggered_at
                  m = (new Date(s.completed_at) - new Date(s.triggered_at)) / 60000
                  if m >= 0 then minutes.push(m)
                if s.failure_group_id
                  g = (groups[s.failure_group_id] ?= { failure_group_id: s.failure_group_id, signals: 0, test_uids: new Set(), sample_test: s.test_name or null, error_message: cut(s.failure_snapshot?.error_message, 200) })
                  g.signals++
                  if s.test_uid then g.test_uids.add(s.test_uid)
              )
              topGroups = Object.keys(groups).map((k) -> groups[k])
                .sort((a, b) -> b.signals - a.signals).slice(0, 5)
                .map((g) -> { failure_group_id: g.failure_group_id, signals: g.signals, tests: g.test_uids.size, sample_test: g.sample_test, error_message: g.error_message })
              resolve(reply({
                product: lane.product
                type:    lane.type
                days:    days
                total_signals: signals.length
                truncated:     signals.length is 5000
                by_status:     byStatus
                completed_by_reason: byReason
                triggered_auto: auto
                triggered_by_user: signals.length - auto
                avg_minutes_to_finish: if minutes.length then Math.round(minutes.reduce(((a, b) -> a + b), 0) / minutes.length) else null
                top_failure_groups: topGroups
                latest_prs: signals.filter((s) -> s.pr_url).slice(0, 5).map((s) -> { test_name: s.test_name, pr_url: s.pr_url, triggered_at: s.triggered_at })
              }))
            )
        )
      )
  )

  server.tool('get_heal_exclusions',
    'List the rules that stop Auto-Heal from opening signals for matching failing tests, for a lane. Read-only. Each rule looks at the error message, the test uid, or the test file/path (target + match + value) and has a reason. Use it to explain why a failing test has no heal signal. Expired rules are left out unless include_expired is true.',
    {
      product:         z.string()
      type:            z.string()
      include_expired: z.boolean().optional().default(false)
    },
    ({ product, type, include_expired }) ->
      new Promise((resolve, reject) ->
        query = { product: ciExact(product), type: ciExact(type) }
        unless include_expired
          query['$or'] = [{ expires_at: null }, { expires_at: { $exists: false } }, { expires_at: { $gt: new Date() } }]
        HealExclusion.find(query).sort({ created_at: -1 }).limit(200).lean().exec((err, rules) ->
          if err then return reject(err)
          resolve(reply({
            total: rules.length
            exclusions: rules.map((r) ->
              id:              r._id.toString()
              target:          r.target
              match:           r.match
              value:           cut(r.value, 300)
              reason:          r.reason
              scope:           r.scope or {}
              source:          r.source
              created_by:      r.created_by or null
              created_at:      r.created_at
              expires_at:      r.expires_at or null
              match_count:     r.match_count or 0
              last_matched_at: r.last_matched_at or null
            )
          }))
        )
      )
  )

module.exports = { register, healForTests, healForNewFailures }
