# Plan: Cambios estratégicos derivados del Touchpoint 2026-02-19

## Contexto

El Touchpoint IDEMAX×TIMining (19 feb) fue la primera sesión formal con Philip (CEO) y Carlo (CTO) como interlocutores directos. A diferencia de todas las fuentes anteriores (workshops internos, entrevistas de operaciones, documentos estratégicos), aquí hablan los fundadores frente al equipo de consultoría evaluando el trabajo.

Resultado: 7 nuevos insights (IG-03 a IG-09), 12 convergencias actualizadas, 2 conflictos nuevos. Varios de estos hallazgos **contradicen o matizan supuestos centrales del PRD.md actual** (v1.0, generado el 24 feb sin datos del touchpoint).

Este plan propone 6 cambios estratégicos específicos y mapea cada uno a modificaciones concretas en PRD.md y SYSTEM_MAP.md.

---

## Estado actual de los documentos

- **PRD.md** (v1.0): No menciona WhatsApp, Excel, mina-planta, ni reglas de negocio propietarias. "Paz mental" aparece 11 veces como concepto central. Adopción = "Operational Pull" (bottom-up sin advertencias).
- **SYSTEM_MAP.md**: Idéntico en estructura al PRD. 7 principios, 6 módulos, 6 preguntas abiertas. Sin cambios post-touchpoint.

---

## Cambios estratégicos propuestos

### 1. WhatsApp es el canal real — OmniSense necesita re-priorizarse
**Fuente:** IG-03 (Carlo CTO, direct-quote, primario)
**Hallazgo:** El 90% de las decisiones operacionales ocurre vía WhatsApp, no en TIMining. Información crítica se pierde si el sistema no integra ese canal.
**Estado actual PRD:** OmniSense menciona "canal adecuado" y "Radio IP". WhatsApp no aparece.
**Cambio propuesto:**
- Módulo "Experiencia Multimodal 4 Lentes": añadir WhatsApp como canal primario en el módulo OmniSense, con la lógica de "agnóstico al canal" (Carlo: "si una mina usa full WhatsApp, se mete ahí").
- Principio OmniSense: agregar que el sistema captura decisiones tomadas fuera de la plataforma (no solo empuja información hacia el usuario).
- Bloque de "Módulos": cambiar el estatus del módulo de Experiencia Multimodal de "Blocked — requiere definición de canales" a "Active — WhatsApp/Radio IP como canales prioritarios, 3D como secundario."

**Impacto:** Alto. Redefine la naturaleza del problema de canal.

---

### 2. El competidor real es Excel, no Hexagon
**Fuente:** IG-05 (Philip CEO, direct-quote, primario)
**Hallazgo:** "Mi cliente no es tecnología — mi cliente es el Excel." El comprador no evalúa TIMining contra Maptek o Hexagon, sino contra sus procesos actuales (Excel, radio, reuniones de turno).
**Estado actual PRD:** Competidores mencionados como "Hexagon, Maptek, Deswik, Wenco" (solo en Pregunta Abierta CF-03). Sin framing vs. Excel.
**Cambio propuesto:**
- Sección "Propuesta de Valor": añadir párrafo sobre el posicionamiento de Philip — el comprador compara TIMining con "no cambiar nada" o "seguir con Excel", no con otras plataformas de software minero.
- Principio "Efecto Suiza": matizar la descripción — la integración con Hexagon/Maptek/Komatsu no solo es diferenciador ante competidores sino puente para que el cliente no tenga que abandonar sus herramientas actuales.
- Preguntas Abiertas: añadir "¿Cuál es el workflow específico de Excel/radio que CORE reemplaza en cada perfil de usuario?"

**Impacto:** Medio-alto. Cambia el frame de la conversación de ventas y afecta cómo se comunica el valor en la presentación.

---

### 3. La adopción tiene una condición no documentada: el operador debe sentirlo como su herramienta
**Fuente:** IG-04 (Carlo CTO, direct-quote, primario) + CF-13
**Hallazgo:** Carlo revela que planificación usa TIMining para auditar a operadores, generando resistencia activa. "Si no logramos vender al operador, estamos acá afuera."
**Estado actual PRD:** "Operational Pull" como Principio #7 — adopción bottom-up orgánica, sin advertencia sobre la dinámica de auditoría.
**Cambio propuesto:**
- Principio "Operational Pull": añadir condición explícita — "el operador debe percibir la herramienta como propia, no como herramienta de control de la jefatura. CORE debe dar al operador visibilidad de su propio desempeño antes de exponerlo a planificación."
- Sección "Restricciones y Riesgos": agregar "Riesgo de adopción: si CORE se percibe como herramienta de auditoría top-down, los operadores activos (mayor fuente de stickiness) pueden resistir. Diseñar para que el beneficio sea primero visible para el operador."
- Preguntas Abiertas: agregar "¿Qué información sobre el operador es visible para él vs. para su jefatura? ¿Cómo se comunica esto en el onboarding?"
- Nota: CF-13 PENDING — requiere entrevistas de Etapa 2 para resolver.

**Impacto:** Alto. Afecta el diseño de onboarding, permisos y jerarquía de información en CORE.

