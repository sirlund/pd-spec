# Changelog

## [3.2.0] — 2026-02-14

### Fixed — /ship (Track 1: 8 fixes from QA-30 to QA-61)
- `<title>` tag must respect `output_language` — was generating English titles in Spanish projects (QA-39, QA-45, QA-50, QA-56)
- Emoji policy enforced — only functional emojis (✓✗⚠️🔴🟠🟢▲▼), decorative ones (💸💎💡🎯🚀😢👍) prohibited (QA-40, QA-42, QA-51, QA-58)
- Traceability: every section must have `[IG-XX]` refs or explicit `[GAP]` marker — no silent gaps (QA-32, QA-37, QA-38, QA-43, QA-44, QA-53)
- No redundancy rule — same information must not repeat across sections of a document (QA-41)
- Language mixing prohibited — headings, labels, all visible text must be in `output_language` (QA-48, QA-49, QA-57)
- Multi-page outputs: separate `.page` divs with `page-break-after: always` for clean PDF export (QA-52, QA-59)
- `doc-meta` with changelog now mandatory for ALL output types, no exceptions (QA-46)
- `/ship benchmark` deprecated — anti-hallucination rule for competitor claims without `[IG-XX]` source. Will be reconverted to `benchmark-ux` in Ola 4 (QA-54)

### Fixed — /analyze (Track 2: 7 fixes from QA-01 to QA-29)
- Cross-referencing strengthened — actively seek contradictions, tensions, temporal conflicts, not just obvious opposites (QA-03, QA-20)
- Key quote required per insight — 1-2 sentences from source as evidence trail (QA-05)
- Atomicity enforced — "a list of 10 needs = 10 insights, not 1" (QA-14)
- Granularity guidance added — when to separate vs. consolidate insights (QA-15)
- Status labels as plain text (`PENDING`), not bold or backtick-wrapped (QA-16)
- `## Section` headers formalized as grouping mechanism in INSIGHTS_GRAPH.md (QA-17)
- Both sides of a conflict must reference `[IG-XX]` IDs (QA-19)

### Fixed — Other skills (Track 3)
- `/synthesis`: validate that argument IDs (IG-XX, CF-XX) exist before processing — no phantom resolutions (QA-24)
- `/kickoff` + CLAUDE.md: unified `## Project Context` and `## Project Settings` into a single section — eliminates redundancy (QA-06)
- CLAUDE.md: `team` and `started` fields as `[Set by /kickoff]` placeholders in template (QA-07)
- Session Protocol: timestamp format must be ISO `YYYY-MM-DDTHH:MM` — enforced centrally (QA-02)
- `/analyze`: `_CONTEXT.md` must follow `_CONTEXT_TEMPLATE.md` structure (QA-10)
- `/analyze`: prohibit insight derivation in `_CONTEXT.md` — metadata only, no analysis (QA-11)

### Added — Gemini learnings (Track 4)
- Temporal tag `(current)`/`(aspirational)` on insights in `/analyze` — distinguishes present state from desired future (BL-10)
- Memorable naming for Design Principles in `/synthesis` — e.g., "Quiet UI", "The Delta" alongside `[IG-XX]` refs (Gemini doc)
- `/ship benchmark` marked for reconversion to `benchmark-ux` — inter-industry design referents, not competitive analysis (Gemini doc + QA-54)

### Added — Multimodal & performance (from QA backlog)
- `/analyze`: direct image reading (PNG, JPG, whiteboard photos) — extract text, diagrams, post-it notes (QA-04, QA-12)
- `/analyze`: direct PDF reading via `pages` parameter for large documents (QA-13)
- `/analyze`: batch progress reporting for large source sets (>20 files) (QA-08)

## [3.1.0] — 2026-02-11

### Added
- **`/kickoff` skill** — project setup wizard. Asks project name, language (en/es), and one-liner description. Writes to `CLAUDE.md` `## Project Settings`. Run once after cloning. Idempotent — detects existing config before overwriting.
- **`output_language` setting** in CLAUDE.md `## Project Settings` — controls content language for Work layer and Output deliverables. System IDs (`[IG-XX]`, `VERIFIED`, `PENDING`) always stay in English. Currently supports `en` and `es`.
- **Language instructions** in 5 content-producing skills (`/analyze`, `/synthesis`, `/ship`, `/status`, `/visualize`) — each reads `output_language` from Project Settings and generates content accordingly.
- **Cross-referencing v1** between outputs — STATUS.html is the canonical anchor hub. All `/ship` outputs auto-link `[IG-XX]`/`[CF-XX]` text to `STATUS.html#ID` via JS regex. `:target` CSS highlights arrival cards. Defined in `/status` SKILL.md and `/ship` SKILL.md step 8.
- **Interactive STATUS dashboard** codified in `/status` SKILL.md — insight cards with approve/reject toggle buttons, conflict cards with Flag/Research/Context radio options, action bar with prompt generator for copy-paste to agent. Previously ad-hoc, now reproducible across `/status` runs.

