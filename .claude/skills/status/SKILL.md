---
name: status
description: Generate interactive Work layer dashboard (03_Outputs/STATUS.html) — insights approval, conflict surfacing, prompt generator for /synthesis
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
---

# /status — Work Layer Dashboard

## What this skill does

Generates an interactive HTML dashboard of the current Work layer state. The user reviews insights and conflicts in a browser, makes decisions (approve/reject insights, flag/research/resolve conflicts), then generates a copy-paste prompt for `/synthesis`. This is an internal tool, not a stakeholder deliverable.

## When to use

- After `/analyze` — to review extractions and decide what to approve/reject.
- After `/synthesis` — to verify the updated state.
- Anytime — snapshot of project health.

## Instructions

**Language** — Check `output_language` in CLAUDE.md `## Project Settings`. Write all dashboard labels, section headings, and card descriptions in that language. Button labels (Approve/Reject, Flag/Research) should also be localized. System IDs and status labels stay in English.

### Phase 1: Load

1. **Read all Work layer files:**
   - `02_Work/INSIGHTS_GRAPH.md` — parse all `[IG-XX]` entries with status, category, claim, source ref, and key quote.
   - `02_Work/CONFLICTS.md` — parse all `[CF-XX]` entries with status, tension, insight refs, and resolution notes.
   - `02_Work/SYSTEM_MAP.md` — parse modules (name, status, blocker, insight refs), open questions.
   - `02_Work/MEMORY.md` — parse last session entry for timestamp.

2. **Scan sources** — Glob `01_Sources/` to count source files and detect organization issues.

3. **Compute summary stats** — insights by status, conflicts by status, source count, evidence gaps.

### Phase 2: Generate

4. **Write `03_Outputs/STATUS.html`** — Single self-contained HTML file. No external dependencies.

#### Design principles

- **Interactive** — User makes decisions directly in the browser. Decisions feed into a generated prompt.
- **Progressive disclosure** — Summary cards first, sections expand on click.
- **B/W minimal** — No decoration. Color only for functional badges and highlights.
- **Print-friendly** — Expand all sections, hide interactive elements in print.

#### Layout

```
┌─────────────────────────────────────────┐
│ PD-Spec Status                          │
│ Generated [date] · Last session: [ts]   │
├─────────────────────────────────────────┤
│ [12 Insights]  [4 Conflicts]  [6 Src]  │  ← summary cards
│ ▸ Insights ────────────────────────────  │  ← interactive cards
│ ▸ Conflicts ───────────────────────────  │  ← interactive cards
│ ▸ Source Issues ───────────────────────  │
│ ▸ Evidence Gaps ───────────────────────  │
│ ▸ System Map ──────────────────────────  │
│ ┌─ Generate /synthesis prompt ────────┐  │  ← action bar
│ │  [N decisions made]  [Generate]     │  │
│ └─────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### Section: Insights

Use **card layout** (not tables). Each insight is a `.insight-card` div with `data-insight="IG-XX"`.

```html
<div class="insight-card" data-insight="IG-01">
  <div class="insight-row">
    <span class="badge badge-verified">Verified</span>
    <span class="insight-id">IG-01</span>
    <span class="insight-cat">business</span>
    <span class="insight-claim">The claim text here</span>
    <!-- Only for PENDING insights: -->
    <div class="insight-action">
      <button class="insight-btn" data-action="approve" onclick="toggleInsight(this,'approve')">Approve</button>
      <button class="insight-btn" data-action="reject" onclick="toggleInsight(this,'reject')">Reject</button>
    </div>
  </div>
  <details class="insight-source">
    <summary class="source-ref">source-folder/filename.md</summary>
    <blockquote>Key quote from the source</blockquote>
  </details>
</div>
```

- **PENDING** insights: show approve/reject buttons. Toggle highlights the selected button (green for approve, red+strikethrough for reject).
- **VERIFIED/INVALIDATED** insights: show badge only, no buttons (already decided).
- Sort: PENDING first, then VERIFIED, then INVALIDATED.

#### Section: Conflicts

Use **card layout**. Each conflict is a `.conflict-card` div with `data-conflict="CF-XX"`.

**RESOLVED conflicts** — green border, no radio buttons, show resolution text:
```html
<div class="conflict-card resolved" data-conflict="CF-02">
  <div class="conflict-header">
    <span class="conflict-id">CF-02 · Title</span>
    <span class="badge badge-resolved">Resolved</span>
  </div>
  <div class="conflict-refs">IG-XX vs IG-YY</div>
  <div class="conflict-tension">Description of the tension.</div>
  <div class="conflict-resolution">Resolution text here.</div>
