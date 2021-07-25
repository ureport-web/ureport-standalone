mongoose = require('mongoose')
Schema = mongoose.Schema


dashboardSchema = new Schema(
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
	is_default_widget:  { type: Boolean, default: false },
	default_template:  Schema.Types.ObjectId,
	created_at: { type: Date, default: Date.now },
	query: Schema({
		product : String,
		type : String,
		team: String,
		version: String,
		browser: String,
		device: String,
		platform: String,
		platform_version: String,
		stage: String,
		range: Number,
		since: String,
		after: String,
		query_type: String,
		date_range: Schema({
			repeat: String,
			frequency: Number,
			start_date: String,
			end_date: String,
			end_date_type: String,
			start_time: String,
			end_time: String
		}, {_id: false})
	}, {_id: false}),
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
				type: String,
				multi_query: Schema.Types.Mixed, # used by multiple product line
				product_line_query: Schema({
					product : String,
					type : String,
					team: String,
					version: String,
					browser: String,
					device: String,
					platform: String,
					platform_version: String,
					stage: String,
					range: Number,
					since: String,
					after: String,
					query_type: String,
					date_range: Schema({
						repeat: String,
						frequency: Number,
						start_date: String,
						end_date: String,
						end_date_type: String,
						start_time: String,
						end_time: String
					}, {_id: false})
				}, {_id: false}), # used by non default product line
				pattern: Schema({
					groupByRelation: Schema.Types.Mixed,
					status: Schema.Types.Mixed,
					relations: Schema.Types.Mixed
				}, {_id: false})
			}, {_id: false})
	],
	comments: Schema.Types.Mixed
)

dashboardSchema.statics.update = (dashboard, payload) ->
	if(payload)
		if(payload.description)
			dashboard.description = payload.description
		if(payload.name)
			dashboard.name = payload.name
		if(payload.is_public != undefined)
			dashboard.is_public = payload.is_public
		if(payload.query)
			dashboard.query = payload.query

dashboardSchema.statics.addWidget = (dashboard, payload) ->
	if(payload)
		if(payload.widgets)
			dashboard.widgets = dashboard.widgets.concat(payload.widgets);

dashboardSchema.statics.addComment = (dashboard, payload) ->
	if(payload)
		comment = {
			time: new Date()
		}
		if(payload.user != undefined)
			comment.user = payload.user
		if(payload.message != undefined)
			comment.message = payload.message

		if(dashboard.comments)
			dashboard.comments.push(comment)
		else
			dashboard.comments = [comment]

Dashboard = mongoose.model('dashboard', dashboardSchema)
module.exports = Dashboard