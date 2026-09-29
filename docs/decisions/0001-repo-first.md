# ADR-0001: Repo-first template, not a SaaS or app

| | |
| --- | --- |
| **Date** | 2026-09-29 |
| **Status** | accepted |

## Context

The goal is a tool that keeps a live, visual picture of a project while AI
agents change it quickly. It has to be free, easy to adopt in under 15 minutes,
easy to share as open source, and independent of any vendor.

## Decision

v0.x ships as a **template repo**: Markdown docs, Mermaid diagrams, `AGENTS.md`
rules and prompts, plus a small zero-dependency CLI for installing and checking.
The agent does the understanding; the repo stores it.

## Alternatives considered

| Option | Pros | Cons | Why not |
| --- | --- | --- | --- |
| Build on IcePanel / CodeSee | Polished visuals | Paid, accounts, lock-in, friction | Hurts adoption; kept as optional integrations |
| Web app / dashboard first | Nice demo | Months of work, hosting, auth | Over-engineering for an MVP |
| Full CLI with code parsing | Automatic diagrams | Language-specific, large scope | Agents already read code well; revisit later |

## Consequences

- **Good:** free, works offline, versioned with the code, reviewable in PRs, any
  agent can use it.
- **Bad:** quality depends on the agent following `AGENTS.md`. `vpos check`
  and the CI rule reduce but don't remove this risk.
- **Follow-ups:** npm publish, impact-map drafting from `git diff`.
