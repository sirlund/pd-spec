# User Personas — TIMining

> v1.1 | 2026-02-25 | 5 personas, 22 insight refs, 3 gaps

## Pilares por Perfil

Los 4 pilares gobiernan el diseño de cada experiencia de usuario. Cada perfil tiene un pilar líder que determina qué se prioriza en su interfaz [IG-16], [IG-17]:

| Perfil | Pilar líder | Soporte | Por qué |
|---|---|---|---|
| **P-01 Despachador** | Quiet UI | Clear Path | Gestión por excepción desde sala de control — ver solo el problema, no el estado normal de 50 camiones |
| **P-02 Jefe de Turno** | Omni Sense | Quiet UI | En terreno sin pantalla — la información debe llegar a radio/WhatsApp/voz+foto. Manos libres como modo primario [IG-21] |
| **P-03 Gerente de Mina** | Quiet UI | Omni Sense | Semáforo desde el celular — solo las excepciones que requieren su intervención personal |
| **P-04 Planificador** | Time Sight | Clear Path | Su valor es anticipar, no reaccionar — simulaciones y análisis de qué viene después |
| **P-05 CFO** | Clear Path | Omni Sense | ¿Qué decisión financiera tomar ahora? La información llega en reportes automáticos, no en dashboards operacionales |

---

## P-01: Despachador — Control en Sala, Segundo a Segundo

> "Si hay 50 camiones bien, no me los muestres. Muéstrame los 5 que generan problema." — [IG-SYNTH-07]

**Goals:**
- Mantener todos los equipos asignados en el lugar correcto del plan en todo momento [IG-SYNTH-01]
- Detectar desviaciones operacionales antes de que afecten la adherencia del turno [IG-SYNTH-12]
- Recibir alertas críticas legibles en menos de 5 segundos sin necesidad de interpretar dashboards [IG-SYNTH-07]
- Entregar un turno con contexto completo para no producir caída de producción por traspaso [IG-SYNTH-15]

**Frustrations:**
- La interfaz actual (Aware) muestra el mismo visor para todos los perfiles — saturación de capas sin diferenciación por rol [IG-SYNTH-09]
- Los tiempos de actualización de los datos son confusos: GPS casi en tiempo real, mapas de calor cada 3h con 30 min de desfase — no sabe si lo que ve es actual [IG-SYNTH-03]
- Recibe demasiada información que no utiliza; el ruido visual impide distinguir lo crítico [IG-SYNTH-07]

**Context:**
- Opera desde sala de control en desktop — entorno con múltiples pantallas, baja movilidad física
- Su horizonte temporal es el turno actual (8-12h); evalúa el estado operacional minuto a minuto
- Trabaja bajo presión constante: cada desvío del plan tiene impacto financiero directo [IG-SYNTH-12]
- Punto de convergencia de información: recibe alertas de equipos, geotecnia, seguridad y planificación simultáneamente [IG-SYNTH-18]

**Behaviors:**
- Escanea pantallas buscando anomalías — necesita gestión por excepción, no estado completo [IG-SYNTH-07]
- Cuando detecta un problema, sigue mentalmente el patrón Detección → Análisis → Recomendación antes de actuar [IG-SYNTH-06]
- En el cambio de turno, transmite estado verbal al entrante — proceso no estructurado que genera pérdida de contexto [IG-SYNTH-15]
- Usa WhatsApp para coordinación con jefes de turno en terreno — las decisiones críticas ocurren fuera del sistema [IG-03]

**Pilar líder:** **Quiet UI** — su rol exige filtrar el ruido de 50+ equipos para ver solo las anomalías. Clear Path como soporte: cuando detecta el problema, el sistema le guía directamente a la acción recomendada. [IG-16]

---

## P-02: Jefe de Turno — Terreno, Radio IP y la Tensión de Ser Auditado

> "Si no logramos vender al operador, estamos afuera." — Carlo, CTO [IG-04]

**Goals:**
- Tomar decisiones tácticas correctas en tiempo real sin necesidad de volver a sala para consultar una pantalla [IG-SYNTH-09]
- Saber si está cumpliendo procedimientos de trabajo — responsabilidad legal ante un incidente [IG-SYNTH-18]
- Recibir alertas de seguridad geotécnica antes de que un equipo ingrese a una zona de riesgo [IG-SYNTH-18]
- Llegar al briefing de inicio de turno ya informado, sin depender de que el turno saliente explique todo [IG-SYNTH-15]

