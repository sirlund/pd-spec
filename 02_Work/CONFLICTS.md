# Conflicts Log

Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

## Status Legend

- **PENDING** — Detected but not yet resolved.
- **RESOLVED** — User has provided a resolution direction.

---

<!-- New conflicts are appended below by /analyze -->

## Conflictos detectados

### [CF-01] Pivote de plataforma — Flutter vs Next.js (PWA)
Status: PENDING
**Tensión:** Los documentos de pre-análisis (preanalisis/02_definiciones_tecnicas.md) especificaron Flutter como frontend multiplataforma. La propuesta formal (PDF) y la reunión del 6 de febrero pivotaron a Next.js + PWA. El stack actual es Next.js, pero los documentos más tempranos quedan inconsistentes.
**Lado A:** [IG-SYNTH-08] — Stack confirmado: Next.js + Supabase + Rive (fuentes recientes: PDF + transcript)
**Lado B:** preanalisis/02_definiciones_tecnicas.md — "Frontend: Flutter (multiplataforma)"
**Contexto:** Este es un pivote deliberado, no un error. Flutter fue descartado por costo de mantenimiento y complejidad. La fuente de verdad es la propuesta formal + reunión de febrero.
**Opciones:**
- A: Marcar Flutter como decisión desestimada — [IG-SYNTH-09] es el estado vigente (Recomendado)
- B: Mantener Flutter como alternativa documentada para comparación futura
**Recommended action:** /spec — confirmar Next.js + PWA como decisión vigente e INVALIDAR la referencia a Flutter

---

### [CF-02] Requerimiento de ML en Fase 1 vs viabilidad técnica
Status: PENDING
**Tensión:** El cliente solicitó explícitamente "algoritmos de aprendizaje automático" desde el MVP para rubber banding e ilusión de agencia. El análisis técnico determina que es inviable sin datos históricos (cold start). El cliente aceptó el pivote a heurística, pero el brief original queda en tensión con la solución propuesta.
**Lado A:** cotizacion/00_requerimiento_original.md — "Algoritmos de aprendizaje automático requeridos explícitamente para ilusión de agencia, rubber banding"
**Lado B:** [IG-SYNTH-07] — Cold Start Problem → Heurística como puente hacia ML real
**Contexto:** Técnicamente resuelto (cliente validó: "Me parece muy bien tu propuesta"). La tensión subsiste como riesgo de expectativas: ¿entiende el cliente que el "motor heurístico" no es ML real?
**Opciones:**
- A: Documentar explícitamente que Fase 1 = heurística, Fase 2 = ML real (Recomendado)
- B: Buscar validación adicional del cliente sobre expectativas de la heurística
**Recommended action:** /spec — redactar definición clara de "inteligencia heurística" para alinear expectativas

---

### [CF-03] Evolución del presupuesto — pre-análisis $12-16K vs MDP mínimo pendiente
Status: PENDING
**Tensión:** El pre-análisis inicial estimó $12,000-$16,000 USD. La propuesta formal (PDF) redujo a $5,605 USD (200 hh, Pro + Diseño integrado). La reunión del 6 de febrero redujo aún más el scope. La cotización final del MDP mínimo está pendiente.
**Lado A:** [IG-SYNTH-18] — preanalisis/03_modelo_negocio.md: "$12,000-$16,000 USD"
**Lado B:** [IG-SYNTH-18] — Propuesta PDF: "$5,605 USD brutos (~148 UF)"
**Lado C:** cotizacion/_transcript_reunion_feb06.md: MDP mínimo, cotización nueva pendiente post-NDA
**Contexto:** No es un conflicto de datos sino una evolución de scope. El presupuesto real depende de la cotización nueva de Nicolás, que no existe aún.
**Opciones:**
- A: Esperar nueva cotización post-NDA para actualizar este insight (Recomendado)
- B: Marcar $5,605 como ceiling y estimar MDP mínimo entre $1,000-$2,500
**Recommended action:** Acción pendiente externa — Nicolás debe preparar nueva cotización del MDP mínimo

---

## Ambigüedades

### [CF-04] AMB-01 — Temática y comunidad del primer torneo (no definida)
Status: PENDING
**Incertidumbre:** La temática del Torneo 1 no está definida. El PDF lo lista como "Decisión pendiente 2". La reunión dejó ejemplos (Tour de Francia, Fórmula Uno, Los Simpsons) pero sin decisión concreta.
**Impacto:** La temática determina la estrategia de adquisición, los influencers a contactar, el tipo de preguntas, y la comunidad objetivo.
**Opciones:**
- A: Nicho deportivo (Tour de Francia / Fórmula 1) — audiencia global, altos niveles de pasión
- B: Nicho cultural local (Los Simpsons / South Park) — audiencia amplia, más fácil de moderar
- C: Definir con el cliente post-NDA
**Recommended action:** Sesión de definición con Juan post-NDA — este input bloquea el diseño del primer torneo

---

### [CF-05] AMB-02 — Precio del ticket de participación (no validado)
Status: PENDING
**Incertidumbre:** El cliente mencionó "máximo ~$10,000 CLP" como referencia psicológica, pero no es un precio confirmado. La relación precio/premio aún no está modelada.
**Impacto:** El precio del ticket afecta directamente el modelo de ingresos, la proyección para inversores, y el positioning del torneo.
**Opciones:**
- A: $5,000 CLP (precio bajo, alta adopción, bajo riesgo de "scam" percibido)
- B: $10,000 CLP (techo mencionado por Juan, mayor credibilidad si el premio es alto)
- C: Modelo de precios dinámico por liga (casual más barato, experto más caro)
**Recommended action:** Modelo financiero con willingness-to-pay — necesita validación con usuarios reales o análisis de plataformas similares

---

### [CF-06] AMB-03 — Cotización del MDP mínimo (pendiente)
Status: PENDING
**Incertidumbre:** La cotización del MDP mínimo está pendiente post-reunión del 6 de febrero. Nicolás debe preparar 2 opciones: una básica (sin ayuda externa) y una intermedia.
**Impacto:** Define el capital necesario de Juan para arrancar, el timeline, y el punto de partida financiero.
**Opciones:**
- A: MDP básico (solo Nicolás, sin dev senior) — estimado $1,000-$2,000
- B: MDP intermedio (Nicolás + revisión de seguridad) — estimado $2,500-$3,500
**Recommended action:** Nicolás debe preparar cotización antes de la reunión del lunes (próximo paso acordado)

---

### [CF-07] AMB-04 — Acuerdo de equity/participación (no formalizado)
Status: PENDING
**Incertidumbre:** Juan ofreció una participación futura en el proyecto ("cuando lo venda, el proyecto es tuyo") como alternativa al pago completo por el MDP mínimo. Nicolás expresó interés pero requiere conversar los términos.
**Impacto:** Afecta la estructura financiera del proyecto, las responsabilidades de Nicolás, y el modelo de ingresos del consultor.
**Opciones:**
- A: Pago por horas estándar (sin equity) — limpia, predecible para ambas partes
- B: Fee reducido + equity (% de futura venta o ronda) — más riesgo para Nicolás, mayor upside
- C: Híbrido: fee mínimo de subsistencia + equity simbólico
**Recommended action:** Conversación separada post-NDA — requiere definir % y condiciones específicas antes de comprometer
