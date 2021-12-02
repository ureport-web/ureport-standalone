mongoose = require('mongoose')
Schema = mongoose.Schema
async = require("async")

buildSchema = new Schema(
	product: {
		type: String,
		required: "Please provide a product name.",
		trim: true
  	},
	type: {
		type: String,
		required: "Please provide a build type.",
		trim: true
  	},
	version: {
		type: String,
  	},
	team: {
		type: String,
		trim: true
  	},
	build: {
		type: Number,
		validate: /\d+/,
		required: "Please provide a build. A build number comes from your CI tools and must be a number."
  	},
	browser: {
		type: String,
		validate: /(electron|edge|firefox|chrome|safari|opera|internet\s?explorer|IE)/i,
		trim: true
  	},
	device: {
		type: String,
		trim: true
  	},
	platform: {
		type: String,
		trim: true
  	},
	platform_version: {
		type: String,
		trim: true
  	},
	stage: {
		type: String,
		trim: true
  	},
	start_time: { type: Date, default: Date.now },
	end_time: Date,
	owner: String,
	is_archive: { type: Boolean, default: false},
	status: { 
		type: Schema.Types.Mixed, 
		default: { total: 0, pass: 0, fail: 0, skip:0, warning: 0}
	},
	environments: { 
		type: Schema.Types.Mixed, 
		default: { 'default': "default"}
	},
	settings: { 
		type: Schema.Types.Mixed, 
		default: { 'default': "default"}
	},
	# if client exists, we map the settings and environments to the clients
	outages: [],
	comments: [Schema({
		userId: Schema.Types.ObjectId,
		user: String,
		time: { type: Date, default: Date.now },
		message: String,
		isDeleted: { type: Boolean, default: false }
	}, {_id: true})]
)

buildSchema.statics.initBuild = (payload) ->
	newBuildPayload = {
		settings: {},
		environments: {}
	}
	if(payload.product)
		newBuildPayload.product = payload.product
	
	if(payload.type)
		newBuildPayload.type = payload.type

	if(payload.version)
		newBuildPayload.version = payload.version
	
	if(payload.team)
		newBuildPayload.team = payload.team
	
	if(payload.build)
		newBuildPayload.build = payload.build
	
	if(payload.browser)
		newBuildPayload.browser = payload.browser
	
	if(payload.device)
		newBuildPayload.device = payload.device

	if(payload.platform)
		newBuildPayload.platform = payload.platform

	if(payload.platform_version)
		newBuildPayload.platform_version = payload.platform_version
	
	if(payload.stage)
		newBuildPayload.stage = payload.stage

	if(payload.is_archive)
		newBuildPayload.is_archive = payload.is_archive

	if(payload.start_time)
		newBuildPayload.start_time = payload.start_time

	if(payload.end_time)
		newBuildPayload.end_time = payload.end_time

	if(payload.owner)
		newBuildPayload.owner = payload.owner

	if(payload.comments)
		newBuildPayload.comments = payload.comments

	if(payload.outages)
		newBuildPayload.outages = payload.outages

	if(payload.client)
		if(payload.settings)
			newBuildPayload.settings[payload.client] = payload.settings
		if(payload.environments)
			newBuildPayload.environments[payload.client] = payload.environments
	else
		if(payload.settings)
			newBuildPayload.settings['default'] = payload.settings
		if(payload.environments)
			newBuildPayload.environments['default'] = payload.environments

	return new Build(newBuildPayload)

buildSchema.statics.updateAttributes = (build, payload) ->
	if(payload)
		if(payload.is_archive != undefined)
			build.is_archive = payload.is_archive
		if(payload.start_time)
			build.start_time = payload.start_time
		if(payload.end_time)
			build.end_time = payload.end_time
		if(payload.owner)
			build.owner = payload.owner
		if(payload.comments)
			build.comments = payload.comments
		if(payload.outages)
			build.outages = payload.outages
		if(payload.client)
			if(payload.settings)
				build.settings[payload.client] = payload.settings
			if(payload.environments)
				build.environments[payload.client] = payload.environments
		else
			if(payload.settings)
				build.settings['default'] = payload.settings
				build.markModified("settings.default")
			if(payload.environments)
				build.environments['default'] = payload.environments
				build.markModified("environments.default")

