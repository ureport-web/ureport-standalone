chai = require('chai')
endpoint = '/api/login'

module.exports = {
  login : (server, payload, expectStatus, cb) ->
    chai.request(server)
    .post(endpoint)
    .send(payload)
    .end (err, res) ->
      if err
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)
}
