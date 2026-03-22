#!/bin/bash
# resolve-conflict.sh — Change a conflict's status to RESOLVED in CONFLICTS.md
# Usage: ./scripts/resolve-conflict.sh <conflict_id> <file_path> [--resolution "text"]
#
# Examples:
#   ./scripts/resolve-conflict.sh CF-03 02_Work/CONFLICTS.md --resolution "Prioritize speed per user majority"
#   ./scripts/resolve-conflict.sh CF-03 02_Work/CONFLICTS.md
#
# Changes "Status: PENDING..." to "Status: RESOLVED" for the given conflict.
# Optionally appends a "Resolution:" line after the status.

set -euo pipefail

CONFLICT_ID="${1:-}"
FILE="${2:-}"
RESOLUTION=""

# Parse optional --resolution flag
shift 2 2>/dev/null || true
while [ $# -gt 0 ]; do
  case "$1" in
    --resolution)
      RESOLUTION="${2:-}"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ -z "$CONFLICT_ID" ] || [ -z "$FILE" ]; then
  echo "Usage: ./scripts/resolve-conflict.sh <conflict_id> <file_path> [--resolution \"text\"]"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "ERROR: File not found: $FILE"
  exit 2
fi

# Verify the conflict exists
if ! grep -q "### \[$CONFLICT_ID\]" "$FILE"; then
  echo "ERROR: $CONFLICT_ID not found in $FILE"
  exit 2
fi

# Extract the block for this conflict (from its heading to next heading or ---  or EOF)
# Use awk with a flag to avoid the range-closes-on-first-line problem
CURRENT_STATUS=$(awk -v id="$CONFLICT_ID" '
  /^### \[/ { if (found) exit; if (index($0, "[" id "]") > 0) found=1 }
  found && /^-? ?Status:/ { sub(/^-? ?Status: */, ""); print; exit }
' "$FILE")

if [ -z "$CURRENT_STATUS" ]; then
  echo "ERROR: Could not read status for $CONFLICT_ID"
  exit 1
fi

# Check if already resolved
case "$CURRENT_STATUS" in
  RESOLVED*)
    echo "$CONFLICT_ID is already RESOLVED"
    exit 0
    ;;
esac

# Check if PENDING (may have suffix like "PENDING — Flagged (...)")
case "$CURRENT_STATUS" in
  PENDING*)
    ;;
  *)
    echo "WARNING: $CONFLICT_ID has status '$CURRENT_STATUS' (expected PENDING). Proceeding anyway."
    ;;
esac

# Replace status using awk (more reliable than sed for multi-line context)
TMPFILE=$(mktemp)
awk -v id="$CONFLICT_ID" -v resolution="$RESOLUTION" '
  /^### \[/ {
    if (in_target && !did_replace) {
      # Edge case: reached next heading without finding Status line
    }
    in_target = (index($0, "[" id "]") > 0)
    did_replace = 0
  }
  in_target && /^-? ?Status: *PENDING/ && !did_replace {
    # Preserve dash prefix if present
    prefix = ""
    if (substr($0, 1, 1) == "-") prefix = "- "
    print prefix "Status: RESOLVED"
    if (resolution != "") {
      print prefix "Resolution: " resolution
    }
    did_replace = 1
    next
  }
  { print }
' "$FILE" > "$TMPFILE"

mv "$TMPFILE" "$FILE"

echo "OK: $CONFLICT_ID → RESOLVED"
