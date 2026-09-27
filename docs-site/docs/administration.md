---
sidebar_position: 10
title: Administration
description: Administer UReport — manage users, product lane settings, presets, relation filters, custom states, and AI analysis configuration.
---

# Administration

Configure system settings, manage users, and set up product lane configurations.

---

## Product Lane Settings

Product Lane Settings customise the investigation workflow, filtering options, and categorisation for each product/type combination.

### Issue Types

Issue types are categories used when investigating test failures — labels like **Defect**, **Automation Issue**, or **Environment** that describe *why* a test failed. They appear when you open a failing test and click **Investigate**.

Issue types are configured at two levels:

**1. Global Issue Types (System Settings)** — defined once, available system-wide. Go to **Settings → System Settings → Global Issue Types**. Add types with Key, Label, Icon, and Color.

**2. Product Lane Issue Types** — each lane selects which global types to expose in its investigation dropdown. Edit a Product Lane → Issue Types section → add from Available Types.

Default issue types available in all lanes:

| Type | When to use |
|---|---|
| **Defect** | A product bug caused the failure — a real regression |
| **Automation Issue** | The test itself is broken (selector, timing, test-code bug), not the product |

:::tip
Keep global issue types generic (Defect, Automation Issue, Environment) and add product-specific types at the Product Lane level.
:::

### Relations Filters

Relation data comes from two sources merged at analysis time:

| Source | Field | Type | Notes |
|---|---|---|---|
| TestRelation | `components` | Array of `{name}` objects | e.g. `[{"name":"Authentication"}]` |
| TestRelation | `teams` | Array of `{name}` objects | e.g. `[{"name":"UI Team"}]` |
| TestRelation | `tags` | Array of `{name}` objects | e.g. `[{"name":"smoke"}]` |
| TestRelation | `customs` | Object — string keys, array-of-string values | Each key becomes its own dimension |
| Test.info | `tags / teams / components` | Array of strings | **Overrides** TestRelation values when present |
| Test.info | any other key | String or array | Merged into custom dimensions alongside `TestRelation.customs` |

If no TestRelation record exists for a test, `test.info` is the sole source of relation data.

Relations Filters appear in two places in the UI:
- **Launches toolbar** — filter panel narrows the visible test list by component, team, tag, or custom key values
- **Dashboard widgets** — the "Group By" dropdown in Treemap, Heatmap, and Relations Group By widgets

Two types of filters per Product Lane:

**Default Filters** — plain relation dimension names. Add the key exactly as it appears in the data: `components`, `teams`, `tags`, any `customs` key (e.g. `Browser`, `OS`, `Environment`).

**Group Filters** — custom filters that bucket relation values into named categories. Choose a base dimension (e.g. `teams`), then define groups that map values to category names. Useful when you have many teams or components and want to analyse at a higher level.

**Example — Team Group Filter:**

| Group | Values |
|---|---|
| Frontend | UI Team, Web Team, Mobile Team |
| Backend | API Team, Database Team, Services Team |
| QA | Manual QA, Automation QA |

:::warning
Values in Group Filters must match exactly — including casing — with values stored in the TestRelation records.
:::

**Creating a Group Filter:**

1. Settings → Product Lane Settings → edit the desired lane
2. Scroll to **Group Filters** → click **Create Group Filter**
3. Enter Filter Name and Base Relation Type (components, teams, tags, or custom)
4. Add groups: Category Name + Values (press Enter to add each value)
5. Save — the filter appears as a filtering option in Launches and dashboard widgets

### Custom States

Custom states are admin-configured labels for failures that don't fit standard issue types — e.g. "Blocked by dependency", "Won't Fix", "Under investigation".

Created in **Settings → Issue Types → Custom States**. Each state has a label, a key (used internally), and a colour.

---

## System Settings

Go to **Settings → System Settings** to configure global settings.

### Analysis Settings

