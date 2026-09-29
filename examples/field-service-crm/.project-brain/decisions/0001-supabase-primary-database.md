# ADR-0001: Supabase Postgres is the primary database; Sheets is a frozen snapshot

| | |
| --- | --- |
| **Date** | 2026-08-18 (reconstructed from code and project notes on 2026-09-29) |
| **Status** | accepted |
| **Feature** | [Supabase primary cutover](../features/2026-08-18-supabase-primary-cutover.md) |

## Context

v1–v5 stored everything in the bound Google Sheet. After importing thousands of
rows, full-sheet `readTable_` reads, ScriptLock contention and Apps Script latency
made the app slow. Data also needed relations, constraints and money triggers.

## Decision

Move operational data to Postgres (`crm_*`), keeping Sheets-shaped helpers via
the `SupabasePrimary.js` adapter. Cut over per domain with `CONFIG.SUPABASE_*`
flags and `compare*Sources` parity tests, then set `SUPABASE_PRIMARY_DATABASE: true` and `SHEETS_BACKUP_ENABLED: false`.

## Alternatives considered

| Option | Pros | Cons / why not |
| --- | --- | --- |
| Stay on Sheets, optimise reads | No migration | Limits return as data grows; no constraints |
| Firebase / Firestore | Google ecosystem | No SQL; weak money reporting and joins |
| Dual-write forever | Safe fallback | Two sources of truth drift; temporary only |

## Consequences

- **Good:** fast queries, dashboard RPCs, cash-book triggers, RLS.
- **Bad:** adapter + dead Sheets branches remain; hand-applied migrations, empty history.
- **Follow-ups:** delete dead Sheets code; start proper migration history.
