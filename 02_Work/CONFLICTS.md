# Conflicts Log

Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

## Status Legend

- **PENDING** — Detected but not yet resolved.
- **RESOLVED** — User has provided a resolution direction.

---

### [CF-01] Imprecision — "La app está al 80-90%"
Status: PENDING
**Relates to:** [IG-SYNTH-01], [IG-SYNTH-08], [IG-SYNTH-09]

- **Claim:** David dice que la app está al 80-90%, pero la evidencia muestra: PDFs rotos (3 meses de trabajo perdido), navegación caótica, sin mobile, inconsistencia visual, sin sistema de diseño, documentación pésima.
- **Verification:** El porcentaje probablemente se refiere a features implementadas, no a calidad/usabilidad. Pero sin auditoría, no hay forma de cuantificar el estado real.
- **Options:**
  - A: El 80-90% se refiere a features (no calidad/usabilidad)
  - B: David subestima la deuda de UX/técnica
  - C: Se requiere auditoría para determinar el estado real
- **Recommended action:** Auditoría técnica + UX para cuantificar estado real

---

### [CF-02] Conflict — Estado de la documentación
Status: PENDING
**Side A:** [IG-SYNTH-09] — Meeting notes: "El código está muy comentado"
**Side B:** [IG-SYNTH-09] — Transcript: "Los proyectos están pésimamente documentados"

- **Verification:** Probablemente son cosas distintas: code comments ≠ project documentation. Ambos podrían ser verdaderos (código bien comentado pero sin docs de arquitectura, API, o procesos).
- **Options:**
  - A: Son cosas distintas (code comments ≠ project docs) — ambos verdaderos
  - B: La percepción de David varió durante la conversación
- **Recommended action:** Validar con acceso al repo — distinguir comentarios en código vs. documentación de proyecto/arquitectura

---

### [CF-03] Single-source critical — KPIs sin validar
Status: PENDING
**Relates to:** [IG-SYNTH-04]

- **Claim:** KPIs propuestos (5→10 clientes/contador, tasa de error cuadraturas, autonomía holding, tiempo cierre contable) vienen solo de propuesta-trabajo-notas.md (análisis del consultor), no de David ni de usuarios.
- **Verification:** Son hipótesis razonables pero sin baseline ni validación con el stakeholder.
- **Options:**
  - A: Usar como hipótesis a validar con David en la propuesta
  - B: Medir baseline primero, definir KPIs después
- **Recommended action:** Validar con David y contrastar con datos reales de operación

---

### [CF-04] Definition gap — "Contabilidad electrónica / certificación SII"
Status: PENDING
**Relates to:** [IG-SYNTH-04], [IG-SYNTH-05]

- **Claim:** David menciona "contabilidad electrónica" y "certificación SII" como su dolor máximo, pero no se define qué funcionalidades específicas de LCorp están involucradas ni cuál es el flujo actual.
- **Verification:** El SII (Servicio de Impuestos Internos de Chile) tiene requisitos específicos de facturación electrónica. No sabemos cómo LCorp interactúa con el SII hoy.
- **Options:**
  - A: Investigar requisitos SII y mapear flujo actual
  - B: Entrevista técnica con David/Felipe sobre el flujo SII
  - C: No relevante para la propuesta UX inicial
- **Recommended action:** Entrevista técnica para desglosar el flujo SII y su impacto en la app
