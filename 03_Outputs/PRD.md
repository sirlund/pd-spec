# Product Requirements Document — TIMining

> v1.0 | 2026-02-23 | 20 insights VERIFIED, 4 conflictos PENDING | es

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

### Del dashboard al copiloto

CORE plantea una transición fundamental: de pantallas con gráficos que el usuario debe interpretar, a un sistema proactivo que anticipa problemas, sugiere soluciones y se comunica por el canal más adecuado [IG-SYNTH-04]. El concepto "Skynet" del workshop imagina un sistema que cada X minutos analiza la situación, corre N simulaciones y envía sugerencias rankeadas.

### Inteligencia democrática

Hoy, acceder a datos de la mina requiere expertos en SQL y software de planificación. Con TIM Agent (alianza con Google Gemini), cualquier supervisor puede preguntar en lenguaje natural y obtener respuestas ancladas en la realidad física de la mina [IG-SYNTH-08]. Meta: de 5 usuarios analíticos a 100+ usuarios activos por sitio.

### Adherencia espacial como métrica

El cambio de paradigma es medir "adherencia espacial" — cumplimiento geométrico del plan — en vez de "toneladas movidas" [IG-SYNTH-12]. Un 5% de mejora en adherencia puede agregar USD 15B de valor a la industria anualmente. Resultados probados: +9-19% adherencia, USD 10M+ en ahorros en 3 minas.

## Perfiles de Usuario

> **[CF-07]** Todos los perfiles están construidos desde perspectivas de stakeholders internos. No hay investigación directa con usuarios finales en mina. Esta es la brecha de investigación más crítica del proyecto.

| Perfil | Necesidad clave | Canal preferido | Evidencia |
|---|---|---|---|
| **Despachador** | Control segundo a segundo, visibilidad de flota completa | Pantalla de control (desktop) | [IG-SYNTH-09] |
| **Jefe de Turno** | Alertas tácticas sin pantalla (está en terreno) | Push móvil, voz (Radio IP) | [IG-SYNTH-09], [IG-SYNTH-15] |
| **Gerente de Mina** | Visión semáforo desde el celular | App móvil, briefing feed | [IG-SYNTH-09], [IG-SYNTH-07] |
| **Planificador** | Profundidad analítica, simulación de escenarios | Desktop, TIM Agent (NL queries) | [IG-SYNTH-09], [IG-SYNTH-08] |

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
**Refs:** [IG-SYNTH-04], [IG-SYNTH-06], [IG-SYNTH-08]

Módulo transversal de IA que implementa el paradigma proactivo. Ejecuta simulaciones automáticas, detecta anomalías, analiza impacto y recomienda acciones rankeadas.

**Implicaciones de diseño:**
- Toda funcionalidad sigue el patrón D→A→R (Detección → Análisis → Recomendación) [IG-SYNTH-06]
- Lenguaje natural (Gemini) como interfaz primaria de consulta [IG-SYNTH-08]
- Simulaciones cada X minutos con sugerencias priorizadas por impacto [IG-SYNTH-04]

---

### Module: Experiencia Multimodal (4 Lentes)
**Status:** Blocked
**Refs:** [IG-SYNTH-19], [IG-SYNTH-09], [IG-SYNTH-07], [IG-SYNTH-16]
**Blocker:** Requiere definición detallada de cada lente por perfil de usuario. UX actual saturada necesita rediseño de jerarquía visual [CF-02].

4 lentes de navegación: Reality (3D Digital Twin), Tactical (simulación 2D), Agent (conversacional), Briefing (feed mobile-first). Gobernadas por un "Unified Navigation Ribbon" [IG-SYNTH-19].

**Implicaciones de diseño:**
- Diferenciación por perfil: cada lente priorizada según el rol del usuario [IG-SYNTH-09]
- Gestión por excepción: solo mostrar anomalías, no el estado normal [IG-SYNTH-07]
- Cada interacción debe dar certeza, no más datos [IG-SYNTH-16]

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
**Refs:** [IG-SYNTH-05], [IG-SYNTH-13]
**Blocker:** Stack fragmentado (C++, Unity, Go, Python, web) sin autenticación unificada [IG-SYNTH-13]. Preguntas abiertas sobre APIs, modelos de datos, backend headless y pasos bloqueantes.

Integración agnóstica con cualquier OEM (Komatsu, Cat, Modular, Hexagon) y software de planificación (Maptek, Deswik) [IG-SYNTH-05]. El "Efecto Suiza" significa que OEMs integran rutinariamente con TIMining incluso cuando no integran entre sí.

