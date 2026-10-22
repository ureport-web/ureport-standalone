---
sidebar_position: 9
title: AI Analysis
description: LLM-powered root cause analysis for failed tests in UReport. Supports AWS Bedrock, Anthropic Claude, OpenAI, Gemini, and Ollama. Includes MCP server for AI assistant integration.
---

# AI Root Cause Analysis

Instantly understand why any test failed — root cause category, confidence score, plain-English explanation, and a suggested fix, powered by the LLM provider of your choice.

---

## How It Works

When a test fails, click **Analyse with AI** in the test detail panel. UReport sends the error message, stack trace, step context, and prior run history to your configured LLM. The model returns:

| Output | Description |
|---|---|
| **Root Cause Category** | One of six categories — see [Root Cause Categories](#root-cause-categories) below |
| **Confidence Score** | 0–100% confidence in the category. Low scores indicate ambiguous failures worth reviewing manually. |
| **Explanation** | Plain-English description of what likely went wrong and why, based on the error and execution context |
| **Suggested Fix** | Actionable recommendation — a config change, code fix, or environment check |
| **Flakiness Signal** | One of four values: `consistent`, `intermittent`, `regression`, or `new`. Signals the failure pattern observed across runs — useful for distinguishing a brand-new failure from a recurring flaky test. |
| **Related Patterns** | String array of patterns identified across similar failures in the same suite — surfaces common error themes so you can address systemic issues |

:::info
The Analyse with AI button is only shown for **failed** tests. Passed and skipped tests do not have an Analyse option.
:::

### Caching

Results are cached by **error fingerprint** (a hash of the error message and stack trace). If ten tests share the same failure, only the first triggers an LLM call — the rest receive the cached result instantly at no extra cost.

### Sibling Deduplication

When a test is analysed, UReport checks all other tests in the same build that share the exact same error message *and* stack trace. Those siblings are immediately marked as analysed with the same result, without triggering additional LLM calls. Clicking "Analyse with AI" on one test can resolve dozens of identical failures at once.

### Step Context Window

When a failing test has steps, the LLM receives a window of steps centred on the failed step: the **5 steps immediately before** the failure and the **3 steps immediately after**. This gives the model both the lead-up and any cleanup/teardown context without bloating the prompt with the entire test run.

:::tip
Submitting steps via your reporter significantly improves analysis quality. Without steps, the model only sees the error message and stack trace.
:::

### Human Feedback Loop

After viewing the AI result, you can:
- **Confirm** — agree with the root cause category
- **Override** — select the correct category if the AI was wrong

Feedback is recorded per analysis. Over time, this data lets you track how accurate the AI is for your specific test suite and identify where the model needs improvement.

---

## Setup

1. Go to **Settings → AI Analysis** (admin only)
2. Choose a provider:

| Provider | Credential required | Notes |
|---|---|---|
| **AWS Bedrock (Claude)** | AWS access key + secret + region | Recommended for enterprise — stays within your AWS boundary |
| **Anthropic Claude API** | Anthropic API key | Direct API; good if your team already uses Claude |
| **OpenAI** | OpenAI API key | Defaults to `gpt-4o-mini` |
| **Google Gemini** | Gemini API key | Defaults to `gemini-2.0-flash` |
| **Ollama** | None (self-hosted URL) | For local or air-gapped deployments |

3. Enter credentials and click **Save**. Takes effect immediately — no server restart required.

:::info
Only admins can configure the AI provider. The Analyse with AI button is visible to all users once a provider is configured.
:::

---

## Using AI Analysis

1. Click any failing test in the Launches view to open the detail panel
2. Click **Analyse with AI** — analysis typically completes in 2–5 seconds depending on your provider
3. Review: root cause category badge, confidence bar, plain-English explanation, suggested fix
4. Optionally **Confirm** or **Override** the category to track AI accuracy over time

---

## MCP Server

UReport ships a built-in [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server at `POST /mcp`. Connect any MCP-compatible AI assistant and query your builds, test results, and pass rate trends in plain language — no browser required.

**MCP is not Claude-only.** Any compatible client works: Claude Desktop, Claude Code, Cursor, Windsurf, Cline, Continue.dev, and others.

### Connect an MCP Client

**Step 1 — Get your API token:** Click your avatar → **Edit Profile → API Token → Generate Token**.

**Step 2 — Add UReport to your MCP config** (e.g. `.mcp.json` for Claude Code, `mcp.json` in Cursor):

```json
{
  "mcpServers": {
    "ureport": {
      "type": "http",
      "url": "http://your-ureport-host:4100/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    }
  }
}
```

Replace `http://your-ureport-host:4100` with your actual backend URL (local dev: `http://localhost:4100`).

**Step 3 — Restart your AI client.** UReport tools will appear in the available tool list.

### Available MCP Tools

| Tool | Description |
|---|---|
| `list_presets` | List all saved presets. Call this first — preset names are required by `list_builds` and `get_statistics`. |
| `list_builds` | List recent builds matching a saved preset. |
| `search_builds` | List recent builds using explicit filters: product, type, version, browser, platform, team, stage. |
| `get_statistics` | Pass/fail counts and average pass rate for builds matching a saved preset. |
| `search_statistics` | Pass/fail stats using explicit filters (same shape as `search_builds`). |
| `get_relation_fields` | Discover available tags, components, teams, and custom field keys (e.g. PartnerCode, XrayId) for a product/type before filtering tests. |
| `get_tests` | Get individual test results for a build. Filters: status, name, tag, component, team, custom field key/value, file, path. Use `custom_value` alone for a broad search across all custom fields (e.g. searching for an XRAY ticket ID). |

The AI chains tool calls automatically — for example, it calls `list_presets` to get valid preset names, then `list_builds` to find the latest build, then `get_tests` to fetch failures — without you specifying IDs manually.

### Example Queries

- "Show me the latest nightly build results"
- "What's the pass rate trend for the PythonAPI preset over the last 20 builds?"
- "Find all failing tests for partner code AC in the latest nightly run"
- "Search for XRAY-768 across all tests"
- "Show me tests tagged with Payment Auth/Capture that failed on Safari"
- "List all builds for product PLAYWRIGHT on STAGE"
- "Which builds have failures today?"
- "Show me all tests that timed out in the last regression run"

---

## Root Cause Categories

| Category | Description | Common examples |
|---|---|---|
| **Code Defect** | A bug in the application under test | Null pointer, assertion mismatch, wrong HTTP status code |
| **Test Flakiness** | The test itself is unreliable | Race condition, hard-coded sleep, non-deterministic test data |
| **Environment Issue** | Infrastructure or environment problem at runtime | Service unavailable, DB connection failure, out-of-memory |
| **Configuration Error** | Wrong config value or missing setting | Wrong base URL, missing env var, misconfigured timeout |
| **Test Data Issue** | Bad or missing test data | Missing fixture, stale seed data, data isolation failure |
| **Infrastructure Issue** | CI/CD or platform-level problem | Disk full, network partition, container OOM kill |

---

Next: [Administration →](./administration)
