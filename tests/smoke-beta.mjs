import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const pageErrors = [];
const consoleErrors = [];
const legacyRequests = [];
const localRequests = [];

page.on('pageerror', error => pageErrors.push(String(error)));
page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('request', request => {
  const url = request.url();
  if (url.includes('raw.githubusercontent.com/Kaido1070/Steal-The-Oil-Tools')) legacyRequests.push(url);
  if (url.startsWith('http://127.0.0.1:4173/')) localRequests.push(url);
});

await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });

assert.equal(await page.locator('meta[name="stot-local-version"]').getAttribute('content'), '5.62');
assert.equal(await page.locator('html').getAttribute('data-stot-beta-ready'), '5.62');
assert.equal(await page.locator('html').getAttribute('data-stot-database-page'), '5.62');
assert.equal(await page.locator('html').getAttribute('data-stot-events-page'), '5.62');
assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).visibility), 'hidden');
assert.equal(legacyRequests.length, 0, `Legacy public runtime request detected: ${legacyRequests.join(', ')}`);

const scriptSrcs = await page.locator('script[src]').evaluateAll(nodes => nodes.map(n => new URL(n.src).pathname));
assert.deepEqual(scriptSrcs, ['/js/game-data.js', '/js/app.js', '/js/pages/database.js', '/js/pages/events.js', '/js/beta-patches.bundle.js']);
const styleHrefs = await page.locator('link[rel="stylesheet"]').evaluateAll(nodes => nodes.map(n => new URL(n.href).pathname));
assert.deepEqual(styleHrefs, ['/css/app.bundle.css', '/css/pages/database.css', '/css/pages/events.css']);

const dataCounts = await page.evaluate(() => {
  const d = window.STOT_GAME_DATA;
  return d ? {
    drills: d.drills?.length,
    pets: d.pets?.length,
    refineries: d.refineries?.length,
    solarPanels: d.solarPanels?.length,
    totems: d.totems?.length,
    decorations: d.decorations?.length,
    lootboxes: d.lootboxes?.length,
  } : null;
});
assert.deepEqual(dataCounts, {
  drills: 34,
  pets: 15,
  refineries: 26,
  solarPanels: 4,
  totems: 15,
  decorations: 12,
  lootboxes: 13,
});

assert.equal(await page.evaluate(() => typeof renderActiveDatabasePane), 'function');
assert.equal(await page.evaluate(() => typeof renderDb), 'function');
assert.equal(await page.evaluate(() => typeof renderCompare), 'function');

const requestedPaths = localRequests.map(url => new URL(url).pathname);
assert.equal(requestedPaths.filter(path => path.startsWith('/js/v539-')).length, 0, 'Standalone historical patch JS was requested');
assert.equal(requestedPaths.filter(path => path.startsWith('/css/v539-')).length, 0, 'Standalone historical patch CSS was requested');
assert.equal(requestedPaths.filter(path => path === '/js/layout-quick-compare.js').length, 0, 'Obsolete sequential loader was requested');
assert.equal(requestedPaths.filter(path => path === '/js/beta-database-images.js').length, 0, 'Database image patch leaked into standalone requests');
assert.equal(requestedPaths.filter(path => path === '/js/beta-database-redesign.js').length, 0, 'Database redesign patch leaked into standalone requests');

assert.equal((await page.locator('#saleValue').textContent())?.trim(), '$11.8K');
assert.equal((await page.locator('#saleOil').inputValue()).trim(), '50');
assert.equal((await page.locator('#sellPrice').inputValue()).trim(), '50');
assert.ok(((await page.locator('#drillMainRate').textContent()) || '').trim().length > 0, 'Drill calculator did not initialize');

await page.locator('.tabs button[data-view="oil"]').click();
await page.waitForTimeout(100);
assert.ok(await page.locator('#oilView').evaluate(el => el.classList.contains('active')));
assert.ok((await page.locator('#oilView').textContent())?.includes('What do you want to know?'));
assert.ok(await page.locator('#layoutAreas').count());

const compareTab = page.locator('.tabs button[data-view="layoutcompare"]');
assert.ok(await compareTab.count(), 'Compare Presets tab missing');
await page.waitForTimeout(120);
assert.match((await compareTab.textContent()) || '', /Preset/i, 'Visible terminology did not migrate from Layout to Preset');
await compareTab.click();
await page.waitForTimeout(140);
assert.ok(await page.locator('#layoutcompareView').evaluate(el => el.classList.contains('active')));
assert.match((await compareTab.textContent()) || '', /Preset/i);
assert.match((await page.locator('#layoutcompareView').textContent()) || '', /Preset A|Preset B|Presets/i, 'Compare page terminology did not stay on Preset wording');


assert.equal(await page.evaluate(() => typeof renderEvents), 'function');
await page.locator('.tabs button[data-view="events"]').click();
await page.waitForTimeout(120);
assert.ok(await page.locator('#eventsView').evaluate(el => el.classList.contains('active')));
assert.notEqual((await page.locator('#localTimezone').textContent())?.trim(), '—');
assert.notEqual((await page.locator('#nextEventName').textContent())?.trim(), '—');
assert.ok(await page.locator('#eventList .event-card').count() >= 4, 'Events cards did not render');
assert.ok(await page.locator('#adminTimes .admin-day').count() > 0, 'Admin event times did not render');

await page.locator('.tabs button[data-view="database"]').click();
await page.waitForTimeout(140);
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
  await page.waitForTimeout(90);
  const cards = page.locator(`${root} .drill-card`);
  assert.ok(await cards.count() > 0, `${tab}: no cards rendered`);
  const image = cards.first().locator('.drill-logo img');
  assert.ok(await image.count(), `${tab}: first card has no image`);
  assert.ok(await image.evaluate(img => img.complete && img.naturalWidth > 0), `${tab}: image failed to load`);
}

await page.locator('#databaseTabs [data-dbview="refineries"]').click();
await page.locator('#refinerySearch').fill('Infinity');
await page.waitForTimeout(90);
assert.equal(await page.locator('#refineryList .drill-card').count(), 1);
assert.ok((await page.locator('#refineryList .drill-card .drill-info strong').textContent())?.includes('Infinity'));

await page.reload({ waitUntil: 'networkidle' });
assert.equal(await page.locator('html').getAttribute('data-stot-beta-ready'), '5.62');
assert.equal(await page.locator('html').getAttribute('data-stot-database-page'), '5.62');
assert.equal(await page.locator('html').getAttribute('data-stot-events-page'), '5.62');
assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).visibility), 'hidden');

assert.equal(pageErrors.length, 0, `Page errors:\n${pageErrors.join('\n')}`);
const patchFailures = consoleErrors.filter(x => x.includes('STOT patch failed') || x.includes('STOT Database patch failed'));
assert.equal(patchFailures.length, 0, `Patch failures:\n${patchFailures.join('\n')}`);

console.log('SMOKE PASS: v5.62 Database + Events separated, calculators, Preset UI, images, filters, reload');
await browser.close();