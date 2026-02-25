# Benchmark UX — TIMining CORE

> v1.1 | 2026-02-25 | 17 referentes, 4 pilares de diseño | es

---

## Tabla Resumen

| Referente | Industria | Pilar | Patrón clave |
|---|---|---|---|
| NATS (National Air Traffic Services) | Control aéreo | Quiet UI | Vigilancia por excepción: solo lo anómalo rompe el silencio |
| PagerDuty | Operaciones IT / SRE | Quiet UI | Alerting fatigue mitigation — supresión de ruido, escalada automática |
| Datadog | Monitoring / DevOps | Quiet UI | Anomaly detection + alert grouping para reducir cognitive load |
| Tesla Autopilot HUD | Automoción | Quiet UI | Glanceable status: 1 vistazo = estado completo del sistema |
| Waze | Navegación / Movilidad | Clear Path | Routing explicado paso a paso con contexto de la decisión |
| Linear | Productividad / Dev Tools | Clear Path | Issue → Action sin ambigüedad: cada problema tiene un camino |
| Stripe Radar | Fintech | Clear Path | Fraud → Decision: de la anomalía a la acción en 1 pantalla |
| Robinhood | Fintech / Inversión | Clear Path | Trade flow guiado: decisión de inversión sin jerga técnica |
| Grafana | Observabilidad | Time Sight | Time series multi-escala: zoom temporal sin cambiar interfaz |
| Apple Health | Salud personal | Time Sight | Tendencias vs. snapshots: frecuencia de actualización visible |
| Notion Timeline | Productividad | Time Sight | Vista de horizonte temporal configurable por granularidad |
| Hospital Handoff / SBAR | Salud clínica | Time Sight | Protocolo de traspaso de turno: contexto completo en minutos |
| Tesla Fleet | Automoción / Flota EV | Time Sight | Time Scrubbing: retroceder en la línea de tiempo para reconstruir qué ocurrió y cuándo |
| Slack | Comunicación empresarial | Omni Sense | Canal agnóstico: mismo mensaje fluye a web, mobile, desktop |
| Twilio | Comunicaciones / SaaS | Omni Sense | Omnichannel API: SMS, voz, WhatsApp, email en una plataforma |
| ServiceNow | ITSM / Operaciones | Omni Sense | Captura de decisiones fuera del sistema: email → ticket automático |
| WhatsApp Business API | Comunicación / Empresas | Omni Sense | Decisiones operativas en canal familiar: bots + agentes humanos |

---

## Los pilares como sistema

Los cuatro pilares no son categorías independientes — forman una **cadena funcional** [IG-16]:

**Quiet UI → Clear Path → Time Sight → Omni Sense**

El sistema **filtra** primero (Quiet UI), luego **guía** la decisión (Clear Path), **contextualiza temporalmente** el dato (Time Sight), y finalmente **distribuye** la información por el canal correcto (Omni Sense).

**Distinción arquitectural** [IG-17]: Quiet UI y Omni Sense son capas de *cómo se presenta* la información (presentación + canal). Clear Path y Time Sight son capas de *qué se presenta* (contenido + temporalidad). Las primeras afectan la interfaz; las segundas afectan la lógica de información.

**Mapeo a dominios operativos** [IG-18]:

| Pilar | Dominio primario | Aplicación |
|---|---|---|
| Quiet UI | A — Respuesta a Crisis | Transversal: la alerta silenciosa aplica en todos los dominios |
| Clear Path | Transversal | A, B, C, D — la guía de decisión aplica a todos |
| Time Sight | B — Anticipación Operativa | B + D (planificación y reportería ejecutiva para el CFO) |
| Omni Sense | C — Asistencia Inteligente | C + A (asistencia en terreno + alertas de crisis) |

---

## Pilar 1: Quiet UI

> El sistema vigila silenciosamente. Solo lo anómalo interrumpe. Alertas legibles en menos de 5 segundos. El silencio es una señal de que todo está bien.

**Fundamento en CORE:** [IG-SYNTH-07] — "Si hay 50 camiones bien, no mostrarlos; mostrar los 5 que generan problema." El workshop retro fue explícito: STOP "demasiada información que no utilizan", STOP "más pantallas". El Design Brief define "Glanceable Intelligence" como criterio duro: alertas críticas legibles en menos de 5 segundos.

