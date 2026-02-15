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

---

## [BL-05] Source Diversity Gap Detection — `/analyze` Enhancement

**Status:** Proposed
**Priority:** Medium
**Proposed in:** v3.0 session (2025-02-13)

### The gap

Mandate #4 (Proactive Gap Detection) currently flags missing evidence for specific claims: "I can't find evidence for X." But it doesn't evaluate **source diversity** — whether the knowledge base is built on a healthy mix of source types or dangerously skewed toward one.

A PRD that says "we need high accessibility" without an accessibility audit source is a claim without evidence. A system map built entirely on internal briefs without user research is an echo chamber. These are gaps that `/analyze` should surface.

### What changes

Enhance `/analyze` Phase 2 (step 8, "Detect evidence gaps") to evaluate source type coverage:

| Source type | What it provides | Gap signal |
|---|---|---|
| User research (interviews, observations, usability tests) | User needs, pain points, behaviors | "No user research sources — user-need insights may be assumptions" |
| Business data (OKRs, metrics, unit economics) | Business constraints, success criteria | "No business sources — prioritization lacks financial grounding" |
| Technical docs (architecture, API specs, constraints) | Technical feasibility, limitations | "No technical sources — feasibility of modules is unvalidated" |
| Brand / design guidelines | Visual identity, tone, accessibility targets | "No brand/design sources — visual decisions lack foundation" |
| Competitive analysis (benchmarks, audits) | Market context, differentiation | "No competitive sources — positioning is based on internal assumptions" |
| Accessibility data (audits, demographics, WCAG targets) | Inclusive design constraints | "No accessibility sources — compliance claims are unsupported" |

The agent reports this as a "Source Diversity" section in the `/analyze` summary, alongside insights and conflicts.

### Why this is standalone value (not just for PD-Build)

Every row in the table above improves deliverables for **human** consumers:
- A PRD without business source backing is weaker
- A strategy doc without competitive analysis is blind
- An audit without accessibility data is incomplete

This makes PD-Spec outputs more robust regardless of whether PD-Build exists. The fact that diverse sources also produce better design definitions downstream is a bonus, not the justification.

### Architecture fit

- Change to `/analyze` SKILL.md only (Phase 2, step 8)
- No new files, skills, or layers
- Report format: section in the `/analyze` summary output + suggested source types to fill gaps
- Respects Mandate #4 framing: suggestions as open options, never impositions

### Implementation checklist

- [ ] Extend `/analyze` step 8 with source type diversity evaluation
- [ ] Define source type categories and gap signals
- [ ] Add "Source Diversity" section to `/analyze` Phase 4 report
- [ ] Suggest specific source types to fill detected gaps (with methodology suggestions)
- [ ] Add CHANGELOG entry
- [ ] Test with projects that have skewed source coverage

---

## [BL-06] Design Implications in SYSTEM_MAP — `/synthesis` Enhancement

**Status:** Implemented (verified in TIMining QA test, 2026-02-14)
**Priority:** Medium
**Proposed in:** v3.0 session (2025-02-13)

### The gap

SYSTEM_MAP modules currently have: name, status, blocker, insight references, and open questions. But they don't express **what they imply for design and implementation**. A module called "Onboarding Flow" that references `[IG-05] Users are 50+` and `[IG-12] Users distrust automation` doesn't explicitly say "this module requires large touch targets, high contrast, and progressive disclosure."

That implication lives in the designer's head. It should live in the system map.

### What changes

Enhance `/synthesis` Phase 4 (system map update) to derive design implications from verified insights:

```markdown
### Module: Onboarding Flow
**Status:** Ready
**Refs:** [IG-05], [IG-12], [IG-18]
**Design implications:**
- High accessibility requirements — users 50+ [IG-05]
- Trust-building UI patterns needed — users distrust automation [IG-12]
- Progressive disclosure — avoid cognitive overload during first use [IG-18]
**Open questions:**
- [ ] What is the acceptable onboarding completion time?
```

Design implications are **derived from insights**, not invented. Each one references the insight it comes from. If the insight is invalidated, the implication goes with it.

### Why this is standalone value

A PRD that says "Module: Onboarding Flow — refs: [IG-05], [IG-12]" forces the reader to look up each insight and mentally derive what they mean for design. A PRD that says "Design implications: high accessibility, trust-building patterns, progressive disclosure" is immediately actionable.

This makes every downstream deliverable (PRD, report, strategy, presentation) more useful for human stakeholders — PMs, devs, and designers who read these docs.

### Architecture fit

