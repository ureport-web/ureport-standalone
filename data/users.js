users = [{
    _id: "608f72cfbde204263332366a",
    username : "admin",
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password : process.env.ADMIN_PASSWORD || "changeme",
    settings : {
        language : "en",
        theme : {
            name : "slate",
            type : "dark"
        },
        dashboard : {
            isShowWidgetBorder : false,
            isExpandMenu: false,
            isWidgetBarOnHover : true
        },
        report: {
            "assignmentRI": 30,
            "displaySelfAN": false,
            "displaySearchAndFilterBoxInStep": true
        }
    },
    role : "admin",
    position : ""
}, {
    _id: "608f72cfbde204263332366b",
    username : "demo",
    email:"demo@demo.com",
    password : process.env.DEMO_PASSWORD || "1234",
    settings : {
        language : "en",
        theme : {
            name : "slate",
            type : "dark"
        },
        dashboard : {
            isShowWidgetBorder : false,
            isExpandMenu: false,
            isWidgetBarOnHover : true
        },
        report: {
            "assignmentRI": 30,
            "displaySelfAN": false,
            "displaySearchAndFilterBoxInStep": true
        }
    },
    role : "viewer",
    position : ""
}, {
    _id: "608f72cfbde204263332366c",
    username : "operator",
    email: process.env.OPERATOR_EMAIL || "operator@example.com",
    password : process.env.OPERATOR_PASSWORD || process.env.ADMIN_PASSWORD || "changeme",
    settings : {
        language : "en",
        theme : {
            name : "slate",
            type : "dark"
        },
        dashboard : {
            isShowWidgetBorder : false,
            isExpandMenu: false,
            isWidgetBarOnHover : true
        },
        report: {
            "assignmentRI": 30,
            "displaySelfAN": false,
            "displaySearchAndFilterBoxInStep": true
        }
    },
    role : "operator",
    position : ""
}]

module.exports = users