---
name: seed
description: Generate synthetic source files in 01_Sources/ for testing and onboarding. Creates realistic project data with deliberate contradictions.
user-invocable: true
allowed-tools: Read, Write, Bash, Glob
argument-hint: "[domain] [--seed|--validation|--ecosystem] [--temp low|medium|high]"
---

# /seed — Synthetic Source Generator

## What this skill does

Generates realistic synthetic source files in `01_Sources/` to test the full pipeline (`/analyze` → `/resolve` → `/ship`) without needing real project data. Also useful as onboarding — a new user runs `/seed` and sees the system working in minutes.

## When to use

- **Testing the pipeline** — validate that skills produce correct structure, traceability, and formatting.
- **Onboarding / demo** — show how PD-Spec works end-to-end with zero setup.
- **After motor changes** — verify that updated skills still process sources correctly.
- **QA branch** — populate sources for a test cycle, then `/reset` to start over.

## Instructions

### Phase 0: Determine Parameters

1. **Domain** — The product domain for the synthetic project. If the user provides one, use it. If not, pick one from this list:
   - Fintech app (personal finance / payments)
   - B2B SaaS platform (project management / CRM)
   - Health & wellness tracker (mobile app)
   - EdTech platform (online learning)
   - Marketplace (two-sided, buyers + sellers)
   - Logistics / fleet management

2. **Maturity level** — Determines how many sources to generate:

   | Level | Flag | Sources generated |
   |---|---|---|
   | **Seed** | `--seed` | 1 initial brief |
   | **Validation** | `--validation` (default) | 1 brief + 3 interviews + 1 benchmark + 1 technical doc (6 files) |
   | **Ecosystem** | `--ecosystem` | 1 brief + 4 interviews + 2 benchmarks + 1 technical doc + 1 workshop + 1 quantitative data (10+ files) |

3. **Temperature** — Controls how messy and unpredictable the generated sources are. Always mention the temperature before executing so the user can adjust.

   | Temp | Flag | Behavior |
   |---|---|---|
   | **Low** | `--temp low` | Clean metadata, obvious contradictions, standard folder structure. All sources follow the template. Useful for validating basic pipeline mechanics. |
   | **Medium** | `--temp medium` (default) | 2–3 human errors (missing fields, wrong type, bad date format). Contradictions are clear but not labeled. 1 strategic gap. Realistic scenario. |
   | **High** | `--temp high` | Heavy messiness: sources with no metadata at all, files in wrong folders, one source in a different language, a file that's barely relevant to the project, a near-duplicate, very short files mixed with very long ones, subtle contradictions that could be read either way. Stress test for the pipeline. |

4. **Confirm with user** — Show the domain, maturity level, and temperature before generating. Example:
   > I'll generate a **Validation**-level synthetic project for a **fintech personal finance app** at **medium temperature** (some human errors, clear contradictions). This creates 6 source files across 4 folders in `01_Sources/`. Proceed?

### Phase 1: Generate Sources

5. **Create folder structure** in `01_Sources/` following naming conventions:
   ```
   01_Sources/
   ├── seed-brief/
   │   └── initial-brief.md
   ├── seed-interviews/
   │   ├── interview-01.md
   │   ├── interview-02.md
   │   └── interview-03.md
   ├── seed-benchmark/
   │   └── competitors.md
   └── seed-technical/
       └── technical-constraints.md
   ```
   Use the `seed-` prefix on all folders so they're identifiable as synthetic data and easy to clean up.

6. **Every markdown file must follow `_SOURCE_TEMPLATE.md` format** (at low temp, all files follow it; at medium/high temp, some deviate — see step 8):
   ```markdown
   # Source: [Descriptive Title]

   - **Type:** interview | brief | technical_doc | workshop | quantitative_data | benchmark
   - **Date:** [realistic date, within last 3 months]
   - **Participants:** [fictional but realistic names]
   - **Context:** [1 sentence describing why this source matters]

   ---

   [Content below]
   ```

7. **Content generation rules:**
   - Write realistic, substantive content — not lorem ipsum or placeholder text.
   - Each source should be 80–200 lines of actual content.
   - Interviews should read like interview transcripts (Q&A format, informal language, tangential details).
   - Briefs should read like a stakeholder wrote them (vision, goals, constraints, some hand-waving).
   - Benchmarks should have specific competitor names (fictional), features, pricing.
   - Technical docs should include real-sounding constraints (APIs, performance, security).

8. **Deliberate human messiness** — Scale according to temperature. At **low**: skip this step. At **medium**: include 2–3 imperfections. At **high**: include 4+ and make them subtle. Pick from:
   - Missing metadata fields (no Date, no Participants, empty Context).
   - Wrong Type (a benchmark labeled as `interview`, a workshop labeled as `brief`).
   - File in the wrong folder (a benchmark file inside an interviews folder).
   - Inconsistent date formats (`2026-02-10` mixed with `Feb 10, 2026` or `10/02/2026`).
   - A source with no metadata header at all — just raw pasted content.
   - Duplicate or near-duplicate content across two files.

   This tests whether `/analyze` handles imperfect input gracefully and whether Source Organization Validation (Mandate #5) catches the inconsistencies.

9. **Deliberate contradictions** — At **low**: 1 obvious contradiction. At **medium**: 2 clear contradictions. At **high**: 3+ contradictions, some subtle/ambiguous. Every seed set MUST include contradictions between sources. These test `/analyze`'s conflict detection. Examples:
   - Interview A says users want real-time data. Interview B says users distrust real-time accuracy.
   - The brief says "mobile-first". The technical doc says the team has no mobile expertise.
   - One interview prioritizes speed. Another prioritizes accuracy over speed.
   - The benchmark shows competitors charge premium pricing. The brief says "must be free tier".

   Do NOT mark these contradictions in the source files — they should be discovered naturally by `/analyze`.

10. **Deliberate gaps** — Leave at least 1 strategic gap that `/analyze` should flag:
   - No source covers monetization strategy.
   - User interviews only cover one persona type.
   - No quantitative data backing a key claim in the brief.

### Phase 2: Verify & Report

11. **List all generated files** with their types and a 1-line summary.

12. **Hint at what `/analyze` should find** (without spoiling the contradictions):
    > Generated 6 sources for a fintech project. There are some interesting tensions between what users say and what the brief promises — run `/analyze` to surface them.

13. **Suggest next step:**
    > Run `/analyze` to extract insights and detect contradictions.

### Important constraints

- **Only write to `01_Sources/`** — never touch `02_Work/` or `03_Outputs/`.
- **Never reuse the same content** across runs — vary names, scenarios, and details.
- **Respect source immutability** — if `01_Sources/` already has files, warn the user and ask whether to add alongside or `/reset` first.
- **`seed-` prefix is mandatory** on folder names — enables easy cleanup without affecting real sources.
