# QA v2 Findings — 2026-02-15

> Pre-test and test findings for v4.0. Testing on test-timining branch with Sonnet.

## Summary

| ID | Type | Status | Summary |
|---|---|---|---|
| FIX-01 | Fix | FIXED | /extract can't read Office files |
| BUG-01 | Bug | FIXING | /extract skips 42/57 files silently, reported only 27 |
| BUG-02 | Bug | NOTED | /extract fills context window, forces mid-skill compaction |
| BUG-03 | Bug | CONFIRMED | Claim count 862 real vs 476 reported (post-compaction) |
| BUG-04 | Bug | NOTED | Entire folder "Propuesta ruta/" omitted from report |
| BUG-05 | Bug | NOTED | 3 PDFs "not readable" — Read tool should handle them |
| BUG-06 | Bug | NOTED | HEIC images + video files unsupported, not reported |
| PERF-01 | Perf | NOTED | 24+ min / 30k tokens for 60 files (linear processing) |
| ARCH-01 | Arch | PENDING | Project settings in CLAUDE.md cause merge conflicts |
| ARCH-02 | Arch | PROPOSED | SOURCE_MAP.md — state management for /extract |

---

## Pre-test fixes (applied)

### FIX-01: /extract can't read Office files
- **Problem:** /extract only had Read, Grep, Glob, Write — couldn't open DOCX, PPTX, XLSX
- **Fix:** Added Bash to allowed-tools. Strategy: try markitdown (optional), fallback to textutil (DOCX) + Python zipfile (PPTX/XLSX). Zero dependencies required.
- **Commit:** `6c48643` on main
- **Status:** FIXED

## Test findings

### BUG-01: /extract skips files silently — CRITICAL
- **Problem:** Agent skips files without reporting them, far beyond what it acknowledges. Skill says "Include ALL claims" but doesn't explicitly forbid skipping or require a complete manifest check.
- **Observed (verified by manual audit):**
  - **57 actual source files** in 01_Sources/ (excluding templates/gitkeep)
  - **15 processed** (15 sections in EXTRACTIONS.md)
  - **42 not processed** — agent reported only 27 unprocessed, silently omitted 15 more
  - Breakdown of unprocessed:
    - Workshop 1/: 24 images (22 JPG + 5 HEIC, only 3 processed) — agent reported "23 fotos"
    - Antecedentes/: 10 files skipped (2 PDFs, 1 PPTX, 1 video 152MB, 6 MP4 + 1 DOCX in subfolder) — **agent reported 0 skipped from this folder**
    - Visión Futuro CORE/: 3 PDFs (11-18MB) — agent reported these
    - Propuesta ruta/: 1 PPTX (20MB) — agent reported as "error"
    - Root level: 2 PNG + 1 PPTX (34.6MB) — **agent didn't report these**
    - entrevistas operaciones/: 1 PNG — **agent didn't report this**
- **Root cause:** (1) No explicit "never skip" instruction. (2) No manifest/checklist to verify completeness. (3) Agent optimizes for speed. (4) Post-compaction state reconstruction loses track of what was skipped.
- **Fix:** Add explicit no-skip rule + mandatory completeness check against glob results. If too many files, process in batches — never skip. SOURCE_MAP.md (ARCH-02) would make skipping detectable.
- **Status:** FIXING

