# Optional integrations

visual-project-os is vendor-neutral. The brain is plain Markdown + Mermaid, so
any tool can sit next to it. None of these are required.

| Tool | Use it for | How it fits |
| --- | --- | --- |
| **GitHub / GitLab** | Viewing diagrams | Mermaid blocks render natively in files, PRs and issues. |
| **VS Code** | Viewing locally | Built-in Markdown preview + the "Markdown Preview Mermaid Support" extension. |
| **Mermaid CLI** (`@mermaid-js/mermaid-cli`) | SVG/PNG export, strict syntax checks | Extract a ` ```mermaid ` block to `.mmd` and run `mmdc -i x.mmd -o x.svg`. |
| **Mermaid Live Editor** | Hand-editing a diagram | Paste a block into mermaid.live, then paste it back. |
| **IcePanel** | Interactive C4 models for a wider audience | Use `architecture.md` as the source of truth and link the IcePanel view from it. Record the choice in an ADR. |
| **CodeSee** (or similar code-map tools) | Auto-generated dependency maps | Complements the brain: generated maps show *what is*, the brain explains *why* and *what changed*. Link maps from `architecture.md`. |
| **Structurizr / C4-PlantUML** | Formal C4 models | Mermaid supports `C4Context` / `C4Container` diagrams in the same files; move to Structurizr DSL if you outgrow them. |
| **D2** | Better automatic layout | Keep Mermaid as the source; export to D2 for presentations. |

## Rule of thumb

The brain is the **source of truth for understanding**. External tools are
**views**. If a tool holds information that isn't in the brain, add a link to it
in `architecture.md` and write down why in an ADR.
