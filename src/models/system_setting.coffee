mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId;
async = require("async")
Schema = mongoose.Schema

systemSettingSchema = new Schema(
	name: {
		type: String
	},
	analysisSinceDay: {
		type: Number,
		default: 30
	},
	suggested_issue_types: Schema.Types.Mixed,
	notification: Schema.Types.Mixed,
	issue_tracking: Schema.Types.Mixed,
	tc_management: Schema.Types.Mixed,
)

systemSettingSchema.statics.updateSetting = (setting, payload) ->
	if(payload)
		if(payload.analysisSinceDay)
			setting.analysisSinceDay = payload.analysisSinceDay
		if(payload.suggested_issue_types)
			setting.suggested_issue_types = payload.suggested_issue_types
		if(payload.notification)
			setting.notification = payload.notification
		if(payload.issue_tracking)
			setting.issue_tracking = payload.issue_tracking
		if(payload.tc_management)
			setting.tc_management = payload.tc_management
module.exports = mongoose.model('SystemSetting', systemSettingSchema)
