---
name: extract
description: Read and extract raw claims from source files in 01_Sources/. Writes structured extractions to 02_Work/EXTRACTIONS.md for /analyze to process.
user-invocable: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
argument-hint: "[folder-name] [--full | --express | --heavy]"
---

# /extract — Source Reading & Claim Extraction

## What this skill does

Reads all source files in `01_Sources/`, extracts raw claims and factual statements, and writes them to `02_Work/EXTRACTIONS.md`. This is the reading step — no interpretation, no categorization. The output feeds into `/analyze` for insight extraction and cross-referencing.

## Instructions

### Phase 0: Session Resume

0. **Check project memory** — Read `02_Work/MEMORY.md` to understand the last known state (insight count, conflict count, last actions). Then compare against the current state of `02_Work/` files. If discrepancies are found, report them to the user before proceeding.

**Language** — Check `output_language` in `PROJECT.md`. If PROJECT.md is missing, default to `en` and suggest running `/kickoff`. Write all user-facing text in EXTRACTIONS.md in that language. System identifiers and structural labels stay in English.

### Phase 0b: Mode Detection

Detect extraction mode from flags:

| Flag | Mode | Behavior |
|---|---|---|
| (none) or `--express` | **Express** | Process only light files, skip heavy files (mark as `pending-heavy` in SOURCE_MAP) |
| `--full` | **Full** | Process all files (current behavior, uses two-pass for >40 files) |
| `--heavy` | **Heavy-only** | Process only files with `pending-heavy` status in SOURCE_MAP |

**Classification:**
- **Light files:** `.md`, `.txt`, `.csv`, `.png`, `.jpg`, `.jpeg`, `.heic` and any file < 1MB
- **Heavy files:** `.pdf`, `.docx`, `.pptx`, `.xlsx` or any file ≥ 5MB

Express mode is the default — it enables fast iteration on text and image sources while deferring expensive PDF/Office processing. Use `--full` to process everything, or `--heavy` after an express pass to pick up deferred files.

## MANDATORY RULE: NO EDITORIAL DECISIONS

The agent MUST NOT skip files based on:
- Assumed redundancy
- Subjective judgment about value or relevance
- Optimization attempts to reduce processing time

EVERY file discovered in Phase 1 MUST be:
(a) Processed with claims extracted, OR
(b) Reported as unprocessable with technical reason (unsupported format, conversion error, Read tool failure)

"Redundancy" is NOT a valid technical reason. If two files appear to contain similar information, BOTH must be processed. Deduplication happens in `/analyze`, not here.

### Phase 1: Discover Sources

1. **Discover sources** — Glob `01_Sources/` recursively for all files except `_SOURCE_TEMPLATE.md`, `_CONTEXT_TEMPLATE.md`, `_FIELD_NOTES_TEMPLATE.md`, `_CONTEXT.md`, `_README.md`, and `.gitkeep`. Sources may be organized in subfolders by milestone or category.

   If an argument was provided (e.g., `/extract benchmark-inicial`), only process files within `01_Sources/[argument]/`. If the folder doesn't exist, report the error and stop.

2. **Read folder context** — For each subfolder, check for a `_CONTEXT.md` file. If present:
   - Use it to understand non-markdown files (images, PDFs, spreadsheets, .txt) that can't carry their own metadata.
   - **Validate structure** — `_CONTEXT.md` must follow `01_Sources/_CONTEXT_TEMPLATE.md` structure (Type, Date, Participants, Context, Files table). Flag deviations.
   - **No insight derivation** — `_CONTEXT.md` describes files, it does NOT interpret or derive conclusions from them. If a `_CONTEXT.md` contains analysis, opinions, or derived insights (e.g., "this shows that users prefer X"), flag it as a source organization issue.
   - **AI-generated detection** — Check `_CONTEXT.md` for `Source Type: ai-generated`. If found, mark the entire folder as AI-generated. All files in this folder will be tagged during extraction (see Phase 2 AI tagging rule).

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

