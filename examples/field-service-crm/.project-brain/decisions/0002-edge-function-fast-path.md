# ADR-0002: Edge Function `crm-api` as the fast path; writes never fall back

| | |
| --- | --- |
| **Date** | 2026-08 (reconstructed from code and project notes on 2026-09-29) |
| **Status** | accepted |
| **Feature** | [Supabase primary cutover](../features/2026-08-18-supabase-primary-cutover.md) |

## Context

Even with Postgres behind it, every `google.script.run` call pays the Apps
Script cold-start and round-trip cost (often seconds). Office staff book and
search all day, so latency is the main complaint.

## Decision

The browser calls a Supabase Edge Function (**supabase/functions/crm-api/index.ts**)
directly for functions listed in `DIRECT_SUPABASE_FUNCTIONS` /
`DIRECT_SUPABASE_MUTATIONS`. The Edge verifies the HMAC token, applies the same
role allow-lists, runs the business logic in TypeScript, and queues Google side
effects in `crm_sync_outbox` for the Apps Script worker. **Reads** fall back to
Apps Script. **Writes never fall back**, so a write can't run twice through two
implementations.

## Alternatives considered

| Option | Pros | Cons | Why not |
| --- | --- | --- | --- |
| Apps Script only | One implementation | Slow | The reason for this ADR |
| Supabase client in browser with RLS | No server code | Business rules and roles in the browser | Unsafe for money and roles |
| Separate Node server | Full control | Hosting, ops | Too heavy for this team |

## Consequences

- **Good:** fast UI; Google side effects are async and retryable.
- **Bad:** business logic exists twice (TS and Apps Script). Changes must update
  both or delete one on purpose.
- **Follow-ups:** move multi-step writes into RPC transactions; add unique
  constraints.
