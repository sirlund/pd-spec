# Casos de Uso por Dominio — TIMining CORE

> Documento de trabajo. Versión actualizada 18 feb — 8 fichas maestras con referentes por etapa DAR.
> Fuentes: 20 láminas Workshop 01, Estrategia Maestra v3.4, PD-Spec Insights Graph (54 fuentes), reunión Camila 17 feb.

---

## Criterio de agrupación

Los 20 escenarios del workshop se agrupan por **flujo de experiencia** (no por rol ni por área funcional), siguiendo el acuerdo de la reunión de revisión. Cada dominio representa un tipo de interacción distinta entre el operador y CORE.

**Patrón transversal:** Las 20 láminas siguen el modelo operativo **D→A→R** (Detección → Análisis → Recomendación), que corresponde al pilar **Clear Path**.

---

## Dominio A: Respuesta a Crisis

**"Algo se rompió — ¿qué hago?"**

Falla no planificada que demanda respuesta táctica inmediata. El sistema detecta, evalúa impacto y rankea alternativas de mitigación.

**Pilar dominante:** Quiet UI — el silencio se rompe por una falla crítica.

**Objetivo:** Minimizar variabilidad negativa y asegurar continuidad ante fallas.

| Caso | Láminas | Rol principal | Situación | Recomendación CORE |
|---|---|---|---|---|
| Crisis Caída de Equipo | L8, L14, L15 | Despachador / Supervisor Turno | Pala cae en turno de noche, tiempo incierto | Rankea 3 opciones: detener flota, cambiar vaciado, enviar cargador. Ruta segura. |
| Riesgo Geotécnico | L6, L7 | Monitorista / Gte Mina | Riesgo geotécnico obliga a sacar pala. Evento mayor. | Define zonas de restricción, redefine despacho, set de alternativas con impacto medido. |
| Falla Mecánica | L13 | Despachador | Falla mecánica requiere traspaso de info y estimación rápida de tiempos. | Detalle de falla para coordinación con mantención. Comparativa con fallas históricas. |

**Nota vs Gemini:** Gemini incluía L19 (Autónomos) en este dominio. Nosotros la movemos a Alineación Estratégica porque es un post-mortem (ya pasó durante el fin de semana), no una respuesta inmediata.

---

## Dominio B: Anticipación Operativa

**"Va a fallar — actúa ahora."**

El sistema ANTICIPA un problema antes de que se materialice y recomienda intervención preventiva. A diferencia de Crisis, aquí todavía hay tiempo para actuar.

**Pilar dominante:** Time Sight — foresight ("va a pasar en 45 min").

**Objetivo:** Optimizar flujo continuo y cumplimiento de plan sincronizando silos.

| Caso | Láminas | Rol principal | Situación | Recomendación CORE |
|---|---|---|---|---|
| Continuidad de Chancado | L3 | Jefe Chancado | Se prevé bloqueo de camiones por 45 min en chancador. | Redistribuir flujo hacia stock o saturar controladamente. |
| Ruta Crítica PyT | L5, L16 | Planificador PyT | Patios NO listos para perforar. Retraso en mantenciones. | Reasignar equipos, alertar impacto en KPI crítico del día. |
| Control de Velocidades | L9 | Jefe Operaciones | Incumplimiento en Plan de Velocidades. | Causa raíz específica: Vía (mantenimiento), Equipo (mecánico) u Operador (capacitación). |

**Nota:** Este dominio coincide con "Continuidad de Procesos" de Gemini. El reframing enfatiza que el diferenciador es la capacidad PREDICTIVA del sistema, no solo la continuidad del proceso.

---

## Dominio C: Asistencia Inteligente

**"Procesa esto por mí."**

El usuario necesita que el sistema sintetice información compleja y la entregue en formato usable por el canal correcto. Es el patrón "copiloto": el sistema reduce carga cognitiva.

**Pilar dominante:** Omni Sense — canal correcto, formato correcto.

**Objetivo:** Reducir carga cognitiva y "pobreza de tiempo" del usuario.

