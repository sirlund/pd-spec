# QA v3 Findings — v4.3.0 Validation

**Test Date:** 2026-02-16
**Test Environment:** TIMining project, 61 source files, test-timining branch
**Test Executor:** Opus 4.6 (fresh session)
**Version Tested:** v4.3.0 (commits f250d57 → 809e99a)

## Test Scope

Validating overnight implementation (BL-18, BL-23, BL-24, BL-27, BL-28):
- /extract: 100% file processing (no skips)
- /analyze: incremental mode + synthesis layer
- Pipeline: end-to-end execution without manual intervention

## Expected Outcomes

| Metric | Expected | Baseline (pre-v4.3) |
|---|---|---|
| Files processed | 61/61 (100%) | 23/61 (38%) |
| Insights | ~18 synthesized | 161 atomic |
| Ambiguities detected | 3-5 | 0 |
| /status duration | <2 min | 7m 8s |
| Context compaction | 0-1 times | Multiple |

---

## 🐛 BUGS

### [QA3-BUG-01] Subagents Cannot Read /tmp Converted Files (Permission Issue)

**Severity:** High
**Component:** /extract (parallel Task agents)
**Related:** BL-24 (Office file conversion)

**Observed behavior:**
Parallel Task agents launched for extraction hit permission issues when trying to read converted files in `/tmp`:
- Agent 2, 3, 4: Failed on /tmp reads
- Agent 1, 5: Partial success (in-repo files only)
- Agent 6: Success (no /tmp dependency)

**Expected behavior:**
Subagents should be able to read converted DOCX/PPTX files from `/tmp` directory.

**Reproduction:**
```
1. Convert DOCX to /tmp/file.txt via textutil
2. Launch Task agent with subagent_type=general-purpose
3. Agent attempts Read(/tmp/file.txt)
4. Permission denied
```

**Evidence:**
```
"The subagents are hitting permission issues with /tmp files."
"Agents 2, 3, 4 failed on /tmp reads"
Opus had to switch strategy: "I'll do the extraction work directly"
```

**Impact:**
- Forces fallback to direct extraction in main context (slower, more context pressure)
- Parallel extraction strategy fails
- Negates performance benefits of parallelization

**Proposed fix:**
Option A: Write converted files to repo temp dir (e.g., `02_Work/_temp/`) instead of `/tmp`
Option B: Task agents need elevated /tmp read permissions
Option C: Don't use Task agents for extraction, use direct reads only

---

### [QA3-BUG-02] Pipeline Cannot Handle 61 Files — Unrecoverable Context State

**Severity:** CRITICAL — BLOCKING
**Component:** /extract (entire pipeline)
**Related:** BL-26 (auto-batching), QA3-PERF-01

**Observed behavior:**
1. Extraction of 61 files triggers context limit at 6m 42s
2. Attempt to `/compact` fails with: "Conversation too long"
3. Pipeline completely blocked, cannot proceed to /analyze
4. No recovery path available

**Expected behavior:**
- Auto-batching should activate for >40 files (BL-26)
- Intermediate writes after each batch should prevent context overflow
- OR compaction should recover from context limit

**Evidence:**
```
Error during compaction: Error: Conversation too long.
Press esc twice to go up a few messages and try again.
```

**Impact:**
- **Pipeline is NOT production-ready for projects with >40 files**
- Auto-batching (BL-26) did NOT activate
- v4.3.0 cannot handle TIMining project (61 files)
- Complete session loss, no way to recover partial work

**Root cause:**
- Large Project Strategy (BL-26) exists in instructions but was NOT executed
- Parallel agents accumulated too much context before failure
- No intermediate writes occurred (single batch attempted)

**Proposed fix:**
MANDATORY intermediate writes every 10-20 files, not just "if >40 files detected"
- After 10 files: Write EXTRACTIONS.md + SOURCE_MAP.md
- After 20 files: Write again
- Repeat until complete
- Each write clears working memory, prevents accumulation

---

### [QA3-BUG-03] BL-29 Batch Size Still Too Large — PDFs Cause Overflow

**Severity:** High (blocks completion)
**Component:** /extract (BL-29 implementation)
**Related:** BL-29, QA3-BUG-02

