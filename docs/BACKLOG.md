# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

> Ordered by priority (P1 → P2 → P3 → P4), then by effort (S → M → L → XL) within each tier.

### [BL-128] FEAT: Flexible Pipeline — Remove Forced Sequential Dependencies

**Status:** PROPOSED
**Priority:** P1
**Effort:** S
**Origin:** Wave 3.5 design session (2026-03-15). Design brief: `docs/DESIGN_3_5.md`, Layer 1A.
**Roadmap:** Wave 3, item 3.5a

**Problem:** Skills enforce sequential dependencies ("requires /extract first") that force users into a rigid pipeline even when they have context or want to work differently. This friction increases as the user gains experience with their project — the pipeline was valuable for TIMining weeks 1-2 but became a wall by week 3-4.

**Solution:** Skills check what's available and adapt instead of blocking:
- If no `EXTRACTIONS.md` exists → "I don't have extracted sources — want to start from conversation or bring files?"
- If no `INSIGHTS_GRAPH.md` exists → /spec works from whatever is available (extractions, conversation, or user-provided context)
- Pipeline sequence becomes a **suggested default**, not a gate

**Scope:**
- Remove hard dependency checks in `/analyze`, `/spec`, `/ship` SKILL.md files
- Replace with adaptive preamble: check what exists, inform user, suggest options
- No changes to `claude.js` or app code — purely SKILL.md changes

