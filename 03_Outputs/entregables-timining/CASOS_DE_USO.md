# Casos de Uso por Dominio — TIMining CORE

> Documento de trabajo. Versión en desarrollo para revisión martes 18 feb.
> Fuentes: 20 láminas Workshop 01 (Casos de Uso Workshop 01.docx), Estrategia Maestra v3.4, PD-Spec Insights Graph (54 fuentes).

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

**Nota vs Gemini:** L2 estaba omitida. L19 estaba en Crisis — la movemos aquí porque es un análisis retrospectivo (post-mortem del fin de semana), no respuesta inmediata.

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

## Fichas Sintetizadas — 6 Casos Maestros

> Las 20 láminas del workshop se reducen a 6 fichas que eliminan repetición y revelan los flujos reales de la operación. Cada ficha agrupa láminas con el mismo patrón de experiencia, asigna un pilar dominante, y conecta con un referente del benchmark.

---

### Ficha 1: Caída de Equipo Crítico

**Eje:** Respuesta a Crisis (Dominio A)
**Perfil compuesto:** Despachador IROC · Supervisor de Turno · Jefe de Turno
**Casos que agrupa:** L8 (Respuesta rápida despachador), L13 (Falla mecánica), L14 (Pala cae turno noche), L15 (Pala alimentación WIP)
**Pilar dominante:** Quiet UI

**Contexto:**
Turno de noche, sala de control IROC o terreno. Un equipo crítico (pala de carguío, cargador) cae sin planificación. Tiempo de indisponibilidad incierto. Cada minuto sin producir es tonelaje perdido. Cables aéreos y zonas de seguridad complican el movimiento de otros equipos.

**Flujo D→A→R:**

| Etapa | Acción CORE | Pilar |
|---|---|---|
| **Detección** | Alerta automática multicanal (celular + voz + pantalla IROC). La pantalla acromática se ilumina solo con la anomalía. | Quiet UI |
| **Análisis** | Impacto en tonelaje del turno. Comparativa con fallas históricas similares. Evaluación de riesgos: cables aéreos, zonas restringidas, equipos disponibles. | Time Sight |
| **Recomendación** | 3 opciones rankeadas por impacto: (1) detener flota, (2) cambiar puntos de vaciado, (3) enviar cargador. Ruta segura sugerida. Pérdida estimada por opción. | Clear Path |
| **Post-acción** | Coordinación con mantención vía plataforma. Comunicación a equipos afectados por canal correcto (radio a terreno, chat a oficina). | Omni Sense |

**Referente:** **CrowdStrike** — Achromatic Design. Consola de ciberseguridad intencionalmente "aburrida" (95% gris/negro) donde el color es exclusivo para amenazas activas. El analista no busca el problema; el problema le llega. *Adaptación:* Pantalla IROC silenciosa que se "enciende" solo ante caída de equipo, con opciones rankeadas como alertas de seguridad.

**Evidencia PD-Spec:** [IG-SYNTH-07] Gestión por Excepción (8/54 fuentes), [IG-SYNTH-06] Patrón D→A→R (25/54), [IG-SYNTH-16] Paz Mental (5/54)

---

### Ficha 2: Riesgo Espacial y Seguridad

**Eje:** Respuesta a Crisis (Dominio A) + Asistencia Inteligente (Dominio C)
**Perfil compuesto:** Supervisor de Monitoreo · Gerente Mina · Jefe de Turno
**Casos que agrupa:** L6 (Alerta geotécnica), L7 (Ajuste táctico por zona de riesgo), L12 (Tronadura y despeje)
**Pilar dominante:** Omni Sense

**Contexto:**
Zona de riesgo geotécnico activada — una pala opera en sector inestable. O bien: tronadura planificada donde loros deben estar posicionados correctamente. La seguridad es innegociable y tiene responsabilidad legal directa. El sistema debe cruzar múltiples fuentes sensoriales (radares, prismas, GPS, radio) para dar certeza.

**Flujo D→A→R:**

