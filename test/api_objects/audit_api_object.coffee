chai = require('chai')
endpoint = '/api/audit'

module.exports = {
  filter : (server, cookies, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + '/filter')
    if cookies
      req.cookies = cookies
    req.send(payload)
    .end (err, res) ->
      if err
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)

  adminFilter : (server, cookies, payload, expectStatus, cb) ->
    req = chai.request(server).post(endpoint + '/admin/filter')
    if cookies
      req.cookies = cookies
    req.send(payload)
    .end (err, res) ->
      if err
        cb(err.response)
      else
        res.should.have.status expectStatus
        cb(res)
}
