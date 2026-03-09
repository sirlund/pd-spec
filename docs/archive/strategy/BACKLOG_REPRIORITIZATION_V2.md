# Repriorización del Backlog v2 — SDK First

> **Objetivo:** Llevar PD-Spec de "demo impresionante con runtime artesanal" a "producto con fundación técnica sólida, deployable, y con canal de distribución masiva a mediano plazo."
> **Restricción:** Nico trabajando solo. Cada BL compite por las mismas horas.
> **Criterio de decisión:** Si no fortalece la fundación técnica o no desbloquea un piloto real, espera.
> **Supersede:** [BACKLOG_REPRIORITIZATION.md](BACKLOG_REPRIORITIZATION.md) (Post v4.25, 2026-02-24)

---

## Qué cambió desde la Repriorización v1

| Aspecto | v1 (24 feb) | v2 (1 mar) |
|---|---|---|
| Wave 1 | Propuesta | ✅ Completada (v4.25.1–v4.25.2) |
| BL-101 (Index System) | Propuesto | ✅ Implementado (v4.26.0, 83% ahorro tokens) |
| BL-102 (Showcase MDX) | Propuesto P2 | v1 construida (Astro + MDX, commit `73c5179`) |
| Agent Runtime | "Suficiente para pilotos" | Diagnóstico claro: no escala. 5 reads sin offset, 6 scripts whitelisted, contexto truncado a 2000 chars |
| MCP Apps | Riesgo — 2 meses de vida, adopción incierta | Estándar adoptado: Claude, ChatGPT, VS Code, Goose. SDK oficial (`ext-apps`). Anthropic + OpenAI colaboraron en el spec |
| Dependencia de Claude | "Solo Claude API, evaluar post-piloto" | OpenClaw valida el riesgo de vendor lock-in. Skills portables por naturaleza. Rule of three para abstracción |
| Pilotos | Dependen de la webapp como ejecutor | **Desacoplados**: CLI ejecuta, webapp visualiza. Demo demuestra valor del sistema, no de la app |
| SDK migration | Flotando sin wave asignada | **P0** — fundación para todo lo que sigue |

### Tres insights estratégicos que informan esta repriorización

**1. OpenClaw y el riesgo de proveedor único**

OpenClaw (180k+ stars) fue bloqueado por Anthropic cuando usuarios usaban tokens OAuth de suscripciones flat-rate para correr agentes 24/7. El creador se fue a OpenAI. La lección: para productos comerciales sobre modelos de terceros, (a) solo API keys con billing por token — no hay atajos flat-rate, (b) la arquitectura debe asumir que las reglas del proveedor pueden cambiar en cualquier momento, (c) la diversificación de modelos no es "nice to have" sino necesidad de supervivencia.

**PD-OS ya esquivó la trampa directa** — la decisión de Wave 1 fue BYOK con API keys. Pero el riesgo de dependencia técnica persiste: el Agent SDK, las herramientas, el streaming — todo es Claude-specific. La mitigación correcta no es abstracción prematura (rule of three: no abstraer hasta tener 2 implementaciones concretas), sino **separación de módulos**: skills → orquestador → módulo Claude. Las skills no importan nada del SDK. El orquestador habla con Claude a través de un módulo separado. Sin interfaces adapter genéricas todavía.

**2. MCP Apps como canal de distribución**

MCP Apps (enero 2026) permite que herramientas retornen UI interactiva renderizada dentro del chat. Partners de lanzamiento: Amplitude, Asana, Box, Canva, Figma, Hex, Monday.com, Slack. Adopción confirmada en Claude, ChatGPT, VS Code, Goose. SDK oficial: `@modelcontextprotocol/ext-apps`.

Esto abre un canal donde PD-Spec no necesita hosting propio, auth, ni billing — el host lo provee. Pero la MCP App **no es la webapp reducida**. Es una experiencia diseñada para ese contexto: un funnel simplificado donde cualquiera puede analizar fuentes, extraer insights, y generar reportes. Dominio: research de producto digital. La webapp sigue siendo el producto completo para equipos que adoptan PD-Spec como metodología.

