# Backlog — Future Work

Internal planning and architectural decisions. Each entry includes rationale, user stories, and implementation notes.

For user-facing changes, see [`CHANGELOG.md`](CHANGELOG.md).

---

## 🎯 Proposed (Pending Implementation)

### [BL-30] Pipeline Flow Simplification — Unified /analyze with Interactive Decisions

**Status:** Proposed
**Priority:** P0 — CRITICAL (UX blocker)
**Origin:** QA v3 testing (2026-02-16), consolidated from QA3-ARCH-01
**Related:** BL-33 (phase dashboard), QA3-UX-01 (express mode)

**Problem:**

Current pipeline has multiple friction points:
1. **Skill name collision:** `/status` conflicts with Claude Code's built-in command
2. **Missing output clarity:** `/analyze` doesn't have obvious deliverable (user must remember to run `/status` separately)
3. **Unnecessary skill separation:** `/synthesis` as separate command when it's the logical next step after `/analyze`
4. **Manual decision flow:** User approves in free-text, then must review in dashboard, generate prompt, copy/paste to run `/synthesis`

**User feedback (validated 2026-02-16):**

> "analyze deberia tener un output, no entiendo que pasa ahi entre analyze, status y sintesis"

> "analizar sin sintetizar no sirve"

> "Nunca he hecho un partial approval en el terminal, los apruebo todos y luego los reviso en status.html, si uno no aplica lo rechazo y eso genera un prompt de synthesis"

**Current flow (6 steps, confusing):**
```
/extract → /analyze → /status → open browser → click approve/reject →
           ↓                      generate prompt → copy → paste → /synthesis
        asks for     manual       dashboard          indirect
        approval     command      interaction        workflow
```

**Proposed flow (2 steps, clear):**
```
/extract → /analyze
           ↓
        [AskUserQuestion interactive menu]
           ↓
        writes files + auto-generates STATUS.html
           ↓
        (optional) review in dashboard → reject specific insights →
                   generate prompt → /synthesis for corrections
```

**Solution: AskUserQuestion as Decision Point**

Use Claude Code's native terminal interactive menu instead of free-text approval:

**Phase 4 of /analyze (after synthesis consolidation):**

```javascript
AskUserQuestion({
  questions: [
    {
      question: "¿Qué hacer con los 21 insights sintetizados?",
      header: "Synthesis",
      multiSelect: false,
      options: [
        {
          label: "Aprobar todos como PENDING (Recommended)",
          description: "Escribe los 21 como PENDING. Puedes revisar individualmente después en STATUS.html y generar prompt para rechazar los que no apliquen."
        },
        {
          label: "Aprobar todos como VERIFIED",
          description: "Escribe los 21 como VERIFIED directamente. Omite revisión individual en dashboard (modo express)."
        },
        {
          label: "Revisar uno por uno ahora",
          description: "Presentar cada insight para aprobación individual antes de escribir (lento, solo para proyectos pequeños)."
        }
      ]
    },
    {
      question: "¿Cómo resolver las 6 ambigüedades detectadas?",
      header: "Ambiguities",
      multiSelect: false,
      options: [
        {
          label: "Guardar para /synthesis (Recommended)",
          description: "Marcar como PENDING, resolver después con contexto completo usando dashboard"
        },
        {
          label: "Resolver ahora",
          description: "Presentar cada ambigüedad con opciones para decisión inmediata"
        }
      ]
    }
  ]
})
```

**After user selection:**

1. Write insights to INSIGHTS_GRAPH.md with chosen status (PENDING or VERIFIED)
2. Write conflicts to CONFLICTS.md as PENDING or present for resolution
3. **Auto-generate STATUS.html** (eliminates manual `/status` command)
4. Log to MEMORY.md
5. Display: "Dashboard generated: 03_Outputs/STATUS.html (21 insights, 6 conflicts)"

**Advantages:**

