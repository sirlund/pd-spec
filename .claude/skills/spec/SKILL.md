---
name: spec
description: Resolve pending conflicts, update insight statuses, and build STRATEGIC_VISION.md + PROPOSALS.md from verified insights. Was /resolve — renamed in v4.25.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, AskUserQuestion
---

# /spec — Product Specification & Conflict Resolution

## What this skill does

Builds the product specification layer: resolves pending conflicts as pre-work, updates insight statuses, then writes STRATEGIC_VISION.md (vision, strategy, principles, domains) and PROPOSALS.md (design proposals [DP-XX]).

Previously named `/resolve`. Suggested pipeline order: `/extract` → `/analyze` → `/spec` → `/ship` — but skills can run in any order. Each skill adapts to what's available.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found (manual edits, unexpected files), report them to the user before proceeding.

**Language** — Check `output_language` in `PROJECT.md`. If PROJECT.md is missing, default to `en` and suggest running `/kickoff`. Write all resolution notes, strategic vision, and proposal content in that language. System IDs and status labels stay in English.

### Phase 1: Load & Analyze (with Index Optimization)

**Adaptive start:** Check what Work layer files exist before loading. If key files are missing (no INSIGHTS_GRAPH.md, no CONFLICTS.md), report what's available and what's missing. Do NOT abort — work with whatever exists. If the Work layer is mostly empty, tell the user: "The knowledge base is thin. I can build a spec from what's here, but the result will have gaps. Want to proceed, or run `/analyze` first to build a stronger foundation?" Proceed if the user confirms or if there's enough to work with.

1. **Load conflicts** — Read `02_Work/CONFLICTS.md` and identify all `PENDING` conflicts. If the file doesn't exist or is empty, skip conflict resolution (Phase 2) entirely.

2. **Load insights** — Check if `02_Work/_index/INSIGHTS_GRAPH_INDEX.md` exists. If it exists, verify freshness by comparing the hash in the index header against `md5 -q 02_Work/INSIGHTS_GRAPH.md | cut -c1-8`. If fresh → read the index first to get all insight IDs, titles, statuses, categories, and convergence (~5 KB). Only read individual full entries (by line range from L-start) when needed for conflict resolution or status changes. If the index is stale or missing → read `02_Work/INSIGHTS_GRAPH.md` in full. If neither exists, proceed with whatever context is available (EXTRACTIONS.md, conversation, user input).

3. **Load current spec** — Read `02_Work/STRATEGIC_VISION.md` and `02_Work/PROPOSALS.md` to understand current product decisions. If these don't exist yet, this is a first run — proceed to Phase 3 (write from scratch).

4. **Validate arguments** — If the user provides specific IDs (approve IG-XX, reject IG-YY, resolve CF-ZZ), verify each ID exists in the loaded files before proceeding. If an ID doesn't exist, report it to the user and skip it. Do not silently ignore invalid IDs or create phantom resolutions.

### Phase 2: Conflict Resolution (Pre-Work)

If there are PENDING conflicts, resolve them before writing the spec. If no PENDING conflicts, skip to Phase 3.

5. **Resolve each PENDING conflict** one at a time:
   - Show the conflict ID, title, and the tension between insights.
   - Show the relevant source references.
   - Evaluate the evidence for each option (keep A, keep B, merge, invalidate both).
   - **If one option is clearly better** (evidence strongly favors it) → resolve autonomously and log the reasoning.
   - **If options have comparable evidence AND the decision has high impact** → ask the user via AskUserQuestion with full context (option A vs B, evidence for each, estimated impact).
   - **If unable to decide** → set status to "Flag for discussion" as an intermediate state.
   - Also consider intermediate options: "Needs more research" when evidence is insufficient.

   **Intermediate state handling:**
   When the agent judges "Flag for discussion" or "Needs more research":
   - Provide context (who should discuss, what needs research)
   - Write to CONFLICTS.md: `Status: PENDING — Flagged (context)` or `Status: PENDING — Research (context)`
   - The conflict remains PENDING (not RESOLVED) — the intermediate tag records the decision without closing the conflict
   - These intermediate states are visible in the app with distinct badges (amber "Flagged", blue "Research")

