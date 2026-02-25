#!/bin/bash
# validate-fixes.sh — Mechanical verification for v4.25.0 fixes
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

# --- v4.24.0 checks (kept for regression) ---

DESC="Authority gate in spec SKILL.md"
check grep -q 'Authority gate' .claude/skills/spec/SKILL.md

DESC="Safety gate in extract SKILL.md"
check grep -q 'Safety gate' .claude/skills/extract/SKILL.md

DESC="Self-audit section in CLAUDE.md"
check grep -q 'Proposal Self-Audit' CLAUDE.md

DESC="isSessionHeader in insights.js"
check grep -q 'isSessionHeader' app/server/parsers/insights.js

DESC="integrity-check.sh exists and is executable"
check test -x scripts/integrity-check.sh

# --- v4.25.0 checks ---

DESC="/spec skill exists (renamed from /resolve)"
check test -f .claude/skills/spec/SKILL.md

DESC="/resolve skill directory removed"
check test ! -d .claude/skills/resolve

DESC="Strategic Vision parser exists"
check test -f app/server/parsers/strategic-vision.js

DESC="Proposals parser exists"
check test -f app/server/parsers/proposals.js

DESC="StrategicVisionView component exists"
check test -f app/client/components/StrategicVisionView.jsx

DESC="ProposalsView component exists"
check test -f app/client/components/ProposalsView.jsx

DESC="next-id.sh exists and is executable"
check test -x scripts/next-id.sh

DESC="count-statuses.sh exists and is executable"
check test -x scripts/count-statuses.sh

DESC="verify-insight.sh exists and is executable"
check test -x scripts/verify-insight.sh

DESC="resolve-conflict.sh exists and is executable"
check test -x scripts/resolve-conflict.sh

DESC="reset.sh exists and is executable"
check test -x scripts/reset.sh

DESC="Insight Lifecycle section in CLAUDE.md"
check grep -q '## Insight Lifecycle' CLAUDE.md

DESC="Last-updated parsing in insights.js"
check grep -q 'last_updated' app/server/parsers/insights.js

DESC="FROZEN status in Badge.jsx"
check grep -q 'FROZEN' app/client/components/ui/Badge.jsx

DESC="SUPERSEDED status in Badge.jsx"
check grep -q 'SUPERSEDED' app/client/components/ui/Badge.jsx

DESC="Freshness function in InsightCard.jsx"
check grep -q 'getFreshness' app/client/components/InsightCard.jsx

DESC="pushState in app.jsx"
check grep -q 'pushState' app/client/app.jsx

DESC="Recursive folder tree in FileBrowser.jsx"
check grep -q 'renderFolderTree' app/client/components/FileBrowser.jsx

DESC="Legacy templates removed (only .gitkeep remains)"
check test ! -f 03_Outputs/_templates/prd.html

DESC="Legacy schemas removed (only .gitkeep remains)"
check test ! -f 03_Outputs/_schemas/prd.schema.json

DESC="No SYSTEM_MAP references in active skills"
check bash -c '! grep -rl "SYSTEM_MAP" .claude/skills/ 2>/dev/null | grep -v ".git"'

DESC="No /resolve skill references in CLAUDE.md"
check bash -c '! grep -q "\`/resolve\`" CLAUDE.md'

DESC="Version consistency (PROJECT.md vs CHANGELOG.md)"
proj_v=$(grep 'engine_version:' PROJECT.md | sed 's/.*: *//' | sed 's/\*//g' | tr -d ' ')
cl_v=$(grep -m1 '^## ' docs/CHANGELOG.md | sed 's/^## \[/v/' | sed 's/\].*//')
check test "$proj_v" = "$cl_v"

echo ""
echo "Result: $PASS passed, $FAIL failed"
exit $FAIL
