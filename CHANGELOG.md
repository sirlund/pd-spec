# Changelog

## [2.4.0] — 2025-02-10

### Added
- **`/visualize` skill** — generates interactive Mermaid diagrams from Work layer (system-map, insights, conflicts, all). Outputs to `03_Outputs/DIAGRAMS.html`
- **`/ship presentation`** — Reveal.js slide deck generator. Single HTML file with speaker notes, keyboard navigation, and presenter mode
- **`/ship report`** — A4 formatted report for stakeholders, optimized for Print > Save as PDF. Cover page, table of contents, executive summary

### Changed
- `/ship` argument-hint expanded: `[prd|presentation|report|benchmark|audit|strategy]`
- All docs updated to reflect 4-skill pipeline (analyze, synthesis, ship, visualize)

## [2.3.0] — 2025-02-10

### Added
- **Project Memory** (`02_Work/MEMORY.md`) — session log and state tracker. Skills append entries after execution; agent reads at session start for continuity and manual edit detection
- **`_CONTEXT.md` system** for non-markdown sources — images, PDFs, spreadsheets, .txt, .docx files get metadata via a folder-level `_CONTEXT.md` file. Template at `01_Sources/_CONTEXT_TEMPLATE.md`
- **Layer signage** — `_README.md` in `01_Sources/`, `02_Work/`, and `03_Outputs/` explaining what the folder is and what the user should (not) do
- **Phase 0: Integrity Check** in all three skills — reads MEMORY.md at session start, compares against actual Work layer state, reports discrepancies before proceeding
- **Session Protocol** section in CLAUDE.md — defines the agent's startup sequence (read memory → integrity check → resume context)

### Changed
- `/analyze` now reads `_CONTEXT.md` files to understand non-markdown sources
- All skills now append to `02_Work/MEMORY.md` after execution
- README, CLAUDE.md, FRAMEWORK.md updated with MEMORY system, _CONTEXT.md documentation, and agent-managed layer warnings

## [2.2.0] — 2025-02-10

### Added
- **Agent Mandates expanded** from 3 to 7: added Transparency & Control, Proactive Gap Detection, Source Organization Validation, Uncertainty Management
- **Source organization by milestone/category** — subfolders in `01_Sources/` with naming conventions (date-prefixed for events, category-based for themes)
- **Agent Behavior Protocols** section in `docs/FRAMEWORK.md` — propose-before-executing, evidence gap handling, proactive suggestions, source validation, uncertainty management
- **Propose-first workflow** in all three skills (`/analyze`, `/synthesis`, `/ship`) — agent presents draft findings and waits for user approval before writing to files

### Changed
- **No Hallucination mandate** enhanced with actionable phrasing: "¿lo marcamos como asunción o sugiero cómo validarlo?"
- `/analyze` skill restructured into 4 phases: Discovery & Validation → Analysis → Propose → Write
- `/synthesis` skill restructured into 4 phases: Load → Present & Discuss → Propose → Write
- `/ship` skill restructured into 3 phases: Load & Validate → Propose → Generate
- README updated with source organization patterns and expanded design principles (Transparency, Proactive Gap Detection)

## [2.1.0] — 2025-02-10

### Changed
- **README rewritten as architecture documentation** — explains the problem, the 3-layer invariant, design principles, and maturity model before "Getting Started"
- **CLAUDE.md filled in** with ProductLM as the project (no more placeholders)
- Repo positioning shifted from "template to clone" to "product architecture reference"

## [2.0.0] — 2025-02-09

### Changed
- **Pivot from consultant proposal template to Product Knowledge OS**
- Replaced Makefile + init.sh pipeline with Claude Code skills (`/analyze`, `/synthesis`, `/ship`)
- Replaced `Propuesta_Master.html` and `Presentacion.html` with traceable `PRD.html`
- Replaced `BACKLOG.md` with `CONFLICTS.md` contradiction log
- Moved `FRAMEWORK.md` from `02_Work/` to `docs/`

### Added
- `.claude/skills/` — three skill definitions (analyze, synthesis, ship)
- `02_Work/INSIGHTS_GRAPH.md` — atomic insights with `[IG-XX]` IDs
- `02_Work/SYSTEM_MAP.md` — product logic decisions with insight traceability
- `02_Work/CONFLICTS.md` — contradiction detection and resolution log
- `01_Sources/_SOURCE_TEMPLATE.md` — generic source capture template
- `03_Outputs/PRD.html` — A4 HTML PRD template with insight references
- `docs/FRAMEWORK.md` — full methodology documentation
- Maturity levels (Seed → Validation → Ecosystem) in CLAUDE.md
- 3 Mandates: No Hallucination, Homer's Car Detector, Silence is Gold

### Removed
- `init.sh` — no setup script needed
- `Makefile` — replaced by Claude Code skills
- `docs/PANDOC_SETUP.md` — no Pandoc pipeline
- `01_Sources/00_initial_brief.md` — replaced by `_SOURCE_TEMPLATE.md`
- `02_Work/Propuesta_Master.html` — replaced by `03_Outputs/PRD.html`
- `03_Outputs/Presentacion.html` — not a base deliverable in v2
- `02_Work/BACKLOG.md` — replaced by `CONFLICTS.md`
