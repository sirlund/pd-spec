---
name: analyze
description: Synthesize raw claims from 02_Work/EXTRACTIONS.md into insights, assess evidence quality, detect gaps, and produce a readiness diagnostic for /spec. Supports conversational ingestion (interview mode). Incremental by default (only new extractions), use --full to reprocess all.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, AskUserQuestion
argument-hint: "[--full | --file <section>...]"
---

# /analyze — Synthesis & Readiness Diagnostic

## What this skill does

Reads raw claims from `02_Work/EXTRACTIONS.md`, synthesizes them into insights, evaluates evidence quality using deterministic tier rules, detects gaps, and writes a readiness diagnostic: **are you ready for /spec?**

Runs autonomously — no approval gates, no interactive questions. Works identically in CLI and SDK runs.

**Adaptive start:** Check if `02_Work/EXTRACTIONS.md` exists AND contains at least one extraction section (look for a `## [` header below the template comment). If yes → proceed normally (Phase 1). If NOT (file missing, or exists but has no claim sections) → use `AskUserQuestion` to offer the user three options:
1. Add files to `01_Sources/` and run `/extract`
2. Paste content directly in chat
3. "Tell me about your project" → **enter Interview Mode** (see below)

Use `AskUserQuestion` for this initial routing choice — it's a structured decision. Once the user picks option 3, switch to direct conversational mode (no more AskUserQuestion during the interview itself).

Do NOT abort — if the user provides context conversationally, work with what you have.

**Language:** Read `output_language` from `PROJECT.md` before doing anything else. Write ALL content — insight descriptions, evidence quotes, ANALYSIS.md, MEMORY.md entries — in that language. System identifiers (`[IG-XX]`, `[IG-SYNTH-XX]`, `[CF-XX]`), status labels (`PENDING`, `VERIFIED`), category names, and tier labels (`Señal`, `Hipótesis`, `Supuesto`) always stay in English.

---

## Interview Mode (Conversational Ingestion)

When the user chooses to tell you about their project (option 3 in adaptive start, or says things like "let me explain", "I'll describe it"), enter interview mode. This is a structured but invisible interview — the user experiences a natural conversation, not a questionnaire.

### Interview Protocol

**Interview style:** Use `AskUserQuestion` for each interview question. This provides structure, guides users who don't know what to say, and lets the agent adapt options dynamically based on prior answers. Each question should offer 2-4 relevant options plus a free-text option. Adapt the options based on what the user has already told you — the interview deepens, not repeats.

**When NOT to use AskUserQuestion:** Brief acknowledgments, transitions between topics, and short clarifications that don't need structured options. These go as inline text.

**Exclusive vs. non-exclusive questions:** Before writing options, determine if the question is exclusive (only one answer makes sense) or non-exclusive (multiple answers are natural). Heuristic: if the question uses plural ("quiénes", "qué restricciones") or answers aren't mutually exclusive → non-exclusive. For non-exclusive: include "Varios / combinación de los anteriores" as last option before free text. If selected, follow up with "¿Cuáles aplican? Mencionálos." as free text.

**Internal progression (invisible to user):** Track coverage across 6 themes. You do NOT need to cover them in order — follow the conversation naturally, but ensure you touch them. 3-8 exchanges max.

| Theme | What to surface | Example AskUserQuestion options |
|---|---|---|
| Context | What the project is, who it's for, current state | "Contame de qué va el proyecto" / options about domain, users, current state |
| Jobs-to-be-Done | What users are trying to accomplish, what success looks like | Options about user goals, success metrics, current workarounds |
| Evidence | How they know what they know — surfaces evidence quality tags | Options: "Tenemos datos/métricas", "Hicimos entrevistas", "Es nuestra percepción", etc. |
| Friction | Current pain points, workarounds, failed attempts | Options about specific pain areas based on what they've described |
| Constraints | Non-negotiables: budget, timeline, regulatory, technical | Options: timeline, tech debt, budget, regulatory, team capacity |
| Aspiration | Vision, differentiation, future state | Options about vision, differentiation, future state |

**Evidence quality probing:** When the user makes a claim, ask how they know — using AskUserQuestion with evidence type options. The agent must NEVER infer evidence quality from context — always ask explicitly. Assign tags ONLY after the user describes the methodology:

