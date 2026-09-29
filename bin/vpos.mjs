#!/usr/bin/env node
// visual-project-os CLI — zero dependencies, Node >= 18.
//   vpos init [dir] [--name "My App"] [--ci]
//   vpos feature "<title>" [--dir .] [--type feature]
//   vpos adr "<title>" [--dir .]
//   vpos check [dir] [--since <git-ref>] [--strict]

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT = path.join(ROOT, 'kit');
const KIT_CI = path.join(ROOT, 'kit-ci');
const BRAIN = '.project-brain';
const MARKER = 'visual-project-os:start';
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const REQUIRED = [
  'AGENTS.md',
  `${BRAIN}/system-overview.md`,
  `${BRAIN}/architecture.md`,
  `${BRAIN}/data-model.md`,
  `${BRAIN}/integrations.md`,
  `${BRAIN}/deployment.md`,
  `${BRAIN}/feature-history.md`,
  `${BRAIN}/features`,
  `${BRAIN}/decisions`,
];
const CORE_DOCS = REQUIRED.filter((f) => f.startsWith(BRAIN) && f.endsWith('.md'));
const MERMAID_TYPES = /^(flowchart|graph|sequenceDiagram|erDiagram|stateDiagram(-v2)?|classDiagram|gantt|pie|journey|gitGraph|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment|zenuml|sankey-beta|xychart-beta|block-beta|packet-beta|architecture-beta|kanban|radar-beta)\b/;
const NOT_CODE = [/^\.project-brain\//, /\.md$/i, /^LICENSE/i, /^\.gitignore$/, /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|uv\.lock|Cargo\.lock)$/];
const MAX_FLOW_NODES = 20;

// ---------- output helpers ----------
const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const c = { red: paint(31), green: paint(32), yellow: paint(33), cyan: paint(36), dim: paint(2), bold: paint(1) };

function die(msg) {
  console.error(c.red(`error: ${msg}`));
  process.exit(2);
}

// ---------- small utils ----------
const today = () => new Date().toISOString().slice(0, 10);
const posix = (p) => p.split(path.sep).join('/');
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').slice(0, 60) || 'change';

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      if (v !== undefined) out[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[k] = argv[++i];
      else out[k] = true;
    } else out._.push(a);
  }
  return out;
}

function walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full, base) : [posix(path.relative(base, full))];
  });
}

function projectName(dir) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    if (pkg.name) return pkg.name;
  } catch {}
  return path.basename(path.resolve(dir));
}

function git(dir, args) {
  try {
    return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

function requireBrain(dir) {
  if (!fs.existsSync(path.join(dir, BRAIN))) die(`no ${BRAIN}/ in ${path.resolve(dir)} — run "vpos init" first`);
}

// ---------- init ----------
function init(args) {
  const dir = path.resolve(args._[0] || '.');
  if (!fs.existsSync(dir)) die(`directory not found: ${dir}`);
  const name = typeof args.name === 'string' ? args.name : projectName(dir);
  const fill = (s) => s.replaceAll('{{PROJECT_NAME}}', name).replaceAll('{{DATE}}', today());

  const sources = [[KIT, walk(KIT)]];
  if (args.ci) sources.push([KIT_CI, walk(KIT_CI)]);

  const log = { created: [], merged: [], kept: [] };
  for (const [srcRoot, files] of sources) {
    for (const rel of files) {
      const src = path.join(srcRoot, rel);
      const dest = path.join(dir, rel);
      const content = fill(fs.readFileSync(src, 'utf8'));
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, content);
        log.created.push(rel);
      } else if (['AGENTS.md', 'CLAUDE.md'].includes(rel)) {
        const existing = fs.readFileSync(dest, 'utf8');
        if (existing.includes(MARKER)) log.kept.push(rel);
        else {
          fs.writeFileSync(dest, `${existing.replace(/\s*$/, '')}\n\n${content}`);
          log.merged.push(rel);
        }
      } else log.kept.push(rel);
    }
  }

  console.log(c.bold(`\nvisual-project-os → ${dir}`));
  console.log(`${c.green('created')} ${log.created.length} files`);
  for (const f of log.merged) console.log(`${c.cyan('merged ')} ${f} ${c.dim('(appended rules to your existing file)')}`);
  if (log.kept.length) console.log(`${c.yellow('kept   ')} ${log.kept.length} existing files untouched`);
  console.log(`
Next:
  1. Ask your AI agent:
     ${c.cyan('"Follow .project-brain/prompts/understand-project.md"')}
  2. Before each feature:  ${c.cyan('.project-brain/prompts/before-feature.md')}
  3. Check the brain:      ${c.cyan('npx github:El-Sayed-Mustafa/visual-project-os check')}
`);
}

