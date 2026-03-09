# Propuestas de Diseño

Decisiones de diseño organizadas por dominio operacional. Cada propuesta se basa en insights verificados.

## Dominio: Monitoreo en Tiempo Real

### [DP-01] TIMining Aware Mobile
**Tipo:** module
**Dominio:** Monitoreo en Tiempo Real
**Status:** PROPOSED
**Grounded in:** [IG-SYNTH-06], [IG-21], [IG-23]
**Parent:** —

**Implicaciones de diseño:**
- Interfaces ruggedizadas optimizadas para tablets resistentes y acceso desde camiones
- Dashboard que carga rápido en conexiones lentas con capacidad offline
- Sincronización automática al recuperar conectividad
- Topografía inferida actualizada cada 15 minutos
- Soft sensors para tracking de superficies de tajo sin sensores físicos

**Criterios de aceptación:**
- [ ] Funciona en tablets ruggedizadas con legibilidad bajo luz solar directa
- [ ] Carga completa en <10 segundos con conexión 3G lenta
- [ ] Mantiene funcionalidad core sin conectividad por >2 horas
- [ ] Sincroniza automáticamente cambios al restaurar conexión
- [ ] Actualiza geometrías cada 15 minutos cuando hay conectividad

**Preguntas abiertas:**
- ¿Qué datos críticos deben estar disponibles offline?
- ¿Cómo validar calidad de GPS antes de mostrar inteligencia?
- ¿Qué nivel de detalle geométrico es suficiente para decisiones de campo?

### [DP-02] Glanceable Intelligence Engine
**Tipo:** feature
**Dominio:** Monitoreo en Tiempo Real
**Status:** PROPOSED
**Grounded in:** [IG-18], [IG-SYNTH-05], [IG-SYNTH-04]
**Parent:** [DP-01]

**Implicaciones de diseño:**
- Alto contraste obligatorio para uso en terreno con luz solar
- Principio Quiet UI: silencio como estado default, alertas específicas únicamente
- Información crítica debe ser legible en bajo 5 segundos
- Solo mostrar datos accionables para evitar saturación

**Criterios de aceptación:**
- [ ] Alertas críticas legibles en <5 segundos bajo luz solar directa
- [ ] Estado default sin información innecesaria (pantalla limpia)
- [ ] Contraste mínimo 4.5:1 para todos los elementos críticos
- [ ] Máximo 3 alertas simultáneas para evitar saturación

**Preguntas abiertas:**
- ¿Cómo definir qué es "accionable" versus "informativo"?
- ¿Qué jerarquía de alertas implementar (crítico/advertencia/info)?

## Dominio: Comunicación Operativa

### [DP-03] WhatsApp Operations Hub
**Tipo:** module
**Dominio:** Comunicación Operativa
**Status:** PROPOSED
**Grounded in:** [IG-04], [IG-22], [IG-12]
**Parent:** —

**Implicaciones de diseño:**
- Integración nativa con WhatsApp Business API para comunicaciones críticas
- Sistema de alertas push que llegan directamente al celular del supervisor
- Notificaciones de emergencia prioritarias vía WhatsApp
- Inteligencia móvil desacoplada de computadores fijos

**Criterios de aceptación:**
- [ ] Integración bidireccional con WhatsApp Business API
- [ ] Alertas de emergencia llegan en <30 segundos al supervisor
- [ ] Clasificación automática de urgencia (crítico/operativo/informativo)
- [ ] Historial de comunicaciones críticas para análisis post-evento
- [ ] Funciona 24/7 independiente de conectividad de sistemas principales

**Preguntas abiertas:**
- ¿Cómo integrar con protocolos de seguridad existentes?
- ¿Qué información puede transmitirse por WhatsApp sin comprometer seguridad?
- ¿Cómo manejar múltiples turnos y handovers via WhatsApp?

### [DP-04] Mobile Intelligence Interface
**Tipo:** feature
**Dominio:** Comunicación Operativa
**Status:** PROPOSED
**Grounded in:** [IG-12], [IG-25], [IG-01]
**Parent:** [DP-03]

**Implicaciones de diseño:**
- Vistas adaptadas por rol con permisos diferenciados
- Capacitación mínima requerida (máximo 2 horas)
- Filtros operativos por turno y sector
- Genera paz mental con información relevante y oportuna

**Criterios de aceptación:**
- [ ] Onboarding completo en <2 horas para cualquier rol
- [ ] Personalización por rol (operador/supervisor/gerente) sin configuración manual
- [ ] Filtros automáticos por turno activo y sector asignado
- [ ] Vista resumida ejecutiva para acceso desde oficina

