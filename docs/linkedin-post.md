# LinkedIn launch post (draft)

---

You asked AI to add Stripe payments to your store.

It worked. The tests pass.

But can you say what it changed?
→ Which files?
→ Which tables?
→ What happens now if the webhook fails?

AI writes code faster than we can understand it. After a few weeks, your own
project feels like a stranger's.

So I built **visual-project-os**, an open-source "memory" for AI-built projects.

Here's the same request with it installed:

1️⃣ **Plan first.** Before writing code, the agent shows you a before/after map
of the system. New parts are green, changed parts amber, removed parts red.

2️⃣ **Walk the flow.** The new checkout becomes a step-by-step diagram you can
click through: cart → Stripe → webhook → "order paid".

3️⃣ **Leave a record.** A change summary, the files touched, the edge cases and
the decisions, all saved in the repo.

4️⃣ **Safety net.** If someone changes code without updating the map, the PR
fails.

It's all plain Markdown + Mermaid inside your repo. No SaaS, no account.
It works with Claude Code, Codex, Cursor and Copilot.

Try it in 10 seconds:
npx github:El-Sayed-Mustafa/visual-project-os init

⭐ https://github.com/El-Sayed-Mustafa/visual-project-os

How do you keep track of what your AI agent changed?

#AI #SoftwareEngineering #OpenSource #ClaudeCode #DeveloperTools

---

**Visuals:** a 6-slide carousel (1080×1350; upload the PDF as a LinkedIn
document post). Every visual is built from `examples/online-store`, an
illustrative sample store:

1. Hook: "You asked AI to add payments. What did it change?" + impact map
2. Before / after impact map
3. The viewer walking through the checkout flow
4. The feature record
5. `vpos check` failing a PR (real output)
6. Install command + repo
