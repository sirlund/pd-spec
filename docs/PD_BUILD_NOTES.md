# PD-Build — Design Notes

> Ideas and architecture inputs for PD-Build, captured during PD-Spec v3.0 iteration (2025-02-13).
> These concepts were proposed for PD-Spec but belong in the implementation layer.

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

## The Contract Format

PD-Build consumes user stories (JTBD) from `PD-Spec/03_Outputs/USER_STORIES.html`. Each story carries:

- `[US-XX]` ID
- JTBD frame: When [situation], I want to [motivation], so I can [outcome]
- Insight refs: `[IG-XX]` traceability back to research
- Acceptance criteria: derived from PD-Spec's SYSTEM_MAP
- Priority: derived from conflict resolution

This replaces the informal `DESIGN_BRIEF.md` mentioned in the original PD-OS spec.

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

## PD-Build Boundaries

Mirroring PD-Spec's boundaries — what PD-Build is NOT:

- **Not a component library.** It defines `Button` must have a `destructive` variant with `color.action.destructive`. It does NOT write `Button.tsx` or `button.scss`. The dev team writes the component; PD-Build gives them the spec.
- **Not a Figma plugin.** It outputs JSON that a Figma plugin *could* consume, but it doesn't manipulate Figma files directly.
- **Not a testing framework.** `qa-criteria.md` tells you what to test. It doesn't run Playwright or Chromatic.
- **Not a substitute for design judgment.** The designer chooses which definitions to generate, overrides tokens when the research-derived value doesn't feel right, and makes the final call on aesthetics. PD-Build is the starting point, not the final word.

## Open Questions

- How does the contract sync work? Manual copy, git submodule, API?
- Should PD-Build validate that every token traces back to a `[US-XX]`? (Traceability all the way down)
- How do design system overrides work? (Designer wants to change a color that was research-derived — does it break traceability?)
- What's the minimum viable PD-Build? (Just tokens.json from user stories, skip components?)
- Should `/compile` support incremental updates? (Only regenerate drivers for changed tokens)
- How does PD-Build handle multiple platforms? (One product, web + iOS + Android — same definitions, different drivers)
- What's the relationship between `03_Drivers/` and the actual codebase? (Does the dev import from `pd-build/03_Drivers/` or copy the files?)

## Origin

These ideas emerged from a critical review of Gemini's PD-Spec v2.5 and v3.0 proposals. Gemini correctly identified the research → design system pipeline but placed it in the wrong repo. The v2.5 contributed the methodology-aware generation concept, the extended artifact catalog (accessibility, QA, voice-tone, prototype specs), and the reactive design system examples. The v3.0 refined the skill structure and clarified the boundary between definition and implementation. The strategic intelligence (PD-Spec) and the system implementation (PD-Build) are separated by design — the user story contract is the bridge.
