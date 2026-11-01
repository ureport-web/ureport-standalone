chai   = require('chai')
should = chai.should()

{ validateLicense, getLicenseState, setCachedState, invalidateCache, COMMUNITY_JWT } = require('../../src/utils/license')

# ──────────────────────────────────────────────────────────────────────────────
# validateLicense
# ──────────────────────────────────────────────────────────────────────────────
describe 'validateLicense', ->

  it 'validates null as community edition (uses COMMUNITY_JWT internally)', ->
    result = validateLicense(null)
    result.valid.should.equal true
    result.isCommunity.should.equal true
    result.seats.should.equal 5
    chai.expect(result.lanes).to.equal null  # lane limit removed
    result.plan.should.equal 'community'

  it 'validates COMMUNITY_JWT token directly', ->
    result = validateLicense(COMMUNITY_JWT)
    result.valid.should.equal true
    result.isCommunity.should.equal true
    result.seats.should.equal 5
    chai.expect(result.lanes).to.equal null  # lane limit removed
    result.plan.should.equal 'community'

  it 'returns fallback on invalid/garbage token (valid:false, community seats/lanes)', ->
    result = validateLicense('garbage.token.invalid')
    result.valid.should.equal false
    result.seats.should.equal 3
    chai.expect(result.lanes).to.equal null  # lane limit removed
    result.isCommunity.should.equal true

# ──────────────────────────────────────────────────────────────────────────────
# getLicenseState / setCachedState / invalidateCache
# ──────────────────────────────────────────────────────────────────────────────
describe 'getLicenseState / setCachedState / invalidateCache', ->

  afterEach ->
    invalidateCache()

  it 'getLicenseState after invalidateCache re-validates and returns community defaults', ->
    invalidateCache()
    result = getLicenseState()
    result.valid.should.equal true
    result.isCommunity.should.equal true
    result.seats.should.equal 5
    chai.expect(result.lanes).to.equal null  # lane limit removed

  it 'setCachedState then getLicenseState returns the injected state', ->
    setCachedState({ seats: 10, lanes: 5, valid: true, plan: 'pro', isCommunity: false })
    result = getLicenseState()
    result.seats.should.equal 10
    result.lanes.should.equal 5

  it 'invalidateCache after setCachedState clears injected state back to community', ->
    setCachedState({ seats: 999, lanes: 99 })
    invalidateCache()
    result = getLicenseState()
    result.seats.should.equal 5
    chai.expect(result.lanes).to.equal null  # lane limit removed