buildSchema.statics.updateStatus = (build, payload) ->
	if(payload)
		if(typeof payload.pass == 'number')
			build.status.pass = build.status.pass + payload.pass
			build.markModified("status.pass")
		if(typeof payload.fail == 'number')
			build.status.fail = build.status.fail + payload.fail
			build.markModified("status.fail")
		if(typeof payload.skip == 'number')
			build.status.skip = build.status.skip +  payload.skip
			build.markModified("status.skip")
		if(typeof payload.warning == 'number')
			build.status.warning = build.status.warning + payload.warning
			build.markModified("status.warning")
		build.status.total = (if build.status.pass then build.status.pass else 0) + (if build.status.fail then build.status.fail else 0) + (if build.status.warning then build.status.warning else 0) + (if build.status.skip then build.status.skip else 0)
		build.markModified("status.total")

buildSchema.statics.addComment = (build, payload) ->
	if(payload)
		if(payload.comment)
			if(build.comments)
				build.comments = build.comments.concat(payload.comment)
			else
				build.comments = [payload.comment]

buildSchema.statics.updateComments = (build, payload) ->
	if(payload)
		if(payload.comments)
			if(build.comments)
				build.comments = payload.comments
			else
				build.comments = payload.comments

buildSchema.statics.addOutageComment = (build, payload) ->
	if(build.outages)
		async.detect(build.outages,
			(item,callback) ->
				if( item['search_type'] == payload.search_type && item['pattern'] == payload.pattern )
					callback(null, true)
				else
					callback(null, false)
			(err, outage) ->
				if(outage)
					if(outage.comments != undefined)
						outage.comments = outage.comments.concat(payload.comment)
					else
						outage.comments = [payload.comment]
		)

buildSchema.statics.manipulateOutage = (build, payload) ->
	if(payload)
		temp = {}
		if(payload.pattern != undefined)
			temp.pattern = payload.pattern
		if(payload.search_type != undefined)
			temp.search_type = payload.search_type
		if(payload.caused_by != undefined)
			temp.caused_by = payload.caused_by
		if(payload.tracking != undefined)
			temp.tracking = payload.tracking
		if(payload.exceptions != undefined)
			temp.exceptions = payload.exceptions
		if(payload.impact_test != undefined)
			temp.impact_test = payload.impact_test
		if(payload.comments != undefined)
			temp.comments = payload.comments

		if(build.outages)
			async.detect(build.outages,
				(item,callback) ->
					if( item['search_type'] == temp.search_type && item['pattern'] == temp.pattern )
						callback(null, true)
					else
						callback(null, false)
				(err, outage) ->
					if(outage)
						if(payload.caused_by != undefined)
							outage.caused_by = payload.caused_by
						if(payload.tracking != undefined)
							outage.tracking = payload.tracking
						if(payload.exceptions != undefined)
							outage.exceptions = payload.exceptions
						if(payload.impact_test != undefined)
							outage.impact_test = payload.impact_test
						if(payload.comments != undefined)
							# we never replace comments, always concat to it
							outage.comments = outage.comments.concat(payload.comments)
						# it seems the outage here is value instead of a reference
						# async.reject(build.outages,
						# 	(i,callback) ->
						# 		if( i['search_type'] == temp.search_type && i['pattern'] == temp.pattern )
						# 			callback(null, true)
						# 		else
						# 			callback(null, false)
						# 	(err, outs) ->
						# 		rs = outs
						# 		rs.push(outage)
						# 		build.outages = rs
						# )
					else
						build.outages.push(temp)
			)
		else
			build.outages = [outage]
Build = mongoose.model('Build', buildSchema);

module.exports = Build