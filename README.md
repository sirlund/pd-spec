# PD-Spec

Turns messy research into traceable decisions. Built as a skill pipeline for Claude Code on a 3-layer architecture.

> The **Strategy & Intelligence layer** of [ProductDesign OS](https://product-os.design). Born from Product Design consulting, but the architecture is domain-agnostic — any discipline that turns research into decisions (UX, strategy, policy, engineering) can use the same pipeline.

## Why This Exists

AI tools are great at processing research and great at generating documents. But the workflow between those two steps is broken.

You ground your analysis in sources — interviews, data, benchmarks. Then you ask an AI to generate a deliverable. Three things go wrong every time:

1. **Lost traceability.** The grounding step connects claims to sources. The generation step loses that connection. The final report says "users want X" but nobody can trace it back to which interview said that.
2. **No memory across sessions.** Each conversation starts from zero. Yesterday's context doesn't exist today. You re-explain, copy-paste, or worse — start over.
3. **Silent contradiction resolution.** Source A says X. Source B says not-X. The AI picks one silently when writing the deliverable. Nobody catches it until a stakeholder asks "where did this come from?"

The result is always the same: scattered conversations, hallucinated claims sneaking into deliverables, and decisions that can't be traced back to evidence.

PD-Spec replaces that workflow with a single rule: **every claim in every deliverable must trace back to a real source.** If it can't, it doesn't exist.

| The chaos before | PD-Spec |
|---|---|
| Research grounded but not structured | `01_Sources/` + `/extract` + `/analyze` with explicit `[IG-XX]` refs |
| Scattered AI conversations | `02_Work/MEMORY.md` + session continuity |
| AI silently resolves contradictions | `CONFLICTS.md` + `/spec` with explicit user approval |
| Deliverables without traceability | `03_Outputs/` with clickable `[IG-XX]` links to STATUS dashboard |
| "Where was that decision made?" | `MEMORY.md` + integrity check at every session start |

## The Problem

Research-backed decisions rot. An interview says users want X, a technical doc says X is impossible, and six months later the PRD still claims X. Nobody catches the contradiction because the research lives in scattered docs, Notion pages, and someone's memory.

This isn't unique to Product Design. It happens wherever multiple sources of evidence must converge into coherent decisions — UX research, policy analysis, engineering trade-offs, competitive strategy. The pattern is always the same: evidence comes in, gets processed in someone's head (or scattered AI chats), and the output loses its connection to the input.

## Architecture

### The 3-Layer Stack

```
01_Sources/  →  Raw input. Read-only after capture. The ground truth.
02_Work/     →  Knowledge base. Insights, conflicts, strategic vision, proposals. Derived from sources.
03_Outputs/  →  Deliverables. Derived from Work. Never authored directly.
```

Information flows in one direction: Sources → Work → Outputs. This is the core invariant. Outputs never inform Work, Work never modifies Sources.

**Why 3 layers?** Two failure modes kill product work: (1) deliverables that drift from reality because nobody maintains traceability, and (2) "analysis paralysis" where raw data never crystallizes into decisions. The Work layer solves both — it's the mandatory waypoint between raw input and polished output.

### Layer Details

**Sources** (`01_Sources/`) contain raw, unprocessed input: interview transcripts, briefs, technical docs, quantitative data, images, PDFs, spreadsheets — any format. Once a source is captured, it is never modified. Sources are organized in subfolders by milestone or category (e.g., `2026-02-workshop-gerencia/`, `benchmark-inicial/`). Markdown files carry their own metadata; non-markdown files are described by a `_CONTEXT.md` in their folder.

**Work** (`02_Work/`) is the project's brain — **agent-managed, not user-edited**:
- `EXTRACTIONS.md` — Raw claims extracted from sources by `/extract`. Input for `/analyze`.
- `INSIGHTS_GRAPH.md` — Atomic insights processed from extractions, each with an `[IG-XX]` ID, a status (PENDING → VERIFIED/MERGED/INVALIDATED), and a source reference.
- `CONFLICTS.md` — Contradictions between insights. Two sources disagree? It gets logged here with a `[CF-XX]` ID and stays PENDING until explicitly resolved.
- `STRATEGIC_VISION.md` — Vision, strategy, design principles, operational domains. Every entry references the insights that justify it.
- `PROPOSALS.md` — Design proposals `[DP-XX]` organized by domain. Each grounded in verified insights.
- `RESEARCH_BRIEF.md` — Auto-generated narrative summary (executive summary, thematic grouping, timeline, actors, evidence gaps). Written by `/analyze`.
- `MEMORY.md` — Session log and state tracker. Written after every skill execution, read at session start to resume context and detect manual edits.

**Outputs** (`03_Outputs/`) are generated artifacts (PRD, benchmarks, strategy docs) — **agent-managed, not user-edited**. They are *derived*, never authored from scratch. If a section needs to change, you update the source layer and re-run the pipeline.

### The Skills Pipeline

Ten Claude Code skills form the pipeline:

```
/kickoff              →  Project setup — name, language (en/es), description
/extract [folder]     →  Read sources, convert non-markdown files, write raw claims to EXTRACTIONS.md
/analyze              →  Process extractions into insights, detect contradictions, auto-generate STATUS.html
/spec               →  Resolve conflicts, build strategic vision + design proposals
/ship [type]          →  Generate deliverables (9 output types — see below)
/audit                →  Quality gate — evaluate Work layer readiness before /ship
/visualize [target]   →  Generate Mermaid diagrams (strategic-vision, proposals, insights, conflicts, all)
/reset [scope]        →  Reset generated layers to template state (preserves sources)
/seed [domain]        →  Generate synthetic sources for testing and onboarding
```

The core pipeline is: `/extract` → `/analyze` (interactive + auto-dashboard) → optional `/spec` → `/ship`. Each skill reads from the layer below it and writes to its own layer. The pipeline is idempotent — running `/analyze` twice on the same sources won't duplicate insights.

| Skill | Reads | Writes |
|---|---|---|
| `/extract` | `01_Sources/*` | `02_Work/EXTRACTIONS.md`, `02_Work/MEMORY.md` |
| `/analyze` | `02_Work/EXTRACTIONS.md`, `01_Sources/*` | `02_Work/INSIGHTS_GRAPH.md`, `02_Work/CONFLICTS.md`, `02_Work/RESEARCH_BRIEF.md`, `03_Outputs/STATUS.html`, `02_Work/MEMORY.md` |
| `/spec` | `02_Work/CONFLICTS.md`, `02_Work/INSIGHTS_GRAPH.md` | `02_Work/STRATEGIC_VISION.md`, `02_Work/PROPOSALS.md`, `02_Work/CONFLICTS.md`, `02_Work/MEMORY.md` |
| `/ship` | `02_Work/STRATEGIC_VISION.md`, `02_Work/PROPOSALS.md`, `02_Work/INSIGHTS_GRAPH.md` | `03_Outputs/*`, `02_Work/MEMORY.md` |
| `/audit` | `02_Work/INSIGHTS_GRAPH.md`, `02_Work/STRATEGIC_VISION.md`, `02_Work/PROPOSALS.md`, `02_Work/CONFLICTS.md` | `02_Work/MEMORY.md` (report in conversation) |
| `/visualize` | `02_Work/*` | `03_Outputs/DIAGRAMS*.html`, `02_Work/MEMORY.md` |
| `/reset` | `02_Work/*`, `03_Outputs/*` | `02_Work/*` (templates), `03_Outputs/*` (clean) |
| `/seed` | — | `01_Sources/seed-*` (synthetic data) |

`/ship` supports 9 output types: `prd` (default), `presentation` (Reveal.js slides), `report` (A4 PDF-ready), `benchmark-ux`, `persona`, `journey-map`, `lean-canvas`, `user-stories`, `strategy`.

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
| **Ecosystem** | Multiple source types | Full contradiction detection, rich traceable strategic vision |

You don't configure the level — the system infers it from the number and diversity of sources.

## Boundaries

PD-Spec is the strategy layer — it turns research into decisions. It does not cross into implementation.

**Not a code generator.** It produces requirements, not React components or Flutter widgets. The output is a brief that tells developers *what* to build and *why*, never *how*.

**Not a design system library.** It may inform design tokens and component specs downstream (via [PD-Build](https://product-os.design)), but it does not generate CSS, Figma files, or visual mockups.

**Not a human replacement.** It synthesizes and cross-references, but it cannot conduct interviews, observe users, or feel the hesitation in someone's voice. The human runs the research. PD-Spec runs the paperwork.

**Not methodology-specific.** It doesn't force you into Double Diamond, Design Sprints, or Lean UX. The pipeline is methodology-agnostic — what you put in `01_Sources/` determines what comes out. Bring interview transcripts, analytics dumps, business OKRs, competitor audits — the system adapts to the evidence, not the other way around.

## Repo Structure

```
├── .claude/skills/
│   ├── kickoff/SKILL.md          /kickoff — project setup wizard
│   ├── extract/SKILL.md          /extract — read sources, extract raw claims
│   ├── analyze/SKILL.md          /analyze — process extractions into insights
│   ├── spec/SKILL.md             /spec — resolve conflicts, build product specification
│   ├── ship/SKILL.md             /ship — generate deliverables (9 output types)
│   ├── audit/SKILL.md            /audit — quality gate before /ship
│   ├── visualize/SKILL.md        /visualize — generate Mermaid diagrams
│   ├── reset/SKILL.md            /reset — reset generated layers
│   └── seed/SKILL.md             /seed — generate synthetic sources
├── 01_Sources/                    Raw inputs (immutable, any format)
│   ├── _SOURCE_TEMPLATE.md       Metadata template for markdown sources
│   ├── _CONTEXT_TEMPLATE.md      Metadata template for non-markdown files
│   └── _README.md                Onboarding guide
├── 02_Work/                       Agent-managed knowledge base
│   ├── EXTRACTIONS.md             Raw claims from sources (input for /analyze)
│   ├── INSIGHTS_GRAPH.md          [IG-XX] atomic insights
│   ├── STRATEGIC_VISION.md         Vision, strategy, principles, domains
│   ├── PROPOSALS.md               Design proposals [DP-XX]
│   ├── CONFLICTS.md               [CF-XX] contradiction log
│   ├── RESEARCH_BRIEF.md          Auto-generated narrative summary
│   ├── MEMORY.md                  Session log & state tracker
│   └── _README.md                Layer rules
├── 03_Outputs/                    Agent-managed deliverables
│   ├── _templates/                Static HTML templates (Template+JSON architecture)
│   ├── _schemas/                  JSON Schema definitions for output data
│   ├── PRD.html                   Product Requirements Document
│   ├── PERSONAS.html              User persona cards
│   ├── JOURNEY_MAP.html           User journey map
│   ├── LEAN_CANVAS.html           Lean Canvas (business model)
│   ├── USER_STORIES.html          JTBD user stories
│   └── _README.md                Layer rules
├── docs/
│   ├── BACKLOG.md                 Future work proposals
│   ├── CHANGELOG.md               Internal change log (PD-Spec development)
│   ├── FRAMEWORK.md               Full methodology reference
│   └── PD_BUILD_NOTES.md         PD-Build architecture & design notes
├── CLAUDE.md                      AI agent protocol
└── README.md                      This file
```

## Getting Started

### New project (recommended)

1. Click **"Use this template"** on GitHub → creates your own repo
2. Clone your new repo locally
3. One-time setup: `git config merge.ours.driver true`
4. Open in Claude Code, Cursor, or any AI coding tool
5. Run `/kickoff` to configure project name, language, and type
6. Add sources to `01_Sources/` (or run `/seed` for test data)
7. Run the pipeline: `/extract` → `/analyze` → `/spec` → `/ship`

### Receive engine updates

After creating from template, add pd-spec as upstream (shallow — no full history needed):

    git remote add upstream https://github.com/sirlund/pd-spec.git
    git fetch upstream --depth=1

When updates are available:

    git fetch upstream --depth=1
    git merge upstream/main

`.gitattributes` protects your project files (01_Sources/, 02_Work/, 03_Outputs/)
during merge — only engine files (skills, scripts, docs) update.

**Required setup:** `git config merge.ours.driver true` (one-time, per clone).
Without this, `.gitattributes` merge=ours is silently ignored and merges
may overwrite your project files.

Each layer has a `_README.md` explaining what it does and what you should (or shouldn't) touch. Start with `01_Sources/_README.md`.

See [docs/architecture/FRAMEWORK.md](docs/architecture/FRAMEWORK.md) for the full methodology reference.

## ProductDesign OS Ecosystem

PD-Spec is the intelligence layer of **ProductDesign OS (PD-OS)**, a framework that separates strategic decision-making from technical execution.

```
PD-Spec (this repo)                         PD-Build (in product repo)
Research → Insights → Strategic Vision →     Contract → Definitions → Drivers
01_Sources/ → 02_Work/ → 03_Outputs/        01_Contract/ → 02_Definitions/ → 03_Drivers/
```

**PD-Spec** is a standalone strategy repo (private, consultancy/discovery). It processes research and business objectives into a traceable knowledge base — insights, conflicts, strategic vision, proposals — and generates deliverables (PRDs, reports, presentations) with full `[IG-XX]` traceability.

**PD-Build** lives inside the product's repository (like Storybook). It consumes PD-Spec's output and transforms it into a **headless design system** — tool-agnostic definitions (tokens, component specs, patterns) that AI agents (Cursor, Claude Code) and tools (Figma, Storybook) use to produce visually coherent output.

```
02_Definitions/                         03_Drivers/
├── tokens.json    (W3C standard)       ├── .cursorrules   (AI agent context)
├── components.yaml (functional specs)  ├── css/variables.css
├── patterns.md    (composition rules)  ├── tailwind/config.js
└── ...                                 └── ...
```

### The Contract

PD-Spec connects to PD-Build through its output layer. The contract evolves with maturity:

- **Today:** PD-Build reads PD-Spec's Work layer directly (`STRATEGIC_VISION.md` + `PROPOSALS.md` + `INSIGHTS_GRAPH.md`) to extract design definitions.
- **Future:** PD-Spec produces `[US-XX]` user stories (JTBD framing with `[IG-XX]` refs) as a formal handoff format. Every definition in PD-Build traces back to a user story, which traces back to an insight, which traces back to a source.

### Two Modes

PD-Build operates at two fidelity levels from the same definitions:

| | Discovery | Production |
|---|---|---|
| **Purpose** | Prototype, explore, validate | Real features, PRs, production code |
| **Output** | Design definitions only | Definitions + stack-specific drivers |
| **Consumer** | Designer + AI agent prototyping | AI agent writing production code |
| **Needs stack context?** | No | Yes (framework, language, architecture) |

The definitions are the same. The difference is enforcement — discovery uses them as guidance, production uses them as law.

See [docs/PD_BUILD_NOTES.md](docs/PD_BUILD_NOTES.md) for the full PD-Build architecture design.

## License

[MIT](LICENSE)
