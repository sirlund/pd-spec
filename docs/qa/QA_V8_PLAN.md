# QA v8 Plan — v4.24.0 Validation

## Automated Checks
Run `./scripts/validate-fixes.sh` — all 6 checks must pass (T06).

## Manual Test Cases

| ID | Test | Expected |
|---|---|---|
| T01 | Open app with TIMining data → Insights view → check category chips | No session headers (no dates, no "--file mode" text) in filter chips |
| T02 | /resolve on insight where ALL evidence items have [INTERNAL] tag | Authority gate fires, blocks VERIFIED, offers options |
| T03 | /extract --full on TIMining (38+ VERIFIED) | Warning with count shown, asks confirmation before proceeding |
| T04 | Freemode request without "skip audit" in prompt | Self-audit prefix (⚑) appears before proposal |
| T05 | ./scripts/integrity-check.sh ~/Dev/repos/pds--timining | Runs without error, outputs table, reports clean or known orphans |
| T06 | ./scripts/validate-fixes.sh | All 6 checks pass, exit 0 |

## Known Open Items (Not in Scope)

| ID | Issue | Status | Notes |
|---|---|---|---|
| OBS-68 | Convergence update screen abstract in terminal | Open | → BL-92 (app action candidate) |
| OBS-69 | Convergence updates have no app UI | Open | Architecture gap — needs design proposal |
| BL-97 #2 | Source deletion impact count | Deferred | Requires deeper pipeline changes |
| BL-97 #4 | Documentation: recommended workflow for re-processing | Deferred | |
| BL-94 L2/L3 | Claim-level + semantic integrity checks | Deferred | Requires LLM, future /audit integration |
