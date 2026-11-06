---
sidebar_position: 6
title: Notifications
description: Set up email alerts in UReport triggered by build results. Configure rules by pass rate, failure count, and relation filters to notify your team when tests degrade.
---

# Notifications

UReport can automatically email your team when a build finishes and its test results match conditions you define — no manual checking required.

---

## How Notifications Work

When a build is closed, UReport evaluates all enabled notification rules for that product lane. If any rule's conditions are met by the build's test results, an email is sent immediately to the configured recipients.

:::info
Quarantined tests are excluded from alert evaluation — known-flaky tests do not trigger false alarms.
:::

Each recipient gets **one email per build run**, even when several of their rules match. It lists every rule that matched, and the matching tests once each.

**The email contains:**
- The name of the rule(s) that triggered
- Build metadata — product, type, team, browser, version, platform, stage, and any extras
- Test result summary — total, pass, fail, skip counts
- The tests that triggered the rule(s) with their status — the first 50 when more match
- A direct link to view the build in UReport

Test names, rule names and build fields are shown as plain text, so names containing characters such as `<Button>` appear as written.

---

## Managing Rules

Rules are managed per product lane from the **Launches page**. Click the **bell icon** (🔔) in the toolbar to open the Notification Rules panel. Add, edit, enable/disable, or delete rules there.

### Rule Fields

| Field | Required | Description |
|---|---|---|
| **Rule Name** | Yes | Label shown in the UI and in email subjects |
| **Recipients** | Yes | One or more UReport users to email. Users must have an email address set on their account. |
| **Scope** | No | Narrow to specific builds by: version, team, browser, device, platform, or stage. Leave blank to match all builds of the product lane. |
| **Statuses** | No | Which test result statuses to look for — FAIL, SKIP, or PASS. Defaults to FAIL if not set. |
| **Name / UID Pattern** | No | Regex matched against test names and UIDs. Only tests matching this pattern are considered. |
| **Relation Conditions** | No | Filter by test relation attributes — tags, teams, components, or custom fields. |
| **Logic** | No | AND or OR — controls how multiple **relation conditions** combine. Has no effect on statuses or name pattern. |
| **Enabled** | — | Toggle rule on/off without deleting. |

:::info
Recipients must be existing UReport users with an email address set on their profile. Users without an email address are silently skipped.
:::

---

## How Conditions Work

A rule fires when, after a build closes, at least one test simultaneously satisfies **all** of:

1. The build matches the rule's **scope** (or scope is empty)
2. The test's status is one of the rule's **statuses**
3. The test's name or UID matches the **name pattern** (if set)
4. The test's relation satisfies the **relation conditions** (if set)

### AND vs OR Logic

Logic controls how **multiple relation conditions** combine only. It has no effect on statuses or name pattern.

| Logic | Behaviour | Example |
|---|---|---|
| **AND** | A test must satisfy every relation condition | tags = "smoke" AND teams = "checkout-team" |
| **OR** | A test must satisfy at least one relation condition | tags = "smoke" OR tags = "regression" |

### Relation Conditions

Relation conditions filter by attributes stored in Test Relations — tags, teams, components, and any custom fields defined for the product lane. Each condition has a **type** (e.g. tags) and one or more **values** (e.g. "smoke", "regression"). A test satisfies the condition if its relation has any of the selected values for that type.

:::info
Relation condition options are populated from existing Test Relations for the product lane. If the dropdowns are empty, check that Test Relations are configured.
:::

---

## Multi-Run Builds and Notification Behaviour

When multiple CI pipeline runs share the same **product / type / build number**, UReport merges them into a single build document. Notifications are designed to fire once per run — not once per build — by scoping the rule evaluation to tests uploaded in the current run only.

### Result counts in the email

The pass / fail / skip counts shown in the email reflect **this pipeline run only**, not the accumulated totals across all runs. If your suite is split across sequential runs (e.g. run 1 covers feature A, run 2 covers feature B), each run's email will show only that run's test counts. Open the build in UReport to see the full picture.

### Known limitation — raw API / incremental uploads

The per-run scoping relies on a timestamp boundary set when the build is closed (the previous run's close time). This works correctly when all tests are uploaded **before** the build close call, which is the standard reporter flow.

If you use the raw API and upload tests incrementally while another run is still in progress, tests uploaded before the close boundary may fall outside the scoping window and not be evaluated for that run's notification. In this case, a notification for those tests may be missed or delayed to a later run.

**Workaround:** ensure all tests for a run are uploaded before calling the build close endpoint, or use the official UReport reporter which handles this automatically.

---

## Email Setup

Notifications require SMTP to be configured. Go to **Administration → System Settings → Notification Settings**.

| Setting | Description |
|---|---|
| **Email Provider** | **Gmail**, **Outlook / Office 365**, or **Custom SMTP**. Gmail and Outlook fill in the server, port and encryption for you. |
| **SMTP Host / Port / Secure** | Custom SMTP only: your mail server, its port, and whether to use TLS from the start (usually port 465). |
| **Email (sender)** | The address used to send notification emails |
| **Password** | The account's password. For Gmail this must be an app password — not your account password. Generate one in Google Account → Security → App Passwords. Required for Gmail and Outlook; optional for Custom SMTP. |
| **Frontend URL** | The public URL of your UReport instance, used to generate the "View Results" link in the email. Without it the email has no link. |

:::warning
For Gmail, using your main Google account password will not work. You must use a Gmail App Password generated specifically for UReport.
:::

Changes to the sender, password, host, port or encryption take effect on the next email — no server restart is needed. The same settings are used for registration confirmation and assignment emails.

If email is not configured, rules are still evaluated but no emails are sent. The server logs: `[notifications] Email not configured, skipping build notification email` (or `Email password not configured` when the password is missing for Gmail or Outlook).

---

## User Registration Emails

When SMTP is configured, UReport also sends:

- **Email confirmation** — new users receive a confirmation link after sign-up; clicking it activates their account without admin approval
- **Password reset** — users can request a reset link from the login page

Without SMTP, new accounts stay `pending` until an admin manually approves them in **Settings → Users**.

---

Next: [Quarantine →](./quarantine)
