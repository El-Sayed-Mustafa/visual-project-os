# Changelog

## Unreleased

- `vpos view`: one-page brain viewer — dashboard (summary, stats, context + architecture diagrams, recent changes), metadata chips, collapsed long tables, click-to-zoom diagrams, page search, light/dark.
- Writing budget in `AGENTS.md` (diagrams first, ≤ 12-word cells, ≤ 8-row tables); shorter templates (−44% words); condensed example.

## 0.1.0 — 2026-09-29

First release.

- `kit/`: `AGENTS.md` rules (understand → plan → build → update → record →
  decide), `CLAUDE.md` import, and `.project-brain/` templates: system overview,
  architecture, data model, integrations, deployment, feature history, flows,
  features, decisions.
- Prompts: `understand-project`, `before-feature`, `after-feature`,
  `explain-change`, `catch-me-up`.
- CLI `vpos`: `init` (safe, never overwrites), `feature`, `adr`, `check`
  (structure, placeholders, Mermaid sanity, links, drift, freshness).
- `kit-ci/`: GitHub Action and PR template.
- Example: `field-service-crm` (anonymized pilot).
