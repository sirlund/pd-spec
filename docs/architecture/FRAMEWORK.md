# PD-OS Framework

> Patrones reutilizables de orquestación de agentes, extraídos de PD-Spec y PD-Build. Estas primitivas surgieron orgánicamente de flujos de trabajo intensivos con agentes IA y aplican a cualquier dominio — investigación de producto, código, prototipado, pipelines de datos.

## Patrones Extraíbles

### 1. Capa de Persistencia de Estado

**Origen:** PD-Spec BL-41 (checkpoint + memory), BL-45 (mid-skill checkpoints).

Sistema de guardado con múltiples slots y recuperación automática. Análogo a la evolución del guardado en videojuegos: puntos fijos de guardado → autoguardado en momentos clave → autoguardado inteligente.

| Componente | Rol | Frecuencia |
|-----------|-----|-----------|
| **Checkpoint** (slot de autoguardado) | Recuperación primaria — snapshot compacto del estado | Sobrescrito después de cada skill / hito |
| **Log de memoria** (acumulativo) | Recuperación de respaldo + registro de auditoría | Agregado después de cada acción, compactado en umbral |
| **Notas externas** (gestionadas por el usuario) | Persistencia cross-sesión más allá del contexto del agente | Manual |

**Reglas clave:**
- Escribir antes del riesgo, no después de la pérdida
- "Zonas sin guardado" durante operaciones atómicas (mid-read, mid-edit)
- Checkpoint preventivo antes de operaciones que se estima consuman >30% del contexto
- Compactación con compresión semántica (resumir entradas antiguas, mantener recientes completas)

### 2. Puerta Humano-en-el-Loop

**Origen:** PD-Spec Agent Mandate #2 (proponer antes de ejecutar).

El agente propone acciones como borrador para aprobación del usuario antes de escribir. Sin cajas negras. El usuario tiene veto final sobre cualquier cambio.

**Aplica a:** Flujos de revisión de PR, aprobación de mockups de diseño, pipelines de transformación de datos, cualquier flujo donde la autonomía del agente deba ser acotada.

### 3. Arquitectura de Input Inmutable

**Origen:** PD-Spec stack de 3 capas.

```
Inputs de solo lectura → Estado de trabajo mutable → Outputs derivados
```

Los inputs nunca se modifican. El estado de trabajo es el dominio del agente. Los outputs siempre son derivables del estado de trabajo. Si el estado de trabajo se pierde, re-derivar desde los inputs. Si los outputs divergen, regenerar desde el estado de trabajo.

**Aplica a:** Sistemas de build (fuente → objetos → binario), pipelines de datos (crudo → transformado → reportes), investigación (fuentes → análisis → entregables).

### 4. Detección de Delta

**Origen:** PD-Spec SOURCE_MAP (hashing MD5 + procesamiento incremental).

Solo procesar lo que cambió. Hashear inputs, comparar contra el último estado conocido, procesar solo el delta. Evitar reprocesamiento completo en cada ejecución.

**Aplica a:** CI/CD (solo rebuild de módulos cambiados), watchers de archivos, caché de build, compilación incremental.

### 5. Compresión Semántica de Logs

**Origen:** PD-Spec MEMORY.md compaction (umbral de 80 líneas).

Los logs crecen sin límite. Comprimir entradas antiguas en resúmenes mientras se preservan las recientes completas. La compresión es semántica (un LLM resume), no mecánica (truncamiento). El contexto reciente queda detallado; el contexto histórico queda accesible pero compacto.

**Aplica a:** Cualquier agente de larga duración con contexto creciente — historiales de chat, logs de ejecución, registros de auditoría.

### 6. Cadena de Skills Componible

**Origen:** PD-Spec pipeline (/extract → /analyze → /spec → /ship).

Los skills son pasos independientes con contratos claros de input/output. Cada skill lee de una ubicación conocida, escribe en una ubicación conocida, y registra su ejecución. Los skills pueden ejecutarse individualmente o encadenados. Incremental por defecto.

**Aplica a:** Automatización de tareas, motores de workflow, pipelines de CI/CD, cadenas de procesamiento de datos.

### 7. Escape Estructurado

**Origen:** PD-Spec Protocolo Freemode.

No todo cabe en el pipeline. Un modo "fuera del pipeline" estructurado permite trabajo ad-hoc manteniendo trazabilidad (acciones registradas, ubicaciones de output definidas, protocolo de ingesta de assets). Libertad con barandas.

**Aplica a:** Trabajo creativo dentro de sistemas estructurados, manejo de excepciones en flujos automatizados, análisis exploratorio junto a pipelines de producción.

---

> Estos patrones son descriptivos, no prescriptivos. Documentan lo que emergió del uso real a lo largo de 4 ciclos de QA y múltiples proyectos. Un futuro SDK de PD-OS los formalizaría como primitivas componibles.

---

## Árbol Conceptual — Modelo de Especificación de Producto en 4 Capas

Una especificación de producto puede descomponerse en cuatro capas, cada una respondiendo una pregunta diferente:

```
┌──────────────────────────────────────────────────────────────┐
│ Capa 1: ESTRATÉGICA (por qué)                                │
│ Visión, Estrategia, Principios de Diseño, Dominios, Valores  │
│ → STRATEGIC_VISION.md                                        │
├──────────────────────────────────────────────────────────────┤
│ Capa 2: ESTRUCTURAL (qué)                                    │
│ Dominio > Módulo > Feature (Propuestas de Diseño [DP-XX])    │
│ → PROPOSALS.md                                               │
├──────────────────────────────────────────────────────────────┤
│ Capa 3: COMPORTAMENTAL (cómo interactúa el usuario)          │
│ Casos de Uso, Escenarios, User Stories, Criterios de Acepta. │
│ → 03_Outputs/ (PRD, User Stories, Journey Maps)              │
├──────────────────────────────────────────────────────────────┤
│ Capa 4: MATERIALIZACIÓN (cómo se ve)                         │
│ User Flows, Patrones UI, Pantallas, Componentes              │
│ → Fuera de alcance (PD-Build)                                │
└──────────────────────────────────────────────────────────────┘
```

