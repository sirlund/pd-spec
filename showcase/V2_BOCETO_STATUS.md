# v2-boceto — Estado de la Presentación

> Última actualización: 2026-03-03

## Deck Overview

- **Total slides activos:** 52
- **Branch:** `project/timining`
- **Ruta:** `showcase/src/content/slides/v2-boceto/`
- **Assets:** `showcase/public/decks/v2-boceto/` (mocks), `showcase/public/decks/main/viz/` (viz cases)

## Vercel Deployments

| Proyecto | URL producción | Contenido |
|---|---|---|
| `showcase` (Astro) | https://showcase-zeta-seven.vercel.app/v2-boceto | Deck v2-boceto actual |
| `showcase` (Astro) | https://showcase-zeta-seven.vercel.app/main | Deck main |
| `presentacion` (HTML v1) | https://presentacion-tau-three.vercel.app | Presentación v1 (legacy) |
| `pds-timining` | https://pds-timining.vercel.app | Deployment anterior |

## Exports

| Formato | Archivo | Tamaño | Método |
|---|---|---|---|
| PDF | `showcase/exports/v2-boceto.pdf` | 1.7MB | Playwright + iLovePDF compress |
| PPTX | `showcase/exports/v2-boceto.pptx` | 136KB | Anthropic API batched (python-pptx) |

Ver `showcase/EXPORT_NOTES.md` para detalles completos de scripts y approaches.

## Estructura del Deck

```
 1-4    Contexto
        1  Cover
        2  Recap: Workshop + Insights
        3  Lo Que Escuchamos
        4  Primeras Señales de Usuarios

 5-10   Definiciones
        5  Insights Clave
        6  Visión Estratégica
        7  Pilares de Diseño
        8  Síntesis Concéntrica (Golden Circle)
        9  Arquitectura de Dominios
       10  Matriz de Intensidad

11-15   Moodboards (4 overviews + 12 cruces individuales)
       11  Intro Moodboards
    12-12.2  Quiet UI (overview + 2 cruces: Crisis ●●●, AE ●●)
    13-13.4  Clear Path (overview + 4 cruces: Crisis ●●●, Antic ●●, Asist ●●, AE ●●)
    14-14.3  Time Sight (overview + 3 cruces: Crisis ●●●, Antic ●●●, AE ●●●)
    15-15.3  Omni Sense (overview + 3 cruces: Crisis ●●, Asist ●●●, AE ●●●)

16      ── Cierre definicional ──

21      Prerrequisito: Confianza en Datos

22-31   Casos 1-5 (ficha CaseStudy + VizSlide por caso)
       22-23  Caso #1: Caída de Equipo Crítico
       24-25  Caso #2: Riesgo Espacial y Seguridad
       26-27  Caso #3: Anticipación de Cuello de Botella
       28-29  Caso #4: Briefing Inteligente
       30-31  Caso #5: Copiloto en Terreno

32      ── Transición: Dos Niveles de Valor ──

33-38   Casos 6-8 (ficha + viz, con updates narrativos)
       33-34  Caso #6: Mejoramiento Continuo del Plan
       35-36  Caso #7: Optimización del Plan Minero
       37-38  Caso #8: Reportería Ejecutiva

39-44   Cierre
       39  Horizonte de Evolución
       40  Hoja de Ruta — Plan Idemax
       41  Próximos Pasos
       42  Mapa de Definiciones
       43  Apéndice: Benchmark por Pilar
       44  Cierre
```

## Cambios Realizados

### Sesión 2026-03-02 (migración inicial)
- Migración HTML → MDX de 32 slides originales
- Estructura multi-deck con routing (`/v2-boceto`)
- Optimización WebP de assets
- Reorganización de imágenes a `public/decks/v2-boceto/mocks/`

### Sesión 2026-03-03 (feedback IDEMAX + reconstrucción)

**Contenido actualizado:**
- s02: Agregada 5ta directriz "Confianza en Datos" (layout 3+2)
- s04: "Ver Plata y Toneladas" (dual view, no excluyente)
- s06: Omni Sense como pilar igual (no transversal), badge MULTIMODAL. Time Sight → "consciencia temporal"
- s07a: Slide de síntesis Golden Circle (círculos concéntricos CSS-only)
- s26→s04: Hallazgos movidos al inicio del deck (position 4)

