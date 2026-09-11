###
Regression tests for Build model static methods.

These lock in CURRENT behaviour (no extras field).
Run NOW → all must pass.
After implementing custom-params feature → run again → must still pass.
New extras-specific tests will be added alongside these.
###
chai = require('chai')
should = chai.should()

Build = require('../../src/models/build')

# ─── initBuild ──────────────────────────────────────────────────────────────

describe 'Build.initBuild — required fields', ->

  it 'sets product', ->
    b = Build.initBuild { product: 'MyApp', type: 'Smoke', build: 42 }
    b.product.should.equal 'MyApp'

  it 'sets type', ->
    b = Build.initBuild { product: 'MyApp', type: 'Smoke', build: 42 }
    b.type.should.equal 'Smoke'

  it 'sets build number', ->
    b = Build.initBuild { product: 'MyApp', type: 'Smoke', build: 42 }
    b.build.should.equal 42

  it 'returns a Build document instance', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    b.constructor.modelName.should.equal 'Build'

describe 'Build.initBuild — 7 optional lane fields', ->

  it 'sets version when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, version: '2.0' }
    b.version.should.equal '2.0'

  it 'sets team when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, team: 'QA' }
    b.team.should.equal 'QA'

  it 'sets browser when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, browser: 'chrome' }
    b.browser.should.equal 'chrome'

  it 'sets device when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, device: 'mobile' }
    b.device.should.equal 'mobile'

  it 'sets platform when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, platform: 'ios' }
    b.platform.should.equal 'ios'

  it 'sets platform_version when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, platform_version: '15' }
    b.platform_version.should.equal '15'

  it 'sets stage when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, stage: 'staging' }
    b.stage.should.equal 'staging'

  it 'sets all 7 optional fields together', ->
    b = Build.initBuild
      product: 'P', type: 'T', build: 1
      version: '2.0', team: 'QA', browser: 'chrome'
      device: 'mobile', platform: 'ios', platform_version: '15', stage: 'staging'
    b.version.should.equal '2.0'
    b.team.should.equal 'QA'
    b.browser.should.equal 'chrome'
    b.device.should.equal 'mobile'
    b.platform.should.equal 'ios'
    b.platform_version.should.equal '15'
    b.stage.should.equal 'staging'

  it 'omits version when not provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    (b.version == undefined || b.version == null).should.be.true

  it 'omits team when not provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    (b.team == undefined || b.team == null).should.be.true

  it 'omits browser when not provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    (b.browser == undefined || b.browser == null).should.be.true

  it 'omits device when not provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    (b.device == undefined || b.device == null).should.be.true

  it 'omits platform when not provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    (b.platform == undefined || b.platform == null).should.be.true

  it 'omits platform_version when not provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    (b.platform_version == undefined || b.platform_version == null).should.be.true

  it 'omits stage when not provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    (b.stage == undefined || b.stage == null).should.be.true

  it 'does NOT copy unknown field extras (field does not exist in schema yet)', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, extras: { region: 'us-east' } }
    (b.extras == undefined || b.extras == null).should.be.true

describe 'Build.initBuild — other fields', ->

  it 'defaults is_archive to false', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    b.is_archive.should.be.false

  it 'sets is_archive to true when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, is_archive: true }
    b.is_archive.should.be.true

  it 'sets owner when provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, owner: 'alice' }
    b.owner.should.equal 'alice'

  it 'sets start_time when provided', ->
    t = new Date('2024-01-15')
    b = Build.initBuild { product: 'P', type: 'T', build: 1, start_time: t }
    b.start_time.getTime().should.equal t.getTime()

  it 'sets settings under client key when client provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, client: 'web', settings: { foo: 'bar' } }
    b.settings['web'].should.deep.equal { foo: 'bar' }

  it 'sets settings under default key when no client', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, settings: { foo: 'bar' } }
    b.settings['default'].should.deep.equal { foo: 'bar' }

  it 'sets environments under client key when client provided', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, client: 'web', environments: { url: 'https://prod' } }
    b.environments['web'].should.deep.equal { url: 'https://prod' }

# ─── updateAttributes ──────────────────────────────────────────────────────

describe 'Build.updateAttributes', ->

  it 'updates is_archive to true', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateAttributes b, { is_archive: true }
    b.is_archive.should.be.true

  it 'updates is_archive to false', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, is_archive: true }
    Build.updateAttributes b, { is_archive: false }
    b.is_archive.should.be.false

  it 'updates end_time', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    t = new Date('2024-06-01')
    Build.updateAttributes b, { end_time: t }
    b.end_time.getTime().should.equal t.getTime()

  it 'updates owner', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateAttributes b, { owner: 'bob' }
    b.owner.should.equal 'bob'

  it 'does NOT modify version (version is immutable after create)', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, version: '1.0' }
    Build.updateAttributes b, { version: '99.0' }
    b.version.should.equal '1.0'

  it 'does NOT modify browser (browser is immutable after create)', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, browser: 'chrome' }
    Build.updateAttributes b, { browser: 'firefox' }
    b.browser.should.equal 'chrome'

  it 'does NOT modify team (team is immutable after create)', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, team: 'QA' }
    Build.updateAttributes b, { team: 'Dev' }
    b.team.should.equal 'QA'

  it 'does NOT modify platform (platform is immutable after create)', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, platform: 'ios' }
    Build.updateAttributes b, { platform: 'android' }
    b.platform.should.equal 'ios'

  it 'does NOT modify stage (stage is immutable after create)', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1, stage: 'staging' }
    Build.updateAttributes b, { stage: 'prod' }
    b.stage.should.equal 'staging'

  it 'does not throw on empty payload', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    ( -> Build.updateAttributes b, {} ).should.not.throw()

  it 'does not throw on null payload', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    ( -> Build.updateAttributes b, null ).should.not.throw()

  it 'updates settings under client key', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateAttributes b, { client: 'mobile', settings: { theme: 'dark' } }
    b.settings['mobile'].should.deep.equal { theme: 'dark' }

  it 'updates settings under default key when no client', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateAttributes b, { settings: { theme: 'light' } }
    b.settings['default'].should.deep.equal { theme: 'light' }

# ─── updateStatus ──────────────────────────────────────────────────────────

describe 'Build.updateStatus', ->

  it 'adds pass count', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateStatus b, { pass: 5, fail: 0, skip: 0, warning: 0 }
    b.status.pass.should.equal 5

  it 'adds fail count', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateStatus b, { pass: 0, fail: 3, skip: 0, warning: 0 }
    b.status.fail.should.equal 3

  it 'adds skip count', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateStatus b, { pass: 0, fail: 0, skip: 2, warning: 0 }
    b.status.skip.should.equal 2

  it 'adds warning count', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateStatus b, { pass: 0, fail: 0, skip: 0, warning: 1 }
    b.status.warning.should.equal 1

  it 'computes total = pass + fail + skip + warning', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateStatus b, { pass: 10, fail: 2, skip: 1, warning: 1 }
    b.status.total.should.equal 14

  it 'accumulates on repeated calls', ->
    b = Build.initBuild { product: 'P', type: 'T', build: 1 }
    Build.updateStatus b, { pass: 5, fail: 0, skip: 0, warning: 0 }
    Build.updateStatus b, { pass: 3, fail: 1, skip: 0, warning: 0 }
    b.status.pass.should.equal 8
    b.status.fail.should.equal 1
    b.status.total.should.equal 9