| Caso | Láminas | Rol principal | Situación | Recomendación CORE |
|---|---|---|---|---|
| Asistencia Proactiva "Sofía" | L18 | Supervisor IROC | Reunión de coordinación en 15 min, saturada de reuniones/correos. | Briefing por WhatsApp: resumen contra plan, problemas específicos, texto listo para indicaciones. |
| Reunión Diaria CIO | L4 | Gerencia CIO / Operaciones | Reunión 8 AM entre CIO y Operaciones. | Priorización objetiva de incidentes del turno, causa-raíz, plan de acción para mitigar. |
| Copiloto Legal y Seguridad | L10 | Jefe de Turno | "¿Estoy cumpliendo el estándar de berma de Sernageomin?" | Confirma cumplimiento o indica pasos para regularizar. Consulta vía voz o foto. |
| Triage de Radio y Tronadura | L11, L12 | Despachador / Jefe Turno | Radio saturada. Aseguramiento de tronadura. | Escucha, transcribe, cruza GPS con malla. Prioriza solicitudes por voz. |

**Nota vs Gemini:** Gemini omitió L4 (Reunión Diaria). Comparte el mismo flujo que L18 (Sofía) — el sistema sintetiza y prepara al usuario para una reunión de coordinación.

---

## Dominio D: Alineación Estratégica

**"¿Cómo vamos contra el plan?"**

Análisis que compara rendimiento real vs planificado. Horizonte temporal más largo. Las recomendaciones son ajustes estructurales, no tácticos inmediatos.

**Pilar dominante:** Time Sight — hindsight (plan vs realidad) + foresight (proyecciones).

**Objetivo:** Conectar operación diaria con la última línea financiera.

| Caso | Láminas | Rol principal | Situación | Recomendación CORE |
|---|---|---|---|---|
| Cierre Mensual y Recuperación | L1 | Gerente Minas | Se cumple mineral/lastre pero recuperación de planta es mala. | Categorización real de mineral en frentes. Tracking al chancado. Ajustes dinámicos de flota. |
| Planificación de Recursos | L2 | Planificador Corto Plazo | No hay vehículos disponibles, material no era lo previsto, mantenimiento no programado. | Simula alternativas para suplir, mitigar o solucionar. Minimizar costo a corto/mediano plazo. |
| Análisis Equipos Autónomos | L19 | Gerente Mina | Camiones autónomos se pararon mucho durante el fin de semana. | Análisis de período, anomalías, causa raíz. Reposicionamiento antenas, revisión caminos. |
| Optimización del Plan Minero | — | Gerente Minas / Planificador CP | Plan conservador cumplido pero no optimizado. Incentivos desalineados. | Simulación what-if con Orchestra. 3 bandas: mínimo/esperado/máximo. Acciones rankeadas por impacto. |
| Reportería Ejecutiva | — | CFO / Controller Financiero | Reportes manuales, CFO no usa TIMining. Dinero se pierde por turno. | Reporte automático pre-reunión. Semáforo KPIs. Drill-down causal financiero. Proyección cierre. |

**Nota vs Gemini:** L2 estaba omitida. L19 estaba en Crisis — la movemos aquí porque es un análisis retrospectivo (post-mortem del fin de semana), no respuesta inmediata.

**Nota fichas 7-8:** Originadas en síntesis de evidencia PD-Spec y reunión Camila 17 feb. No provienen de láminas del workshop.

---

## Outliers (fuera de dominios)

| Lámina | Descripción | Razón de exclusión |
|---|---|---|
| L17 | Machine 2 Machine — diagrama conceptual de integración de sistemas | No es un caso de uso, es arquitectura técnica. |
| L20 | Concepto "Skynet" — optimización global autónoma | Es el north star / visión aspiracional de TIMining, no un escenario operativo. Podría usarse como cierre de la presentación. |

---

## Resumen comparativo vs Gemini

