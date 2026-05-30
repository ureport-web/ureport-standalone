chai   = require('chai')
should = chai.should()

{ matchesScope, evaluateThreshold, filterByNamePattern } = require('../../src/utils/quarantine_evaluator')

# ---------------------------------------------------------------------------
# matchesScope
# ---------------------------------------------------------------------------
describe 'matchesScope', ->

  it 'matches when scope is empty (all builds accepted)', ->
    rule  = { scope: {} }
    build = { product: 'Prod', type: 'Web' }
    matchesScope(rule, build).should.equal true

  it 'matches when scope is undefined', ->
    rule  = {}
    build = { product: 'Prod', type: 'Web' }
    matchesScope(rule, build).should.equal true

  it 'matches when all specified scope fields equal build fields', ->
    rule  = { scope: { version: 'v2', stage: 'regression' } }
    build = { version: 'v2', stage: 'regression', platform: 'Chrome' }
    matchesScope(rule, build).should.equal true

  it 'does not match when one scope field differs', ->
    rule  = { scope: { version: 'v2', stage: 'regression' } }
    build = { version: 'v3', stage: 'regression' }
    matchesScope(rule, build).should.equal false

  it 'matches when scope field is set and build field equals it (partial scope)', ->
    rule  = { scope: { platform: 'Chrome' } }
    build = { platform: 'Chrome', version: 'v1' }
    matchesScope(rule, build).should.equal true

  it 'does not match when scope field is set and build field is absent', ->
    rule  = { scope: { platform: 'Chrome' } }
    build = {}
    matchesScope(rule, build).should.equal false

# ---------------------------------------------------------------------------
# filterByNamePattern
# ---------------------------------------------------------------------------
describe 'filterByNamePattern', ->

  uids = ['tests/login/test_login', 'tests/checkout/test_pay', 'tests/login/test_logout']

  it 'returns all UIDs when namePattern is falsy', ->
    filterByNamePattern(uids, null).should.deep.equal uids
    filterByNamePattern(uids, '').should.deep.equal uids
    filterByNamePattern(uids, undefined).should.deep.equal uids

  it 'filters UIDs matching the pattern (case-insensitive)', ->
    result = filterByNamePattern(uids, 'Login')
    result.should.deep.equal ['tests/login/test_login', 'tests/login/test_logout']

  it 'returns empty array when no UID matches', ->
    result = filterByNamePattern(uids, 'billing')
    result.should.deep.equal []

  it 'supports regex anchors and special characters', ->
    result = filterByNamePattern(uids, '^tests/checkout')
    result.should.deep.equal ['tests/checkout/test_pay']

  it 'throws on invalid regex', ->
    (-> filterByNamePattern(uids, '[invalid')).should.throw()

# ---------------------------------------------------------------------------
# evaluateThreshold — total mode
# ---------------------------------------------------------------------------
describe 'evaluateThreshold — total mode', ->

  buildIds = ['b1', 'b2', 'b3', 'b4', 'b5']

  mkResults = (uid, failedBuilds) ->
    buildIds.map (bid) ->
      { uid: uid, build: bid, failed: if failedBuilds.indexOf(bid) >= 0 then 1 else 0 }

  it 'quarantines UID when fail count meets threshold', ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3'])
    out = evaluateThreshold({ mode: 'total', failures: 3 }, results, buildIds)
    out.length.should.equal 1
    out[0].uid.should.equal 'uid-A'
    out[0].failCount.should.equal 3

  it 'does not quarantine UID when fail count is below threshold', ->
    # failCount=1: 1+1=2 < 3 — not quarantined
    results = mkResults('uid-A', ['b1'])
    out = evaluateThreshold({ mode: 'total', failures: 3 }, results, buildIds)
    out.length.should.equal 0

  it 'handles multiple UIDs independently', ->
    resultsA = mkResults('uid-A', ['b1', 'b2', 'b3'])
    resultsB = mkResults('uid-B', ['b1'])
    out = evaluateThreshold({ mode: 'total', failures: 3 }, resultsA.concat(resultsB), buildIds)
    out.length.should.equal 1
    out[0].uid.should.equal 'uid-A'

  it 'quarantines all UIDs that individually meet the threshold', ->
    resultsA = mkResults('uid-A', ['b1', 'b2', 'b3'])
    resultsB = mkResults('uid-B', ['b1', 'b2', 'b3', 'b4'])
    out = evaluateThreshold({ mode: 'total', failures: 3 }, resultsA.concat(resultsB), buildIds)
    out.length.should.equal 2

  it 'returns empty array when results are empty', ->
    out = evaluateThreshold({ mode: 'total', failures: 3 }, [], buildIds)
    out.length.should.equal 0

  it 'counts SKIP as a failure (failed=1 in results)', ->
    results = [
      { uid: 'uid-A', build: 'b1', failed: 1 }
      { uid: 'uid-A', build: 'b2', failed: 1 }
      { uid: 'uid-A', build: 'b3', failed: 1 }
    ]
    out = evaluateThreshold({ mode: 'total', failures: 3 }, results, ['b1', 'b2', 'b3'])
    out.length.should.equal 1

