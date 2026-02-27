# Strategic Vision — TIMining

> Última actualización: 2026-02-26 | 39 insights VERIFIED · 4 conflictos PENDING

---

## Visión de Producto

> TIMining CORE es la plataforma unificada de inteligencia operacional minera que cierra la "Geometry Gap" entre el plan y la realidad, convirtiendo datos en tiempo real en decisiones confiables. El producto existe para que cada operador — desde el Despachador hasta el CFO — tome la decisión correcta con la información correcta en el momento y canal correcto. [IG-SYNTH-01, IG-SYNTH-06, IG-SYNTH-09, IG-22]

CORE absorbe y reemplaza gradualmente a Aware y Orchestra, integrando sus capacidades bajo una experiencia multimodal inteligente con TIM Agent como capa transversal de IA. [IG-SYNTH-10]

---

## Estrategia de Producto

### Ventajas defensibles

**1. Geometry Engine — el moat tecnológico** [IG-SYNTH-01]
TIMining es la única empresa que puede correr simulaciones sobre topografía que se actualiza cada 15 minutos usando datos GPS de equipos existentes, sin drones ni hardware adicional. Esta capacidad técnica cierra la Geometry Gap y es el diferenciador que ningún competidor puede replicar en el corto plazo.

**2. 60 reglas operacionales propietarias — el moat de conocimiento** [IG-08]
Décadas de lógica operacional (dispatching, cambio de turno, secuencias de salida) codificadas en reglas que convierten IA genérica en recomendador confiable. Sin estas reglas, un LLM conectado a datos mineros alucina. Este es el diferenciador real frente a entrantes tecnológicos con más recursos.

**3. Framework UX propietario para minería operacional** [IG-16, IG-17]
Los 4 pilares de diseño no son features de interfaz sino la arquitectura de cómo CORE traduce datos en decisiones. Ningún competidor ha formalizado un framework de diseño para minería operacional a este nivel.

### Posicionamiento

**El competidor real es Excel, no Hexagon.** Philip (CEO): *"Mi cliente no es tecnología — mi cliente es el Excel."* El comprador no evalúa CORE contra Maptek o Deswik; evalúa CORE contra sus procesos actuales. Si CORE no conecta con WhatsApp, no exporta a Excel y no habla en métricas que el CFO ya usa, la adopción depende de mandatos top-down que no se sostienen. [IG-05]

### Bifurcación de valor [IG-22]

| Nivel | Casos | Propuesta | Requisito |
|---|---|---|---|
| **Mejoramiento continuo** | 1-6 | Decisión correcta, turno a turno — no para "cumplir" el plan ciegamente, sino para mejorarlo continuamente | Base — sin esto no hay plataforma |
| **Reconfiguración estratégica** | 7-8 | Detectar cuándo el plan subyacente es incorrecto y ajustarlo antes de que el costo sea irrecuperable | Requiere nivel 1 consolidado |

> **Nota de framing (directriz CTO):** TIMining no es una herramienta para "cumplir el plan" — es una herramienta de planificación permanente. El plan cambia, el sistema acompaña. [IG-22, IG-SYNTH-12]

---

## Design Principles — Los 4 Pilares

Los pilares son los principios de diseño del producto: la arquitectura de cómo CORE presenta y distribuye información. Forman una cadena funcional, no un conjunto paralelo de atributos. [IG-16]

**Cadena:** Quiet UI → Clear Path → Time Sight → Omni Sense

**Distinción arquitectural:** Quiet UI + Omni Sense son capas de *cómo se presenta* la información (presentación + canal). Clear Path + Time Sight son capas de *qué se presenta* (contenido + anticipación). [IG-17]

**Relación asimétrica:** La relación pilar-dominio no es una grilla 4×4 uniforme. Cada dominio tiene pilares líderes (alta afinidad) y pilares secundarios (presentes pero no dominantes). Ej: Quiet UI es central en Respuesta a Crisis pero marginal en Asistencia Inteligente. Esto implica priorización en diseño — no todos los cruces merecen el mismo nivel de profundidad. [IG-24]

---

### Quiet UI
**Rol en el sistema:** Filtra — el sistema vigila silenciosamente y solo lo anómalo interrumpe.
**Opera en:** Behavioral (qué mostrar) + Materialization (cómo mostrarlo)
**Dominio primario:** A — Respuesta a Crisis
**Refs:** [IG-SYNTH-07], [IG-10]

El sistema gestiona por excepción: si hay 50 camiones bien, no mostrarlos. Alertas legibles en menos de 5 segundos. Quiet UI opera en dos capas simultáneas: el sistema no genera alertas innecesarias (las 60 reglas filtran a nivel lógico) y la interfaz no muestra todo lo que el sistema genera (jerarquía visual clara). Una capa sin la otra no resuelve el problema de saturación cognitiva.

> **Pregunta de diseño:** ¿El estado del sistema es legible en 1 vistazo sin leer texto?

---

