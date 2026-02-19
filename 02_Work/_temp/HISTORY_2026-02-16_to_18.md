# Session Log — 2026-02-16 (late night)

## Branch: working/entregables-timining
Created from test-timining for non-pipeline deliverables work.

## Context
Working on IDEMax/TIMining deliverables for Tuesday meeting (9:30 AM). Preview due this week.

### Three deliverables pending:
1. **Unificar benchmark** — 3 iteraciones de Gemini → versión final organizada por pilares de diseño (no por industria). 2-3 referentes "campeones" por pilar, resto a anexos.
2. **Descripciones de pilares** — refinar los 4 pilares con nombres menos "Gemini" y respaldados con benchmark.
3. **Láminas de introducción por dominio** — 4 dominios operativos con casos agrupados, enfoque en flujos (no perfiles).

## Meeting notes (from user)
- Estructura: 4 dominios operativos como marco principal
- Casos de uso agrupados por dominio, enfoque en flujos, no perfiles
- Link a láminas detalladas en anexos
- Referentes visuales para cada caso
- Pilares necesitan refinamiento — "Inteligencia" requiere mejor definición (multimodal vs agéntica)
- Benchmark organizar por pilares, no industrias
- 2-3 referentes "campeones" por pilar
- Una sola presentación con secciones modulares
- Fuente Impact puede ser muy pesada, explorar alternativas

## Key docs read this session
- `docs/GEMINI_VS_PDSPEC.md` — comparison of Gemini outputs vs PD-Spec insights
- `02_Work/_temp/estrategia_maestra_v3.4.txt` — extracted from Estrategia Maestra v3.4 docx
- All Work layer files (INSIGHTS_GRAPH, CONFLICTS, SYSTEM_MAP)
- PRD.html JSON data

## Pillar discussion — RESOLVED

### Final pillars (approved):
1. **Quiet UI** — Gestión por excepción. Silencio como default. APROBADO.
2. **Clear Path** — Cada pantalla termina en una acción. Patrón D→A→R (Detección → Análisis → Recomendación). PROPUESTO.
3. **Time Sight** — Hindsight/Insight/Foresight. Pasado, presente y futuro en una mirada. PROPUESTO.
4. **Omni Sense** — El sistema percibe, comprende y responde por el canal correcto. Fusión multimodal + agéntico. PROPUESTO.

### Resolution path:
- User pushed back on demoting multimodal: "TIMining está en una cruzada por una experiencia multimodal."
- Resolution: FUSE multimodal + agéntico into one pillar. The multimodal experience IS agéntic by nature — the system chooses the right channel.
- Naming iterations: Live Signal → Multi Signal → Omni Think → **Omni Sense** (triple lectura: sentidos, sensing, "hacer sentido")
- All 4 names follow "Quiet UI" pattern: 2 English words, evocative, tension implícita.

### Documentation:
- Full pillar definitions in `03_Outputs/entregables-timining/PILARES.md`
- Slide 3 of presentation updated with concise cards + rec-boxes

## Other actions this session

### Pipeline work (before entregables):
- Ran /status — updated STATUS.html with post-synthesis state (20 verified, 4 pending conflicts)
- Added field note IG-02: Idemax Stage 2 incomplete, entering Stage 3 without user validation
- Committed all pipeline work to test-timining
- Purged 2 large video files (145MB + 142MB) from git history using git-filter-repo
- Pushed test-timining to origin

### Key insight about Idemax plan:
- We're in week 3-4 of a 10-week plan
- Transitioning from Stage 2 (client experience) to Stage 3 (design guidelines)
- Stage 2's "6 interviews with key users" were never done with actual end users (CF-07)
- Filed as IG-02 (PENDING, constraint)

## 4 Domains — REVISED (user approved)

### Gemini's original grouping:
1. Resiliencia Operacional (Crisis) — L6,7,8,13,14,15,19
2. Continuidad de Procesos — L3,5,9,16
3. Asistencia Agéntica — L10,11,12,18
4. Visión Estratégica — L1,20

### Independent analysis (PD-Spec based):
Analyzed all 20 láminas from EXTRACTIONS.md (Workshop 1/Casos de Uso Workshop 01.docx, claims 1-82) by experience flow, not by role.

### Issues found in Gemini's grouping:
1. **L2 (Planificador Recursos) y L4 (Reunión Diaria CIO) omitidas** — 2 de 20 casos perdidos
2. **L19 (Autónomos) en Crisis** — es post-mortem (fin de semana), no respuesta inmediata. Movida a Estrategia.
3. **L20 (Skynet) como caso de uso** — es visión/concepto aspiracional, no escenario operativo. Sacada a outlier.

### Dominios finales (aprobados):
1. **Respuesta a Crisis** — L6, L7, L8, L13, L14, L15 (6 láminas, 3 cards)
2. **Anticipación Operativa** — L3, L5, L9, L16 (4 láminas, 3 cards)
3. **Asistencia Inteligente** — L4, L10, L11, L12, L18 (5 láminas, 4 cards)
4. **Alineación Estratégica** — L1, L2, L19 (3 láminas, 3 cards)
- Outliers: L17 (diagrama técnico), L20 (visión "Skynet")

### Mapeo dominios → pilares:
- Crisis → Quiet UI (silencio roto por falla)
- Anticipación → Time Sight (foresight)
- Asistencia → Omni Sense (canal correcto)
- Estrategia → Time Sight (hindsight, plan vs realidad)
- Clear Path (D→A→R) es transversal a los 4 dominios.

### Documentation:
- `03_Outputs/entregables-timining/CASOS_DE_USO.md` — documento completo con tablas

## Benchmark — COMPLETED (slide 4 updated)

### Reorganization:
Slide 4 changed from industry table (12 referents) to 4 pillar cards with 2-3 champions each.

### Champions selected:
- **Quiet UI:** CrowdStrike (Achromatic), Motive (99% filter), Compound (Numerical Stillness)
- **Clear Path:** SentinelOne (Purple AI), Vercel v0 (Generative UI), Datadog (Bits AI)
- **Time Sight:** Tesla Fleet (Time Scrubbing), SentinelOne (Storylines), Chronosphere (Lens)
- **Omni Sense:** Motive (multimodal), Discord (PTT voice), Samsara (Connected Workflows)

### Secondary referents (in "También" line per card):
- Quiet UI: SpaceX Dragon HMI, Linear, Polestar, Ramify
- Clear Path: F1 McLaren Atlas, Ramp, Flexport
- Time Sight: Foxglove, Axiom, Adobe Premiere
- Omni Sense: Anduril Lattice OS, Slack, Garmin G3000

### Remaining ~15 referents (appendix candidates):
StarCraft II, EVE Online, Hexagon, TradingView, PagerDuty, NVIDIA Omniverse, Palantir AIP, UniFi Protect, Verkada, QuantConnect, Arc, Wiz, Ramp, Rivian

