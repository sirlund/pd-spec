# System Map

The product's logic layer. Every decision here traces back to verified insights in `INSIGHTS_GRAPH.md`.

## Product Vision

> TIMining CORE es la plataforma unificada que cierra la "Geometry Gap" entre el plan minero y la realidad operacional, transformando datos en tiempo real en inteligencia accionable mediante el patrón Detección→Análisis→Recomendación, personalizada por perfil de usuario, y diseñada para dar "Paz Mental" en entornos operacionales críticos. [IG-SYNTH-01, IG-SYNTH-06, IG-SYNTH-09, IG-SYNTH-16]

CORE absorbe y reemplaza gradualmente a Aware y Orchestra, integrando las capacidades de ambos bajo una experiencia multimodal inteligente con un nuevo módulo transversal de IA (TIM Agent). [IG-SYNTH-10, CF-06]

## Modules

### Module: Geometry Engine
**Status:** Ready
**Refs:** [IG-SYNTH-01], [IG-SYNTH-12]
**Design implications:**
- Topografía en tiempo real cada 15 min como dato fundacional de toda la plataforma — [IG-SYNTH-01]
- Adherencia espacial (plan compliance) como métrica principal, no toneladas movidas — [IG-SYNTH-12]
- Conciliación plan vs realidad visible en tiempo real para todos los perfiles — [IG-SYNTH-12]

### Module: Copiloto Inteligente (TIM Agent)
**Status:** Ready
**Refs:** [IG-SYNTH-04], [IG-SYNTH-06], [IG-SYNTH-08]
**Design implications:**
- Toda funcionalidad sigue el patrón Detección → Análisis → Recomendación — [IG-SYNTH-06]
- Sistema proactivo que anticipa problemas y sugiere soluciones rankeadas — [IG-SYNTH-04]
- Lenguaje natural (Gemini) como interfaz primaria de consulta — [IG-SYNTH-08]
- Simulaciones automáticas cada X minutos con sugerencias priorizadas — [IG-SYNTH-04]

### Module: Experiencia Multimodal (4 Lentes)
**Status:** Blocked
**Refs:** [IG-SYNTH-19], [IG-SYNTH-09], [IG-SYNTH-07], [IG-SYNTH-16]
**Blocker:** Requiere definición detallada de cada lente por perfil de usuario. 3D tiene valor pero UX actual saturada necesita rediseño de jerarquía visual [CF-02].
**Design implications:**
- 4 lentes de navegación: Reality (3D), Tactical (2D), Agent (conversacional), Briefing (feed) — [IG-SYNTH-19]
- Diferenciación por perfil: Despachador, Jefe de Turno, Gerente de Mina, Planificador — [IG-SYNTH-09]
- 3D valioso pero UX actual saturada: rediseñar con jerarquía visual clara — [CF-02]
- Gestión por excepción: solo mostrar anomalías, no el estado normal — [IG-SYNTH-07]
- Cada interacción debe dar "Paz Mental": certeza, no más datos — [IG-SYNTH-16]

### Module: Briefing de Turno
**Status:** Ready
**Refs:** [IG-SYNTH-15], [IG-SYNTH-17]
**Design implications:**
- Briefings automáticos multimedia (voice note, video reel, KPI summary) 15 min antes del turno — [IG-SYNTH-15]
- Embeber en la rutina estándar de cambio de turno para generar stickiness — [IG-SYNTH-17]
- Eliminar "Efecto Gaviota": turno entrante con contexto completo sin preguntar — [IG-SYNTH-15]

### Module: Seguridad y Geotecnia
**Status:** Ready
**Refs:** [IG-SYNTH-18]
**Design implications:**
- Alertas de seguridad geotécnica como funcionalidad crítica (3 de 20 casos de uso del workshop) — [IG-SYNTH-18]
- Integración ARIS aspiracional pero compleja: evaluar viabilidad sin complejizar la interfaz — [IG-SYNTH-18]
- Verificación de procedimientos de trabajo y gestión de tronaduras — [IG-SYNTH-18]

