# ProductLM

A structured template for technology consultants to take client engagements from initial brief to signed proposal. HTML-first documents, 3-layer architecture, and an AI-native workflow.

## Quick Start

```bash
# 1. Clone or use as GitHub template
git clone https://github.com/nlundin/ProductLM.git my-project
cd my-project

# 2. Run the interactive setup
chmod +x init.sh
./init.sh

# 3. Start working
#    - Capture the client brief in 01_Sources/00_initial_brief.md
#    - Draft your proposal in 02_Work/Propuesta_Master.html
#    - Build the presentation in 03_Outputs/Presentacion.html
```

## Project Structure

```
├── 01_Sources/              Raw client inputs (read-only after capture)
│   └── 00_initial_brief.md  Template for capturing the initial brief
├── 02_Work/                 Active working documents
│   ├── Propuesta_Master.html   THE source of truth for the proposal
│   ├── BACKLOG.md              Kanban task tracker
│   └── FRAMEWORK.md            Methodology documentation
├── 03_Outputs/              Client-facing deliverables
│   └── Presentacion.html       Slide deck (derived from proposal)
├── docs/
│   └── PANDOC_SETUP.md      How to install Pandoc for DOCX/PDF export
├── CLAUDE.md                Context file for AI agents
├── CHANGELOG.md             Dated log of changes
├── Makefile                 Generate DOCX/PDF deliverables
└── init.sh                  Interactive setup (runs once, self-deletes)
```

### Layer Rules

| Layer | Path | Rule |
|---|---|---|
| **Sources** | `01_Sources/` | Append-only. Never modify after creation. |
| **Work** | `02_Work/` | `Propuesta_Master.html` is the single source of truth. |
| **Outputs** | `03_Outputs/` | Derived from Work. Never author directly. |

## Generating Deliverables

Requires Pandoc and wkhtmltopdf. See [`docs/PANDOC_SETUP.md`](docs/PANDOC_SETUP.md) for installation.

```bash
make help    # List available targets
make docx    # HTML → DOCX
make pdf     # HTML → PDF
make all     # Generate all formats
make clean   # Remove generated files
```

## Sync Protocol

When proposal content changes:

1. Edit `02_Work/Propuesta_Master.html`
2. Sync to `03_Outputs/Presentacion.html`
3. Log in `CHANGELOG.md`
4. Update `02_Work/BACKLOG.md`
5. Regenerate with `make all`

## AI Agent Workflow

This repo is designed to work with AI coding agents. The entry point is [`CLAUDE.md`](CLAUDE.md), which contains:

- Project summary and current state
- Sources of truth table
- Architecture rules
- Common task instructions

Point your AI agent at `CLAUDE.md` and it will understand the repo structure, know which files to edit, and follow the sync protocol.

## Using as a GitHub Template

1. Click **"Use this template"** on GitHub
2. Name your new repo after your project
3. Clone it locally and run `./init.sh`

The init script replaces all `{{PLACEHOLDER}}` tokens with your project details, commits the result, and deletes itself.

## License

[MIT](LICENSE)