**Observed behavior:**
- Batching activated correctly (61 files → 5 batches)
- Batch size: 15 files
- Intermediate writes working (2 successful checkpoints)
- Context limit reached at 6m 1s during batch 1, file 9/15
- Failed while reading 2 PDFs in Antecedentes/

**Expected behavior:**
- Batch should complete all 15 files before hitting context limit
- Write checkpoint after batch 1 completes
- Continue to batch 2

**Evidence:**
```
✅ Batch 1 started: 15 files (4 md + 4 png + 7 Antecedentes)
✅ Checkpoint 1: After 4 md (170 lines, 131 claims)
✅ Checkpoint 2: After 4 png (+105 lines, 73 claims)
⏳ Processing: Antecedentes 4/7 files
❌ Context limit: While reading 2 PDFs
⏱️ Duration: 6m 1s (vs 6m 42s pre-BL-29, minimal improvement)
```

**Root cause:**
- PDFs are context-expensive (large text extraction)
- Batch size 15 works for md/png but not when PDFs included
- Accumulation: 4 md + 4 png + 2 DOCX conversions + 1 PPTX conversion + 2 PDFs = overflow
- Intermediate writes reduce risk but don't prevent intra-batch accumulation

**Proposed fix (BL-29 refinement):**

**Option A: Reduce batch size to 10 files**
```markdown
Step 5: Batch detection
- If count > 40: Batch size = 10 files (not 15)
- More batches, more writes, safer
```

**Option B: Weighted batching (file type aware)**
```markdown
Assign weights:
- md/png: 1 unit
- DOCX/PPTX converted: 2 units
- PDF: 3 units

Batch until weight = 10-12 units, not file count
Example: 4 md (4) + 2 png (2) + 1 PDF (3) = 9 units → next batch
```

**Option C: Write after each subfolder (not batch)**
```markdown
Process files folder by folder:
- entrevistas operaciones/ → write checkpoint
- entrevistas iniciales/ → write checkpoint
- Antecedentes/ → write checkpoint
- etc.

Eliminates batching, just process + write per folder
```

**Option D: Two-pass strategy (large files last)**
```markdown
Pass 1: Process small/medium files (md, png, jpg, txt)
- Batch size: 15 files
- Write checkpoint after each batch
- Skip PDFs, DOCX, PPTX, large images >5MB

Pass 2: Process large files (deferred from Pass 1)
- Batch size: 5 files (conservative)
- Write checkpoint after each batch
- Process PDFs, converted DOCX/PPTX, large images

Logic:
1. Classify files by estimated context cost:
   - Light: md, png, jpg, txt < 1MB
   - Heavy: PDF, DOCX/PPTX (converted), files > 5MB
2. Process all Light files first (batch 15)
3. Process all Heavy files second (batch 5)
4. Guarantees progress even if Heavy files hit limits
```

**Recommendation:** Option D (two-pass strategy)
- Guarantees Light files always complete (majority of files)
- Heavy files isolated in smaller batches
- If Pass 2 fails, at least Pass 1 is done (partial success better than total failure)
- Simple classification: file extension + size check
- No complex weighting logic needed

---

### Option D Test Results (2026-02-16, 30m 22s)

**Result:** ❌ FAILED

| Metric | Result | Baseline | Target |
|---|---|---|---|
| Files processed | 38/61 (62%) | 8/61 (13%) | 61/61 (100%) |
| Duration | 30m 22s | 6m 1s | <2min |
| Light files (Pass 1) | ✅ 27/27 (100%) | — | — |
| Heavy files (Pass 2) | ❌ 0/16 (0%) | — | — |
| Context overflows | 7 agents | 1 event | 0 |

**What worked:**
- ✅ Two-pass classification (Light vs Heavy)
- ✅ Light files completed successfully (27 workshop images)
- ✅ Intermediate writes preserved state through compactions

**What failed:**
- ❌ Task agents hit context limits without writing partial progress
- ❌ 7 agents launched, all failed with "Context limit reached"
- ❌ Heavy files (DOCX, PPTX, PDF) completely unprocessed (0/16)
- ❌ Duration unacceptable (30min vs 2min target, 15x slower)

