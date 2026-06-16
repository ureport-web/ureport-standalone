server = require('../../app')
auth = require('../api_objects/auth_api_object')
audit = require('../api_objects/audit_api_object')
Audit = require('../../src/models/audit')

chai = require('chai')
chaiHttp = require('chai-http')
should = chai.should()
chai.use chaiHttp

describe 'Audit endpoints', ->

  # ── Auth guard on /api/audit/filter ─────────────────────────────────────────
  describe 'POST /api/audit/filter (now auth-guarded)', ->
    it 'returns 401 when called without a session', (done) ->
      chai.request(server)
        .post('/api/audit/filter')
        .send({ product: 'x', type: 'y', uid: 'z', since: '2020-01-01' })
        .end (err, res) ->
          # middleware redirects to /api/unauthorized (302) or returns 401
          (res.status == 302 or res.status == 401).should.equal true
          done()
      return

  # ── Admin filter — access control ───────────────────────────────────────────
  describe 'POST /api/audit/admin/filter', ->
    viewerCookies = undefined
    adminCookies  = undefined

    before (done) ->
      auth.login server, { username: 'Viewer', password: 'password' }, 200, (res) ->
        viewerCookies = res.headers['set-cookie'].pop().split(';')[0]
        auth.login server, { username: 'admin@test.com', password: 'password' }, 200, (adminRes) ->
          adminCookies = adminRes.headers['set-cookie'].pop().split(';')[0]
          done()
      return

    it 'returns 403 for a viewer', (done) ->
      audit.adminFilter server, viewerCookies, {}, 403, (res) ->
        res.body.error.should.be.a 'string'
        done()
      return

    it 'returns 200 with records/total shape for admin', (done) ->
      audit.adminFilter server, adminCookies, { page: 1, perPage: 10 }, 200, (res) ->
        res.body.should.have.property 'records'
        res.body.should.have.property 'total'
        res.body.records.should.be.an 'array'
        res.body.total.should.be.a 'number'
        done()
      return

    it 'filters by entity_type', (done) ->
      audit.adminFilter server, adminCookies, { entity_type: 'auth', page: 1, perPage: 50 }, 200, (res) ->
        res.body.records.every((r) -> r.entity_type == 'auth').should.equal true
        done()
      return

    it 'respects perPage limit', (done) ->
      audit.adminFilter server, adminCookies, { page: 1, perPage: 2 }, 200, (res) ->
        res.body.records.length.should.be.at.most 2
        done()
      return

  # ── Login audit records ──────────────────────────────────────────────────────
  describe 'Login audit trail', ->
    before (done) ->
      # Attempt bad login — creates LOGIN_FAIL record
      chai.request(server)
        .post('/api/login')
        .send({ username: 'admin@test.com', password: 'wrongpassword' })
        .end (err, res) ->
          # Then successful login — creates LOGIN record
          chai.request(server)
            .post('/api/login')
            .send({ username: 'admin@test.com', password: 'password' })
            .end (err2, res2) ->
              # Give the async audit.save() a moment to complete
              setTimeout done, 150
      return

    it 'creates a LOGIN_FAIL record on bad credentials', (done) ->
      Audit.findOne({ audit_type: 'LOGIN_FAIL', username: 'admin@test.com' })
        .sort({ create_at: -1 })
        .exec (err, record) ->
          should.not.exist err
          should.exist record
          record.entity_type.should.equal 'auth'
          record.product.should.equal 'SYSTEM'
          done()
      return

    it 'creates a LOGIN record on successful login', (done) ->
      Audit.findOne({ audit_type: 'LOGIN', username: 'admin@test.com' })
        .sort({ create_at: -1 })
        .exec (err, record) ->
          should.not.exist err
          should.exist record
          record.entity_type.should.equal 'auth'
          record.product.should.equal 'SYSTEM'
          done()
      return

  # ── Audit record schema fields ───────────────────────────────────────────────
  describe 'Audit model', ->
    it 'saves entity_type and ip fields', (done) ->
      record = new Audit({
        audit_type: 'TEST_AUDIT',
        action: 'Test',
        uid: 'test-uid',
        product: 'TestProduct',
        type: 'TestType',
        entity_type: 'test',
        ip: '127.0.0.1'
      })
      record.save (err, saved) ->
        should.not.exist err
        saved.entity_type.should.equal 'test'
        saved.ip.should.equal '127.0.0.1'
        done()
      return
