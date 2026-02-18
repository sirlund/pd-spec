# Changelog

## [4.7.0] — 2026-02-17

### Highlights

**Engine development now has rules.** SemVer versioning, commit conventions, a release checklist, and a clear path for ideas discovered in projects to flow back to the engine — all documented in CLAUDE.md. No more ad-hoc version bumps or BACKLOG edits in project branches.

**Merge strategy protects project files.** `.gitattributes` with `merge=ours` ensures that merging engine updates from `main` into a project branch never overwrites `PROJECT.md`, sources, work files, or generated outputs. Engine files flow forward; project files stay put.

**Ideas flow without git merges.** Projects capture bugs and ideas in `02_Work/IDEAS.md` (a new template file). The agent on `main` reads them cross-worktree via filesystem — no branch merging needed. Ideas get formalized as BACKLOG items on main, then implemented and merged back as engine updates.

### Changes

- **Engine Development Workflow section in CLAUDE.md.** Four subsections: Versioning (SemVer rules), Commit Convention (`type: BL-## — description`), Release Checklist (BACKLOG + CHANGELOG + version bump in one docs commit), Idea Flow (project → IDEAS.md → main → BACKLOG).
- **Workspace & Worktrees section expanded.** Engine-files-are-read-only rule, merge instructions with `git config merge.ours.driver true` setup, directory naming convention (`pd-spec/`, `pds--{name}/`).
- **`02_Work/IDEAS.md` template.** Empty template with format guide. Protected by `merge=ours` — main's empty template won't overwrite a project's captured ideas.
- **`.gitattributes` added.** Merge strategy file protecting `PROJECT.md`, `01_Sources/**`, `02_Work/**`, and `03_Outputs/*.html`.
- **`/kickoff` writes full PROJECT.md.** Now includes `engine_version` and the "Current State" section, not just project settings.

<details>
<summary>Technical details</summary>

**Files changed:**
- `CLAUDE.md` — New "Engine Development Workflow" section, expanded "Workspace & Worktrees", updated Sources of Truth table and Folder Structure
- `02_Work/IDEAS.md` — New template file
- `.gitattributes` — New merge strategy file
- `PROJECT.md` — Fixed `engine_version` (was prematurely v4.7.0, reset to v4.6.0, now bumped to v4.7.0 with this release)
- `.claude/skills/kickoff/SKILL.md` — Full PROJECT.md template output

</details>

---

## [4.6.0] — 2026-02-17

### Highlights

**`/extract` now runs silently.** Instead of narrating every file being processed, `/extract` outputs one compact line per batch during Pass 1 and one line per file during Pass 2 (heavy files). The final report shows totals only — no per-folder file listings. Less noise, same completeness guarantees.

### Changes (BL-34)

- **Removed per-file progress logs.** Pass 1 (light files) now logs only after completing each 10-file batch: `✓ Batch X/Y: 10 files, Z claims`. No per-file narration inside batches.
- **Simplified Pass 2 log.** Heavy files log: `✓ [filename] → Z claims (X/N)` — concise format, same information.
- **Compact final report.** End of extraction shows: `✓ Extraction complete: N files · Z claims` + only unprocessable files if any. No per-folder breakdowns.
- **Silent execution rule.** New instruction in Phase 2: no narration between tool calls ("Now reading...", "Now updating..."). Execute silently, log only when a `Log:` directive specifies the message.

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/extract/SKILL.md` — Phase 2 batch log format, Phase 2 progress reporting rule, Phase 4 final report format, new silent execution rule

**BACKLOG impact:**
- BL-34: ✅ IMPLEMENTED

</details>

---

## [4.5.0] — 2026-02-16

### Highlights

**`/analyze` now guides you through decisions interactively.** Instead of a free-text approval prompt, `/analyze` now uses native terminal menus (AskUserQuestion) to collect your decisions: approve insights as PENDING for later review, approve as VERIFIED for immediate use, or review one by one. No more guessing the right text response.

**Dashboard auto-generated.** After writing insights and conflicts, `/analyze` automatically generates `03_Outputs/STATUS.html`. No more running a separate `/status` command — the dashboard is ready when analysis ends.

**`/status` removed.** The skill is no longer needed. Dashboard generation is embedded in `/analyze`. The pipeline is now: `/extract` → `/analyze` (interactive + auto-dashboard) → optional `/synthesis` → `/ship`.

### Changes (BL-30)

- **AskUserQuestion in Phase 4.** Three structured options for synthesis approval: PENDING (review later in dashboard), VERIFIED (express mode, skip review), review one-by-one in terminal. Two options for ambiguity handling: defer to `/synthesis` or resolve now.
- **Auto-generate STATUS.html.** After writing files, `/analyze` builds the dashboard JSON from analysis data already in memory and injects it into the template. No separate command needed.
- **Compact Phase 6 output.** `/analyze` ends with a 2-line summary: `✓ Analysis complete: [stats]` + `✓ Dashboard: 03_Outputs/STATUS.html`. No verbose insight lists — those are in the dashboard.
- **`/status` skill removed.** Directory deleted, references removed from CLAUDE.md, README, and folder structure.

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/analyze/SKILL.md` — AskUserQuestion (Phase 3 step 19b), three write paths (Phase 4), auto-dashboard (Phase 5), compact output (Phase 6)
- `CLAUDE.md` — Removed /status from skills table and folder structure
- `README.md` — Updated pipeline description, I/O table, skills list, folder structure

**BACKLOG impact:**
- BL-30: ✅ IMPLEMENTED

</details>

---

## [4.4.0] — 2026-02-16

### Highlights

**`/status` performance fix (partial).** Thinking overhead eliminated (~4min saved vs 10min baseline). I/O overhead remains (~6min for large projects).

