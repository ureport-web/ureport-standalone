express = require('express')
https   = require('https')
http    = require('http')
fs      = require('fs')
path    = require('path')
os      = require('os')
tar     = require('tar')
multer  = require('multer')

config = require('config')
router = express.Router()
pluginLoader = require('../lib/plugin_loader')
{ getLicenseState, getRawToken } = require('../utils/license')
logger = require('../utils/logger')
Audit = require('../models/audit')

FEATURE_SERVER_URL = process.env.FEATURE_SERVER_URL or
  (if config.has('FEATURE_SERVER_URL') then config.get('FEATURE_SERVER_URL') else null)

unless FEATURE_SERVER_URL
  logger.warn '[plugins] FEATURE_SERVER_URL not set — plugin install endpoint will be unavailable'
PLUGINS_DIR = path.resolve(__dirname, '../../plugins')

upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 50 * 1024 * 1024 }, # 50MB max
  fileFilter: (req, file, cb) ->
    if file.originalname.endsWith('.tar.gz') or file.mimetype in ['application/gzip', 'application/x-gzip', 'application/octet-stream']
      cb(null, true)
    else
      cb(new Error('Only .tar.gz files are accepted'))
})

# ── Helpers ──────────────────────────────────────────────────────────────────

# Download URL to a local file path, returns Promise
downloadToFile = (url, destPath, bearerToken) ->
  new Promise (resolve, reject) ->
    parsedUrl = new URL(url)
    transport = if parsedUrl.protocol is 'https:' then https else http
    options =
      hostname: parsedUrl.hostname
      port:     parsedUrl.port or (if parsedUrl.protocol is 'https:' then 443 else 80)
      path:     parsedUrl.pathname + (parsedUrl.search or '')
      method:   'GET'
      headers:
        Authorization: "Bearer #{bearerToken}"
    req = transport.request options, (res) ->
      if res.statusCode isnt 200
        chunks = []
        res.on 'data', (c) -> chunks.push(c)
        res.on 'end', ->
          body = Buffer.concat(chunks).toString()
          try
            parsed = JSON.parse(body)
            reject({ status: res.statusCode, message: parsed.error or body })
          catch
            reject({ status: res.statusCode, message: body })
        return
      out = fs.createWriteStream(destPath)
      res.pipe(out)
      out.on 'finish', resolve
      out.on 'error', reject
    req.on 'error', reject
    req.end()

# Extract tar.gz to ./plugins/ and return Promise (cross-platform, pure JS)
# Also validates the extracted package.json name matches the expected plugin name.
extractBundle = (tarPath, name) ->
  unless /^[a-z0-9-]+$/.test(name)
    return Promise.reject(new Error("Invalid plugin name: #{name}"))
  fs.mkdirSync(PLUGINS_DIR, { recursive: true })
  tar.x({ file: tarPath, cwd: PLUGINS_DIR }).then ->
    pkgPath = path.join(PLUGINS_DIR, name, 'package.json')
    try
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      if pkg.name and pkg.name isnt name
        # Clean up the wrongly extracted directory — only if safe
        if /^[a-z0-9-]+$/.test(pkg.name)
          wrongDir = path.resolve(PLUGINS_DIR, pkg.name)
          if wrongDir.startsWith(PLUGINS_DIR + path.sep) and fs.existsSync(wrongDir)
            fs.rmSync(wrongDir, { recursive: true, force: true })
        return Promise.reject(new Error("Bundle mismatch: expected \"#{name}\" but got \"#{pkg.name}\""))
    catch e
      if e.message?.includes('Bundle mismatch') then return Promise.reject(e)
      # No package.json in bundle — skip name check
    Promise.resolve()

savePluginAudit = (req, name, action) ->
  ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() or req.ip or ''
  audit = new Audit({
    audit_type: 'plugin',
    action: action,
    uid: name,
    product: 'system',
    type: name,
    entity_type: 'plugin',
    username: if req.user then req.user.username else '',
    user: if req.user then req.user._id else undefined,
    ip: ip
  })
  audit.save (err) ->
    if err then logger.error("[plugin] failed to write audit for #{name}:", err.message)

# ── Routes ───────────────────────────────────────────────────────────────────

# GET /api/plugins — list loaded plugins with versions
router.get '/', (req, res) ->
  res.json { plugins: pluginLoader.listLoaded() }

# GET /api/plugins/available — proxy to Feature Server, returns available plugins with versions
router.get '/available', (req, res) ->
  unless FEATURE_SERVER_URL
    return res.status(503).json({ error: 'FEATURE_SERVER_URL not configured' })

  licenseToken = getRawToken()
  unless licenseToken
    return res.status(400).json({ error: 'No enterprise license token configured' })

  featuresUrl = "#{FEATURE_SERVER_URL}/features"
  parsedUrl = new URL(featuresUrl)
  transport = if parsedUrl.protocol is 'https:' then https else http
  options =
    hostname: parsedUrl.hostname
    port:     parsedUrl.port or (if parsedUrl.protocol is 'https:' then 443 else 80)
    path:     parsedUrl.pathname
    method:   'GET'
    headers:
      Authorization: "Bearer #{licenseToken}"
  reqHttp = transport.request options, (fsRes) ->
    chunks = []
    fsRes.on 'data', (c) -> chunks.push(c)
    fsRes.on 'end', ->
      try
        body = JSON.parse(Buffer.concat(chunks).toString())
        res.json { features: body.features or [] }
      catch
        res.status(502).json({ error: 'Invalid response from feature server' })
  reqHttp.on 'error', (err) ->
    res.status(502).json({ error: 'Feature server unreachable' })
  reqHttp.end()

