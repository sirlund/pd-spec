# Conflicts Log

Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

## Status Legend

- **PENDING** — Detected but not yet resolved.
- **RESOLVED** — User has provided a resolution direction.

---

<!-- New conflicts are appended below by /analyze -->

### [2026-02-11] Seed Analysis

- **[CF-01]** (PENDING · flagged) **Real-time Feeds vs. Legacy Settlement**. Brief promises viral, real-time social feeds ([IG-01]), but Technical Constraints confirm usage of OldGuard API with T+2 days settlement delay ([IG-05]).
  - *Action:* Flag for discussion — CTO + Product: real-time UX vs API constraints trade-off. Investigate Stark API timeline.

- **[CF-02]** (RESOLVED) **Native vs. Hybrid**. Brief mandates "100% Native" experience ([IG-03]), but Technical Constraints enforce a React w/ Cordova wrapper approach due to timeline ([IG-06]).
  - *Resolution:* CEO confirmed Cordova for 3-month launch. Backlog must include approximate milestone for Flutter migration after reaching product-market fit. [IG-06] wins for MVP, [IG-03] remains as long-term target.

- **[CF-03]** (PENDING · research) **Privacy vs. Social**. Core value prop is public transaction feeds ([IG-01]), but user interviews indicate strong resistance to broadcasting financial data ([IG-07]).
  - *Action:* Needs more research — additional user interviews focused on privacy expectations in social finance apps.

- **[CF-04]** (PENDING · research) **Subscription Model Viability**. Brief sets $5/mo price ([IG-04]), but users and benchmarks suggest this is above willingness-to-pay ([IG-08], [IG-10]) and market incompatibility ([IG-11]).
  - *Action:* Needs more research — freemium benchmarks in fintech, conversion rates, ARPU analysis.