// ---------- feature ----------
function feature(args) {
  const title = args._[0];
  if (!title) die('usage: vpos feature "<title>" [--dir .] [--type feature]');
  const dir = path.resolve(args.dir || '.');
  requireBrain(dir);
  const type = typeof args.type === 'string' ? args.type : 'feature';
  const date = today();
  const rel = `features/${date}-${slugify(title)}.md`;
  const dest = path.join(dir, BRAIN, rel);
  if (fs.existsSync(dest)) die(`already exists: ${BRAIN}/${rel}`);

  const tplPath = path.join(dir, BRAIN, 'features/_template.md');
  const tpl = fs.existsSync(tplPath) ? fs.readFileSync(tplPath, 'utf8') : fs.readFileSync(path.join(KIT, BRAIN, 'features/_template.md'), 'utf8');
  const body = tpl
    .replace('<Feature title>', title)
    .replace('YYYY-MM-DD', date)
    .replace('feature / fix / refactor / infra / data', type)
    .replace('planned / in progress / done', 'in progress');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body);

  addHistoryRow(dir, `| ${date} | ${type} | ${title.replaceAll('|', '/')} | [record](${rel}) | — |`);
  console.log(`${c.green('created')} ${BRAIN}/${rel}\n${c.green('added  ')} row to ${BRAIN}/feature-history.md`);
}

function addHistoryRow(dir, row) {
  const file = path.join(dir, BRAIN, 'feature-history.md');
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const sep = lines.findIndex((l) => /^\|\s*-{3,}/.test(l));
  if (sep === -1) lines.push(row);
  else lines.splice(sep + 1, 0, row);
  fs.writeFileSync(file, lines.join('\n'));
}

// ---------- adr ----------
function adr(args) {
  const title = args._[0];
  if (!title) die('usage: vpos adr "<title>" [--dir .]');
  const dir = path.resolve(args.dir || '.');
  requireBrain(dir);
  const decisions = path.join(dir, BRAIN, 'decisions');
  const nums = walk(decisions).map((f) => parseInt(f, 10)).filter((n) => !Number.isNaN(n));
  const num = String((nums.length ? Math.max(...nums) : 0) + 1).padStart(4, '0');
  const rel = `decisions/${num}-${slugify(title)}.md`;

  const tplPath = path.join(decisions, '_template.md');
  const tpl = fs.existsSync(tplPath) ? fs.readFileSync(tplPath, 'utf8') : fs.readFileSync(path.join(KIT, BRAIN, 'decisions/_template.md'), 'utf8');
  const body = tpl
    .replace('ADR-NNNN: <Decision title>', `ADR-${num}: ${title}`)
    .replace('YYYY-MM-DD', today())
    .replace('proposed / accepted / superseded by ADR-NNNN / deprecated', 'proposed');
  fs.mkdirSync(decisions, { recursive: true });
  fs.writeFileSync(path.join(dir, BRAIN, rel), body);
  console.log(`${c.green('created')} ${BRAIN}/${rel}`);
}

// ---------- check ----------
function stripCode(md) {
  // Remove fenced blocks and inline code so we only inspect prose links.
  return md.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '');
}

