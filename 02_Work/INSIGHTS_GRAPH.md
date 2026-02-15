# Insights Graph

Atomic verified insights extracted from sources. Each insight has a unique `[IG-XX]` ID, a status, and a traceable source reference.

## Status Legend

- **PENDING** — Extracted but not yet verified or cross-referenced.
- **VERIFIED** — Confirmed through cross-referencing or user validation.
- **MERGED** — Combined with another insight during conflict resolution.
- **INVALIDATED** — Contradicted by stronger evidence; no longer active.

---

## Ecosistema de Productos

### [IG-01] (technical) **VERIFIED**
TIMining posee 6-8 productos de software divididos en dos dominios principales: Operaciones/Planificación (Aware, Orchestra, Delta) y Geotecnia/Geología (SIC, Tangram, ARIS).
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-02] (business) **VERIFIED**
Aware y Orchestra se venden juntos como solución integrada porque Aware muestra la operación en tiempo real pero no puede cuantificar impacto, mientras Orchestra entrega análisis histórico para justificar el ROI.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-03] (user-need) **VERIFIED**
Los productos geotécnicos legacy (SIC, Tangram, ARIS) tienen una base de clientes estable y leal a pesar de interfaces visualmente desactualizadas.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-04] (business) **VERIFIED**
Delta funciona como puerta de entrada para vender otros productos y se usa a nivel corporativo en CODELCO, Grupo México y Equinox Gold estandarizando la conciliación entre distintos softwares de planificación.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

## Desafíos de Adopción y Usabilidad

### [IG-05] (user-need) **VERIFIED**
Los tiempos de actualización de datos en Aware son confusos para los usuarios: camiones se actualizan en tiempo casi real vía GPS, mapas de calor promedian 3 horas con desfase de 30 minutos, indicadores se refrescan cada 30 minutos, y topografía se genera cada 15 minutos.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-06] (user-need) **VERIFIED**
La capacitación inicial de Aware no alcanza para una interfaz con múltiples capas, y los usuarios abandonan la herramienta cuando no entienden el timing de los datos.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-07] (user-need) **VERIFIED**
Se perdió un cliente porque las métricas de extracción a 24 horas no hacían sentido para mineros que trabajan por turno.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-08] (user-need) **VERIFIED**
Los clientes piden muchas funcionalidades nuevas, pero luego les cuesta usarlas bien, generando el riesgo del "auto de Homero Simpson" (producto con demasiadas funcionalidades que nadie usa).
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-09] (user-need) **VERIFIED**
Orchestra requiere fuerte componente consultivo: los usuarios no tienen tiempo para curva de aprendizaje compleja y TIMining dedica 30-36 horas por caso de renovación para armar casos de estudio.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-10] (business) **VERIFIED**
En 2022 se invirtieron ~600 horas en dos proyectos de consultoría completos con Orchestra, indicando alta carga de trabajo consultivo.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-11] (technical) **VERIFIED**
El simulador de Orchestra no se ha adaptado bien a camiones autónomos, uso de múltiples rutas y otros escenarios modernos, requiriendo "trucos" y workarounds complejos de usuarios expertos.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-12] (user-need) **VERIFIED**
Los usuarios de SIC tienen alta autonomía comparado con Orchestra, pero el proceso de conciliación es tedioso y los usuarios acumulan trabajo para realizar varios a la vez.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

## Arquitectura Técnica

### [IG-13] (technical) **VERIFIED**
TIMining es agnóstico al hardware y proveedores (OEM), puede integrar datos de muchos sensores, equipos y sistemas sin importar la marca.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-14] (technical) **VERIFIED**
El diferenciador clave es la capacidad de hacer "match" entre la geometría del plan y lo que realmente pasa en terreno, conectando datos geométricos/topográficos con el posicionamiento y actividad real de los vehículos.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-15] (technical) **VERIFIED**
Los algoritmos de TIMining infieren estados de vehículos sin depender del input humano, mejorando la calidad de datos operacionales al no requerir que operadores marquen manualmente el estado del camión.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-16] (technical) **VERIFIED**
El stack tecnológico actual está fragmentado: componentes en C++, visualizaciones en Unity, servicios backend en Go y Python, interfaces web, y reportes generados in-house enviados por correo electrónico fuera de un flujo integrado.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-17] (technical) **VERIFIED**
No existe un sistema unificado de autenticación que abarque todo el portafolio de productos.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-18] (technical) **VERIFIED**
Para integrar sistemas actualmente se recurre a bajar bases de datos y hacer cruces manuales, invirtiendo tiempo en extraer datos, preprocesarlos y armar reportes manualmente en vez de usar APIs y flujos automatizados.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

## Problema Central y Propuesta de Valor

