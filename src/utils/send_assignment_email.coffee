nodemailer = require('nodemailer');
User = require('../models/user')
getSystemSetting = require('./getSystemSetting')
emailTransporter = undefined;

renderTemplate = (req, user, assignment) -> 
  template = '<p>Hello, <strong>' + user.username + '</strong></p><br> <b>' + req.user.username + '</b> has assinged you a new test.</p>'
  if(assignment)
    template += '<br>Test Case ID: <strong>' + assignment.uid + '</strong><br><p>Failure Reason: <span style="color:red">'+assignment.failure.error_message+'</span></p>'
    template += '<br><pre>' + assignment.failure.stack_trace + '</pre>'
    template += '<br> -----------------------------------------------------------------------------------------------------'
    
    template = '<p>Bonjour, <strong>' + user.username + '</strong></p><br> <b>' + req.user.username + '</b> has assinged you a new test.</p>'
    template += '<br>Test Case ID: <strong>' + assignment.uid + '</strong><br><p>Failure Reason: <span style="color:red">'+assignment.failure.error_message+'</span></p>'
    template += '<br><pre>' + assignment.failure.stack_trace + '</pre>'
  return template

prepareSendEmail = (req, res, user,assignment) ->
  if(user.email)
    sendemailOnFinish = ->
      res.removeListener('finish', sendemailOnFinish)
      getSystemSetting(req, "SYSTEM_SETTING", false,
        (setting) ->
          
          sender = 'ureportnoreply@gmail.com'
          service = 'Gmail'
          if(setting.notification.email.user)
            sender = setting.notification.email.user
          if(setting.notification.email.user)
            service = setting.notification.email.service
          
          if(!emailTransporter)
            console.log("creating transporter")
            emailTransporter = nodemailer.createTransport(
              service: service
              auth:
                user: sender
                pass: setting.notification.email.password
            )

          emailTransporter.sendMail {
            from: sender
            to: user.email
            subject: 'UReport: A new test has been assigned to you/Un nouveau test vous a été assigné'
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
          prepareSendEmail(req,res,user)
  if(!assignee.user && assignee.username)
    User.findByName assignee.username, (user) ->
        if (!user)
          return
        else
          prepareSendEmail(req,res,user,assignment)