# QA v5 Findings — v4.13.0

> Started: 2026-02-21
> Version under test: v4.13.0
> Scope: BL-49 (oversized lines), BL-50 (Pass C enforcement), BL-45 (mid-skill checkpoints)
> Worktree: pd-spec--qa (qa branch)

## Pre-Test State

- SOURCE_MAP reset to empty (full re-extraction)
- EXTRACTIONS.md reset to empty
- INSIGHTS_GRAPH.md + CONFLICTS.md preserved from QA v4
- Engine merged from main (v4.13.0) into qa branch

## Test Results

> Tests in progress — results added as phases complete.

### Phase 1: Discovery + Cost Gate

| Test | Status | Notes |
|---|---|---|
| T60 (BL-49: oversized detection) | PASS | `⚠️ Oversized lines detected: Touchpoint (9603 chars/line)` — exact log from step 5b |
| T66 (BL-45: checkpoint >10 files) | PASS | `💾 Writing preventive checkpoint` after Phase 1. Checkpoint contains: phase, mode, file queue, preprocessing candidates, oversized flags, resume instruction |
| R11 (express mode) | PASS | 43 light files processed, 16 heavy deferred as pending-heavy |
| R13 (Phase 1.5 A+B) | PASS | Speaker detection (2 speakers in Camila, high confidence) + phonetic corrections (15 corrections) functional |

### Phase 1.5: Preprocessing

User choices:
- **Camila**: Aprobar (full — speaker IDs + phonetics + sentence repair)
- **Workshop transcript**: Solo phonetics (speaker detection infeasible)
- **Touchpoint**: Solo phonetics (speaker detection infeasible)

Agent approach: Built a single Python regex script (`preprocess.py`, 115 lines) for all 3 files. Script described as "phonetic corrections + speaker labels." Applied mechanically to all files.

| Test | Status | Notes |
|---|---|---|
| T63 (BL-50: Pass C extreme noise — Workshop) | NOT TESTED | User chose "Solo phonetics" — Pass C not requested for this file |
| T64 (BL-50: Pass C medium noise — Camila) | FAIL | User chose "Aprobar" with explicit sentence repair. 0 `[incomplete]`/`[crosstalk]`/`[unintelligible]` markers in normalized file. Pass C silently skipped. |
| T65 (BL-50: order A→B→C) | FAIL | Pass C never executed. Only testable on Camila (the only file approved with full preprocessing), and it was skipped. |
| T62 (BL-49: oversized cleared post-normalization) | FAIL | Workshop: 16→16 lines. Touchpoint: 14→14 lines. Normalization did not break oversized lines — only applied regex phonetic substitutions in-place. |

Evidence:
```
$ grep -c '\[incomplete\]\|\[crosstalk\]\|\[unintelligible\]' 02_Work/_temp/*_normalized.md
session-align-con-camila_normalized.md: 0
transcript_normalized.md:               0
Touchpoint_normalized.md:               0

$ wc -l 02_Work/_temp/*_normalized.md
  479  session-align-con-camila_normalized.md  (was 479 — unchanged)
   16  transcript_normalized.md                (was 16 — still oversized)
   14  Touchpoint_normalized.md                (was 14 — still oversized)
```

### Phase 2: Extraction

Batch 1: 7 small markdown files → 118 claims ✓
Batch 2: 5 large markdown files (including 3 preprocessed transcripts) → 119 claims ✓
Batch 3-5: 31 images (26 PNG + 5 HEIC→JPG) → 47 claims ✓
**Total: 43 files, 284 claims. Validation passed (43 sections = 43 light files).**
3 context compactions survived during extraction. Agent now in Phase 4 (SOURCE_MAP update + MEMORY + final checkpoint).

