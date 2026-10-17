---
sidebar_position: 9
title: Auto-Heal
description: Automatically fix failing tests using AI, and rerun tests on your local agent. Auto-Heal detects failures, dispatches a repair job to an agent running on your machine, applies a code fix, verifies it passes, and opens a pull request — all without manual intervention.
---

# Auto-Heal

Auto-Heal detects failing tests, dispatches a repair job to an agent on your machine, applies an AI-generated code fix, verifies the fix passes, and opens a pull request — end to end, without manual steps.

The **Rerun** feature lets you run any test on your own agent without AI involvement — useful for verifying a test locally, reproducing a flake, or running with a different environment.

---

## Requirements

- **License** — Auto-Heal is an enterprise feature included in the same license tier as Auto-Triage.
- **Plugin** — Install the `auto-heal` plugin from **Plugin Center** before use.
- **Agent** — At least one connected agent (global or user-owned). See [ureport-agent](./ureport-agent) for setup.

---

## How Auto-Heal Works

```
Failing test in a build
        ↓
Trigger Auto-Heal (manual or future: automatic)
        ↓
Plugin creates a HealSignal (status: pending → queued)
        ↓
Plugin dispatches heal_job to a connected agent over WebSocket
        ↓
Agent runs the playbook pipeline on your machine
        ↓
Agent streams progress back in real time
        ↓
Signal updated with final status (pr_created / test_failed / bug_confirmed / error)
```

Everything after the trigger is autonomous. You review the result in the Signals tab.

### Agent Dispatch Priority

1. A connected **global agent** on the same server worker is used first.
2. If none, the plugin broadcasts via cluster IPC — other workers check their global agents.
3. If still no global agent, the triggering user's own **personal agent** is used as fallback.
4. Jobs are never sent to another user's personal agent.

Global agents **only** receive `heal_job` messages. Rerun jobs always go to the triggering user's personal agent — a global agent never handles a rerun.

### One Job at a Time

The agent executes **one job at a time** — this is a global limit, not per product lane. The agent maintains a single `_currentJob` flag. If a second job arrives while one is running, it is dropped and stays `queued` in UReport until the running job finishes and the server dispatches the next one.

The workspace is still organized per product lane (separate checkout directories), so multiple lanes can have their own repos cloned — but they are worked on sequentially, not in parallel.

### Dispatch and Recovery

There is **no server-side queue buffer**. On trigger, the server immediately tries to send the job over WebSocket. The signal status reflects what happened:

| Signal status after trigger | Meaning |
|---|---|
| `queued` | Job sent to agent — agent has received it but not started yet |
| `no_agent` | No connected agent found — job was not sent |

**Stuck signal recovery:** When a global agent reconnects (sends its `hello` handshake), the server automatically re-dispatches all signals still in `pending` or `queued` state to that agent. This handles the case where the agent was offline when the signal was created or crashed mid-job.

:::info
User (personal) agents do not trigger re-dispatch on reconnect — only global agents do.
:::

The agent executes **one job at a time**. If a second `heal_job` arrives while the agent is busy, the agent drops it — there is no agent-side queue buffer. The signal stays `queued` in UReport.

The server handles this in two ways:
1. **On job completion** — when the agent finishes a job and sends its `result`, the server immediately dispatches the next oldest `queued` signal to the same agent.
2. **On reconnect** — when an agent reconnects and sends its `hello`, the server re-dispatches all signals still in `pending` or `queued` state.

This means triggering multiple heals in quick succession works correctly — they are processed one by one in the order they were created.

### Queue Limits and Position

- **Queue limit:** At most 20 signals may be in `pending` or `queued` state at once. Triggering more returns HTTP 429.
- **Queue position:** When a signal is queued, the API response includes a `queuePosition` field (1 = next to run). The UI displays this as **Queue #N** on the status badge so you can see where in line your signal is.

### Watchdog

A server-side watchdog runs every 5 minutes. Any heal signal still in `running` state after **240 minutes** is automatically marked `timed_out`. This ensures the queue never gets permanently blocked by a hung agent job.

### Agent Disconnect

If an agent disconnects while a job is running, the server immediately marks that signal `error` with the message `Agent "<name>" disconnected while job was running`. Other queued signals remain in the queue and are re-dispatched when the agent reconnects.

---

## Playbooks

A **playbook** defines what the agent does when a heal job is dispatched. You configure playbooks once and reuse them across any test.

