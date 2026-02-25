# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

> Ordered by priority (P1 → P2 → P3 → P4), then by effort (S → M → L → XL) within each tier.

### [BL-90] Navigation History Stack — Back Navigation + View State Preservation

**Status:** Proposed
**Priority:** P1
**Origin:** QA v7, BUG-13. Cross-navigation (BL-58) is broken in practice — users can follow a badge but can't return.

**Problem:** The app uses a single `useState('dashboard')` for navigation. Every `setView()` unmounts the current view, destroying all component-local state (selected file, folder collapse state, preview, scroll position). No `pushState()` — browser back exits the app. Users navigating from Outputs preview → Insights are stranded.

**Solution (two layers):**

1. **View history stack** — `app.jsx` maintains `viewHistory: [{ view, context }]`. Each `navigateTo()` pushes to stack. Browser back (`popstate`) or a Back button pops the stack and restores view + context. `history.pushState()` on each navigation so browser back works.

2. **State preservation** — Lift FileBrowser state (`selectedFile`, `collapsedFolders`) to App level so it survives unmount/remount. Pass as props + callbacks. Same pattern for InsightsView filters, ConflictsView filters, etc.

**Acceptance criteria:**
- [ ] Browser back button navigates to previous in-app view (not out of app)
- [ ] Returning to Outputs after badge click restores: selected file, folder state, preview, scroll position
- [ ] Works for all cross-nav paths (Outputs→Insights, Extractions→Insights, SystemMap→Insights, etc.)
- [ ] No URL fragments leak (app remains single-page)

**User story:**
> As a researcher reviewing PERSONAS.md in Outputs, I can click an [IG-XX] badge to check the insight details, then press browser back to return exactly where I was — same file selected, same scroll position.

---

### [BL-80] LLM Integration in Live Research App — Interactive Actions from Dashboard

**Status:** Proposed
**Priority:** P1
**Origin:** Hugo sync (2026-02-23). Evidenced daily pain: "flujo roto" where users copy prompts from app to Claude terminal.

**Problem:** The Live Research App displays insights, conflicts, and system map, but all actions (approve insight, resolve conflict, ask questions) require leaving the browser and pasting prompts into Claude Code terminal. This is the largest gap between the current MVP and a product usable by non-technical third parties.

**Solution:** Embed an LLM API in the Live Research App backend. Actions in the UI (approve, reject, challenge, ask) trigger server-side LLM calls that modify Work layer files directly.

**Architecture:**
1. BYOK model: user provides their own API key (Claude, Gemini, GPT) via settings UI
2. `/api/llm/action` endpoint: receives action type + context, calls LLM, writes to Work files
3. WebSocket broadcasts file changes → UI updates in real-time (existing infrastructure)
4. Alternatively: platform-provided tokens with usage billing

**Scope:**
- Phase 1: Text input → LLM response (Q&A about project state)
- Phase 2: Structured actions (approve insight, resolve conflict, add field note)
- Phase 3: Skill execution from UI (run /extract, /analyze from browser)

**Evidence:**
- Nico: *"La única paja que tiene este sistema todavía es que no puedes hacer ninguna acción real acá"*
- Nico: *"Todas esas se traducen en generar un prompt... ese flujo está mapeado como flujo roto"*
- Hugo: *"Le metería un LLM, eso sí"*
- Hugo offered to create API key and contribute credits for testing

**Acceptance criteria:**
- [ ] Settings UI for API key input (BYOK)
- [ ] At least one provider working (Claude API recommended)
- [ ] Q&A mode: user asks question about project → LLM answers using Work layer context
- [ ] Action mode: approve/reject insight from UI → INSIGHTS_GRAPH.md updated
- [ ] WebSocket broadcasts changes after LLM action

**User story:**
> As a researcher reviewing insights in the Live Research App, I can click "Approve" on an insight and have it marked as VERIFIED in INSIGHTS_GRAPH.md without leaving the browser or opening a terminal.

---

### [BL-67] Consistent Insight ID Convention in /analyze

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7, OBS-18. TIMining has mixed `IG-SYNTH-XX` and `IG-XX` IDs from different /analyze runs. Confuses users and breaks cross-referencing.

**Problem:** /analyze doesn't detect existing ID conventions. Each run can introduce a different naming pattern. Mixed IDs in the same project make the System Map references inconsistent.