| Tag | AskUserQuestion option (adapt language to context) | Signal strength |
|---|---|---|
| `[OBSERVED]` | "Lo medimos / hay datos / analytics lo muestran" | Strong |
| `[INTERVIEW-3P]` | "Un investigador/diseñador externo lo entrevistó" | Strong |
| `[INTERVIEW-SELF]` | "Nosotros mismos lo entrevistamos" | Medium (flag: interviewer bias) |
| `[INTUITION]` | "Es nuestra percepción / experiencia" | Weak (suggest validation) |
| `[DEMO-FEEDBACK]` | "Lo dijeron en un demo / llamada de ventas" | Weak (flag: social bias) |
| `[FACT]` | "Está en el contrato / es dato verificable" | Strong |

**Anti-pattern:** "The founder said users hate the UI" → do NOT auto-tag as `[INTUITION]`. Use AskUserQuestion: "¿Cómo llegaron a eso?" with options mapping to the evidence tags above. The answer determines the tag.

**user_profile calibration:** Read `user_profile` from `PROJECT.md` (set by `/kickoff`). Adapt interview depth and tone:

| user_profile | Interview style |
|---|---|
| `founder_solo` | Deeper probing, more "¿cómo lo sabés?" questions, constructive pushback on assumptions. Founders often conflate intuition with evidence — help them distinguish. |
| `designer` | Peer-level questions, skip basics, focus on evidence gaps and user research coverage. Less hand-holding. |
| `team_with_research` | Ask about existing research, where it lives, coverage gaps. Lighter questioning — they likely have answers. Focus on what's NOT covered. |
| _(not set)_ | Balanced default — ask naturally, no special calibration. |

**Coverage tracking:** After 3-8 exchanges, check internal coverage. If major themes are missing, ask one or two targeted questions. Do NOT extend beyond 8 exchanges — work with what you have.

### Writing Conversational Claims

After the interview concludes (user signals done, or 8 exchanges reached), write claims to `02_Work/EXTRACTIONS.md`:

```markdown
## [Conversación YYYY-MM-DD]
- Type: conversation
- Participants: [user_profile from PROJECT.md, or "user" if not set]
- Evidence Quality: mixed

### Raw Claims
1. "Claim text as stated by user" [EVIDENCE-TAG]
2. "Another claim" [EVIDENCE-TAG] (flag: suggest validation)
3. "Constraint claim" [FACT]
```

**Rules for claim writing:**
- One claim per atomic concept — do NOT bundle multiple ideas into one claim
- Preserve the user's language and framing
- Include the evidence quality tag on every claim
- Add flags where relevant: `(flag: interviewer bias)`, `(flag: suggest validation)`, `(flag: social bias)`
- If the user never clarified the evidence basis for a claim, tag as `[INTUITION]` and add `(flag: evidence basis not confirmed)`
- **No elaboration** — claims must be verbatim or near-verbatim user statements. Do NOT synthesize, infer, or expand beyond what was said. AskUserQuestion option text counts as "what the user said" since they explicitly selected it.
- **Dedup across questions** — if two questions produce the same core information, write one claim. When in doubt, keep both — easier to merge later than to recover lost nuance.
- **FACT for self-declared realities** — user states their own constraint, vision, decision, or org fact → [FACT]. User speculates about external reality without evidence ("users probably want X") → [INTUITION]. Still add scope flags: `(flag: aspiracional)`, `(flag: sin fecha específica)`, `(flag: decisión del equipo, no validada técnicamente)`.

After writing to EXTRACTIONS.md, proceed to **Phase 1** (the claims are now in EXTRACTIONS.md, so the normal pipeline takes over). Use `--file "Conversación YYYY-MM-DD"` mode to process only the new conversational section.

---

## Phase 1: Load

**1. Read context**
- Read `PROJECT.md` → get `output_language`, `user_profile`. Default to `en` / unset if missing.
- Check flags: `--full` (reprocess all), `--file <section>` (specific sections only), no flags (incremental).

**2. Index check (silent optimization)**
Check `02_Work/_index/EXTRACTIONS_INDEX.md`. If fresh (compare hash against `md5 -q 02_Work/EXTRACTIONS.md | cut -c1-8`) → use index to identify sections and line ranges. If stale or missing → read full file. Never fail because index is absent.

**3. Load extractions**
Read `02_Work/EXTRACTIONS.md`. If missing or has no claim sections (empty template) and not in interview mode: use `AskUserQuestion` with the same three options as adaptive start (same routing, not inline text).

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

