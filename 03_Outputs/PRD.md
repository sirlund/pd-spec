# Product Requirements Document — TIMining

> v1.2 | 2026-02-25 | 38 insights VERIFIED, 4 conflictos PENDING | es

> **Cambios v1.2:** Sistema de Pilares como sección estructural (Quiet UI → Clear Path → Time Sight → Omni Sense) [IG-16][IG-17] · 4 dominios operativos formales A-B-C-D [IG-18] · Time Scrubbing como patrón UX de Time Sight [IG-19] · CFO como "usuario invisible" — apuesta estratégica 2026 [IG-20] · Manos libres como interfaz primaria para Jefe de Turno en terreno [IG-21] · Plan compliance (Casos 1-6) vs. plan optimization (Casos 7-8) como dos propuestas de valor distintas [IG-22]

> **Cambios v1.1:** WhatsApp como canal primario [IG-03] · CFO como 5º perfil de usuario [IG-06] · 60 reglas propietarias como moat técnico [IG-08] · Adopción condicional: operador ≠ herramienta de auditoría [IG-04] · Excel como competidor real [IG-05] · Framing "paz mental" bifurcado: interno vs. externo [CF-12] · Experiencia Multimodal: Blocked → Active · Sistema aprende de expertos [IG-09]

## Resumen Ejecutivo

TIMining CORE es la plataforma unificada que cierra la "Geometry Gap" [IG-SYNTH-01] entre el plan minero y la realidad operacional, transformando datos geoespaciales en tiempo real en inteligencia accionable. CORE consolida 7 productos fragmentados (Aware, Orchestra, Delta, ARIS, Tangram, SICT, DrillIT) en una experiencia multimodal inteligente [IG-SYNTH-10] gobernada por un copiloto de IA (TIM Agent) [IG-SYNTH-04].

La propuesta de valor no es más datos sino "Paz Mental" [IG-SYNTH-16]: la certeza de que el operador está tomando la decisión correcta. Toda funcionalidad sigue el patrón Detección → Análisis → Recomendación [IG-SYNTH-06], validado por 20 casos de uso directamente con el equipo de operaciones y stakeholders clave.

El producto apunta a un ticket de USD 450k/año por faena (vs USD 300k actual de Aware), justificado por un valor capturado de USD 10M+ en ahorros comprobados en 3 minas chilenas [IG-SYNTH-16b].

## Problema

### La brecha geométrica

El problema fundamental que TIMining resuelve es la desconexión entre el plan minero — una entidad geométrica estática — y la operación real — dinámica, ruidosa, cambiante [IG-SYNTH-01]. La industria intentó cerrar esta brecha con más sensores, pero falló en lo esencial: no se puede optimizar lo que no se ve geométricamente. TIMining es la única empresa que ha logrado inferir topografía en tiempo real usando datos GPS de equipos existentes, actualizándola cada 15 minutos sin drones.

### El dolor operacional

Los usuarios de las herramientas actuales enfrentan tres problemas convergentes:

1. **Confusión temporal** [IG-SYNTH-03] — Múltiples frecuencias de actualización (GPS real-time, mapas de calor cada 3h, indicadores cada 30min) que nadie comprende. Resultado: abandono. Se perdió un cliente concreto porque las métricas estaban a 24 horas cuando los mineros evalúan por turno.

2. **Barrera de adopción** [IG-SYNTH-11] — Orchestra tiene un 30% de uso real. Los usuarios en mina no tienen tiempo para curvas de aprendizaje; la capacitación inicial no alcanza para una interfaz con múltiples capas. La plataforma requiere un experto para entender la nomenclatura.

3. **Sobrecarga de información** [IG-SYNTH-07] — Los usuarios no quieren más dashboards. Quieren que el sistema vigile silenciosamente y los interrumpa solo cuando es crítico: "si hay 50 camiones bien, no mostrarlos; mostrar los 5 que generan problema."

### La trampa de customización

El equipo ha bautizado este riesgo como "Auto de Homero Simpson" [IG-SYNTH-02]: cada cliente pide funcionalidades, se implementan sin validar uso real, y el producto resultante no funciona bien para nadie. Todo 2025 fue dedicado a customización para un solo cliente. La tensión entre satisfacer al cliente individual y mantener un producto escalable es el conflicto central del negocio.

## Propuesta de Valor

### Paz Mental en entornos críticos