**Frustrations:**
- Planificación usa TIMining para auditarlo — él resiste la herramienta porque la percibe como mecanismo de control, no de ayuda [IG-04]
- Trabaja en terreno con radio IP y WhatsApp: la plataforma actual está diseñada para desktop, no para su contexto físico [IG-03]
- Las capacitaciones son largas y no se adaptan a su ritmo de trabajo — "trabaja en mina, constantemente reagendan" [IG-SYNTH-11]
- Las decisiones que toma por radio no quedan registradas en el sistema — pérdida de conocimiento operacional entre turnos [IG-03]

**Context:**
- Está en terreno la mayor parte del turno — accede a información desde celular o tablet, con conectividad variable
- Canal principal de comunicación: radio IP y WhatsApp, no pantallas de control [IG-03]
- Su responsabilidad abarca seguridad, cumplimiento del plan y gestión de personas simultáneamente
- Punto neurálgico de la adopción bottom-up: si no percibe valor, la resistencia se expande [IG-04], [IG-SYNTH-17]

**Behaviors:**
- Toma decisiones rápidas en campo basado en lo que ve y escucha — no en datos de pantalla [IG-SYNTH-09]
- Frente a una alerta geotécnica, coordina despeje por radio — el proceso no queda registrado [IG-SYNTH-18]
- Reporta novedades al turno siguiente de forma verbal o por WhatsApp — información perecible [IG-SYNTH-15]
- Cuando el sistema le muestra su desempeño sin que él lo haya solicitado, lo percibe como vigilancia [IG-04]

**Pilar líder:** **Omni Sense** — la plataforma debe encontrarlo en terreno (radio, WhatsApp, Push-to-Talk con voz+foto), no al revés. Quiet UI como soporte: las alertas que recibe deben ser solo las críticas, legibles con un golpe de vista. La interfaz manos libres no es un feature opcional para este perfil — es el requisito base. [IG-21], [IG-16]

> **[GAP]** — No hay entrevistas directas con jefes de turno en faenas activas. Los comportamientos descritos son inferidos de stakeholders internos (CTO, COO) y notas de campo de IDEMAX. Resolver con entrevistas de Etapa 2. [CF-07]

---

## P-03: Gerente de Mina — Semáforo desde el Celular, Visión Macro

> "Ayúdame a tomar la mejor decisión porque no tengo tiempo." — Framing aprobado [IG-SYNTH-16], [CF-12]

**Goals:**
- Ver el estado de adherencia al plan de la faena en una sola pantalla, desde el celular, en menos de 30 segundos [IG-SYNTH-07], [IG-SYNTH-12]
- Recibir alertas de situaciones críticas que requieren su intervención — no seguimiento rutinario [IG-SYNTH-07]
- Entender el impacto financiero acumulado de los desvíos del plan, en lenguaje de negocio no técnico [IG-SYNTH-12]
- Evaluar el desempeño del turno para conversaciones con gerencia corporativa [IG-SYNTH-17]

**Frustrations:**
- Los reportes actuales no traducen datos operacionales a valor financiero — hay desconexión entre operación y finanzas [IG-06]
- La plataforma requiere expertise para interpretar las capas de información — él no tiene tiempo para curvas de aprendizaje [IG-SYNTH-11]
- Recibe información fragmentada de distintos sistemas — debe construir el panorama mental por su cuenta [IG-SYNTH-01]

**Context:**
- Accede desde celular o tablet — interfaz Briefing (feed mobile-first) es su canal natural [IG-SYNTH-19]
- Su horizonte temporal es la semana y el mes — no el minuto a minuto del despachador
- Interlocutor entre operaciones y gerencia corporativa — necesita traducir operación a lenguaje ejecutivo [IG-06]
- Comprador o co-decisor del contrato TIMining — su percepción de valor impacta la renovación [IG-SYNTH-16b]

**Behaviors:**
- Revisa estado de la faena al inicio del día y ante alertas críticas — no monitoreo continuo [IG-SYNTH-07]
- Usa WhatsApp para obtener información urgente de sus jefes de turno [IG-03]
- Prepara reportes de desempeño con datos que extrae manualmente de múltiples fuentes [IG-SYNTH-01]
- Toma decisiones de asignación de recursos basado en adherencia al plan semanal [IG-SYNTH-12]

**Pilar líder:** **Quiet UI** — semáforo desde el celular: verde todo bien, rojo requiere su intervención. No quiere dashboards, quiere certeza de que si no lo llaman, la faena va bien. Omni Sense como soporte: el briefing diario llega a su canal natural (móvil, feed) sin que tenga que buscarlo. [IG-16]