**3. Las skills son el moat**

Las skills de PD-Spec son `.md` con reglas — no código ejecutable. Cualquier LLM que sepa seguir instrucciones estructuradas puede ejecutarlas. El "agente" o "gema" o "custom GPT" es solo un contenedor que carga un `.md` y lo obedece. El acoplamiento real está en herramientas (Read, Bash, Grep), compactación de contexto, y streaming — todo plomería del servidor, no del motor de conocimiento.

**El moat de PD-OS es el orquestador + las skills, no el runtime.**

---

## Supuesto corregido: pilotos desacoplados del SDK

La Repriorización v1 asumía que los pilotos (Hugo y Yoe) necesitaban la webapp con agent runtime para ver valor. **No es así.** Necesitan ver resultados, no la tubería.

**Plan:**
1. **Demo esta semana:** Nico ejecuta PD-Spec desde CLI (Claude Code), los resultados llegan a la webapp, ellos ven el dashboard con insights y datos organizados. La webapp como visualizador ya funciona.
2. **SDK migration inmediatamente después:** Sin presión de pilotos dependiendo de la webapp como ejecutor. Se hace bien.
3. **Post-SDK:** "Lo que Nico corrió desde terminal, ahora lo pueden lanzar ustedes desde el browser." Deploy público incluido.

El feedback del demo es la señal de mercado: si Hugo y Yoe dicen "¿cómo lo uso yo?" → el SDK migration tiene destinatario claro. Si no ven valor → el problema no era infraestructura.

---

## Impacto de SDK Migration (BL-80 Phase 1) en items pendientes

La migración reemplaza `agent-runtime.js` + el agent loop en `claude.js`. Efecto cascada sobre todo lo pendiente.

### 🔴 MUERE con el runtime actual (no invertir tiempo)

**Bugs:**

| Item | Descripción | Por qué muere |
|---|---|---|
| BUG-W1-05 | Raw JSON error en SSE agent loop | Ese código se reemplaza entero |
| BUG-W1-06 | Interaction response triggers "Cancelled" | `conv.aborted` y el modelo de pausa/resume del agent loop custom desaparecen. SDK tiene `canUseTool` callback |

**OBS → no requieren BL:**

| Item | Descripción | Qué muere | Qué sobrevive |
|---|---|---|---|
| OBS-W1-10 | File discovery ineficiente (tools limitadas) | El problema — SDK tiene Glob + Grep nativos | — |
| OBS-W1-13 | Necesita tool custom `discover_sources` | El tool custom en agent-runtime | **`discover-sources.sh` sobrevive** — el agente lo llama via Bash nativo (regla 90/10) |
| OBS-W1-15 | Costo $1.37 por discovery incremental | Consecuencia de W1-10/13, desaparece con herramientas nativas | — |

**QA tests → congelar, re-diseñar post-migración:**

| Tests | Descripción | Por qué se congela |
|---|---|---|
| T14, T15, T16 | Pipeline desde browser (/extract, /analyze, /spec) | La mecánica de ejecución cambia completamente |
| T17 | Cancel mid-pipeline | Nuevo modelo de cancelación con SDK |
| T19 | WebSocket live updates | El flujo de eventos cambia |

Estos 5 tests se re-escriben contra el SDK. Ejecutarlos ahora es trabajo descartable.

Archivo completo de items descartados: [`qa/SDK_MIGRATION_DISCARDED.md`](qa/SDK_MIGRATION_DISCARDED.md)

### 🟢 SOBREVIVE tal cual (independiente del runtime)

**Bugs (commitear ahora):**

| Item | Descripción | Por qué sobrevive |
|---|---|---|
| BUG-W1-03 | Raw JSON error en Settings panel (/api/session) | No toca el agent loop |
| BUG-W1-04 | No loading indicator mientras espera SSE | Pura UI (condición de render en React) |

**BL items:**

