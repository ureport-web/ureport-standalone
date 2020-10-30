mongoose = require('mongoose')
async = require("async")
Schema = mongoose.Schema

dependencyRelationSchema = new Schema(
	type: {
		type: String,
		required: "Please provide a type.",
		trim: true
  	},
	source: {
		type: String,
		required: "Please provide a source.",
		trim: true
  	},
	destination: {
		type: String,
		required: "Please provide a destination.",
		trim: true
  	}
)

dependencyRelationSchema.statics.update = (relation, payload) ->
	if(payload)
		if(payload.type)
			relation.type = payload.type
		if(payload.source)
			 relation .source = payload.source
		if(payload.destination)
			relation.destination = payload.destination
module.exports = mongoose.model('DependencyRelation', dependencyRelationSchema)
