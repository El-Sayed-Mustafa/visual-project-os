# ADR-0002: Diagrams embedded in Markdown

| | |
| --- | --- |
| **Date** | 2026-09-29 |
| **Status** | accepted |

## Context

The first sketch kept diagrams in a separate `diagrams/` folder as `.mmd` files
(`system.mmd`, `containers.mmd`, `sequences/`). GitHub and GitLab render
` ```mermaid ` blocks inside Markdown, but show standalone `.mmd` files as
plain text. Keeping a diagram and its explanation in two files also means two
things to keep in sync.

## Decision

Each diagram lives in a ` ```mermaid ` block inside the Markdown file it
explains: the context diagram in `system-overview.md`, containers in
`architecture.md`, the ER diagram in `data-model.md`, sequences in `flows/*.md`,
and before/after impact maps in `features/*.md`.

## Alternatives considered

| Option | Pros | Cons | Why not |
| --- | --- | --- | --- |
| Separate `.mmd` files | Easy to feed to mermaid-cli | Not rendered on GitHub; text and diagram drift apart | Loses the main benefit: seeing it in the browser |
| D2 | Nicer layouts | Needs a binary to render; no native GitHub rendering | Adds a dependency; can be an export later |
| Images (PNG/SVG) | Render anywhere | Not diffable; agents can't edit them | Goes stale immediately |

## Consequences

- **Good:** zero tooling to view. One file per topic. Agents edit text they
  already understand.
- **Bad:** Mermaid layout control is limited, and large diagrams get messy. We
  mitigate with the ~15-node rule and `vpos check` warnings.
- **Follow-ups:** a `vpos export` command could extract blocks to `.mmd`/SVG for
  other tools.