**Implicaciones de diseño:**
- Autenticación unificada como prerrequisito de la plataforma [IG-SYNTH-13]
- Nunca tomar partido por un vendor [IG-SYNTH-05]

---

### Module: Onboarding Progresivo
**Status:** Ready
**Refs:** [IG-SYNTH-11], [IG-SYNTH-02]

Capacitación in-app contextual por perfil, no manuales genéricos [IG-SYNTH-11]. Complejidad progresiva: la interfaz debe ser intuitiva sin certificación previa.

**Implicaciones de diseño:**
- "Zero Homer": cada feature debe justificar su existencia con evidencia de uso [IG-SYNTH-02]
- Capacitación in-app adaptada al perfil del usuario [IG-SYNTH-11]

## Principios de Diseño

1. **"Paz Mental"** — Cada interacción debe reducir la carga cognitiva. El valor es la certeza de que se está tomando la decisión correcta. Si una pantalla genera más preguntas que respuestas, está fallando. [IG-SYNTH-16], [IG-SYNTH-07]

2. **"Quiet UI"** — Solo mostrar lo que importa. Gestión por excepción: el sistema vigila silenciosamente y notifica solo cuando es crítico. Alertas legibles en menos de 5 segundos. [IG-SYNTH-07], [IG-SYNTH-06]

3. **"Zero Homer"** — No implementar features sin validar uso real. Cada funcionalidad debe justificar su existencia con evidencia de adopción. Si no hay insight que lo respalde, no se construye. [IG-SYNTH-02]

4. **"D→A→R"** — Toda funcionalidad sigue el patrón Detección → Análisis → Recomendación. Esqueleto UX validado por 20 casos de uso del workshop. Sin excepciones. [IG-SYNTH-06]

5. **"Inteligencia Democrática"** — Cualquier perfil accede a insights sin expertise técnico. De expertos SQL a lenguaje natural. De desktop a bolsillo. De 5 usuarios a 100+ por sitio. [IG-SYNTH-08], [IG-SYNTH-09]

6. **"Efecto Suiza"** — Integración neutral con cualquier OEM, FMS o software de planificación. El valor está en ser el hub que conecta lo que no se conecta. [IG-SYNTH-05]

7. **"Operational Pull"** — Diseñar para adopción bottom-up. La herramienta debe embeberse en rutinas operacionales diarias y generar tracción interna que acelere acuerdos corporativos. [IG-SYNTH-17]

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

- **Confianza UX vs realidad** [CF-03] — El CTO confía en que el diseño está "muy por sobre la vara" de la competencia minera, pero los datos muestran 30% de uso en Orchestra, abandono por confusión temporal, y pérdida de clientes por métricas inadecuadas. Se recomienda un benchmark UX externo para objetivar la conversación.

### Riesgos de investigación

- **Sin usuarios finales** [CF-07] — Todas las perspectivas de usuario provienen de stakeholders internos. No hay entrevistas con mineros, despachadores ni jefes de turno. Las necesidades de usuario pueden ser suposiciones incorrectas. **Prioridad: Crítica.**

- **Sin datos financieros** [CF-08] — Cifras sueltas (USD 10M, USD 5M ARR, USD 450k target) sin breakdown ni unit economics. La estrategia de pricing carece de fundamentación.

- **Customización sin framework** [CF-05] — No existe una definición formal de qué es configuración (sin código), extensión (API) y customización (desarrollo a medida). Sin este framework, se repite el patrón Homer.

### Constraint activo

- **Etapa 2 incompleta** [IG-02] — Se está entrando a lineamientos de diseño sin haber completado las 6 entrevistas con usuarios clave. Riesgo de repetir el patrón "Auto de Homero Simpson" a nivel de estrategia UX.

## Preguntas Abiertas

- [ ] Framework formal para distinguir configuración vs customización vs desarrollo a medida [CF-05]
- [ ] Unit economics del modelo SaaS: CAC, LTV, márgenes, breakdown de revenue [CF-08]
- [ ] Benchmark UX formal vs competencia minera (Hexagon, Maptek, Deswik, Wenco) [CF-03]
- [ ] Validación directa con usuarios finales en mina: entrevistas y tests de usabilidad [CF-07]
- [ ] Bloqueantes técnicos para migración a CORE: APIs, modelos de datos, backend headless [CF-11]
- [ ] Estándares WCAG aplicables a cada pilar de CORE [CF-10]

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
| [IG-02] | Etapa 2 incompleta | PENDING | 1/1 |
