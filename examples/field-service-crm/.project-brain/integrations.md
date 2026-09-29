# Integrations — Field Service CRM

> Last reviewed: 2026-09-29

| Service | Used for | How | Config (names only) | Called from |
| --- | --- | --- | --- | --- |
| Supabase Postgres | Primary database | PostgREST + RPC (server-side key from Apps Script; Edge uses its own env) | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `Supabase.js`, `SupabasePrimary.js`, `crm-api` |
| Supabase Edge `crm-api` | Fast path for office + portal reads/writes | `fetch` POST carrying the signed `x-crm-token` | `CRM_EDGE_SECRET` (Edge); client config in `FastApi.js` | `Script.html`, `TechnicianScript.html` |
| Green API (WhatsApp) | Lead intake from WhatsApp chats | `UrlFetchApp` GET `getChats`, `lastIncomingMessages`, `lastOutgoingMessages`; optional `doPost` webhook | `GREEN_API_INSTANCE_ID`, `GREEN_API_TOKEN` | `GreenApiLeads.js` |
| Google Drive | Report media, call recordings | `DriveApp` | `CALL_RECORDINGS_FOLDER_ID_` | `Visitreports.js`, `CustomerCalls.js` |
| Email (MailApp) | Technician booking email (RTL) | `MailApp.sendEmail` from the outbox worker | `CONFIG.SEND_TECHNICIAN_EMAILS` | `CalendarEmail.js` |
| Google Calendar | Invites (currently **off**) | `CalendarApp` | `CONFIG.CREATE_CALENDAR_EVENTS: false` | `CalendarEmail.js` |
| Google Contacts | Paid-visit customers saved to the company's contacts | People API advanced service v1 | — | `ContactsSync.js` |
| Android call log | Calls → leads | Edge function `call-log` | — | device app (unverified) |

## Failure behaviour

| Service | If it is slow / down / rate-limited | Retry? | User impact |
| --- | --- | --- | --- |
| Edge `crm-api` | Reads fall back to `google.script.run.officeApi`; **writes fail** and show an error | reads only | Slower reads; bookings/reports blocked |
| Postgres | Both paths fail | no | App unusable |
| Green API | Pull skipped until next 10-min run; `lastIncomingMessages` only covers 24 h | next trigger | Leads older than 24 h can be missed if the pull stops for a day |
| MailApp | Outbox job stays pending; daily MailApp quota applies | next 1-min run | Technician not emailed |
| Drive | Upload fails in portal | user retries | Report without media |
| Apps Script triggers | Daily trigger-runtime quota can be exhausted by 1-min triggers | — | Outbox, contacts and lead pulls stop |

## Credentials

- All secrets live in **Script Properties** (Apps Script) and **Supabase function
  secrets** (Edge). None belong in this folder.
