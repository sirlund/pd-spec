# QA v4 Test Plan — v4.12.0

> Created: 2026-02-18. Updated: 2026-02-20 (added BL-41 + BL-43 with real TIMining transcripts).
> Version under test: v4.12.0
> Scope: BL-43 (Smart Source Preprocessing), BL-41 (State Management), BL-37/36/31/32 (v4.8 features)

## Setup

```bash
# QA worktree
cd ~/Dev/repos/pd-spec
git worktree add ../pd-spec--qa qa 2>/dev/null
cd ../pd-spec--qa && git merge main -m "engine update to v4.12.0"

# Copy TIMining sources as project base
cp -R ~/Dev/repos/pds--timining/01_Sources/* 01_Sources/

# Copy Camila transcripts from _temp (not in 01_Sources/)
mkdir -p 01_Sources/sesiones-camila/
cp ~/Dev/repos/pds--timining/02_Work/_temp/session-align-con-camila\(wed18feb\).md 01_Sources/sesiones-camila/
cp ~/Dev/repos/pds--timining/02_Work/_temp/reunion_camila_2026-02-17.md 01_Sources/sesiones-camila/
```

### Source inventory for BL-43 tests

| File | Location (in QA) | Noise Level | Phase 1.5? | Test Role |
|---|---|---|---|---|
| `Workshop 1/transcript.md` | `01_Sources/Workshop 1/` | **Extreme** — multi-speaker, garbled phonetics, run-on, crosstalk, no speaker IDs | YES (content heuristic) | Primary BL-43 test |
| `session-align-con-camila(wed18feb).md` | `01_Sources/sesiones-camila/` | **Medium** — 2-person Granola (Me/Them), some STT artifacts | YES (metadata or heuristic) | Secondary BL-43 test |
| `reunion_camila_2026-02-17.md` | `01_Sources/sesiones-camila/` | **None** — clean structured notes | NO | Negative test (must NOT trigger) |
| [NEW: Nicolas transcript from yesterday] | TBD — ask user | TBD | YES | Optional third test |

### _CONTEXT.md for sesiones-camila/

```markdown
# Context: Sesiones de Trabajo con Camila Bonilla

- Date: 2026-02-17 to 2026-02-18
- Type: workshop
- Source Type: transcript
- Participants: Nlundin, Cbonilla
- Context: Working sessions for TIMining UX deliverables alignment

## Files

| File | Format | Description |
|---|---|---|
| session-align-con-camila(wed18feb).md | text | Granola.ai transcript — UX presentation alignment, 2 speakers |
| reunion_camila_2026-02-17.md | text | Clean meeting notes (NOT a transcript — structured by Nicolas) |
```

**Note:** `reunion_camila_2026-02-17.md` is labeled `Source Type: transcript` at the folder level but is actually clean notes. This creates an interesting test: will Phase 1.5 detect it via metadata, scan its content, and correctly determine it doesn't need preprocessing? (Content heuristic should override metadata signal — no STT patterns in first 50 lines.)

### Workshop 1 transcript — known corrections to verify

These are confirmed phonetic errors in `Workshop 1/transcript.md` that Phase 1.5 should catch:

| Original | Expected | Context |
|---|---|---|
| eagenox, ID Max, EDmax | IDEMAX | Consultancy name |
| ciefo | CFO | Role |
| quei piai / KPI | KPI | Metric |
| em vi pi | MVP | Product term |
| benmarquin | benchmark | UX method |
| iú ai | UI | Design term |
| iú ex | UX | Design term |
| riact | React | Tech framework |
| taimlain | timeline | Planning term |
| steicolders | stakeholders | Role |
| bac en | backend | Tech term |
| chai | AI | Technology |

Speaker detection should identify at least:
- Felipe (CEO/founder — "por eso le por eso va el")
- Alejandro Guzzoni (listed participant)
- Cbonilla (listed participant)
- Hmunoz (listed participant)
- Nlundin / Me (IDEMAX facilitator)

---

## Test Matrix — BL-43 Smart Preprocessing (v4.12)

### Detection Tests

| # | Test | Source | Action | Verify |
|---|---|---|---|---|
| T23 | Content heuristic detection | `Workshop 1/transcript.md` (no `Source Type: transcript` in metadata) | `/extract "Workshop 1"` | Phase 1.5 activates via content heuristic (timestamps `[00:xx:xx]`, speaker labels, STT patterns in first 50 lines) |
| T24 | Metadata detection | `sesiones-camila/` (`_CONTEXT.md` has `Source Type: transcript`) | `/extract sesiones-camila` | Phase 1.5 activates via metadata signal for both files in folder |
| T25 | Clean file skip | `reunion_camila_2026-02-17.md` (clean notes, despite folder-level transcript metadata) | Same as T24 | Content heuristic overrides: no STT patterns → skip preprocessing for this file. Only `session-align-con-camila` gets preprocessed |
| T26 | No-candidate folder | Any clean markdown folder (e.g., `Antecedentes/`) | `/extract Antecedentes` | Log: `ℹ️ No preprocessing candidates detected`. Jumps directly to Phase 2 |