| Dominio (propuesto) | Nombre Gemini | Láminas propuestas | Cambios vs Gemini |
|---|---|---|---|
| A. Respuesta a Crisis | Resiliencia Operacional | L6, L7, L8, L13, L14, L15 | -L19 (movida a D) |
| B. Anticipación Operativa | Continuidad de Procesos | L3, L5, L9, L16 | Mismo contenido, distinto framing |
| C. Asistencia Inteligente | Asistencia Agéntica | L4, L10, L11, L12, L18 | +L4 (rescatada) |
| D. Alineación Estratégica | Visión Estratégica | L1, L2, L19 | +L2 (rescatada), +L19 (desde Crisis), -L20 (outlier) |

**Cobertura:** 18 de 20 láminas asignadas a dominios. L17 y L20 como outliers/visión.

---

## Mapeo dominios → pilares

| Dominio | Pilar dominante | Pilar transversal | Lógica |
|---|---|---|---|
| A. Respuesta a Crisis | **Quiet UI** | Clear Path | El silencio se rompe por falla crítica → alternativas rankeadas |
| B. Anticipación Operativa | **Time Sight** | Clear Path | Foresight: "va a pasar en 45 min" → intervención preventiva |
| C. Asistencia Inteligente | **Omni Sense** | Clear Path | Canal correcto, formato correcto → síntesis para acción |
| D. Alineación Estratégica | **Time Sight** | Clear Path | Hindsight: plan vs realidad → ajustes estructurales |

**Clear Path (D→A→R) es transversal** — el patrón Detección → Análisis → Recomendación estructura las 20 láminas.

---

## Fichas Sintetizadas — 8 Casos Maestros

> Las 20 láminas del workshop se reducen a 6 fichas base + 2 fichas nuevas (reunión Camila 17 feb) que eliminan repetición y revelan los flujos reales de la operación. Cada ficha agrupa láminas con el mismo patrón de experiencia, asigna un pilar dominante, y conecta con referentes por etapa DAR del benchmark.

---

### Ficha 1: Caída de Equipo Crítico

**Eje:** Respuesta a Crisis (Dominio A)
**Perfil compuesto:** Despachador IROC · Supervisor de Turno · Jefe de Turno
**Casos que agrupa:** L8 (Respuesta rápida despachador), L13 (Falla mecánica), L14 (Pala cae turno noche), L15 (Pala alimentación WIP)
**Pilar dominante:** Quiet UI

**Contexto:**
El radio corta el silencio de la sala IROC a las 2:47 AM: "Pala 07 abajo." No es mantención programada — es una caída imprevista. Tres camiones ya circulan hacia un punto de carga muerto. El despachador salta entre el dashboard de despacho, el mapa GPS, la planilla de mantención y el radio — ninguno le dice cuánto durará ni qué alternativa tiene. Cables aéreos restringen la zona. La meta del turno se aleja con cada minuto sin producción.
**No necesita más dashboards — necesita una respuesta.**

**Flujo D→A→R:**

**▸ Detección** · Quiet UI — La pantalla acromática de la sala IROC se ilumina — solo por la anomalía. Antes de que el despachador levante el radio, la alerta ya está en su celular y en la pantalla principal. El silencio se rompe únicamente cuando algo se rompe.

**▸ Análisis** · Time Sight — Impacto estimado en el tonelaje del turno. Topografía actualizada hace 8 minutos confirma restricciones por cables aéreos. Comparativa con fallas históricas similares — la última vez, la opción 2 ahorró 40 minutos. El despachador no tuvo que cruzar nada.

**▸ Recomendación** · Clear Path — Tres opciones rankeadas por impacto en tonelaje y costo por hora. Un tap. Los tres camiones ya se redirigen. El despachador no interpretó datos — eligió entre alternativas calculadas. Paz mental: la decisión ya fue evaluada antes de que él la tomara.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | CrowdStrike | Alerta acromática — color solo para amenazas activas |
| **Análisis** | SentinelOne Storylines | Cadena causal completa del incidente |
| **Recomendación** | Vercel v0 | Opciones rankeadas con UX limpia |