## Presentation updates completed this session
- Slide 3: Pillar cards with new names, icons, rec-boxes, concise descriptions
- Slide 3: Fixed scroll issue (align-content: start)
- Slide 4: Benchmark reorganized by pillar (4 cards with champions)
- Slide 5: Patterns section updated with new pillar names
- Slide 6: Domain intro cards with pilar tags and lámina counts
- Slide 7: "Respuesta a Crisis" — removed L19, added L13 standalone card
- Slide 8: Renamed to "Anticipación Operativa"
- Slide 9: "Asistencia Inteligente" — added L4 card, changed to 2x2 grid
- Slide 10: "Alineación Estratégica" — added L2/L19, removed L20

## Synthesized use cases — COMPLETED

### Problem with Gemini's 10 Master Cases:
1. **Mixed domains** — "Gestión de Crisis y Falla Operativa" mezcla crisis + falla mecánica + geotecnia (3 flujos distintos)
2. **Invented cases** — #8 (Emergencia Climática), #9 (Auditoría), #10 (Simulación Estratégica) no trazan a láminas del workshop
3. **Weak referents** — Monday.com, Waze, Uber Fleet no están en el benchmark verificado
4. **Old pillar names** — Usa nombres de Gemini, no los aprobados
5. **Lost L10** — Copiloto legal/seguridad desaparece

### Our approach: 6 synthesized fichas
Agrupación por **flujo de experiencia compartido** (no por evento ni por rol). Cada ficha tiene: eje, perfil compuesto, casos que agrupa, contexto, flujo D→A→R con pilares, referente verificado del benchmark, evidencia PD-Spec.

### 6 fichas finales:
1. **Caída de Equipo Crítico** (L8, L13, L14, L15) → Quiet UI → CrowdStrike
2. **Riesgo Espacial y Seguridad** (L6, L7, L12) → Omni Sense → Anduril Lattice OS
3. **Anticipación de Cuello de Botella** (L3, L5, L9, L16) → Time Sight → Chronosphere
4. **Briefing Inteligente** (L4, L18) → Omni Sense → Samsara
5. **Copiloto en Terreno** (L10, L11) → Omni Sense → Discord
6. **Análisis Plan vs Realidad** (L1, L2, L19) → Time Sight → Tesla Fleet

**Cobertura:** 18/20 láminas, 0 casos inventados, 70% de reducción vs 20 originales.
**Documentación:** `03_Outputs/entregables-timining/CASOS_DE_USO.md` — sección "Fichas Sintetizadas"

