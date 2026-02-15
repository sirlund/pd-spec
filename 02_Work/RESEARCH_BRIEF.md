# Research Brief
> Auto-generado por /analyze el 2026-02-15
> Basado en 142 insights de 18 fuentes

## Qué Está Roto

**El problema de la visualización 3D sin contexto**
Los usuarios están sobrecargados de pantallas y dashboards que repiten los mismos KPIs sin resolver problemas reales ([IG-117]). La visualización 3D de la mina, que el equipo consideraba un diferenciador, es mencionada explícitamente por usuarios como algo que NO necesitan. Lo que realmente falta es un sistema que venga a ellos con soluciones, no que les exija buscar información activamente ([IG-118]).

**La "Brecha Geométrica" sigue viva**
A pesar de los avances tecnológicos, persiste una desconexión fundamental: el minero en terreno ve "camioncitos y palas" en su FMS pero no ve el contexto geológico ni el plan espacial ([IG-19]). Las desviaciones del plan se descubren tarde —a veces semanas después— con costos de millones de dólares ([IG-20]). El plan minero se pierde en todos los turnos, pero sin sistema no se detecta cuándo ni dónde ([IG-42]).

**Customización como trampa de valor**
Cada faena minera requiere ~1 mes de instalación básica, seguido de períodos largos de customización —un cliente consumió todo 2025 en ajustes ([IG-22]). Los usuarios piden muchas funcionalidades pero luego no saben qué hacer con ellas ([IG-39]), generando el riesgo del "auto de Homero Simpson" ([IG-08]). No existe claridad en el modelo de negocio entre "producto base", "configuración", "customización" y "consultoría" ([IG-60]).

**Carga consultiva insostenible**
Orchestra requiere fuerte componente consultivo: TIMining dedica 30-36 horas por caso de renovación para armar casos de estudio ([IG-09]). En 2022, dos proyectos consumieron ~600 horas totales ([IG-10]). La venta es altamente consultiva: se ayuda constantemente a clientes con reportes, simulaciones y análisis para justificar renovaciones ([IG-33]).

**Stack técnico fragmentado**
El stack está fragmentado: componentes en C++, visualizaciones en Unity, servicios backend en Go y Python, interfaces web, y reportes generados in-house enviados por correo fuera de un flujo integrado ([IG-16]). No existe sistema unificado de autenticación ([IG-17]). La integración de sistemas se hace bajando bases de datos y haciendo cruces manuales ([IG-18]).

**Dependencia del cliente**
El equipo tiene dependencia alta del formato de datos del cliente y de que el cliente envíe los datos — necesidad urgente de reducir esta dependencia ([IG-127]).

## Qué Podría Ser Mejor

**Sistema recomendador, no solo alertas**
Los usuarios quieren recomendaciones automáticas ante problemas recurrentes, no solo alertas ([IG-119]). Necesitan un sistema que tome acción en temas repetitivos, reduciendo la carga cognitiva. La plataforma debe ser proactiva, viniendo a ellos con soluciones ([IG-118]).

**Capacitación contextual in-app**
Los usuarios necesitan capacitación adaptada a su perfil, idealmente in-app, evitando capacitaciones largas y genéricas ([IG-120]). Actualmente, la capacitación inicial de Aware no alcanza para una interfaz con múltiples capas ([IG-06]).

**El "desplanificadómetro" que no existe**
Una métrica inexistente que usuarios necesitan sin saberlo: medir desvío acumulado en tiempo real desde t0 y cuantificar material perdido que dejó de extraerse ([IG-83], [IG-123]). Esto conectaría directamente con los KPIs de bonos personales de supervisores y operadores ([IG-121]).

**Coordinación entre áreas sin WhatsApp**
Los usuarios no saben que necesitan coordinarse mejor entre áreas y comunicar eventualidades rápidamente ([IG-124]). Existe oportunidad de ofrecer herramienta intermediaria que reemplace la dependencia actual de WhatsApp para coordinación crítica. Necesitan priorización clara ante contingencias integrada en canales primarios de comunicación ([IG-122]).

