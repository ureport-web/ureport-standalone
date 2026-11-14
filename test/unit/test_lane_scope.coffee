chai   = require('chai')
should = chai.should()
{ matchesScope, extractExtras } = require('../../src/utils/lane_scope')

# Shared by quarantine rules, notification rules and auto-heal scopes.
describe 'lane_scope.matchesScope', ->

  it 'a blank scope matches every lane', ->
    matchesScope({ scope: {} }, { stage: 'prod' }).should.equal true
    matchesScope({}, { stage: 'prod' }).should.equal true

  it 'a set field must equal the build value, a blank field does not restrict', ->
    matchesScope({ scope: { stage: 'prod', team: '' } }, { stage: 'prod', team: 'x' }).should.equal true
    matchesScope({ scope: { stage: 'prod' } }, { stage: 'dev' }).should.equal false
    matchesScope({ scope: { stage: 'prod' } }, {}).should.equal false

  it 'every set field must match', ->
    rule = { scope: { team: 'T', stage: 'prod' } }
    matchesScope(rule, { team: 'T', stage: 'prod' }).should.equal true
    matchesScope(rule, { team: 'T', stage: 'dev' }).should.equal false

  it 'extras must all match, from a plain object or a Map', ->
    rule = { scope: { extras: { region: 'eu' } } }
    matchesScope(rule, { extras: { region: 'eu', more: 'x' } }).should.equal true
    matchesScope(rule, { extras: new Map([['region', 'eu']]) }).should.equal true
    matchesScope(rule, { extras: { region: 'us' } }).should.equal false
    matchesScope(rule, {}).should.equal false
    matchesScope({ scope: { extras: { region: 'eu', tier: '1' } } }, { extras: { region: 'eu' } }).should.equal false

  it 'a blank extras value does not restrict, even when the build has no extras', ->
    matchesScope({ scope: { extras: { region: '' } } }, {}).should.equal true
    matchesScope({ scope: { extras: { region: '' } } }, { extras: { region: 'eu' } }).should.equal true

  it 'empty or non-object extras do not restrict', ->
    matchesScope({ scope: { extras: {} } }, {}).should.equal true
    matchesScope({ scope: { extras: 'junk' } }, {}).should.equal true

describe 'lane_scope.extractExtras', ->
  it 'turns a Map into a plain object and a missing value into {}', ->
    extractExtras({ extras: new Map([['a', '1']]) }).should.eql { a: '1' }
    extractExtras({}).should.eql {}
    extractExtras(null).should.eql {}
