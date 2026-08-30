# Skill purpose and provenance

## Active skill

- Skill: `renwork-growth-os-kb`
- Release line: `1.x`
- Purpose: turn RenWork business knowledge into evidence-governed, tenant-safe, testable workflows and industry packs.
- Execution boundary: the active Skill may guide retrieval, analysis, drafting, validation, and explicitly authorized actions; it does not grant publication, outreach, pricing, payment, or cross-tenant authority.

## Motivating Wiki patterns

| Pattern | Why it exists | Active behavior |
|---|---|---|
| `PAT-BASE-001` | Source authority, claim state, sensitivity, and publication rights are often conflated | Keep them as separate fields and show conflicts |
| `PAT-BASE-002` | Public clues and contacts are often promoted into confirmed buyers | Keep tenant scope and E/C/R grades independent |
| `PAT-BASE-003` | Generated or locally validated artifacts are often reported as published or production-ready | Use atomic candidates, validation gates, destination checks, and separate states |
| `PAT-BASE-004` | Product signals, browser access, diagnosis, action, and measured outcome are often collapsed into one claim | Keep the product intelligence and browser execution planes separate, then reconnect them through approval and outcome verification |

These are baseline-policy patterns, not claims learned from customer traces. Future changes must list trace-derived pattern IDs, source trace IDs or approved summaries, proposal ID, gate result, reviewer, and release commit.

## Migration record

V1.1 adds an independent, enterprise-safe adaptation of the WikiSkill research architecture. It was introduced through manual research and repository review rather than through the newly bootstrapped evolution loop. No WikiSkill implementation code was copied.

V1.2 adds an independently verified Agent frontend reference architecture using Ego Lite as an optional browser execution pattern and PostHog as an optional product intelligence pattern. The upstream projects have not announced a joint integration. No upstream code, browser profile, telemetry, session replay, or customer data was copied into this repository.

## Promotion rule

An active release may reference only:

- reviewed patterns that preserve source and tenant boundaries;
- accepted validation and holdout gate records;
- an explicit human release decision;
- a commit or immutable package identifier that can be rolled back.

Rejected candidates remain in the private evolution audit, but never become active instructions.
