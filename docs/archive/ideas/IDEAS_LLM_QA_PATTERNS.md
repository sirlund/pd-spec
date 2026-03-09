# IDEAS — LLM Quality Assurance Patterns for PD-Spec

> **Origin:** Session 2026-03-01. Discussion on ensuring agents follow protocols (indexes, offset/limit) and improving pipeline output quality.
> **Status:** IDEA — not assigned to any wave. Captured to preserve context.

---

## Context

The LLM agent executes skills that have rules (read indexes first, use offset/limit, categorize correctly). But "instructed behavior ≠ guaranteed behavior." Four industry patterns apply at different points in the pipeline.

### Why this matters for PD-Spec specifically

PD-Spec's core promise is "no hallucination — every claim traceable." That promise is only as strong as the weakest link in the pipeline. The LLM makes high-stakes semantic decisions at multiple points: is this a real insight or noise? Is this a contradiction or a different perspective? Does this evidence actually say what I'm claiming?

If the system ships a deliverable with an invented insight or a missed conflict, it undermines the entire value proposition. The patterns below are ordered from cheapest/most deterministic to most expensive/most powerful.

---

## Pattern 1: Tool-Level Guardrails (deterministic)

**What:** The runtime intercepts tool calls and forces correct behavior. The agent doesn't choose well — the system doesn't let it choose wrong.

**PD-Spec application:** If the agent requests `Read("EXTRACTIONS.md")` without offset and `EXTRACTIONS_INDEX.md` exists, the runtime returns the index with a note: "use offset/limit to read specific sections." Deterministic, zero extra tokens.

**Where:** Work layer reads (EXTRACTIONS.md, INSIGHTS_GRAPH.md, any file indexed by BL-101).

**Cost:** Zero — runtime logic, not an LLM call.

**Priority:** High. Cheapest and most effective mitigation. Implement with SDK migration (BL-80 Phase 1 acceptance criteria).

**Relationship:** Extends the `canUseTool` pattern (interaction gates) to file reads. Same callback, different responsibility.

**Implementation sketch:**

```javascript
// Inside canUseTool callback
if (toolName === 'Read' && !input.offset) {
  const indexPath = getIndexPath(input.file_path);
  if (await exists(indexPath)) {
    return {
      behavior: 'allow',
      updatedInput: { ...input, file_path: indexPath }
    };
  }
}
```

**What this does NOT cover:** The agent could still misinterpret the index, request the wrong section, or draw wrong conclusions from correctly-read data. Guardrails ensure correct data access, not correct reasoning.

### OBS (2026-03-01): canUseTool does NOT intercept Read

**Finding:** The Claude Agent SDK auto-approves Read, Glob, Grep, and safe Bash calls — `canUseTool` is never fired for them. Only "dangerous" operations (Write, Edit, unrestricted Bash) go through the callback. This means the implementation sketch above is dead code — the redirect never executes.

**Current mitigation:** Pattern 2 (preamble instructions in `buildSystemPrompt` in claude.js). The agent is instructed to check `02_Work/_index/` before reading large files and use offset/limit. This works most of the time but is non-deterministic ("can" ≠ "will").

**Open question:** Is this a fundamental SDK design decision (Read is always safe, no interception needed) or is there an alternative mechanism we haven't found? Possibilities not yet explored:
- SDK configuration to make Read go through `canUseTool`
- Middleware or hook at the transport level (before the SDK sees the tool call)
- Custom tool that wraps Read with index logic (register a `ReadWithIndex` tool?)
- Future SDK versions exposing Read in `canUseTool`

**Status:** Deferred as technical debt. The upgrade from "agent couldn't use indexes at all" (no offset/limit in custom runtime) to "agent can and usually does" (SDK + preamble instructions) is still a significant improvement. Deterministic enforcement remains the goal when a viable mechanism is found.

**Impact:** Pattern 1 is downgraded from "deterministic, zero cost" to "best-effort via Pattern 2." The acceptance criteria in BACKLOG_REPRIORITIZATION_V2.md should reflect this.

