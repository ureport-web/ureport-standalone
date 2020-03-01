mongoose = require('mongoose')
async = require("async")
Schema = mongoose.Schema

testRelationSchema = new Schema(
	uid: {
		type: String,
		required: "Please provide a unique id.",
		trim: true
  	},
	product: {
		type: String,
		required: "Please provide a product.",
		trim: true
  	},
	type: {
		type: String,
		required: "Please provide a type.",
		trim: true
  	},
	file: String,
	path: String,
	components : Schema.Types.Mixed,
	teams : Schema.Types.Mixed,
	tags : Schema.Types.Mixed,
	comments: Schema.Types.Mixed,
	customs: Schema.Types.Mixed
)

testRelationSchema.statics.buildExcludeFieldQuery = (rs, payload) ->
	async.each(payload,
		(item,callback) ->
			rs[item]=0
		(err) ->
	)

testRelationSchema.statics.update = (relation, payload) ->
	if(payload)
		if(payload.path)
			relation.path = payload.path
		if(payload.file)
			relation.file = payload.file
		if(payload.components)
			relation.components = payload.components
		if(payload.teams)
			relation.teams = payload.teams
		if(payload.tags)
			relation.tags = payload.tags
		if(payload.comments)
			relation.comments = payload.comments
		if(payload.customs)
			relation.customs = payload.customs
module.exports = mongoose.model('TestRelation', testRelationSchema)
