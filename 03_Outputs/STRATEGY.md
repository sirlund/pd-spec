# Estrategia de Producto y UX — TIMining CORE

> v1.1 | 2026-02-25 | 38 insights VERIFIED · 4 conflictos PENDING · audit score 6.4/10

---

## 1. Posición Estratégica Actual

### Lo que TIMining tiene que nadie más tiene

TIMining posee dos ventajas técnicas que no son replicables en el corto plazo:

**Primero: El Geometry Engine.** Un algoritmo propietario que infiere topografía en tiempo real cada 15 minutos usando los GPS de equipos existentes, sin drones. Ningún competidor conocido puede correr simulaciones sobre topografía que se actualice a esa frecuencia. Esto no es un feature de software — es el cierre técnico del "Geometry Gap": la brecha entre el plan minero como volumen geométrico y la operación real dinámica. [IG-SYNTH-01]

**Segundo: Las 60 reglas operacionales propietarias.** Lógica acumulada de dispatching, cambio de turno y secuencias de salida que convierte IA genérica en recomendador confiable. Sin estas reglas, cualquier LLM conectado a datos mineros alucina en contexto operacional. Google puede conectar Gemini a una base de datos minera; no puede replicar años de lógica operacional real. Este es el moat real — y hoy no aparece en el pitch. [IG-08]

La combinación de ambas ventajas define la posición defensible de TIMining contra entrantes tecnológicos con más recursos. La adherencia espacial como métrica (en lugar de "toneladas movidas") es la manifestación comercial de esa posición: +9-19% adherencia, USD 10M+ en ahorros en 3 minas, USD 6M capturados en 5 meses en una sola faena. [IG-SYNTH-12]

**Tercero: Un framework UX propietario para minería operacional.** Los cuatro pilares de diseño — Quiet UI, Clear Path, Time Sight, Omni Sense — no son features de interfaz sino la arquitectura de cómo CORE traduce datos operacionales en decisiones. Forman una cadena funcional: filtra (QUI) → guía (CP) → anticipa (TS) → distribuye (OS). La distinción cómo/qué hace los pilares ortogonales entre sí: QUI + Omni Sense gobiernan *cómo* llega la información (presentación + canal); Clear Path + Time Sight gobiernan *qué* información llega (contenido + temporalidad). Cada pilar tiene un dominio operativo primario: QUI → Respuesta a Crisis (A), Time Sight → Anticipación Operativa (B), Omni Sense → Asistencia Inteligente (C), Clear Path → transversal. Ningún competidor conocido ha formalizado un framework de diseño para minería operacional a este nivel de detalle. [IG-16, IG-17, IG-18]

### Dónde está el riesgo mayor

**CF-13: Adopción condicional — herramienta de ayuda vs. herramienta de auditoría.** Carlo (CTO) lo enunció con precisión en el Touchpoint del 19-feb: *"planificación usa TIMining para auditar a operadores — operadores resisten la herramienta — si no logramos vender al operador, estamos acá afuera."* Este dato contradice directamente el modelo "operational pull" (IG-SYNTH-17, alta convergencia). Las consecuencias son directas: si CORE se despliega sin resolver esta condición, el modelo bottom-up colapsa y la adopción depende de mandatos top-down que no se sostienen en el largo plazo. PENDING — requiere Etapa 2 de entrevistas para resolver. [IG-04, CF-13]

**CF-07: Sin voz directa del usuario final.** El knowledge base tiene 14 insights de categoría `user-need` y ninguno proviene de un usuario directo (minero, despachador, jefe de turno). Toda la capa de UX está construida sobre perspectivas proxy del COO, CTO y PMs. Esto no invalida lo construido — pero significa que las decisiones de diseño de Etapa 3 se deben tratar como hipótesis validables, no como certezas. Score de solidez de perfiles: 4/10. [CF-07, IG-02]

### El competidor real: Excel y el status quo

Philip (CEO) lo sintetizó en una sola frase: *"Mi cliente no es tecnología — mi cliente es el Excel."* [IG-05]

TIMining no compite contra Hexagon ni Maptek en la mente del comprador con presupuesto. Compite contra el proceso de Excel + radio + reunión de turno que ya existe y "funciona". La implicación estratégica es concreta: si CORE no conecta con ese proceso familiar — si no exporta a Excel, si no captura las decisiones que ocurren en WhatsApp y radio, si no habla en métricas que el CFO ya usa — la adopción se detiene donde termina el mandato top-down. [IG-03, IG-05, IG-06]