### [IG-19] (user-need) **VERIFIED**
Existe una "Brecha Geométrica": el minero en terreno ve "camioncitos y palas" en su sistema de flota pero no ve el contexto geológico ni el plan espacial detallado, sin saber si está extrayendo desde el polígono o bloque correcto.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-20] (business) **VERIFIED**
Las desviaciones respecto al plan se descubren tarde (a veces semanas después) y el costo de haber extraído en la zona equivocada puede ser de millones de dólares.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-21] (user-need) **VERIFIED**
Hay tensiones entre incentivos de corto plazo (cumplir un bono hoy) y valor de largo plazo de la mina.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-22] (business) **VERIFIED**
Cada faena minera requiere mucha customización: el tiempo estándar de instalación es 1 mes a nivel básico, luego viene un período largo de ajustes y customizaciones (ejemplo: todo 2025 comprometido con customización para un cliente en Aware).
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-23] (constraint) **VERIFIED**
Las razones de tanta variabilidad incluyen: distintos métodos de extracción, diferentes regulaciones locales, restricciones de seguridad, estructuras organizacionales diferentes, e incentivos de negocio que cambian el uso de la herramienta.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

## Casos de Uso y Perfiles de Usuario

### [IG-24] (user-need) **VERIFIED**
Caso de uso principal de Aware: jefes de turno monitoreando cuellos de botella, curvas lentas y estado de equipos para identificar problemas operacionales en tiempo real.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-25] (user-need) **VERIFIED**
Caso de éxito: Aware detectó caída sistemática de velocidad de ~20 km/h a 8 km/h en curva específica, lo que llevó a descubrir que la ruta de camiones autónomos estaba mal dibujada en software de Komatsu, recuperando rendimiento sin cambiar flota ni hardware.
Ref: `01_Sources/entrevistas operaciones/reu_coo_roberto-catalan.md`

### [IG-26] (user-need) **VERIFIED**
Orchestra es usado principalmente por planificadores para evaluar 20+ escenarios en horizontes de 3 años en proyectos de planificación anual.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-27] (user-need) **VERIFIED**
Delta es usado por planificadores y geólogos para conciliaciones de período (diario/mensual/anual) con resultados en menos de 1 minuto.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-28] (user-need) **VERIFIED**
Tangram es usado por ingenieros geotécnicos 2-3 veces por semana como mínimo para predecir bloques de roca que pueden caer y gestionar riesgo extrayendo bloques peligrosos antes de que caigan naturalmente.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-29] (user-need) **VERIFIED**
SIC es usado por ingenieros geotécnicos con frecuencia semanal o diaria para evaluación de cumplimiento banco por banco (ancho de berma, ángulo, parámetros de seguridad).
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-30] (user-need) **VERIFIED**
ARIS integra datos de 30+ tipos de instrumentos de monitoreo geotécnico y envía alertas automáticas cuando las lecturas exceden rangos de tolerancia.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

## Modelo de Negocio y Estrategia

### [IG-31] (business) **VERIFIED**
Base de clientes: ~16 minas usan Orchestra vs ~6-7 que usan Aware, indicando mayor penetración de Orchestra.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-32] (business) **VERIFIED**
TIMining nació en geotecnia y hoy se expande más hacia software de operaciones, teniendo más clientes legacy en productos geotécnicos.
Ref: `01_Sources/entrevistas operaciones/reunion_operaciones (27-01-2026).md`

### [IG-33] (business) **VERIFIED**
La venta es altamente consultiva: se requiere ayudar a los clientes constantemente con reportes, simulaciones y análisis para renovaciones y casos de estudio.
Ref: `01_Sources/entrevistas operaciones/reunion_operaciones (27-01-2026).md`

### [IG-34] (business) **VERIFIED**
El modelo de pricing tiene desafíos: Aware antes se vendía sin Orchestra, pero Aware solo no puede justificar su valor sin la analítica de Orchestra para cuantificar el impacto.
Ref: `01_Sources/entrevistas operaciones/reunion_operaciones (27-01-2026).md`

### [IG-35] (business) **VERIFIED**
TIMining tiene ventaja competitiva en ARIS al integrar cualquier tipo de instrumento sin cobrar adicionales por tener más instrumentos o por tener tanto el rajo como la relavera, mientras competidores cobran servicios adicionales.
Ref: `01_Sources/entrevistas operaciones/reunion_operaciones (27-01-2026).md`

## Problemas de Customización

### [IG-36] (technical) **VERIFIED**
Fuerte nivel de customización por cliente genera complejidad: funcionalidades activadas/desactivadas según tipo de mina (cobre vs bauxita vs carbón) y capas personalizadas según necesidades operacionales.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-37] (technical) **VERIFIED**
Riesgo de romper configuraciones específicas con actualizaciones de software debido a customizaciones.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-38] (user-need) **VERIFIED**
Existe necesidad de mejor validación de requerimientos: entender el uso real antes de implementar features para evitar implementar funcionalidades que los usuarios no usan.
Ref: `01_Sources/entrevistas operaciones/analisis reu con operaciones.md`

### [IG-39] (user-need) **VERIFIED**
Los usuarios piden funcionalidades pero luego no saben qué hacer con ellas, generando el fenómeno de "mientras más funciones tengamos mejor, son gratuitas" pero después no las usan.
Ref: `01_Sources/entrevistas operaciones/reunion_operaciones (27-01-2026).md`

## Visión Estratégica (Workshop)

