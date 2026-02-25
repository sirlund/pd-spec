# Presentación — TIMining

> v1.0 | 2026-02-24 | 16 slides · 22 insight refs | es

---

## TIMining CORE

### El sistema operacional de la mina digital

*Idemax × TIMining — 2026*

<!-- Speaker notes: Audiencia: Philip (CEO), Carlo (CTO), equipo Idemax. Contexto: presentación de alineación estratégica y de diseño. El subtítulo usa el framing externo aprobado [CF-12 RESOLVED] — no "paz mental". -->

---

## La brecha que cuesta miles de millones

El plan minero es un volumen geométrico.
La operación real es dinámica, ruidosa, cambiante.

**La industria añadió sensores. Falló.**
No se puede optimizar lo que no se ve geométricamente.

> Un 5% de mejora en adherencia al plan = USD 15B de valor anual para la industria.

[IG-SYNTH-01]

<!-- Speaker notes: Este es el problema central. El "Geometry Gap" no es una brecha de datos — es una brecha de representación espacial. Los competidores ven números; TIMining ve la mina tal como es físicamente. La estadística de USD 15B viene del pitch deck y ancla la magnitud del problema ante el directorio. -->

---

## El 90% de las decisiones operacionales no ocurren en el software

> "Impresionante la cantidad de toma de decisiones que ocurren día a día en la operación, vía WhatsApp." — Carlo (CTO)

- Las radios no quedan registradas.
- El contexto del turno anterior se pierde.
- La plataforma no ve la inteligencia donde vive.

[IG-03], [IG-SYNTH-15]

<!-- Speaker notes: Este dato lo dijo Carlo en el Touchpoint del 19-feb. Usarlo con atribución directa genera credibilidad. El punto es que TIMining hoy es ciego a las decisiones reales. La visión: ser agnósticos al canal, capturar inteligencia donde ya ocurre. -->

---

## El competidor real no es Hexagon

> "Mi cliente no es tecnología — mi cliente es el Excel." — Philip (CEO)

- La venta no es contra otro software.
- Es contra el proceso de Excel + radio + reunión de turno que ya funciona.
- Si CORE no se conecta a ese proceso, la adopción se detiene.

[IG-05], [IG-SYNTH-05]

<!-- Speaker notes: Esta cita de Philip es el reencuadre más poderoso del proyecto. Define la estrategia de ventas: hablar de outcomes y procesos familiares, no de capacidades técnicas. El Efecto Suiza [IG-SYNTH-05] es la respuesta: CORE integra lo que ya existe, no lo reemplaza por mandato. -->

---

## Del dashboard al copiloto

**Antes:** Pantallas con datos que el usuario debe interpretar.

**CORE:** Sistema proactivo que detecta, analiza y recomienda.

- Cada 15 minutos: análisis del estado del plan.
- N simulaciones automáticas.
- Sugerencias rankeadas con impacto cuantificado.

[IG-SYNTH-04], [IG-SYNTH-06]

<!-- Speaker notes: El concepto "Skynet" del workshop. La evolución de "kiosco de datos" a "médico operacional que diagnostica y prescribe". El valor no está en visualizar más — está en eliminar el tiempo entre detectar un problema y saber qué hacer. Design Brief: "From problem to solution in minutes, not hours." -->

---

## Toda interacción sigue un patrón único: D → A → R

**Detección** → **Análisis** → **Recomendación**

- Validado por 20 casos de uso del Workshop 01.
- 26 de 57 fuentes convergen en este patrón.
- Es el esqueleto UX de todo CORE. Sin excepciones.

*Ejemplo: Camión operando fuera del plan → cálculo de pérdida → 3 escenarios rankeados por impacto.*

[IG-SYNTH-06]

<!-- Speaker notes: El patrón D→A→R es el insight con mayor convergencia del corpus completo (26/57). No es una propuesta de diseño — es una descripción de cómo los propios usuarios de TIMining ya piensan sobre los problemas. CORE lo formaliza como el único patrón de interacción. -->

