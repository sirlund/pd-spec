# QA v9 Findings — v4.25.0 Validation

**Date:** 2026-02-25
**Tester:** Claude Opus 4.6 (automated + Playwright)
**Branch:** main (c3a3c42) → merged to project/timining
**Scope:** 15 test cases from QA_V9_PLAN.md

## Summary

- **14/15 tests passed**, 1 skipped (T01: requires `/spec` skill run)
- **3 bugs found and fixed** during QA
- All fixes committed, squashed, and merged to TIMining

## Test Results

| Test | Result | Notes |
|---|---|---|
| T01 | SKIP | Requires `/spec` run — out of scope for automated QA |
| T02 | PASS | `/api/strategic-vision` returns vision, strategy, open_questions |
| T03 | PASS | `/api/proposals` returns empty array (template, expected) |
| T04 | PASS | `/api/search` responds with results |
| T05 | PASS | `next-id.sh ig` → IG-23, `synth` → IG-SYNTH-22, `cf` → CF-14, `dp` → DP-01 |
| T06 | PASS | After hotfix — `next-id.sh dp` returns DP-01 on empty file |
| T07 | PASS | `count-statuses.sh` → VERIFIED: 38, INVALIDATED: 5, MERGED: 1, Total: 44 |
| T08 | PASS | After fix — freeze IG-SYNTH-01 (39 refs, HIGH cascade), unfreeze back |
| T09 | PASS | `reset.sh --work` restores STRATEGIC_VISION.md + PROPOSALS.md templates |
| T10 | PASS | Freshness dot: green (1d), yellow (16d), red (421d) — Playwright verified |
| T11 | PASS | `Last-updated: 2025-01-01` → red stale dot with "421d ago" tooltip |
| T12 | PASS | FROZEN/SUPERSEDED: tokens, badges, card-accents all defined in CSS |
| T13 | PASS | Back/forward preserves FileBrowser selectedFile + preview — user confirmed |
| T14 | PASS | Nested folders indent with border-left, visible only when expanded — user confirmed |
| T15 | PASS | `validate-fixes.sh` 27/28 (version consistency N/A on project branch) |

## Bugs Found

### BUG-QA9-01: next-id.sh fails on empty file

**Severity:** Medium
**Test:** T06
**Observed:** `next-id.sh dp PROPOSALS.md` exits with error code 1 when no `[DP-XX]` IDs exist in the file. Script never reaches the fallback "start at 01" logic.
**Root cause:** `grep -oE` returns exit code 1 when no matches found. With `set -euo pipefail`, the pipeline terminates before the `if [ -z "$NUMBERS" ]` guard.
**Fix:** Added `|| true` to the grep pipeline: `NUMBERS=$(grep -oE ... 2>/dev/null | sed ... | sort -n || true)`
**Commit:** a28f2bf (squashed into c44a7d3)

### BUG-QA9-02: verify-insight.sh fails to extract current status

**Severity:** High
**Test:** T08
**Observed:** `verify-insight.sh --freeze IG-SYNTH-01` exits with error — `CURRENT_STATUS` is empty.
**Root cause:** Awk range expression `/^### \[IG-SYNTH-01\]/,/^### \[/` — the end pattern `^### \[` matches the start line itself, so awk captures only the header line (no body content, no `Status:` line).
**Fix:** Replaced awk range with explicit found-flag approach: match start line, set `found=1; next` to skip it, then print lines until next `### [`.
**Commit:** c3a3c42

### BUG-QA9-03: verify-insight.sh cascade integer comparison error

**Severity:** Low (cosmetic — script still works with --force)
**Test:** T08
**Observed:** `[: 0\n0: integer expression expected` warnings during cascade check.
**Root cause:** `grep -c` output contained trailing whitespace or newline characters. When captured into variable and compared with `-gt`, bash couldn't parse it as integer.
**Fix:** Refactored cascade check from subshell function to inline loop. Clean `grep -c` output with `tr -d '[:space:]'` before comparison.
**Commit:** c3a3c42 (squashed with BUG-QA9-02)

## Observations

- **OBS-QA9-01:** TIMining has no insights with FROZEN or SUPERSEDED status, so T12 was verified structurally (CSS tokens + component code) rather than visually. Will be validated when `/spec` runs.
- **OBS-QA9-02:** T15 version consistency check fails on TIMining (expected — PROJECT.md has v4.7.0 preserved by merge=ours). Not a real failure.
- **OBS-QA9-03:** Sprite SVG caching caused layout-list icon to not appear until server restart. Hard refresh (Cmd+Shift+R) was insufficient in some browsers.
- **OBS-QA9-04:** `verify-insight.sh` successfully detected 39 cross-file references for IG-SYNTH-01 across 9 output files. Cascade protection works as designed.