**Solution:** /analyze detects existing ID prefix in INSIGHTS_GRAPH.md and continues the series. If `IG-SYNTH-01` exists, new insights get `IG-SYNTH-22`, not `IG-01`.

**Acceptance criteria:**
- [ ] /analyze scans existing IDs before creating new ones
- [ ] New IDs continue the existing series (prefix + next number)
- [ ] No mixed conventions in a single project

---

### [BL-57] Moved Source Detection — Hash-Based Path Reconciliation in /extract

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7 (2026-02-23). TIMining: Touchpoint file moved from `sesiones-idemax/` to `Touchpoint 1/` after extraction. SOURCE_MAP retained old path → file appeared as "untracked" despite being fully extracted with 134KB normalized transcript in `_temp/`.

**Problem:** When a user moves or renames source files after `/extract`, SOURCE_MAP becomes stale. The file shows as untracked (new) and its extractions/insights lose traceability. Re-extracting wastes tokens on already-processed content.

**Solution:** In `/extract`, before processing untracked files:
1. Compute hash for each untracked file
2. Cross-reference against existing SOURCE_MAP hashes
3. If hash matches an entry with a different path → **moved file** → propose path update
4. Update SOURCE_MAP path, EXTRACTIONS.md source header, and `_temp/*_normalized.md` filename
5. Present to user: "Touchpoint_TIMining... moved from sesiones-idemax/ to Touchpoint 1/. Update path?"

**Acceptance criteria:**
- [ ] Moved files detected by hash match before extraction begins
- [ ] User approves path updates (propose-before-execute)
- [ ] SOURCE_MAP, EXTRACTIONS.md, and _temp/ normalized files updated consistently
- [ ] No re-extraction needed for moved files (tokens saved)

**User story:**
> As a researcher reorganizing my source folders, I can move files freely and `/extract` detects the move and updates paths, without losing my existing extractions.

---

### [BL-87] Interactive Insight Actions — Challenge, Reject with Reason, Stale Conflict Warning

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7, OBS-32/33/34/46. No way to challenge a VERIFIED insight, reject with a reason note, or detect when a conflict becomes stale after an insight decision.

**Problem:** The pipeline only flows forward (sources → claims → insights). Field discoveries that contradict VERIFIED insights require a full pipeline round-trip. Reject actions lose context (no reason stored). Stale conflicts silently persist.

**Solution:**
1. "Challenge" button on VERIFIED insights → creates a new conflict entry with counter-evidence
2. Reject action includes optional reason note → stored in INSIGHTS_GRAPH.md
3. App detects when insight status changes make existing conflicts stale → banner warning

**Acceptance criteria:**
- [ ] Challenge action creates a conflict entry linked to the insight
- [ ] Reject includes optional reason note persisted in INSIGHTS_GRAPH.md
- [ ] Stale conflict detection and visual warning
- [ ] All actions follow propose-before-execute

**User story:**
> As a researcher reviewing insights after a new round of interviews, I can challenge a previously VERIFIED insight directly from the app, without manually editing Work layer files.

---

### [BL-88] `/ship all` + `/ship update` — Output Dependency Graph & Batch Generation

**Status:** Proposed
**Priority:** P2
**Origin:** TIMining IDEAS.md (`/ship update`, "Pending changes" vista) + QA v7 OBS-54, OBS-55. Second use case confirmed by QA observation.

**Problem:** When a user requests all 10 `/ship` types, the agent reasons ad-hoc about generation order. Some outputs depend on others (User Stories references Personas, Strategy references Audit), but `/ship` has no concept of inter-output dependencies. Results:
- **OBS-54:** Agent improvised dependency order — correct but not codified.
- **OBS-55:** Sequential generation in one session risks context compaction. Output #9 has degraded quality vs. Output #1 because the agent has accumulated 8 large documents in context.
- **IDEAS.md `/ship update`:** After /synthesis, no way to detect which existing outputs are stale vs. current. Manual scan required.
- **IDEAS.md "Pending changes":** The gap between "what the knowledge base knows" and "what outputs reflect" is invisible.

**Solution:** Three capabilities:

1. **Dependency graph** — Codified in `/ship` SKILL.md:
   ```
   Layer 1 (parallel):  PERSONAS, LEAN_CANVAS
   Layer 2 (parallel):  JOURNEY_MAP, USER_STORIES, BENCHMARK_UX
   Layer 3 (sequential): REPORT → AUDIT → STRATEGY → PRESENTATION
   ```
   Each layer reads from disk (not from prior context). Layer N waits for Layer N-1 to complete.

2. **`/ship all`** — Generate all output types in dependency order using subagents:
   - Coordinator launches subagents per layer (parallel within layer, sequential between layers)
   - Each subagent starts with fresh context → output quality is uniform
   - Coordinator verifies all outputs generated and logs to MEMORY

3. **`/ship update`** — Detect stale outputs and sync:
   - Scan `03_Outputs/` for existing files
   - Diff each output's `[IG-XX]` refs against current INSIGHTS_GRAPH + SYSTEM_MAP
   - Report debt: "PRD.md missing IG-03, IG-08 · PERSONAS.md up to date"
   - Update stale outputs with user approval (propose-before-execute)

**Evidence from TIMining:**
- 9 outputs generated via subagents in ~24 min (coordinator + 3 parallel layers). Quality uniform.
- After /synthesis (7 new insights, 2 resolved conflicts), PRD.md required 12 manual edits. `/ship update` would have detected and proposed them automatically.
- "Pending changes" plan (`_temp/PLAN_cambios-touchpoint-2026-02-19.md`) is exactly the artifact `/ship update` should generate.

**Acceptance criteria:**
- [ ] Dependency graph codified in SKILL.md
- [ ] `/ship all` generates all types in dependency order using subagents
- [ ] Each subagent starts with fresh context (no accumulated documents)
- [ ] `/ship update` scans existing outputs and reports stale refs
- [ ] `/ship update` proposes specific edits for user approval
- [ ] Coordinator logs all outputs to MEMORY (no OBS-60 missing entries)

**User story:**
> As a researcher who just completed /synthesis with 7 new insights, I can run `/ship update` and see which outputs need refreshing, then approve the updates — instead of manually checking each document for missing refs.

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

### [BL-92] Script-First Skill Decomposition — Replace LLM Skills with Code Where Possible

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7 session + Granola transcripts (Feb 22, Feb 24). User observation: "cada vez más siento que ese paso es un script más que un skill." Follow-up: "Al principio mi intuición fue generar agentes, porque es lo más rápido, es lo más fácil de hacer al principio tal vez. Pero ahora me doy cuenta que podrían haber incluso agentes completos que podrían ser sólo un script."

**Problem:** Several pipeline steps currently run as LLM agent skills (expensive, slow, non-deterministic) when they could be implemented as deterministic code with direct UI actions. The user runs `/resolve` and waits for an agent to process each conflict — when the same action could be a button click in the Live Research App that writes directly to files.

**Specific skills flagged for review (Feb 24 observation):** `/visualize`, `/kickoff`, `/seed`, `/reset` — possibly unused or convertible to scripts. Need usage audit before deciding.

**Analysis needed:** For each skill/phase, determine what percentage is:
- **Mechanical** (counting, status changes, file writes, dedup by exact match) → script/API
- **Semantic** (understanding claims, detecting contradictions, writing narratives) → LLM required
- **Interactive** (user decisions, approval loops) → app UI

**Candidates for decomposition:**

| Skill/Phase | Mechanical | Semantic | Interactive | Candidate? |
|---|---|---|---|---|
| `/resolve` — status changes (PENDING→VERIFIED) | 90% | 0% | 10% (user clicks) | High — app button |
| `/resolve` — SYSTEM_MAP update | 20% | 70% | 10% | Low — needs LLM |
| `/analyze` Phase 2 — dedup check | 60% | 40% | 0% | Medium — hybrid |
| `/analyze` Phase 3 — synthesis | 10% | 80% | 10% | Low — needs LLM |
| `/extract` — file discovery + delta | 95% | 0% | 5% | High — script |
| `/extract` — claim extraction | 10% | 85% | 5% | Low — needs LLM |
| `/ship` — all types | 5% | 90% | 5% | Low — needs LLM |

**Vision:** The app becomes the primary interface for mechanical operations. Click to verify an insight, click to resolve a conflict, click to flag for research. File writes happen via Express API endpoints. LLM skills are reserved for operations that genuinely require semantic understanding (claim extraction, narrative synthesis, deliverable generation).