| Capa | Pregunta | Cobertura PD-Spec | Archivo(s) |
|---|---|---|---|
| **Estratégica** | ¿Por qué estamos construyendo esto? | Completa | `02_Work/STRATEGIC_VISION.md` |
| **Estructural** | ¿Qué estamos construyendo? | Completa | `02_Work/PROPOSALS.md` |
| **Comportamental** | ¿Cómo interactúa el usuario? | Parcial (vía `/ship`) | Entregables en `03_Outputs/` |
| **Materialización** | ¿Cómo se ve/siente? | Fuera de alcance | Territorio de PD-Build |

### Los Principios de Diseño son Transversales

Los principios de diseño no son un nodo en el árbol — son un filtro que cruza todas las capas. Un principio como "Quiet UI" opera en la capa Estratégica (es un valor de diseño), la Estructural (restringe alcance de features), la Comportamental (moldea patrones de interacción), y la de Materialización (dicta densidad visual).

Cada principio en `STRATEGIC_VISION.md` declara en qué capas opera.

### Relación con los Insights

Los insights (`[IG-XX]`) son la base de evidencia que alimenta las cuatro capas:

```
[IG-XX] insights ──→ Capa 1: informan visión, estrategia, principios
                 ──→ Capa 2: fundamentan propuestas con evidencia
                 ──→ Capa 3: dan forma a user stories y escenarios
                 ──→ Capa 4: (indirecto, vía PD-Build)
```

Cada entidad en cada capa debe trazar hacia una o más referencias `[IG-XX]`. Esta es la puerta de Homer's Car — si una propuesta de diseño, principio o feature no puede citar su evidencia, debe justificar su existencia o ser eliminada.

---

## Meta-Framework de Diseño de Producto

Extensión del modelo de 4 capas que introduce **8 niveles de especificación** mapeados dentro de las capas existentes. Combina Product Strategy, Lean UX, Domain Driven Design, Arquitectura de Producto y Atomic Design en una estructura adaptable única.

### Los 8 Niveles Dentro de las 4 Capas

```
ESTRATÉGICA (Capa 1 — por qué)
│
├── Visión
│   ¿Qué cambio queremos crear para el usuario o el mercado?
│   Cambia muy poco. Una oración.
│
├── Pilares Estratégicos
│   Las apuestas principales del producto. Sirven para filtrar decisiones:
│   si una feature no apoya un pilar, no debería estar en el roadmap.
│
└── Dominios
    Grandes áreas funcionales del producto (DDD).
    Cada dominio puede tener su propio equipo, backlog y arquitectura técnica.

ESTRUCTURAL (Capa 2 — qué)
│
├── Capacidades
│   Lo que el sistema es capaz de hacer dentro de cada dominio.
│   Puente entre estrategia y features.
│   Ejemplo: Dominio "transacciones" → Capacidades: categorización, tracking, alertas, exportación
│
├── Features
│   Funcionalidad visible para el usuario dentro de una capacidad.
│   Donde viven el roadmap, la planificación de releases y la priorización.
│
└── Módulos
    Unidades de implementación para features.
    Conectan directamente con ingeniería, arquitectura técnica, servicios.

COMPORTAMENTAL (Capa 3 — cómo interactúa el usuario)
│
└── Flujos UX
    Diseño de interacción (Lean UX): user flows, task flows, journeys, prototipos.

MATERIALIZACIÓN (Capa 4 — cómo se ve)
│
└── Sistema UI
    Design System basado en Atomic Design: tokens, átomos, moléculas, organismos, patrones.
    Componentes reutilizables para todas las features.
```

### Mapa Estructural Completo

```
VISIÓN
│
├── Pilares Estratégicos
│
├── Dominios
│   └── Capacidades
│       └── Features
│           └── Módulos
│               └── Flujos UX
│                   └── Componentes UI
```

Cada nivel reduce la complejidad y responde a una pregunta distinta del desarrollo de producto. La jerarquía conecta negocio, producto, UX e ingeniería en un sistema estructural único.

### Perfiles de Complejidad

El framework se adapta a la madurez del producto y la complejidad organizacional. No todo producto necesita los 8 niveles. Un campo `product_complexity` en `PROJECT.md` determina qué niveles están activos.

#### Simple (startup / etapa temprana)

```
Visión → Features → Flujos UX → UI
```

Niveles activos: 4. Frameworks: Lean UX + Atomic Design.
Omitir dominios, capacidades, módulos. Avanzar rápido, validar supuestos.

#### Medio (scale-up)

```
Visión → Pilares → Dominios → Features → Flujos UX → Design System
```

Niveles activos: 6. Frameworks: Product Strategy + Lean UX + Design System.
Agregar pilares estratégicos para priorización y dominios para límites de equipo.

#### Complejo (plataforma / producto grande)

```
Visión → Pilares → Dominios → Capacidades → Features → Módulos → Flujos UX → Design System
```

Niveles activos: 8. Framework completo.
Las capacidades hacen de puente entre estrategia de dominio y ejecución de features. Los módulos mapean a servicios y arquitectura técnica.

### Implicaciones para los Skills de PD-Spec

| Skill | Simple | Medio | Complejo |
|---|---|---|---|
| `/analyze` | Categoriza en features, patrones UX | + dominios, pilares | + capacidades, módulos |
| `/spec` | Visión + Features en STRATEGIC_VISION | + secciones de Dominios, Pilares | + capa de Capacidades en PROPOSALS |
| `/ship` | PRD, user stories | + journey maps, personas | + specs de arquitectura, mapas de módulos |