**Catálogo de casos de uso**
La plataforma debe ofrecer un catálogo de ejemplos de otros clientes para responder "¿cómo lo uso?" ([IG-126]). Esto facilitaría onboarding y justificación de valor con arquitectura pre-factibilizada.

**Auditoría de "fuentes de verdad"**
Los usuarios necesitan capacidad de auditar sus FMS, drilling software y otras "fuentes de la verdad" y corregirlas cuando hay inconsistencias ([IG-125]). No saben la calidad de sus datos actuales.

**Módulos genéricos configurables**
La arquitectura debe permitir agregar capas de datos de manera simple y rápida sin desarrollo específico ([IG-131]). Esto se menciona en 2 fuentes diferentes, indicando convergencia del problema.

**API genérica para integración**
La plataforma debe tener una API genérica que exponga módulos internos (topografía, perforación, carguío y transporte, etc.) para consumo externo y configuración flexible ([IG-129]).

**AI Copilot completo**
El TIM Agent debe incluir búsqueda por voz, chat conversacional, y búsqueda en lenguaje natural sin necesidad de navegar la interfaz tradicional ([IG-128]). Algunas capacidades ya están implementadas parcialmente ([IG-113]).

## Qué Funciona Bien

**El "músculo" técnico único**
TIMining forjó una singularidad técnica al resolver problemas difíciles por separado: rigor de Geotecnia (precisión matemática), dinámica de Operación con Orchestra (modelamiento de procesos), e inferencia geométrica desde sensores ([IG-142]). Esta capacidad multidisciplinaria es difícil de replicar.

**El algoritmo de inferencia topográfica**
El breakthrough técnico propietario: algoritmo de inferencia topográfica en tiempo real usando datos GPS de palas (sin drones ni escaneo manual), desarrollado por Carlo Calderón ([IG-134]). Mencionado en 3/18 fuentes, es la barrera de entrada más fuerte.

**El "Efecto Suiza"**
TIMining ocupa posición estructural única como "Integrador Neutro": los grandes OEMs (Caterpillar, Komatsu, Hexagon) que no se integran entre sí SÍ se integran con TIMining ([IG-140], [IG-91]). Mencionado en 3/18 fuentes, es ventaja estratégica defensible.

**Adopción bottom-up excepcional**
Adopción "Bottom-Up" inusualmente alta con >100 usuarios activos mensuales por faena ([IG-141], [IG-92]). La operación confía porque resuelve dolores diarios (stickiness), generando tracción interna que acelera acuerdos corporativos.

**Casos de éxito documentados**
USD $10M+ en valor capturado en 3 minas en Chile ([IG-61]). Una sola campaña (Enero-Mayo 2025) generó USD $6M ([IG-62]). Un cliente pasó de -15.6% vs plan (Abril) a +7.25% (Mayo) ([IG-65]).

**Base recurrente creciente**
TIMining transitó exitosamente a modelo SaaS con ingresos recurrentes ~$5M, márgenes altos y software economics capital-efficient ([IG-89], [IG-88]).

**Productos geotécnicos legacy estables**
Los productos geotécnicos (SIC, Tangram, ARIS) tienen base de clientes estable y leal a pesar de interfaces visualmente desactualizadas ([IG-03]). ARIS tiene ventaja competitiva clara: integra cualquier instrumento sin cobros adicionales mientras competidores cobran por cada sensor ([IG-35]).

## Tensiones Clave

**[CF-01] FLAGGED: Aware standalone vs bundled**
Tensión no resuelta entre vender Aware solo (mostrar operación en tiempo real) vs bundled con Orchestra (cuantificar impacto para justificar ROI). Aware solo no puede justificar su valor sin la analítica de Orchestra ([IG-02], [IG-34], [IG-100]).

