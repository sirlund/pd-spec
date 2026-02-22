# QA v6 Findings — Live Research App: WebSocket, Debounce & Cache

**Date:** 2026-02-22
**Scope:** Live Research App runtime behavior — WebSocket lifecycle, debounce correctness, cache performance, CPU usage
**Test Plan:** `docs/qa/QA_V6_PLAN.md`
**App Version:** v4.17.0
**Environment:** Production mode (`node app/server/index.js`), macOS, Chromium via Playwright MCP
**Observer:** Claude Opus (Playwright browser automation)
**Executor:** N/A (infrastructure tests, no skill execution)

---

## Summary

**25/25 tests PASS. 1 bug found and fixed (BUG-02). 1 observation logged.**

| Phase | Tests | Result |
|---|---|---|
| WebSocket singleton & reconnect | T01-T04 | 4/4 PASS |
| Debounce & filtering | T05-T08 | 4/4 PASS |
| Cache performance | T09-T12 | 4/4 PASS |
| CPU/thermal | T13-T15 | 3/3 PASS |
| Regressions | R01-R10 | 10/10 PASS |

---

## BUG-02: WebSocket broadcast loses `type` field due to spread order

**Severity:** Critical (blocks all live updates in production)
**Status:** FIXED
**File:** `app/server/index.js:75`

### Root Cause

```js
// BEFORE (broken):
broadcast({ type: 'file-change', ...event });
// event contains { type: 'change', path: '...' }
// spread overwrites type: 'file-change' → type: 'change'

// AFTER (fixed):
broadcast({ ...event, type: 'file-change' });
// type: 'file-change' comes AFTER spread → correct override
```

Chokidar emits events with `type: 'change'` (or `'add'`, `'unlink'`). The client filters on `msg.type === 'file-change'`. With the wrong spread order, the client never received matching messages, so live updates silently failed.

### Impact

- All file-change WebSocket messages were ignored by the client
- Dashboard, Insights, and all other views never auto-updated
- Only manual page refresh showed new data
- Bug was invisible in dev mode if the client wasn't checking message types

### Fix Applied

Single-line fix in `app/server/index.js:75`. Fix also applied to QA worktree for testing.

---

## OBS-01: No offline indicator when server is down

**Severity:** Low (cosmetic)
**Status:** Noted

When the Express server is killed, the header continues showing "Live — watching for changes" with the green indicator. The WebSocket reconnects silently in the background (2s fixed backoff), but the user has no visual indication that the connection was lost.

**Suggestion:** Toggle the status indicator to "Reconnecting..." or "Offline" when the WebSocket closes, and restore "Live" when it reconnects.

---

## Detailed Test Results

### Phase 1: WebSocket Singleton (T01-T02)

| Test | Description | Result | Notes |
|---|---|---|---|
| T01 | Single WS connection | PASS | 1 WebSocket instance total (app singleton) |
| T02 | No new connections on navigation | PASS | Navigated Dashboard → Insights → Conflicts → System Map → Sources. 0 new WS connections. |

**Architecture:** Single WebSocket created in `hooks.js` via module-level singleton. All views share one connection via `useWebSocket()` hook with subscriber reference counting.

### Phase 2: WebSocket Reconnect (T03-T04)

| Test | Description | Result | Notes |
|---|---|---|---|
| T03 | Reconnect after server kill (production) | PASS | Server down ~18s. 9 WS errors during downtime (expected). Auto-reconnected after restart. Verified by file touch → WS message → dashboard refetch. |
| T04 | Reconnect within 10s | PASS | Implicit — server was down ~18s in T03 and reconnected fine. Fixed 2s backoff, no max attempts. |

**Reconnect behavior:** `hooks.js` uses a fixed 2-second `setTimeout` backoff with no maximum retry limit. Connection attempts continue indefinitely while there are active subscribers. Reconnect is subscriber-gated — if all views unmount, reconnection stops.

### Phase 3: Debounce (T05-T08)

| Test | Description | Result | Notes |
|---|---|---|---|
| T05 | Single edit → 1 fetch | PASS | 1 WS message, 1 API fetch. 314ms debounce delay. |
| T06 | 5 rapid edits → 1-2 fetches | PASS | 50ms spacing → 1 WS + 1 fetch (chokidar coalesced). 200ms spacing → 1 WS + 1 fetch. |
| T07 | 2-file simultaneous edit → collapse | PASS | 2 WS messages (1ms apart), 1 API fetch (client debounce collapsed). |
| T08 | Irrelevant file edit → no view-specific fetch | PASS | SOURCE_MAP edit while on Insights view → only `/api/dashboard` fetch (app-level hook), no `/api/insights` fetch. Pattern filtering correct. |

