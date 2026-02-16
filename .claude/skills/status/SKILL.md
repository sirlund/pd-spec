---
name: status
description: Generate interactive Work layer dashboard (03_Outputs/STATUS.html) — insights approval, conflict surfacing, prompt generator for /synthesis
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
---

# /status — Research Dashboard

## What this skill does

Generates an interactive HTML dashboard of the current Work layer state. The dashboard has a sidebar with modular navigation (Overview, Insights, Conflicts, Sources, Evidence Gaps, System Map, Actions). The user reviews insights and conflicts in a browser, makes decisions (approve/reject insights, flag/research/resolve conflicts), then generates a copy-paste prompt for `/synthesis`. This is an internal tool, not a stakeholder deliverable.

## Architecture: Template + JSON

The dashboard uses the Template+JSON pattern:
1. **Template** in `03_Outputs/_templates/status.html` — handles all rendering, interactivity, and styling
2. **JSON data** in `<script id="pd-data" type="application/json">` — the agent generates this

The agent reads Work layer files, builds a JSON data object, and injects it into the template. The agent does **not** write CSS, HTML, or JS.

**JSON schema** in `03_Outputs/_schemas/status.schema.json` for reference.

## When to use

- After `/analyze` — to review extractions and decide what to approve/reject.
- After `/synthesis` — to verify the updated state.
- Anytime — snapshot of project health.

## Instructions

**Language & Project Info** — Read `output_language` and `project_name` from `PROJECT.md`. If PROJECT.md is missing, default to `en` / "Untitled Project" and suggest running `/kickoff`. Write all dashboard labels, section headings, card descriptions, and button labels in that language. System IDs and status labels stay in English. Set `meta.language` and `meta.project` in the JSON accordingly.

### Phase 1: Load

1. **Read all Work layer files:**
   - `02_Work/INSIGHTS_GRAPH.md` — parse all `[IG-XX]` entries with status, category, temporal tag, claim, source ref, and key quote.
   - `02_Work/CONFLICTS.md` — parse all `[CF-XX]` entries with status, tension, insight refs, sides, and resolution notes.
   - `02_Work/SYSTEM_MAP.md` — parse vision, modules (name, status, blocker, insight refs, design implications), principles, open questions.
   - `02_Work/MEMORY.md` — parse last session entry for timestamp.

2. **Scan sources** — Glob `01_Sources/` to list source folders, count files per folder, identify file types, and determine extraction status (cross-reference with EXTRACTIONS.md).

3. **Compute summary stats** — insights by status, conflicts by status, source count, evidence gaps.

4. **Detect evidence gaps:**
   - **Claim-level gaps** — Read the `Convergence` field from each insight. If convergence < 2 sources, add to evidence gaps list with description: "[IG-XX] backed by single source".
   - **Source diversity gaps** — check which source types are present/missing from: interviews, benchmarks, analytics, workshops, surveys.

### Phase 2: Generate JSON

5. **Build the JSON data object** following `03_Outputs/_schemas/status.schema.json`:

   ```json
   {
     "meta": {
       "type": "status",
       "generated": "YYYY-MM-DD",
       "language": "en",
       "last_session": "YYYY-MM-DDTHH:MM"
     },
     "title": "Project Name — Dashboard",
     "cards": [
       {"count": 12, "label": "Insights", "breakdown": "8 verified, 4 pending", "style": "ok"},
       {"count": 4, "label": "Conflicts", "breakdown": "2 pending, 2 resolved", "style": "warn"},
       {"count": 6, "label": "Sources", "style": "ok"},
       {"count": 3, "label": "Evidence Gaps", "style": "warn"}
     ],
     "insights": [
       {
         "id": "IG-01",
         "status": "VERIFIED",
         "category": "business",
         "temporal": "current",
         "claim": "The claim text",
         "source": "folder/file.md",
         "quote": "Key quote from source"
       }
     ],
     "conflicts": [
       {
         "id": "CF-01",
         "status": "PENDING",
         "title": "Conflict title",
         "refs": "IG-01 vs IG-05",
         "tension": "Description of the tension",
         "sides": [
           {"position": "Side A position", "refs": ["IG-01"]},
           {"position": "Side B position", "refs": ["IG-05"]}
         ],
         "flag_label": "CTO + Product: prioritization",
         "research_label": "user testing needed"
       }
     ],
     "sources": [
       {
         "folder": "entrevistas-operadores",
         "files": 3,
         "types": ["md"],
         "extraction_status": "Extracted"
       }
     ],
     "source_diversity": [
       {"type": "Interviews", "present": true},
       {"type": "Benchmarks", "present": true},
       {"type": "Analytics", "present": false},
       {"type": "Workshops", "present": false},
       {"type": "Surveys", "present": false}
     ],
     "source_issues": [
       {"description": "Issue description", "action": "Suggested action"}
     ],
     "evidence_gaps": [
       {
         "type": "claim-level",
         "description": "IG-03 backed by single source",
         "suggestion": "Cross-reference with user interviews"
       },
       {
         "type": "source-diversity",
         "description": "No quantitative analytics data",
         "suggestion": "Request usage metrics or run a survey"
       }
     ],
     "system_map": {
       "vision": "Product vision statement",
       "modules": [
         {
           "name": "Module Name",
           "status": "Ready",
           "refs": "IG-01, IG-03",
           "implications": [
             {"text": "Must support offline mode", "ref": "IG-01"}
           ],
           "blocker": null
         }
       ],
       "principles": ["Simplicity over features"],
       "open_questions": ["Question text"]
     }
   }
   ```

   **Card styles:** `"ok"` (green border), `"warn"` (amber border), `"error"` (red border). Use `"warn"` when there are pending conflicts or evidence gaps, `"error"` when blockers exist.

   **Conflict options:** For each PENDING conflict, use generic labels (NO inference, NO synthesis required):
   - `flag_label`: "Flag for stakeholder review"
   - `research_label`: "Validate with additional research"

   The template renders these as radio button options. Users can customize resolution approaches in the generated prompt.

   **Source diversity:** Check folder names and file content for indicators of each source type. Mark as `present: true` if at least one source of that type exists.

