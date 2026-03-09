# QA Plan: discover-sources.sh

## Context

`discover-sources.sh` implemented and committed (`27f78e0`). Passed basic tests (TIMining, first-run, error codes, ~2s performance). Pending validations before production-ready.

---

## Pending Validations

### 1. Integration test: Agent Runtime (CRITICAL)
- Merge changes to TIMining worktree, rebuild, restart server
- Run `/extract` from browser
- **Verify:** agent uses `run_script discover-sources.sh` instead of multiple `list_files`
- **Verify:** agent correctly parses output and processes only NEW + MODIFIED
- **Metric:** compare total cost vs $1.37+ before

### 2. MOVED detection
- Not tested (0 moved in all tests)
- **Test:** rename a file in 01_Sources/ without changing content, run script
- Expected: 1 MOVED, 0 NEW, 0 DELETED for that file

### 3. RETRY classification
- Not tested (0 retry in all tests)
- **Test:** manually edit SOURCE_MAP.md, set status `error` on one row, run script
- Expected: that file appears in RETRY

### 4. PENDING_HEAVY classification
- Plan expected 6, result was 0 (TIMining has no pending-heavy in current SOURCE_MAP)
- **Test:** manually edit SOURCE_MAP.md, set status `pending-heavy` on one row
- Expected: that file appears in PENDING_HEAVY count, NOT in TOTAL_TO_PROCESS

### 5. Empty 01_Sources/
- **Test:** `mkdir /tmp/empty-src && ./scripts/discover-sources.sh /tmp/empty-src 02_Work/SOURCE_MAP.md`
- Expected: 0 NEW, N DELETED (all from SOURCE_MAP)

### 6. Additional Unicode edge cases
- Fixed U+202F (narrow no-break space). Still need to verify:
  - U+00A0 (non-breaking space) — common in Office doc filenames
  - Accents/ñ in paths (tildes, eñe)
- **Test:** create file with ñ and NBSP in name, add to SOURCE_MAP with regular space

### 7. PENDING_HEAVY in output
- Currently shows count only, not details
- **Verify:** this is intentional (plan says "counts only" for UNCHANGED and PENDING_HEAVY)
- Agent should NOT attempt to reprocess pending-heavy automatically

### 8. /extract SKILL.md hint
- `claude.js` has the hint, but should `/extract` SKILL.md also mention it?
- Check `.claude/skills/extract/SKILL.md` — if agent reads the skill but not the preamble, it could ignore the hint
- Possible fix: add instruction in SKILL.md too

---

## Execution Order

| # | Test | Risk | Effort |
|---|---|---|---|
| 1 | MOVED detection | Low | 2 min — rename + run |
| 2 | RETRY + PENDING_HEAVY | Low | 3 min — edit SOURCE_MAP + run |
| 3 | Empty sources | Low | 1 min |
| 4 | Additional Unicode | Medium | 3 min — create test files |
| 5 | Review SKILL.md hint | Medium | 2 min — read + possible edit |
| 6 | Integration test browser | High | 10 min — merge, rebuild, restart, run /extract |

Tests 1-5 are purely CLI, no risk. Test 6 requires the full merge→rebuild→restart cycle.

---

## Relevant Files

| File | Role |
|---|---|
| `scripts/discover-sources.sh` | Script under test |
| `app/server/agent-runtime.js:14-20` | ALLOWED_SCRIPTS |
| `app/server/claude.js:148-155` | Preamble hint |
| `.claude/skills/extract/SKILL.md` | Possible place for additional hint |
| `02_Work/SOURCE_MAP.md` (TIMining) | Real fixture for tests |
