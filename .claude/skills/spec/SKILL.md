---
name: spec
description: Resolve pending conflicts, update insight statuses, and build STRATEGIC_VISION.md + PROPOSALS.md from verified insights. Was /resolve — renamed in v4.25.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# /spec — Product Specification & Conflict Resolution

## What this skill does

Builds the product specification layer: resolves pending conflicts as pre-work, updates insight statuses, then writes STRATEGIC_VISION.md (vision, strategy, principles, domains) and PROPOSALS.md (design proposals [DP-XX]).

Previously named `/resolve`. Pipeline: `/extract` → `/analyze` → `/spec` → `/ship`.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found (manual edits, unexpected files), report them to the user before proceeding.

**Language** — Check `output_language` in `PROJECT.md`. If PROJECT.md is missing, default to `en` and suggest running `/kickoff`. Write all resolution notes, strategic vision, and proposal content in that language. System IDs and status labels stay in English.

### Phase 1: Load & Analyze

1. **Load conflicts** — Read `02_Work/CONFLICTS.md` and identify all `PENDING` conflicts.

2. **Load insights** — Read `02_Work/INSIGHTS_GRAPH.md` to understand current insight statuses and relationships.

3. **Load current spec** — Read `02_Work/STRATEGIC_VISION.md` and `02_Work/PROPOSALS.md` to understand current product decisions.

4. **Validate arguments** — If the user provides specific IDs (approve IG-XX, reject IG-YY, resolve CF-ZZ), verify each ID exists in the loaded files before proceeding. If an ID doesn't exist, report it to the user and skip it. Do not silently ignore invalid IDs or create phantom resolutions.

### Phase 2: Conflict Resolution (Pre-Work)

If there are PENDING conflicts, resolve them before writing the spec. If no PENDING conflicts, skip to Phase 3.

5. **Present each PENDING conflict** one at a time:
   - Show the conflict ID, title, and the tension between insights.
   - Show the relevant source references.
   - If the agent has a suggested resolution, present it with reasoning.
   - Present clear options (e.g., keep A, keep B, merge, invalidate both).
   - Also offer intermediate options: "Flag for discussion" and "Needs more research".
   - **Wait for user decision before proceeding to the next conflict.**

   **Intermediate state handling:**
   When user selects "Flag for discussion" or "Needs more research":
   - Ask for context (who to discuss with, what to research)
   - Write to CONFLICTS.md: `Status: PENDING — Flagged (context)` or `Status: PENDING — Research (context)`
   - The conflict remains PENDING (not RESOLVED) — the intermediate tag records the decision without closing the conflict
   - These intermediate states are visible in the app with distinct badges (amber "Flagged", blue "Research")

### Phase 3: Propose Spec Updates (User Approval)

6. **Draft resolution summary** — After conflicts are handled, present:
   - Proposed changes to `CONFLICTS.md` (status updates, resolution notes).
   - Proposed changes to `INSIGHTS_GRAPH.md` (status changes, new merged insights).
   - Proposed changes to `STRATEGIC_VISION.md` (vision, strategy, principles, domains, value props).
   - Proposed changes to `PROPOSALS.md` (new/updated design proposals [DP-XX]).
   - Any traceability gaps found (entries without `[IG-XX]` references).
   - **Wait for user approval before writing.**

### Phase 4: Write (After Approval)

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

9. **Write Strategic Vision** — In `02_Work/STRATEGIC_VISION.md`:
   - Product Vision — if core assumptions changed.
   - Product Strategy — market positioning, differentiation, business model.
   - **Design Principles** — product-level principles only. Source exclusively from insights with category `design-framework`. Internal methodology concepts (Homer's Car, D→A→R, etc.) are NOT product principles — list them in a separate "Internal Design Criteria" subsection if relevant. Each principle gets:
     - A **memorable name** — use the name from the source insight, don't rename or invent.
     - **Operates at:** which layers of the conceptual tree (Strategic / Structural / Behavioral / Materialization).
     - **Description:** what it means, how it guides decisions.
     - **Refs:** `[IG-XX]` references that ground it.
   - **Operational Domains** — high-level functional territory groupings. Each domain has a lead principle.
   - **Value Propositions** — user outcomes grounded in insights.
   - **Open Questions** — new questions surfaced during spec work.

10. **Write Design Proposals** — In `02_Work/PROPOSALS.md`:
    - Organize by operational domain.
    - Each proposal `[DP-XX]` includes: type (module/feature), domain, status, grounded-in refs, parent (for features), design implications, acceptance criteria, open questions.
    - Use `./scripts/next-id.sh dp` for the next available DP ID.
    - Every proposal MUST have `Grounded in:` references — Homer's Car gate applies.

11. **Ensure traceability** — Every entry in STRATEGIC_VISION.md and PROPOSALS.md must reference at least one `[IG-XX]` insight ID. Flag any entries that lack references.

12. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
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
**Type:** module | feature
**Domain:** [domain name]
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
