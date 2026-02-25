# Lean Canvas — TIMining

> v1.0 | 2026-02-24 | 16 insight refs · 1 gap marcado (CF-08)

---

## Resumen (tabla)

| Bloque | Contenido | Evidencia |
|---|---|---|
| **Problema** | Brecha geométrica plan-realidad · Decisiones críticas por WhatsApp/radio · Fragmentación de herramientas | [IG-SYNTH-01], [IG-03], [IG-SYNTH-10] |
| **Segmentos de clientes** | Operaciones (Jefe de Turno, Despachador, Gerente de Mina) · CFO · El comprador real: "el Excel" | [IG-SYNTH-09], [IG-06], [IG-05] |
| **Propuesta de valor única** | "Ayúdame a tomar la mejor decisión porque yo no tengo tiempo" — confianza en la información, no más datos | [IG-SYNTH-16], [CF-12] |
| **Solución** | Geometry Engine (topografía RT) · TIM Agent D→A→R · Efecto Suiza (integración agnóstica) | [IG-SYNTH-01], [IG-SYNTH-06], [IG-SYNTH-05] |
| **Canales** | Venta consultiva (ciclo 2 años) · Adopción bottom-up "operational pull" | [IG-SYNTH-14], [IG-SYNTH-17] |
| **Flujos de ingresos** | USD 450k/faena/año · Licenciamiento ilimitado por sitio | [IG-SYNTH-16b] |
| **Estructura de costos** | [GAP] — sin datos de unit economics disponibles | [CF-08] |
| **Métricas clave** | % Adherencia espacial · Usuarios activos/sitio · Ahorros capturados USD | [IG-SYNTH-12] |
| **Ventaja injusta** | Algoritmo topográfico propietario · 60 reglas operacionales propietarias | [IG-SYNTH-01], [IG-08] |

---

## Problema

### 1. Brecha geométrica plan-realidad ("Geometry Gap")

El plan minero es una entidad geométrica estática. La operación real es dinámica, ruidosa y cambiante. La industria intentó cerrar esta brecha con más sensores; falló porque no es posible optimizar lo que no se ve geométricamente. Los desvíos del plan no ocurren una vez al año sino en cada turno, y un 5% de mejora en adherencia puede agregar USD 15B de valor anual a la industria. [IG-SYNTH-01]

### 2. Decisiones críticas fuera del sistema

El CTO de TIMining lo describe con precisión: "*impresionante la cantidad de toma de decisiones que ocurren día a día en la operación, vía WhatsApp*." TIMining pierde el 90% de la información operacional si no integra ese canal. Las radios tampoco quedan registradas. El conocimiento entre jefes de turno se evapora ("Efecto Gaviota"). [IG-03], [IG-SYNTH-15]

### 3. Fragmentación de herramientas — el comprador real es el Excel

TIMining tiene 7 productos desarrollados en momentos distintos con tecnologías distintas, sin autenticación unificada. El CEO sintetizó el problema competitivo: "*Mi cliente no es tecnología — mi cliente es el Excel.*" La venta debe centrarse en outcomes y procesos familiares, no en capacidades técnicas. La fragmentación actual impide presentar una plataforma coherente que desplace ese Excel. [IG-SYNTH-10], [IG-05]

---

## Segmentos de clientes

### Operaciones — Usuarios directos

Cuatro perfiles diferenciados con necesidades radicalmente distintas [IG-SYNTH-09]:

| Perfil | Contexto de uso | Necesidad crítica |
|---|---|---|
| **Despachador** | Sala de control, pantalla fija | Control segundo a segundo del movimiento de equipos |
| **Jefe de Turno** | En terreno, sin pantalla disponible | Alertas tácticas por voz/push antes de llegar a la sala |
| **Gerente de Mina** | Celular, visión agregada | Semáforo de cumplimiento de plan desde cualquier lugar |
| **Planificador** | Desktop, análisis profundo | Acceso a historial, simulaciones, conciliación plan-real |