El valor de TIMining no reside en el software sino en la certeza operacional [IG-SYNTH-16]. Si la herramienta no reduce la carga mental, no sirve. CORE debe dar respuestas, no más preguntas.

> **Framing externo aprobado [CF-12]:** "Paz mental" es el concepto de diseño interno. En comunicación con clientes, traducir a: *"ayúdame a tomar la mejor decisión porque yo no tengo tiempo"* — lenguaje de eficiencia y confianza en la información, no de abstracción emocional.

### Del dashboard al copiloto

CORE plantea una transición fundamental: de pantallas con gráficos que el usuario debe interpretar, a un sistema proactivo que anticipa problemas, sugiere soluciones y se comunica por el canal más adecuado [IG-SYNTH-04]. El concepto "Skynet" del workshop imagina un sistema que cada X minutos analiza la situación, corre N simulaciones y envía sugerencias rankeadas.

### El competidor real es Excel, no Hexagon

El comprador no evalúa TIMining contra Maptek o Hexagon — evalúa contra "no cambiar nada" [IG-05]. Philip (CEO): *"Mi cliente no es tecnología — mi cliente es el Excel."* La decisión de compra real es: ¿vale la pena cambiar el Excel y la radio por esto? La integración con Hexagon/Maptek/Komatsu no solo diferencia ante competidores: es el puente para que el cliente no sienta que abandona sus herramientas actuales [IG-SYNTH-05], [IG-05].

### Inteligencia democrática

Hoy, acceder a datos de la mina requiere expertos en SQL y software de planificación. Con TIM Agent (alianza con Google Gemini), cualquier supervisor puede preguntar en lenguaje natural y obtener respuestas ancladas en la realidad física de la mina [IG-SYNTH-08]. Meta: de 5 usuarios analíticos a 100+ usuarios activos por sitio.

### Adherencia espacial como métrica

El cambio de paradigma es medir "adherencia espacial" — cumplimiento geométrico del plan — en vez de "toneladas movidas" [IG-SYNTH-12]. Un 5% de mejora en adherencia puede agregar USD 15B de valor a la industria anualmente. Resultados probados: +9-19% adherencia, USD 10M+ en ahorros en 3 minas.

### Dominio operacional como moat frente a AI genérica

60 reglas de negocio propietarias — dispatching, cambio de turno, secuencias de salida — actúan como capa de validación que impide que la AI genere recomendaciones operacionalmente inválidas [IG-08]. Esto diferencia CORE de un LLM genérico conectado a datos de mina: el conocimiento operacional codificado convierte la AI en un recomendador confiable. Complementa el Geometry Gap [IG-SYNTH-01] como segundo diferenciador técnico irreplicable.

### Dos propuestas de valor distintas en un mismo producto

CORE opera en dos niveles con audiencias y horizontes de tiempo diferentes [IG-22]:

- **Plan compliance (Casos 1-6):** respuesta a incidentes en curso, anticipación de desvíos intra-turno, asistencia en cambios de turno. Audiencia: Despachador, Jefe de Turno. Horizonte: minutos a horas. **Sin este nivel, no hay plataforma** — es el enganche de adopción operacional diaria.
- **Plan optimization (Casos 7-8):** reconfigurar el plan estratégico cuando el modelo subyacente es incorrecto (ej. mal diseño de rampas, secuencias de extracción subóptimas). Audiencia: Planificador, Gerente de Mina. Horizonte: días a semanas.

La tentación es vender solo el nivel 2 (más aspiracional, más "IA"), pero sin el nivel 1 enraizado en operaciones diarias no hay stickiness ni contexto para que las recomendaciones estratégicas tengan sentido.

## Perfiles de Usuario

> **[CF-07]** Todos los perfiles están construidos desde perspectivas de stakeholders internos. No hay investigación directa con usuarios finales en mina. Esta es la brecha de investigación más crítica del proyecto.

| Perfil | Necesidad clave | Canal preferido | Evidencia |
|---|---|---|---|
| **Despachador** | Control segundo a segundo, visibilidad de flota completa | Pantalla de control (desktop) | [IG-SYNTH-09] |
| **Jefe de Turno** | Alertas tácticas sin pantalla (está en terreno) — interfaz manos libres como modo primario | WhatsApp, Radio IP, voz+foto (Push-to-Talk) | [IG-SYNTH-09], [IG-SYNTH-15], [IG-03], [IG-21] |
| **Gerente de Mina** | Visión semáforo desde el celular | App móvil, briefing feed | [IG-SYNTH-09], [IG-SYNTH-07] |
| **Planificador** | Profundidad analítica, simulación de escenarios | Desktop, TIM Agent (NL queries) | [IG-SYNTH-09], [IG-SYNTH-08] |
| **CFO / Gerente de Finanzas** | Reporting ejecutivo en lenguaje financiero, sin entender minería — "usuario invisible" (apuesta estratégica 2026) | Dashboard ejecutivo móvil, reportes automáticos | [IG-06], [IG-20] |

