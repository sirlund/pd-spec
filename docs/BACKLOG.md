# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

### [BL-15] Visual & Interaction Polish — HTML Template Upgrade

**Status:** Proposed
**Priority:** P2
**Origin:** QA v2 (2026-02-15)

Typography, micro-interactions, data viz, accessibility improvements for all templates.

**Evidence from TIMining entregables (2026-02-17):**
- Dark mode + light/dark toggle with localStorage
- JetBrains Mono font, fichas 2x2 with sidebar layout
- Timeline D→A→R pattern
- Clearbit logos with fallback
- Source: `pds--timining/02_Work/IDEAS.md` → idea "Upgrade de template de presentación"

---

### [BL-22] RAG Layer — Scale Source Ingestion Beyond Context Window

**Status:** Proposed
**Priority:** Low (becomes High at 100+ sources)
**Depends on:** BL-17

**Problem:** PD-Spec reads all sources sequentially. Works for 10-20 sources. At 57+ files, context compaction causes state loss and file skipping. NotebookLM handles 100+ via RAG.

**Solution:** BM25 keyword search (zero deps) or embeddings + vector store. Index claims as extracted, query for relevant context instead of loading all.

**Scaling strategy:**
- BL-29 (batching): Handle 40-100 files ✅ done
- BL-31 (express mode): Handle 100-200 files by deferring heavy files
- BL-22 (RAG layer): Handle 200+ files with embeddings + retrieval

---

### [BL-33] Dashboard Enhancements — UX Fixes from QA v3

**Status:** Proposed
**Priority:** P1
**Origin:** QA v3 testing (2026-02-16), QA3-UX-05

**Issues identified:**
- Source coverage section too basic
- Evidence gaps blend together visually
- Cross-reference links missing between sections
- Open questions hidden or hard to find
- Phase-based progress tracking (pipeline position visible at all times)
- Auto-update dashboard after each skill (/analyze, /synthesis, /ship)

**User story:**
> As a researcher, I expect the dashboard to show clear pipeline progress, actionable evidence gaps, and navigable cross-references.

---

### [BL-38] Freemode Protocol — Token-Efficient Custom Deliverables

**Status:** Proposed
**Priority:** P0
**Origin:** TIMining entregables session (2026-02-16/18) — 3 days freemode, 65% weekly token budget, user as manual router/memory manager

**Problem:** Working outside the pipeline (custom presentations, synthesized deliverables, iterative HTML) has no agent protocol. The agent doesn't orient itself to PD-Spec structures, reads `01_Sources/` instead of `02_Work/`, doesn't maintain session state across compaction, and accumulates context until the window fills.

**Evidence:**
- Agent read raw sources to answer a question already in INSIGHTS_GRAPH.md (user redirected manually)
- Session log (39KB) invented by user as compaction workaround — agent didn't maintain it proactively
- Auditoría fichas vs vizs only happened because user explicitly requested cross-reference
- 100KB+ monolithic HTML required full reads for single-slide edits
- Context window filled repeatedly, requiring multiple conversation restarts
- Post-compaction with session log: agent recovered context and operated efficiently (positive evidence)
- Agent planned tasks from session log → fast execution (planning before doing = key pattern)

**User stories:**
1. > As a PD-Spec user working in freemode, I want the agent to orient itself to the project's Work layer automatically, so I don't have to manually route it to the right files.
2. > As a PD-Spec user in a long session, I want the agent to maintain compact session state, so work survives context compaction without re-reading everything.
3. > As a PD-Spec user importing external content, I want a file-based intake convention, so I never have to paste large content into chat.
4. > As a PD-Spec user, I want the agent to detect costly operations and suggest optimized alternatives, so I don't burn tokens unnecessarily.

**Acceptance criteria:**

**AC-1: CLAUDE.md — Freemode Protocol section** (~25 lines)
- Work-first routing: `02_Work/` before `01_Sources/` for any data question
- Reference by `IG-XX`/`CF-XX` IDs, never re-derive from sources
- Write to file immediately — don't accumulate HTML/MD in context
- Detect when request maps to existing `/ship` type → suggest pipeline path
- Cost awareness: warn before reading files >20KB, propose targeted reads (offset/limit)
- Post-compaction: re-read checkpoint before continuing

**AC-2: Session checkpoint** (`02_Work/_temp/`)
- Agent creates `SESSION_CHECKPOINT.md` at freemode session start
- ~50 lines max: project state summary + session decisions + files modified + pending work
- Updated after each significant action (not after every micro-edit)
- Re-legible post-compaction — agent re-reads to recover orientation
- Ephemeral by design — lives in `_temp/`, not committed to MEMORY.md

**AC-3: Asset intake** (`02_Work/_assets/`)
- External materials (AI-generated HTML, mockups, drafts, code) saved to `_assets/` before agent interaction
- Agent never accepts pasted content >1KB in chat — redirects to file-based intake
- `_INTAKE.md` log: filename, origin (gemini/chatgpt/manual), date, purpose
- `/extract` skips `_assets/` (not knowledge sources)
- Subfolder organization by origin or type (flexible)

