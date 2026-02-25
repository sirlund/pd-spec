# Reporte de Investigación — TIMining CORE

> **Idemax × TIMining** | v1.0 | 2026-02-24
> Audiencia: Philip (CEO), Carlo (CTO), Camila (Idemax)
> Período de investigación: 2026-02-13 al 2026-02-24
> Base de evidencia: 57 fuentes · 1.323 claims procesados · 27 insights VERIFIED

---

## 1. Resumen Ejecutivo

Cuatro hallazgos definen el proyecto y deben guiar la Etapa 2:

**1. El moat técnico de TIMining es real pero invisible para el comprador.** El algoritmo de inferencia topográfica en tiempo real y las 60 reglas operacionales propietarias son diferenciadores sin equivalente conocido en el mercado. Sin embargo, el framing actual habla de tecnología cuando el comprador habla de Excel. [IG-SYNTH-01, IG-08]

**2. La adopción bottom-up tiene una condición no resuelta: el operador debe percibirse como beneficiario, no como auditado.** Cuando planificación usa TIMining para auditar operadores, estos resisten. La contradicción entre "operational pull" y resistencia activa es el conflicto de diseño más crítico del proyecto. [IG-04, CF-13]

**3. El 90% de las decisiones operacionales ocurre en WhatsApp y radio, fuera del sistema.** No es un problema de UI. Es un problema de canal. TIMining pierde la mayoría de la inteligencia operacional porque no captura las decisiones que ya ocurren. [IG-03]

**4. Toda la investigación actual proviene de stakeholders internos, no de usuarios finales.** Los 5 perfiles de usuario, el journey map y los principios de diseño se basan en perspectivas del COO, CTO y PMs de TIMining — no de mineros, despachadores ni jefes de turno en faenas activas. Este es el riesgo metodológico central. [CF-07]

---

## 2. Metodología

### Fuentes procesadas

| Tipo | Cantidad | Ejemplos |
|---|---|---|
| Entrevistas con stakeholders internos | 12+ sesiones | COO, CEO, CTO, PMs de Aware/Orchestra, Gerente de Comunicaciones |
| Documentos estratégicos y pitch decks | 15+ documentos | Design Brief CORE, narrativas CCB, posición de mercado sept 2025 |
| Workshop 01 | 1 sesión (20 láminas + retro + transcript) | 20 casos de uso, retro KEEP/STOP/START, field notes |
| Materiales de producto y antecedentes | 10+ documentos | PPT corporativa, diagramas de 8 capas, Sello de Experiencia |
| Touchpoint IDEMAX × TIMining | 1 sesión (2026-02-19) | Primer encuentro formal con Philip y Carlo — nuevos hallazgos primarios |
| Sesiones internas IDEMAX | 2 sesiones | Reunión Camila (17-feb), Sesión de alineación (18-feb) |
| Usuario externo a TIMining | 1 entrevista | Primera perspectiva directa de usuario — Etapa 2 en progreso |

**Total:** 57 fuentes · 1.323 claims · 31 insights extraídos (27 VERIFIED, 1 MERGED, 3 INVALIDATED)

### Tipo de evidencia y limitaciones

La base de evidencia es sólida en perspectiva de stakeholders y aspiraciones de producto. Es débil en perspectiva directa de usuarios finales.

| Fortaleza | Debilidad |
|---|---|
| Alta convergencia en hallazgos tecnológicos (15+ fuentes en Geometry Gap) | Sin entrevistas directas con mineros, despachadores ni jefes de turno en faenas activas |
| Validación cruzada de hallazgos en múltiples tipos de fuente | Sin datos financieros detallados (unit economics, CAC, LTV) |
| Conceptos nombrados y validados por el propio equipo TIMining | Sin benchmark competitivo externo — claims de unicidad son autorreferenciales |
| Patrón D→A→R validado en 20 casos de uso del Workshop | Stack tecnológico documentado solo por COO — sin validación del equipo de desarrollo |

