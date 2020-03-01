mongoose = require('mongoose')
Schema = mongoose.Schema
bcrypt = require('bcrypt')
SALT_WORK_FACTOR = 10;

userBillingSchema = new Schema(
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  username:{
    type: String,
    required: [true, 'Username is required'],
    maxlength: 20,
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
  role : {
    type: String,
    required: true,
    enum: ['admin', 'operator', 'reader']
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
				dashboard: Schema.Types.Mixed,
				report: Schema.Types.Mixed
			}, {_id: false})
)
userBillingSchema.pre 'save', (next) ->
  user = this
  # only hash the password if it has been modified (or is new)
  if !user.isModified('password')
    return next()
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

userBillingSchema.statics.find = (username, password, callback) ->
  User.findOne({username: username}).exec (err, user) ->
    if err
      callback(null)
    else if !user
      callback(null)
    callback user


UserBilling = mongoose.model('users_billing', userBillingSchema)
module.exports = UserBilling