Run pre-commit verification checks for PD-Spec engine development. Report results as a table.

## Checks

### 1. Version consistency
- Read `engine_version` from `PROJECT.md` template on main
- Read latest version header from `docs/CHANGELOG.md`
- PASS if they match, FAIL if they diverge

### 2. BACKLOG consistency
- Count PROPOSED items in `docs/BACKLOG.md` (grep `### \[BL-`)
- Count IMPLEMENTED items in archive section
- Verify no duplicate BL numbers exist
- PASS if no duplicates, report counts

### 3. Skill file integrity
- For each `.claude/skills/*/SKILL.md`, verify YAML frontmatter has: `name`, `description`, `user-invocable`, `allowed-tools`
- PASS if all skills have valid frontmatter, FAIL with list of broken skills

### 4. No generated content on main
- Run `git status` — check for files in `01_Sources/`, `02_Work/`, or `03_Outputs/*.html`
- PASS if clean, FAIL with list of offending files

### 5. CHANGELOG format
- Check latest entry in `docs/CHANGELOG.md` has a `##` version header with date
- Check it contains `<details>` for technical notes
- PASS if format correct, WARN if missing details block

### 6. Git state
- Report current branch, uncommitted changes, unpushed commits
- WARN if dirty working tree or unpushed commits

## Output format

```
/verify — PD-Spec Engine Checks

| # | Check | Status | Notes |
|---|---|---|---|
| 1 | Version consistency | PASS/FAIL | v4.13.0 in both |
| 2 | BACKLOG consistency | PASS/FAIL | 11 proposed, 20 implemented, 0 duplicates |
| 3 | Skill integrity | PASS/FAIL | 9/9 valid |
| 4 | Clean main | PASS/FAIL | No generated content |
| 5 | CHANGELOG format | PASS/WARN | Latest: v4.13.0 |
| 6 | Git state | OK/WARN | main, clean, up to date |
```
