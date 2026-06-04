process.env.NODE_ENV = 'test'

mongoose  = require('mongoose')
chai      = require('chai')
should    = chai.should()
ObjectId  = mongoose.Types.ObjectId

Build          = require('../../src/models/build')
Test           = require('../../src/models/test')
Setting        = require('../../src/models/setting')
QuarantinedTest = require('../../src/models/quarantined_test')
evaluator      = require('../../src/utils/quarantine_evaluator')

PRODUCT = 'q-test-product'
TYPE    = 'q-test-type'

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Build a batch of Test docs for a single UID across a set of buildIds.
# failIdxSet: Set or object where failIdxSet[i] = true means build at index i failed.
mkTestDocs = (uid, buildIdList, failIdxSet) ->
  buildIdList.map (bid, i) ->
    status = if failIdxSet[i] then 'FAIL' else 'PASS'
    { uid: uid, build: bid, name: uid, status: status, start_time: new Date() }

# Create a Setting with a single enabled quarantine rule.
# ruleOptions: { mode, failures, fail_rate, resolve_passes, min_builds }
createSetting = (ruleOptions, done) ->
  conditions = []
  if ruleOptions.mode
    cond = { mode: ruleOptions.mode }
    cond.failures = ruleOptions.failures if ruleOptions.failures?
    cond.fail_rate = ruleOptions.fail_rate if ruleOptions.fail_rate?
    conditions.push cond
  if ruleOptions.extraConditions
    conditions = conditions.concat ruleOptions.extraConditions

  quarantineRulesDoc = {
    builds: ruleOptions.builds or 20,
    min_builds: ruleOptions.min_builds or 0,
    min_pass_rate: 70,
    rules: [{
      _id: ruleOptions.rule_id or 'rule-1',
      name: ruleOptions.rule_name or 'Test Rule',
      enabled: true,
      scope: ruleOptions.scope or {},
      threshold: {
        conditions: conditions,
        resolve_passes: ruleOptions.resolve_passes or 3
      }
    }]
  }
  if ruleOptions.max_window_days?
    quarantineRulesDoc.max_window_days = ruleOptions.max_window_days

  Setting.findOneAndUpdate(
    { product: PRODUCT, type: ruleOptions.type or TYPE },
    {
      $set: {
        product: PRODUCT,
        type: ruleOptions.type or TYPE,
        quarantine_rules: quarantineRulesDoc
      }
    },
    { upsert: true, new: true, runValidators: false },
    done
  )

cleanUp = (type, done) ->
  t = type or TYPE
  Promise.all([
    QuarantinedTest.deleteMany({ product: PRODUCT, type: t }).exec()
    Setting.deleteMany({ product: PRODUCT, type: t }).exec()
  ]).then(-> done()).catch(done)

