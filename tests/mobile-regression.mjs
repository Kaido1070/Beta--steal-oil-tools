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

// Compare Presets mobile layout uses its own permanent builder.
await nav('layoutcompare', '#layoutcompareView');
await wait(220);
assert.equal(await page.locator('#layoutVisualBuilderCompare .v572-plot-card').count(), 15, 'Expected 15 Compare Visual Plot cards');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'oilView', 'Oil builder moved into Compare on mobile');
assert.equal(await page.locator('#layoutVisualBuilderCompare').evaluate(el => el.parentElement?.id || ''), 'layoutcompareView', 'Compare builder left Compare Presets on mobile');
const grid = page.locator('#layoutVisualBuilderCompare .v572-plot-map');
assert.equal(await grid.count(), 1, 'Compare Visual Plot map missing');
const columns = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
assert.equal(columns, 3, `Visual Plot Builder must remain 3 columns on mobile; got ${columns}`);

const firstGrid = page.locator('#layoutVisualBuilderCompare .v572-grid-cells').first();
assert.equal(await firstGrid.locator('span').count(), 25, 'Each plot must contain a 5x5 cell grid');
const firstGridBox = await firstGrid.boundingBox();
assert.ok(firstGridBox && Math.abs(firstGridBox.width - firstGridBox.height) <= 3, '5x5 visual grid is no longer square');

// Runtime singular/plural unit.
await page.locator('#layoutModeTabs [data-layoutmode="time"]').click();
await page.locator('#layoutHours').fill('1');
await wait(100);
assert.equal(await page.locator('#layoutTimePane > .field').getAttribute('data-runtime-unit'), 'hour', '1 should display hour');
await page.locator('#layoutHours').fill('2');
await wait(100);
assert.equal(await page.locator('#layoutTimePane > .field').getAttribute('data-runtime-unit'), 'hours', '2 should display hours');

// Target row stays inside viewport and unit chips remain compact.
await page.locator('#layoutModeTabs [data-layoutmode="target"]').click();
await wait(100);
const targetBox = await page.locator('#layoutTargetPane .target-box').boundingBox();
assert.ok(targetBox, 'Target Oil row is not visible');
assert.ok(targetBox.x >= -1 && targetBox.x + targetBox.width <= 391, `Target Oil row overflows mobile viewport: ${JSON.stringify(targetBox)}`);
const unitBoxes = await page.locator('#layoutTargetUnits .chip').evaluateAll(nodes => nodes.map(el => el.getBoundingClientRect().width));
assert.equal(unitBoxes.length, 4, 'Expected K/M/B/T unit buttons');
assert.ok(unitBoxes.every(w => w <= 32), `Target unit buttons are too wide: ${unitBoxes.join(', ')}`);

// Separate A/B label correctness on mobile.
await page.locator('[data-v524="separate"]').click();
await page.locator('[data-ab-layout="B"]').click();
await wait(120);
assert.equal(await text('.v524-shared-badge'), 'Preset B settings');
await page.locator('[data-ab-layout="A"]').click();
await wait(120);
assert.equal(await text('.v524-shared-badge'), 'Preset A settings');

// Sticky comparison bar fits and is tappable.
await page.evaluate(() => window.scrollTo(0, 0));
await wait(120);
const compareSticky = page.locator('#v601CompareSticky');
assert.equal(await compareSticky.count(), 1, 'Compare Presets sticky bar missing');
const stickyBox = await compareSticky.boundingBox();
assert.ok(stickyBox && stickyBox.width <= 390, 'Compare Presets sticky bar overflows viewport');

// Oil mobile controls and current-production sticky.
await nav('oil', '#oilView');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'oilView', 'Oil builder is not fixed in Oil / Hour on mobile');
assert.equal(await page.locator('#layoutVisualBuilderCompare').evaluate(el => el.parentElement?.id || ''), 'layoutcompareView', 'Compare builder followed navigation back to Oil');
assert.equal(await page.locator('#oilView #layoutVisualBuilder .v572-plot-card').count(), 15, 'Expected 15 Oil Visual Plot cards');
assert.equal(await page.locator('#v536QuickFill').count(), 1, 'Quick Fill missing on mobile');
assert.equal(await page.locator('#v536AdvancedTools').count(), 1, 'Advanced Tools missing on mobile');
for (const id of ['#layoutPasteEmpty', '#layoutPasteAll', '#layoutClearAll']) {
  const box = await page.locator(id).boundingBox();
  assert.ok(box && box.width > 0 && box.height > 0, `${id} is not tappable on mobile`);
}
const currentSticky = page.locator('#v575StickyRate');
assert.equal(await currentSticky.count(), 1, 'Current Production sticky missing');
const currentStickyBox = await currentSticky.boundingBox();
assert.ok(currentStickyBox && currentStickyBox.width <= 390, 'Current Production sticky overflows mobile viewport');

// Share Preset/Oil dialog should fit in one mobile viewport shell.
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
console.log(`MOBILE REGRESSION PASS (${engineName}): separate builders, 3-column plots, compact calculator rows, sticky bars, A/B labels, share preview`);
await browser.close();
