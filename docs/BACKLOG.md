# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

### [BL-15] Visual & Interaction Polish — HTML Template Upgrade

**Status:** Proposed
**Priority:** P2
**Origin:** QA v2 (2026-02-15)

Typography, micro-interactions, data viz, accessibility improvements for all templates.

**Evidence from TIMining entregables (2026-02-17):**
- Dark mode + light/dark toggle with localStorage
- JetBrains Mono font, fichas 2x2 with sidebar layout
- Timeline D→A→R pattern
- Clearbit logos with fallback
- Source: `pds--timining/02_Work/IDEAS.md` → idea "Upgrade de template de presentación"

---

### [BL-22] RAG Layer — Scale Source Ingestion Beyond Context Window

**Status:** Proposed
**Priority:** Low (becomes High at 100+ sources)
**Depends on:** BL-17

**Problem:** PD-Spec reads all sources sequentially. Works for 10-20 sources. At 57+ files, context compaction causes state loss and file skipping. NotebookLM handles 100+ via RAG.

**Solution:** BM25 keyword search (zero deps) or embeddings + vector store. Index claims as extracted, query for relevant context instead of loading all.

**Scaling strategy:**
- BL-29 (batching): Handle 40-100 files ✅ done
- BL-31 (express mode): Handle 100-200 files by deferring heavy files
- BL-22 (RAG layer): Handle 200+ files with embeddings + retrieval

---

### [BL-33] Dashboard Enhancements — UX Fixes from QA v3

**Status:** Proposed
**Priority:** P1
**Origin:** QA v3 testing (2026-02-16), QA3-UX-05

**Issues identified:**
- Source coverage section too basic
- Evidence gaps blend together visually
- Cross-reference links missing between sections
- Open questions hidden or hard to find
- Phase-based progress tracking (pipeline position visible at all times)
- Auto-update dashboard after each skill (/analyze, /synthesis, /ship)

**User story:**
> As a researcher, I expect the dashboard to show clear pipeline progress, actionable evidence gaps, and navigable cross-references.

---

### [BL-43] Smart Source Preprocessing — Contextual Normalization & Speaker Detection

**Status:** Proposed
**Priority:** P1
**Origin:** Session brainstorm (2026-02-20). Evidence: Granola.ai transcripts in Chilean Spanish with garbled words, missing speakers, and crosstalk — unusable for claim extraction without preprocessing. Pattern generalizes to any noisy source type.

**Problem:** Raw sources (especially meeting transcripts) arrive with noise that makes /extract unreliable: missing speaker attribution, phonetic misspellings from STT ("ciefo" → "CFO"), cut sentences, crosstalk. Current /extract treats all sources equally — no quality assessment, no cleanup. Result: garbage in, garbage out.

**Solution (framework + v1 implementation):**

**Framework — Contextual Glossary (shared infrastructure):**
- Built automatically from PROJECT.md (team, roles), SOURCE_MAP (processed files), INSIGHTS_GRAPH (domain terms), EXTRACTIONS (vocabulary from prior sources), and folder context metadata.
- Produces a glossary of ~50-200 terms: roles, acronyms, domain jargon, known speaker names/styles.
- Accumulative: each processed source feeds the glossary for the next. More sources = better preprocessing.

**Framework — Preprocessor Pipeline (integrated in /extract):**
1. Source type detection — "is this a transcript, OCR'd PDF, chat log, etc.?"
2. Quality assessment — "does this need preprocessing?" Clean text → skip, noisy → activate.
3. Type-specific preprocessor (registry pattern, extensible).
4. Context-aware normalization using glossary.
5. Quality report with confidence levels — user approves before /extract continues.
6. Normalized output to `02_Work/_temp/{file}_normalized.md`. Original untouched in `01_Sources/`.

