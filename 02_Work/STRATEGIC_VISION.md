# Visión Estratégica

La capa estratégica del producto. Cada decisión aquí se basa en insights verificados en `INSIGHTS_GRAPH.md`.

## Product Vision

TIMining CORE se posiciona como el **copiloto inteligente** que cierra la brecha crítica entre planificación minera y operación diaria, proporcionando **paz mental operativa** a través de monitoreo espacial en tiempo real y prescripciones automatizadas con control humano.

*Grounded in:* [IG-SYNTH-01], [IG-SYNTH-02], [IG-01]

## Product Strategy

### Posicionamiento de Mercado
- **Especialista agnóstico** que integra datos de OEMs competidores (Komatsu, Cat, Modular, Hexagon) en contexto unificado que ningún fabricante individual puede replicar
- **Ventaja competitiva única:** geometría en tiempo real actualizada cada 15 minutos, capacidad que no posee ningún competidor
- **Evolución premium:** de TIMining Aware ($300K) a CORE ($450K) con "Democratic Intelligence" - moviendo insights del escritorio al bolsillo

*Grounded in:* [IG-16], [IG-15], [IG-SYNTH-10]

### Modelo de Negocio
- **Valor demostrado:** $10M+ en ahorros comprobados en operaciones Tier-1
- **Potencial de industria:** USD 15B anuales de valor agregado con solo 5% mejora en adherencia al plan
- **Escalabilidad:** usuarios ilimitados por sitio, licencia renovable anual

*Grounded in:* [IG-15], [IG-SYNTH-02]

## Design Principles

### Quiet UI
**Descripción:** El silencio como estado default. La interfaz muestra únicamente información accionable, manteniendo tranquilidad visual hasta que algo específico requiere atención del operador.

**Cómo guía decisiones:** Evita la saturación de datos donde "todo se ilumina igual" resultando en que nada sea realmente crítico. Cada elemento mostrado debe ser accionable, no datos que solo confunden.

**Refs:** [IG-SYNTH-04], [IG-SYNTH-05]

### Human-in-the-Loop
**Descripción:** El sistema detecta, analiza y recomienda, pero el operador siempre decide la acción final. Nunca ejecución automática sin intervención humana.

**Cómo guía decisiones:** Prioriza la adopción y confianza del operador por encima de la automatización completa. El perfil del operador es crítico - si no logramos vender al operador, el proyecto fracasa.

**Refs:** [IG-07], [CF-01 resolved]

### DART Pattern
**Descripción:** Detección-Análisis-Recomendación-Decisión estructura el flujo operativo. Evolución de "médico operacional" a "recomendador certero".

**Cómo guía decisiones:** Cada funcionalidad debe seguir esta secuencia: identificar problemas, analizarlos en contexto, generar recomendaciones específicas, y facilitar la decisión humana informada.

**Refs:** [IG-02]

## Operational Domains

### Monitoreo en Tiempo Real
**Territorio funcional:** Visibilidad espacial y temporal de la operación mediante soft sensors y reconstrucción geométrica.

**Capacidades core:**
- Topografía inferida de alta precisión cada 15 minutos
- Tracking de superficies de tajo y progreso de perforación
- Modelado en tiempo real de geometrías de mina e información de equipos

**Refs:** [IG-SYNTH-06], [IG-SYNTH-03]

### Comunicación Operativa
**Territorio funcional:** Canales de comunicación crítica y alertas móviles ruggedizadas para terreno.

**Capacidades core:**
- Integración nativa con WhatsApp para comunicaciones críticas y emergencias
- Sistema de alertas móviles con notificaciones push en dispositivos ruggedizados
- Inteligencia glanceable con legibilidad en bajo 5 segundos y alto contraste

**Refs:** [IG-04], [IG-22], [IG-12], [IG-18]

### Integración de Datos
**Territorio funcional:** Unificación de silos de información y conectividad con sistemas empresariales.

**Capacidades core:**
- Capa agnóstica que integra múltiples OEMs y software de planificación
- Conectores nativos con sistemas empresariales (SAP) y capacidad de exportación
- Funcionamiento resiliente ante conectividad intermitente con sync automática

**Refs:** [IG-SYNTH-08], [IG-24], [IG-23]

### Planificación Adaptativa
**Territorio funcional:** Cierre del loop entre diseño y realidad con prescripciones automatizadas.

**Capacidades core:**
- Visibilidad en tiempo real del impacto de diseños en la flota
- Generación automática de reportes de turno y análisis de adherencia al plan
- Prescripciones automatizadas basadas en geometría actualizada

**Refs:** [IG-13], [IG-26], [IG-SYNTH-07]

## Value Propositions

### Para Operadores de Campo
**Outcome:** Paz mental operativa con interfaces ruggedizadas que minimizan curva de aprendizaje (máximo 2 horas capacitación) y proporcionan solo información accionable cuando se necesita.

**Refs:** [IG-01], [IG-21], [IG-25]

### Para Supervisores y Gerentes
**Outcome:** Inteligencia móvil que permite recibir alertas operativas y analizar causas raíz desde terreno, con visibilidad unificada que rompe silos entre áreas.

**Refs:** [IG-12], [IG-10], [IG-SYNTH-08]

### Para Planificadores
**Outcome:** Visibilidad en tiempo real del impacto de sus diseños en la operación, con datos e hipótesis para decisiones bajo estrés operativo y cierre del loop plan-operación.

**Refs:** [IG-13], [IG-09], [IG-SYNTH-02]

### Para la Organización
**Outcome:** Mejoras medibles en adherencia al plan (5-19%) y velocidades de flota (+1.8 km/h), traducidas en millones de dólares de valor capturado por sitio.

**Refs:** [IG-SYNTH-07], [IG-15]

## Open Questions

- [ ] ¿Cómo validar la calidad de datos GPS antes de generar inteligencia? [IG-08]
- [ ] ¿Qué nivel de automatización aceptarán diferentes perfiles de operadores?
- [ ] ¿Cómo integrar las restricciones geotécnicas en interfaces de despacho? [IG-14]
- [ ] ¿Cuál es el roadmap hacia "Skynet" respetando human-in-the-loop? [IG-05]
- [ ] ¿Cómo escalar Democratic Intelligence a 100+ usuarios activos por sitio?