Hoy Aware presenta la misma interfaz para todos, sin diferenciación por perfil.

### CFO — Segmento estratégico emergente

Existe un tercer gap no resuelto: la desconexión mina-planta. Operaciones y finanzas no se hablan. TIMining puede articular datos operacionales con KPIs financieros, haciendo de la plataforma una herramienta de reporting ejecutivo con valor tangible para el CFO. [IG-06]

### El comprador real: el Excel

El posicionamiento correcto no es reemplazar un software de minería — es reemplazar el proceso de Excel y radio que hoy toman las decisiones. El comprador con presupuesto es quien usa Excel para alinear operaciones con plan. Si CORE no habla el idioma de ese proceso, no hay venta. [IG-05]

---

## Propuesta de valor única

> *"Ayúdame a tomar la mejor decisión porque yo no tengo tiempo."*

Esta frase, validada como framing externo aprobado en el Touchpoint del 19-feb, captura el valor de TIMining CORE con precisión operacional. El comprador — CEO, Jefe de Mina, con agenda saturada — no compra "paz mental" (abstracción emocional); compra tiempo recuperado y confianza en la información. [CF-12 RESOLVED]

**Framing interno de diseño:** "Paz mental" se mantiene como principio interno de UX: cada interacción debe reducir la carga cognitiva, no aumentarla. Si una pantalla genera más preguntas que respuestas, está fallando. [IG-SYNTH-16]

**Diferenciación clave:** No es un dashboard más. Es el paso de "kiosco de datos" a "médico operacional que diagnostica y prescribe." El valor no está en visualizar datos sino en eliminar el tiempo entre detectar un problema y saber qué hacer con él. [IG-SYNTH-04]

---

## Solución

### Geometry Engine — El dato fundacional

Algoritmo propietario que infiere topografía en tiempo real cada 15 minutos usando datos GPS de equipos existentes, sin drones. Ningún competidor puede correr simulaciones sobre topografía que se actualiza a esa frecuencia. Este es el moat técnico central: el plan no es una hoja de cálculo financiera — es un volumen geométrico. [IG-SYNTH-01]

Métrica de negocio derivada: adherencia espacial (plan compliance) como sustituto de "toneladas movidas." Resultados probados: +9-19% adherencia, USD 10M+ en ahorros en 3 minas, USD 6M capturados en 5 meses en una sola faena. [IG-SYNTH-12]

### TIM Agent — Patrón D→A→R

Toda funcionalidad de CORE sigue el patrón Detección → Análisis → Recomendación, validado por 20 casos de uso del Workshop 01. El copiloto inteligente opera en lenguaje natural (Gemini), corre simulaciones automáticas cada X minutos, y rankea sugerencias de acción con métricas de impacto. [IG-SYNTH-06], [IG-SYNTH-04], [IG-SYNTH-08]

Las 60 reglas de negocio propietarias (dispatching, cambio de turno, secuencias de salida) actúan como capa de validación: impiden que la IA genérica genere recomendaciones operacionalmente inválidas. Este es el diferenciador real vs. LLMs conectados a datos mineros. [IG-08]

### Efecto Suiza — Integración agnóstica

En una industria donde Hexagon, Sandvik y Caterpillar compran competidores para crear lock-in, TIMining se integra con OEMs competidores entre sí (Komatsu, Cat, Modular) y software de planificación (Maptek, Deswik). El resultado: OEMs integran con TIMining incluso cuando no integran entre sí. Ser el hub neutral es un diferenciador estructural. [IG-SYNTH-05]

---

## Canales

### Venta consultiva (canal actual)

TIMining invierte 30-36 horas por caso de renovación. El ciclo de venta dura 2 años, más 6 meses de instalación. El equipo de servicios es "las manos del cerebro del cliente." Esta dependencia limita la escalabilidad del modelo SaaS: cada nuevo cliente requiere una inversión de tiempo significativa del equipo interno. [IG-SYNTH-14]

