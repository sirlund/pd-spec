# Project Memory

> Session log and state tracker. Fallback recovery when SESSION_CHECKPOINT is unavailable.
> Compacted at 80 lines — old entries summarized, 3 most recent kept in full.

## Historical Summary

<!-- Compacted summaries of past sessions appear here. -->

---

<!-- Entry format:
### YYYY-MM-DDTHH:MM — /skill or action
- **Request:** what was asked
- **Actions:** what was done
- **Result:** outcome
- **Snapshot:** sources: X | extractions: X | insights: X (V verified) | conflicts: X (P pending) | outputs: X
-->

### 2026-03-04T16:00 — /analyze (full)
- **Request:** /analyze (primer run, sin flags — modo full por ausencia de insights previos)
- **Mode:** FULL — procesó 183 claims de 9 secciones (0 skipped)
- **Synthesis:** 183 claims → 18 insights sintetizados (7 ambigüedades/conflictos detectados, 3 research gaps)
- **Actions:**
  - Insights sintetizados creados: 18 ([IG-SYNTH-01] a [IG-SYNTH-18])
  - Conflictos detectados: 3 (CF-01, CF-02, CF-03)
  - Ambigüedades como conflictos: 4 (CF-04 a CF-07)
  - RESEARCH_BRIEF.md generado
  - INSIGHTS_GRAPH_INDEX.md regenerado (18 entries)
- **Result:** Total insights: 18 (0 VERIFIED, 18 PENDING, 0 MERGED) · 7 conflicts PENDING · 0 outputs
- **Snapshot:** 18 insights (18 PENDING) · 7 conflicts PENDING · 0 outputs

### 2026-03-04T12:00 — /extract
- **Request:** Full extraction of all sources (first run)
- **Actions:** Discovered 6 md files in 2 folders (cotizacion/, preanalisis/). No preprocessing needed. Read all in parallel, extracted claims.
- **Result:** 6 files processed, 84 claims extracted
- **Stats:**
  - `cotizacion/`: 2 files, 32 claims
  - `preanalisis/`: 4 files, 52 claims
  - **Total:** 6 files, 84 claims
- **Preprocessing:** none
- **Snapshot:** sources: 6 | extractions: 84 | insights: 0 | conflicts: 0 | outputs: 0

### 2026-03-04T15:00 — /extract (incremental)
- **Request:** /extract (sin flags — modo express, incremental)
- **Actions:** Delta detectado: 3 NEW. `.DS_Store` descartado (archivo macOS). PDF ya estaba en EXTRACTIONS.md → solo se añadió a SOURCE_MAP. `cotizacion/_transcript_reunion_feb06.md` (64KB, 570L) procesado con preprocessing completo (Passes A+B+C). Speakers: Nicolás Lundin (Me) y Juan Ibáñez (Them) — confianza high. 9 correcciones fonéticas (Rive, vibe coding, Claude Code, full-stack, MDP). 17 marcadores Pass C (11 incomplete, 4 crosstalk, 2 unintelligible).
- **Result:** 1 archivo nuevo procesado (51 claims), 1 entrada de SOURCE_MAP corregida (PDF)
- **Stats:**
  - `cotizacion/_transcript_reunion_feb06.md`: 1 archivo, 51 claims
  - **Total acumulado:** 9 secciones, 183 claims
- **Preprocessing:** _transcript_reunion_feb06_normalized.md preservado en 02_Work/_temp/
- **Snapshot:** sources: 9 | extractions: 183 | insights: 0 | conflicts: 0 | outputs: 0

### 2026-03-04T12:30 — /extract (incremental)
- **Request:** Re-run /extract after new PDF added
- **Actions:** Delta detected 1 NEW file (Propuesta Plataforma de Validación Trivia.pdf, 148KB). 6 md files unchanged. Read PDF, extracted 44 claims.
- **Result:** 1 file processed, 44 claims extracted (incremental)
- **Stats:**
  - `(root)/`: 1 file (PDF), 44 claims
  - **Total:** 7 files processed, 128 claims extracted (cumulative)
- **Preprocessing:** none
- **Snapshot:** sources: 7 | extractions: 128 | insights: 0 | conflicts: 0 | outputs: 0
