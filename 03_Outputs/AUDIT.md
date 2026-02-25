# Auditoría de Knowledge Base y Outputs — TIMining

> v1.1 | 2026-02-25 | 38 insights VERIFIED · 59 fuentes · 10 outputs generados | es

---

## Semáforo General

| Área | Estado | Resumen |
|---|---|---|
| Trazabilidad de outputs | 🟢 Listo | 100% de insights VERIFIED referenciados en al menos un output. Todas las secciones tienen refs o [GAP] marcado. |
| Completitud del knowledge base | 🟠 Riesgo | Cobertura desigual: user-need dominada por voz de stakeholders internos, no de usuarios finales. 5 insights con convergencia 1/57. |
| Calidad de la evidencia | 🟠 Riesgo | 9 de 27 insights VERIFIED provienen de una sola fuente. Patrón técnico (Geometry Gap) sólido; comportamiento de usuario es proxy. |
| Readiness para Etapa 2 | 🔴 Crítico | 4 conflictos PENDING bloquean decisiones de diseño centrales. La brecha de investigación directa con usuarios es estructural. |

---

## 1. Trazabilidad

### 1.1 Cobertura de insights en outputs

**Resultado: 38/38 VERIFIED referenciados en al menos un output. Cero insights huérfanos.**

| Output | Versión | Refs únicas | Cobertura | Notas |
|---|---|---|---|---|
| PRD.md | v1.2 | 38 insights | 100% de VERIFIED | Sistema de Pilares como sección propia en Principios. IG-10 a IG-22 integrados. |
| PERSONAS.md | v1.1 | 22 insights | 81% de VERIFIED | Pilar líder + tabla resumen pilares por perfil. 3 [GAP] marcados. |
| LEAN_CANVAS.md | v1.0 | 21 insights | 78% de VERIFIED | [GAP] marcado en Estructura de Costos (CF-08) |
| USER_STORIES.md | v1.1 | 22 insights | 81% de VERIFIED | Columna Pilar en tabla + campo Pilar en las 18 historias. 5 [GAP]. |
| JOURNEY_MAP.md | v1.1 | 16 insights | 59% de VERIFIED | Pilar líder por fase. Solo cubre P-02 — arquitectural, no error de trazabilidad. |
| BENCHMARK_UX.md | v1.1 | 17 refs [IG-XX] | N/A (referentes externos) | Sección "Los pilares como sistema" + Tesla Fleet. Ahora con refs directas. |
| REPORT.md | v1.0 | ~15 insights | ~56% de VERIFIED | Reporte ejecutivo — cobertura selectiva justificada por audiencia |
| AUDIT.md | v1.1 | 38 insights | 100% de VERIFIED | Este documento |
| STRATEGY.md | v1.1 | 33 insights | ~87% de VERIFIED | Principio 5 (pilares) + tabla NOW con columna Pilar |
| PRESENTATION.md | v1.0 | 22 insights | ~58% de VERIFIED | Pendiente actualización con pilares |

**Insights VERIFIED no referenciados en JOURNEY_MAP.md** (justificado: el Journey Map es mono-persona):

`IG-SYNTH-02`, `IG-SYNTH-05`, `IG-SYNTH-10`, `IG-SYNTH-11`, `IG-SYNTH-13`, `IG-SYNTH-14`, `IG-SYNTH-16`, `IG-SYNTH-16b`, `IG-02`, `IG-05`, `IG-06`

Estos insights están todos cubiertos en PRD, PERSONAS y USER_STORIES. La ausencia en el Journey Map es arquitectural (P-02 no es el perfil donde aplican IG-SYNTH-05 o IG-SYNTH-16b), no un error de trazabilidad.

### 1.2 Secciones sin respaldo en outputs

No se detectaron secciones en outputs sin ref `[IG-XX]` o sin marcador `[GAP]`. El principio de trazabilidad se aplica consistentemente en los 7 outputs generados.