> **Dominio primario:** A — Respuesta a Crisis. Aunque Quiet UI es el fundamento transversal de todos los pilares, se activa con mayor urgencia en situaciones de crisis operacional donde el tiempo de percepción es crítico. [IG-18]

---

### NATS (National Air Traffic Services) — Control aéreo

**Qué resuelve en su industria:** Permite a controladores aéreos gestionar cientos de aeronaves simultáneas sin colapso cognitivo — solo los conflictos de trayectoria activan alertas.

**Patrón de diseño relevante:** Vigilancia silenciosa por excepción. La pantalla de radar es silenciosa por defecto: los tracks se mueven sin interrupción. Solo una condición de conflicto (dos aeronaves en ruta de colisión) genera una alerta visual y sonora diferenciada. El controlador no monitorea 400 aviones; monitorea las excepciones.

**Cómo aplica a CORE:** La operación minera tiene la misma estructura: decenas de camiones en operación normal, y solo 5 que generan problema. CORE puede adoptar el principio de radar silencioso: el mapa 3D muestra el estado sin interrumpir, y solo los desvíos geométricos críticos activan la atención del Despachador. La alerta debe tener el mismo carácter diferencial — forma, color, sonido — que en el ATC.

> **[GAP]** — No hay evidencia primaria de cómo NATS implementa los umbrales de alerta. El patrón es verificable a nivel público; los parámetros específicos requieren fuente técnica o consulta con experto ATC.

---

### PagerDuty — Operaciones IT / SRE

**Qué resuelve en su industria:** Gestiona incidentes críticos de infraestructura tecnológica sin quemar al equipo con falsas alarmas — las operaciones reciben solo las alertas que requieren acción humana.

**Patrón de diseño relevante:** Alert deduplication + escalation. PagerDuty agrupa alertas del mismo origen (si un servidor falla, no envía 200 notificaciones de cada servicio dependiente — envía 1), define políticas de escalada (si nadie responde en N minutos, sube al siguiente nivel), y mide explícitamente el "noise ratio" como KPI del sistema.

**Cómo aplica a CORE:** TIMining enfrenta el mismo problema de ruido: múltiples sensores generando alertas redundantes sobre la misma condición (e.g., un equipo detenido genera alertas en GPS, producción, adherencia y despacho). CORE puede adoptar deduplicación de origen y el concepto de "acknowledged" — el operador confirma recepción, el sistema deja de interrumpir. La métrica de noise ratio es directamente aplicable para calibrar el sistema de alertas.

---

### Datadog — Monitoring / DevOps

**Qué resuelve en su industria:** Permite a equipos técnicos monitorear miles de métricas de infraestructura sin alertas constantes — la detección de anomalías reduce el volumen de incidentes accionables.

**Patrón de diseño relevante:** Anomaly detection con baseline dinámico. Datadog no alerta cuando una métrica cruza un umbral fijo; alerta cuando una métrica se desvía de su comportamiento histórico esperado (e.g., "el CPU normalmente está al 30% a esta hora — hoy está al 80%"). El contexto temporal hace la diferencia entre un falso positivo y una alerta real.

**Cómo aplica a CORE:** La adherencia al plan minero tiene el mismo carácter contextual. Una excavadora al 60% de su ritmo no es un problema a las 6am (inicio de turno) pero sí lo es a las 2pm. CORE puede adoptar alertas con baseline por turno: no alertar contra absolutos, sino contra el patrón esperado de ese equipo en ese momento del turno. Esto reduce falsas alarmas y aumenta la confianza del operador en el sistema.

---

### Tesla Autopilot HUD — Automoción

**Qué resuelve en su industria:** Permite al conductor supervisar un sistema autónomo complejo con una sola mirada — el estado del sistema es legible en movimiento, sin quitar atención de la carretera.

**Patrón de diseño relevante:** Glanceable status design. El HUD de Autopilot usa tres estados visuales máximos (activo/alerta/error), siluetas abstractas para representar entidades detectadas, y posicionamiento estable en el campo visual. No hay texto en tiempo real — solo formas y colores. El principio: si requiere leer, está mal diseñado.

**Cómo aplica a CORE:** El Jefe de Turno está en terreno, no frente a un monitor. Cuando consulta el estado de la operación desde su celular o tablet, tiene segundos de atención. CORE puede adoptar el principio de Glanceable Status para la vista Briefing (feed mobile-first): semáforo global de la operación, número de excepciones activas, y estado del plan — todo legible en 1 vistazo. Sin tablas, sin dashboards con 12 gráficos.

