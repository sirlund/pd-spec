# Insight Lifecycle

Reference document for lifecycle definitions. Used by orchestrator and skills.

## Insight Statuses

| Status | Who sets it | Meaning | Active? |
|---|---|---|---|
| VERIFIED | Engine (/analyze) | Confirmed by evidence. Born status for all insights. | Yes |
| FROZEN | User only | Valid but deprioritized — "not now" | No |
| DISCARDED | User only | Not useful — reason required | No |
| MERGED | Engine (/analyze, /spec) | Absorbed into another insight [IG-XX] | No |
| SUPERSEDED | Engine (/analyze, /spec) | Replaced by newer insight [IG-XX] | No |

## Temporal Tags

| Tag | Meaning | Enters proposals? |
|---|---|---|
| (as-is) | Current state, present reality. Default when ambiguous. | Yes |
| (to-be) | Desired future state with concrete design intent | Yes |
| (future-state) | Long-term vision, exploratory, not scoped for current cycle | Yes, marked as exploratory |

## User Actions

| Action | From | To | UI Element |
|---|---|---|---|
| Edit | VERIFIED | VERIFIED | Pencil icon → inline form |
| Freeze | VERIFIED | FROZEN | Snowflake icon |
| Unfreeze | FROZEN | VERIFIED | Check icon |
| Discard | VERIFIED, PENDING* | DISCARDED | X icon → reason prompt |

*PENDING for backwards compatibility with old data only. New insights are born VERIFIED.

## Engine Actions

| Action | From | To | Trigger |
|---|---|---|---|
| Merge | VERIFIED, PENDING* | MERGED → [IG-XX] | /analyze detects overlap |
| Supersede | VERIFIED | SUPERSEDED → [IG-XX] | /analyze or /spec detects replacement |

## Filtering in /spec

- **FROZEN:** Excluded from proposals. User chose "not now".
- **DISCARDED:** Excluded from proposals. User chose "not useful".
- **(future-state) VERIFIED:** Enters proposals but marked as exploratory. User controls exclusion via Freeze, not via temporal tag.
