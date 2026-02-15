---
name: analyze
description: Process raw claims from 02_Work/EXTRACTIONS.md into atomic insights, cross-reference against 02_Work/INSIGHTS_GRAPH.md, and log contradictions to 02_Work/CONFLICTS.md. Requires /extract first.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
---

# /analyze — Insight Extraction & Cross-Referencing

## What this skill does

Reads raw claims from `02_Work/EXTRACTIONS.md` (produced by `/extract`), converts them into atomic insights, cross-references them against existing verified insights, and logs any contradictions found.

**Prerequisite:** Run `/extract` first to populate `02_Work/EXTRACTIONS.md` with raw claims from source files.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state (insight count, conflict count, last actions). Then compare against the current state of `02_Work/INSIGHTS_GRAPH.md`, `02_Work/CONFLICTS.md`, and `02_Work/SYSTEM_MAP.md`. If discrepancies are found (entries not logged in MEMORY, unexpected files in `02_Work/`), report them to the user before proceeding.

**Language** — Check `output_language` in CLAUDE.md `## Project Settings`. Write all insight descriptions, conflict summaries, and source issue reports in that language. System IDs (`[IG-XX]`, `[CF-XX]`, status labels like `PENDING`, `VERIFIED`) stay in English.

### Phase 1: Load Extractions

1. **Read extractions** — Read `02_Work/EXTRACTIONS.md`. If the file is missing or contains only the template header (no extraction sections), tell the user: "No extractions found. Run `/extract` first to read source files and extract raw claims." Then stop.

2. **Load current state** — Read `02_Work/INSIGHTS_GRAPH.md` to understand existing insights and their IDs.

### Phase 2: Analysis (Draft)

3. **Prepare new insights** — For each raw claim from EXTRACTIONS.md not already captured:
   - Determine the next available `[IG-XX]` ID (sequential, zero-padded).
   - Categorize as one of: `user-need`, `technical`, `business`, `constraint`.
   - Reference the specific source file it came from.
   - **Key quote** — Include 1-2 sentences from the source that best support the claim. This is the evidence trail — without it, the insight is an assertion without proof.
   - **Status: always `PENDING`.** Write the status as plain text `PENDING`, not bold (`**PENDING**`), not in backticks. Same for all status labels.
   - **Temporal tag** — When the insight describes something that exists today vs. something desired for the future, tag it:
     - `(current)` — describes the present state ("users currently do X", "the system has Y limitation")
     - `(aspirational)` — describes a desired future state ("users want X", "the product should do Y")
     - If ambiguous, default to `(current)`. The tag goes after the category: `(user-need, aspirational)`.
   - **Atomicity** — One insight per atomic claim. "Users want X and hate Y" is two insights, not one. A source that lists 10 needs produces 10 insights. Do not bundle multiple claims into a single insight.
   - **Granularity guidance** — When to separate vs. consolidate:
     - **Separate** when claims have different sources, different categories, or could be independently verified/invalidated.
     - **Consolidate** when two claims are really the same observation stated differently (deduplicate, not merge).
     - When in doubt, **separate**. It's easier to merge later than to split.

   **Insight grouping** — Use `## Section` headers in `INSIGHTS_GRAPH.md` to organize insights by theme (e.g., `## User Experience`, `## Business Model`, `## Technical Architecture`). Headers are a grouping mechanism, not a status. An insight's position under a header doesn't affect its status or category.

4. **Cross-reference** — Compare new claims against ALL existing insights (VERIFIED and PENDING).
   - **Actively seek contradictions** — don't just note obvious conflicts. Look for:
     - Direct contradictions ("users love X" vs "users avoid X").
     - Tensions ("team wants simplicity" vs "client demands customization").
     - Incompatible assumptions ("small user base" vs "must handle 10K concurrent users").
     - Temporal conflicts ("currently using tool Y" vs "already migrated to Z").
   - For each potential conflict, cite the specific claims from both sides.

