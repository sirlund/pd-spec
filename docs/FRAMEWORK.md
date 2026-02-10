# ProductLM Framework

## Overview

ProductLM is a **Product Knowledge OS** for Product Designers and Researchers. It provides a structured methodology for consolidating diverse sources (interviews, briefs, technical docs, quantitative data) into a traceable knowledge base that drives product decisions and deliverables.

The framework enforces a 3-layer architecture (Sources → Work → Outputs) where every deliverable traces back to verified insights from real sources.

## Core Principles

1. **No Hallucination** — If it's not in `01_Sources/`, the insight doesn't exist. Every claim must trace to a source file.
2. **Homer's Car Detector** — Flag unnecessary complexity and feature creep. If a module or decision can't justify itself with insight references, it shouldn't exist.
3. **Silence is Gold** — Minimize cognitive load. Outputs should be concise, scannable, and free of filler.
4. **Sources Are Read-Only** — Files in `01_Sources/` capture raw input and are never modified after initial capture.
5. **Log Everything** — All changes are logged in `CHANGELOG.md`. Every significant decision gets a dated entry.

## The 3-Layer Architecture

### Layer 1: Sources (`01_Sources/`)

Raw inputs: interviews, briefs, technical documents, workshop notes, quantitative data. These files are **append-only** — once captured, they are never edited.

**Rules:**
- Use `_SOURCE_TEMPLATE.md` for consistent metadata (type, date, participants, context).
- Never modify a source file after creation.
- Store any format — markdown, screenshots, PDFs — alongside their structured summaries.

**Organization by milestone/category:**

Sources are grouped in subfolders that provide temporal or thematic context. The folder name becomes inherited context for all files inside it.

```
01_Sources/
├── 2026-02-workshop-gerencia/
│   ├── notas-sesion.md
│   └── foto-whiteboard.png
├── benchmark-inicial/
│   ├── competidores.md
│   └── datos-mercado.md
├── entrevistas-operadores/
│   ├── entrevista-01.md
│   └── entrevista-02.md
└── _SOURCE_TEMPLATE.md
```

Naming conventions:
- **Date-prefixed** for time-bound events: `YYYY-MM-description/` (e.g., `2026-02-workshop-gerencia/`)
- **Category-based** for thematic groups: `type-description/` (e.g., `benchmark-inicial/`, `entrevistas-operadores/`)

The agent validates coherence between the folder context and its file contents. A benchmark file inside an interviews folder is flagged as an organizational inconsistency.

**Handling non-markdown files:**

Not all sources are markdown. Images, PDFs, spreadsheets, .txt, and .docx files can't carry internal metadata. For these, add a `_CONTEXT.md` in the folder:

```markdown
# Context: Workshop Gerencia Feb 2026

- **Date:** 2026-02-15
- **Type:** workshop
- **Participants:** [names]

## Files

| File | Format | Description |
|---|---|---|
| foto-whiteboard.png | image | Diagram of proposed user flow |
| datos-asistencia.xlsx | spreadsheet | Attendance and role data |
| grabacion-resumen.txt | text | Transcribed summary of recording |
```

The `/analyze` skill reads `_CONTEXT.md` to understand files it can't parse directly. Markdown files in the same folder still carry their own metadata via `_SOURCE_TEMPLATE.md` — no conflict.

### Layer 2: Work (`02_Work/`)

The project's brain. This is where raw sources become structured knowledge. **This layer is agent-managed — users should not edit files here directly.**