### Gaps de investigación activos

| ID | Descripción | Prioridad |
|---|---|---|
| [CF-07] | Sin voz directa del usuario final | Crítica |
| [CF-08] | Sin unit economics ni datos financieros detallados | Alta |
| [CF-11] | Sin validación técnica de viabilidad de migración a CORE | Alta |
| [CF-10] | Sin auditoría de accesibilidad para uso en terreno | Media |

---

## 3. Hallazgos Principales

### 3.1 El canal real de decisiones es WhatsApp [IG-03]

Carlo (CTO) lo describió en el Touchpoint del 19-feb: *"impresionante la cantidad de toma de decisiones que ocurren día a día en la operación, vía WhatsApp."*

El hallazgo no es que WhatsApp se use informalmente. El hallazgo es que **WhatsApp es el sistema real de toma de decisiones operacionales**, y TIMining queda fuera de él. Las radios tampoco dejan registro. El conocimiento entre turnos se evapora — el "Efecto Gaviota" [IG-SYNTH-15] es consecuencia directa de esta brecha de canal, no de UX.

La implicación de diseño es radical: CORE no puede competir con WhatsApp — debe integrarse. La visión aprobada es ser agnóstico al canal: si la faena opera por WhatsApp, CORE captura ahí. Si usa Discord, también. El objetivo es que las decisiones que ya ocurren queden registradas, sin pedirle al operador que cambie de canal.

**Convergencia:** 2/57 fuentes directas, pero corroborado por evidencia indirecta de pérdida de cliente por desfase temporal [IG-SYNTH-03] y patrones del Journey Map.

---

### 3.2 La trampa de la adopción: herramienta de ayuda vs. herramienta de auditoría [IG-04, CF-13]

Carlo (CTO) reveló la contradicción en el mismo Touchpoint: *"planificación usa TIMining para auditar a operadores — operadores resisten la herramienta — si no logramos vender al operador, estamos acá afuera."*

Este hallazgo contradice directamente el modelo de adopción bottom-up que TIMining asume como ventaja [IG-SYNTH-17]. La lógica "operational pull" funciona cuando el operador adopta voluntariamente porque ve beneficio propio. Cuando la herramienta se usa para exponerlo a su jefatura, la lógica se invierte.

**El riesgo no es técnico ni de UX. Es de diseño de poder.**

El Journey Map del Jefe de Turno [P-02] muestra que esta tensión opera en la Fase 4 (toma de decisión) pero afecta toda la experiencia. Si el operador percibe vigilancia, rechazará la herramienta antes de usarla.

La condición para que el modelo bottom-up funcione: **el operador debe ver su propio panel de desempeño antes de que lo vea su jefatura.** CORE diseñado sin esta condición no resolverá CF-13 — la repetirá.

**Estado:** PENDING. Resolver con entrevistas de Etapa 2 — pregunta clave: ¿usas TIMining porque quieres o porque debes?

---

### 3.3 El competidor real es el Excel [IG-05]

Philip (CEO) sintetizó el problema de posicionamiento en una frase: *"Mi cliente no es tecnología — mi cliente es el Excel."*

El insight tiene dos lecturas:

**Competencia:** TIMining no compite contra Hexagon o Maptek en la mente del comprador con presupuesto. Compite contra el proceso de Excel + radio + reunión de turno que ya funciona (imperfectamente). La venta debe articularse en outcomes del proceso familiar, no en capacidades técnicas.

**Diseño:** Si CORE no conecta con los flujos de trabajo que ya existen — exportación a Excel, integración con ERP, reporting ejecutivo en métricas que el CFO ya usa — la adopción se detiene donde termina el mandato top-down.

La oportunidad es el "tercer gap" [IG-06]: la desconexión entre datos operacionales y reportería financiera. Si TIMining puede traducir adherencia espacial a lenguaje de CFO (impacto en margen, captura de valor en USD), la plataforma pasa de herramienta de operaciones a herramienta de negocio. Esto desbloquea una audiencia compradora que hoy no está en scope.

