# ADR-0001: Use Stripe's hosted Checkout page

| | |
| --- | --- |
| **Date** | 2026-09-20 |
| **Status** | accepted |
| **Feature** | [Stripe checkout](../features/2026-09-20-stripe-checkout.md) |

**Context:** We need card payments fast, with no card data on our servers and
Apple Pay / Google Pay included.

**Decision:** We will redirect customers to Stripe Checkout instead of building
our own card form.

| Alternative | Why not |
| --- | --- |
| Stripe Elements (own form) | More UI and PCI work for the same result |
| PayPal only | Many customers expect card and wallets |

- **Good:** no card data on our side; wallets for free; fast to ship.
- **Bad:** checkout leaves our domain; limited styling.
- **Follow-ups:** revisit Elements if conversion drops.
