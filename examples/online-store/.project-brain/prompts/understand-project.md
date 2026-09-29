# Prompt: understand the project (bootstrap the brain)

Use once when you add visual-project-os to an existing codebase, or any time
the brain has drifted far from the code.

---

You are documenting this codebase for its future maintainers, human and AI.
Your output is the `.project-brain/` folder. Read `AGENTS.md` first for the
rules and diagram conventions.

## Step 1 — Explore (read only)

1. Read the README, any docs folder, setup guides, changelogs and handover
   notes.
2. Read dependency and config files (`package.json`, `pyproject.toml`,
   `requirements.txt`, `go.mod`, `appsscript.json`, `Dockerfile`, CI files,
   `.env.example`, etc.).
3. Find the entry points: servers, CLIs, scheduled jobs, web app handlers,
   workers, triggers.
4. Follow the main paths from each entry point to storage and to external
   services.
5. If git history exists, skim `git log --oneline` to learn how the project
   evolved.

## Step 2 — Fill the brain

Replace every `TODO(vpos)` in these files with real content:

1. `system-overview.md` — purpose, actors, context diagram, stack.
2. `architecture.md` — container diagram, component table with real paths,
   cross-cutting concerns, codebase rules, risks.
3. `data-model.md` — every real store, `erDiagram` with real table/column names.
4. `integrations.md` — every external service, config names (never values),
   failure behaviour.
5. `deployment.md` — environments, exact run/test commands, config, jobs.
6. `flows/` — one file per important flow (3–6 flows), copied from
   `flows/_template.md`, named like `flows/create-order.md`.
7. `decisions/` — write ADRs *only* for decisions that are clearly visible in the
   code or docs (e.g. "Google Sheets as the database"), with status `accepted`
   and a note that they were reconstructed.
8. `feature-history.md` — if history is visible (git log, versioned folders,
   changelog), add the major past milestones, oldest at the bottom.

## Rules

- Real names only. If you are unsure, write `(unverified)`.
- No secrets, no customer data.
- Keep each diagram under ~15 nodes; split if needed.
- Remove template example nodes you did not use.

## Step 3 — Report

Reply with:
- the list of files you wrote,
- a 5-line summary of the system,
- the top 3 risks you noticed,
- anything you could not determine and need a human to answer.
