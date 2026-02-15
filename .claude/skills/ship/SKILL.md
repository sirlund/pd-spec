---
name: ship
description: Generate HTML deliverables (prd, presentation, report, benchmark, audit, strategy) in 03_Outputs/ from verified insights in 02_Work/SYSTEM_MAP.md and INSIGHTS_GRAPH.md
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
argument-hint: "[prd|presentation|report|lean-canvas|audit|strategy]"
---

# /ship — Deliverable Generation

## What this skill does

Generates or updates HTML deliverables in `03_Outputs/` with full traceability to verified insights. Default target is `PRD.html`.

## Architecture: Template + JSON

Each output is a single HTML file that contains:
1. A **static template** (HTML + CSS + JS) from `03_Outputs/_templates/` — handles all rendering
2. A **JSON data block** in `<script id="pd-data" type="application/json">` — the agent writes this

The agent's job is: read Work layer → produce JSON → inject into template. The agent does **not** write CSS, HTML structure, or JS. It only writes JSON data.

**JSON schemas** are in `03_Outputs/_schemas/` for reference. Use them to validate structure.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found (manual edits, unexpected files), report them to the user before proceeding.

**Language** — Check `output_language` in CLAUDE.md `## Project Settings`. Write all deliverable content (headings, body text, callouts, table labels) in that language. Do not mix languages within a document — if `output_language` is `es`, all visible text must be in Spanish. System IDs (`[IG-XX]`, `[CF-XX]`) and schema field names stay in English. Set `meta.language` in the JSON to the output language code.

### Phase 1: Load & Validate

1. **Determine target** — Default: `PRD.html`. If the user passes an argument, generate that document type instead:
   - `prd` — Product Requirements Document (default).
   - `presentation` — Reveal.js slide deck with key insights and decisions.
   - `report` — A4 formatted report for stakeholders (PDF-ready via Print > Save as PDF).
   - `lean-canvas` — Business model on one page (9-block Lean Canvas). See step 15.
   - `benchmark` — **Deprecated.** See step 11 note.
   - `audit` / `strategy` — Specialized documents.

2. **Load knowledge base** — Read:
   - `02_Work/SYSTEM_MAP.md` for product architecture and decisions.
   - `02_Work/INSIGHTS_GRAPH.md` for verified insights to reference.

3. **Validate readiness** — Check that the Work layer has sufficient verified content:
   - Are there VERIFIED insights to reference?
   - Is the SYSTEM_MAP populated with traceable decisions?
   - Are there unresolved PENDING conflicts that could affect the deliverable?
   - **If the knowledge base is insufficient**, report what's missing and suggest running `/analyze` or `/synthesis` first.

### Phase 2: Propose (User Approval)

4. **Present deliverable outline** — Before generating, show:
   - Document type and target file.
   - Proposed section structure (as a list of section IDs and headings).
   - Key insights that will be referenced (by ID).
   - Any gaps where sections lack sufficient insight backing.
   - **Wait for user approval before generating.**

### Phase 3: Generate (After Approval) — Template + JSON

5. **Read the template** — Read the appropriate template from `03_Outputs/_templates/`:
   - `prd` → `_templates/prd.html`
   - `report` → `_templates/report.html`
   - `presentation` → `_templates/presentation.html`
   - `audit` / `strategy` → `_templates/prd.html` (use PRD template, adapt sections)

6. **Generate the JSON data object** — Build the JSON according to the schema in `03_Outputs/_schemas/`. The JSON has this structure:

   ```json
   {
     "meta": {
       "type": "prd",
       "version": "v1.0",
       "generated": "YYYY-MM-DD",
       "language": "en",
       "project": "ProjectName",
       "snapshot": {
         "insights_total": 0,
         "insights_verified": 0,
         "conflicts_pending": 0,
         "outputs_count": 0
       },
       "changelog": [
         {"version": "v1.0", "date": "YYYY-MM-DD", "description": "Initial version"}
       ]
     },
     "title": "Document Title",
     "sections": [
       {
         "id": "section-id",
         "heading": "Section Heading",
         "type": "text|callout|table|module-list|open-questions|gap",
         "content": "Text content...",
         "refs": ["IG-01", "IG-05"]
       }
     ]
   }
   ```

   **Section types:**
   - `"text"` — Paragraph content with optional refs.
   - `"callout"` — Highlighted insight or finding. Uses `content` and `refs`.
   - `"table"` — Uses `headers` (array of strings) and `rows` (array of string arrays).
   - `"module-list"` — Uses `items` array with objects: `{name, status, refs, implications: [{text, ref}]}`.
   - `"open-questions"` — Uses `items` array of strings or `{text}` objects.
   - `"gap"` — Section without source backing. Uses `content` for explanation.

   **For presentations**, add `"notes"` field to sections for speaker notes.

7. **Document versioning** — The version metadata lives in `meta`:
   - **Check existing output** — If `03_Outputs/TYPE.html` already exists, read it to extract the current JSON data's `meta.version` and `meta.changelog`.
   - **Increment version** — First generation: `v1.0`. Each regeneration: increment minor (`v1.1`, `v1.2`). Major increment (`v2.0`) only if the user requests a full rewrite.
   - **Changelog entries** describe what changed in the document (added sections, updated insights, removed modules) — not internal pipeline details.
   - **Rationale:** Outputs may be shared with stakeholders. If the document changes without visible versioning, stakeholders lose trust.
   - **Applies to ALL output types.** No exceptions.

