'use strict';

require('coffee-script/register');

const env = process.env.NODE_ENV || 'dev';
process.env.NODE_ENV = env;

const mongoose = require('mongoose');
const config = require('config');

const User = require('./src/models/user');
const DashboardTemplate = require('./src/models/dashboard_template');
const Setting = require('./src/models/system_setting');

const users = require('./data/users');
const templates = require('./data/templates');
const settings = require('./data/settings');

const dbHost = process.env.DBHost || config.DBHost;

if (!dbHost) {
  console.error('DBHost is not set.');
  process.exit(1);
}

mongoose.connect(dbHost, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const DEFAULT_PASSWORD = 'changeme';

/** The admin and operator accounts must not ship with the well-known default password in production. */
function checkDefaultPasswords() {
  const weak = users.filter((u) => ['admin', 'operator'].includes(u.role) && u.password === DEFAULT_PASSWORD);
  if (weak.length === 0) return;
  const names = weak.map((u) => u.username).join(', ');
  if (env === 'production') {
    const suggestion = require('crypto').randomBytes(12).toString('base64url');
    throw new Error(
      `Refusing to create ${names} with the default password in production. Set ADMIN_PASSWORD (and OPERATOR_PASSWORD, which falls back to it) to something other than "${DEFAULT_PASSWORD}", for example ADMIN_PASSWORD=${suggestion}`
    );
  }
  console.warn(`WARNING: ${names} will use the default password "${DEFAULT_PASSWORD}". Set ADMIN_PASSWORD / OPERATOR_PASSWORD before exposing this server.`);
}

(async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('Already initialized, skipping.');
    return;
  }
  checkDefaultPasswords();
  await User.create(users);
  await DashboardTemplate.create(templates);
  await Setting.create(settings);
  console.log('Initialization complete.');
})().then(() => {
  mongoose.disconnect();
  process.exit();
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