---

## Pattern 2: Self-Reflection / Chain-of-Verification (same agent)

**What:** Before executing, the agent asks itself "am I following the protocol?" A cognitive checkpoint in the prompt — not a second agent.

**PD-Spec application:** Add to skill preambles:

```
Before reading any Work layer file:
  1. Check: does an index exist in 02_Work/_index/?
  2. If yes, read the index first.
  3. Identify the specific section you need.
  4. Read only that section with offset/limit.

Before creating an insight:
  1. Verify: does it reference a real extraction in EXTRACTIONS.md?
  2. Verify: is it semantically distinct from existing insights (check index)?
  3. If uncertain, flag for user review instead of creating.
```

**Where:** Skills that make critical reads or writes (/extract, /analyze).

**Cost:** Low — ~500-1000 extra reasoning tokens per step.

**Limitation:** Same LLM auditing itself. Can overlook the same errors it would make without the checkpoint. Useful as first line of defense, not as guarantee. Empirically, self-reflection catches ~60-70% of protocol violations — better than nothing, worse than deterministic guardrails.

**Priority:** Medium. Can be added to skills as additional instructions without architectural changes. Low risk, low effort.

**Relationship with Pattern 1:** Complementary. Pattern 1 catches "wrong file read" deterministically. Pattern 2 catches "wrong reasoning about correctly-read data" probabilistically. Together they cover both data access and data interpretation.

---

## Pattern 3: Critic Agent (second auditor agent)

**What:** A second model (or same model with different prompt/context) reviews the primary agent's actions or outputs before they're written to file. Primary agent proposes, critic validates.

### Critical application point: /analyze → INSIGHTS_GRAPH.md

This is where the LLM makes the highest-impact semantic decisions:
- Is this an insight or noise?
- Does this insight already exist (duplicate) or is it new?
- Do these two claims contradict each other (conflict) or are they complementary perspectives?
- Is the categorization correct?
- Does the referenced evidence actually say what the insight claims?

If it gets this wrong, /spec and /ship inherit the error. The user has 23+ insights and won't audit each one against source files — that's the system's job.

**How it would work:**

```
1. /analyze generates INSIGHTS_GRAPH.md (draft, not yet written)
2. Critic agent receives: draft + original extractions + audit instructions
3. Critic reviews:
   - Duplicates: "IG-07 and IG-12 appear to say the same thing"
   - Hallucinations: "IG-15 claims X but no extraction supports this"
   - Missed conflicts: "IG-03 vs IG-11 contradict each other, no CF created"
   - Categorization: "IG-09 is tagged as user-need but reads as design-framework"
   - Evidence accuracy: "IG-04 references source_interview_03.md but the quote is paraphrased beyond recognition"
4. Output: findings list with specific IDs and evidence
5. Primary agent corrects, or findings are surfaced to user for decision
```

**Where else it could apply:**
- /spec → STRATEGIC_VISION.md: Are proposals grounded in verified insights? Do design principles have real [IG-XX] backing?
- /ship → deliverables: Does the output faithfully reflect the Work layer? (This is essentially BL-82 Audit Mode as an automated step.)

**Cost:** ~5-10K extra tokens per audit. On a $5 Sonnet pipeline, adds ~$0.15-$0.30. On $1.50 incremental, adds ~$0.10. Justifiable if it catches errors that would otherwise contaminate everything downstream.

**Model choice for critic:** Doesn't need to be the same model or same tier. A Haiku critic auditing a Sonnet analysis could work — the critic task is structured comparison (draft vs. extractions), not creative synthesis. This aligns with BL-80 Phase 2 model routing.

**Priority:** Medium-high for the /analyze point. This is the quality differentiator — "PD-Spec doesn't just extract insights, it validates them." Directly supports the "we don't hallucinate" pitch.

