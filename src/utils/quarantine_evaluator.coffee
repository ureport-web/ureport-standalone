# quarantine_evaluator.coffee
# Evaluates quarantine rules after a build status calculation.
# Called fire-and-forget — never awaited.

QuarantinedTest = require('../models/quarantined_test')
Test = require('../models/test')
Build = require('../models/build')
Setting = require('../models/setting')
TestRelation = require('../models/test_relation')
ObjectId = require('mongoose').Types.ObjectId
matcher = require('./notification_rule_matcher')
logger = require('./logger')

toScope = (obj) ->
  version:          obj?.version          or ''
  team:             obj?.team             or ''
  browser:          obj?.browser          or ''
  device:           obj?.device           or ''
  platform:         obj?.platform         or ''
  platform_version: obj?.platform_version or ''
  stage:            obj?.stage            or ''

normalizeConditions = (threshold) ->
  if Array.isArray(threshold.conditions) and threshold.conditions.length > 0
    threshold.conditions
  else
    [{ mode: 'total', failures: 3 }]

matchesScope = (rule, build) ->
  scope = rule.scope or {}
  ['version', 'team', 'browser', 'device', 'platform', 'platform_version', 'stage'].every (f) ->
    return true unless scope[f]
    build[f] == scope[f]

# Determine which UIDs should be quarantined given per-build failure results.
# condition: { mode, failures, fail_rate }
# results: [{ uid, build, failed }]  (failed = 0 or 1)
# qualifyingBuildIds: ordered array (most-recent-first) of build id strings
# Returns array of { uid, failCount, buildCount, mode }
evaluateThreshold = (condition, results, qualifyingBuildIds, debugLog = ->) ->
  mode = condition.mode or 'total'
  requiredFailures = condition.failures or 3
  requiredFailRate = condition.fail_rate or 0
  buildIdStrs = qualifyingBuildIds.map (id) -> id.toString()

  uidResultMap = {}
  results.forEach (r) ->
    uid = r.uid
    buildStr = if r.build then r.build.toString() else ''
    uidResultMap[uid] = [] unless uidResultMap[uid]
    uidResultMap[uid].push { build: buildStr, failed: r.failed }

  candidateUids = Object.keys(uidResultMap)
  toQuarantine = []

  if mode == 'total'
    candidateUids.forEach (uid) ->
      uidResults = uidResultMap[uid] or []
      failCount = uidResults.reduce ((sum, r) -> sum + r.failed), 0
      debugLog "uid=#{uid} mode=total failCount=#{failCount}+1(current) required>=#{requiredFailures} hit=#{failCount + 1 >= requiredFailures}"
      if failCount + 1 >= requiredFailures
        toQuarantine.push { uid: uid, failCount: failCount, buildCount: uidResults.length, mode: 'total' }
  else if mode == 'ratio'
    return [] if requiredFailRate <= 0
    totalBuilds = qualifyingBuildIds.length
    return [] if totalBuilds == 0
    candidateUids.forEach (uid) ->
      uidResults = uidResultMap[uid] or []
      failCount = uidResults.reduce ((sum, r) -> sum + r.failed), 0
      actualFailRate = (failCount / totalBuilds) * 100
      debugLog "uid=#{uid} mode=ratio failCount=#{failCount}/#{totalBuilds} rate=#{actualFailRate.toFixed(1)}% required>=#{requiredFailRate}% hit=#{actualFailRate >= requiredFailRate}"
      if actualFailRate >= requiredFailRate
        toQuarantine.push { uid: uid, failCount: failCount, buildCount: totalBuilds, mode: 'ratio' }
  else
    # consecutive mode — walk qualifying build IDs most-recent-first
    candidateUids.forEach (uid) ->
      uidResults = uidResultMap[uid] or []
      resultByBuild = {}
      uidResults.forEach (r) -> resultByBuild[r.build] = r.failed
      streak = 0
      i = 0
      while i < buildIdStrs.length
        if resultByBuild[buildIdStrs[i]] == 1
          streak++
        else
          i = buildIdStrs.length # break equivalent
        i++
      debugLog "uid=#{uid} mode=consecutive streak=#{streak}+1(current) required>=#{requiredFailures} hit=#{streak + 1 >= requiredFailures}"
      if streak + 1 >= requiredFailures
        toQuarantine.push { uid: uid, failCount: streak, buildCount: streak, mode: 'consecutive' }

  toQuarantine

