# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

> Ordered by priority: P2 → P3 → Low → PARKED.

### [BL-56] Export Functionality — Multi-Format Deliverable Export

**Status:** Proposed
**Priority:** P2
**Origin:** BL-33 Phase 1 (deferred). Evidence: TIMining `html2pptx.py` proof-of-concept (34 slides, editable PPTX).

**Problem:** Deliverables are HTML-only. Stakeholders need DOCX for editing, PPTX for presentations, PDF for distribution. Currently requires manual copy-paste or ad-hoc scripts.

**Solution:** `[Export ▾]` dropdown in Live Research App per output file: MD→DOCX (pandoc), HTML→PPTX (python-pptx), HTML→PDF (print CSS / weasyprint). Script-based, not LLM-based.

**Evidence from TIMining:**

| | Python `html2pptx.py` | Node `dom-to-pptx` (experiment branch) |
|---|---|---|
| **Approach** | Parse HTML with BeautifulSoup → reconstruct in PPTX | Render in headless Chrome → capture DOM → export |
| **Fidelity** | ~80% (reconstructs layout) | ~95% (captures actual render) |
| **Editability** | High (text, shapes, tables editable) | Low (slides as images) |
| **Dependencies** | `beautifulsoup4` + `python-pptx` | `playwright` + `dom-to-pptx` + local fonts |
| **Complexity** | High (1,200 lines, hardcoded for TIMining) | Medium (~250 lines, generic) |
| **Generalizable** | Needs refactoring | Works on any HTML out of the box |

Recommendation: Python approach (editable > screenshots) but needs generalization to parse PD-Spec template conventions (cards, badges, tables) instead of hardcoded slide types.

**Acceptance criteria:**
- [ ] Export dropdown in Live Research App for output files
- [ ] At least one format working (PPTX recommended — highest stakeholder demand)
- [ ] Script-based conversion (no LLM tokens)
- [ ] Generic parser (PD-Spec template conventions, not hardcoded per output type)

**User story:**
> As a consultant presenting to a client, I can export the PRD or presentation from the Live Research App to an editable PPTX with one click, without copy-pasting or running ad-hoc scripts.

---

### [BL-57] Moved Source Detection — Hash-Based Path Reconciliation in /extract

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7 (2026-02-23). TIMining: Touchpoint file moved from `sesiones-idemax/` to `Touchpoint 1/` after extraction. SOURCE_MAP retained old path → file appeared as "untracked" despite being fully extracted with 134KB normalized transcript in `_temp/`.

**Problem:** When a user moves or renames source files after `/extract`, SOURCE_MAP becomes stale. The file shows as untracked (new) and its extractions/insights lose traceability. Re-extracting wastes tokens on already-processed content.

**Solution:** In `/extract`, before processing untracked files:
1. Compute hash for each untracked file
2. Cross-reference against existing SOURCE_MAP hashes
3. If hash matches an entry with a different path → **moved file** → propose path update
4. Update SOURCE_MAP path, EXTRACTIONS.md source header, and `_temp/*_normalized.md` filename
5. Present to user: "Touchpoint_TIMining... moved from sesiones-idemax/ to Touchpoint 1/. Update path?"

**Acceptance criteria:**
- [ ] Moved files detected by hash match before extraction begins
- [ ] User approves path updates (propose-before-execute)
- [ ] SOURCE_MAP, EXTRACTIONS.md, and _temp/ normalized files updated consistently
- [ ] No re-extraction needed for moved files (tokens saved)

**User story:**
> As a researcher reorganizing my source folders, I can move files freely and `/extract` detects the move and updates paths, without losing my existing extractions.

---

### [BL-48] AI Convergence Breakdown — Show Authority Distribution in Convergence Ratios

**Status:** Proposed
**Priority:** P3
**Origin:** QA v4 (2026-02-20), QA4-OBS-04. Evidence: AI source contributed 18/59 to convergence ratios, indistinguishable from stakeholder sources in dashboard display.

**Problem:** After BL-37, AI-generated sources enter the pipeline with `voice: ai` and `authority: hypothesis` metadata. However, convergence ratios (e.g., `18/59`) don't surface this distinction. A dashboard consumer sees `18/59` and assumes 18 independent stakeholder data points — but 1 of those 59 sources is AI-generated.

