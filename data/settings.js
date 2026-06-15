setting = {
	"_id": "5e7abc51ad6a4957e9d37b86",
	"name": "SYSTEM_SETTING",
	"analysisSinceDay": 180,
	"advance_analysis_settings": {
		"allow_compare_by_selection": false,
		"default_compare_by": "COMPARE_BY_FAILURE_MESSAGE"
	},
	"issue_tracking": {
	},
	"notification": {
		"email": {}
	},
	"framework_presets": [
		{ "_id": "preset-playwright",  "name": "Playwright",      "extensions": [".ts", ".tsx", ".js"],                   "command": "npx playwright test {file} --grep \"{name}\"" },
		{ "_id": "preset-jest",        "name": "Jest",            "extensions": [".ts", ".tsx", ".js", ".jsx"],           "command": "npx jest {file} -t \"{name}\"" },
		{ "_id": "preset-cypress",     "name": "Cypress",         "extensions": [".ts", ".js", ".cy.ts", ".cy.js"],       "command": "npx cypress run --spec \"{file}\"" },
		{ "_id": "preset-mocha",       "name": "Mocha",           "extensions": [".ts", ".js", ".mjs"],                   "command": "npx mocha {file} --grep \"{name}\"" },
		{ "_id": "preset-wdio",        "name": "WebdriverIO",     "extensions": [".ts", ".js"],                           "command": "npx wdio run wdio.conf.js --spec {file}" },
		{ "_id": "preset-cucumber",    "name": "Cucumber (Java)", "extensions": [".java", ".feature"],                    "command": "mvn test -Dcucumber.filter.tags=\"{name}\"" },
		{ "_id": "preset-pytest",      "name": "pytest",          "extensions": [".py"],                                  "command": "pytest \"{path}::{name}\"" },
		{ "_id": "preset-rspec",       "name": "RSpec",           "extensions": [".rb"],                                  "command": "rspec \"{file}\" -e \"{name}\"" },
		{ "_id": "preset-gotest",      "name": "Go Test",         "extensions": [".go"],                                  "command": "go test ./... -run \"{name}\"" },
		{
			"_id": "preset-testng",
			"name": "TestNG",
			"extensions": [".java", ".xml"],
			"filename": "testng-run.xml",
			"command": "mvn test -DsuiteXmlFile=testng-run.xml",
			"body": "<!DOCTYPE suite SYSTEM \"https://testng.org/testng-1.0.dtd\">\n<suite name=\"Suite\">\n  <test name=\"{name}\">\n    <classes>\n      <class name=\"{path}\">\n        <methods>\n          <include name=\"{name}\"/>\n        </methods>\n      </class>\n    </classes>\n  </test>\n</suite>"
		}
	]
}

module.exports = setting