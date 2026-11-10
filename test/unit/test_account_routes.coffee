chai   = require('chai')
chai.use(require('chai-http'))
should = chai.should()
express = require('express')
bcrypt = require('bcrypt')

# Route tests without a database: the User model and the audit helper are replaced in the require
# cache before the routers load, and a tiny middleware stands in for passport's req.user.
stubbed = []
stub = (modulePath, exports) ->
  resolved = require.resolve(modulePath)
  stubbed.push { resolved: resolved, previous: require.cache[resolved] }
  require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports: exports }

# The routers keep their own references, so the cache can be restored right after they load and
# other test files still get the real modules.
restoreStubs = ->
  for s in stubbed
    if s.previous then require.cache[s.resolved] = s.previous else delete require.cache[s.resolved]

users = {}
saveError = null

makeUser = (fields) ->
  user = Object.assign({ _id: 'u1', username: 'alice', role: 'viewer' }, fields)
  user.save = (cb) ->
    return cb(saveError) if saveError
    users[user._id] = user
    cb(null, user)
  user

FakeUser =
  findOne: (query) ->
    exec: (cb) ->
      found = Object.keys(users).map((k) -> users[k]).filter (u) ->
        Object.keys(query).every (k) -> u[k] == query[k]
      cb(null, found[0] or null)

stub('../../src/models/user', FakeUser)
stub('../../src/utils/register_audit', -> )

# Another test file (or the app) may already have loaded the real routers with the real User model,
# so load fresh copies for these tests.
freshRouter = (modulePath) ->
  resolved = require.resolve(modulePath)
  stubbed.push { resolved: resolved, previous: require.cache[resolved] }
  delete require.cache[resolved]
  require(modulePath)

authRouter = freshRouter('../../src/routes/authentication')
userRouter = freshRouter('../../src/routes/user')
restoreStubs()

# loggedIn: the user id to act as, or null for an anonymous request
makeApp = (loggedIn, role = 'viewer') ->
  app = express()
  app.use(express.json())
  app.use (req, res, next) ->
    req.isAuthenticated = -> !!loggedIn
    req.user = { _id: loggedIn, role: role } if loggedIn
    next()
  app.use('/api', authRouter)
  app.use('/api/user', userRouter)
  app.use (err, req, res, next) -> res.status(500).json({ message: err.message })
  app


# chai-http rejects on 4xx/5xx; these tests assert on error responses, so always resolve with the response.
wrap = (req) ->
  send: (body) -> wrap(req.send(body))
  then: (ok, fail) ->
    new Promise((resolve) -> req.end (err, res) -> resolve(err?.response or res)).then(ok, fail)

request = (app) ->
  agent = chai.request(app)
  get:    (path) -> wrap(agent.get(path))
  post:   (path) -> wrap(agent.post(path))
  put:    (path) -> wrap(agent.put(path))
  delete: (path) -> wrap(agent.delete(path))

