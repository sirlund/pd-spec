# Gemini vs PD-Spec — Comparación de Outputs (TIMining)

> Fecha: 2026-02-14
> Contexto: 3 documentos + 1 prototipo funcional generados por Gemini comparados contra 115 insights verificados extraídos por PD-Spec de las mismas fuentes (aprox.), más 6 outputs HTML generados por /ship.
>
> **Contexto de uso:** Los documentos Gemini alimentan un proyecto de consultoría UX/UI con IDEMax. El entregable esperado son prototipos aspiracionales de cómo podría verse CORE.
>
> **Proceso de generación:** Los conceptos de diseño (Quiet UI, Achromatic Design, benchmark de referentes) NO son invenciones espontáneas de Gemini — son resultado de un **benchmark UX multi-sesión** (3+ iteraciones con Deep Research y Pro mode) donde los prompts definían criterios de búsqueda explícitos. Algunos prompts fueron co-generados con NotebookLM, otros generados por un chat de Gemini para alimentar otro chat. El usuario orquestó las iteraciones. Se investigaron ~32 referentes de industrias como cybersecurity, fintech, gaming, aviónica, logística, defensa, robótica, automoción y productividad, seleccionando 14 para el documento final.

## Documentos evaluados

| # | Documento Gemini | Largo | Tipo |
|---|---|---|---|
| G1 | Estrategia Maestra TIMining CORE v3.4 | ~15K chars | Estrategia + UX + Benchmark + Casos de Uso |
| G2 | GEMINI consultant.docx | ~19K chars | Interpretación de bocetos + framework de presentación |
| G3 | DOSSIER MAESTRO: Ecosistema Estratégico TIMining 2026 | ~8K chars | Base de conocimiento corporativa |
| G4 | t-core_prototype (React app) | ~500 líneas JSX | Prototipo funcional — dashboard operación minera |

---

## 1. Lo que Gemini captura BIEN (respaldado por insights PD-Spec)

### 1.1 Propuesta de valor core

| Claim Gemini | Insight PD-Spec | Veredicto |
|---|---|---|
| "Brecha Geométrica" — minero ve camioncitos pero no contexto geológico | IG-19: Exactamente lo mismo, cita de fuente | Respaldado |
| Real-Time Topography Inference sin hardware costoso | IG-96: Misma descripción, misma fuente | Respaldado |
| "Efecto Suiza" — integrador neutral, OEMs no integran entre sí | IG-91: Mismo concepto, misma fuente (Narrativa CCB) | Respaldado |
| $10M+ valor capturado en 3 minas Chile | IG-61: Idéntico, fuente Design Brief | Respaldado |
| $6M campaña única Ene-May 2025 | IG-62: Idéntico | Respaldado |
| -15% → +7% accuracy Cu Fine | IG-65: Idéntico | Respaldado |
| Plan minero se pierde en cada turno | IG-42: Idéntico, fuente Workshop transcript | Respaldado |

### 1.2 Producto y tecnología

| Claim Gemini | Insight PD-Spec | Veredicto |
|---|---|---|
| Aware = gemelo digital, Orchestra = simulación | IG-01, IG-02, IG-100: Consistente | Respaldado |
| Stack fragmentado (C++, Unity, Go, Python) | IG-16: Idéntico, fuente reu COO | Respaldado |
| No auth unificado | IG-17: Idéntico | Respaldado |
| Cruces manuales de BD en vez de APIs | IG-18: Idéntico | Respaldado |
| Orchestra: solo 30% usa funciones avanzadas | IG-104: Idéntico, fuente entrevista PM Orchestra | Respaldado |
| AI Copilot TIM con Google Gemini | IG-67 a IG-75: 15 interacciones documentadas | Respaldado |
| ARIS integra 30+ tipos de instrumentos | IG-30: Idéntico | Respaldado |
| ARIS no cobra por instrumento adicional | IG-35: Idéntico | Respaldado |

### 1.3 Problemas y desafíos

