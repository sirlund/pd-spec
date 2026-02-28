# Wireframe Prompts — Benchmark Patrones Slides

> Generator: Nano/Banana (Gemini image gen)
> Style: Clean wireframe sketch, greyscale + cyan accent, annotation labels
> Date: 2026-02-27
> Status: S12 v2 (UI style) in progress. S14, S16, S18 pending.

---

## S12: Quiet UI × Crisis — Patrones

### 01 — Silencio Cromático

**Concept:** IROC achromatic console. 95% grey/black. Color only on active anomaly.
**File:** `01_silencio-cromatico.png`
**Versions:** v1 (original — garbled headers), v2-ui (improved — all Spanish, differentiated options)

#### v1 (original)

```
Clean UX wireframe sketch, greyscale with annotations, professional design document style.

Mining operations control room dashboard (IROC dispatch console). The layout shows a wide monitor view split into zones:

LEFT PANEL (60%): A map view of an open-pit mine with equipment icons (trucks, shovels) as small dots — all rendered in muted grey tones. ONE equipment icon (a shovel labeled "EX-1102") pulses in bright cyan, indicating an active anomaly. A red dashed zone surrounds a restricted area near the highlighted equipment.

RIGHT PANEL (40%): Three stacked cards in a sidebar:
- Top card: "ALERTA ACTIVA" header with a cyan dot, showing equipment ID, timestamp "02:47", fault type "Caída no programada"
- Middle card: "IMPACTO ESTIMADO" — a simple bar showing tonnage loss projection and shift time remaining
- Bottom card: "3 OPCIONES" — three action items ranked 1-2-3 with estimated tonnage loss and time for each

The entire interface is achromatic (dark greys, whites) EXCEPT the anomaly highlight in cyan. No decorative elements. No 3D. No gradients. Annotations with thin lines point to key areas: "silence = normality", "color = act now", "options ranked by impact".

Typography: monospace headers (like JetBrains Mono), clean sans-serif body text. Status bar at bottom showing: fleet count, active alerts (1), shift progress bar.

Style: Lo-fi wireframe with clean lines, grey fills, minimal detail. Looks like a design spec document, not a finished app. Annotation arrows and labels in a lighter grey.
```

**Issues:** Model garbled headers ("SCHEMATZ MAP VIEW", "SIDDOR SIDDEBAR", "Tonna estimated"). Options not differentiated.

#### v2-ui (improved)

```
Clean UX wireframe sketch on white background, greyscale with annotations, professional design document style.

Mining operations control room dashboard (IROC dispatch console). A wide monitor view split into two zones:

LEFT PANEL (60%): A schematic map of an open-pit mine with contour lines showing pit levels. Equipment icons (trucks, shovels) as small grey dots scattered across haul roads and loading zones — all muted grey. ONE equipment icon (a shovel labeled "EX-1102") pulses in bright cyan, indicating an active anomaly. A red dashed perimeter surrounds a restricted zone near the highlighted shovel. Small labels on the map: "Rampa Norte", "Pit B", "Chancador".

RIGHT PANEL (40%) — labeled "PANEL DE CONTROL": Three stacked cards in a sidebar:
- Top card header: "ALERTA ACTIVA" with a cyan dot. Content: "Equipo: EX-1102 · Hora: 02:47 · Tipo: Caída no programada · Sector: Pit B"
- Middle card header: "IMPACTO ESTIMADO". Content: a horizontal bar showing "Tonelaje turno: -1,200 ton" and another bar "Tiempo restante turno: 5h 13min"
- Bottom card header: "3 OPCIONES RANKEADAS". Three action items:
  1. "Redirigir flota a Pit B · Pérdida: -800 ton · Tiempo: 45 min"
  2. "Esperar mantención · Pérdida: -1,200 ton · Tiempo: 2h est."
  3. "Redirigir a Chancador · Pérdida: -400 ton · Tiempo: 1h 20min (contingencia)"

The entire interface is achromatic (dark greys, whites) EXCEPT the cyan highlight on EX-1102 anomaly. No decorative elements, no 3D, no gradients.

STATUS BAR at bottom: "Flota: 145 | Alertas activas: 1 | Progreso turno: 02:47 / 08:00" with a small progress bar.

Annotations outside the monitor frame with thin lines:
- Arrow to the grey map: "Silencio = normalidad — grises transmiten calma"
- Arrow to the cyan shovel: "Color = actúa ahora"
- Arrow to the 3 options: "Opciones rankeadas por impacto en tonelaje"

All text in Spanish. Typography: monospace font for headers and labels, clean sans-serif for body text. Style: Lo-fi wireframe with clean lines, grey fills, minimal detail. Looks like a design spec document, not a finished app.
```