El perfil `product_complexity` no cambia el pipeline — cambia la **granularidad de los outputs** en cada etapa.

### Capa de Experimentación

Para productos en mercado con datos operacionales, una capa de experimentación conecta features con resultados medibles:

```
Feature: notificaciones inteligentes
  Hipótesis: los usuarios abrirán tareas más rápido
  Experimento: A/B test de tipo de notificación
  Métrica: tiempo de completado de tarea
  Resultado: [pendiente | validada | invalidada]
```

Esta capa es **transversal** — puede asociarse a cualquier feature en cualquier perfil de complejidad. Conecta la metodología Lean UX con decisiones de producto basadas en datos.

Las entidades de experimentación siguen las mismas reglas de evidencia que todas las demás: los resultados deben trazar a datos fuente, las hipótesis deben referenciar los insights que las motivaron.

### Fuentes de Producto Vivo

Para productos ya en mercado, `01_Sources/` se expande más allá de documentos de investigación para incluir datos operacionales:

| Tipo de Fuente | Ejemplos | Lo que `/extract` produce |
|---|---|---|
| **Analytics** | Métricas de uso, funnels, curvas de retención, análisis de cohortes | Patrones de comportamiento, tasas de adopción, puntos de abandono |
| **Resultados de experimentos** | Reportes de A/B tests, resultados de feature flags | Hipótesis validadas/invalidadas con evidencia estadística |
| **Datos de operación** | Tickets de soporte, encuestas NPS, logs de feedback, scores CSAT | Puntos de dolor, drivers de satisfacción, problemas recurrentes |
| **Telemetría de producto** | Tasas de adopción de features, tasas de error, métricas de rendimiento | Señales de salud del sistema, distribución de uso |

Estas fuentes habilitan la Capa de Experimentación con datos reales y transforman PD-Spec de **herramienta de investigación** a **sistema de inteligencia de producto continuo**.

**Reglas de autoridad para fuentes vivas:**
- Analytics y telemetría son autoridad `[PRIMARY]` — medición directa, no interpretación.
- Resultados de experimentos son `[PRIMARY]` cuando son estadísticamente significativos, `[INTERNAL]` en caso contrario.
- Datos de operación (tickets, NPS) son `[PRIMARY]` para la señal, pero la interpretación requiere corroboración.
- Dashboards y reportes sin datos crudos son `[SECONDARY]` — llevan el encuadre de alguien.

### Los Principios de Diseño Siguen Siendo Transversales

El meta-framework no cambia la naturaleza transversal de los principios de diseño. Un principio como "Progressive Disclosure" sigue operando en todas las capas:

- **Estratégica:** es un valor de diseño (compromiso a nivel de pilar)
- **Estructural:** restringe alcance de capacidades y complejidad de features
- **Comportamental:** moldea flujos UX (qué se muestra primero vs. qué se revela bajo demanda)
- **Materialización:** dicta estados de componentes y densidad de información

Los principios se extraen de insights `design-principle` y se fundamentan en evidencia `[IG-XX]`, sin importar el perfil de complejidad.

### Ciclos de Refinamiento

La especificación de producto no es un proceso de una sola pasada. PD-Spec soporta refinamiento iterativo donde cada ciclo introduce fuentes de mayor autoridad y aumenta la confianza del sistema.

```
/spec → /ship (entregable) → touchpoint (usuarios/stakeholders)
→ transcript de la sesión → de vuelta a 01_Sources/
→ /extract (delta) → /analyze (re-evaluar)
→ insights validados/invalidados → /spec reconstruye
```

Cada ciclo acumula calidad de evidencia:

| Ciclo | Tipos de Fuente | Perfil de Autoridad | Efecto en el Sistema |
|---|---|---|---|
| **C0 — Fundación** | Docs internos, investigación, benchmarks, briefs, análisis competitivo | Mayormente `[INTERNAL]` + `[SECONDARY]` | Base de insights establecida, visión draft, supuestos explícitos |
| **C1 — Validación** | Sesiones de ideación, entrevistas con usuarios, feedback de stakeholders, transcripts de co-creación | Se introduce `[PRIMARY]` (voz del usuario) | Insights validados o invalidados, nuevos conflictos emergen |
| **C2 — Refinamiento** | Transcripts de demos, reacciones a prototipos, notas de design review | `[PRIMARY]` se fortalece | Propuestas ajustadas, pilares confirmados o cuestionados |
| **C3+ — Producto Vivo** | Analytics, telemetría, A/B tests, tickets de soporte, NPS | `[PRIMARY]` dominante (medición directa) | Experimentación con datos reales, especificación continua |

**Qué cambia en cada ciclo:**
- **C0 → C1:** El mayor salto de autoridad. Los supuestos se convierten en evidencia o mueren. Esperar la mayor cantidad de cambios de estado de insights aquí (PENDING → VERIFIED o INVALIDATED).
- **C1 → C2:** Refinamiento estructural. El *qué* está mayormente resuelto; el *cómo* se moldea por las reacciones de usuarios a artefactos concretos.
- **C2 → C3+:** Cambio de especificación a inteligencia continua. El sistema deja de ser un proyecto y se convierte en una base de conocimiento viva.

**Soporte mecánico:** El pipeline existente maneja los ciclos sin modificación. La detección de delta procesa solo las fuentes nuevas. `/analyze` detecta cuando un nuevo claim de una sesión C1 contradice o refuerza un insight C0. Los cascade checks propagan cambios de estado a través de STRATEGIC_VISION, PROPOSALS y Outputs.

