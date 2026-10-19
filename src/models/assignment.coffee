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
	test_url: String
	assign_at: { type: Date, default: Date.now },
	assigned_by_user: Schema.Types.ObjectId
	assigned_by_username: String
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
		if(payload.assigned_by_user)
			assignment.assigned_by_user = payload.assigned_by_user
		if(payload.assigned_by_username)
			assignment.assigned_by_username = payload.assigned_by_username
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
		else if(new_assignment.failure.error_message != null && exist_assignment.failure.error_message != null )
			callback(null,  new_assignment.failure.error_message == exist_assignment.failure.error_message)
		else
			callback(null, false)
	else
		callback(null, false)

module.exports = mongoose.model('assignments', assignmentSchema)