**Root cause:**
- **Task agents architecture inadequate for /extract**
  - Agents accumulate context without ability to make intermediate writes
  - When agent hits limit, all work is lost (no partial writes)
  - Each agent loads full skill instructions + processes multiple files
  - No recovery mechanism within agent execution

**Conclusion:**
Option D strategy (two-pass) is sound, but **implementation with Task agents fails**. Need to eliminate Task agents and process directly in main context with frequent writes.

---

**Option E: Direct Processing with Per-File Writes (Heavy Files)** ⭐ NEW RECOMMENDATION

**Strategy:**
1. **Eliminate Task agents entirely** from /extract
2. **Process all files sequentially** in main context
3. **Light files:** Batch 10, write after batch
4. **Heavy files:** Batch 1, write after EACH file
5. **Frequent intermediate writes** prevent context accumulation

**Implementation:**
```markdown
**Light Files (md, txt, png, jpg < 1MB):**
- Batch size: 10 files
- Process batch
- Write EXTRACTIONS.md + SOURCE_MAP.md
- Continue to next batch

**Heavy Files (PDF, DOCX/PPTX, files ≥5MB):**
- Batch size: 1 file (process one at a time)
- Convert if needed (DOCX→txt, PPTX→txt)
- Read and extract claims
- Write to EXTRACTIONS.md + SOURCE_MAP.md IMMEDIATELY
- Clean temp files
- Continue to next file

**NO Task agents. NO parallelization. Sequential + frequent writes.**
```

**Benefits:**
- ✅ Simple, predictable execution
- ✅ Progress persisted after every heavy file (recovery-friendly)
- ✅ No context accumulation (writes clear working memory)
- ✅ No agent overhead (no skill reload per file)
- ✅ Works with incremental mode (SOURCE_MAP tracks progress)

**Trade-offs:**
- ⚠️ Slower than parallel processing (but parallel failed anyway)
- ⚠️ More write operations (but prevents data loss)

---

## ⚡ PERFORMANCE

### [QA3-PERF-01] Context Limit Reached During Extraction (6m 42s)

**Component:** /extract (direct + parallel agents)
**Duration:** 6m 42s to context limit (extraction incomplete)

**Observed:**
Multiple "Context limit reached" messages after 6m 42s:
- Main context: "Context limit reached · /compact or /clear to continue"
- All 6 Task agents: "Context limit reached" upon completion
- Extraction incomplete at this point

**Context:**
- File count: 61 source files
- Conversions: 5 HEIC + 6 DOCX + 5 PPTX = 16 conversions
- Parallel agents: 6 Task agents launched
- Strategy: Changed from parallel to direct after /tmp permission failures

**Impact:**
- Extraction taking much longer than expected (<2 min baseline)
- Context compaction required mid-extraction
- Risk of data loss if compaction corrupts state
- User experience: "eterno" (as reported in previous test)

**Analysis:**
61 files + conversions + 6 parallel agents + their outputs = massive context overhead
- Each agent loads full skill instructions
- Each agent processes multiple files
- Agent outputs accumulate in main context
- Direct fallback after /tmp failure adds more load

---

## 💡 UX OBSERVATIONS

### [QA3-UX-01] Pipeline Feels Slow Even on Small Projects — Need Express Mode

**Component:** /analyze (synthesis layer)
**Context:** Triviapp-pd project (11 files, 220 claims)

**Observation:**

User feedback: *"lo siento muy lento incluso en este contexto de mini proyecto"*

For small projects (11 files, 220 claims), full synthesis layer creates overhead:
- 220 claims → 35 atomic → 7 synthesized + 5 standalone
- Clustering, narratives, evidence trails, convergence analysis
- Processing time feels disproportionate to project complexity
- Ratio insights/claims: 21% (high for small project)

**User impact:**
- Fast iteration blocked by unnecessary synthesis
- Small projects don't need strategic consolidation
- Synthesis layer adds value for large projects (>500 claims) but overhead for small

**Proposal: Auto Express Mode**

**Auto-detect project size and adjust processing:**

