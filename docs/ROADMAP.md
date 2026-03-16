# ROADMAP — PD-Spec

> Single source of truth for planning. Replaces BACKLOG_REPRIORITIZATION.md (v1, v2) and the informal Waves A–D from memory.
> Calibrated against real velocity data (Feb 15 – Mar 9, 2026).

---

## Velocity Calibration

```
Period:      Feb 15 – Mar 9 (23 calendar days, 20 active)
Commits:     375 total → 19/day (build phase), 2/day (planning phase)
Lines:       85,697 changed → 4,285/day (build), ~800/day (planning)
Net growth:  36,055 lines → 1,803 net/day

Effort mapping (from actuals):
  S  = 1 day    (BL-111, BL-112, BL-109: 1-3 commits, <500 lines)
  M  = 2-3 days (BL-110, BL-113, BL-108: 3-7 commits, 500-3K lines)
  L  = 5-7 days (BL-80, BL-33: 7-18 commits, 3K+ lines)

Projection basis: 12 commits/day avg (conservative — accounts for QA + planning days)
```

---

## Completed Waves

### ✅ Wave 1 — "Flujo Desbloqueado" (Feb 15–25, v4.0→v4.25)

Established the full pipeline: `/extract` → `/analyze` → `/spec` → `/ship`.
Insight lifecycle (6 statuses), utility scripts, Live Research App v1, showcase v1.

**10 days, 190 commits, v4.0 → v4.25.2**

### ✅ Wave 2 — "Fundación Técnica" (Feb 26–Mar 9, v4.26→v4.29)

SDK migration, index system, token optimization, parallel extraction, markitdown preprocessing.

**12 days, 185 commits, v4.26 → v4.29.0**

Key deliverables:
- BL-80 Phase 1 (SDK Migration) ✅
- BL-101 (Index System, 83% token savings) ✅
- BL-113 (markitdown preprocessing) ✅
- BL-114/115 (Parallel extraction + consolidate.sh) ✅
- BL-108 (Tab persistence) ✅, BL-110 (Extract quality) ✅
- BL-111 ✅, BL-112 ✅

---

## Active Waves

```
              Q1 2026                          Q2 2026
  ┌─────────────────────────┐  ┌──────────────────────────────────────────────┐
  Mar 10    Mar 17    Mar 24    Mar 31    Apr 7     Apr 14    Apr 21    Apr 28    May
  ─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼───
           │                   │         │                              │
  ├────────────────────────────────────┤ │                              │
  │  WAVE 3: Opinionated Pipeline      │ │                              │
  │  ~20 days build                    │ │                              │
  │  Mar 10 ─────────────────── Apr 4  │ │                              │
  ├────────────────────────────────────┘ │                              │
           │                   │         │                              │
           │                   │ ├───────────────────────────────────────────┤
           │                   │ │  WAVE 4: App Deployable                   │
           │                   │ │  ~22 days build                           │
           │                   │ │  Apr 7 ──────────────────────────── May 2 │
           │                   │ ├───────────────────────────────────────────┘
           │                   │         │                              │
           │                   │         │                         May  │  Jun
           │                   │         │                         ─────┼─────────┼───
           │                   │         │                              │
           │                   │         │                         ├─────────────────┤
           │                   │         │                         │  WAVE 5:        │
           │                   │         │                         │  Multi-Modelo   │
           │                   │         │                         │  May 5 ── May 23│
           │                   │         │                         ├─────────────────┘
           │                   │         │
  Q1 CLOSE ──────────────────────────────┘
  Wave 3 should be 80%+ by Mar 31
```

---

### Wave 3 — "Amplifier, Not Process" (Mar 10 – Apr 4)

> **Goal:** PD-Spec is a design partner on-demand, not a process tool. Adapts to project type, user experience, and what exists.
> **Success metric:** A founder with no design team can start a project from conversation alone. A senior designer uses PD-Spec as a sparring partner without touching the pipeline.
> **Design brief:** [`docs/DESIGN_3_5.md`](DESIGN_3_5.md)

