---
pattern_id: PAT-BASE-004
kind: governance_rule
status: active
origin: baseline_policy
confidence: 1.0
first_seen: 2026-08-30T22:53:08Z
last_updated: 2026-08-30T22:53:08Z
source_trace_ids: []
supersedes: null
---

# Separate product signals, browser actions, and measured outcomes

## Context

An Agent may receive a product signal from analytics or observability, then reproduce or act through an authenticated browser. Teams often collapse the signal, inferred diagnosis, completed action, and business result into one success claim.

## Evidence

This is a baseline governance requirement informed by the verified Ego Lite and PostHog repository architectures. It is not a trace-derived pattern and does not claim that the two projects provide an official joint integration.

## Root cause

The workflow lacks explicit boundaries between observed telemetry, hypotheses, authorized execution, destination verification, and post-change measurement. Reused login state may also be mistaken for permission.

## Actionable workaround

Keep a product intelligence plane and a browser execution plane. Route both through tenant and environment identity, least-privilege roles, explicit approval, immutable action evidence, and a measurement window before learning from the result.

## Safety and non-regression constraints

Webpages and telemetry remain untrusted inputs. Authentication never grants additional authority. A signal cannot prove causality, a browser action cannot prove business success, and an Agent-generated pull request or feature flag cannot be described as production deployment without independent verification.
