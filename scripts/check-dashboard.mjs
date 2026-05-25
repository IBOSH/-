import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const requiredFiles = ['index.html', 'styles.css', 'app.js', 'README.md'];
const requiredSections = ['dashboard', 'network', 'topology', 'nodes', 'events', 'reports', 'settings'];
const requiredIds = [
  'local-time',
  'device-table',
  'events-table',
  'events-live-toggle',
  'reports-period-select',
  'topology-stage',
  'topology-save-btn',
];
const requiredI18nKeys = [
  'nav.dashboard',
  'nav.events',
  'topology.title',
  'events.title',
  'reports.title',
  'settings.title',
];
const requiredThemes = ['light', 'ops', 'zabbix', 'graphite'];

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing required file: ${file}`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const js = readFileSync('app.js', 'utf8');
const readme = readFileSync('README.md', 'utf8');

try {
  execFileSync('node', ['--check', 'app.js'], { stdio: 'pipe' });
} catch (error) {
  fail(`JavaScript syntax check failed: ${error.stderr?.toString() || error.message}`);
}

for (const section of requiredSections) {
  if (!html.includes(`data-section="${section}"`)) {
    fail(`Missing section marker for ${section}`);
  }
}

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`) && !js.includes(`"${id}"`)) {
    fail(`Missing required UI hook: ${id}`);
  }
}

for (const key of requiredI18nKeys) {
  if (!js.includes(`"${key}"`)) {
    fail(`Missing translation key: ${key}`);
  }
}

for (const theme of requiredThemes) {
  if (!css.includes(`:root[data-theme="${theme}"]`)) {
    fail(`Missing theme styles for ${theme}`);
  }
}

if (!readme.includes('python3 -m http.server 8080')) {
  fail('README is missing local run instructions');
}

if (!readme.includes('node scripts/check-dashboard.mjs')) {
  fail('README is missing smoke-test instructions');
}

if (!process.exitCode) {
  console.log('Dashboard smoke test passed');
}
