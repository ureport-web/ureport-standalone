/**
 * Swagger route documentation file.
 * This file is NEVER loaded by Express — it exists solely for swagger-autogen to scan.
 *
 * Maintenance contract: when a route is added/changed in a .coffee route file,
 * update this file accordingly and run `npm run swagger` to regenerate swagger.json.
 */

const express = require('express');
const router = express.Router();

// ─── Version ─────────────────────────────────────────────────────────────────

router.get('/version', (req, res) => {
  /*
    #swagger.tags = ['Version']
    #swagger.summary = 'Get application version and instance info'
    #swagger.description = 'Public. Returns the whole package.json (name, version, ...) plus runtime info. The licence token itself is never returned, only the parsed state.'
    #swagger.security = []
    #swagger.responses[200] = { description: 'Version info', content: { 'application/json': { schema: { type: 'object', properties: { version: { type: 'string' }, name: { type: 'string' }, isDemo: { type: 'string', description: 'Value of UREPORT_IS_DEMO env var (e.g. "true"), absent when unset' }, smtpConfigured: { type: 'boolean' }, cache: { type: 'object', properties: { mode: { type: 'string' }, connected: { type: 'boolean' } } }, license: { type: 'object', properties: { valid: { type: 'boolean' }, licensee: { type: 'string' }, seats: { type: 'integer', nullable: true }, lanes: { type: 'integer', nullable: true }, dashboards: { type: 'integer', nullable: true }, plan: { type: 'string' }, features: { type: 'array', items: { type: 'string' } }, expiresAt: { type: 'string', format: 'date-time', nullable: true }, isCommunity: { type: 'boolean' } } } } } } } }
  */
});

// ─── Authentication ──────────────────────────────────────────────────────────

router.post('/login', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Log in with username and password'
    #swagger.description = 'Public (rate limited). Terminates the user\'s other sessions (except the demo user on a demo instance). Blocks the demo user on non-demo instances.'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
    }
    #swagger.responses[200] = { description: 'Login successful', content: { 'application/json': { schema: { type: 'object', properties: { session: { type: 'object', description: 'Express session object' }, sessionId: { type: 'string', description: 'Signed session id, "s:" + signature' } } } } } }
    #swagger.responses[401] = { description: 'Invalid username or password', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Account not active, or demo user on non-demo instance', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.post('/logout', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Log out current session'
    #swagger.description = 'No auth middleware is applied; destroys the current session and writes a LOGOUT audit record.'
    #swagger.security = []
    #swagger.responses[200] = { description: 'Logged out', content: { 'application/json': { schema: { type: 'object', properties: { msg: { type: 'string' } } } } } }
  */
});

router.post('/signup', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Register a new user account'
    #swagger.description = 'Public unless an authenticated admin sets adminCreated=true (then the user is created active with the given role and the licence seat limit is enforced). Otherwise the user is created with role viewer and status pending; if SMTP is configured a confirmation email is sent (token valid 24h). Disabled in demo mode. Username "demo" is rejected.'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['username', 'email', 'password'], properties: { username: { type: 'string' }, displayname: { type: 'string', description: 'Defaults to username' }, email: { type: 'string' }, password: { type: 'string' }, adminCreated: { type: 'boolean', description: 'Only honoured when the caller is an authenticated admin' }, role: { type: 'string', enum: ['admin', 'operator', 'viewer'], default: 'viewer', description: 'Only used when adminCreated is true' } } } } }
    }
    #swagger.responses[200] = { description: 'Account created', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, requiresEmailConfirmation: { type: 'boolean' } } } } } }
    #swagger.responses[400] = { description: 'Missing fields, username not allowed, or username already exists', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Demo mode, or user seat limit reached ({ error, limit })', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, error: { type: 'string' }, limit: { type: 'integer' } } } } } }
    #swagger.responses[500] = { description: 'Error creating user', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.get('/confirm-email/{token}', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Confirm email address via token'
    #swagger.security = []
    #swagger.parameters['token'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Email confirmed, user is now active', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[400] = { description: 'Invalid or expired confirmation token', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Seat limit reached', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.get('/me', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Get the current session'
    #swagger.description = 'Checks req.isAuthenticated() inside the handler (session login).'
    #swagger.responses[200] = { description: 'Current session', content: { 'application/json': { schema: { type: 'object', properties: { session: { type: 'object' } } } } } }
    #swagger.responses[401] = { description: 'Not authenticated', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.get('/token', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Get API token status for the current user'
    #swagger.description = 'Session login required (checked in handler). Never returns the full token, only a masked preview.'
    #swagger.responses[200] = { description: 'Token status', content: { 'application/json': { schema: { type: 'object', properties: { hasToken: { type: 'boolean' }, preview: { type: 'string', description: 'first 4 + "..." + last 4 chars' }, createdAt: { type: 'string', format: 'date-time', nullable: true } } } } } }
    #swagger.responses[401] = { description: 'Login required', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.post('/token', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Generate an API token for the current user'
    #swagger.description = 'Session login required (checked in handler). Replaces any existing token. The full token is only returned here.'
    #swagger.responses[200] = { description: 'Token generated', content: { 'application/json': { schema: { type: 'object', properties: { apiToken: { type: 'string' } } } } } }
    #swagger.responses[401] = { description: 'Login required', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.delete('/token', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Revoke the current API token'
    #swagger.description = 'Session login required (checked in handler).'
    #swagger.responses[200] = { description: 'Token revoked', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[401] = { description: 'Login required', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.post('/forgot', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Request a password reset email'
    #swagger.description = 'Public (rate limited). Token valid 1 hour. Always 200 for unknown accounts ({ msg }); the email is only sent when system email settings are configured. SSO accounts get 400.'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['identifier'], properties: { identifier: { type: 'string', description: 'Email address (contains "@") or username' } } } } }
    }
    #swagger.responses[200] = { description: '{ success: true } when processed, or { msg } when no such account exists', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, msg: { type: 'string' } } } } } }
    #swagger.responses[400] = { description: 'Account uses SSO (has_password is false)', content: { 'application/json': { schema: { type: 'object', properties: { msg: { type: 'string' } } } } } }
  */
});

router.get('/reset/{token}', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Validate a password reset token'
    #swagger.security = []
    #swagger.parameters['token'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Token validity (always 200)', content: { 'application/json': { schema: { type: 'object', properties: { valid: { type: 'boolean' }, username: { type: 'string' }, msg: { type: 'string' } } } } } }
  */
});

router.post('/reset/{token}', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Reset password using token'
    #swagger.description = 'Public (rate limited). On success the user is also logged in (req.logIn).'
    #swagger.security = []
    #swagger.parameters['token'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['password'], properties: { password: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Result (always 200; success=false when the token is invalid or expired)', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, msg: { type: 'string' } } } } } }
  */
});

// ─── User ────────────────────────────────────────────────────────────────────

router.post('/user/{page}/{perPage}', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'List users (paginated)'
    #swagger.description = 'Requires role operator or admin (readAny user); viewer gets 403. Password and apiToken are excluded from results. page is 0-based; perPage <= 0 becomes 10 and values above 50 are capped at 50.'
    #swagger.parameters['page'] = { in: 'path', required: true, schema: { type: 'integer' }, description: '0-based page number' }
    #swagger.parameters['perPage'] = { in: 'path', required: true, schema: { type: 'integer' }, description: 'Page size, max 50' }
    #swagger.requestBody = {
      required: false,
      content: { 'application/json': { schema: { type: 'object', properties: { filter: { type: 'string', description: 'Username regex fragment (escaped)' }, status: { type: 'string', enum: ['pending', 'active', 'rejected'] }, sort: { type: 'object', description: 'Mongo sort spec, default { username: "desc" }' } } } } }
    }
    #swagger.responses[200] = { description: 'Array of users (a negative page returns { error: true, message } with 200)', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/total', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Get total user count'
    #swagger.description = 'Requires role operator or admin (readAny user); viewer gets 403. Password and apiToken are excluded from results.'
    #swagger.requestBody = {
      required: false,
      content: { 'application/json': { schema: { type: 'object', properties: { filter: { type: 'string', description: 'Username regex fragment (escaped)' }, status: { type: 'string', enum: ['pending', 'active', 'rejected'] } } } } }
    }
    #swagger.responses[200] = { description: 'Total count (bare number)', content: { 'application/json': { schema: { type: 'integer' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/search', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Search users by username (case-insensitive partial match)'
    #swagger.description = 'Requires role operator or admin (readAny user); viewer gets 403. Password and apiToken are excluded from results.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['username'], properties: { username: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Matching users', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } }
    #swagger.responses[400] = { description: 'username missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/by-ids', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Get users by id list'
    #swagger.description = 'Requires role operator or admin (readAny user); viewer gets 403. Password and apiToken are excluded from results. Returns [] when ids is missing or empty.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['ids'], properties: { ids: { type: 'array', items: { type: 'string' } } } } } }
    }
    #swagger.responses[200] = { description: 'Users', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/user/update/{username}', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Update user profile'
    #swagger.description = 'Allowed for admin (updateAny) or for the user themself (matched by username). Password cannot be changed here. Only admins may set role (audited). Applied fields: username, email, role, displayname, position, settings.language/theme/report/dashboard.'
    #swagger.parameters['username'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string', description: 'New username, must not be taken' }, email: { type: 'string' }, displayname: { type: 'string' }, position: { type: 'string' }, role: { type: 'string', enum: ['admin', 'operator', 'viewer'] }, settings: { type: 'object' } } } } }
    }
    #swagger.responses[200] = { description: 'Updated user document', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[400] = { description: 'Password in body, non-admin sets role, new username taken, or username to update not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.delete('/user/{id}', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Delete a user'
    #swagger.description = 'Admin only. Audited.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'User _id' }
    #swagger.responses[200] = { description: 'Mongo deleteOne result', content: { 'application/json': { schema: { type: 'object', properties: { n: { type: 'integer' }, ok: { type: 'integer' }, deletedCount: { type: 'integer' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.get('/user/pending', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'List users pending approval'
    #swagger.description = 'Requires role operator or admin (readAny user); viewer gets 403. Password and apiToken are excluded from results. Sorted newest first.'
    #swagger.responses[200] = { description: 'Pending users', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/user/approve/{id}', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Approve a pending user'
    #swagger.description = 'Admin only. Sets status active; enforces licence seat limit. Audited.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'User _id' }
    #swagger.responses[200] = { description: 'Updated user (password and apiToken blanked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[403] = { description: 'Forbidden, or seat limit reached ({ error, limit })', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' }, limit: { type: 'integer' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/user/reject/{id}', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Reject a pending user'
    #swagger.description = 'Admin only. Sets status rejected. Audited.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'User _id' }
    #swagger.responses[200] = { description: 'Updated user (password and apiToken blanked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/user/reset-password/{username}', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Admin reset of a user password (no current password needed)'
    #swagger.description = 'Admin only. Not allowed for SSO accounts. Audited.'
    #swagger.parameters['username'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['newPassword'], properties: { newPassword: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Password reset', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[400] = { description: 'newPassword missing, or account uses SSO', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Only admins can reset passwords', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/change-password', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Change current user password'
    #swagger.description = 'Any authenticated user. Not allowed for SSO accounts.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['currentPassword', 'newPassword'], properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Password updated', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[400] = { description: 'Missing fields, SSO account, or current password incorrect', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

// ─── Build ─────────────────────────────────────────────────────────────────────

router.get('/build/active-lanes', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'List distinct active lanes'
    #swagger.description = 'Requires authentication. Distinct product/type/team/browser/device/platform/platform_version/stage/extras combinations of non-archived builds started within the last N days. Not filtered by license lane quota.'
    #swagger.parameters['days'] = {
      in: 'query',
      schema: {
        type: 'integer',
        default: 7,
        description: 'Look-back window in days'
      },
      description: 'Look-back window in days (default 7)'
    }
    #swagger.responses[200] = {
      description: 'Lane list',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product: { type: 'string' },
                type: { type: 'string' },
                team: { type: 'string' },
                browser: { type: 'string' },
                device: { type: 'string' },
                platform: { type: 'string' },
                platform_version: { type: 'string' },
                stage: { type: 'string' },
                extras: { type: 'object' }
              }
            }
          }
        }
      }
    }
  */
});

