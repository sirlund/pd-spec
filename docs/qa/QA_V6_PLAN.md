# QA v6 Plan — v4.16.0+perf

> Created: 2026-02-22
> Version under test: v4.16.0 (commit `ebf1a2c`)
> Scope: Performance optimization — singleton WebSocket, debounced refetch, server-side parse cache
> Type: Manual browser testing (no dual-terminal needed — no skills under test)

## Setup

```bash
cd ~/Dev/repos/pd-spec--qa
git merge main -m "engine update — perf optimization"
```

**State:** Preserve existing Work layer (needs data for views to render).
If Work layer is empty, run `/seed` + `/extract` + `/analyze` first to populate.

**Verify data exists before testing:**

```bash
wc -l 02_Work/INSIGHTS_GRAPH.md 02_Work/CONFLICTS.md 02_Work/SOURCE_MAP.md 02_Work/EXTRACTIONS.md
```

All files should have >10 lines. If not, populate first.

## Tools Required

- Browser with DevTools (Chrome/Edge recommended for WS inspection)
- Activity Monitor (macOS) or `top` for CPU verification
- Second terminal for file edits during observation

## Test Matrix

### WebSocket Singleton (Fix 1)

| ID | Test | Expected | Verify |
|---|---|---|---|
| T01 | Open app, check WS connections | Exactly 1 WebSocket in Network → WS tab | DevTools Network → WS filter: 1 entry |
| T02 | Navigate between views (dashboard → insights → conflicts → sources) | Still 1 WebSocket connection (no new connections on navigation) | WS tab stays at 1 entry |
| T03 | Kill Express (Ctrl+C), wait 3s, restart | WS auto-reconnects within ~2s. Live updates resume without page refresh | DevTools Console: no permanent disconnect. Edit a Work file → view updates |
| T04 | Kill Express, wait 10s, restart | WS still reconnects (no single-attempt limit) | Same as T03 |

### Debounced Refetch (Fix 2)

| ID | Test | Expected | Verify |
|---|---|---|---|
| T05 | Edit a Work file once, save | 1 API call appears after ~300ms delay (not instant) | DevTools Network → XHR: single request with timing gap |
| T06 | Edit a Work file 5 times in 2 seconds (rapid saves) | 1-2 API calls total (not 5) | Network → XHR: count requests in the burst window |
| T07 | Edit two different Work files within 300ms | Debounce collapses to 1 refetch (both changes reflected) | Network → XHR: 1 call. View shows both changes |
| T08 | Edit a file NOT watched by current view (e.g., edit SOURCE_MAP while on insights view) | No API call triggered (pattern mismatch) | Network → XHR: no new request |

### Server-Side Parse Cache (Fix 3)

| ID | Test | Expected | Verify |
|---|---|---|---|
| T09 | Load dashboard, then load evidence-gaps view | INSIGHTS_GRAPH.md parsed once (shared cache). Second endpoint responds faster | Server logs (optional). Network timing: evidence-gaps response notably faster than dashboard |
| T10 | Load insights view, wait 5s, reload insights view (no file changes) | Cache hit — response near-instant (stat check ~0.1ms, no re-parse) | Network timing: <5ms response vs initial ~50ms+ |
| T11 | Edit INSIGHTS_GRAPH.md, then load insights view | Cache invalidated — fresh parse, correct data | View shows updated content. Network timing similar to cold load |
| T12 | Edit CONFLICTS.md | Only CONFLICTS.md cache entry invalidated. INSIGHTS_GRAPH.md still cached | Load insights (fast, cache hit) then conflicts (normal, re-parsed) |

### CPU / Thermal Regression (Primary Goal)

| ID | Test | Expected | Verify |
|---|---|---|---|
| T13 | Leave app open 5 minutes with no activity | 0% CPU in Activity Monitor | Activity Monitor → node process |
| T14 | Simulate agent work: loop editing a Work file every 2s for 30s | No sustained fan spin. CPU spikes briefly per change, returns to idle | Activity Monitor. `while true; do echo "test" >> 02_Work/EXTRACTIONS.md; sleep 2; done` (cleanup after) |
| T15 | Open app, navigate all views, let it idle 1 min | No CPU activity after initial loads | Activity Monitor |

### Functional Regressions

