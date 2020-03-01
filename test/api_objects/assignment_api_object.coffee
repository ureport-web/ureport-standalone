chai = require('chai')
endpoint = '/api/assignment'

module.exports = {
  getByUser : (server, cookies, userId, expectStatus, cb) ->
    req = chai.request(server).get(endpoint+"/my/"+userId)
    req.cookies = cookies;
    req.end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

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

  unassign : (server, cookies, path, payload, expectStatus, cb) ->
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

  addComment : (server, path, payload, expectStatus, cb) ->
    chai.request(server)
    .post(endpoint + "/comment/" + path)
    .send(payload)
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)
}
