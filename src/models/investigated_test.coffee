mongoose = require('mongoose')
async = require("async")
Schema = mongoose.Schema

invTestSchema = new Schema(
	uid: {
		type: String,
		required: "Please provide a unique id for a test.",
		trim: true
  	},
	product: {
		type: String,
		required: "Please provide a product for a test.",
		trim: true
  	},
	type: {
		type: String,
		required: "Please provide a type for a test.",
		trim: true
  	},
	user: {
		type: Schema.Types.ObjectId
	},
	customize_state: Schema.Types.Mixed,
	create_at: { type: Date, default: Date.now },
	caused_by: { type: String, default: "DEFECT" },
	tracking: Schema.Types.Mixed,
	failure: Schema.Types.Mixed,
	origin: Schema.Types.Mixed,
	comments: [Schema({
		userId: Schema.Types.ObjectId,
		user: String,
		time: Date,
		message: String,
		isDeleted: { type: Boolean, default: false }
	}, {_id: true})],
	configuration: Schema({
		similarity: Schema.Types.Mixed
	}, {_id: false})
)

invTestSchema.statics.buildExcludeFieldQuery = (rs, payload) ->
	async.each(payload,
		(item,callback) ->
			rs[item]=0
		(err) ->
	)

invTestSchema.statics.addComment = (inv, payload) ->
	if(payload)
		if(payload.comment)
			if(inv.comments)
				inv.comments = inv.comments.concat(payload.comment)
			else
				inv.comments = [payload.comment]

invTestSchema.statics.updateComment = (inv, payload) ->
	if(payload)
		if(payload.comments)
			if(inv.comments)
				inv.comments = payload.comments
			else
				inv.comments = payload.comments

module.exports = mongoose.model('InvestigatedTest', invTestSchema)
