chai = require('chai')
endpoint = '/api/test'

module.exports = {
  create : (server, cookies, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint+"/multi")
    req.cookies = cookies;
    # chai.request(server)
    # .post(endpoint+"/multi")
    req.send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  get : (server, path, expectStatus, cb) ->
    chai.request(server)
    .get(endpoint+"/"+path)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  update : (server, path, payload, expectStatus, cb) ->
    chai.request(server)
    .put(endpoint+"/"+path)
    .send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  delete : (server, path, expectStatus, cb) ->
      chai.request(server)
      .delete(endpoint+"/"+path)
      .end (err, res) ->
        if err
          err.should.have.status expectStatus
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
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  addStep : (server, path, payload, expectStatus, cb) ->
    chai.request(server)
    .post(endpoint+"/steps/"+path)
    .send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)
}
