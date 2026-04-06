nodemailer = require('nodemailer');
getSystemSetting = require('./getSystemSetting')
emailTransporter = undefined;

renderTemplate = (recipientUsers, build, statusSummary, ruleNames, frontendUrl) ->
  product          = build.product or ''
  type             = build.type or ''
  buildId          = build._id or ''
  team             = build.team or ''
  version          = build.version or ''
  browser          = build.browser or ''
  device           = build.device or ''
  platform         = build.platform or ''
  platform_version = build.platform_version or ''
  stage            = build.stage or ''

  baseUrl = (frontendUrl or '').replace(/\/$/, '')
  params  = 'product=' + encodeURIComponent(product) + '&type=' + encodeURIComponent(type) + '&buildId=' + buildId
  if team             then params += '&team='             + encodeURIComponent(team)
  if browser          then params += '&browser='          + encodeURIComponent(browser)
  if device           then params += '&device='           + encodeURIComponent(device)
  if platform         then params += '&platform='         + encodeURIComponent(platform)
  if platform_version then params += '&platform_version=' + encodeURIComponent(platform_version)
  viewUrl = baseUrl + '/launches?' + params

  pass    = statusSummary.pass    or 0
  fail    = statusSummary.fail    or 0
  skip    = statusSummary.skip    or 0
  total   = statusSummary.total   or 0

  td = (label, value, color) ->
    colorStyle = if color then ';color:' + color else ''
    '<tr><td style="padding:6px;font-weight:bold' + colorStyle + '">' + label + '</td><td style="padding:6px">' + value + '</td></tr>'

  ruleList  = if Array.isArray(ruleNames) then ruleNames else [ruleNames]
  rulesHtml = ruleList.map((r) -> '<li>' + r + '</li>').join('')

  template  = '<div style="font-family:sans-serif;max-width:600px">'
  template += '<h3>Build Complete — Notification Rule Triggered</h3>'
  if ruleList.length > 1
    template += '<p>Rules triggered:<ul>' + rulesHtml + '</ul></p>'
  else
    template += '<p>Rule: <strong>' + ruleList[0] + '</strong></p>'
  template += '<table style="border-collapse:collapse;width:100%">'
  template += td('Product', product, '')
  template += td('Type', type, '')
  template += td('Build', (build.build or buildId), '')
  if team             then template += td('Team', team, '')
  if version          then template += td('Version', version, '')
  if browser          then template += td('Browser', browser, '')
  if device           then template += td('Device', device, '')
  if platform         then template += td('Platform', platform, '')
  if platform_version then template += td('Platform Version', platform_version, '')
  if stage            then template += td('Stage', stage, '')
  template += '<tr><td colspan="2" style="padding:6px;border-top:1px solid #eee"></td></tr>'
  template += td('Total', total, '')
  template += td('Pass', pass, 'green')
  template += td('Fail', fail, 'red')
  template += td('Skip', skip, 'orange')
  template += '</table>'
  if baseUrl
    template += '<p><a href="' + viewUrl + '" style="display:inline-block;padding:8px 16px;background:#1d6ae5;color:#fff;text-decoration:none;border-radius:4px">View Results</a></p>'
  template += '</div>'
  return template

module.exports = (req, res, recipientUsers, build, statusSummary, ruleNames) ->
  return unless recipientUsers?.length

  getSystemSetting(req, "SYSTEM_SETTING", false,
    (setting) ->
      if(!setting.notification?.email?.user || !setting.notification?.email?.password)
        console.log("Email not configured, skipping build notification email")
        return

      sender = setting.notification.email.user

      if(!emailTransporter)
        console.log("creating transporter for build notification email")
        emailTransporter = nodemailer.createTransport(
          service: 'Gmail'
          auth:
            user: sender
            pass: setting.notification.email.password
        )

      ruleList   = if Array.isArray(ruleNames) then ruleNames else [ruleNames]
      html       = renderTemplate(recipientUsers, build, statusSummary, ruleList, setting.notification?.url)
      ruleLabel  = if ruleList.length > 1 then ruleList.length + ' rules triggered' else 'rule "' + ruleList[0] + '" triggered'
      subject    = 'UReport: ' + (build.product or '') + ' / ' + (build.type or '') + ' — build complete — ' + ruleLabel

      recipientUsers.forEach (user) ->
        return unless user.email
        emailTransporter.sendMail {
          from: sender
          to: user.email
          subject: subject
          text: 'Build notification: ' + ruleLabel
          html: html
        },
        (error, info) ->
          if error
            console.log error
          else
            console.log 'Build notification sent to ' + user.email + ': ' + info.response
          return
  )
