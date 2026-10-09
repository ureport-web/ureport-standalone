nodemailer     = require('nodemailer')
User           = require('../models/user')
getSystemSetting = require('./getSystemSetting')
buildTransport = require('./email_transport')
logger         = require('./logger')

emailTransporter    = undefined
emailTransporterKey = undefined

renderTemplate = (baseUrl, req, user, assignments) ->
  sentBy = req.user.username

  testRows = assignments.map((a) ->
    testUrl = if baseUrl
      baseUrl.replace(/\/$/, '') + '/launches?product=' + encodeURIComponent(a.product) + '&type=' + encodeURIComponent(a.type) + '&search=' + encodeURIComponent(a.uid)
    else
      ''
    '<tr>' +
      '<td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top">' +
        '<a href="' + testUrl + '" style="color:#1d6ae5;text-decoration:none;font-size:12px;font-weight:600;word-break:break-all">' + a.uid + '</a>' +
        '<br><span style="color:#94a3b8;font-size:11px">' + a.product + ' / ' + a.type + '</span>' +
      '</td>' +
    '</tr>'
  ).join('')

  count = assignments.length

  '<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif">' +
  '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">' +
  '<tr><td align="center">' +

  '<table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;max-width:580px">' +

  '<tr><td style="background:#1e293b;padding:18px 24px">' +
    '<span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px">UReport</span>' +
    '<span style="color:#94a3b8;font-size:13px;margin-left:12px">New Test Assignment</span>' +
  '</td></tr>' +

  '<tr><td style="padding:16px 24px;border-bottom:1px solid #f1f5f9">' +
    '<p style="margin:0 0 2px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">ASSIGNED BY</p>' +
    '<p style="margin:0 0 8px;color:#0f172a;font-size:14px;font-weight:600">' + sentBy + '</p>' +
    '<p style="margin:0;color:#475569;font-size:13px;line-height:1.5">You have been assigned ' + count + ' test(s) to investigate. Please review and update the status when resolved.</p>' +
  '</td></tr>' +

  '<tr><td style="padding:20px 24px;border-bottom:1px solid #f1f5f9">' +
    '<p style="margin:0 0 12px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">ASSIGNED TESTS (' + count + ')</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:4px;border-collapse:collapse">' +
      '<thead>' +
        '<tr style="background:#f8fafc">' +
          '<th style="padding:7px 12px;text-align:left;font-size:11px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0">Test</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' + testRows + '</tbody>' +
    '</table>' +
  '</td></tr>' +

  '<tr><td style="padding:12px 24px;background:#f8fafc;border-top:1px solid #e2e8f0">' +
    '<p style="margin:0;color:#94a3b8;font-size:11px">UReport · You have been assigned these tests for investigation.</p>' +
  '</td></tr>' +

  '</table>' +
  '</td></tr></table>' +
  '</body>'


sendToUser = (req, res, user, assignments, done) ->
  getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
    emailConfig = setting?.notification?.email
    if !emailConfig?.user
      return done()
    if !emailConfig.password and (emailConfig.provider or 'gmail') != 'smtp'
      return done()

    currentKey = (emailConfig.provider or 'gmail') + ':' + emailConfig.user + ':' + (emailConfig.host or '')
    if !emailTransporter or emailTransporterKey != currentKey
      emailTransporterKey = currentKey
      emailTransporter = buildTransport(emailConfig)

    baseUrl = setting?.notification?.url or (req.protocol + '://' + req.get('host'))

    emailTransporter.sendMail {
      from: emailConfig.user
      to: user.email
      subject: 'UReport: ' + assignments.length + ' test(s) assigned to you'
      text: 'New Test Assignments'
      html: renderTemplate(baseUrl, req, user, assignments)
    },
    (error, info) ->
      if error
        logger.error error.message
      else
        logger.info 'Bulk assignment email sent to ' + user.email + ': ' + info.response
      done()


# groupedAssignments: [{ userId, username, items: [assignment, ...] }]
module.exports = (req, res, groupedAssignments, done) ->
  async = require('async')
  async.eachSeries groupedAssignments, (group, next) ->
    if group.userId
      User.findById group.userId, (user) ->
        if !user or !user.email then return next()
        sendToUser(req, res, user, group.items, next)
    else if group.username
      User.findByName group.username, (user) ->
        if !user or !user.email then return next()
        sendToUser(req, res, user, group.items, next)
    else
      next()
  , ->
    if done then done()
