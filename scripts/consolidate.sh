#!/bin/bash
# consolidate.sh — Phase 3: Merge worker outputs, update SOURCE_MAP, cleanup
# BL-115: Replace Phase 3 Sonnet call with deterministic bash (0 tokens)
#
# Usage: bash scripts/consolidate.sh <project-root>
#
# Reads:   02_Work/_temp/extract_queue.json
#          02_Work/_temp/tasks/*.md  (worker outputs)
#          02_Work/_temp/tasks/*.error (worker errors)
# Writes:  02_Work/EXTRACTIONS.md (append)
#          02_Work/SOURCE_MAP.md (update rows, 1 awk pass per file)
# Runs:    scripts/generate-index.sh if EXTRACTIONS.md > 20KB
# Appends: 02_Work/MEMORY.md
# Stdout:  summary line for SSE
#
# Exit 0: success
# Exit 1: generic error
# Exit 2: queue not found or invalid JSON

set -euo pipefail

PROJECT="${1:-}"
if [ -z "$PROJECT" ]; then
  echo "ERROR: Missing project root argument" >&2
  exit 1
fi

cd "$PROJECT" || { echo "ERROR: Cannot cd to $PROJECT" >&2; exit 1; }

QUEUE="02_Work/_temp/extract_queue.json"
TASKS="02_Work/_temp/tasks"
EXTRACTIONS="02_Work/EXTRACTIONS.md"
SOURCE_MAP="02_Work/SOURCE_MAP.md"
TEMP="02_Work/_temp"
TIMESTAMP=$(date '+%Y-%m-%dT%H:%M')

# --- Validate queue ---
if [ ! -f "$QUEUE" ]; then
  echo "ERROR: extract_queue.json not found" >&2
  exit 2
fi

python3 -c "
import json, sys
try:
    d = json.load(open('$QUEUE'))
    if not isinstance(d.get('files', []), list):
        print('ERROR: files is not a list', file=sys.stderr)
        sys.exit(1)
except Exception as e:
    print(f'ERROR: Invalid JSON: {e}', file=sys.stderr)
    sys.exit(1)
" || { echo "ERROR: Invalid extract_queue.json" >&2; exit 2; }

# --- Sanitize function (must match claude.js workers exactly) ---
sanitize() {
  printf '%s' "$1" | sed 's|[/\\]|_|g; s|[^a-zA-Z0-9._-]|_|g'
}

# --- Ensure EXTRACTIONS.md exists with header ---
if [ ! -f "$EXTRACTIONS" ]; then
  printf '# Extractions\n\n> Raw claims extracted from source files. Feed into `/analyze`.\n\n' > "$EXTRACTIONS"
fi

# --- Ensure SOURCE_MAP.md exists with header ---
if [ ! -f "$SOURCE_MAP" ]; then
  printf '# Source Map\n\n> Tracks processing state for all source files.\n\n| File | Format | Status | Claims | Hash | Last Processed |\n|---|---|---|---|---|---|\n' > "$SOURCE_MAP"
fi

total_files=0
total_claims=0
total_errors=0

