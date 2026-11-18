/**
 * Demo data for the Insights page (/insights) and the INSIGHTS dashboard widget.
 *
 * seedDemo.js seeds quarantine, triage and heal signals, but nothing that lets every Insights area show
 * something worth looking at: no assignments, no auto-triaged or ticketed triage, no re-quarantined tests,
 * no test that sits in several areas at once (Overlap), no heal history older than a build, no reruns.
 * This module adds those, on top of what seedDemo.js has already written, so call it last.
 *
 *   Acme  (backend / frontend / e2e)  quarantine, triage, assignment, overlap, dashboard
 *   Nova  (regression)                heal signal history over 80 days, rerun signals
 *
 * It only ever touches Acme and Nova, and only the rows it adds itself: the assignments, the history rows
 * and the backdated signals are created here, the triage and quarantine changes are made to rows seedDemo.js
 * wrote in the same run (which is why it has to run after them). Re-running seedDemo.js clears them again.
 */
const mongoose = require("mongoose");

const Build = require("../src/models/build");
const Test = require("../src/models/test");
const Assignment = require("../src/models/assignment");
const InvestigatedTest = require("../src/models/investigated_test");
const QuarantinedTest = require("../src/models/quarantined_test");
const QuarantineHistory = require("../src/models/quarantine_history");
const HealSignal = require("../src/models/heal_signal");
const RerunSignal = require("../src/models/rerun_signal");
const Dashboard = require("../src/models/dashboard");

const ACME = "Acme";
const NOVA = "Nova";
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const ADMIN = { _id: mongoose.Types.ObjectId("608f72cfbde204263332366a"), name: "admin" };
const DEMO = { _id: mongoose.Types.ObjectId("608f72cfbde204263332366b"), name: "demo" };
const OPERATOR = { _id: mongoose.Types.ObjectId("608f72cfbde204263332366c"), name: "operator" };
const PEOPLE = [ADMIN, DEMO, OPERATOR];
const DASHBOARD_NAME = "Acme – Insights";

const ago = (ms) => new Date(Date.now() - ms);
const pickFrom = (list, i) => list[i % list.length];

/** The failure an assignment or triage keeps: same shape the app stores, so token/error matching works. */
function failureOf(test, uid) {
  if (test && test.failure) {
    return { error_message: test.failure.error_message, stack_trace: test.failure.stack_trace };
  }
  return { error_message: `Assertion failed in ${uid}`, stack_trace: `Error: Assertion failed in ${uid}\n    at run (${uid}.js:12:5)` };
}

/** Latest failing test per type, by uid, so assignments and triages carry a real failure. */
async function latestFailures(product) {
  const byType = {};
  for (const type of ["backend", "frontend", "e2e"]) {
    const build = await Build.findOne({ product, type }).sort({ build: -1 }).lean();
    if (!build) continue;
    const tests = await Test.find({ build: build._id, status: "FAIL" }).lean();
    byType[type] = new Map(tests.map((t) => [t.uid, t]));
  }
  return byType;
}

// ─── Triage: auto-triaged, ticketed, expired and old rows ─────────────────────

/**
 * seedDemo.js writes manual triages only, 0 to 25 days old. This turns a share of them into the other kinds
 * (auto with a match type, with a ticket, expired, about to expire), and ages some so 30 and 90 day periods
 * have something the 7 day one does not.
 */
async function seedTriageVariety() {
  const docs = await InvestigatedTest.find({ product: ACME }).sort({ _id: 1 }).lean();
  const matchTypes = ["token", "exact", "stack"];
  const ops = [];

  docs.forEach((d, i) => {
    const set = {};
    const slot = i % 10;

    // Spread creation dates across 80 days, but keep the three per type that seedDemo.js made today
    if (i % 5 !== 0 && Date.now() - new Date(d.create_at).getTime() > 2 * DAY) {
      set.create_at = ago((3 + (i * 7) % 77) * DAY);
    }
    const createdAt = set.create_at || d.create_at;

    // Tickets on about a third of them
    if (slot % 3 === 0) {
      set.tracking = { track_number: `ACME-${1000 + i}`, track_url: `https://jira.acme.example.com/browse/ACME-${1000 + i}` };
    }

    // Auto-triaged with a time to live: some still running, some already past it
    if (slot === 1 || slot === 4 || slot === 7 || slot === 8) {
      set.is_auto_triaged = true;
      set.auto_triage_source_uid = d.uid;
      set.auto_triage_match_type = pickFrom(matchTypes, i);
      const ageDays = Math.max(1, Math.round((Date.now() - new Date(createdAt).getTime()) / DAY));
      // 8 and 7 are expired (ttl shorter than their age), 1 and 4 still have days left
      set.configuration = { ttl: slot >= 7 ? Math.max(1, ageDays - 2) : ageDays + 3 + (i % 4), compare_by: "error_message" };
    }

    if (Object.keys(set).length) ops.push({ updateOne: { filter: { _id: d._id }, update: { $set: set } } });
  });

  if (ops.length) await InvestigatedTest.bulkWrite(ops);
  const auto = await InvestigatedTest.countDocuments({ product: ACME, is_auto_triaged: true });
  const ticketed = await InvestigatedTest.countDocuments({ product: ACME, "tracking.track_number": { $exists: true } });
  console.log(`\n  ✓ Insights: ${ops.length} triage rows varied (${auto} auto-triaged, ${ticketed} with a ticket, dates spread over 80 days)`);
}

