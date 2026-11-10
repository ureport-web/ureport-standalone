# Lane scope matching shared by quarantine rules, notification rules and auto-heal scopes.
# Pure logic — no DB, no HTTP.
#
# A scope is { version, team, browser, device, platform, platform_version, stage, extras }.
# A blank field (or a blank extras value) places no restriction; a set field must equal the
# build's value. A scope with every field blank matches every lane.

LANE_FIELDS = ['version', 'team', 'browser', 'device', 'platform', 'platform_version', 'stage']

# Build.extras is a Mongoose Map; rules and plain objects carry a plain object.
extractExtras = (arg) ->
  return {} unless arg?.extras
  if arg.extras instanceof Map then Object.fromEntries(arg.extras) else arg.extras

# rule: { scope: {...} }   build: Build document or plain object
matchesScope = (rule, build) ->
  scope = rule.scope or {}
  predefinedMatch = LANE_FIELDS.every (f) ->
    return true unless scope[f]
    build[f] == scope[f]
  return false unless predefinedMatch

  ruleExtras = scope.extras
  return true unless ruleExtras and typeof ruleExtras is 'object'
  return true unless Object.keys(ruleExtras).length > 0
  buildExtras = extractExtras(build)
  Object.keys(ruleExtras).every (k) ->
    return true unless ruleExtras[k]
    buildExtras[k] == ruleExtras[k]

module.exports = { LANE_FIELDS, extractExtras, matchesScope }