| ID | Test | Expected | Verify |
|---|---|---|---|
| R01 | Dashboard view loads with correct data | All cards render: pipeline progress, authority distribution, categories | Visual check |
| R02 | Insights view loads, cards render | All insights visible with correct status badges | Visual check + count matches |
| R03 | Conflicts view loads | Conflicts render with radio options | Visual check |
| R04 | System Map view loads | Structured cards render | Visual check |
| R05 | Evidence Gaps view loads | Auto-computed gaps display | Visual check |
| R06 | FileBrowser (Sources tab) loads | Split-panel: file list + preview. MD rendered, images inline | Navigate to Sources, click a file |
| R07 | Outputs tab loads | Lists HTML deliverables | Visual check |
| R08 | Theme toggle works | Dark ↔ light switch, persists across views | Click toggle, navigate, verify |
| R09 | Live update end-to-end | Edit INSIGHTS_GRAPH.md → dashboard updates without refresh | Edit file in terminal, watch dashboard |
| R10 | Search bar filters | Type a term, results narrow across views | Type in search, verify filtering |

## Execution Order

### Phase 1: Setup (2 min)

1. Merge main into QA worktree
2. Verify Work layer has data
3. Start app: `cd ~/Dev/repos/pd-spec--qa && node app/server/index.js`
4. Open browser at `http://localhost:3000`, open DevTools (Network tab)

### Phase 2: WebSocket (3 min)

5. Run T01, T02 (singleton verification)
6. Run T03, T04 (reconnection)

### Phase 3: Debounce (3 min)

7. Run T05 (single edit)
8. Run T06 (rapid edits — use a second terminal)
9. Run T07 (two-file edit)
10. Run T08 (irrelevant file edit)

### Phase 4: Cache (3 min)

11. Run T09 (shared parse: dashboard → evidence-gaps)
12. Run T10 (cache hit on reload)
13. Run T11, T12 (invalidation)

### Phase 5: CPU (5 min)

14. Run T13 (idle CPU)
15. Run T14 (sustained edits simulation)
16. Run T15 (post-navigation idle)

### Phase 6: Regressions (5 min)

17. Run R01–R10 (visual + functional checks across all views)

### Phase 7: Cleanup

18. Stop the simulated edit loop if running
19. Restore any modified Work files: `cd ~/Dev/repos/pd-spec--qa && git checkout -- 02_Work/`
20. Record results

## Success Criteria

- **15/15 feature tests pass** (T01–T15)
- **10/10 regressions clean** (R01–R10)
- **T13 critical:** idle CPU must be 0% (this was the original complaint)
- **T14 critical:** sustained edits must not cause fan spin

## Rapid-Edit Helper Script

For T06 and T14, use this from a second terminal:

```bash
# Rapid 5 edits in 2 seconds (T06)
for i in 1 2 3 4 5; do echo "# test-$i $(date)" >> ~/Dev/repos/pd-spec--qa/02_Work/EXTRACTIONS.md; sleep 0.4; done

# Sustained edits every 2s for 30s (T14)
for i in $(seq 1 15); do echo "# stress-$i $(date)" >> ~/Dev/repos/pd-spec--qa/02_Work/EXTRACTIONS.md; sleep 2; done

# Cleanup after both
cd ~/Dev/repos/pd-spec--qa && git checkout -- 02_Work/EXTRACTIONS.md
```

## Rules

- Observe, don't fix — document in findings
- Each test gets PASS / FAIL / PARTIAL / NOT TESTED / SKIPPED + notes
- If a test reveals a bug, log it but do NOT fix mid-QA
- Screenshots of DevTools Network tab are valuable evidence for WS and debounce tests

---

## Extension A: Skill Execution Tests

> Added: 2026-02-22
> Scope: BL-44 (source authority), BL-46 (speaker attribution), BL-51 (Pass C enforcement), BL-52 (line-breaking), BL-53 (batch checkpoints), BL-55 (version display)
> Type: Dual-terminal (execute + observe) — follows QA README pipeline
> Prerequisite: Main QA v6 tests completed. Full state reset required.

### Setup

```bash
# 1. Reset state (preserves sources)
cd ~/Dev/repos/pd-spec--qa
git merge main -m "engine update — skill fixes"
```

Run `/reset --work --output` in the QA terminal to clear Work layer.

**Terminal capture (observer side):**

```bash
script /tmp/qa-v6-ext.txt
```

### Source Preparation

The existing TIMining sources cover most test scenarios. Add these synthetic test files before running:

| # | File | Purpose | How to create |
|---|---|---|---|
| S1 | `01_Sources/entrevistas-operadores/_CONTEXT.md` | Add `Authority: internal` field | Edit existing or create |
| S2 | `01_Sources/ai-summaries/gemini-synthesis.md` | AI-generated source with claims | Create folder + file |
| S3 | `01_Sources/ai-summaries/_CONTEXT.md` | `Authority: ai-generated` | Create alongside S2 |
| S4 | `01_Sources/entrevistas-operadores/entrevista-override.md` | File with `Authority: primary` frontmatter (inside internal folder) | Create. Frontmatter: `Authority: primary` |
| S5 | `01_Sources/benchmark-inicial/wall-of-text.txt` | Single-line file >5000 chars (oversized lines test) | `python3 -c "print('Sentence one. ' * 400)" > file` |
| S6 | Existing labeled transcript | Speaker attribution (labeled) | Identify from TIMining (any `entrevista-*.md` with `Speaker:` turns) |
| S7 | `01_Sources/entrevistas-operadores/granola-transcript.md` | Unsegmented transcript — multiple participants listed but single `Me:` block | Create with `_CONTEXT.md` participants list |

**Synthetic file templates:**

```bash
# S2 — AI-generated source
mkdir -p ~/Dev/repos/pd-spec--qa/01_Sources/ai-summaries
cat > ~/Dev/repos/pd-spec--qa/01_Sources/ai-summaries/gemini-synthesis.md << 'ENDOFFILE'
---
Source Type: synthesis
Date: 2026-01-15
---

# Gemini Research Summary

The platform should prioritize mobile-first design because 78% of operators access the system from tablets in the field.

Integration with SAP is critical for financial reconciliation. Without it, manual data entry costs approximately 12 hours per week per site.

User satisfaction surveys indicate a strong preference for dashboard-style interfaces over traditional report formats.

Real-time alerts for equipment anomalies could reduce downtime by 30% based on industry benchmarks.
ENDOFFILE

# S3 — Authority context
cat > ~/Dev/repos/pd-spec--qa/01_Sources/ai-summaries/_CONTEXT.md << 'ENDOFFILE'
# Folder Context

**Authority:** ai-generated
**Description:** Summaries produced by Gemini from raw interview recordings.
**Date range:** January 2026
ENDOFFILE

# S4 — File-level override
cat > ~/Dev/repos/pd-spec--qa/01_Sources/entrevistas-operadores/entrevista-override.md << 'ENDOFFILE'
---
Authority: primary
Source Type: interview
Date: 2026-02-01
Participants: Carlos Méndez (Jefe de Operaciones)
---

# Entrevista Override Test

Carlos: "La integración con SAP es fundamental. Sin ella perdemos 12 horas semanales en cada sitio."

Carlos: "Los operadores prefieren dashboards, no reportes estáticos."
ENDOFFILE

# S5 — Oversized lines
python3 -c "print('This is a very long sentence about mining operations and equipment maintenance. ' * 100)" > ~/Dev/repos/pd-spec--qa/01_Sources/benchmark-inicial/wall-of-text.txt

# S7 — Unsegmented transcript (Granola-style)
cat > ~/Dev/repos/pd-spec--qa/01_Sources/entrevistas-operadores/granola-transcript.md << 'ENDOFFILE'
---
Source Type: transcript
Date: 2026-02-10
Participants: Ana Torres (Gerente de Planta), Roberto Silva (Supervisor de Turno)
Tool: Granola
---

# Meeting Notes — Operations Review

Me:

We need to discuss the maintenance scheduling issue. The current system doesn't account for seasonal variations in equipment load. During winter the crushers operate at 120% capacity which accelerates wear on the primary bearings.

I've seen the reports from the field team. The operators are requesting a predictive maintenance module. They want alerts 48 hours before critical component failure, not the current 12-hour window.

From the financial side, the maintenance budget is already stretched. We can't approve new tooling without demonstrating ROI within 6 months. The board wants concrete numbers.

The shift supervisors have been tracking downtime manually in spreadsheets. That data could be valuable if we can digitize it. Each site has approximately 3 years of historical maintenance logs.

The real problem is coordination between sites. When one site has a spare part, another site might need it urgently but there's no visibility. A shared inventory system would solve this immediately.
ENDOFFILE
```

**Verify source count before running:**

```bash
find ~/Dev/repos/pd-spec--qa/01_Sources -type f ! -name '_*' ! -name '.*' | wc -l
```