**Acceptance criteria:**
- `/analyze` runs without `/extract` having been called first (uses conversation or available context)
- `/ship` runs with partial Work layer (produces what it can, flags what's missing)
- Pipeline order is suggested in `/kickoff` output but not enforced

---

### [BL-129] FEAT: Kickoff Defines Project Type and User Profile

**Status:** PROPOSED
**Priority:** P1
**Effort:** S
**Origin:** Wave 3.5 design session (2026-03-15). Design brief: `docs/DESIGN_3_5.md`, Layer 1D.
**Roadmap:** Wave 3, item 3.5b

**Problem:** PD-Spec treats all projects the same — same pipeline, same tone, same depth. But a founder with an MVP needs diagnosis, a startup from scratch needs structure, and a team redesigning an existing ecosystem needs cross-referencing. The approach should depend on what exists.

**Solution:** Add 2 questions to `/kickoff`:
1. "What's the starting point?" → `project_type`: `ecosystem` | `from_scratch` | `existing_mvp`
2. "Who's driving this?" → `user_profile`: `founder_solo` | `designer` | `team_with_research`

Store in `PROJECT.md`. Skills read these values to adapt:
- **Tone:** more structured guidance for `founder_solo`, more peer-level for `designer`
- **Suggested workflow:** full pipeline for `from_scratch`, diagnostic-first for `existing_mvp`, crosses for `ecosystem`
- **Question depth:** deeper probing for `founder_solo` (Evidence Quality Model), lighter for `team_with_research`

**Scope:**
- Update `/kickoff` SKILL.md: add 2 questions + store in PROJECT.md
- Update `PROJECT.md` template: add `project_type` and `user_profile` fields
- Update `/extract`, `/analyze`, `/spec`, `/ship` SKILL.md preambles: read and use these values
- No changes to `claude.js` or app code

**Acceptance criteria:**
- `/kickoff` asks project type and user profile
- `PROJECT.md` stores the values
- At least one skill visibly adapts behavior based on these values (e.g., /analyze suggests different workflow for `existing_mvp` vs `from_scratch`)

---

### [BL-126] FIX: /extract --file Dedup — Path Normalization on Re-extraction

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** QA session /analyze redesign (2026-03-08). Observed during HEIC re-extraction with fix applied.

**Problem:** When `/extract --file` re-extracts a file already in EXTRACTIONS.md, it creates a duplicate section instead of overwriting the existing one. Root cause: path prefix mismatch between original entry (`01_Sources/Workshop 1/file.heic`) and new entry (`Workshop 1/file.heic`) — the lookup fails to find the existing section.

**Fix:** Normalize paths to a canonical relative form (without `01_Sources/` prefix) both on write and on lookup. Fix location: `consolidate.sh` dedup logic or extract SKILL.md section header format.

**Impact:** Without fix, EXTRACTIONS.md accumulates duplicate sections on reruns, inflating claim counts and confusing /analyze incremental mode.

---

### [BL-125] FEAT: Persist HEIC→JPG Conversion as Sidecar Artifact

**Status:** PROPOSED
**Priority:** P3
**Effort:** S
**Origin:** QA session /analyze redesign (2026-03-08). Idea surfaced during HEIC image extraction QA.

**Problem:** markitdown converts HEIC → JPG ephemerally for API consumption. The converted JPG is discarded after extraction. On reruns, conversion happens again (unnecessary cost + time). Users can't inspect what the model actually saw.

**Solution:** After conversion in `discover-sources.sh` step 8 (or consolidate.sh), persist the JPG as a sidecar in `02_Work/_temp/previews/` (or alongside original in `01_Sources/`). Reuse on subsequent runs if JPG already exists and HEIC hasn't changed (md5 check).

**Benefit:** Avoids redundant conversion, enables debugging when image claims are wrong.

---

### [BL-124] Parallel /analyze — Haiku Workers for Synthesis

**Status:** PROPOSED
**Priority:** P3
**Effort:** M
**Origin:** /analyze redesign session (2026-03-08). Applies BL-114 pattern to /analyze with a key architectural difference: synthesis requires cross-source context, so parallelism is split across 4 phases instead of 3.

**Architecture:**
```
Phase 1: Coordinator (Sonnet)
  → reads EXTRACTIONS.md, builds analyze_queue.json (sections + ID ranges per worker)

Phase 2: Workers (Haiku × N) — parallel
  → each worker: 1 section → atomic observations only (no IG-SYNTH, no cross-source synthesis)
  → writes _temp/tasks/section-N.md with pre-assigned ID range

Phase 3: Synthesis (Sonnet)
  → reads all compact atomic outputs
  → produces IG-SYNTH-XX cross-section, applies evidence tiers
  → cheaper than current: reads structured atomics, not verbose raw claims

Phase 4: Scripts ($0)
  → consolidate-analyze.sh: merge, cleanup, MEMORY.md
  → grade-tiers.sh: tier assignment + ANALYSIS.md generation
```

**Diff from BL-114:**
- `claude.js`: add `skillName === 'analyze'` to `useParallel`, new `runParallelAnalyze()` (~70 lines)
- `.claude/skills/analyze-worker/SKILL.md`: Haiku worker skill, atomic extraction per section (~60 lines)
- `scripts/consolidate-analyze.sh`: merge + cleanup (~40 lines, similar to consolidate.sh)
- `scripts/grade-tiers.sh`: parse INSIGHTS_GRAPH.md, apply tier rules, write ANALYSIS.md (~60 lines)
- Reuses: `runWorker()`, `buildWorkerSystemPrompt()`, queue JSON pattern, `streamQueryEvents()`

**Cost projection:** ~$0.15-0.25/run vs $0.99 current → 75-85% reduction
**Key risk:** Phase 3 synthesis quality from compact atomics — needs QA baseline comparison.

**Depends on:** /analyze redesign (v4.30) stable in production first.

---

### [BL-123] License Change — MIT → BSL 1.1

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** Business model session (2026-03-07). Current MIT license allows anyone to copy, modify, and commercialize PD-Spec without restriction. Incompatible with a future SaaS/commercial distribution model.

**Decision:** Change to **Business Source License (BSL 1.1)**. Used by MariaDB, Sentry, HashiCorp. Code stays visible (transparent, learnable, forkable for personal use), but commercial use requires a license from Nicolas Lundin. After a defined period (e.g., 4 years), converts automatically to Apache 2.0.

**Why BSL over alternatives:**
- CC BY-NC: designed for content, not software
- Proprietary: closes off community + learning use cases
- MIT (current): no commercial protection
- BSL: balances openness with commercial rights — standard in developer tooling

**IP reality check:** The SKILL.md methodology is an idea — ideas aren't copyrightable. BSL buys time and signals intent, not absolute protection. Real moat = ecosystem complexity + continuous iteration.

**Actions:**
- [ ] Replace `LICENSE` with BSL 1.1 text (Change Date = 4 years from release, Change License = Apache 2.0)
- [ ] Add `USAGE.md` — plain English: free for personal/non-commercial, contact for commercial use
- [ ] Update README with license badge
- [ ] Do before first public distribution / wider beta

---

### [BL-122] QA: E2E Pipeline Benchmark — SDK vs CLI

**Status:** PROPOSED
**Priority:** P1
**Effort:** S → M (now Wave A2, after Wave A pipeline fixes)
**Origin:** BL-115 QA session (2026-03-07). /extract parallel validated. /analyze, /spec, /ship partially benchmarked in pseudo-QA (2026-03-09). Need structured full comparison before declaring pipeline production-ready.

**Scope clarification (2026-03-09):**
This is Wave A2 — runs after Wave A (pipeline fixes: /spec + /ship autonomous, onboarding).

**Primary comparison axis: OUTPUT QUALITY**
- Are Haiku worker claims as good as Sonnet full-run claims?
- Are /analyze insights comparable in depth and granularity?
- Are PROPOSALS.md and STRATEGIC_VISION.md comparable?

**Secondary metric: COST (absolute, not comparative)**
- SDK: $X/file average, Y tokens/file average (real API cost)
- CLI: estimated equivalent cost using token count × public Sonnet pricing ($3/MTok input, $15/MTok output) — NOT real cost (Max plan has no per-token billing), but a normalized metric for comparison and value assessment

**Protocol:**
- Two branches: `qa-sdk` (existing pd-spec--qa worktree) and `qa-cli` (new CLI worktree)
- Same dataset: current QA set (6 sources, ~300 claims)
- Both run full pipeline: extract → analyze → spec → ship prd
- Capture per step: cost equivalent, tokens, wall clock, output file

**Quality evaluation:**
- Claims per file (extraction quality)
- Insights per claim ratio (synthesis quality)
- Insight tier distribution (Señal/Hipótesis/Supuesto)
- Proposal count and traceability (IG-XX refs per proposal)
- Reviewer reads both outputs blind and rates quality 1-5

**Pseudo-QA already done (2026-03-09, SDK):**
- /extract: ~$1.18 total (6 files, parallel Haiku) — $0.07/file avg — ✅
- /analyze full: ~$0.54, incremental: $0.62 — ✅
- /spec: $0.65 — ✅
- /ship: BLOCKED (mode detection bug, fixed in fa2f4b6) — pending rerun
- Total so far: ~$3.39 (includes --file retries)

**Deliverable:** `docs/qa/BL122_E2E_BENCHMARK.md` with side-by-side results table.

**Prerequisite:** Wave A complete (/spec + /ship autonomous and functional).

---

### [BL-121] FEAT: Phase 1.5 Transcript Preprocessing in Parallel Extract Mode

**Status:** PROPOSED
**Priority:** P4
**Effort:** M
**Origin:** QA BL-115 (2026-03-07). Comparison between parallel Haiku extraction and serial Sonnet extraction of the TIMining touchpoint transcript revealed missing speaker attribution. Root cause: Phase 1.5 (Pass A speaker diarization, Pass B phonetics, Pass C sentence repair) is absent from the parallel pipeline — the coordinator only does Phase 1 (discovery + classification).

**Accepted tradeoff (short term):** Phase 1.5 stays serial-only for now. Tools like Granola already produce speaker-attributed, normalized versions — export that instead of raw ASR. Sufficient for current use.

**Why this is non-trivial vs. Granola:** Granola preprocesses in isolation without project context. PD-Spec Phase 1.5 can use `_CONTEXT.md` and existing `EXTRACTIONS.md` metadata to resolve speaker ambiguity and phonetic corrections specific to the project's domain vocabulary. The contextual insight cross-referencing ("this claim closes tension [IG-19]") belongs to `/analyze`, not here — Phase 1.5 scope is normalization + clean speaker attribution only.

**If built (implementation path):**
- Coordinator detects transcript candidates after Phase 1
- Runs Phase 1.5 Passes A+B+C (Sonnet) → writes `_temp/filename_clean.md`
- Updates `actual_path` in `extract_queue.json` — workers receive clean version automatically
- Cost: ~$0.20-0.30/transcript, zero changes to worker code

**Future angle:** `/preprocess` skill or Pro tier for teams without Granola/equivalent.

---

### [BL-120] Agent Chat Log UI — Task Tracker with Parallel Progress

**Status:** PROPOSED
**Priority:** P2
**Effort:** M
**Origin:** Design session (2026-03-07). The current AgentView log is a fast-scrolling monolithic text stream. During complex operations (especially `/extract` with parallel workers), it's nearly impossible to understand what's happening — which tasks are running, which finished, what failed.

**Problem:** The agent chat log renders every SSE event as a flat text line. During parallel extraction (multiple workers processing sources simultaneously), all output interleaves into a single stream. The user sees a wall of text with no hierarchy, no progress indication, and no way to distinguish completed steps from active ones.

**Solution:** Replace the flat text log with a structured Task Tracker / Stepper component:

1. **Global activity indicator** — Animated circular loader at the top, pulsing while the agent is working. Disappears on completion.

2. **Task list as vertical stepper** — Each major step (Starting Worker, Extract Claims, Run Workflow, Execute Function, etc.) appears as a named row with status:
   - ✅ Completed tasks: green check icon + task name
   - ⏳ Running tasks: hollow circle + task name + **horizontal progress bar** filling in real-time
   - ⏸ Pending tasks: dimmed, no icon

3. **Nested log areas (terminal view)** — Each running task has an expandable area (chevron toggle) showing a mini-terminal with its specific log output. Text enters from the bottom pushing previous lines up (auto-scroll). Capped at ~50 visible lines to avoid DOM bloat, older lines discarded.

4. **Parallel visibility** — Multiple tasks can show progress bars and active logs simultaneously, making it visually evident that the system is working on multiple processes in parallel without saturating the main view.

**Data mapping:** The component needs to parse SSE events into structured task state. This requires either:
- (a) Structured SSE events from the server (preferred) — emit `{ type: 'task-start', id, name }`, `{ type: 'task-progress', id, current, total }`, `{ type: 'task-log', id, line }`, `{ type: 'task-complete', id }`
- (b) Client-side parsing of text patterns (fragile, not recommended)

Option (a) means changes to `app/server/claude.js` (SDK event processing) and the SSE endpoint to emit structured events alongside or replacing raw text.

**Reference:** Screenshot — `/Users/nlundin/Desktop/Screenshot 2026-03-07 at 9.27.38 AM.png`

**Files likely affected:**
- `app/client/AgentView.jsx` — New TaskTracker component (or refactor of existing log renderer)
- `app/client/AgentView.css` — Progress bars, stepper layout, animations
- `app/server/claude.js` — Structured SSE event emission
- `app/server/api.js` — SSE endpoint changes (if events change format)

**Acceptance criteria:**
- [ ] Completed tasks show green check + name, no log area
- [ ] Running tasks show progress bar filling based on `current/total` when available
- [ ] Each running task has an expandable log area with auto-scrolling terminal output
- [ ] Multiple tasks can show active progress simultaneously (parallel workers visible)
- [ ] Global loader animates while any task is running, stops when all complete
- [ ] Fallback: if SSE events are unstructured (legacy), render as flat text (graceful degradation)
- [ ] Log area per task capped at ~50 lines to prevent DOM bloat
- [ ] Done banner shows input/output token breakdown and estimated cost (`total_cost_usd` from SDK result). SDK already returns the data — currently only combined count is displayed.

---

### [BL-110] Extract Quality Fix — SDK Read Compatibility for Oversized-Line Sources

**Status:** IMPLEMENTED
**Priority:** P0
**Effort:** M
**Origin:** QA Wave 2.1 (2026-03-02). `/extract` from app produced 72% fewer claims than old runtime for the same source file (`Workshop 1/transcript.md`: 8 claims SDK vs 29 old). Root cause: SDK Read truncates lines >2000 chars, losing 95% of content for Granola STT transcripts (entire transcript on one line).

**Fix:** Script-first normalization in `discover-sources.sh` (step 8). Files with any line >2000 chars are sentence-split to ~1000 char lines and written to `02_Work/_temp/`. SKILL.md updated to read normalized versions. Also adds line count to file details, step 5c for files >1800 lines, and Read limits warning in SDK preamble.

**Partially implements BL-109:** Q&A mode now routes to Haiku (separate commit). Per-file skill routing remains open in BL-109/BL-80-P2.

**Files changed:** `scripts/discover-sources.sh`, `.claude/skills/extract/SKILL.md`, `app/server/claude.js`, `docs/BACKLOG.md`

---

### [BL-108] Agent View State Persistence — Survive Tab Switches

**Status:** IMPLEMENTED
**Priority:** P1
**Effort:** M
**Origin:** QA session 2026-03-01. Switching tabs in the app unmounts AgentView, losing the log and aborting the running SDK query. User lost a $5+ /extract run mid-execution.

**Problem:** AgentView stores all state (log, running, interaction) in React useState. When the user navigates to Dashboard or Browse and comes back, the component remounts with empty state. Worse: the SSE fetch is aborted on unmount, which triggers `req.on('close')` on the server → `abortController.abort()` → the SDK query is killed. Partial results are on disk but the task doesn't complete.

**Impact:** Users cannot check dashboard progress during a long /extract without killing the run. This makes the app unreliable for pipeline operations.

**Fix options:**

| Option | Approach | Effort |
|--------|----------|--------|
| 1 (recommended) | Lift SSE connection + log state to App level. AgentView renders from shared state. Tab switches don't unmount the connection. | M |
| 2 | Keep AgentView state but prevent unmount (CSS `display:none` instead of conditional rendering) | S — but hacky |
| 3 | Server-side run persistence — runs continue regardless of client connection. Client reconnects and replays log from server buffer. | L — most robust, needed for BL-83 SaaS |

**Acceptance criteria:**
- [ ] Switching tabs during a running skill does NOT abort the SDK query
- [ ] Returning to Agent tab shows the accumulated log
- [ ] If the run completes while on another tab, the log shows "Done" when the user returns
- [ ] After connection loss (WiFi, sleep, crash), reconnecting shows a recovery log of the previous run — what was executed, where it stopped, and whether it completed or failed. The user should never have to guess.

---

### [BL-111] BUG: Scroll-to-Top on Insight Approval — InsightsView

**Status:** IMPLEMENTED (v4.28.2)
**Priority:** P1
**Effort:** S
**Origin:** QA session with Hugo (2026-03-02). When approving (verifying) an insight in the InsightsView pending tab, the page scrolls to the top after each approval. Makes batch review painful — user must scroll back down after every click.

**Problem:** `useLiveData` refetches full insights after verify-insight.sh modifies file → chokidar → WebSocket → re-render → scroll lost.

**Fix:** Track scroll position continuously via passive scroll listener, restore synchronously with `useLayoutEffect` after data re-render.

**Acceptance criteria:**
- [x] Approving an insight does NOT change scroll position
- [x] Works for both single approval and rapid sequential approvals

---

### [BL-112] BUG: /analyze Always Applies Pending Without Asking

**Status:** IMPLEMENTED (v4.28.2)
**Priority:** P1
**Effort:** S
**Origin:** QA session with Hugo (2026-03-02). When running `/analyze` via Codex (GPT-5.3), the agent skipped the interactive question about whether to leave insights in PENDING and auto-applied the "recommended" option. In Claude Code the same flow sometimes re-asks unnecessarily.

**Problem:** The pending/verified prompt in `/analyze` is a friction point with no real value — insights should always start as PENDING (per the lifecycle in CLAUDE.md). The question exists as a legacy artifact.

**Fix:** Removed Question 1 (Synthesis) from Step 19b. Collapsed Phase 4 to always-PENDING path. Question 2 (Ambiguities) preserved.

**Acceptance criteria:**
- [x] `/analyze` never asks about pending vs verified — always PENDING
- [x] Skill file updated to remove the prompt
- [x] Works identically across Claude Code, SDK, and cross-LLM execution

---

### [BL-113] BUG: Token Overconsumption on PDF/PPT/DOCX Extraction

**Status:** PARTIALLY IMPLEMENTED
**Priority:** P1
**Effort:** M
**Origin:** QA session with Hugo (2026-03-02). Hugo's Claude Code Pro ($20/month) hit the usage limit after a single `/extract` run with ~6 files (PDFs, PPTs, DOCX). The agent reads binary files by having the LLM process them visually, consuming massive token budgets for what should be a deterministic text extraction.

**Problem:** Without npm packages for document parsing, the agent uses LLM vision/reasoning to extract text from PDFs and PPTs. A single PPT can cost $1-2 in tokens. This makes the tool unusable on the Pro plan and expensive even on Max.

**Fix:** Add deterministic preprocessing packages to the project:
- `pdf-parse` or `pdfjs-dist` for PDF text extraction
- `pptx-parser` or `officegen` for PPT/PPTX
- `mammoth` for DOCX
- Run these in `discover-sources.sh` (step 9+) to pre-extract text into `_temp/` as `.md` files
- Agent reads pre-extracted text instead of raw binaries

**Trade-off:** Adds npm dependencies (previously avoided for portability). Now that the webapp already requires `npm install`, this constraint is obsolete.

**Implementation (2026-03-06):** Spike validated `markitdown` (Python/Microsoft) as winner over npm alternatives — single package handles PDF, DOCX, PPTX, XLSX. Step 9 added to `discover-sources.sh`: detects python3 with markitdown, converts all binary sources to `_temp/*.md`, emits `PREPROCESSED` section. SKILL.md updated with PREPROCESSED > NORMALIZED > original redirect priority.

**E2E QA (2026-03-07 — Sonnet medium, 19 files, express mode):** Infrastructure PASS — 5 binaries preprocessed correctly (PDF 31K chars, DOCX 14K, PPTX 1.3K). Skill-level findings:

| OBS | Priority | Description | Fix needed |
|-----|----------|-------------|------------|
| OBS-BL113-04 | ~~P0~~ | ~~PREPROCESSED files classified as `pending-heavy` in express mode~~ | **FIXED** — SKILL.md updated 2026-03-07: PREPROCESSED = always light, highest priority override, no exceptions |
| OBS-BL113-01 | P1 | Checkpoint preventivo no escrito antes del primer compact (Sonnet skips maintenance steps under context pressure) | SKILL.md step 7: move checkpoint write to start of step, before Phase 1.5 |
| OBS-BL113-02 | info | 3 auto-compacts in 14 light files with Sonnet — O(N²) history confirmed | Resolved by BL-114/115 parallel extraction |
| OBS-BL113-03 | info | Touchpoint (1761 lines, 133KB) truncated to 480 lines by compact mid-read | Resolved by BL-114/115 parallel extraction |

**Parallel extraction OBS (BL-114/115, QA 2026-03-07):**

| OBS | Priority | Description | Status |
|-----|----------|-------------|--------|
| OBS-BL114-01 | P2 | Worker logs in UI show no filename — impossible to track which source is being processed | Tracked in BL-120 (Agent Chat Log UI) |
| OBS-BL114-02 | P2 | Parallel mode activation threshold uses file count only — should also consider total `size_kb` to avoid triggering parallel for 3 tiny files | OPEN — add `size_kb` threshold to `useParallel` gate in `claude.js` |
| OBS-BL114-03 | ~~P1~~ | ~~Phase 3 consolidation slow — mechanical work, candidate for external script~~ | **FIXED** — implemented as `scripts/consolidate.sh` (BL-115) |

**Remaining work:** Fix OBS-BL113-01 in SKILL.md. OBS-BL114-02 (size_kb threshold) in claude.js.

**Acceptance criteria:**
- [ ] PDF text extracted via markitdown, not LLM vision
- [x] PPT/PPTX slides extracted to text via markitdown
- [x] DOCX extracted via markitdown
- [x] Pre-extracted files written to `02_Work/_temp/` with source reference
- [x] `/extract` reads pre-extracted text in express mode (OBS-BL113-04 FIXED)
- [ ] Token cost for a 6-file project drops by >80%

---

### [BL-119] CLI Onboarding — Setup Script for New Users

**Status:** IDEA
**Priority:** P1
**Effort:** S-M
**Origin:** Hugo onboarding session (2026-03-02). Required live video call guidance to clone repo, install dependencies, and configure environment. Doesn't scale. Becomes more critical with BL-113 (npm preprocessing packages).

**Problem:** No automated setup. A new user must manually: install Node.js, clone the repo, run `npm install`, configure API keys, and understand the project structure. Hugo hit issues with Xcode CLI tools, npm permissions, and sandbox restrictions — all solvable but not discoverable without hand-holding.

**Idea:** A `setup.sh` (or `npx pd-spec init`) that detects the environment, installs what's missing, and guides the user. Format and scope TBD — could be minimal (check prerequisites + npm install) or comprehensive (interactive wizard). Should ship alongside or right after BL-113 since adding npm packages makes setup more important, not less.

**Distribution context (2026-03-07):** When the repo goes private (BL-123), this script becomes the primary distribution mechanism. Flow: user receives invite link or download URL → runs `curl | bash` → script downloads latest release zip (GitHub private release with token or public release artifact) → extracts, installs, configures. Users never need to clone the repo or see git history. Skills are present locally (Claude reads them) but not in-their-face.

---

### [BL-109] Image Read Cost — Model Routing for Visual Extraction

**Status:** PROPOSED (subitem of BL-80-P2)
**Priority:** P2
**Effort:** S
**Origin:** QA session 2026-03-01. 31 image files (26 PNG + 5 HEIC) drove ~60% of the $5.64 extract cost. Each image read costs ~1-2K input tokens for visual processing, and accumulated history compounds per turn.

**Problem:** All file reads (text and images) use Sonnet. For text files, Haiku would give ~95% equivalent results at 10x lower cost. For images, the quality tradeoff is less clear.

**Analysis:**

| File type | Haiku quality vs Sonnet | Recommendation |
|-----------|----------------------|----------------|
| `.md`, `.txt`, `.csv` | ~98% — text is text | Use Haiku |
| Screenshots, diagrams | ~90% — clear text/structure | Use Haiku |
| Workshop photos (post-its, whiteboards) | ~70-80% — loses small text, subtle spatial relationships | Keep Sonnet |
| HEIC/JPG (variable quality) | Depends on content | Keep Sonnet for safety |

**Conservative approach:** Haiku for text reads only, Sonnet for all images. Still saves significantly on the 12+ MD files per project. More aggressive routing (Haiku for simple images) can be tested empirically.

**Depends on:** BL-80-P2 (Model Routing infrastructure). Could be implemented as part of the subagent `reader` approach.

---

### [BL-114] BUG: Research Brief Titles in English — output_language Not Respected

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** QA session with Hugo (2026-03-02). The Research Brief (`02_Work/RESEARCH_BRIEF.md`) generated section titles in English (e.g., "What could be done better?") even though `output_language` in PROJECT.md was set to the project's target language.

**Problem:** The `/analyze` skill generates the Research Brief but its template or prompt includes hardcoded English section headers. The `output_language` directive from PROJECT.md is not being applied to structural headings.

**Fix:** Ensure `/analyze` skill instructions explicitly apply `output_language` to all generated content in RESEARCH_BRIEF.md, including section headers. No hardcoded English strings in the template.

**Acceptance criteria:**
- [ ] Research Brief section titles respect `output_language`
- [ ] No hardcoded English headings remain in the skill template for RESEARCH_BRIEF

---

### [BL-115] BUG: Evidence Gaps View — Hardcoded Logic vs LLM-Generated Gaps

**Status:** PROPOSED
**Priority:** P2
**Effort:** M
**Origin:** QA session with Hugo (2026-03-02). The EvidenceGapsView in the webapp showed generic, unhelpful gaps (e.g., "no source folder matching 'entrevista' detected") while the Research Brief's evidence gaps section — generated by `/analyze` — produced highly relevant gaps (e.g., "lack of primary user validation", "missing internal business data").

**Problem:** Two competing systems generate evidence gaps:

1. **`/api/evidence-gaps` (code, `app/server/api.js:342-399`)** — auto-computed from insights and source map. Uses hardcoded `expectedTypes` list (`entrevista`, `workshop`, `benchmark`, `analytic`, `documento`, `financier`) that doesn't adapt to the project. Produces three gap types: claim-level (single-source insights), category-gap (thin categories), and source-diversity (missing folder names). The source-diversity check is the worst offender — it just greps folder names against a Spanish keyword list.

2. **Research Brief evidence gaps (LLM, `/analyze`)** — written to `RESEARCH_BRIEF.md` by the agent during analysis. Context-aware, grounded in actual content, and useful. These are what the user actually wants to see.

The webapp view shows system #1 (the bad one). System #2 lives only in the markdown file and is not surfaced in the UI.

**Fix:** Replace the hardcoded gap computation with a parser that reads the evidence gaps section from `RESEARCH_BRIEF.md`. The `/api/evidence-gaps` endpoint should serve LLM-generated gaps, not code-computed ones. Keep claim-level gaps (convergence 1/N) as a supplementary signal since those are data-driven and useful.

**Acceptance criteria:**
- [ ] EvidenceGapsView displays gaps from RESEARCH_BRIEF.md (LLM-generated)
- [ ] Hardcoded `expectedTypes` source-diversity check removed
- [ ] Claim-level gaps (single-source insights) preserved as supplementary
- [ ] View works correctly when RESEARCH_BRIEF.md has no gaps section (empty state)

---

### [BL-116] BUG: Convergence Counter Uses Stale Denominator

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** Observed in pds--timining. An insight shows `Convergence: 15/54 sources` but the project has 76 total sources and extraction progress is 86% (11 unprocessed). The denominator (54) is whatever the LLM wrote during `/analyze` — it's a static string baked into INSIGHTS_GRAPH.md, not a live computation.

**Problem:** The `Convergence` field in each insight (e.g., `15/54 sources`) is written by the LLM at analyze-time. The denominator reflects the source count at that moment, not the current state. As new sources are added and extracted, the ratio becomes misleading. The dashboard has the real source count (`pipeline.sources`) but the insight cards display the stale LLM-written string.

The correct denominator is **processed sources** (i.e., sources that have been extracted), not total sources in the project. Unprocessed sources are just a pending queue — they haven't entered the system yet. In the example: 76 total, 65 processed (86%), so the denominator should be 65, not 54.

**Fix:** The denominator should come from `pipeline.extracted` (the processed source count from `discover-sources.sh`). Either recompute at display-time in the frontend/API, or ensure `/analyze` uses the script's processed count when writing the field. Existing stale values in INSIGHTS_GRAPH.md should be correctable via a re-run of `/analyze --full`.

**Acceptance criteria:**
- [ ] Convergence denominator matches the processed source count, not an LLM estimate
- [ ] New `/analyze` runs write the correct denominator from script output

---

### [BL-117] Authority Distribution Display — Tags Are Unclear

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** QA session with Hugo (2026-03-02). The Authority Distribution card in the dashboard shows raw tier labels (e.g., `Tier 1 (Direct Quote)`, `Tier 2 (Stakeholder Observation)`) as a flat list of badges. Users don't understand what the tiers mean or why they matter.

**Problem:** The authority field in INSIGHTS_GRAPH.md uses free-text labels that the LLM writes (e.g., `Tier 1 (Direct Quote)`, `Tier 3 (Hypothesis)`). The dashboard groups them via `AUTHORITY_TIERS` lookup (`Dashboard.jsx:13-18`) but falls back to raw strings when they don't match. This produces a mix of formatted and unformatted tags. Additionally, the card doesn't explain *why* the distribution matters — a project heavy on T3/T4 has weaker evidence than one with T1/T2 but this isn't surfaced.

**Fix:** Clean up the display — normalize authority strings to canonical tiers (T1-T4) in the parser or API, not just in the frontend lookup. Add a one-line contextual hint (e.g., "Higher tiers = stronger evidence grounding"). Consider a stacked bar instead of badge list for easier scanning.

**Acceptance criteria:**
- [ ] Authority tiers display consistently (no raw unmatched strings)
- [ ] Brief explanation of what authority tiers mean
- [ ] Visual hierarchy makes it easy to see if evidence is strong (T1-heavy) or weak (T3/T4-heavy)

---

### [BL-118] Extractions Count in Sidebar

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** QA session with Hugo (2026-03-02). Insights and Conflicts show a count badge in the sidebar, but Extractions does not. The user has no quick signal of how much raw data exists.

**Problem:** The sidebar `countKey` drives badge display (`app.jsx:105-109`). Extractions (`{ id: 'extractions', ... }`) has no `countKey`, so no badge appears. The dashboard API already returns `pipeline.claims` which is the natural count for extractions.

**Fix:** Add `countKey: 'claims'` to the extractions entry in `VIEW_REGISTRY` and wire `claims: dashboard.data.pipeline.claims` into the counts object.

**Acceptance criteria:**
- [ ] Extractions shows claim count badge in sidebar
- [ ] Badge updates live when new extractions are written

---

### [BL-102] Showcase — MDX Presentation System (Astro Submodule)

**Status:** v1 IMPLEMENTED (commit `73c5179`, 2026-02-28) · v2/v3 DEFERRED
**Priority:** P2
**Effort:** v1 L (done) · v2 M · v3 M
**Origin:** Session 2026-02-27. Analysis of freemode presentation token consumption in pds--timining. index.html (253 KB) + styles.css (68 KB) = ~80,000 tokens per edit. Content, layout, and styles are tangled — editing one slide requires reading the full monolith.

**Problem:** Freemode presentations are HTML monoliths where content is inseparable from presentation. Every edit (even a title change) costs ~63,000 tokens to read the file, find the slide, and make the change. Additionally, presentations can't leverage the Work layer's traceability — [IG-XX] refs are manually pasted text, not linked data.

**Solution — MDX slides + Astro renderer:**

```
pd-showcase/                    ← git submodule (engine: components, layouts, themes)
03_Outputs/_showcase/           ← project content (slides, images, theme overrides)
  decks/
    main/
      cover.mdx                 ← ~2 KB per slide
      pilares.mdx
      ...
  theme/
    overrides.css               ← project theme tokens
  deck.config.ts                ← deck metadata
```

Each slide is a ~2 KB MDX file with frontmatter (`order`, `title`, `layout`, `refs`, `notes`, `tags`). Ordering via `order` in frontmatter, not filename. Components are modular: primitives compose freely, patterns are convenience sugar.

#### v1 — Single Deck Migration (Effort: L) ✅ IMPLEMENTED

Scope limited to migrating the main presentation (`index.html`, 35 slides) to MDX. No auto-generation, no multi-deck, no theme generation.

**7 components** (derived from index.html slide analysis):

| Component | Slides using it | Description |
|---|---|---|
| `<Card>` | S3-S10, S22-S25 | Content card with icon, title, text. Variants: default, accent, muted |
| `<BenchCard>` | S11-S18 | Benchmark evidence: overview image (3:2), closeups, industry tag, domain color |
| `<CaseStudy>` | S19-S21 | Case study: quote + metric cluster + source attribution |
| `<DarFlow>` | S26-S27 | DAR decision flow: Decision → Alternatives → Rationale |
| `<RecBox>` | S28-S31 | Recommendation box: numbered rec, priority tag, IG refs |
| `<LayerDiagram>` | S22 | Stacked layer visualization (3 layers with descriptions) |
| `<Grid>` | all | CSS grid container (cols: 2-4, gap configurable) |

**Also includes:**
- `SlideLayout.astro` + `PresentationLayout.astro` (navigation, counter, transitions)
- `theme_spec.css` extracted from existing `styles.css` (CSS custom properties, not new design)
- Basic `/showcase` skill: `--init` (creates submodule + content structure) + edit mode (read/edit specific MDX files)
- `--dev` mode (starts Astro dev server)
- Single deck only (`main/`)

#### v2 — Multi-Deck + Generation + Legacy Migration (Effort: M, deferred)

- Multi-deck support (directory-based, per-deck config in `deck.config.ts`)
- `/showcase --generate [deck]` — auto-generate slides from Work layer data (STRATEGIC_VISION, PROPOSALS, INSIGHTS_GRAPH)
- Additional pattern components for variant presentations (interna, v2_boceto slide types)
- PRESENTATION.md as seed for `--generate`
- **Legacy migration:** `interna_w5.html` and `v2_boceto.html` pending Astro migration (currently in `_custom/`)
- **Molecules layer:** Extract recurring patterns into base components when convergence confirms

#### v3 — Themes + Traceability + Export (Effort: M, deferred)

- `/showcase --theme` — auto-generate project theme from STRATEGIC_VISION + BENCHMARK_UX context
- `<InsightRef>` component with build-time data from INSIGHTS_GRAPH_INDEX (depends on BL-101)
- Presenter mode (speaker notes route)
- **Export pipeline:** `showcase/scripts/html2pptx.py` + `export-pdf.sh` (build → export → compress via ghostscript). Replaces manual ilovepdf.com workflow. Output to gitignored `showcase/exports/`.
- CSS variable injection from `theme.config` (colors, fonts, runtime switching beyond light/dark, presets: corporate/minimal/vibrant)
- Mermaid diagram embedding via remark plugin

#### Future — Slide Comments (visual annotation for batch edits)

- Floating dev-only widget: click any component/slide, leave text annotation
- Comments saved to `_comments.json` or `COMMENTS.md` (slide ID + component selector + text)
- `/showcase --apply-comments` — agent reads comments, applies batch changes across MDX files, clears applied
- Inspired by Figma comments / Google Docs suggestions, for code-rendered presentations
- Open: per-slide vs per-component granularity, structured JSON vs freeform markdown, ephemeral vs persistent

#### Testing (not yet implemented)

- Currently visual verification + `npx astro build`
- Consider: Playwright screenshot regression tests per slide
- Consider: `astro check` / `tsc` for type validation in CI

**Relationship to /ship:** `/ship presentation` → PRESENTATION.md (markdown). `/showcase --generate` (v2) → MDX slides (visual). They coexist.

**User story:**
> As a UX consultant preparing a client presentation, I can edit slide content in a 2 KB MDX file — seeing hot-reload in my browser — instead of navigating a 253 KB HTML monolith. Each slide traces to verified insights.

**Full plan:** `docs/PLAN_TOKEN_OPTIMIZATION_AND_SHOWCASE.md`
**Ideas:** `showcase/IDEAS.md`

---

### [BL-103] Markdown Rendering — Agent View + Interaction Panel

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** OBS-W1-06, OBS-W1-14 (QA Wave 1, 2026-02-26). Session 2026-03-01 formalized as BL.

**Problem:** The Agent view and Interaction panel render raw markdown — `**bold**` appears as literal asterisks, headings as `###` plain text. `formatText()` only converts `[IG-XX]`/`[CF-XX]` to badges but does not render markdown.

**Solution:** `RichText` component (or library integration: `marked`/`react-markdown`) used consistently in Agent log, Interaction panel (`ask_confirmation`, `ask_selection`, `ask_text`), and any surface where the LLM emits text.

**Note post-SDK:** The rendering surface changes (SDK emits messages with different structure than custom SSE), but the underlying problem is identical: render LLM markdown in the UI. The RichText component survives the migration.

**Wave:** 3 (Self-Service). Quick win UX post-SDK.

---

### [BL-104] Agent State Persistence + Response History

**Status:** PROPOSED
**Priority:** P2
**Effort:** M
**Origin:** OBS-W1-08, OBS-W1-08b (QA Wave 1, 2026-02-26). Session 2026-03-01 formalized as BL.

**Problem:** Navigating away from the Agent view (e.g., clicking an `[CF-XX]` badge) unmounts the component and loses all state (log, response, mode). Returning shows a blank view.

**Solution:** (a) Preserve Agent view state in React context (not component-local). (b) Response history as collapsible cards that persist across navigation.

**Note post-SDK:** The agent state model changes with the SDK (sessions, messages, tool results vs. SSE events). Implementation must be redone post-migration, but the UX problem (state lost on navigation) is identical. Formalize after migration when the new data structure is clear.

**Wave:** 3 (Self-Service).

---

### [BL-105] Checkpoint Integrity — Deterministic from Script Output

**Status:** PROPOSED
**Priority:** P2
**Effort:** S
**Origin:** OBS-W1-17 (QA Wave 1, 2026-02-26). Session 2026-03-01 formalized as BL.

**Problem:** SESSION_CHECKPOINT.md recorded a status change as IG-15 instead of IG-02 after an invalidation. The script pipeline was correct — the error was the LLM summarizing narratively which insight changed and getting the ID wrong.

**Root cause:** The checkpoint is written by the LLM as narrative summary. The LLM confused the insight ID.

**Solution:** Insight state changes in checkpoint must derive from deterministic script output (e.g., `verify-insight.sh` stdout confirms which ID was changed), not from LLM narrative memory. Rule 90/10: mechanical data → script, not LLM.

**Note post-SDK:** The SDK has automatic context compaction, which may change how checkpoints are managed. But the principle (deterministic data from scripts, not LLM narrative) applies regardless.

**Wave:** 3 (Self-Service).

---

### [BL-106] MCP App — PD-Spec as MCP Server + Funnelized UI

**Status:** PROPOSED
**Priority:** P3 (medium term — post Wave 3)
**Effort:** L
**Origin:** Session 2026-03-01. MCP Apps spec official (January 2026), adoption confirmed in Claude, ChatGPT, VS Code, Goose.

**Problem:** PD-Spec today is accessible only as (a) CLI via Claude Code or (b) webapp (local/hosted). Both require setup, configuration, and context. The largest market is users already inside Claude, ChatGPT, or VS Code who want to analyze sources without leaving their tool.

**Solution:** PD-Spec as MCP server exposing tools (`/extract`, `/analyze`, `/ship`) with interactive UI via MCP Apps (`@modelcontextprotocol/ext-apps`).

**Two products, two jobs-to-be-done:**

| | Webapp (PD-OS) | MCP App |
|---|---|---|
| Experience | Complete — orchestration, project management, dashboard | Entry point — funnel: "upload sources → analyze → generate report" |
| Target | Teams, consultants adopting PD-Spec as methodology | Anyone in Claude/ChatGPT/VS Code wanting quick analysis |
| Onboarding | Requires setup, configuration | Zero friction — appears in chat |
| Skills | Full pipeline with all modes | Subset optimized for linear flow |

**Domain:** Product design research. Not a generic document analyzer. Knows what to look for: pain points, opportunities, contradictions between qualitative and quantitative, gaps between stakeholder requests and user data.

**Value vs. "just ask the model":**
- **Multi-source conflict detection** — crosses sources and detects contradictions. Average user doesn't know to ask for this.
- **Structured, actionable output** — not a wall of text but a formatted, prioritized report ready for design decisions.

**Conversion funnel:** User discovers PD-Spec as MCP App → likes it → needs more control/collaboration → upgrade to full webapp.

**Coexistence:** Both tracks advance in parallel without architectural conflict, as long as skills remain the shared layer. The MCP App skills are a subset of PD-Spec skills, optimized for a more constrained experience.

**Depends on:** BL-80 Phase 1 (SDK migration). The modular architecture (skills → orchestrator → Claude module) is prerequisite for exposing the engine as MCP server.

**References:**
- [MCP Apps spec](https://modelcontextprotocol.io/docs/extensions/apps)
- [ext-apps SDK](https://github.com/modelcontextprotocol/ext-apps)
- [UX_CONTRACT.md](UX_CONTRACT.md) — Guided mode IS the MCP App interaction model
- [BACKLOG_REPRIORITIZATION_V2.md](BACKLOG_REPRIORITIZATION_V2.md) — Full strategic rationale

**Wave:** 4 (MCP App).

---

### [BL-107] Design System Cleanup — Tokenize Inline Styles

**Status:** PROPOSED
**Priority:** P3
**Effort:** S
**Origin:** OBS during BL-86 implementation (2026-03-01). Badge fix exposed scattered inline styles and magic values across JSX components.

**Problem:** Repeated inline styles in JSX (`fontSize: '0.75rem'`, `color: 'var(--text-muted)'`, `fontWeight: 500`) instead of reusable CSS classes. Values are hardcoded, making consistency manual.

**Solution:** Extract repeated inline patterns into CSS utility classes in `components.css` (e.g. `.sub-label`, `.list-muted`). No architecture change — just move inline styles to classes using existing tokens. Modularization (CSS Modules, Tailwind, etc.) only if app complexity demands it later.

---

### [BL-101] Work Layer Index System — Token Optimization

**Status:** IMPLEMENTED (v4.26.0, 2026-02-28)
**Priority:** P1
**Effort:** L
**Origin:** Session 2026-02-27. pds--timining (densest project: 60+ sources, 199 KB EXTRACTIONS, 68 KB INSIGHTS_GRAPH) consumes ~89,000 tokens per `/analyze` run. 90% of the cost is data reads, not skill instructions.

**Problem:** Skills read full accumulation files regardless of how much data they need. `/analyze` in incremental mode (3 new sections of 65) still reads the entire 199 KB EXTRACTIONS.md to scan timestamps, and the entire 68 KB INSIGHTS_GRAPH.md to check for duplicates.

**Solution — Auto-generated indexes with offset/limit reads:**

```
02_Work/
  _index/                          ← auto-generated, safe to delete + regenerate
    EXTRACTIONS_INDEX.md           ← ~5 KB (section table with line ranges)
    INSIGHTS_GRAPH_INDEX.md        ← ~5 KB (ID/title/status table with line numbers)
    {source}_normalized_INDEX.md   ← ~3 KB (topic/chunk table with line ranges)
```

**Key design decisions:**
- **Threshold: 20 KB.** Files below this are read directly. Synthesis files (STRATEGIC_VISION, PROPOSALS, RESEARCH_BRIEF) are NOT indexable — their value is in cohesive narrative.
- **Indexes are optimizations, not requirements.** If missing or stale → skill falls back to full read. No skill depends on index existence.
- **Staleness detection:** MD5 hash (8 chars) in index header. One shell command, zero tokens.
- **Script-first:** `generate-index.sh` (bash + awk) generates all index types. 100% deterministic, zero LLM cost.
- **Skills regenerate indexes after writes:** `/extract` regenerates EXTRACTIONS index, `/analyze` regenerates INSIGHTS_GRAPH index.

**Files that get indexed:** EXTRACTIONS.md (accumulation, discrete claims), INSIGHTS_GRAPH.md (accumulation, discrete entries), _temp/*_normalized.md (transcripts, segment-based).

**Files that do NOT get indexed:** STRATEGIC_VISION.md, PROPOSALS.md, CONFLICTS.md, RESEARCH_BRIEF.md, SYSTEM_MAP.md, IDEAS.md (synthesis files, read in full).

**Estimated savings:**

| Scenario | Current | With indexes | Savings |
|---|---|---|---|
| `/analyze` incremental | ~89K tokens | ~15K tokens | ~83% |
| `/audit` | ~75K tokens | ~12K tokens | ~84% |
| `/ship prd` | ~75K tokens | ~15K tokens | ~80% |

**Acceptance criteria:**
- [ ] `generate-index.sh` supporting 3 types (extractions, insights, normalized)
- [ ] Index line numbers validated against source files (line ranges match actual content)
- [ ] Staleness detection working (hash mismatch → fallback to full read)
- [ ] `/extract` generates EXTRACTIONS + normalized indexes after completion
- [ ] `/analyze` uses indexes with fallback, generates INSIGHTS_GRAPH index after completion
- [ ] `/spec`, `/audit`, `/ship`, `/visualize` prefer indexes when available
- [ ] Behavioral equivalence: pipeline with indexes produces same results as without (T-101-05)
- [ ] Measurable token reduction (>50% for incremental `/analyze`)

**User story:**
> As a PD-Spec user with a dense project (60+ sources), my session token budget lasts significantly longer because skills read compact indexes (~5 KB) instead of full data files (~200 KB), loading the complete data only when they need specific entries.

**Test plan:** `docs/PLAN_TOKEN_OPTIMIZATION_AND_SHOWCASE.md` §Test Plans

**Full plan:** `docs/PLAN_TOKEN_OPTIMIZATION_AND_SHOWCASE.md`

**⚠️ App Runtime Compatibility — RESOLVED BY BL-80 Phase 1:**

The index system requires `Read(offset, limit)` and `Bash` — capabilities missing from the current custom Agent Runtime. Analysis in session 2026-02-27 identified this as a fundamental gap. BL-80 Phase 1 (SDK migration) resolves this: the Claude Agent SDK provides all required capabilities natively.

**Dependency:** BL-101 can be implemented immediately for CLI use. Full app compatibility arrives with BL-80 Phase 1.

**⚠️ Skill instruction constraint (important for implementation):**

Skill modifications (SKILL.md files) must be **runtime-agnostic**. After BL-80 Phase 1, skills run identically in Claude Code CLI and the Agent SDK in the app. Instructions must NOT reference tool-specific patterns.

| ✗ Don't write | ✓ Write instead |
|---|---|
| "Use the Bash tool to run `md5 -q`" | "Run `./scripts/generate-index.sh`" |
| "Use Read with offset=X, limit=Y" | "Read lines X-Y of the file" |
| "Call the Grep tool to search" | "Search the file for pattern X" |

The agent resolves these to the correct tool in each runtime. Skills describe *what to do*, not *which tool to use*.

---

### [BL-100] Deliverable Architecture — MASTER + Specific Documents

**Status:** PROPOSED
**Priority:** P2
**Origin:** Field experience with TIMining /ship outputs. All deliverable types re-synthesize the same insights independently, producing repetitive, shallow documents that feel interchangeable.

**Problem:**
1. **Repetition:** Each `/ship [type]` generates a standalone document that re-explains the same IGs, strategic context, and key concepts. A PRD, presentation, and lean canvas for the same project read 70% identical.
2. **No hierarchy:** Documents are peers with no shared narrative. No single source of truth for "what this project is about" — each document reinvents it.
3. **One-size-fits-all:** All 10 ship types are available regardless of project context. A B2B SaaS project doesn't need a journey map. A benchmark UX doesn't need personas. The agent should reason about which deliverables are relevant.

**Solution — MASTER + Specifics architecture:**

```
03_Outputs/
  MASTER.md              ← executive synthesis, single narrative, references specifics
  ├─→ PERSONAS.md        ← deep dive (if applicable)
  ├─→ USER_STORIES.md    ← deep dive (if applicable)
  ├─→ JOURNEY_MAP.md     ← deep dive (if applicable)
  ├─→ LEAN_CANVAS.md     ← deep dive (if applicable)
  └─→ ...
```

**Key design decisions:**
- **MASTER replaces PRD.** The current PRD tries to be both executive summary and detailed spec — it does neither well. MASTER is the single narrative document. "PRD" as a term is too dev-centric for a research/strategy tool.
- **Specifics don't repeat context.** They reference MASTER for shared concepts and go deep on their own domain. A persona doc doesn't re-explain the strategic vision — it links to MASTER §Strategy and focuses on archetypes.
- **Agent proposes, user decides.** `/ship` with no args → agent analyzes the Work layer and proposes which specifics are relevant (with reasoning). User approves, rejects, or edits the list. `/ship [type]` forces generation of a specific document regardless.
- **Relevance is semantic.** The agent reasons about project type, insight categories, and conflict themes to recommend specifics. A project heavy on user-need insights gets personas + journey maps. A project heavy on business/strategy gets lean canvas + strategy report.

**Scope:**
- [ ] Define MASTER.md structure (replaces PRD — executive synthesis with cross-references)
- [ ] Refactor /ship skill: no-arg mode proposes deliverable set, typed mode forces specific
- [ ] Specifics reference MASTER instead of re-synthesizing IGs
- [ ] Agent reasoning for deliverable relevance (which specifics fit this project)
- [ ] Deprecate `prd` as ship type, migrate to MASTER
- [ ] Update /ship help and CLAUDE.md skill table

**Open questions:**
- Should MASTER be generated once and specifics incrementally, or all at once?
- When the Work layer changes (new insights, resolved conflicts), does MASTER auto-update or require explicit `/ship` re-run?

---

### [BL-99] Improved Conflict Lifecycle — OPEN/NEEDS-*/RESOLVED with IG Actions

**Status:** PROPOSED
**Priority:** P1
**Origin:** Field experience with TIMining (13 conflicts). Current model shows "0 PENDING" when 4 conflicts are unresolved (intermediate states split from PENDING). "Resolve with context" saves text but doesn't touch related insights — orphaned field notes with no traceability.

**Problem:**
1. **Misleading dashboard:** Intermediate states (Flagged, Research) are counted separately from PENDING, so "0 PENDING" lies about project state.
2. **Orphaned resolutions:** "I have context" writes a note to the CF but takes no action on related IGs. User writes "CTO validated proposal B" thinking it acts as a decision, but IG-A stays VERIFIED and IG-B stays VERIFIED — nothing changes.
3. **No note accumulation:** Field notes from stakeholder sessions can't be incrementally added to a conflict without closing it.

**Solution — New conflict lifecycle:**

```
/analyze detects
       │
       ▼
    ┌──────┐
    │ OPEN │  ← detected, not yet reviewed
    └──┬───┘
       │ user reviews
  ┌────┼──────────┐
  │    │          │
  ▼    ▼          ▼
NEEDS  NEEDS    RESOLVED
RESEARCH DISCUSSION  (context + IG action)
  │    │
  │    │  new info / decision
  └────┼──────┐
       │      ▼
       └─→ RESOLVED
            (context + IG action)
```

**4 statuses:**
| Status | Meaning | Who triggers |
|---|---|---|
| `OPEN` | Detected, not reviewed | `/analyze` |
| `NEEDS-RESEARCH` | Reviewed, needs more data | User via app or /spec |
| `NEEDS-DISCUSSION` | Reviewed, needs stakeholder decision | User via app or /spec |
| `RESOLVED` | Closed with mandatory context + IG action | User via app or /spec |

**Key design decisions:**
- **Notes accumulate.** Adding context to an OPEN or NEEDS-* conflict doesn't close it — it's intelligence gathering. Notes stack chronologically.
- **Resolution = IG action (always).** Resolving a conflict requires both context text AND an action on related insights (keep A, keep B, merge, invalidate both). No orphaned resolutions.
- **RESOLVED is atomic:** context + IG action happen in one step. The CF records what was decided and why; the IGs reflect the decision.

**Migration:** Rename existing statuses: PENDING → OPEN, PENDING — Flagged → NEEDS-DISCUSSION, PENDING — Research → NEEDS-RESEARCH, RESOLVED stays RESOLVED. Audit existing RESOLVED CFs for orphaned resolutions (context text but no IG changes).

**Scope:**
- [ ] Update CONFLICTS.md format and status legend
- [ ] Update conflict parser (4 statuses, note accumulation)
- [ ] Update ConflictsView + ConflictCard UI (new badges, note timeline)
- [ ] Update resolve-conflict.sh (OPEN → NEEDS-*/RESOLVED transitions, IG action enforcement)
- [ ] Update /analyze skill (new conflicts created as OPEN)
- [ ] Update /spec skill (new resolution flow with mandatory IG action)
- [ ] Migrate existing TIMining conflicts

**Future (separate BL):** Auto-resolution — `/analyze` crosses new claims against open CFs and proposes closure when contradiction no longer exists.

---

### [BL-87] Interactive Insight Actions — Challenge, Reject with Reason, Stale Conflict Warning

**Status:** PARTIALLY IMPLEMENTED (v4.25.2)
**Priority:** P2
**Origin:** QA v7, OBS-32/33/34/46. No way to challenge a VERIFIED insight, reject with a reason note, or detect when a conflict becomes stale after an insight decision.

**Problem:** The pipeline only flows forward (sources → claims → insights). Field discoveries that contradict VERIFIED insights require a full pipeline round-trip. Reject actions lose context (no reason stored). Stale conflicts silently persist.

**Solution:**
1. "Challenge" button on VERIFIED insights → creates a new conflict entry with counter-evidence
2. Reject action includes optional reason note → stored in INSIGHTS_GRAPH.md
3. App detects when insight status changes make existing conflicts stale → banner warning

**Implemented (v4.25.2):**
- [x] "Invalidate" button on VERIFIED insights with required reason note
- [x] Reject (PENDING) includes reason note persisted via verify-insight.sh
- [x] Cascade protection warns about orphaned references before invalidating

**Remaining:**
- [ ] Challenge action creates a conflict entry linked to the insight (separate from Invalidate)
- [ ] Stale conflict detection and visual warning

**User story:**
> As a researcher reviewing insights after a new round of interviews, I can challenge a previously VERIFIED insight directly from the app, without manually editing Work layer files.

---

### [BL-89] Truth-Level Labeling in Output Deliverables

**Status:** Proposed
**Priority:** P2
**Origin:** TIMining IDEAS.md ("Niveles de veracidad para Cómo Aplica") + QA v7 OBS-61 + OBS-59. Hallucination risk in prescriptive content.

**Problem:** `/ship` outputs mix three types of content without distinguishing them:
1. **Diagnosis** — evidence-based claims traceable to `[IG-XX]` (e.g., "9 VERIFIED insights have convergence 1/57")
2. **Recommendation** — reasoned suggestions grounded in the knowledge base but not directly in sources (e.g., "prioritize Jefe de Turno interviews")
3. **Hypothesis** — predictions about future outcomes with no evidence (e.g., "2 interviews will resolve CF-13 in one round")

Currently all three render identically in prose. The reader can't tell which statements are facts, which are expert opinion, and which are guesses. This is the root cause of OBS-61 (STRATEGY and AUDIT prescribing interview methodology as if it were a conclusion) and the fabricated resolution claims in SESSION_CHECKPOINT.

**Evidence:**
- **OBS-61:** STRATEGY.md and AUDIT.md both contain "Etapa 2" research roadmaps with specific interview questions, sample sizes, and resolution predictions — presented as conclusions, not hypotheses.
- **OBS-59:** BENCHMARK_UX has 16 referents without web verification — the anti-hallucination rule exists but wasn't enforced. Truth-level labels would make unverified claims visible.
- **IDEAS.md "Niveles de veracidad":** TIMining team already identified this pattern: benchmark "Cómo Aplica" sections oscillate between verified, projection, and aspirational without labels.

**Solution:** Define three truth levels and require `/ship` to label content explicitly:

| Level | Label | Meaning | Visual in app |
|---|---|---|---|
| **Verified** | `[VERIFIED]` or `[IG-XX]` ref | Traceable to source evidence | Default (no special marker) |
| **Projected** | `> **[PROJECTED]** — rationale` | Logical inference from evidence, not directly sourced | Blockquote with amber marker |
| **Hypothetical** | `> **[HYPOTHESIS]** — rationale` | Prediction or assumption, needs validation | Blockquote with red marker |

Skill instructions for `audit`, `strategy`, `presentation`, and `benchmark-ux` get explicit boundaries:
- "Diagnose gaps and state validation needs → VERIFIED"
- "Recommend next steps with rationale → PROJECTED"
- "Predict outcomes or prescribe methodology → HYPOTHESIS (flag explicitly)"
- "Never present HYPOTHESIS as VERIFIED"

**Acceptance criteria:**
- [ ] Three truth levels defined in `/ship` SKILL.md
- [ ] `audit` and `strategy` skills include diagnostic-vs-prescriptive boundary
- [ ] HYPOTHESIS content uses blockquote with explicit label
- [ ] `benchmark-ux` anti-hallucination rule enforced: unverified referents labeled
- [ ] Live Research App renders truth-level blockquotes with distinct visual treatment

**User story:**
> As a consultant presenting a Strategy document to a client, I can clearly see which statements are backed by evidence, which are logical recommendations, and which are hypotheses that need validation — so I can modulate my confidence when presenting each one.

---

### [BL-56] Export Layer — Multi-Format Deliverable Export

**Status:** Proposed
**Priority:** P2
**Origin:** BL-33 Phase 1 (deferred) + Granola transcript (Feb 20). Evidence: TIMining `html2pptx.py` proof-of-concept (34 slides, editable PPTX). Real workflow gap: IDEMAX produces deliverables in PD-Spec but needs to share them via Google Docs, PowerPoint, and Notion.

**Problem:** Deliverables are Markdown in `03_Outputs/`. To share with clients or stakeholders outside the PD-Spec workflow, the user must manually copy, reformat, or rebuild in the target tool. There's no export path from the knowledge base to common external formats.

**User framing:** "En el caso de IDEMAX, el mundo ideal sería exportar a Google Docs con alguna herramienta tipo MCP o manualmente exportar un PPT que se pueda importar a Google Docs y trabajarlo desde ahí."

**Evidence from TIMining:**

| | Python `html2pptx.py` | Node `dom-to-pptx` (experiment branch) |
|---|---|---|
| **Approach** | Parse HTML with BeautifulSoup → reconstruct in PPTX | Render in headless Chrome → capture DOM → export |
| **Fidelity** | ~80% (reconstructs layout) | ~95% (captures actual render) |
| **Editability** | High (text, shapes, tables editable) | Low (slides as images) |
| **Dependencies** | `beautifulsoup4` + `python-pptx` | `playwright` + `dom-to-pptx` + local fonts |
| **Complexity** | High (1,200 lines, hardcoded for TIMining) | Medium (~250 lines, generic) |
| **Generalizable** | Needs refactoring | Works on any HTML out of the box |

**Implementation path:**
- Phase 1: PPTX export via python-pptx or Pandoc (offline, no API) — from Markdown outputs
- Phase 2: Google Docs/Notion via MCP connectors (API-dependent)
- Phase 3: Figma structured data → component population (future)

**Homer's Car check:** IDEMAX has a real need today (client deliverables go to Google Slides). Markdown-first outputs (v4.20.0) simplify export — no need for content-first HTML restructuring.

**Acceptance criteria:**
- [ ] At least one format working (PPTX recommended — highest stakeholder demand)
- [ ] Script-based conversion (no LLM tokens)
- [ ] Generic parser (PD-Spec Markdown conventions, not hardcoded per output type)
- [ ] At least one API-based export path (Google Docs or Notion) via MCP

**User story:**
> As a UX consultant finishing a research sprint, I can export my PRD and Personas directly to an editable PPTX or Google Docs to share with a client who doesn't use PD-Spec — without manually reformatting.

---

### [BL-65] Open Questions — Actionable Research Items

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7, OBS-48. Open Questions buried at bottom of System Map. Not prominent, not actionable. Research gaps deserve visibility — they drive what the team should do next.

**Problem:** Open Questions are passive text in an unintuitive location. A researcher can't quickly see "what do we still need to find out?" without scrolling through product architecture.

**Solution:**
1. Surface Open Questions in Dashboard as actionable items (card or section)
2. Each question shows: text, related insights/conflicts, suggested action
3. Future: suggested actions with priority ("Urgente: workshop de alineación", "Entrevista con usuario final para validar IG-07")

**Acceptance criteria:**
- [ ] Open Questions visible in Dashboard (not buried in System Map)
- [ ] Each question shows related refs
- [ ] Optional: suggested methodology/action per question

**User story:**
> As a research lead reviewing project state, I can see open questions prominently and understand what actions to take next, without digging through the System Map.

---

### [BL-81] Google Drive Integration — Cloud Source Provider

**Status:** Proposed
**Priority:** P2
**Origin:** Hugo sync (2026-02-23). Hugo suggested directly: "¿Y si podéis conectarle un drive?"

**Problem:** Current workflow requires users to manually copy files into `01_Sources/` on their local machine. This is friction for onboarding, makes collaboration difficult, and doesn't match how teams already organize research (Google Drive, Dropbox, etc.).

**Solution:** Google Drive API or MCP integration that syncs a Drive folder → `01_Sources/`. User selects a Drive folder in the app, files are pulled locally for processing.

**Architecture options:**
- A) **MCP approach**: Use Google Drive MCP server, list/download files on demand
- B) **Sync approach**: Background process watches a Drive folder, pulls new/changed files
- C) **Hybrid**: Browse Drive in app, user selects files to import → copied to `01_Sources/`