---

## Pilar 2: Clear Path

> Del problema a la solución en minutos, no horas. Cada funcionalidad sigue el patrón D→A→R: el usuario nunca se pregunta "¿y ahora qué hago?". [IG-SYNTH-06]

**Fundamento en CORE:** [IG-SYNTH-06] — Las 20 láminas del Workshop 01 siguen el patrón Detección→Análisis→Recomendación sin excepción. El Design Brief dice explícitamente: "From problem to solution in minutes, not hours." Este patrón no es una aspiración — es el modelo operativo validado por los propios usuarios.

> **Dominio primario:** Transversal — Clear Path guía la decisión en todos los dominios operativos. Su expresión más crítica está en el Dominio A (respuesta a crisis) donde la decisión debe tomarse en segundos; su expresión más estratégica en el Dominio D (Gerente de Mina, CFO). [IG-18]

---

### Waze — Navegación / Movilidad

**Qué resuelve en su industria:** Guía a conductores por rutas óptimas en tiempo real, explicando cada decisión de ruta en el momento en que importa — no antes, no después.

**Patrón de diseño relevante:** Contextualized routing explanation. Waze no dice "gira a la derecha en 500m" — dice "gira a la derecha en 500m para evitar 12 minutos de tráfico". La razón detrás de la instrucción está siempre visible. Además, cuando hay una alternativa de ruta, la presenta con el costo de tiempo comparativo — el conductor toma la decisión con información, no con fe ciega.

**Cómo aplica a CORE:** El patrón D→A→R de TIMining tiene la misma estructura. Cuando CORE recomienda "reasignar la pala P3 al frente Norte", el Despachador necesita ver el razonamiento: "porque el frente Sur tiene adherencia al 45% y reasignar recupera 8% en 2 horas". La recomendación sin contexto genera resistencia; la recomendación con costo/beneficio visible genera adopción. CORE puede adoptar el "¿por qué?" como parte inseparable de cada acción sugerida.

---

### Linear — Productividad / Dev Tools

**Qué resuelve en su industria:** Permite a equipos de desarrollo rastrear problemas y llevarlos a resolución sin fricción — del reporte al cierre, cada estado tiene un responsable y un próximo paso claro.

**Patrón de diseño relevante:** Issue → Status → Action sin ambigüedad. En Linear, cada issue tiene exactamente un estado, un responsable y un próximo paso. No hay "en revisión" sin fecha límite. No hay "bloqueado" sin causa documentada. El sistema no permite estados ambiguos.

**Cómo aplica a CORE:** Las alertas operacionales de TIMining pueden caer en el mismo problema de ambigüedad: "alerta activa" ¿significa que alguien está trabajando en ello? ¿Fue reconocida? ¿Cuánto tiempo lleva activa? CORE puede adoptar el modelo de estados explícitos de Linear para la gestión de excepciones: Detectado → Asignado → En resolución → Cerrado. Cada transición tiene responsable y timestamp. Esto también resuelve el problema del cambio de turno (Efecto Gaviota): el turno entrante ve exactamente en qué estado quedó cada excepción. [IG-SYNTH-15]

---

### Stripe Radar — Fintech

**Qué resuelve en su industria:** Permite a analistas de fraude revisar transacciones sospechosas y tomar decisiones de bloqueo o aprobación en segundos — sin salir de una sola pantalla.

**Patrón de diseño relevante:** Decision in context. Stripe Radar presenta en una sola pantalla: la transacción, el score de riesgo, las razones que generaron el score (señales), el historial del usuario, y las acciones posibles (aprobar / bloquear / revisar manualmente). La decisión no requiere abrir otra herramienta, consultar otra pantalla ni llamar a alguien. Todo el contexto necesario está co-localizado con la acción.

**Cómo aplica a CORE:** El Despachador de TIMining enfrenta la misma situación: recibe una alerta de desvío, necesita entender la causa, evaluar el impacto en el plan y decidir una acción — todo en tiempo real. CORE puede adoptar el principio de co-localización de contexto y acción: cuando aparece la alerta, la misma pantalla muestra causa raíz, impacto cuantificado, opciones rankeadas y la acción de ejecución. No hay navegación entre pantallas para tomar una decisión operacional crítica.

---

### Robinhood — Fintech / Inversión

