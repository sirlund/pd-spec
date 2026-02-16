# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

### [BL-18] Observation → Insight Synthesis Layer (ARCH-03)

**Status:** Proposed
**Priority:** High
**Origin:** ARCH-03 (QA v2, 2026-02-15)

**Problem:** 142 atomic observations make dashboard review impossible. Need synthesis layer: observations → ~25 insights with convergence.

**User stories:** See original entry in archive below.

---

### [BL-19] README.md Sync — Outdated Documentation

**Status:** Implemented (updated 2026-02-15)
**Priority:** High

Missing `/extract` and `/audit` skills, outdated pipeline, wrong counts. Fixed in branch claude/summarize-recent-commits-eKvQS.

---

### [BL-20] Layer READMEs Sync — Outdated Documentation

**Status:** Implemented (updated 2026-02-15)
**Priority:** High

Missing EXTRACTIONS.md, RESEARCH_BRIEF.md, wrong pipeline. Fixed in branch claude/summarize-recent-commits-eKvQS.

---

### [BL-22] RAG Layer — Scale Source Ingestion Beyond Context Window

**Status:** Proposed
**Priority:** Low (becomes High at 100+ sources)
**Depends on:** BL-17

**Problem:** PD-Spec reads all sources sequentially. Works for 10-20 sources. At 57+ files, context compaction causes state loss and file skipping. NotebookLM handles 100+ via RAG.

**Solution:** BM25 keyword search (zero deps) or embeddings + vector store. Index claims as extracted, query for relevant context instead of loading all.

**User stories:** See original entry in archive below.

---

### [BL-23] BUG: /extract Editorial Decisions (CRITICAL)

**Status:** Proposed
**Priority:** P0 — Critical
**Origin:** TIMining QA testing (2026-02-15/16)
**Related:** BL-17

**Problem:**
Agent skips files based on "assumed redundancy" or subjective judgment. In TIMining test:
- 27 Workshop photos skipped (claimed "redundant with transcript")
- Photos contain unique sticky notes NOT in transcript
- _FIELD_NOTES.md reported as processed but omitted
- Result: 23/61 files processed (38% completion)

**Evidence:**
```
Corrida #1: Reported 50 processed, actually 22 (56% false)
Corrida #2: Processed 23/61 (38%) — 27 photos + field notes skipped
SOURCE_MAP: "IMG_*.jpeg (21 photos) EXTRACTED" but only 3 sections in EXTRACTIONS.md
```

**Root cause:**
Skill lacks explicit rule against editorial decisions. Subagent optimizes by skipping work.

**Fix:**
```markdown
## MANDATORY RULE: NO EDITORIAL DECISIONS

The agent MUST NOT skip files based on:
- Assumed redundancy
- Subjective judgment
- Optimization attempts

EVERY file discovered in Phase 1 MUST be:
(a) Processed with claims extracted, OR
(b) Reported as unprocessable with technical reason

"Redundancy" is NOT a valid technical reason.
```

**User stories:**
> As a researcher, I expect ALL discovered files to be processed or explicitly reported as unprocessable. The agent should NOT make editorial decisions about which files "seem redundant."

---

### [BL-24] BUG: /extract Fallbacks Not Used (CRITICAL)

**Status:** Proposed
**Priority:** P0 — Critical
**Origin:** TIMining QA testing (2026-02-15/16)
**Related:** BL-17

**Problem:**
Skill has fallback tools (Read PDF, Read with offset/limit) but agent doesn't use them. Reports files as "unprocessable" without attempting fallbacks.

**Evidence:**
| Files | Reported reason | Fallback available | Used? |
|---|---|---|---|
| 5 PDFs | "Require poppler" | `Read(pdf, pages="1-20")` | ❌ NO |
| 1 large MD | "Exceeds token limit" | `Read(file, offset, limit)` | ❌ NO |

**Root cause:**
Instructions specify `Read(pdf, pages="1-20")` which **requires poppler** and fails. The correct approach is `Read(pdf)` WITHOUT pages parameter — extracts text, no poppler needed.