**v1 Implementation — Transcript Preprocessor:**
- **Normalization:** Phonetic fuzzy matching against glossary ("ciefo"→"CFO", "queipiái"→"KPI"), sentence repair for cut-off phrases, Chilean Spanish patterns (aspiration, elision).
- **Speaker detection:** 3-pass approach — (1) segment turns, assign temp labels [S1][S2]; (2) identify via name mentions, role/domain consistency, cross-ref with existing sources; (3) propose to user with confidence: high (named), medium (fuzzy+context), low (context only).
- **Integrity rules:** Never invent content (cut = `[incomplete]`), crosstalk = `[crosstalk, ~Ns]`, preserve original, mandatory user approval for medium/low confidence corrections.

**Future preprocessors (not in v1 scope):**
- v2: Chat log structuring (Slack, WhatsApp)
- v3: OCR/PDF cleanup (scanned documents)
- v4: Whiteboard/image interpretation (requires vision)

**PD-Spec advantage over generic tools:** Fireflies/Otter do speaker detection from audio features at recording time. PD-Spec does it post-hoc with accumulated project knowledge — the glossary cross-references against known stakeholders, interview vocabulary, and insight attribution. Triple confirmation: phonetics + known role + thematic context.

**Acceptance criteria (v1):**
- [ ] Contextual glossary builder (reads PROJECT.md, SOURCE_MAP, INSIGHTS_GRAPH, EXTRACTIONS)
- [ ] Source type detection in /extract (transcript vs other)
- [ ] Quality assessment gate (clean → skip, noisy → preprocess)
- [ ] Transcript preprocessor: phonetic normalization + sentence repair
- [ ] Speaker detection: 3-pass (segment → identify → propose)
- [ ] Confidence tagging (high/medium/low) on all corrections
- [ ] Quality report with mandatory user approval
- [ ] Normalized output in `02_Work/_temp/`, original preserved
- [ ] Integrity rules enforced (no invention, crosstalk marked, original preserved)

**User stories:**
> As a researcher, I can drop a messy Granola transcript into 01_Sources/ and /extract handles cleanup automatically — I just approve the corrections.
> As a project lead, speaker attribution in transcripts means I know WHO said what, preserving PD-Spec's voice hierarchy (direct-quotes > observations > hypotheses).

---

### [BL-41] State Management — MEMORY Compaction + Checkpoint Recovery

**Status:** Proposed
**Priority:** P1
**Origin:** Session brainstorm (2026-02-20). Evidence: TIMining project — MEMORY.md 122 lines (growing unbounded), HISTORY ad-hoc 619 lines, post-compaction recovery costs ~11K tokens across 5-6 reads.

**Problem:** Post-compaction, the agent reads MEMORY.md (full, append-only, unbounded), SESSION_CHECKPOINT (compact but shallow), and does integrity checks across 5 Work layer files. Total cost: ~11K tokens, 5-6 tool calls, fragile recovery. The ad-hoc HISTORY log in TIMining (619 lines) proved most useful because it captured *reasoning*, not just actions — but it's not formalized and costs ~7.5K tokens to read.

**Solution (3 components):**

1. **MEMORY.md compaction** — when >80 lines, the agent summarizes entries older than the current session into a "Historical Summary" section at the top. Recent entries stay detailed. Keeps MEMORY useful without unbounded growth.

2. **SESSION_CHECKPOINT enrichment** — expand the checkpoint format to include:
   - Snapshot cuantitativo (sources/insights/conflicts counts + statuses)
   - Key Decisions section (absorbs the value of the ad-hoc HISTORY pattern — captures *why*, not just *what*)
   - Files modified this session
   - Pending work

3. **Session protocol optimization** — formalize single-read recovery in CLAUDE.md:
   - Post-compaction: read CHECKPOINT first (1 read, ~2K tokens)
   - If checkpoint fresh → resume immediately
   - If checkpoint stale/absent → read compacted MEMORY
   - Integrity check ONLY if discrepancy detected
   - Result: 5-6 reads → 1-2 reads, ~11K → ~2K tokens (5x reduction)

**HISTORY pattern:** Not formalized as a separate file. Its value (decisions + reasoning) is absorbed into the enriched CHECKPOINT. Eliminates the need for a third state file.