### [IG-40] (business) **VERIFIED**
La visión de TIMining es convertirse en el "cerebro" o "sistema nervioso central" de la mina, ayudando a cumplir el plan minero mediante integración de datos en tiempo real, IA y sensores virtuales.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-41] (business) **VERIFIED**
El problema central que TIMining quiere resolver es ayudar a la mina a cumplir su plan minero, que está alineado con el plan de negocio del dueño, pero los usuarios actuales no están directamente preocupados por la última línea del dueño.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-42] (user-need) **VERIFIED**
El plan minero se pierde en todos los turnos, no una vez al año cuando el planificador lo actualiza, pero sin sistema no se detecta cuándo y dónde se pierde.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-43] (business) **VERIFIED**
La meta comercial es vender la nueva plataforma a $450,000 USD por implementación, significativamente más caro que Aware actual.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-44] (technical) **VERIFIED**
TIMining tiene tres capas tecnológicas: (1) integración de datos en tiempo real (efecto Suiza, agnóstico), (2) inteligencia (topografía en línea, sensores virtuales), (3) UX/UI (visualizador 3D).
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-45] (constraint) **VERIFIED**
La industria minera es lenta y conservadora con alta inercia en procesos, lo que hace que iteraciones sean lentas y ciclos de venta largos (1 año o más).
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-46] (business) **VERIFIED**
Existe oportunidad y amenaza: TIMining está en océano azul pero los competidores grandes (pascos) también están apuntando al mismo océano.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-47] (user-need) **VERIFIED**
Necesidad de generar "paz mental" para usuarios, permitiendo que las decisiones se basen en análisis de causa raíz y recomendaciones proactivas en lugar de solo reportar eventos pasados.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-48] (user-need) **VERIFIED**
La plataforma debe ser multimodal, llegando al usuario de múltiples formas: Aware, reportes, alertas, chat/agente, radio de mina, etc., no solo una interfaz única.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-49] (business) **VERIFIED**
Hipótesis: la plataforma debería ser importante para los CFO para ayudarles a asegurar que se cumpla el plan de negocio, pero TIMining no habla con los CFO actualmente.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-50] (user-need) **VERIFIED**
El valor está en los números que el cliente no tiene, no en convencerlo de que el número de TIMining es igual al que él ya tiene.
Ref: `01_Sources/Workshop 1/transcript.md`

## Desafíos de Implementación

### [IG-51] (constraint) **VERIFIED**
Los ciclos de venta son lentos (1 año o más) y los deploys también son lentos, haciendo difícil iterar y testear.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-52] (constraint) **VERIFIED**
Aunque hay iteraciones lentas, el punto de partida es crítico: si se parte muy offside, no dejan avanzar, por lo que la primera implementación debe ser razonablemente buena.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-53] (business) **VERIFIED**
TIMining ha sido "malaza" para cobrar porque no está claro dónde termina la configuración y dónde parte el servicio adicional como producto nuevo.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-54] (technical) **VERIFIED**
Cada subequipo tiende a resolver problemas solo con sus herramientas sin visión holística de todas las opciones disponibles en la plataforma.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-55] (user-need) **VERIFIED**
Los usuarios tienden a contar sus dolores, no sus problemas, requiriendo un approach más diagnóstico como un médico en vez de simplemente dar lo que piden.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-56] (user-need) **VERIFIED**
La visualización de datos es clave: los mismos datos en Excel vs en visualización intuitiva cambian radicalmente la capacidad de tomar decisiones.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-57] (business) **VERIFIED**
Decisión estratégica hace un par de años: ser una solución más flexible y multimodal en vez de converger todo a una sola plataforma (Aware).
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-58] (constraint) **VERIFIED**
Los equipos de implementación actualmente diseñan soluciones mientras implementan, sin arquitectura coherente definida previamente.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-59] (user-need) **VERIFIED**
La experiencia del usuario incluye desde que compra el producto: si la instalación es complicada, es parte de la mala experiencia aunque el software sea bueno.
Ref: `01_Sources/Workshop 1/transcript.md`

### [IG-60] (business) **VERIFIED**
No existe clarity en el modelo de negocio entre "producto base", "configuración", "customización" y "consultoría", generando problemas de pricing y captura de valor.
Ref: `01_Sources/Workshop 1/transcript.md`

---

## Métricas y Resultados Documentados (Design Brief)

### [IG-61] (business) **VERIFIED**
TIMining ha capturado USD $10M+ en valor total agregado across 3 minas en Chile (contexto Codelco/AMSA).
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-62] (business) **VERIFIED**
Una campaña específica en una sola mina Enero-Mayo 2025 generó USD $6M en valor capturado debido a mejoras en velocidad y adherencia al plan.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-63] (technical) **VERIFIED**
Mejora en cycle time documentada: reducción de 2.4 minutos en rampa F07B following mantenimiento priorizado.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-64] (technical) **VERIFIED**
Mejora en throughput: +130 truck loads/día ganadas debido a mejores cycle times en rutas mantenidas.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-65] (business) **VERIFIED**
Un cliente pasó de fallar el plan en -15.6% (Abril) a excederlo en +7.25% (Mayo) corrigiendo adherencia geométrica en Fase 361, mejorando Production Accuracy de Cu Fine.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-66] (technical) **VERIFIED**
Fleet efficiency mejorada en +5.2 truck hours/día ganadas resultando de decisiones optimizadas de mantenimiento de rampas.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

## AI Copilot (Project TIM) - Interacciones Documentadas

