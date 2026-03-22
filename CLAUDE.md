# CLAUDE.md — AI Agent Protocol

## Project Settings → PROJECT.md

Project-specific configuration (name, language, one-liner) lives in `PROJECT.md` at repo root.
This keeps `CLAUDE.md` as clean engine config that never conflicts during PD-Spec updates.

**Language rule:** All Work layer content (`02_Work/`) and Output deliverables (`03_Outputs/`) must be written in `output_language` (defined in `PROJECT.md`). System identifiers (`[IG-XX]`, `[CF-XX]`, `VERIFIED`, `RESOLVED`, `DISCARDED`, `MERGED`) and skill instructions always remain in English regardless of this setting.

## The Truth Stack

```
01_Sources/  →  Raw input (read-only)
02_Work/     →  Knowledge base (insights, conflicts, strategic vision, proposals)
03_Outputs/  →  Deliverables (derived from Work, never authored directly)
```

## Agent Mandates

1. **No Hallucination** — Every `[IG-XX]` must trace to a file in `01_Sources/`. No evidence = does not exist. When detecting a gap, ask: "I can't find evidence for X — mark as assumption or suggest validation?"
2. **Transparency & Autonomy** — Show before executing. Every extraction, resolution, or generation is presented for transparency before writing to files. The agent proceeds autonomously when one option is clearly best. When options have comparable evidence and high impact, the agent asks the user with full context before deciding. The user retains veto power via skill arguments or by interrupting execution.
3. **Homer's Car Detector** — Flag unnecessary complexity. If a module/feature can't justify itself with `[IG-XX]` references, challenge its existence. Prefer simplest solution.
4. **Proactive Gap Detection** — When detecting missing definitions, untested assumptions, or sparse coverage, suggest methodologies to fill the gap — as options, never impositions.
5. **Source Organization Validation** — Validate source file content matches folder context. Flag inconsistencies, request confirmation before reclassifying.
6. **Uncertainty Management** — When facing ambiguity, present clear options with reasoning and `[IG-XX]` references. Never silently pick one interpretation.
7. **Silence is Gold** — Minimize cognitive load. No filler, no restating the obvious. Every sentence must earn its place.

## Skills (Flexible Pipeline)

Suggested order: `/extract` → `/analyze` → `/spec` → `/ship` — but skills adapt to what's available. No forced sequential dependencies.

| Skill | Command | What it does |
|---|---|---|
| Kickoff | `/kickoff` | Project setup wizard — name, language, project type, starting point, user profile |
| Extract | `/extract [folder]` | Read sources, extract raw claims to 02_Work/EXTRACTIONS.md |
| Analyze | `/analyze` | Process extractions into insights, detect conflicts. Adapts if no extractions exist. |
| Spec | `/spec` | Resolve conflicts, build Strategic Vision + Design Proposals |
| Ship | `/ship [type]` | Generate Markdown deliverables (prd, presentation, report, benchmark-ux, persona, journey-map, lean-canvas, user-stories, audit, strategy) |
| Audit | `/audit` | Quality gate — evaluates Work layer readiness before /ship |
| Visualize | `/visualize [target]` | Generate Mermaid diagrams (strategic-vision, proposals, insights, conflicts, all) |
| Reset | `/reset [--work\|--output]` | Reset generated layers to empty template state. Preserves sources and engine. |
| Seed | `/seed [domain] [--level]` | Generate synthetic sources for testing and onboarding. Includes deliberate contradictions. |
| View | `/view` | Start the Live Research App — local web viewer for Work layer data |

## Insight Lifecycle

Insights in `INSIGHTS_GRAPH.md` follow a 5-status lifecycle:

```
VERIFIED (born here via /analyze)
  ├→ FROZEN (user: "valid but not now") → can Unfreeze back to VERIFIED
  ├→ DISCARDED (user: "not useful") + reason
  ├→ MERGED → [IG-XX] (engine)
  └→ SUPERSEDED → [IG-XX] (engine)
```

| Status | Meaning | Counts toward convergence? |
|---|---|---|
| `VERIFIED` | Confirmed by evidence, born status | Yes |
| `FROZEN` | Valid but deprioritized (user-only decision) | No |
| `DISCARDED` | Not useful + reason stored (user decision) | No |
| `MERGED` | Absorbed into another `[IG-XX]` | No |
| `SUPERSEDED` | Replaced by newer `[IG-XX]` | No |

**Cascade protection:** Before FREEZE, DISCARD, or SUPERSEDE, `scripts/verify-insight.sh` greps the insight ID across STRATEGIC_VISION + PROPOSALS + Outputs. LOW (≤2 refs) proceeds silently. MEDIUM (3-5) shows orphans, asks confirm. HIGH (5+) requires explicit ID confirmation.

**FROZEN = user only.** The agent cannot freeze insights.

## Session Protocol

