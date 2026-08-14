const EventEmitter = require('events')
// Singleton event bus shared between core and all loaded plugins.
// Core emits: 'onBuildComplete' (build doc)
module.exports = new EventEmitter()
