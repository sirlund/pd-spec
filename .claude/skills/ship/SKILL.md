---
name: ship
description: Generate Markdown deliverables in 03_Outputs/ from verified insights. Types: prd, presentation, report, benchmark-ux, persona, journey-map, lean-canvas, user-stories, audit, strategy.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
argument-hint: "[prd|presentation|report|benchmark-ux|persona|journey-map|lean-canvas|user-stories|audit|strategy]"
---

# /ship — Deliverable Generation (Markdown-First)

## What this skill does

Generates or updates Markdown deliverables in `03_Outputs/` with full traceability to verified insights. Default target is `PRD.md`.

## Architecture: Markdown-First

Each output is a **structured Markdown file** that:
1. Renders natively in the Live Research App (via `parsers/markdown.js` + `MarkdownView`)
2. Is human-editable in any text editor
3. Renders in GitHub, VS Code, and any Markdown viewer
4. Has `[IG-XX]` / `[CF-XX]` refs auto-converted to clickable badges by the app

The agent writes Markdown directly — no JSON schemas, no HTML templates, no inlining step.

### Output format convention

Every deliverable starts with a metadata header:

```markdown
# Document Title — ProjectName

> vX.Y | YYYY-MM-DD | N insights, M conflicts | Language

## Section Heading
...content with [IG-XX] refs...
```

The `> vX.Y | ...` blockquote line serves as version metadata. The app renders it as a styled subtitle.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found, report them before proceeding.

**Language & Project Info** — Read `output_language` and `project_name` from `PROJECT.md`. If missing, default to `en` / "Untitled Project" and suggest `/kickoff`. Write all deliverable content in that language. System IDs (`[IG-XX]`, `[CF-XX]`, `VERIFIED`, `PENDING`) stay in English.

### Phase 1: Load & Validate

1. **Determine target** — Default: `PRD.md`. If the user passes an argument, generate that type:
   - `prd` → `PRD.md` — Product Requirements Document (default)
   - `presentation` → `PRESENTATION.md` — Slide deck (sections separated by `---`)
   - `report` → `REPORT.md` — Stakeholder report
   - `benchmark-ux` → `BENCHMARK_UX.md` — Inter-industry design referents (NOT competitive analysis)
   - `persona` → `PERSONAS.md` — User persona cards
   - `journey-map` → `JOURNEY_MAP.md` — User journey map
   - `lean-canvas` → `LEAN_CANVAS.md` — Business model synthesis
   - `user-stories` → `USER_STORIES.md` — JTBD user stories (bridge to PD-Build)
   - `audit` / `strategy` → `AUDIT.md` / `STRATEGY.md` — Specialized documents

2. **Load knowledge base** — Read:
   - `02_Work/SYSTEM_MAP.md` for product architecture and decisions
   - `02_Work/INSIGHTS_GRAPH.md` for verified insights to reference

3. **Validate readiness** — Check Work layer has sufficient verified content:
   - Are there VERIFIED insights to reference?
   - Is SYSTEM_MAP populated with traceable decisions?
   - Are there unresolved PENDING conflicts affecting the deliverable?
   - **If insufficient**, report gaps and suggest `/analyze` or `/synthesis` first.

### Phase 2: Propose (User Approval)

4. **Present deliverable outline** — Before generating, show:
   - Document type and target file
   - Proposed section structure (headings list)
   - Key insights to reference (by ID)
   - Any gaps where sections lack sufficient insight backing
   - **Wait for user approval before generating.**

### Phase 3: Generate (After Approval) — Write Markdown

5. **Write the Markdown file** to `03_Outputs/TYPE.md`. Follow these structural conventions:

#### General conventions (all types)

- **Version header** — First line after `# Title`: `> vX.Y | YYYY-MM-DD | snapshot summary`
  - First generation: `v1.0`. Incremental: `v1.1`, `v1.2`. Major rewrite: `v2.0`.
- **Traceability** — Every section must contain `[IG-XX]` references inline. If a section has no insight backing, add a `> **[GAP]** — explanation` blockquote.
- **Insight summary table** — Include a `## Insights Summary` section with a table listing key insights used.
- **No redundancy** — Each fact appears once, in the most relevant section.
- **Emoji policy** — Only functional: ✓ ✗ (matrices), ⚠️ (warnings), 🔴🟠🟢 (severity), ▲▼ (trend). No decorative emojis.

#### PRD structure (`/ship prd`)

```markdown
# Product Requirements Document — ProjectName

> v1.0 | 2026-02-23 | 24 insights, 4 conflicts pending

## Executive Summary
...overview with key [IG-XX] refs...

## Problem Statement
...core problem with evidence [IG-01], [IG-02]...

## Value Proposition
...what the product offers, grounded in [IG-XX]...

## User Profiles
| Profile | Key Need | Evidence |
|---|---|---|
| Dispatcher | Real-time control | [IG-09] |

## System Architecture
### Module Name
**Status:** Ready | Blocked
...description with [IG-XX] refs...
**Implications:**
- Implication text [IG-XX]

## Design Principles
1. **Principle Name** — description [IG-XX]

## Business Model
...pricing, metrics, channels [IG-XX]...

## Constraints & Risks
...limitations with [IG-XX] and [CF-XX] refs...

## Open Questions
- Question text [CF-XX] or [GAP]

## Insights Summary
| ID | Concept | Status | Convergence |
|---|---|---|---|
| [IG-SYNTH-01] | Geometry Gap | VERIFIED | 15/54 |
```

#### Persona structure (`/ship persona`)