### Phase 3: Inject & Write

6. **Read the template** — Read `03_Outputs/_templates/status.html`.

7. **Inject JSON** — Replace the contents of `<script id="pd-data" type="application/json">` with the generated JSON. The status template is self-contained (no external `_base.css`/`_base.js` dependencies), so no inlining is needed.

8. **Write** — Write the combined file to `03_Outputs/STATUS.html`.

9. **Self-check** — After writing, re-read `03_Outputs/STATUS.html` and verify it contains `<script id="pd-data" type="application/json">` with valid JSON inside. If the file does NOT contain this tag, the write was incorrect — re-read the template from `03_Outputs/_templates/status.html` and retry the injection. **CRITICAL: Never write STATUS.html as monolithic inline HTML/CSS/JS. Always use the template.**

### Phase 4: Report

10. **Compact output** — After writing STATUS.html, output ONLY:
   ```
   ✓ Dashboard: STATUS.html
   [Insights: X verified, Y pending | Conflicts: Z pending, W resolved | Sources: N folders]
   ```

   Do NOT show:
   - File path repetition
   - File contents
   - JSON data block
   - Verbose confirmations

   Keep output minimal to conserve tokens.

11. **Do NOT write to MEMORY.md** — `/status` is a read-only snapshot, not a pipeline action.

## Dashboard Features (handled by template)

The template provides these interactive features — the agent only needs to supply correct JSON:

- **Sidebar navigation** — clicking a nav item shows that module, hides others
- **Overview module** — summary cards + research maturity progress bar
- **Insights module** — filterable/searchable cards with approve/reject buttons for PENDING
- **Conflicts module** — filterable cards with Flag/Research/Context radio options
- **Sources module** — folder coverage map + source diversity visualization
- **Evidence Gaps module** — grouped by type (claim-level, source-diversity)
- **System Map module** — vision, modules with implications, principles, open questions
- **Add Context module** — textarea for quick researcher notes. The user types an observation, selects a confidence level, and clicks "Generate". The template generates a prompt with **dual-write instructions**:
     1. **Direct insight** — inject a `PENDING` insight to `02_Work/INSIGHTS_GRAPH.md` with `Voice: researcher`, `Authority: observation`, `Source confidence: [selected level]`, and `Ref: field-note`. This makes the observation immediately visible in the knowledge base without requiring a full pipeline run.
     2. **Field note** — save the observation to `01_Sources/[relevant-folder]/_FIELD_NOTES.md` for traceability and future `/extract` runs.
     The prompt also includes a reminder to log the action in `02_Work/MEMORY.md` (per BUG-13 ad-hoc logging rule). This is a prompt-based mechanism — the dashboard generates text for the user to copy-paste, it does not write files directly.
- **Actions module** — prompt generator that collects all decisions and formats `/synthesis` prompt
- **Cross-referencing anchors** — `STATUS.html#IG-XX` auto-opens the correct module and scrolls to the card
- **Decision counter** — tracks decisions in sidebar footer and action bar
- **Print-friendly** — expands all modules, hides interactive elements
- **Responsive** — collapsible sidebar on mobile