### [IG-67] (technical) **VERIFIED**
El agente TIM puede generar reportes tabulares en lenguaje natural: "¿Me darías el reporte de las palas en una tabla?" → genera tabla con Shovel ID, Status, Yield, Utilization, Availability, Idle Time, Queue Time, Total Extraction.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-68] (technical) **VERIFIED**
TIM puede graficar datos automáticamente: "¿Puedes graficar el tonelaje global por hora?" → genera line chart visualizando tendencia producción hourly.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-69] (technical) **VERIFIED**
TIM analiza cumplimiento de plan: "Con respecto al plan semanal, ¿cómo vamos?" → reporta 39.76% del plan semanal, estima completion Nov 16 (2 días delay), provee progreso por fase.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-70] (technical) **VERIFIED**
TIM configura alertas predictivas: "Avísame si se producirá inactividad mayor a 3 minutos con a lo más 15 minutos de anticipación en CH-1" → pide WhatsApp, guarda, configura alert basado en parámetros específicos.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-71] (technical) **VERIFIED**
TIM inicia simulaciones: "Puedes simular el escenario base para comenzar mi análisis de escenarios?" → inicia sensitivity analysis simulation Load & Haul system para establecer baseline.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-72] (technical) **VERIFIED**
TIM envía alertas proactivas geotécnicas: detecta trucks entrando zonas peligrosas y envía WhatsApp real-time: "truck CA104 está operando en zona de inestabilidad geotécnica".
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-73] (technical) **VERIFIED**
TIM predice downtime de equipos: "Crusher CH-1 is predicted to idle at least 4.28 minutes in 9.75 minutes" enviado proactivamente.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-74] (technical) **VERIFIED**
TIM detecta incumplimiento de plan en excavación: "Pala PA03 fuera de plan" cuando shovel extrae fuera del área designada.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-75] (technical) **VERIFIED**
TIM identifica asignaciones incorrectas de material: "Wrong Assignment: Truck 22304 assigned to Dump but carrying material for Stockpile".
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

## Casos de Uso Workshop 01

### [IG-76] (user-need) **VERIFIED**
Caso de uso crítico: Jefe de Turno al inicio necesita recibir contexto completo turno anterior sin depender de WhatsApp, detectar incumplimientos y recibir recomendaciones de prioridades.
Ref: `01_Sources/Workshop 1/Casos de Uso Workshop 01.docx`

### [IG-77] (user-need) **VERIFIED**
Caso de uso: Supervisor Centro Integrado llega a reunión sin preparación → plataforma envía WhatsApp 15 min antes con resumen contra plan, problemas principales (tronadura -20%, 5 camiones estacionados generarán cola), situaciones riesgo, y genera recomendaciones automáticas.
Ref: `01_Sources/Workshop 1/Casos de Uso Workshop 01.docx`

### [IG-78] (user-need) **VERIFIED**
Concepto "Skynet": visión de sistema que cada X minutos analiza situación general mina, corre N simulaciones buscando óptimo global, envía sugerencias a despacho/planificación/roles, y eventualmente genera replanificación automática ("haz esto") enviando órdenes: 1° a personas, 2° a máquinas.
Ref: `01_Sources/Workshop 1/Casos de Uso Workshop 01.docx`

### [IG-79] (user-need) **VERIFIED**
20 escenarios de crisis documentados cubren roles: jefe turno, planificador mina, supervisor operaciones, geólogo, despachador, gerente mantenimiento, planificador corto plazo, supervisor centro integrado, gerente mina.
Ref: `01_Sources/Workshop 1/Casos de Uso Workshop 01.docx`

## KEEP-STOP-START Retro

### [IG-80] (user-need) **VERIFIED**
Usuarios NO quieren: visualización 3D de la mina, desarrollos específicos (prefieren genéricos), gráficos/reportes que no resuelven algo, mostrar mismos KPIs que todos dashboards, más pantallas, mucha data sin sentido, capacitaciones largas, experiencias que quiten tiempo.
Ref: `01_Sources/Workshop 1/KEEP-STOP-START (retro).docx`

### [IG-81] (user-need) **VERIFIED**
Usuarios SÍ quieren: ejemplos de otros clientes "¿cómo lo uso?" (catálogo), herramientas fáciles y robustas para decisiones día a día, sistema recomendador que tome acción en temas recurrentes, capacitación según perfil (ojalá in-app), respuestas automáticas a problemas, experiencia acorde rutina diaria.
Ref: `01_Sources/Workshop 1/KEEP-STOP-START (retro).docx`

### [IG-82] (user-need) **VERIFIED**
Usuarios no saben que necesitan: asistente virtual día a día, disminuir reuniones/coordinaciones, "desplanificadómetro" en línea (medir desvío desde t0, material perdido), reducir ruido información (foco esencial), copiloto que soporte decisiones, herramientas para entender "qué pasó y porqué" luego "qué hacer", consciencia de valor agregado con sus decisiones.
Ref: `01_Sources/Workshop 1/KEEP-STOP-START (retro).docx`

### [IG-83] (user-need) **VERIFIED**
"Desplanificadómetro": métrica inexistente que usuarios necesitan sin saberlo - medir desvío acumulado en tiempo real desde t0 y cuantificar material perdido que dejó de extraerse.
Ref: `01_Sources/Workshop 1/KEEP-STOP-START (retro).docx`

