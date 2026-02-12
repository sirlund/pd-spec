# Insights Graph

Atomic verified insights extracted from sources. Each insight has a unique `[IG-XX]` ID, a status, and a traceable source reference.

## Status Legend

- **PENDING** — Extracted but not yet verified or cross-referenced.
- **VERIFIED** — Confirmed through cross-referencing or user validation.
- **MERGED** — Combined with another insight during conflict resolution.
- **INVALIDATED** — Contradicted by stronger evidence; no longer active.

---

<!-- New insights are appended below by /analyze -->

### [2026-02-11] Seed Analysis

- **[IG-01]** VERIFIED (business) Vision: "Social banking" experience with multiplayer finance, shared pots, and public feeds. Ref: `seed-brief/project-brief.md`
- **[IG-02]** INVALIDATED (business) Feature: Aggressive AI coaching personality that "roasts" spending. Ref: `seed-brief/project-brief.md`
- **[IG-03]** VERIFIED (technical) Constraint: Mobile-only, 100% Native iOS/Android (no web). Ref: `seed-brief/project-brief.md`
- **[IG-04]** VERIFIED (business) Model: Flat $5/month subscription. Ref: `seed-brief/project-brief.md`
- **[IG-05]** VERIFIED (technical) Constraint: Must use legacy "OldGuard" SOAP API with T+2 days settlement. Ref: `seed-technical/constraints.md`
- **[IG-06]** VERIFIED (technical) Constraint: Implementation will be a React web wrapper in Cordova, not native. Ref: `seed-technical/constraints.md`
- **[IG-07]** VERIFIED (user-need) Privacy: User Alex finds public financial broadcasts "creepy" and values privacy. Ref: `seed-interviews/interview-01.md`
- **[IG-08]** VERIFIED (user-need) Pricing: User Alex unwilling to pay subscription; cites free competitors (Chime). Ref: `seed-interviews/interview-01.md`
- **[IG-09]** INVALIDATED (user-need) Social: User Taylor motivates via competition and leaderboards. Ref: `seed-interviews/interview-02.md`
- **[IG-10]** VERIFIED (user-need) Pricing: User Taylor willing to pay $2-3, considers $5 steep. Ref: `seed-interviews/interview-02.md`
- **[IG-11]** VERIFIED (business) Market: No successful competitor combines Subscription + Social features. Ref: `seed-benchmark/competitor-analysis.md`
- **[IG-12]** VERIFIED (user-need) Trust: User Jordan refuses to link main bank account due to security concerns. Ref: `seed-benchmark/interview-03-jordan.md`
