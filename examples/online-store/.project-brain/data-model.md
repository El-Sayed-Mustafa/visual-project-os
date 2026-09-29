# Data model — Acme Store

> Last reviewed: 2026-09-20

## Stores

| Store | Holds |
| --- | --- |
| Postgres (Neon) | Products, orders, payments, admins |
| Stripe | Card data and payment history (never stored by us) |
| `cart` cookie | Cart items before checkout |

## Entities

```mermaid
erDiagram
  customers ||--o{ orders : places
  orders ||--|{ order_items : contains
  products ||--o{ order_items : "sold as"
  orders ||--o| payments : "paid by"
  customers {
    uuid id PK
    text email
    text name
  }
  products {
    uuid id PK
    text name
    int price_cents
    int stock
  }
  orders {
    uuid id PK
    uuid customer_id FK
    text status
    int total_cents
  }
  order_items {
    uuid order_id FK
    uuid product_id FK
    int quantity
    int unit_price_cents
  }
  payments {
    uuid id PK
    uuid order_id FK
    text stripe_session_id
    text stripe_event_id
    int amount_cents
  }
```

## Order lifecycle

```mermaid
stateDiagram-v2
  [*] --> pending: checkout started
  pending --> paid: webhook checkout.session.completed
  pending --> expired: session expired (24 h)
  paid --> shipped: admin ships
  paid --> refunded: admin refunds
  shipped --> [*]
```
