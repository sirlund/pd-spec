#!/bin/bash
# verify-insight.sh — Change insight status with cascade protection
# Usage: ./scripts/verify-insight.sh <action> <insight_id> <file_path> [options]
#
# Actions:
#   --verify          PENDING → VERIFIED
#   --invalidate      PENDING|VERIFIED → INVALIDATED (requires --reason)
#   --merge           PENDING → MERGED (requires --target IG-XX)
#   --freeze          VERIFIED → FROZEN
#   --unfreeze        FROZEN → VERIFIED
#   --supersede       VERIFIED → SUPERSEDED (requires --target IG-XX)
#
# Options:
#   --reason "text"   Required for --invalidate
#   --target IG-XX    Required for --merge and --supersede (the absorbing insight)
#   --project PATH    Project root for cascade calculation (default: dirname of file/..)
#   --force           Skip cascade confirmation prompt
#
# Cascade protection:
#   Before FREEZE or INVALIDATE, greps [IG-XX] across STRATEGIC_VISION, PROPOSALS, and Outputs.
#   LOW (≤2 refs): proceeds silently
#   MEDIUM (3-5 refs): shows orphaned refs, asks for confirmation
#   HIGH (5+ refs): shows full tree, requires explicit confirmation
#
# Exit codes: 0=success, 1=error, 2=file not found, 3=user cancelled

set -euo pipefail

# --- Parse arguments ---
ACTION=""
INSIGHT_ID=""
FILE=""
REASON=""
TARGET=""
PROJECT=""
FORCE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --verify|--invalidate|--merge|--freeze|--unfreeze|--supersede)
      ACTION="${1#--}"
      shift
      ;;
    --reason)
      REASON="${2:-}"
      shift 2
      ;;
    --target)
      TARGET="${2:-}"
      shift 2
      ;;
    --project)
      PROJECT="${2:-}"
      shift 2
      ;;
    --force)
      FORCE=1
      shift
      ;;
    -*)
      echo "Unknown option: $1"
      exit 1
      ;;
    *)
      if [ -z "$INSIGHT_ID" ]; then
        INSIGHT_ID="$1"
      elif [ -z "$FILE" ]; then
        FILE="$1"
      fi
      shift
      ;;
  esac
done

# --- Validate inputs ---
if [ -z "$ACTION" ] || [ -z "$INSIGHT_ID" ] || [ -z "$FILE" ]; then
  echo "Usage: ./scripts/verify-insight.sh <action> <insight_id> <file_path> [options]"
  echo ""
  echo "Actions: --verify, --invalidate, --merge, --freeze, --unfreeze, --supersede"
  echo "Options: --reason \"text\", --target IG-XX, --project PATH, --force"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "ERROR: File not found: $FILE"
  exit 2
fi

# Derive project root
if [ -z "$PROJECT" ]; then
  FILE_DIR=$(dirname "$FILE")
  PROJECT=$(cd "$FILE_DIR/.." 2>/dev/null && pwd)
fi

# Verify insight exists
if ! grep -q "### \[$INSIGHT_ID\]" "$FILE"; then
  echo "ERROR: $INSIGHT_ID not found in $FILE"
  exit 2
fi

# Get current status
CURRENT_STATUS=$(awk -v id="$INSIGHT_ID" '
  /^### \[/ && index($0, "[" id "]") > 0 { found=1; next }
  found && /^### \[/ { exit }
  found { print }
' "$FILE" | grep -m1 '^Status:' | sed 's/^Status: *//')

# --- Validate transition ---
validate_transition() {
  local from="$1"
  local to="$2"

  case "$to" in
    VERIFIED)
      if [ "$from" != "PENDING" ] && [ "$from" != "FROZEN" ]; then
        echo "ERROR: Cannot transition $INSIGHT_ID from $from to VERIFIED (allowed: PENDING, FROZEN)"
        exit 1
      fi
      ;;
    INVALIDATED)
      if [ "$from" != "PENDING" ] && [ "$from" != "VERIFIED" ]; then
        echo "ERROR: Cannot transition $INSIGHT_ID from $from to INVALIDATED (allowed: PENDING, VERIFIED)"
        exit 1
      fi
      if [ -z "$REASON" ]; then
        echo "ERROR: --reason is required for --invalidate"
        exit 1
      fi
      ;;
    MERGED)
      if [ "$from" != "PENDING" ]; then
        echo "ERROR: Cannot transition $INSIGHT_ID from $from to MERGED (allowed: PENDING)"
        exit 1
      fi
      if [ -z "$TARGET" ]; then
        echo "ERROR: --target is required for --merge"
        exit 1
      fi
      ;;
    FROZEN)
      if [ "$from" != "VERIFIED" ]; then
        echo "ERROR: Cannot transition $INSIGHT_ID from $from to FROZEN (allowed: VERIFIED)"
        exit 1
      fi
      ;;
    SUPERSEDED)
      if [ "$from" != "VERIFIED" ]; then
        echo "ERROR: Cannot transition $INSIGHT_ID from $from to SUPERSEDED (allowed: VERIFIED)"
        exit 1
      fi
      if [ -z "$TARGET" ]; then
        echo "ERROR: --target is required for --supersede"
        exit 1
      fi
      ;;
  esac
}

