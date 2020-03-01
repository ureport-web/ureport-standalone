chai = require('chai')
endpoint = '/api/test_relation'

module.exports = {
  create : (server, payload, expectStatus, cb) ->
    chai.request(server)
    .post(endpoint+"/")
    .send(payload)
    .end (err, res) ->
      if err
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  updateStatus : (server, payload, expectStatus, cb) ->
    chai.request(server)
    .post(endpoint+"/update/attributes")
    .send(payload)
    .end (err, res) ->
      if err
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  get : (server, path, expectStatus, cb) ->
    chai.request(server)
    .get(endpoint+"/"+path)
    .end (err, res) ->
      if err
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  filter : (server, payload, expectStatus, cb) ->
    chai.request(server)
    .post(endpoint + "/filter")
    .send(payload)
    .end (err,res) ->
      if err
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

}
