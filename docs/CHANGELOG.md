# Changelog

## [4.0.1] — 2026-02-15

### Highlights

**Stress-tested with real data.** 57 files across 6 folders (interviews, workshops, PDFs, PPTX, HEIC photos, videos) exposed 12 bugs in extraction and analysis. All fixed. The agent now processes every file or tells you exactly why it couldn't.

### Extraction reliability

- **Every file, no exceptions.** The agent can no longer silently skip files. Every source discovered is either processed or explicitly reported as unprocessable with a reason. A completeness check at the end compares the output against the original file list.
- **Better PDF handling.** Large PDFs are read in 20-page chunks. Image-only PDFs (scans without text) are detected and flagged with guidance instead of silently failing.
- **iPhone photos supported.** HEIC images are converted automatically via macOS native tools. Video and audio files are reported as unsupported with a suggestion to provide transcripts.
- **Source paths preserved.** When Office files are converted to temporary formats for reading, the extraction always references the original file in `01_Sources/`, not the temp file.
- **Per-folder progress reports.** The extraction summary now breaks down every folder individually — files processed, files skipped, claims extracted, and a completeness check against the discovery list.

### Analysis quality

- **Who said it matters.** Every insight now carries a `Voice` (user, stakeholder, document, researcher) and `Authority` level (direct quote, observation, hypothesis, vision, fact). A user's pain point no longer looks the same as a CEO's aspiration.
- **Smarter deduplication.** Before creating new insights, the agent checks for semantic duplicates against all existing insights. Duplicates boost the convergence count on the existing insight instead of creating a new ID.
- **Format consistency.** When old and new insights coexist in different formats, the agent detects and reports the mismatch. New insights always follow the current spec.
- **Stable ID convention.** Insight IDs use two-digit minimum: `IG-01` through `IG-99`, then `IG-100`+. No three-digit zero-padding (`IG-001`) that breaks cross-reference anchors.

### Pipeline flow

- **`/analyze` → `/status` → `/synthesis`.** After analysis, the agent now recommends `/status` (the visual dashboard) as the review step, not `/synthesis` directly. You see your insights before you commit to them.
- **Quick observations without the pipeline.** The "Add Context" button in STATUS.html now generates a prompt that injects a PENDING insight directly into the knowledge base AND saves a field note — no need to run the full `/extract` → `/analyze` cycle for a single observation.
- **Ad-hoc changes logged.** Any state change to Work layer files (approving insights in conversation, manual edits, direct injections) is now logged to MEMORY.md, not just formal skill runs.

### Performance

- **Image batching.** Workshop photos (the biggest token cost in extraction) are now processed in batches of 3-4 images per call instead of one at a time. This reduces per-image overhead and lets the agent see cross-image context — e.g., a sequence of whiteboard photos that form a connected flow. Full parallelism (per-folder agents) is planned for BL-17.

### Resilience (context overflow mitigations)

- **Checkpoint after each folder.** Extraction results are written to disk after each subfolder completes, not at the end. If the context window compacts mid-extraction, already-processed folders are safe on disk and the agent can continue from where it left off.
- **Claim counts verified from disk.** The final extraction report counts claims by re-reading the written file, not from in-memory counters. Context compaction can corrupt in-memory state — the file on disk is the source of truth.
- **Dashboard self-check.** After generating STATUS.html, the agent verifies the file contains the Template+JSON data block. If it doesn't (e.g., the agent fell back to monolithic HTML after compaction), it retries from the template.

<details>
<summary>QA reference numbers</summary>

From QA v2 testing on test-timining branch (57 files, 6 folders):
- Extraction: BUG-01, BUG-04, BUG-05, BUG-06, BUG-07
- Analysis: BUG-08, BUG-09, BUG-10, BUG-14
- Pipeline: BUG-11, BUG-13, BUG-15
- Performance: PERF-01
- Mitigated (workarounds): BUG-02, BUG-03, BUG-12
- Architectural proposals pending: ARCH-01, ARCH-02, ARCH-03

</details>

---

## [4.0.0] — 2026-02-15

### Highlights

**Your sources, fully read.** PD-Spec now reads DOCX, PPTX, XLSX, images, and PDFs directly — no manual conversion needed. Drop your files in `01_Sources/` and go.

**See what the agent read before it thinks.** The new `/extract` → `/analyze` pipeline separates reading from interpretation. Raw quotes land in `EXTRACTIONS.md` first — you can review exactly what was captured before insights are generated.

**Consistent, fast outputs.** All deliverables now use a Template+JSON architecture. The agent writes data, not HTML. Outputs render instantly, look consistent across types, and are easy to update.

**Six new deliverables.** Personas, journey maps, lean canvas, user stories, UX benchmarks, and a quality audit — all grounded in your verified insights.

**Smarter analysis.** Source diversity scoring, convergence tracking, auto-generated research briefs, and field notes support for researcher observations.

### New capabilities

#### `/extract` — dedicated source reading
Reads all files in `01_Sources/` and writes raw claims to `02_Work/EXTRACTIONS.md`. Supports markdown, DOCX, PPTX, XLSX, CSV, PDF, and images out of the box (zero dependencies). Optionally install `markitdown` for better table and structure preservation.

Run `/extract` before `/analyze`. The separation means you can verify what was captured, correct any missed context, and re-run analysis without re-reading all sources.

#### `/audit` — quality gate before shipping
Checks your Work layer for readiness: traceability gaps, unresolved conflicts, insight coverage per module, source diversity. Run it before `/ship` to catch issues early.

#### New `/ship` types

