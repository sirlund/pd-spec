# Changelog Archive

Archived entries from PD-Spec v2.x and v3.x. For current releases, see [CHANGELOG.md](CHANGELOG.md).

---

## [3.2.0] — 2026-02-14

### Highlights

**Quality pass.** First systematic QA review of all skills against real data (TIMining, 63 source files). 29 findings fixed across `/ship`, `/analyze`, `/synthesis`, and `/kickoff`. Outputs are now more reliable, consistent, and honest about gaps.

### Fixed

#### Outputs (`/ship`)
- **Language consistency** — `<title>` tag, headings, labels, all visible text now respect `output_language`. No more English titles in Spanish projects.
- **Traceability enforced** — every section must have `[IG-XX]` refs or an explicit `[GAP]` marker. No silent gaps.
- **No redundancy** — same information can't repeat across sections of a document.
- **Emoji policy** — only functional emojis (✓ ✗ ⚠️ 🔴🟠🟢 ▲▼). Decorative ones prohibited.
- **PDF export** — multi-page outputs use proper page breaks for clean Print > Save as PDF.
- **Document versioning** — `doc-meta` with changelog now mandatory for ALL output types.
- **Benchmark deprecated** — `/ship benchmark` replaced by `/ship benchmark-ux` (coming in v4.0). Anti-hallucination rule for any competitor claims.

#### Analysis (`/analyze`)
- **Stronger cross-referencing** — actively seeks contradictions and tensions, not just obvious opposites.
- **Evidence trail** — every insight now requires a 1-2 sentence key quote from the source.
- **Atomicity** — "a list of 10 needs = 10 insights, not 1". Clear guidance on when to split vs. consolidate.
- **Conflict format** — both sides must reference `[IG-XX]` IDs.

#### Other skills
- `/synthesis` validates that referenced IDs actually exist before processing.
- `/kickoff` unified redundant Project Context and Project Settings sections.
- Session timestamps enforced as ISO `YYYY-MM-DDTHH:MM` across all skills.

### Added
- **Temporal tags** on insights — `(current)` vs `(aspirational)` to distinguish present state from desired future.
- **Memorable Design Principle names** — e.g., "Quiet UI", "The Delta" alongside `[IG-XX]` refs.
- **Multimodal source reading** — `/analyze` can now read images (PNG, JPG, whiteboard photos) and PDFs directly.

<details>
<summary>QA reference numbers</summary>

- /ship: QA-30 to QA-61 (8 fix categories)
- /analyze: QA-01 to QA-29 (7 fix categories)
- /synthesis: QA-24
- /kickoff + CLAUDE.md: QA-02, QA-06, QA-07, QA-10, QA-11

</details>

---

## [3.1.0] — 2026-02-11

### Highlights

**Multi-language support and interactive decisions.** PD-Spec now generates all content in your chosen language. The STATUS dashboard became an interactive workbench where you approve insights and resolve conflicts directly in the browser.

### New capabilities

- **`/kickoff`** — project setup wizard. Three questions (name, language, one-liner) and you're configured. Detects existing settings and asks before overwriting.
- **`output_language`** — set to `en` or `es` in Project Settings. All Work layer content and Output deliverables follow this setting. System IDs always stay in English.
- **Interactive STATUS dashboard** — insight cards with approve/reject buttons, conflict cards with Flag/Research/Context options, and an action bar that generates a `/synthesis` prompt from your decisions. Copy-paste into the agent and go.
- **Cross-referencing** — all `[IG-XX]` and `[CF-XX]` references in outputs are clickable links to `STATUS.html`. Click a reference in your PRD → land on the exact insight card with a yellow highlight.

---

## [3.0.0] — 2025-02-10

### Highlights

**PD-Spec is born.** Renamed from ProductLM to PD-Spec — the Strategy & Intelligence layer of ProductDesign OS. What started as "I'll build my own NotebookLM" is now half of a two-repo ecosystem.

### What's new

- **PD-OS ecosystem** — PD-Spec (strategy: sources → insights → deliverables) + PD-Build (execution: design briefs → components → shipped product). Two repos, one architecture.
- **Interface Contract** — `DESIGN_BRIEF.md` format defines how PD-Spec outputs feed into PD-Build. Format over transport.
- **Document versioning** — every HTML output carries a visible version header with date, snapshot, and changelog. Stakeholders always know what version they're reading.
- **Two-log separation** — `02_Work/MEMORY.md` (project usage, written by skills) vs `docs/CHANGELOG.md` (PD-Spec development, written by humans). Different audiences, different logs.