Cada perfil requiere una experiencia diferenciada. Hoy Aware presenta la misma interfaz para todos — se iluminan/apagan capas sin diferenciación real [IG-SYNTH-09].

## Arquitectura del Sistema

### Module: Geometry Engine
**Status:** Ready
**Refs:** [IG-SYNTH-01], [IG-SYNTH-12]

Motor fundacional de la plataforma. Infiere topografía en tiempo real cada 15 minutos usando datos GPS de equipos existentes. Provee la capa de verdad geométrica sobre la cual operan todos los demás módulos.

**Implicaciones de diseño:**
- Adherencia espacial (plan compliance) como métrica principal visible en todos los perfiles [IG-SYNTH-12]
- Conciliación plan vs realidad como dato fundacional, no como feature aislado [IG-SYNTH-01]

---

### Module: Copiloto Inteligente (TIM Agent)
**Status:** Ready
**Refs:** [IG-SYNTH-04], [IG-SYNTH-06], [IG-SYNTH-08], [IG-08], [IG-09], [IG-18], [IG-22]

Módulo transversal de IA que implementa el paradigma proactivo. Ejecuta simulaciones automáticas, detecta anomalías, analiza impacto y recomienda acciones rankeadas.

**Implicaciones de diseño:**
- Toda funcionalidad sigue el patrón D→A→R (Detección → Análisis → Recomendación) [IG-SYNTH-06]
- Lenguaje natural (Gemini) como interfaz primaria de consulta [IG-SYNTH-08]
- Simulaciones cada X minutos con sugerencias priorizadas por impacto [IG-SYNTH-04]
- Las 60 reglas operacionales propietarias (dispatching, cambio de turno, secuencias de salida) actúan como capa de validación: impiden que la AI genere recomendaciones operacionalmente inválidas [IG-08]
- El sistema aprende de las decisiones de expertos: patrones de rechazo de recomendaciones alimentan las sugerencias futuras, democratizando el conocimiento operacional tácito [IG-09]
- El copiloto opera en dos niveles de valor distintos: **Plan compliance** (Casos 1-6 — respuesta a incidentes, anticipación, asistencia turno a turno) y **Plan optimization** (Casos 7-8 — reconfigurar el plan estratégico cuando el modelo subyacente es incorrecto). Sin el nivel 1, no hay plataforma [IG-22]
- Los 8 casos de uso se organizan en 4 dominios operativos: **A=Respuesta a Crisis** (Quiet UI lidera), **B=Anticipación Operativa** (Time Sight lidera), **C=Asistencia Inteligente** (Omni Sense lidera), **D=Alineación Estratégica** (multi-pilar). Esta clasificación guía qué pilar prioriza el diseño de cada caso [IG-18]

---

### Module: Experiencia Multimodal (4 Lentes)
**Status:** Active
**Refs:** [IG-SYNTH-19], [IG-SYNTH-09], [IG-SYNTH-07], [IG-SYNTH-16], [IG-03], [IG-16], [IG-17], [IG-19], [IG-21]

4 lentes de navegación: Reality (3D Digital Twin), Tactical (simulación 2D), Agent (conversacional), Briefing (feed mobile-first). Gobernadas por un "Unified Navigation Ribbon" [IG-SYNTH-19].

