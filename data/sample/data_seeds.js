#!/usr/bin/env node
let moment = require('moment')
let mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId;
const product = "uReport"
const type = "UI Regression"

const failuresMsg = [
  "expected false to equal true", 
  "expect a date 10/21/2023 to equal 11/21/2023.", 
  "expect 30 to equal 10",
  "expect 'Item update failed' to contain 'success'"
]
const failuresStack = [
  "AssertionError: expected false to equal true\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70", 
  "AssertionError: expect a date 10/21/2023 to equal 11/21/2023\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70", 
  "AssertionError: expect 30 to equal 10\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70", 
  "AssertionError: expect 'Item update failed' to contain 'success'\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70", 

]
const teamA = [{ name: "Team A" }]
const teamB = [{ name: "Team B" }]
const componentsA = ['login','search','createTask']
const componentsB = ['filter','permission','updateTask']
const customsA = {
  Partner: [ "Company A", "Company B" ]
}
const customsB = {
  Partner: [ "Company X", "Company Y" ]
}
const tags = [ "Major", "Critical", "Blocker" ]

let rs = []
let tests = []
let relations = []
let investigatedTests = []

let firstBuildIdTeamA
let firstBuildIdTeamB

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTests(build, date, totalTests=30, failPercent = 30, testNamePrefix="1111"){
  /**
   * Test fail with the same reason
   * Test fail with similiar reason
   * Test fail with different reason completely
   * Test skip
   */
  let accumulateTime = 0
  let failureNumber = totalTests * (failPercent/100)
  let status = { 
    total: 0, pass: 0, fail: 0, skip:0, warning: 0
  }
  for (let i = 0; i < totalTests; i++) {
    let start_time = date.add(accumulateTime,'minutes').format()
    accumulateTime += randomInteger(6,8)
    let end_time = date.add(accumulateTime,'minutes').format()

    if(i<=failureNumber){
      let stat = 'FAIL'
      // make the first failure is always the test fail with the same reason
      if(i==0){
        error_message= "Element [id='loginButton] is not found"
        stack_trace= "AssertionError: Element [id='loginButton] is not found\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70"
        status.fail += 1
      }else if(i==1){
        error_message= `expect a date ${date.format()} to equal ${date.add(1,"days").format()}`
        stack_trace= `AssertionError: expect a date ${date.format()} to equal ${date.add(1,"days").format()}\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70`
        status.fail += 1
      }else if(i==2){
        error_message= `${Date.now()} to ${Date.now() + randomInteger(10000,40000)}`
        stack_trace= `AssertionError: ${Date.now()} to ${Date.now() + randomInteger(10000,40000)}\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70`
        status.fail += 1
      }else if(i==4){
        error_message= `expect 2 to equals 1`
        stack_trace= `AssertionError: expect 2 to equals 1\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70`
        status.fail += 1
      }else if(i==5){
        status.skip += 1
        stat = 'SKIP'
        error_message= `Skip test cases due to failure in setup`
      }else{
        var index = randomInteger(0,3)
        error_message= failuresMsg[index]
        stack_trace= failuresStack[index]
        status.fail += 1
      }

      tests.push({
        uid: `${testNamePrefix}${i < 10 ? '0'+i : i}`,
        build,
        name: `Test case name ${testNamePrefix}${i < 10 ? '0'+i : i}`,
        runType: 0,
        status: stat,
        start_time,
        end_time,
        failure: {
          error_message,
          stack_trace
        }
      })
    }else{
      tests.push({
        uid: `${testNamePrefix}${i < 10 ? '0'+i : i}`,
        build,
        name: `Test case name ${testNamePrefix}${i < 10 ? '0'+i : i}`,
        runType: 0,
        status: "PASS",
        start_time,
        end_time,
      })
      status.pass += 1
    }
    status.total += 1
  }
  return status
}

function createRelation(teams, components, customs, tags, totalTests = 30, testNamePrefix="1111"){
  for (let i = 0; i < totalTests; i++) {
    let comp = components[randomInteger(0,2)]
    relations.push({
      product,
      type,
      uid: `${testNamePrefix}${i < 10 ? '0'+i : i}`,
      components: [{ name: comp}],
      customs,
      tags: [{ name: tags[randomInteger(0,2)]}],
      teams,
      file: `test_${comp}.java`,
      path: `\\test\\web\\regression\\${comp}\\`,
    })
  }
}