```
IF project < 30 files OR < 500 claims:
  → Express mode (default)
  → Atomic insights only (no clustering, no synthesis)
  → Log: "⚡ Express mode: 11 files, 220 claims. Use /analyze --full for deeper synthesis."

IF project > 50 files OR > 1000 claims:
  → Full mode (synthesis activated)
  → Log: "🔍 Large project detected (65 files, 1,200 claims). Running full synthesis..."

IF 30-50 files OR 500-1000 claims:
  → Express mode + suggest full
  → Log: "⚡ Express mode: 40 files, 800 claims. Consider /analyze --full for complex projects."
```

**Express mode behavior:**
- ✅ Atomic insights (one per claim cluster)
- ✅ Conflict detection (still works)
- ✅ Fast dashboard generation
- ❌ No synthesis layer (clustering, narratives)
- ❌ No convergence weighting
- ❌ No strategic consolidation

**Full mode (`/analyze --full`):**
- ✅ Synthesis layer active
- ✅ Strategic insights (7-25 consolidated from atomics)
- ✅ Convergence weighting, narratives, evidence trails
- ✅ Ambiguity detection (6 types)

**Benefits:**
- Fast iteration for small projects (majority of use cases)
- User controls depth via `--full` flag when needed
- Clear logic: project size determines mode
- Backward compatible (--full preserves current behavior)

---

### [QA3-UX-02] No Visual Progress Per Phase — User Can't Review Incrementally

**Component:** /analyze, /synthesis (whole pipeline)
**Context:** Triviapp-pd session, multiple propose-approve cycles

**Observation:**

Current flow requires multiple roundtrips:
1. /analyze presents synthesis report → user approves → writes INSIGHTS_GRAPH.md
2. /status (manual invocation) → generates dashboard
3. /synthesis presents conflict resolutions → user decides → writes SYSTEM_MAP.md
4. /ship presents structure → user approves → writes PRD.html

**Problems:**
- No visual progress tracking across phases
- Each skill isolated, user can't see "where we are"
- Dashboard (/status) is separate skill, must invoke manually
- User can't review progress incrementally (all-or-nothing approvals)

**User impact:**
- Hard to understand pipeline state
- Can't make informed decisions without seeing full context
- Manual /status invocation adds friction (BL-30 addresses this)

**Proposal: Phase-Based Dashboard — Visual Progress in STATUS.html**

**Auto-generated dashboard shows progress per phase:**

```markdown
┌─────────────────────────────────────────────────────────┐
│ 📊 Triviapp Research Dashboard                          │
├─────────────────────────────────────────────────────────┤
│ Phase 1: Sources Loaded                                 │
│ ✅ 11 files, 220 claims extracted                       │
│ [Ver EXTRACTIONS.md] [Add more sources]                 │
├─────────────────────────────────────────────────────────┤
│ Phase 2: Atomic Insights                                │
│ ✅ 35 insights created (12 PENDING approval)            │
│ [Approve/Reject inline] [View insights]                 │
├─────────────────────────────────────────────────────────┤
│ Phase 3: Synthesis                                      │
│ ⏭️ SKIPPED (Express mode active)                        │
│ [Run /analyze --full for synthesis layer]              │
├─────────────────────────────────────────────────────────┤
│ Phase 4: Conflicts                                      │
│ ⚠️ 3 conflicts detected (3 PENDING resolution)          │
│ [Resolve conflicts inline] [View conflicts]             │
├─────────────────────────────────────────────────────────┤
│ Phase 5: System Map                                     │
│ ⏳ PENDING (run /synthesis after resolving conflicts)   │
│ [Start synthesis] [Skip to /ship]                       │
├─────────────────────────────────────────────────────────┤
│ Phase 6: Deliverables                                   │
│ 📄 PRD.html available                                   │
│ [View PRD] [Generate more outputs]                      │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- ✅ Visual progress tracker (completed → pending → skipped)
- ✅ Inline actions (approve/reject, resolve conflicts)
- ✅ User sees "where we are" at all times
- ✅ Dashboard auto-updates after each skill
- ✅ User interacts from dashboard, not chat (reduces roundtrips)

**Implementation:**
- /analyze generates STATUS.html with Phase 1-4 populated
- /synthesis updates STATUS.html with Phase 5 populated
- /ship updates STATUS.html with Phase 6 populated
- Dashboard is living document, not one-time snapshot

**Connection to BL-30:**
BL-30 proposes auto-generating STATUS.html in /analyze. This extends that: dashboard becomes phase-based progress tracker, not just static report.

---

### [QA3-UX-03] Context Compaction Interrupts Flow — Need Compact Skill Output

**Component:** All skills (verbose output)
**Context:** Triviapp-pd session required manual resumption after compaction

**Observation:**

Session summary: *"Sesión continuada desde una conversación previa que se quedó sin contexto."*

Context compaction interrupts workflow:
- Skills generate verbose output (progress logs, explanations, proposals)
- Consumes context rapidly
- Compaction forces session restart, user must summarize manually
- Loss of momentum, frustration

**User impact:**
- Workflow interrupted mid-task
- Manual resumption required (read MEMORY.md, understand state)
- Lost time explaining context to new session

**Proposal: Compact Skill Output — Preserve Context Longer**

**Reduce verbosity across all skills:**

**Current output (verbose):**
```
Processing Phase 2: Extract atomic observations...
Reading EXTRACTIONS.md (315 lines)...
Found section 1: 00_requerimiento_original.md (37 claims)
Processing claims 1-37...
  Claim 1: "Destello (sparkle), sonido agudo..."
  Claim 2: "Barra de progreso visual..."
  ...
