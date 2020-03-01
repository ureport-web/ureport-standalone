mongoose = require('mongoose')
async = require("async")
Schema = mongoose.Schema

buildAnalyticSchema = new Schema(
	build: {
		type: Schema.Types.ObjectId,
  	},
	investigated_test: {
		type: Schema.Types.ObjectId,
  	},
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
	create_at: { type: Date, default: Date.now },
	analytics: Schema.Types.Mixed,
)


module.exports = mongoose.model('InvestigatedTest', buildAnalyticSchema)
