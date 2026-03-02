---
name: reset
description: "DEPRECATED — Use ./scripts/reset.sh instead. Reset generated layers to empty template state."
user-invocable: true
allowed-tools: Read, Bash
argument-hint: "[--work|--output]"
---

# /reset — Reset Generated Layers (DEPRECATED)

> **Deprecated in v4.25.** Use `./scripts/reset.sh [--work|--output|--all]` instead.
> This skill now delegates to the script. The skill remains for backward compatibility.

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
   - No argument or `--work --output` → reset both layers (`--all`).
   - `--work` → reset only `02_Work/`.
   - `--output` → reset only `03_Outputs/`.

2. **Show the user what will be affected** before proceeding:
   - List the files that will be reset or deleted.
   - Count any insights, conflicts, or outputs that will be lost.
   - **Wait for explicit user confirmation.** Never reset silently.

### Phase 1: Execute Reset

3. **Run the script** — delegate to `./scripts/reset.sh`:
   ```bash
   ./scripts/reset.sh --work     # 02_Work/ only
   ./scripts/reset.sh --output   # 03_Outputs/ only
   ./scripts/reset.sh --all      # both (default)
   ```

   The script handles all template restoration, _temp/ cleanup, and output deletion.
   It preserves: `_README.md`, `.gitkeep`, `_custom/`, `_templates/`, `_schemas/`.

### Phase 2: Report

4. **Summarize what was reset** to the user:
   - Files restored to template state.
   - Files deleted.
   - Reminder: "Sources in `01_Sources/` are untouched. Run `/analyze` to rebuild the knowledge base."

5. **Update PROJECT.md Current State** if insight/conflict counts changed:
   - Set insights count to 0.
   - Set conflicts count to 0.