---

## 2. Principios Estratégicos de Diseño

Estos principios no son aspiraciones. Son decisiones concretas que deben influir el diseño, el onboarding y la estrategia de GTM.

### Principio 1: "Paz mental" es lenguaje interno. "Ayúdame a decidir" es lenguaje externo.

El framing "Paz Mental" emergió del Workshop 01, fue adoptado en el Sello de Experiencia y es válido como guía de diseño interno: cada interacción debe reducir la carga cognitiva, no aumentarla. Si una pantalla genera más preguntas que respuestas, está fallando. [IG-SYNTH-16]

Pero el CEO cuestionó el término en el Touchpoint 19-feb: *"puede ser correcto pero es muy abstracto — prefiero algo más relacionado con tiempo/eficiencia."* La resolución es la bifurcación: "Paz Mental" permanece como criterio de diseño interno; el framing externo aprobado es *"ayúdame a tomar la mejor decisión porque yo no tengo tiempo"* — centrado en eficiencia y confianza en la información. El comprador con agenda saturada compra tiempo recuperado, no abstracción emocional. [CF-12 RESOLVED]

**Decisión de diseño:** Toda pantalla de CORE se evalúa con la pregunta "¿esto reduce la carga de decisión del usuario o la aumenta?" Si la respuesta es ambigua, rediseñar.

### Principio 2: El operador es el primer beneficiario, no el objeto de auditoría.

La condición para que el modelo bottom-up funcione es que el operador perciba CORE como herramienta de ayuda, no de control. La regla operativa es: **el operador debe ver su propio panel de desempeño antes de que lo vea su jefatura.** CORE diseñado sin esta condición no resolverá la resistencia activa documentada en IG-04 — la perpetuará. [IG-04, IG-SYNTH-17, CF-13]

**Decisión de diseño:** Definir explícitamente qué datos del operador son visibles para él, cuáles para su jefatura y cuáles para planificación. Esta política de visibilidad de datos debe estar resuelta antes del primer despliegue de CORE.

### Principio 3: Canal agnóstico — WhatsApp y Radio antes que 3D.

El CTO documentó que el 90% de las decisiones operacionales ocurre en WhatsApp y radio, fuera de la plataforma. TIMining pierde esa inteligencia si no integra esos canales. La visión aprobada es agnóstica: si la faena opera por WhatsApp, CORE captura ahí. La implicación de diseño es radical: CORE no compite con WhatsApp — se integra a él. El visor 3D tiene valor; pero para los perfiles que operan desde terreno sin pantalla, WhatsApp y voz son los canales de primera intervención. [IG-03, IG-SYNTH-19]

**Decisión de diseño:** Los módulos de Briefing de Turno y alertas de seguridad geotécnica deben funcionar por push/WhatsApp como canal primario, no como canal de fallback.

### Principio 4: La integración no obliga a abandonar Excel.

La plataforma CORE debe articularse con los procesos que ya existen, no reemplazarlos por mandato. Esto significa: exportación nativa a Excel, integración con sistemas de reporting del CFO, captura de decisiones que ya ocurren en WhatsApp/radio. Si CORE exige que el operador abandone sus herramientas actuales para adoptarlo, el ciclo de adopción se extiende y la resistencia aumenta. [IG-05, IG-SYNTH-05, IG-06]

**Decisión de diseño:** El Efecto Suiza [IG-SYNTH-05] no es solo una ventaja competitiva de posicionamiento. Es un principio de diseño de integración: CORE es el hub que conecta lo que no se conecta, sin exigir abandono de herramientas existentes.

### Principio 5: Los 4 pilares son el lenguaje unificado de diseño de CORE.

Toda decisión de diseño en CORE puede evaluarse contra los cuatro pilares. **Quiet UI:** ¿el estado del sistema es legible en menos de 5 segundos sin leer texto? **Clear Path:** ¿el usuario sabe exactamente qué acción tomar ahora? **Time Sight:** ¿el dato tiene contexto temporal visible (qué antigüedad tiene, qué tendencia muestra)? **Omni Sense:** ¿la información llega por el canal donde el usuario ya está?

Los pilares no son paralelos — son secuenciales [IG-16]. Una alerta mal filtrada (falla Quiet UI) hace imposible que Clear Path funcione. Un dato sin contexto temporal (falla Time Sight) hace imposible la anticipación. Un canal incorrecto (falla Omni Sense) hace irrelevante todo lo anterior.

