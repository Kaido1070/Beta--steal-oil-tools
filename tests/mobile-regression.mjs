import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL = process.env.STOT_TEST_URL || 'http://127.0.0.1:4173/';
const engineName = (process.env.STOT_BROWSER || 'chromium').toLowerCase();
const engine = engineName === 'webkit' ? webkit : chromium;
const browser = await engine.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(String(error)));
await page.addInitScript(() => localStorage.clear());

const wait = (ms = 100) => page.waitForTimeout(ms);
async function nav(view, id) {
  await page.locator(`.tabs button[data-view="${view}"]`).click();
  await wait(160);
  assert.ok(await page.locator(id).evaluate(el => el.classList.contains('active')), `${id} did not become active`);
  assert.equal(await page.locator('.view.active').count(), 1, `Multiple active views after ${view}`);
}
async function text(sel) {
  return ((await page.locator(sel).textContent()) || '').replace(/\s+/g, ' ').trim();
}

await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await wait(250);
assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).visibility), 'hidden');

// Capture Oil identities before Compare opens. They must never move into Compare.
await nav('oil', '#oilView');
await page.evaluate(() => {
  window.__mobileOilRefs = {
    controls: document.querySelector('#oilView .layout-controls'),
    areas: document.getElementById('layoutAreas'),
    quick: document.getElementById('v536QuickFill'),
    advanced: document.getElementById('v536AdvancedTools'),
    builder: document.getElementById('layoutVisualBuilder')
  };
});

// Compare Presets mobile layout uses fully isolated controls + permanent builder.
await nav('layoutcompare', '#layoutcompareView');
await wait(220);
assert.equal(await page.locator('#layoutVisualBuilderCompare .v572-plot-card').count(), 15, 'Expected 15 Compare Visual Plot cards');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'oilView', 'Oil builder moved into Compare on mobile');
assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(), 1, 'Compare builder left Compare Presets on mobile');
assert.equal(await page.evaluate(() => {
  const r=window.__mobileOilRefs||{},view=document.getElementById('layoutcompareView');
  return r.controls===document.querySelector('#oilView .layout-controls') &&
    r.areas===document.getElementById('layoutAreas') && document.getElementById('layoutAreas')?.parentElement?.id==='oilView' &&
    r.quick===document.getElementById('v536QuickFill') && !view?.contains(r.quick) &&
    r.advanced===document.getElementById('v536AdvancedTools') && !view?.contains(r.advanced) &&
    r.builder===document.getElementById('layoutVisualBuilder');
}), true, 'An Oil workspace node leaked into Compare on mobile');

const compareOrderOk = await page.evaluate(() => {
  const view = document.getElementById('layoutcompareView');
  const advanced = view?.querySelector('#v536AdvancedToolsCompare');
  const builder = view?.querySelector('#layoutVisualBuilderCompare');
  const comparison = view?.querySelector('.ab-compare');
  return !!advanced && !!builder && !!comparison &&
    builder.parentElement === advanced.parentElement &&
    builder.previousElementSibling === advanced &&
    !!(builder.compareDocumentPosition(comparison) & Node.DOCUMENT_POSITION_FOLLOWING);
});
assert.equal(compareOrderOk, true, 'Mobile Compare order must be Compare Advanced Tools -> Visual Plot Builder -> Preset Comparison');
const grid = page.locator('#layoutVisualBuilderCompare .v572-plot-map');
assert.equal(await grid.count(), 1, 'Compare Visual Plot map missing');
const columns = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
assert.equal(columns, 3, `Visual Plot Builder must remain 3 columns on mobile; got ${columns}`);

const firstGrid = page.locator('#layoutVisualBuilderCompare .v572-grid-cells').first();
assert.equal(await firstGrid.locator('span').count(), 25, 'Each plot must contain a 5x5 cell grid');
const firstGridBox = await firstGrid.boundingBox();
assert.ok(firstGridBox && Math.abs(firstGridBox.width - firstGridBox.height) <= 3, '5x5 visual grid is no longer square');

// Compare calculator is its own DOM, never Oil calculator DOM.
await page.locator('#compareLayoutModeTabs [data-layoutmode="time"]').click();
await page.locator('#compareLayoutHours').fill('1');
await wait(100);
assert.equal(await text('#v523ModeBadge'), 'Time → Oil');
await page.locator('#compareLayoutHours').fill('2');
await wait(100);
assert.match(await text('#v523LabelA'), /2 Hours/i, 'Compare runtime did not update independently');

await page.locator('#compareLayoutModeTabs [data-layoutmode="target"]').click();
await wait(100);
assert.equal(await page.locator('#compareLayoutTargetPane.active').count(), 1, 'Compare target pane is not active');
const targetPaneBox = await page.locator('#compareLayoutTargetPane').boundingBox();
assert.ok(targetPaneBox, 'Compare Target Oil controls are not visible');
assert.ok(targetPaneBox.x >= -1 && targetPaneBox.x + targetPaneBox.width <= 391, `Compare Target Oil controls overflow mobile viewport: ${JSON.stringify(targetPaneBox)}`);
const unitBoxes = await page.locator('#compareLayoutTargetUnits .chip').evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().width));
assert.equal(unitBoxes.length, 4, 'Expected K/M/B/T Compare unit buttons');

