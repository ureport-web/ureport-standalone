mongoose = require('mongoose')
Schema = mongoose.Schema

var buildSchema = new Schema({
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
		validate: /(electron|edge|firefox|chrome|chromium|safari|opera|internet\s?explorer|IE)/i,
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
	outages: [],
	comments: [Schema({
		userId: Schema.Types.ObjectId,
		user: String,
		time: { type: Date, default: Date.now },
		message: String,
		isDeleted: { type: Boolean, default: false }
	}, {_id: true})]
})

module.exports = buildSchema