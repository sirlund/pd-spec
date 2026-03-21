# QA Layer 2 — Findings

> Wave 3.5 "Amplifier, Not Process" — Layers 1+2 (v4.30.0)
> Started: 2026-03-17

## Observations

### OBS-L2-01 — /kickoff skips `team` field (P3, bug)

**Test:** Pre-QA setup via /kickoff
**Observed:** /kickoff asks 6 questions (name, language, one-liner, project_type, starting_point, user_profile) but leaves `team` as `[Set by /kickoff]` without ever asking.
**Expected:** If a field exists in the PROJECT.md template, /kickoff should ask for it.
**Fix:** Add `team` as question 7 in kickoff SKILL.md. Optional field — user can skip, but should be asked.

### OBS-L2-03 — reset.sh --work doesn't reset ANALYSIS.md or _index/ (P2, bug)

**Test:** Pre-QA reset
**Observed:** `reset.sh --work` resets 8 files but leaves ANALYSIS.md with stale data from previous /analyze run. Also leaves _index/ with stale indexes.
**Expected:** Full Work layer reset should include all generated Work files.
**Fix:** Added ANALYSIS.md template reset and _index/ cleanup to reset.sh.
**Status:** FIXED in-session.

---

### OBS-L2-02 — /kickoff orientation text not aligned with /analyze interview mode (P3, cosmetic)

**Test:** Pre-QA setup via /kickoff
**Observed:** Post-kickoff orientation says "tell me about the ecosystem" as a generic suggestion, without directing to `/analyze` which now has the structured interview mode.
**Expected:** Orientation should point to `/analyze` as the entry point for conversational ingestion.
**Fix:** Updated kickoff SKILL.md orientation text to reference `/analyze` directly.
**Status:** FIXED in-session.

### OBS-L2-06 — Category `design-framework` is a misnomer (P3, naming)

**Test:** T8 — /analyze --full
**Observed:** Insights categorized as `design-framework` are actually design principles or interaction patterns (Quiet UI, Human-in-the-loop), not frameworks (Double Diamond, JTBD, Atomic Design). The term misleads designers who expect the academic/industry meaning.
**Expected:** Category should be `design-principle` or `design-pattern` to match what it actually captures ("design principles with evidence trail").
**Fix:** Rename in analyze SKILL.md category table + update references in existing projects. Low effort but touches multiple files.

---

### OBS-L2-05 — /analyze report inflated design-framework count (P2, accuracy)

**Test:** T8 — /analyze --full
**Observed:** ANALYSIS.md report said "4 design-frameworks grounded (DART, Quiet UI, Human-in-the-loop, iPhone-like)" but: DART is business (not design-framework), iPhone-like is Hipótesis with 1 source (not grounded). Actual grounded design-frameworks: 2 (Quiet UI, Human-in-the-loop).
**Expected:** Report should accurately count design-framework category insights with Señal tier and Grounded in: refs. The diagnostic drives /spec readiness decisions — inflated counts distort judgment.
**Implication:** This is an LLM summarization error, not a skill logic bug. The tier rules and categories in INSIGHTS_GRAPH.md were correct — the error was in the natural language summary. Hard to prevent with skill instructions alone.

---

### OBS-L2-07 — Interview should use AskUserQuestion, not inline text (P2, design)

**Test:** T6 — user_profile=team_with_research
**Observed:** Interview mode asks follow-up questions as inline chat text. During Wave 3.5 design, Claude Code itself used AskUserQuestion for the interview and it worked well — each iteration adapted options based on prior answers, creating dynamic deepening.
**Expected:** AskUserQuestion is better UX for interview questions because: (1) gives structure to users who don't know what to say, (2) adapts options dynamically per response, (3) guides non-experts (UX juniors, commercial founders) through unfamiliar territory. Plain text assumes the user can formulate answers unprompted.
**Fix:** Changed SKILL.md interview protocol: use AskUserQuestion for structured questions (evidence probes, theme exploration). Reserve inline text for brief clarifications and acknowledgments only.
**Status:** FIXED in-session. Verified: AskUserQuestion throughout interview, adaptive options, respects output_language.

---

### OBS-L2-10 — Conversational claims: elaboration, duplication, tag confusion (P2, accuracy)

**Test:** T6 re-run claim quality review
**Observed:** 3 issues in 9 claims from AskUserQuestion interview:
1. **Elaboration beyond user input:** Claim 4 ("cada producto se comporta distinto, generando confusión y curvas de aprendizaje") was synthesized by the agent — user only said "UX inconsistente entre productos". Violates "preserve the user's language and framing" rule.
2. **Duplication:** Claims 3 and 6 capture the same information ("UX inconsistente") from two different questions. Should be one claim.
3. **Tag confusion — INTUITION vs FACT for aspirational/constraint claims:** Claims 8 (timeline constraint) and 9 (vision) tagged as [INTUITION] but are user-declared facts about their own constraints/aspirations. FACT + flag ("aspiracional, no validada con clientes") is correct; INTUITION implies the user is guessing about their own decisions.
**Expected:** Raw claims should be verbatim or near-verbatim user statements. Dedup across questions. FACT tag for user-declared constraints/aspirations with appropriate flags.
**Fix:** Update SKILL.md claim writing rules: (a) never elaborate beyond what was said, (b) dedup across questions, (c) FACT for self-declared constraints/vision — reserve INTUITION for claims about external reality without evidence.

---

### OBS-L2-09 — Interview AskUserQuestion: single-select vs multi-select (P3, design)

