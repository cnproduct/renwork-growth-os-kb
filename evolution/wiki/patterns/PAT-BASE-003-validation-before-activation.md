---
pattern_id: PAT-BASE-003
kind: governance_rule
status: active
origin: baseline_policy
confidence: 1.0
first_seen: 2026-08-30T00:00:00Z
last_updated: 2026-08-30T00:00:00Z
source_trace_ids: []
supersedes: null
---

# Validate one atomic candidate before activation

## Context

Generated drafts, local tests, repository commits, releases, deployments, destination checks, and business acceptance are often reported as the same state.

## Evidence

This is a baseline governance requirement, not a trace-derived pattern.

## Root cause

The workflow lacks explicit state transitions, comparable evaluation runs, rollback identifiers, or a human release owner.

## Actionable workaround

Change one Skill per proposal, compare under the same evaluation suite/model/environment, enforce hard gates, run holdout checks, record accepted and rejected impact, and require human release approval.

## Safety and non-regression constraints

Validation never authorizes outreach, publication, pricing, payment, or cross-tenant actions. An active Skill must retain a rollback commit or package.
