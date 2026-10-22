---
sidebar_position: 11
title: Troubleshooting
description: Fix common UReport issues — tests not appearing, missing relation filters, API errors, authentication problems, and dashboard rendering issues.
---

# Troubleshooting

Solutions to common issues.

---

## Common Issues

### Tests Not Appearing

1. **Verify API response** — build creation must return a valid `_id`:
   ```json
   {
     "_id": "65abc123def456789",
     "product": "MyApp",
     "type": "API"
   }
   ```

2. **Check `build_id` in test submissions** — every test POST must include the `_id` from the build response.

3. **Verify product lane selection** — confirm you've selected the correct Product and Type in the filter.

4. **Check date range** — ensure the date range filter includes the time when tests were submitted.

---

### Dashboard Widgets Show "No Data"

- **Filter mismatch** — verify the Product Lane selection matches your data; check date range includes your test executions; confirm status filters aren't excluding all results.
- **Widget configuration** — verify the widget's product lane settings and ensure relation filters match your data.

---

### Test Relations Not Appearing in Filters

Relation data (components, teams, tags, customs) lives in a separate **TestRelation** record — not on the test result itself. Two ways to supply it:

**Option A — `POST /api/test_relation` (recommended)**

```json
{
  "uid": "my-test-uid",
  "product": "MyApp",
  "type": "API",
  "components": [{"name": "Login"}],
  "teams": [{"name": "Frontend"}],
  "tags": [{"name": "smoke"}],
  "customs": {"Browser": ["Chrome"], "OS": ["Windows"]}
}
```

**Option B — `test.info` inline (overrides TestRelation)**

Include `tags`, `teams`, `components`, or custom keys inside the test's `info` field. These override TestRelation values when present:

```json
{
  "build_id": "65abc123def456789",
  "name": "MyTest",
  "status": "PASS",
  "info": {
    "tags": ["smoke"],
    "teams": ["Frontend"],
    "components": ["Login"],
    "Browser": "Chrome"
  }
}
```

:::warning
Do not pass `components`, `teams`, or `tags` as top-level fields in the test POST body — the Test model has no such fields and they will be silently ignored.
:::

After submitting relation data, also add the relation dimension to **Product Lane Settings → Relations Filter** so it appears in the UI filter panel.

---

### Custom Relation Dimensions Not Showing in Filter Panel

Custom dimensions (e.g. Browser, OS, Priority) come from `TestRelation.customs` or from arbitrary keys in `test.info`.

1. **Verify data is present** — check that a TestRelation record for this product/type contains the custom key in `customs`, or that a test result has the key in `info`.
2. **Add to Product Lane Settings** — go to **Settings → Product Lane Settings → Relations Filter** and add the key name (e.g. `Browser`) as a default filter.

---

## Performance Issues

### Dashboard Loading Slowly

- **Reduce date range** — large date ranges load more data; try limiting to last 7–14 days.
- **Reduce widget count** — too many widgets on one dashboard can slow loading; consider splitting into multiple dashboards.
- **Use specific filters** — apply product lane filters to reduce the data set being queried.

### Launches Page Slow with Many Tests

- **Use pagination** — reduce page size to 25 or 50 items instead of showing all.
- **Apply filters first** — filter by status, team, or component before loading all data.
- **Try Tree View** — Tree View can be more efficient for large test suites with hierarchical organisation.

---

## Integration Problems

### API Returns 401 Unauthorized

UReport supports two authentication methods:

**API Token (recommended for CI/scripts)**

Generate a personal API token: avatar → **Edit Profile → API Token → Generate Token**. Include in every request:

```
Authorization: Bearer <your-api-token>
```

**Session Cookie (browser / interactive)**

Call `POST /api/login` with username and password. The response returns a `sessionId`. Send it as a cookie in subsequent requests:

```
Cookie: connect.sid=<sessionId>
```

:::info
For automated pipelines pushing test results, API token + `Authorization: Bearer` is the cleanest approach. Reporter plugins handle this automatically when you provide the token in the config.
:::

### API Returns 400 Bad Request

Check the response body for specific error messages about which fields are invalid.

**Required fields for builds:**
- `product` (string, required)
- `type` (string, required)

**Required fields for tests:**
- `build_id` (string, required)
- `name` (string, required)
- `status` (string, required)

---

## Display Issues

### Charts Not Rendering Correctly

- **Refresh the page** — a simple refresh often resolves transient rendering issues.
- **Clear browser cache** — clear cache and reload to get latest assets.
- **Check widget size** — some charts need minimum dimensions; try resizing the widget larger.

### Theme Colours Look Wrong

1. Check your profile settings and verify the selected theme.
2. Clear browser cache to ensure latest styles are loaded.
3. Check browser extensions — dark mode extensions can interfere with the app's theme.

---

## Getting Help

**Reporting a bug** — include:
- Steps to reproduce
- Expected vs actual behaviour
- Browser and OS information
- Screenshots if applicable

**Requesting a feature** — describe:
- The problem you're trying to solve
- Your proposed solution
- How it would benefit your workflow

---

← [Administration](./administration)