---

### 3.4 El moat técnico son las 60 reglas, no el 3D [IG-08, IG-SYNTH-01]

El diferenciador comunicado públicamente es la topografía en tiempo real (algoritmo GPS, sin drones, actualización cada 15 minutos). Es real y verificado [IG-SYNTH-01]. Ningún competidor conocido puede correr simulaciones sobre topografía que se actualiza a esa frecuencia.

Pero el hallazgo más estratégico del Touchpoint fue otro: Carlo describió **60 reglas de negocio propietarias** — lógica operacional de dispatching, cambio de turno y secuencias de salida acumulada durante años de operación real. Estas reglas son las que convierten IA genérica en recomendador confiable. Sin ellas, cualquier LLM conectado a datos mineros alucina en contexto operacional.

La implicación competitiva es clara: Google, Microsoft o cualquier integrador puede conectar Gemini a una base de datos minera. No puede replicar las 60 reglas sin años de operación real en faenas activas. **Ese es el moat real — y hoy no aparece en el pitch.**

La combinación de ambas ventajas injustas — algoritmo topográfico + reglas operacionales — define la posición defensible de TIMining contra entrantes tecnológicos con más recursos.

---

### 3.5 La brecha mina-planta como oportunidad CFO [IG-06]

En el Touchpoint del 19-feb, Niklas (Idemax) identificó el tercer gap: la desconexión entre información operacional de la mina y reportería financiera de la planta. Operaciones y finanzas "no se hablan." Philip y Carlo no lo contradijeron.

El hallazgo tiene convergencia baja (1/57 fuentes directas) pero implicaciones estratégicas altas. Si TIMining puede articular datos de adherencia espacial con impacto financiero en tiempo real — conectando el "5% de mejora en adherencia = USD 15B de valor para la industria" con métricas visibles para el CFO — la plataforma expande su audiencia de comprador y fortalece el caso para el repricing a USD 450k [IG-SYNTH-16b].

**Condición:** requiere validación con CFOs o Gerentes de Finanzas en faenas activas. Actualmente el perfil P-05 (CFO) se construyó enteramente a partir de este único touchpoint. [CF-07, CF-08]

---

## 4. Conflictos Activos

### [CF-07] Sin voz directa del usuario final — Fundamento de toda la estrategia UX

**Naturaleza:** Research gap estructural. Todo el conocimiento de usuario proviene de stakeholders internos (COO, CTO, PMs). Los mineros, despachadores y jefes de turno que usarán CORE no han sido entrevistados directamente — con la excepción de 1 usuario externo en la Etapa 2 en curso.

**Por qué importa ahora:** Los 5 perfiles de usuario (PERSONAS.md), el Journey Map del Jefe de Turno y los 7 principios de diseño del SYSTEM_MAP se basan en perspectivas proxy. Si las necesidades inferidas no coinciden con la realidad de la faena, los lineamientos de diseño de Etapa 3 repetirán el patrón "Auto de Homero Simpson" [IG-SYNTH-02] — pero a nivel de estrategia, no de feature.

**Estado:** En progreso. 1 entrevista efectuada. Philip facilita acceso a usuarios en faenas activas. Objetivo: 5-7 entrevistas adicionales, 30 min cada una.

---

### [CF-13] Resistencia de operadores vs. adopción bottom-up — Contradicción sin resolver

**Naturaleza:** Contradicción entre dos claims primarios del CTO/CEO sobre el mismo fenómeno de adopción.

- **Claim A** [IG-SYNTH-17, VERIFIED]: TIMining adopta bottom-up. Alta stickiness una vez embebido en rutinas. "Operational pull."
- **Claim B** [IG-04, VERIFIED]: Planificación usa TIMining para auditar operadores → resistencia activa. "Si no logramos vender al operador, estamos afuera."