### Modes

| Mode | Description |
|---|---|
| **Guided** | You configure a fixed pipeline of up to 4 stages. The agent executes each enabled stage in sequence. Predictable, auditable. |
| **Agent Delegation** | Hand off to an AI agent (Claude). Describe the goal in a prompt; the agent explores the repo and figures out how to fix the test autonomously. |

---

## Guided Pipeline Stages

### Stage 1 — Checkout

Clones the repository (first run) or fetches and resets it (subsequent runs), then creates a new branch for the fix.

| Setting | Description |
|---|---|
| **Git Remote URL** | SSH or HTTPS URL used to clone the repo (e.g. `git@github.com:org/repo.git`) |
| **Branch Prefix** | Prefix for the fix branch name (default: `fix/auto-`) — combined with the test name and signal ID |
| **Base Branch** | Branch to branch off from (default: `main`). If not found, the agent detects the remote default. |
| **Install Command** | Optional command to run after checkout (e.g. `npm ci`, `pip install -r requirements.txt`) |

The agent stores one workspace per product lane under `repo_path`:
```
/tmp/ureport-agent-workspace/
  myapp__e2e/          ← cloned for myapp / e2e lane
  myapp__regression/
```

Git credentials must already be configured on the agent machine — no credentials are stored in UReport.

---

### Stage 2 — AI Fix

Sends the failing test details to an AI model and applies the returned code changes to the workspace.

| Setting | Description |
|---|---|
| **Provider** | `Anthropic (Claude)`, `OpenAI (GPT)`, `Google Gemini`, or `Claude CLI` |
| **Model** | Model name passed to the API (e.g. `claude-sonnet-4-6`, `gpt-4o`, `gemini-2.0-flash`). Not used for Claude CLI. |
| **Instructions** | Prompt sent to the AI describing what to fix. Supports test variable placeholders (see below). |
| **Max Attempts** | Claude CLI only — how many fix+verify cycles to attempt before giving up (1–5, default 2). |

**API providers** (Anthropic, OpenAI, Gemini) receive the failing test file content, error message, and stack trace. They return a JSON response with `analysis` and `changes` (list of `{file, content}` pairs). The agent writes the changed files and stages them.

**Claude CLI** runs `claude --print --output-format json` in the workspace directory. Claude has native file tools and explores the repo itself. It runs the test internally and self-reports whether it passed via `testPassed` in its JSON output. When `Max Attempts > 1`, failed fix attempts are reset (`git checkout HEAD`) and Claude is retried with the previous failure output as context.

#### Environment Variables for AI Providers

| Provider | Required |
|---|---|
| Anthropic | `ANTHROPIC_API_KEY` on the agent machine |
| OpenAI | `OPENAI_API_KEY` on the agent machine |
| Gemini | `GEMINI_API_KEY` on the agent machine |
| Claude CLI | `ANTHROPIC_API_KEY` (used by the Claude CLI binary) |

#### Instructions Placeholders

All placeholders are resolved by the plugin before dispatching.

| Placeholder | Value |
|---|---|
| `{test.name}` | Full test name / title |
| `{test.file}` | Repo-relative path to the test file |
| `{test.uid}` | Test unique identifier |
| `{test.error_message}` | Last error message |
| `{test.stack_trace}` | Stack trace |
| `{test.tags}` | All tags, space-joined |
| `{test.tags[0]}` | First tag |
| `{test.components}` | All components, space-joined |
| `{test.teams}` | All teams, space-joined |
| `{test.customRelation.KEY}` | Any custom relation field |
| `{test.info.KEY}` | Any raw test info field |

---

### Stage 3 — Verify

Runs the test command after the AI fix to confirm it passes.

| Setting | Description |
|---|---|
| **Test Command** | Shell command to run. Supports `{test.file}`, `{test.name}`, `{test.uid}`, `{test.tags}`, `{test.components}`, `{test.teams}` placeholders. Leave blank to use `npm test`. |
| **Environment Variables** | `KEY=VALUE` pairs (one per line) injected into the process environment. |

:::info
When using Claude CLI as the AI provider, this stage is automatically skipped — Claude runs and verifies the test internally during the AI Fix stage.
:::

If the test still fails after the fix, the signal status becomes `test_failed`. If **Create PR even if test still fails** is enabled in the Create PR stage, a WIP PR is still opened with a `[WIP]` title prefix.

---

