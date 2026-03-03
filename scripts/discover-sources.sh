#!/bin/zsh
# discover-sources.sh — Single-call delta detection for /extract
# Replaces ~20 list_files + read_file agent calls with one script invocation.
#
# Usage: ./scripts/discover-sources.sh <sources_dir> <source_map_file>
# Example: ./scripts/discover-sources.sh 01_Sources 02_Work/SOURCE_MAP.md
#
# Exit codes: 0=success, 1=usage error, 2=sources dir not found

set -euo pipefail

# --- Args ---
if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <sources_dir> <source_map_file>"
  echo "Example: $0 01_Sources 02_Work/SOURCE_MAP.md"
  exit 1
fi

SOURCES_DIR="$1"
SOURCE_MAP="$2"

if [[ ! -d "$SOURCES_DIR" ]]; then
  echo "ERROR: Sources directory not found: $SOURCES_DIR"
  exit 2
fi

# --- Exclusions ---
EXCLUDE_NAMES=("_SOURCE_TEMPLATE.md" "_CONTEXT_TEMPLATE.md" "_FIELD_NOTES_TEMPLATE.md" "_CONTEXT.md" "_README.md" ".gitkeep")

is_excluded() {
  local name="${1:t}"  # zsh :t = basename
  for ex in "${EXCLUDE_NAMES[@]}"; do
    [[ "$name" == "$ex" ]] && return 0
  done
  return 1
}

# Normalize Unicode whitespace (U+00A0, U+202F, U+2007, etc.) to ASCII space.
# macOS filenames often contain narrow no-break spaces that differ from SOURCE_MAP entries.
normalize_path() {
  printf '%s' "$1" | sed $'s/\xc2\xa0/ /g; s/\xe2\x80\xaf/ /g; s/\xe2\x80\x87/ /g'
}

compute_md5() {
  if command -v md5 &>/dev/null; then
    md5 -q "$1"
  else
    md5sum "$1" | cut -d' ' -f1
  fi
}

human_size() {
  local bytes=$1
  if (( bytes >= 1048576 )); then
    printf "%.1fMB" $(( bytes / 1048576.0 ))
  elif (( bytes >= 1024 )); then
    printf "%.0fKB" $(( bytes / 1024.0 ))
  else
    printf "%dB" "$bytes"
  fi
}

# --- 1. Find all source files ---
# Keys are normalized (ASCII spaces), originals stored for file operations.
typeset -a all_files         # normalized paths
typeset -A original_path     # normalized → original (for fs access)
while IFS= read -r -d '' fpath; do
  _rel="${fpath#$SOURCES_DIR/}"
  is_excluded "$fpath" && continue
  _norm=$(normalize_path "$_rel")
  all_files+=("$_norm")
  original_path[$_norm]="$_rel"
done < <(find "$SOURCES_DIR" -type f -print0 | sort -z)

# --- 2. Parse SOURCE_MAP.md ---
typeset -A known_hash known_fstatus

if [[ -f "$SOURCE_MAP" ]]; then
  while IFS= read -r line; do
    # Skip non-table lines, header, and separator
    [[ "$line" != \|* ]] && continue
    [[ "$line" == *"---"* ]] && continue
    [[ "$line" == *"File"*"Format"*"Status"* ]] && continue

    # Parse: | File | Format | Status | Claims | Hash | Last Processed |
    _fp=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $2); print $2}')
    _st=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $4); print $4}')
    _ha=$(echo "$line" | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $6); print $6}')

    [[ -z "$_fp" ]] && continue

    _fp=$(normalize_path "$_fp")
    known_hash[$_fp]="$_ha"
    known_fstatus[$_fp]="$_st"
  done < "$SOURCE_MAP"
fi

# --- 3. Compute current MD5 hashes ---
typeset -A current_hash

for f in "${all_files[@]}"; do
  current_hash[$f]=$(compute_md5 "$SOURCES_DIR/${original_path[$f]}")
done

# --- 4. Classify ---
typeset -a new_files modified_files unchanged_files retry_files pending_heavy_files
typeset -A new_details modified_details retry_details

for f in "${all_files[@]}"; do
  _full="$SOURCES_DIR/${original_path[$f]}"
  _ext="${f:e}"  # zsh :e = extension
  _size=$(stat -f%z "$_full" 2>/dev/null || stat -c%s "$_full" 2>/dev/null || echo 0)
  _hsize=$(human_size "$_size")
  _lines=$(wc -l < "$_full" 2>/dev/null || echo 0)
  _detail="$f  $_ext  $_hsize  ${_lines}L"

  if [[ -z "${known_hash[$f]:-}" ]]; then
    new_files+=("$f")
    new_details[$f]="$_detail"
  elif [[ "${known_fstatus[$f]}" == error* ]] || [[ "${known_fstatus[$f]}" == missing* ]]; then
    retry_files+=("$f")
    retry_details[$f]="$_detail"
  elif [[ "${known_fstatus[$f]}" == pending-heavy* ]]; then
    pending_heavy_files+=("$f")
  elif [[ "${current_hash[$f]}" == "${known_hash[$f]}" ]]; then
    unchanged_files+=("$f")
  else
    modified_files+=("$f")
    modified_details[$f]="$_detail"
  fi
done

# --- 5. Detect deletions ---
typeset -a deleted_files
typeset -A deleted_hash

for kf in "${(@k)known_hash}"; do
  if [[ -z "${current_hash[$kf]:-}" ]]; then
    deleted_files+=("$kf")
    deleted_hash[$kf]="${known_hash[$kf]}"
  fi