## Visión Estratégica 2040 (Evolution Narrative)

### [IG-84] (business) **VERIFIED**
Roadmap Phase 7 (2026 - Year of Digital Co-Pilot): Q1 2026 engineers enable AI to run automatic simulations using Orchestra engine, shifting from "problem happening" to "here are 3 scenarios to fix it" in minutes.
Ref: `01_Sources/Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx`

### [IG-85] (business) **VERIFIED**
Roadmap Phase 8 (2040 Vision): Mature IROC donde corporations manage múltiples minas globales desde centros urbanos (ej. Santiago), distinción mine-plant desaparece (single digital twin), natural language como interfaz nativa, automated shift transitions eliminan "seagull effect", virtual visits reemplazan site visits físicos.
Ref: `01_Sources/Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx`

### [IG-86] (business) **VERIFIED**
Value proposition shift documentado: cambió de vender "nice 3D viewer" a "robust end-to-end platform for short-term planning + operational efficiency + plan compliance".
Ref: `01_Sources/Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx`

### [IG-87] (business) **VERIFIED**
2025 no fue gran año ARR growth pero terminó con strong Pipeline → 2026 Budget tiene 80%+ ARR growth target YoY.
Ref: `01_Sources/Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx`

### [IG-88] (business) **VERIFIED**
TIMining transitó exitosamente desde software factory hacia recurring SaaS business model con world-class commercial organization, expandiendo beyond LatAm hacia North America + Australia.
Ref: `01_Sources/Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx`

### [IG-89] (business) **VERIFIED**
Base de ingresos recurrentes se aproxima a ~$5M con márgenes altos y capital-efficient software economics.
Ref: `01_Sources/Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx`

## 10 Pilares Estratégicos (CCB Narrative)

### [IG-90] (business) **VERIFIED**
Pilar Valor Cliente: TIMining entrega lo que nadie más tiene - capacidad de responder "¿Estamos cumpliendo el plan ahora mismo?" permitiendo correcciones intra-turno evitando destrucción de valor antes de que se consolide.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-91] (business) **VERIFIED**
"Efecto Suiza": En industria con "jardines amurallados" donde grandes OEMs (Caterpillar, Komatsu, Hexagon) compiten y no integran entre sí, TIMining es el Integrador Neutro agnóstico al hardware. Proveedores que no se hablan SÍ se integran con TIMining, generando ventaja estructural defensible.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-92] (business) **VERIFIED**
Adopción "Bottom-Up" inusualmente alta: más de 100 usuarios activos mensuales por faena. La operación confía porque resuelve dolores diarios (stickiness), generando tracción interna que acelera acuerdos corporativos.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-93] (business) **VERIFIED**
Altas gerencias están interesadas en entender trayectoria de desvíos al plan: aunque no les interesa detalle día a día, los desvíos al plan de negocio se generan día a día y difícilmente se pueden recuperar.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-94] (business) **VERIFIED**
Oportunidad Pricing: Existe desconexión entre precio actual y valor estratégico de ser "Fuente de la Verdad". Para comprador estratégico, oportunidad inmediata de realinear pricing de modelo "licencia de software" a modelo "valor empresarial", capturando porción mayor de ahorros millonarios generados.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-95] (technical) **VERIFIED**
ADN único: "singularidad" forjada resolviendo problemas difíciles separadamente - rigor Geotecnia (precisión matemática donde error cuesta vidas) + dinámica Operación Orchestra (caos logístico, modeling procesos) + desarrollar algoritmos inferir estado mina real-time desde sensores. Capacidad multidisciplinaria difícil replicar.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-96] (technical) **VERIFIED**
Barrera de entrada = Inferencia geométrica de procesos mina: mientras competencia depende hardware costoso (drones, escáneres), TIMining desarrolló algoritmos propietarios que usan "ruido" datos existentes para reconstruir mina real-time. No simulamos → vemos ejecución real. No estimamos → medimos con precisión.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-97] (business) **VERIFIED**
Futuro es autónomo y remoto (IROC): robots ciegos sin modelo actualizado entorno. TIMining = eslabón perdido habilitando Minería 4.0. Para comprador estratégico, adquirir TIMining no es comprar software; es asegurar control de capa datos ejecución.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

### [IG-98] (business) **VERIFIED**
Con Project TIM (integración IA), shift de describir realidad → prescribir futuro, convirtiéndose en activo final para liderar minería autónoma.
Ref: `01_Sources/Antecedentes/Narrativa CCB para Mngt Team_ESP.docx`

## Interview Maps

### [IG-99] (user-need) **VERIFIED**
PM AWARE (Carolina) identifica problemas principales: calidad de datos es el #1, complejidad de servidores que tienen multiples funcionalidades, falta de cuantificación de impacto para justificar valor.
Ref: `01_Sources/Entrevista PM AWARE.png`

### [IG-100] (business) **VERIFIED**
PM AWARE diferencia productos: "AWARE es más datos en tiempo real (light, solo ilumina), Orchestra es análisis profundo".
Ref: `01_Sources/Entrevista PM AWARE.png`

### [IG-101] (business) **VERIFIED**
PM AWARE busca referentes: design systems, ClickUp, videojuegos, Google Maps, Power BI para datos.
Ref: `01_Sources/Entrevista PM AWARE.png`