**Relationship with BL-82 (Audit Mode):** BL-82 is the user-facing version of this pattern. The critic agent is the automated version that runs as part of the pipeline. They can coexist: critic agent as internal quality gate, audit mode as on-demand verification for the user. Same engine, two interfaces.

### Design consideration: when to run the critic

Not every /analyze run needs a full critic pass. Suggested heuristic:

| Scenario | Critic? | Reasoning |
|---|---|---|
| First full analysis (project setup) | **Yes** | Highest stakes, no prior baseline to compare |
| Incremental (3 new sources) | **No** | Low volume, user reviews in UI |
| Incremental with new conflicts detected | **Yes** | Conflicts are the highest-risk output |
| Pre-ship (before generating deliverables) | **Yes** | Last chance before external-facing output |
| User explicitly requests `/audit` | **Yes** | User-initiated, always run |

This keeps the cost proportional to the risk.

---

## Pattern 4: Planning + Execution Split (plan mode)

**What:** The agent first proposes a complete plan ("I'll read the index, identify sections X and Y, read them with offset, create insights A, B, C"), another agent (or same with different prompt) validates the plan, and only then is it executed.

**PD-Spec application:** Already partially exists — Claude Code has plan mode, and pipeline skills propose before executing (Mandate #2). What doesn't exist is automated plan validation before execution.

**Where:** Useful for costly or destructive operations: /extract full (before reading 72 files, is the plan optimal?), /spec (before resolving conflicts, is the resolution strategy coherent?).

**Cost:** ~2-5K tokens for plan generation + ~2-5K for validation. Doubles the planning phase cost but can save more by avoiding re-executions.

**Priority:** Low. Planning already exists in the human flow (user approves before executing). Automating plan validation is premature optimization until there's evidence of bad plans causing wasted runs.

**When it becomes relevant:** If PD-Spec moves to Batch mode (UX Contract) where there's no human approval step, plan validation becomes the only safety net. But Batch mode has no real user yet.

---

## Summary: where to apply each pattern

```
Pipeline:  /extract  →  /analyze  →  /spec  →  /ship
              │              │            │          │
Guardrails: [P1]           [P1]         [P1]       [P1]     ← Tool-level, always active
              │              │            │          │
Self-check: [P2]           [P2]                              ← In critical skills
              │              │            │          │
Critic:                    [P3] ★        │         [P3]      ← At semantic decision points
              │              │            │          │
Plan-val:   [P4]                        [P4]                 ← For costly/destructive ops
```

★ = highest impact point for critic agent

---

## Suggested next steps

1. **Immediate (SDK migration):** Implement Pattern 1 (tool guardrails) — intercept reads of indexed files. Already in BL-80 Phase 1 acceptance criteria.
2. **Post-SDK:** Add Pattern 2 (self-reflection) to /extract and /analyze skills as additional preamble instructions. Low effort, no architectural change.
3. **Wave 3-4:** Evaluate Pattern 3 (critic agent) on /analyze as quality gate. Measure: how many errors does it catch? Does the cost justify it? Consider Haiku as critic model (structured comparison task, not synthesis).
4. **Relationship with BL-82:** The automated critic agent is the engine behind audit mode. Same motor, two interfaces (automated in pipeline, on-demand for user).
5. **Relationship with BL-106 (MCP App):** In the MCP App (Guided mode), the user has even less visibility into pipeline internals. A critic agent becomes more important when there's no power user reviewing insights one by one. The MCP App funnel should include critic validation by default.

---

## References

- [Building Effective Agents — Anthropic Research](https://anthropic.com/research/building-effective-agents)
- [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) — the academic foundation for critic patterns
- [Chain-of-Verification (CoVe)](https://arxiv.org/abs/2309.11495) — self-reflection for factual accuracy
- `canUseTool` callback: [Agent SDK docs](https://platform.claude.com/docs/en/agent-sdk/user-input)
- BL-80 Phase 1 acceptance criteria: `docs/BACKLOG.md`
- BL-82 Audit Mode: `docs/BACKLOG.md`
- UX Contract: `docs/UX_CONTRACT.md`