**Acceptance criteria:**
- [ ] Audit of all skills with mechanical/semantic/interactive percentages
- [ ] At least one "High" candidate converted to app action (e.g., insight verification button)
- [ ] API endpoints for direct file mutations (verify insight, resolve conflict, flag for research)
- [ ] Skills updated to skip steps that are now handled by app actions

**User story:**
> As a researcher reviewing insights in the Live Research App, I can click "Verify" on an insight and it immediately updates INSIGHTS_GRAPH.md — no need to run `/resolve` or wait for an agent.

---

### [BL-93] Insight Lifecycle — Temporal Freshness, Supersession, and Human Curation

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7 session + Granola transcript (Feb 24). Observation: in a multi-touchpoint project (TIMining, 10-week engagement), early insights become less relevant as the project evolves. PD-Spec has no mechanism to detect, signal, or manage this.

**User framing (Feb 24):** "El insight es un organismo vivo que puede existir... yo no lo eliminaría, pero podrían dejar de ser algo que pese, de ser algo que mueva la aguja." / "Poder ir como apagándolos, no eliminándolos, como poniéndolos en freeze." / "¿Por qué no borrarlos? Porque está bien que haya una trazabilidad." The "freeze" metaphor coined here maps to the DEPRIORITIZED status in Layer 4.

**On human curation (Feb 24):** "Hay un stakeholder que está remando por otro lado y luego post of the record fuera de la reunión, él mismo se contradice" — illustrates a case where a researcher rejects an insight not because of explicit contradiction in the data, but because of context that lives outside the sources. Human override is the correct mechanism here, not automated conflict detection.

**Problem:** Insights are atemporal. An `[IG-SYNTH-01]` verified in Week 1 has the same visual weight as one verified in Week 5. Three types of obsolescence go undetected:
1. **Decay by irrelevance** — nobody contradicts it, but project decisions no longer depend on it
2. **Supersession** — a newer, more specific insight replaces it (not contradiction — evolution)
3. **Human deprioritization** — the researcher knows this insight is valid but not a needle-mover right now

(Type 0, explicit contradiction, is already handled by `/analyze` conflict detection.)

**Solution — 4 layers, incremental:**

**Layer 1: Temporal metadata (mechanical, scripteable)**
- Calculate `last_evidence_date` per insight (most recent source file date)
- Calculate `age_in_sessions` (how many extract/analyze cycles since last convergence bump)
- Auto-flag `⚠️ STALE` when `age_in_sessions > N` without new convergence
- App shows freshness indicator per insight: 🟢 fresh / 🟡 aging / 🔴 stale
- 100% mechanical — parser + app feature, no LLM

**Layer 2: Supersession detection (semantic, LLM in /analyze)**
- During `/analyze` Phase 2, when a new insight is created, scan existing insights for subsumption (not just dedup)
- "Operators need alerts" superseded by "Operators need alerts with D→A→R and estimated impact time"
- Mark old insight `SUPERSEDED → [IG-XX new]` (like MERGED but with temporal direction)
- Old insight kept as historical evidence, new one becomes the active reference
- Moderate effort — extends existing dedup step in `/analyze`

**Layer 3: Relevance scoring (hybrid, app dashboard)**
- Composite score: Convergence (existing) × Freshness (layer 1) × Active references (grep of `[IG-XX]` in SYSTEM_MAP + outputs) × Supersession (layer 2)
- Simple semaphore, not false-precision numbers
- App shows relevance ranking — stale unreferenced insights at bottom, fresh high-convergence referenced insights at top

**Layer 4: Human curation with cascade protection (app action + script)**
- User marks insight as `DEPRIORITIZED` via app action (BL-92 style — button click, not skill)
- Before executing, system calculates cascade impact (100% mechanical — grep `[IG-XX]` across all files):
  - Depth: Design Principle > Module > Implication > detail
  - Breadth: count of outputs referencing this insight
  - Dependents: other insights citing it as convergence source
- Warning proportional to impact:
  - LOW (≤2 references): proceed silently
  - MEDIUM (3-5 references): show orphaned refs, ask to confirm
  - HIGH (design principle, 5+ refs, or strategic vision element): show full cascade tree, require explicit confirmation
