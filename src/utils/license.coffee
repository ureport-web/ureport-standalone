jwt = require('jsonwebtoken')
SystemSetting = require('../models/system_setting')

# ── Keys ─────────────────────────────────────────────────────────────────────
# Paste your public.pem contents here (run generate-keypair.js from licenseplatform/)
PUBLIC_KEY = """
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmo7qV9mNnAXjrcHJkmcY
h2q94m0La/rVbJ2nnqgJu8WqAl6t0upUoyAQNVvEC31mEYo+XH/THRebLRiC4RuY
sZYQPiEWOsuF83GhfBJ9LQUQE+G/5IvaTaFFwGWJeAvmqQpRJWkpdcIkIxLYsvDz
JMnPUqQWyJfAZII45aZEp1/ixiQG0ZUZ1gh8mhKxa9MzoqcnHEAwSIUhCRUrSeWq
V4FNvFaQ0Qp/BObOz45kLahq0RzHl2h3RdCTejMKJKzgI8rkV3N2ywq1Y5aVvyYo
32shnCdZH+88W8eu5Y67bf56Xi7nLFCuGFrJX8MUdSHSeZ1CZN0rNJmL3V61ccGM
vwIDAQAB
-----END PUBLIC KEY-----
"""

# Paste the output of generate-community-jwt.js here
COMMUNITY_JWT = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjb21tdW5pdHkiLCJpc3MiOiJ1cmVwb3J0IiwicGxhbiI6ImNvbW11bml0eSIsImxpY2Vuc2VlIjoiQ29tbXVuaXR5IEVkaXRpb24iLCJzZWF0cyI6MywibGFuZXMiOjMsImRhc2hib2FyZHMiOjMsImZlYXR1cmVzIjpbXSwiaWF0IjoxNzgxMTI1OTk2fQ.MBmiT4MQrjGlnbl4EKd6JMb8FZZFxX-6oFXG5ZrTieaGv6iGhmorTwkMgkiqDvHsKW2QNSNJ0_-UmaA1Iqn34v8Y069SOSvj_sZNNQrbWKsYghGQTTOCiyVY5656DH8VcY_UJtBrJDqdhx5lREcz2De3XXq9W0E7FED-SNh_G30C5rwSLf5BEEaes4R-8CLksJEp7zZgn_hhiw1Km3hG5ZyeJXaOAcn2Br56T_DKstXosaigKSsZX8roLPpDbr4HT8J3QJaqStmdco-DNEVVELgmv7jjr0lDUN-5zezBG8mMr9gPng8Z5RTmjJWf_5vGxg_78fQ3De909i0re2rIuw'

# ── State ─────────────────────────────────────────────────────────────────────
_state = null

# ── Core ──────────────────────────────────────────────────────────────────────
validateLicense = (key) ->
  keyToUse = key or COMMUNITY_JWT
  try
    payload = jwt.verify(keyToUse, PUBLIC_KEY, { algorithms: ['RS256'] })
    {
      valid:       true
      licensee:    payload.licensee or null
      seats:       if payload.seats?      then payload.seats      else null
      lanes:       if payload.lanes?      then payload.lanes      else null
      dashboards:  if payload.dashboards? then payload.dashboards else null
      plan:        payload.plan or 'community'
      features:    payload.features or []
      expiresAt:   if payload.exp then new Date(payload.exp * 1000) else null
      isCommunity: payload.sub is 'community'
    }
  catch err
    { valid: false, licensee: null, seats: 3, lanes: 3, dashboards: 3, plan: 'community', features: [], expiresAt: null, isCommunity: true, error: err.message }

getLicenseState = -> _state or validateLicense(null)
invalidateCache  = -> _state = null
setCachedState   = (state) -> _state = state

initLicense = (cb) ->
  SystemSetting.findOne({ name: 'SYSTEM_SETTING' }).exec (err, setting) ->
    if err
      _state = validateLicense(null)
    else
      _state = validateLicense(setting?.license_key or null)
    cb?()

module.exports = { validateLicense, getLicenseState, invalidateCache, setCachedState, initLicense, COMMUNITY_JWT }