// Separate A/B boosts are Compare-only.
await page.locator('[data-v524="separate"]').click();
await page.locator('[data-ab-layout="B"]').click();
await wait(120);
assert.equal(await text('.v524-shared-badge'), 'Preset B settings');
await page.locator('#compareLayoutMole').fill('80');
await page.locator('[data-ab-layout="A"]').click();
await wait(120);
assert.equal(await text('.v524-shared-badge'), 'Preset A settings');
await page.locator('#compareLayoutMole').fill('20');
const compareStates = await page.evaluate(() => window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.equal(String(compareStates.A.setup.mole), '20');
assert.equal(String(compareStates.B.setup.mole), '80');

// Sticky comparison bar stays at viewport bottom through viewport changes.
await page.evaluate(() => window.scrollTo(0, 0));
await wait(160);
const compareSticky = page.locator('#v601CompareSticky');
assert.equal(await compareSticky.count(), 1, 'Compare Presets sticky bar missing');
assert.equal(await compareSticky.evaluate(el => el.parentElement === document.body), true, 'Compare sticky bar must remain a direct child of body');
assert.equal(await compareSticky.evaluate(el => getComputedStyle(el).position), 'fixed', 'Compare sticky bar lost fixed positioning');
let stickyBox = await compareSticky.boundingBox();
assert.ok(stickyBox && stickyBox.width <= 390, 'Compare Presets sticky bar overflows viewport');

const quickCount = page.locator('#compareQuickCount');
await quickCount.focus();
await wait(80);
await page.evaluate(() => document.activeElement?.blur());
await wait(220);
await page.setViewportSize({ width: 390, height: 560 });
await wait(140);
await page.setViewportSize({ width: 390, height: 844 });
await wait(320);
stickyBox = await compareSticky.boundingBox();
assert.equal(await compareSticky.evaluate(el => el.parentElement === document.body), true, 'Compare sticky bar left body after viewport change');
assert.equal(await compareSticky.evaluate(el => getComputedStyle(el).position), 'fixed', 'Compare sticky bar lost fixed positioning after viewport change');
assert.ok(stickyBox && stickyBox.y + stickyBox.height <= 845, `Compare sticky bar exceeds restored viewport: ${JSON.stringify(stickyBox)}`);

// Oil returns with the exact same permanent nodes and its own controls.
await nav('oil', '#oilView');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'oilView', 'Oil builder is not fixed in Oil / Hour on mobile');
assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(), 1, 'Compare builder followed navigation back to Oil');
assert.equal(await page.locator('#oilView #layoutVisualBuilder .v572-plot-card').count(), 15, 'Expected 15 Oil Visual Plot cards');
assert.equal(await page.locator('#v536QuickFill').count(), 1, 'Oil Quick Fill missing on mobile');
assert.equal(await page.locator('#v536AdvancedTools').count(), 1, 'Oil Advanced Tools missing on mobile');
assert.equal(await page.evaluate(() => {
  const r=window.__mobileOilRefs||{};
  return r.controls===document.querySelector('#oilView .layout-controls') && r.areas===document.getElementById('layoutAreas') && r.quick===document.getElementById('v536QuickFill') && r.advanced===document.getElementById('v536AdvancedTools') && r.builder===document.getElementById('layoutVisualBuilder');
}), true, 'Oil workspace nodes were replaced after visiting Compare');
for (const id of ['#layoutPasteEmpty', '#layoutPasteAll', '#layoutClearAll']) {
  const box = await page.locator(id).boundingBox();
  assert.ok(box && box.width > 0 && box.height > 0, `${id} is not tappable on mobile`);
}
const currentSticky = page.locator('#v575StickyRate');
assert.equal(await currentSticky.count(), 1, 'Current Production sticky missing');
const currentStickyBox = await currentSticky.boundingBox();
assert.ok(currentStickyBox && currentStickyBox.width <= 390, 'Current Production sticky overflows mobile viewport');

await page.locator('#layoutShare').click();
await wait(160);
const preview = page.locator('#sharePreview');
assert.equal(await preview.count(), 1, 'Share preview did not open');
const previewBox = await preview.boundingBox();
if (previewBox) {
  assert.ok(previewBox.x >= -1 && previewBox.x + previewBox.width <= 391, 'Share preview overflows horizontally');
  assert.ok(previewBox.y >= -1 && previewBox.y + previewBox.height <= 845, 'Share preview shell exceeds mobile viewport');
}
await page.keyboard.press('Escape');

assert.equal(pageErrors.length, 0, `Mobile page errors (${engineName}):\n${pageErrors.join('\n')}`);
console.log(`MOBILE REGRESSION PASS (${engineName}): isolated Oil/Compare workspaces, separate builders, 3-column plots, sticky bars and A/B state`);
await browser.close();