- System obeys the human decision. PD-Spec is a copilot, not an autonomous car.
- DEPRIORITIZED is not INVALIDATED — the insight is valid, just not a current needle-mover. It can be re-prioritized later.

**What this does NOT do:**
- Auto-expire insights (STALE is a visual flag, not a status change)
- Delete anything (history is valuable — superseded insights show how understanding evolved)
- Use fake precision ("relevance: 7.3/10") — semaphore only

**Implementation order:**
1. Layer 1 first (lowest effort, highest immediate value — parser + app)
2. Layer 4 next (app action button, cascade calculation is mechanical)
3. Layer 2 (extends /analyze, moderate effort)
4. Layer 3 (dashboard integration, needs layers 1+2 data)

**Acceptance criteria:**
- [ ] Insights show freshness indicator in app (layer 1)
- [ ] `/analyze` detects and marks superseded insights (layer 2)
- [ ] App shows relevance ranking with sortable view (layer 3)
- [ ] "Deprioritize" button in app with cascade warning (layer 4)
- [ ] DEPRIORITIZED status supported in INSIGHTS_GRAPH.md
- [ ] Cascade calculation covers SYSTEM_MAP + all outputs + dependent insights

**User story:**
> As a researcher 6 weeks into a project, I can see which insights from Week 1 are still actively driving design decisions and which have been superseded by newer evidence — so I can confidently tell stakeholders "our understanding evolved from X to Y" instead of presenting stale conclusions.

---

### [BL-95] Design Proposals — The Missing Layer Between Insights and Outputs

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7 session. While investigating why design pillars didn't enter the knowledge base (OBS-62), discovered a structural gap: there's no entity type for design decisions that bridge understanding (insights) to deliverables (outputs).

**Problem — the architecture jump:**

The current pipeline jumps from understanding to deliverables:

```
Sources → Claims → Insights → ??? → Outputs
```

`/ship` must make the leap from "here are 20 verified insights" to "here's a coherent PRD." Design decisions (pillars, principles, patterns, module definitions) are made implicitly during `/ship` or in freemode — never tracked, never traceable, never reusable.

**New entity: Design Proposal `[DP-XX]`**

| Layer | Entity | Example | Source |
|---|---|---|---|
| Evidence | Claim | "users want the system to only show what's critical" | Source file |
| Understanding | Insight `[IG-XX]` | IG-SYNTH-07: Exception Management | `/analyze` (multiple claims consolidated) |
| **Decision** | **Proposal `[DP-XX]`** | **DP-01: Quiet UI — absorb visual complexity** | **New skill or user** |
| Deliverable | Output | PRD, Personas, etc. | `/ship` |

