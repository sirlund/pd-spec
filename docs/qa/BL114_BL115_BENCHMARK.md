# BL-114 + BL-115 QA Benchmark

Parallel extraction + consolidate.sh. QA run March 2026. API key: PD-Spec.

## Cost Checkpoints (cumulative, API key PD-Spec, from 2026-03-01)

| Checkpoint | Cost | Delta | Notes |
|---|---|---|---|
| Baseline pre-QA | $20.19 | — | Before any BL-114 work |
| Post-serial Run 1 | $21.53 | +$1.34 | Serial mode, 13/19 files, 114 claims (old server) |
| Post-parallel Run 2 | $25.41 | +$3.88 | Parallel mode, 19/19 files, 1550 claims — over-extraction detected |
| Post-density-fix Run 3 | ~$27.23 | +$1.82 | Density fix in worker prompt + SKILL.md, 5 files |
| Post-BL115 Run (6 files) | $29.21 | +$1.98 | consolidate.sh live, 6 files, 189 claims, ~$0.13/file |

## Per-File Cost Analysis

| Run | Files | Cost | $/file | Notes |
|---|---|---|---|---|
| Serial (Run 1) | 13 | ~$1.34 | ~$0.10 | Sonnet only, no parallel |
| Parallel (Run 2) | 19 | ~$3.88 | ~$0.20 | Over-extraction, pre-density-fix |
| Parallel + density fix | 5 | ~$0.65 | ~$0.13 | Density calibrated, consolidate.sh $0 |
| Parallel + BL-115 | 6 | ~$0.78* | ~$0.13 | *includes Q&A session overhead |

*Estimated. Delta from $28.63 to $29.21 = $0.58, split between extract run (~$0.40) and Q&A session (~$0.18).

## Cost Model (settled)

```
Phase 1: Coordinator (Sonnet)  — fixed ~$0.25-0.35 per run
Phase 2: Workers (Haiku × N)   — variable ~$0.05-0.07/file
Phase 3: consolidate.sh        — $0 tokens
```

At scale:
- 6 files:  ~$0.55 total (~$0.09/file) — coordinator cost dominates
- 20 files: ~$1.35 total (~$0.07/file)
- 72 files: ~$4.60 total (~$0.06/file) — workers dominate, coordinator amortized

## Quality Benchmarks

| Run | Files | Claims | Claims/file | Notes |
|---|---|---|---|---|
| Serial Run 1 | 13 | 114 | 8.8 | Pre-parallel, baseline quality |
| Parallel Run 2 | 19 | 1550 | 81.6 | Over-extraction — too many low-value claims |
| Parallel + density fix | 5 | ~90 | ~18 | Better but still high |
| Parallel + BL-115 | 6 | 189 | 31.5 | Calibrated — transcripts inflate count |

Target density: 3-5 claims/page for docs, 1 claim per 5-10 lines for transcripts.

## QA Dataset (pd-spec--qa worktree)

Files used for final validation run:
- `Touchpoint 1/Touchpoint_TIMining-IDEMAX _2026-02-19.md` — 1761 lines, raw ASR transcript → 30 claims
- `Touchpoint 1/Touchpoint_TIMining-IDEMAX _2026-02-19.clean.md` — preprocessed → not in this run
- `Workshop 1/8-Layer.pptx` → preprocessed via markitdown → 11 claims
- `Workshop 1/IMG_9680.HEIC` → vision → 6 claims
- `Workshop 1/laminas-caso-uso-1.png` → vision → 6 claims
- `Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx` → preprocessed → claims in English (source language preserved)
- `Workshop 1/PPT TIMining.pdf` → preprocessed → 11 claims (8-Layer architecture)

## Open OBS

- **OBS-BL113-01 (P1):** Checkpoint preventivo no se escribe antes del primer compact — SKILL.md step 7 fix pending
- **OBS-BL114-01 (P2):** Worker logs en UI no muestran filename — tracked in BL-120
- **OBS-BL114-02 (P2):** Parallel activation threshold uses file count only, should also check total size_kb
