mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId;
Schema = mongoose.Schema

sessionSchema = new Schema(
	username:String,
	session:{
		cookie:Schema.Types.Mixed,
		username:String
	},
	expires: Date,
)

sessionSchema.statics.poll = (username) ->
  Session.findOne(session: $regex: username).exec (err, sess) ->
    #already have a valid session
    if sess
      console.warn 'User already has a session'
      return 'True'
    else
      console.warn 'A session has to be created for the user'
      return 'False'
  

Session = mongoose.model('sessions', sessionSchema);
module.exports = Session
