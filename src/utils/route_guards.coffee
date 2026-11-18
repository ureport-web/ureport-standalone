# Route-level authorisation middleware. Frontend permission checks are presentation only.
{ getLicenseState } = require('./license')
{ periodFromQuery, exceedsCommunityPeriod, COMMUNITY_MAX_PERIOD_DAYS } = require('./insights_math')

# requireRole('admin') / requireRole('admin', 'operator')
requireRole = (roles...) ->
  (req, res, next) ->
    unless req.user and req.user.role in roles
      return res.status(403).json { error: "You don't have permission to perform this action" }
    next()

requireFeature = (feature) ->
  (req, res, next) ->
    unless feature in (getLicenseState().features or [])
      return res.status(403).json { error: "This feature requires a licence that includes '#{feature}'" }
    next()

# Insights endpoints: a community licence may ask for at most a month (31 days); a longer period is refused.
# The period the request asks for is left on req.insightsPeriod. The UI locks the same periods, but only
# the server can enforce it.
limitInsightsPeriod = (req, res, next) ->
  period = periodFromQuery(req.query)
  if exceedsCommunityPeriod(period.since, period.until) and getLicenseState().isCommunity
    return res.status(403).json { error: "Periods longer than #{COMMUNITY_MAX_PERIOD_DAYS} days need a Team plan or above" }
  req.insightsPeriod = period
  next()

module.exports = { requireRole, requireFeature, limitInsightsPeriod }
