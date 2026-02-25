# User Stories — TIMining

> v1.1 | 2026-02-25 | 18 historias · 6 módulos · 5 personas · 22 refs de insights

---

## Tabla resumen

| ID | Módulo | Título | Persona | Pilar | Prioridad |
|---|---|---|---|---|---|
| US-01 | Geometry Engine | Ver adherencia al plan en tiempo real | P-01 Despachador | Clear Path | High |
| US-02 | Geometry Engine | Conciliar plan vs. realidad topográfica | P-04 Planificador | Time Sight | High |
| US-03 | Geometry Engine | Medir impacto financiero del desvío geométrico | P-05 CFO | Clear Path | Medium |
| US-04 | Copiloto Inteligente (TIM Agent) | Consultar el estado operacional en lenguaje natural | P-04 Planificador | Omni Sense | High |
| US-05 | Copiloto Inteligente (TIM Agent) | Recibir recomendaciones D→A→R rankeadas ante una crisis | P-01 Despachador | Clear Path | High |
| US-06 | Copiloto Inteligente (TIM Agent) | Validar recomendaciones contra reglas operacionales propietarias | P-04 Planificador | Quiet UI | High |
| US-07 | Copiloto Inteligente (TIM Agent) | Enseñar al sistema con decisiones expertas | P-04 Planificador | Time Sight | Medium |
| US-08 | Experiencia Multimodal (4 Lentes) | Recibir alertas críticas por WhatsApp | P-02 Jefe de Turno | Omni Sense | High |
| US-09 | Experiencia Multimodal (4 Lentes) | Cambiar de lente según mi contexto de trabajo | P-01 Despachador | Quiet UI | Medium |
| US-10 | Experiencia Multimodal (4 Lentes) | Ver solo las anomalías que requieren acción | P-03 Gerente de Mina | Quiet UI | High |
| US-11 | Briefing de Turno | Recibir un briefing automático antes de iniciar el turno | P-02 Jefe de Turno | Omni Sense | High |
| US-12 | Briefing de Turno | Consultar el historial del turno anterior sin preguntar | P-01 Despachador | Time Sight | High |
| US-13 | Briefing de Turno | Entregar un traspaso estructurado al turno siguiente | P-02 Jefe de Turno | Time Sight | Medium |
| US-14 | Plataforma de Integración | Conectar datos operacionales con herramientas familiares (Excel) | P-05 CFO | Omni Sense | High |
| US-15 | Plataforma de Integración | Ver el reporte mina-planta en lenguaje financiero | P-05 CFO | Clear Path | High |
| US-16 | Plataforma de Integración | Integrar decisiones tomadas por radio y WhatsApp en la plataforma | P-01 Despachador | Omni Sense | Medium |
| US-17 | Onboarding Progresivo | Aprender a usar el módulo de mi perfil sin capacitación larga | P-02 Jefe de Turno | Quiet UI | High |
| US-18 | Onboarding Progresivo | Ver mi propio desempeño antes de que lo vea mi jefatura | P-02 Jefe de Turno | Clear Path | High |

---

## Módulo: Geometry Engine

### US-01 — Ver adherencia al plan en tiempo real

**Persona:** P-01 Despachador

**JTBD:**
- **When** estoy en sala de control monitoreando el turno activo y necesito saber si la operación está cumpliendo el plan minero [IG-SYNTH-01]
- **I want to** ver la adherencia espacial del turno actual en un indicador visual claro, diferenciando zonas en cumplimiento de zonas con desvío
- **So I can** detectar qué equipos o sectores se alejan del plan geométrico antes de que el desvío afecte la producción acumulada del turno [IG-SYNTH-12]

**Acceptance Criteria:**
- [ ] La topografía se actualiza cada 15 minutos como máximo, con indicador de tiempo desde la última actualización siempre visible [IG-SYNTH-01]
- [ ] El porcentaje de adherencia espacial del turno activo es visible en la pantalla principal sin requerir navegación adicional [IG-SYNTH-12]
- [ ] Las zonas con desvío mayor al umbral configurado aparecen resaltadas automáticamente — el estado normal no genera ruido visual [IG-SYNTH-07]

**Priority:** High
**Pilar:** **Clear Path** — la adherencia al plan es el "qué hay que resolver": muestra el desvío específico y guía al despachador directamente a la zona problemática, sin que tenga que buscarlo.
**Refs:** [IG-SYNTH-01], [IG-SYNTH-12], [IG-SYNTH-07]

