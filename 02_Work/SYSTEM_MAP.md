# System Map

The product's logic layer. Every decision here traces back to verified insights in `INSIGHTS_GRAPH.md`.

## Product Vision

> TIMining CORE es la plataforma unificada que cierra la "Geometry Gap" entre el plan minero y la realidad operacional, transformando datos en tiempo real en inteligencia accionable mediante el patrón Detección→Análisis→Recomendación, personalizada por perfil de usuario, y diseñada para dar "Paz Mental" en entornos operacionales críticos. [IG-SYNTH-01, IG-SYNTH-06, IG-SYNTH-09, IG-SYNTH-16]

CORE absorbe y reemplaza gradualmente a Aware y Orchestra, integrando las capacidades de ambos bajo una experiencia multimodal inteligente con un nuevo módulo transversal de IA (TIM Agent). [IG-SYNTH-10, CF-06]

## Modules

### Module: Geometry Engine
**Status:** Ready
**Refs:** [IG-SYNTH-01], [IG-SYNTH-12], [IG-15]
**Design implications:**
- Topografía en tiempo real cada 15 min como dato fundacional de toda la plataforma — [IG-SYNTH-01]
- Adherencia espacial (plan compliance) como métrica principal, no toneladas movidas — [IG-SYNTH-12]
- Conciliación plan vs realidad visible en tiempo real para todos los perfiles — [IG-SYNTH-12]
- El sistema debe comunicar niveles de confianza de la topografía cuando el GPS está degradado: calidad del dato como variable visible para el usuario, no un supuesto oculto — [IG-15]

### Module: Copiloto Inteligente (TIM Agent)
**Status:** Ready
**Refs:** [IG-SYNTH-04], [IG-SYNTH-06], [IG-SYNTH-08], [IG-08], [IG-09], [IG-10], [IG-18], [IG-22]
**Design implications:**
- Toda funcionalidad sigue el patrón Detección → Análisis → Recomendación — [IG-SYNTH-06]
- Sistema proactivo que anticipa problemas y sugiere soluciones rankeadas — [IG-SYNTH-04]
- Lenguaje natural (Gemini) como interfaz primaria de consulta — [IG-SYNTH-08]
- Simulaciones automáticas cada X minutos con sugerencias priorizadas — [IG-SYNTH-04]
- Las 60 reglas operacionales propietarias (dispatching, cambio de turno, secuencias de salida) actúan como capa de validación que impide que la AI genere recomendaciones operacionalmente inválidas. Este es el diferenciador real vs. LLMs genéricos conectados a datos mineros — [IG-08]
- El sistema aprende de las decisiones de usuarios expertos: patrones de rechazo de recomendaciones alimentan las sugerencias futuras, democratizando el conocimiento operacional tácito — [IG-09]
- "Quiet UI" es responsabilidad compartida sistema-interfaz: el sistema no debe generar alertas innecesarias (las 60 reglas filtran a nivel lógico), Y la UI no debe mostrar todo lo que el sistema genera. Ambas capas son necesarias y complementarias — [IG-10]
- El copiloto opera en dos niveles de valor distintos con diferentes audiencias: **Plan compliance** (Casos 1-6 — respuesta a incidentes, anticipación, asistencia turno a turno) y **Plan optimization** (Casos 7-8 — reconfigurar el plan estratégico cuando el modelo subyacente es incorrecto). Sin el nivel 1, no hay plataforma — [IG-22]
- Los 8 casos de uso se organizan en 4 dominios operativos: **A=Respuesta a Crisis** (Quiet UI lidera), **B=Anticipación Operativa** (Time Sight lidera), **C=Asistencia Inteligente** (Omni Sense lidera), **D=Alineación Estratégica** (multi-pilar). Esta clasificación guía qué pilar prioriza el diseño de cada caso — [IG-18]