> **[GAP]** — No hay datos sobre CAC desglosado por canal, eficiencia de la venta consultiva vs. inbound/referral, ni plan documentado para reducir el ciclo de venta. [CF-08]

### Adopción bottom-up — "Operational Pull"

El modelo de adopción arranca con equipos de operaciones y se expande orgánicamente a 100+ usuarios activos por sitio. La "stickiness" se genera al embeber la herramienta en rutinas de cambio de turno. La tracción interna acelera acuerdos corporativos. [IG-SYNTH-17]

**Condición crítica:** el operador debe percibir CORE como herramienta de ayuda, no de auditoría. Cuando planificación la usa para auditar operadores, estos resisten activamente — riesgo de bloquear el modelo bottom-up. [IG-04], [CF-13 PENDING]

---

## Flujos de ingresos

Modelo de licenciamiento por faena, usuarios ilimitados por sitio:

| Producto | Precio actual | Precio objetivo |
|---|---|---|
| Aware (actual) | USD 300k/faena/año | — |
| CORE (objetivo) | — | USD 450k/faena/año |

Existe una desconexión entre precio y valor capturado: USD 6M capturados en 5 meses en una faena que paga USD 300k. La oportunidad de repricing es clara — pasar de "licencia de software" a "valor empresarial." El modelo de licenciamiento ilimitado facilita la adopción masiva (meta: 100+ usuarios activos/sitio) que consolida la stickiness. [IG-SYNTH-16b]

> **[GAP]** — Sin datos disponibles sobre breakdown de revenue, márgenes, CAC, LTV, ni modelo financiero formal. Pendiente de obtener del equipo de finanzas o CFO. [CF-08 PENDING]

---

## Estructura de costos

> **[GAP]** — No hay datos de unit economics disponibles en las fuentes actuales. Se mencionan cifras sueltas (USD 10M ahorros, USD 5M ARR) pero sin breakdown de costos operacionales, CAC, margen de servicios, ni costo de implementación por cliente. Pendiente: solicitar financial model al CFO/equipo de finanzas. [CF-08 PENDING]

Costos inferibles (sin confirmación financiera):
- Costo de servicios profesionales: alto — ciclo 2 años + 6 meses instalación, 30-36h por renovación. [IG-SYNTH-14]
- Deuda técnica: stack fragmentado en C++, Unity, Go, Python sin autenticación unificada. Migración a CORE tiene costo de ingeniería no cuantificado. [IG-SYNTH-13]
- Costo de customización: todo 2025 comprometido en customización con un solo cliente — patrón "Auto de Homero Simpson" que reduce márgenes. [IG-SYNTH-02]

---

## Métricas clave

### Métrica de producto — Adherencia espacial

Porcentaje de cumplimiento geométrico del plan minero (no toneladas movidas). Este es el cambio de paradigma central: medir si la operación real sigue el volumen geométrico planificado, no si mueve la cantidad esperada. Resultados actuales: +9-19% adherencia. [IG-SYNTH-12]

### Métricas de adopción

- **Usuarios activos/sitio** — meta: 100+ por faena (vs. 30% de uso actual en Orchestra). [IG-SYNTH-08], [IG-SYNTH-11]
- **Stickiness de turno** — porcentaje de cambios de turno donde se usa el briefing automático. [IG-SYNTH-17], [IG-SYNTH-15]
- **Decisiones capturadas** — porcentaje de decisiones operacionales registradas en plataforma vs. WhatsApp/radio. [IG-03]

### Métricas de valor económico

- **Ahorros capturados USD** — valor demostrado: USD 10M+ en 3 minas, USD 6M en 5 meses en una faena. [IG-SYNTH-12]
- **Ratio valor/precio** — USD 6M capturados / USD 300k precio = 20x. Argumento de venta y base del repricing a USD 450k. [IG-SYNTH-16b]

---

## Ventaja injusta

### Algoritmo topográfico propietario

