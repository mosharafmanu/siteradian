import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const base = '/siteradian';
const errors = [];
let assetCount = 0;

const walk = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
};

const files = await walk(root);
const relativeFiles = new Set(files.map(file => relative(root, file)));
const targetFor = value => {
  const clean = value.split('#')[0].split('?')[0];
  if (!clean || /^(https?:|mailto:|tel:|data:|javascript:)/.test(clean)) return null;
  let local = clean;
  if (local.startsWith(base)) local = local.slice(base.length);
  if (local.startsWith('/')) local = local.slice(1);
  if (!local) return 'index.html';
  if (local.endsWith('/')) return local + 'index.html';
  if (!extname(local)) return local + '/index.html';
  return local;
};

for (const file of files) {
  const rel = relative(root, file);
  if (!rel.endsWith('.html')) {
    assetCount += 1;
    continue;
  }
  const html = await readFile(file, 'utf8');
  const requirements = [
    ['title', /<title>[^<]{8,}<\/title>/],
    ['description', /<meta name="description" content="[^"]{20,}"/],
    ['canonical', /<link rel="canonical" href="https:\/\/mosharafmanu\.github\.io\/siteradian\//],
    ['Open Graph title', /<meta property="og:title"/],
    ['main landmark', /<main id="main-content"/],
  ];
  for (const requirement of requirements) {
    if (!requirement[1].test(html)) errors.push(rel + ': missing ' + requirement[0]);
  }
  const refs = [...html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)].map(match => match[1].split(/\s+/)[0]);
  for (const ref of refs) {
    const target = targetFor(ref);
    if (target && !relativeFiles.has(target)) errors.push(rel + ': broken reference ' + ref + ' -> ' + target);
  }
}

const pageCount = [...relativeFiles].filter(file => file.endsWith('.html')).length;
const integrationCount = [...relativeFiles].filter(file => /^integrations\/[^/]+\/index\.html$/.test(file)).length;
const docsCount = [...relativeFiles].filter(file => /^docs\/[^/]+\/index\.html$/.test(file)).length;
if (integrationCount !== 12) errors.push('expected 12 integration tutorials, found ' + integrationCount);
if (docsCount !== 11) errors.push('expected 11 documentation guides, found ' + docsCount);
for (const required of ['404.html', 'robots.txt', 'sitemap-index.xml', 'pagefind/pagefind.js', 'pagefind/pagefind-ui.js']) {
  if (!relativeFiles.has(required)) errors.push('missing required output: ' + required);
}

const corpus = await Promise.all(files.filter(file => !/\.(png|webp)$/i.test(file)).map(file => readFile(file, 'utf8').catch(() => '')));
const published = corpus.join('\n');
for (const forbidden of ['/Users/', '/home/', 'AMPPS', 'ClientProjects', 'private release evidence']) {
  if (published.includes(forbidden)) errors.push('private/internal evidence marker published: ' + forbidden);
}
if (!published.includes('WordPress.org approval pending') || published.includes('Download now from WordPress.org')) {
  errors.push('WordPress.org pending state is absent or overstated');
}
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /AKIA[A-Z0-9]{16}/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /xox[baprs]-[A-Za-z0-9-]{20,}/,
  /siteradian_(?!REPLACE_WITH_YOUR_TOKEN)[A-Za-z0-9_-]{30,}/,
];
secretPatterns.forEach(pattern => {
  if (pattern.test(published)) errors.push('possible secret matched ' + String(pattern));
});

const totalBytes = (await Promise.all(files.map(file => stat(file)))).reduce((sum, item) => sum + item.size, 0);
console.log('Verified ' + pageCount + ' HTML pages, ' + assetCount + ' generated assets, ' + integrationCount + ' integration tutorials, and ' + docsCount + ' documentation guides.');
console.log('Static output: ' + files.length + ' files, ' + totalBytes + ' bytes.');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Broken internal links: 0');
console.log('Broken asset references: 0');
console.log('Private/internal evidence findings: 0');
console.log('High-confidence secret findings: 0');