> **[GAP]** — No hay entrevistas directas con gerentes de mina. El perfil se construye a partir de casos de uso del Workshop 01 y narrativa del CEO/COO. Prioridad media en plan de entrevistas Etapa 2. [CF-07]

---

## P-04: Planificador — Desktop, Analítica Profunda, TIM Agent

> "Ya no se necesitan expertos en SQL — cualquier supervisor puede preguntar en lenguaje natural." — Carlo, CTO [IG-SYNTH-08]

**Goals:**
- Correr simulaciones sobre la topografía actualizada para evaluar escenarios del plan siguiente [IG-SYNTH-01]
- Acceder a analítica profunda sin necesidad de cruzar bases de datos manualmente [IG-SYNTH-13]
- Detectar causas raíz de desvíos del plan para ajustar la planificación siguiente [IG-SYNTH-06]
- Generar recomendaciones rankeadas por impacto al plan para los equipos de operaciones [IG-SYNTH-04]

**Frustrations:**
- Hoy conectar Orchestra con sistemas web requiere "bajar bases de datos y hacer cruces manuales" — proceso lento y propenso a error [IG-SYNTH-13]
- Orchestra tiene 30% de uso real — la plataforma tiene capacidad analítica que los usuarios no aprovechan por la barrera de aprendizaje [IG-SYNTH-11]
- Las customizaciones pedidas por el cliente fragmentan la herramienta — cada faena tiene una versión distinta [IG-SYNTH-02]
- Cuando la topografía tiene 3h de desfase, las simulaciones pierden confiabilidad [IG-SYNTH-03]

**Context:**
- Opera en desktop — su lente natural es Tactical (2D Flow) y TIM Agent (conversacional) [IG-SYNTH-19]
- Su horizonte temporal es la semana y el turno siguiente — planifica con anticipación de 24-72h
- Usuario de alta expertise: conoce la terminología operacional y los parámetros del plan [IG-SYNTH-08]
- Puente entre la data y las decisiones operacionales — su output alimenta directamente al despachador [IG-SYNTH-06]

**Behaviors:**
- Construye escenarios alternativos para el plan y los presenta a la jefatura con métricas de impacto [IG-SYNTH-04]
- Consulta TIM Agent en lenguaje natural para obtener insights sin pasar por SQL [IG-SYNTH-08]
- Detecta tendencias de desvío antes de que se conviertan en crisis operacional [IG-SYNTH-06]
- Evalúa el cumplimiento del plan anterior y documenta causas de desvío para la siguiente planificación [IG-SYNTH-12]

**Pilar líder:** **Time Sight** — su valor es prever, no reaccionar. Necesita ver qué va a pasar si el plan no se ajusta ahora, no solo qué pasó ayer. Clear Path como soporte: de todas las simulaciones posibles, ¿qué decisión de planificación tomar? [IG-16], [IG-19]

---

## P-05: CFO / Gerente de Finanzas — Reportería Ejecutiva, Desconexión Mina-Planta

> "Mi cliente no es tecnología — mi cliente es el Excel." — Philip, CEO [IG-05]

**Goals:**
- Ver el impacto financiero de la operación minera en tiempo real, en métricas comprensibles para el directorio [IG-06]
- Conectar los KPIs operacionales de la mina con los resultados financieros de la planta — hoy esa conexión no existe [IG-06]
- Generar reportes ejecutivos sin depender de que operaciones prepare datos manualmente [IG-SYNTH-14]
- Evaluar el ROI de TIMining en términos de valor capturado vs. costo de licencia [IG-SYNTH-16b]

**Frustrations:**
- La desconexión mina-planta es un gap operacional real: información de distintas fuentes, reportería sin valor real [IG-06]
- Operación y finanzas "no se hablan" — los datos operacionales no se traducen automáticamente a lenguaje financiero [IG-06]
- Los ahorros capturados (USD 10M+, USD 6M en 5 meses) no son visibles en sus sistemas de reporting — se pierden en la narrativa de ventas [IG-SYNTH-12]
- El ciclo de venta de 2 años y los 6 meses de instalación hacen difícil justificar el ROI ante el directorio [IG-SYNTH-14]

**Context:**
- No opera en la mina — accede a información desde oficina corporativa o remotamente [IG-SYNTH-09]
- Su canal natural es reportería ejecutiva, no dashboards operacionales [IG-SYNTH-19]
- Interlocutor clave en la renovación y expansión de contratos — percepción de valor impacta directamente el crecimiento [IG-SYNTH-16b]
- Referencia principal: Excel y sistemas ERP — la venta debe conectarse con procesos familiares [IG-05]