### Key decisions in this conversation:
- User asked me to synthesize because "los casos tienden a repetirse, le pedí lo mismo a gemini pero falló"
- User reminded me that workshop data was already in EXTRACTIONS.md (I shouldn't have launched an explorer agent)
- User asked to use PD-Spec insights/sourcemaps as evidence grounding
- User asked to keep session log updated for PD-Spec improvement tracking

## Fichas integrated into presentation — COMPLETED
- Replaced slides 7-10 (4 domain detail slides) with slides 7-12 (6 ficha slides)
- Each ficha has: meta bar (domain + pilar + roles + láminas), context paragraph, 4-column D→A→R flow with pilar tags per stage, referent box, evidence refs
- Renumbered all slides: 14 → 16 total
- New structure: Cover(1), Visión(2), Pilares(3), Benchmark(4), Patrones(5), Dominios(6), 6 Fichas(7-12), Retro(13), Fricción(14), Valor(15), Roadmap(16)
- Slide 6 (domain overview) kept as-is — serves as intro before fichas

## Pending work
- CIO vs CEO: RESUELTO — CIO = Centro Integrado de Operaciones (no Chief Information Officer). Se mantiene como está.
- L20 (Skynet): INSERTADA como slide 13 "Visión: Optimización Global Autónoma" justo después de las 6 fichas. Diseño centrado con 3 cards (Cada X min → N simulaciones → "Haz esto"), pilares por card, evidencia al pie.
- Total final: 17 slides (era 14, +6 fichas -4 dominios +1 visión = 17)
- Estructura final (19 slides): Cover(1), Visión(2), Pilares(3), Benchmark(4), Patrones(5), Dominios(6), Ficha 1(7), **VIZ 1 IROC**(8), Ficha 2(9), Ficha 3(10), Ficha 4(11), **VIZ 2 WhatsApp**(12), Ficha 5(13), Ficha 6(14), Skynet(15), Retro(16), Fricción(17), Valor(18), Roadmap(19)

## Visualizaciones placeholder — ADDED
- Slide 8: Placeholder para mockup IROC (Caída de Equipo Crítico). Layout: imagen 16:9 a la izquierda + 2 cards descriptivas (Quiet UI + Clear Path) + referente visual a la derecha.
- Slide 12: Placeholder para mockup WhatsApp (Briefing Inteligente / Sofía). Layout invertido: cards Omni Sense + Time Sight a la izquierda + imagen móvil a la derecha.
- Prompts para nanobanana escritos y entregados al usuario.
- Mockup 1: CrowdStrike Achromatic + Mine Pit Map + 3 opciones rankeadas
- Mockup 2: WhatsApp dark mode, chat TIM→Sofía con métricas + mapa 2D + quick replies

## Session 2 — 2026-02-17

### Mockup IROC v1 — feedback
- Gemini generó mockup de pantalla sola (monitor en fondo oscuro). UI buena: mapa topográfico + 3 opciones rankeadas + status bar.
- **Feedback usuario:** "queda bien pero está muy pantalla sola. Debería estar en una sala IROC con personas."
- **Decisión:** Rehacer prompt con sala IROC completa — operadores, múltiples pantallas, iluminación ambiental cyan.

### Concepto Timeline por ficha — APROBADO
- Cada ficha tendrá 2 slides: (A) la ficha abstracta D→A→R, (B) timeline simplificado del caso con marcador "estás aquí" + visualización en el momento exacto.
- Permite mostrar diferentes etapas del D→A→R en distintas fichas.
- Mapeo propuesto de visualizaciones por etapa:
  - Ficha 1 (Caída Equipo/IROC): **R** — Recomendación (sala IROC, 3 opciones)
  - Ficha 2 (Riesgo Espacial): **D** — Detección (alerta multimodal terreno)
  - Ficha 3 (Anticipación): **A** — Análisis (timeline predictivo)
  - Ficha 4 (Briefing/WhatsApp): **D** — Detección (push + chat)
  - Ficha 5 (Copiloto Terreno): **A** — Análisis (wearable/móvil)
  - Ficha 6 (Plan vs Realidad): **A** — Análisis (dashboard comparativo)
- No todas necesitan mockup ahora — con 2 (IROC + WhatsApp) se demuestra el patrón.

### Prompt IROC v2 (sala con personas) — ENTREGADO
```
Photorealistic interior of a mining Integrated Remote Operations Center (IROC). Dark room, 3 operators seated at curved console desks viewed from behind/side angle. Main wall-mounted large display (80") shows a mine pit topographic map on the left with a pulsing cyan marker labeled "SHOVEL DOWN EX-1102" and a restricted zone in red, and on the right panel "3 OPTIONS: SHOVEL EX-1102 RECOVERY" with three ranked action cards — option 1 highlighted in cyan border, options 2 and 3 in dark gray. Bottom status bar reads "FLEET: 42 ACTIVE | ALERTS: 1 CRITICAL | SHIFT TIME: 05:14:22". Secondary monitors at each workstation show fleet dashboards and KPI graphs. Ambient lighting comes only from screens — soft cyan glow on operators' faces and desk surfaces. Color palette: near-black backgrounds, cyan (#00FFCC) accents, dark gray cards, white text. Atmosphere of focused calm — quiet urgency, not panic. No decorative elements. Clean, minimal, CrowdStrike-meets-NASA aesthetic. The room conveys: the system already analyzed the situation and is recommending what to do next. Cinematic composition, shallow depth of field on the nearest operator, 16:9 aspect ratio.
```
- Notas: operadores de espaldas (evita caras), "focused calm" refuerza Quiet UI, shallow DOF disimula detalles débiles del generador.

### Mockup IROC v2 resultado — APROBADO
- Gemini generó sala IROC con 3 operadores, pantallas secundarias (fleet, cámaras, tonelaje), glow cyan.
- Composición cinematográfica diagonal, operadores de espaldas/perfil.
- UI principal legible: mapa topográfico + 3 opciones + status bar.
- Único ajuste menor: texto panel derecho un poco apretado, pero aceptable para presentación.
- **Archivo:** `/Users/nlundin/Downloads/Gemini_Generated_Image_ds5285ds5285ds52.png`
- **Estado:** APROBADO como visual para Ficha 1 (Caída Equipo Crítico — etapa R: Recomendación)

### Layout fichas — DECISIÓN
- Usuario mostró slide de presentación Idemax con layout 2x2 + sidebar dominio vertical.
- Estructura: Header (título + láminas) | Sidebar dominio | Perfil | Flujo D→A→R | Contexto | Referente
- Nuestro contenido ya mapea 1:1. Adaptaremos a nuestro estilo visual (dark, no teal).
- Cada ficha tendrá 2 slides: (A) layout 2x2 tipo Idemax, (B) timeline + visualización.

### Prompt WhatsApp (Briefing Inteligente — etapa D) — ENTREGADO
```
Photorealistic close-up of a smartphone held in a gloved hand (mining safety gloves, dusty). The phone screen shows a WhatsApp dark mode conversation. Chat header shows "TIM" with a small green dot (online) and a subtle bot icon. The most recent messages from TIM show: a compact card with shift KPIs (tonnage, fleet status, pending alerts in cyan numbers), a small 2D mine map thumbnail with colored dots representing fleet positions, and a text message "Turno noche cerró al 87% de meta. 2 alertas pendientes. ¿Revisamos antes del briefing?". Below: three WhatsApp quick-reply buttons in a row: "Ver detalle", "Agendar briefing", "Todo OK". The phone is slightly tilted. Background out of focus: early morning mining pit landscape at dawn, golden hour light on the horizon contrasting with the cool phone screen glow on the glove. A hard hat edge visible at the bottom corner of frame. The mood is: calm start of shift, the system already prepared everything. No other people visible. Cinematic, shallow depth of field focused on the phone screen, 16:9 aspect ratio.
```
- Contexto: Ficha 4 (Briefing Inteligente), etapa D (Detección). Omni Sense — canal correcto.
- TIM = asistente del sistema (de fuentes workshop). Quick replies = acción inmediata.
- Dawn/golden hour vs glow frío del teléfono = contraste analógico/digital.

### Fichas reestructuradas — layout 2x2 + sidebar — DONE
- 6 fichas convertidas de layout lineal (meta → context → 4 cards → referent) a layout 2x2 + sidebar vertical
- Estructura por ficha: Header (Caso #N + subtitle con láminas) → Sidebar (dominio) → 2x2 grid:
  - Top-left: PERFIL (roles + rol + necesidad + dolor)
  - Top-right: FLUJO D→A→R (timeline visual con dots + stage labels + descripciones + valor bar)
  - Bottom-left: CONTEXTO (detonante + dónde + situación crítica)
  - Bottom-right: REFERENTE (qué es + qué hace + adaptación + evidence refs)
- CSS nuevo: `.ficha-container`, `.ficha-sidebar`, `.ficha-grid`, `.ficha-cell`, `.dar-timeline`, `.dar-stage`, `.dar-dot`, `.dar-stage-label`, `.dar-stage-desc`, `.valor-bar`, `.perfil-item`, `.contexto-item`, `.referente-section`, `.referente-detail`, `.evidence-refs`
- Contenido derivado de CASOS_DE_USO.md — no se inventó nada, todo traza a fuentes originales
- Slides de visualización (8 y 12) no se modificaron aún

### Ajustes visuales globales — DONE
- **Escala tipográfica fichas:** Subida completa. Mínimo 11px (era 9px). Body text 14px, labels 13px, badges 11px, evidence 11px, stage labels 12px, h3 fichas 15px.
- **Títulos globales:** `.slide-title` de 24px → 30px (+25%) en todas las slides.
- **Background global:** `--bg-color` de `#050505` → `#0a0f12` (negro con tinte azulado oscuro).
- **Ficha grid:** Líneas divisorias `#1a2028` (coherente con tinte azulado). Celdas usan `var(--bg-color)`.
- **Sidebar:** Width 38px → 42px, font 12px.

### Mockup WhatsApp/TIM resultado — APROBADO
- Gemini generó vista móvil en mano con guante minero + casco + pit al fondo (golden hour).
- UI se lee como app propia de TIM (no WhatsApp puro) — mejor para la narrativa.
- Contenido: bot icon TIM, KPIs (87% meta, 42 active, 2 alertas rojo), mapa topográfico con dots, mensaje español, 3 quick replies.
- **Archivo:** `/Users/nlundin/Downloads/Gemini_Generated_Image_dk5vzjdk5vzjdk5v.png`
- **Estado:** APROBADO como visual para Ficha 4 (Briefing Inteligente — etapa D: Detección)

### Pending this session
- [x] Mockup IROC v2 con sala y personas — DONE
- [x] Prompt WhatsApp — ENTREGADO
- [x] Reestructurar fichas en presentación con layout 2x2 — DONE
- [x] Review visual + ajustes de escala tipográfica — DONE
- [x] Mockup WhatsApp/TIM resultado — APROBADO
- [x] Integrar mockups en slides de visualización (8 y 12) — DONE (iroc_mockup.png + wsp_mockup.png)
- [x] Prompts para fichas 2, 3, 5, 6 — ENTREGADOS

### Prompts fichas restantes — ENTREGADOS
- **Ficha 2 (Riesgo Espacial — D):** Monitor con mapa geotécnico, zona restringida roja, overlay de sensores (ARIS + GPS + prismas), alerta pala en zona de riesgo.
- **Ficha 3 (Anticipación — A):** Over-the-shoulder planificador, timeline predictivo con "BLOQUEO CHANCADOR 45 MIN", impacto aguas abajo, amber para predicciones.
- **Ficha 5 (Copiloto — A):** Interior camioneta, smartphone en dashboard con voice assistant, respuesta "BERMA CUMPLE ESTÁNDAR", foto thumbnail, radio pendiente.
- **Ficha 6 (Plan vs Realidad — A):** Oficina/sala reunión, split dashboard Plan vs Realidad, Time Scrubbing bar, anomalías autónomos, causa raíz, 2 personas de espaldas.

### Slides VIZ creados + renumeración — DONE
- 4 nuevos VIZ slides insertados con placeholders + onerror fallback "MOCKUP PENDIENTE"
- D→A→R timeline bar con etapa activa en cyan por ficha
- Renumeración completa: 19 → 23 slides. JS usa slides.length dinámico.
- Filenames esperados: `riesgo_mockup.png`, `anticipacion_mockup.png`, `copiloto_mockup.png`, `plan_realidad_mockup.png`

### Estructura final (23 slides):
01 Cover | 02 Visión | 03 Pilares | 04 Benchmark | 05 Patrones | 06 Dominios
07 Ficha 1 | 08 VIZ 1 IROC ✅ | 09 Ficha 2 | 10 VIZ 2 Riesgo ⏳
11 Ficha 3 | 12 VIZ 3 Anticipación ⏳ | 13 Ficha 4 | 14 VIZ 4 WhatsApp ✅
15 Ficha 5 | 16 VIZ 5 Copiloto ⏳ | 17 Ficha 6 | 18 VIZ 6 Plan vs Real ⏳
19 Skynet | 20 Retro | 21 Fricción | 22 Valor | 23 Roadmap

### Mockups fichas 2, 3, 5, 6 — INTEGRADOS
- Archivos reales tenían nombres distintos a los esperados. Corregido en HTML:
  - `riesgo-geo.png` (Ficha 2, VIZ slide 10)
  - `bloqueo-chancador.png` (Ficha 3, VIZ slide 12)
  - `Copiloto en Terreno.png` (Ficha 5, VIZ slide 16)
  - `Plan vs Realidad.png` (Ficha 6, VIZ slide 18)
- **Estado:** 6/6 mockups integrados. Presentación completa con 23 slides.

### Review final — APROBADO
- **Revisadas 23 slides.** Identificados 3 slides con residuo Gemini y 3 slides que necesitan limpieza.
- **ELIMINAR:**
  - Slide 5 (Patrones) — redundante con slide 3 (Pilares). Repite mismos conceptos sin agregar.
  - Slide 21 (Fricción) — alucinación Gemini. "Mapa de Calor de Fricción" con datos inventados (e.g., "3D hace acción 8s → Aware 23s").
  - Slide 22 (Valor) — alucinación Gemini. "Propuesta de Valor" con métricas ficticias ("$20M en decisiones subóptimas").
- **LIMPIAR:**
  - Slide 1 (Cover) — quitar "v3.8 →", actualizar tagline de "Redefiniendo..." a algo más preciso.
  - Slide 20 (Retro) — limpiar texto Gemini ("esta sección captura..."), mantener solo observaciones con evidencia.
  - Slide 23 (Roadmap) — alinear con pilares aprobados (Quiet UI, Clear Path, Time Sight, Omni Sense).
- **Resultado:** 23 → 20 slides. Más compacta, sin Gemini residual.

### Limpieza ejecutada — DONE
- Eliminado slide 5 (Patrones & Convergencia Técnica) — redundante con slide 3
- Eliminado slide 21 (Diagnóstico de Fricción) — alucinación Gemini
- Eliminado slide 22 (Arquitectura de Valor) — alucinación Gemini
- Actualizado slide 1 (Cover) — quitado "DOC MAESTRO v3.8", tagline → "Estrategia de Producto & Experiencia de Usuario"
- Actualizado slide 20 (Roadmap) — 3 pasos alineados con pilares: Identidad Visual CORE (Quiet UI), Prototipo Caso Piloto (Clear Path D→A→R), Arquitectura de Integración (Time Sight + Omni Sense)
- Renumeración completa: 23 → 20 slides. IDs y contadores verificados.

### Estructura final (20 slides):
01 Cover | 02 Visión | 03 Pilares | 04 Benchmark
05 Dominios
06 Ficha 1 | 07 VIZ 1 IROC | 08 Ficha 2 | 09 VIZ 2 Riesgo
10 Ficha 3 | 11 VIZ 3 Anticipación | 12 Ficha 4 | 13 VIZ 4 WhatsApp
14 Ficha 5 | 15 VIZ 5 Copiloto | 16 Ficha 6 | 17 VIZ 6 Plan vs Real
18 Skynet | 19 Retro | 20 Roadmap

### Tipografía — jerarquía ajustada — DONE
- h1 (cover): 64px JetBrains Mono (agregado font-family)
- .slide-title (h2): 30px JetBrains Mono, weight 500 (agregado font-family + weight)
- h3 (section labels): 13px JetBrains Mono (era 12px)
- h4 (card titles): 17px JetBrains Mono (era 15px Inter, ahora mono + más grande)
- p (body text): 13.5px Inter — sin cambio
- Regla: Mono para títulos y labels, Inter solo para párrafos

### Referentes con logo + link — DONE
- 6 fichas actualizadas con `.referente-header`: logo inline (clearbit 28px con fallback onerror) + nombre como link externo
- CrowdStrike → crowdstrike.com
- Anduril Lattice OS → anduril.com/lattice
- Chronosphere → chronosphere.io
- Samsara → samsara.com
- Discord → discord.com
- Tesla Fleet → tesla.com/fleet
- CSS nuevo: `.referente-header`, `.referente-logo`, `.referente-link`

### Hoja de ruta reescrita — DONE
- Alineada con plan Idemax (4 etapas, 10 semanas)
- Barra de progreso visual con "estamos aquí" (sem 4)
- 4 cards por etapa: Inmersión (COMPLETADA), Experiencia (PARCIAL — gap entrevistas usuarios), Lineamientos (EN CURSO), Comunicación (PENDIENTE)
- 2 rec-boxes: siguiente paso inmediato + riesgo a mitigar (entrevistas terreno)
- Conecta directamente con IG-02 (gap Etapa 2) y CF-07 (entrevistas en mina)

### Pending this session
- [x] Todos los mockups integrados — DONE
- [x] Review final de la presentación — DONE
- [x] Limpieza (eliminar 3 slides, actualizar 2, renumerar) — DONE
- [x] Referentes con logo + link — DONE
- [x] Tipografía jerarquía mono/sans — DONE
- [x] Hoja de ruta alineada con Idemax — DONE

### BENCHMARK.html — Consolidado de referentes — DONE
- 25 referentes de 15 industrias organizados por los 4 pilares
- 12 champions (3 por pilar) con análisis detallado: Factor X, "Qué robar", conexión a fichas
- 13 referentes secundarios con patrones complementarios
- Cada referente: logo (Clearbit), link externo, badge industria, análisis
- Tablas resumen: conteo por pilar + mapeo fichas→referentes
- Archivo: `03_Outputs/entregables-timining/BENCHMARK.html`

### Light/Dark toggle — DONE
- Agregado switch light/dark a los 4 entregables (PILARES, CASOS_DE_USO, BENCHMARK, presentación)
- Documentos: toggle 36px top-right, CSS variables con `[data-theme="light"]`
- Presentación: toggle 48px bottom-left, `!important` para override inline styles, attribute selectors
- Persistencia vía localStorage (key: `pd-theme`, compartida entre archivos)

### Investigación de fuentes — DONE
- **IG-SYNTH-17 (adopción bottom-up):** 5 fuentes — Evolution deck (3 claims), Narrativa CCB, Workshop PPT, Design Brief, GEMINI exercises PDF
- **"Aware USD 300k/año":** 1 sola fuente — Design Brief (claim 13). Fragile.
- **USD 450k:** 4 fuentes — transcript, analysis, Sello PPT, Design Brief
- **"iPhone-like" origen real:** Philippe (CEO) en Workshop 01 transcript. Cita: "si abro el IOS del celular..." y "te compráis un auto que es más caro, cuando lo abrís se tiene que ver diferente". Sello de Experiencia PPT (Idemax) lo etiquetó como "iPhone-like" pero es fuente derivada, no primaria.
- **Sello de Experiencia TIMINING.pptx:** Identificada como fuente derivada/retroalimentada de Idemax (consultora), no fuente primaria independiente.

### Commit & Push — DONE
- `0ed74ee` — docs: add HTML reports (pilares, casos de uso, benchmark) + light/dark toggle
- Pushed to `working/entregables-timining`

## Session 3 — 2026-02-18 (cont.)

### Auditoría fichas vs visualizaciones — DONE
- Revisadas las 8 fichas + 8 slides de visualización post-reescritura narrativa (commit `02a7bc9`).
- **5/8 alineados:** Casos #1, #2, #4, #6, #7 — narrativa ficha ↔ sidebar viz coherentes, pilares coinciden.
- **3/8 con desalineación detectada:**

#### Caso #3 — Anticipación de Cuello de Botella
- **Problema:** La reescritura narrativa desplazó E2 Análisis de "impacto aguas abajo" (Time Sight) a "notificación multicanal" (Omni Sense), pero el pilar asignado seguía siendo Time Sight y el referente (Tesla Fleet) no calzaba.
- **Decisión usuario:** Mantener E2 como impacto/análisis (Time Sight).
- **Fix:** Narrativa E2 reescrita a "Impacto aguas abajo calculado antes del bloqueo: tonelaje perdido por hora, costo acumulado, áreas afectadas en cascada."
- **Inconsistencia extra:** CASOS_DE_USO.md decía "Omni Sense" como pilar de E2 (distinto al "Time Sight" de la presentación). Corregido a Time Sight + narrativa alineada.

#### Caso #8 — Reportería Ejecutiva
- **Problema:** Viz sidebar decía "Time Sight + Clear Path" pero el momento destacado es D (Detección) que la ficha asigna a Omni Sense. El sidebar no mencionaba Omni Sense.
- **Fix:** Pilares en sidebar corregidos a "Omni Sense + Time Sight". Descripción ajustada.

#### Caso #5 — Copiloto en Terreno (menor, no corregido)
- E2 Análisis etiquetado como Omni Sense pero describe cruce analítico con normativa (más Clear Path). El sidebar de la viz ya dice "Omni Sense + Clear Path" — más preciso que la ficha. Pendiente de decisión.

### Patrón observado
- En casos de Dominio C (Asistencia Inteligente), la narrativa E2 tiende a describir *cómo llega* la info (Omni Sense) pero el análisis real es *qué procesamiento hace* (Time Sight/Clear Path). Tensión recurrente entre canal y contenido en etapa de análisis.

### Commit — DONE
- `d33cca4` — fix: alinear pilares y narrativas en casos #3 y #8
- 3 edits: presentacion_v4.html (ficha #3 E2 + viz #8 sidebar) + CASOS_DE_USO.md (ficha #3 E2)

### Estructura final (24 slides — sin cambio):
01 Cover | 02 Visión | 03 Pilares | 04 Benchmark
05 Dominios
06 Ficha 1 | 07 VIZ 1 IROC | 08 Ficha 2 | 09 VIZ 2 Riesgo
10 Ficha 3 | 11 VIZ 3 Anticipación | 12 Ficha 4 | 13 VIZ 4 WhatsApp
14 Ficha 5 | 15 VIZ 5 Copiloto | 16 Ficha 6 | 17 VIZ 6 Plan vs Real
18 Ficha 7 | 19 VIZ 7 Optimización | 20 Ficha 8 | 21 VIZ 8 Reportería
22 Skynet | 23 Retro | 24 Roadmap

### Prompts mockups — 8/8 listos

Tabla de variación:

| Ficha | Etapa | Contexto visual | Dispositivo | Archivo |
|-------|-------|----------------|-------------|---------|
| 1 | R | Sala IROC, 3 operadores | Pantalla mural | viz-01-iroc.png |
| 2 | D | Estación monitoreo, sensores | Monitor curvo | viz-02-riesgo-geo.png |
| 3 | A | Oficina planificación, mañana | Monitor escritorio | viz-03-anticipacion.png |
| 4 | D | Terreno, golden hour | Móvil en mano | viz-04-briefing.png |
| 5 | A | Camioneta minera, polvo | Móvil en dashboard | viz-05-copiloto.png |
| 6 | A | Sala reunión ejecutiva | Pantalla mural | viz-06-plan-vs-real.png |
| 7 | R | Oficina planificación, mañana | Monitor escritorio | viz-07-optimizacion.png |
| 8 | D | Boardroom, directorio | Tablet en manos | viz-08-reporteria.png |

#### Prompt 1 — Sala IROC (Caso #1: Caída de Equipo Crítico — R)
```
Photorealistic interior of a mining Integrated Remote Operations Center (IROC). Dark room, 3 operators seated at curved console desks viewed from behind/side angle. Main wall-mounted large display (80") shows a mine pit topographic map on the left with a pulsing cyan marker labeled "SHOVEL DOWN EX-1102" and a restricted zone in red, and on the right panel "3 OPTIONS: SHOVEL EX-1102 RECOVERY" with three ranked action cards — option 1 highlighted in cyan border, options 2 and 3 in dark gray. Bottom status bar reads "FLEET: 42 ACTIVE | ALERTS: 1 CRITICAL | SHIFT TIME: 05:14:22". Secondary monitors at each workstation show fleet dashboards and KPI graphs. Ambient lighting comes only from screens — soft cyan glow on operators' faces and desk surfaces. Color palette: near-black backgrounds, cyan (#00FFCC) accents, dark gray cards, white text. Atmosphere of focused calm — quiet urgency, not panic. No decorative elements. Clean, minimal, CrowdStrike-meets-NASA aesthetic. The room conveys: the system already analyzed the situation and is recommending what to do next. Cinematic composition, shallow depth of field on the nearest operator, 16:9 aspect ratio.
```
Notas: Operadores de espaldas (evita caras). "Focused calm" refuerza Quiet UI. Shallow DOF disimula detalles débiles del generador.

#### Prompt 2 — Riesgo Geotécnico (Caso #2: Riesgo Espacial y Seguridad — D)
```
Photorealistic mining operations monitoring station. Close-up of a large curved monitor showing a 2D mine pit map with topographic contour lines. A red pulsing restricted zone is highlighted with label "ZONA RESTRINGIDA — RIESGO GEOTÉCNICO" and a shovel icon inside the zone with warning indicator. Multiple sensor overlays visible: radar sweep lines (subtle green), GPS dots for equipment positions (cyan dots for safe, yellow for near-zone, red for inside restricted zone), and prisma monitoring points as small triangles. A second smaller monitor to the side shows real-time ARIS geotechnical data graphs (displacement curves). The main screen has an alert banner at top: "ALERTA: PALA EX-205 EN ZONA DE RIESGO — CONFIRMAR EVACUACIÓN". Operator's hand on mouse visible in foreground, headset cord visible. Dark room, screens as primary light source. Color palette: dark backgrounds, red for danger zones, cyan for safe equipment, yellow for warnings. The mood is: focused vigilance, the system detected the risk before the human noticed. Cinematic, 16:9 aspect ratio.
```

#### Prompt 3 — Timeline Predictivo (Caso #3: Anticipación de Cuello de Botella — A)
```
Photorealistic over-the-shoulder view of a mining operations planner sitting at a desk, looking at a wide monitor. The screen shows a predictive timeline interface: horizontal time axis spanning the current shift (6 AM to 6 PM), with a vertical "NOW" marker and a projected event 45 minutes ahead highlighted in amber — "BLOQUEO CHANCADOR — 45 MIN". Below the timeline, a flow diagram shows tonnage throughput declining toward the blockage point, with a red projected dip. Side panel shows cascading impact: "Impacto aguas abajo: Stockpile +2h, Planta -15% turno, KPI tonelaje en riesgo". The interface is clean, dark mode, with amber/yellow for predictions and cyan for current data. Office environment visible in background blur — mining operations planning room with whiteboards and printed schedules on walls. Natural morning light from a window mixing with screen glow. The mood is: calm anticipation, there's still time to act. Cinematic, shallow depth of field on screen, 16:9 aspect ratio.
```

#### Prompt 4 — WhatsApp Briefing (Caso #4: Briefing Inteligente — D)
```
Photorealistic close-up of a smartphone held in a gloved hand (mining safety gloves, dusty). The phone screen shows a WhatsApp dark mode conversation. Chat header shows "TIM" with a small green dot (online) and a subtle bot icon. The most recent messages from TIM show: a compact card with shift KPIs (tonnage, fleet status, pending alerts in cyan numbers), a small 2D mine map thumbnail with colored dots representing fleet positions, and a text message "Turno noche cerró al 87% de meta. 2 alertas pendientes. ¿Revisamos antes del briefing?". Below: three WhatsApp quick-reply buttons in a row: "Ver detalle", "Agendar briefing", "Todo OK". The phone is slightly tilted. Background out of focus: early morning mining pit landscape at dawn, golden hour light on the horizon contrasting with the cool phone screen glow on the glove. A hard hat edge visible at the bottom corner of frame. The mood is: calm start of shift, the system already prepared everything. No other people visible. Cinematic, shallow depth of field focused on the phone screen, 16:9 aspect ratio.
```

#### Prompt 5 — Copiloto en Terreno (Caso #5: Copiloto en Terreno — A)
```
Photorealistic view from inside a mining pickup truck cab. A smartphone mounted on the dashboard shows a voice assistant interface: waveform visualization at top indicating active listening, and below it a response card: "BERMA CUMPLE ESTÁNDAR SERNAGEOMIN — Altura: 1.8m (mín. 1.5m). Ancho: 2.1m (mín. 1.8m). ✓ CONFORME". A small photo thumbnail shows the berma the user just photographed. Below the response, a subtle list: "Radio pendiente: 3 solicitudes priorizadas" with colored priority dots. Through the truck windshield, a dusty mining haul road is visible with a large dump truck ahead. The driver's hands are on the steering wheel wearing work gloves, dashboard instruments partially visible. Afternoon light, dust particles in the air. Color palette: warm dusty exterior vs cool dark phone UI with cyan accents. The mood is: hands-free assistance, the system confirms compliance without stopping work. Cinematic, shallow depth of field focused on phone screen, 16:9 aspect ratio.
```

#### Prompt 6 — Plan vs Realidad (Caso #6: Análisis Plan vs Realidad — A)
```
Photorealistic mining executive's office or meeting room. A large wall-mounted screen shows a split-view dashboard: left side "PLAN" with projected tonnage curves in cyan, right side "REALIDAD" with actual data in white — a visible gap between the two lines highlighted in red. Below the comparison, a "Time Scrubbing" bar shows the past week timeline with selectable segments. A detail panel shows autonomous truck positions plotted on a mine map with red markers where trucks stopped unexpectedly, labeled "ANOMALÍAS DETECTADAS: 12 PARADAS NO PROGRAMADAS". Bottom section: "CAUSA RAÍZ: Interferencia antena Sector Norte — correlación 87%". Two people visible from behind: a mine manager in a polo shirt and a planner with a laptop open, both looking at the screen. Conference table with coffee cups, printed reports. Morning light through blinds. Professional but operational atmosphere — not corporate, mining. Cinematic, 16:9 aspect ratio.
```

#### Prompt 7 — Optimización del Plan (Caso #7: Optimización del Plan Minero — R) [v3 — sala de reunión + laptop]
```
Photorealistic view of an open laptop on a conference table during a monthly planning meeting. The laptop screen displays a dark-mode dashboard titled "ORCHESTRA SIMULATION" in small monospace text at the top right. The main visualization is a mine pit map viewed from above with two clearly labeled phase zones: "FASE NORTE" highlighted in green (60% label) and "FASE SUR" in amber (40% label), showing the recommended effort redistribution. To the right of the map, a 4-week timeline (Semana 5–8) shows two projection lines: a white dashed line "ACTUAL TRAJECTORY" trending flat, and a cyan solid line "OPTIMIZED" curving upward — the gap between them shaded in cyan, labeled "+8%". Below the timeline, a recommendation bar with a cyan left border reads: "CONFIGURACIÓN RECOMENDADA: 60% Fase Norte / 40% Fase Sur — Semanas 5-8. Valor: USD 4.2M/mes". The laptop sits slightly angled on a dark conference table. Background out of focus: a meeting room with 2-3 people visible from behind or in silhouette, a whiteboard with mine phase diagrams, printed maps pinned to the wall, morning light through blinds. A coffee cup and printed reports beside the laptop. Color palette: near-black laptop screen, green for recommended phase, amber for reduced phase, cyan for projections. The mood is: strategic decision — the team is about to change the plan, not patch a shift. Cinematic, shallow depth of field focused on laptop screen, 16:9 aspect ratio.
```
Notas: Laptop en sala de reunión (no monitor de escritorio) ancla la decisión en contexto estratégico/colectivo. Personas en silhouette evitan caras AI. Mapa de fases refuerza decisión sistémica. 4 semanas marca horizonte estratégico. Diferencia visual clara vs Ficha 3 (oficina individual) y Ficha 6 (pantalla mural).

#### Prompt 8 — Reportería Ejecutiva (Caso #8: Reportería Ejecutiva — D)
```
Photorealistic view of a CFO's hands holding a tablet (iPad dark mode) at a conference table. The screen shows an executive dashboard titled "EXECUTIVE DASHBOARD" with subtitle "Viernes 3 PM · AUTO-GENERATED" in small monospace. Four KPI cards in a row, each with a luminous semaphore dot: "Adherencia Plan 92%" (green dot), "Producción Turno 145kt" (amber dot, slightly pulsing), "Seguridad 0 incidentes" (green dot), "Valor Capturado $1.2M" (cyan dot). Below the KPI row, the amber card is expanded into a drill-down section with label "DRILL-DOWN" in amber and text: "Turno noche: -18% vs plan. Causa: 14 paradas autónomos Sector Norte. Costo: USD 340k". At the bottom, a projection bar with cyan left border: "Ritmo actual cierra -12%. Con intervención: +3%. Delta: USD 1.8M". The tablet is held at a slight angle over a dark conference table. Background out of focus: a boardroom with glass walls, blurred silhouettes of 3-4 people seated, presentation screen glowing at the far end. The CFO wears a dress shirt cuff visible at wrist — no face, no full body. Professional executive atmosphere, not operational. Color palette: near-black UI, 95% achromatic, color only in semaphore dots and data highlights. The mood is: the answer is already in his hands, in his language. Cinematic, shallow depth of field on tablet screen, 16:9 aspect ratio.
```
Notas: Tablet (no monitor) refuerza Omni Sense — reporte llegó al dispositivo del CFO. Boardroom difuminado da contexto ejecutivo sin generar caras. "AUTO-GENERATED" = Erika ya no arma PDFs. Solo manos + puño de camisa = ejecutivo sin riesgo de cara AI.

### Mockups generados — 8/8 COMPLETOS
- **viz-07-optimizacion.png:** Laptop en mesa de reuniones, "ORCHESTRA SIMULATION", mapa fases 60/40 Norte/Sur, curva +8%, USD 4.2M. Pizarrón "MINE PHASE" al fondo. Consistente con narrativa reunión mensual.
- **viz-08-reporteria.png:** Tablet en manos CFO, 4 KPIs (Adherencia 92%, Producción 145kt, Seguridad 0, Yield $1.2M), semáforos, barra proyección con intervención. Boardroom al fondo.
- **Estado:** 8/8 mockups integrados. Sin observaciones críticas.

### Procesamiento transcript reunión Camila — 12 items extraídos
- Transcript completo (líneas 146+) procesado para identificar mejoras a la presentación discutidas pero no traspasadas.
- **12 items identificados**, priorizados en 3 niveles (alta/media/baja).
- Items de prioridad alta implementados (ver abajo). Item 4 (referentes por etapa DAR) confirmado OK. Items 7-12 diferidos a post-jueves.

### Mejoras aplicadas a la presentación — 3 commits

#### Commit `3328ec2` — DAR visual + transición + reglas pilares
1. **Slide 02 (Visión):** DAR badge visual (`D→A→R` coloreado rojo/naranja/cyan) en card "El Salto de Modelo". Texto reescrito: "Un patrón único en los 8 casos: D→A→R — Detecta, Analiza, Recomienda."
2. **Slide 18 (NUEVO):** Transición "De Cumplir a Optimizar". Layout 2 columnas con línea divisoria. Izquierda: "Casos 1–6 / Cumplir el Plan" (blanco). Derecha: "Casos 7–8 / Optimizar el Plan" (cyan). Usa dar-badge. Pausa narrativa antes de casos aspiracionales.
3. **Slide 03 (Pilares):** 3 reglas operativas concretas por pilar con `code` cyan:
   - Quiet UI: 95% acromático, sin alerta = todo bien, 0 notificaciones sin acción
   - Clear Path: máx. 3 opciones, cada pantalla termina en acción, impacto cuantificado
   - Time Sight: timestamp visible, 3 capas temporal, delays explícitos
   - Omni Sense: canal = contexto, misma inteligencia distinto formato, sistema inicia
4. **Títulos pilares large:** `.pilar-title` a 22px (antes ~13px).
5. **CSS reutilizable:** `.dar-badge` (D→A→R token), `.pilar-rules` (lista reglas), `.pilar-title`
6. **Renumeración:** 24 → 25 slides.

#### Commit `7eaa004` — Visión Skynet + Dominio D multi-pilar
7. **Slide 23 (Visión Skynet):** 2 cards nuevos:
   - "Urgente vs Importante" — ejemplo Pedro/Juan (arreglar camino vs redirigir = 30% más). CORE prioriza lo importante de cara al plan.
   - "Hub de Decisiones" — decisiones dentro del software, cada acción logueada, sistema aprende (opción D del experto → opción A del siguiente turno).
8. **Slide 05 (Dominios):** Dominio D actualizado de "Time Sight" a "Multi-pilar" + descripción ampliada.

### Estructura final (25 slides):
01 Cover | 02 Visión (+ DAR) | 03 Pilares (+ reglas) | 04 Benchmark
05 Dominios (D multi-pilar)
06 Ficha 1 | 07 VIZ 1 | 08 Ficha 2 | 09 VIZ 2
10 Ficha 3 | 11 VIZ 3 | 12 Ficha 4 | 13 VIZ 4
14 Ficha 5 | 15 VIZ 5 | 16 Ficha 6 | 17 VIZ 6
18 TRANSICIÓN (De Cumplir a Optimizar) ← NUEVO
19 Ficha 7 | 20 VIZ 7 | 21 Ficha 8 | 22 VIZ 8
23 Skynet (+ urgente/importante + hub) | 24 Retro | 25 Roadmap

### Reescritura narrativa fichas 7 y 8 — DONE (commit `02a7bc9`)
- Casos 7 y 8 reescritos con formato DAR narrativo completo (igual que casos 1-6).
- 8 fichas con formato completo: contexto (dolor) + DAR (CORE).

### Referentes formato completo (casos 7-8) + Light mode fix — commit `2ee6d48`
- **Casos 7 y 8:** 6 referente blocks (3 por caso) actualizados con:
  - Nombre como link externo con icono `fa-arrow-up-right-from-square`
  - Industria badge
  - Factor X descriptivo
  - "Cómo Aplica a CORE" title + 3 bullets contextuales por etapa DAR
- **Light mode fix comprehensivo:** ~30 overrides CSS para `[data-theme="light"]`:
  - `.slide-title`, `.slide h3` — color `#1a1a2e`
  - `.rec-box` — background claro, text `#444`
  - Fichas: perfil, contexto, descripción, referente blocks, stage dividers
  - Historia elements, pilar rules, DAR arrows
  - Roadmap dark backgrounds
  - Inline color overrides (`#ccc` → `#555`, `#e0e0e0` → `#333`)
  - Attribute selectors: `[style*="color: #ccc"]`, `[style*="background: #333"]`

### Rename "Qué robar" → "Cómo Aplica a CORE" — commit `f96d6a5`
- Presentación: 24 ocurrencias (con tilde "Qué")
- BENCHMARK.html: 25 ocurrencias (sin tilde "Que")
- CASOS_DE_USO.md: 8 ocurrencias
- Total: 57 reemplazos en 3 archivos

### Benchmark expansion — 1 slide → 6 slides
- **Slide 04 (Portadilla):** Intro + 4 summary cards (pilar, champions count, secundarios count)
- **Slides 05-08:** 1 slide por pilar con 3 champion cards cada uno
  - Cada card: logo (Clearbit), link, industria, UI placeholder, Factor X, 3 bullets "Cómo Aplica a CORE"
  - "También:" footer con referentes secundarios
- **Slide 09:** Tabla resumen (reemplazó referentes secundarios como cards)
  - Tabla 1: Resumen por Pilar — champions, secundarios, total
  - Tabla 2: Mapeo Fichas → Referentes — 8 casos con pilar + champion + patrón
- **CSS nuevo:** `.bench-pilar-header`, `.bench-pilar-icon`, `.bench-card`, `.bench-card-header`, `.bench-logo`, `.bench-name`, `.bench-industry`, `.bench-factorx`, `.bench-aplicacion-title`, `.bench-steal`, `.bench-secondary-chip`, `.bench-ui-placeholder`, `.bench-summary-table`
- **Renumeración:** 25 → 30 slides (5 slides insertados)

### UI placeholders 3:2 + image paths
- CSS: `aspect-ratio: 3/2` reemplaza `height: 64px`
- 13 champion cards con `<img>` tags apuntando a `img/bench/{name}.png`
- Fallback: `onerror="this.dataset.failed=true"` + CSS hiding
- Directorio creado: `presentacion/img/bench/`
- Filenames:
  - Quiet UI: `crowdstrike.png`, `spacex.png`, `motive-quiet.png`
  - Clear Path: `sentinelone-purple.png`, `vercel-v0.png`, `datadog-bits.png`
  - Time Sight: `tesla-fleet.png`, `sentinelone-storylines.png`, `chronosphere.png`
  - Omni Sense: `motive-omni.png`, `discord.png`, `samsara.png`

### SpaceX champion + Compound demotion
- SpaceX promovido a champion en Quiet UI (reemplaza Compound)
- 3 champions: CrowdStrike, SpaceX, Motive (layout col-4)
- Compound movido a:
  - "También:" line en slide 05
  - Primer chip en slide 09 Quiet UI secundarios
- Portadilla actualizada: "3" champions / "+ 4 secundarios" para Quiet UI

### Benchmark champions actualizados (presentación):
- **Quiet UI:** CrowdStrike, SpaceX, Motive (← antes: CrowdStrike, Motive, Compound)
- **Clear Path:** SentinelOne Purple AI, Vercel v0, Datadog (sin cambio)
- **Time Sight:** Tesla Fleet, SentinelOne Storylines, Chronosphere (sin cambio)
- **Omni Sense:** Motive, Discord, Samsara (sin cambio)

### Light mode overrides para benchmark
- `.bench-card`, `.bench-pilar-header`, `.bench-name`, `.bench-factorx`, `.bench-steal`, `.bench-secondary-chip`, `.bench-ui-placeholder`, `.bench-summary-table` — todos con `[data-theme="light"]` overrides

### Commit `b30e397` — benchmark expandido completo
- 6 slides benchmark, tabla resumen, UI placeholders 3:2, SpaceX champion

### Vercel deployment
- Presentación publicada en: https://presentacion-tau-three.vercel.app
- Deploy desde `presentacion/` con `vercel --prod --yes`
- `.vercel/` en `.gitignore`

### Estructura final (30 slides):
01 Cover | 02 Visión (+DAR) | 03 Pilares (+reglas)
04 Bench Portadilla | 05 Bench Quiet UI | 06 Bench Clear Path | 07 Bench Time Sight | 08 Bench Omni Sense | 09 Bench Resumen
10 Dominios
11 Ficha 1 | 12 VIZ 1 | 13 Ficha 2 | 14 VIZ 2
15 Ficha 3 | 16 VIZ 3 | 17 Ficha 4 | 18 VIZ 4
19 Ficha 5 | 20 VIZ 5 | 21 Ficha 6 | 22 VIZ 6
23 Transición | 24 Ficha 7 | 25 VIZ 7 | 26 Ficha 8 | 27 VIZ 8
28 Skynet | 29 Retro | 30 Roadmap
