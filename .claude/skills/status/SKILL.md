---
name: status
description: Generate interactive Work layer dashboard (03_Outputs/STATUS.html) — insights approval, conflict surfacing, prompt generator for /synthesis
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
---

# /status — Work Layer Dashboard

## What this skill does

Generates an interactive HTML dashboard of the current Work layer state. The user reviews insights and conflicts in a browser, makes decisions (approve/reject insights, flag/research/resolve conflicts), then generates a copy-paste prompt for `/synthesis`. This is an internal tool, not a stakeholder deliverable.

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

**Language** — Check `output_language` in CLAUDE.md `## Project Settings`. Write all dashboard labels, section headings, card descriptions, and button labels in that language. System IDs and status labels stay in English.

### Phase 1: Load

1. **Read all Work layer files:**
   - `02_Work/INSIGHTS_GRAPH.md` — parse all `[IG-XX]` entries with status, category, claim, source ref, and key quote.
   - `02_Work/CONFLICTS.md` — parse all `[CF-XX]` entries with status, tension, insight refs, and resolution notes.
   - `02_Work/SYSTEM_MAP.md` — parse modules (name, status, blocker, insight refs), open questions.
   - `02_Work/MEMORY.md` — parse last session entry for timestamp.

2. **Scan sources** — Glob `01_Sources/` to count source files and detect organization issues.

3. **Compute summary stats** — insights by status, conflicts by status, source count, evidence gaps.

### Phase 2: Generate JSON

4. **Build the JSON data object** following `03_Outputs/_schemas/status.schema.json`:

   ```json
   {
     "meta": {
       "type": "status",
       "generated": "YYYY-MM-DD",
       "language": "en",
       "last_session": "YYYY-MM-DDTHH:MM"
     },
     "title": "PD-Spec Status",
     "cards": [
       {"count": 12, "label": "Insights", "breakdown": "8 verified, 4 pending", "style": "ok"},
       {"count": 4, "label": "Conflicts", "breakdown": "2 pending, 2 resolved", "style": "warn"},
       {"count": 6, "label": "Sources", "style": "ok"}
     ],
     "insights": [
       {
         "id": "IG-01",
         "status": "VERIFIED",
         "category": "business",
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
         "flag_label": "CTO + Product: prioritization",
         "research_label": "user testing needed"
       }
     ],
     "source_issues": [
       {"description": "Issue description", "action": "Suggested action"}
     ],
     "evidence_gaps": [
       {"description": "Gap description", "action": "Suggested methodology"}
     ],
     "system_map": {
       "modules": [
         {"name": "Module Name", "status": "Ready", "refs": "IG-01, IG-03", "blocker": null}
       ],
       "open_questions": ["Question text"]
     }
   }
   ```

   **Card styles:** `"ok"` (green border), `"warn"` (amber border), `"error"` (red border). Use `"warn"` when there are pending conflicts, `"error"` when blockers exist.

   **Conflict options context:** For each PENDING conflict, provide specific `flag_label` (who to involve and topic) and `research_label` (what to research) derived from the conflict data. The template renders these as radio button options.

### Phase 3: Inject & Write

5. **Read the template** — Read `03_Outputs/_templates/status.html`.

6. **Inject JSON** — Replace the contents of `<script id="pd-data" type="application/json">` with the generated JSON. The status template is self-contained (no external `_base.css`/`_base.js` dependencies), so no inlining is needed.

7. **Write** — Write the combined file to `03_Outputs/STATUS.html`.

### Phase 4: Report

8. **Tell the user** the file was generated:
   > Dashboard generated at `03_Outputs/STATUS.html`. Open it in your browser to review and make decisions.

9. **Do NOT write to MEMORY.md** — `/status` is a read-only snapshot, not a pipeline action.
