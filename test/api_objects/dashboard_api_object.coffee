chai = require('chai')
endpoint = '/api/dashboard'

module.exports = {
  create : (server, cookies, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint+"/")
    req.cookies = cookies;
    req.send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  findById : (server, cookies, id, expectStatus, cb) ->
    req = chai.request(server).get(endpoint+"/"+id)
    req.cookies = cookies;
    req.end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  findByUserId : (server, cookies, userId, expectStatus, cb) ->
    req = chai.request(server).get(endpoint+"/byUser/"+userId)
    req.cookies = cookies;
    req.end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  findShared : (server, cookies, userId, expectStatus, cb) ->
    req = chai.request(server).get(endpoint+"/shared/"+userId)
    req.cookies = cookies;
    req.end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  update : (server, cookies, id, payload, expectStatus, cb) ->
    req = chai.request(server).put(endpoint+"/"+id)
    req.cookies = cookies;
    req.send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  delete : (server, cookies, id, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint+"/"+id)
    req.cookies = cookies;
    req.send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  updateWidget : (server, cookies, id, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint+"/widget/"+id)
    req.cookies = cookies;
    req.send(payload)
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)
}
