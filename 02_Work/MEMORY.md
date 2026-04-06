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

### 2026-04-06T00:00 — Pitch deck research + planning
- **Request:** Research pitch decks para etapa pre-producto. Barri tiene oportunidad de pitch a inversores en Panamá (~mediados-fin abril)
- **Actions:**
  - Research completo: formatos (clásico VC, pre-seed optimizado, story-driven), market sizing alternatives (bottom-up vs TAM/SAM/SOM), LATAM VC context 2025-2026, errores fatales, ejemplos notables
  - Decisión formato: Opción B (pre-seed 10 slides) + elementos narrativos de Opción C
  - Presupuesto: 18-20h · $495.000-$550.000, todo con IA, Barri paga de una
  - Research guardado: `02_Work/_temp/pitch_deck_research.md`
- **Result:** Research listo. Pendiente datos de Barri (equipo, ask, mercado) para arrancar producción
- **Snapshot:** 18 insights (18 PENDING) · 7 conflicts PENDING · 2 outputs (V3 + V3.1 docx)

### 2026-03-31T00:00 — Propuesta V3.1 Consolidado Final
- **Request:** Incorporar feedback Barri (mecánica final, scoring, anti-cheat comments, nuevos requerimientos) y generar propuesta consolidada V3.1
- **Actions:**
  - Guardado feedback Barri como fuente: `01_Sources/revision_propuesta_v2/feedback_barri_v3_mecanica.md`
  - Análisis de delta V3→V3.1: `02_Work/DELTA_V3_V31.md`
  - Decisiones confirmadas: scoring Barri (por dificultad 25/50/100/150, binario), oleadas rechazado, feedback inmediato, 702 preguntas, HQ tiebreaker +10h, prueba carga +12h, SOÑAO.COM +12h aparte, botón soporte +3h, anti-cheat tabla con notas legales
  - Generado `03_Outputs/Propuesta_Triviapp_V3_1.docx` via `generate_propuesta_v31.py`
- **Result:** V3.1 generada. T1 base: 105h/$2.887.500. Con todo (anti-cheat + SOÑAO.COM): 124h/$3.410.000. 3 pilotos: 152h/$4.180.000.
- **Snapshot:** 18 insights (18 PENDING) · 7 conflicts PENDING · 2 outputs (V3 + V3.1 docx)

### 2026-03-19T00:00 — Propuesta V3 Lean + anti-cheat + investigación técnica
- **Request:** Analizar fuentes nuevas (propuesta v2 + transcripts mar 10/12), crear propuesta V3 lean, investigar pasarelas/magic link/RRSS/WhatsApp, diseñar anti-cheat
- **Actions:**
  - Cruce propuesta v2 + transcripts → 6 temas resueltos, tabla comparativa Básica/Pro/Lean
  - Propuesta V3 Lean: 80h/$2.200.000 arrancar, 108h/$2.970.000 tres pilotos, upgrade Pro 193h/$5.307.500
  - Scoring graduado propuesto (+5/+1/0/-2) + bonus tiempo solo en correcta + sin skip + banco ~440
  - Anti-cheat: verificación ganador (videollamada), scoring por oleadas, orden aleatorio, auditoría top 10
  - UX: bloques temáticos + mensajes narrador (0h extra, es contenido)
  - Research: MercadoPago (recomendado), magic link (Supabase built-in), scraping RRSS (no vale la pena), WhatsApp (escalonado)
  - Reunión con Barri Mar 18: V3 bien recibida, pendiente confirmación
- **Result:** Commit `93463e8`. Propuesta V3 entregada. Barri inclinado a Lean.
- **Snapshot:** 18 insights (18 PENDING) · 7 conflicts PENDING · 1 output (V3 docx)

### 2026-03-06T00:00 — Comunicación cliente
- **Request:** Redactar respuesta a Marcelo Ibáñez sobre bloque simultáneo y presupuesto
- **Actions:** Borrador email + WSP intro. Confirmado: "Barri" = Marcelo (segundo nombre). Estimado ~25-30 hrs adicionales por real-time + QA complejidad. PROJECT.md actualizado con nombre correcto del cliente.
- **Result:** Engine files descartados (SKILL.md + discover-sources.sh). Commit `84908db` con 20 archivos de proyecto.
- **Snapshot:** 18 insights (18 PENDING) · 7 conflicts PENDING · 0 outputs

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
