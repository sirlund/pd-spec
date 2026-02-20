# PD-OS Framework

> Reusable agent orchestration patterns extracted from PD-Spec and PD-Build. These primitives emerged organically from intensive AI-agent workflows and apply to any domain — product research, coding, prototyping, data pipelines.

## Extractable Patterns

### 1. State Persistence Layer

**Origin:** PD-Spec BL-41 (checkpoint + memory), BL-45 (mid-skill checkpoints).

Save system with multiple slots and automatic recovery. Analogous to video game save evolution: fixed save points → autosave at key moments → intelligent autosave.

| Component | Role | Frequency |
|-----------|------|-----------|
| **Checkpoint** (autosave slot) | Primary recovery — compact state snapshot | Overwritten after every skill / milestone |
| **Memory log** (cumulative) | Fallback recovery + audit trail | Appended after every action, compacted at threshold |
| **External notes** (user-managed) | Cross-session persistence beyond agent context | Manual |

**Key rules:**
- Write before risk, not after loss
- "No-save zones" during atomic operations (mid-read, mid-edit)
- Preventive checkpoint before operations estimated to consume >30% of context
- Compaction with semantic compression (summarize old entries, keep recent in full)

### 2. Human-in-the-Loop Gate

**Origin:** PD-Spec Agent Mandate #2 (propose-before-execute).

Agent proposes actions as drafts for user approval before writing. No black boxes. User has final veto over any change.

**Applies to:** PR review flows, design mockup approval, data transformation pipelines, any workflow where agent autonomy must be bounded.

### 3. Immutable Input Architecture

**Origin:** PD-Spec 3-layer stack.

```
Read-only inputs → Mutable working state → Derived outputs
```

Inputs are never modified. Working state is the agent's domain. Outputs are always derivable from working state. If working state is lost, re-derive from inputs. If outputs drift, regenerate from working state.

**Applies to:** Build systems (source → objects → binary), data pipelines (raw → transformed → reports), research (sources → analysis → deliverables).

### 4. Delta Detection

**Origin:** PD-Spec SOURCE_MAP (MD5 hashing + incremental processing).

Only process what changed. Hash inputs, compare against last-known state, process only the delta. Avoid full reprocessing on every run.

**Applies to:** CI/CD (only rebuild changed modules), file watchers, build caching, incremental compilation.

### 5. Semantic Log Compression

**Origin:** PD-Spec MEMORY.md compaction (80-line threshold).

Logs grow unbounded. Compress old entries into summaries while preserving recent entries in full. The compression is semantic (an LLM summarizes), not mechanical (truncation). Recent context stays detailed; historical context stays accessible but compact.

**Applies to:** Any long-running agent with growing context — chat histories, execution logs, audit trails.

### 6. Composable Skill Chain

**Origin:** PD-Spec pipeline (/extract → /analyze → /synthesis → /ship).

Skills are independent steps with clear input/output contracts. Each skill reads from a known location, writes to a known location, and logs its execution. Skills can be run individually or chained. Incremental by default.

**Applies to:** Task automation, workflow engines, CI/CD pipelines, data processing chains.

### 7. Structured Escape Hatch

**Origin:** PD-Spec Freemode Protocol.

Not everything fits the pipeline. A structured "off-pipeline" mode allows ad-hoc work while maintaining traceability (logged actions, defined output locations, asset intake protocol). Freedom with guardrails.

**Applies to:** Creative work within structured systems, exception handling in automated workflows, exploratory analysis alongside production pipelines.

---

> These patterns are descriptive, not prescriptive. They document what emerged from real usage across 4 QA cycles and multiple projects. A future PD-OS SDK would formalize them as composable primitives.
