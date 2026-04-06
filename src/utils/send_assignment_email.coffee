nodemailer = require('nodemailer');
User = require('../models/user')
getSystemSetting = require('./getSystemSetting')
emailTransporter = undefined;

renderTemplate = (req, user, assignment) ->
  assignedBy = req.user.username
  template  = '<div style="font-family:sans-serif;max-width:600px">'
  template += '<h3>New Test Assignment</h3>'
  template += '<p>Hello <strong>' + user.username + '</strong>, <strong>' + assignedBy + '</strong> has assigned you a test.</p>'
  if assignment
    testUrl = assignment.test_url or (req.headers.origin + '/launches?product=' + assignment.product + '&type=' + assignment.type + '&search=' + encodeURIComponent(assignment.uid))
    template += '<table style="border-collapse:collapse;width:100%">'
    template += '<tr><td style="padding:6px;font-weight:bold">Test UID</td><td style="padding:6px">' + assignment.uid + '</td></tr>'
    template += '<tr><td style="padding:6px;font-weight:bold">Product</td><td style="padding:6px">' + assignment.product + '</td></tr>'
    template += '<tr><td style="padding:6px;font-weight:bold">Type</td><td style="padding:6px">' + assignment.type + '</td></tr>'
    if assignment.failure?.error_message
      template += '<tr><td style="padding:6px;font-weight:bold">Failure</td><td style="padding:6px;color:red">' + assignment.failure.error_message + '</td></tr>'
    template += '</table>'
    template += '<p><a href="' + testUrl + '" style="display:inline-block;padding:8px 16px;background:#1d6ae5;color:#fff;text-decoration:none;border-radius:4px">View Test</a></p>'
    if assignment.failure?.stack_trace
      template += '<details><summary>Stack Trace</summary><pre style="font-size:0.8em;background:#f5f5f5;padding:8px;overflow:auto">' + assignment.failure.stack_trace + '</pre></details>'
  template += '</div>'
  return template

prepareSendEmail = (req, res, user,assignment) ->
  if(user.email)
    sendemailOnFinish = ->
      res.removeListener('finish', sendemailOnFinish)
      getSystemSetting(req, "SYSTEM_SETTING", false,
        (setting) ->

          if(!setting.notification?.email?.user || !setting.notification?.email?.password)
            console.log("Email not configured, skipping assignment email")
            return

          sender = setting.notification.email.user

          if(!emailTransporter)
            console.log("creating transporter")
            emailTransporter = nodemailer.createTransport(
              service: 'Gmail'
              auth:
                user: sender
                pass: setting.notification.email.password
            )

          emailTransporter.sendMail {
            from: sender
            to: user.email
            subject: 'UReport: A new test has been assigned to you'
            text: 'New Test Assignment'
            html: renderTemplate(req,user,assignment)
          },
          (error, info) ->
            if error
              console.log error
            else
              console.log 'Message sent: ' + info.response
            return
      )
    res.on('finish', sendemailOnFinish);


module.exports = (req, res, assignee, assignment) ->
  if(assignee.user)
    User.findById assignee.user, (user) ->
        if (!user)
          return
        else
          prepareSendEmail(req,res,user,assignment)
  if(!assignee.user && assignee.username)
    User.findByName assignee.username, (user) ->
        if (!user)
          return
        else
          prepareSendEmail(req,res,user,assignment)