**Evidencia PD-Spec:** [IG-SYNTH-07] Gestión por Excepción (8/54 fuentes), [IG-SYNTH-06] Patrón D→A→R (25/54), [IG-SYNTH-16] Paz Mental (5/54)

---

### Ficha 2: Riesgo Espacial y Seguridad

**Eje:** Respuesta a Crisis (Dominio A) + Asistencia Inteligente (Dominio C)
**Perfil compuesto:** Supervisor de Monitoreo · Gerente Mina · Jefe de Turno
**Casos que agrupa:** L6 (Alerta geotécnica), L7 (Ajuste táctico por zona de riesgo), L12 (Tronadura y despeje)
**Pilar dominante:** Omni Sense

**Contexto:**
10:15 AM. La Pala 07 opera a 200 metros de una zona clasificada como inestable por el radar geotécnico. En 40 minutos hay tronadura programada y dos loros no están en posición. El supervisor de monitoreo salta entre ARIS, el sistema GPS, la planilla de tronadura y el radio — cada uno con un pedazo de la verdad, ninguno con la imagen completa. La responsabilidad legal es directa: si algo sale mal, la firma es suya.
**No necesita cuatro pantallas — necesita una certeza.**

**Flujo D→A→R:**

**▸ Detección** · Omni Sense — Cruce automático: radar geotécnico + posición GPS de equipos + estado de loros de tronadura. Un solo mapa con la zona de restricción actualizada, los equipos afectados y su distancia al riesgo. El supervisor no consultó cuatro sistemas — recibió una sola imagen completa.

**▸ Análisis** · Time Sight — Simulación de escenarios: si la pala sigue operando, cuál es la ventana de riesgo. Si la tronadura se ejecuta, qué equipos deben evacuarse y en qué orden. Zonas de restricción proyectadas en tiempo real sobre el mapa.

**▸ Recomendación** · Clear Path — Maniobra de evacuación recomendada con impacto operacional medido. Una firma respaldada por fusión de sensores — certeza legal, no intuición. Si la situación cambia, re-alerta. Si no — silencio.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | Anduril Lattice | Spatial intelligence — identifica interés automáticamente |
| **Análisis** | Chronosphere | Zoom temporal para distinguir puntual vs tendencia |
| **Recomendación** | SentinelOne Purple AI | Acción guiada por AI con contexto completo |

**Evidencia PD-Spec:** [IG-SYNTH-18] Seguridad geotécnica integrada (8/54 fuentes), [IG-SYNTH-01] Geometry Gap (15/54), [IG-SYNTH-06] Patrón D→A→R (25/54)

---

### Ficha 3: Anticipación de Cuello de Botella

**Eje:** Anticipación Operativa (Dominio B)
**Perfil compuesto:** Jefe de Chancado · Planificador PyT · Jefe de Operaciones
**Casos que agrupa:** L3 (Bloqueo chancador 45 min), L5 (Patios sin perforar), L9 (Incumplimiento velocidades), L16 (Mantenciones retrasadas)
**Pilar dominante:** Time Sight

**Contexto:**
Mediodía, turno diurno. La operación parece normal — los números del turno van bien. Pero la velocidad de alimentación al chancador cae lento, constante. Nadie lo nota porque cada área mira su propio dashboard: el jefe de chancado ve su flujo, el planificador ve su plan semanal, el jefe de operaciones ve sus equipos. Cuando el bloqueo ocurra en 45 minutos, las tres áreas se van a enterar por radio — tarde, descoordinadas y sin opciones.
**No necesita más reportes por área — necesita coordinación antes del problema.**

**Flujo D→A→R:**

**▸ Detección** · Time Sight — Detección predictiva: el patrón de desaceleración se forma antes de que el bloqueo exista. La alerta no espera a que el problema ocurra — se activa cuando la tendencia se confirma. Proyección: bloqueo en 45 minutos.

