# Design Proposals

Design decisions organized by operational domain. Each proposal traces back to verified insights.

<!-- Format:
     ## Domain: [domain name]

     ### [DP-XX] [Name]
     **Type:** module | feature
     **Domain:** [domain name]
     **Status:** PROPOSED | VALIDATED | BUILDING | SHIPPED
     **Grounded in:** [IG-XX], [IG-XX]
     **Parent:** [DP-XX] (features point to their module)
     **Design implications:**
     - ...
     **Acceptance criteria:**
     - ...
     **Open questions:**
     - ...
-->

---

## Domain: A — Respuesta a Crisis

### [DP-01] Geometry Engine
**Type:** module
**Domain:** A — Respuesta a Crisis
**Status:** BUILDING
**Grounded in:** [IG-SYNTH-01], [IG-15], [IG-SYNTH-07], [IG-SYNTH-18]

TIMining es la única plataforma que corre simulaciones sobre topografía actualizada cada 15 minutos usando datos GPS de equipos existentes, sin drones ni hardware adicional. Cierra la "Geometry Gap" — la brecha entre el plan (geometría estimada) y la realidad del terreno — y es el diferenciador técnico que ningún competidor puede replicar en el corto plazo.

**Design implications:**
- El sistema actualiza el modelo topográfico en tiempo real; los desvíos geométricos se detectan automáticamente, no por reporte manual — [IG-SYNTH-01]
- Las alertas de desvío geométrico se priorizan por impacto en seguridad y productividad; el usuario recibe señal, no ruido — [IG-SYNTH-07]
- Cuando los datos GPS son degradados (señal débil, equipo detenido), el motor debe comunicar explícitamente la incertidumbre del modelo — [IG-15]
- El módulo opera como backend silencioso; el operador no necesita entender el motor para beneficiarse de sus alertas — [IG-SYNTH-18]

**Acceptance criteria:**
- [ ] Actualización topográfica cada ≤15 minutos sin intervención del operador
- [ ] Detección automática de desvíos con nivel de severidad (alerta, crítico)
- [ ] Indicador de confianza del modelo cuando GPS está degradado [IG-15]
- [ ] Latencia de alerta geométrica ≤2 minutos desde detección de desvío

**Open questions:**
- ¿Cuál es la granularidad mínima de actualización que el cliente percibe como "tiempo real"?
- ¿Qué ocurre cuando el 30%+ de los equipos tienen GPS degradado simultáneamente? → [IG-15]

---

## Domain: B — Anticipación Operativa

### [DP-02] Copiloto Inteligente
**Type:** module
**Domain:** B — Anticipación Operativa
**Status:** PROPOSED
**Grounded in:** [IG-SYNTH-06], [IG-SYNTH-08], [IG-08], [IG-SYNTH-02], [IG-22], [IG-18]

TIM Agent es la capa transversal de IA que convierte datos brutos en recomendaciones accionables. Las 60 reglas operacionales propietarias (dispatching, cambio de turno, secuencias de salida) actúan como filtro que impide que la IA genere recomendaciones operacionalmente inválidas. Sin estas reglas, un LLM conectado a datos mineros alucina. El módulo es el esqueleto UX del Dominio B — toda interacción sigue el patrón D→A→R.

**Design implications:**
- Toda recomendación expone su razonamiento (costo/beneficio visible); la recomendación sin razón genera resistencia — [IG-SYNTH-06]
- Las 60 reglas de negocio son la capa de validación que diferencia TIM Agent de IA genérica; deben mantenerse actualizadas como ventaja competitiva — [IG-08]
- El módulo cubre ambas bifurcaciones de valor: plan compliance (Casos 1-6) y plan optimization (Casos 7-8) — [IG-22]
- Cualquier perfil accede a insights sin expertise técnico; SQL → lenguaje natural — [IG-SYNTH-08]
- No implementar capabilities sin evidencia de uso real; cada funcionalidad de TIM Agent justifica su existencia con [IG-XX] — [IG-SYNTH-02]

**Acceptance criteria:**
- [ ] Toda recomendación incluye la razón (impacto esperado, alternativas consideradas)
- [ ] El usuario puede rechazar una recomendación y el sistema registra el motivo
- [ ] Flujo D→A→R completable en ≤3 interacciones para los Casos 1-6
- [ ] Consultas en lenguaje natural producen respuestas operacionalmente válidas

**Open questions:**
- ¿Cómo se mantiene actualizado el corpus de reglas cuando la operación cambia? ¿Proceso de gobernanza? → [IG-08]
- ¿Cuál es el umbral de confianza mínima para que TIM Agent emita una recomendación vs. escalar al operador?

