var setting = {
    relations_filter: [
      "components",
      "teams",
      "tags"
    ],
    custom_execution_script: [],
    investigated_setting: {
      sharePL: [],
      customize_state: [
        {
          _id: "6578c9ed951a5a1f4c2f9640",
          label: "Start Investigating",
          key: "SI",
          color: "#7fe2d0",
          ttl: 7
        },
        {
          _id: "6578c9ed951a5a1f4c2f9641",
          label: "Waiting for info",
          key: "WFI",
          color: "#c8e29a",
          ttl: 15
        }
      ]
    },
    issue_type: [
      {
        label: "Defect",
        icon: "icofont icofont-bug",
        key: "Defect",
        color: "#ff8282"
      },
      {
        label: "Automation Issue",
        icon: "fas fa-wrench",
        key: "Automation",
        color: "#a74fff"
      },
      {
        label: "Feature Change",
        icon: "icofont icofont-certificate",
        key: "Feature Change",
        color: "#4f7bff"
      },
      {
        label: "Intermittent",
        icon: "icofont icofont-random",
        key: "Inter",
        color: "#4fd3ff"
      }
    ],
    product: "uReport",
    type: "UI Regression",
    product_line: {}
}
module.exports = setting