**BENCHMARK_UX.md v1.1:** A diferencia de v1.0, ahora incluye refs `[IG-XX]` directas en la sección "Los pilares como sistema" [IG-16, IG-17, IG-18], en las notas de dominio por pilar [IG-18], en el nuevo referente Tesla Fleet [IG-19], y en la extensión manos libres de Omni Sense [IG-21]. La tabla Insights Summary tiene 17 filas. Los referentes externos siguen sin refs propias (por diseño correcto), pero el marco conceptual que los organiza ahora tiene trazabilidad completa.

---

## 2. Completitud del Knowledge Base

### 2.1 Distribución por categoría (38 insights VERIFIED)

| Categoría | Cantidad | Ejemplos clave |
|---|---|---|
| **user-need (current)** | 9 | IG-SYNTH-02, 03, 07, 09, 11, 15 · IG-03, 04, 06 |
| **user-need (aspirational)** | 6 | IG-SYNTH-04, 06, 07, 08, 16 · IG-21 (manos libres) |
| **business (current)** | 7 | IG-SYNTH-05, 12, 14, 17 · IG-05 · IG-11 · IG-22 |
| **technical (current)** | 5 | IG-SYNTH-01, 03, 13 · IG-08 · IG-15 |
| **constraint (current)** | 3 | IG-SYNTH-18 · IG-02 · IG-SYNTH-13 parcial |
| **business (aspirational)** | 4 | IG-SYNTH-10, 16b · IG-09 · IG-20 (CFO apuesta estratégica) |
| **technical (aspirational)** | 2 | IG-SYNTH-19 · IG-18 |
| **design-framework** | 4 | IG-10 (Quiet UI doble capa) · IG-16 (pilares encadenados) · IG-17 (cómo vs. qué) · IG-19 (Time Scrubbing) |

**Observación:** La categoría `user-need` domina correctamente (15/38 insights, 40%), pero casi toda la evidencia de comportamiento de usuario proviene de stakeholders internos, no de usuarios directos. Los 4 insights `design-framework` son los pilares de diseño del sistema — fundamentan el framework UX y la coherencia de los outputs. Ver sección 3.

### 2.2 Cobertura por perfil de usuario

| Perfil | Insights dedicados | Cobertura directa | Riesgo |
|---|---|---|---|
| **P-01 Despachador** | 7 refs en PERSONAS | Media — inferida del workshop | Sin entrevistas propias |
| **P-02 Jefe de Turno** | Journey Map completo + 8 refs | Alta — mayor profundidad de todos | Todos los comportamientos son inferidos de CTO/COO |
| **P-03 Gerente de Mina** | 5 refs en PERSONAS | Media | Sin entrevistas directas |
| **P-04 Planificador** | 6 refs en PERSONAS | Media — PM Orchestra entrevistado | Perspectiva del PM, no del usuario directo |
| **P-05 CFO / Finanzas** | 4 refs en PERSONAS | Baja — emergió en Touchpoint feb-19 | Perfil construido en una sola sesión (IG-06) |

**Perfil con cobertura insuficiente: P-05 CFO.** Emergió a partir de un único dato de campo (IG-06, convergencia 1/57, fuente interna IDEMAX). No hay ninguna entrevista ni documento que valide las necesidades financieras desde el lado del cliente. Sus historias de usuario (US-03, US-15) tienen marcadores [GAP] por este motivo.

### 2.3 Módulos del SYSTEM_MAP y profundidad de respaldo

| Módulo | Status | Refs en SYSTEM_MAP | Pilar | Profundidad |
|---|---|---|---|---|
| Geometry Engine | Ready | 2 ([IG-SYNTH-01], [IG-SYNTH-12]) | Time Sight | 🟢 Alta convergencia (15/54 y 10/54) |
| Copiloto Inteligente (TIM Agent) | Ready | 7 refs (+[IG-18], [IG-22]) | Clear Path | 🟢 Respaldado. +4 dominios operativos + plan compliance/optimization |
| Experiencia Multimodal (4 Lentes) | Active | 9 refs (+[IG-16], [IG-17], [IG-19], [IG-21]) | Quiet UI + Omni Sense | 🟢 Pilares encadenados integrados. Time Scrubbing + manos libres |
| Briefing de Turno | Ready | 2 ([IG-SYNTH-15], [IG-SYNTH-17]) | Time Sight + Omni Sense | 🟠 Ambas con convergencia media (5-6/57) |
| Seguridad y Geotecnia | Ready | 1 ([IG-SYNTH-18]) | Omni Sense | 🟠 Solo 1 ref; 8/54 convergencia aceptable |
| Plataforma de Integración | Blocked | 6 refs (+[IG-13], [IG-20]) | Clear Path | 🟠 IG-13 y IG-20 añaden respaldo; IG-06 sigue siendo 1/59. CFO como perfil activo 2026 |
| Onboarding Progresivo | Ready | 2 ([IG-SYNTH-11], [IG-SYNTH-02]) | Clear Path | 🟠 Respaldado pero sin validación de usuarios |