### Stage 4 — Create PR

Commits the changes, pushes the fix branch, and opens a pull request.

| Setting | Description |
|---|---|
| **PR Title Template** | Title of the PR. Supports `{test.name}` and other test placeholders. Default: `fix: auto-heal {test.name}`. |
| **Target Branch** | Branch the PR merges into (default: `main`). |
| **API Token** | GitHub personal access token (repo scope) or Bitbucket app password. Stored in the playbook, not on the agent. |
| **Username** | Bitbucket only — required when using a Bitbucket app password. Leave blank for repository access tokens. |
| **Create PR even if test still fails** | Opens a `[WIP]` PR if the Verify stage fails. Useful to capture partial progress. |

The provider is **auto-detected** from the remote URL:
- `github.com` → GitHub API
- `bitbucket.org` → Bitbucket API

The PR body includes the AI analysis, a diff summary, the original error, and a link back to the UReport signal.

---

## Agent Delegation Mode

In Agent Delegation mode, the playbook has a single **Goal / Prompt** field. The agent receives this prompt along with the failing test details and autonomously:

1. Explores the repository with file tools (`read_file`, `write_file`, `list_directory`)
2. Runs commands (`run_command`) — typically to install deps and run the test
3. Calls `finish(success, summary)` when done

If `success = true`, the agent stages all changes and the signal status becomes `completed`.
If `success = false`, the agent believes the test reflects a real product bug — status becomes `bug_confirmed`.

Agent Delegation requires `ANTHROPIC_API_KEY` on the agent machine and uses the `ai_model` from the agent config (default: `claude-sonnet-4-6`).

:::info
Agent Delegation does not automatically commit or push — it stops at `completed` with staged changes. A Create PR stage is not available in this mode. The staged diff is captured and shown in the signal detail.
:::

---

## Signal Statuses

Each Auto-Heal run creates a **HealSignal** that tracks progress from dispatch to outcome.

| Status | Meaning |
|---|---|
| `pending` | Created, waiting to be dispatched |
| `queued` | Dispatched — waiting for agent to pick up |
| `running` | Agent is actively executing the pipeline |
| `pr_created` | Fix applied, test passed, PR opened |
| `test_failed` | Fix applied but test still failing |
| `bug_confirmed` | Agent determined the test reflects a real product bug (delegation mode) |
| `completed` | Pipeline completed successfully without a PR stage |
| `error` | Pipeline failed at a stage (checkout, AI fix, verify, or create PR) |
| `timed_out` | Agent did not respond within the timeout window |
| `no_agent` | No connected agent available at dispatch time |

---

## Managing Playbooks

Go to **Tests → Auto-Heal → Playbooks** tab.

- **New Playbook** — Create a new guided or agent delegation playbook (admin only).
- **Edit** — Modify an existing playbook (admin only).
- **Delete** — Permanently remove a playbook (admin only).
- **Active toggle** — Enable or disable a playbook. Disabled playbooks cannot be selected for new heal jobs.

Operators can view playbooks but cannot create, edit, or delete them.

---

## Triggering Auto-Heal

Auto-Heal is triggered from the **Launches** page. Open a build, find a failing test, and click the **Auto Heal** button in the AI Actions bar. A dialog lets you select which playbook to use.

The signal appears immediately in the **Signals** tab with status `pending` → `queued` as the job is dispatched.

The **Auto Heal** button is visible when at least one agent is connected — either a global agent or your own personal agent.

---

## Viewing Signals

Go to **Tests → Auto-Heal → Signals** tab. Each row shows:
- Test name and product lane
- Current status (live — refreshable)
- Result summary (e.g. PR branch name, error detail, bug severity)
- Duration from trigger to completion
- Trigger time

Click the **detail icon** on any signal to open the full signal view — including per-stage output, AI analysis, the diff, test output, and history of previous signals for the same test.

Admins can delete signals. Operators have read-only access.

---

## Rerun

The **Rerun** feature lets you run a test on your personal agent without AI involvement. It is useful for:
- Reproducing a failure locally
- Verifying a fix before committing
- Running with a specific environment or config

Rerun jobs are always sent to **your own personal agent** — not a global agent. You must have a connected personal agent for rerun to work.

### Rerun Configs

Before triggering a rerun, you must set up at least one **Rerun Config**. Go to **Tests → Auto-Heal → Reruns** tab.

Each config defines:

