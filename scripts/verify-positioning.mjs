import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const dist = join(project, 'dist');
const errors = [];
const read = path => readFile(join(project, path), 'utf8');

const home = await readFile(join(dist, 'index.html'), 'utf8');
if (!home.includes('Give AI a safer way to work on your site.')) errors.push('locked homepage hero changed or missing');
if (!home.includes('No SSH? No SFTP?')) errors.push('homepage admin-only section missing');
if (!home.includes('not a replacement for server access')) errors.push('homepage server-access limitation missing');

const useCase = await readFile(join(dist, 'use-cases/wordpress-admin-only/index.html'), 'utf8');
for (const requirement of [
  'WordPress Admin-only workflow',
  'SiteRadian provides a governed path',
  'Server work remains server work.',
  'Operating-system administration',
  '/docs/getting-started/',
  '/docs/scoped-access/',
  '/security/',
  '/integrations/',
  '/support/',
]) {
  if (!useCase.includes(requirement)) errors.push(`use-case page missing: ${requirement}`);
}
if (!useCase.includes('<link rel="canonical" href="https://mosharafmanu.github.io/siteradian/use-cases/wordpress-admin-only/"')) errors.push('use-case canonical URL missing');
if (!useCase.includes('<meta property="og:title"')) errors.push('use-case Open Graph metadata missing');
const sitemap = await readFile(join(dist, 'sitemap-0.xml'), 'utf8');
if (!sitemap.includes('/siteradian/use-cases/wordpress-admin-only/')) errors.push('use-case page missing from sitemap');

const faq = await readFile(join(dist, 'faq/index.html'), 'utf8');
for (const question of ['Does SiteRadian require SSH, FTP, or SFTP?', 'Does SiteRadian replace SSH or SFTP?']) {
  if (!faq.includes(question)) errors.push(`FAQ missing: ${question}`);
}
if (!faq.includes('FAQPage')) errors.push('FAQ structured data missing');

const gettingStarted = await readFile(join(dist, 'docs/getting-started/index.html'), 'utf8');
const installation = await readFile(join(dist, 'docs/installation/index.html'), 'utf8');
if (!gettingStarted.includes('WordPress Admin access is enough to begin')) errors.push('Getting Started reassurance missing');
if (!installation.includes('A WordPress account allowed to install and activate plugins')) errors.push('installation capability boundary missing');

const integrationDirs = (await readdir(join(dist, 'integrations'), { withFileTypes: true })).filter(item => item.isDirectory());
let notes = 0;
for (const item of integrationDirs) {
  const html = await readFile(join(dist, 'integrations', item.name, 'index.html'), 'utf8');
  if (html.includes('WordPress Admin is enough for this connection path') && html.includes('Hosting and server-level work can still require direct infrastructure access')) notes += 1;
}
if (notes !== 12) errors.push(`expected bounded admin-access note on 12 integration tutorials, found ${notes}`);

const sourceFiles = ['src/pages/index.astro', 'src/pages/how-it-works.astro', 'src/pages/security.astro', 'src/pages/faq.astro', 'src/pages/use-cases/wordpress-admin-only.astro', 'src/data/docs.ts'];
const source = (await Promise.all(sourceFiles.map(read))).join('\n').toLowerCase();
for (const overclaim of ['siteradian replaces ssh', 'replace ssh forever', 'anything you can do with ssh', 'full server power from wp-admin', 'wordpress admin access gives complete server control']) {
  if (source.includes(overclaim)) errors.push(`prohibited overclaim present: ${overclaim}`);
}
if (!source.includes('supported operations')) errors.push('supported-operation boundary missing');
if (!source.includes('hosting control panel')) errors.push('server-level limitation detail missing');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Admin-only positioning contract: PASS');
console.log('Dedicated use-case and reciprocal links: PASS');
console.log('FAQ schema and documentation boundaries: PASS');
console.log('Integration tutorial note coverage: 12/12');
console.log('Prohibited server-access replacement claims: 0');