router.get('/build/{id}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get a build by ID'
    #swagger.description = 'Requires authentication. '
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Build record',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[404] = {
      description: 'Build not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Create or update a build'
    #swagger.description = 'Requires authentication. Requires create permission on build (admin, operator). A build is matched by build number, is_archive, product, type and the lane fields (version, team, browser, device, platform, platform_version, stage, extras); an unset lane field matches builds where it is also unset. If a match exists it is updated, otherwise a new build is created.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              build: { type: 'string', description: 'Build number/identifier (mandatory)' },
              is_archive: { type: 'boolean', default: false },
              status: {
                type: 'object',
                properties: {
                  pass: { type: 'integer' },
                  fail: { type: 'integer' },
                  skip: { type: 'integer' },
                  warning: { type: 'integer' },
                  total: { type: 'integer' }
                }
              },
              version: { type: 'string' },
              team: { type: 'string' },
              browser: { type: 'string' },
              device: { type: 'string' },
              platform: { type: 'string' },
              platform_version: { type: 'string' },
              stage: { type: 'string' },
              extras: {
                type: 'object',
                description: 'Key/value pairs, matched as extras.<key>'
              },
              start_time: { type: 'string', format: 'date-time' },
              end_time: { type: 'string', format: 'date-time' },
              environments: { type: 'object' },
              settings: { type: 'object' },
              client: { type: 'string' }
            },
            required: ['product', 'type', 'build']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Build created or updated (saved build document)',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[400] = {
      description: 'Product, Type or Build is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.put('/build/{id}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Update a build by ID'
    #swagger.description = 'Requires authentication. Requires update permission on build (admin, operator).'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[200] = {
      description: 'Updated build',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[404] = {
      description: 'Build not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.delete('/build/{id}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Delete a build and its tests'
    #swagger.description = 'Requires authentication. Requires delete permission on build (admin only). Deletes the build, then all tests of that build; writes a BUILD_DELETE audit record. Returns 200 even if the build does not exist.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Delete result of the build\'s tests',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              n: { type: 'integer' },
              ok: { type: 'integer' },
              deletedCount: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.put('/build/status/{id}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Increment build status counters'
    #swagger.description = 'Requires authentication. Requires update permission on build (admin, operator). The pass/fail/skip/warning values are added to the build\'s current counters and total is recomputed.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/BuildStatusUpdate' } }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated build',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[404] = {
      description: 'Build not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/status/calculate/{id}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Recalculate build status from test results'
    #swagger.description = 'Requires authentication. Requires update permission on build (admin, operator). Uses the last status per test uid of the build (RERUN_ prefix stripped). When is_update_build_status is true (default) the build status/end_time are saved and quarantine rules and plugin hooks are triggered.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              is_update_build_status: {
                type: 'boolean',
                default: true,
                description: 'Persist the calculated status to the build'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Calculated status',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  pass: { type: 'integer' },
                  fail: { type: 'integer' },
                  skip: { type: 'integer' }
                },
                description: 'Counts per lower-cased status key'
              },
              end_time: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Build id not found, or no tests found for the build',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { message: { type: 'string' } } }
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/status/latest', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get latest status per lane'
    #swagger.description = 'Requires authentication. Requires read permission on build (all roles). Groups matching builds by lane and returns the most recent build of each.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              query: {
                type: 'array',
                items: { type: 'object' },
                description: 'Non-empty array of Mongo match conditions, combined with $or (mandatory)'
              },
              since: {
                type: 'string',
                format: 'date-time',
                description: 'Only builds with start_time >= since'
              }
            },
            required: ['query']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'One entry per lane',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: {
                  type: 'object',
                  description: 'Lane key (product, type, version, team, browser, device, platform, platform_version, stage, extras)'
                },
                product: { type: 'string' },
                type: { type: 'string' },
                build: { type: 'string' },
                status: {
                  type: 'object',
                  properties: {
                    pass: { type: 'integer' },
                    fail: { type: 'integer' },
                    skip: { type: 'integer' },
                    warning: { type: 'integer' },
                    total: { type: 'integer' }
                  }
                },
                start_time: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'query must be a non-empty array',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { message: { type: 'string' } } }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'No builds found',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { message: { type: 'string' } } }
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/comment/{id}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Add a comment to a build'
    #swagger.description = 'Requires authentication. Restricted to roles admin and operator.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              comment: {
                type: 'object',
                description: 'Comment object appended to the build comments'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated build',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[404] = {
      description: 'Build not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.put('/build/comment/{id}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Replace the comments of a build'
    #swagger.description = 'Requires authentication. Restricted to roles admin and operator.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              comments: {
                type: 'array',
                items: { type: 'object' },
                description: 'Full replacement comments list'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated build',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[404] = {
      description: 'Build not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/outage/comment/{buildId}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Add a comment to a build outage'
    #swagger.description = 'Requires authentication. The outage is identified by search_type + pattern. No role check beyond authentication.'
    #swagger.parameters['buildId'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              search_type: { type: 'string' },
              pattern: { type: 'string' },
              comment: {
                type: 'object',
                description: 'Comment appended to the outage comments'
              }
            },
            required: ['search_type', 'pattern', 'comment']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated build',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[400] = {
      description: 'search_type, pattern or comment is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[404] = {
      description: 'Build not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/outage/{buildId}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Add or update an outage on a build'
    #swagger.description = 'Requires authentication. Requires update permission on outage (admin, operator).'
    #swagger.parameters['buildId'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              search_type: { type: 'string' },
              pattern: { type: 'string' },
              comments: { type: 'array', items: { type: 'object' } }
            },
            description: 'Outage definition; outage is matched by search_type + pattern'
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated build',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Build' } } }
    }
    #swagger.responses[404] = {
      description: 'Build not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/filter', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get the latest builds of given products/types'
    #swagger.description = 'Requires authentication. product and type are arrays of values (OR-ed). Results are sorted by start_time descending and limited to range.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'array', items: { type: 'string' }, description: 'Mandatory' },
              type: { type: 'array', items: { type: 'string' }, description: 'Mandatory' },
              is_archive: { type: 'boolean', default: false },
              range: { type: 'integer', default: 5, description: 'Max builds returned' },
              since: {
                type: 'string',
                format: 'date-time',
                description: 'start_time > since'
              },
              after: {
                type: 'string',
                format: 'date-time',
                description: 'start_time < after'
              },
              version: { type: 'array', items: { type: 'string' } },
              team: { type: 'array', items: { type: 'string' } },
              browser: { type: 'array', items: { type: 'string' } },
              device: { type: 'array', items: { type: 'string' } },
              platform: { type: 'array', items: { type: 'string' } },
              platform_version: { type: 'array', items: { type: 'string' } },
              stage: { type: 'array', items: { type: 'string' } },
              extras: {
                type: 'object',
                description: 'Key/value pairs, matched as extras.<key>'
              }
            },
            required: ['product', 'type']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching builds',
      content: {
        'application/json': {
          schema: { type: 'array', items: { '$ref': '#/components/schemas/Build' } }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Product or Type is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.get('/build/entity/read', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get distinct build entity values'
    #swagger.description = 'Requires authentication. '
    #swagger.responses[200] = {
      description: 'One single-key object per entity: product, type, version, device, team, browser',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { type: 'object' },
            description: 'e.g. [{ product: [...] }, { type: [...] }, ...]'
          }
        }
      }
    }
  */
});

router.get('/build/entity/producttype', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get distinct products and types'
    #swagger.description = 'Requires authentication. '
    #swagger.responses[200] = {
      description: 'Two single-key objects: [{ product: [...] }, { type: [...] }]',
      content: {
        'application/json': { schema: { type: 'array', items: { type: 'object' } } }
      }
    }
  */
});

router.post('/build/entity/recommend', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Recommend lanes for a product/type'
    #swagger.description = 'Requires authentication. Returns distinct lane combinations started within the last since days. Optional lane fields are case-insensitive regular expressions (invalid/unsafe regex returns 400); extras are exact matches.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              since: {
                type: 'integer',
                default: 300,
                description: 'Look-back window in days'
              },
              version: { type: 'string' },
              team: { type: 'string' },
              browser: { type: 'string' },
              device: { type: 'string' },
              platform: { type: 'string' },
              platform_version: { type: 'string' },
              stage: { type: 'string' },
              extras: { type: 'object' }
            },
            required: ['product', 'type']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Recommendations. When nothing matches the response is an empty array.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              _id: { type: 'string', description: 'product_type' },
              recommends: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    product: { type: 'string' },
                    type: { type: 'string' },
                    team: { type: 'string' },
                    version: { type: 'string' },
                    browser: { type: 'string' },
                    device: { type: 'string' },
                    platform: { type: 'string' },
                    platform_version: { type: 'string' },
                    stage: { type: 'string' },
                    extras: { type: 'object' }
                  }
                }
              },
              total: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Product/Type is mandatory, or invalid regex in a field',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/entity/others', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get lane values for a product/type'
    #swagger.description = 'Requires authentication. Distinct values per field for the given product/type, optionally narrowed by the other lane fields (exact match). The unfiltered result is cached for 10 minutes.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              version: { type: 'string' },
              team: { type: 'string' },
              browser: { type: 'string' },
              device: { type: 'string' },
              platform: { type: 'string' },
              platform_version: { type: 'string' },
              stage: { type: 'string' }
            },
            required: ['product', 'type']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Array of single-key objects: version, device, team, browser, platform, platform_version, stage (each an array of values) and a final { extras: { <key>: [values] } }',
      content: {
        'application/json': { schema: { type: 'array', items: { type: 'object' } } }
      }
    }
    #swagger.responses[400] = {
      description: 'Product or Type is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/total', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Count builds'
    #swagger.description = 'Requires authentication. All fields optional; exact-match filters.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              version: { type: 'string' },
              team: { type: 'string' },
              browser: { type: 'string' },
              device: { type: 'string' },
              platform: { type: 'string' },
              platform_version: { type: 'string' },
              stage: { type: 'string' },
              extras: {
                type: 'object',
                description: 'Key/value pairs, matched as extras.<key>'
              },
              untilDate: {
                type: 'string',
                format: 'date-time',
                description: 'start_time < untilDate'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Total number of matching builds (a bare JSON number)',
      content: { 'application/json': { schema: { type: 'integer' } } }
    }
  */
});

router.post('/build/purge/calculate', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Calculate which builds a purge would delete'
    #swagger.description = 'Requires authentication. Requires update permission on build (admin, operator). product and type are mandatory unless untilDate is given. When a lane field (or extras) is present in the body as null, only builds with that field unset match; fields omitted entirely are not constrained.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              version: { type: 'string' },
              team: { type: 'string' },
              browser: { type: 'string' },
              device: { type: 'string' },
              platform: { type: 'string' },
              platform_version: { type: 'string' },
              stage: { type: 'string' },
              extras: {
                type: 'object',
                description: 'Key/value pairs, matched as extras.<key>'
              },
              untilDate: {
                type: 'string',
                format: 'date-time',
                description: 'start_time < untilDate'
              },
              fromDate: {
                type: 'string',
                format: 'date-time',
                description: 'start_time >= fromDate'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Builds that would be purged',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              builds: { type: 'array', items: { type: 'string' }, description: 'Build IDs' },
              test_count: {
                type: 'integer',
                description: 'Number of tests belonging to those builds'
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Product or Type is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/purge', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Purge builds and their tests'
    #swagger.description = 'Requires authentication. Requires delete permission on build (admin only). Deletes the listed builds and their tests; quarantine records of a product/type lane are removed when no builds remain for it.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              builds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Build IDs to delete (typically from purge/calculate)'
              }
            },
            required: ['builds']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Delete result of the tests',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              n: { type: 'integer' },
              ok: { type: 'integer' },
              deletedCount: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/search', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Search latest builds per lane'
    #swagger.description = 'Requires authentication. Either pass specificQueries, or product and type (mandatory then). product/type/team/platform/stage are matched case-insensitively and exactly unless they contain ^, $ or | (then treated as a regex). Results are grouped per lane; each has aggregate_previous_runs holding the last range runs.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              specificQueries: {
                type: 'array',
                items: { type: 'object' },
                description: 'When set, used as $or query and product/type are not required'
              },
              since: {
                type: 'integer',
                default: 90,
                description: 'Look-back window in days'
              },
              range: {
                type: 'integer',
                default: 20,
                description: 'Number of previous runs kept per lane'
              },
              is_archive: { type: 'boolean', default: false },
              version: { type: 'string' },
              team: { type: 'string' },
              browser: { type: 'string' },
              device: { type: 'string' },
              platform: { type: 'string' },
              platform_version: { type: 'string' },
              stage: { type: 'string' },
              extras: { type: 'object' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Latest build per lane',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'object', description: 'Lane key' },
                product: { type: 'string' },
                type: { type: 'string' },
                version: { type: 'string' },
                browser: { type: 'string' },
                device: { type: 'string' },
                team: { type: 'string' },
                platform: { type: 'string' },
                platform_version: { type: 'string' },
                stage: { type: 'string' },
                extras: { type: 'object' },
                build: { type: 'string' },
                start_time: { type: 'string', format: 'date-time' },
                end_time: { type: 'string', format: 'date-time' },
                aggregate_last_id: { type: 'string' },
                aggregate_last_start_time: { type: 'string', format: 'date-time' },
                status: {
                  type: 'object',
                  properties: {
                    pass: { type: 'integer' },
                    fail: { type: 'integer' },
                    skip: { type: 'integer' },
                    warning: { type: 'integer' },
                    total: { type: 'integer' }
                  }
                },
                aggregate_previous_runs: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string' },
                      build: { type: 'string' },
                      start_time: { type: 'string', format: 'date-time' },
                      status: {
                        type: 'object',
                        properties: {
                          pass: { type: 'integer' },
                          fail: { type: 'integer' },
                          skip: { type: 'integer' },
                          warning: { type: 'integer' },
                          total: { type: 'integer' }
                        }
                      }
                    }
                  }
                },
                environments: { type: 'object' },
                settings: { type: 'object' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Product/Type is mandatory, or invalid regex in a field',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/build/{page}/{perPage}', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'List builds (paginated)'
    #swagger.description = 'Requires authentication. page is zero-based. perPage <= 0 becomes 10 and values above 50 are capped at 50. A negative page returns 200 with { error: true, message }. Each build carries aggregate_previous_runs with at most one earlier build of the same lane.'
    #swagger.parameters['page'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: 'Zero-based page number'
    }
    #swagger.parameters['perPage'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: 'Page size (max 50, default 10)'
    }
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              version: { type: 'string' },
              team: { type: 'string' },
              browser: { type: 'string' },
              device: { type: 'string' },
              platform: { type: 'string' },
              platform_version: { type: 'string' },
              stage: { type: 'string' },
              extras: {
                type: 'object',
                description: 'Key/value pairs, matched as extras.<key>'
              },
              untilDate: {
                type: 'string',
                format: 'date-time',
                description: 'start_time < untilDate'
              },
              sort: {
                type: 'object',
                description: 'Mongo sort spec, default { start_time: "desc" }'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Builds of the page (empty array when none)',
      content: {
        'application/json': {
          schema: { type: 'array', items: { '$ref': '#/components/schemas/Build' } }
        }
      }
    }
  */
});

