# System Map

The product's logic layer. Every decision here traces back to verified insights in `INSIGHTS_GRAPH.md`.

## Product Vision

A "social banking" experience for Gen Z — mobile-only, multiplayer finance with shared pots and public feeds. [IG-01, IG-03]

Core differentiator is social, but strong user resistance to public financial data creates an unresolved tension (CF-03). Privacy-first positioning may be required.

## Modules

### Core Banking
Cordova/React wrapper on OldGuard SOAP API. T+2 settlement latency. CEO approved Cordova for 3-month launch timeline; backlog must include Flutter migration milestone post-PMF. [IG-05, IG-06, CF-02 RESOLVED]

### Social Layer
Shared pots, public transaction feeds, squad goals. Core value prop but privacy conflict unresolved — design must assume opt-in social until CF-03 is resolved. [IG-01, IG-07] — Blocked on CF-03.

### Monetization
$5/mo flat subscription proposed in brief. Contradicted by all external evidence: users say $0 or $2-3 max, market shows no successful subscription + social combo. Model undefined until research completes. [IG-04, IG-08, IG-10, IG-11] — Blocked on CF-04.

### Trust & Security
Users refuse to link main bank accounts. "Play money" framing needed for onboarding. No source addresses how to build trust over time. [IG-12]

## Design Principles

1. **Privacy by default** — Social features must be opt-in. Users find financial broadcasting "creepy." Never expose transactions without explicit consent. [IG-07, IG-12]
2. **Ship fast, iterate later** — Cordova MVP to validate market fit. Flutter migration after PMF, not before. [IG-06, CF-02]
3. **Price-sensitive audience** — Gen Z won't pay $5. Whatever monetization model is chosen, it must respect a $0-3 willingness range or offer exceptional value. [IG-08, IG-10, IG-11]

## Open Questions

- [ ] How to reconcile social banking vision with user privacy concerns? (CF-03 — needs user research)
- [ ] What monetization model works if $5 subscription fails? (CF-04 — needs freemium benchmarks)
- [ ] What is the Stark API approval timeline? Can real-time feeds be unblocked sooner? (CF-01 — flagged for CTO + Product)
- [ ] When is the Flutter migration milestone relative to PMF? What triggers it? (CF-02 — needs CEO input on criteria)
- [ ] How to address trust barrier for bank account linking? No research planned yet. (IG-12)
