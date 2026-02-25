# Ideas & Bugs

> Capture ideas and bugs discovered during project work.
> These get formalized as BL items in `docs/BACKLOG.md` on main.
> Format: tag + title + context + proposed fix.

---

## PD-Spec Engine Ideas

### [IDEA] — `/ship update` para sincronizar outputs con el knowledge base → BL-88
**Context:** Después de dos pasadas de /synthesis (7 insights aprobados, 2 conflictos resueltos), actualizamos PRD.md manualmente. El proceso implicó identificar qué outputs existían, cuáles estaban desactualizados y ejecutar los cambios uno a uno. PERSONAS.html no necesitaba cambios pero no había forma de saberlo sin revisarlo.
**Proposed:** `/ship update` — detecta qué outputs existentes en `03_Outputs/` tienen insights VERIFIED o conflictos RESOLVED que no están reflejados, y los actualiza. Flujo: (1) scan de outputs presentes, (2) diff contra INSIGHTS_GRAPH + SYSTEM_MAP, (3) reporte de deuda ("PRD.md no referencia IG-03, IG-08 · PERSONAS.html al día"), (4) actualización de los desactualizados con aprobación del usuario.
**Semántica:** `update` vs. `all` — update implica "sincronizar lo que ya existe con el estado actual del conocimiento", no regenerar desde cero. Complementa el flujo natural post-/synthesis.

### [IDEA] — /ship presentation debería soportar HTML custom (no solo Reveal.js) — PARKED (BL-79 markdown-first cambió la dirección)
**Context:** La presentación TIMining se construyó 100% freemode (`03_Outputs/_custom/presentacion/`) porque `/ship presentation` solo genera Reveal.js con template+JSON. El resultado custom fue mucho más rico: 34 slides con diseño propio, dark/light toggle, footer interactivo, componentes como DAR timeline, benchmark cards, case fichas.
**Proposed:** Evolucionar `/ship presentation` a un flujo que permita: (a) generar desde template (actual), (b) scaffoldear una presentación HTML custom con CSS base + slide system + theme toggle reutilizable. El 80% del CSS y JS que escribimos (slide nav, theme toggle, print styles) es genérico.

### [IDEA] — HTML→PPTX export como tool reutilizable → BL-56 (absorbed)
**Context:** Construimos `html2pptx.py` (1100+ líneas) que parsea HTML custom y genera PPTX editable. El cliente necesita PPTX para compartir en Google Drive. El conversor detecta tipos de slide (cards, benchmark, case_narrative, case_viz, transition, concentric, tables) y renderiza con python-pptx.
**Proposed:** Extraer el patrón "HTML parser → slide type detection → PPTX builder" como herramienta opcional en PD-Spec. Necesita: (a) slide type registry extensible, (b) theme system (light/dark palettes), (c) image embedding con fallback. Podría vivir en `03_Outputs/_tools/`.

### [IDEA] — HTML→PDF pipeline con Decktape — PARKED (receta, no engine feature)
**Context:** Export PDF de presentaciones HTML es frecuente. Pipeline descubierto: `npx decktape generic --key ArrowRight --size WxH --media print --pause 1000 URL output.pdf`. Trick: poner `data-theme="light"` temporalmente en `<html>` para exportar en light mode.
**Proposed:** Documentar como receta estándar en PD-Spec para presentaciones custom. Incluir nota sobre compresión: Ghostscript rompe CSS gradients (`background-clip:text`), usar iLovePDF online en su lugar.

### [IDEA] — Light/dark toggle como componente estándar para outputs — PARKED (menos relevante con markdown-first)
**Context:** Implementamos toggle light/dark en 4 entregables (presentación, benchmark, pilares, casos). El patrón es idéntico: `[data-theme="light"]` CSS overrides con `!important`, localStorage key `pd-theme` compartida, botón con FA icon. Print siempre usa light.
**Proposed:** Agregar toggle como componente en `_base.js` / `_base.css` de templates. Útil para cualquier output que se proyecte en sala (light) y se revise en pantalla (dark).