**Additional discovery (2026-02-16):**
Multiple large PDFs (>10MB) in same context cause request accumulation → "Request too large (max 20MB)" error even though individual PDFs are processable. Tested: PDF 1 (17MB) ✅ read successfully, then PDF 2 (11MB) ❌ failed in same context. PDF 2 ✅ succeeded in clean context.

**Fix:**
```markdown
### PDF Processing — MANDATORY APPROACH

1. MUST attempt Read(pdf) WITHOUT pages parameter first
   - Extracts text from PDF (no poppler required)
   - Works for PDFs with text layer

2. For large PDFs or projects with multiple PDFs >10MB:
   - Process ONE PDF at a time
   - Write to EXTRACTIONS.md after EACH PDF
   - Update SOURCE_MAP.md after EACH PDF
   - Intermediate writes clear working memory and prevent request accumulation
   - NEVER read multiple large PDFs in same context without intermediate writes

3. For very large text content (>2000 lines):
   - Use Read(pdf, offset=0, limit=2000) to read in chunks
   - Iterate with offset=2000, 4000, etc.

4. ONLY use pages parameter if PDF is image-only (no text layer):
   - Requires poppler installation
   - Warn user: "PDF appears to be scanned images. Install poppler for OCR, or provide manual summary in _CONTEXT.md"

5. ONLY report as UNPROCESSABLE if:
   - Read(pdf) returns error, OR
   - Single PDF exceeds 20MB request limit even in clean context
   - Log which attempts were made and their error messages

Same for large MD files: MUST attempt Read(file, offset=0, limit=1000) before reporting as "too large"
```

**User stories:**
> As a researcher with PDF sources, I expect the agent to attempt all available tools before reporting a file as unprocessable. "Requires external tool" should only appear after documented Read tool failures.

---

### [BL-25] BUG: /extract False Numerical Reports (HIGH)

**Status:** Proposed
**Priority:** P1 — High
**Origin:** TIMining QA testing (2026-02-15/16)
**Related:** BL-17, BL-23

**Problem:**
Agent reports inflated numbers (intent-based) instead of verified counts (disk-based). SOURCE_MAP.md contains "EXTRACTED" entries for files never processed.

**Evidence:**
```
Report: "50 files processed, 800 claims"
Reality: 22 sections in EXTRACTIONS.md, ~480 claims
Discrepancy: 128% inflation

SOURCE_MAP: "Workshop 1/IMG_*.jpeg (21 photos) EXTRACTED"
EXTRACTIONS.md: Only 3 photo sections exist
```

**Root cause:**
- Skill reports from in-memory counters (intent)
- Context compaction can corrupt counters
- No validation against disk reality

**Fix:**
```markdown
### Phase 4: Report (Validation First)

BEFORE reporting numbers:
1. Re-read EXTRACTIONS.md from disk
2. Count sections: grep -c "^## \[" = files processed
3. Count claims: grep -c "^[0-9]\+\." = total claims
4. Compare against Phase 1 discovery list
5. Report ONLY verified numbers

If discrepancy detected:
- Report: "Warning: intended X files, EXTRACTIONS.md shows Y sections"
- List missing files from Phase 1 discovery
- Mark SOURCE_MAP entries as 'error' for missing files
```

**User stories:**
> As a researcher reviewing extraction results, I expect reported numbers to match reality. If the report says "50 files processed," I should find 50 sections in EXTRACTIONS.md.

---

### [BL-26] BUG: /extract No Auto-Batching for Large Projects (MEDIUM)

**Status:** Proposed
**Priority:** P2 — Medium
**Origin:** TIMining QA testing (2026-02-15/16)

**Problem:**
Projects with >50 files processed in single run → context overflow → incomplete extraction. No automatic batching strategy.

**Evidence:**
- 61 files attempted in one run
- Context compacted 3 times (from earlier logs)
- Resulted in 38% completion