| Test | Status | Notes |
|---|---|---|
| T60 (BL-49: byte-range reads in Phase 2) | PASS | Agent used `head -c 25000` / `tail -c 10000` for both oversized files (transcript + Touchpoint). Read tool NOT used. Claims successfully extracted from byte-range chunks. |
| T61 (BL-49: normal files no oversized flag) | PASS | 41 non-oversized light files processed with standard Read tool. No Bash fallback, no oversized-lines log for normal files. |
| T68 (BL-45: batch-boundary checkpoints) | FAIL | No SESSION_CHECKPOINT updates observed between Batch 1→2 or Batch 2→3. The spec says "ALSO update SESSION_CHECKPOINT" after each batch write. |

Evidence for T60:
```
Bash(head -c 25000 ".../_temp/transcript_normalized.md")
Bash(tail -c 10000 ".../_temp/transcript_normalized.md")
Bash(head -c 25000 ".../_temp/Touchpoint_normalized.md")
Bash(tail -c 10000 ".../_temp/Touchpoint_normalized.md")
```

Note: Agent read NORMALIZED versions from `_temp/`, not originals from `01_Sources/`. Since normalization did not fix oversized lines (BUG-02), byte-range reads were still necessary.

### Post-Extract Verification

| Test | Status | Notes |
|---|---|---|
| R14 (final checkpoint at skill completion) | PASS | SESSION_CHECKPOINT.md overwritten with: skill=/extract, completed=2026-02-21T16:00, mode=Express, result=43 files/284 claims/16 pending-heavy, quantitative snapshot, next steps. |
| T71 (checkpoint recovery) | PASS | Checkpoint contains: project context, quantitative snapshot (sources/extractions/insights/conflicts), preprocessing notes, clear resume instructions ("Next Steps: /extract --heavy, /analyze"). Actionable for a new session. |

### /analyze

| Test | Status | Notes |
|---|---|---|
| T69 (BL-45: /analyze checkpoint >15 sections) | PASS | Two checkpoints observed: (1) cost gate after Phase 1: `💾 Preventive checkpoint written (43 sections, 284 claims)` — exact spec format; (2) analysis checkpoint after Phase 2: SESSION_CHECKPOINT updated with "Phase 2 complete — analysis draft ready", 2 new insights, 0 new conflicts, resume instruction. Both match BL-45 spec (4C + 4D). |
| R12 (incremental mode) | PASS | Agent detected incremental mode: "last /analyze at 2026-02-20T17:30, all 43 sections newer → processing all 43." Technically incremental (checked timestamps), but processed all because every section is newer than last analyze. Correct behavior. |

Analysis output: 284 claims → 282 map to existing insights (strong convergence), 2 new atomic insights (IG-23 brand architecture, IG-24 Aware perception). 0 new conflicts. All 20 VERIFIED insights confirmed by light files. Express mode (no synthesis).

Final report: 48 insights, 12 conflicts, 5 evidence gaps. Dashboard generated (STATUS.html, 80KB). MEMORY + checkpoint written. 5 context compactions survived across /extract + /analyze.

### Negative Tests (not executed)

| Test | Status | Notes |
|---|---|---|
| T67 (BL-45: no checkpoint ≤10 files) | SKIPPED | Requires a project with ≤10 files. TIMining has 64 files — cannot test with this dataset. |
| T70 (BL-45: /analyze small project <15 sections) | SKIPPED | Requires <15 sections. TIMining has 43 — cannot test with this dataset. |

---

## Observations

### OBS-01: Workshop transcript also oversized

The QA plan (T60) only anticipated Touchpoint as oversized. Workshop 1/transcript.md was also flagged: 16 lines, 3769 chars/line (>2000 threshold). The engine correctly detected both files. This is valid behavior — the threshold works as designed.

### OBS-02: Real compaction recovery (BL-45 production test)

Context compaction occurred at 1m52s into the extraction — before Phase 2 started. The agent:
1. Re-read SESSION_CHECKPOINT.md (primary recovery)
2. Read SOURCE_MAP.md to verify state
3. Read MEMORY.md as fallback context
4. Correctly resumed from Phase 1.5 (not Phase 1)
5. Did not repeat discovery

This is a **real production test** of BL-45, not a simulated one. The checkpoint worked exactly as designed.

### OBS-03: Checkpoint log format mismatch (cosmetic)