**[CF-02] FLAGGED: Customización — valor vs riesgo**
Los nuevos insights [IG-131] (módulos genéricos configurables) refuerzan esta tensión. Por un lado, la customización permite capturar valor en faenas únicas ([IG-23]). Por otro, genera complejidad técnica ([IG-36]), riesgo de romper configuraciones ([IG-37]), y falta de clarity en modelo de negocio ([IG-60]). Los usuarios mismos piden "dejar de hacer desarrollos específicos" ([IG-131]), pero cada faena es genuinamente diferente.

**Simplicidad vs Feature Requests**
Usuarios explícitamente NO quieren más pantallas ni data sin sentido ([IG-117]), pero clientes piden muchas funcionalidades ([IG-08]). Luego no saben qué hacer con ellas ([IG-39]). Esta tensión requiere mejor validación de requerimientos ([IG-38]) y approach más diagnóstico ([IG-55]).

**Proactividad vs Configuración**
Usuarios necesitan sistema proactivo que venga a ellos ([IG-118]), pero cada faena requiere mucha customización ([IG-22]). ¿Cómo estandarizar la proactividad cuando cada mina es única?

**Pricing desalineado con valor**
Existe desconexión entre precio actual y valor estratégico de ser "Fuente de la Verdad" ([IG-94], [IG-115]). Meta comercial es vender nueva plataforma a $450K USD ([IG-43]), pero TIMining ha sido "malaza" para cobrar ([IG-53]).

## Gaps de Evidencia

**Diversidad de fuentes:**
- ✓ User research: 11 archivos (entrevistas operaciones, workshop, retro)
- ✓ Business data: 4 archivos (narrativas estratégicas, evolution, design brief)
- ✓ Technical docs: Presente en entrevistas y design brief
- ✗ **Falta:** Competitive analysis directa — se mencionan competidores ([IG-46], [IG-102]) pero no hay benchmarks detallados
- ✗ **Falta:** Accessibility data — no hay auditorías WCAG ni datos demográficos de usuarios
- ✗ **Falta:** Brand / design guidelines — no hay documentos de identidad visual

**Diversidad score: 3/6** — saludable pero con gaps en competitivo y accesibilidad.

**Insights single-source (frágiles):**
22 de los 27 nuevos insights ([IG-116] a [IG-142]) son single-source (convergencia 1/18). Solo [IG-117], [IG-118], [IG-131] (2/18), y [IG-134], [IG-140] (3/18) tienen corroboración multi-fuente.

**Sugerencias de validación:**

1. **Competitive benchmarking** — Analizar en profundidad qué ofrecen los "pascos" que apuntan al mismo océano azul ([IG-46]). ¿Qué tienen en centros remotos, facilidad de uso, acceso libre? ([IG-102])

2. **User research con CFOs** — Hipótesis no validada: la plataforma debería ser importante para CFOs para asegurar cumplimiento del plan de negocio, pero TIMining no habla con CFOs actualmente ([IG-49]).

3. **Auditoría de usabilidad** — Los tiempos de actualización confusos ([IG-05]), capacitación insuficiente ([IG-06]), y métricas que no hacen sentido ([IG-07]) sugieren necesidad de auditoría formal de usabilidad con usuarios reales.

4. **Validación de casos de uso CORE** — Los 20 casos de uso son 70-80% aspiracionales ([IG-111]). Antes de construir, validar cuáles tienen mayor impacto real vs cuáles son "nice to have".

5. **Análisis de churn** — ¿Por qué se perdió el cliente que no entendía métricas a 24h? ([IG-07]). Análisis sistemático de churn revela patterns.

6. **KPIs de product team** — Se documentan KPIs ([IG-130]) pero no hay baseline ni targets. ¿Cuál es la velocidad actual de implementación? ¿Cuál es el user adoption actual?

---

**Convergencia summary:**

- **High convergence (>50% sources):** Ningún insight supera 3/18 (16.6%)
- **Medium convergence (2-3 sources):** 13 insights
- **Single-source (frágiles):** 129 de 142 insights (90.8%)

La base de conocimiento es amplia pero poco profunda — muchos insights únicos, pocos validados across múltiples fuentes. Esto es típico de maturity Level 1 (Seed) moviéndose a Level 2 (Validation).
