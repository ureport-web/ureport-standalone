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
# Missing result for a build = not a pass (breaks streak).
hasConsecutivePasses = (results, buildIds, requiredPasses) ->
  buildIdStrs = buildIds.map (id) -> id.toString()
  resultByBuild = {}
  results.forEach (r) -> resultByBuild[r.build.toString()] = r.failed
  streak = 0
  i = 0
  while i < buildIdStrs.length
    buildStr = buildIdStrs[i]
    if resultByBuild[buildStr]? and resultByBuild[buildStr] == 0
      streak++
    else
      i = buildIdStrs.length  # break equivalent
    i++
  streak >= requiredPasses

# Filter a list of UIDs by a name_pattern regex string.
# Returns filtered array or throws if regex is invalid.
filterByNamePattern = (uids, namePattern) ->
  return uids unless namePattern
  regex = new RegExp(namePattern, 'i')
  uids.filter (uid) -> regex.test(uid)

evaluateQuarantineRules = (build) ->
  buildId = build._id?.toString() or '?'
  prefix  = "[quarantine] build=#{buildId} product=#{build.product} type=#{build.type}"

  if build.is_archive
    logger.debug "#{prefix} skipping — is_archive"
    return

  logger.info "#{prefix} evaluator started"

  Setting.findOne({ product: build.product, type: build.type }).exec (err, setting) ->
    if err
      logger.error "#{prefix} Setting.findOne error", err
      return

    unless setting?.quarantine_rules?.rules?.length
      logger.debug "#{prefix} no quarantine_rules configured, skipping"
      return

    enabledRules = setting.quarantine_rules.rules.filter (r) -> r.enabled
    unless enabledRules.length
      logger.debug "#{prefix} no enabled rules, skipping"
      return

    logger.info "#{prefix} #{enabledRules.length} enabled rule(s)"

    globalBuilds = setting.quarantine_rules.builds or 10
    globalMinBuilds = setting.quarantine_rules.min_builds or 0
    globalMinPassRate = Math.max(setting.quarantine_rules.min_pass_rate or 70, 50)

    logger.debug "#{prefix} global settings — window=#{globalBuilds} minBuilds=#{globalMinBuilds} minPassRate=#{globalMinPassRate}%"

    # Get failed UIDs from the current build (last status per uid)
    Test.aggregate([
      { $match: { build: { $in: [ObjectId(build._id.toString())] } } },
      { $sort: { start_time: 1, _id: 1 } },
      { $group: { _id: '$uid', status: { $last: '$status' } } },
      { $match: { status: { $in: ['FAIL', 'SKIP'] } } }
    ]).exec (tErr, failedItems) ->
      if tErr
        logger.error "#{prefix} failed-UIDs aggregate error", tErr
        return
      failedUids = (failedItems or []).map (item) -> item._id
      unless failedUids.length
        logger.debug "#{prefix} no failed/skipped UIDs in this build, skipping"
        return

      # Current build pass rate (used for per-rule guard)
      total = build.status?.total or 0
      passCount = build.status?.pass or 0
      currentPassRate = if total > 0 then (passCount / total * 100) else 0

      logger.info "#{prefix} failedUids=#{failedUids.length} currentPassRate=#{currentPassRate.toFixed(1)}%"

      maxWindow = globalBuilds

      # Fetch previous qualifying builds once, shared across all rules
      # Over-fetch to keep window full after min_pass_rate filtering
      fetchLimit = Math.min(maxWindow * 2, 100)
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
      logger.debug "#{prefix} prevBuilds scope filter: #{JSON.stringify(buildScopeFilter)}"
      Build.find(prevBuildsQuery)
      .sort({ start_time: -1 })
      .limit(fetchLimit)
      .select('_id status start_time')
      .exec (bErr, prevBuilds) ->
        if bErr
          logger.error "#{prefix} prevBuilds query error", bErr
          return
        prevBuilds = prevBuilds or []
        logger.debug "#{prefix} fetched #{prevBuilds.length} previous builds (limit #{fetchLimit})"

        globalMaxWindowDays = setting.quarantine_rules.max_window_days or 0
        if globalMaxWindowDays > 0
          cutoff = new Date((build.start_time or new Date()).getTime() - globalMaxWindowDays * 86400000)
          before = prevBuilds.length
          prevBuilds = prevBuilds.filter (b) -> b.start_time >= cutoff
          logger.debug "#{prefix} max_window_days=#{globalMaxWindowDays} trimmed prevBuilds #{before}->#{prevBuilds.length}"

        # Fetch TestRelation cache once for relation-condition filtering
        TestRelation.find({ product: build.product, type: build.type }).exec (rErr, allRelations) ->
          allRelations = allRelations or []

          # Fetch currently active quarantined UIDs for auto-resolve (scoped to current build)
          buildScope = toScope(build)
          QuarantinedTest.find({ product: build.product, type: build.type, is_active: true, scope: buildScope })
          .exec (qErr, activeQuarantined) ->
            activeQuarantined = activeQuarantined or []
            logger.debug "#{prefix} activeQuarantined=#{activeQuarantined.length}"

            # Fetch exempt UIDs so the upsert loop can skip them
            QuarantinedTest.find({ product: build.product, type: build.type, is_exempt: true })
            .select('uid')
            .exec (eErr, exemptDocs) ->
              exemptUidSet = {}
              (exemptDocs or []).forEach (e) -> exemptUidSet[e.uid] = true
              exemptCount = Object.keys(exemptUidSet).length
              logger.debug "#{prefix} exemptUids=#{exemptCount}" if exemptCount > 0

              # --- Evaluate each rule to actually do the quarantine ---
              enabledRules.forEach (rule) ->
                ruleName = rule.name or rule._id or '?'
                threshold = rule.threshold or {}

                # Guard: skip if current build pass rate is below global min_pass_rate
                if currentPassRate < globalMinPassRate
                  logger.debug "#{prefix} rule \"#{ruleName}\" skipped — passRate #{currentPassRate.toFixed(1)}% < minPassRate #{globalMinPassRate}%"
                  return

                # Scope match (same logic as notification rules)
                unless matchesScope(rule, build)
                  logger.debug "#{prefix} rule \"#{ruleName}\" skipped — scope mismatch"
                  return

                # Filter qualifying previous builds using global settings
                qualifyingBuilds = prevBuilds.filter (b) ->
                  return false unless b.status?.total and b.status.total > 0
                  pr = if b.status.pass then (b.status.pass / b.status.total * 100) else 0
                  pr >= globalMinPassRate

                qualifyingBuildIds = qualifyingBuilds.slice(0, globalBuilds).map (b) -> b._id
                logger.debug "#{prefix} rule \"#{ruleName}\" qualifyingBuilds=#{qualifyingBuildIds.length}/#{globalBuilds}"

                # BR7: skip rule if not enough qualifying build history
                if globalMinBuilds > 0 and qualifyingBuildIds.length < globalMinBuilds
                  logger.debug "#{prefix} rule \"#{ruleName}\" skipped — only #{qualifyingBuildIds.length} qualifying builds, need #{globalMinBuilds}"
                  return

                # Filter failedUids by name_pattern (regex on uid)
                namePattern = rule.filter?.name_pattern
                candidateUids = failedUids.slice()
                if namePattern
                  try
                    candidateUids = filterByNamePattern(candidateUids, namePattern)
                    logger.debug "#{prefix} rule \"#{ruleName}\" name_pattern=\"#{namePattern}\" matched #{candidateUids.length}/#{failedUids.length} UIDs"
                  catch e
                    logger.error "[quarantine] rule \"#{ruleName}\" invalid name_pattern regex: #{namePattern}", e
                    return

                # Filter by relation conditions (reuse notification rule matcher)
                relations = rule.filter?.relations or []
                if relations.length > 0
                  matchedRelations = matcher.matchesRule(rule, allRelations)
                  matchedUidSet = {}
                  matchedRelations.forEach (r) -> matchedUidSet[r.uid] = true
                  before = candidateUids.length
                  candidateUids = candidateUids.filter (uid) -> matchedUidSet[uid]
                  logger.debug "#{prefix} rule \"#{ruleName}\" relation filter: #{before}->#{candidateUids.length} UIDs"

                unless candidateUids.length
                  logger.debug "#{prefix} rule \"#{ruleName}\" skipped — no candidate UIDs after filters"
                  return
                unless qualifyingBuildIds.length
                  logger.debug "#{prefix} rule \"#{ruleName}\" skipped — no qualifying build IDs"
                  return

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

                  logger.debug "#{prefix} rule \"#{ruleName}\" testResults=#{(testResults or []).length} rows from aggregate (qualifyingBuildIds=#{qualifyingBuildIds.length})"
                  if (testResults or []).length == 0
                    sampleUids = candidateUids.slice(0, 3).join(', ')
                    sampleBuildIds = qualifyingBuildIds.slice(0, 3).map((id) -> id.toString()).join(', ')
                    logger.debug "#{prefix} rule \"#{ruleName}\" DIAG sampleUids=[#{sampleUids}] sampleBuildIds=[#{sampleBuildIds}]"
                    # Check if any tests exist for those builds at all (ignore UID filter)
                    Test.aggregate([
                      { $match: { build: { $in: qualifyingBuildIds } } },
                      { $limit: 1 },
                      { $project: { _id: 0, uid: 1, build: 1 } }
                    ]).exec (diagErr, diagSample) ->
                      if diagErr
                        logger.debug "#{prefix} rule \"#{ruleName}\" DIAG build-only probe error: #{diagErr.message}"
                      else if diagSample and diagSample.length > 0
                        logger.debug "#{prefix} rule \"#{ruleName}\" DIAG build-only probe hit — uid=#{diagSample[0].uid} build=#{diagSample[0].build} (UID mismatch likely)"
                      else
                        logger.debug "#{prefix} rule \"#{ruleName}\" DIAG build-only probe=0 rows (build ID mismatch or empty builds)"
                    # Check how many of the previous builds actually contain any candidateUid
                    Test.aggregate([
                      { $match: { uid: { $in: candidateUids } } },
                      { $group: { _id: '$build' } },
                      { $sort: { _id: -1 } },
                      { $limit: 5 },
                      { $project: { _id: 1 } }
                    ]).exec (uid2Err, uidBuilds) ->
                      unless uid2Err
                        qualifyingSet = new Set(qualifyingBuildIds.map (id) -> id.toString())
                        uidBuildStrs = (uidBuilds or []).map (r) -> r._id.toString()
                        overlap = uidBuildStrs.filter (id) -> qualifyingSet.has(id)
                        logger.debug "#{prefix} rule \"#{ruleName}\" DIAG candidateUids appear in #{uidBuildStrs.length} most-recent builds; overlap with qualifying window=#{overlap.length}; recentBuildIds=[#{uidBuildStrs.join(', ')}]"

                  # Group by uid
                  uidResultMap = {}
                  testResults.forEach (r) ->
                    uid = r.uid
                    uidResultMap[uid] = [] unless uidResultMap[uid]
                    uidResultMap[uid].push { build: r.build.toString(), failed: r.failed }

                  conditions = normalizeConditions(threshold)
                  uidBestMap = {}
                  conditions.forEach (cond) ->
                    hits = evaluateThreshold(cond, testResults, qualifyingBuildIds, (msg) -> logger.debug "#{prefix} rule \"#{ruleName}\" #{msg}")
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
              unless activeQuarantined.length and enabledRules.length
                logger.debug "#{prefix} auto-resolve skipped — activeQuarantined=#{activeQuarantined.length}"
                return

              activeUids = activeQuarantined.map (q) -> q.uid
              logger.info "#{prefix} auto-resolve checking #{activeUids.length} active quarantined UID(s)"

              # Auto-resolve window uses global settings
              arQualifyingBuildIds = prevBuilds.filter (b) ->
                return false unless b.status?.total and b.status.total > 0
                pr = if b.status.pass then (b.status.pass / b.status.total * 100) else 0
                pr >= globalMinPassRate
              .slice(0, globalBuilds).map (b) -> b._id

              unless arQualifyingBuildIds.length
                logger.debug "#{prefix} auto-resolve skipped — no qualifying builds"
                return

              # Prepend current build so resolve_passes=N means exactly N consecutive passes
              if currentPassRate >= globalMinPassRate
                arQualifyingBuildIds = [build._id].concat(arQualifyingBuildIds)

              logger.debug "#{prefix} auto-resolve window=#{arQualifyingBuildIds.length} builds"

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

                  logger.debug "#{prefix} auto-resolve uid=#{q.uid} hasConsecutivePasses(#{requiredPasses})=#{shouldResolve}"

                  if shouldResolve
                    QuarantinedTest.findOneAndUpdate(
                      { _id: q._id },
                      { is_active: false, resolved_at: new Date() },
                      { new: true },
                      (rErr, doc) ->
                        if doc
                          logger.info "[quarantine] auto-resolved uid=#{q.uid}"
                    )

module.exports = { evaluateQuarantineRules, matchesScope, evaluateThreshold, hasConsecutivePasses, filterByNamePattern, toScope }
