---
name: kickoff
description: Project setup wizard. Asks project name, language, project type, and one-liner. Writes to PROJECT.md. Run once after cloning.
user-invocable: true
allowed-tools: Read, Edit, Write, Glob, AskUserQuestion
argument-hint: ""
---

# /kickoff — Project Setup

## What this skill does

Guides the user through initial project configuration after cloning the PD-Spec template. Asks 6 questions (name, language, one-liner, project type, starting point, user profile), writes the answers to `PROJECT.md`, and orients the user on next steps.

## When to use

- **First time** — right after cloning the PD-Spec template repo.
- **Re-configure** — if the user wants to change project name, language, or description.

## Instructions

### Phase 0: Check Existing Settings

1. **Read `PROJECT.md`** — check if it exists and has configured values (not placeholders like `[Set by /kickoff]`).

2. **If PROJECT.md exists with configured values**:
   - Show the current settings to the user.
   - Ask: "Project already configured. Want to re-configure?"
   - If no → skip to Phase 3 (orientation only).
   - If yes → proceed to Phase 1.

3. **If PROJECT.md is missing or has placeholders** → proceed to Phase 1.

### Phase 1: Ask Questions

Ask the user these questions **one at a time, each in its own turn**. Do NOT combine multiple questions in a single message. Wait for the user's answer before asking the next question.

4. **Project name** — Ask conversationally: "What's the name of your project?"
   - This becomes the title in all outputs (PRD, presentations, reports).
   - Examples: "NeoWallet", "HealthTrack Pro", "Marketplace X"

5. **One-liner** — Ask conversationally: "Describe your project in one sentence."
   - This provides context for the agent when generating outputs.
   - Examples: "A social banking app for Gen Z", "B2B SaaS for construction project management"

6. **Language** — Use `AskUserQuestion`: "What language should outputs be generated in?"
   - **English (en)** — All Work layer files and Outputs in English.
   - **Spanish (es)** — All Work layer files and Outputs in Spanish.
   - Default: `en`
   - Note: skill instructions, system IDs (`[IG-XX]`, `[CF-XX]`, `VERIFIED`, `PENDING`, `RESOLVED`), and template structure always stay in English regardless of this setting.

7. **Project type** — Use `AskUserQuestion` to ask what kind of project this is. Write the question text and option labels in `output_language`.
   - **Digital product** — SaaS, app, platform (new or existing — starting_point captures the distinction)
   - **Consulting / research** — benchmark, audit, analysis for a client
   - **Business strategy** — model, positioning, segments
   - (AskUserQuestion auto-provides "Other" with free text — do NOT add it as an explicit 5th option)
   - If the user selects "Other", ask a follow-up to describe the project type in one phrase.

8. **Starting point** — Use `AskUserQuestion`. Write question text and option labels in `output_language`.
   - **From scratch** — No existing product. Vision, hypotheses, maybe early research.
   - **Existing product** — Running MVP or product with real users. Need to diagnose what works and what doesn't.
   - **Existing ecosystem** — Designing on top of existing products, stack, or platform. Need to cross-reference what exists against what's desired.
   - This determines how PD-Spec approaches the project: full pipeline guidance for "from scratch", diagnostic-first for "existing product", cross-referencing for "existing ecosystem".

9. **User profile** — Use `AskUserQuestion`. Write question text and option labels in `output_language`.
   - **Founder / solo** — No dedicated design team. Need PD-Spec as an opinionated design partner.
   - **Designer / design team** — Have design expertise. Need PD-Spec as a second pair of eyes and evidence amplifier.
   - **Team with research** — Have research team or existing research. Need PD-Spec to synthesize and detect gaps.
   - This determines depth and tone: more structured guidance and probing for "founder/solo", more peer-level for "designer", lighter touch for "team with research".

10. **Team** — Ask conversationally (not AskUserQuestion — open-ended answer). "¿Quiénes componen el equipo? (ej: '2 diseñadores + 1 PM', 'founder solo'). Podés saltar esta pregunta si no aplica." If user skips → leave `team` as `[Set by /kickoff]`.

### Phase 2: Write Settings

7. **If PROJECT.md exists** — Use Edit to replace the settings section:

   ```markdown
   # Project Settings

   > Project-specific configuration. Created by `/kickoff`.
   > Edit manually anytime. This file is tracked per branch.

   - **project_name:** [user's answer]
   - **output_language:** en | es
   - **one_liner:** [user's answer]
   - **project_type:** [user's answer]
   - **starting_point:** from_scratch | existing_product | existing_ecosystem
   - **user_profile:** founder_solo | designer | team_with_research
   - **team:** [user's answer or leave as placeholder]
   - **started:** [today's date in YYYY-MM-DD]
   - **engine_version:** [read from current PROJECT.md or use latest]

   ## Current State

   > Updated automatically by skills after each execution.

   - **Maturity:** Level 1 (Seed)
   - **Last updated:** [today's date]
   - **Status:** Fresh project. Run `/extract` with source files, or start a conversation about your project.
   - **Insights count:** 0
   - **Conflicts count:** 0
   ```

8. **If PROJECT.md doesn't exist** — Use Write to create it with the template above.

### Phase 3: Orient

9. **Show confirmation** — Display the settings that were written.

10. **Next steps** — Adapt the orientation based on `starting_point`:

    **If `from_scratch`:**
    > Your project is set up. You can:
    > 1. **Add source files** to `01_Sources/` (interviews, briefs, docs) and run `/extract`
    > 2. **Run `/analyze`** — if you don't have files yet, it will offer to start from a conversation about your project
    > 3. **Run `/seed`** to generate synthetic test data first.

    **If `existing_product`:**
    > Your project is set up. Since you have an existing product:
    > 1. **Add what you have** to `01_Sources/` — user feedback, analytics, support tickets, feature requests, screenshots — and run `/extract`
    > 2. **Or run `/analyze` directly** — it will offer to start from a conversation if there are no extracted sources yet. Tell me what's working, what's not, what you've heard from users.

    **If `existing_ecosystem`:**
    > Your project is set up. Since you're designing on top of an existing ecosystem:
    > 1. **Add documentation** to `01_Sources/` — technical docs, stakeholder meeting notes, product specs, user research — and run `/extract`
    > 2. **Or run `/analyze` directly** — it will offer to start from a conversation about the ecosystem, or you can bring files first
    > 3. **Cross-referencing is key** — once sources are extracted, `/analyze` crosses signals between stakeholders, technical constraints, and user needs.

    Translate the above to the project's `output_language` if not `en`.

### Important constraints

- **Only writes to `PROJECT.md`** — never touches CLAUDE.md or layers (01_Sources, 02_Work, 03_Outputs).
- **Idempotent** — running `/kickoff` again detects existing settings and asks before overwriting.
- **No MEMORY.md entry** — this is a setup skill, not a pipeline skill. It doesn't append to the session log.
- **Language scope** — the `output_language` setting controls content language in Work and Output layers. It does NOT change: skill instructions (always English), system identifiers (`[IG-XX]`, `VERIFIED`, `PENDING`), template structure, or CLAUDE.md/PROJECT.md file structure.