---

## 4 principios de diseño que guían CORE

| Principio | Lo que significa |
|---|---|
| **Quiet UI** | Si 50 camiones están bien, no los muestres. Solo lo que importa. |
| **Clear Path** | Toda pantalla lleva a una acción. Sin callejones sin salida. |
| **Time Sight** | El usuario sabe siempre qué tan fresco es el dato que ve. |
| **Omni Sense** | Misma inteligencia: pantalla, WhatsApp, Radio IP, voz. |

[IG-SYNTH-07], [IG-SYNTH-06], [IG-SYNTH-03], [IG-03]

<!-- Speaker notes: Estos son los 4 pilares del Design System de CORE, derivados directamente de los insights con mayor convergencia. Quiet UI viene de la retro del workshop (STOP "mucha data sin sentido"). Time Sight resuelve el cliente que se perdió por métricas a 24h [IG-SYNTH-03]. Omni Sense es la respuesta a WhatsApp [IG-03]. -->

---

## El moat técnico que nadie puede replicar en el corto plazo

**Primero: Geometry Engine**
- Infiere topografía en tiempo real cada 15 min con GPS existentes.
- Sin drones. Sin instalación adicional.
- Ningún competidor corre simulaciones sobre topografía que se actualiza a esa frecuencia.

**Segundo: 60 reglas operacionales propietarias**
- Dispatching, cambio de turno, secuencias de salida.
- Convierten IA genérica en recomendador confiable.
- Sin ellas, cualquier LLM alucina en contexto operacional.

[IG-SYNTH-01], [IG-08]

<!-- Speaker notes: Estos dos activos son el moat real. El Geometry Engine es el breaktrough propietario que el CEO describe explícitamente. Las 60 reglas las mencionó Carlo en el Touchpoint — y hoy no aparecen en el pitch. Ese es el gap de storytelling que este proyecto cierra. Google puede conectar Gemini a datos mineros; no puede replicar años de lógica operacional real. -->

---

## La inteligencia llega donde está el usuario

4 canales de entrega. Un solo cerebro.

- **3D Digital Twin** — Despachador en sala de control.
- **Tactical 2D + simulaciones** — Planificador en desktop.
- **TIM Agent (lenguaje natural)** — Cualquier perfil, cualquier dispositivo.
- **Push / WhatsApp / Radio IP** — Jefe de Turno en terreno, sin pantalla.

[IG-SYNTH-19], [IG-03], [IG-SYNTH-09]

<!-- Speaker notes: La arquitectura de 4 lentes no es un feature de UX — es una decisión estratégica: la inteligencia de la mina debe llegar al usuario en el canal donde ya opera. Para el Jefe de Turno en terreno, WhatsApp y voz son los canales primarios, no el fallback. -->

---

## 5 perfiles. 5 necesidades radicalmente distintas.

| Perfil | Dónde opera | Lo que necesita CORE |
|---|---|---|
| **Despachador** | Sala de control, pantalla fija | Control segundo a segundo |
| **Jefe de Turno** | Terreno, sin pantalla | Alertas tácticas push/voz |
| **Gerente de Mina** | Celular, visión agregada | Semáforo desde cualquier lugar |
| **Planificador** | Desktop, análisis profundo | Simulaciones y conciliación plan-real |
| **CFO** | Boardroom, métricas financieras | Impacto operacional en moneda |

Hoy Aware presenta la misma interfaz para todos.

[IG-SYNTH-09], [IG-06]

<!-- Speaker notes: El workshop identificó 13 roles en 20 casos de uso. La tabla condensa los 5 perfiles del PRD. La última fila (CFO) es el tercer gap identificado por Niklas en el Touchpoint — Philip y Carlo no lo contradijeron. Es la oportunidad de expandir el valor estratégico de la plataforma hacia finanzas. -->

---

## Estado del sistema: 6 módulos, 1 plataforma

