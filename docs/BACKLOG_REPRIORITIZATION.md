# Repriorización del Backlog — Post v4.25

> **Objetivo:** Llevar PD-Spec de "demo impresionante" a "Hugo y Yoe pueden pilotar con su propia data de forma independiente."
> **Restricción:** Nico trabajando solo. Cada BL compite por las mismas horas.
> **Criterio de decisión:** Si no desbloquea o mejora un piloto real, espera.

---

## Análisis de brechas para pilotos

Lo que Hugo y Yoe vieron en la demo fue impresionante. Pero entre "demo impresionante" y "lo puedo usar solo" hay bloqueos específicos:

| Bloqueo | Quién lo siente | Severidad |
|---|---|---|
| **No se pueden ejecutar acciones en la app** (aprobar, rechazar, resolver) | Ambos | Fatal — sin esto, el piloto ES el terminal |
| **No se pueden cargar fuentes desde Drive** (hay que clonar repo + copiar archivos) | Ambos | Alta fricción — Hugo es técnico, Yoe tal vez no tanto |
| **La app es solo localhost** | Ambos (Yoe especialmente) | Bloquea a cualquiera que no esté en la máquina de Nico |
| **La UI se ve "generada"** — sin esfuerzo de diseño visible | Ambos lo notaron | Riesgo de credibilidad en demos a terceros |
| **No hay multi-proyecto desde la UI** | Yoe explícitamente | Bloquea el modelo mental de agencia/multi-cliente |
| **Vista de extracciones inutilizable a escala** (1200+ claims expandidos) | Nico lo sabe | Deuda UX, no es bloqueante para piloto per se |

### Qué NO es bloqueante para pilotos

Son necesidades reales pero no impiden que Hugo o Yoe testeen:

- Niveles de veracidad (BL-89) — útil para v2, no necesario para "¿funciona con mi data?"
- Exportar a PPTX/Google Docs (BL-56) — pueden copiar-pegar o sacar screenshots por ahora
- RAG (BL-22) — ningún piloto va a tener 200+ fuentes
- Convergencia con breakdown de autoridad (BL-48) — refinamiento, no core
- Glosario STT (BL-85) — solo importa en proyectos heavy en transcripts
- QA Tooling (BL-75) — tooling interno de desarrollo
- Rediseño Evidence Gaps (BL-70) — refinamiento de bajo impacto
- Vista Source Coverage (BL-72) — nice to have

---

## Waves repriorizadas

### 🔴 Wave 1: "Flujo Desbloqueado" — Hacer los pilotos funcionales ✅ COMPLETE (v4.25.1–v4.25.2)

**Objetivo:** Hugo o Yoe abren la app, ven su data, ejecutan acciones reales y corren el pipeline sin tocar un terminal.
**Plazo objetivo:** ~~Esta semana (semana del 24 feb)~~ Completado 2026-02-26
**Métrica de éxito:** Alguien que no sea Nico puede aprobar un insight, resolver un conflicto, hacer una pregunta, y correr `/extract` → `/analyze` → `/spec` desde el navegador.

| # | Ítem | Qué | Esfuerzo | Status |
|---|---|---|---|---|
| 1 | ✅ **Endpoints de scripts** | Wrappers REST API para verify-insight.sh, resolve-conflict.sh, count-statuses.sh | S | v4.25.0 |
| 2 | ✅ **BL-80 Fase 1** | Integración LLM con BYOK — UI de settings para API key + acciones básicas (aprobar/rechazar insight, resolver conflicto) vía llamadas LLM server-side | L | v4.25.1 |
| 3 | ✅ **BL-80 Fase 1b** | Modo Q&A — input de texto en la app → LLM responde usando contexto del Work layer | M | v4.25.1 |
| 4 | ✅ **Ejecutar pipeline desde app** | Botones para disparar `/extract`, `/analyze`, `/spec` desde la UI. Mostrar progreso. | M | v4.25.1 |

**Wave 1 QA:** OBS-W1-13 y OBS-W1-15 llevaron a `discover-sources.sh` (detección delta de fuentes para /extract). Bug fix en conflict parser para statuses intermedios (v4.25.2). BL-87 parcialmente implementado durante Wave 1 (invalidate con razón + cascade protection).

**Decisiones de arquitectura para Wave 1:**
- **Solo BYOK.** El usuario ingresa su API key en settings. El servidor la guarda en memoria (no se persiste entre reinicios por seguridad). Las llamadas API van server-side. WebSocket transmite cambios de archivos a la UI. Sin billing, sin sistema de créditos, sin selección de modelo. Solo "pega tu API key de Claude, empieza a trabajar."
- **Solo Claude API.** No soportar Gemini. Yoe usa Gemini dentro del ecosistema Google — eso no significa que PD-Spec necesite replicarlo. La calidad de análisis que necesita el sistema (no-hallucination, detección de conflictos) requiere un modelo top-tier bajo nuestro control. Gemini se evalúa post-piloto si hay demanda real.

