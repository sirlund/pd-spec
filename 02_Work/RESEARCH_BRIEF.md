# Research Brief
> Auto-generado por /analyze el 2026-02-16
> Basado en 161 insights de 21 fuentes

## Qué Está Roto

**El cuello de botella cognitivo humano**
La "Paradoja de la Mina Digital": la mina genera 5 TB/día de datos en milisegundos (latencia de 1.45 millones de ms, streaming real-time), pero el cuello de botella cognitivo humano toma 4.5 horas para analizar y decidir ([IG-149]). Los usuarios están sobrecargados de dashboards que repiten los mismos KPIs sin resolver problemas reales ([IG-117]).

**El "Efecto Gaviota" en cambios de turno**
Pérdida de contexto en cambios de turno genera caídas de producción durante handovers ([IG-144]). Los supervisores llegan al turno sin preparación, dependiendo de WhatsApp informal para recibir contexto ([IG-76], [IG-77]).

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

**Plataforma CORE 2026 con 4 modos operacionales**
La visión CORE define 4 modos: REALITY (Digital Twin real-time), TACTICAL (Simulación de escenarios), AGENT (IA Copiloto conversacional), BRIEFING (Handover automático de turno) ([IG-143]). Esto resuelve el problema de usuarios que necesitan diferentes niveles de granularidad según contexto.

**Briefings automáticos multimedia para eliminar "Efecto Gaviota"**
Solución propuesta: briefings automáticos con Voice Note + Video Reel + KPI Summary generados por la plataforma ([IG-144]). Esto eliminaría la dependencia de WhatsApp y aseguraría continuidad en cambios de turno.

**Flujo cerrado Detection → Analysis → Recommendation → Action**
La plataforma implementa closed-loop workflow que reduce tiempo problema-solución de horas a minutos ([IG-145]). Ejemplo: CORE detecta desviación 1.5m en pala, TIM predice cuello de botella, supervisor recibe alerta con opciones, selecciona solución, plan se auto-actualiza y flota se redirige instantáneamente.

**Arquitectura de 4 canales con experiencias diferenciadas**
Canal 1 Control Operacional (alta resolución para despachadores), Canal 2 Gestión Proactiva ("El Silencio es Oro" para supervisores en terreno), Canal 3 Visión Estratégica (movilidad/semáforo para gerentes), Canal 4 Conversación con IA (democratizar analítica para ingenieros) ([IG-150], [IG-151]).

**Timeline Slider (viaje en el tiempo)**
Interface propuesta con navegación temporal desde datos históricos (hindsight) hasta simulaciones futuras (foresight) ([IG-146]). Permite a usuarios moverse entre pasado y futuro para análisis de causa-raíz y planificación.

**Sistema recomendador, no solo alertas**
Los usuarios quieren recomendaciones automáticas ante problemas recurrentes, no solo alertas ([IG-119]). Necesitan un sistema que tome acción en temas repetitivos, reduciendo la carga cognitiva. La plataforma debe ser proactiva, viniendo a ellos con soluciones ([IG-118]).

**Capacitación contextual in-app**
Los usuarios necesitan capacitación adaptada a su perfil, idealmente in-app, evitando capacitaciones largas y genéricas ([IG-120]). Actualmente, la capacitación inicial de Aware no alcanza para una interfaz con múltiples capas ([IG-06]).

**El "desplanificadómetro" que no existe**
Una métrica inexistente que usuarios necesitan sin saberlo: medir desvío acumulado en tiempo real desde t0 y cuantificar material perdido que dejó de extraerse ([IG-83], [IG-123]). Esto conectaría directamente con los KPIs de bonos personales de supervisores y operadores ([IG-121]).

**Coordinación entre áreas sin WhatsApp**
Los usuarios no saben que necesitan coordinarse mejor entre áreas y comunicar eventualidades rápidamente ([IG-124]). Existe oportunidad de ofrecer herramienta intermediaria que reemplace la dependencia actual de WhatsApp para coordinación crítica. Necesitan priorización clara ante contingencias integrada en canales primarios de comunicación ([IG-122]).

**Roadmap 2025-2026 detallado**
H2 2025: Material Tracking Integral, Gestión de Extracción, Alertas Geotécnicas. 2026: Proyecto TIM v1 (recomendaciones), Simulación continua automática. Futuro: Sensores virtuales para caminos autónomos, Expansión Underground ([IG-155]).

**Especificaciones multimodales técnicas**
Voz vía Radio IP 450.0 MHz protocolo P25, Chat TIM Insight, Visual 3D Twin MINA_DIGITAL_v4.2, Push Alertas HIGH/CRITICAL ([IG-147]). Material Tracking con conciliación espacial automática polígonos vs trayectorias ([IG-159]). Inferencia topográfica cada 15 min ([IG-160]).

**Módulos genéricos configurables**
La arquitectura debe permitir agregar capas de datos de manera simple y rápida sin desarrollo específico ([IG-131]). Esto se menciona en 2 fuentes diferentes, indicando convergencia del problema.

