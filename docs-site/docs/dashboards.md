---
sidebar_position: 5
title: Dashboards
description: Build custom test reporting dashboards in UReport. 13 widget types including pass rate trends, heatmaps, flakiness charts, and top failures. Supports sharing and PDF export.
---

# Dashboards

Dashboards provide customisable views of test data using a grid of 13 configurable widget types. Create personal or shared dashboards for single-project monitoring or cross-project comparison.

---

## Creating a Dashboard

1. Navigate to Dashboards and click **Create Dashboard**
2. Enter a **name** and optional description
3. Choose **visibility**: Public (visible to all users) or Private (only you)
4. Choose a **Product Lane Strategy**:
   - **Single Product Focus** — all widgets use one product lane (consistent filtering, faster setup)
   - **Multi-Product Flexibility** — each widget independently chooses its product lane (cross-product analysis)
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

## Widget Types

### Status Pie Chart

Pie chart of test execution results broken down by status (PASS / FAIL / SKIP / WARNING).

- Interactive legend with click-to-filter
- Configurable status inclusion (rerun, skip, etc.)
- Export to PDF and CSV

---

### Triaged Pie Chart

Pie chart showing investigation coverage — how many failures have been triaged and by what issue type. Distinct from Status Pie: shows triaged vs. untriaged breakdown and issue type distribution.

---

### Build History Bar

Bar or line chart displaying pass/fail/skip counts and pass rate across builds over time.

- Switch between **bar** and **line** modes
- Multi-product-lane comparison support
- Configurable X axis: Build Number or Start Date

---

### Summary Card — Status

Compact card grid showing pass/fail/skip counts and pass rate for the latest build. Colour-coded by result.

---

### Summary Card — Build

Compact card grid showing build-level metrics: total builds, pass rate distribution bucketed by threshold (100%, 90%+, 80%+, etc.).

---

### Summary Card — Triaged

Compact card grid showing triage coverage: triaged vs. untriaged failure counts, with per-issue-type breakdown.

---

### Treemap

Hierarchical visualisation of test distribution across a relation dimension.

- Group by components, teams, tags, or any custom relation
- Proportional sizing by test count
- Interactive drill-down

---

### Heatmap

Colour-coded matrix: rows are builds, columns are relation dimension values. Cell colour represents pass rate.

- Historical trend across multiple builds
- Group by any configured relation dimension

---

### Test Analysis Table

Tabular analysis of test behaviour patterns — identifies stable vs. unstable tests.

- Flakiness percentage per test
- Stable / Unstable / Consistent classification
- Export to CSV

---

### Top Tests Table

Ranked table surfacing the most impactful tests over a configurable time window (7, 30, or 90 days). Toggle between two modes at runtime:

| Mode | Columns |
|---|---|
| **Top Failures** | Fail count, last failed date |
| **Slowest Tests** | Avg / max duration, run count |

---

### Trend Insights

Detects anomalous pass-rate drops across recent builds using Z-score analysis.

- Highlights builds where pass rate deviated significantly from the historical baseline
- Overlays build duration trend to reveal if the suite is getting slower
- Configurable window (default: last 20 builds)

---

### Relations Group By

Stacked bar chart showing test counts and pass rates grouped by a relation attribute.

- Group by components, teams, tags, or any custom relation dimension
- Horizontal, vertical, or table view
- Category grouping for high-cardinality dimensions

---

### Section Divider

Visual separator that organises dashboard content into logical sections.

- Customisable title, colour, font size, and line style
- Enables jump-to-section navigation when multiple dividers are present
- Spans full dashboard width

---

## Widget Configuration

Each widget has specific configuration options accessible via the gear icon:

| Setting | Description |
|---|---|
| **Widget Title** | Custom label for the widget header |
| **Product Lane Selection** | Which product lane(s) the widget queries |
| **Date Range** | Overrides dashboard-level date range for this widget |
| **Refresh Rate** | Auto-refresh interval (minutes) |
| **Status Filters** | Which statuses to include/exclude |
| **Relation Filters** | Filter by relation dimension values |
| **Chart Type / Visual options** | Widget-specific display settings (axes, colours, layout) |

---

## Multi-Lane Comparison

Some widgets (e.g. Build History Bar) support comparing data from multiple product lanes side-by-side:

1. Open the widget editor
2. Expand **Multiple Product Lanes**
3. Click **Add Product Lane** to add additional data sources — configure each with a different filter combination
4. Use arrow buttons to reorder lanes; edit or remove as needed

Use cases:
- **Cross-Browser** — Chrome, Firefox, Safari lanes side-by-side
- **Team Performance** — Frontend, Backend, QA team lanes
- **Environment** — Dev, Staging, Production comparison

The "Multiple Product Lanes" section only appears for widgets that support it.

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