### [IG-102] (business) **VERIFIED**
PM AWARE identifica competencia debe compararse en: comparaciones gráficas de características, centros remotos de aprendizaje simple, facilidad de uso y acceso libre.
Ref: `01_Sources/Entrevista PM AWARE.png`

### [IG-103] (user-need) **VERIFIED**
PM Orchestra (Ernesto) define valor: cuantificación de desviaciones y pérdida, reducir tiempos de ciclo, mejor adherencia plan. Usuario ideal: operarios en terreno que 1. detectan 2. corrigen en terreno 3. cuantifican ganancia.
Ref: `01_Sources/Entrevista PM Orchestra.png`

### [IG-104] (technical) **VERIFIED**
PM Orchestra identifica problema: 30% de uso de usuarios avanzados, simulador muy sofisticado y sólo válido para expertos, brechas técnicas problemáticas no generalizables en tiempo real.
Ref: `01_Sources/Entrevista PM Orchestra.png`

### [IG-105] (business) **VERIFIED**
PM Orchestra visión futuro 2026: empowerment simulador interactivo según perfiles (técnicos y arquitectura 3 meses), paso a producción prototipos (4 meses adelante).
Ref: `01_Sources/Entrevista PM Orchestra.png`

### [IG-106] (user-need) **VERIFIED**
Gerente Comms (Ana) viene de industria muy diferente y observa: TIMining resuelve problemas en industria minera pero "en la realidad no sé si el cliente lo percibe", señalando gap entre capacidad técnica y percepción de valor.
Ref: `01_Sources/Entrevista_Ana.png`

### [IG-107] (business) **VERIFIED**
Gerente Comms identifica tensión: board confía en lo que TIMining resuelve, pero existe brecha entre mensaje técnico y comunicación para diferentes audiencias. "Como comunicamos (gente super técnica que comunica)" es un problema.
Ref: `01_Sources/Entrevista_Ana.png`

### [IG-108] (business) **VERIFIED**
Gerente Comms señala problema crítico: "No podemos estar prevalidos del tipo de deseos del cliente, no es así cuando el valor que estamos entregando". Tensión entre flexibilidad y capacidad de decir "no" a customizaciones.
Ref: `01_Sources/Entrevista_Ana.png`

### [IG-109] (business) **VERIFIED**
Gerente Comms visión: "Multimodal - la propuesta recordó ese todo de la información a la mina Y deben incluir múltiples", confirmando estrategia multicanal.
Ref: `01_Sources/Entrevista_Ana.png`

### [IG-110] (business) **VERIFIED**
Gerente Comms identifica: expertise técnico está muy centralizado "hoy mucho en Carlo", señalando riesgo de concentración de conocimiento crítico en una persona.
Ref: `01_Sources/Entrevista_Ana.png`

---

## 🎯 GAP: Producto Actual vs Visión Futura CORE

### [IG-111] (constraint) **VERIFIED**
Los 20 casos de uso documentados en el Workshop representan VISIÓN FUTURA (70-80% aspiracional) para TIMining CORE, NO son capacidades del producto actual.
Ref: `01_Sources/Workshop 1/Casos de Uso Workshop 01.docx` + `_CONTEXT.md`

### [IG-112] (user-need) **VERIFIED**
Workshop documenta el GAP entre producto actual (Aware/Orchestra con problemas UX, alta carga consultiva 30-36h/renovación, dependencia WhatsApp) y visión CORE (plataforma proactiva multimodal con AI copilot).
Ref: `01_Sources/Workshop 1/_CONTEXT.md`

### [IG-113] (technical) **VERIFIED**
Algunas capacidades de la visión CORE están parcialmente implementadas: AI Copilot TIM tiene queries en lenguaje natural funcionando y alertas geotécnicas básicas, pero integración completa en flujo multimodal es futura.
Ref: `01_Sources/Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx`

### [IG-114] (user-need) **VERIFIED**
Casos de uso aspiracionales describen capacidades deseadas: detección automática de problemas, análisis causa-raíz, recomendaciones proactivas, predicción de eventos 15min antes, coordinación sin WhatsApp.
Ref: `01_Sources/Workshop 1/Casos de Uso Workshop 01.docx`

### [IG-115] (business) **VERIFIED**
Visión "Skynet" (Lámina 20) es roadmap futuro lejano: sistema analiza situación cada X minutos, corre N simulaciones, eventualmente da órdenes a máquinas (autonomía completa "1° personas, 2° máquinas").
Ref: `01_Sources/Workshop 1/Casos de Uso Workshop 01.docx`

---

## Nuevos Insights — /analyze 2026-02-15

### [IG-116] (user-need, current) PENDING
Los usuarios necesitan que la plataforma sea "plug and play" sin generar problemas adicionales de TI, contratos o adherencia técnica.

> "No quiere más problemas (TI, contrato, adherencia) quiere que nuestra solución sea plug and play"

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-117] (user-need, current) PENDING
Los usuarios están sobrecargados con dashboards que muestran los mismos KPIs repetidos y prefieren información única y procesable.

> "MOSTRAR LOS MISMOS KPIS QUE TODOS LOS DASHBOARDS [...] MÁS PANTALLAS [...] MUCHA DATA SIN SENTIDO"

