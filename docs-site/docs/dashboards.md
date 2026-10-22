---
sidebar_position: 5
title: Dashboards
description: Build custom test reporting dashboards in UReport. 13 widget types including heatmaps, flakiness charts, build history, and top failures. Supports sharing and PDF export.
---

# Dashboards

Dashboards provide customisable views of test data using a grid of configurable widget types. Create personal or shared dashboards for single-project monitoring or cross-project comparison.

---

## Creating a Dashboard

1. Navigate to Dashboards and click **Create Dashboard**
2. Enter a **name** and optional description
3. Choose **visibility**: Public (visible to all users) or Private (only you)
4. Choose a **Product Lane Strategy**:
   - **Single Product Focus** — all widgets share one product lane configured at the dashboard level. Changes to the global filter apply across all widgets simultaneously.
   - **Multi-Product Flexibility** — each widget independently chooses its own product lane. Use this for cross-product or cross-team dashboards.
5. Click **Add Widget** to start building — choose a widget type, configure it, and add it to the grid

Dashboard layouts auto-save as you make changes. Rename a dashboard by clicking its title inline.

---

## Dashboard Filters

In a **Single Product Focus** dashboard, a global filter panel at the top applies across all widgets simultaneously. The filter state is preserved in the URL — bookmark or share specific views.

### Core Filters

Product & Type (required), Team, Browser, Device, Platform, Stage, Version

### Advanced Filters

Date Range, Build Range, Status Filters, Relation Filters

Each widget can also have local filter overrides. Click the widget's gear icon to configure per-widget settings.

---

## Product Lane Configuration

Understanding how product lanes are configured — and what happens when fields are left empty — is essential for getting accurate data in each widget.

### How Product Lane Resolution Works

Each widget resolves its data source in this priority order:

1. **Widget-level product lane** — if the widget has its own product lane configured in the editor, that takes precedence over everything else. **Only available in Multi-Product Flexibility dashboards** — the Product Lane panel is hidden in Single Product Focus dashboards because all widgets inherit the dashboard-level filter.
2. **Dashboard-level query** — if no widget-level override exists and the dashboard has a product lane selected (Single Product Focus), the widget inherits it.
3. **Additional lanes** — a list of extra product lanes for side-by-side comparison. Can coexist with the primary lane above. Each entry fetches data independently.

If **none of the above is configured**, the widget renders empty — it has no data source to query.

### Required vs Optional Fields

| Field | Required | Behaviour when empty |
|---|---|---|
| **Product** | ✅ Yes | Widget will not fetch data |
| **Type** | ✅ Yes | Widget will not fetch data |
| **Team** | No | **Wildcard** — matches builds from all teams |
| **Version** | No | **Wildcard** — matches all versions |
| **Browser** | No | **Wildcard** — matches all browsers |
| **Device** | No | **Wildcard** — matches all devices |
| **Platform** | No | **Wildcard** — matches all platforms |
| **Stage** | No | **Wildcard** — matches all stages |
| **Extras** | No | **Wildcard** — no extra-field filtering |

:::info
Leaving an optional field empty is **not** the same as filtering for null — it means the field is excluded from the query entirely, so all values (including null, blank, and any non-null value) are included.
:::

### Single Lane

The most common configuration. Specify a `product` + `type` combination, optionally narrowed by team, stage, version, etc. The widget fetches the N most recent builds matching that filter exactly.

**Example**: Product = `Reporting`, Type = `API`, Stage = `Staging`, Version = `v1.2` → returns the last N builds for that exact combination.

When the filter matches exactly **one** distinct product lane combination, the widget operates in single lane mode.

:::caution Subset trap
Leaving an optional field empty does **not** select a "parent" lane — it is a wildcard that matches all values. If you configure `Product=UReport, Type=UI, Stage=Staging` with Version left empty, and your data contains builds for `v1.1`, `v1.2`, and `v1.3`, the filter matches three distinct combinations and aggregation mode is triggered automatically. There is no way to target "all versions as a single combined lane" in single-lane mode once multiple versions exist in the data. Your options are:

- Specify an explicit version to stay in single-lane mode
- Accept aggregation mode (data pooled as Σ 0, Σ 1, … indices)
- Use **Break aggregation** (Build History Bar only) to show each version as its own independent series
- Use **Single series** (Build History Bar only) to show all matched builds as one flat chronological series
:::

### Aggregated Lanes (auto-detected)

When you configure a product lane filter but **leave one or more optional fields empty**, the filter may match multiple distinct lane combinations in your data — for example, leaving Browser empty when you have Chrome, Firefox, and Safari builds all under the same product/type.

UReport detects this automatically when you apply a filter. If exactly one lane combination matches, the widget shows a normal single-lane view. If more than one matches, it switches to **aggregated lanes mode** — all matching sub-lanes are pooled together.

