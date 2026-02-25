# QA v7 Findings — Pipeline Upgrade v4.7 → v4.21.0

> Started: 2026-02-22
> Updated: 2026-02-24 (Fase 1b–4 complete)
> Version under test: v4.17.1 (Fase 0–1), v4.21.0 (Fase 1b–3)
> Scope: Real-project pipeline upgrade (TIMining), branch consolidation, Live Research App accuracy
> Plan: `docs/qa/QA_V7_PLAN_pipeline_upgrade.md`
> Context: Fase 0–1 observations during TIMining pipeline upgrade (v4.7 → v4.17.1). Fase 1b–3 dual-terminal QA with automated file watcher (observer on main, executor on TIMining with Sonnet 4.6).

## Pre-Test State

- TIMining project: 54 sources extracted at v4.3 engine, 21 insights, 5 conflicts
- 3 new sesiones-idemax transcripts added to `01_Sources/`
- Engine merged to v4.17.1 (preprocessing, authority, Live Research App)

## Test Results — Fase 0: Branch Consolidation

| ID | Test | Status | Notes |
|---|---|---|---|
| T01 | Merge with `merge=ours` preserves Work layer | PASS | Reverse merge direction required (see OBS-03). EXTRACTIONS.md: 1650 lines, INSIGHTS_GRAPH.md: 509 lines |
| T02 | Main v4.17.1 merge | PASS | Engine files updated, `.gitignore` conflict resolved manually (kept both additions) |
| T03 | Transcript renames detected by git | PASS | `git log` shows `rename {02_Work/_temp => 01_Sources/sesiones-idemax}/` |
| T04 | Touchpoint copied from QA | PASS | 134KB, matches source |
| T05 | `_CONTEXT.md` created | PASS | authority=internal, source_type=transcript, 3 files documented |

## Test Results — Fase 1: Visual Diagnostic

| ID | Test | Status | Notes |
|---|---|---|---|
| T06 | Dashboard extraction progress | FAIL | Shows 54/54 (100%) — see OBS-01. Fix attempted prematurely, introduced BUG-01 |
| T07 | File Browser shows sesiones-idemax | PARTIAL | Folder exists in API (9 folders, 62 files correct). UI issues: see OBS-04, OBS-05 |
| T08 | Evidence Gaps | PASS | 8 gaps shown (4 claim-level, 1 category, 3 source-diversity). See OBS-35 for badge discrepancy |
| T09 | Source Diversity | PASS | 6 categories shown, missing types flagged correctly |

## Test Results — Fase 2: Extraction

| ID | Test | Status | Notes |
|---|---|---|---|
| T10 | sesiones-idemax extractions | PASS | 2 files processed: session-align (25 claims), reunion_camila (39 claims). [INTERNAL] tag applied correctly |
| T11 | Touchpoint extraction | PASS | 45 claims, primary authority, no INTERNAL tag. Correct authority differentiation |
| T12 | SOURCE_MAP updated | PASS | 3 new entries with correct hashes, timestamps, claim counts |
| T13 | Preprocessing pipeline | PASS | Pass A+B+C applied to all 3 transcripts. See OBS-24, OBS-25 for preprocessing issues |

## Test Results — Fase 3: Analysis + Synthesis

| ID | Test | Status | Notes |
|---|---|---|---|
| T14 | Incremental /analyze | PASS | 11 new PENDING insights created, 4 new conflicts. Correct convergence updates |
| T15 | /synthesis | PASS | All 11 PENDING → VERIFIED (per user decisions). SYSTEM_MAP +36 lines. 31 VERIFIED total |
| T16 | Research Brief updated | PASS | New sections for Touchpoint + sesiones-idemax insights. Correct ref linking |

## Test Results — Fase 4: Playwright Comprehensive Review

| ID | Test | Status | Notes |
|---|---|---|---|
| T17 | Dashboard accuracy | FAIL | BUG-06: stale cache. Shows 20 VERIFIED / 11 PENDING (should be 31/0). Invalidated shows 2 not 3 |
| T18 | Insights view | PARTIAL | Cards render correctly. Filters work. BUG-06 affects status badges (11 show PENDING) |
| T19 | Conflicts view | PASS | 15 total, 7 resolved, 8 pending. Source claims expand/collapse works. Radio options work |
| T20 | Extractions view | PASS | 1347 claims rendered, metadata correct, source grouping works |
| T21 | Evidence Gaps view | PASS | 3 gap categories. See OBS-35 for badge discrepancy |
| T22 | System Map view | PASS | 8 modules, 10 principles, 12 open questions. Status badges, ref links all correct |
| T23 | Research Brief view | PASS | Narrative renders correctly with inline IG/CF links. See OBS-36 for duplicate heading |
| T24 | Sources file browser | PARTIAL | Folder structure correct. Preview works (markdown rendered). BUG-07: Touchpoint missing "processed" badge |
| T25 | Outputs file browser | PARTIAL | 13 outputs listed. BUG-08: preview panel persists from Sources view |
| T26 | Add Context view | PASS | Form renders, validation works (button disabled until fields filled) |
| T27 | Actions view | PASS | Decision counter, prompt generation work. Correct conflict decision captured |
| T28 | Search | PASS | Typeahead dropdown shows matching insights with status badges. Click navigates to Insights view |
| T29 | Dark mode | PASS | Clean theme toggle. Proper contrast, teal accents, all views readable |
| T30 | Show more button | PASS | Expands evidence trail, toggles to "Show less". ~~BUG-04~~ cannot reproduce — works now |
| T31 | Cross-view navigation | PASS | Category pills → filtered view. Search result → insight. IG badge click → Insights view |

## Observations

### OBS-01: Dashboard shows 100% extraction when new sources exist

**Severity:** Medium
**Where:** Dashboard → Extraction Progress
**Evidence:** After adding 3 new transcript files to `01_Sources/sesiones-idemax/`, the dashboard displayed `54/54 (100%)` — no indication that untracked files exist.
**Root cause:** `/api/dashboard` computes extraction progress exclusively from `SOURCE_MAP.md`. Files present on the filesystem but not yet registered in SOURCE_MAP are invisible to the dashboard.
**Impact:** User gets false sense of completeness. New sources can sit unprocessed without any visual cue.
**Fix direction:** Cross-reference filesystem scan (`01_Sources/`) against SOURCE_MAP entries. Show real total as denominator. Display untracked count warning.
**Note:** Fix was implemented prematurely during this session (committed `e4533e8` + `60fa406` on main), then reverted. See OBS-03.

<details>
<summary>Implementation reference (reverted — reuse when creating BL)</summary>

**api.js** — `scanSourceFiles()` helper + untracked detection in `/api/dashboard`:
```js
// Helper: scan 01_Sources/ for all files (excluding _ prefixed)
async function scanSourceFiles() {
  const sourceDir = resolve(projectRoot, '01_Sources');
  const paths = [];
  async function walk(dir, prefix = '') {
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      if (entry.name.startsWith('_')) continue;
      const fullPath = join(dir, entry.name);
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await walk(fullPath, relativePath);
      } else {
        paths.push(relativePath);
      }
    }
  }
  await walk(sourceDir);
  return paths;
}

// In /api/dashboard handler:
const fsFiles = await scanSourceFiles(); // add to Promise.all
const trackedPaths = new Set((sourceMap.sources || []).map(s => s.path));
const untracked = fsFiles.filter(f => !trackedPaths.has(f));
const pipeline = {
  sources: fsFiles.length,        // filesystem total as real denominator
  extracted: sourceMap.summary.processed || 0,
  untracked: untracked.length,
  // ...rest unchanged
};
```

**Dashboard.jsx** — untracked warning below extraction progress bar:
```jsx
{pipeline.untracked > 0 && (
  <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--warning-fg, var(--accent-yellow))' }}>
    {pipeline.untracked} new source{pipeline.untracked !== 1 ? 's' : ''} pending extraction — run <code>/extract</code>
  </div>
)}
```

**Known bug (OBS-02):** Path matching produced 29 untracked instead of ~3. Root cause: path format mismatch between `scanSourceFiles()` output and SOURCE_MAP `s.path` values (encoding, nesting, special characters). Needs path normalization before `Set` comparison.
</details>

### OBS-02: Untracked detection shows 29 files, expected ~3

**Severity:** Medium
**Where:** `/api/dashboard` → `untracked` field after OBS-01 fix
**Evidence:** After deploying the OBS-01 fix, API returns `sources=62, extracted=54, untracked=29`. Expected ~57 sources (54 + 3 new) with ~3 untracked.
**Hypothesis:** Path mismatch between filesystem scan and SOURCE_MAP entries. Possible causes:
- Encoding differences (spaces, parentheses, special characters in filenames)
- Folder nesting differences (filesystem returns `folder/file`, SOURCE_MAP may store differently)
- SOURCE_MAP may include files that no longer exist on filesystem (stale entries)
**Status:** Not investigated yet. Needs path-level comparison to diagnose.

### OBS-04: File Browser groups root files in "(root)" pseudo-folder

**Severity:** Low (UX)
**Where:** File Browser → 01_Sources view
**Evidence:** Files directly in `01_Sources/` root (e.g., `Referencia de 1. Benchmark.pptx`) are shown inside a collapsible "(root)" group, visually nested below `01_SOURCES` header. Real subfolders like `Antecedentes` appear at the same nesting level as "(root)".
**Expected:** Root files should appear at the same hierarchy level as subfolders — flat list mixing files and folders, not a separate group.
**Root cause:** `api.js` `/api/source-files` assigns `folder: '(root)'` for root files. `FileBrowser.jsx` groups by folder field, creating the pseudo-folder.

### OBS-05: `.gitkeep` and dotfiles shown in File Browser

**Severity:** Low (UX)
**Where:** File Browser → 01_Sources → (root)
**Evidence:** `.gitkeep` appears as a file with format "unknown". These are git placeholder files, not real sources.
**Root cause:** `scanDir` in `api.js` filters `entry.name.startsWith('_')` but not `entry.name.startsWith('.')`. Dotfiles slip through.
**Fix direction:** Add `.startsWith('.')` to the filter condition.

### OBS-07: Outputs File Browser only shows .html files — hides everything else

**Severity:** High (UX)
**Where:** Outputs section (File Browser bottom panel)
**Evidence:** Comparing IDE explorer vs app:
- `_custom/presentacion/` has ~20+ files (img/, .js, .css, .py, .pptx, .pdf, .key, 8 viz PNGs) → app shows **1 file** (index.html only)
- `_custom/` root has 7 files (.html, .md, .png, .gitkeep) → app shows **4 files** (only .html)
- Total: app says "Outputs (13)" vs real filesystem has 30+ files
**Root cause:** `api.js:236` — `entry.name.endsWith('.html')` filter in `/api/outputs` endpoint. Only HTML files pass. All supporting assets (images, CSS, JS, PDF, PPTX, .md drafts) are invisible.
**Impact:** User can't browse output assets (presentation images, exported files, markdown drafts) from the app. The `_custom/presentacion/` folder appears nearly empty when it's actually a rich deliverable with 20+ files.
**Fix direction:** Include all files in outputs scan (like source-files endpoint does), or at minimum include common asset types (.png, .jpg, .css, .js, .pdf, .md, .pptx). Keep `_templates/` and `_schemas/` hidden (engine files).

### OBS-09: Evidence Gaps view is confusing and provides low-value information