function mermaidBlocks(md) {
  const blocks = [];
  const re = /^```mermaid[ \t]*\r?\n([\s\S]*?)^```/gm;
  let m;
  while ((m = re.exec(md))) blocks.push({ code: m[1], line: md.slice(0, m.index).split('\n').length });
  const opened = (md.match(/^```mermaid/gm) || []).length;
  return { blocks, unclosed: opened - blocks.length };
}

function checkMermaid(code) {
  const problems = [];
  const lines = code.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('%%'));
  let first = lines[0] || '';
  if (first === '---') {
    const end = lines.indexOf('---', 1);
    first = lines[end + 1] || '';
  }
  if (!MERMAID_TYPES.test(first)) {
    problems.push(['error', `unknown or missing diagram type: "${first.slice(0, 40)}"`]);
    return problems;
  }
  if (/^(flowchart|graph)\b/.test(first)) {
    lines.forEach((l, i) => {
      const bare = l.replace(/"[^"]*"/g, '""');
      if (((l.match(/"/g) || []).length) % 2) problems.push(['error', `unbalanced quotes on diagram line ${i + 1}: ${l.slice(0, 60)}`]);
      // Verified against Mermaid 11: these ids break parsing (a leading `click[...]` is fine).
      else if (/^(end|style|class|classDef|linkStyle|subgraph)\s*[[({]/.test(bare) || /(-->|---|==>|\.->|&)\s*(click|end|style|class)\b(?!-)/.test(bare)) {
        problems.push(['error', `reserved word used as a node id on diagram line ${i + 1}: ${l.slice(0, 60)}`]);
      }
    });
    const ids = new Set();
    for (const l of lines.slice(1)) {
      if (/^(classDef|class|style|linkStyle|click|subgraph|end\b|direction)/.test(l)) continue;
      const bare = l.replace(/"[^"]*"/g, '""');
      for (const m of bare.matchAll(/(?:^|[\s&>-])([A-Za-z_][\w]*)\s*(?=[[({>])/g)) ids.add(m[1]);
    }
    if (ids.size > MAX_FLOW_NODES) problems.push(['warn', `${ids.size} nodes — consider splitting (aim for ~15)`]);
  }
  return problems;
}

function check(args) {
  const dir = path.resolve(args._[0] || '.');
  const strict = Boolean(args.strict);
  const findings = [];
  const add = (level, file, msg) => findings.push({ level: strict && level === 'warn' ? 'error' : level, file, msg });

  // 1. structure
  for (const rel of REQUIRED) if (!fs.existsSync(path.join(dir, rel))) add('error', rel, 'missing (run "vpos init")');
  if (!fs.existsSync(path.join(dir, BRAIN))) return report(dir, findings);

  const brainFiles = walk(path.join(dir, BRAIN)).filter((f) => f.endsWith('.md'));
  const read = (rel) => fs.readFileSync(path.join(dir, rel), 'utf8');
  const mdFiles = [...brainFiles.map((f) => `${BRAIN}/${f}`), ...['AGENTS.md', 'CLAUDE.md'].filter((f) => fs.existsSync(path.join(dir, f)))];

  // 2. placeholders left in core docs
  for (const rel of CORE_DOCS) {
    if (!fs.existsSync(path.join(dir, rel))) continue;
    const n = (read(rel).match(/TODO\(vpos\)/g) || []).length;
    if (n) add('warn', rel, `${n} TODO(vpos) placeholder${n > 1 ? 's' : ''} — run prompts/understand-project.md`);
  }

  for (const rel of mdFiles) {
    const md = read(rel);
    const isTemplate = /(^|\/)_template\.md$/.test(rel) || rel.includes('/prompts/');

    // 3. mermaid
    const { blocks, unclosed } = mermaidBlocks(md);
    if (unclosed > 0) add('error', rel, 'unclosed ```mermaid block');
    for (const b of blocks) for (const [lvl, msg] of checkMermaid(b.code)) add(lvl, `${rel}:${b.line}`, msg);

    // 4. relative links must resolve
    for (const m of stripCode(md).matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = m[1].split('#')[0];
      if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
      const abs = path.resolve(path.dirname(path.join(dir, rel)), decodeURI(target));
      if (!fs.existsSync(abs)) add('error', rel, `broken link: ${m[1]}`);
    }

    // 5. code paths mentioned in backticks should still exist (drift detector)
    if (!isTemplate && rel !== 'AGENTS.md' && rel !== 'CLAUDE.md') {
      const prose = md.replace(/^(```|~~~)[\s\S]*?^\1/gm, '');
      const seen = new Set();
      for (const m of prose.matchAll(/`([\w@.\/-]+\/[\w@.\/-]*\.[A-Za-z0-9]{1,6})`/g)) {
        const p = m[1].replace(/^\.\//, '');
        if (seen.has(p) || /[*<>]/.test(p) || p.startsWith('http')) continue;
        seen.add(p);
        const candidates = [path.join(dir, p), path.join(dir, BRAIN, p), path.resolve(path.dirname(path.join(dir, rel)), p)];
        if (!candidates.some((f) => fs.existsSync(f))) add('warn', rel, `references \`${p}\` which does not exist (renamed or removed?)`);
      }
    }
  }

  // 6. every feature record is in the history; every ADR has a status
  const historyPath = path.join(dir, BRAIN, 'feature-history.md');
  const history = fs.existsSync(historyPath) ? fs.readFileSync(historyPath, 'utf8') : '';
  for (const f of brainFiles.filter((f) => /^features\/(?!_)/.test(f))) {
    if (!history.includes(f)) add('warn', `${BRAIN}/${f}`, 'not linked from feature-history.md');
  }
  for (const f of brainFiles.filter((f) => /^decisions\/(?!_|README)/.test(f))) {
    if (!/\*\*Status\*\*\s*\|\s*\w/.test(read(`${BRAIN}/${f}`))) add('warn', `${BRAIN}/${f}`, 'ADR has no Status');
  }

  // 7. freshness — code changed but the brain did not
  const inGit = git(dir, ['rev-parse', '--is-inside-work-tree']);
  if (inGit) {
    const prefix = (git(dir, ['rev-parse', '--show-prefix']) || '').trim();
    const toProject = (f) => (prefix && f.startsWith(prefix) ? f.slice(prefix.length) : prefix ? null : f);
    let changed;
    let where;
    if (typeof args.since === 'string') {
      const out = git(dir, ['diff', '--name-only', `${args.since}...HEAD`]);
      if (out === null) add('error', '(git)', `cannot diff against "${args.since}" — is it fetched? (use fetch-depth: 0 in CI)`);
      changed = (out || '').split('\n');
      where = `since ${args.since}`;
      const msgs = git(dir, ['log', '--format=%B', `${args.since}..HEAD`]) || '';
      if (/\[skip brain\]/i.test(msgs)) changed = [];
    } else {
      changed = (git(dir, ['status', '--porcelain']) || '').split('\n').map((l) => l.slice(3).replace(/^"|"$/g, '').split(' -> ').pop());
      where = 'in uncommitted changes';
    }
    changed = changed.map((f) => f && toProject(f.trim())).filter(Boolean);
    const code = changed.filter((f) => !NOT_CODE.some((re) => re.test(f)));
    const brain = changed.filter((f) => f.startsWith(`${BRAIN}/`));
    if (code.length && !brain.length) {
      add(args.since ? 'error' : 'warn', BRAIN, `${code.length} code file(s) changed ${where} but .project-brain/ was not updated (e.g. ${code.slice(0, 3).join(', ')}). Add "[skip brain]" to a commit message for trivial changes.`);
    }
  }

  return report(dir, findings);
}

function report(dir, findings) {
  const errors = findings.filter((f) => f.level === 'error');
  const warns = findings.filter((f) => f.level === 'warn');
  console.log(c.bold(`\nvisual-project-os check → ${dir}\n`));
  for (const f of [...errors, ...warns]) {
    const tag = f.level === 'error' ? c.red('✖ error') : c.yellow('⚠ warn ');
    console.log(`${tag} ${c.cyan(f.file)}  ${f.msg}`);
  }
  const summary = `${errors.length} error(s), ${warns.length} warning(s)`;
  console.log(`\n${errors.length ? c.red(`✖ ${summary}`) : c.green(`✔ ${summary}`)}\n`);
  process.exitCode = errors.length ? 1 : 0;
}

// ---------- main ----------
const HELP = `visual-project-os ${PKG.version} — a living, visual memory for AI-built projects

Usage:
  vpos init [dir] [--name "My App"] [--ci]   add the kit to a project (never overwrites)
  vpos feature "<title>" [--dir .] [--type fix]
                                             create a feature record + history row
  vpos adr "<title>" [--dir .]               create the next numbered ADR
  vpos check [dir] [--since <ref>] [--strict]
                                             validate structure, diagrams, links, drift

Options:
  --ci       also add a GitHub Action + PR template that run "check" on pull requests
  --since    fail if code changed since <ref> (e.g. origin/main) without a brain update
  --strict   treat warnings as errors
`;

const [cmd, ...rest] = process.argv.slice(2);
const args = parseArgs(rest);
switch (cmd) {
  case 'init': init(args); break;
  case 'feature': feature(args); break;
  case 'adr': adr(args); break;
  case 'check': check(args); break;
  case '-v': case '--version': console.log(PKG.version); break;
  case undefined: case '-h': case '--help': case 'help': console.log(HELP); break;
  default: console.log(HELP); die(`unknown command: ${cmd}`);
}