In aggregation mode:
- The chart uses `Σ 0`, `Σ 1`, … labels on the X-axis, where each index represents the Nth most recent run across all matched sub-lanes.
- Clicking a bar or data point opens an overlay listing each individual sub-lane build that contributed to that data point.
- **Some widget types are hidden** — Summary Card widgets and Test Analysis Table do not support aggregation and are removed from the widget type dropdown. You must configure a single-lane filter to use those widget types.

**Example**: Product = `Reporting`, Type = `API`, Browser = *(empty)* — if Chrome, Firefox, and Safari builds all exist for this product/type, the widget automatically aggregates them.

**Impact per widget**:
- **Build History Bar** — each bar represents combined counts across all matched sub-lanes for that run index
- **Status Pie / Triaged Pie** — combined test counts from the latest run across all matched sub-lanes
- **Heatmap** — each row pools tests from all matched sub-lanes for that run index
- **Treemap / Relations Group By** — tests from the latest run across all matched sub-lanes, pooled before grouping
- **Trend Insights** — trend computed from the aggregated pass rate across all matched sub-lanes
- **Top Tests Table** — unaffected; queries by product/type regardless of sub-lane count

### Multi-Lane

Supported by widgets that show side-by-side comparisons (**Build History Bar** and **Relations Group By**). Add extra product lanes in the widget editor under **Multiple Product Lanes**. Each lane is fetched independently and rendered as a separate series.

**Example**: Lane 1 = `Chrome`, Lane 2 = `Firefox`, Lane 3 = `Safari` → three independent series on the same chart.

When multiple lanes are configured:
- A **Grid View** toggle appears in the widget header — shows all lanes as small charts side-by-side.
- A **single view** shows one lane at a time; use the grid view to see all simultaneously.

### Aggregation Mode Options (Build History Bar only)

When aggregation mode is detected (filter matches more than one lane), the **Build History Bar** widget editor shows a three-option selector:

| Option | Behaviour |
|---|---|
| **Aggregated** (default) | Builds are pooled into Σ 0, Σ 1, … run indices. Clicking a bar shows each sub-lane's contribution. |
| **Break aggregation** | Auto-discovers each sub-lane on every load and renders them as independent series — a special form of Multi-Lane that never hardcodes the lane list. New versions or parameter values appear automatically without re-saving. |
| **Single series** | All matched builds across all sub-lanes are flattened into one chronological series, one bar per actual build, sorted by start date. X-axis switches to **Start Date** automatically. Use this when you want a single continuous history view regardless of which sub-lane each build came from. |

The selector only appears when your filter matches more than one lane. For single-lane filters the widget always operates in single-lane mode and the selector is hidden.

:::tip When to use Single series
Choose **Single series** when you want to see "all staging builds, regardless of version, as one flat timeline" — for example, to spot overall quality trends without caring which version each build belongs to. Note that build numbers may collide across sub-lanes, so the X-axis defaults to Start Date.
:::

---

## Widget Types

### Build History Bar

Bar or line chart showing pass/fail/skip/triage counts across multiple builds over time.

**What it reads**: Up to N builds (configured via range) matching the product lane, plus all tests for each build. Falls back to build-level status counts if individual test data is unavailable.

**X-axis options**:
- **Build Number** — sequential build number
- **Start Date** — actual execution timestamp. Format is chosen automatically based on both the total number of builds and the time span they cover, so labels stay readable regardless of how dense the chart is:

  | Builds | Span | Format | Example |
  |---|---|---|---|
  | > 20 | any | `MMM dd` | `Jun 15` |
  | > 10 or span > 10 days | — | `MMM dd, yyyy` | `Jun 15, 2026` |
  | ≤ 10, span > 1 day | — | `MMM dd HH:mm` | `Jun 15 14:30` |
  | ≤ 10, same day | — | `MMM dd HH:mm:ss` | `Jun 15 14:30:45` |

  The hover tooltip always shows the full date with year and seconds regardless of the axis label format.

**Chart type toggle**: Switch between Bar and Line at runtime. Line mode plots pass rate (0–100%) per build. Bar mode stacks pass/fail/skip/triage/outage counts. This is the same widget — the toggle is available at runtime in the widget header.

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | One series of bars/points, one per build. |
| **Aggregated lanes** | Each bar represents combined counts across all matched sub-lanes for that run index (Σ 0, Σ 1, …). Clicking a bar opens an overlay showing each sub-lane's contribution. Use the aggregation mode selector to switch to Break aggregation or Single series. |
| **Break aggregation** | Lanes auto-discovered on every load, rendered as independent series (special form of multi-lane). Lane list updates automatically as new versions appear. |
| **Single series** | All matched builds flattened into one chronological series sorted by start date, one bar per actual build. X-axis switches to Start Date automatically. |
| **Multi-lane** | Multiple independent series — one per manually configured lane. Grid view shows them side-by-side; single view shows one lane at a time. |
| **No product lane** | Widget shows empty — no builds to display. |

