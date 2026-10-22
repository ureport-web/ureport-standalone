---
sidebar_position: 2
title: Installation
description: Self-host UReport with Docker Compose or bare metal. Covers prerequisites, configuration reference, Redis caching, and first login setup.
---

# Installation

Self-host UReport on your own infrastructure. Choose Docker (recommended) or bare metal.

---

## Option A — Docker (recommended)

### How do I run UReport with Docker Compose?

No local Node.js or MongoDB install required — everything is bundled.

**Step 1: Clone and start**

```bash
git clone https://github.com/ureport-web/ureport-standalone.git
cd ureport-standalone
docker-compose up --build
```

`--build` compiles the app image from the included `Dockerfile` — no pre-built image to pull.

The container entrypoint automatically runs `initialize.js` on every start, which seeds the default admin and demo accounts if the database is empty (safe no-op if already initialized).

Open **http://localhost:8080**. Default login: **admin / changeme**.

**Step 2: (Optional) Custom credentials or external DB**

Copy `.env.example` to `.env` and edit before the first startup:

```bash
cp .env.example .env
# edit .env, then:
docker-compose up --build
```

```bash title=".env"
# Copy to .env to override defaults.

# --- Admin credentials (applied on first start when DB is empty) ---
# ADMIN_EMAIL=admin@example.com
# ADMIN_PASSWORD=changeme
# DEMO_PASSWORD=1234

# --- External MongoDB (optional) ---
# If set, the bundled 'mongodb' service in docker-compose.yml is unused.
# You can remove it to avoid starting an unnecessary container.
# DBHost=mongodb+srv://user:pass@cluster.mongodb.net/ureport
# DBHost=mongodb://user:pass@your-server:27017/ureport

# --- Cache (optional) ---
# Without any of these set, the server uses an in-process cache (node-cache).
# That works fine for a single instance. For multi-instance / production
# deployments use Redis or AWS ElastiCache/Valkey so all nodes share the same cache.
#
# Option A — Redis or Valkey via URL (simplest):
# REDIS_URL=redis://localhost:6379
# VALKEY_URL=valkey://localhost:6379
#
# Option B — AWS ElastiCache (Valkey) with IAM auth:
# VALKEY_PRIMARY_ENDPOINT=my-cluster.abc123.cache.amazonaws.com
# VALKEY_USER=my-iam-user
# VALKEY_REPLICATION_GROUP=my-replication-group-id
# AWS_REGION=us-east-1
```

:::warning
Credentials in `.env` are only applied on the **first startup** when the database is empty.
:::

### Does data persist across restarts?

Yes. MongoDB data is stored in a named Docker volume (`mongo_data`) and survives container restarts and rebuilds.

### Can I use an external MongoDB instead of the bundled one?

Set `DBHost` in `.env` to your MongoDB URI. The bundled `mongodb` service in `docker-compose.yml` can then be removed to avoid starting an unnecessary container.

---

## Option B — Bare Metal

### What do I need before installing?

- **Node.js 18+** — runtime for the server
- **MongoDB 3+** — database (local, Atlas, or AWS DocumentDB)

### How do I get UReport running without Docker?

**Step 1: Clone the repository**

```bash
git clone https://github.com/ureport-web/ureport-standalone.git
cd ureport-standalone
npm install
```

**Step 2: Configure your database**

Edit `config/dev.json` with your MongoDB connection string and desired port:

```json title="config/dev.json"
{
  "DBHost": "mongodb://localhost:27017/ureport",
  "PORT": 4100
}
```

For production, edit `config/production.json` — or set the `DBHost` environment variable to override the config file.

**Step 3: Seed the database**

This creates the default admin account and initial system settings. Safe to re-run — skips if already initialized.

```bash
npm run initialize
```

**Step 4: Start the server**

```bash
npm start
```

The server starts on the port configured in step 2 (default: **4100** for dev).

---

## Running in Production (bare metal)

Set `NODE_ENV=production` before starting. This switches the server to use `config/production.json` and enables clustering (up to 4 workers based on CPU count):

