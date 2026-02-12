---
name: status
description: Generate a Work layer dashboard (03_Outputs/STATUS.html) showing insights, conflicts, gaps, and source org issues with progressive disclosure
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
---

# /status — Work Layer Dashboard

## What this skill does

Generates a minimal, readable HTML dashboard of the current Work layer state. The user opens it in a browser to review insights, conflicts, and gaps before deciding next steps. This is an internal tool, not a stakeholder deliverable.

## When to use

- After `/analyze` — to review what was extracted before running `/synthesis`.
- After `/synthesis` — to verify the state of the knowledge base.
- Anytime — to get a snapshot of project health.

## Instructions

### Phase 1: Load

1. **Read all Work layer files:**
   - `02_Work/INSIGHTS_GRAPH.md` — parse all `[IG-XX]` entries with their status, category, claim, and source ref.
   - `02_Work/CONFLICTS.md` — parse all `[CF-XX]` entries with their status, tension, and insight refs.
   - `02_Work/SYSTEM_MAP.md` — parse modules, open questions.
   - `02_Work/MEMORY.md` — parse last session entry for timestamp.

2. **Scan sources** — Glob `01_Sources/` to count source files and detect organization issues (same checks as `/analyze` step 3).

3. **Compute summary stats:**
   - Total insights, broken down by status (PENDING, VERIFIED, MERGED, INVALIDATED).
   - Total conflicts, broken down by status (PENDING, RESOLVED).
   - Source file count and org issue count.
   - Evidence gaps (SYSTEM_MAP modules with no insight refs, or insight categories with no sources).

### Phase 2: Generate

4. **Write `03_Outputs/STATUS.html`** — A single self-contained HTML file. No external dependencies except system fonts.

#### Design principles

- **Progressive disclosure** — Summary first, details on click. Never overwhelm.
- **B/W minimal** — No color except functional: status badges. No gradients, no shadows, no decoration.
- **Readable** — System sans-serif (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`), 16px base, generous line-height.
- **Print-friendly** — Expand all sections in print media query.

#### HTML structure

```
┌─────────────────────────────────────────┐
│ PD-Spec Status                          │
│ Generated [date] · Last session: [date] │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ 12      │ │ 4       │ │ 6       │    │
│ │ Insights│ │Conflicts│ │ Sources │    │
│ │ 8P · 4V │ │ 3P · 1R │ │ 1 issue │    │
│ └─────────┘ └─────────┘ └─────────┘    │
│                                         │
│ ▸ Insights ──────────────────────────── │
│ ▸ Conflicts ─────────────────────────── │
│ ▸ Source Issues ─────────────────────── │
│ ▸ Evidence Gaps ─────────────────────── │
│ ▸ System Map Summary ───────────────── │
│                                         │
└─────────────────────────────────────────┘
```

**Summary cards** — Top-level stats. Always visible. Use monospace numbers for counts. Status breakdown below count (P=PENDING, V=VERIFIED, R=RESOLVED, etc.)

**Expandable sections** — Each uses `<details><summary>`. Closed by default.

#### Section: Insights (expanded)

Table with columns: ID | Status | Category | Claim | Source.
- Status shown as text badge: `PENDING`, `VERIFIED`, `MERGED`, `INVALIDATED`.
- Badge style: PENDING = light gray bg + dark text. VERIFIED = dark bg + white text. INVALIDATED = strikethrough.
- Sort: PENDING first, then VERIFIED, then rest.

#### Section: Conflicts (expanded)

Table with columns: ID | Status | Tension | Insights involved.
- PENDING = light gray badge. RESOLVED = dark badge.

#### Section: Source Issues

List of org problems found (misplaced files, missing metadata, wrong types, non-standard dates).

#### Section: Evidence Gaps

Areas where the knowledge base is thin. Each gap with a suggested action.

#### Section: System Map Summary

Current modules and open questions from SYSTEM_MAP.md. Each module shows its insight refs.

#### Cross-referencing (anchor hub)

STATUS.html is the canonical anchor hub — other documents link here with `STATUS.html#IG-01` or `STATUS.html#CF-03`.

**Requirements:**

- Every insight card must have `data-insight="IG-XX"` attribute.
- Every conflict card must have `data-conflict="CF-XX"` attribute.
- Add JS at script start to auto-assign `id` from these attributes:
  ```js
  document.querySelectorAll('[data-insight]').forEach(el => el.id = el.dataset.insight);
  document.querySelectorAll('[data-conflict]').forEach(el => el.id = el.dataset.conflict);
  ```
- When arriving via anchor (`location.hash`), auto-open the parent `<details>` and scroll to the target:
  ```js
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      const details = target.closest('details');
      if (details) details.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  ```
- CSS: smooth scroll + `:target` highlight (see CSS reference below).

#### CSS reference

```css
html { scroll-behavior: smooth; }
* { box-sizing: border-box; margin: 0; padding: 0; }
.insight-card:target { background: #fffde7; border-left: 3px solid #ffc107; padding-left: calc(0.5rem - 3px); transition: background 0.3s; }
.conflict-card:target { box-shadow: 0 0 0 2px #ffc107; transition: box-shadow 0.3s; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #111;
  background: #fff;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
h1 { font-size: 1.25rem; font-weight: 600; }
.meta { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }
.cards { display: flex; gap: 1rem; margin-bottom: 2rem; }
.card {
  flex: 1;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 1rem;
}
.card .count { font-size: 2rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.card .label { font-size: 0.875rem; color: #666; }
.card .breakdown { font-size: 0.75rem; color: #999; margin-top: 0.25rem; }
details { border-top: 1px solid #e5e5e5; }
summary {
  padding: 0.75rem 0;
  font-weight: 500;
  cursor: pointer;
  list-style: none;
}
summary::before { content: '▸ '; }
details[open] summary::before { content: '▾ '; }
table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.875rem; }
th { text-align: left; font-weight: 500; color: #666; border-bottom: 1px solid #e5e5e5; padding: 0.5rem 0.5rem; }
td { padding: 0.5rem; border-bottom: 1px solid #f5f5f5; vertical-align: top; }
.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 3px;
}
.badge-pending { background: #f5f5f5; color: #666; }
.badge-verified { background: #111; color: #fff; }
.badge-merged { background: #e5e5e5; color: #444; }
.badge-invalidated { background: #fff; color: #999; text-decoration: line-through; }
.badge-resolved { background: #111; color: #fff; }
.gap-item { padding: 0.5rem 0; border-bottom: 1px solid #f5f5f5; }
.gap-action { color: #666; font-size: 0.875rem; font-style: italic; }
@media print {
  details { open: true; }
  details[open] { display: block; }
  summary { display: none; }
  .cards { break-inside: avoid; }
}
```

### Phase 3: Report

5. **Tell the user** the file was generated and suggest opening it:
   > Dashboard generated at `03_Outputs/STATUS.html`. Open it in your browser to review the current state.

6. **Do NOT write to MEMORY.md** — `/status` is a read-only snapshot, not a pipeline action.
