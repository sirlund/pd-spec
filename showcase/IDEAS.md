# Showcase — Ideas & Pending

## Export Pipeline
- **`showcase/exports/`** — gitignored output tray for generated binaries (PDF, PPTX)
- **`html2pptx.py`** → migrate to `showcase/scripts/html2pptx.py` (engine tool, tracked)
- **`export-pdf.sh`** — wrapper script: build → export → compress via ghostscript
  - `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook` for compression (~150dpi)
  - Replaces manual ilovepdf.com workflow

## Future Theme Support
- CSS variable injection from theme.config (colors, fonts)
- Runtime theme switching beyond light/dark
- Theme presets (corporate, minimal, vibrant)

## Component Candidates
- **Molecules layer** — wait for convergence, extract when patterns repeat
- **DAR Pipeline Bar** — used in slide 32, potential base component

## Legacy Migration
- `interna_w5.html` — pending Astro migration
- `v2_boceto.html` — pending Astro migration
- Legacy HTMLs stay in `_custom/` until replaced
- Other TIMining presentations have extra assets — pending assimilation into Astro

## Slide Comments — Visual Annotation for Agent Batch Edits
- **Origin:** Astro dev toolbar (floating debug module) inspired the idea of an overlay tool for leaving comments on slides
- **Concept:** Floating widget (dev-only, not in production build) that lets the user click on any component/slide and leave a text annotation (e.g., "make this title shorter", "swap chart for table", "wrong color")
- **Storage:** Comments saved to a simple file (`_comments.json` or `COMMENTS.md`) with slide ID + component selector + comment text
- **Agent workflow:** User runs `/showcase --apply-comments` (or similar) → agent reads the comments file, applies the batch of changes across MDX files, clears applied comments
- **Key benefit:** Review the presentation visually in the browser, annotate without switching context, then let the agent do all the editing in one pass
- **Inspiration:** Figma comments, Google Docs suggestions, but for a code-rendered presentation
- **Open questions:**
  - Granularity: per-slide vs per-component targeting?
  - Format: structured JSON vs freeform markdown?
  - Should comments survive across builds or be ephemeral?

## Testing
- No automated tests currently — verification is visual + `npx astro build`
- Consider: Playwright screenshot regression tests per slide
- Consider: astro check / tsc for type validation in CI
