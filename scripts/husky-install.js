#!/usr/bin/env node
/*
 * Install the git hooks (husky) unless this is a production install.
 *
 * Replaces `[ "$NODE_ENV" = "production" ] || husky`, whose POSIX `[` test breaks
 * under cmd.exe — npm runs lifecycle scripts with the platform shell, so the
 * old one-liner failed on Windows ("'[' is not recognized").
 */
if (process.env.NODE_ENV === 'production') {
  process.exit(0);
}

const path = require('node:path');
const { existsSync } = require('node:fs');
const { spawnSync } = require('node:child_process');

// Resolve husky from node_modules/.bin rather than trusting PATH: npm puts that
// directory on PATH for lifecycle scripts, but the script is also runnable by
// hand (and from other tooling).
const binDir = path.join(__dirname, '..', 'node_modules', '.bin');
const candidates = [path.join(binDir, 'husky'), path.join(binDir, 'husky.cmd')];
const local = candidates.find((candidate) => existsSync(candidate));

const command = local ?? 'husky';
const result = spawnSync(command, {
  stdio: 'inherit',
  // .cmd shims need a shell on Windows; the unix script does not.
  shell: process.platform === 'win32' || !local,
});

if (result.error || result.status !== 0) {
  // A failed hook install must not break `npm install` (tarballs, CI caches…).
  console.warn(`[husky] git hooks not installed: ${result.error?.message ?? `exit ${result.status}`}`);
}

process.exit(0);
