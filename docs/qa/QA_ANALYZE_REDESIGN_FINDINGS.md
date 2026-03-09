# QA Findings — /analyze Redesign + Pipeline Validation

**Date:** 2026-03-08 / 2026-03-09
**Branch:** main (post-v4.29.0)
**Scope:** /analyze skill redesign + /spec QA on pd-spec--qa worktree (6 sources, ~300 claims)
**Cost baseline:** $29.21 (API key PD-Spec, Mar 1)

---

## Summary

| Skill | Status | Cost | Notes |
|---|---|---|---|
| /extract (full, 6 files) | ✅ PASS | ~$1.18 | Parallel Haiku workers |
| /extract --file (HEIC fix) | ✅ PASS | $0.40 | OBS-extract-file-01: Sonnet instead of Haiku |
| /analyze --full | ✅ PASS | ~$0.54 | Redesigned skill, 30 insights |
| /analyze incremental | ✅ PASS | $0.62 | 1 new section, 6 insights added → 36 total |
| /spec | ✅ PASS | $0.65 | 8 proposals, 1 conflict resolved, 6 VERIFIED |

**Total pipeline cost (QA dataset):** ~$3.39

---

## OBS Fixed During QA

| ID | Priority | Description | Status |
|---|---|---|---|
| OBS-analyze-01 | P1 | output_language ignored — insights in English despite `output_language: es` | ✅ FIXED |
| OBS-analyze-02 | P2 | design-framework insights had no explicit tier rule | ✅ FIXED |
| OBS-analyze-03 | P1 | Over-consolidation — 239 claims → 9 insights (too aggressive) | ✅ FIXED |
| OBS-analyze-04 | P2 | ANALYSIS.md header showed wrong insight count | ✅ FIXED |
| OBS-extract-image-01 | P2 | HEIC/PNG workers generated meta-descriptions in English instead of actual content | ✅ FIXED |
| OBS-analyze-ui-01 | P2 | "Research Brief" nav item pointed to non-existent RESEARCH_BRIEF.md | ✅ FIXED → renamed "Analysis", points to ANALYSIS.md (b08e02b) |

---

## OBS Open

| ID | Priority | Description | Fix Location |
|---|---|---|---|
| OBS-extract-file-01 | P2 | `--file` mode runs full Sonnet (~$0.40) instead of Haiku worker (~$0.07) | BL-124 scope or standalone |
| OBS-extract-dedup-01 | P2 | `--file` re-extraction creates duplicate section — path prefix mismatch (`01_Sources/...` vs relative) | consolidate.sh or extract SKILL.md (BL-126) |
| OBS-spec-ui-01 | P2 | /spec has too many approval gates with insufficient context — user approves "blind" | /spec SKILL.md — make autonomous by default (remove AskUserQuestion) |
| OBS-spec-ui-02 | P2 | Markdown renders as plain text in agent chat log AND Q&A panel (bold, headers as literal characters) | app/client — apply md-content rendering to both agent log text entries and Q&A response panel |
| OBS-spec-ui-03 | P2 | Q&A reads engine MEMORY.md and responds with internal engine context (BL-XXX, OBS-XXX) — irrelevant to end users | Q&A system prompt should be scoped to project knowledge only, not engine state |
| OBS-ship-ui-01 | P1 | /ship AskUserQuestion gate has no buttons — run terminates, "ok" typed after falls into Q&A instead of answering the gate | Root fix: unified agent+chat panel (BL-127). Short-term: make /ship autonomous by default |
| OBS-ship-ui-02 | P1 | Agent log and Q&A are two separate panels — skill output and chat are disconnected. User "ok" response went to Q&A after /ship run ended | BL-127: unify into single conversational thread where skills run inline |
| OBS-BL113-01 | P1 | Preventive checkpoint not written before first context compaction | claude.js |
| OBS-BL114-01 | P2 | Worker logs in UI show no filename | BL-120 |
| OBS-BL114-02 | P2 | Parallel activation threshold uses only file count, not size_kb | claude.js |

---

## Backlog Items Created This Session

| ID | Priority | Description |
|---|---|---|
| BL-124 | P3 | Parallel /analyze — Haiku Workers for Synthesis |
| BL-125 | P3 | Persist HEIC→JPG conversion as sidecar artifact |
| BL-126 | P2 | Fix /extract --file dedup — path normalization on re-extraction |
| BL-127 | P1 | Unified Agent+Chat panel — single conversational thread where skills run inline and user can respond to gates naturally |

---

## /analyze Redesign Metrics

| Metric | Before (v4.28) | After (v4.29) |
|---|---|---|
| SKILL.md lines | 527 | 248 (-53%) |
| Cost per full run | ~$0.99 | ~$0.54 (-45%) |
| Cost incremental | N/A | ~$0.62 (1 section) |
| Insight consistency | Variable (OBS-07: 9 vs 30) | Stable (granularity rules) |
| Output | INSIGHTS_GRAPH only | INSIGHTS_GRAPH + ANALYSIS.md |
| Gates / AskUserQuestion | Multiple | 0 (autonomous) |
| Language compliance | Broken | Fixed |

---

## Notes

- **OBS-07 (inconsistency)** was the original motivation for redesign. Fixed via deterministic tier rules + explicit granularity guidelines (separate by default, consolidate only when same observation from different sources).
- **HEIC extraction fix** validated: 15 claims in Spanish vs 5 meta-descriptions in English before fix.
- **PROJECT.md counts** not updated by /spec — still shows "Insights count: 0". Low priority cosmetic issue.
