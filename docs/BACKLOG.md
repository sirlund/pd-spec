# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

> Ordered by priority: P2 → P3 → Low → PARKED.

### [BL-56] Export Functionality — Multi-Format Deliverable Export

**Status:** Proposed
**Priority:** P2
**Origin:** BL-33 Phase 1 (deferred). Evidence: TIMining `html2pptx.py` proof-of-concept (34 slides, editable PPTX).

**Problem:** Deliverables are HTML-only. Stakeholders need DOCX for editing, PPTX for presentations, PDF for distribution. Currently requires manual copy-paste or ad-hoc scripts.

**Solution:** `[Export ▾]` dropdown in Live Research App per output file: MD→DOCX (pandoc), HTML→PPTX (python-pptx), HTML→PDF (print CSS / weasyprint). Script-based, not LLM-based.

**Evidence from TIMining:**

| | Python `html2pptx.py` | Node `dom-to-pptx` (experiment branch) |
|---|---|---|
| **Approach** | Parse HTML with BeautifulSoup → reconstruct in PPTX | Render in headless Chrome → capture DOM → export |
| **Fidelity** | ~80% (reconstructs layout) | ~95% (captures actual render) |
| **Editability** | High (text, shapes, tables editable) | Low (slides as images) |
| **Dependencies** | `beautifulsoup4` + `python-pptx` | `playwright` + `dom-to-pptx` + local fonts |
| **Complexity** | High (1,200 lines, hardcoded for TIMining) | Medium (~250 lines, generic) |
| **Generalizable** | Needs refactoring | Works on any HTML out of the box |

Recommendation: Python approach (editable > screenshots) but needs generalization to parse PD-Spec template conventions (cards, badges, tables) instead of hardcoded slide types.

**Acceptance criteria:**
- [ ] Export dropdown in Live Research App for output files
- [ ] At least one format working (PPTX recommended — highest stakeholder demand)
- [ ] Script-based conversion (no LLM tokens)
- [ ] Generic parser (PD-Spec template conventions, not hardcoded per output type)

**User story:**
> As a consultant presenting to a client, I can export the PRD or presentation from the Live Research App to an editable PPTX with one click, without copy-pasting or running ad-hoc scripts.

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

### [BL-58] Cross-Navigation — Clickable [IG-XX] / [CF-XX] Badges Everywhere

**Status:** IMPLEMENTED (v4.20.0, 2026-02-23)
**Priority:** P2
**Origin:** QA v7, OBS-16. Core value proposition of PD-Spec is traceability. The data chain exists (System Map → Insight → Claims → Source) but is not navigable in the UI.

**Problem:** `[IG-SYNTH-07]` badge in System Map is not clickable. Insights view doesn't link to specific claims in Extractions. No "referenced by" reverse links. Traceability chain is invisible in the UI.

**Solution:**
1. All `[IG-XX]` and `[CF-XX]` badges clickable across all views → navigate to detail view
2. Add "Referenced by" section in insight detail (which System Map modules cite it)
3. Claims in Extractions linkable from insight evidence trail

**Acceptance criteria:**
- [ ] Badges in System Map, Research Brief, and Extractions navigate to detail views
- [ ] Insight detail shows which modules reference it
- [ ] Works across all rendered markdown content

**User story:**
> As a researcher reviewing the System Map, I can click any [IG-XX] badge to see its full evidence chain — sources, claims, convergence — without manually searching.

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

### [BL-68] Pass A/C Preprocessing Bugs — Metadata Corruption + Editorial Injection

**Status:** Proposed
**Priority:** P2
**Origin:** QA v7, OBS-24 + OBS-25. Two bugs in /extract preprocessing:

**Bug 1 (OBS-25):** Pass A applies speaker normalization regex to the entire file including metadata block. Result: title, date, attendees all get `[SPEAKER: ...]` prefix.
**Bug 2 (OBS-24):** Pass C injects editorial comment "No es fuente para /extract" into normalized file header. Risk: agent re-reading file may self-skip.

**Solution:**
1. Pass A: detect `Transcript:` boundary, only apply speaker substitution below it
2. Pass C: normalize content only — no editorial comments. Descriptive metadata belongs in `_CONTEXT.md`

**Acceptance criteria:**
- [ ] Pass A preserves metadata block above `Transcript:` unchanged
- [ ] Pass C output contains no editorial commentary
- [ ] Normalized files contain only normalized content + speaker labels

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

### [BL-71] Global Search — Extractions, System Map, Sources

**Status:** IMPLEMENTED (v4.20.0, 2026-02-23)
**Priority:** P4
**Origin:** QA v7, OBS-11. Search only covers insights + conflicts. Extractions, sources, system map not searchable.

**Solution:** Extend search to query all data types. Results grouped by type (insight, conflict, claim, source, module). Maintain current simple UX.

