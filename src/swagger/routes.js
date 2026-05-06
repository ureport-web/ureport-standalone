/**
 * Swagger route documentation file.
 * This file is NEVER loaded by Express — it exists solely for swagger-autogen to scan.
 *
 * Maintenance contract: when a route is added/changed in a .coffee route file,
 * update this file accordingly and run `npm run swagger` to regenerate swagger_output.json.
 */

const express = require('express');
const router = express.Router();

// ─── Version ────────────────────────────────────────────────────────────────

router.get('/version', (req, res) => {
  /*
    #swagger.tags = ['Version']
    #swagger.summary = 'Get application version'
    #swagger.security = []
    #swagger.responses[200] = {
      description: 'Version info',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              version: { type: 'string' },
              isDemo: { type: 'boolean' }
            }
          }
        }
      }
    }
  */
});

// ─── Authentication ──────────────────────────────────────────────────────────

router.post('/login', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Log in with username and password'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/LoginRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/LoginResponse' }
        }
      }
    }
    #swagger.responses[401] = { description: 'Invalid credentials' }
    #swagger.responses[403] = { description: 'Account not active' }
  */
});

router.post('/logout', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Log out current session'
    #swagger.responses[200] = { description: 'Logged out successfully' }
  */
});

router.post('/user/signup', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Register a new user account'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/User' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Signup successful, pending approval' }
    #swagger.responses[400] = { description: 'Validation error or duplicate username' }
  */
});

router.get('/user/confirm-email/:token', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Confirm email address via token'
    #swagger.security = []
    #swagger.parameters['token'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Email confirmed' }
    #swagger.responses[400] = { description: 'Invalid or expired token' }
  */
});

router.post('/user/token', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Generate an API token for the current user'
    #swagger.responses[200] = {
      description: 'Token generated',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { token: { type: 'string' } }
          }
        }
      }
    }
  */
});

router.delete('/user/token', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Revoke the current API token'
    #swagger.responses[200] = { description: 'Token revoked' }
  */
});

router.post('/user/forgot', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Request a password reset email'
    #swagger.security = []
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { email: { type: 'string' } }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Reset email sent if account exists' }
  */
});

router.post('/user/reset/:token', (req, res) => {
  /*
    #swagger.tags = ['Authentication']
    #swagger.summary = 'Reset password using token'
    #swagger.security = []
    #swagger.parameters['token'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { password: { type: 'string' } }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Password reset successful' }
    #swagger.responses[400] = { description: 'Invalid token or password' }
  */
});

// ─── User ────────────────────────────────────────────────────────────────────

router.post('/user/:page/:perPage', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'List users (paginated)'
    #swagger.parameters['page'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.parameters['perPage'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.responses[200] = {
      description: 'Paginated user list',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
              total: { type: 'integer' }
            }
          }
        }
      }
    }
  */
});

router.post('/user/total', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Get total user count'
    #swagger.responses[200] = {
      description: 'Total count',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { total: { type: 'integer' } } }
        }
      }
    }
  */
});

router.post('/user/search', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Search users'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: { query: { type: 'string' } }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching users',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
        }
      }
    }
  */
});

router.put('/user/update/:username', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Update user profile'
    #swagger.parameters['username'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/User' }
        }
      }
    }
    #swagger.responses[200] = { description: 'User updated' }
    #swagger.responses[404] = { description: 'User not found' }
  */
});

router.delete('/user/:id', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Delete a user'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'User deleted' }
    #swagger.responses[404] = { description: 'User not found' }
  */
});

router.get('/user/pending', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'List users pending approval'
    #swagger.responses[200] = {
      description: 'Pending users',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
        }
      }
    }
  */
});

router.put('/user/approve/:id', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Approve a pending user'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'User approved' }
    #swagger.responses[404] = { description: 'User not found' }
  */
});

router.put('/user/reject/:id', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Reject a pending user'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'User rejected' }
    #swagger.responses[404] = { description: 'User not found' }
  */
});

router.post('/user/change-password', (req, res) => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = 'Change current user password'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['currentPassword', 'newPassword'],
            properties: {
              currentPassword: { type: 'string' },
              newPassword: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Password changed' }
    #swagger.responses[400] = { description: 'Current password incorrect' }
  */
});

// ─── Build ───────────────────────────────────────────────────────────────────

router.get('/build/:id', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get a build by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Build record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Build' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Build not found' }
  */
});

router.post('/build', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Create or update a build'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Build' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Build created or updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Build' }
        }
      }
    }
  */
});

router.put('/build/:id', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Update a build by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Build' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Build updated' }
    #swagger.responses[404] = { description: 'Build not found' }
  */
});

