mongoose = require('mongoose')
Schema = mongoose.Schema

quarantinedTestSchema = new Schema(
  uid: {
    type: String,
    required: "Please provide a uid.",
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
  rule_id: String,
  rule_name: String,
  quarantined_at: { type: Date, default: Date.now },
  fail_snapshot: Number,
  build_snapshot: Number,
  is_active: { type: Boolean, default: true },
  is_exempt: { type: Boolean, default: false },
  resolved_at: { type: Date, default: null }
)

quarantinedTestSchema.index({ uid: 1, product: 1, type: 1 }, { unique: true })
quarantinedTestSchema.index({ resolved_at: 1 }, { expireAfterSeconds: 7776000 })

module.exports = mongoose.model('QuarantinedTest', quarantinedTestSchema)
