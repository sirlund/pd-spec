# BL-110 Baseline — transcript.md Extraction Quality

> Saved 2026-03-02. Use to compare against SDK app re-run.

## Test file
- **Path:** `01_Sources/Workshop 1/transcript.md`
- **Size:** 60,305 bytes (59KB)
- **Lines:** 16 (line 17 = 59,139 chars — entire Granola STT transcript on one line)
- **Hash:** c08c94c20f0d3838240be6a8783c6b25

## Normalized version
- **Path:** `02_Work/_temp/transcript.md_normalized.md`
- **Size:** 60,373 bytes (+0.1%)
- **Lines:** 84
- **Max line:** 1,024 chars
- **Method:** discover-sources.sh step 8, python3 sentence-splitting at `. ` / `? ` / `! ` boundaries, target ≤1000 chars

## Results comparison

| Run | Method | Claims | Content visible |
|---|---|---|---|
| SDK (pre-fix) | SDK Read truncates line 17 at 2000 chars | **8** | ~3,150 chars (5.2%) |
| Agent direct (post-fix) | Read from normalized _temp/ version | **48** | 60,373 chars (100%) |
| Old custom runtime (pre-SDK) | readFile() no limits | **29** | 60,305 chars (100%) |
| **SDK (post-fix)** | **discover-sources.sh normalization + Phase 1.5 (Passes A+B+C)** | **131** | **63,526 chars (100%)** |

## SDK pre-fix claims (8) — all from AI summary only

```
1. "Esta transcripción detalla una sesión de trabajo de la empresa TIMining enfocada en la arquitectura UX/UI de su nueva plataforma"
2. "El propósito central es ayudar a las compañías mineras a cumplir con su plan de negocio y operación táctica"
3. "Transición de un producto basado en visualización 3D (Aware) hacia un cerebro o sistema nervioso central"
4. "Integra datos en tiempo real, inteligencia artificial y sensores virtuales para reducir la brecha entre la planificación y la ejecución en el terreno"
5. "Se enfatiza el valor de simplificar lo complejo y generar 'paz mental' para los usuarios"
6. "Las decisiones se basen en análisis de causa raíz y recomendaciones proactivas en lugar de solo reportar eventos pasados"
7. "El equipo explora escenarios críticos, como fallas de maquinaria o desvíos en la ley del mineral"
8. "Diseñar una interfaz que no solo muestre información, sino que mueva las piedras al influir directamente en las acciones de los operadores y gerentes"
```

## Agent direct claims (48) — full transcript coverage