| Command | Output | What it does |
|---|---|---|
| `/ship persona` | `PERSONAS.html` | 3-5 user archetypes, each grounded in 3+ verified insights |
| `/ship journey-map` | `JOURNEY_MAP.html` | Phases × layers matrix with emotions and pain points |
| `/ship lean-canvas` | `LEAN_CANVAS.html` | One-page business model, gaps marked explicitly |
| `/ship user-stories` | `USER_STORIES.html` | JTBD format with acceptance criteria — ready for handoff |
| `/ship benchmark-ux` | `BENCHMARK_UX.html` | Design inspiration from other industries, not competitor analysis |

All outputs are self-contained HTML files with traceable `[IG-XX]` references linked to `STATUS.html`.

#### Analysis intelligence

- **Research Brief** — `/analyze` auto-generates `02_Work/RESEARCH_BRIEF.md`: a stakeholder-ready narrative organized by "what's broken", "what works", "key tensions", and evidence gaps.
- **Source diversity** — Detects when your sources are skewed (all interviews, no quantitative data; all from the same period; only internal perspectives) and suggests what's missing.
- **Convergence tracking** — Each insight shows how many sources support it. An insight backed by 5/12 sources carries more weight than one from a single interview.
- **Field notes** — New `_FIELD_NOTES_TEMPLATE.md` for capturing researcher observations (body language, tone, environment) that don't appear in transcripts.

### Improved

#### Template+JSON architecture
All outputs (`/ship`, `/status`) now follow a template + data pattern. Static HTML templates handle rendering; the agent writes JSON data only. Benefits:
- Faster generation (JSON is ~100 lines vs ~500+ lines of hand-crafted HTML)
- Consistent styling across all output types
- Templates are versioned with the engine — visual improvements apply to all outputs automatically

#### Enhanced `/status` dashboard
The Research Dashboard now includes module viewer with design implications, evidence gap tracking with suggested actions, and source health overview — alongside the existing insight approval and conflict surfacing tools.

### Breaking changes

- **`/analyze` requires `/extract` first.** If `EXTRACTIONS.md` is empty, `/analyze` will ask you to run `/extract`.
- **`/ship benchmark` is deprecated.** Use `/ship benchmark-ux` instead. The old type generated competitive analysis prone to hallucination; the new type finds design referents from other industries with web-verified sources.
- **Existing HTML outputs** from v3.x don't use Template+JSON. They'll continue to work but will be regenerated in the new format on next `/ship` run.

### Pipeline reference

```
/extract  →  /analyze  →  /synthesis  →  /ship [type]
   ↓            ↓             ↓              ↓
EXTRACTIONS  INSIGHTS     SYSTEM_MAP     HTML outputs
   .md       GRAPH.md       .md          (10 types)
             CONFLICTS.md
             RESEARCH_BRIEF.md
```

<details>
<summary>Technical details</summary>

#### Architecture (3 agents)
- **A1 `/extract`**: New skill + `02_Work/EXTRACTIONS.md` template. `/analyze` now reads from EXTRACTIONS.md instead of `01_Sources/`.
- **A2 Template+JSON**: `03_Outputs/_templates/` (10 HTML templates, `_base.css`, `_base.js`) + `03_Outputs/_schemas/` (9 JSON schemas). Section types: `text`, `callout`, `table`, `module-list`, `open-questions`, `gap`. Self-contained outputs with inlined CSS/JS.
- **A3 Research Dashboard**: Enhanced `/status` template (1200+ lines). Summary cards, insight/conflict interactive cards, system map viewer, evidence gaps, source health, prompt generator.

#### Intelligence (5 agents)
- **I1** Auto Research Brief — Phase 3b in `/analyze`, writes `02_Work/RESEARCH_BRIEF.md`
- **I2** Source diversity — Phase 4b in `/analyze`, type/temporal/perspective bias detection
- **I3** Field notes — `_FIELD_NOTES_TEMPLATE.md`, `/extract` handles confidence tags
- **I4** Convergence ratio per insight — "X/Y sources" in `/analyze` summary
- **I5** Progress indicator — batch reporting by subfolder in `/extract`

#### New outputs (6 agents)
- **O1** benchmark-ux — `categories` array, anti-hallucination via web search
- **O2** persona — `personas` array, 3-5 archetypes, `{text, ref}` pairs
- **O3** journey-map — `phases` array with `layers` object, persona link
- **O4** lean-canvas — `canvas` object, 9 blocks, `gap: true` marker
- **O5** user-stories — JTBD `{situation, motivation, outcome}`, traceability matrix, priority logic
- **O6** `/audit` — quality gate with pass/warn/fail checks

#### Files changed

| File | Changes |
|---|---|
| `CLAUDE.md` | Skills table (10 skills), Sources of Truth, Folder Structure |
| `.claude/skills/ship/SKILL.md` | Template+JSON architecture, 10 output types |
| `.claude/skills/analyze/SKILL.md` | Reads EXTRACTIONS.md, auto-brief, diversity, convergence |
| `.claude/skills/extract/SKILL.md` | NEW — source reading + claim extraction |
| `.claude/skills/audit/SKILL.md` | NEW — quality gate |
| `03_Outputs/_templates/` | 10 HTML templates |
| `03_Outputs/_schemas/` | 9 JSON schemas |
| `02_Work/EXTRACTIONS.md` | NEW — raw claims template |
| `02_Work/RESEARCH_BRIEF.md` | NEW — executive narrative template |
| `01_Sources/_FIELD_NOTES_TEMPLATE.md` | NEW — researcher observations template |

</details>

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