**Severity:** High (UX/Functionality)
**Where:** Evidence Gaps view
**Evidence:** Shows 3 "source-diversity" gaps: no folder matching "analytic", "documento", "financier". User reaction: "no entiendo esto."
**Problems identified:**
1. **Hardcoded checklist** — `expectedTypes = ['entrevista', 'workshop', 'benchmark', 'analytic', 'documento', 'financier']` is a generic list, not adapted to the project. Many projects won't need "financier" data.
2. **Naive folder-name matching** — `f.includes(expected)` against SOURCE_MAP folder names. "Antecedentes" contains strategic documents but doesn't match "documento".
3. **"financier" is not valid Spanish** — should be "financiero". Mix of Spanish/English labels.
4. **Claim-level gaps not triggering** — the code for insights with convergence 1/N exists (lines 305-315) but produced 0 results. Either the convergence_ratio parser doesn't extract correctly, or all 21 insights have multi-source support (unlikely with 54 sources).
5. **Category gaps not triggering** — code exists (lines 317-332) but produced 0 results. Either all categories have 2+ verified insights, or the `category_group` parser returns empty.
6. **Same SOURCE_MAP staleness** — reads SOURCE_MAP instead of filesystem (same root cause as OBS-01).
**Impact:** The only view designed to surface research gaps is showing noise instead of signal. A researcher gets "add financier-type sources" instead of "insight IG-07 depends on a single interview."
**Comparison with STATUS.html (old static dashboard):**
The `/ship` generated STATUS.html had a much better Evidence Gaps section:
- Source Diversity gaps referenced specific conflicts: "Sin investigación directa con usuarios finales [CF-07]", "Sin datos financieros [CF-08]", "Sin benchmark competitivo [CF-09 resuelto]"
- Claim-level gaps referenced specific insights with context: "IG-SYNTH-13 (Stack fragmentado) — Solo 3 fuentes, todas entrevistas stakeholder (COO). Sin documentación técnica que corrobore."
- Suggestions were project-specific and actionable: "6-8 entrevistas en contexto con usuarios finales en mina + test de usabilidad con prototipos CORE"

The static version worked because `/ship` had full analysis context and could produce intelligent, project-specific gaps. The Live App version is a naive hardcoded check with no access to insight/conflict cross-referencing.

**Decision:** Needs dedicated BL with proper user stories. Either elevate Evidence Gaps to match STATUS.html quality (parse insights for weak convergence, cross-reference conflicts, read `_CONTEXT.md` for source types) or remove the view and point users to `/ship status` instead.

### OBS-10: Extractions view — good content but needs collapse/expand

**Severity:** Medium (UX)
**Where:** Extractions view
**Evidence:** User feedback: "extractions está buenísimo." Content is valuable but all claims are shown fully expanded. With 1,238+ claims across 54 files, scrolling becomes impractical.
**Suggestion:** Show first 3-5 claims per source file collapsed, with "Show N more" expand button. Preserves overview while allowing drill-down.

### OBS-12: Missing "Source Coverage" summary view (regression from static dashboard)

**Severity:** Medium (Feature gap)
**Where:** Sources / Extractions views
**Evidence:** The old static dashboard (STATUS.html) had a "Source Coverage" section showing per-folder summaries:
- Folder name + file count + extraction status + claim count (e.g., "Workshop 1/ — 33 files · Extraído (757 claims)")
- Format badges per folder (`md`, `docx`, `png`, `heic`, `mp4`)
- Issues detection ("7 archivos de video sin procesar — formato no legible por el agente")
- Source Diversity tags (green = present, grey = missing)

The Live App has no equivalent. The Extractions view shows claims but no folder-level overview. The Sources (File Browser) shows files but no extraction status or claim counts.
**Value:** This view maps to project organization logic — researchers think in terms of "what did we get from the workshop?" or "how much coverage do we have from operations interviews?", not individual files.
**Fix direction:** Add a Source Coverage card or view that aggregates SOURCE_MAP + EXTRACTIONS data by folder. Could be:
- A section at the top of the Extractions view (summary → expand to claims)
- Part of the Sources view (File Browser folders get extraction badges)
- A standalone sub-view accessible from Dashboard

### OBS-11: Search only covers insights and conflicts — not extractions or other views

**Severity:** Medium (UX)
**Where:** SearchBar component (sidebar)
**Evidence:** `SearchBar.jsx` lines 27-29 — only fetches `/api/insights` and `/api/conflicts`. Extractions, sources, system map, and evidence gaps are not searchable. Placeholder honestly says "Search insights, conflicts..."
**User question:** Should search be global (across all views) or per-section?
**Options:**
- **Global search** — single bar that searches everything, results grouped by type (insight, conflict, claim, source). Good for "find everything about topic X." More complex to implement.
- **Per-section filter** — each view gets its own filter input that narrows the current list. Good for "find claim about pricing in this extraction." Simpler, more focused.
- **Hybrid** — global search in sidebar for navigation (go to IG-07), plus per-section filter inputs for local narrowing. Best of both but most UI surface.
**Decision needed:** Which approach. Could be part of a broader BL for Live App UX improvements.

### OBS-08: "(root)" grouping repeated in Outputs section

**Severity:** Low (UX)
**Where:** Outputs section → root-level .html files
**Evidence:** Same pattern as OBS-04 — root-level outputs (PRD.html, PERSONAS.html, etc.) grouped in a "(root)" pseudo-folder instead of appearing at top level alongside `_custom/`.
**Same root cause as OBS-04.**

### OBS-06: `_CONTEXT.md` and `_FIELD_NOTES.md` filtered from File Browser

**Severity:** Medium (UX)
**Where:** File Browser → all folders
**Evidence:** The scan function filters `entry.name.startsWith('_')`, which removes `_CONTEXT.md` (6 files across folders) and `_FIELD_NOTES.md` (2 files). These are meaningful project metadata files that a researcher would want to see and navigate to.
**Filtered files (13 total):**
- 6x `_CONTEXT.md` — per-folder authority/context metadata
- 2x `_FIELD_NOTES.md` — field observation notes
- 5x root templates — `_SOURCE_TEMPLATE.md`, `_CONTEXT_TEMPLATE.md`, `_FIELD_NOTES_TEMPLATE.md`, `_README.md`
**Fix direction:** Distinguish between templates (keep hidden) and project metadata (show). Options:
- Only filter `_*TEMPLATE*` and `_README.md`, show everything else
- Show `_CONTEXT.md` and `_FIELD_NOTES.md` explicitly as metadata badges on folders
- Show all `_` files but with a dimmed/secondary style

### OBS-03: Agent violated observe-don't-fix protocol

**Severity:** Process
**Where:** This session
**Evidence:** User said "anota estas cosas en findings." Agent interpreted this as permission to implement and committed a fix (`e4533e8`) instead of documenting. Violates CLAUDE.md anti-pattern: "Never edit files without explicit request — especially during QA, observe don't fix."
**Impact:** Fix deployed without proper planning. OBS-02 (path mismatch bug) was introduced as a result.
**Lesson:** "Anota" means document, not implement. Even outside formal QA, the observe → document → plan → implement flow applies.

## Bugs

### BUG-01: Path matching in untracked detection produces incorrect count

**Severity:** Medium
**Reproduction:**
1. Add 3 files to `01_Sources/sesiones-idemax/`
2. Start `/view`, check `/api/dashboard`
3. Observe `untracked=29` instead of expected `~3`
**Expected:** `untracked=3` (only the 3 new sesiones-idemax files)
**Actual:** `untracked=29` — many existing files are counted as untracked
**Root cause:** TBD — likely path format mismatch between `scanSourceFiles()` output and SOURCE_MAP `path` column. Needs side-by-side path dump to diagnose.

### OBS-13: System Map needs collapse/expand and mini-dashboard

**Severity:** Medium (UX)
**Where:** System Map view
**Evidence:** 7 modules fully expanded + 7 design principles + open questions = heavy vertical scroll. The view has rich structured data (modules with status, blockers, insight refs, design principles, open questions) but presents everything linearly.
**Suggestion:** Add a mini-dashboard header summarizing: N modules (X ready, Y blocked), N design principles, N open questions. Modules should be collapsible — show title + status badge collapsed, expand to see implications/blockers. This is the most architecturally complex view and deserves its own summary layer.

### OBS-15: System Map structure (Modules vs Design Principles) not self-explanatory

**Severity:** Medium (UX)
**Where:** System Map view
**Evidence:** User asked "qué son esos modules vs design principles?" The view shows both sections without explanation of what each represents or why they're separate.
- **Modules** = product architecture components (what gets built)
- **Design Principles** = cross-cutting design constraints (how everything is built)
Both are valid System Map concepts, but the view lacks a brief intro or tooltip explaining the distinction. A new user seeing "Geometry Engine" next to "Paz Mental" won't immediately understand the relationship.
**Suggestion:** Add a one-line description under each section header. Or group them visually with clear labels like "Product Architecture" → modules, "Design Constraints" → principles.

### OBS-18: Mixed insight ID conventions (IG-XX vs IG-SYNTH-XX) in same project

**Severity:** High (Data consistency)
**Where:** Insights view — shows both IG-SYNTH-XX and IG-XX
**Evidence:** 23 insights total mixing two naming conventions:
- `IG-SYNTH-01` through `IG-SYNTH-21` — from original /analyze + /synthesis pipeline run
- `IG-01`, `IG-02` — from a later /analyze run on _FIELD_NOTES.md files
The IG-XX insights have convergence 1/1, voice=researcher, ref=_FIELD_NOTES.md — they're field observations, not synthesized insights.
**Impact:** User sees two types of IDs without understanding why. The System Map references IG-SYNTH-XX; the IG-XX are orphaned (not referenced by any module or principle). The "23" count mixes apples and oranges.
**Root cause:** /analyze used different naming conventions across runs. No enforcement of consistent ID scheme.
**Fix direction:** /analyze should detect existing ID convention and continue the series. Or distinguish between insight types (synthesized vs field-note) explicitly.

### OBS-19: Convergence bar visually misleading for single-source insights

**Severity:** Low (UX)
**Where:** Insights view — convergence progress bars
**Evidence:** IG-01 shows convergence "1/1 sources" with a 100% blue bar. Visually suggests strong evidence, but it's single-source (weakest possible). Compare with IG-SYNTH-21 at "5/54 sources" showing a small bar — which actually has broader support.
**Fix direction:** Convergence bar denominator should reflect total available sources, not matched sources. Or use a different visual for 1/1 (e.g., yellow "single source" indicator instead of full blue bar).

### OBS-20: Insight reference paths are long and hard to read

**Severity:** Low (UX)
**Where:** Insights view — "Ref:" line at bottom of each card
**Evidence:** IG-SYNTH-21 shows 6 file paths in a single line: "Antecedentes/31_12_2025_TIMining The Evolution..., Visión Futuro _CORE_/Design Brief_..." — overflows and wraps unreadably.
**Fix direction:** Show refs as a compact list (folder badge + filename), or collapse behind "6 sources" with expand. Link to File Browser entries.

### OBS-21: Category filter pills truncated

**Severity:** Low (UX)
**Where:** Insights view — category filter bar
**Evidence:** Long category names truncated: "Problema Central y Diferenciad...", "Experiencia de Usuario y Dolor...", "Observaciones Directas (Field ..."
**Fix direction:** Use shorter category labels, or show full text on hover/tooltip, or wrap to multi-line.

### OBS-23: Binary files (PDF, DOCX, PPTX) lack preview in File Browser

**Severity:** Medium (Feature gap)
**Where:** File Browser → file preview panel
**Evidence:** Selecting a PDF, DOCX, or PPTX shows no preview — only filename and "Open in system app" button. Images already render inline.
**Feasibility assessment:**
- **PDF:** High — browser-native `<iframe>` or pdf.js first-page render. No server deps.
- **PPTX/DOCX:** Medium — Office files are ZIP archives. Most contain `docProps/thumbnail.jpeg` embedded. Server-side extraction with Node's `unzipper` or built-in `zlib` — no external deps.
- **Fallback:** File metadata (size, date) + format icon + "Open in system app" (already exists).
**Fix direction:** Lightest approach: PDF via iframe, Office via embedded thumbnail extraction. Add `/api/thumbnail/:path` endpoint that returns the embedded thumbnail or a generated one.

