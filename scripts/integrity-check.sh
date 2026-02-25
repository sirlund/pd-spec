#!/bin/bash
# integrity-check.sh — Detect orphan insights (source refs without matching extractions)
# Usage: ./scripts/integrity-check.sh [project_path]
# Exit: 0 = clean, 1 = orphans found, 2 = missing files
#
# Level 1 check: verifies that each insight's Ref: paths have a matching
# ## [path] section in EXTRACTIONS.md. Does NOT check claim-level or
# semantic matching (future work).

set -euo pipefail

PROJECT="${1:-.}"
INSIGHTS="$PROJECT/02_Work/INSIGHTS_GRAPH.md"
EXTRACTIONS="$PROJECT/02_Work/EXTRACTIONS.md"

# --- Validate files exist ---
if [[ ! -f "$INSIGHTS" ]]; then
  echo "ERROR: INSIGHTS_GRAPH.md not found at $INSIGHTS"
  exit 2
fi
if [[ ! -f "$EXTRACTIONS" ]]; then
  echo "ERROR: EXTRACTIONS.md not found at $EXTRACTIONS"
  exit 2
fi

# --- Build list of extracted source paths from EXTRACTIONS.md ---
# Format: ## [folder/file.md] → strip "## [" and "]"
SOURCES_LIST=$(mktemp)
grep -E '^\#\# \[' "$EXTRACTIONS" | sed 's/^## \[//;s/\].*//' > "$SOURCES_LIST"
extracted_count=$(wc -l < "$SOURCES_LIST" | tr -d ' ')
echo "Extracted sources found: $extracted_count"
echo ""

# --- Parse insights and check refs ---
orphan_count=0
missing_ref_count=0
insight_count=0

# Table header
printf "%-20s %-12s %-15s %s\n" "IG-ID" "Status" "Refs" "Missing"
printf "%-20s %-12s %-15s %s\n" "----" "------" "----" "-------"

current_ig=""
current_status=""
has_ref=0

flush_insight() {
  if [[ -z "$current_ig" ]]; then return; fi
  if [[ $has_ref -eq 0 ]]; then
    printf "%-20s %-12s %-15s %s\n" "$current_ig" "$current_status" "0/0" "no Ref: line"
  fi
}

while IFS= read -r line; do
  # Detect insight header: ### [IG-XX]
  if echo "$line" | grep -qE '^### \[(IG-[A-Za-z0-9-]+)\]'; then
    flush_insight
    current_ig=$(echo "$line" | sed 's/^### \[\(IG-[A-Za-z0-9-]*\)\].*/\1/')
    current_status="PENDING"
    has_ref=0
    insight_count=$((insight_count + 1))
    continue
  fi

  # Detect status
  if [[ -n "$current_ig" ]] && echo "$line" | grep -qE '^Status: *[A-Z]+'; then
    current_status=$(echo "$line" | sed 's/^Status: *\([A-Z]*\).*/\1/')
    continue
  fi

  # Detect Ref: line
  if [[ -n "$current_ig" ]] && echo "$line" | grep -qE '^Ref: '; then
    has_ref=1
    refs_text=$(echo "$line" | sed 's/^Ref: *//')

    valid=0
    total=0
    missing_list=""

    # Split on ", " — use newlines for safe iteration
    echo "$refs_text" | tr ',' '\n' | while IFS= read -r ref; do
      ref=$(echo "$ref" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
      [[ -z "$ref" ]] && continue
      total=$((total + 1))

      if grep -qxF "$ref" "$SOURCES_LIST"; then
        valid=$((valid + 1))
      else
        missing_list="$missing_list$ref; "
        missing_ref_count=$((missing_ref_count + 1))
      fi
    done

    # The subshell above loses variable changes. Re-do with a temp approach.
    valid=0
    total=0
    missing_list=""

    OLD_IFS="$IFS"
    IFS=','
    for ref in $refs_text; do
      ref=$(echo "$ref" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
      [[ -z "$ref" ]] && continue
      total=$((total + 1))

      if grep -qxF "$ref" "$SOURCES_LIST"; then
        valid=$((valid + 1))
      else
        missing_list="$missing_list$ref; "
        missing_ref_count=$((missing_ref_count + 1))
      fi
    done
    IFS="$OLD_IFS"

    if [[ $valid -eq $total ]]; then
      printf "%-20s %-12s %-15s %s\n" "$current_ig" "$current_status" "$valid/$total" "—"
    else
      printf "%-20s %-12s %-15s %s\n" "$current_ig" "$current_status" "$valid/$total" "$missing_list"
      orphan_count=$((orphan_count + 1))
    fi

    current_ig=""
    continue
  fi
done < "$INSIGHTS"

# Flush last insight if it had no Ref: line
flush_insight

rm -f "$SOURCES_LIST"

echo ""
echo "Summary: $insight_count insights checked, $orphan_count orphans found ($missing_ref_count missing refs total)"

if [[ $orphan_count -gt 0 ]]; then
  exit 1
else
  exit 0
fi
