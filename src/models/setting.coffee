mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId;
async = require("async")
Schema = mongoose.Schema

settingSchema = new Schema(
	product: {
		type: String,
		required: "Please provide a product name.",
		trim: true
  	},
	type: {
		type: String,
		required: "Please provide a setting type.",
		trim: true
  	},
	description: String,
	issue_type: Schema.Types.Mixed,
	product_line: Schema.Types.Mixed,
	component_filter: Schema.Types.Mixed,
	relations_filter: Schema.Types.Mixed,
	custom_execution_script: [Schema(
		{	
			name: {
				type: String
			},
			type: {
				type: String
			},
			script: {
				type: String
			}
		}, 
		{_id: true}
	)],
	investigated_setting: Schema(
		{	
			sharePL: [Schema(
				{	
					product: {
						type: String
					},
					type: {
						type: String
					}
				}, 
				{_id: true}
			)]
		}, 
		{_id: false}
	)
)
settingSchema.index({product: 1, type: 1}, {unique: true});

settingSchema.statics.update = (setting, payload) ->
	if(payload)
		if(payload.description)
			setting.description = payload.description
		if(payload.issue_type)
			setting.issue_type = payload.issue_type
		if(payload.product_line)
			setting.product_line = payload.product_line
		if(payload.component_filter)
			setting.component_filter = payload.component_filter
		if(payload.relations_filter)
			setting.relations_filter = payload.relations_filter
		if(payload.custom_execution_script)
			setting.custom_execution_script = payload.custom_execution_script
		if(payload.investigated_setting)
			setting.investigated_setting = payload.investigated_setting

module.exports = mongoose.model('Setting', settingSchema)