---

### 🟡 Wave 2: "Piloto Suave" — Hacer el onboarding sin fricción — NEXT

**Objetivo:** Un usuario no-técnico (o alguien que no quiere usar git) puede iniciar un proyecto y cargar fuentes con mínima fricción.
**Plazo objetivo:** Semana del 2 mar
**Métrica de éxito:** Yoe puede iniciar un proyecto con sus datos de encuestas de Intercom sin que Nico esté en una llamada.

| # | Ítem | Qué | Esfuerzo | Por qué ahora |
|---|---|---|---|---|
| 5 | **Subida de archivos en app** | Drag-and-drop para subir archivos a `01_Sources/` desde el navegador. Sin API de Drive todavía — solo upload local vía el servidor de la app. | M | Elimina el paso de "abrir terminal, navegar a carpeta, copiar archivos". Menor esfuerzo que la integración completa con Drive, resuelve el 80% de la fricción. |
| 6 | **BL-81 lite** | File picker de Google Drive — navegar Drive, seleccionar archivos, importar a `01_Sources/`. Flujo OAuth. | L | Hugo y Yoe lo pidieron. Pero el approach completo de sync/watch es over-engineering por ahora. Un file picker que importa on-demand es suficiente. |
| 7 | **BL-66** | Collapse/expand de extracciones por fuente | S | Fix de UX que hace la app usable cuando hay 1000+ claims. Quick win. |
| 8 | **BL-86 parcial** | Pasada de consistencia UI — badges, fonts, spacing. No un rediseño, solo consistencia. | S | Hugo dijo "darle una mirada más estratégica." La app necesita no verse generada para demos a terceros. |

---

### 🟢 Wave 3: "Producto Piloteable" — Hacerlo compartible

**Objetivo:** Nico puede darle a alguien una URL y esa persona puede empezar a usar PD-Spec sin que Nico le configure la máquina.
**Plazo objetivo:** 2-4 semanas después de Wave 2, o en paralelo si hay bandwidth

| # | Ítem | Qué | Esfuerzo | Por qué ahora |
|---|---|---|---|---|
| 9 | **BL-83 MVP** | Deploy a un servidor. Single-tenant por ahora (un proyecto a la vez, o switch básico de proyectos). Auth vía magic link o Google OAuth. Almacenamiento local en servidor (sin S3 todavía). | L-XL | Hugo preguntó "¿lo podrías publicar?" Yoe imaginó multi-proyecto. Este es el mínimo para dejar de ser localhost. |
| 10 | **Multi-proyecto UI** | Selector de proyecto en la app. Cada proyecto es un directorio en el servidor (espeja el modelo de worktrees). | M | Request explícito de Yoe. Para un modelo de agencia, es esencial. Para una versión hosteada, es la UX mínima. |
| 11 | **BL-82** | Modo Audit de outputs AI — pegar un documento generado por AI, verificar claims contra la base de conocimiento | M | Feature diferenciador. Hugo vio el demo. Posiciona PD-Spec como "el honesto" en un mundo de herramientas que alucinan. Bueno para el pitch. |
| 12 | **Deck de pitch** | Refinar PITCH_CONTENT.md en slides reales. Usar la propia app para generarlas (dogfooding con `/ship presentation`). | S | Hugo ofreció ayudar a presentar. Se necesitan slides reales para eso. |

---

### 🔵 Wave 4: "Producto Real" — Diferir pero no olvidar

Necesidades legítimas que se vuelven críticas a escala pero son prematuras para la fase de pilotos:

| # | Ítem | Por qué diferir |
|---|---|---|
| **BL-89** (Niveles de veracidad) | Importante para entregables de consultoría, pero los pilotos no van a generar suficientes outputs para sentir este dolor |
| **BL-56** (Export PPTX/Docs) | Dolor real para entrega a clientes, pero workaround existe (copy-paste, screenshots). Se vuelve P1 post-piloto. |
| **BL-87** (Challenge insight, reject con razón) | Parcialmente implementado en v4.25.2 (invalidate con razón + cascade protection). Remaining: challenge-creates-conflict, stale conflict detection. |
| **BL-65** (Open Questions) | Buena feature, no bloquea piloto |
| **BL-85** (Glosario STT) | Solo importa cuando el mismo proyecto procesa muchos transcripts en el tiempo |
| **BL-76** (Logging estructurado) | Mejora de infraestructura, invisible para usuarios |
| **BL-48** (Convergencia con breakdown AI) | Refinamiento de display |
| **BL-22** (RAG) | Ningún piloto va a llegar a 200+ fuentes |
| **BL-70** (Evidence Gaps) | Necesita rediseño, bajo impacto en pilotos |
| **BL-75** (QA Tooling) | Solo uso interno |
| **BL-72** (Source Coverage) | Nice to have |