Should be original TIMining count + 4 new files (S2, S4, S5, S7).

### Test Matrix

#### BL-44 — Source Authority Layer

| ID | Test | Expected | Verify |
|---|---|---|---|
| E01 | /extract on `ai-summaries/` folder (S2+S3) | Claims tagged `[AI-SOURCE]`, section header shows `⚠️ AI-GENERATED` | Read EXTRACTIONS.md, search `AI-SOURCE` |
| E02 | /extract on `entrevistas-operadores/` with `Authority: internal` (S1) | Claims tagged `[INTERNAL]`, header shows `🏢 INTERNAL` | Read EXTRACTIONS.md, search `INTERNAL` |
| E03 | `entrevista-override.md` (S4) inside internal folder | File's claims have NO `[INTERNAL]` tag — frontmatter `Authority: primary` overrides folder | Read EXTRACTIONS.md, find S4 section |
| E04 | /analyze on AI-SOURCE-only claims | Resulting insight stays PENDING. Authority field = `hypothesis` | Read INSIGHTS_GRAPH.md |
| E05 | /analyze: AI claim matches primary claim | Conflict or merge noted. Primary takes precedence in authority | Read CONFLICTS.md or INSIGHTS_GRAPH.md |
| E06 | Internal source with action items (if S1 folder has any) | Action items in `### Action Items` subsection, skipped by /analyze | EXTRACTIONS.md + no IG entries from actions |

#### BL-46 — Smart Speaker Attribution

| ID | Test | Expected | Verify |
|---|---|---|---|
| E07 | /extract on labeled transcript (S6) | Speaker Table in quality report: `high` confidence, `label` method | Terminal output during Phase 1.5 |
| E08 | /extract on unsegmented transcript (S7 — Granola) | `🔍 Unsegmented transcript` log. Content-based segmentation applied. Speaker markers inserted | Terminal output + `_normalized.md` |
| E09 | Speaker Table for S7 | Table shows Ana Torres + Roberto Silva with `medium` or `low` confidence, `content` method | Terminal output |
| E10 | /analyze on S7 insights — uncertain attributions | Step 19a speaker clarification loop fires. Grouped uncertain cases presented | Terminal: AskUserQuestion prompt |
| E11 | Batch correction in clarification loop | Correct one speaker → all insights from that segment update | Read INSIGHTS_GRAPH.md after correction |
| E12 | /analyze on S6 insights — all high-confidence | Step 19a silently skipped (no clarification question) | Terminal: no speaker prompt appears |

#### BL-51 — Pass C Enforcement

| ID | Test | Expected | Verify |
|---|---|---|---|
| E13 | Full preprocessing on noisy transcript | Distinct Read call for `_mechanical.md` before Pass C begins. No sed/awk during Pass C | Terminal log: Read tool call visible |
| E14 | At least one repair marker | `_normalized.md` contains `[incomplete]`, `[crosstalk]`, or `[unintelligible]` | Read normalized file in `02_Work/_temp/` |
| E15 | Step 17 log contains Pass C field | `✓ Preprocessed: {filename} (..., Pass C: yes)` | Terminal log |
| E16 | Clean transcript (if any) | Log: `Pass C: no repairs needed — transcript is clean` (explicit, not silent) | Terminal log |

#### BL-52 — Line-Breaking

| ID | Test | Expected | Verify |
|---|---|---|---|
| E17 | Oversized lines detection on S5 | `⚠️ Oversized lines detected: wall-of-text.txt` log | Terminal log |
| E18 | S5 is not a transcript → no Phase 1.5 | Byte-range reads used during extraction (`head -c`, `tail -c`) | Terminal: Bash calls instead of Read |
| E19 | If S5 were preprocessed: step 17b line-breaking | After normalization, `wc -L` < 2000 on normalized file | Observer: `wc -L` on file |

#### BL-53 — Batch Checkpoints

| ID | Test | Expected | Verify |
|---|---|---|---|
| E20 | /extract on full project (11+ files) | Phase 1 checkpoint written to `SESSION_CHECKPOINT.md` | Observer: Read checkpoint after Phase 1 |
| E21 | Checkpoint content after batch N | Correct processed/remaining file counts, resume instruction | Observer: Read checkpoint mid-run |
| E22 | Checkpoint is separate from EXTRACTIONS write | Distinct Write/Edit call for checkpoint after EXTRACTIONS write | Terminal log: two separate writes |