**Implicaciones de diseño:**
- Diferenciación por perfil: cada lente priorizada según el rol del usuario [IG-SYNTH-09]
- Gestión por excepción: solo mostrar anomalías, no el estado normal [IG-SYNTH-07]
- Cada interacción debe dar certeza, no más datos [IG-SYNTH-16]
- Agnóstico al canal: WhatsApp y Radio IP como canales prioritarios (el 90% de las decisiones operacionales ocurre en WhatsApp). El sistema captura decisiones tomadas fuera de la plataforma, no solo empuja información hacia el usuario [IG-03]
- Los 4 pilares forman un sistema encadenado: Quiet UI filtra → Clear Path guía → Time Sight anticipa → Omni Sense distribuye. El output de cada pilar alimenta el siguiente [IG-16]
- Distinción arquitectural: QUI + Omni Sense = capas de "cómo se presenta" (presentación y canal); Clear Path + Time Sight = capas de "qué se presenta" (contenido y anticipación) [IG-17]
- **Interfaz manos libres como modo primario para el Jefe de Turno en terreno:** en berma no puede usar pantalla ni teclado. Entrada por voz+foto (Push-to-Talk) y procesamiento local (Edge AI) son requisitos de diseño no negociables, no features opcionales [IG-21]
- **Time Scrubbing como patrón UX de Time Sight:** capacidad de rebobinar la operación hasta el momento exacto del primer desvío y ver la cadena causal completa en una sola vista — forensics operacional. Benchmark: Tesla Fleet [IG-19]

---

### Module: Briefing de Turno
**Status:** Ready
**Refs:** [IG-SYNTH-15], [IG-SYNTH-17]

Briefings automáticos multimedia (voice note, video reel, KPI summary) 15 minutos antes del cambio de turno. Elimina el "Efecto Gaviota" — la caída de producción por pérdida de contexto entre turnos [IG-SYNTH-15].

**Implicaciones de diseño:**
- Embeber en la rutina estándar de cambio de turno para generar stickiness [IG-SYNTH-17]
- Turno entrante con contexto completo sin necesidad de preguntar [IG-SYNTH-15]

---

### Module: Seguridad y Geotecnia
**Status:** Ready
**Refs:** [IG-SYNTH-18]

Alertas de seguridad geotécnica como funcionalidad crítica — 3 de 20 casos de uso del workshop fueron sobre seguridad (alerta geotécnica, procedimientos de trabajo, tronadura) [IG-SYNTH-18].

**Implicaciones de diseño:**
- Integración ARIS aspiracional pero compleja: evaluar viabilidad sin complejizar la interfaz [IG-SYNTH-18]
- Verificación de procedimientos y gestión de tronaduras integradas al flujo operacional [IG-SYNTH-18]

---

### Module: Plataforma de Integración (Efecto Suiza)
**Status:** Blocked
**Refs:** [IG-SYNTH-05], [IG-SYNTH-13], [IG-05], [IG-06], [IG-13], [IG-20]
**Blocker:** Stack fragmentado (C++, Unity, Go, Python, web) sin autenticación unificada [IG-SYNTH-13]. Preguntas abiertas sobre APIs, modelos de datos, backend headless y pasos bloqueantes.

Integración agnóstica con cualquier OEM (Komatsu, Cat, Modular, Hexagon) y software de planificación (Maptek, Deswik) [IG-SYNTH-05]. El "Efecto Suiza" significa que OEMs integran rutinariamente con TIMining incluso cuando no integran entre sí.

**Implicaciones de diseño:**
- Autenticación unificada como prerrequisito de la plataforma [IG-SYNTH-13]
- Nunca tomar partido por un vendor [IG-SYNTH-05]
- La integración no compite con las herramientas familiares del cliente (Excel, radio): las conecta y captura las decisiones que ya ocurren en esos canales [IG-05]
- Integrar datos operacionales con KPIs financieros para reportería ejecutiva (CFO): la desconexión mina-planta es el tercer gap que cerrar [IG-06]
- Pricing diferencial para desarrollo custom históricamente no formalizado: definir framework (configuración vs. extensión vs. custom) antes de nuevos compromisos [IG-13]
- **CFO como quinto perfil de usuario (apuesta estratégica 2026):** la plataforma debe aprender a hablar finanzas — en el bolsillo del CFO, sin que tenga que entender minería. Pendiente validación directa con CFO [IG-20]

---

### Module: Onboarding Progresivo
**Status:** Ready
**Refs:** [IG-SYNTH-11], [IG-SYNTH-02]

Capacitación in-app contextual por perfil, no manuales genéricos [IG-SYNTH-11]. Complejidad progresiva: la interfaz debe ser intuitiva sin certificación previa.

**Implicaciones de diseño:**
- "Zero Homer": cada feature debe justificar su existencia con evidencia de uso [IG-SYNTH-02]
- Capacitación in-app adaptada al perfil del usuario [IG-SYNTH-11]

## Principios de Diseño

### Sistema de Pilares