// ─── Quarantine: tests that came back ─────────────────────────────────────────

/**
 * Rule effectiveness counts a stay as "returned" when the same test has a later stay. So some active
 * quarantines become cycle 2 or 3 with the earlier stays in history, and a few tests only have history
 * (released and never came back). Stays end by rule, by hand and by exemption.
 */
async function seedQuarantineHistory() {
  const active = await QuarantinedTest.find({ product: ACME, is_active: true }).sort({ _id: 1 }).lean();
  const released = await QuarantinedTest.find({ product: ACME, is_active: false }).sort({ _id: 1 }).lean();
  const resolvedBy = ["auto", "manual", "auto", "exempt"];
  const history = [];
  const ops = [];

  const stay = (q, cycle, startedDaysAgo, lastedDays, by) => ({
    uid: q.uid, product: q.product, type: q.type, scope: q.scope,
    rule_id: q.rule_id, rule_name: q.rule_name, triggered_mode: "auto",
    fail_snapshot: q.fail_snapshot, build_snapshot: q.build_snapshot,
    quarantined_at: ago(startedDaysAgo * DAY),
    resolved_at: ago((startedDaysAgo - lastedDays) * DAY),
    resolved_by: by, cycle,
  });

  // A third of the active ones are back for the second time, every sixth for the third
  active.forEach((q, i) => {
    if (i % 3 !== 0) return;
    const cycle = i % 6 === 0 ? 3 : 2;
    ops.push({ updateOne: { filter: { _id: q._id }, update: { $set: { cycle } } } });
    if (cycle === 3) history.push(stay(q, 1, 85 - (i % 10), 9, "auto"));
    history.push(stay(q, cycle - 1, 50 - (i % 12), 7 + (i % 6), pickFrom(resolvedBy, i)));
  });

  // Released ones: stay ended, nothing later
  released.forEach((q, i) => {
    history.push(stay(q, q.cycle || 1, 40 - (i % 20), 5 + (i % 9), pickFrom(resolvedBy, i + 1)));
  });

  if (ops.length) await QuarantinedTest.bulkWrite(ops);
  await QuarantineHistory.deleteMany({ product: ACME });
  if (history.length) await QuarantineHistory.insertMany(history);
  console.log(`  ✓ Insights: ${history.length} quarantine stays in history, ${ops.length} active tests on a repeat stay`);
}

// ─── Assignment: every state, old and new ─────────────────────────────────────

/**
 * OPEN (some over a week, a couple very old), RESOLVED (resolved in bulk from a triage) and CLOSE
 * (unassigned). A lane with only closed assignments is included on purpose: it must still show.
 */
