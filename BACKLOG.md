# Backlog — Future Work

Documented proposals for future features. Each entry includes rationale, architecture fit, and implementation notes.

---

## [BL-01] `/ship design-system` — Visual Design Specifications

**Status:** Proposed
**Priority:** Medium
**Proposed in:** v2.4 session (2025-02-10)

### What it does

Adds `design-system` as a new output type for `/ship`. Generates `03_Outputs/DESIGN_SYSTEM.html` with visual specifications derived from the Work layer.

### Output structure

1. **Design Tokens** — Color palette, typography (Google Fonts), spacing scale, border radii.
2. **Component Specs** — Key UI components with visual guidelines (buttons, cards, forms, navigation).
3. **Anti-patterns** — What to avoid, with reasoning.
4. **Traceability Table** — Maps every design decision to its source.

### Architecture fit

- Reads from `02_Work/SYSTEM_MAP.md` + `02_Work/INSIGHTS_GRAPH.md` (same as all `/ship` types).
- Writes to `03_Outputs/DESIGN_SYSTEM.html`.
- Follows the same Phase 0 → Phase 1 → Phase 2 → Phase 3 pattern.
- NOT a separate skill — it's another output type of `/ship`, consistent with `prd`, `presentation`, `report`, etc.

### No Hallucination tension

A design system includes two types of decisions:

1. **Insight-backed decisions** — Traceable to `[IG-XX]` entries. Example: "Dark mode support → [IG-15] Users work in low-light environments."
2. **Design recommendations** — Based on domain expertise, not sources. Example: "Fintech apps benefit from trust-signaling blues and high-contrast type."

To maintain the No Hallucination mandate, the output must explicitly distinguish these:

```html
<!-- Insight-backed -->
<div class="decision backed">
  <span class="tag">IG-15</span>
  Dark mode as default theme — users report working primarily at night.
</div>

<!-- Recommendation -->
<div class="decision recommendation">
  <span class="tag">REC</span>
  Use Inter for UI text, serif accent for headings — trust-signaling pattern for fintech.
</div>
```

Recommendations are labeled `REC` (not `IG-XX`) so there is no confusion about what is evidence-backed and what is design expertise.

### Why not a separate skill

Homer's Car Detector: `/ship` already handles 6 output types. A design system is another deliverable derived from the Work layer. The input/output pattern is identical. A separate `/design-specs` or `/prototype` skill would duplicate the Phase 0–3 structure, the MEMORY.md writing, and the readiness validation — all for something that differs only in output format.

### Why not wireframes

Wireframes require UI layout decisions (component placement, screen flow, responsive breakpoints) that go beyond what the knowledge base can substantiate. That crosses from "product documentation" into "product design execution." If wireframes are needed later, they should be a separate evaluation.

### Implementation checklist

- [ ] Add `design-system` to `/ship` argument-hint
- [ ] Add section in `/ship` SKILL.md with structure, HTML template, and REC vs IG-XX labeling rules
- [ ] Update CLAUDE.md skills pipeline table
- [ ] Update README skills section
- [ ] Update FRAMEWORK.md `/ship` types list
- [ ] Add CHANGELOG entry
- [ ] Test with real insights to verify traceability output

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
