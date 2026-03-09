# Project Status — Post SDK Migration

**Date:** 2026-03-03
**Engine version:** v4.28.1
**Context:** Assessment after BL-80 Phase 1 (SDK Migration) shipped in v4.27.0. Informed by QA Wave 2.1, onboarding QA with Hugo, and transcript analysis of the Mar 2 sync session.

---

## Executive Summary

The riskiest migration (BL-80 Phase 1 — replacing custom `agent-runtime.js` with Claude Agent SDK `query()`) shipped successfully in v4.27.0. However, it triggered a cascade of integration bugs, most related to token optimization and SDK behavioral differences. 7 releases in 7 days (v4.25.0 → v4.28.1), with 40% of commits being fixes. The engine is architecturally mature but not yet viable for users on the Pro plan ($20/month) due to token overconsumption on binary file processing.

---

## What's Solid

| Area | Status | Key commit/version |
|------|--------|--------------------|
| SDK Migration (BL-80 Ph1) | Complete. Custom runtime eliminated | v4.27.0 |
| Index System (BL-101) | 83% token savings on incremental operations | v4.26.0 |
| Showcase (BL-102 v1) | Astro+MDX running, theme tokenized (27 CSS vars) | v4.28.0 |
| Agent tab persistence (BL-108) | Tab switch no longer kills running extract | `4c0d489` |
| Cross-LLM portability | Validated: GPT-5.3 via Codex ran extract + analyze reading skill .md files | QA onboarding Mar 2 |
| Deterministic scripts | 10 scripts, delta detection by hash, line normalization | Stable since v4.25 |
| Extract quality (BL-110) | SDK Read truncation fixed via sentence-split normalization | `1ef2179` |

## Token Optimization — Current State

### Implemented mitigations

| Mitigation | Mechanism | Savings |
|------------|-----------|---------|
| Index system (BL-101) | `_index/` files ~5KB vs ~200KB originals | ~83% on incremental ops |
| Line normalization | `discover-sources.sh` splits lines >2000 chars to `_temp/` | Prevents SDK Read truncation |
| Express/full/heavy modes | `/extract --express` defers heavy files | Avoids processing binaries by default |
| Delta detection | MD5 hash comparison skips unchanged sources | Zero-cost for re-runs |
| Haiku for Q&A | `claude.js` routes Q&A to Haiku, skills to Sonnet | ~10x cheaper for chat |
| Batched writes | SKILL.md: write EXTRACTIONS.md per subfolder, not all at once | Prevents output token limit hang |
| Parallel reads | SKILL.md: up to 8 Read calls per turn | Fewer turns = less history accumulation |
| Chunked reads | SKILL.md: 1500-line chunks for files >1800 lines | Prevents context overflow |
| Checkpoint gates | `/analyze` writes preventive checkpoint when >15 sections or >300 claims | Enables session recovery |

### Open gaps

| Gap | Impact | BL |
|-----|--------|----|
| **No deterministic preprocessing for PDFs/PPTs/DOCX** | Binary files processed via LLM vision. A single PPT costs $1-2. Hugo's Pro plan ($20) exhausted in one session with 6 files. | BL-113 (P1) |
| **No model routing within skills** | 96% of extract cost is accumulated history per turn. All turns use Sonnet. Haiku subagent for reads would cut this ~10x. | BL-80 Ph2 (P0) |
| **No cost estimation pre-execution** | Users can't anticipate spend before running a skill | BL-80 Ph2 |
| **No usage tracking per session** | SDK exposes `input_tokens` + `output_tokens` but they're not surfaced | BL-80 Ph2 |
| **Rate limit backpressure invisible in webapp** | CLI hides 429s gracefully; webapp shows frozen spinner | Not tracked |

### Cost benchmarks (Sonnet, Tier 1)

