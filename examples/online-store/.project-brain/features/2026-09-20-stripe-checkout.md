# Stripe checkout

| | |
| --- | --- |
| **Date** | 2026-09-20 |
| **Type** | feature |
| **Status** | done |
| **Decision** | [ADR-0001](../decisions/0001-stripe-hosted-checkout.md), [ADR-0002](../decisions/0002-webhook-is-source-of-truth.md) |

Request: *"Add card payments with Stripe to the checkout."*

## Change summary

- Customers pay by card on Stripe's hosted checkout page.
- Orders become `paid` only when Stripe's webhook confirms.
- New `payments` table; receipts sent after payment.
- Cash on delivery removed.

## Before

```mermaid
flowchart LR
  cart["Cart page"] --> api["Orders API"]
  api --> db[("Postgres: orders")]
  api --> email["Resend: confirmation"]
  cod["Cash-on-delivery form"] --> api
```

## After — impact map

```mermaid
flowchart TB
  cart["Cart page"]:::changed --> api["Checkout API"]:::changed
  api --> db[("Postgres: orders")]:::changed
  api --> stripe["Stripe Checkout"]:::added
  stripe --> hook["Stripe webhook"]:::added
  hook --> pay[("payments table")]:::added
  hook --> email["Resend: receipt"]:::changed
  cod["Cash-on-delivery form"]:::removed
  classDef added fill:#d3f9d8,stroke:#2b8a3e,color:#1b4332
  classDef changed fill:#fff3bf,stroke:#e67700,color:#5c3c00
  classDef removed fill:#ffe3e3,stroke:#c92a2a,color:#5c1a1a,stroke-dasharray:4 3
```

New flow: [checkout and payment](../flows/checkout.md).

## Files

| File | Change |
| --- | --- |
| **app/api/checkout/route.ts** | changed: creates order + Checkout Session |
| **app/api/webhooks/stripe/route.ts** | added: verify, mark paid, send receipt |
| **lib/stripe.ts** | added: Stripe client |
| **prisma/schema.prisma** | changed: `payments` table, order `status` |
| **app/(shop)/cart/cod-form.tsx** | removed |

## Risks and tests

| Edge case | Behaviour |
| --- | --- |
| Webhook sent twice | Ignored via unique `stripe_event_id` |
| Customer closes tab after paying | Webhook still marks order paid |
| Price changed in the browser | Ignored; prices read from DB |

**Data impact:** new `payments` table; `orders.status` gains `expired` · **Tested:** Vitest + `stripe trigger checkout.session.completed`
