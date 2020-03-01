mongoose = require('mongoose')
Schema = mongoose.Schema

assignmentSchema = new Schema(
	product: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true
	},
	username: String,
	uid: {
		type: String,
		required: true,
		index: true,
		trim: true
  	},
	state: { type: String, required: true, default: 'OPEN'},
	failure: { type: Schema.Types.Mixed,required: true }
	assign_at: { type: Date, default: Date.now },
	comments: [Schema({
		userId: Schema.Types.ObjectId,
		user: String,
		time: Date,
		message: String,
		isDeleted: { type: Boolean, default: false }
	}, {_id: true})]
)
assignmentSchema.statics.update = (assignment, payload) ->
	if(payload)
		if(payload.comments)
			assignment.comments = payload.comments
		if(payload.username)
		  assignment.username = payload.username
		if(payload.user)
			assignment.user = payload.user
		if(payload.state)
		  assignment.state = payload.state
		if(payload.failure)
		  assignment.failure = payload.failure

assignmentSchema.statics.appendAssignment = (assignment, payload) ->
	if(payload)
		if(payload.comments)
			assignment.comments = assignment.comments.concat(payload.comments)
		if(payload.username)
			assignment.username = payload.username
		if(payload.user)
			assignment.user = payload.user
		if(payload.assign_at)
			assignment.assign_at = payload.assign_at
		else
			assignment.assign_at = Date.now()

assignmentSchema.statics.addComment = (assignment, payload) ->
	if(payload)
		if(payload.comment)
			if(assignment.comments)
				assignment.comments = assignment.comments.concat(payload.comment)
			else
				assignment.comments = [payload.comment]

assignmentSchema.statics.updateComment = (assignment, payload) ->
	if(payload)
		if(payload.comments)
			if(assignment.comments)
				assignment.comments = payload.comments
			else
				assignment.comments = payload.comments

assignmentSchema.statics.hasSameFailure = (new_assignment, exist_assignment, callback) ->
	if(new_assignment.failure && exist_assignment.failure)
		if(new_assignment.failure.token != null  && exist_assignment.failure.token != null )
			callback(null, new_assignment.failure.token == exist_assignment.failure.token)
		else if(new_assignment.failure.reason != null && exist_assignment.failure.reason != null )
			callback(null,  new_assignment.failure.reason == exist_assignment.failure.reason)
		else
			callback(null, false)
	else
		callback(null, false)

module.exports = mongoose.model('assignments', assignmentSchema)