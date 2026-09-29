# ADR-0003: Own office accounts with roles and session-versioned tokens

| | |
| --- | --- |
| **Date** | 2026-09-14 (reconstructed from code and project notes on 2026-09-29) |
| **Status** | accepted |
| **Feature** | — |

## Context

Early versions identified people by Google account (`Session.getActiveUser()`).
Staff shared devices, some had no Google account, and management needed
per-person permissions and an audit trail.

## Decision

Accounts live in `crm_office_users` (admin / accountant / employee, bcrypt
`password_hash`, `session_version`, `pages text[]`); sign-in returns a 30-day HMAC
token re-checked (`sv`, `active`) on every request. Writes are actor-stamped and
logged in `crm_activity_log`.

## Alternatives considered

| Option | Pros | Cons / why not |
| --- | --- | --- |
| Google accounts | No passwords to store | Shared devices, not everyone has one, no page roles |
| Supabase Auth | Managed | Second login system beside Apps Script |

## Consequences

- **Good:** per-page permissions, revocation within seconds, audit log.
- **Bad:** team now owns a credential store (hashing, resets, revocation).
- **Follow-ups:** self-service password reset; review allow-lists on both server paths.
