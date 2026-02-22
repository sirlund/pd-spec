# CLAUDE.md — AI Agent Protocol

## Project Settings → PROJECT.md

Project-specific configuration (name, language, one-liner) lives in `PROJECT.md` at repo root.
This keeps `CLAUDE.md` as clean engine config that never conflicts during PD-Spec updates.

**Language rule:** All Work layer content (`02_Work/`) and Output deliverables (`03_Outputs/`) must be written in `output_language` (defined in `PROJECT.md`). System identifiers (`[IG-XX]`, `[CF-XX]`, `VERIFIED`, `PENDING`, `RESOLVED`, `INVALIDATED`, `MERGED`) and skill instructions always remain in English regardless of this setting.

## The Truth Stack

This project follows the PD-Spec 3-layer architecture. The AI agent operates within these layers and must respect their rules at all times.

```
01_Sources/  →  Raw input (read-only)
02_Work/     →  Knowledge base (insights, conflicts, system map)
03_Outputs/  →  Deliverables (derived from Work, never authored directly)
```

## Agent Mandates

### 1. No Hallucination
If a claim does not trace back to a file in `01_Sources/`, the insight **does not exist**. Never invent insights, user needs, or technical constraints. Every `[IG-XX]` entry must reference a real source file. When the agent detects an evidence gap, it must ask: *"I can't find evidence for X — should we mark it as an assumption or should I suggest how to validate it?"*

### 2. Transparency & Control
No black boxes. The agent **proposes before executing** — every insight extraction, conflict resolution, or deliverable generation is presented as a draft for user approval before writing to files. The user has final veto over any reclassification, edit, or structural change.

### 3. Homer's Car Detector
Flag unnecessary complexity and customization. If a module, feature, or design decision cannot justify itself with `[IG-XX]` references, challenge its existence. Prefer the simplest solution that satisfies verified insights.

### 4. Proactive Gap Detection
When the agent detects missing definitions, untested assumptions, or sparse source coverage, it should suggest methodologies to fill the gap (e.g., interview scripts, synthetic users, benchmarks) — as **open options**, never impositions. The user decides whether and how to pursue them.

### 5. Source Organization Validation
The agent validates whether a source file's content matches its folder context. If a benchmark appears inside an interviews folder, or a file's metadata conflicts with its location, the agent flags the inconsistency and requests user confirmation before moving or reclassifying.

### 6. Uncertainty Management
When facing ambiguity, the agent presents clear options with their reasoning (e.g., "Option A based on business insight [IG-03]", "Option B based on user research [IG-07]") and asks questions to align on direction. Never silently pick one interpretation.

### 7. Silence is Gold
Minimize cognitive load in all outputs. No filler paragraphs, no restating the obvious, no decorative content. Every sentence in a deliverable must earn its place.

## Source Organization

Sources in `01_Sources/` are organized in subfolders by milestone or category to inherit temporal and thematic context:

```
01_Sources/
├── 2026-02-workshop-gerencia/
│   ├── notas-sesion.md
│   └── foto-whiteboard.png
├── benchmark-inicial/
│   └── competidores.md
├── entrevistas-operadores/
│   ├── entrevista-01.md
│   └── entrevista-02.md
└── _SOURCE_TEMPLATE.md
```

The folder name provides context that individual files inherit. The agent validates coherence between folder context and file content.

**Non-markdown files** (images, PDFs, spreadsheets, .txt, .docx) can't carry internal metadata. Add a `_CONTEXT.md` in the folder to describe them — see `_CONTEXT_TEMPLATE.md` for the format.

## Skills Pipeline

| Skill | Command | What it does |
|---|---|---|
| Kickoff | `/kickoff` | Project setup wizard — name, language, one-liner |
| Extract | `/extract [folder]` | Read sources, extract raw claims to 02_Work/EXTRACTIONS.md |
| Analyze | `/analyze` | Process extractions into insights, detect conflicts. Requires `/extract` first. |
| Synthesis | `/synthesis` | Resolve conflicts, update system map |
| Ship | `/ship [type]` | Generate deliverables (prd, presentation, report, benchmark-ux, persona, journey-map, lean-canvas, user-stories, audit, strategy) |
| Audit | `/audit` | Quality gate — evaluates Work layer readiness before /ship |
| Visualize | `/visualize [target]` | Generate Mermaid diagrams (system-map, insights, conflicts, all) |
| Reset | `/reset [--work\|--output]` | Reset generated layers to empty template state. Preserves sources and engine. |
| Seed | `/seed [domain] [--level]` | Generate synthetic sources for testing and onboarding. Includes deliberate contradictions. |
| View | `/view` | Start the Live Research App — local web viewer for Work layer data |

