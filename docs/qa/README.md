# QA Process — PD-Spec

Quality assurance for the PD-Spec engine. Each QA round has two artifacts:

- **PLAN** — what to test (written before execution)
- **FINDINGS** — what was found (written during execution)

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

[Commands to prepare the test environment]

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

## Success Criteria

- X/X feature tests pass
- X/X regressions clean
- [Specific quality thresholds]

## Execution Order

1. [Ordered list of test phases]

## Rules

- Observe, don't fix — document in findings
- Each test gets PASS/FAIL/PARTIAL/NOT TESTED + notes
- If a test reveals a bug, log it but do NOT fix mid-QA
```

## Findings Template

```markdown
# QA v{N} Findings — v{X.Y.Z} Validation

**Test Date:** YYYY-MM-DD
**Test Environment:** [project, source count]
**Version Tested:** v{X.Y.Z}
**QA Plan:** docs/qa/QA_V{N}_PLAN.md

## Pre-Test State

[Current state of Work layer files]

## Deviations from Plan

| Plan | Actual | Impact |
|---|---|---|
| ... | ... | ... |

## Phase A: [Feature Name]

### [T##] Test description

**Command:** [what was run]
**Expected:** [what should happen]
**Result:** PASS / FAIL / PARTIAL / NOT TESTED
**Notes:** [observations]

## Bugs Found

| Bug | Severity | Summary | Root Cause |
|---|---|---|---|
| QA{N}-BUG-## | High/Medium/Low | ... | ... |

## Observations

| Observation | Summary |
|---|---|
| QA{N}-OBS-## | ... |

## Final Summary

| Phase | Tests | PASS | PARTIAL | FAIL | NOT TESTED |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

## Recommendations

[Priority fixes, test gaps for next round]
```

## History

| Round | Version | Date | Focus | Result |
|---|---|---|---|---|
| QA v2 | v4.1.0 | 2026-02-15 | Extraction + analysis reliability | 13 FIXED, 4 MITIGATED |
| QA v3 | v4.3.0 | 2026-02-16 | Pipeline end-to-end (61 files) | 54/54 extraction, synthesis layer |
| QA v4 | v4.12.0 | 2026-02-20 | BL-43 preprocessing + BL-41 state management | 29 PASS, 3 PARTIAL, 1 FAIL |
| QA v5 | v4.13.0 | TBD | BL-49/50/45 — oversized lines, Pass C, checkpoints | Pending |