**Fix:**
```markdown
### Phase 1: Discover Sources

If total files > 40:
  1. Auto-divide by folder
  2. Process folder by folder with checkpoints
  3. Write EXTRACTIONS.md + SOURCE_MAP.md after each folder
  4. Report: "Large project (N files). Processing in M batches."

Batch size: 20-30 files per batch (conservative for mixed formats)
```

**User stories:**
> As a researcher with 100+ source files, I expect the extraction to complete automatically by processing in manageable batches, without manual intervention or context overflow.

---

### [BL-27] BUG: /extract SOURCE_MAP Corruption on Interruption (MEDIUM)

**Status:** Proposed
**Priority:** P2 — Medium
**Origin:** TIMining QA testing (2026-02-15/16)
**Related:** BL-17

**Problem:**
If extraction interrupts (timeout, permissions, crash), SOURCE_MAP.md may contain "optimistic" entries (status=EXTRACTED) for unprocessed files. Next incremental run trusts corrupted map → skips files that were never processed.

**Scenario:**
1. /extract starts, processes 10 files
2. Interrupted (permissions timeout, user absent)
3. Agent writes SOURCE_MAP with optimistic entries before exiting
4. Next /extract run (without --full) skips "already processed" files that don't exist in EXTRACTIONS.md

**Fix:**

**Option A: Incremental SOURCE_MAP writes**
```markdown
Update SOURCE_MAP.md after EACH file processed, not at end.
- Pro: Always accurate
- Con: More disk writes
```

**Option B: Validation on startup**
```markdown
### Phase 1b: Compute Delta

Before trusting SOURCE_MAP.md:
1. For each entry with status=EXTRACTED:
   - Verify corresponding ## [filename] exists in EXTRACTIONS.md
   - If missing: change status to 'error' with reason "missing from EXTRACTIONS"
2. Report corrupted entries to user before proceeding
```

**Recommended: Option B** (validation, less I/O overhead)

**User stories:**
> As a researcher whose extraction was interrupted, I expect the next run to detect and correct inconsistencies between SOURCE_MAP.md and EXTRACTIONS.md automatically.

---

## ✅ Implemented (Archive)

<details>
<summary><strong>17 items — v3.0 to v4.2</strong> (click to expand for full context)</summary>

### ~~[BL-01] `/ship design-system`~~ — REMOVED

**Reason:** Crosses PD-Spec boundary into PD-Build responsibility.

---

### [BL-02] `/audit` — Strategic Quality Gate

**Status:** Implemented (diverged) — v4.0 O6
Skill exists but implements data-quality audit (traceability, coverage), not strategic audit (user validation depth). Both complementary.

**Proposed in:** v2.4 (2025-02-10)

---

### [BL-03] UX & Strategy Artifact Catalog — New `/ship` Types

**Status:** Partially Implemented — v4.0 Ola 4
5/6 types implemented: persona, journey-map, lean-canvas, user-stories, benchmark-ux. Missing: service-blueprint, success-metrics.

**Proposed in:** v2.4 (2025-02-10), expanded v3.0 (2025-02-13)

---

### [BL-04] Human Calibration Layer — "Add Context" + Field Notes

**Status:** Partially Implemented (~80%) — v4.0 I3
Confidence tagging done. Add Context exists in dashboard but NOT inline on cards. Field notes template exists.

**Proposed in:** v3.0 (2025-02-13)

---

### [BL-05] Source Diversity Gap Detection — `/analyze` Enhancement

**Status:** Implemented — v4.0 I2
6 source types, diversity matrix, score N/6, gap suggestions in /analyze Phase 2.

**Proposed in:** v3.0 (2025-02-13)

---

### [BL-06] Design Implications in SYSTEM_MAP — `/synthesis` Enhancement

**Status:** Implemented — verified TIMining QA (2026-02-14)
System map modules now have "Design implications" field derived from verified insights.

**Proposed in:** v3.0 (2025-02-13)

