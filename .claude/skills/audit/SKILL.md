---
name: audit
description: Quality gate — evaluates Work layer readiness before /ship. Checks traceability, completeness, and consistency.
user-invocable: true
allowed-tools: Read, Grep, Glob, Bash
argument-hint: ""
---

# /audit — Work Layer Quality Gate

## What this skill does

Evaluates the quality and readiness of the Work layer (`02_Work/`) before generating deliverables with `/ship`. Produces a read-only scorecard with pass/fail checks, scores, and specific remediation actions. This is a diagnostic tool — it never modifies files.

## When to use

- Before `/ship` — to verify the knowledge base is solid enough for deliverables.
- After `/spec` — to confirm that conflict resolution improved quality.
- Anytime — as a health check on research progress.

## Instructions

### Phase 0: Session Resume

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. This is context only — `/audit` does not write to MEMORY.

**Language** — Check `output_language` in `PROJECT.md`. If PROJECT.md is missing, default to `en` and suggest running `/kickoff`. Write all scorecard labels, descriptions, and recommendations in that language. System IDs and status labels stay in English.

### Phase 1: Load Work Layer

1. **Read all Work layer files:**
   - `02_Work/INSIGHTS_GRAPH.md` — parse all `[IG-XX]` entries with status, category, temporal tag, convergence, and source ref.
   - `02_Work/CONFLICTS.md` — parse all `[CF-XX]` entries with status.
   - `02_Work/STRATEGIC_VISION.md` — parse vision, strategy, principles, domains, value props, open questions.
   - `02_Work/PROPOSALS.md` — parse design proposals [DP-XX] (type, domain, status, refs, implications).
   - `02_Work/EXTRACTIONS.md` — check if extractions exist (non-empty beyond template header).

2. **If no insights exist** (INSIGHTS_GRAPH.md is empty or template-only), report: "Nothing to audit. Run `/extract` then `/analyze` first." Then stop.

### Phase 2: Quality Checks

Run each check and compute a score (0–100%). Present results per check.

#### Check 1: Traceability Completeness

Every design proposal must have `[IG-XX]` refs (Grounded in:). Every strategic vision entry must reference insights.

- Count proposals with refs vs. proposals without refs.
- Count strategic vision entries (principles, domains) with refs vs. without refs.
- **Score:** % of entries (proposals + principles + domains) that have at least one `[IG-XX]` reference.
- **Pass threshold:** 100% — traceability is binary, any untraced entry is a gap.

#### Check 2: Insight Coverage

Are all insight categories represented? Categories: `user-need`, `technical`, `business`, `constraint`.

- Count insights per category.
- Compute a diversity index: number of categories present out of 4.
- Flag any category with 0 insights.
- Flag severe imbalance (any single category >60% of total insights).
- **Score:** (categories present / 4) × 100, with a 10% penalty per imbalanced category.

#### Check 3: Conflict Resolution

How many conflicts are still `PENDING`?

- Count PENDING, RESOLVED, and total conflicts.
- **Score:** % of conflicts resolved. If no conflicts exist, score is 100%.
- **Pass threshold:** 80% — some pending conflicts are acceptable, but most should be resolved before `/ship`.

#### Check 4: Source Backing

What percentage of insights have convergence > 1 source?

- Parse convergence ratios from insights (e.g., `Convergence: 3/5 sources`).
- Count insights with convergence > 1 vs. single-source insights.
- Compute average convergence ratio across all insights.
- **Score:** % of insights with convergence > 1.
- **Pass threshold:** 50% — at least half of insights should have multi-source backing.

#### Check 5: Evidence Gaps

How many known gaps exist? Are they documented?

- Count open questions in STRATEGIC_VISION.md (unchecked `- [ ]` items).
- Check if source diversity gaps are documented (from previous `/analyze` runs — look for gap mentions in INSIGHTS_GRAPH.md or EXTRACTIONS.md).
- **Score:** Inverse scale — 100% if 0–2 gaps, 75% if 3–5, 50% if 6–10, 25% if >10.
- Gaps are not inherently bad (they show awareness), but many unaddressed gaps signal the knowledge base needs more work.

#### Check 6: Specification Completeness

