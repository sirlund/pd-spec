# Changelog

## [4.27.0] — 2026-03-01 — SDK Migration

The custom agent loop (200-iteration while-loop with `client.messages.create()`) is replaced by Claude Agent SDK's `query()` async generator. The agent now has native Read, Write, Edit, Bash, Glob, Grep with automatic context compaction. Skills run identically in CLI and webapp.

<details>
<summary>Features (1)</summary>

- **Claude Agent SDK integration (BL-80 Phase 1)** — `agent-runtime.js` (5 custom tools + 3 interaction tools + manual context trimming) deleted. Replaced by SDK `query()` in `claude.js` + `sdk-guards.js` (canUseTool callback + InteractionBridge). Two-layer permission architecture: `disallowedTools` blocks Agent/Skill/etc. at CLI level; `canUseTool` handles Write/Edit path validation, Bash safety, AskUserQuestion interaction bridging, and mode-based denials. SSE bridging transforms SDK messages to existing frontend format — zero changes to rendering. Skill prompts transformed to avoid SDK slash command interception. New `POST /run/respond` endpoint replaces close-reopen SSE pattern for interactions.

</details>

<details>
<summary>Fixes (1)</summary>

- **BL-101 index redirect moved to system prompt** — Read is auto-approved by the SDK CLI and doesn't pass through `canUseTool`. Index redirect via deterministic guard is not viable. Replaced with preamble instruction to check `02_Work/_index/` before reading large files. The SDK provides Read with offset/limit (the old runtime couldn't), so the agent can now obey index instructions. Dead redirect code removed from `sdk-guards.js`.

</details>

<details>
<summary>Patches (0)</summary>

No patches in this release.

</details>

## [4.26.0] — 2026-02-28 — Index System

Skills now read compact indexes (~5 KB) instead of full data files (~200 KB) for dense projects, cutting token consumption by up to 83% per operation.

<details>
<summary>Features (1)</summary>

- **Work Layer Index System (BL-101)** — New `generate-index.sh` script generates lightweight indexes for EXTRACTIONS.md, INSIGHTS_GRAPH.md, and normalized transcripts. Three index types (extractions, insights, normalized) with MD5-based staleness detection, 20 KB threshold, and graceful fallback. Six skills updated: `/extract` generates indexes after completion, `/analyze` consumes + regenerates, `/spec` consumes + regenerates, `/audit`, `/ship`, `/visualize` consume. Indexes live in `02_Work/_index/` — auto-generated, safe to delete, regenerated on next skill run.

</details>

<details>
<summary>Fixes (0)</summary>

No fixes in this release.

</details>

<details>
<summary>Patches (0)</summary>

No patches in this release.

</details>

## [4.25.1] — 2026-02-26 — Slim Core

CLAUDE.md cut from ~8.5K to ~2K tokens per message. Reference content moved to docs/CLAUDE_REFERENCE.md, loaded on demand.

<details>
<summary>Features (0)</summary>

No features in this release.

</details>

<details>
<summary>Fixes (0)</summary>

No fixes in this release.

</details>

<details>
<summary>Patches (3)</summary>

- **Core+Reference split (OBS-W1-16)** — CLAUDE.md slimmed to ~135 lines (core rules only). Moved 11 reference sections (source organization, maturity levels, sources of truth, folder structure, worktrees, engine dev workflow, CHANGELOG format, freemode protocol, documentation guidelines, script detail, pre-commit verification) to `docs/CLAUDE_REFERENCE.md`. Saves ~65% input tokens per message (~275K tokens over a 50-message session).
- **Reference gate** — New Session Protocol step 4: "Before engine dev, release, or custom/ad-hoc work (freemode) → read docs/CLAUDE_REFERENCE.md first." Converts passive footer pointer into active trigger for the 3 highest-risk scenarios.
- **Anti-pattern clarifications** — Engine files defined explicitly (docs/, scripts/, .claude/, root config). New rule: project ideas/bugs go in `02_Work/IDEAS.md`, never edit `docs/BACKLOG.md` from project branches. Checkpoint schema hint added (context, snapshot, goals, decisions, pending work).

</details>

## [4.25.0] — 2026-02-25 — Architecture & Lifecycle

Three architecture decisions, five utility scripts, insight lifecycle with six statuses, and the rename from /resolve to /spec. The biggest structural release since v4.0.

<details>
<summary>Features (11)</summary>

- **Architecture decisions (BL-92+73+95+93)** — Three architecture conversations formalized: hybrid execution model (scripts + agents), Strategic Vision + Design Proposals replacing System Map, insight lifecycle state machine with six statuses
- **/resolve → /spec rename (BL-73)** — Pipeline renamed: /extract → /analyze → /spec → /ship. SYSTEM_MAP.md replaced by STRATEGIC_VISION.md + PROPOSALS.md with new parsers and app views
- **Design Proposals [DP-XX] (BL-95)** — New entity type with domain/module/feature taxonomy. PROPOSALS.md structure, parser, API endpoint, and dedicated app view
- **Utility scripts (BL-92)** — Five bash 3 scripts: next-id.sh, count-statuses.sh, verify-insight.sh, resolve-conflict.sh, reset.sh. Shared execution layer for app + skills. /reset skill deprecated
- **Insight lifecycle (BL-93)** — Six statuses (PENDING → VERIFIED → FROZEN / INVALIDATED / MERGED / SUPERSEDED), freshness indicator (green/yellow/red), Last-updated field, cascade protection in verify-insight.sh
- **ID convention detection (BL-67)** — /analyze now scans existing IDs and continues the series using next-id.sh. No more mixed conventions in a project
- **Moved file detection (BL-57)** — /extract detects renamed/moved sources by MD5 hash cross-reference before re-extracting
- **Source deletion impact (BL-97)** — /extract warns about impacted insights before deleting sources. Source Management docs added to CLAUDE.md
- **Referential integrity in /audit (BL-94)** — Check 8: integrity-check.sh validates insight refs against extractions. Scoring updated to 8 checks
- **/ship all + /ship update (BL-88)** — Batch generation with dependency layers (L0→L3), incremental updates by diffing [IG-XX] refs against current knowledge base
- **Browser navigation + nested folders (BL-90+84)** — pushState-based back/forward, recursive folder tree in file browser with aggregated counts

</details>

<details>
<summary>Fixes (2)</summary>

- **Legacy templates removed (BL-15)** — Deleted all HTML templates and JSON schemas from 03_Outputs/. Directories preserved with .gitkeep for future /export
- **Convergence bar removed (BL-59)** — ProgressBar visualization removed from InsightCard. Convergence numbers kept in card metadata

</details>

<details>
<summary>Patches (0)</summary>

No patches in this release.

</details>

## [4.24.0] — 2026-02-24

### Highlights

**Authority gate in `/resolve`.** Insights backed exclusively by `[INTERNAL]` or `[AI-SOURCE]` evidence can no longer silently reach VERIFIED. The system now blocks promotion and offers options: keep PENDING or add external corroboration. User override preserved — the system warns but obeys human decisions. (OBS-67)

**Re-processing safety for consolidated projects.** Running `/extract --full` on a project with >10 VERIFIED insights now triggers a warning with impact context and recommends surgical `/extract --file` instead. You can still proceed — but not accidentally. (BL-97, partial)

**Freemode self-audit.** Before presenting any freemode proposal, the agent now runs an internal Homer's Car + complexity + gap check and shows findings as a compact prefix. Skip with "skip audit" in your request. (BL-98)

**Orphan detection script.** New `scripts/integrity-check.sh` checks each insight's `Ref:` paths against EXTRACTIONS.md section headers. Reports orphans in table format with exit codes for CI. Section-level only — claim-level and semantic checks are future work. (BL-94, partial)

**App: session headers no longer pollute category filters.** The insights parser now detects `--file` mode session headers (containing dates or "--file mode" text) and skips them as category values. Category chips in the Insights view stay clean. (OBS-70)

### Changes

- **OBS-70** — `insights.js` parser: `isSessionHeader` detection, `prevThematicCategory` fallback
- **OBS-67** — `/resolve` SKILL.md step 8: authority gate sub-step before VERIFIED marking
- **BL-97** — `/extract` SKILL.md step 7: safety gate for `--full` on consolidated projects (>10 VERIFIED)
- **BL-98** — `CLAUDE.md` Freemode Protocol: new "Proposal Self-Audit" subsection
- **BL-94** — `scripts/integrity-check.sh`: section-level orphan detection (bash 3 compatible)
- **QA v8** — `docs/qa/QA_V8_PLAN.md` + `scripts/validate-fixes.sh` (6 mechanical checks)

## [4.23.0] — 2026-02-24

### Highlights

**Cross-category dedup protection in `/analyze`.** A `design-framework` claim is no longer collapsed against a `user-need` insight about the same topic. "Users want the system to only show what's critical" (user-need) and "Quiet UI: absorb visual complexity, exception-based management" (design-framework) are now correctly recognized as separate insights — one is the evidence, the other is the design decision.

**`Grounded in:` field for design-framework insights.** Every `design-framework` insight now requires explicit references to the user-need, business, or technical insights that justify it. A design principle without evidence backing fails the Homer's Car gate.

