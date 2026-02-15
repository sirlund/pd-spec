#!/bin/bash
# ============================================================================
# PD-Spec Sprint Orchestrator v2 — Olas 2-4
# ============================================================================
# Ola 1 completada manualmente (2026-02-14, commit 68c696f).
# Este script ejecuta Olas 2, 3, y 4 del roadmap (docs/SPRINT.md).
#
# Usa git worktrees para aislar cada agente. Cero conflictos de archivos.
#
# Uso:
#   chmod +x scripts/pd-spec-sprint-orchestrator.sh
#   ./scripts/pd-spec-sprint-orchestrator.sh           # Todas las olas (2-4)
#   ./scripts/pd-spec-sprint-orchestrator.sh --ola 2   # Solo ola 2
#   ./scripts/pd-spec-sprint-orchestrator.sh --dry-run  # Preview sin ejecutar
# ============================================================================

set -euo pipefail

# ─── Config ─────────────────────────────────────────────────────────────────
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_BASE="${REPO_ROOT}/../pd-spec-worktrees"
LOG_DIR="${REPO_ROOT}/../pd-spec-sprint-logs"
MAIN_BRANCH="main"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DRY_RUN=false
SKIP_MERGE=false
ONLY_OLA=0

PROMPT_DIR=$(mktemp -d)
trap "rm -rf $PROMPT_DIR" EXIT

# ─── Parse args ─────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case $1 in
    --ola) ONLY_OLA="$2"; shift 2 ;;
    --dry-run) DRY_RUN=true; shift ;;
    --skip-merge) SKIP_MERGE=true; shift ;;
    *) echo "Flag desconocido: $1"; exit 1 ;;
  esac
done

# ─── Helpers ────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${CYAN}[$(date +%H:%M:%S)]${NC} $1"; }
ok()   { echo -e "${GREEN}[OK] $1${NC}"; }
warn() { echo -e "${YELLOW}[!] $1${NC}"; }
err()  { echo -e "${RED}[ERR] $1${NC}"; }

run_cmd() {
  if $DRY_RUN; then
    echo -e "  ${YELLOW}[DRY-RUN]${NC} $1"
  else
    eval "$1"
  fi
}

# ─── Pre-flight checks ─────────────────────────────────────────────────────
log "Pre-flight checks..."

if ! command -v claude &> /dev/null; then
  err "Claude Code no encontrado. Instala con: npm install -g @anthropic-ai/claude-code"
  exit 1
fi

if ! git diff --quiet HEAD 2>/dev/null; then
  warn "Tienes cambios sin commit."
  read -p "Continuar? (y/N) " -n 1 -r; echo
  [[ ! $REPLY =~ ^[Yy]$ ]] && exit 1
fi

mkdir -p "$LOG_DIR" "$WORKTREE_BASE"
log "Repo: $REPO_ROOT"
log "Worktrees: $WORKTREE_BASE"
log "Logs: $LOG_DIR"
echo ""

# ============================================================================
# FUNCIONES DE ORQUESTACION
# ============================================================================

# Global return values (avoids subshell issues with $() capture)
_WT_PATH=""
_AGENT_PID=""

create_worktree() {
  local branch_name="$1"
  _WT_PATH="${WORKTREE_BASE}/${branch_name}"

  if $DRY_RUN; then
    log "[DRY-RUN] git worktree add '${_WT_PATH}' -b '$branch_name'"
    return
  fi

  if [ -d "$_WT_PATH" ]; then
    warn "Worktree $branch_name ya existe, limpiando..."
    git worktree remove "$_WT_PATH" --force 2>/dev/null || true
    git branch -D "$branch_name" 2>/dev/null || true
  fi

  git worktree add "$_WT_PATH" -b "$branch_name" > /dev/null 2>&1
}

launch_agent() {
  local worktree_path="$1"
  local agent_name="$2"
  local prompt_file="$3"
  local log_file="${LOG_DIR}/${TIMESTAMP}_${agent_name}.md"

  log "Lanzando agente: ${BLUE}${agent_name}${NC}"

  if $DRY_RUN; then
    log "[DRY-RUN] claude -p <${prompt_file}> in ${worktree_path}"
    _AGENT_PID="DRY"
    return
  fi

  (
    cd "$worktree_path"
    unset CLAUDECODE
    claude -p "$(cat "$prompt_file")" --dangerously-skip-permissions --verbose > "$log_file" 2>&1
    echo "EXIT_CODE=$?" >> "$log_file"
  ) &

  _AGENT_PID=$!
}

wait_for_agents() {
  local agent_names=("${!1}")
  local pids=("${!2}")

  if $DRY_RUN; then
    for name in "${agent_names[@]}"; do
      ok "[DRY-RUN] $name (skipped)"
    done
    return 0
  fi

  log "Esperando ${#pids[@]} agentes..."
  echo ""

  local failed=0
  for i in "${!pids[@]}"; do
    local pid="${pids[$i]}"
    local name="${agent_names[$i]}"
    if wait "$pid"; then
      ok "$name completado (PID $pid)"
    else
      err "$name fallo (PID $pid) — revisa logs"
      ((failed++))
    fi
  done

  echo ""
  if [ $failed -gt 0 ]; then
    err "$failed agente(s) fallaron. Revisa logs en $LOG_DIR"
    read -p "Continuar con merge de los exitosos? (y/N) " -n 1 -r; echo
    [[ ! $REPLY =~ ^[Yy]$ ]] && return 1
  fi
  return 0
}

merge_wave() {
  local wave_name="$1"
  shift
  local branches=("$@")

  if $SKIP_MERGE || $DRY_RUN; then
    for branch in "${branches[@]}"; do
      ok "[DRY-RUN/SKIP] $branch merge skipped"
    done
    return 0
  fi

  log "Mergeando $wave_name a $MAIN_BRANCH..."
  cd "$REPO_ROOT"
  git checkout "$MAIN_BRANCH"

  for branch in "${branches[@]}"; do
    log "  Mergeando $branch..."
    if ! git merge "$branch" --no-ff -m "merge: ${wave_name} — ${branch}"; then
      err "Conflicto en merge de $branch."
      err "Resuelve manualmente, commitea, y re-ejecuta con --ola <siguiente>"
      return 1
    fi
    ok "  $branch mergeado"
  done

  ok "$wave_name mergeada completamente"
}

cleanup_worktrees() {
  local branches=("$@")

  if $DRY_RUN; then
    ok "[DRY-RUN] Cleanup skipped"
    return
  fi

  log "Limpiando worktrees..."
  for branch in "${branches[@]}"; do
    local worktree_path="${WORKTREE_BASE}/${branch}"
    git worktree remove "$worktree_path" --force 2>/dev/null || true
    git branch -d "$branch" 2>/dev/null || true
  done

  ok "Worktrees limpiados"
}

