import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const errors = [];

const walk = async directory => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
};

const forbiddenBrands = [
  'WP Command Center',
  'Action Steward',
  'SiteRadian AI',
  'ai-command-center',
];

const sourceFiles = (await walk(project)).filter(file =>
  !/(?:^|\/)(?:node_modules|dist|\.git|\.astro)(?:\/|$)/.test(file)
  && !file.endsWith('scripts/audit-terminology.mjs')
);
const publicFiles = (await walk(join(project, 'dist'))).filter(file =>
  file.endsWith('.html') || file.endsWith('.xml') || file.endsWith('.txt')
);

const readCorpus = async files => Promise.all(files.map(async file => ({
  file: relative(project, file),
  text: await readFile(file, 'utf8'),
})));
const source = await readCorpus(sourceFiles);
const published = await readCorpus(publicFiles);

for (const term of forbiddenBrands) {
  for (const item of [...source, ...published]) {
    if (item.text.toLowerCase().includes(term.toLowerCase())) {
      errors.push(`${item.file}: obsolete public identity: ${term}`);
    }
  }
}

const sourceText = source.map(item => item.text).join('\n');
const publishedText = published.map(item => item.text).join('\n');
const authoredText = source.filter(item => !item.file.startsWith('scripts/')).map(item => item.text).join('\n');
const count = (text, pattern) => (text.match(pattern) || []).length;
const expectedCounts = [
  ['authored REST namespace', count(authoredText, /wp-command-center\/v1/g), 2],
  ['rendered REST namespace', count(publishedText, /wp-command-center\/v1/g), 13],
  ['authored read-only error code', count(authoredText, /wpcc_token_read_only/g), 1],
  ['rendered read-only error code', count(publishedText, /wpcc_token_read_only/g), 1],
  ['authored capability error code', count(authoredText, /wpcc_capability_denied/g), 1],
  ['rendered capability error code', count(publishedText, /wpcc_capability_denied/g), 1],
];
for (const [label, actual, expected] of expectedCounts) {
  if (actual !== expected) errors.push(`${label}: expected ${expected}, found ${actual}`);
}
if (!sourceText.includes('stable REST compatibility namespace')) errors.push('REST namespace lacks a compatibility explanation');
if (!sourceText.includes('For developers</strong>API responses may include compatibility error codes')) errors.push('API error codes lack developer context');

const sourceAllowlist = new Map([
  ['src/data/integrations.ts', [/wp-command-center\/v1/g]],
  ['src/pages/integrations/index.astro', [/wp-command-center\/v1/g]],
  ['src/data/docs.ts', [/wpcc_token_read_only/g, /wpcc_capability_denied/g]],
  ['scripts/browser-qa.mjs', [/wpcc_token_read_only/g]],
]);
const publishedAllowlist = new Map([
  ['dist/integrations/index.html', [/wp-command-center\/v1/g]],
  ['dist/docs/scoped-access/index.html', [/wpcc_token_read_only/g, /wpcc_capability_denied/g]],
]);

for (const item of source) {
  const technical = item.text.match(/wp-command-center(?:\/v1)?|wpcc:\/\/|wpcc_[A-Za-z0-9_]+|WPCC_TOKEN|\bWPCC\b|\bwpcc\b/g) || [];
  if (!technical.length) continue;
  const permitted = sourceAllowlist.get(item.file) || [];
  for (const value of technical) {
    if (!permitted.some(pattern => pattern.test(value))) errors.push(`${item.file}: unexplained compatibility identifier: ${value}`);
    permitted.forEach(pattern => { pattern.lastIndex = 0; });
  }
}

for (const item of published) {
  const technical = item.text.match(/wp-command-center(?:\/v1)?|wpcc:\/\/|wpcc_[A-Za-z0-9_]+|WPCC_TOKEN|\bWPCC\b|\bwpcc\b/g) || [];
  if (!technical.length) continue;
  const integrationTutorial = /^dist\/integrations\/[^/]+\/index\.html$/.test(item.file)
    && item.file !== 'dist/integrations/index.html';
  const permitted = integrationTutorial ? [/wp-command-center\/v1/g] : (publishedAllowlist.get(item.file) || []);
  for (const value of technical) {
    if (!permitted.some(pattern => pattern.test(value))) errors.push(`${item.file}: unexplained published compatibility identifier: ${value}`);
    permitted.forEach(pattern => { pattern.lastIndex = 0; });
  }
}

const tutorialSource = await readFile(join(project, 'src/data/integrations.ts'), 'utf8');
for (const required of ["'siteradian'", 'SITERADIAN_TOKEN', 'siteradian_REPLACE_WITH_YOUR_TOKEN']) {
  if (!tutorialSource.includes(required)) errors.push(`current setup identity missing: ${required}`);
}
for (const obsolete of ['WPCC_TOKEN', "mcp add 'wp-command-center'"]) {
  if (tutorialSource.includes(obsolete)) errors.push(`obsolete setup identity present: ${obsolete}`);
}
const { integrations } = await import(new URL('../src/data/integrations.ts', import.meta.url));
if (integrations.length !== 12) errors.push(`expected 12 integration definitions, found ${integrations.length}`);
for (const integration of integrations) {
  if (!integration.code.includes('siteradian')) errors.push(`${integration.slug}: SiteRadian-native alias/config key missing`);
  if (!integration.code.includes('siteradian_REPLACE_WITH_YOUR_TOKEN')) errors.push(`${integration.slug}: current token placeholder missing`);
  if (/WPCC_TOKEN|["']wp-command-center["']/.test(integration.code)) errors.push(`${integration.slug}: obsolete new-user setup identity`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Public terminology audit: PASS');
console.log('Unexplained obsolete brand occurrences: 0');
console.log('Required compatibility families allowlisted: REST namespace, API error codes');
console.log('Reviewed compatibility occurrences: 4 authored, 15 rendered');
console.log('Current setup identity verified across 12 tutorials: siteradian, SITERADIAN_TOKEN where applicable, siteradian_');