| Claim Gemini | Insight PD-Spec | Veredicto |
|---|---|---|
| Confusión timing datos Aware | IG-05: Idéntico con detalle de frecuencias | Respaldado |
| Capacitaciones largas → abandono | IG-06: Idéntico | Respaldado |
| Trampa customización "Homer Car" | IG-08, IG-22, IG-23, IG-39: Múltiples refs | Respaldado |
| Concentración conocimiento en "Carlo" | IG-110: Idéntico, fuente entrevista Ana | Respaldado |
| Ciclos venta 1+ año | IG-45, IG-51, IG-52: Múltiples refs | Respaldado |
| Alta carga consultiva (30-36h/renovación) | IG-09, IG-10: Idéntico con métricas | Respaldado |

### 1.4 Workshop y retro

| Claim Gemini | Insight PD-Spec | Veredicto |
|---|---|---|
| 20 escenarios de crisis documentados | IG-79: Idéntico | Respaldado |
| KEEP/STOP/START retro completa | IG-80, IG-81, IG-82: Desglosado atómicamente | Respaldado |
| "Desplanificadómetro" | IG-83: Idéntico | Respaldado |
| Concepto "Skynet" (autonomía gradual) | IG-78, IG-115: Respaldado | Respaldado |
| Multimodalidad (WhatsApp, radio, chat, Aware) | IG-48: Idéntico | Respaldado |
| "Paz mental" del operador | IG-47: Consistente, fuente Workshop transcript | Respaldado |

### 1.5 Estrategia y negocio

| Claim Gemini | Insight PD-Spec | Veredicto |
|---|---|---|
| ~$5M ARR, márgenes altos | IG-89: Idéntico | Respaldado |
| 80%+ growth target 2026 | IG-87: Idéntico | Respaldado |
| 100+ usuarios activos mensuales por faena | IG-92: Idéntico | Respaldado |
| Gap audiencia CFO | IG-49: Idéntico | Respaldado |
| Pricing desconectado del valor | IG-94: Idéntico | Respaldado |
| Meta $450K por implementación | IG-43: Idéntico, fuente Workshop | Respaldado |
| Adopción bottom-up | IG-92: Idéntico | Respaldado |

**Conclusión sección 1:** ~65-70% del contenido de Gemini está sólidamente respaldado por las mismas fuentes. Gemini capturó los hechos principales correctamente. Las secciones de recomendaciones de diseño (sección 2) suman otro ~15% que, si bien no viene del research, ha sido validado por el equipo de consultoría UX.

---

## 2. Lo que Gemini AGREGA (benchmark UX multi-sesión, no hallazgos de research)

Los conceptos de diseño en la Estrategia Maestra v3.4 no son "invenciones" aleatorias de Gemini — son el resultado de un **benchmark UX estructurado en 3+ iteraciones** con prompts explícitos. El proceso fue:

| Iteración | Modo | Dimensiones | Referentes | Foco |
|---|---|---|---|---|
| v1.0 | Deep Research | 4 → 5 | 4 → 11 | Mecánicas UX específicas (Fog of War, Timeline, Exception Mgmt) |
| v1.1 | Deep Research | 8 | 8 | + Aviónica (Garmin), F1 telemetría, búsqueda forense (Verkada) |
| v2 | Deep Research | 5 pilares | 7 | Diseño agéntico, multi-agent orchestration, estética B2B premium |
| v3 (Pro) | Gemini Pro | 5 criterios | 6 | Anduril Lattice OS, Wiz Security Graph, Ramp autonomous policy |
| v3+ (Pro) | Gemini Pro | 4 categorías "de deseo" | 8 | Compound, Arc, Foxglove, SpaceX Dragon HMI, Railway, Axiom, Polestar, Rivian |

Los prompts fueron co-generados con NotebookLM y en algunos casos un chat de Gemini generó el prompt para otro chat. El usuario orquestó las iteraciones y los criterios de búsqueda. La iteración v3+ expandió la búsqueda a categorías aspiracionales (Institutional Trust, Mission Control, Next-Gen DevTools, Automotive/HMI) — estos referentes NO figuran en la Estrategia Maestra v3.4 pero alimentaron la visión de diseño del equipo.