---

### US-02 — Conciliar plan vs. realidad topográfica

**Persona:** P-04 Planificador

**JTBD:**
- **When** cierro el turno o inicio la planificación del siguiente y necesito entender por qué el turno real se desvió del plan geométrico [IG-SYNTH-01]
- **I want to** acceder a la conciliación automática entre el plan minero y la topografía inferida en tiempo real, con historial de desvíos por sector
- **So I can** identificar las causas raíz de los desvíos geométricos y ajustar el plan siguiente con evidencia, sin cruzar bases de datos manualmente [IG-SYNTH-12], [IG-SYNTH-13]

**Acceptance Criteria:**
- [ ] La conciliación plan-realidad es calculada y visible en menos de 2 minutos después de cerrar el período evaluado [IG-SYNTH-01]
- [ ] El reporte muestra la diferencia entre volumen planificado y volumen real por sector, expresada en métricas de adherencia espacial [IG-SYNTH-12]
- [ ] El planificador puede exportar la conciliación a formato compatible con Excel sin pasos manuales de cruce de datos [IG-SYNTH-13], [IG-05]

**Priority:** High
**Pilar:** **Time Sight** — la conciliación es forensics: rebobinar qué pasó geométricamente en el turno para entender el porqué y anticipar el siguiente plan.
**Refs:** [IG-SYNTH-01], [IG-SYNTH-12], [IG-SYNTH-13], [IG-05]

---

### US-03 — Medir impacto financiero del desvío geométrico

**Persona:** P-05 CFO / Gerente de Finanzas

**JTBD:**
- **When** preparo el reporte mensual de desempeño para el directorio y necesito traducir los resultados operacionales a métricas financieras [IG-06]
- **I want to** ver el valor económico capturado o perdido por variaciones en la adherencia espacial del plan, expresado en USD
- **So I can** justificar el ROI de TIMining con cifras concretas y presentar el impacto financiero de las operaciones mineras sin depender de que operaciones me prepare los datos [IG-SYNTH-12], [IG-SYNTH-14]

**Acceptance Criteria:**
- [ ] La plataforma calcula automáticamente el valor económico estimado de cada punto porcentual de adherencia espacial, basado en parámetros configurables por faena [IG-SYNTH-12]
- [ ] El reporte financiero-operacional se genera sin intervención manual del equipo de operaciones [IG-SYNTH-14]
- [ ] Los datos son exportables a Excel o integrable con sistemas ERP, sin requerir expertise técnico para la extracción [IG-05], [IG-06]

> **[GAP]** — No está definido el modelo de datos que une operaciones con finanzas ni las métricas financieras accionables desde la plataforma para el CFO. Resolver con entrevistas Etapa 2 y CF-08 (unit economics). [CF-08], [CF-07]

**Priority:** Medium
**Pilar:** **Clear Path** — el CFO no necesita entender operaciones; necesita saber qué decisión financiera tomar. El reporte traduce desvíos geométricos a USD sin que tenga que interpretar.
**Refs:** [IG-06], [IG-SYNTH-12], [IG-SYNTH-14], [IG-05]

---

## Módulo: Copiloto Inteligente (TIM Agent)

### US-04 — Consultar el estado operacional en lenguaje natural

**Persona:** P-04 Planificador

**JTBD:**
- **When** necesito entender la situación actual de la faena o investigar la causa raíz de un desvío del plan y no tengo tiempo de navegar múltiples pantallas [IG-SYNTH-08]
- **I want to** escribir una pregunta en lenguaje natural (por ejemplo: "¿cuál sector tuvo más desvío esta semana y por qué?") y recibir una respuesta anclada en datos reales de la mina
- **So I can** obtener insights operacionales sin depender de expertos en SQL ni de reportes preparados manualmente [IG-SYNTH-08], [IG-SYNTH-13]

**Acceptance Criteria:**
- [ ] El sistema responde en menos de 30 segundos con datos reales de la faena, sin alucinaciones ni cifras no respaldadas [IG-SYNTH-08], [IG-08]
- [ ] Cada respuesta incluye la fuente del dato (sensor, timestamp, cálculo) para que el planificador pueda verificarla si es necesario [IG-SYNTH-01]
- [ ] Cualquier usuario con acceso a la plataforma puede hacer consultas sin expertise en SQL ni entrenamiento previo en el sistema [IG-SYNTH-08], [IG-SYNTH-11]

