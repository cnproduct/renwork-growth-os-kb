#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kbRoot = path.resolve(process.argv[2] ?? path.join(skillRoot, 'assets', 'starter-kit'));
const fail = (message) => { throw new Error(message); };
const readText = (relativePath) => fs.readFileSync(path.join(kbRoot, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));

const requiredFiles = [
  'README.md',
  'KNOWLEDGE_MAP.md',
  'ROADMAP.md',
  'WEBSITE_KB_MAP.md',
  'MODULE_STATUS.json',
  'module-catalog.json',
  '00_kb_governance/POLICY.md',
  '01_sources_permissions/SOURCE_REGISTRY.json',
  '02_company_identity/CAPABILITY_STATUS.md',
  'cards/knowledge_cards.json',
  'schemas/knowledge-card.schema.json',
  'industry-packs/industry-pack.schema.json',
  'industry-packs/export-b2b.json',
  'industry-packs/general-industry-template.json',
  'evals/golden_cases.json'
];

const requiredCardFields = [
  'kb_id', 'tenant_id', 'revision', 'module', 'knowledge_kind', 'entity_type', 'entity_id', 'title',
  'language', 'status', 'confidence', 'confidence_basis', 'sensitivity', 'public_claim_approved', 'role_views',
  'conclusion', 'conditions', 'source_refs', 'recommended_actions', 'red_lines', 'pending_confirmations',
  'created_at', 'updated_at'
];

const allowedCardStatuses = new Set([
  'verified_fact', 'public_fact', 'ai_inference', 'strategy_recommendation',
  'pending_supplement', 'deprecated', 'conflicted'
]);
const allowedSensitivities = new Set(['public', 'internal', 'restricted']);
const allowedPackStatuses = new Set([
  'DRAFT', 'RESEARCH', 'PILOT', 'ACTIVE', 'AVAILABLE_AS_PROFILE',
  'PLANNED', 'FUTURE_RESEARCH', 'DEPRECATED'
]);

try {
  if (!fs.existsSync(kbRoot) || !fs.statSync(kbRoot).isDirectory()) fail(`Knowledge-base directory not found: ${kbRoot}`);
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(kbRoot, file))) fail(`Missing required file: ${file}`);
  }

  const catalog = readJson('module-catalog.json');
  if (!Array.isArray(catalog.modules) || catalog.modules.length !== 21) fail('module-catalog.json must contain exactly 21 modules');
  const catalogIds = catalog.modules.map((module) => module.id);
  if (new Set(catalogIds).size !== 21) fail('Module catalog IDs must be unique');
  for (const moduleId of catalogIds) {
    const moduleReadme = path.join(kbRoot, moduleId, 'README.md');
    if (!fs.existsSync(moduleReadme)) fail(`Missing module README: ${moduleId}`);
    if (!fs.readFileSync(moduleReadme, 'utf8').includes(`module: ${moduleId}`)) fail(`Module frontmatter mismatch: ${moduleId}`);
  }

  const moduleStatus = readJson('MODULE_STATUS.json');
  if (!Array.isArray(moduleStatus.modules) || moduleStatus.modules.length !== 21) fail('MODULE_STATUS.json must contain exactly 21 modules');
  const statusIds = moduleStatus.modules.map((module) => module.id);
  if (new Set(statusIds).size !== 21) fail('MODULE_STATUS module IDs must be unique');
  for (const id of catalogIds) if (!statusIds.includes(id)) fail(`MODULE_STATUS missing module: ${id}`);

  const cards = readJson('cards/knowledge_cards.json');
  if (!Array.isArray(cards) || cards.length < 10) fail('Expected at least 10 starter knowledge cards');
  const cardIds = new Set();
  for (const card of cards) {
    for (const field of requiredCardFields) if (!(field in card)) fail(`Card ${card.kb_id ?? 'unknown'} missing field: ${field}`);
    if (!/^RW-[A-Z0-9]{6}-[0-9]{4,6}$/.test(card.kb_id)) fail(`Invalid card ID: ${card.kb_id}`);
    if (cardIds.has(card.kb_id)) fail(`Duplicate card ID: ${card.kb_id}`);
    cardIds.add(card.kb_id);
    if (!catalogIds.includes(card.module)) fail(`Card ${card.kb_id} uses unknown module: ${card.module}`);
    if (!allowedCardStatuses.has(card.status)) fail(`Card ${card.kb_id} has invalid status: ${card.status}`);
    if (!allowedSensitivities.has(card.sensitivity)) fail(`Card ${card.kb_id} has invalid sensitivity: ${card.sensitivity}`);
    if (typeof card.confidence !== 'number' || card.confidence < 0 || card.confidence > 1) fail(`Card ${card.kb_id} has invalid confidence`);
    if (!Array.isArray(card.source_refs)) fail(`Card ${card.kb_id} source_refs must be an array`);
    if (card.public_claim_approved && (card.sensitivity !== 'public' || !['verified_fact', 'public_fact'].includes(card.status))) {
      fail(`Unsafe public claim gate: ${card.kb_id}`);
    }
  }

  const registry = readJson('01_sources_permissions/SOURCE_REGISTRY.json');
  if (!Array.isArray(registry.sources) || registry.sources.length < 3) fail('Source registry must contain at least three sources');
  const sourceIds = registry.sources.map((source) => source.source_id);
  if (new Set(sourceIds).size !== sourceIds.length) fail('Source registry IDs must be unique');

  const evals = readJson('evals/golden_cases.json');
  if (!Array.isArray(evals.cases) || evals.cases.length < 20) fail('Expected at least 20 golden cases');
  const evalIds = evals.cases.map((item) => item.id);
  if (new Set(evalIds).size !== evalIds.length) fail('Golden case IDs must be unique');

  for (const file of ['industry-packs/export-b2b.json', 'industry-packs/general-industry-template.json']) {
    const pack = readJson(file);
    for (const field of ['pack_id', 'version', 'status', 'name_zh', 'core_version', 'target_organizations', 'object_aliases', 'required_fields_by_module', 'hard_stops', 'eval_case_ids', 'source_refs', 'public_claim_approved']) {
      if (!(field in pack)) fail(`Industry pack ${file} missing field: ${field}`);
    }
    if (!allowedPackStatuses.has(pack.status)) fail(`Industry pack ${file} has invalid status: ${pack.status}`);
    for (const evalId of pack.eval_case_ids) if (!evalIds.includes(evalId)) fail(`Industry pack ${file} references missing eval: ${evalId}`);
  }

  const markdownFiles = [];
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.md')) markdownFiles.push(fullPath);
    }
  };
  walk(kbRoot);
  for (const file of markdownFiles) {
    const fences = (fs.readFileSync(file, 'utf8').match(/^```/gm) ?? []).length;
    if (fences % 2 !== 0) fail(`Unbalanced Markdown code fence: ${path.relative(kbRoot, file)}`);
  }

  console.log(JSON.stringify({
    status: 'ok',
    root: kbRoot,
    modules: catalogIds.length,
    cards: cards.length,
    public_claims_approved: cards.filter((card) => card.public_claim_approved).length,
    sources: registry.sources.length,
    industry_packs_validated: 2,
    golden_cases: evals.cases.length,
    markdown_files_checked: markdownFiles.length
  }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