**▸ Análisis** · Omni Sense — Notificación simultánea a tres áreas — cada una por su canal preferido, con el dato que necesita para su rol. El jefe de chancado ve opciones de stockeo. El planificador ve impacto en el plan semanal. El jefe de operaciones ve reasignación de equipos.

**▸ Recomendación** · Clear Path — Redistribución de flujo recomendada con equipos reasignables identificados. Tres áreas coordinadas antes de que el problema exista — sin radio, sin silos, sin improvisación.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | Chronosphere | Alerta predictiva con contexto temporal |
| **Análisis** | Tesla Fleet | Time scrubbing — rebobinar para entender causalidad |
| **Recomendación** | Datadog Bits AI | Recomendación contextual con impacto cuantificado |

**Evidencia PD-Spec:** [IG-SYNTH-06] Patrón D→A→R (25/54 fuentes), [IG-SYNTH-12] Adherencia al plan (10/54), [IG-SYNTH-03] Confusión Temporal (4/54)

---

### Ficha 4: Briefing Inteligente

**Eje:** Asistencia Inteligente (Dominio C)
**Perfil compuesto:** Supervisor IROC ("Sofía") · Gerencia CIO/Operaciones
**Casos que agrupa:** L4 (Reunión diaria CIO 8 AM), L18 (Asistencia proactiva pre-reunión)
**Pilar dominante:** Omni Sense

**Contexto:**
7:45 AM. Sofía camina hacia la sala de coordinación — casco, radio, cero tiempo. Reunión en 15 minutos. No ha podido prepararse: correos sin leer, tres reuniones previas, el radio que no para. ¿Cómo cerró el turno noche? ¿La tronadura? ¿Cuántos camiones parados? La información existe — dispersa entre el dashboard de despacho, el reporte de mantención y los correos del jefe de turno anterior. Sofía va a llegar a improvisar, como cada mañana.
**No necesita otro dashboard que abrir — necesita que el contexto la encuentre a ella.**

**Flujo D→A→R:**

**▸ Detección** · Omni Sense — El briefing llega al WhatsApp de Sofía — el canal correcto para alguien caminando al turno. Resumen contra plan: turno noche al 87%, tronadura -20%, 5 camiones parados, 2 alertas de seguridad. El sistema la busca a ella, no al revés.

**▸ Análisis** · Time Sight — Priorización objetiva: lo más importante primero, medido por impacto en el plan. Causa raíz de cada brecha identificada. Sofía llega a la reunión con contexto completo — en 30 segundos, no en 30 minutos.

**▸ Recomendación** · Clear Path — Post-reunión: "Tus indicaciones van OK" o "Atención: desvío detectado en ejecución." Seguimiento automático sin que Sofía tenga que pedirlo.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | Samsara | Push proactivo multicanal — el sistema busca al usuario |
| **Análisis** | Motive | Dashboard holístico con cruce de fuentes |
| **Recomendación** | Vercel v0 | Texto listo para acción, UX limpia |

**Evidencia PD-Spec:** [IG-SYNTH-04] Dashboard→Copiloto (12/54 fuentes), [IG-SYNTH-15] Efecto Gaviota (5/54), [IG-SYNTH-09] Perfiles diferenciados (12/54)

---

### Ficha 5: Copiloto en Terreno

**Eje:** Asistencia Inteligente (Dominio C)
**Perfil compuesto:** Jefe de Turno · Despachador
**Casos que agrupa:** L10 (Cumplimiento legal y seguridad), L11 (Saturación de radio)
**Pilar dominante:** Omni Sense

**Contexto:**
El jefe de turno frena la camioneta junto a una berma. Algo no se ve bien — la altura parece insuficiente. La normativa de Sernageomin está en un PDF en la oficina, a 20 minutos de camino. La radio suena con tres solicitudes simultáneas: un camión pide autorización, mantención pregunta por un equipo, seguridad reporta un incidente menor. Las manos están en el volante y la radio. No hay cómo consultar, priorizar ni responder en paralelo.
**No necesita un manual — necesita una respuesta directa, manos libres.**

**Flujo D→A→R:**

