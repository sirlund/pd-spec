---
name: synthesis
description: Review pending conflicts, update the system map based on verified insights
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
---

# /synthesis — Conflict Resolution & System Map Update

## What this skill does

Reviews pending conflicts, guides the user through resolution, updates insight statuses, and ensures the system map reflects the current verified truth.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found (manual edits, unexpected files), report them to the user before proceeding.

### Phase 1: Load & Analyze

1. **Load conflicts** — Read `02_Work/CONFLICTS.md` and identify all `PENDING` conflicts.

2. **Load insights** — Read `02_Work/INSIGHTS_GRAPH.md` to understand current insight statuses and relationships.

3. **Load system map** — Read `02_Work/SYSTEM_MAP.md` to understand current product decisions.

### Phase 2: Present & Discuss (Per Conflict)

4. **Present each PENDING conflict** one at a time:
   - Show the conflict ID, title, and the tension between insights.
   - Show the relevant source references.
   - If the agent has a suggested resolution, present it with reasoning.
   - Present clear options (e.g., keep A, keep B, merge, invalidate both).
   - **Wait for user decision before proceeding to the next conflict.**

### Phase 3: Propose Updates (User Approval)

5. **Draft resolution summary** — After all conflicts are discussed, present:
   - Proposed changes to `CONFLICTS.md` (status updates, resolution notes).
   - Proposed changes to `INSIGHTS_GRAPH.md` (status changes, new merged insights).
   - Proposed changes to `SYSTEM_MAP.md` (vision, modules, principles, open questions).
   - Any traceability gaps found (system map entries without `[IG-XX]` references).
   - **Wait for user approval before writing.**

### Phase 4: Write (After Approval)

6. **Resolve conflicts** — Update conflict statuses to `RESOLVED` in `02_Work/CONFLICTS.md`. Add resolution notes and actions taken.

7. **Update insights** — In `02_Work/INSIGHTS_GRAPH.md`:
   - Mark resolved insights as `VERIFIED`, `MERGED`, or `INVALIDATED`.
   - If merging, create a new insight that combines the originals.

8. **Update system map** — In `02_Work/SYSTEM_MAP.md`:
   - Product Vision — if core assumptions changed.
   - Modules — add, remove, or modify based on verified insights.
   - Design Principles — ensure they reflect current truth.
   - Open Questions — add any new questions surfaced during resolution.

9. **Ensure traceability** — Every entry in SYSTEM_MAP.md must reference at least one `[IG-XX]` insight ID. Flag any entries that lack references.

10. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
    ```markdown
    ## [YYYY-MM-DDTHH:MM] /synthesis
    - **Request:** [what the user asked]
    - **Actions:** [conflicts resolved, insights updated, system map changes]
    - **Result:** [summary of resolutions and decisions]
    - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
    ```