Convergence: 2/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-118] (user-need, aspirational) PENDING
Los usuarios necesitan un sistema proactivo que venga a ellos con soluciones, no que requiera buscar activamente la información.

> "Buscar la solución → que la solución venga a él [...] Un sistema más Proactivo"

Convergence: 2/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-119] (user-need, aspirational) PENDING
Los usuarios necesitan que el sistema recomiende acciones (sistema recomendador), no solo alertas — customización con recomendaciones automáticas ante problemas recurrentes.

> "Un sistema Recomendador y que tome ACCIÓN en temas recurrentes [...] Customización. Necesita recomendaciones no solo alertas. Respuestas Automáticas a sus problemas y sugerencias."

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-120] (user-need, current) PENDING
Los usuarios necesitan capacitación adaptada a su perfil de usuario, idealmente in-app, evitando capacitaciones largas y genéricas.

> "CAPACITACIÓN RESPECTO AL PERFIL DE USUARIO (OJALÁ IN-APP) [...] Capacitaciones muy largas [NO necesita]"

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-121] (user-need, aspirational) PENDING
Los usuarios quieren ver elementos que les ayuden a cumplir sus KPIs de bonos personales y mejorar su desempeño individual.

> "Ver los elementos que le ayudan a cumplir sus KPIs de sus bonos [...] Que puedo hacer: mejorar su trabajo. Mejor desempeño personal."

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-122] (user-need, aspirational) PENDING
Los usuarios necesitan priorización clara ante contingencias con orden de prioridad integrado en canales primarios de comunicación (radiales, WhatsApp).

> "Orden de prioridad ante contingencias (Radiales - whatsapp, etc.) [...] Estar en los canales de comunicación primarios de la MINA"

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-123] (user-need, aspirational) PENDING
Los usuarios necesitan un "desplanificadómetro" en línea que mida en tiempo real cuánto material se ha dejado de extraer versus el plan desde un tiempo t0.

> "Un Desplanificadometro (desplaninometro) en línea. Medir cuanto llevo desviado desde un t0. Lo # Material perdido que dejé de extraer."

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-124] (user-need, aspirational) PENDING
Los usuarios no saben que necesitan coordinarse entre áreas y comunicar eventualidades rápidamente — existe oportunidad de ofrecer herramienta intermediaria para mejorar comunicación entre colaboradores.

> "COORDINARSE ENTRE ÁREAS Y SER RÁPIDO EN COMUNICAR EVENTUALIDADES [...] Mejorar la comunicación entre colaboradores áreas. ¿Un intermediario?"

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-125] (user-need, aspirational) PENDING
Los usuarios necesitan capacidad de auditar sus "fuentes de la verdad" (FMS, drilling software, etc.) y corregirlas cuando hay inconsistencias.

> "AUDITAR SUS 'FUENTES DE LA VERDAD' Y CORREGIRLAS [...] No sabe los datos que tiene, ni su calidad de su informacion."

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-126] (technical, aspirational) PENDING
La plataforma debe ofrecer un catálogo de casos de uso y ejemplos de otros clientes para responder "¿cómo lo uso?" — arquitectura fácil de justificar al cliente con pre-factibilidad.

> "¿Ejemplos de otros clientes '¿CÓMO LO USO?' CATÁLOGO [...] Pre-factibilidad → Arquitectura fácil de Justificar al Cliente."

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-127] (technical, current) PENDING
El equipo tiene dependencia alta del formato de datos del cliente y de que el cliente envíe los datos — necesidad de reducir dependencia del cliente.

> "Menos dependencia del Cliente. Dependemos mucho del formato del Dato del Cliente o que lo envíe."

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-128] (technical, aspirational) PENDING
El AI Copilot (TIM Agent) debe incluir búsqueda por voz, chat conversacional, y búsqueda en lenguaje natural sin necesidad de navegar la interfaz tradicional.

> "El IA COPILOT debe incluir: Búsqueda por voz, Chat conversacional, Búsqueda en lenguaje natural"

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/Design Brief.md`

Status: PENDING

### [IG-129] (technical, aspirational) PENDING
La plataforma debe tener una API genérica que exponga módulos internos (topografía, perforación, carguío y transporte, etc.) para consumo externo y configuración flexible.

> "API genérica: Una sola entrada que expone todos los módulos de TIMining (topografía, perforación, carguío y transporte, etc.)"

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/Design Brief.md`

Status: PENDING

### [IG-130] (business, current) PENDING
El product team mide su éxito con KPIs de velocidad de implementación de nuevas funcionalidades, user adoption (usuarios activos, frecuencia de uso), y tiempo promedio de configuración/despliegue.

> "Product Team KPIs: Velocidad de implementación de nuevas funcionalidades, User Adoption (usuarios activos, frecuencia de uso, etc.), Tiempo promedio de configuración y despliegue"

Convergence: 1/18 sources

Ref: `01_Sources/Workshop 1/Design Brief.md`

Status: PENDING

### [IG-131] (technical, aspirational) PENDING
La arquitectura debe permitir agregar capas de datos de manera simple y rápida sin desarrollo específico — módulos genéricos configurables.

> "Agregar un dato para entenderlo en con el contexto, simple y rápido [...] Dejar de hacer desarrollos específicos y desarrollarlos de manera genérica"