| Scenario | Cost | Notes |
|----------|------|-------|
| `/extract` 16 light text files | $1.18 (~$0.07/file) | QA Wave 2.1 measurement |
| `/extract` 72 files (mixed) | ~$5.64 | pds--timining real run |
| `/extract` 6 files with PDFs/PPTs | Exhausted Pro plan | Hugo onboarding session |
| Target post-BL-80-Ph2 | <$0.50 per full run | Haiku reads + Sonnet synthesis |

## Open Bugs (8)

| BL | Bug | Priority | Effort | Origin |
|----|-----|----------|--------|--------|
| BL-111 | Scroll-to-top on insight approval in InsightsView | P1 | S | Hugo QA session |
| BL-112 | `/analyze` skips pending question / should always be PENDING | P1 | S | Hugo QA session |
| BL-113 | Token overconsumption on PDF/PPT/DOCX — no deterministic preprocessing | P1 | M | Hugo QA session |
| BL-114 | Research Brief section titles in English — `output_language` not respected | P2 | S | Hugo QA session |
| BL-115 | Evidence Gaps View uses hardcoded logic instead of LLM-generated gaps from Research Brief | P2 | M | Hugo QA session |
| BL-116 | Convergence counter uses stale LLM-written denominator instead of processed source count | P2 | S | Observed in pds--timining |
| BL-117 | Authority Distribution tags unclear — raw strings, no fallback normalization, no context | P2 | S | Hugo QA session |
| BL-118 | Extractions missing count badge in sidebar (Insights/Conflicts have one) | P2 | S | Hugo QA session |

## Technical Debt — Post-SDK

| Debt | Risk | Mitigation |
|------|------|------------|
| `canUseTool` doesn't work for Read — SDK auto-approves | Medium | Preamble instructions (not deterministic) |
| Batching, parallel reads, index-first are instructions, not code constraints | Medium | Agent can ignore them; no enforcement layer |
| Showcase absorbing polish work (5 recent commits) outside Wave 2 scope | Low (focus dispersion) | Awareness |

## Wave 2 — Remaining Work

Wave 2 goal: make pd-spec usable for external pilots (Hugo, Yoe) without Nico running CLI.

| Item | What | Effort | Unblocks |
|------|------|--------|----------|
| **BL-113** | Deterministic PDF/PPT/DOCX preprocessing (npm packages) | M | Pro plan viability |
| **BL-80 Ph2** | Model routing — Haiku subagent for reads within skills | L | Cost target <$0.50/extract |
| **BL-83 minimal** | Public deploy (URL for pilots) | M | Hugo/Yoe access without cloning |
| BL-111, 112, 114, 115 | Quick bug fixes (all S effort) | S | UX quality |

**Critical path:** BL-113 → BL-80 Ph2 → BL-83. The quick fixes (BL-111/112/114/115) can ship in parallel.

## Observations from Hugo Onboarding (Mar 2)

### What worked
- Pipeline ran end-to-end: sources → insights → conflicts → research brief → strategic vision
- GPT-5.3 (Codex) read CLAUDE.md and skill files as generic instructions — architecture is LLM-agnostic
- Dark mode noticed immediately (positive signal)
- Scripts (discover-sources, source map, checkpoint) all operational

### What didn't work
- Claude Code Pro exhausted in one extract run (cost)
- Codex sandbox blocked npm install / port binding
- Slash commands not supported in Codex macOS app (natural language workaround worked)
- No onboarding flow in webapp — Nico had to guide every step verbally
- Field notes → insight loop felt circular and confusing
- "Approve all" button missing for batch insight review

### Positive validations
- Evidence gaps analysis was accurate ("lack of primary user validation" — Hugo's boss said the same thing)
- Conflict detection worked on minimal data
- Research brief quality was good despite few sources

---

## Recommendation

Focus energy on BL-113 (deterministic preprocessing) before anything else. It's the single change that makes the difference between "works for Nico on Max" and "works for anyone on Pro." BL-80 Ph2 (model routing) is the next multiplier but is more complex. Showcase polish (theme tokens, multi-deck routing) is done — park it until Wave 3.
