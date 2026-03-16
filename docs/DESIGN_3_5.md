# Wave 3.5 — Design Brief: "Amplifier, Not Process"

> Design session: 2026-03-14/15. Participants: Nico + Claude.
> Status: APPROVED for implementation. Replaces original 3.5 definition ("Rewrite skill .md files: apply design frameworks").

---

## Core Thesis

PD-Spec is not a process tool. It's a **design partner on-demand** — an amplifier of judgment, not a replacement for it.

The rigid sequential pipeline (extract → analyze → spec → ship) is **one possible mode**, not THE mode. It's most valuable for users who don't know where to start. For experienced practitioners, PD-Spec should behave as a sparring partner: validating intuitions, detecting blind spots, crossing signals, and generating stakeholder-ready artifacts.

### Inspiration

Jenny Wen (Anthropic/Figma, Hatch Conference): rigid design processes are obsolete in the AI era. Designers should trust craft and taste over theoretical process manuals. Not all products are equal — a universal process doesn't make sense.

### Principles

1. **Adaptive, not sequential** — the pipeline adapts to what exists and what's missing
2. **All voices are evidence** — no preset hierarchy between CEO, user, data, designer intuition. But evidence quality varies by methodology (see Evidence Quality Model)
3. **Bidirectional** — can go from solution to investigation, not just the reverse
4. **Amplifier of judgment** — doesn't replace the designer, amplifies what they have (or fills what they lack)
5. **Frameworks as invisible engine** — JTBD, Design Thinking, etc. power the questions and cross-referencing internally, but the user never sees framework names. Like a good doctor following a diagnostic protocol without explaining it.

---

## Three User Profiles, Same Product

| Profile | What they need | PD-Spec behavior |
|---|---|---|
| **Junior designer** | Compensate lack of intuition with crossed data | Structured guidance, evidence-based suggestions, proactive gap detection |
| **Founder without design team** | An opinionated design lead who critiques, organizes, pushes | Interview-driven ingestion, honest pushback, prepare validation artifacts |
| **Senior designer** | A second pair of expert eyes | Validate intuitions, detect blind spots, stay quiet when nothing useful to add |

---

## Three Entry Points

The current pipeline assumes sources are files the user brings. This is only one of three valid entry points.

| Entry point | What the user brings | What PD-Spec does |
|---|---|---|
| **Files** | PDFs, transcripts, existing research | Extract + Analyze (classic pipeline) |
| **Conversation** | Their knowledge, experience, vision | Structured interview → snapshot with identified gaps |
| **Existing product** | URL, screenshots, repo, metrics | Diagnostic → what works, what doesn't, what's missing |

All three converge to the same place: a snapshot of current state with identified gaps and a plan of action. But the route is completely different.

---

## Three Project Types

The approach depends on what exists, not on project maturity or user experience alone.

| Project type | Starting point | Primary value of PD-Spec |
|---|---|---|
| **Design over existing ecosystem** | Existing products, stack, users, opinionated stakeholders | Cross-referencing what exists against what's desired. Crosses are the main artifact. |
| **Product from scratch** | A vision, hypotheses, maybe interviews | Structure and guide. Fill the founder's gaps. Classic pipeline has most value here. |
| **Existing product with problems** | Running MVP, metrics, feedback, features that don't land | Diagnosis: what works, what doesn't, why. Track backwards from product to evidence. |

This is defined once at `/kickoff` (1-2 new questions) and stored in `PROJECT.md`. Skills read this to adapt tone, question depth, and suggested workflow.

---

## Evidence Quality Model

Not all evidence is equal. PD-Spec should assess **how** evidence was obtained, not just **what** it says. Applied from the moment of ingestion, not after analysis.

| How it was obtained | Reliability | PD-Spec behavior |
|---|---|---|
| Anonymous feedback / usage metrics | High | Register as strong signal |
| Interview by third party (designer, researcher) | High | Register as strong signal |
| Interview conducted by the founder | Medium | Register + flag: possible interviewer bias |
| "I think..." / founder intuition | Low | Register as hypothesis, suggest how to validate |
| User said during a demo / sales call | Low | Flag: socially biased context |

**Key behavior:** PD-Spec doesn't invalidate the founder. It helps separate what they know from what they think they know. When validation isn't available, it transparently marks as hypothesis — doesn't discard or treat as truth.

Example interaction:
> User: "My users need X"
> PD-Spec: "Interesting — how do you know this? Direct feedback, interviews, or your own observation? I can help you set up a quick validation if needed."

---

## Effort-Impact Matrix

All ideas surfaced in the design session, evaluated for implementation:

| # | Idea | Impact | Effort | Layer |
|---|------|--------|--------|-------|
| **A** | **Flexible pipeline** — remove forced sequential dependencies between skills | High | Low | 1 |
| **D** | **Kickoff defines project type** — ecosystem / from scratch / existing MVP | High | Low | 1 |
| **B** | **Conversation as ingestion** — interview the founder, live claims without files | High | Medium | 2 |
| **C** | **Workshop mode** — ad-hoc conversational work, crosses, stakeholder artifacts | High | Low-Medium | 2 |
| **E** | **All voices are evidence** — remove implicit pro-user-voice bias in analysis | Medium-High | Low | 2 |
| **F** | **Bidirectional pipeline** — from solution to investigation | Medium | Medium | 3 |
| **H** | **Stakeholder-specific artifacts** — deliverables designed for a specific audience | Medium | Medium | 3 |