// ─── Test ──────────────────────────────────────────────────────────────────────

router.get('/test/by-uid/{uid}', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get a test by UID'
    #swagger.description = 'Requires authentication. Returns the first test with this uid (selected fields only).'
    #swagger.parameters['uid'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Test summary',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              uid: { type: 'string' },
              name: { type: 'string' },
              status: { type: 'string' },
              build: { type: 'string' },
              product: { type: 'string' },
              type: { type: 'string' },
              file: { type: 'string' },
              error_message: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Test not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[500] = {
      description: 'Database error',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.get('/test/{id}', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get a test by ID'
    #swagger.description = 'Requires authentication. If no test matches, the response is 200 with a null body.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Test record',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Test' } } }
    }
  */
});

router.post('/test/single', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Upload a test screenshot'
    #swagger.description = 'Requires authentication. Requires create permission on test (admin, operator). Multipart upload, field name image; jpg/jpeg/png only, max 5 MB.'
    #swagger.requestBody = {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: { image: { type: 'string', format: 'binary' } },
            required: ['image']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Uploaded',
      content: {
        'application/json': { schema: { type: 'object', properties: { msg: { type: 'string' } } } }
      }
    }
    #swagger.responses[400] = {
      description: 'Unsupported format or no attachment',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/multi', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Create multiple tests in one request'
    #swagger.description = 'Requires authentication. Requires create permission on test (admin, operator). Maximum 100 tests per request.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              tests: {
                type: 'array',
                items: { '$ref': '#/components/schemas/Test' },
                description: 'Max 100 items (mandatory)'
              },
              isOrdered: {
                type: 'boolean',
                default: true,
                description: 'Insert in order; stops at first error when true'
              }
            },
            required: ['tests']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Insert summary',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              state: {
                type: 'string',
                description: '"Success" or a partial-success message'
              },
              provided: { type: 'integer' },
              saved: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Missing tests, or more than 100 tests',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[500] = {
      description: 'Insert error',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/status/{id}', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Update test status and comments'
    #swagger.description = 'Requires authentication. Requires update permission on test (admin, operator). Writes an audit record when status is given.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['PASS', 'FAIL', 'SKIP', 'WARNING', 'RERUN_PASS', 'RERUN_FAIL', 'RERUN_SKIP']
              },
              comments: {
                type: 'array',
                items: { type: 'object' },
                description: 'Replaces the comments list'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated test',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Test' } } }
    }
    #swagger.responses[404] = {
      description: 'Test not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/history/{uid}', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get run history of a test by UID'
    #swagger.description = 'Requires authentication. Returns runs of the uid with start_time <= before, newest first. Note: include is read unconditionally, so omitting it fails the request.'
    #swagger.parameters['uid'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              limit: { type: 'integer', default: 5, description: 'Max runs returned' },
              include: {
                oneOf: [
                  { type: 'array', items: { type: 'string' } },
                  { type: 'string' }
                ],
                description: 'Fields to return: array of names, a single name, or \'all\' for every field. Typical default: start_time, end_time, status, failure, is_rerun, build'
              },
              before: {
                type: 'string',
                format: 'date-time',
                description: 'Only runs with start_time <= before'
              }
            },
            required: ['include']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Test runs',
      content: {
        'application/json': {
          schema: { type: 'array', items: { '$ref': '#/components/schemas/Test' } }
        }
      }
    }
  */
});

router.post('/test/filter', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Filter tests of builds'
    #swagger.description = 'Requires authentication. Results sorted by uid ascending.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              build: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } }
                ],
                description: 'Build ID, or array of build IDs (mandatory)'
              },
              status: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } }
                ],
                description: 'Status or list of statuses; \'All\' matches everything'
              },
              exclude: {
                type: 'array',
                items: { type: 'string' },
                description: 'Field names to strip from each test'
              }
            },
            required: ['build']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { '$ref': '#/components/schemas/Test' } }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Build id is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/filter/all', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get all tests of builds (cached)'
    #swagger.description = 'Requires authentication. Per-build results are cached; status filtering and field exclusion are applied in memory. Includes rerun tests.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              build: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } }
                ],
                description: 'Build ID, or array of build IDs (mandatory)'
              },
              status: {
                oneOf: [
                  { type: 'string' },
                  { type: 'array', items: { type: 'string' } }
                ],
                description: 'Status or list of statuses; \'All\' matches everything'
              },
              exclude: {
                type: 'array',
                items: { type: 'string' },
                description: 'Field names to strip from each test'
              }
            },
            required: ['build']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { '$ref': '#/components/schemas/Test' } }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Build id is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/find/test/{id}', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Find a test by ID (POST)'
    #swagger.description = 'Requires authentication. Requires create permission on test (admin, operator).'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Test record',
      content: { 'application/json': { schema: { '$ref': '#/components/schemas/Test' } } }
    }
    #swagger.responses[404] = {
      description: 'Test not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/aggregate/stable', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Aggregate stable tests across builds'
    #swagger.description = 'Requires authentication. Tests (non-rerun) that have the same status, all PASS, all FAIL or all SKIP, in every given build.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              builds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Build IDs (mandatory)'
              }
            },
            required: ['builds']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Stable tests',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', description: 'Test uid' },
                size: { type: 'integer' },
                percentage_f: { type: 'number' },
                percentage_p: { type: 'number' },
                percentage_s: { type: 'number' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'builds list is mandatory (note: returned as 404)',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/aggregate/unstable', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Aggregate unstable tests across builds'
    #swagger.description = 'Requires authentication. Tests (non-rerun) whose FAIL+SKIP rate is above 0 and below 0.9, sorted by rate descending.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              builds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Build IDs (mandatory)'
              }
            },
            required: ['builds']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Unstable tests',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', description: 'Test uid' },
                percentage: { type: 'number' },
                trace: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'First letter of each status'
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'builds list is mandatory (note: returned as 404)',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/aggregate/trend', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get per-test result trend over builds'
    #swagger.description = 'Requires authentication. '
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              builds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Build IDs (mandatory)'
              }
            },
            required: ['builds']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Trend per test uid',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', description: 'Test uid' },
                trend: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      build: { type: 'string' },
                      status: { type: 'string' },
                      start_time: { type: 'string', format: 'date-time' },
                      uid: { type: 'string' },
                      id: { type: 'string' },
                      failure: {
                        type: 'object',
                        properties: {
                          token: { type: 'string' },
                          error_message: { type: 'string' },
                          stack_trace: { type: 'string' }
                        }
                      },
                      is_rerun: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'builds list is mandatory (note: returned as 404)',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/aggregate/single/history', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get history of a single test UID across builds'
    #swagger.description = 'Requires authentication. Newest first, max 500 entries, each with its build info.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { uid: { type: 'string', description: 'Mandatory' } },
            required: ['uid']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'History entries',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                uid: { type: 'string' },
                status: { type: 'string' },
                start_time: { type: 'string', format: 'date-time' },
                end_time: { type: 'string', format: 'date-time' },
                is_rerun: { type: 'boolean' },
                failure: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    error_message: { type: 'string' },
                    stack_trace: { type: 'string' }
                  }
                },
                build: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    product: { type: 'string' },
                    type: { type: 'string' },
                    team: { type: 'string' },
                    browser: { type: 'string' },
                    device: { type: 'string' },
                    version: { type: 'string' },
                    platform: { type: 'string' },
                    platform_version: { type: 'string' },
                    stage: { type: 'string' },
                    build: { type: 'string' },
                    status: {
                      type: 'object',
                      properties: {
                        pass: { type: 'integer' },
                        fail: { type: 'integer' },
                        skip: { type: 'integer' },
                        warning: { type: 'integer' },
                        total: { type: 'integer' }
                      }
                    },
                    extras: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'uid is mandatory (returned as 404)',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test/aggregate/by/failure', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Find non-passing tests by failure details'
    #swagger.description = 'Requires authentication. Non-PASS tests since the given date (default: the system analysisSinceDay setting, 30 days), newest first, optionally filtered by uid or failure fields.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              since: { type: 'string', format: 'date-time' },
              uid: { type: 'string' },
              token: { type: 'string', description: 'failure.token' },
              error_message: { type: 'string', description: 'failure.error_message' },
              stack_trace: { type: 'string', description: 'failure.stack_trace' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching test runs with build info',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                uid: { type: 'string' },
                status: { type: 'string' },
                start_time: { type: 'string', format: 'date-time' },
                end_time: { type: 'string', format: 'date-time' },
                is_rerun: { type: 'boolean' },
                failure: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    error_message: { type: 'string' },
                    stack_trace: { type: 'string' }
                  }
                },
                build: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    product: { type: 'string' },
                    type: { type: 'string' },
                    team: { type: 'string' },
                    browser: { type: 'string' },
                    device: { type: 'string' },
                    version: { type: 'string' },
                    platform: { type: 'string' },
                    platform_version: { type: 'string' },
                    stage: { type: 'string' },
                    build: { type: 'string' },
                    status: {
                      type: 'object',
                      properties: {
                        pass: { type: 'integer' },
                        fail: { type: 'integer' },
                        skip: { type: 'integer' },
                        warning: { type: 'integer' },
                        total: { type: 'integer' }
                      }
                    },
                    start_time: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
});

router.post('/test/cache/refresh', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Rebuild the test cache for builds'
    #swagger.description = 'Requires authentication. Requires delete permission on test (admin only).'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              buildIds: {
                type: 'array',
                items: { type: 'string' },
                description: '1 to 50 build IDs (mandatory)'
              }
            },
            required: ['buildIds']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Refresh summary',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              refreshed: { type: 'integer' },
              results: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    buildId: { type: 'string' },
                    status: { type: 'string' },
                    testCount: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'buildIds missing/empty or more than 50',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

// ─── TestRelation ──────────────────────────────────────────────────────────────

router.get('/test_relation/{id}', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Get a test relation by ID'
    #swagger.description = 'Requires authentication. If nothing matches, the response is 200 with a null body.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'TestRelation record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/TestRelation' } }
      }
    }
  */
});

router.post('/test_relation/total', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Count test relations'
    #swagger.description = 'Requires authentication. '
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              filter: { type: 'string', description: 'Regex matched against uid' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Total (a bare JSON number)',
      content: { 'application/json': { schema: { type: 'integer' } } }
    }
  */
});