---

### 4. "Paz mental" como concepto interno, no como lenguaje de cliente
**Fuente:** CF-12 (Philip CEO, Touchpoint primario)
**Hallazgo:** Philip cuestiona "paz mental" como demasiado abstracto para la venta. Prefiere lenguaje de outcomes: "te facilito el trabajo", "facilitar decisiones con mejor información."
**Estado actual PRD:** "Paz Mental" aparece 11 veces (Resumen Ejecutivo, Principio #1, Propuesta de Valor, tabla de insights). Es el concepto central.
**Cambio propuesto:**
- No reemplazar el concepto (Philip no lo rechaza, cuestiona el nombre).
- Añadir nota en sección "Propuesta de Valor": "El término 'paz mental' es el concepto de diseño interno. En comunicación externa con compradores (CFOs, CEOs de mina), traducir a outcomes: 'facilitar la decisión correcta con la información correcta en el momento correcto.'"
- Principio #1 en SYSTEM_MAP.md: agregar `Note: external framing → "decisión correcta, información correcta, canal correcto" (Philip, Touchpoint 19-feb)`
- Preguntas Abiertas: CF-12 ya está registrado. No requiere otro cambio aquí.

**Impacto:** Medio. Es principalmente de framing/comunicación, no de arquitectura de producto.

---

### 5. Los 60 reglas de negocio propietarias son el moat técnico real frente a AI genérica
**Fuente:** IG-08 (Carlo CTO, direct-quote, primario)
**Hallazgo:** Carlo: "60 reglas de negocio de ifs: dispatching, cambio de turno, secuencias de salida — hacen que la AI no alucine." Estas reglas convierten AI genérica en recomendador confiable. Esto es lo que diferencia TIMining de un GPT con datos de minería.
**Estado actual PRD:** Diferenciador técnico = "Geometry Gap" (algoritmo topográfico). Las reglas de negocio no aparecen.
**Cambio propuesto:**
- Módulo "TIM Agent": añadir párrafo sobre las reglas de negocio como capa de validación de AI — "las 60 reglas operacionales propietarias (dispatching, cambio de turno, secuencias de salida) actúan como filtro que impide que la AI genere recomendaciones operacionalmente inválidas."
- Sección "Diferenciador Tecnológico" (subsección de Propuesta de Valor): añadir como segunda capa de moat, complementaria al Geometry Gap.
- Principio "Efecto Suiza": mencionar que la integración de datos + las reglas de negocio es lo que hace único a TIMining vs. un LLM genérico conectado a datos de mina.

**Impacto:** Alto para el argumento de ventas y para refutar competidores AI-nativos emergentes (presión competitiva de Brasil, claim Carlo).

---

### 6. La desconexión mina-planta como oportunidad no capturada
**Fuente:** IG-06 (Niklas, validado implícitamente por Philip/Carlo en Touchpoint)
**Hallazgo:** "Tercer gap: desconexión mina-planta — información de distintas fuentes — reporting sin valor real — operación y finanzas no se hablan." Manifestación en Caso 8 (reportería ejecutiva CFO).
**Estado actual PRD:** No mencionado. El CFO existe como persona en PERSONAS.html pero no en los módulos del PRD.
**Cambio propuesto:**
- Módulo "Plataforma de Integración": agregar la desconexión mina-planta como caso de uso explícito del módulo — "integrar datos operacionales con KPIs financieros para reportería ejecutiva (CFO)."
- Perfiles de Usuario: añadir CFO como quinto perfil (actualmente en PERSONAS.html v2.0 pero ausente del PRD).
- Preguntas Abiertas: "¿Cuál es el modelo de datos que une operaciones con finanzas? ¿Qué métricas financieras son accionables desde la plataforma?"

**Impacto:** Medio. Expande el addressable market y justifica el ticket de USD 450k ante audiencias CFO.

---

## Qué NO cambiar ahora

Estos cambios requieren datos de Etapa 2 primero:
- Resolución definitiva del nombre "paz mental" (CF-12) → validar en entrevistas con usuarios
- Diseño específico de visibilidad operador vs. jefatura (CF-13) → validar con jefes de turno
- IG-07 (urgente vs. importante) e IG-09 (sistema aprende) → solo fuentes internas, sin validación primaria

---

## Archivos a modificar

| Archivo | Cambios | Prioridad |
|---|---|---|
| `03_Outputs/PRD.md` | 6 cambios (canal WhatsApp, Excel framing, adopción condicional, paz mental nota, 60 reglas, mina-planta) | Alta |
| `02_Work/SYSTEM_MAP.md` | Reflejo de cambios en módulos y principios | Media |

---

## Secuencia recomendada

1. Actualizar PRD.md — secciones afectadas: Propuesta de Valor, Módulos, Principios, Restricciones, Preguntas Abiertas
2. Actualizar SYSTEM_MAP.md — espejo de cambios en módulos y principios
3. Bump versión PRD a v1.1 con changelog en cabecera del documento
4. Programar Etapa 2 de entrevistas (Philip facilita acceso) para resolver los 3 items diferidos
