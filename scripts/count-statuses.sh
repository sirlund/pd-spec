#!/bin/bash
# count-statuses.sh — Count entities by status in a Work layer file
# Usage: ./scripts/count-statuses.sh <file_path>
#
# Reads "Status: XXXX" lines and counts by status value.
# Works for INSIGHTS_GRAPH.md (PENDING, VERIFIED, FROZEN, DISCARDED, MERGED, SUPERSEDED)
# and CONFLICTS.md (PENDING, RESOLVED).
#
# Output format:
#   VERIFIED: 12
#   PENDING: 3
#   FROZEN: 1
#   ---
#   Total: 16

set -euo pipefail

FILE="${1:-}"

if [ -z "$FILE" ]; then
  echo "Usage: ./scripts/count-statuses.sh <file_path>"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "ERROR: File not found: $FILE"
  exit 2
fi

# Extract all Status: values, count per status, sort by count descending
STATUSES=$(grep -E '^Status: *[A-Z]+' "$FILE" | sed 's/^Status: *\([A-Z]*\).*/\1/' | sort)

if [ -z "$STATUSES" ]; then
  echo "No status entries found in $FILE"
  exit 0
fi

TOTAL=$(echo "$STATUSES" | wc -l | tr -d ' ')

# Count per status — bash 3 compatible (no associative arrays)
echo "$STATUSES" | uniq -c | sort -rn | while read -r count status; do
  echo "$status: $count"
done

echo "---"
echo "Total: $TOTAL"
