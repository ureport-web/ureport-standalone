mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId;
Schema = mongoose.Schema

testSchema = new Schema({
	uid: {
		type: String,
		required: true,
		index: true,
		trim: true
  	},
	build: {
		type: Schema.Types.ObjectId,
		index: true,
		required: true
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
			message: "We only support status: [PASS, FAIL, SKIP,RERUN_PASS, RERUN_FAIL, RERUN_SKIP]"
		} 
	},
	old_status: { type: String, default: "UNKNOWN" },
	version: String,
	start_time: Date,
	end_time: Date,
	failure: Schema(
		{
			error_message: String,
			stack_trace: String,
			token: String
		},
		{_id: false}
	),
	is_rerun: { type: Boolean, default: false },
	setup: Schema.Types.Mixed,
	body: Schema.Types.Mixed,
	teardown: Schema.Types.Mixed,
	info: Schema.Types.Mixed
})

module.exports = testSchema
