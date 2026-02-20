# Project Memory

> Session log and state tracker. Written by skills after each execution.
> The agent reads this at session start to resume context and detect manual edits.

## Historical Summary

**Full pipeline executed 2026-02-16 across 5 skills:**
- `/extract` (18:45): 54 files from 7 folders, 1238 claims. TWO-PASS BATCHING (38 light + 16 heavy). 7 video files unsupported.
- `/analyze --full` (20:30): 1238 claims → 21 synthesized insights (12 high, 9 medium), 6 ambiguities, 5 research gaps. Research Brief generated.
- `/status` (21:00): Injected IG-01 (iPhone-like observation) + field note in Workshop 1/.
- `/synthesis` (21:30): 20 VERIFIED, 2 INVALIDATED, 1 MERGED. 7 conflicts RESOLVED, 4 PENDING. SYSTEM_MAP built.
- `/ship prd` (22:00): PRD.html v2.0 (Template+JSON, 20 insights, 4 pending conflicts).
- `/ship persona` (22:15): PERSONAS.html v1.0 (4 personas, 17 insight refs).
- `/status` (23:00): Injected IG-02 (Etapa 2 incompleta) + field note in Propuesta ruta/.

**QA padding entries (2026-02-17 to 2026-02-18) — dummy data for T43 compaction test:**
- `/status` (02-17 10:00): IG-DUMMY-01 injected.
- `/status` (02-17 11:00): IG-DUMMY-02 injected.
- `/synthesis` (02-18 09:00): Resolved 2 test conflicts, verified 2 test insights.

---

## [2026-02-20T15:23] /extract sesiones-idemax (incremental, QA v4 Phase A)
- **Request:** Incremental extraction of 3 new files in sesiones-idemax/ + 1 missed file in Propuesta ruta/
- **Mode:** Express (all 4 files are light/md)
- **Preprocessing (BL-43):**
  - Phase 1.5 detected 2 candidates via content heuristic (no _CONTEXT.md exists)
  - `session-align-con-camila(wed18feb).md`: APPROVED — 2 speakers (Nlundin high, Cbonilla high), 15 phonetic corrections
  - `Touchpoint_TIMining-IDEMAX _2026-02-19.md`: SKIPPED by user — 134KB, speaker detection infeasible
  - `reunion_camila_2026-02-17.md`: correctly rejected (clean notes, no STT patterns)
  - `_FIELD_NOTES.md`: correctly rejected (structured field notes)
- **Stats:** 4 files processed, 94 new claims (27 + 38 + 28 + 1)
- **Result:** 58 files processed, 1332 total claims
- **Snapshot:** 58 sources · 1332 claims · 24 insights (20V, 1P, 1M, 2I) · 4 conflicts PENDING · 2 outputs

---

## [2026-02-20T16:10] /analyze (incremental, QA v4 Phase B)
- **Request:** /analyze incremental
- **Mode:** INCREMENTAL (processed 94 new claims from 4 sections, skipped 54 unchanged sections)
- **Synthesis:** 12 atomic observations → 2 synthesized insights + 7 atomic PENDING + 5 MERGED. 1 new conflict (CF-12). 15 existing insights convergence-updated.
- **Speaker correction:** User corrected Touchpoint speaker attribution — CTO (Carlo) for technical/product claims, not CEO (Philip).
- **Actions:**
  - Synthesized insights created: 2 (IG-SYNTH-22, IG-SYNTH-23)
  - Atomic observations PENDING: 7 (IG-08 through IG-14)
  - Atomic observations MERGED: 5 (IG-03 through IG-07)
  - Convergence updated: 15 existing insights (denominator 54→58)
  - Conflicts: CF-12 created, CF-07 reinforced
- **Result:** 38 total insights (20 VERIFIED, 10 PENDING, 6 MERGED, 2 INVALIDATED) · 5 conflicts PENDING · 2 outputs
- **Snapshot:** 58 sources · 1332 claims · 38 insights (20V, 10P, 6M, 2I) · 12 conflicts (7R, 5P) · 2 outputs

---

## [2026-02-20T16:45] /synthesis (QA v4 Phase B — T43 compaction test)
- **Request:** /synthesis (5 PENDING conflicts)
- **Actions:**
  - CF-03: PENDING — Flagged → PENDING — Research (benchmark UX en progreso)
  - CF-12: PENDING → PENDING — Flagged (llevar a próxima sesión de trabajo con equipo)
  - CF-05, CF-07, CF-08: no changes (kept current intermediate states)
  - SYSTEM_MAP: 3 open questions added (IG-SYNTH-22, IG-SYNTH-23, CF-12)
  - No insight status changes
- **Result:** 38 insights (20V, 10P, 6M, 2I) · 5 conflicts PENDING · 2 outputs
- **Snapshot:** 58 sources · 1332 claims · 38 insights (20V, 10P, 6M, 2I) · 12 conflicts (7R, 5P) · 2 outputs
- **Note:** MEMORY compacted (was 82 lines, now <80). Historical Summary updated with QA padding entries.

---

## [2026-02-20T17:15] /extract ai-reports (incremental, QA v4 Phase C — T48)
- **Request:** /extract ai-reports (AI source validation test)
- **Mode:** Express (1 light file)
- **Actions:** 1 file processed with AI-GENERATED tagging (Source Type: ai-generated in _CONTEXT.md)
- **Stats:**
  - `ai-reports/`: 1 file, 18 claims (all tagged [AI-SOURCE])
  - **Total:** 1 file processed, 18 claims extracted
- **Preprocessing:** none
- **Snapshot:** 59 sources · 1350 claims · 38 insights (20V, 10P, 6M, 2I) · 12 conflicts (7R, 5P) · 2 outputs

---

## [2026-02-20T17:30] /analyze (incremental, QA v4 Phase C — T49)
- **Request:** /analyze (incremental — AI source validation)
- **Mode:** INCREMENTAL (processed 18 claims from 1 AI-GENERATED section, skipped 58 unchanged sections)
- **Actions:**
  - New atomic insights: 8 (IG-15 through IG-22) — all voice: ai, authority: hypothesis
  - Convergence updated: 5 existing insights (IG-SYNTH-01, IG-SYNTH-04, IG-SYNTH-05, IG-SYNTH-11, IG-14)
  - Deduplicated: 5 claims (convergence updates to existing insights)
  - Ambiguities: 0
  - Conflicts: 0 new
- **Result:** 46 insights (20V, 18P, 6M, 2I) · 12 conflicts (7R, 5P)
- **Snapshot:** 59 sources · 1350 claims · 46 insights (20V, 18P, 6M, 2I) · 12 conflicts (7R, 5P) · 2 outputs