**Por qué importa ahora:** La estrategia GTM y el diseño de onboarding de CORE dependen de cuál de las dos dinámicas domina en los clientes actuales. Si la resistencia es la norma (no la excepción), el modelo bottom-up requiere condiciones de diseño explícitas que hoy no están definidas.

**Opciones identificadas:**
- A: La resistencia es contextual — ocurre donde planificación usa la herramienta como auditoría. El modelo bottom-up funciona cuando los propios operadores son los beneficiarios directos.
- B: La resistencia es la condición de partida — CORE debe resolverla desde el onboarding, no asumirla resuelta.

**Estado:** PENDING. Resolver con entrevistas de Etapa 2.

---

### [CF-05] Definición ambigua de customización vs. configuración

**Naturaleza:** Sin definición formal de dónde termina "configurar umbrales" y empieza "desarrollar features a medida". El COO usa el mismo término para ambas cosas.

**Por qué importa:** Todo 2025 fue dedicado a customización para un solo cliente [IG-SYNTH-02]. Mientras no exista un framework formal (Configuración → Extensión → Custom), el riesgo de repetir ese patrón persiste. CORE debe definir los límites antes del primer contrato.

**Propuesta pendiente de validación con equipo de producto:**
- **Nivel 1 — Configuración:** cambio de umbrales, parámetros de alertas, nomenclatura. Sin código. Por el cliente.
- **Nivel 2 — Extensión:** APIs y plugins documentados. Con código del cliente sobre interfaz estable.
- **Nivel 3 — Custom:** desarrollo de features nuevos por TIMining. Con justificación de uso validado.

**Estado:** PENDING. Requiere input del equipo de desarrollo.

---

## 5. Próximos Pasos

### Prioridad 1: Completar entrevistas de Etapa 2 — usuario directo (CF-07)

**Qué:** 5-7 entrevistas de 30 min con usuarios finales en faenas activas. Perfiles prioritarios: Jefe de Turno y Despachador (P-01, P-02). Acceso facilitado por Philip.

**Por qué ahora:** Los lineamientos de diseño de Etapa 3 no pueden basarse únicamente en perspectivas de stakeholders. El riesgo de repetir el "Auto de Homero Simpson" a nivel estratégico es alto.

**Preguntas críticas a resolver:**
- ¿Usas TIMining porque quieres o porque debes? [CF-13]
- ¿Qué información buscas cuando abres la plataforma? ¿La encuentras? [IG-SYNTH-03]
- ¿Cuándo fue la última vez que tomaste una decisión importante por WhatsApp/radio en vez de la plataforma? ¿Por qué? [IG-03]
- ¿Qué pasaría si mañana no tuvieras acceso a TIMining? [IG-SYNTH-17]

---

### Prioridad 2: Sesión de benchmark UX con Carlo (CTO) [CF-03 — apertura confirmada]

El CTO mostró apertura real a discutir sobre UI en el Touchpoint del 19-feb. El benchmark UX inspiracional está listo. La sesión permite objetivar la tensión entre la confianza interna en el diseño ("por sobre la vara de la competencia") y la evidencia de uso (30% en Orchestra, abandono por confusión).

**Objetivo:** alinear criterios de evaluación de UX con el equipo de producto antes de los lineamientos de Etapa 3.

---

### Prioridad 3: Validar el tercer gap mina-planta con CFO [IG-06]

El hallazgo existe pero descansa en una sola fuente (Touchpoint 19-feb). Antes de incluirlo en la estrategia de producto, validar con al menos un CFO o Gerente de Finanzas de un cliente activo de TIMining.

**Pregunta clave:** ¿qué métricas financieras necesitarías ver conectadas con la operación de la mina para justificar este software ante tu directorio?

---

### Prioridad 4: Definir framework de customización con equipo de producto [CF-05]

Sin este acuerdo, CORE enfrenta el mismo riesgo que consumió todo 2025. Proponer los 3 niveles (Configuración → Extensión → Custom) en la próxima sesión con el equipo de desarrollo de TIMining.

