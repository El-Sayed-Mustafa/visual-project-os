# Feature history — Field Service CRM

Newest first. One line per change; the full story lives in the linked record.

Types: `feature` · `fix` · `refactor` · `infra` · `docs` · `data`

| Date | Type | Change | Record | Decision |
| --- | --- | --- | --- | --- |
| 2026-09-29 | docs | Added visual-project-os: brain, agent rules, prompts | — | — |
| 2026-09-21 → 29 | feature | Day board, call log, lead history (069–085) | — | — |
| 2026-09-18 → 20 | feature | Receivables, address grouping, campaigns, marketing import, complaints, warranty (044–068) | — | — |
| 2026-09-14 | fix | White screen: `//` in regex stripped; fixed with `[/][/]` | — | — |
| 2026-09-14 | feature | Office accounts, roles, page ticks, activity log (041–043) | — | [ADR-0003](decisions/0003-office-accounts-and-roles.md) |
| 2026-09-02 | feature | Cash book: cash-in / cash-out triggers (034–037) | — | — |
| 2026-08-18 | infra | Supabase Postgres primary + Edge fast path; Sheets frozen | [record](features/2026-08-18-supabase-primary-cutover.md) | [ADR-0001](decisions/0001-supabase-primary-database.md), [ADR-0002](decisions/0002-edge-function-fast-path.md) |
| 2026-07-21 | infra | Adopted `clasp` 2.4.2; local folder is source of truth | — | — |
| 2026-07-17 | fix | v5 white-screen hotfix: sandbox nav anchors, boot try/catch | [record](features/2026-07-17-white-screen-hotfix.md) | — |
| 2026-07-17 | feature | v4 customer profiles: `Customer_Calls`, recordings to Drive | — | — |
| 2026-07-17 | feature | v3 technician profiles; consistent currency formatting | — | — |
| 2026-07-17 | feature | v2 localisation: currency, time zone, phone normalisation | — | — |
| 2026-07-17 | feature | v1 field ops: portal, inventory, expenses, email invites (Sheets) | — | — |