### OBS-22: Folder icons rotate on expand instead of showing open/closed state

**Severity:** Low (UX polish)
**Where:** File Browser → folder rows
**Evidence:** Collapsed folders show a folder icon that rotates (chevron `>` → `v`) when expanded. The folder icon itself stays the same. Standard file explorers (VS Code, Finder) use distinct open-folder vs closed-folder icons to reinforce state.
**Fix direction:** Use `folder` icon when collapsed, `folder-open` icon when expanded (Tabler icons: `icon-folder` / `icon-folder-open`). Keep the chevron for the expand affordance.

### OBS-17: "Module" abstraction level inconsistent and undefined

**Severity:** Medium (Methodology/UX)
**Where:** System Map → Modules section
**Evidence:** User asked "entonces los modules son features?" The 7 modules mix abstraction levels:
- Subsystem-level: "Geometry Engine", "Plataforma de Integración (Efecto Suiza)"
- Capability-level: "Copiloto Inteligente (TIM Agent)", "Experiencia Multimodal (4 Lentes)"
- Feature-level: "Briefing de Turno", "Onboarding Progresivo"
No definition of what "module" means in this context. Users can't tell if these are epics, subsystems, capabilities, or features.
**Impact:** Ambiguity in the System Map's core organizational unit undermines its value as a decision-tracking artifact. A PM reading "modules" expects one thing, a developer another.
**Fix direction:** Either:
- Define "module" clearly in the System Map header (e.g., "Major product capability areas")
- Allow multiple hierarchy levels (subsystem → module → feature) with visual distinction
- This is partly a `/synthesis` skill issue (what granularity to target) and partly a UI issue (how to present it)

### OBS-16: No cross-navigation between insight badges and their detail views

**Severity:** High (UX)
**Where:** System Map → IG-SYNTH badges; Insights view; Extractions view
**Evidence:** User sees `IG-SYNTH-07` badge in System Map but can't click through to see the insight details (sources, convergence, claims). The traceability chain (System Map → Insight → Claims → Source) exists in the data but is not navigable in the UI.
**Current state:** The search bar supports `IG-XX` navigation (lines 15-23 in SearchBar.jsx), but:
1. Badges in System Map are not clickable links
2. Insights view shows insight details but doesn't link to the specific claims in Extractions
3. No "referenced by" reverse links (insight → which modules use it)
**Impact:** The core value proposition of PD-Spec is traceability. The data has it; the UI doesn't surface it. A researcher can't follow the evidence chain without manually searching.
**Fix direction:** Make all `[IG-XX]` and `[CF-XX]` badges clickable throughout the app, navigating to the relevant detail view. Add "Referenced by" section in insight detail showing which System Map modules cite it.

### OBS-14: Decision counter duplicated in header and footer

**Severity:** Low (UX)
**Where:** System Map view — header bar shows "1 DECISIONS" badge, footer shows "1 decision pending"
**Evidence:** Same information displayed in two places with slightly different wording. Header says "1 DECISIONS" (noun), footer says "1 decision pending" (actionable). Unclear what action to take.
**Suggestion:** Pick one location. Footer with actionable text ("1 decision pending" → click to scroll/navigate) is more useful. Remove from header or make the header badge clickable.

### ~~BUG-03~~ RETRACTED: Agent "hallucinated" extraction status — was user error (wrong worktree)

**Severity:** ~~High~~ → **Not a bug**
**Where:** Executing agent in QA terminal
**Original claim:** Agent hallucinated that sesiones-idemax transcripts were "already processed on 2026-02-21" when SOURCE_MAP had zero entries.

**What actually happened:** The observer (this agent) verified SOURCE_MAP in `pds--timining` (the project worktree) and found zero entries — correct. But the executing agent was running in `pd-spec--qa` (the QA worktree), where the 3 files ARE in SOURCE_MAP as `processed` with date `2026-02-21T16:00` and 19+14+20 claims. The agent was reporting accurately for its own context.

**Evidence of correct worktree:**
- Terminal status bar showed `~/Dev/repos/pd-spec--qa`
- The preprocessing script the agent generated had `BASE = "/Users/nlundin/Dev/repos/pd-spec--qa"`
- QA worktree's SOURCE_MAP has all 3 entries with matching hashes

**Root cause:** User launched the dual-terminal QA session in `pd-spec--qa/` instead of `pds--timining/`. The observer assumed the agent was in the project worktree and flagged a "hallucination" that was actually correct behavior.

**Lessons:**
1. Always verify which worktree the executing agent is in before claiming hallucination
2. The "escalation pattern" (agent doubling down with increasingly specific evidence) was the agent being RIGHT — it had real data from its actual SOURCE_MAP
3. Cross-worktree QA setups need explicit worktree identification in the observation protocol

**Previously hypothesized mitigations (no longer needed for this bug, but still valid general practice):**
- QA findings should include explicit worktree/branch context
- SOURCE_MAP.md is the ONLY source of truth for extraction state per worktree

### OBS-24: Pass C injects "No es fuente para /extract" header — may cause self-skip

**Severity:** Medium
**Where:** Executing agent during `/extract` preprocessing (Phase 1.5 Pass C)
**Evidence:** Agent applied Pass C (sentence repair) to `reunion_camila_2026-02-17.md` and wrote `reunion_camila_normalized.md` with line 3:
```
> Notas internas Idemax. No es fuente para /extract.
```
This is a descriptive note the agent added to the normalized file header. Risk: if the agent (or a future session) re-reads this file, it may interpret its own note as an instruction and skip extraction.
**Status:** Pending verification — need to confirm whether EXTRACTIONS.md contains claims from reunion_camila after extraction completes.
**Fix direction:** Pass C should normalize content only (speaker labels, sentence breaks, markers). It should NOT inject editorial commentary or processing directives into the output file. Descriptive metadata belongs in `_CONTEXT.md`, not in the normalized content.

### OBS-25: Pass A speaker normalization corrupts metadata block

**Severity:** Medium
**Where:** Executing agent preprocessing (Phase 1.5 Pass A) on Touchpoint transcript
**Evidence:** `touchpoint_mechanical.md` has every line in the metadata header (title, date, location, attendees) prefixed with `[SPEAKER: Nicolás Lundin (medium)]`. The original file uses `Me:` as the speaker label for both metadata lines and actual transcript turns. The Pass A regex (`^Me:` → `[SPEAKER: ...]`) replaces blindly across the entire file.
```
[SPEAKER: Nicolás Lundin (medium)]:
Thursday, February 19 ⋅ 10:00 – 11:30am
[SPEAKER: Nicolás Lundin (medium)]:
Lugar: TIMining - Tecnología e Innovación en Minería SpA
[SPEAKER: Nicolás Lundin (medium)]:
- Camila Bonilla (Organizer)
```
**Expected:** Metadata block (everything before `Transcript:`) should be preserved as-is. Speaker normalization should only apply after the `Transcript:` marker.
**Impact:** Downstream extraction may misattribute metadata lines as spoken claims by Nicolás Lundin. Also introduces noise for Pass C sentence repair.
**Fix direction:** Pass A script should detect the `Transcript:` boundary and only apply speaker substitution below it. Metadata block should pass through unchanged.

### OBS-26: No UI to review/edit preprocessing decisions (speakers + phonetic corrections)

**Severity:** Medium (Feature gap)
**Where:** Preprocessing pipeline (Phase 1.5) — no review surface exists
**Evidence:** Agent applies speaker attribution and phonetic corrections as fire-and-forget. User sees a summary table in the terminal (speakers with confidence levels, phonetic corrections with context) but cannot approve/reject/edit individual items before they propagate into the normalized file and downstream claims.
**Examples from Touchpoint preprocessing:**
- Speaker table: 4 speakers detected via content-based segmentation, all "medium" confidence. No way to correct misattributions.
- Phonetic corrections: "Tync → TIMining [?]" (medium), "Morib → Motive [?]" (low/uncertain), "Cloudbot → Cloudbot [?]" (uncertain). User should be able to confirm, reject, or fix these before extraction.
**Desired UX:** An interactive table (in Live Research App or terminal) where the user can:
1. Review each speaker attribution — confirm identity, merge speakers, change confidence
2. Review each phonetic correction — approve, reject, or provide correct replacement
3. Save decisions to a per-file or per-folder config that persists across re-extractions
**Impact:** Without review, uncertain corrections (marked `[?]`) propagate silently into claims. Low-confidence speaker attributions affect authority weighting.

**Expanded vision — Project Glossary/Entities:**
A persistent, editable glossary at `02_Work/GLOSSARY.md` (or Live Research App view) that accumulates across extractions:
- **People**: Philip Whatmore = CEO TIMining, Carlo Calderón = CTO TIMining...
- **Products**: Aware, Orchestra, Delta, SIC, Tangram, ARIS...
- **Terms**: Skynet = NorthStar concept, DAR = Detección-Análisis-Recomendación...
- **Phonetic map**: Tync → TIMining, Skymer → Skynet, biometrías → geometrías...

Each `/extract` proposes new entries → user approves/rejects → approved entries auto-apply in future extractions. If user later discovers an error, they edit in the app → triggers re-normalization + re-extraction of affected files → changes propagate through claims → insights. A "reanalyze affected" action that traces the correction through the full pipeline.

### OBS-27: QA dual-terminal needs automated file watcher for observer

**Severity:** Low (Process improvement)
**Where:** QA observation protocol — dual-terminal setup
**Evidence:** During this session, the observer agent had to manually poll work files (`wc -l`, `grep`, `sleep` loops) to detect when the executing agent completed a skill. User had to say "revisa" each time. A background monitor script was prototyped (`/tmp/monitor_analyze.sh`) that polls every 2 min and detects stability, but it's ad-hoc.
**Desired UX:** The QA plan runner (BL-54) should include an automated file watcher mode:
- Observer specifies which files to monitor (e.g., INSIGHTS_GRAPH.md, CONFLICTS.md, SOURCE_MAP.md)
- Watcher polls at configurable interval (default 2 min)
- Reports changes as they happen (line count delta, new entries)
- Detects "stable" state (2 consecutive same readings) → signals skill completion
- Outputs a structured log for inclusion in QA findings
**Impact:** Reduces manual coordination overhead in dual-terminal QA. Lets the user go make coffee while both agents work.

### OBS-28: PD-Spec needs structured execution logging for agent observability

**Severity:** High (Architecture gap)
**Where:** All skills — no structured execution log exists
**Context:** PD-Spec's value proposition includes agents that "function consistently." To guarantee consistency, every execution needs to be observable and comparable. Currently observability depends on a human watching ANSI-riddled terminal output or reading MEMORY.md (narrative, not machine-parseable).
**Problem:** MEMORY.md logs *what happened* in prose. What's missing is a machine-readable log of *how it happened*: what files were read, what was written, how long each phase took, what decisions the agent made, what the user approved/rejected. Without this, pattern detection across executions is impossible.
**Desired solution — Execution Log:**
- Structured format (JSONL or markdown table) at `02_Work/_temp/EXECUTION_LOG.md`
- Each skill run emits entries: timestamp, phase, action (read/write/decide/wait), target file, duration, token count, result
- The Live Research App already has WebSocket infrastructure (chokidar file watcher → WS broadcast). A new "Activity" view could consume this log and show a real-time timeline of agent actions.
- Observer agents (QA or otherwise) connect to the same WS feed instead of polling files
- Cross-execution pattern detection: compare logs from multiple `/extract` runs to find regressions (e.g., "Pass C took 3x longer on this file" or "agent asked 5 questions instead of usual 2")
**Implementation path:**
1. Low-effort: `fswatch` on `02_Work/` → structured log (replaces polling script)
2. Medium: Activity view in Live Research App consuming WS events already emitted
3. Full: Skills emit structured log entries → app displays → observer consumes → pattern analysis

