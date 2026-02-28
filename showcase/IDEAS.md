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