<details>
<summary>Architecture decisions (v2.1–v3.0)</summary>

**Adopted:**
- 3-layer stack (Sources → Work → Outputs) with unidirectional data flow
- 4 skills with propose-before-execute pattern
- 7 agent mandates in CLAUDE.md
- MEMORY.md for session continuity + manual edit detection
- _CONTEXT.md system for non-markdown source files
- PD-OS as two-repo ecosystem
- DESIGN_BRIEF.md as the contract between repos
- TRACED vs HYPOTHESIS data labeling in PD-Build
- IDE-first rendering before expanding to other tools

**Rejected (Homer's Car Detector):**
- 00_Config as 4th layer — CLAUDE.md handles config
- Rename 02_Work → 02_System — cosmetic, high migration cost
- _CONTEXT.yaml — stays in markdown ecosystem
- Separate /present, /report, /design-specs skills — scoped to /ship types
- 4 rendering layers simultaneously — start with one, prove it, expand
- .pd-build-ignore custom format — .gitignore already handles it

</details>

---

## [2.4.0] — 2025-02-10

### Highlights

**More ways to share your research.** Three new output formats: Reveal.js presentations with speaker notes, A4 reports optimized for PDF export, and Mermaid diagrams for visualizing your knowledge base.

### New capabilities

- **`/visualize`** — generates interactive Mermaid diagrams from your Work layer (system map, insights, conflicts). Outputs to `DIAGRAMS.html`.
- **`/ship presentation`** — Reveal.js slide deck. One idea per slide, speaker notes, keyboard navigation, presenter mode (press `S`).
- **`/ship report`** — A4 formatted report with cover page, table of contents, executive summary. Print > Save as PDF for stakeholders.

---

## [2.3.0] — 2025-02-10

### Highlights

**The agent remembers.** Project Memory means the agent picks up where it left off across sessions. It also detects if you edited files manually between sessions and tells you what changed.

### New capabilities

- **Project Memory** (`02_Work/MEMORY.md`) — skills log what they did after each run. The agent reads this at session start to resume context without you re-explaining.
- **Manual edit detection** — if you change an insight or conflict between sessions, the agent notices and reports the discrepancy before proceeding.
- **`_CONTEXT.md`** — describe non-markdown sources (images, PDFs, spreadsheets) with a simple metadata file in the folder. The agent uses these descriptions during analysis.
- **Layer signage** — `_README.md` in each layer folder explains what it is and what you should (not) do with it.

---

## [2.2.0] — 2025-02-10

### Highlights

**The agent asks before acting.** All skills now present draft findings and wait for your approval before writing to files. Seven mandates govern agent behavior — from hallucination prevention to complexity detection.

### New capabilities

- **Propose-before-execute** — every insight extraction, conflict resolution, and deliverable generation is a draft first. You approve, reject, or adjust before anything is written.
- **7 agent mandates** — No Hallucination, Transparency & Control, Homer's Car Detector, Proactive Gap Detection, Source Organization Validation, Uncertainty Management, Silence is Gold.
- **Source organization** — subfolders in `01_Sources/` by milestone or category. The agent validates that files match their folder context.

---

## [2.1.0] — 2025-02-10

### Highlights

**Architecture-first documentation.** README rewritten to explain the problem, the 3-layer invariant, and design principles before "Getting Started". PD-Spec positioned as a product architecture reference, not just a template.

---

## [2.0.0] — 2025-02-09

### Highlights

**The pivot.** From consultant proposal template to Product Knowledge OS. Makefile and init.sh replaced by Claude Code skills. The 3-layer architecture and traceable insights system started here.

### What was built

- **3-layer architecture** — `01_Sources/` (read-only) → `02_Work/` (knowledge base) → `03_Outputs/` (deliverables)
- **3 skills** — `/analyze` (extract insights), `/synthesis` (resolve conflicts), `/ship` (generate PRD)
- **Traceable insights** — every claim gets an `[IG-XX]` ID linked to a source file. Every conflict gets a `[CF-XX]` ID.
- **3 mandates** — No Hallucination, Homer's Car Detector, Silence is Gold
- **Maturity model** — Seed → Validation → Ecosystem

### What was removed
- `init.sh`, `Makefile`, `docs/PANDOC_SETUP.md` — replaced by Claude Code skills
- `Propuesta_Master.html`, `Presentacion.html` — replaced by traceable `PRD.html`
- `BACKLOG.md` — replaced by `CONFLICTS.md` contradiction log
