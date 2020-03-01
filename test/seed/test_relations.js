#!/usr/bin/env node
var moment = require("moment");
var relations = [
  {
    uid: "165425",
    product: "SeedProduct",
    type: "UI",
    components: {
      name: "com.company.test.component.a"
    },
    teams: [{ name: "Alpha" }, { name: "Beta" }],
    tags: [{ name: "Tag1" }, { name: "Tag2" }],
    comments: [
      {
        user: "Super user",
        message: "this is just a message from investigated test.",
        time: moment()
          .add(4, "hour")
          .format()
      },
      {
        user: "Super user2",
        message: "this is just another message from investigated test.",
        time: moment()
          .add(4, "hour")
          .format()
      }
    ]
  },
  {
    uid: "165426",
    product: "SeedProduct",
    type: "API",
    components: {
      name: "com.company.test.component.b"
    },
    teams: [{ name: "XTeam" }, { name: "Beta" }],
    tags: [{ name: "Tag3" }, { name: "Tag2" }],
    file: 'somefile.rb',
    path: 'C:/aaaa/b bb/cccc/ddd eeee/asd-a',
    comments: [
      {
        user: "Super user",
        message: "this is just a message from investigated test.",
        time: moment()
          .add(4, "hour")
          .format()
      },
      {
        user: "Super user2",
        message: "this is just another message from investigated test.",
        time: moment()
          .add(4, "hour")
          .format()
      }
    ]
  }
];
module.exports = relations;