| Pilar | Pregunta de diseño | Dominio | Perfil primario |
|---|---|---|---|
| Quiet UI | ¿Es legible en 1 vistazo? | A — Respuesta a Crisis | Despachador |
| Clear Path | ¿El próximo paso es obvio? | Transversal | Todos |
| Time Sight | ¿El dato tiene contexto temporal? | B — Anticipación Operativa | Planificador, CFO |
| Omni Sense | ¿Llega por el canal correcto? | C — Asistencia Inteligente | Jefe de Turno en terreno [IG-21] |

**Decisión de diseño:** Cada módulo de CORE debe poder nominar su pilar dominante. Un módulo sin pilar claro está sub-especificado. Un módulo que requiere los 4 pilares simultáneamente probablemente hace demasiado. [IG-17]

---

## 3. Prioridades de Producto (Now / Next / Later)

### NOW — Especificable hoy con evidencia suficiente

Estos módulos tienen evidencia VERIFIED de alta convergencia y pueden avanzar a lineamientos de diseño con los supuestos actuales explicitados.

| Módulo | Evidencia | Pilar | Decisión |
|---|---|---|---|
| **Geometry Engine** | IG-SYNTH-01 (15/54), IG-SYNTH-12 (10/54) | Time Sight | Topografía RT cada 15 min como dato fundacional. Adherencia espacial como métrica central. |
| **Patrón D→A→R** | IG-SYNTH-06 (26/57 — mayor convergencia del corpus) | Clear Path | Todo flujo de CORE sigue Detección → Análisis → Recomendación. Sin excepciones. |
| **Gestión por excepción** | IG-SYNTH-07 (10/57) | Quiet UI | Si hay 50 camiones bien, no mostrarlos. Alertas legibles en menos de 5 segundos. |
| **Diferenciación por perfil** | IG-SYNTH-09 (13/57) | Transversal | 5 perfiles con interfaces diferenciadas. Cada perfil tiene pilar dominante. [IG-18] |
| **Briefing de Turno automático** | IG-SYNTH-15 (5/54), IG-SYNTH-17 (6/57) | Time Sight + Omni Sense | Briefing multimedia 15 min antes del turno. Canal push/WhatsApp como primario. |
| **Onboarding progresivo** | IG-SYNTH-11 (7/57), IG-SYNTH-02 (8/54) | Clear Path | Capacitación in-app contextual por perfil. Cero manuales. Cero certificaciones. |
| **Seguridad geotécnica** | IG-SYNTH-18 (8/54) | Omni Sense | Alertas por WhatsApp/push como canal primario. Integración ARIS: evaluar viabilidad sin complejizar UI. |

**Condición transversal para TODO lo que se diseñe ahora:** cada feature debe pasar el filtro "Zero Homer" — si no tiene un [IG-XX] con evidencia de uso, no se construye. [IG-SYNTH-02]

### NEXT — Requiere Etapa 2 de entrevistas para comprometer diseño

Estas áreas tienen evidencia suficiente para hipótesis pero no para decisiones de diseño vinculantes. Avanzar sin resolver los conflictos PENDING es repetir el patrón "Auto de Homero Simpson" a nivel estratégico.

| Área | Insight base | Gap a resolver | Conflicto |
|---|---|---|---|
| **Política de visibilidad de datos operador/jefatura** | IG-04 (1/57 — fuente CTO) | ¿El operador resiste porque es auditado o por otro motivo? | CF-13 |
| **Integración WhatsApp / Radio IP** | IG-03 (2/57 — 1 fuente interna) | ¿Cuántas decisiones reales ocurren por WhatsApp vs. plataforma? | CF-07 |
| **Perfil CFO y desconexión mina-planta** | IG-06 (1/57 — observación IDEMAX) | ¿El CFO es usuario real o solo audiencia de reporte? | CF-07, CF-08 |
| **Framework configuración vs. customización** | IG-SYNTH-02 (8/54) | Sin definición formal de niveles Configuración → Extensión → Custom | CF-05 |
| **Unit economics y modelo de repricing a USD 450k** | IG-SYNTH-16b (8/57) | Sin breakdown de costos, CAC ni LTV disponibles | CF-08 |

### LATER — Aspiracional con evidencia interna únicamente

