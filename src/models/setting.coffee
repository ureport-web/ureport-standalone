mongoose = require('mongoose')
ObjectId = mongoose.Types.ObjectId;
async = require("async")
Schema = mongoose.Schema

quarantineConditionSchema = new Schema(
  {
    mode: { type: String }
    failures: { type: Number }
    fail_rate: { type: Number }
  }
  { _id: false }
)

quarantineThresholdSchema = new Schema(
  {
    conditions: [quarantineConditionSchema]
    resolve_passes: { type: Number }
    min_pass_rate: { type: Number }
  }
  { _id: false }
)

quarantineRelationSchema = new Schema(
  {
    type: { type: String }
    values: [String]
  }
  { _id: false }
)

quarantineFilterSchema = new Schema(
  {
    logic: { type: String }
    name_pattern: { type: String }
    relations: [quarantineRelationSchema]
  }
  { _id: false }
)

quarantineScopeSchema = new Schema(
  {
    version: { type: String }
    team: { type: String }
    browser: { type: String }
    device: { type: String }
    platform: { type: String }
    platform_version: { type: String }
    stage: { type: String }
    extras: { type: Schema.Types.Mixed }
  }
  { _id: false }
)

quarantineRuleSchema = new Schema(
  {
    _id: { type: String }
    name: { type: String }
    enabled: { type: Boolean }
    scope: quarantineScopeSchema
    filter: quarantineFilterSchema
    threshold: quarantineThresholdSchema
  }
  { _id: false }
)

autoTriageScopeRelationSchema = new Schema(
  {
    type: { type: String }
    values: [String]
  }
  { _id: false }
)

autoTriageScopeFilterSchema = new Schema(
  {
    logic: { type: String }
    relations: [autoTriageScopeRelationSchema]
  }
  { _id: false }
)

autoTriageSettingsSchema = new Schema(
  {
    enabled: { type: Boolean, default: false }
    max_source_age_days: { type: Number, default: 30 }
    ttl_days: { type: Number, default: 5 }
    scope_filter: autoTriageScopeFilterSchema
  }
  { _id: false }
)

# Auto-heal runs for a build only when `enabled` is on and at least one enabled entry of `scopes` matches it.
# An empty `scopes` list means nothing runs (same as an empty rules list for notifications and quarantine);
# an entry with a blank scope matches every lane of the product/type.
autoHealScopeSchema = new Schema(
  {
    name:    { type: String }
    enabled: { type: Boolean, default: true }
    scope:   quarantineScopeSchema
  }
  { _id: false }
)

autoHealSettingsSchema = new Schema(
  {
    enabled:               { type: Boolean, default: false }
    scopes:                [autoHealScopeSchema]
    dispatch_mode:         { type: String, default: 'agent' }  # 'agent' | 'external'
    default_playbook_id:   { type: Schema.Types.ObjectId, ref: 'HealPlaybook' }  # used by auto-trigger in agent mode
    exclude_quarantined:     { type: Boolean, default: false }
    new_failures_only:       { type: Boolean, default: true }
    dedup_days:              { type: Number, default: 7 }  # days a signal for the same test and error blocks a new one; an open PR blocks until the signal expires
    max_failure_rate:        { type: Number, default: 0 }  # skip the build when more than this % of its tests fail (likely an outage); 0 = disabled
    max_prior_failures:      { type: Number, default: 3 }  # skip test if failed in last N consecutive builds; 0 = disabled
    max_signals_per_trigger: { type: Number, default: 10 }
    # Failures whose error message matches any rule never open a signal
    exclude_rules: [Schema(
      {
        pattern:    { type: String }
        match_type: { type: String, enum: ['contains', 'equals', 'regex'], default: 'contains' }
      }
      { _id: false }
    )]
    # Extra guidance copied onto each signal for external consumers
    additional_instructions: { type: String, default: '' }
  }
  { _id: false }
)

quarantineRulesSchema = new Schema(
  {
    builds: { type: Number }
    min_builds: { type: Number }
    min_pass_rate: { type: Number }
    max_window_days: { type: Number }
    rules: [quarantineRuleSchema]
  }
  { _id: false }
)

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
	notification: Schema.Types.Mixed,
	quarantine_rules: quarantineRulesSchema,
	auto_triage_settings: autoTriageSettingsSchema,
	auto_heal_settings: autoHealSettingsSchema,
	default_framework: { type: String },
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
)
settingSchema.index({product: 1, type: 1}, {unique: true});

settingSchema.statics.update = (setting, payload) ->
	if(payload)
		if(payload.product)
			setting.product = payload.product
		if(payload.type)
			setting.type = payload.type
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
		if(payload.notification != undefined)
			setting.notification = payload.notification
		if(payload.quarantine_rules != undefined)
			setting.quarantine_rules = payload.quarantine_rules
		if(payload.auto_triage_settings != undefined)
			setting.auto_triage_settings = payload.auto_triage_settings
		if(payload.auto_heal_settings != undefined)
			setting.auto_heal_settings = payload.auto_heal_settings
		if(payload.default_framework != undefined)
			setting.default_framework = payload.default_framework
			setting.markModified('default_framework')

module.exports = mongoose.model('Setting', settingSchema)
