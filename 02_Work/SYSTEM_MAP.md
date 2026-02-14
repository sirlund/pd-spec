# System Map

The product's logic layer. Every decision here traces back to verified insights in `INSIGHTS_GRAPH.md`.

## Product Vision

> TIMining es el sistema nervioso central de la mina — integrador neutro ("Efecto Suiza") que ayuda a cumplir el plan minero mediante datos real-time, IA y sensores virtuales. El valor está en los números que el cliente no tiene, no en replicar los que ya tiene. [IG-40], [IG-41], [IG-91], [IG-90], [IG-50]

## Modules

### Module: Monitoreo Operacional Real-Time (Aware → CORE)
**Status:** Ready
**Refs:** [IG-05], [IG-06], [IG-07], [IG-19], [IG-24], [IG-25], [IG-42], [IG-83]
**Design implications:**
- Timing de datos debe ser transparente: cada capa con su frecuencia visible — [IG-05]
- Capacitación progresiva in-app, no sesiones largas iniciales — [IG-06]
- Métricas por turno, no por día (24h no tiene sentido para mineros) — [IG-07]
- "Desplanificadómetro" como métrica central: desvío acumulado real-time desde t0 — [IG-83]
- Resolver "Brecha Geométrica": minero debe ver contexto geológico y plan espacial — [IG-19]
- Detección de cuellos de botella y curvas lentas como caso de uso primario — [IG-24]
- Plan minero se pierde cada turno — sistema debe detectar cuándo y dónde — [IG-42]

### Module: Planificación y Simulación (Orchestra → AI-driven)
**Status:** Blocked (pendiente definición path de simplificación)
**Refs:** [IG-09], [IG-11], [IG-26], [IG-84], [IG-104], [IG-10]
**Design implications:**
- Simplificar simulador: solo 30% usa funciones avanzadas, debe ser accesible a no-expertos — [IG-104]
- IA corre simulaciones automáticas con motor Orchestra (Phase 7 2026) — [IG-84]
- Reducir carga consultiva de 30-36h por caso — [IG-09]
- Eliminar necesidad de "trucos" y workarounds para camiones autónomos — [IG-11]
- Mantener capacidad de 20+ escenarios en horizontes 3 años — [IG-26]

### Module: Conciliación (Delta)
**Status:** Ready
**Refs:** [IG-04], [IG-27], [IG-65]
**Design implications:**
- Puerta de entrada al portfolio: mantener baja fricción de entrada — [IG-04]
- Resultados <1 minuto como estándar no negociable — [IG-27]
- Conciliación geométrica como prueba tangible de valor (adherencia plan) — [IG-65]

### Module: Suite Geotécnica (SIC, Tangram, ARIS)
**Status:** Ready
**Refs:** [IG-03], [IG-28], [IG-29], [IG-30], [IG-35], [IG-12]
**Design implications:**
- No romper base leal al modernizar interfaces — [IG-03]
- Mantener ventaja competitiva ARIS: integración de cualquier instrumento sin cobros extra — [IG-35]
- SIC con alta autonomía de usuarios: preservar ese patrón de UX — [IG-12]
- Tangram: predicción de bloques como caso crítico de seguridad — [IG-28]
- ARIS: 30+ tipos de instrumentos, alertas automáticas — [IG-30]

### Module: Copiloto IA (Project TIM)
**Status:** Ready
**Refs:** [IG-67]-[IG-75], [IG-78], [IG-47], [IG-82], [IG-98], [IG-76], [IG-77]
**Design implications:**
- Proactivo no reactivo: alertas push antes de que el problema ocurra — [IG-47]
- Multicanal: WhatsApp, chat, radio mina — donde esté el usuario — [IG-72], [IG-77]
- Path gradual hacia autonomía "Skynet": sugerencias → recomendaciones → órdenes — [IG-78]
- Contexto de turno anterior automático sin depender de WhatsApp informal — [IG-76]
- Copiloto que soporte decisiones, no que reemplace al humano (aún) — [IG-82]
- Shift describir→prescribir como evolución natural — [IG-98]

### Module: Plataforma Unificada (CORE)
**Status:** Blocked (pendiente timeline migración stack)
**Refs:** [IG-16], [IG-17], [IG-18], [IG-44], [IG-48], [IG-57], [IG-58], [IG-59]
**Design implications:**
- Auth unificado como primer paso de unificación — [IG-17]
- Multimodal por defecto: no forzar una sola UI — [IG-48]
- Resolver fragmentación stack (C++/Unity/Go/Python/web/email) — [IG-16]
- Eliminar cruces manuales de BD, reemplazar con APIs — [IG-18]
- Definir arquitectura coherente ANTES de implementar — [IG-58]
- La experiencia incluye instalación y onboarding — [IG-59]

## Design Principles

### 1. Mostrar lo invisible, no replicar lo conocido
El valor está en números que el cliente no tiene. No gastar energía en igualar números existentes.
**Refs:** [IG-50], [IG-19], [IG-83]

### 2. Proactivo sobre reactivo
Alertas y recomendaciones antes de que el problema se consolide. "Paz mental" para el usuario.
**Refs:** [IG-47], [IG-72], [IG-73], [IG-74]

### 3. Simplicidad > features (Homer's Car Detector)
Resistir la tentación de agregar funcionalidades que no se usan. Los usuarios quieren herramientas fáciles, robustas y accionables.
**Refs:** [IG-08], [IG-39], [IG-80], [IG-81]

### 4. Diagnosticar, no solo reportar
Los usuarios cuentan dolores, no problemas. El sistema debe hacer el diagnóstico como un médico.
**Refs:** [IG-55], [IG-82]

### 5. La experiencia incluye el deploy
Si la instalación es complicada, es parte de la mala experiencia. El punto de partida debe ser razonablemente bueno.
**Refs:** [IG-59], [IG-22], [IG-52]

### 6. Multimodal por defecto
Llegar al usuario por múltiples canales (Aware, reportes, alertas, chat, radio). No asumir una sola interfaz.
**Refs:** [IG-48], [IG-57], [IG-109]

## Open Questions

- [ ] ¿Bundles Aware/Orchestra obligatorios o opcionales? — CF-01 flagged → Sales + Product
- [ ] ¿Límites de customización por tier de cliente? — CF-02 flagged → CEO + CTO
- [ ] ¿Estrategia para audiencia CFO? TIMining no habla con ellos actualmente — [IG-49]
- [ ] ¿Plan para desconcentrar conocimiento crítico de Carlo? — [IG-110]
- [ ] ¿Realinear pricing de "licencia" a "valor empresarial"? — [IG-94]
- [ ] ¿Timeline migración stack fragmentado hacia plataforma unificada? — [IG-16]
- [ ] ¿Benchmark UX contra industria minera o contra software moderno? — CF-05 context
