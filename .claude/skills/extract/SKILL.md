---
name: extract
description: Read and extract raw claims from source files in 01_Sources/. Writes structured extractions to 02_Work/EXTRACTIONS.md for /analyze to process.
user-invocable: true
allowed-tools: Read, Grep, Glob, Write
argument-hint: "[folder-name]"
---

# /extract — Source Reading & Claim Extraction

## What this skill does

Reads all source files in `01_Sources/`, extracts raw claims and factual statements, and writes them to `02_Work/EXTRACTIONS.md`. This is the reading step — no interpretation, no categorization. The output feeds into `/analyze` for insight extraction and cross-referencing.

## Instructions

### Phase 0: Session Resume

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state (insight count, conflict count, last actions). Then compare against the current state of `02_Work/` files. If discrepancies are found, report them to the user before proceeding.

**Language** — Check `output_language` in CLAUDE.md `## Project Settings`. Write all user-facing text in EXTRACTIONS.md in that language. System identifiers and structural labels stay in English.

### Phase 1: Discover Sources

1. **Discover sources** — Glob `01_Sources/` recursively for all files except `_SOURCE_TEMPLATE.md`, `_CONTEXT_TEMPLATE.md`, `_FIELD_NOTES_TEMPLATE.md`, `_CONTEXT.md`, `_README.md`, and `.gitkeep`. Sources may be organized in subfolders by milestone or category.

   If an argument was provided (e.g., `/extract benchmark-inicial`), only process files within `01_Sources/[argument]/`. If the folder doesn't exist, report the error and stop.

2. **Read folder context** — For each subfolder, check for a `_CONTEXT.md` file. If present:
   - Use it to understand non-markdown files (images, PDFs, spreadsheets, .txt) that can't carry their own metadata.
   - **Validate structure** — `_CONTEXT.md` must follow `01_Sources/_CONTEXT_TEMPLATE.md` structure (Type, Date, Participants, Context, Files table). Flag deviations.
   - **No insight derivation** — `_CONTEXT.md` describes files, it does NOT interpret or derive conclusions from them. If a `_CONTEXT.md` contains analysis, opinions, or derived insights (e.g., "this shows that users prefer X"), flag it as a source organization issue.

3. **Validate source organization** — For each source file, check:
   - Does the file's metadata (type, date, context) match the folder it's in?
   - Is any file misplaced (e.g., a benchmark in an interviews folder)?
   - Does the file date conflict with the folder date prefix?
   - Are there missing metadata fields (Type, Date, Participants, Context)?
   - Are there non-standard date formats (expected: `YYYY-MM-DD`)?
   - Does the file follow `_SOURCE_TEMPLATE.md` structure? If not, flag it.
   - **If inconsistencies are found:** report them to the user and ask for confirmation before proceeding. Do not move or reclassify files without explicit approval.

4. **Report progress** — Log overall scope before starting:
   - "Starting extraction: X folders, Y total files"

### Phase 2: Read & Extract

5. **Read each source** — For every source file, read it and extract raw claims and factual statements.

   - Each extracted claim is a verbatim quote or close factual paraphrase — **NO interpretation, NO categorization, NO judgment**.
   - Include ALL claims, even seemingly minor ones — `/analyze` decides relevance.
   - One claim per line. If a paragraph contains multiple distinct facts, separate them.

   **Field notes** (`_FIELD_NOTES.md` files) — These are researcher observation files following `_FIELD_NOTES_TEMPLATE.md`. Each dated entry (`### YYYY-MM-DD Topic`) is a separate claim. Extract each entry individually, preserving the confidence level (`high`, `medium`, `low`, `hunch`) as metadata in the extraction:

   ```markdown
   ## [source-folder/_FIELD_NOTES.md]
   - Type: field_notes
   - Date: [date from entry header]

   ### Raw Claims
   1. "[note content]" (Confidence: high)
   2. "[note content]" (Confidence: hunch)
   ```

   Field notes are treated as any other source — no higher or lower priority. The confidence tag is preserved for `/analyze` to use during insight processing.

   **Non-markdown files** — The agent can read images (PNG, JPG) and PDFs directly using the Read tool:
   - **Images** (photos, screenshots, whiteboard captures) — Read the image file directly. Extract visible text, diagrams, post-it notes, or annotations as claims. For workshop photos, capture spatial relationships (groupings, connections drawn between items).
   - **PDFs** — Read using the Read tool with `pages` parameter for large documents (>10 pages). Extract claims from text content.
   - **Files described in `_CONTEXT.md`** — If a non-readable file (spreadsheet, .docx, proprietary format) is described in `_CONTEXT.md`, extract claims from the descriptions provided there.

   **Progress reporting** — Report progress to the user throughout extraction:

   - **Before starting each subfolder:** Log "Processing `[folder-name]/` — 0% (0/N files)"
   - **After each file:** Log "Processing `[folder-name]/` — X% (M/N files) — `filename`"
   - **After completing each subfolder:** Log "Completed `[folder-name]/` — 100% (N/N files) — X claims extracted"
   - **After all folders:** Log "Extraction complete: Y files processed, Z total claims extracted"

### Phase 3: Write Extractions

6. **Write to `02_Work/EXTRACTIONS.md`** — Structure the output as follows:

   ```markdown
   # Source Extractions

   Raw claims extracted from source files by /extract. Each claim is a verbatim quote or factual statement — no interpretation.

   This file is the input for /analyze. Do not edit manually.

   ---

   ## [source-folder/filename.md]
   - Type: [from metadata or _CONTEXT.md]
   - Date: [from metadata]
   - Participants: [if applicable]

   ### Raw Claims
   1. "[exact quote or factual claim from source]"
   2. "[another claim]"
   ...
   ```

   - If EXTRACTIONS.md already has content, **replace it entirely** with the new extraction. Each `/extract` run produces a fresh, complete extraction.
   - Preserve the header and description at the top of the file.

### Phase 4: Report

7. **Summarize to the user:**
   - Files processed (count, by subfolder).
   - Claims extracted per file.
   - Source organization issues found (list each one).
   - **Remind the user:** "Run `/analyze` to process extractions into insights."

### Phase 5: Write to MEMORY.md

8. **Append entry to `02_Work/MEMORY.md`:**
   ```markdown
   ## [YYYY-MM-DDTHH:MM] /extract
   - **Request:** [what the user asked]
   - **Actions:** [files scanned, organization issues found]
   - **Result:** [files processed, claims extracted count]
   - **Stats:**
     - `[folder-name]/`: N files, X claims
     - `[folder-name]/`: N files, X claims
     - **Total:** Y files processed, Z claims extracted
   - **Snapshot:** X source files · Y claims extracted · Z organization issues
   ```
