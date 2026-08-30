#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = path.join(root, 'SKILL.md');
const agentPath = path.join(root, 'agents', 'openai.yaml');
const fail = (message) => { throw new Error(message); };

try {
  const skill = fs.readFileSync(skillPath, 'utf8');
  const match = skill.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) fail('SKILL.md is missing YAML frontmatter');
  if (!/^name:\s*renwork-growth-os-kb\s*$/m.test(match[1])) fail('SKILL.md name mismatch');
  if (!/^description:\s*\S.+$/m.test(match[1])) fail('SKILL.md description is missing');
  if (/\[TODO[^\]]*\]|TODO:/i.test(skill)) fail('SKILL.md contains unfinished placeholders');
  const references = ['architecture.md', 'evidence-governance.md', 'industry-pack-authoring.md', 'publishing-and-operations.md', 'wikiskill-adaptation.md'];
  for (const reference of references) {
    if (!skill.includes(`references/${reference}`)) fail(`SKILL.md does not route to ${reference}`);
    if (!fs.existsSync(path.join(root, 'references', reference))) fail(`Missing reference: ${reference}`);
  }
  if (!fs.existsSync(agentPath)) fail('agents/openai.yaml is missing');
  const agent = fs.readFileSync(agentPath, 'utf8');
  if (!agent.includes('$renwork-growth-os-kb')) fail('Default prompt must mention $renwork-growth-os-kb');
  if (!fs.existsSync(path.join(root, 'PURPOSE.md'))) fail('PURPOSE.md is missing');
  if (!skill.includes('scripts/evolution-gate.mjs')) fail('SKILL.md must route the validation-gated evolution workflow');
  console.log(JSON.stringify({ status: 'ok', skill: 'renwork-growth-os-kb', references: references.length, evolution: true }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
