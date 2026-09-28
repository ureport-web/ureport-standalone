---
sidebar_position: 4
title: Test Analysis
description: Explore and triage test failures in UReport's Launches view. Covers List, Tree, and Timeline views, filtering, triage workflow, compare mode, and AI analysis.
---

# Test Analysis

The Test Analysis (Launches) page is the primary workspace for reviewing and triaging test results. It provides flexible view modes, deep filtering, per-test detail, and triage workflows.

---

## View Modes & Filters

### View Modes

Three view modes are available via the toolbar's view selector buttons. The active mode is remembered per session.

| Mode | Description |
|---|---|
| **List View** | Default flat table of all tests. Supports grouping, sorting, pagination, and inline actions. |
| **Tree View** | Tests organised by folder hierarchy. Click a folder for a summary; click a test to open the detail panel. |
| **Timeline View** | Tests plotted on a horizontal time axis sorted by execution time. Useful for spotting slow tests and parallelism gaps. |

### Filtering Tests

The toolbar above the test list provides layered filtering:

**1. Status Filter** — Click status badges (PASS, FAIL, SKIP, etc.) to show or hide tests. Multiple statuses can be active at once.

**2. Search** — Type in the search box to instantly filter by test name. Matches anywhere in the name.

**3. Filters Panel** — Click the Filters button to open:
- **Show Pinned Only** — restrict list to your pinned tests
- **Quarantined Tests** — show all / hide quarantined / show only quarantined
- **Execution Speed** — filter by Fast / Medium / Slow / Very Slow categories (see Performance section for thresholds)

**4. Relation Filters** — If relation attributes are configured, a Relation Filters row appears below the search bar. Each attribute (component, team, tag, custom) supports multi-select.

**5. Saved Filters** — Save the current filter combination as a named favourite with the star button. Apply saved filters with the bookmark button.

Active filters are shown as removable tags in the toolbar info bar. Click the × on any tag to clear that filter.

### Group By

Open Display Settings and expand the **Group By** section (List view only):

| Mode | Description |
|---|---|
| **None** | Default flat list, ungrouped. |
| **Failure Message** | Groups tests by their exact error message text. Useful for identifying clusters with the same root cause. |
| **Triage Tracking Number** | Groups triaged tests by their linked ticket number (e.g. JIRA-1234). Unlinked failures are omitted. |
| **Triage Creation Date** | Groups triaged tests by the calendar date the triage entry was created. |
| **Triage Issue Type** | Groups triaged tests by issue type (Defect, Automation Issue, or custom types). |

Groups are sorted by member count (largest first). Expand or collapse each group with the accordion.

### Display Settings

The Display Settings popover controls how the test list looks:

| Setting | Options |
|---|---|
| **History Display Mode** | Bar (compact pass-rate bar above test name), Icons (row of status icons, most recent first), None (hidden) |
| **Sort Order** | Name A-Z, Name Z-A, Last Executed (default), First Executed |
| **Columns** | Toggle: Full Test Name, Start Time, Browser, Device, Product Lane Indicator, Relations, Test Actions |

### Header Action Buttons

| Button | Description |
|---|---|
| **Refresh Cache** | (Admin only) Invalidates the server-side result cache for this build and reloads test data. |
| **Notification Rules** | Configure email notifications triggered by this build's results. |
| **Quarantine Rules** | Manage automatic quarantine rules that suppress known-flaky tests. |
| **Auto Triage** | Open the Auto Triage panel to bulk-apply triage entries across builds. |
| **Bulk AI Prompt** | Copy a structured AI prompt containing all current failing tests (grouped by error) for pasting into an AI chat tool. |
| **Export CSV** | Export the currently visible test list to CSV. Requires an upgraded licence. |
| **Preferences** | Per-user display preferences for the Launches page. |

---

## Test Detail Panel

Click any test row to open the detail panel. The page switches to a split-view layout: the test list shrinks to the left and the detail panel opens on the right. Drag the divider to resize. Click × (top-right) to close.

### Action Menu

The ⋮ button opens a context menu (also accessible by right-clicking a test row). Available actions depend on the test's status and your role:

| Action | Description |
|---|---|
| **Set as pass manually** | Overrides status of a failing test to PASS. Admin and operator only. |
| **Triage (Link as Investigated)** | Opens the Triage dialog. Sub-menu lists configured issue types. |
| **Link as Outage** | Links the test to a broader outage incident. |
| **Link as Custom State** | Links to an admin-configured custom state. Only appears when custom states are configured. |
| **Remove Triage / Remove Outage** | Clears the existing triage or outage entry. |
| **Assign Test** | Assigns the failing test to a specific user for investigation. |
| **Snooze Quarantine** | Temporarily removes the test from quarantine without permanently exempting it. |
| **Pin Test** | Pins the test to the top of your personal view. Toggle to unpin. |