**Las fuentes de sesión siguen convenciones de nombrado** para mantener trazabilidad (ej: `sesion-idemax-2026-03-07.md`, `demo-feedback-sprint-12.md`). La estructura de carpetas en `01_Sources/` debe reflejar la procedencia del ciclo cuando sea relevante.

**Señal de convergencia:** Un proyecto está listo para el siguiente ciclo cuando la rotación de insights baja — pocos PENDING nuevos, la mayoría VERIFIED, conflictos resueltos. El contador de convergencia en `/analyze` ya rastrea esto. Baja rotación + alta verificación = momento de entregar o avanzar al siguiente ciclo.

### Perfiles de Equipo y Autonomía del Lead

PD-Spec sirve a diferentes contextos de equipo con necesidades fundamentalmente distintas. La propuesta de valor cambia completamente según quién lo usa.

#### Segmentos de Mercado — Evaluación Honesta

| Segmento | Problema Central | Rol de PD-Spec | Fuerza de la Propuesta |
|---|---|---|---|
| **Founder solo / sin diseñador** | "No sé qué debería existir" | **Es** el equipo de diseño | Muy alta — no existe alternativa |
| **Startup (1-2 diseñadores)** | "No podemos construir la estructura que necesitamos solos" | Columna vertebral estructural | Muy alta — da estructura que no pueden pagar |
| **Empresa establecida con deuda de diseño** | "Tenemos 10+ años de producto pero cero proceso de diseño" | Reconstrucción y formalización del diseño | Muy alta — nadie más hace esto |
| **Scale-up con Lead (2-5 diseñadores)** | "Sabemos qué hacer pero no nos da el tiempo para formalizar y unificar todo" | Amplificador del Lead | Alta — ahorro de tiempo real, el Lead mantiene control |
| **Scale-up establecido (5-10 diseñadores)** | "Cada squad hace lo suyo, la coherencia se pierde" | Motor de coherencia cross-equipo | Media — compite con herramientas existentes, depende de adopción del Lead |
| **Enterprise (50+ diseñadores, multi-producto)** | "Necesitamos visibilidad entre squads y memoria institucional" | Research ops + design intelligence | Baja hoy, viable en Wave 5-6 — requiere SaaS + integraciones |

El **sweet spot hoy** son founders solos hasta empresas establecidas con deuda de diseño (filas 1-4). Aquí es donde pd-spec está genuinamente diferenciado y el product-market fit es más fuerte.

#### Por Qué Cada Segmento es Diferente

**Startups** necesitan **prescripción**. No tienen un modelo mental para la estructura de diseño de producto. pd-spec les dice en qué pensar — dominios, pilares, capacidades — conceptos que no habrían formalizado por su cuenta. El meta-framework actúa como una metodología de diseño embebida.

**Empresas establecidas con deuda de diseño** necesitan **reconstrucción**. Son empresas con 10+ años de producto, 10-30+ desarrolladores, usuarios reales e ingresos — pero cero o casi cero equipo de diseño a lo largo de su historia. Las decisiones de UX las tomaron developers durante una década. El producto funciona, pero carga inconsistencias acumuladas masivas, patrones ad-hoc, y cero documentación de por qué las cosas son como son.

El rol de pd-spec aquí es único: **reconstruir la especificación de diseño que debería haber existido desde el principio**. El sistema puede:
- Ingerir lo que ya existe — flujos actuales, screenshots, tickets de soporte, feedback acumulado de usuarios, specs técnicas que implícitamente contienen decisiones de UX
- Extraer principios de diseño implícitos — "el producto ya tiene un lenguaje de diseño, nadie lo escribió"
- Detectar inconsistencias — "este flujo usa 3 pasos, este equivalente usa 7"
- Construir la especificación retroactivamente, fundamentada en evidencia del producto real

Este segmento entra a los Ciclos de Refinamiento en C1-C3, no en C0. Las "fuentes" no son documentos de investigación — son artefactos de decisiones implícitas que necesitan hacerse explícitas. La Capa de Experimentación es inmediatamente relevante porque el producto está vivo y generando datos.

**Ventana de fuentes — no arqueología.** El objetivo no es reconstruir la historia completa de un producto. Lo que importa es suficiente contexto para entender el estado actual:

| Etapa de la empresa | Ventana de fuentes recomendada | Justificación |
|---|---|---|
| **Startup (< 1 año)** | 1-3 meses | Historial limitado, iteración rápida, fuentes frescas |
| **Empresa en crecimiento (1-5 años)** | ~6 meses | Cubre decisiones recientes + patrones actuales. Suficiente para el 90% de los casos |
| **Empresa establecida (5+ años)** | ~12 meses (caso extremo) | Solo cuando ha habido un cambio reciente significativo (pivote, rediseño, nuevo mercado) |

Más allá de 12 meses, los retornos decrecientes pegan fuerte. Tickets viejos, specs desactualizadas y flujos deprecados agregan ruido, no señal. El sistema debe reconstruir la **realidad actual del producto**, no toda su genealogía.

Caso de referencia clave: **Timining** — 13 años desarrollando soluciones, ha tenido diseñadores ocasionales a lo largo del tiempo (actualmente cero), producto en uso activo. pd-spec no necesita ingerir 13 años de historia — 6-12 meses de tickets recientes, flujos actuales y feedback activo de usuarios es suficiente para reconstruir la especificación de diseño que nunca tuvieron.

**Este segmento puede ser el caso más convincente de pd-spec** — reconstruir una especificación de diseño coherente a partir de 6 meses de artefactos reales de producto es algo que un sistema IA puede hacer en días. Un consultor humano tardaría semanas y costaría 10 veces más.

**Scale-ups con Lead** necesitan **amplificación**. El Lead ya conoce DDD, Lean UX, Design Sprints. El problema no es conocimiento — es tiempo. Un equipo de 3 diseñadores sirviendo a 15 developers no puede mantener el ritmo de formalización. pd-spec detecta lo que el equipo ya hace implícitamente (dominios implícitos, principios no documentados, patrones no escritos) y ayuda al Lead a formalizar sin partir de cero.