### Session Start (Recovery)

1. **Read `02_Work/_temp/SESSION_CHECKPOINT.md`** (~2K tokens, single read).
   - If checkpoint exists and Quantitative Snapshot is **fresh** (counts match quick header scan of INSIGHTS_GRAPH.md and CONFLICTS.md) → resume immediately. No further reads.
   - If checkpoint is **stale** (counts diverge) or **absent** → read `02_Work/MEMORY.md` (~2K tokens) and rebuild context.
2. **Integrity check** — only when checkpoint counts diverge. Report discrepancies before proceeding.
3. **Resume context** — use checkpoint (preferred) or MEMORY to continue without user re-explaining.
4. **Reference gate** — Before engine dev, release, or custom/ad-hoc work (freemode) → read `docs/architecture/CLAUDE_REFERENCE.md` first.

### After Every Skill Execution

1. **Append to `02_Work/MEMORY.md`** — request, actions, result, state snapshot. Timestamp: `YYYY-MM-DDTHH:MM`.
2. **Overwrite `02_Work/_temp/SESSION_CHECKPOINT.md`** — full checkpoint (context, snapshot, goals, decisions, pending work).

**Ad-hoc state changes** — any action modifying Work layer files must be logged in MEMORY and update checkpoint.

### MEMORY Compaction

When `02_Work/MEMORY.md` exceeds 80 lines: summarize all except 3 most recent into `## Historical Summary`. Keep under 80 lines. MEMORY.md is the fallback read (~2K tokens) when checkpoint is unavailable.

### Post-Compaction Behavior

After context compaction, re-read `SESSION_CHECKPOINT.md` (not MEMORY.md) to recover state.

## Workshop Mode

Ad-hoc analytical operations outside the standard pipeline. Use `02_Work/_temp/` for workshop artifacts.

**Trigger:** When the user asks to compare, cross-reference, or explore insights/conflicts/proposals outside a skill execution (e.g., "compare X against Y", "how does IG-03 relate to IG-17", "show me the difference between..."), activate workshop mode. The key signal is the user asking about relationships between existing Work layer entities without running a skill.

**Workshop actions MUST write to files — never respond only in chat.** The artifact is the deliverable, not the conversation.

- **Cross-referencing:** "compare A against B" → write a delta table to `02_Work/_temp/WORKSHOP_COMPARE_YYYY-MM-DD_HH-MM.md`. Show a brief summary in chat, but the full comparison goes to the file.
- **Graduation:** artifacts in `_temp/` are ephemeral by default. On user request:
  - "preserve this" → move to `03_Outputs/_custom/`
  - "add to insights" → extract claims into Work layer files (INSIGHTS_GRAPH, CONFLICTS)
- **Logging:** all workshop actions logged in MEMORY.md + checkpoint update (same as skill execution).
- **No special folders:** `_temp/` is sufficient — no `_workshop/` subfolder (Homer's Car).

> **Reference:** For full workshop protocol (artifact naming, cross-reference patterns, graduation workflow) → read `docs/architecture/CLAUDE_REFERENCE.md`

## Engine Development Anti-Patterns

| Rule | Why |
|---|---|
| **Never edit engine files in project branches** | (engine files: `docs/`, `scripts/`, `.claude/`, root config) |
| **Project ideas/bugs go in `02_Work/IDEAS.md`** | Never edit `docs/BACKLOG.md` directly from a project branch |
| **Never `git add .` or `git add -A` on main** | Main must never contain 01_Sources/, 02_Work/, or generated outputs |
| **Never edit files without explicit user request** | Especially during QA — observe, don't fix |
| **Never build large JSON in-context** | >10KB JSON causes compaction loops. Use external scripts |
| **Never put override properties BEFORE spread** | `{ type: 'x', ...obj }` — obj overwrites yours. Always: `{ ...obj, type: 'x' }` |

## Script-First Execution (90/10 Rule)

Mechanical operations (counting, JSON generation, hash computation) → use inline scripts, not LLM reasoning. Scripts are deterministic, faster, token-free. LLM for semantic tasks only (sentence repair, categorization, conflict detection).

**Utility scripts** (`scripts/`): `generate-index.sh`, `next-id.sh`, `count-statuses.sh`, `verify-insight.sh`, `resolve-conflict.sh`, `reset.sh`, `integrity-check.sh`, `validate-fixes.sh`. Run `./scripts/<name> --help` for usage.

## Current State → PROJECT.md

Project-specific state (maturity, insights count, conflicts count) lives in `PROJECT.md` under "Current State".

---

> **Reference:** For detailed documentation on source organization, maturity levels, sources of truth table, folder structure, worktrees, engine development workflow, CHANGELOG format, freemode protocol, documentation guidelines, script patterns, and pre-commit verification → read `docs/architecture/CLAUDE_REFERENCE.md`