describe 'account routes', ->

  beforeEach ->
    users = {}
    saveError = null
    users.u1 = makeUser({})

  describe 'GET /api/token', ->
    it 'returns 401 when not logged in', ->
      request(makeApp(null)).get('/api/token').then (res) ->
        res.status.should.equal 401

    it 'reports no token for a user without one', ->
      request(makeApp('u1')).get('/api/token').then (res) ->
        res.status.should.equal 200
        res.body.should.eql { hasToken: false }

    it 'returns a masked preview and the created date, never the secret', ->
      secret = 'abcd' + '0123456789' + 'wxyz'
      created = new Date('2026-01-02T03:04:05Z')
      users.u1 = makeUser({ apiToken: secret, apiTokenCreatedAt: created })
      request(makeApp('u1')).get('/api/token').then (res) ->
        res.body.hasToken.should.equal true
        res.body.preview.should.equal 'abcd...wxyz'
        new Date(res.body.createdAt).getTime().should.equal created.getTime()
        JSON.stringify(res.body).should.not.contain '0123456789'

    it 'returns a null created date for a token that predates the field', ->
      users.u1 = makeUser({ apiToken: 'abcd1234wxyz' })
      request(makeApp('u1')).get('/api/token').then (res) ->
        res.body.hasToken.should.equal true
        should.equal res.body.createdAt, null

    it 'returns 404 when the session user no longer exists', ->
      request(makeApp('gone')).get('/api/token').then (res) ->
        res.status.should.equal 404

  describe 'POST /api/token', ->
    it 'returns 401 when not logged in', ->
      request(makeApp(null)).post('/api/token').then (res) ->
        res.status.should.equal 401

    it 'stores a new 64 character hex token with its created date and returns it', ->
      request(makeApp('u1')).post('/api/token').then (res) ->
        res.status.should.equal 200
        res.body.apiToken.should.match /^[0-9a-f]{64}$/
        users.u1.apiToken.should.equal res.body.apiToken
        users.u1.apiTokenCreatedAt.should.be.an.instanceof Date

    it 'replaces an existing token', ->
      users.u1 = makeUser({ apiToken: 'old-token' })
      request(makeApp('u1')).post('/api/token').then (res) ->
        users.u1.apiToken.should.not.equal 'old-token'
        users.u1.apiToken.should.equal res.body.apiToken

    it 'passes a save failure to the error handler', ->
      saveError = new Error('db down')
      request(makeApp('u1')).post('/api/token').then (res) ->
        res.status.should.equal 500

  describe 'DELETE /api/token', ->
    it 'returns 401 when not logged in', ->
      request(makeApp(null)).delete('/api/token').then (res) ->
        res.status.should.equal 401

    it 'clears the token and its created date', ->
      users.u1 = makeUser({ apiToken: 'tok', apiTokenCreatedAt: new Date() })
      request(makeApp('u1')).delete('/api/token').then (res) ->
        res.status.should.equal 200
        should.not.exist users.u1.apiToken
        should.not.exist users.u1.apiTokenCreatedAt

  describe 'POST /api/user/change-password', ->
    it 'requires both passwords', ->
      request(makeApp('u1')).post('/api/user/change-password').send({ newPassword: 'secret1' }).then (res) ->
        res.status.should.equal 400

    it 'rejects an SSO account with 400 and leaves the password alone', ->
      users.u1 = makeUser({ has_password: false, password: 'x' })
      request(makeApp('u1')).post('/api/user/change-password')
        .send({ currentPassword: 'a', newPassword: 'secret1' }).then (res) ->
          res.status.should.equal 400
          res.body.error.should.match /SSO/
          users.u1.password.should.equal 'x'

    it 'rejects a wrong current password', ->
      users.u1 = makeUser({ has_password: true, password: bcrypt.hashSync('right', 4) })
      request(makeApp('u1')).post('/api/user/change-password')
        .send({ currentPassword: 'wrong', newPassword: 'secret1' }).then (res) ->
          res.status.should.equal 400
          res.body.error.should.match /incorrect/

    it 'updates the password when the current one matches', ->
      users.u1 = makeUser({ has_password: true, password: bcrypt.hashSync('right', 4) })
      request(makeApp('u1')).post('/api/user/change-password')
        .send({ currentPassword: 'right', newPassword: 'secret1' }).then (res) ->
          res.status.should.equal 200
          users.u1.password.should.equal 'secret1'

    it 'still allows an account whose has_password is not set yet', ->
      users.u1 = makeUser({ password: bcrypt.hashSync('right', 4) })
      request(makeApp('u1')).post('/api/user/change-password')
        .send({ currentPassword: 'right', newPassword: 'secret1' }).then (res) ->
          res.status.should.equal 200

  describe 'PUT /api/user/reset-password/:username', ->
    it 'is admin only', ->
      request(makeApp('u1', 'viewer')).put('/api/user/reset-password/alice').send({ newPassword: 'secret1' }).then (res) ->
        res.status.should.equal 403

    it 'rejects an SSO account with 400', ->
      users.u1 = makeUser({ has_password: false, password: 'x' })
      request(makeApp('admin1', 'admin')).put('/api/user/reset-password/alice').send({ newPassword: 'secret1' }).then (res) ->
        res.status.should.equal 400
        users.u1.password.should.equal 'x'

    it 'resets the password of a local account', ->
      users.u1 = makeUser({ has_password: true, password: 'x' })
      request(makeApp('admin1', 'admin')).put('/api/user/reset-password/alice').send({ newPassword: 'secret1' }).then (res) ->
        res.status.should.equal 200
        users.u1.password.should.equal 'secret1'

    it 'returns 404 for an unknown user', ->
      request(makeApp('admin1', 'admin')).put('/api/user/reset-password/nobody').send({ newPassword: 'secret1' }).then (res) ->
        res.status.should.equal 404