**Acceptance criteria:**
- [ ] Search returns results from all views
- [ ] Results grouped by type with clear labels

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

### [BL-73] System Map — Module vs Principles Clarity

**Status:** Proposed
**Priority:** P4
**Origin:** QA v7, OBS-15 + OBS-17. "Modules" and "Design Principles" not self-explanatory. Module abstraction levels inconsistent (subsystem vs capability vs feature).

**Solution:** Add brief intro under each section header explaining what it represents. Consider allowing hierarchy levels in modules. Partly a /synthesis skill issue (what granularity to target), partly UI.

**Acceptance criteria:**
- [ ] Each section has a one-line description
- [ ] Module abstraction level documented or enforced by /synthesis

---

### [BL-74] Binary File Preview — PDF + Office Thumbnails

**Status:** IMPLEMENTED (v4.20.0, 2026-02-23) — PDF only; Office thumbnails deferred.
**Priority:** P4
**Origin:** QA v7, OBS-23. PDF/DOCX/PPTX show no preview — only "Open with System App" button.

**Solution:** PDF via `<iframe>` (browser-native). PPTX/DOCX via embedded thumbnail extraction (`docProps/thumbnail.jpeg` inside ZIP). Fallback: file metadata + format icon.

**Acceptance criteria:**
- [ ] PDF renders first page in preview pane
- [ ] Office files show embedded thumbnail if available
- [ ] Graceful fallback for files without thumbnail

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

### [BL-76] Structured Execution Logging

**Status:** Proposed
**Priority:** P4
**Origin:** QA v7, OBS-28. No machine-readable log of agent execution (files read, written, decisions, timing). MEMORY.md is narrative, not parseable.

**Solution:** JSONL or markdown table at `02_Work/_temp/EXECUTION_LOG.md`. Each skill emits entries: timestamp, phase, action, target, duration. Future: Activity view in Live App consuming WS events.

**Acceptance criteria:**
- [ ] Skills emit structured log entries
- [ ] Log format parseable (JSONL or structured markdown)

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

### [BL-79] Markdown-First Outputs — /ship Generates .md, HTML/DOCX Become Export Formats

**Status:** IMPLEMENTED (v4.20.0, 2026-02-23)
**Priority:** P1
**Origin:** Architecture review (2026-02-23). Evidence: TIMining project exposed JSON+HTML complexity (BL-56 export dependency, template maintenance burden, schema validation overhead).

**Problem:** Current /ship pipeline is overengineered. Agent generates JSON matching a schema, injects it into HTML template with inlined CSS/JS. This is: complex to maintain (10 templates, 9 schemas, inlining step), fragile (JSON structure errors break rendering), not human-editable (JSON inside HTML), and redundant — the Live Research App already renders Markdown beautifully via `parsers/markdown.js`.

**Solution:** `/ship` generates `.md` files in `03_Outputs/` (e.g., `PRD.md`, `PERSONAS.md`). The Live Research App renders them with existing MarkdownView + markdown parser. `[IG-XX]` refs automatically become clickable badges. Tables, blockquotes, headings, badges — all already styled in `.md-content` CSS.

**Benefits:**
- Agent writes Markdown (natural) instead of JSON (unnatural) — fewer tokens, fewer errors
- Human-editable in any text editor, renders in GitHub, VS Code, the app
- Eliminates template inlining step and JSON schema validation overhead
- Files are smaller, diffable, mergeable
- Absorbs BL-56 partially: Markdown → DOCX trivial via pandoc

**What changes:**
1. `/ship` SKILL.md — rewrite: generate structured Markdown, not JSON
2. `03_Outputs/` — default files become `.md` instead of `.html`
3. `_templates/` and `_schemas/` — demoted from primary to export-only (kept for future `/export`)
4. CLAUDE.md — Sources of Truth table updated

**What stays:**
- All `[IG-XX]` traceability (Markdown refs work identically)
- Document versioning (heading convention: `> vX.Y | date | snapshot`)
- Propose-before-execute workflow
- All 10 output types

**Risk:** Presentation (Reveal.js) may need special handling — could use `---` slide separators or stay as HTML export.

**Acceptance criteria:**
- [ ] `/ship prd` generates `PRD.md` (not `PRD.html`)
- [ ] PRD.md renders in Live Research App with styled headings, tables, badges
- [ ] `[IG-XX]` refs in PRD.md are clickable → navigate to Insights view
- [ ] All 10 output types generate Markdown
- [ ] Existing HTML templates preserved for future `/export` command

**User story:**
> As a researcher, I can `/ship prd` and get a human-readable Markdown document that renders beautifully in the app, is editable in any text editor, and has all insight references automatically clickable.

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

Last updated: 2026-02-22 (v4.17.0)
