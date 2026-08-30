---
pattern_id: PAT-BASE-001
kind: governance_rule
status: active
origin: baseline_policy
confidence: 1.0
first_seen: 2026-08-30T00:00:00Z
last_updated: 2026-08-30T00:00:00Z
source_trace_ids: []
supersedes: null
---

# Separate evidence from publication authority

## Context

Knowledge cards and public content frequently combine source authority, claim status, sensitivity, freshness, and approval into one vague confidence judgment.

## Evidence

This is a baseline governance requirement, not a trace-derived pattern.

## Root cause

The information model lacks independent state fields or the workflow skips the public-claim gate.

## Actionable workaround

Record source, status, confidence basis, sensitivity, validity, tenant scope, and public approval separately. Show conflicts rather than selecting a convenient source.

## Safety and non-regression constraints

An official page can prove public wording without proving production capability. A high-authority source can still be expired or restricted.
