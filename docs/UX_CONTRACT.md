# UX Contract — What the User Experiences

> **Purpose:** Define the user-facing interaction model for PD-Spec. This contract specifies what the user sees, where decisions happen, and how skills chain — without changing the skills themselves. The SDK migration (BL-80 Phase 1) and MCP App (BL-106) must support this contract.
>
> **Date:** 2026-03-01
> **Status:** SPEC — not implemented. Skills and pipeline internals remain unchanged.

---

## Principle

The user never thinks in skills. The user thinks in outcomes:

- "I have research, process it."
- "What did you find?"
- "There are contradictions — which ones matter?"
- "Give me a PRD."

The system translates outcomes into skills internally. The skills don't change. What changes is **what's exposed and how it's presented.**

---

## The Two Modes (+ future Batch)

### Mode 1: Guided (default for new users, MCP App, webapp)

The system drives. The user provides sources and answers questions. The pipeline is invisible.

```
User: "Here are my sources"
  └→ System runs /extract + /analyze automatically
  └→ Presents: "Processed 42 sources. Found 23 insights (all pending) and 5 conflicts."

System: "3 conflicts need your input. The rest can proceed."
  └→ Shows conflicts ranked by impact (how many insights/proposals they affect)
  └→ User resolves one by one (or defers)

User: "Generate a report"
  └→ System suggests: "Based on your project, I recommend Report + Personas."
  └→ Runs /spec (auto for resolved conflicts) + /ship [suggested types]
  └→ Presents deliverable with trace links

User: "What sources mention pricing?"
  └→ Q&A — searches Work layer, returns answer with [IG-XX] refs
  └→ Available at any point, does not interrupt pipeline state
```

**Gates in Guided mode:**

| Gate | Behavior |
|---|---|
| Extract: "Process these files?" | **Auto-approve.** User uploaded them — intent is clear. |
| Analyze: "Approve insights?" | **Summarize.** Show count + top findings. No per-item approval. |
| Spec: "Resolve conflicts" | **STOP.** Present conflicts ranked by impact. User decides. |
| Ship: "Which output?" | **Suggest.** Recommend 1-2 based on project context. User confirms. |

### Mode 2: Pipeline (default for CLI power users, webapp advanced toggle)

The user drives skill by skill. This is today's model, preserved for users who want granular control.

```
User: /extract
  → Runs extract, shows results, stops.

User: /analyze
  → Runs analyze, shows results, stops.

User: /spec
  → Interactive conflict resolution, stops.

User: /ship prd
  → Generates PRD, stops.
```

**Gates in Pipeline mode:** All gates active. Every skill asks for approval before writing. Full transparency. This is the current behavior, unchanged.

### Future: Batch mode (not specified — no user yet)

A third mode for automation/CI/CD is a natural extension (full pipeline, minimal interaction, only conflict gates fire). Not specifying gates or behavior now — no real user is asking for it. When someone does, the architecture supports adding it: same gate interception mechanism, different policy. Mentioned here for completeness, not as an SDK requirement.

---

## Interaction Points

### 1. Source Processing (Extract + Analyze)

**What the user sees (Guided):**

```
┌──────────────────────────────────────────────────┐
│  Processing 42 sources...                         │
│  ████████████████████░░░░ 38/42                   │
│                                                    │
│  Extracted: 847 claims                             │
│  Analyzing...                                      │
│                                                    │
│  ✓ Done                                            │
│                                                    │
│  23 insights found (all pending — ready for review)│
│                                                    │
│  5 conflicts detected                              │
│   • 3 need your input ← click to review            │
│   • 2 informational (different perspectives)       │
│                                                    │
│  Highest convergence:                              │
│   1. [IG-07] Users abandon onboarding at step 3   │
│      (5 sources agree)                             │
│   2. [IG-12] Mobile UX contradicts desktop patterns│
│      ⚠️ Conflict with [IG-03]                      │
│   3. [IG-15] Pricing model unclear to first-time   │
│      users (3 sources)                             │
└──────────────────────────────────────────────────┘
```

**Note:** `/analyze` creates all insights as PENDING. Verification happens later — either manually (approve in UI), via `/spec` (conflict resolution promotes related insights), or in batch (approve all high-convergence insights). The summary shows convergence (how many sources agree), not verification status.

**What happens internally:** `/extract` runs first, writes EXTRACTIONS.md. Then `/analyze` runs, reads extractions, writes INSIGHTS_GRAPH.md + CONFLICTS.md. Two skills, one user action. The index system (BL-101) handles token optimization transparently.

**Pause point:** After analysis completes. The system does NOT auto-run /spec. Conflicts require human decisions.

### 2. Conflict Resolution (Spec)

**What the user sees (Guided):**

Conflicts ranked by impact — how many insights, proposals, or outputs they affect.

