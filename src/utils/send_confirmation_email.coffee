nodemailer = require('nodemailer');
getSystemSetting = require('./getSystemSetting')
emailTransporter = undefined;

renderTemplate = (user, confirmationUrl) ->
  template  = '<div style="font-family:sans-serif;max-width:600px">'
  template += '<h3>Confirm Your Email Address</h3>'
  template += '<p>Hello <strong>' + user.username + '</strong>, thank you for registering with UReport.</p>'
  template += '<p>Please click the button below to confirm your email address and activate your account:</p>'
  template += '<p><a href="' + confirmationUrl + '" style="display:inline-block;padding:10px 20px;background:#1d6ae5;color:#fff;text-decoration:none;border-radius:4px">Confirm Email Address</a></p>'
  template += '<p>This link will expire in 24 hours.</p>'
  template += '<p>If you did not create an account, you can safely ignore this email.</p>'
  template += '</div>'
  return template

module.exports = (req, user, token) ->
  getSystemSetting req, "SYSTEM_SETTING", false, (setting) ->
    if !setting?.notification?.email?.user || !setting?.notification?.email?.password
      console.log("Email not configured, skipping confirmation email")
      return

    sender = setting.notification.email.user
    baseUrl = setting.notification.url or (req.protocol + '://' + req.get('host'))
    confirmationUrl = baseUrl + '/confirm-email/' + token

    if !emailTransporter
      console.log("creating confirmation email transporter")
      emailTransporter = nodemailer.createTransport(
        service: 'Gmail'
        auth:
          user: sender
          pass: setting.notification.email.password
      )

    emailTransporter.sendMail {
      from: sender
      to: user.email
      subject: 'UReport: Please confirm your email address'
      text: 'Please confirm your email: ' + confirmationUrl
      html: renderTemplate(user, confirmationUrl)
    },
    (error, info) ->
      if error
        console.log error
      else
        console.log 'Confirmation email sent: ' + info.response
      return
