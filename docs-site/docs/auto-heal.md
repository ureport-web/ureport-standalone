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

## Three Ways to Use Auto-Heal

| Mode | Who executes the fix | Infrastructure needed | When to use |
|---|---|---|---|
| **Guided** (playbook) | ureport-agent runs a fixed pipeline: checkout → AI fix → verify → open PR | Install ureport-agent; configure a guided playbook | Predictable, auditable pipeline with explicit steps |
| **Agent Delegation** (playbook) | ureport-agent hands off to Claude; Claude explores and fixes autonomously | Install ureport-agent; configure a delegation playbook | You want the AI agent to decide how to fix with minimal configuration |
| **External Consumer** | Your own system — any language, any AI, any workflow | Build a poller that calls the signals API | You already have an AI automation platform and want UReport to surface failures and accept outcomes. Each signal carries a full failure snapshot (error message, stack trace) and lane history so your system has everything it needs without extra API calls. |

---

## How Auto-Heal Works

**Agent mode (Guided or Agent Delegation):**

```
Failing test in a build
        ↓
Trigger Auto-Heal (manual or auto-trigger on build complete)
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

**External Consumer mode:**

```
Failing test in a build
        ↓
Auto-trigger fires (dispatch_mode: external in lane settings)
        ↓
Plugin creates a HealSignal (status: open)
        ↓
Your system polls GET /api/ai/heal/signals?status=open
        ↓
Your system claims the signal: POST /signals/:id/claim
        ↓
Your system processes the fix (any language, any AI)
        ↓
Your system reports the outcome: PUT /signals/:id
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
| **Provider** | `claude-cli` — Claude CLI (Anthropic). `gemini-cli` — Gemini CLI (Google). |
| **Model** | `gemini-cli` only — model flag passed to the Gemini CLI (e.g. `gemini-2.0-flash`). Not used for `claude-cli`. |
| **Instructions** | Prompt sent to the AI describing what to fix. Supports test variable placeholders (see below). |
| **Max Attempts** | How many fix+verify cycles to attempt before giving up (1–5, default 2). Each failed attempt resets changed files and retries with the previous failure output as context. |

Both providers run as a CLI process in the agent's workspace directory. They have native file tools to explore the repo, apply changes, run the test, and self-report whether it passed via `testPassed` in their JSON output.

- **`claude-cli`** — runs `claude --print --output-format json <prompt>`. Requires `ANTHROPIC_API_KEY` on the agent machine.
- **`gemini-cli`** — runs `gemini -p <prompt> --yolo [--model <model>]`. Requires `GEMINI_API_KEY` on the agent machine (or authentication via `gemini auth login`).

#### Authentication for AI Providers

| Provider | Authentication |
|---|---|
| `claude-cli` | Browser OAuth — run `claude` once on the agent machine to log in. Credentials stored in `~/.claude/`. No API key needed. |
| `gemini-cli` | `GEMINI_API_KEY` env var on the agent machine, or `gemini auth login`. |

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
| `{test.tags[0]}` | First tag (`[1]` is the second, and so on; empty when there is no such tag) |
| `{test.components}` | All components, space-joined |
| `{test.components[0]}` | First component |
| `{test.teams}` | All teams, space-joined |
| `{test.teams[0]}` | First team |
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
| **API Token** | Personal access token for the git host: GitHub (repo scope), GitLab (`api` scope), or a Bitbucket app password / repository access token. Stored in the playbook, not on the agent. |
| **Username** | Bitbucket only — required when using a Bitbucket app password. Leave blank for repository access tokens. |
| **Create PR even if test still fails** | Opens a `[WIP]` PR if the Verify stage fails. Useful to capture partial progress. |

The provider is **auto-detected** from the Git Remote URL (HTTPS, `ssh://` and `git@host:path` forms all work). Nothing is selected in the playbook:

| Remote host | Opens a | Notes |
|---|---|---|
| `github.com` | GitHub pull request | |
| `gitlab.com` | GitLab merge request | Nested groups (`group/subgroup/project`) are supported. |
| `bitbucket.org` | Bitbucket Cloud pull request | The repository's **default reviewers** are added automatically (see below). |
| Your own GitHub Enterprise or self-managed GitLab host | Same as above | Add the host to `git_hosts` in the agent's `ureport-agent.yml`. See [Self-hosted Git](./ureport-agent#self-hosted-git). |

If the remote host is not recognised, the agent stops **before** pushing anything and reports `Unsupported git host "<host>"`, so no stray branch is left behind. Bitbucket Server / Data Center and Azure DevOps are not supported.

#### Default reviewers (Bitbucket Cloud)

Bitbucket does not add default reviewers to pull requests created through its API, so the agent looks them up (repository and project level) and adds them to the PR. You do not configure anything in the playbook.

- The user that owns the API token is left out, because Bitbucket does not allow the author to review their own PR.
- If no default reviewers are configured, or they can't be read, the PR is still created without reviewers. A reviewer problem never fails the heal.
- Reading default reviewers needs **repository read** permission on the token in addition to pull request write. Without it the agent log shows `Could not read default reviewers (403)` and the PR has no reviewers.
- GitHub and GitLab PRs are created without reviewers.

The PR body includes the AI analysis, a diff summary, the original error, and a link back to the UReport signal.

---

## Agent Delegation Mode

In Agent Delegation mode, the playbook has a single **Goal / Prompt** field and a **Provider** setting. The agent receives the prompt along with the failing test details and autonomously explores and fixes the repo using the selected CLI tool.

| Provider | Behavior |
|---|---|
| `claude-cli` (default) | Runs `claude --print --output-format json`. Has native file and shell tools. Reports `testPassed` in JSON output. Requires `ANTHROPIC_API_KEY`. |
| `gemini-cli` | Runs `gemini -p <prompt> --yolo`. Reports `testPassed` in JSON output. Requires `GEMINI_API_KEY`. |

If the CLI reports `testPassed: true`, staged changes are kept and the signal status becomes `completed`.
If `testPassed: false`, the signal becomes `test_failed`.

:::info
Agent Delegation does not automatically commit or push — it stops at `completed` with staged changes. A Create PR stage is not available in this mode. The staged diff is captured and shown in the signal detail.
:::

:::warning Pre-cloned workspace required
Agent Delegation skips the checkout stage. The repository must already be cloned at the expected workspace path (`{repo_path}/{product}__{type}/`) before the first delegation job runs. If the path does not exist, the signal immediately errors with `workspace not found`. Use guided mode with the Checkout stage enabled if you do not want to pre-clone manually.
:::

---

## Signal Statuses

Each Auto-Heal run creates a **HealSignal** that tracks progress from dispatch to outcome. The statuses depend on the dispatch mode of the signal.

### Agent mode

The server sends the job to a connected ureport-agent. The agent reports progress and the final outcome back over the WebSocket.