| Setting | Description |
|---|---|
| **Analysis time window** | 7–180 days — how far back behaviour analysis and trend widgets look |
| **Advanced Analysis** | Toggle — enables per-triage Compare By strategy selection |

### Integration Settings

| Setting | Description |
|---|---|
| **Issue tracking URL** | JIRA or other tracker base URL — enables autocomplete and clickable links when entering tracking tickets during triage |
| **Suggested issue types** | Issue types suggested in triage dropdowns |

### Notification Settings

Gmail SMTP configuration for email notifications. See [Notifications](./notifications) for details.

### Global Issue Types

Define system-wide issue categories available to all product lanes. Set icons and colors per type.

---

## User Management

Go to **Settings → Users** to manage accounts.

### Roles

| Role | Permissions | Use case |
|---|---|---|
| **Admin** | Full access to all features, settings, and user management | System administrators, team leads |
| **Operator** | Create/edit dashboards, investigate tests, manage data | QA engineers, developers |
| **Viewer** | View dashboards and test results (read-only) | Stakeholders, managers |

### User Actions

| Action | Description |
|---|---|
| **Approve / Reject** | Activate or reject pending self-registered users |
| **Change role** | Promote or demote a user's role |
| **Deactivate** | Suspend access without deleting the account |
| **Delete** | Permanently remove a user |
| **Create User** | Add a user directly as admin, bypassing self-registration |

### Self-Registration

Users register at `/signup`. All self-registered users are created with **Viewer** role and **pending** status — they cannot log in until an admin explicitly approves them.

There is no config flag to disable signup. To create accounts without self-registration, use **Settings → Users → Create User** directly as an admin.

With SMTP configured, users confirm email automatically and are activated without admin approval.

---

## Permissions & Security

| Feature | Description |
|---|---|
| **Role-based access control** | Feature-level permissions enforced by role |
| **API endpoint security** | All `/api/*` endpoints require authentication |
| **Session management** | Session-based auth for browser; Bearer token for API calls |
| **Rate limiting** | Login endpoint rate-limited (200 req/15 min, 30 in demo mode); forgot/reset limited to 5 req/15 min |

---

## Presets

A **Preset** is a named, saved set of product-lane filter combinations. Instead of manually adding lanes one by one each time you open the product-lane selector, save a multi-lane view as a preset and reload it in one click.

Presets are especially useful for cross-browser or cross-environment comparisons you run regularly — e.g. a preset called "All Browsers" that always adds Chrome, Firefox, and Safari lanes at once.

### Creating a Preset

1. Go to **Settings → Presets** (admin or operator)
2. Click **Add Preset** — enter a name and optional description
3. Add lanes — each lane is a combination of:

| Dimension | Notes |
|---|---|
| product | Required per lane |
| type | Required per lane |
| version | Optional |
| browser | Optional |
| platform | Optional |
| platform_version | Optional |
| team | Optional |
| stage | Optional |
| device | Optional |

4. The UI validates that each lane exists in UReport before adding it. If a combination matches multiple lanes or none at all, the entry is rejected.
5. Click **Save**

### Using a Preset

Open the **product-lane selector** (available in the Launches page and the widget editor). In the selector dropdown, choose from the **Presets** list. All lanes defined in the preset are instantly applied, replacing any currently selected lanes.

:::info
Applying a preset replaces the current lane selection. To keep existing lanes, add them individually before or after applying a preset.
:::

---

## Export & Import

### CSV Export

Export test execution data from the **Launches page**:

1. Go to Launches and apply your desired filters
2. Click the **Export CSV** icon in the toolbar
3. Select which columns to include and their order
4. Click Export to download

CSV includes: test execution data, investigation reports, build history, relation metadata, custom dimensions.

### PDF Export

Export dashboard snapshots from the **Dashboards** page:

1. Open the dashboard
2. Click **Export → PDF**

PDF captures the current widget layout and data. Individual widget exports are also supported.

---

Next: [Troubleshooting →](./troubleshooting)
