---
sidebar_position: 7
title: Quarantine
description: Automatically suppress flaky tests in UReport with quarantine rules. Define failure thresholds, build windows, and auto-resolve conditions to keep your CI green.
---

# Test Quarantine

Quarantine automatically isolates consistently failing tests so they stop blocking CI. Quarantined tests are excluded from the pass rate calculation — the team can focus on real failures.

---

## What Quarantine Does

When a test is quarantined:

- It **still runs** in your test suite
- It is **excluded from the pass rate** — does not drag down build health metrics
- A **Quarantined** badge appears on the test in the Launches view and dashboards
- You can toggle quarantined tests on/off in Launches to see both the **effective pass rate** (quarantined excluded) and the **real pass rate** (including them)

This is the key difference between quarantine and triage:
- **Triage** — labels a test as known-failing, but it still counts against the pass rate
- **Quarantine** — removes the test from the pass rate calculation entirely

Quarantine is rule-driven and automatic — no one needs to manually flag flaky tests.

---

## Resolve vs Exempt

| Action | Effect | Re-quarantined? | Use case |
|---|---|---|---|
| **Resolve** | Clears the active quarantine flag | Yes — rule will re-quarantine if test keeps failing | "I think this is fixed, let's see if it holds" |
| **Exempt** | Excludes from all quarantine rules | No — evaluator skips exempt tests | "This test is known-flaky and we don't care about it" |
| **Un-exempt** | Removes the exemption, restoring eligibility | Yes — evaluator will re-quarantine if test keeps failing | "We fixed it, let the rule evaluate it again" |

---

## Quarantine Rules

Rules are configured from the **Launches page**. Click the **lock icon** (🔒) in the toolbar to open the rule editor for the current product/type.

### Threshold

Defines how many failures trigger quarantine. Both FAIL and SKIP statuses count as failures. Multiple threshold conditions can be combined (OR logic) — any single condition hit is enough to quarantine.

| Mode | Logic |
|---|---|
| **Total failures** | Test must fail in at least X builds across the window. The current build counts as +1, so threshold = 3 means 2 failures in the history window + the current build. |
| **Consecutive failures** | Test must fail (FAIL or SKIP) in the last X builds in a row. The current build counts as the final +1. A single pass or absent result resets the streak. |
| **Failure rate (%)** | Failure rate across the qualifying window must be ≥ configured %. The current build is **not** counted in the percentage — it only determines which tests are candidates (must have failed in current build to be evaluated). |

### Auto-Resolve

Defines how many consecutive passes clear quarantine. Default: **3 consecutive passes**. Evaluated on every new build.

- FAIL and SKIP both count as failures — only PASS counts as a pass
- If a test is absent from a build (not run), that build is **skipped** — the streak is not broken and continues from the next build where the test ran
- If a test fails or is skipped, the pass streak resets to zero
- **Min Pass Rate does not apply to auto-resolve** — all recent builds are counted, including low-health builds. This ensures tests that pass consistently in a failing suite are still resolved correctly.

### Scope & Filter

Limit which builds and tests the rule applies to:

- **Scope fields**: version, team, browser, device, platform, platform_version, stage, and custom parameters (extras)
- **Name pattern**: case-insensitive regex matched against the test UID
- **Relation filters**: match by component, tag, team relation, etc.

---

## Build Window Settings

Each product lane has four global controls for the qualifying window:

| Setting | Default | Effect |
|---|---|---|
| **Rolling window (builds)** | 10 | How many recent qualifying builds to evaluate. Only builds with a pass rate above Min Pass Rate are counted. |
| **Min pass rate (%)** | 70 | Builds below this pass rate are excluded from the qualifying window. Minimum enforced at 50%. Prevents mass quarantines during environment outages. |
| **Min qualifying builds** | 0 (disabled) | A rule is skipped unless at least this many qualifying builds exist. Prevents false quarantines for new suites with limited history. |
| **Max window age (days)** | 0 (disabled) | Builds older than this are excluded regardless of window size. |

