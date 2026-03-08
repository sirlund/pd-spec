---
name: analyze
description: Synthesize raw claims from 02_Work/EXTRACTIONS.md into insights, assess evidence quality, detect gaps, and produce a readiness diagnostic for /spec. Requires /extract first. Incremental by default (only new extractions), use --full to reprocess all.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
argument-hint: "[--full | --file <section>...]"
---

# /analyze — Synthesis & Readiness Diagnostic

## What this skill does

Reads raw claims from `02_Work/EXTRACTIONS.md`, synthesizes them into insights, evaluates evidence quality using deterministic tier rules, detects gaps, and writes a readiness diagnostic: **are you ready for /spec?**

Runs autonomously — no approval gates, no interactive questions. Works identically in CLI and SDK runs.

**Prerequisite:** Run `/extract` first.

**Language:** Read `output_language` from `PROJECT.md` before doing anything else. Write ALL content — insight descriptions, evidence quotes, ANALYSIS.md, MEMORY.md entries — in that language. System identifiers (`[IG-XX]`, `[IG-SYNTH-XX]`, `[CF-XX]`), status labels (`PENDING`, `VERIFIED`), category names, and tier labels (`Señal`, `Hipótesis`, `Supuesto`) always stay in English.

---

## Phase 1: Load

**1. Read context**
- Read `PROJECT.md` → get `output_language`. Default to `en` if missing.
- Check flags: `--full` (reprocess all), `--file <section>` (specific sections only), no flags (incremental).

**2. Index check (silent optimization)**
Check `02_Work/_index/EXTRACTIONS_INDEX.md`. If fresh (compare hash against `md5 -q 02_Work/EXTRACTIONS.md | cut -c1-8`) → use index to identify sections and line ranges. If stale or missing → read full file. Never fail because index is absent.

**3. Load extractions**
Read `02_Work/EXTRACTIONS.md`. If missing or empty: output "No extractions found. Run `/extract` first." and stop.

**4. Incremental filter**
- `--full`: process all sections.
- `--file <section>`: process only named sections. Warn if a section name is not found.
- Default: read `02_Work/MEMORY.md` for last `/analyze` timestamp. Process only sections with `extracted:` timestamp newer than that. If no timestamp found → full mode.
- Log: `Mode: INCREMENTAL (N new sections, Y skipped)` or `Mode: FULL (N sections)`.

**5. Load existing insights**
Check `02_Work/_index/INSIGHTS_GRAPH_INDEX.md`. If fresh → read index (~5 KB) for dedup scanning. Read full entries only when detailed comparison is needed. If stale/missing → read `02_Work/INSIGHTS_GRAPH.md` in full.

---

## Phase 2: Synthesize

For each claim in the filtered sections, synthesize directly into insights. No intermediate atomic storage — the insight IS the output.

**6. Group claims by theme**
Scan claims across all filtered sections. Group claims that describe the same underlying need, problem, or observation — even if worded differently across sources.

- **1 source for a theme** → create an `[IG-XX]` (atomic insight).
- **≥2 sources for a theme** → create an `[IG-SYNTH-XX]` (consolidated insight).

Use `./scripts/next-id.sh ig 02_Work/INSIGHTS_GRAPH.md` for IG IDs, `./scripts/next-id.sh synth` for IG-SYNTH IDs. If unavailable, scan existing IDs manually (two-digit minimum: IG-01…IG-99, then IG-100+).

**7. Apply evidence tiers (deterministic)**

Assign each insight a tier based on these rules — no interpretation, no judgment calls:

| Tier | Rule |
|---|---|
| **Señal** | ≥3 sources expressing same need (direct-quote or observation) OR stakeholder + user corroboration aligned OR document fact (metric, contract, spec) OR `category: constraint` OR `category: design-framework` with `Grounded in: [IG-XX]` refs and ≥2 sources |
| **Hipótesis** | 1–2 sources OR stakeholder without user corroboration OR `design-framework` without `Grounded in:` refs |
| **Supuesto** | Stakeholder-only with no user backing OR `voice: ai` (any count) |

**Tradeoff rule:** When a `constraint` conflicts with a `user-need` Señal → do NOT resolve. Flag as explicit tradeoff in the diagnostic: *"⚡ Tradeoff: users need X, but constraint Y limits this — strategic decision required."*

**8. Categorize each insight**

| Category | What it captures |
|---|---|
| `user-need` | User pain, need, behavior, or desire |
| `business` | Business objectives, metrics, model |
| `constraint` | Non-negotiable limits: runway, regulatory, capital, hard deadlines |
| `technical` | System capabilities or technical limits |
| `design-framework` | Design principles with evidence trail |

Add temporal tag: `(current)` for present state, `(aspirational)` for desired future. Default to `(current)` if ambiguous.

`design-framework` insights MUST include `Grounded in: [IG-XX]` — a design principle without evidence is a Homer's Car.

**9. Assign voice and authority**

| Voice | Who |
|---|---|
| `user` | End-user or operator |
| `stakeholder` | Internal decision-maker (CEO, CTO, PM) |
| `document` | Written artifact without personal attribution |
| `researcher` | Research team observation |
| `ai` | AI-generated content — always `authority: hypothesis`, never VERIFIED alone |

| Authority | How they know |
|---|---|
| `direct-quote` | Verbatim statement |
| `observation` | Something witnessed or measured |
| `hypothesis` | Unvalidated proposal ("we think…") |
| `vision` | Aspirational future state |
| `fact` | Verifiable data point (metric, date, spec) |

