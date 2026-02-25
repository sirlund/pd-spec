#!/bin/bash
# validate-fixes.sh — Mechanical verification for v4.24.0 fixes
PASS=0; FAIL=0
check() {
  if "$@" >/dev/null 2>&1; then
    echo "✓ $DESC"
    PASS=$((PASS + 1))
  else
    echo "✗ $DESC"
    FAIL=$((FAIL + 1))
  fi
}

DESC="INTERNAL/AI-SOURCE gate in spec SKILL.md"
check grep -q 'Authority gate' .claude/skills/spec/SKILL.md

DESC="Safety gate in extract SKILL.md"
check grep -q 'Safety gate' .claude/skills/extract/SKILL.md

DESC="Self-audit section in CLAUDE.md"
check grep -q 'Proposal Self-Audit' CLAUDE.md

DESC="isSessionHeader in insights.js"
check grep -q 'isSessionHeader' app/server/parsers/insights.js

DESC="integrity-check.sh exists and is executable"
check test -x scripts/integrity-check.sh

DESC="Version consistency (PROJECT.md vs CHANGELOG.md)"
proj_v=$(grep 'engine_version:' PROJECT.md | sed 's/.*: *//' | sed 's/\*//g' | tr -d ' ')
cl_v=$(grep -m1 '^## ' docs/CHANGELOG.md | sed 's/^## \[/v/' | sed 's/\].*//')
check test "$proj_v" = "$cl_v"

echo ""
echo "Result: $PASS passed, $FAIL failed"
exit $FAIL
