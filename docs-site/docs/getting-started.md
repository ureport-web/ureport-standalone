---
sidebar_position: 3
title: Getting Started
description: Integrate UReport with Playwright, Jest, Pytest, Mocha, Cypress, or TestNG. Covers reporter install, config options, annotations, steps, and the Raw REST API.
---

# Getting Started

Learn the basics of UReport and how to integrate your test framework.

---

## What is UReport?

UReport is a comprehensive test automation reporting platform that centralizes test execution results from any testing framework. It provides powerful analytics, dashboards, and collaboration tools to help teams understand test patterns and improve quality.

| Feature | Capabilities |
|---|---|
| **Analytics & Reporting** | Interactive dashboards with 10+ widget types; real-time monitoring; historical trend analysis; test behavior pattern detection |
| **Test Investigation** | Advanced failure categorization; similarity matching; outage management; custom states with TTL |
| **Multiple Views** | List, Tree, Timeline views; advanced filtering; split-view test details; cross-environment comparisons |
| **Administration** | Role-based permissions; Product Lane configurations; CSV/PDF export; RESTful API integration |

---

## API Integration

### Playwright Reporter

#### Install

```bash
# npm
npm install --save-dev ureport-playwright-reporter

# yarn
yarn add --dev ureport-playwright-reporter
```

#### Minimal config

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['ureport-playwright-reporter', {
      serverUrl: process.env.UREPORT_SERVER_URL,
      apiToken:  process.env.UREPORT_API_TOKEN,
      product:   'MyProduct',
      type:      'E2E',
      buildNumber: process.env.BUILD_NUMBER,
    }],
  ],
});
```

:::info
Generate your API token: click your avatar → **Edit Profile → API Token → Generate Token**.
:::

#### Configuration options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `serverUrl` | string | Yes | — | Base URL of your UReport server (e.g. `https://ureport.example.com`) |
| `apiToken` | string | Yes | — | API token for authentication |
| `product` | string | Yes | — | Product name (e.g. `"WebPortal"`) |
| `type` | string | Yes | — | Test type / lane (e.g. `"E2E"`, `"UI"`, `"API"`) |
| `buildNumber` | string \| number | No | `Date.now()` | CI build number |
| `team` | string | No | — | Team responsible for the tests |
| `browser` | string | No | — | Browser used (e.g. `"Chrome"`, `"Firefox"`) |
| `device` | string | No | — | Device type (e.g. `"Desktop"`, `"Mobile"`) |
| `platform` | string | No | auto-detected | Operating system (e.g. `"Windows"`, `"macOS"`) |
| `platform_version` | string | No | auto-detected | OS version (e.g. `"macOS-14"`) |
| `stage` | string | No | — | Environment stage (e.g. `"Staging"`, `"Production"`) |
| `version` | string | No | — | Application version (e.g. `"1.2.3"`) |
| `batchSize` | number | No | 50 | Tests submitted per API call |
| `includeSteps` | boolean | No | true | Include test steps in submission |
| `includeScreenshots` | boolean | No | true | Attach screenshots to failed steps |
| `stepsOnFailOnly` | boolean | No | true | Only send step detail for failed/timedOut tests |
| `autoToken` | boolean | No | true | Auto-derive `failure.token` from first user-code frame in stack trace (format: `"path/to/file.spec.ts:line"`) |
| `saveRelations` | boolean | No | true | Save test relation records (tags, components, teams) after the run |
| `quickInfoAnnotations` | string[] | No | `[]` | Annotation types stored as quickInfo key/value pairs (execution-specific, never saved to relations) |
| `autoDetectPlatform` | boolean | No | true | Auto-detect OS platform and version. Set to `false` to suppress. |
| `outputFile` | string | No | — | Write full submitted payload to a JSON file (useful for debugging) |
| `testTransform` | function | No | — | Per-test transform: return `name` to override display name and UID (the `ureport-uid` annotation takes precedence if set), return `relations` to inject custom key/value pairs into customs |
| `customParams` | Record\<string, string\> | No | — | Custom build parameters stored as `extras` in the build payload (e.g. `{ region: 'us-east-1' }`) |

