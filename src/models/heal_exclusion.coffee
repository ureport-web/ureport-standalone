mongoose = require('mongoose')
Schema = mongoose.Schema

# A test that auto-heal must not open signals for.
# Scope is product + type + an optional lane scope (same shape as quarantine and notification rules;
# a blank scope means every lane of the product and type).
healExclusionSchema = new Schema(
  product: { type: String, required: true }
  type:    { type: String, required: true }

  # { version, team, browser, device, platform, platform_version, stage, extras }; blank = every lane
  scope: { type: Schema.Types.Mixed, default: {} }

  # What the rule looks at: the failure's error message, the test uid, or the test's file / path
  target:
    type: String
    enum: ['error', 'uid', 'path']
    required: true
  match:
    type: String
    enum: ['equals', 'contains', 'starts_with', 'ends_with', 'regex']
    required: true
  value: { type: String, required: true }

  reason:     { type: String, required: true }
  source:     { type: String, enum: ['user', 'agent'], default: 'user' }
  created_by: { type: String }
  created_at: { type: Date, default: Date.now }

  # The external signal that led an agent to add the rule
  source_signal_id: { type: Schema.Types.ObjectId, ref: 'HealSignal' }

  expires_at:      { type: Date }
  # Updated by auto-trigger each time the rule keeps failures from getting a signal
  last_matched_at: { type: Date }
  match_count:     { type: Number, default: 0 }
)

healExclusionSchema.index({ product: 1, type: 1 })

module.exports = mongoose.model('HealExclusion', healExclusionSchema)
