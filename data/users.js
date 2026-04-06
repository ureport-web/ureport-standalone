users = [{
    _id: "608f72cfbde204263332366a",
    username : "admin",
    email:"replace.your.email@emai.com",
    password : "1234",
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
    password : "1234",
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
}]

module.exports = users