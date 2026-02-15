# Roadmap PD-Spec — Mejoras Post-QA + Learnings Gemini

> Inicio: 2026-02-14
> Fuentes: 61 QA findings (TIMining test) + comparación Gemini vs PD-Spec + backlog BL-01 a BL-14
> Estructura: 4 olas secuenciales. Cada ola depende de la anterior.

---

## Ola 1 — Hardening (Sprint actual)

> Lo que ya existe, que funcione bien. Solo ediciones a SKILL.md existentes + CLAUDE.md template.

### Track 1: /ship fixes

Patrones sistémicos encontrados en 6 outputs (QA-30 a QA-61).

| # | Qué corregir | Patrón | Esfuerzo |
|---|---|---|---|
| 1.1 | `<title>` debe respetar output_language | QA-39, QA-45, QA-50, QA-56 (4/6) | 1 línea |
| 1.2 | Emojis: solo funcionales (✓✗⚠️🔴🟠🟢), no decorativos (💸💎💡🚀😢) | QA-40, QA-42, QA-51, QA-58 (4/6) | 1 párrafo |
| 1.3 | Toda sección debe tener refs [IG-XX] o marcador GAP explícito | QA-32, QA-37, QA-38, QA-43, QA-44, QA-53 (5/6) | Adición clave |
| 1.4 | No repetir contenido entre secciones del mismo doc | QA-41 | 1 línea |
| 1.5 | Headings y labels siempre en output_language, no mezclar idiomas | QA-48, QA-49, QA-57 | 1 párrafo |
| 1.6 | Outputs multi-página: usar `.page` divs separados con page-break-after | QA-52, QA-59 | Agregar al CSS ref |
| 1.7 | doc-meta con changelog obligatorio en TODOS los outputs | QA-46 (REPORT no lo tenía) | Reforzar existente |
| 1.8 | Benchmark: prohibir claims sobre competidores sin fuente [IG-XX] | QA-54 (alucinación) | Crítico |

### Track 2: /analyze fixes

Correcciones de QA-01 a QA-29 (BL-09).

| # | Qué corregir | QA ref | Esfuerzo |
|---|---|---|---|
| 2.1 | Mejorar cross-reference — ejemplos de tensión, buscar contradicciones activamente | QA-03, QA-20 | Medio |
| 2.2 | Requerir cita clave por insight (1-2 oraciones de la fuente) | QA-05 | Bajo |
| 2.3 | Reforzar atomicidad — "una lista de 10 necesidades son 10 insights, no 1" | QA-14 | Bajo |
| 2.4 | Guía de granularidad — cuándo separar vs consolidar | QA-15 | Bajo |
| 2.5 | Formato explícito: `PENDING` no `**PENDING**` | QA-16 | 1 línea |
| 2.6 | Formalizar headers `## Sección` como mecanismo de agrupación | QA-17 | Bajo |
| 2.7 | Cada lado de un conflicto debe referenciar [IG-XX] | QA-19 | Bajo |

### Track 3: Otros skills

| # | Qué corregir | Skill | QA ref | Esfuerzo |
|---|---|---|---|---|
| 3.1 | Validar que IDs de argumentos existan antes de ejecutar | /synthesis | QA-24 | Bajo |
| 3.2 | Unificar Project Context y Project Settings (redundancia) | /kickoff + CLAUDE.md | QA-06 | Bajo |
| 3.3 | Campo Team en template: `[Set by /kickoff]` | CLAUDE.md | QA-07 | 1 línea |
| 3.4 | Formato timestamp correcto en escrituras a MEMORY.md | Todos | QA-02 | Bajo |
| 3.5 | _CONTEXT.md debe seguir _CONTEXT_TEMPLATE.md | /analyze | QA-10 | Bajo |
| 3.6 | Prohibir derivación de insights en _CONTEXT.md | /analyze | QA-11 | Bajo |

### Track 4: Ideas Gemini

Learnings del doc GEMINI_VS_PDSPEC.md — cosas que Gemini hace bien y PD-Spec debería incorporar.

| # | Idea | Origen | Notas |
|---|---|---|---|
| 4.1 | Tag temporal `current`/`aspirational` en insights | BL-10 + Gemini no distingue actual vs futuro | Quick win: PD-Spec ya lo detectó (IG-111-115), formalizar en formato |
| 4.2 | Naming en Design Principles del SYSTEM_MAP | Gemini doc §7.3 | Nombres memorables ("Quiet UI", "The Delta") junto a refs [IG-XX] |
| 4.3 | Reconvertir `/ship benchmark` → benchmark-ux | QA-54 + Gemini doc §2.3 | Referentes diseño inter-industria, NO análisis competitivo. Ver Ola 4 |

### Track 5: Base para lo que viene (si da el tiempo)

No comprometidos para sprint pero se arrancan si los tracks anteriores terminan.

| # | Item | Backlog ref | Notas |
|---|---|---|---|
| 5.1 | Diseñar JSON schema para Research Dashboard | BL-12 | Base para arquitectura template+JSON (Ola 2) |
| 5.2 | Crear /extract SKILL.md | BL-07 | Libera a /analyze de leer archivos (Ola 2) |

### Progreso

| # | Qué | Cuándo |
|---|---|---|
| — | — | — |

---

## Ola 2 — Arquitectura

> Fundación para todo lo demás. Sin esto, las olas 3 y 4 tienen problemas de rendimiento y escalabilidad.

