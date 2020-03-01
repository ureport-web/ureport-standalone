mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId;
async = require("async")
Schema = mongoose.Schema

testSchema = new Schema(
	uid: {
		type: String,
		required: true,
		index: true,
		trim: true
  	},
	build: {
		type: Schema.Types.ObjectId,
		index: true
		# required: true
  	},
	name: {
		type: String,
		required: true,
		trim: true
  	},
	status: { 
		type: String, 
		required: true, 
		trim: true,
		uppercase: true,
		enum: { 
			values: ['PASS', 'FAIL', 'SKIP', 'WARNING','RERUN_PASS', 'RERUN_FAIL', 'RERUN_SKIP'],
			message: "We only support status: [PASS, FAIL, SKIP]"
		} 
	},
	old_status: { type: String, default: "UNKNOWN" },
	version: String,
	start_time: Date,
	end_time: Date,
	failure: Schema.Types.Mixed,
	is_rerun: { type: Boolean, default: false },
	setup: Schema.Types.Mixed,
	body: Schema.Types.Mixed,
	teardown: Schema.Types.Mixed,
	info: Schema.Types.Mixed
)

testSchema.index({build: 1, uid: 1});
testSchema.index({build: 1});
testSchema.index({uid: 1});

testSchema.statics.buildBuildsQuery = (rs, buildIds) ->
	async.each(buildIds,
		(item,callback) ->
			rs.push( new ObjectId(item) )
		(err) ->
	)

testSchema.statics.buildStatusQuery = (rs, payload) ->
	if(typeof payload == 'string')
		if(payload == 'All')
			rs.push({ "status" : {$regex: 'PASS', $options:"i"} })
			rs.push({ "status" : {$regex: 'FAIL', $options:"i"} })
			rs.push({ "status" : {$regex: 'WARNING', $options:"i"} })
			rs.push({ "status" : {$regex: 'SKIP', $options:"i"} })
		else
			rs.push({ "status" : {$regex: payload, $options:"i"} })
	else
		if(payload.length == 1 && payload[0] == 'All')
				rs.push({ "status" : {$regex: 'PASS', $options:"i"} })
				rs.push({ "status" : {$regex: 'FAIL', $options:"i"} })
				rs.push({ "status" : {$regex: 'WARNING', $options:"i"} })
				rs.push({ "status" : {$regex: 'SKIP', $options:"i"} })
		else
			async.each(payload,
				(item,callback) ->
					rs.push({ "status" : {$regex: item, $options:"i"} })
				(err) ->
			)

testSchema.statics.buildExcludeFieldQuery = (rs, payload) ->
	async.each(payload,
		(item,callback) ->
			rs[item]=0
		(err) ->
	)

testSchema.statics.addStep = (rs, payload) ->
	if(payload.setup instanceof Array)
		rs['setup'] = payload.setup
	if(payload.body instanceof Array)
		rs['body'] = payload.body
	if(payload.teardown instanceof Array)
		rs['teardown'] = payload.teardown

testSchema.statics.changeStatus = (rs, payload) ->
	if(payload.status)
		if(rs['status'] != "RERUN_PASS") # only keep the status as old when current test status is not rerun pass
			rs['old_status'] = rs['status']
		rs['status'] = payload.status
	if(payload.comments)
		rs['comments'] = payload.comments

module.exports = mongoose.model('Test', testSchema)