### Module: Experiencia Multimodal (4 Lentes)
**Status:** Active
**Refs:** [IG-SYNTH-19], [IG-SYNTH-09], [IG-SYNTH-07], [IG-SYNTH-16], [IG-03], [IG-16], [IG-17], [IG-19], [IG-21]
**Design implications:**
- 4 lentes de navegación: Reality (3D), Tactical (2D), Agent (conversacional), Briefing (feed) — [IG-SYNTH-19]
- Diferenciación por perfil: Despachador, Jefe de Turno, Gerente de Mina, Planificador — [IG-SYNTH-09]
- 3D valioso pero UX actual saturada: rediseñar con jerarquía visual clara — [CF-02]
- Gestión por excepción: solo mostrar anomalías, no el estado normal — [IG-SYNTH-07]
- Cada interacción debe dar "Paz Mental": certeza, no más datos — [IG-SYNTH-16]
- Agnóstico al canal: WhatsApp y Radio IP como canales prioritarios; el 90% de las decisiones operacionales ocurre en WhatsApp. El sistema captura decisiones tomadas fuera de la plataforma, no solo empuja información hacia el usuario — [IG-03]
- Los 4 pilares forman un sistema encadenado, no independiente: Quiet UI filtra → Clear Path guía → Time Sight anticipa → Omni Sense distribuye. El output de cada pilar alimenta el siguiente — [IG-16]
- Distinción arquitectural de los pilares: QUI + Omni Sense = capas de "cómo se presenta" (presentación y canal); Clear Path + Time Sight = capas de "qué se presenta" (contenido y anticipación) — [IG-17]
- **Interfaz manos libres como modo primario para usuarios en terreno:** el Jefe de Turno en berma no puede usar pantalla ni teclado. La entrada por voz+foto (Push-to-Talk) y el procesamiento local (Edge AI) son requisitos de diseño no negociables para este perfil, no features opcionales — [IG-21]
- **Time Scrubbing como patrón UX de Time Sight:** capacidad de rebobinar la operación hasta el momento exacto del primer desvío y ver la cadena causal completa en una sola vista. Forensics operacional, no solo visibilidad temporal. Benchmark: Tesla Fleet — [IG-19]

### Module: Briefing de Turno
**Status:** Ready
**Refs:** [IG-SYNTH-15], [IG-SYNTH-17]
**Design implications:**
- Briefings automáticos multimedia (voice note, video reel, KPI summary) 15 min antes del turno — [IG-SYNTH-15]
- Embeber en la rutina estándar de cambio de turno para generar stickiness — [IG-SYNTH-17]
- Eliminar "Efecto Gaviota": turno entrante con contexto completo sin preguntar — [IG-SYNTH-15]

### Module: Seguridad y Geotecnia
**Status:** Ready
**Refs:** [IG-SYNTH-18]
**Design implications:**
- Alertas de seguridad geotécnica como funcionalidad crítica (3 de 20 casos de uso del workshop) — [IG-SYNTH-18]
- Integración ARIS aspiracional pero compleja: evaluar viabilidad sin complejizar la interfaz — [IG-SYNTH-18]
- Verificación de procedimientos de trabajo y gestión de tronaduras — [IG-SYNTH-18]

### Module: Plataforma de Integración (Efecto Suiza)
**Status:** Blocked
**Refs:** [IG-SYNTH-05], [IG-SYNTH-13], [IG-05], [IG-06], [IG-13], [IG-20]
**Blocker:** Stack fragmentado sin autenticación unificada [IG-SYNTH-13]. Riesgo de implementación técnico documentado en CF-11 — preguntas abiertas: APIs, modelos de datos, backend headless, pasos bloqueantes.
**Design implications:**
- Integración agnóstica con cualquier OEM (Komatsu, Cat, Modular, Hexagon) y software de planificación (Maptek, Deswik) — [IG-SYNTH-05]
- Autenticación unificada como prerrequisito de la plataforma — [IG-SYNTH-13]
- La integración no compite con las herramientas familiares del cliente (Excel, radio, reuniones de turno): las conecta y captura las decisiones que ya ocurren en esos canales — [IG-05]
- Integrar datos operacionales con KPIs financieros para reportería ejecutiva (CFO): la desconexión mina-planta es el tercer gap que la plataforma debe cerrar — [IG-06]
- Pricing diferencial para desarrollo custom históricamente no formalizado: todo custom fue absorbido sin cobro adicional. Definir framework de pricing (configuración vs. extensión vs. custom) antes de nuevos compromisos de customización — [IG-13]
- **CFO como quinto perfil de usuario (apuesta estratégica 2026):** necesita la respuesta en lenguaje financiero, en su bolsillo, sin entender minería. La plataforma debe aprender a hablar finanzas, no al revés. Apuesta de Philip y Carlo para 2026, pendiente validación directa con CFO — [IG-20]

### Module: Onboarding Progresivo
**Status:** Ready
**Refs:** [IG-SYNTH-11], [IG-SYNTH-02]
**Design implications:**
- Capacitación in-app contextual por perfil, no manuales genéricos — [IG-SYNTH-11]
- Complejidad progresiva: interfaz intuitiva sin certificación previa — [IG-SYNTH-11]
- "Zero Homer": cada feature debe justificar su existencia con evidencia de uso — [IG-SYNTH-02]

## Design Principles

### 1. "Paz Mental"
Cada interacción debe reducir la carga cognitiva, no aumentarla. El valor del producto es la certeza de que se está tomando la decisión correcta. Si una pantalla genera más preguntas que respuestas, está fallando.

**Framing interno vs. externo:** "Paz mental" es el concepto de diseño interno — guía las decisiones de UX y arquitectura. En comunicación con clientes, traducir a: *"ayúdame a tomar la mejor decisión porque yo no tengo tiempo"* — centrado en eficiencia y confianza en la información. El comprador (CEO, Jefe de Mina con agenda saturada) no compra "paz mental", compra tiempo recuperado y decisiones más confiables. [CF-12 RESOLVED]
**Refs:** [IG-SYNTH-16], [IG-SYNTH-07], [IG-05]