---

## Mapa de dependencias

```
Wave 1 (funcional)                    Wave 2 (sin fricción)     Wave 3 (compartible)
──────────────────────────────        ─────────────────────     ─────────────────────
Script endpoints ──┐
                   ├──→ BL-80 Fase 1 ──→ BL-80 Fase 1b
                   │         │
                   │         ├──→ Ejecutar pipeline desde app
                   │         │
                   │         └───────────────────────────────→ File upload ──→ BL-81 lite (Drive)
                   │                                          │
                   │                                          ├──→ BL-66 + BL-86 (quick wins UX)
                   │                                          │
                   │                                          └──→ BL-83 MVP (hosted)
                   │                                                │
                   │                                                ├──→ Multi-proyecto UI
                   │                                                └──→ BL-82 (Audit mode)
```

---

## Análisis de costos/riesgos para pilotos

### Estimación de costos de tokens (modelo BYOK)

Basado en la experiencia de TIMining (72 fuentes, 1200+ claims, 23 insights):

| Operación | Tokens estimados | Costo (Claude Sonnet) | Costo (Claude Opus) |
|---|---|---|---|
| `/extract` (72 archivos) | ~500K input + ~200K output | ~$2.00 | ~$12.00 |
| `/analyze` | ~300K input + ~100K output | ~$1.50 | ~$7.50 |
| `/spec` | ~100K input + ~50K output | ~$0.50 | ~$3.00 |
| `/ship` (1 tipo de output) | ~100K input + ~50K output | ~$0.50 | ~$3.00 |
| Q&A en app (20 preguntas) | ~50K input + ~20K output | ~$0.25 | ~$1.50 |
| **Total pipeline completo** | | **~$5** | **~$27** |

Para un piloto: **$5-30 por proyecto dependiendo del modelo.** Hugo ofreció pagar. A estos precios, podrías absorber el costo de 5 pilotos y es menos que una salida a comer.

**Recomendación:** No construir sistema de créditos. Para pilotos, BYOK o absorber los $5-30 tú mismo. Construir infraestructura de billing solo cuando tengas usuarios que paguen y que no sean tus amigos.

### Riesgo: "¿Qué pasa si el piloto no genera resultados interesantes?"

El mayor riesgo no es técnico — es que la data del piloto no produzca insights interesantes. TIMining funcionó porque tenía fuentes ricas y contradictorias de múltiples stakeholders.

- **Piloto de Hugo:** Probablemente data rica (proyecto de consultoría, múltiples stakeholders). Alta probabilidad de buenos resultados.
- **Piloto de Yoe:** Encuestas de Intercom + transcripts de reuniones. Podría ser más delgado. Tal vez necesite suplementar con más tipos de fuente para obtener conflictos interesantes.

**Mitigación:** Antes del piloto, ayudarles a curar fuentes. El skill `/seed` existe — mostrarles qué aspecto tiene un buen input. Mejor input = mejor demostración de las capacidades del sistema.

---

## Puntos de decisión

### Decidido (Wave 1 — completado):
1. ~~**Scope de Wave 1**~~ → BYOK + approve/reject + Q&A + ejecución de pipeline desde la app. **Entregado v4.25.1–v4.25.2.**
2. ~~**Elección de modelo**~~ → **Solo Claude API.** Se evalúa post-piloto si hay demanda de Gemini/GPT.
3. ~~**Timeline**~~ → **Completado semana del 24 feb.**

### Decidido (Post-Wave 1, 2026-02-28):
4. **Agent Runtime architecture** → **Migrar a Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`). El Agent Runtime artesanal (`agent-runtime.js`) no escala — herramientas limitadas, sin offset/limit, sin Bash, contexto truncado a 2000 chars. El SDK provee todas las herramientas de Claude Code como librería embebible, con compactación automática de contexto y `canUseTool` callback para integración con la UI. Ver BL-80 redefinido (Phase 1). El frontend (vistas, data API, WebSocket) se conserva íntegro.
5. **Cost control como variable de producto** → BL-80 Phase 2 introduce model routing (Haiku/Sonnet/Opus por complejidad de tarea) y estimación de costo pre-ejecución. Crítico para viabilidad SaaS.

### Decidir para Wave 2:
4. **Hosted vs. localhost** — ¿Los pilotos de Wave 2 pueden seguir corriendo en localhost, o Hugo/Yoe necesitan una URL?
5. **Multi-proyecto** — ¿Yoe necesita esto para el piloto, o con un proyecto basta para validar?

### Decidir después de los pilotos:
6. **Modelo de pricing** — ¿BYOK para siempre, créditos de plataforma, suscripción, o por proyecto?
7. **Mercado target** — ¿Agencias de consultoría (mundo de Hugo) vs. startups (mundo de Yoe) vs. horizontal (visión expandida de Yoe)?
