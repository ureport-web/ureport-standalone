Redis = require('ioredis')
NodeCache = require('node-cache')
config = require('config')
logger = require('../utils/logger')

_redis = null
_nodeCache = new NodeCache({ stdTTL: 86400, maxKeys: 10000 })

getEnvOrConfig = (key) ->
  process.env[key] or (if config.has(key) then config.get(key) else null)

# --- Mode 1: AWS IAM auth (VALKEY_PRIMARY_ENDPOINT + VALKEY_USER + VALKEY_REPLICATION_GROUP) ---
valkeyEndpoint        = getEnvOrConfig('VALKEY_PRIMARY_ENDPOINT')
valkeyUser            = getEnvOrConfig('VALKEY_USER')
valkeyReplicationGroup = getEnvOrConfig('VALKEY_REPLICATION_GROUP')
awsRegion             = process.env.AWS_REGION or 'us-east-1'

# --- Mode 2: URL-based (VALKEY_URL or REDIS_URL) ---
rawUrl = getEnvOrConfig('VALKEY_URL') or getEnvOrConfig('REDIS_URL')
redisUrl = if rawUrl
  rawUrl.replace(/^valkeys:\/\//, 'rediss://').replace(/^valkey:\/\//, 'redis://')
else
  null

# --- IAM token generation ---
# Generates a SigV4 presigned URL used as the Valkey password (valid 15 min)
generateIamToken = ->
  { SignatureV4 } = require('@smithy/signature-v4')
  { Sha256 } = require('@aws-crypto/sha256-js')
  { defaultProvider } = require('@aws-sdk/credential-provider-node')

  signer = new SignatureV4
    credentials: defaultProvider()
    region: awsRegion
    service: 'elasticache'
    sha256: Sha256

  presignedPromise = signer.presign
    method: 'GET'
    protocol: 'https:'
    hostname: valkeyReplicationGroup
    path: '/'
    query:
      Action: 'connect'
      User: valkeyUser
    headers:
      host: valkeyReplicationGroup
  ,
    expiresIn: 900

  presignedPromise.then (presigned) ->
    queryString = Object.entries(presigned.query)
      .map(([k, v]) -> "#{k}=#{encodeURIComponent(v)}")
      .join('&')
    "#{presigned.hostname}#{presigned.path}?#{queryString}"

# --- IAM connection (creates new connection with fresh token, replaces old one) ---
TOKEN_REFRESH_MS = 12 * 60 * 1000

createIamConnection = ->
  tokenPromise = generateIamToken()
  tokenPromise.then (token) ->
    oldRedis = _redis
    _redis = new Redis
      host: valkeyEndpoint
      port: 6379
      tls:
        servername: valkeyEndpoint
      username: valkeyUser
      password: token
      maxRetriesPerRequest: 2
      enableReadyCheck: true
    _redis.on 'ready', ->
      logger.info '[cache] Valkey IAM connection ready'
      if oldRedis then oldRedis.quit()
    _redis.on 'error', (err) ->
      logger.warn '[cache] Valkey IAM error:', err.message
  tokenPromise.catch (err) ->
    logger.error '[cache] Failed to generate IAM token:', err.message

# --- Initialise connection ---

if valkeyEndpoint and valkeyUser and valkeyReplicationGroup
  logger.info '[cache] AWS IAM mode — connecting to', valkeyEndpoint
  createIamConnection()
  setInterval createIamConnection, TOKEN_REFRESH_MS

else if redisUrl
  _redis = new Redis redisUrl,
    enableReadyCheck: true
    maxRetriesPerRequest: 2
    lazyConnect: false
  _redis.on 'ready', ->
    logger.info '[cache] Redis/Valkey connected'
  _redis.on 'error', (err) ->
    logger.warn '[cache] Redis error (falling back to in-process):', err.message

else
  logger.info '[cache] No cache configured, using node-cache'

module.exports =

  get: (key, cb) ->
    if _redis
      _redis.get key, (err, val) ->
        if err
          logger.warn '[cache] get error:', err.message
          return cb(null, null)
        cb(null, if val then JSON.parse(val) else null)
    else
      try
        raw = _nodeCache.get(key)
        # node-cache v1.1.0 returns {key: value} — unwrap to match Redis behaviour
        val = if raw != undefined then raw[key] else null
        cb(null, val)
      catch err
        logger.warn '[cache] node-cache get error:', err.message
        cb(null, null)

  set: (key, value, ttlSeconds) ->
    if _redis
      _redis.set key, JSON.stringify(value), 'EX', ttlSeconds, (err) ->
        if err then logger.warn '[cache] set error:', err.message
    else
      try
        _nodeCache.set(key, value, ttlSeconds)
      catch err
        logger.warn '[cache] node-cache set error:', err.message

  del: (key) ->
    if _redis
      _redis.del key, (err) ->
        if err then logger.warn '[cache] del error:', err.message
    else
      try
        _nodeCache.del(key)
      catch err
        logger.warn '[cache] node-cache del error:', err.message

  isRedis: -> !!_redis
  isConnected: -> !!_redis and _redis.status is 'ready'
  getMode: ->
    if valkeyEndpoint and valkeyUser and valkeyReplicationGroup then 'valkey-iam'
    else if redisUrl then 'redis-url'
    else 'node-cache'