- Change to `/synthesis` SKILL.md only (Phase 4, system map update)
- Change to `/ship` SKILL.md (include design implications in deliverables)
- No new files or layers — implications live as a new field within existing SYSTEM_MAP module entries
- Derived from verified insights only — maintains traceability

### Implementation checklist

- [ ] Add "Design implications" field to module template in `/synthesis` SKILL.md
- [ ] Define derivation rules: how insight categories map to implication types
- [ ] Update `/ship` to include design implications in PRD module sections
- [ ] Ensure implications reference their source insights
- [ ] Add CHANGELOG entry
- [x] Test with a project that has verified insights across multiple categories — TIMining QA test

---

## [BL-07] `/extract` — Dedicated Source Extraction Skill

**Status:** Proposed
**Priority:** High
**Proposed in:** TIMining QA session (2026-02-14)
**Related QA:** QA-04a, QA-04b, QA-09, QA-12, QA-13

### The gap

`/analyze` currently does two unrelated jobs: (1) reading heterogeneous file types (md, docx, pdf, pptx, png, jpg) and converting them to text, and (2) extracting insights, cross-referencing, and detecting conflicts. The extraction step is slow, error-prone, and blocks the analytical work.

### What it does

A dedicated skill that reads ALL files in `01_Sources/`, converts each to normalized text, and writes the result to `_CONTEXT.md` files per folder. After `/extract`, every source is represented as readable text that `/analyze` can consume directly.

### File type handling

| Type | Method | Notes |
|---|---|---|
| `.md` | Already readable | No conversion needed |
| `.docx` | `textutil -convert txt` (macOS) | Fallback: `pandoc` |
| `.pdf` | Read tool with `pages` param | 20 pages per call, iterate for larger |
| `.pptx` | `unzip -p file.pptx ppt/slides/slide*.xml` then strip XML tags | No external dependencies |
| `.png/.jpg/.jpeg/.webp/.heic` | Read tool (multimodal) | ALL images read, no filtering |
| `.xlsx/.csv` | Read tool or `textutil` | |
| `.mp4/.mov` | Not processable | Suggest manual transcription |

### Key principle

If it's in `01_Sources/`, it gets read. No prioritization, no filtering. Workshop whiteboard photos are as important as markdown transcripts.

### Output format

Enriches existing `_CONTEXT.md` files following `_CONTEXT_TEMPLATE.md` format. For each file:

```markdown
### filename.png
- **Format:** PNG image
- **Extracted:** Whiteboard with 3 columns of sticky notes. Column 1 "KEEP":
  datos real-time, alertas WhatsApp. Column 2 "STOP": 3D viewer, reportes PDF.
  Column 3 "START": copiloto IA, recomendaciones proactivas.
```

### Pipeline change

```
Before: /kickoff → /analyze → /status → /synthesis → /ship
After:  /kickoff → /extract → /analyze → /synthesis → /ship
```

`/extract` runs once per source batch. Re-run when new sources are added.

### Architecture fit

- **Reads:** `01_Sources/*` (all files)
- **Writes:** `01_Sources/*/_CONTEXT.md` (enriched, not created from scratch)
- **Does NOT write to:** `02_Work/` or `03_Outputs/`
- Respects `01_Sources/` read-only mandate: file content unchanged, only `_CONTEXT.md` metadata added

### Implementation checklist

- [ ] Create `.claude/skills/extract/SKILL.md`
- [ ] Define extraction rules per file type
- [ ] Ensure `_CONTEXT_TEMPLATE.md` format compliance (QA-10)
- [ ] Prohibit insight derivation in _CONTEXT.md (QA-11)
- [ ] Add parallelization hints for independent file reads (QA-08)
- [ ] Remove file reading logic from `/analyze` SKILL.md
- [ ] Update CLAUDE.md skills pipeline table
- [ ] Update README
- [ ] Add CHANGELOG entry

---

## [BL-08] Merge `/status` Into `/analyze` and `/synthesis` Output

**Status:** Proposed
**Priority:** High
**Proposed in:** TIMining QA session (2026-02-14)
**Related QA:** QA-21, QA-27, QA-28, QA-29

### The gap

`/status` is a separate skill that reads the Work layer and generates `STATUS.html`. But it's always run immediately after `/analyze` or `/synthesis` — it's never useful on its own. Running it separately adds a step, wastes time (QA-27: 4-9 minutes), and the user has to remember to invoke it.

### What changes

1. **`/analyze` generates STATUS.html as its final step** — after writing insights and conflicts, it generates the dashboard automatically. The user sees results immediately.
2. **`/synthesis` regenerates STATUS.html as its final step** — after updating statuses and system map, the dashboard reflects the new state.
3. **`/status` is removed as a standalone skill** — or kept as an alias that just regenerates the dashboard without rerunning analysis.

