express = require('express')
router = express.Router()
{ McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js')
{ StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js')
{ z } = require('zod')
Build = require('../models/build')
Test = require('../models/test')
TestRelation = require('../models/test_relation')
SystemSetting = require('../models/system_setting')
Preset = require('../models/preset')

getFrontendUrl = ->
  new Promise((resolve) ->
    SystemSetting.findOne({name: 'SYSTEM_SETTING'}).exec((err, setting) ->
      resolve(if (!err and setting?.notification?.url) then setting.notification.url.replace(/\/$/, '') else '')
    )
  )

buildLaunchUrl = (baseUrl, build) ->
  params = 'product=' + encodeURIComponent(build.product or '') + '&type=' + encodeURIComponent(build.type or '') + '&buildId=' + build._id.toString()
  if build.team             then params += '&team='             + encodeURIComponent(build.team)
  if build.browser          then params += '&browser='          + encodeURIComponent(build.browser)
  if build.device           then params += '&device='           + encodeURIComponent(build.device)
  if build.platform         then params += '&platform='         + encodeURIComponent(build.platform)
  if build.platform_version then params += '&platform_version=' + encodeURIComponent(build.platform_version)
  if build.stage            then params += '&stage='            + encodeURIComponent(build.stage)
  (if baseUrl then baseUrl else '') + '/launches?' + params

createMcpServer = ->
  server = new McpServer({ name: 'ureport', version: '1.0.0' })

  escapeRegex = (s) -> s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  ciExact    = (s) -> new RegExp('^' + escapeRegex(s) + '$', 'i')
  ciPrefix   = (s) -> new RegExp('^' + escapeRegex(s), 'i')
  ciContains = (s) -> new RegExp(escapeRegex(s), 'i')

  resolvePreset = (presetName, callback) ->
    Preset.findOne({ name: ciExact(presetName) }).exec (err, doc) ->
      if err then return callback(err)
      unless doc then return callback(new Error("Preset '#{presetName}' not found"))
      baseQuery =
        product: ciExact(doc.lanes[0].product)
        type:    ciExact(doc.lanes[0].type)
      orClauses = doc.lanes.map (lane) ->
        q = {}
        if lane.version          then q.version          = ciPrefix(lane.version)
        if lane.browser          then q.browser          = ciContains(lane.browser)
        if lane.platform         then q.platform         = ciExact(lane.platform)
        if lane.platform_version then q.platform_version = ciPrefix(lane.platform_version)
        if lane.team             then q.team             = ciExact(lane.team)
        if lane.stage            then q.stage            = ciExact(lane.stage)
        if lane.device           then q.device           = ciExact(lane.device)
        if lane.extras and lane.extras.size > 0
          lane.extras.forEach((val, key) ->
            q['extras.' + key] = ciExact(val)
          )
        q
      finalQuery = Object.assign({}, baseQuery, { '$or': orClauses })
      callback(null, finalQuery)

  liveTestCounts = (buildIds) ->
    new Promise((resolve) ->
      Test.aggregate([
        { $match: { build: { $in: buildIds } } }
        { $sort: { is_rerun: -1, start_time: -1 } }
        { $group: {
          _id: { build: '$build', uid: '$uid' }
          status: { $first: '$status' }
        }}
        { $group: {
          _id: '$_id.build'
          total:   { $sum: 1 }
          pass:    { $sum: { $cond: [{ $in: ['$status', ['PASS', 'RERUN_PASS']] }, 1, 0] } }
          fail:    { $sum: { $cond: [{ $in: ['$status', ['FAIL', 'RERUN_FAIL']] }, 1, 0] } }
          skip:    { $sum: { $cond: [{ $in: ['$status', ['SKIP', 'RERUN_SKIP']] }, 1, 0] } }
          warning: { $sum: { $cond: [{ $eq:  ['$status', 'WARNING'] }, 1, 0] } }
        }}
      ]).exec((err, results) ->
        if err then return resolve({})
        countMap = {}
        results.forEach((r) -> countMap[r._id.toString()] = r)
        resolve(countMap)
      )
    )

  annotateCycleWarnings = (cycles) ->
    maxLanes = Math.max(0, cycles.map((c) -> c.lanes.length)...)
    cycles.forEach((c) ->
      missing = maxLanes - c.lanes.length
      if missing > 0
        c.warning = "#{missing} lane(s) did not run for build ##{c.build_number} (expected #{maxLanes}, got #{c.lanes.length})"
    )
    cycles

  getTopBuildNumbers = (query, cycles) ->
    new Promise((resolve, reject) ->
      Build.aggregate([
        { $match: query }
        { $group: { _id: '$build', maxTime: { $max: '$start_time' } } }
        { $sort: { maxTime: -1 } }
        { $limit: cycles }
      ]).exec((err, results) ->
        if err then return reject(err)
        resolve(results.map((r) -> r._id))
      )
    )

  fetchExactBuilds = (query, buildNumbers) ->
    exactQuery = Object.assign({}, query, { build: { $in: buildNumbers } })
    new Promise((resolve, reject) ->
      Build.find(exactQuery)
        .sort({ start_time: -1 })
        .select('_id build version product type start_time end_time browser device platform platform_version team stage extras')
        .exec((err, builds) ->
          if err then return reject(err)
          resolve(builds)
        )
    )

  buildResultsFromQuery = (query, limit, grouped = false) ->
    buildsPromise = if grouped
      getTopBuildNumbers(query, limit).then((buildNumbers) ->
        if buildNumbers.length is 0 then Promise.resolve([]) else fetchExactBuilds(query, buildNumbers)
      )
    else
      new Promise((resolve, reject) ->
        Build.find(query)
          .sort({ start_time: -1 })
          .limit(limit)
          .select('_id build version product type start_time end_time browser device platform platform_version team stage extras')
          .exec((err, builds) ->
            if err then return reject(err)
            resolve(builds)
          )
      )
    Promise.all([getFrontendUrl(), buildsPromise]).then(([frontendUrl, builds]) ->
      if grouped
        buildGroups = {}
        buildOrder = []
        builds.forEach((b) ->
          bn = b.build
          unless buildGroups[bn]
            buildGroups[bn] = []
            buildOrder.push(bn)
          buildGroups[bn].push(b)
        )
        cycles = buildOrder.map((bn) ->
          lanes = buildGroups[bn].map((b) ->
            id: b._id.toString()
            url: buildLaunchUrl(frontendUrl, b)
            build_number: b.build
            product: b.product or ''
            type: b.type or ''
            version: b.version or ''
            team: b.team or ''
            browser: b.browser or ''
            device: b.device or ''
            platform: b.platform or ''
            platform_version: b.platform_version or ''
            stage: b.stage or ''
            start_time: b.start_time
            end_time: b.end_time
          )
          {
            build_number: bn
            start_time: buildGroups[bn][buildGroups[bn].length - 1].start_time
            lanes: lanes
          }
        )
        annotateCycleWarnings(cycles)
        { content: [{ type: 'text', text: JSON.stringify({ total_cycles: cycles.length, cycles: cycles }, null, 2) }] }
      else
        items = builds.map((b) ->
          id: b._id.toString()
          url: buildLaunchUrl(frontendUrl, b)
          build_number: b.build
          product: b.product or ''
          type: b.type or ''
          version: b.version or ''
          start_time: b.start_time
          end_time: b.end_time
          browser: b.browser or ''
          device: b.device or ''
          platform: b.platform or ''
          platform_version: b.platform_version or ''
          team: b.team or ''
          stage: b.stage or ''
        )
        { content: [{ type: 'text', text: JSON.stringify(items, null, 2) }] }
    )

  server.tool('list_builds',
    'List recent builds using a saved preset. Results are grouped by build cycle — each cycle contains all lanes (team/browser/device combos) that ran together. Always call list_presets first to get available preset names, then call this tool with the chosen preset name. Do NOT guess or infer a preset name — it must come from the list_presets result.',
    {
      preset: z.string()
      cycles: z.number().int().min(1).max(10).optional().default(3)
    },
    ({ preset, cycles }) ->
      new Promise((resolve, reject) ->
        resolvePreset(preset, (err, query) ->
          if err then return reject(err)
          resolve(query)
        )
      ).then((query) -> buildResultsFromQuery(query, cycles, true))
  )

  server.tool('search_builds',
    'List recent builds using explicit filters. Use this only when the user has provided specific, exact filter values (product, type, version, browser, device, platform, team, stage). For general requests like "show me builds", use list_presets + list_builds instead. All string filters are case-insensitive.',
    {
      product:  z.string().optional()
      type:     z.string().optional()
      version:  z.string().optional()
      browser:  z.string().optional()
      device:   z.string().optional()
      platform: z.string().optional()
      team:     z.string().optional()
      stage:    z.string().optional()
      limit:    z.number().int().min(1).max(50).optional().default(10)
    },
    ({ product, type, version, browser, device, platform, team, stage, limit }) ->
      q = {}
      if product  then q.product  = ciExact(product)
      if type     then q.type     = ciExact(type)
      if version  then q.version  = ciPrefix(version)
      if browser  then q.browser  = ciContains(browser)
      if device   then q.device   = ciExact(device)
      if platform then q.platform = ciExact(platform)
      if team     then q.team     = ciExact(team)
      if stage    then q.stage    = ciExact(stage)
      buildResultsFromQuery(q, limit)
  )

  server.tool('list_presets',
    'List all saved presets. Returns preset names and descriptions. Call this before list_builds or get_statistics when the user wants to filter by preset but has not specified a preset name. If the result is an empty array, inform the user that no presets are configured and ask them to specify filters directly (product, type, platform, team, etc.).',
    {},
    () ->
      new Promise((resolve, reject) ->
        Preset.find({}).select('name description').sort({ name: 1 }).exec((err, presets) ->
          if err then return reject(err)
          items = presets.map((p) -> { name: p.name, description: p.description or '' })
          resolve({ content: [{ type: 'text', text: JSON.stringify(items, null, 2) }] })
        )
      )
  )

  server.tool('get_tests',
    'Get tests for a build. Use name for substring match on test name. Use file/path to filter by test file or path. Use statuses (array) to filter by one or more statuses, e.g. ["FAIL","RERUN_FAIL"]. For relation-based filters (component, team, tag, or any custom field like PartnerCode or XrayId), provide product+type and use component/team/tag/custom_key+custom_value — call get_relation_fields first to discover available fields. Each filter searches both TestRelation metadata and test.info overrides. Use custom_value alone (without custom_key) for a broad search across all custom fields by value — useful when you don\'t know the field name (e.g. searching for "XRAY-768" across all custom fields).',
    {
      build_id:     z.string()
      product:      z.string()
      type:         z.string()
      statuses:     z.array(z.enum(['PASS','FAIL','SKIP','WARNING','RERUN_PASS','RERUN_FAIL','RERUN_SKIP'])).optional()
      name:         z.string().optional()
      file:         z.string().optional()
      path:         z.string().optional()
      tag:          z.string().optional()
      component:    z.string().optional()
      team:         z.string().optional()
      custom_key:   z.string().optional()
      custom_value: z.string().optional()
      limit:        z.number().int().min(1).max(200).optional().default(50)
    },
    ({ build_id, product, type, statuses, name, file, path, tag, component, team, custom_key, custom_value, limit }) ->
      hasRelationFilter = tag or component or team or custom_value or file or path
      hasExactRelationFilter = tag or component or team or (custom_key and custom_value) or file or path
      uidsPromise = if hasExactRelationFilter
        new Promise((resolve, reject) ->
          rq = {}
          if product then rq.product = ciExact(product)
          if type    then rq.type    = ciExact(type)
          if tag       then rq['tags.name']       = ciContains(tag)
          if component then rq['components.name'] = ciContains(component)
          if team      then rq['teams.name']      = ciContains(team)
          if file      then rq.file               = ciContains(file)
          if path      then rq.path               = ciContains(path)
          if custom_key and custom_value and /^[a-zA-Z0-9_]+$/.test(custom_key)
            rq['customs.' + custom_key] = ciExact(custom_value)
          TestRelation.find(rq).select('uid').exec((err, relations) ->
            if err then return reject(err)
            resolve(relations.map((r) -> r.uid))
          )
        )
      else
        Promise.resolve(null)
      broadCustomPromise = if custom_value and not custom_key
        containsPattern = ciContains(custom_value)
        exactPattern = ciExact(custom_value)
        reserved = { tags: 1, teams: 1, components: 1, file: 1, path: 1, duration: 1, description: 1, quickInfo: 1, browser: 1, device: 1 }
        rq = {}
        if product then rq.product = ciExact(product)
        if type    then rq.type    = ciExact(type)
        relationsPromise = new Promise((res) ->
          TestRelation.find(rq).select('uid customs').lean().exec((err, relations) ->
            if err then return res([])
            uids = []
            relations.forEach((r) ->
              if r.customs
                matched = Object.values(r.customs).some((v) ->
                  vals = if Array.isArray(v) then v else [v]
                  vals.some((val) -> containsPattern.test(String(val)))
                )
                if matched then uids.push(r.uid)
            )
            res(uids)
          )
        )
        infoPromise = new Promise((res) ->
          Test.find({ build: build_id, info: { $exists: true, $ne: null } })
            .select('uid info').lean()
            .exec((err, tests) ->
              if err then return res([])
              uids = []
              tests.forEach((t) ->
                if t.info
                  matched = Object.keys(t.info).some((k) ->
                    return false if reserved[k]
                    v = t.info[k]
                    vals = if Array.isArray(v) then v else [v]
                    vals.some((val) -> containsPattern.test(String(val)))
                  )
                  if matched then uids.push(t.uid)
              )
              res(uids)
            )
        )
        Promise.all([relationsPromise, infoPromise]).then(([relationUids, infoUids]) ->
          Array.from(new Set(relationUids.concat(infoUids)))
        )
      else
        Promise.resolve(null)
      Promise.all([uidsPromise, broadCustomPromise]).then(([uids, broadResult]) ->
        new Promise((resolve, reject) ->
          query = { build: build_id }
          if statuses and statuses.length > 0
            query.status = if statuses.length is 1 then statuses[0] else { $in: statuses }
          if name   then query.name   = ciContains(name)
          if hasRelationFilter
            orConditions = []
            if uids and uids.length > 0 then orConditions.push({ uid: { $in: uids } })
            if tag       then orConditions.push({ 'info.tags':       ciContains(tag) })
            if component then orConditions.push({ 'info.components': ciContains(component) })
            if team      then orConditions.push({ 'info.teams':      ciContains(team) })
            if file      then orConditions.push({ 'info.file':       ciContains(file) })
            if path      then orConditions.push({ 'info.path':       ciContains(path) })
            if custom_key and custom_value
              infoCondition = {}
              infoCondition['info.' + custom_key] = ciContains(custom_value)
              orConditions.push(infoCondition)
            if broadResult and broadResult.length > 0
              orConditions.push({ uid: { $in: broadResult } })
            if orConditions.length > 0
              query['$or'] = orConditions
            else
              query.uid = { $in: [] }
          Test.find(query)
            .limit(limit)
            .select('uid name status is_rerun failure.error_message start_time end_time')
            .exec((err, tests) ->
              if err then return reject(err)
              items = tests.map((t) ->
                uid: t.uid
                name: t.name
                status: t.status
                is_rerun: t.is_rerun or false
                error_message: (t.failure and t.failure.error_message) or null
                start_time: t.start_time
                end_time: t.end_time
              )
              resolve({ content: [{ type: 'text', text: JSON.stringify(items, null, 2) }] })
            )
        )
      )
  )

  server.tool('get_relation_fields',
    'Discover available relation metadata for a product/type before using relation filters in get_tests. Returns distinct tag names, component names, team names, and custom field keys from both TestRelation (e.g. PartnerCode, XrayId) and test.info overrides. Call this first whenever a user asks to filter tests by something that might be a relation attribute (partner, squad, XRAY ticket, etc.).',
    {
      product: z.string()
      type:    z.string()
    },
    ({ product, type }) ->
      rq = { product: ciExact(product), type: ciExact(type) }
      tagsPromise = new Promise((resolve) ->
        TestRelation.distinct('tags.name', rq).exec((err, vals) ->
          resolve(if err then [] else vals.filter(Boolean).sort())
        )
      )
      componentsPromise = new Promise((resolve) ->
        TestRelation.distinct('components.name', rq).exec((err, vals) ->
          resolve(if err then [] else vals.filter(Boolean).sort())
        )
      )
      teamsPromise = new Promise((resolve) ->
        TestRelation.distinct('teams.name', rq).exec((err, vals) ->
          resolve(if err then [] else vals.filter(Boolean).sort())
        )
      )
      relationCustomKeysPromise = new Promise((resolve) ->
        TestRelation.aggregate([
          { $match: rq }
          { $project: { customKeys: { $objectToArray: '$customs' } } }
          { $unwind: '$customKeys' }
          { $group: { _id: '$customKeys.k' } }
          { $sort: { _id: 1 } }
        ]).exec((err, results) ->
          if err then return resolve([])
          resolve(results.map((r) -> r._id).filter(Boolean))
        )
      )
      infoKeysPromise = new Promise((resolve) ->
        Build.find({ product: ciExact(product), type: ciExact(type) })
          .sort({ start_time: -1 })
          .limit(1)
          .select('_id')
          .exec((err, builds) ->
            if err or not builds.length then return resolve([])
            Test.find({ build: builds[0]._id, info: { $exists: true, $ne: null } })
              .select('info')
              .limit(100)
              .exec((err2, tests) ->
                if err2 then return resolve([])
                keys = {}
                reservedKeys = { tags: true, teams: true, components: true, file: true, path: true, duration: true, description: true, quickInfo: true, browser: true, device: true }
                tests.forEach((t) ->
                  if t.info
                    Object.keys(t.info).forEach((k) ->
                      if not reservedKeys[k] then keys[k] = true
                    )
                )
                resolve(Object.keys(keys).sort())
              )
          )
      )
      Promise.all([tagsPromise, componentsPromise, teamsPromise, relationCustomKeysPromise, infoKeysPromise]).then(([tags, components, teams, relationCustomKeys, infoKeys]) ->
        allCustomKeys = Array.from(new Set(relationCustomKeys.concat(infoKeys))).sort()
        {
          content: [{
            type: 'text'
            text: JSON.stringify({ tags, components, teams, custom_keys: allCustomKeys }, null, 2)
          }]
        }
      )
  )

  statisticsFromQuery = (query, builds, grouped = false) ->
    resultsPromise = if grouped
      getTopBuildNumbers(query, builds).then((buildNumbers) ->
        if buildNumbers.length is 0 then Promise.resolve([]) else fetchExactBuilds(query, buildNumbers)
      )
    else
      new Promise((resolve, reject) ->
        Build.find(query)
          .sort({ start_time: -1 })
          .limit(builds)
          .select('_id build version product type start_time browser device platform platform_version team stage')
          .exec((err, results) ->
            if err then return reject(err)
            resolve(results)
          )
      )
    Promise.all([getFrontendUrl(), resultsPromise]).then(([frontendUrl, results]) ->
      buildIds = results.map((b) -> b._id)
      liveTestCounts(buildIds).then((countMap) ->
        makeLaneStat = (b) ->
          counts = countMap[b._id.toString()] or { total: 0, pass: 0, fail: 0, skip: 0, warning: 0 }
          total   = counts.total
          pass    = counts.pass
          fail    = counts.fail
          skip    = counts.skip
          warning = counts.warning
          {
            build_number: b.build
            url: buildLaunchUrl(frontendUrl, b)
            product: b.product or ''
            type: b.type or ''
            version: b.version or ''
            team: b.team or ''
            browser: b.browser or ''
            device: b.device or ''
            platform: b.platform or ''
            platform_version: b.platform_version or ''
            stage: b.stage or ''
            total: total
            pass: pass
            fail: fail
            skip: skip
            warning: warning
            pass_rate: if total > 0 then Math.round((pass / total) * 1000) / 10 else null
            start_time: b.start_time
          }

        if grouped
          buildGroups = {}
          buildOrder = []
          results.forEach((b) ->
            bn = b.build
            unless buildGroups[bn]
              buildGroups[bn] = []
              buildOrder.push(bn)
            buildGroups[bn].push(b)
          )
          cycles = buildOrder.map((bn) ->
            lanes = buildGroups[bn].map(makeLaneStat)
            combinedTotal   = lanes.reduce(((s, l) -> s + l.total), 0)
            combinedPass    = lanes.reduce(((s, l) -> s + l.pass), 0)
            combinedFail    = lanes.reduce(((s, l) -> s + l.fail), 0)
            combinedSkip    = lanes.reduce(((s, l) -> s + l.skip), 0)
            combinedWarning = lanes.reduce(((s, l) -> s + l.warning), 0)
            {
              build_number: bn
              start_time: buildGroups[bn][buildGroups[bn].length - 1].start_time
              combined: {
                total: combinedTotal
                pass: combinedPass
                fail: combinedFail
                skip: combinedSkip
                warning: combinedWarning
                pass_rate: if combinedTotal > 0 then Math.round((combinedPass / combinedTotal) * 1000) / 10 else null
              }
              lanes: lanes
            }
          )
          annotateCycleWarnings(cycles)
          { content: [{ type: 'text', text: JSON.stringify({ total_cycles: cycles.length, cycles: cycles }, null, 2) }] }
        else
          buildStats = results.map(makeLaneStat)
          totalBuilds = buildStats.length
          avgPassRate = if totalBuilds > 0
            rates = buildStats.filter((b) -> b.pass_rate isnt null).map((b) -> b.pass_rate)
            if rates.length > 0
              sum = rates.reduce(((a, b) -> a + b), 0)
              Math.round(sum / rates.length * 10) / 10
            else null
          else null
          { content: [{ type: 'text', text: JSON.stringify({ total_builds: totalBuilds, avg_pass_rate: avgPassRate, builds: buildStats }, null, 2) }] }
      )
    )

  server.tool('get_statistics',
    'Get pass/fail statistics for recent builds using a saved preset. Results are grouped by build cycle — each cycle shows a combined pass rate plus per-lane breakdown. Counts are computed from live test data (accurate, reflects reruns). Always call list_presets first to get available preset names, then call this tool with the chosen preset name. Do NOT guess or infer a preset name — it must come from the list_presets result.',
    {
      preset: z.string()
      cycles: z.number().int().min(1).max(10).optional().default(3)
    },
    ({ preset, cycles }) ->
      new Promise((resolve, reject) ->
        resolvePreset(preset, (err, q) ->
          if err then return reject(err)
          resolve(q)
        )
      ).then((query) -> statisticsFromQuery(query, cycles, true))
  )

  server.tool('search_statistics',
    'Get pass/fail statistics using explicit filters. Returns a flat list of individual builds sorted by time. Use this only when the user has provided specific, exact filter values (product, type, version, browser, device, platform, team, stage). For general requests or multi-lane presets, use list_presets + get_statistics instead. All string filters are case-insensitive.',
    {
      product:  z.string().optional()
      type:     z.string().optional()
      version:  z.string().optional()
      browser:  z.string().optional()
      device:   z.string().optional()
      platform: z.string().optional()
      team:     z.string().optional()
      stage:    z.string().optional()
      builds:   z.number().int().min(1).max(50).optional().default(10)
    },
    ({ product, type, version, browser, device, platform, team, stage, builds }) ->
      q = {}
      if product  then q.product  = ciExact(product)
      if type     then q.type     = ciExact(type)
      if version  then q.version  = ciPrefix(version)
      if browser  then q.browser  = ciContains(browser)
      if device   then q.device   = ciExact(device)
      if platform then q.platform = ciExact(platform)
      if team     then q.team     = ciExact(team)
      if stage    then q.stage    = ciExact(stage)
      statisticsFromQuery(q, builds)
  )

  server.tool('get_new_failures',
    'Find tests that newly failed in the latest build cycle compared to previous cycles for a preset. Requires at least 2 cycles of history. Always call list_presets first to get preset names. IMPORTANT: After presenting the results to the user, always ask: "Would you like me to save an AI analysis prompt for these new failures as a local .md file?" If the user says yes, generate and save a .md file using this exact template:\n\n## Build Context\nPreset: {preset} | Latest build: {latest_build_number} | Compared against: {compared_against}\n\n## New Failures ({total_new_failures} tests)\n\n[Group tests by error_message. For each group:]\n### Group N — X test(s)\nError: "{error_message}"\nStack trace (include the FULL stack_trace text — do NOT truncate, Playwright call logs are essential for diagnosis):\n{full stack_trace}\nTests affected:\n  - {name} [uid: {uid}] — failed in: {failed_in_lanes[].label joined by ", "}{if file: " ({file})"}\n\n> Note: test source code is not included. Paste relevant test file contents if deeper analysis is needed.\n\n## Task\n1. For each group, what is the most likely root cause?\n2. Which groups likely share the same underlying issue?\n3. What should be investigated first (highest impact / easiest fix)?\n4. Which failures look like environment/infra issues vs code bugs vs test flakiness?\n\n## Instructions\n- Reproduce each failure locally by running the affected test(s) or tracing the code path.\n- If you have access to the repository, locate the relevant source files.\n- If the root cause is clear and the fix is safe, apply it directly.\n- If multiple groups share a root cause, fix them together.\n- If reproduction or a fix requires clarification, ask before proceeding.',
    {
      preset: z.string()
      cycles: z.number().int().min(2).max(5).optional().default(2)
    },
    ({ preset, cycles }) ->
      new Promise((resolve, reject) ->
        resolvePreset(preset, (err, query) ->
          if err then return reject(err)
          resolve(query)
        )
      ).then((query) ->
        getTopBuildNumbers(query, cycles).then((buildNumbers) ->
          if buildNumbers.length < 2
            return { content: [{ type: 'text', text: JSON.stringify({ error: 'Not enough build cycles found — need at least 2 to compare' }, null, 2) }] }
          fetchExactBuilds(query, buildNumbers).then((builds) ->
            latestBN    = buildNumbers[0]
            previousBNs = buildNumbers.slice(1)

            latestBuilds   = builds.filter((b) -> b.build is latestBN)
            previousBuilds = builds.filter((b) -> previousBNs.indexOf(b.build) >= 0)

            latestBuildIds   = latestBuilds.map((b) -> b._id)
            previousBuildIds = previousBuilds.map((b) -> b._id)
            allBuildIds      = latestBuildIds.concat(previousBuildIds)

            buildLaneMap = {}
            builds.forEach((b) ->
              parts = [b.team, b.browser, b.device, b.platform, b.stage].filter((v) -> v and v.length > 0)
              if b.extras and b.extras.size > 0
                b.extras.forEach((val) -> if val then parts.push(val))
              buildLaneMap[b._id.toString()] =
                build_number: b.build
                team:     b.team     or ''
                browser:  b.browser  or ''
                device:   b.device   or ''
                platform: b.platform or ''
                stage:    b.stage    or ''
                label:    if parts.length > 0 then parts.join('/') else 'default'
            )

            latestSet   = new Set(latestBuildIds.map((id) -> id.toString()))
            previousSet = new Set(previousBuildIds.map((id) -> id.toString()))

            new Promise((resolve2, reject2) ->
              Test.aggregate([
                { $match: { build: { $in: allBuildIds } } }
                { $sort: { is_rerun: -1, start_time: -1 } }
                { $group: {
                  _id: { build: '$build', uid: '$uid' }
                  status: { $first: '$status' }
                  name:   { $first: '$name' }
                  error_message: { $first: '$failure.error_message' }
                  stack_trace:   { $first: '$failure.stack_trace' }
                  file:          { $first: '$info.file' }
                  path:          { $first: '$info.path' }
                }}
                { $match: { status: { $in: ['FAIL', 'RERUN_FAIL'] } } }
              ]).exec((err, results) ->
                if err then return reject2(err)

                byUid = {}
                results.forEach((r) ->
                  uid     = r._id.uid
                  buildId = r._id.build.toString()
                  unless byUid[uid]
                    byUid[uid] = { name: r.name, error_message: r.error_message or null, stack_trace: r.stack_trace or null, file: r.file or null, path: r.path or null, latestLanes: [], inPrevious: false }
                  if latestSet.has(buildId)
                    byUid[uid].latestLanes.push(buildLaneMap[buildId])
                    if r.name          then byUid[uid].name = r.name
                    if r.error_message then byUid[uid].error_message = r.error_message
                    if r.stack_trace   then byUid[uid].stack_trace = r.stack_trace
                    if r.file          then byUid[uid].file = r.file
                    if r.path          then byUid[uid].path = r.path
                  if previousSet.has(buildId)
                    byUid[uid].inPrevious = true
                )

                newFailures = []
                Object.keys(byUid).forEach((uid) ->
                  info = byUid[uid]
                  if info.latestLanes.length > 0 and not info.inPrevious
                    newFailures.push({
                      uid: uid
                      name: info.name
                      error_message: info.error_message
                      stack_trace: info.stack_trace
                      file: info.file
                      path: info.path
                      failed_in_lanes: info.latestLanes
                    })
                )

                buildResult = ->
                  resolve2({
                    content: [{
                      type: 'text'
                      text: JSON.stringify({
                        latest_build_number: latestBN
                        compared_against: previousBNs
                        total_new_failures: newFailures.length
                        new_failures: newFailures
                      }, null, 2)
                    }]
                  })

                missingUids = newFailures.filter((f) -> not f.file and not f.path).map((f) -> f.uid)
                if missingUids.length is 0
                  return buildResult()

                TestRelation.find({ uid: { $in: missingUids } }).select('uid file path').lean().exec((err2, relations) ->
                  unless err2
                    relMap = {}
                    relations.forEach((r) -> relMap[r.uid] = r)
                    newFailures.forEach((f) ->
                      if not f.file and not f.path and relMap[f.uid]
                        f.file = relMap[f.uid].file or null
                        f.path = relMap[f.uid].path or null
                    )
                  buildResult()
                )
              )
            )
          )
        )
      )
  )

  server

router.post '/', (req, res) ->
  req.headers['accept'] = 'application/json, text/event-stream'
  server = createMcpServer()
  transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  res.on('close', -> transport.close())
  p = server.connect(transport)
  p.then(->
    transport.handleRequest(req, res, req.body)
  )

module.exports = router