### 2.1 Principios de diseño: origen real en el benchmark

| Concepto | Origen en el benchmark | Conexión con insights TIMining |
|---|---|---|
| "Quiet UI" (gestión por excepción) | **Criterio de búsqueda explícito** en prompt v2. Investigado en Datadog, CrowdStrike, Linear. Linear reconocido como referente absoluto en comunidad de diseño. | IG-47 ("paz mental"), IG-80 ("no más data sin sentido"). Validado por IDEMax — el que mejor pegó. |
| "Achromatic Design" (escala grises) | CrowdStrike v3 Pro: "consola aburrida por diseño, reduce fatiga del analista que pasa 12h frente al monitor". Regla: 95% gris/negro/blanco, color solo para anomalía. | IG-80 ("reducir ruido información"). |
| "Progressive Disclosure" | StarCraft II Fog of War (v1.0). Prompt sugería StarCraft/AoE explícitamente como referentes. Patrón estándar UX. | IG-06 (capacitación progresiva), IG-81 ("capacitación según perfil"). |
| "Glanceable Intelligence" | Síntesis de Datadog Host Maps (v1.1: "evaluar flota de 500 unidades en 1 segundo") + Garmin Synthetic Vision (v1.1). | IG-56 (visualización de datos cambia decisiones). |
| "GameTech: Starcraft/Warcraft" | **Sugerido en prompt v1.0** como referente de Revelación Progresiva. No fue idea espontánea de Gemini. | IG-101 (Carolina menciona videojuegos como referente). |
| "Estética iPhone-like para B2B" | **Criterio de búsqueda** en prompt v2: "visuales limpios, micro-interacciones pulidas que justifiquen ticket USD 450k+". Referentes: Ramify, Qonto, Wealthsimple. | IG-43 (meta $450K por implementación). |
| "Soberanía del Silencio" | Naming de Gemini para el concepto de Quiet UI. La idea subyacente es de CrowdStrike/Datadog. | IG-80 ("reducir ruido, foco esencial"). |
| "The Delta" (F1 Telemetry) | McLaren Atlas (v1.1): barra que muestra rendimiento actual vs óptimo en tiempo real. | IG-83 — es el **Desplanificadómetro** visualizado. |
| "Threaded Assets" | **Criterio de búsqueda** en prompt v2. Investigado en Linear, Figma, Flexport. Comunicación anclada al objeto, no en canal externo. | IG-76 (contexto turno anterior sin WhatsApp). |
| "Numerical Stillness" | Compound (v3+): números en gran escala con pesos tipográficos ligeros. "El estado no grita; respira." | IG-56 (visualización cambia decisiones). Aplicable a OEE/tonelaje. |
| "Critical Glow Zones" | SpaceX Dragon HMI (v3+): interfaz 100% oscura, solo bordes activos emiten glow sutil. | IG-47 ("paz mental"). Patrón para fatiga + polvo en mina. |
| "Infrastructure as Graph" | Railway (v3+): grafos conectados que se iluminan con tráfico en vez de tablas de activos. | Aplicable a red de camiones — "pulso visual" de flota. |
| "2-Tap Rule" | Polestar Android Automotive (v3+): nada a más de 2 toques, tarjetas grandes para visión periférica. | IG-81 (capacitación según perfil). Patrón para operador en terreno. |

### 2.2 Branding y narrativa de Gemini

| Concepto | Origen | Nota |
|---|---|---|
| "Agente de Inteligencia Espacial" | Branding de Gemini. Nadie en TIMining usó este término. | Naming aspiracional. Útil para posicionamiento si el equipo lo adopta. |
| "Médico Operacional que diagnostica y prescribe" | Del workshop — Carlos dijo textual: "somos mucho más parecido a un médico, diagnosticador". PD-Spec lo capturó en [IG-55] y Design Principle #4. | Respaldado. Gemini lo capturó fielmente. |
| "Kiosco de Datos → Médico Operacional" | El concepto "médico" viene del workshop. El arco narrativo "kiosco → médico" es elaboración de Gemini. | Buen framework narrativo para presentaciones. |
| "El Fin de los Gráficos de Vanidad" | Headline de Gemini. El insight subyacente (IG-80: "no gráficos sin propósito") es real. | Buen naming para el concepto. |
| "Trazabilidad Contextual" como pilar | Gemini elevó un concepto operacional a "pilar de diseño". | Naming útil para consultoría UX. |

