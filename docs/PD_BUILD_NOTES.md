# PD-Build — Design Notes (DEPRECATED)

> **DEPRECATED:** These notes have been migrated to the PD-Build repo (`/Users/nlundin/Dev/repos/pd-build/docs/`). The canonical version lives there. This file is kept as historical reference only — do not update it. Delete when no longer needed.

> Original context: Philosophy, architecture, and implementation roadmap for PD-Build.
> Captured during PD-Spec v3.0 iteration (2025-02-13).

## Philosophy: Why PD-Build Exists

Designers are increasingly "vibe coding" — prompting LLMs to generate interfaces directly. The results are fast but chaotic: random Tailwind classes, no design consistency, no connection to research or business decisions.

**PD-OS orders the chaos.** PD-Spec validates what to build and why. PD-Build ensures that when an LLM generates output — whether a throwaway prototype or a production PR — it uses coherent design definitions grounded in validated research.

**PD-Build is not a design system library.** It's the engine that guarantees visual coherence when AI agents generate output. The consumer isn't just Style Dictionary or a Figma plugin — it's Claude, Cursor, GPT, and any future AI that's generating interface from prompts.

### Two Audiences for Definitions

| Audience | What it needs | Format |
|---|---|---|
| **Compilers** (Style Dictionary, plugins) | Values: `color.primary: #0055FF` | `tokens.json` (W3C standard) |
| **AI agents** (Cursor, Claude Code) | Values + context + rules: "Destructive actions use high contrast because users are 50+ `[IG-22]`. Always pair with confirmation step." | `.cursorrules`, system prompts, markdown with reasoning |

An LLM that reads `#CC0000` produces generic code. An LLM that reads `#CC0000 — high contrast for users who struggle with visual hierarchy [IG-22]` produces code that respects the design intent.

### Discovery vs Production: One Set of Definitions, Two Fidelity Levels

| | Discovery | Production |
|---|---|---|
| **Purpose** | Prototype, explore, Design Sprints | Real features, PRs, production code |
| **Input** | PD-Spec definitions | PD-Spec definitions + stack config |
| **Output** | tokens.json, patterns.md (design intent) | tokens.json + .cursorrules + coding rules |
| **Needs stack context?** | No | Yes (framework, lang, architecture, linting) |
| **Consumer** | Designer + AI agent prototyping | AI agent (Cursor/Claude) writing code |
| **Validation** | "Does this make design sense?" | "Does this compile, pass lint, follow arch?" |

The definitions are the same. Discovery uses them as guidance; Production uses them as law. A designer vibe-coding a prototype in Cursor uses the same tokens as the dev writing the final component — the difference is enforcement, not the source of truth.

## What PD-Build Is

The implementation layer of ProductDesign OS. It lives inside the product repository (like Storybook) and transforms PD-Spec's strategic decisions into tool-agnostic design system artifacts.

```
PD-Spec (strategy)                        PD-Build (implementation)
research → insights → conflicts →         user stories → tokens.json
system map → user stories [US-XX]  →      → components.yaml
                                          → patterns.md
```

The boundary is the `[US-XX]` user story. Everything left of it is PD-Spec. Everything right is PD-Build.

## Core Concept: Headless Design System

The central idea from Gemini's iterations: the Design System is **data**, not files. Like a headless CMS separates content from presentation, a headless DS separates design *intent* (tokens, specs, rules) from design *implementation* (CSS, Figma, Swift).

```
Traditional DS:    Figma file → dev reads it → writes CSS → hopes it matches
Headless DS:       tokens.json → compiler → CSS / Tailwind / Swift / Flutter / Figma plugin
```

PD-Build's `02_Definitions/` is the headless layer. It describes *what* the design system is (colors, spacing, component states, accessibility targets) in tool-agnostic formats. `03_Drivers/` is where it gets a "head" — compiled into platform-specific code.

**Why this matters:** One source of truth, multiple consumers. The same `tokens.json` feeds Storybook, Figma (via plugin), iOS (via ThemeData), and Flutter — without manual sync. When research changes the tokens (via PD-Spec → user stories → `/systemize`), every platform updates from the same source.

**Why headless is mandatory for AI agents:** An AI doesn't "see" pixels — it processes data structures and logic. If the DS lives in Figma (visual), it's opaque to the agent. If it lives in JSON (semantic), it's manipulable. A headless DS is essentially **Infrastructure as Code applied to design** — the agent reads the JSON, validates consistency, proposes changes to the data structure, and the "heads" (CSS, Figma, Swift) are just compilation targets.

