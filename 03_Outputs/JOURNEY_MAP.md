# User Journey Map — TIMining

> v1.1 | 2026-02-25 | Persona: P-02 Jefe de Turno | 14 insight refs, 2 gaps

---

## Persona de referencia: P-02 — Jefe de Turno

> "Si no logramos vender al operador, estamos afuera." — Carlo, CTO [IG-04]

El Jefe de Turno opera en terreno la mayor parte del tiempo, coordina por radio IP y WhatsApp, y carga con una tensión central: la plataforma que debería ayudarlo es percibida como un mecanismo de auditoría. Su adopción es el punto neurálgico del modelo bottom-up de TIMining. [IG-04], [IG-SYNTH-17]

---

## Fase 1: Inicio de Turno — Recuperación de Contexto

**User Actions:**
- Llega a la faena sin briefing automático. Busca al jefe de turno saliente para recibir el traspaso verbal. [IG-SYNTH-15]
- Consulta WhatsApp para enterarse de novedades operacionales que no quedaron documentadas. [IG-03]
- Entra al visor Aware (si lo usa) para ver el estado del plan, pero la interfaz no está diferenciada para su rol: ve capas de información no filtradas para su contexto. [IG-SYNTH-09]
- Construye mentalmente el panorama del turno anterior juntando fragmentos de distintas fuentes.

**Touchpoints:**
- Conversación verbal con el turno saliente (principal y más confiable)
- WhatsApp — mensajes de grupo del turno anterior con novedades, alertas, coordinaciones [IG-03]
- Visor Aware (desktop o tablet) — interfaz de capas sin diferenciación por perfil [IG-SYNTH-09]

**Emotions:** 🔴 Negativo — incertidumbre de inicio
**Pilar líder:** **Omni Sense** — la información del turno anterior debe llegar al JdT por su canal natural antes de que pise la faena, sin que tenga que buscarla. [IG-16]

> El "Efecto Gaviota" opera en este momento: el turno entrante no sabe qué pasó, qué quedó pendiente ni dónde están los problemas activos. La información crítica vive en la memoria del turno saliente, no en el sistema. [IG-SYNTH-15]

**Pain Points:**
- No existe un briefing automático estructurado — toda la transferencia de contexto depende de la disponibilidad y claridad del turno saliente. [IG-SYNTH-15]
- Las decisiones tomadas por radio y WhatsApp durante el turno anterior no quedaron registradas en la plataforma — pérdida sistemática de conocimiento operacional. [IG-03]
- La interfaz no le muestra "su" vista de turno: necesita filtrar manualmente para identificar lo que le compete. [IG-SYNTH-09]
- Los tiempos de actualización de los datos (topografía cada 15 min, mapas de calor cada 3h con 30 min de desfase) no son transparentes — no sabe si lo que ve refleja el estado actual o una foto antigua. [IG-SYNTH-03]

**Oportunidades para CORE:**
- Briefing automático multimedia (voice note + KPI summary + problemas activos) entregado 15 minutos antes del inicio del turno, sin depender del turno saliente. [IG-SYNTH-15]
- Captura retrospectiva de decisiones tomadas en WhatsApp y radio, integrada al historial de turno. [IG-03]
- Vista de inicio de turno diferenciada por perfil: estado del plan, alertas activas, pendientes heredados. [IG-SYNTH-09]

---

## Fase 2: Operación en Terreno — Coordinación sin Plataforma

**User Actions:**
- Sale a terreno con radio IP y celular. La sala de control queda atrás — el desktop con Aware también. [IG-03]
- Coordina movimientos de equipos, asignación de frentes y respuesta a incidentes por radio y WhatsApp. [IG-03]
- Toma decisiones tácticas en tiempo real basado en lo que ve físicamente y en lo que escucha por radio — no en datos del sistema. [IG-SYNTH-09]
- Cuando hay un problema, evalúa la situación en segundos y decide: detener equipo, reasignar frente, coordinar con el despachador. El proceso completo ocurre fuera de la plataforma. [IG-SYNTH-06]

**Touchpoints:**
- Radio IP — canal primario de coordinación táctica en terreno [IG-03]
- WhatsApp — mensajes individuales y grupales con despachador, operadores y jefatura [IG-03]
- Inspección visual directa — contexto físico más confiable que el sistema para él
- Celular (conectividad variable) — acceso esporádico a plataforma si la interfaz lo amerita

**Emotions:** 🟠 Neutral / 🔴 Negativo — eficacia personal vs. sistema que no acompaña
**Pilar líder:** **Omni Sense** — la plataforma debe encontrarlo donde está (radio, WhatsApp, voz+foto). En berma no puede usar pantalla ni teclado: la interfaz manos libres con Push-to-Talk y Edge AI es el modo de operación primario, no un feature. [IG-21], [IG-16]

