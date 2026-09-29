# Project brain — {{PROJECT_NAME}}

The living, visual memory of this project. Start here when you (or an AI agent)
come back to the code after a while.

## Read in this order

1. [System overview](system-overview.md) — what it is and what it talks to
2. [Architecture](architecture.md) — the parts and how they connect
3. [Flows](flows/) — the important journeys, step by step
4. [Data model](data-model.md) — what is stored and how it relates
5. [Feature history](feature-history.md) — what changed recently, and why
6. [Decisions](decisions/) — why it is built this way

Also: [Integrations](integrations.md) · [Deployment](deployment.md) ·
[Prompts](prompts/)

## How it stays alive

Every change follows the loop in [`AGENTS.md`](../AGENTS.md):

```mermaid
flowchart LR
  understand["1 · Understand<br/>read the brain"] --> plan["2 · Plan<br/>before / after diagram"]
  plan --> build["3 · Build<br/>write the code"]
  build --> update["4 · Update<br/>docs + diagrams"]
  update --> record["5 · Record<br/>feature + history"]
  record --> decide{"6 · Decision<br/>made?"}
  decide -- yes --> adr["write an ADR"]
  decide -- no --> done(["done"])
  adr --> done
```

Run `npx github:El-Sayed-Mustafa/visual-project-os check` to find missing
records, broken links, leftover placeholders and code changes with no brain
update.
