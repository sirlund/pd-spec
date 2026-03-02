#!/bin/bash
# next-id.sh — Print the next available ID for a given entity type
# Usage: ./scripts/next-id.sh [ig|synth|cf|dp] [file_path]
#
# Examples:
#   ./scripts/next-id.sh ig 02_Work/INSIGHTS_GRAPH.md        → IG-04
#   ./scripts/next-id.sh synth 02_Work/INSIGHTS_GRAPH.md     → IG-SYNTH-04
#   ./scripts/next-id.sh cf 02_Work/CONFLICTS.md             → CF-04
#   ./scripts/next-id.sh dp 02_Work/PROPOSALS.md             → DP-04
#
# Detects zero-padding convention from existing IDs:
#   If IDs are IG-01, IG-02 → next is IG-03 (2-digit padding)
#   If IDs are IG-001 → next is IG-002 (3-digit padding)
#   If no IDs exist → starts at 01

set -euo pipefail

TYPE="${1:-}"
FILE="${2:-}"

if [ -z "$TYPE" ] || [ -z "$FILE" ]; then
  echo "Usage: ./scripts/next-id.sh [ig|synth|cf|dp] <file_path>"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "ERROR: File not found: $FILE"
  exit 2
fi

# Set prefix and regex based on type
case "$TYPE" in
  ig)
    PREFIX="IG-"
    # Match IG-XX but NOT IG-SYNTH-XX
    PATTERN='\[IG-([0-9]+)\]'
    ;;
  synth)
    PREFIX="IG-SYNTH-"
    PATTERN='\[IG-SYNTH-([0-9]+)\]'
    ;;
  cf)
    PREFIX="CF-"
    PATTERN='\[CF-([0-9]+)\]'
    ;;
  dp)
    PREFIX="DP-"
    PATTERN='\[DP-([0-9]+)\]'
    ;;
  *)
    echo "ERROR: Unknown type '$TYPE'. Use: ig, synth, cf, dp"
    exit 1
    ;;
esac

# Extract all numeric IDs and find the max
NUMBERS=$(grep -oE "$PATTERN" "$FILE" 2>/dev/null | sed -E "s/\[${PREFIX}0*([0-9]+)\]/\1/" | sort -n || true)

if [ -z "$NUMBERS" ]; then
  # No existing IDs — start at 01
  echo "${PREFIX}01"
  exit 0
fi

# Find max number
MAX=$(echo "$NUMBERS" | tail -1)

# Detect padding width from the first ID found in the file
FIRST_RAW=$(grep -oE "$PATTERN" "$FILE" | head -1 | sed -E "s/\[${PREFIX}//;s/\]//")
PAD_WIDTH=${#FIRST_RAW}

# Next ID
NEXT=$((MAX + 1))

# Apply padding
printf "%s%0${PAD_WIDTH}d\n" "$PREFIX" "$NEXT"