Spec says: `💾 Preventive checkpoint written (${file_count} files, ${est_size}KB)`
Actual: `💾 Writing preventive checkpoint + converting HEIC files + populating pending-heavy entries.`

Functional behavior correct; log message bundles multiple actions instead of matching the spec format exactly. Not a bug — the checkpoint content is correct and actionable.

### OBS-04: 1M context window reduces impact of performance optimizations

With Sonnet 4.6's 1M token context window, several v4.13.0 features shift from "survival mechanisms" to "cost optimizations":

| Feature | Impact with 1M context |
|---|---|
| **BL-45 checkpoints** | Compaction occurs much later → preventive checkpoints rarely trigger. Shifts from safety-critical to cost optimization. |
| **BL-29 batching** | More state fits in memory without loss. Batching still saves cost but less critical for correctness. |
| **SESSION_CHECKPOINT** | Less needed for recovery if conversation rarely compacts. |
| **BL-49 oversized lines** | **Still critical** — Read tool has its own line-length limit (~2000 chars). This is a tool limitation, not a context limitation. |
| **Express mode** | Still saves cost and time — 1M available ≠ 1M free to use. |
| **Phase 1.5 preprocessing** | Input quality → output quality. Unaffected by context size. |
| **BL-22 RAG** | Even less necessary — more content fits in direct context. |

**Architectural implication:** Quality-focused features (BL-44 Source Authority, BL-46 Speaker Attribution) deliver more value than additional performance optimizations. Backlog prioritization should shift accordingly.

### OBS-05: QA pipeline lacks formalized observation protocol

Current QA process has an objectivity gap: in QA v2-v4, the same agent that executed skills also wrote findings — effectively grading its own test. In QA v5, we improved this by having the executing agent in one terminal and an observer in another, but the process is manual (copy-paste output).

