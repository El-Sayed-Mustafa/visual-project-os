# Flow: checkout and payment

**Trigger:** customer clicks "Pay" in the cart · **Outcome:** order `paid`, receipt emailed · **Entry:** **app/api/checkout/route.ts** → `POST`

```mermaid
sequenceDiagram
  actor C as Customer
  participant W as Storefront
  participant API as Checkout API
  participant DB as Postgres
  participant S as Stripe
  participant H as Stripe webhook
  participant E as Resend
  C->>W: click Pay
  W->>API: POST /api/checkout (cart)
  API->>DB: create order (pending), prices from DB
  API->>S: create Checkout Session
  S-->>W: hosted payment page URL
  C->>S: pay with card
  S->>H: checkout.session.completed
  H->>DB: mark order paid + insert payment
  H->>E: send receipt
  S-->>C: redirect to /order/success
```

| Can fail | What happens |
| --- | --- |
| Card declined | Customer stays on Stripe page, order stays `pending` |
| Webhook delayed | Success page shows "confirming…" until paid |
| Session not paid in 24 h | Order becomes `expired` |