**▸ Detección** · Omni Sense — Consulta directa: foto de la berma + pregunta por voz. El sistema recibe por el canal que el usuario tenga disponible — voz, imagen, texto. La radio se transcribe automáticamente, las solicitudes se identifican y se ponen en cola.

**▸ Análisis** · Omni Sense — Cruce instantáneo con normativa vigente: Sernageomin, prevención de riesgos, procedimientos de faena. Las tres solicitudes de radio priorizadas por urgencia, cada una con contexto suficiente para decidir.

**▸ Recomendación** · Clear Path — "Cumple" o "Regulariza así: [pasos concretos]." Cola de solicitudes ordenada. Problema resuelto — silencio. Sin re-alertar, sin seguimiento innecesario. Manos libres de principio a fin.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | Discord | Canales de voz siempre activos — input natural |
| **Análisis** | Motive | Cruce multi-sensor para contexto completo |
| **Recomendación** | SentinelOne Purple AI | Respuesta directa guiada por AI |

**Evidencia PD-Spec:** [IG-SYNTH-08] Democratización del dato (9/54 fuentes), [IG-SYNTH-19] 4 Lentes Multimodal (7/54), [IG-SYNTH-18] Seguridad integrada (8/54)

---

### Ficha 6: Análisis Plan vs Realidad

**Eje:** Alineación Estratégica (Dominio D)
**Perfil compuesto:** Gerente Minas · Planificador Corto Plazo · Gerente Mina
**Casos que agrupa:** L1 (Cierre mensual y recuperación), L2 (Planificación de recursos), L19 (Equipos autónomos fin de semana)
**Pilar dominante:** Time Sight

**Contexto:**
Lunes, cierre semanal. El Gerente de Mina revisa los números: mineral cumplido, lastre cumplido. Pero la recuperación de planta está 6% bajo meta. Algo no cuadra. Los autónomos se detuvieron 14 veces durante el fin de semana — ¿por qué? La respuesta está repartida entre el sistema de posicionamiento, el log de antenas, el reporte de alimentación a planta y el historial de mantención. Cuatro sistemas, cuatro equipos, cuatro versiones parciales de la verdad.
**No necesita más datos — necesita la cadena causal completa en una sola vista.**

**Flujo D→A→R:**

**▸ Detección** · Time Sight — Alerta de brecha continua — no espera al cierre mensual. El gap entre plan y realidad se detecta mientras ocurre, con la pregunta ya respondida antes de que alguien la haga.

**▸ Análisis** · Time Sight — Time Scrubbing: rebobinar hasta el momento exacto del primer desvío. Cadena causal completa: antena descalibrada → posicionamiento incorrecto de autónomos → alimentación errática a planta → recuperación baja. Todo en una vista, no en cuatro sistemas.

**▸ Recomendación** · Clear Path — Ajustes recomendados con impacto cuantificado por intervención. De "qué pasó" a "por qué pasó" — y cuánto cuesta no corregirlo esta semana.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | Tesla Fleet | Detección de brecha plan vs realidad |
| **Análisis** | SentinelOne Storylines | Post-mortem con cadena causal completa |
| **Recomendación** | Chronosphere | Proyección temporal de impacto futuro |

**Evidencia PD-Spec:** [IG-SYNTH-12] Adherencia al plan (10/54 fuentes), [IG-SYNTH-01] Geometry Gap (15/54), [IG-SYNTH-05] Efecto Suiza — integrador neutral (10/54)

---

### Ficha 7: Optimización del Plan Minero

**Eje:** Alineación Estratégica (Dominio D)
**Perfil compuesto:** Gerente Minas · Planificador Corto Plazo
**Pilar dominante:** Time Sight
**Origen:** No proviene de láminas del workshop. Síntesis de evidencia en [IG-SYNTH-12], motor Orchestra, y reunión Camila 17 feb.