**Evidence:**
- Hugo: *"¿Y si podéis conectarle un drive mejor?"*
- Hugo: *"Ahí no tendría que subir archivo, pero subí al drive"*
- Nico confirmed it was already on his mental roadmap

**Acceptance criteria:**
- [ ] User can connect a Google Drive account from the app
- [ ] Browse Drive folders and select files to import
- [ ] Selected files copied to `01_Sources/` with metadata preserved
- [ ] Subsequent `/extract` processes them normally

**User story:**
> As a consultant with research documents in Google Drive, I can connect my Drive to the app and select folders to import, without manually copying files to a local directory.

---

### [BL-83] Hosted/SaaS Architecture Planning

**Status:** Proposed
**Priority:** P2
**Origin:** Hugo sync (2026-02-23). Hugo asked directly: "¿Lo podrías publicar? ¿Subí arriba?"

**Problem:** The Live Research App runs on localhost only. This limits adoption to users who can run a terminal and clone a git repo. For consulting teams and non-technical users, this is a hard blocker.

**Solution:** Architecture plan (not implementation) for a hosted version. Document the minimum viable infrastructure: auth, file upload, multi-tenant isolation, billing, and deployment.

**Scope (planning only — no implementation):**
1. Auth: OAuth (Google) or magic link
2. File storage: S3-compatible bucket per tenant (replaces local `01_Sources/`)
3. Multi-tenancy: isolated Work layers per project
4. LLM integration: ties into BL-80 (BYOK or platform credits). **Trial model idea (2026-03-07):** platform provides ~$2 in API credits for a guided E2E trial (10-15 files → full pipeline ~$1.70). If user completes it and likes the result, they upgrade to BYOK or a paid credits pack. No billing infra needed for trial — fixed budget enforced server-side by token counter. Margin on credits pack: ~8-10x ($15-20 for $1.70 worth of API).
5. Deployment: single Node.js app (Express + React, already exists) behind reverse proxy
6. Billing: usage-based (LLM tokens) or flat subscription