| Etapa | Acción CORE | Pilar |
|---|---|---|
| **Detección** | Monitoreo geotécnico integrado (ARIS) cruza con GPS de equipos en zona de riesgo. Tronadura: horario + malla cruzada con posición de loros. | Omni Sense |
| **Análisis** | Simulación de escenarios de indisponibilidad de zonas. Impacto en plan semanal/mensual. Zonas de restricción actualizadas en tiempo real. | Time Sight |
| **Recomendación** | Definir zonas de restricción. Redefinir despacho evitando sector. Set de alternativas con impacto medido. Confirmar despeje correcto. | Clear Path |
| **Post-acción** | Monitoreo continuo de variables críticas. Alertas solo si la situación cambia. | Quiet UI |

**Referente:** **Anduril Lattice OS** — Spatial Intelligence. El sistema de defensa no pide al operador mirar cámaras; identifica automáticamente el "interés" y lo proyecta en una UI de baja carga cromática. *Adaptación:* CORE cruza radares, prismas, GPS y radio sin que el operador tenga que consultar múltiples sistemas de monitoreo.

**Evidencia PD-Spec:** [IG-SYNTH-18] Seguridad geotécnica integrada (8/54 fuentes), [IG-SYNTH-01] Geometry Gap (15/54), [IG-SYNTH-06] Patrón D→A→R (25/54)

---

### Ficha 3: Anticipación de Cuello de Botella

**Eje:** Anticipación Operativa (Dominio B)
**Perfil compuesto:** Jefe de Chancado · Planificador PyT · Jefe de Operaciones
**Casos que agrupa:** L3 (Bloqueo chancador 45 min), L5 (Patios sin perforar), L9 (Incumplimiento velocidades), L16 (Mantenciones retrasadas)
**Pilar dominante:** Time Sight

**Contexto:**
Turno diurno, operación aparentemente normal. El sistema detecta que en 45 minutos habrá un problema: el chancador se bloquea, los patios no están listos, las velocidades caen. Todavía hay tiempo para actuar. El desafío no es reaccionar sino anticipar. Múltiples áreas afectadas aguas abajo.

**Flujo D→A→R:**

| Etapa | Acción CORE | Pilar |
|---|---|---|
| **Detección** | Alerta predictiva: "en 45 min se bloquea el chancador." Integración con PI System. Alertas automáticas en zonas de baja velocidad. | Time Sight |
| **Análisis** | Impacto aguas abajo en tonelaje y dinero. Causa raíz: ¿vía (mantenimiento)? ¿equipo (mecánico)? ¿operador (capacitación)? Disponibilidad de recursos reasignables. | Time Sight |
| **Recomendación** | Redistribuir flujo, stockear, o saturar controladamente. Reasignar equipos de servicio. KPI crítico del momento priorizado. Alertar áreas afectadas. | Clear Path |
| **Post-acción** | Notificación a áreas impactadas aguas abajo por canal correcto. | Omni Sense |

**Referente:** **Chronosphere** — Lens. Políticas de retención temporal ajustables durante incidentes activos: permite "zoom temporal" para distinguir si un patrón es puntual o tendencia. *Adaptación:* CORE permite ver si el bloqueo del chancador es un evento aislado o un patrón que se repite cada turno, informando si la solución debe ser táctica o estructural.

**Evidencia PD-Spec:** [IG-SYNTH-06] Patrón D→A→R (25/54 fuentes), [IG-SYNTH-12] Adherencia al plan (10/54), [IG-SYNTH-03] Confusión Temporal (4/54)

---

### Ficha 4: Briefing Inteligente

**Eje:** Asistencia Inteligente (Dominio C)
**Perfil compuesto:** Supervisor IROC ("Sofía") · Gerencia CIO/Operaciones
**Casos que agrupa:** L4 (Reunión diaria CIO 8 AM), L18 (Asistencia proactiva pre-reunión)
**Pilar dominante:** Omni Sense

**Contexto:**
Reunión de coordinación en 15 minutos. El usuario está saturado de correos, reuniones previas, radio. No tiene tiempo para prepararse. Necesita contexto instantáneo: ¿cómo vamos contra el plan? ¿qué problemas hay? ¿qué hago primero? El sistema debe buscar al usuario, no al revés.

