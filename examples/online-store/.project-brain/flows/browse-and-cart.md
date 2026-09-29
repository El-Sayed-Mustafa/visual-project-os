# Flow: browse and add to cart

**Trigger:** customer opens a product · **Outcome:** item in the `cart` cookie · **Entry:** **app/(shop)/products/[slug]/page.tsx**

```mermaid
sequenceDiagram
  actor C as Customer
  participant W as Storefront
  participant DB as Postgres
  C->>W: open product page
  W->>DB: load product, price, stock
  DB-->>W: product
  C->>W: Add to cart
  W->>W: update cart cookie
  W-->>C: cart badge +1
```

| Can fail | What happens |
| --- | --- |
| Out of stock | Button disabled, "Notify me" shown |
