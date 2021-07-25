mongoose = require('mongoose')
Schema = mongoose.Schema


dashboardTemplateSchema = new Schema(
	name: {
		type: String, 
		required: "please provide a name", 
		trim: true
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true
	},
	description: String,
	is_public:  { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now },
	widgets: [Schema(
			{	
				name: String,
				cols: Number,
				rows: Number,
				minItemCols: Number,
				maxItemCols: Number,
				minItemRows: Number,
				maxItemRows: Number,
				maxItemArea: Number,
				y: Number,
				x: Number,
				dragEnabled: Boolean,
				resizeEnabled: Boolean,
				legendEnabled: Boolean,
				xaixs: String, # mainly for line chart/bar chart
				customTableConfig: Schema.Types.Mixed, # mainly for line chart/bar chart
				type: String, # Widget type
				pattern: Schema({
					groupByRelation: Schema.Types.Mixed,
					status: Schema.Types.Mixed,
					relations: Schema.Types.Mixed
				}, {_id: false})
			}, {_id: false})
	],
	comments: Schema.Types.Mixed
)

dashboardTemplateSchema.statics.update = (template, payload) ->
	if(payload)
		if(payload.description)
			template.description = payload.description
		if(payload.name)
			template.name = payload.name
		if(payload.is_public != undefined)
			template.is_public = payload.is_public

dashboardTemplateSchema.statics.addWidget = (template, payload) ->
	if(payload)
		if(payload.widgets)
			template.widgets = template.widgets.concat(payload.widgets);

DashboardTemplate = mongoose.model('dashboard_template', dashboardTemplateSchema)
module.exports = DashboardTemplate