process.env.NODE_ENV = 'test'

server           = require('../../app')
mongoose         = require('mongoose')
chai             = require('chai')
chaiHttp         = require('chai-http')
should           = chai.should()
chai.use chaiHttp

InvestigatedTest = require('../../src/models/investigated_test')
Setting          = require('../../src/models/setting')
auth             = require('../api_objects/auth_api_object')
invTest          = require('../api_objects/investigated_test_api_object')

PRODUCT = 'at-int-product'
TYPE    = 'at-int-type'

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

createSetting = (opts, done) ->
  Setting.findOneAndUpdate(
    { product: PRODUCT, type: TYPE },
    { $set: {
        product: PRODUCT
        type:    TYPE
        auto_triage_settings: {
          enabled:             if opts.enabled? then opts.enabled else true
          max_source_age_days: opts.maxSourceAgeDays or 90
          ttl_days:            opts.ttlDays          or 5
        }
      }
    },
    { upsert: true, new: true, runValidators: false },
    done
  )

createSource = (opts, done) ->
  InvestigatedTest.create {
    uid:       opts.uid      or 'source-uid-1'
    product:   PRODUCT
    type:      TYPE
    caused_by: opts.causedBy or 'Defect'
    tracking:  opts.tracking or {}
    configuration: opts.configuration or { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    failure: {
      token:         opts.token   or null
      error_message: opts.message or null
      stack_trace:   opts.stack   or null
    }
    create_at: new Date()
  }, done

cleanUp = (done) ->
  Promise.all([
    Setting.deleteMany({ product: PRODUCT, type: TYPE }).exec()
    InvestigatedTest.deleteMany({ product: PRODUCT, type: TYPE }).exec()
  ]).then(-> done()).catch(done)

# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

describe 'Auto-triage endpoint', ->
  cookies = undefined

  before (done) ->
    auth.login server, { username: 'test@test.com', password: 'password' }, 200, (res) ->
      cookies = res.headers['set-cookie'].pop().split(';')[0]
      done()
    return

  afterEach (done) ->
    cleanUp done
    return

  # ---- Guard: not enabled ----

  describe 'guard — auto-triage not enabled', ->

    it 'returns 400 when auto_triage_settings.enabled = false', (done) ->
      createSetting { enabled: false }, (err) ->
        return done(err) if err
        tests = [{ uid: 'test-a', name: 'Test A', errorMessage: 'Some error' }]
        invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 400, (res) ->
          res.body.error.should.include 'not enabled'
          done()
      return

    it 'returns 400 when no setting exists for product/type', (done) ->
      tests = [{ uid: 'test-a', name: 'Test A', errorMessage: 'Some error' }]
      invTest.autoTriage server, cookies, { product: 'no-such-product', type: 'no-such-type', tests: tests }, true, 400, (res) ->
        res.body.error.should.include 'not enabled'
        done()
      return

    it 'returns 400 when product or type missing from body', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        invTest.autoTriage server, cookies, { tests: [{ uid: 'test-a' }] }, true, 400, (res) ->
          res.body.error.should.be.a 'string'
          done()
      return

  # ---- Empty tests ----

  describe 'empty eligible tests', ->

    it 'returns 200 with empty matches and created=0', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: [] }, true, 200, (res) ->
          res.body.matches.should.be.an('array').with.lengthOf 0
          res.body.created.should.equal 0
          done()
      return

  # ---- dryRun = true: exact message match ----

  describe 'dryRun = true — exact message match', ->

    it 'returns match and creates NO doc in DB', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-msg-1', message: 'Expected 200 but got 404', causedBy: 'Defect', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-1', name: 'New Test', errorMessage: 'Expected 200 but got 404' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 200, (res) ->
            res.body.matches.should.have.lengthOf 1
            m = res.body.matches[0]
            m.testUid.should.equal 'new-test-1'
            m.sourceUid.should.equal 'src-msg-1'
            m.matchType.should.equal 'exact'
            m.sourceCauseBy.should.equal 'Defect'
            res.body.created.should.equal 0
            InvestigatedTest.findOne { uid: 'new-test-1', product: PRODUCT, type: TYPE }, (err, doc) ->
              should.not.exist doc
              done()
          return
        return
      return

  # ---- dryRun = false: exact message match creates doc ----

  describe 'dryRun = false — exact message match', ->

    it 'creates InvestigatedTest doc with is_auto_triaged=true and ttl=ttl_days', (done) ->
      createSetting { ttlDays: 7 }, (err) ->
        return done(err) if err
        createSource { uid: 'src-msg-2', message: 'Connection timeout', causedBy: 'Inter', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-2', name: 'New Test 2', errorMessage: 'Connection timeout' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, false, 200, (res) ->
            res.body.created.should.equal 1
            res.body.matches.should.have.lengthOf 1
            InvestigatedTest.findOne { uid: 'new-test-2', product: PRODUCT, type: TYPE }, (err, doc) ->
              should.exist doc
              doc.is_auto_triaged.should.equal true
              doc.auto_triage_source_uid.should.equal 'src-msg-2'
              doc.auto_triage_match_type.should.equal 'exact'
              doc.caused_by.should.equal 'Inter'
              doc.configuration.ttl.should.equal 7
              done()
          return
        return
      return

    it 'carries source tracking number onto created doc', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-track', message: 'Tracking error', tracking: { track_number: 'JIRA-9876' }, configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-track', name: 'Track Test', errorMessage: 'Tracking error' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, false, 200, (res) ->
            res.body.matches[0].sourceTrackingNumber.should.equal 'JIRA-9876'
            InvestigatedTest.findOne { uid: 'new-test-track', product: PRODUCT, type: TYPE }, (err, doc) ->
              should.exist doc
              doc.tracking.track_number.should.equal 'JIRA-9876'
              done()
          return
        return
      return

  # ---- Token match: always permanent ----

  describe 'dryRun = false — token match', ->

    it 'creates doc with configuration.ttl = -1 regardless of ttl_days setting', (done) ->
      createSetting { ttlDays: 3 }, (err) ->
        return done(err) if err
        createSource { uid: 'src-tok', token: 'tok-abc123', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-tok', name: 'Token Test', token: 'tok-abc123' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, false, 200, (res) ->
            res.body.created.should.equal 1
            res.body.matches[0].matchType.should.equal 'token'
            InvestigatedTest.findOne { uid: 'new-test-tok', product: PRODUCT, type: TYPE }, (err, doc) ->
              should.exist doc
              doc.configuration.ttl.should.equal -1
              doc.auto_triage_match_type.should.equal 'token'
              done()
          return
        return
      return

    it 'token match wins over message match when test has both', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-tok-msg', token: 'tok-wins', message: 'Some error', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-tok-msg', name: 'Token Priority', token: 'tok-wins', errorMessage: 'Some error' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 200, (res) ->
            res.body.matches.should.have.lengthOf 1
            res.body.matches[0].matchType.should.equal 'token'
            done()
          return
        return
      return

  # ---- Stack match (COMPARE_BY_MIXED) ----

  describe 'dryRun = false — stack trace match', ->

    it 'matches via stackMap and creates doc with match_type=stack', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-stk', stack: 'java.io.IOException\n  at Foo.bar(Foo.java:10)', configuration: { compare_by: 'COMPARE_BY_MIXED' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-stk', name: 'Stack Test', stackTrace: 'java.io.IOException\n  at Foo.bar(Foo.java:10)' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, false, 200, (res) ->
            res.body.created.should.equal 1
            res.body.matches[0].matchType.should.equal 'stack'
            InvestigatedTest.findOne { uid: 'new-test-stk', product: PRODUCT, type: TYPE }, (err, doc) ->
              should.exist doc
              doc.auto_triage_match_type.should.equal 'stack'
              done()
          return
        return
      return

  # ---- COMPARE_BY_MIXED: no false positive on message ----

  describe 'COMPARE_BY_MIXED source — no false positive on message', ->

    it 'does not match when test has same generic message but different stack', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        # Source: COMPARE_BY_MIXED → only in stackMap, NOT in messageMap
        createSource { uid: 'src-mixed-fp', message: 'AssertionError', stack: 'at SpecificClass.method(Specific.java:42)', configuration: { compare_by: 'COMPARE_BY_MIXED' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-fp', name: 'False Pos', errorMessage: 'AssertionError', stackTrace: 'at DifferentClass.other(Other.java:99)' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 200, (res) ->
            res.body.matches.should.have.lengthOf 0
            done()
          return
        return
      return

  # ---- No match ----

  describe 'no match scenarios', ->

    it 'returns empty matches when error message differs', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-nm', message: 'Expected X but got Y', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-nm', name: 'No Match', errorMessage: 'Completely different error' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 200, (res) ->
            res.body.matches.should.have.lengthOf 0
            res.body.created.should.equal 0
            done()
          return
        return
      return

    it 'returns empty matches when no source investigations exist', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        tests = [{ uid: 'new-test-nosrc', name: 'No Source', errorMessage: 'Any error' }]
        invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 200, (res) ->
          res.body.matches.should.have.lengthOf 0
          done()
      return

    it 'skips fuzzy-match sources (similarity.value != 100)', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-fuzzy', message: 'Fuzzy error message', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE', similarity: { value: 80 } } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-fuzzy', name: 'Fuzzy Test', errorMessage: 'Fuzzy error message' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 200, (res) ->
            res.body.matches.should.have.lengthOf 0
            done()
          return
        return
      return

  # ---- Idempotent upsert ----

  describe 'idempotent upsert', ->

    it 'applying twice for same uid produces exactly one doc', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-idem', message: 'Idempotent error', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          body = { product: PRODUCT, type: TYPE, tests: [{ uid: 'new-test-idem', name: 'Idempotent Test', errorMessage: 'Idempotent error' }] }
          invTest.autoTriage server, cookies, body, false, 200, (res) ->
            res.body.created.should.equal 1
            invTest.autoTriage server, cookies, body, false, 200, (res2) ->
              InvestigatedTest.countDocuments { uid: 'new-test-idem', product: PRODUCT, type: TYPE }, (err, count) ->
                count.should.equal 1
                done()
          return
        return
      return

  # ---- promoteUids: override ttl to -1 ----

  describe 'promoteUids — override ttl to -1 on apply', ->

    it 'sets ttl = -1 when testUid is in promoteUids even for exact match', (done) ->
      createSetting { ttlDays: 3 }, (err) ->
        return done(err) if err
        createSource { uid: 'src-prom', message: 'Promote me error', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-prom', name: 'Promote Test', errorMessage: 'Promote me error' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests, promoteUids: ['new-test-prom'] }, false, 200, (res) ->
            res.body.created.should.equal 1
            InvestigatedTest.findOne { uid: 'new-test-prom', product: PRODUCT, type: TYPE }, (err, doc) ->
              doc.configuration.ttl.should.equal -1
              done()
          return
        return
      return

  # ---- Multiple tests in one request ----

  describe 'multiple eligible tests in one request', ->

    it 'matches and creates docs for all matching tests, skips non-matching', (done) ->
      createSetting {}, (err) ->
        return done(err) if err
        createSource { uid: 'src-multi-1', message: 'Error Alpha', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
          return done(err) if err
          createSource { uid: 'src-multi-2', message: 'Error Beta', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }, (err) ->
            return done(err) if err
            tests = [
              { uid: 'mt-1', name: 'Multi 1', errorMessage: 'Error Alpha' }
              { uid: 'mt-2', name: 'Multi 2', errorMessage: 'Error Beta'  }
              { uid: 'mt-3', name: 'Multi 3', errorMessage: 'Error Gamma' }
            ]
            invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, false, 200, (res) ->
              res.body.created.should.equal 2
              res.body.matches.should.have.lengthOf 2
              uids = res.body.matches.map (m) -> m.testUid
              uids.should.include 'mt-1'
              uids.should.include 'mt-2'
              uids.should.not.include 'mt-3'
              done()
            return
          return
        return
      return

  # ---- Source age filter ----

  describe 'max_source_age_days filter', ->

    it 'excludes source investigations older than max_source_age_days', (done) ->
      createSetting { maxSourceAgeDays: 1 }, (err) ->
        return done(err) if err
        oldDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        InvestigatedTest.create {
          uid: 'src-old', product: PRODUCT, type: TYPE
          caused_by: 'Defect', tracking: {}
          configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
          failure: { error_message: 'Old error', token: null, stack_trace: null }
          create_at: oldDate
        }, (err) ->
          return done(err) if err
          tests = [{ uid: 'new-test-old', name: 'Old Source Test', errorMessage: 'Old error' }]
          invTest.autoTriage server, cookies, { product: PRODUCT, type: TYPE, tests: tests }, true, 200, (res) ->
            res.body.matches.should.have.lengthOf 0
            done()
          return
        return
      return
