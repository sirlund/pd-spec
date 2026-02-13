# Backlog — Future Work

Documented proposals for future features. Each entry includes rationale, architecture fit, and implementation notes.

---

## ~~[BL-01] `/ship design-system`~~ — REMOVED

**Status:** Removed
**Reason:** Crosses the PD-Spec boundary into implementation. Design tokens, color palettes, typography specs, and component specs are PD-Build's responsibility. See README.md § Boundaries.

---

## [BL-02] `/audit` — Strategic Quality Gate

**Status:** Proposed
**Priority:** Medium-High
**Proposed in:** v2.4 session (2025-02-10)
**Inspired by:** voltagent/ux-researcher skill

### What it does

A dedicated skill that audits the Work layer for strategic quality before shipping. Acts as a quality gate between `/synthesis` and `/ship` — evaluating whether the knowledge base makes sense from a user, market, and product strategy perspective, not just from a data integrity perspective.

### What it evaluates

1. **User validation depth** — Are user needs backed by real research (interviews, observations, data) or are they assumptions disguised as insights? Flags `[IG-XX]` entries categorized as `user-need` that trace to briefs or internal docs rather than actual user research.
2. **Strategic blind spots** — Are there product areas in SYSTEM_MAP.md with no source coverage? Modules with only technical insights and zero user-need backing?
3. **Assumption density** — What percentage of insights are VERIFIED vs PENDING? If most are PENDING, the knowledge base isn't mature enough to ship confidently.
4. **Prioritization check** — Do the system map decisions reflect user impact or only technical feasibility? Surfaces modules that are technically justified but have no user-need evidence.
5. **Source diversity** — Is the knowledge base built on diverse source types (interviews + data + technical docs) or heavily skewed toward one type?

### What it produces

This skill does NOT generate a deliverable in `03_Outputs/`. Its output is:

1. **Audit report to the user** (conversation output) — summarizing findings, risk areas, and recommendations.
2. **Open Questions** added to `02_Work/SYSTEM_MAP.md` — strategic gaps surfaced during the audit.
3. **Suggested sources** — methodologies to fill detected gaps (interview scripts, benchmarks, user tests), presented as options.
4. **Entry in MEMORY.md** — logging the audit and its findings.

### Architecture fit

