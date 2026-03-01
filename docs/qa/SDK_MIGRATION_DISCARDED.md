# SDK Migration — Items Descartados o Congelados

> **Contexto:** BL-80 Phase 1 (SDK migration) reemplaza `agent-runtime.js` + agent loop en `claude.js` con Claude Agent SDK. Los items listados aquí mueren con el runtime actual o se congelan hasta que la nueva arquitectura esté en su lugar.
>
> **Fecha:** 2026-03-01
> **Referencia:** [BACKLOG_REPRIORITIZATION_V2.md](../BACKLOG_REPRIORITIZATION_V2.md)

---

## Bugs que mueren

| Item | Descripción | Por qué muere |
|---|---|---|
| **BUG-W1-05** | Raw JSON error en SSE agent loop — rate limit (429) y overloaded (529) mostraban raw SDK message. Fix propuesto: retry con backoff. | El error handler SSE del agent loop custom se reemplaza entero. El SDK tiene su propio modelo de errores y retry. |
| **BUG-W1-06** | Interaction response triggers "Cancelled" — `req.on('close')` establecía `conv.aborted = true`, y al responder el usuario el loop veía aborted y cancelaba. | El modelo de pausa/resume del agent loop custom (`conv.aborted`) desaparece. El SDK usa `canUseTool` callback para interacciones. |

**Acción:** No commitear. No invertir tiempo.

---

## OBS que se resuelven con SDK

| Item | Descripción | Qué muere | Qué sobrevive |
|---|---|---|---|
| **OBS-W1-10** | File discovery ineficiente — tools del runtime (`read_file`, `search_files`, `list_files`) son limitadas, causan llamadas redundantes para descubrir directorios. | El problema completo. SDK tiene Glob + Grep nativos con capacidad completa. | — |
| **OBS-W1-13** | Agent needs `discover_sources` tool — /extract gastaba ~15 tool calls en listado exploratorio. Propuesta: tool custom de discovery delta. | **El tool custom** en `agent-runtime.js`. No se necesita un tool dedicado. | **`discover-sources.sh`** sobrevive intacto. Post-SDK, el agente llama el script via Bash nativo (regla 90/10: mecánico → script, no LLM). El script ya existe (commit `27f78e0`). |
| **OBS-W1-15** | Discovery cost $1.37 para 1 archivo nuevo — consecuencia directa de W1-10 y W1-13. | El costo excesivo. Con Glob/Grep nativos + `discover-sources.sh` via Bash, el discovery se reduce a centavos. | — |

**Acción:** No crear BLs. Verificar post-migración que `discover-sources.sh` funciona via Bash del SDK.

---

## QA Tests congelados

| Test | Descripción | Por qué se congela |
|---|---|---|
| **T14** | `/extract` from browser — click button, ver tool calls en log, verificar EXTRACTIONS.md. | La mecánica de ejecución de pipeline (SSE events, agent loop, tool calls display) cambia completamente con el SDK. |
| **T15** | `/analyze` from browser — procesar claims en insights, pedir confirmación, escribir archivos. | Depende de T14. Misma razón. |
| **T16** | `/spec` from browser — resolver conflictos, actualizar STRATEGIC_VISION, puntos de interacción. | Depende de T15. Misma razón. |
| **T17** | Cancel mid-pipeline — detener ejecución en curso, verificar archivos no corrupted. | El modelo de cancelación cambia. `conv.aborted` desaparece; el SDK tiene su propio mecanismo. |
| **T19** | WebSocket live updates after script action — un tab ejecuta, otro auto-actualiza. | El flujo de eventos (SSE → WebSocket → refetch) cambia con el SDK. La verificación de live updates requiere entender el nuevo flujo primero. |

**Acción:** No ejecutar. Re-diseñar test matrix post-migración con los nuevos flujos del SDK. Los 7 tests que sobreviven (T12, T13, T18, T20, T22, T23, T24) sí se pueden ejecutar ahora — son frontend o server puro, no tocan el agent loop.

---

## Items que cambian de forma (documentados en Repriorización v2)

Estos no se descartan — sobrevive el problema pero cambia la solución. Ver sección "CAMBIA DE FORMA" en [BACKLOG_REPRIORITIZATION_V2.md](../BACKLOG_REPRIORITIZATION_V2.md).

| Item | Tema |
|---|---|
| BL-87 | Insight actions: de tools custom a `canUseTool` callback |
| OBS-W1-09 | Session TTL: de persistencia custom a SDK sessions (resume/fork) |
| OBS-W1-16 | Token drain: de system prompt monolítico a `settingSources` del SDK |
| T23 | Path traversal: de whitelist a sandboxing |