**Key files:**
- `INSIGHTS_GRAPH.md` — Atomic insights with `[IG-XX]` IDs, statuses, and source references.
- `SYSTEM_MAP.md` — Product architecture decisions traceable to insights.
- `CONFLICTS.md` — Contradictions between insights awaiting resolution.
- `MEMORY.md` — Session log and state tracker (see [Project Memory](#project-memory) below).

**Rules:**
- Every insight must reference its source file.
- Every system map entry must reference at least one `[IG-XX]` insight.
- Conflicts must be resolved through `/synthesis` before they can inform the system map.
- Manual edits are detected via MEMORY.md integrity checks at session start.

### Layer 3: Outputs (`03_Outputs/`)

Client-facing and stakeholder-facing deliverables, generated from the Work layer.

**Key files:**
- `PRD.html` — Product Requirements Document with full insight traceability.
- `PRESENTATION.html` — Reveal.js slide deck with key insights and decisions.
- `REPORT.html` — A4 formatted report for stakeholders (PDF-ready).
- `DIAGRAMS.html` — Mermaid diagrams of system map, insights, and conflicts.
- Additional deliverables (benchmarks, audits, strategies) generated via `/ship`.

**Rules:**
- Outputs are **derived**, never authored from scratch. **Users should not edit files here directly.**
- Every section must reference `[IG-XX]` insight IDs.
- If an output needs changes, update the source layer, re-run the pipeline, and regenerate.

## The Skills Pipeline

ProductLM uses four Claude Code skills:

### `/analyze` — Source Ingestion
Scans `01_Sources/` files, extracts atomic claims, assigns `[IG-XX]` IDs, and detects contradictions against existing insights.

**Input:** Source files in `01_Sources/`
**Output:** New entries in `INSIGHTS_GRAPH.md` and `CONFLICTS.md`

### `/synthesis` — Conflict Resolution
Presents pending conflicts to the user, captures resolution decisions, updates insight statuses, and refreshes the system map.

**Input:** Pending conflicts in `CONFLICTS.md`
**Output:** Resolved conflicts, updated `INSIGHTS_GRAPH.md` and `SYSTEM_MAP.md`

### `/ship` — Deliverable Generation
Generates HTML deliverables in `03_Outputs/` with full traceability. Uses the A4 CSS system (Inter font, print-ready layout).

**Input:** `SYSTEM_MAP.md` + `INSIGHTS_GRAPH.md`
**Output:** HTML deliverables in `03_Outputs/`
**Types:** `prd` (default), `presentation` (Reveal.js slides), `report` (A4 PDF-ready), `benchmark`, `audit`, `strategy`

### `/visualize` — Diagram Generation
Transforms Work layer files into interactive Mermaid diagrams rendered as HTML.

**Input:** `SYSTEM_MAP.md`, `INSIGHTS_GRAPH.md`, `CONFLICTS.md`
**Output:** `03_Outputs/DIAGRAMS.html`
**Targets:** `system-map` (default), `insights`, `conflicts`, `all`

## Maturity Levels

The system adapts its behavior based on the project's knowledge maturity:

### Level 1: Seed
- **Sources:** Only initial requirements or a brief.
- **Behavior:** Basic product definitions. Limited cross-referencing.
- **Outputs:** Skeleton PRD with open questions.

### Level 2: Validation
- **Sources:** Brief + interviews or quantitative data.
- **Behavior:** Cross-insight analysis active. Contradictions begin surfacing.
- **Outputs:** PRD with verified insights. Conflict log populated.

### Level 3: Ecosystem
- **Sources:** Multiple technical, stakeholder, and market sources.
- **Behavior:** Full contradiction detection. System map is rich and traceable.
- **Outputs:** Comprehensive PRD, benchmarks, strategy docs — all fully sourced.

## Project Memory

`02_Work/MEMORY.md` serves two purposes:

### 1. Session Continuity

Every skill appends an entry after execution:

```markdown
## [2026-02-10T14:30] /analyze
- **Request:** "Analiza las entrevistas del workshop de febrero"
- **Actions:** Scanned 3 files in `01_Sources/2026-02-workshop-gerencia/`
- **Result:** Added [IG-01]–[IG-05], detected [CF-01]
- **Snapshot:** 5 insights (3 PENDING, 2 VERIFIED) · 1 conflict PENDING · 0 outputs
```

At the start of a new session, the agent reads MEMORY.md to understand where the project left off — no need for the user to re-explain context.

### 2. Manual Edit Detection

The Snapshot line records the expected state of the Work layer after each action. At session start, the agent compares the snapshot against the actual file contents:

- **Extra insights** not logged in MEMORY → someone added entries manually.
- **Modified entries** with different status or content → someone edited directly.
- **Unexpected files** in `02_Work/` or `03_Outputs/` → user may have dropped files in the wrong layer.

When discrepancies are found, the agent reports them to the user and asks how to proceed before running any skill.

## Agent Behavior Protocols

The AI agent operates as a strategic copilot, not an autonomous executor. These protocols govern how the agent interacts with the user and the knowledge base.

### Propose Before Executing

The agent never writes directly to Work or Output files without presenting a summary first. The workflow for each skill:

1. Agent analyzes inputs and prepares a draft of proposed changes.
2. Agent presents the summary to the user (new insights found, conflicts detected, proposed resolutions).
3. User approves, modifies, or vetoes.
4. Only after approval does the agent write to files.

### Evidence Gap Handling

When the agent cannot find source evidence for a claim or decision, it must surface the gap explicitly:

> *"I can't find evidence for X — should we mark it as an assumption or should I suggest how to validate it?"*

Options the agent can suggest:
- Mark as assumption (tagged `ASSUMPTION` in INSIGHTS_GRAPH).
- Suggest a validation method (interview script, benchmark, synthetic user test).
- Flag as an open question in SYSTEM_MAP.

### Proactive Suggestions

The agent monitors for knowledge gaps and suggests methodologies to fill them:
- Missing user research → suggest interview scripts or user testing approaches.
- No competitive data → suggest benchmark methodology.
- Untested technical assumptions → suggest spike or prototype.

These are always presented as **options**, never executed without explicit user consent.

### Source Organization Validation

During `/analyze`, the agent validates:
- Does the file's metadata (type, date, context) match the folder it's in?
- Is a benchmark sitting inside an interviews folder?
- Does the file date conflict with the folder date prefix?

Inconsistencies are reported to the user with a suggested correction. The agent never moves or reclassifies files without explicit approval.

### Uncertainty Management

When the agent encounters ambiguity — conflicting signals, incomplete data, or multiple valid interpretations — it:

1. Identifies the specific ambiguity.
2. Presents clear options with reasoning (e.g., "Option A aligns with business insight [IG-03]", "Option B aligns with user research [IG-07]").
3. Asks a targeted question to resolve the ambiguity.
4. Never silently picks one interpretation over another.

## Insight Format

```markdown
### [IG-01] Insight title
- **Source:** `01_Sources/filename.md`
- **Status:** VERIFIED | PENDING | MERGED | INVALIDATED
- **Category:** user-need | technical | business | constraint
- **Detail:** One atomic fact or claim.
```

## Conflict Format

```markdown
### [CF-01] Conflict title
- **Status:** PENDING | RESOLVED
- **Tension:** [IG-XX] says A, but [IG-YY] says B
- **Sources:** `source_a.md` vs `source_b.md`
- **Resolution:** [filled during /synthesis]
- **Action:** [what changed in INSIGHTS_GRAPH or SYSTEM_MAP]
```