```
1. "El objetivo de este ejercicio, con la ayuda de IDEMAX, es diseñar la arquitectura de UX UI de la nueva plataforma"
2. "El avance que hemos hecho en el último año ha sido impresionante — en 2024 se modularizó el algoritmo del gemelo digital, permitiendo que operaciones puedan ser mucho más ágiles"
3. "Se agregaron capas de perforación y tronadura en la primera mitad del año, se sacó el primer demo de alarma, y en agosto se ensambla la célula de IA"
4. "Aware no es exactamente igual para cada cliente — RT tiene un set de widgets diferente al de Fortetu MRN, y tiene reportería automática"
5. "Para Amsa corporativo estamos generando como API — les exportamos datos de topografía que para ellos son importantes, ese es un servicio"
6. "MLP ya está desarrollada pero no es tan productiva — algunos la están ocupando pero todavía está como en beta"
7. "El ciclo de venta es tan lento, luego el ciclo de implementación también es lento, que permite vender con confianza en verde — decir lo tengo, mando una casa piloto, y mientras te demoro vas a estar listo"
8. "No tenemos una casa piloto completa — tenemos una silla, tenemos el baño, pero no tenemos los planos de la casa completa"
9. "Del lado comercial hemos sido malos para cobrar — nos cuesta mucho llegar a precios porque no sabemos dónde termina la configuración y dónde parte el producto nuevo"
10. "Carlos está explorando si es posible inyectarle órdenes al despacho o despachar mejor"
11. "La meta comercial es que este nuevo producto se pueda vender a $450,000 USD — es más caro, cuando abres el auto se tiene que ver diferente"
12. "Nuestra tecnología tiene tres capas: una capa de integración de datos en tiempo real (efecto Suiza, única fuente de verdad), una capa de inteligencia (topografía en línea, sensores virtuales), y sobre eso la capa de UX/UI"
13. "El visualizador 3D es como un iceberg donde estamos solamente sacándole provecho a la punta — en el fondo tienen una cantidad de datos con los que se puede hacer mucho más"
14. "IDEMAX no es experto en minería — lo que le hemos encargado es ayudarnos a converger"
15. "Quiero lanzar el concepto en Q2, en verde — sabiendo que van a ir muchas cosas por construirse, pero lanzar el concepto, la marca"
16. "El macro problema en que queremos estar es ayudar a la mina a cumplir su plan minero y ayudar a los planificadores de corto plazo a ser mejores"
17. "Nos metimos en un problema superclave — tiene una ambición superinteresante, pero también tiene montones de problemas porque los ciclos son largos de venta"
18. "El problema del plan minero está superalineado con el dueño — el plan minero es el plan de negocio, pero el dueño no es usuario"
19. "Tenemos una hipótesis con algo de información: esto debería ser superimportante para los CFO, pero no hablamos con los CFO"
20. "Los CFO típicamente ajustan una vez al año — los planificadores le dicen este plan, y al otro año dice qué pasó. Pero la plata se perdió en todos los turnos y no se dieron cuenta"
21. "Si todas nuestras acciones no terminan en una decisión real, no movimos las piedras — la tecnología tiene que influir en decisiones reales"
22. "Las iteraciones son lentas — te demoras un año o más en vender, los deploys también son lentos — es una industria lenta, conservadora, con mucha inercia en los procesos"
23. "Es una oportunidad y amenaza — somos como un botecito que está delante de todos con el viento a favor, pero los barcos grandes también vieron el océano azul y están todos apuntando para allá"
24. "Hemos decidido ser una solución más flexible — cuando partimos con Aware era superclave para partir, pero lo clave es capturar todos los datos del cliente para poder atender sus problemas"
25. "Hoy día entregamos valor a través de Aware, reportes a distintas frecuencias, alertas, y el chat/agente — múltiples maneras de llegar al usuario"
26. "En este gran paraguas de ayudar al cliente a cumplir el plan minero, van a haber múltiples subproblemas — velocidades, chancador, botaderos — cada uno un problema en sí mismo que tributa al gran problema"
27. "No todos los subproblemas tienen la misma experiencia — lo que buscamos es plantear los tipos de arquitectura y las fases para que cuando enfrentemos alguno, seamos coherentes"
28. "Nuestras interfaces si las comparamos contra la industria minera, están en el top — pero respecto a videojuegos, nos da la cola. Hay que poner recursos limitados donde tenemos más impacto"
29. "Nuestros usuarios tienden a contarnos sus dolores, no sus problemas — el desafío va a ser más identificar y describir correctamente el problema versus encontrar la solución"
30. "Nosotros somos más parecidos a un médico diagnosticador — el paciente dice me duele esto, y el médico verá qué le da"
31. "No solo una venta inicial sino un acompañamiento permanente — el dashboard lo usan de esta manera, empecemos a pensar desde esas características"
32. "Lo que queremos no es que nos usen el software — es que la gente entienda algo. El cómo mostrar los datos es clave, hay una intencionalidad en la visualización de datos"
33. "Si tú tienes que además capacitarme está bien, pero quién me la hace simple que yo entro y no necesito ni una explicación — ese es el ideal"
34. "El primer tiro tiene que ser razonablemente bueno — no fallís por tanto, que te den la confianza para los siguientes tiros"
35. "Hay muchas más posibles maneras de llegar al usuario — radio de mina, WhatsApp, interfaz, sala de reuniones — hoy todo es muy Aware porque es la punta del iceberg"
36. "Nuestro valor está en los números que el cliente no tiene — si la mayoría de la energía la gastas tratando de convencer que tu número es igual al de él, pierdes"
37. "El desafío del pricing: tú quieres meter una plataforma que en el futuro le solucione todo, pero le estamos exigiendo al primer problema que encontremos pagar todo — ahí hay algo del modelo de negocio"
38. "Los equipos de producto tienen sus propios backlog y roadmap, pero de pronto viene comercial con urgencias — vamos tirando la deuda técnica, deuda de diseño"
39. "Caso de uso: Jefe de turno inicio de turno — le llega un mensaje con los problemas principales, camiones estacionados sin carga, situaciones de riesgo. La plataforma co-analiza y genera texto con recomendaciones"
40. "Después de la reunión la plataforma ofrece recibir mensajes proactivos diciendo si las indicaciones van según plan"
41. "Caso de uso: Caída de pala — requiere redesignación de recursos, entender el entorno afectado, alimentación de planta que se está cayendo, recomendación de dónde reasignar"
42. "Caso de uso: Calidad de mineral baja — las mezclas de mineral no son las correctas, la matriz de carguo-transporte falló, el mineral de los frentes no son reales"
43. "Caso de uso: Reunión diaria de coordinación — hay que tener la información analizada y al dedo para dar explicaciones, detectar brechas respecto al plan minero, generar análisis de causa raíz rápido, priorizar incidentes por impacto real"
44. "Visión Skynet: el dueño de la mina cada X minutos analiza la situación general, realiza N simulaciones buscando mejorar, primero genera sugerencias a personas, segundo da órdenes a máquinas — de recomendación a 'haz esto'"
45. "Atributo clave: captar la atención del supervisor en forma oportuna, mostrar el escenario de qué pasa si no hace nada"
46. "A través de radio, el usuario podría consultar directamente a un agente enviando fotos de la condición en terreno — el agente confirma si está cumpliendo el procedimiento y las regulaciones"
47. "El cerebro estratégico operativo: anticipa los problemas y sugiere soluciones activas — la plataforma habla con el usuario, no solo muestra datos"
48. "La paz mental como atributo: no saturar con mucha información, poner una herramienta que realmente mejore la situación del usuario"
```

