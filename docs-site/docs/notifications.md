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

**The email contains:**
- The name of the rule(s) that triggered
- Build metadata — product, type, team, browser, version, platform, stage
- Test result summary — total, pass, fail, skip counts
- A direct link to view the build in UReport

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

## Email Setup

Notifications require SMTP to be configured. Go to **Administration → System Settings → Notification Settings**. UReport uses Gmail SMTP for sending notification emails.

| Setting | Description |
|---|---|
| **Email (sender)** | The Gmail address used to send notification emails |
| **Password** | The Gmail app password — not your account password. Generate one in Google Account → Security → App Passwords. |
| **Frontend URL** | The public URL of your UReport instance, used to generate the "View Results" link in the email |

:::warning
Using your main Google account password will not work. You must use a Gmail App Password generated specifically for UReport.
:::

If email is not configured, rules are still evaluated but no emails are sent. The server logs: `Email not configured, skipping build notification email`.

---

## User Registration Emails

When SMTP is configured, UReport also sends:

- **Email confirmation** — new users receive a confirmation link after sign-up; clicking it activates their account without admin approval
- **Password reset** — users can request a reset link from the login page

Without SMTP, new accounts stay `pending` until an admin manually approves them in **Settings → Users**.

---

Next: [Quarantine →](./quarantine)