**Analytics**: When data is loaded, an Analytics overlay is available (chart icon in header). Shows pass-rate trend, build health distribution, and stability score.

---

### Status Pie Chart

Pie chart of test result distribution for the **latest build only**.

**What it reads**: Tests from the single most recent build matching the product lane filter.

**Two modes** (toggle in header):
- **Status view** — slices for Pass / Fail / Skip / Triaged (KI) / Outage
- **Triage view** — slices showing the breakdown by investigation cause (Defect, Flakiness, Environment Issue, etc.)

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | Shows status distribution of the latest build in that lane |
| **Aggregated lanes** | Combines tests from the latest run of each matched sub-lane. Pie reflects the totals across all groups. |
| **Multi-lane** | Not applicable — Status Pie does not support multi-lane. Configure separate widgets per lane. |
| **No product lane** | Widget shows empty. |

**Triage view note**: Issue type colours come from your Settings → Issue Types configuration. Up to 5 types are shown as individual slices; remaining types are grouped into "others".

---

### Triaged Pie Chart

Identical to Status Pie Chart but opens on the **Triage view** by default — slices show the breakdown by investigation cause (Defect, Flakiness, Environment Issue, etc.) rather than run status. All product lane scenarios and behaviour are the same as Status Pie Chart.

---

### Summary Cards

A compact card grid showing key metrics. A single widget can display three different card sets — switch between them at runtime using the selector at the top:

#### Build Summary
Counts and buckets all builds in the configured range by pass rate:

| Bucket | Range |
|---|---|
| 🏆 Perfect | 100% |
| ✅ Good | 90–99% |
| ✅ Acceptable | 80–89% |
| ⚠️ Warning | 60–79% |
| ❌ Poor | 40–59% |
| 🚫 Critical | below 40% |

Also shows average pass rate with a trend indicator (↑ / ↓) comparing the first half to the second half of the build range.

#### Status Summary
Aggregates test counts across **all builds** in the range (not just the latest). Shows executed total, pass, fail, skip, triaged, and outage. Also shows an "active" count (executed minus skipped/outaged) when relevant.

#### Triaged Summary
Shows triage coverage across all builds: total triaged tests, new triage (first analysed in the current build) vs carried over (auto-matched from a previous triage). Breakdown by issue type using your configured issue type colours.

**Product lane scenarios** (applies to all three card types):

| Scenario | Behaviour |
|---|---|
| **Single lane** | Metrics computed from builds in that lane over the configured range |
| **Aggregated lanes** | **Not supported** — Summary Card widgets are hidden from the widget type dropdown when your filter matches multiple lane combinations. Configure a single-lane product filter to use these widgets. |
| **No product lane** | Widget shows empty. |

---

### Heatmap

Colour-coded matrix: rows represent builds (newest at top), columns represent values of a relation dimension. Cell colour encodes pass rate — green (high) to red (low).

**What it reads**: N builds and all tests per build, then groups tests by the selected relation dimension (component, team, tag, or custom field).

**Configuration**:
- **Group By** — select which relation dimension to use as columns (configured in widget editor; can be changed at runtime via the selector in the widget header)
- **Build range** — how many builds (rows) to show

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | One row per build, one column per relation value |
| **Aggregated lanes** | Each Σ index becomes a row; tests from all matched sub-lanes are pooled before grouping |
| **No product lane** | Widget shows empty. |

Clicking a cell opens a detail drawer listing the individual builds that contributed to that cell, with links to launch the test view for that specific build.

---

### Treemap

Hierarchical visualisation of test distribution across a relation dimension. Block size is proportional to test count; colour encodes pass rate.

**What it reads**: Tests from the latest build, grouped by the selected relation dimension.

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | Tests from the latest build in that lane |
| **Aggregated lanes** | Tests from the latest run of each matched sub-lane, pooled together |
| **No product lane** | Widget shows empty. |

Clicking a block navigates to the Launches view filtered to that relation value.

---

### Relations Group By

Stacked bar chart grouping tests from the latest build by a relation dimension. Each bar represents one relation value; segments show pass/fail/skip/triage breakdown.

**Modes**:
- **Horizontal** bars
- **Vertical** bars
- **Table** — tabular view with pass rate column

**Multi-lane support**: Relations Group By supports **Multiple Product Lanes** (same as Build History Bar). Add extra product lanes in the widget editor to show side-by-side comparisons across lanes.

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | Groups tests from the latest build |
| **Aggregated lanes** | Groups tests from the latest run across all matched sub-lanes |
| **Multi-lane** | Multiple independent series — one per configured lane |
| **No product lane** | Widget shows empty. |

---

### Test Analysis Table