**Solution:** Extend convergence display format to show authority breakdown:

```
Convergence: 18/59 (1 AI, 1 internal)
```

Or in dashboard JSON:
```json
{
  "convergence": "18/59",
  "convergence_breakdown": { "primary": 57, "internal": 1, "ai": 1 }
}
```

**Scope:** Refinement of BL-37 display layer. No logic changes — AI sources already tagged correctly. Only affects how convergence is rendered in INSIGHTS_GRAPH.md entries and STATUS.html dashboard.

**Acceptance criteria:**
- [ ] Convergence ratio in INSIGHTS_GRAPH.md shows authority breakdown when non-primary sources exist
- [ ] Dashboard JSON includes `convergence_breakdown` field
- [ ] Dashboard template renders breakdown (e.g., footnote or parenthetical)
- [ ] No change when all sources are primary (clean `18/59` display)

---

### [BL-22] RAG Layer — Scale Source Ingestion Beyond Context Window

**Status:** Proposed
**Priority:** Low (becomes High at 100+ sources)
**Depends on:** BL-17

**Problem:** PD-Spec reads all sources sequentially. Works for 10-20 sources. At 57+ files, context compaction causes state loss and file skipping. NotebookLM handles 100+ via RAG.

**Solution:** BM25 keyword search (zero deps) or embeddings + vector store. Index claims as extracted, query for relevant context instead of loading all.

**Scaling strategy:**
- BL-29 (batching): Handle 40-100 files done
- BL-31 (express mode): Handle 100-200 files by deferring heavy files
- BL-22 (RAG layer): Handle 200+ files with embeddings + retrieval

**Re-evaluation note (2026-02-20):**

The 3-layer compression model may make full RAG unnecessary. Evidence from TIMining (61 files, 1,238 claims → 21 insights): downstream skills (/synthesis, /ship) never see raw volume. Analysis by pipeline phase:

| Phase | Needs RAG? | Why |
|---|---|---|
| /extract | No — already incremental (file-by-file, BL-29 batching) |
| /analyze | Maybe — reads full EXTRACTIONS.md. Worked at 1,238 claims. Bottleneck at ~5,000+ |
| /synthesis | No — works on INSIGHTS_GRAPH (21 items in TIMining, already compressed) |
| /ship | No — works on Work layer (already synthesized) |
| Freemode | Maybe — cross-source queries, but BL-41 (state management) reduces need |

Options under consideration:
- **A) Keep as-is** — Low priority, activate when a project hits 200+ sources
- **B) Reformulate as "Smart Context Loading"** — no embeddings/vector store, just thematic clustering of claims so /analyze processes by topic instead of sequentially. Lighter, no infra deps.
- **C) Kill** — Homer's Car. The scaling strategy already covers realistic project sizes. Projects with 200+ sources may need sub-project decomposition, not RAG.

Decision deferred — revisit when a real project hits the ceiling.

---

### [BL-15] Visual & Interaction Polish — HTML Template Upgrade

**Status:** PARKED
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

## ✅ Implemented (Archive)

<details>
<summary><strong>BL-33 to BL-55 — v4.13.0 to v4.17.0</strong> (click to expand)</summary>

### [BL-47] Script-First Skill Execution — v4.17.0

**Implemented:** 2026-02-22. "90/10 Rule" section in CLAUDE.md: mechanical operations (counting, hashing, JSON generation) use inline Bash/Python scripts; LLM handles semantic tasks. Table of script-eligible operations with tool and pattern. Validation rules (counts > 0, JSON parses, no data loss). /analyze steps 25-26 and /extract step 13 marked ⚙️ SCRIPT-ELIGIBLE. Prevents BUG-04 class errors (agent miscounting).

---

### [BL-52] BUG: Normalization Does Not Break Oversized Lines — v4.17.0

**Implemented:** 2026-02-22. Added step 17b to /extract Phase 1.5: after normalization, files flagged `oversized-lines` get sentence-boundary regex split (`re.sub(r'([.?!])\s+(?=[A-Z])', r'\1\n', text)`). Hard-break fallback at 1500 chars for lines without sentence punctuation. Verify `wc -L` < 2000. Clears `oversized-lines` flag so Phase 2 uses standard Read tool.

---

