"use strict";

/**
 * Demo data for the auto-heal feature (Launches heal filter and icons, exclusion rules, signal detail,
 * lane settings) and for the Product Lanes page (dormant lanes).
 *
 * Called by scripts/seedDemo.js after the Acme / Orion data. It only adds new products, so nothing the
 * FE automation relies on (Acme, Orion) is touched:
 *
 *   Nova    dedicated to auto-heal. Every lane is described below.
 *   Legacy  a few lanes with an old last run, so "Load dormant lanes" has something to load.
 *
 * Statuses are written out per test (P = pass, F = fail, S = skip, oldest build first) instead of
 * drawn at random, so what each test shows on the Launches page is the same on every run.
 */

const crypto = require("crypto");
const mongoose = require("mongoose");

const Build = require("../src/models/build");
const Test = require("../src/models/test");
const TestRelation = require("../src/models/test_relation");
const Setting = require("../src/models/setting");
const Preset = require("../src/models/preset");
const QuarantinedTest = require("../src/models/quarantined_test");
const HealPlaybook = require("../src/models/heal_playbook");
const HealSignal = require("../src/models/heal_signal");
const HealExclusion = require("../src/models/heal_exclusion");

const NOVA = "Nova";
const LEGACY = "Legacy";
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const PLAYBOOK_NAME = "Nova default playbook";

const CI = { stage: "CI", platform: "linux", platform_version: "22.04" };
const STAGING = { stage: "staging", platform: "linux", platform_version: "22.04" };

// ─── Nova / regression (CI): the lane auto-heal is on for ────────────────────

/**
 * One row per test. `runs` has one letter per build, oldest first; the last letter is the newest build,
 * the one the Launches page opens. `signal` says what auto-heal did with the failure of that build.
 */
const REGRESSION_TESTS = [
  // A failure with a signal in every state of the pipeline, so each icon and each filter has a test
  { uid: "nova/checkout/apply-promo-code", runs: "PPPPPPPF", signal: { status: "pending" } },
  { uid: "nova/checkout/guest-checkout", runs: "PPPPPPPF", signal: { status: "queued" } },
  { uid: "nova/checkout/saved-card-payment", runs: "PPPPPPPF", signal: { status: "running" } },
  { uid: "nova/checkout/split-payment", runs: "PPPPPPPF", signal: { status: "open", external: true } },
  { uid: "nova/checkout/gift-card-balance", runs: "PPPPPPPF", signal: { status: "claimed", external: true } },
  // The PR / Fix outcomes: a PR with a link ref, a PR with a plain-text ref, a fix without a PR
  { uid: "nova/cart/change-quantity", runs: "PPPPPPPF", signal: { status: "pr_created", ref: "https://jira.nova.example.com/browse/NOVA-1234" } },
  { uid: "nova/cart/delete-line-item", runs: "PPPPPPPF", signal: { status: "pr_created", ref: "NOVA-1235" } },
  { uid: "nova/cart/merge-guest-cart", runs: "PPPPPPPF", signal: { status: "completed", external: true } },
  // Closed without a code change
  { uid: "nova/search/filter-by-price", runs: "PFPFPFPF", signal: { status: "completed", external: true, reason: "flaky" } },
  { uid: "nova/search/autocomplete", runs: "PFPPFPPF", signal: { status: "completed", external: true, reason: "not_reproducible" }, quarantine: "active" },
  // The other outcomes
  { uid: "nova/search/sort-by-rating", runs: "PPPPPPPF", signal: { status: "bug_confirmed", external: true } },
  { uid: "nova/profile/upload-avatar", runs: "PPPPPPPF", signal: { status: "test_failed" } },
  { uid: "nova/profile/change-password", runs: "PPPPPPPF", signal: { status: "error" } },
  { uid: "nova/profile/delete-account", runs: "PPPPPPPF", signal: { status: "timed_out" } },
  { uid: "nova/profile/export-data", runs: "PPPPPPPF", signal: { status: "no_agent" } },
  // Failing with no signal and no rule: "Never Healed". It has failed 4 builds in a row, which is what
  // "Skip if failed in last N builds" is for.
  { uid: "nova/orders/void-purchase", runs: "PPPPFFFF", rule: "otherLane" },
  // Failing, covered by an exclusion rule, no signal: the excluded marker shows
  { uid: "nova/orders/track-shipment", runs: "PPPPPPPF", error: "Carrier API request failed: carrier gateway timeout after 30s" },
  // Covered by a rule and also has a signal of this run: the signal wins, the marker stays hidden
  { uid: "nova/orders/return-request", runs: "PPPPPPPF", signal: { status: "queued", by: "user:admin" } },
  // Covered by a rule, with a signal from an earlier build only: the marker shows next to the old heart
  { uid: "nova/orders/reorder", runs: "PPPPPFFF", file: "reorder.spec.js", signal: { status: "completed", external: true, build: 5 } },
  // The rule for this one has expired, so it is not excluded any more: "Never Healed"
  { uid: "nova/notifications/push-opt-in", runs: "PPPPPPPF" },
  // Passing now, with a signal from the past and a resolved quarantine record
  { uid: "nova/notifications/email-digest", runs: "PPPFPPPP", signal: { status: "completed", external: true, build: 3 }, quarantine: "resolved" },
  { uid: "nova/notifications/sms-fallback", runs: "PPPPPPPS" },
  { uid: "nova/home/load-hero", runs: "PPPPPPPP" },
  { uid: "nova/home/nav-menu", runs: "PPPPPPPP" },
  { uid: "nova/home/footer-links", runs: "PPPPPPPP" },
  { uid: "nova/account/sign-in", runs: "PPPPPPPP" },
  { uid: "nova/account/sign-out", runs: "PPPPPPPP" },
  { uid: "nova/account/remember-me", runs: "PPPPPPPP" },
  { uid: "nova/account/password-reset", runs: "PPPPPPPP" },
  { uid: "nova/account/two-factor", runs: "PPPPPPPP" },
  { uid: "nova/account/profile-view", runs: "PPPPPPPP" },
];

