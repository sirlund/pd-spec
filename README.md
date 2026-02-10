# ProductLM

A **Product Knowledge OS** that turns messy research into traceable product decisions. Built as a Claude Code skill pipeline on a 3-layer architecture.

## The Problem

Product decisions rot. An interview says users want X, a technical doc says X is impossible, and six months later the PRD still claims X. Nobody catches the contradiction because the research lives in scattered docs, Notion pages, and someone's memory.

ProductLM enforces a single rule: **every claim in every deliverable must trace back to a real source**. If it can't, it doesn't exist.

## Architecture

### The 3-Layer Stack

```
01_Sources/  →  Raw input. Read-only after capture. The ground truth.
02_Work/     →  Knowledge base. Insights, conflicts, system map. Derived from sources.
03_Outputs/  →  Deliverables. Derived from Work. Never authored directly.
```

Information flows in one direction: Sources → Work → Outputs. This is the core invariant. Outputs never inform Work, Work never modifies Sources.

**Why 3 layers?** Two failure modes kill product work: (1) deliverables that drift from reality because nobody maintains traceability, and (2) "analysis paralysis" where raw data never crystallizes into decisions. The Work layer solves both — it's the mandatory waypoint between raw input and polished output.

### Layer Details

**Sources** (`01_Sources/`) contain raw, unprocessed input: interview transcripts, briefs, technical docs, quantitative data. Once a source is captured, it is never modified. This guarantees that the ground truth doesn't shift under you. Sources are organized in subfolders by milestone or category (e.g., `2026-02-workshop-gerencia/`, `benchmark-inicial/`, `entrevistas-operadores/`) so the folder name provides temporal and thematic context that individual files inherit.

**Work** (`02_Work/`) is where analysis happens:
- `INSIGHTS_GRAPH.md` — Atomic claims extracted from sources, each with an `[IG-XX]` ID, a status (PENDING → VERIFIED/MERGED/INVALIDATED), and a source reference.
- `CONFLICTS.md` — Contradictions between insights. Two sources disagree? It gets logged here with a `[CF-XX]` ID and stays PENDING until explicitly resolved.
- `SYSTEM_MAP.md` — Product architecture decisions. Every entry references the insights that justify it.

**Outputs** (`03_Outputs/`) are generated artifacts (PRD, benchmarks, strategy docs). They are *derived*, never authored from scratch. If a section needs to change, you update the Work layer and regenerate.

### The Skills Pipeline

Three Claude Code skills form the analysis pipeline:

```
/analyze    →  Scan sources, extract insights, detect contradictions
/synthesis  →  Resolve conflicts, update system map
/ship       →  Generate deliverables with full traceability
```

Each skill reads from the layer below it and writes to its own layer. The pipeline is idempotent — running `/analyze` twice on the same sources won't duplicate insights.

| Skill | Reads | Writes |
|---|---|---|
| `/analyze` | `01_Sources/*` | `02_Work/INSIGHTS_GRAPH.md`, `02_Work/CONFLICTS.md` |
| `/synthesis` | `02_Work/CONFLICTS.md`, `02_Work/INSIGHTS_GRAPH.md` | `02_Work/SYSTEM_MAP.md`, `02_Work/CONFLICTS.md` |
| `/ship` | `02_Work/SYSTEM_MAP.md`, `02_Work/INSIGHTS_GRAPH.md` | `03_Outputs/*` |

## Design Principles

### No Hallucination
Every `[IG-XX]` insight references a real source file. The agent cannot invent user needs, technical constraints, or business assumptions. If the source doesn't exist, the insight doesn't exist. When the agent detects an evidence gap, it asks: *"No encuentro evidencia para X — ¿lo marcamos como asunción o sugiero cómo validarlo?"*

### Transparency & Control
No black boxes. The agent **proposes before executing**. Every insight extraction, conflict resolution, or deliverable draft is presented for user approval before writing to files. The user has final veto over any change.

### Homer's Car Detector
Named after [the Simpsons episode](https://en.wikipedia.org/wiki/Oh_Brother,_Where_Art_Thou%3F_(The_Simpsons)) where Homer designs a car with every feature he wants and it's undrivable. If a feature, module, or design decision can't justify itself with `[IG-XX]` references, challenge its existence.

### Proactive Gap Detection
When the agent detects missing definitions, untested assumptions, or sparse source coverage, it suggests methodologies to fill the gap (interview scripts, synthetic users, benchmarks) — as open options, never impositions.

### Silence is Gold
Minimize cognitive load. No filler paragraphs, no restating the obvious, no decorative content. Every sentence in a deliverable must earn its place.

## Maturity Model

The system adapts behavior based on the project's knowledge density:

| Level | What you have | What the system does |
|---|---|---|
| **Seed** | Initial brief only | Basic definitions, skeleton PRD, surfaces open questions |
| **Validation** | Brief + interviews/data | Cross-referencing active, contradictions surfacing |
| **Ecosystem** | Multiple source types | Full contradiction detection, rich traceable system map |

You don't configure the level — the system infers it from the number and diversity of sources.

## Repo Structure

```
├── .claude/skills/
│   ├── analyze/SKILL.md       /analyze skill definition
│   ├── synthesis/SKILL.md     /synthesis skill definition
│   └── ship/SKILL.md          /ship skill definition
├── 01_Sources/                Raw inputs (immutable, organized by milestone/category)
│   └── _SOURCE_TEMPLATE.md   Metadata template for new sources
├── 02_Work/                   Knowledge base
│   ├── INSIGHTS_GRAPH.md      [IG-XX] atomic insights
│   ├── SYSTEM_MAP.md          Product architecture decisions
│   └── CONFLICTS.md           [CF-XX] contradiction log
├── 03_Outputs/                Generated deliverables
│   └── PRD.html               Product Requirements Document
├── docs/
│   └── FRAMEWORK.md           Full methodology reference
├── CLAUDE.md                  AI agent protocol
├── CHANGELOG.md               Dated change log
└── README.md                  This file
```

## Getting Started

```bash
# 1. Clone or use as GitHub template
git clone https://github.com/nlundin/ProductLM.git my-project
cd my-project

# 2. Fill in CLAUDE.md with your project context

# 3. Add sources to 01_Sources/ (use _SOURCE_TEMPLATE.md)

# 4. Run the pipeline
/analyze     # Extract insights
/synthesis   # Resolve conflicts
/ship        # Generate deliverables
```

See [docs/FRAMEWORK.md](docs/FRAMEWORK.md) for the full methodology reference.

## License

[MIT](LICENSE)
