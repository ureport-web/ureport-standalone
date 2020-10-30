mongoose = require('mongoose')
async = require("async")
Schema = mongoose.Schema

dependencySchema = new Schema(
	key: {
		type: String,
		required: "Please provide a key.",
		trim: true,
		unique:true
  	},
	name: {
		type: String,
		required: "Please provide a name.",
		trim: true
  	},
	maintainer: {
		type: String,
		required: "Please provide a maintainer.",
		trim: true
  	}
)

dependencySchema.statics.update = (relation, payload) ->
	if(payload)
		if(payload.key)
			relation.key = payload.key
		if(payload.name)
			relation.name = payload.name
		if(payload.maintainer)
			relation.maintainer = payload.maintainer
module.exports = mongoose.model('Dependency', dependencySchema)