const REGRESSION_ERRORS = {
  "nova/checkout/apply-promo-code": "Expected discount of 10% to be applied but the total was unchanged",
  "nova/checkout/guest-checkout": "Timed out waiting for the payment iframe to load after 15000ms",
  "nova/checkout/saved-card-payment": "Expected order status CONFIRMED but got PAYMENT_PENDING",
  "nova/checkout/split-payment": "Split payment total 120.00 does not match order total 125.00",
  "nova/checkout/gift-card-balance": "Gift card balance endpoint returned 500 Internal Server Error",
  "nova/cart/change-quantity": "Expected cart badge to show 3 but found 2",
  "nova/cart/delete-line-item": "Locator [data-testid=remove-item] resolved to 0 elements",
  "nova/cart/merge-guest-cart": "Guest cart items were lost after sign-in: expected 4 items, found 0",
  "nova/search/filter-by-price": "Expected 12 results for price range 10-50 but got 11",
  "nova/search/autocomplete": "Suggestion list did not appear within 5000ms",
  "nova/search/sort-by-rating": "Results are not sorted by rating: item 3 has 4.1 after item 4 with 3.9",
  "nova/profile/upload-avatar": "Upload rejected: file type image/webp is not allowed",
  "nova/profile/change-password": "Expected success toast after changing the password, none was shown",
  "nova/profile/delete-account": "Delete account dialog stayed open after confirming",
  "nova/profile/export-data": "Export request returned 202 but no download link was emailed",
  "nova/orders/void-purchase": "Cancel button is disabled for an order in status PROCESSING",
  "nova/orders/track-shipment": "Carrier API request failed: carrier gateway timeout after 30s",
  "nova/orders/return-request": "Return form rejected the order number format",
  "nova/orders/reorder": "Reorder added 2 of 3 items: item SKU-4471 is out of stock",
  "nova/notifications/push-opt-in": "Push permission prompt was not shown on first visit",
};

