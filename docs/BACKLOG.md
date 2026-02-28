# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

> Ordered by priority (P1 → P2 → P3 → P4), then by effort (S → M → L → XL) within each tier.

### [BL-102] Showcase — MDX Presentation System (Astro Submodule)

**Status:** PROPOSED
**Priority:** P2
**Effort:** L (v1 only — see phasing below)
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

#### v1 — Single Deck Migration (Effort: L) ← THIS BL

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

**v1 acceptance criteria:**
- [ ] pd-showcase repo with Astro 5 + MDX, 7 components listed above
- [ ] 35 slides from index.html migrated to individual .mdx files
- [ ] `theme_spec.css` with tokens extracted from existing styles.css (visual parity with current presentation)
- [ ] `/showcase --init` creates submodule + content structure from PROJECT.md
- [ ] `/showcase [deck]` edit mode works (read + edit specific .mdx files)
- [ ] `npm run dev` renders presentation with working navigation + slide counter
- [ ] Editing a slide costs <1,000 tokens (vs ~63,000 today)

#### v2 — Multi-Deck + Generation (Effort: M, deferred)

- Multi-deck support (directory-based, per-deck config in `deck.config.ts`)
- `/showcase --generate [deck]` — auto-generate slides from Work layer data (STRATEGIC_VISION, PROPOSALS, INSIGHTS_GRAPH)
- Additional pattern components for variant presentations (interna, v2_boceto slide types)
- PRESENTATION.md as seed for `--generate`

#### v3 — Themes + Traceability + Export (Effort: M, deferred)

- `/showcase --theme` — auto-generate project theme from STRATEGIC_VISION + BENCHMARK_UX context
- `<InsightRef>` component with build-time data from INSIGHTS_GRAPH_INDEX (depends on BL-101)
- Presenter mode (speaker notes route)
- Print CSS for PDF export
- Mermaid diagram embedding via remark plugin

**Relationship to /ship:** `/ship presentation` → PRESENTATION.md (markdown). `/showcase --generate` (v2) → MDX slides (visual). They coexist.

**User story:**
> As a UX consultant preparing a client presentation, I can edit slide content in a 2 KB MDX file — seeing hot-reload in my browser — instead of navigating a 253 KB HTML monolith. Each slide traces to verified insights.

**Full plan:** `docs/PLAN_TOKEN_OPTIMIZATION_AND_SHOWCASE.md`

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
4. LLM integration: ties into BL-80 (BYOK or platform credits)
5. Deployment: single Node.js app (Express + React, already exists) behind reverse proxy
6. Billing: usage-based (LLM tokens) or flat subscription

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

**Status:** Proposed
**Priority:** P3
**Origin:** QA v7, OBS-10. 1200+ claims fully expanded is inutilizable. User feedback: "extractions está buenísimo" but needs navigability.

**Problem:** All claims shown expanded. Scrolling through 54 source sections with 1200+ claims is impractical.

**Solution:** Show first 3-5 claims per source collapsed, with "Show N more" expand button. Source header always visible with file name + claim count.

**Acceptance criteria:**
- [ ] Claims collapsed by default (3-5 visible per source)
- [ ] "Show N more" button expands full list
- [ ] Source headers always visible with claim count

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

**Status:** Proposed
**Priority:** P4
**Origin:** QA v7, OBS-41/42/43/44/45. Multiple minor styling inconsistencies across the Live Research App: badge fonts not uniformly mono, count chips inconsistent between views, category headers use different weight/size conventions.

**Problem:** Each component was built independently; styling conventions drifted. Not a functional bug, but creates a "homemade" feel that undermines credibility during stakeholder demos.

**Solution:** Audit all badge/chip/count/header components and unify:
- All badges: `var(--font-mono)`, consistent padding/border-radius
- Count chips: same size/color across Sidebar, headers, and cards
- Category headers: consistent `text-transform`, `font-weight`, `letter-spacing`
- Create shared CSS custom properties for common patterns

