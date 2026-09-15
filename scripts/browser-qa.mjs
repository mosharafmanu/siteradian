import { chromium } from '@playwright/test';

const baseUrl = process.env.SITERADIAN_QA_URL || 'http://127.0.0.1:4321/siteradian';
const executablePath = process.env.CHROMIUM_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const widths = [1440, 1180, 900, 768, 480, 390];
const problems = [];
const browser = await chromium.launch({ executablePath, headless: true });

const auditPage = async (page, label) => {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  if (overflow.document > overflow.viewport + 1) {
    problems.push(`${label}: horizontal overflow ${overflow.document}px > ${overflow.viewport}px`);
  }
};

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  page.on('console', message => {
    if (message.type() === 'error') problems.push(`${width}px console: ${message.text()}`);
  });
  page.on('pageerror', error => problems.push(`${width}px page error: ${error.message}`));
  page.on('response', response => {
    if (response.status() >= 400) problems.push(`${width}px HTTP ${response.status()}: ${response.url()}`);
  });

  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px home`);
  if (await page.locator('main h1').innerText() !== 'Give AI a safer way to work on your site.') {
    problems.push(`${width}px home: locked value proposition missing`);
  }
  if (await page.locator('.logo-chip').count() !== 12) problems.push(`${width}px home: expected 12 assistant links`);
  if (width > 900 && !(await page.getByRole('link', { name: 'Support', exact: true }).first().isVisible())) problems.push(`${width}px home: Support navigation is hidden`);
  if (!(await page.getByRole('heading', { name: /No SSH\? No SFTP\?/ }).isVisible())) problems.push(`${width}px home: admin-only positioning is not discoverable`);
  if (!(await page.getByText('It is an alternative path for supported WordPress operations—not a replacement for server access.').isVisible())) problems.push(`${width}px home: server-access boundary is missing`);

  if (width <= 900) {
    const menuButton = page.getByRole('button', { name: 'Open navigation' });
    await menuButton.click();
    if (await menuButton.getAttribute('aria-expanded') !== 'true') problems.push(`${width}px: mobile navigation did not open`);
    if (!(await page.getByRole('navigation', { name: 'Primary navigation' }).isVisible())) problems.push(`${width}px: opened navigation is not visible`);
    await page.keyboard.press('Escape');
    if (await menuButton.getAttribute('aria-expanded') !== 'false') problems.push(`${width}px: Escape did not close navigation`);
  }

  await page.goto(`${baseUrl}/how-it-works/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px how it works`);
  if (!(await page.getByRole('heading', { name: 'A governed path when server access is not available.' }).isVisible())) problems.push(`${width}px how it works: admin-only architecture missing`);

  await page.goto(`${baseUrl}/use-cases/wordpress-admin-only/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px admin-only use case`);
  if (!(await page.getByRole('heading', { name: 'Serious WordPress work with the access you already have.' }).isVisible())) problems.push(`${width}px use case: primary message missing`);
  if (!(await page.getByRole('heading', { name: 'Server work remains server work.' }).isVisible())) problems.push(`${width}px use case: limitations are not visible`);

  await page.goto(`${baseUrl}/faq/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px FAQ`);
  if (!(await page.getByText('Does SiteRadian require SSH, FTP, or SFTP?').isVisible())) problems.push(`${width}px FAQ: access requirement question missing`);

  await page.goto(`${baseUrl}/security/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px security`);
  if (!(await page.getByRole('heading', { name: 'Avoid sharing server credentials when the work does not need them.' }).isVisible())) problems.push(`${width}px security: least-access positioning missing`);

  await page.goto(`${baseUrl}/integrations/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px integrations`);
  if (await page.locator('.integration-card').count() !== 12) problems.push(`${width}px integrations: expected 12 client cards`);

  await page.goto(`${baseUrl}/docs/getting-started/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px docs`);
  if (width <= 900 && !(await page.locator('.docs-mobile-nav').isVisible())) problems.push(`${width}px docs: mobile docs navigation is hidden`);
  const copy = page.getByRole('button', { name: 'Copy code' }).first();
  if (!(await copy.isVisible())) problems.push(`${width}px docs: code copy control is hidden`);
  else {
    await copy.focus();
    if (!(await copy.evaluate(element => element.matches(':focus-visible')))) problems.push(`${width}px docs: copy control has no focus-visible state`);
    await copy.click();
    await page.waitForTimeout(100);
    if (!['Copied', 'Select and copy'].includes(await copy.innerText())) problems.push(`${width}px docs: copy control did not respond`);
  }

  await page.goto(`${baseUrl}/support/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px support`);
  if (await page.locator('.support-route-card').count() !== 6) problems.push(`${width}px support: expected 6 routing cards`);
  const firstSupportRoute = page.locator('.support-route-link').first();
  await firstSupportRoute.focus();
  if (!(await firstSupportRoute.evaluate(element => element.matches(':focus-visible')))) problems.push(`${width}px support: route link has no focus-visible state`);
  if (!(await page.getByRole('link', { name: /Report privately/ }).isVisible())) problems.push(`${width}px support: private security route is hidden`);
  const privateHref = await page.getByRole('link', { name: /Report privately/ }).getAttribute('href');
  if (!privateHref?.endsWith('/security/advisories/new')) problems.push(`${width}px support: private security route is incorrect`);
  const pendingSupport = page.locator('#community-support').getByRole('link', { name: /WordPress.org approval pending/ });
  if (!(await pendingSupport.isVisible()) || (await pendingSupport.getAttribute('aria-disabled')) !== 'true') problems.push(`${width}px support: pending WordPress.org state is incorrect`);

  await page.goto(`${baseUrl}/integrations/codex-cli/`, { waitUntil: 'networkidle' });
  await auditPage(page, `${width}px integration support`);
  if (!(await page.getByRole('heading', { name: 'Still having trouble connecting Codex CLI?' }).isVisible())) problems.push(`${width}px integration: contextual support route is missing`);

  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1180, height: 900 } });
const page = await context.newPage();
page.on('console', message => {
  if (message.type() === 'error') problems.push(`search console: ${message.text()}`);
});
page.on('pageerror', error => problems.push(`search page error: ${error.message}`));
await page.goto(`${baseUrl}/search/`, { waitUntil: 'networkidle' });
const search = page.locator('.pagefind-ui__search-input');
if (!(await search.isVisible())) problems.push('search: Pagefind input is not visible');
else {
  await search.fill('approval');
  await page.locator('.pagefind-ui__result').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  if (await page.locator('.pagefind-ui__result').count() === 0) problems.push('search: no results for approval');
  await search.fill('wpcc_token_read_only');
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.pagefind-ui__result-link')].some(link => link.textContent?.includes('Scoped access')),
    undefined,
    { timeout: 10000 },
  ).catch(() => {});
  const technicalResults = await page.locator('.pagefind-ui__result-link').allTextContents();
  if (!technicalResults.some(title => title.includes('Scoped access'))) problems.push('search: compatibility error code is not discoverable');
  for (const query of ['token missing', 'Codex not connecting', 'permission denied', 'report bug', 'security vulnerability']) {
    await search.fill(query);
    await page.waitForFunction(() => document.querySelectorAll('.pagefind-ui__result').length > 0, undefined, { timeout: 10000 }).catch(() => {});
    if (await page.locator('.pagefind-ui__result').count() === 0) problems.push(`search: no results for ${query}`);
  }
  for (const query of ['SSH', 'SFTP', 'FTP', 'no SSH', 'WordPress Admin access', 'server access']) {
    await search.fill(query);
    await page.waitForFunction(() => [...document.querySelectorAll('.pagefind-ui__result-link')].some(link =>
      /use-cases\/wordpress-admin-only|\/faq\/|docs\/(?:getting-started|installation)\//.test(link.getAttribute('href') || '')
    ), undefined, { timeout: 10000 }).catch(() => {});
    const useful = await page.locator('.pagefind-ui__result-link').evaluateAll(links => links.some(link =>
      /use-cases\/wordpress-admin-only|\/faq\/|docs\/(?:getting-started|installation)\//.test(link.getAttribute('href') || '')
    ));
    if (!useful) {
      problems.push(`search: no useful admin-only result for ${query}`);
    }
  }
}
await page.goto(`${baseUrl}/404.html`, { waitUntil: 'networkidle' });
if ((await page.locator('main h1').innerText()).trim() !== 'This page is not in scope.') problems.push('404: branded error page missing');
await context.close();
await browser.close();

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Browser QA passed at ${widths.join(', ')}px.`);
console.log('Horizontal overflow: 0');
console.log('Console/page errors: 0');
console.log('Failed assets/HTTP responses: 0');
console.log('Mobile navigation, admin-only positioning, docs navigation, support routing, code copy, search intents, 404, and all 12 integrations: PASS');
