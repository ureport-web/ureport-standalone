mongoose = require('mongoose')
Schema = mongoose.Schema

healSignalSchema = new Schema(
  # Lane context (from build at trigger time)
  product: { type: String, required: true }
  type:    { type: String, required: true }

  # Denormalized display fields (set at trigger time)
  test_uid:  { type: String }
  test_name: { type: String }
  test_file: { type: String }

  # References
  test_id:    { type: Schema.Types.ObjectId, ref: 'Test',  required: true }
  build_id:   { type: Schema.Types.ObjectId, ref: 'Build', required: true }
  playbook_id: { type: Schema.Types.ObjectId, ref: 'HealPlaybook' }  # optional for external-mode signals

  # Snapshot of playbook at dispatch time (immutable history)
  playbook_snapshot: Schema.Types.Mixed

  triggered_by: { type: String }  # "user:<username>" or "auto"
  triggered_at: { type: Date, default: Date.now }

  # Dispatch mode and external-consumer fields
  dispatch_mode: { type: String, default: 'agent' }  # 'agent' | 'external'
  external_ref:  { type: String }   # PR URL, ticket ID, or any ref the external system stores
  claimed_at:    { type: Date }
  claimed_by:    { type: String }   # identifier provided by external system on claim

  # Failure context at trigger time (immutable snapshot for external consumers)
  failure_snapshot: Schema(
    {
      error_message: String
      stack_trace:   String
    }
    { _id: false }
  )

  # Recent pass/fail history for this test uid in this lane (last 10 prior builds, newest first)
  lane_history: [Schema(
    {
      build_number: Number
      status:       String   # PASS | FAIL
      start_time:   Date
    }
    { _id: false }
  )]

  # Failure grouping (set when triggered by auto-heal)
  failure_group_id:   { type: String }           # hash of error fingerprint
  affected_test_ids:  [{ type: Schema.Types.ObjectId, ref: 'Test' }]
  affected_test_uids: [String]

  status:
    type: String
    enum: ['pending', 'queued', 'running', 'open', 'claimed', 'completed', 'pr_created', 'test_failed', 'bug_confirmed', 'error', 'timed_out', 'no_agent']
    default: 'pending'

  # Which agent handled this signal
  agent_id: { type: String }  # token hash prefix (first 16 chars)

  # AI cost tracking (populated from agent result message)
  ai: Schema(
    {
      provider:     String
      model:        String
      input_tokens: Number
      output_tokens:Number
    }
    { _id: false }
  )

  # pr_created outcome
  pr_url:       { type: String }
  branch:       { type: String }
  diff_summary: { type: String }
  test_output:  { type: String }

  # test_failed outcome
  attempted_diff: { type: String }
  agent_analysis: { type: String }

  # bug_confirmed outcome
  bug_report: Schema(
    {
      summary:            String
      reproduction_steps: String
      expected_behavior:  String
      actual_behavior:    String
      affected_component: String
      severity:           String  # P1 | P2 | P3
      evidence:           String
    }
    { _id: false }
  )

  error_detail:    { type: String }
  steps_completed: { type: Number, default: 0 }
  step_outputs:    Schema.Types.Mixed  # { "<step_id>": { ...output } }

  progress_log: [Schema(
    {
      received_at: { type: Date, default: Date.now }
      step_index:  Number
      step_id:     String
      status:      String
      message:     String
      output:      Schema.Types.Mixed
    }
    { _id: false }
  )]

  running_since: { type: Date }  # set when status first transitions to running
  completed_at:  { type: Date }

  # TTL: auto-delete old signals after 90 days
  ttl_expires_at: { type: Date, default: -> new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
)

healSignalSchema.index({ product: 1, type: 1, triggered_at: -1 })
healSignalSchema.index({ status: 1 })
healSignalSchema.index({ test_id: 1 })
healSignalSchema.index({ test_uid: 1 })
healSignalSchema.index({ ttl_expires_at: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('HealSignal', healSignalSchema)