**Módulo con menor respaldo: Seguridad y Geotecnia** — tiene una sola ref en el SYSTEM_MAP. Aunque la convergencia de IG-SYNTH-18 es aceptable (8/54), el módulo no tiene un principio de diseño explícito propio ni preguntas abiertas documentadas. El riesgo es que quede sub-especificado. **Nota:** Plataforma de Integración mejoró de 4 a 6 refs con IG-13 y IG-20, y Experiencia Multimodal pasó a 9 refs con la integración de los 4 pilares de diseño. El módulo con menor respaldo relativo ahora es Briefing de Turno (solo 2 refs con convergencia media).

---

## 3. Calidad de la Evidencia

### 3.1 Fuentes primarias vs. documentos internos

| Tipo de evidencia | Insights respaldados | Calidad |
|---|---|---|
| Direct-quote de fundadores (primaria) | IG-SYNTH-01, 02, 05, 07, 08, 12, 15, 17 + IG-03, 04, 05, 08 | 🟢 Alta autoridad — voz directa de COO, CEO, CTO |
| Workshop con usuarios (primaria indirecta) | IG-SYNTH-02, 03, 06, 07, 09, 11, 15, 18 | 🟢 Alta — participación directa del equipo operacional |
| Documentos estratégicos internos | IG-SYNTH-04, 05, 10, 16, 16b, 19 | 🟠 Media — material preparado para presentaciones (sesgo de aspiración) |
| Observación de campo (field notes) | IG-02, CF-03 | 🟠 Media — investigador de IDEMAX, no usuario |
| Fuentes internas de IDEMAX solamente | IG-06, IG-07 (INVALIDADO), IG-09 | 🔴 Baja — perspectiva de consultor, no de cliente |

### 3.2 Insights VERIFIED con convergencia baja (1-2 fuentes)

Estos insights son VERIFIED pero frágiles. Una sola entrevista con un usuario en faena podría contradicirlos o enriquecerlos significativamente.

| ID | Convergencia | Fuente única | Riesgo de diseño |
|---|---|---|---|
| **IG-04** | 1/57 | CTO Carlo (Touchpoint 19-feb) | Alto — define principio de diseño "operador-first" completo. Si la percepción de auditoría es un caso edge (no el caso general), el diseño de US-18 sobrestima el problema. |
| **IG-05** | 1/57 | CEO Philip (Touchpoint 19-feb) | Alto — fundamenta framing de venta vs. Excel en toda la estrategia. Una sola cita. |
| **IG-06** | 1/57 | Researcher IDEMAX (observación) | Alto — crea un perfil de usuario completo (P-05 CFO) y dos historias de usuario. Philip y Carlo "no lo contradijeron" no es validación. |
| **IG-08** | 1/57 | CTO Carlo (Touchpoint 19-feb) | Medio — dato técnico específico (60 reglas). Creíble por contexto pero no tiene segunda fuente. |
| **IG-03** | 2/57 | CTO + reunion Camila (interna) | Alto — fundamenta la integración de WhatsApp como canal en 61 refs a través de todos los outputs. La segunda fuente es interna de IDEMAX. |
| **IG-09** | 2/57 | Ambas fuentes internas IDEMAX | Alto — capacidad aspiracional de aprendizaje del sistema. Ninguna fuente de TIMining confirma que esto sea un roadmap item real. |

