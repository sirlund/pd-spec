# 01_Sources — Raw Inputs

Put your research here. This is the only folder you need to touch directly.

## How to organize

Create subfolders by milestone or category:

```
01_Sources/
├── 2026-02-workshop-gerencia/
├── benchmark-inicial/
├── entrevistas-operadores/
```

## Adding files

- **Markdown files** → use `_SOURCE_TEMPLATE.md` for metadata (copy, rename, fill in).
- **Non-markdown files** (images, PDFs, spreadsheets, .txt) → add a `_CONTEXT.md` in the folder describing the files. Use `_CONTEXT_TEMPLATE.md` as reference.
- **Any format works** — .md, .png, .pdf, .xlsx, .txt, .docx

## Source readiness checklist

Before running `/extract`, verify every source has the minimum metadata the pipeline needs. Sources without metadata produce claims that are harder to trace, date, and verify.

| Check | Why it matters | How to fix |
|---|---|---|
| **Date present** | Temporal ordering, freshness tracking, conflict resolution | Add `Date:` in frontmatter. If exact date is unknown, use the best approximation (see below). |
| **Participants listed** | Speaker attribution, voice/authority tagging | Add `Participants:` in frontmatter or `_CONTEXT.md`. |
| **Source Type declared** | Triggers correct preprocessing (transcripts need speaker detection + sentence repair) | Add `Source Type:` — `transcript`, `interview`, `workshop`, `document`, `benchmark`, `field-note`. |
| **Authority set** | Controls evidentiary weight (`primary` vs `internal` vs `ai-generated`) | Add `Authority:` in frontmatter. Default is `primary` if omitted. |
| **Non-markdown files have `_CONTEXT.md`** | Agent can't read metadata from images, PDFs, spreadsheets | Create one per folder using `_CONTEXT_TEMPLATE.md`. |

### Handling undated sources

Not every source has a clear date. Use the best approximation available:

| Situation | What to write | Example |
|---|---|---|
| Exact date known | `YYYY-MM-DD` | `2026-02-19` |
| Only month known | First of the month | `2026-02-01` |
| Only quarter known | First of the quarter | `2026-01-01` (Q1) |
| Only year known | `YYYY-01-01` | `2026-01-01` |
| Completely unknown | `unknown` + explain in Context field | `Date: unknown` / `Context: Undated internal doc, likely from Q4 2025 based on content references.` |

The pipeline uses dates for temporal ordering and incremental processing. An approximate date is always better than no date — it places the source in the right relative position even if the exact day is off.

## Field notes — capturing what the transcript misses

Transcripts capture what was *said*, not what was *decided*. After key meetings (workshops, touchpoints, stakeholder reviews), write a `_FIELD_NOTES.md` in the same folder with:

- **Decisions made** that weren't stated as explicit declarations ("we'll go with X")
- **Framework definitions** that emerged from discussion but weren't formally dictated
- **Context and subtext** that the transcript doesn't convey (body language, enthusiasm, resistance)
- **Your interpretation** as researcher — what this meeting really means for the project

Use this format:

```markdown
---
type: field-note
date: YYYY-MM-DD
source: folder/original-transcript.md
observer: Your Name
confidence: high | medium | low | hunch
---

# Field Notes — Event Name

## Topic
Description of what was observed/decided...
```

**Confidence levels** affect how `/analyze` processes the claims:
- `high` / `medium` → normal insights (PENDING)
- `low` → insight created with review note
- `hunch` → logged as open question, not assertion

Field notes are first-class sources — they go through `/extract` and `/analyze` like any other file. The `observer` field ensures proper attribution.

## Rules

- **Never modify a source after creation.** Sources are immutable evidence.
- **One folder = one context.** Group files that share the same event, milestone, or theme.
- After adding sources, run `/extract` to pull raw claims, then `/analyze` to generate insights.
