# QA Wave 1 — "Flujo Desbloqueado" Findings

**Date:** 2026-02-26
**Tester:** Nicolas + Claude (observer)
**Branch:** main (engine) → merge into project/timining
**Project data:** 44 insights, 13 conflicts, 59 extractions, ~72 source files

---

## Test Results

| Test | Description | Status | Notes |
|---|---|---|---|
| T01 | Approve insight (InsightCard) | **PASS** | OBS-W1-02 (flicker) |
| T02 | Reject insight with reason | **PASS** | OBS-W1-03, OBS-W1-04 |
| T03 | Resolve conflict directly | **PASS** | OBS-W1-05 |
| T04 | Script error handling (curl) | **PASS** | All 4 cases |
| T05 | Settings panel opens/closes | **PASS** | X button + click-outside |
| T06 | Connect with valid API key | **PASS** | Green dot, green gear border, survives refresh |
| T07 | Connect with invalid API key | **PASS** | "Invalid API key" shown |
| T08 | Disconnect | **PASS** | Reverts to disconnected, survives refresh |
| T09 | Session expiry (manual) | SKIP | |
| T10 | Q&A without API key | **PASS** | Empty state correct |
| T11 | Q&A basic question | **PASS** | Response with CF-XX refs, badges clickable, 31K tokens |
| T12 | Q&A with insight references | PENDING | |
| T13 | Q&A follow-up (stateless) | PENDING | |
| T14 | /extract from browser | **IN PROGRESS** | Blocked by Tier 1 rate limit (30K ITPM) |
| T15 | /analyze from browser | PENDING | |
| T16 | /spec from browser | PENDING | |
| T17 | Cancel mid-pipeline | PENDING | |
| T18 | Clear log | PENDING | |
| T19 | WebSocket live updates | PENDING | |
| T20 | Concurrent browser tabs | PENDING | |
| T21 | Server restart recovery | **PASS** | Session lost (in-memory), error message clear |
| T22 | Large file write safety | PENDING | Backup dir confirmed created |
| T23 | Path traversal protection | PENDING | |
| T24 | Sidebar navigation from Agent | PENDING | |

**Score:** 11 PASS / 1 IN PROGRESS / 12 PENDING / 1 SKIP

---

## Bugs Fixed During QA

### BUG-W1-01 — verify-insight.sh duplicates Last-updated line
**Test:** T01
**Severity:** Medium
**Root cause:** Script regex `^Last-updated: ` didn't match `**Last-updated:**` (bold format). Added new line instead of replacing existing one.
**Fix:** Changed regex to `^\*{0,2}Last-updated:\*{0,2}` and always writes with bold format.
**Commit:** `7a34e7d`

### BUG-W1-02 — resolve-conflict.sh awk range bug
**Test:** T03
**Severity:** High
**Root cause:** Two issues: (1) awk range `/^### \[CF-05\]/,/^### \[/` closed immediately because CF-05's header matched both start AND end patterns. (2) `sed` pattern `^Status: *PENDING` didn't match `Status: PENDING — Flagged (...)` suffix.
**Fix:** Complete rewrite using flag-based awk instead of range patterns.
**Commit:** `e162113`

### BUG-W1-03 — Raw JSON error in Settings panel
**Test:** T06 (invalid key / insufficient credits)
**Severity:** Low
**Root cause:** Session endpoint catch block only handled `err.status === 401`. Other errors (400, 429) passed raw `err.message` from Anthropic SDK which contains full JSON response.
**Fix:** Extract `err.error?.error?.message` for human-readable message. Return appropriate HTTP status.
**Commit:** Not yet committed.

### BUG-W1-04 — No loading indicator while waiting for first SSE response
**Test:** T11, T14
**Severity:** Medium
**Root cause:** "Processing..." spinner only rendered inside `{groupedLog.length > 0 && (` block. When request sent but no SSE events received yet, log is empty → no spinner → blank screen.
**Fix:** Changed condition to `{(groupedLog.length > 0 || running) && (`.
**Commit:** Not yet committed.

