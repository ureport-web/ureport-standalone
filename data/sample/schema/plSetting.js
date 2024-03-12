mongoose = require('mongoose')
Schema = mongoose.Schema

settingSchema = new Schema({
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
			)],
			customize_state: [Schema(
				{	
					label: {
						type: String
					},
					key: {
						type: String
					},
					color: {
						type: String
					},
					ttl: {
						type: Number
					}
				}, 
				{_id: true}
			)]
		}, 
		{_id: false}
	)
})

module.exports = settingSchema