#### Annotating tests

```typescript
// Stable UID (recommended)
test('user can log in', async ({ page }) => {
  test.info().annotations.push({ type: 'ureport-uid', description: 'auth-login-001' });
  // ... test steps
});
```

:::warning
Always set a `ureport-uid` annotation. Without it, the reporter falls back to the test title as the uid — which breaks tracking if you ever rename the test.
:::

```typescript
// Relations — components, teams, tags
test.info().annotations.push({ type: 'components', description: 'Auth' });
test.info().annotations.push({ type: 'teams',      description: 'Frontend' });
test.info().annotations.push({ type: 'tags',       description: 'smoke' });
```

:::note
`components` and `teams` are arrays — push multiple annotations of the same type to add multiple values. All other annotation types are treated as single string values.
:::

```typescript
// quickInfo — execution-specific metadata
// In playwright.config.ts: quickInfoAnnotations: ['env', 'run_url']

test.info().annotations.push({ type: 'env',     description: 'staging' });
test.info().annotations.push({ type: 'run_url', description: 'https://ci.example.com/runs/42' });
```

:::tip
Use `quickInfoAnnotations` for values that change every run (environment URLs, run IDs). These are stored on the test result but never saved to the test relation record, keeping your relation filters clean.
:::

#### Steps and attachments

Use Playwright's `test.info().attach()` API inside a `test.step()` to attach structured content. UReport reads the `contentType` and renders the appropriate format toggle in the Steps tab.

```typescript
// JSON body
test('login API returns token', async ({ request }) => {
  test.info().annotations.push({ type: 'ureport-uid', description: 'auth-login-api-001' });

  const response = await request.post('/api/login', {
    data: { username: 'alice', password: 'secret' },
  });

  await test.step('POST /api/login', async () => {
    await test.info().attach('response-body', {
      body: await response.text(),
      contentType: 'application/json',
    });
    expect(response.ok()).toBeTruthy();
  });
});
```

```typescript
// curl command
await test.step('POST /api/login', async () => {
  await test.info().attach('request-curl', {
    body: `curl -X POST https://api.example.com/api/login -H 'Content-Type: application/json' -d '{"username":"alice","password":"secret"}'`,
    contentType: 'text/x-curl',
  });
});
```

```typescript
// XML response
await test.step('Parse SOAP response', async () => {
  await test.info().attach('soap-response', {
    body: `<?xml version="1.0"?><root><status>OK</status></root>`,
    contentType: 'application/xml',
  });
});
```

```typescript
// Plain text
await test.step('Check log output', async () => {
  await test.info().attach('server-log', {
    body: 'INFO: user alice logged in at 2024-01-15T10:30:00Z',
    contentType: 'text/plain',
  });
});
```

Supported MIME types:

| `contentType` | UReport view formats |
|---|---|
| `application/json` | JSON, XML |
| `application/xml` / `text/xml` | XML |
| `text/x-curl` | curl, text |
| `text/plain` | text |

:::note
Only the first content attachment per step is captured. Screenshots and content attachments are independent — a single step can have both. Wrap your `attach()` calls inside `test.step()` for cleaner step-level context in UReport.
:::

---

### Jest Reporter

#### Install

```bash
# npm
npm install --save-dev ureport-jest-reporter