| Field | Description |
|---|---|
| **Name** | A label to identify this config (useful when you have multiple per lane) |
| **Product / Type** | The lane this config applies to. Multiple configs can share the same lane. |
| **Repo Mode** | `local` — agent `cd`s into a local path. `checkout` — agent clones/pulls the repo. |
| **Local Path** | (local mode) Absolute path on the agent machine to `cd` into |
| **Git Remote URL** | (checkout mode) Remote URL to clone |
| **Base Branch** | (checkout mode) Branch to pull/reset to |
| **Install Command** | (checkout mode) Optional command to run after checkout (e.g. `npm ci`) |
| **Environment Variables** | `KEY=VALUE` pairs exported before the command runs. Supports placeholders. |
| **Command** | The shell command to run the test. Supports placeholders. |
| **Timeout** | Maximum minutes before the agent kills the command. |

Rerun configs are **private** — other users cannot see or use them.

#### Placeholders

Supported in both **Command** and **Environment Variables**:

| Placeholder | Value |
|---|---|
| `{test.name}` | Full test name / title |
| `{test.file}` | Repo-relative path to the test file |
| `{test.uid}` | Test unique identifier |
| `{test.tags}` | All tags, space-joined |
| `{test.customRelation.KEY}` | Any custom relation field |

Example command: `npx playwright test {test.file} --grep "{test.name}"`

#### Multiple Configs per Lane

You can create multiple configs for the same product/type lane — for example, one for staging and one for production. When triggering a rerun with multiple configs on the same lane, a picker appears in the confirmation dialog so you can choose which config to use.

Use **Duplicate** on any existing config to quickly create a variant.

### Triggering a Rerun

1. Open any test in **Launches**.
2. Click **Rerun** in the AI Actions bar.
3. A dialog shows a preview of the resolved command and repo info.
4. If multiple configs exist for this lane, select the one to use.
5. Click **Trigger Rerun**.

The rerun signal appears in the **Reruns** section of the AI Actions bar with a live status tag. If the run fails or errors, click the status tag to expand the exit code and terminal output inline.

### Rerun Signal Statuses

| Status | Meaning |
|---|---|
| `pending` | Created, waiting to be dispatched |
| `queued` | Dispatched — agent has received the job |
| `running` | Agent is executing the command |
| `passed` | Command exited with code 0 |
| `failed` | Command exited with non-zero code |
| `error` | Agent encountered an error before or during execution |
| `no_agent` | No personal agent connected at dispatch time |

### Dispatch Behavior

Like Auto-Heal, there is no server-side queue for reruns. The job is sent immediately over WebSocket on trigger.

Unlike Auto-Heal, **rerun signals are not automatically re-dispatched** when your agent reconnects. If your agent was offline or disconnected before picking up the job, the signal stays stuck at `queued`. Trigger a new rerun to retry.

| Scenario | Result |
|---|---|
| Agent connected at trigger time | Signal → `queued` → agent picks up → `running` |
| Agent offline at trigger time | Signal → `no_agent`, not retried |
| Agent disconnects after `queued` but before starting | Signal stays `queued` — trigger a new rerun |
| Agent disconnects while running | Signal → `error` immediately |

### Queue Limits and Position

- **Queue limit:** At most 5 rerun signals per user may be `pending` or `queued` at once. Triggering more returns HTTP 429.
- **Queue position:** The status badge in the AI Actions bar shows **Queue #N** when your rerun is waiting.
- **Sequential dispatch:** After a rerun completes, the server automatically dispatches the next `pending`/`queued` rerun for the same user to the same agent — no manual re-trigger needed.

### Watchdog

The server-side watchdog runs every 5 minutes and marks any rerun signal stuck in `running` for more than **90 minutes** as `timed_out`.

---

## RBAC

| Action | Admin | Operator |
|---|---|---|
| View playbooks | ✓ | ✓ |
| Create / edit / delete playbooks | ✓ | — |
| Toggle playbook active | ✓ | — |
| Trigger Auto-Heal on a test | ✓ | ✓ |
| View signals | ✓ | ✓ |
| Delete signals | ✓ | — |
| Create / edit / delete rerun configs | ✓ | ✓ (own only) |
| Trigger rerun | ✓ | ✓ |
| Access /auto-heal page | ✓ | ✓ |

Both roles require the auto-heal license and the `auto-heal` plugin to be installed.

---

Next: [ureport-agent →](./ureport-agent)