**Enterprise** necesita **visibilidad y memoria**, no metodología. Una organización de 50 diseñadores entre marketplace, pagos, logística y ads no necesita que pd-spec le diga qué es un dominio. Necesita saber que la última propuesta del squad de Pagos contradice un principio de diseño que el squad de Plataforma validó hace 6 meses — y nadie lo detectó porque viven en archivos Figma diferentes, boards de Jira diferentes, canales de Slack diferentes.

#### El Pitch Enterprise No es "Equipo de Diseño IA"

Llegar a una organización de diseño experimentada y decir "esta IA puede ser tu equipo de diseño" es fuera de lugar. Ellos SON el equipo de diseño. El pitch para enterprise es fundamentalmente diferente:

**Research Ops + Design Intelligence:**
1. **Síntesis de investigación cross-squad** — Ingerir research de múltiples squads, cruzar hallazgos, detectar conflictos que nadie ve porque viven en silos
2. **Registro de decisiones de diseño** — Cada decisión del design system trazable a evidencia. Cuando alguien pregunta "¿por qué este pattern?", el sistema responde con referencias `[IG-XX]`
3. **Detección de drift** — Monitoreo continuo de coherencia entre lo que los squads proponen y los pilares/principios vigentes
4. **Memoria institucional** — La gente rota, el conocimiento se queda. La cadena de trazabilidad sobrevive los cambios de equipo

El Lead no pierde control — **gana visibilidad**. pd-spec no le dice qué hacer, le muestra qué está pasando entre squads con evidencia trazable.

#### Viabilidad Enterprise — Dependencias del Roadmap

pd-spec está migrando activamente de CLI a webapp SaaS con IA embebida (migración a SDK completa en v4.27.0, webapp operacional). Las precondiciones para enterprise están en el roadmap, no en un universo paralelo:

| Precondición | Estado Actual | Roadmap |
|---|---|---|
| Plataforma SaaS (no solo CLI) | Webapp existe (React 19 + Express 5 + Agent SDK) | Operacional, expandiéndose |
| Multi-proyecto | Un proyecto por repo | Wave 3 ("Self-Service") |
| Carga de archivos / picker de Drive | Población manual de `01_Sources/` | Wave 3 |
| Integraciones (Figma, Jira, Confluence) | Ninguna | Habilitadas arquitecturalmente vía MCP servers, Wave 5+ |
| Permisos, roles, audit trails | Usuario único | Wave 4-5 |
| Ruteo multi-modelo | Parcial (Haiku/Sonnet) | Wave 5 ("Escala") |
| APIs para consumo externo | SDK es la base | Wave 5+ |

**Timeline honesto:** La preparación para enterprise es alcance de Wave 5-6. La arquitectura lo soporta, el roadmap apunta ahí, pero no es el producto de hoy. Intentar vender enterprise antes de que estas piezas estén ensambladas dañaría la credibilidad.

#### Empaquetado de Producto — Un Motor, Múltiples Productos

Los segmentos tienen propuestas de valor, lenguaje, onboarding y pricing diferentes. Deben empaquetarse como productos separados compartiendo el mismo motor:

```
PD-Spec Engine (skills + pipeline + SDK)
│
├── AI Design Team (producto para startups)
│   Objetivo: founders solos, indie hackers, PMs sin equipo de diseño
│   Modo: Auto | Perfil: Simple
│   Pitch: "Tu equipo de diseño desde el día uno"
│   Superficie: MCP App u onboarding simplificado de la webapp
│   Pricing: self-service, freemium o tarifa plana baja
│
├── PD-Spec Pro (empresas establecidas + scale-ups)
│   Objetivo: empresas con deuda de diseño, scale-ups con Lead
│   Modo: Guided / Manual | Perfil: Medio-Complejo
│   Pitch: "Profesionaliza el diseño que ya tienes"
│   Superficie: webapp completa con configuración de Lead
│   Pricing: suscripción o basado en consultoría
│
└── PD-Spec Governance (enterprise, Wave 5-6)
    Objetivo: organizaciones de diseño multi-squad
    Modo: Governance | Perfil: Complejo
    Pitch: "Research ops + design intelligence entre squads"
    Superficie: plataforma SaaS con integraciones
    Pricing: contratos enterprise
```

El motor, skills y pipeline son compartidos. Lo que cambia por producto:
- **Flujo de onboarding** — wizard vs. discovery guiado vs. setup organizacional
- **Configuración por defecto** — perfil de complejidad, modo de framework, niveles activos
- **Lenguaje y tono** — empoderador vs. profesional vs. institucional
- **Tipos de fuente esperados** — ideas y briefs vs. artefactos de producto existente vs. research multi-equipo
- **Modelo de pricing** — self-service vs. premium vs. enterprise

Esto se alinea con la decisión arquitectónica existente de coexistencia entre webapp y MCP App como dos productos sobre el mismo motor. Extiende el patrón a una tercera superficie para enterprise cuando llegue el momento.

#### Modos de Configuración del Framework

Un campo `framework_mode` en `PROJECT.md` determina cuánta autonomía toma pd-spec en decisiones estructurales:

| Modo | Segmento Objetivo | Quién decide la estructura | Comportamiento de PD-Spec |
|---|---|---|---|
| **Auto** | Startups, founders solos | pd-spec sugiere basado en fuentes | Detecta complejidad, propone niveles y categorías, pide confirmación |
| **Guided** | Scale-ups con Lead | Lead configura, pd-spec respeta | Detecta patrones, presenta hallazgos, Lead ajusta y confirma |
| **Manual** | Equipos con frameworks establecidos | Lead define todo | Motor de ejecución puro — sin opiniones estructurales |
| **Governance** | Enterprise, multi-squad | La organización tiene estructura propia | Auditor cross-equipo — detecta drift, conflictos y brechas entre squads |