### OBS-29: No correction loop for STT errors in normalized transcripts

**Severity:** High (Architecture gap)
**Where:** Preprocessing → Extraction pipeline, `02_Work/_temp/*_normalized.md`
**Evidence:** User found STT error in `touchpoint_normalized.md`: "Rompe los cirios ante aras" should be "Rompe los silos entre áreas". Pass B phonetic corrections didn't catch it (not in the correction table). Pass C sentence repair didn't flag it (grammatically valid Spanish, just wrong words).
**Current state:** No way to correct and propagate:
- `/extract` always reads from `01_Sources/` (read-only), not from `_temp/` — editing the normalized file has no effect on re-extraction
- Editing claims directly in EXTRACTIONS.md is fragile — lost on next `/extract`
- No persistent phonetic map that accumulates user corrections across sessions
**Concrete use case for OBS-26 glossary:**
1. User spots "cirios ante aras" in the app (Extractions view or normalized file preview)
2. Clicks → opens correction UI → types "silos entre áreas"
3. Correction saved to `02_Work/GLOSSARY.md` phonetic map: `cirios ante aras → silos entre áreas`
4. User triggers "re-process affected" → pipeline re-normalizes source → re-extracts claims → re-analyzes impacted insights
5. Next `/extract` on any file auto-applies the accumulated glossary
**Key constraint:** `01_Sources/` must remain read-only. Corrections live in the Work layer (glossary), not in the source. The normalization step applies glossary corrections on-the-fly during preprocessing.

**Additional use case — Speaker resolution:**
User sees `[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]` in a 1-on-1 meeting context and knows it's Camila. Current system can't capture this correction. Desired flow:
1. User specifies per-file speaker override: "in `reunion_camila_2026-02-17.md`, `otros participantes` = Camila Bonilla"
2. Correction saved to glossary (speaker section, scoped to file or folder)
3. Re-normalization propagates through entire transcript → all `[SPEAKER: otros participantes]` become `[SPEAKER: Camila Bonilla]`
4. Claim authority upgrades from "medium/group" to "identified speaker"
This is the same glossary infrastructure as phonetic corrections but for speaker identity. Three correction types in one system: **phonetic** (STT errors), **terminology** (domain terms), **speakers** (identity resolution).

### OBS-30: Tip for users — declare actual participants in source frontmatter

**Severity:** Low (UX guidance)
**Where:** Source metadata / `_CONTEXT.md` / source frontmatter
**Insight:** STT tools (Granola, Otter, etc.) list all calendar invitees as "participants," but often only 2 people actually spoke. If the user knows this, they can declare the real participants in the source frontmatter or `_CONTEXT.md`, and the preprocessing pipeline should prioritize those over the invitee list.
**Example:** A meeting invite has 6 attendees but it's actually a 1-on-1 between Niklas and Camila. User edits frontmatter:
```
participants: Nicolás Lundin, Camila Bonilla
invitees: Phillip Whatmore, Carlo Calderón, Ana Gómez, Alejandro Guzzoni
```
**Effect:** Pass A speaker attribution uses `participants` (not `invitees`) to resolve `Me:` / `Them:` labels. Confidence jumps from "medium/content-based" to "high/declared". The invitee list is preserved for context but doesn't drive attribution.
**Implementation:** Add `participants` vs `invitees` distinction to `_SOURCE_TEMPLATE.md` and `_CONTEXT_TEMPLATE.md`. Pass A checks `participants` first, falls back to `invitees` if absent.

### OBS-31: Rich participant metadata enables semantic speaker attribution

**Severity:** Medium (Feature opportunity — high impact on attribution quality)
**Where:** Source frontmatter / `_CONTEXT.md` → Pass A speaker attribution
**Insight:** The more context the agent has about WHO is in the meeting and their ROLE, the better it can attribute unlabeled speech via content analysis. Current Pass A uses generic content-based heuristics ("presentation verbs" → presenter). With rich metadata, attribution becomes much more precise.
**Example frontmatter:**
```
participants:
  - name: Nicolás Lundin
    role: UX Lead (IDEMAX)
    context: presenting prototype/proposal
  - name: Camila Bonilla
    role: UX Researcher (IDEMAX)
    context: evaluating, asking questions
  - name: Alejandro Guzzoni
    role: UX Designer (IDEMAX)
    context: evaluating, providing feedback
```
**Effect on attribution:** When transcript says "el benchmark tiene 25 referentes en 4 pilares" → presenter content → Niklas (high confidence). "Deberíamos agregar una slide de clusters" → evaluator proposing → Camila or Alejandro (medium, narrowed to 2 instead of 6). "¿Eso aplicaría para el caso de detección?" → question pattern → evaluator → Camila/Alejandro.
**Compounding value:** This metadata feeds three systems simultaneously:
1. **Pass A**: better speaker attribution → fewer `[SPEAKER: otros participantes]` blocks
2. **Authority layer**: identified speaker with role → precise authority tier (stakeholder observation vs internal hypothesis)
3. **Glossary/entities**: participant roles auto-populate the project entity graph (who is who, what org, what role)
**Implementation:** Extend `_CONTEXT.md` and `_SOURCE_TEMPLATE.md` to support structured participant metadata with `name`, `role`, and `context` fields. Pass A reads this before content-based heuristics.

### OBS-32: No way to challenge/invalidate a VERIFIED insight from the app

**Severity:** High (Architecture gap)
**Where:** Live Research App → Insights view, pipeline feedback loop
**Evidence:** User asks: "If I approved IG-26 (Core convive con productos) but later a CEO meeting reveals Core replaces everything — how do I undo it?" Currently no direct path:
- No "Challenge" or "Invalidate" button in the app
- No way to inject counter-evidence from a conversation/meeting without going through the full /extract → /analyze cycle
- Changing status manually in INSIGHTS_GRAPH.md works but has no traceability (no reason, no counter-evidence linked)
**Current workarounds (all clunky):**
1. Write a field note (`_FIELD_NOTES.md`) → `/extract` → `/analyze` detects conflict → `/synthesis` resolves → INVALIDATED. Full pipeline round-trip for a single correction.
2. Edit INSIGHTS_GRAPH.md directly (VERIFIED → INVALIDATED + note). No conflict record, no traceability.
3. Manually create a `[CF-XX]` entry in CONFLICTS.md. Requires knowing the format.
**Desired UX:** A "Challenge" action on any insight (VERIFIED or PENDING) in the app:
1. User clicks "Challenge" on IG-26
2. Enters counter-evidence: "CEO confirmed Core replaces all products" + source (meeting date, who said it)
3. System creates a conflict `[CF-XX]` linking IG-26 to the new evidence
4. Insight status changes to CONTESTED (or stays VERIFIED with conflict flag)
5. `/synthesis` resolves it with full traceability
**Broader implication:** The pipeline currently flows forward only (sources → claims → insights). There's no efficient backward flow (new evidence → challenge existing insight → re-evaluate). Field notes are the closest mechanism but require a full pipeline round-trip.

### OBS-33: App should warn when insight decisions invalidate current conflicts

**Severity:** High (UX gap — pipeline coherence)
**Where:** Live Research App → Actions / Conflicts interaction
**Evidence:** User approved 11 insights and rejected 1 in the app. The Conflicts view still shows 8 unresolved conflicts that were generated BEFORE these decisions. Some may now be auto-resolvable (e.g., a conflict between a rejected insight and an approved one). User is confused about whether to resolve conflicts first or re-analyze.
**Desired UX:**
1. User takes decisions on PENDING insights (approve/reject)
2. App detects state change → cross-references with existing conflicts
3. Conflicts view shows banner: "⚠ 11 insight statuses changed — some conflicts may be stale. Run /analyze or /synthesis to refresh."
4. Conflicts that reference rejected insights get auto-flagged as "likely resolved"
5. The `/synthesis` prompt generator (Actions view) should include conflict resolution context, not just insight approvals
**Broader issue:** The Actions view generates a `/synthesis` prompt with insight decisions but doesn't account for how those decisions affect conflicts. The prompt should be pipeline-aware: "These conflicts may be auto-resolved by your decisions: CF-XX (references rejected IG-33)."

### OBS-34: Insight reject/approve should accept a reason note

**Severity:** Medium (UX gap — traceability)
**Where:** Live Research App → Insights view → approve/reject action
**Evidence:** User rejects IG-33 but the only output is `INVALIDATED with reason: "Rejected during review."` — generic, no context. Why was it rejected? What counter-evidence? This is lost.
**Desired UX:** When rejecting (or approving) an insight, the app offers an optional text field for a reason. This note:
1. Gets included in the `/synthesis` prompt as context for the agent
2. Gets stored in INSIGHTS_GRAPH.md alongside the status change
3. Functions like a field note — lightweight evidence injection without creating a source file
**Example:** Reject IG-33 → note: "Conectividad en mina ya mapeada por operaciones en Workshop 1, no es condición nueva" → agent uses this context when updating the insight and related conflicts.

### BUG-06: Dashboard shows stale insight statuses after /synthesis — parser cache not invalidated

**Severity:** High
**Where:** Live Research App → Dashboard, `/api/insights`
**Reproduction:**
1. `/analyze` creates 11 PENDING insights
2. `/synthesis` changes all 11 to VERIFIED (+ 1 to INVALIDATED)
3. File confirms: `grep 'Status: PENDING' INSIGHTS_GRAPH.md` → zero results, 31 VERIFIED
4. API returns: 20 VERIFIED, 11 PENDING — stale data
5. Browser refresh doesn't fix — same stale data
**Root cause:** Server-side parse cache (`parseCache` Map in `api.js`) is not invalidated when the file watcher detects changes, OR the file watcher isn't detecting INSIGHTS_GRAPH.md changes from `/synthesis`.
**Impact:** User sees false PENDING count, Research Maturity bar is wrong, Action Items shows "11 pending insights" that don't exist. Undermines trust in the dashboard.
**Fix direction:** Verify that the chokidar watcher covers INSIGHTS_GRAPH.md changes and clears the parseCache entry. If the cache uses file hash/mtime, check if the file was written in a way that didn't update mtime (e.g., atomic write via rename).

### BUG-05: /synthesis offers to regenerate STATUS.html (legacy, replaced by Live Research App)

**Severity:** Low
**Where:** `/synthesis` skill — post-completion prompt
**Evidence:** After synthesis completes, agent suggests: "Regenerar STATUS.html con los datos actualizados". STATUS.html is a legacy Template+JSON deliverable that was replaced by the Live Research App (BL-33 Phase 1+2). It should not be offered as a next step.
**Fix direction:** Remove STATUS.html generation prompt from `/synthesis` skill instructions. The Live Research App auto-updates via WebSocket — no manual regeneration needed.

### ~~BUG-04~~: "Show more" button on insight cards does nothing — **CANNOT REPRODUCE**

**Severity:** ~~Medium~~ N/A
**Where:** Live Research App → Insights view → insight cards
**Original report:** Click "Show more" on any insight card. Nothing happens.
**Playwright retest (Fase 4):** Button works correctly — expands evidence trail (source claims with quotes), toggles to "Show less". Tested on IG-SYNTH-01. May have been an intermittent render issue or a state problem that cleared on view re-entry.

### BUG-02: Bold markdown (`**text**`) not rendered in Research Brief list items

**Severity:** Medium
**Where:** Research Brief view → "Brechas de evidencia" section
**Reproduction:**
1. Navigate to Research Brief in the app
2. Scroll to "Brechas de evidencia" numbered list
3. Observe `**Sin voz directa del usuario final**` shows raw `**` markers instead of bold
**Expected:** Bold text rendered as `<strong>`
**Actual:** Raw `**` markers displayed as text
**Root cause (hypothesis):** Custom `renderer.text` in `markdown.js:57-61` overrides marked's text processing to inject PD-Spec badges. This likely interferes with inline token processing — `marked` tokenizes `**bold**` into a `strong` token, but the custom handler may receive the raw text before/after inline processing depending on version. Headings render bold fine because they use a different renderer method.
**Scope:** Likely affects any `**bold**` inside list items, paragraphs, or other inline contexts in markdown views (Research Brief, file preview).