### Clear Path
**Rol en el sistema:** Guía — el usuario nunca se pregunta "¿y ahora qué hago?".
**Opera en:** Structural (flujo de decisión) + Behavioral (interacción)
**Dominio primario:** Transversal — guía la decisión en todos los dominios
**Refs:** [IG-SYNTH-06], [IG-SYNTH-08]

Toda funcionalidad sigue el patrón D→A→R. El usuario tiene siempre un próximo paso claro con el contexto necesario para ejecutarlo: la recomendación sin razón genera resistencia; la recomendación con costo/beneficio visible genera adopción. Es también el pilar del CFO — el decisor con menos tiempo disponible necesita el camino más corto de dato a decisión financiera.

> **Pregunta de diseño:** ¿El próximo paso es obvio sin instrucciones adicionales?

---

### Time Sight
**Rol en el sistema:** Anticipa — el usuario sabe en qué momento está el dato, qué pasó antes y qué pasará después.
**Opera en:** Structural (arquitectura de datos) + Behavioral (interacción temporal)
**Dominio primario:** B — Anticipación Operativa
**Refs:** [IG-SYNTH-03], [IG-SYNTH-15], [IG-19]

El cambio de turno no borra el contexto. Cada dato tiene temporalidad visible (qué antigüedad tiene, qué tendencia muestra). Time Scrubbing: capacidad de rebobinar la operación hasta el momento del primer desvío para ver la cadena causal completa. Benchmark: Tesla Fleet. El pilar que define el Dominio B y también el Dominio D (reportería ejecutiva CFO).

> **Pregunta de diseño:** ¿El dato tiene contexto temporal visible — qué antigüedad tiene y qué tendencia muestra?

---

### Omni Sense
**Rol en el sistema:** Distribuye — la información llega por el canal donde el usuario ya está.
**Opera en:** Materialization (canal de entrega) + Behavioral (modalidad de interacción)
**Dominio primario:** C — Asistencia Inteligente
**Refs:** [IG-03], [IG-SYNTH-19], [IG-21], [IG-23]

> **Señal de priorización (post-Touchpoint):** CTO Carlo identificó Omni Sense como potencialmente el pilar más crítico. La predominancia de WhatsApp como herramienta real de decisión en minas valida esta urgencia: si el sistema no está donde el operador ya trabaja, el sistema no existe. [IG-23]

Agnóstico al canal: si la mina usa WhatsApp, el sistema está en WhatsApp. Las decisiones que ocurren fuera del software no se pierden. Extensión manos libres: en terreno, el Jefe de Turno no puede usar las manos — Push-to-Talk y Edge AI son requisitos de diseño no opcionales para este perfil. [IG-21]

> **Pregunta de diseño:** ¿La información llega por el canal donde el usuario ya está, en la modalidad que puede usar?

---

## Criterios de Diseño Internos

Heurísticas del equipo para evaluar decisiones de producto. No son principios del producto — son filtros de decisión internos.

### Reducción de Carga Cognitiva
Cada interacción debe reducir la carga cognitiva, no aumentarla. Si una pantalla genera más preguntas que respuestas, está fallando. Framing aprobado para comunicación con clientes: *"ayúdame a tomar la mejor decisión porque yo no tengo tiempo"* / *"simplificame"* — centrado en eficiencia y confianza en la información, no en abstracción emocional. [CF-12 RESOLVED]

> **Nota:** El concepto original "Paz Mental" fue rechazado como lenguaje de producto/venta por CEO y CTO (IG-SYNTH-16 INVALIDATED). La heurística interna se mantiene bajo un nombre accionable.

### Zero Homer
No implementar features sin evidencia de uso real. Cada funcionalidad debe justificar su existencia con un [IG-XX]. Si no hay evidencia, no se construye. [IG-SYNTH-02]

### D→A→R
Todo flujo de CORE sigue Detección → Análisis → Recomendación. El esqueleto UX validado por los 20 casos de uso del Workshop 01. Sin excepciones. [IG-SYNTH-06]

### Inteligencia Democrática
Cualquier perfil accede a insights sin expertise técnico. De SQL a lenguaje natural. De desktop a bolsillo. De 5 usuarios a 100+ por sitio. [IG-SYNTH-08, IG-SYNTH-09]

### Efecto Suiza
Integración neutral con cualquier OEM, FMS o software de planificación. CORE es el hub que conecta lo que no se conecta, sin exigir abandono de herramientas existentes. [IG-SYNTH-05, IG-05]

### Operational Pull
Diseñar para adopción bottom-up. **Condición crítica:** el operador debe percibir CORE como herramienta de ayuda, no de control. Cuando planificación lo usa para auditar, el operador resiste activamente. El operador debe ver su propio panel antes de que lo vea su jefatura. [IG-SYNTH-17, IG-04, CF-13 PENDING]

---

## Dominios Operativos

Los 4 dominios organizan los casos de uso de CORE. Cada dominio tiene un pilar líder. [IG-18]

### Dominio A — Respuesta a Crisis
**Pilar líder:** Quiet UI
**Descripción:** El operador está en medio de un incidente. El tiempo de percepción es crítico. El sistema filtra ruido y entrega la señal exacta en el momento exacto.
**Casos:** Alertas de desvío geométrico · Alertas de seguridad geotécnica · Reasignación de emergencia
**Refs:** [IG-SYNTH-07], [IG-SYNTH-18], [IG-08]