router.post('/test_relation/filter', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Filter test relations by product and type'
    #swagger.description = 'Requires authentication. '
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              activeRegEx: {
                type: 'boolean',
                description: 'Treat product/type as case-insensitive regex'
              },
              exclude: {
                type: 'array',
                items: { type: 'string' },
                description: 'Field names to strip'
              }
            },
            required: ['product', 'type']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching test relations',
      content: {
        'application/json': {
          schema: { type: 'array', items: { '$ref': '#/components/schemas/TestRelation' } }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Product or Type is mandatory',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test_relation', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Create or update a test relation (upsert)'
    #swagger.description = 'Requires authentication. Requires create permission on relation (admin, operator). Matched by _id if given, else by uid (+ product, type when given); created when nothing matches. The whole body is applied as the update.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/TestRelation' } }
      }
    }
    #swagger.responses[200] = {
      description: 'Saved test relation',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/TestRelation' } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.delete('/test_relation/{id}', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Delete a test relation by ID'
    #swagger.description = 'Requires authentication. Requires delete permission on relation (admin, operator). Returns 200 even if nothing matched.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Delete result',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              n: { type: 'integer' },
              ok: { type: 'integer' },
              deletedCount: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/test_relation/{page}/{perPage}', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'List test relations (paginated)'
    #swagger.description = 'Requires authentication. page is zero-based. perPage <= 0 becomes 10 and values above 50 are capped at 50. A negative page returns 200 with { error: true, message }.'
    #swagger.parameters['page'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: 'Zero-based page number'
    }
    #swagger.parameters['perPage'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: 'Page size (max 50, default 10)'
    }
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              filter: { type: 'string', description: 'Regex matched against uid' },
              sort: {
                type: 'object',
                description: 'Mongo sort spec, default { uid: "desc" }'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Test relations of the page',
      content: {
        'application/json': {
          schema: { type: 'array', items: { '$ref': '#/components/schemas/TestRelation' } }
        }
      }
    }
  */
});

// ─── InvestigatedTest ──────────────────────────────────────────────────────────

router.get('/investigated_test/{id}', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Get an investigated test by ID'
    #swagger.description = 'Requires authentication. If nothing matches, the response is 200 with a null body.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'InvestigatedTest record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/InvestigatedTest' } }
      }
    }
  */
});

router.post('/investigated_test', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Create or update an investigated test (upsert)'
    #swagger.description = 'Requires authentication. With _id in the body this updates that record and needs update permission on investigate (admin, operator); without _id a new record is created and needs create permission (admin, operator). Top-level keys starting with $ are stripped. Writes a "Triaged" audit record.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/InvestigatedTest' } }
      }
    }
    #swagger.responses[200] = {
      description: 'Saved record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/InvestigatedTest' } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/investigated_test/multi', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Create multiple investigated tests'
    #swagger.description = 'Requires authentication. Requires create permission on investigate (admin, operator). The body is a JSON array. One audit record covers the whole batch. On an insert error the error object is returned with status 200.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { '$ref': '#/components/schemas/InvestigatedTest' }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Inserted records',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { '$ref': '#/components/schemas/InvestigatedTest' }
          }
        }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.delete('/investigated_test/{id}/{user}', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Remove an investigated mark'
    #swagger.description = 'Requires authentication. Admin can delete any record. Other roles need delete-own permission on investigate (operator) and {user} must equal their own user id. Writes an audit record.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.parameters['user'] = {
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'User id of the requester (must be the caller for non-admins)'
    }
    #swagger.responses[200] = {
      description: 'Removed record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/InvestigatedTest' } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/investigated_test/total', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Count investigated tests'
    #swagger.description = 'Requires authentication. '
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              filter: {
                type: 'string',
                description: 'Text matched (as escaped regex) against uid and tracking.track_number'
              },
              product: { type: 'string' },
              type: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Total (a bare JSON number)',
      content: { 'application/json': { schema: { type: 'integer' } } }
    }
  */
});

router.get('/investigated_test/customize/state/total/{id}', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Count investigated tests using a customize state'
    #swagger.description = 'Requires authentication. Counts records whose customize_state._id equals the given id.'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Customize state id'
    }
    #swagger.responses[200] = {
      description: 'Aggregation result: [{ total: n }], empty array when none',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { type: 'object', properties: { total: { type: 'integer' } } }
          }
        }
      }
    }
  */
});

router.post('/investigated_test/filter', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Filter investigated tests by product and type'
    #swagger.description = 'Requires authentication. Only records created since fromDate (default: now minus the system analysisSinceDay setting, 30 days). With activeRegEx, product/type are case-insensitive regexes and fromDate is ignored (the analysisSinceDay window is used).'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              fromDate: { type: 'string', format: 'date-time' },
              activeRegEx: { type: 'boolean' },
              exclude: {
                type: 'array',
                items: { type: 'string' },
                description: 'Field names to strip'
              }
            },
            required: ['product', 'type']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching records',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { '$ref': '#/components/schemas/InvestigatedTest' }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Product/Type is mandatory, or invalid regex pattern',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/investigated_test/comment/{id}', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Add a comment to an investigated test'
    #swagger.description = 'Requires authentication. No role check beyond authentication.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              comment: {
                type: 'object',
                description: 'Comment object appended to the comments list'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/InvestigatedTest' } }
      }
    }
    #swagger.responses[404] = {
      description: 'Cannot find investigated test',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.put('/investigated_test/comment/{id}', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Replace the comments of an investigated test'
    #swagger.description = 'Requires authentication. No role check beyond authentication.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              comments: {
                type: 'array',
                items: { type: 'object' },
                description: 'Full replacement comments list'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/InvestigatedTest' } }
      }
    }
    #swagger.responses[404] = {
      description: 'Cannot find investigated test',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/investigated_test/{page}/{perPage}', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'List investigated tests (paginated)'
    #swagger.description = 'Requires authentication. page is zero-based. perPage <= 0 becomes 10 and values above 50 are capped at 50. A negative page returns 200 with { error: true, message }.'
    #swagger.parameters['page'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: 'Zero-based page number'
    }
    #swagger.parameters['perPage'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: 'Page size (max 50, default 10)'
    }
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              filter: {
                type: 'string',
                description: 'Text matched (escaped regex) against uid and tracking.track_number'
              },
              product: { type: 'string' },
              type: { type: 'string' },
              sort: {
                type: 'object',
                description: 'Mongo sort spec, default { create_at: "desc" }'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Records of the page',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { '$ref': '#/components/schemas/InvestigatedTest' }
          }
        }
      }
    }
  */
});

// ─── Assignment ──────────────────────────────────────────────────────────────

router.get('/assignment/{id}', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Get an assignment by ID'
    #swagger.description = 'Any authenticated user.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Assignment record', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } }
    #swagger.responses[404] = { description: 'Not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/assignment/search', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Search assignments (assignments page)'
    #swagger.description = 'Any authenticated user. Sorted by assign_at descending.'
    #swagger.requestBody = {
      required: false,
      content: { 'application/json': { schema: { type: 'object', properties: { product: { type: 'string' }, type: { type: 'string' }, username: { type: 'string' }, state: { type: 'string', default: 'OPEN' }, after: { type: 'string', format: 'date-time', description: 'assign_at lower bound, default 90 days ago' }, limit: { type: 'integer', default: 200, maximum: 500 } } } } }
    }
    #swagger.responses[200] = { description: 'Assignments', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Assignment' } } } } }
  */
});

router.post('/assignment/bulk', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Bulk create or append assignments (max 50)'
    #swagger.description = 'Requires createAny assignment (operator or admin). Items without uid, product or type are skipped. An OPEN assignment for the same product/type/uid is appended to instead of creating a new one. One email per assignee is sent after the response.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['assignments'], properties: { assignments: { type: 'array', items: { type: 'object', required: ['uid', 'product', 'type'], properties: { uid: { type: 'string' }, product: { type: 'string' }, type: { type: 'string' }, user: { type: 'string', description: 'User _id' }, username: { type: 'string' }, failure: { type: 'object' }, test_url: { type: 'string' } } } } } } } }
    }
    #swagger.responses[200] = { description: 'Result counts', content: { 'application/json': { schema: { type: 'object', properties: { created: { type: 'integer' }, updated: { type: 'integer' }, total: { type: 'integer' } } } } } }
    #swagger.responses[400] = { description: 'assignments missing/empty or more than 50', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/assignment/resolve/bulk', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Bulk resolve OPEN assignments by id'
    #swagger.description = 'Role admin or operator. Sets state RESOLVED on OPEN assignments.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['ids'], properties: { ids: { type: 'array', items: { type: 'string' } } } } } }
    }
    #swagger.responses[200] = { description: 'Number resolved', content: { 'application/json': { schema: { type: 'object', properties: { resolved: { type: 'integer' } } } } } }
    #swagger.responses[400] = { description: 'ids missing/empty', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/assignment/followup', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Send follow-up reminder emails for OPEN assignments'
    #swagger.description = 'Role admin or operator. Non-admins only reach assignments they assigned themselves. The assigner is never emailed.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['ids'], properties: { ids: { type: 'array', items: { type: 'string' } } } } } }
    }
    #swagger.responses[200] = { description: 'Number of assignees emailed', content: { 'application/json': { schema: { type: 'object', properties: { sent: { type: 'integer' }, message: { type: 'string' } } } } } }
    #swagger.responses[400] = { description: 'ids missing/empty', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/assignment/filter', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Filter assignments by product/type conditions'
    #swagger.description = 'Any authenticated user. Sorted by assign_at descending. Only assignments with assign_at >= after (default: now) are returned.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or, e.g. [{ "product": "X" }]' }, type: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or, e.g. [{ "product": "X" }]' }, after: { type: 'string', format: 'date-time', description: 'Default: now' }, state: { type: 'string', default: 'OPEN' } } } } }
    }
    #swagger.responses[200] = { description: 'Assignments', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Assignment' } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/assignment', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Create an assignment (appends to an existing OPEN one for the same failure)'
    #swagger.description = 'Requires createAny assignment (operator or admin). assigned_by_user/username are set from the caller. Sends an assignment email and audits.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type', 'uid', 'failure'], properties: { product: { type: 'string' }, type: { type: 'string' }, uid: { type: 'string' }, user: { type: 'string', description: 'User _id; user or username required' }, username: { type: 'string' }, state: { type: 'string', default: 'OPEN' }, failure: { type: 'object' }, test_url: { type: 'string' }, comments: { type: 'array', items: { type: 'object' } } } } } }
    }
    #swagger.responses[200] = { description: 'Created or updated assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } }
    #swagger.responses[400] = { description: 'user/username missing, or product/type/uid missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/assignment/{id}', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Update an assignment (mainly unassign)'
    #swagger.description = 'Requires updateAny assignment (operator or admin). Applied fields: comments, username, user, state, failure. State CLOSE with username is audited as Unassign.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { state: { type: 'string' }, username: { type: 'string' }, user: { type: 'string' }, failure: { type: 'object' }, comments: { type: 'array', items: { type: 'object' } } } } } }
    }
    #swagger.responses[200] = { description: 'Updated assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'Not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.delete('/assignment/{id}', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Delete an assignment'
    #swagger.description = 'Requires deleteAny assignment (operator or admin). Audited.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'The removed assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/assignment/comment/{id}', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Add a comment to an assignment'
    #swagger.description = 'Any authenticated user.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['comment'], properties: { comment: { type: 'object', properties: { userId: { type: 'string' }, user: { type: 'string' }, time: { type: 'string', format: 'date-time' }, message: { type: 'string' }, isDeleted: { type: 'boolean', default: false } } } } } } }
    }
    #swagger.responses[200] = { description: 'Updated assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } }
    #swagger.responses[404] = { description: 'Not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/assignment/comment/{id}', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Replace the comments of an assignment'
    #swagger.description = 'Any authenticated user. The whole comments array is replaced.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['comments'], properties: { comments: { type: 'array', items: { type: 'object', properties: { userId: { type: 'string' }, user: { type: 'string' }, time: { type: 'string', format: 'date-time' }, message: { type: 'string' }, isDeleted: { type: 'boolean' } } } } } } } }
    }
    #swagger.responses[200] = { description: 'Updated assignment', content: { 'application/json': { schema: { $ref: '#/components/schemas/Assignment' } } } }
    #swagger.responses[404] = { description: 'Not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

// ─── QuarantinedTest ───────────────────────────────────────────────────────────

router.get('/quarantine', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'List quarantined test UIDs'
    #swagger.description = 'Requires authentication. '
    #swagger.parameters['product'] = { in: 'query', schema: { type: 'string' } }
    #swagger.parameters['type'] = { in: 'query', schema: { type: 'string' } }
    #swagger.parameters['is_active'] = {
      in: 'query',
      schema: { type: 'string', enum: ['true', 'false'] },
      description: 'Filter on is_active; any value other than \'true\' means false'
    }
    #swagger.parameters['scope'] = {
      in: 'query',
      schema: { type: 'string' },
      description: 'JSON-encoded build scope object'
    }
    #swagger.responses[200] = {
      description: 'Quarantined uids',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { quarantine: { type: 'array', items: { type: 'string' } } }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid scope JSON',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.post('/quarantine/filter', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Filter quarantined tests'
    #swagger.description = 'Requires authentication. '
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              is_active: { type: 'boolean' },
              uid_search: { type: 'string', description: 'Case-insensitive regex on uid' },
              min_cycle: {
                type: 'integer',
                description: 'Only records with cycle >= min_cycle (applied when > 1)'
              },
              scope: {
                type: 'object',
                description: 'Build scope: version, team, browser, device, platform, platform_version, stage (string or array of strings), extras_key or extras. Empty stored values act as wildcards.'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching quarantine records',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { '$ref': '#/components/schemas/QuarantinedTest' }
          }
        }
      }
    }
  */
});