router.delete('/build/:id', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Delete a build by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Build deleted' }
    #swagger.responses[404] = { description: 'Build not found' }
  */
});

router.put('/build/status/:id', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Update build status counters'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/BuildStatusUpdate' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Status updated' }
  */
});

router.post('/build/status/calculate/:id', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Recalculate build status from test results'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Status recalculated' }
  */
});

router.post('/build/status/latest', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get latest build status for given product/type'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Latest build with status',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Build' }
        }
      }
    }
  */
});

router.post('/build/comment/:id', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Add a comment to a build'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Comment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Comment added' }
  */
});

router.put('/build/comment/:id', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Update a build comment'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Comment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Comment updated' }
  */
});

router.post('/build/outage/:buildId', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Report an outage for a build'
    #swagger.parameters['buildId'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Outage recorded' }
  */
});

router.post('/build/outage/comment/:buildId', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Add a comment to a build outage'
    #swagger.parameters['buildId'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Comment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Outage comment added' }
  */
});

router.post('/build/filter', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Filter builds'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Filtered builds',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Build' } }
        }
      }
    }
  */
});

router.get('/build/entity/read', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get distinct product/type entities from builds'
    #swagger.responses[200] = {
      description: 'Entity list',
      content: {
        'application/json': {
          schema: { type: 'array', items: { type: 'object' } }
        }
      }
    }
  */
});

router.get('/build/entity/producttype', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get distinct product/type combinations'
    #swagger.responses[200] = {
      description: 'Product-type combinations',
      content: {
        'application/json': {
          schema: { type: 'array', items: { type: 'object' } }
        }
      }
    }
  */
});

router.post('/build/entity/recommend', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get entity recommendations based on partial input'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object', properties: { query: { type: 'string' } } }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Recommended entities',
      content: {
        'application/json': {
          schema: { type: 'array', items: { type: 'object' } }
        }
      }
    }
  */
});

router.post('/build/entity/others', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get other entity values (version, team, stage, etc.)'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Entity values',
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    }
  */
});

router.post('/build/total', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Get total build count'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Total count',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { total: { type: 'integer' } } }
        }
      }
    }
  */
});

router.post('/build/purge/calculate', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Calculate which builds would be purged'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              keepBuilds: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Builds that would be purged',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Build' } }
        }
      }
    }
  */
});

router.post('/build/purge', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Purge old builds'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              keepBuilds: { type: 'integer' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Builds purged' }
  */
});

router.post('/build/search', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'Search builds by keyword'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object', properties: { query: { type: 'string' } } }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching builds',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Build' } }
        }
      }
    }
  */
});

router.post('/build/:page/:perPage', (req, res) => {
  /*
    #swagger.tags = ['Build']
    #swagger.summary = 'List builds (paginated)'
    #swagger.parameters['page'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.parameters['perPage'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Paginated builds',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/Build' } },
              total: { type: 'integer' }
            }
          }
        }
      }
    }
  */
});

// ─── Test ────────────────────────────────────────────────────────────────────

router.get('/test/:id', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get a test by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Test record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Test' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Test not found' }
  */
});

router.post('/test/multi', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Create multiple tests in one request'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/MultiTests' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Tests created' }
  */
});

router.post('/test/status/:id', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Update test status'
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
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Status updated' }
  */
});

router.post('/test/history/:uid', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get test run history by UID'
    #swagger.parameters['uid'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Test history',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Test' } }
        }
      }
    }
  */
});

router.post('/test/filter', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Filter tests'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Filtered tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Test' } }
        }
      }
    }
  */
});

router.post('/test/filter/nonpass', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Filter non-passing tests (FAIL, SKIP, WARNING)'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Non-passing tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Test' } }
        }
      }
    }
  */
});

router.post('/test/filter/all', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Filter all tests without status restriction'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'All matching tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Test' } }
        }
      }
    }
  */
});

router.post('/test/aggregate/stable', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Aggregate stable (consistently passing) tests'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Stable test aggregation',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

router.post('/test/aggregate/unstable', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Aggregate unstable (flaky) tests'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Unstable test aggregation',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

router.post('/test/aggregate/trend', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get test result trend over builds'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Trend data',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

router.post('/test/aggregate/single/history', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Get history aggregation for a single test UID'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              uid: { type: 'string' },
              product: { type: 'string' },
              type: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Single test history aggregation',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

router.post('/test/aggregate/by/failure', (req, res) => {
  /*
    #swagger.tags = ['Test']
    #swagger.summary = 'Aggregate tests grouped by failure token'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Tests grouped by failure',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

// ─── TestRelation ─────────────────────────────────────────────────────────────

router.get('/test_relation/:id', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Get a test relation by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'TestRelation record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/TestRelation' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.post('/test_relation/total', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Get total test relation count'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Total count',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { total: { type: 'integer' } } }
        }
      }
    }
  */
});

router.post('/test_relation/filter', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Filter test relations'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Filtered test relations',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/TestRelation' } }
        }
      }
    }
  */
});