Inferencia de topografía en tiempo real cada 15 minutos usando datos GPS de equipos existentes. Ningún competidor tiene capacidad equivalente. Este algoritmo es el fundamento del Geometry Engine y el diferenciador técnico no replicable en el corto plazo. [IG-SYNTH-01]

### 60 reglas operacionales propietarias

Lógica operacional acumulada (dispatching, cambio de turno, secuencias de salida) que convierte IA genérica en recomendador confiable. Sin estas reglas, los LLMs alucinan en contexto minero. Con ellas, TIMining tiene el único agente de IA que no puede equivocarse operacionalmente. [IG-08]

### Posición neutral — Efecto Suiza

Ser el hub de integración agnóstico en una industria de lock-in genera un efecto de red: cada nuevo OEM integrado aumenta el valor de la plataforma para todos los clientes existentes. Este posicionamiento es estratégico y difícil de replicar para actores con líneas propias de hardware o software de planificación. [IG-SYNTH-05]

---

## Insights Summary

| ID | Concepto | Estado | Convergencia |
|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap — brecha geométrica plan-realidad | VERIFIED | 15/54 |
| [IG-SYNTH-02] | Auto de Homero Simpson — trampa de customización | VERIFIED | 8/54 |
| [IG-SYNTH-04] | Del Dashboard al Copiloto — paradigma proactivo | VERIFIED | 12/54 |
| [IG-SYNTH-05] | Efecto Suiza — integración agnóstica | VERIFIED | 10/54 |
| [IG-SYNTH-06] | Patrón D→A→R como esqueleto UX | VERIFIED | 26/57 |
| [IG-SYNTH-08] | Democratización del Dato — de expertos a todos | VERIFIED | 9/54 |
| [IG-SYNTH-09] | Perfiles diferenciados con necesidades distintas | VERIFIED | 13/57 |
| [IG-SYNTH-10] | De herramientas fragmentadas a plataforma CORE | VERIFIED | 10/57 |
| [IG-SYNTH-11] | Curva de aprendizaje y barrera de adopción | VERIFIED | 7/57 |
| [IG-SYNTH-12] | Adherencia espacial como métrica central | VERIFIED | 10/54 |
| [IG-SYNTH-13] | Stack tecnológico fragmentado | VERIFIED | 3/54 |
| [IG-SYNTH-14] | Dependencia de venta consultiva | VERIFIED | 4/57 |
| [IG-SYNTH-15] | Efecto Gaviota — dolor del cambio de turno | VERIFIED | 5/54 |
| [IG-SYNTH-16] | Paz Mental como propuesta de valor experiencial | VERIFIED | 7/57 |
| [IG-SYNTH-16b] | Oportunidad de repricing USD 300k → USD 450k | VERIFIED | 8/57 |
| [IG-SYNTH-17] | Adopción bottom-up — operational pull | VERIFIED | 6/57 |
| [IG-03] | WhatsApp como canal principal de decisiones | VERIFIED | 2/57 |
| [IG-04] | Resistencia de operadores cuando son auditados | VERIFIED | 1/57 |
| [IG-05] | "Mi cliente es el Excel" — framing de venta | VERIFIED | 1/57 |
| [IG-06] | Desconexión mina-planta — tercer gap | VERIFIED | 1/57 |
| [IG-08] | 60 reglas operacionales propietarias como moat | VERIFIED | 1/57 |

---

## Gaps y conflictos pendientes

| ID | Tipo | Descripción | Impacto |
|---|---|---|---|
| [CF-08] | Research Gap | Sin unit economics, CAC, LTV ni breakdown de costos | Alto — impide validar el modelo de negocio y la estrategia de pricing |
| [CF-13] | Contradicción | Resistencia de operadores vs. modelo bottom-up | Medio — afecta diseño de GTM y onboarding |
| [CF-07] | Research Gap | Sin entrevistas directas con usuarios finales | Alto — segmentos y necesidades son proxy de stakeholders |