# yarn
yarn add --dev ureport-jest-reporter
```

#### Minimal config

```javascript
// jest.config.js
module.exports = {
  reporters: [
    'default',
    ['ureport-jest-reporter', {
      serverUrl: process.env.UREPORT_SERVER_URL,
      apiToken:  process.env.UREPORT_API_TOKEN,
      product:   'MyProduct',
      type:      'E2E',
      buildNumber: process.env.BUILD_NUMBER,
    }],
  ],
};
```

#### Configuration options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `serverUrl` | string | Yes | — | Base URL of your UReport server |
| `apiToken` | string | Yes | — | API token for authentication |
| `product` | string | Yes | — | Product name |
| `type` | string | Yes | — | Test type / lane (e.g. `"Unit"`, `"Integration"`) |
| `buildNumber` | string \| number | No | `Date.now()` | CI build number |
| `team` | string | No | — | Team responsible for the tests |
| `browser` | string | No | — | Browser used (if applicable) |
| `device` | string | No | — | Device type (if applicable) |
| `platform` | string | No | auto-detected | Operating system (e.g. `"linux"`, `"darwin"`) |
| `platform_version` | string | No | auto-detected | OS version |
| `stage` | string | No | — | Environment stage |
| `version` | string | No | — | Application version |
| `batchSize` | number | No | 50 | Tests submitted per API call |
| `saveRelations` | boolean | No | true | Save test relation records after the run |
| `autoDetectPlatform` | boolean | No | true | Auto-detect OS platform and version |
| `quickInfoAnnotations` | string[] | No | `[]` | Field names stored as quickInfo key/value pairs (execution-specific, never saved to relations) |
| `outputFile` | string | No | — | Write full submitted payload to a JSON file |

#### Annotating tests

```javascript
import { ureport } from 'ureport-jest-reporter';

// Stable UID (recommended)
test('user can log in', () => {
  ureport({ uid: 'auth-login-001' });
  // ... test assertions
});
```

:::warning
Always set a `uid`. Without it, the reporter falls back to the full test name as the uid — which breaks tracking if you ever rename the test.
:::

```javascript
// Relations — components, teams, tags
test('checkout flow', () => {
  ureport({
    uid:        'checkout-flow-001',
    components: ['Checkout', 'Cart'],
    teams:      ['Frontend'],
    tags:       ['smoke', 'regression'],
  });
  // ... test assertions
});
```

:::note
Any extra fields beyond `uid`, `components`, `teams`, and `tags` are stored as custom relation fields. For example: `{ uid: 'TC-001', jira: 'PROJ-42', owner: 'alice' }`.

The `ureport()` helper uses Jest's `expect.getState()` for cross-process IPC — no custom `testEnvironment` required. Just import and call.
:::

---

### Pytest Reporter

#### Install

```bash
pip install ureport-pytest-reporter
```

#### Minimal config

```ini
[pytest]
addopts             = --ureport
ureport_server_url  = https://your-ureport-url
ureport_api_token   = your-api-token
ureport_product     = MyProduct
ureport_type        = E2E
```

#### Configuration options

| ini option | Env variable | Required | Default | Description |
|---|---|---|---|---|
| `ureport_server_url` | `UREPORT_SERVER_URL` | Yes | — | Base URL of UReport server |
| `ureport_api_token` | `UREPORT_API_TOKEN` | Yes | — | API token for authentication |
| `ureport_product` | `UREPORT_PRODUCT` | Yes | — | Product name |
| `ureport_type` | `UREPORT_TYPE` | Yes | — | Test type / lane |
| `ureport_build_number` | `UREPORT_BUILD_NUMBER` | No | timestamp | CI build number |
| `ureport_team` | `UREPORT_TEAM` | No | — | Team name |
| `ureport_browser` | `UREPORT_BROWSER` | No | — | Browser (e.g. `"CHROME"`) |
| `ureport_device` | `UREPORT_DEVICE` | No | — | Device (e.g. `"DESKTOP-WINDOWS"`) |
| `ureport_platform` | `UREPORT_PLATFORM` | No | auto-detected | OS platform |
| `ureport_platform_version` | `UREPORT_PLATFORM_VERSION` | No | auto-detected | OS version |
| `ureport_stage` | `UREPORT_STAGE` | No | — | Deployment stage |
| `ureport_version` | `UREPORT_VERSION` | No | — | Application version |
| `ureport_batch_size` | — | No | 50 | Tests per API call |
| `ureport_include_steps` | — | No | true | Include step detail |
| `ureport_include_screenshots` | — | No | true | Embed screenshots as base64 |
| `ureport_save_relations` | — | No | true | Save test relation records after the run |
| `ureport_quick_info_markers` | — | No | — | Space-separated marker names stored as quickInfo key/value pairs |
| `ureport_output_file` | — | No | — | Write payload to JSON file for debugging |

#### Annotating tests

```python
import pytest

