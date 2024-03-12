mongoose = require('mongoose')
Schema = mongoose.Schema

testRelationSchema = new Schema({
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
	customs: Schema.Types.Mixed,
	dependencies: [Schema({
		key: String
	}, {_id: true})]
})


module.exports = testRelationSchema