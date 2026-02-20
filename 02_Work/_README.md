# 02_Work — Agent-Managed Layer

**Do not edit files in this folder manually.**

This layer is the project's "brain" — maintained by the `/extract`, `/analyze`, and `/synthesis` skills.

## What lives here

| File | Managed by | Purpose |
|---|---|---|
| `EXTRACTIONS.md` | `/extract` | Raw claims extracted from sources |
| `INSIGHTS_GRAPH.md` | `/analyze` | Atomic verified insights |
| `CONFLICTS.md` | `/analyze`, `/synthesis` | Contradiction log |
| `RESEARCH_BRIEF.md` | `/analyze` | Stakeholder narrative summary |
| `SYSTEM_MAP.md` | `/synthesis` | Product architecture decisions |
| `MEMORY.md` | All skills | Session log and state tracking |

## How to change things

- **To add information** → put sources in `01_Sources/` and run `/extract`, then `/analyze`
- **To resolve conflicts** → run `/synthesis`
- **To update decisions** → run `/synthesis`
- **To check readiness** → run `/audit` before `/ship`

Manual edits to this folder will be detected and flagged by the agent at the start of the next session.

## Freemode Directories

| Directory | Purpose |
|---|---|
| `_temp/` | Ephemeral workspace — session checkpoints, intermediate indexes, format conversions, preprocessed source files. Auto-managed by the agent; contents may be deleted between sessions. |
| `_assets/` | External materials intake — logos, brand guides, competitor screenshots, reference files that are **not** knowledge sources. `/extract` ignores this folder. |
| `_assets/_INTAKE.md` | Asset log — tracks every file placed in `_assets/`. |

### _INTAKE.md template

```markdown
# Asset Intake Log

| File | Origin | Date | Purpose |
|---|---|---|---|
```

### SESSION_CHECKPOINT.md template

Primary recovery file — the agent reads this first at session start for single-read resume (~2K tokens).

```markdown
# Session Checkpoint

## Quantitative Snapshot
<!-- Updated after every skill execution -->
- **Sources:** X files in 01_Sources/
- **Extractions:** X claims in EXTRACTIONS.md
- **Insights:** X total (Y verified, Z pending) in INSIGHTS_GRAPH.md
- **Conflicts:** X total (Y pending, Z resolved) in CONFLICTS.md
- **Outputs:** [list of generated files in 03_Outputs/]
- **Last skill:** /skill — YYYY-MM-DDTHH:MM

## Project Context
<!-- One-liner: what project, what phase -->

## Session Goals
<!-- What are we trying to produce this session -->

## Key Decisions
<!-- Numbered list of decisions made and their rationale -->

## Files Modified
<!-- List of files created or modified this session -->

## Pending
<!-- What remains to be done -->
```

### STRUCTURE_INDEX.md template

Created by the agent when normalizing a monolithic artifact (see Artifact Normalization in CLAUDE.md). Maps sections to files and line ranges for targeted offset/limit reads.

```markdown
# Structure Index — [artifact name]

> Auto-maintained by agent. Do not edit manually.

| Section | File | Lines | Size |
|---|---|---|---|
| Cover | sections/00-cover.html | 1-45 | 1.2KB |
| Slide 1 — Title | sections/01-intro.html | 1-38 | 0.9KB |
| Slide 2 — Problem | sections/02-problem.html | 1-52 | 1.4KB |
```
