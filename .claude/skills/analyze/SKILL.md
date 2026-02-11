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

8. **Detect evidence gaps** — If the agent identifies areas where claims are made without sufficient source backing, or where important product areas have no source coverage, note them as potential gaps.

### Phase 3: Propose (User Approval)

9. **Present findings summary** — Before writing anything, output to the user. **Every item must be individually visible — never ask the user to approve N items without showing each one.**

   **a) Source organization issues** (if any from step 3).

   **b) New insights — show ALL of them in a table:**
   | ID | Claim | Category | Source file | Status |
   |---|---|---|---|---|
   | IG-01 | [atomic claim] | [category] | [file path] | PENDING |

   Do NOT summarize as "12 insights found" — the user must see each insight to approve or reject it.

   **c) Conflicts detected — show ALL of them with cross-references:**
   | ID | Tension | Insights involved |
   |---|---|---|
   | CF-01 | [description of contradiction] | IG-XX vs IG-YY |

   **d) Evidence gaps** — areas with no source coverage or insufficient backing. For each gap, suggest a validation method (interview, benchmark, data analysis).

   **e) Sources with no extractable claims** (if any).

   **Wait for user approval before proceeding to Phase 4.** The user may approve all, reject some, or ask for changes.

### Phase 4: Write (After Approval)

10. **Write insights** — Add approved insights to `02_Work/INSIGHTS_GRAPH.md`.

11. **Log conflicts** — For approved conflicts:
    - Read `02_Work/CONFLICTS.md` to get the next available `[CF-XX]` ID.
    - Append the conflict as `PENDING` with references to both insights.

12. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
    ```markdown
    ## [YYYY-MM-DDTHH:MM] /analyze
    - **Request:** [what the user asked]
    - **Actions:** [files scanned, organization issues found]
    - **Result:** [insights added, conflicts logged, gaps flagged]
    - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
    ```

13. **Final report** — Confirm what was written:
    - Insights added (count and ID range).
    - Conflicts logged (count and ID range).
    - Any items the user chose to skip or defer.