**Contexto:**
Lunes 8 AM, oficina de planificación. El plan decía 100 mil toneladas; la realidad fue 78 mil. No es novedad — el plan es conservador a propósito: los bonos se pagan por cumplimiento, no por optimización. Nadie sabe si era posible producir más, ni cuánto. ¿El gap fue por equipos mal asignados? ¿Por frentes subóptimos? ¿Por turnos de perforación insuficientes? La respuesta requeriría simular 15 escenarios alternativos — un ejercicio que nadie tiene tiempo ni herramientas para hacer.
**No necesita saber cuánto faltó — necesita saber cuánto más era posible.**

**Flujo D→A→R:**

**▸ Detección** · Time Sight — No solo la brecha — el potencial no capturado. El sistema revela algo que antes era invisible: el máximo alcanzable. No es un reporte de fin de turno — es un flujo vivo que muestra lo que se está dejando en la mesa.

**▸ Análisis** · Time Sight — Simulación con Orchestra: 15 escenarios alternativos evaluados. ¿Desvío puntual o estructural? ¿Qué variables tienen mayor palanca? Patrones históricos: "este desvío ya lo vimos 3 veces en los últimos 6 meses."

**▸ Recomendación** · Clear Path — Las 3 mejores intervenciones rankeadas por impacto: mover Pala 05 al frente norte (+5%), reasignar 2 camiones de Fase Sur (+3%), extender turno de perforación en zona 4 (+2%). Delta: USD 1.2M recuperables esta semana. Como Waze: no solo la ruta — cuándo hay una mejor.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | Chronosphere Lens | Patrones temporales, distingue puntual vs tendencia |
| **Análisis** | SentinelOne Storylines | Cadena causal completa del desvío |
| **Recomendación** | Tesla Fleet | Proyección visual de escenarios futuros |

**Evidencia PD-Spec:** [IG-SYNTH-12] Adherencia al plan (6/54), [IG-SYNTH-05] Efecto Suiza (10/54), [IG-SYNTH-06] Patrón D→A→R (25/54). Fuentes: COO meeting (incentivos), operaciones meeting (Orchestra/Delta2025), Design Brief (simulación).

**Gap:** El "ganarle al plan" (ir más allá del cumplimiento) es extensión lógica pero no está documentado como objetivo explícito. Se construye con evidencia existente + input de reunión Camila.

---

### Ficha 8: Reportería Ejecutiva

**Eje:** Alineación Estratégica (Dominio D)
**Perfil compuesto:** CFO · Gerente Minas · Controller Financiero
**Pilar dominante:** Time Sight + Clear Path
**Origen:** Workshop 01 (identificado como gap), Design Brief (Executive App). Sin lámina dedicada.
**Nota de evidencia:** CFO es "usuario invisible" según workshop. No hay entrevistas directas. Caso basado en hipótesis validada por equipo interno + Design Brief.

**Contexto:**
Reunión de directorio en curso. Alguien pregunta: "¿cómo va la operación minera?" El CFO no puede responder sin llamar a alguien, esperar un consolidado manual, o abrir un software que no entiende. Los datos existen — tonelaje, turnos, disponibilidad, alertas — pero están atrapados en sistemas diseñados para ingenieros, en un idioma que no es el suyo. La mina puede estar generando millones en valor capturado o destruyéndolo — y la persona que reporta al directorio es la última en enterarse.
**No necesita acceso a sistemas de operaciones — necesita la respuesta en su bolsillo, en su idioma.**

**Flujo D→A→R:**

**▸ Detección** · Quiet UI + Omni Sense — Notificación en el teléfono del CFO — un resumen ejecutivo que cabe en una pantalla. Cuatro KPIs traducidos a dinero: adherencia, producción, seguridad, valor capturado. Un solo indicador destacado pide atención. El resto — silencio.

**▸ Análisis** · Time Sight — Un tap en el indicador destacado. Drill-down financiero: qué turno fue el peor, por qué, cuánto costó. Comparativa con trimestres anteriores. Proyección de cierre si no se corrige. Legible desde el teléfono, en medio de la reunión.