5. **File classification & mode filtering:**

   Classify all discovered files:
   - **Light files:** `.md`, `.txt`, `.csv`, `.png`, `.jpg`, `.jpeg`, `.heic` and any file < 1MB
   - **Heavy files:** `.pdf`, `.docx`, `.pptx`, `.xlsx` or any file ≥ 5MB

   **Apply mode filter (from Phase 0b):**
   - **Express mode:** Remove heavy files from processing queue. For each heavy file, write `pending-heavy` status to SOURCE_MAP.md (do NOT skip these silently — they must appear in the report). Log: `⚡ Express mode: {light_count} light files to process, {heavy_count} heavy files deferred (pending-heavy)`
   - **Heavy-only mode:** Read SOURCE_MAP.md, select ONLY files with status `pending-heavy`. If no pending-heavy files found, report "No heavy files pending — run /extract first" and stop.
   - **Full mode:** Process all files (no filtering).

6. **Batch detection (MANDATORY for >40 files in processing queue):**
   - Count files remaining in queue after mode filtering
   - **If count ≤ 40:** Process all files in single pass (standard mode)
   - **If count > 40:** ACTIVATE TWO-PASS BATCHING (mandatory)
     - Pass 1: Light files, batch size 10
     - Pass 2: Heavy files, batch size 1 (one at a time)
     - Total batches: ceil(light_count / 10) + heavy_count
     - Log: "⚠️ Large project detected: {count} files → TWO-PASS BATCHING ACTIVATED"
     - Log: "  Pass 1: {light_count} light files ({light_batches} batches of 10)"
     - Log: "  Pass 2: {heavy_count} heavy files (processing 1 at a time)"
     - Set batching flag for Phase 2
     - **CRITICAL: Process files DIRECTLY in main context (NO Task agents, NO parallelization)**

### Phase 1b: Compute Delta (Incremental Extraction)

**Purpose:** Only process new, modified, or failed files. Skip unchanged files to save time.

7. **Check for full re-extract flag** — If user passed `--full`, skip delta computation and process all files discovered in Phase 1 (after mode filtering).

8. **Read SOURCE_MAP.md** — Check if `02_Work/SOURCE_MAP.md` exists:
   - If missing → treat all files as NEW, proceed to Phase 2
   - If exists → parse the table to build a map of known files with their status and hash

**Validate SOURCE_MAP Integrity:**

Before trusting SOURCE_MAP.md entries, validate against EXTRACTIONS.md:
1. Read `02_Work/EXTRACTIONS.md`
2. For each entry in SOURCE_MAP with status=`processed`:
   - Check if corresponding `## [filename]` section exists in EXTRACTIONS.md
   - If missing: change status to `error` with reason "missing from EXTRACTIONS (possible interruption)"
3. Count corrupted entries
4. If corrupted entries found, report to user:
   ```
   ⚠️ SOURCE_MAP corruption detected: X files marked 'processed' but missing from EXTRACTIONS.md
   These files will be re-processed.
   ```
5. Add corrupted files to RETRY queue

9. **Compute file hashes** — For each file discovered in Phase 1, compute md5 hash:
   ```bash
   md5 -q "path/to/file"
   ```
   - On macOS, `md5` is native (zero deps)
   - Store in memory: `{file_path: hash}`

10. **Classify files** — Compare discovered files against SOURCE_MAP:
   - **NEW** — file not in SOURCE_MAP → process
   - **UNCHANGED** — file in map, hash matches → skip (preserve existing claims in EXTRACTIONS.md)
   - **MODIFIED** — file in map, hash differs → reprocess (replace section in EXTRACTIONS.md)
   - **RETRY** — file in map with status=`error` → reprocess
   - **PENDING-HEAVY** — file in map with status=`pending-heavy` → process only in Heavy-only or Full mode, skip in Express mode
   - **DELETED** — file in map but not discovered → remove section from EXTRACTIONS.md, mark as orphan

11. **Report delta to user** — Before processing, show:
   ```
   Delta computation complete:
   - NEW: 3 files (will process)
   - MODIFIED: 1 file (will reprocess)
   - UNCHANGED: 53 files (will skip)
   - RETRY: 0 files (errors from last run)
   - DELETED: 0 files (orphaned)

   Total to process: 4 files
   ```
   Wait for user confirmation before proceeding.

12. **Build processing queue** — Only files marked as NEW, MODIFIED, or RETRY go to Phase 2. In Heavy-only mode, also include PENDING-HEAVY files.

**REMOVED:** Large Project Strategy moved to mandatory batch detection (step 5)

### Phase 2: Read & Extract

**Silent execution rule:** Do not narrate between tool calls. Do not announce what you are about to do ("Now reading...", "Now updating..."). Execute tool calls directly. Only output text when a `Log:` directive explicitly specifies the message to output.

