# PD-Spec — Pitch Content Draft

> Estructura del pitch estratégico para presentar PD-Spec a equipos de consultoría y producto.
> Sigue el "Argentine approach" que sugirió Hugo: front simple, pasos lineales, resultados tangibles.
> Sin explicar la complejidad técnica. Solo qué hace, por qué importa, y qué entrega.

---

## 1. Hook

**"Todos construyen con IA. ¿Pero cuánto de lo que construyes está alucinando?"**

Alternativas:
- "¿De dónde salió esa decisión de diseño? Si no puedes responder, tienes un problema."
- "Tus herramientas de IA inventan. PD-Spec no."

---

## 2. El Problema (3 slides)

### Slide 1: Herramientas dispersas

Hoy un equipo de producto usa 5+ herramientas de IA para un solo proyecto:
- ChatGPT para brainstorming
- Gemini para análisis de documentos
- NotebookLM para sintetizar entrevistas
- Notion AI para resumir notas
- Builder/v0 para prototipar

**El resultado:** cada herramienta genera su propia verdad. Nadie sabe cuál es la fuente real.

### Slide 2: Sin trazabilidad

Cuando un stakeholder pregunta *"¿De dónde salió este principio de diseño?"*, nadie puede responder con certeza.

- ¿Lo dijo un usuario en una entrevista?
- ¿Lo inventó Gemini?
- ¿Lo asumimos en un workshop?
- ¿Lo copiamos de un benchmark?

Las decisiones de producto flotan sin anclaje. Y nadie lo nota hasta que es tarde.

### Slide 3: Alucinaciones silenciosas

**Caso real:** Un equipo usó Gemini para generar una estrategia de producto. El documento se veía profesional, coherente, convincente. Pero al verificar:

- Inventó casos de uso que no existían
- Infló métricas de mercado
- Fabricó gobernanza de datos como feature
- Atribuyó declaraciones a personas que nunca las dijeron

¿Cuántas decisiones de tu equipo están basadas en alucinaciones que nadie verificó?

---

## 3. La Solución — PD-Spec (3 slides)

### Slide 4: Paso 1 — Mete tus fuentes

Transcripts de reuniones, presentaciones, entrevistas, benchmarks, imágenes de pizarra, websites, documentos internos. Todo entra.

- Acepta: `.md`, `.pdf`, `.pptx`, `.docx`, `.png`, `.jpg`, `.txt`
- No importa el formato. No importa el idioma. No importa el orden.

### Slide 5: Paso 2 — El sistema trabaja

PD-Spec procesa todas las fuentes y:
1. **Extrae** claims concretos (frases, datos, declaraciones)
2. **Sintetiza** miles de claims en insights atómicos con evidencia
3. **Detecta contradicciones** entre fuentes (ej: "¿son 6 o 7 productos?")
4. **Calcula convergencia** — cuántas fuentes independientes respaldan cada insight

### Slide 6: Paso 3 — Todo tiene evidencia

Cada insight dice:
- Quién lo dijo
- En qué documento
- Cuántas fuentes lo respaldan
- Qué tipo de autoridad tiene (stakeholder, usuario, dato interno)

**Nadie inventó nada. Todo se puede verificar.**

---

## 4. Demo Visual (2 slides)

### Slide 7: Dashboard — Insights con convergencia

*[Screenshot del dashboard de TIMining]*

- 72 fuentes procesadas
- 1,200+ claims extraídos
- 23 insights sintetizados
- 4 conflictos detectados

Cada insight muestra convergencia (ej: "15/54 fuentes"), tipo de evidencia, y fuentes citadas.

### Slide 8: Conflicto real detectado

*[Screenshot de un conflicto de TIMining]*

**Conflicto:** ¿Cuántos productos tiene el portafolio? En una reunión alguien dijo 7, en otra dijeron 6. ¿Por qué? Un sub-producto a veces se cuenta como producto aparte.

PD-Spec lo detectó automáticamente. El equipo lo resolvió con contexto. Sin ese flag, habrían seguido con un dato incorrecto.

---

## 5. Outputs (1 slide)

### Slide 9: Entregables trazables

Con un comando, PD-Spec genera:
- **PRD** — Product Requirements Document
- **Personas** — basadas en evidencia real, no inventadas
- **Journey Maps** — con puntos de dolor evidenciados
- **Lean Canvas** — respaldado por insights
- **Presentaciones** — con referencias verificables
- **Benchmark UX** — comparativo documentado

Cada sección de cada documento referencia sus insights. Click en `[IG-07]` → ves la evidencia.

---

## 6. Diferenciador (1 slide)

### Slide 10: "No inventamos"

| Otros tools | PD-Spec |
|---|---|
| Generan contenido plausible | Genera contenido verificable |
| No sabes de dónde sale | Cada claim tiene fuente |
| Alucinan sin avisar | Detecta contradicciones activamente |
| Cada herramienta, su verdad | Una sola base de conocimiento |
| Output bonito, sin respaldo | Output con trazabilidad completa |

**"Cada `[IG-XX]` tiene fuente. Pregúntanos de dónde sale."**

---

## 7. Próximos Pasos (1 slide)

### Slide 11: Piloto

1. **Elegimos un proyecto real** de tu equipo
2. **Cargamos las fuentes** que ya tienen (transcripts, docs, presentaciones)
3. **En una sesión** vemos qué insights emerge y qué contradicciones detecta
4. **Evaluamos** si el resultado es útil para tomar decisiones

**Sin riesgo. Sin compromiso. Con tu propia data.**

---

## Notas de Presentación

### Tono
- Directo, sin jerga técnica
- No mencionar "agentes", "skills", "pipeline", "Work layer"
- Hablar de "el sistema" o "PD-Spec"
- Enfocarse en el dolor (alucinaciones, dispersión) y el beneficio (trazabilidad, confianza)

### Qué NO mostrar
- Terminal / CLI
- Archivos markdown crudos
- Arquitectura de 3 capas
- Git, worktrees, branches
- Detalles de procesamiento (passes, normalization)

### Qué SÍ mostrar
- Dashboard visual (Live Research App)
- Insights con convergencia
- Un conflicto real detectado
- Un output (Personas o PRD) con referencias clickeables

### Audiencia target
- Leads de UX/producto en consultoras (Two Brains, Acid Labs, similares)
- Product Managers en empresas con equipos de research
- CTOs que invierten en herramientas de productividad

### Duración sugerida
- Pitch: 10-12 minutos (11 slides)
- Demo en vivo: 5-8 minutos
- Q&A: 10 minutos
- Total: ~30 minutos
