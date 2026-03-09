# Insights Graph

Atomic verified insights extracted from sources. Each insight has a unique `[IG-XX]` ID, a status, and a traceable source reference.

## Status Legend

- **PENDING** — Extracted but not yet verified or cross-referenced.
- **VERIFIED** — Confirmed through cross-referencing or user validation.
- **FROZEN** — Valid but deprioritized for current scope.
- **INVALIDATED** — Contradicted by stronger evidence; no longer active.
- **MERGED** — Combined with another insight during conflict resolution.
- **SUPERSEDED** — Replaced by a newer, more complete insight.

---

## Field Operations & Mobile Requirements

### [IG-21] Los operadores de campo requieren interfaces optimizadas para equipos móviles ruggedizados
Category: user-need (current)
Voice: user | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/6 sources
Ref: 01_Sources/Workshop 1/IMG_9680.HEIC
Status: PENDING

> Los usuarios necesitan acceso a datos en tiempo real mediante interfaces simples, diseñadas para tablets resistentes y accesibles desde camiones y equipos móviles.

Evidence:
- "Interfaz más simple para operadores de campo"
- "Necesitan ver datos en tiempo real en tablets resistentes"
- "Acceso desde camiones y equipos móviles"

### [IG-22] Supervisores necesitan sistema de alertas móvil con integración WhatsApp para emergencias
Category: user-need (current)
Voice: user | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/6 sources
Ref: 01_Sources/Workshop 1/IMG_9680.HEIC
Status: PENDING

> Supervisores requieren recibir alertas operativas directamente en celular y notificaciones de emergencia vía WhatsApp para respuesta inmediata en terreno.

Evidence:
- "Alertas que lleguen al celular del supervisor"
- "Notificaciones por WhatsApp para emergencias"

### [IG-23] Sistema debe garantizar funcionamiento resiliente ante conectividad intermitente en mina
Category: user-need (current)
Voice: user | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/6 sources
Ref: 01_Sources/Workshop 1/IMG_9680.HEIC
Status: PENDING

> La operación minera requiere dashboards que carguen rápido en conexiones lentas, con capacidad offline y sincronización automática al recuperar conectividad.

Evidence:
- "Dashboard debe cargar rápido en conexión lenta"
- "Backup offline cuando falla internet en mina"
- "Sincronización automática al volver conectividad"

### [IG-24] Los usuarios demandan integración con sistemas empresariales existentes y exportación de datos
Category: user-need (current)
Voice: user | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/6 sources
Ref: 01_Sources/Workshop 1/IMG_9680.HEIC
Status: PENDING

> La operación requiere integración fluida con sistemas como SAP y capacidad de exportar datos a Excel para análisis complementarios.

Evidence:
- "Integración con sistemas existentes (SAP)"
- "Exportar datos a Excel para análisis"

### [IG-25] La experiencia de usuario debe minimizar curva de aprendizaje y adaptarse a roles diferenciados
Category: user-need (current)
Voice: user | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/6 sources
Ref: 01_Sources/Workshop 1/IMG_9680.HEIC
Status: PENDING

> Los usuarios necesitan capacitación mínima (máximo 2 horas), vistas adaptadas por rol y filtros operativos por turno y sector con permisos diferenciados.

Evidence:
- "Capacitación debe ser minimal - máximo 2 horas"
- "Vista resumida para gerentes desde oficina"
- "Filtros por turno y sector de la mina"
- "Permisos por rol - no todos ven todo"

### [IG-26] La operación requiere automatización de reportería para optimizar flujos administrativos
Category: user-need (current)
Voice: user | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/6 sources
Ref: 01_Sources/Workshop 1/IMG_9680.HEIC
Status: PENDING
> "Reportes automáticos al final del turno"

<!-- New insights are appended below by /analyze -->

## Industry Challenges & Technical Constraints

### [IG-SYNTH-09] La industria minera enfrenta crisis estructural de datos fragmentados y baja integración
Category: technical (current)
Voice: stakeholder, document | Authority: fact, observation
Tier: Señal
Convergence: 2/5 sources
Refs: Design Brief_ TIMining CORE.docx, Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING

> Minas generan terabytes de datos en tiempo real pero la integración es compleja debido a múltiples proveedores con formatos diferentes, confiabilidad variable y alto ruido en las fuentes.

Evidence:
- Design Brief: "Mines generate terabytes of data, many in real time. Yet, putting all this data together in an accurate way, reflecting how processes, equipment and geometries interact with each other is very complex"
- Design Brief: "Each process has its own set of suppliers providing data and niche software solutions in different formats, time-lapses and most importantly, reliability - there is a lot of 'noise' in the different data sources"