```
┌──────────────────────────────────────────────────┐
│  Conflict 1 of 3 — High Impact (affects 4 insights)│
│                                                    │
│  [CF-02] User onboarding expectations              │
│                                                    │
│  Source A (user interviews):                       │
│    "Users want guided onboarding with tutorials"   │
│    → [IG-07], [IG-09]                              │
│                                                    │
│  Source B (usage analytics):                       │
│    "Users skip tutorials, prefer exploration"      │
│    → [IG-11], [IG-14]                              │
│                                                    │
│  ┌─────────┐ ┌─────────┐ ┌──────┐ ┌───────────┐  │
│  │ Keep A  │ │ Keep B  │ │ Merge│ │ Defer     │  │
│  └─────────┘ └─────────┘ └──────┘ └───────────┘  │
└──────────────────────────────────────────────────┘
```

**What happens internally:** `/spec` resolves conflicts via `resolve-conflict.sh`, updates insight statuses via `verify-insight.sh`, then generates/updates STRATEGIC_VISION.md and PROPOSALS.md. All existing logic preserved.

**Pause point:** After each conflict (existing behavior). The system shows how many remain.

### 3. Output Generation (Ship)

**What the user sees (Guided):**

```
┌──────────────────────────────────────────────────┐
│  Ready to generate deliverables.                   │
│                                                    │
│  Based on your project (consulting, multi-         │
│  stakeholder), I recommend:                        │
│                                                    │
│  ● Report — stakeholder summary with findings      │
│  ● Presentation — slide deck for client delivery   │
│                                                    │
│  Also available:                                   │
│  ○ PRD          ○ Personas      ○ Journey Map      │
│  ○ User Stories ○ Lean Canvas   ○ Benchmark UX     │
│  ○ Strategy     ○ Audit                            │
│                                                    │
│  [Generate recommended]  [Customize selection]     │
└──────────────────────────────────────────────────┘
```

**Suggestion logic:** The system infers the recommendation from available context — not a deterministic table but LLM reasoning over two sources:

1. **Source composition** (always available post-analyze): What types of sources were processed? Interview transcripts → UX-heavy. Analytics exports → product-heavy. Strategy documents → strategy-heavy. This is reliable because the system already classified sources during `/extract`.

2. **STRATEGIC_VISION.md domains** (available post-spec): If the vision document exists and has domains defined, the system can reason about which deliverables match the project's focus.

**Fallback:** If signals are ambiguous, default to PRD — the most general-purpose deliverable. The agent asks "What do you need this for?" only if it genuinely can't infer.

**What this does NOT require:** No new fields in PROJECT.md. No `project_type` enum. The suggestion is semantic reasoning, not lookup table. It can be wrong — that's fine, the user confirms or overrides.

**What happens internally:** `/ship [type]` per selected output. If multiple outputs, batch generation in dependency order (L0 → L1 → L2 → L3 per existing batch logic in /ship).

---

## The Orchestrator Skill

The orchestrator lives as a skill `.md` — portable, same as all other skills.

```
.claude/skills/orchestrate/SKILL.md
```

### What it defines

1. **Pipeline mappings** — intent → skill sequence
2. **Gate policies** — which gates auto-approve per mode
3. **State checks** — what to verify before each step (via indexes, not full files)
4. **Suggestions** — how to recommend outputs and prioritize conflicts
5. **Mode selection** — how to detect which mode the user expects

### What it does NOT define

- Skill internals (extract/analyze/spec/ship unchanged)
- File formats (EXTRACTIONS.md, INSIGHTS_GRAPH.md, etc. unchanged)
- Script behavior (verify-insight.sh, resolve-conflict.sh, etc. unchanged)

### Pipeline Definitions

```
Pipeline: process_sources
  Trigger: "analyze", "process", "run", first interaction with sources
  Precondition: 01_Sources/ has files
  Steps:
    1. /extract [mode based on source count]
       Gate: auto-approve (Guided) | ask (Pipeline)
    2. /analyze
       Gate: summarize (Guided) | ask (Pipeline)
    3. Present summary + pending conflicts
       Gate: STOP — wait for user

Pipeline: generate_output
  Trigger: "report", "PRD", "presentation", "ship", "generate"
  Precondition: INSIGHTS_GRAPH exists, check staleness via index
  Steps:
    0. [if sources stale] → run process_sources first
    1. [if conflicts PENDING] → /spec (resolve)
       Gate: interactive — always (conflicts are decisions)
    2. /ship [type]
       Type: suggested (Guided) | explicit (Pipeline) | flag (Batch)
       Gate: confirm selection (Guided) | none (Pipeline/Batch)

Pipeline: incremental_update
  Trigger: "added files", "new sources", "update"
  Precondition: existing EXTRACTIONS.md + new/modified sources
  Steps:
    1. /extract --incremental
       Gate: show delta ("3 new files, 1 modified") — auto-approve (Guided)
    2. /analyze --incremental
       Gate: show delta ("5 new insights, 1 new conflict") — summarize
    3. Present: what changed vs. last run

Pipeline: query (Q&A)
  Trigger: any question about the project, sources, insights, conflicts
  Precondition: Work layer has content (at minimum EXTRACTIONS.md)
  Behavior: NOT a pipeline step — transversal to all modes
  Steps:
    1. Read relevant Work layer files (use indexes when available)
    2. Answer with [IG-XX] / [CF-XX] references
    3. No writes, no state changes, no gates
  Available: at any point, before/during/after pipeline execution
  Note: Q&A does not interrupt pipeline state. User can ask questions
        between process_sources and generate_output without losing context.
```

