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
        q
      finalQuery = Object.assign({}, baseQuery, { '$or': orClauses })
      callback(null, finalQuery)

  server.tool('list_builds',
    'List recent builds. Filter by any combination of product, type, version, browser, platform, team, or stage. Alternatively, provide a preset name to use a saved lane configuration — when preset is given, all other field params are ignored. All string filters are case-insensitive.',
    {
      preset:   z.string().optional()
      product:  z.string().optional()
      type:     z.string().optional()
      version:  z.string().optional()
      browser:  z.string().optional()
      platform: z.string().optional()
      team:     z.string().optional()
      stage:    z.string().optional()
      limit:    z.number().int().min(1).max(50).optional().default(10)
    },
    ({ preset, product, type, version, browser, platform, team, stage, limit }) ->
      queryPromise = if preset
        new Promise((resolve, reject) ->
          resolvePreset(preset, (err, q) ->
            if err then return reject(err)
            resolve(q)
          )
        )
      else
        q = {}
        if product  then q.product  = ciExact(product)
        if type     then q.type     = ciExact(type)
        if version  then q.version  = ciPrefix(version)
        if browser  then q.browser  = ciContains(browser)
        if platform then q.platform = ciExact(platform)
        if team     then q.team     = ciExact(team)
        if stage    then q.stage    = ciExact(stage)
        Promise.resolve(q)
      queryPromise.then((query) ->
        buildsPromise = new Promise((resolve, reject) ->
          Build.find(query)
            .sort({ start_time: -1 })
            .limit(limit)
            .select('_id build version product type status start_time end_time browser device platform platform_version team stage')
            .exec((err, builds) ->
              if err then return reject(err)
              resolve(builds)
            )
        )
        Promise.all([getFrontendUrl(), buildsPromise]).then(([frontendUrl, builds]) ->
          items = builds.map((b) ->
            id: b._id.toString()
            url: buildLaunchUrl(frontendUrl, b)
            build_number: b.build
            version: b.version or ''
            status: b.status or {}
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
      )
  )

  server.tool('get_tests',
    'Get tests for a build. Use name for substring match on test name. Use file/path to filter by test file or path. For relation-based filters (component, team, tag, or any custom field like PartnerCode or XrayId), provide product+type and use component/team/tag/custom_key+custom_value — call get_relation_fields first to discover available fields. Each filter searches both TestRelation metadata and test.info overrides. Use custom_value alone (without custom_key) for a broad search across all custom fields by value — useful when you don\'t know the field name (e.g. searching for "XRAY-768" across all custom fields).',
    {
      build_id:     z.string()
      product:      z.string()
      type:         z.string()
      status:       z.enum(['PASS','FAIL','SKIP','WARNING','RERUN_PASS','RERUN_FAIL','RERUN_SKIP']).optional()
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
    ({ build_id, product, type, status, name, file, path, tag, component, team, custom_key, custom_value, limit }) ->
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
          if custom_key and custom_value
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
          if status then query.status = status
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
            .select('uid name status failure.error_message start_time end_time')
            .exec((err, tests) ->
              if err then return reject(err)
              items = tests.map((t) ->
                uid: t.uid
                name: t.name
                status: t.status
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
        TestRelation.find(rq).select('customs').limit(200).exec((err, relations) ->
          if err then return resolve([])
          keys = {}
          relations.forEach((r) ->
            if r.customs then Object.keys(r.customs).forEach((k) -> keys[k] = true)
          )
          resolve(Object.keys(keys).sort())
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

  server.tool('get_statistics',
    'Get pass/fail statistics for recent builds. Filter by any combination of product, type, version, browser, platform, team, or stage. Alternatively, provide a preset name to use a saved lane configuration — when preset is given, all other field params are ignored. All string filters are case-insensitive.',
    {
      preset:   z.string().optional()
      product:  z.string().optional()
      type:     z.string().optional()
      version:  z.string().optional()
      browser:  z.string().optional()
      platform: z.string().optional()
      team:     z.string().optional()
      stage:    z.string().optional()
      builds:   z.number().int().min(1).max(50).optional().default(10)
    },
    ({ preset, product, type, version, browser, platform, team, stage, builds }) ->
      queryPromise = if preset
        new Promise((resolve, reject) ->
          resolvePreset(preset, (err, q) ->
            if err then return reject(err)
            resolve(q)
          )
        )
      else
        q = {}
        if product  then q.product  = ciExact(product)
        if type     then q.type     = ciExact(type)
        if version  then q.version  = ciPrefix(version)
        if browser  then q.browser  = ciContains(browser)
        if platform then q.platform = ciExact(platform)
        if team     then q.team     = ciExact(team)
        if stage    then q.stage    = ciExact(stage)
        Promise.resolve(q)
      queryPromise.then((query) ->
        resultsPromise = new Promise((resolve, reject) ->
          Build.find(query)
            .sort({ start_time: -1 })
            .limit(builds)
            .select('_id build version product type status start_time browser device platform platform_version team stage')
            .exec((err, results) ->
              if err then return reject(err)
              resolve(results)
            )
        )
        Promise.all([getFrontendUrl(), resultsPromise]).then(([frontendUrl, results]) ->
          buildStats = results.map((b) ->
            total = (b.status and b.status.total) or 0
            pass = (b.status and b.status.pass) or 0
            fail = (b.status and b.status.fail) or 0
            {
              build_number: b.build
              url: buildLaunchUrl(frontendUrl, b)
              version: b.version or ''
              total: total
              pass: pass
              fail: fail
              pass_rate: if total > 0 then Math.round((pass / total) * 1000) / 10 else null
              start_time: b.start_time
            }
          )
          totalBuilds = buildStats.length
          avgPassRate = if totalBuilds > 0
            rates = buildStats.filter((b) -> b.pass_rate isnt null).map((b) -> b.pass_rate)
            if rates.length > 0
              sum = rates.reduce(((a, b) -> a + b), 0)
              Math.round(sum / rates.length * 10) / 10
            else null
          else null
          {
            content: [{
              type: 'text'
              text: JSON.stringify({ total_builds: totalBuilds, avg_pass_rate: avgPassRate, builds: buildStats }, null, 2)
            }]
          }
        )
      )
  )

  server

router.post '/', (req, res) ->
  server = createMcpServer()
  transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  res.on('close', -> transport.close())
  p = server.connect(transport)
  p.then(->
    transport.handleRequest(req, res, req.body)
  )

module.exports = router