> El Jefe de Turno es operacionalmente competente en terreno. Su frustración no es con la minería sino con una plataforma que fue diseñada para la sala de control, no para su realidad física. El 90% de sus decisiones ocurre en canales que el sistema no captura. [IG-03]

**Pain Points:**
- La plataforma está diseñada para desktop y sala de control — el Jefe de Turno está en terreno. [IG-SYNTH-09]
- Toda coordinación por radio y WhatsApp es invisible para el sistema: TIMining pierde el 90% de la información operacional. [IG-03]
- No hay diferenciación de interfaz para uso en terreno con sol brillante, connectividad baja, guantes de trabajo. [IG-SYNTH-09]
- El sistema no captura las decisiones expertas que él toma — conocimiento tácito que se pierde en cada turno. [IG-09]

**Oportunidades para CORE:**
- Interfaz mobile-first para Jefe de Turno: Briefing Lens (feed con alertas y estado del plan) accesible desde celular, legible con sol brillante, operable con una mano. [IG-SYNTH-19]
- Integración agnóstica de canal: captura de decisiones tomadas en WhatsApp y radio, sin forzar cambio de canal. [IG-03]
- Registro automático de decisiones tácticas que alimenta el aprendizaje del sistema y el historial de turno. [IG-09]

---

## Fase 3: Alerta Operacional — Anomalía Detectada

**User Actions:**
- Recibe una alerta: puede ser por radio, WhatsApp, o — si tiene el celular a mano — una notificación push de la plataforma. [IG-SYNTH-06]
- Evalúa la situación: ¿qué ocurrió? ¿qué impacto tiene? ¿qué opciones tiene? El patrón mental es Detección → Análisis → Recomendación. [IG-SYNTH-06]
- Si la alerta es geotécnica (zona de riesgo, incursión de equipo), coordina el despeje por radio. El proceso no queda registrado. [IG-SYNTH-18]
- Decide una acción: detener equipo, reasignar frente, escalar a gerencia, o absorber el desvío en el turno.

**Touchpoints:**
- Alerta push (si la plataforma la envía a celular) [IG-SYNTH-07]
- Radio IP — coordinación de respuesta [IG-03]
- WhatsApp — notificación a jefatura si escala [IG-03]
- Visor CORE/Aware (si accede) — para ver contexto geométrico del incidente [IG-SYNTH-01]

**Emotions:** 🔴 Negativo → 🟠 Neutral — estrés de respuesta
**Pilar líder:** **Quiet UI** — de todos los eventos posibles, solo el crítico lo interrumpe. La alerta llega con el patrón D→A→R ya procesado: él no analiza, actúa. [IG-SYNTH-07], [IG-16]

> Cuando la alerta llega, el Jefe de Turno activa mentalmente el patrón D→A→R que está validado en 20 casos de uso del workshop. Hoy lo hace sin soporte del sistema: el análisis es suyo, las opciones son suyas, la decisión es suya — sin recomendaciones rankeadas ni impacto proyectado. [IG-SYNTH-06]

**Pain Points:**
- Las alertas de seguridad geotécnica pueden llegar tarde o no llegar si él no está mirando una pantalla. [IG-SYNTH-18]
- No hay análisis de impacto al plan automático: debe calcularlo mentalmente. [IG-SYNTH-06]
- La respuesta (despeje por radio, reasignación) no queda registrada en el sistema — no hay trazabilidad del incidente. [IG-SYNTH-18]
- En Aware actual, las alertas no están jerarquizadas: hay demasiada información que no utiliza, lo que diluye la atención a lo crítico. [IG-SYNTH-07]

**Oportunidades para CORE:**
- Alerta push con el patrón D→A→R completo: qué se detectó (Detección), impacto estimado al plan (Análisis), 2-3 acciones recomendadas rankeadas por impacto (Recomendación). [IG-SYNTH-06]
- Alertas geotécnicas preventivas: notificación antes de que un equipo ingrese a zona de riesgo, no después. [IG-SYNTH-18]
- Gestión por excepción: solo alertas críticas que requieren acción, sin ruido de estado normal. [IG-SYNTH-07]
- Registro automático del incidente y la respuesta para trazabilidad y aprendizaje del sistema. [IG-09]

---

## Fase 4: Toma de Decisión — Herramienta de Ayuda o de Auditoría

**User Actions:**
- Evalúa las recomendaciones de CORE (si las hay) o toma la decisión basado en su juicio experto. [IG-SYNTH-04]
- Si la recomendación tiene sentido operacional, la adopta. Si no, la ignora o la rechaza — y esa señal de rechazo no queda capturada. [IG-09]
- Reporta la decisión tomada: a veces al despachador por radio, a veces al sistema si tiene acceso. [IG-03]
- Frente a una decisión que afecta el plan, evalúa si debe escalar a gerencia o absorber el desvío. [IG-SYNTH-12]