### BUG-02: /extract fills context window — forces mid-skill compaction
- **Problem:** /extract processing 60 files generated so much context (file reads + 476 claims + multimodal image processing) that it overflowed the context window, triggering automatic /compact mid-skill.
- **Observed:** Sonnet session compacted at 24m 38s. Post-compaction, agent lost intermediate state and had to reconstruct from compact summary. Also hit Write tool error ("File has not been read yet") because the pre-compaction file read was lost.
- **Root cause:** Single-agent processes entire extraction in one context window. No chunking or checkpointing between folders.
- **Impact:** Post-compaction agent may lose extracted claims, skip files it already processed, or fail to write. Unreliable for large projects.
- **Relation:** Compounds BUG-01 and PERF-01. Parallel /extract (idea #11) would solve all three — each folder in its own context window.
- **Status:** NOTED (future improvement)

### BUG-03: Claim count inconsistency — post-compaction data integrity loss
- **Problem:** /extract final report shows per-folder claim totals that don't match the reported grand total.
- **Observed:** Per-folder sum = 862 claims (157 + 26 + 241 + 100 + 338). Reported total = 476 claims. Difference: 386 claims.
- **Verified:** Actual claims in EXTRACTIONS.md = **862**. The per-folder numbers are correct; the 476 total is wrong. Likely a pre-compaction count that wasn't updated after the full write.
- **Root cause:** The 476 total was calculated pre-compaction. Post-compaction, the agent wrote more claims but carried forward the stale total. MEMORY.md also records 476 (propagated error).
- **Impact:** User cannot trust the extraction report. MEMORY.md snapshot is wrong. Any downstream skill reading MEMORY.md inherits the bad count.
- **Relation:** Direct consequence of BUG-02 (context overflow).
- **Status:** CONFIRMED

### BUG-04: Entire folder "Propuesta ruta/" omitted from extraction report
- **Problem:** The folder `01_Sources/Propuesta ruta/` exists and contains at least 1 PPTX file, but does not appear in the extraction report at all — neither in processed nor unprocessed sections.
- **Observed:** Report lists 5 folders (entrevistas operaciones, root, Workshop 1, Visión Futuro CORE, Antecedentes). Propuesta ruta/ is absent.
- **Root cause:** Likely lost during compaction — the folder may have been partially processed pre-compaction but dropped from the reconstructed state.
- **Relation:** Compounds BUG-01 (skipping) and BUG-02 (compaction). The agent silently skipped an entire folder without flagging it.
- **Status:** NOTED

### BUG-05: 3 PDFs reported as "not readable" — Read tool should handle PDFs
- **Problem:** /extract reported 3 PDFs in `Visión Futuro _CORE_/` as "no fueron legibles con las herramientas disponibles". The Read tool natively supports PDF reading with the `pages` parameter.
- **Observed:** Agent didn't attempt or failed to use Read tool on PDFs. The /extract SKILL.md explicitly says "PDFs — Read using the Read tool with pages parameter for large documents."
- **Root cause:** Either (a) agent didn't follow the skill instruction, (b) these specific PDFs are image-only scans without text layer, or (c) post-compaction the agent lost the PDF reading strategy.
- **Fix:** Verify if PDFs have a text layer. If image-only, add OCR fallback guidance to skill. If text PDFs, this is a skill-following failure.
- **Status:** NOTED

### BUG-06: Unsupported file formats not handled — HEIC images, video files
- **Problem:** /extract SKILL.md doesn't mention HEIC (iPhone raw photos) or video formats (MP4, WEBM). Agent encounters them and silently skips without reporting.
- **Observed:**
  - **5 HEIC images** in Workshop 1/ — not processed, not reported. HEIC is Apple's default photo format; users dragging photos from iPhone will have these.
  - **7 MP4 videos** (9-149MB) in Antecedentes/ + subfolder — not processed, not reported. These are event recordings and case study demos.
  - **1 WEBM video** (152MB) in Antecedentes/ — not processed, not reported.
- **Root cause:** SKILL.md only lists PNG, JPG, PDF, CSV, DOCX, PPTX, XLSX. No guidance for HEIC or video.
- **Proposed handling:**
  - **HEIC:** Convert to JPG via `sips -s format jpeg "file.heic" --out /tmp/file.jpg` (macOS native, zero deps). Then read as image.
  - **Video:** Genuinely unprocessable by the agent (no transcription tool). Should be explicitly listed as unsupported format. Agent must report them and suggest: "Export audio transcript or provide a _CONTEXT.md description."
- **Impact:** Users with iPhone photos or event recordings will have gaps they don't know about.
- **Status:** NOTED

### PERF-01: /extract performance — 24+ min for 60 files
- **Problem:** /extract processes files linearly (read → LLM extract → next). For 60 files (including 26 workshop photos, Office docs, PDFs), extraction took 24+ minutes and 29.7k tokens, triggering context compaction mid-process.
- **Observed:** Sonnet session hit 24m 38s before compaction. Images are especially token-expensive (visual reading). Linear processing means no parallelism.
- **Root cause:** Sequential file processing + multimodal image reading is slow and token-heavy.
- **Impact:** Projects with 100+ files will be inviable without mitigation. BUG-01 fix (process ALL files, no skipping) will make this worse.
- **Mitigation:** Idea #11 (parallel /extract by folder) — already designed in qa-session-ideas.md. Split by folder, each agent writes to separate file, merge step concatenates.
- **Priority:** Medium now, High after BUG-01 fix
- **Status:** NOTED (future improvement)

### ARCH-01: Project settings in CLAUDE.md cause merge conflicts
- **Problem:** CLAUDE.md has both engine config (versioned, changes per release) and project settings (set by /kickoff, project-specific). Every merge from main to a project branch conflicts.
- **Observed:** Conflict on every main → test-timining merge in CLAUDE.md Project Settings section.
- **Proposed fix:** Separate into `CLAUDE.md` (engine only) + `PROJECT.md` (settings only). /kickoff writes to PROJECT.md. All skills read settings from PROJECT.md.
- **Impact:** /kickoff, all skills that read output_language/project_name, CLAUDE.md template
- **Status:** PENDING

### ARCH-02: /extract lacks source state management — needs SOURCE_MAP.md
- **Problem:** /extract is stateless and destructive. Every run replaces EXTRACTIONS.md entirely, reprocessing all files from scratch. No memory of what was already processed, what failed, or what's new.
- **Impact:** Causes or amplifies BUG-01 (no checklist to enforce completeness), BUG-02 (reprocesses everything = context overflow), BUG-03 (no persistent count source of truth), BUG-04 (no manifest to detect missing folders), BUG-05 (no error log to retry), PERF-01 (reprocesses unchanged files).
- **Proposed fix:** Add `02_Work/SOURCE_MAP.md` — a per-file state registry maintained by /extract.
- **Design:**
  - **Two files, mutual recovery:** SOURCE_MAP.md (state) + EXTRACTIONS.md (claims). If either is deleted, the other can reconstruct it. If both deleted, equivalent to today — full re-extract.
  - **Per-file tracking:** file path, format, status (pending/processed/error), claim count, md5 hash, last processed timestamp.
  - **Change detection:** md5 hash (`md5 -q file` — macOS native, zero deps). New file = not in map. Modified = hash differs. Deleted = in map but not on disk.
  - **Incremental flow:** On subsequent runs, only process new + modified + previous errors. Append/replace sections in EXTRACTIONS.md using `## [folder/file]` headers as delimiters.
  - **Recovery matrix:**
    - EXTRACTIONS.md deleted → SOURCE_MAP knows what was processed → informed re-extract
    - SOURCE_MAP.md deleted → parse EXTRACTIONS.md headers → reconstruct map
    - Both deleted → full re-extract from scratch (same as today)
    - Source file deleted → SOURCE_MAP marks orphan → remove section from EXTRACTIONS
    - Source file added → SOURCE_MAP detects new → process and append
    - Source file modified → hash mismatch → reprocess and replace section
  - **Single file preferred** over multi-file (_extractions/*.md) to reduce fragility and keep the same mental model users already have.
- **Status:** PROPOSED