### 2.3 Benchmark de referentes de diseño (~32 empresas investigadas → 14 seleccionadas)

La sección 3 de G1 consolida 14 referentes con "Factor X de Diseño" por empresa. Estos vienen de un proceso iterativo documentado:

**Proceso de investigación (3+ sesiones Gemini):**
- v1.0: StarCraft II, Adobe Premiere, Samsara, Datadog, Hexagon, EVE Online, TradingView, PagerDuty, NVIDIA Omniverse, Palantir AIP
- v1.1: + Garmin G3000 (aviónica), F1 McLaren Atlas, Verkada, UniFi Protect
- v2: + SentinelOne, Motive, Chronosphere, Linear, Ramify, Vercel v0, CrowdStrike
- v3 Pro: + Anduril Lattice OS, Wiz, Ramp, Flexport, QuantConnect
- v3+ Pro ("Desire Expansion"): + Compound, Arc, Foxglove, SpaceX Dragon HMI, Railway, Axiom, Polestar, Rivian Gear Guard

Total: ~32 referentes únicos investigados, 14 seleccionados para la Estrategia Maestra. Los 8 extras de v3+ (los más aspiracionales: SpaceX, Polestar, Foxglove) no llegaron al doc final pero alimentaron la visión de diseño.

**Veredicto:** Este es un benchmark de UX/diseño de interfaces legítimo, no name-dropping:
- Los prompts definieron criterios de búsqueda explícitos (Quiet UI, gestión por excepción, visión temporal, etc.)
- Cada referente fue analizado por su "Factor X" de diseño con aplicabilidad a minería
- Las empresas son reales y las descripciones de sus patrones UX son verificables
- La iteración v3+ expandió a categorías aspiracionales (defensa, robótica, automoción EV, devtools) con patrones concretos: "Numerical Stillness", "Critical Glow Zones", "Infrastructure as Graph", "2-Tap Rule"
- **NO es benchmark de negocio ni competitivo** — es inspiración de patrones de diseño de otras industrias
- Es exactamente el tipo de input que IDEMax necesita para prototipos aspiracionales

**Diferencia con QA-54:** Nuestro BENCHMARK.html presenta comparaciones como "análisis competitivo de mercado" (engañoso — no hay research real). Gemini presenta referentes de diseño inter-industria (honesto para su contexto de consultoría UX).

**Nota:** Los claims específicos sobre features de Hexagon, Datamine, Indimin en OTRAS secciones del doc sí merecen verificación — ahí Gemini puede estar embelleciendo sobre competidores directos.

---

## 3. Lo que está INFLADO o no verificable

| Claim | Problema | Gravedad |
|---|---|---|
| "Modelo Freemium: Aware 300k, Platform 400k+" | Puede venir de contexto extra de NotebookLM. No verificable con nuestras fuentes. IG-43 confirma $450K target pero no el modelo freemium. | Media |
| "Interoperabilidad Total" | Claim genérico sin evidencia específica. IG-13 dice "agnóstico al hardware" que es más preciso. | Baja |
| "Escalabilidad Cloud-Native" | No hay evidencia en fuentes. | Media |
| "Lock-in operativo" como estrategia | Gemini sugiriendo estrategia. No es un hallazgo. | Media |
| "Gobernanza de Datos Automática" | Gemini inventando value prop. | Media |
| Atributos específicos de Hexagon, Datamine, Modular Mining | Gemini sabe de estas empresas pero no hizo benchmark real. | Alta — mismo riesgo QA-54 |
| "OMF (Open Mining Format)" como estándar usado | Referencia técnica no verificable con nuestras fuentes. | Baja |
| "Indimin: Smart Mining Coach, gamificación para chofer" | Gemini describe competidor con detalle no verificable. | Media |