8. **Inject JSON into template** — Read the template file, find the `<script id="pd-data" type="application/json">` tag, and replace its contents with the generated JSON. For the final output file:
   - **Inline CSS and JS** — Read `_templates/_base.css` and `_templates/_base.js`, then replace the `<link rel="stylesheet" href="_base.css">` with an inline `<style>` tag and `<script src="_base.js">` with an inline `<script>` tag. This makes the output file self-contained and portable.
   - **Exception:** Presentation template links to Reveal.js CDN — keep those as external links.
   - Write the combined file to `03_Outputs/TYPE.html` (e.g., `PRD.html`, `REPORT.html`, `PRESENTATION.html`).

**Emoji policy** — Only functional emojis in JSON content: ✓ ✗ (matrices), ⚠️ (real warnings), 🔴🟠🟢 (severity/priority traffic light), ▲▼ (trend). Prohibited: decorative emojis (💸💎💡🎯🚀😢👍✅❌) that are redundant with text or purely ornamental.

**No redundancy** — Do not repeat the same information in different sections. Each fact or claim should appear once, in the most relevant section.

9. **Ensure traceability** — Every section's `refs` array must contain `[IG-XX]` source IDs. If a section has no insight references, either find relevant insights or use section type `"gap"` with content explaining the gap. Sections without refs and without type `"gap"` are not acceptable. Include a section of type `"table"` as an Insights Summary listing the key insights used.

10. **Cross-referencing** — The templates handle converting `[IG-XX]` and `[CF-XX]` text in JSON content to clickable `STATUS.html#ID` links automatically via `_base.js`. The agent just writes plain `[IG-XX]` references in JSON string values. For presentations, the template uses `target="_blank"` on ref links.

11. **For presentation** (`/ship presentation`):
   - Output: `03_Outputs/PRESENTATION.html`
   - Structure: Title slide (auto from `title` + `meta`) → sections become slides.
   - Keep slides minimal — one idea per slide, large text, insight callouts.
   - Include `"notes"` field per section for speaker notes.
   - Navigation: arrow keys, presenter mode (press `S`).

12. **For report** (`/ship report`):
    - Output: `03_Outputs/REPORT.html`
    - Structure: Cover page (auto from `title` + `meta`) → Table of Contents (auto from sections) → sections.
    - Optimized for Print → Save as PDF: template handles page breaks between sections.
    - Target audience: stakeholders who don't use GitHub or the pipeline.

13. **For other document types** (audit, strategy):
    - Use `_templates/prd.html` template.
    - Adapt the section structure in JSON to the document type.
    - Maintain the same traceability requirements.

    **Note on `benchmark`:** The `/ship benchmark` type is deprecated. It will be reconverted to `/ship benchmark-ux` in a future update (see Ola 4 in `docs/SPRINT.md`). If the user requests `/ship benchmark`, explain that competitive benchmarks without verified source data risk hallucination (see QA-54), and suggest waiting for the benchmark-ux reconversion — which focuses on inter-industry design referents, not competitor claims. If the user insists, generate it but apply the anti-hallucination rule: **every claim about a competitor or external product must reference a verified `[IG-XX]` insight backed by a real source file. No invented market data, no fabricated competitor features, no assumed pricing.** Sections that lack source-backed claims must use the `"gap"` section type.

15. **For lean-canvas** (`/ship lean-canvas`):
    - Output: `03_Outputs/LEAN_CANVAS.html` (via Template+JSON)
    - Template: `_templates/lean-canvas.html`
    - Schema: `_schemas/lean-canvas.schema.json`
    - Uses a `canvas` object instead of `sections` — each key is a canvas block with `items` (array of strings), `refs` (array of `[IG-XX]`), and optional `gap: true`.
    - Derive from business and constraint insights in `INSIGHTS_GRAPH.md`:
      1. **Problem** (top 3 problems) — from user-need insights.
      2. **Solution** (top 3 features) — from system map modules.
      3. **Key Metrics** — from business insights.
      4. **Unique Value Proposition** — from business + user-need insights.
      5. **Unfair Advantage** — from technical/business insights.
      6. **Channels** — from business insights or mark `gap: true`.
      7. **Customer Segments** — from user-need insights (link to personas if available).
      8. **Cost Structure** — from business/constraint insights or mark `gap: true`.
      9. **Revenue Streams** — from business insights or mark `gap: true`.
    - Each block must reference `[IG-XX]` or use `gap: true` marker.
    - One-page format optimized for print.
    - Traceability: propose the canvas to the user before generating (same approval flow as other types).

16. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
   ```markdown
   ## [YYYY-MM-DDTHH:MM] /ship
   - **Request:** [what the user asked]
   - **Actions:** [deliverable generated/updated, sections written, JSON data size]
   - **Result:** [file created, insights referenced count]
   - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
   ```
