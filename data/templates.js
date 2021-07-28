templates = [{
    "is_public": true,
    "widgets": [
      {
        "cols": 5,
        "rows": 1,
        "y": 2,
        "x": 0,
        "minItemCols": 3,
        "maxItemRows": 2,
        "type": "STATUS_PIE_ADVANCE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "RERUN_PASS": false,
            "RERUN_FAIL": false,
            "RERUN_SKIP": false,
            "RERUN_KI": false
          }
        },
        "name": "Status"
      },
      {
        "name": "ureport_anchor",
        "cols": 10,
        "rows": 1,
        "y": 19,
        "x": 0,
        "dragEnabled": false,
        "resizeEnabled": false
      },
      {
        "name": "Investigated Test Status",
        "cols": 5,
        "rows": 1,
        "y": 2,
        "x": 5,
        "minItemCols": 3,
        "maxItemRows": 2,
        "type": "INVESTIGATED_TEST_STATUS_PIE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Builds in Calendar",
        "cols": 10,
        "rows": 4,
        "y": 5,
        "x": 0,
        "minItemCols": 5,
        "minItemRows": 4,
        "maxItemArea": 40,
        "type": "BUILD_CALENDAR",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Run History",
        "cols": 5,
        "rows": 2,
        "y": 3,
        "x": 0,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "BUILD_HISTORY_BAR",
        "xaixs": "Build Number",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Pass Rate",
        "cols": 5,
        "rows": 2,
        "y": 3,
        "x": 5,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "PASSRATE_LINE",
        "xaixs": "Build Number",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Multiple Product Line Build Table",
        "cols": 10,
        "rows": 2,
        "y": 0,
        "x": 0,
        "minItemCols": 4,
        "minItemRows": 2,
        "maxItemArea": 50,
        "type": "MPL_BUILD_TABLE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      }
    ],
    "name": "UReport - The Essential",
    "description": "The basic dashboard contains day to day widgets to show the project status",
    "user": "608f72cfbde204263332366a"
  },{
    "is_public": true,
    "widgets": [
      {
        "name": "ureport_anchor",
        "cols": 10,
        "rows": 1,
        "y": 19,
        "x": 0,
        "dragEnabled": false,
        "resizeEnabled": false
      },
      {
        "name": "Unstable Tests List",
        "cols": 5,
        "rows": 3,
        "y": 0,
        "x": 0,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "UNSTABLE_TESTS_TABLE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Stable Tests List",
        "cols": 5,
        "rows": 3,
        "y": 0,
        "x": 5,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "STABLE_TESTS_TABLE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Most Failed Reasons",
        "cols": 10,
        "rows": 2,
        "y": 3,
        "x": 0,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "MOST_FAILREASON_TABLE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      }
    ],
    "name": "UReport - All About Tests",
    "description": "Tests pass/fail trends, failure reasons in tables",
    "user":"608f72cfbde204263332366a"
  },{
    "is_public": true,
    "widgets": [
      {
        "name": "ureport_anchor",
        "cols": 10,
        "rows": 1,
        "y": 19,
        "x": 0,
        "dragEnabled": false,
        "resizeEnabled": false
      },
      {
        "name": "Builds Summary",
        "cols": 5,
        "rows": 3,
        "y": 0,
        "x": 0,
        "minItemCols": 5,
        "type": "BUILD_SUMMARY_CARD",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Tests Summary",
        "cols": 5,
        "rows": 3,
        "y": 0,
        "x": 5,
        "minItemCols": 5,
        "type": "STATUS_SUMMARY_CARD",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Investigated Tests Summary",
        "cols": 10,
        "rows": 2,
        "y": 3,
        "x": 0,
        "minItemCols": 5,
        "type": "INVESTIGATED_SUMMARY_CARD",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      }
    ],
    "name": "UReport - Summary",
    "description": "Summary of builds, tests, and investigated tests in cards view",
    "user": "608f72cfbde204263332366a"
  },{
    "is_public": true,
    "widgets": [
      {
        "name": "ureport_anchor",
        "cols": 10,
        "rows": 1,
        "y": 19,
        "x": 0,
        "dragEnabled": false,
        "resizeEnabled": false
      },
      {
        "name": "Test Relation From Latest Run",
        "cols": 6,
        "rows": 2,
        "y": 0,
        "x": 0,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "RELATIONS_GROUP_BY_BAR",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          },
          "groupByRelation": "components"
        }
      },
      {
        "name": "Advance Status",
        "cols": 4,
        "rows": 1,
        "y": 0,
        "x": 6,
        "minItemCols": 3,
        "maxItemRows": 2,
        "type": "STATUS_PIE_ADVANCE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Investigated Test Status",
        "cols": 4,
        "rows": 1,
        "y": 1,
        "x": 6,
        "minItemCols": 3,
        "maxItemRows": 2,
        "type": "INVESTIGATED_TEST_STATUS_PIE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          }
        }
      },
      {
        "name": "Test Relation Heatmap",
        "cols": 10,
        "rows": 5,
        "y": 2,
        "x": 0,
        "minItemCols": 4,
        "minItemRows": 4,
        "maxItemArea": 60,
        "type": "HEATMAP_TEST_RELATION",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false,
            "out": false,
            "not_pass": false
          },
          "groupByRelation": "components"
        }
      }
    ],
    "name": "UReport - Relations",
    "description": "Detail view of the default relations of selected product line",
    "user":  "608f72cfbde204263332366a"
  }]

module.exports = templates