## Cost observations

| Checkpoint | Console total | Delta | Phase |
|---|---|---|---|
| Before test (post Q&A chat) | $8.33 | — | — |
| After Phase 1.5 (pre-approve) | $8.63 | **$0.30** | Discovery + normalization + preprocessing (speakers, phonetics) |
| After full extract | $9.38 | **$1.05** | Total: Phase 1.5 + Pass C + Phase 2 extraction + writes |

**Total SDK `--file` cost: $1.05** for 1 file (131 claims).
- Phase 1.5 (discovery → approve): $0.30 (29%)
- Pass C + extraction + writes: $0.75 (71%)
- For comparison: agent direct test (no Phase 1.5): ~$0.07/file (48 claims)

**Full pipeline cost (extract + analyze): $1.64** ← first run (pre-hotfix, analyze re-executed)

**Full pipeline cost (extract + analyze) — FINAL (post-hotfix): $2.04**
- /extract: $1.05 (131 claims, Phase 1.5 full)
- /analyze: $0.99 (131 claims → 23 atomic → 3 SYNTH, 3 conflicts validated, 3 gaps)
- Console range: $10.31 → $11.30
- Re-execution: NONE (hotfix `e54aa7b` confirmed working)

**OBS-BL110-01: Phase 1.5 cost overhead on single file.**
$0.30 just for preprocessing (discovery + normalization + speaker detection + phonetic correction) before any claims are extracted. For comparison, the direct agent test (no SDK, no Phase 1.5) processed the same file end-to-end for ~$0.07. Phase 1.5 adds ~4x cost overhead on a per-file basis. On a full 16-file express run ($1.18 total = ~$0.07/file), the preprocessing cost is amortized. But for `--file` mode (single file re-extraction), Phase 1.5 dominates cost.

**OBS-BL110-02: Phase 1.5 may be unnecessary for `--file` mode.**
When `--file` is used for re-extraction (e.g., after a bug fix), the user likely wants fast, cheap re-processing — not full preprocessing. Consider: make Phase 1.5 opt-in for `--file` mode, or skip it if a `_normalized.md` already exists in `_temp/`.

**OBS-BL110-03: SDK `--file` with full Phase 1.5 costs 15x more than direct agent.**
$1.05 for 1 file (131 claims) vs ~$0.07 (48 claims). Breakdown: Phase 1.5 discovery→approve $0.30 (29%), Pass C + extraction + writes $0.75 (71%). Pass C (sentence repair) and speaker detection are the main cost drivers — they read and rewrite the full 63KB transcript. The 131 vs 48 claims difference suggests over-extraction (more granular ≠ better — /analyze deduplicates).

