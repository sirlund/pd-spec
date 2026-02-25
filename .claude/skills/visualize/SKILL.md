---
name: visualize
description: Generate interactive Mermaid diagrams (strategic-vision, proposals, insights, conflicts) as HTML in 03_Outputs/ from the knowledge base in 02_Work/
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write
argument-hint: "[strategic-vision|proposals|insights|conflicts|all]"
---

# /visualize — Diagram Generation

## What this skill does

Transforms the Work layer (`02_Work/`) into visual Mermaid diagrams rendered as interactive HTML files in `03_Outputs/`. Helps see relationships, dependencies, and tensions spatially instead of reading lists.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state. Compare against the current state of Work files. If discrepancies are found, report them to the user before proceeding.

**Language** — Check `output_language` in `PROJECT.md`. If PROJECT.md is missing, default to `en` and suggest running `/kickoff`. Write all diagram labels, node text, and legend entries in that language. System IDs stay in English.

### Phase 1: Load & Determine Target

1. **Determine target** — Based on user argument:
   - `strategic-vision` (default) — Visualize principles, domains, and their insight references from STRATEGIC_VISION.md.
   - `proposals` — Visualize design proposals hierarchy: domains > modules > features from PROPOSALS.md.
   - `insights` — Visualize the insights network: relationships, statuses, source references.
   - `conflicts` — Visualize tensions between insights and their resolution status.
   - `all` — Generate all diagrams in a single HTML file.

2. **Load knowledge base** — Read the relevant `02_Work/` files for the target diagram(s).

3. **Validate content** — If the target file is empty or has no entries, report this to the user and suggest running `/analyze` or `/spec` first.

### Phase 2: Propose (User Approval)

4. **Present diagram plan** — Before generating, show:
   - Which diagram type(s) will be generated.
   - Key nodes and relationships that will appear.
   - Any data quality issues (orphaned insights, missing references).
   - **Wait for user approval before generating.**

### Phase 3: Generate (After Approval)

5. **Build Mermaid diagram(s)** — Follow these syntax rules:

   **For strategic-vision:**
   - Use `flowchart TD` (top-down) for principle → domain hierarchy.
   - Nodes = principles, domains, value props. Edges = insight references `[IG-XX]`.
   - Color-code by status: green for verified-backed, yellow for pending, red for conflicted.

   **For proposals:**
   - Use `flowchart TD` for domain > module > feature hierarchy.
   - Nodes = [DP-XX] proposals. Edges = parent relationships + insight references.
   - Color by status: blue=PROPOSED, green=VALIDATED, yellow=BUILDING, gray=SHIPPED.

   **For insights:**
   - Use `graph LR` (left-right) for insight network.
   - Nodes = `[IG-XX]` insights. Edges = shared source or cross-references.
   - Shape by category: `([user-need])` rounded, `[[technical]]` box, `{business}` diamond, `>constraint]` flag.
   - Color by status: green=VERIFIED, yellow=PENDING, gray=MERGED, red=INVALIDATED.

   **For conflicts:**
   - Use `graph TD` for conflict map.
   - Nodes = `[CF-XX]` conflicts linking to their `[IG-XX]` tensions.
   - Color: red=PENDING, green=RESOLVED.

6. **Mermaid syntax rules** (prevent common parse errors):
   - Never use nested quotes inside node labels.
   - Edge labels between `|...|` must not contain quotes — use plain text.
   - Node IDs must be alphanumeric (no spaces, use underscores).
   - Subgraph titles must not contain special characters.
   - Always validate syntax mentally before writing.

7. **Generate HTML file** — Write to `03_Outputs/DIAGRAMS.html` (or `DIAGRAMS_[type].html` for single diagrams):

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <title>PD-Spec — [Diagram Type]</title>
     <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
     <style>
       body { font-family: 'Inter', sans-serif; background: #F0F2F5; margin: 0; padding: 2rem; }
       .diagram-container { background: white; border-radius: 8px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
       h1 { color: #1a1a1a; } h2 { color: #444; }
       .meta { color: #888; font-size: 0.9rem; }
     </style>
   </head>
   <body>
     <h1>PD-Spec Diagrams</h1>
     <p class="meta">Generated [date] · [insight count] insights · [conflict count] conflicts</p>
     <div class="diagram-container">
       <h2>[Diagram Title]</h2>
       <div class="mermaid">
         [mermaid code here]
       </div>
     </div>
     <script>mermaid.initialize({ startOnLoad: true, theme: 'neutral' });</script>
   </body>
   </html>
   ```

8. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`:
   ```markdown
   ## [YYYY-MM-DDTHH:MM] /visualize
   - **Request:** [what the user asked]
   - **Actions:** [diagram types generated, nodes/edges count]
   - **Result:** [output file path]
   - **Snapshot:** X insights (N VERIFIED, M PENDING) · Y conflicts PENDING · Z outputs
   ```