# ---------------------------------------------------------------------------
# Shared seed: 20 previous builds + 1 current build + test results
#
# Failure patterns (index 0 = most-recent previous build = b1):
#   uid-total      : fails at b1,b2,b3,b5,b8  (indices 0,1,2,4,7)  → 5/20
#   uid-consecutive: fails at b1,b2,b3,b4      (indices 0,1,2,3)   → streak=4
#   uid-ratio      : fails at b1..b8           (indices 0-7)        → 8/20=40%
#   uid-none       : fails at b5               (index 4)            → 1/20=5%
#   uid-exempt     : fails at b1..b5           (indices 0-4)        → 5 fails
# ---------------------------------------------------------------------------
describe 'evaluateQuarantineRules — integration', ->

  b0Id   = new ObjectId()   # current build (_id)
  prevIds = [0...20].map -> new ObjectId()  # b1..b20, index 0 = most recent

  currentBuild = null

  totalFailSet      = { 0:1, 1:1, 2:1, 4:1, 7:1 }
  consecutiveFailSet = { 0:1, 1:1, 2:1, 3:1 }
  ratioFailSet       = { 0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1 }
  noneFailSet        = { 4:1 }
  exemptFailSet      = { 0:1, 1:1, 2:1, 3:1, 4:1 }

  before (done) ->
    @timeout(15000)
    now = new Date()

    # Build documents: current + 20 previous
    buildDocs = [{
      _id: b0Id, product: PRODUCT, type: TYPE, build: 100,
      start_time: new Date(now.getTime() + 60000),  # current is newest
      status: { total: 10, pass: 8, fail: 2, skip: 0 }
    }].concat(
      prevIds.map (id, i) -> {
        _id: id, product: PRODUCT, type: TYPE, build: 99 - i,
        start_time: new Date(now.getTime() - (i + 1) * 3600000),
        status: { total: 10, pass: 8, fail: 2, skip: 0 }
      }
    )

    # Test docs in current build (all 5 UIDs fail — puts them all in candidateUids)
    currentTestDocs = ['uid-total','uid-consecutive','uid-ratio','uid-none','uid-exempt'].map (uid) ->
      { uid: uid, build: b0Id, name: uid, status: 'FAIL', start_time: new Date() }

    # Test docs in previous 20 builds
    prevTestDocs = []
      .concat(mkTestDocs('uid-total',       prevIds, totalFailSet))
      .concat(mkTestDocs('uid-consecutive', prevIds, consecutiveFailSet))
      .concat(mkTestDocs('uid-ratio',       prevIds, ratioFailSet))
      .concat(mkTestDocs('uid-none',        prevIds, noneFailSet))
      .concat(mkTestDocs('uid-exempt',      prevIds, exemptFailSet))

    Build.create(buildDocs, (err, docs) ->
      return done(err) if err
      currentBuild = docs[0]
      Test.create(currentTestDocs.concat(prevTestDocs), (tErr) ->
        return done(tErr) if tErr
        done()
      )
    )
    return

  after (done) ->
    @timeout(10000)
    Promise.all([
      Build.deleteMany({ product: PRODUCT, type: TYPE }).exec()
      Test.deleteMany({ build: { $in: [b0Id].concat(prevIds) } }).exec()
      QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE }).exec()
      Setting.deleteMany({ product: PRODUCT, type: TYPE }).exec()
    ]).then(-> done()).catch(done)
    return

  # -------------------------------------------------------------------------
  # Scenario 1 — total mode
  # -------------------------------------------------------------------------
  describe 'Scenario 1 — total mode', ->

    before (done) ->
      createSetting({ mode: 'total', failures: 3 }, done)
      return

    after (done) ->
      Setting.deleteMany({ product: PRODUCT, type: TYPE }).exec -> done()
      return

    it 'quarantines uid-total (5 prev failures, triggered_mode=total)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-total', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.triggered_mode.should.equal 'total'
          doc.fail_snapshot.should.equal 5
          doc.build_snapshot.should.equal 20
          doc.is_active.should.equal true
          done()
      , 1500
      return

    it 'does not quarantine uid-none (1 prev failure, below total threshold)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-none', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          should.not.exist doc
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 2 — consecutive mode
  # -------------------------------------------------------------------------
  describe 'Scenario 2 — consecutive mode', ->

    before (done) ->
      createSetting({ mode: 'consecutive', failures: 3 }, done)
      return

    after (done) ->
      Setting.deleteMany({ product: PRODUCT, type: TYPE }).exec -> done()
      return

    it 'quarantines uid-consecutive (streak of 4, triggered_mode=consecutive)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-consecutive', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.triggered_mode.should.equal 'consecutive'
          doc.is_active.should.equal true
          done()
      , 1500
      return

    it 'does not quarantine uid-none (no consecutive streak from b1)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-none', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          should.not.exist doc
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 3 — ratio mode (BR5)
  # -------------------------------------------------------------------------
  describe 'Scenario 3 — ratio mode (BR5)', ->

    before (done) ->
      createSetting({ mode: 'ratio', fail_rate: 30 }, done)
      return

    after (done) ->
      Setting.deleteMany({ product: PRODUCT, type: TYPE }).exec -> done()
      return

    it 'quarantines uid-ratio (8/20=40%, above 30% threshold, triggered_mode=ratio)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-ratio', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.triggered_mode.should.equal 'ratio'
          doc.is_active.should.equal true
          done()
      , 1500
      return

    it 'does not quarantine uid-none (1/20=5%, below 30% threshold)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-none', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          should.not.exist doc
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 4 — OR-logic (multi-condition: total:3 + ratio:30)
  # -------------------------------------------------------------------------
  describe 'Scenario 4 — OR-logic (total:3 + ratio:30)', ->

    before (done) ->
      createSetting({
        extraConditions: [
          { mode: 'total', failures: 3 },
          { mode: 'ratio', fail_rate: 30 }
        ]
      }, done)
      return

    after (done) ->
      Setting.deleteMany({ product: PRODUCT, type: TYPE }).exec -> done()
      return

    it 'quarantines uid-total (5 failures meets total:3)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-total', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.is_active.should.equal true
          done()
      , 1500
      return

    it 'quarantines uid-ratio (8/20=40% meets ratio:30)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-ratio', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.is_active.should.equal true
          done()
      , 1500
      return

    it 'does not quarantine uid-none (neither total nor ratio threshold met)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-none', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          should.not.exist doc
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 5 — BR7 min_builds guard (separate type with few builds)
  # -------------------------------------------------------------------------
  describe 'Scenario 5 — BR7 min_builds guard', ->

    TYPE_BR7   = 'q-test-type-br7'
    br7BuildIds = [0...5].map -> new ObjectId()
    br7CurrentId = new ObjectId()
    br7Current  = null

    before (done) ->
      @timeout(10000)
      now = new Date()

      buildDocs = [{
        _id: br7CurrentId, product: PRODUCT, type: TYPE_BR7, build: 200,
        start_time: new Date(now.getTime() + 60000),
        status: { total: 10, pass: 8, fail: 2, skip: 0 }
      }].concat(
        br7BuildIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_BR7, build: 199 - i,
          start_time: new Date(now.getTime() - (i + 1) * 3600000),
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      )

      currentTests = ['uid-total', 'uid-ratio'].map (uid) ->
        { uid: uid, build: br7CurrentId, name: uid, status: 'FAIL', start_time: new Date() }

      prevTests = br7BuildIds.map (bid, i) ->
        { uid: 'uid-total', build: bid, name: 'uid-total', status: 'FAIL', start_time: new Date() }

      Build.create(buildDocs, (err, docs) ->
        return done(err) if err
        br7Current = docs[0]
        Test.create(currentTests.concat(prevTests), (tErr) ->
          return done(tErr) if tErr
          createSetting({ type: TYPE_BR7, mode: 'total', failures: 3, min_builds: 10 }, done)
        )
      )
      return

    after (done) ->
      @timeout(10000)
      Promise.all([
        Build.deleteMany({ product: PRODUCT, type: TYPE_BR7 }).exec()
        Test.deleteMany({ build: { $in: [br7CurrentId].concat(br7BuildIds) } }).exec()
        QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE_BR7 }).exec()
        Setting.deleteMany({ product: PRODUCT, type: TYPE_BR7 }).exec()
      ]).then(-> done()).catch(done)
      return

    it 'creates no QuarantinedTest records when qualifying builds (5) < min_builds (10)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(br7Current)
      setTimeout ->
        QuarantinedTest.find({ product: PRODUCT, type: TYPE_BR7 }).exec (err, docs) ->
          return done(err) if err
          docs.length.should.equal 0
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 6 — exempt test is not quarantined
  # -------------------------------------------------------------------------
  describe 'Scenario 6 — exempt test is skipped', ->

    before (done) ->
      QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE }).exec (dErr) ->
        return done(dErr) if dErr
        createSetting({ mode: 'total', failures: 3 }, (err) ->
          return done(err) if err
          # Pre-seed exempt record for uid-exempt
          QuarantinedTest.create({
            uid: 'uid-exempt', product: PRODUCT, type: TYPE,
            is_active: false, is_exempt: true
          }, done)
        )
      return

    after (done) ->
      Setting.deleteMany({ product: PRODUCT, type: TYPE }).exec -> done()
      return

    it 'does not overwrite or activate the exempt QuarantinedTest record', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(currentBuild)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-exempt', product: PRODUCT, type: TYPE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.is_exempt.should.equal true
          # is_active should remain false — evaluator skips exempt UIDs
          doc.is_active.should.equal false
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 7 — auto-resolve (separate type with pass streak)
  # -------------------------------------------------------------------------
  describe 'Scenario 7 — auto-resolve', ->

    TYPE_RESOLVE  = 'q-test-type-resolve'
    resCurrentId  = new ObjectId()
    resPrevIds    = [0...10].map -> new ObjectId()
    resCurrent    = null

    # uid-resolve passes in b0 (current), b1, b2 → 3 consecutive passes
    # uid-resolve fails in b3..b9 (was quarantined before)
    # uid-dummy fails in b0 to ensure failedUids is non-empty (otherwise evaluator returns early)

    before (done) ->
      @timeout(10000)
      now = new Date()

      buildDocs = [{
        _id: resCurrentId, product: PRODUCT, type: TYPE_RESOLVE, build: 300,
        start_time: new Date(now.getTime() + 60000),
        status: { total: 10, pass: 9, fail: 1, skip: 0 }
      }].concat(
        resPrevIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_RESOLVE, build: 299 - i,
          start_time: new Date(now.getTime() - (i + 1) * 3600000),
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      )

      # uid-dummy fails in current build only (ensures failedUids non-empty)
      currentTests = [
        { uid: 'uid-dummy', build: resCurrentId, name: 'uid-dummy', status: 'FAIL', start_time: new Date() }
        { uid: 'uid-resolve', build: resCurrentId, name: 'uid-resolve', status: 'PASS', start_time: new Date() }
      ]

      # uid-resolve in prev builds: PASS at index 0,1 (b1,b2); FAIL at index 2+ (b3..b10)
      prevTests = resPrevIds.map (bid, i) ->
        status = if i < 2 then 'PASS' else 'FAIL'
        { uid: 'uid-resolve', build: bid, name: 'uid-resolve', status: status, start_time: new Date() }

      # Pre-seed active QuarantinedTest for uid-resolve
      qtDoc = {
        uid: 'uid-resolve', product: PRODUCT, type: TYPE_RESOLVE,
        rule_id: 'rule-resolve', rule_name: 'Resolve Rule',
        is_active: true, quarantined_at: new Date(now.getTime() - 86400000)
      }

      Build.create(buildDocs, (err, docs) ->
        return done(err) if err
        resCurrent = docs[0]
        Test.create(currentTests.concat(prevTests), (tErr) ->
          return done(tErr) if tErr
          QuarantinedTest.create(qtDoc, (qErr) ->
            return done(qErr) if qErr
            createSetting({
              type: TYPE_RESOLVE,
              mode: 'total', failures: 3, resolve_passes: 3,
              rule_id: 'rule-resolve', rule_name: 'Resolve Rule'
            }, done)
          )
        )
      )
      return

    after (done) ->
      @timeout(10000)
      Promise.all([
        Build.deleteMany({ product: PRODUCT, type: TYPE_RESOLVE }).exec()
        Test.deleteMany({ build: { $in: [resCurrentId].concat(resPrevIds) } }).exec()
        QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE_RESOLVE }).exec()
        Setting.deleteMany({ product: PRODUCT, type: TYPE_RESOLVE }).exec()
      ]).then(-> done()).catch(done)
      return

    it 'sets is_active=false and resolved_at when uid has 3 consecutive passes', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(resCurrent)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-resolve', product: PRODUCT, type: TYPE_RESOLVE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.is_active.should.equal false
          should.exist doc.resolved_at
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 8 — scoped quarantine (stage-scoped rule)
  # -------------------------------------------------------------------------
  describe 'Scenario 8 — scoped quarantine (stage filter)', ->

    TYPE_SCOPED      = 'q-test-type-scoped'
    scopedCurrentId  = new ObjectId()
    scopedPrevIds    = [0...5].map -> new ObjectId()
    scopedCurrent    = null

    before (done) ->
      @timeout(10000)
      now = new Date()

      buildDocs = [{
        _id: scopedCurrentId, product: PRODUCT, type: TYPE_SCOPED, build: 400,
        start_time: new Date(now.getTime() + 60000),
        stage: 'regression',
        status: { total: 10, pass: 8, fail: 2, skip: 0 }
      }].concat(
        scopedPrevIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_SCOPED, build: 399 - i,
          start_time: new Date(now.getTime() - (i + 1) * 3600000),
          stage: 'regression',
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      )

      currentTests = [
        { uid: 'uid-scoped', build: scopedCurrentId, name: 'uid-scoped', status: 'FAIL', start_time: new Date() }
      ]

      # uid-scoped fails in all 5 prev builds
      prevTests = scopedPrevIds.map (bid) ->
        { uid: 'uid-scoped', build: bid, name: 'uid-scoped', status: 'FAIL', start_time: new Date() }

      Build.create(buildDocs, (err, docs) ->
        return done(err) if err
        scopedCurrent = docs[0]
        Test.create(currentTests.concat(prevTests), (tErr) ->
          return done(tErr) if tErr
          createSetting({
            type: TYPE_SCOPED,
            mode: 'total', failures: 3,
            scope: { stage: 'regression' }
          }, done)
        )
      )
      return

    after (done) ->
      @timeout(10000)
      Promise.all([
        Build.deleteMany({ product: PRODUCT, type: TYPE_SCOPED }).exec()
        Test.deleteMany({ build: { $in: [scopedCurrentId].concat(scopedPrevIds) } }).exec()
        QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE_SCOPED }).exec()
        Setting.deleteMany({ product: PRODUCT, type: TYPE_SCOPED }).exec()
      ]).then(-> done()).catch(done)
      return

    it 'quarantines uid-scoped with scope.stage=regression when build matches', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(scopedCurrent)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-scoped', product: PRODUCT, type: TYPE_SCOPED }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.is_active.should.equal true
          doc.scope.stage.should.equal 'regression'
          doc.scope.version.should.equal ''
          done()
      , 1500
      return

    it 'does not match when querying with smoke scope', (done) ->
      @timeout(3000)
      QuarantinedTest.findOne({
        uid: 'uid-scoped', product: PRODUCT, type: TYPE_SCOPED,
        scope: { version: '', team: '', browser: '', device: '', platform: '', platform_version: '', stage: 'smoke' }
      }).exec (err, doc) ->
        return done(err) if err
        should.not.exist doc
        done()
      return

    it 'does not create a record when build stage=smoke (scope mismatch)', (done) ->
      @timeout(5000)
      smokeBuildId = new ObjectId()
      smokeNow = new Date()

      smokeBuildDoc = {
        _id: smokeBuildId, product: PRODUCT, type: TYPE_SCOPED, build: 500,
        start_time: new Date(smokeNow.getTime() + 120000),
        stage: 'smoke',
        status: { total: 10, pass: 8, fail: 2, skip: 0 }
      }
      smokeTests = [
        { uid: 'uid-scoped', build: smokeBuildId, name: 'uid-scoped', status: 'FAIL', start_time: new Date() }
      ]

      Build.create(smokeBuildDoc, (err, smokeDoc) ->
        return done(err) if err
        Test.create(smokeTests, (tErr) ->
          return done(tErr) if tErr
          evaluator.evaluateQuarantineRules(smokeDoc)
          setTimeout ->
            # No QuarantinedTest with scope.stage='smoke' should exist
            QuarantinedTest.findOne({
              uid: 'uid-scoped', product: PRODUCT, type: TYPE_SCOPED,
              scope: { version: '', team: '', browser: '', device: '', platform: '', platform_version: '', stage: 'smoke' }
            }).exec (qErr, doc) ->
              return done(qErr) if qErr
              should.not.exist doc
              Build.deleteMany({ _id: smokeBuildId }).exec()
              Test.deleteMany({ build: smokeBuildId }).exec()
              done()
          , 1500
        )
      )
      return

  # -------------------------------------------------------------------------
  # Scenario 9 — max_window_days time decay
  # -------------------------------------------------------------------------
  describe 'Scenario 9 — max_window_days time decay', ->

    TYPE_DECAY     = 'q-test-type-decay'
    decayCurrentId = new ObjectId()
    recentIds      = [0...3].map -> new ObjectId()   # 3 recent builds (within window)
    oldIds         = [0...5].map -> new ObjectId()   # 5 old builds (> 90 days ago)
    decayCurrent   = null

    before (done) ->
      @timeout(10000)
      now = new Date()

      # Current build
      # Recent builds: 1-3 days ago (within 90 day window)
      # Old builds: 100+ days ago (outside 90 day window)
      buildDocs = [{
        _id: decayCurrentId, product: PRODUCT, type: TYPE_DECAY, build: 600,
        start_time: new Date(now.getTime() + 60000),
        status: { total: 10, pass: 8, fail: 2, skip: 0 }
      }].concat(
        recentIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_DECAY, build: 599 - i,
          start_time: new Date(now.getTime() - (i + 1) * 86400000),  # 1-3 days ago
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      ).concat(
        oldIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_DECAY, build: 594 - i,
          start_time: new Date(now.getTime() - (100 + i) * 86400000),  # 100-104 days ago
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      )

      # uid-decay fails in current build (puts it in candidateUids)
      # uid-decay passes in all 3 recent builds
      # uid-decay fails in all 5 old builds (but these are excluded by max_window_days=90)
      currentTests = [
        { uid: 'uid-decay', build: decayCurrentId, name: 'uid-decay', status: 'FAIL', start_time: new Date() }
      ]

      recentTests = recentIds.map (bid) ->
        { uid: 'uid-decay', build: bid, name: 'uid-decay', status: 'PASS', start_time: new Date() }

      oldTests = oldIds.map (bid) ->
        { uid: 'uid-decay', build: bid, name: 'uid-decay', status: 'FAIL', start_time: new Date() }

      Build.create(buildDocs, (err, docs) ->
        return done(err) if err
        decayCurrent = docs[0]
        Test.create(currentTests.concat(recentTests).concat(oldTests), (tErr) ->
          return done(tErr) if tErr
          createSetting({
            type: TYPE_DECAY,
            mode: 'total', failures: 3,
            max_window_days: 90
          }, done)
        )
      )
      return

    after (done) ->
      @timeout(10000)
      Promise.all([
        Build.deleteMany({ product: PRODUCT, type: TYPE_DECAY }).exec()
        Test.deleteMany({ build: { $in: [decayCurrentId].concat(recentIds).concat(oldIds) } }).exec()
        QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE_DECAY }).exec()
        Setting.deleteMany({ product: PRODUCT, type: TYPE_DECAY }).exec()
      ]).then(-> done()).catch(done)
      return

    it 'does not quarantine uid-decay (old builds excluded, 0 failures in recent window < 3 threshold)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(decayCurrent)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-decay', product: PRODUCT, type: TYPE_DECAY }).exec (err, doc) ->
          return done(err) if err
          should.not.exist doc
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 10 — cross-team build isolation
  # -------------------------------------------------------------------------
  describe 'Scenario 10 — cross-team build isolation', ->

    TYPE_ISOLATION = 'q-test-type-isolation'
    isoCurrentId   = new ObjectId()
    teamBIds       = [0...7].map -> new ObjectId()   # 7 TeamB builds (most recent, t-1h to t-7h)
    teamAIds       = [0...3].map -> new ObjectId()   # 3 TeamA builds (older, t-8h to t-10h)
    isoCurrent     = null

    before (done) ->
      @timeout(10000)
      now = new Date()

      buildDocs = [{
        _id: isoCurrentId, product: PRODUCT, type: TYPE_ISOLATION, build: 700,
        team: 'TeamA',
        start_time: new Date(now.getTime() + 60000),
        status: { total: 10, pass: 8, fail: 2, skip: 0 }
      }].concat(
        teamBIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_ISOLATION, build: 699 - i,
          team: 'TeamB',
          start_time: new Date(now.getTime() - (i + 1) * 3600000),
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      ).concat(
        teamAIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_ISOLATION, build: 692 - i,
          team: 'TeamA',
          start_time: new Date(now.getTime() - (8 + i) * 3600000),
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      )

      # uid-team-a fails in current build and all 3 TeamA prev builds
      # No uid-team-a tests in TeamB builds (different team, different test suite)
      currentTests = [
        { uid: 'uid-team-a', build: isoCurrentId, name: 'uid-team-a', status: 'FAIL', start_time: new Date() }
      ]

      teamATests = teamAIds.map (bid) ->
        { uid: 'uid-team-a', build: bid, name: 'uid-team-a', status: 'FAIL', start_time: new Date() }

      Build.create(buildDocs, (err, docs) ->
        return done(err) if err
        isoCurrent = docs[0]
        Test.create(currentTests.concat(teamATests), (tErr) ->
          return done(tErr) if tErr
          createSetting({
            type: TYPE_ISOLATION,
            mode: 'consecutive', failures: 3,
            builds: 20
          }, done)
        )
      )
      return

    after (done) ->
      @timeout(10000)
      Promise.all([
        Build.deleteMany({ product: PRODUCT, type: TYPE_ISOLATION }).exec()
        Test.deleteMany({ build: { $in: [isoCurrentId].concat(teamBIds).concat(teamAIds) } }).exec()
        QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE_ISOLATION }).exec()
        Setting.deleteMany({ product: PRODUCT, type: TYPE_ISOLATION }).exec()
      ]).then(-> done()).catch(done)
      return

    it 'quarantines uid-team-a (scope-filtered window = TeamA only → 3+1 consecutive ≥ 3)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(isoCurrent)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-team-a', product: PRODUCT, type: TYPE_ISOLATION }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.is_active.should.equal true
          doc.triggered_mode.should.equal 'consecutive'
          done()
      , 1500
      return

  # -------------------------------------------------------------------------
  # Scenario 11 — general rule stores build scope on QuarantinedTest
  # -------------------------------------------------------------------------
  describe 'Scenario 11 — general rule stores build scope on QuarantinedTest', ->

    TYPE_TEAMSCOPE = 'q-test-type-teamscope'
    tsCurrentId    = new ObjectId()
    tsPrevIds      = [0...3].map -> new ObjectId()
    tsCurrent      = null

    before (done) ->
      @timeout(10000)
      now = new Date()

      buildDocs = [{
        _id: tsCurrentId, product: PRODUCT, type: TYPE_TEAMSCOPE, build: 800,
        team: 'TeamB',
        start_time: new Date(now.getTime() + 60000),
        status: { total: 10, pass: 8, fail: 2, skip: 0 }
      }].concat(
        tsPrevIds.map (id, i) -> {
          _id: id, product: PRODUCT, type: TYPE_TEAMSCOPE, build: 799 - i,
          team: 'TeamB',
          start_time: new Date(now.getTime() - (i + 1) * 3600000),
          status: { total: 10, pass: 8, fail: 2, skip: 0 }
        }
      )

      currentTests = [
        { uid: 'uid-team-b', build: tsCurrentId, name: 'uid-team-b', status: 'FAIL', start_time: new Date() }
      ]

      prevTests = tsPrevIds.map (bid) ->
        { uid: 'uid-team-b', build: bid, name: 'uid-team-b', status: 'FAIL', start_time: new Date() }

      Build.create(buildDocs, (err, docs) ->
        return done(err) if err
        tsCurrent = docs[0]
        Test.create(currentTests.concat(prevTests), (tErr) ->
          return done(tErr) if tErr
          createSetting({
            type: TYPE_TEAMSCOPE,
            mode: 'total', failures: 3,
            builds: 10
          }, done)
        )
      )
      return

    after (done) ->
      @timeout(10000)
      Promise.all([
        Build.deleteMany({ product: PRODUCT, type: TYPE_TEAMSCOPE }).exec()
        Test.deleteMany({ build: { $in: [tsCurrentId].concat(tsPrevIds) } }).exec()
        QuarantinedTest.deleteMany({ product: PRODUCT, type: TYPE_TEAMSCOPE }).exec()
        Setting.deleteMany({ product: PRODUCT, type: TYPE_TEAMSCOPE }).exec()
      ]).then(-> done()).catch(done)
      return

    it 'quarantines uid-team-b and stores scope.team=TeamB from build (not empty string)', (done) ->
      @timeout(5000)
      evaluator.evaluateQuarantineRules(tsCurrent)
      setTimeout ->
        QuarantinedTest.findOne({ uid: 'uid-team-b', product: PRODUCT, type: TYPE_TEAMSCOPE }).exec (err, doc) ->
          return done(err) if err
          doc.should.not.be.null
          doc.is_active.should.equal true
          doc.scope.team.should.equal 'TeamB'
          done()
      , 1500
      return
