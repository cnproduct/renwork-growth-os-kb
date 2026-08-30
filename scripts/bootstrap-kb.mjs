#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const starterRoot = path.join(skillRoot, 'assets', 'starter-kit');

function usage() {
  console.log('Usage: node scripts/bootstrap-kb.mjs --out <directory> [--tenant <id>] [--company <name>] [--industry <pack-id>]');
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for --${key}`);
    args[key] = value;
    index += 1;
  }
  return args;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (!args.out) {
    usage();
    process.exit(2);
  }

  const outputRoot = path.resolve(args.out);
  const parsed = path.parse(outputRoot);
  if (outputRoot === parsed.root) throw new Error('Refusing to use a filesystem root as output');
  if (!fs.existsSync(starterRoot)) throw new Error(`Starter kit is missing: ${starterRoot}`);

  if (fs.existsSync(outputRoot) && fs.readdirSync(outputRoot).length > 0) {
    throw new Error(`Refusing to overwrite non-empty directory: ${outputRoot}`);
  }

  fs.mkdirSync(outputRoot, { recursive: true });
  fs.cpSync(starterRoot, outputRoot, { recursive: true, errorOnExist: true, force: false });

  const config = {
    schema_version: '1.0.0',
    tenant_id: args.tenant ?? 'renwork-platform',
    company_name: args.company ?? 'RenWork',
    active_industry_pack: args.industry ?? 'export-b2b',
    generated_at: new Date().toISOString(),
    generated_by: 'renwork-growth-os-kb@1.0.0',
    status: 'LOCAL_BOOTSTRAP'
  };
  fs.writeFileSync(path.join(outputRoot, 'kb.config.json'), `${JSON.stringify(config, null, 2)}\n`, { flag: 'wx' });

  console.log(JSON.stringify({ status: 'ok', output: outputRoot, ...config }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
