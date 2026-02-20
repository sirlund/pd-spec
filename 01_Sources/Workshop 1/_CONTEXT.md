# Context: Workshop 1

## Overview
Materiales del primer workshop de UX/UI y arquitectura de la nueva plataforma TIMining CORE realizado el 28 de Enero 2026. Incluye transcript, casos de uso, retrospectiva KEEP-STOP-START, y fotos de whiteboards/sticky notes.

## Files

### transcript.md


**Type:** Markdown - Workshop Transcript  
**Date:** 28 Enero 2026  
**Participants:** Equipo TIMining + facilitadores UX

**Key Topics:**
- Shift de Aware como visualizador 3D a "sistema nervioso central" de la mina
- UX/UI multimodal: Aware, reportes, alertas, chat/agente, radio
- Problema central: ayudar a cumplir el plan minero
- Meta comercial: plataforma a $450k USD (vs Aware actual)
- 3 capas tecnológicas: (1) integración datos tiempo real, (2) inteligencia (topografía, sensores virtuales), (3) UX/UI
- Industria lenta y conservadora, ciclos de venta 1+ año
- Valor en números que cliente no tiene, no en replicar lo que ya tiene
- Hipótesis: debería ser importante para CFO pero TIMining no habladirectamente con CFOs
- Plataforma debe generar "paz mental" con análisis causa raíz y recomendaciones proactivas
- Decisión estratégica: solución flexible multimodal vs converger todo en Aware
- Experiencia incluye desde la compra: si instalación es complicada, es parte de mala UX
- No hay clarity modelo negocio: producto base, configuración, customización, consultoría

---

### Casos de Uso Workshop 01.docx
**Type:** Word Document - Use Cases  
**Participants:** Equipo TIMining  
**Content:** 20 escenarios de crisis/estrés documentados con formato estructurado

**⚠️ IMPORTANTE - NATURALEZA DE LOS CASOS DE USO:**
Estos casos de uso representan **VISIÓN FUTURA (70-80% aspiracional)** para la plataforma TIMining CORE, NO son capacidades del producto actual. Documentan el GAP entre:
- **Producto actual:** Aware/Orchestra con problemas de adopción UX, alta carga consultiva (30-36h/renovación), dependencia de WhatsApp para coordinación
- **Visión CORE:** Plataforma proactiva, multimodal, con AI copilot que "entrega súperpoderes" a usuarios

Algunas capacidades están **parcialmente implementadas** (ej: AI Copilot TIM con queries lenguaje natural, alertas geotécnicas), pero la integración completa en flujo multimodal es futura.

**Structure:** Cada caso tiene:
- ¿Quién es? (rol usuario)
- ¿Dónde ocurre? (lugar)
- Situación de estrés / Escenario de crisis
- Detección (Plataforma TIMining) ← **CAPACIDAD DESEADA**
- Análisis (Plataforma TIMining) ← **CAPACIDAD DESEADA**
- Recomendación (Plataforma TIMining) ← **CAPACIDAD DESEADA**
- [Atributos extra según caso]

**Case Examples:**
1. **Jefe de Turno (Inicio Turno):** Recibir contexto completo turno anterior sin depender de whatsapp, detectar incumplimientos, recomendar prioridades
2. **Planificador Mina (Tronadura Fallida):** Alerta de material tronado fuera de granulometría, análisis de stock disponible, recomendar reasignación recursos
3. **Supervisor Operaciones (Desvío Plan):** tracking desvíos en tiempo real (geométrico), mapa calor adherencia
4. **Geólogo (Ley Mineral Baja):** detectar calidad mineral menor a esperada, cuantificar impacto, recomendar redirección
5. **Despachador (Congestión):** detectar cola camiones, optimizar asignación para descongestionar
6. **Gerente Mantenimiento (Falla Crítica):** predicción falla equipo crítico, estimación downtime, recomendar contingencia
7-20: Otros escenarios (Tronadura, Falla Mecánica, Caída Pala, Mantenciones Retrasadas, Equipos Autónomos parados, etc.)

**Concepto "Skynet" (Lámina 20):**
- Dueño mina → cada X minutos analizar situación general
- Realizar N simulaciones buscando óptimo global
- Enviar sugerencias a despacho/planificación/otros roles
- Generar replanificación (de recomendación a "haz esto")
- 1° a personas, 2° a máquinas (autonomía completa)

---

### KEEP-STOP-START (retro).docx
**Type:** Word Document - Retrospective  
**Content:** Feedback de usuarios organizados en 3 categorías

