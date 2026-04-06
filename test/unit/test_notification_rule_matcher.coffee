chai   = require('chai')
should = chai.should()

{ checkRelation, matchesRule } = require('../../src/utils/notification_rule_matcher')

# ---------------------------------------------------------------------------
# checkRelation — tags
# ---------------------------------------------------------------------------
describe 'checkRelation — tags', ->

  it 'matches when plain-string array contains the value', ->
    cond = { type: 'tags', values: ['smoke'] }
    tr   = { tags: ['smoke', 'regression'] }
    checkRelation(cond, tr).should.equal true

  it 'does not match when plain-string array lacks the value', ->
    cond = { type: 'tags', values: ['smoke'] }
    tr   = { tags: ['regression'] }
    checkRelation(cond, tr).should.equal false

  it 'matches when object array [{name}] contains the value', ->
    cond = { type: 'tags', values: ['smoke'] }
    tr   = { tags: [{ name: 'smoke' }, { name: 'regression' }] }
    checkRelation(cond, tr).should.equal true

  it 'does not match when object array lacks the value', ->
    cond = { type: 'tags', values: ['smoke'] }
    tr   = { tags: [{ name: 'regression' }] }
    checkRelation(cond, tr).should.equal false

  it 'does not match when tags is null/undefined', ->
    cond = { type: 'tags', values: ['smoke'] }
    tr   = { tags: null }
    checkRelation(cond, tr).should.equal false

# ---------------------------------------------------------------------------
# checkRelation — teams
# ---------------------------------------------------------------------------
describe 'checkRelation — teams', ->

  it 'matches when plain-string array contains the value', ->
    cond = { type: 'teams', values: ['TeamA'] }
    tr   = { teams: ['TeamA', 'TeamB'] }
    checkRelation(cond, tr).should.equal true

  it 'does not match when plain-string array lacks the value', ->
    cond = { type: 'teams', values: ['TeamA'] }
    tr   = { teams: ['TeamB'] }
    checkRelation(cond, tr).should.equal false

  it 'matches when object array [{name}] contains the value', ->
    cond = { type: 'teams', values: ['TeamA'] }
    tr   = { teams: [{ name: 'TeamA' }] }
    checkRelation(cond, tr).should.equal true

  it 'does not match when object array lacks the value', ->
    cond = { type: 'teams', values: ['TeamA'] }
    tr   = { teams: [{ name: 'TeamB' }] }
    checkRelation(cond, tr).should.equal false

  it 'does not match when teams is null/undefined', ->
    cond = { type: 'teams', values: ['TeamA'] }
    tr   = {}
    checkRelation(cond, tr).should.equal false

# ---------------------------------------------------------------------------
# checkRelation — components
# ---------------------------------------------------------------------------
describe 'checkRelation — components', ->

  it 'matches when array of objects [{name}] contains the value', ->
    cond = { type: 'components', values: ['Login'] }
    tr   = { components: [{ name: 'Login' }, { name: 'Signup' }] }
    checkRelation(cond, tr).should.equal true

  it 'matches when components is a single object (not array)', ->
    cond = { type: 'components', values: ['Login'] }
    tr   = { components: { name: 'Login' } }
    checkRelation(cond, tr).should.equal true

  it 'does not match when the value is absent', ->
    cond = { type: 'components', values: ['Login'] }
    tr   = { components: [{ name: 'Signup' }] }
    checkRelation(cond, tr).should.equal false

# ---------------------------------------------------------------------------
# checkRelation — custom fields
# ---------------------------------------------------------------------------
describe 'checkRelation — custom fields', ->

  it 'matches when custom string value equals the condition value', ->
    cond = { type: 'priority', values: ['P1'] }
    tr   = { customs: { priority: 'P1' } }
    checkRelation(cond, tr).should.equal true

  it 'does not match when custom string value differs', ->
    cond = { type: 'priority', values: ['P1'] }
    tr   = { customs: { priority: 'P2' } }
    checkRelation(cond, tr).should.equal false

  it 'matches when custom is an array containing the value', ->
    cond = { type: 'priority', values: ['P1'] }
    tr   = { customs: { priority: ['P1', 'P2'] } }
    checkRelation(cond, tr).should.equal true

  it 'does not match when custom array lacks the value', ->
    cond = { type: 'priority', values: ['P1'] }
    tr   = { customs: { priority: ['P2', 'P3'] } }
    checkRelation(cond, tr).should.equal false

  it 'does not match when the custom key is missing entirely', ->
    cond = { type: 'priority', values: ['P1'] }
    tr   = { customs: {} }
    checkRelation(cond, tr).should.equal false

# ---------------------------------------------------------------------------
# matchesRule — AND / OR logic
# ---------------------------------------------------------------------------
describe 'matchesRule — AND/OR logic', ->

  tr1 = { uid: 'test-1', tags: ['smoke'],      teams: ['TeamA'] }
  tr2 = { uid: 'test-2', tags: ['regression'], teams: ['TeamA'] }
  tr3 = { uid: 'test-3', tags: ['smoke'],      teams: ['TeamB'] }

  andRule = (relations) ->
    { filter: { relations: relations, logic: 'AND' } }

  orRule = (relations) ->
    { filter: { relations: relations, logic: 'OR' } }

  it 'AND — includes relation when both conditions match', ->
    rule = andRule [
      { type: 'tags',  values: ['smoke'] }
      { type: 'teams', values: ['TeamA'] }
    ]
    result = matchesRule(rule, [tr1, tr2, tr3])
    result.length.should.equal 1
    result[0].uid.should.equal 'test-1'

  it 'AND — excludes relation when one condition fails', ->
    rule = andRule [
      { type: 'tags',  values: ['smoke'] }
      { type: 'teams', values: ['TeamA'] }
    ]
    result = matchesRule(rule, [tr2, tr3])
    result.length.should.equal 0

  it 'OR — includes relation when at least one condition matches', ->
    rule = orRule [
      { type: 'tags',  values: ['smoke'] }
      { type: 'teams', values: ['TeamA'] }
    ]
    # tr1: both match, tr2: teams match, tr3: tags match → all three included
    result = matchesRule(rule, [tr1, tr2, tr3])
    result.length.should.equal 3

  it 'OR — excludes relation when no conditions match', ->
    rule = orRule [
      { type: 'tags',  values: ['perf'] }
      { type: 'teams', values: ['TeamC'] }
    ]
    result = matchesRule(rule, [tr1, tr2, tr3])
    result.length.should.equal 0

  it 'returns all relations unchanged when relations array is empty', ->
    rule = { filter: { relations: [], logic: 'AND' } }
    result = matchesRule(rule, [tr1, tr2, tr3])
    result.length.should.equal 3