| Módulo | Estado |
|---|---|
| Geometry Engine (topografía RT + adherencia) | Listo |
| Copiloto Inteligente TIM Agent (D→A→R) | Listo |
| Briefing de Turno (anti Efecto Gaviota) | Listo |
| Seguridad y Geotecnia (alertas críticas) | Listo |
| Experiencia Multimodal (4 lentes) | Activo |
| Plataforma de Integración (Efecto Suiza) | Bloqueado* |

*Bloqueador: stack fragmentado sin autenticación unificada. [IG-SYNTH-13], [CF-11]

[IG-SYNTH-10]

<!-- Speaker notes: El estado "Bloqueado" de la Plataforma de Integración es un dato real del SYSTEM_MAP — no ocultarlo. Muestra madurez de diagnóstico y abre la conversación sobre roadmap técnico con Carlo. El Efecto Suiza es la ventaja estratégica; la autenticación unificada es el prerrequisito técnico. -->

---

## La oportunidad no capturada: el CFO

> "Operación y finanzas no se hablan como TIMining podría articular." — Niklas, Idemax (Touchpoint 19-feb)

- TIMining captura USD 6M en 5 meses en una faena.
- El CFO no lo sabe hasta semanas después.
- La desconexión mina-planta es el tercer gap.

**Oportunidad:** CORE como capa de reporting ejecutivo con impacto financiero en tiempo real.

[IG-06], [IG-SYNTH-12], [IG-SYNTH-16b]

<!-- Speaker notes: Esta oportunidad tiene evidencia frágil (IG-06, 1/57, observación interna de IDEMAX). Presentarla como hipótesis a validar, no como certeza. Philip y Carlo no la contradijeron en el Touchpoint — pero necesita confirmación con una entrevista al CFO del cliente. -->

---

## El modelo de negocio

**Licenciamiento por faena — usuarios ilimitados por sitio**

| | Actual (Aware) | Objetivo (CORE) |
|---|---|---|
| Precio | USD 300k/faena/año | USD 450k/faena/año |
| Valor capturado | USD 6M en 5 meses (1 faena) | — |
| Ratio valor/precio | 20x | — |

**Métrica central:** % adherencia espacial — no toneladas movidas.

**Modelo de adopción:** bottom-up → operational pull → acuerdos corporativos.

[IG-SYNTH-12], [IG-SYNTH-16b], [IG-SYNTH-17]

<!-- Speaker notes: El ratio 20x (USD 6M capturados / USD 300k precio) es el argumento de venta más poderoso y la base del repricing a USD 450k. El modelo bottom-up (operational pull) es clave: TIMining no depende de mandatos top-down — crece desde la adopción real en operaciones. -->

---

## Los dos riesgos que bloquean el GTM

**Riesgo 1 — Resistencia de operadores** [CF-13]
> "Si no logramos vender al operador, estamos acá afuera." — Carlo (CTO)

Planificación usa CORE para auditar. El operador resiste.
El modelo bottom-up colapsa si el operador no es el primer beneficiario.

**Riesgo 2 — Sin voz directa del usuario final** [CF-07]
Toda la capa de UX está construida sobre perspectivas proxy (COO, CTO, PMs).
Las hipótesis de diseño necesitan validación con usuarios en faenas activas.

[IG-04], [IG-02]

<!-- Speaker notes: Estos dos riesgos son los conflictos PENDING más críticos del knowledge base. Presentarlos con honestidad ante Philip y Carlo genera confianza y abre la conversación sobre el plan de Etapa 2. El riesgo 1 lo identificó Carlo mismo — darle el crédito. -->

---

## Próximos pasos: Etapa 2 de investigación

**Objetivo:** 3-5 entrevistas con usuarios en faenas activas.
Philip confirmó acceso el 19-feb.

