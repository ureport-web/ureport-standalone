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
	failure: Schema.Types.Mixed,
	entity_type: { type: String, default: 'test' },
	ip: { type: String, default: '' }
)


DEFAULT_RETENTION_DAYS = 90

# TTL index — auto-purge after default retention period.
# Update dynamically via applyAuditTTL utility when system setting changes.
auditSchema.index({ create_at: 1 }, { expireAfterSeconds: DEFAULT_RETENTION_DAYS * 86400 })

# Compound indexes for admin/filter query performance
auditSchema.index({ username: 1, create_at: -1 })
auditSchema.index({ entity_type: 1, create_at: -1 })
auditSchema.index({ audit_type: 1, create_at: -1 })

module.exports = mongoose.model('audits', auditSchema)
module.exports.DEFAULT_RETENTION_DAYS = DEFAULT_RETENTION_DAYS