**Dual debounce architecture discovered:**
1. **Server-side:** Chokidar `awaitWriteFinish` with `stabilityThreshold: 300ms` — coalesces rapid filesystem events before emitting
2. **Client-side:** `useLiveData` trailing debounce with `setTimeout(..., 300)` — coalesces rapid WS messages before API refetch

**App-level hook:** `app.jsx` maintains two global `useLiveData` hooks (`/project` watching `PROJECT.md`, `/dashboard` watching `02_Work/`). These run regardless of current view, so any Work-layer file change triggers a dashboard refetch even if the user is on a different view. View-specific hooks (e.g., `/insights` watching `INSIGHTS_GRAPH.md`) only trigger when the view is mounted.

### Phase 4: Cache (T09-T12)

| Test | Description | Result | Notes |
|---|---|---|---|
| T09 | Cross-view cache sharing | PASS | Dashboard cold: 13ms. Evidence Gaps: 3ms. Insights: 2ms. Shared data parsed once. |
| T10 | Repeated calls use cache | PASS | All subsequent calls 3-7ms (mtime check only, no re-parse). |
| T11 | Cache invalidation on edit | PASS | Edit → `parseCache.delete(event.path)` → next API call re-parses → fresh data. |
| T12 | Selective invalidation | PASS | Edit CONFLICTS.md only → conflicts cache invalidated, insights cache retained. |

**Cache architecture:** `api.js` uses a `Map` keyed by relative file path. Each entry stores `{ result, mtimeMs }`. On API request, `stat()` checks mtime — if unchanged, returns cached result (no file read). On WS file-change event, `parseCache.delete(path)` forces re-read on next request.

### Phase 5: CPU/Thermal (T13-T15)

| Test | Description | Result | Notes |
|---|---|---|---|
| T13 | Idle CPU (6+ min) | PASS | 0.0% CPU. No polling, no timers. Pure event-driven. |
| T14 | CPU during rapid edits | PASS | Peak 0.2% during 15 rapid writes. Returns to 0.0% within seconds. |
| T15 | CPU after navigation + idle | PASS | Navigated all views + 30s idle → 0.0% CPU. |

### Phase 6: Regressions (R01-R10)

| Test | Description | Result | Notes |
|---|---|---|---|
| R01 | Dashboard renders | PASS | Stats bar (59 sources, 284 claims, 47 insights, 12 conflicts), maturity chart, extraction progress, authority distribution, categories, action items |
| R02 | Insights view | PASS | 47 insights with status badges, category filters, convergence/authority/voice metadata |
| R03 | Conflicts view | PASS | 12 conflicts with radio resolution options |
| R04 | System Map | PASS | Structured cards render |
| R05 | Evidence Gaps | PASS | 17 auto-computed gaps |
| R06 | FileBrowser (Sources) | PASS | Split-panel with file list + extraction status badges |
| R07 | Outputs tab | PASS | Lists HTML deliverables |
| R08 | Theme toggle | PASS | Toggled to light mode, navigated to Insights, button persists as "Switch to dark mode" |
| R09 | Live update end-to-end | PASS | Added test insight → dashboard updated live (47→48 insights, Pending 20→21, new "unknown" authority). Removed test insight → reverted. |
| R10 | Search filtering | PASS | Typed "CORE" → 8 results (7 insights + 1 conflict) in dropdown. Click navigated to Insights view. |

---

## Architecture Notes

### WebSocket Message Flow (Post-Fix)

```
File edit → chokidar (awaitWriteFinish 300ms)
  → server watcher callback
    → parseCache.delete(path)
    → broadcast({ ...event, type: 'file-change' })  ← BUG-02 fix
      → WebSocket → client
        → useLiveData pattern match
          → setTimeout(refetch, 300ms)  ← client debounce
            → GET /api/dashboard (or view-specific endpoint)
              → readAndParse (mtime-validated cache)
                → React state update → re-render
```

### Key File References

| File | Role |
|---|---|
| `app/server/index.js:75` | BUG-02 fix location — broadcast spread order |
| `app/server/watcher.js` | Chokidar config with awaitWriteFinish |
| `app/server/api.js:40-57` | mtime-validated parse cache |
| `app/client/hooks.js:36-63` | WS singleton + 2s reconnect backoff |
| `app/client/hooks.js:90-110` | useLiveData debounce logic |
| `app/client/app.jsx:41-42` | App-level global hooks (project + dashboard) |

---

## Cleanup

Test artifacts (comment lines appended to INSIGHTS_GRAPH.md, CONFLICTS.md, SOURCE_MAP.md during T05-T15) were removed after all tests completed.