/** What each exclusion rule covers; `uid`s are the Nova/regression tests above. */
const NOVA_EXCLUSIONS = [
  { target: "error", match: "regex", value: "carrier gateway time-?out", reason: "Carrier sandbox is flaky; nothing in our code to fix", match_count: 14, matchedDaysAgo: 1, createdDaysAgo: 20, scope: {} },
  { target: "uid", match: "equals", value: "nova/orders/return-request", reason: "Needs a manual order fixture", match_count: 3, matchedDaysAgo: 0, createdDaysAgo: 8, scope: { stage: "CI" } },
  { target: "path", match: "ends_with", value: "reorder.spec.js", reason: "Depends on live inventory, cannot be rerun by the agent", match_count: 6, matchedDaysAgo: 2, createdDaysAgo: 12, scope: {} },
  { target: "uid", match: "equals", value: "nova/notifications/push-opt-in", reason: "Browser permission prompt cannot be automated (rule expired)", match_count: 2, matchedDaysAgo: 9, createdDaysAgo: 30, expiredDaysAgo: 2, scope: {} },
  { target: "uid", match: "equals", value: "nova/orders/void-purchase", reason: "Prod-only quirk, does not apply to the CI lane", match_count: 0, createdDaysAgo: 5, scope: { stage: "prod" } },
  { target: "uid", match: "equals", value: "nova/legacy/removed-test", reason: "Added by the agent for a test that no longer exists (never matches)", match_count: 0, createdDaysAgo: 40, scope: {}, source: "agent" },
];

// ─── Other Nova lanes ────────────────────────────────────────────────────────

/** Same product and type, another stage: the CI-scoped rule does not cover it, and no heal scope matches it. */
const STAGING_TESTS = [
  { uid: "nova/orders/return-request", runs: "PPPPF" },
  { uid: "nova/checkout/apply-promo-code", runs: "PPPPF" },
  { uid: "nova/checkout/guest-checkout", runs: "PPPPP" },
  { uid: "nova/home/load-hero", runs: "PPPPP" },
  { uid: "nova/home/nav-menu", runs: "PPPPP" },
  { uid: "nova/account/sign-in", runs: "PPPPP" },
];

/** Auto-heal is off for this lane: no exclude button, never-healed failures with no way to heal them. */
const SMOKE_TESTS = [
  { uid: "nova/smoke/health-check", runs: "PPPPPP" },
  { uid: "nova/smoke/login-page", runs: "PPPPFF" },
  { uid: "nova/smoke/search-page", runs: "PPPPPF" },
  { uid: "nova/smoke/cart-page", runs: "PPPPPP" },
  { uid: "nova/smoke/checkout-page", runs: "PPPPPP" },
  { uid: "nova/smoke/profile-page", runs: "PPPPPP" },
  { uid: "nova/smoke/orders-page", runs: "PPPPPP" },
  { uid: "nova/smoke/footer", runs: "PPPPPP" },
];

/** The newest build fails 8 of 10 tests, above the lane's 40% limit: the mass-failure guard skips it. */
const API_TESTS = [
  "nova/api/orders-list", "nova/api/orders-create", "nova/api/orders-cancel", "nova/api/cart-add",
  "nova/api/cart-remove", "nova/api/search", "nova/api/profile-get", "nova/api/profile-update",
  "nova/api/payments-charge", "nova/api/payments-refund",
].map((uid, i) => ({ uid, runs: i < 8 ? "PPPPPF" : "PPPPPP" }));

// ─── Legacy: lanes with an old last run ──────────────────────────────────────