### Descoped from 3.5

| # | Idea | Why descoped |
|---|------|-------------|
| **I** | Automatic maturity detection | D (kickoff question) solves 80% with 20% effort. Heuristics are fragile. |
| **J** | Craft/creative generation | Too domain-specific to generalize (TIMining ≠ SaaS ≠ fintech) |

### Deprecated

| Original 3.5 definition | Status | Replacement |
|---|---|---|
| "Apply design frameworks (JTBD, Design Thinking)" as visible methodology | **Deprecated** | Frameworks remain as invisible engine — they power what PD-Spec asks and how it crosses data, but the user never sees framework names |

---

## Implementation Layers

### Layer 1 — Quick Wins (redefine the product without breaking anything)

**A. Flexible pipeline**
- Remove "requires /extract first" gates in skill SKILL.md files
- Skills check what's available and adapt (if no EXTRACTIONS.md, say "I don't have extracted sources — want to start from conversation or bring files?")
- Pipeline sequence becomes a suggested default, not a wall

**D. Kickoff defines project type**
- Add to `/kickoff`: "What's the starting point?" (ecosystem / from scratch / existing MVP)
- Add to `/kickoff`: "Who's driving this?" (founder solo / designer / team with research)
- Store in `PROJECT.md` as `project_type` and `user_profile`
- Skills read these to adapt depth, tone, and suggested next steps

### Layer 2 — The Real Differentiator

**B. Conversation as ingestion**
- New mode in `/extract` (or standalone): PD-Spec interviews the user
- Uses frameworks internally (JTBD, 5 Whys, etc.) to structure questions without exposing them
- Produces same output: claims in EXTRACTIONS.md, tagged with evidence quality
- Applies Evidence Quality Model from ingestion, not post-analysis

**C. Workshop mode**
- Formalize what already happens organically in freemode
- Artifacts go to `_temp/` with trazability (source references, who requested, why)
- Logged in MEMORY.md like any skill execution
- Not a skill — it's the default mode when the user isn't invoking a pipeline skill
- Cross-referencing ("compare A against B and tell me what doesn't match") as first-class operation

**E. All voices are evidence**
- Update /analyze SKILL.md: remove implicit hierarchy that privileges user voice
- All categories (user-need, business, constraint, technical, design-framework) have equal standing
- When signals align across categories → strong signal
- When signals conflict across categories → explicit tradeoff, not automatic resolution
- Business constraints are facts that can override but must be flagged when they conflict with user signal

### Layer 3 — When the Above Is Solid

**F. Bidirectional pipeline**
- New flow in /analyze: "I have this solution/product — what evidence supports it and what doesn't?"
- Reverse-maps from a product description or prototype to existing insights
- Identifies unsupported assumptions and validated strengths

**H. Stakeholder-specific artifacts**
- Extend `/ship` with audience parameter: "Who is this for? What do they care about? What objections will they have?"
- Generate artifacts designed to convert a specific stakeholder (e.g., CTO → co-author, not critic)
- Reframe style: from "here's our plan" to "here's what we need to validate together"

---

## Validation: The TIMining Case Study

The TIMining project (Feb 16 – Mar 14, 2026) naturally evolved through all these modes without them being formally implemented:

| Period | Mode used | What happened |
|---|---|---|
| Feb 16-18 | Full pipeline | Built knowledge base: 54 files, 1238 claims, 21 insights, 10 outputs |
| Feb 24-26 | Pipeline + freemode | Incremental extracts, manual overrides, custom artifacts |
| Mar 3 | Craft | Showcase (Astro slides, 52 slides, visual components). Pipeline barely touched |
| Mar 10-14 | Workshop | PPT×Meeting crosses, CORE vision, technical roadmap for CTO. Pipeline completely abandoned |

**Key finding:** The pipeline was valuable for the first 2 weeks — it filled gaps and built the knowledge base. Once the base was mature and the user had context, value shifted to: crosses, craft, stakeholder-specific artifacts.

The rigid process is inversely proportional to user experience with the project. PD-Spec should evolve WITH the project, not stay fixed in pipeline mode.

---

## What This Changes in the Roadmap

| Roadmap item | Status | Notes |
|---|---|---|
| 3.5 "Opinionated methodology" | **Redefined** | No longer about applying frameworks. Now about making PD-Spec an adaptive design partner. |
| 3.6 BL-89 Truth levels | **Absorbed** | Evidence Quality Model replaces truth levels as a more nuanced approach |
| 3.8 BL-100 MASTER deliverable | **Reframed** | MASTER becomes one of many possible outputs. Stakeholder-specific artifacts (Layer 3) is the real need. |
| 3.9 Guided Interview | **Absorbed into B** | Conversation as ingestion IS the guided interview, but broader |

**Estimated effort:** Layer 1 (2-3 days) → Layer 2 (5-7 days) → Layer 3 (3-5 days) = ~12-15 days total.

---

*Authored: 2026-03-15. Source: design session Nico × Claude, cross-referenced with TIMining project usage data (Feb 16 – Mar 14).*
