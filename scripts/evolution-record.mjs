#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { appendJsonlIdempotent, hashObject, parseFlags, readJson } from './evolution-lib.mjs';

try {
  const flags = parseFlags(process.argv.slice(2));
  if (!flags.state || !flags.proposal || !flags.gate) throw new Error('Usage: node scripts/evolution-record.mjs --state <state-directory> --proposal <proposal.json> --gate <gate-result.json>');
  const stateRoot = path.resolve(flags.state);
  const wikiRoot = path.join(stateRoot, 'wiki');
  if (!fs.existsSync(path.join(stateRoot, 'state.json')) || !fs.existsSync(wikiRoot)) throw new Error('Evolution state is not initialized');
  const proposal = readJson(path.resolve(flags.proposal));
  const gate = readJson(path.resolve(flags.gate));
  if (proposal.proposal_id !== gate.proposal_id) throw new Error('Proposal and gate IDs do not match');

  const eventWithoutHash = {
    event_id: `EV-${proposal.proposal_id}-${gate.stage}`,
    iteration_id: proposal.iteration_id,
    proposal_id: proposal.proposal_id,
    target_skill: proposal.target_skill,
    motivating_pattern_ids: proposal.motivating_pattern_ids,
    source_trace_ids: proposal.source_trace_ids,
    diff_sha256: proposal.diff_sha256,
    gate_id: gate.gate_id,
    gate_result_hash: gate.result_hash,
    stage: gate.stage,
    decision: gate.decision,
    accepted: gate.accepted,
    reasons: gate.reasons,
    recorded_at: gate.evaluated_at
  };
  const record = { ...eventWithoutHash, record_hash: hashObject(eventWithoutHash) };
  const evolution = appendJsonlIdempotent(path.join(wikiRoot, 'evolution-log.jsonl'), record, 'event_id');
  const impact = appendJsonlIdempotent(path.join(wikiRoot, 'skill-impact.jsonl'), record, 'event_id');
  console.log(JSON.stringify({ status: evolution.status === 'appended' || impact.status === 'appended' ? 'recorded' : 'idempotent', event_id: record.event_id, decision: record.decision }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