### [BL-53] BUG: No Batch-Boundary Checkpoints in /extract Phase 2 — v4.17.0

**Implemented:** 2026-02-22. Made SESSION_CHECKPOINT a separate numbered step in both Pass 1 (step 4, after step 3 EXTRACTIONS write) and Pass 2 (step 5, after step 4 per-file write). Pass 2 was missing checkpoints entirely — now writes after every heavy file with phase, processed/remaining counts, and resume instruction.

---

### [BL-55] BUG: Stale Engine Version in Live Research App — v4.17.0

**Implemented:** 2026-02-22. `/api/project` endpoint reads engine version from `docs/CHANGELOG.md` (first `## [X.Y.Z]` header) using `readAndParse()` with mtime cache. Fallback to PROJECT.md's `engine_version` if CHANGELOG unavailable. Fixes permanently stale version in project branches where `merge=ours` protects PROJECT.md.

---

### [BL-33] Live Research App — From Static Dashboard to Interactive Web App — v4.15.0/v4.16.0

**Implemented:** Phase 1 (v4.15.0, 2026-02-19) — MVP live read-only app with Express/React/chokidar/WebSocket. Phase 2 (v4.16.0, 2026-02-22) — dark-first design system, feature parity with status dashboard (SystemMapView, EvidenceGapsView, decision tracking), interactive actions (AddContext + Actions prompt generators), Dropbox-style FileBrowser with split-panel preview. Performance optimization (2026-02-22) — singleton WebSocket, debounced refetch, server-side mtime-validated parse cache. Absorbs BL-42 (Work Layer Viewer). Export functionality split to BL-56.

---

### ~~[BL-42] Work Layer Viewer~~ — Absorbed by BL-33 (v4.15.0)

**Absorbed:** BL-33 Phase 1 covers semantic MD viewer, `/view` skill, and local server lifecycle.

---

### [BL-44] Source Authority Layer — v4.14.0

**Implemented:** 2026-02-21. Separated format (Source Type) from weight (Authority) as orthogonal metadata axes. Three authority tiers: `primary` (default, full weight), `internal` (consultant/team, reduced weight, `[INTERNAL]` tag), `ai-generated` (AI tools, lowest weight, `[AI-SOURCE]` tag). Verification gate: internal/ai insights cannot reach VERIFIED without primary corroboration. Per-file authority via frontmatter overrides folder default. Refactors BL-37.

---

### [BL-46] Smart Speaker Attribution — v4.14.0

**Implemented:** 2026-02-21. Two-component solution: (1) Phase 1.5 content-based segmentation for unsegmented multi-speaker transcripts using Work layer speaker priors (roles, topics, vocabulary patterns), with confidence levels per segment. (2) Post-/analyze speaker clarification loop — detects uncertain attributions, groups by transcript segment, presents targeted questions, propagates corrections in batch.

---

### [BL-51] BUG: Pass C Silently Skipped — v4.14.0

**Implemented:** 2026-02-21. Restructured Phase 1.5 into Phase 1.5a (mechanical Passes A+B, scripting allowed) and Phase 1.5b (semantic Pass C, LLM-only). Hard gate between them forces agent to write `_mechanical.md`, stop, read it back, and apply Pass C as separate LLM reasoning step. Python regex explicitly prohibited for Pass C. Mandatory verification marker.

---

### [BL-54] Formalized QA Pipeline — v4.13.0

**Implemented:** 2026-02-21. `docs/qa/README.md` rewritten with 6-step pipeline (PLAN → SETUP → EXECUTE → OBSERVE → EVALUATE → DOCUMENT). Key principle: executing agent never writes findings. Auto-observation via `script` terminal capture + SESSION_CHECKPOINT polling. PLAN template includes anticipated decision points with prescribed answers. FINDINGS template includes score tables, verdict by BL, and recommendations.

---

</details>

<details>
<summary><strong>BL-18 to BL-50 — v4.3 to v4.13.0</strong> (click to expand)</summary>

### [BL-49] BUG: Oversized Lines Break Read Tool in /extract — v4.13.0

**Implemented:** 2026-02-20. Added step 5b (oversized line detection) in Phase 1: checks `file_size / line_count > 2000` chars/line ratio, flags files as `oversized-lines`. Phase 2 routes flagged files to Bash byte-range reads (`head -c 8000`) instead of Read tool. Files normalized by Phase 1.5 have flag cleared (proper line breaks after preprocessing). Covers edge case where preprocessing is skipped.