**Extraction Methodology:**

When processing a document, apply these criteria for claim extraction:

1. **Read full content** — Don't skip pages, sections, or files based on assumed redundancy
2. **Extract claims meeting these criteria:**
   - User needs, pain points, behaviors (direct quotes preferred)
   - Business constraints, success metrics, strategic decisions
   - Technical capabilities, limitations, architectural decisions
   - Competitive insights, market context
   - Verifiable facts (metrics, dates, contractual terms)
3. **Filter out:**
   - Repetitive statements already captured within the same file
   - Formatting artifacts (tables of contents, headers, footers, page numbers)
   - Vague or unsupported assertions ("it would be nice if...")
   - Obvious background adding no new information
4. **Target density:** ~3-5 claims/page (text documents), ~1-2/slide (presentations), ~1-3/photo (workshop images with visible text)

**This is NOT an excuse to skip files.** Extract strategic signal from ALL processed files. If a file appears to have low information density, still process it and extract what's available. Report actual claim counts, not zero because "nothing valuable found."

**AI-Generated Source Tagging:**

When processing a file from a folder marked as `ai-generated` (detected in Phase 1, step 2):
- **Section header:** Add warning tag: `## [folder/file.md] ⚠️ AI-GENERATED`
- **Each claim:** Append `[AI-SOURCE]` suffix to the claim text
- **Log:** `⚠️ AI-generated source — claims tagged for verification`
- Also check individual markdown files for `source_type: ai-generated` in their frontmatter metadata. Apply the same tagging if found, even if the folder's `_CONTEXT.md` doesn't flag it.

**Batch Processing Logic (MANDATORY for >40 files):**

**If batching was activated in step 5:**

**CRITICAL: All processing happens DIRECTLY in main context. NO Task agents. NO parallelization.**

**Two-Pass Strategy:**

**PASS 1: Light Files (md, txt, png, jpg < 1MB)**

For each Light batch (batch size = 10 files):
  1. **Select batch** — Take next 10 Light files from processing queue
  2. **Process batch directly** — For each of the 10 files in this batch:
     - Read and extract claims (step 12 logic below)
     - Accumulate extracted sections in memory
  3. **Write checkpoint after batch** — After all 10 files processed:
     - Append all 10 sections to EXTRACTIONS.md (single Edit operation)
     - Update SOURCE_MAP.md (10 rows via Edit tool)
     - Clean temp: `rm -rf 02_Work/_temp/*`
     - Log: "✓ Batch X/Y: 10 files, Z claims"
  4. **Continue to next Light batch** — Repeat until all Light files complete

**PASS 2: Heavy Files (pdf, DOCX/PPTX, files ≥ 5MB)**

**CRITICAL: Process ONE file at a time, write IMMEDIATELY after each.**

For each Heavy file (one at a time):
  1. **Select file** — Take next Heavy file from queue
  2. **Convert if needed:**
     - DOCX: `textutil -convert txt "file.docx" -output 02_Work/_temp/converted.txt`
     - PPTX: Python zipfile extraction to `02_Work/_temp/converted.txt`
     - PDF: Read directly with Read tool (no conversion)
  3. **Read and extract claims** — Process this single file (step 12 logic)
  4. **Write IMMEDIATELY** — After this single file processed:
     - Append section to EXTRACTIONS.md (Edit tool)
     - Update SOURCE_MAP.md (single row via Edit tool)
     - Clean temp: `rm -f 02_Work/_temp/*`
     - Log: "✓ [filename] → Z claims (X/N)"
  5. **Continue to next Heavy file** — Repeat until all Heavy files complete

**Why per-file writes for Heavy files:**
- Prevents context accumulation from large file reads
- Each write clears working memory
- Enables recovery via incremental mode (SOURCE_MAP tracks progress)
- If interrupted, already-processed files are preserved

**If batching was NOT activated (≤40 files):**

Process all files in single pass (step 12 below)