async function seedAssignments(failures) {
  await Assignment.deleteMany({ product: ACME });
  const rows = [];
  let n = 0;

  const add = (type, uid, state, ageDays, who) => {
    const test = failures[type] && failures[type].get(uid);
    const person = who || pickFrom(PEOPLE, n);
    const by = pickFrom(PEOPLE, n + 1);
    rows.push({
      product: ACME, type, uid, state,
      user: person._id, username: person.name,
      failure: failureOf(test, uid),
      assign_at: ago(ageDays * DAY + (n % 5) * HOUR),
      assigned_by_user: by._id, assigned_by_username: by.name,
      comments: [{ userId: by._id, user: by.name, time: ago(ageDays * DAY), message: "Please take a look.", isDeleted: false }],
    });
    n++;
  };

  for (const type of ["backend", "frontend", "e2e"]) {
    const uids = Array.from((failures[type] || new Map()).keys());
    // The first few uids are left for overlap, which assigns them on purpose
    const pool = uids.slice(0, 18);
    pool.forEach((uid, i) => {
      if (i < 6) add(type, uid, "OPEN", [0, 1, 2, 5, 9, 14][i]);              // recent and over a week
      else if (i < 8) add(type, uid, "OPEN", 30 + i * 4);                      // the long-forgotten ones
      else if (i < 12) add(type, uid, "RESOLVED", 3 + i * 2);
      else add(type, uid, "CLOSE", 6 + i * 3);
    });
  }

  // A lane that only has closed assignments, and one person with a pile of them
  add("e2e", "e2e/legacy/closed-only-1", "CLOSE", 21, OPERATOR);
  add("e2e", "e2e/legacy/closed-only-2", "RESOLVED", 12, OPERATOR);

  await Assignment.insertMany(rows);
  const open = rows.filter((r) => r.state === "OPEN").length;
  console.log(`  ✓ Insights: ${rows.length} assignments (${open} open, ${rows.filter((r) => r.state === "RESOLVED").length} resolved, ${rows.filter((r) => r.state === "CLOSE").length} unassigned)`);
}

// ─── Overlap: tests in several areas at once ──────────────────────────────────

/**
 * Overlap looks at active quarantines, OPEN assignments and triages, by product + type + uid. Takes the
 * first quarantined tests of each type and gives them an open assignment and/or a triage, so the list
 * has rows with two areas (amber) and three areas (red).
 */
async function seedOverlap(failures) {
  const quarantined = await QuarantinedTest.find({ product: ACME, is_active: true }).sort({ quarantined_at: 1 }).lean();
  const byType = {};
  quarantined.forEach((q) => (byType[q.type] = byType[q.type] || []).push(q));

  let made = 0;
  let triple = 0;
  for (const [type, list] of Object.entries(byType)) {
    for (let i = 0; i < Math.min(list.length, 5); i++) {
      const q = list[i];
      const test = failures[type] && failures[type].get(q.uid);
      const person = pickFrom(PEOPLE, made);
      const withAssignment = i !== 3;                  // quarantine + triage
      const withTriage = i !== 2;                      // quarantine + assignment

      if (withAssignment) {
        await Assignment.updateOne(
          { product: ACME, type, uid: q.uid, state: "OPEN" },
          { $setOnInsert: {
            product: ACME, type, uid: q.uid, state: "OPEN",
            user: person._id, username: person.name, failure: failureOf(test, q.uid),
            assign_at: ago((20 + i * 9) * DAY), assigned_by_user: ADMIN._id, assigned_by_username: ADMIN.name, comments: [],
          } },
          { upsert: true },
        );
      }
      if (withTriage) {
        const exists = await InvestigatedTest.findOne({ product: ACME, type, uid: q.uid }).lean();
        if (!exists) {
          await InvestigatedTest.create({
            uid: q.uid, product: ACME, type, user: ADMIN._id,
            caused_by: pickFrom(["Defect", "Automation", "Feature Change", "System", "Performance"], made),
            create_at: ago((12 + i * 6) * DAY), failure: failureOf(test, q.uid), comments: [],
          });
        }
      }
      if (withAssignment && withTriage) triple++;
      made++;
    }
  }
  console.log(`  ✓ Insights: ${made} quarantined tests also assigned and/or triaged (${triple} in all three areas)`);
}

// ─── Heal signals over time, and reruns ───────────────────────────────────────

/**
 * seedHealDemo.js writes one signal per failure, all from the last few builds. A trend, a period
 * comparison, a success rate and the time columns need history. Copies those signals with older dates and
 * settled statuses, spread over 80 days.
 */
async function seedHealHistory() {
  const base = await HealSignal.find({ product: NOVA, dispatch_mode: "agent", status: "pr_created" }).lean();
  if (!base.length) {
    console.log("  - Insights: no Nova heal signal to copy, heal history skipped");
    return;
  }
  const statuses = ["pr_created", "pr_created", "completed", "completed", "bug_confirmed", "test_failed", "error", "timed_out", "pr_created", "completed"];
  const docs = [];
  for (let day = 1; day <= 80; day++) {
    const perDay = 1 + (day % 3 === 0 ? 1 : 0) + (day % 11 === 0 ? 2 : 0);
    for (let k = 0; k < perDay; k++) {
      const src = pickFrom(base, day + k);
      const status = pickFrom(statuses, day * 3 + k);
      const triggered = ago(day * DAY + k * 3 * HOUR);
      const minutes = 9 + ((day * 7 + k * 5) % 40);
      const copy = { ...src, status, triggered_at: triggered, triggered_by: day % 4 === 0 ? "user:admin" : "auto" };
      delete copy._id;
      delete copy.__v;
      copy.running_since = new Date(triggered.getTime() + 2 * 60 * 1000);
      copy.completed_at = new Date(triggered.getTime() + minutes * 60 * 1000);
      copy.ttl_expires_at = new Date(triggered.getTime() + 90 * DAY);
      if (status !== "pr_created") { delete copy.pr_url; delete copy.branch; delete copy.external_ref; }
      docs.push(copy);
    }
  }
  await HealSignal.insertMany(docs);
  console.log(`  ✓ Insights: ${docs.length} heal signals over 80 days in ${NOVA}`);
}

