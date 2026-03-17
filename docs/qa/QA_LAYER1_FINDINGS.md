# QA Layer 1 Findings — Wave 3.5 "Amplifier, Not Process"

> Date: 2026-03-17
> Scope: BL-128 (Flexible Pipeline) + BL-129 (Kickoff Project Type)
> Tested on: pd-spec--qa worktree (TIMining-QA dataset, post-reset conversational state)
> Commits: 7f735bc, bf24607

## Results

| Test | Description | Result |
|------|-------------|--------|
| 1 | /analyze without /extract | ✅ PASS — showed 3 adaptive options |
| 1b | /analyze conversational | ✅ PASS — 4 insights from chat |
| 2 | /spec with empty Work | ✅ PASS — built spec from conversation |
| 6 | /kickoff new fields | ✅ PASS — 3 new questions, PROJECT.md updated |
| 8 | /kickoff orientation by starting_point | ✅ PASS — `from_scratch` showed distinct orientation (hipótesis, /seed) |
| 9 | /spec structure by project_type | ✅ PASS — business_strategy→digital_product: Strategic Axes → Design Principles + Operational Domains |
| 12 | /ship no regression | ✅ PASS |
| 13 | /ship prd with minimal Work | ✅ PASS — PRD v1.0 with 6 PENDING insights, 7 GAPs |

## Observations

### OBS-L1-01: AskUserQuestion in conversational mode
**Severity:** P3 (minor UX friction)
**Finding:** During conversational /analyze, the skill used AskUserQuestion to confirm before proceeding. In conversational mode the agent should lean toward autonomy since the user is already engaged in dialogue.
**Impact:** Slight friction, no functional issue.

### OBS-L1-02: No Evidence Quality tags yet
**Severity:** P3 (expected — Layer 2 scope)
**Finding:** Insights from conversation lack evidence quality tags (e.g., Tier beyond "Hipótesis"). This is expected since evidence quality model is planned for Layer 2 (3.5e).
**Impact:** None for Layer 1. Tracked for Layer 2.

### OBS-L1-03: Conversational mode works without explicit instructions
**Severity:** Positive
**Finding:** Skills adapted to conversational input without requiring special flags or instructions. /analyze built insights from chat, /spec built vision from conversation context. BL-128 adaptive start works as designed.

### OBS-L1-04: PRD with 0 VERIFIED insights is genuinely useful
**Severity:** Positive
**Finding:** The PRD generated from 6 PENDING conversational insights uses GAPs as an investigation guide rather than empty sections. Open questions are well-prioritized. The document serves as a "what we know vs. what we need" map.

### OBS-L1-05: Insights Summary table redundancy with uniform status
**Severity:** P4 (cosmetic)
**Finding:** When all insights share the same status (6× PENDING), the Status column in the Insights Summary table adds no information. Consider collapsing to a summary line when status is uniform.
**Impact:** Cosmetic only.

### OBS-L1-06: user_profile defined but not consumed
**Severity:** P2 (feature gap)
**Finding:** `/kickoff` (BL-129) asks for `user_profile` and saves it to PROJECT.md with 3 options (founder_solo, designer, team_with_research). The stated intent is to change "depth and tone" across skills. However, **no downstream skill reads or adapts based on this field**. The field is dead on arrival.
**Impact:** Users answer a question that has zero effect on behavior. Creates false expectation of personalization.
**Recommendation:** Either implement consumption in /analyze + /spec + /ship (Layer 2 candidate) or remove the question until ready.

### OBS-L1-07: starting_point only affects kickoff orientation text
**Severity:** P3 (design awareness)
**Finding:** `starting_point` (from_scratch / existing_product / existing_ecosystem) only changes the post-kickoff orientation message (next steps text). It does NOT affect downstream skill behavior — skills adapt based on what content exists in the Work layer, not based on PROJECT.md starting_point.
**Impact:** Low. The orientation text is useful, but users might expect the field to influence the entire pipeline. Acceptable for Layer 1 — the adaptive pipeline (BL-128) achieves the same goal through content detection rather than configuration.

## Conclusion

**Layer 1 QA: PASS (8/8 tests)**

BL-128 (Flexible Pipeline) and BL-129 (Kickoff Project Type) work as designed. The adaptive pipeline correctly handles empty Work layers, conversational input, minimal evidence, and project_type-driven structure changes.

**Key takeaways:**
- Conversational mode (BL-128) is the standout feature — skills adapt to chat input without special configuration
- project_type influences /spec structure as intended
- user_profile (BL-129) is defined but not consumed — Layer 2 candidate

**Carry forward to Layer 2:**
- OBS-L1-06 (P2): Implement user_profile consumption or defer the question
- OBS-L1-02 (P3): Evidence quality model (3.5e)
- OBS-L1-01 (P3): Reduce AskUserQuestion friction in conversational mode

**Closed:** 2026-03-17
