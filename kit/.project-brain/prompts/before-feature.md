# Prompt: plan a change before coding

Use before any feature, refactor or non-trivial fix. Replace `<REQUEST>`.

---

I want to make this change: **<REQUEST>**

Do not write code yet. Read `AGENTS.md`, then the relevant parts of
`.project-brain/`, then the code you would touch. Reply with a plan in this
exact shape:

## 1. Current state
One paragraph + a Mermaid diagram of **only the part of the system this touches**
(use real component names from `architecture.md`).

## 2. Proposed change
The same diagram after the change, using the impact classes from `AGENTS.md`
(`added`, `changed`, `removed`). Then a `sequenceDiagram` of the new or changed
flow.

## 3. Affected
| Area | What changes |
| --- | --- |
| Components / files | |
| Data (tables, columns, files) | |
| Integrations / config / env | |
| Existing flows | |

## 4. New failure cases
| Case | How we handle it |
| --- | --- |

## 5. Alternatives
At least one other way to do it and why you prefer this one. Say whether this
needs an ADR.

## 6. Plan
Numbered implementation steps, smallest safe order. Include how you will test.

## 7. Open questions
Anything you need me to decide.

Wait for my approval before implementing.