---

### [DP-03] Briefing de Turno
**Type:** feature
**Domain:** B — Anticipación Operativa
**Status:** PROPOSED
**Grounded in:** [IG-SYNTH-15], [IG-SYNTH-03], [IG-SYNTH-12]
**Parent:** [DP-02] Copiloto Inteligente

El cambio de turno no borra el contexto. El briefing sintetiza automáticamente el estado de la operación al inicio de cada turno: desvíos activos, decisiones tomadas en el turno anterior, tendencias tempranas. Convierte el "¿qué pasó?" de 30 minutos en una lectura de 2 minutos.

**Design implications:**
- El briefing es generado, no capturado manualmente; el sistema lo construye de datos existentes — [IG-SYNTH-15]
- El contexto del turno anterior persiste y es visible para el nuevo turno; no hay amnesia operacional — [IG-SYNTH-03]
- Las tendencias tempranas de desvío se señalan en el briefing, no solo los incidentes consumados — [IG-SYNTH-12]

**Acceptance criteria:**
- [ ] Briefing disponible automáticamente al inicio de cada turno (sin acción del operador)
- [ ] Incluye: desvíos activos, decisiones relevantes del turno anterior, alertas tempranas
- [ ] Legible en ≤2 minutos (formato escaneado, no narrativo)
- [ ] El Jefe de Turno entrante puede confirmar lectura con un gesto

**Open questions:**
- ¿Qué información del turno anterior es sensible y no debe transmitirse automáticamente al siguiente turno?

---

### [DP-04] Time Scrubbing
**Type:** feature
**Domain:** B — Anticipación Operativa
**Status:** PROPOSED
**Grounded in:** [IG-19], [IG-SYNTH-15], [IG-SYNTH-03]
**Parent:** [DP-02] Copiloto Inteligente

Capacidad de "rebobinar" la operación hasta el momento del primer desvío para ver la cadena causal completa. El usuario puede navegar hacia atrás en el tiempo sobre el estado del sistema, identificando cuándo comenzó un problema y qué decisiones lo antecedieron. Benchmark: Tesla Fleet (replay de telemetría de vehículos).

**Design implications:**
- Cada dato tiene temporalidad visible: antigüedad + tendencia + momento del primer desvío — [IG-19]
- La navegación temporal debe ser intuitiva (scrubbing, no formulario de fechas); modelo mental: barra de video — [IG-19]
- El Time Scrubbing no es solo lectura pasada; permite reconstruir la cadena causal para aprendizaje y post-mortem — [IG-SYNTH-03]

**Acceptance criteria:**
- [ ] El usuario puede navegar al estado del sistema en cualquier punto del turno actual y del anterior
- [ ] La antigüedad de cada dato es visible inline (no en tooltip; legible sin interacción)
- [ ] La cadena causal de un incidente es reconstruible en ≤5 clics desde el momento del desvío
- [ ] Granularidad: por evento (no por minuto arbitrario)

**Open questions:**
- ¿Cuál es la granularidad óptima? ¿Por minuto, por evento, por decisión del operador? → validar en Etapa 2 [IG-19]
- ¿Cuántos turnos hacia atrás debe alcanzar el Time Scrubbing? ¿1 turno? ¿1 semana?

---

## Domain: C — Asistencia Inteligente

### [DP-05] Experiencia Multimodal 4 Lentes
**Type:** module
**Domain:** C — Asistencia Inteligente
**Status:** PROPOSED
**Grounded in:** [IG-16], [IG-17], [IG-03], [IG-SYNTH-19], [IG-SYNTH-05], [IG-23]

El sistema es agnóstico al canal: si la mina usa WhatsApp, el sistema está en WhatsApp. Las decisiones que ocurren fuera del software no se pierden. Los 4 pilares son la arquitectura de presentación: Quiet UI + Omni Sense definen *cómo* se presenta la información (canal + materialización); Clear Path + Time Sight definen *qué* se presenta (contenido + temporalidad).

**Design implications:**
- WhatsApp es canal primario, no integración secundaria; si la mina opera en WhatsApp, CORE debe operar en WhatsApp — [IG-03]
- El módulo captura decisiones tomadas fuera de la plataforma (WhatsApp, radio); la información no puede perderse porque el operador no abrió la app — [IG-SYNTH-19]
- La integración es neutral con cualquier OEM, FMS o software de planificación existente (Hexagon, Maptek, Komatsu) — [IG-SYNTH-05]
- La distinción arquitectural QUI+OS = cómo / CP+TS = qué debe reflejarse en los permisos de capa: cada pilar tiene su dominio de responsabilidad — [IG-17]

