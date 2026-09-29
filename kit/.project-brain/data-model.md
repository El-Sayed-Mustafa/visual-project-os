# Data model — {{PROJECT_NAME}}

> Last reviewed: {{DATE}}

## Stores

| Store | Holds |
| --- | --- |
| TODO(vpos) | |

## Entities

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  CUSTOMER {
    string id PK
  }
  ORDER {
    string id PK
    string customer_id FK
    string status
  }
```

## Notes

| Entity | Written by | Rules |
| --- | --- | --- |
| TODO(vpos) | | |

## Lifecycle

```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> active
  active --> closed
```
