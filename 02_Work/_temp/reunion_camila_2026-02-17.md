# Reunión Camila — 17 feb 2026

> Notas internas Idemax. No es fuente para /extract.
> Participantes: Nlundin, Cbonilla, Hmunoz, AGuzzoni

## Decisiones y Próximos Pasos

- Nicolás traspasará casos de uso, pilares de diseño y mockups a presentación principal
  - Incluir referentes visuales por cada etapa del flujo (detección, análisis, recomendación)
  - Agregar 2 casos de uso nuevos: optimización del plan minero y reportería CFO
- Reunión de revisión mañana en la tarde (30 minutos, remoto)
  - Validar presentación antes del workshop del jueves
  - Ajustes finales si es necesario
- Workshop jueves presencial (10:00-12:00) en TIMining
  - Asistirán Nicolás y Camila (Ale no estará)
  - Presentar casos de uso con pilares aplicados y mockups
- Estrategia post-aprobación: desarrollar manual UX con reglas específicas
  - Definir qué significa cada pilar en términos concretos
  - Establecer guidelines para validación con usuarios reales

## Diseño UI/UX y Referentes Visuales

- Estructura de referentes por flujo de trabajo:
  - Detección: consola cromática con glow externo para alertas (referencia SpaceX)
  - Análisis: proyección temporal de impactos (45 minutos hasta bloqueo chancador)
  - Recomendación: opciones ranqueadas con impacto de tonelaje cuantificado
- Principios de diseño identificados:
  - Clear path: máximo 3 recomendaciones, no más de ciertos clics
  - Quad UI: interfaz limpia con colores solo para anomalías
  - Time sight: visualización de futuro y proyecciones
  - Priorización numérica esencial vs. solo paleta de colores
- Mockups generados con IA muestran:
  - Dashboard de sala de control con detección automática
  - Análisis de cuellos de botella con proyección temporal
  - Sistema de recomendaciones con opciones A, B, C ranqueadas

## Aprendizajes Estratégicos TIMining/Core

- Gap crítico: decisiones se toman fuera del software
  - Comunicaciones por radio no quedan registradas en sistema
  - Pérdida de conocimiento entre jefes de turno
  - Software debe convertirse en hub central de toma de decisiones
- Urgente vs importante como capacidad clave del sistema
  - Ejemplo: Pedro arregla el camino (output previsible), Juan manda camiones por otro camino y mitiga 30% más (impacto al plan)
  - El software debe ayudar a priorizar lo importante de cara al plan, no solo lo urgente visible
- Evolución estratégica en 3 fases:
  1. Cumplimiento del plan (estado actual)
  2. Optimización del plan en tiempo real (visión futura)
  3. Anticipación proactiva basada en aprendizaje histórico
- Realidad vs. plan como gamechanger:
  - Plan conservador de 100 unidades vs. realidad de 50, pero potencial de 150
  - Incentivos mal alineados (bonos por cumplimiento, no por optimización)
  - Oportunidad de repricing: de $300K a $450K anuales si se demuestra valor
- Transición de 7 productos fragmentados a plataforma core unificada
  - Cada producto actual sirve perfiles diferentes
  - Necesidad de interfaces dinámicas que se adapten al usuario
  - Riesgo de fragmentación tecnológica actual
- Adopción dual necesaria: bottom-up (>100 usuarios activos post-piloto) + top-down (decisión la toma BHP en Canadá, no la mina local)

## Riesgos, Brechas y Preguntas Abiertas

- Validación con usuarios finales crítica pero pendiente:
  - No hay entrevistas programadas con jefes de turno reales
  - Riesgo de diseñar basado solo en percepción interna
  - Propuesta: entrevistar ex-empleados que ahora trabajan en clientes
- KPIs y métricas de impacto no definidos:
  - ¿Cómo medir cumplimiento del plan minero?
  - ¿Cómo demostrar valor generado vs. precio cobrado?
  - Falta correlación entre valor agregado y pricing
- Aspectos técnicos sin resolver:
  - Bloqueantes para migración a core platform
  - Posible reestructuración de backend necesaria
  - Estándares de accesibilidad no considerados
  - Conectividad en terreno (tablets, teléfonos en mina)
- Confusión temporal en sistema actual:
  - Datos con diferentes delays (15, 30, 45 minutos)
  - Usuarios no entienden qué está actualizado vs. histórico
- Dependencia de venta consultiva como síntoma:
  - 6 meses de consultoría por proyecto indica producto complejo
  - Usuarios no adoptan herramientas por dificultad de uso

## Insights del Workshop y Análisis

- 23 insights extraídos de documentos y presentaciones TIMining
  - Ranqueados por relevancia y fuentes
  - Geometry gap y efecto Suiza validados como diferenciales
  - Dashboard a copiloto y gestión por excepción confirmados
- Perfiles de usuario con necesidades diferentes:
  - 4-5 densidades de uso radicalmente distintas
  - Interfaz estática actual no se adapta a contextos
  - Oportunidad de detección automática de rol/ubicación
- Problema de adherencia al plan como métrica central
  - Fragmentación de herramientas (7 productos)
  - Falta de integración entre módulos
  - Suite no percibida como tal por usuarios finales

## Visión Futura y Northstar

- Sistema omnisciente que analiza situación completa cada X minutos
  - Percibe todo, escala solo lo relevante
  - Simulaciones buscan óptimo global, no local
  - Evolución hacia machine-to-machine communication
- Aprendizaje continuo del sistema:
  - Jefe de turno experto rechaza opciones A, B, C y elige D
  - Sistema aprende y eventualmente sugiere opción D como primera
  - Democratización del conocimiento experto
- Anticipación basada en múltiples factores:
  - Histórico de equipos y mantenciones
  - Condiciones climáticas (fenómeno del Niño)
  - Patrones estacionales y operacionales
- Incentivos alineados con optimización:
  - Reconocimiento individual por performance
  - Visibilidad de logros para jefatura
  - Bonificaciones por superar plan, no solo cumplirlo

## Recomendaciones de Continuidad

- Sistema de diseño AI-first: no Figma tradicional sino agentes que crean productos respetando pilares
- Manual UX como entregable: reglas concretas por pilar para que TIMining pueda diseñar sin depender de consultoría permanente
- Cortar el flujo de retroalimentación interna: no preguntarle a Erika (que trabaja con usuarios) sino al usuario real

## Acuerdos Logísticos

- Nicolás (hoy):
  - Traspasar casos de uso actualizados a presentación
  - Incorporar referentes visuales por etapa de flujo
  - Agregar casos de optimización de plan y reportería CFO
  - Resolver visualización de referentes en mockups
- Mañana tarde (ambos):
  - Reunión de revisión 30 minutos
  - Validar presentación completa
  - Ajustes finales pre-workshop
- Jueves workshop:
  - Presentación conjunta de casos de uso
  - Validación de pilares de diseño con equipo TIMining
  - Definir continuidad hacia manual UX
- Post-workshop:
  - Desarrollo de guidelines específicas por pilar
  - Planificación de entrevistas con usuarios finales
  - Definición de métricas de impacto y KPIs
