# QA Wave 2.1 — SDK Migration E2E + Extract Hash Fix

**Date:** 2026-03-01 → 2026-03-02
**Tester:** Nicolas + Claude
**Branch:** main (engine) → merge into qa
**Dataset:** TIMining-QA (trimmed): 19 files (12 md, 3 png, 3 docx, 1 heic)
**Server:** PORT=3001 on pd-spec--qa worktree

---

## Test Results

| Test | Description | Status | Notes |
|---|---|---|---|
| T01 | discover-sources.sh exposes md5 hashes | **PASS** | 4th column in NEW/MODIFIED/RETRY output |
| T02 | /extract uses real hashes (not LLM-fabricated) | **PASS** | All 16 SOURCE_MAP entries match discover-sources.sh |
| T03 | Re-run shows 0 MODIFIED (hash traceability) | **PASS** | 16 UNCHANGED, 3 PENDING_HEAVY, 0 MODIFIED |
| T04 | Batched writes (no output token hang) | **PASS** | Wrote in 2-3 batches. First attempt hung on single Write |
| T05 | Express mode classifies DOCX as heavy | **PASS** | 3 docx → pending-heavy, 16 light processed |
| T06 | Dashboard source count matches filesystem | **PASS** | All 4 methods report 19 |
| T07 | Browse API source count matches dashboard | **PASS** | /api/source-files returns 19 |
| T08 | EXCLUDED_SOURCE_NAMES aligned (api.js ↔ script) | **PASS** | Replaced startsWith('_') with explicit list |
| T09 | Tab switch kills running extract (BL-108) | **KNOWN BUG** | Unmount aborts SSE → server kills SDK query |
| T10 | Cancel mid-extract | **PASS** | Clean stop, no hanging connections |

**Score:** 8 PASS / 1 KNOWN BUG / 0 FAIL

---

## Bugs Found & Fixed

| Bug | Root Cause | Fix | Commit |
|---|---|---|---|
| SOURCE_MAP hashes fabricated by LLM | discover-sources.sh didn't expose hashes; SKILL.md had fake hash example | Script outputs hash as 4th column; SKILL.md uses `<hash-from-script>` | `c883a12` |
| /extract hangs at Phase 3 (Write) | Agent tries single Write for all extractions → output token limit | SKILL.md: "CRITICAL: Write in batches, NEVER all at once" | `8be7dc5` |
| scanSourceFiles excludes _FIELD_NOTES.md | `startsWith('_')` too broad | EXCLUDED_SOURCE_NAMES explicit Set matching script | `95d5259` |
| Dashboard vs Browse count mismatch (prev session) | Different filter logic in two endpoints | Unified _-prefix filter → now both use EXCLUDED_SOURCE_NAMES | `95d5259` |
| SOURCE_MAP parser stops at blank lines (prev session) | `break` on non-pipe lines | Changed to `continue` | `a09da8f` |
| Unicode whitespace inflates untracked count (prev session) | U+202F in macOS filenames vs U+0020 in SOURCE_MAP | normalizePath helper | `45804cb` |

---

## Performance Metrics

| Metric | Value |
|---|---|
| Extract time | 7.5 min |
| Extract cost | $1.18 (16 light files) |
| Cost per file | ~$0.07 |
| Claims extracted | 125 |
| Output tokens | 19,338 |
| Dataset | 19 files (12 md, 3 png, 1 heic, 3 docx deferred) |

---

## Observations

### OBS-W2.1-01: SOURCE_MAP parser stops at blank lines
**Severity:** HIGH
**File:** `app/server/parsers/source-map.js`
**Finding:** Parser did `break` on non-`|` lines. SOURCE_MAP.md has blank lines between row groups. Parser only read 54 of 75 rows → `extracted` count was wrong.
**Fix:** `break` → `continue` (commit `a09da8f`)
**Status:** FIXED

### OBS-W2.1-02: scanSourceFiles counts metadata files as sources
**Severity:** HIGH
**File:** `app/server/api.js` (scanSourceFiles)
**Finding:** `_CONTEXT.md`, `_FIELD_NOTES_TEMPLATE.md`, etc. counted as sources. Inflated source count from ~74 to 85. Already filtered directories with `_` prefix but not files.
**Fix:** Added file exclusion filter (commit `8405586` + `8d00343`)
**Status:** FIXED (but see OBS-W2.1-03)

### OBS-W2.1-03: startsWith('_') filter too aggressive — excludes _FIELD_NOTES.md
**Severity:** MEDIUM
**File:** `app/server/api.js` (scanSourceFiles + browse endpoint)
**Finding:** Initial fix used `startsWith('_')` which also excluded `_FIELD_NOTES.md` — a legitimate source with claims. Inconsistent with `discover-sources.sh` `EXCLUDE_NAMES` list.
**Fix:** Replaced with explicit `EXCLUDED_SOURCE_NAMES` set matching script (commit `95d5259`)
**Status:** FIXED

### OBS-W2.1-04: Unicode whitespace mismatch — U+202F vs U+0020
**Severity:** HIGH
**File:** `app/server/api.js` (untracked calculation)
**Finding:** macOS stores filenames with U+202F (narrow no-break space) before "AM"/"PM" in timestamps. SOURCE_MAP has U+0020 (regular space). NFC normalization doesn't fix this — they're different characters. Result: 20 Workshop PNGs appeared as "untracked" despite being extracted.
**Note:** `discover-sources.sh` already handles this with `normalize_path()`. Only the dashboard comparison was affected.
**Fix:** Added whitespace normalization in api.js comparison (commit `45804cb`)
**Status:** FIXED