---

## 4. Lo que Gemini tiene y PD-Spec NO (fuentes adicionales de NotebookLM)

El Dossier Maestro (G3) contiene datos corporativos que no están en `01_Sources/` del branch test-timining:

| Dato | Fuente probable | Acción sugerida |
|---|---|---|
| "Fundada en 2011 por Nicolás Jubera" | Info corporativa pública | Agregar fuente si relevante |
| "Serie B: USD 10M, Kayyak Ventures" | Info corporativa / pitch deck | Agregar como fuente de negocio |
| "Cap Table: Komatsu + Familia Luksic" | Info confidencial / pitch deck | Agregar si disponible |
| "Komatsu es dueño de Modular Mining (competencia)" | Info pública mercado | Relevante para benchmark real |
| "Roberto Catalán = COO" | Organigrama interno | Agregar a _CONTEXT.md |
| "Carlos Calderón = CTO/Founder" | Organigrama (= "Carlo" en IG-110) | Confirma identidad |
| "Carolina R., Ernesto P., Roberto C." | Entrevistados internos | Ya referenciados en insights |
| Arquetipos de usuario detallados (4 perfiles con flujos) | Dossier IDEMAX interno | Valioso para /ship persona |

**Recomendación:** Si estas fuentes existen como documentos, agregarlas a `01_Sources/` y correr `/analyze` para capturar los insights faltantes (datos corporativos, cap table, organigrama, benchmark real).

---

## 5. Lo que PD-Spec captura y Gemini NO

| Aspecto | PD-Spec | Gemini |
|---|---|---|
| **Trazabilidad por claim** | Cada insight tiene [IG-XX] + fuente exacta | Cero trazabilidad. Todo se presenta al mismo nivel de autoridad. |
| **Distinción dato vs opinión** | Solo insights de fuentes reales entran a INSIGHTS_GRAPH | Mezcla hallazgos con recomendaciones sin distinguir |
| **Detección de conflictos** | 6 conflictos detectados (CF-01 a CF-06) con resoluciones | Cero. Gemini no detecta contradicciones entre fuentes. |
| **Atomicidad** | 115 claims individuales verificables | Narrativa continua donde un párrafo puede contener 5 claims |
| **Estado actual vs aspiracional** | IG-111 a IG-115 marcan explícitamente el GAP | Gemini mezcla producto actual y visión futura sin distinguir |
| **Métricas precisas** | IG-63: "-2.4 min cycle time", IG-64: "+130 loads/día" | Las mismas métricas pero embebidas en narrativa |
| **Versionado** | doc-meta con changelog en outputs HTML | Sin versionado visible |
| **Reproducibilidad** | Mismas fuentes → mismos insights (determinístico) | Depende del prompt y contexto de NotebookLM |

---

## 6. Análisis por documento

### G1: Estrategia Maestra v3.4

**Lo mejor:** Los 4 dominios estratégicos con los 20 casos de uso del workshop están bien estructurados y respaldados. La sección KEEP/STOP/START es precisa. Los principios de diseño (Quiet UI, Achromatic Design, Progressive Disclosure) son resultado de un benchmark UX multi-sesión documentado (~32 referentes investigados en 4+ iteraciones con prompts estructurados). No son ideas aleatorias — fueron investigados en productos reales (CrowdStrike, Datadog, Linear, Anduril, SpaceX, Polestar, F1 telemetry) y validados por IDEMax. El concepto "Médico Operacional" viene directo del workshop (Carlos).

**Lo peor:** Claims sobre competidores directos (Hexagon, Datamine, Indimin) pueden estar embellecidos. La línea entre hallazgo de fuentes TIMining y resultado del benchmark UX externo sigue invisible — el lector no sabe qué viene del research del proyecto y qué del benchmark inter-industria.

