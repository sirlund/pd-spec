---
name: analyze
description: Scan sources in 01_Sources, extract entities and claims, cross-reference with existing insights, and log contradictions
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
---

# /analyze — Source Ingestion & Insight Extraction

## What this skill does

Scans all source files in `01_Sources/`, extracts atomic claims and facts, cross-references them against existing verified insights, and logs any contradictions found.

## Instructions

### Phase 1: Discovery & Validation

1. **Discover sources** — Glob `01_Sources/` recursively for all files except `_SOURCE_TEMPLATE.md` and `.gitkeep`. Sources may be organized in subfolders by milestone or category.

2. **Validate source organization** — For each source file, check:
   - Does the file's metadata (type, date, context) match the folder it's in?
   - Is any file misplaced (e.g., a benchmark in an interviews folder)?
   - Does the file date conflict with the folder date prefix?
   - **If inconsistencies are found:** report them to the user and ask for confirmation before proceeding. Do not move or reclassify files without explicit approval.

3. **Read each source** — For every source file, extract atomic claims and facts. Each claim should be a single, verifiable statement.

4. **Load current state** — Read `02_Work/INSIGHTS_GRAPH.md` to understand existing insights and their IDs.

### Phase 2: Analysis (Draft)

5. **Prepare new insights** — For each new claim not already captured:
   - Determine the next available `[IG-XX]` ID (sequential, zero-padded).
   - Categorize as one of: `user-need`, `technical`, `business`, `constraint`.
   - Reference the source file it came from.
   - Status: `PENDING`.

6. **Cross-reference** — Compare new claims against all existing VERIFIED insights.
   - Look for contradictions, tensions, or incompatible statements.

7. **Detect evidence gaps** — If the agent identifies areas where claims are made without sufficient source backing, or where important product areas have no source coverage, note them as potential gaps.

### Phase 3: Propose (User Approval)

8. **Present findings summary** — Before writing anything, output to the user:
   - Source organization issues found (if any).
   - New insights to be added (list with proposed IDs, categories, and source refs).
   - Conflicts detected (list with the tension described).
   - Evidence gaps detected (with suggested validation methods).
   - Sources with no extractable claims.
   - **Wait for user approval before proceeding to Phase 4.**

### Phase 4: Write (After Approval)

9. **Write insights** — Add approved insights to `02_Work/INSIGHTS_GRAPH.md`.

10. **Log conflicts** — For approved conflicts:
    - Read `02_Work/CONFLICTS.md` to get the next available `[CF-XX]` ID.
    - Append the conflict as `PENDING` with references to both insights.

11. **Final report** — Confirm what was written:
    - Insights added (count and ID range).
    - Conflicts logged (count and ID range).
    - Any items the user chose to skip or defer.
