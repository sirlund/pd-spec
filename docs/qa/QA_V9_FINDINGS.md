# QA v9 Findings — v4.25.0 Validation

**Date:** 2026-02-25
**Tester:** Claude Opus 4.6 (automated + Playwright)
**Branch:** main (c3a3c42) → merged to project/timining
**Scope:** 15 test cases from QA_V9_PLAN.md

## Summary

- **15/15 tests passed** (T01 completed post-`/spec` run on 2026-02-25)
- **5 bugs found and fixed** during QA (3 scripts + 2 parser)
- All fixes committed and merged to TIMining

## Test Results

| Test | Result | Notes |
|---|---|---|
| T01 | PASS | `/spec` executed on TIMining — STRATEGIC_VISION.md + PROPOSALS.md (7 DPs) written. 2 parser bugs found and fixed (BUG-QA9-04, BUG-QA9-05) |
| T02 | PASS | After fix — `/api/strategic-vision` returns 7 sections: vision, strategy, 4 principles, 6 internal criteria, 4 domains, 3 value props, 14 open questions |
| T03 | PASS | `/api/proposals` returns 7 DPs organized by domain — user confirmed visual OK for v0.1 |
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

### BUG-QA9-04: strategic-vision parser only matched English headings

**Severity:** High
**Test:** T01, T02
**Observed:** Strategic Vision view showed 17 items in a flat "DESIGN PRINCIPLES (17)" list. Vision and Strategy sections were empty. All content (principles, internal criteria, domains, value props) collapsed into one section.
**Root cause:** Section detection regex was English-only (`/vision/i`, `/domain/i`, `/value/i`). Spanish headings (`Visión` with accent, `Dominio` ≠ `domain`, `Valor` ≠ `value`) fell through without matching, so the parser stayed in the last matched section (`principles`).
**Fix:** Bilingual regex for all sections and fields. New `internal_criteria` section. Spanish field names (Opera en, Pilar líder, Descripción, Casos).
**Commit:** 61a9ee0

### BUG-QA9-05: RichText rendered raw markdown

**Severity:** Medium
**Test:** T02
**Observed:** Vision showed literal `>` blockquote markers. Strategy showed raw `###`, `**bold**`, `| table |` as unformatted text blobs with no line breaks.
**Root cause:** `RichText` component only handled `[IG-XX]` badge replacement. No line break, bold, heading, or table rendering.
**Fix:** Line-by-line renderer with `###` headings, `**bold**`, `*italic*`, `> blockquote`, `| table |` monospace, and proper line spacing. Parser strips `>` from vision blockquotes.
**Commit:** 4fd358e

## Observations

- **OBS-QA9-01:** TIMining has no insights with FROZEN or SUPERSEDED status, so T12 was verified structurally (CSS tokens + component code) rather than visually. Will be validated when `/spec` runs.
- **OBS-QA9-02:** T15 version consistency check fails on TIMining (expected — PROJECT.md has v4.7.0 preserved by merge=ours). Not a real failure.
- **OBS-QA9-03:** Sprite SVG caching caused layout-list icon to not appear until server restart. Hard refresh (Cmd+Shift+R) was insufficient in some browsers.
- **OBS-QA9-04:** `verify-insight.sh` successfully detected 39 cross-file references for IG-SYNTH-01 across 9 output files. Cascade protection works as designed.
- **OBS-QA9-05:** No insights have `Last-updated:` field — freshness dots don't render. Field was introduced in v4.25 but `/spec` only wrote new files, didn't touch insight statuses. Batch backfill pending.
- **OBS-QA9-06:** Strategic Vision view is very linear — all sections stack vertically with heavy scroll. Consider collapsible sections, tabs, or grid layout for future iteration.
