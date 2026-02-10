# CLAUDE.md — AI Agent Context

## Project Summary

- **Project:** {{PROJECT_NAME}}
- **Client:** {{CLIENT_NAME}}
- **Consultant:** {{CONSULTANT_NAME}}
- **Objective:** {{PROJECT_OBJECTIVE}}
- **Date:** {{DATE}}

## Sources of Truth

| File | Role | Editable? |
|---|---|---|
| `01_Sources/00_initial_brief.md` | Raw client brief | No (append-only) |
| `02_Work/Propuesta_Master.html` | Canonical proposal | Yes (single source of truth) |
| `02_Work/BACKLOG.md` | Task tracker | Yes |
| `02_Work/FRAMEWORK.md` | Methodology docs | Reference only |
| `03_Outputs/Presentacion.html` | Slide deck | Yes (derived from Master) |
| `CHANGELOG.md` | Change log | Yes (append-only) |

## Architecture Rules

1. **HTML First** — All documents are HTML with embedded CSS. Never use external stylesheets.
2. **Sync Protocol** — When updating the proposal: edit `Propuesta_Master.html` first, then sync to `Presentacion.html`, then log in `CHANGELOG.md`.
3. **Sources Are Read-Only** — Never modify files in `01_Sources/`. They are the audit trail.
4. **Log Everything** — Every significant change gets a dated entry in `CHANGELOG.md`.
5. **Outputs Are Derived** — Never edit DOCX/PDF files directly. Regenerate them with `make`.

## Folder Structure

```
├── 01_Sources/          # Raw client inputs (read-only after capture)
├── 02_Work/             # Active working documents
│   ├── Propuesta_Master.html   # THE source of truth
│   ├── BACKLOG.md              # What to do next
│   └── FRAMEWORK.md            # How this methodology works
├── 03_Outputs/          # Client-facing deliverables
│   └── Presentacion.html       # Slide deck
├── CHANGELOG.md         # Dated log of all changes
└── Makefile             # Generate DOCX/PDF with `make`
```

## Common Tasks

- **Update proposal content:** Edit `02_Work/Propuesta_Master.html`, then sync to `03_Outputs/Presentacion.html`
- **Add a source document:** Create a new numbered file in `01_Sources/`
- **Generate deliverables:** Run `make docx` or `make pdf`
- **Check what needs doing:** Read `02_Work/BACKLOG.md`

## Current State

> Update this section as the project evolves.

- **Phase:** Init
- **Last updated:** {{DATE}}
- **Status:** Project initialized from ProductLM template. Awaiting initial client brief.