Los 4 pilares son el framework de diseño transversal de CORE. No son módulos ni features — son las capas que gobiernan cómo se diseña cada caso de uso, cada pantalla y cada interacción, independientemente del perfil. Forman un sistema encadenado: el output de cada pilar alimenta el siguiente [IG-16].

| Pilar | Rol en el sistema | Governa | Dominio |
|---|---|---|---|
| **Quiet UI** | Filtra | Qué se muestra (y qué se oculta) | Presentación |
| **Clear Path** | Guía | Qué decisión tomar ahora | Contenido |
| **Time Sight** | Anticipa | Qué va a pasar y cuándo | Anticipación |
| **Omni Sense** | Distribuye | Por qué canal llega la información | Canal |

**Quiet UI → Clear Path → Time Sight → Omni Sense**

**Distinción arquitectural [IG-17]:** QUI + Omni Sense son capas de *cómo se presenta* (interfaz y canal). Clear Path + Time Sight son capas de *qué se presenta* (contenido y anticipación). Las primeras sin las segundas producen una interfaz limpia pero vacía. Las segundas sin las primeras producen el dashboard que nadie lee.

Cada caso de uso tiene un pilar que lidera su diseño según el dominio operativo [IG-18]: Respuesta a Crisis (Quiet UI lidera), Anticipación Operativa (Time Sight lidera), Asistencia Inteligente (Omni Sense lidera), Alineación Estratégica (multi-pilar).

---

1. **"Paz Mental"** — Cada interacción debe reducir la carga cognitiva. El valor es la certeza de que se está tomando la decisión correcta. Si una pantalla genera más preguntas que respuestas, está fallando. [IG-SYNTH-16], [IG-SYNTH-07]

   > **Framing externo [CF-12]:** En comunicación con clientes, traducir a: *"ayúdame a tomar la mejor decisión porque yo no tengo tiempo."*

2. **"Quiet UI"** — Solo mostrar lo que importa. Gestión por excepción: el sistema vigila silenciosamente y notifica solo cuando es crítico. Alertas legibles en menos de 5 segundos. [IG-SYNTH-07], [IG-SYNTH-06]

3. **"Zero Homer"** — No implementar features sin validar uso real. Cada funcionalidad debe justificar su existencia con evidencia de adopción. Si no hay insight que lo respalde, no se construye. [IG-SYNTH-02]

4. **"D→A→R"** — Toda funcionalidad sigue el patrón Detección → Análisis → Recomendación. Esqueleto UX validado por 20 casos de uso del workshop. Sin excepciones. [IG-SYNTH-06]

5. **"Inteligencia Democrática"** — Cualquier perfil accede a insights sin expertise técnico. De expertos SQL a lenguaje natural. De desktop a bolsillo. De 5 usuarios a 100+ por sitio. [IG-SYNTH-08], [IG-SYNTH-09]

6. **"Efecto Suiza"** — Integración neutral con cualquier OEM, FMS o software de planificación. El valor está en ser el hub que conecta lo que no se conecta. [IG-SYNTH-05]

7. **"Operational Pull"** — Diseñar para adopción bottom-up. La herramienta debe embeberse en rutinas operacionales diarias y generar tracción interna que acelere acuerdos corporativos. [IG-SYNTH-17]

   > **Condición crítica [IG-04]:** El operador debe percibir CORE como herramienta de ayuda, no de control. Si planificación lo usa para auditar, el operador resiste. CORE debe dar al operador visibilidad de su propio desempeño *antes* de exponerlo a la jefatura.

## Modelo de Negocio

### Métrica central

Adherencia espacial (plan compliance) como KPI del producto [IG-SYNTH-12]. Resultados comprobados: +9-19% adherencia, USD 10M+ en ahorros capturados en 3 minas, USD 6M en 5 meses en una sola faena.

### Pricing

| Producto | Precio actual | Precio objetivo |
|---|---|---|
| Aware (actual) | USD 300k/año por faena | — |
| CORE (nuevo) | — | USD 450k/año por faena |

Existe una desconexión entre precio de licencia y valor entregado [IG-SYNTH-16b]. La oportunidad es realinear de "licencia de software" a "valor empresarial."

> **[CF-08]** No hay datos financieros detallados: breakdown de revenue, márgenes, unit economics, CAC/LTV. La estrategia de pricing carece de fundamentación financiera.

### Modelo de adopción

