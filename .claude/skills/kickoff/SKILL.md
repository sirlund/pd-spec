---
name: kickoff
description: Project setup wizard. Asks project name, language (en/es), and one-liner. Writes to PROJECT.md. Run once after cloning.
user-invocable: true
allowed-tools: Read, Edit, Write, Glob
argument-hint: ""
---

# /kickoff — Project Setup

## What this skill does

Guides the user through initial project configuration after cloning the PD-Spec template. Asks 3 questions, writes the answers to `PROJECT.md`, and orients the user on next steps.

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

Ask the user these 3 questions. Use `AskUserQuestion` for the language (structured choice). Ask project name and one-liner as natural conversation.

4. **Project name** — "What's the name of your project?"
   - This becomes the title in all outputs (PRD, presentations, reports).
   - Examples: "NeoWallet", "HealthTrack Pro", "Marketplace X"

5. **Language** — "What language should outputs be generated in?"
   - **English (en)** — All Work layer files and Outputs in English.
   - **Spanish (es)** — All Work layer files and Outputs in Spanish.
   - Default: `en`
   - Note: skill instructions, system IDs (`[IG-XX]`, `[CF-XX]`, `VERIFIED`, `PENDING`, `RESOLVED`), and template structure always stay in English regardless of this setting.

6. **One-liner** — "Describe your project in one sentence."
   - This provides context for the agent when generating outputs.
   - Examples: "A social banking app for Gen Z", "B2B SaaS for construction project management"

### Phase 2: Write Settings

7. **If PROJECT.md exists** — Use Edit to replace the settings section:

   ```markdown
   # Project Settings

   > Project-specific configuration. Created by `/kickoff`.
   > Edit manually anytime. This file is tracked per branch.

   - **project_name:** [user's answer]
   - **output_language:** en | es
   - **one_liner:** [user's answer]
   - **team:** [user's answer or leave as placeholder]
   - **started:** [today's date in YYYY-MM-DD]
   - **engine_version:** [read from current PROJECT.md or use latest]

   ## Current State

   > Updated automatically by skills after each execution.

   - **Maturity:** Level 1 (Seed)
   - **Last updated:** [today's date]
   - **Status:** Fresh project. Add sources to `01_Sources/` and run `/extract`.
   - **Insights count:** 0
   - **Conflicts count:** 0
   ```

8. **If PROJECT.md doesn't exist** — Use Write to create it with the template above.

### Phase 3: Orient

9. **Show confirmation** — Display the settings that were written.

10. **Next steps** — Tell the user:

    If output_language is `en`:
    > Your project is set up. Here's what to do next:
    > 1. Add your source files to `01_Sources/` — interviews, briefs, technical docs, benchmarks. See `01_Sources/_README.md` for format guidance.
    > 2. Run `/analyze` to extract insights and detect contradictions.
    >
    > Or run `/seed` to generate synthetic test data first.

    If output_language is `es`:
    > Tu proyecto está configurado. Próximos pasos:
    > 1. Agrega tus fuentes a `01_Sources/` — entrevistas, briefs, docs técnicos, benchmarks. Consulta `01_Sources/_README.md` para guía de formato.
    > 2. Ejecuta `/analyze` para extraer insights y detectar contradicciones.
    >
    > O ejecuta `/seed` para generar datos de prueba sintéticos primero.

### Important constraints

- **Only writes to `PROJECT.md`** — never touches CLAUDE.md or layers (01_Sources, 02_Work, 03_Outputs).
- **Idempotent** — running `/kickoff` again detects existing settings and asks before overwriting.
- **No MEMORY.md entry** — this is a setup skill, not a pipeline skill. It doesn't append to the session log.
- **Language scope** — the `output_language` setting controls content language in Work and Output layers. It does NOT change: skill instructions (always English), system identifiers (`[IG-XX]`, `VERIFIED`, `PENDING`), template structure, or CLAUDE.md/PROJECT.md file structure.
