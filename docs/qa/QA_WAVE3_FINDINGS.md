# QA Wave 3 Findings — "Opinionated Pipeline" Quick Wins (3.1–3.4)

> Date: 2026-03-09
> Scope: Items 3.1–3.4 (autonomous skills, Q&A scope, checkpoint fix)
> Tested on: pd-spec--qa worktree (TIMining-QA dataset, 7 sources, 36 insights)
> Commits: f90d501, 92821a4, 0e3cf18, 25cba0a, 018cbad

## Results

| Item | Test | Environment | Result |
|------|------|-------------|--------|
| 3.1 /spec autonomous | CF-02 (CEO autonomy vs Human-in-the-Loop) | webapp | ✅ Smart gate triggered AskUserQuestion — evidence comparable + high impact |
| 3.2 /ship autonomous | `/ship prd` full generation | CLI + webapp | ✅ Showed outline, proceeded without approval gate |
| 3.3 Q&A scope | Asked "qué es BL-127?" | webapp | ✅ Scope restriction fired after disallowedTools fix |
| 3.4 Checkpoint fix | `/ship prd` writes MEMORY + checkpoint | CLI + webapp | ✅ Both files written correctly |

## Cost Baselines (webapp, Sonnet)

| Skill | Cost | Context |
|-------|------|---------|
| `/ship prd` | ~$0.37 | Full PRD v1.0, 236 lines, 10 sections, 24 insight refs |
| `/spec` | ~$0.19 | 1 conflict resolved via smart gate + AskUserQuestion |
| `/audit` | ~$0.15 | Full work layer audit (estimated from token count) |

## Observations

### OBS-W3-01: Q&A scope requires disallowedTools enforcement
**Severity:** P2 (design constraint, not bug)
**Finding:** System prompt scope restriction alone is insufficient. Haiku ignores the instruction and uses Read/Grep/Glob to access engine files (BACKLOG.md, ROADMAP.md). SDK auto-approves Read/Glob/Grep before `canUseTool` fires — no `permissionMode` value forces them through the callback.
**Fix:** Added Read, Grep, Glob, Bash to `disallowedTools` for Q&A mode. Q&A now responds only from pre-loaded context (INSIGHTS_GRAPH, CONFLICTS, STRATEGIC_VISION, PROPOSALS).
**Impact:** Q&A cannot dynamically read additional files. If future needs require it, expand the `contextFiles` array in `buildSystemPrompt()`.

### OBS-W3-02: First /ship prd CLI run has no cost capture
**Severity:** P3 (observability gap)
**Finding:** The first PRD generation was run in CLI, so no cost data was captured. The second run ($0.37) was a webapp run. CLI doesn't surface `total_cost_usd` — only the API dashboard shows cumulative spend.
**Related:** BL-120 acceptance criterion added for input/output token breakdown + cost in Agent View Done banner.

### OBS-W3-03: SDK usage structure confirmed
**Severity:** Info
**Finding:** `msg.usage` returns `NonNullableUsage` (from `BetaUsage`) with snake_case fields: `input_tokens`, `output_tokens`. `msg.total_cost_usd` is available on `SDKResultSuccess`. Frontend now displays both.

### OBS-W3-04: Smart gate works correctly on comparable evidence
**Severity:** Info (positive validation)
**Finding:** CF-02 (CEO directive for full autonomy vs. adopted Human-in-the-Loop principle) correctly triggered AskUserQuestion with 4 options. Agent evaluated evidence strength, identified comparable evidence + high impact, and deferred to user. Exactly the designed behavior for the "autonomy with judgment" pattern.

### OBS-W3-05: Q&A leaks partial engine context from work files
**Severity:** P3 (cosmetic)
**Finding:** Even with tools blocked, Haiku mentioned "engine's auto-memory" and "BL-127 P1 status" in Q&A response. Source: work layer files (MEMORY.md, STRATEGIC_VISION.md) that reference BL identifiers in their content. The scope restriction message did fire correctly.
**Mitigation:** Acceptable — main goal (agent doesn't read engine files) is achieved. Work files referencing BLs is a content issue, not an access issue.

### OBS-W3-06: /audit does redundant Grep calls
**Severity:** P2 (skill quality / token waste)
**Finding:** /audit executed 15+ Grep calls on INSIGHTS_GRAPH.md searching for "Convergence" with slight regex variations (`^Convergence:`, `Convergence:`, `Convergence: `, `Convergence`). The agent is trial-and-error pattern matching instead of using a single well-formed regex or a script.
**Fix needed:** Audit SKILL.md optimization — either use `count-statuses.sh` / inline script, or specify the exact regex format in the skill instructions.
**Visible thanks to:** Agent View tool visibility improvement (commit 25cba0a).

### OBS-W3-07: Conflicts UI becomes audit log
**Severity:** Design observation
**Finding:** With /spec resolving conflicts autonomously, the Conflicts module changes from active workspace to audit/history view. Users no longer need to manually review and decide each conflict — the agent handles clear cases and only surfaces ambiguous ones.
**Impact:** BL-99 (Conflict lifecycle) scope reduced from "management workspace" to "history view + agent decision transparency". Effort estimate: M → S-M.

### OBS-W3-08: /spec doesn't update ANALYSIS.md after conflict resolution
**Severity:** P2 (data consistency)
**Finding:** After resolving CF-02, CONFLICTS.md was updated but ANALYSIS.md still showed CF-02 as pending tradeoff and listed it as blocker in the verdict.
**Fix:** Added step 13 to spec/SKILL.md — update ANALYSIS.md tradeoffs and verdict after conflict resolution (commit 0e3cf18).

## Bonus Fixes During Session

| Fix | Commit | Description |
|-----|--------|-------------|
| /view removed from webapp skills | 018cbad | Running /view from webapp would kill the server handling the request |
| Agent View tool visibility | 25cba0a | Show file basenames, commands, patterns in tool log entries |
| Agent View token/cost display | 25cba0a | Done banner shows input/output breakdown + total_cost_usd |
| /spec step 13 (ANALYSIS.md) | 0e3cf18 | Close diagnostic cycle after conflict resolution |