**Qué resuelve en su industria:** Democratiza el acceso a la inversión eliminando la jerga financiera — cualquier persona puede entender qué está comprando y por qué.

**Patrón de diseño relevante:** Guided decision flow para usuarios no expertos. Robinhood diseñó el flujo de compra de acciones como una secuencia lineal sin opciones paralelas: selecciona instrumento → define cantidad → revisa impacto → confirma. Cada pantalla tiene una sola decisión. Los términos técnicos están siempre acompañados de una explicación inline.

**Cómo aplica a CORE:** [IG-SYNTH-08] — la visión de "Inteligencia Democrática" de TIMining apunta a que cualquier supervisor pueda acceder a insights sin expertise técnico. El módulo TIM Agent (lenguaje natural) es la respuesta, pero el flujo de toma de decisión también debe ser lineal para el perfil menos técnico (Gerente de Mina, operadores de campo). CORE puede adoptar el guided flow para las acciones de mayor impacto: definir la reasignación de equipos como una secuencia de 3 pasos con confirmación, no como un formulario de 12 campos.

---

## Pilar 3: Time Sight

> Conciencia temporal multiescala. El usuario sabe en qué momento está el dato, qué pasó antes, y qué pasará después. El cambio de turno no borra el contexto. [IG-SYNTH-03, IG-SYNTH-15]

**Fundamento en CORE:** [IG-SYNTH-03] — Aware tiene múltiples frecuencias de actualización (GPS casi real-time, mapas de calor cada 3h, topografía cada 15min, indicadores cada 30min) que los usuarios no comprenden, generando abandono. [IG-SYNTH-15] — El "Efecto Gaviota" destruye productividad en cada cambio de turno: el turno entrante no sabe qué pasó, qué quedó pendiente ni dónde están los problemas.

> **Dominio primario:** B — Anticipación Operativa. Time Sight convierte datos históricos y en tiempo real en foresight operacional — la capacidad de anticipar. También es central al Dominio D (reportería ejecutiva): el CFO necesita entender tendencias, no snapshots. [IG-18]

---

### Grafana — Observabilidad

**Qué resuelve en su industria:** Permite a equipos de ingeniería explorar métricas históricas y en tiempo real en la misma interfaz, con zoom temporal sin cambiar de herramienta.

**Patrón de diseño relevante:** Time range selector universal + frecuencia de actualización visible. En Grafana, todo gráfico tiene el time range visible y editable en la parte superior: "últimas 6h", "últimas 24h", "semana pasada". El cambio de granularidad es global — afecta todos los paneles simultáneamente. Además, cada panel muestra su "last updated" timestamp. El usuario siempre sabe qué antigüedad tiene el dato que está viendo.

**Cómo aplica a CORE:** CORE tiene el mismo problema de heterogeneidad temporal que Grafana resuelve. Un panel con GPS real-time y otro con mapa de calor de 3h en la misma pantalla, sin indicar la diferencia, genera confusión y pérdida de confianza. CORE puede adoptar tres principios de Grafana: (1) badge de frescura en cada capa de dato, (2) selector de horizonte temporal global para el Planificador, (3) diferenciación visual clara entre datos en tiempo real y datos históricos.

---

### Apple Health — Salud personal

**Qué resuelve en su industria:** Permite al usuario entender tendencias de salud a lo largo de semanas y meses, no solo snapshots del día — el contexto temporal convierte un dato aislado en información útil.

**Patrón de diseño relevante:** Trend visualization vs. point-in-time. Apple Health no muestra solo "pasos hoy: 8.234". Muestra "8.234 pasos — ▲ 12% vs. promedio de los últimos 7 días". La métrica siempre tiene contexto relativo: tendencia, comparación con período anterior, y señal visual de dirección. El usuario entiende si el número es bueno o malo sin expertise médico.

**Cómo aplica a CORE:** [IG-SYNTH-12] — TIMining mide adherencia espacial. Pero "adherencia 72%" no dice nada si el Jefe de Turno no sabe si eso es mejor o peor que ayer, que la semana pasada, o que el mismo turno del mes anterior. CORE puede adoptar trend + comparación como contexto obligatorio para cada KPI: "Adherencia 72% — ▼ 4 puntos vs. turno anterior — 3er turno más bajo del mes". Convierte un número en una historia.

---

### Notion Timeline — Productividad

**Qué resuelve en su industria:** Permite a equipos visualizar trabajo en múltiples granularidades temporales (días, semanas, meses) desde la misma base de datos, sin duplicar información.

