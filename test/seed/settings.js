#!/usr/bin/env node
var settings = [{ 
    'type': 'API',
    'product': 'ProductA',
    "issue_type" : [ 
      {
          "label" : "Defect",
          "icon" : "icofont icofont-bug",
          "key" : "Defect",
          "color" : "#ff8282"
      }, 
      {
          "label" : "Automation Maintenance",
          "icon" : "icofont icofont-automation",
          "key" : "Automation",
          "color" : "#a74fff"
      }, 
      {
          "label" : "Feature Change",
          "icon" : "icofont icofont-certificate",
          "key" : "Feature Change",
          "color" : "#4f7bff"
      }, 
      {
          "label" : "Intermittent",
          "icon" : "icofont icofont-random",
          "key" : "Inter",
          "color" : "#4fd3ff"
      }, 
      {
          "label" : "System",
          "icon" : "icofont icofont-laptop",
          "key" : "System",
          "color" : "#ff4fa7"
      }, 
      {
          "label" : "Performance",
          "icon" : "icofont icofont-dashboard",
          "key" : "Performance",
          "color" : "#ffff4f"
      }
    ],
    'product_line': []
  },
  { 'type': 'UI',
    'product': 'ProductB',
    "issue_type" : [ 
      {
          "label" : "Defect",
          "icon" : "icofont icofont-bug",
          "key" : "Defect",
          "color" : "#ff8282"
      }, 
      {
          "label" : "Automation Maintenance",
          "icon" : "icofont icofont-automation",
          "key" : "Automation",
          "color" : "#a74fff"
      }, 
      {
          "label" : "Feature Change",
          "icon" : "icofont icofont-certificate",
          "key" : "Feature Change",
          "color" : "#4f7bff"
      }, 
      {
          "label" : "Intermittent",
          "icon" : "icofont icofont-random",
          "key" : "Inter",
          "color" : "#4fd3ff"
      }, 
      {
          "label" : "System",
          "icon" : "icofont icofont-laptop",
          "key" : "System",
          "color" : "#ff4fa7"
      }
    ],
    'product_line': []
  }
]
module.exports = settings
