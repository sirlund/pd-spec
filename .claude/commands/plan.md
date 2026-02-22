Before implementing any engine change, fill out this plan and get user approval.

## Plan Template

### 1. What
- **BL reference:** BL-## (link to BACKLOG.md entry)
- **One-line summary:** What changes and why

### 2. Files to touch
List every file that will be created, modified, or deleted:

| File | Action | What changes |
|---|---|---|
| `.claude/skills/extract/SKILL.md` | modify | Add step 5c after... |
| `docs/BACKLOG.md` | modify | Mark BL-## as implemented |

### 3. Verification strategy
How will you confirm the change works? Be specific:
- **Grep checks:** "pattern X should appear in file Y"
- **Consistency checks:** "version in PROJECT.md matches CHANGELOG"
- **QA test:** "T## in QA_V{N}_PLAN.md covers this"
- **Manual inspection:** "user reviews diff before commit"

### 4. Blast radius
- **What could break:** Which skills, workflows, or worktrees are affected
- **Rollback:** How to undo if it goes wrong (usually: `git revert`)
- **Merge impact:** Will this cause conflicts when merging into project branches?

### 5. Commit plan
- Number of commits and their `type: BL-## — description` format
- Whether a `docs: release vX.Y.Z` commit is needed

## Rules
- Do NOT start implementing until the user approves this plan
- If the plan changes during implementation, update it and re-confirm
- After implementation, run `/verify` before committing