### Module: Plataforma de Integración (Efecto Suiza)
**Status:** Blocked
**Refs:** [IG-SYNTH-05], [IG-SYNTH-13]
**Blocker:** Stack fragmentado sin autenticación unificada [IG-SYNTH-13]. Riesgo de implementación técnico documentado en CF-11 — preguntas abiertas: APIs, modelos de datos, backend headless, pasos bloqueantes.
**Design implications:**
- Integración agnóstica con cualquier OEM (Komatsu, Cat, Modular, Hexagon) y software de planificación (Maptek, Deswik) — [IG-SYNTH-05]
- Autenticación unificada como prerrequisito de la plataforma — [IG-SYNTH-13]

### Module: Onboarding Progresivo
**Status:** Ready
**Refs:** [IG-SYNTH-11], [IG-SYNTH-02]
**Design implications:**
- Capacitación in-app contextual por perfil, no manuales genéricos — [IG-SYNTH-11]
- Complejidad progresiva: interfaz intuitiva sin certificación previa — [IG-SYNTH-11]
- "Zero Homer": cada feature debe justificar su existencia con evidencia de uso — [IG-SYNTH-02]

## Design Principles

### 1. "Paz Mental"
Cada interacción debe reducir la carga cognitiva, no aumentarla. El valor del producto es la certeza de que se está tomando la decisión correcta. Si una pantalla genera más preguntas que respuestas, está fallando.
**Refs:** [IG-SYNTH-16], [IG-SYNTH-07]

### 2. "Quiet UI"
Solo mostrar lo que importa. Si hay 50 camiones bien, no mostrarlos. Gestión por excepción: el sistema vigila silenciosamente y notifica solo cuando es crítico. Alertas legibles en menos de 5 segundos.
**Refs:** [IG-SYNTH-07], [IG-SYNTH-06]

### 3. "Zero Homer"
No implementar features sin validar uso real. Cada funcionalidad debe justificar su existencia con evidencia de adopción. Si no hay [IG-XX] que lo respalde, no se construye.
**Refs:** [IG-SYNTH-02]

### 4. "D→A→R"
Toda funcionalidad sigue el patrón Detección → Análisis → Recomendación. Este es el esqueleto UX validado por 20 casos de uso del workshop. No hay excepciones.
**Refs:** [IG-SYNTH-06]

### 5. "Inteligencia Democrática"
Cualquier perfil accede a insights sin expertise técnico. De expertos SQL a lenguaje natural. De desktop a bolsillo. De 5 usuarios a 100+ por sitio.
**Refs:** [IG-SYNTH-08], [IG-SYNTH-09]

### 6. "Efecto Suiza"
Integración neutral con cualquier OEM, FMS o software de planificación. Nunca tomar partido por un vendor. El valor está en ser el hub que conecta lo que no se conecta.
**Refs:** [IG-SYNTH-05]

### 7. "Operational Pull"
Diseñar para adopción bottom-up. La herramienta debe embeberse en rutinas operacionales diarias (cambio de turno) y generar tracción interna que acelere acuerdos corporativos. No depender de mandatos top-down.
**Refs:** [IG-SYNTH-17]

## Open Questions

- [ ] ¿Framework formal para distinguir configuración (umbrales sin código) vs customización (features con código)? — [CF-05]
- [ ] ¿Unit economics del modelo SaaS actual? CAC, LTV, márgenes, breakdown de revenue — [CF-08]
- [ ] ¿Benchmark UX formal vs competencia minera (Hexagon, Maptek, Deswik, Wenco)? — [CF-03]
- [ ] ¿Validación directa con usuarios finales en mina? Entrevistas y tests de usabilidad — [CF-07]
- [ ] ¿Bloqueantes técnicos para migración a CORE? APIs, modelos de datos, backend headless, pasos previos — [CF-11]
- [ ] ¿Estándares WCAG aplicables a cada pilar de CORE? — [CF-10]
- [ ] ¿Automatización progresiva: human-in-the-loop como restricción permanente o transicional? — [IG-SYNTH-22]
- [ ] ¿Hub de decisiones: cómo capturar lo que ocurre en WhatsApp/radio? — [IG-SYNTH-23]
- [ ] ¿"Paz Mental" como concepto: mantener interno, renombrar o eliminar? — [CF-12]

<!-- Updated by /synthesis on 2026-02-20 -->