**API genérica para integración**
La plataforma debe tener una API genérica que exponga módulos internos (topografía, perforación, carguío y transporte, etc.) para consumo externo y configuración flexible ([IG-129]).

**AI Copilot completo**
El TIM Agent debe incluir búsqueda por voz, chat conversacional, y búsqueda en lenguaje natural sin necesidad de navegar la interfaz tradicional ([IG-128]). Algunas capacidades ya están implementadas parcialmente ([IG-113]).

**User Journeys con personas específicos**
Pedro (Jefe de Turno terreno, manos ocupadas) necesita Voz/Radio IP ([IG-156]). María (Gerente remota) necesita Push/WhatsApp ([IG-157]). Jorge (Controlador alta presión) necesita Desktop 3D + Simulación ([IG-158]).

## Qué Funciona Bien

**Validación global de mercado**
TIMining tiene validación en 50+ minas en 8 países, con 7 minas corriendo el modelo Digital Twin completo en tiempo real ([IG-152]). Portfolio de clientes incluye CODELCO, BHP, Glencore, Anglo American, Teck, Lundin Mining. 27 minas en Sudamérica más operación BHP WAIO.

**TRL 9 — Validación matemática de la realidad**
El gemelo digital está en TRL 9 (Technology Readiness Level 9), validado matemáticamente como fuente única de verdad que fusiona planificación con operación en tiempo real ([IG-148]). No es simulación, es validación matemática de la realidad.

**Modelo de adopción "Leapfrog" bottom-up**
Ingenieros y supervisores impulsan la adopción (no top-down), con alta adherencia al embeberse en rutinas diarias de turno. 100+ usuarios activos por sitio. Meta: 80% crecimiento YoY para 2026 ([IG-153]).

**Métrica de impacto: Adherencia 60% → 95%**
Adherencia al Plan mejora de 60% → 95% mediante corrección en tiempo real, transformando incertidumbre operativa en resultados predecibles ([IG-154]).

**El "músculo" técnico único**
TIMining forjó una singularidad técnica al resolver problemas difíciles por separado: rigor de Geotecnia (precisión matemática), dinámica de Operación con Orchestra (modelamiento de procesos), e inferencia geométrica desde sensores ([IG-142]). Esta capacidad multidisciplinaria es difícil de replicar.

**El algoritmo de inferencia topográfica**
El breakthrough técnico propietario: algoritmo de inferencia topográfica en tiempo real usando datos GPS de palas (sin drones ni escaneo manual), desarrollado por Carlo Calderón ([IG-134]). Mencionado en 3/18 fuentes, convergencia que sube a 6/21 con PDFs nuevos — HIGHEST convergence insight.

**El "Efecto Suiza"**
TIMining ocupa posición estructural única como "Integrador Neutro": los grandes OEMs (Caterpillar, Komatsu, Hexagon) que no se integran entre sí SÍ se integran con TIMining ([IG-140], [IG-91]). Mencionado ahora en 6/21 fuentes tras PDFs — segunda convergencia más alta.

**Adopción bottom-up excepcional**
Adopción "Bottom-Up" inusualmente alta con >100 usuarios activos mensuales por faena ([IG-141], [IG-92], [IG-153]). La operación confía porque resuelve dolores diarios (stickiness), generando tracción interna que acelera acuerdos corporativos.

**Casos de éxito documentados**
USD $10M+ en valor capturado en 3 minas en Chile ([IG-61]). Una sola campaña (Enero-Mayo 2025) generó USD $6M ([IG-62]). Un cliente pasó de -15.6% vs plan (Abril) a +7.25% (Mayo) ([IG-65]).

**Base recurrente creciente**
TIMining transitó exitosamente a modelo SaaS con ingresos recurrentes ~$5M, márgenes altos y software economics capital-efficient ([IG-89], [IG-88]).

**Productos geotécnicos legacy estables**
Los productos geotécnicos (SIC, Tangram, ARIS) tienen base de clientes estable y leal a pesar de interfaces visualmente desactualizadas ([IG-03]). ARIS tiene ventaja competitiva clara: integra cualquier instrumento sin cobros adicionales mientras competidores cobran por cada sensor ([IG-35]).

**Posicionamiento estratégico 2026: "Cracking the Geometry Code"**
Punto de inflexión para pasar de monitorear el pasado a operar el presente, cerrando el loop entre mundo sensorial y mundo de planificación mediante inferencia geométrica propietaria ([IG-161]).

## Tensiones Clave

**[CF-01] FLAGGED: Aware standalone vs bundled**
Tensión no resuelta entre vender Aware solo (mostrar operación en tiempo real) vs bundled con Orchestra (cuantificar impacto para justificar ROI). Aware solo no puede justificar su valor sin la analítica de Orchestra ([IG-02], [IG-34], [IG-100]).

