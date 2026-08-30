# RenWork validation-gated skill evolution

This directory defines the public contract and templates. Real traces, candidates, evaluation outputs, and tenant-specific Wiki records belong in a private state directory, not in this repository.

## Repository layer

```text
evolution/
  config/policy.json             deterministic promotion thresholds
  schemas/                       trace, proposal, evaluation and gate contracts
  wiki/                          seed patterns and pattern format
  examples/                      synthetic, non-customer examples
```

The active Skill remains at repository root as `SKILL.md` plus `PURPOSE.md`.

## Private runtime layer

Create it with:

```bash
node scripts/evolution-init.mjs --state .runtime/evolution
```

The command creates:

```text
.runtime/evolution/
  raw/<tenant_id>/               immutable, redacted execution traces
  wiki/patterns/                 reviewed persistent patterns
  wiki/evolution-log.jsonl       append-only iteration decisions
  wiki/skill-impact.jsonl        accepted and rejected proposal impact
  candidates/                    isolated Skill candidates
  eval-results/                  validation and holdout results
  config/policy.json             versioned gate policy snapshot
```

## Responsibilities

- Inference executor: runs the active Skill and produces observable traces.
- Wiki Maintainer: performs root-cause analysis, consolidates recurring patterns, and preserves counterexamples.
- Skill Proposer: reads approved patterns and selected traces, then proposes one atomic change to one Skill.
- Gate runner: compares baseline and candidate under the same suite/model/environment and applies hard constraints.
- Human release owner: reviews provenance, risk, diff, rollback, and business fit before activation.

No component may silently promote raw content or a candidate into the active Skill.