Tabular analysis of test behaviour patterns across all builds in the configured range. Classifies each test as:
- **Stable** — consistently passes across builds
- **Unstable** — passes in some builds, fails in others (flaky)
- **Consistently failing** — fails in most or all builds

Shows flakiness percentage, total runs, and fail count per test.

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | Analyses tests across the configured build range for that lane |
| **Aggregated lanes** | **Not supported** — Test Analysis Table is hidden from the widget type dropdown when your filter matches multiple lane combinations. Configure a single-lane product filter to use this widget. |
| **No product lane** | Widget shows empty. |

Supports CSV export of the full table.

---

### Top Tests Table

Ranked table surfacing the most impactful tests. Unlike most widgets, this widget queries an **analytics API** over a time window rather than a build range.

**Two modes** (toggle at runtime):

| Mode | Shows |
|---|---|
| **Top Failures** | Tests that failed most frequently; columns: fail count, last failed date |
| **Slowest Tests** | Tests with the longest average duration; columns: avg duration, max duration, run count |

**Time window options**: Last 7 days / 30 days / 90 days (configurable in the widget header at runtime).

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | Top tests within that product/type (and any optional filters) over the time window |
| **Aggregated lanes** | The widget remains available and queries the analytics API using the configured product/type filter. Because the analytics API is time-window based (not build-pipeline based), results reflect all data matching the product/type regardless of multi-lane configuration. |
| **No product lane** | Widget shows empty. |

---

### Trend Insights

Detects anomalous pass-rate drops across recent builds using Z-score analysis.

**What it reads**: Pass rates across the last N builds (default 20). Computes a statistical baseline and flags builds where the pass rate deviated significantly.

**Overlays**:
- Pass rate timeline with anomaly markers
- Build duration trend — reveals if the suite is getting slower over time

**Product lane scenarios**:

| Scenario | Behaviour |
|---|---|
| **Single lane** | Trend analysis for that lane |
| **Aggregated lanes** | Trend computed from the aggregated pass rate across all matched sub-lanes |
| **No product lane** | Widget shows empty. |

---

### Section Divider

Visual separator that organises dashboard content into logical sections.

- Customisable title, colour, font size, and line style
- Enables jump-to-section navigation when multiple dividers are present
- Spans full dashboard width
- Does not fetch any data — no product lane configuration needed

---

## Widget Configuration

Each widget has specific configuration options accessible via the gear icon:

| Setting | Description |
|---|---|
| **Widget Title** | Custom label for the widget header |
| **Product Lane Selection** | Which product lane(s) the widget queries. Only shown in **Multi-Product Flexibility** dashboards — in Single Product Focus dashboards, widgets inherit the dashboard-level filter and this setting is hidden. See [Product Lane Configuration](#product-lane-configuration) above. |
| **Date Range** | Overrides dashboard-level date range for this widget |
| **Build Range** | Number of recent builds to fetch (default: 20) |
| **Status Filters** | Which statuses to include in calculations |
| **Relation Filters** | Pre-filter tests by relation dimension values before the widget processes them |
| **Chart Type / Visual options** | Widget-specific display settings (axis label, direction, colours, layout) |

---

## Multi-Lane Comparison

Widgets that support multi-lane (**Build History Bar** and **Relations Group By**) can compare data from multiple product lanes side-by-side:

1. Open the widget editor
2. Expand **Multiple Product Lanes**
3. Click **Add Product Lane** to add additional data sources — configure each with a different filter combination
4. Use arrow buttons to reorder lanes; edit or remove as needed

Use cases:
- **Cross-Browser** — Chrome, Firefox, Safari lanes side-by-side
- **Team Performance** — Frontend, Backend, QA team lanes
- **Environment** — Dev, Staging, Production comparison

The **Multiple Product Lanes** section only appears for widgets that support it.

---

## Sharing and Collaboration

| Feature | Description |
|---|---|
| **Public dashboards** | Visible to all logged-in users |
| **Private dashboards** | Only accessible to the creator |
| **Clone dashboards** | Create a personal copy of any dashboard |
| **URL sharing** | Direct links with embedded filter state — shareable and bookmarkable |
| **PDF Export** | Full-page PDF snapshot of the current dashboard view |
| **CSV Export** | Raw data export from the Test Analysis Table widget |

---

## Layout Management

| Feature | Description |
|---|---|
| **Drag-and-drop** | Move widgets by dragging their header |
| **Resize** | Drag the bottom-right corner |
| **Grid snapping** | Automatic alignment to grid |
| **Auto-save** | Layout changes save immediately |
| **Section Dividers** | Add Section Divider widgets to group related widgets and enable jump-to-section navigation |
| **Widget lock** | Widgets auto-lock (drag/resize disabled) while dashboard filters are active — clear filters to re-enable layout editing |

---

Next: [Notifications →](./notifications)