| Item | Descripción | Por qué sobrevive |
|---|---|---|
| BL-99 | Conflict lifecycle (OPEN/NEEDS-*/RESOLVED) | Modelo de datos y scripts — independiente del runtime |
| BL-100 | Deliverable architecture (MASTER + Specific) | Estructura de /ship outputs — independiente del runtime |
| BL-101 | Work Layer Index System | ✅ Ya implementado (v4.26.0) |
| BL-102 | Showcase MDX | Proyecto independiente (Astro submodule) |
| BL-86 | UI styling consistency | Frontend puro |
| BL-66 | Extractions collapse/expand | Frontend puro |

**QA tests ejecutables ahora:**

| Tests | Descripción | Por qué sobrevive |
|---|---|---|
| T12, T13 | Q&A con refs / follow-up | Frontend + prompt, no agent loop |
| T18 | Clear log | Frontend |
| T20 | Concurrent tabs | Frontend |
| T22, T23 | File write safety / path traversal | Server, no agent |
| T24 | Sidebar navigation | Frontend |

### 🟡 CAMBIA DE FORMA (sobrevive el problema, cambia la solución)

| Item | Ahora | Post-SDK |
|---|---|---|
| BL-87 (Insight actions) | Tools custom + `ask_confirmation` | Scripts sobreviven, interacción pasa por `canUseTool` callback → rehace integración frontend |
| OBS-W1-09 (Session TTL) | Persistencia custom en servidor | SDK tiene sessions con resume/fork → problema se simplifica, pero UI de configuración sigue siendo app-level |
| OBS-W1-16 (CLAUDE.md drena tokens) | System prompt monolítico | SDK carga skills via `settingSources` → mejora pero no desaparece. Ya mitigado parcialmente en v4.25.1 (Slim Core) |
| T23 (Path traversal) | Whitelist de paths en agent-runtime | Con SDK el agent tiene Bash completo → modelo de seguridad cambia de "whitelist" a "sandboxing". Repensar qué se protege |

---

## Nuevos BL items

### [BL-103] Markdown Rendering — Agent View + Interaction Panel

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** OBS-W1-06, OBS-W1-14

**Problema:** El Agent view y el Interaction panel renderizan markdown crudo — `**bold**` aparece como asteriscos literales, headings como `###` texto plano, emojis como texto. `formatText()` solo convierte `[IG-XX]`/`[CF-XX]` a badges pero no renderiza markdown.

**Solución:** Componente `RichText` (o integración de librería como `marked`/`react-markdown`) usado consistentemente en Agent log, Interaction panel (`ask_confirmation`, `ask_selection`, `ask_text`), y cualquier superficie donde el LLM emita texto.

**Nota post-SDK:** La superficie de rendering cambia (el SDK emite mensajes con estructura diferente al SSE custom), pero el problema de fondo es el mismo: renderizar markdown del LLM en la UI. El componente RichText sobrevive a la migración.

---

### [BL-104] Agent State Persistence + Response History

**Status:** PROPOSED
**Priority:** P2
**Effort:** M
**Origin:** OBS-W1-08, OBS-W1-08b

**Problema:** Navegar desde la vista Agent (ej. clickear un badge `[CF-XX]`) desmonta el componente y pierde todo el estado (log, response, mode). Al regresar, la vista aparece en blanco.

**Solución:** (a) Preservar estado del Agent view en contexto React (no en el componente local). (b) Lista de respuestas anteriores como tarjetas collapsibles que persisten en la navegación.

**Nota post-SDK:** El modelo de estado del agente cambia con el SDK (sessions, mensajes, tool results vs. SSE events custom). La implementación se rehace, pero el UX problem (estado perdido al navegar) es idéntico. Formalizar post-migración cuando la nueva estructura de datos esté clara.

---

### [BL-105] Checkpoint Integrity — Deterministic from Script Output

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** OBS-W1-17

**Problema:** SESSION_CHECKPOINT.md registró un cambio como IG-15 en lugar de IG-02 después de una invalidación. El pipeline de scripts fue correcto — el error fue del LLM al resumir narrativamente qué insight cambió.

