# Ideas & Bugs

> Capture ideas and bugs discovered during project work.
> These get formalized as BL items in `docs/BACKLOG.md` on main.
> Format: tag + title + context + proposed fix.

<!-- Example:
### [BUG] — /extract skips photos as "redundant"
**Context:** Testing with 61 files, 27 workshop photos skipped.
**Proposed:** Add mandatory no-skip rule to extract/SKILL.md.
-->

### [BUG] — Live Research App muestra engine_version desactualizado
**Context:** La app lee `engine_version` de `PROJECT.md`, pero ese campo está protegido por `merge=ours` en project branches — nunca se actualiza con merges de main. El header muestra v4.7.0 cuando el engine real es v4.16.0.
**Proposed:** La app debería leer la versión real del engine desde un archivo engine-managed (ej. `docs/CHANGELOG.md` parseando el header más reciente, o un `VERSION` file en el repo). `PROJECT.md` es data del proyecto, no del engine.
**Ref:** `qa` — screenshot sesión 2026-02-22, header "TIMining | V4.7.0"

### [IDEA] — Workbench mode para trabajo fuera del pipeline
`PARKED` — El pipeline no obliga a usarlo. Trabajo ad-hoc ya funciona, loguear a MEMORY es manual pero suficiente. Esperar segundo caso de uso.

**Context:** La sesión de entregables operó 100% sin /ship, creando HTMLs custom directamente desde el Work layer. El pipeline formal no tiene modo para generar artefactos ad-hoc que igualmente queden logueados.
**Proposed:** Modo ligero que permita trabajo libre sobre 02_Work/ y loguee a MEMORY sin requerir skills formales.
**Ref:** `project/timining-entregables` — `02_Work/_temp/SESSION_LOG_2026-02-16.md`

### [IDEA] — Upgrade de template de presentación
`→ BL-15 (absorbed)` — Patrones visuales absorbidos como evidencia para BL-15 (Visual & interaction polish).

**Context:** El HTML manual de la sesión (dark mode, JetBrains Mono, fichas 2x2 con sidebar, timeline D→A→R, light/dark toggle con localStorage, logos Clearbit con fallback) es visualmente superior al template estándar Reveal.js de /ship presentation.
**Proposed:** Incorporar patrones visuales probados al template `presentation.html`.
**Ref:** `project/timining-entregables` — `03_Outputs/presentacion_v3.8_original.html`

### [IDEA] — Checklist de validación para fuentes AI-generated
`→ BL-37` — Problema real alineado con Mandato #1 (No Hallucination). Formalizado como BL-37.

**Context:** Se eliminaron 3 slides Gemini con datos inventados (benchmarks fabricados, métricas ficticias, casos sin trazabilidad). Cuando fuentes AI-generated entran a 01_Sources/, /extract no tiene reglas para detectar hallucinations.
**Proposed:** Reglas adicionales en /extract o /analyze para validar claims de fuentes marcadas como AI-generated.
**Ref:** `project/timining-entregables` — SESSION_LOG, sección "Review final"

### [IDEA] — Benchmark UX organizado por pilares del proyecto
`PARKED` — Patrón posiblemente específico de TIMining. Esperar segundo proyecto que tenga "pilares" definidos.

**Context:** 25 referentes de 15 industrias organizados por pilares del proyecto (no por industria). 3 "champions" por pilar con "qué robar" + conexión a fichas. Patrón superior al template actual de /ship benchmark-ux.
**Proposed:** Opción de organización por pilares/ejes del proyecto en benchmark-ux template.
**Ref:** `project/timining-entregables` — `03_Outputs/BENCHMARK.html`

### [IDEA] — Síntesis de casos de uso en fichas por flujo
`PARKED` — Patrón N→M con trazabilidad ya existe en BL-18 (synthesis layer). Evaluar si `/ship use-cases` agrega valor como tipo separado cuando haya segundo caso.

**Context:** 20 láminas de workshop consolidadas en 6 fichas sintetizadas por flujo de experiencia compartido (no por evento individual). 18/20 cobertura, 0 inventados. Patrón de reducción N→M con trazabilidad.
**Proposed:** Documentar como patrón o skill para consolidar escenarios en fichas sintetizadas.
**Ref:** `project/timining-entregables` — `02_Work/CASOS_DE_USO.md`
