# CLAUDE.md — AI Agent Protocol

## Project Context

- **Project:** ProductLM
- **Product:** A Product Knowledge OS — 3-layer architecture + Claude Code skills pipeline for turning research into traceable product decisions
- **Team:** Niklas Lundin
- **Started:** 2025-02-09

## The Truth Stack

This project follows the ProductLM 3-layer architecture. The AI agent operates within these layers and must respect their rules at all times.

```
01_Sources/  →  Raw input (read-only)
02_Work/     →  Knowledge base (insights, conflicts, system map)
03_Outputs/  →  Deliverables (derived from Work, never authored directly)
```

## Agent Mandates

### 1. No Hallucination
If a claim does not trace back to a file in `01_Sources/`, the insight **does not exist**. Never invent insights, user needs, or technical constraints. Every `[IG-XX]` entry must reference a real source file. When the agent detects an evidence gap, it must ask: *"No encuentro evidencia para X — ¿lo marcamos como asunción o sugiero cómo validarlo?"*

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

## Skills Pipeline

| Skill | Command | What it does |
|---|---|---|
| Analyze | `/analyze` | Scan sources, extract insights, detect conflicts |
| Synthesis | `/synthesis` | Resolve conflicts, update system map |
| Ship | `/ship` | Generate deliverables with traceability |

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
| `02_Work/INSIGHTS_GRAPH.md` | Atomic verified insights | Yes (via `/analyze`) |
| `02_Work/SYSTEM_MAP.md` | Product logic & decisions | Yes (via `/synthesis`) |
| `02_Work/CONFLICTS.md` | Contradiction log | Yes (via `/analyze` and `/synthesis`) |
| `03_Outputs/PRD.html` | Product Requirements Document | Yes (via `/ship`) |
| `CHANGELOG.md` | Change log | Yes (append-only) |
| `docs/FRAMEWORK.md` | Methodology reference | Reference only |

## Folder Structure

```
├── .claude/skills/
│   ├── analyze/SKILL.md       /analyze — ingest sources
│   ├── synthesis/SKILL.md     /synthesis — resolve conflicts
│   └── ship/SKILL.md          /ship — generate deliverables
├── 01_Sources/                Raw inputs (read-only, organized by milestone/category)
│   └── _SOURCE_TEMPLATE.md   Metadata template for new sources
├── 02_Work/                   Knowledge base
│   ├── INSIGHTS_GRAPH.md      [IG-XX] atomic insights
│   ├── SYSTEM_MAP.md          Product architecture decisions
│   └── CONFLICTS.md           [CF-XX] contradiction log
├── 03_Outputs/                Deliverables
│   └── PRD.html               Product Requirements Document
├── docs/
│   └── FRAMEWORK.md           Full methodology documentation
├── CLAUDE.md                  This file
├── CHANGELOG.md               Dated change log
└── README.md                  Project overview
```

## Current State

> Update this section as the project evolves.

- **Maturity:** Level 1 (Seed)
- **Last updated:** 2025-02-10
- **Status:** Architecture defined. README rewritten for architecture-first documentation. Skills pipeline operational.
- **Insights count:** 0
- **Conflicts count:** 0
