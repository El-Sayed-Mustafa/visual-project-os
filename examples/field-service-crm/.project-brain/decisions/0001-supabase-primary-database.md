# ADR-0001: Supabase Postgres is the primary database; Sheets is a frozen snapshot

| | |
| --- | --- |
| **Date** | 2026-08-18 (reconstructed from code and project notes on 2026-09-29) |
| **Status** | accepted |
| **Feature** | [Supabase primary cutover](../features/2026-08-18-supabase-primary-cutover.md) |

## Context

v1–v5 stored everything in the bound Google Sheet. With thousands of customers,
appointments and reports imported, `readTable_` full-sheet reads, ScriptLock
contention and Apps Script latency made the app slow. The data also needed real
relations, constraints and money triggers.

## Decision

Move operational data to Supabase Postgres (`crm_*` tables). Keep the
Sheets-shaped code by routing `readTable_` / `appendRows_` / `updateRow_`
through an adapter (`SupabasePrimary.js`). The cutover is staged by per-domain
`CONFIG.SUPABASE_*` flags with parity tests (`compare*Sources`). After cutover,
set `SUPABASE_PRIMARY_DATABASE: true` and freeze Sheets
(`SHEETS_BACKUP_ENABLED: false`).

## Alternatives considered

| Option | Pros | Cons | Why not |
| --- | --- | --- | --- |
| Stay on Sheets, optimise reads | No migration | Hits limits again as data grows; no constraints | Didn't fix the root cause |
| Firebase / Firestore | Google ecosystem | No SQL, weak reporting for money | Reporting and joins matter |
| Keep dual-write forever | Safe fallback | Two sources of truth drift | Temporary only |

## Consequences

- **Good:** fast queries, RPCs for dashboards, triggers for the cash book, RLS.
- **Bad:** adapter layer and dead Sheets branches remain. Migrations are applied
  by hand with an empty history table.
- **Follow-ups:** delete dead Sheets code; start migration history properly
  (tracked in the project's migration master plan).
