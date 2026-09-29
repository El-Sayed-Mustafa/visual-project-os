# LinkedIn launch post (draft)

---

AI agents write code faster than I can understand it.

After a few weeks of building with Claude Code and Codex, I had the same problem
on every project:
→ dozens of changes I never really reviewed
→ no current picture of the architecture
→ no idea what a change touched until something broke
→ coming back after two weeks felt like reading a stranger's code

So I built **visual-project-os**: an open-source, living, visual memory for
AI-built projects.

One command adds a `.project-brain/` folder to any repo:
📐 architecture and system context (Mermaid, renders on GitHub)
🔁 sequence diagrams for the important flows
🗄️ data model as an ER diagram
🧭 decision log (ADRs)
📜 feature history, with a before/after **impact map** for every change

The key part is the `AGENTS.md` rules. Before building a feature, the agent has
to show the current slice of the system and the same slice after the change,
with new parts in green and changed parts in amber. After building it, the agent
updates the map. A small CLI and a GitHub Action fail the PR if code changed but
the brain didn't.

I piloted it on two real production projects: a field-service CRM (Apps Script +
Supabase + Edge Functions) and a Python data pipeline running on a fleet of
machines. An anonymized version of the CRM's brain is in the repo, with 4 flows,
3 ADRs and before/after impact maps.

✅ Free, no SaaS, no account
✅ Works with Claude Code, Codex, Cursor, Copilot, and any agent that reads AGENTS.md
✅ Plain Markdown + Mermaid, versioned with your code

Try it:
npx github:El-Sayed-Mustafa/visual-project-os init

Repo 👉 https://github.com/El-Sayed-Mustafa/visual-project-os

How do you keep your mental model of a codebase when AI writes most of it?

#AI #SoftwareArchitecture #OpenSource #ClaudeCode #DeveloperTools

---

**Visuals to attach (in order):**
1. Screenshot: a before/after impact map from a feature record in the pest-control example
2. Screenshot: the `architecture.md` container diagram rendered on GitHub
3. Short GIF: `vpos init` → agent runs `understand-project` → `vpos check` output