**Source onboarding guide.** `01_Sources/_README.md` now includes a readiness checklist (metadata, dates, participants), guidance for undated sources, and a field notes practice guide for capturing decisions that transcripts miss.

### Changes

- **`/analyze` SKILL.md** — Dedup rule: same category required for duplicate match. Cross-category example (Quiet UI user-need vs design-framework). `Grounded in:` field mandatory for `design-framework` insights with Homer's Car enforcement.
- **`01_Sources/_README.md`** — Source readiness checklist, undated source handling table, field notes practice with confidence levels and template.
- **`01_Sources/_SOURCE_TEMPLATE.md`** — Date field hint for approximate dates.
- **Backlog** — BL-94 (Referential Integrity), BL-95 (Design Proposals layer) proposed.

## [4.22.0] — 2026-02-24

### Highlights

**`/analyze` fixed — design pillars can now enter the knowledge base.** Added a 5th insight category `design-framework` for design principles, UX patterns, product pillars, and naming conventions. Previously, claims like "Quiet UI absorbs visual complexity" had no category and were silently dropped. (BL-91)

**Express mode deprecated.** Phase 3 (synthesis) now always runs regardless of project size. Express mode was skipping consolidation and causing aggressive over-compression (85 claims → 7 insights). Removed entirely — `--full` flag still controls incremental vs full extraction processing.

**`/synthesis` renamed to `/resolve`.** The old name confused everyone: `/analyze` Phase 3 is called "Synthesis" and produces `IG-SYNTH-XX` tags, while the *skill* resolved conflicts and updated SYSTEM_MAP. Now `/resolve` does what the name says — resolve conflicts, verify insights, update system map.

**`--file` flag for `/analyze`.** New surgical mode: `/analyze --file "Section Name" [section2 ...]` processes only named extraction sections. Useful for re-analyzing after source corrections without waiting for full incremental scan.

### Changes

- **BL-91** — `design-framework` category added to `/analyze` SKILL.md (Phase 2 categorization + Phase 3 synthesis)
- **BL-91** — Express mode removed: Phase 1b reduced to logging, Phase 3 always runs
- **Rename** — `/synthesis` → `/resolve` across 16 files (skill, CLAUDE.md, README, app components, all referencing skills)
- **`--file` flag** — `/analyze --file` mode in SKILL.md: skip timestamp filter, process named sections only
- **Backlog** — BL-92 (Script-First Skill Decomposition), BL-93 (Insight Lifecycle) proposed
- **QA v7** — OBS-56 through OBS-62, BUG-13 documented. OBS-62 chain analysis: `/analyze` → `/ship` bypass

## [4.21.0] — 2026-02-24

### Highlights

**Pre-QA pipeline fixes.** Three fixes that unblock the QA v7 pipeline run on TIMining.

**Badge regex fix.** Insight IDs with lowercase suffixes (e.g., `[IG-SYNTH-16b]`) now render as clickable badges instead of plain text. Fixed across all 7 app files (11 occurrences).

**Preprocessing bug fixes (BL-68).** Pass A now respects a metadata boundary — speaker normalization only applies below the `Transcript:` marker, preserving title/date/attendees. Pass C no longer injects editorial comments ("No es fuente") into normalized files. Participant lists prioritized over calendar invitees for speaker attribution.

**`--file` mode for /extract.** New `/extract --file path1 [path2 ...]` mode: skips discovery and delta, deletes stale `_normalized.md`, forces fresh preprocessing for specific files. Ideal for re-extracting after a bug fix or adding a single new source.

### Changes

- **Badge regex** — `[A-Z0-9-]` → `[A-Za-z0-9-]` in `markdown.js`, `insights.js`, `conflicts.js`, `system-map.js`, `MarkdownView.jsx`, `SearchBar.jsx`, `SystemMapView.jsx`
- **BL-68** — Metadata boundary protection (OBS-25), no-editorial-content rule (OBS-24), participant priority (OBS-30/31) in `/extract` SKILL.md
- **`--file` mode** — New extraction mode in SKILL.md: skip Phase 1/1b, delete stale normalizeds, process specific files only
- **Backlog** — BL-85 (STT glossary), BL-86 (UI styling), BL-87 (insight actions) created. BL-68 priority → P1
- **QA v7 plan** — Fase 1b added with test cases T25-T28

## [4.20.0] — 2026-02-23

### Highlights

**Three app features + architecture shift.** The Live Research App gets cross-navigation, global search, and PDF preview. Plus: `/ship` now generates Markdown instead of HTML+JSON — simpler, human-editable, and auto-rendered by the app.

**Cross-navigation everywhere (BL-58).** `[IG-XX]` and `[CF-XX]` badges are now clickable in the FileBrowser markdown preview and Extractions parsed mode. Click any badge → jump to the Insights or Conflicts view. Works across Sources, Work, and Outputs browsers.

**Global search (BL-71).** The search bar now searches across all Work layer data: insights, conflicts, system map modules, extraction claims (1200+), and source filenames. Results are organized by category with labeled headers. Server-side `/api/search` endpoint handles the heavy lifting.

**PDF preview (BL-74).** PDFs now render inline via iframe in the FileBrowser — no more "can't preview" message.

**Markdown-first outputs (BL-79).** `/ship` generates `.md` files instead of Template+JSON HTML. The app already renders Markdown beautifully — tables, badges, blockquotes all styled. `[IG-XX]` refs are automatically clickable. Templates and schemas demoted to legacy for future `/export` command.

### Changes

- **BL-74** — PDF ext detection + iframe preview in FileBrowser. (`FileBrowser.jsx`)
- **BL-58** — Click delegation on `data-ref` badges in FileBrowser markdown preview. `InlineRefs` component for Extractions claims. `onNavigate` prop passed to all 3 FileBrowser instances. (`FileBrowser.jsx`, `MarkdownView.jsx`, `app.jsx`)
- **BL-71** — `GET /api/search?q=` endpoint: searches insights, conflicts, system map modules, extraction claims, source filenames. Categorized results with 5-per-category limit. SearchBar rewritten with category headers. (`api.js`, `SearchBar.jsx`, `components.css`)
- **BL-79** — `/ship` SKILL.md rewritten for Markdown generation. CLAUDE.md Sources of Truth updated (`.md` outputs). Templates/schemas demoted to legacy. (`SKILL.md`, `CLAUDE.md`, `BACKLOG.md`)

<details>
<summary>Verification</summary>

Playwright automated checks against TIMining dataset: PDF preview renders in iframe (PASS), [IG-XX] badge click in Work browser navigates to Insights (PASS), search "geometry" returns Insights + System Map + Extractions categories (PASS), search "entrevista" returns source filenames (PASS).

</details>

## [4.19.0] — 2026-02-23

### Highlights

**Demo polish — 6 visual fixes in one session.** Badges now render consistently in monospace across the entire app. System Map cards show real status colors (green for Ready, red for Blocked). Source ref chips on insights show filenames only and click through to the Sources browser. The preview header tells you extraction status at a glance ("Processed — 71 claims"). Search input fills available space. The "decisions pending" footer navigates to Actions.

### Changes

- **BL-61 — Mono font consistency.** `font-family: var(--font-mono)` on `.badge` base class. Redundant `font-family` removed from 4 child classes. Folder names in file tree set to mono. `badge-subtle` no longer uppercases file refs. (`app/client/styles/components.css`)
- **BL-69 — Search input width.** `.search-container` gets `flex: 1; min-width: 200px; max-width: 360px`. (`app/client/styles/components.css`)
- **BL-63 — Decisions footer clickable.** Click "N decisions pending" → navigates to Actions view. (`app/client/components/Sidebar.jsx`)
- **BL-64 — StatusBadge case fix.** Case-insensitive lookup with `toUpperCase()` fallback. Ready=green, Blocked=red. (`app/client/components/ui/Badge.jsx`)
- **BL-60 — Ref chips filename-only.** Folder path removed, cursor pointer added, click → Sources view. `navigateTo` extended to accept view IDs. (`app/client/components/InsightCard.jsx`, `app/client/app.jsx`)
- **BL-62 — Preview header status.** Shows extraction status badge (dot + text + claim count) for Sources. "Open with System App" removed from header. (`app/client/components/FileBrowser.jsx`)

<details>
<summary>Verification</summary>

Playwright automated tests: 10/10 PASS against TIMining dataset (54 sources, 24 insights, 11 conflicts, 7 modules). Full 12-view visual walkthrough captured.

</details>

## [4.18.0] — 2026-02-23

### Highlights

**19 fixes from QA v7.** Full bugfix blitz across the Live Research App — 8 bugs and 11 UX observations addressed in one session. Cache staleness, broken markdown rendering, missing file badges, phantom folders, hidden metadata files, clipped search results, and more. Verified against the TIMining dataset (54 sources, 24 insights, 11 conflicts).

**Work layer now browseable.** New "Work" section in the sidebar lets you inspect normalized transcripts, session memory, and captured ideas without leaving the app. Speaker attributions, phonetic corrections, and sentence repairs are visible in-context.

