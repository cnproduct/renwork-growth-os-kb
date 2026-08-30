#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'renwork-kb-test-'));
const target = path.join(temporaryRoot, 'kb');

try {
  const bootstrap = spawnSync(process.execPath, [path.join(root, 'scripts', 'bootstrap-kb.mjs'), '--out', target, '--tenant', 'test-tenant', '--company', 'Test Company'], { encoding: 'utf8' });
  if (bootstrap.status !== 0) throw new Error(bootstrap.stderr || bootstrap.stdout);
  const validate = spawnSync(process.execPath, [path.join(root, 'scripts', 'validate-kb.mjs'), target], { encoding: 'utf8' });
  if (validate.status !== 0) throw new Error(validate.stderr || validate.stdout);

  const secondBootstrap = spawnSync(process.execPath, [path.join(root, 'scripts', 'bootstrap-kb.mjs'), '--out', target], { encoding: 'utf8' });
  if (secondBootstrap.status === 0 || !secondBootstrap.stderr.includes('Refusing to overwrite non-empty directory')) {
    throw new Error('Bootstrap overwrite guard did not activate');
  }

  const config = JSON.parse(fs.readFileSync(path.join(target, 'kb.config.json'), 'utf8'));
  if (config.tenant_id !== 'test-tenant' || config.company_name !== 'Test Company') throw new Error('Bootstrap config values are incorrect');
  console.log(JSON.stringify({ status: 'ok', bootstrap: true, validation: true, overwrite_guard: true }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