### Performance: data/template separation (QA-27 option C)

To avoid slow HTML generation:
1. `/analyze` and `/synthesis` write a `STATUS_DATA.json` file with structured insight/conflict/module data.
2. `STATUS.html` is a **static template** that reads `STATUS_DATA.json` via `fetch()` or inline `<script>`.
3. The template is written once and never regenerated. Only the JSON changes.

This reduces generation from writing ~500 lines of HTML to writing ~100 lines of JSON.

### Architecture fit

- **STATUS.html** becomes a static file in `03_Outputs/` (template, not regenerated)
- **STATUS_DATA.json** is the dynamic file written by `/analyze` and `/synthesis`
- Eliminates `/status` as a separate skill entry point
- Simplifies pipeline: `/extract` → `/analyze` (includes dashboard) → `/synthesis` (updates dashboard) → `/ship`

### Implementation checklist

- [ ] Design STATUS_DATA.json schema (insights, conflicts, modules, gaps, metadata)
- [ ] Create static STATUS.html template that reads JSON
- [ ] Add JSON generation as final step of `/analyze` SKILL.md
- [ ] Add JSON regeneration as final step of `/synthesis` SKILL.md
- [ ] Remove or deprecate `/status` SKILL.md
- [ ] Update CLAUDE.md skills pipeline table
- [ ] Update README
- [ ] Add CHANGELOG entry

---

## [BL-09] QA Fixes — Skill Hardening (29 findings)

**Status:** Proposed
**Priority:** High
**Proposed in:** TIMining QA session (2026-02-14)
**Tracking:** Full findings listed in Appendix A

### What this covers

Bug fixes and improvements identified during real-world testing with TIMining data (mining software, 63 source files, 110 insights, 6 conflicts). Grouped by skill:

#### `/analyze` fixes
- **QA-03, QA-20:** Strengthen cross-reference — add tension examples, look for user-need vs technical/business contradictions
- **QA-05:** Require key quote per insight (1-2 sentences from source)
- **QA-08:** Add parallelization hints for independent reads
- **QA-14:** Reinforce atomic claims — "a list of 10 needs is 10 insights, not 1"
- **QA-15:** Add granularity guidance — when to split vs consolidate
- **QA-16:** Explicit format: `PENDING` not `**PENDING**`
- **QA-17:** Formalize `## Section` headers as official grouping mechanism
- **QA-19:** Every conflict side must reference `[IG-XX]`

#### `/status` fixes (apply to template if BL-08 merges status)
- **QA-25:** Show source refs in insight detail
- **QA-28:** Single-level approve/reject (no confusing group+individual hierarchy)
- **QA-29:** Group summaries must synthesize implications, not list keywords

#### `/synthesis` fixes
- **QA-24:** Validate argument IDs exist in INSIGHTS_GRAPH.md/CONFLICTS.md before executing

#### `/kickoff` + CLAUDE.md fixes
- **QA-06:** Eliminate redundancy between Project Context and Project Settings
- **QA-07:** Template should use `[Set by /kickoff]` for Team field

#### General
- **QA-02:** Reinforce timestamp format in MEMORY.md writes
- **QA-10:** _CONTEXT.md must follow _CONTEXT_TEMPLATE.md format
- **QA-11:** Prohibit insight derivation in _CONTEXT.md (layer boundary)

### Implementation checklist

- [ ] Apply all /analyze fixes to SKILL.md
- [ ] Apply /status fixes to SKILL.md or static template
- [ ] Apply /synthesis validation fix
- [ ] Apply /kickoff + CLAUDE.md template fixes
- [ ] Apply general fixes across skills
- [ ] Regression test with TIMining data on clean branch

---

## [BL-10] Insight Temporal Tag — `current` vs `aspirational`

**Status:** Proposed
**Priority:** Medium
**Proposed in:** TIMining QA session (2026-02-14)

### The gap

All insights share the same status lifecycle (PENDING → VERIFIED) but don't distinguish between **what exists today** and **what stakeholders want to build**. In the TIMining test, insights from operations interviews describe the current product (IG-01 to IG-39), while workshop insights describe future aspirations (IG-40+, IG-76-79 "Skynet" concept). Both are VERIFIED but mean very different things for product decisions.

A PRD that mixes "users currently lose the mining plan every shift" with "we want the system to auto-run simulations and send orders to machines" without distinction is misleading.

### What changes

Add an optional temporal tag to insights in `/analyze`:

```markdown
### [IG-42] (user-need) PENDING `current`
Plan minero se pierde en todos los turnos, sin sistema no se detecta cuándo ni dónde.

### [IG-78] (user-need) PENDING `aspirational`
Concepto "Skynet": sistema analiza mina, corre N simulaciones, envía órdenes a personas/máquinas.
```

- **`current`** — describes existing product behavior, user pain, or measured reality
- **`aspirational`** — describes desired future state, vision, or proposed solution

### Downstream impact

- `/status` dashboard can filter/group by temporal tag
- `/ship` PRD can separate "Current State" from "Target State" sections
- `/synthesis` can flag conflicts between current constraints and aspirational goals (e.g., "users want Skynet but industry has 1+ year sales cycles")

### Architecture fit

- Change to `/analyze` SKILL.md (add tag during extraction)
- Change to `/status` and `/ship` (consume tag for grouping/filtering)
- No new files or layers
- Tag is optional — backward compatible with existing insights

### Implementation checklist

- [ ] Add temporal tag to insight format in `/analyze` SKILL.md
- [ ] Define tagging criteria with examples
- [ ] Update `/status` to filter/group by tag
- [ ] Update `/ship` PRD template to separate current vs aspirational
- [ ] Update FRAMEWORK.md
- [ ] Add CHANGELOG entry

---

## [BL-11] Convergence Tracking + Source Authority

**Status:** Proposed
**Priority:** High
**Proposed in:** TIMining QA session (2026-02-14)

### The gap

All insights are treated as equal regardless of how many sources corroborate them or who said it. A pain point mentioned by 1 person in passing has the same weight as one reported by 4 out of 5 interviewees. Similarly, an observation from an end-user, a CEO, and a tech lead carry identical weight even though their authority on different topics varies.

This matters for prioritization: in quantitative research, if 3+ of 5 users report the same pain, that's a strong signal. A single mention is a hypothesis. The pipeline currently has no way to express this.

### What changes

Add two optional fields to insights in `/analyze`:

```markdown
### [IG-42] (user-need) PENDING
El plan minero se pierde en todos los turnos.
Refs: transcript.md, reu_coo.md, entrevista_carolina.png
Convergence: 60% (3/5 relevant sources)
Voices: end-user (2), domain-expert (1)
```

#### Convergence

Convergence is a **ratio**, not an absolute number. `3/5 = 60%` normalizes signal strength across different set sizes — whether it's 3/5 controlled interviews or 9/15 mixed sources.

`Convergence: X% (N/M relevant sources)` — percentage of **relevant** sources that corroborate this claim. The denominator M is "sources where this topic could appear", not "total files in the project." A workshop transcript about UX is a relevant source for a UX insight; a pricing spreadsheet is not.

`/analyze` detects when the same pain/need/fact appears in multiple sources and aggregates into one insight with the convergence ratio.

- **≥ 60%:** Strong signal — clear pattern across sources
- **30-59%:** Moderate signal — corroborated but not dominant
- **< 30%:** Weak signal — single-source or low corroboration, treat as hypothesis until validated

#### Source Authority (Voices)

`Voices: role (count), role (count)` — who said it, categorized by their authority domain:

| Voice type | Authority on | Examples |
|---|---|---|
| `end-user` | Pain points, workflows, usability | Operators, site managers, daily users |
| `domain-expert` | Technical feasibility, architecture | CTOs, engineers, tech leads |
| `business-stakeholder` | Strategy, pricing, market | CEOs, VPs, product managers |
| `external` | Market context, competitive landscape | Consultants, analysts, benchmarks |

An insight about UX pain carries more weight when voiced by end-users. A pricing insight carries more weight from business-stakeholders. The mismatch (CEO opining on UX, user opining on pricing) isn't invalid but signals lower authority.

### Downstream impact

- **`/status` dashboard:** Sort/filter insights by convergence %. High-convergence insights highlighted.
- **`/synthesis`:** Convergence ratio as factor in conflict resolution — "60% of users say X, 1 CEO says Y" is useful context.
- **`/ship` PRD:** Priority sections can reference convergence ("reported by 60% of relevant sources" vs "single stakeholder mention").
- **Prevents premature prioritization:** Low-convergence insights (<30%) flagged as hypotheses needing validation before driving product decisions.

### Architecture fit

- Change to `/analyze` SKILL.md (add convergence/voices during extraction)
- Change to `/status` and `/ship` (consume fields for display/sorting)
- No new files or layers
- Fields are optional — backward compatible with existing insights

### Implementation checklist

