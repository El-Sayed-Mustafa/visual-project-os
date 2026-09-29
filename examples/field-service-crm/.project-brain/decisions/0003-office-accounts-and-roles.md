# ADR-0003: Own office accounts with roles and session-versioned tokens

| | |
| --- | --- |
| **Date** | 2026-09-14 (reconstructed from code and project notes on 2026-09-29) |
| **Status** | accepted |
| **Feature** | — |

## Context

Early versions identified people by Google account (`Session.getActiveUser()`)
and required every user to have one. Staff shared devices, some had no Google
account, and management needed per-person permissions (accountant vs employee)
and an audit trail.

## Decision

Accounts live in `crm_office_users` (role admin / accountant / employee,
bcrypt `password_hash`, `session_version`, `pages text[]`). Sign-in returns an
HMAC-SHA256 token (30 days) carrying `uid` and `sv`. Every request re-checks
`sv` and `active`, so stopping an account or changing its password ends its
sessions within seconds. The app does its own authentication instead of relying
on Google accounts. Writes are stamped with the actor and logged in
`crm_activity_log`.

## Alternatives considered

| Option | Pros | Cons | Why not |
| --- | --- | --- | --- |
| Google accounts | No passwords to store | Shared devices, not everyone has one, no per-page roles | Didn't fit the office |
| Supabase Auth | Managed | Second login system next to Apps Script | More moving parts |

## Consequences

- **Good:** per-page permissions, instant revocation, audit log.
- **Bad:** one more credential store to operate (hashing, password resets,
  session revocation) that the team now owns.
- **Follow-ups:** self-service password reset; periodic review of the role
  allow-lists on both server paths.
