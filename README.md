# PD-Spec

The **Strategy & Intelligence layer** of [ProductDesign OS](https://product-os.design). Turns messy research into traceable product decisions. Built as a skill pipeline for Claude Code and Cursor on a 3-layer architecture.

> Formerly **ProductLM** — started as "I'll build my own NotebookLM" and evolved into the specification engine for a full design operative system.

## The Problem

Product decisions rot. An interview says users want X, a technical doc says X is impossible, and six months later the PRD still claims X. Nobody catches the contradiction because the research lives in scattered docs, Notion pages, and someone's memory.

PD-Spec enforces a single rule: **every claim in every deliverable must trace back to a real source**. If it can't, it doesn't exist.

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

**Sources** (`01_Sources/`) contain raw, unprocessed input: interview transcripts, briefs, technical docs, quantitative data, images, PDFs, spreadsheets — any format. Once a source is captured, it is never modified. Sources are organized in subfolders by milestone or category (e.g., `2026-02-workshop-gerencia/`, `benchmark-inicial/`). Markdown files carry their own metadata; non-markdown files are described by a `_CONTEXT.md` in their folder.

**Work** (`02_Work/`) is the project's brain — **agent-managed, not user-edited**:
- `INSIGHTS_GRAPH.md` — Atomic claims extracted from sources, each with an `[IG-XX]` ID, a status (PENDING → VERIFIED/MERGED/INVALIDATED), and a source reference.
- `CONFLICTS.md` — Contradictions between insights. Two sources disagree? It gets logged here with a `[CF-XX]` ID and stays PENDING until explicitly resolved.
- `SYSTEM_MAP.md` — Product architecture decisions. Every entry references the insights that justify it.
- `MEMORY.md` — Session log and state tracker. Written after every skill execution, read at session start to resume context and detect manual edits.

**Outputs** (`03_Outputs/`) are generated artifacts (PRD, benchmarks, strategy docs) — **agent-managed, not user-edited**. They are *derived*, never authored from scratch. If a section needs to change, you update the source layer and re-run the pipeline.

### The Skills Pipeline

Four Claude Code skills form the pipeline:

```
/analyze              →  Scan sources, extract insights, detect contradictions
/synthesis            →  Resolve conflicts, update system map
/ship [type]          →  Generate deliverables (prd, presentation, report, benchmark, audit, strategy)
/visualize [target]   →  Generate Mermaid diagrams (system-map, insights, conflicts, all)
```

Each skill reads from the layer below it and writes to its own layer. The pipeline is idempotent — running `/analyze` twice on the same sources won't duplicate insights.

| Skill | Reads | Writes |
|---|---|---|
| `/analyze` | `01_Sources/*` | `02_Work/INSIGHTS_GRAPH.md`, `02_Work/CONFLICTS.md`, `02_Work/MEMORY.md` |
| `/synthesis` | `02_Work/CONFLICTS.md`, `02_Work/INSIGHTS_GRAPH.md` | `02_Work/SYSTEM_MAP.md`, `02_Work/CONFLICTS.md`, `02_Work/MEMORY.md` |
| `/ship` | `02_Work/SYSTEM_MAP.md`, `02_Work/INSIGHTS_GRAPH.md` | `03_Outputs/*`, `02_Work/MEMORY.md` |
| `/visualize` | `02_Work/*` | `03_Outputs/DIAGRAMS*.html`, `02_Work/MEMORY.md` |

`/ship` supports multiple output types: `prd` (default), `presentation` (Reveal.js slides), `report` (A4 PDF-ready), `benchmark`, `audit`, `strategy`.

Every skill starts with a **Phase 0: integrity check** — reading MEMORY.md to detect manual edits since the last session. Every skill ends by appending its actions to MEMORY.md.

## Design Principles

### No Hallucination
Every `[IG-XX]` insight references a real source file. The agent cannot invent user needs, technical constraints, or business assumptions. If the source doesn't exist, the insight doesn't exist. When the agent detects an evidence gap, it asks: *"I can't find evidence for X — should we mark it as an assumption or should I suggest how to validate it?"*

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
│   ├── analyze/SKILL.md          /analyze skill definition
│   ├── synthesis/SKILL.md        /synthesis skill definition
│   ├── ship/SKILL.md             /ship skill definition
│   └── visualize/SKILL.md       /visualize skill definition
├── 01_Sources/                   Raw inputs (immutable, any format)
│   ├── _SOURCE_TEMPLATE.md      Metadata template for markdown sources
│   ├── _CONTEXT_TEMPLATE.md     Metadata template for non-markdown files
│   └── _README.md               Onboarding guide
├── 02_Work/                      Agent-managed knowledge base
│   ├── INSIGHTS_GRAPH.md         [IG-XX] atomic insights
│   ├── SYSTEM_MAP.md             Product architecture decisions
│   ├── CONFLICTS.md              [CF-XX] contradiction log
│   ├── MEMORY.md                 Session log & state tracker
│   └── _README.md               Layer rules
├── 03_Outputs/                   Agent-managed deliverables
│   ├── PRD.html                  Product Requirements Document
│   └── _README.md               Layer rules
├── docs/
│   └── FRAMEWORK.md              Full methodology reference
├── CLAUDE.md                     AI agent protocol
├── CHANGELOG.md                  Dated change log
├── BACKLOG.md                    Future work proposals
└── README.md                     This file
```

## Getting Started

```bash
# 1. Clone or use as GitHub template
git clone https://github.com/sirlund/pd-spec.git my-project
cd my-project

# 2. Fill in CLAUDE.md with your project context (name, product, team, date)

# 3. Add sources to 01_Sources/
#    Create a subfolder per milestone or category
#    For markdown files: copy _SOURCE_TEMPLATE.md, fill metadata, paste content
#    For other files (images, PDFs, .xlsx): add a _CONTEXT.md describing them
#    See 01_Sources/_README.md for details

# 4. Open in Claude Code or Cursor, then run the pipeline
/analyze                # Extract insights
/synthesis              # Resolve conflicts
/ship                   # Generate PRD
/ship presentation      # Generate slide deck
/ship report            # Generate PDF-ready report
/visualize              # Generate system map diagram
```

Each layer has a `_README.md` explaining what it does and what you should (or shouldn't) touch. Start with `01_Sources/_README.md`.

See [docs/FRAMEWORK.md](docs/FRAMEWORK.md) for the full methodology reference.

## ProductDesign OS Ecosystem

PD-Spec is the intelligence layer of **ProductDesign OS (PD-OS)**, a framework that separates strategic decision-making from technical execution.

```
PD-Spec (this repo)                    PD-Build (in product repo)
Research → Decisions → Brief    →      Brief → Kernel (.toon) → .cursorrules → PR
01_Sources/ → 02_Work/ → 03_Outputs/   01_Sources/ → 02_Kernel/ → 03_Drivers/ → 04_Dist/
```

**PD-Spec** is a standalone strategy repo (private, consultancy/discovery). It processes research and business objectives to produce a Product Contract — the `DESIGN_BRIEF.md`.

**PD-Build** lives inside the product's repository (like Storybook). It consumes the brief and transforms it into a tool-agnostic Kernel (`.toon` files) that AI agents (Cursor, Claude Code) use to write code that respects the product's design logic.

The two systems connect through a **format contract**. The `DESIGN_BRIEF.md` must contain:
- `[INTENT]` — Business objective
- `[LOGIC_RULES]` — Validation and behavior rules
- `[DATA_EVIDENCE]` — Reference to PD-Spec insight IDs (`[IG-XX]`)
- `[USER_FLOW]` — Expected logical state sequence

See [product-os.design](https://product-os.design) for the full PD-OS specification.

## License

[MIT](LICENSE)