router.post('/test_relation', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Create or update a test relation'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/TestRelation' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'TestRelation created or updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/TestRelation' }
        }
      }
    }
  */
});

router.delete('/test_relation/:id', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'Delete a test relation by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'TestRelation deleted' }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.post('/test_relation/:page/:perPage', (req, res) => {
  /*
    #swagger.tags = ['TestRelation']
    #swagger.summary = 'List test relations (paginated)'
    #swagger.parameters['page'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.parameters['perPage'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Paginated test relations',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/TestRelation' } },
              total: { type: 'integer' }
            }
          }
        }
      }
    }
  */
});

// ─── InvestigatedTest ─────────────────────────────────────────────────────────

router.get('/investigated_test/:id', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Get an investigated test by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'InvestigatedTest record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/InvestigatedTest' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.post('/investigated_test', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Create or update an investigated test'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/InvestigatedTest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'InvestigatedTest created or updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/InvestigatedTest' }
        }
      }
    }
  */
});

router.post('/investigated_test/multi', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Get multiple investigated tests by UIDs'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              uids: { type: 'array', items: { type: 'string' } },
              product: { type: 'string' },
              type: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Matching investigated tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/InvestigatedTest' } }
        }
      }
    }
  */
});

router.delete('/investigated_test/:id/:user', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Delete an investigated test by ID and user'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.parameters['user'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'InvestigatedTest deleted' }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.post('/investigated_test/total', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Get total investigated test count'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Total count',
      content: {
        'application/json': {
          schema: { type: 'object', properties: { total: { type: 'integer' } } }
        }
      }
    }
  */
});

router.get('/investigated_test/customize/state/total/:id', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Get customize state totals for a build'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' }, description: 'Build ID' }
    #swagger.responses[200] = {
      description: 'Customize state totals',
      content: { 'application/json': { schema: { type: 'object' } } }
    }
  */
});

router.post('/investigated_test/filter', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Filter investigated tests'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Filtered investigated tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/InvestigatedTest' } }
        }
      }
    }
  */
});

router.post('/investigated_test/comment/:id', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Add a comment to an investigated test'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Comment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Comment added' }
  */
});

router.put('/investigated_test/comment/:id', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'Update a comment on an investigated test'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Comment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Comment updated' }
  */
});

router.post('/investigated_test/:page/:perPage', (req, res) => {
  /*
    #swagger.tags = ['InvestigatedTest']
    #swagger.summary = 'List investigated tests (paginated)'
    #swagger.parameters['page'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.parameters['perPage'] = { in: 'path', required: true, schema: { type: 'integer' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Paginated investigated tests',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/InvestigatedTest' } },
              total: { type: 'integer' }
            }
          }
        }
      }
    }
  */
});

// ─── Assignment ───────────────────────────────────────────────────────────────

router.get('/assignment/:id', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Get an assignment by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Assignment record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Assignment' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.post('/assignment/filter', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Filter assignments'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/FilterRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Filtered assignments',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Assignment' } }
        }
      }
    }
  */
});

router.post('/assignment', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Create or update an assignment'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Assignment' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Assignment created or updated',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Assignment' }
        }
      }
    }
  */
});

router.put('/assignment/:id', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Update an assignment by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Assignment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Assignment updated' }
  */
});

router.delete('/assignment/:id', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Delete an assignment by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Assignment deleted' }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.post('/assignment/comment/:id', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Add a comment to an assignment'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Comment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Comment added' }
  */
});

router.put('/assignment/comment/:id', (req, res) => {
  /*
    #swagger.tags = ['Assignment']
    #swagger.summary = 'Update a comment on an assignment'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Comment' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Comment updated' }
  */
});

// ─── QuarantinedTest ──────────────────────────────────────────────────────────

router.post('/quarantine/filter', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Filter quarantined tests'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              is_active: { type: 'boolean' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Filtered quarantined tests',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/QuarantinedTest' } }
        }
      }
    }
  */
});

