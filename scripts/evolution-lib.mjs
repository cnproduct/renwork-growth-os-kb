import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export function parseFlags(argv) {
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for --${key}`);
    flags[key] = value;
    index += 1;
  }
  return flags;
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function hashObject(value) {
  const serialized = JSON.stringify(canonicalize(value));
  return `sha256:${crypto.createHash('sha256').update(serialized).digest('hex')}`;
}

export function assertSafeSegment(value, label) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{1,79}$/.test(value)) {
    throw new Error(`${label} must be a safe 2-80 character identifier`);
  }
}

export function writeJsonExclusive(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
}

const hiddenReasoningKeys = new Set(['reasoning', 'chain_of_thought', 'thinking', 'cot']);

export function rejectHiddenReasoning(value, location = '$') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => rejectHiddenReasoning(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (hiddenReasoningKeys.has(key.toLowerCase())) {
      throw new Error(`Hidden reasoning field is prohibited at ${location}.${key}; use a concise decision_summary instead`);
    }
    rejectHiddenReasoning(item, `${location}.${key}`);
  }
}

const sensitiveKey = /(password|passphrase|secret|api[_-]?key|access[_-]?token|refresh[_-]?token|authorization|private[_-]?key|phone|mobile|telephone)/i;

function redactString(value) {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]{8,}/gi, 'Bearer [REDACTED_SECRET]')
    .replace(/\b(?:sk|rk)-[A-Za-z0-9_-]{12,}\b/g, '[REDACTED_SECRET]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]');
}

export function redactTrace(value, key = '') {
  if (sensitiveKey.test(key)) return '[REDACTED_SECRET]';
  if (Array.isArray(value)) return value.map((item) => redactTrace(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [childKey, redactTrace(item, childKey)]));
  }
  if (typeof value === 'string') return redactString(value);
  return value;
}

export function appendJsonlIdempotent(filePath, record, idField) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath)) {
    const records = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
    const existing = records.find((item) => item[idField] === record[idField]);
    if (existing) {
      if (existing.record_hash !== record.record_hash) throw new Error(`Conflicting append-only record: ${record[idField]}`);
      return { status: 'idempotent', record: existing };
    }
  }
  fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`);
  return { status: 'appended', record };
}