# Map action to target status
case "$ACTION" in
  verify)    NEW_STATUS="VERIFIED" ;;
  invalidate) NEW_STATUS="INVALIDATED" ;;
  merge)     NEW_STATUS="MERGED" ;;
  freeze)    NEW_STATUS="FROZEN" ;;
  unfreeze)  NEW_STATUS="VERIFIED" ;;
  supersede) NEW_STATUS="SUPERSEDED" ;;
  *)
    echo "ERROR: Unknown action '$ACTION'"
    exit 1
    ;;
esac

validate_transition "$CURRENT_STATUS" "$NEW_STATUS"

# --- Cascade protection (for FREEZE, INVALIDATE, SUPERSEDE) ---
cascade_check() {
  local id="$1"
  local ref_count=0
  local ref_files=""

  # Check STRATEGIC_VISION.md
  SV="$PROJECT/02_Work/STRATEGIC_VISION.md"
  if [ -f "$SV" ]; then
    local c
    c=$(grep -c "\[$id\]" "$SV" 2>/dev/null || echo 0)
    if [ "$c" -gt 0 ]; then
      ref_count=$((ref_count + c))
      ref_files="$ref_files  STRATEGIC_VISION.md: $c refs\n"
    fi
  fi

  # Check PROPOSALS.md
  PP="$PROJECT/02_Work/PROPOSALS.md"
  if [ -f "$PP" ]; then
    local c
    c=$(grep -c "\[$id\]" "$PP" 2>/dev/null || echo 0)
    if [ "$c" -gt 0 ]; then
      ref_count=$((ref_count + c))
      ref_files="$ref_files  PROPOSALS.md: $c refs\n"
    fi
  fi

  # Check 03_Outputs/
  OUTPUTS="$PROJECT/03_Outputs"
  if [ -d "$OUTPUTS" ]; then
    for f in "$OUTPUTS"/*.md "$OUTPUTS"/*.html; do
      [ -f "$f" ] || continue
      local c
      c=$(grep -c "\[$id\]" "$f" 2>/dev/null || echo 0)
      if [ "$c" -gt 0 ]; then
        ref_count=$((ref_count + c))
        ref_files="$ref_files  $(basename "$f"): $c refs\n"
      fi
    done
  fi

  echo "$ref_count"
  if [ "$ref_count" -gt 0 ]; then
    printf "References to [$id]:\n"
    printf "$ref_files"
  fi
}

needs_cascade() {
  [ "$ACTION" = "freeze" ] || [ "$ACTION" = "invalidate" ] || [ "$ACTION" = "supersede" ]
}

if needs_cascade; then
  CASCADE_OUTPUT=$(cascade_check "$INSIGHT_ID")
  REF_COUNT=$(echo "$CASCADE_OUTPUT" | head -1)

  if [ "$REF_COUNT" -gt 0 ]; then
    echo "$CASCADE_OUTPUT" | tail -n +2
    echo ""

    if [ "$REF_COUNT" -le 2 ]; then
      echo "Impact: LOW ($REF_COUNT refs) — proceeding"
    elif [ "$REF_COUNT" -le 5 ]; then
      echo "Impact: MEDIUM ($REF_COUNT refs) — these references will become orphaned"
      if [ "$FORCE" -eq 0 ]; then
        printf "Continue? [y/N] "
        read -r answer
        if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
          echo "Cancelled"
          exit 3
        fi
      fi
    else
      echo "Impact: HIGH ($REF_COUNT refs) — significant orphan cascade"
      if [ "$FORCE" -eq 0 ]; then
        printf "Type '$INSIGHT_ID' to confirm: "
        read -r answer
        if [ "$answer" != "$INSIGHT_ID" ]; then
          echo "Cancelled"
          exit 3
        fi
      fi
    fi
  fi
fi

# --- Apply status change ---
# Build the new status line
STATUS_LINE="Status: $NEW_STATUS"
if [ "$ACTION" = "merge" ] || [ "$ACTION" = "supersede" ]; then
  STATUS_LINE="Status: $NEW_STATUS → [$TARGET]"
fi
if [ "$ACTION" = "invalidate" ] && [ -n "$REASON" ]; then
  STATUS_LINE="Status: $NEW_STATUS — $REASON"
fi

# Replace the Status: line within the insight's section
# Use awk for precise section targeting (bash 3 compatible)
TMPFILE=$(mktemp)
awk -v id="$INSIGHT_ID" -v new_status="$STATUS_LINE" '
  /^### \[/ { in_target = (index($0, "[" id "]") > 0) }
  in_target && /^Status: / {
    print new_status
    in_target = 0
    next
  }
  { print }
' "$FILE" > "$TMPFILE"

mv "$TMPFILE" "$FILE"

# Add Last-updated field if not present, or update it
TODAY=$(date +%Y-%m-%d)
TMPFILE=$(mktemp)
awk -v id="$INSIGHT_ID" -v today="$TODAY" '
  /^### \[/ { in_target = (index($0, "[" id "]") > 0); found_lu = 0 }
  in_target && /^Last-updated: / {
    print "Last-updated: " today
    found_lu = 1
    next
  }
  in_target && /^$/ && !found_lu {
    print "Last-updated: " today
    found_lu = 1
    print
    next
  }
  { print }
' "$FILE" > "$TMPFILE"

mv "$TMPFILE" "$FILE"

echo "OK: $INSIGHT_ID $CURRENT_STATUS → $NEW_STATUS"
