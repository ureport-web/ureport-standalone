chai   = require('chai')
should = chai.should()

buildTransport = require('../../src/utils/email_transport')

# nodemailer keeps the resolved connection settings on transport.options
describe 'email_transport — buildTransport', ->

  it 'uses the gmail defaults', ->
    t = buildTransport({ provider: 'gmail', user: 'bot@x.com', password: 'pw' })
    t.options.host.should.equal 'smtp.gmail.com'
    t.options.port.should.equal 465
    t.options.secure.should.equal true
    t.options.auth.user.should.equal 'bot@x.com'
    t.options.auth.pass.should.equal 'pw'

  it 'uses the outlook defaults', ->
    t = buildTransport({ provider: 'outlook', user: 'bot@x.com', password: 'pw' })
    t.options.host.should.equal 'smtp.office365.com'
    t.options.port.should.equal 587
    t.options.secure.should.equal false

  it 'defaults to gmail when no provider is set', ->
    buildTransport({ user: 'bot@x.com', password: 'pw' }).options.host.should.equal 'smtp.gmail.com'

  it 'lets host, port and secure override the defaults, including secure false', ->
    t = buildTransport({ provider: 'gmail', host: 'mail.test', port: 2525, secure: false, user: 'u', password: 'p' })
    t.options.host.should.equal 'mail.test'
    t.options.port.should.equal 2525
    t.options.secure.should.equal false

  it 'an smtp provider uses the given host', ->
    t = buildTransport({ provider: 'smtp', host: 'mail.test', port: 25, secure: false })
    t.options.host.should.equal 'mail.test'
    should.not.exist t.options.auth

  it 'sets auth only when a user or password is given', ->
    should.not.exist buildTransport({ provider: 'smtp', host: 'h' }).options.auth
    buildTransport({ provider: 'smtp', host: 'h', user: 'u' }).options.auth.user.should.equal 'u'

  # An unknown provider has no defaults: the host must be given. Notifications used to fall back to
  # the gmail host for this case, other emails did not; the plugin now uses this helper.
  it 'an unknown provider gets no default host or port', ->
    t = buildTransport({ provider: 'office365', user: 'u', password: 'p' })
    should.not.exist t.options.host
    should.not.exist t.options.port