router.get('/quarantine/history', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Get quarantine cycle history of a test'
    #swagger.description = 'Requires authentication. Newest first.'
    #swagger.parameters['uid'] = {
      in: 'query',
      required: true,
      schema: { type: 'string' },
      description: 'Test uid (mandatory)'
    }
    #swagger.parameters['product'] = { in: 'query', schema: { type: 'string' } }
    #swagger.parameters['type'] = { in: 'query', schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'History records',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                uid: { type: 'string' },
                product: { type: 'string' },
                type: { type: 'string' },
                scope: { type: 'object' },
                rule_id: { type: 'string' },
                rule_name: { type: 'string' },
                triggered_mode: { type: 'string' },
                fail_snapshot: { type: 'object' },
                build_snapshot: { type: 'object' },
                quarantined_at: { type: 'string', format: 'date-time' },
                resolved_at: { type: 'string', format: 'date-time' },
                resolved_by: { type: 'string', description: 'manual or exempt' },
                cycle: { type: 'integer' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'uid required',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.put('/quarantine/{id}', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Resolve a quarantined test'
    #swagger.description = 'Requires authentication. Sets is_active=false and resolved_at=now (server side) and records a history entry. No role check beyond authentication.'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Quarantine record id'
    }
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              is_exempt: {
                type: 'boolean',
                description: 'true marks the test exempt (resolved_by=exempt), false clears the exemption'
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/QuarantinedTest' } }
      }
    }
    #swagger.responses[404] = {
      description: 'Not found',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.delete('/quarantine', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Bulk delete quarantine records'
    #swagger.description = 'Requires authentication. Restricted to role admin. Hard delete.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'Quarantine record ids (mandatory, non-empty)'
              }
            },
            required: ['ids']
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Delete count',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { deleted: { type: 'integer' } } }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'ids array required',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

router.delete('/quarantine/{id}', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Delete a quarantine record'
    #swagger.description = 'Requires authentication. Restricted to role admin. Hard delete (release); writes an audit record. Returns 200 with a null body when nothing matched.'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'Quarantine record id'
    }
    #swagger.responses[200] = {
      description: 'Deleted record',
      content: {
        'application/json': { schema: { '$ref': '#/components/schemas/QuarantinedTest' } }
      }
    }
    #swagger.responses[403] = {
      description: 'Forbidden - role lacks permission',
      content: {
        'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } }
      }
    }
  */
});

// ─── Analytics ────────────────────────────────────────────────────────────────

router.post('/analytics/top-failures', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Get top failing tests'
    #swagger.description = 'Any authenticated user. Counts FAIL (non-rerun) results across non-archived builds matching the lane filters since the given date (default 30 days ago).'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['product', 'type'],
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              since: { description: 'Top-failures/slowest-tests: ISO date (default 30 days ago). Pass-rate/duration history: number of days (default 90).', oneOf: [{ type: 'string' }, { type: 'number' }] },
              limit: { type: 'integer', description: 'Default 10 (top-failures, slowest-tests) or 20 (histories)' },
              team: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              browser: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              device: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform_version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              stage: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              extras: { type: 'object', description: 'Key/value match on build extras.*' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Top failing tests sorted by failCount desc (empty array when no builds match)',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', description: 'Test uid' },
                name: { type: 'string' },
                failCount: { type: 'integer' },
                lastFailedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'product and type are required' }
  */
});

router.post('/analytics/pass-rate-history', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Get pass-rate trend across recent builds'
    #swagger.description = 'Any authenticated user. Sums pass/total across matching lanes per build position, oldest first. Anomaly detection (z-score, isAnomaly when zScore < -1.5) only applies with 3 or more points.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['product', 'type'],
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              since: { description: 'Top-failures/slowest-tests: ISO date (default 30 days ago). Pass-rate/duration history: number of days (default 90).', oneOf: [{ type: 'string' }, { type: 'number' }] },
              limit: { type: 'integer', description: 'Default 10 (top-failures, slowest-tests) or 20 (histories)' },
              team: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              browser: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              device: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform_version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              stage: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              extras: { type: 'object', description: 'Key/value match on build extras.*' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Pass-rate history with anomaly detection',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                build: { type: 'integer' },
                builds: { type: 'array', items: { type: 'integer' } },
                configCount: { type: 'integer' },
                start_time: { type: 'string', format: 'date-time' },
                passRate: { type: 'integer' },
                totalTests: { type: 'integer' },
                zScore: { type: 'number' },
                isAnomaly: { type: 'boolean' },
                mean: { type: 'integer' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'product and type are required' }
  */
});

router.post('/analytics/build-duration-history', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Get build duration trend across recent builds'
    #swagger.description = 'Any authenticated user. Builds without positive duration are dropped.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['product', 'type'],
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              since: { description: 'Top-failures/slowest-tests: ISO date (default 30 days ago). Pass-rate/duration history: number of days (default 90).', oneOf: [{ type: 'string' }, { type: 'number' }] },
              limit: { type: 'integer', description: 'Default 10 (top-failures, slowest-tests) or 20 (histories)' },
              team: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              browser: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              device: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform_version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              stage: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              extras: { type: 'object', description: 'Key/value match on build extras.*' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Build duration history in chronological order',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                build: { type: 'integer' },
                builds: { type: 'array', items: { type: 'integer' } },
                configCount: { type: 'integer' },
                start_time: { type: 'string', format: 'date-time' },
                durationMs: { type: 'integer' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'product and type are required' }
  */
});

router.post('/analytics/slowest-tests', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Get slowest tests by average duration'
    #swagger.description = 'Any authenticated user. Only PASS, FAIL and RERUN_PASS non-rerun results with start and end times are considered; since defaults to 30 days ago.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['product', 'type'],
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              since: { description: 'Top-failures/slowest-tests: ISO date (default 30 days ago). Pass-rate/duration history: number of days (default 90).', oneOf: [{ type: 'string' }, { type: 'number' }] },
              limit: { type: 'integer', description: 'Default 10 (top-failures, slowest-tests) or 20 (histories)' },
              team: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              browser: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              device: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              platform_version: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              stage: { description: 'String or array of strings', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              extras: { type: 'object', description: 'Key/value match on build extras.*' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Slowest tests sorted by avgDuration desc (milliseconds; empty array when no builds match)',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                _id: { type: 'string', description: 'Test uid' },
                name: { type: 'string' },
                avgDuration: { type: 'number' },
                maxDuration: { type: 'number' },
                runCount: { type: 'integer' }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'product and type are required' }
  */
});

router.post('/analytics/global-top-failures', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Get top flaky/failing tests across all products'
    #swagger.description = 'Any authenticated user. Looks at up to the 1000 most recent non-archived builds since the given date, keeps tests with at least 3 failures, sorts by fail rate and caps results at 5 per product:type lane. Response is cached server-side for 2 hours per since/limit.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              since: { description: "Look-back window: 'Nd' string (e.g. '7d'), number of days, or a date string. Default 7 days.", oneOf: [{ type: 'string' }, { type: 'number' }] },
              limit: { type: 'integer', default: 20 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Top failing tests (empty array when no builds match)',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                test_uid: { type: 'string' },
                test_name: { type: 'string' },
                product: { type: 'string' },
                type: { type: 'string' },
                stage: { type: 'string' },
                platform: { type: 'string' },
                platform_version: { type: 'string' },
                team: { type: 'string' },
                browser: { type: 'string' },
                device: { type: 'string' },
                extras: { type: 'object' },
                fail_count: { type: 'integer' },
                total_runs: { type: 'integer' },
                fail_rate: { type: 'number', description: 'Percentage, one decimal' },
                last_failed: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    }
  */
});

router.post('/analytics/global-unstable-count', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Count tests that both passed and failed in the window'
    #swagger.description = 'Any authenticated user. Counts distinct test uids with both PASS and FAIL (non-rerun) results across up to the 1000 most recent non-archived builds since the given date. Cached server-side for 2 hours per since value.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              since: { description: "Look-back window: 'Nd' string (e.g. '7d'), number of days, or a date string. Default 7 days.", oneOf: [{ type: 'string' }, { type: 'number' }] }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Unstable test count',
      content: { 'application/json': { schema: { type: 'object', properties: { count: { type: 'integer' } } } } }
    }
  */
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

router.get('/dashboard/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Get a dashboard by ID'
    #swagger.description = 'Any authenticated user. Returns 404 with { error } when not found.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Dashboard record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Dashboard' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Cannot find Dashboard with id' }
  */
});

router.get('/dashboard/byUser/:userId', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Get dashboards belonging to a user'
    #swagger.parameters['userId'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'User dashboards',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Dashboard' } }
        }
      }
    }
  */
});

router.get('/dashboard/shared/:userId', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Get public dashboards not owned by a user'
    #swagger.description = 'Returns all dashboards with is_public = true whose owner is not the given userId.'
    #swagger.parameters['userId'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Shared dashboards',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Dashboard' } }
        }
      }
    }
  */
});

router.post('/dashboard', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Create or update a dashboard'
    #swagger.description = 'Body.user is mandatory. If body._id is present the dashboard is upserted by _id, otherwise a new one is created. Requires create permission (own dashboards) or update-any permission on the dashboard component.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/Dashboard' },
              { type: 'object', required: ['user'] }
            ]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Dashboard created or updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Dashboard' }
        }
      }
    }
    #swagger.responses[400] = { description: 'UserID is mandatory (body.user missing)' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

router.put('/dashboard/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Update a dashboard by ID'
    #swagger.description = 'Body.user is mandatory. Requires update permission on own dashboards or update-any permission.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/Dashboard' },
              { type: 'object', required: ['user'] }
            ]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Dashboard updated',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Dashboard' } } }
    }
    #swagger.responses[400] = { description: 'UserID is mandatory (body.user missing)' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
    #swagger.responses[404] = { description: 'Cannot find Dashboard with id' }
  */
});

router.post('/dashboard/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Delete a dashboard by ID (uses POST)'
    #swagger.description = 'Body.user (owner id) is mandatory. Requires delete permission on own dashboards or delete-any permission. Responds with the Mongo deleteOne result.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['user'],
            properties: { user: { type: 'string', description: 'Owner user id' } }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Delete result',
      content: { 'application/json': { schema: { type: 'object', properties: { n: { type: 'integer' }, deletedCount: { type: 'integer' }, ok: { type: 'integer' } } } } }
    }
    #swagger.responses[400] = { description: 'UserID is mandatory (body.user missing)' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

router.post('/dashboard/:id/share', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Generate or regenerate a dashboard share token'
    #swagger.description = 'No request body. Requires update permission on own dashboard and the dashboard_sharing license feature (Pro).'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'New share token',
      content: { 'application/json': { schema: { type: 'object', properties: { share_token: { type: 'string' } } } } }
    }
    #swagger.responses[403] = { description: "No permission, or dashboard sharing requires a Pro license" }
    #swagger.responses[404] = { description: 'Cannot find Dashboard with id' }
  */
});

router.delete('/dashboard/:id/share', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Revoke a dashboard share token'
    #swagger.description = 'Sets share_token to null. Requires update permission on own dashboard and the dashboard_sharing license feature (Pro).'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Sharing removed',
      content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' } } } } }
    }
    #swagger.responses[403] = { description: "No permission, or dashboard sharing requires a Pro license" }
    #swagger.responses[404] = { description: 'Cannot find Dashboard with id' }
  */
});

router.post('/dashboard/widget/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Add a widget to a dashboard'
    #swagger.description = 'Body.user (dashboard owner id) is mandatory; the remaining body fields are the widget definition passed to Dashboard.addWidget. Requires update permission on own dashboard or update-any permission.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['user'],
            properties: { user: { type: 'string' } },
            additionalProperties: true
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Updated dashboard',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Dashboard' } } }
    }
    #swagger.responses[400] = { description: 'UserID is mandatory (body.user missing)' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
    #swagger.responses[404] = { description: 'Cannot find dashboard with id' }
  */
});

// ─── DashboardTemplate ────────────────────────────────────────────────────────

