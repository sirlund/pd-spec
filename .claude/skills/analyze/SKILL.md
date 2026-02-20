---
name: analyze
description: Process raw claims from 02_Work/EXTRACTIONS.md into atomic insights, cross-reference against 02_Work/INSIGHTS_GRAPH.md, and log contradictions to 02_Work/CONFLICTS.md. Requires /extract first. Incremental by default (only new extractions), use --full to reprocess all.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, AskUserQuestion
argument-hint: "[--full]"
---

# /analyze — Insight Extraction & Cross-Referencing

## What this skill does

Reads raw claims from `02_Work/EXTRACTIONS.md` (produced by `/extract`), converts them into atomic insights, cross-references them against existing verified insights, and logs any contradictions found.

**Prerequisite:** Run `/extract` first to populate `02_Work/EXTRACTIONS.md` with raw claims from source files.

## Instructions

### Phase 0: Session Resume & Integrity Check

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state (insight count, conflict count, last actions). Then compare against the current state of `02_Work/INSIGHTS_GRAPH.md`, `02_Work/CONFLICTS.md`, and `02_Work/SYSTEM_MAP.md`. If discrepancies are found (entries not logged in MEMORY, unexpected files in `02_Work/`), report them to the user before proceeding.

**Language** — Check `output_language` in `PROJECT.md`. If PROJECT.md is missing, default to `en` and suggest running `/kickoff`. Write all insight descriptions, conflict summaries, and source issue reports in that language. System IDs (`[IG-XX]`, `[CF-XX]`, status labels like `PENDING`, `VERIFIED`) stay in English.

### Phase 1: Load Extractions (with Incremental Support)

1. **Check for --full flag** — If user passed `/analyze --full`, force FULL mode (skip incremental logic, process all extractions).

2. **Read extractions** — Read `02_Work/EXTRACTIONS.md`. If the file is missing or contains only the template header (no extraction sections), tell the user: "No extractions found. Run `/extract` first to read source files and extract raw claims." Then stop.

3. **Load current state** — Read `02_Work/INSIGHTS_GRAPH.md` to understand existing insights and their IDs.

4. **Incremental mode detection:**
   - Read `02_Work/MEMORY.md` to find last `/analyze` execution
   - Extract timestamp from the most recent `/analyze` entry (format: `YYYY-MM-DDTHH:MM`)
   - If found AND no `--full` flag: INCREMENTAL mode
   - If not found OR `--full` flag: FULL mode (first run or forced re-analysis)
   - Log mode: "Incremental mode: last /analyze at YYYY-MM-DDTHH:MM" OR "Full mode: processing all extractions"

5. **Filter sections (INCREMENTAL mode only):**
   - For each section in EXTRACTIONS.md with header format `## [filename]`
   - Look for extraction timestamp in section metadata (added by `/extract` in format: `extracted: YYYY-MM-DDTHH:MM`)
   - If section has NO timestamp → process it (legacy extractions from before BL-17)
   - If extraction timestamp > last /analyze timestamp → PROCESS this section
   - If extraction timestamp <= last /analyze timestamp → SKIP this section
   - Build filtered list of sections to process
   - Log: "Incremental mode: processing X new/modified sections, skipping Y unchanged sections"

6. **Load all sections (FULL mode):**
   - Process ALL sections in EXTRACTIONS.md regardless of timestamps
   - Build list of all sections to process
   - Log: "Full mode: processing all N sections"

7. **Format normalization check** — Scan existing insights for format consistency. If older insights use a different format than the current spec (e.g., missing temporal tags, missing key quotes, bold status instead of plain text, three-digit zero-padded IDs like `IG-001`), report the inconsistencies to the user before adding new ones. Do NOT auto-migrate — just flag: "Found N existing insights in old format (missing temporal tags, key quotes). Recommend running `/analyze` with `--normalize` in a future pass." New insights must always follow the current format regardless of what exists.

