mongoose = require('mongoose')
Schema = mongoose.Schema

laneSchema = new Schema(
  {
    product:          { type: String }
    type:             { type: String }
    version:          { type: String }
    browser:          { type: String }
    platform:         { type: String }
    platform_version: { type: String }
    team:             { type: String }
    stage:            { type: String }
    device:           { type: String }
  }
  { _id: false }
)

presetSchema = new Schema(
  name:        { type: String, required: true, trim: true, unique: true }
  description: { type: String }
  lanes:       [laneSchema]
)

module.exports = mongoose.model('Preset', presetSchema)