**Platform credits model — risks and mitigations (2026-03-07):**

In the platform credits model (user pays PD-Spec → Nicolas's API key handles all Anthropic calls), Nicolas absorbs the following risks:

| Risk | Scenario | Mitigation |
|---|---|---|
| Underpricing | Real usage (3 iterations, re-runs) exceeds the assumed 1 E2E run per credit pack | Price credits with 2-3x usage buffer; benchmark real usage before launching |
| No spend cap | User uploads 200 files, runs /extract --full — Anthropic bills $12, user had $5 in credits | Hard token budget enforced server-side; run aborts if balance exhausted mid-run |
| Card fraud | User buys $10 credits with stolen card, burns API, files chargeback | Stripe fraud detection; delay first run by 24h for new accounts |
| Anthropic price increase | Credits sold at today's price, Anthropic raises rates | Don't pre-sell large credit packs; keep credits short-lived (90 day expiry) |

BYOK model has none of these risks (user pays Anthropic directly) but has higher onboarding friction. Both models should coexist: BYOK for technical users, platform credits for non-technical/trial users.

**Evidence:**
- Hugo: *"¿Y esto es un localhost? ¿Lo podrías publicar?"*
- Nico: *"Puede tener un login, puedo pagar, puedo cobrar un fee"*
- Hugo: *"Sí, o sea, es que por lo que..."* — confirmed demand
- Market signal: multiple people in Two Brains/Acid Labs ecosystem interested

**Acceptance criteria:**
- [ ] Architecture document with component diagram
- [ ] Tech stack decisions documented (auth, storage, deployment)
- [ ] Cost estimate (infrastructure + LLM tokens per project)
- [ ] Migration path from localhost to hosted (what changes, what stays)
- [ ] Decision on MVP scope (what's in v1 hosted, what's deferred)

**User story:**
> As the PD-Spec maintainer planning a go-to-market, I have a clear architecture document for the hosted version so I can estimate effort and make build-vs-buy decisions.

---

### [BL-48] AI Convergence Breakdown — Show Authority Distribution in Convergence Ratios

**Status:** Proposed
**Priority:** P3
**Origin:** QA v4 (2026-02-20), QA4-OBS-04. Evidence: AI source contributed 18/59 to convergence ratios, indistinguishable from stakeholder sources in dashboard display.

**Problem:** After BL-37, AI-generated sources enter the pipeline with `voice: ai` and `authority: hypothesis` metadata. However, convergence ratios (e.g., `18/59`) don't surface this distinction. A dashboard consumer sees `18/59` and assumes 18 independent stakeholder data points — but 1 of those 59 sources is AI-generated.

**Solution:** Extend convergence display format to show authority breakdown:

```
Convergence: 18/59 (1 AI, 1 internal)
```

Or in dashboard JSON:
```json
{
  "convergence": "18/59",
  "convergence_breakdown": { "primary": 57, "internal": 1, "ai": 1 }
}
```

**Scope:** Refinement of BL-37 display layer. No logic changes — AI sources already tagged correctly. Only affects how convergence is rendered in INSIGHTS_GRAPH.md entries and STATUS.html dashboard.

**Acceptance criteria:**
- [ ] Convergence ratio in INSIGHTS_GRAPH.md shows authority breakdown when non-primary sources exist
- [ ] Dashboard JSON includes `convergence_breakdown` field
- [ ] Dashboard template renders breakdown (e.g., footnote or parenthetical)
- [ ] No change when all sources are primary (clean `18/59` display)

---

### [BL-66] Extractions Collapse/Expand per Source

**Status:** IMPLEMENTED (v4.27.0, 2026-03-01, commit `923912e`)
**Priority:** P3
**Origin:** QA v7, OBS-10. 1200+ claims fully expanded is inutilizable. User feedback: "extractions está buenísimo" but needs navigability.

**Problem:** All claims shown expanded. Scrolling through 54 source sections with 1200+ claims is impractical.

**Solution:** `ExtractionCard` component in `MarkdownView.jsx`. Cards collapsed by default with chevron toggle, source path, tags, and claim count chip. Click to expand full claims list.

**Acceptance criteria:**
- [x] Claims collapsed by default
- [x] Click to expand full list
- [x] Source headers always visible with claim count

---

### [BL-82] AI Output Audit Mode — Cross-Tool Verification

**Status:** Proposed
**Priority:** P3
**Origin:** Hugo sync (2026-02-23). Evidence: TIMining project where Nico audited Gemini outputs and found hallucinations.

**Problem:** Teams use multiple AI tools (Gemini, ChatGPT, NotebookLM) for research, and the outputs often hallucinate without anyone noticing. There's no systematic way to verify AI-generated claims against primary sources.

**Solution:** An audit mode where users submit AI-generated outputs (from any tool) and PD-Spec verifies each claim against the project's source base. Output: report showing what's verified, what's unverified, what's fabricated.

**Evidence from TIMining:**
- Gemini generated a "strategic master document" with invented concepts: *"La gobernanza de datos automáticas, esto lo inventó totalmente"*
- Gemini inflated case counts and fabricated business metrics
- Claude analysis produced a structured comparison: *"Lo que hizo bien... Dónde está inflado y no es verificable... Inventó"*
- Hugo confirmed he'd seen the comparison: *"Hizo como una evaluación del resultado de Gemini versus lo que detectaba él"*

**Acceptance criteria:**
- [ ] User can upload or paste an AI-generated document as "audit target"
- [ ] System cross-references claims against existing INSIGHTS_GRAPH and EXTRACTIONS
- [ ] Output report: verified claims (with [IG-XX] refs), unverified claims, fabricated claims
- [ ] Report includes confidence level and source attribution

**User story:**
> As a consultant who used Gemini to generate a strategy document, I can run it through PD-Spec's audit mode and get a report showing which claims are backed by real evidence and which were hallucinated.

---

### [BL-85] STT Correction Loop — Persistent Glossary

**Status:** Proposed
**Priority:** P3
**Origin:** QA v7, OBS-29. Phonetic corrections in /extract are session-local — the glossary built during preprocessing is discarded after the session. Recurring domain terms (e.g., "TIMining", "IDEMAX", "CFO") must be re-corrected every time a new transcript is processed.

**Problem:** Each `/extract` session builds a context glossary from scratch by reading PROJECT.md, _CONTEXT.md, and existing insights. This works but wastes tokens re-discovering the same corrections. For projects with many transcripts, the same STT errors appear repeatedly.

**Solution:** Persistent `02_Work/GLOSSARY.md` that accumulates corrections across extractions:
- Each `/extract` proposes new glossary entries from phonetic corrections
- User approves → entries persisted
- Future extractions auto-apply approved entries before LLM processing
- Format: `| Original | Corrected | Confidence | Source | Date |`

**Acceptance criteria:**
- [ ] Glossary file created/updated after each preprocessing session
- [ ] Approved corrections auto-applied in future extractions
- [ ] User approves new entries (propose-before-execute)
- [ ] Glossary readable in Live Research App

**User story:**
> As a researcher processing multiple interview transcripts, I want phonetic corrections from previous sessions to be remembered, so I don't re-approve the same corrections every time.

---

### [BL-70] Evidence Gaps Redesign

**Status:** Proposed
**Priority:** P3
**Origin:** QA v7, OBS-09. Hardcoded checklist with naive folder-name matching. "financier" not valid Spanish. Low-value output that confuses users.

**Solution:** Either elevate to match STATUS.html quality (parse insights for weak convergence, cross-reference conflicts, read `_CONTEXT.md` for source types) or simplify to just show low-convergence insights. Remove hardcoded expected types.

**Acceptance criteria:**
- [ ] No hardcoded source type checklist
- [ ] Gaps derived from actual data (low convergence, uncovered categories)
- [ ] Actionable output (what to do about each gap)

---

### [BL-76] Structured Execution Logging + Session History

**Status:** Proposed
**Priority:** P3 (upgraded from P4 — MEMORY proven unreliable)
**Origin:** QA v7, OBS-28 + OBS-57 + OBS-58. TIMining IDEAS.md: "Session history como archivo estructurado."

**Problem:** MEMORY.md is narrative, not parseable, and proven unreliable:
- **OBS-57:** Agent fabricated neat hourly timestamps (14:00, 15:00, ...) for a 24-min batch execution. Timestamps are fiction.
- **OBS-58:** Agent left MEMORY at 79 lines (1 below threshold) without proactive compaction — literal threshold interpretation.
- **OBS-56:** Duplicate entry (PRESENTATION logged twice) — no deduplication guard.
- **OBS-60:** REPORT.md missing entirely from MEMORY — invisible work.
- **IDEAS.md:** TIMining maintained a separate HISTORY file (450+ lines) with reasoning and decision context — "mucho más útil que MEMORY.md para recovery post-compaction."

MEMORY.md tries to be both audit trail and recovery mechanism. It fails at both when agents fabricate timestamps, skip entries, or approach the line limit without compacting.

**Solution:** Two complementary mechanisms:
1. **Structured execution log** — `02_Work/_temp/EXECUTION_LOG.md` (JSONL or markdown table). Each skill emits entries: timestamp (actual wall-clock), phase, action, target file, duration, token count. Machine-parseable. Not subject to compaction. Future: Activity view in Live App consuming WS events.
2. **MEMORY.md protocol hardening** — Fix the rules that allowed OBS-56/57/58/60:
   - Timestamps: "use actual wall-clock time or omit — never estimate"
   - Compaction: trigger at 60 lines (not 80) — proactive, not emergency
   - Deduplication: check last entry before appending
   - Coordinator responsibility: when using subagents, verify all outputs logged

**Acceptance criteria:**
- [ ] Skills emit structured log entries with actual timestamps
- [ ] Log format parseable (JSONL or structured markdown)
- [ ] MEMORY.md protocol updated: proactive compaction, dedup guard, timestamp rule
- [ ] Subagent coordinator validates all outputs logged before closing

---

### [BL-75] QA Tooling — Automated File Watcher + Sonnet Subagent

**Status:** Proposed
**Priority:** P4
**Origin:** QA v7, OBS-27 + OBS-39. Manual polling during QA is tedious. Playwright snapshots consume main agent context.

**Solution:**
1. File watcher script for QA observer: configurable polling, change detection, stability signal
2. Playwright verification delegated to Sonnet subagent: compact pass/fail results, no full snapshots in main context

**Acceptance criteria:**
- [ ] QA watcher script available as utility
- [ ] Playwright verification returns structured results (not raw snapshots)

---

### [BL-86] UI Styling Consistency — Mono Badges, Chips, Counts

**Status:** PARTIALLY IMPLEMENTED (2026-03-01, commits `923912e`, `73d6c2c`)
**Priority:** P4
**Origin:** QA v7, OBS-41/42/43/44/45. Multiple minor styling inconsistencies across the Live Research App: badge fonts not uniformly mono, count chips inconsistent between views, category headers use different weight/size conventions.

**Problem:** Each component was built independently; styling conventions drifted. Not a functional bug, but creates a "homemade" feel that undermines credibility during stakeholder demos.

**Done:**
- Unified `.badge-id`/`.badge-insight` and `.badge-conflict-id`/`.badge-conflict` CSS (eliminated duplicates)
- Added `.count-chip` reusable utility class
- Status badges now have consistent 1px borders (30% fg opacity)
- Fixed bare badge on proposal type → `badge-subtle`

**Remaining (→ BL-107):**
- Extract repeated inline styles to CSS utility classes
- Category headers: consistent `text-transform`, `font-weight`, `letter-spacing`

**Acceptance criteria:**
- [x] All badges use `var(--font-mono)` consistently
- [x] Count chips uniform across views
- [ ] No visual regressions (Playwright snapshots)

---

### [BL-72] Source Coverage Summary View

**Status:** Proposed
**Priority:** P4
**Origin:** QA v7, OBS-12. Regression from STATUS.html — no per-folder overview of extraction state, claim counts, format badges.

**Solution:** Aggregate SOURCE_MAP + EXTRACTIONS data by folder. Could be a section at top of Extractions view or per-folder badges in Sources.

**Acceptance criteria:**
- [ ] Per-folder summary: file count, extraction status, claim count, format badges
- [ ] Visible without drilling into individual files

---

### [BL-22] RAG Layer — Scale Source Ingestion Beyond Context Window

**Status:** Proposed
**Priority:** Low (becomes High at 100+ sources)
**Depends on:** BL-17

**Problem:** PD-Spec reads all sources sequentially. Works for 10-20 sources. At 57+ files, context compaction causes state loss and file skipping. NotebookLM handles 100+ via RAG.

**Solution:** BM25 keyword search (zero deps) or embeddings + vector store. Index claims as extracted, query for relevant context instead of loading all.

**Scaling strategy:**
- BL-29 (batching): Handle 40-100 files done
- BL-31 (express mode): Handle 100-200 files by deferring heavy files
- BL-22 (RAG layer): Handle 200+ files with embeddings + retrieval

**Re-evaluation note (2026-02-20):**

The 3-layer compression model may make full RAG unnecessary. Evidence from TIMining (61 files, 1,238 claims → 21 insights): downstream skills (/synthesis, /ship) never see raw volume. Analysis by pipeline phase:

| Phase | Needs RAG? | Why |
|---|---|---|
| /extract | No — already incremental (file-by-file, BL-29 batching) |
| /analyze | Maybe — reads full EXTRACTIONS.md. Worked at 1,238 claims. Bottleneck at ~5,000+ |
| /synthesis | No — works on INSIGHTS_GRAPH (21 items in TIMining, already compressed) |
| /ship | No — works on Work layer (already synthesized) |
| Freemode | Maybe — cross-source queries, but BL-41 (state management) reduces need |

Options under consideration:
- **A) Keep as-is** — Low priority, activate when a project hits 200+ sources
- **B) Reformulate as "Smart Context Loading"** — no embeddings/vector store, just thematic clustering of claims so /analyze processes by topic instead of sequentially. Lighter, no infra deps.
- **C) Kill** — Homer's Car. The scaling strategy already covers realistic project sizes. Projects with 200+ sources may need sub-project decomposition, not RAG.