**Causa raíz:** El checkpoint es escrito por el LLM como resumen narrativo. El LLM confundió el insight ID.

**Solución:** Los cambios de estado de insight en checkpoint deben derivarse de salida de script determinista (ej. `verify-insight.sh` stdout confirma qué ID fue cambiado), no de memoria LLM. Regla 90/10: dato mecánico → script, no LLM.

**Nota post-SDK:** El SDK tiene compactación automática de contexto, lo que podría cambiar cómo se maneja el checkpoint. Pero el principio (datos deterministas de scripts, no de narrativa LLM) aplica independientemente.

---

### [BL-106] MCP App — PD-Spec como MCP Server + Funnelized UI

**Status:** PROPOSED
**Priority:** P3 (mediano plazo — post Wave 3)
**Effort:** L
**Origin:** Análisis estratégico sesión 2026-03-01. MCP Apps spec oficial (enero 2026), adopción confirmada en Claude, ChatGPT, VS Code, Goose.

**Problema:** PD-Spec hoy es accesible solo como (a) CLI vía Claude Code o (b) webapp local/hosteada. Ambos requieren setup, configuración, y contexto. El mercado más grande está en usuarios que ya viven dentro de Claude, ChatGPT, o VS Code y quieren analizar fuentes sin salir de su herramienta.

**Solución:** PD-Spec como MCP server que expone tools (`/extract`, `/analyze`, `/ship`) y retorna UI interactiva via MCP Apps (`ext-apps`).

**Dos productos, dos jobs-to-be-done:**

```
Webapp (PD-OS)                           MCP App
───────────────                          ───────
• Experiencia completa                   • Puerta de entrada
• Orquestación, gestión de proyectos     • Funnel: "sube fuentes → analiza → genera reporte"
• Múltiples fuentes, colaboración        • No necesita saber qué es PD-Spec
• Dashboard con toda la profundidad      • Experiencia cerrada, opinionada
• Para equipos/consultores               • Para cualquiera en Claude/ChatGPT/VS Code
• Requiere onboarding                    • Zero friction — aparece en el chat
```

**Dominio:** Research de producto digital. No es un analizador genérico de documentos. Sabe qué buscar: pain points, oportunidades, contradicciones entre lo cualitativo y lo cuantitativo, gaps entre lo que piden los stakeholders y lo que muestran los usuarios.

**Valor diferencial vs. "pásale tus docs al modelo":**
- **Multi-source con detección de conflictos** — cruza fuentes y detecta dónde se contradicen. Un usuario promedio no sabe pedir esto.
- **Output estructurado y accionable** — no un wall of text sino un reporte con formato específico, priorizado, listo para tomar decisiones de diseño.

**Funnel de conversión:** Usuario descubre PD-Spec como MCP App → le gusta → necesita más control/colaboración → upgrade a webapp completa.

**Coexistencia técnica:**
- Skills de la MCP App = **subset** de las skills de PD-Spec, optimizado para experiencia acotada (pipeline lineal).
- Motor de análisis es el mismo → consistencia de calidad entre ambos productos.
- Ambos tracks avanzan en paralelo sin conflicto arquitectónico, siempre que las skills se mantengan como capa compartida.

**Scope expansión (diferida):** Yoe identificó potencial para otros dominios (firmas de abogados, etc.). Eso es v6.0 o un producto aparte con skills de dominio diferentes sobre el mismo orquestador. No diluir el posicionamiento ahora.

**Dependencias:** BL-80 Phase 1 (SDK migration). La arquitectura modular de Phase 1 (skills → orquestador → módulo Claude) es prerequisito para exponer el motor como MCP server.

