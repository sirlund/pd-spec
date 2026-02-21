# Project Memory

> Session log and state tracker. Written by skills after each execution.
> The agent reads this at session start to resume context and detect manual edits.

## Historical Summary

**Full pipeline executed 2026-02-16 across 5 skills:**
- `/extract`: 54 files from 7 folders, 1238 claims. TWO-PASS BATCHING (38 light + 16 heavy).
- `/analyze --full`: 1238 claims → 21 synthesized insights, 6 ambiguities, 5 research gaps.
- `/synthesis`: 20 VERIFIED, 2 INVALIDATED, 1 MERGED. 7 conflicts RESOLVED, 4 PENDING. SYSTEM_MAP built.
- `/ship prd` + `/ship persona`: PRD.html v2.0, PERSONAS.html v1.0.

**QA v4 sessions 2026-02-20 (incremental cycle):**
- `/extract sesiones-idemax` (15:23): 4 files, 94 claims. Phase 1.5 preprocessing on session-align (speakers + phonetics).
- `/analyze` (16:10): 12 atomic → 2 synthesized + 7 atomic PENDING + 5 MERGED. CF-12 created. 15 convergence updates.
- `/synthesis` (16:45): CF-03 flagged for research, CF-12 flagged for team discussion. No insight changes.
- `/extract ai-reports` (17:15): 1 AI-generated file, 18 claims tagged [AI-SOURCE].
- `/analyze` (17:30): 8 new AI insights (IG-15–IG-22). 5 convergence updates. State: 46 insights, 12 conflicts.

**State before QA v4 fresh re-extraction:** 59 sources · 1350 claims · 46 insights · 12 conflicts · 2 outputs.

**NOTE:** User reset SOURCE_MAP.md and EXTRACTIONS.md to empty on 2026-02-21 for QA v4 full re-extraction cycle. Insights/conflicts/system map from prior runs may still exist in Work files but extraction layer was rebuilt from scratch.

---

## [2026-02-21T16:00] /extract (full re-extraction, express mode, QA v4)
- **Request:** /extract (express, fresh re-extraction from reset state)
- **Mode:** Express — 43 light files processed, 16 heavy files deferred (pending-heavy), 5 video unsupported
- **Preprocessing (Phase 1.5):**
  - `session-align-con-camila(wed18feb).md`: full (speakers + phonetics) — 2 speakers, ~15 corrections
  - `transcript.md`: phonetics only — ~20 corrections
  - `Touchpoint_TIMining-IDEMAX _2026-02-19.md`: phonetics only — ~12 corrections
  - Preprocessing via `02_Work/_temp/preprocess.py` (phonetic patterns + speaker labels)
- **Stats (by folder):**
  - `ai-reports/`: 1 file, 15 claims (AI-GENERATED tagged)
  - `entrevistas iniciales stakeholders/`: 4 files (png), 26 claims
  - `entrevistas operaciones/`: 4 files, 87 claims
  - `Propuesta ruta/`: 1 file, 1 claim (field note)
  - `sesiones-idemax/`: 3 files, 53 claims (all preprocessed)
  - `Workshop 1/`: 30 files (1 md + 3 analysis png + 2 laminas png + 17 workshop-laminas png + 5 HEIC + 1 field notes + 1 transcript), 102 claims
  - **Total:** 43 files processed, 284 claims extracted
- **Notes:** reunion_camila self-declares "No es fuente para /extract" but processed per NO EDITORIAL DECISIONS mandate. notas_entrevista_COO and reu_coo have identical hash (same content).
- **Snapshot:** 43 light processed · 284 claims · 16 pending-heavy · 5 video unsupported

---

## [2026-02-21T16:30] /analyze (incremental, express mode, QA v4)
- **Request:** /analyze (incremental, express — all 43 sections newer than last /analyze)
- **Mode:** Express (medium project: 43 files, 284 claims → atomic insights, no synthesis)
- **Actions:**
  - 282 claims deduplicated into existing 46 insights (convergence confirmation from light files)
  - 2 new insights: IG-23 (arquitectura marca CORE), IG-24 ("el gemelo que no es gemelo")
  - 0 new conflicts
  - Convergence denominators: existing kept at /59 pending --heavy, new insights at /43
- **Result:** Total insights: 48 (20 VERIFIED, 20 PENDING, 6 MERGED, 2 INVALIDATED) · 12 conflicts (7R, 5P)
- **Dashboard:** 03_Outputs/STATUS.html regenerated
- **Snapshot:** 48 insights (20V, 20P, 6M, 2I) · 12 conflicts (7R, 5P) · 59 sources · 2 outputs
