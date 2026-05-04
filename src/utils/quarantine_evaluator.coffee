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
# results: [{ uid, build, failed }]  (failed = 0 or 1)
# qualifyingBuildIds: ordered array (most-recent-first) of build id strings
# mode: 'total' | 'consecutive'
# requiredFailures: number
# Returns array of { uid, failCount, buildCount }
evaluateThreshold = (mode, results, qualifyingBuildIds, requiredFailures) ->
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
      if failCount >= requiredFailures
        toQuarantine.push { uid: uid, failCount: failCount, buildCount: uidResults.length }
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
      if streak >= requiredFailures
        toQuarantine.push { uid: uid, failCount: streak, buildCount: streak }

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
  return if build.is_archive
  Setting.findOne({ product: build.product, type: build.type }).exec (err, setting) ->
    return unless setting?.quarantine_rules?.rules?.length
    enabledRules = setting.quarantine_rules.rules.filter (r) -> r.enabled
    return unless enabledRules.length

    globalBuilds = setting.quarantine_rules.builds or 10
    globalMinPassRate = Math.max(setting.quarantine_rules.min_pass_rate or 70, 50)

    # Get failed UIDs from the current build (last status per uid)
    Test.aggregate([
      { $match: { build: { $in: [ObjectId(build._id.toString())] } } },
      { $sort: { start_time: 1, _id: 1 } },
      { $group: { _id: '$uid', status: { $last: '$status' } } },
      { $match: { status: { $in: ['FAIL', 'SKIP'] } } }
    ]).exec (tErr, failedItems) ->
      return if tErr
      failedUids = (failedItems or []).map (item) -> item._id
      return unless failedUids.length

      # Current build pass rate (used for per-rule guard)
      total = build.status?.total or 0
      passCount = build.status?.pass or 0
      currentPassRate = if total > 0 then (passCount / total * 100) else 0

      maxWindow = globalBuilds

      # Fetch previous qualifying builds once, shared across all rules
      # Over-fetch to keep window full after min_pass_rate filtering
      fetchLimit = Math.min(maxWindow * 2, 100)
      Build.find({
        product: build.product,
        type: build.type,
        _id: { $ne: build._id },
        start_time: { $lte: build.start_time or new Date() },
        is_archive: { $ne: true }
      })
      .sort({ start_time: -1 })
      .limit(fetchLimit)
      .select('_id status')
      .exec (bErr, prevBuilds) ->
        return if bErr
        prevBuilds = prevBuilds or []

        # Fetch TestRelation cache once for relation-condition filtering
        TestRelation.find({ product: build.product, type: build.type }).exec (rErr, allRelations) ->
          allRelations = allRelations or []

          # Fetch currently active quarantined UIDs for auto-resolve
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
                threshold = rule.threshold or {}

                # Guard: skip if current build pass rate is below global min_pass_rate
                return if currentPassRate < globalMinPassRate

                # Scope match (same logic as notification rules)
                return unless matchesScope(rule, build)

                # Filter qualifying previous builds using global settings
                qualifyingBuilds = prevBuilds.filter (b) ->
                  return false unless b.status?.total and b.status.total > 0
                  pr = if b.status.pass then (b.status.pass / b.status.total * 100) else 0
                  pr >= globalMinPassRate

                qualifyingBuildIds = qualifyingBuilds.slice(0, globalBuilds).map (b) -> b._id

                # Filter failedUids by name_pattern (regex on uid)
                namePattern = rule.filter?.name_pattern
                candidateUids = failedUids.slice()
                if namePattern
                  try
                    candidateUids = filterByNamePattern(candidateUids, namePattern)
                  catch e
                    console.error '[quarantine] invalid name_pattern regex:', namePattern, e
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
                  return if aggErr

                  # Group by uid
                  uidResultMap = {}
                  testResults.forEach (r) ->
                    uid = r.uid
                    uidResultMap[uid] = [] unless uidResultMap[uid]
                    uidResultMap[uid].push { build: r.build.toString(), failed: r.failed }

                  conditions = normalizeConditions(threshold)
                  uidBestMap = {}
                  conditions.forEach (cond) ->
                    hits = evaluateThreshold(cond.mode or 'total', testResults, qualifyingBuildIds, cond.failures or 3)
                    hits.forEach (item) ->
                      existing = uidBestMap[item.uid]
                      if !existing or item.failCount > existing.failCount
                        uidBestMap[item.uid] = item
                  toQuarantine = Object.keys(uidBestMap).map (uid) -> uidBestMap[uid]
                  toQuarantine = toQuarantine.filter (item) -> !exemptUidSet[item.uid]

                  toQuarantine.forEach (item) ->
                    QuarantinedTest.findOneAndUpdate(
                      { uid: item.uid, product: build.product, type: build.type },
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
                          is_active: true
                        },
                        $unset: { resolved_at: '' }
                      },
                      { upsert: true, new: true, runValidators: false },
                      (uErr, doc) ->
                        if uErr
                          console.error '[quarantine] upsert error uid=' + item.uid, uErr
                        else if doc
                          console.log '[quarantine] quarantined uid=' + item.uid + ' by rule "' + rule.name + '"'
                    )

              # --- Auto-resolve: re-check active quarantined UIDs ---
              return unless activeQuarantined.length and enabledRules.length

              activeUids = activeQuarantined.map (q) -> q.uid

              # Auto-resolve window uses global settings
              arQualifyingBuildIds = prevBuilds.filter (b) ->
                return false unless b.status?.total and b.status.total > 0
                pr = if b.status.pass then (b.status.pass / b.status.total * 100) else 0
                pr >= globalMinPassRate
              .slice(0, globalBuilds).map (b) -> b._id

              return unless arQualifyingBuildIds.length

              # Prepend current build so resolve_passes=N means exactly N consecutive passes
              if currentPassRate >= globalMinPassRate
                arQualifyingBuildIds = [build._id].concat(arQualifyingBuildIds)

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
                return if arErr

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

                  if shouldResolve
                    QuarantinedTest.findOneAndUpdate(
                      { _id: q._id },
                      { is_active: false, resolved_at: new Date() },
                      { new: true },
                      (rErr, doc) ->
                        if doc
                          console.log '[quarantine] auto-resolved uid=' + q.uid
                    )

module.exports = { evaluateQuarantineRules, matchesScope, evaluateThreshold, hasConsecutivePasses, filterByNamePattern }
