# Plan: BL-108 + BL-109 — Agent State Persistence + Model Routing

## Context

During QA testing of the SDK migration (BL-80), two issues emerged:

1. **BL-108 (P1):** Switching tabs in the app unmounts AgentView → kills the SSE connection → server aborts the SDK query → user loses a running /extract ($5+ cost). The user cannot check the dashboard during a long skill run without killing it.

2. **BL-109 (P2):** All queries use Sonnet regardless of complexity. Q&A mode (asking questions about pre-loaded context) doesn't need Sonnet-level reasoning — Haiku is ~10x cheaper and sufficient.

---

## BL-108: Agent View State Persistence

### Problem

AgentView is conditionally rendered in `app.jsx:162-168` (`case 'agent': return <AgentView />`). When the user switches to another tab, AgentView unmounts → the SSE fetch loses its state setters → `req.on('close')` fires on the server (`claude.js:231-235`) → `abortController.abort()` kills the SDK query.

### Approach: Always-mount + server-side event buffer

Two layers that solve all 4 acceptance criteria:

**Layer 1 — Prevent unmount (solves AC 1-3):**
- Always render `<AgentView>` in `app.jsx`, use CSS `display: none` when not the active tab
- Component stays mounted → SSE stays open → SDK query continues
- When user returns to Agent tab, the log is already there (state was never lost)

**Layer 2 — Server event buffer (solves AC 4: connection loss recovery):**
- Buffer all SSE events in `activeRuns` Map entry (`eventLog: []`)
- On `req.close`: DON'T abort the SDK query — mark SSE as disconnected, let the query finish
- Keep finished run log in a `completedRuns` Map (5-min TTL) for post-completion recovery
- New `GET /run/status` endpoint returns `{ active, log }` for recovery
- AgentView checks `/run/status` on mount → replays buffered log if a run exists

### File changes

**`app/client/app.jsx`** (lines 126-178, `renderView` function):

```jsx
// Before: conditional rendering (unmounts on tab switch)
case 'agent':
  return <AgentView sessionToken={sessionToken} onNavigate={navigateTo} />;

// After: AgentView rendered outside renderView(), always mounted
// In renderView(), remove the 'agent' case entirely.
// Below the <main> tag, add AgentView with visibility control:
<AgentView
  sessionToken={sessionToken}
  onNavigate={navigateTo}
  visible={view === 'agent'}
/>
```

The `visible` prop controls `style={{ display: visible ? undefined : 'none' }}` on the root div.

**`app/client/components/AgentView.jsx`** (3 changes):

1. Accept `visible` prop, apply to root div:
```jsx
export default function AgentView({ sessionToken, onNavigate, visible }) {
  // ...
  return (
    <div className="agent-view" style={{ display: visible ? undefined : 'none' }}>
```

2. Add recovery effect on mount — check for active/completed runs:
```jsx
useEffect(() => {
  if (!sessionToken) return;
  fetch('/api/claude/run/status', {
    headers: { 'X-Session-Token': sessionToken },
  })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data?.log?.length) return;
      setLog(data.log);
      setRunning(data.active);
      // If there's a pending interaction, restore it
      if (data.interaction) setInteraction(data.interaction);
    })
    .catch(() => {});
}, [sessionToken]);
```

3. Update auto-scroll dependency — only scroll when `visible` is true.

**`app/server/claude.js`** (4 changes):

1. Add `completedRuns` Map + helper (after line 24):
```js
const completedRuns = new Map(); // token → { log, interaction, completedAt }
```

2. Add event buffering in POST /run handler (around line 224):
```js
const eventLog = [];
const rawSendSSE = setupSSE(res);
const sendSSE = (data) => {
  eventLog.push(data);
  rawSendSSE(data);
};
```

Store `eventLog` in the `activeRuns` entry:
```js
activeRuns.set(token, { bridge, abortController, query: null, eventLog, sseConnected: true });
```

3. Change `req.on('close')` (lines 231-235) — don't abort:
```js
req.on('close', () => {
  const run = activeRuns.get(token);
  if (run) {
    run.sseConnected = false;
    // DON'T abort — let the query finish. Events buffer in eventLog.
  }
});
```

4. In the `finally` block (lines 351-354) — preserve log for recovery:
```js
finally {
  const run = activeRuns.get(token);
  if (run && !run.sseConnected) {
    // Client was disconnected — keep log for recovery
    completedRuns.set(token, { log: run.eventLog, completedAt: Date.now() });
    setTimeout(() => completedRuns.delete(token), 5 * 60 * 1000);
  }
  activeRuns.delete(token);
  if (!res.writableEnded) res.end();
}
```

5. Add `GET /run/status` endpoint (after POST /run/cancel):
```js
router.get('/run/status', requireSession, (req, res) => {
  const token = req.sessionToken;
  const active = activeRuns.get(token);
  if (active) {
    const pending = active.bridge.getPending();
    return res.json({
      active: true,
      log: active.eventLog,
      interaction: pending ? {
        tool: InteractionBridge.transformForFrontend(pending.input).tool,
        input: InteractionBridge.transformForFrontend(pending.input).input,
        toolUseId: pending.toolUseId,
      } : null,
    });
  }
  const completed = completedRuns.get(token);
  if (completed) {
    completedRuns.delete(token); // one-time recovery
    return res.json({ active: false, log: completed.log });
  }
  res.json({ active: false, log: [] });
});
```

---

## BL-109: Q&A Model Routing

### Problem

`claude.js:246` hardcodes `model: 'claude-sonnet-4-20250514'` for all queries. Q&A mode loads Work layer context into the system prompt and answers questions — Haiku is sufficient and ~10x cheaper.

### Approach: Mode-based model selection (3-line change)

```js
// claude.js, before line 246:
const model = mode === 'qa'
  ? 'claude-haiku-4-5-20251001'
  : 'claude-sonnet-4-20250514';

// Then in queryOptions:
const queryOptions = {
  model,
  // ... rest unchanged
};
```

Per-skill routing (Haiku for extract, Sonnet for analyze/spec) is deferred to BL-80-P2 — it requires the subagent reader architecture. This change gives immediate cost savings on Q&A with zero risk.

---

## Files Summary

| File | Action | Scope |
|---|---|---|
| `app/client/app.jsx` | MODIFY | Move AgentView out of renderView(), always-mount with visibility prop |
| `app/client/components/AgentView.jsx` | MODIFY | Add `visible` prop, recovery effect on mount |
| `app/server/claude.js` | MODIFY | Event buffer, don't abort on close, completedRuns, GET /run/status, model routing |

---

## Verification

1. **Tab switch (BL-108 AC 1-3):**
   - Start /extract → switch to Dashboard → switch back to Agent
   - Expected: log is intact, run is still processing, completes normally
   - If run completes while on another tab → returning shows "Done" entry

2. **Connection loss recovery (BL-108 AC 4):**
   - Start /extract → refresh the page
   - Expected: AgentView shows recovery log from GET /run/status
   - The run continues server-side and the log shows where it stopped or completed

3. **Q&A cost (BL-109):**
   - Ask a Q&A question → check the `done` event's usage
   - Expected: uses Haiku pricing (~$0.80/MTok input vs $3/MTok for Sonnet)

4. **Skill unaffected (BL-109):**
   - Run /extract → verify Sonnet is still used (check model in logs or cost)

5. **Build:** `cd app && npm run build` — no errors