12. **Read each source in the processing queue** — For every file marked as NEW, MODIFIED, or RETRY (from Phase 1b), read it and extract raw claims and factual statements.

   **If Phase 1b was skipped** (--full flag or SOURCE_MAP missing), process all files from Phase 1.

   **MANDATORY: NEVER SKIP FILES.** Every file discovered in Phase 1 must be either (a) processed with claims extracted, or (b) explicitly listed in the final report as unprocessable with a reason. The agent must NOT silently omit files. If context window pressure builds, process files in batches (by folder) — write partial results to EXTRACTIONS.md between batches — but never skip. The Glob results from Phase 1 are the authoritative file list; every path in that list must appear in the output or the unprocessable report.

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

   **Non-markdown files** — The agent handles all common file types. Use the best available tool, with zero-dependency fallbacks.

   *Directly readable (Read tool):*
   - **Images** (PNG, JPG) — Read the image file directly. Extract visible text, diagrams, post-it notes, or annotations as claims. For workshop photos, capture spatial relationships (groupings, connections drawn between items).
   - **HEIC images** (iPhone default) — Convert to JPG first using macOS native tool: `sips -s format jpeg "file.heic" --out 02_Work/_temp/converted.jpg` (zero dependencies). Then read the resulting JPG as an image. Reference the original HEIC path in the extraction header, not the 02_Work/_temp/ path.

   **Image batching** — Images are token-expensive (each photo can consume 1-2k input tokens for visual reading). To reduce overhead, batch images from the same folder:
   1. **Group** all image files (PNG, JPG, converted HEIC→JPG) within a subfolder.
   2. **Read in batches of 3-4 images** per Read call (use multiple `file_path` calls in the same message). Provide shared context: "These are photos from [folder-name]. Extract visible text, post-it notes, diagrams, and spatial relationships from each image."
   3. **Extract claims for all images in the batch** in a single pass — write one `## [folder/image.ext]` section per image, but process them together so the agent sees the full visual context (e.g., a sequence of whiteboard photos that form a connected flow).
   4. **Shared context benefit** — workshop photos often form a series (whiteboard evolution, post-it clusters from the same session). Batching lets the agent understand cross-image connections (e.g., "photo 3 continues the flow from photo 1") that are invisible when processing one image at a time.
   5. **Still produce per-file sections** — each image gets its own `## [folder/filename.ext]` header in EXTRACTIONS.md, even if processed in a batch.

   **PDF Processing — MANDATORY APPROACH:**

   1. **MUST attempt `Read(pdf)` WITHOUT pages parameter first**
      - Extracts text from PDF (no poppler required)
      - Works for PDFs with text layer
      - This is the default approach for ALL PDFs

   2. **For large PDFs or projects with multiple PDFs >10MB:**
      - Process ONE PDF at a time
      - Write to EXTRACTIONS.md after EACH PDF
      - Update SOURCE_MAP.md after EACH PDF
      - Intermediate writes clear working memory and prevent request accumulation
      - NEVER read multiple large PDFs in same context without intermediate writes

   3. **For very large text content (>2000 lines):**
      - Use `Read(pdf, offset=0, limit=2000)` to read in chunks
      - Iterate with offset=2000, 4000, etc.

   4. **ONLY use pages parameter if PDF is image-only (no text layer):**
      - Requires poppler installation
      - Warn user: "PDF appears to be scanned images. Install poppler for OCR, or provide manual summary in _CONTEXT.md"

   5. **ONLY report as UNPROCESSABLE if:**
      - `Read(pdf)` returns error, OR
      - Single PDF exceeds 20MB request limit even in clean context
      - Log which attempts were made and their error messages

   - **CSV/TSV** — Read directly as text. Extract data points, column headers, and notable values as claims.

   *Office files (DOCX, PPTX, XLSX) — convert-then-read:*

   **Strategy:** Try `markitdown` first (best output). If not installed, fall back to zero-dependency tools.

   ```
   Detection: Run `python3 -m markitdown --help` once at the start of Phase 2.
   If it succeeds → use markitdown for all office files.
   If it fails   → use fallbacks below.
   ```

   **With markitdown** (optional dependency — `pip install markitdown`):
   - Any office file: `python3 -m markitdown "file.ext" > 02_Work/_temp/file.md`
   - Produces structured markdown with tables, lists, slide separators preserved.
   - Works for: DOCX, PPTX, XLSX, HTML, and more.

   **Without markitdown** (zero dependencies):
   - **DOCX** — `textutil -convert txt "file.docx" -output 02_Work/_temp/file.txt` (macOS native). Then read the `.txt`.
   - **PPTX** — Extract slide text via Python stdlib:
     ```bash
     python3 -c "
     import zipfile, xml.etree.ElementTree as ET
     with zipfile.ZipFile('file.pptx') as z:
       for name in sorted(z.namelist()):
         if name.startswith('ppt/slides/slide') and name.endswith('.xml'):
           root = ET.parse(z.open(name)).getroot()
           texts = [t.text for t in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t') if t.text]
           if texts: print(f'--- {name} ---'); print('\n'.join(texts))
     " > 02_Work/_temp/file_slides.txt
     ```
   - **XLSX** — Extract cell data via Python stdlib:
     ```bash
     python3 -c "
     import zipfile, xml.etree.ElementTree as ET
     with zipfile.ZipFile('file.xlsx') as z:
       ss = []; ns = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
       if 'xl/sharedStrings.xml' in z.namelist():
         root = ET.parse(z.open('xl/sharedStrings.xml')).getroot()
         ss = [''.join(t.text or '' for t in si.iter(ns+'t')) for si in root.iter(ns+'si')]
       for sheet in sorted(n for n in z.namelist() if n.startswith('xl/worksheets/sheet') and n.endswith('.xml')):
         print(f'--- {sheet} ---')
         root = ET.parse(z.open(sheet)).getroot()
         for row in root.iter(ns+'row'):
           cells = []
           for c in row.iter(ns+'c'):
             v = c.find(ns+'v')
             val = v.text if v is not None else ''
             if c.get('t') == 's' and val: val = ss[int(val)]
             cells.append(val)
           print('\t'.join(cells))
     " > 02_Work/_temp/file_data.txt
     ```

   *Unsupported formats (report, do not skip):*
   - **Video files** (MP4, WEBM, MOV, AVI) — Cannot be processed by the agent. Report each video file in the final summary as "unsupported format (video)" and suggest: "Export audio transcript or provide a `_CONTEXT.md` description for this file."
   - **Audio files** (MP3, WAV, M4A) — Cannot be processed. Same handling as video.

   *Fallback:*
   - **Other formats** — If a file cannot be read or converted, check `_CONTEXT.md` for descriptions. If no `_CONTEXT.md` exists, report the file as unreadable and suggest the user export it to PDF, CSV, or markdown.

   **Progress reporting** — Batch-level only, no per-file logs:

   - **After each batch (Pass 1) or file (Pass 2):** Log compact one-liner as specified above
   - **No narration between tool calls** — do not explain what you're about to do, just do it