Decision deferred — revisit when a real project hits the ceiling.

---

### [BL-80] LLM Integration in Live Research App — Agent Architecture

**Status:** PHASE 0 COMPLETE (Wave 1, v4.25.1–v4.25.2) · PHASE 1 IMPLEMENTED (v4.27.0, SDK migration)
**Priority:** P0 (elevated from P1, session 2026-03-01)
**Effort:** Phase 1: M · Phase 2: L · Phase 3: M
**Origin:** Hugo sync (2026-02-23). Evidenced daily pain: "flujo roto" where users copy prompts from app to Claude terminal. Architecture reassessed 2026-02-28 after discovering fundamental limitations in the custom Agent Runtime.

**Phase 0 — PoC Validated (Wave 1, COMPLETE):**
- [x] BYOK settings UI — user enters Claude API key, stored server-side in memory
- [x] Q&A mode — text input in app → LLM responds using Work layer context
- [x] Action mode — approve/reject/invalidate insights from UI → verify-insight.sh
- [x] Conflict resolution from UI → resolve-conflict.sh
- [x] Pipeline execution from app — /extract, /analyze, /spec triggered via UI
- [x] WebSocket broadcasts file changes after every action

**What Wave 1 validated:** The need is real. Users want to act from the browser. The "flujo roto" pain is gone for basic actions.