### [IG-11] Operadores enfrentan restricciones de tiempo que impiden monitoreo continuo de sistemas
Category: user-need (current)
Voice: document | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Design Brief_ TIMining CORE.docx
Status: PENDING
> "Operation Engineers / Operators Primary Pain Point: They do not have time to sit and watch a screen all day to monitor the operation"

### [IG-12] Supervisores necesitan inteligencia móvil para recibir alertas operativas en terreno
Category: user-need (current)
Voice: document, user | Authority: direct-quote
Tier: Hipótesis
Convergence: 2/6 sources
Refs: Design Brief_ TIMining CORE.docx, Workshop 1/IMG_9680.HEIC
Status: PENDING

> Supervisores requieren recibir inteligencia y alertas operativas directamente en dispositivos móviles para poder responder desde terreno sin depender de computadores fijos.

Evidence:
- Design Brief: "Intelligence and alerts were previously tethered to desktop computers rather than mobile devices, preventing them from receiving anticipated warnings while in the field"
- Workshop: "Alertas que lleguen al celular del supervisor"

### [IG-13] Planificadores requieren visibilidad en tiempo real del impacto de sus diseños en la flota
Category: user-need (current)
Voice: document | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Design Brief_ TIMining CORE.docx
Status: PENDING
> "Planning Engineers Primary Pain Point: The inability to 'close the loop' between design and reality; specifically, they could not see the impact of their designs on the fleet in real-time"

### [IG-14] Despachadores carecen de visibilidad de restricciones geotécnicas en interfaces de despacho
Category: user-need (current)
Voice: document | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Design Brief_ TIMining CORE.docx
Status: PENDING
> "Dispatchers Primary Pain Point: Lack of situational awareness regarding safety constraints; specifically, they could not see geotechnical restrictions or hazard zones directly on their dispatch screens"

## Commercial Strategy & Value Proposition

### [IG-SYNTH-10] TIMining posiciona CORE como upgrade premium con diferenciación técnica y comercial clara
Category: business (aspirational)
Voice: stakeholder | Authority: fact, vision
Tier: Señal
Convergence: 2/5 sources
Refs: Design Brief_ TIMining CORE.docx, PPT TIMining - General_ENE 2026_Español.pdf
Status: PENDING

> Nueva plataforma CORE se posiciona a $450K vs $300K de Aware actual, enfocándose en "Democratic Intelligence" y experiencia diferenciada que justifique el premium comercial.

Evidence:
- Design Brief: "We aim the new platform to be sold for at least USD 450k per mine site, with the same annual renewable license and benefit of unlimited users per mine"
- Design Brief: "It is essential that clients and users can really tell the difference between both products, its value add and UX/UI architecture"
- Design Brief: "Democratic Intelligence: We are moving insights from the desktop to the pocket, reaching 100+ active users per site"

### [IG-15] TIMining ha validado $10M+ en valor con ventaja competitiva en geometría en tiempo real
Category: business (current)
Voice: document | Authority: fact
Tier: Señal
Convergence: 2/5 sources
Refs: Design Brief_ TIMining CORE.docx, PPT TIMining - General_ENE 2026_Español.pdf
Status: PENDING

> Capacidad única de ejecutar simulaciones sobre topografía actualizada cada 15 minutos genera ventaja competitiva demostrada con $10M+ en ahorros comprobados.

Evidence:
- Design Brief: "Geometric Certainty: No other competitor can run simulations on a topography that updates every 15 minutes"
- Design Brief: "We have already demonstrated over $10M in savings and efficiency gains in Tier-1 operations like Codelco and Antofagasta Minerals"

## Technical Integration & Architecture

### [IG-16] TIMining actúa como capa agnóstica integrando OEMs competidores en contexto unificado
Category: technical (current)
Voice: document | Authority: fact
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Design Brief_ TIMining CORE.docx
Status: PENDING
> "TIMining acts as an agnostic layer that integrates data from competing OEMs (Komatsu, Cat, Modular, Hexagon) and planning software (Maptek, Deswik), creating a unified context that no single manufacturer can replicate"

## UI/UX Design Requirements

### [IG-17] Interface debe usar navegación unificada con 4 lentes contextuales sin pérdida de datos
Category: design-framework (aspirational)
Voice: document | Authority: vision
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Design Brief_ TIMining CORE.docx
Status: PENDING
Grounded in: [IG-SYNTH-04], [IG-11]
> "The core UI must utilize a 'Unified Navigation Ribbon' that allows users to toggle between four distinct 'Lenses' without losing contextual data"