**AC-4: Custom outputs convention** (`03_Outputs/_custom/`)
- Non-pipeline deliverables have a dedicated folder
- Agent proposes file organization before first write
- Filterable back to main branch outputs when approved

**AC-5: Structural index for large files**
- When working with files >50 lines, agent creates/maintains index in `_temp/`
- Maps sections → line ranges (e.g., `Slide 7: lines 340-395`)
- Uses offset/limit reads instead of full file reads
- Updates index after structural edits

**Future consideration:** Bounded sub-agent delegation for independent write tasks. Blocked on validating protocol first — if BL-38 resolves token burn, sub-agents may be unnecessary.

---

### [BL-39] Artifact Normalization — Efficient Import of External Files

**Status:** Proposed
**Priority:** P1
**Depends on:** BL-38 (asset intake convention)
**Origin:** TIMining entregables — Gemini-generated monolithic HTML (100KB+), 23 edits needed to change a single slide counter

**Problem:** External tools generate monolithic files — single HTML with inline CSS/JS and all content. These are extremely expensive for agent iteration: full reads for small edits, no structural separation, O(n) changes for O(1) operations (e.g., renumbering slides).

**User story:**
> As a PD-Spec user importing an external artifact, I want PD-Spec to normalize it into a token-efficient structure that preserves the same visual output but enables targeted editing.

**Acceptance criteria:**
1. Agent detects monolithic imports (>30KB, single file with multiple sections) in `_assets/`
2. Proposes normalization: split into section files + shared CSS/JS + index loader
3. Maintains visual/functional parity (same output in browser)
4. Individual section files are 2-5KB (one slide, one chapter)
5. Dynamic counters/navigation via JS (no hardcoded `N / Total` in each section)

**Scope:** Protocol/technique in CLAUDE.md freemode section, not a new skill command.

---

## ✅ Implemented (Archive)

<details>
<summary><strong>BL-18 to BL-37 — v4.3 to v4.8</strong> (click to expand)</summary>

### [BL-31] Extract Express Mode — v4.8

**Implemented:** 2026-02-18. Three modes: express (default, light files only), --heavy (deferred files), --full (all files). Light/heavy classification by extension and size. Deferred files tracked as `pending-heavy` in SOURCE_MAP.md. Mode-aware report format.

---

### [BL-32] Auto Express Mode for /analyze — v4.8

**Implemented:** 2026-02-18. Auto-detect project size: <30 files or <500 claims skips Phase 3 synthesis, creates atomic insights directly. Medium projects (30-50 files) also skip but suggest --full. --full forces full synthesis. Simplified AskUserQuestion in express mode.

---

### [BL-36] Conflict Intermediate States — v4.8

**Implemented:** 2026-02-18. /synthesis writes `PENDING — Flagged (context)` or `PENDING — Research (context)` to CONFLICTS.md. Schema and dashboard support intermediate_status/intermediate_note fields. Dashboard shows amber "Flagged" / blue "Research" badges with pre-selected radio buttons.

---

### [BL-37] AI-Generated Source Validation — v4.8

**Implemented:** 2026-02-18. `source_type: ai-generated` in _CONTEXT_TEMPLATE.md. /extract tags claims `[AI-SOURCE]`. /analyze assigns `voice: ai`, `authority: hypothesis`. AI-only insights cannot reach VERIFIED without non-AI corroboration. Added to convergence weighting table (lowest priority).

---

### [BL-18] Observation → Insight Synthesis Layer (ARCH-03) — v4.3

**Implemented:** 2026-02-16. Consolidates atomic observations into 15-25 strategic insights via thematic clustering, convergence weighting by Voice/Authority, ambiguity detection (6 types), research gap identification. Named concepts from source quotes. TIMining: 161 observations → 18 insights.

---

### [BL-19] README.md Sync — v4.2

**Implemented:** 2026-02-15. Added /extract, /audit skills. Updated pipeline, file counts.

---

### [BL-20] Layer READMEs Sync — v4.2

**Implemented:** 2026-02-15. Added EXTRACTIONS.md, RESEARCH_BRIEF.md references. Updated pipeline description.

---

### [BL-23] BUG: /extract Editorial Decisions — v4.3

**Implemented:** 2026-02-16. Mandatory no-skip rule: every file must be processed or reported as unprocessable with technical reason. "Redundancy" is not valid. Disk-validated Phase 4 report (count sections in EXTRACTIONS.md, not in-memory counters). Also covers BL-25 (false numerical reports).

---

### [BL-24] BUG: /extract PDF Fallbacks — v4.3

**Implemented:** 2026-02-16. Correct approach: `Read(pdf)` without pages parameter (no poppler). Intermediate writes for large PDFs. One PDF at a time to prevent request accumulation. Also covers BL-26 (auto-batching for >40 files).

---

### [BL-25] BUG: /extract False Numerical Reports — v4.3

**Covered by:** BL-23 disk validation logic.

---

### [BL-26] BUG: /extract No Auto-Batching — v4.3