**Modo Auto** es el default para proyectos nuevos. pd-spec propone un perfil de complejidad y framework basado en análisis de fuentes. Apropiado cuando no existe expertise en diseño.

**Modo Guided** es el sweet spot para scale-ups. El flujo:

```
/kickoff o primera ejecución de /spec
→ pd-spec detecta patrones en las fuentes
→ presenta: "Detecto N dominios implícitos, M capacidades,
   estos principios de diseño emergentes"
→ sugiere: "Esto se alinea con [DDD + Lean UX].
   ¿Quieres usar esta estructura o definir la tuya?"
→ Lead ajusta: "Dominios sí, pero las capacidades
   las manejo como épicas. Agrega una capa de design tokens."
→ pd-spec guarda la configuración en PROJECT.md
→ todos los skills respetan esa estructura de ahí en adelante
```

**Regla crítica:** Una vez que el Lead configura, pd-spec no vuelve a cuestionar. No dice "pero DDD sugeriría..." en cada ejecución de `/analyze`. El Lead decidió, pd-spec ejecuta. El sistema puede presentar observaciones cuando nuevas fuentes revelan cambios estructurales significativos (ej: un nuevo dominio emergente), pero las presenta como observaciones, nunca como correcciones.

**Modo Manual** es para equipos con frameworks establecidos. pd-spec se convierte en un motor de ejecución puro — categorizar, analizar, especificar, entregar — usando la estructura existente del equipo sin opiniones.

**Modo Governance** requiere soporte multi-proyecto e integraciones (Wave 5+). En este modo:
- pd-spec no propone estructura (la organización ya tiene una)
- No sugiere frameworks (ya usan los propios)
- Ingiere fuentes de múltiples squads/equipos/productos
- Detecta conflictos cross-equipo, no solo cross-fuente
- Mantiene trazabilidad como sistema de registro
- Reporta drift: "estas 3 propuestas nuevas no se alinean con los pilares vigentes"
- Sirve como input para design reviews y reuniones de gobernanza
- El Lead/Head of Design usa pd-spec para visibilidad, no para dirección

#### Categorías de Insight Editables

Las categorías de insight por defecto en `/analyze` (`user-need`, `pain-point`, `behavior-pattern`, `market-context`, `design-principle`, `technical-constraint`) son un punto de partida, no un esquema fijo.

En modos **Guided** y **Manual**, el Lead puede:
- **Renombrar** categorías para que coincidan con el vocabulario del equipo
- **Agregar** categorías específicas del dominio (ej: `accessibility`, `regulatory`, `brand-language`)
- **Fusionar** categorías que el equipo no distingue
- **Eliminar** categorías irrelevantes para su contexto

Las categorías personalizadas se almacenan en `PROJECT.md` bajo un campo `custom_categories`. `/analyze` las usa en vez de las predeterminadas cuando están presentes. Cada categoría personalizada necesita:
- Un nombre
- Una descripción de una línea (para que el agente sepa qué pertenece ahí)
- Reglas de autoridad (opcional — usa los gates estándar por defecto)

El sistema recomienda categorías basado en análisis de fuentes. El Lead edita y confirma. Desde ese punto, la configuración es estable a menos que el Lead la cambie.

#### Glosario de Vocabulario (Futuro)

> **Estado:** Diseñado, no implementado. Documentado aquí como concepto comprometido para desarrollo futuro.

Los equipos tienen su propio lenguaje. Un Lead de Diseño que llama a los design principles "Pilares de Diseño" debería ver ese término en todas partes — en `STRATEGIC_VISION.md`, en outputs de `/ship`, en la comunicación del agente.

El glosario es una **capa de traducción conceptual**, no lingüística (eso es `output_language`). Mapea los términos canónicos internos de pd-spec al vocabulario preferido del equipo:

```yaml
# PROJECT.md — overrides de vocabulario
glossary:
  design_principles: "Pilares de Diseño"
  domains: "Áreas de Producto"
  capabilities: "Épicas"
  features: "Funcionalidades"
  strategic_pillars: "Apuestas Estratégicas"
  insights: "Hallazgos"
  proposals: "Iniciativas"
```

**Reglas de propagación:**
- Todo texto visible al usuario usa los términos del glosario (headers de archivos, títulos de secciones, mensajes del agente, outputs de `/ship`)
- La lógica interna de los skills usa los términos canónicos (los skills no se rompen cuando cambia el vocabulario)
- Los identificadores `[IG-XX]`, `[DP-XX]`, `[CF-XX]` permanecen sin cambio (son identificadores del sistema, no vocabulario)
- El glosario se aplica después de `output_language` — primero traducir al idioma objetivo, luego aplicar overrides de vocabulario

**Consideraciones de implementación:**
- Requiere un paso de renderizado en cada skill que produce output visible al usuario
- Los nombres de archivo (`STRATEGIC_VISION.md`, `PROPOSALS.md`) permanecen canónicos para no romper el pipeline
- Los headers de sección dentro de esos archivos usan los términos del glosario
- La comunicación del agente (propuestas, confirmaciones, resúmenes) usa los términos del glosario

### Priorización como Output

> **Estado:** Capacidad requerida. Versión simplificada para startups, diseño completo pendiente.

El meta-framework establece la regla de filtrado: *si una feature no apoya un pilar estratégico, no debería estar en el roadmap*. Pero pd-spec actualmente produce propuestas `[DP-XX]` sin orden de prioridad explícito.

Para que PD-Spec funcione como equipo de diseño AI, debe responder **"¿qué construimos primero?"** — no solo "¿qué deberíamos construir?"