**Patrón de diseño relevante:** Multi-granularity temporal view sobre el mismo dataset. En Notion, la misma tabla de proyectos puede verse como timeline diaria, semanal o mensual con un clic — la granularidad cambia, los datos no. Esto permite al usuario elegir el nivel de detalle que necesita en ese momento sin abrir una herramienta diferente.

**Cómo aplica a CORE:** Los perfiles de TIMining operan en granularidades temporales distintas: el Despachador mira por minuto, el Jefe de Turno por hora, el Gerente de Mina por turno, el Planificador por semana. Hoy, Aware no diferencia estas escalas — muestra la misma vista para todos. CORE puede adoptar el modelo de Notion Timeline: una sola fuente de datos (el estado del plan) visualizable en 4 granularidades, con el perfil de usuario como selector por defecto. [IG-SYNTH-09]

---

### Hospital Handoff / Protocolo SBAR — Salud clínica

**Qué resuelve en su industria:** Asegura que el médico o enfermero entrante tenga el contexto completo del paciente en el menor tiempo posible, reduciendo errores por información perdida durante el cambio de turno.

**Patrón de diseño relevante:** SBAR — Situation, Background, Assessment, Recommendation. Este protocolo estandarizado de traspaso de turno ordena la información en 4 capas: qué está pasando ahora (Situation), qué pasó antes (Background), qué significa (Assessment), qué hacer (Recommendation). El turno saliente no "cuenta lo que recuerda" — sigue una estructura que garantiza que el entrante recibe todo lo que necesita.

**Cómo aplica a CORE:** [IG-SYNTH-15] — El briefing automático de TIMining resuelve exactamente el mismo problema que SBAR. CORE puede adoptar la estructura SBAR como esqueleto del briefing de turno: estado actual de adherencia (S), qué ocurrió en las últimas 12h y por qué (B), evaluación del impacto en el plan del turno (A), las 3 acciones prioritarias para el turno entrante (R). Este formato es ejecutable en 10 minutos, verificable, y elimina el Efecto Gaviota con una estructura probada.

---

### Tesla Fleet — Automoción / Flota EV

**Qué resuelve en su industria:** Permite a gestores de flotas de vehículos eléctricos revisar el estado histórico de cada vehículo con precisión temporal — qué ocurrió, cuándo exactamente, y en qué secuencia — sin necesidad de informes separados.

**Patrón de diseño relevante:** Time Scrubbing — navegación temporal continua. La interfaz de Tesla Fleet permite "scrubbing" temporal similar al de un reproductor de video: el usuario arrastra un slider para moverse hacia atrás en el tiempo y ver el estado exacto de la flota en cualquier momento pasado. La granularidad es ajustable (últimos minutos, últimas horas). El dato histórico no es un "reporte" separado — es el mismo mapa operacional visto en un punto diferente del tiempo.

**Cómo aplica a CORE:** [IG-19] — El Time Scrubbing es el patrón ideal para la reconstrucción post-turno en TIMining. Cuando un Jefe de Turno quiere entender por qué la adherencia cayó al 62% a las 14h, no necesita un informe — necesita "rebobinar" el mapa operacional hasta las 13h y avanzar minuto a minuto para ver qué ocurrió. CORE puede adoptar este patrón en el módulo Copiloto: la misma visualización operacional con un control deslizante temporal que permite navegar el turno completo como si fuera un video.

> **[GAP]** — La granularidad óptima del Time Scrubbing en contexto minero (¿por minutos? ¿intervalos de 5 min?) requiere validación con Jefes de Turno en Etapa 2 de entrevistas.

---

## Pilar 4: Omni Sense

> Agnóstico al canal. Si la mina usa WhatsApp, el sistema está en WhatsApp. Si usa Radio IP, también. Las decisiones que ocurren fuera del software no se pierden. [IG-03, IG-SYNTH-19]

**Fundamento en CORE:** [IG-03] — "Impresionante la cantidad de toma de decisiones que ocurren día a día en la operación, vía WhatsApp — TIMining pierde el 90% de la información si no integra ese canal." [IG-SYNTH-19] — La arquitectura de CORE incluye 4 lentes (Reality, Tactical, Agent, Briefing) y la multimodalidad se extiende a Voz (Radio IP), Chat, Visual 3D y alertas push.

