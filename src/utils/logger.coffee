util = require('util')
path = require('path')
fs   = require('fs')
rfs  = require('rotating-file-stream')

try
  _config = require('config')
catch
  _config = {}

LEVELS = { debug: 0, info: 1, warn: 2, error: 3 }

defaultLevel = if process.env.NODE_ENV is 'production' then 'info' else 'debug'
configLevel  = process.env.LOG_LEVEL or _config.LOG_LEVEL or defaultLevel
currentLevel = LEVELS[configLevel] ? 1

logDirectory = path.join(__dirname, '../../log')
fs.existsSync(logDirectory) or fs.mkdirSync(logDirectory)

fileStream = rfs('app.log', { interval: '1d', path: logDirectory })

ts = -> new Date().toISOString()

write = (prefix, consoleFn, args) ->
  line = ts() + ' ' + prefix + ' ' + util.format(args...)
  consoleFn(line)
  fileStream.write(line + '\n')

module.exports =
  debug: (args...) -> write('[DEBUG]', console.log,   args) if LEVELS.debug >= currentLevel
  info:  (args...) -> write('[INFO] ', console.log,   args) if LEVELS.info  >= currentLevel
  warn:  (args...) -> write('[WARN] ', console.warn,  args) if LEVELS.warn  >= currentLevel
  error: (args...) -> write('[ERROR]', console.error, args) if LEVELS.error >= currentLevel