### Phase 1b: Express Mode Detection

8. **Detect project size** — Count total source files (from EXTRACTIONS.md section headers) and total claims (from raw claim lines):

   | Size | Threshold | Synthesis behavior |
   |---|---|---|
   | **Small** | < 30 files OR < 500 claims | Skip Phase 3 (synthesis) — create atomic insights directly |
   | **Medium** | 30-50 files OR 500-1000 claims | Skip synthesis + suggest `--full` |
   | **Large** | > 50 files OR > 1000 claims | Full synthesis (Phase 3 runs) |

   - `--full` flag overrides: always run full synthesis regardless of project size
   - Log: `⚡ Express: N files, M claims → atomic insights (no synthesis). Use /analyze --full for deeper analysis.` (small/medium) or `Full analysis: N files, M claims → synthesis enabled.` (large)

**Express mode effects:**
- **Phase 2:** Runs normally (dedup, new insights, cross-reference, gap detection)
- **Phase 3 SKIPPED:** No thematic clustering, no convergence weighting, no narrative synthesis
- **Phase 4:** Write atomic insights directly (step 22 path). Still detect and log conflicts.
- **AskUserQuestion (Phase 4):** Simplified — only Question 1 with options A ("Approve all as PENDING") and B ("Approve all as VERIFIED"). No ambiguity handling question (ambiguities auto-saved for /synthesis).

### Phase 2: Analysis (Draft — Incremental-Aware)

8. **Process filtered sections** — Work only with the sections from Phase 1 (incremental filtered list or full list, depending on mode).

9. **Deduplication check** — Before creating any new insight, compare each candidate claim against ALL existing insights (not just their IDs — read the actual claim text). A claim is a duplicate if:
   - It makes the same factual assertion as an existing insight, even if worded differently (semantic match, not string match).
   - It describes the same user need, pain point, or constraint from the same perspective.
   - **NOT a duplicate if:** the same topic is mentioned but with a different claim (e.g., "users hate X" vs "users want X improved" are different claims about the same topic).
   - **When a duplicate is found (INCREMENTAL convergence update):**
     - Do NOT create a new insight
     - Increment convergence count on existing insight (e.g., 2/18 → 3/18)
     - Add new source ref if different file (use Edit tool to append to Ref line)
     - If new source has a better/clearer quote, update the quote
     - Log: "Updated convergence for [IG-XX]: 2/18 → 3/18"
   - **Report duplicates found** — In Phase 4, list how many candidate claims were deduplicated and into which existing insights.

