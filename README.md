# UReport

uReport is an open-source automation reporting platform designed for modern QA and engineering teams.

It centralizes test execution results across frontend, backend, API, and distributed automation frameworks into a unified, searchable reporting experience.

Unlike traditional static HTML reports, uReport focuses on actionable test intelligence:

- centralized reporting
- execution visibility
- flaky test analysis
- CI/CD integration
- scalable multi-framework support

Built for teams adopting AI-driven QA workflows, uReport helps organizations reduce debugging time, improve release confidence, and gain real-time visibility into automation health across projects and environments.

Free and open-source, with optional consulting and enterprise integration support available.

**Live demo:** https://ureport-standalone.onrender.com/nextgen/

## 🚀 How it solves it

Two integration paths — pick what fits your workflow:

- **Official reporters** for [Playwright](https://www.npmjs.com/package/ureport-playwright-reporter), [Jest](https://www.npmjs.com/package/ureport-jest-reporter), and [pytest](https://pypi.org/project/ureport-pytest-reporter/) push results automatically from CI — zero manual work
- **MCP endpoint** lets Claude Code (or any MCP client) query your test data in plain English — no browser required

Once data is in, uReport does the heavy lifting:

- **AI root cause analysis** classifies failures and suggests fixes with one click — results cached by error fingerprint so sibling tests get analysis for free
- **Dashboards** surface pass rate trends, flakiness patterns, and team-level health at a glance
- **Quarantine system** suppresses known-flaky noise automatically; entries expire after 90 days
- **Auto-analysis** re-tags repeated failures based on previous investigations — no manual re-triage

## ⚡ Quick Start (under 2 minutes)

**Prerequisites:** Node.js ≥ 18, MongoDB ≥ 3.0

1. Clone the repo.
2. Run `npm install`.
3. Edit `config/dev.json` — set `DBHost` and `PORT` if the defaults don't fit your environment.
4. Run `npm run initialize` to seed the database (creates the admin user, system settings, and dashboard templates).
5. Run `npm start`.
6. Open `http://localhost:4100` in your browser.

Default credentials: **admin / 1234**

Send your first results with an official reporter — see [Sending Test Data](#sending-test-data) below.

## 🧠 Architecture Overview

```
  Playwright / Jest / pytest
         │  (POST /api/builds, /api/tests)
         ▼
  ┌─────────────────────────┐
  │   Express server        │
  │   (Node / CoffeeScript) │
  │                         │
  │  REST API               │
  │  MCP endpoint (/mcp)    │
  │  AI provider clients    │
  └────────────┬────────────┘
               │
          MongoDB
               │
       ┌───────┴────────┐
       │                │
  Angular UI      Claude Code /
  (browser)      MCP client (Configurable & Optional)
```

- **Backend:** Express + CoffeeScript, runs as cluster in production
- **Database:** MongoDB — two main collections: `Build` and `Test`
- **Frontend:** Angular SPA served as static bundle from the same server
- **MCP:** built-in at `/mcp` — no extra service needed
- **AI:** stateless calls to external providers; results cached by error fingerprint

## Features

### 🤖 AI Root Cause Analysis

Any failing test can be analyzed by an LLM with a single click from the test detail panel:

- **"Analyze with AI"** button on any failing test
- LLM receives: error message, stack trace, step context, and prior run history
- Returns: root cause category, confidence score, explanation, and suggested fix
- **Root cause categories:** Code Defect, Test Flakiness, Environment Issue, Configuration Error, Test Data Issue, Infrastructure Issue
- Results are cached by error fingerprint — sibling tests sharing the same error get free analysis
- **Human feedback loop:** confirm or override the AI prediction to track accuracy over time

**Supported providers** (configured in Settings):

| Provider             | Notes                                          |
| -------------------- | ---------------------------------------------- |
| AWS Bedrock (Claude) | Recommended for enterprise                     |
| Anthropic Claude API | Direct API — good if using Claude company-wide |
| OpenAI               | GPT-4o-mini default                            |
| Google Gemini        | gemini-2.0-flash                               |
| Ollama               | Local/air-gapped deployments                   |

---

### 🔌 MCP Server — Use ureport with Claude Code

ureport ships a [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server, letting you query your test data directly from Claude Code or any MCP-compatible AI assistant — no browser required.

**Available tools:**

| Tool                  | Description                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `list_builds`         | List recent builds with filters (product, type, version, browser, platform, team, stage)          |
| `get_tests`           | Get tests for a build with advanced filtering (status, name, tag, component, team, custom fields) |
| `get_statistics`      | Pass/fail stats and pass rate trends across recent builds                                         |
| `get_relation_fields` | Discover available metadata fields before filtering                                               |

**Example prompts you can use in Claude Code:**

- "Show me the last 10 builds for product X and their pass rates"
- "List all failing tests in build #1234"
- "What's the failure trend for the checkout team over the last 20 builds?"

**Setup:** configure your MCP client to point at your ureport backend — the MCP endpoint is `POST <ureport-backend-url>/mcp`.

---

### Dashboard Builder

Drag-and-drop grid layout with configurable widgets: pass rate line charts, pie charts, bar charts, treemaps, heatmaps, summary cards, and analysis tables.

![Dashboard Builder](docs/screenshots/dashboards_1.png)
![Dashboard Builder](docs/screenshots/dashboards_2.png)
![Dashboard Builder](docs/screenshots/dashboards_3.png)

---

### Test Results Explorer

Browse test results in four switchable views: tree (class/suite hierarchy), list, build comparison (side-by-side A/B/C coloring), and timeline (slider-based time range filter).

![Test Results Explorer](docs/screenshots/test-explorer.png)
![Test Results Explorer](docs/screenshots/test-explorer_1.png)

---

### Auto-Analysis

Repeated failures are automatically matched and re-tagged based on previous investigations.

![Auto-Analysis](docs/screenshots/auto-analysis.png)

---

### Quarantine System

Flag flaky tests to suppress noise; quarantine entries auto-expire after 90 days.

![Quarantine System](docs/screenshots/quarantine.png)

---

### Product Lane Overview

Top-level view of all test execution lanes grouped by product, showing live pass rates and health status.

![Product Lane Overview](docs/screenshots/product-lanes.png)

---

### Also included

- Test Relations & Investigated Test table
- Public Dashboard Sharing
- Role-based access (admin / operator / viewer)
- User management with admin approval workflow
- Email notifications (build completion, test assignments)
- API token authentication
- Audit logging
- Swagger API docs at `/api-docs`

## Configuration

| Key        | Description                                        | Default                       |
| ---------- | -------------------------------------------------- | ----------------------------- |
| `DBHost`   | MongoDB connection string                          | `mongodb://localhost/ureport` |
| `PORT`     | HTTP port the server listens on                    | `4100`                        |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development`                 |

**Development:** edit `config/dev.json`.

**Production:** set `NODE_ENV=production` and supply `DBHost` as an environment variable (or edit `config/production.json`). In production the server runs as a cluster (2–4 workers).

## Sending Test Data

UReport stores test results in two collections:

- **Build** — represents a single execution (e.g. a CI build). Holds metadata like build number, product, and environment.
- **Test** — represents an individual test case that belongs to a Build.

**Official reporters:**

- [ureport-playwright-reporter](https://www.npmjs.com/package/ureport-playwright-reporter) — Playwright
- [ureport-jest-reporter](https://www.npmjs.com/package/ureport-jest-reporter) — Jest
- [ureport-pytest-reporter](https://pypi.org/project/ureport-pytest-reporter/) — pytest

Or POST directly to the REST API — see the interactive reference at `http://your-server:port/api-docs`.

## API Documentation

Once the server is running, the full Swagger UI is available at:

```
http://your-server:your-port/api-docs
```

Most endpoints require either a session cookie (browser login) or an `Authorization: Bearer <token>` header (API token).

## npm Scripts

| Script               | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `npm start`          | Start the server                                                     |
| `npm run initialize` | Seed the database (admin user, system settings, dashboard templates) |
| `npm run seed`       | Generate sample data                                                 |
| `npm test`           | Run the test suite                                                   |

## 💼 Need help?

Need custom integration, enterprise deployment, or dedicated support?
→ [Get in touch](mailto:[yizhongji@email.com])