### [BUG] — Ghostscript PDF compression rompe CSS gradients — PARKED (gotcha externo)
**Context:** `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook` destruye `background-clip: text` con gradientes lineales. Probados /ebook, /printer, /prepress — todos rompen. El gradiente del título del cover se convierte en rectángulo sólido.
**Proposed:** Documentar como limitación conocida. Alternativa: iLovePDF online preserva gradientes con buen ratio de compresión. Para pipeline automatizado, investigar `qpdf --linearize` o `mutool clean`.

### [IDEA] — "Pending changes" como vista nativa en la Live Research App → BL-88 (absorbed — `/ship update` debt report)
**Context:** Después de `/analyze` incremental (Touchpoint 19-feb, 7 nuevos insights), el agente generó un plan con 6 cambios estratégicos antes de ejecutar: cada cambio mapeaba insight fuente → estado actual del documento → cambio propuesto → impacto. Ese plan es información de alto valor que hoy vive en la conversación y se pierde. La app actual (`/view`) muestra el estado del conocimiento (insights, conflictos, mapa) pero no muestra la brecha entre lo que se sabe y lo que los documentos dicen.
**Lesson:** Hay un momento valioso entre `/analyze` (nuevos insights) y la actualización de PRD/SYSTEM_MAP donde el usuario y el cliente necesitan revisar y aprobar qué cambia y por qué. Hoy ese momento es invisible — ocurre en el chat. La app podría exponerlo como estado propio: "X insights no tienen reflejo en PRD" o "3 módulos tienen información desactualizada vs. INSIGHTS_GRAPH".
**Proposed:** Una vista "Gaps" o "Pending" en la Live Research App que muestre: (a) insights VERIFIED que no están referenciados en ningún output (`PRD.md`, `SYSTEM_MAP.md`), (b) módulos/principios del SYSTEM_MAP sin insight que los respalde, (c) conflictos PENDING que bloquean decisiones de diseño. No es un plan de ejecución — es un tablero de deuda de conocimiento que el usuario revisa con el cliente antes de decidir qué actualizar.
**Example:** `02_Work/_temp/PLAN_cambios-touchpoint-2026-02-19.md` — referencia del tipo de output que esta vista debería hacer visible de forma continua.

### [IDEA] — Session history como archivo estructurado → BL-76 (absorbed)
**Context:** Mantuvimos `HISTORY_2026-02-16_to_18.md` (450+ líneas) como log comprensivo de decisiones, prompts, auditorías. Mucho más útil que MEMORY.md para recovery post-compaction porque tiene el *razonamiento*, no solo el estado.
**Proposed:** Formalizar un patrón HISTORY en freemode sessions largas. Diferente a SESSION_CHECKPOINT (estado compacto para recovery) y MEMORY (log de skills). Es el "lab notebook" del proyecto.

### [IDEA] — Footer bar como patrón para presentaciones — PARKED
**Context:** Evolucionamos de controles flotantes (overlapping content) a footer bar fijo con: theme toggle (izq), branding (centro), nav controls (der). Print CSS oculta controles y muestra solo logo. JS oculta footer en slide de cierre.
**Proposed:** Incluir como opción en scaffold de presentaciones custom: `--footer` genera la estructura.

---

## Ideas de Producto / Metodología

### [IDEA] — Síntesis de casos por flujo de experiencia, no por evento — PARKED (metodología)
**Context:** Gemini agrupó 20 láminas de workshop en 10 "Master Cases" mezclando dominios, inventando casos sin evidencia, y usando nombres de pilares obsoletos. Nuestra síntesis manual: agrupar por *flujo compartido* (qué le pasa al operador), produciendo 6 fichas (luego 8) que cubren 18/20 láminas con 0 invención.
**Lesson:** La agrupación por flujo de experiencia (no por tipo de incidente ni por rol) produce casos más coherentes y presentables. El patrón D→A→R fuerza estructura narrativa.

