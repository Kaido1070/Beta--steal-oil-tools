import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL = process.env.STOT_TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
const consoleErrors = [];
const knownIssues = [];

page.on('pageerror', error => pageErrors.push(String(error)));
page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
await page.addInitScript(() => localStorage.clear());

const wait = (ms = 100) => page.waitForTimeout(ms);
async function nav(view, expectedId) {
  const tab = page.locator(`.tabs button[data-view="${view}"]`);
  assert.equal(await tab.count(), 1, `Missing navigation tab: ${view}`);
  await tab.click();
  await wait(140);
  assert.ok(await page.locator(expectedId).evaluate(el => el.classList.contains('active')), `${expectedId} did not become active`);
  assert.equal(await page.locator('.view.active').count(), 1, `Navigation to ${view} left multiple active views`);
}
async function text(sel) {
  return ((await page.locator(sel).textContent()) || '').replace(/\s+/g, ' ').trim();
}
async function knownIssue(name, fn) {
  try {
    await fn();
    console.log(`KNOWN CHECK NOW PASSING: ${name}`);
  } catch (error) {
    knownIssues.push(`${name}: ${error.message}`);
    console.log(`KNOWN CURRENT BUG: ${name}: ${error.message}`);
  }
}

await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await wait(250);
assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).visibility), 'hidden');

// 1) Navigation and one-active-view invariant.
for (const [view, id] of [
  ['sale', '#saleView'],
  ['oil', '#oilView'],
  ['drills', '#drillsView'],
  ['compare', '#compareView'],
  ['layoutcompare', '#layoutcompareView'],
  ['database', '#databaseView'],
  ['events', '#eventsView'],
  ['codes', '#codesView'],
]) await nav(view, id);

// 2) Oil / Hour: real interactions, mode changes and calculations.
await nav('oil', '#oilView');
assert.equal(await page.locator('#layoutModeTabs [data-layoutmode="time"].active').count(), 1, 'Time → Oil is not initially active');
assert.equal(await page.locator('#v536QuickFill').count(), 1, 'Quick Fill is missing');
assert.equal(await page.locator('#v536AdvancedTools').count(), 1, 'Advanced Tools are missing');
for (const id of ['#layoutPasteEmpty', '#layoutPasteAll', '#layoutClearAll']) {
  assert.equal(await page.locator(id).count(), 1, `${id} is missing from Advanced Tools`);
}

// Add one deterministic drill through the real Visual Plot Builder API.
await page.evaluate(() => window.STOT_VISUAL_PLOT_BUILDER?.open('forest-1'));
await wait(80);
assert.equal(await page.locator('#v572PlotEditor.open').count(), 1, 'Visual Plot editor did not open');
await page.locator('#v572PlotEditor [data-vadd]').click();
await wait(160);
const startRate = await text('#layoutNowRate');
assert.notEqual(startRate, '0/s', 'Adding a drill did not change current production');

await page.locator('#layoutHours').fill('1');
await wait(100);
const oil1h = await text('#layoutTimeOil');
await page.locator('#layoutHours').fill('2');
await wait(100);
const oil2h = await text('#layoutTimeOil');
assert.notEqual(oil1h, oil2h, 'Changing run time did not change Oil Gained');
assert.notEqual(await text('#layoutTimeEnd'), '0/s', 'End rate did not update');

await page.locator('#layoutModeTabs [data-layoutmode="target"]').click();
await wait(100);
assert.equal(await page.locator('#layoutTargetPane.active').count(), 1, 'Oil → Time pane did not activate');
await page.locator('#layoutTarget').fill('1');
await page.locator('#layoutTargetUnits [data-layouttarget="1000"]').click();
await wait(80);
assert.match(await text('#layoutTargetDisplay'), /K$/i, 'K target unit did not apply');
await page.locator('#layoutTargetUnits [data-layouttarget="1000000000000"]').click();
await wait(80);
assert.match(await text('#layoutTargetDisplay'), /T$/i, 'T target unit did not apply');
assert.ok((await text('#layoutTargetTime')).length > 0, 'Time Needed did not render');
await page.locator('#layoutModeTabs [data-layoutmode="time"]').click();
await wait(80);

assert.equal(await page.locator('#v575StickyRate').count(), 1, 'Current Production sticky bar is missing');
await page.evaluate(() => window.scrollTo(0, 0));
await wait(100);
const stickyRate = await text('#v575StickyRate [data-v575-rate]');
assert.equal(stickyRate, await text('#layoutNowRate'), 'Current Production sticky value is stale');
await page.locator('#v575StickyRate').click();
await wait(120);
assert.equal(await page.locator('#layoutResultDetails.v575-result-focus').count(), 1, 'Sticky click did not focus production details');

// Audit-documented ownership issue: keep visible as a known baseline bug until rewrite fixes it.
await knownIssue('Oil / Hour owns the Visual Plot Builder while Oil is active', async () => {
  const owner = await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || '');
  assert.equal(owner, 'oilView');
});

// 3) Compare Presets: modes, A/B labels, separate/shared state and sticky bar.
await nav('layoutcompare', '#layoutcompareView');
await wait(250);
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el => el.parentElement?.id || ''), 'layoutcompareView', 'Compare Presets does not own the builder when active');
assert.equal(await page.locator('#layoutVisualBuilder + .ab-compare').count(), 1, 'Preset Comparison is not immediately after Visual Plot Builder');
assert.equal(await page.locator('[data-ab-layout="A"]').count(), 1, 'Preset A selector missing');
assert.equal(await page.locator('[data-ab-layout="B"]').count(), 1, 'Preset B selector missing');