Do STRATEGIC_VISION.md and PROPOSALS.md have substantive content?

Checklist:
- [ ] Vision statement exists in STRATEGIC_VISION.md (not placeholder text)
- [ ] At least one design principle is defined
- [ ] At least one operational domain is defined
- [ ] At least one design proposal [DP-XX] exists in PROPOSALS.md
- [ ] Open questions are tracked

- **Score:** (checked items / 5) × 100%.
- **Pass threshold:** 80% — at least 4 of 5 items should be present.

#### Check 7: Temporal Balance

Mix of `(current)` vs `(aspirational)` insights.

- Count insights tagged `(current)` and `(aspirational)`.
- Compute ratio.
- Flag if all insights are one type (100% current or 100% aspirational).
- Ideal range: 30–70% current, 30–70% aspirational.
- **Score:** 100% if within ideal range, 75% if within 20–80%, 50% if within 10–90%, 25% if all one type.

#### Check 8: Referential Integrity

Run `./scripts/integrity-check.sh` (with the project path as argument) to verify that every insight's `Ref:` line points to a source file that has a matching extraction section in EXTRACTIONS.md.

- **Pass (2/2):** All insights have valid source references with matching extractions.
- **Partial (1/2):** Some insights have orphaned references (source exists but no extraction section found). These may indicate sources that were re-extracted or renamed.
- **Fail (0/2):** Multiple orphaned references found. Run `/extract` to update extractions, or investigate missing sources.

Tip: Run `./scripts/integrity-check.sh [project_path]` manually to see the full orphan report.

### Phase 3: Report

3. **Compute overall readiness:**
   - Average all 8 check scores.
   - **Ready** (green): average ≥ 80% and no check below 50%.
   - **Needs Work** (amber): average ≥ 60% or any check below 50%.
   - **Not Ready** (red): average < 60%.

4. **Present the scorecard** in this format:

   ```
   ## Quality Scorecard

   Overall: [Ready / Needs Work / Not Ready] ([average]%)

   | # | Check                    | Score | Status |
   |---|--------------------------|-------|--------|
   | 1 | Traceability             | XX%   | ✓ / ✗  |
   | 2 | Insight Coverage         | XX%   | ✓ / ✗  |
   | 3 | Conflict Resolution      | XX%   | ✓ / ✗  |
   | 4 | Source Backing            | XX%   | ✓ / ✗  |
   | 5 | Evidence Gaps            | XX%   | ✓ / ✗  |
   | 6 | Specification Completeness | XX% | ✓ / ✗  |
   | 7 | Temporal Balance         | XX%   | ✓ / ✗  |
   | 8 | Referential Integrity    | XX%   | ✓ / ✗  |

   ### Failing Checks

   [For each check with ✗, explain what's wrong and suggest a specific action]
   ```

5. **For each failing check**, provide a specific remediation action:
   - Traceability: "Add `[IG-XX]` references to untraced proposals in PROPOSALS.md. Run `/spec` to update."
   - Insight Coverage: "Missing [category] insights. Run `/extract` on sources that cover [category], then `/analyze`."
   - Conflict Resolution: "N conflicts still PENDING. Run `/spec` to resolve them."
   - Source Backing: "N insights rely on a single source. Add more sources covering these topics and re-run `/extract` + `/analyze`."
   - Evidence Gaps: "N open questions unaddressed. Consider adding sources or running `/spec` to discuss them."
   - Specification Completeness: "Missing: [list]. Run `/spec` to fill in the strategic vision and proposals."
   - Temporal Balance: "All insights are [current/aspirational]. Add sources that cover [the missing perspective]."
   - Referential Integrity: "N insights have orphaned source references. Run `/extract` to regenerate extractions, or check that source files haven't been renamed or removed."

6. **Closing note:**
   > This is a diagnostic snapshot. You decide whether to proceed with `/ship` despite any warnings. Run `/audit` again after addressing issues to verify improvement.

## Constraints

- **Read-only** — this skill never writes to `02_Work/` or `03_Outputs/`.
- **No MEMORY.md entry** — like `/status`, this is a snapshot, not a pipeline action.
- **Not a blocker** — the user decides whether to proceed with `/ship` regardless of the audit result.