### 3.3 Conflictos PENDING que bloquean decisiones de diseño

| ID | Tipo | Descripción | Decisiones bloqueadas |
|---|---|---|---|
| **CF-07** | Research Gap — CRÍTICO | Sin investigación directa con usuarios finales. Todos los user-need insights son mediados por stakeholders internos. | Toda la capa de UX del producto: perfiles, Journey Map, principios de diseño "Quiet UI", "Operational Pull". |
| **CF-13** | Contradicción — ALTA | Resistencia de operadores vs. modelo bottom-up. ¿El operador usa CORE porque quiere o porque debe? | Diseño de US-18 (operador-first), estrategia de GTM/adopción, política de visibilidad de datos. |
| **CF-08** | Research Gap — ALTA | Sin unit economics, CAC, LTV ni breakdown financiero. | Estrategia de pricing USD 450k, validación del modelo SaaS, US-03 y US-15 del CFO. |
| **CF-05** | Definition Gap — MEDIA | Sin framework formal configuración vs. customización vs. desarrollo a medida. | Arquitectura modular de CORE, límites de extensibilidad, prevención del "Auto de Homero Simpson". |

---

## 4. Readiness para Etapa 2

### 4.1 Preguntas específicas para entrevistas

Las siguientes preguntas corresponden a gaps de evidencia directa — no a temas exploratorios generales. Cada una resuelve un conflicto o insight frágil identificado en el audit.

**Para Jefe de Turno / Despachador (resuelve CF-07, CF-13, IG-04):**

1. "¿Cuándo fue la última vez que usaste la plataforma durante el turno? ¿Qué estabas buscando?" — *calibra uso real vs. capacitación*
2. "Cuando recibes una alerta del sistema, ¿qué haces primero? ¿Lo revisas en pantalla o preguntas por radio?" — *valida patrón D→A→R como real*
3. "¿Sabes si tu jefatura puede ver tu desempeño en la plataforma? ¿Eso te importa?" — *resuelve CF-13 directamente*
4. "Describe cómo haces el traspaso de turno hoy. ¿Qué información no queda documentada y te preocupa?" — *valida o refuta IG-SYNTH-15 (Efecto Gaviota) con evidencia directa*
5. "¿Cuántas decisiones operacionales importantes tomas por WhatsApp vs. dentro de la plataforma en un turno típico?" — *cuantifica IG-03 con datos reales*

**Para Gerente de Mina (resuelve IG-SYNTH-09, P-03 [GAP]):**

6. "¿Desde dónde revisas el estado de la operación? ¿Desktop, celular, en reuniones verbales?" — *valida o refuta framing mobile-first*
7. "¿Qué información de la plataforma te resulta útil hoy? ¿Qué no usas?" — *aplica filtro Homer's Car a P-03*

**Para Planificador (resuelve IG-SYNTH-08, IG-09):**

8. "¿Cuánto tiempo te toma hoy preparar el plan para el turno siguiente? ¿Dónde vive esa información?" — *valida el pain de analítica sin NL query*
9. "Si el sistema te diera una recomendación de acción que no entiendes, ¿qué harías?" — *evalúa confianza en el agente IA*

**Para CFO / Gerente Finanzas (resuelve IG-06, P-05 [GAP], CF-08):**

10. "¿Cómo obtienes hoy el dato de impacto financiero de la operación? ¿Cuánto tarda?" — *valida existencia y severidad del dolor*
11. "¿TIMining ya forma parte de tu proceso de reporting? Si no, ¿qué necesitarías para que lo fuera?" — *evalúa madurez del segmento CFO como cliente real*

### 4.2 Hipótesis actuales más frágiles

Ordenadas por impacto en decisiones de diseño si resultan falsas:

| # | Hipótesis | Insight fuente | Fragilidad | Impacto si es falsa |
|---|---|---|---|---|
| 1 | El operador resiste activamente la plataforma cuando la usa planificación para auditarlo | IG-04 (1 fuente: CTO) | 🔴 Alta — una sola cita de parte interesada | US-18 sería innecesaria; el principio "operador-first" perdería urgencia. El diseño de visibilidad de datos sería más simple. |
| 2 | El 90% de las decisiones operacionales ocurre en WhatsApp/radio | IG-03 (2 fuentes: CTO + IDEMAX) | 🔴 Alta — no hay datos de frecuencia real | La integración de WhatsApp como canal prioritario sería sobreingeniería. La prioridad de US-08 y US-16 caería de High a Medium. |
| 3 | El Jefe de Turno opera principalmente desde terreno sin acceso a pantalla | IG-SYNTH-09 (13/57 pero voz indirecta) | 🟠 Media — alta convergencia pero ningún usuario directo confirmó | El diseño mobile-first para P-02 podría no ser la prioridad correcta; el Jefe de Turno puede tener más acceso a tablet de lo que sugieren los stakeholders. |
| 4 | El CFO es un usuario potencial de TIMining con dolor real | IG-06 (1 fuente: IDEMAX researcher) | 🔴 Alta — perfil construido sobre observación de consultor no contradecida | P-05 completo y US-03/US-15 serían retirados. La desconexión mina-planta puede existir pero el CFO puede no ser quien la resuelve. |
| 5 | El sistema puede aprender de decisiones expertas rechazadas | IG-09 (2 fuentes internas IDEMAX) | 🔴 Alta — capacidad aspiracional sin confirmación del roadmap de TIMining | US-07 sería eliminada. La "democratización del conocimiento tácito" quedaría solo como visión futura no comprometida. |
| 6 | 30% de uso en Orchestra refleja un problema generalizable de adopción en CORE | IG-SYNTH-11 (7/57) | 🟠 Media — dato real de PM Orchestra; puede ser específico de Orchestra | Los principios de onboarding progresivo siguen siendo válidos, pero la urgencia del problema podría estar sobredimensionada. |

---

## 5. Gaps Críticos — Resumen Priorizado

### 🔴 Crítico — bloquea Etapa 2

**GAP-01: Cero entrevistas directas con usuarios finales en faenas activas [CF-07]**

El knowledge base tiene 27 insights VERIFIED, pero 14 son de categoría `user-need` y ninguno proviene de un usuario directo (minero, despachador, jefe de turno). Todas las perspectivas de comportamiento de usuario son proxy: COO describiendo a sus operadores, PM describiendo a sus usuarios, CTO describiendo la resistencia de los operadores. El Journey Map, las 5 personas y los principios de diseño "Quiet UI" y "Operational Pull" están construidos sobre esta base indirecta.

**Acción mínima:** 3-5 entrevistas semi-estructuradas de 30 minutos con usuarios reales en faenas. Philip confirmó acceso (Touchpoint 19-feb). Prioritarios: 2 Jefes de Turno (resuelve CF-13 y valida IG-04) + 1 Despachador + 1 Planificador.

**GAP-02: Contradicción operador vs. herramienta de auditoría sin resolver [CF-13]**

El modelo de adopción bottom-up (IG-SYNTH-17, alta convergencia, 6/57) está en contradicción directa con el dato de que planificación usa TIMining para auditar operadores generando resistencia activa (IG-04, 1/57). No son observaciones del mismo fenómeno — son datos de dos contextos distintos. Hasta que se resuelva con evidencia directa, el diseño de US-18 y la estrategia de GTM están construidos sobre una suposición no validada.

### 🟠 Riesgo — debilita decisiones actuales

**GAP-03: Modelo financiero y unit economics ausentes [CF-08]**

El repricing de USD 300k a USD 450k (IG-SYNTH-16b) y las historias del CFO (US-03, US-15) no tienen fundamento numérico. Se citan resultados de valor (USD 10M+ en 3 minas) pero sin breakdown de costos, CAC ni LTV. Esto hace que el Lean Canvas tenga un bloque de "Estructura de Costos" marcado como [GAP] completo.

**GAP-04: 5 insights VERIFIED de convergencia 1/57, todos del Touchpoint de feb-19 [IG-03, IG-04, IG-05, IG-06, IG-08]**

