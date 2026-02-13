---
name: reset
description: Reset generated layers (02_Work/, 03_Outputs/) to empty template state. Preserves 01_Sources/ and engine files.
user-invocable: true
allowed-tools: Read, Write, Bash, Glob
argument-hint: "[--work|--output]"
---

# /reset — Reset Generated Layers

## What this skill does

Restores `02_Work/` and/or `03_Outputs/` to their empty template state. Sources (`01_Sources/`) and engine files (skills, CLAUDE.md, docs/) are never touched.

## When to use

- **Starting a new test cycle** — user wants to rerun the full pipeline from scratch.
- **Bad data cleanup** — a skill run produced incorrect or corrupted insights/outputs.
- **After motor updates** — new skill logic merged from `main`; user wants to regenerate Work and Outputs with the updated engine.
- **Branch reset** — on a QA or test branch, return generated layers to a clean slate while keeping sources intact.

## When NOT to use

- If the user has manually curated insights or system map entries they want to keep. **Always confirm before resetting.**
- If the issue is a single bad insight or output — prefer targeted edits over full reset.

## Instructions

### Phase 0: Confirm Scope

1. **Determine what to reset** based on the user's request or the argument passed:
   - No argument or `--work --output` → reset both layers.
   - `--work` → reset only `02_Work/`.
   - `--output` → reset only `03_Outputs/`.

2. **Show the user what will be affected** before proceeding:
   - List the files that will be reset or deleted.
   - Count any insights, conflicts, or outputs that will be lost.
   - **Wait for explicit user confirmation.** Never reset silently.

### Phase 1: Reset Work Layer (if applicable)

3. **Restore template files** — Overwrite each Work file with its empty template content:

   **`02_Work/INSIGHTS_GRAPH.md`:**
   ```markdown
   # Insights Graph

   Atomic verified insights extracted from sources. Each insight has a unique `[IG-XX]` ID, a status, and a traceable source reference.

   ## Status Legend

   - **PENDING** — Extracted but not yet verified or cross-referenced.
   - **VERIFIED** — Confirmed through cross-referencing or user validation.
   - **MERGED** — Combined with another insight during conflict resolution.
   - **INVALIDATED** — Contradicted by stronger evidence; no longer active.

   ---

   <!-- New insights are appended below by /analyze -->
   ```

   **`02_Work/CONFLICTS.md`:**
   ```markdown
   # Conflicts Log

   Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

   ## Status Legend

   - **PENDING** — Detected but not yet resolved.
   - **RESOLVED** — User has provided a resolution direction.

   ---

   <!-- New conflicts are appended below by /analyze -->
   ```

   **`02_Work/SYSTEM_MAP.md`:**
   ```markdown
   # System Map

   The product's logic layer. Every decision here traces back to verified insights in `INSIGHTS_GRAPH.md`.

   ## Product Vision

   > [To be defined after initial source analysis. Reference [IG-XX] insights.]

   ## Modules

   <!-- Each module should reference the insights that justify its existence.
        Include design implications derived from those insights. Format:

        ### Module: [Name]
        **Status:** [Ready/Blocked]
        **Refs:** [IG-XX], [IG-YY]
        **Design implications:**
        - [Implication derived from insight] — [IG-XX]
   -->

   ## Design Principles

   <!-- Each principle should reference the insights it's grounded in. -->

   ## Open Questions

   - [ ] What are the core user needs? (Run `/analyze` on initial sources)
   - [ ] What technical constraints exist?
   - [ ] What business goals drive prioritization?
   ```

   **`02_Work/MEMORY.md`:**
   ```markdown
   # Project Memory

   > Session log and state tracker. Written by skills after each execution.
   > The agent reads this at session start to resume context and detect manual edits.

   <!-- No sessions recorded yet. Run /analyze, /synthesis, or /ship to begin. -->
   ```

4. **Do NOT touch** `02_Work/_README.md` — it's a structural file, not generated content.

### Phase 2: Reset Outputs Layer (if applicable)

5. **Delete all generated files** in `03_Outputs/` except:
   - `_README.md` (structural)
   - `.gitkeep` (structural)

6. **Restore `03_Outputs/PRD.html`** to its template state — use `git checkout main -- 03_Outputs/PRD.html` if on a branch, or write the template HTML directly if on main.

### Phase 3: Report

7. **Summarize what was reset** to the user:
   - Files restored to template state.
   - Files deleted.
   - Reminder: "Sources in `01_Sources/` are untouched. Run `/analyze` to rebuild the knowledge base."

8. **Update CLAUDE.md Current State** if insight/conflict counts changed:
   - Set insights count to 0.
   - Set conflicts count to 0.