### Phase 3: Propose Spec Updates (Transparent Summary)

6. **Draft resolution summary** — After conflicts are handled, present:
   - Proposed changes to `CONFLICTS.md` (status updates, resolution notes).
   - Proposed changes to `INSIGHTS_GRAPH.md` (status changes, new merged insights).
   - Proposed changes to `STRATEGIC_VISION.md` (vision, strategy, principles, domains, value props).
   - Proposed changes to `PROPOSALS.md` (new/updated design proposals [DP-XX]).
   - Any traceability gaps found (entries without `[IG-XX]` references).
   - **Present this summary for transparency, then proceed to write.**

### Phase 4: Write

7. **Resolve conflicts** — Update conflict statuses to `RESOLVED` in `02_Work/CONFLICTS.md`. Add resolution notes and actions taken. Use `./scripts/resolve-conflict.sh` for mechanical status changes when available.

8. **Update insights** — In `02_Work/INSIGHTS_GRAPH.md`:
   - **Authority gate** — Before marking any insight as VERIFIED, scan its Evidence trail entries:
     - If ALL evidence trail entries carry `[INTERNAL]` tags → block VERIFIED:
       "INTERNAL-only sources — cannot reach VERIFIED without primary corroboration. Options: keep PENDING, or add an external source first."
     - If ALL evidence trail entries carry `[AI-SOURCE]` tags → block VERIFIED (same message, same logic).
     - If a mix of INTERNAL/AI-SOURCE and primary entries exists → the primary entry provides corroboration. Proceed normally.
     - **User override:** If the user explicitly requests VERIFIED with a justification note (e.g., "strategic decision by CEO+CTO"), write VERIFIED and append the justification note to the insight. The system warns but obeys human decisions.
   - Mark resolved insights as `VERIFIED`, `MERGED`, or `INVALIDATED`.
   - If merging, create a new insight that combines the originals.
   - **Update `Last-updated: YYYY-MM-DD`** on every insight touched.
   - Use `./scripts/verify-insight.sh` for mechanical status changes when available.