### BUG-W1-05 — Raw JSON error in SSE agent loop
**Test:** T14
**Severity:** Low
**Root cause:** Same pattern as BUG-W1-03 but in the SSE error handler. Rate limit (429) and overloaded (529) errors showed raw SDK message.
**Fix:** Added retry logic (3 attempts, 15s/30s/45s backoff) for 429/529. Extract friendly message on final failure.
**Commit:** Not yet committed.

### BUG-W1-06 — Interaction response triggers "Cancelled" instead of continuing
**Test:** T14
**Severity:** High
**Root cause:** When the SSE connection closes after sending `waiting` (to pause for user interaction), `req.on('close')` sets `conv.aborted = true`. When the user responds and a new POST arrives, the agent loop sees `aborted === true` and immediately sends "Cancelled" instead of continuing with the tool_result.
**Fix:** Reset `conv.aborted = false` when handling an interaction response (line 188, claude.js).
**Commit:** Not yet committed.

---

## Observations

### OBS-W1-01 — verify-insight.sh lacks INVALIDATED → PENDING transition
**Test:** T01 setup
No way to transition an INVALIDATED insight back to PENDING without manual file edit. May be intentional (invalidation = permanent decision) but limits testing flexibility.

### OBS-W1-02 — Flicker on card action (approve/reject)
**Test:** T01, T02
**Status:** RESOLVED (v4.28.2)
When approving/rejecting, the action buttons disappear briefly and reappear before the card updates to the new status. Root cause: `useLiveData` sets `loading: true` on refetch → `loading || !data` guard unmounts entire list → scroll jumps to top. Secondary: `verify-insight.sh` didn't match `**Status:**` bold format written by `/analyze`. Tertiary: synthesized insights (`IG-SYNTH-XX`) had no Status field at all.
**Fixes (4 commits):**
1. `InsightsView.jsx` — changed guard to `!data` so old data stays visible during refetch (no unmount)
2. `verify-insight.sh` — grep/awk accept bold `**Status:**`, fallback to PENDING when field missing, insert Status after heading for synthesized insights
3. `InsightCard.jsx` — optimistic UI via `localStatus` (instant badge + button update, no flash), spinning loader icon on approve button (no width change)
4. `InsightCard.jsx` + `components.css` — slide-out animation (`card-exit` class, 0.45s) when card exits filtered view (e.g. PENDING tab); no animation on "All" tab

### OBS-W1-03 — "Send" button has confusing red color
**Test:** T02
The "Send" button for submitting rejection reason uses `btn-reject` styling (red). Visually confusing — it's a confirmation action ("send this reason"), not a rejection itself.

### OBS-W1-04 — Rejection reason not shown on invalidated card
**Test:** T02
After invalidating an insight, the card doesn't display the rejection reason. The parser captures `Status: INVALIDATED — reason` but InsightCard doesn't render it.

### OBS-W1-05 — Brief collapse glitch on conflict resolve
**Test:** T03
**Note:** Same root cause family as OBS-W1-02. ConflictsView has identical `loading || !data` pattern. Fix pending (not in v4.28.2 scope).
After resolving a conflict, the textarea and "Resolve now" button collapse briefly (button visible but empty for ~1s) before the WebSocket update removes the action area entirely.

### OBS-W1-06 — Markdown not rendered in Q&A response
**Test:** T11
Raw markdown visible in Agent log (`##`, `**`, `###`). The `formatText()` function only converts [IG-XX]/[CF-XX] to badges but doesn't render markdown. Needs RichText component or a library like `marked`.

### OBS-W1-07 — Q&A response token cost
**Test:** T11
31K tokens ($0.10+) for a single Q&A question. The system prompt loads 4 full Work layer files as context. Consider truncation or summarization for cost efficiency.

### OBS-W1-08 — Agent state lost on navigation
**Test:** T11
Navigating away from Agent view (e.g., clicking a [CF-XX] badge) unmounts the component and loses all state (log, response, mode). Returning shows a blank Agent view.

### OBS-W1-08b — Agent response history (user idea)
User suggested: instead of just preserving state, build a list of past responses (each as a collapsible card) that persists across navigation. Good BL candidate.

