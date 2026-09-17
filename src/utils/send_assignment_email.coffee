nodemailer     = require('nodemailer')
User           = require('../models/user')
getSystemSetting = require('./getSystemSetting')
buildTransport = require('./email_transport')
logger         = require('./logger')

emailTransporter    = undefined
emailTransporterKey = undefined

renderTemplate = (req, user, assignment) ->
  assignedBy = req.user.username

  testUrl = if assignment
    assignment.test_url or (req.headers.origin + '/launches?product=' + assignment.product + '&type=' + assignment.type + '&search=' + encodeURIComponent(assignment.uid))
  else
    ''

  detailRow = (label, value) ->
    '<tr>' +
      '<td style="padding:7px 0;color:#64748b;font-size:13px;width:150px;vertical-align:top">' + label + '</td>' +
      '<td style="padding:7px 0;color:#1e293b;font-size:13px;font-weight:500">' + value + '</td>' +
    '</tr>'

  detailRows = ''
  if assignment
    detailRows += detailRow('Test UID', assignment.uid)
    detailRows += detailRow('Product', assignment.product)
    detailRows += detailRow('Type', assignment.type)
    if assignment.failure?.error_message
      detailRows +=
        '<tr>' +
          '<td style="padding:7px 0;color:#64748b;font-size:13px;width:150px;vertical-align:top">Failure</td>' +
          '<td style="padding:7px 0;color:#dc2626;font-size:13px;font-weight:500">' + assignment.failure.error_message + '</td>' +
        '</tr>'

  stackTrace = if assignment?.failure?.stack_trace
    '<div style="margin-top:16px">' +
      '<p style="margin:0 0 6px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">STACK TRACE</p>' +
      '<pre style="margin:0;font-size:11px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:12px;overflow:auto;color:#334155">' + assignment.failure.stack_trace + '</pre>' +
    '</div>'
  else
    ''

  ctaButton = if testUrl
    '<a href="' + testUrl + '" style="display:inline-block;padding:10px 22px;background:#1d6ae5;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">View Test →</a>'
  else
    ''

  '<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">' +
  '<tr><td align="center">' +

  '<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px">' +

  '<tr><td style="background:#1e293b;padding:18px 24px">' +
    '<span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px">UReport</span>' +
    '<span style="color:#94a3b8;font-size:13px;margin-left:12px">Test Assignment</span>' +
  '</td></tr>' +

  '<tr><td style="padding:20px 24px;border-bottom:1px solid #f1f5f9">' +
    '<p style="margin:0 0 4px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">ASSIGNED BY</p>' +
    '<p style="margin:4px 0 0;color:#0f172a;font-size:15px;font-weight:600">' + assignedBy + '</p>' +
  '</td></tr>' +

  (if detailRows
    '<tr><td style="padding:20px 24px;border-bottom:1px solid #f1f5f9">' +
      '<p style="margin:0 0 10px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">TEST DETAILS</p>' +
      '<table width="100%" cellpadding="0" cellspacing="0">' + detailRows + '</table>' +
      stackTrace +
    '</td></tr>'
  else '') +

  (if ctaButton
    '<tr><td style="padding:20px 24px">' + ctaButton + '</td></tr>'
  else '') +

  '<tr><td style="padding:12px 24px;background:#f8fafc;border-top:1px solid #e2e8f0">' +
    '<p style="margin:0;color:#94a3b8;font-size:11px">UReport · You are receiving this because a test was assigned to you.</p>' +
  '</td></tr>' +

  '</table>' +
  '</td></tr></table>' +
  '</body>'

prepareSendEmail = (req, res, user, assignment) ->
  if user.email
    sendemailOnFinish = ->
      res.removeListener('finish', sendemailOnFinish)
      getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
        emailConfig = setting?.notification?.email
        if !emailConfig?.user
          logger.info("Email not configured, skipping assignment email")
          return
        if !emailConfig.password and (emailConfig.provider or 'gmail') != 'smtp'
          logger.info("Email password not configured, skipping assignment email")
          return

        currentKey = (emailConfig.provider or 'gmail') + ':' + emailConfig.user + ':' + (emailConfig.host or '')
        if !emailTransporter or emailTransporterKey != currentKey
          emailTransporterKey = currentKey
          emailTransporter = buildTransport(emailConfig)

        emailTransporter.sendMail {
          from: emailConfig.user
          to: user.email
          subject: 'UReport: A new test has been assigned to you'
          text: 'New Test Assignment'
          html: renderTemplate(req, user, assignment)
        },
        (error, info) ->
          if error
            logger.error error.message
          else
            logger.info 'Message sent: ' + info.response
          return
    res.on('finish', sendemailOnFinish)


module.exports = (req, res, assignee, assignment) ->
  if assignee.user
    User.findById assignee.user, (user) ->
      if !user then return
      prepareSendEmail(req, res, user, assignment)
  if !assignee.user and assignee.username
    User.findByName assignee.username, (user) ->
      if !user then return
      prepareSendEmail(req, res, user, assignment)
