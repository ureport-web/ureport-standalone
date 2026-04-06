# UReport

Stand-alone server-side reporting and analysis software for local or CI automation.

## Prerequisites

- MongoDB ≥ 3.0
- Node.js ≥ 12.x

## Installation

1. Clone or download the repo.
2. Run `npm install`.
3. Edit `config/dev.json` — update `DBHost` and `PORT` if needed.
4. Run `npm run initialize` to seed the database (creates the admin user, system settings, and dashboard templates).
5. Run `npm start`.
6. Open `http://localhost:4100` in your browser.

Default credentials: **admin / 1234**

## Configuration

| Key | Description | Default |
|---|---|---|
| `DBHost` | MongoDB connection string | `mongodb://localhost/ureport` |
| `PORT` | HTTP port the server listens on | `4100` |
| `analysisSinceDay` | How many days back auto-analysis looks | `7` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |

**Development:** edit `config/dev.json`.

**Production:** set `NODE_ENV=production` and supply `DBHost` as an environment variable (or edit `config/production.json`).

## Features

- **Auto-Analysis** — repeated failures are automatically matched and re-tagged based on previous investigations, so you start each day with analysis already done.
- **Customizable dashboards** — build bar charts, line charts, and tables to track pass rates, fail rates, skip rates, and analysis coverage.
- **Multi-product comparison** — compare results across different products or runs side-by-side, or in a combined chart.
- **Role-based access** — three roles: `admin`, `operator`, and `viewer`, each with different permissions.
- **JIRA integration** — link test failures directly to JIRA issues from within UReport.
- **Public dashboard sharing** — generate a shareable token to expose a read-only dashboard view without requiring a login.
- **API token authentication** — generate per-user API tokens for programmatic access to the REST API.
- **Swagger API docs** — full interactive API reference available at `/api-docs`.

## Sending Test Data

UReport stores test results in two collections:

- **Build** — represents a single execution (e.g. a CI build). Holds metadata like build number, product, and environment.
- **Test** — represents an individual test case that belongs to a Build.

To integrate your automation framework, POST builds and tests to the REST API. See the interactive reference for request/response shapes:

```
http://your-server:your-port/api-docs
```

## npm Scripts

| Script | Command | Description |
|---|---|---|
| `start` | `node server` | Start the server |
| `initialize` | `node initialize.js` | Seed the database with initial data |
| `seed` | `node seedGenerator` | Generate sample seed data |
| `test` | `mocha` | Run the test suite |

## API Documentation

Once the server is running, the full Swagger UI is available at:

```
http://your-server:your-port/api-docs
```
