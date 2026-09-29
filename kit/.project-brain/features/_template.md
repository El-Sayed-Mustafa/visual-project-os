# <Feature title>

| | |
| --- | --- |
| **Date** | YYYY-MM-DD |
| **Type** | feature / fix / refactor / infra / data |
| **Status** | planned / in progress / done |
| **Decision** | ADR link or — |

## Change summary

- (≤ 4 bullets: what changed and why)

## Before

```mermaid
flowchart LR
  a["Component A"] --> b["Component B"]
```

## After — impact map

```mermaid
flowchart LR
  a["Component A"]:::changed --> b["Component B"]
  a --> c["New component C"]:::added
  classDef added fill:#d3f9d8,stroke:#2b8a3e,color:#1b4332
  classDef changed fill:#fff3bf,stroke:#e67700,color:#5c3c00
  classDef removed fill:#ffe3e3,stroke:#c92a2a,color:#5c1a1a,stroke-dasharray:4 3
```

## Flow

<!-- Delete if nothing new flows at runtime. -->

```mermaid
sequenceDiagram
  actor U as User
  participant A as Component A
  participant C as Component C
  U->>A: action
  A->>C: new call
  C-->>A: result
```

## Files

| File | Change |
| --- | --- |
| `path/to/file` | |

## Risks and tests

| Edge case | Behaviour |
| --- | --- |
| | |

**Data impact:** none · **Tested:** how