# ============================================================================
# OLA 2 — ARQUITECTURA (3 agents secuenciales: A1 -> A2 -> A3)
# ============================================================================
run_ola_2() {
  echo ""
  echo -e "${BLUE}================================================================${NC}"
  echo -e "${BLUE}  OLA 2 — ARQUITECTURA (A1 -> A2 -> A3, secuencial)${NC}"
  echo -e "${BLUE}================================================================${NC}"
  echo ""

  # ── A1: /extract ──────────────────────────────────────────────────────────
  log "Fase 2a: A1 /extract"

  cat > "${PROMPT_DIR}/a1.md" << 'PROMPT_A1'
# Task: Create /extract skill (A1)

You are a Claude Code agent working on PD-Spec, a product research tool that uses a 3-layer architecture:
- 01_Sources/ (read-only raw inputs)
- 02_Work/ (agent-managed knowledge base: insights, conflicts, system map)
- 03_Outputs/ (derived deliverables)

Skills live in .claude/skills/NAME/SKILL.md. Read CLAUDE.md first to understand the full architecture.

## Problem

Currently /analyze does TWO jobs:
1. Read source files from 01_Sources/ (discovery, validation, multimodal reading)
2. Analyze them (extract insights, cross-reference, detect conflicts)

This needs to be split. /extract handles reading, /analyze handles thinking.

## What to Create

### 1. Create .claude/skills/extract/SKILL.md

Read .claude/skills/analyze/SKILL.md first to understand the existing pattern.

The new /extract skill must:

**Frontmatter** (follow exact format from other skills):
```yaml
---
name: extract
description: Read and extract raw claims from source files in 01_Sources/. Writes structured extractions to 02_Work/EXTRACTIONS.md for /analyze to process.
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
argument-hint: "[folder-name]"
---
```

**Skill instructions** — structure as phases like other skills:

Phase 0: Session Resume
- Read 02_Work/MEMORY.md for last known state
- Check output_language from CLAUDE.md Project Settings

Phase 1: Discover Sources
- Glob 01_Sources/ recursively (same exclusions as current /analyze step 1)
- If argument provided, only process that subfolder
- Read _CONTEXT.md files for folder context
- Validate source organization (same checks as current /analyze step 3)
- Report progress: "Processing folder_name/ — X files found"

Phase 2: Read & Extract
- For each source file, read it and extract raw claims/facts
- Multimodal: Read images (PNG, JPG) directly with Read tool, PDFs with pages parameter
- Non-readable files: use _CONTEXT.md descriptions
- Large source sets (>20 files): process in batches by subfolder, report progress between batches
- Each extracted claim is a raw quote or factual statement — NO interpretation, NO categorization
- _CONTEXT.md must follow _CONTEXT_TEMPLATE.md structure; flag deviations
- _CONTEXT.md must NOT contain derived insights or analysis; flag if found

Phase 3: Write Extractions
- Write to 02_Work/EXTRACTIONS.md
- Format per source file:
```
## [source-folder/filename.md]
- Type: [from metadata or _CONTEXT.md]
- Date: [from metadata]
- Participants: [if applicable]

### Raw Claims
1. "[exact quote or factual claim from source]"
2. "[another claim]"
...
```
- Each claim is a verbatim quote or close paraphrase — the agent does NOT interpret
- Include ALL claims, even seemingly minor ones — /analyze decides relevance

Phase 4: Report
- Summary: files processed, claims extracted per file, any organization issues
- Remind user: "Run /analyze to process extractions into insights"

Phase 5: Write to MEMORY.md
- Append entry with timestamp (ISO format YYYY-MM-DDTHH:MM), request, actions, result, snapshot

### 2. Create 02_Work/EXTRACTIONS.md template

```markdown
# Source Extractions

Raw claims extracted from source files by /extract. Each claim is a verbatim quote or factual statement — no interpretation.

This file is the input for /analyze. Do not edit manually.

---

<!-- Extractions are appended below by /extract -->
```

### 3. Update .claude/skills/analyze/SKILL.md

/analyze should now read from 02_Work/EXTRACTIONS.md instead of 01_Sources/ directly.

Changes needed:
- Phase 1 step 1: Instead of "Discover sources", read 02_Work/EXTRACTIONS.md
- Phase 1 steps 2-4: Remove source discovery, folder context reading, and direct file reading
- Add a check: if EXTRACTIONS.md is empty or missing, tell user to run /extract first
- Keep all Phase 2 logic (analysis, cross-referencing, conflict detection) unchanged
- The insight format, temporal tags, key quotes, atomicity rules all stay the same
- Add /extract as a prerequisite in the skill description

### 4. Update CLAUDE.md

- Add /extract to the Skills Pipeline table (before /analyze)
- Add extract/SKILL.md to the Folder Structure
- Add 02_Work/EXTRACTIONS.md to Sources of Truth table
- Update the pipeline description: /extract -> /analyze -> /synthesis -> /ship

## Constraints
- Follow the EXACT frontmatter format used by other skills
- Follow the EXACT phase structure pattern (Phase 0: Session Resume, Phase N: ...)
- Use output_language for all user-facing text in EXTRACTIONS.md
- System IDs and status labels stay in English
- Do NOT touch /ship, /synthesis, /status, /visualize, /seed, /reset, /kickoff

## When Done
Commit all changes with:
```
git add -A && git commit -m "feat(extract): A1 — /extract skill separates source reading from analysis

New pipeline: /extract reads 01_Sources/ and writes raw claims to
02_Work/EXTRACTIONS.md. /analyze now reads EXTRACTIONS.md instead
of sources directly. Separation of concerns: reading vs thinking.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_A1

  create_worktree "ola2-extract"
  launch_agent "$_WT_PATH" "ola2-extract" "${PROMPT_DIR}/a1.md"
  local pids_a=("$_AGENT_PID")
  local names_a=("ola2-extract")

  wait_for_agents names_a[@] pids_a[@]
  merge_wave "Ola 2a — Extract" "ola2-extract"
  cleanup_worktrees "ola2-extract"

  # ── A2: Template + JSON ───────────────────────────────────────────────────
  log "Fase 2b: A2 Template+JSON"

  cat > "${PROMPT_DIR}/a2.md" << 'PROMPT_A2'
# Task: Implement Template+JSON architecture for outputs (A2)

You are a Claude Code agent working on PD-Spec. Read CLAUDE.md first.

## Problem

Currently /ship generates entire HTML files (3000-5000 lines) directly. This is:
- Slow (4-9 minutes per output)
- Error-prone (formatting bugs, CSS inconsistencies)
- Hard to maintain (every output re-invents the HTML)

## Solution: Template + JSON

The agent writes a small JSON data file (~100-200 lines). A static HTML template reads the JSON and renders it client-side. This separates content (agent's job) from presentation (template's job).

## Architecture

### Self-contained approach
Each output is a single HTML file that contains:
1. The static template (HTML + CSS + JS) — never changes between runs
2. The JSON data in a `<script id="pd-data" type="application/json">` block — agent writes this

The agent's job reduces to: read Work layer, produce JSON, inject into template.

### File structure to create

```
03_Outputs/
  _templates/
    _base.css          — shared CSS (Inter font, A4 page system, callouts, badges, print)
    _base.js           — shared JS (JSON loader, ref-link converter, cross-referencing)
    prd.html           — PRD template (reads embedded JSON, renders sections)
    report.html        — Report template
    presentation.html  — Reveal.js template
    status.html        — Dashboard template (this will be expanded in A3)
  _schemas/
    prd.schema.json    — JSON Schema for PRD data
    report.schema.json — JSON Schema for Report data
    base.schema.json   — Shared schema definitions (meta, sections, refs)
```

### JSON data format (base schema)

Every output JSON has this structure:

```json
{
  "meta": {
    "type": "prd",
    "version": "v1.0",
    "generated": "2026-02-14",
    "language": "es",
    "project": "TIMining",
    "snapshot": {
      "insights_total": 110,
      "insights_verified": 110,
      "conflicts_pending": 0,
      "outputs_count": 7
    },
    "changelog": [
      {"version": "v1.0", "date": "2026-02-14", "description": "Initial version"}
    ]
  },
  "title": "TIMining — Documento de Requisitos de Producto",
  "sections": [
    {
      "id": "vision",
      "heading": "Vision del Producto",
      "type": "text",
      "content": "Paragraph of text here...",
      "refs": ["IG-01", "IG-05", "IG-12"]
    },
    {
      "id": "modules",
      "heading": "Modulos",
      "type": "module-list",
      "items": [
        {
          "name": "Dashboard Operacional",
          "status": "Ready",
          "refs": ["IG-07", "IG-23"],
          "implications": [
            {"text": "Progressive disclosure for complex data", "ref": "IG-07"},
            {"text": "Offline-first architecture", "ref": "IG-23"}
          ]
        }
      ]
    },
    {
      "id": "callout-section",
      "heading": "Insight Clave",
      "type": "callout",
      "content": "Important finding here",
      "refs": ["IG-42"]
    },
    {
      "id": "table-section",
      "heading": "Matriz de Prioridades",
      "type": "table",
      "headers": ["Modulo", "Prioridad", "Refs"],
      "rows": [
        ["Dashboard", "Alta", "[IG-07]"],
        ["Reportes", "Media", "[IG-15]"]
      ]
    }
  ]
}
```

Section types: "text", "callout", "table", "module-list", "open-questions", "gap"

### Template rendering (_base.js)

The template JS should:
1. Read JSON from `<script id="pd-data" type="application/json">`
2. Render sections based on their "type"
3. Convert [IG-XX] and [CF-XX] references to clickable links (STATUS.html#ID)
4. Apply doc-meta header from meta.version, meta.generated, meta.snapshot
5. Handle output_language (all UI chrome matches meta.language)

### Shared CSS (_base.css)

Extract the existing CSS from the current PRD.html pattern. Read .claude/skills/ship/SKILL.md step 5 for the reference:
- Inter font (Google Fonts)
- .page container: 21cm width, 2.54cm padding
- Gray background (#F0F2F5), white page
- Print media query for clean PDF export
- Green callout boxes (.callout)
- .ref-link styles for cross-referencing
- Badge styles (.badge-verified, .badge-pending, etc.)
- Multi-page: .page divs with page-break-after

### PRD template (prd.html)

A self-contained HTML file that:
1. Includes _base.css inline (or via relative link)
2. Has a `<script id="pd-data" type="application/json">` placeholder
3. Has JS that reads the JSON and renders:
   - doc-meta header with version, date, snapshot, changelog
   - Each section based on its type
   - Insight summary table at the end
   - Cross-reference links

### Report template (report.html)

Same base but optimized for print:
- Cover page with title, date, project name
- Table of contents (auto-generated from sections)
- Page breaks between major sections
- No interactive elements

### Presentation template (presentation.html)

Uses Reveal.js CDN. JSON structure slightly different:
- Sections become slides
- Speaker notes in a "notes" field per section
- Use target="_blank" on ref links

## What to Update

### .claude/skills/ship/SKILL.md

The /ship skill needs major updates:

Phase 3 (Generate) should change from "generate HTML" to:
1. Read the appropriate template from 03_Outputs/_templates/
2. Generate the JSON data object from Work layer content
3. Inject JSON into the template's `<script id="pd-data">` tag
4. Write the combined file to 03_Outputs/TYPE.html

The agent no longer writes CSS, HTML structure, or JS. It only writes JSON.

Keep all existing rules:
- Emoji policy (functional only)
- No redundancy
- GAP markers for sections without refs
- doc-meta with changelog (now in JSON meta)
- Cross-referencing (now handled by template JS)
- Traceability requirements
- MEMORY.md entry

### .claude/skills/status/SKILL.md

Read this skill and note how STATUS.html is currently generated. The /status skill should also move to Template+JSON:
- Template in 03_Outputs/_templates/status.html
- Agent generates JSON with insight cards, conflict cards, stats, etc.
- Template handles all interactivity (approve/reject buttons, prompt generator)

This is a PARTIAL update — the full dashboard redesign happens in A3. For now, just convert the existing STATUS functionality to Template+JSON.

## Constraints
- Templates must be SELF-CONTAINED (work by opening the HTML file directly in a browser)
- No build tools, no npm, no bundling — just HTML/CSS/JS
- CSS and JS can be in separate files in _templates/ (templates link to them relatively)
- But the FINAL output (03_Outputs/PRD.html etc.) should inline everything for portability
- Follow existing PD-Spec patterns and mandates
- Do NOT modify /analyze, /synthesis, /extract, /kickoff, /seed, /reset, /visualize

## When Done
Commit all changes:
```
git add -A && git commit -m "feat(arch): A2 — Template+JSON architecture for all outputs

Agent writes JSON data (~100-200 lines), static HTML template renders it.
Separates content from presentation. Templates in 03_Outputs/_templates/,
schemas in 03_Outputs/_schemas/. /ship now produces JSON, not raw HTML.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_A2

  create_worktree "ola2-template-json"
  launch_agent "$_WT_PATH" "ola2-template-json" "${PROMPT_DIR}/a2.md"
  local pids_b=("$_AGENT_PID")
  local names_b=("ola2-template-json")

  wait_for_agents names_b[@] pids_b[@]
  merge_wave "Ola 2b — Template+JSON" "ola2-template-json"
  cleanup_worktrees "ola2-template-json"

  # ── A3: Research Dashboard ────────────────────────────────────────────────
  log "Fase 2c: A3 Research Dashboard"

  cat > "${PROMPT_DIR}/a3.md" << 'PROMPT_A3'
# Task: Create Research Dashboard (A3)

You are a Claude Code agent working on PD-Spec. Read CLAUDE.md first.

## Problem

The current STATUS.html is a flat list of insights and conflicts. It works but lacks:
- Navigation for large datasets (100+ insights)
- Modular layout (everything is in one long page)
- Research progress overview
- Source coverage visualization

## Solution: Research Dashboard

A modular, interactive dashboard that replaces STATUS.html. Built on the Template+JSON architecture from A2.

## Read First
- CLAUDE.md — architecture
- .claude/skills/status/SKILL.md — current /status skill
- 03_Outputs/_templates/ — the Template+JSON system created by A2
- 03_Outputs/_schemas/ — existing JSON schemas

## What to Create

### 1. Dashboard template: 03_Outputs/_templates/status.html

The dashboard should have this layout:

```
+--sidebar--+--------main content area-----------+
| [logo]     |                                     |
| Overview   | [Module: rendered based on JSON]    |
| Insights   |                                     |
| Conflicts  |                                     |
| Sources    |                                     |
| Gaps       |                                     |
| System Map |                                     |
| ------     |                                     |
| [Actions]  |                                     |
+------------+-------------------------------------+
```

**Sidebar:** Fixed left sidebar with navigation links to each module. Clicking a link shows that module in the main content area. Active module highlighted. Collapsible on mobile.

**Modules** (each is a self-contained component rendered from JSON):

1. **Overview** — Summary cards: total insights (by status), total conflicts (by status), source count, evidence gaps count. Progress bar showing research maturity.

2. **Insights** — Card layout (same as current STATUS.html). Sortable/filterable by: status (PENDING/VERIFIED/INVALIDATED), category (user-need/technical/business/constraint), temporal tag (current/aspirational). Approve/reject buttons for PENDING. Search box.

3. **Conflicts** — Card layout with Flag/Research/Context options for PENDING. Resolved conflicts shown with green border. Filter by status.

4. **Sources** — Source coverage map. Shows each source folder, file count, extraction status. Highlights source diversity gaps (which source types are present/missing).

5. **Evidence Gaps** — List of detected gaps with suggested actions. Grouped by type (claim-level, source diversity).

6. **System Map** — Module list with status badges, insight refs, design implications. Open questions list.

7. **Action Bar** — (bottom or floating) Prompt generator for /synthesis. Same functionality as current STATUS.html but with better UX.

**Design:**
- B/W minimal, same as current STATUS.html
- No decorative elements
- Color only for functional badges
- Responsive (works on laptop and desktop)
- Print-friendly (expand all, hide interactive)

### 2. Dashboard JSON schema: 03_Outputs/_schemas/status.schema.json

Define the JSON structure that the /status skill generates. Must include:
- overview stats
- insights array (with all fields: id, status, category, temporal, claim, quote, source, refs)
- conflicts array (with all fields: id, status, title, tension, sides with refs, resolution)
- sources array (folder, files, types, extraction status)
- gaps array (type, description, suggestion)
- system_map (vision, modules with implications, principles, open questions)
- action_bar config (what decisions have been made)

### 3. Update .claude/skills/status/SKILL.md

The /status skill should now:
1. Read Work layer (same as before)
2. Compute stats (same as before)
3. Generate JSON data object matching the dashboard schema
4. Read template from 03_Outputs/_templates/status.html
5. Inject JSON into the template
6. Write to 03_Outputs/STATUS.html

Remove all the inline HTML generation instructions. The skill now only produces JSON.

Keep:
- The interactive functionality spec (approve/reject, flag/research/context, prompt generator)
- The cross-referencing anchor hub behavior (STATUS.html#IG-XX)
- Card layout and badge styles (now in template CSS)
- All JS behavior specs (toggleInsight, showNote, generatePrompt, copyPrompt)

### 4. Template JS for the dashboard

The template needs JS to:
1. Read JSON from embedded script tag
2. Render each module as a section
3. Sidebar navigation (show/hide modules)
4. Insight card interactivity (approve/reject toggles)
5. Conflict card interactivity (radio options, textarea for context)
6. Search/filter for insights
7. Prompt generator (collect decisions, format as /synthesis prompt, copy to clipboard)
8. Cross-referencing anchors (auto-assign IDs from data-insight/data-conflict, auto-open details on hash navigation)
9. Decision counter (track how many decisions made, update badge)

## Constraints
- Single self-contained HTML output (all CSS/JS inline in final output)
- No external dependencies except Google Fonts (Inter)
- Must preserve backward compatibility: STATUS.html#IG-XX links from other outputs must still work
- Follow existing PD-Spec patterns
- Do NOT touch /ship, /analyze, /extract, /synthesis, /kickoff, /seed, /reset, /visualize

## When Done
Commit:
```
git add -A && git commit -m "feat(dashboard): A3 — Research Dashboard replaces flat STATUS.html

Modular dashboard with sidebar navigation, filterable insights,
source coverage map, evidence gaps, and system map overview.
Built on Template+JSON architecture. Prompt generator preserved.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_A3

  create_worktree "ola2-dashboard"
  launch_agent "$_WT_PATH" "ola2-dashboard" "${PROMPT_DIR}/a3.md"
  local pids_c=("$_AGENT_PID")
  local names_c=("ola2-dashboard")

  wait_for_agents names_c[@] pids_c[@]
  merge_wave "Ola 2c — Dashboard" "ola2-dashboard"
  cleanup_worktrees "ola2-dashboard"

  ok "OLA 2 COMPLETADA"
}

# ============================================================================
# OLA 3 — INTELIGENCIA
# ============================================================================
run_ola_3() {
  echo ""
  echo -e "${BLUE}================================================================${NC}"
  echo -e "${BLUE}  OLA 3 — INTELIGENCIA (3 paralelos + 2 dependientes)${NC}"
  echo -e "${BLUE}================================================================${NC}"
  echo ""

  # ── Fase 3a: I2 + I4 + I5 (independientes, paralelo) ─────────────────────
  log "Fase 3a: I2 + I4 + I5 en paralelo"

  local branches=()
  local agent_names=()
  local pids=()

  # I2: Source diversity (already partially in /analyze, enhance it)
  cat > "${PROMPT_DIR}/i2.md" << 'PROMPT_I2'
# Task: Enhance source diversity gap detection (I2)

Read CLAUDE.md and .claude/skills/analyze/SKILL.md first.

## Context

/analyze already has source diversity gap detection in step 8b (added in Ola 1). This task ENHANCES it with better reporting and actionable suggestions.

## What to Do

### 1. Update .claude/skills/analyze/SKILL.md

Enhance step 8b (Source diversity gaps) with:

**Better categorization:** When classifying sources, also consider:
- Temporal diversity: are all sources from the same time period? Old sources may be outdated.
- Perspective diversity: are all sources from the same stakeholder group? (all management, no operators)
- Methodology diversity: are all sources the same type? (all interviews, no quantitative data)

**Structured reporting:** The diversity report should include:
- A source matrix showing: [source type] x [present/missing] with file count
- A diversity score (simple: N of 6 source types present = N/6)
- Specific suggestions per missing type (what kind of source to add and why)

**Integration with insights:** Flag insights that rely on only one source type. These are more fragile than insights corroborated across source types.

### 2. Update the Phase 4 Report section

Add a "Source Diversity" subsection to the report output. Show the matrix and score.

## Constraints
- Only edit .claude/skills/analyze/SKILL.md
- Build on existing step 8b, don't replace it
- Keep changes minimal and focused

## When Done
```
git add -A && git commit -m "feat(intelligence): I2 — enhanced source diversity detection

Added temporal/perspective/methodology diversity checks, source matrix
reporting, diversity score, and fragility flags for single-source insights.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_I2

  create_worktree "ola3-source-diversity"
  branches+=("ola3-source-diversity")
  agent_names+=("ola3-source-diversity")
  launch_agent "$_WT_PATH" "ola3-source-diversity" "${PROMPT_DIR}/i2.md"
  pids+=("$_AGENT_PID")

  # I4: Convergence tracking
  cat > "${PROMPT_DIR}/i4.md" << 'PROMPT_I4'
# Task: Implement convergence tracking (I4)

Read CLAUDE.md and .claude/skills/analyze/SKILL.md first.

## What It Does

Track how many independent sources support each insight. "3 of 5 sources mention this" gives more weight than "1 source says this".

## What to Do

### 1. Update .claude/skills/analyze/SKILL.md

**In step 6 (Prepare new insights):** Add a convergence field to the insight format:
- After extracting a claim, check if similar claims appear in other source files
- Record: "Convergence: X/Y sources" where X = sources mentioning this claim, Y = total sources processed
- A claim from 1 source has convergence 1/Y. A claim echoed in 3 sources has 3/Y.

**In step 7 (Cross-reference):** When cross-referencing, if multiple new claims converge on the same point, note the convergence ratio. High convergence = stronger signal.

**In step 9 (Write insights):** Include convergence in the written format:
```
[IG-XX] (category, temporal) PENDING
Claim text here.
> "Key quote" — source-file.md
Convergence: 3/5 sources
Ref: source-folder/file.md
```

### 2. Update Phase 4 Report

Include convergence statistics:
- How many insights have convergence > 50%
- Which insights are single-source (fragile)
- Highlight high-convergence insights as strong signals

## Constraints
- Only edit .claude/skills/analyze/SKILL.md
- The convergence ratio is informational, not a status gate
- Keep it simple: count of sources mentioning similar claims, not statistical analysis

## When Done
```
git add -A && git commit -m "feat(intelligence): I4 — convergence tracking (X/Y sources ratio)

Each insight now tracks how many sources support it. High convergence
= stronger signal. Single-source insights flagged as fragile.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_I4

  create_worktree "ola3-convergence"
  branches+=("ola3-convergence")
  agent_names+=("ola3-convergence")
  launch_agent "$_WT_PATH" "ola3-convergence" "${PROMPT_DIR}/i4.md"
  pids+=("$_AGENT_PID")

  # I5: /extract progress indicator
  cat > "${PROMPT_DIR}/i5.md" << 'PROMPT_I5'
# Task: Add progress indicator to /extract (I5)

Read CLAUDE.md and .claude/skills/extract/SKILL.md first.

## What It Does

During extraction of large source sets, show progress to the user:
"01_Sources/entrevistas-operadores/ — 80% (4/5 files)"

## What to Do

### 1. Update .claude/skills/extract/SKILL.md

In Phase 2 (Read & Extract), add explicit progress reporting instructions:

**Before starting each subfolder:**
- Count total files in the subfolder
- Log: "Processing [folder-name]/ — 0% (0/N files)"

**After each file:**
- Log: "Processing [folder-name]/ — X% (M/N files)"
- Include the file name being processed

**After completing each subfolder:**
- Log: "Completed [folder-name]/ — 100% (N/N files) — X claims extracted"

**Overall progress:**
- At start: "Starting extraction: X folders, Y total files"
- At end: "Extraction complete: Y files processed, Z total claims extracted"

### 2. Add progress to MEMORY.md entry

The MEMORY.md entry should include extraction stats:
- Files processed per folder
- Claims extracted per folder
- Total processing summary

## Constraints
- Only edit .claude/skills/extract/SKILL.md
- Progress reporting is via text output to the user (not a progress bar)
- Keep it simple: folder-level progress, not file-level percentage

## When Done
```
git add -A && git commit -m "feat(intelligence): I5 — /extract progress indicator

Shows per-folder progress during extraction: folder — X% (M/N files).
Overall summary at start and end. Stats included in MEMORY.md entry.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_I5

  create_worktree "ola3-extract-progress"
  branches+=("ola3-extract-progress")
  agent_names+=("ola3-extract-progress")
  launch_agent "$_WT_PATH" "ola3-extract-progress" "${PROMPT_DIR}/i5.md"
  pids+=("$_AGENT_PID")

  wait_for_agents agent_names[@] pids[@]
  merge_wave "Ola 3a — Independientes" "${branches[@]}"
  cleanup_worktrees "${branches[@]}"

  # ── Fase 3b: I1 + I3 (paralelo entre si, dependen de Ola 2) ──────────────
  log "Fase 3b: I1 + I3 en paralelo"
  branches=()
  agent_names=()
  pids=()

  # I1: Auto Research Brief
  cat > "${PROMPT_DIR}/i1.md" << 'PROMPT_I1'
# Task: Auto Research Brief in /analyze (I1)

Read CLAUDE.md and .claude/skills/analyze/SKILL.md first.

## What It Does

After /analyze completes insight extraction, automatically generate a Research Brief: a short executive narrative (1-2 pages) that summarizes findings in plain language. This is for stakeholders who don't want to read a list of 100 insights.

## What to Do

### 1. Update .claude/skills/analyze/SKILL.md

Add a new Phase between current Phase 3 (Write) and Phase 4 (Report):

**Phase 3b: Research Brief**

After writing insights and conflicts, generate a Research Brief:

Structure:
1. "What's broken" — pain points and problems found (from user-need insights tagged as current)
2. "What could be better" — opportunities and aspirations (from aspirational insights)
3. "What works well" — strengths to preserve (from positive current-state insights)
4. "Key tensions" — unresolved conflicts that need stakeholder input (from PENDING conflicts)
5. "Evidence gaps" — what we don't know yet and how to fill it

Rules:
- Group by narrative themes, NOT by technical categories
- Write in output_language
- Reference [IG-XX] IDs inline but keep the text readable
- Maximum 500 words per section
- No jargon, no internal pipeline terminology
- Target audience: project stakeholders who haven't used PD-Spec

Output: Write to 02_Work/RESEARCH_BRIEF.md

Format:
```
# Research Brief
> Auto-generated by /analyze on YYYY-MM-DD
> Based on X insights from Y sources

## What's Broken
[narrative text with [IG-XX] refs]

## What Could Be Better
[narrative text]

## What Works Well
[narrative text]

## Key Tensions
[narrative text with [CF-XX] refs]

## Evidence Gaps
[list of gaps with suggestions]
```

### 2. Create 02_Work/RESEARCH_BRIEF.md template

Empty template following the format above, with placeholder comments.

### 3. Update CLAUDE.md

Add RESEARCH_BRIEF.md to Sources of Truth table.

## Constraints
- Only edit .claude/skills/analyze/SKILL.md and create the template
- The brief is generated automatically, no user approval needed
- The brief supplements the insight list, it does not replace it
- Do NOT touch /ship, /synthesis, /extract, /status

## When Done
```
git add -A && git commit -m "feat(intelligence): I1 — auto Research Brief in /analyze

After insight extraction, /analyze generates a stakeholder-friendly
narrative brief: what's broken, what could be better, what works,
key tensions, and evidence gaps. Written to 02_Work/RESEARCH_BRIEF.md.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_I1

  create_worktree "ola3-auto-brief"
  branches+=("ola3-auto-brief")
  agent_names+=("ola3-auto-brief")
  launch_agent "$_WT_PATH" "ola3-auto-brief" "${PROMPT_DIR}/i1.md"
  pids+=("$_AGENT_PID")

  # I3: Human calibration layer
  cat > "${PROMPT_DIR}/i3.md" << 'PROMPT_I3'
# Task: Human calibration layer (I3)

Read CLAUDE.md, .claude/skills/status/SKILL.md, and .claude/skills/analyze/SKILL.md first.

## What It Does

Gives the human researcher a low-friction way to inject professional intuition into the system. Currently, the only way to add context is to write a full markdown source file. Most researchers want to jot quick notes like "I think this is actually about X" or "The CEO seemed nervous when discussing Y".

## What to Do

### 1. Create 01_Sources/_FIELD_NOTES_TEMPLATE.md

A lightweight template for researcher notes:

```markdown
# Field Notes
> Quick observations, hunches, and professional intuition.
> These are treated as a source by /extract and /analyze.
> Date them and be honest about confidence level.

## Template

### [YYYY-MM-DD] [Topic]
**Confidence:** [high/medium/low/hunch]
**Context:** [What triggered this observation]

[Your note — can be 1 sentence or a paragraph]

---
```

### 2. Update .claude/skills/extract/SKILL.md

Add handling for field notes:
- Recognize _FIELD_NOTES.md files in 01_Sources/ subfolders
- Extract each dated entry as a separate claim
- Tag with the confidence level from the note
- Treat as a valid source (not higher or lower priority than other sources)

### 3. Update .claude/skills/analyze/SKILL.md

When processing field notes:
- Include confidence level in insight metadata: "Source confidence: [high/medium/low/hunch]"
- Low-confidence notes should be tagged but not treated as verified evidence
- Hunches can generate open questions in the system map rather than insights

### 4. Update .claude/skills/status/SKILL.md (or dashboard JSON schema)

Add an "Add context" mechanism to the dashboard:
- A simple textarea module where the user can type a quick note
- The note gets formatted as a field note entry
- The generated prompt includes a reminder to save the note to 01_Sources/

This is a prompt-based mechanism (the dashboard generates text for the user to paste), not a direct file-writing feature.

## Constraints
- Field notes are treated as sources — they go in 01_Sources/
- Low friction is key: the template should be as simple as possible
- Do NOT give field notes special priority over other sources
- Do NOT touch /ship, /synthesis, /kickoff, /seed, /reset, /visualize

## When Done
```
git add -A && git commit -m "feat(intelligence): I3 — human calibration layer (field notes)

Low-friction channel for researcher intuition. Field notes template
in 01_Sources/, confidence tagging, dashboard 'Add context' textarea.
Hunches generate open questions, not assertions.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_I3

  create_worktree "ola3-human-calibration"
  branches+=("ola3-human-calibration")
  agent_names+=("ola3-human-calibration")
  launch_agent "$_WT_PATH" "ola3-human-calibration" "${PROMPT_DIR}/i3.md"
  pids+=("$_AGENT_PID")

  wait_for_agents agent_names[@] pids[@]
  merge_wave "Ola 3b — Dependientes" "${branches[@]}"
  cleanup_worktrees "${branches[@]}"

  ok "OLA 3 COMPLETADA"
}

# ============================================================================
# OLA 4 — NUEVOS OUTPUTS
# ============================================================================
run_ola_4() {
  echo ""
  echo -e "${BLUE}================================================================${NC}"
  echo -e "${BLUE}  OLA 4 — NUEVOS OUTPUTS (5 paralelos + 1 secuencial)${NC}"
  echo -e "${BLUE}================================================================${NC}"
  echo ""

  # ── Fase 4a: O1 + O2 + O3 + O4 + O6 (paralelo) ──────────────────────────
  log "Fase 4a: O1 + O2 + O3 + O4 + O6 en paralelo"

  local branches=()
  local agent_names=()
  local pids=()

  # O1: benchmark-ux
  cat > "${PROMPT_DIR}/o1.md" << 'PROMPT_O1'
# Task: Create /ship benchmark-ux (O1)

Read CLAUDE.md, .claude/skills/ship/SKILL.md, and the Template+JSON architecture in 03_Outputs/_templates/ and 03_Outputs/_schemas/.

## What It Does

Generates a UX Benchmark document with inter-industry design referents. This is NOT a competitive analysis — it finds design patterns from OTHER industries that could inspire the project.

Example output: "Compound Finance's achromatic dashboard uses monochrome to reduce cognitive load in complex financial data — applicable to mining operations dashboards."

## What to Create

### 1. Update .claude/skills/ship/SKILL.md

Add benchmark-ux as a new output type in step 1:
- benchmark-ux — Inter-industry design referents. NOT competitive analysis.

Add a new step for benchmark-ux (after the presentation/report steps):

**For benchmark-ux** (/ship benchmark-ux):
- Output: 03_Outputs/BENCHMARK_UX.html (via Template+JSON)
- The agent uses web search to find real design referents (NEVER invent them)
- Structure per referent:
  - Name and industry (e.g., "Compound Finance — DeFi")
  - Screenshot or description of the relevant pattern
  - "Factor X" — what makes this referent relevant (1 sentence)
  - Applicable pattern — how this could apply to the current project
  - Linked Design Principle from SYSTEM_MAP [IG-XX]
- Group referents by design category (Data Visualization, Navigation, Onboarding, etc.)
- Include 8-15 referents total
- Anti-hallucination: every referent must be a real product the agent can verify via web search. If unsure, skip it.

### 2. Create JSON schema: 03_Outputs/_schemas/benchmark-ux.schema.json

```json
{
  "meta": { ... },
  "title": "...",
  "categories": [
    {
      "name": "Data Visualization",
      "referents": [
        {
          "name": "Compound Finance",
          "industry": "DeFi",
          "factor_x": "Achromatic dashboard reduces cognitive load",
          "pattern": "Use monochrome palette for operational data, color only for alerts",
          "design_principle": "Quiet UI",
          "refs": ["IG-42", "IG-67"]
        }
      ]
    }
  ]
}
```

### 3. Create template: 03_Outputs/_templates/benchmark-ux.html

Visual layout:
- Card grid grouped by category
- Each card shows: referent name, industry badge, Factor X, applicable pattern
- Design principle link at bottom of each card
- Uses _base.css for consistent styling

## Constraints
- Use the Template+JSON architecture from A2
- NEVER invent referents — use web search or skip
- This replaces the deprecated /ship benchmark
- Follow all existing /ship rules (emoji policy, traceability, doc-meta, etc.)

## When Done
```
git add -A && git commit -m "feat(output): O1 — /ship benchmark-ux (inter-industry design referents)

Replaces deprecated competitive benchmark. Generates real design
referents from other industries with Factor X and applicable patterns.
Anti-hallucination: all referents verified via web search.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_O1

  create_worktree "ola4-benchmark-ux"
  branches+=("ola4-benchmark-ux")
  agent_names+=("ola4-benchmark-ux")
  launch_agent "$_WT_PATH" "ola4-benchmark-ux" "${PROMPT_DIR}/o1.md"
  pids+=("$_AGENT_PID")

  # O2: persona
  cat > "${PROMPT_DIR}/o2.md" << 'PROMPT_O2'
# Task: Create /ship persona (O2)

Read CLAUDE.md, .claude/skills/ship/SKILL.md, and the Template+JSON architecture.

## What It Does

Generates user persona cards from verified insights. Each persona is an archetype grounded in real research data, not invented stereotypes.

## What to Create

### 1. Update .claude/skills/ship/SKILL.md

Add persona as output type. Add step:

**For persona** (/ship persona):
- Output: 03_Outputs/PERSONAS.html (via Template+JSON)
- Derive personas from user-need insights in INSIGHTS_GRAPH.md
- Each persona includes:
  - Name (realistic, not stereotypical)
  - Role/title
  - Representative quote (from a real source insight)
  - Goals (what they want to achieve) — linked to [IG-XX]
  - Frustrations (what blocks them) — linked to [IG-XX]
  - Context (work environment, tools, constraints) — linked to [IG-XX]
  - Behaviors (how they currently work) — linked to [IG-XX]
- Generate 3-5 personas (enough to cover the insight space, not so many they overlap)
- Each persona must be grounded in at least 3 verified insights
- If insufficient user-need insights exist, use [GAP] markers

### 2. Create JSON schema: 03_Outputs/_schemas/persona.schema.json

### 3. Create template: 03_Outputs/_templates/persona.html

Visual layout: persona cards in a grid. Each card is a self-contained profile.

## Constraints
- Use Template+JSON architecture
- Personas must trace to [IG-XX] — no invented characteristics
- Follow all /ship rules

## When Done
```
git add -A && git commit -m "feat(output): O2 — /ship persona (user archetypes from insights)

Generates 3-5 user personas grounded in verified user-need insights.
Each persona traces to [IG-XX] refs for goals, frustrations, context.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_O2

  create_worktree "ola4-persona"
  branches+=("ola4-persona")
  agent_names+=("ola4-persona")
  launch_agent "$_WT_PATH" "ola4-persona" "${PROMPT_DIR}/o2.md"
  pids+=("$_AGENT_PID")

  # O3: journey-map
  cat > "${PROMPT_DIR}/o3.md" << 'PROMPT_O3'
# Task: Create /ship journey-map (O3)

Read CLAUDE.md, .claude/skills/ship/SKILL.md, and the Template+JSON architecture.

## What It Does

Generates a user journey map showing the flow from awareness to goal completion, with pain points and touchpoints at each stage.

## What to Create

### 1. Update .claude/skills/ship/SKILL.md

Add journey-map as output type. Add step:

**For journey-map** (/ship journey-map):
- Output: 03_Outputs/JOURNEY_MAP.html (via Template+JSON)
- Derive journey from user-need and constraint insights
- Structure: phases (columns) x layers (rows)
  - Phases: e.g., Awareness, Onboarding, Daily Use, Advanced Use, Support
  - Layers per phase: User Actions, Touchpoints, Emotions, Pain Points, Opportunities
- Each cell references [IG-XX] insights
- Highlight critical pain points and moments of delight
- If personas exist (from /ship persona), link journey to primary persona

### 2. Create JSON schema: 03_Outputs/_schemas/journey-map.schema.json

### 3. Create template: 03_Outputs/_templates/journey-map.html

Visual layout: horizontal timeline/grid with phases as columns and layers as rows. Color-coded emotions (red for frustration, green for satisfaction). Responsive.

## Constraints
- Use Template+JSON architecture
- Every cell traces to [IG-XX] or uses [GAP] marker
- Follow all /ship rules

## When Done
```
git add -A && git commit -m "feat(output): O3 — /ship journey-map (user flow with pain points)

Generates journey map with phases, touchpoints, emotions, and
pain points. Each element traces to verified insights.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_O3

  create_worktree "ola4-journey"
  branches+=("ola4-journey")
  agent_names+=("ola4-journey")
  launch_agent "$_WT_PATH" "ola4-journey" "${PROMPT_DIR}/o3.md"
  pids+=("$_AGENT_PID")

  # O4: lean-canvas
  cat > "${PROMPT_DIR}/o4.md" << 'PROMPT_O4'
# Task: Create /ship lean-canvas (O4)

Read CLAUDE.md, .claude/skills/ship/SKILL.md, and the Template+JSON architecture.

## What It Does

Generates a Lean Canvas (business model on one page) from business and constraint insights.

## What to Create

### 1. Update .claude/skills/ship/SKILL.md

Add lean-canvas as output type. Add step:

**For lean-canvas** (/ship lean-canvas):
- Output: 03_Outputs/LEAN_CANVAS.html (via Template+JSON)
- Derive canvas from business and constraint insights in INSIGHTS_GRAPH.md
- Standard 9-block Lean Canvas:
  1. Problem (top 3 problems) — from user-need insights
  2. Solution (top 3 features) — from system map modules
  3. Key Metrics — from business insights
  4. Unique Value Proposition — from business + user-need insights
  5. Unfair Advantage — from technical/business insights
  6. Channels — from business insights or [GAP]
  7. Customer Segments — from user-need insights (link to personas if available)
  8. Cost Structure — from business/constraint insights or [GAP]
  9. Revenue Streams — from business insights or [GAP]
- Each block references [IG-XX] or uses [GAP] marker
- One-page format optimized for print

### 2. Create JSON schema and template

Layout: classic Lean Canvas grid (2 rows, variable columns). Each cell shows content + insight refs.

## Constraints
- Use Template+JSON architecture
- Follow all /ship rules
- Keep it to one page (printable)

## When Done
```
git add -A && git commit -m "feat(output): O4 — /ship lean-canvas (business model synthesis)

Generates Lean Canvas from business/constraint insights. 9-block
layout with traceability to [IG-XX] refs. One-page printable format.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_O4

  create_worktree "ola4-lean-canvas"
  branches+=("ola4-lean-canvas")
  agent_names+=("ola4-lean-canvas")
  launch_agent "$_WT_PATH" "ola4-lean-canvas" "${PROMPT_DIR}/o4.md"
  pids+=("$_AGENT_PID")

  # O6: /audit
  cat > "${PROMPT_DIR}/o6.md" << 'PROMPT_O6'
# Task: Create /audit quality gate (O6)

Read CLAUDE.md and all skill files to understand the pipeline.

## What It Does

Evaluates the quality of the Work layer BEFORE generating outputs. Acts as a quality gate: "Is the knowledge base ready for /ship?"

## What to Create

### 1. Create .claude/skills/audit/SKILL.md

New skill (not a /ship type — it's a standalone skill like /status):

Frontmatter:
```yaml
---
name: audit
description: Quality gate — evaluates Work layer readiness before /ship. Checks traceability, completeness, and consistency.
user-invocable: true
allowed-tools: Read, Grep, Glob
argument-hint: ""
---
```

The skill should:

Phase 0: Session Resume (standard)

Phase 1: Load Work Layer
- Read INSIGHTS_GRAPH.md, CONFLICTS.md, SYSTEM_MAP.md, EXTRACTIONS.md

Phase 2: Quality Checks
Run these checks and score each:

1. **Traceability completeness** — Every system map module has [IG-XX] refs? Every design implication has a ref? Score: % of entries with refs.

2. **Insight coverage** — Are all insight categories represented (user-need, technical, business, constraint)? Is the balance reasonable? Score: diversity index.

3. **Conflict resolution** — How many conflicts are still PENDING? Score: % resolved.

4. **Source backing** — What % of insights have convergence > 1 source? Score: avg convergence.

5. **Evidence gaps** — How many known gaps exist? Are they documented? Score: inverse of gap count.

6. **System map completeness** — Does the vision exist? Are modules defined? Are design principles named? Are open questions tracked? Score: checklist completion.

7. **Temporal balance** — Mix of current vs aspirational insights? Score: ratio balance.

Phase 3: Report
- Present a quality scorecard with all checks
- Overall readiness: Ready / Needs Work / Not Ready
- For each failing check, suggest specific action (e.g., "Run /analyze on more user research sources")
- Do NOT write to any files — this is read-only
- Do NOT write to MEMORY.md (like /status, this is a snapshot)

### 2. Update CLAUDE.md

Add /audit to the Skills Pipeline table.
Add audit/SKILL.md to the Folder Structure.

## Constraints
- /audit is READ-ONLY — it never modifies Work or Output files
- It's a diagnostic tool, not a gate that blocks execution
- The user decides whether to proceed with /ship despite warnings
- Do NOT touch any other skill files

## When Done
```
git add -A && git commit -m "feat(output): O6 — /audit quality gate skill

Read-only diagnostic that evaluates Work layer readiness before /ship.
Checks traceability, coverage, conflicts, source backing, gaps,
completeness, and temporal balance. Produces scorecard with actions.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_O6

  create_worktree "ola4-audit"
  branches+=("ola4-audit")
  agent_names+=("ola4-audit")
  launch_agent "$_WT_PATH" "ola4-audit" "${PROMPT_DIR}/o6.md"
  pids+=("$_AGENT_PID")

  wait_for_agents agent_names[@] pids[@]
  merge_wave "Ola 4a — Outputs independientes" "${branches[@]}"
  cleanup_worktrees "${branches[@]}"

  # ── Fase 4b: O5 (depende de O2) ──────────────────────────────────────────
  log "Fase 4b: O5 user-stories (post-O2)"

  branches=()
  agent_names=()
  pids=()

  cat > "${PROMPT_DIR}/o5.md" << 'PROMPT_O5'
# Task: Create /ship user-stories (O5)

Read CLAUDE.md, .claude/skills/ship/SKILL.md, the Template+JSON architecture, and the persona output type (O2) that was just added.

## What It Does

Generates JTBD-framed user stories with acceptance criteria. This is the bridge between PD-Spec (strategy) and PD-Build (execution).

## What to Create

### 1. Update .claude/skills/ship/SKILL.md

Add user-stories as output type. Add step:

**For user-stories** (/ship user-stories):
- Output: 03_Outputs/USER_STORIES.html (via Template+JSON)
- Derive stories from:
  - Personas (from /ship persona output, if available)
  - User-need insights in INSIGHTS_GRAPH.md
  - Modules and design implications in SYSTEM_MAP.md
- JTBD format: "When [situation], I want to [motivation], so I can [outcome]"
- Each story includes:
  - Story ID (US-XX)
  - Persona reference (which persona this story serves)
  - JTBD statement
  - Acceptance criteria (derived from SYSTEM_MAP design implications)
  - Priority (High/Medium/Low based on insight convergence and business weight)
  - Insight refs [IG-XX]
- Group by module or user flow
- If personas don't exist yet, derive user context directly from insights
- Include a traceability matrix: Story -> Insights -> Sources

### 2. Create JSON schema and template

Layout: story cards grouped by module. Each card expandable to show acceptance criteria and refs.

## Constraints
- Use Template+JSON architecture
- Stories must trace to [IG-XX]
- Acceptance criteria must trace to SYSTEM_MAP entries
- This is PD-Spec's output, not PD-Build's input (no implementation details)
- Follow all /ship rules

## When Done
```
git add -A && git commit -m "feat(output): O5 — /ship user-stories (JTBD bridge to PD-Build)

Generates JTBD-framed user stories with acceptance criteria from
SYSTEM_MAP. Links to personas and traces to verified insights.
Traceability matrix: Story -> Insights -> Sources.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
PROMPT_O5

  create_worktree "ola4-user-stories"
  branches+=("ola4-user-stories")
  agent_names+=("ola4-user-stories")
  launch_agent "$_WT_PATH" "ola4-user-stories" "${PROMPT_DIR}/o5.md"
  pids+=("$_AGENT_PID")

  wait_for_agents agent_names[@] pids[@]
  merge_wave "Ola 4b — User Stories" "${branches[@]}"
  cleanup_worktrees "${branches[@]}"

  ok "OLA 4 COMPLETADA"
}

# ============================================================================
# MAIN
# ============================================================================

echo ""
echo -e "${BLUE}+---------------------------------------------------------------+${NC}"
echo -e "${BLUE}|  PD-Spec Sprint Orchestrator v2                               |${NC}"
echo -e "${BLUE}|  Olas 2-4 (Ola 1 completada 2026-02-14)                       |${NC}"
echo -e "${BLUE}|  Worktree Strategy — Parallel Agents                          |${NC}"
echo -e "${BLUE}+---------------------------------------------------------------+${NC}"
echo ""

if [ "$ONLY_OLA" -eq 0 ]; then
  log "Ejecutando Olas 2, 3, y 4 secuencialmente"
  run_ola_2
  run_ola_3
  run_ola_4
else
  case $ONLY_OLA in
    2) run_ola_2 ;;
    3) run_ola_3 ;;
    4) run_ola_4 ;;
    *) err "Ola $ONLY_OLA no existe (2-4)"; exit 1 ;;
  esac
fi

echo ""
echo -e "${GREEN}+---------------------------------------------------------------+${NC}"
echo -e "${GREEN}|  SPRINT COMPLETADO                                            |${NC}"
echo -e "${GREEN}|  Logs: ${LOG_DIR}${NC}"
echo -e "${GREEN}+---------------------------------------------------------------+${NC}"
echo ""