const LEGACY_UIDS = ["legacy/login", "legacy/reports", "legacy/export", "legacy/settings", "legacy/audit", "legacy/help"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const md5 = (text) => crypto.createHash("md5").update(text).digest("hex");
const statusOf = (letter) => (letter === "F" ? "FAIL" : letter === "S" ? "SKIP" : "PASS");

function stack(uid, message) {
  return `Error: ${message}\n    at runTest (${uid.split("/").pop()}.spec.js:42:15)\n    at TestRunner.run (runner.js:120:8)`;
}

function relationsFor(product, type, uids) {
  return uids.map((uid) => {
    const area = uid.split("/")[1] || "core";
    return { uid, product, type, components: [`${area}-service`], teams: [`${area}-team`], tags: ["auto-heal-demo"] };
  });
}

/**
 * Seeds the builds and tests of one lane. `rows` hold one run letter per build, oldest first.
 * Returns the build documents and, per build, the test documents by uid.
 */
async function seedLane(ctx, { product, type, lane, rows, errors = {}, endedAgo = 2 * HOUR, spacing = 2 * DAY, buildStart = 200, newestAt = null }) {
  const count = rows[0].runs.length;
  const newest = newestAt != null ? newestAt : Date.now() - endedAgo;
  const builds = [];
  const testsByBuild = [];

  for (let bi = 0; bi < count; bi++) {
    const start = new Date(newest - (count - 1 - bi) * spacing);
    const build = await Build.create({
      product, type, build: buildStart + bi, ...lane,
      start_time: start, end_time: new Date(start.getTime() + 25 * 60 * 1000),
      status: { total: 0, pass: 0, fail: 0, skip: 0, warning: 0 },
    });

    let pass = 0, fail = 0, skip = 0;
    const docs = rows.map((row, idx) => {
      const status = statusOf(row.runs[bi]);
      if (status === "PASS") pass++; else if (status === "FAIL") fail++; else skip++;
      const testStart = new Date(start.getTime() + (idx + 1) * 20 * 1000);
      const durationMs = 900 + ((idx * 377) % 4000);
      const { info, setup, body, teardown } = ctx.generateTestData(row.uid, "e2e", status, durationMs, buildStart + bi);
      if (row.file) info.file = row.file;
      const doc = {
        uid: row.uid, build: build._id, name: ctx.uid2name(row.uid), status,
        start_time: testStart, end_time: new Date(testStart.getTime() + durationMs),
        info, setup, body, teardown,
      };
      if (status === "FAIL") {
        const message = row.error || errors[row.uid] || "Assertion failed: expected the page to match the snapshot";
        doc.failure = { error_message: message, stack_trace: stack(row.uid, message) };
      }
      return doc;
    });

    const inserted = await Test.insertMany(docs);
    await Build.updateOne({ _id: build._id }, { $set: { status: { total: rows.length, pass, fail, skip, warning: 0 } } });
    builds.push(build);
    testsByBuild.push(new Map(inserted.map((t) => [t.uid, t])));
  }
  return { builds, testsByBuild };
}

function laneHistory(row, bi, builds) {
  const history = [];
  for (let i = bi - 1; i >= 0 && history.length < 10; i--) {
    history.push({ build_number: builds[i].build, status: row.runs[i] === "F" ? "FAIL" : "PASS", start_time: builds[i].start_time });
  }
  return history;
}

/** The signal document for a failure, filled the way the agent / external consumer would leave it. */
function buildSignal({ row, bi, builds, testsByBuild, lane, playbook }) {
  const signal = row.signal;
  const build = builds[bi];
  const test = testsByBuild[bi].get(row.uid);
  const message = test.failure ? test.failure.error_message : "Assertion failed";
  const external = !!signal.external;
  const triggeredAt = new Date(build.end_time.getTime() + 5 * 60 * 1000);
  const completedAt = new Date(triggeredAt.getTime() + 18 * 60 * 1000);
  const slug = row.uid.split("/").pop();

  const doc = {
    product: build.product,
    type: build.type,
    test_uid: row.uid,
    test_name: test.name,
    test_file: test.info && test.info.file,
    test_id: test._id,
    build_id: build._id,
    playbook_id: external ? undefined : playbook._id,
    playbook_snapshot: external ? undefined : { name: playbook.name, mode: playbook.mode, pipeline: playbook.pipeline },
    triggered_by: signal.by || "auto",
    triggered_at: triggeredAt,
    dispatch_mode: external ? "external" : "agent",
    failure_snapshot: { error_message: message, stack_trace: test.failure ? test.failure.stack_trace : undefined },
    failure_group_id: md5(message).substring(0, 16),
    lane,
    lane_history: laneHistory(row, bi, builds),
    affected_test_ids: [test._id],
    affected_test_uids: [row.uid],
    status: signal.status,
    steps_completed: 0,
    progress_log: [],
  };

  const log = (index, id, status, text) => ({ received_at: new Date(triggeredAt.getTime() + index * 4 * 60 * 1000), step_index: index, step_id: id, status, message: text });
  const ai = { provider: "claude-cli", model: "claude-sonnet-5-5", input_tokens: 18400, output_tokens: 2650 };

  switch (signal.status) {
    case "running":
      doc.agent_id = "a1b2c3d4e5f60718";
      doc.running_since = triggeredAt;
      doc.steps_completed = 2;
      doc.progress_log = [
        log(0, "checkout", "completed", `Checked out branch heal/${slug}`),
        log(1, "aiFix", "completed", "Agent changed 1 file"),
        log(2, "verify", "running", "Running the test against the change"),
      ];
      break;
    case "claimed":
      doc.claimed_at = new Date(triggeredAt.getTime() + 10 * 60 * 1000);
      doc.claimed_by = "ci-heal-bot";
      break;
    case "pr_created":
      doc.agent_id = "a1b2c3d4e5f60718";
      doc.steps_completed = 4;
      doc.running_since = triggeredAt;
      doc.completed_at = completedAt;
      doc.ai = ai;
      doc.branch = `heal/${slug}`;
      doc.pr_url = `https://git.nova.example.com/nova/web/pull/${1200 + Math.abs(md5(row.uid).charCodeAt(0))}`;
      doc.external_ref = signal.ref;
      doc.diff_summary = `1 file changed: wait for the ${slug.replace(/-/g, " ")} element before asserting`;
      doc.test_output = `✓ ${row.uid} passed (3.1s)`;
      doc.agent_analysis = `The test asserted before the page finished rendering. I added an explicit wait for the element and the test now passes.`;
      doc.progress_log = [
        log(0, "checkout", "completed", `Checked out branch heal/${slug}`),
        log(1, "aiFix", "completed", "Agent changed 1 file"),
        log(2, "verify", "completed", "Test passed after the change"),
        log(3, "createPr", "completed", "Opened the pull request"),
      ];
      break;
    case "completed":
      doc.claimed_at = new Date(triggeredAt.getTime() + 6 * 60 * 1000);
      doc.claimed_by = "ci-heal-bot";
      doc.completed_at = completedAt;
      if (signal.reason) {
        doc.completion_reason = signal.reason;
        doc.agent_analysis = signal.reason === "flaky"
          ? "The failure comes and goes between runs with no code change. It passed 6 of the last 10 reruns, so I treat it as flaky."
          : "I ran the test 10 times against the same commit and it passed every time. I could not reproduce the failure.";
      } else {
        doc.external_ref = `https://git.nova.example.com/nova/web/pull/${1300 + Math.abs(md5(row.uid).charCodeAt(1))}`;
        doc.agent_analysis = "The selector changed in the last release. I updated the test to use the new data-testid.";
      }
      break;
    case "bug_confirmed":
      doc.claimed_at = new Date(triggeredAt.getTime() + 6 * 60 * 1000);
      doc.claimed_by = "ci-heal-bot";
      doc.completed_at = completedAt;
      doc.agent_analysis = "The test is correct. The results list ignores the rating sort once a price filter is applied, which is a product defect.";
      doc.bug_report = {
        summary: "Sorting by rating is ignored when a price filter is active",
        severity: "P2",
        affected_component: "search-service",
        expected_behavior: "Results are ordered by rating, highest first, within the filtered set",
        actual_behavior: "Results keep the default relevance order; item 3 (4.1) appears after item 4 (3.9)",
        reproduction_steps: "1. Open /search?q=lamp\n2. Set the price filter to 10-50\n3. Choose Sort by: Rating\n4. Compare the ratings of the first five results",
        evidence: "Screenshot and the response of GET /api/search?sort=rating&price=10-50 attached to the run",
        tracking_url: "https://jira.nova.example.com/browse/NOVA-2201",
      };
      break;
    case "test_failed":
      doc.agent_id = "a1b2c3d4e5f60718";
      doc.steps_completed = 3;
      doc.running_since = triggeredAt;
      doc.completed_at = completedAt;
      doc.ai = ai;
      doc.attempted_diff = "--- a/avatar.spec.js\n+++ b/avatar.spec.js\n@@ -18,4 +18,4 @@\n-  await upload('avatar.webp')\n+  await upload('avatar.png')";
      doc.agent_analysis = "Switching the fixture to PNG made the upload pass but the test then failed on the cropping step, which needs a design decision.";
      doc.progress_log = [
        log(0, "checkout", "completed", `Checked out branch heal/${slug}`),
        log(1, "aiFix", "completed", "Agent changed 1 file"),
        log(2, "verify", "failed", "Test still failed after the change"),
      ];
      break;
    case "error":
      doc.agent_id = "a1b2c3d4e5f60718";
      doc.steps_completed = 1;
      doc.error_detail = "Agent stopped: git checkout failed (remote branch heal/change-password already exists)";
      doc.progress_log = [log(0, "checkout", "failed", "git checkout failed")];
      break;
    case "timed_out":
      doc.agent_id = "a1b2c3d4e5f60718";
      doc.running_since = triggeredAt;
      doc.error_detail = "The agent did not report back within 30 minutes";
      break;
    case "no_agent":
      doc.error_detail = "No agent was connected when the signal was created";
      break;
    default:
      break;
  }
  return doc;
}

// ─── Seed ────────────────────────────────────────────────────────────────────

/** Removes what this module seeds, so a rerun starts clean. */
async function clearHealDemo() {
  const products = { $in: [NOVA, LEGACY] };
  const buildIds = await Build.find({ product: products }).distinct("_id");
  await Test.deleteMany({ build: { $in: buildIds } });
  await Build.deleteMany({ product: products });
  await TestRelation.deleteMany({ product: products });
  await Setting.deleteMany({ product: products });
  await QuarantinedTest.deleteMany({ product: products });
  await HealSignal.deleteMany({ product: products });
  await HealExclusion.deleteMany({ product: products });
  await HealPlaybook.deleteMany({ name: PLAYBOOK_NAME });
  await Preset.deleteMany({ name: /^Nova/ });
}

async function seedPlaybook() {
  return HealPlaybook.create({
    name: PLAYBOOK_NAME,
    mode: "guided",
    active: true,
    pipeline: {
      checkout: { enabled: true, branchPrefix: "heal/", baseBranch: "main" },
      aiFix: {
        enabled: true,
        instructions: "Fix the failing test {{test.name}} in {{test.file}}. Change the test, not the product code.\n\n## How to Run\nnpx playwright test {{test.file}} --grep \"{{test.name}}\"",
      },
      verify: { enabled: true },
      createPr: { enabled: true, titleTemplate: "fix(test): {{test.name}}", baseBranch: "main" },
    },
  });
}

function healSettings(playbook, overrides) {
  return {
    enabled: true,
    scopes: [],
    dispatch_mode: "agent",
    default_playbook_id: playbook._id,
    exclude_quarantined: false,
    new_failures_only: false,
    dedup_days: 7,
    max_failure_rate: 0,
    max_prior_failures: 3,
    max_signals_per_trigger: 10,
    ...overrides,
  };
}

async function seedSettings(ctx, playbook) {
  const issueTypes = [
    { label: "Defect", icon: "icofont icofont-bug", key: "Defect", color: "#ff8282" },
    { label: "Automation Issue", icon: "fas fa-wrench", key: "Automation", color: "#a74fff" },
    { label: "Feature Change", icon: "fas fa-certificate", key: "Feature Change", color: "#4f7bff" },
    { label: "System", icon: "fas fa-laptop", key: "System", color: "#ff4fa7" },
  ];
  const quarantine = { builds: 10, min_pass_rate: 70, rules: [ctx.QUARANTINE_RULES.consecutiveFailures, ctx.QUARANTINE_RULES.highFailRate] };
  const base = { product: NOVA, product_line: {}, issue_type: issueTypes, quarantine_rules: quarantine };

  await Setting.insertMany([
    {
      ...base,
      type: "regression",
      description: "Nova web regression suite: the lane auto-heal runs on",
      auto_heal_settings: healSettings(playbook, {
        // Only the CI lane is covered; the staging lane has no scope, and the prod scope is switched off
        scopes: [
          { name: "CI lane", enabled: true, scope: { stage: "CI" } },
          { name: "Prod lane (paused)", enabled: false, scope: { stage: "prod" } },
        ],
        exclude_quarantined: true,
        max_failure_rate: 75,
      }),
    },
    {
      ...base,
      type: "smoke",
      description: "Nova smoke suite: auto-heal is off for this lane",
      auto_heal_settings: healSettings(playbook, { enabled: false, scopes: [] }),
    },
    {
      ...base,
      type: "api",
      description: "Nova API suite: a build that fails most tests, guarded by a 40% limit",
      auto_heal_settings: healSettings(playbook, { scopes: [{ name: "All lanes", enabled: true, scope: {} }], max_failure_rate: 40, new_failures_only: true }),
    },
  ]);
  console.log(`\n  ✓ Product settings for ${NOVA} (regression: heal on, smoke: heal off, api: 40% failure limit)`);
}

async function seedExclusions(regression) {
  const newest = regression.builds[regression.builds.length - 1];
  const docs = NOVA_EXCLUSIONS.map((rule) => ({
    product: NOVA,
    type: "regression",
    scope: rule.scope,
    target: rule.target,
    match: rule.match,
    value: rule.value,
    reason: rule.reason,
    source: rule.source || "user",
    created_by: rule.source === "agent" ? "agent" : "admin",
    created_at: new Date(Date.now() - rule.createdDaysAgo * DAY),
    match_count: rule.match_count,
    ...(rule.matchedDaysAgo != null ? { last_matched_at: new Date(Date.now() - rule.matchedDaysAgo * DAY) } : {}),
    ...(rule.expiredDaysAgo != null ? { expires_at: new Date(Date.now() - rule.expiredDaysAgo * DAY) } : {}),
  }));
  await HealExclusion.insertMany(docs);
  console.log(`  ✓ ${docs.length} exclusion rules (build ${newest.build} is the one they are measured against)`);
}

async function seedQuarantine(ctx) {
  const docs = REGRESSION_TESTS.filter((r) => r.quarantine).map((r) => {
    const active = r.quarantine === "active";
    return {
      uid: r.uid,
      product: NOVA,
      type: "regression",
      rule_id: ctx.QUARANTINE_RULES.highFailRate._id,
      rule_name: ctx.QUARANTINE_RULES.highFailRate.name,
      quarantined_at: new Date(Date.now() - 12 * DAY),
      fail_snapshot: 5,
      build_snapshot: 10,
      is_active: active,
      is_exempt: false,
      resolved_at: active ? null : new Date(Date.now() - 3 * DAY),
    };
  });
  await QuarantinedTest.insertMany(docs);
  console.log(`  ✓ ${docs.length} quarantined tests in ${NOVA}/regression (1 active, 1 resolved)`);
}

async function seedNova(ctx) {
  console.log(`\n  Seeding ${NOVA} (auto-heal)...`);
  const playbook = await seedPlaybook();

  await TestRelation.insertMany(relationsFor(NOVA, "regression", REGRESSION_TESTS.map((r) => r.uid)));
  const regression = await seedLane(ctx, { product: NOVA, type: "regression", lane: CI, rows: REGRESSION_TESTS, errors: REGRESSION_ERRORS });
  console.log(`    ✓ ${NOVA}/regression stage=CI: ${regression.builds.length} builds × ${REGRESSION_TESTS.length} tests`);

  const staging = await seedLane(ctx, { product: NOVA, type: "regression", lane: STAGING, rows: STAGING_TESTS, errors: REGRESSION_ERRORS, buildStart: 300, endedAgo: 5 * HOUR });
  console.log(`    ✓ ${NOVA}/regression stage=staging: ${staging.builds.length} builds`);

  await TestRelation.insertMany(relationsFor(NOVA, "smoke", SMOKE_TESTS.map((r) => r.uid)));
  const smoke = await seedLane(ctx, { product: NOVA, type: "smoke", lane: CI, rows: SMOKE_TESTS, buildStart: 400, endedAgo: 3 * HOUR });
  console.log(`    ✓ ${NOVA}/smoke: ${smoke.builds.length} builds`);

  await TestRelation.insertMany(relationsFor(NOVA, "api", API_TESTS.map((r) => r.uid)));
  const api = await seedLane(ctx, { product: NOVA, type: "api", lane: CI, rows: API_TESTS, buildStart: 500, endedAgo: 90 * 60 * 1000 });
  console.log(`    ✓ ${NOVA}/api: ${api.builds.length} builds (the newest fails 8 of 10)`);

  // Signals, from the rows that have one
  const signals = [];
  REGRESSION_TESTS.forEach((row) => {
    if (!row.signal) return;
    const bi = row.signal.build != null ? row.signal.build : regression.builds.length - 1;
    signals.push(buildSignal({ row, bi, builds: regression.builds, testsByBuild: regression.testsByBuild, lane: CI, playbook }));
  });
  await HealSignal.insertMany(signals);
  console.log(`  ✓ ${signals.length} heal signals`);

  await seedSettings(ctx, playbook);
  await seedExclusions(regression);
  await seedQuarantine(ctx);

  await Preset.create({
    name: "Nova Auto-Heal",
    description: "Nova regression on CI and staging, for trying the heal filters across lanes",
    lanes: [
      { product: NOVA, type: "regression", stage: "CI", platform: "linux", platform_version: "22.04" },
      { product: NOVA, type: "regression", stage: "staging", platform: "linux", platform_version: "22.04" },
    ],
  });
  console.log("  ✓ preset Nova Auto-Heal");
}

async function seedLegacy(ctx) {
  console.log(`\n  Seeding ${LEGACY} (dormant lanes)...`);
  const rowsFor = (runs) => LEGACY_UIDS.map((uid, i) => ({ uid, runs: i === 0 ? runs.replace(/P$/, "F") : runs }));
  const lanes = [
    // One recent lane and two old ones in the same type: the type shows both "active" and "dormant"
    { type: "regression", lane: { browser: "Chrome", stage: "CI" }, runs: "PPP", newestAt: Date.now() - 10 * DAY, buildStart: 600 },
    { type: "regression", lane: { browser: "IE11", stage: "CI" }, runs: "PPP", newestAt: Date.now() - 300 * DAY, buildStart: 610 },
    { type: "regression", lane: { browser: "Safari 12", stage: "CI" }, runs: "PPF", newestAt: Date.now() - 230 * DAY, buildStart: 620 },
    // A type that only has a dormant lane: it appears after "Load dormant lanes"
    { type: "smoke", lane: { browser: "Chrome", stage: "CI" }, runs: "PPP", newestAt: Date.now() - 400 * DAY, buildStart: 630 },
  ];
  const types = new Set();
  for (const { type, lane, runs, newestAt, buildStart } of lanes) {
    if (!types.has(type)) {
      await TestRelation.insertMany(relationsFor(LEGACY, type, LEGACY_UIDS));
      types.add(type);
    }
    await seedLane(ctx, { product: LEGACY, type, lane, rows: rowsFor(runs), newestAt, buildStart, spacing: 3 * DAY });
    console.log(`    ✓ ${LEGACY}/${type} ${Object.values(lane).join(" ")}: last run ${Math.round((Date.now() - newestAt) / DAY)} days ago`);
  }
}

/**
 * ctx: { generateTestData, uid2name, QUARANTINE_RULES } from seedDemo.js.
 */
async function seedHealDemo(ctx) {
  await clearHealDemo();
  await seedNova(ctx);
  await seedLegacy(ctx);
}

module.exports = { seedHealDemo, clearHealDemo, NOVA, LEGACY, NOVA_UIDS: REGRESSION_TESTS.map((r) => r.uid), LEGACY_UIDS };
