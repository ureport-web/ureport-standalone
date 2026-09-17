nodemailer       = require('nodemailer')
getSystemSetting = require('./getSystemSetting')
buildTransport   = require('./email_transport')
logger           = require('./logger')

emailTransporter    = undefined
emailTransporterKey = undefined

renderTemplate = (user, confirmationUrl) ->
  '<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">' +
  '<tr><td align="center">' +

  '<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px">' +

  '<tr><td style="background:#1e293b;padding:18px 24px">' +
    '<span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px">UReport</span>' +
    '<span style="color:#94a3b8;font-size:13px;margin-left:12px">Email Confirmation</span>' +
  '</td></tr>' +

  '<tr><td style="padding:28px 24px;border-bottom:1px solid #f1f5f9">' +
    '<p style="margin:0 0 8px;color:#0f172a;font-size:16px;font-weight:600">Confirm your email address</p>' +
    '<p style="margin:0;color:#475569;font-size:14px;line-height:1.6">Hello <strong>' + user.username + '</strong>, thank you for registering with UReport. Click the button below to confirm your email address and activate your account.</p>' +
  '</td></tr>' +

  '<tr><td style="padding:24px 24px;border-bottom:1px solid #f1f5f9">' +
    '<a href="' + confirmationUrl + '" style="display:inline-block;padding:10px 22px;background:#1d6ae5;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">Confirm Email Address →</a>' +
    '<p style="margin:14px 0 0;color:#94a3b8;font-size:12px">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>' +
  '</td></tr>' +

  '<tr><td style="padding:12px 24px;background:#f8fafc;border-top:1px solid #e2e8f0">' +
    '<p style="margin:0;color:#94a3b8;font-size:11px">UReport · You are receiving this because an account was created with this email address.</p>' +
  '</td></tr>' +

  '</table>' +
  '</td></tr></table>' +
  '</body>'

module.exports = (req, user, token) ->
  getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
    emailConfig = setting?.notification?.email
    if !emailConfig?.user
      logger.info("Email not configured, skipping confirmation email")
      return
    if !emailConfig.password and (emailConfig.provider or 'gmail') != 'smtp'
      logger.info("Email password not configured, skipping confirmation email")
      return

    baseUrl = setting.notification.url or (req.protocol + '://' + req.get('host'))
    confirmationUrl = baseUrl + '/confirm-email/' + token

    currentKey = (emailConfig.provider or 'gmail') + ':' + emailConfig.user + ':' + (emailConfig.host or '')
    if !emailTransporter or emailTransporterKey != currentKey
      emailTransporterKey = currentKey
      emailTransporter = buildTransport(emailConfig)

    emailTransporter.sendMail {
      from: emailConfig.user
      to: user.email
      subject: 'UReport: Please confirm your email address'
      text: 'Please confirm your email: ' + confirmationUrl
      html: renderTemplate(user, confirmationUrl)
    },
    (error, info) ->
      if error
        logger.error error.message
      else
        logger.info 'Confirmation email sent: ' + info.response
      return
