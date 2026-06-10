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

(async () => {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log('Already initialized, skipping.');
    return;
  }
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