## Maturity Levels

| Level | Sources Available | Agent Behavior |
|---|---|---|
| **Seed** | Initial brief only | Basic definitions, skeleton PRD, many open questions |
| **Validation** | Brief + interviews/quant data | Cross-referencing active, conflicts surfacing |
| **Ecosystem** | Multiple source types | Full contradiction detection, rich system map |

## Sources of Truth

| File | Role | Editable? |
|---|---|---|
| `PROJECT.md` | Project settings (name, language, one-liner) + current state | Yes (via `/kickoff` or manual) |
| `01_Sources/*` | Raw inputs | No (read-only after capture) |
| `02_Work/SOURCE_MAP.md` | Per-file extraction state (hash, status, timestamp) | Yes (via `/extract`, auto-maintained) |
| `02_Work/EXTRACTIONS.md` | Raw claims from sources | Yes (via `/extract`) |
| `02_Work/INSIGHTS_GRAPH.md` | Atomic verified insights | Yes (via `/analyze`) |
| `02_Work/SYSTEM_MAP.md` | Product logic & decisions | Yes (via `/synthesis`) |
| `02_Work/CONFLICTS.md` | Contradiction log | Yes (via `/analyze` and `/synthesis`) |
| `02_Work/RESEARCH_BRIEF.md` | Stakeholder narrative summary | Yes (via `/analyze`) |
| `02_Work/IDEAS.md` | Ideas & bugs captured during project work | Yes (manual, project branches only) |
| `02_Work/MEMORY.md` | Session log & state tracker (compacted at 80 lines) | Yes (via all skills) |
| `02_Work/_temp/SESSION_CHECKPOINT.md` | Session state & compaction recovery (all sessions) | Yes (ephemeral, auto-managed) |
| `02_Work/_assets/_INTAKE.md` | Asset intake log | Yes (via freemode protocol) |
| `03_Outputs/_custom/*` | Non-pipeline deliverables | Yes (via freemode protocol) |
| `03_Outputs/_templates/*` | Static HTML templates (Template+JSON) | No (engine files) |
| `03_Outputs/_schemas/*` | JSON Schema definitions for output data | No (engine files) |
| `03_Outputs/PRD.html` | Product Requirements Document | Yes (via `/ship`) |
| `03_Outputs/PERSONAS.html` | User persona cards | Yes (via `/ship persona`) |
| `03_Outputs/JOURNEY_MAP.html` | User journey map | Yes (via `/ship journey-map`) |
| `03_Outputs/LEAN_CANVAS.html` | Lean Canvas (business model) | Yes (via `/ship lean-canvas`) |
| `03_Outputs/USER_STORIES.html` | JTBD user stories | Yes (via `/ship user-stories`) |
| `docs/CHANGELOG.md` | Internal change log | Yes (append-only) |
| `docs/DECISIONS.md` | Cross-cutting architectural decisions (DEC-##) | Yes (append, consult before new patterns) |
| `docs/FRAMEWORK.md` | Methodology reference | Reference only |
| `docs/qa/*` | QA plans and findings | Reference only |

## Folder Structure

```
├── .claude/skills/
│   ├── kickoff/SKILL.md       /kickoff — project setup wizard
│   ├── extract/SKILL.md      /extract — read sources, extract raw claims
│   ├── analyze/SKILL.md       /analyze — process extractions into insights
│   ├── synthesis/SKILL.md     /synthesis — resolve conflicts
│   ├── ship/SKILL.md          /ship — generate deliverables (10 output types)
│   ├── visualize/SKILL.md    /visualize — generate diagrams
│   ├── reset/SKILL.md        /reset — reset generated layers
│   ├── seed/SKILL.md         /seed — generate synthetic sources
│   ├── audit/SKILL.md        /audit — quality gate before /ship
│   └── view/SKILL.md         /view — start Live Research App
├── app/                       Live Research App (local web viewer)
│   ├── server/                Express server + parsers + WebSocket
│   └── client/                React SPA (Vite build)
├── 01_Sources/                Raw inputs (read-only, organized by milestone/category)
│   ├── _SOURCE_TEMPLATE.md   Metadata template for markdown sources
│   ├── _CONTEXT_TEMPLATE.md  Metadata template for non-markdown files
│   └── _README.md            Onboarding guide for users
├── 02_Work/                   Knowledge base (agent-managed, do not edit manually)
│   ├── SOURCE_MAP.md           Per-file extraction state (hash, status, timestamp)
│   ├── EXTRACTIONS.md          Raw claims from sources (input for /analyze)
│   ├── INSIGHTS_GRAPH.md      [IG-XX] atomic insights
│   ├── SYSTEM_MAP.md          Product architecture decisions
│   ├── CONFLICTS.md           [CF-XX] contradiction log
│   ├── IDEAS.md               Ideas & bugs from project work (→ BACKLOG on main)
│   ├── MEMORY.md              Session log & state tracker
│   ├── _temp/                 Ephemeral workspace (checkpoints, indexes, conversions)
│   ├── _assets/               External materials intake (not knowledge sources)
│   │   └── _INTAKE.md         Asset log (filename, origin, date, purpose)
│   └── _README.md            Layer rules for users
├── 03_Outputs/                Deliverables (agent-managed, do not edit manually)
│   ├── _templates/            Static HTML templates (Template+JSON architecture)
│   │   ├── _base.css          Shared CSS (Inter font, A4 page system, badges, print)
│   │   ├── _base.js           Shared JS (JSON loader, section renderers, ref-link converter)
│   │   ├── prd.html           PRD template
│   │   ├── report.html        Report template
│   │   ├── presentation.html  Reveal.js presentation template
│   │   ├── benchmark-ux.html   Benchmark UX template
│   │   ├── persona.html       Persona cards template
│   │   ├── journey-map.html   Journey map template
│   │   ├── lean-canvas.html   Lean Canvas template
│   │   ├── user-stories.html  User stories template
│   │   └── status.html        Dashboard template
│   ├── _schemas/              JSON Schema definitions for output data
│   │   ├── base.schema.json   Shared definitions (meta, sections, refs)
│   │   ├── prd.schema.json    PRD data schema
│   │   ├── report.schema.json Report data schema
│   │   ├── benchmark-ux.schema.json Benchmark UX data schema
│   │   ├── persona.schema.json Persona data schema
│   │   ├── journey-map.schema.json Journey map data schema
│   │   ├── lean-canvas.schema.json Lean Canvas data schema
│   │   ├── user-stories.schema.json User stories data schema
│   │   └── status.schema.json Status dashboard data schema
│   ├── PRD.html               Product Requirements Document (template + embedded JSON)
│   ├── PERSONAS.html          User persona cards (template + embedded JSON)
│   ├── _custom/               Non-pipeline deliverables (freemode outputs)
│   └── _README.md            Layer rules for users
├── docs/
│   ├── BACKLOG.md             Future work proposals
│   ├── CHANGELOG.md           Internal change log (PD-Spec development)
│   ├── DECISIONS.md           Cross-cutting architectural decisions (DEC-## format)
│   ├── FRAMEWORK.md           Full methodology documentation
│   ├── PD_BUILD_NOTES.md     PD-Build architecture & design notes
│   └── qa/                    QA plans and findings (formalized process)
│       └── README.md          QA process, naming conventions, templates
├── .gitattributes             Merge strategy (protects project files)
├── PROJECT.md                 Project settings + current state
├── CLAUDE.md                  This file
└── README.md                  Project overview
```

## Workspace & Worktrees

PD-Spec uses git worktrees to run multiple projects simultaneously from a single repository. All worktrees live under `~/Dev/repos/`.

### Directory Naming Convention

| Directory | Branch | Purpose |
|---|---|---|
| `pd-spec/` | `main` | Engine development (the main repo) |
| `pd-spec--qa/` | `qa` | Quality assurance worktree |
| `pds--{name}/` | `project/{name}` | Project worktrees (e.g. `pds--lcorp/` → `project/lcorp`) |

### Creating a New Project Worktree

```bash
cd ~/Dev/repos/pd-spec
git worktree add ../pds--{name} -b project/{name}
```

Then run `/kickoff` in the new worktree to set up `PROJECT.md`.

### Rules

- Never move or rename worktree directories — git tracks their absolute paths.
- Each project worktree gets its own `PROJECT.md` (name, language, one-liner, current state).
- Engine files (`CLAUDE.md`, skills, templates, schemas) are shared across all worktrees via git.
- To list all active worktrees: `git worktree list` from any worktree.

### Engine Files Are Read-Only in Project Branches

**Never edit engine files in a project branch.** If a skill or template needs a fix, make the change in `main` and merge into the project. This prevents merge conflicts and ensures all projects run the same engine.

Engine files (do NOT edit in project branches):
- `CLAUDE.md`, `README.md`
- `.claude/skills/*/SKILL.md`
- `03_Outputs/_templates/*`, `03_Outputs/_schemas/*`
- `docs/BACKLOG.md`, `docs/CHANGELOG.md`, `docs/FRAMEWORK.md`

Project files (only exist in project branches):
- `PROJECT.md` (settings + current state)
- `01_Sources/*`, `02_Work/*`, `03_Outputs/*.html`

### Merging Engine Updates into a Project

```bash
cd ~/Dev/repos/pds--{name}
git merge main -m "engine update to vX.Y"
```

`.gitattributes` protects project-specific files (`PROJECT.md`, `01_Sources/`, `02_Work/`, generated outputs) using `merge=ours` — they keep the branch version automatically.

**First-time setup** (once per clone, before first merge):

```bash
git config merge.ours.driver true
```

This registers the `ours` merge driver so `.gitattributes` rules work. Without it, git ignores the `merge=ours` directives.

## Engine Development Workflow

### Versioning

PD-Spec follows SemVer (`MAJOR.MINOR.PATCH`):

| Bump | When | Example |
|---|---|---|
| **MAJOR** | Architecture overhaul, breaking changes | v3→v4 |
| **MINOR** | BL implementation, new feature | v4.6→v4.7 |
| **PATCH** | Skill instruction tweak, typo, cosmetic fix | v4.6.0→v4.6.1 |

Source of truth: `engine_version` in `PROJECT.md` (template on main) + `docs/CHANGELOG.md` headers. Bundle related BLs into one MINOR bump per session.

### Commit Convention

Format: `type: BL-## — description`

| Type | Version bump? | Use for |
|---|---|---|
| `feat` | Yes (MINOR/MAJOR) | New feature, BL implementation |
| `fix` | Yes (PATCH) | Bug fix |
| `docs` | No | Documentation, release bookkeeping |
| `chore` | No | Tooling, config, cleanup |

All agent commits include `Co-Authored-By: Claude <model> <noreply@anthropic.com>` footer.

### Release Checklist

After `feat`/`fix` commits, wrap up the session with a single `docs` commit:

1. `docs/BACKLOG.md` — mark BL item(s) as IMPLEMENTED with version and date
2. `docs/CHANGELOG.md` — add version entry (highlights-first format, see Documentation Guidelines)
3. `PROJECT.md` template — bump `engine_version`
4. Commit all three together: `docs: release vX.Y.Z — [summary]`

The `feat:`/`fix:` commits carry code changes; the `docs: release` commit carries the bookkeeping.

### Idea Flow: Project → Main

Ideas and bugs discovered during project work stay in the project branch — never edit engine files there.

**In project branches:**
- Capture ideas in `02_Work/IDEAS.md` (protected by `merge=ours`)
- Format: `### [IDEA] or [BUG] — title` + context + proposed fix

**On main (engine development):**
- Read ideas cross-worktree: `Read ~/Dev/repos/pds--{name}/02_Work/IDEAS.md`
- **Validate each idea** (Homer's Car gate) before creating a BL item:
  - Does it solve a real, evidenced problem? (not a preference from one project)
  - Is it already covered by an existing BL? → absorb as evidence, don't duplicate
  - Would a second project benefit? If unclear → **PARK** (stays in IDEAS.md)
- Formalize validated ideas as BL items in `docs/BACKLOG.md`
- Mark every idea in the project's IDEAS.md with its result:
  - `→ BL-##` (formalized), `→ BL-## (absorbed)` (added as evidence to existing), or `PARKED` (waiting for second use case)
- **Cross-project pattern detection:** scan all project worktrees (`Glob ~/Dev/repos/pds--*/02_Work/IDEAS.md`) for similar PARKED ideas. If the same idea appears in 2+ projects → passes the "second use case" test → promote to BL.

No git merge needed for idea flow — just filesystem reads across worktrees.

## Session Protocol

### Session Start (Recovery)

At the start of every session (new conversation), the agent recovers state with minimal reads:

1. **Read `02_Work/_temp/SESSION_CHECKPOINT.md`** (~2K tokens, single read).
   - If the checkpoint exists and its Quantitative Snapshot is **fresh** (counts match a quick header scan of INSIGHTS_GRAPH.md and CONFLICTS.md) → resume immediately from checkpoint context. No further reads needed.
   - If the checkpoint is **stale** (snapshot counts diverge from actual file headers) or **absent** → read `02_Work/MEMORY.md` (compacted, ~2K tokens) and rebuild context from there.
2. **Integrity check** — only performed when checkpoint snapshot counts diverge from actual file headers. Compare counts of insights, conflicts, and system map entries. Report discrepancies to the user before proceeding.
3. **Resume context** — use checkpoint (preferred) or MEMORY to continue where the last session left off, without requiring the user to re-explain.

### After Every Skill Execution

The agent performs two writes:

1. **Append to `02_Work/MEMORY.md`** — request, actions, result, and a state snapshot. **Timestamp format must be ISO: `YYYY-MM-DDTHH:MM`** (e.g., `2026-02-14T15:30`). No other formats.
2. **Overwrite `02_Work/_temp/SESSION_CHECKPOINT.md`** — full checkpoint with updated Quantitative Snapshot reflecting current state.

**Ad-hoc state changes** — MEMORY logging is not limited to formal skill runs. Any action that modifies Work layer files must be logged (insight status changes, manual edits, direct injection, batch operations). The checkpoint must also be updated.

### MEMORY Compaction

When `02_Work/MEMORY.md` exceeds 80 lines, the agent compacts it:

1. Summarize all entries except the 3 most recent into a `## Historical Summary` section at the top.
2. Keep the 3 most recent entries in full detail below the summary.
3. The compacted file must stay under 80 lines.

This ensures MEMORY.md remains a fast fallback read (~2K tokens) when the checkpoint is unavailable.

### Post-Compaction Behavior

If context compaction occurs mid-operation, the agent re-reads `02_Work/_temp/SESSION_CHECKPOINT.md` (not MEMORY.md) to recover state. The checkpoint is the primary recovery mechanism; MEMORY.md is the fallback.

## Freemode Protocol

Work outside the standard pipeline (custom deliverables, iterative HTML, ad-hoc analysis) follows these rules to preserve efficiency and traceability.

### Work-First Routing

Before reading raw sources, the agent checks `02_Work/` for existing knowledge:
- Reference insights by `[IG-XX]` rather than re-reading the source files that produced them.
- When the user's request maps to a pipeline output type, suggest `/ship [type]` before building from scratch.
- For requests that genuinely require non-pipeline work, proceed with freemode but log actions in `02_Work/MEMORY.md`.

### Session Checkpoint

The agent maintains `02_Work/_temp/SESSION_CHECKPOINT.md` — a compact state file (150 lines max) that serves as the **primary recovery mechanism** for all sessions (pipeline and freemode):
- **What:** Project context, quantitative snapshot (sources, extractions, insights, conflicts, outputs, last skill), session goals, key decisions made, files modified, pending work.
- **When:** Overwritten after every skill execution or significant milestone. Re-read immediately after context compaction.
- **Lifecycle:** Ephemeral — overwritten after every skill. Deleted at the start of each new session if no longer relevant.

### Cost Awareness

- **Write immediately** — don't accumulate large outputs in conversation; write to file as soon as a section is ready.
- **Warn before large reads** — if a source file exceeds 20KB, warn the user and suggest targeted reads (offset/limit) or reference existing extractions.
- **Asset intake** — external materials (logos, brand guides, competitor screenshots) that are not knowledge sources go in `02_Work/_assets/`, logged in `_INTAKE.md`. The `/extract` skill ignores `_assets/` (it only scans `01_Sources/`).
- **Custom outputs** — non-pipeline deliverables go in `03_Outputs/_custom/`. The agent proposes a file organization before the first write. `/reset --output` does NOT delete `_custom/`.

### Artifact Normalization

External tools (Gemini, ChatGPT, Figma exports) often produce monolithic files — single HTML with inline CSS/JS and all content. These are expensive for agent iteration: full reads for small edits, O(n) changes for O(1) operations (e.g., renumbering 23 slides to change a counter).

- **Detection** — when the user places a file >30KB with multiple sections in `02_Work/_assets/`, the agent flags it as a normalization candidate during intake.
- **Propose before splitting** — the agent presents a split plan (section files + shared CSS/JS + index loader) for user approval before modifying anything.
- **Target granularity** — individual section files should be 2-5KB (one slide, one chapter, one card). Enough for a single targeted read/edit.
- **Dynamic counters** — navigation and counters (e.g., `Slide 3 / 23`) must use JS, not hardcoded values in each section file. Renumbering = change one variable, not edit every file.
- **Visual parity** — the normalized output must render identically to the original in the browser. If it doesn't, the normalization failed.
- **Structure** — index file goes in `03_Outputs/_custom/`, section files alongside it. The original stays in `_assets/` as reference.
- **Structural index** — the agent creates and maintains `02_Work/_temp/STRUCTURE_INDEX.md` mapping sections → files → line ranges, enabling offset/limit reads for precise edits without loading the full artifact.

## Documentation Guidelines

PD-Spec maintains multiple documentation files. Each has a specific purpose and audience:

| File | Purpose | Audience | Content Type |
|---|---|---|---|
| **CHANGELOG.md** | User-facing version history. "What's new" in each release. | PD-Spec consumers (researchers, PMs) | Feature highlights, capability announcements, breaking changes. Framed commercially ("Now you can..."). Highlights-first format with technical details in collapsible sections. |
| **BACKLOG.md** | Architectural decisions and feature planning. | PD-Spec developers (engine maintainers) | User stories, acceptance criteria, proposed fixes, implementation notes. Structured format. Can include evidence tables when needed to clarify the problem. Two sections: 🎯 Proposed (pending) + ✅ Implemented (archive with context). |
| **QA findings** (`docs/qa/QA_V*_FINDINGS.md`) | Testing evidence and raw notes. | PD-Spec developers (debugging) | Observed behavior, reproduction steps, screenshots, logs, hypotheses, ideas. Informal lab notebook format. Created during formal QA sessions. BACKLOG items reference these for detailed evidence. |
| **MEMORY.md** (`02_Work/`) | Session execution log. | AI agent (fallback resume) + user (audit trail) | Skill execution history, state snapshots, ad-hoc actions. Compacted at 80 lines (historical summary + recent entries). Timestamps in ISO format (`YYYY-MM-DDTHH:MM`). |
| **README.md** | Project overview and onboarding. | New users, contributors | What PD-Spec is, how to get started, quick examples, architecture overview. |

### Content Flow Example

When a bug is discovered during formal QA:
1. **Document in QA findings** (`QA_V2_FINDINGS.md`) — detailed evidence, screenshots, reproduction steps, raw observations
2. **Create BACKLOG item** (e.g., `BL-23`) — user story, proposed fix, priority, acceptance criteria
3. **Implement fix** — commit with reference to BACKLOG item
4. **Update CHANGELOG** — user-facing highlight of what was fixed
5. **Archive in BACKLOG** — move BL-23 to "✅ Implemented" section with summary
6. **QA findings remain** — historical record for future debugging

**Note:** Bugs discovered during iterative development (not formal QA sessions) can be documented directly in BACKLOG with necessary detail. QA findings docs are for systematic testing sessions with multiple findings.

### Writing Style

- **CHANGELOG:** Conversational, benefit-focused. "You can now extract Office files without dependencies."
- **BACKLOG:** Technical, implementation-focused. "Add Bash to allowed-tools. Fallback: textutil → zipfile."
- **QA findings:** Forensic, evidence-based. "Observed: 57 files discovered, 15 processed. Root cause: no explicit no-skip rule."
- **MEMORY.md:** Structured log format. Request → Actions → Result → Snapshot.

## Engine Development Anti-Patterns

Things that have caused real bugs. Do NOT:

| Rule | Why | Evidence |
|---|---|---|
| **Never edit engine files in project branches** | Causes merge conflicts, breaks all worktrees | Pre-v4.2 incidents |
| **Never `git add .` or `git add -A` on main** | Main must never contain 01_Sources/, 02_Work/, or generated outputs | Architecture rule |
| **Never edit files without explicit user request** | Especially during QA — observe, don't fix | User preference, QA v5 |
| **Never push ideas to BACKLOG without consolidation** | Keep a session list, validate with Homer's Car gate first | User preference |
| **Never build large JSON in-context** | >10KB JSON causes compaction loops. Use external Python/Bash scripts | QA v5 OBS-07: dashboard 31KB JSON |
| **Never let the executing agent write QA findings** | Grading own test = objectivity gap. Observer writes findings | QA v5 OBS-05 |
| **Never treat all preprocessing as one mechanical step** | Pass C (sentence repair) requires LLM reasoning, not regex | QA v5 BUG-01 |
| **Never amend after pre-commit hook failure** | The commit didn't happen — amend modifies the PREVIOUS commit | Git safety |
| **Never implement a BL without evidenced problem** | Homer's Car: if no `[IG-XX]` or QA finding justifies it, challenge it | BL-22 RAG (still unjustified) |

## Script-First Execution (90/10 Rule)

Mechanical operations (counting, JSON generation, hash computation, denominator updates) should use inline scripts, not LLM reasoning. Scripts are deterministic, faster, and token-free. The agent supervises output and intervenes manually for the 10% exceptions.

**When to script:** The operation has a deterministic input→output mapping. A regex or parser can produce the correct answer without judgment.

**When NOT to script:** The operation requires semantic understanding (e.g., Pass C sentence repair, insight categorization, conflict detection).

**Script-eligible operations:**

| Operation | Tool | Pattern |
|---|---|---|
| Count `[IG-XX]` headers | Bash | `grep -c '### \[IG-' 02_Work/INSIGHTS_GRAPH.md` |
| Count `[CF-XX]` headers | Bash | `grep -c '### \[CF-' 02_Work/CONFLICTS.md` |
| Count extraction sections | Bash | `grep -c '^## \[' 02_Work/EXTRACTIONS.md` |
| Count claims | Bash | `grep -c '^[0-9]\+\.' 02_Work/EXTRACTIONS.md` |
| MEMORY.md line count | Bash | `wc -l < 02_Work/MEMORY.md` |
| File hash (md5) | Bash | `md5 -q "path/to/file"` |
| Convergence denominator update | Bash/Python | Regex `X/N` → `X/(N+1)` across file |
| STATUS.html JSON generation | Python | Parse Work files → build JSON → inject into template |

**Validation rule:** After any script produces output, sanity-check before writing:
- Counts must be > 0 (unless the file is genuinely empty)
- JSON must parse (`python3 -c "import json; json.load(open('file'))"`)
- No data loss: output entity count ≥ input entity count

**Anti-pattern:** Never use LLM reasoning to count things, compute hashes, or generate mechanical JSON. These are the operations that caused BUG-04 (agent miscounted SYNTH insights).

## Pre-Commit Verification

Before committing engine changes, verify:

1. **Version consistency** — `engine_version` in PROJECT.md template matches latest CHANGELOG.md header
2. **BACKLOG consistency** — BL items referenced in commit message exist in BACKLOG.md. Implemented items have version and date.
3. **Skill integrity** — Changed skill files have valid YAML frontmatter (`name`, `description`, `user-invocable`, `allowed-tools`)
4. **No generated content on main** — `git status` shows no files in 01_Sources/, 02_Work/, or 03_Outputs/*.html
5. **CHANGELOG format** — New entries use highlights-first format with `<details>` for technical notes. Framed for PD-Spec consumers, not developers.

Use `/verify` to automate these checks.

## Current State → PROJECT.md

Project-specific state (maturity, insights count, conflicts count) lives in `PROJECT.md` under "Current State". This keeps CLAUDE.md as pure engine config — no merge conflicts when updating project branches from main.