# Stable UID (recommended)
@pytest.mark.ureport_uid("auth-login-001")
def test_user_can_log_in():
    ...
```

:::warning
Always set a `ureport_uid` marker. Without it, the reporter falls back to the test node id as the uid — which breaks tracking if you ever rename or move the test.
:::

```python
# Relations — components, teams, tags
@pytest.mark.ureport_uid("checkout-flow-001")
@pytest.mark.ureport_components("Checkout", "Cart")
@pytest.mark.ureport_teams("Frontend")
@pytest.mark.ureport_tags("smoke", "regression")
def test_checkout_flow():
    ...
```

```python
# Native marks as auto-tags
@pytest.mark.smoke       # becomes @smoke tag automatically
@pytest.mark.regression  # becomes @regression tag automatically
def test_checkout_flow():
    ...
```

:::note
Native pytest marks without arguments are automatically captured as tags. For example, `@pytest.mark.smoke` becomes the tag `@smoke` — no extra configuration needed.
:::

```python
# quickInfo markers — execution-specific metadata
# pytest.ini:
# ureport_quick_info_markers = env run_url

@pytest.mark.env("staging")
@pytest.mark.run_url("https://ci.example.com/runs/42")
def test_checkout_flow():
    ...
```

:::tip
Use `ureport_quick_info_markers` for values that change every run (environments, run URLs). These are stored on the test result but never saved to the test relation record, keeping your relation filters clean.
:::

#### Steps and attachments

```python
import requests

def test_login_api(ureport):
    with ureport.step("POST /api/login"):
        ureport.attach("request-body",
            body=b'{"username":"alice","password":"secret"}',
            content_type="application/json")
        response = requests.post("/api/login",
            json={"username": "alice", "password": "secret"})
        ureport.attach("response-body",
            body=response.text.encode(),
            content_type="application/json")
        assert response.status_code == 200
```

Supported content types:

| `content_type` | UReport view formats |
|---|---|
| `application/json` | JSON, XML |
| `application/xml` / `text/xml` | XML |
| `text/x-curl` | curl, text |
| `text/plain` | text |

:::note
Steps nest arbitrarily — use nested `with ureport.step(...)` blocks for sub-steps. Steps recorded inside setup or teardown fixtures are automatically placed in the setup/teardown phase arrays.
:::

---

### Mocha / Cypress Reporter

#### Install

```bash
# npm
npm install --save-dev ureport-mocha-reporter

# yarn
yarn add --dev ureport-mocha-reporter
```

#### Minimal config

```javascript
// .mocharc.js (or cypress.config.js for Cypress)
module.exports = {
  reporter: 'ureport-mocha-reporter',
  reporterOptions: {
    serverUrl: process.env.UREPORT_SERVER_URL,
    apiToken:  process.env.UREPORT_API_TOKEN,
    product:   'MyProduct',
    type:      'E2E',
    buildNumber: process.env.BUILD_NUMBER,
  },
};
```

#### Configuration options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `serverUrl` | string | Yes | — | Base URL of your UReport server |
| `apiToken` | string | Yes | — | API token for authentication |
| `product` | string | Yes | — | Product name |
| `type` | string | Yes | — | Test type / lane (e.g. `"E2E"`, `"Integration"`) |
| `buildNumber` | string \| number | No | `Date.now()` | CI build number |
| `team` | string | No | — | Team responsible for the tests |
| `browser` | string | No | — | Browser used (if applicable) |
| `device` | string | No | — | Device type (if applicable) |
| `platform` | string | No | auto-detected | Operating system |
| `platform_version` | string | No | auto-detected | OS version |
| `stage` | string | No | — | Environment stage |
| `version` | string | No | — | Application version |
| `batchSize` | number | No | 50 | Tests submitted per API call |
| `saveRelations` | boolean | No | true | Save test relation records after the run |
| `autoDetectPlatform` | boolean | No | true | Auto-detect OS platform and version |
| `quickInfoAnnotations` | string[] | No | `[]` | Annotation names stored as quickInfo key/value pairs |
| `outputFile` | string | No | — | Write full submitted payload to a JSON file |

#### Annotating tests

```javascript
const { ureport } = require('ureport-mocha-reporter');

