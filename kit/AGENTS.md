<!-- visual-project-os:start -->
# Agent rules — {{PROJECT_NAME}}

This project uses **visual-project-os**. The folder `.project-brain/` is the
project's long-term memory: architecture, flows, data model, decisions and the
history of every feature, with diagrams in Mermaid.

**The code is the source of truth for behaviour. `.project-brain/` is the source
of truth for understanding.** Treat both as one product: a change is not done
until both are updated.

## 1. Before you touch code

1. Read, in this order:
   - `.project-brain/system-overview.md`
   - `.project-brain/architecture.md`
   - the files in `.project-brain/flows/` that relate to the task
   - `.project-brain/data-model.md` if the task touches stored data
   - the latest entries in `.project-brain/feature-history.md`
   - `.project-brain/decisions/` for decisions in the area you are touching
2. If `.project-brain/` still contains `TODO(vpos)` placeholders in the files
   you need, run the bootstrap first (`.project-brain/prompts/understand-project.md`).
3. For any change bigger than a small fix, **present a plan before coding**,
   following `.project-brain/prompts/before-feature.md`:
   - current state (diagram of the part being touched)
   - proposed change (same diagram, with changes highlighted)
   - affected components, data and flows
   - new failure cases and how they are handled
   - open questions

   Wait for approval when the user is in the loop.

## 2. While you work

- Follow existing code conventions over anything written here.
- If the implementation drifts from the approved plan, say so and explain why.
- If you make a choice that is hard to reverse (new dependency, new service,
  new storage, schema change, auth change, a pattern others must follow), it
  needs an ADR in `.project-brain/decisions/`.

## 3. After the change — Definition of Done

Follow `.project-brain/prompts/after-feature.md`. A change is done only when:

- [ ] Code works and existing checks/tests pass.
- [ ] A feature record exists: `.project-brain/features/YYYY-MM-DD-<slug>.md`
      (copy `features/_template.md`), with change summary, files touched,
      impact map, edge cases and test notes.
- [ ] One line was added at the top of `.project-brain/feature-history.md`.
- [ ] Every doc whose truth changed was updated:
      `architecture.md`, `data-model.md`, `integrations.md`, `deployment.md`,
      `system-overview.md`, and any affected `flows/*.md`.
- [ ] Diagrams match the code (component names, tables, columns, calls).
- [ ] An ADR was added if a decision was made (see section 2).
- [ ] You ended your reply with the change summary from the feature record.

Small fixes (typos, one-line bug fixes with no behaviour change to document)
only need a line in `feature-history.md`.

## 4. How to write the brain

- **Short and current beats long and stale.** Rewrite sections; don't append
  "update:" paragraphs. History belongs in `features/` and `decisions/`.
- **Real names only.** Use actual file, function, table, column, env var and
  endpoint names so readers can grep for them. Never invent.
- **Mark uncertainty** with `(unverified)` instead of guessing.
- **Never write secrets** (keys, tokens, passwords, customer data). Name the
  env var or setting instead.
- **Link, don't duplicate.** Point to code paths (`src/billing/invoice.ts`)
  rather than pasting code.

## 5. Diagram conventions (Mermaid)

- Diagrams live inside the Markdown files in ```` ```mermaid ```` blocks, so they
  render on GitHub, GitLab and in most editors with no extra tooling.
- One idea per diagram, **max ~15 nodes**. Split big diagrams by level:
  system context → containers → one flow.
- Diagram types:
  - system context / containers / impact maps → `flowchart`
  - request and user flows → `sequenceDiagram`
  - stored data → `erDiagram`
  - lifecycles (order status, job state) → `stateDiagram-v2`
- Impact maps use these classes so readers can see what changed:

  ```
  classDef added fill:#d3f9d8,stroke:#2b8a3e,color:#1b4332
  classDef changed fill:#fff3bf,stroke:#e67700,color:#5c3c00
  classDef removed fill:#ffe3e3,stroke:#c92a2a,color:#5c1a1a,stroke-dasharray:4 3
  ```

- Node IDs are short and stable (`api`, `db`, `worker`); labels carry the real
  name: `api["api-server (src/server.ts)"]`.
- Keep labels free of characters that break Mermaid (`"`, `;`, unbalanced
  brackets). Quote labels that contain `()`, `/`, `:` or spaces.
- Never use `end`, `style`, `class`, `click` or `subgraph` as node IDs; they
  are Mermaid keywords and break the diagram.

## 6. Map of `.project-brain/`

| File | Answers |
| --- | --- |
| `system-overview.md` | What is this, who uses it, what does it talk to? |
| `architecture.md` | What are the parts and how do they connect? |
| `flows/*.md` | What happens, step by step, when X occurs? |
| `data-model.md` | What is stored, where, and how is it related? |
| `integrations.md` | Which external services, how, and what if they fail? |
| `deployment.md` | How is it built, configured, run and released? |
| `feature-history.md` | What changed, when, and where is the record? |
| `features/` | The full story of each change: before, after, impact. |
| `decisions/` | Why is it built this way? (ADRs) |
| `prompts/` | Reusable prompts for agents and humans. |
<!-- visual-project-os:end -->