### Panel Tabs

Up to six tabs are available, some conditional:

| Tab | When visible | Contents |
|---|---|---|
| **Comparison** | Only when Compare Mode is active | Side-by-side lane status cards and step comparison |
| **Overview** | Always | Triage info, error message, stack trace, AI analysis, test metadata, basic timing |
| **Steps** | Always | Structured steps — Setup, Body, Teardown — with search and rerun comparison |
| **Run** | Always | Command to re-run this specific test locally |
| **Analytics** | Always | Full run history (last 6 months) with pass-rate stats and duration trend chart |
| **Issue History** | Only when the test has been triaged before | Chronological table of past triage entries |

### Overview Tab

From top to bottom:

1. **Triage Banner** (if triaged) — Issue type badge, cause, tracking number. If auto-triaged, shows the match strategy (token / exact / stack) and TTL (or ∞ for permanent). Includes impact counts — how many other tests matched this triage this week and all time.
2. **Assignment Banner** (if assigned) — Shows which user has been assigned to investigate.
3. **Quarantine Banner** (if quarantined) — Shows rule name, date quarantine started, and the failure ratio (fail count / total builds) that triggered it.
4. **Error Information** (failing tests only) — Two-column layout:
   - Error Message with copy button
   - Stack Trace Preview (first 200 characters) with copy button
   - AI Root Cause Analysis — click Analyze with AI for root-cause category, flakiness signal, confidence %, What Failed, Why, Suggested Fix. Use Copy Prompt to paste the structured prompt into any AI chat.
   - Full Stack Trace (scrollable)
5. **Test Metadata** — Environment badges (browser, device, platform, stage, version) and Quick Information (custom key/value fields from reporter, each with copy button).
6. **Basic Information** — Start Time, End Time, Duration, Description (if any), Path, File.

### Steps Tab

Three sections: **Setup Steps**, **Body Steps**, **Teardown Steps**.

Additional controls:
- **Rerun Selector** — if the test has reruns, select one to compare steps side-by-side with the original run
- **Step Search** — filter steps by name in real time
- **Jump to First Failed Step** — scrolls directly to the first failing step
- **Original Failure Toggle** — for tests that passed after a rerun, toggle between final passing steps and original failing steps

### Analytics Tab

- **Run History (last 6 months)** — Stat chips for 2 Weeks, 1 Month, 3 Months, and Overall showing run count and pass rate. Scrollable table of each individual run with date, status, and error message. Runs are grouped by product lane — active lane first, other lanes follow.
- **Duration History** — Min / Avg / Max / total Runs stat chips, plus a line chart of test duration over time.

---

## Triage

Triage (also called "Link as Investigated") associates a failing test with a known issue. Once triaged, a test shows a triage badge in the test list and Overview tab. Triage entries propagate to matching tests across builds — triage once per root cause.

### How to Triage

1. Click ⋮ on the test row or in the detail panel header
2. Select **Triage (Link as Investigated)** → expand sub-menu → choose issue type (Defect, Automation Issue, or custom type)
3. In the Triage dialog: enter the **tracking ticket** (e.g. `ABC-1234`) — required field; supports autocomplete if an issue tracker is integrated
4. Choose a **Compare By strategy**:
   - **Failure Message** — matches tests whose failure message is identical. Use for deterministic assertion failures with consistent wording.
   - **Token & Stack Trace** — matches by unique token and stack trace fingerprint. More precise; use when the same failure can have varied error text.
5. Review **similar tests** — other failing tests in the current build sharing the same error appear in the list. Check any to triage together.
6. Optionally enable **Similarity Matching** to also apply this triage to historical builds. A slider (60–100%) controls minimum message similarity. Preview affected tests before confirming.
7. Click **Link Test** to save.

### Default Issue Types

| Issue Type | When to use |
|---|---|
| **Defect** | A product bug caused the failure — a real regression in the application. |
| **Automation Issue** | The test itself is broken (selector, timing, test-code bug), not the product. |

Admins can add, rename, recolour, or remove issue types in **Settings → Issue Types**. Custom types appear alongside these defaults in the Triage sub-menu.

### Remove Triage

Open the context menu → **Remove Triage** (or **Remove Outage** if linked as outage). The badge and matching propagation are removed immediately.

---

## Link as Outage

An **outage** represents a broader infrastructure or environment incident — a flaky environment, downstream dependency failure, or deployment issue — that caused many tests to fail simultaneously.

Triage = the test failed because of a specific code defect or automation issue.
Outage = the test failed because of an environmental or systemic problem unrelated to the test itself.

Outage entries display differently in dashboards: the Triaged Pie Chart and Summary Card — Triaged widget distinguishes outage failures from standard triaged failures.

**How to link:** ⋮ context menu → **Link as Outage** → choose issue type. Same Triage dialog opens, but the header reads "Link Test as Outage".

