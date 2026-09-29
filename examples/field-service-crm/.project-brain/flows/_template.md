# Flow: <name>

**Trigger:** what starts it (user action, schedule, webhook, CLI command).
**Outcome:** what is true when it finishes.
**Entry point:** `path/to/file` → `functionName`

```mermaid
sequenceDiagram
  actor U as User
  participant UI as UI
  participant API as Backend
  participant DB as Database
  U->>UI: action
  UI->>API: request
  API->>DB: read / write
  DB-->>API: rows
  API-->>UI: response
  UI-->>U: result
```

## Steps

1. …

## Failure cases

| Where | What can fail | What happens |
| --- | --- | --- |
| | | |