**Acceptance criteria:**
- [ ] WhatsApp habilitado como canal de entrada/salida para Jefe de Turno y Despachador
- [ ] Las decisiones capturadas por WhatsApp/Radio se integran al registro operacional con la misma trazabilidad que las hechas en UI
- [ ] La configuración de canales activos es por cliente, no hardcodeada
- [ ] Un operador puede completar los Casos 1-6 por al menos 2 canales diferentes

**Open questions:**
- ¿Qué decisiones son capturables por WhatsApp y cuáles requieren la UI completa? ¿Cuál es el límite de complejidad por canal?

---

### [DP-06] Manos Libres / Edge AI
**Type:** feature
**Domain:** C — Asistencia Inteligente
**Status:** PROPOSED
**Grounded in:** [IG-21], [IG-SYNTH-19]
**Parent:** [DP-05] Experiencia Multimodal 4 Lentes

En terreno, el Jefe de Turno no puede usar las manos. Push-to-Talk y Edge AI son requisitos de diseño, no opcionales para este perfil. La interfaz en terreno debe operar con conectividad mínima y latencia tolerante.

**Design implications:**
- Push-to-Talk como modalidad primaria de entrada para operadores en terreno — no teclado virtual — [IG-21]
- Edge AI: el procesamiento crítico debe ocurrir localmente para tolerar conectividad intermitente en faena — [IG-21]
- Las alertas en terreno deben ser percibibles sin mirar la pantalla (audio + vibración) — [IG-SYNTH-19]
- La sesión no puede depender de conectividad continua; las decisiones se sincronizan cuando el canal está disponible — [IG-21]

**Acceptance criteria:**
- [ ] Push-to-Talk funcional para emitir y recibir recomendaciones en terreno
- [ ] El sistema opera en modo degradado (alertas + consultas básicas) con conectividad < 3G
- [ ] Las alertas críticas de seguridad geotécnica son auditivas, no solo visuales
- [ ] La sincronización offline→online es transparente para el operador (no requiere acción)

**Open questions:**
- ¿Cuáles son los requisitos mínimos de conectividad y latencia aceptable en faena? → validar en Etapa 2 [IG-21]
- ¿Qué subset de funcionalidad es "core offline" vs. "enhanced online"?

---

## Domain: D — Alineación Estratégica

### [DP-07] Plataforma de Integración
**Type:** module
**Domain:** D — Alineación Estratégica
**Status:** PROPOSED
**Grounded in:** [IG-06], [IG-20], [IG-SYNTH-05], [IG-11], [IG-13], [IG-SYNTH-16b], [IG-25]

La desconexión mina-planta deja al CFO dependiente de reportes manuales tardíos. La Plataforma de Integración cierra ese gap conectando KPIs operacionales con métricas financieras accionables, sin que el CFO necesite entender terminología minera. Integración neutral con cualquier OEM, FMS o software de planificación existente.

**Design implications:**
- La desconexión mina-planta es el Caso 8; la plataforma debe modelar el flujo de datos operación → finanzas como ciudadano de primera clase — [IG-06]
- El CFO es el quinto perfil (usuario invisible, apuesta estratégica 2026); su experiencia debe diseñarse aunque no sea el comprador actual — [IG-20]
- El modelo de precios es custom por cliente (no SaaS estándar); la plataforma debe soportar configuración de módulos sin desarrollo custom — [IG-13]
- El ticket de USD 450K se justifica ante el CFO con impacto financiero medible, no con features de software — [IG-11]
- La propuesta de valor para estrategia es: "cuándo y por qué reconfigurar el plan antes de que el costo sea irrecuperable" — [IG-SYNTH-16b]

**Acceptance criteria:**
- [ ] El CFO puede ver KPIs operacionales en lenguaje financiero sin entrenamiento en minería
- [ ] El modelo de datos conecta variables operacionales (toneladas, ciclos, downtime) con métricas financieras (costo por tonelada, desviación de presupuesto)
- [ ] La configuración de módulos activos y permisos es por cliente, sin código
- [ ] Integración via API con al menos 1 FMS (Hexagon o Komatsu) en Etapa 2

**Open questions:**
- ¿Cuál es el modelo de datos que une operaciones con finanzas? ¿Qué KPIs financieros necesita el CFO diariamente? → [IG-20], [CF-08]
- ¿Cómo se mide el valor por decisión individual para demostrar ROI del ticket USD 450K? → [IG-11], [CF-08]
- ¿Framework formal de configuración vs. extensión vs. custom? → [CF-05]

<!-- Updated by /spec on 2026-02-26 -->
