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
async function assertOilBuilder(label) {
  assert.equal(await page.locator('#layoutVisualBuilder').count(), 1, `${label}: Oil builder missing`);
  assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'oilView', `${label}: Oil builder left Oil / Hour`);
  assert.equal(await page.locator('#oilView #layoutVisualBuilder .v572-plot-card').count(), 15, `${label}: expected all 15 Oil plot cards`);
  assert.equal(await page.locator('#oilView #layoutVisualBuilder').isVisible(), true, `${label}: Oil builder is not visible`);
}
async function assertCompareBuilder(label) {
  assert.equal(await page.locator('#layoutVisualBuilderCompare').count(), 1, `${label}: Compare builder missing`);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(), 1, `${label}: Compare builder left Compare Presets`);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare .v572-plot-card').count(), 15, `${label}: expected all 15 Compare plot cards`);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').isVisible(), true, `${label}: Compare builder is not visible`);
  assert.equal(await page.evaluate(() => document.getElementById('layoutVisualBuilder') !== document.getElementById('layoutVisualBuilderCompare')), true, `${label}: Oil and Compare are sharing one builder node`);

  const order = await page.locator('#layoutcompareView').evaluate(view => {
    const advanced = view.querySelector('#v536AdvancedToolsCompare');
    const builder = view.querySelector('#layoutVisualBuilderCompare');
    const comparison = view.querySelector('.ab-compare');
    return {
      advancedFound: !!advanced,
      builderFound: !!builder,
      comparisonFound: !!comparison,
      sameParent: !!advanced && !!builder && advanced.parentElement === builder.parentElement,
      builderDirectlyAfterAdvanced: !!advanced && !!builder && builder.previousElementSibling === advanced,
      comparisonFollowsBuilder: !!builder && !!comparison && !!(builder.compareDocumentPosition(comparison) & Node.DOCUMENT_POSITION_FOLLOWING)
    };
  });
  assert.equal(order.advancedFound, true, `${label}: Compare Advanced Tools missing`);
  assert.equal(order.builderFound, true, `${label}: Visual Plot Builder missing`);
  assert.equal(order.comparisonFound, true, `${label}: Preset Comparison missing`);
  assert.equal(order.sameParent, true, `${label}: Compare builder and Advanced Tools left the same flow`);
  assert.equal(order.builderDirectlyAfterAdvanced, true, `${label}: Compare builder must sit directly below Compare Advanced Tools`);
  assert.equal(order.comparisonFollowsBuilder, true, `${label}: Preset Comparison must stay below Visual Plot Builder`);
}
async function assertBothFixed(label) {
  await assertOilBuilder(label);
  assert.equal(await page.locator('#layoutVisualBuilderCompare').count(), 1, `${label}: Compare builder missing after it was created`);
  assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(), 1, `${label}: Compare builder left Compare Presets`);
  assert.equal(await page.evaluate(() => document.getElementById('layoutVisualBuilder') !== document.getElementById('layoutVisualBuilderCompare')), true, `${label}: builders are not separate DOM nodes`);
}

await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await wait(400);

await nav('oil', '#oilView');
await wait(800);
await assertOilBuilder('initial Oil / Hour');
await page.evaluate(() => {
  window.__oilBuilderRef = document.getElementById('layoutVisualBuilder');
  window.__oilAreasRef = document.getElementById('layoutAreas');
  window.__oilAdvancedRef = document.getElementById('v536AdvancedTools');
  window.__oilQuickRef = document.getElementById('v536QuickFill');
});

await page.evaluate(() => window.STOT_VISUAL_PLOT_BUILDER?.open('forest-1'));
await wait(100);
assert.equal(await page.locator('#v572PlotEditor.open').count(), 1, 'Oil plot editor did not open');
await page.locator('#v572PlotEditor [data-vadd]').click();
await wait(150);
await page.locator('#v572PlotEditor [data-vclose]').click();
await wait(150);

const fillEmpty = page.getByRole('button', { name: 'Fill Empty Plots', exact: true });
assert.equal(await fillEmpty.count(), 1, 'Oil Fill Empty Plots button missing');
await fillEmpty.click();
await wait(300);
await assertOilBuilder('immediately after Oil Quick Fill');
await wait(3200);
await assertOilBuilder('3.2s after Oil Quick Fill');
assert.equal(await page.evaluate(() => window.__oilBuilderRef === document.getElementById('layoutVisualBuilder')), true, 'Oil builder DOM node was replaced or transferred');

await nav('layoutcompare', '#layoutcompareView');
await wait(700);
await assertCompareBuilder('initial Compare Presets');
await page.evaluate(() => { window.__compareBuilderRef = document.getElementById('layoutVisualBuilderCompare'); });
assert.equal(await page.evaluate(() => window.__oilBuilderRef === document.getElementById('layoutVisualBuilder')), true, 'Oil builder changed after entering Compare');
assert.equal(await page.evaluate(() => window.__oilAreasRef === document.getElementById('layoutAreas') && document.getElementById('layoutAreas')?.parentElement?.id === 'oilView'), true, 'Oil areas moved into Compare');
assert.equal(await page.evaluate(() => window.__oilAdvancedRef === document.getElementById('v536AdvancedTools') && !document.getElementById('layoutcompareView')?.contains(document.getElementById('v536AdvancedTools'))), true, 'Oil Advanced Tools moved into Compare');
assert.equal(await page.evaluate(() => window.__oilQuickRef === document.getElementById('v536QuickFill') && !document.getElementById('layoutcompareView')?.contains(document.getElementById('v536QuickFill'))), true, 'Oil Quick Fill moved into Compare');

await page.locator('[data-ab-layout="B"]').click();
await wait(200);
await page.locator('[data-ab-layout="A"]').click();
await wait(3200);
await assertCompareBuilder('after Compare A/B and delayed timers');
assert.equal(await page.evaluate(() => window.__compareBuilderRef === document.getElementById('layoutVisualBuilderCompare')), true, 'Compare builder DOM node was replaced');

await nav('oil', '#oilView');
await wait(3200);
await assertBothFixed('after returning from Compare Presets');
assert.equal(await page.evaluate(() => window.__oilBuilderRef === document.getElementById('layoutVisualBuilder')), true, 'Oil builder is not the original node after return');
assert.equal(await page.evaluate(() => window.__compareBuilderRef === document.getElementById('layoutVisualBuilderCompare')), true, 'Compare builder moved or was replaced after return');
assert.equal(await page.evaluate(() => window.__oilAreasRef === document.getElementById('layoutAreas')), true, 'Oil areas node was replaced');
assert.equal(await page.evaluate(() => window.__oilAdvancedRef === document.getElementById('v536AdvancedTools')), true, 'Oil Advanced Tools node was replaced');
assert.equal(await page.evaluate(() => window.__oilQuickRef === document.getElementById('v536QuickFill')), true, 'Oil Quick Fill node was replaced');

console.log('VISUAL BUILDER INDEPENDENCE REGRESSION PASS');
await browser.close();