**▸ Recomendación** · Clear Path — "Ritmo actual cierra -12%. Con intervención, cierra +3%. Delta: USD 1.8M." El CFO responde la pregunta del directorio sin haberse levantado de la mesa. El software no le pidió que aprendiera minería — aprendió a hablar finanzas.

**Referentes por Etapa:**

| Etapa | Referente | Qué robar |
|---|---|---|
| **Detección** | Datadog Bits AI | Resumen automático de estado del sistema |
| **Análisis** | SentinelOne Storylines | Navegación causal de incidentes |
| **Recomendación** | Compound Finance | Métricas financieras limpias, priorización visual |

**Evidencia PD-Spec:** [IG-SYNTH-12] Adherencia al plan (6/54), [IG-SYNTH-16b] Repricing (6/54), [IG-SYNTH-15] Efecto Gaviota (5/54), [CF-08] Gap financiero. Fuentes: Workshop transcript ("CFO invisible"), Workshop análisis ("dinero por turno"), Design Brief (Executive App).

---

## Resumen de síntesis

| # | Ficha | Dominio | Pilar | Láminas | Referentes D / A / R |
|---|---|---|---|---|---|
| 1 | Caída de Equipo Crítico | A. Crisis | Quiet UI | L8, L13, L14, L15 | CrowdStrike / SentinelOne / Vercel v0 |
| 2 | Riesgo Espacial y Seguridad | A+C. Crisis/Asistencia | Omni Sense | L6, L7, L12 | Anduril / Chronosphere / SentinelOne |
| 3 | Anticipación de Cuello de Botella | B. Anticipación | Time Sight | L3, L5, L9, L16 | Chronosphere / Tesla Fleet / Datadog |
| 4 | Briefing Inteligente | C. Asistencia | Omni Sense | L4, L18 | Samsara / Motive / Vercel v0 |
| 5 | Copiloto en Terreno | C. Asistencia | Omni Sense | L10, L11 | Discord / Motive / SentinelOne |
| 6 | Análisis Plan vs Realidad | D. Estrategia | Time Sight | L1, L2, L19 | Tesla Fleet / SentinelOne / Chronosphere |
| 7 | Optimización del Plan Minero | D. Estrategia | Time Sight | — (síntesis) | Chronosphere / SentinelOne / Tesla Fleet |
| 8 | Reportería Ejecutiva | D. Estrategia | Time Sight + Clear Path | — (síntesis) | Datadog / SentinelOne / Compound |

**Cobertura:** 18/20 láminas sintetizadas en 6 fichas base + 2 fichas de síntesis. Outliers: L17 (arquitectura técnica), L20 (visión "Skynet").
**Reducción:** 20 casos → 8 fichas (6 del workshop + 2 emergentes de evidencia cruzada).
**Patrón transversal:** Clear Path (D→A→R) estructura las 8 fichas. Los 4 pilares participan en cada ficha con distinto peso.

---

## Comparativa vs Gemini (10 casos maestros)

| Criterio | Gemini (10 casos) | PD-Spec (8 fichas) |
|---|---|---|
| Cantidad | 10 casos genéricos | 8 fichas sintetizadas (6 workshop + 2 evidencia cruzada) |
| Método de agrupación | Por situación genérica | Por flujo de experiencia compartido |
| Cobertura | L2, L4 omitidas; L10 perdida | 18/20 láminas + 2 casos emergentes de síntesis |
| Casos inventados | 3 (#8 Emergencia Climática, #9 Auditoría, #10 Simul. Estratégica) | 0 inventados — fichas 7-8 con evidencia cruzada explícita |
| Referentes | Algunos débiles (Monday.com, Waze, Uber Fleet) | 3 referentes por etapa DAR del benchmark verificado |
| Pilares | Nombres viejos de Gemini | Nombres aprobados (Quiet UI, Clear Path, Time Sight, Omni Sense) |
| Evidencia | Sin referencias | Cada ficha con [IG-SYNTH-XX] y convergencia |
| Repetición | Alta (crisis + imprevisto + falla = mismo flujo) | Mínima (agrupados por flujo, no por evento) |