Bottom-up ("Operational Pull") [IG-SYNTH-17]: arrancar con equipos de operaciones y expandirse orgánicamente a 100+ usuarios activos por sitio. Licenciamiento ilimitado por faena. Patrones de uso diario muestran alta stickiness embebida en rutinas de cambio de turno.

### Ciclo de venta

Dependencia de venta consultiva [IG-SYNTH-14]: 30-36 horas por caso de renovación, ciclo de venta de 2 años + 6 meses de instalación. Esta dependencia limita la escalabilidad del modelo SaaS. CORE debe reducir la fricción de onboarding para acortar este ciclo.

## Restricciones y Riesgos

### Riesgos técnicos

- **Stack fragmentado** [IG-SYNTH-13] — 7 productos en C++, Unity, Go, Python y web sin autenticación unificada. La conexión Orchestra-web se hace mediante descarga de bases de datos y cruces manuales. El estado "plug and play" no se cumple.

- **Módulos bloqueados** — Experiencia Multimodal (requiere definición por perfil y rediseño de jerarquía visual) y Plataforma de Integración (requiere autenticación unificada y definición de APIs).

### Riesgos de producto

- **"Auto de Homero Simpson"** [IG-SYNTH-02] — Riesgo existencial de feature bloat por customización sin validación. Todo 2025 comprometido con un solo cliente. CORE debe implementar el principio "Zero Homer" como gate obligatorio.

- **Riesgo de adopción: herramienta percibida como auditoría** [IG-04] — Si CORE se percibe como herramienta de control top-down, los operadores resisten activamente. Carlo (CTO): *"Si no logramos vender al operador, estamos afuera."* Diseñar para que el beneficio sea primero visible para el operador antes de exponerlo a planificación. Ver [CF-13].

- **Confianza UX vs realidad** [CF-03 RESOLVED] — Carlo (CTO) mostró apertura a revisar la UI tras ver el benchmark en el Touchpoint del 19-feb. Próximo paso: agendar sesión formal de benchmark UX con el equipo de producto.

### Riesgos de investigación

- **Sin usuarios finales** [CF-07] — Todas las perspectivas de usuario provienen de stakeholders internos. No hay entrevistas con mineros, despachadores ni jefes de turno. Las necesidades de usuario pueden ser suposiciones incorrectas. **Prioridad: Crítica.**

- **Sin datos financieros** [CF-08] — Cifras sueltas (USD 10M, USD 5M ARR, USD 450k target) sin breakdown ni unit economics. La estrategia de pricing carece de fundamentación.

- **Customización sin framework** [CF-05] — No existe una definición formal de qué es configuración (sin código), extensión (API) y customización (desarrollo a medida). Sin este framework, se repite el patrón Homer.

### Constraint activo

- **Etapa 2 incompleta** [IG-02] — Se está entrando a lineamientos de diseño sin haber completado las 6 entrevistas con usuarios clave. Riesgo de repetir el patrón "Auto de Homero Simpson" a nivel de estrategia UX.

## Preguntas Abiertas

- [ ] Framework formal para distinguir configuración vs customización vs desarrollo a medida [CF-05]
- [ ] Unit economics del modelo SaaS: CAC, LTV, márgenes, breakdown de revenue [CF-08]
- [x] Benchmark UX formal — agendar sesión con Carlo (CTO); apertura confirmada en Touchpoint 19-feb [CF-03 RESOLVED]
- [ ] Completar entrevistas con usuarios finales — 1 efectuada con usuario externo, más en planificación con apoyo de Philip [CF-07]
- [ ] Bloqueantes técnicos para migración a CORE: APIs, modelos de datos, backend headless [CF-11]
- [ ] Estándares WCAG aplicables a cada pilar de CORE [CF-10]
- [ ] ¿Cuál es el workflow específico de Excel/radio que CORE reemplaza en cada perfil de usuario? [IG-05]
- [ ] ¿Qué información del operador es visible para él vs. para su jefatura? ¿Cómo se comunica esto en el onboarding? [IG-04], [CF-13]
- [ ] ¿Cuál es el modelo de datos que une operaciones con finanzas? ¿Qué métricas financieras son accionables para el CFO? [IG-06]
- [ ] ¿Qué KPIs financieros necesita el CFO diariamente? ¿Cuál es el umbral mínimo de drill-down que le da autonomía sin necesitar llamar a nadie? [IG-20], [CF-08]
- [ ] ¿Cuáles son los requisitos de Edge AI para procesamiento local en faena? ¿Cuál es la conectividad mínima esperable y la latencia máxima aceptable para voz+foto? [IG-21]
- [ ] Al diseñar Time Scrubbing: ¿cuánto tiempo de historial operacional debe ser "rebobinable"? ¿Cuál es la granularidad mínima (por minuto, por evento, por turno)? [IG-19]

