# Showcase Export Notes

> Last updated: 2026-03-03

## All Approaches Tested

| # | Approach | Tool/Method | Output | Size | Editable? | Status |
|---|----------|-------------|--------|------|-----------|--------|
| 1 | **PDF Playwright + iLovePDF** | `export-pdf.mjs` — headless print + API compress | PDF, 52 pages | 37MB → 1.7MB | No | ✅ Production |
| 2 | **PPTX Anthropic API batched** | `export-pptx.py` — code execution + container reuse, 2×26 slides | PPTX, 52 slides | 136KB | Yes (native) | ✅ Implemented |
| 3 | **PPTX LibreOffice headless** | `soffice --headless --convert-to pptx` from PDF | PPTX | 1.1MB | Yes (approximate) | ✅ Works (free) |
| 4 | **PPTX Claude Desktop (manual)** | Claude Desktop + python-pptx, PDF split in 2 parts | PPTX, 26 slides (part 1) | 507KB | Yes (native) | ✅ Proof of concept |
| 5 | **PPTX Anthropic API single-shot** | Single API call, all 52 slides | — | — | — | ❌ Token limit exceeded |
| 6 | **iLovePDF API pdftopptx** | REST API / SDK | — | — | — | ❌ Not available in API |
| 7 | **Ghostscript compress** | `gs -dPDFSETTINGS=/ebook` | PDF | 1.9MB | No | ❌ Quality degraded |
| 8 | **html2pptx.py** (v1, TP1) | BeautifulSoup + python-pptx, parse static HTML | PPTX | 66MB | Yes | Legacy |
| 9 | **dom-to-pptx** (v1, TP1) | Playwright + dom-to-pptx library | PPTX | 27MB | No (pixel-copy) | Experimental |

## Production Workflow

```bash
# PDF (light mode, compressed)
node showcase/scripts/export-pdf.mjs --light --compress
# → showcase/exports/v2-boceto.pdf (1.7MB)

# PPTX — Option A: Anthropic API (best quality, costs ~$0.50-3.00)
python3 showcase/scripts/export-pptx.py
# → showcase/exports/v2-boceto.pptx (136KB)

# PPTX — Option B: LibreOffice (free, decent quality)
soffice --headless --convert-to pptx showcase/exports/v2-boceto.pdf
# → showcase/exports/v2-boceto.pptx (1.1MB)
```

## Script: export-pdf.mjs

- **Requires:** Playwright (`npm install`), dev server running on `:4321`
- **Optional:** `@ilovepdf/ilovepdf-nodejs` + keys in `.env` for `--compress`
- **Flags:** `--light`, `--compress`, `--url`, `--output`
- **Output:** 1.7MB compressed (from 37MB raw), 52 pages

## Script: export-pptx.py

- **Requires:** `anthropic` Python SDK, `ANTHROPIC_API_KEY` env var
- **Method:** Reads MDX source files → sends to Claude code execution in batches → Claude generates PPTX with python-pptx in sandbox → downloads via Files API
- **Flags:** `--dark`, `--output`, `--batch-size` (default 26), `--model` (default `claude-haiku-4-5`), `--compress`
- **Cost:** ~$0.50-0.70 with Haiku (estimated), ~$3 with Sonnet 4.6 (tested)
- **Known issues:**
  - Haiku 4.5 returned 529 (overloaded) as of 2026-03-03 — use `--model claude-sonnet-4-6` as fallback
  - `--compress` flag recognized but not yet implemented

## Key Learnings

1. **Batching solves token limits** — 52 slides in 2 batches of 26, container reuse between calls
2. **Container reuse** — create container with cheap non-streaming call first, then pass `container_id` to streaming batches
3. **Files API beta required** — `betas=["files-api-2025-04-14"]` needed for file references in code execution responses
4. **Streaming mandatory** — Anthropic SDK requires streaming for `max_tokens >= 64000`
5. **Restrictive batch 2 prompt** — tell Claude "Do NOT read existing slides" to prevent cost inflation (476K→~150K input tokens)
6. **LibreOffice is the cheapest option** — free, one command, decent quality. API approach gives better native slides but costs money.

## Historical: Touchpoint 1 Outputs

- `TIMining_CORE_Presentacion.pptx` (66MB) — html2pptx.py
- `TIMining_CORE_Presentacion_v2.pptx` (65MB) — html2pptx.py
- `TIMining-CORE-Presentacion-Light_compressed.pdf` (3.5MB)

## Dependencies

- `playwright` — PDF export (devDep)
- `@ilovepdf/ilovepdf-nodejs` — PDF compression (devDep)
- `anthropic` — PPTX export (Python, pip install)
- API keys in `showcase/.env` (gitignored):
  ```
  ILOVEPDF_PUBLIC_KEY=
  ILOVEPDF_SECRET_KEY=
  ANTHROPIC_API_KEY=
  ```
