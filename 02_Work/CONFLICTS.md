# Conflicts Log

Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

## Status Legend

- **PENDING** — Detected but not yet resolved.
- **RESOLVED** — User has provided a resolution direction.

---

<!-- New conflicts are appended below by /analyze -->

### [2026-02-11] Seed Analysis

- **[CF-01]** (PENDING) **Real-time Feeds vs. Legacy Settlement**. Brief promises viral, real-time social feeds ([IG-01]), but Technical Constraints confirm usage of OldGuard API with T+2 days settlement delay ([IG-05]).
- **[CF-02]** (PENDING) **Native vs. Hybrid**. Brief mandates "100% Native" experience ([IG-03]), but Technical Constraints enforce a React w/ Cordova wrapper approach due to timeline ([IG-06]).
- **[CF-03]** (PENDING) **Privacy vs. Social**. Core value prop is public transaction feeds ([IG-01]), but user interviews indicate strong resistance to broadcasting financial data ([IG-07]).
- **[CF-04]** (PENDING) **Subscription Model Viability**. Brief sets $5/mo price ([IG-04]), but users and benchmarks suggest this is above willingness-to-pay ([IG-08], [IG-10]) and market incompatibility ([IG-11]).
