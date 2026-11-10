---
sidebar_position: 10
title: Auto-Heal Playbook Examples
description: Copy-paste playbook settings for Auto-Heal with Playwright (GitHub and Bitbucket), Jest or Vitest, and Pytest.
---

# Auto-Heal Playbook Examples

Playbooks are created in the UI under **Tests → Auto-Heal → Playbooks → New Playbook**. Each example below lists what to type into each field. Replace the values in `<angle brackets>` with your own. The stages and placeholders are explained in [Auto-Heal](./auto-heal#guided-pipeline-stages).

All four examples use **Guided** mode and the `claude-cli` provider.

## Before you copy one

- **Check `{test.file}` first.** It is the path your reporter sent for the test. The Verify command and the AI instructions below rely on it being a path inside the repository. Open the playbook, click **Test run**, pick a real failing test and look at the resolved value. If it is empty or not a repo path, change the command to one that does not need it.
- **Use `{test.file}` in commands, not `{test.name}` or `{test.uid}`.** The Verify command runs through a shell, and a test name can contain quotes, `;` or `$`. The agent only blocks backticks and `$(`. If you must filter by name, make sure the names in your suite are under your control.
- **Match the agent's allow-list.** If the agent sets `allowed_run_prefixes` in `ureport-agent.yml`, the Verify command has to start with one of the prefixes. Each example shows a matching entry. See [Security Options](./ureport-agent#security-options).
- **The install command runs on every job** and is stopped after 5 minutes. Keep it to what the tests need, and install heavy tools like browsers on the agent machine ahead of time if it gets close to that.
- **Git access.** The agent machine needs git credentials for the **Git Remote URL**. The **API Token** in the playbook is only used to open the pull request.
- **Claude CLI skips Verify.** With `claude-cli` the Verify stage is skipped, because Claude runs and checks the test itself. That is why the instructions below say how to run the test. Keep the Verify command anyway, since it is used with `gemini-cli` and shown in the preview.
- **`## How to Run`.** This section of the instructions is shown in the trigger dialog, so people see the command before they confirm.

---

## Playwright, GitHub

| Stage | Field | Value |
|---|---|---|
| Checkout | Git Remote URL | `git@github.com:<org>/<repo>.git` |
| | Branch Prefix | `fix/auto-` |
| | Base Branch | `main` |
| | Install Command | `npm ci && npx playwright install chromium` |
| AI Fix | Provider | `claude-cli` |
| | Max Attempts | `2` |
| Verify | Test Command | `npx playwright test {test.file}` |
| | Environment Variables | `CI=1` |
| Create PR | PR Title Template | `fix: auto-heal {test.name}` |
| | Target Branch | `main` |
| | API Token | a GitHub token with the `repo` scope |
| | Username | leave blank |

**AI Fix instructions**

```markdown
The Playwright test "{test.name}" in {test.file} is failing.

Error:
{test.error_message}

Fix the cause of the failure. Prefer fixing the test (wrong selector, missing wait,
outdated expectation). If the application code is clearly wrong, say so in your analysis
instead of changing it. Do not delete or skip the test.

## How to Run
npx playwright test {test.file}
```

**Agent allow-list**

```yaml
allowed_run_prefixes:
  - npx playwright test
```

---

## Playwright, Bitbucket

Same as the GitHub example, with these differences.

| Stage | Field | Value |
|---|---|---|
| Checkout | Git Remote URL | `git@bitbucket.org:<workspace>/<repo>.git` |
| Create PR | API Token | A Bitbucket **app password** with pull request write, or a **repository access token** |
| | Username | Your Bitbucket username when using an app password. Leave blank for a repository access token. |

Reading the repository's default reviewers also needs **repository read** on the token. Without it the pull request is still created, only without reviewers. See [Default reviewers](./auto-heal#default-reviewers-bitbucket-cloud).

The AI Fix instructions and the Verify command are the same as in the GitHub example.

---

## Jest or Vitest

| Stage | Field | Value |
|---|---|---|
| Checkout | Git Remote URL | `git@github.com:<org>/<repo>.git` (or your Bitbucket or GitLab URL) |
| | Branch Prefix | `fix/auto-` |
| | Base Branch | `main` |
| | Install Command | `npm ci` |
| AI Fix | Provider | `claude-cli` |
| | Max Attempts | `3` |
| Verify | Test Command | Jest: `npx jest {test.file}`<br />Vitest: `npx vitest run {test.file}` |
| | Environment Variables | `CI=true` |
| Create PR | PR Title Template | `fix: auto-heal {test.name}` |
| | Target Branch | `main` |
| | API Token | a token for your git host (see [Stage 4](./auto-heal#stage-4--create-pr)) |

Use `vitest run`, not plain `vitest`. Plain `vitest` starts watch mode and never exits, so the Verify stage would time out.

**AI Fix instructions**

```markdown
The unit test "{test.name}" in {test.file} is failing.

Error:
{test.error_message}

Stack trace:
{test.stack_trace}

Find out whether the test or the code under test is wrong, and fix the right one.
Keep the change small. Do not delete or skip the test, and do not change unrelated tests.

## How to Run
npx jest {test.file}
```

For Vitest, change the last line to `npx vitest run {test.file}`.

**Agent allow-list**

```yaml
allowed_run_prefixes:
  - npx jest
  - npx vitest run
```

---

## Pytest

| Stage | Field | Value |
|---|---|---|
| Checkout | Git Remote URL | `git@github.com:<org>/<repo>.git` (or your Bitbucket or GitLab URL) |
| | Branch Prefix | `fix/auto-` |
| | Base Branch | `main` |
| | Install Command | `python -m pip install -r requirements.txt` |
| AI Fix | Provider | `claude-cli` |
| | Max Attempts | `3` |
| Verify | Test Command | `python -m pytest {test.file}` |
| | Environment Variables | `PYTHONDONTWRITEBYTECODE=1` |
| Create PR | PR Title Template | `fix: auto-heal {test.name}` |
| | Target Branch | `main` |
| | API Token | a token for your git host (see [Stage 4](./auto-heal#stage-4--create-pr)) |

The install command runs in the agent's Python. If your project needs a virtual environment, use its interpreter in both commands and in the allow-list, for example `/opt/venv/bin/python -m pytest {test.file}`. Environment Variables are passed as plain values, so `PATH=...:$PATH` does not work there.

If your reporter sends the test file as `tests/test_login.py::test_valid_user`, `{test.file}` includes the `::` part and pytest still selects exactly that test. If it sends only the file path, pytest runs the whole file. Check the resolved value with **Test run**.

**AI Fix instructions**

```markdown
The pytest test "{test.name}" in {test.file} is failing.

Error:
{test.error_message}

Stack trace:
{test.stack_trace}

Find out whether the test or the code under test is wrong, and fix the right one.
Keep the change small. Do not delete or skip the test, and do not change unrelated tests.

## How to Run
python -m pytest {test.file}
```

**Agent allow-list**

```yaml
allowed_run_prefixes:
  - python -m pytest
```

---

## Check it before you save

1. Open the playbook and click **Test run**.
2. Pick a recent failing test from the lane you care about.
3. Read the **Resolved** column. Check that the file path, the Verify command and the PR title look right.

Test run uses your unsaved edits, so you can change a field and run it again. It does not dispatch anything to an agent.
