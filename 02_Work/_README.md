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
