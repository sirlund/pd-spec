---
name: ship
description: Generate HTML deliverables in 03_Outputs/ from verified insights. Types: prd, presentation, report, benchmark-ux, persona, journey-map, lean-canvas, user-stories, audit, strategy.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
argument-hint: "[prd|presentation|report|benchmark-ux|persona|journey-map|lean-canvas|user-stories|audit|strategy]"
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

**Language & Project Info** — Read `output_language` and `project_name` from `PROJECT.md`. If PROJECT.md is missing, default to `en` / "Untitled Project" and suggest running `/kickoff`. Write all deliverable content (headings, body text, callouts, table labels) in that language. Do not mix languages within a document — if `output_language` is `es`, all visible text must be in Spanish. System IDs (`[IG-XX]`, `[CF-XX]`) and schema field names stay in English. Set `meta.language` and `meta.project` in the JSON to the values from PROJECT.md.

### Phase 1: Load & Validate

1. **Determine target** — Default: `PRD.html`. If the user passes an argument, generate that document type instead:
   - `prd` — Product Requirements Document (default).
   - `presentation` — Reveal.js slide deck with key insights and decisions.
   - `report` — A4 formatted report for stakeholders (PDF-ready via Print > Save as PDF).
   - `benchmark-ux` — Inter-industry design referents. NOT competitive analysis.
   - `persona` — User persona cards grounded in verified insights.
   - `journey-map` — User journey map with phases, touchpoints, emotions, and pain points.
   - `lean-canvas` — Business model synthesis on one page.
   - `user-stories` — JTBD-framed user stories with acceptance criteria (bridge to PD-Build).
   - `audit` / `strategy` — Specialized documents.
   - `benchmark` — **Deprecated.** See step 19 note.

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
   - `benchmark-ux` → `_templates/benchmark-ux.html`
   - `persona` → `_templates/persona.html`
   - `journey-map` → `_templates/journey-map.html`
   - `lean-canvas` → `_templates/lean-canvas.html`
   - `user-stories` → `_templates/user-stories.html`
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

**Emoji policy** — Only functional emojis in JSON content: ✓ ✗ (matrices), ⚠️ (real warnings), 🔴🟠🟢 (severity/priority traffic light), ▲▼ (trend). Prohibited: decorative emojis that are redundant with text or purely ornamental.

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

13. **For benchmark-ux** (`/ship benchmark-ux`):
    - Output: `03_Outputs/BENCHMARK_UX.html` (via Template+JSON)
    - The agent uses web search to find real design referents from **other industries** — this is NOT a competitive analysis.
    - Structure per referent:
      - Name and industry (e.g., "Compound Finance — DeFi")
      - Screenshot or description of the relevant pattern
      - "Factor X" — what makes this referent relevant (1 sentence)
      - Applicable pattern — how this could apply to the current project
      - Linked Design Principle from SYSTEM_MAP `[IG-XX]`
    - Group referents by design category (Data Visualization, Navigation, Onboarding, etc.)
    - Include 8–15 referents total.
    - **Anti-hallucination:** every referent must be a real product the agent can verify via web search. If unsure, skip it.
    - JSON uses `categories` array (not `sections`) — see `_schemas/benchmark-ux.schema.json`.

14. **For persona** (`/ship persona`):
    - Output: `03_Outputs/PERSONAS.html`
    - Template: `_templates/persona.html`
    - Schema: `_schemas/persona.schema.json`
    - **JSON structure uses `personas` array instead of `sections`** — see schema for details.
    - Derive personas from user-need insights in `INSIGHTS_GRAPH.md`:
      - Filter for insights about user behaviors, needs, frustrations, goals, and context.
      - Group related insights to form distinct archetype clusters.
    - Each persona includes:
      - `name` — Realistic name (not stereotypical).
      - `role` — Job title or role description.
      - `quote` — Representative quote traced to a real source insight.
      - `goals` — What they want to achieve. Array of `{text, ref}` where `ref` is an `[IG-XX]`.
      - `frustrations` — What blocks them. Array of `{text, ref}`.
      - `context` — Work environment, tools, constraints. Array of `{text, ref}`.
      - `behaviors` — How they currently work. Array of `{text, ref}`.
    - Generate **3–5 personas** — enough to cover the insight space without overlap.
    - Each persona must be grounded in **at least 3 verified insights**.
    - If insufficient user-need insights exist, use `[GAP]` markers in the relevant fields and flag the gap to the user.
    - The **Propose phase** (step 4) should present: persona names, roles, key insight clusters per persona, and any gaps.

