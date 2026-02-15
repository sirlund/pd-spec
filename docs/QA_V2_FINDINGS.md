# QA v2 Findings — 2026-02-15

> Pre-test and test findings for v4.0. Testing on test-timining branch with Sonnet.

## Summary

| ID | Type | Status | Summary |
|---|---|---|---|
| FIX-01 | Fix | FIXED | /extract can't read Office files |
| BUG-01 | Bug | FIXED | /extract skips 42/57 files silently, reported only 27 |
| BUG-02 | Bug | MITIGATED | Skills fill context window on large projects (systemic) |
| BUG-03 | Bug | MITIGATED | Claim count 862 real vs 476 reported (post-compaction) |
| BUG-04 | Bug | FIXED | Entire folder "Propuesta ruta/" omitted from report |
| BUG-05 | Bug | FIXED | 3 PDFs "not readable" — Read tool should handle them |
| BUG-06 | Bug | FIXED | HEIC images + video files unsupported, not reported |
| BUG-07 | Bug | FIXED | Insight refs point to /tmp/ files, not real sources |
| BUG-08 | Bug | FIXED | /analyze loses source attribution — who said what, with what authority |
| BUG-09 | Bug | FIXED | Format inconsistency between old and new insights |
| BUG-10 | Bug | FIXED | Duplicate insights — deduplication failed post-compaction |
| BUG-11 | Bug | FIXED | /analyze skips /status — user has no visual review before /synthesis |
| BUG-12 | Bug | MITIGATED | /status generates old monolithic HTML — ignores Template+JSON (CRITICAL) |
| PERF-01 | Perf | MITIGATED | 24+ min / 30k tokens for 60 files — image batching hotfix, full fix in BL-17 |
| ARCH-01 | Arch | PENDING | Project settings in CLAUDE.md cause merge conflicts |
| ARCH-02 | Arch | PROPOSED | SOURCE_MAP.md — state management for /extract |
| BUG-13 | Bug | FIXED | MEMORY.md no registra todas las acciones — IG-111-115 verificados sin log |
| BUG-14 | Bug | FIXED | ID convention mismatch — IG-001 (zero-padded) vs IG-01 (original) rompe anchors |
| BUG-15 | Bug | FIXED | Add Context flow roto — field note requiere extract+analyze para ser insight |
| ARCH-03 | Arch | PROPOSED | 142 "insights" no son insights — falta capa de síntesis real |

---

## Pre-test fixes (applied)

### FIX-01: /extract can't read Office files
- **Problem:** /extract only had Read, Grep, Glob, Write — couldn't open DOCX, PPTX, XLSX
- **Fix:** Added Bash to allowed-tools. Strategy: try markitdown (optional), fallback to textutil (DOCX) + Python zipfile (PPTX/XLSX). Zero dependencies required.
- **Commit:** `6c48643` on main
- **Status:** FIXED

## Test findings

### BUG-01: /extract skips files silently — CRITICAL
- **Problem:** Agent skips files without reporting them, far beyond what it acknowledges. Skill says "Include ALL claims" but doesn't explicitly forbid skipping or require a complete manifest check.
- **Observed (verified by manual audit):**
  - **57 actual source files** in 01_Sources/ (excluding templates/gitkeep)
  - **15 processed** (15 sections in EXTRACTIONS.md)
  - **42 not processed** — agent reported only 27 unprocessed, silently omitted 15 more
  - Breakdown of unprocessed:
    - Workshop 1/: 24 images (22 JPG + 5 HEIC, only 3 processed) — agent reported "23 fotos"
    - Antecedentes/: 10 files skipped (2 PDFs, 1 PPTX, 1 video 152MB, 6 MP4 + 1 DOCX in subfolder) — **agent reported 0 skipped from this folder**
    - Visión Futuro CORE/: 3 PDFs (11-18MB) — agent reported these
    - Propuesta ruta/: 1 PPTX (20MB) — agent reported as "error"
    - Root level: 2 PNG + 1 PPTX (34.6MB) — **agent didn't report these**
    - entrevistas operaciones/: 1 PNG — **agent didn't report this**
- **Root cause:** (1) No explicit "never skip" instruction. (2) No manifest/checklist to verify completeness. (3) Agent optimizes for speed. (4) Post-compaction state reconstruction loses track of what was skipped.
- **Fix:** Add explicit no-skip rule + mandatory completeness check against glob results. If too many files, process in batches — never skip. SOURCE_MAP.md (ARCH-02) would make skipping detectable.
- **Status:** FIXING