**Sidebar reorganized.** "Deliverables" section renamed to "Browse" with three file browsers: Sources, Work, and Outputs. Root-level files appear flat (no more "(root)" pseudo-folder). Folder icons show open/closed state.

### Changes

- **BUG-06 — parseCache stale after /synthesis.** Switched from per-path `delete()` to `clear()` on any file change. Path normalization added to watcher. (`app/server/watcher.js`, `app/server/index.js`)
- **BUG-02 — Bold markdown in list items.** Added `renderer.strong` and `renderer.em` to the marked.js chain, plus regex post-processing fallback for `<li><p>` edge cases. (`app/server/parsers/markdown.js`)
- **BUG-07 — Touchpoint missing "processed" badge.** NFC Unicode normalization + trim on both SOURCE_MAP and filesystem paths before comparison. (`app/client/components/FileBrowser.jsx`)
- **BUG-08 — Preview panel persists across views.** React `key` prop on FileBrowser forces remount on view switch. (`app/client/app.jsx`)
- **BUG-05 — /analyze offered STATUS.html (legacy).** Removed Phase 5 (auto-generate dashboard) from /analyze skill. (`.claude/skills/analyze/SKILL.md`)
- **OBS-01+02 — Dashboard shows 100% with untracked sources.** Filesystem scan of `01_Sources/` cross-referenced against SOURCE_MAP. Amber warning when untracked files exist. (`app/server/api.js`, `app/client/components/Dashboard.jsx`)
- **OBS-04+08 — "(root)" pseudo-folder.** Root files (`folder: null`) rendered flat before folder groups in Sources, Work, and Outputs. (`app/server/api.js`, `app/client/components/FileBrowser.jsx`)
- **OBS-05+06 — Dotfiles visible, metadata hidden.** Targeted exclusion: dotfiles and TEMPLATE files hidden; `_CONTEXT.md` and `_FIELD_NOTES.md` visible. (`app/server/api.js`)
- **OBS-07 — Outputs only showed .html.** Removed file-type restriction from outputs endpoint. All files visible (templates and schemas still excluded). (`app/server/api.js`)
- **OBS-37 — Search dropdown clips titles.** Input widened to 500px, dropdown to `min(600px, 90vw)`. Flex layout prevents title truncation. (`app/client/styles/components.css`, `app/client/components/SearchBar.jsx`)
- **OBS-38 — Insight/conflict refs not clickable.** Added `.badge-insight` (teal) and `.badge-conflict` (red) CSS with hover effects. Multi-ref brackets `[IG-01, CF-02]` now parse correctly. (`app/client/styles/components.css`, `app/server/parsers/markdown.js`)
- **OBS-35 — Evidence Gaps badge mismatch.** Gap count now includes all types (claim-level + category + source-diversity), not just claim-level. (`app/server/api.js`)
- **OBS-36 — Duplicate heading in Research Brief.** First `<h1>` stripped when it matches view title. (`app/client/components/MarkdownView.jsx`)
- **OBS-14 — Decision counter duplicated.** Removed from System Map header; kept in footer only. (`app/client/app.jsx`)
- **OBS-19 — Misleading convergence bar for single-source insights.** Amber indicator for 1/1 convergence with "single source" warning. (`app/client/components/InsightCard.jsx`)
- **OBS-20 — Long ref paths.** Compact chips (folder + filename), collapsed behind "+N more" when >3 refs. (`app/client/components/InsightCard.jsx`)
- **OBS-21 — Category filter pills truncated.** Full text shown with wrapping, tooltip on hover. (`app/client/components/InsightsView.jsx`)
- **OBS-22 — Folder icons static.** `folder` → `folder-open` icon on expand. (`app/client/components/FileBrowser.jsx`)
- **NEW — Work layer file browser.** `/api/work-files` endpoint + sidebar "Work" view for normalized transcripts, MEMORY.md, IDEAS.md. (`app/server/api.js`, `app/client/app.jsx`)

<details>
<summary>Backlog updates</summary>

- **BL-57 PROPOSED** — Moved Source Detection: hash-based path reconciliation in /extract when files are moved after extraction.

</details>

## [4.17.1] — 2026-02-22

**Live updates actually work now.** A spread-order bug in the WebSocket broadcast meant file changes never reached the client — the chokidar event's `type: 'change'` silently overwrote the required `type: 'file-change'`. One-line fix, caught by QA v6.

- **Fix — WS broadcast spread order (BUG-02).** `broadcast({ type: 'file-change', ...event })` → `broadcast({ ...event, type: 'file-change' })`. (`app/server/index.js:75`)
- **New anti-pattern rule.** "Never put override properties BEFORE spread" added to Engine Development Anti-Patterns table.

## [4.17.0] — 2026-02-22

### Highlights

**Fan noise eliminated.** A single file change used to trigger ~72 parse operations through a cascade of redundant WebSocket connections, parallel refetches, and uncached parsing. Now it triggers 1. Three fixes: singleton WebSocket (1 connection instead of 4-5), debounced refetch (300ms collapse window), and server-side mtime-validated parse cache. Leave the app open during agent work — zero CPU at idle, brief spikes on changes.