**Referencias:**
- [MCP Apps spec](https://modelcontextprotocol.io/docs/extensions/apps)
- [ext-apps SDK](https://github.com/modelcontextprotocol/ext-apps)
- [Blog post oficial](http://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)

---

## Waves repriorizadas

### 🔴 Wave 1: "Flujo Desbloqueado" ✅ COMPLETE (v4.25.1–v4.25.2)

Sin cambios. Ver [Repriorización v1](BACKLOG_REPRIORITIZATION.md#-wave-1-flujo-desbloqueado--hacer-los-pilotos-funcionales--complete-v4251v4252).

---

### 🟡 Wave 2: "Fundación" — SDK + Demo + Deploy

**Objetivo:** Demostrar valor con CLI, migrar a fundación técnica sólida, y dar una URL pública a los pilotos.
**Plazo objetivo:** Semanas del 1–14 mar
**Métrica de éxito:** (a) Hugo y Yoe ven resultados reales de su data. (b) Skills corren idénticamente en CLI y app. (c) Los pilotos acceden desde una URL, no desde la máquina de Nico.

| # | Ítem | Qué | Esfuerzo | Status |
|---|---|---|---|---|
| 1 | **Demo piloto** | Nico ejecuta pipeline desde CLI (Claude Code). Resultados visibles en webapp como visualizador. Demuestra valor del sistema, no de la app. | S | NEXT — esta semana |
| 2 | **BUG-W1-03 + BUG-W1-04** | Commitear los 2 bugs que sobreviven al SDK: error handling en Settings, loading indicator. | S | Pendiente |
| 3 | **BL-80 Phase 1** | SDK migration — reemplazar `agent-runtime.js` + agent loop con Claude Agent SDK. Skills idénticas CLI/app. | M | Post-demo |
| 4 | **BL-83 mínimo** | Deploy público. Single-tenant, auth mínima (magic link o Google OAuth). Hugo y Yoe acceden desde sus dispositivos. | M | Post-SDK |
| 5 | **BL-66** | Collapse/expand de extracciones por fuente. Quick win UX. | S | En paralelo |
| 6 | **BL-86 parcial** | Consistencia UI — badges, fonts, spacing. | S | En paralelo |

**Acceptance criteria adicionales para BL-80 Phase 1 (complementan los del BL original):**

- [x] ~~`canUseTool` index guardrail~~ **DESCARTADO**: el SDK auto-aprueba `Read` sin pasar por `canUseTool` — el redirect determinístico no es viable con la API actual. **Mitigación implementada:** instrucciones de índice en el preamble de `buildSystemPrompt` (Pattern 2, no determinístico). El agente puede y generalmente obedece, pero no está forzado. Ver [IDEAS_LLM_QA_PATTERNS.md](IDEAS_LLM_QA_PATTERNS.md) Patrón 1 → OBS. Deuda técnica abierta — revisar si existe mecanismo alternativo en futuras versiones del SDK.
- [ ] UX Contract support: el setup del SDK no debe impedir ejecución secuencial de skills, intercepción de gates, ni comportamiento basado en modo como se especifica en [UX_CONTRACT.md](UX_CONTRACT.md).

**Decisiones de arquitectura para Wave 2:**

- **Separación de módulos sin interfaces genéricas.** Boundaries claros entre skills → orquestador → módulo Claude. Las skills no importan nada del SDK. El orquestador habla con Claude a través de un módulo separado. Pero NO inventar una interfaz adapter genérica todavía.
- **Rule of three.** No abstraer modelo hasta tener al menos dos implementaciones concretas. Multi-modelo es un problema futuro; la separación de módulos es lo que se necesita ahora.
- **`discover-sources.sh` sobrevive.** El script es un asset 90/10: determinista, zero LLM cost. Post-SDK, el agente lo llama via Bash nativo en vez de un tool custom.
- **Deploy público en Wave 2, no Wave 3.** Requisito explícito de los pilotos. Hugo preguntó "¿lo podrías publicar?" — la respuesta tiene que llegar antes de Wave 3.

---

### 🟢 Wave 3: "Self-Service" — Hacer que los pilotos no dependan de Nico

**Objetivo:** Hugo y Yoe pueden cargar sus propias fuentes, manejar múltiples proyectos, y operar sin asistencia.
**Plazo objetivo:** 2-3 semanas post-Wave 2
**Métrica de éxito:** Yoe inicia un proyecto con datos de encuestas de Intercom sin que Nico esté en una llamada.

| # | Ítem | Qué | Esfuerzo | Por qué ahora |
|---|---|---|---|---|
| 7 | **File upload** | Drag-and-drop para subir archivos a `01_Sources/` desde el navegador. | M | Elimina "abrir terminal, copiar archivos". Resuelve 80% de la fricción. |
| 8 | **BL-81 lite** | File picker de Google Drive — navegar, seleccionar, importar a `01_Sources/`. OAuth. | L | Hugo y Yoe lo pidieron. File picker on-demand, no sync completo. |
| 9 | **Multi-proyecto UI** | Selector de proyecto en la app. Cada proyecto = directorio en servidor. | M | Request explícito de Yoe. Modelo de agencia. |
| 10 | **BL-80 Phase 2** | Model routing (Haiku/Sonnet/Opus por complejidad) + cost estimation pre-ejecución. | L | Crítico para viabilidad SaaS. Prerequisito: Phase 1 completado. |
| 11 | **BL-103** | Markdown rendering en Agent view + Interaction panel. | S | Quick win UX post-SDK. |
| 12 | **BL-104** | Agent state persistence + response history. | M | Formalizar post-SDK cuando la estructura de datos esté clara. |
| 13 | **BL-105** | Checkpoint integrity (deterministic from script output). | S | Regla 90/10. |

---

### 🔵 Wave 4: "MCP App" — Canal de distribución masiva

**Objetivo:** PD-Spec accesible desde Claude, ChatGPT, y VS Code sin setup.
**Plazo objetivo:** Mediano plazo (post Wave 3)
**Métrica de éxito:** Un usuario que nunca oyó de PD-Spec puede analizar fuentes y generar un reporte desde Claude o ChatGPT.

| # | Ítem | Qué | Esfuerzo | Por qué |
|---|---|---|---|---|
| 14 | **BL-106** | PD-Spec como MCP Server + UI funnelizada via `ext-apps`. | L | Canal de distribución zero-friction. Millones de usuarios en hosts compatibles. |
| 15 | **BL-82** | Audit mode — verificar outputs AI contra knowledge base. | M | Feature diferenciador. "El honesto" en un mundo de herramientas que alucinan. Funciona en ambos productos (webapp + MCP App). |
| 16 | **Deck de pitch** | Slides reales refinadas de PITCH_CONTENT.md. Dogfooding con `/ship presentation`. | S | Hugo ofreció ayudar a presentar. |

---

### ⚪ Wave 5: "Escala" — Diferir pero no olvidar

| # | Ítem | Por qué diferir |
|---|---|---|
| **BL-89** (Niveles de veracidad) | Importante para consultoría, prematuro para pilotos |
| **BL-56** (Export PPTX/Docs) | Workaround existe. P1 post-piloto |
| **BL-87** (Challenge insight restante) | Parcialmente implementado. Remaining: challenge-creates-conflict, stale detection |
| **BL-65** (Open Questions) | No bloquea piloto |
| **BL-85** (Glosario STT) | Solo heavy-transcript projects |
| **BL-76** (Logging estructurado) | Infra invisible |
| **BL-48** (Convergencia breakdown AI) | Refinamiento display |
| **BL-22** (RAG) | Nadie llega a 200+ fuentes todavía |
| **BL-70** (Evidence Gaps) | Bajo impacto |
| **BL-75** (QA Tooling) | Solo uso interno |
| **BL-72** (Source Coverage) | Nice to have |
| **Multi-modelo** | Rule of three: no abstraer hasta tener 2do proveedor concreto. Las skills ya son agnósticas. |
| **BL-99** (Conflict lifecycle) | Modelo de datos válido, no urgente |
| **BL-100** (Deliverable architecture) | Estructura de /ship, mejora incremental |

---

## Mapa de dependencias

```
Wave 1 ✅                Wave 2 (Fundación)                    Wave 3 (Self-Service)       Wave 4 (MCP App)
─────────               ──────────────────                    ─────────────────────       ────────────────
                         Demo piloto (CLI) ──────────────────→ Señal de mercado
                              │
Wave 1 complete ──→ BL-80 Phase 1 (SDK) ──┬──→ BL-83 mínimo (deploy) ──→ File upload ──→ BL-81 lite (Drive)
                              │            │         │                          │
                              │            │         └──→ Multi-proyecto UI     │
                              │            │                                    │
                              │            ├──→ BL-103 (markdown rendering)     │
                              │            ├──→ BL-104 (agent state)            │
                              │            ├──→ BL-105 (checkpoint integrity)   │
                              │            │                                    │
                              │            └──→ BL-80 Phase 2 (model routing)
                              │
                         BL-66 + BL-86 (quick wins UX, en paralelo) ──────────→ BL-106 (MCP App)
                                                                                    │
                                                                               BL-82 (Audit)
```

---

## Puntos de decisión

### Decidido (Wave 1):
1. ~~Scope Wave 1~~ → Entregado v4.25.1–v4.25.2.
2. ~~Elección de modelo~~ → Solo Claude API.
3. ~~Timeline~~ → Completado semana del 24 feb.

### Decidido (Post-Wave 1, 2026-02-28):
4. **Agent Runtime** → Migrar a Claude Agent SDK. Ver BL-80 Phase 1.
5. **Cost control** → BL-80 Phase 2 introduce model routing + cost estimation.

### Decidido (Repriorización v2, 2026-03-01):
6. **SDK es P0** — pero desacoplado de pilotos. Demo potente desde CLI esta semana, SDK se hace bien después.
7. **Deploy público en Wave 2** — no Wave 3. Requisito explícito de los pilotos.
8. **No abstracción prematura** — separación de módulos sí, interfaces adapter genéricas no. Rule of three.
9. **MCP App es un producto distinto** — no la webapp comprimida. Funnel simplificado, dominio product design, experiencia diseñada para el contexto de chat. BL-106.
10. **Coexistencia webapp + MCP App** — dos productos sobre el mismo motor. El moat es orquestador + skills, no el runtime.
11. **Skills portables por naturaleza** — `.md` con reglas, agnósticas de modelo. El acoplamiento está en la plomería (herramientas, compactación, streaming), no en el motor de conocimiento.
12. **Items congelados por SDK** — 2 bugs + 3 OBS + 5 QA tests no se tocan. Ver [SDK_MIGRATION_DISCARDED.md](qa/SDK_MIGRATION_DISCARDED.md).
13. **UX Contract antes del SDK** — El contrato de experiencia de usuario se define antes de construir el SDK. El SDK no implementa el contrato, pero debe soportarlo: ejecución secuencial de skills, intercepción de gates via `canUseTool`, inspección de estado entre skills, y detección de modo (Guided/Pipeline/Batch). Ver [UX_CONTRACT.md](UX_CONTRACT.md). Tres modos: Guided (default webapp/MCP App — el sistema guía), Pipeline (CLI power users — skills individuales), Batch (automatización — mínima interacción). Las skills no cambian; lo que cambia es qué se expone y cómo se presenta.

### Decidir para Wave 3:
13. **Drive picker scope** — ¿OAuth completo o approach simplificado (shared link → import)?
14. **Multi-proyecto** — ¿Yoe necesita esto inmediatamente o con un proyecto basta para validar?

### Decidir para Wave 4:
15. **MCP App scope exacto** — ¿Qué subset de skills? ¿Qué UI components via ext-apps?
16. **SaaS + MCP App vs. MCP App only** — ¿La webapp sigue siendo el producto principal o se convierte en el tier premium de un producto MCP-first?

### Decidir después de los pilotos:
17. **Modelo de pricing** — BYOK, créditos, suscripción, o por proyecto.
18. **Mercado target** — Agencias de consultoría (Hugo) vs. startups (Yoe) vs. horizontal.
19. **Multi-modelo** — Solo si hay demanda real de un segundo proveedor. Rule of three.

---

## Análisis de costos y rate limits

### Rate limits: honestidad sobre tiers

El Agent SDK usa la misma API key, el mismo billing, y los mismos rate limits que la API directa. No hay atajo.

| Tier | Depósito | Spend/mes | ITPM (Sonnet) | Realidad para PD-Spec |
|---|---|---|---|---|
| **Tier 1** | $5 | $100 | 30K | Operación incremental funciona. Setup inicial de proyectos grandes (60+ fuentes) es lento — cada archivo es un request, el rate limit frena. Un `/extract` de 72 archivos puede tomar 15-20 min. |
| **Tier 2** | ≥$40 | $500 | 60K | Fluido para pilotos. Headroom suficiente para setup + operación. |
| **Tier 3** | $200 | $2,000 | 120K | Para producción o proyectos con 200+ fuentes. |

**Recomendación para pilotos: Tier 2 mínimo.** No venderle al usuario que Tier 1 "alcanza" — técnicamente funciona pero la experiencia de onboarding (primer extract full) será lenta y frustrante. Para demos donde Nico controla la ejecución, Tier 1 es aceptable porque Nico tolera la espera. Para pilotos self-service, no.

**Nota:** CLI (Claude Code) maneja retries y backoff internamente cuando se golpea el rate limit. El usuario no ve el error 429, pero el pipeline tarda igual. No es que "quepa" en Tier 1 — es que el dolor es invisible. Esa anestesia no existe en la webapp donde el usuario ve el spinner.

### Impacto de BL-101 (Index System) en costos

BL-101 (ya implementado, v4.26.0) reduce drásticamente el consumo de tokens **para operaciones incrementales**, no para el setup inicial.

| Operación | Pre BL-101 | Post BL-101 | Tier 1 viable? |
|---|---|---|---|
| `/extract` full (72 archivos) | ~144K input | ~144K input (lee fuentes completas, sin atajo) | Lento pero funciona |
| `/extract` incremental (3 archivos nuevos) | ~20K input | ~8-10K input | **Sí** |
| `/analyze` full | ~89K input | ~89K input (sin atajo para reprocess completo) | Lento |
| `/analyze` incremental | ~89K input | ~10-15K input | **Sí** |
| `/spec` | ~30K input | ~5-8K input | **Sí** |
| `/ship` (1 deliverable) | ~30K input | ~5-8K input | **Sí** |
| Q&A (1 pregunta) | ~15K input | ~3-5K input | **Sí** |

**Matiz importante:** El ahorro de BL-101 depende de que el agente **obedezca** las instrucciones del skill: "lee el índice primero, identifica la sección relevante, lee solo esa sección con offset/limit." Las skills ya están escritas así. Con el runtime artesanal el agente no podía cumplirlo aunque quisiera — no tenía `Read(offset, limit)`. Con el SDK puede. Pero "puede" no es "lo hará siempre" — es comportamiento instruido, no garantizado. Si el agente decide leer el archivo completo, el ahorro se pierde.

### Estimación de costos por pipeline

| Operación | Costo Sonnet | Costo Opus |
|---|---|---|
| Pipeline completo (~72 fuentes, primer run) | ~$5 | ~$27 |
| Pipeline incremental (3 fuentes nuevas, post BL-101) | ~$1-2 | ~$5-10 |
| Post BL-80 Phase 2 (model routing, estimado) | ~$0.50-1 | N/A (Opus solo para tareas que lo requieran) |

**Recomendación:** Sigue siendo BYOK para pilotos. No construir billing hasta tener usuarios que paguen. Recomendar Tier 2 ($40 deposit) en el onboarding de la app.

---

## Resumen numérico de impacto SDK

| Categoría | Muere | Sobrevive | Cambia forma | Total |
|---|---|---|---|---|
| Bugs sin commit | 2 | 2 | — | 4 |
| QA tests pendientes | 5 | 7 | — | 12 |
| OBS → BL candidatas | 3 | 3 → BL-103/104/105 | 3 | 9 |
| BL activos | — | 5 | 1 | 6 |
| **Nuevos BLs** | | **4** (BL-103–106) | | |
