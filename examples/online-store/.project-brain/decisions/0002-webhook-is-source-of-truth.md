# ADR-0002: The Stripe webhook decides when an order is paid

| | |
| --- | --- |
| **Date** | 2026-09-20 |
| **Status** | accepted |
| **Feature** | [Stripe checkout](../features/2026-09-20-stripe-checkout.md) |

**Context:** Customers can close the tab after paying, and success-page
redirects can be faked. We need one trustworthy signal.

**Decision:** We will mark orders `paid` only in the signed
`checkout.session.completed` webhook, idempotent on `stripe_event_id`.

| Alternative | Why not |
| --- | --- |
| Mark paid on the success page | Can be skipped or faked |
| Poll Stripe from the browser | Slow, still client-controlled |

- **Good:** one source of truth; works if the tab closes.
- **Bad:** orders may show "confirming…" for a few seconds.
- **Follow-ups:** admin "sync with Stripe" button for stuck orders.
