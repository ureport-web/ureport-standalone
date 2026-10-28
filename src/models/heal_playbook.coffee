mongoose = require('mongoose')
Schema = mongoose.Schema

healPlaybookSchema = new Schema(
  name: { type: String, required: true }
  mode:
    type: String
    enum: ['guided', 'agent_delegation']
    default: 'guided'
  active: { type: Boolean, default: true }
  # guided mode: fixed 4-stage pipeline config
  # {
  #   checkout:  { enabled, branchPrefix, baseBranch }
  #   aiFix:     { enabled, instructions }
  #   verify:    { enabled }
  #   createPr:  { enabled, titleTemplate, baseBranch }
  # }
  pipeline: Schema.Types.Mixed
  # agent_delegation mode: goal prompt sent to the AI CLI tool
  prompt: { type: String }
  # agent_delegation mode: which CLI provider to use ('claude-cli' | 'gemini-cli')
  provider: { type: String }
  created_at: { type: Date, default: Date.now }
  updated_at: { type: Date, default: Date.now }
)

module.exports = mongoose.model('HealPlaybook', healPlaybookSchema)