**What Wave 1 revealed — the custom Agent Runtime doesn't scale:**

The current `agent-runtime.js` is a hand-rolled, limited reimplementation of what Claude Code does:

| Capability | Custom Agent Runtime (current) | Claude Agent SDK |
|---|---|---|
| File reads | `read_file` — full file only, no offset/limit | `Read` — offset + limit native |
| Shell | `run_script` — 6 whitelisted scripts only | `Bash` — full shell (sandboxed) |
| File search | `search_files` — 5-match limit, basic grep | `Grep` + `Glob` — full regex, patterns |
| Context mgmt | Manual trimming to 2000 chars/result | Automatic compaction (same as Claude Code) |
| Model | Hardcoded Sonnet | Configurable (Opus, Sonnet, Haiku) |
| Subagents | Not supported | `Task` tool native |
| Sessions | In-memory, 8h TTL, no resume | Persistent with resume/fork |
| MCP | Not supported | Declarative configuration |
| Skills | SKILL.md injected as system prompt | Native skill loading from `.claude/skills/` |

**Consequence:** Skills cannot run identically in CLI and app. Every engine improvement (BL-101 indexes, future skills) requires parallel compatibility work or degrades in the app. Scaling this architecture means maintaining two runtimes that drift apart.

**Root cause:** BL-80 Wave 1 was built before the Claude Agent SDK existed as a viable option. The custom runtime was the right call at the time. It's no longer the right foundation for Phases 2+.

---

#### Phase 1 — SDK Migration (Effort: M) ← NEXT

Replace `agent-runtime.js` + agent loop in `claude.js` with Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`).

**What changes:**
- Agent loop → `query()` async generator with streaming
- 8 custom tools → SDK built-in tools (Read, Write, Edit, Bash, Glob, Grep)
- `ask_confirmation`/`ask_selection`/`ask_text` → `canUseTool` callback that routes to WebSocket → frontend InteractionPanel
- Manual context trimming → SDK automatic compaction
- SKILL.md injection → native skill loading via `settingSources`
- BYOK API key → passed to SDK options

**What stays the same:**
- React frontend (Dashboard, InsightCard, FileBrowser, AgentView)
- REST API for parsed data (`/api/insights`, `/api/conflicts`, etc.)
- WebSocket file watcher (chokidar → broadcast changes)
- BYOK settings UI
- SSE/WebSocket streaming to client (SDK messages → frontend)

**Design principle — SaaS-ready interfaces, localhost implementations:**

Phase 1 introduces service abstractions designed for multi-tenant SaaS, but implemented simply for localhost. This avoids rewriting when Phase 3 arrives:

| Abstraction | Phase 1 (localhost) | Phase 3 (SaaS) |
|---|---|---|
| `WorkspaceService` | Local filesystem path | Isolated container per user/project |
| `SessionStore` | In-memory Map | Database (Postgres/Redis) with TTL |
| `ExecutionQueue` | Direct `query()` call | Job queue with concurrency limits |
| `KeyVault` | Memory (current BYOK) | Encrypted store, BYOK vs platform keys |

The SDK integration goes through these abstractions — never called directly from route handlers. When Phase 3 swaps implementations, the Express routes and frontend don't change.

**Acceptance criteria:**
- [x] `agent-runtime.js` replaced by SDK `query()` call (v4.27.0)
- [x] All 3 skills (/extract, /analyze, /spec) execute identically in app and CLI (v4.27.0)
- [x] `canUseTool` callback renders interaction UI (confirmations, selections, text input) in browser (v4.27.0 — AskUserQuestion bridging implemented, pending real-project validation)
- [x] Context compaction handled by SDK (no manual trimming) (v4.27.0)
- [x] Scripts execute via `Bash` tool (no whitelist needed) (v4.27.0)
- [x] BL-101 index system works in app (v4.27.0 — via preamble instructions + Read offset/limit, not deterministic guard)
- [ ] `WorkspaceService`, `SessionStore`, `ExecutionQueue`, `KeyVault` interfaces defined (deferred per rule of three)

**Risk:** SDK requires Node.js server-side process with filesystem access. Current deployment is localhost (fine). Remote deployment (Wave 3, BL-83) needs sandboxed containers (E2B, Modal, Fly). This is a Phase 3 concern, not a blocker for Phase 1.

#### Phase 2 — Model Routing + Cost Control (BL-80-P2)

**Status:** PROPOSED
**Priority:** HIGH
**Depends on:** BL-80 Phase 1 (IMPLEMENTED)

**Problem:** /extract costs $1.77 per full run (43 files, 151 claims). ~96% of cost is accumulated history per turn, not system prompt. SKILL.md optimization (v4.27.1) gave ~24% reduction but hit diminishing returns.

**SDK findings (2026-03-01):**
- `query.setModel()` exists — changes model mid-session, requires streaming input mode
- `agents` option supports subagents with independent `model: 'haiku'`
- Model per query is trivial (1-line change) but doesn't help within a single skill run

**Options (ordered by recommendation):**

| Option | Approach | Diff | Effort | Impact |
|--------|----------|------|--------|--------|
| 1 (recommended) | Subagent `reader` with `model: 'haiku'` for discovery/reading. Main agent (Sonnet) only synthesizes | ~50-80 lines in claude.js | 1 day | High — Haiku 10x cheaper per turn for reads |
| 2 | `setModel()` mid-session — refactor to streaming input mode for full per-turn control | ~200-300 lines | 2-3 days | High — granular control |
| 3 | Model per mode (Haiku for Q&A, Sonnet for skills) — trivial but doesn't reduce cost within skills | 1 line | trivial | Low for pipeline skills |

**Target:** Reduce /extract cost to <$0.50 per full run.

**Also addresses:**
- Cost estimation before execution ("this /analyze run will cost ~$0.40")
- Usage tracking per session (SDK returns `input_tokens` + `output_tokens`)
- Foundation for pricing tiers (operations/month, model access level)

#### Phase 3 — Remote Deployment + Multi-Tenant (Effort: M, deferred)

**Problem:** SDK runs as a local process with filesystem access. For remote deployment (BL-83), each user/project needs an isolated environment.

**Architecture options (to evaluate):**
1. **Ephemeral containers** — one container per session, destroyed on completion (E2B, Modal, Cloudflare Sandboxes)
2. **Persistent containers** — long-running per user, with session resume (Fly Machines, Daytona)
3. **Hybrid** — ephemeral for pipeline execution, persistent for Q&A/browsing

**Four multi-tenant concerns** (must be resolved before production SaaS):

1. **Workspace isolation** — each client has their own projects, files, and sessions. A user's `query()` must never access another user's filesystem. Container-per-workspace is the natural boundary.
2. **API key management** — two models: BYOK (user brings their Anthropic key, we route it) vs platform-provided (we own the key, charge markup). Both must coexist. Key storage must be encrypted at rest.
3. **Execution queue** — 50 users running `query()` simultaneously is unsustainable without concurrency control. Need: per-user rate limits, global queue with priority, backpressure to the UI ("your job is queued, position 3").
4. **Result persistence** — agent session state must survive beyond the WebSocket connection lifetime. User closes browser → comes back → sees results. Requires persisting conversation history + Work layer snapshots to database, not just SDK in-memory state.

**Acceptance criteria:**
- [ ] `WorkspaceService` implementation with container-per-workspace isolation
- [ ] `KeyVault` implementation with encrypted storage, BYOK + platform key coexistence
- [ ] `ExecutionQueue` implementation with per-user limits and backpressure UI
- [ ] `SessionStore` implementation with database persistence and reconnect recovery
- [ ] At least 2 concurrent users can run pipelines without interference (smoke test)
- [ ] User closes browser mid-execution, reopens → sees completed results

**Depends on:** Phase 1 + BL-83 (deployment)

---

**Strategic context (from product analysis, 2026-02-28):**

The competitive advantage of PD-Spec as SaaS is NOT the SDK integration or the UI — it's the **orchestration**: the methodological framework that defines what to investigate, in what order, how to validate, and how to synthesize. The SDK is plumbing. The value is in how the plumbing is used.

Architecture layers for future SaaS:
```
User (liquid UI)
    ↓
PD-Spec Orchestrator (waves, skills, QA — YOUR IP)
    ↓
Model abstraction layer (routing, cost control, retry logic)
    ↓
