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
          assigned_by_user: { type: 'string' },
          assigned_by_username: { type: 'string' },
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
        required: ['product', 'type'],
        description: 'Per product/type setting. (product, type) is unique.',
        properties: {
          _id: { type: 'string' },
          product: { type: 'string' },
          type: { type: 'string' },
          description: { type: 'string' },
          issue_type: { type: 'object', description: 'Free-form (Mixed).' },
          product_line: { type: 'object', description: 'Free-form (Mixed).' },
          component_filter: { type: 'object', description: 'Free-form (Mixed).' },
          relations_filter: { type: 'object', description: 'Free-form (Mixed).' },
          default_framework: { type: 'string' },
          custom_execution_script: {
            type: 'array',
            items: {
              type: 'object',
              properties: { _id: { type: 'string' }, name: { type: 'string' }, type: { type: 'string' }, script: { type: 'string' } }
            }
          },
          investigated_setting: {
            type: 'object',
            properties: {
              sharePL: { type: 'array', items: { type: 'object', properties: { product: { type: 'string' }, type: { type: 'string' } } } },
              customize_state: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: { label: { type: 'string' }, key: { type: 'string' }, color: { type: 'string' }, ttl: { type: 'number' } }
                }
              }
            }
          },
          notification: {
            type: 'object',
            description: 'Free-form (Mixed). Only notification.rules is read by the notifications plugin (on build completion). On create, rules is stripped when the licence lacks the notifications feature.',
            properties: {
              rules: {
                type: 'array',
                description: 'No rules, or no enabled rule, means no notification is sent. A rule whose scope is blank matches every lane of the product/type.',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    enabled: { type: 'boolean', description: 'Only enabled rules are evaluated.' },
                    scope: {
                      type: 'object',
                      description: 'Build must equal every non-empty field.',
                      properties: {
                        version: { type: 'string' },
                        team: { type: 'string' },
                        browser: { type: 'string' },
                        device: { type: 'string' },
                        platform: { type: 'string' },
                        platform_version: { type: 'string' },
                        stage: { type: 'string' },
                        extras: { type: 'object', additionalProperties: { type: 'string' }, description: 'Every key/value must equal the build extras.' }
                      }
                    },
                    filter: {
                      type: 'object',
                      properties: {
                        statuses: { type: 'array', items: { type: 'string' }, default: ['FAIL'] },
                        search: { type: 'string', description: 'Case-insensitive regex matched against test uid or name.' },
                        relations: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              type: { type: 'string', description: 'tags, teams, components or a custom relation key.' },
                              values: { type: 'array', items: { type: 'string' } }
                            }
                          }
                        },
                        logic: { type: 'string', enum: ['AND', 'OR'], default: 'AND', description: 'How relation conditions combine.' }
                      }
                    },
                    recipients: { type: 'array', items: { type: 'string' }, description: 'User _ids; users without an email are skipped.' }
                  }
                }
              }
            }
          },
          quarantine_rules: {
            type: 'object',
            properties: {
              builds: { type: 'number' },
              min_builds: { type: 'number' },
              min_pass_rate: { type: 'number' },
              max_window_days: { type: 'number' },
              rules: {
                type: 'array',
                description: 'No rules, or no enabled rule, means quarantine does nothing for this product/type. A rule whose scope is blank matches every lane.',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    enabled: { type: 'boolean' },
                    scope: {
                      type: 'object',
                      properties: {
                        version: { type: 'string' }, team: { type: 'string' }, browser: { type: 'string' }, device: { type: 'string' },
                        platform: { type: 'string' }, platform_version: { type: 'string' }, stage: { type: 'string' }, extras: { type: 'object' }
                      }
                    },
                    filter: {
                      type: 'object',
                      properties: {
                        logic: { type: 'string' },
                        name_pattern: { type: 'string' },
                        relations: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, values: { type: 'array', items: { type: 'string' } } } } }
                      }
                    },
                    threshold: {
                      type: 'object',
                      properties: {
                        conditions: {
                          type: 'array',
                          items: { type: 'object', properties: { mode: { type: 'string' }, failures: { type: 'number' }, fail_rate: { type: 'number' } } }
                        },
                        resolve_passes: { type: 'number' },
                        min_pass_rate: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          },
          auto_triage_settings: {
            type: 'object',
            properties: {
              enabled: { type: 'boolean', default: false },
              max_source_age_days: { type: 'number', default: 30 },
              ttl_days: { type: 'number', default: 5 },
              scope_filter: {
                type: 'object',
                properties: {
                  logic: { type: 'string' },
                  relations: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, values: { type: 'array', items: { type: 'string' } } } } }
                }
              }
            }
          },
          auto_heal_settings: {
            type: 'object',
            description: 'Auto-heal runs for a build only when enabled is true and at least one enabled entry of scopes matches the build. An empty scopes list means nothing runs; an entry with a blank scope matches every lane of the product/type.',
            properties: {
              enabled: { type: 'boolean', default: false },
              scopes: {
                type: 'array',
                description: 'Lanes auto-heal is allowed to run for. Empty list: nothing runs. Same scope matching as notification and quarantine rules.',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    enabled: { type: 'boolean', default: true, description: 'Only enabled scopes are evaluated.' },
                    scope: {
                      type: 'object',
                      description: 'Build must equal every non-empty field; a blank scope matches every lane.',
                      properties: {
                        version: { type: 'string' }, team: { type: 'string' }, browser: { type: 'string' }, device: { type: 'string' },
                        platform: { type: 'string' }, platform_version: { type: 'string' }, stage: { type: 'string' },
                        extras: { type: 'object', additionalProperties: { type: 'string' }, description: 'Every key/value must equal the build extras.' }
                      }
                    }
                  }
                }
              },
              dispatch_mode: { type: 'string', enum: ['agent', 'external'], default: 'agent' },
              default_playbook_id: { type: 'string', description: 'HealPlaybook _id used by auto-trigger in agent mode.' },
              exclude_quarantined: { type: 'boolean', default: false },
              new_failures_only: { type: 'boolean', default: true },
              dedup_days: { type: 'number', default: 7, description: 'Days a signal for the same test, error and lane blocks a new one (1-90). A signal with an open PR blocks until it expires.' },
              max_failure_rate: { type: 'number', default: 0, description: 'Skip the whole build when more than this percent of its tests fail (likely an outage); 0 disables.' },
              max_prior_failures: { type: 'number', default: 3, description: 'Skip a test that failed in the last N consecutive builds; 0 disables.' },
              max_signals_per_trigger: { type: 'number', default: 10 },
              exclude_rules: {
                type: 'array',
                deprecated: true,
                description: 'No longer used by auto-trigger. Exclusions are managed with /ai/heal/exclusions.',
                items: {
                  type: 'object',
                  properties: {
                    pattern: { type: 'string' },
                    match_type: { type: 'string', enum: ['contains', 'equals', 'regex'], default: 'contains' }
                  }
                }
              },
              additional_instructions: { type: 'string', default: '', description: 'Extra guidance copied onto each signal for external consumers.' }
            }
          }
        }
      },
      SystemSetting: {
        type: 'object',
        description: 'Singleton document named SYSTEM_SETTING. Secrets are returned as "••••" and a masked or empty secret on write keeps the stored value.',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'SYSTEM_SETTING' },
          analysisSinceDay: { type: 'number', default: 30 },
          advance_analysis_settings: { type: 'object', description: 'Free-form (Mixed).' },
          suggested_issue_types: { type: 'object', description: 'Free-form (Mixed).' },
          notification: {
            type: 'object',
            description: 'Free-form (Mixed).',
            properties: {
              url: { type: 'string', description: 'Base URL used in reset-password and notification email links.' },
              email: {
                type: 'object',
                description: 'SMTP settings used for all outgoing mail. Email is skipped when user is empty, or when password is empty and provider is not smtp.',
                properties: {
                  provider: { type: 'string', enum: ['gmail', 'outlook', 'smtp'], default: 'gmail', description: 'gmail and outlook supply default host/port/secure.' },
                  user: { type: 'string', description: 'SMTP user, also used as the From address.' },
                  password: { type: 'string', description: 'Masked on read.' },
                  host: { type: 'string' },
                  port: { type: 'number' },
                  secure: { type: 'boolean' }
                }
              }
            }
          },
          issue_tracking: { type: 'object', description: 'Free-form (Mixed).' },
          tc_management: { type: 'object', description: 'Free-form (Mixed).' },
          ai: { type: 'object', description: 'Free-form (Mixed). ai.api_key is masked on read.' },
          license_key: { type: 'string', nullable: true, description: 'Masked on read. A new value is validated and activated; null reverts to community.' },
          framework_presets: { type: 'object', description: 'Free-form (Mixed).' },
          audit_retention_days: { type: 'number', default: 90 },
          sso: { type: 'object', description: 'Per-provider config (shape owned by the SSO plugin). Each provider client_secret is masked on read.' },
          heal_agent: { type: 'object', description: 'Owned by the auto-heal plugin; not applied by PUT /system/setting/{id}.' }
        }
      },
      Preset: {
        type: 'object',
        required: ['name', 'lanes'],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', description: 'Unique.' },
          description: { type: 'string' },
          lanes: {
            type: 'array',
            description: 'At least one lane; all lanes must share the same product and type.',
            items: {
              type: 'object',
              properties: {
                product: { type: 'string' },
                type: { type: 'string' },
                version: { type: 'string' },
                browser: { type: 'string' },
                platform: { type: 'string' },
                platform_version: { type: 'string' },
                team: { type: 'string' },
                stage: { type: 'string' },
                device: { type: 'string' },
                extras: { type: 'object', additionalProperties: { type: 'string' } }
              }
            }
          }
        }
      },
      UserFavorite: {
        type: 'object',
        required: ['userid', 'username'],
        properties: {
          _id: { type: 'string' },
          userid: { type: 'string', description: 'Owner user _id.' },
          username: { type: 'string', description: '2 to 20 characters.' },
          pinned: {
            type: 'array',
            items: {
              type: 'object',
              required: ['product', 'type', 'uid'],
              properties: {
                product: { type: 'string' }, type: { type: 'string' }, uid: { type: 'string' },
                originBuild: { type: 'string' }, originDate: { type: 'string', format: 'date-time' }, comments: { type: 'object' }
              }
            }
          },
          executions: {
            type: 'array',
            items: { type: 'object', properties: { name: { type: 'string' }, build: { type: 'string' }, comments: { type: 'object' } } }
          },
          ceses: {
            type: 'array',
            items: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' }, type: { type: 'string' }, script: { type: 'string' } } }
          },
          workspaces: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name'],
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                product_lines: { type: 'array', items: { type: 'object', properties: { query: { type: 'object' }, bookmark_build: { type: 'object' } } } }
              }
            }
          }
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
      },
      HealExclusionScope: {
        type: 'object',
        description: 'Lane of a build. A rule or a lane applies to a build that equals every non-empty field; a blank scope matches every lane.',
        properties: {
          version: { type: 'string' }, team: { type: 'string' }, browser: { type: 'string' }, device: { type: 'string' },
          platform: { type: 'string' }, platform_version: { type: 'string' }, stage: { type: 'string' },
          extras: { type: 'object', additionalProperties: { type: 'string' }, description: 'Every key/value must equal the build extras.' }
        }
      },
      HealExclusion: {
        type: 'object',
        description: 'A test auto-heal must not open signals for.',
        properties: {
          id:             { type: 'string' },
          product:        { type: 'string' },
          type:           { type: 'string' },
          scope:          { '$ref': '#/components/schemas/HealExclusionScope' },
          target:         { type: 'string', enum: ['error', 'uid', 'path'], description: 'What the rule looks at: the error message, the test uid, or the test file / path.' },
          match:          { type: 'string', enum: ['equals', 'contains', 'starts_with', 'ends_with', 'regex'] },
          value:          { type: 'string' },
          reason:         { type: 'string' },
          source:         { type: 'string', enum: ['user', 'agent'] },
          createdBy:      { type: 'string', nullable: true },
          createdAt:      { type: 'string', format: 'date-time' },
          sourceSignalId: { type: 'string', nullable: true, description: 'The external signal that led an agent to add the rule.' },
          expiresAt:      { type: 'string', format: 'date-time', nullable: true },
          expired:        { type: 'boolean' },
          lastMatchedAt:  { type: 'string', format: 'date-time', nullable: true, description: 'Last time the rule kept a failure from getting a signal.' },
          matchCount:     { type: 'integer', description: 'How many failures the rule has kept from getting a signal, over all builds.' }
        }
      },
      HealPlaybook: {
        type: 'object',
        properties: {
          _id:        { type: 'string' },
          name:       { type: 'string' },
          product:    { type: 'string', description: 'Null = applies to all products.' },
          type:       { type: 'string', description: 'Null = applies to all types.' },
          enabled:    { type: 'boolean', default: true },
          auto_trigger: { type: 'boolean', default: false, description: 'Auto-trigger on new failures matching this lane.' },
          steps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                step_id:    { type: 'string' },
                type:       { type: 'string', enum: ['checkout', 'ai/fix', 'run/test', 'create_pr/github', 'create_pr/gitlab', 'notify/slack'] },
                config:     { type: 'object', description: 'Step-specific configuration.' }
              }
            }
          },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      HealPlaybookInput: {
        type: 'object',
        required: ['name', 'steps'],
        properties: {
          name:         { type: 'string' },
          product:      { type: 'string' },
          type:         { type: 'string' },
          enabled:      { type: 'boolean', default: true },
          auto_trigger: { type: 'boolean', default: false },
          steps: {
            type: 'array',
            items: {
              type: 'object',
              required: ['step_id', 'type'],
              properties: {
                step_id: { type: 'string', example: 'checkout' },
                type:    { type: 'string', enum: ['checkout', 'ai/fix', 'run/test', 'create_pr/github', 'create_pr/gitlab', 'notify/slack'] },
                config:  { type: 'object' }
              }
            }
          }
        }
      },
      RerunConfigInput: {
        type: 'object',
        required: ['name', 'product', 'type', 'run_command'],
        properties: {
          name:        { type: 'string' },
          product:     { type: 'string' },
          type:        { type: 'string' },
          run_command: { type: 'string', example: 'npx playwright test {file} --grep "{name}"', description: 'Command template. Supports {file}, {name}, {uid} placeholders.' },
          working_dir: { type: 'string', description: 'Working directory for the run command (relative to agent checkout root).' },
          enabled:     { type: 'boolean', default: true },
          auto_trigger:{ type: 'boolean', default: false }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const root = path.resolve(__dirname, '..');
const fs = require('fs');

// Collect input files: core routes + all plugin swagger-routes.js files
const inputFiles = [path.join(root, 'src/swagger/routes.js')];
const pluginsDir = path.join(root, 'plugins');
if (fs.existsSync(pluginsDir)) {
  fs.readdirSync(pluginsDir).forEach((plugin) => {
    const pluginRoutes = path.join(pluginsDir, plugin, 'swagger-routes.js');
    if (fs.existsSync(pluginRoutes)) {
      inputFiles.push(pluginRoutes);
    }
  });
}

swaggerAutogen(
  path.join(root, 'swagger.json'),
  inputFiles,
  doc
);