# ---------------------------------------------------------------------------
# evaluateThreshold — consecutive mode
# ---------------------------------------------------------------------------
describe 'evaluateThreshold — consecutive mode', ->

  buildIds = ['b1', 'b2', 'b3', 'b4', 'b5'] # most-recent-first

  mkResults = (uid, failedBuilds) ->
    buildIds.map (bid) ->
      { uid: uid, build: bid, failed: if failedBuilds.indexOf(bid) >= 0 then 1 else 0 }

  it 'quarantines UID with a consecutive streak meeting threshold', ->
    # b1, b2, b3 all failed (most-recent-first streak of 3)
    results = mkResults('uid-A', ['b1', 'b2', 'b3'])
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, results, buildIds)
    out.length.should.equal 1
    out[0].uid.should.equal 'uid-A'
    out[0].failCount.should.equal 3

  it 'does not quarantine UID when streak is broken before reaching threshold', ->
    # b1 pass, b2 fail, b3 fail — streak starts at 0 since b1 is most recent
    results = mkResults('uid-A', ['b2', 'b3'])
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, results, buildIds)
    out.length.should.equal 0

  it 'does not quarantine UID when streak length is below threshold', ->
    # streak=1: 1+1=2 < 3 — not quarantined
    results = mkResults('uid-A', ['b1'])
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, results, buildIds)
    out.length.should.equal 0

  it 'ignores failures after a pass in the streak (streak resets at first pass)', ->
    # b1 fail, b2 pass resets streak; b3,b4,b5 failures are ignored — streak is only 1
    results = mkResults('uid-A', ['b1', 'b3', 'b4', 'b5'])
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, results, buildIds)
    out.length.should.equal 0

  it 'streak of exactly 1 does not quarantine when threshold is 3', ->
    results = mkResults('uid-A', ['b1'])
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, results, buildIds)
    out.length.should.equal 0

  it 'returns empty array when results are empty', ->
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, [], buildIds)
    out.length.should.equal 0

  it 'handles multiple UIDs: only those with sufficient streak are quarantined', ->
    resultsA = mkResults('uid-A', ['b1', 'b2', 'b3']) # streak 3 — quarantine
    resultsB = mkResults('uid-B', ['b1'])              # streak 1 — skip
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, resultsA.concat(resultsB), buildIds)
    out.length.should.equal 1
    out[0].uid.should.equal 'uid-A'

  it 'handles UID with no results in any qualifying build', ->
    out = evaluateThreshold({ mode: 'consecutive', failures: 1 }, [], buildIds)
    out.length.should.equal 0

# ---------------------------------------------------------------------------
# evaluateThreshold — ratio mode
# ---------------------------------------------------------------------------
describe 'evaluateThreshold — ratio mode', ->

  tenBuildIds = ['b1','b2','b3','b4','b5','b6','b7','b8','b9','b10']

  mkResults = (uid, failedBuilds) ->
    tenBuildIds.map (bid) ->
      { uid: uid, build: bid, failed: if failedBuilds.indexOf(bid) >= 0 then 1 else 0 }

  it 'quarantines UID when fail rate exceeds threshold (4/10 = 40% >= 30%)', ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3', 'b4'])
    out = evaluateThreshold({ mode: 'ratio', fail_rate: 30 }, results, tenBuildIds)
    out.length.should.equal 1
    out[0].uid.should.equal 'uid-A'

  it 'does not quarantine UID when fail rate is below threshold (2/10 = 20% < 30%)', ->
    results = mkResults('uid-A', ['b1', 'b2'])
    out = evaluateThreshold({ mode: 'ratio', fail_rate: 30 }, results, tenBuildIds)
    out.length.should.equal 0

  it 'quarantines UID at exact threshold boundary (3/10 = 30% >= 30%)', ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3'])
    out = evaluateThreshold({ mode: 'ratio', fail_rate: 30 }, results, tenBuildIds)
    out.length.should.equal 1

  it 'returns empty when fail_rate is 0 (disabled guard)', ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3', 'b4'])
    out = evaluateThreshold({ mode: 'ratio', fail_rate: 0 }, results, tenBuildIds)
    out.length.should.equal 0

  it 'returns empty when qualifyingBuildIds is empty', ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3'])
    out = evaluateThreshold({ mode: 'ratio', fail_rate: 30 }, results, [])
    out.length.should.equal 0

  it 'handles multiple UIDs: only those at or above threshold are quarantined', ->
    resultsA = mkResults('uid-A', ['b1', 'b2', 'b3', 'b4']) # 40% — quarantine
    resultsB = mkResults('uid-B', ['b1', 'b2'])              # 20% — skip
    out = evaluateThreshold({ mode: 'ratio', fail_rate: 30 }, resultsA.concat(resultsB), tenBuildIds)
    out.length.should.equal 1
    out[0].uid.should.equal 'uid-A'

# ---------------------------------------------------------------------------
# evaluateThreshold — mode field in results
# ---------------------------------------------------------------------------
describe 'evaluateThreshold — mode field in results', ->

  buildIds = ['b1', 'b2', 'b3', 'b4', 'b5']
  tenBuildIds = ['b1','b2','b3','b4','b5','b6','b7','b8','b9','b10']

  mkResults = (uid, failedBuilds, pool) ->
    pool.map (bid) ->
      { uid: uid, build: bid, failed: if failedBuilds.indexOf(bid) >= 0 then 1 else 0 }

  it "total mode item carries mode: 'total'", ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3'], buildIds)
    out = evaluateThreshold({ mode: 'total', failures: 3 }, results, buildIds)
    out.length.should.equal 1
    out[0].mode.should.equal 'total'

  it "consecutive mode item carries mode: 'consecutive'", ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3'], buildIds)
    out = evaluateThreshold({ mode: 'consecutive', failures: 3 }, results, buildIds)
    out.length.should.equal 1
    out[0].mode.should.equal 'consecutive'

  it "ratio mode item carries mode: 'ratio'", ->
    results = mkResults('uid-A', ['b1', 'b2', 'b3', 'b4'], tenBuildIds)
    out = evaluateThreshold({ mode: 'ratio', fail_rate: 30 }, results, tenBuildIds)
    out.length.should.equal 1
    out[0].mode.should.equal 'ratio'