### BUG-07: Touchpoint file missing "processed" badge in Sources file browser

**Severity:** Medium
**Where:** Live Research App → Sources view → Touchpoint 1 folder
**Reproduction:**
1. Navigate to Sources in the app
2. Open `Touchpoint 1/` folder
3. `Touchpoint_TIMining-IDEMAX _2026-02-19.md` shows NO "processed" badge
4. Yet file IS in SOURCE_MAP: `Touchpoint 1/Touchpoint_TIMining-IDEMAX _2026-02-19.md | md | processed | 45 | de1149... | 2026-02-23T11:45`
**Expected:** Green "processed" badge like all other extracted files
**Root cause (hypothesis):** Path matching issue between SOURCE_MAP entry and filesystem path. The filename has a space before the underscore (`IDEMAX _2026`). The SOURCE_MAP matcher may not be handling this correctly, or the folder path `Touchpoint 1/` (with space) could be causing a normalization mismatch.
**Impact:** User sees file as "not extracted" when it actually is. Creates false concern about missing data.

### BUG-08: Preview panel persists across view changes (Sources → Outputs)

**Severity:** Low
**Where:** Live Research App → view navigation
**Reproduction:**
1. Go to Sources → click any file (e.g., Touchpoint transcript) → preview shows in right panel
2. Navigate to Outputs via sidebar
3. Preview panel still shows the Touchpoint transcript content from Sources view
**Expected:** Preview panel should clear when switching to a different view, or show a placeholder ("Select a file to preview")
**Root cause:** View component unmount doesn't reset the shared preview state. Both Sources and Outputs share the same preview component, and the selected file state persists across view switches.
**Impact:** Confusing — user sees source content when looking at Outputs. Minor but erodes trust.

### BUG-09: Search dropdown overflows right edge of viewport

**Severity:** Medium
**Where:** Live Research App → header search dropdown
**Reproduction:**
1. Type "ig" in the search bar (top-right corner)
2. Dropdown appears with matching insights
3. Dropdown extends beyond the right edge of the viewport — titles clipped ("Brecha geométr...", "Adherencia al p...", "Trampa de custo...")
**Expected:** Dropdown stays within viewport bounds, anchored to right edge of search input.
**Root cause:** OBS-37 fix widened dropdown to `min-width: min(600px, 90vw)` but removed `right: 0` positioning. Since the search input is in the top-right corner, the dropdown extends rightward past the viewport.
**Fix direction:** Re-add `right: 0` to the dropdown so it aligns to the right edge of the search input instead of the left. The width fix is correct; the anchor is wrong.
**Screenshots:** `Screenshot 2026-02-23 at 3.00.27 PM.png`, `Screenshot 2026-02-23 at 3.00.34 PM.png`

### BUG-10: Missing icons — Work sidebar (flask) and folder open/close state

**Severity:** Medium
**Where:** Live Research App → sidebar Work entry + File Browser folder rows
**Evidence:**
1. Work view in sidebar shows no icon — `icon: 'flask'` referenced in VIEW_REGISTRY but `icon-flask` was missing from the Tabler sprite
2. Folder rows in File Browser use `icon-folder` when collapsed and `icon-folder-open` when expanded (line 204), but `icon-folder-open` was missing from the sprite — folders disappeared/glitched on expand
**Root cause:** Sprite (`app/client/public/icons/sprite.svg`) only had 23 icons; `flask` and `folder-open` were never added when the features were built.
**Fix:** Added both `icon-flask` and `icon-folder-open` symbols to the sprite. Paths sourced from Tabler Icons v3 (MIT).

### BUG-11: Light mode status/badge colors too dark and indistinguishable

**Severity:** Medium
**Where:** Live Research App → light mode (toggle via sun/moon icon)
**Evidence:** Status badges (VERIFIED, PENDING, etc.), success/warning indicators, and colored UI elements appear too dark in light mode — colors blend together and are hard to distinguish. Dark mode colors are fine.
**Root cause:** CSS custom properties in the light theme override (`[data-theme="light"]`) likely use the same dark-theme values or insufficiently lightened variants for badge backgrounds and text.
**Fix direction:** Review light-theme color variables in `tokens.css` for badge backgrounds (`--verified-bg`, `--pending-bg`, `--blocked-bg`, etc.) and ensure sufficient contrast and distinguishability in light mode. Use lighter backgrounds with darker text for badges.

### OBS-37: Search dropdown clips insight titles — needs wider layout

**Severity:** Medium (UX)
**Where:** Live Research App → header search dropdown
**Evidence:** Screenshot shows search for "phil" — dropdown results show `IG-25 H...`, `IG-26 C...`, `IG-27 "P...` etc. Titles truncated to ~2 characters. The dropdown is too narrow: badge + ID + truncated title + status badge compete for space, leaving zero useful context.
**Expected:** Dropdown should be significantly wider (at least 400-500px or match the search input width). Titles should show enough text to differentiate results (e.g., "Hub de Decisiones — Las decisiones..." vs just "H...").
**Fix direction:** Increase dropdown `min-width` / `max-width`. Consider a two-line layout per result: line 1 = ID + status, line 2 = full title (truncated at ~80 chars with ellipsis). Or use a wider popover anchored to the right edge of the search input.

### OBS-38: Research Brief insight links look like plain text, not clickable