**Q&A is transversal, not sequential.** It's not a pipeline — it's a capability available at any point. The user can ask "what sources mention pricing?" before running the pipeline, between skills, or after generating deliverables. Q&A reads Work layer files (using indexes for efficiency) and returns answers with traceable references. It never writes files or changes state.

---

## SDK Requirements (derived from this contract)

The SDK migration (BL-80 Phase 1) must make the following possible. It does not need to implement them — it needs to **not prevent them.**

### 1. Sequential skill execution

The agent must be able to run `/extract`, observe its results, and then decide to run `/analyze` — within a single user interaction. Today's agent runtime executes one skill per request. The SDK's agent loop must support multi-step execution.

### 2. Gate suppression via `canUseTool`

The orchestrator must be able to signal "auto-approve this gate" or "summarize instead of asking." This means the approval mechanism can't be hardcoded into skills — skills propose, the orchestrator (or user) decides whether to pause.

**Validated:** The Claude Agent SDK provides `canUseTool` callback with three options: `allow` (auto-approve, optionally with modified input), `deny` (block with reason message), and `ask` (escalate to user). The callback fires for every tool call including `AskUserQuestion`, enabling programmatic interception of approval gates. This is the exact mechanism needed for mode-based gate policies.

**Fallback (if `canUseTool` behavior changes):** The orchestrator preamble instructs the agent directly: "In Guided mode, do not ask confirmation for extract — present only the analyze summary." Less clean but functional. Skills remain unchanged either way.

### 3. State inspection between skills

Between `/extract` and `/analyze`, the orchestrator needs to check: did extract succeed? How many claims? Are there errors? This means the agent must be able to read files and index outputs between skill executions — which the SDK supports natively (Read, Grep, Glob).

### 4. Contextual suggestions

`/ship` needs to recommend output types based on project context. This is LLM reasoning over source composition (from EXTRACTIONS.md sections) + STRATEGIC_VISION.md domains — already within the agent's capability. The orchestrator skill defines the suggestion heuristic; the agent executes it. No new PROJECT.md fields needed.

### 5. Mode detection

The orchestrator needs to know which mode the user expects. In the MCP App, it's always Guided. In the webapp, it defaults to Guided with option to switch. In CLI, it defaults to Pipeline. This is a configuration, not a runtime decision — set by the environment.

```
MCP App:  mode = guided (always)
Webapp:   mode = guided (default) | pipeline (user toggle)
CLI:      mode = pipeline (default) | guided (if orchestrator skill loaded)
```

### 6. Q&A as transversal capability

The agent must support Q&A queries at any point without disrupting pipeline state. This is naturally supported — the agent reads files and responds without writing. The SDK's context management must preserve pipeline state (which skill was last run, which gates were passed) across Q&A interactions within the same session.

---

## What This Contract Does NOT Change

- **Skills remain separate files** — /extract, /analyze, /spec, /ship are independent .md skills
- **Pipeline order unchanged** — extract → analyze → spec → ship is mandatory
- **File formats unchanged** — EXTRACTIONS.md, INSIGHTS_GRAPH.md, etc. same structure
- **Scripts unchanged** — verify-insight.sh, resolve-conflict.sh, etc. same behavior
- **Index system unchanged** — BL-101 works transparently under all modes
- **Gate logic stays in skills** — skills still propose and ask. The orchestrator decides whether to pause or auto-approve. Skills don't know which mode they're in.

---

## Relationship to Backlog Items

| BL | How this contract affects it |
|---|---|
| **BL-80 Phase 1** (SDK migration) | SDK must support: sequential skill execution, gate interception via `canUseTool`, state inspection between skills. This contract is a design input, not a scope addition. |
| **BL-106** (MCP App) | The MCP App IS Guided mode. This contract defines its interaction model. The funnel is: process_sources → resolve conflicts → generate_output. |
| **BL-103** (Markdown rendering) | Summary presentations (insight counts, conflict rankings) need rich rendering. |
| **BL-105** (Checkpoint integrity) | The orchestrator adds a new checkpoint concern: state between chained skills. Deterministic checkpoint from script output (existing BL-105 principle) applies. |
| **Webapp** | Default mode switches from Pipeline to Guided. Pipeline mode available as "Advanced" toggle. No architectural change — just which skill the agent loads on startup. |
