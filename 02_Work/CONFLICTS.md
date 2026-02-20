# Conflicts Log

Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

## Status Legend

- **PENDING** — Detected but not yet resolved.
- **RESOLVED** — User has provided a resolution direction.

---

## Ambiguities

### [CF-01] Imprecisión — Cantidad de productos en portafolio
Status: RESOLVED
Type: AMB-01 (Imprecision)
Related insights: [IG-SYNTH-10]

- **Source claim A:** "6 productos en dos dominios" — entrevistas operaciones/analisis reu con operaciones.md
- **Source claim B:** "TIMining tiene entre 6 y 8 productos" — entrevistas operaciones/reu_coo_roberto-catalan.md
- **Source claim C:** PPT corporativa nombra 7 productos: Aware, Orchestra, Delta, Drillit, ARIS, SICT, Tangram
- **Verification:** Se nombran 7 productos concretos. La ambigüedad indicaba falta de claridad interna sobre qué constituye un "producto" vs un "módulo."

**Resolution:** Son 7 productos organizados en 2 dominios:
1. **Dominio de Operaciones y Planificación** (motor de crecimiento): Aware (flagship, gemelo digital RT), Orchestra (analítica avanzada y simulación), Delta (conciliación topográfica plan vs realidad).
2. **Dominio de Geotecnia y Geología** (legado estable): ARIS (monitoreo geotécnico integrador), Tangram (predicción riesgos estructurales), SICT (cumplimiento geotécnico y taludes), DrillIT (QA/QC perforación y tronadura).
Nota estratégica: convergen hacia plataforma unificada CORE con módulo transversal de IA (Project TIM Agent).

---

### [CF-02] Conflicto — Valor de la visualización 3D
Status: RESOLVED
Type: AMB-02 (Conflict)
Related insights: [IG-SYNTH-07], [IG-SYNTH-19]

- **Source claim STOP:** "La Visualización 3D de La Mina no agrega valor" — Workshop 1/KEEP-STOP-START (retro).docx
- **Source claim KEEP:** "La visualización de la mina esté completa" — Workshop 1/KEEP-STOP-START (retro).docx
- **Source claim CORE:** Reality Lens (3D Digital Twin) es uno de los 4 lentes del producto — Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx

**Resolution:** El 3D sí agrega valor. El rechazo en el workshop proviene de los gaps y flaws de UX que Aware tiene en su visualización 3D actual. No sirve ver el 3D si la pantalla está saturada de información y no es posible comprender qué necesita atención y qué no. La solución no es eliminar el 3D sino rediseñar la jerarquía visual para que el usuario pueda distinguir lo crítico del ruido.

---

### [CF-03] Conflicto de perspectiva — Confianza UX del CTO vs realidad de uso
Status: PENDING — Research (benchmark UX en progreso)
Type: AMB-03 (Perspective conflict)
Related insights: [IG-SYNTH-03], [IG-SYNTH-11]

- **Source claim A:** "El CTO está muy confiado de que el diseño de los productos está muy por sobre la vara de otros softwares de minería" — Workshop 1/_FIELD_NOTES.md (Confidence: high)
- **Source claim B:** "30% uso de usuarios" en Orchestra — entrevistas iniciales stakeholders/Entrevista PM Orchestra.png
- **Source claim C:** "Usuarios abandonan cuando no entienden" — entrevistas operaciones/reunion_operaciones (27-01-2026).md
- **Source claim D:** "Se perdió un cliente por métricas a 24 horas" — entrevistas operaciones/analisis reu con operaciones.md

**Action:** Benchmark UX externo con CTO y equipo de producto para objetivar la conversación. Ambas perspectivas pueden coexistir (mejor que competencia minera, pero debajo de estándares modernos de UX), pero necesitan datos externos para alinear.

---

### [CF-04] Contradicción — Foco en minería subterránea
Status: RESOLVED
Type: AMB-04 (Temporal conflict)
Related insights: [IG-SYNTH-10]

- **Source claim A:** "subterránea no es foco" — entrevistas operaciones/reu_coo_roberto-catalan.md (enero 2026)
- **Source claim B:** "2026: Expansión a minería subterránea aprovechando arquitectura modular" — Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx

