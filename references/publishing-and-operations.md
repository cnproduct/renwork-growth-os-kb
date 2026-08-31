# Publishing and operating lifecycle

## Lifecycle

```text
classify
  -> extract
  -> structure
  -> validate
  -> approve
  -> generate
  -> publish
  -> verify destination
  -> measure
  -> reviewed learning
```

Each arrow is a state transition with its own evidence. A draft is not approved; an approved artifact is not published; a publish API response is not destination verification; destination verification is not business impact.

## Website content contract

Every public page or FAQ should carry:

- page ID, audience, business question, and owner;
- cited knowledge-card IDs and source capture dates;
- claim status, capability status, conditions, and exclusions;
- public-approval record and rollback version;
- next action and support path;
- published URL and destination-verification timestamp.

Before generation, select only current public-approved cards. Before publication, re-check the current canonical domain, page environment, prices, policies, product capability, customer permission, and compliance facts.

## Operating cadence

- continuous: capture unanswered questions, conflicts, broken sources, refusals, and workflow failures;
- weekly: triage missing, conflicted, expired, and high-use low-quality knowledge;
- monthly: run golden cases, retrieval quality, public-claim audit, and business metric review;
- quarterly: review tenant permissions, industry-pack activation, source licenses, retention, owner coverage, and architecture debt.

Measure knowledge quality and business performance separately. Suggested knowledge measures include citation coverage, freshness, conflict age, abstention quality, retrieval success, unsafe-answer rate, and time to close a gap. Business measures depend on the workflow, such as qualified-account rate, inquiry response time, quote cycle time, conversion, repeat purchase, or support deflection.

## Failure handling

When a validation or business result fails:

1. preserve the input, output, sources, identity/tenant context, model/tool version, and decision trace;
2. classify the root cause instead of patching wording blindly;
3. update the source, card, retrieval, workflow, permission, evaluation, or owner layer that caused the failure;
4. add a regression case;
5. require review before promoting the fix to shared or public knowledge.

For video production, keep source availability, parsing, generation, technical validation, audiovisual acceptance, staged learning, approved learning, repository synchronization, deployment, publication, destination verification, and business impact as separate states. A human-accepted video may create a staged success-pattern candidate, but it cannot update active templates or public knowledge without a separate review and forward test.
