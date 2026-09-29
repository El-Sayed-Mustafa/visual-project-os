# ADR-0002: Edge Function `crm-api` as the fast path; writes never fall back

| | |
| --- | --- |
| **Date** | 2026-08 (reconstructed from code and project notes on 2026-09-29) |
| **Status** | accepted |
| **Feature** | [Supabase primary cutover](../features/2026-08-18-supabase-primary-cutover.md) |

## Context

Even with Postgres, every `google.script.run` call pays Apps Script cold-start
and round-trip cost, often seconds. Office staff book and search all day, so
latency is the main complaint.

## Decision

The browser calls **supabase/functions/crm-api/index.ts** directly for
`DIRECT_SUPABASE_FUNCTIONS` / `DIRECT_SUPABASE_MUTATIONS`; it verifies the HMAC
token, applies role allow-lists, runs the logic and queues side effects in
`crm_sync_outbox`. Reads fall back to Apps Script; **writes never fall back**,
so no write runs twice through two implementations.

## Alternatives considered

| Option | Pros | Cons / why not |
| --- | --- | --- |
| Apps Script only | One implementation | Slow — the reason for this ADR |
| Browser Supabase client + RLS | No server code | Rules and roles in browser; unsafe for money |
| Separate Node server | Full control | Hosting and ops too heavy for team |

## Consequences

- **Good:** fast UI; Google side effects async and retryable.
- **Bad:** logic exists twice (TS + Apps Script); update both or delete one.
- **Follow-ups:** multi-step writes into RPC transactions; add unique constraints.
