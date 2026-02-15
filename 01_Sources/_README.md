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

## Rules

- **Never modify a source after creation.** Sources are immutable evidence.
- **One folder = one context.** Group files that share the same event, milestone, or theme.
- After adding sources, run `/extract` to pull raw claims, then `/analyze` to generate insights.