### [IG-18] Sistema requiere alto contraste para uso en terreno con legibilidad en 5 segundos
Category: design-framework (current)
Voice: document | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Design Brief_ TIMining CORE.docx
Status: PENDING
Grounded in: [IG-12]
> "High contrast is mandatory for field use in bright sunlight. All critical alerts must be readable in under 5 seconds ('Glanceable Intelligence')"

## Future Vision & Strategy

### [IG-19] Visión 2040: mina y planta convergen en gemelo digital único con vehículos autónomos
Category: business (aspirational)
Voice: stakeholder | Authority: vision
Tier: Supuesto
Convergence: 2/5 sources
Refs: Design Brief_ TIMining CORE.docx, Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING

> Predicción de evolución hacia operaciones completamente autónomas donde TIMining actúa como cerebro inteligente que supervisa geometría en ambiente sin intervención humana.

Evidence:
- Design Brief: "By 2040, the distinction between the 'Mine' and the 'Plant' will vanish. Operations will be managed as a single, communicated digital twin"
- Design Brief: "Vehicles will be 100% autonomous. In this environment, TIMining's platform acts as the 'intelligent brain' that oversees the geometry"
- Meeting: "Concepto de Skynet — evolución del patrón DART donde sistema percibe, cada x minutos corre análisis, ejecuta sin intervención humana"

### [IG-20] Evolución hacia copiloto prescriptivo que genera automáticamente escenarios de solución
Category: business (aspirational)
Voice: document | Authority: vision
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Design Brief_ TIMining CORE.docx
Status: PENDING
> "The system alerts: 'A problem is happening' (e.g., Queue at Shovel 5). Copilot Upgrade: the Agent triggers the Orchestra engine automatically to generate solutions. It will say: 'Here are three scenarios to fix it'"

## TIMining — Company & Market Position

### [IG-SYNTH-01] TIMining se posiciona como especialista en tecnología minera con enfoque en cerrar la brecha plan-operación
Category: business (current)
Voice: stakeholder, document | Authority: fact, direct-quote
Tier: Señal
Convergence: 3/5 sources
Refs: PPT TIMining - General_ENE 2026_Español.pdf, Touchpoint_TIMining-IDEMAX _2026-02-19.md, TIMining_8-Layer_Diagram.pptx
Status: PENDING

> TIMining es una empresa con 15 años de experiencia enfocada en resolver la brecha entre planificación minera y operación diaria mediante tecnología de monitoreo en tiempo real y análisis espacial.

Evidence:
- PPT: "TIMining es una empresa 100% dedicada al desarrollo tecnológico para la minería, con cerca de 15 años de experiencia"
- PPT: "El foco de TIMining está en ayudar a solucionar una brecha importante que observamos en la industria minera: la dificultad para cumplir los planes mineros"
- Meeting: "TIMining ha desarrollado una plataforma tecnológica y softwares que permiten cerrar la brecha entre el plan y la operación diaria"

### [IG-SYNTH-02] El incumplimiento de planes mineros representa un problema de alto valor económico en la industria
Category: user-need (current)
Voice: stakeholder, document | Authority: fact, observation
Tier: Señal
Convergence: 3/5 sources
Refs: PPT TIMining - General_ENE 2026_Español.pdf, Touchpoint_TIMining-IDEMAX _2026-02-19.md, laminas-caso-uso-1.png
Status: PENDING

> La falta de adherencia al plan minero genera pérdidas significativas, con potencial de USD 15B anuales de valor para la industria con solo 5% de mejora en cumplimiento.

Evidence:
- PPT: "Un incremento de 5% en el cumplimiento de los planes mineros (adherencia geométrica) puede agregar más de USD 15b en mayor valor anual para la industria"
- Meeting: "Los clientes miden incrementos de 5-10 puntos porcentuales en cumplimiento del plan minero con Aware"
- Use cases: "Gerente Minas realiza cierre mensual y necesita entender por qué la recuperación de la planta es mala a pesar de que se cumple mineral y lastre"

## Industry Problems & User Needs

### [IG-SYNTH-03] Las operaciones mineras carecen de sensores de geometría, requiriendo soluciones de "soft sensors"
Category: technical (current)
Voice: stakeholder, document | Authority: direct-quote, observation
Tier: Señal
Convergence: 3/5 sources
Refs: PPT TIMining - General_ENE 2026_Español.pdf, Touchpoint_TIMining-IDEMAX _2026-02-19.md, TIMining_8-Layer_Diagram.pptx
Status: PENDING