### Beyond Tokens: Component Schemas and Patterns

Tokens (colors, spacing, typography) are values. But design decisions also include **relationships** — layouts, composition rules, interaction patterns. These need a higher abstraction level than flat key-value pairs.

```json
{
  "pattern": "DashboardShell",
  "rules": {
    "layout_strategy": "css-grid",
    "areas": ["sidebar", "header", "main"],
    "constraints": {
      "sidebar": { "width": "fixed", "value": "{size.layout.sidebar}" },
      "main": { "overflow": "scroll", "padding": "{spacing.container.inset}" }
    }
  }
}
```

The agent reads this and understands the rule: "The sidebar has fixed width." It doesn't need to see the CSS. This is the path from "design tokens" to "design system as data."

### Known Limitations

- **Gestalt and visual context.** The agent can validate WCAG contrast mathematically, but it can't "feel" that a layout is visually unbalanced. Spatial intuition is hard to encode in rules.
- **Exceptions vs. rules.** Real-world design breaks the grid for marketing impact or visual emphasis. Encoding "permitted exceptions" into JSON grows complexity exponentially.
- **Representation ceiling.** A button is easy to define. A complex organism (data table with filters, sorting, empty states) can produce JSON so complex it becomes unreadable — defeating the purpose of an accessible source of truth.
- **Bidirectional sync.** If a designer adjusts an auto-layout in Figma manually, reverse-engineering that visual change back to the logical rule in JSON is technically hard.

## The Contract Format

The contract between PD-Spec and PD-Build evolves with maturity:

### v0.1: Direct Read (today)
PD-Spec doesn't produce user stories yet (BL-03 is proposed, not implemented). For v0.1, PD-Build reads PD-Spec's Work layer directly:
- `02_Work/SYSTEM_MAP.md` — product architecture and module decisions
- `02_Work/INSIGHTS_GRAPH.md` — verified insights with source refs

This is pragmatic — don't formalize a contract between two repos when one doesn't produce it yet.

### v0.2+: Formal Contract (after BL-03)
Once PD-Spec implements `/ship user-stories` (BL-03), PD-Build migrates to consuming `USER_STORIES.html`. Each story carries:

- `[US-XX]` ID
- JTBD frame: When [situation], I want to [motivation], so I can [outcome]
- Insight refs: `[IG-XX]` traceability back to research
- Acceptance criteria: derived from PD-Spec's SYSTEM_MAP
- Priority: derived from conflict resolution

This replaces the now-obsolete `DESIGN_BRIEF.md` with 4 blocks (`[INTENT]`, `[LOGIC_RULES]`, `[DATA_EVIDENCE]`, `[USER_FLOW]`) that was in earlier PD-OS docs.

## Core Concept: Research-Reactive Design System

The key idea from the Gemini v2.5/v3.0 iterations: the design system is not static. It reacts to research findings via the user stories contract.

**Flow:**
1. PD-Spec produces: `[IG-22] Users over 50 struggle with visual hierarchy in critical flows`
2. PD-Spec ships: `[US-07] When users need to cancel a subscription [IG-22], I want destructive actions to have high contrast, so they can identify critical buttons without strain.`
3. PD-Build reads `[US-07]` and generates:
   - Token: `color.action.destructive` (high contrast red)
   - Component spec: `Button` variant `destructive` with enforced contrast ratio
   - Pattern: "Destructive actions always use `color.action.destructive` + confirmation step"

The design system updates when the research updates — not when a designer remembers to sync Figma.

## Proposed PD-Build Outputs

From the Gemini iterations, filtered to what actually belongs here:

| Output | Format | What it defines |
|---|---|---|
| `tokens.json` | W3C Design Tokens standard | Colors, typography, spacing, border-radius — semantic, not implementation |
| `components.yaml` | Functional specs | Component states, variants, accessibility requirements — not code |
| `patterns.md` | Composition rules | "Forms always use inline validation", "Modals require explicit dismiss" |

These are **definitions**, not implementations. A Storybook plugin, Figma plugin, or CSS generator consumes them downstream.

### Extended Outputs (from v2.5)

Gemini's v2.5 proposed additional artifacts that belong here:

| Output | Format | What it defines | When to generate |
|---|---|---|---|
| `accessibility.md` | WCAG targets | Contrast ratios, ARIA requirements, keyboard nav rules — derived from user constraints | When user stories reference accessibility needs |
| `qa-criteria.md` | Checklist | Design QA for devs — visual specs to verify against | Before handoff to dev team |
| `voice-tone.md` | Guidelines | UX writing rules, microcopy patterns, error message tone — derived from brand/user insights | When sources include brand or content research |
| `ui-schemas.md` | Structural wireframes | Text-based content maps — "A primary button belongs here" without visual mockup | When user stories define flows |
| `prototype-spec.md` | Build instructions | What to prototype and test — scope, screens, flows | Design Sprint methodology |

**Important:** These are all *definitions*. `accessibility.md` says "contrast ratio must be 4.5:1" — it doesn't test it. `qa-criteria.md` says "verify the button has a hover state" — it doesn't write the CSS. The implementation toolchain (Storybook, Figma, testing frameworks) consumes these.

## Proposed PD-Build Skills

### `/systemize` — The Definitions Generator

The skill Gemini proposed for PD-Spec, repositioned correctly:

- **Reads:** User stories from PD-Spec (`[US-XX]` with `[IG-XX]` refs)
- **Writes:** `tokens.json`, `components.yaml`, `patterns.md`
- **Logic:** Translates user-need constraints into design system decisions
  - `[IG-XX] users are 50+` → larger base font, higher contrast ratios
  - `[IG-XX] users work in low-light` → dark mode as default, reduced blue light tokens
  - `[IG-XX] users multitask on mobile` → touch targets ≥ 48px, simplified navigation patterns

**Does NOT generate:** React components, CSS files, Figma binaries, or visual mockups. It defines the *intent*; the dev toolchain generates the *implementation*.

### `/compile` — The Drivers Generator (downstream of `/systemize`)

Transforms definitions into platform-specific output. This is where definitions become implementation:

- **Reads:** `02_Definitions/` (tokens.json, components.yaml)
- **Writes:** `03_Drivers/` (CSS custom properties, Tailwind config, Swift ThemeData, Flutter theme, SCSS variables)
- **Logic:** Same semantic tokens, different platform targets

This is the only skill in the entire PD-OS pipeline that produces actual code.

## Research-Reactive Examples (from v2.5)

Gemini's v2.5 proposed specific examples of how research findings propagate through PD-Build. These illustrate the "living design system" concept:

| PD-Spec insight | PD-Spec user story | PD-Build token change | Why |
|---|---|---|---|
| Users are 50+ | Increase text legibility | `font.size.base: 18px`, `color.contrast.min: 4.5` | Accessibility-driven |
| App feels slow | Reduce perceived weight | Remove `shadow.complex`, `blur.backdrop` tokens | Performance-driven |
| Brand feels cold | Warm the interface | Increase `border.radius.base`, shift palette warmer | Brand-driven |
| Users can't find cancel | Improve destructive action hierarchy | Add `color.action.destructive` (high contrast red) | Usability-driven |
| Users multitask on mobile | Increase touch targets | `spacing.touch.min: 48px`, simplify nav patterns | Context-driven |
| Error messages confuse users | Clarify error states | Update `voice-tone.md` error templates, add `color.feedback.error` | Content-driven |

Each row traces back through the full pipeline: source → `[IG-XX]` → `[US-XX]` → token/spec change. Traceability doesn't stop at the strategy layer.

## Methodology-Aware Generation (from v2.5)

Gemini proposed that PD-Build should adapt its outputs based on the project methodology. While PD-Spec rejected methodology modes (the pipeline is source-driven), PD-Build could use project context to prioritize *which* definitions to generate first:

| Project context | PD-Build priority | Skip for now |
|---|---|---|
| Design Sprint (5-day validation) | `prototype-spec.md`, `ui-schemas.md` | Full tokens, comprehensive QA |
| MVP launch | `tokens.json`, `components.yaml`, `qa-criteria.md` | Voice-tone, accessibility deep-dive |
| System audit / rescue | `accessibility.md`, `qa-criteria.md` | New tokens, new patterns |
| Scale / mature product | Everything — full definitions suite | Nothing |

This isn't a config file — it's the designer's judgment on what to generate first. `/systemize tokens` vs `/systemize prototype-spec` vs `/systemize all`.

## Architecture Sketch