> **Dominio primario:** C — Asistencia Inteligente. Omni Sense es el pilar que hace posible el Dominio C: el sistema llega al operador en su contexto, no al revés. También crítico en el Dominio A (alertas de crisis que deben alcanzar al JdT en terreno, sin importar el canal). [IG-18]

**Extensión manos libres** [IG-21]: En terreno, el Jefe de Turno no puede usar las manos. Omni Sense no solo distribuye por canal — también adapta la **modalidad de interacción**: Push-to-Talk para comandos de voz, alertas auditivas para condiciones de visibilidad reducida (polvo, baja luz). La interfaz primaria en campo es la voz, no la pantalla. Esta extensión anticipa escenarios de Edge AI donde el procesamiento ocurre en el dispositivo, sin latencia de red.

---

### Slack — Comunicación empresarial

**Qué resuelve en su industria:** Centraliza la comunicación de equipos distribuidos en canales estructurados, accesibles desde cualquier dispositivo, con búsqueda histórica y registro permanente de decisiones.

**Patrón de diseño relevante:** Canal como contexto operacional + registro automático. En Slack, la conversación y la decisión ocurren en el mismo lugar que el contexto: el canal #ops-turno-norte tiene el historial de todo lo que pasó en ese frente. No hay información en emails privados que el equipo no pueda rastrear. El canal es la memoria operacional del equipo.

**Cómo aplica a CORE:** El problema que describe [IG-03] es exactamente el que Slack resuelve en otros contextos: decisiones que ocurren fuera del sistema (WhatsApp, radio) y no quedan registradas. CORE puede adoptar el modelo de canal como contexto: cada frente operacional tiene un canal en el sistema donde se registran automáticamente las decisiones tomadas (incluyendo las que llegaron por WhatsApp). La captura no requiere que el operador "entre al sistema" — el sistema está donde el operador ya está.

---

### Twilio — Comunicaciones / SaaS

**Qué resuelve en su industria:** Permite a empresas enviar y recibir mensajes por cualquier canal (SMS, voz, WhatsApp, email) desde una sola API, sin construir integraciones separadas para cada canal.

**Patrón de diseño relevante:** Abstraction layer sobre canales heterogéneos. Twilio separa el "qué enviar" del "por qué canal enviarlo": la lógica de negocio define el mensaje; la API decide el canal óptimo según disponibilidad del receptor. Un operador sin señal recibe el mismo mensaje por SMS que el colega con WiFi recibe por push notification.

**Cómo aplica a CORE:** [IG-SYNTH-19] — La visión de CORE incluye agnósticismo al canal: "si una mina usa full WhatsApp, se mete ahí; si usa Discord, también." El patrón de Twilio es la implementación técnica de esa visión: una capa de abstracción de canales que desacopla la lógica de alertas del canal de entrega. CORE no necesita saber si el Jefe de Turno está en el sistema, en WhatsApp o escuchando la radio — el mensaje llega donde está la persona.

---

### ServiceNow — ITSM / Operaciones empresariales

**Qué resuelve en su industria:** Gestiona operaciones de IT y servicios empresariales capturando solicitudes desde cualquier canal (email, teléfono, chat, portal web) y convirtiéndolas en tickets estructurados con responsable y seguimiento.

**Patrón de diseño relevante:** Email-to-ticket / channel-to-record conversion. ServiceNow tiene conectores que convierten automáticamente un email de incidente en un ticket estructurado, sin que el usuario deba "entrar al sistema". La información que ya existe en el canal informal (email, llamada) se convierte en registro formal sin fricción.

**Cómo aplica a CORE:** La decisión tomada por radio o WhatsApp no tiene que perderse — puede convertirse en registro operacional automáticamente. CORE puede adoptar el patrón de ServiceNow: un conector de WhatsApp que reconoce mensajes con estructura operacional (asignación de equipo, apertura de frente, cierre de alerta) y los registra en el sistema sin que el operador cambie de canal. Esto resuelve el problema de [IG-03] sin pedir a los operadores que cambien su comportamiento.

---

### WhatsApp Business API — Comunicación / Empresas

**Qué resuelve en su industria:** Permite a empresas enviar notificaciones transaccionales, atender clientes y ejecutar flujos de servicio directamente en WhatsApp, el canal donde los clientes ya están.

