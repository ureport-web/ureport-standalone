mongoose = require('mongoose')
Schema = mongoose.Schema

rerunSignalSchema = new Schema(
  owner_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  product:       { type: String, required: true }
  type:          { type: String, required: true }
  test_id:       { type: Schema.Types.ObjectId, ref: 'Test' }
  test_uid:      String
  test_name:     String
  test_file:     String
  triggered_by:  String  # "user:<username>"
  triggered_at:  { type: Date, default: Date.now }
  status:
    type: String
    enum: ['pending', 'queued', 'running', 'passed', 'failed', 'error', 'timed_out', 'no_agent']
    default: 'pending'
  agent_id:     String   # agent token name
  command:      String   # resolved command that ran
  output:       String   # stdout + stderr (trimmed)
  exit_code:    Number
  job_snapshot: Schema.Types.Mixed  # full job payload stored for re-dispatch
  running_since: { type: Date }     # set when status first transitions to running
  completed_at:  Date
  # TTL: auto-delete old signals after 90 days
  ttl_expires_at: { type: Date, default: -> new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
)

rerunSignalSchema.index({ owner_user_id: 1, triggered_at: -1 })
rerunSignalSchema.index({ test_id: 1, triggered_at: -1 })
rerunSignalSchema.index({ test_uid: 1, triggered_at: -1 })
rerunSignalSchema.index({ status: 1 })
rerunSignalSchema.index({ ttl_expires_at: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('RerunSignal', rerunSignalSchema)