**Resolution:** El CEO lo mencionó expresamente en el Workshop 01: subterránea es el próximo paso, pero por ahora hay suficientes problemas con las minas a tajo abierto. Prioridad: resolver tajo abierto primero, luego expansión a subterránea. No es conflicto sino secuencia temporal.

---

### [CF-05] Definición ambigua — Customización vs configuración
Status: PENDING — Needs more research
Type: AMB-05 (Definition gap)
Related insights: [IG-SYNTH-02], [IG-SYNTH-10]

- **Source claim A:** "UX base igual para todos; reglas, umbrales y lógicas cambian según faena 'debajo del agua'" — entrevistas operaciones/reu_coo_roberto-catalan.md
- **Source claim B:** "Todo 2025 comprometido en customización con un cliente" — entrevistas operaciones/reu_coo_roberto-catalan.md
- **Source claim C:** "Customización incluye features visibles nuevos por cliente (ej. fajas para bauxita en Brasil)" — entrevistas operaciones/reunion_operaciones (27-01-2026).md
- **Source claim D:** "Crear solución estandarizada con capa customizable, salir de la trampa del hecho a medida" — TIMINING_Workshop 01 _ 28 Enero 26.pptx

**Action:** Definir framework formal como parte de la arquitectura CORE. Propuesta de niveles: Configuración (sin código) → Extensión (API/plugins) → Custom (desarrollo a medida). Requiere input del equipo de desarrollo.

---

### [CF-06] Definición ambigua — Relación CORE vs Aware
Status: RESOLVED
Type: AMB-06 (Definition gap)
Related insights: [IG-SYNTH-10], [IG-SYNTH-01]

- **Source claim A:** "CORE debe diferenciarse de Aware actual" — Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx
- **Source claim B:** CORE usa las mismas capacidades técnicas de Aware: topografía en tiempo real, visor 3D, alertas, API
- **Source claim C:** Diagrama de 8 capas muestra plataforma unificada que envuelve capacidades de todos los productos — Antecedentes/TIMining_8-Layer_Diagram.pptx

**Resolution:** CORE es una nueva plataforma. Eventualmente Aware y Orchestra serán absorbidos por CORE y su experiencia multimodal inteligente. No es renombramiento ni wrapper: es un reemplazo gradual que integra capacidades existentes bajo una experiencia unificada con IA como capa transversal.

---

## Research Gaps

### [CF-07] Research Gap — Sin investigación directa con usuarios finales
Status: PENDING — Flagged for stakeholder discussion
Type: RESEARCH-GAP
Related insights: [IG-SYNTH-03], [IG-SYNTH-09], [IG-SYNTH-11]

- **Gap:** Todas las perspectivas de usuario provienen de stakeholders internos (COO, PMs, equipo TIMining). No hay entrevistas directas con mineros, despachadores, jefes de turno, ni tests de usabilidad.
- **Risk:** Las necesidades de usuario son suposiciones de stakeholders, no evidencia directa. Los insights user-need pueden ser incorrectos.
- **Reinforced (2026-02-20):** 3 fuentes adicionales confirman la necesidad: Touchpoint (plan de 5-7 entrevistas remotas vía Felipe Zoloza), reunion_camila (propuesta de entrevistar ex-empleados como primer paso), _FIELD_NOTES.md (IG-02: "Etapa 2 incompleta sin entrevistas con usuarios clave").

**Action:** Planificar entrevistas directas con usuarios finales en mina. Sugerencia: 6-8 entrevistas en contexto + test de usabilidad con prototipos de CORE. Alternativa propuesta: entrevistar ex-empleados que ahora trabajan en clientes.
- **Priority:** Crítica — fundamento de toda la estrategia UX

---

### [CF-08] Research Gap — Sin datos financieros detallados
Status: PENDING — Needs more research
Type: RESEARCH-GAP
Related insights: [IG-SYNTH-16b], [IG-SYNTH-14]

- **Gap:** Se mencionan cifras sueltas (USD 10M ahorros, USD 5M ARR, USD 450k target) pero no hay breakdown de revenue, márgenes, unit economics, ni CAC/LTV.
- **Risk:** La estrategia de pricing carece de fundamentación financiera. Las decisiones de producto pueden no alinearse con realidad económica.