/** Reruns by the admin: some tests rerun again and again so "Most rerun tests" has a top. */
async function seedReruns() {
  const build = await Build.findOne({ product: NOVA, type: "regression" }).sort({ build: -1 }).lean();
  if (!build) return;
  const tests = await Test.find({ build: build._id }).limit(8).lean();
  if (!tests.length) return;

  await RerunSignal.deleteMany({ product: NOVA, owner_user_id: ADMIN._id });
  const statuses = ["passed", "passed", "failed", "passed", "failed", "error", "passed", "timed_out"];
  const docs = [];
  for (let day = 1; day <= 45; day++) {
    const count = day % 4 === 0 ? 3 : day % 2 === 0 ? 2 : 1;
    for (let k = 0; k < count; k++) {
      // The first two tests take most of the reruns
      const t = tests[(day + k) % 3 === 0 ? (day + k) % tests.length : k % 2];
      const triggered = ago(day * DAY + k * 2 * HOUR);
      const status = pickFrom(statuses, day + k * 2);
      const seconds = 40 + ((day * 13 + k * 17) % 200);
      docs.push({
        owner_user_id: ADMIN._id, product: NOVA, type: "regression",
        test_id: t._id, test_uid: t.uid, test_name: t.name, test_file: t.info && t.info.file,
        triggered_by: "user:admin", triggered_at: triggered, status,
        agent_id: "a1b2c3d4e5f60718", command: `npx playwright test --grep "${t.name}"`,
        output: status === "passed" ? "1 passed" : "1 failed",
        exit_code: status === "passed" ? 0 : 1,
        running_since: new Date(triggered.getTime() + 30 * 1000),
        completed_at: new Date(triggered.getTime() + (30 + seconds) * 1000),
        ttl_expires_at: new Date(triggered.getTime() + 90 * DAY),
      });
    }
  }
  await RerunSignal.insertMany(docs);
  console.log(`  ✓ Insights: ${docs.length} reruns over 45 days in ${NOVA}`);
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

async function seedInsightsDashboard() {
  await Dashboard.deleteMany({ user: ADMIN._id, name: DASHBOARD_NAME });
  const widget = (name, x, y, cols, rows, chartConfig) => ({ name, type: "INSIGHTS", x, y, cols, rows, minItemCols: 3, minItemRows: 2, chartConfig });
  await Dashboard.create({
    name: DASHBOARD_NAME,
    description: "Headline numbers and trend for quarantine, triage, assignment and overlap",
    user: ADMIN._id,
    is_public: false,
    widgets: [
      widget("Quarantine, last 30 days", 0, 0, 6, 6, { insightSource: "quarantine", insightPeriod: "30", insightProduct: ACME }),
      widget("Triage, last 2 weeks", 6, 0, 6, 6, { insightSource: "triage", insightPeriod: "14", insightProduct: ACME }),
      widget("Assignments, last 90 days", 0, 6, 6, 6, { insightSource: "assignment", insightPeriod: "90", insightProduct: ACME }),
      widget("Crowded tests", 6, 6, 6, 6, { insightSource: "overlap", insightProduct: ACME }),
    ],
  });
  console.log(`  ✓ Insights: dashboard "${DASHBOARD_NAME}"`);
}

/** Needs seedInvestigatedTests, seedQuarantinedTests and seedHealDemo to have run first. */
async function seedInsightsDemo() {
  console.log(`\n  Seeding Insights (${ACME}, ${NOVA})...`);
  const failures = await latestFailures(ACME);
  await seedTriageVariety();
  await seedQuarantineHistory();
  await seedAssignments(failures);
  await seedOverlap(failures);
  await seedHealHistory();
  await seedReruns();
  await seedInsightsDashboard();
}

module.exports = { seedInsightsDemo };
