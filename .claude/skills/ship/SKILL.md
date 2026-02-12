---
name: ship
description: Generate HTML deliverables (prd, presentation, report, benchmark, audit, strategy) in 03_Outputs/ from verified insights in 02_Work/SYSTEM_MAP.md and INSIGHTS_GRAPH.md
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
argument-hint: "[prd|presentation|report|benchmark|audit|strategy]"
---

# /ship — Deliverable Generation

## What this skill does

Generates or updates HTML deliverables in `03_Outputs/` with full traceability to verified insights. Default target is `PRD.html`.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found (manual edits, unexpected files), report them to the user before proceeding.

### Phase 1: Load & Validate

1. **Determine target** — Default: `PRD.html`. If the user passes an argument, generate that document type instead:
   - `prd` — Product Requirements Document (default).
   - `presentation` — Reveal.js slide deck with key insights and decisions.
   - `report` — A4 formatted report for stakeholders (PDF-ready via Print > Save as PDF).
   - `benchmark` / `audit` / `strategy` — Specialized documents.

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
   - Proposed section structure.
   - Key insights that will be referenced (by ID).
   - Any gaps where sections lack sufficient insight backing.
   - **Wait for user approval before generating.**

### Phase 3: Generate (After Approval)

5. **Generate or update the HTML deliverable** in `03_Outputs/`:
   - Use the A4 CSS system from `03_Outputs/PRD.html` as the style reference:
     - Inter font (Google Fonts)
     - `.page` container: 21cm width, 2.54cm padding
     - Gray background (`#F0F2F5`), white page
     - Print media query for clean PDF export
   - Green callout boxes (`.callout`) for key insights.

6. **Document versioning** — Every output carries visible version metadata so stakeholders always know what they're reading:
   - **Check existing output** — If the file already exists, read its current version number and changelog.
   - **Increment version** — First generation: `v1.0`. Each regeneration: increment minor (`v1.1`, `v1.2`). Major increment (`v2.0`) only if the user requests a full rewrite.
   - **Visible metadata header** — Every HTML output must include a `doc-meta` block at the top of the body, visible to the reader:
     ```html
     <div class="doc-meta">
       <strong>v1.2</strong> · Generated YYYY-MM-DD · PD-Spec snapshot: X insights (N verified), Y conflicts
       <details>
         <summary>Document changelog</summary>
         <ul>
           <li>v1.2 (YYYY-MM-DD): [what changed and why]</li>
           <li>v1.1 (YYYY-MM-DD): [what changed and why]</li>
           <li>v1.0 (YYYY-MM-DD): Initial version.</li>
         </ul>
       </details>
     </div>
     ```
   - **Changelog entries** describe what changed in the document (added sections, updated insights, removed modules) — not internal pipeline details.
   - **Rationale:** Outputs may be shared with stakeholders via link or file. If the document changes between viewings without visible versioning, stakeholders lose trust. No silent updates.

7. **Ensure traceability** — Every section of the deliverable must reference `[IG-XX]` source IDs. Include an Insights Summary table listing the key insights used.

8. **Cross-referencing** — All `[IG-XX]` and `[CF-XX]` references in the HTML body must be clickable links to STATUS.html anchors. This applies to all output types.
   - **CSS** — Add to the document `<style>`:
     ```css
     .ref-link { color: #555; text-decoration: none; border-bottom: 1px dotted #999; }
     .ref-link:hover { color: #111; border-bottom-color: #111; }
     ```
   - **JS** — Add before `</body>`:
     ```js
     document.querySelectorAll('.insight-ref, td, p, li').forEach(el => {
       el.innerHTML = el.innerHTML.replace(
         /\[(IG-\d+|CF-\d+)\]/g,
         '<a href="STATUS.html#$1" class="ref-link">[$1]</a>'
       );
     });
     ```
   - This converts text like `[IG-07]` into `<a href="STATUS.html#IG-07" class="ref-link">[IG-07]</a>`.
   - The user clicks a reference → lands on STATUS.html at the exact insight/conflict card with a yellow highlight.
   - **Exception:** Reveal.js presentations (`/ship presentation`) should use `target="_blank"` on links to avoid breaking the slide navigation.

9. **For presentation** (`/ship presentation`):
   - Output: `03_Outputs/PRESENTATION.html`
   - Use Reveal.js (CDN) in a single self-contained HTML file.
   - Structure: Title slide → Problem/Context → Key Insights (1 per slide, with `[IG-XX]` refs) → System Map summary → Decisions → Open Questions → Next Steps.
   - Keep slides minimal — one idea per slide, large text, insight callouts.
   - Include speaker notes (`<aside class="notes">`) with supporting detail.
   - Navigation: arrow keys, presenter mode (press `S`).
   - Use the same color palette as PRD.html (Inter font, green callouts, `#F0F2F5` background).
   - HTML structure:
     ```html
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css">
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css">
     <script src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js"></script>
     ```

10. **For report** (`/ship report`):
    - Output: `03_Outputs/REPORT.html`
    - Use the same A4 CSS system as PRD.html (Inter font, `.page` container, print media query).
    - Structure: Cover page (title, date, author) → Table of Contents → Executive Summary → Findings by category → Insight References → Methodology Notes.
    - Optimized for Print → Save as PDF: page breaks between sections, no interactive elements.
    - Target audience: stakeholders who don't use GitHub or the pipeline.

11. **For other document types** (benchmark, audit, strategy):
    - Use `03_Outputs/PRD.html` as the CSS and layout reference.
    - Adapt the section structure to the document type.
    - Maintain the same traceability requirements.

12. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
   ```markdown
   ## [YYYY-MM-DDTHH:MM] /ship
   - **Request:** [what the user asked]
   - **Actions:** [deliverable generated/updated, sections written]
   - **Result:** [file created, insights referenced count]
   - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
   ```