Created insight IG-01: Feedback Dopaminico
Created insight IG-02: ...
Total: 35 insights created from 220 claims.
```

**Proposed output (compact):**
```
Phase 2: Atomic Insights
✓ Processed 220 claims → 35 insights created
[View details in INSIGHTS_GRAPH.md]
```

**Principles:**
- Progress indicators: concise (emoji + summary)
- Details: defer to output files (INSIGHTS_GRAPH.md, CONFLICTS.md)
- Proposals: structured, minimal (not essay-style)
- Logging: essential only (skip intermediate steps)

**Benefits:**
- ✅ Longer context preservation (fewer compactions)
- ✅ Faster skill execution (less output generation)
- ✅ User reads dashboard, not chat logs
- ✅ Interruptions minimized

**Acceptance criteria:**
- Skill output ≤50% of current verbosity
- Context compaction frequency reduced by 30%+
- User can complete small project (11 files) without compaction

---

## 🏗️ ARCHITECTURAL NOTES

### [QA3-ARCH-XX] Title

**Category:** Enhancement / Refactor / Technical debt

**Observation:**
[What was noticed about the architecture]

**Implications:**
[What this means for future work]

**Proposal:**
[If action needed]

---

## ✅ VALIDATED FIXES

### BL-23: Editorial Decisions Bug
**Status:** [PASS / FAIL / PARTIAL]
**Evidence:**
```
[Confirmation that fix worked]
```

### BL-24: PDF Fallbacks Not Used
**Status:** [PASS / FAIL / PARTIAL]
**Evidence:**
```
[Confirmation that fix worked]
```

### BL-27: SOURCE_MAP Corruption
**Status:** [PASS / FAIL / PARTIAL]
**Evidence:**
```
[Confirmation that fix worked]
```

### BL-28: Incremental /analyze
**Status:** [PASS / FAIL / PARTIAL]
**Evidence:**
```
[Confirmation that fix worked]
```

### BL-18: Synthesis Layer
**Status:** [PASS / FAIL / PARTIAL]
**Evidence:**
```
[Confirmation that fix worked]
```

---

## 📊 SESSION METRICS

| Metric | Value |
|---|---|
| Total duration | [time] |
| Context compactions | [count] |
| Tool calls | [count] |
| Files processed | [count] |
| Insights created | [count] |
| Ambiguities detected | [count] |
| Errors encountered | [count] |

---

## 🎯 SUMMARY

### What Worked
- [List successes]

### What Failed
- [List failures]

### What Needs Attention
- [List follow-ups]

### Recommended Actions
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

---

## 📝 RAW NOTES

### Extraction Phase (6 min elapsed)

**Setup:**
- ✅ Work layer reset complete (6 files)
- ✅ 61 source files discovered
- ✅ MD5 hashes computed
- ❌ markitdown not installed → using fallbacks (expected)

**Conversions:**
- ✅ 5 HEIC → JPG (sips conversion successful)
- ✅ 6 DOCX → TXT (textutil successful)
- ✅ 5 PPTX → TXT (Python zipfile successful)

**Parallel extraction:**
- ✅ Opus launched 2 Task agents for parallel folder extraction
- Agent 1: entrevistas folders
- Agent 2: Antecedentes folder
- Strategy: parallelization by folder (efficient)

**Duplicate detection:**
- ⚠️ 2 files share same MD5 hash (identical content):
  - notas_entrevista_COO_(segunda entrevista).md
  - reu_coo_roberto-catalan.md
- Note: Should be processed once or flagged?

**Multimodal reading:**
- ✅ Workshop photos being read directly (IMG_9679.jpg, IMG_9680.jpg visible)
- Can see sticky notes content in images (Spanish text visible)
- BL-23 validation: NO skips observed so far

**Current status:** 6/6 agents running in parallel, extraction in progress

---

### Context Limit Hit (6m 42s)

**All agents completed but hit context limit:**
- Agent 1 (entrevistas): ✅ Completed → Context limit
- Agent 2 (Antecedentes): ✅ Completed → Context limit
- Agent 3 (root+Propuesta+Vision): ✅ Completed → Context limit
- Agent 4 (Workshop 1 images pt1): ✅ Completed → Context limit
- Agent 5 (Workshop 1 images pt2): ✅ Completed → Context limit
- Agent 6 (Workshop 1 text): ✅ Completed → Context limit

**Permission issue discovered:**
- Agents 2, 3, 4 failed to read /tmp converted files (permission denied)
- Agents 1, 5 partial success (in-repo files only)
- Agent 6 full success (PNG images, no /tmp dependency)

**Strategy change:**
- Opus switched from parallel agents to direct extraction
- Reading 8 files in parallel directly → hit context limit immediately
- "Baked for 6m 42s" → context compaction event

**Status:** Extraction incomplete, context limit reached, compaction required

---

### CRITICAL: Compaction Failed (6m 42s+)

**Error:**
```
Error during compaction: Error: Conversation too long.
Press esc twice to go up a few messages and try again.
```

**Implication:**
- Context accumulated so much that even compaction cannot recover
- 61 files + 6 parallel agents + conversions = UNRECOVERABLE context state
- Pipeline BLOCKED, cannot proceed to /analyze
- **This is a hard limit for current architecture**

---

## 🔄 BL-29 Re-Test (2026-02-16, post-implementation)

**Test environment:** Fresh session, same TIMining 61 files

**Phase 1 Discovery:**
✅ 61 files detected
✅ **Batching activated:** "61 archivos > 40 → BATCHING ACTIVADO (5 lotes de ~12-15 archivos)"
✅ Source organization validation: 4 issues detected
✅ 54 processable files (7 videos excluded as unsupported)
✅ Clean state (no previous extractions)
✅ Fallback tools: markitdown unavailable → textutil/Python stdlib

**Status:** Waiting for user approval to proceed with batched extraction...

---

### Batch Execution Results:

**✅ What worked:**
- Batching activated: "Lote 1/5" detected correctly
- Intermediate writes: 2 successful checkpoints
  - After 4 md files → Wrote EXTRACTIONS.md (170 lines, 131 claims)
  - After 4 png files → Updated EXTRACTIONS.md (+105 lines, 73 claims)
- 02_Work/_temp directory created
- Conversions: textutil (DOCX) + Python (PPTX) working
- Progress logging: "Procesando X — Y% (N/M archivos)"

**❌ What failed:**
- Context limit reached at **6m 1s** (similar to 6m 42s pre-BL-29)
- Failed while processing batch 1, file 9-10 (reading 2 PDFs)
- Only 8/15 files in batch 1 completed before failure

**Progress achieved:**
- 8 files successfully extracted (4 md + 4 png)
- 204 claims extracted (131 + 73)
- 2 folders complete: entrevistas operaciones/, entrevistas iniciales stakeholders/
- 1 folder partial: Antecedentes/ (4/7 files, stopped on PDFs)

**Root cause analysis:**
- Batch size 15 is still too large when PDFs are involved
- PDFs are context-expensive (large text content)
- 4 md + 4 png + 4 converted files + 2 PDFs = context overflow
- Intermediate writes help but don't prevent accumulation within a batch

