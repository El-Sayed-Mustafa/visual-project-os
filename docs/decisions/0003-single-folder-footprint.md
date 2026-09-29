# ADR-0003: One folder footprint

| | |
| --- | --- |
| **Date** | 2026-09-29 |
| **Status** | accepted |

## Context

Most users will add the kit to an **existing** project. The first sketch put
`diagrams/` and `prompts/` at the project root next to `.project-brain/`.
Existing projects often already have `docs/`, `prompts/` (AI apps) or
`diagrams/`, so installing would collide with their files or confuse them.
Claude Code reads `CLAUDE.md`, while Codex, Cursor, Copilot and others read
`AGENTS.md`.

## Decision

Everything lives in `.project-brain/` (including `prompts/`, `flows/`,
`features/` and `decisions/`). The only root files are `AGENTS.md` (the rules)
and `CLAUDE.md` (a one-line `@AGENTS.md` import). If either one exists, `init`
appends a delimited section once and never overwrites.

## Alternatives considered

| Option | Pros | Cons | Why not |
| --- | --- | --- | --- |
| Several root folders | Very visible | Collides with existing folders | Friction in real projects |
| Everything in `docs/` | Conventional | `docs/` often holds user-facing docs or a site | Mixes audiences |
| Separate rule files per agent | Native to each tool | Duplicated rules drift apart | One source (`AGENTS.md`) plus an import |

## Consequences

- **Good:** safe to install anywhere, easy to remove, obvious ownership.
- **Bad:** dot-folders are hidden in some file browsers. The README links to
  `.project-brain/README.md` to make up for this.
