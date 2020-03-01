#!/usr/bin/env node
var moment = require('moment')
var dashboards = [{ 
    "name": "My new dashboard from operator",
    "widgets": [{
      "name": "someName",
      "fcasdhf": "asdfasdfasdf",
      "type": "asdfasdfasdf",
      "cols": 1, "rows": 1, "y": 11, "x": 8, "dragEnabled": false, "resizeEnabled": false,
      "pattern": {
        "status": {
          "all": true,
          "rerun": false,
          "pass": false,
          "fail": false,
          "skip": false,
          "ki": false
        },
        "relations" : {},
      },
      "status": {"name" : "AAAAA"}
    }]
  },{ 
    "name": "My Dashboards Update from admin",
    "widgets": [{
      "name": "someName",
      "fcasdhf": "asdfasdfasdf",
      "type": "asdfasdfasdf",
      "cols": 1, "rows": 1, "y": 11, "x": 8, "dragEnabled": false, "resizeEnabled": false,
      "pattern": {
        "status": {
          "all": true,
          "rerun": false,
          "pass": false,
          "fail": false,
          "skip": false,
          "ki": false
        },
        "relations" : {},
      },
      "status": {"name" : "AAAAA"}
    }]
  }
]
module.exports = dashboards