| Perfil | Prioridad | Pregunta crítica |
|---|---|---|
| 2 Jefes de Turno | Alta | ¿Te sientes auditado o ayudado por la plataforma? [CF-13] |
| 1 Despachador | Alta | ¿Cuántas decisiones tomaste por WhatsApp en el último turno? [IG-03] |
| 1 Planificador | Media | ¿El cuello de botella es técnico (SQL) o cognitivo? [IG-SYNTH-08] |
| 1 CFO | Media | ¿Cómo obtienes hoy el impacto financiero de la operación? [IG-06] |

**Criterio de éxito:** pasar de score de readiness 6.4/10 a 8+/10.

[IG-02], [CF-07]

<!-- Speaker notes: Este slide es el call to action concreto para Philip: se necesita acceso a usuarios. Las preguntas ya están formuladas — el trabajo de preparación está hecho. El score de 6.4/10 viene del AUDIT.md y es un argumento objetivo de por qué la Etapa 2 no es opcional. -->

---

## Una pregunta para la sala

**¿CORE es una herramienta que ayuda al operador a decidir mejor, o una herramienta que ayuda a la jefatura a saber qué hizo el operador?**

La respuesta define el diseño, el onboarding y el modelo de adopción.

[IG-04], [CF-13], [IG-SYNTH-17]

<!-- Speaker notes: Esta es la pregunta de cierre deliberada — no tiene respuesta correcta en el knowledge base actual. Su función es abrir discusión. Si Philip y Carlo responden "ambas", hay que preguntarles cómo el operador lo percibe. Si responden "ayudar al operador", la siguiente pregunta es: ¿qué datos del operador son visibles para él antes que para la jefatura? La respuesta a esas preguntas define el diseño de US-18 y la política de visibilidad de datos de CORE. -->

---

## Insights referenciados

| ID | Concepto | Status | Convergencia |
|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap — brecha geométrica plan-realidad | VERIFIED | 15/54 |
| [IG-SYNTH-03] | Confusión Temporal — tiempos del dato | VERIFIED | 5/57 |
| [IG-SYNTH-04] | Del Dashboard al Copiloto | VERIFIED | 12/54 |
| [IG-SYNTH-05] | Efecto Suiza — integración agnóstica | VERIFIED | 10/54 |
| [IG-SYNTH-06] | Patrón D→A→R — esqueleto UX | VERIFIED | 26/57 |
| [IG-SYNTH-07] | Gestión por Excepción — Quiet UI | VERIFIED | 10/57 |
| [IG-SYNTH-08] | Democratización del Dato | VERIFIED | 9/54 |
| [IG-SYNTH-09] | Perfiles diferenciados | VERIFIED | 13/57 |
| [IG-SYNTH-10] | De herramientas a plataforma CORE | VERIFIED | 10/57 |
| [IG-SYNTH-12] | Adherencia espacial como métrica central | VERIFIED | 10/54 |
| [IG-SYNTH-13] | Stack tecnológico fragmentado | VERIFIED | 3/54 |
| [IG-SYNTH-15] | Efecto Gaviota — cambio de turno | VERIFIED | 5/54 |
| [IG-SYNTH-16b] | Oportunidad de repricing USD 300k→450k | VERIFIED | 8/57 |
| [IG-SYNTH-17] | Adopción bottom-up — operational pull | VERIFIED | 6/57 |
| [IG-SYNTH-19] | Interfaz Multimodal — 4 Lentes | VERIFIED | 7/54 |
| [IG-02] | Etapa 2 incompleta — riesgo sin usuarios | VERIFIED | 1/1 |
| [IG-03] | WhatsApp como canal de decisiones | VERIFIED | 2/57 |
| [IG-04] | Resistencia de operadores | VERIFIED | 1/57 |
| [IG-05] | "Mi cliente es el Excel" | VERIFIED | 1/57 |
| [IG-06] | Desconexión mina-planta — tercer gap | VERIFIED | 1/57 |
| [IG-08] | 60 reglas operacionales propietarias | VERIFIED | 1/57 |
| [CF-12] | Framing interno vs. externo (paz mental) | RESOLVED | — |

---

*Generado con PD-Spec v4.7.0 — Idemax × TIMining*
