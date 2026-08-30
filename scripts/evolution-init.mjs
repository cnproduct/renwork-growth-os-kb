#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFlags, writeJsonExclusive } from './evolution-lib.mjs';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
  const flags = parseFlags(process.argv.slice(2));
  if (!flags.state) throw new Error('Usage: node scripts/evolution-init.mjs --state <private-state-directory>');
  const stateRoot = path.resolve(flags.state);
  if (stateRoot === path.parse(stateRoot).root) throw new Error('Refusing to initialize a filesystem root');
  if (fs.existsSync(stateRoot) && fs.readdirSync(stateRoot).length > 0) throw new Error(`Refusing to overwrite non-empty state directory: ${stateRoot}`);

  fs.mkdirSync(stateRoot, { recursive: true });
  for (const directory of ['raw', 'candidates', 'eval-results']) fs.mkdirSync(path.join(stateRoot, directory), { recursive: true });
  fs.cpSync(path.join(skillRoot, 'evolution', 'wiki'), path.join(stateRoot, 'wiki'), { recursive: true });
  fs.mkdirSync(path.join(stateRoot, 'config'), { recursive: true });
  fs.copyFileSync(path.join(skillRoot, 'evolution', 'config', 'policy.json'), path.join(stateRoot, 'config', 'policy.json'), fs.constants.COPYFILE_EXCL);
  fs.writeFileSync(path.join(stateRoot, 'wiki', 'evolution-log.jsonl'), '', { flag: 'wx' });
  fs.writeFileSync(path.join(stateRoot, 'wiki', 'skill-impact.jsonl'), '', { flag: 'wx' });
  writeJsonExclusive(path.join(stateRoot, 'state.json'), {
    schema_version: '1.0.0',
    created_at: new Date().toISOString(),
    created_by: 'renwork-growth-os-kb@1.2.0',
    status: 'PRIVATE_EVOLUTION_STATE',
    active_skill: 'renwork-growth-os-kb'
  });

  console.log(JSON.stringify({ status: 'ok', state: stateRoot, raw_committed: false }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
