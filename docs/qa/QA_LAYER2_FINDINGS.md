# QA Layer 2 — Findings

> Wave 3.5 "Amplifier, Not Process" — Layers 1+2 (v4.30.0)
> Started: 2026-03-17

## Observations

### OBS-L2-01 — /kickoff skips `team` field (P3, bug)

**Test:** Pre-QA setup via /kickoff
**Observed:** /kickoff asks 6 questions (name, language, one-liner, project_type, starting_point, user_profile) but leaves `team` as `[Set by /kickoff]` without ever asking.
**Expected:** If a field exists in the PROJECT.md template, /kickoff should ask for it.
**Fix:** Add `team` as question 7 in kickoff SKILL.md. Optional field — user can skip, but should be asked.

### OBS-L2-02 — /kickoff orientation text not aligned with /analyze interview mode (P3, cosmetic)

**Test:** Pre-QA setup via /kickoff
**Observed:** Post-kickoff orientation says "tell me about the ecosystem" as a generic suggestion, without directing to `/analyze` which now has the structured interview mode.
**Expected:** Orientation should point to `/analyze` as the entry point for conversational ingestion.
**Fix:** Updated kickoff SKILL.md orientation text to reference `/analyze` directly.
**Status:** FIXED in-session.

---

## Test Results

| Test | Description | Result | Notes |
|---|---|---|---|
| T1 | Conversational interview → claims in EXTRACTIONS.md | — | |
| T2 | Evidence quality tags on conversational claims | — | |
| T3 | Tier rules use ≥2 voices | — | |
| T4 | Workshop cross-reference → delta table in _temp/ | — | |
| T5 | user_profile=founder_solo → deeper probing | — | |
| T6 | user_profile=team_with_research → lighter questions | — | |
| T7 | No regression: /extract file-based | — | |
| T8 | No regression: /analyze with existing EXTRACTIONS.md | — | |
| T9 | Conversational claims re-processable with --full | — | |