**Porcentaje estimado de respaldo:** ~70% hallazgos de fuentes TIMining, ~20% benchmark UX investigado (validado por equipo consultor), ~10% inflado o no verificable.

### G2: GEMINI consultant

**Lo mejor:** El framework de presentación secuencial (5 actos) es profesional y usable. La guía de workshop (4 actividades) es práctica y aplicable.

**Lo peor:** Es el doc más "inflado" de los tres. Gemini actúa como "Mentor Estratégico" generando frameworks y recomendaciones que suenan impresionantes pero son genéricas. Frases como "No estamos implementando software; estamos construyendo un sistema de anticipación" son poesía del modelo.

**Porcentaje estimado de respaldo:** ~50% respaldado, ~35% recomendaciones, ~15% inflado.

### G3: Dossier Maestro

**Lo mejor:** El más confiable de los tres. Datos corporativos específicos (funding, cap table, personas). Producto ecosystem bien mapeado. Diagnóstico UX honesto. Competitive positioning con "Efecto Suiza" bien explicado.

**Lo peor:** Algunos claims competitivos sobre Hexagon/Datamine no verificables. El "modelo freemium" puede ser invención.

**Porcentaje estimado de respaldo:** ~80% respaldado, ~10% recomendaciones, ~10% no verificable.

### G4: Prototipo funcional (t-core_prototype)

Gemini no se quedó en documentos — generó un **prototipo funcional en React** que implementa los patrones investigados en el benchmark. Esto cierra el ciclo completo: fuentes → estrategia → benchmark UX → código ejecutable.

**Stack:** React 19 + Vite + Tailwind CSS 4 + Lucide icons. Un solo `App.jsx` (~500 líneas). Desplegado en Vercel.

**Lo que implementa:** Dashboard fullscreen de operación minera ("BATIMETRÍA // SECTOR 4") con:
- Visualización topográfica con contornos orgánicos generados proceduralmente (SVG + funciones de ruido)
- 3 activos de flota (CAT 797F, P&H 4100, Komatsu 930E) con telemetría en vivo
- Sidebar contextual con event log anclado al activo seleccionado (Threaded Assets)
- Timeline interactivo con Hindsight/Live/Foresight (Time Scrubbing)
- Modal de seguridad hold-to-confirm para autorizaciones críticas
- KPI de OEE (84.2%) con tipografía ligera (Numerical Stillness)

**Patrones del benchmark materializados:**

| Patrón | Referente original | Implementación en prototipo |
|---|---|---|
| Achromatic Design | CrowdStrike | 95% gris/negro, cyan como único acento |
| Quiet UI | Datadog/Linear | Fondo oscuro = normal, color solo en anomalía |
| Critical Glow Zones | SpaceX Dragon HMI | Pulsing rojo para health crítico |
| Numerical Stillness | Compound | OEE y elevación: números grandes, peso tipográfico ligero |
| Time Scrubbing | Premiere Pro/Tesla | Timeline draggable con zonas pasado/presente/futuro |
| Threaded Assets | Linear/Figma | Event log en sidebar anclado al activo |
| Hold-to-Confirm | Patrón seguridad | Modal con barra de progreso para autorizar intervención |

**Lo que NO implementó aún:** Environmental State Shadows (Rivian), Infrastructure as Graph (Railway), búsqueda forense (Verkada), 3D scrubber (Foxglove).

**Autenticidad minera:** Coordenadas reales (23.64S / 70.40W), equipos reales (CAT, Komatsu, P&H), métricas del dominio (tonelaje, presión neumáticos, OEE), alerta predictiva de falla de suspensión con probabilidad (94%).

**Veredicto:** El prototipo demuestra que los patrones del benchmark no son teóricos — son implementables. Es un tipo de output que PD-Spec no genera: código funcional que traduce insights y principios de diseño en una interfaz tangible. Para el contexto de consultoría IDEMax (prototipos aspiracionales), este es exactamente el entregable esperado.

---

## 7. Conclusiones

