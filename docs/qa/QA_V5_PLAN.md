# QA v5 Plan — v4.13.0

> Created: 2026-02-20
> Version under test: v4.13.0
> Scope: BL-49 (oversized lines fix), BL-50 (Pass C sentence repair enforcement), BL-45 (mid-skill checkpoints)

## Setup

```bash
cd ~/Dev/repos/pd-spec--qa
git merge main -m "engine update to v4.13.0"
# Sources should already exist from QA v4
```

## Source Inventory

| File | Location (in QA) | Characteristics | Test Role |
|---|---|---|---|
| `Touchpoint_TIMining-IDEMAX _2026-02-19.md` | `01_Sources/sesiones-idemax/` | 134KB, ~14 lines, ~10K chars/line | BL-49: oversized lines primary test |
| `session-align-con-camila(wed18feb).md` | `01_Sources/sesiones-idemax/` | Medium noise Granola transcript | BL-50: Pass C test (medium noise) |
| `Workshop 1/transcript.md` | `01_Sources/Workshop 1/` | Extreme noise, multi-speaker | BL-50: Pass C test (extreme noise) |
| Normal markdown files | Various folders | Proper line breaks | BL-49: negative test |
| Full TIMining project | `01_Sources/` | 59+ files | BL-45: checkpoint tests |

---

## Test Matrix — BL-49: Oversized Lines (3 tests)

| ID | Test | Expected | Verify |
|---|---|---|---|
| T60 | `/extract` on Touchpoint_TIMining (134KB, ~14 lines, ~10K chars/line) | Detects oversized-lines in Phase 1 step 5b, uses byte-range reads in Phase 2 | No Read tool errors, claims extracted, log shows `⚠️ Oversized lines detected` |
| T61 | `/extract` on normal file (proper line breaks) | No oversized-lines flag, normal Read tool used | Standard extraction, no Bash fallback, no oversized-lines log |
| T62 | `/extract` on preprocessed transcript (Phase 1.5 normalizes it) | oversized-lines flag cleared after normalization, Read used for normalized file | Normalized file has proper line breaks, Read tool works on normalized version |

---

## Test Matrix — BL-50: Pass C Sentence Repair (3 tests)

| ID | Test | Expected | Verify |
|---|---|---|---|
| T63 | `/extract` on Workshop 1 transcript (extreme noise) | Pass C runs as LLM pass (not sed), produces `[incomplete]`/`[crosstalk]`/`[unintelligible]` markers | Normalized file contains sentence repair markers |
| T64 | `/extract` on Camila session (medium noise) | Pass C markers where appropriate (may be few on cleaner transcript) | Markers present or "no repairs needed" logged |
| T65 | Verify Pass C runs AFTER Passes A+B | Normalized file shows speaker labels (A) + phonetic corrections (B) + sentence markers (C) in order | All three passes visible in output |

---

## Test Matrix — BL-45: Mid-Skill Checkpoints (6 tests)

| ID | Test | Expected | Verify |
|---|---|---|---|
| T66 | `/extract` on >10 files | Preventive checkpoint written after Phase 1 | SESSION_CHECKPOINT.md exists with file queue + resume instruction, log shows `💾 Preventive checkpoint written` |
| T67 | `/extract` on ≤10 files | No mid-skill checkpoint written | SESSION_CHECKPOINT.md not updated until skill completes |
| T68 | `/extract` with batching (>40 files) | Batch-boundary checkpoint after every 10 files | SESSION_CHECKPOINT.md shows progressive batch state (Phase 2 — batch N/total) |
| T69 | `/analyze` on >15 sections | Preventive checkpoint after Phase 1, analysis checkpoint after Phase 2 | Two checkpoint writes visible in SESSION_CHECKPOINT.md |
| T70 | `/analyze` on small project (<15 sections) | No mid-skill checkpoints | Checkpoint only at end |
| T71 | Checkpoint recovery: read SESSION_CHECKPOINT after simulated interruption | Contains resume_from, files_remaining, clear instructions for continuation | Checkpoint is actionable for a new session |

---

## Regression Scenarios (4 tests)

| ID | Risk | Test | Expected |
|---|---|---|---|
| R11 | /extract express mode still works | `/extract` (no flags) on project with light+heavy files | Express skips heavy files, logs correctly |
| R12 | /analyze incremental mode still works | `/analyze` after incremental extraction | Only processes new sections |
| R13 | Phase 1.5 Pass A+B still work (BL-43) | `/extract` on transcript source | Speaker detection + phonetic correction functional |
| R14 | SESSION_CHECKPOINT written at skill completion (BL-41) | Run any skill to completion | Final checkpoint exists with correct snapshot |

---

## Success Criteria

- 12/12 feature tests pass (T60-T71)
- 4/4 regressions clean (R11-R14)
- BL-49: zero Read tool errors on oversized files
- BL-50: at least 1 sentence repair marker per noisy transcript
- BL-45: checkpoint file size <2KB, contains actionable resume instructions

## Execution Order

1. Merge main into QA worktree
2. Run `/extract` on full TIMining sources (tests T60-T68, T63-T65, R11, R13)
3. Run `/analyze` (tests T69-T70, R12, R14)
4. Inspect checkpoints manually (T71)
5. Run small-project extract/analyze for negative tests (T61, T67, T70)

## Rules

- Observe, don't fix — document in QA_V5_FINDINGS.md
- Real TIMining sources (already in QA worktree from v4)
- Each test gets PASS/FAIL/PARTIAL/NOT TESTED + notes
- If a test reveals a bug, log it but do NOT fix mid-QA