### 2. "Quiet UI"
Solo mostrar lo que importa. Si hay 50 camiones bien, no mostrarlos. Gestión por excepción: el sistema vigila silenciosamente y notifica solo cuando es crítico. Alertas legibles en menos de 5 segundos.

**Dos capas necesarias:** el sistema no debe generar alertas innecesarias (las reglas operacionales filtran a nivel lógico), y la interfaz no debe mostrar todo lo que el sistema genera (jerarquía visual clara). Una capa sin la otra no resuelve el problema de saturación — [IG-10]
**Refs:** [IG-SYNTH-07], [IG-SYNTH-06], [IG-10]

### 3. "Zero Homer"
No implementar features sin validar uso real. Cada funcionalidad debe justificar su existencia con evidencia de adopción. Si no hay [IG-XX] que lo respalde, no se construye.
**Refs:** [IG-SYNTH-02]

### 4. "D→A→R"
Toda funcionalidad sigue el patrón Detección → Análisis → Recomendación. Este es el esqueleto UX validado por 20 casos de uso del workshop. No hay excepciones.
**Refs:** [IG-SYNTH-06]

### 5. "Inteligencia Democrática"
Cualquier perfil accede a insights sin expertise técnico. De expertos SQL a lenguaje natural. De desktop a bolsillo. De 5 usuarios a 100+ por sitio.
**Refs:** [IG-SYNTH-08], [IG-SYNTH-09]

### 6. "Efecto Suiza"
Integración neutral con cualquier OEM, FMS o software de planificación. Nunca tomar partido por un vendor. El valor está en ser el hub que conecta lo que no se conecta.
**Refs:** [IG-SYNTH-05]

### 7. "Operational Pull"
Diseñar para adopción bottom-up. La herramienta debe embeberse en rutinas operacionales diarias (cambio de turno) y generar tracción interna que acelere acuerdos corporativos. No depender de mandatos top-down.

**Condición crítica:** el operador debe percibir CORE como herramienta de ayuda, no de control. Cuando planificación usa la plataforma para auditar operadores, estos resisten activamente. CORE debe dar al operador visibilidad de su propio desempeño antes de exponerlo a la jefatura — [IG-04]
**Refs:** [IG-SYNTH-17], [IG-04]

## Open Questions

- [ ] ¿Framework formal para distinguir configuración (umbrales sin código) vs customización (features con código)? — [CF-05]
- [ ] ¿Unit economics del modelo SaaS actual? CAC, LTV, márgenes, breakdown de revenue — [CF-08]
- [ ] Agendar sesión de benchmark UX con Carlo (CTO) — apertura confirmada en Touchpoint 19-feb — [CF-03 RESOLVED]
- [ ] Completar plan de entrevistas con usuarios finales — 1 efectuada con usuario externo, más en planificación con apoyo de Philip — [CF-07]
- [ ] ¿Bloqueantes técnicos para migración a CORE? APIs, modelos de datos, backend headless, pasos previos — [CF-11]
- [ ] ¿Estándares WCAG aplicables a cada pilar de CORE? — [CF-10]
- [ ] ¿Cuál es el workflow específico de Excel/radio que CORE reemplaza en cada perfil de usuario? — [IG-05]
- [ ] ¿Qué información del operador es visible para él vs. para su jefatura? ¿Cómo se comunica esto en el onboarding? — [IG-04], [CF-13]
- [ ] ¿Cuál es el modelo de datos que une operaciones con finanzas? ¿Qué métricas financieras son accionables desde la plataforma para el CFO? — [IG-06]
- [ ] ¿Cómo se mide el valor por decisión individual para demostrar el ROI del ticket de USD 450K? ¿Cuál es la metodología de demostración de valor para el comprador? — [IG-11], [CF-08]
- [ ] ¿Framework de pricing para desarrollo custom? ¿Qué constituye configuración (incluida en licencia) vs. customización a medida (pricing diferencial)? — [IG-13], [CF-05]
- [ ] ¿Qué KPIs financieros necesita el CFO diariamente? ¿Cuál es el umbral mínimo de drill-down que le da autonomía sin necesitar llamar a nadie? — [IG-20], [CF-08]
- [ ] ¿Cuáles son los requisitos de Edge AI para procesamiento local en faena? ¿Cuál es la conectividad mínima esperable y la latencia máxima aceptable para voz+foto? — [IG-21]
- [ ] Al diseñar Time Scrubbing: ¿cuánto tiempo de historial operacional debe ser "rebobinable"? ¿Cuál es la granularidad mínima (por minuto, por evento, por turno)? — [IG-19]

<!-- Updated by /resolve on 2026-02-25 -->