> La minería carece de sensores físicos para cambios geométricos, a diferencia de las plantas, necesitando desarrollo de sensores virtuales para monitoreo espacial en tiempo real.

Evidence:
- PPT: "En la operación minera no hay sensores electrónicos para el cambio en las geometrías – se requiere el concepto de 'Soft Sensors'"
- PPT: "Desafío tecnológico minería: en la mina la geometría es clave pero a diferencia de planta no hay sensores de geometría"
- Architecture: "Layer 2 (Real-Time Spatial Reconstruction): soft-sensor inference provides pit surface tracking, drill progress monitoring"

### [IG-SYNTH-04] Usuarios de minería sufren saturación de datos sin capacidad de discernir qué requiere atención
Category: user-need (current)
Voice: user, stakeholder | Authority: direct-quote, observation
Tier: Señal
Convergence: 4/5 sources
Refs: PPT TIMining - General_ENE 2026_Español.pdf, Touchpoint_TIMining-IDEMAX _2026-02-19.md, laminas-caso-uso-1.png, IMG_9680.HEIC
Status: PENDING

> Los operadores enfrentan sobrecarga de información donde todo parece crítico, perdiendo capacidad de priorizar acciones efectivas en tiempo real.

Evidence:
- PPT: "La raíz del problema se ve en la gestión diaria (el turno), donde muchas veces se toman decisiones basadas en la experiencia"
- Meeting: "La saturación de datos hace que todo se ilumina igual, resultando en que nada es promoción/crítico"
- Meeting: "Discernir entre urgente e importante es clave — qué requiere atención inmediata versus qué impacta más a mediano plazo"
- Use cases: "Situación de estrés para Planificador Corto Plazo: no hay vehículos disponibles"

### [IG-01] Los operadores mineros necesitan "paz mental" más que solo soluciones técnicas
Category: user-need (aspirational)
Voice: stakeholder | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING
> "El mantra operativo timánico es que el valor del invierno reside en generar una paz mental al usuario sobre el dolor, no solamente en la solución técnica"

## Design Framework

### [IG-SYNTH-05] Sistema debe implementar principio "Quiet UI" con silencio como estado default y alertas específicas
Category: design-framework (aspirational)
Voice: stakeholder | Authority: direct-quote, vision
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING
Grounded in: [IG-SYNTH-04]

> Interfaz debe mostrar solo información accionable, manteniendo silencio visual hasta que algo requiera atención específica, evitando saturación que hace que nada sea crítico.

Evidence:
- Meeting: "El principio de Quiet UI: todo lo que se muestra debería ser accionable, no datos que solo confunden — saturación de datos lleva a que nada sea crítico"
- Meeting: "El silencio como estado default significa que cuando hay algo que hacer, el sistema alerta con claridad"

### [IG-02] Patrón DART (Detección-Análisis-Recomendación-Decisión) debe estructurar flujo operativo
Category: design-framework (aspirational)
Voice: stakeholder | Authority: vision, direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING
> "Pasamos de un modelo de médico operacional a un recomendador certero — patrón DART: detección, análisis, recomendación"

## Technical Solutions

### [IG-SYNTH-06] TIMining Aware proporciona monitoreo espacial en tiempo real con topografía inferida
Category: technical (current)
Voice: stakeholder, document | Authority: fact, direct-quote
Tier: Señal
Convergence: 3/5 sources
Refs: PPT TIMining - General_ENE 2026_Español.pdf, TIMining_8-Layer_Diagram.pptx, Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING

> TIMining Aware ofrece capacidades de reconstrucción espacial en tiempo real cada 15 minutos, modelando geometrías de mina y equipos sin sensores físicos tradicionales.

Evidence:
- PPT: "TIMining Aware ofrece topografía inferida de alta precisión cada 15 minutos"
- PPT: "TIMining Aware modela en tiempo real geometrías de la mina e información de equipos mineros"
- Architecture: "Layer 2 (Real-Time Spatial Reconstruction): computational geometry & soft-sensor inference provides pit surface tracking"

### [IG-03] Arquitectura de 8 capas permite integración de datos mineros con prescripciones automatizadas
Category: technical (current)
Voice: document | Authority: fact
Tier: Hipótesis
Convergence: 1/5 sources
Ref: TIMining_8-Layer_Diagram.pptx
Status: PENDING
> "TIMining Platform uses an 8-layer interconnection architecture with upward data flow and downward prescriptions & control"

### [IG-SYNTH-07] TIMining ha demostrado mejoras medibles en adherencia al plan y velocidades de flota
Category: business (current)
Voice: document | Authority: fact
Tier: Señal
Convergence: 2/5 sources
Refs: PPT TIMining - General_ENE 2026_Español.pdf, Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING

