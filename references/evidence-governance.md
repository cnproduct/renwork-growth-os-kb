# Evidence, permissions, and automation governance

## Source authority

Use the source registry before creating claims. A practical scale is:

| Grade | Typical source | Use |
|---|---|---|
| S | signed business decision, approved internal system, authoritative record | current operational truth within scope |
| A | official website, regulator, official product documentation | public or regulatory evidence, subject to time and scope |
| B | reviewed internal methodology or approved expert material | governed method and guidance |
| C | reputable third party or research synthesis | research lead requiring primary-source confirmation |
| D | weak third party or model inference | hypothesis only |
| I | unavailable, inaccessible, or conflicting observation | gap or conflict, never proof of the claim |

Authority does not decide sensitivity, freshness, or publication rights.

## Claim state

Use the knowledge-card schema values:

- `verified_fact`: verified within an internal scope;
- `public_fact`: already public and currently verified;
- `ai_inference`: model interpretation that needs review;
- `strategy_recommendation`: proposed method or decision;
- `pending_supplement`: missing essential evidence;
- `conflicted`: sources disagree;
- `deprecated`: intentionally retired and retained for history.

Only `verified_fact` or `public_fact` with `sensitivity=public`, `public_claim_approved=true`, a current source, and an accountable reviewer may enter public copy.

## Buyer and customer evidence

Record three independent axes:

- `E`: company-level buyer or transaction evidence;
- `C`: contact identity and deliverability verification;
- `R`: sales priority and recommended next action.

Do not let email discovery, website matching, open/click signals, or a scoring model upgrade `E`. Unknown numeric values remain unknown rather than `0`.

## Automation levels

| Level | Allowed behavior |
|---|---|
| A0 | retrieve, summarize, or draft without external mutation |
| A1 | produce an internal recommendation or review queue |
| A2 | prepare a reversible action for human confirmation |
| A3 | execute an explicitly approved, scoped, auditable action |
| A4 | run a pre-authorized bounded automation with stop conditions and monitoring |

Pricing commitments, contracts, bulk outreach, public publishing, payment-account changes, sensitive exports, and regulated decisions do not become A3/A4 merely because an integration exists.

## Tenant and learning rules

- Derive tenant scope from authenticated context, not content or model parameters.
- Store raw customer data only in its tenant.
- Promote learning to shared knowledge only after authorization, de-identification, source review, root-cause confirmation, and evaluation.
- Retain rejected or conflicted claims as governed history when useful; do not silently erase why they were rejected.