**Priority:** High
**Pilar:** **Omni Sense** — el lenguaje natural es el canal que democratiza el acceso al dato; cualquier perfil consulta sin saber SQL ni navegar pantallas.
**Refs:** [IG-SYNTH-08], [IG-08], [IG-SYNTH-13], [IG-SYNTH-11]

---

### US-05 — Recibir recomendaciones D→A→R rankeadas ante una crisis

**Persona:** P-01 Despachador

**JTBD:**
- **When** el sistema detecta una anomalía operacional (equipo fuera de zona, desvío de plan que supera umbral, alerta geotécnica) durante mi turno [IG-SYNTH-06]
- **I want to** recibir automáticamente un análisis del impacto del problema y tres opciones de acción rankeadas por su efecto en la adherencia al plan
- **So I can** tomar la decisión correcta en minutos sin necesidad de interpretar dashboards ni consultar a otros [IG-SYNTH-04], [IG-SYNTH-06]

**Acceptance Criteria:**
- [ ] Ante cualquier desviación que supere el umbral configurado, el sistema genera automáticamente el análisis D→A→R en menos de 5 minutos [IG-SYNTH-06]
- [ ] Las recomendaciones están rankeadas por impacto estimado en la adherencia espacial del turno, con métricas de resultado esperado visibles [IG-SYNTH-04]
- [ ] El despachador puede registrar su decisión (aceptar opción A, B, C, o rechazar todas) con un máximo de 2 toques en pantalla [IG-SYNTH-07]

**Priority:** High
**Pilar:** **Clear Path** — de todas las acciones posibles, el D→A→R rankeado guía al despachador a la decisión correcta en segundos, sin que tenga que analizar.
**Refs:** [IG-SYNTH-06], [IG-SYNTH-04], [IG-SYNTH-07]

---

### US-06 — Validar recomendaciones contra reglas operacionales propietarias

**Persona:** P-04 Planificador

**JTBD:**
- **When** TIM Agent genera una recomendación de acción y necesito confiar en que es operacionalmente válida antes de instruir al equipo en terreno [IG-08]
- **I want to** que cada recomendación haya sido validada automáticamente contra las 60 reglas operacionales propietarias de TIMining (dispatching, cambio de turno, secuencias de salida)
- **So I can** dar instrucciones al equipo con certeza de que no contradice ningún procedimiento estándar de la faena, sin tener que verificar manualmente [IG-08], [IG-SYNTH-04]

**Acceptance Criteria:**
- [ ] Cada recomendación generada por TIM Agent incluye un indicador de validación que confirma que pasó el filtro de las 60 reglas operacionales [IG-08]
- [ ] Si una recomendación infringe una regla operacional, el sistema la descarta automáticamente antes de presentarla al usuario — nunca llega una recomendación inválida [IG-08]
- [ ] Las reglas operacionales son configurables por faena (umbrales, secuencias específicas) sin necesidad de escribir código [IG-SYNTH-02]

**Priority:** High
**Pilar:** **Quiet UI** — las 60 reglas operan como el Quiet UI del sistema: filtran el ruido antes de que llegue a la interfaz. Una recomendación inválida que nunca aparece es la forma más limpia de silencio.
**Refs:** [IG-08], [IG-SYNTH-04], [IG-SYNTH-02]

---

### US-07 — Enseñar al sistema con decisiones expertas

**Persona:** P-04 Planificador

**JTBD:**
- **When** rechazo una recomendación de TIM Agent y elijo una alternativa diferente basada en mi conocimiento experto de la faena [IG-09]
- **I want to** que el sistema registre mi decisión y el contexto operacional en que la tomé, para incorporarla como patrón de aprendizaje
- **So I can** hacer que TIMining mejore sus recomendaciones futuras a partir del conocimiento tácito de los expertos de la faena, democratizando ese conocimiento hacia el resto del equipo [IG-09], [IG-SYNTH-08]

**Acceptance Criteria:**
- [ ] Cuando el usuario rechaza todas las opciones del D→A→R y elige una acción propia, el sistema solicita confirmar la decisión con un campo de contexto opcional [IG-09]
- [ ] El sistema incorpora el patrón de decisión al modelo de recomendaciones para situaciones similares futuras, con un horizonte de aprendizaje visible [IG-09]
- [ ] Los administradores de la faena pueden revisar y aprobar los patrones aprendidos antes de que afecten las recomendaciones generales [IG-SYNTH-02]