10. **Prepare new insights** — For each raw claim from the filtered sections not already captured:
   - Determine the next available `[IG-XX]` ID (sequential, two-digit minimum: `IG-01` through `IG-99`, then `IG-100`, `IG-101`, etc. Never three-digit zero-pad like `IG-001`).
   - Categorize as one of: `user-need`, `technical`, `business`, `constraint`.
   - Reference the specific source file it came from.
   - **Key quote** — Include 1-2 sentences from the source that best support the claim. This is the evidence trail — without it, the insight is an assertion without proof.
   - **Voice** — Who is the source of this claim? Preserve from EXTRACTIONS.md metadata (Participants field). Use one of:
     - `user` — end-user, operator, or person who uses the product
     - `stakeholder` — internal decision-maker (CEO, CTO, PM, sales)
     - `document` — written artifact with no personal attribution (spec, report, benchmark)
     - `researcher` — field note or observation by the research team
     - `ai` — content generated by AI tools (Gemini, ChatGPT, etc.). Assigned automatically when claim has `[AI-SOURCE]` tag from extraction.
   - **Authority** — What kind of claim is this? Determines evidentiary weight:
     - `direct-quote` — verbatim user/stakeholder statement from interview or workshop
     - `observation` — researcher or document describes something observed/measured
     - `hypothesis` — someone proposes something unvalidated ("we think X", "users probably Y")
     - `vision` — aspirational statement about the future ("in 2040 we will...", "the goal is...")
     - `fact` — verifiable data point (metric, date, technical spec, contractual term)
   - **AI-source rule:** Claims tagged `[AI-SOURCE]` in EXTRACTIONS.md MUST use `voice: ai` and `authority: hypothesis`. They can NEVER be assigned `authority: fact` or `authority: direct-quote` — AI content is inherently unverified. An insight supported ONLY by `voice: ai` sources cannot reach `VERIFIED` status; it requires corroboration from at least one non-AI source (`user`, `stakeholder`, `document`, or `researcher`).
   - **Status: always `PENDING`.** Write the status as plain text `PENDING`, not bold (`**PENDING**`), not in backticks. Same for all status labels.
   - **Temporal tag** — When the insight describes something that exists today vs. something desired for the future, tag it:
     - `(current)` — describes the present state ("users currently do X", "the system has Y limitation")
     - `(aspirational)` — describes a desired future state ("users want X", "the product should do Y")
     - If ambiguous, default to `(current)`. The tag goes after the category: `(user-need, aspirational)`.
   - **Convergence** — After extracting a claim, check if similar claims appear in other source files processed in `02_Work/EXTRACTIONS.md`. Record the convergence ratio: `Convergence: X/Y sources` where X = number of sources mentioning this or a substantially similar claim, Y = total sources processed. A claim from 1 source has convergence 1/Y. A claim echoed across 3 sources has 3/Y.
   - **Atomicity** — One insight per atomic claim. "Users want X and hate Y" is two insights, not one. A source that lists 10 needs produces 10 insights. Do not bundle multiple claims into a single insight.
   - **Field notes confidence** — When a claim comes from a `_FIELD_NOTES.md` source and carries a confidence tag (`high`, `medium`, `low`, `hunch`), include it in the insight metadata as `Source confidence: [level]`. Processing rules by confidence level:
     - `high` / `medium` — Treat as normal claims. Process into PENDING insights like any other source.
     - `low` — Process into PENDING insights but add a note: `Source confidence: low — consider cross-referencing before verification`.
     - `hunch` — Do NOT create a regular insight. Instead, generate an open question for the system map: `"[IG-XX claim rephrased as question] (from field note hunch)"`. Log as a PENDING insight with the note `Source confidence: hunch — logged as open question, not assertion`.
   - **Granularity guidance** — When to separate vs. consolidate:
     - **Separate** when claims have different sources, different categories, or could be independently verified/invalidated.
     - **Consolidate** when two claims are really the same observation stated differently (deduplicate, not merge).
     - When in doubt, **separate**. It's easier to merge later than to split.

   **Insight grouping** — Use `## Section` headers in `INSIGHTS_GRAPH.md` to organize insights by theme (e.g., `## User Experience`, `## Business Model`, `## Technical Architecture`). Headers are a grouping mechanism, not a status. An insight's position under a header doesn't affect its status or category.

11. **Cross-reference** — Compare new claims from filtered sections against ALL existing insights (VERIFIED and PENDING).
   - **Actively seek contradictions** — don't just note obvious conflicts. Look for:
     - Direct contradictions ("users love X" vs "users avoid X").
     - Tensions ("team wants simplicity" vs "client demands customization").
     - Incompatible assumptions ("small user base" vs "must handle 10K concurrent users").
     - Temporal conflicts ("currently using tool Y" vs "already migrated to Z").
   - For each potential conflict, cite the specific claims from both sides.
   - **Convergence boost** — When multiple new claims from different sources converge on the same point, note the convergence ratio. High convergence (>50% of sources) is a strong signal worth highlighting. Single-source insights are fragile and should be noted as such.

