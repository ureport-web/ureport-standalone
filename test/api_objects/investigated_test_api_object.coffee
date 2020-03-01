chai = require('chai')
endpoint = '/api/investigated_test'

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

  multiCreate : (server, payload, expectStatus, cb) ->
    chai.request(server)
    .post(endpoint+"/multi")
    .send(payload)
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

  delete : (server, cookies, id, expectStatus, cb) ->
    req = chai.request(server).delete(endpoint+"/"+id)
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

  getByPage : (server, cookies, page, perPage, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + "/" + page + "/"+perPage)
    req.cookies = cookies;

    req.end (err,res) ->
      if err
        err.should.have.status expectStatus
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

}
