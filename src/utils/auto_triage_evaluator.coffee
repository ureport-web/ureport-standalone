# auto_triage_evaluator.coffee
# Matches failing tests against existing InvestigatedTest patterns and creates
# new InvestigatedTest docs with is_auto_triaged: true.
#
# Failure info comes directly from the frontend (already loaded) — no Test/Build DB queries needed.
# Frontend groups eligible tests by product/type and calls once per group.
#
# Matching logic mirrors InvestigatedTestAnalyzer on the frontend (exact, no normalization).
# Three maps keyed by exact string, respecting each source's compare_by field:
#   tokenMap   — all sources with a token value
#   messageMap — sources with compare_by = COMPARE_BY_FAILURE_MESSAGE or null/unset
#   stackMap   — sources with compare_by = COMPARE_BY_MIXED or COMPARE_BY_STACK_TRACE (legacy)
# Sources with apply_similarity are skipped (fuzzy matching not replicated here).
#
# TTL sentinels written to configuration.ttl on created docs:
#   -1  → permanent (token match, or promoted later by user)
#   >0  → expires after N days (exact message / stack match; uses ttl_days setting)

InvestigatedTest = require('../models/investigated_test')
Setting = require('../models/setting')
matcher = require('./notification_rule_matcher')
TestRelation = require('../models/test_relation')
logger = require('./logger')

MAX_MAP_SIZE = 300

# Build three lookup maps from source InvestigatedTest docs.
# Sources are already sorted desc by create_at — first seen wins (most recent).
buildMaps = (sources) ->
  tokenMap   = {}
  messageMap = {}
  stackMap   = {}

  for src in sources
    # Skip fuzzy-match sources — cannot replicate safely
    if src.configuration?.similarity and src.configuration.similarity.value isnt 100
      continue

    compareBy = src.configuration?.compare_by
    token     = src.failure?.token
    message   = src.failure?.error_message
    stack     = src.failure?.stack_trace

    # Token map: any source that has a token
    if token and Object.keys(tokenMap).length < MAX_MAP_SIZE
      unless tokenMap[token]
        tokenMap[token] = src

    # Message map: COMPARE_BY_FAILURE_MESSAGE or null/unset
    if compareBy is 'COMPARE_BY_FAILURE_MESSAGE' or not compareBy
      if message and Object.keys(messageMap).length < MAX_MAP_SIZE
        unless messageMap[message]
          messageMap[message] = src

    # Stack map: COMPARE_BY_MIXED or legacy COMPARE_BY_STACK_TRACE
    if compareBy is 'COMPARE_BY_MIXED' or compareBy is 'COMPARE_BY_STACK_TRACE'
      if stack and Object.keys(stackMap).length < MAX_MAP_SIZE
        unless stackMap[stack]
          stackMap[stack] = src

  { tokenMap, messageMap, stackMap }