- [ ] Add convergence detection to `/analyze` SKILL.md cross-reference step
- [ ] Add voice/role tagging to `/analyze` SKILL.md extraction
- [ ] Define role taxonomy (end-user, domain-expert, business-stakeholder, external)
- [ ] Update insight format spec in SKILL.md
- [ ] Update `/status` template to display convergence/voices
- [ ] Update `/ship` to reference convergence in priority justification
- [ ] Update FRAMEWORK.md
- [ ] Add CHANGELOG entry

---

## [BL-12] Research Dashboard — STATUS.html Redesign (v0)

**Status:** Proposed
**Priority:** High
**Proposed in:** TIMining QA session (2026-02-14)
**Related:** BL-08 (merge /status into /analyze), BL-11 (convergence), QA-27 (performance)
**Supersedes:** BL-08 (this is the full vision; BL-08 was the initial idea)

### The gap

STATUS.html is currently a flat inventory — lists of insight IDs grouped by technical category (business/technical/user-need) that tell the user nothing without opening INSIGHTS_GRAPH.md. It's a state report, not a working tool. The user needs a **research dashboard** that tells the story, enables decisions, and serves as the bridge between analysis and output generation.

### Vision

STATUS.html becomes the **internal master output** — the workbench where the team:
1. Understands what the research found (narrative, not IDs)
2. Makes decisions (approve/reject insights, resolve conflicts, confirm convergences)
3. Generates prompts for downstream skills (/synthesis, /ship)
4. Tracks progress (what's been processed, what's missing)

Future: mini webapp with dynamic capabilities (live updates, API backend, persistent decisions).

### Architecture: Static template + JSON data

```
03_Outputs/
├── status/
│   ├── index.html          ← Template (never regenerated)
│   ├── style.css            ← Styles (fixed)
│   ├── app.js               ← Logic: reads JSON, renders modules, handles actions
│   └── data.json            ← The ONLY thing the agent writes
```

The template is **content-agnostic**. It knows how to render all module types. The agent decides which modules to use and in what order via JSON. The agent also decides the narrative grouping — "Problemas UX" in one project could be "Deuda Técnica" in another. No fixed themes.

### Module catalog

| Module | What it renders | Interactive? |
|---|---|---|
| `summary-cards` | Big counters (insights, conflicts, sources, % processed) | No |
| `narrative` | Rich text with [IG-XX] refs inline (executive summary, context) | No |
| `card-grid` | Grid of insight cards grouped by theme — claim visible, source ref, badge | Yes — approve/reject, add context |
| `conflicts` | Conflict cards with resolution options | Yes — radio buttons, textarea |
| `convergences` | (future) Insights grouped by convergence ratio % | Yes — confirm/split/merge |
| `timeline` | Vertical timeline with events + refs | No |
| `actors` | Map of people/roles mentioned in sources | No |
| `evidence-gaps` | Gaps with severity + suggested next step | No |
| `source-progress` | Progress bars per folder + collapsible file list | No |
| `action-bar` | Prompt generator for /synthesis or /ship | Yes — generates copyable prompt |

### JSON structure

```json
{
  "meta": {
    "project": "TIMining",
    "generated": "2026-02-14T13:05",
    "last_session": "2026-02-14T11:14",
    "counts": { "insights": 115, "conflicts": 6, "sources": 54 }
  },
  "sidebar": [
    { "id": "resumen", "label": "Resumen" },
    { "id": "problemas-ux", "label": "Problemas UX" },
    { "id": "vision-core", "label": "Visión CORE" },
    { "id": "conflicts", "label": "Conflictos" },
    { "id": "timeline", "label": "Timeline" },
    { "id": "gaps", "label": "Gaps" },
    { "id": "sources", "label": "Fuentes" }
  ],
  "sections": [
    {
      "id": "resumen",
      "type": "narrative",
      "title": "Resumen Ejecutivo",
      "content": "TIMining es una plataforma de software...",
      "refs": ["IG-40", "IG-91"]
    },
    {
      "id": "problemas-ux",
      "type": "card-grid",
      "title": "Problemas de UX y Adopción",
      "summary": "12 insights confirman fricción significativa...",
      "cards": [
        {
          "id": "IG-05",
          "status": "VERIFIED",
          "category": "user-need",
          "claim": "Los tiempos de actualización de Aware son confusos...",
          "source": "entrevistas operaciones/analisis reu con operaciones.md",
          "quote": "camiones real-time, mapas 3h, indicadores 30min..."
        }
      ]
    },
    {
      "id": "timeline",
      "type": "timeline",
      "title": "Timeline del Proyecto",
      "events": [
        { "date": "2023", "event": "Pivote arquitectónico", "refs": ["IG-88"] },
        { "date": "Ene 2026", "event": "Workshop 1 + entrevistas", "refs": ["IG-40"] }
      ]
    }
  ]
}
```

