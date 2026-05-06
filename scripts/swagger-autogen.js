const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const path = require('path');

const doc = {
  info: {
    title: 'UReport API',
    version: '2.0.0',
    description: 'UReport REST API'
  },
  servers: [{ url: '/api' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer' },
      sessionAuth: { type: 'apiKey', in: 'cookie', name: 'session' }
    },
    '@schemas': {
      User: {
        type: 'object',
        required: ['username', 'password', 'email', 'role'],
        properties: {
          username: { type: 'string' },
          displayname: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'operator', 'viewer'] },
          password: { type: 'string' },
          position: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'active', 'rejected'] },
          settings: {
            type: 'object',
            properties: {
              language: { type: 'string', default: 'en' },
              theme: {
                type: 'object',
                properties: {
                  name: { type: 'string', default: 'bootstrap' },
                  type: { type: 'string', default: 'light' }
                }
              },
              dashboard: {
                type: 'object',
                properties: {
                  isShowWidgetBorder: { type: 'boolean', default: false },
                  isExpandMenu: { type: 'boolean', default: false },
                  isWidgetBarOnHover: { type: 'boolean', default: false }
                }
              },
              report: {
                type: 'object',
                properties: {
                  assignmentRI: { type: 'integer', default: 30 },
                  displaySelfAN: { type: 'boolean', default: false },
                  displaySearchAndFilterBoxInStep: { type: 'boolean', default: true },
                  status: {
                    type: 'object',
                    properties: {
                      pass: { type: 'boolean', default: false },
                      rerun: { type: 'boolean', default: false },
                      fail: { type: 'boolean', default: true },
                      skip: { type: 'boolean', default: true }
                    }
                  }
                }
              }
            }
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          session: { type: 'string' },
          sessionId: { type: 'string' }
        }
      },
      Build: {
        type: 'object',
        required: ['product', 'type', 'build'],
        properties: {
          product: { type: 'string', example: 'Reporting', description: 'The product name of the software.' },
          type: { type: 'string', example: 'API or UI or Regression or Smoke', description: 'The type of the automation.' },
          build: { type: 'integer', example: 100, description: 'Build number of the execution.' },
          version: { type: 'string', example: '1.0.0' },
          team: { type: 'string', example: 'Team Alpha' },
          stage: { type: 'string', example: 'staging', description: 'Stage of the automation run (e.g. staging, production).' },
          browser: {
            type: 'string',
            enum: ['Chrome', 'Firefox', 'Edge', 'Safari', 'Opera', 'IE', 'Internet Explorer', 'Electron', 'chromium'],
            example: 'Chrome'
          },
          device: { type: 'string', example: 'Windows VM or Pixel 2' },
          platform: { type: 'string', example: 'iOS or Windows' },
          platform_version: { type: 'string', example: '13.0.4 or 10' },
          start_time: { type: 'string', format: 'date-time' },
          end_time: { type: 'string', format: 'date-time' },
          owner: { type: 'string', example: 'admin' },
          is_archive: { type: 'boolean', default: false },
          status: {
            type: 'object',
            properties: {
              pass: { type: 'integer', default: 0 },
              fail: { type: 'integer', default: 0 },
              skip: { type: 'integer', default: 0 },
              warning: { type: 'integer', default: 0 },
              total: { type: 'integer', default: 0 }
            }
          },
          environments: { type: 'object', description: 'Environment variables of the automation run.' },
          settings: { type: 'object', description: 'Settings variables of the automation run.' },
          client: { type: 'string', example: 'VM-01', description: 'If provided, settings/environments are saved under the client name.' }
        }
      },
      BuildStatusUpdate: {
        type: 'object',
        properties: {
          pass: { type: 'integer' },
          fail: { type: 'integer' },
          skip: { type: 'integer' },
          warning: { type: 'integer' },
          total: { type: 'integer' }
        }
      },
      Test: {
        type: 'object',
        required: ['uid', 'build', 'name', 'status'],
        properties: {
          uid: {
            type: 'string',
            example: '11120 or test.login.component',
            description: 'Unique identifier of the test case.'
          },
          build: { type: 'string', example: '6156f5ad744820091c9305b1', description: 'ID of the build.' },
          name: { type: 'string', example: 'test.login.component' },
          status: {
            type: 'string',
            enum: ['PASS', 'FAIL', 'SKIP', 'WARNING', 'RERUN_PASS', 'RERUN_FAIL', 'RERUN_SKIP'],
            description: 'Status of the test run.'
          },
          start_time: { type: 'string', format: 'date-time' },
          end_time: { type: 'string', format: 'date-time' },
          failure: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              error_message: { type: 'string' },
              stack_trace: { type: 'string' }
            }
          },
          is_rerun: { type: 'boolean', default: false },
          info: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              duration: { type: 'string' },
              file: { type: 'string' },
              path: { type: 'string' }
            }
          },
          setup: { type: 'array', items: { '$ref': '#/components/schemas/TestStep' } },
          body: { type: 'array', items: { '$ref': '#/components/schemas/TestStep' } },
          teardown: { type: 'array', items: { '$ref': '#/components/schemas/TestStep' } }
        }
      },
      TestStep: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['PASS', 'FAIL', 'SKIP', 'INFO'] },
          detail: { type: 'string' },
          attachment: {
            type: 'object',
            properties: {
              screenshot: { type: 'string', description: 'Base64 encoded screenshot.' },
              type: { type: 'string', enum: ['base64'] }
            }
          }
        }
      },
      MultiTests: {
        type: 'object',
        properties: {
          tests: { type: 'array', items: { '$ref': '#/components/schemas/Test' } }
        }
      },
      TestRelation: {
        type: 'object',
        required: ['uid', 'product', 'type'],
        properties: {
          uid: { type: 'string' },
          product: { type: 'string' },
          type: { type: 'string' },
          file: { type: 'string' },
          path: { type: 'string' },
          components: { type: 'object' },
          teams: { type: 'array', items: { type: 'object' } },
          tags: { type: 'array', items: { type: 'object' }, description: 'Flexible tag objects (Mixed type).' },
          customs: { type: 'object', description: 'Any custom key-value pairs (Mixed type).' }
        }
      },
      InvestigatedTest: {
        type: 'object',
        properties: {
          uid: { type: 'string' },
          product: { type: 'string' },
          type: { type: 'string' },
          user: { type: 'string' },
          caused_by: { type: 'string', default: 'Defect', description: 'Root cause category.' },
          tracking: { type: 'string', description: 'Tracking ticket reference.' },
          failure: { type: 'object' },
          origin: { type: 'string' },
          comments: { type: 'array', items: { type: 'object' } },
          configuration: { type: 'object' },
          customize_state: { type: 'string' }
        }
      },
      Assignment: {
        type: 'object',
        properties: {
          product: { type: 'string' },
          type: { type: 'string' },
          user: { type: 'string' },
          username: { type: 'string' },
          uid: { type: 'string' },
          state: { type: 'string', default: 'OPEN' },
          failure: { type: 'object' },
          test_url: { type: 'string' },
          assign_at: { type: 'string', format: 'date-time' },
          comments: { type: 'array', items: { type: 'object' } }
        }
      },
      QuarantinedTest: {
        type: 'object',
        properties: {
          uid: { type: 'string' },
          product: { type: 'string' },
          type: { type: 'string' },
          rule_id: { type: 'string' },
          rule_name: { type: 'string' },
          quarantined_at: { type: 'string', format: 'date-time' },
          fail_snapshot: { type: 'object' },
          build_snapshot: { type: 'object' },
          is_active: { type: 'boolean', default: true },
          is_exempt: { type: 'boolean', default: false },
          resolved_at: { type: 'string', format: 'date-time' }
        }
      },
      Comment: {
        type: 'object',
        properties: {
          content: { type: 'string' }
        }
      },
      FilterRequest: {
        type: 'object',
        properties: {
          product: { type: 'string' },
          type: { type: 'string' }
        }
      },
      Setting: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'object' }
        }
      },
      Dashboard: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          product: { type: 'string' },
          type: { type: 'string' },
          widgets: { type: 'array', items: { type: 'object' } }
        }
      },
      DashboardTemplate: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          widgets: { type: 'array', items: { type: 'object' } },
          is_public: { type: 'boolean', default: false }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const root = path.resolve(__dirname, '..');
swaggerAutogen(
  path.join(root, 'swagger_output.json'),
  [path.join(root, 'src/swagger/routes.js')],
  doc
);
