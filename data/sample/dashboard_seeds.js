
var dashboards = [{
    "is_public": false,
    "widgets": [
      {
        "name": "Desktop Pass Rate",
        "cols": 5,
        "rows": 3,
        "y": 4,
        "x": 0,
        "minItemCols": 4,
        "minItemRows": 2,
        "type": "MPL_PASSRATE_LINE",
        "legendEnabled": true,
        "xaixs": "Start Date",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          }
        },
        "multi_query": [
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Firefox",
            "team": "Team A",
            "device": "Desktop",
            "platform": "Windows",
            "platform_version": "10",
            "stage": "dev"
          },
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Safari",
            "team": "Team A",
            "device": "Desktop",
            "platform": "Windows",
            "platform_version": "10",
            "stage": "dev"
          }
        ],
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        },
        "chartConfig": {
          "customize_axis": "Start Date"
        }
      },
      {
        "name": "Desktop builds",
        "cols": 10,
        "rows": 4,
        "y": 7,
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
            "ki": false
          }
        },
        "multi_query": [
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Firefox",
            "team": "Team A",
            "device": "Desktop",
            "platform": "Windows",
            "platform_version": "10",
            "stage": "dev"
          },
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Safari",
            "team": "Team A",
            "device": "Desktop",
            "platform": "Windows",
            "platform_version": "10",
            "stage": "dev"
          }
        ],
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        }
      },
      {
        "name": "Mobile Pass Rate",
        "cols": 5,
        "rows": 3,
        "y": 4,
        "x": 5,
        "minItemCols": 4,
        "minItemRows": 2,
        "type": "MPL_PASSRATE_LINE",
        "legendEnabled": true,
        "xaixs": "Start Date",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          }
        },
        "multi_query": [
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Chrome",
            "team": "Team A",
            "device": "Pixel 7 Pro",
            "platform": "Android",
            "platform_version": "14.0",
            "stage": "dev"
          },
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Chrome",
            "team": "Team A",
            "device": "iPad",
            "platform": "iOS",
            "platform_version": "16",
            "stage": "dev"
          }
        ],
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "iPhone"
          ],
          "platform": [
            "iOS"
          ],
          "platform_version": [
            "16"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        },
        "chartConfig": {
          "customize_axis": "Start Date"
        }
      },
      {
        "name": "Test Relation From Latest Run",
        "cols": 4,
        "rows": 2,
        "y": 12,
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
            "ki": false
          },
          "groupByRelation": "components"
        },
        "chartConfig": {
          "direction": "Vertical"
        },
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        }
      },
      {
        "name": "Test Relation Heatmap",
        "cols": 6,
        "rows": 4,
        "y": 12,
        "x": 4,
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
            "ki": false
          },
          "groupByRelation": "components"
        },
        "xaixs": "Build Number",
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        }
      },
      {
        "name": "Test Relation From Latest Run",
        "cols": 4,
        "rows": 2,
        "y": 14,
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
            "ki": false
          },
          "groupByRelation": "tags"
        },
        "chartConfig": {
          "direction": "Vertical"
        },
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        }
      },
      {
        "name": "Title Separator",
        "cols": 10,
        "rows": 1,
        "y": 0,
        "x": 0,
        "minItemCols": 10,
        "maxItemCols": 10,
        "maxItemRows": 1,
        "resizeEnabled": false,
        "type": "TITLE_SEPARATOR",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "decorConfig": {
          "decorTitle": "Status Overview",
          "decorDescription": "View all product lane information in table and pass rate in line chart",
          "decorColor": "#007bff"
        }
      },
      {
        "name": "Latest status for Desktop & Mobile",
        "cols": 10,
        "rows": 3,
        "y": 1,
        "x": 0,
        "minItemCols": 4,
        "minItemRows": 2,
        "maxItemArea": 80,
        "type": "MPL_BUILD_TABLE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          }
        },
        "multi_query": [
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Firefox",
            "team": "Team A",
            "device": "Desktop",
            "platform": "Windows",
            "platform_version": "10",
            "stage": "dev"
          },
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Safari",
            "team": "Team A",
            "device": "Desktop",
            "platform": "Windows",
            "platform_version": "10",
            "stage": "dev"
          },
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Chrome",
            "team": "Team A",
            "device": "iPad",
            "platform": "iOS",
            "platform_version": "16",
            "stage": "dev"
          },
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Chrome",
            "team": "Team A",
            "device": "Pixel 7 Pro",
            "platform": "Android",
            "platform_version": "14.0",
            "stage": "dev"
          },
          {
            "is_archive": false,
            "product": "uReport",
            "type": "UI Regression",
            "range": 20,
            "browser": "Chrome",
            "team": "Team A",
            "device": "iPhone",
            "platform": "iOS",
            "platform_version": "16",
            "stage": "dev"
          }
        ],
        "chartConfig": {
          "aggregationEnabled": false
        },
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        }
      },
      {
        "name": "Test Relation Treemap",
        "cols": 10,
        "rows": 4,
        "y": 16,
        "x": 0,
        "minItemCols": 4,
        "minItemRows": 4,
        "maxItemArea": 60,
        "type": "TREEMAP_TEST_RELATION",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "product_line_query": {
          "team": [
            "Team A"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 20,
          "query_type": "FILTER"
        }
      },
      {
        "name": "Title Separator",
        "cols": 10,
        "rows": 1,
        "y": 11,
        "x": 0,
        "minItemCols": 10,
        "maxItemCols": 10,
        "maxItemRows": 1,
        "resizeEnabled": false,
        "type": "TITLE_SEPARATOR",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "decorConfig": {
          "decorTitle": "Latest Relation Overview in Windows Chrome",
          "decorDescription": "Display different kind of relations",
          "decorColor": "#ffc500"
        }
      }
    ],
    "name": "Team A Daily Dashboard",
    "description": "",
    "default_template": null,
    "user": {
      "$oid": "608f72cfbde204263332366a"
    },
    "created_at": {
      "$date": "2023-12-11T20:03:49.565Z"
    },
    "__v": 0
},
{
    "is_public": false,
    "widgets": [
      {
        "name": "Run History",
        "cols": 6,
        "rows": 2,
        "y": 3,
        "x": 0,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "BUILD_HISTORY_BAR",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "chartConfig": {
          "customize_axis": "Start Date",
          "direction": "Vertical",
          "aggregationEnabled": false
        },
        "product_line_query": {
          "team": [
            "Team B"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 1000,
          "date_range": {
            "start_date": "2023-10-09",
            "end_date": "forever",
            "repeat": "weekly",
            "frequency": 2,
            "end_date_type": "forever"
          },
          "query_type": "FILTER"
        }
      },
      {
        "name": "Advance Status",
        "cols": 5,
        "rows": 2,
        "y": 1,
        "x": 0,
        "minItemCols": 3,
        "type": "STATUS_PIE_ADVANCE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "chartConfig": {
          "aggregationEnabled": false
        },
        "product_line_query": {
          "team": [
            "Team B"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 1000,
          "date_range": {
            "start_date": "2023-10-09",
            "end_date": "forever",
            "repeat": "weekly",
            "frequency": 2,
            "end_date_type": "forever"
          },
          "query_type": "FILTER"
        }
      },
      {
        "name": "Pass Rate",
        "cols": 6,
        "rows": 2,
        "y": 5,
        "x": 0,
        "minItemCols": 3,
        "minItemRows": 2,
        "type": "PASSRATE_LINE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "chartConfig": {
          "customize_axis": "Start Date"
        },
        "product_line_query": {
          "team": [
            "Team B"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 1000,
          "date_range": {
            "start_date": "2023-10-09",
            "end_date": "forever",
            "repeat": "weekly",
            "frequency": 2,
            "end_date_type": "forever"
          },
          "query_type": "FILTER"
        },
        "xaixs": "Build Number"
      },
      {
        "name": "Investigated Test Status",
        "cols": 5,
        "rows": 2,
        "y": 1,
        "x": 5,
        "minItemCols": 3,
        "type": "INVESTIGATED_TEST_STATUS_PIE",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "chartConfig": {
          "aggregationEnabled": false
        },
        "product_line_query": {
          "team": [
            "Team B"
          ],
          "version": [],
          "browser": [
            "Chrome"
          ],
          "device": [
            "Desktop"
          ],
          "platform": [
            "Windows"
          ],
          "platform_version": [
            "10"
          ],
          "stage": [
            "dev"
          ],
          "product": "uReport",
          "type": "UI Regression",
          "range": 1000,
          "date_range": {
            "start_date": "2023-10-09",
            "end_date": "forever",
            "repeat": "weekly",
            "frequency": 2,
            "end_date_type": "forever"
          },
          "query_type": "FILTER"
        }
      },
      {
        "name": "Title Separator",
        "cols": 10,
        "rows": 1,
        "y": 0,
        "x": 0,
        "minItemCols": 10,
        "maxItemCols": 10,
        "maxItemRows": 1,
        "resizeEnabled": false,
        "type": "TITLE_SEPARATOR",
        "pattern": {
          "status": {
            "all": true,
            "rerun": false,
            "pass": false,
            "fail": false,
            "skip": false,
            "ki": false
          },
          "groupByRelation": "components"
        },
        "decorConfig": {
          "decorTitle": "Two weeks sprint",
          "decorDescription": "Team B is working in a two weeks sprint to reduce the impact of constant requirement changes",
          "decorColor": "#007bff"
        }
      }
    ],
    "name": "Team B Sprint View",
    "description": "",
    "default_template": null,
    "user": {
      "$oid": "608f72cfbde204263332366a"
    },
    "created_at": {
      "$date": "2023-12-11T21:06:28.967Z"
    },
    "__v": 0
  }]

module.exports = dashboards