**Fixes vs v1:** All labels in Spanish, 3 options differentiated with real scenarios (redirect/wait/contingency), map labels for mining context, status bar in Spanish.

---

### 02 — Escalamiento por Excepción

**Concept:** The operator's screen is almost empty — the system filtered 99% before it arrived.
**File:** `02_escalamieto-x-excepcion.png`
**Versions:** v1-funnel (diagram), v2-structured (diagram), v3-ui (IROC console style)

#### v1 — funnel (diagram)

```
Clean UX wireframe sketch on white background, greyscale with annotation labels in light grey. Professional design document style, no app chrome, no gradients, no 3D.

A conceptual diagram showing a signal filtering funnel for a mining operations system:

TOP SECTION: A dense horizontal stream of small signal indicators (hundreds of tiny dots/lines) labeled "4,200 señales / minuto" — all in light grey, representing raw telemetry from GPS, sensors, radios, cameras across the mine.

MIDDLE SECTION: A funnel or filter layer labeled "THRESHOLD ENGINE". Three horizontal threshold lines at different heights, each labeled: "info (log only)", "warning (badge)", "critical (alert)". Most signals fall below all lines. A few cross the warning line. One or two cross the critical line.

BOTTOM SECTION: The operator's actual screen — a minimal, clean dashboard showing ONLY 2 items:
- One warning badge (orange outline) with a brief text: "Velocidad reducida Sector Norte — monitorear"
- One critical alert (cyan fill) with bold text: "Pala EX-1102 DOWN — 3 opciones disponibles"

Annotations pointing to the empty space on the operator screen: "El 99% fue descartado. Lo que queda merece atención." Another annotation at the funnel: "Edge processing: filtrado antes de llegar al dashboard."

A small "before/after" comparison in the corner: LEFT shows a cluttered dashboard with 40+ alerts, badges, and notifications (crossed out). RIGHT shows the clean 2-item screen.

Style: Lo-fi wireframe with clean lines, grey fills. Looks like a design spec document. Annotation arrows in lighter grey. No color except where the cyan alert appears.
```

#### v2 — structured (diagram)

```
Clean UX wireframe sketch on white background, greyscale with annotation labels in light grey. Professional design document style, no app chrome, no decorative elements.

A conceptual diagram showing a signal filtering architecture for a mining operations platform:

TOP SECTION — "ENTRADA":
A dense horizontal band of small signal dots (hundreds of tiny circles and lines) representing raw telemetry. A label reads "4,200 señales / minuto" with a subtitle "GPS · sensores · cámaras · radio · ARIS". All dots are light grey. The band feels dense and noisy.

MIDDLE SECTION — "FILTRO DE UMBRALES":
Three horizontal dashed threshold lines stacked vertically, each labeled on the left:
- Bottom line: "info → log automático" (most signals fall below this)
- Middle line: "warning → badge silencioso" (a few signals cross this)
- Top line: "crítico → alerta al operador" (only 1-2 signals cross this)

Small arrows show most signals being absorbed/filtered. Only 2 signals pass through the top threshold.

BOTTOM SECTION — "PANTALLA DEL DESPACHADOR":
A minimal clean rectangle representing the operator's screen. It contains ONLY two items with generous whitespace:
- A small badge with an orange outline: "Velocidad reducida Sector Norte — monitorear"
- One prominent alert card with a cyan left border: "PALA EX-1102 CAÍDA — 3 opciones rankeadas"

The rest of the screen is intentionally EMPTY — vast grey space.

SIDE COMPARISON (small, bottom-right corner):
Two small thumbnail screens side by side:
- LEFT thumbnail (crossed out with a red X): a cluttered dashboard with 40+ tiny alerts, labels "Antes: 40 alertas"
- RIGHT thumbnail (checkmark): the clean 2-item screen, labels "Después: 2 alertas"

Annotations with thin lines:
- Pointing to empty space on operator screen: "El 99% fue descartado antes de llegar aquí"
- Pointing to the filter layer: "Procesamiento en borde — no en dashboard"
- Pointing to the cyan alert: "Lo que queda merece atención"

All text in Spanish. Clean monospace font for headers, sans-serif for body. No decorative elements.
```

#### v3-ui — IROC console (recommended)