**Flujo D→A→R:**

| Etapa | Acción CORE | Pilar |
|---|---|---|
| **Detección** | 15 min antes de la reunión, mensaje por WhatsApp con resumen vs plan. Canal correcto: WhatsApp porque el usuario está caminando al turno. | Omni Sense |
| **Análisis** | Priorización objetiva de incidentes. Causa raíz de brechas. Problemas específicos con métricas: tronadura -20%, 5 camiones estacionados, 2 riesgos de seguridad. | Time Sight |
| **Recomendación** | Texto listo para indicaciones de reunión. Visualización 2D con call outs focales. Plan de acción para mitigar impactos. | Clear Path |
| **Post-acción** | Mensajes proactivos post-reunión: "tus indicaciones van ok" o "atención: desvío en ejecución." Seguimiento automatizado. | Omni Sense |

**Referente:** **Samsara** — Connected Workflows. Dashboard holístico que integra múltiples fuentes sensoriales (GPS, cámaras, telemática) en flujos automatizados, eliminando papeleo. *Adaptación:* CORE sintetiza datos de FMS, GPS, PI System y genera un briefing contextual que llega al usuario por el canal donde esté — sin necesidad de abrir el dashboard.

**Evidencia PD-Spec:** [IG-SYNTH-04] Dashboard→Copiloto (12/54 fuentes), [IG-SYNTH-15] Efecto Gaviota (5/54), [IG-SYNTH-09] Perfiles diferenciados (12/54)

---

### Ficha 5: Copiloto en Terreno

**Eje:** Asistencia Inteligente (Dominio C)
**Perfil compuesto:** Jefe de Turno · Despachador
**Casos que agrupa:** L10 (Cumplimiento legal y seguridad), L11 (Saturación de radio)
**Pilar dominante:** Omni Sense

**Contexto:**
En terreno o sala de control. Radio saturada con múltiples solicitudes simultáneas. Duda operacional urgente: "¿estoy cumpliendo la norma de berma de Sernageomin?" No hay tiempo de revisar documentos. Las manos están ocupadas. La interfaz principal es la voz y la cámara del celular.

**Flujo D→A→R:**

| Etapa | Acción CORE | Pilar |
|---|---|---|
| **Detección** | Consulta directa por voz o foto. Radio: el sistema escucha, transcribe e identifica solicitudes. Canal: el que el usuario tenga disponible. | Omni Sense |
| **Análisis** | Cruce con normativa: prevención de riesgos, Sernageomin, procedimientos de faena. Priorización automática de solicitudes de radio por urgencia. | Omni Sense |
| **Recomendación** | "Estás cumpliendo" o "Regulariza así: [pasos concretos]." Lista priorizada de solicitudes pendientes de radio con contexto. | Clear Path |
| **Post-acción** | Silencio una vez resuelto. No re-alertar. | Quiet UI |

**Referente:** **Discord** — Canales de voz siempre activos con Push-to-Talk. Manejo de múltiples canales de voz simultáneos donde el sistema organiza, prioriza y facilita la comunicación sin saturar. *Adaptación:* CORE transcribe, prioriza y organiza solicitudes de radio como "canales" temáticos, eliminando la saturación del despachador.

**Evidencia PD-Spec:** [IG-SYNTH-08] Democratización del dato (9/54 fuentes), [IG-SYNTH-19] 4 Lentes Multimodal (7/54), [IG-SYNTH-18] Seguridad integrada (8/54)

---

### Ficha 6: Análisis Plan vs Realidad

**Eje:** Alineación Estratégica (Dominio D)
**Perfil compuesto:** Gerente Minas · Planificador Corto Plazo · Gerente Mina
**Casos que agrupa:** L1 (Cierre mensual y recuperación), L2 (Planificación de recursos), L19 (Equipos autónomos fin de semana)
**Pilar dominante:** Time Sight

