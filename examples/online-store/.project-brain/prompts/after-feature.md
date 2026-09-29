# Prompt: update the brain after a change

Use when code for a change is finished. Agents following `AGENTS.md` should do
this on their own; use this prompt to ask for it explicitly.

---

The change is implemented. Now update the project brain:

1. Look at what actually changed (`git diff` / `git status`, or the files you
   edited). Document what was built, not what was planned.
2. Create `.project-brain/features/<YYYY-MM-DD>-<slug>.md` from
   `features/_template.md`. Fill every section; delete sections that truly do
   not apply. The **Before** and **After — impact map** diagrams are required.
3. Add one line at the top of the table in `.project-brain/feature-history.md`
   linking to the record.
4. Update every brain file whose truth changed: `architecture.md`,
   `data-model.md`, `integrations.md`, `deployment.md`, `system-overview.md`,
   `flows/*.md`. Rewrite the affected sections; do not append "Update:" notes.
   Bump their "Last reviewed" date.
5. If a hard-to-reverse choice was made, add an ADR in `.project-brain/decisions/`
   (next number, from `decisions/_template.md`) and link it both ways.
6. If the project has the CLI, run `npx github:El-Sayed-Mustafa/visual-project-os check`
   and fix what it reports.

Reply with the **Change summary** section of the feature record, followed by
the list of brain files you updated.