> Los casos implementados muestran mejoras de 9-19% en adherencia al plan y aumentos de velocidad de flota de 1.8 km/h, generando millones en valor capturado.

Evidence:
- PPT: "Caso 1: Adherencia al plan en Fase F08 mejoró +9% con Aware"
- PPT: "Caso 2: Adherencia a plan Fase 37 mejoró de 54% a 73% (+19%)"
- PPT: "Caso 1: velocidad flota mejoró de 16.5 a 18.3 km/h (+1.8 km/h), generando USD 6 MM en valor capturado"

## Communication & Integration

### [IG-04] WhatsApp es el canal principal de comunicación operativa en minería
Category: user-need (current)
Voice: stakeholder, user | Authority: observation, direct-quote
Tier: Hipótesis
Convergence: 2/6 sources
Refs: Touchpoint_TIMining-IDEMAX _2026-02-19.md, Workshop 1/IMG_9680.HEIC
Status: PENDING

> WhatsApp es el canal más utilizado para comunicaciones críticas operativas y notificaciones de emergencia en la operación minera.

Evidence:
- Meeting: "WhatsApp es el canal más usado en la operación minera para comunicaciones críticas y toma de decisiones día a día"
- Workshop: "Notificaciones por WhatsApp para emergencias"

### [IG-SYNTH-08] Operación minera sufre descoordinación por silos de información entre áreas
Category: user-need (current)
Voice: stakeholder | Authority: observation, direct-quote
Tier: Señal
Convergence: 3/5 sources
Refs: Touchpoint_TIMining-IDEMAX _2026-02-19.md, laminas-caso-uso-1.png, PPT TIMining - General_ENE 2026_Español.pdf
Status: PENDING

> Diferentes áreas operan con dashboards separados sin integración, generando descoordinación entre mina-planta y pérdida de visibilidad sistémica.

Evidence:
- Meeting: "Trabajar en silos donde cada área solo ve su dashboard genera descoordinación — se necesita información unificada"
- Meeting: "Existe desconexión entre mina y planta, distintas fuentes de información, sin fuente única de verdad"
- Use cases: "La causa raíz del problema de recuperación es que las mezclas de mineral no son las correctas"

## Future Strategy & AI

### [IG-05] TIMining planea evolución hacia "Skynet" con automatización sin intervención humana
Category: business (aspirational)
Voice: stakeholder | Authority: vision
Tier: Supuesto
Convergence: 1/5 sources
Ref: Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING
> "Concepto de Skynet — evolución del patrón DART donde sistema percibe, cada x minutos corre análisis, ejecuta sin intervención humana"

### [IG-06] Paradigma "gestionar desde la piedra" versus equipos diferencia a TIMining de competidores
Category: business (current)
Voice: stakeholder | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING
> "El paradigma de TIMining es que uno debería gestionar desde la piedra, no desde la pala. El enfoque es construir el historial de la piedra, no solo monitorear equipos"

## Constraints & Risks

### [IG-07] Resistencia cultural de operadores puede hacer fracasar implementación tecnológica
Category: constraint (current)
Voice: stakeholder | Authority: observation
Tier: Señal
Convergence: 1/5 sources
Ref: Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING
> "El perfil del operador es crítico — si no logramos vender al operador, el proyecto fracasa"

### [IG-08] Validez de datos GPS es crítica - datos incorrectos invalidan inteligencia del sistema
Category: constraint (current)
Voice: stakeholder | Authority: observation
Tier: Señal
Convergence: 1/5 sources
Ref: Touchpoint_TIMining-IDEMAX _2026-02-19.md
Status: PENDING
> "El problema de datos está en que están descandadas las GPS, entregando información incorrecta desde la fuente — Sin validez de dato no debería venir inteligencia"

## Specific User Roles

### [IG-09] Planificadores de corto plazo necesitan datos e hipótesis para decisiones bajo estrés operativo
Category: user-need (current)
Voice: document | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: laminas-caso-uso-1.png
Status: PENDING
> "Planificador Corto Plazo necesita datos e hipótesis para continuar minimizando costo corto o mediano plazo"

### [IG-10] Gerentes de mina necesitan visibilidad de causas raíz en problemas de recuperación/producción
Category: user-need (current)
Voice: document | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/5 sources
Ref: laminas-caso-uso-1.png
Status: PENDING
> "Gerente Minas realiza cierre mensual y necesita entender por qué la recuperación de la planta es mala a pesar de que se cumple mineral y lastre"

<\!-- New insights are appended below by /analyze -->