# --- Phase 3a: Merge task files + Phase 3b: Update SOURCE_MAP (inline per file) ---
queue_lines=$(python3 -c "
import json, sys
d = json.load(open('$QUEUE'))
for f in d.get('files', []):
    sp = f.get('source_path', '')
    h = f.get('hash', '')
    if sp:
        print(sp + '|' + h)
") || { echo "ERROR: Failed to parse queue" >&2; exit 2; }

while IFS='|' read -r source_path file_hash; do
  [ -z "$source_path" ] && continue

  sanitized=$(sanitize "$source_path")
  task_md="$TASKS/${sanitized}.md"
  task_err="$TASKS/${sanitized}.error"

  # Get format from extension
  fmt=$(printf '%s' "$source_path" | sed 's/.*\.//' | tr '[:upper:]' '[:lower:]')

  # File column in SOURCE_MAP = source_path without "01_Sources/" prefix
  file_col="${source_path#01_Sources/}"

  if [ -f "$task_md" ]; then
    # Append task content to EXTRACTIONS.md
    printf '\n' >> "$EXTRACTIONS"
    cat "$task_md" >> "$EXTRACTIONS"

    # Count claims (lines starting with N. )
    claims=0
    c=$(grep -cE '^[0-9]+\.' "$task_md" 2>/dev/null) && claims="$c" || true
    claims=$(printf '%s' "$claims" | tr -d '[:space:]')

    status="processed"
    total_claims=$((total_claims + claims))
  else
    claims=0
    status="error"
    total_errors=$((total_errors + 1))
  fi

  total_files=$((total_files + 1))

  # Update SOURCE_MAP: replace existing row or append new one
  new_row="| ${file_col} | ${fmt} | ${status} | ${claims} | ${file_hash} | ${TIMESTAMP} |"

  if grep -qF "| ${file_col} |" "$SOURCE_MAP" 2>/dev/null; then
    # Replace existing row using 1-pass awk
    awk -F'|' -v fc="$file_col" -v nr="$new_row" '
      /^\|/ {
        col2 = $2
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", col2)
        if (col2 == fc) { print nr; next }
      }
      { print }
    ' "$SOURCE_MAP" > "${SOURCE_MAP}.tmp" && mv "${SOURCE_MAP}.tmp" "$SOURCE_MAP"
  else
    printf '%s\n' "$new_row" >> "$SOURCE_MAP"
  fi

done <<< "$queue_lines"

# --- Phase 3c: Cleanup _temp/ (preserve checkpoint, normalized, preprocessed) ---
find "$TEMP" -maxdepth 1 -type f \
  ! -name 'SESSION_CHECKPOINT.md' \
  ! -name '*_normalized.md' \
  ! -name '*.pdf.md' \
  ! -name '*.docx.md' \
  ! -name '*.pptx.md' \
  ! -name '*.xlsx.md' \
  -delete 2>/dev/null || true

rm -rf "$TASKS" 2>/dev/null || true

# --- Phase 3d: Generate indexes if EXTRACTIONS.md > 20KB ---
if [ -f "$EXTRACTIONS" ] && [ -f "scripts/generate-index.sh" ]; then
  ext_size=$(wc -c < "$EXTRACTIONS" | tr -d ' ')
  if [ "$ext_size" -gt 20480 ]; then
    bash "scripts/generate-index.sh" extractions "$EXTRACTIONS" 2>/dev/null || true
  fi
fi

# --- Phase 3e: Append to MEMORY.md ---
MEMORY="02_Work/MEMORY.md"
if [ -f "$MEMORY" ]; then
  mem_lines=$(wc -l < "$MEMORY" | tr -d ' ')
  if [ "$mem_lines" -lt 80 ]; then
    printf '\n## [%s] /extract\n' "$TIMESTAMP" >> "$MEMORY"
    printf -- '- **Request:** express mode, %d files\n' "$total_files" >> "$MEMORY"
    printf -- '- **Actions:** Phase 1 coordinator, Phase 2 Haiku workers, Phase 3 consolidate.sh\n' >> "$MEMORY"
    printf -- '- **Result:** %d files processed, %d claims extracted (%d errors)\n' "$total_files" "$total_claims" "$total_errors" >> "$MEMORY"
    printf -- '- **Snapshot:** %d source files · %d claims extracted\n' "$total_files" "$total_claims" >> "$MEMORY"
  fi
fi

# --- Summary stdout (captured by claude.js and sent as SSE) ---
summary="✓ Consolidation complete: ${total_files} files · ${total_claims} claims extracted"
if [ "$total_errors" -gt 0 ]; then
  summary="${summary} (${total_errors} errors)"
fi
echo "$summary"