Convergence: 2/18 sources

Ref: `01_Sources/Workshop 1/retro.txt`

Status: PENDING

### [IG-132] (business, current) PENDING
TIMining realizó una primera ronda de capital de ~USD 4M liderada por Aurus Capital (VC enfocado en minería) en 2017-2019 para financiar el crecimiento internacional.

> "This first round raised aprox USD 4 MM and was led by Aurus Capital, a mining focused VC."

Convergence: 1/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-133] (business, current) PENDING
Anglo American Los Bronces fue el socio estratégico principal para refinar la visión del Digital Twin en una solución lista para campo.

> "Strategic Co-Development: Anglo American's Los Bronces became the primary partner to refine this vision into a field-ready solution."

Convergence: 1/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-134] (technical, current) PENDING
El algoritmo de inferencia topográfica en tiempo real usando datos GPS de palas (sin drones ni escaneo manual) es el breakthrough técnico propietario de TIMining desarrollado por Carlo Calderón.

> "The Proprietary Breakthrough: Carlo Calderon developed a unique algorithm to infer topographies in real-time using GPS data from shovels."

Convergence: 3/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-135] (business, current) PENDING
2025 no fue un año de gran crecimiento de ARR, pero terminó con un pipeline fuerte para cosechar en 2026/27 — budget 2026 proyecta >80% crecimiento YoY de ARR.

> "Whilst 2025 wasn't a great year in terms of ARR growth, these new conversations allowed to end the year with a strong Pipeline to harvest during 2026/27, hence why 2026's Budget has over an 80% ARR growth target YoY."

Convergence: 1/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-136] (business, aspirational) PENDING
Para 2040, se espera que la industria minera opere minas globales simultáneamente desde centros urbanos (IROCs maduros en Santiago u otras ciudades), con distinción desaparecida entre mina y planta.

> "The Mature IROC (Integrated Remote Operations Center): Massive corporations manage multiple global mines simultaneously from urban centers like Santiago. The distinction between the mine and the plant has vanished."

Convergence: 2/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-137] (technical, aspirational) PENDING
Para 2040, los cambios de turno estarán soportados por logs multimedia creados automáticamente por la plataforma TIMining, eliminando el "efecto gaviota" (caída de producción durante handovers).

> "Automated Shift Transitions: The 'shift change' ritual is now supported by multimedia logs created automatically by TIMining's Platform, eliminating the 'seagull effect' (production drops during handovers)."

Convergence: 1/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-138] (technical, aspirational) PENDING
Para 2040, las visitas físicas a sitio serán inexistentes — equipos geotécnicos y operativos inspeccionarán "zonas virtuales" para evitar interrumpir flujos de vehículos autónomos.

> "Virtual Visits: Physical site visits are non-existent; geotechnical and operational teams inspect 'virtual zones' to avoid interrupting autonomous vehicle flows."

Convergence: 1/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-139] (business, aspirational) PENDING
Para 2040, equipos corporativos usarán modelos predictivos de TIMining para decisiones tácticas multi-mina — si una mina cae detrás del plan, el sistema identifica estrategias de recuperación a nivel portafolio corporativo.

> "Corporate teams no longer just react to yesterday's data; they use TIMining's predictive models to make multi-mine tactical decisions. If one mine falls behind its plan, the system identifies strategies to recover yield across the entire corporate portfolio."

Convergence: 1/18 sources

Ref: `01_Sources/Antecedentes/evolution.txt`

Status: PENDING

### [IG-140] (business, current) PENDING
TIMining ocupa una posición estructural única como "Integrador Neutro" (Efecto Suiza) — los grandes OEMs (Caterpillar, Komatsu, Hexagon) que no se integran entre sí sí se integran con TIMining.

> "En una industria caracterizada por 'jardines amurallados' donde los grandes OEMs compiten y no se integran entre sí, Timining ocupa una posición estructural única: somos el Integrador Neutro."

Convergence: 3/18 sources

Ref: `01_Sources/Antecedentes/narrativa.txt`

Status: PENDING

### [IG-141] (business, current) PENDING
La adopción de TIMining es "Bottom-Up" inusualmente alta con >100 usuarios activos mensuales por faena — la operación confía porque resuelve dolores diarios (stickiness).

> "Tenemos una adopción 'Bottom-Up' inusualmente alta, con más de 100 usuarios activos mensuales por faena. La operación confía en nosotros porque resolvemos sus dolores diarios (stickiness)."

Convergence: 2/18 sources

Ref: `01_Sources/Antecedentes/narrativa.txt`

Status: PENDING

### [IG-142] (technical, current) PENDING
El "músculo" técnico de TIMining se forjó resolviendo problemas difíciles por separado: precisión matemática (Geotecnia), dinámica de procesos (Orchestra), inferencia geométrica desde sensores.

> "Nuestra ventaja no es solo código; es ADN. Somos una 'singularidad' forjada al resolver primero problemas difíciles por separado: El rigor de la Geotecnia [...] La dinámica de la Operación (Orchestra) [...] Inferir el estado de la mina en tiempo real desde los sensores."

Convergence: 2/18 sources

Ref: `01_Sources/Antecedentes/narrativa.txt`

Status: PENDING

