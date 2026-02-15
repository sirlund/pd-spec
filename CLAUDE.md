# CLAUDE.md — AI Agent Protocol

## Project Settings

> Configured by `/kickoff`. Edit manually anytime.

- **project_name:** [Set by /kickoff]
- **output_language:** en
- **one_liner:** [Set by /kickoff]
- **team:** [Set by /kickoff]
- **started:** [Set by /kickoff]

**Language rule:** All Work layer content (`02_Work/`) and Output deliverables (`03_Outputs/`) must be written in `output_language`. System identifiers (`[IG-XX]`, `[CF-XX]`, `VERIFIED`, `PENDING`, `RESOLVED`, `INVALIDATED`, `MERGED`) and skill instructions always remain in English regardless of this setting.

## The Truth Stack

This project follows the PD-Spec 3-layer architecture. The AI agent operates within these layers and must respect their rules at all times.

```
01_Sources/  →  Raw input (read-only)
02_Work/     →  Knowledge base (insights, conflicts, system map)
03_Outputs/  →  Deliverables (derived from Work, never authored directly)
```

## Agent Mandates

### 1. No Hallucination
If a claim does not trace back to a file in `01_Sources/`, the insight **does not exist**. Never invent insights, user needs, or technical constraints. Every `[IG-XX]` entry must reference a real source file. When the agent detects an evidence gap, it must ask: *"I can't find evidence for X — should we mark it as an assumption or should I suggest how to validate it?"*

### 2. Transparency & Control
No black boxes. The agent **proposes before executing** — every insight extraction, conflict resolution, or deliverable generation is presented as a draft for user approval before writing to files. The user has final veto over any reclassification, edit, or structural change.

### 3. Homer's Car Detector
Flag unnecessary complexity and customization. If a module, feature, or design decision cannot justify itself with `[IG-XX]` references, challenge its existence. Prefer the simplest solution that satisfies verified insights.

### 4. Proactive Gap Detection
When the agent detects missing definitions, untested assumptions, or sparse source coverage, it should suggest methodologies to fill the gap (e.g., interview scripts, synthetic users, benchmarks) — as **open options**, never impositions. The user decides whether and how to pursue them.

### 5. Source Organization Validation
The agent validates whether a source file's content matches its folder context. If a benchmark appears inside an interviews folder, or a file's metadata conflicts with its location, the agent flags the inconsistency and requests user confirmation before moving or reclassifying.

### 6. Uncertainty Management
When facing ambiguity, the agent presents clear options with their reasoning (e.g., "Option A based on business insight [IG-03]", "Option B based on user research [IG-07]") and asks questions to align on direction. Never silently pick one interpretation.

### 7. Silence is Gold
Minimize cognitive load in all outputs. No filler paragraphs, no restating the obvious, no decorative content. Every sentence in a deliverable must earn its place.

## Source Organization

Sources in `01_Sources/` are organized in subfolders by milestone or category to inherit temporal and thematic context:

```
01_Sources/
├── 2026-02-workshop-gerencia/
│   ├── notas-sesion.md
│   └── foto-whiteboard.png
├── benchmark-inicial/
│   └── competidores.md
├── entrevistas-operadores/
│   ├── entrevista-01.md
│   └── entrevista-02.md
└── _SOURCE_TEMPLATE.md
```

The folder name provides context that individual files inherit. The agent validates coherence between folder context and file content.

**Non-markdown files** (images, PDFs, spreadsheets, .txt, .docx) can't carry internal metadata. Add a `_CONTEXT.md` in the folder to describe them — see `_CONTEXT_TEMPLATE.md` for the format.

## Skills Pipeline

| Skill | Command | What it does |
|---|---|---|
| Kickoff | `/kickoff` | Project setup wizard — name, language, one-liner |
| Extract | `/extract [folder]` | Read sources, extract raw claims to 02_Work/EXTRACTIONS.md |
| Analyze | `/analyze` | Process extractions into insights, detect conflicts. Requires `/extract` first. |
| Synthesis | `/synthesis` | Resolve conflicts, update system map |
| Ship | `/ship [type]` | Generate deliverables (prd, presentation, report, persona, benchmark, audit, strategy) |
| Visualize | `/visualize [target]` | Generate Mermaid diagrams (system-map, insights, conflicts, all) |
| Reset | `/reset [--work\|--output]` | Reset generated layers to empty template state. Preserves sources and engine. |
| Status | `/status` | Generate Work layer dashboard (HTML) — insights, conflicts, gaps, source issues. |
| Seed | `/seed [domain] [--level]` | Generate synthetic sources for testing and onboarding. Includes deliberate contradictions. |

## Maturity Levels

| Level | Sources Available | Agent Behavior |
|---|---|---|
| **Seed** | Initial brief only | Basic definitions, skeleton PRD, many open questions |
| **Validation** | Brief + interviews/quant data | Cross-referencing active, conflicts surfacing |
| **Ecosystem** | Multiple source types | Full contradiction detection, rich system map |

## Sources of Truth