| Status | Set by | Final? | Meaning |
|---|---|---|---|
| `pending` | Server | No | Created, waiting to be dispatched to an agent. |
| `queued` | Server | No | Sent to the agent, which has not started it yet. |
| `running` | Agent | No | The agent is executing the pipeline. |
| `pr_created` | Agent | Yes | A fix was applied, the test passed and a pull request was opened. |
| `completed` | Agent | Yes | The run finished **without a pull request**. This covers three cases. See [When no pull request is created](#when-no-pull-request-is-created). |
| `test_failed` | Agent | Yes | A fix was tried and the test still fails. A WIP pull request is opened only if **Create PR even if the test still fails** is on. |
| `error` | Agent | Yes | The run could not finish. For example a stage failed, or the agent refused the job. `errorDetail` says why. |
| `timed_out` | Server | Yes | The signal stayed `running` for more than 240 minutes. The watchdog marks it. |
| `no_agent` | Server | Yes | No connected agent was available at dispatch time. |

`bug_confirmed` is not used in agent mode. The bundled agent never reports it. It exists for [external consumers](#external-consumer-api).

An agent that cannot take a job reports it to the server, and the signal moves to `error` with an explanation. It does not stay `queued`. This happens when the job signature does not match (`signing_secret` on the agent versus `HEAL_SIGNING_SECRET` on the server) or when the job type is not in the agent's `accept_job_types`. A job that arrives while the agent is busy is not refused. It stays `queued` and is sent again when the agent finishes its current job.

### External mode

Your own system claims the signal and reports the outcome through the [External Consumer API](#external-consumer-api). The server and the agent are not involved.

| Status | Set by | Final? | Meaning |
|---|---|---|---|
| `open` | Server | No | Created, waiting for an external consumer to claim it. |
| `claimed` | Consumer (`POST .../claim`) | No | A consumer claimed it and is working on it. Only a `claimed` signal can be updated. |
| `pr_created` | Consumer (`PUT`) | Yes | A fix was applied and a pull request was opened. Needs `pr_url`. |
| `completed` | Consumer (`PUT`) | Yes | The test passes and no pull request is needed. Needs `rerun_passed: true`. Optional `completion_reason`. |
| `test_failed` | Consumer (`PUT`) | Yes | A fix was tried and the test still fails. |
| `bug_confirmed` | Consumer (`PUT`) | Yes | The failure is a real product bug. Needs `bug_report.summary`. With `bug_tracking_url`, the affected tests are auto-triaged. |
| `error` | Consumer (`PUT`) | Yes | The consumer could not process the signal. Send `error_detail`. |
| `timed_out` | Consumer (`PUT`) | Yes | The consumer gave up waiting. |

The server does not time out `open` or `claimed` signals. A consumer that never reports leaves its signal `claimed`.

### When no pull request is created

`completed` means the run ended without a pull request and without an error. Use the signal detail to tell the cases apart:

| Case | Agent mode | External mode |
|---|---|---|
| The AI found nothing to change, so the branch is identical to the base branch | `completed`. The Create PR stage shows as skipped, and the AI analysis is on the signal. No branch is pushed. | `completed`, with `rerun_passed: true` if the test passes. |
| The test passes without a code change (flaky) | `completed`, `completion_reason: flaky`. UReport also marks the test as PASS (rerun pass). | `completed` with `completion_reason: flaky` and `rerun_passed: true`. UReport marks the test as PASS. |
| The failure cannot be reproduced | `completed` | `completed` with `completion_reason: not_reproducible` |
| Create PR stage is turned off in the playbook | `completed` | Not applicable |
| Agent Delegation run where the CLI reports the test passing | `completed`. Changes stay staged, nothing is committed or pushed. | Not applicable |
| The failure is a real product bug | Not reported by the bundled agent | `bug_confirmed` |
| A fix was tried and the test still fails | `test_failed` | `test_failed` |

The bundled agent sets `completion_reason: flaky` only for the flaky case above. `not_reproducible` is for external consumers.

In agent mode the test is marked PASS only when the agent saw it pass itself (the CLI self-verified, or the Verify stage passed) **and** the AI changed no files. A `completed` run with staged changes, or where the test was never run, leaves the test status unchanged.

---

## Managing Playbooks

Go to **Tests → Auto-Heal → Playbooks** tab.

- **New Playbook** — Create a new guided or agent delegation playbook (admin only).
- **Edit** — Modify an existing playbook (admin only).
- **Delete** — Permanently remove a playbook (admin only).
- **Active toggle** — Enable or disable a playbook. Disabled playbooks cannot be selected for new heal jobs.

Operators can view playbooks but cannot create, edit, or delete them.

In the playbook editor, **Test run** shows what the playbook would send to an agent for a real failing test, using your unsaved edits: your template on the left, the same text with that test's values filled in on the right. Nothing is saved or dispatched.

Ready-made settings for Playwright, Jest, Vitest and Pytest are in [Playbook Examples](./auto-heal-examples).

---

## Triggering Auto-Heal

### Manual Trigger

From the **Launches** page: open a build, find a failing test, click the **Auto Heal** button in the AI Actions bar. A dialog lets you select which playbook to use.

The signal appears immediately in the **Signals** tab with status `pending` → `queued` as the job is dispatched.

:::info Open external signal for the same test
If the lane uses `external` dispatch and the test already has an `open` signal that no consumer has claimed, the manual trigger hands **that** signal to the agent instead of creating a duplicate (the response is `200`, not `201`). Two cases are refused with `409`: an external consumer claimed the signal in the meantime, or no agent is connected — in that case the signal is left `open` for your consumer.
:::

The **Auto Heal** button is visible when at least one agent is connected — either a global agent or your own personal agent.

### Auto-Trigger

Auto-Heal can fire automatically when a build completes. It runs **after auto-triage** so that already-triaged tests are excluded before signaling.

**Enable auto-trigger:** go to **Settings → Product Lane Settings**, edit the product/type lane, and open the **Auto-Heal** section. The section is split into blocks, each with its own title:

| Block | What it holds |
|---|---|
| **Dispatch** | Turn Auto-Heal on, choose the dispatch mode and, for agent mode, the playbook. |
| **Lanes** | Which builds auto-heal runs on. |
| **Which failures to heal** | The criteria a failure must meet. |
| **Exclusions** | Tests that never open a signal. Rules save as soon as you add them. |
| **Additional instructions** | External dispatch mode only. |
| **Max signals per analysis** | A cost cap per build analysis. |

| Setting | Default | Description |
|---|---|---|
| **Enable Auto-Heal** | off | Turn on auto-trigger for this lane |
| **Dispatch Mode** | `agent` | `agent` — dispatch to ureport-agent via WebSocket. `external` — create `open` signals for your own consumer to poll and process. |
| **Playbook for auto-trigger** | — | Agent mode only, required. The playbook used when auto-heal fires on build complete. Manual heal from test detail always uses agent mode, whatever this says. |
| **Lanes** | none | Lane scopes. Auto-heal only runs on builds that match an **enabled** scope, so with none turned on it runs on nothing. A scope has an optional name and any of version, team, browser, device, platform, platform version, stage and extras. A blank scope matches every lane of the product and type; every field you set has to equal the build's value. A scope can be turned off without deleting it. Manual heal from test detail ignores scopes. |
| **New failures only** | on | Only trigger for tests that **passed** in the previous build — skips known persistent failures. |
| **Not quarantined** | off | Skip tests that are currently quarantined. |
| **Skip if failed in last N builds in a row** | 3 | Shown when **New failures only** is off. Skip a test if it failed in this many consecutive prior builds (likely a real bug, not a flaky fix candidate). Set to 0 to disable. |
| **Exclusions** | none | Tests that never open a signal: by error message, test UID, or file / path. See [Exclusion rules](#exclusion-rules). Applies to both dispatch modes. Manual heal from test detail is not affected. |
| **Additional instructions** | — | External dispatch mode only. Markdown, copied onto every signal as `additionalInstructions` for your consumer to pass to its AI. Agent mode takes its instructions from the playbook. |
| **Max signals per analysis** | 10 | Cap (1–50) on how many signals one analysis (one build completion event) creates. This is **not** a total for the lane. See the note below. |

:::warning Max signals is per analysis, not per lane
The limit applies to a single build analysis. Every build that completes in the lane is analysed on its own and can create up to this many signals. If 5 builds complete in the same lane with the limit set to 5, you can end up with up to 25 signals. Signals from earlier builds are not counted, and each signal runs one AI agent. The only de-duplication is per test: a test with the same error that already has a signal in the last 7 days is skipped. To control cost, use a low limit together with **New failures only**, **Skip if failed in last N builds** and a narrow lane scope.
:::

#### Filtering Order

On each build completion, auto-trigger determines the **final status per test UID** — when a test has multiple runs (retries), only the last run counts. Then it applies these exclusions in order:

1. **Final status is not FAIL** — tests that ultimately passed (including via rerun) are excluded.
2. **Exclusion rule** — excluded if an active [exclusion rule](#exclusion-rules) of the product and type covers this build's lane and matches the test.
3. **Active auto-triage coverage** — excluded if the test has a non-expired auto-triage record (`is_auto_triaged: true`) **and** the current failure fingerprint matches the investigated pattern. See [Triage exclusion rules](#triage-exclusion-rules) below.
4. **Quarantined** — excluded if `exclude_quarantined` is on and the test is currently quarantined.
5. **Not a new failure** — excluded if `new_failures_only` is on and the test's final status in the previous build (same lane) was also FAIL.
6. **Persistent failure** — excluded if `max_prior_failures > 0` and the test failed in all of the last N consecutive builds.

#### Exclusion Rules

An exclusion rule keeps a test from ever opening a signal. Use one for tests auto-heal cannot fix, for example specs that cannot be rerun in your environment, or a known error that no code change will cure.

**Where to manage them.** In **Settings → Product Lane Settings**, edit the lane, then open the **Exclusions** block of the **Auto-Heal** section. It appears once Auto-Heal is enabled and the lane has been saved. Rules save immediately, separately from the lane's **Save** button.

**From a test.** A failing test's detail panel has **Exclude from auto-heal** (shown whenever the Auto-Heal plugin is installed, even with no agent connected). It opens the same dialog with the test's UID and the lane of that run filled in, so the rule covers exactly that lane. Widen the lane before saving if you want more.

##### What a rule contains

| Field | Meaning |
|---|---|
| **What to look at** and **Match** | The target and how to compare it, see below. |
| **Value** | What to compare with: at most 500 characters, and at least 3 unless the match is `Equals`. |
| **Reason** | Required, at most 500 characters. Also decides how rules are grouped in the list. |
| **Expires** | Optional. The rule stops applying at the end of the chosen day. |
| **Applies to** | The product and type (set from the lane) and, optionally, one lane: version, team, browser, device, platform, platform version, stage and extras, the same lane scope used by auto-heal lanes, quarantine and notifications. Leave every field blank to cover every lane of the product and type. |

| Target | What it looks at | Match options |
|---|---|---|
| **Error message** | The failure's error message (not the stack trace) | `Equals`, `Contains`, `Starts with`, `Ends with`, `Regex` |
| **Test UID** | The test UID, exact and case sensitive | `Equals` |
| **File / path** | The test's file or path. A rule matches when either one matches; a test with neither is never matched. Backslashes count as slashes, and a leading `/` in the stored path does not matter for `Contains`. | `Equals`, `Contains`, `Starts with`, `Ends with` |

Text matching ignores case, except for the test UID. A UID rule matches one test case, so to exclude a whole spec file use a **File / path** rule. A product and type can have at most 500 rules.

:::warning Regex limits
`Regex` is only available for error messages, because a crafted pattern can make a regex engine very slow. A regex can be at most 200 characters, repeat counts up to 100, and a product and type can have at most 20 regex rules. These are refused when you save, with the reason: nested repetition such as `(a+)+`, alternation or optional parts inside a repeated group such as `(a|b)+`, backreferences, and lookahead or lookbehind. Every regex match also has a 50 ms time limit: a rule that goes over it is skipped for that build, logged as a warning, and never excludes a test. Prefer `Contains`, `Starts with` or `Ends with` when they are enough.
:::

##### Preview

While you fill in the dialog, **What this matches now** shows what the rule would exclude in the **latest run of each lane it covers** (up to 10 lanes): how many tests match, how many of those are failing now, the first few matching tests with their status, and, for several lanes, a count per lane. It warns when the rule matches more than a quarter of the tests in the runs it looked at (once there are at least 8). It only sees the latest run of each lane, so a spec that was not in that run does not count, even though the rule still applies to future runs.

##### Working with a long list

- **Groups.** Rules that share a **reason** (and were added by the same kind of source, a user or an agent) are shown as one group, with a header such as "Cannot fix token · 2 rules · by admin · matched 3 failures". Nothing is configured for this: type the same reason to keep a batch together. The match ignores case and surrounding spaces. A group shows its first 10 rules, then **Show the other N rules**. Groups start folded, and a single rule is shown as it is.
- **Search and filters.** From 6 rules the list gets a search box and filter chips: **All**, **Active**, **Expired**, **Added by agent** and **Not matched yet**, each with a count. The search matches the value, reason, author, target and lane, and every word you type has to match. While you search or filter, every group is open.
- **Deleting.** A rule has its own delete button. A group's header has one too, which deletes the rules of the group after a single confirmation. With a search or filter on, it deletes only the rules you can see. You can only delete what you are allowed to, see below.

##### How often a rule has worked

Each rule shows **Matched N failures** and the date it last matched, or **Not matched yet**. This is counted by auto-trigger every time a build is processed. "Not matched yet" does not mean the rule is wrong: no build may have failed with a matching test since it was created, auto-heal may be off, or no enabled lane may have covered the build. The server log also records how many failures were excluded in each build.

##### Who can do what

Only an admin can create a rule that can match many tests (error message or file / path), edit a rule, or delete a rule that someone else made, which includes every rule an agent added. Any signed-in user can exclude a single test by UID and delete the rules they made themselves.

##### External consumers

An external consumer can add a rule for the test of a signal it claimed, see [4. Exclude a test that cannot be healed](#4-exclude-a-test-that-cannot-be-healed-optional). These rules show **Added by agent** in the list.

If the rules cannot be read when a build completes, that build is skipped and an error is logged, so tests meant to be excluded never reach an AI by accident.

:::note
The older per-lane "skip failures whose error message matches" list is no longer used. Recreate those rules as **Error message** exclusions.
:::

#### Triage Exclusion Rules

Auto-trigger only excludes tests whose failure is **actively covered by a valid auto-triage record**. Manual triage records (created by a user in the UI) do not block signal creation — they are informational annotations, not active coverage gates.

| Condition | Signal created? | Reason |
|---|---|---|
| Auto-triaged (TTL valid), current failure matches same error fingerprint | No | Auto-triage is actively covering this exact failure pattern |
| Auto-triaged (TTL valid), current failure has **different** error fingerprint | Yes | New failure mode — different root cause, needs investigation |
| Auto-triaged (TTL **expired**) | Yes | Coverage lapsed — failure is eligible again |
| Auto-triage record missing (old records without `is_auto_triaged` flag) | Yes | Treated as expired — records from old plugin versions are not enforced |
| **Manually triaged** (user-created triage in UI, any age) | **Yes** | Manual triage is a historical annotation; auto-heal signals are independent |

:::info Source age limit
Auto-Heal reads the **Source age limit** from Auto-Triage Settings (same lane) to determine staleness of triage records. Auto-triage records older than this limit no longer suppress heal signals, even if their TTL has not elapsed. Records with permanent TTL (`-1`) are always enforced regardless of age.

If Auto-Triage is not enabled or its settings have never been configured, Auto-Heal defaults to **30 days**. Since only `is_auto_triaged: true` records can suppress heal signals, this only matters if auto-triage was previously enabled and left records behind.
:::

:::warning Triage status and heal signals can coexist
A test may appear as **triaged** in the UI (because a user manually investigated it at some point) while also having an active heal signal. This is expected behavior — the manual triage records a past investigation, and the heal signal targets the current failure which may have a different cause or occurred after the test had been passing for a while.

If you want to permanently suppress heal signals for a specific test, use auto-triage with `ttl: -1` (permanent coverage) rather than a manual triage.
:::

#### Failure Grouping

Before creating signals, auto-trigger groups the remaining candidates by **error fingerprint** (first stable line of error/stack trace, with line numbers and addresses stripped). One signal is created per group — the newest test in the group is the primary; the others are recorded as `affectedTestUids`. This prevents creating dozens of signals when a single root cause affects many tests.

Dedup for external mode: if an `open` signal already exists for a test with the same error fingerprint, the new trigger is skipped. If the error fingerprint changed (new failure mode), the existing signal is updated with fresh build context.

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

### On the Launches Page

A test row shows what auto-heal did with it:

| Icon | Meaning |
|---|---|
| Heart, green | The latest signal completed or created a PR |
| Heart, blue | A signal is in flight: pending, queued, running, or (external mode) open or claimed |
| Heart, orange | A bug was confirmed |
| Heart, red | The latest signal failed, errored, timed out or found no agent |
| Heart, faded | The signal is from an earlier build, not this one |
| Heart with a minus, grey | An [exclusion rule](#exclusion-rules) covers this failing test, so auto-heal opened no signal. Hover to read the rule's reason |

Hover a heart to see the status. A completed signal also shows its reason when it has one, for example "Completed · Flaky". A test never shows both for the same run. If it has a signal for this run, only the heart shows: a user started auto-heal by hand (manual heals ignore rules), or the rule was added after the signal. The grey heart shows only when the test has no signal, or its latest signal is from an earlier build. For the same reason, the **Excluded** filter leaves those tests out.

The **Auto Heal** filter in the launches toolbar lists the tests of the launch that match one of these:

| Filter | Shows |
|---|---|
| *(nothing selected)* | The default: every test, with or without auto-heal. Click the selected button again to go back to this |
| **All** | Tests that have any signal, whatever its status |
| **Active** | Signals in flight, including external ones that are open or claimed |
| **PR / Fix** | A PR was created, or the signal completed with no reason |
| **Failed** | Test failed, error, timed out, no agent |
| **Bug Confirmed** | The agent confirmed a product bug |
| **Flaky** | Completed as flaky |
| **Not Reproducible** | Completed as not reproducible |
| **Never Healed** | Failing tests with no signal, and not excluded. These are the ones auto-heal has not looked at yet |
| **Excluded** | Failing tests an exclusion rule covers |

Every option except **Never Healed** and **Excluded** looks at the test's latest signal. The filter shows once the launch has at least one signal or one excluded test.

---

## External Consumer API

Use this when `dispatch_mode` is set to `external` in the lane's auto-heal settings. Your system acts as the repair agent — UReport surfaces failures; your system processes them and reports outcomes.

### Authentication

Use a standard UReport API bearer token (same as the REST API). Pass it as `Authorization: Bearer <token>`.

### 1. Poll for Open Signals

```
GET /api/ai/heal/signals?status=open
```

Filter by lane:
```
GET /api/ai/heal/signals?status=open&product=MyApp&type=E2E
```

Each signal in the response includes everything your system needs to process the fix without additional API calls:

| Field | Description |
|---|---|
| `testName`, `testUid`, `testFile` | Which test failed |
| `product`, `type` | Which lane |
| `buildId` | Build where the failure was detected |
| `failureGroupId` | Error fingerprint hash (stable across runs with same root cause) |
| `affectedTestUids` | Other tests in the same error group (same root cause) |
| `failureSnapshot.errorMessage` | Error message captured at trigger time |
| `failureSnapshot.stackTrace` | Stack trace captured at trigger time |
| `additionalInstructions` | The lane's additional instructions at trigger time, or `null` when none are set. Pass it to your AI along with the failure context. |
| `laneHistory` | Array of `{ buildNumber, status, startTime }` for the last 10 prior builds in this lane — tells you whether this is a new regression or a recurring failure |

#### Reading `laneHistory`

`laneHistory` is ordered newest-first. Each entry is one prior build's outcome for this test UID.

```json
"laneHistory": [
  { "buildNumber": 142, "status": "PASS", "startTime": "2024-10-28T..." },
  { "buildNumber": 141, "status": "PASS", "startTime": "2024-10-27T..." },
  { "buildNumber": 140, "status": "FAIL", "startTime": "2024-10-26T..." }
]
```

- All recent builds `PASS` → this is likely a new regression introduced in the triggering build — a strong fix candidate.
- Mixed or all `FAIL` → the test has been failing on and off; your system may want to apply different logic (investigate root cause, skip, or escalate).

:::info
`failureSnapshot` is captured at trigger time. If the test has been rerun since then, the snapshot reflects the state when the signal was created, not the latest rerun result.
:::

### 2. Claim a Signal

Atomically transitions the signal from `open` → `claimed`. Returns 409 if already claimed or not open.

```
POST /api/ai/heal/signals/:id/claim
{ "claimed_by": "my-system-v1" }
```

### 3. Report the Outcome

After your system processes the fix, report the result:

```
PUT /api/ai/heal/signals/:id
```

Required field:
- `status` — one of `pr_created`, `test_failed`, `bug_confirmed`, `completed`, `error`

Optional fields by status:

| Field | When to use |
|---|---|
| `pr_url` | Required for `pr_created` — URL of the opened pull/merge request |
| `branch` | Branch name (for `pr_created`) |
| `diff_summary` | Short description of code changes applied |
| `test_output` | Test runner output from the verify run |
| `attempted_diff` | Diff that was tried (for `test_failed`) |
| `agent_analysis` | Explanation of why the fix failed or what was found |
| `bug_report` | Required for `bug_confirmed` — object with `summary` and optionally `detail` |
| `bug_tracking_url` | For `bug_confirmed` — URL to Jira/GitHub issue. UReport auto-triages affected tests with this link. |
| `error_detail` | Error description (for `error`) |
| `external_ref` | Any external reference (ticket ID, PR mirror URL, etc.) |
| `rerun_passed` | `true` if your system ran the test and it passed. UReport marks the test as PASS with `is_rerun=true`. Required (and only valid) with `completed`. |
| `completion_reason` | Optional, only valid with `completed`: `flaky` (passed on retry, intermittent) or `not_reproducible` (could not reproduce the failure). Shown next to the status in signal detail; put the explanation in `agent_analysis`. |
| `ai_provider` | AI provider name (informational, shown in signal detail) |
| `ai_model` | AI model name (informational, shown in signal detail) |
| `input_tokens` | Token count (informational, shown in signal detail) |
| `output_tokens` | Token count (informational, shown in signal detail) |

#### Auto-Triage on Bug Confirmed

When you report `status: bug_confirmed` with a `bug_tracking_url`, UReport automatically creates InvestigatedTest records for the primary test and all `affectedTestUids`, linking them to the tracking URL. This prevents auto-trigger from re-signaling the same known bug on the next build.

### 4. Exclude a Test That Cannot Be Healed (optional)

If your system finds that a test cannot be auto-healed, it can stop UReport from raising signals for it again:

```
POST /api/ai/heal/signals/:id/exclude
{ "reason": "Needs a manual environment change" }
```

The signal must be `external` and `claimed`. UReport builds the rule itself: this test (UID), in the exact lane of the signal's build, so your system cannot widen it. The rule is marked as added by an agent, links back to the signal, never expires, and can only be deleted by an admin. Asking twice returns the same rule (`created: false`). The signal stays `claimed`, so report its outcome with `PUT /api/ai/heal/signals/:id` as usual.

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
| `timed_out` | Command exceeded the configured timeout and was killed |
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
| Exclude a single test (UID) from auto-heal | ✓ | ✓ |
| Create / edit exclusion rules on error message or file / path | ✓ | — |
| Delete exclusion rules | ✓ | own rules only |
| Create / edit / delete rerun configs | ✓ | ✓ (own only) |
| Trigger rerun | ✓ | ✓ |
| Access /auto-heal page | ✓ | ✓ |

Both roles require the auto-heal license and the `auto-heal` plugin to be installed.

---

Next: [ureport-agent →](./ureport-agent)