// Stable UID + relations
it('user can log in', function() {
  ureport({
    uid:        'auth-login-001',
    components: ['Auth'],
    teams:      ['Frontend'],
    tags:       ['smoke'],
  });
  // ... assertions
});
```

:::warning
Always set a `uid`. Without it the reporter uses the test title as the uid — which breaks tracking if you rename the test.
:::

---

### TestNG Reporter

#### Install

```xml
<!-- Maven (pom.xml) -->
<dependency>
  <groupId>io.github.ureport-web</groupId>
  <artifactId>ureport-testng-reporter</artifactId>
  <version>1.0.0</version>
  <scope>test</scope>
</dependency>
```

```kotlin
// Gradle (Kotlin DSL)
testImplementation("io.github.ureport-web:ureport-testng-reporter:1.0.0")
```

#### Minimal config

Register the listener and set system properties in Maven Surefire:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <configuration>
    <properties>
      <property>
        <name>listener</name>
        <value>io.ureport.testng.UReportListener</value>
      </property>
    </properties>
    <systemPropertyVariables>
      <ureport.serverUrl>${env.UREPORT_SERVER_URL}</ureport.serverUrl>
      <ureport.apiToken>${env.UREPORT_API_TOKEN}</ureport.apiToken>
      <ureport.product>MyProduct</ureport.product>
      <ureport.type>E2E</ureport.type>
    </systemPropertyVariables>
  </configuration>
</plugin>
```

#### Configuration options

| System property | Env variable | Required | Default | Description |
|---|---|---|---|---|
| `ureport.serverUrl` | `UREPORT_SERVER_URL` | Yes | — | Base URL of your UReport server |
| `ureport.apiToken` | `UREPORT_API_TOKEN` | Yes | — | API token for authentication |
| `ureport.product` | `UREPORT_PRODUCT` | Yes | — | Product name |
| `ureport.type` | `UREPORT_TYPE` | Yes | — | Test type / lane |
| `ureport.buildNumber` | `UREPORT_BUILD_NUMBER` | No | timestamp | CI build number |
| `ureport.team` | `UREPORT_TEAM` | No | — | Team name |
| `ureport.browser` | `UREPORT_BROWSER` | No | — | Browser (e.g. `"Chrome"`) |
| `ureport.stage` | `UREPORT_STAGE` | No | — | Environment stage |
| `ureport.version` | `UREPORT_VERSION` | No | — | Application version |
| `ureport.saveRelations` | — | No | true | Save test relation records after the run |

#### Annotating tests

```java
import io.ureport.testng.UReport;

// Stable UID + relations
@UReport(uid = "auth-login-001", components = "Auth", teams = "Frontend", tags = "smoke")
@Test
public void userCanLogIn() {
    // ... assertions
}
```

:::warning
Always set a `uid`. Without it the reporter uses the method name as the uid — which breaks tracking if you rename the method.
:::

---

### Raw API

Use the Raw API when you have a custom framework or language not covered by the official reporters.

#### Authentication

**API Token (recommended for CI/CD)**

Generate a personal API token: click your avatar → **Edit Profile → API Token → Generate Token**. Pass it in every request:

```
Authorization: Bearer YOUR_API_TOKEN
```

```bash
curl -X POST https://your-ureport-url/api/build \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product":"MyApp","type":"E2E","build":123}'
```

**Session cookie (alternative)**

Login via `POST /api/login` with username and password. The response returns a `connect.sid` cookie — pass it in subsequent requests. Useful for interactive scripts or testing from a browser.

---

#### Step 1 — Create a Build Session

`POST /api/build`

The combination of `product` and `type` creates your Product Lane — the fundamental organizing unit in UReport. All test relations, investigated issues, custom states, and analytics are scoped to this Product Lane.