### Changes (BL-35)

- Conflict label inference removed (generic labels, no synthesis overhead)
- Evidence gap check simplified (objective convergence < 2, not subjective "weak")
- Compact output added (summary stats only, not full HTML in chat)

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/status/SKILL.md` — Three targeted fixes

**BACKLOG impact:**
- BL-35: ✅ IMPLEMENTED (partial — thinking overhead eliminated, I/O overhead pending)

</details>

---

## [4.3.0] — 2026-02-16

### Highlights

**Pipeline now production-ready.** After testing with 61 real files (TIMining project), we fixed 5 critical bugs blocking extraction and added incremental processing to `/analyze`. The pipeline now runs end-to-end without manual intervention.

**Synthesis layer: 161 observations → 18 strategic insights.** `/analyze` no longer dumps atomic claims on you. It consolidates patterns, names recurring concepts from your sources ("Geometry Gap", "Auto de Homero Simpson"), and detects ambiguities that need resolution. You review 18 insights with confidence levels, not 161 raw observations.

**Incremental `/analyze` — only process what's new.** After initial extraction, adding 3 new files triggers `/analyze` to process only ~30 new claims (30 seconds), not re-analyze all 756 claims (5 minutes). Pipeline state is tracked via timestamps.

**No more silent skips.** `/extract` now processes 100% of discovered files. The agent cannot skip files based on "assumed redundancy" — every file is either processed or reported as unprocessable with a technical reason.

### Extraction (BL-23, BL-24, BL-27)

- **Mandatory processing rule.** Agent cannot make editorial decisions. Every file discovered must be processed or explicitly reported as unprocessable. "Redundancy" is not a valid reason to skip.
- **Correct PDF approach.** Default is `Read(pdf)` without pages parameter (no poppler required). Only image-only PDFs require poppler. Large PDFs (>10MB) are processed with intermediate writes to prevent context overflow.
- **Large project auto-batching.** Projects with >40 files or multiple large PDFs automatically process in batches of 20-30 with intermediate writes.
- **SOURCE_MAP integrity validation.** On every run, `/extract` cross-checks SOURCE_MAP.md entries against EXTRACTIONS.md sections. Corrupted entries from interrupted runs are detected and re-processed.
- **Extraction timestamps.** Each section in EXTRACTIONS.md carries an `Extracted: YYYY-MM-DDTHH:MM` timestamp, enabling `/analyze` incremental mode.

### Analysis (BL-28, BL-18)

- **Incremental processing by default.** `/analyze` reads the last execution timestamp from MEMORY.md and processes only sections extracted after that timestamp. Use `/analyze --full` to force re-analysis of all claims.
- **Convergence updates.** When incremental run finds duplicate claims, it increments convergence count on existing insight (e.g., 2/18 → 3/18) instead of creating duplicates.
- **Synthesis layer (Phase 3).** After extracting atomic observations, `/analyze` consolidates them into strategic insights:
  - Thematic clustering (problems, solutions, constraints, vision)
  - Named concepts from source quotes (not invented by agent)
  - Narrative synthesis (2-3 sentences per insight with evidence trail)
  - Convergence weighting by Voice/Authority (user quotes prioritized over hypotheses)
  - Target: 15-25 strategic insights for large projects, 5-8 for small ones
- **Ambiguity detection (6 types).** Automatically flags: imprecisions ("6-8 productos" when only 6 documented), conflicts between sources, single-source critical claims, definition gaps, unresolved contradictions, perspective conflicts.
- **Research gap identification.** Suggests missing validations with recommended methodologies (stakeholder interview, user workshop, competitive benchmark).
- **User approval gate.** Synthesis report presented before writing — you approve insights, decide how to resolve ambiguities, and choose which research gaps to pursue.

### Testing results (TIMining project, 61 files)

**Before v4.3:**
- Extraction: 23/61 files processed (38%), 27 workshop photos skipped as "redundant"
- Analysis: 756 claims → 161 atomic insights (unmanageable volume)
- Pipeline broken: incremental extraction worked, but /analyze re-processed everything

**After v4.3:**
- Extraction: 61/61 files processed (100%), zero skips
- Analysis: 756 claims → 18 synthesized insights + 3 ambiguities + 5 research gaps
- Pipeline works: add 3 new files → /extract processes 3, /analyze processes only ~30 new claims

<details>
<summary>Technical details</summary>

**Commits:**
- `f250d57` — BL-23: Editorial decisions prevention (no skip rule, disk validation, extraction methodology)
- `745b6e6` — BL-24: Correct PDF processing (Read(pdf) default, intermediate writes for large files)
- `13de3f5` — BL-27: SOURCE_MAP corruption detection (integrity validation on startup)
- `39e1909` — Extraction timestamp support (prerequisite for incremental /analyze)
- `b06ac93` — BL-28: Incremental /analyze (timestamp-based filtering, convergence updates, --full flag)
- `11d8c26` — BL-18: Synthesis layer (consolidation, ambiguity detection, research gaps, user approval)

**Files changed:**
- `.claude/skills/extract/SKILL.md` — No-skip mandate, PDF instructions, SOURCE_MAP validation, extraction timestamps
- `.claude/skills/analyze/SKILL.md` — Incremental mode, Phase 3 SYNTHESIS, ambiguity types, research gap suggestions

**BACKLOG impact:**
- BL-23: ✅ IMPLEMENTED
- BL-24: ✅ IMPLEMENTED
- BL-25: ✅ Covered by BL-23 disk validation
- BL-26: ✅ Covered by BL-24 auto-batching
- BL-27: ✅ IMPLEMENTED
- BL-28: ✅ IMPLEMENTED
- BL-18: ✅ IMPLEMENTED

</details>

---

## [4.1.0] — 2026-02-15

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