Los 5 insights más recientes del proyecto provienen de una sola sesión (Touchpoint 2026-02-19) y tienen convergencia mínima. Cuatro de ellos cambiaron partes sustanciales del PRD (v1.1). No hay nada que invalide estos datos — pero son declaraciones no corroboradas que fundamentan decisiones de alto impacto. Deben ser las primeras hipótesis a testear en Etapa 2.

**GAP-05: IG-09 (sistema aprende de decisiones expertas) es aspiracional sin confirmación de roadmap**

Este insight aparece en el SYSTEM_MAP (Módulo TIM Agent), en PERSONAS (P-04), en el Journey Map (Fase 4) y en USER_STORIES (US-07). Su convergencia es 2/57 con ambas fuentes internas de IDEMAX. No hay evidencia de que TIMining haya comprometido o esté desarrollando esta capacidad. Aplicando el principio "Zero Homer" [IG-SYNTH-02]: US-07 debería marcarse como deferred hasta obtener confirmación del equipo de producto.

**GAP-06: Framework de configuración vs. customización sin definir [CF-05]**

El riesgo "Auto de Homero Simpson" (IG-SYNTH-02) está bien documentado pero no tiene una propuesta de solución arquitectónica. No existe un documento que defina los niveles: configuración (sin código), extensión (API/plugins), desarrollo a medida. Sin este framework, CORE no tiene una política para resistir la presión de customización de clientes.

---

## 6. Score de Readiness

| Dimensión | Puntuación | Justificación |
|---|---|---|
| Trazabilidad de outputs | 9/10 | 100% de VERIFIED cubiertos, [GAP] bien marcados, sin secciones huérfanas |
| Solidez del modelo de negocio | 6/10 | Moat tecnológico sólido; pricing sin fundamento financiero; unit economics ausentes |
| Solidez de perfiles de usuario | 4/10 | Perfiles construidos, coherentes pero proxy; ningún usuario directo validó comportamientos |
| Cobertura del knowledge base | 7/10 | 27 insights, 57 fuentes, buen balance stakeholder/documento; escaso en perspectiva externa |
| Resolución de conflictos | 6/10 | 9/13 resueltos; 4 PENDING bloquean decisiones críticas de diseño y GTM |
| **Score general** | **6.4/10** | Knowledge base robusto para los alcances actuales; Etapa 2 desbloqueará el salto a 8+/10 |

**Veredicto:** El proyecto está en condiciones de avanzar a lineamientos de diseño con los supuestos actuales explicitados, siempre que las hipótesis frágiles (IG-04, IG-06, IG-09 especialmente) se gestionen como suposiciones y no como verdades validadas. La Etapa 2 de entrevistas no es opcional — es la condición para elevar la calidad de toda la capa `user-need` del knowledge base.

---

## Insights Summary

