# <Feature title>

| | |
| --- | --- |
| **Date** | YYYY-MM-DD |
| **Type** | feature / fix / refactor / infra / data |
| **Status** | planned / in progress / done |
| **Decision** | ADR link or — |

## Change summary

<!-- 3–5 bullets a busy person can read in 20 seconds. What changed and why. -->

-

## Problem

What was wrong or missing, and for whom.

## Before

<!-- The relevant slice of the system before the change. Copy the relevant
     part of architecture.md or a flow and trim it. -->

```mermaid
flowchart LR
  a["Component A"] --> b["Component B"]
```

## After — impact map

<!-- Same slice after the change. Mark nodes with the classes below.
     Untouched nodes keep the default style. -->

```mermaid
flowchart LR
  a["Component A"]:::changed --> b["Component B"]
  a --> c["New component C"]:::added
  classDef added fill:#d3f9d8,stroke:#2b8a3e,color:#1b4332
  classDef changed fill:#fff3bf,stroke:#e67700,color:#5c3c00
  classDef removed fill:#ffe3e3,stroke:#c92a2a,color:#5c1a1a,stroke-dasharray:4 3
```

## Flow

<!-- The new or changed runtime behaviour. Delete if nothing flows. -->

```mermaid
sequenceDiagram
  actor U as User
  participant A as Component A
  participant C as Component C
  U->>A: action
  A->>C: new call
  C-->>A: result
  A-->>U: response
```

## Files touched

| File | Change |
| --- | --- |
| `path/to/file` | added / changed / removed — what and why |

## Data impact

New or changed tables, columns, files, env vars, or "none".

## Edge cases and failure modes

| Case | Behaviour |
| --- | --- |
| | |

## Test notes

How it was verified (tests, manual steps, data used) and what is not covered.

## Brain docs updated

- [ ] architecture.md
- [ ] data-model.md
- [ ] integrations.md
- [ ] deployment.md
- [ ] flows/
- [ ] feature-history.md