Estas capacidades tienen respaldo en visiones internas y docs de TIMining, pero no en fuentes primarias externas. No comprometerlas en el diseño de CORE v1 sin validación.

| Capacidad | Insight base | Condición para avanzar |
|---|---|---|
| **TIM Agent aprende de decisiones rechazadas (IG-09)** | IG-09 (2/57, ambas fuentes internas IDEMAX) | Confirmación de Carlo que es item de roadmap real. Hoy no hay evidencia. |
| **Interfaz de lenguaje natural para Planificadores (IG-SYNTH-08)** | IG-SYNTH-08 (9/54, aspiracional) | Validar con planificadores reales: ¿el cuello de botella es técnico (SQL) o cognitivo? |
| **Visión 2040 — mina autónoma** | INVALIDADO en /synthesis | No accionable para CORE. No incluir en especificaciones. |

---

## 4. Roadmap de Investigación — Etapa 2

### Qué resolver antes de comprometer diseño

La Etapa 2 de entrevistas no es opcional. Es la condición para elevar el score de readiness de 6.4/10 a 8+/10 y elevar la solidez de perfiles de usuario de 4/10 a un nivel donde los lineamientos de diseño sean defendibles con evidencia primaria.

**Objetivo mínimo:** 3-5 entrevistas semi-estructuradas de 30 minutos con usuarios en faenas activas. Philip confirmó acceso en el Touchpoint del 19-feb. Prioritarios: 2 Jefes de Turno + 1 Despachador.

### Preguntas específicas por perfil

**Para Jefe de Turno y Despachador** (resuelve CF-13, IG-04, IG-03):

1. "¿Sabes si tu jefatura puede ver tu desempeño en la plataforma? ¿Eso te importa?" — *resuelve CF-13 directamente*
2. "¿Cuántas decisiones operacionales importantes tomaste por WhatsApp/radio en el último turno en vez de usar la plataforma? ¿Por qué?" — *cuantifica IG-03 con dato real*
3. "¿Cuándo fue la última vez que usaste la plataforma durante el turno? ¿Qué estabas buscando?" — *calibra uso real vs. formación*
4. "Describe cómo haces el traspaso de turno hoy. ¿Qué información no queda documentada?" — *valida IG-SYNTH-15 con evidencia directa*

**Para Gerente de Mina** (resuelve IG-SYNTH-09, P-03 [GAP]):

5. "¿Desde dónde revisas el estado de la operación? ¿Desktop, celular, en reuniones verbales?" — *valida o refuta framing mobile-first*
6. "¿Qué información de la plataforma usas hoy? ¿Qué no usas?" — *aplica filtro Homer's Car a P-03*

**Para CFO / Gerente de Finanzas** (resuelve IG-06, P-05 [GAP], CF-08):

7. "¿Cómo obtienes hoy el impacto financiero de la operación? ¿Cuánto tarda?" — *valida existencia y severidad del dolor*
8. "¿TIMining forma parte de tu proceso de reporting hoy? Si no, ¿qué necesitarías para que lo fuera?" — *evalúa si P-05 es un cliente real o una suposición*

### Criterios de validación por conflicto

| Conflicto | Hipótesis actual | Criterio de confirmación | Criterio de refutación |
|---|---|---|---|
| **CF-13** — Resistencia de operadores | El operador resiste cuando es auditado; acepta cuando es beneficiario | ≥2 de 3 entrevistas confirman que la percepción de "ser auditado" es la causa directa del rechazo | Los operadores no mencionan auditoría espontáneamente como problema |
| **CF-07** — Sin voz de usuario | Los perfiles proxy del COO/CTO son suficientemente precisos | Las necesidades y comportamientos del usuario directo son consistentes con los perfiles actuales | El usuario directo describe flujos de trabajo o dolores no capturados en los insights actuales |
| **IG-03** — WhatsApp como canal | El 90% de las decisiones operacionales ocurre fuera de la plataforma | El usuario directo reporta más de 5 decisiones importantes por turno via WhatsApp/radio | El usuario reporta que la mayoría de sus decisiones ya ocurren dentro de la plataforma |
| **IG-06** — CFO como usuario potencial | El CFO tiene dolor real con la desconexión mina-planta | El CFO describe un proceso manual y costoso para obtener datos de impacto financiero de la operación | El CFO obtiene esa información de otro sistema; TIMining no es relevante para él |

---