**10. Dedup against existing insights**
Before writing any new insight, check if an existing insight captures the same claim (semantic match, same category). If duplicate → update convergence count on existing insight, add source ref if new. Log: `Convergence updated [IG-XX]: 2/N → 3/N`. Do NOT create a new insight.

**11. Detect conflicts**
Compare new insights against existing insights. Flag:
- Direct contradictions ("users love X" vs "users avoid X")
- Tensions (simplicity goal vs. customization demand)
- Temporal conflicts ("currently using Y" vs "already migrated to Z")
- Tradeoffs (constraint vs. user-need — see step 7)

---

## Insight Format

**Atomic (1 source):**
```markdown
### [IG-XX] [Claim — one idea only]
Category: user-need (aspirational)
Voice: user | Authority: direct-quote
Tier: Hipótesis
Convergence: 1/N sources
Ref: 01_Sources/path/to/source.md
Status: PENDING
> "Key quote from source"
```

**Synthesized (≥2 sources):**
```markdown
### [IG-SYNTH-XX] [Named Concept — use language from sources, never invent]
Category: user-need (current)
Voice: user, stakeholder | Authority: direct-quote, observation
Tier: Señal
Convergence: 3/N sources
Refs: source1.md, source2.md, source3.md
Status: PENDING

> [2–3 sentences: problem + evidence trail + impact]

Evidence:
- source1.md: "quote"
- source2.md: "quote"
- source3.md: "quote"
```

Status is always `PENDING` — plain text, no bold, no backticks.

---

## Phase 3: Detect Gaps

**12. Coverage gaps**
Identify areas where the knowledge base is thin or absent. Flag:
- Strategic claims with only 1 source (fragile — no corroboration)
- Missing perspectives: user-need claims with no user voice (only stakeholder assumptions)
- Missing source types relevant to the project (e.g., no technical sources when technical claims are made, no competitive context when market positioning is claimed)
- Insights where voice is `ai` only — require non-AI corroboration before /spec

For each gap, suggest a concrete action: interview type, research method, document to obtain.

---

## Phase 4: Write

**13. Write insights** — Append new insights to `02_Work/INSIGHTS_GRAPH.md` under appropriate `## Section` headers. Write in batches by section, never all at once.

**14. Write conflicts** — For each detected conflict, append to `02_Work/CONFLICTS.md` as PENDING with `[CF-XX]` ID. Both sides must reference `[IG-XX]` IDs.

**15. Write diagnostic** — Write `02_Work/ANALYSIS.md`:

```markdown
# Análisis — [Project Name]
> /analyze · YYYY-MM-DD · N sources · M insights

## ✅ Definido (N)
[Señal-tier insights — high confidence, ready for /spec]
- [IG-SYNTH-01] [claim] — Convergence: 3/5 sources

## 💭 Hipótesis (N)
[Needs validation before building on it]
- [IG-03] [claim] — 1 user source, no corroboration

## ⚠️ Supuesto (N)
[Stakeholder or AI only — risky foundation for spec]
- [IG-05] [claim] — stakeholder vision, no user backing

## ⚡ Tradeoffs (N)
[Constraint vs. user-need collisions requiring strategic decision]
- Runway 6 months vs. [IG-SYNTH-02] users need deep customization

## ❌ Gaps (N)
[Missing coverage — needed before /spec]
- No user research on [topic] — suggest: 3 user interviews
- No technical sources — feasibility of [claim] unvalidated

## → Antes de /spec
1. [Concrete action to fill most critical gap]
2. [Next action]

## Veredicto
**ready** | **partial** (falta: X, Y) | **not ready** (falta: A, B, C)
```

Veredicto rules:
- `ready`: ≥50% of insights are Señal, no critical gaps
- `partial`: mix of Señal + Hipótesis, gaps exist but /spec can proceed with caveats
- `not ready`: majority Supuesto, critical gaps (no user research, only 1 source total)

**16. Write to memory** — Append to `02_Work/MEMORY.md`:
```
## [YYYY-MM-DDTHH:MM] /analyze [--full]
- Mode: INCREMENTAL (N sections, Y skipped) | FULL (N sections)
- Insights: X new (A Señal, B Hipótesis, C Supuesto) · Y convergence updates
- Conflicts: Z new PENDING
- Veredicto: ready | partial | not ready
- Snapshot: T insights (V VERIFIED, P PENDING) · C conflicts PENDING
```
Count from files using Bash, not from memory:
```bash
grep -c '### \[IG-' 02_Work/INSIGHTS_GRAPH.md
grep -c 'Status: PENDING' 02_Work/INSIGHTS_GRAPH.md
grep -c '### \[CF-' 02_Work/CONFLICTS.md
```

**17. Regenerate index** — Run `./scripts/generate-index.sh insights 02_Work/INSIGHTS_GRAPH.md`. Skip silently if unavailable.

---

## Phase 5: Report

Output only:
```
✓ Analysis complete: [N insights · C conflicts · Veredicto: ready/partial/not ready]
Mode: [INCREMENTAL: N new sections, Y skipped | FULL: N sections]
→ See 02_Work/ANALYSIS.md for full diagnostic
```

Include brief notes only if action is needed:
- Tradeoffs detected (count)
- Critical gaps (count)
- Fragile insights with no corroboration (count)

Do NOT print the full insight list or diagnostic in terminal — it's in ANALYSIS.md.