**LO QUE NO NECESITA EL USUARIO (STOP):**
- Visualización 3D de la mina
- Desarrollos específicos (hacer genéricos)
- Gráficos/reportes sin solucionar algo real
- Mostrar los mismos KPIs que todos los dashboards
- Repetir información → confusión
- Capacitaciones muy largas
- Más problemas (TI, contratos, adherencia) → quiere plug-and-play
- Experiencia que quite tiempo
- Buscar solución → que venga a él
- Más pantallas, mucha data sin sentido
- Integrar datos sin entender problema
- Llenarlos de números
- Ver todos los elementos (no todos usuarios necesitan lo mismo)
- Desbordar de información no utilizada
- Tiempo dedicado a reporting "para arriba"
- Algo muy complejo (según perfil)
- Data dumping
- Formularios cuando tiene problema
- Más trabajo
- Poca claridad qué se paga y qué no
- Solución cuando problema pasó de moda
- No ver valor personal
- "Primera etapa necesitamos que funcione, no que se vea hermoso"

**LO QUE SÍ NECESITA (KEEP):**
- Ejemplos de otros clientes "¿cómo lo uso?" catálogo
- Visualización de mina completa
- Agregar dato para entenderlo en contexto, simple y rápido
- Resultados visibles
- Apoyar datos con visualizaciones
- Herramientas fáciles y robustas para decisiones día a día
- Habilitar capas simples que aportan mucho
- Sistema recomendador que tome acción en temas recurrentes
- Herramientas específicas (velocidad, conciliación $)
- Sentir control operacional
- Capacitación según perfil usuario (ojalá in-app)
- Facilitar vida, menos stress
- Tomar decisiones más rápido y mejores
- Mejorar trabajo, desempeño personal
- Ver elementos que ayudan cumplir KPIs bonos
- Datos muy útiles y muy básicos
- Priorizar seguridad (fuentes riesgo, seguimiento activos, regulaciones)
- Orden de prioridad ante contingencias (radiales, whatsapp)
- Estrategias operacionales más eficientes
- Claridad proceso completo (Servicio - PyT - CyT - Chancado)
- Cumplir planificación, ver plan completo
- Sistema más proactivo
- Ir a verlos más seguido
- Recomendaciones (no solo alertas)
- Customización
- Respuestas automáticas a problemas
- Experiencia acorde a rutina diaria
- Mejor sistema de alertas (llegar directo al usuario)
- Plataforma fácil de entregar y liberar
- Entender impacto problemas para priorizar
- Soporte más activo
- Certeza que cuidan datos y ciberseguridad
- "Escuchar" lo que pasa en la mina
- Encontrar rápido puntos que requieren intervención
- Atender problemas a tiempo

**LO QUE NO SABE QUE NECESITA (START):**
- Asistente virtual para día a día
- Disminuir reuniones coordinaciones
- Disminuir distracciones/sobrecarga cognitiva
- Abanico de escenarios ante eventualidades
- Desplanificadómetro en línea (medir desvío desde t0, material perdido)
- Reducir ruido información (foco esencial)
- Estar en canales comunicación primarios mina
- Monitoreo remoto subcontratado
- Simplicidad (mejores ingenieros simplifican)
- Copiloto que soporte decisiones
- Hablar de outcome vs output
- Info actualizada para decisiones
- Solución muy barata respecto valor
- Reconocer su impacto
- Enfocarse en importante vs urgente
- Optimización aunque cumplan planes (mejora continua, excelencia)
- Mejorar comunicación entre áreas (intermediario)
- Herramientas para entender "qué pasó" y porqué, luego "qué hacer"
- Consciencia de valor agregado con decisiones
- Algunos datos que no sabe que podría tener
- Info de otros procesos (romper silos)
- No sabe datos que tiene ni calidad
- Coordinarse entre áreas rápido ante eventualidades
- Cuánto del problema ya se sabía desde plan minero
- Involucrar plan minero para entender "cómo vamos"
- Auditar "fuentes de la verdad" y corregirlas
- Pre-factibilidad → arquitectura fácil justificar al cliente
- Menos dependencia del cliente (formato dato, envío)

---

### IMG_20260202_*.jpeg (21 archivos)  
**Type:** Photos - Workshop whiteboard/sticky notes  
**Date:** 2 Febrero 2026  
**Content:** Fotos de pizarras con sticky notes del workshop (ejercicios de ideación, agrupación de insights, mapas de usuarios, flujos)  
**Status:** No revisadas individualmente

---

### IMG_9679-9683.HEIC (5 archivos)  
**Type:** Photos - Additional workshop materials  
**Content:** Fotos adicionales del workshop en formato HEIC  
**Status:** No revisadas individualmente

---

## Insights Derivados
- **20 casos de uso documentados** cubren roles: jefe turno, planificador, supervisor, geólogo, despachador, gerente mantenimiento, supervisor centro integrado, gerente mina
- **Retrospectiva crítica:** usuarios NO quieren visualización 3D, reportes sin contexto, data dumping → SÍ quieren recomendaciones proactivas, alertas inteligentes, simplicidad
- **Visión "Skynet":** aspiración a sistema autónomo que analiza situación cada X minutos, corre simulaciones, y eventualmente da órdenes a máquinas (no solo personas)
- **Multimodalidad confirmada:** plataforma debe llegar por múltiples canales (Aware, whatsapp, radio, reportes, agente IA)
- **Desplanificadómetro:** métrica clave que no existe - medir desvío acumulado en tiempo real desde t0