### Agent vs Template responsibilities

| Responsibility | Who decides |
|---|---|
| Which sections to include | **Agent** (via JSON `sections[]`) |
| How to name/group themes | **Agent** (no fixed themes — context-dependent) |
| Which module type per section | **Agent** (chooses `narrative`, `card-grid`, `timeline`, etc.) |
| Narrative summary text | **Agent** (generated text in JSON) |
| Section order | **Agent** (array order) |
| How to render each module | **Template** (fixed HTML/CSS/JS) |
| Sidebar navigation | **Template** (auto-generated from `sidebar[]`) |
| Interactions (approve/reject/flag) | **Template** (fixed JS, generates prompts) |
| Styles, layout, responsive | **Template** (fixed CSS) |
| Cross-referencing between cards | **Template** (fixed JS, anchor navigation) |

### Wireframe: sidebar + content

```
┌──────────────┬──────────────────────────────────┐
│              │                                  │
│  TIMining    │  [Active section content]        │
│  ──────────  │                                  │
│              │                                  │
│  ● Resumen   │                                  │
│  ○ Problemas │                                  │
│  ○ Visión    │                                  │
│  ○ Negocio   │                                  │
│  ○ Conflictos│                                  │
│  ○ Timeline  │                                  │
│  ○ Actores   │                                  │
│  ○ Gaps      │                                  │
│  ○ Fuentes   │                                  │
│              │                                  │
│  ──────────  │                                  │
│  115 insights│                                  │
│  6 conflicts │                                  │
│  24% sources │                                  │
│              │                                  │
│  [Generar    │                                  │
│   prompt]    │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

### Key design changes from current STATUS.html

| Current | Proposed |
|---|---|
| Insights grouped by technical category (business/technical/user-need) | Grouped by **narrative theme** (agent decides per project) |
| Only IDs listed | **Claim visible** in each card, IDs as secondary reference |
| "Key Findings" manually curated | Executive summary generated from insights, traceable |
| No timeline | Timeline reconstructed from source dates |
| No actors | Map of who said what |
| Sources as checklist | **Progress bar** with % processed |
| Flat dashboard | Sidebar navigation, narrative first, detail on demand |
| Separate tool from analysis | **Decision point** — resolve conflicts, approve insights, then generate outputs |

### Implementation checklist

- [ ] Design and build static template (index.html + style.css + app.js)
- [ ] Define JSON schema for `data.json`
- [ ] Implement all module renderers in app.js
- [ ] Implement sidebar navigation (auto-generated from JSON)
- [ ] Implement interactive modules (approve/reject, conflict resolution, prompt generator)
- [ ] Update `/analyze` SKILL.md to generate `data.json` as final step
- [ ] Update `/synthesis` SKILL.md to regenerate `data.json` as final step
- [ ] Remove or alias `/status` skill (dashboard is now part of /analyze and /synthesis output)
- [ ] Update CLAUDE.md skills pipeline table
- [ ] Add CHANGELOG entry
- [ ] Test with TIMining data on test branch

---

## [BL-13] `/analyze` — Automatic Research Brief

**Status:** Proposed
**Priority:** High
**Proposed in:** TIMining QA session (2026-02-14)
**Related:** BL-12 (research dashboard)

### The gap

After `/analyze` runs, the user has 115 atomic insights and 6 conflicts but no narrative understanding of what was found. The user has to manually ask "give me a summary" to get the picture. The agent should automatically generate a research brief as part of the analysis output.

### What the brief includes

1. **Executive summary** — 3-5 paragraphs: what the project is about, what we found, what's missing
2. **Thematic grouping** — insights organized by narrative themes (what's broken, what to improve, what to add, what works well), not by technical category
3. **Timeline** — reconstructed from dates in source files and events mentioned in insights
4. **Actor map** — who said what, roles, relationships between stakeholders
5. **Evidence gaps** — what sources are missing + suggested next steps (interviews, benchmarks, analytics export, etc.)

### Architecture fit

This is NOT a separate skill or output file. It's **data generated into the JSON** that feeds BL-12's research dashboard:

- The `narrative` sections in `data.json` contain the brief
- The `timeline` section contains the reconstructed timeline
- The `actors` section contains the actor map
- The `evidence-gaps` section contains gaps + suggestions

The brief lives inside the dashboard, not as a separate deliverable.

### Implementation checklist

- [ ] Add brief generation as final step of `/analyze` Phase 4
- [ ] Define narrative grouping logic (agent proposes themes based on content)
- [ ] Add timeline reconstruction from source metadata dates
- [ ] Add actor extraction from source participants/mentions
- [ ] Add evidence gap analysis with next step suggestions
- [ ] All brief content written to `data.json` (BL-12 schema)

---

## [BL-14] `/extract` — Source Processing Progress Indicator

**Status:** Proposed
**Priority:** Medium
**Proposed in:** TIMining QA session (2026-02-14)
**Related:** BL-07 (/extract skill)

### The gap

When `/extract` processes sources, there's no visibility into how much has been processed. With 54+ files across 6 folders, the user doesn't know if the agent read 10% or 90% of the available material.

### What changes

`/extract` tracks and reports processing progress:

- **Per-folder progress:** `Workshop 1: 3/28 files (11%)` — including binary files described in _CONTEXT.md
- **Overall progress:** `13/54 files processed (24%)`
- **Written to data.json** as `source-progress` module for the research dashboard (BL-12)
- **Reported in conversation** during extraction: "Processed 13/54 files (24%). 41 files pending — 26 are workshop photos, 6 PDFs, 3 PowerPoints."

### Architecture fit

- Change to `/extract` SKILL.md (BL-07) — add progress tracking
- Progress data written to `data.json` for BL-12 dashboard
- `source-progress` module in dashboard shows progress bars per folder

### Implementation checklist

- [ ] Add file counting to `/extract` discovery phase
- [ ] Track processed vs total per folder
- [ ] Report progress in conversation output
- [ ] Write progress data to `data.json` for dashboard

---

## [BL-15] Visual & Interaction Polish — HTML Template Upgrade

**Status:** Proposed
**Priority:** Low
**Proposed in:** QA v2 session (2026-02-15)
**Related:** BL-12 (Research Dashboard), all /ship output types

### The gap

All HTML templates (`03_Outputs/_templates/`) are functional but visually generic — typical "AI-generated" look with safe fonts, minimal animations, and flat layouts. The Template+JSON architecture makes this fixable without touching skills: upgrade the templates once, all outputs benefit immediately.

### What changes

Visual and interaction improvements across all 10 HTML templates:

- **Typography:** Move beyond Inter/system fonts — consider distinctive, characterful choices per output type
- **Micro-interactions:** Hover states, transitions, expand/collapse animations, smooth scrolling
- **Data visualization:** Sparklines, progress bars, convergence indicators, heat maps for coverage
- **Dashboard (STATUS):** Sidebar polish, card transitions, filter animations, keyboard navigation
- **Print/PDF:** Page break refinement, print-specific styles, cover page design
- **Accessibility:** Color contrast, focus states, screen reader labels, reduced-motion support
- **Responsive:** Mobile/tablet layouts for outputs shared via link

### Architecture fit

- **Zero skill changes** — templates are static HTML/CSS/JS, agent writes JSON only
- **Zero pipeline changes** — same data, better presentation
- Claude Code `frontend-design` plugin could guide the redesign
- Could be done incrementally: one template at a time, starting with STATUS (most used)

### Implementation approach

1. Install `frontend-design` plugin for design guidance
2. Define a visual identity for PD-Spec outputs (typography, color palette, spacing system)
3. Upgrade `_base.css` shared styles first (all templates inherit)
4. Polish each template individually, starting with STATUS → PRD → Report

---

# Appendix A: QA Findings — TIMining Test (2026-02-14)

Test branch: `test-timining` · Agent 1: Cursor Composer 1.5 · Agent 2: Sonnet 4.5 via Antigravity · Agent 3: Claude Code (Opus 4.6)
Sources: Real TIMining documentation (mining software, 63 files)

### QA-01: Cursor multi-agent worktree (N/A)
- **Severity:** N/A — Cursor behavior, not PD-Spec
- **What:** Cursor multi-agent mode creates isolated worktrees. `01_Sources/` was empty in the worktree; agent escaped to main repo path to find sources.

### QA-02: MEMORY.md timestamp incompleto
- **Severity:** Minor
- **Fix in:** `/analyze` SKILL.md
- **What:** Agent wrote `[2025-02-13]` instead of `[2025-02-13THH:MM]` as the template requires.

### QA-03: 0 conflicts detected in 33 insights
- **Severity:** Review
- **Fix in:** `/analyze` SKILL.md (cross-reference step)
- **What:** 33 insights from a complex product, 0 conflicts. Obvious tensions exist but were not detected.

### QA-04a: PNG images not read (agent is multimodal)
- **Severity:** Medium
- **Fix in:** `/analyze` SKILL.md Phase 1
- **What:** Agent skipped PNGs that could have been analyzed directly via multimodal Read tool.

### QA-04b: .docx files not converted
- **Severity:** Medium
- **Fix in:** `/analyze` SKILL.md Phase 1
- **What:** .docx files skipped. `textutil -convert txt` available on macOS.

### QA-05: No key quotes in insights
- **Severity:** Minor
- **Fix in:** `/analyze` SKILL.md Phase 3
- **What:** /status expects blockquote per insight but /analyze doesn't require them.

### QA-06: Redundancia entre Project Context y Project Settings
- **Severity:** Medium
- **Fix in:** CLAUDE.md template + `/kickoff` SKILL.md
- **What:** `project_name` and `one_liner` duplicated in two sections.

### QA-07: Team hardcodeado en template
- **Severity:** Medium
- **Fix in:** CLAUDE.md template + `/kickoff` SKILL.md
- **What:** `Team: Niklas Lundin` hardcoded. New users inherit it.

### QA-01b: Kickoff duplicación
- **Severity:** Closed
- **What:** Composer 1.5 duplicated CLAUDE.md sections. Not reproducible with other agents.

### QA-08: Skills no señalan pasos paralelizables
- **Severity:** Enhancement
- **Fix in:** All SKILL.md files
- **What:** /analyze processes sources linearly. Independent reads could be parallelized.

### QA-09: Falta skill de extracción → BL-07
- **Severity:** Feature request
- **What:** No mechanism to read binaries and generate _CONTEXT.md automatically.

### QA-10: _CONTEXT.md no sigue _CONTEXT_TEMPLATE.md
- **Severity:** Medium
- **What:** Agent wrote free-form _CONTEXT.md instead of template format.

### QA-11: "Insights Derivados" en _CONTEXT.md — blurs layer boundary
- **Severity:** Medium
- **What:** Agent put insights in 01_Sources/ instead of 02_Work/.

### QA-12: Fotos de workshop no leídas (multimodal desaprovechado)
- **Severity:** Medium
- **What:** 21 JPEGs + 5 HEICs of whiteboards marked "not reviewed individually."

### QA-13: PDFs legibles pero no leídos
- **Severity:** Minor
- **What:** Read tool handles PDFs natively but agent treated them as unreadable binaries.

### QA-14: Insights no atómicos (KEEP-STOP-START)
- **Severity:** Medium
- **What:** IG-80 lists ~10 items in one insight. Should be ~10 separate insights.

### QA-15: Insights demasiado granulares (Project TIM)
- **Severity:** Minor
- **What:** 9 individual TIM capability insights could be 2-3. Tension with QA-14.

### QA-16: Status format con bold rompe parsing
- **Severity:** Medium
- **What:** `**PENDING**` instead of `PENDING` breaks extraction.

### QA-17: Secciones temáticas no especificadas
- **Severity:** Low
- **What:** Agent added `## Section` headers. Useful but not in spec.