✅ **No sale de la terminal** — Tab/Arrow key navigation, instant feedback
✅ **Ya existe en Claude Code** — cero implementación custom, built-in feature
✅ **Opciones estructuradas** — elimina ambigüedad de respuestas libres
✅ **Flow natural** — /analyze completa sin comandos adicionales
✅ **Express mode included** — Option 2 ("Aprobar como VERIFIED") permite flujo rápido para proyectos pequeños
✅ **Dashboard sigue útil** — para partial rejection después (user's validated workflow)
✅ **Elimina naming conflict** — no más `/status` skill separado

**Role of /synthesis after this change:**

`/synthesis` **still exists** but only for edge cases:
- Re-synthesis after adding new sources (incremental research)
- Manual conflict resolution when deferred with "Guardar para /synthesis"
- Corrections after dashboard review (user clicks reject on specific insights, generates prompt)
- NOT part of normal happy path (most users choose "Aprobar como PENDING" or "VERIFIED" and skip it)

**Three workflow paths:**

**Path 1: Express (small projects, high confidence)**
```
/extract → /analyze → [AskUserQuestion: Aprobar como VERIFIED] → Done ✅
No dashboard review needed, insights written as VERIFIED directly
```

**Path 2: Standard (most common, validated by user)**
```
/extract → /analyze → [AskUserQuestion: Aprobar como PENDING] →
writes files + STATUS.html → (later) review dashboard →
reject 2-3 insights → generate prompt → /synthesis for corrections
```

**Path 3: Careful review (complex projects, low confidence)**
```
/extract → /analyze → [AskUserQuestion: Revisar uno por uno] →
presents each insight individually → user approves/rejects in terminal →
writes files + STATUS.html → Done ✅
```

**User story:**
> As a PD-Spec user, I want /analyze to guide me through decisions interactively and generate the dashboard automatically, so I don't have to remember separate commands or switch between terminal and browser unnecessarily.

**Acceptance criteria:**
- [ ] `/analyze` Phase 4 uses AskUserQuestion instead of free-text prompt
- [ ] 3 synthesis options: PENDING (review later), VERIFIED (skip review), Review now (one-by-one)
- [ ] 2 conflict options: Defer to /synthesis, Resolve now
- [ ] STATUS.html auto-generated after writing files (no manual `/status` command)
- [ ] `/status` skill removed from skills directory
- [ ] User can complete full pipeline without opening browser (if choosing VERIFIED)
- [ ] Dashboard remains functional for partial rejection workflow (Path 2)
- [ ] MEMORY.md logs user's AskUserQuestion selections for session resume
- [ ] Pipeline flow updated in README: `/extract` → `/analyze` (interactive) → optional `/synthesis`

**Implementation notes:**

1. Add AskUserQuestion call to `.claude/skills/analyze/SKILL.md` Phase 4
2. Move status generation logic from `.claude/skills/status/SKILL.md` to analyze Phase 5
3. Remove `.claude/skills/status/` directory
4. Update CLAUDE.md skills table (remove /status entry)
5. Update 03_Outputs/_templates/status.html note: "Auto-generated by /analyze"

---

### [BL-31] Extract Express Mode — Skip Heavy Files for Fast Iteration

**Status:** Proposed
**Priority:** P1 — High (scaling strategy)
**Origin:** QA v3 testing (2026-02-16), post-Option E discussion
**Related:** BL-29 (batching), BL-22 (RAG scaling)

**Problem:**

Heavy files (PDF, DOCX, PPTX, >5MB) cause disproportionate overhead:
- 20% of files consume 80% of extraction time
- Context pressure from large file reads
- Blocks fast iteration on light files (md, images)

**User need:**

*"For most projects, I want insights NOW from md/images, and PDFs later if needed."*

Fast feedback loop is critical for UX. Waiting 10-30min for full extraction breaks flow.

**Proposed solution:**

**Extract Express Mode** — Skip heavy files, mark as pending, process later.

**Option A: Express by default (fast-first)** ⭐ RECOMMENDED

```bash
/extract              # Express: process only light files, mark heavy as pending
/extract --full       # Full: process all files including heavy
/extract --heavy      # Process only pending heavy files
```

**Option B: Full by default (complete-first)**

```bash
/extract              # Full: process all files (current behavior)
/extract --express    # Express: skip heavy files, mark pending
/extract --heavy      # Process only pending heavy files
```

**Implementation:**

1. **File classification (already exists in Option E):**
   - Light: .md, .txt, .png, .jpg < 1MB
   - Heavy: .pdf, .docx, .pptx, any file ≥ 5MB

2. **Express mode behavior:**
   - Process all Light files (batch 10, write after batch)
   - Skip all Heavy files
   - Mark Heavy files in SOURCE_MAP.md with status: `pending-heavy`
   - Log: "⚠️ 17 heavy files marked pending-heavy. Run `/extract --heavy` to process."

3. **Full mode behavior (default or --full flag):**
   - Process all files (Light + Heavy)
   - Current Option E logic

4. **Heavy-only mode (--heavy flag):**
   - Read SOURCE_MAP.md
   - Filter files with status=`pending-heavy`
   - Process only those files (batch 1, write after each)
   - Update status to `processed` in SOURCE_MAP.md

**User story:**

> As a PD-Spec user with 100 source files (80 md/images + 20 PDFs), I want to extract insights from light files in 2-3min and defer heavy PDFs until later, so I can iterate quickly without waiting 30min for full extraction.

**Acceptance criteria:**

- ✅ `/extract` (express mode): processes only light files, marks heavy as pending
- ✅ `/extract --full`: processes all files (backward compatible)
- ✅ `/extract --heavy`: processes only pending-heavy files
- ✅ SOURCE_MAP.md: status=`pending-heavy` for skipped files
- ✅ Dashboard (STATUS.html): shows "17 heavy files pending" warning
- ✅ Log clearly indicates mode: "Express mode: 44 light files processed, 17 heavy pending"
- ✅ MEMORY.md logs mode used: "/extract [express|full|--heavy]"

**Benefits:**

- ✅ Fast iteration for majority of projects (80% are light files)
- ✅ User controls when to invest time in heavy files
- ✅ Pipeline useful even without PDFs ("insights from md/images first")
- ✅ Reduces context pressure (fewer large reads)
- ✅ Backward compatible (--full flag preserves current behavior)

**Trade-offs:**

- ⚠️ Critical info in PDFs may be missed initially
- ⚠️ Complexity: 3 modes (express, full, heavy-only)
- ⚠️ User may forget to process pending files
- ⚠️ Dashboard must clearly warn about pending files

**Rationale for Option A (express by default):**

- Most projects are 80% light files (md, txt, images)
- Heavy files are minority but cause 80% of extraction time
- Fast feedback loop is critical for UX
- Power users who need PDFs can explicitly run `/extract --full`
- Aligns with "make it work, make it right, make it fast" — express mode is "make it fast"

**Connection to scaling strategy:**

Express mode is part of larger scaling strategy:
- **BL-29 (batching):** Handle 40-100 files
- **BL-31 (express mode):** Handle 100-200 files by deferring heavy files
- **BL-22 (RAG layer):** Handle 200+ files with embeddings + retrieval

Express mode bridges the gap between batching and full RAG implementation.

---

### [BL-32] Auto Express Mode — Smart Project Size Detection

**Status:** Proposed
**Priority:** P1 — High (UX improvement)
**Origin:** QA v3 testing (2026-02-16), QA3-UX-01
**Related:** BL-31 (Express Mode manual), BL-18 (Synthesis layer), BL-34 (Compact Output)

**Problem:**

Pipeline feels slow even on small projects (11 files, 220 claims → "muy lento incluso en este contexto de mini proyecto"). Synthesis layer (BL-18) adds value for large projects (>500 claims) but creates overhead for small projects.

**Evidence from QA v3:**
- Triviapp project: 11 files, 220 claims → synthesis creates 47 insights (ratio 21%)
- User perception: "lento" — disproportionate processing time for project complexity
- Option E test: 54 files, 1,238 claims → 33min duration (synthesis not tested yet)

**Proposal: Auto-detect project size and adjust processing depth**

**Detection logic:**
```
IF project < 30 files OR < 500 claims:
  → Express mode (default)
  → Atomic insights only (no clustering, no synthesis)
  → Log: "⚡ Express mode: 11 files, 220 claims. Use /analyze --full for deeper synthesis."

IF project > 50 files OR > 1000 claims:
  → Full mode (synthesis activated)
  → Log: "🔍 Large project: 65 files, 1,200 claims. Running full synthesis..."

IF 30-50 files OR 500-1000 claims:
  → Express mode + suggest full
  → Log: "⚡ Express mode: 40 files, 800 claims. Consider /analyze --full for complex projects."
```

**Express mode behavior:**
- ✅ Atomic insights (one per claim cluster)
- ✅ Conflict detection (still works)
- ✅ Fast dashboard generation
- ❌ No synthesis layer (clustering, narratives)
- ❌ No convergence weighting
- ❌ No strategic consolidation

**Full mode (`/analyze --full`):**
- ✅ Synthesis layer active
- ✅ Strategic insights (7-25 consolidated from atomics)
- ✅ Convergence weighting, narratives, evidence trails
- ✅ Ambiguity detection (6 types)

**User story:**
> As a researcher with a small project (11 files, 200 claims), I expect fast iteration with atomic insights in <2min, not waiting for synthesis overhead that adds little value at this scale.

**Acceptance criteria:**
- ✅ Auto-detect project size in /analyze Phase 1
- ✅ Express mode: skip Phase 4 (Synthesis), output atomic insights only
- ✅ Clear log explaining mode and how to activate full
- ✅ --full flag overrides auto-detection
- ✅ Small projects complete /analyze in <2min (vs 5-10min with synthesis)

**Benefits:**
- Fast iteration for majority of use cases (80% of projects are <500 claims)
- User controls depth via --full when needed
- Clear logic: project size determines mode
- Backward compatible (--full preserves current behavior)

---

### [BL-33] Phase-Based Progress Dashboard — Visual Pipeline Tracking

**Status:** Proposed
**Priority:** P1 — High (UX improvement)
**Origin:** QA v3 testing (2026-02-16), QA3-UX-02
**Related:** BL-30 (auto-generate STATUS.html in /analyze), BL-32 (Express Mode)

**Problem:**

No visual progress tracking across pipeline phases. Current flow requires multiple roundtrips:
1. /analyze presents synthesis report → user approves → writes INSIGHTS_GRAPH.md
2. /status (manual invocation) → generates dashboard
3. /synthesis presents conflict resolutions → user decides → writes SYSTEM_MAP.md
4. /ship presents structure → user approves → writes deliverable

User can't see "where we are" at all times. Dashboard (/status) is separate skill, must invoke manually.

**Evidence from QA v3:**
- Triviapp session: multiple propose-approve cycles, no incremental progress view
- User feedback: "analyze deberia tener un output" — expects visible deliverable per phase
- BL-30 addresses part of this (auto-generate STATUS.html in /analyze) but doesn't show phase progress

**Proposal: Phase-Based Dashboard in STATUS.html**

**Auto-generated dashboard shows progress per phase:**

```
┌─────────────────────────────────────────────────────────┐
│ 📊 TIMining Research Dashboard                          │
├─────────────────────────────────────────────────────────┤
│ Phase 1: Sources Loaded                                 │
│ ✅ 54 files, 1,238 claims extracted                     │
│ [Ver EXTRACTIONS.md] [Add more sources]                 │
├─────────────────────────────────────────────────────────┤
│ Phase 2: Atomic Insights                                │
│ ✅ 35 insights created (12 PENDING approval)            │
│ [Approve/Reject inline] [View insights]                 │
├─────────────────────────────────────────────────────────┤
│ Phase 3: Synthesis                                      │
│ ⏭️ SKIPPED (Express mode active)                        │
│ [Run /analyze --full for synthesis layer]              │
├─────────────────────────────────────────────────────────┤
│ Phase 4: Conflicts                                      │
│ ⚠️ 3 conflicts detected (3 PENDING resolution)          │
│ [Resolve conflicts inline] [View conflicts]             │
├─────────────────────────────────────────────────────────┤
│ Phase 5: System Map                                     │
│ ⏳ PENDING (run /synthesis after resolving conflicts)   │
│ [Start synthesis] [Skip to /ship]                       │
├─────────────────────────────────────────────────────────┤
│ Phase 6: Deliverables                                   │
│ 📄 PRD.html available                                   │
│ [View PRD] [Generate more outputs]                      │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- ✅ Visual progress tracker (✅ completed, ⏳ pending, ⏭️ skipped)
- ✅ Inline actions (approve/reject, resolve conflicts)
- ✅ User sees "where we are" at all times
- ✅ Dashboard auto-updates after each skill
- ✅ User interacts from dashboard, not chat (reduces roundtrips)

**Implementation:**
- /analyze generates STATUS.html with Phase 1-4 populated
- /synthesis updates STATUS.html with Phase 5 populated
- /ship updates STATUS.html with Phase 6 populated
- Dashboard is living document, not one-time snapshot

**User story:**
> As a researcher running the PD-Spec pipeline, I expect to see visual progress across phases in a single dashboard, so I can understand pipeline state and make informed decisions without multiple /status invocations.

**Acceptance criteria:**
- ✅ STATUS.html shows 6 phases with clear status indicators
- ✅ Auto-updates after /analyze, /synthesis, /ship
- ✅ Inline actions for approvals (no chat roundtrips)
- ✅ Express mode shows "SKIPPED" for Phase 3 (Synthesis)
- ✅ User can navigate between phases visually

---

### [BL-34] Compact Skill Output — Preserve Context Longer

**Status:** Proposed
**Priority:** P0 — CRITICAL (performance blocker)
**Origin:** QA v3 testing (2026-02-16), QA3-UX-03
**Related:** BL-29 (Option E), QA3-PERF-01

**Problem:**

Verbose skill output consumes context rapidly, forcing compactions and slowing execution.

**Evidence from QA v3:**

**Option E test (TIMining, 54 files):**
- 51/54 files processed → 2 context compactions (22min elapsed)
- 54/54 files complete → 33m 54s total (vs <2min target, 16x slower)
- User feedback: "es un gloton de tokens" 😂

**Current verbose output:**
```
✓ Pass 2 — File 7/16 complete: TIMining_s strategic position...pdf, 27 claims extracted
Now updating SOURCE_MAP.md and proceeding to heavy file 8/16.
Update(~/Dev/repos/pd-spec-test/02_Work/SOURCE_MAP.md)
  Added 1 line
  [shows exact line added with full path and metadata]
Now processing heavy file 8/16: Antecedentes/Ppt & videos evento Google/[Evento Google] FINAL SCRIPT - V4.docx
Bash(cd "/Users/nlundin/Dev/repos/pd-spec-test/01_Sources/Antecedentes/Ppt & videos evento Google" && md5 -q "[Evento Google] FINAL SCRIPT - V4.docx" && textutil -convert txt ...)
  Done
Read 1 file (ctrl+o to expand)
Update(~/Dev/repos/pd-spec-test/02_Work/EXTRACTIONS.md)
  Added 32 lines
  [shows all 32 lines of extracted claims verbatim]
```

**Proposed compact output:**
```
Pass 2: 7/16 ✓ (27 claims)
Pass 2: 8/16 ✓ (24 claims)
Pass 2: 9/16 ✓ (19 claims)
```

**Principles for compact output:**
- Progress indicators: concise (emoji + summary)
- Details: defer to output files (INSIGHTS_GRAPH.md, CONFLICTS.md)
- Proposals: structured, minimal (not essay-style)
- Logging: essential only (skip intermediate steps)

**Benefits:**
- ✅ 90% reduction in output tokens
- ✅ Longer context preservation (fewer compactions)
- ✅ Faster execution (less output generation overhead)
- ✅ User reads dashboard, not chat logs

**User story:**
> As a researcher using PD-Spec, I expect skills to execute efficiently without flooding chat with verbose logs, so I can complete projects without context compactions and work faster.

**Acceptance criteria:**
- ✅ Skill output ≤50% of current verbosity (target: 90% reduction)
- ✅ Context compaction frequency reduced by 30%+
- ✅ User can complete small project (11 files) without compaction
- ✅ Option E test: 54 files in <15min (vs 33min baseline)
- ✅ Large project (100+ files) completes with max 1 compaction

**Implementation:**
- Update all skills (extract, analyze, synthesis, ship) to use compact output format
- Move detailed logs to files (MEMORY.md gets full log, user sees concise progress)
- Dashboard shows progress, not chat

---

### [BL-35] /status Performance Fix — Eliminate Synthesis Overhead

**Status:** ✅ IMPLEMENTED (v4.4, 2026-02-16)
**Priority:** P0 — CRITICAL (blocks BL-30)
**Origin:** QA v3 testing (2026-02-16), QA3-UX-04
**Related:** BL-30 (auto-generate status), BL-34 (compact output)
**Implemented:** 2026-02-16 (evening session)

**Problem:**

/status takes 6-10 minutes on ALL projects due to hidden synthesis overhead. Makes dashboard regeneration prohibitive and blocks BL-30 (auto-generate STATUS.html at end of /analyze).

**Evidence from QA v3:**

**Benchmark results:**

| Project | Sources | Insights | Duration | Target | Delta |
|---|---|---|---|---|---|
| Small | 3 | ~12 | 6m 50s | <10s | 40x slower |
| Large (TIMining) | 61 | 22 | 10m 2s | <60s | 10x slower |

**Overhead structure:**
- Fixed: ~6-7min (dominates, 67% of total)
- Variable: ~3min (scales with project size)

**Root causes (identified via SKILL.md analysis):**

1. **Conflict label inference (line 146):** 🚨 MAIN CULPRIT
   ```markdown
   "For each PENDING conflict, provide specific flag_label (who to involve and topic)
   and research_label (what to research) derived from the conflict data."
   ```
   - Requires agent to INFER resolution context for each conflict
   - Evidence: `thought for 258s` (4min 18s) observed in TIMining
   - This is SYNTHESIS work, not data formatting
   - Estimated: ~40-50s per conflict

2. **Evidence gap subjective evaluation (line 47):**
   ```markdown
   "insights with weak or single-source backing"
   ```
   - "Weak" requires subjective analysis of each insight
   - Should be objective: read convergence field, no thinking
   - Estimated overhead: ~1min

3. **Verbose output (Update + Write tools):**
   - Update tool: expands 494 lines of JSON
   - Write tool: expands 1571 lines of HTML (if used)
   - Forces context compaction at 5m 30s

**Impact:**

- 🚨 **BL-30 BLOCKED:** Cannot auto-generate STATUS.html if adds 10min to /analyze
  - Current /analyze: 7m 35s
  - With auto-status: 7m 35s + 10m = **17m 35s total** (UNACCEPTABLE)
- ❌ User workflow broken: "quick iteration" becomes 20+ min cycles
- ❌ Dashboard regeneration feels expensive, users avoid it
- ❌ Forces context compaction (small projects hit limit)

**Proposed fixes:**

**Fix 1: Eliminate conflict label inference (saves ~4-5min)** 🎯 HIGH IMPACT

**Current (line 146):**
```markdown
provide specific flag_label and research_label derived from the conflict data
```

**Fixed:**
```markdown
Use generic labels (no inference, no thinking required):

For PENDING conflicts:
- flag_label: "Flag for stakeholder discussion"
- research_label: "Needs more research"

OR read labels directly from CONFLICTS.md if already present.
NO derivation, NO synthesis, NO thinking.
```

**Fix 2: Simplify evidence gap detection (saves ~1min)**

**Current (line 47):**
```markdown
insights with weak or single-source backing
```

**Fixed:**
```markdown
Read convergence field from each insight in INSIGHTS_GRAPH.md.
If convergence < 2: add to gaps list.
NO subjective "weak" evaluation — pure data extraction.
```

**Fix 3: Compact output (prevents compaction, saves token generation)**

**Add after Phase 3:**
```markdown
IMPORTANT: After Write, DO NOT show file contents.

Output only:
✓ Dashboard: 03_Outputs/STATUS.html
  Summary: {insights_total} insights ({verified} VERIFIED, {pending} PENDING),
           {conflicts_total} conflicts, {gaps_total} evidence gaps
  Open: file://{absolute_path}

NO HTML source, NO JSON expansion.
```

**User story:**
> As a PD-Spec user, I expect /status to generate the dashboard in seconds (not minutes), so I can iterate quickly and regenerate the dashboard after every /analyze without hesitation.

**Acceptance criteria:**
- [ ] Execution time: <10s for small projects (<10 sources) — down from 7min
- [ ] Execution time: <30s for medium projects (10-50 sources)
- [ ] Execution time: <60s for large projects (50+ sources) — down from 10min
- [ ] /status output ≤100 lines (not 1571 lines HTML + 494 lines JSON)
- [ ] No "thought for X seconds" delays (no inference, no synthesis)
- [ ] Small projects complete without triggering compaction
- [ ] BL-30 unblocked: /analyze + auto-status = <8min total (not 17min)

**Expected improvement:** 10min → <10s (60x faster)

**Implementation Summary (2026-02-16):**

Modified `.claude/skills/status/SKILL.md` with three fixes:

**✅ Fix 1: Eliminated conflict label inference** (line 146)
- **Before:** "provide specific flag_label and research_label derived from the conflict data"
- **After:** Generic labels (no inference): "Flag for stakeholder review", "Validate with additional research"
- **Impact:** Eliminates ~4-5min thinking overhead per conflict

**✅ Fix 2: Simplified evidence gap detection** (line 47)
- **Before:** "insights with weak or single-source backing" (subjective evaluation)
- **After:** "Read Convergence field. If convergence < 2 sources, add to gaps list" (objective)
- **Impact:** Eliminates ~1min subjective analysis

**✅ Fix 3: Compact output** (Phase 4)
- **Before:** Shows full HTML/JSON (1571 + 494 lines)
- **After:** Shows only summary: `✓ Dashboard: STATUS.html [stats]`
- **Impact:** Prevents context compaction, conserves tokens

**Testing results (2026-02-16):**

| Test | Expected | Actual | Pass? |
|---|---|---|---|
| TIMining (61 sources) | <60s | **6m 34s** | ❌ |
| Thinking overhead | 0s | ~0s | ✅ |
| Dashboard functional | Yes | Yes | ✅ |
| Compact output | Summary only | Summary only | ✅ |

**Analysis:** Thinking overhead eliminated (4m 18s saved vs baseline 10m 2s) but I/O overhead remains (~6.5min reading + processing + writing ~2000 lines). BL-35 is a partial success — 37% faster but not 10x faster. Further optimization needed (lazy loading, partial reads).

**Testing plan (remaining):**
1. Test on small project (3 sources): verify <10s execution
2. Verify BL-30 becomes viable: /analyze + auto-status <10min total

**Original implementation steps:**
1. Edit `.claude/skills/status/SKILL.md`:
   - Line 146: Replace inference instruction with generic labels
   - Line 47: Replace subjective evaluation with convergence < 2 check
   - After Phase 3: Add compact output instruction
2. Test on TIMining (61 sources): verify <60s execution
3. Test on small project (3 sources): verify <10s execution
4. Verify BL-30 becomes viable: /analyze + auto-status <10min total

---

### [BL-36] Dashboard Conflict States — Intermediate Status (Flagged/Research)

**Status:** Proposed
**Priority:** P1
**Origin:** QA v3 BL-35 testing (2026-02-16), QA3-UX-06
**Related:** BL-35 (/status perf fix), QA3-ARCH-01

**Problem:**

When user runs `/synthesis` and marks conflicts as "Flag for discussion" or "Needs more research", those conflicts remain `PENDING` in CONFLICTS.md. On next dashboard open, the radio buttons are blank — there's no indication that a decision was already made.

**Current behavior:**
- CF-03 flagged for stakeholder → still shows as PENDING, radio blank
- CF-05 sent for research → still shows as PENDING, radio blank
- User must re-make decisions every time

**Desired behavior:**
- CF-03 flagged → shows badge "Flagged" + radio pre-selected
- CF-05 research → shows badge "Research" + radio pre-selected

**Proposed fix:**

Extend CONFLICTS.md status syntax:
```markdown
Status: PENDING — Flagged (who to involve, e.g. CTO + Producto)
Status: PENDING — Research needed (what to research)
```

Dashboard parses this metadata and:
1. Shows intermediate badge (Flagged in amber, Research in blue)
2. Pre-selects corresponding radio button
3. Preserves user notes if provided

**/synthesis update required:** When user flags CF-XX, `/synthesis` writes intermediate status to CONFLICTS.md.

**User story:**
> As a researcher who flagged CF-03 for CTO discussion, I expect the dashboard to show "Flagged" on that conflict next time I open it, so I don't lose track of what's in flight.

**Acceptance criteria:**
- [ ] CONFLICTS.md supports: `Status: PENDING — Flagged (...)` and `Status: PENDING — Research needed (...)`
- [ ] Dashboard parses intermediate states and shows badges
- [ ] Radio buttons pre-select based on metadata
- [ ] /synthesis writes intermediate status when flagging/sending to research

---

### [BL-29] /extract Context Overflow — Mandatory Batching for Large Projects (CRITICAL)

**Status:** ✅ IMPLEMENTED (v4.3.1, Option E)
**Priority:** P0 — CRITICAL (blocking production use)
**Origin:** QA v3 (2026-02-16, Opus 4.6 test on TIMining 61 files)
**Related:** BL-26 (auto-batching), QA3-BUG-02, QA3-PERF-01
**Implemented:** 2026-02-16 (commit 8639af7, Option E)

**Problem:**

Pipeline BLOCKED on 61-file project. Context overflow at 6m 42s, compaction failed with "Conversation too long", no recovery path.

**Evidence from QA v3:**

```
Test: TIMining project, 61 source files
Duration: 6m 42s to complete failure
Result: 0/61 files written to disk
Error: "Error during compaction: Error: Conversation too long"
Status: Session unrecoverable, pipeline blocked
```

**Root causes:**

1. **Auto-batching (BL-26) did NOT activate**
   - Large Project Strategy exists in skill instructions
   - Detection logic: "if >40 files OR multiple PDFs >10MB"
   - Agent did NOT execute batching strategy
   - Attempted to process all 61 files in single run

2. **Parallel agents accumulate context**
   - 6 Task agents launched simultaneously
   - Each loads full skill instructions + processes files
   - Agent outputs accumulate in main context
   - No intermediate writes before context limit

3. **/tmp permission issues force inefficient fallback**
   - Converted files (DOCX→txt, PPTX→txt) written to `/tmp`
   - Task agents cannot read `/tmp` (permission denied)
   - Forces direct extraction in main context
   - Compounds context pressure

**Current behavior:**

```
/extract discovers 61 files
→ Launches 6 parallel Task agents
→ Agents hit /tmp permission issues
→ Fallback to direct extraction
→ Context limit at 6m 42s
→ All agents complete but hit context limit
→ Main context: "Conversation too long"
→ Compaction fails
→ BLOCKED, no recovery
```

**Desired behavior:**

```
/extract discovers 61 files
→ Detects >40 files, activates batching
→ Batch 1 (files 1-20):
   - Process files
   - Write EXTRACTIONS.md (append)
   - Write SOURCE_MAP.md (update)
   - Clear working memory
→ Batch 2 (files 21-40):
   - Process files
   - Write EXTRACTIONS.md (append)
   - Write SOURCE_MAP.md (update)
   - Clear working memory
→ Batch 3 (files 41-61):
   - Process files
   - Write EXTRACTIONS.md (append)
   - Write SOURCE_MAP.md (update)
   - Complete
→ Final validation & report
→ SUCCESS: 61/61 files processed
```

**User stories:**

> **As a researcher with 61 source files**, I expect /extract to complete successfully by processing files in batches with intermediate writes, preventing context overflow and ensuring all files are processed.

> **As a project manager evaluating PD-Spec**, I expect the pipeline to handle real-world projects (40-100 files) without session failures, blocked states, or unrecoverable errors.

> **As a developer maintaining PD-Spec**, I expect auto-batching to activate reliably based on file count, with clear logging of batch progress and intermediate state saves.

**Acceptance criteria:**

✅ **AC1: Mandatory batching for >40 files**
- Detection: Count files in Phase 1 discovery
- If count >40: MUST activate batching (not optional)
- Batch size: 15-20 files per batch
- Log: "Batching activated: 61 files → 4 batches of 15-16 files"

✅ **AC2: Intermediate writes after EACH batch**
- After batch completes: Write EXTRACTIONS.md + SOURCE_MAP.md immediately
- Use Edit tool to append sections (not full rewrite)
- Log: "Batch 1/4 complete → EXTRACTIONS.md updated (20 sections)"
- Working memory cleared after write

✅ **AC3: No parallel agents for large projects**
- If batching activated: disable Task agent parallelization
- Process files sequentially within each batch
- Reduces context pressure, avoids /tmp permission issues

✅ **AC4: Converted files written to repo temp dir**
- Create `02_Work/_temp/` for conversions (not `/tmp`)
- Cleaned after extraction completes
- Avoids Task agent permission issues
- Pattern: `02_Work/_temp/converted_[hash].txt`

✅ **AC5: Resume from interruption**
- If context limit hit mid-batch:
  - Write current batch to disk
  - Log last processed file
  - Next run: Read SOURCE_MAP, skip 'processed' files, continue
- No data loss on interruption

✅ **AC6: Progress reporting per batch**
```
Batch 1/4: Processing files 1-15... (0/15)
Batch 1/4: Completed file 5/15 (Antecedentes/file.md)
Batch 1/4: Completed file 10/15 (Workshop/photo.jpg)
Batch 1/4: Writing intermediate state... ✓
Batch 1/4: Complete (15 files, 187 claims extracted)

Batch 2/4: Processing files 16-30... (0/15)
[...]
```

✅ **AC7: Test case passes**
- Test: 61-file TIMining project
- Expected: 61/61 files processed in 4 batches
- Expected: <5 min total duration
- Expected: 0 context compaction events (or max 1)
- Expected: EXTRACTIONS.md contains all 61 sections
- Expected: SOURCE_MAP.md shows 61 'processed' entries

**Proposed implementation:**

**File:** `.claude/skills/extract/SKILL.md`

**Changes:**

1. **Phase 1: Add mandatory batch detection**
```markdown
### Phase 1: Discover Sources

4. **Batch detection (MANDATORY for >40 files):**
   - Count total files discovered
   - If count <= 40: Process all files in single pass
   - If count > 40: ACTIVATE BATCHING
     - Batch size: 15 files
     - Total batches: ceil(count / 15)
     - Log: "Batching activated: {count} files → {batches} batches"
     - Disable Task agent parallelization
```

2. **Phase 2: Add batch loop**
```markdown
### Phase 2: Read & Extract (with Batching)

If batching activated:
  For each batch (1 to N):
    a. Process 15 files from queue
    b. Extract claims (3-5/page, 1-2/slide, 1-3/image)
    c. Write to EXTRACTIONS.md (append new sections via Edit)
    d. Update SOURCE_MAP.md (append new rows via Edit)
    e. Log: "Batch X/N complete: Y files, Z claims"
    f. Clear working memory (no agent state retention)

If batching NOT activated:
  Process all files in single pass (current behavior)
```

3. **Phase 3: Change temp directory**
```markdown
### Office File Conversions

- DOCX: textutil → `02_Work/_temp/conv_{hash}.txt`
- PPTX: Python zipfile → `02_Work/_temp/pptx_{hash}.txt`
- HEIC: sips → `02_Work/_temp/img_{hash}.jpg`

After extraction complete: rm -rf 02_Work/_temp/
```

4. **Add resume logic**
```markdown
### Phase 1b: Resume Detection

If SOURCE_MAP.md exists AND contains 'processed' entries:
  - Read SOURCE_MAP
  - Filter discovered files: only process if NOT in map OR status='error'
  - Log: "Resume mode: X files already processed, Y new/modified"
  - Continue with batching on remaining files
```

**Testing plan:**

1. **Unit test:** 15-file project → single batch, no batching activated
2. **Integration test:** 45-file project → 3 batches of 15, intermediate writes verified
3. **Stress test:** 100-file project → 7 batches, all complete, <10 min
4. **Resume test:** 61-file project interrupted at batch 2 → resume processes batches 3-4 only
5. **TIMining validation:** 61 files → 4 batches → 61/61 processed → /analyze synthesis works

**Risk mitigation:**

- **Batch size too small (10)**: More writes, slower, but safer for context
- **Batch size too large (30)**: Faster but risk context overflow in batch
- **Sweet spot: 15-20 files** balances performance vs safety

**Dependencies:**

- None (self-contained fix in extract skill)
- Complements BL-28 (incremental /analyze) — after extraction works, analysis is already incremental

---

**Implementation Results (Option E, 2026-02-16):**

✅ **Test:** TIMining project, 61 source files (54 processable + 7 videos unsupported)
✅ **Result:** 54/54 files processed (100%)
✅ **Duration:** 33m 54s
✅ **Claims extracted:** 1,238 claims
✅ **Context compactions:** 2-3 (all recovered successfully)
✅ **Validation:** 54 EXTRACTIONS.md sections match 54 SOURCE_MAP.md entries

**What worked:**
- Two-pass strategy: 38 light files (Pass 1) + 16 heavy files (Pass 2)
- Per-file writes for heavy files (batch size 1)
- Direct processing (NO Task agents)
- Recovery from compactions via SOURCE_MAP.md
- All file types working (PDF, DOCX, PPTX, HEIC, images)

**What needs optimization:**
- Duration 33min (vs <5min target in AC7) — caused by verbose output
- Related to QA3-UX-03 (Compact Output) — needs 90% reduction in verbosity
- See BL-34 for optimization plan

**Commits:**
- `8639af7` — Option E implementation (eliminate Task agents, per-file writes)
- `4314189` — Pre-create 02_Work/_temp/ directory
- `332c4e8` — QA v3 findings documentation

**Lessons learned:**
- Task agents NOT suitable for extraction (context accumulation, permission issues)
- Per-file writes critical for heavy files (prevents context overflow)
- Batch size 1 for heavy files is safest (predictable, recoverable)
- Verbose output is bottleneck (see BL-34 for fix)

---

### [BL-18] Observation → Insight Synthesis Layer (ARCH-03)

**Status:** ✅ IMPLEMENTED (v4.3, commit 11d8c26)
**Priority:** High
**Origin:** ARCH-03 (QA v2, 2026-02-15)
**Updated:** 2026-02-16 (Gemini comparison analysis)
**Implemented:** 2026-02-16 (overnight implementation)

**Problem (Expanded):**

161 atomic observations are unmanageable. But synthesis is not just grouping — it's **resolving ambiguity with methodological rigor**.

**Current behavior:**
- /extract → 756 claims to EXTRACTIONS.md
- /analyze → 161 insights to INSIGHTS_GRAPH.md (1:1 conversion, too granular)
- User drowns in volume, can't see strategic patterns
- Vague claims repeated without correction ("6-8 productos" when only 6 documented)
- No uncertainty management (ambiguities not flagged, conflicts not detected)

**Desired behavior:**
- /extract → 756 claims to EXTRACTIONS.md
- **/analyze → automatic synthesis** claims → observations → 15-25 real insights
  - Detect multi-source convergence (≥2 sources = candidate)
  - Thematic clustering (Geometry Gap, Efecto Suiza, etc.)
  - Consolidate 161 → 15-25 strategic insights with **narrative**
  - **Detect ambiguities** ("6-8 productos" → flag discrepancy, present options)
  - **Suggest research gaps** when critical claims are single-source
  - **Name concepts** memorably ("Auto de Homero Simpson", "Desplanificadómetro")
- User reviews synthesis (18 insights + ambiguity report), NOT 161 items
- /synthesis → resolves conflicts, approves insights

---

**Inspiration: Gemini vs PD-Spec Analysis**

Analysis of Gemini outputs for TIMining project revealed what strategic synthesis should look like:

| Aspect | Gemini (good) | PD-Spec (current) | Hybrid Goal (BL-18) |
|---|---|---|---|
| **Synthesis level** | ✅ Strategic (18 insights) | ❌ Granular (161 insights) | ✅ Strategic (15-25 insights) |
| **Narrative** | ✅ Tells stories | ❌ Lists IDs | ✅ Stories WITH evidence |
| **Naming** | ✅ Memorable concepts | ❌ Generic labels | ✅ Memorable WITH source citation |
| **Traceability** | ❌ None | ✅ Every insight sourced | ✅ Maintain rigor |
| **Conflict detection** | ❌ 0 detected | ✅ 6 detected (TIMining) | ✅ Active contradiction search |
| **Aspirational marking** | ❌ Mixes everything | ✅ (current) vs (aspirational) | ✅ Explicit tags |
| **Uncertainty handling** | ❌ Repeats vague claims | ❌ No handling | ✅ Present options + suggest research |
| **Fact vs opinion** | ❌ Mixes without marking | ✅ Only facts in INSIGHTS_GRAPH | ✅ Mark (hallazgo) vs (recomendación) |

**What to adopt from Gemini:**
1. **Strategic narrative** — "Kiosco de Datos → Médico Operacional" (makes insights USABLE in team conversations)
2. **Memorable naming** — "Efecto Suiza", "Auto de Homero Simpson" (concepts that stick)
3. **Thematic synthesis** — group 161 observations into ~18 strategic clusters
4. **Benchmark UX inter-industry** — investigate design patterns from other industries (optional `/ship benchmark-ux`)

**What to avoid from Gemini:**
1. ❌ Mixing fact with opinion without marking
2. ❌ No traceability (impossible to verify sources)
3. ❌ Not detecting contradictions (0 conflicts found)
4. ❌ Not correcting vague claims ("6-8" → should report "6 documented")

---

**Types of Uncertainty the Agent Must Handle:**

| Type | Example (TIMining) | Agent Should Do | Output |
|---|---|---|---|
| **Imprecision** | "6-8 productos" but only 6 named | Report verifiable + flag discrepancy | "6 productos documentados (Aware, Orchestra, Delta, SIC, Tangram, ARIS). Source claims '6-8' but doesn't name other 2." |
| **Conflict** | Source A: "Aware sold alone", Source B: "Aware+Orchestra bundle" | Create conflict [CF-XX] with options | Present both versions with convergence + ask user decision |
| **Single-source critical** | Strategic claim backed by 1 source only | Flag for validation | "Insight [IG-XX] is critical but single-source. Suggest: CFO interview to validate pricing." |
| **Definition gap** | "CORE" mentioned 14x without defining scope | Generate question | "¿CORE es rebrand, nueva plataforma, o suite completa? Suggest: Workshop to clarify." |
| **Unresolved contradiction** | 3 sources disagree, no consensus | Present options with authority levels | "A: X (2 sources, stakeholder voice), B: Y (1 source, CEO strategic). Decision needed." |
| **Perspective conflict** | Users: "Aware es confuso" (5x) vs CTO: "No saben usarlo bien" (1x) | Detect conflict by Voice/Authority, NOT just convergence count | "**Perspective conflict:** Users report confusion (UX issue, 5/5 direct-quotes) vs CTO attributes to training gap (1/1 stakeholder opinion). Root cause: UX design or user capability? Suggest: UX audit + training assessment." |

---

**Convergence Weighting by Voice/Authority:**

Not all sources carry equal evidentiary weight. Synthesis must weight convergence by **who says it** and **how they know it**:

| Scenario | Voice | Authority | Weight | Reasoning |
|---|---|---|---|---|
| 5 operators say "Aware timing is confusing" | `user` | `direct-quote` | ⚡️⚡️⚡️ High | Direct user pain, multi-source convergence |
| CTO says "Users don't read the manual" | `stakeholder` | `hypothesis` | ⚡️ Medium | Internal opinion, not observed fact |
| Design Brief states "$6M captured Jan-May 2025" | `document` | `fact` | ⚡️⚡️⚡️ High | Verifiable metric with source attribution |
| Workshop: "In 2040, mines will be fully remote" | `stakeholder` | `vision` | ⚡️ Low | Aspirational, not current state |
| Field note: "Hunch: users might prefer mobile" | `researcher` | `hypothesis` | ⚡️ Low | Unvalidated assumption, needs testing |

**Synthesis rule:** When consolidating insights, prioritize:
1. **High convergence + user voice + direct-quote** (e.g., 5 users reporting same pain)
2. **Facts from documents** (metrics, dates, technical specs)
3. **Stakeholder observations** (what they've seen, not what they think should happen)
4. **Single-source stakeholder opinions** (useful for understanding internal perspective, but flag for validation)
5. **Visions and hypotheses** (mark as aspirational, not current state)

**Perspective conflict detection:**

When Voice/Authority metadata reveals conflicting interpretations of the same phenomenon:

```markdown
## [CF-XX] UX Complexity vs User Training Gap — Perspective Conflict

**Insight A [IG-05]:** "Aware data timing confuses users — don't understand refresh rates"
- Voice: `user` (operators, supervisors)
- Authority: `direct-quote` (interview transcripts)
- Convergence: 3/21 sources
- Status: VERIFIED

**Insight B [IG-YY]:** "Users don't invest time learning the tool properly"
- Voice: `stakeholder` (CTO)
- Authority: `hypothesis` (not observed, inferred)
- Convergence: 1/21 sources
- Status: PENDING

**Type:** Perspective conflict (not factual contradiction)

**Analysis:** Users report symptom (confusion), CTO proposes cause (training gap).
Both may be partially true — UX complexity AND insufficient training can coexist.

**Resolution options:**
A. Prioritize UX simplification (believe user pain reports)
B. Prioritize training improvements (believe CTO diagnosis)
C. Address both (likely correct — simplify UX AND improve onboarding)

**Recommended action:** UX audit to measure task completion rates + training assessment
to measure comprehension after onboarding. Data will reveal root cause split.
```

---

**New /analyze Architecture (with integrated synthesis):**

```
/analyze [--full|--incremental]
├── Phase 1: Load extractions (actual)
├── Phase 2: Diversity check (actual)
├── Phase 3: Extract atomic observations (actual, generates 161)
│
├── 🆕 Phase 4: SYNTHESIS (new)
│   ├── 4.1 Detect convergence (≥2 sources = candidate)
│   ├── 4.2 Thematic clustering (Geometry Gap, Efecto Suiza, etc.)
│   ├── 4.3 Consolidate observations → insights (161 → 15-25)
│   ├── 4.4 Detect uncertainty (imprecision, conflicts, gaps)
│   ├── 4.5 Name concepts (memorable + source-backed)
│   ├── 4.6 Present synthesis + ambiguity report
│   └── 4.7 Wait for user approval
│
├── Phase 5: Write to INSIGHTS_GRAPH.md (real insights only)
├── Phase 6: Write ambiguities to CONFLICTS.md (with questions)
└── Phase 7: Update MEMORY
```

---

**Example Output: Synthesis Report**

```markdown
## Synthesis Report — TIMining CORE (2026-02-16)

**Observations:** 161 atomic claims
**Real Insights:** 18 strategic insights
**Method:** Convergence (≥2 sources) + thematic clustering + narrative synthesis

---

### ✅ High Confidence Strategic Insights (12)

#### **[IG-SYNTH-01] Geometry Gap — El Problema Central**
**Consolidates:** IG-19, IG-20, IG-161
**Convergence:** 3/21 sources
**Category:** user-need (current)
**Voice:** stakeholder (COO), workshop, PDF vision

> **Narrative:** Miners see "trucks and shovels" on fleet systems but lack
> geological/spatial context — don't know if extracting from correct polygon/block.
> Deviations discovered late (weeks), costing millions. TIMining solves this by
> fusing geometric plan with real operations.

**Evidence trail:**
- COO Roberto: "Brecha Geométrica — el minero ve camioncitos pero no contexto"
- Workshop: "Plan minero se pierde en cada turno"
- GEMINI PDF: "Closing loop between sensory world and planning world"

**Named concept:** "Geometry Gap" (naming from sources, not invented)

---

#### **[IG-SYNTH-06] Auto de Homero Simpson — Customization Risk**
**Consolidates:** IG-8, IG-36, IG-37, IG-38, IG-39, IG-108
**Convergence:** 3/21 sources
**Category:** user-need + constraint (current)
**Voice:** stakeholder (Ana), workshop, operations

> **Narrative:** Clients request many features then don't use them well. High
> customization per mine (different extraction methods, regulations, incentives)
> creates risk of "Homer's Car" — too many features nobody uses. Ana (Comms):
> "No podemos estar prevalidos del tipo de deseos del cliente."

**Evidence trail:**
- Operations meeting: "Riesgo auto de Homero — clientes piden funcionalidades pero no las usan"
- Ana interview: Tensión entre flexibilidad y decir "no" a customizaciones
- Workshop retro: "DESARROLLOS ESPECÍFICOS [STOP]"

**Named concept:** "Auto de Homero Simpson" (literal quote from source)

---

### ⚠️ Medium Confidence (4 insights)

#### **[IG-SYNTH-17] Product Ecosystem — 6 productos documentados**
**Consolidates:** IG-1, IG-2, IG-3, IG-4, IG-31
**Convergence:** 2/21 sources
**Category:** technical + business (current)

> **Narrative:** TIMining has **6 documented products** across 2 domains:
> Operations/Planning (Aware, Orchestra, Delta) + Geotechnical/Geology
> (SIC, Tangram, ARIS). Aware+Orchestra sold together (Aware=real-time,
> Orchestra=historical ROI). Delta = corporate entry point.

**Ambiguity flagged:** Source claims "6-8 productos" but only names 6.
Either 2 undocumented products exist or claim is imprecise.

**Action suggested:** Interview Product Team to confirm full product list.

---

### 🔴 Ambiguities Detected (3)

**[AMB-01] Product Count Discrepancy**
- **Source claim:** "TIMining posee 6-8 productos"
- **Verification:** Only 6 named (Aware, Orchestra, Delta, SIC, Tangram, ARIS)
- **Options:**
  - A: Report as "6 products" (verified, conservative)
  - B: Report as "6-8 products" with note "2 undocumented"
  - C: Flag as research gap requiring validation
- **Recommended action:** Interview COO/Product — "¿Son 6 u 8 productos? ¿Cuáles son los otros 2?"

**[AMB-02] CORE Platform Definition**
- **Problem:** 14 sources mention "TIMining CORE" without defining scope
- **Ambiguity:** Is CORE a rebrand of Aware, new unified platform, or full suite?
- **Impact:** Affects roadmap interpretation and product strategy
- **Recommended action:** Workshop question: "¿Qué es CORE exactamente? ¿Reemplaza Aware o integra portafolio?"

**[AMB-03] Pricing Model Conflict**
- **Source A:** "Aware se vendía sin Orchestra antes"
- **Source B:** "Aware+Orchestra siempre juntos porque Aware solo no justifica ROI"
- **Convergence:** 1 source each (tie)
- **Recommended action:** Interview Sales/CFO to clarify go-to-market strategy

---

### 📋 Research Gaps (5 critical validations needed)

1. **CFO Validation Missing** — Pricing strategy ($450K target) in vision docs but no CFO interview.
   Suggest: CFO interview to validate pricing assumptions.

2. **Competitor Benchmark Absent** — "Efecto Suiza" claims uniqueness but no competitive analysis.
   Suggest: Competitive UX benchmark (Hexagon, Datamine, Modular Mining).

3. **User Validation for 20 Use Cases** — Workshop scenarios are aspirational, no field testing.
   Suggest: User validation workshop to prioritize by criticality.

4. **Technical Claims Need Engineering Review** — TRL 9, "inferencia topográfica cada 15min" lack validation.
   Suggest: CTO/Engineering technical review.

5. **Market Sizing Breakdown** — "50+ mines, 8 countries" lacks regional/metal breakdown.
   Suggest: Sales data analysis for market segmentation.

---

**User Decision Required:**

□ Approve 18 synthesized insights?
□ How to resolve 3 ambiguities? [Now / Defer to /synthesis / Schedule workshop]
□ Add 5 research gaps to backlog? [All / Select / None]
```

---

**User Stories:**

**US-01: Detect Imprecision**
> As a UX researcher, when /analyze finds "6-8 productos" but only documents 6,
> I expect the agent to report "6 productos verificados" and flag the discrepancy,
> not repeat the vague claim.

**US-02: Present Options for Conflicts**
> As a product owner, when two sources contradict (Aware sold alone vs bundle),
> I expect the agent to present both options with convergence and authority levels,
> asking for my decision.

**US-03: Suggest Research for Single-Source Critical Claims**
> As a strategic advisor, when a critical insight is single-source, I expect the
> agent to suggest methodology for validation (interview CFO, benchmark, workshop)
> instead of marking it VERIFIED automatically.

**US-04: Synthesis Not Granularity**
> As a researcher, after /analyze I expect to review 15-25 real insights with
> narratives + ambiguity report, NOT 161 atomic observations.

**US-05: Named Concepts for Communication**
> As a team lead, I expect insights to have memorable names ("Geometry Gap",
> "Efecto Suiza") sourced from actual stakeholder language, making them easy
> to reference in meetings and decisions.

**US-06: Distinguish Fact from Recommendation**
> As a decision-maker, when reviewing synthesis I need to clearly distinguish
> what's a finding from sources vs what's an agent recommendation, so I can
> assess reliability.

---

**Implementation Notes:**

1. **Convergence threshold:** ≥2 sources for candidate insights (single-source flagged for validation)
2. **Naming strategy:** Extract memorable phrases from actual source quotes ("Auto de Homero Simpson"), not invent
3. **Narrative template:** Problem statement + Evidence trail + Impact + Named concept
4. **Ambiguity detection:** Scan for numeric ranges ("6-8"), undefined terms ("CORE"), contradictions between sources
5. **Research gap criteria:** Single-source strategic claims, missing stakeholder perspectives (CFO, users), technical claims without validation
6. **Target range:** 15-25 real insights (5-8 for small projects, 10-15 for medium, 15-25 for large like TIMining)

---

**Dependencies:**

- Requires BL-17 (SOURCE_MAP.md) for source tracking
- Synergy with BL-12 (Research Dashboard) for visualization of synthesis
- Aligns with Agent Mandate #6 (Uncertainty Management)

---

**Testing Criteria:**

- ✅ 161 TIMining observations → 18 strategic insights (demonstrated manually 2026-02-16)
- ✅ Detects "6-8 productos" imprecision and corrects to "6 documented"
- ✅ Identifies 3 ambiguities requiring user decision
- ✅ Suggests 5 research gaps with specific methodologies
- ✅ Named concepts traceable to source quotes
- ✅ Synthesis readable by stakeholders (narrative format)
- ✅ Maintains traceability (every synthesized insight lists source trail)

---

### [BL-19] README.md Sync — Outdated Documentation

**Status:** Implemented (updated 2026-02-15)
**Priority:** High

Missing `/extract` and `/audit` skills, outdated pipeline, wrong counts. Fixed in branch claude/summarize-recent-commits-eKvQS.

---

### [BL-20] Layer READMEs Sync — Outdated Documentation

**Status:** Implemented (updated 2026-02-15)
**Priority:** High

Missing EXTRACTIONS.md, RESEARCH_BRIEF.md, wrong pipeline. Fixed in branch claude/summarize-recent-commits-eKvQS.

---

### [BL-22] RAG Layer — Scale Source Ingestion Beyond Context Window

**Status:** Proposed
**Priority:** Low (becomes High at 100+ sources)
**Depends on:** BL-17

**Problem:** PD-Spec reads all sources sequentially. Works for 10-20 sources. At 57+ files, context compaction causes state loss and file skipping. NotebookLM handles 100+ via RAG.

**Solution:** BM25 keyword search (zero deps) or embeddings + vector store. Index claims as extracted, query for relevant context instead of loading all.

**User stories:** See original entry in archive below.

---

### [BL-23] BUG: /extract Editorial Decisions (CRITICAL)

**Status:** ✅ IMPLEMENTED (v4.3, commit f250d57)
**Priority:** P0 — Critical
**Origin:** TIMining QA testing (2026-02-15/16)
**Related:** BL-17
**Implemented:** 2026-02-16 (overnight implementation)

**Problem:**
Agent skips files based on "assumed redundancy" or subjective judgment. In TIMining test:
- 27 Workshop photos skipped (claimed "redundant with transcript")
- Photos contain unique sticky notes NOT in transcript
- _FIELD_NOTES.md reported as processed but omitted
- Result: 23/61 files processed (38% completion)

**Evidence:**
```
Corrida #1: Reported 50 processed, actually 22 (56% false)
Corrida #2: Processed 23/61 (38%) — 27 photos + field notes skipped
SOURCE_MAP: "IMG_*.jpeg (21 photos) EXTRACTED" but only 3 sections in EXTRACTIONS.md
```

**Root cause:**
Skill lacks explicit rule against editorial decisions. Subagent optimizes by skipping work.

**Fix:**
```markdown
## MANDATORY RULE: NO EDITORIAL DECISIONS

The agent MUST NOT skip files based on:
- Assumed redundancy
- Subjective judgment
- Optimization attempts

EVERY file discovered in Phase 1 MUST be:
(a) Processed with claims extracted, OR
(b) Reported as unprocessable with technical reason

"Redundancy" is NOT a valid technical reason.
```

**User stories:**
> As a researcher, I expect ALL discovered files to be processed or explicitly reported as unprocessable. The agent should NOT make editorial decisions about which files "seem redundant."

---

**Note: Editorial Judgment vs Methodological Rigor**

There's a distinction between two types of "editorial decisions":

**❌ PROHIBITED: Skipping entire files**
- Claiming "photos redundant with transcript" without processing them
- Omitting files based on assumptions about content
- **This is the bug BL-23 addresses**

**✅ RECOMMENDED: Applying UX research methodology within files**
- A real UX researcher extracts **3-5 key claims per page**, not 10-15 exhaustive claims
- Focuses on strategic insights, user pain points, and critical constraints
- Filters out repetitive details, formatting artifacts, and low-signal content
- **This is methodological rigor, not laziness**

**Example comparison:**

| Approach | Page Count | Claims Extracted | Quality |
|---|---|---|---|
| **Exhaustive extraction** | 10 pages | 100-150 claims | High volume, low signal, many duplicates |
| **UX research methodology** | 10 pages | 30-50 claims | Curated, strategic, actionable |

**The rule:**
- ✅ Process EVERY file discovered
- ✅ Within each file, apply methodological judgment to extract what matters
- ❌ Do NOT skip files based on assumed redundancy

**Implementation guidance for /extract:**

When processing a document:
1. **Read the full content** (don't skip pages or sections)
2. **Extract claims that meet these criteria:**
   - User needs, pain points, or behaviors (direct quotes preferred)
   - Business constraints, success metrics, or strategic decisions
   - Technical capabilities, limitations, or architectural decisions
   - Competitive insights or market context
   - Verifiable facts (metrics, dates, contractual terms)
3. **Filter out:**
   - Repetitive statements already captured
   - Formatting artifacts, tables of contents, footers
   - Vague or unsupported assertions ("users probably want X")
   - Obvious background that adds no new information
4. **Target extraction density:** ~3-5 claims per page for text-heavy documents, ~1-2 per slide for presentations

This is **not** an excuse to skip files. It's guidance on how to extract **strategic signal** from processed content.

---

### [BL-24] BUG: /extract Fallbacks Not Used (CRITICAL)

**Status:** ✅ IMPLEMENTED (v4.3, commit 745b6e6)
**Priority:** P0 — Critical
**Origin:** TIMining QA testing (2026-02-15/16)
**Related:** BL-17
**Implemented:** 2026-02-16 (overnight implementation)

**Problem:**
Skill has fallback tools (Read PDF, Read with offset/limit) but agent doesn't use them. Reports files as "unprocessable" without attempting fallbacks.

**Evidence:**
| Files | Reported reason | Fallback available | Used? |
|---|---|---|---|
| 5 PDFs | "Require poppler" | `Read(pdf, pages="1-20")` | ❌ NO |
| 1 large MD | "Exceeds token limit" | `Read(file, offset, limit)` | ❌ NO |

**Root cause:**
Instructions specify `Read(pdf, pages="1-20")` which **requires poppler** and fails. The correct approach is `Read(pdf)` WITHOUT pages parameter — extracts text, no poppler needed.

**Additional discovery (2026-02-16):**
Multiple large PDFs (>10MB) in same context cause request accumulation → "Request too large (max 20MB)" error even though individual PDFs are processable. Tested: PDF 1 (17MB) ✅ read successfully, then PDF 2 (11MB) ❌ failed in same context. PDF 2 ✅ succeeded in clean context.

**Fix:**
```markdown
### PDF Processing — MANDATORY APPROACH

1. MUST attempt Read(pdf) WITHOUT pages parameter first
   - Extracts text from PDF (no poppler required)
   - Works for PDFs with text layer

2. For large PDFs or projects with multiple PDFs >10MB:
   - Process ONE PDF at a time
   - Write to EXTRACTIONS.md after EACH PDF
   - Update SOURCE_MAP.md after EACH PDF
   - Intermediate writes clear working memory and prevent request accumulation
   - NEVER read multiple large PDFs in same context without intermediate writes

3. For very large text content (>2000 lines):
   - Use Read(pdf, offset=0, limit=2000) to read in chunks
   - Iterate with offset=2000, 4000, etc.

4. ONLY use pages parameter if PDF is image-only (no text layer):
   - Requires poppler installation
   - Warn user: "PDF appears to be scanned images. Install poppler for OCR, or provide manual summary in _CONTEXT.md"

5. ONLY report as UNPROCESSABLE if:
   - Read(pdf) returns error, OR
   - Single PDF exceeds 20MB request limit even in clean context
   - Log which attempts were made and their error messages

Same for large MD files: MUST attempt Read(file, offset=0, limit=1000) before reporting as "too large"
```

**User stories:**
> As a researcher with PDF sources, I expect the agent to attempt all available tools before reporting a file as unprocessable. "Requires external tool" should only appear after documented Read tool failures.

---

### [BL-25] BUG: /extract False Numerical Reports (HIGH)

**Status:** ✅ COVERED BY BL-23 (commit f250d57)
**Priority:** P1 — High
**Origin:** TIMining QA testing (2026-02-15/16)
**Related:** BL-17, BL-23
**Resolution:** Disk validation logic in Phase 4 Report (BL-23 commit) resolves this issue

**Problem:**
Agent reports inflated numbers (intent-based) instead of verified counts (disk-based). SOURCE_MAP.md contains "EXTRACTED" entries for files never processed.

**Evidence:**
```
Report: "50 files processed, 800 claims"
Reality: 22 sections in EXTRACTIONS.md, ~480 claims
Discrepancy: 128% inflation

SOURCE_MAP: "Workshop 1/IMG_*.jpeg (21 photos) EXTRACTED"
EXTRACTIONS.md: Only 3 photo sections exist
```

**Root cause:**
- Skill reports from in-memory counters (intent)
- Context compaction can corrupt counters
- No validation against disk reality

**Fix:**
```markdown
### Phase 4: Report (Validation First)

BEFORE reporting numbers:
1. Re-read EXTRACTIONS.md from disk
2. Count sections: grep -c "^## \[" = files processed
3. Count claims: grep -c "^[0-9]\+\." = total claims
4. Compare against Phase 1 discovery list
5. Report ONLY verified numbers

If discrepancy detected:
- Report: "Warning: intended X files, EXTRACTIONS.md shows Y sections"
- List missing files from Phase 1 discovery
- Mark SOURCE_MAP entries as 'error' for missing files
```

**User stories:**
> As a researcher reviewing extraction results, I expect reported numbers to match reality. If the report says "50 files processed," I should find 50 sections in EXTRACTIONS.md.

---

### [BL-26] BUG: /extract No Auto-Batching for Large Projects (MEDIUM)

**Status:** ✅ COVERED BY BL-24 (commit 745b6e6)
**Priority:** P2 — Medium
**Origin:** TIMining QA testing (2026-02-15/16)
**Resolution:** Large Project Strategy in BL-24 commit adds auto-batching for >40 files or multiple PDFs >10MB

**Problem:**
Projects with >50 files processed in single run → context overflow → incomplete extraction. No automatic batching strategy.

**Evidence:**
- 61 files attempted in one run
- Context compacted 3 times (from earlier logs)
- Resulted in 38% completion

**Fix:**
```markdown
### Phase 1: Discover Sources

If total files > 40:
  1. Auto-divide by folder
  2. Process folder by folder with checkpoints
  3. Write EXTRACTIONS.md + SOURCE_MAP.md after each folder
  4. Report: "Large project (N files). Processing in M batches."

Batch size: 20-30 files per batch (conservative for mixed formats)
```

**User stories:**
> As a researcher with 100+ source files, I expect the extraction to complete automatically by processing in manageable batches, without manual intervention or context overflow.

---

### [BL-27] BUG: /extract SOURCE_MAP Corruption on Interruption (MEDIUM)

**Status:** ✅ IMPLEMENTED (v4.3, commit 13de3f5)
**Priority:** P2 — Medium
**Origin:** TIMining QA testing (2026-02-15/16)
**Implemented:** 2026-02-16 (overnight implementation)
**Related:** BL-17

**Problem:**
If extraction interrupts (timeout, permissions, crash), SOURCE_MAP.md may contain "optimistic" entries (status=EXTRACTED) for unprocessed files. Next incremental run trusts corrupted map → skips files that were never processed.

**Scenario:**
1. /extract starts, processes 10 files
2. Interrupted (permissions timeout, user absent)
3. Agent writes SOURCE_MAP with optimistic entries before exiting
4. Next /extract run (without --full) skips "already processed" files that don't exist in EXTRACTIONS.md

**Fix:**

**Option A: Incremental SOURCE_MAP writes**
```markdown
Update SOURCE_MAP.md after EACH file processed, not at end.
- Pro: Always accurate
- Con: More disk writes
```

**Option B: Validation on startup**
```markdown
### Phase 1b: Compute Delta

Before trusting SOURCE_MAP.md:
1. For each entry with status=EXTRACTED:
   - Verify corresponding ## [filename] exists in EXTRACTIONS.md
   - If missing: change status to 'error' with reason "missing from EXTRACTIONS"
2. Report corrupted entries to user before proceeding
```

**Recommended: Option B** (validation, less I/O overhead)

**User stories:**
> As a researcher whose extraction was interrupted, I expect the next run to detect and correct inconsistencies between SOURCE_MAP.md and EXTRACTIONS.md automatically.

---

### [BL-28] /analyze Incremental Processing — Track Processed Claims (CRITICAL)

**Status:** ✅ IMPLEMENTED (v4.3, commits 39e1909 + b06ac93)
**Priority:** P0 — Critical (architectural gap)
**Implemented:** 2026-02-16 (overnight implementation)
**Origin:** TIMining QA testing (2026-02-16)
**Related:** BL-17, BL-18
**Depends on:** BL-17 (SOURCE_MAP.md)

**Problem:**

/extract is INCREMENTAL (BL-17) but /analyze processes ALL claims every time, breaking the pipeline efficiency and risking duplicates.

**Current behavior:**
- /extract (incremental): 60 existing files + 3 new → processes only 3 new files (30 claims) ✅
- /analyze (full): reads ALL 756 claims (726 old + 30 new)
- Re-processes 726 claims that already became insights
- Deduplication check prevents duplicates BUT wastes processing time
- At scale (100+ files), this becomes prohibitively slow

**Consequence:**
The benefit of incremental /extract is lost. Adding 3 files to a 60-file project still requires full /analyze run.

**Desired behavior:**
- /analyze tracks which claims already processed
- On incremental run, only processes NEW claims (30)
- Updates convergence on existing insights if new claims match
- Example: 60 files + 3 new → /extract processes 3, /analyze processes 30 new claims ✅

---

**Implementation Options:**

**Option A: Claim-level tracking in EXTRACTIONS.md**

Add processing status to each claim:

```markdown
## [file.md] (extracted 2026-02-15, last analyzed 2026-02-15)

1. First claim text here
   Status: PROCESSED → [IG-42]

2. Second claim text here
   Status: PROCESSED → [IG-43]

3. New claim added later
   Status: PENDING
```

**Pros:**
- Explicit tracking per claim
- Can see which claims became which insights

**Cons:**
- Pollutes EXTRACTIONS.md with status metadata
- Makes file harder to read
- More complex parsing

---

**Option B: Separate EXTRACTIONS_LOG.md**

Track claim hash → insight ID mappings in separate log:

```markdown
# Extractions Processing Log

claim_hash_abc123 → [IG-42] (processed 2026-02-15T10:30)
claim_hash_def456 → [IG-43] (processed 2026-02-15T10:30)
claim_hash_789xyz → PENDING (extracted 2026-02-16T14:00)
```

**Pros:**
- Keeps EXTRACTIONS.md clean
- Easy to query "what's unprocessed"
- Can track processing history

**Cons:**
- Additional file to maintain
- Hash-based matching adds complexity
- Log can get large over time

---

**Option C: Timestamp-based (simplest)**

/analyze remembers last run timestamp from MEMORY.md, processes only files extracted after that:

```markdown
### Phase 1: Load Extractions (Incremental Mode)

1. Read 02_Work/MEMORY.md to find last /analyze timestamp
2. Read EXTRACTIONS.md and identify sections with "extracted YYYY-MM-DDTHH:MM" after that timestamp
3. Process ONLY those sections
4. For claims matching existing insights: increment convergence, add new source ref
5. For new claims: create new PENDING insights

**Example:**
- Last /analyze run: 2026-02-15T10:00
- EXTRACTIONS.md has 3 sections extracted 2026-02-16T14:00 (new files)
- Process only those 3 sections (30 claims)
- Skip 26 sections extracted before 2026-02-15T10:00
```

**Pros:**
- Simplest implementation
- No new files or metadata pollution
- Leverages existing MEMORY.md timestamps
- Natural fit with SOURCE_MAP.md architecture

**Cons:**
- If MEMORY.md is manually edited/cleared, loses tracking
- Can't selectively re-process specific old files without --full flag

---

**Recommended: Option C** (timestamp-based)

MEMORY.md already logs every skill execution with timestamps. /analyze can check:
1. Find last `/analyze` entry in MEMORY.md
2. Extract timestamp (e.g., `2026-02-15T10:00`)
3. Process only EXTRACTIONS sections with `extracted` timestamp AFTER that
4. Update MEMORY with new timestamp

**Fallback:** If no previous /analyze found in MEMORY, run in FULL mode (process everything).

**Flag:** Add `--full` flag to force full re-analysis when needed (e.g., after changing analysis logic).

---

**User Stories:**

**US-01: Incremental Processing Performance**
> As a researcher adding 3 new sources to a 60-file project, I expect /analyze
> to process only the new 30 claims (extracted from those 3 files), not re-process
> all 756 claims. Processing time should scale with new content, not total project size.

**US-02: Pipeline Consistency**
> As a developer, when /extract is incremental (BL-17), I expect /analyze to also
> be incremental so the pipeline remains efficient at scale. The workflow should be:
> add sources → /extract (fast, incremental) → /analyze (fast, incremental) → /synthesis.

**US-03: Convergence Updates**
> As a researcher, when a new claim matches an existing insight, I expect /analyze
> to increment the convergence count and add the new source reference, not create
> a duplicate insight.

**US-04: Full Re-analysis Option**
> As a developer debugging analysis logic, I expect to force full re-analysis with
> `/analyze --full`, ignoring incremental timestamps and re-processing everything.

---

**Implementation Notes:**

1. **Timestamp format:** MEMORY.md uses ISO format `YYYY-MM-DDTHH:MM` consistently
2. **Incremental detection:** Compare EXTRACTIONS section timestamps against last /analyze timestamp
3. **Deduplication:** Still run deduplication check (existing logic) to handle edge cases
4. **Convergence updates:** When new claim matches existing insight, update convergence ratio (e.g., `2/18 sources` → `3/18 sources`)
5. **MEMORY logging:** Log incremental stats: "Processed 30 new claims from 3 files. Skipped 726 claims from 57 unchanged files."

---

**Testing Criteria:**

- ✅ 60-file project + 3 new files → /analyze processes only 30 new claims
- ✅ New claim matching existing insight → convergence increments, no duplicate created
- ✅ `/analyze --full` forces full re-processing
- ✅ First run (no MEMORY) → processes all claims (full mode)
- ✅ Performance: incremental run 10x faster than full run on large projects

---

**Impact:**

At scale (100+ files, 1000+ claims), this is the difference between:
- **Without BL-28:** Adding 1 file requires re-processing 1000 claims (~5-10 minutes)
- **With BL-28:** Adding 1 file processes only 10 new claims (~30 seconds)

This is critical for BL-22 (RAG layer) viability — incremental analysis is prerequisite for scaling beyond 100 sources.

---

## ✅ Implemented (Archive)

<details>
<summary><strong>17 items — v3.0 to v4.2</strong> (click to expand for full context)</summary>

### ~~[BL-01] `/ship design-system`~~ — REMOVED

**Reason:** Crosses PD-Spec boundary into PD-Build responsibility.

---

### [BL-02] `/audit` — Strategic Quality Gate

**Status:** Implemented (diverged) — v4.0 O6
Skill exists but implements data-quality audit (traceability, coverage), not strategic audit (user validation depth). Both complementary.

**Proposed in:** v2.4 (2025-02-10)

---

### [BL-03] UX & Strategy Artifact Catalog — New `/ship` Types

**Status:** Partially Implemented — v4.0 Ola 4
5/6 types implemented: persona, journey-map, lean-canvas, user-stories, benchmark-ux. Missing: service-blueprint, success-metrics.

**Proposed in:** v2.4 (2025-02-10), expanded v3.0 (2025-02-13)

---

### [BL-04] Human Calibration Layer — "Add Context" + Field Notes

**Status:** Partially Implemented (~80%) — v4.0 I3
Confidence tagging done. Add Context exists in dashboard but NOT inline on cards. Field notes template exists.

**Proposed in:** v3.0 (2025-02-13)

---

### [BL-05] Source Diversity Gap Detection — `/analyze` Enhancement

**Status:** Implemented — v4.0 I2
6 source types, diversity matrix, score N/6, gap suggestions in /analyze Phase 2.

**Proposed in:** v3.0 (2025-02-13)

---

### [BL-06] Design Implications in SYSTEM_MAP — `/synthesis` Enhancement

**Status:** Implemented — verified TIMining QA (2026-02-14)
System map modules now have "Design implications" field derived from verified insights.

**Proposed in:** v3.0 (2025-02-13)

---

### [BL-07] `/extract` — Dedicated Source Extraction Skill

**Status:** Implemented (~95%) — v4.0 A1
Skill exists, all file types handled, fallbacks defined. Missing: quick-reference table (cosmetic).

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-08] Merge `/status` Into `/analyze` and `/synthesis` Output

**Status:** Absorbed by BL-12
Template+JSON architecture implemented. /status remains standalone but uses data/template separation.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-09] QA Fixes — Skill Hardening (29 findings)

**Status:** Implemented — v3.2
Timestamp ISO format, ID validation, atomicity guidance, conflict refs, status format fixes.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-10] Insight Temporal Tag — `current` vs `aspirational`

**Status:** Implemented — verified in /analyze SKILL.md
`(current)` and `(aspirational)` tags with criteria and examples.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-11] Convergence Tracking + Source Authority

**Status:** Implemented — verified in /analyze SKILL.md
Voice types (4), Authority levels (5), Convergence ratio X/Y with thresholds.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-12] Research Dashboard — STATUS.html Redesign (v0)

**Status:** Partially Implemented (~85%) — v4.0 A3
Template+JSON architecture built. 8 modules working. Missing: Timeline, Actors, inline Add Context.

**Proposed in:** TIMining QA (2026-02-14)
**Supersedes:** BL-08

---

### [BL-13] `/analyze` — Automatic Research Brief

**Status:** Implemented — verified in /analyze SKILL.md
5 sections (executive summary, thematic grouping, timeline, actors, gaps), writes to RESEARCH_BRIEF.md.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-14] `/extract` — Source Processing Progress Indicator

**Status:** Partially Implemented (~60%) — v4.0 I5
Per-folder + overall progress in conversation/MEMORY. Missing: dashboard integration.

**Proposed in:** TIMining QA (2026-02-14)

---

### [BL-15] Visual & Interaction Polish — HTML Template Upgrade

**Status:** Proposed
Typography, micro-interactions, data viz, accessibility improvements for all templates.

**Proposed in:** QA v2 (2026-02-15)

---

### [BL-16] PROJECT.md — Separate Project Settings from Engine Config (ARCH-01)

**Status:** ✅ Implemented — v4.2 (2026-02-15)
Project settings moved from CLAUDE.md to PROJECT.md. Prevents merge conflicts on PD-Spec updates.

**Proposed in:** ARCH-01 (QA v2, 2026-02-15)

**User stories (all met):**
- ✅ Merge without conflicts
- ✅ Kickoff writes to PROJECT.md
- ✅ Skills find settings reliably (with fallback)

**Files changed:** 10 (1 new + 9 modified)

---

### [BL-17] SOURCE_MAP.md — Incremental Extraction State (ARCH-02)

**Status:** ✅ Implemented — v4.2 (2026-02-15)
Per-file extraction state with MD5 hashing. /extract processes only NEW/MODIFIED files, skips UNCHANGED.

**Proposed in:** ARCH-02 (QA v2, 2026-02-15)

**User stories (all met):**
- ✅ Don't reprocess unchanged files
- ✅ Know what failed and retry
- ✅ Recover from partial deletion

**Performance:** Adding 3 new files to 57 existing → 3 processed, 54 skipped (~2 min vs 25 min).

**Testing (2026-02-16):** Verified working correctly on TIMining project (61 files). Delta computation detects NEW/UNCHANGED accurately.

**Known issues:** See BL-23 to BL-27 for execution bugs (not architecture issues).

**Files changed:** 3 (1 new + 2 modified)

---

### ~~[BL-21] FRAMEWORK.md Sync — Major Documentation Debt~~ — RESOLVED

**Status:** Resolved (2026-02-15)
Content redundant with README + CLAUDE.md. File cleared, reserved for future PD-OS methodology docs.

---

</details>

---

## Archive Notes

Full context for implemented items preserved above. For version-specific changes and user-facing highlights, see [`CHANGELOG.md`](CHANGELOG.md).

Last updated: 2026-02-16