## 5. Riesgos Estratégicos

Priorizados por impacto en la viabilidad del producto y la adopción.

### Riesgo 1 — Feature Bloat ("Auto de Homero Simpson") [IG-SYNTH-02]

**Severidad: Alta — histórico documentado.**

Todo 2025 fue dedicado a customización para un solo cliente. El equipo operacional ya nombró este riesgo con el apodo "Auto de Homero Simpson" y pidió explícitamente en la retro: STOP "dejar de hacer desarrollos específicos" / START "desarrollarlos de manera genérica". El riesgo no es hipotético — ocurrió.

La condición que lo genera es estructural: sin un framework formal de configuración vs. customización vs. desarrollo a medida [CF-05], cada contrato puede presionar features que no escalan. CORE debe definir los tres niveles antes del primer contrato nuevo.

**Mitigación requerida:** Definir y publicar el framework de extensibilidad (Configuración → Extensión → Custom) como condición de arquitectura de CORE v1. Todo feature que no pase el filtro "Zero Homer" [IG-SYNTH-02] queda fuera del producto base.

### Riesgo 2 — Adopción Condicional (Resistencia de Operadores) [IG-04, CF-13]

**Severidad: Alta — impacto directo en el modelo de negocio.**

El modelo de negocio de TIMining depende del "operational pull": adopción bottom-up que arranca con operaciones y escala orgánicamente. Si la resistencia activa de operadores es la norma (no la excepción), ese modelo no funciona — y la dependencia de mandatos top-down no genera la stickiness que justifica el repricing a USD 450k.

El CTO lo enunció como una amenaza existencial: *"si no logramos vender al operador, estamos acá afuera."* El riesgo hoy es que este insight proviene de una sola fuente (1/57) y aún no hay evidencia directa de cuán generalizado es el fenómeno.

**Mitigación requerida:** Resolver CF-13 con Etapa 2 antes de definir la estrategia de GTM y el diseño de onboarding. Si la resistencia es estructural, el diseño de visibilidad de datos debe resolverla desde el día 1. Si es contextual (solo donde se usa como auditoría), se puede mitigar con política de uso en el contrato.

### Riesgo 3 — Decisiones sobre Suposiciones (Score de Evidencia 6.4/10) [CF-07, IG-02]

**Severidad: Media-Alta — afecta toda la capa de UX.**

El audit score es 6.4/10. La trazabilidad de outputs es excelente (9/10). Pero la solidez de los perfiles de usuario es 4/10: ningún usuario directo validó los comportamientos, flujos y dolores capturados en PERSONAS, JOURNEY_MAP y USER_STORIES. Los 5 insights con convergencia 1/57 del Touchpoint 19-feb son los que más impactaron el rediseño del PRD — y son los más frágiles.

Esto no invalida lo construido. Significa que al avanzar a lineamientos de diseño de Etapa 3, las hipótesis frágiles (IG-04, IG-06, IG-09 especialmente) deben gestionarse como suposiciones explícitas con criterios de validación, no como verdades validadas.

**Mitigación requerida:** La Etapa 2 de entrevistas es la respuesta directa a este riesgo. Mientras no se complete, los lineamientos de diseño deben distinguir entre decisiones basadas en evidencia sólida (≥10/57 convergencia) y decisiones basadas en hipótesis (1-2/57 convergencia), con plan de validación para cada una.

### Riesgo 4 — Modelo de Pricing sin Fundamento Financiero [CF-08, IG-SYNTH-16b]

**Severidad: Media — afecta estrategia de venta y repricing.**

El salto de USD 300k a USD 450k no tiene base en unit economics, CAC ni LTV documentados. Se citan resultados de valor (USD 6M en 5 meses) pero sin breakdown de costos operacionales. El Lean Canvas tiene un bloque completo marcado como [GAP] en estructura de costos. Esto no bloquea el diseño de producto, pero bloquea la estrategia de pricing y la argumentación financiera ante el directorio del cliente.

**Mitigación requerida:** Obtener financial model del CFO de TIMining antes de comprometer la estrategia de repricing. La pregunta clave: ¿cuál es el margen real por faena después de descontar el costo de servicios consultivos (30-36h por renovación, ciclo de 2 años)?

---

## Tabla de Insights

