# Token Strategy — CLI vs SDK Optimization Paths

**Date:** 2026-03-04
**Status:** DRAFT — pending review and prioritization
**Context:** Post-SDK migration. Two separate token consumption problems with different economics requiring different (but complementary) solutions.

---

## Two Channels, Two Problems

### Channel 1 — CLI (Claude Code Pro $20 / Max $100-200)

- Flat subscription, opaque usage cap (resets daily/monthly)
- Every Read, Write, tool call counts against the cap
- **The waste:** LLM reading binary files (PDF vision, PPT parsing), counting things, doing regex — all mechanical work that burns budget with zero semantic value
- **Hugo's case:** Pro plan ($20) exhausted in ONE `/extract` session with 6 files

### Channel 2 — SDK (API key, pay-per-token)

- Sonnet: ~$3/M input, ~$15/M output. Haiku: ~$0.25/M input, ~$1.25/M output
- **The waste:** accumulated history. Cost is O(N²) — each turn carries all previous turns
- 72 files over ~20 turns = system prompt + full history sent 20 times
- 96% of cost is history, not the actual semantic work

**Key insight:** Both channels benefit from removing mechanical work from the LLM. But the SDK has an additional structural problem (history accumulation) that requires architectural changes.

---

## Guiding Principle

> Agents should be orchestrators and thinkers, not executors of mechanical tasks.
> Why write a custom script when an npm package already does it well?

| LLM should do (semantic) | LLM should NOT do (mechanical) |
|---|---|
| Understand what a text says | Extract text from a PDF |
| Detect contradictions between sources | Count files or claims |
| Categorize and group claims | Parse binary formats (PPTX, DOCX, XLSX) |
| Synthesize insights from evidence | Compute hashes |
| Resolve conflicts with reasoning | Normalize line lengths |
| Write strategic vision and proposals | Generate sequential IDs |

Everything on the right is already done by scripts or can be done by npm packages. Everything on the left is the only work that justifies LLM cost.

---

## Path 1: Fat Scripts, Thin Skills

**Scope:** CLI + SDK
**Impact:** High on both channels
**Effort:** M
**Expands:** BL-113

### Concept

Expand BL-113 from "add pdf-parse" to a full preprocessing philosophy. A script (new `preprocess-sources.sh` or integrated into `discover-sources.sh`) runs npm packages to convert ALL binary sources into plain text BEFORE the LLM touches anything.

### Pipeline

```
01_Sources/              npm packages              02_Work/_temp/
  report.pdf      →     pdf-parse / pdfjs-dist →   report.md
  slides.pptx     →     pptx-parser            →   slides.md
  brief.docx      →     mammoth                →   brief.md
  data.xlsx       →     xlsx                   →   data.md
  photo.png       →     skip (or tesseract.js) →   photo.txt (optional)
  recording.mp4   →     skip                   →   (flagged for manual)
```

### Three-phase extraction pipeline

**`/extract` today:**
1. Run `discover-sources.sh` (script, 0 tokens)
2. Read each source file (LLM reads PDFs visually — EXPENSIVE)
3. Extract claims (LLM, justified)
4. Write EXTRACTIONS.md (LLM, low cost)

**Proposed — three phases:**

```
Phase 1: Mechanical preprocessing (0 tokens)
  ┌─────────────────────────────────────────────────────┐
  │  discover-sources.sh + preprocess-sources.sh        │
  │                                                     │
  │  For each binary source:                            │
  │    → Run npm package (pdf-parse, mammoth, etc.)     │
  │    → Got enough text?                               │
  │        YES → write .md to _temp/, mark PREPROCESSED │
  │        NO  → mark needs-vision in SOURCE_MAP        │
  │                                                     │
  │  Output: preprocessed text files + vision manifest  │
  └─────────────────────────────────────────────────────┘

Phase 2: Semantic extraction — light (cheap, Haiku-viable)
  ┌─────────────────────────────────────────────────────┐
  │  LLM reads pre-processed .md files (plain text)     │
  │  Extracts claims from all PREPROCESSED sources      │
  │  Fast, cheap — text only, no vision                 │
  └─────────────────────────────────────────────────────┘

Phase 3: Semantic extraction — vision (expensive, requires confirmation)
  ┌─────────────────────────────────────────────────────┐
  │  "3 files need visual processing (~$X est). Run?"   │
  │                                                     │
  │  CLI:  agent asks directly, user says yes/no        │
  │  App:  AskUserQuestion via InteractionBridge        │
  │                                                     │
  │  YES → LLM reads original files with vision         │
  │  NO  → marked pending-vision for later              │
  └─────────────────────────────────────────────────────┘
```