:::info
**Total and Consecutive modes:** The current build always counts as +1. For threshold = 3 total, the test needs 2 failures in the qualifying window plus the current build. For consecutive = 5, the test needs 4 consecutive failures in the window (most recent first) plus the current build.

**Ratio mode:** The current build is NOT counted in the percentage. The ratio is calculated from the qualifying window only.
:::

---

## Low Pass Rate Suites

If your suite always has a low pass rate, each rule has an optional **Min pass rate override (%)** that replaces the global threshold for that specific rule.

| Setting | Effect |
|---|---|
| No override | Uses the global Min Pass Rate for both the current-build guard and qualifying window filter |
| Override = 40 | Rule evaluates even when current build is at 40%; past builds below 40% excluded from window |
| Override = 0 | Guard fully disabled — rule always evaluates; all past builds count regardless of pass rate |

:::tip
Use override = 0 for suites where many tests are unmaintained or consistently failing — e.g. nightly regression suites on staging. The global setting still protects other rules.
:::

---

## Broad vs Scoped Rules

| Rule type | Scope defined | Applies to |
|---|---|---|
| **Broad rule** | None (all scope fields empty) | All builds for the product/type. Each build is evaluated against its own scope history — a `team=A` build compares against `team=A` history only. |
| **Scoped rule** | One or more fields set (e.g. `browser = Chrome`) | Only builds where those fields match exactly |

Both types can coexist. A test can be quarantined by a broad rule and separately by a scoped rule — each creates an independent quarantine record.

:::tip
Use broad rules as the default baseline. Use scoped rules to add stricter monitoring for a specific lane (e.g. a browser or environment known to be flakier).
:::

---

## Stored Scope

When a test is quarantined, UReport stores a scope on the resulting record. This controls which builds will later see that test as quarantined in Launches.

| Rule scope | Stored scope on record | Visible on Launches for |
|---|---|---|
| No scope (broad rule) | Exact build values — e.g. `team=payments, browser=chrome, version=1.2` | Only that exact build combination |
| Partial scope — e.g. `team=payments` only | Rule's values, unset fields stored as blank (wildcard) — e.g. `team=payments, browser=<blank>` | All builds with `team=payments`, regardless of browser or version |
| Full scope — e.g. `team=payments, browser=chrome` | Exact rule values | Only `team=payments` + `browser=chrome` builds |

**Blank = wildcard.** A blank field in the stored scope means "this quarantine applies regardless of what value this field has."

---

## Custom Parameters (Extras)

Scope rules to specific `extras` values (e.g. `tenant=acme`, `shard=1`, `datacenter=us-east`):

