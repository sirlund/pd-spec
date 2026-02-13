---
name: analyze
description: Scan sources in 01_Sources/, extract atomic insights, cross-reference against 02_Work/INSIGHTS_GRAPH.md, and log contradictions to 02_Work/CONFLICTS.md
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
---

# /analyze — Source Ingestion & Insight Extraction

## What this skill does

Scans all source files in `01_Sources/`, extracts atomic claims and facts, cross-references them against existing verified insights, and logs any contradictions found.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state (insight count, conflict count, last actions). Then compare against the current state of `02_Work/INSIGHTS_GRAPH.md`, `02_Work/CONFLICTS.md`, and `02_Work/SYSTEM_MAP.md`. If discrepancies are found (entries not logged in MEMORY, unexpected files in `02_Work/`), report them to the user before proceeding.

**Language** — Check `output_language` in CLAUDE.md `## Project Settings`. Write all insight descriptions, conflict summaries, and source issue reports in that language. System IDs (`[IG-XX]`, `[CF-XX]`, status labels like `PENDING`, `VERIFIED`) stay in English.

### Phase 1: Discovery & Validation

1. **Discover sources** — Glob `01_Sources/` recursively for all files except `_SOURCE_TEMPLATE.md`, `_CONTEXT_TEMPLATE.md`, `_CONTEXT.md`, `_README.md`, and `.gitkeep`. Sources may be organized in subfolders by milestone or category.

2. **Read folder context** — For each subfolder, check for a `_CONTEXT.md` file. If present, use it to understand non-markdown files (images, PDFs, spreadsheets, .txt) that can't carry their own metadata. The `_CONTEXT.md` provides type, date, participants, and per-file descriptions.

3. **Validate source organization** — For each source file, check:
   - Does the file's metadata (type, date, context) match the folder it's in?
   - Is any file misplaced (e.g., a benchmark in an interviews folder)?
   - Does the file date conflict with the folder date prefix?
   - Are there missing metadata fields (Type, Date, Participants, Context)?
   - Are there non-standard date formats (expected: `YYYY-MM-DD`)?
   - Does the file follow `_SOURCE_TEMPLATE.md` structure? If not, flag it.
   - **If inconsistencies are found:** report them to the user and ask for confirmation before proceeding. Do not move or reclassify files without explicit approval.

4. **Read each source** — For every source file, extract atomic claims and facts. Each claim should be a single, verifiable statement. For non-markdown files described in `_CONTEXT.md`, extract claims from the descriptions provided.

5. **Load current state** — Read `02_Work/INSIGHTS_GRAPH.md` to understand existing insights and their IDs.

### Phase 2: Analysis (Draft)

6. **Prepare new insights** — For each new claim not already captured:
   - Determine the next available `[IG-XX]` ID (sequential, zero-padded).
   - Categorize as one of: `user-need`, `technical`, `business`, `constraint`.
   - Reference the specific source file it came from.
   - **Status: always `PENDING`.** Insights are never born as VERIFIED. Verification happens later through cross-referencing in `/synthesis` or explicit user validation.
   - Aim for **one insight per atomic claim**. "Users want X and hate Y" is two insights, not one.

7. **Cross-reference** — Compare new claims against all existing VERIFIED insights.
   - Look for contradictions, tensions, or incompatible statements.

8. **Detect evidence gaps** — Two levels of gap detection:

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

### Phase 3: Write

All insights are written as `PENDING`. The real approval happens downstream — the user reviews the files at their own pace and `/synthesis` is where PENDING insights get promoted to VERIFIED. This skill does NOT require chat-based approval.

> **⚠️ STOP — If the model supports propose-before-execute mode (non-fast/planning mode):** before writing, present a summary of findings to the user (source org issues, insight table, conflicts table, evidence gaps) and wait for approval. If the model is in fast/auto mode, proceed directly to writing.

9. **Write insights** — Add all new insights to `02_Work/INSIGHTS_GRAPH.md`. Each insight must include:
   - `[IG-XX]` ID (sequential, zero-padded)
   - Category in parentheses: `(user-need)`, `(technical)`, `(business)`, `(constraint)`
   - Atomic claim — one idea per insight
   - Source reference: `Ref: [file path]`
   - All insights are `PENDING`

10. **Log conflicts** — For each detected contradiction:
    - Read `02_Work/CONFLICTS.md` to get the next available `[CF-XX]` ID.
    - Append the conflict as `PENDING` with a description of the tension and references to the conflicting insight IDs.

11. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
    ```markdown
    ## [YYYY-MM-DDTHH:MM] /analyze
    - **Request:** [what the user asked]
    - **Actions:** [files scanned, organization issues found]
    - **Result:** [insights added, conflicts logged, gaps flagged]
    - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
    ```

### Phase 4: Report

12. **Summarize to the user** what was written:
    - Source organization issues found (list each one).
    - Insights added (count, ID range, and breakdown by category).
    - Conflicts logged (count, ID range, with a 1-line summary of each tension).
    - **Source diversity** — which source types are covered, which are missing, and what to consider adding.
    - Evidence gaps detected (with suggested validation methods).
    - **Remind the user:** "Review `02_Work/INSIGHTS_GRAPH.md` and `02_Work/CONFLICTS.md`. Edit or remove anything that doesn't look right. Then run `/synthesis` to resolve conflicts and verify insights."