router.get('/template/:id', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Get a dashboard template by ID'
    #swagger.description = 'Any authenticated user.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'DashboardTemplate record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/DashboardTemplate' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.get('/template/view/all', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Get all dashboard templates'
    #swagger.description = 'Returns every template (no per-user filtering).'
    #swagger.responses[200] = {
      description: 'All templates',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/DashboardTemplate' } }
        }
      }
    }
  */
});

router.get('/template/view/public/all', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Get all public dashboard templates'
    #swagger.description = 'Requires authentication (mounted behind isAuthenticatedMid). Returns templates with is_public = true.'
    #swagger.responses[200] = {
      description: 'Public templates',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/DashboardTemplate' } }
        }
      }
    }
  */
});

router.post('/template', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Create or update a dashboard template'
    #swagger.description = 'Body.user is mandatory. If body._id is present the template is upserted by _id (requires update permission on own template); otherwise a new template is created (requires create-any permission).'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/DashboardTemplate' },
              { type: 'object', required: ['user'] }
            ]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Template created or updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/DashboardTemplate' }
        }
      }
    }
    #swagger.responses[400] = { description: 'UserID is mandatory (body.user missing)' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

router.put('/template/:id', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Update a dashboard template by ID'
    #swagger.description = 'Body.user is mandatory. Requires update permission on own template.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: '#/components/schemas/DashboardTemplate' },
              { type: 'object', required: ['user'] }
            ]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Template updated',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/DashboardTemplate' } } }
    }
    #swagger.responses[400] = { description: 'UserID is mandatory (body.user missing)' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
    #swagger.responses[404] = { description: 'Cannot find Template with id' }
  */
});

router.post('/template/:id', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Delete a dashboard template by ID (uses POST)'
    #swagger.description = 'Body.user (owner id) is mandatory. Requires delete permission on own template. Responds with the Mongo deleteOne result.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['user'],
            properties: { user: { type: 'string', description: 'Owner user id' } }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Delete result',
      content: { 'application/json': { schema: { type: 'object', properties: { n: { type: 'integer' }, deletedCount: { type: 'integer' }, ok: { type: 'integer' } } } } }
    }
    #swagger.responses[400] = { description: 'UserID is mandatory (body.user missing)' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

// ─── Setting ─────────────────────────────────────────────────────────────────

router.get('/setting/{id}', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Get a setting by ID'
    #swagger.description = 'Any authenticated user.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Setting record', content: { 'application/json': { schema: { $ref: '#/components/schemas/Setting' } } } }
    #swagger.responses[404] = { description: 'Not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.get('/setting/find/all', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Get all settings'
    #swagger.description = 'Any authenticated user.'
    #swagger.responses[200] = { description: 'All settings', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Setting' } } } } }
  */
});

router.post('/setting', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Create a new setting'
    #swagger.description = 'Admin only. Audited. notification.rules is stripped from the body when the licence does not include the notifications feature. product + type must be unique.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Setting' } } }
    }
    #swagger.responses[200] = { description: 'Setting created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Setting' } } } }
    #swagger.responses[400] = { description: 'A setting already exists with the Product and Test Type', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/setting/{id}', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Update a setting by ID'
    #swagger.description = 'Admin only. Audited. Only fields present in the body are applied (product, type, description, issue_type, product_line, component_filter, relations_filter, custom_execution_script, investigated_setting, notification, quarantine_rules, auto_triage_settings, auto_heal_settings, default_framework). Unlike create, notification.rules is NOT stripped by licence on update.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Setting' } } }
    }
    #swagger.responses[200] = { description: 'Updated setting', content: { 'application/json': { schema: { $ref: '#/components/schemas/Setting' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'Not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.delete('/setting/{id}', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Delete a setting by ID'
    #swagger.description = 'Admin only. Audited.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Mongo deleteOne result', content: { 'application/json': { schema: { type: 'object', properties: { n: { type: 'integer' }, ok: { type: 'integer' }, deletedCount: { type: 'integer' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/setting/filter', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Find the setting for a product and type'
    #swagger.description = 'Any authenticated user. Returns at most one setting.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'string' }, type: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Array with 0 or 1 setting', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Setting' } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/setting/share/with', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Find a setting that is shared with a product and type'
    #swagger.description = 'Any authenticated user. Matches share_with.product and share_with.type via aggregate (limit 1). Raw aggregate: documents are not run through the Setting schema.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'string' }, type: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Array with 0 or 1 setting', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Setting' } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

// ─── SystemSetting ───────────────────────────────────────────────────────────

router.get('/system/setting/{name}', (req, res) => {
  /*
    #swagger.tags = ['SystemSetting']
    #swagger.summary = 'Get a system setting by name (e.g. SYSTEM_SETTING)'
    #swagger.description = 'Requires readAny setting (all roles). Secrets (ai.api_key, notification.email.password, license_key, sso.*.client_secret) are returned as "••••". On write, a missing/empty/masked secret keeps the stored value. Served from the in-memory cache unless isforce=true.'
    #swagger.parameters['name'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'Setting name, e.g. SYSTEM_SETTING' }
    #swagger.parameters['isforce'] = { in: 'query', required: false, schema: { type: 'string', enum: ['true'] }, description: 'true bypasses the cache' }
    #swagger.responses[200] = { description: 'System setting (or { error } with 200 when SYSTEM_SETTING does not exist yet)', content: { 'application/json': { schema: { $ref: '#/components/schemas/SystemSetting' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'Setting name other than SYSTEM_SETTING not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/system/setting/{id}', (req, res) => {
  /*
    #swagger.tags = ['SystemSetting']
    #swagger.summary = 'Update a system setting by ID'
    #swagger.description = 'Admin only. Secrets (ai.api_key, notification.email.password, license_key, sso.*.client_secret) are returned as "••••". On write, a missing/empty/masked secret keeps the stored value. Setting license_key to a new value validates and activates the licence; clearing it reverts to community. audit_retention_days re-applies the audit TTL index. Applied fields: analysisSinceDay, advance_analysis_settings, suggested_issue_types, notification, issue_tracking, tc_management, ai, license_key, framework_presets, audit_retention_days, sso.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'SystemSetting _id' }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/SystemSetting' } } }
    }
    #swagger.responses[200] = { description: 'Updated system setting (secrets masked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/SystemSetting' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'Not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/system/setting', (req, res) => {
  /*
    #swagger.tags = ['SystemSetting']
    #swagger.summary = 'Create or update the SYSTEM_SETTING document (upsert)'
    #swagger.description = 'Admin only. Secrets (ai.api_key, notification.email.password, license_key, sso.*.client_secret) are returned as "••••". On write, a missing/empty/masked secret keeps the stored value. Upserts the document named SYSTEM_SETTING with the request body as-is (runValidators, setDefaultsOnInsert).'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/SystemSetting' } } }
    }
    #swagger.responses[200] = { description: 'System setting (secrets masked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/SystemSetting' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

// ─── AI Analysis ─────────────────────────────────────────────────────────────

router.post('/ai/analyze-test/:testId', (req, res) => {
  /*
    #swagger.tags = ['AI']
    #swagger.summary = 'Run AI root cause analysis for a failing test'
    #swagger.description = 'Requires role admin or operator and a license that includes the auto-triage feature. Results are cached by a hash of the error message and stack trace; identical failures in the same build are returned as siblingTestIds.'
    #swagger.parameters['testId'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'AI analysis result',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              result: { type: 'string' },
              cached: { type: 'boolean' },
              provider: { type: 'string' },
              model: { type: 'string' },
              siblingTestIds: { type: 'array', items: { type: 'string' } },
              created_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
    #swagger.responses[403] = { description: 'Role not admin/operator, or licence lacks auto-triage' }
    #swagger.responses[404] = { description: 'Test not found, or build not found for test' }
    #swagger.responses[503] = { description: 'AI not configured ({ error, configured: false })' }
  */
});

router.patch('/ai/analysis/feedback', (req, res) => {
  /*
    #swagger.tags = ['AI']
    #swagger.summary = 'Record human-confirmed cause for AI accuracy tracking'
    #swagger.description = 'Any authenticated user. Updates the most recent analysis record for test_id.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['test_id'],
            properties: {
              test_id: { type: 'string' },
              human_caused_by: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Feedback recorded',
      content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' }, updated: { type: 'boolean' } } } } }
    }
    #swagger.responses[400] = { description: 'test_id is required' }
  */
});

router.get('/ai/analyses', (req, res) => {
  /*
    #swagger.tags = ['AI']
    #swagger.summary = 'Fetch all AI analysis records for a product/type'
    #swagger.parameters['product'] = { in: 'query', required: true, schema: { type: 'string' } }
    #swagger.parameters['type'] = { in: 'query', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'AI analysis records, newest first (fields test_id, result, provider, model, created_at)',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
    #swagger.responses[400] = { description: 'product and type required' }
  */
});

router.get('/ai/ping', (req, res) => {
  /*
    #swagger.tags = ['AI']
    #swagger.summary = 'Check if AI provider is configured and reachable'
    #swagger.description = 'Makes a live chat call to the provider. When no provider is configured returns 200 with configured false and provider null.'
    #swagger.responses[200] = {
      description: 'AI provider status',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              configured: { type: 'boolean' },
              provider: { type: 'string', nullable: true },
              model: { type: 'string' },
              reply: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[502] = {
      description: 'Provider configured but the chat call failed',
      content: { 'application/json': { schema: { type: 'object', properties: { configured: { type: 'boolean' }, provider: { type: 'string' }, error: { type: 'string' } } } } }
    }
  */
});

router.get('/ai/configured', (req, res) => {
  /*
    #swagger.tags = ['AI']
    #swagger.summary = 'Check whether an AI provider is configured (no AI call)'
    #swagger.description = 'Any authenticated user.'
    #swagger.responses[200] = {
      description: 'Configuration status',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              configured: { type: 'boolean' },
              provider: { type: 'string', nullable: true }
            }
          }
        }
      }
    }
  */
});

// ─── Preset ──────────────────────────────────────────────────────────────────

router.get('/preset', (req, res) => {
  /*
    #swagger.tags = ['Preset']
    #swagger.summary = 'Get all presets'
    #swagger.description = 'Any authenticated user. Sorted by name.'
    #swagger.responses[200] = { description: 'List of presets', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Preset' } } } } }
  */
});

