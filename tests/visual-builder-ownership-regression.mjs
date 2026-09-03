import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL = process.env.STOT_TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const wait = ms => page.waitForTimeout(ms);
async function nav(view, id) {
  await page.locator(`.tabs button[data-view="${view}"]`).click();
  await wait(250);
  assert.equal(await page.locator(id).evaluate(el => el.classList.contains('active')), true, `${id} not active`);
}
async function assertOilBuilderStable(label) {
  assert.equal(await page.locator('#layoutVisualBuilder').count(), 1, `${label}: Visual Plot Builder missing`);
  assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'oilView', `${label}: Visual Plot Builder left Oil / Hour`);
  assert.equal(await page.locator('#oilView #layoutVisualBuilder .v572-plot-card').count(), 15, `${label}: expected all 15 plot cards in Oil / Hour`);
  assert.equal(await page.locator('#oilView #layoutVisualBuilder').isVisible(), true, `${label}: Visual Plot Builder is not visible in Oil / Hour`);
}
async function assertCompareBuilderStable(label) {
  assert.equal(await page.locator('#layoutVisualBuilder').count(), 1, `${label}: Visual Plot Builder missing`);
  assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'layoutcompareView', `${label}: Visual Plot Builder left Compare Presets`);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilder .v572-plot-card').count(), 15, `${label}: Compare Presets lost plot cards`);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilder').isVisible(), true, `${label}: Visual Plot Builder is not visible in Compare Presets`);
}

await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await wait(400);

// Oil / Hour must own the builder whenever Oil / Hour is active.
await nav('oil', '#oilView');
await wait(800);
await assertOilBuilderStable('initial Oil / Hour');

// Simulate a stale/legacy Compare patch forcibly stealing the builder while Oil
// is active. The ownership guard must immediately put it back without user action.
await page.evaluate(() => {
  const builder = document.getElementById('layoutVisualBuilder');
  const compare = document.getElementById('layoutcompareView');
  if (builder && compare) compare.appendChild(builder);
});
await wait(350);
await assertOilBuilderStable('after forced wrong move into Compare Presets');

// Reproduce the user's sequence: seed a plot, then Quick Fill.
await page.evaluate(() => window.STOT_VISUAL_PLOT_BUILDER?.open('forest-1'));
await wait(100);
assert.equal(await page.locator('#v572PlotEditor.open').count(), 1, 'Plot editor did not open');
await page.locator('#v572PlotEditor [data-vadd]').click();
await wait(150);
await page.locator('#v572PlotEditor [data-vclose]').click();
await wait(150);

const fillEmpty = page.getByRole('button', { name: 'Fill Empty Plots', exact: true });
assert.equal(await fillEmpty.count(), 1, 'Fill Empty Plots button missing');
await fillEmpty.click();
await wait(300);
await assertOilBuilderStable('immediately after Quick Fill');

// Catch delayed 1-2 second ownership bugs and any later repair timers.
await wait(3200);
await assertOilBuilderStable('3.2s after Quick Fill');

// Compare Presets may own the shared builder only while Compare Presets is active.
await nav('layoutcompare', '#layoutcompareView');
await wait(700);
await assertCompareBuilderStable('initial Compare Presets');

// Simulate Oil's legacy renderer forcibly moving the builder back beside
// layoutAreas while Compare Presets is active. The owner must repair this too.
await page.evaluate(() => {
  const builder = document.getElementById('layoutVisualBuilder');
  const host = document.getElementById('layoutAreas');
  if (builder && host?.parentElement) host.parentElement.insertBefore(builder, host);
});
await wait(350);
await assertCompareBuilderStable('after forced wrong move into Oil / Hour');

// Returning to Oil / Hour must return the builder and keep it there beyond all delayed timers.
await nav('oil', '#oilView');
await wait(3200);
await assertOilBuilderStable('after returning from Compare Presets');

console.log('VISUAL BUILDER OWNERSHIP REGRESSION PASS');
await browser.close();
