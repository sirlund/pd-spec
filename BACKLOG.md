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