- **Reads:** `02_Work/INSIGHTS_GRAPH.md`, `02_Work/SYSTEM_MAP.md`, `02_Work/CONFLICTS.md`
- **Writes:** `02_Work/SYSTEM_MAP.md` (open questions only), `02_Work/MEMORY.md`
- **Does NOT write to:** `03_Outputs/` (it's not a deliverable generator)
- Follows Phase 0 (integrity check) → Phase 1 (load & analyze) → Phase 2 (present findings) → Phase 3 (write approved changes)

### Why a new skill (not expansion of existing)

| Existing skill | What it does | Why `/audit` is different |
|---|---|---|
| `/analyze` | Ingests sources → produces insights | Looks at sources. `/audit` looks at the Work layer itself. |
| `/synthesis` | Resolves conflicts → updates system map | Reactive (processes what's there). `/audit` is proactive (evaluates what's missing). |
| `/ship` | Generates deliverables | Produces outputs. `/audit` produces feedback that loops back into the system. |

The key distinction: `/audit` is the only skill whose output feeds BACK into `02_Work/` as strategic input, rather than flowing forward to `03_Outputs/`. It creates a feedback loop in the pipeline:

```
/analyze → /synthesis → /audit → (fill gaps) → /analyze → /synthesis → /ship
```

### What already partially covers this

The current pipeline has some overlap:
- `/analyze` step 8: "Detect evidence gaps" — catches missing source coverage
- `/ship` step 3: "Validate readiness" — checks for VERIFIED insights and pending conflicts
- Mandate #4 (Proactive Gap Detection): agent should suggest methodologies

These cover the basic case. `/audit` is warranted if real-world usage reveals that strategic gaps consistently slip through these existing checks.

### Trigger condition

Implement `/audit` when:
- A project reaches Maturity Level 2 (Validation) and the existing gap detection feels insufficient
- Users report that `/ship` produces outputs that are technically traceable but strategically hollow
- The system map has modules that "pass" traceability checks but fail the "does this actually matter to users?" test

### Implementation checklist

- [ ] Create `.claude/skills/audit/SKILL.md`
- [ ] Define audit criteria (validation depth, blind spots, assumption density, prioritization, source diversity)
- [ ] Define output format for conversation report
- [ ] Define how open questions get added to SYSTEM_MAP.md
- [ ] Update CLAUDE.md skills pipeline table (4 → 5 skills)
- [ ] Update README skills section
- [ ] Update FRAMEWORK.md pipeline documentation
- [ ] Add CHANGELOG entry
- [ ] Test on a real project at Validation maturity level

---

## [BL-03] UX & Strategy Artifact Catalog — New `/ship` Types

**Status:** Proposed
**Priority:** High
**Proposed in:** v2.4 session (2025-02-10), expanded v3.0 session (2025-02-13)
**Inspired by:** aitmpl/ux-researcher-designer skill, Gemini v2.5/v3.0 artifact catalog discussion

### What it does

Expands `/ship` with 6 new output types — industry-standard UX and strategy deliverables that help designers and non-designers visualize insights and make decisions. All follow the same pattern: read from `02_Work/`, write HTML to `03_Outputs/`, trace everything to `[IG-XX]`.

### The new types

| Type | Output file | What it visualizes | Primary insight categories |
|---|---|---|---|
| `persona` | `PERSONAS.html` | User archetypes from multiple user-need insights | `user-need` |
| `journey-map` | `JOURNEY_MAP.html` | User flow with pain points, touchpoints, emotional states | `user-need`, `constraint` |
| `service-blueprint` | `SERVICE_BLUEPRINT.html` | Frontstage/backstage/support processes | `user-need`, `technical`, `business` |
| `lean-canvas` | `LEAN_CANVAS.html` | Business model synthesis (problem, solution, metrics, channels) | `business`, `user-need` |
| `success-metrics` | `SUCCESS_METRICS.html` | KPIs traceable to insights (HEART/Pirate Metrics framework) | `business`, `user-need` |
| `user-stories` | `USER_STORIES.html` | JTBD-framed stories — the handoff contract for PD-Build | all categories |

**Existing types remain unchanged:** `prd`, `presentation`, `report`, `benchmark`, `audit`, `strategy`.

### Why these belong in PD-Spec

All 6 are **visualization and decision tools**, not implementation artifacts. They sit firmly in the strategy layer:

- **Personas and journey maps** help stakeholders see *who* the product serves and *where* it fails.
- **Service blueprint** maps the system from the user's perspective — frontstage actions map to modules in SYSTEM_MAP.md.
- **Lean canvas and success metrics** translate insights into business language for non-designer stakeholders.
- **User stories (JTBD)** are the **format contract** between PD-Spec and PD-Build. "When [situation], I want to [motivation], so I can [outcome]" with `[IG-XX]` refs is the bridge between strategic decisions and implementation. Without this, PD-Build has to interpret the PRD — which reintroduces the traceability gap.

### How it differs from raw insights

Insights in `INSIGHTS_GRAPH.md` are atomic claims. These deliverables **combine and contextualize** multiple insights into formats the industry already knows how to read. A persona combines 5 user-need insights into a coherent archetype. A journey map sequences them temporally. User stories translate them into developer-consumable specs. The data is the same — the lens changes.

### No Hallucination tension

These deliverables involve **synthesis** — combining data points into narratives and frameworks. The rule is simple: every claim traces to `[IG-XX]`. Everything without a ref is presentation scaffolding (persona names, narrative connectors, emotional arc labels). No special tag needed — if it doesn't have `[IG-XX]`, it's not an evidence claim.

```html
<!-- This is a claim — traced -->
<div class="attribute">
  <span class="tag">IG-07, IG-12</span>
  <strong>Pain point:</strong> Loses 20 min/day switching between disconnected tools.
</div>

<!-- This is scaffolding — no ref, no claim -->
<p class="persona-name">"María" — composite archetype from 3 interview subjects</p>
```

### User stories as PD-Build contract

The `user-stories` type has a special role: it produces the **handoff document** that PD-Build consumes. Each story follows JTBD framing with traceability:

```
**[US-01]** When [situation from IG-XX], I want to [motivation from IG-YY], so I can [outcome from IG-ZZ].
Acceptance: [derived from SYSTEM_MAP module constraints]
Refs: [IG-XX], [IG-YY], [IG-ZZ]
Priority: [derived from conflict resolution in CF-XX]
```

This replaces the informal `DESIGN_BRIEF.md` mentioned in the PD-OS ecosystem section with a structured, traceable format. Every user story traces back to insights; every acceptance criterion traces to the system map.

### Prerequisites

Each type has minimum insight thresholds to avoid generating hollow deliverables:

| Type | Minimum requirements |
|---|---|
| `persona` | 3+ `user-need` insights from different sources, 1+ VERIFIED |
| `journey-map` | 3+ `user-need` insights with temporal/sequential context |
| `service-blueprint` | Populated SYSTEM_MAP with modules + `user-need` and `technical` insights |
| `lean-canvas` | 2+ `business` insights + 2+ `user-need` insights |
| `success-metrics` | 2+ `business` insights with measurable claims |
| `user-stories` | Populated SYSTEM_MAP + resolved conflicts for target modules |

If thresholds aren't met, `/ship [type]` reports what's missing and suggests next steps.

### Architecture fit

- **Reads:** `02_Work/INSIGHTS_GRAPH.md` + `02_Work/SYSTEM_MAP.md` (+ `CONFLICTS.md` for user-stories priority)
- **Writes:** `03_Outputs/[TYPE].html` + `02_Work/MEMORY.md`
- **Same Phase 0–3 pattern** as all existing `/ship` types
- NOT separate skills — they're output types of `/ship`, consistent with `prd`, `report`, etc.

### Implementation checklist

- [ ] Add 6 new types to `/ship` SKILL.md with HTML templates and traceability rules
- [ ] Define persona template (archetype, demographics, goals, pain points — all traced)
- [ ] Define journey map template (stages, touchpoints, emotional curve — all traced)
- [ ] Define service blueprint template (frontstage/backstage/support — mapped to SYSTEM_MAP modules)
- [ ] Define lean canvas template (9 blocks, each traced to insight categories)
- [ ] Define success metrics template (HEART or Pirate Metrics, each KPI traced)
- [ ] Define user stories template (JTBD frame, acceptance criteria from SYSTEM_MAP, priority from CONFLICTS)
- [ ] Add minimum insight thresholds per type
- [ ] Update `/ship` argument-hint in SKILL.md
- [ ] Update CLAUDE.md skills pipeline table
- [ ] Update README `/ship` types list
- [ ] Update FRAMEWORK.md
- [ ] Add CHANGELOG entry
- [ ] Test each type with real project data

---

## [BL-04] Human Calibration Layer — "Add Context" + Field Notes

**Status:** Proposed
**Priority:** Medium-High
**Proposed in:** v3.0 session (2025-02-13)
**Inspired by:** Gemini's `/calibrate` concept (data-informed, human-led)

### The gap

The pipeline captures what sources say (`/analyze`) and how the user resolves contradictions (`/synthesis`). But there's no lightweight mechanism for the designer to inject **qualitative context that isn't in any source** — professional intuition, political dynamics observed in a room, body language during interviews, institutional knowledge.

Currently the only way is to write a full markdown source file, which adds friction and discourages quick observations.

### Solution: Two changes, no new skills

#### A. "Add context" button in `/status` dashboard

Extend insight cards in `03_Outputs/STATUS.html` from binary (Approve / Reject) to ternary:

```
[Approve]  [Reject]  [Add context]
```

"Add context" opens a textarea. The designer writes qualitative notes:
- "I was in the room — the CEO won't approve this regardless of data."
- "This insight is correct but the ops team will resist. Need change management."
- "The interviewee said this but their tone suggested the opposite."

These notes travel into the generated `/synthesis` prompt alongside approve/reject decisions:

```
## Insights with context
IG-05: Approved with context — "CEO body language contradicted this during workshop. Proceed with caution."
IG-12: Approved with context — "Ops team will resist. Need stakeholder alignment before shipping."

Approve insights: IG-01, IG-03, IG-07
Reject insights: IG-09
```

`/synthesis` reads this context and factors it into conflict resolution and system map decisions. The context gets recorded in `CONFLICTS.md` resolution notes or `MEMORY.md`, maintaining traceability.

#### B. Field notes source convention

Establish `01_Sources/field-notes/` as a lightweight source folder for designer observations:

```markdown
---
Type: field-note
Date: 2025-02-13
Context: Workshop with operations team
---

The team says they're open to automation but three people visibly tensed up when we showed the workflow replacement demo. The resistance is real but unspoken.
```

These are first-class sources. `/analyze` extracts insights from them like any other source. The difference is they're quick to write (3-5 lines) and explicitly subjective — they capture what the designer *observed*, not what a document *states*.

A `field-note` source type would generate insights categorized as `observation` (alongside `user-need`, `technical`, `business`, `constraint`) to distinguish designer observations from documentary evidence.

### Architecture fit

- **Part A** is a change to `/status` SKILL.md (HTML template + JS) and `/synthesis` SKILL.md (prompt parsing). No new files in `02_Work/`.
- **Part B** is a convention, not code. Add guidance to `01_Sources/_README.md` and optionally a `_FIELD_NOTE_TEMPLATE.md`.
- Both changes respect the existing pipeline. No new skills, no new Work layer files, no new layers.

### Why not a separate `/calibrate` skill

Gemini proposed `/calibrate` as a dedicated skill with `DECISION_LOG.md`. This duplicates what `/synthesis` already does — present findings, ask the human, record the decision. The gap isn't a missing skill; it's a missing *input channel* for qualitative context. A textarea in the dashboard and a lightweight source convention solve it without adding pipeline complexity.

### Implementation checklist

- [ ] Add "Add context" button + textarea to insight cards in `/status` SKILL.md
- [ ] Update prompt generator JS to include context notes in `/synthesis` prompt
- [ ] Update `/synthesis` SKILL.md to parse and use context notes from the prompt
- [ ] Add `field-note` guidance to `01_Sources/_README.md`
- [ ] Create `01_Sources/_FIELD_NOTE_TEMPLATE.md`
- [ ] Consider adding `observation` as a 5th insight category in `/analyze`
- [ ] Update CLAUDE.md if insight categories expand
- [ ] Add CHANGELOG entry
- [ ] Test with real qualitative observations