**Mechanical pipeline operations now use scripts.** Counting insights, computing hashes, generating dashboard JSON — deterministic tasks are explicitly marked "script-eligible" in skill instructions. The agent uses inline Bash/Python instead of LLM reasoning, eliminating counting errors (QA v4's BUG-04) and saving tokens.

**Three pipeline bugs fixed.** Engine version in the Live Research App was permanently stale in project branches (merge=ours on PROJECT.md). Oversized-line transcripts stayed oversized after preprocessing. Batch checkpoints in /extract Pass 2 were missing entirely.

### Changes

- **Performance — Singleton WebSocket.** Module-level WS with subscriber pattern replaces per-hook connections. Auto-reconnect on disconnect (2s retry). (`app/client/hooks.js`)
- **Performance — Debounced refetch.** 300ms debounce timer collapses rapid file changes into a single API call per endpoint. (`app/client/hooks.js`)
- **Performance — Server-side parse cache.** `readAndParse()` with mtime validation. Multiple endpoints sharing the same Work file (dashboard + evidence-gaps both need INSIGHTS_GRAPH.md) parse it once. Watcher proactively invalidates on file change. (`app/server/api.js`, `app/server/index.js`)
- **BL-55 — Engine version from CHANGELOG.** `/api/project` reads version from `docs/CHANGELOG.md` (first `## [X.Y.Z]` header) instead of PROJECT.md's `engine_version` field. Fallback to PROJECT.md if CHANGELOG unavailable.
- **BL-52 — Line-breaking after normalization.** Step 17b in /extract: sentence-boundary regex split for files flagged `oversized-lines`, with hard-break fallback at 1500 chars.
- **BL-53 — Batch checkpoint separation.** SESSION_CHECKPOINT is now a separate numbered step in both Pass 1 (step 4) and Pass 2 (step 5) batch loops. Pass 2 was missing checkpoints entirely.
- **BL-47 — Script-first execution guidance.** "90/10 Rule" section in CLAUDE.md with table of script-eligible operations. /analyze steps 25-26 and /extract step 13 marked as script-eligible.

<details>
<summary>Technical details</summary>

**Performance cascade (before → after):**
```
Before: 1 file change → 4-5 WS messages → 2-3 refetches each → 4 uncached parses = ~72 ops
After:  1 file change → 1 WS message → 1 debounced refetch → 1 re-parse (cache hits) = ~1 op
```

**Files changed:**
- `app/client/hooks.js` — Singleton WS + debounced refetch
- `app/server/api.js` — `readAndParse()` cache + BL-55 version source
- `app/server/index.js` — Cache invalidation wiring
- `CLAUDE.md` — Script-First Execution section
- `.claude/skills/extract/SKILL.md` — BL-52 step 17b, BL-53 checkpoint steps, BL-47 step 13
- `.claude/skills/analyze/SKILL.md` — BL-47 steps 25-26

**BACKLOG impact:**
- BL-47: IMPLEMENTED (v4.17.0)
- BL-52: IMPLEMENTED (v4.17.0)
- BL-53: IMPLEMENTED (v4.17.0)
- BL-55: IMPLEMENTED (v4.17.0)

</details>

## [4.16.0] — 2026-02-22

### Highlights

**The Live Research App now has its own design system.** Dark-first theme with a light mode toggle, PD-Spec's accent-cyan palette, animated card hover borders, JetBrains Mono for code, Tabler icon sprite for consistent iconography. The previous generic light theme is gone — the app now has a distinct visual identity that works in both dark and light environments.

**Files are now browsable, not just listed.** Sources and Outputs have a Dropbox-style split panel — folder tree on the left, context-aware preview on the right. Click a markdown file to see it rendered inline, click an image to preview it, click a PDF or DOCX to open it with your system app. No more staring at a flat list of filenames.

**Decision tracking turns passive viewing into active research.** Approve or reject pending insights, choose conflict resolution options, add context notes — all accumulated as ephemeral decisions. When ready, the Actions view generates a complete `/synthesis` prompt capturing every decision for your agent session.

**The status dashboard is now the Live Research App.** Everything the static `STATUS.html` had — maturity bar, authority distribution, evidence gaps — is now live and interactive. Plus new features: auto-computed evidence gaps, source diversity grid, structured system map cards with vision/modules/principles/questions, and an Add Context prompt generator for field observations.

### Changes

- **BL-33 Phase 2 — Visual redesign.** Dark-first design system with CSS custom properties. 3-file CSS architecture (tokens/base/components) replacing Tailwind. Tabler SVG sprite (20 icons). Shared UI primitives (Card, Badge, CopyBlock, AccentBox, StatCard, ProgressBar). Theme toggle with localStorage persistence and anti-flash script.
- **BL-33 Phase 2 — System Map view.** Structured cards for vision (accent-box), modules (status badges, refs, implications, blockers), design principles (numbered with refs), open questions (with conflict cross-refs). Replaces raw markdown rendering.
- **BL-33 Phase 2 — Evidence Gaps.** Auto-computed from insight data: claim-level (single-source support), category gaps (underrepresented categories), source diversity (missing source types). Canary-level detection for structural weaknesses.
- **BL-33 Phase 2 — Dashboard enhancements.** Segmented research maturity bar, authority distribution tiers, source diversity grid, insight categories, action item quick links.
- **BL-33 Phase 2 — Decision tracking.** Approve/reject for PENDING insights, radio options for conflicts (flag/research/context with textarea). Ephemeral state lost on refresh (intentional).
- **BL-33 Phase 2 — Add Context + Actions.** Field note prompt generator and `/synthesis` prompt builder from accumulated decisions.
- **BL-33 Phase 2 — File Browser.** Split-panel replacing SourceBrowser + OutputLauncher. Collapsible folder tree, status dots, type-aware preview (MD rendered, images inline, HTML/binary open externally). New API endpoints: `/api/raw/*`, `POST /api/open`, `/api/evidence-gaps`.

<details>
<summary>Technical details</summary>

**Removed:** Tailwind CSS, PostCSS, Autoprefixer, OutputLauncher.jsx, SourceBrowser.jsx, app.css

**New files:**
- `app/client/styles/tokens.css` — Design tokens (dark/light)
- `app/client/styles/base.css` — Layout and typography
- `app/client/styles/components.css` — All reusable component styles
- `app/client/public/icons/sprite.svg` — Tabler SVG sprite (20 icons)
- `app/client/components/ui/` — Icon, Card, Badge, CopyBlock, AccentBox, StatCard, ProgressBar
- `app/client/components/ThemeToggle.jsx` — Dark/light toggle
- `app/client/components/SystemMapView.jsx` — Structured system map cards
- `app/client/components/EvidenceGapsView.jsx` — Auto-computed gaps
- `app/client/components/AddContextView.jsx` — Field note prompt generator
- `app/client/components/ActionsView.jsx` — Decision summary + synthesis prompt
- `app/client/components/FileBrowser.jsx` — Split-panel file browser

**Architecture changes:**
- View registry pattern in app.jsx (declarative, auto-generates sidebar)
- Decision state lifted to App (insightDecisions, conflictDecisions)
- CSS architecture: tokens → base → components (3 files, no preprocessor)
- Server: express.json() for POST body parsing, `/api/raw` for binary files, `/api/open` for system app launch

**BACKLOG impact:**
- BL-33: Phase 2 IMPLEMENTED (v4.16.0)

</details>

## [4.15.0] — 2026-02-21

### Highlights

**Your research is now a live web app.** Run `/view` and PD-Spec opens a local browser application showing your Work layer data — insights, conflicts, sources, extractions — all updating in real time as the agent works. No more regenerating static dashboards or reading raw markdown files.

**Built for stakeholder meetings.** The Live Research App shows pipeline progress, insight cards with status badges and convergence bars, conflict cards with resolution tracking, a source file browser with extraction status, and an output launcher that opens deliverables in new tabs. PD-Spec semantic rendering turns `[IG-XX]` and `[CF-XX]` references into clickable navigation badges.

### Changes

- **BL-33 Phase 1 — Live Research App.** Express server with chokidar file watcher and WebSocket push for live updates. Five markdown parsers (insights, conflicts, source map, system map, extractions). React frontend with Vite: dashboard with pipeline stats, filterable insight/conflict views, source browser, markdown renderer with PD-Spec extensions, output launcher. New `/view` skill starts the server and opens the browser.
- **BL-42 absorbed** into BL-33 (Work Layer Viewer functionality included in the app).

<details>
<summary>Technical details</summary>

**New files:**
- `app/` — Complete Node.js + React application (server, parsers, components, styles)
- `app/server/parsers/` — INSIGHTS_GRAPH, CONFLICTS, SOURCE_MAP, SYSTEM_MAP, EXTRACTIONS markdown → JSON
- `app/client/components/` — Dashboard, InsightCard, ConflictCard, MarkdownView, SourceBrowser, OutputLauncher, SearchBar, Sidebar
- `.claude/skills/view/SKILL.md` — New `/view` skill

**Files changed:**
- `CLAUDE.md` — Skills table (added /view), folder structure (added app/)
- `.gitignore` — Added app/node_modules/ and app/dist/

**Architecture:**
- Backend: Express + chokidar + WebSocket (ws)
- Frontend: React 19 + Vite 6 + Tailwind CSS 4
- App reads Work layer files (read-only), never writes
- Live updates: file watcher → WebSocket push → frontend refetch
- Outputs opened in new tabs (not embedded) to preserve their self-contained CSS/JS

**BACKLOG impact:**
- BL-33: Phase 1 IMPLEMENTED (Phase 2 = BL-33a JSON Work layer, future)
- BL-42: ABSORBED by BL-33

</details>

## [4.14.0] — 2026-02-21

### Highlights

**Sources now carry authority, not just format.** New `Authority` metadata field separates *what a source is* (transcript, document, OCR) from *how much weight it carries* (primary, internal, ai-generated). Consultant brainstorming sessions, internal alignment meetings, and AI summaries now get proper reduced authority without contaminating stakeholder evidence. Action items from internal sources are automatically separated and excluded from analysis.

**Pass C finally works as a separate step.** Phase 1.5 is now two sub-phases: 1.5a (mechanical Passes A+B, scripting allowed) writes an intermediate `_mechanical.md` file, then 1.5b (semantic Pass C) forces the agent to stop, read it back, and apply sentence repair as an LLM reasoning task. Python regex explicitly prohibited for Pass C. Mandatory verification confirms markers exist or logs "no repairs needed."

**Unsegmented transcripts get speaker attribution.** When a multi-speaker transcript has no per-line speaker labels (e.g., Granola collapsing everyone into `Me:`), Phase 1.5 now attempts content-based segmentation using Work layer speaker priors — roles, known topics, vocabulary patterns. After analysis, a clarification loop presents uncertain attributions for quick user correction with batch propagation.

### Changes

- **BL-51 — Pass C enforcement fix.** Restructured Phase 1.5 into Phase 1.5a (mechanical, writes `_mechanical.md`) and Phase 1.5b (semantic, LLM-only). Hard gate between them. Python regex added to prohibited tools list for Pass C. Verification step mandatory.
- **BL-44 — Source authority layer.** New `Authority` field in `_SOURCE_TEMPLATE.md` and `_CONTEXT_TEMPLATE.md` (primary/internal/ai-generated). Extract tags claims `[INTERNAL]` or `[AI-SOURCE]`. Analyze applies verification gate: non-primary insights can't reach VERIFIED without primary corroboration. Internal sources get action items separated. Backwards compatible with `Source Type: ai-generated`.
- **BL-46 — Smart speaker attribution.** Extract Phase 1.5 Pass A extended with content-based segmentation for unsegmented multi-speaker transcripts. Analyze step 19a adds speaker clarification loop with targeted questions and batch propagation.

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/extract/SKILL.md` — Phase 1.5 split into 1.5a+1.5b, authority detection in step 2, authority-based claim tagging in Phase 2, unsegmented multi-speaker segmentation in Pass A, quality report Method column
- `.claude/skills/analyze/SKILL.md` — Authority-based rules (verification gates for INTERNAL and AI-SOURCE), action items skip rule, conflict authority imbalance notes, speaker clarification loop (step 19a)
- `01_Sources/_SOURCE_TEMPLATE.md` — Authority field added
- `01_Sources/_CONTEXT_TEMPLATE.md` — Authority field added, Source Type cleaned (ai-generated removed), Authority documentation in comments

**BACKLOG impact:**
- BL-51: IMPLEMENTED (fixes BL-50 enforcement gap from QA v5)
- BL-44: IMPLEMENTED (refactors BL-37 ai-generated into proper authority axis)
- BL-46: IMPLEMENTED (addresses QA4-OBS-07/08 speaker misattribution)
- BL-54: IMPLEMENTED (QA pipeline formalization)

</details>

## [4.13.0] — 2026-02-21

### Highlights

**Oversized transcript lines no longer crash extraction.** Granola exports with 10K-character lines (no line breaks within speaker turns) now get detected early and read via byte-range chunking instead of the Read tool. Phase 1.5 preprocessing clears the flag when it normalizes the file — so you only hit the fallback when preprocessing is skipped.

**Pass C (sentence repair) now actually runs.** In v4.12.0, the `sed` pipeline handled speaker detection and phonetic corrections but silently skipped sentence repair. The skill now explicitly requires an LLM pass for Pass C — detecting incomplete sentences, crosstalk, unintelligible passages, and run-on speech that regex can't handle.

**Long operations survive context compaction.** Heavy `/extract` and `/analyze` runs now write preventive checkpoints before starting expensive phases. If the context window compacts mid-skill, the agent reads the checkpoint and resumes from where it left off instead of losing all in-memory state. Small tasks (<10 files) skip checkpoints entirely — zero overhead.

**QA artifacts have a home.** All QA plans and findings now live in `docs/qa/` with formalized naming conventions and templates.

### Changes

- **BL-49 — Oversized line detection.** New step 5b in `/extract` Phase 1: checks file_size/line_count ratio > 2000 chars/line. Flagged files use Bash `head -c` / `tail -c` byte-range reads instead of the Read tool. Phase 2 conditional routes oversized files automatically.
- **BL-50 — Pass C enforcement.** Explicit implementation constraint in Phase 1.5: sentence repair requires LLM reasoning, not mechanical substitution. Runs as a dedicated pass after sed-based Passes A+B.
- **BL-45 — Mid-skill preventive checkpoints.** Cost gate after Phase 1 in `/extract` and `/analyze`: writes SESSION_CHECKPOINT with file queue, mode, and resume instructions when task is large. Batch-boundary checkpoints in `/extract` Phase 2 update checkpoint after every 10-file batch. Analysis checkpoint after Phase 2 draft. Small tasks skip entirely.
- **QA folder structure.** `docs/qa/` with README (process + templates), formalized QA_V4_PLAN, QA_V4_FINDINGS, QA_V5_PLAN.

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/extract/SKILL.md` — Step 5b (oversized detection), Phase 2 conditional (byte-range reads), Pass C enforcement instruction, cost gate after Phase 1, batch-boundary checkpoint in Phase 2
- `.claude/skills/analyze/SKILL.md` — Cost gate after Phase 1 (step 7b), analysis checkpoint before Phase 3
- `CLAUDE.md` — Sources of Truth table (docs/qa/ entry), Folder Structure (docs/qa/), Documentation Guidelines (QA findings path update)
- `docs/qa/README.md` — QA process, naming conventions, plan + findings templates
- `docs/qa/QA_V4_PLAN.md` — Formalized from memory (47 tests + 10 regressions)
- `docs/qa/QA_V4_FINDINGS.md` — Copied from QA worktree (29 PASS, 3 PARTIAL, 1 FAIL)
- `docs/qa/QA_V5_PLAN.md` — New plan for v4.13.0 validation (12 tests + 4 regressions)
- `docs/qa/QA_V2_FINDINGS.md` — Moved from docs/
- `docs/qa/QA_V3_FINDINGS.md` — Moved from docs/

**BACKLOG impact:**
- BL-49: IMPLEMENTED
- BL-50: IMPLEMENTED
- BL-45: IMPLEMENTED

</details>

---

## [4.12.0] — 2026-02-20

### Highlights

**Messy transcripts now get cleaned up before extraction.** Drop a Granola, Otter, or Fireflies transcript into `01_Sources/` and `/extract` detects it, identifies speakers, fixes phonetic errors ("ciefo" → "CFO"), repairs broken sentences, and presents all corrections for your approval — before a single claim is extracted. The original file stays untouched in `01_Sources/`.

### Changes

- **BL-43 — Smart Source Preprocessing.** New Phase 1.5 in `/extract` between source discovery and claim extraction. Detects transcript candidates (via `Source Type: transcript` metadata or content heuristics), gathers project context from Work layer files as an in-memory glossary, and normalizes with 3 passes: speaker detection (segment → identify → assign confidence), phonetic correction against project terms, and sentence repair (`[incomplete]`, `[crosstalk]`, `[unintelligible]` markers). Mandatory propose-before-execute with speaker table + corrections table. Normalized files written to `02_Work/_temp/`, read via redirect in Phase 2. v1: transcripts only.
- **Source type metadata** — `_CONTEXT_TEMPLATE.md` and `_SOURCE_TEMPLATE.md` now support `transcript`, `ocr`, and `chat-log` types (ocr/chat-log reserved for future v2 preprocessing).

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/extract/SKILL.md` — Phase 1.5 (steps 13-17), Phase 2 preprocessing redirect, Phase 3 Preprocessed metadata line, Phase 5 preprocessing stats in MEMORY entry
- `01_Sources/_CONTEXT_TEMPLATE.md` — Extended Source Type values + descriptions for transcript/ocr/chat-log
- `01_Sources/_SOURCE_TEMPLATE.md` — Optional Source Type field
- `02_Work/_README.md` — _temp/ description includes preprocessed source files

**Design decisions (simplifications from original BL-43 proposal):**
- No glossary file — agent reads Work layer files into context (no persistence needed)
- No preprocessor registry — instructions inline in Phase 1.5, future types added as subsections
- No language-specific rules — LLM handles fuzzy matching natively
- No new SOURCE_MAP statuses — preprocessing is transparent via redirect map + Preprocessed metadata

**BACKLOG impact:**
- BL-43: IMPLEMENTED

</details>

---

## [4.11.0] — 2026-02-20

### Highlights

**Post-compaction recovery now costs 1 read instead of 6.** The agent reads a single checkpoint file (~2K tokens) to resume where it left off — down from ~11K tokens across 5-6 scattered file reads. MEMORY.md auto-compacts at 80 lines, and the session checkpoint now works for all sessions (pipeline and freemode), not just freemode.

### Changes

- **BL-41 — State Management.** SESSION_CHECKPOINT becomes the primary recovery mechanism. MEMORY.md compacted at 80 lines (historical summary + 3 most recent entries in full). Session protocol rewritten with single-read recovery order. Quantitative Snapshot added to checkpoint format (source/insight/conflict counts for instant integrity checks). `/reset` now cleans `02_Work/_temp/` ephemeral workspace.

<details>
<summary>Technical details</summary>

**Files changed:**
- `CLAUDE.md` — Sources of Truth table (MEMORY + CHECKPOINT rows), Session Protocol (full rewrite: 3 subsections → 5), Freemode Protocol (checkpoint scoping), Documentation Guidelines (MEMORY.md row)
- `02_Work/MEMORY.md` — New template with Historical Summary section and Snapshot entry format
- `02_Work/_README.md` — Enriched SESSION_CHECKPOINT template with Quantitative Snapshot section
- `.claude/skills/reset/SKILL.md` — Synced inline MEMORY template, added step 5 (_temp/ cleanup), renumbered steps

**BACKLOG impact:**
- BL-41: IMPLEMENTED

</details>

---

## [4.10.1] — 2026-02-20

### Highlights

**Session checkpoints can now hold 3x more context.** The limit on `SESSION_CHECKPOINT.md` increased from 50 to 150 lines, so intensive freemode sessions no longer lose critical state during compaction. Token cost: ~1% of context window — negligible.

### Changes

- **BL-40 — Session Checkpoint limit increase.** `CLAUDE.md` Freemode Protocol: `50 lines max` → `150 lines max`.

---

## [4.10.0] — 2026-02-18

### Highlights

**Monolithic imports no longer eat your token budget.** When you drop a 100KB Gemini-generated HTML file into `_assets/`, PD-Spec now detects it and proposes splitting it into 2-5KB section files with shared CSS/JS and an index loader. Edit one slide without reading 23 others. Renumber all slides by changing one JS variable instead of touching every file.

### Changes

- **BL-39 — Artifact Normalization.** New subsection in CLAUDE.md Freemode Protocol. Detection threshold: >30KB with multiple sections. Agent proposes split plan before executing. Dynamic counters via JS (no hardcoded `Slide N / Total`). Visual parity required — normalized output must render identically to the original.
- **Structural index** — `02_Work/_temp/STRUCTURE_INDEX.md` maps sections → files → line ranges, enabling precise offset/limit reads for targeted edits.

<details>
<summary>Technical details</summary>

**Files changed:**
- `CLAUDE.md` — New "Artifact Normalization" subsection in Freemode Protocol (7 rules)
- `02_Work/_README.md` — `STRUCTURE_INDEX.md` template and documentation

**BACKLOG impact:**
- BL-39: IMPLEMENTED

</details>

---

## [4.9.0] — 2026-02-18

### Highlights

**Working outside the pipeline no longer burns your token budget.** The new Freemode Protocol teaches the agent to check `02_Work/` before re-reading raw sources, maintain a compact session checkpoint that survives context compaction, and write to files immediately instead of accumulating output in conversation. Evidence: the TIMining entregables session consumed 65% of a weekly token budget over 3 days — most of it avoidable re-reads and lost state.

**External materials have a home.** Logos, brand guides, AI-generated drafts, and competitor screenshots go in `02_Work/_assets/` with a simple intake log. `/extract` ignores them (they're not knowledge sources), but freemode work can reference them freely.

**Custom deliverables survive resets.** Non-pipeline outputs (custom presentations, iterative HTML, ad-hoc analysis) live in `03_Outputs/_custom/`. This folder is preserved by `/reset --output` and protected by `.gitattributes` during engine merges.

### Changes

- **BL-38 — Freemode Protocol.** New CLAUDE.md section with three subsections: Work-First Routing (reference `[IG-XX]` before re-reading sources, suggest `/ship` when applicable), Session Checkpoint (`02_Work/_temp/SESSION_CHECKPOINT.md`, 50 lines max, re-read post-compaction), Cost Awareness (write immediately, warn >20KB reads, asset intake, custom outputs).
- **`02_Work/_assets/`** — New directory for external materials with `_INTAKE.md` log template.
- **`03_Outputs/_custom/`** — New directory for non-pipeline deliverables, excluded from `/reset --output`.
- **`.gitattributes`** — Added `03_Outputs/_custom/** merge=ours` protection.
- **`/reset` updated** — `_custom/` added to exception list alongside `_README.md` and `.gitkeep`.

<details>
<summary>Technical details</summary>

**Files changed:**
- `CLAUDE.md` — Freemode Protocol section (3 subsections), folder structure (3 new entries), sources of truth table (3 new rows)
- `02_Work/_README.md` — Freemode directories docs, `_INTAKE.md` template, `SESSION_CHECKPOINT.md` template
- `03_Outputs/_README.md` — `_custom/` documentation
- `.gitattributes` — `_custom/**` merge protection
- `.claude/skills/reset/SKILL.md` — `_custom/` in exception list
- `02_Work/_assets/.gitkeep` — New placeholder
- `03_Outputs/_custom/.gitkeep` — New placeholder

**BACKLOG impact:**
- BL-38: IMPLEMENTED

</details>

---

## [4.8.0] — 2026-02-18

### Highlights

**AI-generated content no longer sneaks in as ground truth.** Sources produced by Gemini, ChatGPT, or other AI tools can now be tagged `source_type: ai-generated` in `_CONTEXT.md`. Extraction marks every claim with `[AI-SOURCE]`, analysis forces `voice: ai` + `authority: hypothesis`, and the insight can never reach VERIFIED without corroboration from a real source. No more fabricated benchmarks quietly becoming verified insights.

**Conflicts remember your decisions.** When you flag a conflict for stakeholder discussion or mark it for research during `/synthesis`, the dashboard now shows that decision — amber "Flagged" badge or blue "Research" badge, with the radio button pre-selected. No more returning to a blank dashboard wondering what you decided last session.

**Extraction is fast by default.** `/extract` now runs in express mode: it processes light files (markdown, text, images) immediately and defers heavy files (PDF, DOCX, PPTX) as `pending-heavy`. Run `/extract --heavy` when you're ready for the slow stuff, or `/extract --full` for the old behavior. On a project with 80 light + 20 heavy files, express mode finishes in minutes instead of waiting for every PDF.

**Small projects skip synthesis overhead.** `/analyze` auto-detects project size. Under 30 files or 500 claims? It creates atomic insights directly, skipping the thematic clustering and narrative synthesis that only adds value at scale. Use `/analyze --full` when you want the deep analysis regardless.

### Changes

- **BL-37 — AI source validation.** New `source_type` field in `_CONTEXT_TEMPLATE.md`. `/extract` tags `[AI-SOURCE]` claims. `/analyze` assigns lowest authority. Verification gate requires non-AI corroboration.
- **BL-36 — Conflict intermediate states.** `/synthesis` writes `PENDING — Flagged (context)` or `PENDING — Research (context)`. Dashboard parses and displays badges. Schema extended with `intermediate_status` and `intermediate_note`.
- **BL-31 — Express extraction.** Three modes: express (default), `--heavy`, `--full`. Light/heavy classification by extension + file size. `pending-heavy` status in SOURCE_MAP.md.
- **BL-32 — Auto express analysis.** Size thresholds: <30 files/<500 claims skips synthesis. `--full` overrides. Simplified approval flow in express mode.

<details>
<summary>Technical details</summary>

**Files changed:**
- `01_Sources/_CONTEXT_TEMPLATE.md` — Added `source_type` field with `ai-generated` option and documentation
- `.claude/skills/extract/SKILL.md` — AI-generated detection in Phase 1, AI tagging in Phase 2, express mode (Phase 0b + step 5 filtering), mode-aware report format, `pending-heavy` status
- `.claude/skills/analyze/SKILL.md` — `voice: ai` + authority restriction, convergence weighting, Phase 1b express detection, Phase 3 skip condition, intermediate state parsing for dashboard
- `.claude/skills/synthesis/SKILL.md` — Intermediate state handling (Flagged/Research) in Phase 2
- `03_Outputs/_schemas/status.schema.json` — `intermediate_status` and `intermediate_note` properties
- `03_Outputs/_templates/status.html` — Badge rendering, radio pre-selection, intermediate note display

**BACKLOG impact:**
- BL-37: IMPLEMENTED
- BL-36: IMPLEMENTED
- BL-31: IMPLEMENTED
- BL-32: IMPLEMENTED

</details>

---

## [4.7.0] — 2026-02-17

### Highlights

**Engine development now has rules.** SemVer versioning, commit conventions, a release checklist, and a clear path for ideas discovered in projects to flow back to the engine — all documented in CLAUDE.md. No more ad-hoc version bumps or BACKLOG edits in project branches.

**Merge strategy protects project files.** `.gitattributes` with `merge=ours` ensures that merging engine updates from `main` into a project branch never overwrites `PROJECT.md`, sources, work files, or generated outputs. Engine files flow forward; project files stay put.

**Ideas flow without git merges.** Projects capture bugs and ideas in `02_Work/IDEAS.md` (a new template file). The agent on `main` reads them cross-worktree via filesystem — no branch merging needed. Ideas get formalized as BACKLOG items on main, then implemented and merged back as engine updates.

### Changes

- **Engine Development Workflow section in CLAUDE.md.** Four subsections: Versioning (SemVer rules), Commit Convention (`type: BL-## — description`), Release Checklist (BACKLOG + CHANGELOG + version bump in one docs commit), Idea Flow (project → IDEAS.md → main → BACKLOG).
- **Workspace & Worktrees section expanded.** Engine-files-are-read-only rule, merge instructions with `git config merge.ours.driver true` setup, directory naming convention (`pd-spec/`, `pds--{name}/`).
- **`02_Work/IDEAS.md` template.** Empty template with format guide. Protected by `merge=ours` — main's empty template won't overwrite a project's captured ideas.
- **`.gitattributes` added.** Merge strategy file protecting `PROJECT.md`, `01_Sources/**`, `02_Work/**`, and `03_Outputs/*.html`.
- **`/kickoff` writes full PROJECT.md.** Now includes `engine_version` and the "Current State" section, not just project settings.

<details>
<summary>Technical details</summary>

**Files changed:**
- `CLAUDE.md` — New "Engine Development Workflow" section, expanded "Workspace & Worktrees", updated Sources of Truth table and Folder Structure
- `02_Work/IDEAS.md` — New template file
- `.gitattributes` — New merge strategy file
- `PROJECT.md` — Fixed `engine_version` (was prematurely v4.7.0, reset to v4.6.0, now bumped to v4.7.0 with this release)
- `.claude/skills/kickoff/SKILL.md` — Full PROJECT.md template output

</details>

---

## [4.6.0] — 2026-02-17

### Highlights

**`/extract` now runs silently.** Instead of narrating every file being processed, `/extract` outputs one compact line per batch during Pass 1 and one line per file during Pass 2 (heavy files). The final report shows totals only — no per-folder file listings. Less noise, same completeness guarantees.

### Changes (BL-34)

- **Removed per-file progress logs.** Pass 1 (light files) now logs only after completing each 10-file batch: `✓ Batch X/Y: 10 files, Z claims`. No per-file narration inside batches.
- **Simplified Pass 2 log.** Heavy files log: `✓ [filename] → Z claims (X/N)` — concise format, same information.
- **Compact final report.** End of extraction shows: `✓ Extraction complete: N files · Z claims` + only unprocessable files if any. No per-folder breakdowns.
- **Silent execution rule.** New instruction in Phase 2: no narration between tool calls ("Now reading...", "Now updating..."). Execute silently, log only when a `Log:` directive specifies the message.

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/extract/SKILL.md` — Phase 2 batch log format, Phase 2 progress reporting rule, Phase 4 final report format, new silent execution rule

**BACKLOG impact:**
- BL-34: ✅ IMPLEMENTED

</details>

---

## [4.5.0] — 2026-02-16

### Highlights

**`/analyze` now guides you through decisions interactively.** Instead of a free-text approval prompt, `/analyze` now uses native terminal menus (AskUserQuestion) to collect your decisions: approve insights as PENDING for later review, approve as VERIFIED for immediate use, or review one by one. No more guessing the right text response.

**Dashboard auto-generated.** After writing insights and conflicts, `/analyze` automatically generates `03_Outputs/STATUS.html`. No more running a separate `/status` command — the dashboard is ready when analysis ends.

**`/status` removed.** The skill is no longer needed. Dashboard generation is embedded in `/analyze`. The pipeline is now: `/extract` → `/analyze` (interactive + auto-dashboard) → optional `/synthesis` → `/ship`.

### Changes (BL-30)

- **AskUserQuestion in Phase 4.** Three structured options for synthesis approval: PENDING (review later in dashboard), VERIFIED (express mode, skip review), review one-by-one in terminal. Two options for ambiguity handling: defer to `/synthesis` or resolve now.
- **Auto-generate STATUS.html.** After writing files, `/analyze` builds the dashboard JSON from analysis data already in memory and injects it into the template. No separate command needed.
- **Compact Phase 6 output.** `/analyze` ends with a 2-line summary: `✓ Analysis complete: [stats]` + `✓ Dashboard: 03_Outputs/STATUS.html`. No verbose insight lists — those are in the dashboard.
- **`/status` skill removed.** Directory deleted, references removed from CLAUDE.md, README, and folder structure.

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/analyze/SKILL.md` — AskUserQuestion (Phase 3 step 19b), three write paths (Phase 4), auto-dashboard (Phase 5), compact output (Phase 6)
- `CLAUDE.md` — Removed /status from skills table and folder structure
- `README.md` — Updated pipeline description, I/O table, skills list, folder structure

**BACKLOG impact:**
- BL-30: ✅ IMPLEMENTED

</details>

---

## [4.4.0] — 2026-02-16

### Highlights

**`/status` performance fix (partial).** Thinking overhead eliminated (~4min saved vs 10min baseline). I/O overhead remains (~6min for large projects).

### Changes (BL-35)

- Conflict label inference removed (generic labels, no synthesis overhead)
- Evidence gap check simplified (objective convergence < 2, not subjective "weak")
- Compact output added (summary stats only, not full HTML in chat)

<details>
<summary>Technical details</summary>

**Files changed:**
- `.claude/skills/status/SKILL.md` — Three targeted fixes

**BACKLOG impact:**
- BL-35: ✅ IMPLEMENTED (partial — thinking overhead eliminated, I/O overhead pending)

</details>

---

## [4.3.0] — 2026-02-16

### Highlights

**Pipeline now production-ready.** After testing with 61 real files (TIMining project), we fixed 5 critical bugs blocking extraction and added incremental processing to `/analyze`. The pipeline now runs end-to-end without manual intervention.

**Synthesis layer: 161 observations → 18 strategic insights.** `/analyze` no longer dumps atomic claims on you. It consolidates patterns, names recurring concepts from your sources ("Geometry Gap", "Auto de Homero Simpson"), and detects ambiguities that need resolution. You review 18 insights with confidence levels, not 161 raw observations.

**Incremental `/analyze` — only process what's new.** After initial extraction, adding 3 new files triggers `/analyze` to process only ~30 new claims (30 seconds), not re-analyze all 756 claims (5 minutes). Pipeline state is tracked via timestamps.

**No more silent skips.** `/extract` now processes 100% of discovered files. The agent cannot skip files based on "assumed redundancy" — every file is either processed or reported as unprocessable with a technical reason.

### Extraction (BL-23, BL-24, BL-27)

- **Mandatory processing rule.** Agent cannot make editorial decisions. Every file discovered must be processed or explicitly reported as unprocessable. "Redundancy" is not a valid reason to skip.
- **Correct PDF approach.** Default is `Read(pdf)` without pages parameter (no poppler required). Only image-only PDFs require poppler. Large PDFs (>10MB) are processed with intermediate writes to prevent context overflow.
- **Large project auto-batching.** Projects with >40 files or multiple large PDFs automatically process in batches of 20-30 with intermediate writes.
- **SOURCE_MAP integrity validation.** On every run, `/extract` cross-checks SOURCE_MAP.md entries against EXTRACTIONS.md sections. Corrupted entries from interrupted runs are detected and re-processed.
- **Extraction timestamps.** Each section in EXTRACTIONS.md carries an `Extracted: YYYY-MM-DDTHH:MM` timestamp, enabling `/analyze` incremental mode.

### Analysis (BL-28, BL-18)

- **Incremental processing by default.** `/analyze` reads the last execution timestamp from MEMORY.md and processes only sections extracted after that timestamp. Use `/analyze --full` to force re-analysis of all claims.
- **Convergence updates.** When incremental run finds duplicate claims, it increments convergence count on existing insight (e.g., 2/18 → 3/18) instead of creating duplicates.
- **Synthesis layer (Phase 3).** After extracting atomic observations, `/analyze` consolidates them into strategic insights:
  - Thematic clustering (problems, solutions, constraints, vision)
  - Named concepts from source quotes (not invented by agent)
  - Narrative synthesis (2-3 sentences per insight with evidence trail)
  - Convergence weighting by Voice/Authority (user quotes prioritized over hypotheses)
  - Target: 15-25 strategic insights for large projects, 5-8 for small ones
- **Ambiguity detection (6 types).** Automatically flags: imprecisions ("6-8 productos" when only 6 documented), conflicts between sources, single-source critical claims, definition gaps, unresolved contradictions, perspective conflicts.
- **Research gap identification.** Suggests missing validations with recommended methodologies (stakeholder interview, user workshop, competitive benchmark).
- **User approval gate.** Synthesis report presented before writing — you approve insights, decide how to resolve ambiguities, and choose which research gaps to pursue.

### Testing results (TIMining project, 61 files)

**Before v4.3:**
- Extraction: 23/61 files processed (38%), 27 workshop photos skipped as "redundant"
- Analysis: 756 claims → 161 atomic insights (unmanageable volume)
- Pipeline broken: incremental extraction worked, but /analyze re-processed everything

**After v4.3:**
- Extraction: 61/61 files processed (100%), zero skips
- Analysis: 756 claims → 18 synthesized insights + 3 ambiguities + 5 research gaps
- Pipeline works: add 3 new files → /extract processes 3, /analyze processes only ~30 new claims

<details>
<summary>Technical details</summary>

**Commits:**
- `f250d57` — BL-23: Editorial decisions prevention (no skip rule, disk validation, extraction methodology)
- `745b6e6` — BL-24: Correct PDF processing (Read(pdf) default, intermediate writes for large files)
- `13de3f5` — BL-27: SOURCE_MAP corruption detection (integrity validation on startup)
- `39e1909` — Extraction timestamp support (prerequisite for incremental /analyze)
- `b06ac93` — BL-28: Incremental /analyze (timestamp-based filtering, convergence updates, --full flag)
- `11d8c26` — BL-18: Synthesis layer (consolidation, ambiguity detection, research gaps, user approval)

**Files changed:**
- `.claude/skills/extract/SKILL.md` — No-skip mandate, PDF instructions, SOURCE_MAP validation, extraction timestamps
- `.claude/skills/analyze/SKILL.md` — Incremental mode, Phase 3 SYNTHESIS, ambiguity types, research gap suggestions

**BACKLOG impact:**
- BL-23: ✅ IMPLEMENTED
- BL-24: ✅ IMPLEMENTED
- BL-25: ✅ Covered by BL-23 disk validation
- BL-26: ✅ Covered by BL-24 auto-batching
- BL-27: ✅ IMPLEMENTED
- BL-28: ✅ IMPLEMENTED
- BL-18: ✅ IMPLEMENTED

</details>

---

## [4.1.0] — 2026-02-15

### Highlights

**Stress-tested with real data.** 57 files across 6 folders (interviews, workshops, PDFs, PPTX, HEIC photos, videos) exposed 12 bugs in extraction and analysis. All fixed. The agent now processes every file or tells you exactly why it couldn't.

### Extraction reliability

- **Every file, no exceptions.** The agent can no longer silently skip files. Every source discovered is either processed or explicitly reported as unprocessable with a reason. A completeness check at the end compares the output against the original file list.
- **Better PDF handling.** Large PDFs are read in 20-page chunks. Image-only PDFs (scans without text) are detected and flagged with guidance instead of silently failing.
- **iPhone photos supported.** HEIC images are converted automatically via macOS native tools. Video and audio files are reported as unsupported with a suggestion to provide transcripts.
- **Source paths preserved.** When Office files are converted to temporary formats for reading, the extraction always references the original file in `01_Sources/`, not the temp file.
- **Per-folder progress reports.** The extraction summary now breaks down every folder individually — files processed, files skipped, claims extracted, and a completeness check against the discovery list.

### Analysis quality

- **Who said it matters.** Every insight now carries a `Voice` (user, stakeholder, document, researcher) and `Authority` level (direct quote, observation, hypothesis, vision, fact). A user's pain point no longer looks the same as a CEO's aspiration.
- **Smarter deduplication.** Before creating new insights, the agent checks for semantic duplicates against all existing insights. Duplicates boost the convergence count on the existing insight instead of creating a new ID.
- **Format consistency.** When old and new insights coexist in different formats, the agent detects and reports the mismatch. New insights always follow the current spec.
- **Stable ID convention.** Insight IDs use two-digit minimum: `IG-01` through `IG-99`, then `IG-100`+. No three-digit zero-padding (`IG-001`) that breaks cross-reference anchors.

### Pipeline flow

- **`/analyze` → `/status` → `/synthesis`.** After analysis, the agent now recommends `/status` (the visual dashboard) as the review step, not `/synthesis` directly. You see your insights before you commit to them.
- **Quick observations without the pipeline.** The "Add Context" button in STATUS.html now generates a prompt that injects a PENDING insight directly into the knowledge base AND saves a field note — no need to run the full `/extract` → `/analyze` cycle for a single observation.
- **Ad-hoc changes logged.** Any state change to Work layer files (approving insights in conversation, manual edits, direct injections) is now logged to MEMORY.md, not just formal skill runs.

### Performance

- **Image batching.** Workshop photos (the biggest token cost in extraction) are now processed in batches of 3-4 images per call instead of one at a time. This reduces per-image overhead and lets the agent see cross-image context — e.g., a sequence of whiteboard photos that form a connected flow. Full parallelism (per-folder agents) is planned for BL-17.

### Resilience (context overflow mitigations)

- **Checkpoint after each folder.** Extraction results are written to disk after each subfolder completes, not at the end. If the context window compacts mid-extraction, already-processed folders are safe on disk and the agent can continue from where it left off.
- **Claim counts verified from disk.** The final extraction report counts claims by re-reading the written file, not from in-memory counters. Context compaction can corrupt in-memory state — the file on disk is the source of truth.
- **Dashboard self-check.** After generating STATUS.html, the agent verifies the file contains the Template+JSON data block. If it doesn't (e.g., the agent fell back to monolithic HTML after compaction), it retries from the template.

<details>
<summary>QA reference numbers</summary>

From QA v2 testing on test-timining branch (57 files, 6 folders):
- Extraction: BUG-01, BUG-04, BUG-05, BUG-06, BUG-07
- Analysis: BUG-08, BUG-09, BUG-10, BUG-14
- Pipeline: BUG-11, BUG-13, BUG-15
- Performance: PERF-01
- Mitigated (workarounds): BUG-02, BUG-03, BUG-12
- Architectural proposals pending: ARCH-01, ARCH-02, ARCH-03

</details>

---

## [4.0.0] — 2026-02-15

### Highlights

**Your sources, fully read.** PD-Spec now reads DOCX, PPTX, XLSX, images, and PDFs directly — no manual conversion needed. Drop your files in `01_Sources/` and go.

**See what the agent read before it thinks.** The new `/extract` → `/analyze` pipeline separates reading from interpretation. Raw quotes land in `EXTRACTIONS.md` first — you can review exactly what was captured before insights are generated.

**Consistent, fast outputs.** All deliverables now use a Template+JSON architecture. The agent writes data, not HTML. Outputs render instantly, look consistent across types, and are easy to update.

**Six new deliverables.** Personas, journey maps, lean canvas, user stories, UX benchmarks, and a quality audit — all grounded in your verified insights.

**Smarter analysis.** Source diversity scoring, convergence tracking, auto-generated research briefs, and field notes support for researcher observations.

### New capabilities

#### `/extract` — dedicated source reading
Reads all files in `01_Sources/` and writes raw claims to `02_Work/EXTRACTIONS.md`. Supports markdown, DOCX, PPTX, XLSX, CSV, PDF, and images out of the box (zero dependencies). Optionally install `markitdown` for better table and structure preservation.

Run `/extract` before `/analyze`. The separation means you can verify what was captured, correct any missed context, and re-run analysis without re-reading all sources.

#### `/audit` — quality gate before shipping
Checks your Work layer for readiness: traceability gaps, unresolved conflicts, insight coverage per module, source diversity. Run it before `/ship` to catch issues early.

#### New `/ship` types

| Command | Output | What it does |
|---|---|---|
| `/ship persona` | `PERSONAS.html` | 3-5 user archetypes, each grounded in 3+ verified insights |
| `/ship journey-map` | `JOURNEY_MAP.html` | Phases × layers matrix with emotions and pain points |
| `/ship lean-canvas` | `LEAN_CANVAS.html` | One-page business model, gaps marked explicitly |
| `/ship user-stories` | `USER_STORIES.html` | JTBD format with acceptance criteria — ready for handoff |
| `/ship benchmark-ux` | `BENCHMARK_UX.html` | Design inspiration from other industries, not competitor analysis |

All outputs are self-contained HTML files with traceable `[IG-XX]` references linked to `STATUS.html`.

#### Analysis intelligence

- **Research Brief** — `/analyze` auto-generates `02_Work/RESEARCH_BRIEF.md`: a stakeholder-ready narrative organized by "what's broken", "what works", "key tensions", and evidence gaps.
- **Source diversity** — Detects when your sources are skewed (all interviews, no quantitative data; all from the same period; only internal perspectives) and suggests what's missing.
- **Convergence tracking** — Each insight shows how many sources support it. An insight backed by 5/12 sources carries more weight than one from a single interview.
- **Field notes** — New `_FIELD_NOTES_TEMPLATE.md` for capturing researcher observations (body language, tone, environment) that don't appear in transcripts.

### Improved

#### Template+JSON architecture
All outputs (`/ship`, `/status`) now follow a template + data pattern. Static HTML templates handle rendering; the agent writes JSON data only. Benefits:
- Faster generation (JSON is ~100 lines vs ~500+ lines of hand-crafted HTML)
- Consistent styling across all output types
- Templates are versioned with the engine — visual improvements apply to all outputs automatically

#### Enhanced `/status` dashboard
The Research Dashboard now includes module viewer with design implications, evidence gap tracking with suggested actions, and source health overview — alongside the existing insight approval and conflict surfacing tools.

### Breaking changes

- **`/analyze` requires `/extract` first.** If `EXTRACTIONS.md` is empty, `/analyze` will ask you to run `/extract`.
- **`/ship benchmark` is deprecated.** Use `/ship benchmark-ux` instead. The old type generated competitive analysis prone to hallucination; the new type finds design referents from other industries with web-verified sources.
- **Existing HTML outputs** from v3.x don't use Template+JSON. They'll continue to work but will be regenerated in the new format on next `/ship` run.

### Pipeline reference

```
/extract  →  /analyze  →  /synthesis  →  /ship [type]
   ↓            ↓             ↓              ↓
EXTRACTIONS  INSIGHTS     SYSTEM_MAP     HTML outputs
   .md       GRAPH.md       .md          (10 types)
             CONFLICTS.md
             RESEARCH_BRIEF.md
```

<details>
<summary>Technical details</summary>

#### Architecture (3 agents)
- **A1 `/extract`**: New skill + `02_Work/EXTRACTIONS.md` template. `/analyze` now reads from EXTRACTIONS.md instead of `01_Sources/`.
- **A2 Template+JSON**: `03_Outputs/_templates/` (10 HTML templates, `_base.css`, `_base.js`) + `03_Outputs/_schemas/` (9 JSON schemas). Section types: `text`, `callout`, `table`, `module-list`, `open-questions`, `gap`. Self-contained outputs with inlined CSS/JS.
- **A3 Research Dashboard**: Enhanced `/status` template (1200+ lines). Summary cards, insight/conflict interactive cards, system map viewer, evidence gaps, source health, prompt generator.

#### Intelligence (5 agents)
- **I1** Auto Research Brief — Phase 3b in `/analyze`, writes `02_Work/RESEARCH_BRIEF.md`
- **I2** Source diversity — Phase 4b in `/analyze`, type/temporal/perspective bias detection
- **I3** Field notes — `_FIELD_NOTES_TEMPLATE.md`, `/extract` handles confidence tags
- **I4** Convergence ratio per insight — "X/Y sources" in `/analyze` summary
- **I5** Progress indicator — batch reporting by subfolder in `/extract`

#### New outputs (6 agents)
- **O1** benchmark-ux — `categories` array, anti-hallucination via web search
- **O2** persona — `personas` array, 3-5 archetypes, `{text, ref}` pairs
- **O3** journey-map — `phases` array with `layers` object, persona link
- **O4** lean-canvas — `canvas` object, 9 blocks, `gap: true` marker
- **O5** user-stories — JTBD `{situation, motivation, outcome}`, traceability matrix, priority logic
- **O6** `/audit` — quality gate with pass/warn/fail checks

#### Files changed

| File | Changes |
|---|---|
| `CLAUDE.md` | Skills table (10 skills), Sources of Truth, Folder Structure |
| `.claude/skills/ship/SKILL.md` | Template+JSON architecture, 10 output types |
| `.claude/skills/analyze/SKILL.md` | Reads EXTRACTIONS.md, auto-brief, diversity, convergence |
| `.claude/skills/extract/SKILL.md` | NEW — source reading + claim extraction |
| `.claude/skills/audit/SKILL.md` | NEW — quality gate |
| `03_Outputs/_templates/` | 10 HTML templates |
| `03_Outputs/_schemas/` | 9 JSON schemas |
| `02_Work/EXTRACTIONS.md` | NEW — raw claims template |
| `02_Work/RESEARCH_BRIEF.md` | NEW — executive narrative template |
| `01_Sources/_FIELD_NOTES_TEMPLATE.md` | NEW — researcher observations template |

</details>

---

> **Previous versions (v2.0–v3.2):** See [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md)
