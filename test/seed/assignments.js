#!/usr/bin/env node
var moment = require('moment')
var assignments = [{ 
    'type': 'API',
    'product': 'ProductSameToken',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED11",
    'user': "5c7e06d76525937d6d7389ef",
    'assign_at': moment().subtract(2, 'days').format(),
    'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[]}'
    }
  },{ 
    'type': 'API',
    'product': 'ProductSameFailure',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED11",
    'user': "5c7e06d76525937d6d7389ef",
    'assign_at': moment().subtract(1, 'days').format(),
    'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': null
    },    
    "comments" : [ 
      {
          "user" : "admin",
          "time" : "2019-10-18T02:51:47.520Z",
          "message" : "1"
      }, 
      {
          "user" : "admin",
          "time" : "2019-10-18T02:51:50.041Z",
          "message" : "2"
      }
    ]
  },{ 
    'type': 'API',
    'product': 'ProductA',
    'uid': "11111",
    'state': 'CLOSE',
    'username': "DATA_SEED11",
    'user': "5c6e06d76525937d6d7389ef",
    'assign_at': moment().subtract(61, 'days').format(),
    'failure': {
        'reason': '11java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[1]}'
    }
  },{ 
    'type': 'API',
    'product': 'ProductA',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED11",
    'user': "5c6e06d76525937d6d7389ef",
    'assign_at': moment().subtract(3, 'hour').format(),
    'failure': {
        'reason': '11java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[1]}'
    }
  },{ 
    'type': 'API',
    'product': 'ProductA',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED12",
    'user': "5c6e06d76525937d6d7389ef",
    'assign_at': moment().subtract(2, 'hour').format(),
    'failure': {
        'reason': '11java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[1]}'
    }
  },{ 
    'type': 'API',
    'product': 'ProductA',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED13",
    'user': "5c6e06d76525937d6d7389ef",
    'assign_at': moment().subtract(1, 'hour').format(),
    'failure': {
        'reason': '11java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[1]}'
    }
  },{ 
    'type': 'API',
    'product': 'ProductA',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED14",
    'user': "5c6e06d76525937d6d7389ef",
    'assign_at': moment().format(),
    'failure': {
        'reason': '11java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[1]}'
    }
  },{ 
    'type': 'API',
    'product': 'ProductA',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED15",
    'assign_at': moment().add(1, 'minute').format(),
    'user': "5c6e06d76525937d6d7389ef",
    'failure': {
        'reason': '11java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[1]}'
    }
  },{ 
    'type': 'API',
    'product': 'ProductA',
    'uid': "11111",
    'state': 'OPEN',
    'username': "DATA_SEED2",
    'assign_at': moment().add(2, 'hour').format(),
    'user': "5c6e06d76525937d6d7389ef",
    'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace',
        'token': '{89=[91], 82=[], 67=[]}'
    }
  },
  { 'type': 'UI',
    'product': 'ProductB',
    'uid': "22222",
    'state': 'OPEN',
    'username': "DATA_SEED",
    'user': "5c6e06d76525937d6d7389ef",
    'failure': {
        'reason': 'java.lang.AssertionError: expected [404] but found [200]',
        'stackTrace': 'this is a stack trace'
    }
  }
]
module.exports = assignments
