# Integrations — Field Service CRM

> Last reviewed: 2026-09-29

| Service | Used for | How | Config (names only) | Called from |
| --- | --- | --- | --- | --- |
| Supabase Postgres | Primary database | PostgREST + RPC | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `Supabase.js`, `SupabasePrimary.js`, `crm-api` |
| Edge `crm-api` | Fast reads/writes, office + portal | `fetch` POST with `x-crm-token` | `CRM_EDGE_SECRET`; client in `FastApi.js` | `Script.html`, `TechnicianScript.html` |
| Green API (WhatsApp) | Lead intake | `getChats`, `lastIncomingMessages`, `lastOutgoingMessages`; `doPost` webhook | `GREEN_API_INSTANCE_ID`, `GREEN_API_TOKEN` | `GreenApiLeads.js` |
| Google Drive | Report media, call recordings | `DriveApp` | `CALL_RECORDINGS_FOLDER_ID_` | `Visitreports.js`, `CustomerCalls.js` |
| MailApp | Technician booking email (RTL) | Outbox worker | `CONFIG.SEND_TECHNICIAN_EMAILS` | `CalendarEmail.js` |
| Google Calendar | Invites (**off**) | `CalendarApp` | `CONFIG.CREATE_CALENDAR_EVENTS: false` | `CalendarEmail.js` |
| Google Contacts | Save paid-visit customers | People API v1 | — | `ContactsSync.js` |
| Android call log | Calls → leads | Edge `call-log` | — | device app (unverified) |

## Failure behaviour

| Service | When down / slow | Retry | User impact |
| --- | --- | --- | --- |
| Edge `crm-api` | Reads fall back to `officeApi`; **writes fail** | reads only | Bookings and reports blocked |
| Postgres | Both paths fail | no | App unusable |
| Green API | Skipped till next 10-min run; 24 h window | next trigger | Leads missed if pull stops a day |
| MailApp | Job stays pending; daily quota | next 1-min run | Technician not emailed |
| Drive | Portal upload fails | user retries | Report without media |
| Apps Script triggers | 1-min triggers can exhaust daily quota | — | Outbox, contacts, lead pulls stop |

Secrets live only in Script Properties and Supabase function secrets.
