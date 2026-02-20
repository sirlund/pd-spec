# Session Checkpoint — 2026-02-20

## Contexto
Sesiones feb 19-20: PPTX export v2, fixes parser (body text, images, cases), IDEAS.md.
Branch: `project/timining-entregables`.

## Commits esta sesión
1. `7e40bbf` — footer bar con logo Idemax, slide cierre, header compacto, guión presentación
2. `24d4756` — CSS fixes: content-grid centering, remove inline overrides
3. `049d800` — html2pptx v2 rewrite (light mode, layout-first)
4. (pending) — html2pptx v2 fixes: body extraction, image embedding, case narrative full parser

## html2pptx.py estado
- `extract_body()`: extrae `<p>`, `<ul>/<li>`, recap-section (STOP/START), pilar-question
- `add_image_safe()`: embeds bench PNGs + viz PNGs (67MB output vs 102KB sin imágenes)
- Case narrative parser: ahora captura domain, context (case-contexto-bajada), perfil (roles + items), agrupados, stages
- Recap-keep-block (slide 02): detectado e inyectado como primera card
- Orphan rec-boxes: capturados como highlight cards
- Output: `TIMining_CORE_Presentacion_v2.pptx` (67MB, 34 slides)
- Known issue: benchmark images overlay text (manual fix in PPTX)

## IDEAS.md actualizado
- 7 ideas PD-Spec engine (ship presentation, html2pptx tool, Decktape, light/dark, etc.)
- 7 ideas producto/metodología (síntesis por flujo, benchmark por pilares, muro invisible colaboración)
- 3 bugs/gotchas técnicos

## Próximo: investigar HTML "ready to export"
- Cómo generar HTML que exporte limpio a PPTX/DOCX/PDF
- Resolver el gap de colaboración (Camila no puede editar HTML)