**[CF-02] FLAGGED: Customización — valor vs riesgo**
Los nuevos insights [IG-131] (módulos genéricos configurables) refuerzan esta tensión. Por un lado, la customización permite capturar valor en faenas únicas ([IG-23]). Por otro, genera complejidad técnica ([IG-36]), riesgo de romper configuraciones ([IG-37]), y falta de clarity en modelo de negocio ([IG-60]). Los usuarios mismos piden "dejar de hacer desarrollos específicos" ([IG-131]), pero cada faena es genuinamente diferente.

**Simplicidad vs Feature Requests**
Usuarios explícitamente NO quieren más pantallas ni data sin sentido ([IG-117]), pero clientes piden muchas funcionalidades ([IG-08]). Luego no saben qué hacer con ellas ([IG-39]). Esta tensión requiere mejor validación de requerimientos ([IG-38]) y approach más diagnóstico ([IG-55]).

**Proactividad vs Configuración**
Usuarios necesitan sistema proactivo que venga a ellos ([IG-118]), pero cada faena requiere mucha customización ([IG-22]). ¿Cómo estandarizar la proactividad cuando cada mina es única? La arquitectura de 4 canales ([IG-150]) propone una solución: experiencias diferenciadas por rol, no por faena.

**Pricing desalineado con valor**
Existe desconexión entre precio actual y valor estratégico de ser "Fuente de la Verdad" ([IG-94]). Meta comercial es vender nueva plataforma a $450K USD ([IG-43]), pero TIMining ha sido "malaza" para cobrar ([IG-53]). Con validación de 50+ minas y clientes tier-1 ([IG-152]), hay oportunidad de realinear pricing.

## Gaps de Evidencia

**Diversidad de fuentes:**
- ✓ User research: 11 archivos (entrevistas operaciones, workshop, retro)
- ✓ Business data: 7 archivos (narrativas estratégicas, evolution, design brief, 3 PDFs visión CORE)
- ✓ Technical docs: Presente en entrevistas, design brief y 3 PDFs visión CORE
- ✗ **Falta:** Competitive analysis directa — se mencionan competidores ([IG-46], [IG-102]) pero no hay benchmarks detallados
- ✗ **Falta:** Accessibility data — no hay auditorías WCAG ni datos demográficos de usuarios
- ✗ **Falta:** Brand / design guidelines — no hay documentos de identidad visual

**Diversidad score: 3/6** — saludable pero con gaps en competitivo y accesibilidad.

**Insights single-source (frágiles):**
De los 161 insights totales, ~145 son single-source (convergencia 1/21). Solo 16 insights tienen convergencia 2-6/21:
- **Highest convergence (6/21):** [IG-134] Inferencia topográfica, [IG-140] Efecto Suiza
- **Medium convergence (2-3/21):** [IG-117], [IG-118], [IG-131], [IG-153], [IG-160], [IG-141], [IG-92], [IG-85], [IG-97], otros

**Sugerencias de validación:**

1. **Competitive benchmarking** — Analizar en profundidad qué ofrecen los "pascos" que apuntan al mismo océano azul ([IG-46]). ¿Qué tienen en centros remotos, facilidad de uso, acceso libre? ([IG-102])

2. **User research con CFOs** — Hipótesis no validada: la plataforma debería ser importante para CFOs para asegurar cumplimiento del plan de negocio, pero TIMining no habla con CFOs actualmente ([IG-49]).

3. **Auditoría de usabilidad** — Los tiempos de actualización confusos ([IG-05]), capacitación insuficiente ([IG-06]), y métricas que no hacen sentido ([IG-07]) sugieren necesidad de auditoría formal de usabilidad con usuarios reales.

4. **Validación de casos de uso CORE** — Los 20 casos de uso son 70-80% aspiracionales ([IG-111]). Antes de construir CORE completo, validar cuáles tienen mayor impacto real vs cuáles son "nice to have".

5. **Análisis de churn** — ¿Por qué se perdió el cliente que no entendía métricas a 24h? ([IG-07]). Análisis sistemático de churn revela patterns.

6. **KPIs de product team** — Se documentan KPIs ([IG-130]) pero no hay baseline ni targets. ¿Cuál es la velocidad actual de implementación? ¿Cuál es el user adoption actual?

7. **Validación con clientes tier-1** — Con portfolio CODELCO, BHP, Glencore, Anglo ([IG-152]), entrevistar a estos clientes para validar roadmap CORE y arquitectura de 4 modos ([IG-143]).

---

**Convergencia summary:**

- **Highest convergence (6/21 sources):** 2 insights ([IG-134] Inferencia topográfica, [IG-140] Efecto Suiza)
- **Medium convergence (2-3/21):** 14 insights
- **Single-source (frágiles):** ~145 de 161 insights (90.1%)

La base de conocimiento sigue siendo amplia pero poco profunda. Sin embargo, los insights de HIGHEST convergence (inferencia topográfica y Efecto Suiza) son precisamente los diferenciadores estratégicos más fuertes de TIMining. Esto valida que el core técnico y posicionamiento están bien fundamentados.

Maturity actual: Level 1 (Seed) → Level 2 (Validation) en transición.
