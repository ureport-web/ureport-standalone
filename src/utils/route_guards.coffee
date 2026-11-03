# Route-level authorisation middleware. Frontend permission checks are presentation only.
{ getLicenseState } = require('./license')

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

module.exports = { requireRole, requireFeature }