</div>
```

**PENDING conflicts** — three radio options for surfacing to stakeholders. The dashboard does NOT resolve conflicts — it surfaces them.

```html
<div class="conflict-card" data-conflict="CF-01">
  <div class="conflict-header">
    <span class="conflict-id">CF-01 · Title</span>
    <span class="badge badge-pending">Pending</span>
  </div>
  <div class="conflict-refs">IG-XX vs IG-YY</div>
  <div class="conflict-tension">Description of the tension.</div>
  <div class="conflict-options">
    <div class="conflict-option">
      <input type="radio" name="cf01" id="cf01a" value="Flag for discussion — [who]: [topic]">
      <label for="cf01a"><span class="option-label">Flag for discussion</span> — [who]: [topic]</label>
    </div>
    <div class="conflict-option">
      <input type="radio" name="cf01" id="cf01b" value="Needs more research — [what to research]">
      <label for="cf01b"><span class="option-label">Needs more research</span> — [what]</label>
    </div>
    <div class="conflict-option">
      <input type="radio" name="cf01" id="cf01c" value="I have context" onchange="showNote(this)">
      <label for="cf01c"><span class="option-label">I have context</span> — add notes below</label>
    </div>
    <textarea class="conflict-note" data-for="cf01" placeholder="What context?"></textarea>
  </div>
</div>
```

- "Flag for discussion" and "Needs more research" labels include **specific context** (who to involve, what to research) derived from the conflict data.
- "I have context" shows a textarea for user notes. The textarea is hidden by default, shown when this option is selected.
- Badges: `.badge-flagged` for flagged conflicts, `.badge-research` for research-needed.

#### Section: Source Issues, Evidence Gaps, System Map

Same as before — list items with descriptions and suggested actions. System Map shows modules with status badges, insight refs, and open questions.

#### Action Bar — Prompt Generator

Fixed section at the bottom. Generates a `/synthesis` prompt from all user decisions.

```html
<div class="action-bar">
  <div class="action-bar-header">
    <h2>Generate /synthesis prompt</h2>
    <span class="decision-count" id="decisionCount">0 decisions made</span>
  </div>
  <button class="generate-btn" onclick="generatePrompt()">Generate prompt</button>
  <div class="prompt-output" id="promptOutput">
    <button class="copy-btn" onclick="copyPrompt()">Copy</button>
    <pre id="promptText"></pre>
  </div>
</div>
```

**Prompt format** — Groups decisions by type:
```
/synthesis with these inputs:

## Flag for stakeholder discussion
CF-01: Flag for discussion — CTO + Product: [topic]

## Needs more research
CF-03: Needs more research — [what]