| Scenario | Rule extras scope | Build extras | Rule runs? | Visible on Launches? |
|---|---|---|---|---|
| Exact match | `tenant=acme` | `tenant=acme` | Yes | Yes (acme builds only) |
| Mismatch | `tenant=acme` | `tenant=globex` | No | No |
| No extras on rule | (none) | `tenant=acme` | Yes (broad) | Yes (stored with build's extras) |
| No extras anywhere | (none) | (none) | Yes | Yes (no extras filtering) |

Custom parameters must be reported by your test reporter and configured in the product lane to appear as scope options.

---

## When the Evaluator Runs

Automatically after every build status calculation — never blocks the build result:

1. **Build completes** — status (pass/fail counts) calculated. Archived builds are skipped.
2. **Rules evaluated** — each enabled rule checks all failing UIDs in the current build against the historical window.
3. **Quarantine or resolve** — tests crossing the threshold are quarantined. Already-quarantined tests with enough consecutive passes are auto-resolved.

---

## Status Reference

| Badge | Meaning |
|---|---|
| **Quarantined** | Currently quarantined — excluded from pass rate, shown with badge in Launches and dashboards |
| **Exempt** | Excluded from all quarantine rules — can be un-exempted to restore eligibility |
| **Resolved** | Was quarantined but has since passed enough consecutive builds — no longer quarantined |

---

## Using the Quarantine Page

Navigate to **Administration → Quarantined Tests**. By default shows only active quarantined tests. Use the status toggle to also show resolved and exempt entries. Search by UID, product, or type; sort by any column.

**Click the rule name** in the Rule column to view the rule's threshold conditions, resolve-after passes, scope, and name pattern filter.

**Actions** (Admin only):

| Action | Description |
|---|---|
| **Resolve** (✓) | Marks as resolved. Rule will re-quarantine if test continues failing in future builds. |
| **Exempt** (🚫) | Excludes from all quarantine rules. |
| **Un-exempt** (↩) | Shown on exempt tests. Removes exemption — test becomes eligible for quarantine again. |

Resolved tests show no action buttons. Exempt tests show only Un-exempt.

---

## Worked Example

**Settings:** Rolling window = 5 builds, Min pass rate = 70%, Resolve after = 3 consecutive passes.

**Rules:**

| Rule | Scope | Condition |
|---|---|---|
| Rule A | (none — broad) | Total failures ≥ 3 |
| Rule B | browser = chrome | Consecutive failures ≥ 3 |
| Rule C | (none — broad) | Failure rate ≥ 60% |

**Build history** (B6 is current build, pass rate 78%):

| Build | Pass rate | Qualifies? | test-login | test-payment | test-search | test-legacy |
|---|---|---|---|---|---|---|
| B5 | 85% | Yes | FAIL | FAIL | FAIL | FAIL |
| B4 | 40% | **No** (excluded) | FAIL | FAIL | FAIL | FAIL |
| B3 | 80% | Yes | PASS | FAIL | FAIL | FAIL |
| B2 | 75% | Yes | FAIL | FAIL | PASS | FAIL |
| B1 | 90% | Yes | PASS | FAIL | PASS | FAIL |
| B0 | 85% | Yes | PASS | FAIL | PASS | FAIL |
| **B6 (current)** | 78% | Yes | FAIL | FAIL | FAIL | EXEMPT |

Qualifying window = [B5, B3, B2, B1, B0] — B4 excluded (40% < 70%).

**Rule A — Total failures ≥ 3 (broad):**

| Test | Failures in window | +1 current | Total | Result |
|---|---|---|---|---|
| test-login | B5, B2 = 2 | +1 | **3** | Quarantined |
| test-payment | B5, B3, B2, B1, B0 = 5 | +1 | **6** | Quarantined |
| test-search | B5, B3 = 2 | +1 | **3** | Quarantined |
| test-legacy | — | — | — | Exempt — skipped |

**Rule B — Consecutive failures ≥ 3 (chrome builds only), walking window most-recent-first:**

| Test | Streak | +1 current | Result |
|---|---|---|---|
| test-payment | B5(1) → B3(2) → B2(3) | +1 | **4** — Quarantined |
| test-login | B5(1) → B3 **PASS** → streak reset | +1 | 2 — Not quarantined |

Note: B4 is not in the window, so it does not break the streak for test-payment.

**Rule C — Failure rate ≥ 60% (broad, current build not counted in percentage):**

| Test | Failures in window | Window size | Rate | Result |
|---|---|---|---|---|
| test-payment | 5 | 5 | 100% | Quarantined |
| test-search | 2 | 5 | 40% | Not quarantined (below 60%) |
| test-login | 2 | 5 | 40% | Not quarantined (below 60%) |

**Scope and stored records:** Rule A and C are broad — they store exact build values on each record (only that exact scope combination will see the test as quarantined). Rule B is scoped to `browser=chrome` — stored record has `{ browser: 'chrome', team: '', version: '', ... }` (blank = wildcard), so all chrome builds see it as quarantined regardless of team or version.

**Auto-resolve — test-login after being quarantined by Rule A:**

| Build | test-login | Pass streak | Note |
|---|---|---|---|
| B7 | PASS | 1 | Streak starts |
| B8 | NOT RUN | 1 | Build skipped — streak not broken, not incremented |
| B9 | PASS | 2 | Streak continues |
| B10 | PASS | **3** | **Resolved** |

At B10, the evaluator sees 3 consecutive passes (B7, B9, B10 — B8 skipped) and auto-resolves test-login.

---

Next: [Auto-Triage →](./auto-triage)