**OBS-BL110-04: Phase 1.5 sub-passes should be optional (advanced mode).**
Sentence repair (Pass C) and speaker detection (Pass A) are expensive and not always needed. Proposal: make them opt-in via flags or an "advanced preprocessing" mode. Default /extract would only run discover-sources.sh normalization (mechanical line-splitting) + Pass B (phonetic correction, cheap). Full preprocessing available via `--preprocess` or similar flag. This would bring --file cost closer to $0.07-0.15 range while keeping the option for deep preprocessing when needed. → Backlog candidate.

**OBS-BL110-05: Skill re-execution after AskUserQuestion approval.**
After `/analyze` completed and wrote 9 SYNTH insights, the agent re-launched a full `/analyze` from scratch within the same SDK session. Root cause: `maxTurns: 200` left ~170 unused turns, and the SDK prompt had no stop instruction. The second run created 114 atomic insights (one per claim) on top of the 9 consolidated ones, totaling 123 entries in INSIGHTS_GRAPH.md. Hotfix: explicit "execute ONCE, then STOP" in SDK prompt + maxTurns reduced to 80 for skills, 30 for Q&A (`e54aa7b`). **Verified: post-hotfix `/analyze` completed and stopped cleanly.**

**OBS-BL110-06: TodoWrite leaks through disallowedTools.**
`TaskCreate` and `TaskUpdate` are blocked but `TodoWrite` is a separate SDK tool name that isn't in the list. Agent uses it for internal task tracking during skills — wastes tokens, no user-visible benefit. Should add to `disallowedTools` for skills.

**OBS-BL110-07: /analyze consolidation varies significantly between runs.**
First run (pre-hotfix): 131 claims → 114 atomic + 9 SYNTH (over-extraction). Second run (post-hotfix): 131 claims → 23 atomic → 3 SYNTH (much tighter). Same data, different consolidation. The SKILL.md instructions and available turns influence how aggressively the agent consolidates. Neither is "wrong" — just different strategies. 3 SYNTH may be under-consolidated for 131 claims.

## QA Effort Pivot (2026-03-02)

**Decision:** Pause intensive SDK QA after this session. Current state is "beta funcional" — pipeline works end-to-end with known rough edges. Remaining E2E tests (spec, ship) deferred to next session.

**Rationale:**
- SDK integration bugs are small (2-5 line fixes) but discovery is expensive (full QA sessions)
- Each session finds 2-3 new integration bugs — diminishing returns without real users
- The product value is in skills + content quality, not SDK polish
- Target user (Product Designer) needs a working app, not a perfect one

**Next steps (this week):**
1. Complete E2E: test /spec and /ship from app
2. **SDK beta light optimization session** — make SDK mode sustainable:
   - Topes por tamaño/líneas para archivos que disparan costos (>50KB, >1000 lines)
   - Phase 1.5 optional by default (skip Pass A/C unless `--preprocess`)
   - Claim cap before /analyze (e.g., warn if >80 claims from single source)
   - Fallback: user can always type commands directly in Agent chat
3. Declare beta, stop hunting bugs, wait for real user signal

**Key commits from this session:**
- `1ef2179` fix(engine): BL-110 — SDK Read compatibility
- `5b84266` feat(app): BL-109 — Q&A Haiku routing
- `76f08f5` fix(app): skill args passthrough
- `e54aa7b` fix(app): prevent skill re-execution (maxTurns + STOP instruction)
- `99cc280` fix(app): block TodoWrite in skill mode

## How to re-test from app

1. Reset Work layer: `./scripts/reset.sh --work` (in pd-spec--qa)
2. Delete stale normalized: `rm -f 02_Work/_temp/transcript.md_normalized.md`
3. Merge latest main into qa (to get BL-110 engine changes)
4. Start server: `cd app && PORT=3001 npm run dev`
5. Run `/extract --file "Workshop 1/transcript.md"` from Agent view
6. Compare claim count against this baseline (expect ≥20, target ~48)
7. Check agent log for: `NORMALIZED: 1` in discover-sources.sh output, and read from `_temp/` path
