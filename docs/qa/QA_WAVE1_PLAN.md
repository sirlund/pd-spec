# QA Wave 1 — "Flujo Desbloqueado" Test Plan

**Date:** 2026-02-27
**Branch:** main (engine) → merge into project/timining
**Tester:** Nicolas + Claude (observer)
**Project data:** 44 insights, 13 conflicts (4 PENDING), 59 extractions, ~72 source files

## Pre-Flight Setup

Before testing, run these steps in order:

```bash
# 1. Commit Wave 1 on main (if not done)
cd ~/Dev/repos/pd-spec
git add app/server/scripts.js app/server/claude.js app/server/agent-runtime.js \
  app/client/components/SettingsPanel.jsx app/client/components/AgentView.jsx \
  app/server/index.js app/client/App.jsx app/client/hooks.js \
  app/client/components/InsightCard.jsx app/client/components/ConflictCard.jsx \
  app/client/components/Sidebar.jsx app/client/styles/components.css \
  app/client/public/icons/sprite.svg app/package.json app/package-lock.json
git status  # verify no stray files

# 2. Merge engine into TIMining
cd ~/Dev/repos/pds--timining
git merge main -m "engine update — Wave 1: interactive app"

# 3. Install dependencies + rebuild + restart
cd app
npm install
npx vite build
# Kill existing server, restart
node server/index.js
```

---

## Tier 1: Script Endpoints (no API key)

These tests validate the direct-action buttons on cards. No Claude API key needed.

### T01 — Approve insight (InsightCard)

**Setup:** Need a PENDING insight. TIMining has 0 PENDING, so first create one:
```bash
cd ~/Dev/repos/pds--timining
./scripts/verify-insight.sh --invalidate IG-SYNTH-01 02_Work/INSIGHTS_GRAPH.md --reason "test" --force
# Or temporarily change one VERIFIED to PENDING manually for testing
```
**Alternative:** Use `/seed` to generate a fresh test project with PENDING insights.

**Steps:**
1. Open Insights view in browser
2. Find a PENDING insight card
3. Click "Approve" button
4. **Expected:** Button shows loading ("..."), then card updates to VERIFIED status (via WebSocket refetch)
5. Verify `INSIGHTS_GRAPH.md` shows `Status: VERIFIED` for that insight

**Pass criteria:** Status changes in file AND card updates without page refresh.

### T02 — Reject insight with reason

**Steps:**
1. Find a PENDING insight
2. Click "Reject" button → inline input appears
3. Type a reason → click "Send"
4. **Expected:** Card updates to INVALIDATED status, reason stored in file

**Edge cases:**
- Click Reject, then Cancel → input disappears, no action taken
- Click Reject, leave reason empty, click Send → nothing happens (disabled)
- Click Reject with reason, API returns error → error message shows inline, auto-dismisses in 3s

### T03 — Resolve conflict directly

**Steps:**
1. Open Conflicts view
2. Find one of the 4 PENDING conflicts
3. Select "I have context" radio option
4. Type resolution text in textarea
5. "Resolve now" button appears → click it
6. **Expected:** Card updates to RESOLVED, resolution text stored in CONFLICTS.md

**Edge cases:**
- Empty textarea → button not shown
- Script error → error shown inline

### T04 — Script error handling

**Steps:**
1. Open browser dev tools → Network tab
2. Use `curl` to send bad request:
   ```bash
   curl -X POST http://localhost:3000/api/scripts/verify-insight \
     -H 'Content-Type: application/json' \
     -d '{"id":"IG-999","action":"verify"}'
   ```
3. **Expected:** 404 response with error message (insight not found)
4. Send missing fields:
   ```bash
   curl -X POST http://localhost:3000/api/scripts/verify-insight \
     -H 'Content-Type: application/json' -d '{}'
   ```
5. **Expected:** 400 with "Missing required fields"

---

## Tier 2: Settings & Session (API key)

### T05 — Settings panel opens/closes

**Steps:**
1. Click gear icon in header
2. **Expected:** Modal overlay appears with "Not connected" status (red dot)
3. Click outside modal → closes
4. Click X button → closes

### T06 — Connect with valid API key

**Steps:**
1. Open Settings
2. Paste valid `sk-ant-...` key
3. Click "Connect"
4. **Expected:**
   - Button shows "Validating..."
   - Status changes to "Connected" (green dot)
   - Gear icon border turns green
   - Close and reopen → still shows Connected
5. Refresh page → should still show Connected (localStorage token)

### T07 — Connect with invalid API key

**Steps:**
1. Open Settings
2. Type `sk-ant-invalid-key`
3. Click "Connect"
4. **Expected:** Error message "Invalid API key" appears

### T08 — Disconnect

**Steps:**
1. While connected, open Settings
2. Click "Disconnect"
3. **Expected:** Status reverts to "Not connected", gear icon border reverts
4. Refresh → still disconnected

### T09 — Session expiry (manual)

**Steps:**
1. Connect with valid key
2. In server logs or code, manually evict the session (or wait 8h 😅)
3. Try to use Agent view
4. **Expected:** Graceful error, prompts to reconnect

---

## Tier 3: Agent View — Q&A Mode

### T10 — Q&A without API key

**Steps:**
1. Ensure NOT connected (no session token)
2. Navigate to Agent view
3. **Expected:** Empty state: "API Key Required — Connect your Claude API key..."