**Severity:** Medium (UX — discoverability)
**Where:** Live Research App → Research Brief view → inline `[IG-XX]` references
**Evidence:** Screenshot shows `IG-25`, `IG-SYNTH-03`, `IG-SYNTH-09`, `IG-SYNTH-11` rendered as `<code>`-style inline badges (monospace, light background) but with NO visual affordance that they're clickable. No underline, no color change, no hover cursor visible. Some refs like `[IG-30, CF-15]` render as raw bracketed text, not even as badges.
**Contrast:** In the Insights and System Map views, the same refs render as teal-colored clickable buttons. Inconsistent affordance across views.
**Fix direction:**
1. Make all inline refs in Research Brief visually match the clickable badge style from other views (teal text or underline, `cursor: pointer`)
2. Ensure bracket-format refs like `[IG-30, CF-15]` are also parsed and converted to clickable badges (the markdown renderer's ref-link converter may not handle comma-separated refs inside brackets)

### OBS-39: Playwright snapshots consume excessive context tokens

**Severity:** Medium (Process improvement)
**Where:** QA methodology — Playwright MCP verification
**Evidence:** During this session's comprehensive Playwright review, each `browser_snapshot` returned 5K-200K+ characters of accessibility tree YAML. Multiple snapshots in the main agent context consumed a large portion of the context window, contributing to compaction risk.
**Observation:** Playwright verification should be delegated to a **Task subagent (model=sonnet)** to protect the main agent's context window. The subagent:
1. Navigates to affected views
2. Takes snapshots and evaluates specific conditions
3. Returns a compact pass/fail summary (not full snapshots) to the main agent
**Benefit:** Main agent retains full conversation context for planning and decision-making. Sonnet subagent handles the token-heavy visual inspection in an isolated context. Cost-effective (Sonnet is cheaper) and context-safe.
**Implementation:** In QA sessions, use `Task(subagent_type="general-purpose", model="sonnet")` with specific verification checklist. Agent returns structured results like `BUG-06: PASS — Dashboard shows 31 VERIFIED, 0 PENDING`.

### OBS-35: Evidence Gaps sidebar badge shows 4 but page shows 8 total

**Severity:** Low (Cosmetic inconsistency)
**Where:** Live Research App → sidebar badge vs Evidence Gaps heading
**Evidence:** Sidebar shows badge "4", heading says "Evidence Gaps (8)". The badge only counts Claim-Level gaps (4), ignoring Category Gap (1) and Source-Diversity (3) gaps.
**Fix direction:** Badge should show total gap count (8), or show subcounts (e.g., "4 + 4").

### OBS-36: Research Brief view has duplicate heading

**Severity:** Low (Cosmetic)
**Where:** Live Research App → Research Brief view
**Evidence:** The page title shows "Research Brief" (from the view component heading) AND the markdown content starts with `# Research Brief` (from the file itself). Both render, creating a duplicate heading.
**Fix direction:** Either strip the first `# heading` from the markdown content when it matches the view title, or remove the component-level heading for this view.

### BUG-12: Search input stays ~197px — max-width doesn't expand

**Severity:** Low
**Where:** Live Research App → header search input
**Evidence:** Despite `max-width: 500px` in CSS, the input renders at ~197px. `max-width` only limits, doesn't force width. The flex container (`app-header`) compresses the search container.
**Fix direction:** Add `min-width` or `width` to `.search-container` or `.search-input` to ensure it expands. Or use `flex: 1` on the search container within the header flex.

### BUG-13: No back navigation — cross-nav from Outputs destroys view state

**Severity:** High
**Where:** Live Research App → Outputs → badge click → Insights/Conflicts → no return path
**Reproduction:**
1. Navigate to Outputs → open a folder → select `PERSONAS.md` → preview renders in right panel
2. Click an `[IG-XX]` badge in the preview
3. App navigates to Insights view, highlights the insight — correct
4. Try to go back:
   - **Browser back** → exits the app entirely (no in-app URL history)
   - **Sidebar "Outputs"** → fresh FileBrowser: no file selected, folders collapsed, preview empty
5. All Outputs view state is lost — user must re-navigate to the file they were reading

**Root cause (architectural):**
The app uses a single `useState('dashboard')` in `app.jsx:33` for navigation. Every view change calls `setView(newView)` which:
- Unmounts the current view component (destroying all its internal state)
- Mounts the new view from scratch
- Records nothing about where the user came from

There is **no navigation history mechanism**:
- No `window.history.pushState()` — browser back exits the app
- No view history stack — no "previous view" tracking
- No state preservation — FileBrowser's `selectedFile`, `collapsedFolders`, `preview` are component-local state, destroyed on unmount

**State destroyed on navigation:**
- `selectedFile` (which .md was being previewed)
- `collapsedFolders` (which folders were expanded)
- `preview` (the rendered markdown content)
- Scroll position in file tree and preview pane

**Impact:** Cross-navigation (BL-58) is broken in practice. Users can follow a badge to see the insight, but then they're stranded — they can't return to what they were reading. This makes the entire Outputs preview experience frustrating for reviewing deliverables with many `[IG-XX]` refs.

**Fix direction (two layers):**

1. **View history stack** — `app.jsx` maintains a `viewHistory` array. Each `navigateTo()` pushes `{ view, context }` onto the stack. A "Back" button (or browser back via `pushState`) pops the stack and restores the previous view + context.

2. **State preservation** — Lift FileBrowser state (`selectedFile`, `collapsedFolders`) up to App level so it survives unmount/remount. Or render all views simultaneously and use CSS `display: none` to hide inactive ones (preserves DOM state). The first approach is cleaner; the second is simpler.

**Relevant code:**
- `app/client/app.jsx:33` — `const [view, setView] = useState('dashboard')`
- `app/client/app.jsx:47-58` — `navigateTo()` — flat `setView()`, no stack
- `app/client/components/FileBrowser.jsx:25-29` — component-local state
- `app/client/components/FileBrowser.jsx:275-282` — badge click handler in preview

### OBS-40: Convergence bar semantics unclear — visual contradicts reality

**Severity:** Medium (UX)
**Where:** Live Research App → Insights view → convergence progress bar
**Evidence:** 1/1 bar shows full (100%) suggesting strong evidence — but it's single-source (weakest). 3/54 bar shows nearly empty — but 3 independent sources is reasonable. Empty bar = unclear (0? error?). The bar communicates nothing useful without context.
**Fix direction:** Rethink the visual. Options: (a) bar shows matched/total with label explaining what "good" looks like, (b) replace bar with text-only indicator ("3 sources" with color), (c) bar denominator = fixed scale (e.g., 5 sources = full), not total project sources.

### OBS-41: Insight ref chips show folder paths — unnecessary noise

**Severity:** Low (UX)
**Where:** Live Research App → Insights view → ref chips on cards
**Evidence:** Chips show `Antecedentes/filename.pdf` — the folder path adds noise. Filename alone is sufficient. Chips should be clickable → navigate to file in Sources view.
**Fix direction:** Show filename only. Make clickable → Sources file browser with file selected.

### OBS-42: File type badge not monospaced

**Severity:** Low (UX polish)
**Where:** Live Research App → FileBrowser → file type label (md, pdf, docx, etc.)
**Evidence:** Type labels use sans-serif font. Should use `var(--font-mono)` (JetBrains Mono) for consistency with other technical labels.

### OBS-43: Preview header "Open with System App" redundant — show extraction status instead

**Severity:** Medium (UX)
**Where:** Live Research App → Sources → file preview header
**Evidence:** "Open with System App" button appears in both preview header AND preview body for binary files. Header space better used for extraction status badge (dot + text: "Processed — 71 claims" or "Not extracted"). Keep "Open with System App" only in body for non-previewable files.

### OBS-44: Badge styling inconsistent across components

**Severity:** Medium (UX polish)
**Where:** Live Research App → all views
**Evidence:** Badges vary in font-family, size, padding across views. Status badges (VERIFIED, READY, BLOCKED), ID badges (IG-XX), and UI badges (file counts) use different type styles. All should use `var(--font-mono)` (JetBrains Mono). Size variants should be explicit classes (`badge-sm`, `badge-lg`) not ad-hoc inline styles.

### OBS-45: Folder file count not monospaced

**Severity:** Low (UX polish)
**Where:** Live Research App → FileBrowser → folder row file count (6, 33, etc.)
**Evidence:** Count number uses sans-serif. Should use `var(--font-mono)` for consistency with other numeric labels.

### OBS-46: "Decisions pending" footer not actionable

**Severity:** Medium (UX)
**Where:** Live Research App → sidebar footer → "N decisions pending"
**Evidence:** Shows count but clicking does nothing. Should navigate to Actions view where the user can generate the /synthesis prompt with their decisions.

### OBS-47: System Map module cards — visual hierarchy unclear

**Severity:** Medium (UX)
**Where:** Live Research App → System Map → module cards (light mode screenshot)
**Evidence:** (1) READY/BLOCKED badges are grey — don't use status colors (green/red). (2) Left border has color but meaning unclear. (3) Blocker alert at bottom competes with grey badges above. No clear visual hierarchy.
**Fix direction:** Status badge = colored (READY=green, BLOCKED=red). Left border = matches status. IG-XX badges stay teal. Hierarchy: status → refs → content → blockers.

## Test Results — Fase 1b: Pre-QA Fixes (v4.21.0)

> Dual-terminal QA. Observer: Opus 4.6 on main with automated file watcher (30s polling). Executor: Sonnet 4.6 on TIMining.

| ID | Test | Status | Notes |
|---|---|---|---|
| T25 | Badge `[IG-SYNTH-16b]` renders | **PASS** | Initial FAIL — server running pre-fix code in memory. After rebuild + restart → badge renders as clickable `<span class="badge badge-insight">` with `data-ref="IG-SYNTH-16b"`. See OBS-53 |
| T26 | `--file` deletes stale `_normalized.md` | **PASS** | Watcher tick 8: 3 files deleted (80KB, 64KB, 192KB → none). Fresh normalizeds recreated at tick 42-45 |
| T27 | Pass A preserves metadata above boundary | **PASS** | Touchpoint: attendees (lines 5-12) intact, no `[SPEAKER:]`. session-align: metadata (lines 1-5) clean. reunion_camila: header preserved |
| T28 | Pass C no editorial injection | **PASS** | Watcher flagged reunion_camila (false positive — "No es fuente" is in the original source, not injected by Pass C). session-align + touchpoint clean |

### Preprocessing Timeline (from watcher log)

```
09:45  Watcher baseline — 3 stale normalizeds (80K + 64K + 192K)
09:49  T26 — all 3 deleted (--file mode worked)
10:00  session-align_mechanical.md written (55KB, 479L)
10:00  reunion_camila_mechanical.md written (79KB, 155L)
10:03  touchpoint_mechanical.md written (135KB, 1752L)
10:05  session-align_normalized.md (55KB, 482L — +3L from Pass C)
10:06  reunion_camila_normalized.md (79KB, 166L — +11L)
10:07  touchpoint_normalized.md (135KB, 1752L — 0 delta from Pass C)
10:09  Final sizes stabilized after minor rewrites
10:17  Phase 2 extraction begins
10:13  EXTRACTIONS.md: 57 sections, 1323 claims (+3 sections, +85 claims)
10:15  SOURCE_MAP.md: 58 rows (+3)
10:17  Extract complete — 17m42s total
```

## Test Results — Fase 2+3: Extract + Analyze + Synthesis (v4.21.0)

| ID | Test | Status | Notes |
|---|---|---|---|
| T10 | 3 new transcripts extracted | **PASS** | 85 claims: reunion_camila (21), session-align (22), Touchpoint (42). Authority tags correct |
| T11 | Touchpoint oversized lines handled | **PASS** | 134KB → normalized to 1752 lines (from 63KB max line). No Read tool failure |
| T12 | Authority layer applied | **PASS** | sesiones-idemax tagged [INTERNAL], Touchpoint tagged primary. Correct differentiation |
| T15 | Incremental /analyze | **PASS** | 7 new insights (IG-03 to IG-09), 2 new conflicts (CF-12, CF-13). 12 convergence updates |
| T16 | Internal authority respected | **PASS** | sesiones-idemax claims contributed convergence but didn't independently verify insights |
| T15b | /synthesis | **PASS** | 6 insights verified, 1 invalidated (IG-07). System Map updated: +3 module changes, +1 principle update, +3 open questions |

## Test Results — Fase 4: Playwright Verification (v4.21.0)

> Playwright MCP via Sonnet subagent (OBS-39 applied). Observer: Opus 4.6 on main. Server: rebuild + restart on TIMining.

| ID | Test | Status | Notes |
|---|---|---|---|
| P1 | PRD.md badges clickable | **PASS** | IG-SYNTH-01 renders as `<span class="badge badge-insight" data-ref="IG-SYNTH-01">`, click navigates to Insights view |
| P2 | `[IG-SYNTH-16b]` renders as badge | **PASS** | Initial FAIL (server cached pre-fix code). After rebuild + restart: badge at 3 locations in PRD.md (Executive Summary, Pricing, Insights Summary table) |
| P3 | PDF preview | **PASS** | PDF selected in Sources → iframe renders |
| P4 | Cross-nav from Work browser | **PASS** | RESEARCH_BRIEF.md → click [IG-XX] → navigates to Insights view |
| P5 | Search modules ("geometr") | **PASS** | System Map category appears in search results |
| P6 | Search sources ("touchpoint") | **PASS** | Sources category with Touchpoint file |
| P7 | New extractions visible | **PASS** | Extractions view → sesiones-idemax + Touchpoint claims present |
| P8 | Dashboard counts updated | **PASS** | Sources ≥ 57, 1323 claims, 26 VERIFIED, 13 conflicts |

**Result: 8/8 PASS** (T25/P2 required server restart — see OBS-53)

### Final State (post-synthesis, verified from disk + app)

| Metric | Before (Fase 0) | After (Fase 3) | Delta |
|---|---|---|---|
| Sources | 54 | 72 (app) | +18 (includes metadata files) |
| Claims | 1238 | 1323 | +85 |
| Insights | 24 | 30 (app) | +6 visible |
| — Verified | 20 | 26 | +6 |
| — Merged | 0 | 1 | +1 |
| — Invalidated | 1 | 3 | +2 |
| Conflicts | 11 | 13 | +2 |
| System Map modules | 14 | 14 | 0 (updated in place) |

### New Observations

### OBS-49: /analyze agent miscounted insights — BL-47 script-first violation

**Severity:** Medium
**Where:** /analyze final report (Sonnet 4.6)
**Evidence:** Agent reported "27 VERIFIED, 0 PENDING." Disk shows 26 VERIFIED, 0 PENDING (correct via parser). App confirmed 26 VERIFIED. The agent used LLM mental counting instead of `grep -c` validation (BL-47 script-first rule).
**Impact:** Incorrect numbers in session report. Could mislead user about project state if not cross-checked.
**Fix direction:** BL-47 already prescribes script-first counting. Enforcement gap — the rule exists but Sonnet didn't follow it.

### OBS-50: Mixed IG-XX convention persists — BL-67 confirmed

**Severity:** Medium (Data consistency)
**Where:** INSIGHTS_GRAPH.md
**Evidence:** Existing insights use `IG-SYNTH-01` through `IG-SYNTH-21`. New incremental /analyze created `IG-03` through `IG-09`. Two ID conventions in same project. Confirms BL-67 (proposed).
**Impact:** System Map references `IG-SYNTH-XX`; new insights use `IG-XX`. Cross-referencing requires knowing both conventions.

### OBS-51: T28 false positive — "No es fuente" is in source, not injected by Pass C

**Severity:** Low (Watcher limitation)
**Where:** QA file watcher script
**Evidence:** Watcher flagged `reunion_camila_normalized.md` for T28 (editorial content). Manual inspection revealed line 5 (`> Notas internas Idemax. No es fuente para /extract.`) exists in the original source file — a human-written note, not Pass C injection. Pass C correctly preserved it without modification.
**Lesson:** Watcher heuristics need baseline comparison (source vs normalized diff) to distinguish inherited content from injected content.

### OBS-52: Pass C zero-delta on Touchpoint (134KB transcript)

**Severity:** Low (Needs investigation)
**Where:** Phase 1.5b Pass C on Touchpoint
**Evidence:** `touchpoint_mechanical.md` (134715B, 1752L) → `touchpoint_normalized.md` (134715B, 1752L initially, then grew to 136133B/1761L after a rewrite). Initial Pass C produced zero delta — identical file size. Later rewrite added 1.4KB/+9 lines.
**Possible causes:** (1) Pass C was applied but produced no changes (clean transcript), (2) Pass C was silently skipped and file was copied, (3) Initial write was mechanical copy, later rewrite was actual Pass C.
**Impact:** If Pass C was skipped, sentence repair markers (`[incomplete]`, `[crosstalk]`, `[unintelligible]`) may be missing from the Touchpoint transcript.

### OBS-53: Server restart required after engine merge — Node.js module cache

**Severity:** Medium (Process/UX)
**Where:** Live Research App server after `git merge main`
**Evidence:** After merging badge regex fix from main → TIMining, the running Node.js server (PID 21016, started at 10:50PM pre-merge) still served stale code. `app/server/parsers/markdown.js` had the correct regex on disk (`[A-Za-z0-9-]`) but Node.js had the old version cached in memory (`[A-Z0-9-]`). Result: `[IG-SYNTH-16b]` remained plain text despite the fix being deployed.
**Root cause:** Node.js caches ES modules on first import — changing the source file has no effect on a running process. The `/view` skill starts the server once; it doesn't auto-restart on file changes.
**Resolution:** Kill server (port 3000) → rebuild frontend (`npx vite build`) → restart server → badge renders correctly.
**Fix direction:** Options:
1. `/view` should detect when `app/server/` files change and auto-restart (nodemon-style, or chokidar-based server watcher)
2. Post-merge checklist in QA process: "restart server after engine merge"
3. `/view --dev` mode already uses Vite HMR for client code, but server code still needs manual restart
**Impact on QA:** Initial Playwright test reported T25 as FAIL. Spent investigation time before identifying the cache as root cause. QA process should include server restart as standard step after merge.

### OBS-54: `/ship` has no output dependency graph — generation order is ad-hoc

**Severity:** Medium (Architecture gap)
**Where:** `/ship` skill — multi-output generation
**Evidence:** When user requested all 10 `/ship` types, the agent had to reason ad-hoc about dependency order (Personas → Journey → User Stories → etc.). The correct order matters: insights that emerge in early outputs (e.g., a pain point crystallized in JOURNEY_MAP) should propagate to later ones (USER_STORIES, STRATEGY). Currently each `/ship [type]` is independent — no concept of inter-output dependencies.
**Observed optimal order:**
1. Capa 1 (paralelo): PERSONAS + LEAN_CANVAS — foundational, independent
2. Capa 2 (paralelo): JOURNEY_MAP + USER_STORIES + BENCHMARK_UX — require Capa 1
3. Capa 3 (secuencial): REPORT → AUDIT → STRATEGY → PRESENTATION — synthesis layer
**Fix direction:** `/ship` could have a built-in dependency graph. `/ship update` (see IDEAS.md in TIMining) uses the graph to determine what needs refreshing and in what order. `/ship all` generates in dependency order with subagents per layer.
**Related:** `pds--timining/02_Work/IDEAS.md` → `[IDEA] /ship update`

### OBS-55: Multi-output `/ship` should use dedicated subagents per output

**Severity:** Medium (Performance/Quality)
**Where:** `/ship` skill — batch generation
**Evidence:** Generating 9 outputs sequentially in one agent session risks context compaction. Output #9 (Presentation) would have significantly lower quality than Output #1 (Personas) because the agent has accumulated 8 large documents in context. Each `/ship [type]` reads the same primary sources (INSIGHTS_GRAPH, SYSTEM_MAP, CONFLICTS) — cross-referencing between outputs is secondary.
**Recommended pattern:** Coordinator agent launches subagents per layer:
- Layer 1: 2 subagents in parallel (Personas + Lean Canvas)
- Layer 2: 3 subagents in parallel (Journey + User Stories + Benchmark) — each reads Layer 1 from disk
- Layer 3: 4 subagents sequential (Report → Audit → Strategy → Presentation) — each reads all prior from disk
**Benefit:** Output #9 has the same quality as #1 — each subagent starts with fresh context dedicated to one document. The coordinator never generates content itself.
**Related:** `pds--timining/02_Work/IDEAS.md` → `[IDEA] /ship update`

### OBS-48: Open Questions buried in System Map — should be more prominent

**Severity:** Medium (UX / Information Architecture)
**Where:** Live Research App → System Map → Open Questions section (bottom)
**Evidence:** Open Questions are actionable research items but buried at the bottom of System Map below modules and principles. Their location in System Map is unintuitive — research gaps ≠ product architecture. Related to OBS-15 (modules vs principles unclear) and OBS-17 (abstraction inconsistent).
**Fix direction:** Options: (a) Surface Open Questions in Dashboard as actionable items, (b) Separate view or dedicated section, (c) Rethink System Map organization entirely — what belongs here vs elsewhere. System Map may need a content/structure redesign.

### OBS-56: MEMORY.md duplicate entry — PRESENTATION logged twice

**Severity:** Medium (Session protocol violation)
**Where:** `pds--timining/02_Work/MEMORY.md` — lines 63-67 and 69-73
**Evidence:** The `/ship presentation` entry appears twice, verbatim copy. Both have timestamp `[2026-02-24T21:00]`, identical content. The agent appended the entry, then appended it again — no deduplication check.
**Impact:** MEMORY.md at 79 lines (1 below compaction threshold of 80). The duplicate wastes 5 lines that push it dangerously close to triggering compaction. Also inflates the apparent work done.
**Fix direction:** Session protocol should include a deduplication guard: before appending, check if the last entry has the same skill name and output. Alternatively, MEMORY write should be idempotent — overwrite the last entry if it matches.

### OBS-57: Fabricated timestamps in MEMORY.md — not based on real execution time

**Severity:** High (Traceability violation)
**Where:** `pds--timining/02_Work/MEMORY.md` — all 9 `/ship` entries
**Evidence:** Timestamps follow a neat hourly cadence: 14:00, 15:00, 15:30, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00. Real execution was a compressed burst (~24 min total via subagents). The agent invented plausible-looking timestamps instead of recording actual completion times. Additionally, the order is inconsistent — JOURNEY_MAP (16:00) appears AFTER USER_STORIES (17:00) in the file, but was listed as earlier.
**Impact:** Timestamps are the primary audit trail for session reconstruction. Fabricated times make it impossible to correlate MEMORY entries with actual execution order. If a user reads MEMORY.md to understand what happened, they get fiction.
**Root cause:** The session protocol says `YYYY-MM-DDTHH:MM` format but doesn't say "use actual current time." The subagent coordinator logged entries after all outputs completed, inventing timestamps for each. Subagents themselves didn't have independent time awareness.
**Fix direction:** (1) SKILL.md should explicitly state "use actual wall-clock time, not estimates." (2) Subagent coordinator should record start/end times per subagent and use those. (3) Consider: is the agent even capable of knowing the real time? If not, the timestamp should be omitted or marked approximate.

### OBS-58: MEMORY.md at 79 lines without proactive compaction

**Severity:** Medium (Session protocol violation)
**Where:** `pds--timining/02_Work/MEMORY.md`
**Evidence:** File has 79 lines — 1 below the 80-line compaction threshold. The agent generated 9 outputs and logged 10 entries (including duplicate) without compacting. CLAUDE.md says "when MEMORY.md exceeds 80 lines, compact." The agent interpreted this literally (79 < 80, no trigger) instead of proactively compacting when approaching the limit.
**Impact:** Next skill execution will push past 80 lines, forcing emergency compaction mid-operation. Better to compact proactively during the "batch write" phase when the agent has full context.
**Fix direction:** Change threshold language to "approaches 80 lines" or "exceeds 60 lines" to trigger proactive compaction. Or: after any batch of 3+ MEMORY entries, compact regardless of line count.

### OBS-59: BENCHMARK_UX.md has 16 referents — exceeds skill limit of 8-15

**Severity:** Medium (Skill compliance)
**Where:** `pds--timining/03_Outputs/BENCHMARK_UX.md`
**Evidence:** SKILL.md `/ship benchmark-ux` specifies: "8–15 referents total" and "Anti-hallucination: Every referent must be a real product verifiable via web search. If unsure, skip it." The generated file has 16 referents — exceeds the upper bound. No evidence that web verification was performed (subagent didn't have web access).
**Impact:** Exceeding the limit is minor. The real risk is hallucinated referents — if any of the 16 are not real, verifiable products, the deliverable contains fabricated evidence presented as benchmark research. The anti-hallucination rule exists precisely because benchmark referents are high-risk for invention.
**Fix direction:** (1) Enforce the 8-15 limit in the skill. (2) For benchmark outputs specifically, either require web search verification or add a disclaimer: "Referents based on agent knowledge — verify independently before presenting to stakeholders."

### OBS-60: REPORT.md missing from MEMORY.md entries

**Severity:** Medium (Session protocol violation)
**Where:** `pds--timining/02_Work/MEMORY.md`
**Evidence:** All 10 outputs were generated (PRD, Personas, Lean Canvas, Journey Map, User Stories, Benchmark UX, Report, Audit, Strategy, Presentation). MEMORY.md has entries for 9 of them — REPORT.md is missing. No `## [timestamp] /ship report` entry.
**Impact:** Session reconstruction from MEMORY.md would miss that REPORT.md was generated. A future agent reading MEMORY.md wouldn't know REPORT exists unless it scans `03_Outputs/` directly.
**Fix direction:** Session protocol compliance — every `/ship` execution must log to MEMORY. When using subagents, the coordinator must verify all subagent outputs are logged. Missing log entries = invisible work.

### OBS-61: Etapa 2 research roadmap duplicated between STRATEGY.md and AUDIT.md

**Severity:** High (Content quality / output architecture)
**Where:** `pds--timining/03_Outputs/STRATEGY.md` §4 (lines 107-141) and `AUDIT.md` §4.1 (lines 140-168)
**Evidence:** Both files contain nearly identical "Etapa 2" research roadmaps:
- Same interview questions (8 in STRATEGY, 11 in AUDIT — AUDIT is a superset)
- Same profiles (Jefe de Turno, Despachador, Gerente de Mina, CFO)
- Same validation criteria by conflict (CF-13, CF-07, IG-03, IG-06)
- Same prescription: "3-5 entrevistas semi-estructuradas de 30 minutos"

**Additional evidence — SESSION_CHECKPOINT.md:**
The agent's checkpoint summary includes: *"Próximo paso crítico: Etapa 2 — 5-7 entrevistas con usuarios (Philip facilita). 2 Jefes de Turno resuelven CF-07, CF-13 e IG-04 en una ronda."* Three issues:
- "Resuelven" is false — 2 interviews with one profile don't resolve CF-07 (no direct user voice). CF-07 requires coverage across 4-5 profiles. 2 JdT interviews *partially mitigate*, they don't resolve.
- "En una ronda" is an unsupported promise — IG-04 has convergence 1/57 (single CTO quote). First field interviews typically *complexify* conflicts, not close them.
- The agent prescribes methodology to the consultant: sample size (5-7), facilitator (Philip), resolution claims per interview count. This is methodological overreach in a session state document.

**Three problems:**
1. **Duplication:** Content copied between deliverables. If the methodology evolves, two documents go stale instead of one. Each output should have a unique contribution — a single canonical location for the Etapa 2 roadmap.
2. **Ungrounded prescriptions presented as conclusions:** The agent states "2 Jefes de Turno resuelven CF-07, CF-13 e IG-04 en una ronda" — this is a hypothesis about research outcomes, not a fact derived from the knowledge base. The agent has no evidence that 2 interviews will suffice or that these conflicts will resolve cleanly. Presenting ungrounded methodological predictions as confident statements is a hallucination risk — the same pattern as inventing benchmark referents without web verification (OBS-59).
3. **Prescriptive vs. diagnostic boundary unclear:** The core issue is not that prescribing methodology is inherently wrong — a `/ship interview-guide` output type could legitimately generate interview questions grounded in the knowledge base. The problem is that AUDIT, STRATEGY, and SESSION_CHECKPOINT all contain methodological prescriptions *without being asked* and *without distinguishing diagnosis from prescription*. The agent doesn't flag "this is my recommendation" vs. "this is what the data says." It mixes both seamlessly, which makes the hallucinated parts harder to catch.

**Fix direction:**
- AUDIT should own the gap diagnosis: what's weak, why, what data would fix it.
- STRATEGY should own the strategic implications: what decisions are blocked, what's the risk of proceeding without validation.
- Neither should prescribe interview methodology *by default*. If the user wants an interview guide, `/ship interview-guide` could be a separate output type that explicitly carries that responsibility — with its own anti-hallucination rules (questions must trace to specific [CF-XX] or [IG-XX], resolution predictions must be flagged as hypotheses).
- The skill instructions for `audit` and `strategy` should include a boundary: "Diagnose gaps and state validation needs. Do NOT prescribe research methodology (interview scripts, sample sizes, question banks) unless the user explicitly requests it. When prescribing, distinguish diagnosis (evidence-based) from recommendation (hypothesis) explicitly."
- SESSION_CHECKPOINT should never contain predictive claims about future research outcomes. State what's pending, not what will happen.

### OBS-62: `/analyze` dropped design-framework claims → `/ship` bypassed knowledge base to compensate

**Severity:** High (pipeline gap with downstream Mandate #1 violation)
**Where:** Full pipeline chain: `/analyze` → `/synthesis` → `/ship benchmark-ux`

**Context:** The project has 4 design pillars developed in freemode (Feb 16-18 workshop): **Quiet UI, Clear Path, Time Sight, Omni Sense**. Documented in `03_Outputs/_custom/PILARES.html`, iterated in session history. These are the real pillars presented to the client.

**Evidence chain:**

1. **`/extract` worked correctly.** Touchpoint claims 30-37 captured the 4 pillar definitions with benchmarks and connections. Sesiones-idemax claims 6/16-17 also reference them.

2. **`/analyze` dropped the claims.** 85 new claims from 3 files → only 7 insights created (IG-03 to IG-09). Claims 30-37 (pillar definitions) are completely orphaned — no insight references them. Two overlapping problems:
   - **No category for design-framework claims.** `/analyze` SKILL.md defines 4 categories: `user-need`, `technical`, `business`, `constraint`. Pillar definitions ("Quiet UI absorbs visual complexity", "Clear Path reduces cognitive friction") don't fit any of them. A literal agent discards them as "not insights."
   - **Express mode over-consolidation.** 85→7 is a 12:1 ratio in a mode that should produce atomic insights (Phase 3 synthesis skipped). The agent consolidated aggressively instead of creating one insight per claim as instructed.

3. **`/synthesis` had nothing to propagate.** It only reads INSIGHTS_GRAPH (not EXTRACTIONS). Since no pillar insights exist, it couldn't add them to SYSTEM_MAP. Synthesis ran with targeted prompts (resolve CF-03, CF-12, verify IG-02-09) — correct behavior given its inputs, but the inputs were already incomplete.

4. **`/ship benchmark-ux` reached past the knowledge base.** SYSTEM_MAP has 7 Design Principles ("Paz Mental", "Quiet UI", "Zero Homer", "D→A→R", "Inteligencia Democrática", "Efecto Suiza", "Operational Pull") — only "Quiet UI" overlaps with the 4 pillars. The user asked for all `/ship` deliverables (not specific benchmark instructions). The agent autonomously organized the benchmark by the 4-pillar framework sourced from raw claims or session context, not from verified knowledge base. When asked where the pillars came from, the agent **fabricated a SKILL.md citation** ("benchmark inter-industria organizado por los 4 pilares de diseño de CORE") — no such instruction exists in SKILL.md.

**Why it matters:** The content is factually correct (these are the real pillars). But the pipeline failed to formalize them, and the output agent compensated by bypassing verification. The output looks right for the wrong reasons — a coincidence that masks a real gap.

**Root cause (engine-level):**
- `/analyze` needs a 5th category (e.g., `design-framework` or `methodology`) for claims that define product principles, design language, or organizational frameworks.
- Express mode's consolidation ratio needs a floor — atomic mode should never drop below ~1:3 (claims:insights) without explicit dedup justification logged per claim.

**Fix direction:**
- Add `design-framework` category to `/analyze` SKILL.md (covers pillar definitions, design principles, naming conventions, UX patterns)
- Add consolidation ratio guard: if express mode produces <25% of input claims as insights, warn user and list dropped claim ranges
- `/ship` should cross-check its organizing framework against SYSTEM_MAP and flag divergences before generating

## Summary

| ID | Type | Severity | Status |
|---|---|---|---|
| **BUG-06** | **Stale parseCache — dashboard wrong** | **High** | **Fixed v4.18.0** |
| BUG-07 | Touchpoint missing "processed" badge | Medium | **Fixed v4.18.0** |
| BUG-08 | Preview persists across views | Low | **Fixed v4.18.0** |
| BUG-05 | /synthesis offers STATUS.html (legacy) | Low | **Fixed v4.18.0** |
| BUG-09 | Search dropdown overflows right edge of viewport | Medium | **Fixed v4.18.0** |
| BUG-10 | Missing icons (flask + folder-open) | Medium | **Fixed v4.18.0** |
| BUG-11 | Light mode badge colors too dark/indistinguishable | Medium | **Fixed v4.18.0** |
| BUG-02 | Bold markdown not rendered in list items | Medium | **Fixed v4.18.0** |
| BUG-12 | Search input stays ~197px | Low | Open |
| **BUG-13** | **No back navigation — cross-nav destroys view state** | **High** | **Open** |
| BUG-01 | Premature fix for OBS-01 | Medium | Reverted |
| ~~BUG-04~~ | ~~Show more does nothing~~ | ~~Medium~~ | **CANNOT REPRODUCE** |
| ~~BUG-03~~ | ~~Agent hallucinated extraction status~~ | ~~High~~ | **RETRACTED** |
| OBS-01 | Dashboard shows 100% when new sources exist | Medium | **Fixed v4.18.0** |
| OBS-02 | Data accuracy (extraction counts) | Medium | **Fixed v4.18.0** (NFC normalization) |
| OBS-03 | Process violation (observe-don't-fix) | Process | Noted |
| OBS-04 | UX — root grouping (sources) | Low | **Fixed v4.18.0** |
| OBS-05 | UX — dotfiles shown | Low | **Fixed v4.18.0** |
| OBS-06 | UX — metadata files hidden | Medium | **Fixed v4.18.0** |
| OBS-07 | UX — outputs only shows .html | High | **Fixed v4.18.0** |
| OBS-08 | UX — root grouping (outputs) | Low | **Fixed v4.18.0** |
| OBS-09 | Evidence Gaps confusing/low-value | High | Open |
| OBS-10 | Extractions needs collapse/expand | Medium | Open |
| OBS-11 | Search limited to insights+conflicts | Medium | Open |
| OBS-12 | Missing Source Coverage summary | Medium | Open |
| OBS-13 | System Map needs collapse + mini-dashboard | Medium | Open |
| OBS-14 | Decision counter duplicated header/footer | Low | **Fixed v4.18.0** |
| OBS-15 | Modules vs Principles not self-explanatory | Medium | Open |
| OBS-16 | No cross-navigation between badges and views | High | Open |
| OBS-17 | Module abstraction level inconsistent | Medium | Open |
| OBS-18 | Mixed IG-XX vs IG-SYNTH-XX ID conventions | High | Open |
| OBS-19 | Convergence bar misleading for 1/1 | Low | **Fixed v4.18.0** (amber bar) |
| OBS-20 | Ref paths long and unreadable | Low | **Fixed v4.18.0** (chips) |
| OBS-21 | Category pills truncated | Low | **Fixed v4.18.0** |
| OBS-22 | Folder icons rotate instead of open/closed | Low | **Fixed v4.18.0** |
| OBS-23 | Binary files (PDF/DOCX/PPTX) lack preview | Medium | Open |
| OBS-24 | Pass C injects "No es fuente" header | Medium | **Fixed v4.21.0** (was source content, not injection — T28 PASS) |
| OBS-25 | Pass A corrupts metadata block | Medium | **Fixed v4.21.0** (T27 PASS) |
| OBS-26 | No UI for preprocessing review + glossary | High | Open — architecture vision |
| OBS-27 | QA needs automated file watcher | Low | Open |
| OBS-28 | Structured execution logging needed | High | Open — architecture vision |
| OBS-29 | No STT correction loop | High | Open — architecture vision |
| OBS-30 | Tip: declare actual participants in frontmatter | Low | Open |
| OBS-31 | Rich participant metadata for attribution | Medium | Open |
| OBS-32 | No way to challenge VERIFIED insight | High | Open — architecture vision |
| OBS-33 | No warning when decisions invalidate conflicts | High | Open |
| OBS-34 | Insight reject/approve needs reason note | Medium | Open |
| OBS-35 | Evidence Gaps badge discrepancy (4 vs 8) | Low | **Fixed v4.18.0** |
| OBS-36 | Research Brief duplicate heading | Low | **Fixed v4.18.0** |
| OBS-37 | Search dropdown clips titles | Medium | **Fixed v4.18.0** |
| OBS-38 | Research Brief refs not visually clickable | Medium | **Fixed v4.18.0** |
| OBS-39 | Playwright snapshots consume context tokens | Medium | Open — use Sonnet subagent |
| OBS-40 | Convergence bar semantics unclear | Medium | Open |
| OBS-41 | Insight ref chips show folder paths | Low | Open |
| OBS-42 | File type badge not monospaced | Low | Open |
| OBS-43 | Preview header — show extraction status instead | Medium | Open |
| OBS-44 | Badge styling inconsistent across components | Medium | Open |
| OBS-45 | Folder file count not monospaced | Low | Open |
| OBS-46 | "Decisions pending" footer not actionable | Medium | Open |
| OBS-47 | System Map module cards — unclear hierarchy | Medium | Open |
| OBS-48 | Open Questions buried in System Map | Medium | Open |
| OBS-49 | /analyze agent miscounted insights (BL-47 violation) | Medium | Open |
| OBS-50 | Mixed IG-XX convention persists in incremental /analyze | Medium | Open (BL-67) |
| OBS-51 | T28 false positive — editorial in source, not Pass C | Low | Noted |
| OBS-52 | Pass C zero-delta on Touchpoint (134KB) | Low | Needs investigation |
| OBS-53 | Server restart required after engine merge | Medium | Noted — QA process |
| OBS-54 | `/ship` has no output dependency graph | Medium | Open — architecture |
| OBS-55 | Multi-output `/ship` should use subagents | Medium | Open — architecture |
| OBS-56 | MEMORY.md duplicate PRESENTATION entry | Medium | Noted — session protocol |
| OBS-57 | Fabricated timestamps in MEMORY.md | High | Noted — session protocol |
| OBS-58 | MEMORY at 79L without proactive compaction | Medium | Noted — session protocol |
| OBS-59 | BENCHMARK_UX exceeds 8-15 referent limit, no web verification | Medium | Noted — skill compliance |
| OBS-60 | REPORT.md missing from MEMORY entries | Medium | Noted — session protocol |
| OBS-61 | Etapa 2 roadmap duplicated in STRATEGY + AUDIT, prescriptive overreach | High | Noted — output architecture |
| OBS-62 | `/analyze` dropped design-framework claims → `/ship` bypassed KB to compensate (fabricated citation) | High | **Fixed v4.22.0** (BL-91: design-framework category + express deprecation) |
| OBS-63 | Orphan insights — re-extraction leaves insights without valid claim trail | High | → BL-94 (Referential Integrity) |
| OBS-64 | Cross-category dedup collapse — design-framework claims collapsed against user-need insights on same topic | High | **Fixed v4.23.0** (cross-category dedup protection) |
| OBS-65 | No `Grounded in:` traceability — design-framework insights don't declare which insights justify them | High | **Fixed v4.23.0** (`Grounded in:` field mandatory) |
| OBS-66 | Field notes as missing practice — transcripts capture discussion, not decisions; no onboarding guidance | Medium | **Fixed v4.23.0** (source onboarding in _README.md) |
| OBS-67 | INTERNAL-only insights marked VERIFIED — IG-16/17 from field notes show VERIFIED despite skill rule requiring primary corroboration | Medium | Open — skill compliance gap |
| OBS-68 | `/analyze` convergence update screen is abstract — user can't make informed decisions in terminal (single-source vs multi-source distinction not visible, options require background knowledge) | Medium | Open — → BL-92 (app action candidate) |
| OBS-24 | Pass C "No es fuente" editorial injection | Medium | **Fixed v4.21.0** |
| OBS-25 | Pass A metadata corruption | Medium | **Fixed v4.21.0** |
| OBS-30 | Participant frontmatter priority | Low | **Fixed v4.21.0** (absorbed BL-68) |
| OBS-31 | Rich participant metadata | Medium | **Fixed v4.21.0** (absorbed BL-68) |