**Preguntas abiertas:**
- ¿Cómo balancear personalización versus simplicidad?
- ¿Qué métricas usar para medir "paz mental" del usuario?

## Dominio: Integración de Datos

### [DP-05] Enterprise Integration Layer
**Tipo:** module
**Dominio:** Integración de Datos
**Status:** PROPOSED
**Grounded in:** [IG-24], [IG-SYNTH-08], [IG-16]
**Parent:** —

**Implicaciones de diseño:**
- Conectores nativos con sistemas empresariales (SAP, Oracle)
- Capacidad de exportación de datos a Excel para análisis complementarios
- Capa agnóstica que unifica múltiples OEMs y software de planificación
- Rompe silos de información entre mina-planta

**Criterios de aceptación:**
- [ ] API connectors para SAP, Oracle, y principales ERP mineros
- [ ] Exportación one-click a Excel con templates predefinidos
- [ ] Integración agnóstica con Komatsu, Cat, Modular, Hexagon
- [ ] Dashboard unificado que muestra datos de mina y planta simultáneamente
- [ ] Fuente única de verdad para métricas compartidas

**Preguntas abiertas:**
- ¿Cómo manejar conflictos entre fuentes de datos diferentes?
- ¿Qué datos deben sincronizarse en tiempo real versus batch?
- ¿Cómo validar integridad de datos entre sistemas?

### [DP-06] Data Quality Gate
**Tipo:** feature
**Dominio:** Integración de Datos
**Status:** PROPOSED
**Grounded in:** [IG-08], [IG-SYNTH-09]
**Parent:** [DP-05]

**Implicaciones de diseño:**
- Validación de datos GPS antes de generar inteligencia
- Manejo del ruido en fuentes de datos de múltiples proveedores
- Alertas cuando datos no son confiables para toma de decisiones

**Criterios de aceptación:**
- [ ] Validación automática de coordenadas GPS contra rangos esperados
- [ ] Bloqueo de inteligencia cuando datos fuente no son confiables
- [ ] Dashboard de calidad de datos por fuente y timestamp
- [ ] Alertas proactivas cuando deteriora calidad de una fuente crítica

**Preguntas abiertas:**
- ¿Qué umbrales de confiabilidad usar para diferentes tipos de decisiones?
- ¿Cómo comunicar incertidumbre sin crear ansiedad en operadores?

## Dominio: Planificación Adaptativa

### [DP-07] Adaptive Planning Engine
**Tipo:** module
**Dominio:** Planificación Adaptativa
**Status:** PROPOSED
**Grounded in:** [IG-13], [IG-26], [IG-09]
**Parent:** —

**Implicaciones de diseño:**
- Cierre del loop entre diseño y realidad en tiempo real
- Generación automática de reportes de turno
- Prescripciones automatizadas con human-in-the-loop
- Soporte para decisiones bajo estrés operativo

**Criterios de aceptación:**
- [ ] Visibilidad en tiempo real del impacto de diseños en KPIs de flota
- [ ] Reportes automáticos generados al final de cada turno
- [ ] Recomendaciones específicas para cerrar gaps plan vs. realidad
- [ ] Datos e hipótesis estructuradas para planificadores bajo presión
- [ ] Tracking de adherencia al plan con métricas de mejora

**Preguntas abiertas:**
- ¿Cómo priorizar recomendaciones cuando hay múltiples gaps?
- ¿Qué nivel de automatización aceptarán los planificadores?
- ¿Cómo medir el éxito del "cierre del loop"?

### [DP-08] Prescriptive Analytics
**Tipo:** feature
**Dominio:** Planificación Adaptativa
**Status:** PROPOSED
**Grounded in:** [IG-02], [IG-20], [IG-SYNTH-07]
**Parent:** [DP-07]

**Implicaciones de diseño:**
- Evolución hacia copiloto prescriptivo siguiendo patrón DART
- Generación automática de escenarios de solución
- Mantiene human-in-the-loop para decisiones finales

**Criterios de aceptación:**
- [ ] Implementa flujo completo DART (Detección-Análisis-Recomendación-Decisión)
- [ ] Genera múltiples escenarios de solución para cada problema detectado
- [ ] Presenta recomendaciones con impacto esperado y nivel de confianza
- [ ] Permite al operador elegir entre opciones o rechazar todas
- [ ] Aprende de decisiones pasadas para mejorar recomendaciones futuras

**Preguntas abiertas:**
- ¿Cuántos escenarios alternativos generar por problema?
- ¿Cómo entrenar el sistema con decisiones históricas de operadores expertos?
- ¿Qué hacer cuando el sistema recomienda algo que el operador considera incorrecto?