**Granularity rules — when to separate vs. consolidate:**
- **Separate** when claims have different categories, different sources, or could be independently verified or invalidated.
- **Separate** when claims describe different problems even if they share a topic (e.g., "users lack time" and "users lack tools" are two insights, not one).
- **Consolidate** only when two claims are the same observation stated differently from different sources.
- **When in doubt, separate.** It's easier to merge later than to split. Aim for 1 insight per atomic concept — 20 sources should produce ~15-30 insights, not 5-8.
- Do NOT bundle multiple problems or needs into one IG-SYNTH-XX. Broad "umbrella" insights lose traceability and make /spec harder.

**Product-relevance filter (for `project_type: digital_product`):** Only create insights for claims that inform product design decisions: user needs, product limitations, technical constraints, business strategy/vision, competitive positioning. Do NOT create `[IG-XX]` for internal operational claims (sales process, team operations, lead qualification, HR). These stay in EXTRACTIONS.md as raw claims. Exception: an operational claim that reveals a product gap ("demos fail because the product can't show X") → the gap IS an insight.

Use `./scripts/next-id.sh ig 02_Work/INSIGHTS_GRAPH.md` for IG IDs, `./scripts/next-id.sh synth` for IG-SYNTH IDs. If unavailable, scan existing IDs manually (two-digit minimum: IG-01…IG-99, then IG-100+).

**7. Apply evidence tiers (deterministic)**

Assign each insight a tier based on these rules — no interpretation, no judgment calls:

| Tier | Rule |
|---|---|
| **Señal** | ≥3 sources expressing same need (direct-quote or observation) OR ≥2 distinct voices aligned (any combination except `ai`) OR document fact (metric, contract, spec) OR `category: constraint` OR `category: design-principle` with `Grounded in: [IG-XX]` refs and ≥2 sources |
| **Hipótesis** | 1–2 sources from a single voice OR `design-principle` without `Grounded in:` refs |
| **Supuesto** | `voice: ai` (any count) OR claims tagged `[INTUITION]` or `[DEMO-FEEDBACK]` without corroboration from other sources |

**Evidence quality tag behavior:** When claims carry evidence quality tags (from conversational ingestion), apply these additional rules:
- `[OBSERVED]`, `[INTERVIEW-3P]`, `[FACT]` → strong signal, counts normally toward tier
- `[INTERVIEW-SELF]` → medium signal, flag potential interviewer bias in the insight
- `[INTUITION]`, `[DEMO-FEEDBACK]` → weak signal, cannot reach Señal alone — requires corroboration from a different source or voice to escape Supuesto

**Tradeoff rule:** When a `constraint` conflicts with a `user-need` Señal → do NOT resolve. Flag as explicit tradeoff in the diagnostic: *"⚡ Tradeoff: users need X, but constraint Y limits this — strategic decision required."*

**8. Categorize each insight**

| Category | What it captures |
|---|---|
| `user-need` | User pain, need, behavior, or desire |
| `business` | Business objectives, metrics, model |
| `constraint` | Non-negotiable limits: runway, regulatory, capital, hard deadlines |
| `technical` | System capabilities or technical limits |
| `design-principle` | Design principles with evidence trail |

Add temporal tag: `(current)` for present state, `(aspirational)` for desired future. Default to `(current)` if ambiguous.

`design-principle` insights MUST include `Grounded in: [IG-XX]` — a design principle without evidence is a Homer's Car.

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

**15. Write diagnostic** — Before writing, get accurate counts from files:
```bash
TOTAL=$(grep -c '### \[IG-' 02_Work/INSIGHTS_GRAPH.md)
SENAL=$(grep -B5 'Tier: Señal' 02_Work/INSIGHTS_GRAPH.md | grep -c '### \[IG-')
```
Then write `02_Work/ANALYSIS.md` using those counts — never use in-memory tallies:

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

**Post-write verification:** After writing ANALYSIS.md, re-read INSIGHTS_GRAPH.md and verify: (1) each `[IG-XX]` in ANALYSIS.md is placed in the section matching its actual Tier in INSIGHTS_GRAPH.md, (2) the count in each section header matches the number of bullets listed, (3) no insight is referenced that doesn't exist in INSIGHTS_GRAPH.md. Fix any mismatches before proceeding.

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
