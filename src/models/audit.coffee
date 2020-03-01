mongoose = require('mongoose')
Schema = mongoose.Schema

auditSchema = new Schema(
	audit_type: {
		type: String,
		required: "Please provide a audit type.",
		trim: true
	},
	uid: {
		type: String,
		required: "Please provide a unique uid for audit.",
		trim: true
  	},
	product: {
		type: String,
		required: "Please provide a product for audit",
		trim: true
  	},
	type: {
		type: String,
		required: "Please provide a type for audit",
		trim: true
  	},
	create_at: { type: Date, default: Date.now },
	action: { type: String },
	user: {
		type: Schema.Types.ObjectId
	},
	username: String,
	origin: Schema.Types.Mixed,
	failure: Schema.Types.Mixed
)


module.exports = mongoose.model('audits', auditSchema)
