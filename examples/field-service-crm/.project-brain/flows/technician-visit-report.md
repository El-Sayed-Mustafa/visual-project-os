# Flow: technician visit report

**Trigger:** technician submits the visit report in the portal.
**Outcome:** report stored, appointment closed, cash-in recorded, follow-up scheduled.
**Entry:** `TechnicianScript.html` → `submitTechnicianVisitReport` → Edge `addVisitReport`

```mermaid
sequenceDiagram
  actor T as Technician
  participant P as Portal (TechnicianScript.html)
  participant GAS as Apps Script
  participant D as Drive
  participant E as Edge crm-api
  participant DB as Postgres
  T->>P: sign in (Technician ID + password)
  P->>E: technicianLoginFast
  E->>DB: rpc crm_verify_technician_password
  E-->>P: technician token (6 h)
  T->>P: photos, voice note, signature
  P->>GAS: google.script.run.uploadFileToDrive
  GAS->>D: save to folder per appointment
  D-->>P: links
  T->>P: outcome, payment, materials, notes
  P->>E: submitTechnicianVisitReport
  E->>DB: already reported? (count check)
  E->>DB: applyMaterialUsageDirect (stock)
  E->>DB: insert crm_visit_reports
  Note over DB: trigger crm_cash_in_from_report_trg
  E->>DB: update appointment (report_status Filed, final_price)
  E->>DB: insert crm_follow_ups (default +7 days)
  E->>DB: outbox report_saved
  E-->>P: ok
```

## Steps

1. Sign in (bcrypt); Apps Script `technicianLogin` runs in parallel as fallback.
2. Media → Drive via `uploadFileToDrive` (max `MAX_UPLOAD_MB` 50).
3. `addVisitReport` validates notes ≥ 5 chars, payment method, promised date if owed.
4. Reject second report; apply materials; insert report; update appointment; follow-up (`FOLLOWUP_RULES`).
5. Trigger writes `crm_cash_in`; worker queues Contacts upsert for paid/complaint visits.

## Failure cases

| Where | What happens |
| --- | --- |
| Double submit (count check, no constraint) | Two reports possible under a race (open risk) |
| Appointment update fails after insert (no transaction) | Report exists, appointment still open |
| Drive upload fails | Technician retries; report can be filed without media |
| Technician renamed (matched by name) | Portal shows no appointments |