### Normalization Quality Tests (Workshop 1)

| # | Test | Verify |
|---|---|---|
| T27 | Speaker detection — segmentation | Quality report shows speaker segments separated by turn boundaries (timestamps, "Me:", speaker changes) |
| T28 | Speaker detection — identification | Speaker table maps to known participants (Felipe, Guzzoni, Cbonilla, Hmunoz, Nlundin). At least 3 identified with `high` or `medium` confidence |
| T29 | Phonetic correction — project terms | Corrections table includes: eagenox→IDEMAX, ciefo→CFO, quei piai→KPI, em vi pi→MVP, benmarquin→benchmark. All marked `high` confidence |
| T30 | Phonetic correction — tech terms | Corrections table includes: iú ai→UI, iú ex→UX, riact→React, taimlain→timeline, steicolders→stakeholders, bac en→backend |
| T31 | Sentence repair | Repairs summary shows: run-on sentences split (the transcript has massive unbroken paragraphs), incomplete sentences marked `[incomplete]`, crosstalk marked `[crosstalk]` |
| T32 | No invention | Normalized text does NOT add content that wasn't in the original. `[unintelligible]` used for unrecoverable passages, NOT guesses |

### Approval Flow Tests

| # | Test | Action | Verify |
|---|---|---|---|
| T33 | Approve | Accept preprocessing for Workshop 1 | Normalized file at `02_Work/_temp/transcript_normalized.md`. Original in `01_Sources/` untouched |
| T34 | Skip | Choose "Skip" for Camila session | No normalized file. Phase 2 reads original. No `Preprocessed: yes` in EXTRACTIONS.md section |
| T35 | Review individually | Choose "Review individually" for a file | Agent shows full diff. User can accept/reject individual corrections |

### Integration Tests

| # | Test | Verify |
|---|---|---|
| T36 | Phase 2 redirect | After approving T33: EXTRACTIONS.md section header = `## [Workshop 1/transcript.md]` (original path). Metadata includes `- Preprocessed: yes`. Claims from normalized content |
| T37 | MEMORY stats | MEMORY.md entry for /extract includes `Preprocessing: N files (M speakers, P corrections)` line |
| T38 | Non-candidate unaffected | In same /extract run: clean markdown sources have no `Preprocessed` line, no redirect, normal extraction |

---

## Test Matrix — BL-41 State Management (v4.11)

### Intra-Session Tests

| # | Test | Setup | Action | Verify |
|---|---|---|---|---|
| T39 | MEMORY write | `/seed` + `/extract` | Inspect `02_Work/MEMORY.md` | Entry with ISO timestamp, Stats block, Snapshot line. Correct claim counts match EXTRACTIONS.md |
| T40 | CHECKPOINT write | After T39 | Inspect `02_Work/_temp/SESSION_CHECKPOINT.md` | Quantitative Snapshot present. Source/extraction/insight/conflict counts correct. Last skill = `/extract` |
| T41 | CHECKPOINT overwrite | Run `/analyze` after T39 | Inspect SESSION_CHECKPOINT.md | Previous /extract snapshot replaced. Now shows /analyze as last skill. Insight + conflict counts updated |
| T42 | MEMORY append | After T41 | Inspect MEMORY.md | Two entries: /extract + /analyze. Chronological order. Both have Snapshot lines |
| T43 | MEMORY compaction | Pad MEMORY.md to >80 lines (add dummy entries), then run `/synthesis` | Inspect MEMORY.md | File <80 lines. `## Historical Summary` section at top. 3 most recent entries in full below |
| T44 | Stale checkpoint detection | Edit INSIGHTS_GRAPH.md manually (add fake `[IG-99]`). Run any skill | Check agent output | Agent reports snapshot divergence: "checkpoint shows X insights, file shows X+1" |

### Cross-Session Tests (require new conversations)

| # | Test | Pre-condition | Action | Verify |
|---|---|---|---|---|
| T45 | Recovery from checkpoint | T41 completed, SESSION_CHECKPOINT.md exists with fresh counts | Start new session, run any skill | Agent reads SESSION_CHECKPOINT.md first (1 read). Resumes without asking "what were we doing?" |
| T46 | Recovery from MEMORY | Delete SESSION_CHECKPOINT.md manually | Start new session | Agent falls back to MEMORY.md. Reports checkpoint missing. Still recovers context |
| T47 | Post-compaction recovery | T43 completed (MEMORY compacted) | Start new session without checkpoint | Agent reads compacted MEMORY.md (~80 lines). Historical summary provides enough context |

---

## Test Matrix — BL-37/36/31/32 (from v4.8)

