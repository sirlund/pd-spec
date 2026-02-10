# ProductLM Framework

## Overview

ProductLM is a structured methodology for technology consultants to take client engagements from initial brief to signed proposal. It enforces a 3-layer architecture (Sources → Work → Outputs) and an HTML-first document workflow optimized for AI-assisted delivery.

## Core Principles

1. **HTML First** — All documents are authored in HTML with embedded CSS. This ensures pixel-perfect control, print-ready output, and easy conversion to DOCX/PDF via Pandoc.
2. **Single Source of Truth** — `Propuesta_Master.html` is the canonical proposal. The presentation and exported documents derive from it, never the reverse.
3. **Sources Are Read-Only** — Files in `01_Sources/` capture raw client input and are never modified after initial capture. They serve as the audit trail.
4. **Log Everything** — All changes are logged in `CHANGELOG.md`. Every significant decision gets a dated entry.
5. **AI-Native Workflow** — The repo structure, file naming, and `CLAUDE.md` are designed so an AI agent can navigate, understand, and contribute to the project with minimal onboarding.

## The 3-Layer Architecture

### Layer 1: Sources (`01_Sources/`)

Raw inputs from the client. Emails, briefs, call notes, screenshots, reference documents. These files are **append-only** — once captured, they are never edited.

**Rules:**
- Name files with a numeric prefix for chronological order: `00_initial_brief.md`, `01_client_email.md`
- Store binary files (images, PDFs) here alongside their markdown summaries
- Never modify a source file after creation

### Layer 2: Work (`02_Work/`)

Active working documents. This is where analysis, strategy, and proposal drafting happen.

**Key files:**
- `Propuesta_Master.html` — The single source of truth for the proposal
- `BACKLOG.md` — Kanban-style task tracker
- `FRAMEWORK.md` — This file; methodology reference

**Rules:**
- `Propuesta_Master.html` must always reflect the latest agreed scope
- When the proposal changes, update the Master first, then sync downstream

### Layer 3: Outputs (`03_Outputs/`)

Client-facing deliverables. Generated from Work layer documents.

**Key files:**
- `Presentacion.html` — Slide deck derived from the Master proposal
- Generated `.docx` and `.pdf` files (via `make docx` / `make pdf`)

**Rules:**
- Outputs are **derived**, never authored directly
- If an output needs changes, update the source in `02_Work/` first
- Generated files (docx, pdf) are gitignored — regenerate them with `make`

## Sync Protocol

When the proposal content changes:

1. Update `02_Work/Propuesta_Master.html`
2. Sync relevant changes to `03_Outputs/Presentacion.html`
3. Log the change in `CHANGELOG.md`
4. Update `BACKLOG.md` if task status changed
5. Regenerate deliverables with `make all`

## Proposal Structure (Recommended)

A typical proposal contains these sections:

1. **Background & Initial Request** — What the client asked for
2. **Strategy** — Your recommended approach and any pivots from the original request
3. **Technical Scope** — What will be built, with enough detail for the client to evaluate
4. **Investment** — Cost estimate, typically as a range/band
5. **Roadmap** — Phases of work with rough timelines
6. **Conditions** — Infrastructure costs, IP ownership, payment terms
7. **Next Steps** — Clear call to action

## Deliverable Formats

| Format | Tool | Use Case |
|---|---|---|
| HTML | Browser | Review, iteration, screen sharing |
| DOCX | `make docx` | Client editing, comments, formal signature |
| PDF | `make pdf` | Final record, email attachment |
| Slides | Browser | Live presentation, screen sharing |