> **[GAP]** — La capacidad de aprendizaje del sistema es aspiracional y solo respaldada por fuentes internas de IDEMAX. Requiere validación primaria con el equipo de producto TIMining antes de comprometer como feature de CORE. [CF-07]

**Priority:** Medium
**Pilar:** **Time Sight** — cada decisión experta capturada hoy mejora las recomendaciones del futuro: el sistema aprende del pasado para anticipar mejor.
**Refs:** [IG-09], [IG-SYNTH-08], [IG-SYNTH-02]

---

## Módulo: Experiencia Multimodal (4 Lentes)

### US-08 — Recibir alertas críticas por WhatsApp

**Persona:** P-02 Jefe de Turno

**JTBD:**
- **When** estoy en terreno supervisando equipos y no tengo acceso a una pantalla de control, pero el sistema detecta una anomalía que requiere mi atención [IG-03]
- **I want to** recibir la alerta crítica con contexto suficiente directamente en WhatsApp (o el canal que use mi faena: Discord, Radio IP), con las opciones de acción disponibles
- **So I can** tomar una decisión táctica desde terreno sin necesidad de volver a sala, y que esa decisión quede registrada en la plataforma [IG-03], [IG-SYNTH-09]

**Acceptance Criteria:**
- [ ] Las alertas críticas se envían al canal configurado para la faena (WhatsApp, push notification, Radio IP) en menos de 2 minutos desde la detección [IG-03]
- [ ] El mensaje incluye: descripción del problema, impacto estimado en adherencia al plan, y las 2-3 opciones de acción más relevantes en formato legible desde celular [IG-SYNTH-06]
- [ ] La respuesta del jefe de turno (elegir una opción o rechazar) desde el canal externo queda registrada automáticamente en la plataforma como evento operacional [IG-03]

**Priority:** High
**Pilar:** **Omni Sense** — la alerta llega al canal donde el JdT ya está (WhatsApp, radio), sin forzarlo a abrir la plataforma. El canal se adapta al usuario, no al revés.
**Refs:** [IG-03], [IG-SYNTH-09], [IG-SYNTH-06]

---

### US-09 — Cambiar de lente según mi contexto de trabajo

**Persona:** P-01 Despachador

**JTBD:**
- **When** paso de monitorear equipos en tiempo real (lente Reality 3D) a analizar un escenario alternativo de planificación (lente Tactical 2D) durante el mismo turno [IG-SYNTH-19]
- **I want to** cambiar entre las 4 lentes de navegación (Reality, Tactical, Agent, Briefing) con una sola acción, manteniendo el contexto de lo que estaba revisando
- **So I can** usar la representación más adecuada para cada tarea sin perder mi lugar de trabajo ni navegar un menú complejo [IG-SYNTH-19], [IG-SYNTH-09]

**Acceptance Criteria:**
- [ ] Las 4 lentes están accesibles desde un Command Ribbon permanente en pantalla, visible en cualquier estado de la aplicación [IG-SYNTH-19]
- [ ] Al cambiar de lente, el sistema preserva el sector o equipo que estaba en foco para continuar la revisión en el nuevo contexto [IG-SYNTH-19]
- [ ] Cada perfil de usuario tiene una lente predeterminada configurada: Despachador → Reality, Planificador → Tactical, Gerente → Briefing [IG-SYNTH-09]

**Priority:** Medium
**Pilar:** **Quiet UI** — cambiar de lente es la gestión por excepción aplicada a la presentación misma: usar la representación mínima necesaria para cada tarea, sin cargar la pantalla con todo.
**Refs:** [IG-SYNTH-19], [IG-SYNTH-09]

---

### US-10 — Ver solo las anomalías que requieren acción

**Persona:** P-03 Gerente de Mina

**JTBD:**
- **When** reviso el estado de la faena desde el celular al inicio del día o ante una notificación de alerta [IG-SYNTH-07]
- **I want to** ver únicamente los equipos, sectores o indicadores que están fuera del parámetro esperado — sin el ruido de los 50 camiones que están bien
- **So I can** evaluar el estado crítico de la faena en menos de 30 segundos y decidir si necesito intervenir, sin necesidad de interpretar dashboards complejos [IG-SYNTH-07], [IG-SYNTH-16]