router.post('/preset', (req, res) => {
  /*
    #swagger.tags = ['Preset']
    #swagger.summary = 'Create a preset'
    #swagger.description = 'Admin only. All lanes must share the same product and type.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Preset' } } }
    }
    #swagger.responses[201] = { description: 'Preset created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Preset' } } } }
    #swagger.responses[400] = { description: 'No lanes, lanes differ in product/type, or name already exists', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Admin access required', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.put('/preset/{id}', (req, res) => {
  /*
    #swagger.tags = ['Preset']
    #swagger.summary = 'Update a preset'
    #swagger.description = 'Admin only. lanes is validated on every update (at least one lane, all sharing product and type), so it must be sent. name and description are only changed when present.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Preset' } } }
    }
    #swagger.responses[200] = { description: 'Preset updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Preset' } } } }
    #swagger.responses[400] = { description: 'Lane validation failed or name already exists', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Admin access required', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'Preset not found', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

router.delete('/preset/{id}', (req, res) => {
  /*
    #swagger.tags = ['Preset']
    #swagger.summary = 'Delete a preset'
    #swagger.description = 'Admin only.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Deleted', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Admin access required', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

// ─── User Preference ─────────────────────────────────────────────────────────

router.post('/user/preference/update/dashboard', (req, res) => {
  /*
    #swagger.tags = ['Preference']
    #swagger.summary = 'Update dashboard preference for a user'
    #swagger.description = 'Authenticated; body.user must be the caller\'s own user id (updateOwn preference). Returns the saved user. Replaces settings.dashboard with body.dashboard.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['user'], properties: { user: { type: 'string', description: 'User _id' }, dashboard: { type: 'object', properties: { isShowWidgetBorder: { type: 'boolean' }, isExpandMenu: { type: 'boolean' }, isWidgetBarOnHover: { type: 'boolean' } } } } } } }
    }
    #swagger.responses[200] = { description: 'Updated user document (password blanked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[400] = { description: 'user missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/preference/update/report', (req, res) => {
  /*
    #swagger.tags = ['Preference']
    #swagger.summary = 'Update report preference for a user'
    #swagger.description = 'Authenticated; body.user must be the caller\'s own user id (updateOwn preference). Returns the saved user. Replaces settings.report with body.report.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['user'], properties: { user: { type: 'string', description: 'User _id' }, report: { type: 'object', properties: { generalConfig: { type: 'object' }, assignmentRI: { type: 'integer' }, displaySelfAN: { type: 'boolean' }, displaySearchAndFilterBoxInStep: { type: 'boolean' }, status: { type: 'object' } } } } } } }
    }
    #swagger.responses[200] = { description: 'Updated user document (password blanked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[400] = { description: 'user missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/preference/update/language', (req, res) => {
  /*
    #swagger.tags = ['Preference']
    #swagger.summary = 'Update language preference for a user'
    #swagger.description = 'Authenticated; body.user must be the caller\'s own user id (updateOwn preference). Returns the saved user. Replaces settings.language with body.language.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['user'], properties: { user: { type: 'string', description: 'User _id' }, language: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Updated user document (password blanked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[400] = { description: 'user missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/preference/update/theme', (req, res) => {
  /*
    #swagger.tags = ['Preference']
    #swagger.summary = 'Update theme preference for a user'
    #swagger.description = 'Authenticated; body.user must be the caller\'s own user id (updateOwn preference). Returns the saved user. Replaces settings.theme with body.theme.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['user'], properties: { user: { type: 'string', description: 'User _id' }, theme: { type: 'object', properties: { name: { type: 'string' }, type: { type: 'string' } } } } } } }
    }
    #swagger.responses[200] = { description: 'Updated user document (password blanked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[400] = { description: 'user missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/preference/update/filter-favorites', (req, res) => {
  /*
    #swagger.tags = ['Preference']
    #swagger.summary = 'Update filter favorites preference for a user'
    #swagger.description = 'Authenticated; body.user must be the caller\'s own user id (updateOwn preference). Returns the saved user. Replaces settings.filter_favorites with body.filter_favorites.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['user'], properties: { user: { type: 'string', description: 'User _id' }, filter_favorites: { type: 'array', items: { type: 'object' } } } } } }
    }
    #swagger.responses[200] = { description: 'Updated user document (password blanked)', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }
    #swagger.responses[400] = { description: 'user missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
    #swagger.responses[404] = { description: 'User not found', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

// ─── User Favorite ───────────────────────────────────────────────────────────

router.get('/user/favorite/{id}', (req, res) => {
  /*
    #swagger.tags = ['UserFavorite']
    #swagger.summary = 'Get favorites of a user'
    #swagger.description = 'Authenticated; the id/userid must be the caller\'s own user id (own-only: viewer, operator, admin).'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'User _id (userid)' }
    #swagger.responses[200] = { description: 'Favorites document, or null when none exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserFavorite' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/user/favorite', (req, res) => {
  /*
    #swagger.tags = ['UserFavorite']
    #swagger.summary = 'Create or update favorites (upsert by userid)'
    #swagger.description = 'Authenticated; the body.userid must be the caller\'s own user id (own-only: viewer, operator, admin). Applied on update: username, executions, pinned, ceses, workspaces.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/UserFavorite' } } }
    }
    #swagger.responses[200] = { description: 'Saved favorites', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserFavorite' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.put('/user/favorite/{id}', (req, res) => {
  /*
    #swagger.tags = ['UserFavorite']
    #swagger.summary = 'Update favorites of a user (upserts when none exists)'
    #swagger.description = 'Authenticated; the id/userid must be the caller\'s own user id (own-only: viewer, operator, admin).'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'User _id (userid)' }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/UserFavorite' } } }
    }
    #swagger.responses[200] = { description: 'Saved favorites', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserFavorite' } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.delete('/user/favorite/{id}', (req, res) => {
  /*
    #swagger.tags = ['UserFavorite']
    #swagger.summary = 'Delete favorites'
    #swagger.description = 'Authenticated; the id/userid must be the caller\'s own user id (own-only: viewer, operator, admin). Quirk in the code: the permission check compares id with the caller\'s user id, but the delete filter is { _id: id } (the favorites document id), so it only deletes when both coincide.'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'User _id (permission check) and favorites _id (delete filter)' }
    #swagger.responses[200] = { description: 'Mongo deleteOne result', content: { 'application/json': { schema: { type: 'object', properties: { n: { type: 'integer' }, ok: { type: 'integer' }, deletedCount: { type: 'integer' } } } } } }
    #swagger.responses[403] = { description: 'Forbidden (insufficient role)', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

// ─── Shared (dashboard share token) ──────────────────────────────────────────

router.post('/shared/build/filter', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Filter builds'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. since/after are exclusive bounds (start_time > since, < after).'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or, e.g. [{ "product": "X" }]' }, type: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' }, range: { type: 'integer', default: 5, description: 'Max builds returned' }, is_archive: { type: 'boolean', default: false }, since: { type: 'string', format: 'date-time', description: 'Lower bound on start_time' }, after: { type: 'string', format: 'date-time', description: 'Upper bound on start_time' }, version: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' }, team: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' }, browser: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' }, device: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' }, platform: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' }, platform_version: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' }, stage: { type: 'array', items: { type: 'object' }, description: 'Array of Mongo conditions used as $or' } } } } }
    }
    #swagger.responses[200] = { description: 'Builds sorted by start_time descending', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Build' } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/build/search', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Search builds grouped by lane'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { product: { type: 'string', description: 'Exact (case-insensitive) match, or regex when it starts with ^, ends with $ or contains |' }, type: { type: 'string', description: 'Same rules as product' }, specificQueries: { type: 'array', items: { type: 'object' }, description: 'Overrides product/type: used as a Mongo $or' }, since: { type: 'integer', description: 'Look back N days. Default 90' }, range: { type: 'integer', default: 20, description: 'Number of previous runs kept per lane' }, is_archive: { type: 'boolean', default: false }, version: { type: 'string', description: 'Regex' }, team: { type: 'string' }, browser: { type: 'string', description: 'Regex' }, device: { type: 'string', description: 'Regex' }, platform: { type: 'string' }, platform_version: { type: 'string', description: 'Regex' }, stage: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'One entry per lane with its latest build and previous runs', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { _id: { type: 'string' }, product: { type: 'string' }, type: { type: 'string' }, version: { type: 'string' }, team: { type: 'string' }, browser: { type: 'string' }, device: { type: 'string' }, platform: { type: 'string' }, platform_version: { type: 'string' }, stage: { type: 'string' }, build: { type: 'integer' }, start_time: { type: 'string', format: 'date-time' }, end_time: { type: 'string', format: 'date-time' }, aggregate_last_id: { type: 'string' }, aggregate_last_start_time: { type: 'string', format: 'date-time' }, status: { type: 'object' }, aggregate_previous_runs: { type: 'array', items: { type: 'object', properties: { _id: { type: 'string' }, build: { type: 'integer' }, start_time: { type: 'string', format: 'date-time' }, status: { type: 'object' } } } }, environments: { type: 'object' }, settings: { type: 'object' } } } } } } }
    #swagger.responses[400] = { description: 'Product/type missing or invalid regex', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.get('/shared/build/entity/producttype', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'List distinct product and type values'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = { description: 'Two single-key objects', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { product: { type: 'array', items: { type: 'string' } }, type: { type: 'array', items: { type: 'string' } } } } } } } }
  */
});

router.post('/shared/build/entity/recommend', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Recommend lane parameter combinations for a product and type'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. Builds in the last "since" days are grouped into distinct lane combinations. Regex fields are checked for safety.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'string' }, type: { type: 'string' }, since: { type: 'integer', default: 300 }, version: { type: 'string' }, team: { type: 'string' }, browser: { type: 'string' }, device: { type: 'string' }, platform: { type: 'string' }, platform_version: { type: 'string' }, stage: { type: 'string' }, extras: { type: 'object' } } } } }
    }
    #swagger.responses[200] = { description: '{ _id, recommends[], total } (or [] when nothing matches)', content: { 'application/json': { schema: { type: 'object', properties: { _id: { type: 'string' }, total: { type: 'integer' }, recommends: { type: 'array', items: { type: 'object', properties: { product: { type: 'string' }, type: { type: 'string' }, team: { type: 'string' }, version: { type: 'string' }, browser: { type: 'string' }, device: { type: 'string' }, platform: { type: 'string' }, platform_version: { type: 'string' }, stage: { type: 'string' }, extras: { type: 'object' } } } } } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing, or invalid regex', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/test/filter', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Filter tests of one or more builds'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['build'], properties: { build: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }], description: 'Build _id or array of build _ids' }, status: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }], description: 'PASS, FAIL, WARNING, SKIP or All' }, exclude: { type: 'array', items: { type: 'string' }, description: 'Field names to omit' } } } } }
    }
    #swagger.responses[200] = { description: 'Tests sorted by uid', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Test' } } } } }
    #swagger.responses[400] = { description: 'Build id missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/test/filter/all', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Filter all tests of builds (cached, step bodies excluded)'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. Results are served from the cache (key test:v2:<buildId>) and omit setup, body and teardown. status filter is applied after loading.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['build'], properties: { build: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }], description: 'Build _id or array of build _ids' }, status: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }], description: 'PASS, FAIL, WARNING, SKIP or All' }, exclude: { type: 'array', items: { type: 'string' }, description: 'Field names to omit' } } } } }
    }
    #swagger.responses[200] = { description: 'Tests', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Test' } } } } }
    #swagger.responses[400] = { description: 'Build id missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/test/aggregate/stable', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Tests with a constant status across builds'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. Tests whose pass, fail or skip rate is exactly 100 percent over the given builds (reruns excluded).'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['builds'], properties: { builds: { type: 'array', items: { type: 'string' }, description: 'Build _ids' } } } } }
    }
    #swagger.responses[200] = { description: 'Aggregated entries', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { _id: { type: 'string', description: 'test uid' }, percentage_f: { type: 'number' }, percentage_p: { type: 'number' }, percentage_s: { type: 'number' }, size: { type: 'integer' } } } } } } }
    #swagger.responses[404] = { description: 'builds list missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/test/aggregate/unstable', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Flaky tests across builds'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. Tests whose fail+skip rate is between 0 and 0.9 exclusive (reruns excluded), sorted by percentage descending.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['builds'], properties: { builds: { type: 'array', items: { type: 'string' }, description: 'Build _ids' } } } } }
    }
    #swagger.responses[200] = { description: 'Aggregated entries', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { _id: { type: 'string', description: 'test uid' }, percentage: { type: 'number' }, trace: { type: 'array', items: { type: 'string' } } } } } } } }
    #swagger.responses[404] = { description: 'builds list missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/test/aggregate/trend', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Per-test status trend across builds'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['builds'], properties: { builds: { type: 'array', items: { type: 'string' }, description: 'Build _ids' } } } } }
    }
    #swagger.responses[200] = { description: 'Per-uid trends', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { _id: { type: 'string', description: 'test uid' }, trend: { type: 'array', items: { type: 'object', properties: { build: { type: 'string' }, status: { type: 'string' }, start_time: { type: 'string', format: 'date-time' }, failure: { type: 'object' }, is_rerun: { type: 'boolean' } } } } } } } } } }
    #swagger.responses[404] = { description: 'builds list missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/investigated_test/filter', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Filter investigated tests of a product and type'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. Limited to the last analysisSinceDay days (system setting, default 30) unless fromDate is given.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'string' }, type: { type: 'string' }, fromDate: { type: 'string', format: 'date-time' }, exclude: { type: 'array', items: { type: 'string' } }, activeRegEx: { type: 'boolean', description: 'Treat product/type as regexes (checked for safety)' } } } } }
    }
    #swagger.responses[200] = { description: 'Investigated tests', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/InvestigatedTest' } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing, or invalid regex', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/test_relation/filter', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Filter test relations of a product and type'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'string' }, type: { type: 'string' }, exclude: { type: 'array', items: { type: 'string' } }, activeRegEx: { type: 'boolean' } } } } }
    }
    #swagger.responses[200] = { description: 'Test relations', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TestRelation' } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing, or invalid regex', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/setting/filter', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Find the setting for a product and type'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. Returns at most one setting.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { type: 'object', required: ['product', 'type'], properties: { product: { type: 'string' }, type: { type: 'string' } } } } }
    }
    #swagger.responses[200] = { description: 'Array with 0 or 1 setting', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Setting' } } } } }
    #swagger.responses[400] = { description: 'Product or Type missing', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.post('/shared/quarantine/filter', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Filter quarantined tests'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited. When scope is given, each scope field matches either empty or one of the given values (scope.* in [\'\', ...values]), and extras are matched through extras_key.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.requestBody = {
      required: false,
      content: { 'application/json': { schema: { type: 'object', properties: { product: { type: 'string' }, type: { type: 'string' }, is_active: { type: 'boolean' }, scope: { type: 'object', properties: { version: { type: 'string' }, team: { type: 'string' }, browser: { type: 'string' }, device: { type: 'string' }, platform: { type: 'string' }, platform_version: { type: 'string' }, stage: { type: 'string' }, extras: { type: 'object' }, extras_key: { type: 'string' } } } } } } }
    }
    #swagger.responses[200] = { description: 'Quarantined tests', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/QuarantinedTest' } } } } }
  */
});