function createInvestigatedTests(){
  investigatedTests.push({
    uid: "111100",
    caused_by: "Defect",
    comments: [],
    configuration: {
      similarity: {
        value: 100
      }
    },
    create_at: moment().format(),
    failure: {
      error_message: "Element [id='loginButton] is not found",
      stack_trace: "AssertionError: Element [id='loginButton] is not found\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70"
    },
    origin: {
      "test": "657787519f6cb7445417b311",
      "build": firstBuildIdTeamA
    },
    product: "uReport",
    tracking: {
      track_number: "JIRA-001"
    },
    type: "UI Regression",
    user: "608f72cfbde204263332366a"
  })
  //customize state
  investigatedTests.push({
    uid: "111104",
    comments: [],
    configuration: {
      similarity: {
        value: 100
      }
    },
    create_at: moment().format(),
    customize_state: {
      _id: "6578c9ed951a5a1f4c2f9640",
      label: "Start Investigating",
      key: "SI",
      color: "#7fe2d0",
      ttl: 7
    },
    failure: {
      error_message: "expect 2 to equals 1",
      stack_trace: "AssertionError: expect 2 to equals 1\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70"
    },
    origin: {
      build: firstBuildIdTeamA
    },
    product: "uReport",
    tracking: {
      track_number: "JIRA-100"
    },
    type: "UI Regression",
    user: "608f72cfbde204263332366a"
  })
  investigatedTests.push({
    uid: "111101",
    comments: [],
    configuration: {
      similarity: {
        value: 75
      }
    },
    create_at: moment().format(),
    customize_state: {
      _id: "6578c9ed951a5a1f4c2f9641",
      label: "Waiting for info",
      key: "WFI",
      color: "#c8e29a",
      ttl: 15
    },
    failure: {
      error_message: `expect a date ${moment().format()} to equal ${moment().add(1,"days").format()}`,
      stack_trace: `AssertionError: expect a date ${moment().format()} to equal ${moment().add(1,"days").format()}\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70`
    },
    origin: {
      build: firstBuildIdTeamA
    },
    product: "uReport",
    tracking: {
      track_number: "JIRA-200"
    },
    type: "UI Regression",
    user: "608f72cfbde204263332366a"
  })

  // for team B
  investigatedTests.push({
    uid: "222200",
    caused_by: "Defect",
    comments: [],
    configuration: {
      similarity: {
        value: 100
      }
    },
    create_at: moment().format(),
    failure: {
      error_message: "Element [id='loginButton] is not found",
      stack_trace: "AssertionError: Element [id='loginButton] is not found\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70"
    },
    origin: {
      "build": firstBuildIdTeamB
    },
    product: "uReport",
    tracking: {
      track_number: "JIRA-001"
    },
    type: "UI Regression",
    user: "608f72cfbde204263332366a"
  })
  investigatedTests.push({
    uid: "222201",
    caused_by: "Automation Issue",
    comments: [],
    configuration: {
      similarity: {
        value: 75
      }
    },
    create_at: moment().format(),
    failure: {
      error_message: `expect a date ${moment().format()} to equal ${moment().add(1,"days").format()}`,
      stack_trace: `AssertionError: expect a date ${moment().format()} to equal ${moment().add(1,"days").format()}\n    at Function.expectTrue (C:\\framework\\Automation\\src\\lib\\common\\Asserter.ts:9:27)\n    at Context.<anonymous> (C:\\framework\\Automation\\test\\web\\regression\\playlist\\test.test.ts:53:18)\n    at Context.executeSync (C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:56:18)\n    at C:\\framework\\Automation\\node_modules\\@wdio\\sync\\build\\index.js:82:70`
    },
    origin: {
      "build": firstBuildIdTeamB
    },
    product: "uReport",
    tracking: {
      track_number: "JIRA-002"
    },
    type: "UI Regression",
    user: "608f72cfbde204263332366a"
  })
}
//  Product Type Team Browser Device Platform Platform_Version Stage
for (let i = 0; i < 30; i++) {
  // Team A on Desktop Windows 10 chrome
  // take note of first build id
  let start_time1 = moment().subtract(i, 'days')
  let id1 = new ObjectId()
  if(i==0){
    firstBuildIdTeamA = id1
  }
  
  let status1 = createTests(id1,moment().subtract(i, 'days'),30, randomInteger(20,30))
  rs.push({
    _id: id1,
    product,
    type,
    team: "Team A",
    browser: "Chrome",
    device: "Desktop",
    platform: "Windows",
    platform_version:"10",
    stage: "dev",
    build: 1000 - i,
    start_time: start_time1.format(),
	  end_time: start_time1.add(randomInteger(6,8),'hours').format(),
	  owner: "jenkins_admin",
    status: status1,
    comments: [{
      user: 'admin',
      message: 'this is just a message.',
      time: moment().add(4, 'hour').format()
    }]
  })
  
  // Team A on Desktop Windows 10 Stage
  let start_time2 = moment().subtract(i, 'days')
  let id2 = new ObjectId()
  let status2 = createTests(id2,moment().subtract(i, 'days'),30, randomInteger(10,20))
  rs.push({
    _id: id2,
    product,
    type,
    team: "Team A",
    browser: "Chrome",
    device: "Desktop",
    platform: "Windows",
    platform_version:"10",
    stage: "stage",
    build: 500 - i,
    start_time: start_time2.format(),
	  end_time: start_time2.add(randomInteger(6,8),'hours').format(),
	  owner: "jenkins_admin",
    status: status2,
    comments: [{
      user: 'admin',
      message: 'this is just a message.',
      time: moment().add(4, 'hour').format()
    }]
  })
  
  // Team A on desktop windows 10 Firefox
  let start_time4 = moment().subtract(i, 'days')
  let id4 = new ObjectId()
  let status4 = createTests(id4,moment().subtract(i, 'days'),30, randomInteger(10,20))
  rs.push({
    _id: id4,
    product,
    type,
    team: "Team A",
    browser: "Firefox",
    device: "Desktop",
    platform: "Windows",
    platform_version:"10",
    stage: "dev",
    build: 2000 - i,
    start_time: start_time4.format(),
	  end_time: start_time4.add(randomInteger(6,8),'hours').format(),
	  owner: "jenkins_admin",
    status: status4
  })
  
  // Team A on desktop windows 10 Safari
  let start_time5 = moment().subtract(i, 'days')
  let id5 = new ObjectId()
  let status5 = createTests(id5,moment().subtract(i, 'days'),30, randomInteger(10,20))
  rs.push({
    _id: id5,
    product,
    type,
    team: "Team A",
    browser: "Safari",
    device: "Desktop",
    platform: "Windows",
    platform_version:"10",
    stage: "dev",
    build: 3200 - i,
    start_time: start_time5.format(),
	  end_time: start_time5.add(randomInteger(6,8),'hours').format(),
	  owner: "jenkins_admin",
    status: status5
  })
  
  // Team A on iPad MacOs 12.0.0 Chrome
  let start_time6 = moment().subtract(i, 'days')
  let id6 = new ObjectId()
  let status6 = createTests(id6,moment().subtract(i, 'days'),30, randomInteger(10,20))
  rs.push({
    _id: id6,
    product,
    type,
    team: "Team A",
    browser: "Chrome",
    device: "iPad",
    platform: "iOS",
    platform_version:"16",
    stage: "dev",
    build: 700 - i,
    start_time: start_time6.format(),
	  end_time: start_time6.add(randomInteger(6,8),'hours').format(),
	  owner: "jenkins_admin",
    status: status6
  })
  
  // Team A on iPhone MacOs 12.0.0 Chrome
  let start_time7 = moment().subtract(i, 'days')
  let id7 = new ObjectId()
  let status7 = createTests(id7,moment().subtract(i, 'days'),30, randomInteger(10,20))
  rs.push({
    _id: id7,
    product,
    type,
    team: "Team A",
    browser: "Chrome",
    device: "iPhone",
    platform: "iOS",
    platform_version:"16",
    stage: "dev",
    build: 100 - i,
    start_time: start_time7.format(),
	  end_time: start_time7.add(randomInteger(6,8),'hours').format(),
	  owner: "jenkins_admin",
    status: status7
  })
  
  // Team A on pixel Android 14.0 Chrome
  let start_time8 = moment().subtract(i, 'days')
  let id8 = new ObjectId()
  let status8 = createTests(id8,moment().subtract(i, 'days'),30, randomInteger(10,20))
  rs.push({
    _id: id8,
    product,
    type,
    team: "Team A",
    browser: "Chrome",
    device: "Pixel 7 Pro",
    platform: "Android",
    platform_version:"14.0",
    stage: "dev",
    build: 100 - i,
    start_time: start_time8.format(),
	  end_time: start_time8.add(randomInteger(6,8),'hours').format(),
	  owner: "jenkins_admin",
    status: status8
  })
}

// team B for sprint view
for (let i = 0; i < 60; i++) {
  // Team B on desktop windows 10 Chrome
  let start_time = moment().subtract(i, 'days')
  let id3 = new ObjectId()
  if(i==0){
    firstBuildIdTeamB = id3
  }
  let status3 = createTests(id3,moment().subtract(i, 'days'),300, randomInteger(2,5), "2222")
  rs.push({
    _id: id3,
    product,
    type,
    team: "Team B",
    browser: "Chrome",
    device: "Desktop",
    platform: "Windows",
    platform_version:"10",
    stage: "dev",
    build: 300 - i,
    start_time: start_time.format(),
    end_time: start_time.add(randomInteger(6,8),'hours').format(),
    owner: "jenkins_admin",
    status: status3,
    comments: [{
      user: 'admin',
      message: 'this is just a message.',
      time: moment().add(4, 'hour').format()
    }]
  })
}

/**
 * Relations
 */
createRelation(teamA, componentsA, customsA, tags)
createRelation(teamB, componentsB, customsB, tags, 300, "2222")

createInvestigatedTests()

module.exports = { builds : rs, tests, relations, investigatedTests }