**Acceptance Criteria:**
- [ ] La vista predeterminada para el Gerente de Mina muestra solo elementos con desvío activo; el estado normal es invisible por defecto [IG-SYNTH-07]
- [ ] Cada anomalía visible incluye: descripción del problema, impacto estimado y si ya hay una acción en curso asignada [IG-SYNTH-06]
- [ ] La pantalla completa de estado crítico es legible sin pinch-zoom en celular con pantalla estándar, usando tipografía y contraste adecuados para entornos de luz variable [IG-SYNTH-19]

**Priority:** High
**Pilar:** **Quiet UI** — si hay 50 camiones bien, no aparecen. El semáforo del Gerente es Quiet UI en su expresión más pura: silencio = todo bien, interrupción = hay que actuar.
**Refs:** [IG-SYNTH-07], [IG-SYNTH-16], [IG-SYNTH-06], [IG-SYNTH-19]

---

## Módulo: Briefing de Turno

### US-11 — Recibir un briefing automático antes de iniciar el turno

**Persona:** P-02 Jefe de Turno

**JTBD:**
- **When** faltan 15 minutos para que inicie mi turno y necesito saber qué pasó en el turno anterior y qué problemas quedan pendientes [IG-SYNTH-15]
- **I want to** recibir un briefing multimedia automático (resumen en voz, video resumen, KPIs del turno) directamente en mi celular o canal habitual
- **So I can** llegar al inicio del turno con contexto completo sin depender de que el jefe saliente me explique todo verbalmente, eliminando las caídas de producción del cambio de turno [IG-SYNTH-15], [IG-SYNTH-17]

**Acceptance Criteria:**
- [ ] El briefing se genera automáticamente 15 minutos antes de cada cambio de turno, sin intervención manual del turno saliente [IG-SYNTH-15]
- [ ] El briefing incluye como mínimo: % de adherencia del turno, top 3 problemas activos con estado de resolución, y equipos con alertas pendientes [IG-SYNTH-15]
- [ ] El briefing es accesible desde el canal configurado para el usuario (WhatsApp, push notification, lente Briefing en app) y consumible en menos de 5 minutos [IG-03], [IG-SYNTH-15]

**Priority:** High
**Pilar:** **Omni Sense** — el briefing llega al canal natural del JdT (celular/WhatsApp) 15 minutos antes, sin que tenga que abrir la plataforma ni preguntar a nadie.
**Refs:** [IG-SYNTH-15], [IG-SYNTH-17], [IG-03]

---

### US-12 — Consultar el historial del turno anterior sin preguntar

**Persona:** P-01 Despachador

**JTBD:**
- **When** inicio mi turno y necesito entender el estado en que dejó la operación el turno anterior, sin esperar a que terminen el traspaso verbal [IG-SYNTH-15]
- **I want to** acceder al log estructurado del turno anterior: decisiones tomadas, alertas generadas, problemas resueltos y pendientes, con timeline
- **So I can** comenzar a despachar con contexto completo desde el primer minuto, sin el riesgo de repetir un problema ya gestionado o ignorar uno pendiente [IG-SYNTH-15], [IG-SYNTH-01]

**Acceptance Criteria:**
- [ ] El historial del turno anterior está disponible en la lente Briefing al inicio del turno, organizado por cronología de eventos y por sector afectado [IG-SYNTH-15]
- [ ] Los problemas que quedaron sin resolver en el turno anterior aparecen marcados explícitamente como "pendientes" y son el primer elemento visible [IG-SYNTH-07]
- [ ] El despachador puede filtrar el historial por tipo de evento (alerta, decisión, KPI) sin requerir configuración técnica [IG-SYNTH-19]

**Priority:** High
**Pilar:** **Time Sight** — el historial del turno es forensics: qué pasó, cuándo y por qué, para que el turno entrante pueda anticipar y no repetir.
**Refs:** [IG-SYNTH-15], [IG-SYNTH-01], [IG-SYNTH-07], [IG-SYNTH-19]

---

### US-13 — Entregar un traspaso estructurado al turno siguiente

**Persona:** P-02 Jefe de Turno

**JTBD:**
- **When** se acerca el fin de mi turno y necesito preparar el traspaso de información al turno entrante [IG-SYNTH-15]
- **I want to** generar el log de traspaso con un formulario guiado que capture decisiones clave, alertas activas y contexto operacional en menos de 10 minutos
- **So I can** garantizar que el turno entrante tiene toda la información necesaria sin depender de mi memoria ni de una llamada verbal que no queda registrada [IG-SYNTH-15], [IG-03]