router.get('/shared/ai/analyses', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'AI analysis records for a product and type'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.parameters['product'] = { in: 'query', required: true, schema: { type: 'string' } }
    #swagger.parameters['type'] = { in: 'query', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Records (test_id, result, provider, model, created_at), newest first', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { test_id: { type: 'string' }, result: { type: 'object' }, provider: { type: 'string' }, model: { type: 'string' }, created_at: { type: 'string', format: 'date-time' } } } } } } }
    #swagger.responses[400] = { description: 'product and type required', content: { 'application/json': { schema: { type: 'object', properties: { error: { type: 'string' } } } } } }
  */
});

router.get('/shared/dashboard', (req, res) => {
  /*
    #swagger.tags = ['Shared']
    #swagger.summary = 'Get the dashboard that owns the share token'
    #swagger.description = 'Mounted at /api/shared. Authorization: Bearer <dashboard share_token> (not a user API token); any other token gets 401. Rate limited.'
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.responses[200] = { description: 'Dashboard resolved from the token', content: { 'application/json': { schema: { $ref: '#/components/schemas/Dashboard' } } } }
    #swagger.responses[401] = { description: 'Invalid or missing share token', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } }
  */
});

// ─── Audit ────────────────────────────────────────────────────────────────────

router.post('/audit/filter', (req, res) => {
  /*
    #swagger.tags = ['Audit']
    #swagger.summary = 'Get audit history for one test'
    #swagger.description = 'Any authenticated user. Returns audit entries for the given product/type/uid created since the given date, newest first.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['product', 'type', 'uid', 'since'],
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              uid: { type: 'string', description: 'Test uid' },
              since: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Audit log entries (newest first)',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
    #swagger.responses[400] = { description: 'Product, Type, UID or Since is mandatory' }
  */
});

router.post('/audit/admin/filter', (req, res) => {
  /*
    #swagger.tags = ['Audit']
    #swagger.summary = 'Search the global audit log (admin)'
    #swagger.description = 'Admin only (requires read-any permission on audit). Paginated, newest first.'
    #swagger.requestBody = {
      required: false,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              page: { type: 'integer', default: 1 },
              perPage: { type: 'integer', default: 50 },
              since: { type: 'string', format: 'date-time' },
              until: { type: 'string', format: 'date-time' },
              username: { type: 'string' },
              entity_type: { description: 'Single value or array of values', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
              audit_type: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Audit records page',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              records: { type: 'array', items: { type: 'object' } },
              total: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

// ─── DbStats ──────────────────────────────────────────────────────────────────
// Mounted at /api/admin/db

router.get('/admin/db/stats', (req, res) => {
  /*
    #swagger.tags = ['DbStats']
    #swagger.summary = 'Get builds/tests collection storage statistics'
    #swagger.description = 'Requires read permission on the setting component (all roles). Sizes are in bytes; *Formatted fields are human-readable.'
    #swagger.responses[200] = {
      description: 'Collection stats',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              collections: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', enum: ['builds', 'tests'] },
                    count: { type: 'integer' },
                    storageSize: { type: 'integer' },
                    sizeFormatted: { type: 'string' },
                    indexSize: { type: 'integer' },
                    indexSizeFormatted: { type: 'string' }
                  }
                }
              },
              total: {
                type: 'object',
                properties: {
                  storageSize: { type: 'integer' },
                  sizeFormatted: { type: 'string' },
                  indexSize: { type: 'integer' },
                  indexSizeFormatted: { type: 'string' }
                }
              },
              raw: {
                type: 'object',
                description: 'Raw collStats output',
                properties: { builds: { type: 'object', nullable: true }, tests: { type: 'object', nullable: true } }
              }
            }
          }
        }
      }
    }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

router.post('/admin/db/estimate/before-date', (req, res) => {
  /*
    #swagger.tags = ['DbStats']
    #swagger.summary = 'Estimate space freed by deleting builds and tests before a date'
    #swagger.description = 'Requires read permission on the setting component. Counts builds and tests whose start_time is before untilDate (and on/after fromDate when given).'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['untilDate'],
            properties: {
              untilDate: { type: 'string', format: 'date-time', description: 'Exclusive upper bound on start_time' },
              fromDate: { type: 'string', format: 'date-time', description: 'Optional inclusive lower bound' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Estimate',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              buildCount: { type: 'integer' },
              testCount: { type: 'integer' },
              estimatedBytes: { type: 'integer' },
              sizeFormatted: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Missing or invalid parameter' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

router.post('/admin/db/estimate/strip-steps', (req, res) => {
  /*
    #swagger.tags = ['DbStats']
    #swagger.summary = 'Estimate space freed by stripping steps from tests before a date'
    #swagger.description = 'Requires read permission on the setting component. Sampled estimate (up to 300 tests) of the step data (setup/body/teardown) size.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['untilDate'],
            properties: {
              untilDate: { type: 'string', format: 'date-time', description: 'Exclusive upper bound on test start_time' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Estimate',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              testCount: { type: 'integer' },
              estimatedBytes: { type: 'integer' },
              sizeFormatted: { type: 'string' },
              note: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Missing or invalid parameter' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

router.post('/admin/db/purge/strip-steps', (req, res) => {
  /*
    #swagger.tags = ['DbStats']
    #swagger.summary = 'Remove steps from all tests before a date'
    #swagger.description = 'Admin only. Unsets setup, body and teardown on every test whose start_time is before untilDate. Destructive.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['untilDate'],
            properties: {
              untilDate: { type: 'string', format: 'date-time', description: 'Exclusive upper bound on test start_time' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Purge result',
      content: { 'application/json': { schema: { type: 'object', properties: { modifiedCount: { type: 'integer' } } } } }
    }
    #swagger.responses[400] = { description: 'untilDate is required or not a valid date' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

router.post('/admin/db/estimate/by-lane', (req, res) => {
  /*
    #swagger.tags = ['DbStats']
    #swagger.summary = 'Estimate space freed by deleting all builds of a product/type lane'
    #swagger.description = 'Requires read permission on the setting component. Counts all builds under product+type and their tests.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['product', 'type'],
            properties: {
              product: { type: 'string' },
              type: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Estimate',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              buildCount: { type: 'integer' },
              testCount: { type: 'integer' },
              estimatedBytes: { type: 'integer' },
              sizeFormatted: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Missing or invalid parameter' }
    #swagger.responses[403] = { description: "You don't have permission to perform this action" }
  */
});

// ─── Plugins ──────────────────────────────────────────────────────────────────
// Mounted at /api/plugins

router.get('/plugins', (req, res) => {
  /*
    #swagger.tags = ['Plugins']
    #swagger.summary = 'List loaded plugins'
    #swagger.description = 'Any authenticated user.'
    #swagger.responses[200] = {
      description: 'Loaded plugins with versions',
      content: { 'application/json': { schema: { type: 'object', properties: { plugins: { type: 'array', items: { type: 'object' } } } } } }
    }
  */
});

router.get('/plugins/available', (req, res) => {
  /*
    #swagger.tags = ['Plugins']
    #swagger.summary = 'List plugins available on the Feature Server'
    #swagger.description = 'Any authenticated user. Proxies GET /features on the Feature Server using the configured enterprise license token.'
    #swagger.responses[200] = {
      description: 'Available plugins',
      content: { 'application/json': { schema: { type: 'object', properties: { features: { type: 'array', items: { type: 'object' } } } } } }
    }
    #swagger.responses[400] = { description: 'No enterprise license token configured' }
    #swagger.responses[502] = { description: 'Feature server unreachable or invalid response' }
    #swagger.responses[503] = { description: 'FEATURE_SERVER_URL not configured' }
  */
});

router.post('/plugins/:name/install', (req, res) => {
  /*
    #swagger.tags = ['Plugins']
    #swagger.summary = 'Download a plugin from the Feature Server and load it'
    #swagger.description = 'Admin only. Requires a valid license that includes the plugin feature (auto-heal maps to the auto-triage feature) and auto-heal requires auto-triage to be loaded. If the plugin is already loaded the files are updated and restartRequired is true; otherwise it is hot-loaded.'
    #swagger.parameters['name'] = { in: 'path', required: true, schema: { type: 'string', pattern: '^[a-z0-9-]+$' }, description: 'Plugin name' }
    #swagger.responses[200] = {
      description: 'Install result',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              installed: { type: 'boolean' },
              loaded: { type: 'boolean' },
              restartRequired: { type: 'boolean' },
              name: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid plugin name, auto-triage missing, or no license token' }
    #swagger.responses[403] = { description: 'Not admin, no valid license, or license lacks the feature' }
    #swagger.responses[500] = { description: 'Download/extract failed or plugin failed to load' }
    #swagger.responses[503] = { description: 'FEATURE_SERVER_URL not configured' }
  */
});

router.post('/plugins/:name/upload', (req, res) => {
  /*
    #swagger.tags = ['Plugins']
    #swagger.summary = 'Upload a plugin bundle (.tar.gz)'
    #swagger.description = 'Admin only. For air-gapped installs. Same license and auto-triage checks as install. Max 50MB.'
    #swagger.parameters['name'] = { in: 'path', required: true, schema: { type: 'string', pattern: '^[a-z0-9-]+$' }, description: 'Plugin name' }
    #swagger.requestBody = {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['bundle'],
            properties: { bundle: { type: 'string', format: 'binary', description: 'Plugin .tar.gz bundle' } }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Install result',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              installed: { type: 'boolean' },
              loaded: { type: 'boolean' },
              restartRequired: { type: 'boolean' },
              name: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid plugin name, no file uploaded, or auto-triage missing' }
    #swagger.responses[403] = { description: 'Not admin, no valid license, or license lacks the feature' }
    #swagger.responses[500] = { description: 'Extract failed or plugin failed to load' }
  */
});

router.get('/plugins/agent/download', (req, res) => {
  /*
    #swagger.tags = ['Plugins']
    #swagger.summary = 'Download the ureport-agent bundle (.tar.gz)'
    #swagger.description = 'Any authenticated user, no license gate. Serves agent/ureport-agent.tar.gz.'
    #swagger.responses[200] = {
      description: 'Agent bundle',
      content: { 'application/octet-stream': { schema: { type: 'string', format: 'binary' } } }
    }
    #swagger.responses[404] = { description: 'Agent bundle not found' }
  */
});

router.get('/plugins/agent/download/zip', (req, res) => {
  /*
    #swagger.tags = ['Plugins']
    #swagger.summary = 'Download the ureport-agent bundle (.zip)'
    #swagger.description = 'Any authenticated user, no license gate. Serves agent/ureport-agent.zip.'
    #swagger.responses[200] = {
      description: 'Agent bundle',
      content: { 'application/octet-stream': { schema: { type: 'string', format: 'binary' } } }
    }
    #swagger.responses[404] = { description: 'Agent bundle not found' }
  */
});

router.post('/plugins/:name/load', (req, res) => {
  /*
    #swagger.tags = ['Plugins']
    #swagger.summary = 'Hot-load a plugin that is already on disk'
    #swagger.description = 'Admin only. First load only; an already loaded plugin returns 409.'
    #swagger.parameters['name'] = { in: 'path', required: true, schema: { type: 'string', pattern: '^[a-z0-9-]+$' }, description: 'Plugin name' }
    #swagger.responses[200] = {
      description: 'Plugin loaded',
      content: { 'application/json': { schema: { type: 'object', properties: { loaded: { type: 'boolean' }, name: { type: 'string' } } } } }
    }
    #swagger.responses[400] = { description: 'Failed to load plugin' }
    #swagger.responses[403] = { description: 'Not admin' }
    #swagger.responses[409] = { description: 'Plugin already loaded; restart server to update' }
  */
});

// ─── MCP ──────────────────────────────────────────────────────────────────────
// NOTE: mounted at /mcp, outside the /api prefix (full URL is {host}/mcp).

router.post('/mcp', (req, res) => {
  /*
    #swagger.tags = ['MCP']
    #swagger.summary = 'Model Context Protocol endpoint (Streamable HTTP)'
    #swagger.description = 'Mounted at /mcp, NOT under /api (full URL is {host}/mcp). Stateless MCP Streamable HTTP transport (JSON-RPC 2.0 messages); a new server is created per request. Requires an API token via Authorization: Bearer or an authenticated session. The Accept header is forced to application/json, text/event-stream. Exposes ureport read tools (builds, tests, statistics, presets, relation fields, new failures).'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object', description: 'JSON-RPC 2.0 request, notification or batch' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'JSON-RPC response (application/json or text/event-stream)',
      content: { 'application/json': { schema: { type: 'object' } } }
    }
    #swagger.responses[401] = { description: 'Invalid or missing API token / session' }
  */
});

module.exports = router;
