# Source: Notas para propuesta de trabajo LCorp

- **Type:** brief
- **Date:** 2026-02-05
- **Participants:** Nicolás (consultor UX), Gemini (asistente IA)
- **Context:** Ideas y estructura de propuesta derivadas del análisis post-reunión con David. Complementa transcript_reunion_inicial y reu_inicial(meeting-notes).

---

## Origen

Estas notas surgen de una sesión de trabajo con Gemini donde se procesó la reunión del 4 de febrero con David (LC Consultores) para elaborar una propuesta de consultoría UX + IA para LCorp.

Se separan de las meeting notes porque son **interpretaciones y propuestas**, no claims directos del stakeholder.

---

## 1. KPIs propuestos para medir impacto

- **Capacidad de carga:** Si hoy un contador atiende 5 clientes, la meta es que con mejoras de flujo pueda atender 10.
- **Tasa de error en cuadraturas:** Reducir tiempo de cuadratura manual (RUT/Montos) mediante interfaz de "propuestas" inteligentes.
- **Autonomía del cliente (Holding):** Medir cuántas veces el cliente pide un reporte vs. cuántas lo saca solo desde un dashboard consolidado.
- **Tiempo de cierre contable:** Reducir horas-hombre por ciclo de cierre mensual.

Nota: David mencionó que su dolor máximo es la contabilidad electrónica y la certificación SII. El KPI de él es distinto al KPI del usuario de la app.

## 2. Concepto "IA-Readiness"

Argumento central para David: si el código y la interfaz están sucios, la IA (Cursor, agentes) alucina y genera soluciones genéricas. Limpiar la casa primero es prerequisito para que la IA sea efectiva.

Esto conecta directamente con su experiencia: ya probó que Cursor resuelve problemas reales (caso backups), pero necesita reglas claras para que no invente patrones nuevos.

## 3. Auditoría integral de 3 capas

### Capa técnica / arquitectura
- Validar separación real front-back (headless).
- Calidad de código y documentación (si la doc es mala, la IA alucina).
- Performance: gestión de logs, backups, caché.
- Evaluar viabilidad de migración Angular 17→20 vs. piloto en otra tecnología.

### Capa UX/UI
- Evaluación heurística: menús inconsistentes, flujos en callejón sin salida.
- Consistencia visual: sin patrón claro → la IA crea interfaces "Frankenstein".
- Flujo de reporting/PDF: por qué falla la visualización y cómo optimizar.

### Capa operacional / bugs
- Inventario de bugs críticos (los que obligan a reinicios manuales o ensucian data).
- Análisis de casos de uso: cuántos pasos toma ingresar una factura hoy vs. cuántos debería tomar.

Entregable propuesto: "LCorp Health Report" con semáforo de riesgos, plan de refactorización y mapa de oportunidades IA.

## 4. JTBD aplicado a LCorp

Framework para explicarle a David por qué no basta con "arreglar botones":

- **Job del contador:** "Cerrar el mes de 10 empresas sin errores para que el jefe no me reclame." Si la interfaz es lenta o el botón está escondido, no logra su job eficientemente.
- **Job del cliente holding:** "Saber en 30 segundos si mis 5 empresas están sanas para tomar decisiones de inversión." Si tiene que bajar 5 PDFs y consolidar en Excel, la app no está haciendo el job.
- **Job de David (gerente):** "Escalar cartera de clientes sin contratar más contadores ni arrendar oficina más grande."

Implicación: el diseño no es "pestañas y botones", es "atajos para que el trabajo salga más rápido".

## 5. Blindaje de propiedad intelectual

Argumento para David: al documentar y estandarizar (directrices de arquitectura, sistema de diseño, reglas para agentes IA), la app deja de estar "en la cabeza de Felipe". Si Felipe se va, el que venga (humano o IA) sabe exactamente dónde está parado.

Esto también aplica al know-how contable chileno que David y su equipo tienen. Traspasar ese conocimiento a documentación que alimente agentes internos.

## 6. Human-in-the-loop

Para el flujo de cuadratura automática (Fintoc → propuestas de comprobantes): el sistema propone, el humano valida. No es un agente autónomo, es un asistente que presenta opciones. David mismo dijo que no quiere sobre-ingeniería en ese proceso.

Aplica también a: propuestas de asientos contables, detección de patrones en compras/ventas, conciliación de notas de crédito.

## 7. Quick wins (primeros 30 días)

Identificar victorias rápidas que mantengan el interés de David y demuestren valor antes de la auditoría completa. David ya está ansioso por resultados (usa Cursor por su cuenta).

Posibles quick wins a explorar:
- Simplificar navegación de 1-2 flujos críticos (ej. generación de PDF/reportes).
- Unificar visualmente 1-2 secciones inconsistentes.
- Documentar reglas básicas de arquitectura para Cursor (.cursorrules).

## 8. Estructura de propuesta: roadmap faseado

### Fase 1 — Diagnóstico (Días 1-30)
- Auditoría UX + técnica + operacional.
- Entrevistas con contadores (usuarios internos).
- Quick wins implementados.
- Entregable: LCorp Health Report + backlog priorizado.

### Fase 2 — Definición (Días 31-60)
- Directrices de diseño (sistema de diseño básico).
- Flujos to-be de casos críticos.
- Reglas para agentes IA (qué puede hacer, qué no).
- Prototipos de mejoras priorizadas.

### Fase 3 — Implementación inicial (Días 61-90)
- Acompañamiento a desarrollo.
- Documentación funcional y UX.
- KPIs de experiencia definidos y baseline medido.
- Roadmap post-90 días.

---

## Notas de análisis del borrador GPT

Se revisó un borrador genérico generado por GPT. De ese documento solo se rescatan 3 conceptos útiles (el resto es "grasa corporativa"):

1. **Human-in-the-loop** — ya integrado arriba.
2. **Estructura de roadmap faseado** — ya integrado arriba.
3. **Quick wins** — ya integrado arriba.

Descartado por no aportar valor al contexto de David:
- Jerga corporativa (time-to-value, engagement, stakeholders).
- Métricas genéricas (CSAT/SUS) — a David le importa que el contador termine el trabajo, no encuestas.
- Sección de "Roles y Colaboración" — David ya sabe quiénes son.
- "Supuestos y Dependencias" — obvio, suena a contrato defensivo.