# Returns true if the test has >= requiredPasses consecutive passes
# in the most-recent-first ordered buildIds.
# Builds where the test did not run are skipped — only builds with an actual
# result count toward the streak. A FAIL/SKIP breaks the streak.
hasConsecutivePasses = (results, buildIds, requiredPasses) ->
  buildIdStrs = buildIds.map (id) -> id.toString()
  resultByBuild = {}
  results.forEach (r) -> resultByBuild[r.build.toString()] = r.failed
  streak = 0
  i = 0
  while i < buildIdStrs.length
    buildStr = buildIdStrs[i]
    if resultByBuild[buildStr]?
      if resultByBuild[buildStr] == 0
        streak++
      else
        i = buildIdStrs.length  # FAIL/SKIP — break streak
    # Missing result: test did not run in this build, skip it
    i++
  streak >= requiredPasses

# Filter a list of UIDs by a name_pattern regex string.
# Returns filtered array or throws if regex is invalid.
filterByNamePattern = (uids, namePattern) ->
  return uids unless namePattern
  regex = new RegExp(namePattern, 'i')
  uids.filter (uid) -> regex.test(uid)

# In-process concurrency gate: one evaluation at a time per product+type.
# If a second build arrives while one is running, it is queued as the pending
# candidate. Only the latest pending build is kept — intermediate ones are
# superseded. When the running evaluation finishes it picks up the pending one.
# Workers are single-threaded so plain objects are safe — no races.
_evaluating = {}
_pending    = {}

