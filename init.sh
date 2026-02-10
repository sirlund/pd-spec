#!/usr/bin/env bash
set -euo pipefail

# ProductLM — Interactive Project Setup
# This script replaces all {{PLACEHOLDER}} tokens in template files,
# commits the result, and then removes itself.

echo ""
echo "========================================="
echo "  ProductLM — Project Setup"
echo "========================================="
echo ""

# Collect inputs
read -rp "Project name (e.g. Trivia MDP): " PROJECT_NAME
read -rp "Client name (e.g. John Smith): " CLIENT_NAME
read -rp "Consultant name (e.g. Jane Doe): " CONSULTANT_NAME
read -rp "Project objective (1 sentence): " PROJECT_OBJECTIVE

# Auto-calculate date values
DATE=$(date +"%B %Y")
YEAR=$(date +"%Y")

echo ""
echo "--- Review ---"
echo "  Project:    $PROJECT_NAME"
echo "  Client:     $CLIENT_NAME"
echo "  Consultant: $CONSULTANT_NAME"
echo "  Objective:  $PROJECT_OBJECTIVE"
echo "  Date:       $DATE"
echo "  Year:       $YEAR"
echo ""
read -rp "Proceed? (y/N): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Aborted."
    exit 1
fi

# Detect sed -i syntax (macOS vs Linux)
if [[ "$(uname)" == "Darwin" ]]; then
    SED_INPLACE=(sed -i '')
else
    SED_INPLACE=(sed -i)
fi

# Find all target files
FILES=$(find . -type f \( -name "*.md" -o -name "*.html" -o -name "Makefile" -o -name "LICENSE" \) ! -path "./.git/*")

echo ""
echo "Replacing placeholders..."

for f in $FILES; do
    "${SED_INPLACE[@]}" "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" "$f"
    "${SED_INPLACE[@]}" "s|{{CLIENT_NAME}}|${CLIENT_NAME}|g" "$f"
    "${SED_INPLACE[@]}" "s|{{CONSULTANT_NAME}}|${CONSULTANT_NAME}|g" "$f"
    "${SED_INPLACE[@]}" "s|{{PROJECT_OBJECTIVE}}|${PROJECT_OBJECTIVE}|g" "$f"
    "${SED_INPLACE[@]}" "s|{{DATE}}|${DATE}|g" "$f"
    "${SED_INPLACE[@]}" "s|{{YEAR}}|${YEAR}|g" "$f"
done

echo "Done. All placeholders replaced."

# Self-destruct
rm -- "$0"
echo "init.sh removed."

# Commit
echo ""
echo "Creating initial commit..."
git add -A
git commit -m "init: ${PROJECT_NAME} — project scaffolded from ProductLM template"

echo ""
echo "========================================="
echo "  Setup complete!"
echo "  Start by editing 01_Sources/00_initial_brief.md"
echo "========================================="
echo ""
