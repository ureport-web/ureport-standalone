chai = require('chai')
endpoint = '/api/user'

module.exports = {
  create : (server, cookies, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint+"/signup")
    req.cookies = cookies;
    req.send(payload)
    .end (err, res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  update : (server, cookies, username, payload, expectStatus, cb) ->
      req = chai.request(server).put(endpoint+"/update/"+username)
      req.cookies = cookies;
      req.send(payload).end (err, res) ->
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

  search : (server, cookies, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + "/search")
    req.cookies = cookies;
    req.send(payload)
    .end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  updatePreference : (server, cookies, payload, expectStatus,type, cb) ->
    req = chai.request(server).post(endpoint + "/preference/update/" + type)
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