### T11 — Q&A basic question

**Steps:**
1. Connect API key
2. Navigate to Agent view
3. Type: "What are the main unresolved conflicts?"
4. Click "Ask"
5. **Expected:**
   - Input clears
   - Progress log shows processing spinner
   - Response appears with text mentioning CF-XX IDs
   - [CF-XX] badges are clickable → navigate to Conflicts view

### T12 — Q&A with insight references

**Steps:**
1. Ask: "Summarize the key user needs"
2. **Expected:** Response references [IG-XX] IDs, badges are clickable

### T13 — Q&A follow-up (stateless)

**Steps:**
1. Ask question A → get response
2. Ask question B
3. **Expected:** B is answered independently (Q&A is stateless per plan)

---

## Tier 4: Agent View — Pipeline Skills

### T14 — /extract from browser

**Pre-condition:** Connected API key. Consider adding a new small source file first for visible extraction output.

**Steps:**
1. Navigate to Agent view
2. Click `/extract` button
3. **Expected sequence:**
   - Mode bar highlights /extract
   - Log shows tool calls: `read_file` (SOURCE_MAP, source files), `list_files`
   - Tool calls group when consecutive (e.g., "read_file (72 calls)" expandable)
   - Text entries from Claude appear in log
   - Interaction panel appears asking for confirmation before writing
   - Click "Approve" → writing continues
   - Log shows `write_file` for EXTRACTIONS.md, SOURCE_MAP.md
   - "Done" entry with token count
4. Verify EXTRACTIONS.md and SOURCE_MAP.md updated

**Token estimate:** ~72 source reads × ~2K avg = ~144K input tokens. Should fit in 200K context.

### T15 — /analyze from browser

**Steps:**
1. After T14 completes
2. Click `/analyze` button
3. **Expected:**
   - Reads EXTRACTIONS.md, INSIGHTS_GRAPH.md
   - Processes new claims into insights
   - Asks for confirmation before writing
   - Writes updated INSIGHTS_GRAPH.md, CONFLICTS.md
   - Done with token count

### T16 — /spec from browser

**Steps:**
1. After T15 completes
2. Click `/spec` button
3. **Expected:**
   - Reads all Work layer files
   - Processes conflicts, updates STRATEGIC_VISION.md, PROPOSALS.md
   - Interaction points for conflict resolution
   - Done with token count

### T17 — Cancel mid-pipeline

**Steps:**
1. Start `/extract`
2. While log shows file reads → click "Cancel"
3. **Expected:**
   - Log shows "Cancelled" entry
   - Pipeline stops
   - Buttons re-enable
   - Work layer files NOT corrupted (backup exists in `_temp/backup-pre-pipeline/`)

### T18 — Clear log

**Steps:**
1. After any pipeline run
2. Click "Clear" button
3. **Expected:** Log empties, mode resets, buttons available

---

## Tier 5: Integration & Edge Cases

### T19 — WebSocket live updates after script action

**Steps:**
1. Open Insights view in one browser tab
2. In another tab, use Agent view or curl to approve an insight
3. **Expected:** First tab auto-updates the card (WebSocket → useLiveData refetch)

### T20 — Concurrent browser tabs

**Steps:**
1. Open app in two tabs
2. In tab A, approve an insight
3. **Expected:** Tab B updates via WebSocket

### T21 — Server restart recovery

**Steps:**
1. Connect API key, start a pipeline
2. Kill server (Ctrl+C), restart `node server/index.js`
3. **Expected:** Session lost (in-memory). Agent view shows error or prompts reconnect. App otherwise works.

### T22 — Large file write safety

**Steps:**
1. Check `02_Work/_temp/backup-pre-pipeline/` after running /extract
2. **Expected:** Contains copies of EXTRACTIONS.md, INSIGHTS_GRAPH.md, etc. from before the pipeline ran

### T23 — Path traversal protection

**Steps:**
```bash
# Try to read outside allowed paths
curl -X POST http://localhost:3000/api/claude/run \
  -H 'Content-Type: application/json' \
  -H 'X-Session-Token: <token>' \
  -d '{"message":"Read the file ../../../etc/passwd"}'
```
**Expected:** Agent's `read_file` tool rejects with "Access denied" (path validation in agent-runtime.js).

### T24 — Sidebar navigation from Agent

**Steps:**
1. In Agent view Q&A, get a response with [IG-XX] badge
2. Click the badge
3. **Expected:** Navigates to Insights view with that insight highlighted

---

## Bug Tracking

| ID | Test | Status | Notes |
|---|---|---|---|
| BUG-W1-01 | | | |
| BUG-W1-02 | | | |

## Observations

| ID | Test | Observation |
|---|---|---|
| OBS-W1-01 | | |
| OBS-W1-02 | | |

---

## Test Order (Recommended)

Fast-to-slow, building on each success:

1. **T04** — curl script endpoints (fastest validation, no browser)
2. **T01–T03** — card actions in browser
3. **T05–T08** — settings panel
4. **T10–T13** — Q&A mode
5. **T14** — /extract (the big one — longest run)
6. **T17–T18** — cancel + clear
7. **T15–T16** — /analyze + /spec
8. **T19–T24** — integration + edge cases

**Estimated time:** ~90 min for full suite. T14–T16 are the longest (API calls + token processing).