**Vision detection heuristic:** The preprocessing script runs `pdf-parse` on every PDF. If extracted text is < 200 chars for a file > 100KB, the file is likely visual (infographic, diagram, photo-heavy). Marked `needs-vision` automatically. No manual classification needed.

**`--semantic` flag:** Manual override to force vision processing on all files, bypassing the heuristic. For cases where layout/visual context matters even when text extraction succeeded (e.g., a PDF where spatial arrangement of text conveys meaning).

**Interaction model:** Phase 3 confirmation reuses the existing express/heavy pattern. In express mode (default), vision files are deferred as `pending-vision`. In full mode, the agent asks before processing them. The `--semantic` flag skips the question and processes everything with vision.

### npm packages (candidates)

| Format | Package | Maturity | Notes |
|--------|---------|----------|-------|
| PDF | `pdf-parse` or `pdfjs-dist` | Stable | Text extraction + vision detection heuristic |
| DOCX | `mammoth` | Stable | Converts to clean HTML/text |
| PPTX | `pptx` or `officegen` | Moderate | Slide text + speaker notes |
| XLSX | `xlsx` (SheetJS) | Stable | Sheets to CSV/text |
| CSV | `csv-parse` | Stable | Already text but may need structuring |
| Images | `tesseract.js` | Moderate | OCR — heavy, optional, skip by default |

### Impact

- **CLI:** Pro users spend budget on semantic work only. Hugo's 6-file project would work fine on Phase 1+2 alone. Phase 3 is opt-in and explicit about cost.
- **SDK:** Direct reduction of input tokens — plain text vs visual processing. Phase 3 confirmation via existing `AskUserQuestion` / `InteractionBridge` (already works).
- **Trade-off:** Adds npm dependencies. Previously avoided for portability, but now that the webapp already requires `npm install`, this constraint is obsolete.
- **User experience:** Unchanged for text-only projects. For mixed projects, Phase 1+2 run silently and fast, then the user is asked about the visual files with a cost estimate before proceeding.

---

## Path 2: Parallel Extraction (SDK-specific)

**Scope:** SDK only
**Impact:** Very high (~10x cost reduction)
**Effort:** L
**Expands:** BL-80 Phase 2

### The problem: O(N²) history

```
Today (sequential, one agent):
  Turn 1:  system + file1                          →  claims1    (15K tokens input)
  Turn 2:  system + file1 + claims1 + file2        →  claims2    (30K tokens input)
  Turn 3:  system + all previous + file3            →  claims3    (45K tokens input)
  ...
  Turn 20: system + EVERYTHING                      →  claims20   (300K tokens input)
  Total input: ~3M tokens

Proposed (parallel, N independent calls):
  Call 1:  system + file1  →  claims1               (15K tokens)
  Call 2:  system + file2  →  claims2               (15K tokens)
  Call 3:  system + file3  →  claims3               (15K tokens)
  ...
  Call 20: system + file20 →  claims20              (15K tokens)
  Total input: ~300K tokens (10x less)
```

### Architecture

Each extraction call is **stateless** — system prompt + skill instructions + ONE file's pre-processed text. No history. After all calls complete, a script merges claim files into EXTRACTIONS.md. Then ONE synthesis call (`/analyze`) works on the index (not raw data).

### Model routing

- **Extraction calls:** Haiku ($0.25/M) — extracting claims from plain text is well within Haiku's capability
- **Synthesis call:** Sonnet ($3/M) — categorization, conflict detection, insight generation needs stronger reasoning

### Cost projection

| Scenario | Today (sequential Sonnet) | Proposed (parallel Haiku + Sonnet synthesis) |
|----------|--------------------------|----------------------------------------------|
| 6 files (Hugo) | Exhausted Pro plan | ~$0.05 |
| 16 text files | $1.18 | ~$0.08 |
| 72 mixed files | $5.64 | ~$0.30 |

### Implementation

Refactor `app/server/claude.js`:
- For `/extract`: spawn N independent `query()` calls (one per file or per batch of 3-5 small files)
- Each call gets a minimal system prompt + extraction instructions + file content
- Collect results, merge via script
- Final synthesis call with Sonnet on merged claims

**Depends on:** Path 1 (preprocessing must happen first — parallel calls with raw PDFs would be even more expensive).

---

## Path 3: Tiered Pipeline (SDK auto-detection)

**Scope:** SDK
**Impact:** Medium (UX + cost predictability)
**Effort:** S (once Paths 1 and 2 exist)

### Concept

Not all projects need the same pipeline. Auto-detect complexity from `discover-sources.sh` output and select strategy:

| Tier | Sources | Strategy | Est. Cost |
|------|---------|----------|-----------|
| Micro | 1-5 files, all text | Single agent, no batching | <$0.10 |
| Light | 5-20 files, mixed | Preprocess binaries, simple extract | <$0.50 |
| Standard | 20-50 files | Parallel extraction + Haiku | <$2.00 |
| Heavy | 50+ files | Full parallel, chunked, multi-session | <$5.00 |

### Pre-flight estimator

Before any LLM call, calculate expected cost:

```
Input: discover-sources.sh output (file count, sizes, types)
       + preprocess-sources.sh output (text sizes after conversion)
Output: "This /extract will process 6 files (~45KB text). Estimated cost: $0.15. Proceed?"
```

The SDK already returns `input_tokens` + `output_tokens` per call — surface these as running totals during execution and as a session summary after.

---

## Path 4: Asymmetric Orchestration (CLI vs SDK)

**Scope:** Both, but different approaches
**Impact:** High for CLI
**Effort:** S (skill audit)

### The fundamental difference

- **CLI:** The LLM is the orchestrator. It reads SKILL.md and decides when to call scripts. We influence behavior via instructions.
- **SDK:** Node.js is the orchestrator. Code decides when to call the LLM. We control the flow programmatically.

### CLI optimization: skill audit

Review each skill to identify remaining mechanical work the LLM does that could be a script:

| Skill | LLM does today (mechanical) | Should be script/package |
|-------|----------------------------|--------------------------|
| `/extract` | Reads binary files | Path 1 (preprocess) |
| `/extract` | Counts processed vs remaining | Already scripted (discover-sources.sh) |
| `/analyze` | Reads full EXTRACTIONS.md | Mostly fixed (BL-101 index) |
| `/analyze` | Generates convergence ratios | Could be scripted (count grep matches) |
| `/spec` | Reads full INSIGHTS_GRAPH.md | Partially fixed (index) |
| `/ship` | Reads full Work layer | Partially fixed (index) |
| `/audit` | Reads everything to check quality | Could use script-based pre-checks |

Each item moved to a script = more room for the LLM to think within the same budget.

### SDK optimization: code-driven pipeline

In the SDK, the pipeline doesn't need the LLM to decide "should I run the script now?" — we know the pipeline steps:

```javascript
// SDK pipeline (code orchestrates, LLM only for semantic steps)
async function extract(projectDir) {
  // Step 1-2: mechanical (zero LLM)
  await runScript('discover-sources.sh', projectDir);
  await runScript('preprocess-sources.sh', projectDir);

  // Step 3: semantic (LLM, parallel, Haiku)
  const files = await getPreprocessedFiles(projectDir);
  const claims = await Promise.all(
    files.map(f => extractClaims(f, { model: 'haiku' }))
  );

  // Step 4: merge (zero LLM)
  await mergeClaims(claims, projectDir);

  // Step 5: synthesis (LLM, Sonnet, one call)
  await synthesize(projectDir, { model: 'sonnet' });
}
```

This is the full vision of "agents as thinkers, not executors" applied to the SDK.

---

## Recommended Sequence

```
                            CLI impact    SDK impact    Effort    Depends on
                            ──────────    ──────────    ──────    ──────────
1. Path 1 (BL-113 expanded)    High          High          M        —
   npm preprocessing

2. Path 2 (BL-80 Ph2)          —             Very high     L        Path 1
   parallel extraction

3. Path 3 (tiering)            —             Medium        S        Paths 1+2
   auto-detect + estimator

4. Path 4 (skill audit)        High          —             S        Path 1
   remove remaining mechanical work
```

Path 1 is the highest-value move — attacks both channels, is M effort, and unblocks Pro plan viability. Path 2 is the big SDK multiplier but depends on Path 1 (parallel calls with raw PDFs would be worse). Paths 3 and 4 are refinements built on top.

---

## Open Questions

1. **Image handling:** Skip by default. Tesseract.js is an option but heavy. LLM vision for images is genuinely semantic — keep it behind Phase 3 (`needs-vision` or `--semantic`).
2. **Transcript preprocessing:** STT transcripts (Granola, etc.) already handled by line normalization (BL-110). Speaker detection could be regex-based (script) for common STT formats, but full speaker attribution is semantic — leave to LLM. Low priority.
3. **Parallel extraction granularity (Path 2):** One call per file? Per batch of 3-5 small files? Per subfolder? Need to balance parallelism vs overhead of N separate API calls.
4. **Haiku quality for extraction:** Assumption is Haiku extracts claims from plain text at ~95% Sonnet quality. Needs empirical validation on a real project before committing.
5. **Phase 3 cost estimation:** How accurate can we make the estimate? Input tokens are predictable (file size), but output tokens depend on content density. A conservative multiplier (e.g., 1.5x input) might be good enough for a ballpark shown to the user.
