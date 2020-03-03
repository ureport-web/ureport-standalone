mongoose = require('mongoose')
bcrypt = require('bcrypt')
Schema = mongoose.Schema
SALT_WORK_FACTOR = 10;

userSchema = new Schema(
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  username:{
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    maxlength: 20,
    minlength: 2
  },
  displayname:{
    type: String,
    maxlength:40,
    minlength: 2
  },
  email : {
    type: String,
    required: true,
    validate: {
        validator: (v) ->
          re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(v)
        ,
        message: 'Please fill a valid email address.'
    }
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: { 
      values: ['admin', 'operator', 'viewer'],
      message: "We only support role: [admin, operator, viewer]"
    }
  },
  position : {
    type: String
  },
  settings: Schema(
    {	
      language: {
        type: String,
        default: "en"
      },
      theme: {
        type: Schema.Types.Mixed,
        default: {
          name: 'bootstrap',
          type: 'light'
        }
      },
      dashboard: Schema(
          {
            isShowWidgetBorder : {
              type: Boolean,
              default: false
            },
            isExpandMenu : {
              type: Boolean,
              default: false
            },
            isWidgetBarOnHover : {
              type: Boolean,
              default: true
            }
          }, {_id: false}),
      report: Schema(
          {
            assignmentRI : {
              type: Number,
              default: 30
            },
            displaySelfAN : {
              type: Boolean,
              default: false
            },
            displaySearchAndFilterBoxInStep : {
              type: Boolean,
              default: true
            },
            status : Schema.Types.Mixed
          }, {_id: false})
    }, {_id: false})
)

userSchema.pre 'save', (next) ->
  user = this
  # only hash the password if it has been modified (or is new)
  if !user.isModified('password')
    return next()
  if !user.displayname
    user.displayname = user.username
  # generate a salt
  bcrypt.genSalt SALT_WORK_FACTOR, (err, salt) ->
    if err
      return next(err)
    # hash the password along with our new salt
    bcrypt.hash user.password, salt, (err, hash) ->
      if err
        return next(err)
      # override the cleartext password with the hashed one
      user.password = hash
      next()

userSchema.statics.updateOne = (user, payload) ->
  if(payload)
    if(payload.username)
      user.username = payload.username
    if(payload.email)
      user.email = payload.email
    if(payload.role)
      user.role = payload.role
    if(payload.displayname)
      user.displayname = payload.displayname
    if(payload.position)
      user.position = payload.position

    if(payload.settings && payload.settings.language)
      user.settings.language = payload.settings.language
    if(payload.settings && payload.settings.theme)
      user.settings.theme  = payload.settings.theme 
    if(payload.settings && payload.settings.report)
      user.settings.report = payload.settings.report
    if(payload.settings && payload.settings.dashboard)
      user.settings.dashboard = payload.settings.dashboard

userSchema.statics.findByName = (username, callback) ->
  User.findOne({username: username}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    else
      callback user

userSchema.statics.findById = (id, callback) ->
  User.findOne({_id: id}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    else
      callback user

userSchema.statics.updateLanguage = (id, payload, callback) ->
  User.findOne({_id: id}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    else
      if(!user.settings)
        user.settings = { }

      user.settings.language = payload.language
      callback user

userSchema.statics.updateTheme = (id, payload, callback) ->
  User.findOne({_id: id}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    else
      if(!user.settings)
        user.settings = { }

      user.settings.theme = payload.theme
      callback user

userSchema.statics.updateDashboardSetting = (id, payload, callback) ->
  User.findOne({_id: id}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    else
      if(!user.settings)
        user.settings = { }

      user.settings.dashboard = payload.dashboard
      callback user

userSchema.statics.updateReportSetting = (id, payload, callback) ->
  User.findOne({_id: id}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    else
      if(!user.settings)
        user.settings = { }

      user.settings.report = payload.report
      callback user

User = mongoose.model('users', userSchema)
module.exports = User