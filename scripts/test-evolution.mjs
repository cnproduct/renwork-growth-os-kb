#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'renwork-evolution-test-'));
const state = path.join(temporaryRoot, 'state');
const run = (script, args) => spawnSync(process.execPath, [path.join(root, 'scripts', script), ...args], { encoding: 'utf8' });
const writeJson = (name, value) => {
  const file = path.join(temporaryRoot, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return file;
};

try {
  const initialize = run('evolution-init.mjs', ['--state', state]);
  if (initialize.status !== 0) throw new Error(initialize.stderr || initialize.stdout);
  const initializeAgain = run('evolution-init.mjs', ['--state', state]);
  if (initializeAgain.status === 0 || !initializeAgain.stderr.includes('Refusing to overwrite')) throw new Error('Evolution state overwrite guard failed');

  const trace = JSON.parse(fs.readFileSync(path.join(root, 'evolution/examples/trace.example.json'), 'utf8'));
  trace.input_summary = 'Contact demo.person@example.test with an observed public clue.';
  trace.steps[0].metadata = { api_key: ['sk', 'synthetic-value-1234567890'].join('-') };
  const traceFile = writeJson('trace.json', trace);
  const capture = run('evolution-capture.mjs', ['--state', state, '--input', traceFile]);
  if (capture.status !== 0) throw new Error(capture.stderr || capture.stdout);
  const storedTrace = fs.readFileSync(path.join(state, 'raw', 'demo-tenant', 'TR-DEMO-001.json'), 'utf8');
  if (!storedTrace.includes('[REDACTED_EMAIL]') || !storedTrace.includes('[REDACTED_SECRET]')) throw new Error('Trace redaction failed');
  const captureAgain = run('evolution-capture.mjs', ['--state', state, '--input', traceFile]);
  if (captureAgain.status !== 0 || !captureAgain.stdout.includes('idempotent')) throw new Error('Trace idempotency failed');

  const conflictingTrace = { ...trace, task_id: 'changed-task' };
  const conflictFile = writeJson('trace-conflict.json', conflictingTrace);
  const conflict = run('evolution-capture.mjs', ['--state', state, '--input', conflictFile]);
  if (conflict.status === 0 || !conflict.stderr.includes('Immutable trace conflict')) throw new Error('Immutable trace conflict was not rejected');

  const hiddenReasoningTrace = { ...trace, trace_id: 'TR-DEMO-002', reasoning: 'must not be stored' };
  const hiddenFile = writeJson('trace-hidden.json', hiddenReasoningTrace);
  const hidden = run('evolution-capture.mjs', ['--state', state, '--input', hiddenFile]);
  if (hidden.status === 0 || !hidden.stderr.includes('Hidden reasoning field is prohibited')) throw new Error('Hidden reasoning field was not rejected');

  const proposal = JSON.parse(fs.readFileSync(path.join(root, 'evolution/examples/proposal.example.json'), 'utf8'));
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'evolution/examples/baseline-validation.example.json'), 'utf8'));
  const candidate = JSON.parse(fs.readFileSync(path.join(root, 'evolution/examples/candidate-validation.example.json'), 'utf8'));
  const proposalFile = writeJson('proposal.json', proposal);
  const baselineFile = writeJson('baseline.json', baseline);
  const candidateFile = writeJson('candidate.json', candidate);
  const acceptedGateFile = path.join(temporaryRoot, 'gate-accepted.json');
  const acceptedGate = run('evolution-gate.mjs', ['--policy', path.join(root, 'evolution/config/policy.json'), '--proposal', proposalFile, '--baseline', baselineFile, '--candidate', candidateFile, '--out', acceptedGateFile]);
  if (acceptedGate.status !== 0) throw new Error(acceptedGate.stderr || acceptedGate.stdout);
  if (JSON.parse(fs.readFileSync(acceptedGateFile, 'utf8')).decision !== 'ACCEPTED_FOR_HOLDOUT') throw new Error('Positive validation gate failed');
  const acceptedRecord = run('evolution-record.mjs', ['--state', state, '--proposal', proposalFile, '--gate', acceptedGateFile]);
  if (acceptedRecord.status !== 0) throw new Error(acceptedRecord.stderr || acceptedRecord.stdout);

  const unsafeProposal = { ...proposal, proposal_id: 'PROP-DEMO-002', diff_sha256: 'f'.repeat(64) };
  const unsafeCandidate = { ...candidate, run_id: 'RUN-CANDIDATE-VAL-002', skill_revision: 'candidate-PROP-DEMO-002', metrics: { ...candidate.metrics, cross_tenant_failures: 1 } };
  const unsafeProposalFile = writeJson('proposal-unsafe.json', unsafeProposal);
  const unsafeCandidateFile = writeJson('candidate-unsafe.json', unsafeCandidate);
  const rejectedGateFile = path.join(temporaryRoot, 'gate-rejected.json');
  const rejectedGate = run('evolution-gate.mjs', ['--policy', path.join(root, 'evolution/config/policy.json'), '--proposal', unsafeProposalFile, '--baseline', baselineFile, '--candidate', unsafeCandidateFile, '--out', rejectedGateFile]);
  if (rejectedGate.status !== 0) throw new Error(rejectedGate.stderr || rejectedGate.stdout);
  const rejected = JSON.parse(fs.readFileSync(rejectedGateFile, 'utf8'));
  if (rejected.decision !== 'REJECTED' || !rejected.reasons.some((reason) => reason.includes('cross_tenant_failures'))) throw new Error('P0 cross-tenant gate did not reject the candidate');
  const rejectedRecord = run('evolution-record.mjs', ['--state', state, '--proposal', unsafeProposalFile, '--gate', rejectedGateFile]);
  if (rejectedRecord.status !== 0) throw new Error(rejectedRecord.stderr || rejectedRecord.stdout);

  const impact = fs.readFileSync(path.join(state, 'wiki', 'skill-impact.jsonl'), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
  if (impact.length !== 2 || !impact.some((item) => item.decision === 'REJECTED') || !impact.some((item) => item.decision === 'ACCEPTED_FOR_HOLDOUT')) throw new Error('Accepted and rejected impact history was not preserved');

  const holdoutBaseline = { ...baseline, run_id: 'RUN-BASE-HOLDOUT-001', split: 'holdout' };
  const holdoutCandidate = { ...candidate, run_id: 'RUN-CANDIDATE-HOLDOUT-001', split: 'holdout', metrics: { ...candidate.metrics, task_success_rate: 0.8 } };
  const holdoutGateFile = path.join(temporaryRoot, 'gate-holdout.json');
  const holdoutGate = run('evolution-gate.mjs', ['--policy', path.join(root, 'evolution/config/policy.json'), '--proposal', proposalFile, '--baseline', writeJson('baseline-holdout.json', holdoutBaseline), '--candidate', writeJson('candidate-holdout.json', holdoutCandidate), '--out', holdoutGateFile]);
  if (holdoutGate.status !== 0 || JSON.parse(fs.readFileSync(holdoutGateFile, 'utf8')).decision !== 'APPROVED_PENDING_HUMAN') throw new Error('Holdout gate failed');

  console.log(JSON.stringify({ status: 'ok', raw_redaction: true, immutable_trace: true, hidden_reasoning_rejected: true, positive_gate: true, p0_gate: true, rejected_history_retained: true, holdout_requires_human: true }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
