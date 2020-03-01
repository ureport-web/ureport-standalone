#!/usr/bin/env node
var moment = require('moment')
var tests = [{
  'uid': '165425',
  'name': 'test some basic function 1',
  'startTime': moment().subtract(1, 'days').format(),
  'endTime': moment().subtract(1, 'days').format(),
  'status': 'FAIL',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
  'uid': '165426',
  'name': 'test some basic function 2',
  'startTime': moment().subtract(1, 'days').format(),
  'endTime': moment().subtract(1, 'days').format(),
  'status': 'WARNING',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
  'uid': '165427',
  'name': 'test some basic function 3',
  'startTime': moment().subtract(1, 'days').format(),
  'endTime': moment().subtract(1, 'days').format(),
  'status': 'PASS',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
},
{
  'uid': '165428',
  'name': 'test some basic function 4',
  'startTime': moment().subtract(1, 'days').format(),
  'endTime': moment().subtract(1, 'days').format(),
  'status': 'SKIP',
  'failure': {
    'reason': 'java.lang.AssertionError: expected [404] but found [200]',
    'stackTrace': 'this is a stack trace',
    'token': '{89=[91], 82=[], 67=[]}'
  },
  'is_rerun': false,
  'info': {
    'description': 'this is the very first basic test',
    'group': 'Integration;Smoke Test'
  }
}]
module.exports = tests