### [IDEA] — Benchmark por pilares > benchmark por industria — PARKED (ya en el skill)
**Context:** El benchmark inicial (Gemini) estaba organizado por industria. Reorganizamos por pilar de diseño: 3 "champions" por pilar que mejor ejemplifican el principio, resto como "También". Resultado: cada pilar tiene evidencia inter-industria tangible.
**Lesson:** Organizar benchmarks por principio de diseño hace el análisis accionable. La pregunta deja de ser "¿qué hace Tesla?" y pasa a ser "¿quién resuelve mejor Time Sight?".

### [IDEA] — Niveles de veracidad para "Cómo Aplica" → BL-89
**Context:** Las secciones "Cómo Aplica a CORE" de cada benchmark oscilan entre verificable (alertas geotécnicas por WhatsApp = real), proyección lógica (briefing de turno = razonable), y aspiracional (Generative UI, filtrado 99% = visión). Camila lo sabe y acepta — es contexto de taller de visión, no spec técnica.
**Lesson:** Etiquetar explícitamente el nivel de veracidad (verificado/proyección/aspiracional) ayuda al presentador a modular su tono y al cliente a calibrar expectativas.

### [IDEA] — Prompts de mockup como entregable de diseño — PARKED
**Context:** Escribimos 8 prompts detallados para Gemini Image Gen (sala IROC, WhatsApp terreno, timeline predictivo, etc.). Incluyen: composición cinematográfica, paleta de colores, UI elements legibles, shallow DOF para ocultar debilidades del generador, contexto minero específico.
**Lesson:** Los prompts de mockup son tan valiosos como los mockups mismos — documentan la intención de diseño y son reproducibles. Podrían ser un entregable estándar en etapa de lineamientos.

### [IDEA] — Pilar naming: 2 palabras inglesas con tensión implícita — PARKED (lección)
**Context:** Iteramos nombres: Live Signal → Multi Signal → Omni Think → Omni Sense. El patrón "Quiet UI" (adjetivo que describe la ausencia + sustantivo técnico) resultó ideal. "Omni Sense" tiene triple lectura: sentidos, sensing, "hacer sentido".
**Lesson:** Los nombres de pilares de diseño deben ser evocativos, memorables, y contener una tensión inherente que invite a explorar. 2 palabras inglesas funciona para audiencia B2B técnica latinoamericana.

### [IDEA] — VIZ pareado con ficha narrativa — PARKED (lección)
**Context:** Cada caso tiene 2 slides: (A) ficha narrativa (perfil + contexto + D→A→R) y (B) visualización (mockup + sidebar de contexto). El par funciona como "teoría + práctica" — la ficha explica el flujo, el VIZ muestra cómo se ve.
**Lesson:** Las fichas solas son abstractas. Los mockups solos son superficiales. El par es más poderoso que la suma — la narrativa da significado a la imagen, la imagen materializa la narrativa.

### [IDEA] — El muro invisible: colaboradores externos no pueden editar outputs HTML → BL-56 (absorbed)
**Context:** Camila (directora Idemax) no tenía forma de contribuir a la presentación. El HTML vive en un repo, se deploya en Vercel, y se edita con código. Ella tenía el link de preview pero cero capacidad de edición. Resultado: dependencia 100% en Nico, ansiedad por la falta de control sobre un entregable compartido, y un cuello de botella real donde una persona concentra todo el poder de modificación.
**Evidencia:** En la reunión del 18/feb, Camila preguntó explícitamente: "esto no se puede como formato PDF y que te quede como al tiro de la presentación?" y luego "si lo logra hacer y bacán, y así no agarramos todo el traspaso". Su prioridad era tener el contenido en un formato donde ella pudiera contribuir (Google Slides/PPTX).
**Tensión real:** PD-Spec optimiza para calidad y trazabilidad del output (HTML con dark/light, CSS design system, todo versionado). Pero en contexto de consultoría con equipo distribuido, la **editabilidad compartida** es tan importante como la calidad. Un entregable que solo una persona puede tocar es un riesgo de proyecto, no un asset.
**Proposed ideas:**
1. **PPTX como output de primera clase** — que `/ship presentation` genere PPTX directamente (no HTML→PPTX como afterthought). Google Slides importa PPTX sin problema.
2. **"Collaborative export" como paso estándar** — en el flujo de freemode, antes de entregar, siempre exportar a formato editable por no-técnicos. No como bonus, como requisito.
3. **Sync bidireccional** — investigar si es viable: editar en Google Slides → re-importar cambios al HTML source of truth. Probablemente inviable, pero el modelo mental importa: el HTML no debería ser cárcel.
4. **Alternativa pragmática:** Hacer el HTML el "master de diseño" y el PPTX el "master de contenido". Cambios de texto van en PPTX (Camila puede editar), cambios visuales van en HTML (Nico + Claude). Merge manual pero con roles claros.