**Action:** Obtener financial model, unit economics, CAC/LTV. Solicitar al equipo de finanzas o CFO.
- **Priority:** Alta — relevante para /ship PRD y pricing strategy

---

### [CF-09] Research Gap — Sin benchmark competitivo formal
Status: RESOLVED
Type: RESEARCH-GAP
Related insights: [IG-SYNTH-05], [IG-SYNTH-01]

- **Gap:** Las afirmaciones de unicidad ("solo empresa con modelo en tiempo real", "Efecto Suiza") son autorreferenciales. No hay análisis externo de competidores.

**Resolution:** Ya se está trabajando en un benchmark UX inspiracional. El conocimiento competitivo existe informalmente en la interna (el equipo lo tiene claro) pero no hay documentación formal. Queda pendiente documentar este análisis para saber dónde se mueve TIMining vs competidores (Hexagon, Maptek, Deswik, Wenco, Palantir AIP).

---

### [CF-10] Research Gap — Sin datos de accesibilidad
Status: RESOLVED
Type: RESEARCH-GAP
Related insights: [IG-SYNTH-19], [IG-SYNTH-09]

- **Gap:** El design brief menciona "alto contraste obligatorio para uso en terreno con sol brillante" pero no hay auditoría WCAG ni datos de necesidades de accesibilidad de usuarios en mina.

**Resolution:** Es poco probable hacer observaciones en terreno, pero se puede levantar información y aplicar una guía de estándares WCAG que aplique a los pilares de CORE. Incluir requisitos de accesibilidad como parte de las especificaciones de diseño de cada módulo.

---

### [CF-11] Research Gap — Sin perspectiva de ingeniería de software interna
Status: RESOLVED
Type: RESEARCH-GAP
Related insights: [IG-SYNTH-13], [IG-SYNTH-10]

- **Gap:** Se describe stack fragmentado (C++, Unity, Go, Python) pero no hay input del equipo de desarrollo sobre viabilidad, timeline o deuda técnica de la migración a CORE.

**Resolution:** Consultoría no técnica — no está pensado intervenir en arquitectura. Pero debe quedar documentado como riesgo de implementación futura de CORE. Puntos críticos a validar internamente: ¿hay pasos previos bloqueantes? ¿Estado de las APIs? ¿Modelos de datos unificados? ¿El backend es headless? Estas preguntas deben ser respondidas por el equipo de ingeniería antes de comprometer timelines de CORE.

---

### [CF-12] Tensión sobre framing de "Paz Mental"
Status: PENDING — Flagged (llevar a próxima sesión de trabajo con equipo)
Type: AMB-03 (Perspective conflict)
Related insights: [IG-SYNTH-16], [IG-11]

- **Source claim A (interno):** "Paz Mental" como propuesta de valor core — "Mantra operativo: valor no reside en el software sino en la 'Paz Mental' del operador" — Sello de Experiencia, Design Brief, Workshop [IG-SYNTH-16]
- **Source claim B (CEO):** Philip: "no es tanto paz mental, más bien estos tipos no tienen tiempo" — Redefine la necesidad subyacente como falta de tiempo operacional, no ansiedad — sesiones-idemax/Touchpoint
- **Source claim C (CTO):** Carlo: "si les digo que les doy paz mental quedamos como chantas" — Rechaza el branding para uso externo — sesiones-idemax/Touchpoint

**Analysis:** El conflicto tiene dos capas: el CEO cuestiona si el concepto describe la necesidad real (es tiempo, no ansiedad); el CTO rechaza la etiqueta para clientes. Coinciden en que no es para uso externo, pero por razones distintas. Internamente el concepto sigue activo como principio de diseño.

**Action:** Resolver en /synthesis: ¿se mantiene "Paz Mental" como principio interno con otro framing para clientes, o se redefine completamente? Opciones: (A) mantener interno + renombrar para clientes, (B) reemplazar por "certeza operacional" o similar, (C) eliminar del lenguaje.

---

<!-- Updated by /analyze (incremental) on 2026-02-20 -->