**Behaviors:**
- Solicita reportes periódicos a operaciones para construir sus propios análisis — proceso manual y lento [IG-SYNTH-14]
- Evalúa el desempeño de la mina en métricas financieras agregadas, no en adherencia espacial [IG-SYNTH-12]
- Compara el valor de TIMining contra alternativas internas (Excel avanzado, consultorías) — no contra software minero [IG-05]
- Escala preguntas sobre la operación a través de jerarquía — no accede directamente a datos de faena [IG-06]

**Pilar líder:** **Clear Path** — ¿qué decisión financiera tomar con esta información? No necesita ver la faena, necesita que alguien le diga si el negocio va bien o mal y qué puede hacer al respecto. Omni Sense como soporte: la información llega en reportes automáticos a su canal ejecutivo (móvil, email), no en dashboards de operaciones. [IG-20], [IG-16]

> **[GAP]** — No hay entrevistas con CFO ni Gerentes de Finanzas de clientes actuales de TIMining. El perfil se construye a partir del Touchpoint del 19-feb (IG-06) y la narrativa del CEO. El modelo de datos que une operaciones con finanzas no está definido. Pendiente CF-08 para unit economics. [CF-07], [CF-08]

---

## Insights Summary

| ID | Concepto | Status | Convergencia | Personas |
|---|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap — Brecha plan vs. realidad | VERIFIED | 15/54 | P-01, P-03, P-04 |
| [IG-SYNTH-02] | Auto de Homero Simpson — Feature bloat | VERIFIED | 8/54 | P-04 |
| [IG-SYNTH-03] | Confusión Temporal — Tiempos de dato generan abandono | VERIFIED | 5/57 | P-01, P-04 |
| [IG-SYNTH-04] | Del Dashboard al Copiloto — Asistencia proactiva | VERIFIED | 12/54 | P-04 |
| [IG-SYNTH-06] | Patrón D→A→R — Detección → Análisis → Recomendación | VERIFIED | 26/57 | P-01, P-04 |
| [IG-SYNTH-07] | Gestión por Excepción — Solo mostrar lo que importa | VERIFIED | 10/57 | P-01, P-03 |
| [IG-SYNTH-08] | Democratización del Dato — De expertos a todos | VERIFIED | 9/54 | P-04 |
| [IG-SYNTH-09] | Perfiles diferenciados con necesidades distintas | VERIFIED | 13/57 | P-01, P-02, P-03, P-05 |
| [IG-SYNTH-11] | Curva de aprendizaje y barrera de adopción | VERIFIED | 7/57 | P-02, P-03, P-04 |
| [IG-SYNTH-12] | Adherencia espacial como métrica central | VERIFIED | 10/54 | P-01, P-03, P-04, P-05 |
| [IG-SYNTH-13] | Stack tecnológico fragmentado | VERIFIED | 3/54 | P-04 |
| [IG-SYNTH-14] | Dependencia de venta consultiva | VERIFIED | 4/57 | P-05 |
| [IG-SYNTH-15] | Efecto Gaviota — Dolor del cambio de turno | VERIFIED | 5/54 | P-01, P-02 |
| [IG-SYNTH-16] | Paz Mental como propuesta de valor experiencial | VERIFIED | 7/57 | P-03 |
| [IG-SYNTH-16b] | Oportunidad de repricing — precio vs. valor | VERIFIED | 8/57 | P-03, P-05 |
| [IG-SYNTH-17] | Adopción bottom-up — Operational Pull | VERIFIED | 6/57 | P-02, P-03 |
| [IG-SYNTH-18] | Seguridad y gestión geotécnica integrada | VERIFIED | 8/54 | P-01, P-02 |
| [IG-SYNTH-19] | Interfaz Multimodal — 4 Lentes de navegación | VERIFIED | 7/54 | P-03, P-04, P-05 |
| [IG-03] | WhatsApp como canal principal de decisiones | VERIFIED | 2/57 | P-01, P-02, P-03 |
| [IG-04] | Resistencia de operadores cuando son auditados | VERIFIED | 1/57 | P-02 |
| [IG-05] | "Mi cliente es el Excel" — posicionamiento vs. herramientas familiares | VERIFIED | 1/57 | P-05 |
| [IG-06] | Desconexión mina-planta — Tercer gap operacional | VERIFIED | 1/57 | P-05 |
