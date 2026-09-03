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
async function assertFixedParents(label) {
  assert.equal(await page.locator('#layoutVisualBuilder').count(), 1, `${label}: Oil builder missing`);
  assert.equal(await page.locator('#layoutVisualBuilderCompare').count(), 1, `${label}: Compare builder missing`);
  assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'oilView', `${label}: Oil builder left Oil / Hour`);
  assert.equal(await page.locator('#layoutVisualBuilderCompare').evaluate(el => el.parentElement?.id || ''), 'layoutcompareView', `${label}: Compare builder left Compare Presets`);
  assert.equal(await page.evaluate(() => document.getElementById('layoutVisualBuilder') !== document.getElementById('layoutVisualBuilderCompare')), true, `${label}: builders are not separate DOM nodes`);
}
async function assertOilBuilder(label) {
  await assertFixedParents(label);
  assert.equal(await page.locator('#oilView #layoutVisualBuilder .v572-plot-card').count(), 15, `${label}: expected all 15 Oil plot cards`);
  assert.equal(await page.locator('#oilView #layoutVisualBuilder').isVisible(), true, `${label}: Oil builder is not visible`);
}
async function assertCompareBuilder(label) {
  await assertFixedParents(label);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare .v572-plot-card').count(), 15, `${label}: expected all 15 Compare plot cards`);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').isVisible(), true, `${label}: Compare builder is not visible`);
}

await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await wait(400);

await page.evaluate(() => {
  window.__oilBuilderRef = document.getElementById('layoutVisualBuilder');
  window.__compareBuilderRef = document.getElementById('layoutVisualBuilderCompare');
});

// Oil / Hour has its own permanent builder.
await nav('oil', '#oilView');
await wait(800);
await assertOilBuilder('initial Oil / Hour');

// Reproduce the user's sequence: edit a plot, then Quick Fill, then wait for
// delayed render timers. The Oil builder must remain the exact same DOM node.
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
await assertOilBuilder('immediately after Quick Fill');
await wait(3200);
await assertOilBuilder('3.2s after Quick Fill');
assert.equal(await page.evaluate(() => window.__oilBuilderRef === document.getElementById('layoutVisualBuilder')), true, 'Oil builder DOM node was replaced or transferred');

// Compare Presets gets a different permanent builder. Entering Compare must not
// move, reuse, replace, or detach the Oil builder.
await nav('layoutcompare', '#layoutcompareView');
await wait(700);
await assertCompareBuilder('initial Compare Presets');
assert.equal(await page.evaluate(() => window.__oilBuilderRef === document.getElementById('layoutVisualBuilder')), true, 'Oil builder changed after entering Compare');
assert.equal(await page.evaluate(() => window.__compareBuilderRef === document.getElementById('layoutVisualBuilderCompare')), true, 'Compare builder DOM node changed');

// Exercise Compare A/B rendering and allow every delayed timer to run.
await page.locator('[data-ab-layout="B"]').click();
await wait(200);
await page.locator('[data-ab-layout="A"]').click();
await wait(3200);
await assertCompareBuilder('after Compare A/B and delayed timers');

// Returning to Oil must reveal the original Oil builder. Compare's builder must
// stay parked in Compare Presets instead of following us back.
await nav('oil', '#oilView');
await wait(3200);
await assertOilBuilder('after returning from Compare Presets');
assert.equal(await page.evaluate(() => window.__oilBuilderRef === document.getElementById('layoutVisualBuilder')), true, 'Oil builder is not the original node after return');
assert.equal(await page.evaluate(() => window.__compareBuilderRef === document.getElementById('layoutVisualBuilderCompare')), true, 'Compare builder moved or was replaced after return');

console.log('VISUAL BUILDER INDEPENDENCE REGRESSION PASS');
await browser.close();