```
product-repo/
├── pd-build/                     (like Storybook — lives in the product repo)
│   ├── .claude/skills/
│   │   ├── systemize/SKILL.md    reads contract, generates definitions
│   │   └── compile/SKILL.md      reads definitions, generates drivers
│   ├── 01_Contract/              user stories imported from PD-Spec
│   │   └── USER_STORIES.html     [US-XX] with [IG-XX] refs
│   ├── 02_Definitions/           tool-agnostic specs
│   │   ├── tokens.json           W3C design tokens
│   │   ├── components.yaml       functional component specs
│   │   ├── patterns.md           composition rules
│   │   ├── accessibility.md      WCAG targets
│   │   ├── voice-tone.md         UX writing guidelines
│   │   └── qa-criteria.md        design QA checklist
│   └── 03_Drivers/               platform-specific output
│       ├── css/variables.css     CSS custom properties
│       ├── tailwind/config.js    Tailwind theme
│       ├── swift/Theme.swift     iOS theme
│       └── flutter/theme.dart    Flutter ThemeData
├── src/                          product source code
└── ...
```

**The 3-layer pattern repeats:** Contract (input) → Definitions (brain) → Drivers (output). Same architecture as PD-Spec's Sources → Work → Outputs, applied to implementation.

## Core Concept: Assisted Governance (Gobernanza Asistida)

The agent is not an enforcer that blocks the designer. It's a **senior dev reviewing your PR** — it flags inconsistencies, explains the rule you're breaking, but lets you override with a reason. The model has three levels of friction:

### Level 1: Compliant (Silent Execution)
The request uses existing tokens and patterns. Agent executes without questions.

> "Create a confirmation modal." → Agent finds `Modal/Confirm` pattern, uses defined tokens. Zero friction.

### Level 2: Deviation (Warning + Override)
The request breaks a rule but isn't a structural error. Agent warns, explains the rule, offers alternatives, but executes if the human insists.

> "Make the Cancel button red to stand out."
> Agent: "The system defines secondary actions in `neutral-500`. Red (`danger-600`) implies destructive action. Options: (1) Use `neutral-500` per system rules, (2) Override locally with reason. Which one?"

If the human overrides, the agent executes **and registers the deviation** (see Design Debt below).

### Level 3: System Mutation (Confirmation Required)
The request changes a base rule that cascades across the entire system (e.g., changing the primary color globally). Agent simulates impact and requires explicit confirmation before proceeding.

> "Change the primary color to this new brand blue."
> Agent: "This affects 47 components and 12 patterns. Here's the cascade impact: [list]. Confirm?"

### Why This Model Works
- **Not a police state.** Blocking overrides makes the tool useless for edge cases, marketing campaigns, and creative experimentation.
- **Documents decisions.** Like a dev adding `// TODO: refactor this hardcoded value`, the system keeps the DS clean by marking exceptions.
- **Educates.** Designers who don't know the full system learn the rules through the agent's warnings — like learning code conventions through code review.

## Design Debt Registry

When the designer overrides a system rule, PD-Build doesn't just execute — it logs the deviation in a `design-debt.json` (or equivalent) tracking file:

```json
{
  "component_id": "btn_cta_marketing",
  "base_pattern": "button.primary",
  "status": "divergent",
  "overrides": {
    "background_color": "#FF5733",
    "border_radius": "0px"
  },
  "governance_log": {
    "author": "Nicolas",
    "reason": "CyberMonday campaign — explicit request",
    "timestamp": "2026-02-13T10:00:00Z",
    "severity": "medium"
  }
}
```

This enables periodic cleanup: "List all components that don't use standard tokens and suggest whether to create new tokens or refactor them."

### Pattern Promotion (Bottom-Up Evolution)

The most powerful aspect of tracked debt: **emergent patterns surface automatically**.

If the agent detects the same override 3+ times across different flows, it proactively suggests:

> "You've used 32px padding in 4 containers, overriding the 24px rule each time. Should I officialize this as a new token `spacing.xl` or a variant `container.loose`?"

This is how the design system evolves from usage data, not from top-down committee decisions. Repeated deviations become candidates for new rules. The system grows organically while maintaining traceability — every new token can trace back to the overrides that justified its creation.

## PD-Build Boundaries

Mirroring PD-Spec's boundaries — what PD-Build is NOT:

- **Not a component library.** It defines `Button` must have a `destructive` variant with `color.action.destructive`. It does NOT write `Button.tsx` or `button.scss`. The dev team writes the component; PD-Build gives them the spec.
- **Not a Figma plugin.** It outputs JSON that a Figma plugin *could* consume, but it doesn't manipulate Figma files directly.
- **Not a testing framework.** `qa-criteria.md` tells you what to test. It doesn't run Playwright or Chromatic.
- **Not a substitute for design judgment.** The designer chooses which definitions to generate, overrides tokens when the research-derived value doesn't feel right, and makes the final call on aesthetics. PD-Build is the starting point, not the final word.