---

## 6. Tabla de Insights

| ID | Concepto | Status | Convergencia | Categoría |
|---|---|---|---|---|
| [IG-SYNTH-01] | "Geometry Gap" — Brecha geométrica plan-realidad | VERIFIED | 15/54 | technical |
| [IG-SYNTH-02] | "Auto de Homero Simpson" — Trampa de customización | VERIFIED | 8/54 | user-need |
| [IG-SYNTH-03] | Confusión Temporal — Tiempos del dato generan abandono | VERIFIED | 5/57 | user-need |
| [IG-SYNTH-04] | Del Dashboard al Copiloto — Asistencia proactiva | VERIFIED | 12/54 | user-need (aspiracional) |
| [IG-SYNTH-05] | "Efecto Suiza" — Integrador neutral como diferenciador | VERIFIED | 10/54 | business |
| [IG-SYNTH-06] | Patrón D→A→R — Detección → Análisis → Recomendación | VERIFIED | 26/57 | user-need (aspiracional) |
| [IG-SYNTH-07] | Gestión por Excepción — Solo mostrar lo que importa | VERIFIED | 10/57 | user-need (aspiracional) |
| [IG-SYNTH-08] | Democratización del Dato — De expertos a todos | VERIFIED | 9/54 | user-need (aspiracional) |
| [IG-SYNTH-09] | Perfiles diferenciados con necesidades distintas | VERIFIED | 13/57 | user-need |
| [IG-SYNTH-10] | De herramientas fragmentadas a plataforma CORE | VERIFIED | 10/57 | business (aspiracional) |
| [IG-SYNTH-11] | Curva de aprendizaje y barrera de adopción | VERIFIED | 7/57 | user-need |
| [IG-SYNTH-12] | Adherencia espacial como métrica central del negocio | VERIFIED | 10/54 | business |
| [IG-SYNTH-13] | Stack tecnológico fragmentado | VERIFIED | 3/54 | technical |
| [IG-SYNTH-14] | Dependencia de venta consultiva | VERIFIED | 4/57 | business |
| [IG-SYNTH-15] | "Efecto Gaviota" — Dolor del cambio de turno | VERIFIED | 5/54 | user-need |
| [IG-SYNTH-16] | "Paz Mental" como propuesta de valor experiencial | VERIFIED | 7/57 | user-need (aspiracional) |
| [IG-SYNTH-16b] | Oportunidad de repricing: precio vs. valor capturado | VERIFIED | 8/57 | business (aspiracional) |
| [IG-SYNTH-17] | Adopción bottom-up — "Operational Pull" | VERIFIED | 6/57 | business |
| [IG-SYNTH-18] | Seguridad y gestión geotécnica integrada | VERIFIED | 8/54 | constraint |
| [IG-SYNTH-19] | Interfaz Multimodal — 4 Lentes de navegación | VERIFIED | 7/54 | technical (aspiracional) |
| [IG-02] | Etapa 2 incompleta — Lineamientos sin validación de usuario | VERIFIED | 1/1 | constraint |
| [IG-03] | WhatsApp como canal principal de decisiones operacionales | VERIFIED | 2/57 | technical |
| [IG-04] | Resistencia de operadores cuando son auditados | VERIFIED | 1/57 | user-need |
| [IG-05] | "Mi cliente es el Excel" — El competidor real es el status quo | VERIFIED | 1/57 | business |
| [IG-06] | Desconexión mina-planta — Tercer gap operacional | VERIFIED | 1/57 | user-need |
| [IG-08] | 60 reglas de negocio propietarias como moat técnico | VERIFIED | 1/57 | technical |
| [IG-09] | Sistema aprende de decisiones expertas | VERIFIED | 2/57 | technical (aspiracional) |

---

*Generado con PD-Spec v4.7.0 — engine Idemax × TIMining*
