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

### [BL-31] Extract Express Mode — Skip Heavy Files for Fast Iteration

**Status:** Proposed
**Priority:** P1 — High (scaling strategy)
**Origin:** QA v3 testing (2026-02-16)
**Related:** BL-29 (batching), BL-22 (RAG scaling)

**Problem:** Heavy files (PDF, DOCX, PPTX, >5MB) cause disproportionate overhead — 20% of files consume 80% of extraction time. Blocks fast iteration.

**Proposed:** Three modes for `/extract`:

```bash
/extract              # Express: process only light files, mark heavy as pending
/extract --full       # Full: process all files including heavy
/extract --heavy      # Process only pending heavy files
```

- Light: .md, .txt, .png, .jpg < 1MB
- Heavy: .pdf, .docx, .pptx, any file ≥ 5MB
- Heavy files marked `pending-heavy` in SOURCE_MAP.md

**User story:**
> As a PD-Spec user with 100 source files (80 md/images + 20 PDFs), I want to extract insights from light files in 2-3min and defer heavy PDFs until later.

---

### [BL-32] Auto Express Mode — Smart Project Size Detection

**Status:** Proposed
**Priority:** P1 — High (UX improvement)
**Origin:** QA v3 testing (2026-02-16)
**Related:** BL-31 (Express Mode), BL-18 (Synthesis layer)

**Problem:** Pipeline feels slow even on small projects (11 files, 220 claims). Synthesis layer adds value for large projects (>500 claims) but creates overhead for small ones.

**Proposed:** Auto-detect project size, skip synthesis for small projects:
- < 30 files OR < 500 claims → Express (atomic insights only)
- 30-50 files OR 500-1000 claims → Express + suggest `--full`
- \> 50 files OR > 1000 claims → Full mode (synthesis activated)

**User story:**
> As a researcher with a small project, I expect fast iteration with atomic insights in <2min, not waiting for synthesis overhead.

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

### [BL-36] Dashboard Conflict States — Intermediate Status (Flagged/Research)

**Status:** Proposed
**Priority:** P1
**Origin:** QA v3 BL-35 testing (2026-02-16), QA3-UX-06

**Problem:** When user flags a conflict for discussion or marks it for research via `/synthesis`, it stays as `PENDING` in CONFLICTS.md. Dashboard shows blank radio buttons — no indication a decision was made.

**Proposed fix:** Extend CONFLICTS.md status syntax:
```markdown
Status: PENDING — Flagged (CTO + Producto)
Status: PENDING — Research needed (validate pricing model)
```

Dashboard parses metadata → shows badge (Flagged in amber, Research in blue) + pre-selects radio.

**User story:**
> As a researcher who flagged CF-03 for CTO discussion, I expect the dashboard to remember that decision.

**Acceptance criteria:**
- [ ] CONFLICTS.md supports intermediate status syntax
- [ ] Dashboard parses and displays badges
- [ ] Radio buttons pre-select based on metadata
- [ ] /synthesis writes intermediate status when flagging

---

### [BL-37] AI-Generated Source Validation — Detect Hallucinated Claims

**Status:** Proposed
**Priority:** P1 — High (data integrity)
**Origin:** TIMining entregables session (2026-02-17), via IDEAS.md idea flow
**Related:** Mandate #1 (No Hallucination), BL-23 (no editorial decisions)

**Problem:** When AI-generated content (Gemini, ChatGPT outputs) enters `01_Sources/`, `/extract` treats it as ground truth. Fabricated benchmarks, fictional metrics, and unsourced case studies become claims indistinguishable from real data.

**Evidence:** TIMining — 3 Gemini slides removed during manual review (fabricated benchmarks, fictional metrics).

**Proposed fix:**
1. New `source_type: ai-generated` in `_CONTEXT.md`
2. `/extract` flags claims with `[AI-SOURCE]` tag
3. `/analyze` treats AI-sourced claims as lowest authority (`voice: ai`, `authority: hypothesis`)
4. AI-only insights cannot reach VERIFIED without non-AI corroboration

**User story:**
> As a researcher using Gemini outputs as starting points, I expect PD-Spec to flag AI-generated claims separately so fabricated data doesn't silently become verified insights.

**Acceptance criteria:**
- [ ] `_CONTEXT.md` supports `source_type: ai-generated`
- [ ] `/extract` tags claims from AI sources with `[AI-SOURCE]`
- [ ] `/analyze` weights AI-sourced claims as lowest authority
- [ ] AI-only insights cannot reach VERIFIED without non-AI corroboration
- [ ] Dashboard shows AI-source warning badge on affected insights

---

## ✅ Implemented (Archive)

<details>
<summary><strong>BL-18 to BL-35 — v4.3 to v4.6</strong> (click to expand)</summary>

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

Last updated: 2026-02-18