**Contexto:**
Horizonte temporal más largo: fin de turno, fin de semana, cierre mensual. Los números parecen bien pero algo no cuadra. Se cumple mineral y lastre pero la recuperación de planta es mala. Los camiones autónomos se pararon más de lo esperado. El material no era lo previsto. Se necesita entender la cadena causal completa.

**Flujo D→A→R:**

| Etapa | Acción CORE | Pilar |
|---|---|---|
| **Detección** | Alerta de brecha plan vs realidad. Hindsight: ¿qué pasó durante el fin de semana? ¿por qué cayó la recuperación si el mineral se cumplió? | Time Sight |
| **Análisis** | Raíz del desvío: categorización real de mineral vs reportada. Análisis de posición/velocidad de autónomos. Detección de anomalías. Comparativa con períodos anteriores. | Time Sight |
| **Recomendación** | Ajustes dinámicos de flota. Reposicionamiento de antenas. Simulación de alternativas para suplir o mitigar. Tracking real del mineral al chancado. | Clear Path |
| **Post-acción** | Proyección: si no se corrige, ¿cuál es el impacto en el plan semanal/mensual? Foresight como herramienta de urgencia. | Time Sight |

**Referente:** **Tesla Fleet** — Time Scrubbing. Interfaces de telemetría que permiten "rebobinar" incidentes para entender la causalidad física exacta: posición, velocidad, entorno, segundo a segundo. *Adaptación:* CORE permite navegar temporalmente una jornada de equipos autónomos, ver dónde se pararon, cruzar con caminos y antenas, y entender la causa raíz geográficamente.

**Evidencia PD-Spec:** [IG-SYNTH-12] Adherencia al plan (10/54 fuentes), [IG-SYNTH-01] Geometry Gap (15/54), [IG-SYNTH-05] Efecto Suiza — integrador neutral (10/54)

---

## Resumen de síntesis

| # | Ficha | Dominio | Pilar | Láminas | Referente |
|---|---|---|---|---|---|
| 1 | Caída de Equipo Crítico | A. Crisis | Quiet UI | L8, L13, L14, L15 | CrowdStrike |
| 2 | Riesgo Espacial y Seguridad | A+C. Crisis/Asistencia | Omni Sense | L6, L7, L12 | Anduril Lattice OS |
| 3 | Anticipación de Cuello de Botella | B. Anticipación | Time Sight | L3, L5, L9, L16 | Chronosphere |
| 4 | Briefing Inteligente | C. Asistencia | Omni Sense | L4, L18 | Samsara |
| 5 | Copiloto en Terreno | C. Asistencia | Omni Sense | L10, L11 | Discord |
| 6 | Análisis Plan vs Realidad | D. Estrategia | Time Sight | L1, L2, L19 | Tesla Fleet |

**Cobertura:** 18/20 láminas sintetizadas en 6 fichas. Outliers: L17 (arquitectura técnica), L20 (visión "Skynet").
**Reducción:** 20 casos → 6 fichas (70% de reducción sin perder información).
**Patrón transversal:** Clear Path (D→A→R) estructura las 6 fichas. Los 4 pilares participan en cada ficha con distinto peso.

---

## Comparativa vs Gemini (10 casos maestros)

| Criterio | Gemini (10 casos) | PD-Spec (6 fichas) |
|---|---|---|
| Cantidad | 10 casos genéricos | 6 fichas sintetizadas |
| Método de agrupación | Por situación genérica | Por flujo de experiencia compartido |
| Cobertura | L2, L4 omitidas; L10 perdida | 18/20 láminas (solo L17, L20 outliers) |
| Casos inventados | 3 (#8 Emergencia Climática, #9 Auditoría, #10 Simul. Estratégica) | 0 — todo traza a láminas reales |
| Referentes | Algunos débiles (Monday.com, Waze, Uber Fleet) | Todos del benchmark verificado |
| Pilares | Nombres viejos de Gemini | Nombres aprobados (Quiet UI, Clear Path, Time Sight, Omni Sense) |
| Evidencia | Sin referencias | Cada ficha con [IG-SYNTH-XX] y convergencia |
| Repetición | Alta (crisis + imprevisto + falla = mismo flujo) | Mínima (agrupados por flujo, no por evento) |