| ID | Concepto | Status | Convergencia | Calidad de evidencia |
|---|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap — brecha plan-realidad | VERIFIED | 15/54 | 🟢 Alta — multi-fuente, direct-quote |
| [IG-SYNTH-02] | Auto de Homero Simpson | VERIFIED | 8/54 | 🟢 Alta |
| [IG-SYNTH-03] | Confusión Temporal | VERIFIED | 5/57 | 🟠 Media |
| [IG-SYNTH-04] | Del Dashboard al Copiloto | VERIFIED | 12/54 | 🟠 Media — aspiracional |
| [IG-SYNTH-05] | Efecto Suiza | VERIFIED | 10/54 | 🟢 Alta |
| [IG-SYNTH-06] | Patrón D→A→R | VERIFIED | 26/57 | 🟢 Alta — mayor convergencia del corpus |
| [IG-SYNTH-07] | Gestión por Excepción | VERIFIED | 10/57 | 🟢 Alta |
| [IG-SYNTH-08] | Democratización del Dato | VERIFIED | 9/54 | 🟠 Media — aspiracional |
| [IG-SYNTH-09] | Perfiles diferenciados | VERIFIED | 13/57 | 🟠 Media — voz indirecta |
| [IG-SYNTH-10] | De herramientas a CORE | VERIFIED | 10/57 | 🟢 Alta |
| [IG-SYNTH-11] | Curva de aprendizaje | VERIFIED | 7/57 | 🟠 Media |
| [IG-SYNTH-12] | Adherencia al plan como métrica | VERIFIED | 10/54 | 🟢 Alta — datos cuantitativos |
| [IG-SYNTH-13] | Stack tecnológico fragmentado | VERIFIED | 3/54 | 🟠 Media — fuente única (COO) |
| [IG-SYNTH-14] | Dependencia venta consultiva | VERIFIED | 4/57 | 🟠 Media |
| [IG-SYNTH-15] | Efecto Gaviota | VERIFIED | 5/54 | 🟠 Media |
| [IG-SYNTH-16] | Paz Mental | VERIFIED | 7/57 | 🟠 Media — concepto interno |
| [IG-SYNTH-16b] | Oportunidad repricing | VERIFIED | 8/57 | 🟠 Media — sin unit economics |
| [IG-SYNTH-17] | Adopción bottom-up | VERIFIED | 6/57 | 🟠 Media — en contradicción con IG-04 |
| [IG-SYNTH-18] | Seguridad geotécnica | VERIFIED | 8/54 | 🟢 Alta — workshop + docs |
| [IG-SYNTH-19] | Interfaz Multimodal 4 Lentes | VERIFIED | 7/54 | 🟠 Media — aspiracional |
| [IG-02] | Etapa 2 incompleta — riesgo sin usuarios | VERIFIED | 1/1 | 🟢 Alta — field note observacional |
| [IG-03] | WhatsApp como canal de decisiones | VERIFIED | 2/57 | 🔴 Baja — 1 fuente interna TIMining |
| [IG-04] | Resistencia de operadores | VERIFIED | 1/57 | 🔴 Baja — 1 fuente CTO |
| [IG-05] | "Mi cliente es el Excel" | VERIFIED | 1/57 | 🔴 Baja — 1 frase CEO |
| [IG-06] | Desconexión mina-planta | VERIFIED | 1/57 | 🔴 Baja — observación IDEMAX |
| [IG-08] | 60 reglas operacionales propietarias | VERIFIED | 1/57 | 🔴 Baja — 1 fuente CTO |
| [IG-09] | Sistema aprende de decisiones expertas | VERIFIED | 2/59 | 🔴 Baja — ambas fuentes internas IDEMAX |
| [IG-10] | Quiet UI como sistema+interfaz (doble capa) | VERIFIED | 2/59 | 🟠 Media — design-framework multi-fuente |
| [IG-11] | Pricing USD 450k — nuevo estándar de valor | VERIFIED | 1/59 | 🔴 Baja — 1 fuente stakeholder |
| [IG-13] | Customización sin pricing diferenciado | VERIFIED | 2/59 | 🔴 Baja — CF-05 PENDING sin resolver |
| [IG-15] | GPS degradadas en contexto de alta elevación | VERIFIED | 1/59 | 🔴 Baja — 1 fuente técnica CTO |
| [IG-16] | Pilares encadenados QUI→CP→TS→OS | VERIFIED | 2/59 | 🟠 Media — design-framework, corroborado por PDF |
| [IG-17] | Distinción cómo vs. qué (presentación/canal vs. contenido/temporalidad) | VERIFIED | 2/59 | 🟠 Media — design-framework, corroborado por PDF |
| [IG-18] | 4 dominios operativos formales (A-B-C-D) | VERIFIED | 2/59 | 🟠 Media — PDF + field notes |
| [IG-19] | Time Scrubbing — navegación temporal continua | VERIFIED | 2/59 | 🟠 Media — PDF + field notes |
| [IG-20] | CFO como "usuario invisible" — apuesta estratégica 2026 | VERIFIED | 2/59 | 🟠 Media — aspiracional (CEO+CTO); requiere validación |
| [IG-21] | Manos libres como interfaz primaria para JdT en terreno | VERIFIED | 2/59 | 🟠 Media — PDF + convergencia con IG-03 |
| [IG-22] | Plan compliance (Casos 1-6) vs. plan optimization (Casos 7-8) | VERIFIED | 2/59 | 🟠 Media — PDF + alineación con SYNTH |
