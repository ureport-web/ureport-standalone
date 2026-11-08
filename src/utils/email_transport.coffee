# Builds the SMTP transport from the saved email settings. Also used by the notifications plugin
# (plugins/notifications/send_email.js), so a change here changes build notification mail too.
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