5. **Detect evidence gaps** — Two levels of gap detection:

   **a. Claim-level gaps** — Areas where claims are made without sufficient source backing, or where important product areas have no source coverage.

   **b. Source diversity gaps** — Evaluate whether the knowledge base is built on a healthy mix of source types or dangerously skewed. Classify each source into one of these types based on its content and metadata:

   | Source type | What it provides | Gap signal if missing |
   |---|---|---|
   | User research (interviews, observations, usability tests) | User needs, pain points, behaviors | "No user research — user-need insights may be assumptions" |
   | Business data (OKRs, metrics, unit economics) | Business constraints, success criteria | "No business sources — prioritization lacks financial grounding" |
   | Technical docs (architecture, API specs, constraints) | Technical feasibility, limitations | "No technical sources — feasibility of modules is unvalidated" |
   | Brand / design guidelines | Visual identity, tone, accessibility targets | "No brand/design sources — visual decisions lack foundation" |
   | Competitive analysis (benchmarks, audits) | Market context, differentiation | "No competitive sources — positioning based on internal assumptions" |
   | Accessibility data (audits, demographics, WCAG targets) | Inclusive design constraints | "No accessibility sources — compliance claims are unsupported" |

   Report which source types are present and which are missing. For missing types, suggest what kind of source would fill the gap (as options, not impositions — per Mandate #4).

   **c. Diversity dimensions** — Beyond source type, evaluate three additional diversity axes:

   - **Temporal diversity** — Are all sources from the same time period? Check source dates (from metadata or folder names). Flag clusters where all sources are older than 6 months ("sources may be outdated") or where all sources share the same date range ("no longitudinal perspective — trends and changes over time are invisible").
   - **Perspective diversity** — Are all sources from the same stakeholder group? Categorize sources by who produced or is represented in them (e.g., management, end-users, operators, engineers, external partners). Flag when a single perspective dominates (>70% of sources) with no counterbalance.
   - **Methodology diversity** — Are all sources the same method type? (e.g., all interviews, all documents, all quantitative). Qualitative sources reveal *why*; quantitative sources reveal *how much*. Flag when all sources share a single methodology.

   **d. Source matrix & diversity score** — Build a source matrix for internal tracking:

   ```
   Source type          | Present | Files | Example file
   ---------------------|---------|-------|-------------
   User research        | ✓ / ✗   | N     | path/to/file
   Business data        | ✓ / ✗   | N     | ...
   Technical docs       | ✓ / ✗   | N     | ...
   Brand / design       | ✓ / ✗   | N     | ...
   Competitive analysis | ✓ / ✗   | N     | ...
   Accessibility data   | ✓ / ✗   | N     | ...
   ```

   Calculate a **diversity score**: number of source types present out of 6 (e.g., `3/6`). This is a simple health indicator, not a quality judgment — a 6/6 project with shallow sources is worse than a 3/6 project with deep ones.

   **e. Single-source fragility flags** — After insights are prepared (step 3), review them for source diversity at the insight level. Flag any insight whose supporting evidence comes from only one source type. These insights are more fragile — they lack cross-type corroboration. In the report (Phase 4), list fragile insights with a note like: `[IG-05] supported only by user research — would benefit from technical or business corroboration`.

### Phase 3: Write

All insights are written as `PENDING`. The real approval happens downstream — the user reviews the files at their own pace and `/synthesis` is where PENDING insights get promoted to VERIFIED. This skill does NOT require chat-based approval.

> **⚠️ STOP — If the model supports propose-before-execute mode (non-fast/planning mode):** before writing, present a summary of findings to the user (source org issues, insight table, conflicts table, evidence gaps) and wait for approval. If the model is in fast/auto mode, proceed directly to writing.

6. **Write insights** — Add all new insights to `02_Work/INSIGHTS_GRAPH.md`. Each insight must include:
   - `[IG-XX]` ID (sequential, zero-padded)
   - Category and temporal tag in parentheses: `(user-need, current)`, `(technical, aspirational)`, `(business)`, `(constraint)`
   - Atomic claim — one idea per insight
   - Key quote — 1-2 sentences from the source (in a blockquote)
   - Source reference: `Ref: [file path]`
   - Status: `PENDING` (plain text, no formatting)

7. **Log conflicts** — For each detected contradiction:
    - Read `02_Work/CONFLICTS.md` to get the next available `[CF-XX]` ID.
    - Append the conflict as `PENDING` with a description of the tension.
    - **Both sides must reference `[IG-XX]` IDs** — a conflict without insight refs on both sides is just an observation. Each side of the tension must point to the specific insight(s) that support it.

8. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
    ```markdown
    ## [YYYY-MM-DDTHH:MM] /analyze
    - **Request:** [what the user asked]
    - **Actions:** [extractions processed, cross-referencing performed]
    - **Result:** [insights added, conflicts logged, gaps flagged]
    - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
    ```

### Phase 4: Report

9. **Summarize to the user** what was written:
    - Source organization issues found (list each one).
    - Insights added (count, ID range, and breakdown by category).
    - Conflicts logged (count, ID range, with a 1-line summary of each tension).
    - **Source diversity** — present the source matrix (type × present/missing with file counts), the diversity score (N/6), diversity dimension flags (temporal, perspective, methodology), and specific suggestions per missing type. List any fragile insights (single-source-type support) with what corroboration would strengthen them.
    - Evidence gaps detected (with suggested validation methods).
    - **Remind the user:** "Review `02_Work/INSIGHTS_GRAPH.md` and `02_Work/CONFLICTS.md`. Edit or remove anything that doesn't look right. Then run `/synthesis` to resolve conflicts and verify insights."
