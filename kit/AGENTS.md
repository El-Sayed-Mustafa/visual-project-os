<!-- visual-project-os:start -->
# Agent rules — {{PROJECT_NAME}}

`.project-brain/` is this project's visual memory. **The code says what the
system does; the brain says how and why.** A change is done only when both are
updated.

## 1. Before coding

1. Read `.project-brain/`: `system-overview.md` → `architecture.md` → the
   related `flows/` → `data-model.md` (if data changes) → recent
   `feature-history.md` → related `decisions/`.
2. If it still has `TODO(vpos)`, run `prompts/understand-project.md` first.
3. For anything bigger than a small fix, present a plan first
   (`prompts/before-feature.md`): a before diagram, an after diagram with the
   changes highlighted, what's affected, and the new failure cases. Wait for
   approval.

## 2. While coding

- Existing code conventions win over these rules.
- Say so if you drift from the approved plan.
- Hard-to-reverse choice (dependency, service, storage, schema, auth, a
  pattern others must follow)? Write an ADR in `decisions/`.

## 3. Definition of Done

- [ ] Code works; checks and tests pass.
- [ ] `features/YYYY-MM-DD-<slug>.md` written from `features/_template.md`.
- [ ] One line added at the top of `feature-history.md`.
- [ ] Every brain file whose truth changed is updated, diagrams included.
- [ ] ADR added if a decision was made.
- [ ] Your reply ends with the record's change summary.

Small fixes only need the `feature-history.md` line.

## 4. Writing budget: diagrams first, words last

The brain is read by busy people. Say it with a diagram and a short table.
Use prose only for what a diagram can't show.

| Rule | Limit |
| --- | --- |
| Opening paragraph of a file | ≤ 3 sentences |
| Bullet or table cell | ≤ 12 words, no full sentences needed |
| Table | ≤ 8 rows; split or link out if longer |
| Bullet list | ≤ 6 items |
| Flow steps | ≤ 5, one line each |
| Diagram | ≤ 15 nodes; split by level if bigger |
| Whole file | fits on ~2 screens |

- Real names only (files, functions, tables, env vars) so people can grep them.
  Mark guesses `(unverified)`.
- Rewrite outdated sections. Never append "Update:" notes; history goes in
  `features/` and `decisions/`.
- Never write secrets or customer data. Name the setting instead.
- Link to code paths; don't paste code.

## 5. Diagrams (Mermaid, inside the Markdown)

| Use | Type |
| --- | --- |
| Context, containers, impact maps | `flowchart` |
| Flows | `sequenceDiagram` |
| Data | `erDiagram` |
| Lifecycles | `stateDiagram-v2` |

- Impact maps mark changes with these classes:

  ```
  classDef added fill:#d3f9d8,stroke:#2b8a3e,color:#1b4332
  classDef changed fill:#fff3bf,stroke:#e67700,color:#5c3c00
  classDef removed fill:#ffe3e3,stroke:#c92a2a,color:#5c1a1a,stroke-dasharray:4 3
  ```

- Short IDs, real names in labels: `api["api-server (src/server.ts)"]`.
- Quote labels that contain `( ) / :` or spaces. No `"` or `;` inside labels.
- Never use `end`, `style`, `class`, `click` or `subgraph` as node IDs.

## 6. Map

| File | Answers |
| --- | --- |
| `system-overview.md` | What is it, who uses it, what does it talk to? |
| `architecture.md` | What are the parts and how do they connect? |
| `flows/` | What happens, step by step? |
| `data-model.md` | What is stored and how is it related? |
| `integrations.md` | Which external services, and what if they fail? |
| `deployment.md` | How is it run and released? |
| `feature-history.md` | What changed, and when? |
| `features/` | Before, after and impact of each change |
| `decisions/` | Why is it built this way? |
<!-- visual-project-os:end -->