```markdown
# User Personas — ProjectName

> v1.0 | 2026-02-23 | 5 personas, 20 insight refs

## P-01: PersonaName — Role Title

> "Representative quote from source" — [IG-XX]

**Goals:**
- Goal text [IG-XX]

**Frustrations:**
- Frustration text [IG-XX]

**Context:**
- Work environment detail [IG-XX]

**Behaviors:**
- Current workflow behavior [IG-XX]

---

## P-02: NextPersona — Role Title
...
```

Generate **3–5 personas** grounded in user-need insights. Each persona backed by **at least 3 verified insights**. Use `[GAP]` markers where evidence is insufficient.

#### Journey Map structure (`/ship journey-map`)

```markdown
# User Journey Map — ProjectName

> v1.0 | 2026-02-23 | Persona: P-01 PersonaName

## Phase 1: PhaseName

**User Actions:** description [IG-XX]
**Touchpoints:** description [IG-XX]
**Emotions:** 🟢 Positive / 🟠 Neutral / 🔴 Negative — description [IG-XX]
**Pain Points:** description [IG-XX]
**Opportunities:** description [IG-XX]

---

## Phase 2: PhaseName
...
```

#### Lean Canvas structure (`/ship lean-canvas`)

```markdown
# Lean Canvas — ProjectName

> v1.0 | 2026-02-23 | 12 insight refs

| Block | Content | Evidence |
|---|---|---|
| **Problem** | Top 3 problems | [IG-XX], [IG-XX] |
| **Solution** | Top 3 features | [IG-XX] |
| **Key Metrics** | Success measures | [IG-XX] |
| **Unique Value Prop** | One sentence | [IG-XX] |
| **Unfair Advantage** | Moat | [IG-XX] |
| **Channels** | Distribution | [GAP] |
| **Customer Segments** | Target users | [IG-XX] |
| **Cost Structure** | Main costs | [IG-XX] |
| **Revenue Streams** | Pricing model | [IG-XX] |

### Problem (detail)
1. Problem statement [IG-XX]
...expanded with narrative per block...
```

#### User Stories structure (`/ship user-stories`)

```markdown
# User Stories — ProjectName

> v1.0 | 2026-02-23 | X stories across Y modules

## Module: ModuleName

### US-01 — Story Title
**Persona:** P-01 PersonaName
**JTBD:**
- **When** triggering context [IG-XX]
- **I want to** user action
- **So I can** expected benefit

**Acceptance Criteria:**
- [ ] Criterion text [IG-XX]
- [ ] Criterion text [IG-XX]

**Priority:** High | Medium | Low
**Refs:** [IG-XX], [IG-XX]

---

### US-02 — Story Title
...
```

Priority logic: **High** = 3+ converging insights or business-critical. **Medium** = 1–2 insights. **Low** = single insight or gap-filling.

#### Presentation structure (`/ship presentation`)

```markdown
# Presentation — ProjectName

> v1.0 | 2026-02-23 | N slides

---

## Slide Title

Content — one idea per slide, minimal text.

Key insight: [IG-XX]

<!-- Speaker notes: detailed context for presenter -->

---

## Next Slide Title
...
```

Slides separated by `---`. Speaker notes in HTML comments. For Reveal.js rendering, use future `/export html` command.

#### Report structure (`/ship report`)

Standard Markdown with clear section hierarchy. Optimized for stakeholders who don't use the pipeline. Include a Table of Contents at the top:

```markdown
# Report — ProjectName

> v1.0 | 2026-02-23

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Key Findings](#key-findings)
...

## Executive Summary
...
```

#### Benchmark UX structure (`/ship benchmark-ux`)

```markdown
# Benchmark UX — ProjectName

> v1.0 | 2026-02-23 | N referents across M categories

## Category: CategoryName

### ReferentName — Industry
**Factor X:** What makes this relevant (1 sentence)
**Pattern:** How this applies to ProjectName
**Design Principle:** [IG-XX]

...8–15 referents total...
```

**Anti-hallucination:** Every referent must be a real product verifiable via web search. If unsure, skip it.

6. **Document versioning** — If the target file already exists:
   - Read it to extract current version from the `> vX.Y | ...` line
   - Increment: minor for updates (`v1.1`), major for rewrites (`v2.0`)
   - The agent may add a changelog section at the bottom for multi-version documents

7. **Ensure traceability** — Every section must contain `[IG-XX]` inline refs. Sections without refs must use `> **[GAP]** — explanation` blockquote. Include an Insights Summary table.

8. **Cross-referencing** — Write `[IG-XX]` and `[CF-XX]` as plain text. The Live Research App's markdown parser (`parsers/markdown.js`) automatically converts them to clickable badges with `data-ref` attributes. No special formatting needed.

### Phase 4: Post-Generation

9. **Write to project memory** — Append to `02_Work/MEMORY.md`:
   ```markdown
   ## [YYYY-MM-DDTHH:MM] /ship TYPE
   - **Request:** [what the user asked]
   - **Actions:** [deliverable generated/updated, sections written]
   - **Result:** [file created, insights referenced count, gaps marked]
   - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
   ```

10. **Update session checkpoint** — Overwrite `02_Work/_temp/SESSION_CHECKPOINT.md`.

## Migration from Template+JSON

Previous versions generated HTML files with embedded JSON data (`<script id="pd-data">`). Existing `.html` outputs in project branches remain valid — the Live Research App serves them via the Outputs FileBrowser. New `/ship` runs generate `.md` files alongside any existing `.html` files.

The `_templates/` and `_schemas/` directories are preserved for a future `/export` command (BL-56) that will convert `.md` → self-contained HTML/DOCX/PPTX.
