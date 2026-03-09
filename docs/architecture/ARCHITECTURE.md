# PD-Spec — Agent Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER                                      │
└───────────┬─────────────────────────────────┬───────────────────────┘
            │                                 │
            ▼                                 ▼
┌───────────────────────┐       ┌──────────────────────────────────┐
│   CLAUDE CODE (CLI)   │       │     LIVE RESEARCH APP (Browser)  │
│                       │       │                                  │
│  Full agent           │       │  ┌────────────┐ ┌─────────────┐ │
│  - Read, Write, Grep  │       │  │ Card Actions│ │ Agent View  │ │
│  - Glob, Bash, Edit   │       │  │ (no API)    │ │ (API key)   │ │
│  - Full filesystem    │       │  └──────┬──────┘ └──────┬──────┘ │
│  - ~$0/operation      │       │         │               │        │
└───────────┬───────────┘       └─────────┼───────────────┼────────┘
            │                             │               │
            │                             ▼               ▼
            │                   ┌──────────────┐ ┌────────────────┐
            │                   │ Express REST │ │  SSE Agent     │
            │                   │ scripts.js   │ │  claude.js     │
            │                   │              │ │                │
            │                   │ verify-      │ │ agent-         │
            │                   │ insight.sh   │ │ runtime.js     │
            │                   │ resolve-     │ │ - read_file    │
            │                   │ conflict.sh  │ │ - write_file   │
            │                   │              │ │ - list_files   │
            │                   │ COST: $0     │ │ - search_files │
            │                   └──────┬───────┘ │ - run_script   │
            │                          │         │ - ask_*        │
            │                          │         └───────┬────────┘
            │                          │                 │
            │                          │                 ▼
            │                          │        ┌────────────────┐
            │                          │        │  ANTHROPIC API │
            │                          │        │  claude-sonnet │
            │                          │        │                │
            │                          │        │ ~$0.10 Q&A     │
            │                          │        │ ~$1-2 pipeline │
            │                          │        └────────┬───────┘
            │                          │                 │
            ▼                          ▼                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FILESYSTEM (data)                            │
│                                                                     │
│  01_Sources/ ──────► /extract ──────► 02_Work/EXTRACTIONS.md       │
│  (read-only)              │                     │                   │
│                           │              /analyze                   │
│                           │                     │                   │
│                           │                     ▼                   │
│                           │         INSIGHTS_GRAPH.md               │
│                           │         CONFLICTS.md                    │
│                           │         RESEARCH_BRIEF.md               │
│                           │                     │                   │
│                           │               /spec                     │
│                           │                     │                   │
│                           │                     ▼                   │
│                           │         STRATEGIC_VISION.md             │
│                           │         PROPOSALS.md                    │
│                           │                     │                   │
│                           │              /ship [type]                │
│                           │                     │                   │
│                           │                     ▼                   │
│                           │         03_Outputs/ (PRD, personas...)  │
│                           │                                         │
│  Deterministic scripts:   │  WebSocket ◄── chokidar (file watcher) │
│  next-id.sh               │       │                                 │
│  count-statuses.sh        │       ▼                                 │
│  verify-insight.sh ◄──────┤  Browser auto-refreshes                 │
│  resolve-conflict.sh ◄────┘                                        │
└─────────────────────────────────────────────────────────────────────┘
```

## Agent Cost Comparison

| Agent | API Cost | Claude Code Cost | Capabilities |
|---|---|---|---|
| **Claude Code CLI** | $0 (included in plan) | Plan tokens | Full — Read, Write, Bash, Grep, Glob, Edit |
| **Card Actions** (browser) | $0 | $0 | Bash scripts only (verify, resolve) |
| **Agent Runtime** (browser) | $0.10–2.00/run | $0 | Limited — 5 filesystem + 3 interaction tools |
| **Bash scripts** | $0 | $0 | Deterministic, no LLM |

## Key Difference

Claude Code has powerful native tools (Grep, Glob, Edit). The Agent Runtime has limited tools (`list_files`, `read_file`, `search_files`, `write_file`, `run_script`) that force the LLM to make many iterative calls to achieve the same result — see OBS-W1-13 (`discover_sources` tool proposal) for the most impactful optimization.
