mongoose = require('mongoose')
Schema = mongoose.Schema

quarantineHistorySchema = new Schema(
  uid:            { type: String, required: true, trim: true },
  product:        { type: String, required: true, trim: true },
  type:           { type: String, required: true, trim: true },
  scope: {
    version:          { type: String, default: '' },
    team:             { type: String, default: '' },
    browser:          { type: String, default: '' },
    device:           { type: String, default: '' },
    platform:         { type: String, default: '' },
    platform_version: { type: String, default: '' },
    stage:            { type: String, default: '' },
    extras_key:       { type: String, default: '' }
  },
  rule_id:        String,
  rule_name:      String,
  triggered_mode: String,
  fail_snapshot:  Number,
  build_snapshot: Number,
  quarantined_at: Date,
  resolved_at:    Date,
  resolved_by:    { type: String, enum: ['auto', 'manual', 'exempt'], default: 'manual' },
  cycle:          { type: Number, default: 1 }
)

quarantineHistorySchema.index({ uid: 1, product: 1, type: 1 })
quarantineHistorySchema.index({ product: 1, type: 1, quarantined_at: -1 })

module.exports = mongoose.model('QuarantineHistory', quarantineHistorySchema)