## Resumen de Insights

| ID | Concepto | Status | Convergencia |
|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap | VERIFIED | 15/54 |
| [IG-SYNTH-02] | Auto de Homero Simpson | VERIFIED | 8/54 |
| [IG-SYNTH-03] | Confusión Temporal | VERIFIED | 4/54 |
| [IG-SYNTH-04] | Del Dashboard al Copiloto | VERIFIED | 12/54 |
| [IG-SYNTH-05] | Efecto Suiza | VERIFIED | 10/54 |
| [IG-SYNTH-06] | Patrón D→A→R | VERIFIED | 25/54 |
| [IG-SYNTH-07] | Gestión por Excepción | VERIFIED | 8/54 |
| [IG-SYNTH-08] | Democratización del Dato | VERIFIED | 9/54 |
| [IG-SYNTH-09] | Perfiles diferenciados | VERIFIED | 12/54 |
| [IG-SYNTH-10] | De herramientas a CORE | VERIFIED | 9/54 |
| [IG-SYNTH-11] | Curva de aprendizaje | VERIFIED | 6/54 |
| [IG-SYNTH-12] | Adherencia al plan | VERIFIED | 10/54 |
| [IG-SYNTH-13] | Stack fragmentado | VERIFIED | 3/54 |
| [IG-SYNTH-14] | Dependencia venta consultiva | VERIFIED | 3/54 |
| [IG-SYNTH-15] | Efecto Gaviota | VERIFIED | 5/54 |
| [IG-SYNTH-16] | Paz Mental | VERIFIED | 5/54 |
| [IG-SYNTH-16b] | Oportunidad de repricing | VERIFIED | 6/54 |
| [IG-SYNTH-17] | Adopción bottom-up | VERIFIED | 5/54 |
| [IG-SYNTH-18] | Seguridad geotécnica | VERIFIED | 8/54 |
| [IG-SYNTH-19] | Interfaz Multimodal 4 Lentes | VERIFIED | 7/54 |
| [IG-02] | Etapa 2 incompleta — riesgo de estrategia sin usuarios | VERIFIED | 1/1 |
| [IG-03] | WhatsApp como canal principal de decisiones operacionales | VERIFIED | 2/57 |
| [IG-04] | Resistencia de operadores cuando son auditados | VERIFIED | 1/57 |
| [IG-05] | "Mi cliente es el Excel" — competidor real del comprador | VERIFIED | 1/57 |
| [IG-06] | Desconexión mina-planta — tercer gap operacional | VERIFIED | 1/57 |
| [IG-08] | 60 reglas propietarias como moat técnico frente a AI genérica | VERIFIED | 1/57 |
| [IG-09] | Sistema aprende de decisiones expertas (aspiracional) | VERIFIED | 2/57 |
| [IG-10] | Quiet UI = responsabilidad sistema + interfaz (dos capas) | VERIFIED | 2/59 |
| [IG-11] | Valor por decisión como tesis de pricing USD 450K | VERIFIED | 1/59 |
| [IG-13] | Custom features sin pricing diferencial — histórico | VERIFIED | 1/59 |
| [IG-15] | GPS degradadas — calidad del dato como variable visible | VERIFIED | 1/59 |
| [IG-16] | 4 pilares = sistema encadenado QUI→CP→TS→OS | VERIFIED | 2/59 |
| [IG-17] | QUI+OS = cómo se presenta; CP+TS = qué se presenta | VERIFIED | 2/59 |
| [IG-18] | 4 dominios operativos formales (A-B-C-D) | VERIFIED | 1/59 |
| [IG-19] | Time Scrubbing como patrón UX de Time Sight | VERIFIED | 1/59 |
| [IG-20] | CFO como "usuario invisible" — apuesta estratégica 2026 | VERIFIED | 1/59 |
| [IG-21] | Manos libres como interfaz primaria para JdT en terreno | VERIFIED | 1/59 |
| [IG-22] | Plan compliance (1-6) vs. plan optimization (7-8) | VERIFIED | 1/59 |
