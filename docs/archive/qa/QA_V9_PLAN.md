# QA v9 Plan — v4.25.0 Validation

## Automated Checks
Run `./scripts/validate-fixes.sh` — all 28 checks must pass (T14).

## Manual Test Cases

### Architecture & Rename

| ID | Test | Expected |
|---|---|---|
| T01 | Run `/spec` on TIMining worktree | Skill executes (no "resolve" references). Writes STRATEGIC_VISION.md + PROPOSALS.md |
| T02 | Open app → Strategic Vision view | Parsed data renders: vision, strategy, principles, domains, value props |
| T03 | Open app → Proposals view | Parsed data renders: [DP-XX] cards with domain, status, grounded-in refs |
| T04 | Open app → search "strategic" or "proposal" | SearchBar returns results from new file categories |

### Utility Scripts

| ID | Test | Expected |
|---|---|---|
| T05 | `./scripts/next-id.sh ig ~/Dev/repos/pds--timining/02_Work/INSIGHTS_GRAPH.md` | Returns next valid [IG-XX] ID, respects zero-padding |
| T06 | `./scripts/next-id.sh dp ~/Dev/repos/pds--timining/02_Work/PROPOSALS.md` | Returns [DP-01] (first proposal) or next available |
| T07 | `./scripts/count-statuses.sh ~/Dev/repos/pds--timining/02_Work/INSIGHTS_GRAPH.md` | Correct counts per status (VERIFIED, PENDING, INVALIDATED, MERGED) |
| T08 | `./scripts/verify-insight.sh --freeze IG-SYNTH-01 ~/Dev/repos/pds--timining/02_Work/INSIGHTS_GRAPH.md` | Shows cascade impact, prompts confirmation, changes status to FROZEN |
| T09 | `./scripts/reset.sh --work` on test worktree | Clean reset, template files restored |

### Insight Lifecycle

| ID | Test | Expected |
|---|---|---|
| T10 | Open app → Insights view → check InsightCard | Freshness dot visible (green/yellow/red) for insights with Last-updated field |
| T11 | Manually add `Last-updated: 2025-01-01` to an insight → reload app | Red stale dot appears on that insight |
| T12 | Check InsightCard for FROZEN/SUPERSEDED status | Correct badge color and card accent (indigo for FROZEN, gray strikethrough for SUPERSEDED) |

### Browser Navigation & File Browser

| ID | Test | Expected |
|---|---|---|
| T13 | Navigate Dashboard → Insights → click [IG-XX] badge → press browser back → back again | Returns to Insights, then to Dashboard. No URL changes. |
| T14 | Open app → Sources → browse nested folders (e.g., `sesiones-idemax/round-1/`) | Nested tree renders with indentation, parent shows aggregated count, each node independently collapsible |
| T15 | `./scripts/validate-fixes.sh` | All 28 checks pass, exit 0 |

## Known Open Items (Not in Scope)

| ID | Issue | Status | Notes |
|---|---|---|---|
| BL-90 #2 | State preservation (lift component state to App) | Deferred | v4.26+ — FileBrowser state, InsightsView filters |
| BL-92 Phase 2 | App write endpoints (POST → scripts) | Deferred | v4.26+ |
| BL-92 Phase 3 | Claude API in app (BL-80, BYOK) | Deferred | v4.27+ |
| BL-93 L2 | Supersession detection in /analyze | Deferred | Extends /analyze Phase 2 |
| BL-93 L3 | Relevance scoring (composite dashboard) | Deferred | Needs L1+L2 data |
| BL-94 L2/L3 | Claim-level + semantic integrity checks | Deferred | Requires LLM |
| OBS-68 | Convergence update screen abstract | Open | → BL-92 (app action candidate) |
| OBS-69 | Convergence updates have no app UI | Open | Architecture gap |
