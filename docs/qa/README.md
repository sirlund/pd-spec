# QA Process — PD-Spec

Quality assurance for the PD-Spec engine. Dual-terminal setup: one agent executes skills, another observes and writes findings. The executing agent must NOT write its own evaluation.

## Pipeline

| Step | Who | What | Artifact |
|---|---|---|---|
| 1. PLAN | Developer on main | Write test matrix + decision points | `docs/qa/QA_V{N}_PLAN.md` |
| 2. SETUP | Developer | Merge main → QA worktree, reset state if needed | Engine files updated |
| 3. EXECUTE | Agent in QA terminal | Run skills (unaware it's being tested) | Skill outputs in 02_Work/ |
| 4. OBSERVE | Observer agent on main | Capture output via `script` + poll checkpoints | Evidence in findings |
| 5. EVALUATE | Observer agent on main | Compare evidence against test matrix | Test results |
| 6. DOCUMENT | Observer agent on main | Write findings | `docs/qa/QA_V{N}_FINDINGS.md` |

**Key constraint:** The executing agent (step 3) MUST NOT write findings. Separation of execution and evaluation is the core principle.

## Setup Checklist

### QA worktree

```bash
cd ~/Dev/repos/pd-spec--qa
git merge main -m "engine update to vX.Y.Z"
```

### Terminal capture

Before opening Claude Code in the QA terminal:

```bash
# QA terminal:
script /tmp/qa-session.txt
claude
```

This captures all terminal output to a file the observer can read in real-time.

### Permissions

The QA worktree should have a permissive `.claude/settings.json` to minimize permission prompts during execution. Copy from main and add any skill-specific tools:

```bash
cp ~/Dev/repos/pd-spec/.claude/settings.json ~/Dev/repos/pd-spec--qa/.claude/settings.json
```

### Observer terminal

```bash
# Observer reads live output:
# Bash: tail -100 /tmp/qa-session.txt
# Read: /tmp/qa-session.txt (with offset for latest)

# Observer polls structured state:
# Read: ~/Dev/repos/pd-spec--qa/02_Work/_temp/SESSION_CHECKPOINT.md
# Bash: git -C ~/Dev/repos/pd-spec--qa diff --stat
```

### Decision points

The user still responds to the executing agent's AskUserQuestion prompts (preprocessing options, insight approval, etc.). The test plan should specify which option to choose for each anticipated question, so the user can respond quickly without deliberation.

## Naming Convention

```
QA_V{N}_PLAN.md       — test plan for QA round N
QA_V{N}_FINDINGS.md   — findings from QA round N
```

## Plan Template

```markdown
# QA v{N} Plan — v{X.Y.Z}

> Created: YYYY-MM-DD
> Version under test: v{X.Y.Z}
> Scope: BL-## (description), BL-## (description)

## Setup

- Merge command: `git merge main -m "engine update to vX.Y.Z"`
- State reset: [full reset / incremental / preserve Work layer]
- Terminal capture: `script /tmp/qa-session.txt`

## Source Inventory

[Table of source files used for testing, with relevant metadata]

## Test Matrix

| ID | Test | Expected | BL Ref | Verify |
|---|---|---|---|---|
| T## | Description | Expected behavior | BL-## | How to verify |

## Regression Scenarios

| ID | Risk | Test |
|---|---|---|
| R## | What could break | How to test |

## Anticipated Decision Points

| When | Agent asks | Prescribed answer | Why |
|---|---|---|---|
| /extract Phase 1.5 | Preprocessing options for file X | Option 1 (Aprobar) | Need full preprocessing to test Pass C |
| /analyze | What to do with new insights | Option 1 (PENDING) | Standard for low-convergence insights |

## Success Criteria

- X/X feature tests pass
- X/X regressions clean
- [Specific quality thresholds]

## Execution Order

1. [Ordered list of test phases]

## Rules

- Observe, don't fix — document in findings
- Each test gets PASS / FAIL / PARTIAL / NOT TESTED / SKIPPED + notes
- If a test reveals a bug, log it but do NOT fix mid-QA
- The executing agent does NOT write findings
```

## Findings Template

```markdown
# QA v{N} Findings — v{X.Y.Z}

> Started: YYYY-MM-DD
> Version under test: v{X.Y.Z}
> Scope: BL-## (description), BL-## (description)
> Worktree: pd-spec--qa (qa branch)
> Observation mode: [manual copy-paste / script auto-capture]

## Pre-Test State

- SOURCE_MAP: [reset / preserved]
- EXTRACTIONS: [reset / preserved]
- INSIGHTS_GRAPH + CONFLICTS: [reset / preserved]
- Engine version merged: v{X.Y.Z}

## Test Results

[Results grouped by phase/skill, tables with test ID, status, notes]

## Observations

### OBS-##: Title

[Description, evidence, implications]

## Bugs

### BUG-##: Title

**Severity:** High / Medium / Low
**Reproduction:** [Steps]
**Expected:** [What should happen]
**Actual:** [What happened]
**Root cause:** [Analysis]

## Final Summary

### Score

| Category | PASS | FAIL | NOT TESTED | SKIPPED |
|---|---|---|---|---|
| BL-## (feature) | X | X | X | X |
| Regressions | X | 0 | — | — |
| **Total** | **X** | **X** | **X** | **X** |

### Verdict by BL

| BL | Verdict | Notes |
|---|---|---|
| BL-## | PASS / PARTIAL / FAIL | Summary |

### Recommendations

1. [Priority fixes with BL references]
2. [Test gaps for next round]
```

## History

| Round | Version | Date | Focus | Result |
|---|---|---|---|---|
| QA v2 | v4.1.0 | 2026-02-15 | Extraction + analysis reliability | 13 FIXED, 4 MITIGATED |
| QA v3 | v4.3.0 | 2026-02-16 | Pipeline end-to-end (61 files) | 54/54 extraction, synthesis layer |
| QA v4 | v4.12.0 | 2026-02-20 | BL-43 preprocessing + BL-41 state management | 29 PASS, 3 PARTIAL, 1 FAIL |
| QA v5 | v4.13.0 | 2026-02-21 | BL-49/50/45 — oversized lines, Pass C, checkpoints | 10 PASS, 4 FAIL, 1 NT, 2 SKIP |