**Touchpoints:**
- CORE/Aware — recomendaciones rankeadas (aspiracional) o datos del plan (actual) [IG-SYNTH-04]
- TIM Agent — consulta en lenguaje natural sobre el impacto de la decisión (aspiracional) [IG-SYNTH-08]
- Radio IP / WhatsApp — comunicación de la decisión al equipo [IG-03]

**Emotions:** 🔴 Negativo — tensión central del journey
**Pilar líder:** **Clear Path** — ¿qué hacer ahora? El sistema le presenta 2-3 opciones rankeadas por impacto al plan, filtradas por las 60 reglas operacionales. Él decide; el sistema registra. [IG-08], [IG-16]

> Esta es la fase más crítica y la más conflictiva. Si el Jefe de Turno percibe que CORE evalúa sus decisiones para reportarlas a planificación, lo rechazará. [IG-04] La plataforma debe darle visibilidad de su propio desempeño antes de exponerlo a la jefatura — el operador como primer beneficiario, no como objeto de auditoría. [CF-13]

**Pain Points:**
- Planificación usa TIMining para auditar al Jefe de Turno — él percibe la herramienta como mecanismo de control. [IG-04]
- No hay transparencia sobre qué datos son visibles para él vs. para su jefatura. [CF-13]
- Las recomendaciones actuales del sistema (si existen) no tienen el contexto operacional que las haría confiables — no están filtradas por las 60 reglas de negocio propietarias de TIMining. [IG-08]
- El sistema no captura cuándo él rechaza una recomendación y por qué — oportunidad de aprendizaje perdida. [IG-09]

**Oportunidades para CORE:**
- Diseño "operador-first": el Jefe de Turno ve su propio panel de desempeño antes de que lo vea su jefatura — la plataforma es su aliada, no su auditor. [IG-04], [CF-13]
- Las 60 reglas de negocio propietarias filtran las recomendaciones de IA: el sistema sugiere acciones operacionalmente válidas, no genéricas. [IG-08]
- Captura de rechazos con contexto: el sistema aprende del juicio experto del Jefe de Turno y eventualmente sugiere sus patrones como primera opción. [IG-09]
- Consulta en lenguaje natural (TIM Agent) para evaluar el impacto de una decisión sin expertise técnico. [IG-SYNTH-08]

> **[GAP]** — No hay evidencia directa de cómo el Jefe de Turno interactúa con las recomendaciones del sistema en la práctica actual. Los comportamientos descritos son inferidos de stakeholders internos (CTO, COO). Resolver con entrevistas de Etapa 2 — pregunta clave: ¿usas TIMining porque quieres o porque debes? [CF-07], [CF-13]

---

## Fase 5: Cierre y Handoff de Turno — Pérdida de Contexto

**User Actions:**
- Al final del turno, prepara el traspaso al turno entrante. [IG-SYNTH-15]
- Recapitula verbalmente o por WhatsApp lo que ocurrió: problemas activos, decisiones tomadas, pendientes. [IG-03]
- Si usa la plataforma, no hay un flujo de cierre de turno estructurado — el handoff sigue siendo ad hoc. [IG-SYNTH-15]
- El conocimiento táctico del turno — incidentes, decisiones, contexto de equipos — queda en su memoria, no en el sistema.

**Touchpoints:**
- Conversación verbal con el turno entrante — canal primario e irónicamente el más efectivo [IG-SYNTH-15]
- WhatsApp — resumen informal del turno para el equipo [IG-03]
- Plataforma (si genera reporte de turno) — aspiracional, hoy no existe como flujo dedicado [IG-SYNTH-15]

**Emotions:** 🟠 Neutral → 🔴 Negativo — ansiedad de continuidad
**Pilar líder:** **Time Sight** — el sistema anticipa que hay un turno nuevo en 15 minutos y genera el briefing automáticamente. El JdT no redacta el handoff: el sistema lo construyó durante todo el turno. [IG-SYNTH-15], [IG-16]

> El "Efecto Gaviota" cierra el ciclo aquí: lo que este Jefe de Turno no transmite explícitamente, el siguiente turno no sabrá. La caída de producción en el cambio de turno es una consecuencia directa de esta pérdida de contexto sistémica. [IG-SYNTH-15]

