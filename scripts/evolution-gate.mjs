#!/usr/bin/env node
import path from 'node:path';
import { hashObject, parseFlags, readJson, writeJsonExclusive } from './evolution-lib.mjs';

function requireMetric(run, name) {
  const value = run.metrics?.[name];
  if (typeof value !== 'number' || Number.isNaN(value)) throw new Error(`Run ${run.run_id} missing numeric metric: ${name}`);
  return value;
}

try {
  const flags = parseFlags(process.argv.slice(2));
  for (const name of ['policy', 'proposal', 'baseline', 'candidate', 'out']) if (!flags[name]) throw new Error(`Missing --${name}`);
  const policy = readJson(path.resolve(flags.policy));
  const proposal = readJson(path.resolve(flags.proposal));
  const baseline = readJson(path.resolve(flags.baseline));
  const candidate = readJson(path.resolve(flags.candidate));
  const reasons = [];

  if (proposal.status !== 'candidate' || !proposal.target_skill || !['create', 'patch'].includes(proposal.change_type)) reasons.push('proposal is not an atomic skill candidate');
  if (!Array.isArray(proposal.motivating_pattern_ids) || proposal.motivating_pattern_ids.length === 0) reasons.push('proposal has no motivating Wiki pattern');
  if (baseline.split !== candidate.split || !['validation', 'holdout'].includes(candidate.split)) reasons.push('baseline and candidate must use the same validation or holdout split');
  const stage = candidate.split;
  if (policy.require_same_evaluation_suite && baseline.evaluation_suite_id !== candidate.evaluation_suite_id) reasons.push('evaluation suite mismatch');
  if (policy.require_same_model && baseline.model_id !== candidate.model_id) reasons.push('model mismatch');
  if (policy.require_same_environment && baseline.environment_fingerprint !== candidate.environment_fingerprint) reasons.push('environment fingerprint mismatch');
  if (candidate.sample_size < policy.minimum_sample_size[stage]) reasons.push(`candidate sample size is below ${policy.minimum_sample_size[stage]}`);
  if (baseline.sample_size !== candidate.sample_size) reasons.push('baseline and candidate sample sizes differ');

  const primary = policy.primary_metric;
  const primaryDelta = requireMetric(candidate, primary) - requireMetric(baseline, primary);
  if (primaryDelta < policy.minimum_primary_delta[stage]) reasons.push(`${primary} delta ${primaryDelta.toFixed(6)} is below ${policy.minimum_primary_delta[stage]}`);

  for (const [metric, maximum] of Object.entries(policy.hard_gate_maximums)) {
    if (requireMetric(candidate, metric) > maximum) reasons.push(`hard gate failed: ${metric} > ${maximum}`);
  }

  for (const [metric, maximumRatio] of Object.entries(policy.maximum_regression_ratio)) {
    const baselineValue = requireMetric(baseline, metric);
    const candidateValue = requireMetric(candidate, metric);
    const ratio = baselineValue === 0 ? (candidateValue === 0 ? 0 : Number.POSITIVE_INFINITY) : (candidateValue - baselineValue) / baselineValue;
    if (ratio > maximumRatio) reasons.push(`${metric} regression ratio exceeds ${maximumRatio}`);
  }

  const accepted = reasons.length === 0;
  const decision = accepted ? (stage === 'validation' ? 'ACCEPTED_FOR_HOLDOUT' : 'APPROVED_PENDING_HUMAN') : 'REJECTED';
  const resultWithoutHash = {
    gate_id: `GATE-${proposal.proposal_id}-${stage}-${candidate.run_id}`,
    proposal_id: proposal.proposal_id,
    stage,
    accepted,
    decision,
    reasons,
    baseline_run_id: baseline.run_id,
    candidate_run_id: candidate.run_id,
    policy_id: policy.policy_id,
    evaluated_at: new Date().toISOString()
  };
  const result = { ...resultWithoutHash, result_hash: hashObject(resultWithoutHash) };
  writeJsonExclusive(path.resolve(flags.out), result);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