**Patrón de diseño relevante:** Decision flow en canal familiar. WhatsApp Business API permite diseñar flujos con botones de respuesta rápida (e.g., "¿Confirmas la reasignación? [Sí] [No] [Ver detalle]") que ejecutan acciones en sistemas backend sin que el operador abra ninguna otra herramienta. La interfaz es la app que ya usa a diario.

**Cómo aplica a CORE:** [IG-SYNTH-18] — TIMining ya usa WhatsApp para alertas de seguridad geotécnica ("camión operando en zona de inestabilidad"). CORE puede extender este canal con el patrón de WhatsApp Business API: la alerta llega por WhatsApp con botones de acción directa (Reconocer / Asignar / Escalar). El operador no necesita abrir CORE para responder a la excepción — la respuesta queda registrada en el sistema automáticamente. Esto maximiza la adopción al reducir la fricción de cambio de contexto. [IG-SYNTH-07]

---

## Insights Summary

| ID | Concepto | Status | Relevancia en este benchmark |
|---|---|---|---|
| [IG-SYNTH-07] | Gestión por excepción — Glanceable Intelligence | VERIFIED | Fundamento del Pilar 1 (Quiet UI) — 4 referentes |
| [IG-SYNTH-06] | Patrón D→A→R | VERIFIED | Fundamento del Pilar 2 (Clear Path) — 4 referentes |
| [IG-SYNTH-03] | Confusión temporal — abandono por tiempos de dato | VERIFIED | Fundamento del Pilar 3 (Time Sight) — 4 referentes |
| [IG-SYNTH-15] | Efecto Gaviota — cambio de turno | VERIFIED | Time Sight: protocolo SBAR + Linear issue states |
| [IG-03] | WhatsApp como canal principal de decisiones | VERIFIED | Fundamento del Pilar 4 (Omni Sense) — 4 referentes |
| [IG-SYNTH-19] | Interfaz multimodal — 4 lentes | VERIFIED | Omni Sense: arquitectura de canales |
| [IG-SYNTH-09] | Perfiles diferenciados — necesidades distintas | VERIFIED | Clear Path: guided flow + Time Sight: granularidades |
| [IG-SYNTH-08] | Democratización del dato | VERIFIED | Clear Path: Robinhood guided flow |
| [IG-SYNTH-12] | Adherencia espacial como métrica central | VERIFIED | Time Sight: Apple Health trend visualization |
| [IG-SYNTH-18] | Seguridad geotécnica | VERIFIED | Omni Sense: WhatsApp Business API |
| [IG-SYNTH-16] | Paz mental como propuesta de valor | VERIFIED | Transversal — todos los pilares |
| [IG-02] | Etapa 2 incompleta — perspectivas indirectas | VERIFIED | ⚠️ Riesgo de validación aplicable a adopción de patrones |
| [IG-16] | Pilares encadenados (QUI→CP→TS→OS) | VERIFIED | Fundamento de "Los pilares como sistema" — el benchmark los usa como estructura principal |
| [IG-17] | Distinción cómo vs. qué (presentación/canal vs. contenido/temporalidad) | VERIFIED | Distinción arquitectural que explica la relación entre los 4 pilares |
| [IG-18] | 4 dominios operativos formales (A-B-C-D) | VERIFIED | Mapeo de pilares a dominios — contextualiza cada pilar en sus casos de uso |
| [IG-19] | Time Scrubbing UX pattern | VERIFIED | Fundamento del referente Tesla Fleet en Time Sight |
| [IG-21] | Manos libres como interfaz primaria para JdT en terreno | VERIFIED | Omni Sense: extensión manos libres / Push-to-Talk / Edge AI |

---

## Notas de aplicación

**Prioridad de adopción sugerida** (basada en convergencia de evidencia):

1. **Protocolo SBAR para briefing de turno** — impacto inmediato sobre [IG-SYNTH-15], implementable sin cambios técnicos mayores.
2. **Badge de frescura en capas de dato** — resuelve [IG-SYNTH-03] con un cambio de UI localizado.
3. **Co-localización contexto + acción (patrón Stripe Radar)** — aplicar en todas las alertas del módulo Copiloto.
4. **WhatsApp Business API con botones de acción** — extiende [IG-03] con implementación verificable.

**Advertencia:** Este benchmark identifica patrones de diseño, no soluciones plug-and-play. Cada adopción debe validarse contra los perfiles de usuario reales de TIMining [IG-SYNTH-09] antes de implementar. La brecha de validación primaria ([IG-02]) aplica también aquí.