#### BL-55 — Engine Version Display

| ID | Test | Expected | Verify |
|---|---|---|---|
| E23 | App header shows CHANGELOG version | Version matches first `## [X.Y.Z]` in `docs/CHANGELOG.md`, not `engine_version` from PROJECT.md | Browser header + `curl localhost:3000/api/project \| jq .version` |
| E24 | PROJECT.md `engine_version` is stale | Even if PROJECT.md says an old version, app shows CHANGELOG version | Manually set PROJECT.md to `v0.0.0`, reload app |

### Anticipated Decision Points

| When | Agent asks | Prescribed answer | Why |
|---|---|---|---|
| /extract Phase 1.5 | Preprocessing options for Granola transcript (S7) | Full preprocessing (all passes) | Need Pass A speaker detection + Pass C test |
| /extract Phase 1.5 | Preprocessing options for labeled transcript (S6) | Full preprocessing (all passes) | Need Pass C test on labeled file |
| /extract Phase 1.5 | Preprocessing options for other transcripts | Quick phonetics only (if offered) | Save time, not under test |
| /analyze step 19a | Speaker clarification for S7 | Correct one speaker, accept rest as-is | Test correction propagation (E11) |
| /analyze | Approve proposed insights | Approve all as PENDING | Standard — we want to see authority constraints |

### Execution Order

#### Phase E1: Setup (5 min)

1. Merge main into QA worktree
2. Run `/reset --work --output` in QA terminal
3. Create synthetic source files (S1–S7) using scripts above
4. Verify source count
5. Start terminal capture: `script /tmp/qa-v6-ext.txt`

#### Phase E2: Extraction (15 min)

6. In QA terminal: run `/extract`
7. Observer monitors:
   - E17: oversized lines detection for S5
   - E07, E08, E09: speaker detection logs for S6 and S7
   - E13: Pass C separation (Read call for `_mechanical.md`)
   - E14, E15, E16: repair markers and log fields
   - E18: byte-range reads for S5
   - E20: checkpoint written after Phase 1
8. Respond to decision points per table above

#### Phase E3: Post-Extraction Verification (5 min)

9. Observer reads EXTRACTIONS.md:
   - E01: `[AI-SOURCE]` tags on ai-summaries claims
   - E02: `[INTERNAL]` tags on entrevistas claims
   - E03: override file has NO `[INTERNAL]` tag
   - E06: action items subsection (if present)
10. Observer reads checkpoint:
    - E21, E22: checkpoint content and separation

#### Phase E4: Analysis (10 min)

11. In QA terminal: run `/analyze`
12. Observer monitors:
    - E10, E11: speaker clarification loop for S7
    - E12: silent skip for S6
13. Respond to decision points per table above

#### Phase E5: Post-Analysis Verification (5 min)

14. Observer reads INSIGHTS_GRAPH.md:
    - E04: AI-SOURCE insights stay PENDING
    - E05: authority precedence in conflicts
    - E11: speaker correction propagated
15. Observer reads CONFLICTS.md:
    - E05: AI vs primary conflicts noted

#### Phase E6: Version Display (3 min)

16. Start app: `cd ~/Dev/repos/pd-spec--qa && node app/server/index.js`
17. Run E23: check browser header + API response
18. Run E24: manually set stale version in PROJECT.md, verify app still shows CHANGELOG version

#### Phase E7: Cleanup

19. Stop app
20. Restore sources: `cd ~/Dev/repos/pd-spec--qa && git checkout -- 01_Sources/ PROJECT.md`
21. Record results

### Success Criteria

- **24/24 extension tests pass** (E01–E24)
- **E08 critical:** content-based segmentation must activate for unsegmented transcript
- **E04 critical:** AI-SOURCE insights must NOT reach VERIFIED without primary corroboration
- **E13 critical:** Pass C must be a distinct LLM step, not bundled with mechanical passes
- **E20 critical:** batch checkpoints must exist for 11+ file extractions

### Combined QA v6 Totals

| Section | Tests | Critical |
|---|---|---|
| Main: WebSocket + Debounce + Cache + CPU | T01–T15 (15) | T13, T14 |
| Main: Regressions | R01–R10 (10) | — |
| Extension: Skill execution | E01–E24 (24) | E04, E08, E13, E20 |
| **Total** | **49** | **6** |
