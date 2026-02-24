# Project Memory

> Session log and state tracker. Written by skills after each execution.
> The agent reads this at session start to resume context and detect manual edits.

## Historical Summary

**Pipeline execution (2026-02-16):**
- `/extract` — 54/61 files processed (7 video unsupported), 1238 claims extracted across 7 folders. Two-pass batching activated.
- `/analyze --full` — 1238 claims → 21 synthesized insights + 6 ambiguities + 5 research gaps. Research Brief generated.
- `/status Add Context` — Injected IG-01 (iPhone-like concept) and IG-02 (Etapa 2 incompleta).
- `/synthesis` — 20 insights VERIFIED, 2 INVALIDATED (IG-SYNTH-20, 21), 1 MERGED (IG-01→IG-SYNTH-16). 7 conflicts RESOLVED, 4 PENDING (CF-03, 05, 07, 08). System Map built: 7 modules, 7 design principles, 6 open questions.
- `/ship prd` — PRD.html v2.0 (Template+JSON). 20 insights referenced. Superseded by PRD.md v1.0.
- `/ship persona` — PERSONAS.html v1.0 (4 personas, 17 insight refs).

**Non-pipeline work (2026-02-17 to 2026-02-18):**
- PERSONAS.html v2.0 — Added 5th persona (CFO Carlos Herrera), 20 insight refs, 3 GAP items.
- Benchmark HTML — 25 referentes, 4 pilares, 12 champions. Light/dark toggle added to 4 files.
- Presentación v4 — 8 use cases rewritten with narrative DAR pattern, CSS/JS extracted, light mode fixed, deployed to Vercel.

---

## [2026-02-24T00:15] /ship prd (Markdown-First)
- **Request:** Generate PRD.md v1.0 using new Markdown-first architecture (BL-79)
- **Actions:** Read INSIGHTS_GRAPH.md, SYSTEM_MAP.md, CONFLICTS.md, PROJECT.md. Proposed outline with 10 sections. User approved. Generated PRD.md in Spanish with all 20 VERIFIED insights referenced, 4 PENDING conflicts documented as risks, 1 PENDING insight (IG-02) as constraint.
- **Result:** 03_Outputs/PRD.md v1.0 generated. 20 insights referenced, 4 conflicts flagged, 2 gaps marked (CF-07, CF-08). First Markdown-first deliverable (replaces Template+JSON PRD.html v2.0).
- **Snapshot:** 24 insights (20 VERIFIED, 1 PENDING, 1 MERGED, 2 INVALIDATED) · 4 conflicts PENDING · PRD.md v1.0

## [2026-02-23T14:00] /ship persona
- **Request:** Regenerar PERSONAS.html con 5ª persona (CFO Carlos Herrera)
- **Actions:** Leído PERSONAS.html v1.0 (4 personas). JSON v2.0 construido (5 personas, 15621 bytes). CSS/_base.css y _base.js inlineados. Labels de secciones traducidos al español (Objetivos, Frustraciones, Contexto, Comportamientos). Archivo escrito: 03_Outputs/PERSONAS.html v2.0.
- **Result:** PERSONAS.html v2.0 generado. 5 personas, 20 insight refs únicos, 3 items [GAP] marcados (P-02, P-04, P-05).
- **Snapshot:** 24 insights (20 VERIFIED, 1 PENDING, 1 MERGED, 2 INVALIDATED) · 4 conflicts PENDING · 6 outputs

## [2026-02-18T21:30] Refactor presentación — CSS/JS externo + light mode fixes
- **Request:** Optimizar estructura HTML, fix light mode, ajustes layout
- **Actions:** CSS/JS extraction (inline → external files). Light mode fixes (gradients, accent colors, surface tokens, DAR timeline). Layout adjustments. Deploy Vercel.
- **Result:** Presentación refactorizada (3 archivos), light mode funcional, deploy verificado
- **Snapshot:** 24 insights (20 VERIFIED, 1 PENDING, 1 MERGED, 2 INVALIDATED) · 4 conflicts PENDING · 5 outputs
