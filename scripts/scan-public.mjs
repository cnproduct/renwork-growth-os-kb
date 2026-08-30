#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? '.');
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const patterns = [
  { name: 'macOS absolute user path', regex: /\/Users\//g },
  { name: 'cloud storage path', regex: /CloudStorage/g },
  { name: 'workspace-only URI', regex: /workspace-external:/g },
  { name: 'conversation-only URI', regex: /conversation(?:-history)?:/g },
  { name: 'GitHub token', regex: /gh[pousr]_[A-Za-z0-9_]{20,}/g },
  { name: 'generic API secret', regex: /\b(?:sk|rk)-[A-Za-z0-9_-]{20,}\b/g },
  { name: 'private key', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'internal tenant name', regex: /耐科|盛和塾/g }
];
const findings = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (path.relative(root, fullPath) === path.join('scripts', 'scan-public.mjs')) continue;
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!entry.isFile() || fs.statSync(fullPath).size > 2_000_000) continue;
    const buffer = fs.readFileSync(fullPath);
    if (buffer.includes(0)) continue;
    const source = buffer.toString('utf8');
    for (const pattern of patterns) {
      if (pattern.regex.test(source)) findings.push({ file: path.relative(root, fullPath), pattern: pattern.name });
      pattern.regex.lastIndex = 0;
    }
  }
}

walk(root);
if (findings.length > 0) {
  console.error(JSON.stringify({ status: 'failed', findings }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status: 'ok', root, checks: patterns.map((pattern) => pattern.name) }, null, 2));
