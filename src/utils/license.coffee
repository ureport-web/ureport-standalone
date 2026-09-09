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
COMMUNITY_JWT = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ5aXpob25namlAZ21haWwuY29tIiwiaXNzIjoidXJlcG9ydCIsInBsYW4iOiJjb21tdW5pdHkiLCJsaWNlbnNlZSI6IkNvbW11bml0eSIsInNlYXRzIjo1LCJsYW5lcyI6MywiZGFzaGJvYXJkcyI6MywiZmVhdHVyZXMiOltdLCJpYXQiOjE3ODg0MDA1NTF9.JljN4GAGjIJOGBuFqX3MaIYJxFZabNyP9C4Rc8hHiIzHu_rn_jzsT9bUSJj2MbdXXiYOtb2w3USOdnCv669ISmXnSzJM9UtD_B2TDBkLVZYjvbfYi-XKIaMrFy-VyCWDSlA-zkUKViI0-OYgt_xRmiE3RKki8heW3AKOAPlOQIsz25GyutwQej3fCo_-orf6sur_li34Z6NNRbq_JieNa6FpEESXv_TLT_jrkxyA5EvVzgpS5fwowAJ1uHBk70eXwPXKB3xC2qIYphuBoVx5P89GMv9FOGrX7prZunjYRHIEFlKoencQcyMi7JO2dh9KFT2Mq8gekSwwVOdVGwfIWg'

# ── State ─────────────────────────────────────────────────────────────────────
_state = null
_rawToken = null

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
      isCommunity: payload.plan is 'community'
    }
  catch err
    { valid: false, licensee: null, seats: 3, lanes: 3, dashboards: 3, plan: 'community', features: [], expiresAt: null, isCommunity: true, error: err.message }

getLicenseState = -> _state or validateLicense(null)
invalidateCache  = -> _state = null
setCachedState   = (state) -> _state = state

initLicense = (cb) ->
  SystemSetting.findOne({ name: 'SYSTEM_SETTING' }).exec (err, setting) ->
    if err
      _rawToken = null
      _state = validateLicense(null)
    else
      _rawToken = setting?.license_key or null
      _state = validateLicense(_rawToken)
    cb?()

getRawToken = -> _rawToken
setRawToken = (token) -> _rawToken = token

module.exports = { validateLicense, getLicenseState, getRawToken, setRawToken, invalidateCache, setCachedState, initLicense, COMMUNITY_JWT }
