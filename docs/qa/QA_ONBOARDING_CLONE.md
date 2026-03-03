# QA — Onboarding: Clone Repo

> Date: 2026-03-02
> Tester: Hugo (designer, no dev background)
> Environment: Mac with Xcode only, no Node/npm/CLI tools installed
> Tool: GPT-5.3-Codex (macOS app, "Medio" mode)

## Context

First external user test. Hugo cloned pd-spec from the public GitHub repo and attempted to run the pipeline without Claude Code — using GPT Codex macOS app instead.

## Observations

### OBS-01: Skills work cross-LLM

GPT Codex reads CLAUDE.md and SKILL.md files as generic instructions and follows them. `/extract` and `/analyze` executed successfully. The skills are LLM-agnostic — they're structured prompts, not Claude Code proprietary features.

**Implication:** pd-spec's architecture is more portable than expected. The `.claude/skills/` naming is Claude Code convention, but the content works with any capable coding LLM.

### OBS-02: Slash commands don't work in Codex

Hugo can't type `/extract` as a command. He has to ask in natural language: "ejecuta el skill extract". Codex then reads the SKILL.md and follows the steps.

**Implication:** Not a blocker, but adds friction. Could document this in README for non-Claude-Code users.

### OBS-03: Sandbox permission errors (macOS app)

The GPT Codex macOS app runs in a sandbox. Shell scripts (`scripts/*.sh`) fail with permission errors. Codex works around this by performing the operations "manually" (reading files, writing output directly) instead of calling the scripts.

**Implication:** Works but is slower and uses more tokens. The 90/10 script-first rule doesn't apply in sandboxed environments — the LLM does everything in-context.

### OBS-04: /view server runs inside Codex

Despite sandbox limitations, Codex managed to start the Express + Vite server (`node server/index.js` on port 3001) and serve the live research app.

**Implication:** The sandbox restrictions may be selective (scripts blocked, node server allowed?). Needs further investigation.

### OBS-05: No onboarding friction for the 3-layer architecture

Hugo understood the Sources → Work → Outputs flow without explanation. The folder names (`01_Sources/`, `02_Work/`, `03_Outputs/`) are self-documenting enough for a non-technical user.

### OBS-06: No setup automation

Hugo had to figure out dependencies on his own. No `setup.sh`, no `npm install` instructions prominent in the flow. The README Getting Started section assumes Claude Code.

## Alternative environments discussed (not tested)

| Environment | Expected friction | Notes |
|---|---|---|
| **Codex CLI** | Low — full filesystem + bash access, no sandbox | Scripts would run natively |
| **Codex in VS Code/Cursor** | Low — full filesystem + terminal access | Best option for designers who want a visual editor |
| **Claude Code (CLI)** | None — native environment | Requires Node + npm + Claude subscription |

## Recommendations

1. **Mark repo as GitHub Template** — prevents accidental pushes to pd-spec, gives users clean copy
2. **Add cross-tool note to README** — document that skills work with Codex, Cursor, etc.
3. **Consider `setup.sh`** — automate `npm install` in `app/` and basic setup for new users
4. **Investigate pre-commit hook** — protect engine files from accidental edits (`.claude/skills/`, `scripts/`, `docs/`, `CLAUDE.md`)