**Priorización mínima viable (todos los perfiles):**
- Cada `[DP-XX]` en `PROPOSALS.md` declara qué pilares estratégicos apoya
- Propuestas con mayor cobertura de pilares y evidencia más fuerte (cantidad de `[IG-XX]` + nivel de autoridad) rankean más alto
- `/spec` presenta las propuestas en orden de prioridad, no de inserción

**Adiciones para scale-up y complejo (futuro):**
- Estimación de impacto × esfuerzo (Lead provee esfuerzo, sistema provee impacto basado en evidencia)
- Mapeo de dependencias entre propuestas (X bloquea Y)
- Priorización a nivel de capacidad (qué capacidades construir primero según alineación con pilares)
- Generación de roadmap como tipo de output de `/ship`

**Preguntas abiertas de diseño:**
- ¿La priorización debería ser automática (sistema rankea por evidencia) o guiada (sistema propone, Lead reordena)?
- ¿Cómo manejar conflictos de prioridad (propuesta apoya Pilar A fuertemente pero Pilar B débilmente)?
- ¿La prioridad debería ser propiedad de la propuesta o una vista separada?

---

## Registro de Decisiones

Decisiones ya tomadas durante el diseño de este framework. Extraídas del texto donde estaban implícitas. Están resueltas — no abiertas a re-evaluación a menos que nueva evidencia las invalide.

### Decisiones de Arquitectura

| ID | Decisión | Justificación |
|---|---|---|
| **D-01** | Modelo de 4 capas (Estratégica/Estructural/Comportamental/Materialización) como contenedor permanente | Probado a lo largo de 4 ciclos de QA y múltiples proyectos. El meta-framework lo extiende, no lo reemplaza. |
| **D-02** | 7 patrones extraíbles (Persistencia de Estado, Puerta HITL, Input Inmutable, Detección de Delta, Compresión Semántica, Skills Componibles, Escape Estructurado) | Surgieron orgánicamente del uso real. Descriptivos, no prescriptivos. |
| **D-03** | Los 8 niveles del meta-framework se mapean dentro de las 4 capas, no al lado | Evita dos modelos estructurales compitiendo. Las 4 capas son el esqueleto, los 8 niveles son los órganos. |
| **D-04** | La estructura guía el descubrimiento, la evidencia restringe la estructura | Resuelve la tensión bottom-up vs. top-down. El meta-framework es un **lente, no un molde**. El Mandato #1 del Agente (No Hallucination) tiene precedencia — si la evidencia no soporta un nivel, ese nivel queda vacío. Nunca llenar un nivel del framework sin soporte `[IG-XX]`. |
| **D-05** | Los principios de diseño son transversales, no un nodo en la jerarquía | Un principio como "Quiet UI" opera en las 4 capas simultáneamente. Cada principio declara en qué capas afecta. |

### Decisiones de Producto

| ID | Decisión | Justificación |
|---|---|---|
| **D-06** | Tres perfiles de complejidad: simple / medio / complejo | No todo producto necesita 8 niveles. `product_complexity` en PROJECT.md determina niveles activos. |
| **D-07** | Cuatro modos de framework: Auto / Guided / Manual / Governance | Diferentes segmentos necesitan diferentes niveles de autonomía de pd-spec. Modo almacenado en `framework_mode` en PROJECT.md. |
| **D-08** | Un motor, tres productos (AI Design Team / PD-Spec Pro / PD-Spec Governance) | Mismos skills y pipeline, diferente empaquetado, onboarding, pricing y tono por segmento. |
| **D-09** | Sweet spot hoy: founders solos → empresas con deuda de diseño → scale-ups con Lead | Enterprise (Governance) es Wave 5-6. No vender lo que no se puede entregar aún. |
| **D-10** | El pitch enterprise es "research ops + design intelligence", nunca "equipo de diseño IA" | Decirle a una organización de 50+ diseñadores que la IA puede ser su equipo de diseño es fuera de lugar. Necesitan visibilidad, no reemplazo. |
| **D-11** | La priorización es un output requerido, no opcional | pd-spec debe responder "qué primero", no solo "qué". Mínimo viable: propuestas ordenadas por cobertura de pilares × fuerza de evidencia. |
| **D-12** | Ventana de fuentes: ~6 meses estándar, ~12 meses extremo, 1-3 meses para startups | No es arqueología. Suficiente contexto para entender la realidad actual del producto, no toda su genealogía. |

### Decisiones de Framework

| ID | Decisión | Justificación |
|---|---|---|
| **D-13** | Ciclos de Refinamiento (C0→C3+) como modelo de iteración | El loop de feedback ya sucede en la práctica (Timining: touchpoints → sesiones idemax → de vuelta a sources). Nombrarlo lo convierte en método, no en accidente. |
| **D-14** | Categorías de insight editables (sistema recomienda, Lead ajusta) | Las categorías por defecto son un punto de partida. Los Leads pueden renombrar, agregar, fusionar, eliminar. Almacenadas en PROJECT.md. |
| **D-15** | Las fuentes de producto vivo expanden el modelo de autoridad | Analytics/telemetría = `[PRIMARY]`. Experimentos estadísticamente significativos = `[PRIMARY]`. Datos de operación = `[PRIMARY]` para la señal, la interpretación necesita corroboración. Dashboards = `[SECONDARY]`. |
| **D-16** | La Capa de Experimentación es transversal | Se asocia a cualquier feature en cualquier perfil de complejidad. Hipótesis → experimento → métrica → resultado. Sigue las mismas reglas de evidencia que todo lo demás. |
| **D-17** | Una vez que el Lead configura, pd-spec no vuelve a cuestionar | Observaciones sobre cambios estructurales (nuevo dominio emergente) son aceptables. Correcciones ("pero DDD sugeriría...") no lo son. |