| # | BL | Test | Command | Verify |
|---|---|---|---|---|
| T48 | BL-37 | AI source detected | Create `01_Sources/ai-reports/_CONTEXT.md` with `Source Type: ai-generated` + 1 md file. `/extract ai-reports` | EXTRACTIONS.md shows `⚠️ AI-GENERATED`. Each claim ends in `[AI-SOURCE]` |
| T49 | BL-37 | AI analysis | `/analyze` after T48 | Insights from AI claims have `voice: ai`, `authority: hypothesis`. Never `fact` or `direct-quote` |
| T50 | BL-37 | Verification gate | Try to verify AI-only insight via `/synthesis` | Cannot reach VERIFIED without non-AI corroboration |
| T51 | BL-36 | Flag for discussion | `/synthesis` → choose "Flag for discussion" | CONFLICTS.md shows `Status: PENDING — Flagged (context)` |
| T52 | BL-36 | Research needed | `/synthesis` → choose "Needs more research" | CONFLICTS.md shows `Status: PENDING — Research (context)` |
| T53 | BL-36 | Dashboard badges | `/analyze` (regenerates STATUS.html) after T51/T52 | Dashboard shows amber "Flagged" + blue "Research" badges |
| T54 | BL-31 | Express default | `/extract` (no flags) on project with md+pdf | Only light files processed. PDFs in SOURCE_MAP as `pending-heavy`. Report: `⚡ Express` |
| T55 | BL-31 | Heavy-only | `/extract --heavy` after T54 | Only `pending-heavy` files processed. Report: `✓ Heavy pass` |
| T56 | BL-31 | Full override | `/extract --full` on clean project | Processes everything (light + heavy) |
| T57 | BL-32 | Auto express small | `/analyze` on small project (<30 files, <500 claims) | Log `⚡ Express`. Phase 3 skipped |
| T58 | BL-32 | Full override | `/analyze --full` on same project | Full synthesis (Phase 3 active) |
| T59 | BL-32 | Large project | `/analyze --full` on full TIMining | Synthesis activates automatically |

---

## Regression Scenarios

| # | Risk | Test |
|---|---|---|
| R1 | Express + incremental delta | `/extract` express → edit 1 light file → `/extract` again → only re-processes modified |
| R2 | Heavy-only without prior express | `/extract --heavy` without express first → reports "No heavy files pending" |
| R3 | Non-AI source unaffected | `/extract` on folder without `source_type: ai-generated` → claims without `[AI-SOURCE]` |
| R4 | Dashboard backward compat | STATUS.html with pre-v4.8 JSON → no crash |
| R5 | Preprocessing + Express mode | Transcript is `.md` (light file). Express mode still triggers Phase 1.5 |
| R6 | Preprocessing + incremental | `/extract` with transcript → modify transcript → `/extract` again → re-preprocesses + re-extracts |
| R7 | MEMORY compaction preserves recent | After compaction, 3 most recent entries intact |
| R8 | Checkpoint survives /reset --work | `/reset --work` clears _temp/ (including checkpoint). Next session falls to MEMORY |
| R9 | Preprocessing with --full flag | `/extract --full` on project with transcripts → Phase 1.5 still runs (not skipped by --full) |
| R10 | Massive transcript | Workshop 1 transcript (~120KB) → Phase 1.5 handles without timeout. Quality report manageable |

---

## Execution Order

**Phase A — BL-43 Preprocessing (highest risk, new feature)**
1. T26 (no-candidate baseline)
2. T23-T25 (detection: heuristic, metadata, clean-skip)
3. T27-T32 (normalization quality on Workshop 1)
4. T33-T35 (approval flow)
5. T36-T38 (integration)
6. R5-R6, R9-R10 (regressions)

**Phase B — BL-41 State Management**
7. T39-T42 (basic writes: MEMORY + CHECKPOINT)
8. T43 (compaction)
9. T44 (staleness detection)
10. R7-R8 (regressions)

**Phase C — BL-37/36/31/32 (v4.8 features)**
11. T48-T50 (AI source validation)
12. T54-T56 (express mode)
13. T57-T59 (auto express analyze)
14. T51-T53 (conflict intermediate states)
15. R1-R4 (regressions)

**Phase D — Cross-Session (separate conversations)**
16. T45 (checkpoint recovery)
17. T46 (MEMORY fallback)
18. T47 (compacted MEMORY recovery)

## Success Criteria

- 47/47 tests pass (T23-T59 + cross-session T45-T47 when applicable)
- 10/10 regressions clean
- No phantom insights (Mandate #1)
- Express mode never silently loses files
- Preprocessing never modifies 01_Sources/ (read-only)
- Preprocessing skips cleanly when no candidates
- Workshop 1 phonetic corrections ≥10 of the 12 known errors
- Workshop 1 speaker identification ≥3 of 5 known speakers
- MEMORY stays under 80 lines after compaction
- Checkpoint recovery uses 1 read max
- Findings documented in `docs/qa/QA_V4_FINDINGS.md`

## Rules

- Observe, don't fix — document in QA_V4_FINDINGS.md
- Real TIMining sources (copied to QA worktree)
- Cross-session tests (T45-T47) require separate conversations
- Each test gets a PASS/FAIL + notes in findings doc
- If a test reveals a bug, log it but do NOT fix mid-QA