## Critical Review (Homer's Car Check)

These notes are a brain dump of where PD-Build *could* go. Before building any of this, the following concerns apply:

### Governance assumes copilot, not pipeline
PD-Spec works as batch: run `/analyze`, review, run `/synthesis`. PD-Build as designed follows the same pattern. But Assisted Governance describes real-time interaction — designer says "make it red", agent responds "that breaks the rule, are you sure?" That's a copilot running continuously (like Cursor), not a skill that returns a file. PD-Build may need a different agent architecture than PD-Spec — more copilot than pipeline. Be conscious of this when building.

### Design Debt Registry risks becoming its own debt
`design-debt.json` is another file someone has to review. Without a review mechanism (sprint reviews, periodic agent prompts), it grows forever and becomes what it tries to solve: a file nobody looks at. For a team it could work. For a solo designer, the overhead may not justify itself in v1.

### Pattern Promotion needs critical mass
3+ identical overrides is reasonable for teams with multiple designers making decisions in parallel. For a single designer, the volume of overrides may never reach useful thresholds. Also: how does the agent distinguish "intentional deviation" from "forgot the rule"? Three identical mistakes aren't an emergent pattern — they're a repeated error.

### Component Schemas: who writes them?
The `DashboardShell` JSON is conceptually elegant. But who produces it? If the agent generates it from user stories, quality depends on how good the stories are. If the designer writes it manually, the problem just moved from Figma to JSON without being solved. The answer probably lies in the middle — agent drafts from user stories, designer validates and adjusts.

### PD-Build doesn't exist yet
These notes are detailed for a product that hasn't started. The Homer's Car Detector applies here too. The risk is over-designing in theory while PD-Spec hasn't been validated with real clients yet.

**The MVP of PD-Build is one thing:** read user stories from PD-Spec → generate `tokens.json`. No governance, no debt registry, no pattern promotion. Those are v2+ after the PD-Spec → PD-Build flow works end-to-end with a real project.

### Suggested build order
1. **v0.1** — Discovery mode only. `/systemize` reads PD-Spec Work layer directly (SYSTEM_MAP + INSIGHTS_GRAPH) → outputs `tokens.json`. Test: does an LLM produce more coherent output using these tokens?
2. **v0.2** — Add `components.yaml` and `patterns.md`. Migrate to `[US-XX]` contract once PD-Spec BL-03 ships. Validate definitions are useful to both LLMs and devs.
3. **v0.3** — Add `/compile` for one platform (CSS/.cursorrules). This is where Production mode begins — definitions + stack context → drivers.
4. **v1.0** — Assisted Governance (level 1 + 2 only — compliant and deviation). System Mutation can wait.
5. **v1.x** — Design Debt Registry + pattern promotion. Only when there's enough usage data to make it meaningful.

## Open Questions

- How does the contract sync work? Manual copy, git submodule, API?
- Should PD-Build validate that every token traces back to a `[US-XX]`? (Traceability all the way down)
- How do design system overrides work? → **Answered: Assisted Governance model.** Three levels (compliant/deviation/mutation). Overrides allowed with reason, tracked in Design Debt Registry. Traceability maintained through governance logs.
- What's the minimum viable PD-Build? (Just tokens.json from user stories, skip components?)
- Should `/compile` support incremental updates? (Only regenerate drivers for changed tokens)
- How does PD-Build handle multiple platforms? (One product, web + iOS + Android — same definitions, different drivers)
- What's the relationship between `03_Drivers/` and the actual codebase? (Does the dev import from `pd-build/03_Drivers/` or copy the files?)

## Origin

These ideas emerged from a critical review of Gemini's PD-Spec v2.5 and v3.0 proposals, plus a dedicated Gemini session on headless DS architecture. Key contributions by source:

- **v2.5:** Methodology-aware generation, extended artifact catalog, reactive design system examples
- **v3.0:** Refined skill structure, definition/implementation boundary
- **Headless DS session:** Component schemas beyond tokens, known limitations (gestalt, bidirectional sync), Assisted Governance model (3 intervention levels), Design Debt Registry, pattern promotion from usage data

The strategic intelligence (PD-Spec) and the system implementation (PD-Build) are separated by design — the user story contract is the bridge.
