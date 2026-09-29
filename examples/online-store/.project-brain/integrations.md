# Integrations — Acme Store

> Last reviewed: 2026-09-20

| Service | Used for | Config (names only) | Called from | If it fails |
| --- | --- | --- | --- | --- |
| Stripe Checkout | Card payments | `STRIPE_SECRET_KEY` | **app/api/checkout/route.ts** | Checkout button shows error |
| Stripe webhooks | Payment confirmation | `STRIPE_WEBHOOK_SECRET` | **app/api/webhooks/stripe/route.ts** | Stripe retries for 3 days |
| Resend | Receipts, shipping emails | `RESEND_API_KEY` | **emails/receipt.tsx** | Order paid, email logged as failed |
| Neon Postgres | All store data | `DATABASE_URL` | **lib/db.ts** | Store down |