done

# --- 6. Detect moves (only if ≤20 deletions) ---
typeset -a moved_files  # "old_path → new_path"

if (( ${#deleted_files[@]} > 0 && ${#deleted_files[@]} <= 20 )); then
  typeset -a resolved_new resolved_del
  for nf in "${new_files[@]}"; do
    for df in "${deleted_files[@]}"; do
      (( ${resolved_del[(Ie)$df]} )) && continue
      if [[ "${current_hash[$nf]}" == "${deleted_hash[$df]}" ]]; then
        moved_files+=("$df → $nf")
        resolved_new+=("$nf")
        resolved_del+=("$df")
        break
      fi
    done
  done

  # Remove resolved from new and deleted
  for r in "${resolved_new[@]}"; do
    new_files=("${(@)new_files:#$r}")
    unset "new_details[$r]"
  done
  for r in "${resolved_del[@]}"; do
    deleted_files=("${(@)deleted_files:#$r}")
  done
fi

# --- 7. Output ---
n_new=${#new_files[@]}
n_mod=${#modified_files[@]}
n_mov=${#moved_files[@]}
n_unc=${#unchanged_files[@]}
n_ret=${#retry_files[@]}
n_ph=${#pending_heavy_files[@]}
n_del=${#deleted_files[@]}
n_proc=$(( n_new + n_mod + n_ret ))

echo "=== DISCOVER SOURCES ==="
echo "NEW: $n_new"
echo "MODIFIED: $n_mod"
echo "MOVED: $n_mov"
echo "UNCHANGED: $n_unc"
echo "RETRY: $n_ret"
echo "PENDING_HEAVY: $n_ph"
echo "DELETED: $n_del"
echo "TOTAL_TO_PROCESS: $n_proc"
echo "---"

echo "NEW:"
if (( n_new > 0 )); then
  for f in "${new_files[@]}"; do
    echo "  ${new_details[$f]}  ${current_hash[$f]}"
  done
else
  echo "  (none)"
fi

echo "MODIFIED:"
if (( n_mod > 0 )); then
  for f in "${modified_files[@]}"; do
    echo "  ${modified_details[$f]}  ${current_hash[$f]}"
  done
else
  echo "  (none)"
fi

echo "MOVED:"
if (( n_mov > 0 )); then
  for m in "${moved_files[@]}"; do
    echo "  $m"
  done
else
  echo "  (none)"
fi

echo "DELETED:"
if (( n_del > 0 )); then
  for f in "${deleted_files[@]}"; do
    echo "  $f"
  done
else
  echo "  (none)"
fi

echo "RETRY:"
if (( n_ret > 0 )); then
  for f in "${retry_files[@]}"; do
    echo "  ${retry_details[$f]}  ${current_hash[$f]}"
  done
else
  echo "  (none)"
fi

# --- 8. Normalize oversized-line files for SDK Read compatibility ---
# Non-fatal: errors here must not kill the script. Agent falls back to original.
WORK_TEMP="02_Work/_temp"
mkdir -p "$WORK_TEMP" 2>/dev/null || true
typeset -a normalized_files
typeset -A normalized_paths  # source_relative → temp_path

normalize_oversized() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  # Uses python3 instead of awk — macOS awk (BWK) crashes on lines >~30K chars
  python3 -c "
import re, sys
with open(sys.argv[1], 'r') as f:
    for line in f:
        line = line.rstrip('\n')
        if len(line) <= 1000:
            print(line)
            continue
        while len(line) > 1000:
            chunk = line[:1000]
            m = re.search(r'.*[.!?] ', chunk)
            if m:
                print(line[:m.end()])
                line = line[m.end():]
            else:
                m2 = re.search(r'.* ', line[:800])
                if m2:
                    print(line[:m2.end()])
                    line = line[m2.end():]
                else:
                    print(line[:800])
                    line = line[800:]
        if line:
            print(line)
" "$src" > "$dst" 2>/dev/null
}

for f in "${new_files[@]}" "${modified_files[@]}" "${retry_files[@]}"; do
  _full="$SOURCES_DIR/${original_path[$f]}"
  _ext="${f:e:l}"

  # Only normalize text files
  [[ "$_ext" == "md" || "$_ext" == "txt" || "$_ext" == "csv" ]] || continue

  # Check if ANY line exceeds 2000 chars (SDK Read truncation limit)
  _has_long=$(awk 'length($0) > 2000 {found=1; exit} END{print found+0}' "$_full")
  (( _has_long == 0 )) && continue

  # Clean up previous normalized version (stale from prior run)
  _outpath="${WORK_TEMP}/${f}_normalized.md"
  rm -f "$_outpath"

  if normalize_oversized "$_full" "$_outpath"; then
    # Verify byte count — normalized should be ≥90% of original (no content loss)
    _orig_bytes=$(wc -c < "$_full")
    _norm_bytes=$(wc -c < "$_outpath")
    if (( _norm_bytes < _orig_bytes * 90 / 100 )); then
      # Significant data loss — discard and warn
      rm -f "$_outpath"
    else
      normalized_files+=("$f")
      normalized_paths[$f]="$_outpath"
    fi
  else
    rm -f "$_outpath"
    # Non-fatal: agent will read original (step 5b byte-range fallback)
  fi
done

echo "NORMALIZED: ${#normalized_files[@]}"
if (( ${#normalized_files[@]} > 0 )); then
  for f in "${normalized_files[@]}"; do
    echo "  $f → ${normalized_paths[$f]}"
  done
else
  echo "  (none)"
fi