**Acceptance Criteria:**
- [ ] El formulario de traspaso se pre-llena automáticamente con los eventos del turno registrados en la plataforma — el jefe solo agrega contexto adicional [IG-SYNTH-15]
- [ ] El registro de traspaso queda vinculado al briefing automático del turno siguiente y es accesible desde la lente Briefing [IG-SYNTH-15]
- [ ] El proceso de traspaso no requiere más de 3 pasos desde cualquier pantalla de la plataforma [IG-SYNTH-11]

**Priority:** Medium
**Pilar:** **Time Sight** — el traspaso anticipa el estado inicial del turno siguiente: el sistema construye el briefing durante el turno para que el JdT no tenga que redactarlo al final.
**Refs:** [IG-SYNTH-15], [IG-03], [IG-SYNTH-11]

---

## Módulo: Plataforma de Integración

### US-14 — Conectar datos operacionales con herramientas familiares (Excel)

**Persona:** P-05 CFO / Gerente de Finanzas

**JTBD:**
- **When** necesito preparar el análisis de desempeño de la operación y mis procesos actuales están construidos en Excel [IG-05]
- **I want to** exportar los datos operacionales clave de TIMining (adherencia, KPIs por turno, resumen de alertas) en formatos compatibles con Excel o integrarlos directamente con los procesos existentes
- **So I can** adoptar TIMining sin necesidad de cambiar los workflows de reporting que ya existen en mi organización, reduciendo la barrera de adopción [IG-05], [IG-SYNTH-11]

**Acceptance Criteria:**
- [ ] Los datos operacionales principales son exportables a Excel (.xlsx) o CSV con un máximo de 2 clics, sin exportar ni instalar software adicional [IG-05]
- [ ] El exportable incluye columnas con nombres y unidades comprensibles para un perfil financiero (USD, %, fechas), no solo términos técnicos mineros [IG-05], [IG-06]
- [ ] La integración con sistemas ERP o plataformas de BI (PowerBI, Tableau) está disponible vía API documentada y no requiere intervención del equipo de desarrollo TIMining [IG-SYNTH-05]

> **[GAP]** — El workflow específico de Excel que CORE reemplaza en cada perfil no está documentado. Requiere investigación con usuarios reales en Etapa 2. [CF-07]

**Priority:** High
**Pilar:** **Omni Sense** — los datos operacionales llegan al canal y formato que el CFO ya usa (Excel, ERP, BI), sin que tenga que aprender una nueva herramienta.
**Refs:** [IG-05], [IG-SYNTH-11], [IG-SYNTH-05], [IG-06]

---

### US-15 — Ver el reporte mina-planta en lenguaje financiero

**Persona:** P-05 CFO / Gerente de Finanzas

**JTBD:**
- **When** necesito presentar al directorio el desempeño integrado de la operación y la planta, y hoy esos datos viven en sistemas que no se hablan [IG-06]
- **I want to** acceder desde TIMining a un reporte ejecutivo que conecte automáticamente los KPIs operacionales de la mina con los resultados financieros de la planta
- **So I can** eliminar el proceso manual de cruce de datos entre operaciones y finanzas y presentar el impacto real de la operación en el resultado del negocio [IG-06], [IG-SYNTH-12]

**Acceptance Criteria:**
- [ ] El reporte mina-planta consolida automáticamente datos de adherencia espacial, toneladas procesadas y valor económico derivado en una sola vista [IG-06], [IG-SYNTH-12]
- [ ] Las métricas están expresadas en lenguaje financiero (USD, %, variación vs. plan) sin requerir que el CFO interprete terminología técnica minera [IG-06]
- [ ] El reporte es generado sin que el equipo de operaciones deba preparar o enviar datos manualmente [IG-SYNTH-14]

> **[GAP]** — No está definido el modelo de datos que une operaciones con finanzas. Pendiente CF-08 y CF-07. Sin este modelo, el reporte mina-planta no puede implementarse. [CF-08], [CF-07]

**Priority:** High
**Pilar:** **Clear Path** — el reporte mina-planta existe para que el CFO sepa qué decisión financiera tomar, no para que aprenda minería. Traducir adherencia a USD es hacer el camino claro.
**Refs:** [IG-06], [IG-SYNTH-12], [IG-SYNTH-14], [IG-SYNTH-05]

---

### US-16 — Integrar decisiones tomadas por radio y WhatsApp en la plataforma

**Persona:** P-01 Despachador

