#!/usr/bin/env node
var moment = require('moment')
var tests = [{
  'uid': '165425',
  'product': 'SeedProduct',
  'type': 'UI',
  'caused_by': 'maintenance',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'comments': [{
    'user': 'Super user',
    'message': 'this is just a message from investigated test.',
    'time': moment().add(4, 'hour').format()
  }]
},
{
  'uid': '165425',
  'product': 'SeedProductPermission',
  'type': 'UI',
  'caused_by': 'maintenance',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'comments': [{
    'user': 'Super user',
    'message': 'this is just a message from investigated test.',
    'time': moment().add(4, 'hour').format()
  }]
}]
module.exports = tests
