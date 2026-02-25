#!/bin/bash
# resolve-conflict.sh — Change a conflict's status to RESOLVED in CONFLICTS.md
# Usage: ./scripts/resolve-conflict.sh <conflict_id> <file_path> [--resolution "text"]
#
# Examples:
#   ./scripts/resolve-conflict.sh CF-03 02_Work/CONFLICTS.md --resolution "Prioritize speed per user majority"
#   ./scripts/resolve-conflict.sh CF-03 02_Work/CONFLICTS.md
#
# Changes "Status: PENDING" to "Status: RESOLVED" for the given conflict.
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

# Check current status
CURRENT_STATUS=$(awk "/^### \[$CONFLICT_ID\]/,/^### \[/" "$FILE" | grep -m1 '^Status:' | sed 's/^Status: *//')

if [ "$CURRENT_STATUS" = "RESOLVED" ]; then
  echo "$CONFLICT_ID is already RESOLVED"
  exit 0
fi

if [ "$CURRENT_STATUS" != "PENDING" ]; then
  echo "WARNING: $CONFLICT_ID has status '$CURRENT_STATUS' (expected PENDING). Proceeding anyway."
fi

# Replace status
if [ -n "$RESOLUTION" ]; then
  # Replace Status: PENDING with Status: RESOLVED + add Resolution: line
  sed -i '' "/^### \[$CONFLICT_ID\]/,/^### \[/{
    s/^Status: *PENDING/Status: RESOLVED/
    /^Status: RESOLVED/a\\
Resolution: $RESOLUTION
  }" "$FILE"
else
  sed -i '' "/^### \[$CONFLICT_ID\]/,/^### \[/{
    s/^Status: *PENDING/Status: RESOLVED/
  }" "$FILE"
fi

echo "OK: $CONFLICT_ID → RESOLVED"