```bash
NODE_ENV=production npm start
```

You can also override the database connection with an environment variable:

```bash
DBHost="mongodb+srv://user:pass@cluster.mongodb.net/ureport" \
NODE_ENV=production npm start
```

---

## First Login

### What are the default credentials?

| Setup | Username | Password | Role |
|---|---|---|---|
| Docker / Bare metal | `admin` | `changeme` | Admin |
| Docker / Bare metal | `demo` | `1234` | Viewer |

Both accounts are seeded on first startup by the same initialisation script. Docker credentials can be overridden via `.env` before first startup; bare metal credentials can be overridden via environment variables before running `npm run initialize`.

:::warning
Change the admin password immediately after your first login.
:::

### How do other users get access?

Users self-register at `/signup`. How they get activated depends on whether email is configured:

**With email configured (recommended)**

User registers → receives a confirmation email → clicks the link → account becomes *active* automatically. No admin action needed.

**Without email configured**

User registers → account stays *pending* → admin must manually approve in **Settings → Users** before the user can log in.

To configure email go to **Settings → Notification → Email** and enter your SMTP credentials.

Admins can promote users to *operator* or *admin* role in **Settings → Users**.

---

## API Token

### How do I get an API token to push test results?

Each user can generate a personal API token from their profile — click your avatar → **Edit Profile → API Token → Generate Token**. This token is used in the `Authorization: Bearer` header when calling the REST API or configuring a reporter plugin.

---

## Configuration Reference

### Where does UReport read its configuration?

Configuration is loaded from the `config/` directory based on the `NODE_ENV` value:

| File | Used when |
|---|---|
| `config/dev.json` | `NODE_ENV=dev` (default) |
| `config/production.json` | `NODE_ENV=production` |
| `config/docker.json` | `NODE_ENV=docker` (set by docker-compose.yml) |
| `config/test.json` | `NODE_ENV=test` |

Each file supports these keys:

| Key | Description | Dev default | Prod default |
|---|---|---|---|
| `DBHost` | MongoDB connection string | mongodb://localhost:27017/ureport | (set this to your DB) |
| `PORT` | HTTP port the server listens on | 4100 | 8080 |
| `REDIS_URL` | Redis/Valkey cache URL (optional) | redis://localhost:6379 | (not set) |

### Can I override config values with environment variables?

Yes. These environment variables take precedence over the config files:

| Variable | Overrides | Notes |
|---|---|---|
| `DBHost` | `config.DBHost` | Useful in Docker / cloud deployments |
| `PORT` | `config.PORT` | Falls back to 3000 if neither is set |
| `NODE_ENV` | (selects config file) | Defaults to `dev` |
| `ADMIN_EMAIL` | Admin seed email | Docker only — applied on first startup |
| `ADMIN_PASSWORD` | Admin seed password | Docker only — applied on first startup |
| `DEMO_PASSWORD` | Demo user seed password | Docker only — applied on first startup |
| `REDIS_URL` | Redis/Valkey URL | e.g. `redis://localhost:6379` |
| `VALKEY_URL` | Valkey URL (converted to redis://) | Alternative to REDIS_URL |
| `VALKEY_PRIMARY_ENDPOINT` | AWS ElastiCache hostname | IAM auth mode — requires VALKEY_USER + VALKEY_REPLICATION_GROUP |
| `VALKEY_USER` | IAM-enabled Valkey user | IAM auth mode |
| `VALKEY_REPLICATION_GROUP` | Replication group ID | IAM auth mode |
| `AWS_REGION` | AWS region | IAM auth mode — defaults to us-east-1 |

### Does UReport support Redis for caching?

Yes. By default the server uses an in-process cache (node-cache) — no setup needed.

For multi-instance or production deployments, point all nodes at a shared Redis or AWS ElastiCache (Valkey) instance using one of the env vars above. The server logs which mode is active on startup.

:::info
If none of the cache env vars are set, the server logs: `[cache] No cache configured, using node-cache`
:::

---

Next: [Getting Started →](./getting-started)