### [IDEA] — dom-to-pptx: export PPTX directo desde el DOM renderizado → BL-56 (absorbed como opción técnica)
**Context:** Investigación feb 2026 sobre HTML "ready to export". Ningún framework resuelve "HTML bello + PPTX editable" desde una fuente. Pero **dom-to-pptx** (JS, client-side) lee posiciones finales del DOM via `getComputedStyle()` y genera PPTX nativo con shapes editables. Usa PptxGenJS (2.1K stars) como backend. Soporta gradientes, border-radius, SVG, icon fonts.
**Implicación para PD-Spec:** Eliminaría la necesidad de parsers HTML custom (como nuestro html2pptx.py de 1100 líneas). Un botón "Exportar PPTX" en el HTML lee el DOM tal como se ve → PPTX editable. La capa JSON (Template+JSON de PD-Spec) habilita renders alternativos: HTML para preview, dom-to-pptx para PPTX, Pandoc para DOCX.
**Arquitectura propuesta:**
```
[Content JSON] ──┬──> HTML renderer (dark/light)  ──> Decktape ──> PDF
                 ├──> dom-to-pptx (desde DOM)      ──> PPTX ──> Google Slides
                 └──> Pandoc (vista simplificada)   ──> DOCX
```
**Riesgo:** Comunidad pequeña (60 GitHub stars), pero MIT license y concepto sólido. Requiere browser environment (client-side only).
**Herramientas evaluadas:** dom-to-pptx (winner), PptxGenJS (manual), python-pptx (actual, frágil), Pandoc (pierde layout), Marp/Slidev (PPTX = imágenes no editables), Aspose (comercial), Google Slides API (mismo problema de mapping manual).
**Estado:** Pendiente test con presentación TIMining.

---

## Bugs & Gotchas Técnicos

### [BUG] — CSS mask-image no funciona para control de color de logos — PARKED (gotcha)
**Context:** Intentamos usar `mask-image` para cambiar el color del logo Idemax dinámicamente. El div quedó vacío/invisible. Reverted a `<img>` plano.
**Proposed:** Documentar como gotcha. `mask-image` requiere que el elemento tenga dimensiones explícitas y background-color. Con logos transparentes PNG es frágil. Usar `filter: brightness(0) invert(1)` para blanco o img directo.

### [BUG] — python-pptx no puede embeder imágenes dentro de text frames — PARKED (gotcha)
**Context:** Al construir benchmark cards en PPTX, las imágenes del bench se pegaron encima del contenido de texto porque `add_picture()` crea un shape separado, no un inline element.
**Proposed:** Para futuro html2pptx: calcular layout con zonas explícitas (image zone + text zone) en lugar de intentar poner imágenes "dentro" de cards.

### [BUG] — BeautifulSoup: selectores de clase deben coincidir exactamente con el HTML — PARKED (gotcha)
**Context:** Parser de case_narrative buscaba `find("p", class_="case-ctx")` pero el HTML tenía `<div class="case-contexto-bajada"><p>...</p></div>` — sin clase en el `<p>`. Resultado: contexto siempre vacío, perfil nunca extraído.
**Proposed:** Al escribir parsers HTML, hacer un pass de discovery primero (`print(section.prettify()[:500])`) para verificar clases reales antes de codificar selectores.
