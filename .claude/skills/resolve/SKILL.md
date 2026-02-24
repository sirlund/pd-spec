---
name: resolve
description: Resolve pending conflicts in 02_Work/CONFLICTS.md, update insight statuses in INSIGHTS_GRAPH.md, and refresh SYSTEM_MAP.md with verified decisions
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
---

# /resolve — Conflict Resolution & System Map Update

## What this skill does

Reviews pending conflicts, guides the user through resolution, updates insight statuses, and ensures the system map reflects the current verified truth.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found (manual edits, unexpected files), report them to the user before proceeding.

**Language** — Check `output_language` in `PROJECT.md`. If PROJECT.md is missing, default to `en` and suggest running `/kickoff`. Write all resolution notes, system map content, and design principles in that language. System IDs and status labels stay in English.

### Phase 1: Load & Analyze

1. **Load conflicts** — Read `02_Work/CONFLICTS.md` and identify all `PENDING` conflicts.

2. **Load insights** — Read `02_Work/INSIGHTS_GRAPH.md` to understand current insight statuses and relationships.

3. **Load system map** — Read `02_Work/SYSTEM_MAP.md` to understand current product decisions.

4. **Validate arguments** — If the user provides specific IDs (approve IG-XX, reject IG-YY, resolve CF-ZZ), verify each ID exists in the loaded files before proceeding. If an ID doesn't exist, report it to the user and skip it. Do not silently ignore invalid IDs or create phantom resolutions.

### Phase 2: Present & Discuss (Per Conflict)

5. **Present each PENDING conflict** one at a time:
   - Show the conflict ID, title, and the tension between insights.
   - Show the relevant source references.
   - If the agent has a suggested resolution, present it with reasoning.
   - Present clear options (e.g., keep A, keep B, merge, invalidate both).
   - Also offer intermediate options: "Flag for discussion" and "Needs more research".
   - **Wait for user decision before proceeding to the next conflict.**

   **Intermediate state handling:**
   When user selects "Flag for discussion" or "Needs more research":
   - Ask for context (who to discuss with, what to research)
   - Write to CONFLICTS.md: `Status: PENDING — Flagged (context)` or `Status: PENDING — Research (context)`
   - The conflict remains PENDING (not RESOLVED) — the intermediate tag records the decision without closing the conflict
   - These intermediate states are visible in the dashboard with distinct badges (amber "Flagged", blue "Research")

### Phase 3: Propose Updates (User Approval)

6. **Draft resolution summary** — After all conflicts are discussed, present:
   - Proposed changes to `CONFLICTS.md` (status updates, resolution notes).
   - Proposed changes to `INSIGHTS_GRAPH.md` (status changes, new merged insights).
   - Proposed changes to `SYSTEM_MAP.md` (vision, modules, design implications, principles, open questions).
   - Any traceability gaps found (system map entries or design implications without `[IG-XX]` references).
   - **Wait for user approval before writing.**

### Phase 4: Write (After Approval)

7. **Resolve conflicts** — Update conflict statuses to `RESOLVED` in `02_Work/CONFLICTS.md`. Add resolution notes and actions taken.

8. **Update insights** — In `02_Work/INSIGHTS_GRAPH.md`:
   - Mark resolved insights as `VERIFIED`, `MERGED`, or `INVALIDATED`.
   - If merging, create a new insight that combines the originals.

9. **Update system map** — In `02_Work/SYSTEM_MAP.md`:
   - Product Vision — if core assumptions changed.
   - Modules — add, remove, or modify based on verified insights.
   - **Design implications** — for each module, derive actionable implications from its referenced insights. These are not invented — they follow directly from the insight categories:
     - `user-need` insights → UX requirements (e.g., "progressive disclosure", "trust-building patterns")
     - `technical` insights → implementation constraints (e.g., "offline-first", "API rate limits")
     - `business` insights → prioritization signals (e.g., "revenue-critical", "retention driver")
     - `constraint` insights → hard limits (e.g., "must support screen readers", "max 3-step flow")
   - Each implication references the insight it derives from. Format:
     ```markdown
     ### Module: [Name]
     **Status:** [Ready/Blocked]
     **Refs:** [IG-XX], [IG-YY], [IG-ZZ]
     **Design implications:**
     - [Implication] — [IG-XX]
     - [Implication] — [IG-YY]
     ```
   - Design Principles — ensure they reflect current truth. Give each principle a **memorable name** (e.g., "Quiet UI", "The Delta", "Zero-Friction Onboarding") alongside its `[IG-XX]` references. Names make principles actionable and quotable in team discussions. The name should capture the essence of the principle, not just describe it.
   - Open Questions — add any new questions surfaced during resolution.

10. **Ensure traceability** — Every entry in SYSTEM_MAP.md must reference at least one `[IG-XX]` insight ID. Every design implication must reference the insight it derives from. Flag any entries that lack references.

11. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
    ```markdown
    ## [YYYY-MM-DDTHH:MM] /resolve
    - **Request:** [what the user asked]
    - **Actions:** [conflicts resolved, insights updated, system map changes]
    - **Result:** [summary of resolutions and decisions]
    - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
    ```