**Acceptance criteria:**
- [ ] All badges use `var(--font-mono)` consistently
- [ ] Count chips uniform across views
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

**Status:** PHASE 0 COMPLETE (Wave 1, v4.25.1–v4.25.2) · PHASE 1 PROPOSED (SDK migration)
**Priority:** P1
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
- [ ] `agent-runtime.js` replaced by SDK `query()` call via service abstractions
- [ ] All 3 skills (/extract, /analyze, /spec) execute identically in app and CLI
- [ ] `canUseTool` callback renders interaction UI (confirmations, selections, text input) in browser
- [ ] Context compaction handled by SDK (no manual trimming)
- [ ] Scripts execute via `Bash` tool (no whitelist needed)
- [ ] BL-101 index system works in app without compatibility workarounds
- [ ] `WorkspaceService`, `SessionStore`, `ExecutionQueue`, `KeyVault` interfaces defined (simple implementations)

**Risk:** SDK requires Node.js server-side process with filesystem access. Current deployment is localhost (fine). Remote deployment (Wave 3, BL-83) needs sandboxed containers (E2B, Modal, Fly). This is a Phase 3 concern, not a blocker for Phase 1.

#### Phase 2 — Model Routing + Cost Control (Effort: L, deferred)

**Problem:** $1.37 per pipeline operation (observed in pds--timining). As SaaS, cost per operation defines business model viability.

**Solution:** Route tasks by complexity to appropriate models:
- **Haiku** — classification, counting, simple script decisions (cheap, fast)
- **Sonnet** — extraction, Q&A, standard analysis (balanced)
- **Opus** — synthesis, conflict resolution, strategic vision (expensive, highest quality)

The SDK's `model` option is per-query. The orchestrator decides which model based on skill/task type.

**Also addresses:**
- Cost estimation before execution ("this /analyze run will cost ~$0.40")
- Usage tracking per session (SDK returns `input_tokens` + `output_tokens`)
- Foundation for pricing tiers (operations/month, model access level)

**Depends on:** Phase 1 (SDK migration)

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

**🔀 Strategic fork: SaaS standalone vs MCP App (evaluate before Phase 3)**

Two distribution models for PD-Spec, not mutually exclusive:

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

**This doesn't change Phases 1-2.** The Agent SDK migration and model routing are correct regardless of distribution model. The fork matters at Phase 3: build your own multi-tenant infra (Route A) vs package as MCP server (Route B) vs both (Route A+B).

**Risk assessment for Route B:**
- MCP Apps is 2 months old (Jan 2026). Protocol may not gain host adoption (Claude, ChatGPT, VS Code need to support it well).
- Complex multi-step workflows (waves, QA loops, 35-slide presentations) may not fit well inside a chat-embedded iframe — dedicated apps may always be superior for dense UX.
- Counter-argument: the target is NOT power users. The pitch is accessibility — "open ChatGPT, say 'research my market', PD-Spec appears as interactive experience without the user knowing what an MCP server is." That's lower friction than signing up for pd-spec.app.
- **Mitigation: don't bet, observe.** Phases 1-2 are route-agnostic. Before Phase 3, evaluate: (1) which hosts adopted MCP Apps, (2) what UX quality is achievable in embedded iframes, (3) whether competitors shipped MCP-based research tools. Decide with data, not intuition.

**Decision point:** Evaluate before committing to Phase 3 infrastructure. By then, MCP Apps maturity and host adoption will be clearer.

**Evidence:**
- Nico: *"La única paja que tiene este sistema todavía es que no puedes hacer ninguna acción real acá"*
- Hugo: *"Le metería un LLM, eso sí"*
- Session 2026-02-27: App Runtime Compatibility Gap discovered — `read_file` has no offset/limit, `generate-index.sh` not whitelisted, 2000-char context trimming
- Session 2026-02-28: Claude Agent SDK analysis confirms it provides ALL capabilities missing in custom runtime
- Session 2026-02-28: MCP Apps analysis — protocol enables interactive UI returned from MCP tools, hosted in any compatible client

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