| # | Item | What | Effort | Days | Depends on |
|---|------|------|--------|------|------------|
| 3.1 | ✅ /spec autonomous | Smart gates: auto-resolve when evidence is clear, AskUserQuestion only for comparable+high-impact | S | 1 | — |
| 3.2 | ✅ /ship autonomous | Transparent outline, no approval gate, proceeds to generate | S | 1 | — |
| 3.3 | ✅ System prompt scope | Q&A disallowedTools blocks Read/Grep/Glob/Bash + scope restriction in prompt | S | 0.5 | — |
| 3.4 | ✅ Checkpoint fix | Removed preamble line blocking MEMORY.md and SESSION_CHECKPOINT.md writes | S | 0.5 | — |
| 3.5a | BL-128 Flexible pipeline | Remove forced sequential dependencies. Skills check what's available and adapt. | S | 1-2 | 3.1, 3.2 |
| 3.5b | BL-129 Kickoff project type | `/kickoff` asks project type + user profile. Skills adapt tone and depth. | S | 1 | — |
| 3.5c | Conversation as ingestion | PD-Spec interviews the user. Claims produced live, tagged with evidence quality. | M | 3-4 | 3.5a, 3.5b |
| 3.5d | Workshop mode | Formalize ad-hoc work: crosses, stakeholder artifacts, `_temp/` with traceability. | S-M | 2 | 3.5a |
| 3.5e | All voices as evidence | Remove pro-user-voice bias in /analyze. Evidence Quality Model from ingestion. | S | 1 | 3.5c |
| 3.7 | BL-99 Conflict lifecycle | **Scope reduced:** conflicts UI becomes audit log. History view + decision transparency. | S-M | 1-2 | — |
| | | | **Total** | **~13** | |

**Absorbed into 3.5:**
- ~~3.6 BL-89 Truth levels~~ → replaced by Evidence Quality Model (part of 3.5c/3.5e)
- ~~3.8 BL-100 MASTER deliverable~~ → deferred to Layer 3 as stakeholder-specific artifacts
- ~~3.9 Guided Interview~~ → absorbed into 3.5c (conversation as ingestion)

**Critical path:** ~~3.1-3.4 (3d)~~ ✅ → 3.5a+3.5b (2d) → 3.5c (4d) → 3.5e (1d) = **~7 days remaining**
Items 3.5d, 3.7 are independent — interleave during build.

**End state:** PD-Spec adapts to three project types (ecosystem / from scratch / MVP) and three entry points (files / conversation / existing product). Pipeline is a suggested default, not a wall. Evidence quality assessed from ingestion. Workshop mode is first-class.

---

### Wave 4 — "App Deployable" (Apr 7 – May 2)

> **Goal:** The webapp is publicly accessible and usable without hand-holding.
> **Success metric:** A new user can access a URL, run the pipeline, and understand what's happening.

| # | Item | What | Effort | Days | Depends on |
|---|------|------|--------|------|------------|
| 4.1 | BL-127 Unified panel | Merge Agent + Chat into single panel. Root fix for OBS-ship-ui-01/02 | L | 5 | Wave 3 |
| 4.2 | BL-120 Task Tracker | Structured SSE events, stepper UI with parallel progress | M | 3 | 4.1 |
| 4.3 | BL-104 Response history | Collapsible cards for previous runs, persist across navigation | M | 2 | 4.1 |
| 4.4 | OBS-BL114-01 | Worker logs show filename | S | 0.5 | 4.2 |
| 4.5 | **BL-83 Deploy público** | Single-tenant deploy, auth (magic link or OAuth), public URL | L | 7 | 4.1 |
| 4.6 | BL-123 License BSL 1.1 | Replace MIT, add USAGE.md | S | 1 | — |
| 4.7 | BL-119 CLI onboarding | setup.sh / npx init for new users | S-M | 2 | 4.6 |
| 4.8 | UI quick wins | OBS-13 (SystemMap view), OBS-QA9-06 (StrategicVision layout), OBS-35 (badge sync), OBS-W1-04 (rejection reason), OBS-W1-05 (collapse glitch), BL-107 (CSS tokens) | S×6 | 4 | — |
| 4.9 | OBS-BL114-02 | Parallel threshold considers size_kb, not just file count | S | 0.5 | — |
| | | | **Total** | **~25** | |

**Critical path:** 4.1 (5d) → 4.5 (7d) = **12 days sequential**
Items 4.6–4.9 are independent — interleave or front-load.

**End state:** Webapp deployed at public URL with auth. Agent panel is unified, shows structured progress. New users can onboard via script.

---

### Wave 5 — "Multi-Modelo" (May 5 – May 23)

> **Goal:** Users bring their own API key (Gemini, OpenAI, Codex). Webapp is no longer Claude-only.
> **Success metric:** Hugo can use his Gemini API key and run the full pipeline.

| # | Item | What | Effort | Days | Depends on |
|---|------|------|--------|------|------------|
| 5.1 | Provider abstraction | Abstract claude.js into provider module. Gemini + OpenAI adapters | L | 7 | Wave 4 |
| 5.2 | API key management | UI for users to configure their API key + provider selection | M | 2 | 5.1 |
| 5.3 | Model routing v2 | BL-80 Ph2 — Haiku/Sonnet equivalent per provider, cost estimation | M | 3 | 5.1 |
| 5.4 | E2E validation | BL-122 — benchmark quality across providers | M | 2 | 5.1 |
| | | | **Total** | **~14** | |