### BUG-02: Skills fill context window on large projects — forces mid-skill compaction
- **Problem:** Skills processing large datasets overflow the context window, triggering automatic /compact mid-skill. Post-compaction, the agent loses intermediate state and must reconstruct from a lossy summary.
- **Observed:**
  - **/extract:** Compacted at 24m 38s processing 60 files. Post-compaction lost file read state (Write tool error), lost track of skipped files, produced wrong claim count.
  - **/analyze:** Compacted while cross-referencing 862 claims × 115 existing insights. Impact on output TBD.
  - **/ship:** TBD — expected to compact when reading full Work layer + generating HTML.
- **Root cause:** Single-agent, single-context architecture. Each skill runs in one context window with no checkpointing. Large projects exceed the window during normal operation.
- **Impact:** Post-compaction agent loses intermediate state → wrong counts (BUG-03), silent file skips (BUG-01), lost processing strategies (BUG-05). Systemic — affects any skill on large projects, not just /extract.
- **Mitigation:** Parallel processing by folder (idea #11) for /extract. For /analyze and /ship, needs investigation — possibly chunked processing or selective loading of Work layer.
- **Status:** NOTED (systemic, future improvement)

### BUG-03: Claim count inconsistency — post-compaction data integrity loss
- **Problem:** /extract final report shows per-folder claim totals that don't match the reported grand total.
- **Observed:** Per-folder sum = 862 claims (157 + 26 + 241 + 100 + 338). Reported total = 476 claims. Difference: 386 claims.
- **Verified:** Actual claims in EXTRACTIONS.md = **862**. The per-folder numbers are correct; the 476 total is wrong. Likely a pre-compaction count that wasn't updated after the full write.
- **Root cause:** The 476 total was calculated pre-compaction. Post-compaction, the agent wrote more claims but carried forward the stale total. MEMORY.md also records 476 (propagated error).
- **Impact:** User cannot trust the extraction report. MEMORY.md snapshot is wrong. Any downstream skill reading MEMORY.md inherits the bad count.
- **Relation:** Direct consequence of BUG-02 (context overflow).
- **Cascade:** /analyze reads MEMORY.md at session start and inherits the wrong count. Sonnet's /analyze reports "procesando 476 claims" when EXTRACTIONS.md has 862. Downstream skills that trust MEMORY.md will propagate the error further.
- **Status:** CONFIRMED

### BUG-04: Entire folder "Propuesta ruta/" omitted from extraction report
- **Problem:** The folder `01_Sources/Propuesta ruta/` exists and contains at least 1 PPTX file, but does not appear in the extraction report at all — neither in processed nor unprocessed sections.
- **Observed:** Report lists 5 folders (entrevistas operaciones, root, Workshop 1, Visión Futuro CORE, Antecedentes). Propuesta ruta/ is absent.
- **Root cause:** Likely lost during compaction — the folder may have been partially processed pre-compaction but dropped from the reconstructed state.
- **Relation:** Compounds BUG-01 (skipping) and BUG-02 (compaction). The agent silently skipped an entire folder without flagging it.
- **Status:** NOTED

### BUG-05: 3 PDFs reported as "not readable" — Read tool should handle PDFs
- **Problem:** /extract reported 3 PDFs in `Visión Futuro _CORE_/` as "no fueron legibles con las herramientas disponibles". The Read tool natively supports PDF reading with the `pages` parameter.
- **Observed:** Agent didn't attempt or failed to use Read tool on PDFs. The /extract SKILL.md explicitly says "PDFs — Read using the Read tool with pages parameter for large documents."
- **Root cause:** Either (a) agent didn't follow the skill instruction, (b) these specific PDFs are image-only scans without text layer, or (c) post-compaction the agent lost the PDF reading strategy.
- **Fix:** Verify if PDFs have a text layer. If image-only, add OCR fallback guidance to skill. If text PDFs, this is a skill-following failure.
- **Status:** NOTED

### BUG-06: Unsupported file formats not handled — HEIC images, video files
- **Problem:** /extract SKILL.md doesn't mention HEIC (iPhone raw photos) or video formats (MP4, WEBM). Agent encounters them and silently skips without reporting.
- **Observed:**
  - **5 HEIC images** in Workshop 1/ — not processed, not reported. HEIC is Apple's default photo format; users dragging photos from iPhone will have these.
  - **7 MP4 videos** (9-149MB) in Antecedentes/ + subfolder — not processed, not reported. These are event recordings and case study demos.
  - **1 WEBM video** (152MB) in Antecedentes/ — not processed, not reported.
- **Root cause:** SKILL.md only lists PNG, JPG, PDF, CSV, DOCX, PPTX, XLSX. No guidance for HEIC or video.
- **Proposed handling:**
  - **HEIC:** Convert to JPG via `sips -s format jpeg "file.heic" --out /tmp/file.jpg` (macOS native, zero deps). Then read as image.
  - **Video:** Genuinely unprocessable by the agent (no transcription tool). Should be explicitly listed as unsupported format. Agent must report them and suggest: "Export audio transcript or provide a _CONTEXT.md description."
- **Impact:** Users with iPhone photos or event recordings will have gaps they don't know about.
- **Status:** NOTED

### BUG-07: Insight source refs point to /tmp/ conversion files instead of real sources
- **Problem:** /extract converts Office files to /tmp/ intermediaries (textutil, zipfile). /analyze then references these temp paths instead of the original source files in 01_Sources/.
- **Observed in IG-116 to IG-142:**
  - `Workshop 1/retro.txt` → should be `Workshop 1/KEEP-STOP-START (retro).docx`
  - `Workshop 1/Design Brief.md` → should be `Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`
  - `Antecedentes/evolution.txt` → should be `Antecedentes/31_12_2025_TIMining The Evolution...docx`
  - `Antecedentes/narrativa.txt` → should be `Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`
- **Root cause:** /extract writes the temp file path in EXTRACTIONS.md section headers instead of the original source path. /analyze inherits the bad ref. The /extract SKILL.md doesn't explicitly say "reference the original source file, not the conversion intermediary."
- **Impact:** Traceability broken. Anyone following an [IG-XX] ref to verify a claim lands on a non-existent file. Violates Mandate #1 (No Hallucination — every insight must trace back to a file in 01_Sources/).
- **Fix:** /extract must always use the original 01_Sources/ path in section headers, never the /tmp/ conversion path.
- **Status:** NOTED

### BUG-08: /analyze loses source attribution — who said what
- **Problem:** /extract preserves source metadata (Type, Date, Participants) per file section. /analyze discards this when creating insights. The resulting insight has a file ref but no information about WHO said it or WITH WHAT AUTHORITY.
- **Observed:** All 27 new insights (IG-116 to IG-142) have identical structure regardless of source type:
  - A user complaint from a workshop retro → `(user-need)` with no speaker attribution
  - A CEO's 2040 vision narrative → `(business, aspirational)` — looks like a verified insight, is actually a hypothesis
  - A historical fact from internal docs → `(technical)` — no distinction from a user need
  - An operator's specific pain point → `(user-need)` — which operator? what role? what context?
- **Root cause:** /analyze skill only categorizes as `user-need`, `technical`, `business`, `constraint` + temporal tag `current`/`aspirational`. No concept of:
  - **Claim voice:** who said it (operator, PM, COO, CEO, document)
  - **Claim authority:** direct observation, user quote, stakeholder hypothesis, vision/aspiration, historical fact
  - **Source weight:** a user interview has different evidentiary value than a marketing narrative
- **Impact:** Downstream skills (/synthesis, /ship) can't distinguish between verified user pain and stakeholder speculation. A PRD built on these insights treats "users hate dashboards" (real pain, observed) the same as "in 2040 mines will be run from cities" (CEO narrative, unverified).
- **Pipeline gap:**
  ```
  Source (type, date, participants, role)
    → /extract (preserves metadata ✅)
    → /analyze (loses attribution ❌)
    → insight without "who" or "authority level"
  ```
- **Proposed fix:** Add to /analyze insight format:
  - `Voice: [user | stakeholder | document | researcher]`
  - `Authority: [direct-quote | observation | hypothesis | vision | fact]`
  - Preserve participant info from EXTRACTIONS.md metadata
- **Status:** NOTED

### BUG-09: /analyze format inconsistency — new vs existing insights
- **Problem:** New insights (IG-116+) use a different format than existing insights (IG-01 to IG-115).
- **Observed:**
  - Old: `### [IG-01] (technical) **VERIFIED**` — one line, bold status
  - New: `### [IG-116] (user-need, current) PENDING` + separate `Status: PENDING` line + `> "quote"` + `Convergence: X/18`
  - Status appears twice in new format (header + body)
  - Temporal tag added to category in new format (correct per v3.2) but missing from old
  - Convergence denominator says "18 sources" but actual processed files = 15 sections, total source files = 57
- **Root cause:** Old insights were generated pre-v4.0 by a different /analyze run. New insights follow updated skill instructions (temporal tags, convergence, key quotes). No migration step to normalize the existing insights.
- **Impact:** Mixed formats in the same file. Parsing tools or downstream skills may handle one format but not the other.
- **Status:** NOTED

### BUG-10: /analyze creates duplicate insights — claims already covered
- **Problem:** Some new insights overlap significantly with existing ones. /analyze's deduplication was insufficient.
- **Observed:**
  - IG-140 (Efecto Suiza, integrador neutro) — likely overlaps with existing insights about TIMining's structural position
  - IG-141 (bottom-up adoption >100 users) — likely overlaps with existing adoption insights
  - IG-134 (inferencia topográfica breakthrough) — likely covered in existing technical insights
  - IG-142 (singularidad técnica, equipo multidisciplinario) — likely covered
- **Root cause:** Post-compaction, agent may have lost track of existing insight details. Cross-referencing 862 claims × 115 insights is context-heavy — compaction interrupts the comparison.
- **Impact:** Duplicate insights dilute the knowledge base. /synthesis will need to merge them, adding unnecessary work.
- **Relation:** Consequence of BUG-02 (compaction during cross-referencing).
- **Status:** NOTED

### BUG-11: /analyze skips /status — user has no visual review before /synthesis
- **Problem:** /analyze suggests "run /synthesis" as next step, skipping /status entirely. The user has no visual way to review new insights before deciding what to approve/reject.
- **Observed:** Sonnet's /analyze completed with 27 new PENDING insights and said "ejecuta /synthesis para verificar los 27 insights PENDING". No mention of /status.
- **Background:** In QA v1 session, the idea was proposed that STATUS.html should be the output of /analyze — the dashboard as the natural review surface between analysis and synthesis. Ideas #4 and #5 in qa-session-ideas.md describe STATUS as "bridge between analysis and output generation."
- **Root cause:** /analyze SKILL.md doesn't include /status generation or suggestion. STATUS is a separate skill the user must invoke manually. The Research Brief is auto-generated inside /analyze, but the interactive dashboard (where decisions actually happen) is not.
- **Proposed fix:** /analyze should auto-generate STATUS.html at the end of its flow. This gives the user an immediate visual review surface with approve/reject buttons, conflict options, and the prompt generator for /synthesis. Same pattern as Research Brief — generated automatically, no extra step.
- **Pipeline should be:**
  ```
  /extract → /analyze (generates STATUS.html) → user reviews in browser → /synthesis → /ship
  ```
- **Status:** NOTED

### BUG-12: /status generates old monolithic HTML — ignores Template+JSON — CRITICAL
- **Problem:** /status generates 476-line monolithic HTML (inline CSS + JS) instead of using the Template+JSON architecture built during v4.0 sprint. The templates and schemas exist but are completely ignored.
- **Observed:**
  - STATUS.html: 476 lines, inline styles, no `DATA_JSON`, no `_base.css`/`_base.js` references
  - `03_Outputs/_templates/status.html` exists (1200+ lines, full Template+JSON dashboard with sidebar, modular components)
  - `03_Outputs/_schemas/status.schema.json` exists (JSON schema for dashboard data)
  - Neither is referenced by the generated file
- **Root cause:** /status SKILL.md was never updated during the v4.0 sprint to use Template+JSON. It still describes writing self-contained HTML with inline CSS/JS. The sprint created the templates/schemas (A3 agent) but didn't update the skill instructions to use them.
- **Impact:** CRITICAL —
  - STATUS is the central review hub (anchor for all [IG-XX]/[CF-XX] cross-references from other outputs)
  - Other /ship outputs use Template+JSON and expect STATUS.html to have the new format with proper anchor IDs
  - The old monolithic format won't have the sidebar, modular components, or interactive features designed in the v4.0 template
  - Visual inconsistency between STATUS (old) and all other outputs (new Template+JSON)
- **Fix:** Update /status SKILL.md to use Template+JSON: agent writes JSON data block, template handles rendering. Same pattern as all /ship types.
- **Status:** NOTED

### BUG-13: MEMORY.md no registra todas las acciones del agente
- **Problem:** Acciones tomadas por el agente no quedan registradas en MEMORY.md cuando ocurren entre compactaciones o en interacciones ad-hoc fuera del pipeline formal.
- **Observed:** IG-111 a IG-115 fueron verificados en una interacción anterior donde el usuario testeó si el agente distinguía visión futura vs estado actual (workshop + casos de uso). Esa verificación no quedó en MEMORY.md.
- **Consecuencia:** En la siguiente sesión, el conteo de 115 VERIFIED parece incorrecto (usuario aprobó 110, pero 5 ya estaban VERIFIED). Sin el log en MEMORY, no hay forma de reconstruir qué pasó.
- **Root cause:** El Session Protocol dice "after every skill execution, append to MEMORY.md", pero las verificaciones ad-hoc (fuera de un skill formal) no tienen esa obligación. Además, post-compaction el agente pierde la instrucción de loguear.
- **Relación:** Consecuencia directa de BUG-02 (compaction). El estado se pierde y MEMORY.md no lo captura.
- **Fix:** Ampliar Session Protocol — no solo "after skill execution" sino "after any state change to Work layer files". Si un insight cambia de PENDING a VERIFIED, debe quedar en MEMORY.md independientemente de si fue un skill formal o una conversación.
- **Status:** NOTED

### BUG-15: Add Context flow roto — field note no se convierte en insight sin pipeline completo
- **Problem:** El módulo "Add Context" de STATUS.html genera una field note formateada y dice "Save this to _FIELD_NOTES.md". El usuario copia el texto, lo pasa al agente, el agente lo guarda en 01_Sources/. Pero para que esa observación se convierta en insight, hay que correr /extract (reprocesa TODO) → /analyze. Para una nota de 3 líneas, esto es absurdo.
- **Observed:** Usuario escribió "Visión sesgada CTO — Carlos está muy confiado del diseño de TIMining vs industria minera". Sonnet guardó en _FIELD_NOTES.md. Luego el usuario preguntó: "¿extract procesará todo nuevamente o solo esa nota?" — Sonnet confirma: reprocesa todo.
- **Root cause:** Add Context fue diseñado como generador de fuentes (01_Sources), no de insights. El pipeline asume que toda información entra por 01_Sources → /extract → /analyze. No hay camino corto para inyectar observaciones puntuales.
- **Impacto:** El flujo de "investigador agrega observación rápida" es inviable. Un UX researcher quiere anotar algo en 10 segundos, no esperar 25 minutos de pipeline.
- **Propuesta: Insight directo.** Add Context debería escribir un `[IG-XX]` PENDING directamente a INSIGHTS_GRAPH.md con:
  - `source_confidence: high/medium/low/hunch` (ya existe en schema)
  - `source: "field-note"` como tipo de fuente
  - Opcionalmente, también guardar la field note en 01_Sources/ para traceability
  - El usuario valida el insight en /synthesis como cualquier otro PENDING
- **Relación:** ARCH-02 (SOURCE_MAP con incremental extract) mitiga parcialmente pero no resuelve — incluso con incremental, requiere extract+analyze. El insight directo es el camino más corto.
- **Status:** NOTED

### PERF-01: /extract performance — 24+ min for 60 files
- **Problem:** /extract processes files linearly (read → LLM extract → next). For 60 files (including 26 workshop photos, Office docs, PDFs), extraction took 24+ minutes and 29.7k tokens, triggering context compaction mid-process.
- **Observed:** Sonnet session hit 24m 38s before compaction. Images are especially token-expensive (visual reading). Linear processing means no parallelism.
- **Root cause:** Sequential file processing + multimodal image reading is slow and token-heavy.
- **Impact:** Projects with 100+ files will be inviable without mitigation. BUG-01 fix (process ALL files, no skipping) will make this worse.
- **Hotfix (v4.1.0):** Image batching — group 3-4 images per Read call within the same folder. Reduces per-image overhead and enables cross-image context (workshop photo sequences). Added to extract/SKILL.md.
- **Full fix:** BL-17 (ARCH-02 SOURCE_MAP.md) → parallel /extract by folder (idea #11). Split by folder, each agent writes to separate file, merge step concatenates.
- **Priority:** Medium now, High after BUG-01 fix
- **Status:** MITIGATED (image batching hotfix, full parallelism in BL-17)

### ARCH-01: Project settings in CLAUDE.md cause merge conflicts
- **Problem:** CLAUDE.md has both engine config (versioned, changes per release) and project settings (set by /kickoff, project-specific). Every merge from main to a project branch conflicts.
- **Observed:** Conflict on every main → test-timining merge in CLAUDE.md Project Settings section.
- **Proposed fix:** Separate into `CLAUDE.md` (engine only) + `PROJECT.md` (settings only). /kickoff writes to PROJECT.md. All skills read settings from PROJECT.md.
- **Impact:** /kickoff, all skills that read output_language/project_name, CLAUDE.md template
- **Status:** PENDING

### ARCH-02: /extract lacks source state management — needs SOURCE_MAP.md
- **Problem:** /extract is stateless and destructive. Every run replaces EXTRACTIONS.md entirely, reprocessing all files from scratch. No memory of what was already processed, what failed, or what's new.
- **Impact:** Causes or amplifies BUG-01 (no checklist to enforce completeness), BUG-02 (reprocesses everything = context overflow), BUG-03 (no persistent count source of truth), BUG-04 (no manifest to detect missing folders), BUG-05 (no error log to retry), PERF-01 (reprocesses unchanged files).
- **Proposed fix:** Add `02_Work/SOURCE_MAP.md` — a per-file state registry maintained by /extract.
- **Design:**
  - **Two files, mutual recovery:** SOURCE_MAP.md (state) + EXTRACTIONS.md (claims). If either is deleted, the other can reconstruct it. If both deleted, equivalent to today — full re-extract.
  - **Per-file tracking:** file path, format, status (pending/processed/error), claim count, md5 hash, last processed timestamp.
  - **Change detection:** md5 hash (`md5 -q file` — macOS native, zero deps). New file = not in map. Modified = hash differs. Deleted = in map but not on disk.
  - **Incremental flow:** On subsequent runs, only process new + modified + previous errors. Append/replace sections in EXTRACTIONS.md using `## [folder/file]` headers as delimiters.
  - **Recovery matrix:**
    - EXTRACTIONS.md deleted → SOURCE_MAP knows what was processed → informed re-extract
    - SOURCE_MAP.md deleted → parse EXTRACTIONS.md headers → reconstruct map
    - Both deleted → full re-extract from scratch (same as today)
    - Source file deleted → SOURCE_MAP marks orphan → remove section from EXTRACTIONS
    - Source file added → SOURCE_MAP detects new → process and append
    - Source file modified → hash mismatch → reprocess and replace section
  - **Single file preferred** over multi-file (_extractions/*.md) to reduce fragility and keep the same mental model users already have.
- **Status:** PROPOSED

### ARCH-03: "Insights" no son insights — falta capa de síntesis UX real
- **Problem:** PD-Spec llama "insights" a lo que en UX research son **observaciones o hallazgos**. Un insight real de UX research es un patrón destilado con convergencia multi-fuente, no un claim atómico individual.
- **Observed:**
  - 142 "insights" en INSIGHTS_GRAPH.md — un UX researcher generaría ~20-30 de ese volumen de datos
  - 90.8% son single-source (convergencia 1/18) — un insight real por definición tiene convergencia
  - RESEARCH_BRIEF.md ya hace la síntesis correcta: agrupa observaciones en temas como "la brecha geométrica", "customización como trampa de valor", "carga consultiva insostenible" — **esos** son insights reales
  - Las 4 categorías actuales (`user-need`, `technical`, `business`, `constraint`) son clasificación de claims, no síntesis
- **La jerarquía que debería existir:**
  ```
  Claims/Citas (862 en EXTRACTIONS.md)
    → Observaciones/Hallazgos (~142 en FINDINGS.md)
    → Insights (~20-30 en INSIGHTS_GRAPH.md)
    → Implicaciones de diseño (~10-15 en SYSTEM_MAP.md)
  ```
- **Impacto:** El pipeline trata 142 observaciones crudas como verdades verificadas. /synthesis las aprueba en bloque (no es viable revisar 142 una por una). /ship las referencia como `[IG-XX]` sin distinción de peso — un pain repetido de 5 operadores pesa igual que una mención casual de un doc interno.
- **Decisión: Opción 2 — agregar capa de síntesis.**
  - /analyze extrae observaciones (≈142) en un archivo renombrado (OBSERVATIONS.md o FINDINGS.md)
  - Nueva fase en /synthesis o nuevo skill agrupa observaciones por convergencia y peso → ~20-30 insights reales
  - Cada insight referencia las observaciones que lo soportan: `[IG-05] Refs: [OB-12], [OB-45], [OB-89]`
  - RESEARCH_BRIEF ya modela el output correcto — las secciones temáticas son los insights reales
  - No rompe el pipeline actual — agrega una capa intermedia
- **Relación:** Complementa BUG-08 (attribution) y BUG-10 (duplicación). Con síntesis real, duplicados se fusionan naturalmente y la atribución se preserva como evidencia de soporte.
- **Status:** PROPOSED