| # | Item | Backlog | Qué resuelve |
|---|---|---|---|
| A1 | `/extract` — skill dedicado de extracción | BL-07 | Separa lectura de archivos de análisis. /analyze deja de hacer dos trabajos. Pipeline: /extract → /analyze |
| A2 | Template estático + JSON para TODOS los outputs | BL-12 + qa-ideas #3 | Agent escribe JSON (~100 líneas), template HTML es estático. Resuelve rendimiento (4-9min → segundos). Aplica a STATUS, PRD, REPORT, todos. |
| A3 | Research Dashboard (reemplaza STATUS.html) | BL-12 + qa-ideas #4 | Workbench interactivo: sidebar, módulos componibles, navegación por secciones. Agent decide módulos y orden via JSON. Template content-agnostic. |

**Dependencias:**
- A2 es prerequisito de A3 (el dashboard usa la arquitectura template+JSON)
- A1 es independiente pero conviene hacerlo primero (simplifica /analyze antes de tocar su output)

---

## Ola 3 — Inteligencia

> Outputs más inteligentes. El agent detecta más, sugiere mejor, y el humano tiene más control.

| # | Item | Backlog | Qué resuelve |
|---|---|---|---|
| I1 | Auto Research Brief en /analyze | BL-13 | Post-extracción: narrativa ejecutiva automática (qué está roto, qué mejorar, qué funciona). Agrupa por temas narrativos, NO por categorías técnicas. |
| I2 | Source diversity gap detection | BL-05 | Detecta si knowledge base está sesgado (todo interviews sin business data, o todo técnico sin user research). |
| I3 | Human calibration layer | BL-04 | "Add context" en dashboard + field notes en 01_Sources/. Canal para intuición profesional sin fricción de escribir un markdown completo. |
| I4 | Convergence tracking | BL-11 | Ratio % de convergencia entre fuentes. "3 de 5 fuentes mencionan X" da peso al insight. |
| I5 | /extract progress indicator | BL-14 | `01_Sources/entrevistas/ — 80% (4/5 files)` durante extracción. |

**Dependencias:**
- I1 depende de Ola 2 A1 (/extract existe, /analyze solo analiza)
- I3 depende de Ola 2 A3 (dashboard tiene infraestructura para "Add context")
- I2, I4, I5 son independientes

---

## Ola 4 — Nuevos outputs

> Expandir lo que PD-Spec puede generar. Cada output nuevo sigue la arquitectura template+JSON de Ola 2.

| # | Item | Backlog | Qué resuelve |
|---|---|---|---|
| O1 | `/ship benchmark-ux` (reconversión de benchmark) | BL-03 + Gemini doc | Reemplaza el benchmark competitivo actual (que alucinó). Genera referentes de diseño inter-industria al estilo Gemini: nombre, industria, "Factor X", patrón aplicable al proyecto. Agrupado por categoría. Trazable a Design Principles. Agent usa web search para encontrar referentes reales. |
| O2 | `/ship persona` | BL-03 | Arquetipos de usuario desde insights `user-need`. Trazable a [IG-XX]. |
| O3 | `/ship journey-map` | BL-03 | Flujo de usuario con pain points y touchpoints. |
| O4 | `/ship lean-canvas` | BL-03 | Business model synthesis desde insights `business`. |
| O5 | `/ship user-stories` (contrato PD-Build) | BL-03 | JTBD-framed stories con acceptance criteria del SYSTEM_MAP. Bridge hacia ejecución. |
| O6 | `/audit` quality gate | BL-02 | Feedback loop: evalúa Work layer antes de /ship. Detecta módulos sin respaldo de user research. |

**Dependencias:**
- Todos dependen de Ola 2 A2 (arquitectura template+JSON)
- O5 depende de O2 (personas alimentan user stories)
- O6 es independiente (puede implementarse en cualquier momento)

---

## Resumen visual

```
Ola 1 (Sprint)          Ola 2 (Arquitectura)      Ola 3 (Inteligencia)     Ola 4 (Outputs)
─────────────────       ──────────────────────     ─────────────────────    ──────────────────
Track 1: /ship x8       A1: /extract              I1: Auto Research Brief  O1: benchmark-ux
Track 2: /analyze x7    A2: Template+JSON         I2: Source diversity     O2: persona
Track 3: Otros x6       A3: Research Dashboard    I3: Human calibration    O3: journey-map
Track 4: Gemini x3                                I4: Convergence %        O4: lean-canvas
Track 5: Prep x2                                  I5: /extract progress    O5: user-stories
                                                                           O6: /audit
────────────────────────────────────────────────────────────────────────────────────────────
22 tareas               3 items                   5 items                  6 items
Solo SKILL.md edits     Arquitectura nueva        Mejoras a skills         Tipos nuevos de /ship
```

## Items descartados o fuera de scope

| Item | Razón |
|---|---|
| BL-01 `/ship design-system` | Cruza a PD-Build |
| BL-06 Design implications | Ya implementado |
| BL-08 Merge /status | Superseded por BL-12 (Research Dashboard) |
| Prototipado funcional (estilo Gemini) | Territorio PD-Build |
| Workshop guide generation | Demasiado específico por ahora |
| `/ship service-blueprint` | Bajo ROI vs otras prioridades. Reevaluar en Ola 4. |
| `/ship success-metrics` | Bajo ROI vs otras prioridades. Reevaluar en Ola 4. |