| File | Role | Editable? |
|---|---|---|
| `01_Sources/*` | Raw inputs | No (read-only after capture) |
| `02_Work/EXTRACTIONS.md` | Raw claims from sources | Yes (via `/extract`) |
| `02_Work/INSIGHTS_GRAPH.md` | Atomic verified insights | Yes (via `/analyze`) |
| `02_Work/SYSTEM_MAP.md` | Product logic & decisions | Yes (via `/synthesis`) |
| `02_Work/CONFLICTS.md` | Contradiction log | Yes (via `/analyze` and `/synthesis`) |
| `02_Work/RESEARCH_BRIEF.md` | Stakeholder narrative summary | Yes (via `/analyze`) |
| `02_Work/MEMORY.md` | Session log & state tracker | Yes (via all skills, append-only) |
| `03_Outputs/_templates/*` | Static HTML templates (Template+JSON) | No (engine files) |
| `03_Outputs/_schemas/*` | JSON Schema definitions for output data | No (engine files) |
| `03_Outputs/PRD.html` | Product Requirements Document | Yes (via `/ship`) |
| `03_Outputs/PERSONAS.html` | User persona cards | Yes (via `/ship persona`) |
| `docs/CHANGELOG.md` | Internal change log | Yes (append-only) |
| `docs/FRAMEWORK.md` | Methodology reference | Reference only |

## Folder Structure

```
├── .claude/skills/
│   ├── kickoff/SKILL.md       /kickoff — project setup wizard
│   ├── extract/SKILL.md      /extract — read sources, extract raw claims
│   ├── analyze/SKILL.md       /analyze — process extractions into insights
│   ├── synthesis/SKILL.md     /synthesis — resolve conflicts
│   ├── ship/SKILL.md          /ship — generate deliverables (incl. persona)
│   ├── visualize/SKILL.md    /visualize — generate diagrams
│   ├── reset/SKILL.md        /reset — reset generated layers
│   ├── seed/SKILL.md         /seed — generate synthetic sources
│   └── status/SKILL.md       /status — work layer dashboard
├── 01_Sources/                Raw inputs (read-only, organized by milestone/category)
│   ├── _SOURCE_TEMPLATE.md   Metadata template for markdown sources
│   ├── _CONTEXT_TEMPLATE.md  Metadata template for non-markdown files
│   └── _README.md            Onboarding guide for users
├── 02_Work/                   Knowledge base (agent-managed, do not edit manually)
│   ├── EXTRACTIONS.md          Raw claims from sources (input for /analyze)
│   ├── INSIGHTS_GRAPH.md      [IG-XX] atomic insights
│   ├── SYSTEM_MAP.md          Product architecture decisions
│   ├── CONFLICTS.md           [CF-XX] contradiction log
│   ├── MEMORY.md              Session log & state tracker
│   └── _README.md            Layer rules for users
├── 03_Outputs/                Deliverables (agent-managed, do not edit manually)
│   ├── _templates/            Static HTML templates (Template+JSON architecture)
│   │   ├── _base.css          Shared CSS (Inter font, A4 page system, badges, print)
│   │   ├── _base.js           Shared JS (JSON loader, section renderers, ref-link converter)
│   │   ├── prd.html           PRD template
│   │   ├── report.html        Report template
│   │   ├── presentation.html  Reveal.js presentation template
│   │   ├── persona.html       Persona cards template
│   │   └── status.html        Dashboard template
│   ├── _schemas/              JSON Schema definitions for output data
│   │   ├── base.schema.json   Shared definitions (meta, sections, refs)
│   │   ├── prd.schema.json    PRD data schema
│   │   ├── report.schema.json Report data schema
│   │   ├── persona.schema.json Persona data schema
│   │   └── status.schema.json Status dashboard data schema
│   ├── PRD.html               Product Requirements Document (template + embedded JSON)
│   ├── PERSONAS.html          User persona cards (template + embedded JSON)
│   └── _README.md            Layer rules for users
├── docs/
│   ├── BACKLOG.md             Future work proposals
│   ├── CHANGELOG.md           Internal change log (PD-Spec development)
│   ├── FRAMEWORK.md           Full methodology documentation
│   └── PD_BUILD_NOTES.md     PD-Build architecture & design notes
├── CLAUDE.md                  This file
└── README.md                  Project overview
```

## Session Protocol

At the start of every session (new conversation), the agent must:

1. **Read `02_Work/MEMORY.md`** — understand the last known state, recent actions, and current snapshot.
2. **Integrity check** — compare the MEMORY snapshot against the actual state of `02_Work/` files. Look for:
   - Insights, conflicts, or system map entries not logged in MEMORY (possible manual edits).
   - Unexpected files in `02_Work/` or `03_Outputs/` (user may have added files directly).
   - Any discrepancies are reported to the user before proceeding.
3. **Resume context** — use MEMORY to continue where the last session left off, without requiring the user to re-explain.

After every skill execution, the agent appends an entry to `02_Work/MEMORY.md` with: request, actions, result, and a state snapshot. **Timestamp format must be ISO: `YYYY-MM-DDTHH:MM`** (e.g., `2026-02-14T15:30`). No other formats.

## Current State

> Update this section as the project evolves.

- **Maturity:** Level 1 (Seed)
- **Last updated:** 2025-02-10
- **Status:** v3.0 — Renamed to PD-Spec (formerly ProductLM). Strategy layer of ProductDesign OS. 4-skill pipeline, project memory, propose-first workflows.
- **Insights count:** 0
- **Conflicts count:** 0