**Build payload fields**

| Field | Required | Description |
|---|---|---|
| `product` | Yes | The application or system being tested (e.g. `"WebPortal"`, `"PaymentService"`) |
| `type` | Yes | The category of testing (e.g. `"UI"`, `"API"`, `"E2E"`, `"Unit"`) |
| `build` | Yes | A **numeric** build number from your CI/CD pipeline (e.g. Jenkins build number, GitHub Actions run number) |
| `team` | No | Team responsible for the tests |
| `browser` | No | Browser used. Validated values: Chrome, Firefox, Safari, Edge, Opera, Electron, Chromium, Internet Explorer |
| `version` | No | Application version (e.g. `"1.2.3"`, `"v2.0-beta"`) |
| `stage` | No | Environment stage (e.g. `"Development"`, `"Staging"`, `"Production"`) |
| `device` | No | Device type (e.g. `"Desktop"`, `"Mobile"`, `"Tablet"`) |
| `platform` | No | Operating system (e.g. `"Windows"`, `"macOS"`, `"Linux"`) |
| `platform_version` | No | OS version (e.g. `"Windows-11"`, `"macOS-13"`, `"Ubuntu-22.04"`) |
| `start_time` | No | Build start timestamp in ISO 8601 format |
| `end_time` | No | Build end timestamp in ISO 8601 format |
| `owner` | No | Owner or initiator of the build |
| `environments` | No | Free-form object for environment data (base URLs, regions, DB info, etc.) |
| `settings` | No | Free-form object for test run configuration (flags, timeouts, params, etc.) |
| `is_archive` | No | Set to `true` to archive — archived builds are hidden from default views and excluded from analytics |

```json
// Required fields
{
  "product": "MyApplication",
  "type": "E2E",
  "build": 123
}
```

```json
// Full request with optional metadata
{
  "product": "ECommerce",
  "type": "API",
  "build": 456,
  "team": "Backend",
  "browser": "Chrome",
  "version": "v2.1.0",
  "stage": "Production",
  "device": "Desktop",
  "platform": "Linux",
  "platform_version": "Ubuntu-20.04",
  "start_time": "2024-01-15T10:30:00Z",
  "owner": "jenkins-pipeline",
  "environments": {
    "baseUrl": "https://api.example.com",
    "region": "us-west-2"
  },
  "settings": {
    "parallelWorkers": 4,
    "retryOnFailure": true
  }
}
```

```json
// Response
{
  "_id": "65abc123def456789",
  "product": "ECommerce",
  "type": "API",
  "build": 456,
  "start_time": "2026-03-12T18:19:36.564Z"
}
```

:::note
Save the returned `_id` — you'll need it to submit test results.
:::

---

#### Step 2 — Submit Test Results

`POST /api/test/multi`

Max 100 tests per call — batch multiple calls for larger suites.

**Test payload fields**

