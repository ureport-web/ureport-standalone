mongoose = require('mongoose')
Schema = mongoose.Schema

rerunConfigSchema = new Schema(
  owner_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  name:          { type: String, default: '' }
  product:       { type: String, required: true }
  type:          { type: String, required: true }
  command:       { type: String, required: true }
  timeout_minutes: { type: Number, default: 10 }
  env:           { type: String, default: '' }
  repo: Schema(
    {
      mode:            { type: String, enum: ['checkout', 'local'], required: true }
      # checkout mode
      remote:          String
      base_branch:     String
      install_command: String
      # local mode
      path:            String
    }
    { _id: false }
  )
  created_at: { type: Date, default: Date.now }
  updated_at: { type: Date, default: Date.now }
)

# Index for efficient lookup by user/lane (not unique — multiple configs per lane are allowed)
rerunConfigSchema.index({ owner_user_id: 1, product: 1, type: 1 })

module.exports = mongoose.model('RerunConfig', rerunConfigSchema)
