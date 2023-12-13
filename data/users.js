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
            assignmentRI: 30,
            displaySelfAN: false,
            displaySearchAndFilterBoxInStep: true,
            generalConfig: {
                TABLE_IS_DISPLAY_START_TIME: true,
                TABLE_IS_DISPLAY_FILE: true,
                TABLE_IS_DISPLAY_RELATION: true,
                TABLE_IS_DISPLAY_DURATION: true,
                TABLE_IS_DISPLAY_BROWSER: false,
                TABLE_IS_DISPLAY_DEVICE: false,
                TABLE_IS_DISPLAY_FULL_TEST_NAME: false
            }
        }
    },
    role : "admin",
    position : "",
    displayname: "admin"
}]

module.exports = users