| ID | Concepto | Status | Convergencia | Usado en |
|---|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap — brecha geométrica plan-realidad | VERIFIED | 15/54 | Posición estratégica, NOW |
| [IG-SYNTH-02] | Auto de Homero Simpson — feature bloat | VERIFIED | 8/54 | Principios, Riesgo 1 |
| [IG-SYNTH-04] | Del Dashboard al Copiloto — asistencia proactiva | VERIFIED | 12/54 | NOW |
| [IG-SYNTH-05] | Efecto Suiza — integración agnóstica | VERIFIED | 10/54 | Principio 4 |
| [IG-SYNTH-06] | Patrón D→A→R — esqueleto UX | VERIFIED | 26/57 | NOW |
| [IG-SYNTH-07] | Gestión por Excepción — Quiet UI | VERIFIED | 10/57 | Principio 1, NOW |
| [IG-SYNTH-08] | Democratización del Dato | VERIFIED | 9/54 | LATER |
| [IG-SYNTH-09] | Perfiles diferenciados con necesidades distintas | VERIFIED | 13/57 | NOW |
| [IG-SYNTH-11] | Curva de aprendizaje y barrera de adopción | VERIFIED | 7/57 | NOW |
| [IG-SYNTH-12] | Adherencia espacial como métrica central | VERIFIED | 10/54 | Posición estratégica, NOW |
| [IG-SYNTH-15] | Efecto Gaviota — cambio de turno | VERIFIED | 5/54 | NOW |
| [IG-SYNTH-16] | Paz Mental como propuesta de valor | VERIFIED | 7/57 | Principio 1 |
| [IG-SYNTH-16b] | Oportunidad de repricing USD 300k → USD 450k | VERIFIED | 8/57 | Riesgo 4 |
| [IG-SYNTH-17] | Adopción bottom-up — operational pull | VERIFIED | 6/57 | Posición estratégica, Riesgo 2 |
| [IG-SYNTH-18] | Seguridad y gestión geotécnica integrada | VERIFIED | 8/54 | NOW |
| [IG-02] | Etapa 2 incompleta — riesgo sin usuarios | VERIFIED | 1/1 | Riesgo 3 |
| [IG-03] | WhatsApp como canal principal de decisiones | VERIFIED | 2/57 | Principio 3, NEXT |
| [IG-04] | Resistencia de operadores cuando son auditados | VERIFIED | 1/57 | Principio 2, Riesgo 2 |
| [IG-05] | "Mi cliente es el Excel" — el competidor real | VERIFIED | 1/57 | Posición estratégica, Principio 4 |
| [IG-06] | Desconexión mina-planta — tercer gap | VERIFIED | 1/57 | NEXT |
| [IG-08] | 60 reglas operacionales propietarias como moat | VERIFIED | 1/57 | Posición estratégica |
| [IG-09] | Sistema aprende de decisiones expertas | VERIFIED | 2/57 | LATER |
| [IG-10] | Quiet UI como sistema+interfaz (doble capa) | VERIFIED | 2/59 | Principio 5 |
| [IG-11] | Pricing USD 450k — nuevo estándar de valor | VERIFIED | 1/59 | Posición estratégica |
| [IG-13] | Customización sin pricing diferenciado | VERIFIED | 2/59 | NEXT — CF-05 |
| [IG-15] | GPS degradadas en contexto de alta elevación | VERIFIED | 1/59 | Geometry Engine |
| [IG-16] | Pilares encadenados QUI→CP→TS→OS | VERIFIED | 2/59 | Principio 5, §1 |
| [IG-17] | Distinción cómo vs. qué (presentación/canal vs. contenido/temporalidad) | VERIFIED | 2/59 | Principio 5, §1 |
| [IG-18] | 4 dominios operativos formales (A-B-C-D) | VERIFIED | 2/59 | Principio 5, tabla NOW |
| [IG-19] | Time Scrubbing — navegación temporal continua | VERIFIED | 2/59 | Briefing de Turno — NOW |
| [IG-20] | CFO como "usuario invisible" — apuesta estratégica 2026 | VERIFIED | 2/59 | NEXT — P-05 |
| [IG-21] | Manos libres como interfaz primaria para JdT en terreno | VERIFIED | 2/59 | Principio 5, Omni Sense |
| [IG-22] | Plan compliance (Casos 1-6) vs. plan optimization (Casos 7-8) | VERIFIED | 2/59 | Posición estratégica — propuesta de valor bifurcada |

---

*Generado con PD-Spec v4.7.0 — Idemax × TIMining*