15. **For journey-map** (`/ship journey-map`):
    - Output: `03_Outputs/JOURNEY_MAP.html` (via Template+JSON)
    - Template: `_templates/journey-map.html`
    - Schema: `_schemas/journey-map.schema.json`
    - Derive journey from user-need and constraint insights in `02_Work/INSIGHTS_GRAPH.md`.
    - Structure: phases (columns) × layers (rows)
      - **Phases** (e.g., Awareness, Onboarding, Daily Use, Advanced Use, Support) — derive from actual product context.
      - **Layers per phase:** User Actions, Touchpoints, Emotions, Pain Points, Opportunities.
    - Each cell's `content` references `[IG-XX]` insights. Cells without insight backing use `[GAP]` marker.
    - Highlight critical pain points (negative emotions) and moments of delight (positive emotions).
    - If personas exist (from `/ship persona`), link journey to the primary persona in the `persona` field of the JSON.
    - JSON structure uses a `phases` array where each phase has a `layers` object keyed by layer type.

16. **For lean-canvas** (`/ship lean-canvas`):
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

17. **For user-stories** (`/ship user-stories`):
    - Output: `03_Outputs/USER_STORIES.html` (via Template+JSON)
    - Template: `_templates/user-stories.html`
    - Schema: `_schemas/user-stories.schema.json`
    - **JSON structure uses `modules` array (not `sections`)** — each module groups related stories by product module or user flow.
    - Derive stories from:
      - **Personas** — from `/ship persona` output (`03_Outputs/PERSONAS.html`), if available. Extract persona IDs to link stories.
      - **User-need insights** in `INSIGHTS_GRAPH.md` — the primary source for JTBD statements.
      - **Modules and design implications** in `SYSTEM_MAP.md` — the primary source for acceptance criteria and story grouping.
    - **JTBD format:** Each story uses a `jtbd` object with three fields:
      - `situation` — "When [triggering context]"
      - `motivation` — "I want to [user action]"
      - `outcome` — "So I can [expected benefit]"
    - Each story includes:
      - `id` — Story ID (`US-XX`)
      - `persona` — Which persona this story serves (P-XX reference or descriptive label)
      - `jtbd` — JTBD statement object (situation, motivation, outcome)
      - `acceptance_criteria` — Array of `{text, ref}` objects derived from SYSTEM_MAP design implications
      - `priority` — `High` / `Medium` / `Low` based on insight convergence and business weight
      - `refs` — Array of `[IG-XX]` references backing this story
    - **Grouping:** Organize stories by module or user flow. Each module has an `id`, `name`, and `stories` array.
    - **If personas don't exist yet:** derive user context directly from user-need insights. Use a descriptive label (e.g., "Operations team") instead of P-XX reference.
    - **Traceability matrix:** Include a `traceability` array in the JSON — each entry maps `story_id` → `insights` → `sources` (source file names that back the referenced insights).
    - **Priority logic:**
      - `High` — story backed by 3+ converging insights or directly tied to a business-critical constraint.
      - `Medium` — story backed by 1–2 insights with clear user need.
      - `Low` — story inferred from a single insight or gap-filling.
    - **Scope boundary:** This is PD-Spec's output (strategy), not PD-Build's input (execution). Stories describe *what* and *why*, never *how* to implement. No technical implementation details, no sprint estimates, no component names.
    - The **Propose phase** (step 4) should present: module groupings, story count per module, persona coverage, key insights used, and any gaps.

18. **For other document types** (audit, strategy):
    - Use `_templates/prd.html` template.
    - Adapt the section structure in JSON to the document type.
    - Maintain the same traceability requirements.

19. **Note on `audit`:** See `/audit` skill (`.claude/skills/audit/SKILL.md`) for the dedicated quality gate. `/ship audit` generates a formatted report; `/audit` runs the validation checks.

20. **Note on `benchmark`:** The `/ship benchmark` type is deprecated and replaced by `/ship benchmark-ux`. If the user requests `/ship benchmark`, redirect them to `/ship benchmark-ux` which focuses on inter-industry design referents, not competitor claims. If the user insists on competitive benchmarks, apply the anti-hallucination rule: **every claim about a competitor or external product must reference a verified `[IG-XX]` insight backed by a real source file. No invented market data, no fabricated competitor features, no assumed pricing.** Sections that lack source-backed claims must use the `"gap"` section type.

21. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
   ```markdown
   ## [YYYY-MM-DDTHH:MM] /ship
   - **Request:** [what the user asked]
   - **Actions:** [deliverable generated/updated, sections written, JSON data size]
   - **Result:** [file created, insights referenced count]
   - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
   ```