### Phase 3: Write Extractions

12. **Update `02_Work/EXTRACTIONS.md`** — Apply changes based on delta:

   **If full re-extract** (--full flag or SOURCE_MAP missing):
   - Replace EXTRACTIONS.md entirely with new extraction (same as before)

   **If incremental extraction** (delta computed in Phase 1b):
   - **Read existing EXTRACTIONS.md** to understand current structure
   - **For NEW files** — append new sections to EXTRACTIONS.md
   - **For MODIFIED files** — use Edit tool to replace the existing `## [file-path]` section with updated claims
   - **For UNCHANGED files** — leave their sections untouched
   - **For DELETED files** — use Edit tool to remove the `## [file-path]` section entirely
   - **Preserve file order** — maintain alphabetical or folder-based ordering

   **Section format:**
   ```markdown
   ## [source-folder/filename.md]
   - Type: [from metadata or _CONTEXT.md]
   - Date: [from metadata]
   - Participants: [if applicable]
   - Extracted: [YYYY-MM-DDTHH:MM timestamp when this section was processed]

   ### Raw Claims
   1. "[exact quote or factual claim from source]"
   2. "[another claim]"
   ...
   ```

   **Timestamp rule:** Always include the `Extracted: YYYY-MM-DDTHH:MM` metadata line with the current timestamp when writing or updating a section. This enables `/analyze` incremental mode to skip unchanged extractions.

   - Preserve the header and description at the top of the file.
   - **Checkpoint after each folder.** Write (or append) results to EXTRACTIONS.md after completing each subfolder, not at the end. This ensures that if context compaction occurs mid-extraction, the already-processed folders are safely on disk. After compaction, read EXTRACTIONS.md to see what's already written, then continue with the remaining folders.
   - **Source path rule:** The section header (`## [source-folder/filename.ext]`) must ALWAYS reference the original file path in `01_Sources/`, never a temporary conversion path (e.g., `02_Work/_temp/file.txt`). When a file is converted via textutil, markitdown, sips, or Python zipfile to a temporary file, the extraction header must use the original source filename and path.