### OBS-W1-09 — Session management improvements needed
**Test:** T06, T08, T21
User feedback:
- Session should optionally survive server restarts (encrypted file with TTL)
- Configurable TTL (8h → 24h → 30d), reference: Figma API key lasts 30 days
- Both env-var and manual input should be available (implemented during QA)

### OBS-W1-10 — Agent runtime inefficient for file discovery
**Test:** T14
The /extract skill prompt is designed for Claude Code with native tools (Read, Grep, Glob). The agent runtime tools (read_file, search_files, list_files) are more limited, causing the agent to make many redundant calls for directory discovery. A single recursive listing tool with hashes would eliminate most of the loop.

### OBS-W1-11 — Tier 1 rate limit (30K ITPM) too low for /extract
**Test:** T14
With ~72 source files, /extract accumulates large context (EXTRACTIONS.md alone is 181KB ≈ 45K tokens). Tier 1 rate limit (30K input tokens/min) makes single requests exceed the limit. Mitigated by context trimming (truncate old tool results), but Tier 2 ($40 cumulative, 450K ITPM) is the real fix.

### OBS-W1-13 — Agent needs `discover_sources` tool for efficient delta detection
**Test:** T14
/extract spends ~15 tool calls doing exploratory directory listing to find new/modified files. A single `discover_sources` tool (bash script: `find 01_Sources/ | md5` vs SOURCE_MAP.md) would return `{ new: [...], modified: [...], deleted: [...], unchanged: N }` in one call. Critical for cost efficiency — current approach wastes $0.30+ on discovery alone.

### OBS-W1-14 — Interaction panel doesn't render markdown
**Test:** T14
The `ask_confirmation` interaction panel renders raw markdown — `**bold**` shows as literal asterisks, emojis render as text. The interaction panel needs the same RichText treatment as the main log (OBS-W1-06). Affects all three interaction tools (ask_confirmation, ask_selection, ask_text).

### OBS-W1-15 — Discovery cost for incremental /extract ($1.37 for 1 new file)
**Test:** T14
Incremental /extract with 59 existing + 1 new file cost $1.37 just in the discovery phase (~20 list_files + read SOURCE_MAP + hash attempts). The `discover_sources` tool (OBS-W1-13) would reduce this to ~$0.05. Current cost breakdown: discovery $1.37, extraction TBD — total for 1 new file approaching $2.00.

### OBS-W1-16 — Claude Code Max usage drain from large CLAUDE.md
**Test:** Full session
CLAUDE.md (~4K+ lines) is loaded into every single API call as system context. Combined with auto-memory, plan files, and compaction summaries, each message exchange costs ~30-40K input tokens before any actual work. A long QA session (~50+ exchanges) with subagent calls can drain 95% of a Max plan's usage in one sitting. Mitigations to explore:
- **Slim CLAUDE.md** — split into core rules (always loaded) + reference sections (loaded on demand via Read)
- **Shorter sessions** — `/compact` more often, 1 topic per session
- **Fewer subagents** — use direct Grep/Read instead of Task agents when possible
- **Layered context** — only load skill-relevant sections of CLAUDE.md per message

### OBS-W1-17 — Checkpoint records wrong insight ID after invalidation

**Found:** Field usage (TIMining, 2026-02-26). User invalidated IG-02 from UI with reason "esto es interno de idemax". Script executed correctly (IG-02 → INVALIDATED in INSIGHTS_GRAPH.md). However, SESSION_CHECKPOINT.md recorded the change as IG-15 instead of IG-02. IG-15 ("GPS degradadas") was never touched and remained VERIFIED.

**Root cause:** The checkpoint is written by the LLM as a narrative summary after actions. The LLM confused the insight ID when summarizing. The script pipeline (`scripts.js` → `verify-insight.sh`) is correct — the file was never wrong, only the checkpoint record.

**Impact:** Medium. Stale/incorrect checkpoint causes confusion on session recovery and integrity checks. Could propagate as incorrect context into future /spec runs.