| Field | Required | Description |
|---|---|---|
| `build` | Yes | The `_id` returned from the build creation step |
| `uid` | Yes | Stable unique identifier for tracking the test across builds. Must never change, even if the test name is updated. |
| `name` | Yes | Display name shown in UReport UI. Use dot notation (`package.class.method`) for proper tree view hierarchy. |
| `status` | Yes | Test result status — see [Test Statuses](#test-statuses) |
| `start_time` | No | Test start timestamp in ISO 8601 format |
| `end_time` | No | Test end timestamp in ISO 8601 format |
| `is_rerun` | No | Boolean — `true` if this is a retry of a previously failed test |
| `failure` | No | Object with `error_message`, `stack_trace`, and `token` for failed tests |
| `info` | No | Free-form object. Special keys: `file`, `path`, `description`, `duration`, `components`, `teams`, `tags`. Any other keys become custom filterable relations. |
| `setup` / `body` / `teardown` | No | Arrays of test steps with `status`, `detail`, `timestamp`, and optional `attachment: { screenshot, type }` |

```json
// Single test (minimal)
{
  "tests": [
    {
      "build": "65abc123def456789",
      "uid": "login-test-valid-credentials",
      "name": "com.myapp.LoginTest.testValidCredentials",
      "status": "PASS"
    }
  ]
}
```

```json
// Multiple tests with full details
{
  "tests": [
    {
      "build": "65abc123def456789",
      "uid": "login-test-001",
      "name": "com.myapp.LoginTest.testValidCredentials",
      "status": "PASS",
      "start_time": "2024-01-15T10:30:00Z",
      "end_time": "2024-01-15T10:30:05Z",
      "info": {
        "file": "tests/auth/login.spec.ts",
        "path": "tests/auth",
        "description": "Verify valid login credentials",
        "duration": "5000ms"
      }
    },
    {
      "build": "65abc123def456789",
      "uid": "login-test-002",
      "name": "com.myapp.LoginTest.testInvalidCredentials",
      "status": "FAIL",
      "start_time": "2024-01-15T10:30:10Z",
      "end_time": "2024-01-15T10:30:15Z",
      "failure": {
        "error_message": "Expected login to fail but succeeded",
        "stack_trace": "AssertionError at LoginTest.java:45..."
      },
      "is_rerun": false
    }
  ]
}
```

```json
// Test with steps and screenshots
{
  "tests": [
    {
      "build": "65abc123def456789",
      "uid": "login-flow-001",
      "name": "LoginFlowTest",
      "status": "FAIL",
      "setup": [
        {
          "timestamp": "2024-01-15T10:30:00Z",
          "status": "PASS",
          "detail": "Navigate to login page",
          "attachment": {
            "screenshot": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
            "type": "base64"
          }
        }
      ],
      "body": [
        { "status": "PASS", "detail": "Enter username" },
        {
          "status": "FAIL",
          "detail": "Click login button",
          "attachment": {
            "screenshot": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
            "type": "base64"
          }
        }
      ],
      "teardown": [
        { "status": "PASS", "detail": "Close browser" }
      ]
    }
  ]
}
```

```json
// Test with relations in info
{
  "tests": [
    {
      "build": "65abc123def456789",
      "uid": "checkout-001",
      "name": "CheckoutTest.testPaymentFlow",
      "status": "PASS",
      "info": {
        "file": "tests/checkout/payment.spec.ts",
        "path": "tests/checkout",
        "components": ["Checkout", "Payment"],
        "teams": ["E-Commerce"],
        "tags": ["smoke", "critical"],
        "priority": "P1",
        "feature": "Payment Processing"
      }
    }
  ]
}
```

:::warning
Do not pass `components`, `teams`, or `tags` as top-level test fields — the Test model has no such fields and they will be silently ignored. Pass them inside `info`.
:::

---

#### Step 3 — Finalize Build Status

`POST /api/build/status/calculate/{buildId}`

Call this when your entire test session finishes. It recalculates the build status (pass/fail/skip counts) based on all tests currently stored, including handling rerun tests correctly.

```
POST /api/build/status/calculate/65abc123def456789

{
  "is_update_build_status": true
}
```

```json
// Response
{
  "status": {
    "pass": 45,
    "fail": 3,
    "skip": 2,
    "total": 50
  },
  "end_time": "2024-01-15T10:35:00.000Z"
}
```

:::tip
Unlike manually setting status via `PUT /build/status/{buildId}`, this endpoint automatically calculates correct counts from all tests in the build. It groups tests by uid, uses the latest status for each test, then aggregates the totals.
:::

---

#### uid vs name

Both fields are required but serve different purposes:

| Aspect | `uid` | `name` |
|---|---|---|
| Purpose | Test identity for tracking | Display label for users |
| Visibility | Internal (used by UReport) | Shown in UI (test list, tree view, reports) |
| Stability | Must **never** change | Can be updated anytime |
| Used for | Behavior analysis, flaky detection, historical trends, cross-build comparison | Tree view hierarchy, search, readability |
| Format | Short, stable ID (e.g. `"TC-1234"`) | Descriptive (e.g. `"com.myapp.LoginTest.testValidCredentials"`) |

```
// Build 100 - Original test
{ "uid": "TC-1234", "name": "testLogin" }

// Build 150 - Name improved for clarity
{ "uid": "TC-1234", "name": "LoginTest.testValidCredentials" }

// Build 200 - Name updated to follow new convention
{ "uid": "TC-1234", "name": "com.myapp.auth.LoginTest.testValidCredentials" }

// UReport tracks all 3 as the SAME test because uid is unchanged
```

---

#### Test Statuses

| Status | Description | When to use |
|---|---|---|
| `PASS` | Test executed successfully | Assertions passed without errors |
| `FAIL` | Test failed | Assertion errors or exceptions occurred |
| `SKIP` | Test was skipped | Ignored or conditionally skipped |
| `WARNING` | Non-fatal issue detected | Test technically passed but flagged |
| `RERUN_PASS` | Rerun passed | Test passed after being retried |
| `RERUN_FAIL` | Rerun failed | Raw API only |
| `RERUN_SKIP` | Rerun skipped | Raw API only |

:::note
To track retries: set `is_rerun: true` on the test payload. For a test that passed on retry, use `RERUN_PASS`. For a test that failed or was skipped again on retry, use `FAIL` / `SKIP` with `is_rerun: true` — `RERUN_FAIL` and `RERUN_SKIP` are accepted by the raw API but are not used by the official reporters.
:::

---

## Product Lanes

Product Lanes are the fundamental organizing principle in UReport. They define how test executions are grouped, filtered, and analyzed.

Every test execution belongs to a Product Lane, which determines:

- How tests are grouped in dashboards and widgets
- What data appears in comparisons and trends
- How filtering and search operations work
- Which tests are included in analytics

### Product Lane fields

**Mandatory**

| Field | Description |
|---|---|
| `product` | The application or system being tested (e.g. `"MyApp"`, `"WebPortal"`) |
| `type` | The category of testing (e.g. `"UI"`, `"API"`, `"E2E"`, `"Unit"`) |

**Optional (enhance filtering)**

| Field | Description |
|---|---|
| `team` | Team responsible (e.g. `"Frontend"`, `"Backend"`) |
| `browser` | Browser used (e.g. `"Chrome"`, `"Firefox"`, `"Safari"`) |
| `version` | Application version (e.g. `"1.2.3"`, `"v2.0-beta"`) |
| `stage` | Environment (e.g. `"Development"`, `"Staging"`, `"Production"`) |
| `device` | Device type (e.g. `"Desktop"`, `"Mobile"`, `"Tablet"`) |
| `platform` | Operating system (e.g. `"Windows"`, `"macOS"`, `"Linux"`) |
| `platform_version` | OS version (e.g. `"Windows-11"`, `"macOS-13"`) |

### Why Product and Type matter

The `product` + `type` combination scopes all data in UReport:

- **Investigation scope** — triaged issues and similar failure detection are shared across builds within the same Product Lane
- **Test relations** — components, teams, tags, and custom relation filters are configured per Product Lane
- **Custom states** — TTL and state workflows are independent per Product Lane
- **Analytics** — build history, pass rate calculations, and behavior analysis (flaky, new failures) are all per Product Lane

:::warning
Choose your `product` and `type` values carefully before sending data. Changing them later will create a new Product Lane, and historical data won't be connected.
:::

### Examples

```bash
# Basic Product Lane
POST /api/build
{ "product": "MyApp", "type": "API", "build": 1 }

# With environment
POST /api/build
{ "product": "MyApp", "type": "UI", "stage": "Staging", "browser": "Chrome", "build": 2 }

# Full enterprise setup
POST /api/build
{
  "product": "ECommerce",
  "type": "E2E",
  "team": "QA",
  "browser": "Chrome",
  "version": "v2.1.0",
  "stage": "Production",
  "device": "Desktop",
  "platform": "Windows",
  "platform_version": "Windows-11",
  "build": 3
}
```

:::tip
Start simple with just Product + Type. Add more fields as your testing needs grow.
:::

---

Next: [Test Analysis →](./test-analysis)