### Phase 4: Report (Validation First)

13. **Validate against disk BEFORE reporting:**

   BEFORE reporting numbers to the user:
   1. Re-read `02_Work/EXTRACTIONS.md` from disk
   2. Count sections: use Grep to count lines matching `^## \[` pattern
   3. Count claims: use Grep to count lines matching `^[0-9]+\.` pattern
   4. Build list of processed files from section headers
   5. Compare against Phase 1 discovery list (Glob results stored in memory)
   6. Identify discrepancies:
      - Files discovered but missing from EXTRACTIONS.md
      - Files in EXTRACTIONS.md but not in discovery list (orphans)

   If discrepancy detected:
   - Report: "⚠️ Warning: intended X files, EXTRACTIONS.md shows Y sections"
   - List missing files from Phase 1 discovery
   - Update SOURCE_MAP entries as 'error' for missing files with reason "not found in EXTRACTIONS.md"

14. **Summarize to the user** (using disk-validated numbers):
   **Compact format — mode-aware:**
   ```
   # Express mode:
   ✓ Express: N light files · Z claims · M heavy files pending
   [If unprocessable:] ⚠ X unprocessable: filename (reason), filename (reason)
   → Run /extract --heavy to process deferred files, or /analyze to continue with light files.

   # Heavy-only mode:
   ✓ Heavy pass: M files · Z claims
   [If unprocessable:] ⚠ X unprocessable: filename (reason), filename (reason)
   → Run /analyze to process claims into insights.

   # Full mode (or when no heavy files exist):
   ✓ Extraction complete: N files · Z claims [· X skipped unchanged]
   [If unprocessable:] ⚠ X unprocessable: filename (reason), filename (reason)
   [If org issues:] ⚠ X organization issues found (details in EXTRACTIONS.md)
   → Run /analyze to process claims into insights.
   ```
   - List unprocessable files individually (format, reason)
   - Do NOT list all processed files — totals only
   - **Completeness check** — Every file from Phase 1 must appear in either EXTRACTIONS.md or the unprocessable list. If any are missing from both, add them to the ⚠ line.

### Phase 4b: Update SOURCE_MAP

14. **Update `02_Work/SOURCE_MAP.md`** — Record the state of each file processed:

   **If SOURCE_MAP.md doesn't exist** — create it with the template header and table.

   **For each file processed:**
   - Extract format from file extension (md, png, pdf, docx, etc.)
   - Count claims extracted (number of lines in the `### Raw Claims` section)
   - Compute or reuse the md5 hash from Phase 1b
   - Set timestamp to current time (ISO format: YYYY-MM-DDTHH:MM)
   - Set status:
     - `processed` — file was successfully extracted
     - `pending-heavy` — heavy file deferred during express mode (waiting for `--heavy` or `--full` pass)
     - `error` — file failed to process (note reason in a comment or separate column)

   **Table format:**
   ```markdown
   | File | Format | Status | Claims | Hash | Last Processed |
   |---|---|---|---|---|---|
   | entrevistas/entrevista-01.md | md | processed | 45 | a1b2c3d4e5f6 | 2026-02-15T14:30 |
   | workshop/foto-01.jpg | jpg | processed | 8 | f6e5d4c3b2a1 | 2026-02-15T14:31 |
   | docs/brief.pdf | pdf | error | 0 | 1234567890ab | 2026-02-15T14:31 |
   ```

   **For DELETED files** (from Phase 1b):
   - Keep the row but change status to `orphan` — this indicates the file was processed before but is now missing from disk

   **For UNCHANGED files** (from Phase 1b):
   - Keep the existing row unchanged (no need to update)

   **Use Edit tool** to update individual rows or append new ones. Do not rewrite the entire table unless necessary.

### Phase 4c: Cleanup

15. **Clean temporary directory:**
   ```bash
   rm -rf 02_Work/_temp
   ```
   - Removes all converted files (DOCX→txt, PPTX→txt, HEIC→jpg)
   - Only runs after all batches complete (or single pass completes)
   - Prevents repo bloat with temporary conversion files

### Phase 5: Write to MEMORY.md

16. **Append entry to `02_Work/MEMORY.md`:**
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
