"use strict";

require("coffee-script/register");

const env = process.env.NODE_ENV || "dev";
process.env.NODE_ENV = env;

const mongoose = require("mongoose");
const config = require("config");

const Build = require("../src/models/build");
const Test = require("../src/models/test");
const TestRelation = require("../src/models/test_relation");
const Dashboard = require("../src/models/dashboard");
const Setting = require("../src/models/setting");
const InvestigatedTest = require("../src/models/investigated_test");
const QuarantinedTest = require("../src/models/quarantined_test");

// ─── Config ──────────────────────────────────────────────────────────────────

const PRODUCT = "Acme";
const NUM_BUILDS = 30; // per product type
const DAYS_SPAN = 90; // how far back the oldest build goes
const ADMIN_USER_ID = mongoose.Types.ObjectId("608f72cfbde204263332366a");

// ─── Deterministic PRNG (reproducible seed data) ─────────────────────────────

function makePRNG(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

const rand = makePRNG(20240101);
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const randFloat = (min, max) => min + rand() * (max - min);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const uid2name = (uid) =>
  uid
    .split("/")
    .pop()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Test UIDs ───────────────────────────────────────────────────────────────

const BACKEND_UIDS = [
  "auth/login-valid-credentials",
  "auth/login-invalid-password",
  "auth/login-locked-account",
  "auth/logout",
  "auth/refresh-token",
  "auth/forgot-password",
  "auth/reset-password",
  "users/create",
  "users/get-by-id",
  "users/update-profile",
  "users/delete",
  "users/list",
  "users/search",
  "users/update-password",
  "users/get-permissions",
  "orders/create",
  "orders/get-by-id",
  "orders/update-status",
  "orders/cancel",
  "orders/list-by-user",
  "orders/apply-coupon",
  "orders/calculate-total",
  "orders/validate-items",
  "orders/get-tracking",
  "payments/process-credit-card",
  "payments/process-paypal",
  "payments/refund",
  "payments/status-check",
  "payments/recurring-billing",
  "payments/payment-history",
  "products/get-details",
  "products/list",
  "products/search",
  "products/filter-by-category",
  "products/create",
  "products/update",
  "products/delete",
  "products/check-availability",
  "products/update-price",
  "cart/add-item",
  "cart/remove-item",
  "cart/update-quantity",
  "cart/get",
  "cart/clear",
  "cart/apply-discount",
  "cart/checkout",
  "reviews/create",
  "reviews/get-by-product",
  "reviews/update",
  "reviews/delete",
  "reviews/moderate",
  "inventory/check-stock",
  "inventory/reserve",
  "inventory/release",
  "inventory/update",
  "notifications/send-email",
  "notifications/send-sms",
  "notifications/get-preferences",
  "notifications/update-preferences",
  "search/full-text",
  "search/filtered",
  "search/suggestions",
  "search/recent",
  "analytics/page-views",
  "analytics/conversion-rate",
  "analytics/user-sessions",
  "analytics/revenue",
  "analytics/top-products",
  "admin/dashboard-stats",
  "admin/user-management",
  "admin/order-management",
  "admin/product-management",
  "admin/reports",
];

const FRONTEND_UIDS = [
  "components/Button/renders-primary",
  "components/Button/renders-disabled",
  "components/Button/handles-click",
  "components/Input/renders-with-placeholder",
  "components/Input/validates-required",
  "components/Input/validates-email",
  "components/Modal/opens-on-trigger",
  "components/Modal/closes-on-escape",
  "components/Modal/closes-on-backdrop-click",
  "components/Table/renders-data",
  "components/Table/sorts-columns",
  "components/Table/paginates",
  "components/Form/submits-correctly",
  "components/Form/shows-validation-errors",
  "pages/Login/renders-form",
  "pages/Login/validates-email",
  "pages/Login/validates-password",
  "pages/Login/submits-login",
  "pages/Login/shows-error-on-failure",
  "pages/Register/renders-form",
  "pages/Register/validates-fields",
  "pages/Register/submits-registration",
  "pages/Register/shows-success",
  "pages/Dashboard/renders-widgets",
  "pages/Dashboard/loads-data",
  "pages/Products/renders-list",
  "pages/Products/filters-by-category",
  "pages/Products/searches-products",
  "pages/Products/shows-product-detail",
  "pages/Cart/adds-to-cart",
  "pages/Cart/updates-quantity",
  "pages/Cart/removes-item",
  "pages/Cart/shows-total",
  "pages/Checkout/renders-form",
  "pages/Checkout/validates-address",
  "pages/Checkout/selects-payment",
  "pages/Checkout/places-order",
  "pages/Orders/renders-list",
  "pages/Orders/shows-order-detail",
  "pages/Orders/tracks-order",
  "pages/Profile/renders-info",
  "pages/Profile/updates-profile",
  "pages/Profile/changes-password",
  "pages/Admin/renders-dashboard",
  "pages/Admin/manages-users",
  "pages/Admin/manages-products",
  "pages/Admin/views-reports",
  "navigation/header-renders",
  "navigation/footer-renders",
  "navigation/mobile-menu-opens",
  "navigation/breadcrumbs-show",
  "navigation/404-page-renders",
  "theme/dark-mode-toggle",
  "theme/responsive-mobile",
  "theme/responsive-tablet",
  "accessibility/login-keyboard-nav",
  "accessibility/form-aria-labels",
  "accessibility/modal-focus-trap",
  "accessibility/color-contrast",
  "performance/initial-load-time",
];

const E2E_UIDS = [
  "flows/user-registration-complete",
  "flows/login-and-browse",
  "flows/add-to-cart-and-checkout",
  "flows/payment-with-credit-card",
  "flows/payment-with-paypal",
  "flows/order-tracking",
  "flows/cancel-order",
  "flows/write-product-review",
  "flows/search-and-filter-products",
  "flows/apply-coupon-code",
  "flows/guest-checkout",
  "flows/registered-checkout",
  "flows/admin-login",
  "flows/admin-add-product",
  "flows/admin-manage-orders",
  "flows/admin-manage-users",
  "flows/forgot-password-flow",
  "flows/email-verification",
  "flows/social-login-google",
  "flows/profile-update",
  "smoke/homepage-loads",
  "smoke/login-works",
  "smoke/products-load",
  "smoke/cart-works",
  "smoke/checkout-initiates",
  "regression/login-after-session-expire",
  "regression/cart-persists-across-sessions",
  "regression/order-status-updates",
  "regression/payment-retry",
  "regression/concurrent-users",
  "integration/payment-gateway",
  "integration/email-service",
  "integration/inventory-sync",
  "integration/analytics-tracking",
  "integration/search-indexing",
  "cross-browser/chrome-checkout",
  "cross-browser/firefox-checkout",
  "cross-browser/safari-checkout",
  "cross-browser/mobile-checkout",
  "cross-browser/edge-checkout",
];

// ─── Relation mappings ────────────────────────────────────────────────────────

const BACKEND_META = {
  "auth/": {
    component: "auth-service",
    team: "platform-team",
    tag: "security",
  },
  "users/": { component: "user-service", team: "platform-team", tag: "core" },
  "orders/": {
    component: "order-service",
    team: "commerce-team",
    tag: "transactional",
  },
  "payments/": {
    component: "payment-service",
    team: "commerce-team",
    tag: "critical",
  },
  "products/": {
    component: "product-service",
    team: "commerce-team",
    tag: "catalog",
  },
  "cart/": {
    component: "cart-service",
    team: "commerce-team",
    tag: "transactional",
  },
  "reviews/": {
    component: "review-service",
    team: "commerce-team",
    tag: "social",
  },
  "inventory/": {
    component: "inventory-service",
    team: "infra-team",
    tag: "critical",
  },
  "notifications/": {
    component: "notification-service",
    team: "infra-team",
    tag: "async",
  },
  "search/": {
    component: "search-service",
    team: "infra-team",
    tag: "performance",
  },
  "analytics/": {
    component: "analytics-service",
    team: "platform-team",
    tag: "reporting",
  },
  "admin/": { component: "admin-service", team: "platform-team", tag: "admin" },
};

const FRONTEND_META = {
  "components/Button": {
    component: "ui-components",
    team: "frontend-team",
    tag: "unit",
  },
  "components/Input": {
    component: "ui-components",
    team: "frontend-team",
    tag: "unit",
  },
  "components/Modal": {
    component: "ui-components",
    team: "frontend-team",
    tag: "unit",
  },
  "components/Table": {
    component: "ui-components",
    team: "frontend-team",
    tag: "unit",
  },
  "components/Form": {
    component: "ui-components",
    team: "frontend-team",
    tag: "unit",
  },
  "pages/Login": {
    component: "auth-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Register": {
    component: "auth-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Dashboard": {
    component: "dashboard-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Products": {
    component: "product-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Cart": {
    component: "cart-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Checkout": {
    component: "checkout-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Orders": {
    component: "order-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Profile": {
    component: "profile-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "pages/Admin": {
    component: "admin-pages",
    team: "frontend-team",
    tag: "integration",
  },
  "navigation/": {
    component: "navigation",
    team: "design-team",
    tag: "layout",
  },
  "theme/": { component: "theming", team: "design-team", tag: "visual" },
  "accessibility/": {
    component: "accessibility",
    team: "design-team",
    tag: "a11y",
  },
  "performance/": {
    component: "performance",
    team: "frontend-team",
    tag: "perf",
  },
};

const E2E_META = {
  "flows/": { component: "user-flows", team: "qa-team", tag: "e2e" },
  "smoke/": { component: "smoke-tests", team: "qa-team", tag: "smoke" },
  "regression/": {
    component: "regression",
    team: "automation-team",
    tag: "regression",
  },
  "integration/": {
    component: "integration",
    team: "automation-team",
    tag: "integration",
  },
  "cross-browser/": {
    component: "cross-browser",
    team: "qa-team",
    tag: "compatibility",
  },
};

function getMeta(uid, metaMap) {
  const keys = Object.keys(metaMap).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (uid.startsWith(key)) return metaMap[key];
  }
  return { component: "other", team: "platform-team", tag: "misc" };
}

// ─── Custom relation metadata ─────────────────────────────────────────────────

const CUSTOM_META_E2E = {
  "flows/payment": { Feature: "Payments", Priority: "P0" },
  "flows/add-to-cart": { Feature: "Checkout", Priority: "P0" },
  "flows/registered-checkout": { Feature: "Checkout", Priority: "P0" },
  "smoke/": { Feature: "Smoke", Priority: "P0" },
  "flows/login": { Feature: "Auth", Priority: "P1" },
  "flows/user-registration": { Feature: "Auth", Priority: "P1" },
  "flows/guest-checkout": { Feature: "Checkout", Priority: "P1" },
  "flows/order": { Feature: "Orders", Priority: "P1" },
  "flows/cancel-order": { Feature: "Orders", Priority: "P1" },
  "flows/write-product": { Feature: "Catalog", Priority: "P1" },
  "flows/search": { Feature: "Catalog", Priority: "P1" },
  "flows/admin": { Feature: "Admin", Priority: "P1" },
  "flows/apply-coupon": { Feature: "Checkout", Priority: "P1" },
  "flows/forgot-password": { Feature: "Account", Priority: "P2" },
  "flows/email-verification": { Feature: "Account", Priority: "P2" },
  "flows/social-login": { Feature: "Account", Priority: "P2" },
  "flows/profile": { Feature: "Account", Priority: "P2" },
  "flows/": { Feature: "Auth", Priority: "P1" },
  "regression/": { Feature: "Regression", Priority: "P2" },
  "integration/": { Feature: "Integration", Priority: "P2" },
  "cross-browser/": { Feature: "Cross-browser", Priority: "P2" },
};

const CUSTOM_META_FRONTEND = {
  "pages/Checkout": { Feature: "Checkout", Priority: "P0" },
  "pages/Login": { Feature: "Auth", Priority: "P0" },
  "pages/Cart": { Feature: "Cart", Priority: "P1" },
  "pages/Register": { Feature: "Auth", Priority: "P1" },
  "pages/Orders": { Feature: "Orders", Priority: "P1" },
  "pages/Products": { Feature: "Catalog", Priority: "P1" },
  "pages/Dashboard": { Feature: "Dashboard", Priority: "P1" },
  "components/": { Feature: "UI Components", Priority: "P1" },
  "pages/Profile": { Feature: "Account", Priority: "P2" },
  "pages/Admin": { Feature: "Admin", Priority: "P2" },
  "navigation/": { Feature: "Navigation", Priority: "P2" },
  "theme/": { Feature: "Theme", Priority: "P3" },
  "accessibility/": { Feature: "Accessibility", Priority: "P3" },
  "performance/": { Feature: "Performance", Priority: "P3" },
};

const E2E_BROWSERS = ["Chrome", "Firefox", "Safari", "Edge"];
const E2E_DEVICES = ["Desktop", "Mobile", "Tablet"];
const FE_BROWSERS = ["Chrome", "Firefox"];
const FE_DEVICES = ["Desktop", "Mobile"];

function getCustomMeta(uid, type, idx) {
  if (type === "e2e") {
    const keys = Object.keys(CUSTOM_META_E2E).sort(
      (a, b) => b.length - a.length,
    );
    let base = { Feature: "Auth", Priority: "P2" };
    for (const key of keys) {
      if (uid.startsWith(key)) {
        base = CUSTOM_META_E2E[key];
        break;
      }
    }
    return {
      Browser: E2E_BROWSERS[idx % E2E_BROWSERS.length],
      Device: E2E_DEVICES[idx % E2E_DEVICES.length],
      Priority: base.Priority,
      Feature: base.Feature,
    };
  }
  if (type === "frontend") {
    const keys = Object.keys(CUSTOM_META_FRONTEND).sort(
      (a, b) => b.length - a.length,
    );
    let base = { Feature: "UI Components", Priority: "P2" };
    for (const key of keys) {
      if (uid.startsWith(key)) {
        base = CUSTOM_META_FRONTEND[key];
        break;
      }
    }
    return {
      Browser: FE_BROWSERS[idx % FE_BROWSERS.length],
      Device: FE_DEVICES[idx % FE_DEVICES.length],
      Priority: base.Priority,
      Feature: base.Feature,
    };
  }
  return null;
}

// ─── Stability profiles ───────────────────────────────────────────────────────

function buildStabilityMap(uids, seed) {
  const r = makePRNG(seed);
  const map = {};
  uids.forEach((uid) => {
    const roll = r();
    let stability;
    if (roll < 0.55)
      stability = { type: "stable", basePass: 0.96 + r() * 0.03 };
    else if (roll < 0.8)
      stability = { type: "moderate", basePass: 0.82 + r() * 0.12 };
    else if (roll < 0.93)
      stability = { type: "flaky", basePass: 0.5 + r() * 0.25 };
    else
      stability = {
        type: "broken",
        basePass: 0.05,
        fixedAtBuild: randInt(8, 18),
      };
    map[uid] = stability;
  });
  return map;
}

const STABILITY = {
  backend: buildStabilityMap(BACKEND_UIDS, 111),
  frontend: buildStabilityMap(FRONTEND_UIDS, 222),
  e2e: buildStabilityMap(E2E_UIDS, 333),
};

// ─── Quarantine rules ─────────────────────────────────────────────────────────

const QUARANTINE_RULES = {
  consecutiveFailures: {
    _id: "qr-consecutive-failures-001",
    name: "Consecutive Failures",
    enabled: true,
    threshold: { conditions: [{ mode: "consecutive", failures: 3 }], resolve_passes: 3 },
  },
  highFailRate: {
    _id: "qr-high-fail-rate-002",
    name: "High Fail Rate",
    enabled: true,
    threshold: { conditions: [{ mode: "total", failures: 4 }], resolve_passes: 5 },
  },
};

// ─── Failure messages ─────────────────────────────────────────────────────────

const BACKEND_ERRORS = [
  "Expected status 200 but received 401 – Unauthorized",
  "Connection timeout after 5000ms",
  'AssertionError: expected "pending" to equal "completed"',
  'TypeError: Cannot read property "id" of undefined',
  "Database constraint violation: duplicate key",
  'Request validation failed: missing required field "amount"',
  "Service unavailable: payment-gateway returned 503",
  "JWT signature verification failed",
];

const FRONTEND_ERRORS = [
  'Element not found: [data-testid="submit-btn"]',
  'Assertion failed: expected text "Welcome" but found "Loading..."',
  'TypeError: Cannot read properties of null (reading "click")',
  "Timeout: component did not render within 3000ms",
  "Visual regression: screenshot differs by 3.8%",
  "Unhandled promise rejection in component lifecycle",
];

const E2E_ERRORS = [
  "Timeout: page navigation exceeded 30s",
  "Element not interactable: payment form is hidden",
  "Network request failed: POST /api/orders returned 500",
  "Assertion failed: order confirmation email not received within 10s",
  "Browser console error: Uncaught ReferenceError: stripe is not defined",
  "Test flaked: race condition in cart state update",
];

function getErrors(type) {
  if (type === "backend") return BACKEND_ERRORS;
  if (type === "frontend") return FRONTEND_ERRORS;
  return E2E_ERRORS;
}

// ─── Build quality curve ──────────────────────────────────────────────────────

const REGRESSION_BUILDS = new Set([7, 17, 24]);

function buildQuality(buildIndex) {
  if (REGRESSION_BUILDS.has(buildIndex)) return 0.45 + rand() * 0.1;
  const progress = buildIndex / (NUM_BUILDS - 1);
  const base = 0.68 + progress * 0.27;
  const noise = (rand() - 0.5) * 0.06;
  return Math.min(0.99, Math.max(0.4, base + noise));
}

// ─── Test status generator ────────────────────────────────────────────────────

function testStatus(uid, stabilityMap, buildIndex, quality) {
  const s = stabilityMap[uid];
  if (!s) return "PASS";
  if (s.type === "broken" && buildIndex < s.fixedAtBuild) {
    return rand() < 0.05 ? "SKIP" : "FAIL";
  }
  const passProb = Math.min(0.99, s.basePass * quality);
  const roll = rand();
  if (roll < passProb) return "PASS";
  if (roll < passProb + 0.04) return "SKIP";
  return "FAIL";
}

// ─── Step generation ─────────────────────────────────────────────────────────

// Step templates keyed by UID prefix, per test type
const BACKEND_STEP_CONFIG = {
  "auth/": {
    suite: "auth-suite",
    setupSteps: [
      "Initialize HTTP client with staging API base URL",
      "Load user credential fixtures from test data store",
    ],
    method: "POST",
    endpointBase: "/api/v1/auth",
    successBody: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo",
      expiresIn: 3600,
      tokenType: "Bearer",
    },
    failBody: {
      error: "Unauthorized",
      message: "Invalid credentials or session expired",
      code: 401,
    },
    assertions: [
      "Assert HTTP response status is 200",
      "Validate JWT token format and signature",
      "Verify token expiration claim is within bounds",
    ],
    teardownStep: "Revoke test session tokens and clear auth state",
    file: "auth.spec.js",
    pathBase: "test/api/auth",
  },
  "users/": {
    suite: "users-suite",
    setupSteps: [
      "Initialize API client and set auth token",
      "Create seed user record in test database",
    ],
    method: "GET",
    endpointBase: "/api/v1/users",
    successBody: {
      id: "usr_demo123",
      email: "test@acme.io",
      role: "customer",
      createdAt: "2024-01-15T10:00:00Z",
    },
    failBody: {
      error: "Not Found",
      message: "User record does not exist",
      code: 404,
    },
    assertions: [
      "Assert response status is 200",
      "Validate user object schema matches contract",
      "Verify email field is properly formatted",
    ],
    teardownStep: "Delete test user record and release resources",
    file: "users.spec.js",
    pathBase: "test/api/users",
  },
  "orders/": {
    suite: "orders-suite",
    setupSteps: [
      "Initialize API client with commerce service endpoints",
      "Load order test fixtures and seed product catalog",
    ],
    method: "POST",
    endpointBase: "/api/v1/orders",
    successBody: {
      orderId: "ord_demo456",
      status: "confirmed",
      total: 149.99,
      currency: "USD",
      items: 3,
    },
    failBody: {
      error: "Unprocessable Entity",
      message: "Order validation failed: item quantity exceeds stock",
      code: 422,
    },
    assertions: [
      'Assert order created with status "confirmed"',
      "Verify order total matches expected calculation",
      "Confirm order ID is present in response",
    ],
    teardownStep: "Cancel test order and restore inventory state",
    file: "orders.spec.js",
    pathBase: "test/api/orders",
  },
  "payments/": {
    suite: "payments-suite",
    setupSteps: [
      "Initialize payment gateway client with sandbox credentials",
      "Load payment method fixtures (card, PayPal test accounts)",
    ],
    method: "POST",
    endpointBase: "/api/v1/payments",
    successBody: {
      transactionId: "txn_demo789",
      status: "succeeded",
      amount: 149.99,
      currency: "USD",
      gateway: "stripe",
    },
    failBody: {
      error: "Payment Failed",
      message: "Card declined: insufficient funds",
      code: 402,
      declineCode: "insufficient_funds",
    },
    assertions: [
      'Assert transaction status is "succeeded"',
      "Verify transaction ID is returned",
      "Validate amount matches order total",
    ],
    teardownStep: "Void test transaction and restore sandbox state",
    file: "payments.spec.js",
    pathBase: "test/api/payments",
  },
  "products/": {
    suite: "products-suite",
    setupSteps: [
      "Initialize catalog API client",
      "Seed product catalog with test data",
    ],
    method: "GET",
    endpointBase: "/api/v1/products",
    successBody: {
      id: "prod_demo001",
      name: "Demo Widget Pro",
      price: 49.99,
      stock: 250,
      category: "electronics",
    },
    failBody: {
      error: "Not Found",
      message: "Product not found in catalog",
      code: 404,
    },
    assertions: [
      "Assert product data is returned",
      "Verify price field is a positive number",
      "Confirm stock level is present",
    ],
    teardownStep: "Remove test product entries from catalog",
    file: "products.spec.js",
    pathBase: "test/api/products",
  },
  "cart/": {
    suite: "cart-suite",
    setupSteps: [
      "Initialize cart service client",
      "Create empty test cart session",
    ],
    method: "POST",
    endpointBase: "/api/v1/cart",
    successBody: {
      cartId: "cart_demo321",
      items: [{ productId: "prod_001", qty: 2, price: 49.99 }],
      total: 99.98,
    },
    failBody: {
      error: "Bad Request",
      message: "Cannot add item: product is out of stock",
      code: 400,
    },
    assertions: [
      "Assert cart updated with new item",
      "Verify cart total recalculated correctly",
      "Confirm item quantity matches input",
    ],
    teardownStep: "Clear test cart and release session",
    file: "cart.spec.js",
    pathBase: "test/api/cart",
  },
  "reviews/": {
    suite: "reviews-suite",
    setupSteps: [
      "Initialize reviews API client",
      "Seed test product with existing reviews",
    ],
    method: "POST",
    endpointBase: "/api/v1/reviews",
    successBody: {
      reviewId: "rev_demo654",
      rating: 4,
      status: "published",
      productId: "prod_001",
      author: "test-user",
    },
    failBody: {
      error: "Forbidden",
      message: "User has already reviewed this product",
      code: 403,
    },
    assertions: [
      "Assert review created and published",
      "Verify rating is within valid range (1-5)",
      "Confirm review is linked to correct product",
    ],
    teardownStep: "Delete test review and reset product rating",
    file: "reviews.spec.js",
    pathBase: "test/api/reviews",
  },
  "inventory/": {
    suite: "inventory-suite",
    setupSteps: [
      "Initialize inventory service client",
      "Set up test warehouse location with known stock levels",
    ],
    method: "GET",
    endpointBase: "/api/v1/inventory",
    successBody: {
      productId: "prod_001",
      available: 248,
      reserved: 2,
      warehouse: "US-WEST-1",
      updatedAt: "2024-01-15T08:00:00Z",
    },
    failBody: {
      error: "Service Unavailable",
      message: "Inventory service is temporarily unavailable",
      code: 503,
      retryAfter: 30,
    },
    assertions: [
      "Assert stock level is returned",
      "Verify available count is non-negative",
      "Confirm warehouse location is valid",
    ],
    teardownStep: "Release reserved stock and reset test warehouse state",
    file: "inventory.spec.js",
    pathBase: "test/api/inventory",
  },
  "notifications/": {
    suite: "notifications-suite",
    setupSteps: [
      "Initialize notification service with test SMTP/SMS sandbox",
      "Load recipient fixtures from test data",
    ],
    method: "POST",
    endpointBase: "/api/v1/notifications",
    successBody: {
      messageId: "msg_demo987",
      status: "queued",
      channel: "email",
      recipient: "test@acme.io",
      scheduledAt: null,
    },
    failBody: {
      error: "Bad Gateway",
      message: "SMTP relay rejected message: invalid recipient domain",
      code: 502,
    },
    assertions: [
      "Assert notification queued successfully",
      "Verify message ID is returned",
      "Confirm recipient address matches input",
    ],
    teardownStep: "Flush notification sandbox queue",
    file: "notifications.spec.js",
    pathBase: "test/api/notifications",
  },
  "search/": {
    suite: "search-suite",
    setupSteps: [
      "Initialize search service client",
      "Index test documents into search engine",
    ],
    method: "GET",
    endpointBase: "/api/v1/search",
    successBody: {
      hits: 12,
      took: 4,
      results: [{ id: "prod_001", score: 0.98, title: "Demo Widget" }],
      page: 1,
      pageSize: 20,
    },
    failBody: {
      error: "Bad Request",
      message: 'Query syntax error: unexpected operator near "&&"',
      code: 400,
    },
    assertions: [
      "Assert search returns results",
      "Verify hit count is non-negative",
      "Confirm results are sorted by relevance score",
    ],
    teardownStep: "Remove test documents from search index",
    file: "search.spec.js",
    pathBase: "test/api/search",
  },
  "analytics/": {
    suite: "analytics-suite",
    setupSteps: [
      "Initialize analytics service client",
      "Seed event stream with test telemetry data",
    ],
    method: "GET",
    endpointBase: "/api/v1/analytics",
    successBody: {
      metric: "page_views",
      value: 15432,
      period: "7d",
      change: "+12.3%",
      breakdown: { mobile: 8201, desktop: 7231 },
    },
    failBody: {
      error: "Internal Server Error",
      message: "Aggregation pipeline timed out after 30s",
      code: 500,
    },
    assertions: [
      "Assert metric value is returned",
      "Verify change percentage is calculated",
      "Confirm breakdown sums match total",
    ],
    teardownStep: "Purge test telemetry events from pipeline",
    file: "analytics.spec.js",
    pathBase: "test/api/analytics",
  },
  "admin/": {
    suite: "admin-suite",
    setupSteps: [
      "Initialize admin API client with superuser credentials",
      "Load admin test fixtures",
    ],
    method: "GET",
    endpointBase: "/api/v1/admin",
    successBody: {
      totalUsers: 1482,
      activeOrders: 37,
      revenue: 48291.5,
      systemHealth: "healthy",
    },
    failBody: {
      error: "Forbidden",
      message: "Insufficient permissions: admin role required",
      code: 403,
    },
    assertions: [
      "Assert admin data is returned",
      "Verify all required dashboard metrics are present",
      "Confirm system health status is valid",
    ],
    teardownStep: "Revoke test admin session",
    file: "admin.spec.js",
    pathBase: "test/api/admin",
  },
};

const FRONTEND_STEP_CONFIG = {
  "components/": {
    suite: "component-unit-suite",
    setupSteps: [
      "Mount component in isolated test environment (Testing Library)",
    ],
    actionVerb: "Render and interact with component",
    successOutput: { rendered: true, accessible: true, snapshotMatch: true },
    failOutput: {
      rendered: false,
      error: 'Component failed to mount: missing required prop "onClick"',
    },
    assertions: [
      "Verify component renders without errors",
      "Assert DOM structure matches snapshot",
      "Confirm ARIA attributes are correctly set",
    ],
    teardownStep: "Unmount component and clear DOM",
    file: (uid) => uid.split("/").slice(0, 2).join("/") + ".spec.tsx",
    pathBase: "src/components",
  },
  "pages/": {
    suite: "page-integration-suite",
    setupSteps: [
      "Mount page component with mocked router and providers",
      "Stub API calls with MSW request handlers",
    ],
    actionVerb: "Render page and trigger user interaction",
    successOutput: {
      pageTitle: "Expected Page",
      apiCallsMade: 2,
      renderTime: "142ms",
    },
    failOutput: {
      error: "Timeout: page did not finish rendering within 3000ms",
      renderTime: ">3000ms",
    },
    assertions: [
      "Assert page title is correct",
      "Verify API calls were made with correct parameters",
      "Confirm UI state reflects API response",
    ],
    teardownStep: "Unmount page, clear MSW handlers and router history",
    file: (uid) => uid.split("/").slice(0, 2).join("/") + ".spec.tsx",
    pathBase: "src/pages",
  },
  "navigation/": {
    suite: "navigation-suite",
    setupSteps: ["Mount app shell with navigation components"],
    actionVerb: "Trigger navigation event and assert routing",
    successOutput: {
      activeRoute: "/dashboard",
      breadcrumbs: ["Home", "Dashboard"],
      menuOpen: false,
    },
    failOutput: {
      error: 'Element not found: [data-testid="nav-menu"]',
      selector: '[data-testid="nav-menu"]',
    },
    assertions: [
      "Verify active route is highlighted in nav",
      "Assert breadcrumb trail is correct",
    ],
    teardownStep: "Reset router to initial state",
    file: () => "navigation.spec.tsx",
    pathBase: "src/navigation",
  },
  "theme/": {
    suite: "visual-suite",
    setupSteps: ["Initialize theme provider with default light theme"],
    actionVerb: "Toggle theme and capture visual output",
    successOutput: { theme: "dark", cssVarsApplied: true, contrastRatio: 7.1 },
    failOutput: {
      error:
        "Visual regression: screenshot pixel diff 3.8% exceeds threshold 2%",
      diff: "3.8%",
    },
    assertions: [
      "Assert theme CSS variables are applied",
      "Verify color contrast meets WCAG AA standard",
    ],
    teardownStep: "Reset theme provider to default",
    file: () => "theme.spec.tsx",
    pathBase: "src/theme",
  },
  "accessibility/": {
    suite: "a11y-suite",
    setupSteps: ["Mount component/page with axe-core accessibility engine"],
    actionVerb: "Run axe accessibility audit on rendered output",
    successOutput: {
      violations: 0,
      passes: 14,
      incomplete: 2,
      axeVersion: "4.8.0",
    },
    failOutput: {
      violations: 2,
      rules: ["color-contrast", "aria-required-attr"],
      impact: "serious",
    },
    assertions: [
      "Assert zero critical/serious accessibility violations",
      "Verify keyboard navigation works correctly",
    ],
    teardownStep: "Unmount and clear axe scan results",
    file: () => "accessibility.spec.tsx",
    pathBase: "src/accessibility",
  },
  "performance/": {
    suite: "performance-suite",
    setupSteps: [
      "Initialize Lighthouse CI runner with performance budget config",
    ],
    actionVerb: "Run Lighthouse performance audit against staging URL",
    successOutput: { lcp: "1.8s", fid: "12ms", cls: 0.03, score: 94 },
    failOutput: {
      lcp: "4.2s",
      fid: "180ms",
      cls: 0.14,
      score: 48,
      budgetExceeded: ["lcp", "fid"],
    },
    assertions: [
      "Assert LCP is under 2.5s budget",
      "Verify CLS score is below 0.1 threshold",
    ],
    teardownStep: "Archive Lighthouse report artifacts",
    file: () => "performance.spec.js",
    pathBase: "test/performance",
  },
};

const E2E_STEP_CONFIG = {
  "flows/": {
    suite: "e2e-flows-suite",
    setupSteps: [
      "Launch Chromium browser and create isolated browser context",
      "Navigate to staging environment and accept cookies",
    ],
    actionVerb: "Execute full user journey flow with Playwright",
    successOutput: {
      flowCompleted: true,
      finalUrl: "/order/confirmation",
      screenshotSaved: true,
    },
    failOutput: {
      error: 'Timeout: page.waitForSelector("#order-confirm") exceeded 30s',
      selector: "#order-confirm",
    },
    assertions: [
      "Assert flow completed and landed on success page",
      "Verify confirmation data is displayed correctly",
      "Confirm no console errors during flow",
    ],
    teardownStep: "Close browser context and delete test user session data",
    file: (uid) => uid.replace("flows/", "") + ".e2e.ts",
    pathBase: "e2e/flows",
  },
  "smoke/": {
    suite: "smoke-suite",
    setupSteps: ["Launch browser and navigate to production base URL"],
    actionVerb: "Execute smoke check — verify page loads and responds",
    successOutput: {
      statusCode: 200,
      loadTime: "1.2s",
      criticalElementsVisible: true,
    },
    failOutput: {
      error: "Navigation failed: net::ERR_CONNECTION_REFUSED",
      url: "https://staging.acme.io",
    },
    assertions: [
      "Assert page returns HTTP 200",
      "Verify critical UI elements are visible",
    ],
    teardownStep: "Close browser and log smoke test result",
    file: (uid) => uid.replace("smoke/", "") + ".smoke.ts",
    pathBase: "e2e/smoke",
  },
  "regression/": {
    suite: "regression-suite",
    setupSteps: [
      "Restore known-good state from regression snapshot",
      "Seed regression test user accounts and data",
    ],
    actionVerb: "Execute regression scenario and compare to baseline",
    successOutput: {
      regressionPassed: true,
      baseline: "v2.3.1",
      current: "v2.4.0",
      delta: "none",
    },
    failOutput: {
      error: "Regression detected: session not persisted across page reload",
      baseline: "v2.3.1",
    },
    assertions: [
      "Assert behavior matches baseline snapshot",
      "Verify no state regression in user session",
      "Confirm data integrity after operation",
    ],
    teardownStep: "Delete regression test data and restore clean state",
    file: (uid) => uid.replace("regression/", "") + ".regression.ts",
    pathBase: "e2e/regression",
  },
  "integration/": {
    suite: "integration-suite",
    setupSteps: [
      "Initialize integration test environment with all services running",
      "Establish connections to payment gateway and email sandbox",
    ],
    actionVerb: "Trigger cross-service integration and validate end-to-end",
    successOutput: {
      servicesInvoked: ["payment-gateway", "email-service"],
      allHealthy: true,
      latency: "340ms",
    },
    failOutput: {
      error: "Integration point failed: email-service returned 502 Bad Gateway",
      service: "email-service",
      code: 502,
    },
    assertions: [
      "Assert all integration points responded successfully",
      "Verify data propagated correctly across services",
      "Confirm async side-effects completed within timeout",
    ],
    teardownStep: "Disconnect from external services and flush test queues",
    file: (uid) => uid.replace("integration/", "") + ".integration.ts",
    pathBase: "e2e/integration",
  },
  "cross-browser/": {
    suite: "cross-browser-suite",
    setupSteps: [
      "Launch target browser (per test configuration) via Playwright",
      "Load cross-browser polyfill configuration",
    ],
    actionVerb: "Execute checkout flow in target browser and validate UI",
    successOutput: {
      browser: "chromium",
      flowPassed: true,
      uiConsistent: true,
      jsErrors: 0,
    },
    failOutput: {
      error: "CSS grid layout broken in Safari: flexbox fallback not applied",
      browser: "webkit",
    },
    assertions: [
      "Assert UI renders correctly in target browser",
      "Verify JavaScript APIs are available or polyfilled",
      "Confirm checkout flow completes without browser-specific errors",
    ],
    teardownStep: "Close browser process and capture final screenshot",
    file: (uid) => uid.replace("cross-browser/", "") + ".xbrowser.ts",
    pathBase: "e2e/cross-browser",
  },
};

function getStepConfig(uid, type) {
  const configMap =
    type === "backend"
      ? BACKEND_STEP_CONFIG
      : type === "frontend"
        ? FRONTEND_STEP_CONFIG
        : E2E_STEP_CONFIG;

  const keys = Object.keys(configMap).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (uid.startsWith(key)) return configMap[key];
  }
  // fallback
  return {
    suite: "general-suite",
    setupSteps: ["Initialize test environment"],
    method: "GET",
    endpointBase: "/api/v1",
    actionVerb: "Execute test action",
    successOutput: { result: "ok" },
    failOutput: { error: "Test failed" },
    assertions: ["Assert result is correct"],
    teardownStep: "Clean up test resources",
    file: () => uid.split("/").pop() + ".spec.js",
    pathBase: "test",
  };
}

function generateTestData(uid, type, status, durationMs, buildNum) {
  const cfg = getStepConfig(uid, type);
  const isFail = status === "FAIL";
  const testName = uid2name(uid);
  const now = new Date().toISOString();

  // ── info ──
  const filePath = typeof cfg.file === "function" ? cfg.file(uid) : cfg.file;
  const info = {
    description: `Verifies that ${testName.toLowerCase()} behaves correctly under expected conditions.`,
    path: cfg.pathBase,
    file: filePath,
    quickInfo: [
      { key: "Environment", value: "staging" },
      { key: "Suite", value: cfg.suite },
      { key: "Duration", value: `${(durationMs / 1000).toFixed(2)}s` },
      { key: "Build", value: `#${buildNum}` },
    ],
  };

  // ── setup steps ──
  const setupArr = cfg.setupSteps || ["Initialize test environment"];
  const setup = setupArr.map((detail) => ({ detail, status: "PASS" }));

  // ── teardown ──
  const teardown = [
    { detail: cfg.teardownStep || "Clean up test resources", status: "PASS" },
  ];

  // ── body ──
  // Determine main action description
  let actionDetail;
  if (type === "backend") {
    actionDetail = `${cfg.method} ${cfg.endpointBase}/${uid.split("/").pop()} — ${testName}`;
  } else {
    actionDetail = `${cfg.actionVerb || "Execute"} — ${testName}`;
  }

  // Attachment: request+response JSON for backend; output JSON for others
  let attachmentContent;
  if (type === "backend") {
    const reqBody =
      cfg.method !== "GET"
        ? { testField: "demo-value", timestamp: now }
        : undefined;
    const request = {
      method: cfg.method,
      url: `https://staging-api.acme.io${cfg.endpointBase}/${uid.split("/").pop()}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer demo-token-abc123",
        "X-Request-ID": `req_${buildNum}_test`,
      },
      ...(reqBody ? { body: reqBody } : {}),
    };
    const response = {
      status: isFail
        ? cfg.failBody && cfg.failBody.code
          ? cfg.failBody.code
          : 500
        : 200,
      headers: {
        "Content-Type": "application/json",
        "X-Response-Time": `${durationMs}ms`,
      },
      body: isFail ? cfg.failBody : cfg.successBody,
    };
    attachmentContent = JSON.stringify({ request, response }, null, 2);
  } else {
    attachmentContent = JSON.stringify(
      {
        input: { uid, buildNum, environment: "staging" },
        output: isFail ? cfg.failOutput : cfg.successOutput,
      },
      null,
      2,
    );
  }

  const attachment = {
    content: attachmentContent,
    "content-type": "json,xml,curl,text",
  };

  // Nested assertion sub-steps on the main body step
  const assertionSteps = (cfg.assertions || ["Assert result is correct"]).map(
    (detail, idx) => ({
      detail,
      status: isFail && idx === 0 ? "FAIL" : "PASS",
    }),
  );

  const mainBodyStep = {
    detail: actionDetail,
    status: isFail ? "FAIL" : "PASS",
    attachment,
    steps: assertionSteps,
  };

  // Optional extra body steps (PASS) before/after main
  const body = [
    {
      detail: `Prepare ${type === "e2e" ? "browser" : type === "frontend" ? "component" : "API"} request parameters`,
      status: "PASS",
    },
    mainBodyStep,
  ];
  if (!isFail) {
    body.push({
      detail: "Validate response against JSON schema contract",
      status: "PASS",
    });
  }

  return { info, setup, body, teardown };
}

// ─── Main seed ────────────────────────────────────────────────────────────────

async function seedProductLine(product, type, uids, stabilityKey, metaMap) {
  console.log(
    `\n  Seeding ${product}/${type} (${uids.length} tests × ${NUM_BUILDS} builds)...`,
  );

  const now = Date.now();
  const msPerBuild = (DAYS_SPAN * 24 * 60 * 60 * 1000) / (NUM_BUILDS - 1);
  const stabilityMap = STABILITY[stabilityKey];
  const errors = getErrors(type);
  const startBuildNum = 100;

  // ── Test Relations (once per uid) ──
  const relations = uids.map((uid, idx) => {
    const meta = getMeta(uid, metaMap);
    const rel = {
      uid,
      product,
      type,
      components: [meta.component],
      teams: [meta.team],
      tags: [meta.tag],
    };
    const customs = getCustomMeta(uid, type, idx);
    if (customs) rel.customs = customs;
    return rel;
  });

  await TestRelation.deleteMany({ product, type });
  await TestRelation.insertMany(relations);
  console.log(`    ✓ ${relations.length} test relations`);

  // ── Builds + Tests ──
  let totalBuilds = 0;
  let totalTests = 0;

  for (let bi = 0; bi < NUM_BUILDS; bi++) {
    const buildStart = new Date(now - (NUM_BUILDS - 1 - bi) * msPerBuild);
    const buildEnd = new Date(
      buildStart.getTime() + randInt(15, 45) * 60 * 1000,
    );
    const quality = buildQuality(bi);
    const buildNum = startBuildNum + bi;

    const buildDoc = await Build.create({
      product,
      type,
      build: buildNum,
      stage: "CI",
      platform: "linux",
      platform_version: "22.04",
      start_time: buildStart,
      end_time: buildEnd,
      status: { total: 0, pass: 0, fail: 0, skip: 0, warning: 0 },
    });

    let pass = 0,
      fail = 0,
      skip = 0;
    const testDocs = uids.map((uid) => {
      const st = testStatus(uid, stabilityMap, bi, quality);
      if (st === "PASS") pass++;
      else if (st === "FAIL") fail++;
      else skip++;

      const testStart = new Date(buildStart.getTime() + randInt(0, 800) * 1000);
      const durationMs = randInt(200, 8000);
      const testEnd = new Date(testStart.getTime() + durationMs);

      const { info, setup, body, teardown } = generateTestData(
        uid,
        type,
        st,
        durationMs,
        buildNum,
      );

      const doc = {
        uid,
        build: buildDoc._id,
        name: uid2name(uid),
        status: st,
        start_time: testStart,
        end_time: testEnd,
        info,
        setup,
        body,
        teardown,
      };

      if (st === "FAIL") {
        const msg = pick(errors);
        doc.failure = {
          error_message: msg,
          stack_trace: `Error: ${msg}\n    at runTest (${uid}.spec.js:42:15)\n    at TestRunner.run (runner.js:120:8)`,
        };
      }

      return doc;
    });

    await Test.insertMany(testDocs);

    await Build.updateOne(
      { _id: buildDoc._id },
      {
        $set: { status: { total: uids.length, pass, fail, skip, warning: 0 } },
      },
    );

    totalBuilds++;
    totalTests += uids.length;
  }

  console.log(`    ✓ ${totalBuilds} builds, ${totalTests} tests`);
}

// ─── Investigated tests ───────────────────────────────────────────────────────

async function seedInvestigatedTests() {
  const causedByOptions = [
    "Defect",
    "Automation",
    "Feature Change",
    "Performance",
    "System",
  ];

  // Custom states represent uncertain/unclear failures — one per type to demonstrate the feature.
  // Regular investigated tests (the majority) have no customize_state.
  const customStates = [
    { label: "Might be a bug", color: "#f59e0b" },
    { label: "Might be automation issue", color: "#8b5cf6" },
    { label: "Needs investigation", color: "#3b82f6" },
  ];

  const knownFailures = [];

  for (const type of ["backend", "frontend", "e2e"]) {
    // Find the latest build for this type
    const latestBuild = await Build.findOne({ product: PRODUCT, type })
      .sort({ build: -1 })
      .lean();
    if (!latestBuild) continue;

    // Get ALL failing tests in that build — these are the only ones whose fingerprints will match
    const failingTests = await Test.find({
      build: latestBuild._id,
      status: "FAIL",
      "failure.error_message": { $exists: true },
    }).lean();

    failingTests.forEach((t, i) => {
      // Always store both fields — ensures the default cascade matches on error_message first,
      // with stack_trace as fallback. No ambiguity.
      const failure = {
        error_message: t.failure.error_message,
        stack_trace: t.failure.stack_trace,
      };

      // create_at in the past — simulates engineer investigating an earlier occurrence,
      // which now auto-matches the latest run because the same failure recurred
      const create_at = new Date(
        Date.now() - randInt(3, 25) * 24 * 60 * 60 * 1000,
      );

      // Only the first failure per type gets a custom state (uncertain classification).
      // All others are plain investigated tests.
      const customState =
        i === 0
          ? customStates[["backend", "frontend", "e2e"].indexOf(type)]
          : null;

      knownFailures.push({
        uid: t.uid,
        type,
        failure,
        causedBy: pick(causedByOptions),
        customState,
        create_at,
      });
    });
  }

  await InvestigatedTest.deleteMany({ product: PRODUCT });
  await InvestigatedTest.insertMany(
    knownFailures.map((f) => {
      const doc = {
        uid: f.uid,
        product: PRODUCT,
        type: f.type,
        caused_by: f.causedBy,
        user: ADMIN_USER_ID,
        create_at: f.create_at,
        failure: f.failure,
        comments: [
          {
            userId: ADMIN_USER_ID,
            user: "admin",
            time: new Date(f.create_at.getTime() + randInt(1, 60) * 60 * 1000),
            message: f.customState
              ? `Unsure about this failure — marked as "${f.customState.label}" for now.`
              : "Identified and tracked in issue tracker.",
            isDeleted: false,
          },
        ],
      };
      if (f.customState) {
        doc.customize_state = {
          label: f.customState.label,
          color: f.customState.color,
        };
      }
      return doc;
    }),
  );

  console.log(
    `\n  ✓ ${knownFailures.length} investigated tests (${knownFailures.filter((f) => f.customState).length} with custom state)`,
  );
}

// ─── Product setting ──────────────────────────────────────────────────────────

async function seedSetting() {
  const shared = {
    product: PRODUCT,
    product_line: {},
    issue_type: [
      {
        label: "Defect",
        icon: "icofont icofont-bug",
        key: "Defect",
        color: "#ff8282",
      },
      {
        label: "Automation Issue",
        icon: "fas fa-wrench",
        key: "Automation",
        color: "#a74fff",
      },
      {
        icon: "fas fa-pencil-ruler",
        label: "Token Generation",
        key: "Token Generation",
        color: "#de6912",
      },
      {
        icon: "fas fa-pencil-ruler",
        label: "Intermittent Backend",
        key: "Unstable Backend",
        color: "#d6199a",
      },
      {
        icon: "fas fa-pencil-ruler",
        label: "Migration",
        key: "Migration",
        color: "#18debc",
      },
      {
        label: "Feature Change",
        icon: "fas fa-certificate",
        key: "Feature Change",
        color: "#4f7bff",
      },
      {
        label: "Intermittent",
        icon: "fas fa-random",
        key: "Inter",
        color: "#4fd3ff",
      },
      {
        label: "System",
        icon: "fas fa-laptop",
        key: "System",
        color: "#ff4fa7",
      },
      {
        label: "Performance",
        icon: "fas fa-tachometer-alt",
        key: "Performance",
        color: "#d4d417ff",
      },
    ],
    quarantine_rules: {
      builds: 10,
      min_pass_rate: 70,
      rules: [
        QUARANTINE_RULES.consecutiveFailures,
        QUARANTINE_RULES.highFailRate,
      ],
    },
    investigated_setting: {
      customize_state: [
        {
          label: "Might be a bug",
          key: "might_be_bug",
          color: "#f59e0b",
          ttl: 30,
        },
        {
          label: "Might be automation issue",
          key: "might_be_automation",
          color: "#8b5cf6",
          ttl: 30,
        },
        {
          label: "Needs investigation",
          key: "needs_investigation",
          color: "#3b82f6",
          ttl: 30,
        },
      ],
    },
    relations_filter: [
      "components",
      "teams",
      "tags",
      {
        type: "Feature",
        name: "Feature",
        isGroup: true,
        itemList: [
          { name: "Auth", category: "Business" },
          { name: "Checkout", category: "Business" },
          { name: "Payments", category: "Business" },
          { name: "Orders", category: "Business" },
          { name: "Catalog", category: "Business" },
          { name: "Cart", category: "Business" },
          { name: "Account", category: "Business" },
          { name: "Admin", category: "Business" },
          { name: "UI Components", category: "Frontend" },
          { name: "Dashboard", category: "Frontend" },
          { name: "Navigation", category: "Frontend" },
          { name: "Theme", category: "Frontend" },
          { name: "Accessibility", category: "Frontend" },
          { name: "Performance", category: "Frontend" },
          { name: "Smoke", category: "Test Type" },
          { name: "Regression", category: "Test Type" },
          { name: "Integration", category: "Test Type" },
          { name: "Cross-browser", category: "Test Type" },
        ],
      },
      {
        type: "Priority",
        name: "Priority",
        isGroup: true,
        itemList: [
          { name: "P0", category: "Priority" },
          { name: "P1", category: "Priority" },
          { name: "P2", category: "Priority" },
          { name: "P3", category: "Priority" },
        ],
      },
      {
        type: "Browser",
        name: "Browser",
        isGroup: true,
        itemList: [
          { name: "Chrome", category: "Browser" },
          { name: "Firefox", category: "Browser" },
          { name: "Safari", category: "Browser" },
          { name: "Edge", category: "Browser" },
        ],
      },
      {
        type: "Device",
        name: "Device",
        isGroup: true,
        itemList: [
          { name: "Desktop", category: "Device" },
          { name: "Mobile", category: "Device" },
          { name: "Tablet", category: "Device" },
        ],
      },
    ],
  };

  await Setting.deleteMany({ product: PRODUCT });
  await Setting.insertMany([
    {
      ...shared,
      type: "backend",
      description: "Acme Platform backend API test suite",
    },
    {
      ...shared,
      type: "frontend",
      description: "Acme Platform frontend UI test suite",
    },
    {
      ...shared,
      type: "e2e",
      description: "Acme Platform end-to-end test suite",
    },
  ]);
  console.log(`\n  ✓ Product settings for ${PRODUCT} (backend, frontend, e2e)`);
}

// ─── Dashboards ───────────────────────────────────────────────────────────────

function plq(type) {
  return { product: PRODUCT, type, query_type: "FILTER" };
}

const STATUS_PATTERN = {
  status: {
    all: true,
    rerun: false,
    pass: false,
    fail: false,
    skip: false,
    ki: false,
    out: false,
    not_pass: false,
  },
};
const RELATION_PATTERN_COMPONENTS = {
  ...STATUS_PATTERN,
  groupByRelation: "components",
};

async function seedDashboards() {
  await Dashboard.deleteMany({ user: ADMIN_USER_ID, name: /^Acme/ });

  const dashboards = [
    // 1 – Executive Overview
    {
      name: "Acme – Executive Overview",
      description: "Cross-product-line build health and pass rate trends",
      user: ADMIN_USER_ID,
      is_public: true,
      widgets: [
        {
          name: "All Product Lines — Run History",
          type: "BUILD_HISTORY_BAR",
          cols: 10,
          rows: 2,
          x: 0,
          y: 0,
          minItemCols: 4,
          minItemRows: 2,
          product_line_query: plq("backend"),
          multi_query: [plq("frontend"), plq("e2e")],
          pattern: STATUS_PATTERN,
        },
        {
          name: "Backend Pass Rate",
          type: "PASSRATE_LINE",
          cols: 5,
          rows: 2,
          x: 0,
          y: 2,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "E2E Status",
          type: "STATUS_PIE_ADVANCE",
          cols: 5,
          rows: 2,
          x: 5,
          y: 2,
          minItemCols: 3,
          product_line_query: plq("e2e"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Backend Investigated",
          type: "INVESTIGATED_TEST_STATUS_PIE",
          cols: 10,
          rows: 1,
          x: 0,
          y: 4,
          minItemCols: 3,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "─────────────────",
          type: "SECTION_DIVIDER",
          cols: 10,
          rows: 1,
          x: 0,
          y: 5,
        },
        {
          name: "Backend Components Treemap",
          type: "TREEMAP_TEST_RELATION",
          cols: 10,
          rows: 4,
          x: 0,
          y: 6,
          minItemCols: 4,
          minItemRows: 3,
          product_line_query: plq("backend"),
          pattern: RELATION_PATTERN_COMPONENTS,
        },
      ],
    },

    // 2 – Backend Deep Dive
    {
      name: "Acme – Backend Deep Dive",
      description: "Backend API test analysis with component breakdown",
      user: ADMIN_USER_ID,
      is_public: true,
      widgets: [
        {
          name: "API Status",
          type: "STATUS_PIE_ADVANCE",
          cols: 5,
          rows: 1,
          x: 0,
          y: 0,
          minItemCols: 3,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Investigated",
          type: "INVESTIGATED_TEST_STATUS_PIE",
          cols: 5,
          rows: 1,
          x: 5,
          y: 0,
          minItemCols: 3,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Investigated Summary",
          type: "INVESTIGATED_SUMMARY_CARD",
          cols: 10,
          rows: 2,
          x: 0,
          y: 1,
          minItemCols: 2,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Run History",
          type: "BUILD_HISTORY_BAR",
          cols: 5,
          rows: 2,
          x: 0,
          y: 3,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Pass Rate Trend",
          type: "PASSRATE_LINE",
          cols: 5,
          rows: 2,
          x: 5,
          y: 3,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Tests by Component",
          type: "RELATIONS_GROUP_BY_BAR",
          cols: 6,
          rows: 2,
          x: 0,
          y: 5,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("backend"),
          pattern: RELATION_PATTERN_COMPONENTS,
        },
        {
          name: "Most Failed Tests",
          type: "TOP_TESTS_TABLE",
          cols: 4,
          rows: 2,
          x: 6,
          y: 5,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Component Heatmap",
          type: "HEATMAP_TEST_RELATION",
          cols: 10,
          rows: 5,
          x: 0,
          y: 7,
          minItemCols: 4,
          minItemRows: 4,
          product_line_query: plq("backend"),
          pattern: RELATION_PATTERN_COMPONENTS,
        },
      ],
    },

    // 3 – Quality Summary
    {
      name: "Acme – Quality Summary",
      description: "High-level summary cards and test stability overview",
      user: ADMIN_USER_ID,
      is_public: true,
      widgets: [
        {
          name: "Build Summary",
          type: "BUILD_SUMMARY_CARD",
          cols: 4,
          rows: 3,
          x: 0,
          y: 0,
          minItemCols: 4,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Test Summary",
          type: "STATUS_SUMMARY_CARD",
          cols: 3,
          rows: 3,
          x: 4,
          y: 0,
          minItemCols: 3,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Investigation Summary",
          type: "INVESTIGATED_SUMMARY_CARD",
          cols: 3,
          rows: 3,
          x: 7,
          y: 0,
          minItemCols: 3,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "─────────────────",
          type: "SECTION_DIVIDER",
          cols: 10,
          rows: 1,
          x: 0,
          y: 3,
        },
        {
          name: "Unstable Tests",
          type: "UNSTABLE_TESTS_TABLE",
          cols: 5,
          rows: 3,
          x: 0,
          y: 4,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Stable Tests",
          type: "STABLE_TESTS_TABLE",
          cols: 5,
          rows: 3,
          x: 5,
          y: 4,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("backend"),
          pattern: STATUS_PATTERN,
        },
      ],
    },

    // 4 – E2E & Frontend Relations
    {
      name: "Acme – E2E & Frontend Relations",
      description: "End-to-end test flows and frontend component coverage",
      user: ADMIN_USER_ID,
      is_public: true,
      widgets: [
        {
          name: "E2E Flow Status",
          type: "STATUS_PIE_ADVANCE",
          cols: 5,
          rows: 1,
          x: 0,
          y: 0,
          minItemCols: 3,
          product_line_query: plq("e2e"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "Frontend Status",
          type: "STATUS_PIE_ADVANCE",
          cols: 5,
          rows: 1,
          x: 5,
          y: 0,
          minItemCols: 3,
          product_line_query: plq("frontend"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "E2E Build History",
          type: "BUILD_HISTORY_BAR",
          cols: 10,
          rows: 2,
          x: 0,
          y: 1,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("e2e"),
          pattern: STATUS_PATTERN,
        },
        {
          name: "E2E by Flow Type",
          type: "RELATIONS_GROUP_BY_BAR",
          cols: 6,
          rows: 2,
          x: 0,
          y: 3,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("e2e"),
          pattern: RELATION_PATTERN_COMPONENTS,
        },
        {
          name: "Frontend by Component",
          type: "RELATIONS_GROUP_BY_BAR",
          cols: 4,
          rows: 2,
          x: 6,
          y: 3,
          minItemCols: 3,
          minItemRows: 2,
          product_line_query: plq("frontend"),
          pattern: RELATION_PATTERN_COMPONENTS,
        },
        {
          name: "E2E Heatmap",
          type: "HEATMAP_TEST_RELATION",
          cols: 5,
          rows: 5,
          x: 0,
          y: 5,
          minItemCols: 4,
          minItemRows: 4,
          product_line_query: plq("e2e"),
          pattern: RELATION_PATTERN_COMPONENTS,
        },
        {
          name: "Frontend Components Treemap",
          type: "TREEMAP_TEST_RELATION",
          cols: 5,
          rows: 5,
          x: 5,
          y: 5,
          minItemCols: 3,
          minItemRows: 3,
          product_line_query: plq("frontend"),
          pattern: RELATION_PATTERN_COMPONENTS,
        },
      ],
    },
  ];

  await Dashboard.insertMany(dashboards);
  console.log(`\n  ✓ ${dashboards.length} dashboards`);
}

// ─── Quarantined tests ────────────────────────────────────────────────────────

async function seedQuarantinedTests() {
  const typeUids = {
    backend: { uids: BACKEND_UIDS, stabilityKey: "backend" },
    frontend: { uids: FRONTEND_UIDS, stabilityKey: "frontend" },
    e2e: { uids: E2E_UIDS, stabilityKey: "e2e" },
  };

  const docs = [];

  for (const [type, { uids, stabilityKey }] of Object.entries(typeUids)) {
    const stabilityMap = STABILITY[stabilityKey];

    const broken = uids.filter((uid) => stabilityMap[uid] && stabilityMap[uid].type === "broken");
    const flaky = uids.filter((uid) => stabilityMap[uid] && stabilityMap[uid].type === "flaky");

    // All broken tests → active quarantine, triggered by "Consecutive Failures" rule
    for (const uid of broken) {
      const daysAgo = randInt(10, 60);
      docs.push({
        uid,
        product: PRODUCT,
        type,
        rule_id: QUARANTINE_RULES.consecutiveFailures._id,
        rule_name: QUARANTINE_RULES.consecutiveFailures.name,
        quarantined_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        fail_snapshot: randInt(3, 10),
        build_snapshot: 10,
        is_active: true,
        is_exempt: false,
        resolved_at: null,
      });
    }

    // First 3 flaky → active quarantine, triggered by "High Fail Rate" rule
    const activeFlaky = flaky.slice(0, 3);
    for (const uid of activeFlaky) {
      const daysAgo = randInt(10, 60);
      docs.push({
        uid,
        product: PRODUCT,
        type,
        rule_id: QUARANTINE_RULES.highFailRate._id,
        rule_name: QUARANTINE_RULES.highFailRate.name,
        quarantined_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        fail_snapshot: randInt(4, 8),
        build_snapshot: 10,
        is_active: true,
        is_exempt: false,
        resolved_at: null,
      });
    }

    // Next up to 4 flaky → resolved quarantine (random 1–30 days ago, within TTL)
    const resolvedFlaky = flaky.slice(3, 7);
    for (const uid of resolvedFlaky) {
      const quarantinedDaysAgo = randInt(15, 60);
      const resolvedDaysAgo = randInt(1, 30);
      docs.push({
        uid,
        product: PRODUCT,
        type,
        rule_id: QUARANTINE_RULES.highFailRate._id,
        rule_name: QUARANTINE_RULES.highFailRate.name,
        quarantined_at: new Date(Date.now() - quarantinedDaysAgo * 24 * 60 * 60 * 1000),
        fail_snapshot: randInt(4, 8),
        build_snapshot: 10,
        is_active: false,
        is_exempt: false,
        resolved_at: new Date(Date.now() - resolvedDaysAgo * 24 * 60 * 60 * 1000),
      });
    }
  }

  await QuarantinedTest.insertMany(docs);

  const activeCount = docs.filter((d) => d.is_active).length;
  const resolvedCount = docs.filter((d) => !d.is_active).length;
  console.log(
    `\n  ✓ ${docs.length} quarantined tests (${activeCount} active, ${resolvedCount} resolved)`,
  );
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function confirm(question) {
  const readline = require("readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  const dbHost =
    process.env.NODE_ENV === "production" ? process.env.DBHost : config.DBHost;

  if (!dbHost) {
    console.error("DBHost is not set.");
    process.exit(1);
  }

  console.log("\n⚠️  Demo seed script");
  console.log("─────────────────────────────────────────");
  console.log(`  DB:      ${dbHost}`);
  console.log(`  Product: ${PRODUCT}`);
  console.log("\n  Collections that will be modified:");
  console.log("    • builds         — cleared for product, then re-seeded");
  console.log("    • tests          — fully cleared, then re-seeded");
  console.log("    • testrelations  — cleared for product, then re-seeded");
  console.log("    • investigatedtests — cleared for product, then re-seeded");
  console.log("    • quarantinedtests  — cleared for product, then re-seeded");
  console.log("    • settings       — cleared for product, then re-seeded");
  console.log("    • dashboards     — cleared for user+name pattern, then re-seeded");
  console.log("─────────────────────────────────────────");

  const answer = await confirm("\nProceed? (yes/no): ");
  if (answer !== "yes" && answer !== "y") {
    console.log("Aborted.");
    process.exit(0);
  }

  console.log(`\nConnecting to ${dbHost}...`);
  await mongoose.connect(dbHost, { useNewUrlParser: true });
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);

  console.log("\nClearing existing Acme demo data...");
  await Build.deleteMany({ product: PRODUCT });
  await Test.deleteMany({});
  console.log("  ✓ Cleared builds and tests");
  await QuarantinedTest.deleteMany({ product: PRODUCT });
  console.log("  ✓ Cleared quarantined tests");

  await seedProductLine(
    PRODUCT,
    "backend",
    BACKEND_UIDS,
    "backend",
    BACKEND_META,
  );
  await seedProductLine(
    PRODUCT,
    "frontend",
    FRONTEND_UIDS,
    "frontend",
    FRONTEND_META,
  );
  await seedProductLine(PRODUCT, "e2e", E2E_UIDS, "e2e", E2E_META);
  await seedInvestigatedTests();
  await seedQuarantinedTests();
  await seedSetting();
  await seedDashboards();

  const buildCount = await Build.countDocuments({ product: PRODUCT });
  const testCount = await Test.countDocuments();
  console.log(
    `\n✅ Done! ${buildCount} builds, ${testCount} tests seeded for "${PRODUCT}".`,
  );
  console.log(
    "   Dashboards: Executive Overview, Backend Deep Dive, Quality Summary, E2E & Frontend Relations\n",
  );

  mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
