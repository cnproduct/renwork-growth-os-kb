# WikiSkill research basis and RenWork adaptation

## Verified source

The primary source is the paper [WikiSkill: Compiling Agent Experience into Persistent Knowledge for Skill Evolution](https://arxiv.org/abs/2608.27454), submitted as arXiv v1 on 2026-08-27 by Google Research-affiliated authors, with a Virginia Tech affiliation for one author. It is a research preprint, not evidence of a supported Google commercial product or a production-ready framework.

The paper establishes these design points:

- three layers: immutable raw execution traces, a persistent structured wiki, and active executable skills;
- four roles/stages: inference rollouts, Wiki Maintainer consolidation, wiki-informed atomic skill proposal, and validation gating with skill rollback;
- `PURPOSE.md` maps a skill to the Wiki patterns that motivated it;
- the wiki retains pattern edits and accepted/rejected proposal impact so later iterations avoid repeating failed interventions;
- train, validation, and test data are separate; a candidate is accepted only when validation performance beats the best prior score in the experimental algorithm;
- in the paper's controlled evolution experiments, the inference agent uses active skills but not the wiki, while the proposer can consult the wiki and traces.

The reported Qwen comparison—9B with evolved skills averaging 47.4% versus 27B without skills at 39.4%—is correct for the paper's five-benchmark experiment. It is not a general guarantee for RenWork workloads, costs, models, or production accuracy.

## RenWork three-layer contract

| Layer | RenWork implementation | Governance correction |
|---|---|---|
| Raw | tenant-local observable actions, tool calls/results, redacted decision summaries, final output, scores and environment fingerprints | Do not request or store hidden chain-of-thought. Secrets and unnecessary personal data are redacted. Retention and authorized deletion override persistence. |
| Wiki | versioned patterns, recurring failures, successful strategies, evolution log, and skill-impact records | Persist history through append-only events and version control; corrections use superseding versions or tombstones rather than silent rewriting. |
| Skills | concise active `SKILL.md`, supporting resources, scripts and `PURPOSE.md` | Only an atomic candidate that passes validation, safety, cost/latency, holdout, provenance and human release gates may become active. |

Raw and candidate data live in a private runtime directory created by `evolution-init.mjs`. They are not committed to this public repository.

## Evolution loop

```text
active skill snapshot
  -> train rollouts and redacted raw traces
  -> Wiki Maintainer root-cause patterns
  -> one atomic candidate for one skill
  -> independent validation gate
  -> holdout non-regression check
  -> human release approval
  -> active release or rollback
  -> accepted and rejected impact retained in Wiki
```

The Wiki Maintainer should sample both failures and successes, because a fix must preserve working behavior. The paper used up to five failures and three successes per iteration with capped trace length; RenWork treats those numbers as experimental defaults, not universal limits.

## Evaluation isolation

Do not use one set of historical examples for diagnosis, proposal, and acceptance.

- Train traces: reveal failure modes and successful procedures.
- Validation set: decides whether one candidate is better than the current skill under the same model and environment fingerprint.
- Holdout set: checks generalization after validation selection.
- Production canary: measures business effect after human approval; it does not retroactively change historical evaluation scores.

The paper's “inference agent cannot read the wiki” rule applies to controlled skill-evolution rollouts. It must not be generalized into “a business agent cannot use approved enterprise knowledge.” Production RenWork workflows may retrieve approved knowledge; the evolution benchmark withholds the pattern wiki so that improvement can be attributed to the active skill rather than test leakage.

## Enterprise promotion gate

RenWork adds gates not established by benchmark accuracy alone:

1. zero P0 safety, cross-tenant, unauthorized-publication, and unsupported-claim failures;
2. primary quality improvement on validation and non-regression on holdout;
3. same evaluation suite, execution model, tool contract, and environment fingerprint for baseline and candidate;
4. bounded cost and latency regression;
5. trace and pattern provenance plus a single-skill atomic diff;
6. human approval before activation or external release;
7. rollback commit/package and a retained rejection record.

## Small-team cadence

Start with one frequent, measurable, low-risk workflow. A business owner can review a small, stratified batch weekly, but the acceptance set must remain separate from the examples used to write the candidate. Automate capture and deterministic gates first; automate pattern writing or proposal generation only after the team can audit false lessons and privacy failures.
