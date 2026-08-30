# Industry pack authoring and activation

The schema is `assets/starter-kit/industry-packs/industry-pack.schema.json`. Start from `general-industry-template.json`; use `export-b2b.json` as the active reference implementation.

## Authoring sequence

1. Define target organizations, user roles, business outcomes, excluded decisions, and the accountable owner.
2. Map core objects to industry language without changing core object meaning.
3. Add only fields required for a real workflow or risk decision.
4. Register authoritative sources, capture dates, licenses, jurisdiction, applicability, and refresh cadence.
5. Define hard stops, approval steps, and conditions that return `unavailable` or require professional review.
6. Add golden cases covering success, insufficient evidence, source conflict, cross-tenant access, unsafe automation, and regulated claims.
7. Run a pilot with real but tenant-isolated data; measure decision quality and business outcomes separately.
8. Record version, owner, status, evaluation results, expiry, and rollback path.

## Activation gate

A pack may move through:

```text
DRAFT -> RESEARCH -> PILOT -> ACTIVE -> DEPRECATED
```

`ACTIVE` requires all of the following:

- schema validation and stable core compatibility;
- reviewed sources and a refresh owner;
- tenant-isolation and permission tests;
- hard stops and approval routing;
- golden-case pass with recorded failures resolved or accepted;
- pilot evidence from the intended role and workflow;
- public claims separately approved.

Profiles, field lists, or prompts alone are not an active industry capability.

## Regulated industries

Healthcare, financial services, legal/public services, and other high-impact domains remain research until professional responsibility, jurisdiction-specific authoritative sources, human review, audit, incident response, and prohibited-action boundaries are defined. Never use a generic pack to produce autonomous diagnosis, investment, legal, eligibility, or enforcement decisions.
