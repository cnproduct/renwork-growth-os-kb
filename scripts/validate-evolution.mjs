#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readJson } from './evolution-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fail = (message) => { throw new Error(message); };

try {
  const requiredFiles = [
    'PURPOSE.md',
    'references/wikiskill-adaptation.md',
    'evolution/README.md',
    'evolution/config/policy.json',
    'evolution/schemas/trace.schema.json',
    'evolution/schemas/proposal.schema.json',
    'evolution/schemas/evaluation-run.schema.json',
    'evolution/schemas/gate-result.schema.json',
    'evolution/wiki/INDEX.md',
    'evolution/wiki/patterns/PATTERN_TEMPLATE.md'
  ];
  for (const file of requiredFiles) if (!fs.existsSync(path.join(root, file))) fail(`Missing evolution file: ${file}`);

  const policy = readJson(path.join(root, 'evolution/config/policy.json'));
  if (!policy.primary_metric || !policy.require_human_release_approval || !policy.retain_rejected_proposal_record) fail('Evolution policy is missing mandatory governance');
  for (const stage of ['validation', 'holdout']) {
    if (!(stage in policy.minimum_sample_size) || !(stage in policy.minimum_primary_delta)) fail(`Evolution policy missing stage: ${stage}`);
  }

  const schemas = ['trace', 'proposal', 'evaluation-run', 'gate-result'].map((name) => readJson(path.join(root, `evolution/schemas/${name}.schema.json`)));
  for (const schema of schemas) if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema' || !Array.isArray(schema.required)) fail(`Invalid evolution schema: ${schema.title ?? 'unknown'}`);

  const purpose = fs.readFileSync(path.join(root, 'PURPOSE.md'), 'utf8');
  const patternFiles = fs.readdirSync(path.join(root, 'evolution/wiki/patterns')).filter((name) => name.startsWith('PAT-BASE-') && name.endsWith('.md'));
  const patternIds = [];
  for (const file of patternFiles) {
    const text = fs.readFileSync(path.join(root, 'evolution/wiki/patterns', file), 'utf8');
    const match = text.match(/^---\n([\s\S]*?)\n---/);
    if (!match) fail(`Pattern missing frontmatter: ${file}`);
    const id = match[1].match(/^pattern_id:\s*(\S+)$/m)?.[1];
    if (!id) fail(`Pattern missing pattern_id: ${file}`);
    if (!/^origin:\s*(baseline_policy|trace_compilation)$/m.test(match[1])) fail(`Pattern missing valid origin: ${file}`);
    for (const heading of ['## Evidence', '## Root cause', '## Actionable workaround', '## Safety and non-regression constraints']) if (!text.includes(heading)) fail(`Pattern ${id} missing section: ${heading}`);
    if (!purpose.includes(`\`${id}\``)) fail(`PURPOSE.md does not cite ${id}`);
    patternIds.push(id);
  }
  if (patternIds.length < 3 || new Set(patternIds).size !== patternIds.length) fail('Expected at least three unique seed patterns');

  for (const example of ['trace.example.json', 'proposal.example.json', 'baseline-validation.example.json', 'candidate-validation.example.json']) readJson(path.join(root, 'evolution/examples', example));
  for (const script of ['evolution-init.mjs', 'evolution-capture.mjs', 'evolution-gate.mjs', 'evolution-record.mjs']) if (!fs.existsSync(path.join(root, 'scripts', script))) fail(`Missing evolution script: ${script}`);
  if (!fs.readFileSync(path.join(root, '.gitignore'), 'utf8').includes('.runtime/')) fail('.runtime/ must be ignored');
  if (fs.existsSync(path.join(root, '.runtime'))) fail('Private evolution state must not be committed to the repository');

  console.log(JSON.stringify({ status: 'ok', schemas: schemas.length, seed_patterns: patternIds.length, private_runtime_committed: false, human_release_gate: true }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