**Test:** T6 re-run with AskUserQuestion interview
**Observed:** Some interview questions offer mutually exclusive options (correct for single-select) but others have non-exclusive options where the user would want to pick multiple (e.g., "who are the users?" or "what constraints?"). User had to type "todos los anteriores" in free-text fallback.
**Expected:** When options are non-exclusive, either: (a) include "Varios / todos los anteriores" as explicit option, (b) break into sequential questions ("¿Cuál es el principal?" → "¿Hay otros?"), or (c) note in AskUserQuestion text that multiple can be typed.
**Fix:** Update SKILL.md interview protocol: distinguish exclusive vs. non-exclusive questions. For non-exclusive, include a "Varios de los anteriores" option or decompose into sequential probes.

---

### OBS-L2-08 — Adaptive start treats empty EXTRACTIONS.md as "exists" (P2, bug)

**Test:** T6 — user_profile=team_with_research
**Observed:** After `reset.sh --work`, EXTRACTIONS.md exists but has no claim sections (only template header). Adaptive start condition checked file existence, not content — proceeded to Phase 1 which emitted inline text instead of AskUserQuestion routing.
**Expected:** Adaptive start should check for actual claim content (`## [` sections), not just file existence.
**Fix:** Updated SKILL.md: adaptive start checks "exists AND contains at least one extraction section". Phase 1 step 3 also routes to AskUserQuestion when file is empty template.
**Status:** FIXED in-session.

---

### OBS-L2-04 — Users shouldn't need to know --full vs incremental vs --file (P2, design)

**Test:** General QA flow
**Observed:** Even the developer (Nicolas) had to stop and think about why `--full` was needed after `/extract` added new file-based claims alongside existing conversational claims. If the creator of the system has to reason about flags, end users have no chance.
**Expected:** An orchestrator agent should handle routing: detect new claims, decide mode, chain skills automatically. The user says "analyze" or the system auto-chains after /extract.
**Implication:** This is Layer 3+ territory — connects to the orchestrator/agent concept discussed previously. Current pipeline is power-user mode; the default path should be invisible.
**Additional signal (2026-03-20):** Post-kickoff, the experience breaks — user finishes setup and has to decide between /extract and /analyze with no guidance. The orchestrator should auto-chain: kickoff → detect sources → suggest next step (or auto-run).
**Additional signal (2026-03-21):** /analyze accumulates insights instead of refining them. When new evidence arrives (e.g., audit técnico with real bug data), IG-11 ("problemas técnicos" genérico) should be superseded or merged — but the agent just adds IG-18, IG-19 on top. The orchestrator should manage graph hygiene: detect when new evidence invalidates/supersedes/merges existing insights, propose consolidation, signal tier upgrades. This is the real "second pair of eyes" value of PD-Spec as a design partner.
**Additional signal (2026-03-21):** Source types need formalization — `raw`, `analysis`, `directive` — each with distinct /extract behavior. Also: feedback loop gap — when /ship generates artifacts (personas, journey maps), emergent synthesis reveals new insights trapped in 03_Outputs/ that don't feed back to the graph. The orchestrator should monitor artifact generation and propose graph updates without breaking the one-directional invariant. Was scoped as "Bidirectional pipeline (F)" in Wave 3.5.

---

## Test Results

| Test | Description | Result | Notes |
|---|---|---|---|
| T1 | Conversational interview → claims in EXTRACTIONS.md | **PASS** | 18 claims in `## [Conversación 2026-03-17]` section. Metadata correct (Type: conversation, Participants: founder_solo, Evidence Quality: mixed). |
| T2 | Evidence quality tags on conversational claims | **PASS** | All 18 claims tagged: 8 FACT, 2 OBSERVED, 4 INTERVIEW-SELF, 3 INTUITION, 1 DEMO-FEEDBACK. Flags correct (social bias, suggest validation, evidence basis not confirmed). Agent asked "¿cómo lo sabés?" explicitly. |
| T3 | Tier rules use ≥2 voices | **PASS** | IG-SYNTH-07 (stakeholder+researcher → Señal) and IG-SYNTH-09 (stakeholder+researcher → Señal). Under old rules these would need stakeholder+user specifically. [INTUITION] claims (IG-01, IG-18) correctly stayed Supuesto. |
| T4 | Workshop cross-reference → delta table in _temp/ | **PASS** | After hotfix (explicit trigger + "MUST write to files" rule). Wrote `WORKSHOP_COMPARE_2026-03-17_11-00.md`, logged in MEMORY, updated checkpoint. First attempt FAILED without trigger. |
| T5 | user_profile=founder_solo → deeper probing | **PASS** | Pushback on evidence: "¿viene de observación, entrevistas, o percepción?". Challenged assumptions about operators and competition. Constructive guide tone. |
| T6 | user_profile=team_with_research → lighter questions | **PASS** | After hotfix (adaptive start checks for claim sections, not just file existence). Lighter tone: "¿Qué están encontrando?" vs T5's "¿cómo lo sabés?". Focus on coverage gaps (supervisores, management). 5 exchanges. OBS-L2-07: should use AskUserQuestion during interview too. |
| T7 | No regression: /extract file-based | **PASS** | 64 claims extracted from 134KB STT transcript. SOURCE_MAP updated. Conversational section in EXTRACTIONS.md preserved. |
| T8 | No regression: /analyze with existing EXTRACTIONS.md | **PASS** | --full processed 2 sections (82 claims) → 33 insights, 4 conflicts. ANALYSIS.md, MEMORY, checkpoint all updated correctly. |
| T9 | Conversational claims re-processable with --full | **PASS** | Conversational claims merged with file claims into synthesized insights (e.g. IG-SYNTH-01 has evidence from both). Evidence quality tags preserved. [INTUITION] → Supuesto, [OBSERVED] → contributed to Señal. |