---

## Custom States

Custom states are admin-configured labels for failures that don't fit Defect or Automation Issue — e.g. "Blocked by dependency", "Won't Fix", "Under investigation".

Created in **Settings → Issue Types → Custom States**. Each state has a label, a key (used internally), and a colour.

The **Link as Custom State** option appears in the context menu only when at least one custom state has been configured. The test displays the custom state badge with the configured colour instead of a standard issue-type badge.

---

## Assign Tests

Assign a failing test to a team member for investigation:

1. ⋮ context menu → **Assign Test**
2. Select the user from the list
3. The test immediately shows an "Assigned to [username]" banner in the Overview tab

To unassign: context menu → **Unassign Test**.

Assignment is visible in the Overview tab. Pins are per user and per test UID — a pinned test stays pinned even when navigating to a different build.

---

## Test Relations

Relations are custom metadata attributes attached to tests — component, team, feature, tag, or any custom dimension defined in your product's configuration. They are used to filter and group tests and to power the Treemap, Heatmap, and Relations Group By dashboard widgets.

**Filter by relation:** In the Launches toolbar, a Relation Filters row appears below the search bar when relation attributes are available. Each attribute shows a multi-select dropdown. Active relation filters appear as a tag in the info bar.

**Group by relation:** Switch to List view → Display Settings → Group By → choose a grouping option. Groups are accordion sections sorted by member count.

---

## Behavior Analysis

Behavior analysis automatically categorises every test in the current build based on its recent run history. The results appear as clickable insight badges in the toolbar info bar. Clicking a badge filters the test list to that category.

SKIP statuses are excluded from the calculation. RERUN_PASS and RERUN_FAIL are treated as PASS and FAIL respectively.

| Category | Logic |
|---|---|
| **New Failures** | Currently failing AND all previous runs passed. Highest-priority — likely genuine regressions. |
| **Consistently Failing** | Currently failing AND all previous runs also failed. Broken for multiple builds in a row. |
| **Intermittent Tests** | Mixed history (some passes, some failures) and failing now — or was failing with mixed history and passing now. Classic flaky test signature. |
| **Recently Fixed** | Currently passing AND all previous runs failed. A recent fix resolved the issue. |
| **Stable Tests** | Currently passing AND all previous runs also passed. No action needed. |
| **New Tests** | No history found — first appeared in this build or UID is new. |

---

## Performance

Each test's speed is categorised based on duration. UReport applies different thresholds depending on test type:

| Category | UI Tests (browser) | API / Other Tests |
|---|---|---|
| **Fast** | < 30 s | < 1 s |
| **Medium** | 30 s – 60 s | 1 s – 3 s |
| **Slow** | 60 s – 120 s | 3 s – 5 s |
| **Very Slow** | > 120 s | > 5 s |

Test type is inferred from the `_testType` field. Names containing "UI", "WEB", or "BROWSER" use UI thresholds; names containing "API", "REST", or "SERVICE" use API thresholds. Everything else defaults to API thresholds.

Filter by speed: **Filters panel → Execution Speed**. The info bar shows average and total duration for matched tests.

---

## Comparison

### Compare Mode

Compare Mode loads results from multiple product lanes simultaneously for side-by-side comparison. Ideal for cross-browser, cross-environment, or cross-team comparisons.

Toggle **Compare Mode** with the switch in the launch header. When on, click the lane count badge next to the toggle to manage which comparison lanes are loaded.

**To add comparison lanes:**
1. Enable Compare Mode
2. Click the lane count badge
3. Use the product lane selector to add lanes (recently used bundles shown for quick re-apply)
4. Click Compare — UReport loads test results from all selected lanes

### Comparison Tab in Detail Panel

When Compare Mode is active, a **Comparison** tab appears as the first tab:

- **Lane Overview** — A card for each comparison lane (labelled A, B, C, etc.) showing the test's status, environment badges, duration, and error snippet (if failing). If a test did not run in a lane, that card shows "NOT_RUN".
- **Step Comparison** — Select a lane with the letter buttons. Steps are displayed side-by-side: Base (left) vs Comparison (right) for each section (Setup, Body, Teardown).

### Rerun Step Comparison

When a test has reruns, the **Steps** tab shows a rerun selector dropdown. Select a rerun to display steps side-by-side: Original Run (left) vs Comparison (right). This is separate from cross-lane Compare Mode.

---

## Pinning

Pinning marks a test as important to you personally. Pins are stored per user and per test UID — they persist even when navigating to a different build.

- **Pin:** ⋮ context menu → **Pin Test**
- **Unpin:** ⋮ context menu → **Unpin Test**
- **View pinned only:** Filters panel → enable **Show Pinned Only**

---

Next: [Dashboards →](./dashboards)
