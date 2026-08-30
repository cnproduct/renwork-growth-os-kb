---
pattern_id: PAT-BASE-002
kind: governance_rule
status: active
origin: baseline_policy
confidence: 1.0
first_seen: 2026-08-30T00:00:00Z
last_updated: 2026-08-30T00:00:00Z
source_trace_ids: []
supersedes: null
---

# Preserve tenant and buyer-evidence boundaries

## Context

Buyer discovery can mistakenly turn a company match, public contact, or weak engagement signal into a confirmed buyer or cross-tenant asset.

## Evidence

This is a baseline governance requirement, not a trace-derived pattern.

## Root cause

Identity/tenant context is accepted from content, or evidence `E`, contact verification `C`, and sales priority `R` are collapsed into one score.

## Actionable workaround

Derive tenant scope from authentication. Store and display E/C/R independently, retain source time and limitations, and preserve unknown values.

## Safety and non-regression constraints

No model parameter may switch tenants. Contact data, public directories, and matching scores cannot prove procurement or recent transactions.
