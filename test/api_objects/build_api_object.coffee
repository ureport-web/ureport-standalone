chai = require('chai')
endpoint = '/api/build'

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

  findById : (server, cookies, path, expectStatus, cb) ->
    req = chai.request(server).get(endpoint+"/"+path)
    req.cookies = cookies;
    req.end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  update : (server, cookies, path, payload, expectStatus, cb) ->
    req = chai.request(server).put(endpoint+"/"+path)
    req.cookies = cookies;
    req.send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  updateStatus : (server, cookies, path, payload, expectStatus, cb) ->
    req = chai.request(server).put(endpoint+"/status/"+path)
    req.cookies = cookies;
    req.send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  delete : (server, cookies, path, expectStatus, cb) ->
    req = chai.request(server).delete(endpoint+"/"+path)
    req.cookies = cookies;
    req.end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  filter : (server, cookies, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + "/filter")
    req.cookies = cookies;
    req.send(payload)
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  addOutage : (server, cookies, buidlId, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + "/outage/" + buidlId)
    req.cookies = cookies;
    req.send(payload)
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  addComment : (server, cookies, path, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + "/comment/" + path)
    req.cookies = cookies;
    req.send(payload)
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)
  
  addOutageComment : (server, cookies, path, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + "/outage/comment/" + path)
    req.cookies = cookies;
    req.send(payload)
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  endBatch : (server, cookies, id, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + "/status/calculate/" + id)
    req.cookies = cookies;
    req.send()
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)
}
