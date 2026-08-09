chai   = require('chai')
should = chai.should()

{ buildMaps } = require('../../src/utils/auto_triage_evaluator')

# ---------------------------------------------------------------------------
# Helpers — build minimal source objects
# ---------------------------------------------------------------------------
makeSource = (opts = {}) ->
  uid:           opts.uid       or 'src-uid-1'
  caused_by:     opts.caused_by or 'flaky'
  is_exempt:     opts.is_exempt or false
  create_at:     opts.create_at or new Date('2025-01-01')
  configuration: opts.configuration or null
  failure:
    token:         opts.token   or null
    error_message: opts.message or null
    stack_trace:   opts.stack   or null

# ---------------------------------------------------------------------------
# buildMaps — compare_by routing
# ---------------------------------------------------------------------------
describe 'buildMaps — COMPARE_BY_FAILURE_MESSAGE routing', ->

  it 'routes source with COMPARE_BY_FAILURE_MESSAGE into messageMap', ->
    src = makeSource
      message:       'Expected 200 but got 404'
      configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { tokenMap, messageMap, stackMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 1
    messageMap['Expected 200 but got 404'].uid.should.equal 'src-uid-1'
    Object.keys(tokenMap).length.should.equal 0
    Object.keys(stackMap).length.should.equal 0

  it 'routes null/unset compare_by source into messageMap', ->
    src = makeSource
      message:       'NullPointerException'
      configuration: null
    { messageMap, stackMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 1
    Object.keys(stackMap).length.should.equal 0

  it 'does NOT add COMPARE_BY_FAILURE_MESSAGE source to stackMap even when stack present', ->
    src = makeSource
      message:       'Error msg'
      stack:         'at line 42'
      configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { stackMap } = buildMaps([src])
    Object.keys(stackMap).length.should.equal 0

describe 'buildMaps — COMPARE_BY_MIXED routing', ->

  it 'routes COMPARE_BY_MIXED source with stack into stackMap', ->
    src = makeSource
      stack:         'java.lang.NullPointerException\n  at Foo.bar(Foo.java:10)'
      configuration: { compare_by: 'COMPARE_BY_MIXED' }
    { messageMap, stackMap } = buildMaps([src])
    Object.keys(stackMap).length.should.equal 1
    Object.keys(messageMap).length.should.equal 0

  it 'does NOT add COMPARE_BY_MIXED source to messageMap even when message present', ->
    src = makeSource
      message:       'AssertionError'
      stack:         'at line 10'
      configuration: { compare_by: 'COMPARE_BY_MIXED' }
    { messageMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 0

  it 'routes legacy COMPARE_BY_STACK_TRACE source into stackMap', ->
    src = makeSource
      stack:         'at SomeClass.method(File.java:99)'
      configuration: { compare_by: 'COMPARE_BY_STACK_TRACE' }
    { stackMap } = buildMaps([src])
    Object.keys(stackMap).length.should.equal 1

describe 'buildMaps — token map', ->

  it 'adds source with token to tokenMap regardless of compare_by', ->
    src1 = makeSource
      uid:           'src-1'
      token:         'token-abc'
      message:       'Error A'
      configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    src2 = makeSource
      uid:           'src-2'
      token:         'token-xyz'
      stack:         'at Foo.bar:10'
      configuration: { compare_by: 'COMPARE_BY_MIXED' }
    { tokenMap } = buildMaps([src1, src2])
    Object.keys(tokenMap).length.should.equal 2
    tokenMap['token-abc'].uid.should.equal 'src-1'
    tokenMap['token-xyz'].uid.should.equal 'src-2'

  it 'source with token AND stack (COMPARE_BY_MIXED) appears in both tokenMap and stackMap', ->
    src = makeSource
      token:         'tok-123'
      stack:         'at line 1'
      configuration: { compare_by: 'COMPARE_BY_MIXED' }
    { tokenMap, stackMap } = buildMaps([src])
    Object.keys(tokenMap).length.should.equal 1
    Object.keys(stackMap).length.should.equal 1

  it 'source with token AND message (COMPARE_BY_FAILURE_MESSAGE) appears in both tokenMap and messageMap', ->
    src = makeSource
      token:         'tok-456'
      message:       'Connection timeout'
      configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { tokenMap, messageMap } = buildMaps([src])
    Object.keys(tokenMap).length.should.equal 1
    Object.keys(messageMap).length.should.equal 1

describe 'buildMaps — similarity sources skipped', ->

  it 'skips source with similarity.value != 100 (fuzzy match)', ->
    src = makeSource
      message:       'Fuzzy error message'
      configuration: { similarity: { value: 80 }, compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { messageMap, tokenMap, stackMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 0
    Object.keys(tokenMap).length.should.equal 0
    Object.keys(stackMap).length.should.equal 0

  it 'includes source with similarity.value == 100 (exact)', ->
    src = makeSource
      message:       'Exact error'
      configuration: { similarity: { value: 100 }, compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { messageMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 1

  it 'includes source with no similarity at all', ->
    src = makeSource
      message:       'No similarity set'
      configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { messageMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 1

describe 'buildMaps — deduplication (first seen wins)', ->

  it 'first-seen source wins on duplicate message key', ->
    # buildMaps expects sources sorted desc by create_at — first in array = most recent
    src1 = makeSource { uid: 'newest', message: 'Duplicate error', create_at: new Date('2025-06-01') }
    src2 = makeSource { uid: 'oldest', message: 'Duplicate error', create_at: new Date('2025-01-01') }
    { messageMap } = buildMaps([src1, src2])
    Object.keys(messageMap).length.should.equal 1
    messageMap['Duplicate error'].uid.should.equal 'newest'

  it 'first-seen source wins on duplicate token key', ->
    src1 = makeSource { uid: 'newer', token: 'tok-dup', create_at: new Date('2025-06-01') }
    src2 = makeSource { uid: 'older', token: 'tok-dup', create_at: new Date('2025-01-01') }
    { tokenMap } = buildMaps([src1, src2])
    tokenMap['tok-dup'].uid.should.equal 'newer'

  it 'distinct messages each get their own map entry', ->
    src1 = makeSource { uid: 'a', message: 'Error A' }
    src2 = makeSource { uid: 'b', message: 'Error B' }
    { messageMap } = buildMaps([src1, src2])
    Object.keys(messageMap).length.should.equal 2

describe 'buildMaps — 300-entry cap', ->

  it 'caps messageMap at 300 entries', ->
    sources = []
    for i in [1..350]
      sources.push makeSource
        uid:     "uid-#{i}"
        message: "Error message #{i}"
    { messageMap } = buildMaps(sources)
    Object.keys(messageMap).length.should.equal 300

  it 'caps tokenMap at 300 entries', ->
    sources = []
    for i in [1..350]
      sources.push makeSource { uid: "uid-#{i}", token: "token-#{i}" }
    { tokenMap } = buildMaps(sources)
    Object.keys(tokenMap).length.should.equal 300

describe 'buildMaps — source with no message/stack/token', ->

  it 'COMPARE_BY_FAILURE_MESSAGE source with no message is not added to any map', ->
    src = makeSource
      message:       null
      configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { messageMap, tokenMap, stackMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 0
    Object.keys(tokenMap).length.should.equal 0
    Object.keys(stackMap).length.should.equal 0

  it 'COMPARE_BY_MIXED source with no stack is not added to stackMap', ->
    src = makeSource
      message:       'Has message but not stack'
      stack:         null
      configuration: { compare_by: 'COMPARE_BY_MIXED' }
    { stackMap, messageMap } = buildMaps([src])
    Object.keys(stackMap).length.should.equal 0
    Object.keys(messageMap).length.should.equal 0

describe 'buildMaps — empty and single-item inputs', ->

  it 'returns empty maps for empty sources array', ->
    { tokenMap, messageMap, stackMap } = buildMaps([])
    Object.keys(tokenMap).length.should.equal 0
    Object.keys(messageMap).length.should.equal 0
    Object.keys(stackMap).length.should.equal 0

  it 'handles single source correctly', ->
    src = makeSource { message: 'Single error', configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' } }
    { messageMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 1

# ---------------------------------------------------------------------------
# Cascade priority simulation — verifying map contents drive correct match order
# ---------------------------------------------------------------------------
describe 'buildMaps — cascade priority verification', ->

  it 'token match takes priority: source is in tokenMap AND messageMap', ->
    # When a test has a token and the source is in both maps,
    # the caller checks tokenMap first → token wins
    src = makeSource
      token:         'tok-priority'
      message:       'Priority error'
      configuration: { compare_by: 'COMPARE_BY_FAILURE_MESSAGE' }
    { tokenMap, messageMap } = buildMaps([src])
    # Both maps populated → caller's sequential check (token first) is decisive
    tokenMap['tok-priority'].should.exist
    messageMap['Priority error'].should.exist

  it 'COMPARE_BY_MIXED source NOT in messageMap — prevents false positives on generic message', ->
    # Source: COMPARE_BY_MIXED with generic message — only goes to stackMap
    # A test with same generic message but different stack must NOT match
    src = makeSource
      message:       'AssertionError'
      stack:         'at SpecificClass.method:42'
      configuration: { compare_by: 'COMPARE_BY_MIXED' }
    { messageMap, stackMap } = buildMaps([src])
    Object.keys(messageMap).length.should.equal 0  # NOT in messageMap
    Object.keys(stackMap).length.should.equal 1    # IS in stackMap

  it 'stack-only source (COMPARE_BY_MIXED) is in stackMap, not messageMap', ->
    src = makeSource
      stack:         'java.io.IOException\n  at java.net.Socket'
      configuration: { compare_by: 'COMPARE_BY_MIXED' }
    { tokenMap, messageMap, stackMap } = buildMaps([src])
    Object.keys(tokenMap).length.should.equal 0
    Object.keys(messageMap).length.should.equal 0
    Object.keys(stackMap).length.should.equal 1
