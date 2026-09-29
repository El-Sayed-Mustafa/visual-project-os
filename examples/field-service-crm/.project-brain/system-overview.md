# System overview — Field Service CRM

> Last reviewed: 2026-09-29

## In one paragraph

The internal operating system of a pest-control / field-service company. Office
staff book and schedule visits, manage customers, work WhatsApp and phone leads
and calling campaigns, chase follow-ups, receivables and complaints, and run
inventory, expenses, contracts and the cash book. Technicians use a mobile
portal to see their day and file one visit report per appointment (outcome,
payment, materials, photos, voice notes, signature). Management reads KPI
dashboards. It replaced a paper logbook and spreadsheets; historical data was
imported (thousands of customers, appointments, visit reports and leads).

## Users and actors

| Actor | What they do with the system |
| --- | --- |
| Office employee | Customers, leads, bookings, day board, follow-ups, calls, complaints |
| Accountant | Finance / cash book, receivables (per-account page ticks) |
| Admin / manager | Everything + accounts, settings, manager dashboard, activity log |
| Technician | Mobile portal: own appointments, visit reports, expenses, stock |
| Customer (indirect) | Messages on WhatsApp → becomes a lead |

## System context

```mermaid
flowchart LR
  office(["Office staff"]) -- "office app /exec" --> crm["Field Service CRM"]
  tech(["Technicians"]) -- "portal /exec?portal=technician" --> crm
  manager(["Management"]) -- "manager dashboard" --> crm
  customer(["Customers"]) -- "WhatsApp messages" --> green["Green API (WhatsApp)"]
  crm -- "pull chats every 10 min" --> green
  crm -- "read / write" --> supa[("Supabase Postgres")]
  crm -- "uploads, recordings" --> drive["Google Drive"]
  crm -- "booking emails" --> mail["Email (MailApp)"]
  crm -- "paid-visit contacts" --> contacts["Google Contacts"]
  crm -. "frozen backup" .-> sheets[("Google Sheets")]
```

## Key capabilities

- Booking and day board — `Appointments.js`, Edge `crm-api` (`createAppointment`)
- Technician visit reports — `TechnicianPortal.js`, `TechnicianScript.html`, Edge `addVisitReport`
- WhatsApp lead intake and conversion — `GreenApiLeads.js`
- Follow-ups, warranties, complaints — `Followups.js`, `Warranty.js`, Edge
- Money: cash book, receivables, expenses — Edge + Postgres triggers, `Expenses.js`
- Inventory and technician stock — `Inventory.js`
- Annual contracts — `Contracts.js`
- Manager KPIs — `ManagerDashboard.js` → RPC `crm_manager_dashboard_kpis`
- Office accounts and roles — `Auth.js`, `crm_office_users`

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | Apps Script `HtmlService` SPA, vanilla JS, bilingual Arabic RTL + English (`Localization.html`) |
| Server | Google Apps Script (V8) web app + Supabase Edge Function `crm-api` (Deno/TypeScript) |
| Storage | Supabase Postgres (primary, ~30 `crm_*` tables); Google Sheets frozen snapshot |
| Files | Google Drive |
| Hosting | Google (Apps Script pinned deployment) + Supabase |
| Tooling | `clasp` 2.4.2, Supabase CLI, Python/Node post-deploy check scripts |

## Where to go next

- [Architecture](architecture.md) · [Flows](flows/) · [Data model](data-model.md)