---

## Backlog de Decisiones

Decisiones pendientes, ordenadas por dependencia. Las decisiones Tier 1 desbloquean Tier 2. Tier 3 puede esperar.

### Tier 1 — Estructurales (desbloquean todo lo demás)

#### DB-01: Especificación Continua vs. Basada en Proyecto

pd-spec hoy es basado en proyecto: analizar fuentes, producir spec, entregar. Los Ciclos de Refinamiento y las Fuentes de Producto Vivo empujan hacia lo continuo: siempre ingiriendo, siempre actualizando.

No es una elección binaria — probablemente es **proyecto primero con camino de upgrade a continuo**. Pero la decisión necesita ser explícita porque cambia:
- **Modelo de negocio** — fee de proyecto único vs. suscripción continua
- **Arquitectura** — procesamiento batch vs. actualizaciones event-driven
- **UX** — estado "terminado" vs. modelo de dashboard/digest/alertas
- **Modelo de costo** — costo API único vs. costo API continuo
- **Presión en la máquina de estados** — invalidaciones semanales vs. invalidaciones raras

**Tendencia:** Basado en proyecto es el producto de lanzamiento (AI Design Team + Pro). Continuo es un upgrade para productos vivos con fuentes de analytics. El pipeline no cambia — la cadencia de ingesta de fuentes sí.

**Depende de:** Nada. Desbloquea DB-02, DB-03, DB-05.

#### DB-02: Modelo de Priorización

Confirmado como requerido (D-11) pero el modelo no está diseñado. Dimensiones clave:

- **¿Automático vs. guiado?** Probablemente ambos — sistema propone ranking basado en evidencia, Lead puede reordenar. Modo Auto usa ranking del sistema directamente.
- **¿Propiedad vs. vista?** Propiedad en la propuesta (`priority_score`) + output ordenado. Vista de "roadmap" separada como tipo de output de `/ship`.
- **¿Simplificado vs. completo?** Simplificado para startups (solo ponderado por evidencia). Completo para scale-ups agrega estimación de esfuerzo (Lead provee), mapeo de dependencias, y rollup a nivel de capacidad.

**Depende de:** DB-01 (el modelo continuo afecta si las prioridades se auto-actualizan con datos nuevos).

### Tier 2 — Se resuelven una vez que Tier 1 está decidido

#### DB-03: Formatos de Ingesta de Fuentes Vivas

¿Qué formatos de archivo acepta `/extract` para analytics, experimentos y datos de operación?

**Respuesta probable una vez decidido DB-01:** Si basado en proyecto, resúmenes en Markdown y exports CSV son suficientes (usuario cura antes de ingerir). Si continuo, necesita templates estructurados y posiblemente conectores API.

**Depende de:** DB-01.

#### DB-04: Tracking de Evolución de Insights Cross-Ciclo

¿Deberían los insights llevar metadata sobre qué ciclo los confirmó/cambió?

**Respuesta probable:** Metadata liviana en el insight mismo (`cycle: C1`, `confirmed_by: sesion-idemax-2026-03-07.md`). Vista de auditoría separada es over-engineering por ahora.

**Depende de:** DB-01 (el modelo continuo hace esto más importante).

#### DB-05: Auto-Detección de Complejidad de Producto

¿Puede pd-spec detectar confiablemente el perfil de complejidad correcto desde las fuentes en modo Auto?

**Respuesta probable:** Sugerir con paso de confirmación. Nunca auto-aplicar. Señales: cantidad de dominios, referencias a equipo/organización, volumen de fuentes, menciones de arquitectura.

**Depende de:** DB-02 (el perfil de complejidad afecta la granularidad de priorización).

### Tier 3 — Independientes, resolver cuando se necesiten

#### DB-06: Implementación del Glosario de Vocabulario

Diseñado (ver sección de Glosario de Vocabulario arriba). La implementación requiere un paso de renderizado en cada skill. No bloquea — el sistema funciona sin él, es un refinamiento de UX.

**Cuándo decidir:** Cuando un Lead real lo solicite. No construir especulativamente.

#### DB-07: Soporte Multi-Framework en Modo Guided

¿Puede un Lead usar DDD para dominios + JTBD para capacidades + Design Sprints para UX en el mismo proyecto?

**Respuesta probable:** El glosario + categorías editables puede ser suficiente. Si no, revisitar cuando un segundo Lead solicite personalización estructural que las categorías no puedan expresar.

**Cuándo decidir:** Después del primer piloto scale-up con un Lead real.

#### DB-08: Contrato de Integración con PD-Build

¿Qué niveles del meta-framework consume PD-Build? ¿Necesita perfiles de complejidad?

**Respuesta probable:** PD-Build siempre opera a granularidad completa para su dominio (Módulos + Sistema UI). No necesita conocer el perfil de complejidad del proyecto fuente — recibe la estructura que exista.

**Cuándo decidir:** Cuando se retome activamente el desarrollo de PD-Build.

#### DB-09: Enterprise — Capital Político y Confianza

¿Cómo gana pd-spec credibilidad organizacional en equipos de diseño maduros?

**Camino probable:** Empezar como auditor de solo lectura → probar valor con hallazgos cross-equipo no obvios → gradualmente ganar influencia. Los outputs del modo Governance son "observaciones para que el Lead actúe", nunca "recomendaciones".

**Cuándo decidir:** Wave 5-6, informado por pilotos Pro con Leads de scale-up.

#### DB-10: Enterprise — Arquitectura de Integración

¿Qué MCP servers construir vs. consumir de la comunidad?

**Cuándo decidir:** Wave 5-6. Para entonces el ecosistema MCP será más maduro y el tradeoff construir-vs-consumir será más claro.