**Pain Points:**
- No hay flujo de cierre de turno estructurado en la plataforma — el handoff depende del esfuerzo individual. [IG-SYNTH-15]
- Las decisiones tomadas por radio y WhatsApp durante el turno no quedaron en el sistema — el turno entrante empieza desde cero. [IG-03]
- La adherencia al plan del turno no se comunica automáticamente al turno siguiente ni a gerencia. [IG-SYNTH-12]
- Si no hay briefing automático para el turno entrante, el ciclo de "Efecto Gaviota" se repite. [IG-SYNTH-15]

**Oportunidades para CORE:**
- Generación automática del log de turno: resumen de incidentes, decisiones tomadas, desvíos al plan, pendientes — sin que el Jefe de Turno deba redactarlo. [IG-SYNTH-15]
- Briefing multimedia automático para el turno entrante (voice note + KPI summary) basado en el log del turno actual. [IG-SYNTH-15]
- Captura de decisiones de WhatsApp y radio como parte del historial de turno — trazabilidad completa sin cambio de canal. [IG-03]
- Stickiness: embeber el cierre de turno en la rutina estándar, haciendo que el Jefe de Turno tenga un motivo propio para usar la plataforma. [IG-SYNTH-17]

> **[GAP]** — No hay evidencia directa de cómo los Jefes de Turno realizan el cierre de turno en la práctica (duración, formato, qué se transmite y qué no). Incluir en guía de entrevistas de Etapa 2. [CF-07]

---

## Resumen de Oportunidades por Fase

| Fase | Emoción dominante | Pain principal | Oportunidad CORE | Pilar líder | Refs clave |
|---|---|---|---|---|---|
| 1. Inicio de turno | 🔴 Incertidumbre | Sin briefing automático — contexto perdido | Briefing multimedia 15 min antes del turno | **Omni Sense** | [IG-SYNTH-15] |
| 2. Operación en terreno | 🟠 Eficacia personal | Plataforma diseñada para sala, no para terreno | Manos libres + captura agnóstica de canal | **Omni Sense** | [IG-03], [IG-21] |
| 3. Alerta operacional | 🔴 Estrés de respuesta | Sin análisis de impacto ni recomendaciones rankeadas | Alerta push con patrón D→A→R completo | **Quiet UI** | [IG-SYNTH-06], [IG-SYNTH-07] |
| 4. Toma de decisión | 🔴 Tensión auditoría | Plataforma percibida como control, no como ayuda | Diseño operador-first + recomendaciones rankeadas | **Clear Path** | [IG-04], [IG-08], [IG-09] |
| 5. Cierre y handoff | 🔴 Ansiedad continuidad | Sin flujo de cierre estructurado — Efecto Gaviota se repite | Log automático de turno + briefing anticipado | **Time Sight** | [IG-SYNTH-15], [IG-03] |

---

## Insights Summary

| ID | Concepto | Status | Convergencia | Fases |
|---|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap — Brecha plan vs. realidad | VERIFIED | 15/54 | 3 |
| [IG-SYNTH-03] | Confusión Temporal — Tiempos de dato generan abandono | VERIFIED | 5/57 | 1 |
| [IG-SYNTH-04] | Del Dashboard al Copiloto — Asistencia proactiva | VERIFIED | 12/54 | 4 |
| [IG-SYNTH-06] | Patrón D→A→R — Detección → Análisis → Recomendación | VERIFIED | 26/57 | 3, 4 |
| [IG-SYNTH-07] | Gestión por Excepción — Solo mostrar lo que importa | VERIFIED | 10/57 | 3 |
| [IG-SYNTH-08] | Democratización del Dato — De expertos a todos | VERIFIED | 9/54 | 4 |
| [IG-SYNTH-09] | Perfiles diferenciados con necesidades distintas | VERIFIED | 13/57 | 1, 2 |
| [IG-SYNTH-12] | Adherencia espacial como métrica central | VERIFIED | 10/54 | 4, 5 |
| [IG-SYNTH-15] | Efecto Gaviota — Dolor del cambio de turno | VERIFIED | 5/54 | 1, 5 |
| [IG-SYNTH-17] | Adopción bottom-up — Operational Pull | VERIFIED | 6/57 | 5 |
| [IG-SYNTH-18] | Seguridad y gestión geotécnica integrada | VERIFIED | 8/54 | 3 |
| [IG-SYNTH-19] | Interfaz Multimodal — 4 Lentes de navegación | VERIFIED | 7/54 | 2 |
| [IG-03] | WhatsApp como canal principal de decisiones | VERIFIED | 2/57 | 1, 2, 3, 4, 5 |
| [IG-04] | Resistencia de operadores cuando son auditados | VERIFIED | 1/57 | 4 |
| [IG-08] | 60 reglas de negocio propietarias como moat técnico | VERIFIED | 1/57 | 4 |
| [IG-09] | Sistema aprende de decisiones expertas | VERIFIED | 2/57 | 2, 3, 4 |
