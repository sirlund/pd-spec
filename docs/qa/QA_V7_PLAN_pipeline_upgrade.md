# QA v7 Plan — Pipeline Upgrade v4.7 → v4.17.1

> Created: 2026-02-22
> Version under test: v4.17.1
> Scope: Real-project pipeline upgrade (TIMining), branch consolidation, Live Research App accuracy
> Context: Not a formal dual-terminal QA. Observations captured during production upgrade of TIMining project from engine v4.7 to v4.17.1.

## Setup

- **Project:** TIMining (UX research for mining operations platform)
- **Last processed:** v4.3 engine (2026-02-16), 54 sources, 1238 claims, 21 insights, 5 conflicts
- **Branches:** `project/timining` (2 IDEAS.md commits), `project/timining-entregables` (41 commits — pipeline + presentation deliverables)
- **New sources:** 3 sesiones-idemax transcripts (134KB, 78KB, 54KB) — 2 mislocated in `02_Work/_temp/`, 1 only in QA worktree
- **Engine gap:** ~15 versions of improvements (BL-43 preprocessing, BL-44 authority, BL-46 speaker attribution, BL-49 oversized lines, BL-50/51 Pass C, BL-33 Live Research App v2)

## Source Inventory

| File | Size | Location before upgrade | Characteristics |
|---|---|---|---|
| `reunion_camila_2026-02-17.md` | 78KB | `02_Work/_temp/` (entregables) | IDEMAX internal session, transcript |
| `session-align-con-camila(wed18feb).md` | 54KB | `02_Work/_temp/` (entregables) | IDEMAX alignment session, transcript |
| `Touchpoint_TIMining-IDEMAX _2026-02-19.md` | 134KB | QA worktree only | Joint stakeholder session, transcript |
| 54 existing sources | Various | `01_Sources/` (entregables) | Extracted at v4.3, no preprocessing |

---

## Fase 0: Branch Consolidation + Source Standardization

| ID | Test | Expected | Verify |
|---|---|---|---|
| T01 | Merge entregables → timining with `merge=ours` | Work layer files preserved from the branch with real content | `EXTRACTIONS.md` >1000 lines, `INSIGHTS_GRAPH.md` >400 lines |
| T02 | Merge main (v4.17.1) → timining | Engine files updated, project files preserved | App files present, skills updated, `02_Work/` intact |
| T03 | Move 2 transcripts from `_temp/` → `01_Sources/sesiones-idemax/` | Git detects as renames | `git log` shows rename operations |
| T04 | Copy Touchpoint from QA worktree | File present in `01_Sources/sesiones-idemax/` | File exists, same size as QA source |
| T05 | Create `_CONTEXT.md` for sesiones-idemax | Metadata: authority=internal, source_type=transcript | File matches `_CONTEXT_TEMPLATE.md` format |

**Risk:** `merge=ours` protects the RECEIVING branch. If merging entregables INTO timining, timining's empty files win. **Mitigation:** Reverse the merge direction — merge timining INTO entregables, then point timining at the result.

---

## Fase 1: Visual Diagnostic with Live Research App

| ID | Test | Expected | Verify |
|---|---|---|---|
| T06 | Dashboard extraction progress | Reflects new sources (57 total, 54 extracted, 3 pending) | Progress bar < 100%, untracked warning shown |
| T07 | File Browser shows sesiones-idemax folder | New folder visible with 3 files + `_CONTEXT.md` | Browse `01_Sources/` in the app |
| T08 | Evidence Gaps reflects current state | Gaps identified based on 21 existing insights | Gap count > 0, meaningful suggestions |
| T09 | Source Diversity accurate | Folder names mapped to expected research types | At least 3 types present |

---

## Fase 2: Hybrid Re-extraction

| ID | Test | Expected | Verify |
|---|---|---|---|
| T10 | `/extract` processes 3 new sesiones-idemax transcripts | Preprocessing triggered (speaker detection, Pass C sentence repair) | New entries in SOURCE_MAP, claims in EXTRACTIONS.md |
| T11 | Oversized lines detected on Touchpoint (134KB) | BL-49 flags oversized lines, uses byte-range fallback | Log shows oversized detection |
| T12 | Authority layer applied (internal) | Claims tagged `[INTERNAL]` per `_CONTEXT.md` authority | Extraction sections show `[INTERNAL]` tag |
| T13 | Existing non-transcript sources skipped | Hash match → auto-skip | SOURCE_MAP shows same hash, no re-extraction |
| T14 | Re-extract existing transcripts (if marked `needs-reprocess`) | Better quality claims with new preprocessing | Claim count changes, speaker labels present |

---

## Fase 3: Incremental Analysis

| ID | Test | Expected | Verify |
|---|---|---|---|
| T15 | `/analyze` processes new claims | New insights created or convergence updated | INSIGHTS_GRAPH.md count ≥ 21 |
| T16 | Internal authority respected | Claims from sesiones-idemax cannot independently VERIFY insights | No insight reaches VERIFIED from internal-only sources |
| T17 | Conflict detection | New contradictions surfaced if any | CONFLICTS.md checked for new entries |

---

## Fase 4: Final Verification

| ID | Test | Expected | Verify |
|---|---|---|---|
| T18 | Dashboard updated post-pipeline | Counts reflect new state (sources, claims, insights) | All numbers increased or stable |
| T19 | Evidence Gaps improved | Some gaps closed by new source diversity | Gap count decreased from Fase 1 baseline |
| T20 | Existing deliverables still valid | PRD.html, PERSONAS.html render correctly | Open in browser, no broken references |

---

## Anticipated Decision Points

| When | Agent asks | Prescribed answer | Why |
|---|---|---|---|
| Fase 0 merge | Merge direction concern | Approve reverse merge (timining → entregables) | Protects real work in entregables |
| `/extract` Phase 1.5 | Preprocessing options for transcripts | Approve all passes (A+B+C) | Need full preprocessing to test v4.17 improvements |
| `/extract` | Re-extract existing transcripts? | User decides based on Fase 1 diagnostic | May or may not be worth the token cost |
| `/analyze` | New insight approval | PENDING for low-convergence, approve clear patterns | Standard approach |

## Success Criteria

- Fase 0: Single consolidated worktree with all content preserved
- Fase 1: Dashboard accurately reflects project state (no false 100%)
- Fase 2: 3 new transcripts extracted with preprocessing
- Fase 3: Knowledge base enriched without regression on existing insights
- Fase 4: All deliverables intact, dashboard reflects final state

## Execution Order

```
Fase 0a → git merge (reverse direction)        ✅ Done
Fase 0b → standardize _temp → 01_Sources        ✅ Done
Fase 0c → copy Touchpoint from QA               ✅ Done
Fase 0d → _CONTEXT.md + commit                  ✅ Done
Fase 1  → /view + visual diagnostic             🔄 In progress
Fase 2  → /extract (new + optional re-extract)  ⬜ Pending
Fase 3  → /analyze incremental                  ⬜ Pending
Fase 4  → /view + final verification            ⬜ Pending
```

## Rules

- Observe, don't fix — document in findings
- Each test gets PASS / FAIL / PARTIAL / NOT TESTED / SKIPPED + notes
- If a test reveals a bug, log it but do NOT fix mid-session
- Fixes go to BACKLOG after session, implemented in a separate wave