## Resolution context provided
CF-04: Context: [user's notes]

Approve insights: IG-01, IG-03, IG-04
Reject insights: IG-02, IG-09
```

#### JavaScript requirements

1. **`toggleInsight(btn, action)`** — Toggle approve/reject on PENDING insights. Uses `btn.closest('.insight-card')` to find the card. Tracks decisions in an `insightDecisions` object.
2. **`showNote(radio)`** — Show textarea when "I have context" is selected.
3. **`updateCount()`** — Count all decisions (conflict radios + insight buttons). Update the decision counter.
4. **`generatePrompt()`** — Build the prompt text from all decisions. Group conflicts by action type. List approved/rejected insights.
5. **`copyPrompt()`** — Copy to clipboard + show toast notification.
6. **Radio change listener** — On any conflict radio change: if not "I have context", hide the textarea. Always call `updateCount()`.
7. **Cross-referencing** — Auto-assign `id` from `data-insight`/`data-conflict`. Auto-open parent `<details>` on anchor navigation (see Cross-referencing section below).

#### Cross-referencing (anchor hub)

STATUS.html is the canonical anchor hub — other documents link here with `STATUS.html#IG-01` or `STATUS.html#CF-03`.

- Every card already has `data-insight`/`data-conflict` attributes.
- JS at script start assigns `id` from these:
  ```js
  document.querySelectorAll('[data-insight]').forEach(el => el.id = el.dataset.insight);
  document.querySelectorAll('[data-conflict]').forEach(el => el.id = el.dataset.conflict);
  ```
- Auto-open parent `<details>` when arriving via anchor:
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

#### CSS reference

```css
html { scroll-behavior: smooth; }
* { box-sizing: border-box; margin: 0; padding: 0; }

/* Target highlight for cross-referencing */
.insight-card:target { background: #fffde7; border-left: 3px solid #ffc107; padding-left: calc(0.5rem - 3px); transition: background 0.3s; }
.conflict-card:target { box-shadow: 0 0 0 2px #ffc107; transition: box-shadow 0.3s; }

/* Base */
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; line-height: 1.6; color: #111; background: #fff; max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem; }
.meta { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }

/* Summary cards */
.cards { display: flex; gap: 1rem; margin-bottom: 2rem; }
.card { flex: 1; border: 1px solid #e5e5e5; border-radius: 6px; padding: 1rem; }
.card .count { font-size: 2rem; font-weight: 600; font-variant-numeric: tabular-nums; }
.card .label { font-size: 0.875rem; color: #666; }
.card .breakdown { font-size: 0.75rem; color: #999; margin-top: 0.25rem; }
.card.card-warn { border-color: #f0d080; }
.card.card-ok { border-color: #a3d9a5; }
.card.card-error { border-color: #e8a0a0; }

/* Sections */
details { border-top: 1px solid #e5e5e5; }
summary { padding: 0.75rem 0; font-weight: 500; cursor: pointer; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary::before { content: '▸ '; color: #999; }
details[open] summary::before { content: '▾ '; }

/* Badges */
.badge { display: inline-block; font-size: 0.7rem; font-weight: 500; padding: 0.1rem 0.4rem; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.03em; }
.badge-pending { background: #fef3cd; color: #856404; }
.badge-verified { background: #d4edda; color: #155724; }
.badge-merged { background: #d1ecf1; color: #0c5460; }
.badge-invalidated { background: #f5f5f5; color: #999; text-decoration: line-through; }
.badge-resolved { background: #d4edda; color: #155724; }
.badge-flagged { background: #fef3cd; color: #856404; }
.badge-research { background: #d1ecf1; color: #0c5460; }

/* Insight cards */
.insight-card { padding: 0.5rem 0; border-bottom: 1px solid #f5f5f5; }
.insight-card:last-child { border-bottom: none; }
.insight-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; flex-wrap: wrap; }
.insight-id { font-weight: 600; font-size: 0.8rem; color: #444; }
.insight-cat { font-size: 0.75rem; color: #999; }
.insight-claim { flex: 1; min-width: 200px; }
.insight-source blockquote { margin: 0.375rem 0 0.5rem; padding: 0.5rem 0.75rem; border-left: 3px solid #e5e5e5; background: #fafafa; font-size: 0.8rem; color: #444; line-height: 1.5; }
.source-ref { color: #999; font-size: 0.8rem; cursor: pointer; }

/* Insight action buttons */
.insight-action { display: flex; gap: 0.25rem; }
.insight-btn { background: none; border: 1px solid #e5e5e5; border-radius: 3px; padding: 0.1rem 0.35rem; font-size: 0.7rem; cursor: pointer; color: #666; }
.insight-btn:hover { background: #f5f5f5; }
.insight-btn.selected-approve { background: #d4edda; color: #155724; border-color: #a3d9a5; }
.insight-btn.selected-reject { background: #f8d7da; color: #721c24; border-color: #e8a0a0; text-decoration: line-through; }

/* Conflict cards */
.conflict-card { border: 1px solid #e5e5e5; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; }
.conflict-card.resolved { border-color: #a3d9a5; background: #fafff9; }
.conflict-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.conflict-id { font-weight: 600; font-size: 0.875rem; }
.conflict-refs { font-size: 0.75rem; color: #999; margin-bottom: 0.5rem; }
.conflict-tension { font-size: 0.875rem; margin-bottom: 0.75rem; }
.conflict-resolution { font-size: 0.875rem; color: #155724; padding: 0.5rem 0.75rem; background: #d4edda; border-radius: 4px; }
.conflict-options { display: flex; flex-direction: column; gap: 0.375rem; }
.conflict-option { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.875rem; }
.conflict-option input[type="radio"] { margin-top: 0.3rem; }
.conflict-option .option-label { font-weight: 500; }
.conflict-note { width: 100%; margin-top: 0.5rem; padding: 0.375rem 0.5rem; border: 1px solid #e5e5e5; border-radius: 4px; font-family: inherit; font-size: 0.8rem; resize: vertical; display: none; }
.conflict-note.visible { display: block; }

/* Action bar */
.action-bar { margin-top: 2rem; padding: 1rem; border: 1px solid #111; border-radius: 6px; }
.action-bar h2 { font-size: 0.875rem; font-weight: 600; }
.action-bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.decision-count { font-size: 0.75rem; color: #666; }
.generate-btn { display: block; width: 100%; padding: 0.625rem; background: #111; color: #fff; border: none; border-radius: 4px; font-family: inherit; font-size: 0.875rem; font-weight: 500; cursor: pointer; }
.generate-btn:hover { background: #333; }
.prompt-output { margin-top: 0.75rem; padding: 0.75rem; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 4px; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8rem; white-space: pre-wrap; display: none; position: relative; }
.prompt-output.visible { display: block; }
.copy-btn { position: absolute; top: 0.5rem; right: 0.5rem; background: #111; color: #fff; border: none; border-radius: 3px; padding: 0.2rem 0.5rem; font-size: 0.7rem; cursor: pointer; }
.toast { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: #111; color: #fff; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.8rem; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
.toast.show { opacity: 1; }

/* System map */
.module-item { padding: 0.5rem 0; border-bottom: 1px solid #f5f5f5; font-size: 0.875rem; }
.module-name { font-weight: 600; }
.module-refs { font-size: 0.75rem; color: #999; }
.module-status { font-size: 0.8rem; color: #666; margin-top: 0.125rem; }
.oq-item { padding: 0.375rem 0; font-size: 0.875rem; color: #444; }
.gap-item { padding: 0.75rem 0; border-bottom: 1px solid #f5f5f5; }
.gap-action { color: #666; font-size: 0.875rem; font-style: italic; margin-top: 0.25rem; }

@media print {
  details[open] > summary { display: none; }
  details { border: none; }
  .action-bar, .insight-btn, .conflict-options { display: none; }
}
```

### Phase 3: Report

5. **Tell the user** the file was generated:
   > Dashboard generated at `03_Outputs/STATUS.html`. Open it in your browser to review and make decisions.

6. **Do NOT write to MEMORY.md** — `/status` is a read-only snapshot, not a pipeline action.