await page.locator('[data-v524="separate"]').click();
await wait(120);
assert.equal(await page.locator('[data-v524="separate"].active').count(), 1, 'Different Base Settings did not turn On');
await page.locator('[data-ab-layout="B"]').click();
await wait(140);
assert.equal(await text('.v524-shared-badge'), 'Preset B settings', 'Preset B settings label is wrong');
await page.locator('[data-ab-layout="A"]').click();
await wait(140);
assert.equal(await text('.v524-shared-badge'), 'Preset A settings', 'Preset A settings label is wrong');

// Independent A/B boost state must stay independent while Separate is On.
await page.locator('#layoutMole').fill('20');
await wait(120);
await page.locator('[data-ab-layout="B"]').click();
await wait(120);
await page.locator('#layoutMole').fill('80');
await wait(160);
const separateState = await page.evaluate(() => window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.ok(separateState?.A && separateState?.B, 'Compare Presets persistence state is unavailable');
assert.equal(String(separateState.A.setup?.mole), '20', 'Preset A Mole state was not preserved independently');
assert.equal(String(separateState.B.setup?.mole), '80', 'Preset B Mole state was not preserved independently');

await page.locator('[data-v524="shared"]').click();
await wait(160);
assert.equal(await text('.v524-shared-badge'), 'Shared A + B', 'Shared settings label is wrong');
const sharedState = await page.evaluate(() => window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.equal(String(sharedState.A.setup?.mole), String(sharedState.B.setup?.mole), 'Shared mode did not synchronize A/B Mole settings');

// Compare modes use the same shared condition.
await page.locator('#layoutModeTabs [data-layoutmode="time"]').click();
await page.locator('#layoutHours').fill('1');
await wait(120);
assert.equal(await text('#v523ModeBadge'), 'Time → Oil');
assert.ok((await text('#abRateA')).length > 0 && (await text('#abRateB')).length > 0, 'Preset A/B rates did not render');
await page.locator('#layoutModeTabs [data-layoutmode="target"]').click();
await page.locator('#layoutTarget').fill('1');
await page.locator('#layoutTargetUnits [data-layouttarget="1000000000"]').click();
await wait(140);
assert.equal(await text('#v523ModeBadge'), 'Oil → Time');
assert.match(await text('#v523LabelA'), /Time to/i);
assert.match(await text('#v523LabelB'), /Time to/i);

const compareVisibleText = await page.locator('#layoutcompareView').innerText();
assert.doesNotMatch(compareVisibleText, /\bLayouts?\b/, 'Visible Compare Presets UI still contains Layout/Layout(s) terminology');

assert.equal(await page.locator('#v601CompareSticky').count(), 1, 'Preset A/B sticky bar is missing');
await page.evaluate(() => window.scrollTo(0, 0));
await wait(140);
assert.equal(await text('#v601CompareSticky [data-v601-a]'), await text('#abRateA'), 'Sticky Preset A rate is stale');
assert.equal(await text('#v601CompareSticky [data-v601-b]'), await text('#abRateB'), 'Sticky Preset B rate is stale');

// 4) Compare Drills: selectors, images and result update.
await nav('compare', '#compareView');
const compareBefore = await text('#compareInsight');
await page.locator('#compareA').selectOption('clock');
await page.locator('#compareB').selectOption('basic');
await wait(140);
assert.match(await text('#compareCards'), /Clock/i, 'Clock Drill selection did not render');
assert.match(await text('#compareInsight'), /Result:/i, 'Compare result insight is missing');
assert.ok(await page.locator('#compareCards .compare-card img').count() >= 2, 'Compare Drill images are missing');
for (const img of await page.locator('#compareCards .compare-card img').all()) {
  assert.ok(await img.evaluate(el => el.complete && el.naturalWidth > 0), 'A Compare Drill image failed to load');
}
assert.ok((await text('#compareInsight')).length >= compareBefore.length || (await text('#compareInsight')).length > 0);

// 5) Database and content pages.
await nav('database', '#databaseView');
for (const [tab, root] of [
  ['drills', '#dbList'],
  ['refineries', '#refineryList'],
  ['pets', '#petList'],
]) {
  const button = page.locator(`#databaseTabs [data-dbview="${tab}"]`);
  if (await button.count()) await button.click();
  await wait(100);
  const cards = page.locator(`${root} .drill-card`);
  assert.ok(await cards.count() > 0, `${tab}: no database cards rendered`);
}
await nav('events', '#eventsView');
assert.ok(await page.locator('#eventList .event-card').count() > 0, 'Events did not render');
await nav('codes', '#codesView');
assert.ok(await page.locator('#codesList .code-card').count() > 0, 'Codes did not render');

// 6) Persistence: current storage schema is documented and survives reload.
const storageSnapshot = await page.evaluate(() => ({
  namespace: window.STOT_CONFIG?.storageNamespace,
  schema: window.STOT_CONFIG?.storageSchema,
  keys: Object.keys(localStorage).sort(),
}));
assert.equal(storageSnapshot.namespace, 'stot');
assert.equal(storageSnapshot.schema, 1);
assert.ok(storageSnapshot.keys.some(k => k.includes('layout')), 'No layout/preset persistence key was written');
await page.reload({ waitUntil: 'networkidle' });
await wait(220);
assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).visibility), 'hidden');

assert.equal(pageErrors.length, 0, `Page errors:\n${pageErrors.join('\n')}`);
const breakingConsole = consoleErrors.filter(x => /STOT .*failed|Uncaught|ReferenceError|TypeError/i.test(x));
assert.equal(breakingConsole.length, 0, `Breaking console errors:\n${breakingConsole.join('\n')}`);

console.log(`REGRESSION PASS: desktop behavior baseline. Known current issues: ${knownIssues.length}`);
for (const issue of knownIssues) console.log(` - ${issue}`);
await browser.close();
