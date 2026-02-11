# Technical Constraints & Architecture

**Date:** Feb 11, 2026
**Author:** CTO

## Core Systems

We are legacy constrained. The "Stark" banking API mentioned in the brief is actually not approved by compliance yet. We have to use the "OldGuard" SOAP API for at least the first 12 months.

## Implications

1. **No Instant Settlement**: OldGuard takes T+2 days to clear transactions. Real-time feeds will be impossible. We have to fake it or show "pending".
2. **Web Wrapper**: To hit the timeline, we are repurposing the existing React web portal. We will wrap it in Cordova for iOS/Android. It will NOT be native.
3. **Security**: We cannot store social graph data on the same servers as banking data (PCI-DSS requirement). We need a completely separate infrastructure for the social features.

## Performance

The OldGuard API has a rate limit of 1 call per second per user. The "multiplayer" frequent updates idea might ddos our own provider.
