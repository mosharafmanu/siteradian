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

  if (width <= 900) {
    const menuButton = page.getByRole('button', { name: 'Open navigation' });
    await menuButton.click();
    if (await menuButton.getAttribute('aria-expanded') !== 'true') problems.push(`${width}px: mobile navigation did not open`);
    if (!(await page.getByRole('navigation', { name: 'Primary navigation' }).isVisible())) problems.push(`${width}px: opened navigation is not visible`);
    await page.keyboard.press('Escape');
    if (await menuButton.getAttribute('aria-expanded') !== 'false') problems.push(`${width}px: Escape did not close navigation`);
  }

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
console.log('Mobile navigation, docs navigation, code copy, local search, 404, and all 12 integrations: PASS');