**Moodboards (nuevo):**
- 4 slides overview por pilar (grid 4 columnas × dominios)
- 12 slides individuales por cruce (sidebar 240px + área moodboard ~75%)
- Frame dashed con labels ("img / wireframe / ref", "drop visual here")
- Solo cruces con intensidad ●●● (líder) o ●● (presente)

**Casos de uso (reconstruidos desde v1):**
- 16 slides nuevos (8 fichas CaseStudy.astro + 8 viz VizSlide.astro)
- Caso #6: reframed como "Mejoramiento Continuo del Plan"
- Casos #7-8: sin cambios respecto a v1
- Imágenes viz apuntando a `/decks/main/viz/`

**Slide de cierre definicional (nuevo):**
- `15d-cierre-definicional.mdx` (order 16)
- Transición: "4 Pilares · 4 Dominios · 12 Cruces → 8 casos de uso"

**Light mode fix:**
- CSS overrides movidos a `theme_spec.css` (engine global) para todos los `rgba(255,255,255,...)` inline
- Cubre: frame borders, sidebar dividers, placeholder text, corner labels
- Pattern: `[data-theme="light"] .slide [style*="..."]` con `!important`

**Síntesis concéntrica (s07a) — rediseño:**
- Reemplaza flat pills monocolor → concentric ring diagram con SVG curved text
- 3 anillos (Why/Where/How) con colores distintos (purple/gold/cyan)
- "Alineación Estratégica" como SVG curved text a lo largo del anillo medio
- Domain badges como círculos en triángulo isósceles
- Pilares en puntos cardinales fuera del anillo con FA icon boxes
- Crosshair connector lines + center glow + backdrop-filter blur progresivo
- Banner "Confianza en Datos" full-width pinned sobre footer

**Slide slug (engine):**
- Footer muestra nombre de archivo MDX junto al número de slide
- `.no-export` oculta el slug en PDF/print

**Slides ocultos (hidden: true):**
- 07b-sintesis-capas.mdx, 07c-sintesis-orbital.mdx (alternativas no elegidas)
- 07-pilares-cadena.mdx (placeholder original)
- 11 a 19 slides de bench originales (reemplazados por moodboards)
- 21-casos-v1.mdx (placeholder "10 slides de v1")
- 23-caso6.mdx, 24-caso7.mdx, 25-caso8.mdx (deltas, reemplazados por fichas completas)

## Pendientes

### Diseño
- [ ] **A: Rediseño matriz (s10)** — La tabla ●●● no se lee bien visualmente. Explorar heatmap o grid visual.
- [ ] **B: Celda vacía en matriz (s10)** — La referencia a "celda vacía" (Quiet UI × Asistencia) no comunica bien.

### Contenido visual
- [ ] **Moodboard images** — Los 12 cruces tienen frames vacíos. Llenar con wireframes, referencias visuales o mockups.
- [ ] **Closeups bench** — Motive×2, Chronosphere×2, Tesla×2, SentinelOne×2, Discord×2, Samsara×2, Ramp×2, CrowdStrike×1.
- [ ] **Mockups S14, S16, S18** — Patrones de Time Sight, Omni Sense, Multi-pilar.

### Pipeline PD-Spec
- [ ] **`/extract`** — Nueva fuente: `sesiones-idemax/toque-idemax(fri27feb).md`
- [ ] **`/spec`** — Integrar 6 insights PENDING (IG-26 a IG-31)
- [ ] **Propagar "Tiempo Cero"** a STRATEGIC_VISION.md (reemplazar "Reducción de Carga Cognitiva")
- [ ] **`/ship`** — Actualizar PRD.md, SYSTEM_MAP.md, PRESENTATION.md
- [ ] **CF-08** — Financial case

### Entrega
- [ ] **Traspaso a Google Slides** — Equipo IDEMAX

## Fuentes de Cambios
- Transcript IDEMAX: `01_Sources/sesiones-idemax/toque-idemax(fri27feb).md`
- Action items Granola.ai (14 items, procesados en sesión 2026-03-03)
- Feedback directo de Nicolas durante sesiones de trabajo