### Gemini hizo bien:
1. **Capturó los hechos core correctamente** — brecha geométrica, efecto Suiza, métricas de valor, problemas UX, metáfora del médico operacional
2. **Ejecutó un benchmark UX riguroso** — 4+ iteraciones, ~32 referentes inter-industria (cybersecurity, fintech, gaming, aviónica, F1, defensa, robótica, automoción EV, devtools), con prompts estructurados y criterios explícitos. El resultado (Quiet UI, Achromatic Design, Threaded Assets, Timeline Scrubbing, The Delta, Critical Glow Zones, Numerical Stillness) es genuinamente útil para la consultoría IDEMax.
3. **Cerró el ciclo con un prototipo funcional** — no se quedó en documentos: generó un dashboard React que implementa concretamente 7 de los patrones investigados. Para consultoría UX (prototipos aspiracionales), este es el entregable que importa.
4. **Estructuró bien la narrativa** — los docs son legibles y presentables para stakeholders
5. **El Dossier Maestro es una buena base de conocimiento** — honesto, específico, útil
6. **Los casos de uso del workshop están bien organizados** — 4 dominios es una buena taxonomía

### Gemini hizo mal:
1. **No distingue dato de opinión** — recomendaciones de diseño y hallazgos de research se presentan con la misma autoridad. En el contexto de consultoría UX esto es aceptable, pero para toma de decisiones de producto es riesgoso.
2. **No detecta contradicciones** — PD-Spec encontró 6, Gemini encontró 0
3. **No marca aspiracional vs actual** — mezcla producto real con visión futura (PD-Spec lo marca en IG-111 a IG-115)
4. **No tiene trazabilidad** — imposible verificar qué viene de dónde
5. **Frases de efecto** — "Soberanía del Silencio", "Fin de los Gráficos de Vanidad" funcionan como naming/branding pero no como datos

### Qué puede aprender PD-Spec de Gemini:
1. **Narrativa** — Gemini cuenta historias. PD-Spec produce listas de IDs. El Research Dashboard (BL-12) debería cerrar este gap.
2. **Benchmark UX inter-industria** — el proceso de investigar patrones de diseño en otras industrias (cybersecurity, gaming, fintech, aviónica, F1, defensa, robótica, automoción EV) y traducirlos al dominio del proyecto es un tipo de output que PD-Spec no tiene. Un `/ship benchmark-ux` podría ser valioso, con la distinción explícita de que son referentes de diseño, no análisis competitivo.
3. **Naming de conceptos** — Gemini es bueno para nombrar patrones: "Quiet UI", "Threaded Assets", "The Delta", "Glanceable Intelligence". Estos nombres facilitan la comunicación en equipos de consultoría. PD-Spec podría incorporar naming en los Design Principles del SYSTEM_MAP.
4. **Arquetipos de usuario** — G3 define 4 perfiles con flujos. PD-Spec debería capturar esto en /ship persona (BL-03).
5. **Guía de workshop** — la estructura de actividades de G2 es práctica. PD-Spec no tiene nada equivalente.
6. **Multi-sesión iterativa** — Gemini permite iterar: un chat genera el prompt para otro chat. El benchmark evolucionó de 4 a 32 referentes en 4+ sesiones. PD-Spec podría soportar un flujo similar donde `/analyze` alimenta iteraciones sucesivas con preguntas refinadas.
7. **Prototipado funcional** — Gemini generó código ejecutable (React) desde los mismos insights. PD-Spec genera documentos HTML estáticos. Un `/ship prototype` que genere componentes interactivos basados en los Design Principles del SYSTEM_MAP sería un salto significativo — aunque entra en territorio de PD-Build.

### Qué puede aprender Gemini de PD-Spec:
1. **Trazabilidad** — si Gemini pusiera `[fuente: Workshop transcript]` en cada claim, sería 10x más confiable
2. **Detección de conflictos** — analizar tensiones entre fuentes, no solo sintetizar
3. **Separar dato de prescripción** — marcar explícitamente qué es hallazgo y qué es recomendación del modelo
4. **Versionado** — qué cambió entre versiones y por qué
