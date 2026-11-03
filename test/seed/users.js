#!/usr/bin/env node
var users = [{ 
    "username" : "test@test.com",
    "email" : "test@test.com",
    "password" : "password",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate",
            "type" : "dark"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "operator",
    "position" : ""
},{ 
    "username" : "Viewer",
    "email" : "Viewer@test.com",
    "password" : "password",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate",
            "type" : "dark"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "viewer",
    "position" : ""
},{ 
    "username" : "admin@test.com",
    "email" : "admin@test.com",
    "password" : "password",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate",
            "type" : "dark"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "admin",
    "position" : ""
},{ 
    "username" : "ToBeUpdateViewer1",
    "email" : "ToBeUpdateViewer1@test.com",
    "password" : "password",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate",
            "type" : "dark"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "viewer",
    "position" : ""
},{ 
    "username" : "ToBeUpdateViewer2",
    "email" : "ToBeUpdateViewer2@test.com",
    "password" : "password",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate",
            "type" : "dark"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "operator",
    "position" : ""
},{ 
    "username" : "ToBeUpdateViewer3",
    "email" : "ToBeUpdateViewer3@test.com",
    "password" : "password",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate1",
            "type" : "dark1"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "viewer",
    "position" : ""
},{ 
    "username" : "ToBeUpdatePreference",
    "email" : "ToBeUpdatePreference@test.com",
    "password" : "password",
    "settings" : {
        "language" : "en",
        "theme" : {
            "name" : "slate",
            "type" : "dark"
        },
        "dashboard" : {},
        "report": {}
    },
    "role" : "viewer",
    "position" : ""
}
]
module.exports = users