### OBS-W2.1-05: Fabricated MD5 hashes in SOURCE_MAP
**Severity:** HIGH
**File:** `scripts/discover-sources.sh` + `.claude/skills/extract/SKILL.md`
**Finding:** ~32 entries in SOURCE_MAP have LLM-fabricated sequential hashes (`a1b2c3d4e5f6...`, `b2c3d4e5f6a7...`) instead of real MD5. Causes `discover-sources.sh` to report all as MODIFIED on every run → unnecessary re-extracts.
**Root cause (dual):**
1. Script computes hashes internally but didn't expose them in output → agent can't "reuse" them
2. SKILL.md example table used fake hash `a1b2c3d4e5f6` → LLM copied the pattern
**Fix:** Script now outputs hash as 4th field; SKILL.md example updated (commit `c883a12`)
**Status:** FIXED (engine). Old SOURCE_MAP data self-heals on next extract.

### OBS-W2.1-06: Dashboard "51 new sources" was cascade of 3 bugs (TIMining)
**Severity:** INFO (root causes fixed above)
**Finding:** In the TIMining worktree, the screenshot showing "54/85 (64%) — 51 new sources not yet extracted" was a cascade:
- 85 sources (inflated by metadata files — OBS-02)
- 54 extracted (parser truncated — OBS-01)
- 51 untracked (85 FS paths minus ~34 that matched 54 map paths after Unicode failures — OBS-04)

**Fix progression (TIMining dataset):**

| Metric | Original | Fix 1+2 (parser + metadata) | Fix 3 (Unicode) | Fix 4 (EXCLUDED_NAMES) |
|---|---|---|---|---|
| Sources | 85 | 72 | 72 | 75 |
| Extracted | 54 | 65 | 65 | 65 |
| Untracked | 51 | 9 | 9 | 10 |

Sources went from 72 → 75 because Fix 4 recovered 3 `_FIELD_NOTES.md` files (real sources with claims) that `startsWith('_')` had incorrectly excluded. The 10 remaining untracked are legitimate unextracted files (new .clean.md versions, etc.). Numbers now add up correctly.
**Status:** RESOLVED by fixes above

### OBS-W2.1-07: Extract cleanup deletes PLAN files in _temp
**Severity:** LOW
**File:** `.claude/skills/extract/SKILL.md` (cleanup step)
**Finding:** Extract Phase 4c runs `find 02_Work/_temp -type f ! -name 'SESSION_CHECKPOINT.md' ! -name '*_normalized.md' -delete`. This deleted a historical PLAN file that was committed but shouldn't have been in `_temp` long-term.
**Status:** NOT FIXED — minor. Plan files shouldn't persist in _temp anyway.

### OBS-W2.1-08: Extract cost improvement — TIMining $1.77 (from $2.32), QA $1.18
**Severity:** INFO
**Finding:** SKILL.md optimization (use `discover-sources.sh` as single source of truth, parallel reads, no redundant exploration) reduced TIMining full extract cost ~24% ($2.32 → $1.77, 43 files). QA trimmed dataset (16 light files) cost $1.18 (~$0.07/file). Remaining cost is accumulated history per turn — needs BL-80-P2 (model routing with Haiku) for further reduction. Target: <$0.50.
**Status:** TRACKED as BL-80-P2 in backlog

### OBS-W2.1-09: BL-57 (Move/Delete Detection) is correctly implemented
**Severity:** INFO
**Finding:** Initially suspected as broken. Investigation confirmed `discover-sources.sh` sections 5-6 detect DELETED and MOVED correctly. SKILL.md steps 9 and Phase 4 handle both cases. Script reports 0 DELETED, 0 MOVED for TIMining — files are where they should be.
**Status:** VERIFIED working

### OBS-W2.1-10: Extract hangs at Phase 3 on single Write
**Severity:** HIGH
**File:** `.claude/skills/extract/SKILL.md`
**Finding:** Agent accumulated 16 file extractions in context then attempted one giant Write call → hit output token limit → hung indefinitely. Original instruction "Checkpoint after each folder" was too subtle.
**Fix:** Upgraded to "CRITICAL: Write in batches, NEVER all at once" (commit `8be7dc5`)
**Status:** FIXED

### OBS-W2.1-11: Agent processes raw .md when .clean.md exists
**Severity:** LOW
**Finding:** 4 sesiones-idemax files have both `.md` and `.clean.md` versions. Agent correctly chose `.clean.md` for claims but also processed the raw `.md` (0 claims extracted). Wastes a Read turn + SOURCE_MAP entry.
**Status:** NOT FIXED — minor optimization for future SKILL.md update

### OBS-W2.1-12: Tab switch kills running extract (BL-108)
**Severity:** CRITICAL
**Finding:** Switching tabs unmounts AgentView → aborts SSE → server kills SDK query. User lost a $5+ /extract mid-execution. Cannot check dashboard during long runs.
**Status:** TRACKED as BL-108 (P1)

---

## Backlog Items Created

- **BL-108** (P1/M): Agent View State Persistence — survive tab switches
- **BL-109** (P2/S): Image Read Cost — model routing for visual extraction