# Run auto-triage matching for a product/type.
# product, type: identify the Setting and source InvestigatedTests.
# eligibleTests: array of { uid, name, token, errorMessage, stackTrace } from frontend.
# dryRun: if true, return matches without creating docs.
# callback: (err, result) where result = { matches: [...], created: Number }
runAutoTriage = (product, type, eligibleTests, dryRun, promoteUids, callback) ->
  prefix = "[auto-triage] product=#{product} type=#{type}"

  unless eligibleTests and eligibleTests.length
    logger.debug "#{prefix} no eligible tests — all already investigated"
    return callback(null, { matches: [], created: 0 })

  Setting.findOne({ product, type }).exec (sErr, setting) ->
    if sErr
      logger.error "#{prefix} Setting.findOne error", sErr
      return callback(sErr)

    atSettings = setting?.auto_triage_settings
    unless atSettings?.enabled
      return callback({ status: 400, message: 'auto-triage is not enabled for this product/type' })

    ttlDays           = atSettings.ttl_days or 5
    maxSourceAgeDays  = atSettings.max_source_age_days or 90
    scopeFilter       = atSettings.scope_filter

    # Validate ttl_days — disallow 0
    if ttlDays <= 0
      return callback({ status: 400, message: 'auto_triage_settings.ttl_days must be >= 1' })

    sourceFrom = new Date(Date.now() - maxSourceAgeDays * 24 * 60 * 60 * 1000)

    # Load source InvestigatedTests — most recent first; lean() returns plain JS objects
    InvestigatedTest.find({ product, type, create_at: { $gte: sourceFrom } })
    .sort({ create_at: -1 })
    .lean()
    .exec (invErr, sources) ->
      if invErr
        logger.error "#{prefix} InvestigatedTest.find (sources) error", invErr
        return callback(invErr)

      unless sources and sources.length
        logger.debug "#{prefix} no source investigations found"
        return callback(null, {
          matches: []
          created: 0
          _debug: { sourcesLoaded: 0, mapSizes: { token: 0, message: 0, stack: 0 }, eligibleTestsSent: eligibleTests.length }
        })

      logger.info "#{prefix} #{sources.length} source investigations loaded"

      { tokenMap, messageMap, stackMap } = buildMaps(sources)

      logger.debug "#{prefix} maps — token=#{Object.keys(tokenMap).length} message=#{Object.keys(messageMap).length} stack=#{Object.keys(stackMap).length}"

      debugStats = {
        sourcesLoaded: sources.length
        mapSizes: { token: Object.keys(tokenMap).length, message: Object.keys(messageMap).length, stack: Object.keys(stackMap).length }
        eligibleTestsSent: eligibleTests.length
      }

      doMatch = (testsToMatch) ->
        matches = []
        for t in testsToMatch
          tok = t.token
          msg = t.errorMessage
          stk = t.stackTrace
          src = null
          matchType = null

          # Step 1: token match (always permanent)
          if tok and tokenMap[tok]
            src = tokenMap[tok]
            matchType = 'token'
          # Step 2: message match
          else if msg and messageMap[msg]
            src = messageMap[msg]
            matchType = 'exact'
          # Step 3: stack match
          else if stk and stackMap[stk]
            src = stackMap[stk]
            matchType = 'stack'

          continue unless src

          # Skip exempt sources
          continue if src.is_exempt

          matches.push({
            testUid:              t.uid
            testName:             t.name
            sourceUid:            src.uid
            sourceCauseBy:        src.caused_by
            sourceTrackingNumber: (src.tracking and src.tracking['track_number'] and src.tracking['track_number'].toString()) or ''
            matchType:            matchType
            _src:                 src
            _test:                t
          })

        matches

      processResults = (testsToMatch) ->
        allMatches = doMatch(testsToMatch)

        logger.info "#{prefix} #{allMatches.length} match(es) found (dryRun=#{dryRun})"

        if dryRun or allMatches.length == 0
          return callback(null, {
            matches: allMatches.map (m) -> {
              testUid:              m.testUid
              testName:             m.testName
              sourceUid:            m.sourceUid
              sourceCauseBy:        m.sourceCauseBy
              sourceTrackingNumber: m.sourceTrackingNumber
              matchType:            m.matchType
            }
            created: 0
            _debug: debugStats
          })

        # Apply: upsert InvestigatedTest docs
        created = 0
        pending = allMatches.length
        hadError = null

        promoteSet = new Set(promoteUids or [])
        for m in allMatches
          do (m) ->
            src = m._src
            configTtl = if m.matchType is 'token' or promoteSet.has(m.testUid) then -1 else ttlDays
            t = m._test

            doc = {
              uid:                    m.testUid
              product:                product
              type:                   type
              caused_by:              src.caused_by
              tracking:               src.tracking or {}
              failure: {
                token:         t.token
                error_message: t.errorMessage
                stack_trace:   t.stackTrace
              }
              is_auto_triaged:        true
              auto_triage_source_uid: src.uid
              auto_triage_match_type: m.matchType
              configuration: {
                compare_by: src.configuration?.compare_by
                ttl:        configTtl
              }
              create_at: new Date()
            }

            InvestigatedTest.findOneAndUpdate(
              { uid: m.testUid, product, type, is_auto_triaged: true },
              { $set: doc },
              { upsert: true, new: true },
              (uErr, saved) ->
                if uErr
                  logger.error "#{prefix} upsert error uid=#{m.testUid}", uErr
                  hadError = uErr
                else
                  created++
                pending--
                if pending == 0
                  if hadError
                    return callback(hadError)
                  logger.info "#{prefix} created/updated #{created} auto-triage doc(s)"
                  callback(null, {
                    matches: allMatches.map (m) -> {
                      testUid:              m.testUid
                      testName:             m.testName
                      sourceUid:            m.sourceUid
                      sourceCauseBy:        m.sourceCauseBy
                      sourceTrackingNumber: m.sourceTrackingNumber
                      matchType:            m.matchType
                    }
                    created: created
                  })
            )

      # If scope filter configured, load TestRelations and filter tests
      if scopeFilter and scopeFilter.relations and scopeFilter.relations.length > 0
        uids = eligibleTests.map (t) -> t.uid
        TestRelation.find({ uid: { $in: uids } }).exec (trErr, relations) ->
          if trErr
            logger.error "#{prefix} TestRelation.find error", trErr
            return callback(trErr)

          # Group relations by uid
          relByUid = {}
          for tr in (relations or [])
            relByUid[tr.uid] = [] unless relByUid[tr.uid]
            relByUid[tr.uid].push(tr)

          # Filter tests by scope_filter
          rule = { filter: scopeFilter }
          filteredTests = eligibleTests.filter (t) ->
            uidRelations = relByUid[t.uid] or []
            matcher.matchesRule(rule, uidRelations).length > 0

          processResults(filteredTests)
      else
        processResults(eligibleTests)

module.exports = { runAutoTriage, buildMaps }