**Covered by:** BL-24 large project strategy + BL-29 Option E.

---

### [BL-27] BUG: SOURCE_MAP Corruption on Interruption — v4.3

**Implemented:** 2026-02-16. Phase 1b integrity check: cross-validates SOURCE_MAP entries against EXTRACTIONS.md sections. Corrupted entries detected and re-queued.

---

### [BL-28] /analyze Incremental Processing — v4.3

**Implemented:** 2026-02-16. Timestamp-based filtering: reads last /analyze timestamp from MEMORY.md, processes only newer extractions. `--full` flag forces re-analysis. Convergence updates on matching claims.

---

### [BL-29] /extract Context Overflow — Mandatory Batching — v4.3.1

**Implemented:** 2026-02-16 (Option E). Two-pass strategy: Pass 1 light files (batch 10), Pass 2 heavy files (batch 1 with per-file writes). No Task agents. Direct processing only. TIMining: 54/54 files (100%), 1,238 claims, 33m 54s.

---

### [BL-30] Pipeline Flow Simplification — Unified /analyze — v4.5

**Implemented:** 2026-02-16. AskUserQuestion interactive menu in /analyze Phase 4 (3 synthesis options + 2 conflict options). Auto-generates STATUS.html. /status skill removed. Pipeline: /extract → /analyze (interactive + dashboard) → optional /synthesis → /ship.

---

### [BL-34] Compact Skill Output — v4.6

**Implemented:** 2026-02-17. Silent execution rule in /extract: no narration between tool calls. Batch-level logs only. Compact final report (totals + unprocessable list only).

---

### [BL-35] /status Performance Fix — v4.4

**Implemented:** 2026-02-16 (partial). Eliminated conflict label inference (~4min saved) and subjective evidence gap evaluation (~1min saved). Compact output. Result: 37% faster (10m → 6.5m on TIMining). I/O overhead remains.

---

</details>

<details>
<summary><strong>BL-01 to BL-17, BL-21 — v3.0 to v4.2</strong> (click to expand)</summary>

### ~~[BL-01] `/ship design-system`~~ — REMOVED

**Reason:** Crosses PD-Spec boundary into PD-Build responsibility.

---

### [BL-02] `/audit` — Strategic Quality Gate — v4.0

**Implemented (diverged):** Data-quality audit (traceability, coverage), not strategic audit.

---

### [BL-03] UX & Strategy Artifact Catalog — v4.0

**Partially implemented:** 5/6 types (persona, journey-map, lean-canvas, user-stories, benchmark-ux). Missing: service-blueprint, success-metrics.

---

### [BL-04] Human Calibration Layer — v4.0

**Partially implemented (~80%):** Confidence tagging done. Add Context in dashboard but not inline on cards.

---

### [BL-05] Source Diversity Gap Detection — v4.0

**Implemented:** 6 source types, diversity matrix, score N/6 in /analyze Phase 2.

---

### [BL-06] Design Implications in SYSTEM_MAP — v4.0

**Implemented:** System map modules have "Design implications" field.

---

### [BL-07] `/extract` — Dedicated Skill — v4.0

**Implemented (~95%):** All file types handled, fallbacks defined. Missing: quick-reference table (cosmetic).

---

### [BL-08] Merge `/status` Into `/analyze` — Absorbed by BL-12

---

### [BL-09] QA Fixes — Skill Hardening — v3.2

**Implemented:** ISO timestamps, ID validation, atomicity guidance, conflict refs.

---

### [BL-10] Insight Temporal Tag — v3.2

**Implemented:** `(current)` vs `(aspirational)` tags.

---

### [BL-11] Convergence Tracking — v4.0

**Implemented:** Voice types (4), Authority levels (5), Convergence ratio X/Y.

---

### [BL-12] Research Dashboard — v4.0

**Partially implemented (~85%):** Template+JSON architecture. 8 modules. Missing: Timeline, Actors, inline Add Context.

---

### [BL-13] Auto Research Brief — v4.0

**Implemented:** 5 sections, writes to RESEARCH_BRIEF.md.

---

### [BL-14] `/extract` Progress Indicator — v4.0

**Partially implemented (~60%):** Per-folder + overall progress. Missing: dashboard integration.

---

### [BL-16] PROJECT.md Separation (ARCH-01) — v4.2

**Implemented:** Project settings moved from CLAUDE.md to PROJECT.md.

---

### [BL-17] SOURCE_MAP.md State Management (ARCH-02) — v4.2

**Implemented:** Per-file extraction state with MD5 hashing. Incremental /extract.

---

### ~~[BL-21] FRAMEWORK.md Sync~~ — RESOLVED

**Resolved:** Content redundant. File cleared, reserved for future PD-OS methodology docs.

---

</details>

---

## Archive Notes

Full context for implemented items preserved in version control. For detailed evidence, see `QA_V2_FINDINGS.md` and `QA_V3_FINDINGS.md`. For user-facing highlights, see [`CHANGELOG.md`](CHANGELOG.md).

Last updated: 2026-02-18 (v4.8.0)