**Proposed formalized pipeline:**
1. **PLAN** — write test plan on main (`docs/qa/QA_V{N}_PLAN.md`)
2. **SETUP** — merge main → QA worktree
3. **EXECUTE** — run skills in QA worktree (agent unaware it's being tested)
4. **OBSERVE** — capture output (logs, files, checkpoints) — currently manual
5. **EVALUATE** — compare against test matrix
6. **DOCUMENT** — write findings on main (`docs/qa/QA_V{N}_FINDINGS.md`)

**Key insight:** The executing agent should NOT write findings. Separation of execution and evaluation improves objectivity. Steps 3-4 are the bottleneck — no automated log capture yet.

### OBS-06: Three real compaction recoveries in one QA session

Context compaction occurred 3 times during QA v5 execution (2 during /extract, 1 during /analyze). All three recovered correctly via SESSION_CHECKPOINT:

| # | Skill | Phase when compacted | Recovery action | Repeated work? |
|---|---|---|---|---|
| 1 | /extract | Before Phase 2 | Re-read checkpoint → resumed from Phase 1.5 | No |
| 2 | /extract | Mid-Phase 2 (images) | Re-read checkpoint → continued extraction | No |
| 3 | /analyze | Phase 4b (Research Brief) | Re-read checkpoint → skipped to Phase 5 (dashboard) | No |
| 4 | /analyze | Phase 5 (dashboard JSON build) | Re-read checkpoint + all state files → retry dashboard | No (but dashboard template read repeated) |
| 5 | /analyze | Phase 5 (dashboard JSON build, 2nd attempt) | Re-read checkpoint → used Python script to build JSON externally instead of in-context | No — adapted strategy, built 31KB JSON via `/tmp/build_status_json.py` |

This is the strongest production evidence for BL-45. Preventive checkpoints written at cost gates were read back successfully after compaction. The "Phase 2 complete — analysis draft ready" checkpoint in /analyze contained the exact resume instruction the agent needed.

### OBS-07: Dashboard generation is a compaction trap — Python external build as escape hatch

The STATUS.html dashboard requires building ~31KB of JSON from 48 insights + 12 conflicts + 8 source folders + system map. The agent must: (1) read all state files (~1200 lines total), (2) read the template (1377 lines), (3) build JSON, (4) write the combined output (~80KB). Steps 1-3 consistently filled the context window before step 4 could execute, causing a compaction loop (compactions #4 and #5).

**Escape:** On the 3rd attempt, the agent adapted — instead of building JSON in conversation context, it wrote a Python script to `/tmp/build_status_json.py` that parsed the state files and output valid JSON. The script ran externally (Bash), producing 31KB of JSON without consuming conversation context. Then a second Python one-liner injected it into the template.

**Implication for BL-33:** If the dashboard moves to MCP delivery, the JSON-build step should always be external (Python/Node script) rather than in-context. This is a fundamental architectural constraint for any operation that transforms large structured data.

### OBS-08: RAM vs HDD — why observers survive compaction without checkpoints

The observer terminal survived context compaction without a SESSION_CHECKPOINT. The executing agent cannot. The difference is **state type**:

- **Executing agent** = procedural state in "RAM" (conversation context): batch 3/5, files X,Y,Z done, A,B,C remaining, 118 claims so far. When context compacts, this state is lossy-compressed into a narrative summary. SESSION_CHECKPOINT writes structured state to "HDD" (disk) so recovery is lossless.
- **Observer** = narrative state. A conversation summary captures narrative well. Plus, findings are written to disk incrementally (`QA_V5_FINDINGS.md`), so disk already has the truth.

**Implication:** SESSION_CHECKPOINT is most valuable when the agent holds structured, procedural state that a narrative summary would lose. For read-heavy or narrative workflows, the automatic compaction summary is sufficient.

### OBS-09: Agent uses Python regex script for all preprocessing

Improvement over QA v4 (which used sed one-liners): the agent now creates a structured Python script. However, it's still a mechanical approach — regex substitutions only. The script handles Pass A (speaker labels) and Pass B (phonetics) adequately, but Pass C (sentence repair) requires semantic understanding that regex cannot provide.

The BL-50 constraint explicitly lists "sed, awk, regex" as prohibited for Pass C. Python regex is mechanically equivalent. The spec should also list "Python regex/re module" to close the loophole.

### OBS-10: Normalization does not break oversized lines

The preprocessing script applies phonetic corrections in-place without reformatting line structure. Files with oversized lines (>2000 chars/line) remain oversized after "normalization." This means:
- The `oversized-lines` flag is never cleared by preprocessing
- Phase 2 must use byte-range reads even for preprocessed files
- The spec should clarify: normalization SHOULD break oversized lines into proper paragraphs/sentences as part of the process, regardless of which passes are applied

---

## Bugs

### BUG-01: Pass C silently skipped when user approves full preprocessing (BL-50)

**Severity:** Medium
**Reproduction:** User approves Camila session with option "Aprobar (Recomendado)" which explicitly includes "sentence repair." Agent builds a single Python regex script for all files, applies phonetic corrections only, declares "Preprocessing complete," and moves to Phase 2. No LLM pass for sentence repair.
**Expected:** After mechanical Passes A+B, agent reads back the corrected content and applies Pass C as a separate LLM analysis pass, adding `[incomplete]`, `[crosstalk]`, `[unintelligible]` markers.
**Actual:** 0 Pass C markers in any normalized file. Pass C completely skipped.
**Root cause:** The BL-50 constraint exists in the spec but the agent treats all preprocessing as a single mechanical step. The instruction to do Pass C as "a separate step, not part of the sed pipeline" is not strong enough — the agent interprets the whole preprocessing as one operation.

### BUG-02: Normalization does not fix oversized lines (BL-49 interaction)

**Severity:** Low-Medium
**Reproduction:** Workshop transcript (16 lines, 3769 chars/line) and Touchpoint (14 lines, 9603 chars/line) are preprocessed with "Solo phonetics." Normalized files retain identical line counts.
**Expected:** Normalization should at minimum break lines at sentence boundaries to make files readable by the Read tool.
**Actual:** Lines unchanged. Files remain oversized after preprocessing.
**Root cause:** Python script does `re.sub()` on existing content without reformatting line structure. No line-breaking logic exists in the preprocessing pipeline.

### BUG-03: No batch-boundary checkpoint updates during Phase 2 (BL-45)

**Severity:** Low
**Reproduction:** 43 files processed in 5 batches. SESSION_CHECKPOINT.md was written after Phase 1 (cost gate) but never updated between batches during Phase 2.
**Expected:** After each batch write to EXTRACTIONS.md + SOURCE_MAP.md, also update SESSION_CHECKPOINT with "Phase 2 — batch N/total", files processed so far, files remaining, claims count, resume instruction.
**Actual:** No checkpoint updates between batches. Two context compactions occurred during extraction; recovery relied on the Phase 1 checkpoint (which was sufficient but lacked Phase 2 progress).
**Root cause:** The batch-boundary checkpoint instruction was added to the existing "Write checkpoint after batch" step in the skill, but the agent only wrote to EXTRACTIONS.md and SOURCE_MAP.md — not SESSION_CHECKPOINT.

---

## Final Summary

### Score

| Category | PASS | FAIL | NOT TESTED | SKIPPED |
|---|---|---|---|---|
| BL-49 (oversized lines) | 3 (T60 detect, T60 byte-range, T61) | 1 (T62 normalization) | — | — |
| BL-50 (Pass C enforcement) | 0 | 2 (T64 skipped, T65 order) | 1 (T63) | — |
| BL-45 (mid-skill checkpoints) | 3 (T66, T69, T71) | 1 (T68 batch-boundary) | — | 2 (T67, T70) |
| Regressions | 4 (R11, R12, R13, R14) | 0 | — | — |
| **Total** | **10** | **4** | **1** | **2** |

### Verdict by BL

| BL | Verdict | Notes |
|---|---|---|
| **BL-49** | PARTIAL | Detection works perfectly. Byte-range reads work perfectly. But normalization doesn't clear the oversized flag (BUG-02). |
| **BL-50** | FAIL | Pass C was never executed. The constraint text exists but is not strong enough to override the agent's tendency to treat preprocessing as one mechanical step (BUG-01). Needs stronger enforcement — possibly a separate Phase 1.5c with explicit "Read back content and apply LLM sentence repair" instruction. |
| **BL-45** | PARTIAL | Cost gate checkpoints work (Phase 1 in both /extract and /analyze). Analysis checkpoint works (Phase 2 complete). But batch-boundary checkpoints in Phase 2 were not written (BUG-03). 5 real compaction recoveries demonstrate production value. |
| **Regressions** | CLEAN | All 4 passed. Express mode, incremental analyze, Phase 1.5 A+B, final checkpoint. |

### Compaction Resilience

5 context compactions occurred during this QA session (2 in /extract, 3 in /analyze). All recovered successfully via SESSION_CHECKPOINT. The dashboard JSON build caused a compaction loop (2 cycles) that the agent broke by switching to an external Python script. This is the strongest production evidence for BL-45 to date.

### Recommendations

1. **BL-50 fix (P1):** Add explicit Phase 1.5c step: "After mechanical preprocessing, READ the normalized file and APPLY Pass C as a separate LLM analysis pass. This is NOT optional when user approves full preprocessing. Add `[incomplete]`, `[crosstalk]`, `[unintelligible]` markers. Also list 'Python regex/re module' as prohibited for Pass C."
2. **BL-49 fix (P2):** Add line-breaking to normalization: "After phonetic corrections, if file has oversized-lines flag, break lines at sentence boundaries (`.` `?` `!` followed by space). Clear oversized-lines flag after normalization."
3. **BL-45 fix (P3):** Strengthen batch-boundary checkpoint instruction: "After writing batch N to EXTRACTIONS.md + SOURCE_MAP.md, IMMEDIATELY write to SESSION_CHECKPOINT.md with batch progress. This is a SEPARATE write operation, not part of the batch write."
4. **Dashboard architecture (BL-33):** Always build JSON via external script, not in-context. The 31KB JSON + 1377-line template exceeds practical in-context processing limits.
