# Data model — Field Service CRM

> Last reviewed: 2026-09-29

## Where data lives

| Store | What it holds |
| --- | --- |
| Supabase Postgres (primary) | ~30 `crm_*` tables; RLS, no anon grants, `security definer` RPCs, money triggers |
| Google Sheets (15 tabs) | **Frozen snapshot** (`CONFIG.SHEETS_BACKUP_ENABLED: false`) |
| Google Drive | Folder per appointment: photos, voice notes, signatures, recordings |
| Script Properties | Secrets + small queues (`CRM_APPOINTMENT_JOB_*`, `PAID_VISIT_CONTACT_*`, `CRM_LAST_ID_*`) |
| Browser `localStorage` | 6 h cache of `LOCAL_READ_FUNCTIONS` results |

## Core operations

```mermaid
erDiagram
  crm_customers ||--o{ crm_appointments : books
  crm_annual_contracts |o--o{ crm_appointments : generates
  crm_appointments ||--o| crm_visit_reports : "one report (app-enforced)"
  crm_customers ||--o{ crm_follow_ups : has
  crm_appointments |o--o{ crm_follow_ups : triggers
  crm_leads |o--o{ crm_follow_ups : has
  crm_technicians |o..o{ crm_appointments : "by name string"
  crm_customers ||--o{ crm_customer_calls : logs
  crm_customers {
    text customer_id PK
    text customer_name
    text phone
    text phone_digits "generated"
    text area
    text governorate
    boolean credit_allowed
    text address_key
  }
  crm_appointments {
    text appointment_id PK
    text customer_id FK
    text contract_id FK
    date appointment_date
    text start_time
    text technician_vehicle
    numeric price
    numeric final_price
    text appointment_status
    text report_status
    int day_order
  }
  crm_visit_reports {
    text report_id PK
    text appointment_id FK
    text customer_id FK
    text technician_id FK
    text visit_status
    numeric collected_amount
    numeric remaining_amount
    text payment_method
    date promised_payment_date
    int warranty_months
  }
  crm_follow_ups {
    text follow_up_id PK
    text customer_id FK
    text appointment_id FK
    text lead_id FK
    date follow_up_date
    text follow_up_status
  }
  crm_leads {
    text lead_id PK
    text whatsapp_digits "generated"
    text status
    text existing_customer_id "no FK"
    text converted_customer_id "no FK"
  }
  crm_technicians {
    text technician_id PK
    text name
    text portal_password_hash "bcrypt"
  }
```

## Money and stock

```mermaid
erDiagram
  crm_visit_reports ||--o| crm_cash_in : "trigger crm_cash_in_from_report_trg"
  crm_technician_expenses ||--o| crm_cash_out : "trigger crm_cash_out_from_expense_trg"
  crm_customers ||--o{ crm_receivable_payments : pays
  crm_receivable_payments ||--o| crm_cash_in : records
  crm_inventory_items ||--o{ crm_inventory_movements : moves
  crm_inventory_items ||--o{ crm_technician_stock : "held by technician"
  crm_appointments ||--o{ crm_appointment_materials : uses
  crm_cash_in {
    text report_id "unique"
    numeric amount
  }
  crm_cash_out {
    text expense_id "unique"
    numeric amount
  }
  crm_technician_stock {
    text technician_id PK
    text item_id PK
    numeric quantity_with_technician
  }
```

## Other tables

| Table | Purpose |
| --- | --- |
| `crm_call_groups` → `crm_call_batches` → `crm_call_tasks` → `crm_call_log` | Calling campaigns (unique `phone_digits` per task) |
| `crm_call_log_inbox` | Android call-log intake (Edge `call-log`) |
| `crm_complaints`, `crm_complaints_deleted`, `crm_complaint_rules` | Complaints linked to report, visit or booking |
| `crm_warranty_rules`, `crm_service_aliases` | Warranty months per service |
| `crm_settings` | Lists (services, areas, statuses) as category/value rows |
| `crm_office_users`, `crm_activity_log` | Accounts (role, `session_version`, `pages text[]`); audit log |
| `crm_sync_outbox` | Google side-effect jobs (unique `event_key`), drained every minute |
| `crm_id_counters`, `crm_idempotency_keys` | RPC `crm_reserve_ids` (`APPT…`, `RPT…`); idempotency **unused** |

## Notes

| Topic | Detail |
| --- | --- |
| Adapter | `supabaseSheetMeta_` maps sheet headers to snake_case columns |
| Source columns | `source_row`, `source_payload`, `source_system`, `record_updated_at` on every table |
| Status sync | `VISIT_TO_APPOINTMENT_STATUS`; two visit states (`migrateVisitStatusesToTwoStates`) |
| Migrations | `001_crm_schema.sql` … `085_lead_history.sql`, by hand, each with "TO UNDO" |
| History table | Empty — **never `supabase db push`** |

## Appointment lifecycle

```mermaid
stateDiagram-v2
  [*] --> Scheduled: createAppointment
  Scheduled --> Completed: report filed (completed)
  Scheduled --> NotCompleted: report filed (reason required)
  NotCompleted --> Scheduled: rebooked
  Completed --> [*]
```
