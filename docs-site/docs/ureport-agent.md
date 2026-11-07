---
sidebar_position: 10
title: ureport-agent
description: Run ureport-agent on your machine to enable Auto-Heal and Rerun. The agent connects to your UReport server over WebSocket, receives jobs, executes pipelines in your local workspace, and streams results back.
---

# ureport-agent

`ureport-agent` is a lightweight Node.js process that runs on your machine (or CI server). It connects to UReport over WebSocket, receives heal and rerun jobs, executes them in your local repository, and streams progress and results back.

---

## Requirements

- **Node.js 18+**
- **Git** configured with push access to your repository (SSH key or HTTPS credentials) — required for Auto-Heal checkout stage
- **AI provider key** — `GEMINI_API_KEY` for `gemini-cli`. `claude-cli` authenticates via browser OAuth (`~/.claude/` config) — no API key needed.
- The **auto-heal** plugin must be installed on the UReport server

---

## Download and Install

1. Go to **My Agent** (`/agent`) in UReport.
2. Click **Download .tar.gz** (macOS/Linux) or **Download .zip** (Windows).
3. Extract the archive:

```bash
tar -xzf ureport-agent.tar.gz
cd ureport-agent
```

No `npm install` needed — production dependencies are bundled.

---

## Configuration

Copy `ureport-agent.yml.example` to `ureport-agent.yml` and fill in your values:

```yaml
# ── Required ──────────────────────────────────────────────────────────────────
ureport_url: https://your-ureport-server
agent_token: YOUR_TOKEN_HERE

# Root workspace — agent stores per-lane repos here
repo_path: /tmp/ureport-agent-workspace

# ── Optional ──────────────────────────────────────────────────────────────────
# Max minutes to wait for a single claude --print invocation (default: 30)
# claude_cli_timeout_minutes: 30

# Max minutes to wait for a single gemini -p invocation (default: 30)
# gemini_cli_timeout_minutes: 30

# Self-hosted GitHub Enterprise / GitLab (see "Self-hosted Git" below)
# git_hosts:
#   git.mycompany.com:
#     provider: github

# ── Security (all optional, see "Security Options" below) ─────────────────────
# signing_secret: your-secret-here
# allowed_run_prefixes:
#   - npx playwright test
#   - npm test
# accept_job_types:
#   - heal
#   - rerun
# audit_log: ./ureport-agent-audit.log
```

### Configuration Reference