**Scalability to `/state` skill:** This proposal defines the data structures and rules. A future `/state` skill would automate them:
- `/state save` = compact MEMORY + write CHECKPOINT
- `/state load` = read CHECKPOINT + integrity check
- `/state` = show state summary in terminal

The structures are the same — the skill just puts a button on top.

**Acceptance criteria:**
- [ ] CLAUDE.md: MEMORY compaction rule (>80 lines → summarize old entries)
- [ ] CLAUDE.md: SESSION_CHECKPOINT expanded format (snapshot + key decisions + files + pending)
- [ ] CLAUDE.md: Session protocol updated with single-read recovery order
- [ ] HISTORY pattern documented as "absorbed into CHECKPOINT" (no separate file)

**User stories:**
> As an agent post-compaction, I can recover full context from a single file read instead of 5-6 scattered reads.
> As a user, I stop seeing "where were we?" questions after compaction — the agent just resumes.

---

### [BL-42] Work Layer Viewer — Live MD Rendering with `/view` Skill

**Status:** Proposed
**Priority:** P2
**Origin:** Session brainstorm (2026-02-20). Evidence: TIMining project — repeated pattern of duplicating MD content to HTML for human consumption (/visualize, /ship status). Each duplication costs tokens and HTML drifts stale when MD changes.

**Problem:** Work layer files (INSIGHTS_GRAPH.md, CONFLICTS.md, SYSTEM_MAP.md, etc.) are the source of truth but not human-friendly. Current workaround: `/visualize` and `/ship` generate HTML copies — costs tokens, creates duplication, output goes stale immediately when MD changes.

**Solution (2 components):**

1. **Semantic viewer** — a single HTML file (`03_Outputs/_viewer/index.html`) with:
   - marked.js for MD→HTML rendering
   - ~100-150 lines of PD-Spec JS that understands conventions:
     - `[IG-XX]` → clickeable blue badge
     - `**Status:** VERIFIED` → green badge
     - `[CF-XX]` → red badge with cross-ref link
     - Markdown tables → sortable tables
   - File selector menu listing all `02_Work/*.md` files
   - CSS consistent with existing template design system (`_base.css`)
   - Always live — reads MD on load, no generation step

2. **`/view` skill** — eliminates friction of running a local server:
   - Starts `python3 -m http.server 8420` in background (if not already running)
   - Opens `http://localhost:8420/03_Outputs/_viewer/index.html` in default browser
   - Accepts argument: `/view insights` → navigates directly to INSIGHTS_GRAPH.md
   - Detects if server already running (no duplicate processes)

**Impact on existing skills:**
- `/visualize` becomes candidate for deprecation (or reduced to "export Mermaid diagrams only")
- `/ship` unaffected — still generates formal stakeholder deliverables with full design
- The viewer is for internal team use, not client-facing

**Technical note:** Requires HTTP server (not file://) for fetch() to load MD files. The `/view` skill handles this automatically.

**Acceptance criteria:**
- [ ] `03_Outputs/_viewer/index.html` — generic MD viewer with PD-Spec semantics
- [ ] `.claude/skills/view/SKILL.md` — `/view [file]` skill definition
- [ ] Viewer renders all Work layer MDs with badges, cross-refs, sortable tables
- [ ] Local server lifecycle managed by skill (start/detect/reuse)

**User stories:**
> As a researcher, I can read Work layer insights with human-friendly formatting without waiting for the agent to generate HTML.
> As a user, I type `/view` and immediately see my project data in the browser — no manual server setup.

---

## ✅ Implemented (Archive)

<details>
<summary><strong>BL-18 to BL-40 — v4.3 to v4.10.1</strong> (click to expand)</summary>

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

Full context for implemented items preserved in version control. For detailed evidence, see `QA_V2_FINDINGS.md` and `QA_V3_FINDINGS.md`. For user-facing highlights, see [`CHANGELOG.md`](CHANGELOG.md).

Last updated: 2026-02-18 (v4.10.0)