12. **Detect evidence gaps** — Two levels of gap detection:

   **a. Claim-level gaps** — Areas where claims are made without sufficient source backing, or where important product areas have no source coverage.

   **b. Source diversity gaps** — Evaluate whether the knowledge base is built on a healthy mix of source types or dangerously skewed. Classify each source into one of these types based on its content and metadata:

   | Source type | What it provides | Gap signal if missing |
   |---|---|---|
   | User research (interviews, observations, usability tests) | User needs, pain points, behaviors | "No user research — user-need insights may be assumptions" |
   | Business data (OKRs, metrics, unit economics) | Business constraints, success criteria | "No business sources — prioritization lacks financial grounding" |
   | Technical docs (architecture, API specs, constraints) | Technical feasibility, limitations | "No technical sources — feasibility of modules is unvalidated" |
   | Brand / design guidelines | Visual identity, tone, accessibility targets | "No brand/design sources — visual decisions lack foundation" |
   | Competitive analysis (benchmarks, audits) | Market context, differentiation | "No competitive sources — positioning based on internal assumptions" |
   | Accessibility data (audits, demographics, WCAG targets) | Inclusive design constraints | "No accessibility sources — compliance claims are unsupported" |

   Report which source types are present and which are missing. For missing types, suggest what kind of source would fill the gap (as options, not impositions — per Mandate #4).

   **c. Diversity dimensions** — Beyond source type, evaluate three additional diversity axes:

   - **Temporal diversity** — Are all sources from the same time period? Check source dates (from metadata or folder names). Flag clusters where all sources are older than 6 months ("sources may be outdated") or where all sources share the same date range ("no longitudinal perspective — trends and changes over time are invisible").
   - **Perspective diversity** — Are all sources from the same stakeholder group? Categorize sources by who produced or is represented in them (e.g., management, end-users, operators, engineers, external partners). Flag when a single perspective dominates (>70% of sources) with no counterbalance.
   - **Methodology diversity** — Are all sources the same method type? (e.g., all interviews, all documents, all quantitative). Qualitative sources reveal *why*; quantitative sources reveal *how much*. Flag when all sources share a single methodology.

   **d. Source matrix & diversity score** — Build a source matrix for internal tracking:

   ```
   Source type          | Present | Files | Example file
   ---------------------|---------|-------|-------------
   User research        | ✓ / ✗   | N     | path/to/file
   Business data        | ✓ / ✗   | N     | ...
   Technical docs       | ✓ / ✗   | N     | ...
   Brand / design       | ✓ / ✗   | N     | ...
   Competitive analysis | ✓ / ✗   | N     | ...
   Accessibility data   | ✓ / ✗   | N     | ...
   ```

   Calculate a **diversity score**: number of source types present out of 6 (e.g., `3/6`). This is a simple health indicator, not a quality judgment — a 6/6 project with shallow sources is worse than a 3/6 project with deep ones.

   **e. Single-source fragility flags** — After insights are prepared (step 10), review them for source diversity at the insight level. Flag any insight whose supporting evidence comes from only one source type. These insights are more fragile — they lack cross-type corroboration. In the report (Phase 5), list fragile insights with a note like: `[IG-05] supported only by user research — would benefit from technical or business corroboration`.

### 🆕 Phase 3: SYNTHESIS (Observation → Insight Consolidation)

**Skip condition:** If express mode is active (small/medium project, no `--full` flag), skip this entire phase. Jump to Phase 4, step 22 (write atomic insights directly). Ambiguities are auto-saved as PENDING conflicts.

**Goal:** Consolidate atomic observations into strategic insights with narrative, detect ambiguities, suggest research gaps.

**Target:** 15-25 real insights (5-8 for small projects <20 sources, 10-15 medium, 15-25 large >50 sources)

**13. Detect High-Convergence Candidates:**
- Scan all PENDING insights (from step 10) for convergence ≥2 sources
- Sort by convergence count (highest first)
- These are synthesis candidates — claims echoed across multiple sources

**14. Thematic Clustering:**
- Group insights by theme (manually identify patterns):
  - **Problem statements** — user pain, gaps, friction points
  - **Solutions** — capabilities, differentiation, value propositions
  - **Constraints** — business rules, technical limits, regulatory requirements
  - **Vision** — aspirational goals, roadmap, future state
- Use existing section headers in INSIGHTS_GRAPH.md as clustering hints
- Look for recurring concepts across insights (same pain point in different words)

**15. Consolidate into Strategic Insights:**

For each cluster with ≥2 atomic observations:
- **Named concept:** Extract memorable phrase from source quotes (e.g., "Geometry Gap" from TIMining, "Auto de Homero Simpson" metaphor). Do NOT invent names — use language from sources.
- **Narrative:** 2-3 sentences explaining the insight with context — problem + evidence trail + impact
- **Consolidates:** List which [IG-XX] atomic insights this synthesizes
- **Convergence:** Sum unique sources across consolidated insights
- **Category:** user-need, technical, business, constraint (include temporal tag: current vs aspirational)
- **Voice/Authority weighting:** Prioritize user direct-quotes > stakeholder observations > hypotheses

**Output format for synthesized insights:**
```markdown
### [IG-SYNTH-01] [Named Concept] — [Short Description]
**Consolidates:** IG-19, IG-20, IG-161
**Convergence:** 3/21 sources
**Category:** user-need (current)
**Voice:** user (operators), stakeholder (COO), document (workshop notes)
**Authority:** direct-quote, observation, fact

> **Narrative:** [2-3 sentences explaining the insight with context]

**Evidence trail:**
- [Source 1]: "[Quote or observation]"
- [Source 2]: "[Quote or observation]"
- [Source 3]: "[Quote or observation]"

**Named concept origin:** "[Concept]" from [source reference]
```

**16. Detect Ambiguities (6 types):**

Scan prepared insights for uncertainty patterns:

- **Imprecision:** Numeric ranges without full data ("6-8 productos" but only 6 named)
- **Conflicts:** Source A vs Source B on same topic (different claims, not just perspectives)
- **Single-source critical:** Strategic claims with only 1 source (fragile foundation)
- **Definition gaps:** Terms used 5+ times across sources without clear definition
- **Unresolved contradictions:** 3+ sources disagree, no consensus emerged
- **Perspective conflicts:** Voice/Authority reveals different interpretations by role (users say X, CTO says Y)

For each ambiguity detected:
```markdown
### [AMB-01] [Uncertainty Type] — [Short Description]
- **Source claim:** "[Quote or paraphrase]"
- **Verification:** [What we know vs what's unclear]
- **Options:**
  - A: [Conservative interpretation]
  - B: [Alternative interpretation]
  - C: [Research gap requiring validation]
- **Recommended action:** [Interview stakeholder / Workshop / Benchmark / etc.]
```

**17. Convergence Weighting by Voice/Authority:**

When consolidating, prioritize evidence by who says it and how they know it:

| Voice | Authority | Weight | Example |
|---|---|---|---|
| user | direct-quote | ⚡⚡⚡ High | 5 operators: "timing confuso" |
| document | fact | ⚡⚡⚡ High | "$6M captured in contract" |
| stakeholder | observation | ⚡⚡ Medium | CTO: "users don't read manual" |
| stakeholder | hypothesis | ⚡ Low | PM: "users might prefer mobile" |
| stakeholder | vision | ⚡ Low | CEO: "2040 remote mines" |
| ai | hypothesis | ⚡ Low | Gemini: "users likely need X" |

**Prioritization order:**
1. High convergence + user voice + direct-quote
2. Facts from documents (metrics, dates, specs)
3. Stakeholder observations (what they've seen happen)
4. Single-source stakeholder opinions (flag for validation)
5. Visions and hypotheses (mark aspirational, treat as assumptions)
6. AI-generated claims (always lowest priority — require non-AI corroboration to verify)

**18. Suggest Research Gaps:**

Identify missing validation:
- Single-source strategic claims → suggest stakeholder interview or user validation
- Missing stakeholder perspectives (e.g., no CFO input but pricing/budget claims made)
- Technical claims without engineering validation
- User needs without user research (only stakeholder assumptions)
- Business claims without financial data

**Output format:**
```markdown
### Research Gaps (N critical validations needed)

1. **[Gap Name]** — [What's missing and why it matters]
   - **Risk:** [What could go wrong if we proceed without this]
   - **Suggested methodology:** [How to fill gap — interview, workshop, benchmark, etc.]
```

**19. Present Synthesis Report to User:**

BEFORE writing to files, present synthesis findings:

```markdown
## Synthesis Report — [Project Name] (YYYY-MM-DD)

**Atomic observations:** X claims from Y sources
**Real insights:** Z strategic insights
**Method:** Convergence (≥2 sources) + thematic clustering + narrative synthesis

### High Confidence Strategic Insights (N)
[List synthesized insights with format from step 15]

### Medium Confidence Insights (N)
[Insights with lower convergence or single-source critical claims]

### Ambiguities Detected (N)
[List from step 16 — imprecisions, conflicts, definition gaps]

### Research Gaps (N)
[List from step 18 — missing validations]
```

**19b. Use AskUserQuestion for structured approval** (no free-text prompt):

Invoke AskUserQuestion with 2 questions. Write question text and option labels in `output_language`. Substitute actual counts for N and M.

- **Question 1** (header: "Synthesis", multiSelect: false):
  - Question text: "What to do with N synthesized insights?" (in output_language)
  - Option A: "Approve all as PENDING" — recommended. Write N insights as PENDING for dashboard review.
  - Option B: "Approve all as VERIFIED" — express. Write N insights as VERIFIED, skip individual review.
  - Option C: "Review one by one" — present each insight for individual terminal approval (slow, for small projects only).

- **Question 2** (header: "Ambiguities", multiSelect: false):
  - Question text: "How to handle M ambiguities detected?" (in output_language)
  - Option A: "Save for /synthesis" — recommended. Write as PENDING conflicts, resolve later with dashboard.
  - Option B: "Resolve now" — walk through each ambiguity immediately in terminal.

**Proceed to Phase 4 based on user selections.**

### Phase 4: Write (Based on AskUserQuestion Responses)

**Response to Synthesis Question:**

**Path A — "Approve all as PENDING"** (most common):

20. **Write synthesized insights as PENDING** — Add consolidated insights to `02_Work/INSIGHTS_GRAPH.md` using synthesis format from step 15 with `Status: PENDING`.

21. **Mark atomic observations as MERGED** — For each atomic insight that was consolidated:
   ```markdown
   ### [IG-XX] [Original claim]
   Status: MERGED → [IG-SYNTH-YY]
   Convergence: 1/Y sources
   Ref: [original source]
   ```
   Keep atomic observations in file for traceability, but mark them as merged.

**Path B — "Approve all as VERIFIED"** (express mode):

20b. **Write synthesized insights as VERIFIED** — Same as Path A but with `Status: VERIFIED`.

21b. **Mark atomic observations as MERGED** — Same as step 21.

**Path C — "Review one by one"** (small projects):

20c. **Present each synthesized insight for individual approval** — Show one at a time, ask user to approve or reject. Write approved insights as PENDING, skip rejected ones. Repeat until all are reviewed.

21c. **Mark merged atomic observations** — Same as step 21 for approved insights only.

**If synthesis was skipped entirely (no synthesis candidates found, or project too small):**

22. **Write atomic insights** — Add all new insights to `02_Work/INSIGHTS_GRAPH.md`. Each insight must include:
   - `[IG-XX]` ID (sequential, two-digit minimum: `IG-01`…`IG-99`, then `IG-100`+)
   - Category and temporal tag in parentheses: `(user-need, current)`, `(technical, aspirational)`, `(business)`, `(constraint)`
   - Atomic claim — one idea per insight
   - Key quote — 1-2 sentences from the source (in a blockquote)
   - Voice: `user` / `stakeholder` / `document` / `researcher`
   - Authority: `direct-quote` / `observation` / `hypothesis` / `vision` / `fact`
   - Convergence ratio: `Convergence: X/Y sources`
   - Source reference: `Ref: [file path]`
   - Status: `PENDING` (plain text, no formatting)
   - Source confidence (field notes only): `Source confidence: [high/medium/low/hunch]` — omit for non-field-note sources

23. **Handle ambiguities** — Based on AskUserQuestion response to Question 2:
    - **"Save for /synthesis":** Write each ambiguity to `02_Work/CONFLICTS.md` as PENDING (format from step 16). Include options and recommended actions.
    - **"Resolve now":** Present each ambiguity in terminal with its options (A/B/C from step 16). For each, ask user to choose. Write resolved ones to CONFLICTS.md with status RESOLVED + chosen option. Write unresolved ones as PENDING.

24. **Log conflicts** — For each detected contradiction (from step 11 cross-reference):
    - Read `02_Work/CONFLICTS.md` to get the next available `[CF-XX]` ID.
    - Append the conflict as `PENDING` with a description of the tension.
    - **Both sides must reference `[IG-XX]` IDs** — a conflict without insight refs on both sides is just an observation. Each side of the tension must point to the specific insight(s) that support it.

25. **Write to project memory** — Append an entry to `02_Work/MEMORY.md`.

    **IMPORTANT: Count from files, not from memory.** Before writing the snapshot, verify counts by scanning the actual files:
    - Insights: count `### [IG-` headers in `INSIGHTS_GRAPH.md` (includes SYNTH, atomic, and all statuses)
    - Conflicts: count `### [CF-` headers in `CONFLICTS.md`
    - Do NOT rely on in-memory tallies — they may miss synthesized insights or convergence-created entries.

    ```markdown
    ## [YYYY-MM-DDTHH:MM] /analyze [--full]
    - **Request:** /analyze [incremental|full]
    - **Mode:** INCREMENTAL (processed X new claims from Y sections, skipped Z unchanged sections) OR FULL (processed X claims from Y sections)
    - **Synthesis:** Z atomic observations → N synthesized insights (M ambiguities detected, K research gaps identified)
    - **Actions:**
      - Synthesized insights created: N
      - Atomic observations marked MERGED: Z
      - Convergence updated: M existing insights
      - Ambiguities logged: [AMB-XX] count
      - Conflicts detected: K
    - **Result:** Total insights: T (V VERIFIED, P PENDING, S MERGED, I INVALIDATED) · C conflicts/ambiguities PENDING
    - **Snapshot:** T insights (V VERIFIED, P PENDING, S MERGED, I INVALIDATED) · C conflicts PENDING · O outputs
    ```

### Phase 4b: Research Brief

After writing insights and conflicts, generate a Research Brief — a short executive narrative for stakeholders who don't want to read a list of insights.

**Structure:**

1. **"What's Broken"** — pain points and problems found (from user-need insights tagged as `current`)
2. **"What Could Be Better"** — opportunities and aspirations (from `aspirational` insights)
3. **"What Works Well"** — strengths to preserve (from positive current-state insights)
4. **"Key Tensions"** — unresolved conflicts that need stakeholder input (from `PENDING` conflicts)
5. **"Evidence Gaps"** — what we don't know yet and how to fill it

**Rules:**

- Group by narrative themes, NOT by technical categories
- Write in `output_language`
- Reference `[IG-XX]` IDs inline but keep the text readable
- Maximum 500 words per section
- No jargon, no internal pipeline terminology
- Target audience: project stakeholders who haven't used PD-Spec
- This is auto-generated — no user approval step needed
- The brief supplements the insight list, it does not replace it

**Output:** Write to `02_Work/RESEARCH_BRIEF.md` using this format:

```markdown
# Research Brief
> Auto-generated by /analyze on YYYY-MM-DD
> Based on X insights from Y sources

## What's Broken
[narrative text with [IG-XX] refs]

## What Could Be Better
[narrative text]

## What Works Well
[narrative text]

## Key Tensions
[narrative text with [CF-XX] refs]

## Evidence Gaps
[list of gaps with suggestions]
```

### Phase 5: Auto-Generate Dashboard

After writing files, generate STATUS.html automatically so the user can review insights and conflicts without running a separate command.

26. **Build JSON data** from the analysis results already in memory:

   ```json
   {
     "meta": {
       "type": "status",
       "generated": "YYYY-MM-DD",
       "language": "[output_language]",
       "last_session": "YYYY-MM-DDTHH:MM"
     },
     "title": "[project_name] — Dashboard",
     "cards": [
       {"count": N, "label": "Insights", "breakdown": "V verified, P pending", "style": "ok|warn"},
       {"count": C, "label": "Conflicts", "breakdown": "P pending, R resolved", "style": "ok|warn"},
       {"count": S, "label": "Sources", "style": "ok"},
       {"count": G, "label": "Evidence Gaps", "style": "ok|warn"}
     ],
     "insights": [...],
     "conflicts": [...],
     "sources": [...],
     "source_diversity": [...],
     "source_issues": [...],
     "evidence_gaps": [...],
     "system_map": {...}
   }
   ```

   - **insights:** All `[IG-XX]` entries from INSIGHTS_GRAPH.md (just written). Fields: id, status, category, temporal, claim, source, quote.
   - **conflicts:** All `[CF-XX]` entries from CONFLICTS.md (just written). Fields: id, status, title, refs, tension, sides, flag_label ("Flag for stakeholder review"), research_label ("Validate with additional research"). Use generic labels — no inference. **Intermediate states:** When parsing CONFLICTS.md, detect `Status: PENDING — Flagged (context)` or `Status: PENDING — Research (context)` syntax. If found, emit `intermediate_status: "flagged"` or `"research"` and `intermediate_note: "context"` fields in the conflict JSON. These render as distinct badges in the dashboard.
   - **sources:** Glob `01_Sources/` to list folders with file counts and types.
   - **source_diversity:** Check which types are present: Interviews, Benchmarks, Analytics, Workshops, Surveys.
   - **evidence_gaps:** Insights with Convergence < 2 sources → add as claim-level gap. Missing source types → add as source-diversity gap.
   - **system_map:** Read `02_Work/SYSTEM_MAP.md` if it exists; use empty object if not.
   - **Card styles:** "warn" when pending conflicts or evidence gaps > 0, otherwise "ok".

27. **Read template** — `03_Outputs/_templates/status.html`.

28. **Inject JSON** — Replace the contents of `<script id="pd-data" type="application/json">` with the generated JSON.

29. **Write** — `03_Outputs/STATUS.html`.

30. **Self-check** — Re-read `03_Outputs/STATUS.html` and verify it contains `<script id="pd-data" type="application/json">` with valid JSON inside. If missing, retry the injection. **CRITICAL: Never write STATUS.html as monolithic inline HTML/CSS/JS. Always use the template.**

### Phase 6: Report

31. **Compact output** — After writing STATUS.html, output ONLY:
   ```
   ✓ Analysis complete: [N insights, C conflicts, G evidence gaps]
   ✓ Dashboard: 03_Outputs/STATUS.html
   Mode: [INCREMENTAL: processed X sections, skipped Y | FULL: processed all Z sections]
   ```

   Include brief notes only if something needs user attention:
   - Source organization issues found (each one, 1 line)
   - Fragile insights (count, not full list)
   - Research gaps suggested (count)

   Do NOT show:
   - Full insight or conflict lists (those are in STATUS.html)
   - Source matrix table (visible in dashboard)
   - Verbose deduplication logs
   - Reminder to run `/status` (dashboard already auto-generated)