| Field | Required | Default | Description |
|---|---|---|---|
| `ureport_url` | Yes | — | Full URL to your UReport server (no trailing slash). HTTP and HTTPS both supported. |
| `agent_token` | Yes | — | Agent token generated from the UReport UI. |
| `repo_path` | No | `./workspace` | Root directory where the agent clones repositories. One subdirectory per product lane. |
| `claude_cli_timeout_minutes` | No | `30` | Maximum minutes to wait for a single `claude --print` invocation to complete. |
| `gemini_cli_timeout_minutes` | No | `30` | Maximum minutes to wait for a single `gemini -p` invocation to complete. |
| `git_hosts` | No | — | Maps self-hosted git hostnames to a provider so the Create PR stage can open PRs there. See [Self-hosted Git](#self-hosted-git). |
| `signing_secret` | No | — | Shared secret used to verify that jobs really come from your UReport server. See [Security Options](#security-options). |
| `allowed_run_prefixes` | No | — | List of command prefixes the agent may run for Verify and Rerun. Anything else is blocked. |
| `accept_job_types` | No | `heal`, `rerun` | Job types this agent accepts. Set to one value to restrict the agent. |
| `audit_log` | No | — | File path. When set, the agent appends one JSON line per job received, rejected, blocked and finished. |

### Self-hosted Git

The Create PR stage works with `github.com`, `gitlab.com` and `bitbucket.org` out of the box. For a self-hosted **GitHub Enterprise** or **self-managed GitLab**, tell the agent which provider a hostname uses:

```yaml
git_hosts:
  git.mycompany.com:
    provider: github
  gitlab.mycompany.com:
    provider: gitlab
    api_url: https://gitlab.mycompany.com/api/v4
```

| Field | Required | Description |
|---|---|---|
| *(key)* | Yes | Hostname exactly as it appears in the playbook's Git Remote URL, without a port. |
| `provider` | Yes | `github` or `gitlab`. |
| `api_url` | No | API base URL. Defaults to `https://<host>/api/v3` (GitHub) or `https://<host>/api/v4` (GitLab). Set it explicitly if the server uses a custom port or path. |

Notes:
- This is configured on the agent machine only, never in the playbook. The playbook's API token is sent to the API host configured here, so it is deliberately not something a playbook can change.
- An invalid entry stops the agent at startup with `invalid config: git_hosts.<host>: ...`.
- Bitbucket Server / Data Center and Azure DevOps are not supported.

### Security Options

All four are optional and independent, and the agent works with none of them set. They protect the machine the agent runs on, because the agent executes commands from jobs sent by the server.

| Setting | When not set |
|---|---|
| `signing_secret` | Every job is accepted, with no signature check. |
| `allowed_run_prefixes` | Any Verify or Rerun command is allowed (command substitution is still blocked). |
| `accept_job_types` | Both `heal` and `rerun` jobs are accepted. |
| `audit_log` | **No audit log is written.** There is no default file. |

**`signing_secret` — verify jobs come from your server**

When set, the agent only runs a job whose message carries a valid HMAC-SHA256 signature made with the same secret. The server signs jobs with the `HEAL_SIGNING_SECRET` environment variable, so both must hold the **same value**:

```yaml
signing_secret: a-long-random-string
```

A job with a missing or wrong signature is rejected and logged (`invalid signature`). Leave `signing_secret` out and the agent accepts every job, as before. If you set it on the agent but not on the server, every job is rejected.

**`allowed_run_prefixes` — limit what commands can run**

```yaml
allowed_run_prefixes:
  - npx playwright test
  - npm test
```

- Applies to the commands the agent runs for the **Verify** stage and for **Rerun**. If a command does not start with one of the prefixes, it is blocked and the job reports the reason.
- The check is a plain "starts with" match. It does not stop a command from chaining more commands after an allowed prefix (for example `npm test && other-command`), so treat it as a guard against mistakes and unexpected commands, not as a sandbox.
- It does not apply to the playbook's **Install Command** or to the AI provider's own actions in the workspace.
- Leave it out and any Verify or Rerun command is allowed.

Commands containing a backtick or `$(...)` (command substitution) or a null character are **always** blocked, with or without this setting.

**`accept_job_types` — restrict what the agent does**

```yaml
accept_job_types:
  - rerun
```

Allowed values are `heal` and `rerun`. The default is both. A job of a type that is not listed is ignored and logged. Use it, for example, to make a shared CI machine run reruns only. The agent also reports its accepted types to the server when it connects.

**`audit_log` — keep a record of what ran**

```yaml
audit_log: ./ureport-agent-audit.log
```

The agent appends one JSON object per line. A relative path is resolved against the folder you start the agent from.

| `event` | When | Other fields |
|---|---|---|
| `job_received` | A job passed the checks and was accepted | `type`, `signal_id`, `mode` (heal jobs) |
| `job_rejected` | Invalid signature, or job type not in `accept_job_types` | `reason`, `signal_id` |
| `command_blocked` | A Verify or Rerun command failed the allowlist | `stage`, `reason`, `cmd` |
| `job_result` | The job finished | `type`, `signal_id`, `status` |

Every line also has a `ts` ISO timestamp. If the log can't be written, the agent prints a warning and keeps running. The file is never rotated or trimmed by the agent.

### Environment Variables

| Variable | When Required |
|---|---|
| `GEMINI_API_KEY` | Any playbook using the `gemini-cli` provider |

`claude-cli` does **not** use an API key — it authenticates via browser OAuth. Run `claude` once on the agent machine to log in; credentials are stored in `~/.claude/`.

Set these in your shell environment before starting the agent, or use a process manager that injects them.

---

## Token Types

There are two types of agent tokens, each for a different purpose:

### Personal Agent Token

Generated by any user from the **My Agent** page (`/agent`). Used for:
- **Rerun** — when you trigger a rerun on a test, the job is sent exclusively to your own agent.
- **Auto-Heal fallback** — if no global agent is connected, Auto-Heal falls back to your personal agent.

Each user can have one personal agent token at a time. Regenerating replaces the previous token and disconnects the existing agent.

### Global Agent Token

Generated by **admins** from the **Global Agents** tab on the Auto-Heal page. Used for:
- **Auto-Heal** — the plugin routes heal jobs to any connected global agent first.

Multiple global tokens can exist simultaneously (e.g. one per CI runner or machine). The plugin picks a connected one at dispatch time.

---

## Generating a Token

**Personal token:**
1. Go to **My Agent** (`/agent`).
2. Click **Generate Agent Token**.
3. Give it a name (e.g. `My MacBook`, `CI Runner`).
4. Copy the token — shown **only once**. Store it in `ureport-agent.yml`.

**Global token (admin only):**
1. Go to **Tests → Auto-Heal → Global Agents** tab.
2. Click **Generate Token**.
3. Copy and configure on the agent machine.

---

## Running the Agent

```bash
cd ureport-agent
node agent.js
```

To use a config file at a custom path:

```bash
node agent.js /path/to/ureport-agent.yml
```

On startup, the agent logs its version, server URL, and workspace path:

```
[agent] ureport-agent v0.2.1
[agent] server:    https://your-ureport-server
[agent] workspace: /tmp/ureport-agent-workspace
[agent] connecting to wss://your-ureport-server/ws/agent
[agent] connected
[agent] registered as: My MacBook
```

---

## How It Works

### WebSocket Connection

The agent opens a persistent WebSocket connection to `{ureport_url}/ws/agent` using its token as a Bearer header. On connect, it sends a `hello` message with its version. The server registers it and sends back `registered`.

The agent sends a **ping** every 30 seconds to keep the connection alive. If the connection drops for any reason, the agent waits 5 seconds and automatically reconnects — no manual restart needed.

### Job Dispatch Routing

**Auto-Heal jobs (`heal_job`):**
1. Plugin looks for a connected **global agent** on the worker that handled the HTTP request.
2. If none found locally, broadcasts via cluster IPC — other workers check their connected global agents.
3. If still no global agent, falls back to the triggering user's own personal agent (same two-step process).
4. Jobs are never sent to another user's personal agent.

**Rerun jobs (`rerun_job`):**
- Always sent exclusively to the triggering user's personal agent.
- Global agents **never** receive rerun jobs.
- If the user has no connected agent, the rerun signal is created with status `no_agent`.

### Job Execution

The agent executes **one job at a time** — a single global flag, not per lane. If a second job arrives while one is running, the agent drops it; the signal stays `queued` and is dispatched again when the current job finishes. Progress messages are streamed back in real time and visible in the signal detail view.

### Workspace Layout

The agent creates subdirectories inside `repo_path`:

```
/tmp/ureport-agent-workspace/
  myapp__e2e/          ← Auto-Heal guided: workspace for myapp / e2e lane
  myapp__regression/   ← Auto-Heal guided: workspace for myapp / regression lane
  rerun__<key>/        ← Rerun (checkout mode): separate workspace per rerun config
```

- **Auto-Heal guided/delegation:** one directory per product+type lane (`product__type`). Cloned on first run; fetched and reset on subsequent runs; a new fix branch is created each time.
- **Rerun (checkout mode):** directory named `rerun__<key>` based on the test UID. Cloned on first run; fetched and reset to base branch on subsequent runs. No new branch — runs directly on base.
- **Rerun (local mode):** no workspace created — the agent `cd`s into the configured local path as-is.

---

## Agent Status in UReport

The **My Agent** page (`/agent`) shows the connection status of your agent:

| Status | Meaning |
|---|---|
| **Connected** | Agent is connected and ready to receive jobs |
| **Disconnected** | Agent has connected before but is not currently connected |
| **Never Connected** | Token exists but the agent has never connected |

Admins see a **Global Agents** tab (all global tokens and their status) and a **User Agents** tab (all user-owned agents).

---

## Running as a Service

To keep the agent running in the background and restart on failure, use a process manager.

**pm2:**

```bash
npm install -g pm2
pm2 start agent.js --name ureport-agent
pm2 save
pm2 startup
```

**systemd** (Linux):

```ini
[Unit]
Description=ureport-agent
After=network.target

[Service]
WorkingDirectory=/opt/ureport-agent
ExecStart=/usr/bin/node agent.js
Restart=always
# Environment=GEMINI_API_KEY=your-key   ← only needed for gemini-cli playbooks

[Install]
WantedBy=multi-user.target
```

---

## Troubleshooting

**`config not found: ureport-agent.yml`**
Copy `ureport-agent.yml.example` to `ureport-agent.yml` and fill in `ureport_url` and `agent_token`.

**`replace PASTE_YOUR_TOKEN_HERE with a real token`**
Generate a token from the UReport **My Agent** page and paste it into `ureport-agent.yml`.

**Auto-Heal signal stays `no_agent`**
No connected agent was available at dispatch time. Either connect a global agent (Admin → Auto-Heal → Global Agents) or connect your personal agent. Global agents are preferred; your own personal agent is used as fallback.

**Rerun signal stays `no_agent`**
Rerun jobs are sent only to your personal agent. Go to **My Agent** (`/agent`), generate a token, and start the agent with it.

**`heal_job REJECTED — invalid signature`**
`signing_secret` in `ureport-agent.yml` does not match `HEAL_SIGNING_SECRET` on the UReport server, or only one of them is set. Make both the same value, or remove `signing_secret` from the agent.

**Verify or Rerun reports `command does not match any allowed prefix`**
The command does not start with any entry in `allowed_run_prefixes`. Add the prefix to the list or change the command in the playbook.

**`GEMINI_API_KEY env var not set`**
Set `GEMINI_API_KEY` in the shell environment before starting the agent (only needed for `gemini-cli` playbooks).

**`checkout.remote is not set in the playbook`**
Add a Git Remote URL to the Checkout stage in the playbook configuration.

**PR creation fails with `GitHub API 422`**
The fix branch may already exist remotely from a previous run. Delete the stale branch from GitHub or change the branch prefix in the playbook. The same applies to GitLab and Bitbucket errors about an existing branch or merge request.

**`Unsupported git host "<host>"`**
The remote URL's host is not github.com, gitlab.com or bitbucket.org. For a self-hosted GitHub Enterprise or GitLab, add the host to `git_hosts` in `ureport-agent.yml` (see [Self-hosted Git](#self-hosted-git)) and restart the agent. The check runs before anything is pushed.

**`No git remote found. Set the repo URL in the playbook's Checkout settings.`**
The Create PR stage found no repository URL. Set **Git Remote URL** in the playbook's Checkout stage.

**Bitbucket PR created without reviewers**
Check the agent log for `Could not read default reviewers`. The token needs repository read permission as well as pull request write, and default reviewers must be configured on the repository or its project.

**`Agent did not call finish() within turn limit`**
Agent Delegation hit the 20-turn limit without completing. Use a more specific prompt, or switch to Guided mode for predictable pipelines.

---

Next: [Administration →](./administration)