### Changed
- README Getting Started now starts with `/kickoff` instead of manual CLAUDE.md editing
- CLAUDE.md skills table includes `/kickoff` and folder structure updated

## [3.0.0] — 2025-02-10

### Changed
- **Renamed from ProductLM to PD-Spec** — the project is now the Strategy & Intelligence layer of ProductDesign OS (PD-OS). Original name preserved as "formerly ProductLM" (started as "I'll build my own NotebookLM")
- All references updated across README, CLAUDE.md, FRAMEWORK.md, and skill templates
- Skill frontmatter descriptions enriched with explicit input/output layer paths (Anthropic skill-creator best practice)

### Added
- **PD-OS Ecosystem documentation** in README and FRAMEWORK.md — defines the relationship between PD-Spec (strategy) and PD-Build (execution)
- **Interface Contract** specification — `DESIGN_BRIEF.md` format with `[INTENT]`, `[LOGIC_RULES]`, `[DATA_EVIDENCE]`, `[USER_FLOW]` blocks
- **Data Flow diagram** showing how PD-Spec outputs feed into PD-Build's Kernel
- **Backlog items**: BL-01 `/ship design-system` (REC vs IG-XX labeling), BL-02 `/audit` (strategic quality gate), BL-03 `/ship persona` & `/ship journey-map` (SYN label for synthesized narrative)
- **PD-Build sibling repo** scaffolded at `https://github.com/sirlund/pd-build` — 4-layer architecture (Sources → Kernel → Drivers → Dist), TOON format, TRACED/HYPOTHESIS data labeling
- **Document versioning in `/ship`** — every HTML output carries a visible `doc-meta` header with version, date, snapshot, and inline changelog. No silent updates to shared documents.
- **Operating model defined** — PD-Spec is the architect's personal companion tool. Stakeholders only see outputs (PRD, presentations, briefs). Transfer to PD-Build via manual copy-paste of DESIGN_BRIEF.md.
- **Two-log separation** — `02_Work/MEMORY.md` is the project usage log (written by skills automatically). `docs/CHANGELOG.md` (this file) is the PD-Spec product development log (versions, fixes, decisions — written manually, never by skills). CHANGELOG moved from root to `docs/` to keep the template root clean.

### Architecture Decisions (v2.1–v3.0 session)

Proposals evaluated during the v2–v3 design sessions. Documented here for context across tools and models.

**Adopted:**
- 3-layer stack (Sources → Work → Outputs) with unidirectional data flow
- 4 skills (/analyze, /synthesis, /ship, /visualize) with propose-before-execute pattern
- 7 agent mandates in CLAUDE.md
- MEMORY.md for session continuity + manual edit detection
- _CONTEXT.md system for non-markdown source files
- PD-OS as two-repo ecosystem: PD-Spec (strategy) + PD-Build (execution in product repo, like Storybook)
- DESIGN_BRIEF.md as the contract between repos (format over transport)
- TRACED vs HYPOTHESIS data labeling in PD-Build (golden rule: HYPOTHESIS never overwrites TRACED)
- IDE-first rendering (Cursor/.cursorrules) before expanding to other tools
- Anthropic skill best practices: frontmatter with layer paths, <500 lines, no aux docs in skill folders

**Rejected (Homer's Car Detector):**
- 00_Config as 4th layer — breaks 3-layer invariant, CLAUDE.md handles config
- Rename 02_Work → 02_System — high migration cost, cosmetic benefit
- _CONTEXT.yaml — rejected for _CONTEXT.md (stays in markdown ecosystem)
- Separate /present, /report, /design-specs, /research skills — scoped to /ship output types or existing skills
- OOODS "Triple O" branding — branding not architecture
- 4 rendering layers simultaneously (IDE + Pencil + Figma + Storybook) — start with one, prove it, expand
- AGENTS block per tool in TOON objects — O(objects × tools) maintenance, use per-tool drivers instead
- PD-Bootstrap as 4 functions — scoped to single ingestion processor
- .pd-build-ignore custom format — .gitignore already handles it

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
- **No Hallucination mandate** enhanced with actionable phrasing: "should we mark it as an assumption or should I suggest how to validate it?"
- `/analyze` skill restructured into 4 phases: Discovery & Validation → Analysis → Propose → Write
- `/synthesis` skill restructured into 4 phases: Load → Present & Discuss → Propose → Write
- `/ship` skill restructured into 3 phases: Load & Validate → Propose → Generate
- README updated with source organization patterns and expanded design principles (Transparency, Proactive Gap Detection)

## [2.1.0] — 2025-02-10

### Changed
- **README rewritten as architecture documentation** — explains the problem, the 3-layer invariant, design principles, and maturity model before "Getting Started"
- **CLAUDE.md filled in** with project context (no more placeholders)
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