**JTBD:**
- **When** tomo una decisión operacional importante a través de radio o WhatsApp, fuera de la interfaz de TIMining [IG-03]
- **I want to** que TIMining capture esa decisión (o que yo pueda registrarla rápidamente) para que quede vinculada al contexto operacional del momento
- **So I can** tener un registro completo de todas las decisiones del turno, incluidas las que se tomaron fuera del sistema, y usarlas para el briefing de traspaso y el aprendizaje del copiloto [IG-03], [IG-09]

**Acceptance Criteria:**
- [ ] El sistema puede recibir mensajes de WhatsApp configurados como canal de la faena e interpretarlos como eventos operacionales [IG-03]
- [ ] El despachador puede registrar una decisión externa con un máximo de 3 campos (descripción, sector, decisión tomada) desde cualquier dispositivo [IG-03]
- [ ] Las decisiones registradas externamente aparecen en el historial del turno y en el briefing de traspaso con el mismo nivel de visibilidad que las generadas dentro de la plataforma [IG-SYNTH-15]

**Priority:** Medium
**Pilar:** **Omni Sense** — capturar decisiones del canal externo (WhatsApp, radio) es Omni Sense en acción: el sistema va donde ocurre la decisión, no espera que la decisión llegue al sistema.
**Refs:** [IG-03], [IG-09], [IG-SYNTH-15]

---

## Módulo: Onboarding Progresivo

### US-17 — Aprender a usar el módulo de mi perfil sin capacitación larga

**Persona:** P-02 Jefe de Turno

**JTBD:**
- **When** me incorporo por primera vez a TIMining CORE o cuando se lanza un módulo nuevo que incluye funcionalidades relevantes para mi rol [IG-SYNTH-11]
- **I want to** recibir capacitación contextual in-app, integrada en mi flujo de trabajo habitual, sin asistir a sesiones formales ni leer documentación
- **So I can** adoptar el sistema en el ritmo natural de mi trabajo, sin que la curva de aprendizaje me lleve a abandonar la herramienta como ocurrió con versiones anteriores [IG-SYNTH-11], [IG-SYNTH-17]

**Acceptance Criteria:**
- [ ] La primera vez que el usuario accede a un módulo, aparece un tutorial contextual de máximo 3 pasos, activable y descartable en cualquier momento [IG-SYNTH-11]
- [ ] Cada perfil de usuario (Despachador, Jefe de Turno, Planificador, Gerente, CFO) tiene un onboarding diferenciado que muestra únicamente las funcionalidades relevantes para su rol [IG-SYNTH-09], [IG-SYNTH-11]
- [ ] El usuario puede completar su primera tarea operacional real (revisar el estado del turno, recibir un briefing) en menos de 5 minutos desde el acceso inicial, sin ayuda externa [IG-SYNTH-11]

**Priority:** High
**Pilar:** **Quiet UI** — el onboarding progresivo es Quiet UI aplicado al aprendizaje: mostrar solo lo relevante para este perfil, en este momento, sin abrumar con todo lo que puede hacer el sistema.
**Refs:** [IG-SYNTH-11], [IG-SYNTH-09], [IG-SYNTH-17]

---

### US-18 — Ver mi propio desempeño antes de que lo vea mi jefatura

**Persona:** P-02 Jefe de Turno

**JTBD:**
- **When** trabajo en terreno y sé que la plataforma registra mis decisiones y el desempeño de mi turno, y me preocupa que esa información sea usada para auditarme sin que yo tenga acceso primero [IG-04]
- **I want to** tener acceso a mi propio dashboard de desempeño antes de que sea visible para planificación o gerencia, con tiempo suficiente para contextualizar los datos
- **So I can** sentir que la herramienta trabaja para mí y no contra mí, adoptarla voluntariamente y contribuir a que la información que registra sea más completa y precisa [IG-04], [IG-SYNTH-17]

**Acceptance Criteria:**
- [ ] El jefe de turno ve su resumen de desempeño del turno (adherencia, alertas gestionadas, decisiones tomadas) en su propia vista privada antes de que se consolide en el reporte de la jefatura [IG-04]
- [ ] Existe un período configurable (por ejemplo, 30 minutos post-turno) durante el cual el usuario puede agregar notas de contexto antes de que el reporte sea visible para su superior [IG-04]
- [ ] La política de visibilidad de datos (qué ve cada nivel jerárquico y cuándo) es transparente para el usuario desde el onboarding — no hay opacidad sobre cómo se usan sus datos [IG-04], [IG-SYNTH-11]