**End state:** Webapp works with Claude, Gemini, or OpenAI. Users bring their own key. Skills are provider-agnostic (already true by design).

---

### Wave 6 — "Producto Completo" (Jun – Q3)

> **Goal:** Full product for the three segments: solo founders, design-debt companies, scale-ups with Lead.

| # | Item | What | Effort |
|---|------|------|--------|
| 6.1 | BL-56 Export | PPTX, Google Docs, PDF export from deliverables | L |
| 6.2 | BL-106 MCP App | PD-Spec as MCP Server (depends on Wave 5 multi-modelo) | L |
| 6.3 | Custom methodology | Power users configure their own question waves + frameworks | L |
| 6.4 | BL-124 Parallel /analyze | Haiku workers for synthesis (75-85% cost reduction) | M |
| 6.5 | File upload + Drive | Drag-and-drop sources, Google Drive picker | M+L |
| 6.6 | Multi-proyecto UI | Project selector in webapp | M |

**Estimated:** 6-8 weeks depending on scope decisions.

---

## What's Parked (not dead, not scheduled)

| Item | Why parked | Revive when |
|------|-----------|-------------|
| BL-102 v2/v3 (Showcase multi-deck, themes) | Not priority. Potential as separate repo for interactive artifacts | User validates with third parties |
| BL-82 (Audit mode) | Overlaps with Critic agent pattern | Wave 6 if quality needs automated QA |
| BL-121 (Phase 1.5 transcript preprocessing in parallel) | Granola handles this adequately | Users without Granola need speaker attribution |
| BL-87 remaining (Challenge action + stale conflict detection) | Partially done. Rest depends on BL-99 | After Wave 3.7 |

## What's Archived

Moved to `docs/archive/`:
- `BACKLOG_REPRIORITIZATION.md` (v1, 2026-02-24) — superseded by v2, then by this ROADMAP
- `BACKLOG_REPRIORITIZATION_V2.md` (2026-03-01) — superseded by this ROADMAP
- `STATUS_POST_SDK_MIGRATION.md` (2026-03-03) — snapshot, no longer current

## Decisions Log

| ID | Decision | Date |
|----|----------|------|
| DB-01 | **Depends on profile:** project for startups, continuous for enterprise. Tool supports both. | 2026-03-09 |
| DB-02 | **Guided Interview pattern:** agent proposes structured plan via themed Q&A waves, user accepts/modifies/rejects. | 2026-03-09 |
| D-18 | **Quality > features:** Wave 3 focuses on making outputs opinionated before adding more surface area. | 2026-03-09 |
| D-19 | **Multi-modelo is Wave 5:** solidify pipeline with Claude first, abstract provider later. | 2026-03-09 |
| D-20 | **Webapp IS the product:** but blocked by vendor lock-in. Unlocked in Wave 5. | 2026-03-09 |
| D-21 | **Guided Interview is a UX pattern:** applies to /spec, /ship, methodology config. Core interaction model. | 2026-03-09 |
| D-22 | **Amplifier, not process:** PD-Spec is a design partner on-demand. Pipeline is one mode, not THE mode. Frameworks invisible. | 2026-03-15 |
| D-23 | **Three project types:** ecosystem redesign / from scratch / existing MVP. Defined at kickoff, shapes all skill behavior. | 2026-03-15 |
| D-24 | **Evidence Quality Model:** assess HOW evidence was obtained (anonymous > third-party interview > founder interview > intuition). Applied from ingestion. | 2026-03-15 |
| D-25 | **"Apply design frameworks" deprecated:** frameworks power the engine internally but user never sees framework names. | 2026-03-15 |

---

## Quarterly View

```
Q1 2026 (Feb 15 – Mar 31)
├── Wave 1 ✅ Flujo Desbloqueado        10 days   190 commits
├── Wave 2 ✅ Fundación Técnica          12 days   185 commits
└── Wave 3 ◐ Opinionated Pipeline       ~80% by Mar 31

Q2 2026 (Apr 1 – Jun 30)
├── Wave 3 ◐ Complete remaining 20%
├── Wave 4   App Deployable              ~4 weeks
├── Wave 5   Multi-Modelo                ~3 weeks
└── Wave 6   Producto Completo starts

Q3 2026 (Jul 1 – Sep 30)
└── Wave 6   Producto Completo
```

---

*Last updated: 2026-03-16. Wave 3 redefined after design session (see `docs/DESIGN_3_5.md`). Next review: end of Wave 3 (~Apr 4).*
