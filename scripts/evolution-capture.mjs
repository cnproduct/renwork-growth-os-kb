#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { assertSafeSegment, hashObject, parseFlags, readJson, redactTrace, rejectHiddenReasoning, writeJsonExclusive } from './evolution-lib.mjs';

const required = ['trace_id', 'iteration_id', 'tenant_id', 'task_id', 'split', 'started_at', 'finished_at', 'agent', 'input_summary', 'steps', 'outcome', 'sensitivity', 'consent_scope', 'retention'];
const allowedSplits = new Set(['train', 'validation', 'holdout', 'production']);

try {
  const flags = parseFlags(process.argv.slice(2));
  if (!flags.state || !flags.input) throw new Error('Usage: node scripts/evolution-capture.mjs --state <state-directory> --input <trace.json>');
  const stateRoot = path.resolve(flags.state);
  if (!fs.existsSync(path.join(stateRoot, 'state.json'))) throw new Error('Evolution state is not initialized');

  const input = readJson(path.resolve(flags.input));
  for (const field of required) if (!(field in input)) throw new Error(`Trace input missing field: ${field}`);
  assertSafeSegment(input.trace_id, 'trace_id');
  assertSafeSegment(input.iteration_id, 'iteration_id');
  assertSafeSegment(input.tenant_id, 'tenant_id');
  if (!allowedSplits.has(input.split)) throw new Error(`Invalid trace split: ${input.split}`);
  if (!Array.isArray(input.steps) || input.steps.length === 0) throw new Error('Trace steps must be a non-empty array');
  if (!input.agent?.model_id || !input.agent?.skill_revision || !input.agent?.environment_fingerprint) throw new Error('Trace agent metadata is incomplete');
  rejectHiddenReasoning(input);

  const redacted = redactTrace(input);
  delete redacted.captured_at;
  delete redacted.content_hash;
  const contentHash = hashObject(redacted);
  const outputPath = path.join(stateRoot, 'raw', redacted.tenant_id, `${redacted.trace_id}.json`);
  if (fs.existsSync(outputPath)) {
    const existing = readJson(outputPath);
    if (existing.content_hash !== contentHash) throw new Error(`Immutable trace conflict: ${redacted.trace_id}`);
    console.log(JSON.stringify({ status: 'idempotent', trace_id: redacted.trace_id, content_hash: contentHash }, null, 2));
    process.exit(0);
  }

  const stored = { ...redacted, captured_at: new Date().toISOString(), content_hash: contentHash };
  writeJsonExclusive(outputPath, stored);
  fs.chmodSync(outputPath, 0o444);
  console.log(JSON.stringify({ status: 'captured', trace_id: redacted.trace_id, tenant_id: redacted.tenant_id, content_hash: contentHash }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
