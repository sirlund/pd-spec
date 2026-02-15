---
name: extract
description: Read and extract raw claims from source files in 01_Sources/. Writes structured extractions to 02_Work/EXTRACTIONS.md for /analyze to process.
user-invocable: true
allowed-tools: Read, Grep, Glob, Write, Bash
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
   - **HEIC images** (iPhone default) — Convert to JPG first using macOS native tool: `sips -s format jpeg "file.heic" --out /tmp/converted.jpg` (zero dependencies). Then read the resulting JPG as an image. Reference the original HEIC path in the extraction header, not the /tmp/ path.
   - **PDFs** — Read using the Read tool with `pages` parameter for large documents (>10 pages). Extract claims from text content.
   - **CSV/TSV** — Read directly as text. Extract data points, column headers, and notable values as claims.

   *Office files (DOCX, PPTX, XLSX) — convert-then-read:*

   **Strategy:** Try `markitdown` first (best output). If not installed, fall back to zero-dependency tools.

   ```
   Detection: Run `python3 -m markitdown --help` once at the start of Phase 2.
   If it succeeds → use markitdown for all office files.
   If it fails   → use fallbacks below.
   ```

   **With markitdown** (optional dependency — `pip install markitdown`):
   - Any office file: `python3 -m markitdown "file.ext" > /tmp/file.md`
   - Produces structured markdown with tables, lists, slide separators preserved.
   - Works for: DOCX, PPTX, XLSX, HTML, and more.

   **Without markitdown** (zero dependencies):
   - **DOCX** — `textutil -convert txt "file.docx" -output /tmp/file.txt` (macOS native). Then read the `.txt`.
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
     " > /tmp/file_slides.txt
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
     " > /tmp/file_data.txt
     ```

   *Unsupported formats (report, do not skip):*
   - **Video files** (MP4, WEBM, MOV, AVI) — Cannot be processed by the agent. Report each video file in the final summary as "unsupported format (video)" and suggest: "Export audio transcript or provide a `_CONTEXT.md` description for this file."
   - **Audio files** (MP3, WAV, M4A) — Cannot be processed. Same handling as video.

   *Fallback:*
   - **Other formats** — If a file cannot be read or converted, check `_CONTEXT.md` for descriptions. If no `_CONTEXT.md` exists, report the file as unreadable and suggest the user export it to PDF, CSV, or markdown.

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
   - **Source path rule:** The section header (`## [source-folder/filename.ext]`) must ALWAYS reference the original file path in `01_Sources/`, never a temporary conversion path (e.g., `/tmp/file.txt`). When a file is converted via textutil, markitdown, sips, or Python zipfile to a temporary file, the extraction header must use the original source filename and path.

### Phase 4: Report

7. **Summarize to the user:**
   - **Per-folder breakdown** — For EVERY folder discovered in Phase 1, report:
     - Folder name
     - Files processed (count and filenames)
     - Files NOT processed (count, filenames, and reason for each — unsupported format, conversion error, etc.)
     - Claims extracted (count)
   - If a folder from Phase 1 discovery has zero entries in this report, that is a bug — report it.
   - Source organization issues found (list each one).
   - **Total:** Files processed, files not processed, total claims extracted.
   - **Completeness check** — Compare the list of files in EXTRACTIONS.md (section headers) against the full file list from Phase 1 (Glob results). Every file from Phase 1 must appear in either EXTRACTIONS.md or the unprocessed list. If any files are missing from both, report the gap.
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