Claude Agent SDK → Anthropic API
```

The model abstraction layer enables future multi-model support if demanded, but Claude-first is the correct default. The quality requirements (no-hallucination, conflict detection, evidence traceability) need a top-tier model under our control.

**🔀 Strategic fork: SaaS standalone + MCP App (DECIDED: coexistence, session 2026-03-01)**

Two distribution models for PD-Spec — decided as complementary, not mutually exclusive. See BL-106.

| | **Route A: SaaS standalone** | **Route B: MCP App** |
|---|---|---|
| **What** | Custom web app (current path) | PD-Spec as MCP server that returns interactive UI |
| **User goes to** | pd-spec.app (your domain) | Claude, ChatGPT, VS Code, any MCP-compatible host |
| **UI ownership** | Full control (your React frontend) | MCP Apps protocol — iframed components via `ui://` resources |
| **Multi-host** | Only your app | Any client supporting MCP Apps standard |
| **Infrastructure** | You own servers, auth, billing, deployment | Host provides infra; you provide the MCP server |
| **Business model** | SaaS subscription | Marketplace/plugin model, or self-hosted MCP server |
| **Maturity** | Proven pattern | MCP Apps is new (Jan 2026), protocol still evolving |

Route B is provocative: PD-Spec wouldn't need to be a standalone app. It could be an MCP server with interactive UI that runs *inside* Claude, ChatGPT, or any compatible host. The user doesn't go to "your app" — they use their preferred AI tool and PD-Spec appears as an embedded interactive experience.

