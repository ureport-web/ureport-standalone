---
sidebar_position: 12
title: Assignment
description: Assign failing tests to team members in UReport. Track ownership, send follow-up reminders, and manage assignments across builds.
---

# Assignment

Assignment lets you assign failing tests to team members directly from the test list. Assignees receive an email notification, and you can send follow-up reminders when tests remain unresolved.

:::warning Email Required
Assignment notifications and follow-up reminders are delivered by email. If your UReport instance does not have email configured, assignees will **not** receive any notifications. Set up email in [Administration](./administration) before using this feature.
:::

---

## Overview

When a test fails, you can assign it to a specific user with a note tied to the current failure signature. If the same test fails again with the same failure in a future build, the assignment carries over automatically. If the failure changes, the assignment is no longer matched — it was for a specific failure, not the test in general.

**Key properties:**
- One assignment per test per failure — creating a new assignment for the same test+failure updates the existing one instead of duplicating
- Assignments are scoped to a product lane (`product` + `type`)
- State is either `OPEN` or `CLOSE` — closing an assignment does not send a refund or notification
- No TTL — assignments persist until manually closed or the test is re-assigned

---

## Assigning a Test

### Single Assignment

Right-click a failing test in the list view and select **Assign**. Choose a user from the search results. An email is sent to the assignee (not to yourself).

The assigned test shows a user icon in the list view. Hovering reveals the assignee name.

### Bulk Assignment

1. Click the **Select** button (task icon) in the toolbar to enter selection mode
2. Check the tests you want to assign — passing tests cannot be selected
3. A floating action bar appears at the bottom
4. Click **Assign (N)** → search for a user → confirm
5. Maximum 50 tests per bulk request (backend enforced)

If more than 50 tests are selected, only the first 50 are submitted.

---

## Failure Signature Matching

Assignments are linked to a failure by signature, not just by test UID. When tests are loaded, each assignment is matched to a test using this priority:

1. **UID pre-filter** — if both assignment and test have a UID and they differ, skip
2. **Token match** — Playwright failure token (normalized — retry counts like `336 ×` are stripped before comparison)
3. **Stack trace match** — exact stack trace (normalized)
4. **Error message match** — exact error message (normalized)

Normalization strips variable Playwright call-log retry counts (`\d+ ×`) so that `335 × waiting` and `336 × waiting` are treated as identical. This ensures assignments survive across builds where the retry count fluctuates.

If none of the three match, the assignment is not shown on the test — it was for a different failure.

---

## Unassigning

### Single
Right-click an assigned test → **Unassign**. This closes the assignment (`state: CLOSE`).

### Bulk
In selection mode, select assigned tests and click **Unassign (N)** in the action bar. Only tests with an existing open assignment are unassigned.

---

## Assignments Page

The **Assignments** page (`/assignments`) shows all open assignments across your lanes. You can:
- Filter by `OPEN` / `CLOSE` state
- Search by assignee username
- Close individual assignments

The page queries the last 90 days, up to 200 results (max 500).

---

## Follow-up Reminders

If assigned tests are still failing after **3 days**, a banner appears at the bottom of the launches page:

> **N assigned test(s) still failing — send a reminder?**

Clicking **Send Follow-up** opens a dialog showing each assignee and their still-failing tests. Select the assignees to notify and click **Send Emails**.

Follow-up emails are only sent to other users — not to yourself.

**Eligibility rules for follow-up:**
- Assignment must be `OPEN`
- Assignment must be at least 3 days old (`assign_at` ≤ now − 3 days)
- The test must still be failing and not investigated in the current build
- The failure signature must still match (same token / stack / message after normalization)

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/assignment` | `POST` | Create or update a single assignment |
| `/api/assignment/bulk` | `POST` | Bulk create/update up to 50 assignments |
| `/api/assignment/filter` | `POST` | Get open assignments for a product+type lane (launches use this) |
| `/api/assignment/search` | `POST` | Search assignments with optional filters (assignments page uses this) |
| `/api/assignment/followup` | `POST` | Send follow-up reminder emails for given assignment IDs |
| `/api/assignment/:id` | `PUT` | Update assignment (used for close/unassign) |
| `/api/assignment/:id` | `DELETE` | Hard-delete an assignment |

### `/api/assignment/filter` body

```json
{
  "product": [{ "product": "MY_PRODUCT" }],
  "type": [{ "type": "PLAYWRIGHT_UI" }],
  "after": "2026-01-01T00:00:00.000Z",
  "state": "OPEN"
}
```

Returns all matching assignments sorted by `assign_at` descending. No limit applied — scope by lane and `after` date.

### `/api/assignment/bulk` body

```json
{
  "assignments": [
    {
      "uid": "AA-38 myTestName",
      "product": "MY_PRODUCT",
      "type": "PLAYWRIGHT_UI",
      "username": "john.doe",
      "user": "<userId>",
      "failure": {
        "token": "...",
        "stack_trace": "...",
        "error_message": "TimeoutError: ..."
      },
      "test_url": "https://..."
    }
  ]
}
```

If an open assignment already exists for the same `uid` + `product` + `type` with the same failure signature, it is updated (assignee re-pointed). Otherwise a new assignment is created. Max 50 per request.

---

## Data Model

| Field | Type | Notes |
|---|---|---|
| `product` | String | Product lane identifier |
| `type` | String | Test type (e.g. `PLAYWRIGHT_UI`) |
| `user` | ObjectId | Assignee user ID |
| `username` | String | Assignee username |
| `uid` | String | Test UID — indexed |
| `state` | String | `OPEN` or `CLOSE`, default `OPEN` |
| `failure` | Mixed | `{ token, stack_trace, error_message }` |
| `test_url` | String | Optional link to test detail |
| `assign_at` | Date | Assignment timestamp, default now |
| `comments` | Array | Thread of comments on the assignment |

No TTL index — assignments do not expire automatically.
