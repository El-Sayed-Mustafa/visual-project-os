import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../bin/vpos.mjs');

function run(args, cwd) {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } });
  return { code: r.status, out: r.stdout + r.stderr };
}

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vpos-'));
}

const brain = (dir, rel) => path.join(dir, '.project-brain', rel);

test('init creates the kit and fills placeholders', () => {
  const dir = tmp();
  const r = run(['init', dir, '--name', 'Demo App'], dir);
  assert.equal(r.code, 0, r.out);
  assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')));
  assert.ok(fs.existsSync(path.join(dir, 'CLAUDE.md')));
  assert.ok(fs.existsSync(brain(dir, 'prompts/understand-project.md')));
  const overview = fs.readFileSync(brain(dir, 'system-overview.md'), 'utf8');
  assert.match(overview, /Demo App/);
  assert.doesNotMatch(overview, /\{\{/);
  assert.ok(!fs.existsSync(path.join(dir, '.github')), 'CI files only with --ci');
});

test('init never overwrites and merges existing AGENTS.md once', () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# My rules\n');
  fs.mkdirSync(path.join(dir, '.project-brain'));
  fs.writeFileSync(brain(dir, 'architecture.md'), 'mine');
  run(['init', dir], dir);
  run(['init', dir], dir);
  const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.match(agents, /^# My rules/);
  assert.equal(agents.match(/visual-project-os:start/g).length, 1);
  assert.equal(fs.readFileSync(brain(dir, 'architecture.md'), 'utf8'), 'mine');
});

test('init --ci adds the GitHub workflow and PR template', () => {
  const dir = tmp();
  run(['init', dir, '--ci'], dir);
  assert.ok(fs.existsSync(path.join(dir, '.github/workflows/project-brain.yml')));
  assert.ok(fs.existsSync(path.join(dir, '.github/pull_request_template.md')));
});

test('fresh kit passes check with only placeholder warnings', () => {
  const dir = tmp();
  run(['init', dir], dir);
  const r = run(['check', dir], dir);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 error\(s\)/);
  assert.match(r.out, /TODO\(vpos\)/);
  assert.equal(run(['check', dir, '--strict'], dir).code, 1);
});

test('feature creates a record and a history row; adr numbers sequentially', () => {
  const dir = tmp();
  run(['init', dir], dir);
  assert.equal(run(['feature', 'Add WhatsApp notifications', '--dir', dir], dir).code, 0);
  const files = fs.readdirSync(brain(dir, 'features')).filter((f) => !f.startsWith('_'));
  assert.equal(files.length, 1);
  assert.match(files[0], /^\d{4}-\d{2}-\d{2}-add-whatsapp-notifications\.md$/);
  const history = fs.readFileSync(brain(dir, 'feature-history.md'), 'utf8');
  assert.ok(history.includes(`features/${files[0]}`));

  run(['adr', 'Use Postgres', '--dir', dir], dir);
  run(['adr', 'Queue for notifications', '--dir', dir], dir);
  const adrs = fs.readdirSync(brain(dir, 'decisions')).filter((f) => !f.startsWith('_')).sort();
  assert.deepEqual(adrs, ['0001-use-postgres.md', '0002-queue-for-notifications.md']);
  assert.match(fs.readFileSync(brain(dir, 'decisions/0002-queue-for-notifications.md'), 'utf8'), /ADR-0002: Queue for notifications/);
  assert.equal(run(['check', dir], dir).code, 0);
});

test('check reports broken links, bad diagrams and missing files', () => {
  const dir = tmp();
  run(['init', dir], dir);
  fs.appendFileSync(brain(dir, 'architecture.md'), '\nSee [gone](flows/gone.md).\n\n```mermaid\nflowchrt LR\n  a --> b\n```\n\n```mermaid\nflowchart LR\n  a["oops] --> b\n```\n\n```mermaid\nflowchart LR\n  click["Click is fine here"] --> b\n  style["S"] --> b\n  b --> end\n```\n');
  fs.rmSync(brain(dir, 'deployment.md'));
  const r = run(['check', dir], dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /broken link: flows\/gone\.md/);
  assert.match(r.out, /unknown or missing diagram type/);
  assert.match(r.out, /unbalanced quotes/);
  assert.equal((r.out.match(/reserved word used as a node id/g) || []).length, 2);
  assert.match(r.out, /deployment\.md\s+missing/);
});

test('check warns about referenced code paths that no longer exist', () => {
  const dir = tmp();
  run(['init', dir], dir);
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src/app.js'), '');
  fs.appendFileSync(brain(dir, 'architecture.md'), '\n| app | `src/app.js` |\n| old | `src/old.js` |\n');
  const r = run(['check', dir], dir);
  assert.match(r.out, /src\/old\.js/);
  assert.doesNotMatch(r.out, /`src\/app\.js`/);
});

test('check --since fails when code changed without a brain update', () => {
  const dir = tmp();
  const g = (...a) => execFileSync('git', a, { cwd: dir, stdio: 'ignore' });
  g('init', '-q', '-b', 'main');
  g('config', 'user.email', 't@t');
  g('config', 'user.name', 't');
  run(['init', dir], dir);
  g('add', '-A');
  g('commit', '-qm', 'init');
  g('checkout', '-qb', 'feat');
  fs.writeFileSync(path.join(dir, 'app.js'), 'x');
  g('add', '-A');
  g('commit', '-qm', 'code only');
  let r = run(['check', dir, '--since', 'main'], dir);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /was not updated/);

  run(['feature', 'App entry', '--dir', dir], dir);
  g('add', '-A');
  g('commit', '-qm', 'brain');
  r = run(['check', dir, '--since', 'main'], dir);
  assert.equal(r.code, 0, r.out);
});