MCP Apps will become more powerful with Claude Cowork (Anthropic's multi-step desktop agent) — exactly the kind of orchestrated flow PD-Spec manages.

**This doesn't change Phases 1-2.** The Agent SDK migration and model routing are correct regardless of distribution model.

**Decision (2026-03-01): Coexistence.** Both routes proceed in parallel. The webapp (PD-OS) is the full product for teams/consultants. The MCP App (BL-106) is a funnelized entry point for users already in Claude/ChatGPT/VS Code. Same engine, different experiences. See [BACKLOG_REPRIORITIZATION_V2.md](BACKLOG_REPRIORITIZATION_V2.md) for full rationale.

**Risk update (2026-03-01):** MCP Apps adoption confirmed — Claude, ChatGPT, VS Code, Goose all support it. Anthropic + OpenAI collaborated on the spec. The original risk ("protocol may not gain host adoption") has largely dissipated. Remaining risk: complex multi-step UX (conflict resolution, 35-slide presentations) may not fit in chat-embedded iframes. Mitigation: the MCP App is NOT the webapp reduced — it's a simplified funnel designed for that context.

**Evidence:**
- Nico: *"La única paja que tiene este sistema todavía es que no puedes hacer ninguna acción real acá"*
- Hugo: *"Le metería un LLM, eso sí"*
- Session 2026-02-27: App Runtime Compatibility Gap discovered — `read_file` has no offset/limit, `generate-index.sh` not whitelisted, 2000-char context trimming
- Session 2026-02-28: Claude Agent SDK analysis confirms it provides ALL capabilities missing in custom runtime
- Session 2026-02-28: MCP Apps analysis — protocol enables interactive UI returned from MCP tools, hosted in any compatible client
- Session 2026-03-01: OpenClaw case validates vendor lock-in risk. MCP Apps adoption confirmed (Claude, ChatGPT, VS Code, Goose). Skills identified as portable by nature (.md with rules). SDK elevated to P0. UX Contract specified. Coexistence webapp + MCP App formalized. See [BACKLOG_REPRIORITIZATION_V2.md](BACKLOG_REPRIORITIZATION_V2.md)

**Related documents:**
- [BACKLOG_REPRIORITIZATION_V2.md](BACKLOG_REPRIORITIZATION_V2.md) — Wave 2 plan, acceptance criteria additions, rate limit analysis
- [UX_CONTRACT.md](UX_CONTRACT.md) — User interaction model (Guided/Pipeline modes, gate policies, SDK requirements)
- [IDEAS_LLM_QA_PATTERNS.md](IDEAS_LLM_QA_PATTERNS.md) — LLM quality assurance patterns (tool guardrails, critic agent)
- [qa/SDK_MIGRATION_DISCARDED.md](qa/SDK_MIGRATION_DISCARDED.md) — Items that die with the runtime migration

**User story:**
> As a researcher using PD-Spec in the browser, I get the same analytical power as the CLI — skills run identically, context is managed intelligently, and I can interact with the agent at every decision point through a visual interface instead of a terminal.

**User story (Route B alternative):**
> As a product researcher using Claude, I connect the PD-Spec MCP server and get an interactive research workspace embedded in my conversation — waves, insights, conflicts, and deliverables — without leaving my AI tool.

**References:**
- [Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Agent SDK TypeScript reference](https://platform.claude.com/docs/en/agent-sdk/typescript)
- [CUI — open source web UI for Agent SDK](https://github.com/wbopan/cui)
- [claude-agent-server — WebSocket wrapper](https://github.com/dzhng/claude-agent-server)
- [MCP Apps — interactive UI from tools](http://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)

---

### [BL-77] Preprocessing Review + Project Glossary

**Status:** PARKED — Needs architecture design
**Priority:** P2 (high value, high effort)
**Origin:** QA v7, OBS-26 + OBS-29 + OBS-30 + OBS-31. No UI to review speaker attributions or phonetic corrections. No persistent glossary. No STT correction loop.

**Problem:** Three interconnected gaps: (1) preprocessing decisions are fire-and-forget, (2) no persistent phonetic/terminology map, (3) corrections don't propagate. A glossary system would solve all three.

**Vision:** `02_Work/GLOSSARY.md` accumulating across extractions:
- **People**: speaker identity + role
- **Terms**: domain vocabulary
- **Phonetic map**: STT corrections (cirios ante aras → silos entre áreas)

Each `/extract` proposes new entries → user approves → approved entries auto-apply in future extractions. Corrections propagate through pipeline.

**Depends on:** Second project to validate the pattern. TIMining provides evidence but a single project isn't enough for this scale of infrastructure.

---

### [BL-78] Insight Challenge + Feedback Loop

**Status:** ABSORBED by BL-87 — Invalidate-with-reason and cascade protection shipped in BL-87 (v4.25.2). Remaining scope (challenge-creates-conflict, stale conflict detection) lives in BL-87's "Remaining" list.
**Priority:** P2 (high value, high effort)
**Origin:** QA v7, OBS-32 + OBS-33 + OBS-34.

## ✅ Implemented (Archive)

<details>
<summary><strong>BL-15 to BL-97 — v4.25.0 (Architecture & Lifecycle)</strong> (click to expand)</summary>

### [BL-73] System Map → Strategic Vision + Design Proposals

**IMPLEMENTED (v4.25.0, 2026-02-25) — /resolve → /spec rename. SYSTEM_MAP.md replaced by STRATEGIC_VISION.md + PROPOSALS.md with parsers, API endpoints, and dedicated app views.**

### [BL-95] Design Proposals — The Missing Layer Between Insights and Outputs

**IMPLEMENTED (v4.25.0, 2026-02-25) — [DP-XX] entity type with domain/module/feature taxonomy. PROPOSALS.md structure, parser, API endpoint, and app view.**

### [BL-92] Script-First Skill Decomposition

**IMPLEMENTED (v4.25.0, partial — Phase 1) — Five utility scripts: next-id.sh, count-statuses.sh, verify-insight.sh, resolve-conflict.sh, reset.sh. /reset skill deprecated. Phase 2 (app write endpoints) and Phase 3 (Claude API in app) deferred.**

### [BL-93] Insight Lifecycle

**IMPLEMENTED (v4.25.0, partial — L1+L4) — Six statuses, Last-updated field, freshness indicator (green/yellow/red), verify-insight.sh with cascade protection. L2 (supersession detection) and L3 (relevance scoring) deferred.**

### [BL-90] Navigation History Stack

**IMPLEMENTED (v4.25.0, partial) — pushState-based back/forward navigation. State preservation (lifting component state to App) deferred.**

### [BL-84] Nested Subfolders in File Browser

**IMPLEMENTED (v4.25.0, 2026-02-25) — Recursive tree from flat folder strings. Parent folders show aggregated file counts. Independent collapse state per node.**

### [BL-67] Consistent Insight ID Convention in /analyze

**IMPLEMENTED (v4.25.0, 2026-02-25) — /analyze uses next-id.sh to detect existing ID prefix and continue the series.**

### [BL-57] Moved Source Detection

**IMPLEMENTED (v4.25.0, 2026-02-25) — /extract cross-references NEW/DELETED by MD5 hash. Match = moved file, proposed path update.**

### [BL-88] /ship all + /ship update

**IMPLEMENTED (v4.25.0, 2026-02-25) — Dependency layers (L0→L3) for batch generation, incremental updates by diffing [IG-XX] refs.**

### [BL-94] Referential Integrity — Orphan Insight Detection

**IMPLEMENTED (v4.25.0, 2026-02-25) — Updated from v4.24.0 partial: added /audit Check 8 using integrity-check.sh. Claim-level/semantic matching deferred.**

### [BL-97] Re-Processing Safety

**IMPLEMENTED (v4.25.0, 2026-02-25) — Updated from v4.24.0 partial: added source deletion impact warnings in /extract + Source Management docs in CLAUDE.md.**

### [BL-59] Convergence Indicator Redesign

**IMPLEMENTED (v4.25.0, 2026-02-25) — ProgressBar removed from InsightCard. Convergence numbers kept in card metadata.**

### [BL-15] Visual & Interaction Polish — Legacy Templates

**IMPLEMENTED (v4.25.0, 2026-02-25) — All HTML templates and JSON schemas removed from 03_Outputs/. Directories preserved with .gitkeep for future /export.**

</details>

<details>
<summary><strong>BL-58 to BL-98 — v4.20.0–v4.24.0 (Pipeline + QA fixes)</strong> (click to expand)</summary>

### [BL-58] Cross-Navigation — Clickable [IG-XX] / [CF-XX] Badges Everywhere

**IMPLEMENTED (v4.20.0, 2026-02-23)**

### [BL-68] Pass A/C Preprocessing Bugs — Metadata Corruption + Editorial Injection + Participant Metadata

**IMPLEMENTED (v4.21.0, 2026-02-24)**

### [BL-71] Global Search — Extractions, System Map, Sources

**IMPLEMENTED (v4.20.0, 2026-02-23)**

### [BL-74] Binary File Preview — PDF + Office Thumbnails

**IMPLEMENTED (v4.20.0, 2026-02-23) — PDF only; Office thumbnails deferred.**

### [BL-79] Markdown-First Outputs — /ship Generates .md, HTML/DOCX Become Export Formats

**IMPLEMENTED (v4.20.0, 2026-02-23)**

### [BL-91] `/analyze` — Deprecate Express Mode + Add `design-framework` Category

**IMPLEMENTED (v4.22.0, 2026-02-24)**

### [BL-98] Auto-Critique Loop — Plan-Then-Audit as a Built-In Principle

**IMPLEMENTED — v4.24.0, 2026-02-24**

</details>


<details>
<summary><strong>BL-60 to BL-69 — v4.19.0 (Demo Polish)</strong> (click to expand)</summary>

### [BL-60] Insight Ref Chips — Filename Only + Clickable — v4.19.0

**Implemented:** 2026-02-23. Ref chips show filename only (no folder path). Click navigates to Sources view. Tooltip shows full path on hover. `navigateTo` extended to accept generic view IDs.

### [BL-61] Typography Consistency — Mono Font for All Technical Labels — v4.19.0

**Implemented:** 2026-02-23. `font-family: var(--font-mono)` added to `.badge` base class. Redundant `font-family` removed from `.badge-id`, `.badge-conflict-id`, `.badge-insight`, `.badge-conflict`. Folder names in file tree set to mono. `badge-subtle` `text-transform` set to `none` (file refs not uppercased).

### [BL-62] Preview Header — Extraction Status Badge — v4.19.0

**Implemented:** 2026-02-23. Preview header shows extraction status: green dot + "Processed — N claims", yellow dot + pending status, or grey dot + "Not extracted". "Open with System App" removed from header, kept in body for binary files only.

### [BL-63] Decisions Pending Footer — Clickable Navigation to Actions — v4.19.0

**Implemented:** 2026-02-23. Sidebar footer "N decisions pending" now clickable → navigates to Actions view via `onNavigate('actions')`.

### [BL-64] System Map Cards — Status Color Hierarchy — v4.19.0

**Implemented:** 2026-02-23. `StatusBadge` now does case-insensitive lookup (`status?.toUpperCase()` fallback). READY renders green, BLOCKED renders red. Cards collapsible deferred (not needed for demo).

### [BL-69] Search Input Width Fix + Dropdown Alignment — v4.19.0

**Implemented:** 2026-02-23. `.search-container` gets `flex: 1; min-width: 200px; max-width: 360px`. Search input fills available header space up to 360px.

</details>

<details>
<summary><strong>BL-33 to BL-55 — v4.13.0 to v4.17.0</strong> (click to expand)</summary>

### [BL-47] Script-First Skill Execution — v4.17.0

**Implemented:** 2026-02-22. "90/10 Rule" section in CLAUDE.md: mechanical operations (counting, hashing, JSON generation) use inline Bash/Python scripts; LLM handles semantic tasks. Table of script-eligible operations with tool and pattern. Validation rules (counts > 0, JSON parses, no data loss). /analyze steps 25-26 and /extract step 13 marked ⚙️ SCRIPT-ELIGIBLE. Prevents BUG-04 class errors (agent miscounting).

---

### [BL-52] BUG: Normalization Does Not Break Oversized Lines — v4.17.0

**Implemented:** 2026-02-22. Added step 17b to /extract Phase 1.5: after normalization, files flagged `oversized-lines` get sentence-boundary regex split (`re.sub(r'([.?!])\s+(?=[A-Z])', r'\1\n', text)`). Hard-break fallback at 1500 chars for lines without sentence punctuation. Verify `wc -L` < 2000. Clears `oversized-lines` flag so Phase 2 uses standard Read tool.

---

### [BL-53] BUG: No Batch-Boundary Checkpoints in /extract Phase 2 — v4.17.0

**Implemented:** 2026-02-22. Made SESSION_CHECKPOINT a separate numbered step in both Pass 1 (step 4, after step 3 EXTRACTIONS write) and Pass 2 (step 5, after step 4 per-file write). Pass 2 was missing checkpoints entirely — now writes after every heavy file with phase, processed/remaining counts, and resume instruction.

---

### [BL-55] BUG: Stale Engine Version in Live Research App — v4.17.0

**Implemented:** 2026-02-22. `/api/project` endpoint reads engine version from `docs/CHANGELOG.md` (first `## [X.Y.Z]` header) using `readAndParse()` with mtime cache. Fallback to PROJECT.md's `engine_version` if CHANGELOG unavailable. Fixes permanently stale version in project branches where `merge=ours` protects PROJECT.md.

---

### [BL-33] Live Research App — From Static Dashboard to Interactive Web App — v4.15.0/v4.16.0

**Implemented:** Phase 1 (v4.15.0, 2026-02-19) — MVP live read-only app with Express/React/chokidar/WebSocket. Phase 2 (v4.16.0, 2026-02-22) — dark-first design system, feature parity with status dashboard (SystemMapView, EvidenceGapsView, decision tracking), interactive actions (AddContext + Actions prompt generators), Dropbox-style FileBrowser with split-panel preview. Performance optimization (2026-02-22) — singleton WebSocket, debounced refetch, server-side mtime-validated parse cache. Absorbs BL-42 (Work Layer Viewer). Export functionality split to BL-56.

---

### ~~[BL-42] Work Layer Viewer~~ — Absorbed by BL-33 (v4.15.0)

**Absorbed:** BL-33 Phase 1 covers semantic MD viewer, `/view` skill, and local server lifecycle.

---

### [BL-44] Source Authority Layer — v4.14.0

**Implemented:** 2026-02-21. Separated format (Source Type) from weight (Authority) as orthogonal metadata axes. Three authority tiers: `primary` (default, full weight), `internal` (consultant/team, reduced weight, `[INTERNAL]` tag), `ai-generated` (AI tools, lowest weight, `[AI-SOURCE]` tag). Verification gate: internal/ai insights cannot reach VERIFIED without primary corroboration. Per-file authority via frontmatter overrides folder default. Refactors BL-37.

---

### [BL-46] Smart Speaker Attribution — v4.14.0

**Implemented:** 2026-02-21. Two-component solution: (1) Phase 1.5 content-based segmentation for unsegmented multi-speaker transcripts using Work layer speaker priors (roles, topics, vocabulary patterns), with confidence levels per segment. (2) Post-/analyze speaker clarification loop — detects uncertain attributions, groups by transcript segment, presents targeted questions, propagates corrections in batch.

---

### [BL-51] BUG: Pass C Silently Skipped — v4.14.0

**Implemented:** 2026-02-21. Restructured Phase 1.5 into Phase 1.5a (mechanical Passes A+B, scripting allowed) and Phase 1.5b (semantic Pass C, LLM-only). Hard gate between them forces agent to write `_mechanical.md`, stop, read it back, and apply Pass C as separate LLM reasoning step. Python regex explicitly prohibited for Pass C. Mandatory verification marker.

---

### [BL-54] Formalized QA Pipeline — v4.13.0

**Implemented:** 2026-02-21. `docs/qa/README.md` rewritten with 6-step pipeline (PLAN → SETUP → EXECUTE → OBSERVE → EVALUATE → DOCUMENT). Key principle: executing agent never writes findings. Auto-observation via `script` terminal capture + SESSION_CHECKPOINT polling. PLAN template includes anticipated decision points with prescribed answers. FINDINGS template includes score tables, verdict by BL, and recommendations.

---

</details>

<details>
<summary><strong>BL-18 to BL-50 — v4.3 to v4.13.0</strong> (click to expand)</summary>

### [BL-49] BUG: Oversized Lines Break Read Tool in /extract — v4.13.0

**Implemented:** 2026-02-20. Added step 5b (oversized line detection) in Phase 1: checks `file_size / line_count > 2000` chars/line ratio, flags files as `oversized-lines`. Phase 2 routes flagged files to Bash byte-range reads (`head -c 8000`) instead of Read tool. Files normalized by Phase 1.5 have flag cleared (proper line breaks after preprocessing). Covers edge case where preprocessing is skipped.

---

### [BL-50] BUG: Phase 1.5 Pass C (Sentence Repair) Not Implemented — v4.13.0

**Implemented:** 2026-02-20. Added explicit enforcement instruction in Phase 1.5 Pass C: sentence repair CANNOT be done mechanically (sed, awk, regex). Requires LLM reasoning to detect semantic boundaries, incomplete thoughts, and overlapping speech. After Passes A+B (which CAN use mechanical substitution), a dedicated LLM analysis pass applies Pass C markers.

---

### [BL-45] Mid-Skill Checkpoints — Survive Context Compaction During Long Operations — v4.13.0

**Implemented:** 2026-02-20 (Option A — task-aware preventive checkpoints). Added cost gate after Phase 1 in both /extract and /analyze: if file_count > 10 OR total_size > 50KB OR preprocessing candidates detected, writes preventive checkpoint to SESSION_CHECKPOINT.md with file queue, mode, and resume instructions. Small tasks skip mid-skill checkpoints. Batch-boundary checkpoints in /extract Phase 2 update SESSION_CHECKPOINT after every 10-file batch. /analyze gets additional checkpoint after Phase 2 analysis draft. Zero overhead for light operations.

---

### [BL-43] Smart Source Preprocessing — Transcript Normalization + Speaker Detection — v4.12.0

**Implemented:** 2026-02-20. Phase 1.5 added to /extract: detects noisy transcript sources (metadata `Source Type: transcript` or content heuristic), gathers project context as an in-memory glossary (no persistent file), normalizes via 3 passes (speaker detection, phonetic correction, sentence repair), presents quality report for mandatory user approval, writes normalized output to `02_Work/_temp/`. Phase 2 reads from normalized version via redirect map. v1 scope: transcripts only (OCR, chat-log reserved for v2). Simplified from original proposal: no glossary file, no preprocessor registry, no language-specific rules, no new SOURCE_MAP statuses.

---

### [BL-41] State Management — MEMORY Compaction + Checkpoint Recovery — v4.11.0

**Implemented:** 2026-02-20. SESSION_CHECKPOINT becomes primary recovery mechanism for all sessions (not just freemode). MEMORY.md compacted at 80 lines (historical summary + 3 most recent entries). Session protocol rewritten: read checkpoint first (1 read, ~2K tokens), fall back to MEMORY only if checkpoint stale/absent. Integrity check only on count divergence. Quantitative Snapshot added to checkpoint template. `/reset` now cleans `02_Work/_temp/`.

---

### [BL-40] Session Checkpoint Limit Increase — v4.10.1

**Implemented:** 2026-02-20. Increased `SESSION_CHECKPOINT.md` limit from 50 to 150 lines in CLAUDE.md. The 50-line cap was too restrictive for intensive freemode sessions; 150 lines (~2K tokens, 1.1% of context window) provides 3x more room with negligible performance impact.

---

### [BL-39] Artifact Normalization — v4.10

**Implemented:** 2026-02-18. Normalization protocol in CLAUDE.md Freemode section. Agent detects monolithic imports >30KB in `_assets/`, proposes split (section files + shared CSS/JS + index loader), maintains visual parity, targets 2-5KB per section. Dynamic counters via JS. `_temp/STRUCTURE_INDEX.md` maps sections → files → line ranges for offset/limit reads.

---

### [BL-38] Freemode Protocol — v4.9

**Implemented:** 2026-02-18. CLAUDE.md Freemode Protocol section (work-first routing, session checkpoint, cost awareness). `02_Work/_assets/` with `_INTAKE.md` for external materials. `03_Outputs/_custom/` for non-pipeline deliverables (preserved by /reset). `.gitattributes` merge protection for `_custom/`. Templates in `02_Work/_README.md`.

---

### [BL-31] Extract Express Mode — v4.8

**Implemented:** 2026-02-18. Three modes: express (default, light files only), --heavy (deferred files), --full (all files). Light/heavy classification by extension and size. Deferred files tracked as `pending-heavy` in SOURCE_MAP.md. Mode-aware report format.

---

### [BL-32] Auto Express Mode for /analyze — v4.8

**Implemented:** 2026-02-18. Auto-detect project size: <30 files or <500 claims skips Phase 3 synthesis, creates atomic insights directly. Medium projects (30-50 files) also skip but suggest --full. --full forces full synthesis. Simplified AskUserQuestion in express mode.

---

### [BL-36] Conflict Intermediate States — v4.8

**Implemented:** 2026-02-18. /synthesis writes `PENDING — Flagged (context)` or `PENDING — Research (context)` to CONFLICTS.md. Schema and dashboard support intermediate_status/intermediate_note fields. Dashboard shows amber "Flagged" / blue "Research" badges with pre-selected radio buttons.

---

### [BL-37] AI-Generated Source Validation — v4.8

**Implemented:** 2026-02-18. `source_type: ai-generated` in _CONTEXT_TEMPLATE.md. /extract tags claims `[AI-SOURCE]`. /analyze assigns `voice: ai`, `authority: hypothesis`. AI-only insights cannot reach VERIFIED without non-AI corroboration. Added to convergence weighting table (lowest priority).

---

### [BL-18] Observation → Insight Synthesis Layer (ARCH-03) — v4.3

**Implemented:** 2026-02-16. Consolidates atomic observations into 15-25 strategic insights via thematic clustering, convergence weighting by Voice/Authority, ambiguity detection (6 types), research gap identification. Named concepts from source quotes. TIMining: 161 observations → 18 insights.

---

### [BL-19] README.md Sync — v4.2

**Implemented:** 2026-02-15. Added /extract, /audit skills. Updated pipeline, file counts.

---

### [BL-20] Layer READMEs Sync — v4.2

**Implemented:** 2026-02-15. Added EXTRACTIONS.md, RESEARCH_BRIEF.md references. Updated pipeline description.

---

### [BL-23] BUG: /extract Editorial Decisions — v4.3

**Implemented:** 2026-02-16. Mandatory no-skip rule: every file must be processed or reported as unprocessable with technical reason. "Redundancy" is not valid. Disk-validated Phase 4 report (count sections in EXTRACTIONS.md, not in-memory counters). Also covers BL-25 (false numerical reports).

---

### [BL-24] BUG: /extract PDF Fallbacks — v4.3

**Implemented:** 2026-02-16. Correct approach: `Read(pdf)` without pages parameter (no poppler). Intermediate writes for large PDFs. One PDF at a time to prevent request accumulation. Also covers BL-26 (auto-batching for >40 files).

---

### [BL-25] BUG: /extract False Numerical Reports — v4.3

**Covered by:** BL-23 disk validation logic.

---

### [BL-26] BUG: /extract No Auto-Batching — v4.3

**Covered by:** BL-24 large project strategy + BL-29 Option E.

---

### [BL-27] BUG: SOURCE_MAP Corruption on Interruption — v4.3

**Implemented:** 2026-02-16. Phase 1b integrity check: cross-validates SOURCE_MAP entries against EXTRACTIONS.md sections. Corrupted entries detected and re-queued.

---

### [BL-28] /analyze Incremental Processing — v4.3

**Implemented:** 2026-02-16. Timestamp-based filtering: reads last /analyze timestamp from MEMORY.md, processes only newer extractions. `--full` flag forces re-analysis. Convergence updates on matching claims.

---

### [BL-29] /extract Context Overflow — Mandatory Batching — v4.3.1

**Implemented:** 2026-02-16 (Option E). Two-pass strategy: Pass 1 light files (batch 10), Pass 2 heavy files (batch 1 with per-file writes). No Task agents. Direct processing only. TIMining: 54/54 files (100%), 1,238 claims, 33m 54s.

---

### [BL-30] Pipeline Flow Simplification — Unified /analyze — v4.5

**Implemented:** 2026-02-16. AskUserQuestion interactive menu in /analyze Phase 4 (3 synthesis options + 2 conflict options). Auto-generates STATUS.html. /status skill removed. Pipeline: /extract → /analyze (interactive + dashboard) → optional /synthesis → /ship.

---

### [BL-34] Compact Skill Output — v4.6

**Implemented:** 2026-02-17. Silent execution rule in /extract: no narration between tool calls. Batch-level logs only. Compact final report (totals + unprocessable list only).

---

### [BL-35] /status Performance Fix — v4.4

**Implemented:** 2026-02-16 (partial). Eliminated conflict label inference (~4min saved) and subjective evidence gap evaluation (~1min saved). Compact output. Result: 37% faster (10m → 6.5m on TIMining). I/O overhead remains.

---

</details>

<details>
<summary><strong>BL-01 to BL-17, BL-21 — v3.0 to v4.2</strong> (click to expand)</summary>

### ~~[BL-01] `/ship design-system`~~ — REMOVED

**Reason:** Crosses PD-Spec boundary into PD-Build responsibility.

---

### [BL-02] `/audit` — Strategic Quality Gate — v4.0

**Implemented (diverged):** Data-quality audit (traceability, coverage), not strategic audit.

---

### [BL-03] UX & Strategy Artifact Catalog — v4.0

**Partially implemented:** 5/6 types (persona, journey-map, lean-canvas, user-stories, benchmark-ux). Missing: service-blueprint, success-metrics.

---

### [BL-04] Human Calibration Layer — v4.0

**Partially implemented (~80%):** Confidence tagging done. Add Context in dashboard but not inline on cards.

---

### [BL-05] Source Diversity Gap Detection — v4.0

**Implemented:** 6 source types, diversity matrix, score N/6 in /analyze Phase 2.

---

### [BL-06] Design Implications in SYSTEM_MAP — v4.0

**Implemented:** System map modules have "Design implications" field.

---

### [BL-07] `/extract` — Dedicated Skill — v4.0

**Implemented (~95%):** All file types handled, fallbacks defined. Missing: quick-reference table (cosmetic).

---

### [BL-08] Merge `/status` Into `/analyze` — Absorbed by BL-12

---

### [BL-09] QA Fixes — Skill Hardening — v3.2

**Implemented:** ISO timestamps, ID validation, atomicity guidance, conflict refs.

---

### [BL-10] Insight Temporal Tag — v3.2

**Implemented:** `(current)` vs `(aspirational)` tags.

---

### [BL-11] Convergence Tracking — v4.0

**Implemented:** Voice types (4), Authority levels (5), Convergence ratio X/Y.

---

### [BL-12] Research Dashboard — v4.0

**Partially implemented (~85%):** Template+JSON architecture. 8 modules. Missing: Timeline, Actors, inline Add Context.

---

### [BL-13] Auto Research Brief — v4.0

**Implemented:** 5 sections, writes to RESEARCH_BRIEF.md.

---

### [BL-14] `/extract` Progress Indicator — v4.0

**Partially implemented (~60%):** Per-folder + overall progress. Missing: dashboard integration.

---

### [BL-16] PROJECT.md Separation (ARCH-01) — v4.2

**Implemented:** Project settings moved from CLAUDE.md to PROJECT.md.

---

### [BL-17] SOURCE_MAP.md State Management (ARCH-02) — v4.2

**Implemented:** Per-file extraction state with MD5 hashing. Incremental /extract.

---

### ~~[BL-21] FRAMEWORK.md Sync~~ — RESOLVED

**Resolved:** Content redundant. File cleared, reserved for future PD-OS methodology docs.

---

</details>

---

## Archive Notes

Full context for implemented items preserved in version control. For detailed evidence, see `QA_V2_FINDINGS.md`, `QA_V3_FINDINGS.md`, `QA_V4_FINDINGS.md`, and `QA_V5_FINDINGS.md`. For user-facing highlights, see [`CHANGELOG.md`](CHANGELOG.md).

Last updated: 2026-02-24 (v4.21.0)