**Anatomy of a `[DP-XX]`:**
- **Name** — short label (e.g., "Quiet UI")
- **Definition** — what it means and what it covers
- **Grounded in:** `[IG-XX], [IG-XX]` — insight references that justify it (Homer's Car gate: no grounding = challenge it)
- **Status:** `PROPOSED` → `APPROVED` → `REJECTED`
- **Origin:** `agent` (skill-proposed) or `user` (manually proposed)
- **Type:** `principle` | `pattern` | `module` | `strategy` (TBD)

**Two creation flows:**

1. **Agent-proposed (the designer behind the curtain):** A new skill analyzes verified insights, detects patterns, and proposes design decisions. The agent acts as a junior-to-mid designer — experienced designers may find the proposals basic, but for founders, PMs, or junior designers without design training, this is gold: better a grounded proposal than no design direction at all. User approves, modifies, or rejects each proposal.

2. **User-proposed:** "I have an idea for pillar #5, connected to IG-SYNTH-99 and IG-38." The system validates grounding — do those insights exist? Are they VERIFIED? Do they support the proposal? If grounding checks pass, the proposal is elevated. If not, system flags gaps.

**Where it lives:** New file `02_Work/PROPOSALS.md` (or evolution of SYSTEM_MAP.md — TBD). Tracked entities with `[DP-XX]` IDs, same pattern as `[IG-XX]` and `[CF-XX]`.

**Impact on pipeline:**
- `/analyze` — no change (stays at insight level)
- **New skill** (`/design`? `/propose`? TBD) — reads insights, proposes `[DP-XX]` entries
- `/ship` — references `[DP-XX]` instead of making ad-hoc design decisions. PRD sections trace to proposals, proposals trace to insights, insights trace to claims.
- App — new view for proposals (approve/reject/modify buttons, BL-92 aligned)

**Full traceability chain:**
```
Source → Claim → [IG-XX] Insight → [DP-XX] Proposal → Output section
                    ↑ grounding          ↑ user approval
```

**Acceptance criteria:**
- [ ] `[DP-XX]` entity format defined (fields, statuses, ID scheme)
- [ ] Storage location decided (new file vs SYSTEM_MAP evolution)
- [ ] New skill creates proposals from verified insights
- [ ] User can propose `[DP-XX]` with insight refs, system validates grounding
- [ ] `/ship` references `[DP-XX]` for design decisions, not ad-hoc
- [ ] App shows Proposals view with approve/reject/modify actions
- [ ] Homer's Car gate: proposal without `Grounded in:` refs is flagged

**User stories:**
> As a startup founder with no design background, I can run the design skill and get grounded design proposals (pillars, patterns, principles) derived from my user research — so I have a coherent design direction even without hiring a senior designer.

> As an experienced designer, I can propose my own design decisions, link them to verified insights, and have the system validate that my proposals are evidence-grounded — so my design rationale is traceable and defensible to stakeholders.

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

### [BL-59] Convergence Indicator Redesign

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7, OBS-40 + OBS-19. The progress bar visual contradicts reality: 1/1 = full bar (looks strong, is weakest), 3/54 = nearly empty (looks weak, is reasonable).

**Problem:** Convergence bar semantics are unclear. No user can tell what "good" looks like without explanation. The denominator (total project sources) makes every insight look poorly evidenced.

**Solution:** Replace progress bar with a clearer indicator. Options:
- Text-only: "3 sources" with color scale (1=amber, 2-3=neutral, 4+=green)
- Fixed-scale bar: denominator = 5 (not total sources). 3/5 looks reasonable.
- Chip list: show source count + authority breakdown inline

**Acceptance criteria:**
- [ ] Visual communicates evidence strength intuitively (more sources = better, visually)
- [ ] Single-source insights clearly flagged as weak
- [ ] No misleading "full bar" for 1/1

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

### [BL-84] Nested Subfolders in File Browser — Recursive Tree with Max Depth

**Status:** Proposed
**Priority:** P3
**Origin:** Hugo sync (2026-02-23). Observation during TIMining demo: projects with organized source structures (e.g., `sesiones-idemax/round-1/`, `Touchpoint 1/fotos/`) show subfolder paths as flat strings in the file tree instead of a navigable nested tree.

**Problem:** The FileBrowser component groups files by their `folder` string (e.g., `"entrevistas/round-1"`), rendering each unique path as a single collapsible row. There is no visual nesting — `entrevistas/round-1` and `entrevistas/round-2` appear as two independent top-level folders, not as children of `entrevistas`. This breaks the mental model of a file explorer and makes deep folder structures hard to navigate.

**Current behavior:**
```
▾ 📁 entrevistas/round-1    (3)
    file-01.md
    file-02.md
▾ 📁 entrevistas/round-2    (2)
    file-03.md
▾ 📁 workshop/fotos         (5)
    whiteboard-1.png
```

**Expected behavior:**
```
▾ 📁 entrevistas            (5)
  ▾ 📁 round-1              (3)
      file-01.md
      file-02.md
  ▸ 📁 round-2              (2)
▾ 📁 workshop               (5)
  ▸ 📁 fotos                (5)
```

**Solution:**
1. **Frontend (FileBrowser.jsx):** Build a recursive tree structure from the flat `folder` strings. Split each `folder` by `/` and construct nested nodes. Render with indentation per level.
2. **Max depth:** Define a configurable max nesting depth (recommended: 3 levels). Folders beyond max depth collapse into a flat string for the remaining segments.
3. **Aggregated counts:** Parent folders show total file count across all descendants.
4. **Collapse state:** Each tree node independently collapsible. Root folders expanded by default, deeper levels collapsed.
5. **No API changes needed:** The `scanDir` functions already return full relative paths. Tree building is purely a frontend concern.

**Acceptance criteria:**
- [ ] Subfolders render as nested, indented tree nodes (not flat strings)
- [ ] Max depth defined (default: 3 levels)
- [ ] Parent folders show aggregated file count
- [ ] Each folder node independently collapsible
- [ ] Works for Sources, Work, and Outputs views
- [ ] No API changes required

**User story:**
> As a researcher browsing a project with organized source folders (by milestone, by category), I can navigate nested subfolders visually, just like a desktop file explorer, instead of seeing flattened path strings.

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

### [BL-73] System Map — Module vs Principles Clarity

**Status:** Proposed
**Priority:** P4
**Origin:** QA v7, OBS-15 + OBS-17. "Modules" and "Design Principles" not self-explanatory. Module abstraction levels inconsistent (subsystem vs capability vs feature).

**Solution:** Add brief intro under each section header explaining what it represents. Consider allowing hierarchy levels in modules. Partly a /synthesis skill issue (what granularity to target), partly UI.

**Acceptance criteria:**
- [ ] Each section has a one-line description
- [ ] Module abstraction level documented or enforced by /synthesis

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

### [BL-94] Referential Integrity — Orphan Insight Detection

**Status:** IMPLEMENTED (partial) — v4.24.0, 2026-02-24
**Priority:** P1
**Origin:** QA v7 session + Granola transcript (Feb 24). Discovered while analyzing the OBS-24/25 preprocessing bug chain: insights created from corrupted extractions survive re-extraction and become untraceable. Expanded scope: the same problem applies when a source is *intentionally* deleted or reclassified.

**Three source operations (Feb 24):**
- **Add** — easy. New source → re-extract → re-analyze. No existing insights affected.
- **Reclassify** — moderate. Source moves folder → context changes → some claims may be reinterpreted. Existing insights keep their refs but may need review.
- **Delete** — complex. "Hay un insight que tenía su génesis en varios archivos y ahora le quito una fuente, ya pierde validez, pierde tal vez sólo un contador de un source. Pero en otros casos podría ser que el insight completo queda invalidado." The system needs to calculate the impact of source removal on each insight before allowing deletion.

**Problem:**

When a source is re-extracted (after a bug fix, preprocessing correction, or manual edit), EXTRACTIONS.md is rewritten but INSIGHTS_GRAPH.md is not. Insights that were created from the old (potentially corrupted) claims remain in the graph with their `Ref:` pointing to the original source file — but the intermediate claim they were born from no longer exists or has changed semantically.

These **ghost insights** (IG fantasma) violate Mandate #1 (No Hallucination): an insight that cannot trace back to a current, valid claim is an unverified assertion. The system has no mechanism to detect or flag this.

**Failure chain:**
```
Source (corrupt) → /extract → Claim (corrupt) → /analyze → IG-XX created
       ↓ fix + re-extract
Source (fixed)   → /extract → Claim (fixed)   → EXTRACTIONS.md updated
                                                  IG-XX still exists, references stale/gone claim
```

**Solution — Integrity check (mechanical, scriptable):**

1. For each `[IG-XX]` in INSIGHTS_GRAPH.md:
   - Read `Ref:` field (source file path)
   - Read `Key quote:` text
   - Search EXTRACTIONS.md for matching section (by source file)
   - Search within that section for a claim that semantically matches the key quote
2. Classification:
   - **Valid** — matching claim found in current EXTRACTIONS.md
   - **Orphan** — source section exists but no matching claim (claim was removed or changed)
   - **Missing source** — source section doesn't exist in EXTRACTIONS.md (file was never re-extracted)
3. Report orphans to user for review. Never auto-delete — the insight may still be valid, it just needs re-grounding.

**Where it runs:**
- `/audit` — natural fit as a quality gate check ("3 orphan insights detected — review before /ship")
- `/analyze --full` — pre-flight check before processing ("Found 2 orphan insights from previous extractions — flag for review?")
- Standalone script — `scripts/integrity-check.sh` for CI or manual runs

**Implementation (BL-92 aligned — mostly mechanical):**

| Step | Type | Tool |
|---|---|---|
| Parse IG refs + quotes from INSIGHTS_GRAPH.md | Mechanical | grep/script |
| Parse claim sections from EXTRACTIONS.md | Mechanical | grep/script |
| Match IG source refs → extraction sections | Mechanical | script |
| Semantic match: key quote ↔ current claim text | Hybrid | LLM for fuzzy, exact substring for 80% |
| Report + user decision | Interactive | terminal or app UI |

**Acceptance criteria:**
- [ ] Integrity check detects orphaned insights after re-extraction
- [ ] Report shows: IG ID, original ref, key quote, reason (orphan/missing source)
- [ ] No auto-deletion — user decides per insight (keep, invalidate, re-ground)
- [ ] Integrated into `/audit` output
- [ ] Works as standalone script for CI

**User story:**
> As a researcher who just fixed a preprocessing bug and re-extracted 3 sources, I can run an integrity check and immediately see which existing insights lost their evidence trail — so I can review them instead of unknowingly building deliverables on ghost data.

---

### [BL-97] Re-Processing Safety — Protect Consolidated Projects from Destructive Re-Extraction

**Status:** IMPLEMENTED (partial) — v4.24.0, 2026-02-24
**Priority:** P1
**Origin:** Granola transcript (Feb 24). User identified that a full re-extract on a mature project is a high-risk operation with no safeguards today.

**Problem:** On a fresh project, `/extract --full` is harmless. On a consolidated project (PRD shipped, personas approved, pillars defined), the same command can silently invalidate the evidence trail for dozens of VERIFIED insights — without any warning.

**User framing (Feb 24):** "Si yo voy y reproceso todo, hago una especie de reset del extract, voy a generar un conflicto... voy a reemplazar los claims. ¿Cómo puede el sistema sobrevivir estos cambios? Me imagino que podemos poner stoppers." / "Estoy pensando como un branch donde tú dices, OK, mira, este proyecto está hasta acá, y voy a hacer como una versión alternativa de este proyecto."

**Risk matrix:**

| Operation | Risk level | Current safeguard |
|---|---|---|
| `/extract --file` (single file) | Low | None needed |
| `/extract` incremental (new files only) | Low | SOURCE_MAP delta |
| `/extract --full` on fresh project | Low | None needed |
| `/extract --full` on consolidated project | **HIGH** | **None** |
| Delete a source file | **HIGH** | **None** |
| Reclassify a source to different folder | Medium | None |

**Solution — project maturity gate:**

Before any destructive operation (`--full` re-extract, source deletion), system checks:
1. Count VERIFIED insights → if > threshold (e.g., 10), flag as "consolidated project"
2. Calculate impact: how many VERIFIED insights reference the affected source(s)?
3. Show warning proportional to impact (same cascade model as BL-93 Layer 4)
4. Offer safe alternatives: `--file` for surgical re-extraction, branch for experimental re-processing

**Branch alternative (git worktree pattern):** User can create an experimental branch to re-process with a new source set — cherry-picking VERIFIED insights from the original. The main branch stays intact. This is the git worktree model the engine already uses for projects — same principle applied within a project.

**Acceptance criteria:**
- [ ] `/extract --full` on project with >10 VERIFIED insights shows impact warning
- [ ] Source deletion shows impacted insight count before proceeding
- [ ] User can proceed with full acknowledgment — system warns, doesn't block
- [ ] Documentation: recommended workflow for "fresh start within a consolidated project"

**User story:**
> As a researcher 8 weeks into a project, when I try to re-extract everything from scratch, the system shows me "this will affect 23 VERIFIED insights" and suggests running `/extract --file` on just the new sources instead — so I don't accidentally destroy weeks of verified knowledge.

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

**Status:** PARKED — Needs architecture design
**Priority:** P2 (high value, high effort)
**Origin:** QA v7, OBS-32 + OBS-33 + OBS-34. No way to challenge a VERIFIED insight from the app. No warning when decisions invalidate conflicts. No reason notes on approve/reject.

**Problem:** Pipeline flows forward only (sources → claims → insights). No efficient backward flow (new evidence → challenge → re-evaluate). Field notes require full pipeline round-trip for a single correction.

**Vision:**
1. "Challenge" action on any insight → creates conflict with counter-evidence
2. App detects when insight decisions make conflicts stale → banner warning
3. Approve/reject includes optional reason note → stored in INSIGHTS_GRAPH.md + included in /synthesis prompt

**Depends on:** Clearer understanding of how Actions → /synthesis flow works in practice across projects.

---

### [BL-15] Visual & Interaction Polish — HTML Template Upgrade

**Status:** PARKED
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

## ✅ Implemented (Archive)

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
