# NOTE: The transport logic and PROVIDER_DEFAULTS here are intentionally duplicated in
# plugins/notifications/send_email.js (inlined for plugin isolation). If you change this
# file, mirror the same change there and vice versa.
nodemailer = require('nodemailer')

PROVIDER_DEFAULTS =
  gmail:   { host: 'smtp.gmail.com',     port: 465, secure: true  }
  outlook: { host: 'smtp.office365.com', port: 587, secure: false }

module.exports = (emailConfig) ->
  provider = emailConfig.provider or 'gmail'
  defaults = PROVIDER_DEFAULTS[provider] or {}
  config =
    host:   emailConfig.host   or defaults.host
    port:   emailConfig.port   or defaults.port
    secure: if emailConfig.secure? then emailConfig.secure else (defaults.secure ? false)
  if emailConfig.user or emailConfig.password
    config.auth =
      user: emailConfig.user
      pass: emailConfig.password
  nodemailer.createTransport config