---

### [BL-07] `/extract` — Dedicated Source Extraction Skill

**Status:** Implemented (~95%) — v4.0 A1
Skill exists, all file types handled, fallbacks defined. Missing: quick-reference table (cosmetic).

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-08] Merge `/status` Into `/analyze` and `/synthesis` Output

**Status:** Absorbed by BL-12
Template+JSON architecture implemented. /status remains standalone but uses data/template separation.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-09] QA Fixes — Skill Hardening (29 findings)

**Status:** Implemented — v3.2
Timestamp ISO format, ID validation, atomicity guidance, conflict refs, status format fixes.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-10] Insight Temporal Tag — `current` vs `aspirational`

**Status:** Implemented — verified in /analyze SKILL.md
`(current)` and `(aspirational)` tags with criteria and examples.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-11] Convergence Tracking + Source Authority

**Status:** Implemented — verified in /analyze SKILL.md
Voice types (4), Authority levels (5), Convergence ratio X/Y with thresholds.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-12] Research Dashboard — STATUS.html Redesign (v0)

**Status:** Partially Implemented (~85%) — v4.0 A3
Template+JSON architecture built. 8 modules working. Missing: Timeline, Actors, inline Add Context.

**Proposed in:** TIMining QA (2026-02-14)
**Supersedes:** BL-08

---

### [BL-13] `/analyze` — Automatic Research Brief

**Status:** Implemented — verified in /analyze SKILL.md
5 sections (executive summary, thematic grouping, timeline, actors, gaps), writes to RESEARCH_BRIEF.md.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-14] `/extract` — Source Processing Progress Indicator

**Status:** Partially Implemented (~60%) — v4.0 I5
Per-folder + overall progress in conversation/MEMORY. Missing: dashboard integration.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-15] Visual & Interaction Polish — HTML Template Upgrade

**Status:** Proposed
Typography, micro-interactions, data viz, accessibility improvements for all templates.

**Proposed in:** QA v2 (2026-02-15)

---

### [BL-16] PROJECT.md — Separate Project Settings from Engine Config (ARCH-01)

**Status:** ✅ Implemented — v4.2 (2026-02-15)
Project settings moved from CLAUDE.md to PROJECT.md. Prevents merge conflicts on PD-Spec updates.

**Proposed in:** ARCH-01 (QA v2, 2026-02-15)

**User stories (all met):**
- ✅ Merge without conflicts
- ✅ Kickoff writes to PROJECT.md
- ✅ Skills find settings reliably (with fallback)

**Files changed:** 10 (1 new + 9 modified)

---

### [BL-17] SOURCE_MAP.md — Incremental Extraction State (ARCH-02)

**Status:** ✅ Implemented — v4.2 (2026-02-15)
Per-file extraction state with MD5 hashing. /extract processes only NEW/MODIFIED files, skips UNCHANGED.

**Proposed in:** ARCH-02 (QA v2, 2026-02-15)

**User stories (all met):**
- ✅ Don't reprocess unchanged files
- ✅ Know what failed and retry
- ✅ Recover from partial deletion

**Performance:** Adding 3 new files to 57 existing → 3 processed, 54 skipped (~2 min vs 25 min).

**Testing (2026-02-16):** Verified working correctly on TIMining project (61 files). Delta computation detects NEW/UNCHANGED accurately.

**Known issues:** See BL-23 to BL-27 for execution bugs (not architecture issues).

**Files changed:** 3 (1 new + 2 modified)

---

### ~~[BL-21] FRAMEWORK.md Sync — Major Documentation Debt~~ — RESOLVED

**Status:** Resolved (2026-02-15)
Content redundant with README + CLAUDE.md. File cleared, reserved for future PD-OS methodology docs.

---

</details>

---

## Archive Notes

Full context for implemented items preserved above. For version-specific changes and user-facing highlights, see [`CHANGELOG.md`](CHANGELOG.md).

Last updated: 2026-02-16
