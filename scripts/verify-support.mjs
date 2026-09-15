import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const dist = join(project, 'dist');
const errors = [];
const read = path => readFile(join(project, path), 'utf8');

const requiredForms = [
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/ISSUE_TEMPLATE/docs_issue.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
];

const forms = Object.fromEntries(await Promise.all(requiredForms.map(async path => [path, await read(path)])));
for (const [path, contents] of Object.entries(forms)) {
  if (!contents.trim()) errors.push(`${path}: empty`);
}
const bug = forms[requiredForms[0]];
for (const required of ['SiteRadian version', 'WordPress version', 'Affected integration', 'Protection mode', 'Sanitized logs or error codes', 'Sensitive-data check']) {
  if (!bug.includes(required)) errors.push(`bug form missing ${required}`);
}
for (const client of ['Codex in ChatGPT Desktop', 'Codex CLI', 'Claude Desktop', 'Claude Code', 'Antigravity CLI', 'Gemini CLI', 'Cursor', 'Continue for VS Code', 'GitHub Copilot in VS Code', 'OpenCode', 'Command Code', 'Muse Code']) {
  if (!bug.includes(client)) errors.push(`bug form missing integration: ${client}`);
}
const issueConfig = forms[requiredForms[3]];
if (!/blank_issues_enabled:\s*false/.test(issueConfig)) errors.push('blank issues are not disabled');
if (!issueConfig.includes('/security/advisories/new')) errors.push('issue config missing private security route');

const siteData = await read('src/data/site.ts');
if (!siteData.includes("status: 'pending'")) errors.push('central WordPress.org status is not pending');
if (!siteData.includes('https://wordpress.org/support/plugin/siteradian/')) errors.push('central approved-state support URL is missing');
if (!siteData.includes("siteConfig.wordpressOrg.status === 'approved'")) errors.push('WordPress.org support state is not derived from central configuration');

const supportHtml = await readFile(join(dist, 'support/index.html'), 'utf8');
for (const required of ['Learn SiteRadian', 'Fix a problem', 'Ask a usage question', 'Report reproducible behavior', 'Suggest an improvement', 'Report a vulnerability']) {
  if (!supportHtml.includes(required)) errors.push(`support page missing route: ${required}`);
}
if (!supportHtml.includes('WordPress.org support will be available after directory approval.')) errors.push('pending WordPress.org support state missing');
if (supportHtml.includes('https://wordpress.org/support/plugin/siteradian/')) errors.push('pending support page exposes WordPress.org forum as active');
if (!supportHtml.includes('/security/advisories/new')) errors.push('support page missing private vulnerability route');

const tutorialDirs = (await readdir(join(dist, 'integrations'), { withFileTypes: true })).filter(item => item.isDirectory());
let tutorialsWithHelp = 0;
for (const directory of tutorialDirs) {
  const html = await readFile(join(dist, 'integrations', directory.name, 'index.html'), 'utf8');
  if (html.includes('Still having trouble connecting') && html.includes('/docs/troubleshooting/') && html.includes('/support/')) tutorialsWithHelp += 1;
}
if (tutorialsWithHelp !== 12) errors.push(`expected reusable help route on 12 tutorials, found ${tutorialsWithHelp}`);

const security = await read('SECURITY.md');
if (!security.includes('/security/advisories/new')) errors.push('SECURITY.md missing private vulnerability reporting');
if (/open a public issue.{0,80}vulnerabilit/i.test(security)) errors.push('SECURITY.md may direct vulnerabilities to public issues');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Support Center routes: 6/6');
console.log('Integration tutorial help routes: 12/12');
console.log('Issue forms/config: PASS');
console.log('Private vulnerability routing: PASS');
console.log('WordPress.org pending support state: PASS');
console.log('WordPress.org approved-state switch: PASS');
