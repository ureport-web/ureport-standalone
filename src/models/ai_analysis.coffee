mongoose = require('mongoose')
Schema = mongoose.Schema

aiAnalysisSchema = new Schema(
  test_id: { type: Schema.Types.ObjectId, index: true }
  uid: { type: String }
  product: { type: String }
  type: { type: String }
  input_hash: { type: String, index: true }
  result: Schema.Types.Mixed
  provider: { type: String }
  model: { type: String }
  human_caused_by: { type: String }
  created_at: { type: Date, default: Date.now }
)

aiAnalysisSchema.index({ uid: 1, product: 1, type: 1, created_at: -1 })
aiAnalysisSchema.index({ product: 1, type: 1, created_at: -1 })

module.exports = mongoose.model('AiAnalysis', aiAnalysisSchema)