---

### [BL-50] BUG: Phase 1.5 Pass C (Sentence Repair) Not Implemented — v4.13.0

**Implemented:** 2026-02-20. Added explicit enforcement instruction in Phase 1.5 Pass C: sentence repair CANNOT be done mechanically (sed, awk, regex). Requires LLM reasoning to detect semantic boundaries, incomplete thoughts, and overlapping speech. After Passes A+B (which CAN use mechanical substitution), a dedicated LLM analysis pass applies Pass C markers.

---

### [BL-45] Mid-Skill Checkpoints — Survive Context Compaction During Long Operations — v4.13.0

**Implemented:** 2026-02-20 (Option A — task-aware preventive checkpoints). Added cost gate after Phase 1 in both /extract and /analyze: if file_count > 10 OR total_size > 50KB OR preprocessing candidates detected, writes preventive checkpoint to SESSION_CHECKPOINT.md with file queue, mode, and resume instructions. Small tasks skip mid-skill checkpoints. Batch-boundary checkpoints in /extract Phase 2 update SESSION_CHECKPOINT after every 10-file batch. /analyze gets additional checkpoint after Phase 2 analysis draft. Zero overhead for light operations.

---

### [BL-43] Smart Source Preprocessing — Transcript Normalization + Speaker Detection — v4.12.0

**Implemented:** 2026-02-20. Phase 1.5 added to /extract: detects noisy transcript sources (metadata `Source Type: transcript` or content heuristic), gathers project context as an in-memory glossary (no persistent file), normalizes via 3 passes (speaker detection, phonetic correction, sentence repair), presents quality report for mandatory user approval, writes normalized output to `02_Work/_temp/`. Phase 2 reads from normalized version via redirect map. v1 scope: transcripts only (OCR, chat-log reserved for v2). Simplified from original proposal: no glossary file, no preprocessor registry, no language-specific rules, no new SOURCE_MAP statuses.

---

### [BL-41] State Management — MEMORY Compaction + Checkpoint Recovery — v4.11.0

**Implemented:** 2026-02-20. SESSION_CHECKPOINT becomes primary recovery mechanism for all sessions (not just freemode). MEMORY.md compacted at 80 lines (historical summary + 3 most recent entries). Session protocol rewritten: read checkpoint first (1 read, ~2K tokens), fall back to MEMORY only if checkpoint stale/absent. Integrity check only on count divergence. Quantitative Snapshot added to checkpoint template. `/reset` now cleans `02_Work/_temp/`.

---

### [BL-40] Session Checkpoint Limit Increase — v4.10.1

**Implemented:** 2026-02-20. Increased `SESSION_CHECKPOINT.md` limit from 50 to 150 lines in CLAUDE.md. The 50-line cap was too restrictive for intensive freemode sessions; 150 lines (~2K tokens, 1.1% of context window) provides 3x more room with negligible performance impact.

---

### [BL-39] Artifact Normalization — v4.10

**Implemented:** 2026-02-18. Normalization protocol in CLAUDE.md Freemode section. Agent detects monolithic imports >30KB in `_assets/`, proposes split (section files + shared CSS/JS + index loader), maintains visual parity, targets 2-5KB per section. Dynamic counters via JS. `_temp/STRUCTURE_INDEX.md` maps sections → files → line ranges for offset/limit reads.

---

### [BL-38] Freemode Protocol — v4.9

**Implemented:** 2026-02-18. CLAUDE.md Freemode Protocol section (work-first routing, session checkpoint, cost awareness). `02_Work/_assets/` with `_INTAKE.md` for external materials. `03_Outputs/_custom/` for non-pipeline deliverables (preserved by /reset). `.gitattributes` merge protection for `_custom/`. Templates in `02_Work/_README.md`.

---

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

Full context for implemented items preserved in version control. For detailed evidence, see `QA_V2_FINDINGS.md`, `QA_V3_FINDINGS.md`, `QA_V4_FINDINGS.md`, and `QA_V5_FINDINGS.md`. For user-facing highlights, see [`CHANGELOG.md`](CHANGELOG.md).

Last updated: 2026-02-22 (v4.17.0)
