# Prompt: explain a change visually

Use to understand a diff, a branch, a pull request, or work another agent did.
Replace `<TARGET>` with a commit range, branch, PR, or "the uncommitted changes".

---

Explain **<TARGET>** to me visually. Read `.project-brain/architecture.md` first
so you use the project's real component names. Then read the diff.

Reply with:

1. **In one sentence** — what this change does for the user or system.
2. **Impact map** — a Mermaid `flowchart` of the affected slice of the system,
   with `added` / `changed` / `removed` classes from `AGENTS.md`.
3. **Flow** — a `sequenceDiagram` of the new or changed behaviour, if any.
4. **Files** — table of files touched and why each changed.
5. **Data** — schema / storage / config changes, or "none".
6. **Risks** — what could break, what is not tested, anything surprising.
7. **Brain drift** — which `.project-brain/` files are now out of date because
   of this change, and whether a feature record / ADR is missing.

Do not modify any files unless I ask.