### QA-18: Line breaks mid-word
- **Severity:** Minor
- **What:** "priori\nzado" split across lines. Agent behavior.

### QA-19: Conflictos sin [IG-XX] references
- **Severity:** Medium
- **What:** Conflicts cite evidence without insight IDs. Not traceable.

### QA-20: Solo 6 conflictos para 110 insights
- **Severity:** Review
- **What:** Obvious tensions missed (IG-80 no-3D vs IG-44 3D-layer).

### QA-21: /status dio texto plano en vez de HTML
- **Severity:** High
- **What:** Antigravity doesn't load .claude/skills/ automatically.

### QA-22: Agente usa Python para generar STATUS.html
- **Severity:** Low
- **What:** Agent used python3 instead of Write tool. Reasonable but violates tool constraints.

### QA-23: 110 insights inviable para review manual
- **Severity:** High (UX)
- **What:** Approve/reject 110 items one by one is not viable. Need bulk operations.

### QA-24: /synthesis cargado con argumentos de otro proyecto
- **Severity:** High (trust/safety)
- **What:** Session continuation leaked arguments from a different project (NeoWallet).

### QA-25: Source refs no visibles en detalle
- **Severity:** Medium
- **What:** Dashboard shows claims without source reference.

### QA-26: Agrupación mezcla contextos → resolved by QA-27A
- **Severity:** Minor
- **What:** Ad-hoc regrouping mixed insights from different sources.

### QA-27: /status tarda 4-9 minutos
- **Severity:** High (performance)
- **What:** HTML generation too slow. Fix: formalize /analyze sections + data/template separation.

### QA-28: Dos niveles approve/reject confusos
- **Severity:** Medium
- **What:** Group + individual buttons without clear hierarchy.

### QA-29: Resúmenes de grupo son listas de keywords
- **Severity:** Medium
- **What:** Summaries repeat insight keywords instead of synthesizing implications.