###
 * POST /api/plugins/:name/install
 * Downloads plugin bundle from Feature Server and hot-loads it.
 * Requires a valid enterprise license with the feature in features[].
###
router.post '/:name/install', (req, res) ->
  name = req.params.name

  unless FEATURE_SERVER_URL
    return res.status(503).json({ error: 'FEATURE_SERVER_URL not configured on this server' })

  unless /^[a-z0-9-]+$/.test(name)
    return res.status(400).json({ error: 'Invalid plugin name' })

  isUpdate = pluginLoader.isLoaded(name)

  licenseState = getLicenseState()
  unless licenseState.valid
    return res.status(403).json({ error: 'No valid license' })

  unless licenseState.features and licenseState.features.includes(name)
    return res.status(403).json({ error: "License does not include feature: #{name}" })

  licenseToken = getRawToken()
  unless licenseToken
    return res.status(400).json({ error: 'No enterprise license token configured' })

  downloadUrl = "#{FEATURE_SERVER_URL}/features/#{name}/download"
  tmpFile = path.join(os.tmpdir(), "ureport-plugin-#{name}-#{Date.now()}.tar.gz")

  logger.info "[plugin] installing #{name} from #{downloadUrl}"

  downloadPromise = downloadToFile(downloadUrl, tmpFile, licenseToken)

  downloadPromise.then ->
    extractBundle(tmpFile, name)
  .then ->
    fs.unlink tmpFile, -> # cleanup temp file, ignore error
    if isUpdate
      # Files updated on disk — can't hot-reload, restart required
      logger.info "[plugin] #{name} updated on disk — restart required to apply"
      savePluginAudit(req, name, 'update')
      return res.json({ installed: true, loaded: false, restartRequired: true, name })
    ok = pluginLoader.loadPlugin(name)
    unless ok
      return res.status(500).json({ error: "Downloaded but failed to load plugin: #{name}" })
    if process.send
      process.send({ type: 'UREPORT_LOAD_PLUGIN', name })
    logger.info "[plugin] #{name} installed and loaded"
    savePluginAudit(req, name, 'install')
    res.json({ installed: true, loaded: true, restartRequired: false, name })
  .catch (err) ->
    fs.unlink tmpFile, -> # cleanup temp file, ignore error
    status = err.status or 500
    message = err.message or 'Install failed'
    logger.error "[plugin] install failed for #{name}:", message
    res.status(status).json({ error: message })

###
 * POST /api/plugins/:name/upload
 * Upload a .tar.gz plugin bundle directly — for air-gapped / restricted networks.
 * Validates license feature entitlement before extracting.
###
router.post '/:name/upload', upload.single('bundle'), (req, res) ->
  name = req.params.name

  unless /^[a-z0-9-]+$/.test(name)
    if req.file then fs.unlink(req.file.path, ->)
    return res.status(400).json({ error: 'Invalid plugin name' })

  unless req.file
    return res.status(400).json({ error: 'No file uploaded — send a .tar.gz as multipart field "bundle"' })

  licenseState = getLicenseState()
  unless licenseState.valid
    fs.unlink req.file.path, ->
    return res.status(403).json({ error: 'No valid license' })

  unless licenseState.features and licenseState.features.includes(name)
    fs.unlink req.file.path, ->
    return res.status(403).json({ error: "License does not include feature: #{name}" })

  isUpdate = pluginLoader.isLoaded(name)
  tarPath = req.file.path

  extractBundle(tarPath, name)
  .then ->
    fs.unlink tarPath, ->
    if isUpdate
      logger.info "[plugin] #{name} updated via upload — restart required"
      savePluginAudit(req, name, 'upload-update')
      return res.json({ installed: true, loaded: false, restartRequired: true, name })
    ok = pluginLoader.loadPlugin(name)
    unless ok
      return res.status(500).json({ error: "Uploaded but failed to load plugin: #{name}" })
    if process.send
      process.send({ type: 'UREPORT_LOAD_PLUGIN', name })
    logger.info "[plugin] #{name} installed via upload and loaded"
    savePluginAudit(req, name, 'upload-install')
    res.json({ installed: true, loaded: true, restartRequired: false, name })
  .catch (err) ->
    fs.unlink tarPath, ->
    logger.error "[plugin] upload extract failed for #{name}:", err.message
    res.status(500).json({ error: 'Failed to extract bundle: ' + err.message })

# POST /api/plugins/:name/load — hot-load a plugin already on disk (first install only)
router.post '/:name/load', (req, res) ->
  name = req.params.name
  if pluginLoader.isLoaded(name)
    return res.status(409).json({ error: "#{name} already loaded — restart server to update" })
  ok = pluginLoader.loadPlugin(name)
  unless ok
    return res.status(400).json({ error: "Failed to load plugin: #{name}" })
  if process.send
    process.send({ type: 'UREPORT_LOAD_PLUGIN', name })
  res.json({ loaded: true, name })

module.exports = router
