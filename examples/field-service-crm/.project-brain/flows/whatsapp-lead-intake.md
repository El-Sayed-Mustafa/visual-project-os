# Flow: WhatsApp lead intake

**Trigger:** time trigger every 10 min (or the Green API webhook).
**Outcome:** every unknown WhatsApp number becomes one lead; known numbers are marked as existing customers.
**Entry point:** `GreenApiLeads.js` → `pullGreenApiLeadsOnSchedule`

```mermaid
sequenceDiagram
  participant TR as Time trigger (10 min)
  participant GL as GreenApiLeads.js
  participant GA as Green API
  participant DB as Postgres
  actor O as Office user
  TR->>GL: pullGreenApiLeadsOnSchedule
  GL->>GA: getChats, lastIncomingMessages, lastOutgoingMessages
  GA-->>GL: chats (last 24 h of messages)
  GL->>DB: match phone digits to crm_customers
  GL->>DB: upsert crm_leads (one per number)
  O->>DB: updateLeadCheck / convertLeadToCustomer (via Edge)
  O->>DB: book appointment → crm_number_became_customer
```

## Steps

1. `extractGreenApiUnknownLeads` pulls chats (limit `GREEN_API_PULL_LIMIT` 300).
2. `importGreenApiChats_` normalises phones (country-code prefixes in local, `00` and `+` forms), dedupes, and upserts one lead per number.
3. Office staff work the lead: call result, next follow-up, convert to customer, book.
4. Alternative entry: the `doPost` webhook → `handleGreenApiWebhook_`.
5. Repair tools: `mergeDuplicateLeads`, `assignLeadNumbers`, `repairLeadCustomerSync`.

## Failure cases

| Where | What can fail | What happens |
| --- | --- | --- |
| Trigger stopped / quota | No pulls | Messages older than 24 h are missed (`lastIncomingMessages` window) |
| Auth change | Trigger owner lost access | Pull silently stops. Confirm it still runs (open item) |
| Same person, two numbers | Two leads | Manual merge |