> **[GAP]** — La política de visibilidad de datos (qué información del operador es visible para él vs. para su jefatura) no está definida. Resolver con equipo TIMining antes de implementar este módulo. [CF-13], [CF-07]

**Priority:** High
**Pilar:** **Clear Path** — el JdT debe ver primero su propio desempeño para entender su situación y poder actuar. La transparencia antes de la exposición a la jefatura es el camino claro hacia la adopción voluntaria.
**Refs:** [IG-04], [IG-SYNTH-17], [IG-SYNTH-11]

---

## Insights Summary

| ID | Concepto | Status | Convergencia | Historias |
|---|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap — Brecha plan vs. realidad | VERIFIED | 15/54 | US-01, US-02, US-03, US-12 |
| [IG-SYNTH-02] | Auto de Homero Simpson — Feature bloat | VERIFIED | 8/54 | US-06, US-07 |
| [IG-SYNTH-04] | Del Dashboard al Copiloto — Asistencia proactiva | VERIFIED | 12/54 | US-05, US-06 |
| [IG-SYNTH-05] | Efecto Suiza — Integración agnóstica | VERIFIED | 10/54 | US-14, US-15 |
| [IG-SYNTH-06] | Patrón D→A→R como esqueleto UX | VERIFIED | 26/57 | US-05, US-08, US-10 |
| [IG-SYNTH-07] | Gestión por Excepción — Solo mostrar lo que importa | VERIFIED | 10/57 | US-01, US-05, US-10, US-12 |
| [IG-SYNTH-08] | Democratización del Dato — De expertos a todos | VERIFIED | 9/54 | US-04, US-07 |
| [IG-SYNTH-09] | Perfiles diferenciados con necesidades distintas | VERIFIED | 13/57 | US-09, US-10, US-17 |
| [IG-SYNTH-11] | Curva de aprendizaje y barrera de adopción | VERIFIED | 7/57 | US-04, US-13, US-14, US-17, US-18 |
| [IG-SYNTH-12] | Adherencia espacial como métrica central | VERIFIED | 10/54 | US-01, US-02, US-03, US-15 |
| [IG-SYNTH-13] | Stack tecnológico fragmentado | VERIFIED | 3/54 | US-02, US-04 |
| [IG-SYNTH-14] | Dependencia de venta consultiva | VERIFIED | 4/57 | US-03, US-15 |
| [IG-SYNTH-15] | Efecto Gaviota — Dolor del cambio de turno | VERIFIED | 5/54 | US-11, US-12, US-13, US-16 |
| [IG-SYNTH-16] | Paz Mental como propuesta de valor experiencial | VERIFIED | 7/57 | US-10 |
| [IG-SYNTH-17] | Adopción bottom-up — Operational Pull | VERIFIED | 6/57 | US-11, US-17, US-18 |
| [IG-SYNTH-19] | Interfaz Multimodal — 4 Lentes de navegación | VERIFIED | 7/54 | US-09, US-10, US-12 |
| [IG-03] | WhatsApp como canal principal de decisiones | VERIFIED | 2/57 | US-08, US-11, US-13, US-16 |
| [IG-04] | Resistencia de operadores cuando son auditados | VERIFIED | 1/57 | US-18 |
| [IG-05] | "Mi cliente es el Excel" — posicionamiento | VERIFIED | 1/57 | US-02, US-03, US-14 |
| [IG-06] | Desconexión mina-planta — Tercer gap | VERIFIED | 1/57 | US-03, US-14, US-15 |
| [IG-08] | 60 reglas operacionales propietarias como moat | VERIFIED | 1/57 | US-05, US-06 |
| [IG-09] | Sistema aprende de decisiones expertas | VERIFIED | 2/57 | US-07, US-16 |

---

## Gaps marcados en este documento

| ID | Historia afectada | Descripción | Acción requerida |
|---|---|---|---|
| [CF-07] | US-03, US-07, US-14, US-15, US-18 | Sin entrevistas directas con usuarios finales — perfiles y necesidades son proxy de stakeholders | Completar entrevistas Etapa 2 con jefes de turno, planificadores, CFO |
| [CF-08] | US-03, US-15 | Sin modelo de datos mina-planta ni unit economics — historias financieras sin definición técnica | Obtener financial model y modelo de datos con equipo CFO/finanzas |
| [CF-13] | US-18 | Política de visibilidad de datos operador vs. jefatura no definida — puede afectar adopción bottom-up | Resolver con equipo TIMining antes de implementar módulo de desempeño |