9. **Propose structure** — Before writing STRATEGIC_VISION.md, read `project_type`
   from PROJECT.md and propose which structural elements to include.

   **Fallback for missing project_type:** If `project_type` is missing or `[Set by /kickoff]`,
   infer type from insight categories: majority `user-need` + `design-framework` → Digital product;
   majority `business` → Business strategy; mixed with few `technical` → Consulting / research.
   If ambiguous, ask the user via AskUserQuestion.

   **Available structure elements:**

   | Element | What it organizes | When to use |
   |---|---|---|
   | Design Principles | Guiding principles from design-framework insights | Product has design decisions grounded in evidence |
   | Operational Domains | Functional territory groupings | Product covers multiple functional areas |
   | Strategic Axes | High-level strategic themes/directions | Project defines strategic direction, not buildable modules |
   | Prioritized Recommendations | Actionable findings ranked by impact | Project delivers analysis/advice, not a product |

   **Pre-filtered recommendations by project type:**

   | Project type | Recommended elements |
   |---|---|
   | Digital product | Design Principles + Operational Domains |
   | Consulting / research | Strategic Axes + Prioritized Recommendations |
   | Redesign / improvement | Design Principles + Operational Domains |
   | Business strategy | Strategic Axes |
   | (not set) | Infer from insight categories, ask user |

   **Proposal flow:**
   1. Select recommended elements based on project_type
   2. Use the recommended structure automatically
   3. If `project_type` is genuinely ambiguous (cannot infer from insight categories), ask the user via AskUserQuestion
   4. Proceed with selected structure

   **Universal sections (always include regardless of structure):**
   - Product Vision
   - Product Strategy
   - Value Propositions
   - Open Questions

   **Rules for each element:**
   - **Design Principles** — product-level principles only. Source exclusively from
     insights with category `design-framework`. Internal methodology concepts
     (Homer's Car, etc.) are NOT product principles — list them in a separate
     "Internal Design Criteria" subsection if relevant. Each principle gets:
     - A **memorable name** — use the name from the source insight, don't rename or invent.
     - **Description:** what it means, how it guides decisions.
     - **Refs:** `[IG-XX]` references that ground it.
   - **Operational Domains** — functional territory groupings. No mandatory "lead
     principle" per domain — include one only if the evidence suggests it.
   - **Strategic Axes** — thematic directions grounded in `[IG-XX]` refs. Each gets:
     name, description, supporting evidence, implications.
   - **Prioritized Recommendations** — ranked by impact × evidence strength. Each gets:
     recommendation, rationale with `[IG-XX]` refs, priority level, dependencies.
   - **Quantity is emergent** — let the number of principles, domains, axes, etc. be
     determined by insight evidence. Do NOT default to any fixed count.

9b. **Write Strategic Vision** — After user approves structure, write
    `02_Work/STRATEGIC_VISION.md` using only the approved elements as `## Section` headers.
    Include the universal sections (Product Vision, Product Strategy, Value Propositions,
    Open Questions) plus the approved structural elements.

10. **Write Design Proposals** — In `02_Work/PROPOSALS.md`:
    - Organize by the grouping structure approved in step 9 (domains, strategic axes, or flat list if no grouping applies).
    - Each proposal `[DP-XX]` includes: type (module/feature/recommendation), group, status, grounded-in refs, parent (for features), design implications, acceptance criteria, open questions.
    - Use `./scripts/next-id.sh dp` for the next available DP ID.
    - Every proposal MUST have `Grounded in:` references — Homer's Car gate applies.

11. **Ensure traceability** — Every entry in STRATEGIC_VISION.md and PROPOSALS.md must reference at least one `[IG-XX]` insight ID. Flag any entries that lack references.

12. **Regenerate INSIGHTS_GRAPH index** — After modifying insight statuses, regenerate the index:
    - Run `./scripts/generate-index.sh insights 02_Work/INSIGHTS_GRAPH.md`
    - If the script is unavailable, skip silently.

13. **Update ANALYSIS.md** — If conflicts were resolved in this run, update `02_Work/ANALYSIS.md` to reflect the new state:
    - Move resolved tradeoffs from `## ⚡ Tradeoffs` to a resolved note or remove them.
    - Update the veredicto if conflict resolution removed a blocker.
    - Update insight tier counts if convergence or status changed.
    - If ANALYSIS.md does not exist, skip silently.

14. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
    ```markdown
    ## [YYYY-MM-DDTHH:MM] /spec
    - **Request:** [what the user asked]
    - **Actions:** [conflicts resolved, insights updated, spec changes]
    - **Result:** [summary of resolutions and decisions]
    - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
    ```

## Insight Lifecycle (6 Statuses)

| Status | Meaning | Convergence? | Reversible? |
|---|---|---|---|
| `PENDING` | New, unverified | Yes | — |
| `VERIFIED` | Confirmed by evidence | Yes | — |
| `FROZEN` | Valid but deprioritized | **No** | Yes → VERIFIED |
| `INVALIDATED` | Contradicted + reason stored | No | Rare |
| `MERGED` | Absorbed into [IG-XX] | No | No |
| `SUPERSEDED` | Replaced by newer [IG-XX] | No | No |

**Transition rules:** See `scripts/verify-insight.sh` for cascade protection. FROZEN and INVALIDATED transitions trigger impact analysis across STRATEGIC_VISION + PROPOSALS + Outputs.

**FROZEN → user only.** The agent cannot freeze insights — only the user can decide "this doesn't move the needle right now."

## Design Proposal Format

```markdown
### [DP-XX] [Name]
**Type:** module | feature | recommendation
**Group:** [approved grouping name]
**Status:** PROPOSED | VALIDATED | BUILDING | SHIPPED
**Grounded in:** [IG-XX], [IG-XX]
**Parent:** [DP-XX] (features point to their module)
**Design implications:**
- ...
**Acceptance criteria:**
- ...
**Open questions:**
- ...
```