```
Clean UX wireframe sketch on white background, greyscale with annotations, professional design document style.

Mining operations IROC dispatch console screen. The key concept: the screen is almost EMPTY because the system filtered 99% of signals before they arrived.

LAYOUT — wide monitor view:

LEFT (65%): The same open-pit mine map as a schematic in muted greys. 145 equipment dots visible, all grey. No anomalies highlighted. The map looks calm, almost static. A subtle counter in the corner: "Fleet: 145 · Zona activa: 3 de 7".

RIGHT (35%): An alert panel with a header "ALERTAS ACTIVAS" and a large number "2" next to it. Below, only two items:
- Item 1: small orange left border, text "Velocidad reducida · Sector Norte · Monitorear" with a timestamp "02:31"
- Item 2: cyan left border, bold text "PALA EX-1102 CAÍDA · 3 opciones" with a timestamp "02:47" and a small arrow icon indicating expandable

Below the two alerts: vast empty space. In the middle of that empty space, a subtle centered text in light grey: "Sin más alertas activas".

At the very bottom of the alert panel, a small stats bar in very light grey: "Señales procesadas: 4,187/min · Filtradas: 4,185 · Precisión filtro: 99.2%"

STATUS BAR at bottom of screen: "Fleet: 145 | Alertas: 2 | Filtro IA: activo | Turno: 02:47 / 08:00"

Annotations outside the monitor frame:
- Arrow to the empty space: "El vacío ES el diseño — 4,185 señales descartadas antes de llegar aquí"
- Arrow to the stats bar: "Transparencia: el operador sabe que el filtro trabaja"
- Arrow to the 2 alerts: "Lo que queda merece atención"

Style: Lo-fi wireframe, clean lines, grey fills. Same visual language as an IROC dispatch console. Monospace headers. No decorative elements. Only color accents: orange border on warning, cyan border on critical alert.
```

**Notes:** v1-funnel communicates the mechanism well as a standalone diagram. v3-ui shows the RESULT on the actual screen — consistent with 01 and 03b. Recommend v3-ui for carousel layout.

---

### 03 — Filtrado Predictivo Anti-Fatiga

**Concept:** AI learns what's noise over time. Shift-level filter performance view.
**File:** `03_filtrado-predictivo.png`
**Versions:** v1 (timeline diagram), v2 (timeline improved), v3-ui (IROC filter analytics panel)

#### v1 (timeline diagram)

```
Clean UX wireframe sketch, greyscale with annotations, professional design document style.

A timeline-based wireframe showing alert fatigue reduction over a 12-hour mining shift:

TOP: A horizontal timeline bar labeled "TURNO 12H: 19:00 → 07:00" with hour markers.

THREE HORIZONTAL ROWS showing the same timeline at different stages:

ROW 1 — "SIN FILTRO PREDICTIVO": Dense cluster of alert icons along the timeline (30+ alerts). Mix of triangles, circles, diamonds. Most are grey (false positives), a few are filled (real). Label: "32 alertas — el operador ignora todas después de la hora 4."

ROW 2 — "CON FILTRO (SEMANA 1)": Fewer alerts (12). Some grey ones still present but most filtered. A dashed line shows the AI confidence threshold. Label: "12 alertas — el sistema descartó 20 patrones conocidos."

ROW 3 — "CON FILTRO (MES 3)": Only 3-4 alerts remain, all filled/real. Clean timeline with wide spacing. Label: "4 alertas — cada una merece atención. Confianza del operador: restaurada."

BOTTOM: A small learning loop diagram: "Operador descarta alerta → sistema registra → patrón → auto-silencia próxima vez." Arrows forming a cycle.

Side annotation: "Fatiga visual = 0. Cada alerta que aparece es real. El silencio vuelve a ser la señal de que todo va bien."

Style: Lo-fi wireframe, grey fills, annotation arrows. Clean and minimal like a design specification. No app chrome, no color except a single cyan accent on the 3 real alerts in Row 3.
```

#### v2 (timeline improved)

```
Clean UX wireframe sketch on white background, greyscale with annotation labels in light grey. Professional design document style, no app chrome, no decorative elements.

A timeline-based diagram showing how alert fatigue decreases over time as the AI learns. Title at top: "Filtrado Predictivo Anti-Fatiga".

THREE HORIZONTAL ROWS, each showing the same 12-hour shift timeline (19:00 to 07:00) with hour markers:

ROW 1 — labeled "Sin filtro predictivo":
Dense cluster of 30+ small alert triangles along the timeline, most in grey (false positives), 3 filled in dark (real alerts). The real ones are lost in the noise. Right-side annotation: "32 alertas — el operador las ignora todas después de la hora 4." A small frustrated operator icon or X mark at hour 4.

ROW 2 — labeled "Semana 1 con filtro":
Fewer alerts along the same timeline (about 12). Grey false positives reduced. A dashed line shows the AI confidence threshold. Right-side annotation: "12 alertas — 20 patrones conocidos descartados."

ROW 3 — labeled "Mes 3 con filtro":
Only 4 alerts remain, all filled dark or highlighted in cyan. Wide spacing between them. The timeline feels clean and calm. Right-side annotation: "4 alertas — cada una merece atención."

Below the three rows, a small circular LEARNING LOOP diagram with 4 steps connected by arrows:
"Operador descarta alerta" → "Sistema registra patrón" → "Modelo actualiza umbral" → "Próxima alerta similar: auto-silenciada" → back to start.

Bottom annotation in italics: "Fatiga cero en turnos de 12h. El silencio vuelve a significar que todo va bien."

All text in Spanish. Monospace font for headers, sans-serif for body. Only accent color: cyan on the 4 real alerts in Row 3. Everything else in greys.
```