### Dominio B — Anticipación Operativa
**Pilar líder:** Time Sight
**Descripción:** El sistema sabe qué va a pasar antes de que pase. Convierte datos históricos y en tiempo real en foresight operacional que reduce la incertidumbre del turno.
**Casos:** Briefing de turno · Planificación de secuencias · Time Scrubbing post-turno · Detección temprana de desvíos
**Refs:** [IG-SYNTH-15], [IG-SYNTH-03], [IG-19], [IG-SYNTH-12]

### Dominio C — Asistencia Inteligente
**Pilar líder:** Omni Sense
**Descripción:** El sistema asiste al operador en su contexto. La interfaz se adapta al canal y modalidad del usuario — pantalla, voz, WhatsApp — sin pedir que cambie de herramienta.
**Casos:** Asistencia en terreno (manos libres) · Captura de decisiones en WhatsApp/Radio · TIM Agent conversacional
**Refs:** [IG-03], [IG-21], [IG-SYNTH-19]

### Dominio D — Alineación Estratégica
**Pilar líder:** Clear Path
**Descripción:** Conectar la operación con las finanzas. El CFO y el Gerente de Mina necesitan el camino más corto de datos operacionales a decisiones estratégicas — sin necesitar entender minería ni tecnología. Primera validación externa (Felipe Reyes) confirma: "todo se puede transferir y hablar el lenguaje de dinero — los CFO y controladores lo que les interesa es money." [IG-25]
**Casos:** Reportería ejecutiva CFO · Reconfiguración estratégica (Casos 7-8) · Desconexión mina-planta
**Refs:** [IG-06], [IG-20], [IG-22], [IG-SYNTH-16b], [IG-25]

---

## Propuestas de Valor

### Para operaciones — Plan Compliance (Casos 1-6)
> *"Decisión correcta, con la información correcta, en el canal correcto."*

El operador no toma decisiones a ciegas. CORE reduce el tiempo de detección → análisis → acción de horas a minutos. Cada perfil accede al nivel de detalle que necesita, por el canal donde ya opera. [IG-SYNTH-06, IG-SYNTH-09, IG-22]

### Para estrategia — Plan Optimization (Casos 7-8)
> *"Cuándo y por qué reconfigurar el plan — antes de que el costo sea irrecuperable."*

Cuando el plan subyacente es incorrecto, CORE detecta el momento exacto y sugiere el ajuste estratégico. La rentabilidad no se pierde en incidentes — se pierde en planes mal calibrados que nadie identifica a tiempo. [IG-22, IG-SYNTH-01]

### Para finanzas — CFO (Dominio D)
> *"El impacto financiero de la operación, en tu lenguaje, en tu bolsillo."*

La desconexión mina-planta deja al CFO dependiente de reportes manuales tardíos. CORE cierra ese gap conectando KPIs operacionales con métricas financieras accionables, sin que el CFO necesite entender terminología minera. Validación externa parcial: Felipe Reyes (ex-profesional minero) confirma que el lenguaje de costos/EBITDA es el canal de comunicación que abre puertas con CFOs y controladores. [IG-06, IG-20, IG-SYNTH-16b, IG-25]

---

## Open Questions

### 🔴 Críticas — bloquean diseño
- [ ] ¿El operador resiste CORE porque lo percibe como herramienta de auditoría, o hay otra causa? ¿Cuán generalizado es el fenómeno? → [CF-13]
- [ ] ¿Qué información del operador es visible para él vs. para su jefatura? ¿Cómo se define la política de visibilidad? → [IG-04], [CF-13]
- [ ] ¿Cuál es el workflow específico de Excel/radio que CORE reemplaza en cada perfil? → [IG-05]

### 🟠 Importantes — antes de Etapa 3
- [ ] ¿Unit economics del modelo SaaS? CAC, LTV, márgenes, breakdown de revenue → [CF-08]
- [ ] ¿Cómo se mide el valor por decisión individual para demostrar ROI del ticket USD 450K? → [IG-11], [CF-08]
- [ ] ¿Framework formal configuración vs. extensión vs. custom? → [CF-05]
- [ ] ¿Qué KPIs financieros necesita el CFO diariamente? Umbral mínimo de drill-down → [IG-20], [CF-08]
- [ ] ¿Cuál es el modelo de datos que une operaciones con finanzas? → [IG-06]

### 🟡 Técnicas — validar en Etapa 2
- [ ] ¿Requisitos de Edge AI? Conectividad mínima y latencia máxima aceptable en faena → [IG-21]
- [ ] ¿Granularidad óptima del Time Scrubbing? ¿Por minuto, por evento, por turno? → [IG-19]
- [ ] ¿Bloqueantes técnicos para migración a CORE? APIs, modelos de datos, backend headless → [CF-11]
- [ ] ¿Estándares WCAG aplicables a cada pilar en contexto de terreno? → [CF-10]

<!-- Updated by /spec on 2026-02-26 -->
