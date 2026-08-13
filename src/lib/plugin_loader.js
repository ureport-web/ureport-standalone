const path = require('path')
const fs = require('fs')
const hooks = require('./plugin_hooks')
const logger = require('../utils/logger')
const { getLicenseState } = require('../utils/license')

const PLUGINS_DIR = path.resolve(__dirname, '../../plugins')

let _app = null
let _db = null
const _loaded = new Set()
const _versions = {}

function init(app, db) {
  _app = app
  _db = db

  // Listen for cross-worker IPC load requests (cluster workers receive from master)
  process.on('message', (msg) => {
    if (msg && msg.type === 'UREPORT_LOAD_PLUGIN') {
      loadPlugin(msg.name)
    }
  })
}

function loadPlugin(name) {
  if (_loaded.has(name)) {
    logger.warn(`[plugin] ${name} already loaded — restart required to update`)
    return false
  }

  const pluginDir = path.join(PLUGINS_DIR, name)
  if (!fs.existsSync(pluginDir)) {
    logger.warn(`[plugin] directory not found: ${pluginDir}`)
    return false
  }

  try {
    const plugin = require(pluginDir)
    // Proxy hooks.on() — license checked at emit time, not at registration time
    const guardedHooks = {
      on: (event, handler) => {
        hooks.on(event, (payload) => {
          if (getLicenseState().features.includes(name)) {
            handler(payload)
          } else {
            logger.warn(`[plugin] ${name} skipped — feature not licensed`)
          }
        })
      }
    }
    plugin(_app, _db, guardedHooks)
    _loaded.add(name)
    try {
      _versions[name] = require(path.join(pluginDir, 'package.json')).version || '0.0.0'
    } catch { _versions[name] = '0.0.0' }
    logger.info(`[plugin] loaded: ${name} v${_versions[name]}`)
    return true
  } catch (e) {
    logger.error(`[plugin] failed to load ${name}: ${e.message}`)
    return false
  }
}

function loadAll() {
  if (!fs.existsSync(PLUGINS_DIR)) return
  for (const name of fs.readdirSync(PLUGINS_DIR)) {
    if (fs.statSync(path.join(PLUGINS_DIR, name)).isDirectory()) {
      loadPlugin(name)
    }
  }
}

function isLoaded(name) { return _loaded.has(name) }
function listLoaded() {
  return Array.from(_loaded).map(name => ({ name, version: _versions[name] || '0.0.0' }))
}

module.exports = { init, loadPlugin, loadAll, isLoaded, listLoaded }