#### v3-ui — IROC filter analytics (recommended)

```
Clean UX wireframe sketch on white background, greyscale with annotations, professional design document style.

Mining operations IROC console showing the AI filter performance view. An overlay panel or secondary screen that the supervisor can check to see how the predictive filter is performing during the shift.

LAYOUT — wide monitor view:

TOP BAR: "RENDIMIENTO FILTRO IA · TURNO NOCTURNO 19:00–07:00" with current time "03:42" and a progress bar showing shift at ~70%.

LEFT (50%): A vertical timeline of the current shift (19:00 to now at 03:42). Along the timeline:
- Small grey dots representing filtered alerts (many clustered between 19:00-22:00, fewer as the night progresses)
- 4 larger triangles with cyan fill representing alerts that DID reach the operator, spaced out along the timeline
- A subtle annotation: "El sistema aprende durante el turno — menos ruido cada hora"

RIGHT (50%): Three stacked metric cards:
- Card 1: Large number "4" with label "Alertas mostradas" and a small green checkmark "Todas reales"
- Card 2: Large number "428" with label "Señales filtradas" and a breakdown: "312 ruido conocido · 98 bajo umbral · 18 duplicadas"
- Card 3: A small line chart showing "Tasa de filtrado" trending upward from ~85% at 19:00 to ~99% at 03:42. Label: "El modelo se ajusta turno a turno"

BOTTOM: A horizontal bar showing the learning loop as UI elements (not a diagram): four small status pills connected by thin lines: "Operador descarta → Patrón registrado → Modelo actualizado → Auto-filtro activo". The third pill glows slightly to indicate current state.

STATUS BAR: "Precisión: 99.2% | Falsos positivos: 0 este turno | Modelo v3.4 — última actualización: hace 2h"

Annotations outside the monitor frame:
- Arrow to the "4 alertas": "Fatiga cero — cada alerta que aparece es real"
- Arrow to the learning loop bar: "El filtro mejora con cada turno"
- Arrow to the trend chart: "De 85% a 99% en una noche"

Style: Lo-fi wireframe, clean lines, grey fills. Same visual language as the IROC dispatch console from previous wireframes. Monospace headers, sans-serif body. Only cyan accent on the 4 real alerts and subtle green on the checkmark.
```

**Notes:** v2 timeline diagram is the best standalone visualization. v3-ui is consistent with 01 and 02b as an actual IROC screen. Recommend v3-ui for carousel layout.

---

## S14: Time Sight × Anticipación — Patrones

> TODO — prompts pending

### 04 — Resolución Temporal Adaptativa
### 05 — Degradación → Ventana de Acción
### 06 — Cadena Causal Visual

---

## S16: Omni Sense × Asistencia — Patrones

> TODO — prompts pending

### 07 — Notificación Push Contextual
### 08 — Interfaz Multimodal Voz/Foto
### 09 — Triaje de Radio Automático

---

## S18: Multi-pilar × Alineación — Patrones

> TODO — prompts pending

### 10 — Desviación Continua del Plan
### 11 — Narrativa Ejecutiva AI
### 12 — Traducción Operacional → Financiera

---

## Lessons Learned

1. **Funnel > structured diagram** for filtering concepts — visual metaphor reads faster than labeled sections
2. **Model garbles mixed-language headers** — force all text in Spanish, avoid English meta-labels like "TOP SECTION"
3. **Dense wireframes don't work at card size (~350px)** — carousel layout (sidebar cards + large viewer) solves this
4. **Cyan as sole accent** works consistently across all three — maintains Quiet UI principle in the wireframe itself
5. **v2 prompts with explicit Spanish text and hour markers** produce cleaner results than v1 with more English/abstract instructions
6. **UI-style > diagram-style** for carousel layout — all three wireframes should look like actual IROC screens, not conceptual diagrams. Consistency matters.
7. **Differentiate options** — generic placeholders ("Tonna estimated -1 ton") break immersion. Use real mining scenarios.