router.put('/quarantine/:id', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Resolve (un-quarantine) a test'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resolved_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Test resolved (is_active set to false)' }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.delete('/quarantine/:id', (req, res) => {
  /*
    #swagger.tags = ['QuarantinedTest']
    #swagger.summary = 'Delete a quarantined test record'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Quarantined test deleted' }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

// ─── Analytics ────────────────────────────────────────────────────────────────

router.post('/analytics/top-failures', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Get top failing tests'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              limit: { type: 'integer', default: 10 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Top failing tests',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

router.post('/analytics/slowest-tests', (req, res) => {
  /*
    #swagger.tags = ['Analytics']
    #swagger.summary = 'Get slowest tests by average duration'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              type: { type: 'string' },
              limit: { type: 'integer', default: 10 }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Slowest tests',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

// ─── Dashboard ────────────────────────────────────────────────────────────────

router.get('/dashboard/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Get a dashboard by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Dashboard record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Dashboard' }
        }
      }
    }
    #swagger.responses[404] = { description: 'Not found' }
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
    #swagger.summary = 'Get dashboards shared with a user'
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
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Dashboard' }
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
  */
});

router.put('/dashboard/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Update a dashboard by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Dashboard' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Dashboard updated' }
  */
});

router.post('/dashboard/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Delete a dashboard by ID (uses POST)'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Dashboard deleted' }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

router.post('/dashboard/:id/share', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Share a dashboard with users'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              users: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Dashboard shared' }
  */
});

router.delete('/dashboard/:id/share', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Remove sharing from a dashboard'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Sharing removed' }
  */
});

router.post('/dashboard/widget/:id', (req, res) => {
  /*
    #swagger.tags = ['Dashboard']
    #swagger.summary = 'Add or update a widget on a dashboard'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Widget saved' }
  */
});

// ─── DashboardTemplate ────────────────────────────────────────────────────────

router.get('/template/:id', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Get a dashboard template by ID'
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
    #swagger.summary = 'Get all templates visible to the current user'
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
    #swagger.security = []
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
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/DashboardTemplate' }
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
  */
});

router.put('/template/:id', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Update a dashboard template by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/DashboardTemplate' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Template updated' }
  */
});

router.post('/template/:id', (req, res) => {
  /*
    #swagger.tags = ['DashboardTemplate']
    #swagger.summary = 'Delete a dashboard template by ID (uses POST)'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Template deleted' }
    #swagger.responses[404] = { description: 'Not found' }
  */
});

// ─── Setting ──────────────────────────────────────────────────────────────────

router.get('/setting/:id', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Get a setting by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'Setting record',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Setting' }
        }
      }
    }
  */
});

router.get('/setting/find/all', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Get all settings'
    #swagger.responses[200] = {
      description: 'All settings',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Setting' } }
        }
      }
    }
  */
});

router.post('/setting', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Create a new setting'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Setting' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Setting created',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Setting' }
        }
      }
    }
  */
});

router.put('/setting/:id', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Update a setting by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Setting' }
        }
      }
    }
    #swagger.responses[200] = { description: 'Setting updated' }
  */
});

router.delete('/setting/:id', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Delete a setting by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = { description: 'Setting deleted' }
  */
});

router.post('/setting/filter', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Filter settings'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Filtered settings',
      content: {
        'application/json': {
          schema: { type: 'array', items: { $ref: '#/components/schemas/Setting' } }
        }
      }
    }
  */
});

router.post('/setting/share/with', (req, res) => {
  /*
    #swagger.tags = ['Setting']
    #swagger.summary = 'Share a setting with users'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              settingId: { type: 'string' },
              users: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      }
    }
    #swagger.responses[200] = { description: 'Setting shared' }
  */
});

// ─── SystemSetting ────────────────────────────────────────────────────────────

router.get('/system/setting/:name', (req, res) => {
  /*
    #swagger.tags = ['SystemSetting']
    #swagger.summary = 'Get a system setting by name'
    #swagger.parameters['name'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.responses[200] = {
      description: 'System setting value',
      content: { 'application/json': { schema: { type: 'object' } } }
    }
  */
});

router.put('/system/setting/:id', (req, res) => {
  /*
    #swagger.tags = ['SystemSetting']
    #swagger.summary = 'Update a system setting by ID'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    }
    #swagger.responses[200] = { description: 'System setting updated' }
  */
});

router.post('/system/setting', (req, res) => {
  /*
    #swagger.tags = ['SystemSetting']
    #swagger.summary = 'Create a system setting'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object' }
        }
      }
    }
    #swagger.responses[200] = { description: 'System setting created' }
  */
});

// ─── Audit ────────────────────────────────────────────────────────────────────

router.post('/audit/filter', (req, res) => {
  /*
    #swagger.tags = ['Audit']
    #swagger.summary = 'Filter audit log entries'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              user: { type: 'string' },
              action: { type: 'string' },
              from: { type: 'string', format: 'date-time' },
              to: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Audit log entries',
      content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
    }
  */
});

module.exports = router;