evaluateQuarantineRules = (build) ->
  buildId = build._id?.toString() or '?'
  prefix  = "[quarantine] build=#{buildId} product=#{build.product} type=#{build.type}"

  logger.info "#{prefix} triggered"

  if build.is_archive
    logger.info "#{prefix} skipping — is_archive"
    return

  gateKey = "#{build.product}|#{build.type}"
  if _evaluating[gateKey]
    logger.info "#{prefix} queued as pending — evaluation already in progress for #{gateKey}"
    _pending[gateKey] = build
    return
  _evaluating[gateKey] = true

  release = ->
    delete _evaluating[gateKey]
    if _pending[gateKey]
      pendingBuild = _pending[gateKey]
      delete _pending[gateKey]
      logger.debug "[quarantine] product=#{build.product} type=#{build.type} running pending evaluation for build=#{pendingBuild._id?.toString()}"
      evaluateQuarantineRules(pendingBuild)

  Setting.findOne({ product: build.product, type: build.type }).exec (err, setting) ->
    if err
      logger.error "#{prefix} Setting.findOne error", err
      release()
      return

    unless setting?.quarantine_rules?.rules?.length
      logger.info "#{prefix} no quarantine_rules configured, skipping"
      release()
      return

    enabledRules = setting.quarantine_rules.rules.filter (r) -> r.enabled
    unless enabledRules.length
      logger.info "#{prefix} no enabled rules, skipping"
      release()
      return

    globalBuilds = setting.quarantine_rules.builds or 10
    globalMinBuilds = setting.quarantine_rules.min_builds or 0
    globalMinPassRate = Math.max(setting.quarantine_rules.min_pass_rate or 70, 50)

    # Get failed UIDs from the current build (last status per uid)
    Test.aggregate([
      { $match: { build: { $in: [ObjectId(build._id.toString())] } } },
      { $sort: { start_time: 1, _id: 1 } },
      { $group: { _id: '$uid', status: { $last: '$status' } } },
      { $match: { status: { $in: ['FAIL', 'SKIP'] } } }
    ]).exec (tErr, failedItems) ->
      if tErr
        logger.error "#{prefix} failed-UIDs aggregate error", tErr
        release()
        return
      failedUids = (failedItems or []).map (item) -> item._id
      hasFailures = failedUids.length > 0

      # Current build pass rate (used for per-rule guard)
      total = build.status?.total or 0
      passCount = build.status?.pass or 0
      currentPassRate = if total > 0 then (passCount / total * 100) else 0

      # Fetch previous qualifying builds once, shared across all rules
      # Over-fetch to keep window full after min_pass_rate filtering
      fetchLimit = Math.min(globalBuilds * 2, 100)
      # Match scope of current build so cross-team builds don't pollute the window
      scopeFields = ['version', 'team', 'browser', 'device', 'platform', 'platform_version', 'stage']
      buildScopeFilter = {}
      scopeFields.forEach (f) ->
        if build[f]
          buildScopeFilter[f] = build[f]
      prevBuildsQuery = Object.assign({
        product: build.product,
        type: build.type,
        _id: { $ne: build._id },
        start_time: { $lte: build.start_time or new Date() },
        is_archive: { $ne: true }
      }, buildScopeFilter)
      Build.find(prevBuildsQuery)
      .sort({ start_time: -1 })
      .limit(fetchLimit)
      .select('_id status start_time')
      .exec (bErr, prevBuilds) ->
        if bErr
          logger.error "#{prefix} prevBuilds query error", bErr
          release()
          return
        prevBuilds = prevBuilds or []

        globalMaxWindowDays = setting.quarantine_rules.max_window_days or 0
        if globalMaxWindowDays > 0
          cutoff = new Date((build.start_time or new Date()).getTime() - globalMaxWindowDays * 86400000)
          prevBuilds = prevBuilds.filter (b) -> b.start_time >= cutoff

        # Fetch TestRelation cache once for relation-condition filtering
        TestRelation.find({ product: build.product, type: build.type }).exec (rErr, allRelations) ->
          allRelations = allRelations or []

          # Fetch currently active quarantined UIDs for auto-resolve
          # No scope filter here — ruleScope (stored on the record) may differ from buildScope.
          # The resolve window (arQualifyingBuildIds) is already scoped to this build's lane.
          QuarantinedTest.find({ product: build.product, type: build.type, is_active: true })
          .exec (qErr, activeQuarantined) ->
            activeQuarantined = activeQuarantined or []

            # Fetch exempt UIDs so the upsert loop can skip them
            QuarantinedTest.find({ product: build.product, type: build.type, is_exempt: true })
            .select('uid')
            .exec (eErr, exemptDocs) ->
              exemptUidSet = {}
              (exemptDocs or []).forEach (e) -> exemptUidSet[e.uid] = true

              # --- Evaluate each rule to actually do the quarantine ---
              enabledRules.forEach (rule) ->
                return unless hasFailures
                ruleName = rule.name or rule._id or '?'
                threshold = rule.threshold or {}

                # Guard: skip if current build pass rate is below effective min_pass_rate
                effectiveMinPassRate = if rule.threshold?.min_pass_rate? then rule.threshold.min_pass_rate else globalMinPassRate
                if effectiveMinPassRate > 0 and currentPassRate < effectiveMinPassRate
                  return

                # Scope match (same logic as notification rules)
                unless matchesScope(rule, build)
                  return

                # Filter qualifying previous builds using effective min_pass_rate (per-rule override or global)
                qualifyingBuilds = prevBuilds.filter (b) ->
                  return true if effectiveMinPassRate == 0
                  return false unless b.status?.total and b.status.total > 0
                  pr = if b.status.pass then (b.status.pass / b.status.total * 100) else 0
                  pr >= effectiveMinPassRate

                qualifyingBuildIds = qualifyingBuilds.slice(0, globalBuilds).map (b) -> b._id

                # BR7: skip rule if not enough qualifying build history
                if globalMinBuilds > 0 and qualifyingBuildIds.length < globalMinBuilds
                  return

                # Filter failedUids by name_pattern (regex on uid)
                namePattern = rule.filter?.name_pattern
                candidateUids = failedUids.slice()
                if namePattern
                  try
                    candidateUids = filterByNamePattern(candidateUids, namePattern)
                  catch e
                    logger.error "[quarantine] rule \"#{ruleName}\" invalid name_pattern regex: #{namePattern}", e
                    return

                # Filter by relation conditions (reuse notification rule matcher)
                relations = rule.filter?.relations or []
                if relations.length > 0
                  matchedRelations = matcher.matchesRule(rule, allRelations)
                  matchedUidSet = {}
                  matchedRelations.forEach (r) -> matchedUidSet[r.uid] = true
                  candidateUids = candidateUids.filter (uid) -> matchedUidSet[uid]

                return unless candidateUids.length
                return unless qualifyingBuildIds.length

                logger.info "#{prefix} rule \"#{ruleName}\" evaluating #{candidateUids.length} candidate UIDs across #{qualifyingBuildIds.length} builds"

                # Query test results for candidateUids across the qualifying build window
                Test.aggregate([
                  { $match: { build: { $in: qualifyingBuildIds }, uid: { $in: candidateUids } } },
                  { $sort: { start_time: 1, _id: 1 } },
                  { $group: { _id: { uid: '$uid', build: '$build' }, status: { $last: '$status' } } },
                  { $project: {
                      _id: 0,
                      uid: '$_id.uid',
                      build: '$_id.build',
                      failed: { $cond: [{ $in: ['$status', ['FAIL', 'SKIP']] }, 1, 0] }
                  } }
                ]).exec (aggErr, testResults) ->
                  if aggErr
                    logger.error "#{prefix} rule \"#{ruleName}\" test-results aggregate error", aggErr
                    return

                  # --- DIAG: uncomment to debug UID/build-ID mismatch when testResults is empty ---
                  # if (testResults or []).length == 0
                  #   sampleUids = candidateUids.slice(0, 3).join(', ')
                  #   sampleBuildIds = qualifyingBuildIds.slice(0, 3).map((id) -> id.toString()).join(', ')
                  #   logger.warn "#{prefix} rule \"#{ruleName}\" testResults=0 sampleUids=[#{sampleUids}] sampleBuildIds=[#{sampleBuildIds}]"
                  #   # Probe 1: check if any tests exist for those builds at all (detects UID mismatch)
                  #   Test.aggregate([
                  #     { $match: { build: { $in: qualifyingBuildIds } } },
                  #     { $limit: 1 },
                  #     { $project: { _id: 0, uid: 1, build: 1 } }
                  #   ]).exec (diagErr, diagSample) ->
                  #     if diagErr
                  #       logger.warn "#{prefix} DIAG build-only probe error: #{diagErr.message}"
                  #     else if diagSample and diagSample.length > 0
                  #       logger.warn "#{prefix} DIAG build-only probe hit — uid=#{diagSample[0].uid} build=#{diagSample[0].build} (UID mismatch likely)"
                  #     else
                  #       logger.warn "#{prefix} DIAG build-only probe=0 rows (build ID mismatch or empty builds)"
                  #   # Probe 2: find which recent builds contain the candidateUids (detects build ID mismatch)
                  #   Test.aggregate([
                  #     { $match: { uid: { $in: candidateUids } } },
                  #     { $group: { _id: '$build' } },
                  #     { $sort: { _id: -1 } },
                  #     { $limit: 5 },
                  #     { $project: { _id: 1 } }
                  #   ]).exec (uid2Err, uidBuilds) ->
                  #     unless uid2Err
                  #       qualifyingSet = new Set(qualifyingBuildIds.map (id) -> id.toString())
                  #       uidBuildStrs = (uidBuilds or []).map (r) -> r._id.toString()
                  #       overlap = uidBuildStrs.filter (id) -> qualifyingSet.has(id)
                  #       logger.warn "#{prefix} DIAG candidateUids in #{uidBuildStrs.length} recent builds; overlap with qualifying window=#{overlap.length}; recentBuildIds=[#{uidBuildStrs.join(', ')}]"
                  # --- end DIAG ---

                  # Group by uid
                  uidResultMap = {}
                  testResults.forEach (r) ->
                    uid = r.uid
                    uidResultMap[uid] = [] unless uidResultMap[uid]
                    uidResultMap[uid].push { build: r.build.toString(), failed: r.failed }

                  conditions = normalizeConditions(threshold)
                  uidBestMap = {}
                  conditions.forEach (cond) ->
                    hits = evaluateThreshold(cond, testResults, qualifyingBuildIds)
                    hits.forEach (item) ->
                      existing = uidBestMap[item.uid]
                      if !existing or item.failCount > existing.failCount
                        uidBestMap[item.uid] = item
                  toQuarantine = Object.keys(uidBestMap).map (uid) -> uidBestMap[uid]
                  toQuarantine = toQuarantine.filter (item) -> !exemptUidSet[item.uid]

                  logger.info "#{prefix} rule \"#{ruleName}\" threshold hits=#{toQuarantine.length} (#{Object.keys(uidBestMap).length} before exempt filter)"

                  ruleHasScope = ['version', 'team', 'browser', 'device', 'platform', 'platform_version', 'stage'].some (f) -> rule.scope?[f]
                  ruleScope = if ruleHasScope then toScope(rule.scope) else toScope(build)
                  toQuarantine.forEach (item) ->
                    QuarantinedTest.findOneAndUpdate(
                      { uid: item.uid, product: build.product, type: build.type, scope: ruleScope },
                      {
                        $set: {
                          uid: item.uid,
                          product: build.product,
                          type: build.type,
                          rule_id: (rule._id or '').toString(),
                          rule_name: rule.name or '',
                          quarantined_at: new Date(),
                          fail_snapshot: item.failCount,
                          build_snapshot: qualifyingBuildIds.length,
                          triggered_mode: item.mode or 'total',
                          is_active: true,
                          scope: ruleScope
                        },
                        $unset: { resolved_at: '' }
                      },
                      { upsert: true, new: true, runValidators: false },
                      (uErr, doc) ->
                        if uErr
                          logger.error "[quarantine] upsert error uid=#{item.uid}", uErr
                        else if doc
                          logger.info "[quarantine] quarantined uid=#{item.uid} mode=#{item.mode} failCount=#{item.failCount}/#{item.buildCount} rule=\"#{ruleName}\""
                    )

              # --- Auto-resolve: re-check active quarantined UIDs ---
              if activeQuarantined.length == 0
                release()
                return

              activeUids = activeQuarantined.map (q) -> q.uid
              logger.info "#{prefix} auto-resolve checking #{activeUids.length} active quarantined UID(s)"

              # Auto-resolve window: use all recent builds regardless of pass rate
              # (min_pass_rate applies to quarantine triggering, not resolving)
              arQualifyingBuildIds = [build._id].concat(prevBuilds.slice(0, globalBuilds).map (b) -> b._id)

              unless arQualifyingBuildIds.length
                release()
                return

              Test.aggregate([
                { $match: { build: { $in: arQualifyingBuildIds }, uid: { $in: activeUids } } },
                { $sort: { start_time: 1, _id: 1 } },
                { $group: { _id: { uid: '$uid', build: '$build' }, status: { $last: '$status' } } },
                { $project: {
                    _id: 0,
                    uid: '$_id.uid',
                    build: '$_id.build',
                    failed: { $cond: [{ $in: ['$status', ['FAIL', 'SKIP']] }, 1, 0] }
                } }
              ]).exec (arErr, arResults) ->
                if arErr
                  logger.error "#{prefix} auto-resolve aggregate error", arErr
                  release()
                  return

                arUidMap = {}
                arResults.forEach (r) ->
                  uid = r.uid
                  arUidMap[uid] = [] unless arUidMap[uid]
                  arUidMap[uid].push { build: r.build.toString(), failed: r.failed }

                arBuildIdStrs = arQualifyingBuildIds.map (id) -> id.toString()

                activeQuarantined.forEach (q) ->
                  # Find the rule that originally quarantined this test
                  rule = enabledRules.find (r) -> (r._id or '').toString() == q.rule_id
                  rule = rule or enabledRules[0]

                  threshold = rule.threshold or {}
                  results = arUidMap[q.uid] or []
                  requiredPasses = threshold.resolve_passes or 3
                  shouldResolve = hasConsecutivePasses(results, arQualifyingBuildIds, requiredPasses)

                  logger.debug "[quarantine] auto-resolve uid=#{q.uid} results=#{results.length} required=#{requiredPasses} shouldResolve=#{shouldResolve}"

                  if shouldResolve
                    QuarantinedTest.findOneAndUpdate(
                      { _id: q._id },
                      { is_active: false, resolved_at: new Date() },
                      { new: true },
                      (rErr, doc) ->
                        if rErr
                          logger.error "[quarantine] auto-resolve update error uid=#{q.uid}", rErr
                        else if doc
                          logger.info "[quarantine] auto-resolved uid=#{q.uid} after #{requiredPasses} consecutive passes"
                    )

                release()

module.exports = { evaluateQuarantineRules, matchesScope, evaluateThreshold, hasConsecutivePasses, filterByNamePattern, toScope }