**Improvement:** Checkpoint insight-status changes should be derived from deterministic script output (e.g., `verify-insight.sh` stdout confirms which ID was changed), not from LLM memory of what it asked the script to do.

### OBS-W1-18 — Astro reserves `layout` frontmatter field
**Found:** BL-102 showcase implementation (2026-02-28). Using `layout` as a content collection schema field causes Astro to interpret it as a layout module path and attempt to import it (e.g., `layout: "cover"` → tries to resolve `cover` as a `.astro` file). Build fails with `Rollup failed to resolve import`.
**Fix:** Renamed field to `slideLayout` in schema and all MDX frontmatter.
**Impact:** Low. Caught immediately on first build. Worth documenting because `layout` is an intuitive field name for presentation slides.

### OBS-W1-19 — Astro 5 glob loader changes `render()` API
**Found:** BL-102 showcase implementation (2026-02-28). With the glob content loader (`loader: glob({...})`), collection entries no longer have a `.render()` method. Must use the named export `render(entry)` from `astro:content` instead. Astro docs may still show the old pattern in some examples.
**Before:** `const { Content } = await slide.render();`
**After:** `import { render } from 'astro:content'; const { Content } = await render(slide);`
**Impact:** Low. Build error is clear. But easy to hit when following older tutorials or AI-generated code.

### OBS-W1-20 — LLM subagents generate invalid `\"` in MDX/JSX attributes
**Found:** BL-102 showcase implementation (2026-02-28). When 4 parallel subagents generated 32 MDX slide files, 3 files contained `\"` (backslash-escaped quotes) inside double-quoted JSX attributes (e.g., `pilarDesc="...\"ahora\"..."`). This is invalid JSX — the MDX parser sees `\` as an unexpected character in attribute context. The pattern is valid in JSON and JS template strings, so LLMs default to it.
**Fix:** Changed outer quotes to single quotes: `pilarDesc='..."ahora"...'`.
**Affected files:** 19-caso3-viz.mdx, 24-caso6-ficha.mdx, 28-caso7-viz.mdx (3/32 = 9% error rate).
**Impact:** Medium. Silent generation error — only caught at build time. When delegating MDX generation to subagents, explicit instructions about JSX quoting rules would reduce this.

### OBS-W1-12 — Anthropic tier thresholds
**Source:** docs.anthropic.com/en/api/rate-limits

| Tier | Cumulative Purchase | Sonnet ITPM | RPM |
|---|---|---|---|
| Tier 1 | $5 | 30,000 | 50 |
| Tier 2 | $40 | 450,000 | 1,000 |
| Tier 3 | $200 | 800,000 | 2,000 |
| Tier 4 | $400 | 2,000,000 | 4,000 |

---

## Enhancements Added During QA

1. **Rate limit retry** — 3 attempts with 15s/30s/45s backoff for 429/529 errors
2. **Friendly error messages** — Extract human-readable message from Anthropic SDK errors
3. **Context trimming** — Truncate old tool results (>2000 chars) in conversation history to prevent context overflow
4. **Env var API key** — `ANTHROPIC_API_KEY` env var support + "Connect from server env" button in Settings
5. **Dual connect options** — Both env button and manual key input shown when env is available

---

## Cost Tracking

| Activity | Cost |
|---|---|
| Q&A (detailed conflict summary) | ~$0.10 |
| /extract attempt 1 (died: rate limit, no retry) | ~$0.50 |
| /extract attempt 2 (died: rate limit, with retry) | ~$2.00 |
| /extract attempt 3 (with context trimming) | ~$1.30 |
| /extract attempt 4 (full, interaction worked) | ~$0.50 |
| /extract attempt 5 (incremental, 1 new file) | ~$1.37+ (in progress) |
| Misc (session validation, failed attempts) | ~$0.50 |
| **Total as of 12:24** | **~$9.70+** |

Note: Most cost came from failed /extract attempts on Tier 1 + discovery inefficiency. Discovery alone costs $1.37 for detecting 1 new file among 59 existing. The `discover_sources` tool (OBS-W1-13) is the #1 cost optimization.
