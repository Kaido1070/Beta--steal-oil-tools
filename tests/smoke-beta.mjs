import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const pageErrors = [];
const consoleErrors = [];
const legacyRequests = [];

page.on('pageerror', error => pageErrors.push(String(error)));
page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('request', request => {
  const url = request.url();
  if (url.includes('raw.githubusercontent.com/Kaido1070/Steal-The-Oil-Tools')) legacyRequests.push(url);
});

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

assert.equal(await page.locator('meta[name="stot-local-version"]').getAttribute('content'), '5.58');
assert.equal(await page.locator('html').getAttribute('data-stot-beta-ready'), '5.58');
assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).visibility), 'hidden');
assert.equal(legacyRequests.length, 0, `Legacy public runtime request detected: ${legacyRequests.join(', ')}`);

assert.equal((await page.locator('#saleValue').textContent())?.trim(), '$11.75K');
assert.equal((await page.locator('#saleOil').inputValue()).trim(), '50');
assert.equal((await page.locator('#sellPrice').inputValue()).trim(), '50');

await page.locator('.tabs button[data-view="oil"]').click();
await page.waitForTimeout(80);
assert.ok(await page.locator('#oilView').evaluate(el => el.classList.contains('active')));
assert.ok((await page.locator('#oilView').textContent())?.includes('What do you want to know?'));
assert.ok(await page.locator('#layoutAreas').count());

await page.locator('.tabs button[data-view="database"]').click();
await page.waitForTimeout(120);
assert.ok(await page.locator('#databaseView').evaluate(el => el.classList.contains('active')));
assert.ok(await page.locator('#databaseTabs [data-dbview="refineries"]').count());
assert.ok(await page.locator('#databaseTabs [data-dbview="solar"]').count());
assert.ok(await page.locator('#databaseTabs [data-dbview="decorations"]').count());
assert.ok(await page.locator('#databaseTabs [data-dbview="lootboxes"]').count());

for (const [tab, root] of [
  ['refineries', '#refineryList'],
  ['solar', '#solarList'],
  ['decorations', '#decorationList'],
  ['lootboxes', '#lootboxList'],
]) {
  await page.locator(`#databaseTabs [data-dbview="${tab}"]`).click();
  await page.waitForTimeout(80);
  const cards = page.locator(`${root} .drill-card`);
  assert.ok(await cards.count() > 0, `${tab}: no cards rendered`);
  const image = cards.first().locator('.drill-logo img');
  assert.ok(await image.count(), `${tab}: first card has no image`);
  assert.ok(await image.evaluate(img => img.complete && img.naturalWidth > 0), `${tab}: image failed to load`);
}

await page.locator('#databaseTabs [data-dbview="refineries"]').click();
await page.locator('#refinerySearch').fill('Infinity');
await page.waitForTimeout(80);
assert.equal(await page.locator('#refineryList .drill-card').count(), 1);
assert.ok((await page.locator('#refineryList .drill-card .drill-info strong').textContent())?.includes('Infinity'));

assert.ok(await page.locator('.tabs button[data-view="layoutcompare"]').count(), 'Compare Presets/Layout comparison tab missing');

await page.reload({ waitUntil: 'networkidle' });
assert.equal(await page.locator('html').getAttribute('data-stot-beta-ready'), '5.58');
assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).visibility), 'hidden');

assert.equal(pageErrors.length, 0, `Page errors:\n${pageErrors.join('\n')}`);
const patchFailures = consoleErrors.filter(x => x.includes('STOT patch failed'));
assert.equal(patchFailures.length, 0, `Patch failures:\n${patchFailures.join('\n')}`);

console.log('SMOKE PASS: v5.58 local runtime, calculators, Oil UI, database images, filters, reload');
await browser.close();
