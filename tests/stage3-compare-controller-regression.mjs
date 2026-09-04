import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL = process.env.STOT_TEST_URL || 'http://127.0.0.1:4173/';
const engine = process.env.STOT_BROWSER === 'webkit' ? webkit : chromium;
const mobile = process.env.STOT_MOBILE === '1';
const browser = await engine.launch({ headless: true });
const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1365, height: 900 } });
const wait = ms => page.waitForTimeout(ms);

await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await wait(300);

await page.locator('.tabs button[data-view="oil"]').click();
await wait(180);
await page.evaluate(() => {
  window.__stage3OilRefs = {
    controls: document.querySelector('#oilView .layout-controls'),
    areas: document.getElementById('layoutAreas'),
    quick: document.getElementById('v536QuickFill'),
    advanced: document.getElementById('v536AdvancedTools'),
    builder: document.getElementById('layoutVisualBuilder')
  };
  window.__stage3OilSnapshot = window.STOT_LAYOUT_PERSIST?.exportState?.().singleState;
});

await page.locator('.tabs button[data-view="layoutcompare"]').click();
await wait(180);
assert.equal(await page.locator('#layoutcompareView').evaluate(el => el.classList.contains('active')), true, 'Compare Presets did not open');
assert.equal(await page.locator('#layoutcompareView').getAttribute('data-stage3-compare-owner'), '1', 'Stage 3 Compare controller did not claim ownership');
assert.equal(await page.evaluate(() => !!window.STOT_COMPARE_PRESETS_ISOLATED?.oilNodesStayInOil), true, 'Compare isolation API missing');

await page.evaluate(() => {
  window.__stage3OrderViolations = 0;
  const view = document.getElementById('layoutcompareView');
  const valid = () => {
    const advanced = view?.querySelector('#v536AdvancedToolsCompare');
    const builder = view?.querySelector('#layoutVisualBuilderCompare');
    const comparison = view?.querySelector('.ab-compare');
    if (!advanced || !builder || !comparison) return true;
    return advanced.parentElement === builder.parentElement &&
      builder.previousElementSibling === advanced &&
      !!(builder.compareDocumentPosition(comparison) & Node.DOCUMENT_POSITION_FOLLOWING);
  };
  window.__stage3OrderObserver = new MutationObserver(() => {
    queueMicrotask(() => { if (!valid()) window.__stage3OrderViolations++; });
  });
  window.__stage3OrderObserver.observe(view, { childList: true, subtree: true });
});

async function assertStable(label) {
  const state = await page.locator('#layoutcompareView').evaluate(view => {
    const advanced = view.querySelector('#v536AdvancedToolsCompare');
    const builder = view.querySelector('#layoutVisualBuilderCompare');
    const comparison = view.querySelector('.ab-compare');
    const sticky = document.getElementById('v601CompareSticky');
    const css = sticky ? getComputedStyle(sticky) : null;
    const refs = window.__stage3OilRefs || {};
    return {
      advanced: !!advanced,
      builder: !!builder,
      comparison: !!comparison,
      sameParent: !!advanced && !!builder && advanced.parentElement === builder.parentElement,
      builderAfterAdvanced: !!advanced && !!builder && builder.previousElementSibling === advanced,
      comparisonAfterBuilder: !!builder && !!comparison && !!(builder.compareDocumentPosition(comparison) & Node.DOCUMENT_POSITION_FOLLOWING),
      stickyBody: sticky?.parentElement === document.body,
      stickyPosition: css?.position || '',
      violations: window.__stage3OrderViolations || 0,
      oilControlsSame: refs.controls === document.querySelector('#oilView .layout-controls'),
      oilAreasSame: refs.areas === document.getElementById('layoutAreas') && document.getElementById('layoutAreas')?.parentElement?.id === 'oilView',
      oilQuickSame: refs.quick === document.getElementById('v536QuickFill') && !view.contains(document.getElementById('v536QuickFill')),
      oilAdvancedSame: refs.advanced === document.getElementById('v536AdvancedTools') && !view.contains(document.getElementById('v536AdvancedTools')),
      oilBuilderSame: refs.builder === document.getElementById('layoutVisualBuilder') && document.getElementById('layoutVisualBuilder')?.parentElement?.id === 'oilView'
    };
  });
  assert.equal(state.advanced, true, `${label}: Compare Advanced Tools missing`);
  assert.equal(state.builder, true, `${label}: Compare Visual Plot Builder missing`);
  assert.equal(state.comparison, true, `${label}: Preset Comparison missing`);
  assert.equal(state.sameParent, true, `${label}: Compare Advanced Tools and builder left the same flow`);
  assert.equal(state.builderAfterAdvanced, true, `${label}: Compare builder is not directly below Compare Advanced Tools`);
  assert.equal(state.comparisonAfterBuilder, true, `${label}: Preset Comparison moved above builder`);
  assert.equal(state.stickyBody, true, `${label}: sticky results bar is not a direct child of body`);
  assert.equal(state.stickyPosition, 'fixed', `${label}: sticky results bar is not fixed`);
  assert.equal(state.violations, 0, `${label}: Compare DOM order became externally unstable`);
  assert.equal(state.oilControlsSame, true, `${label}: Oil controls were moved or replaced`);
  assert.equal(state.oilAreasSame, true, `${label}: Oil areas were moved or replaced`);
  assert.equal(state.oilQuickSame, true, `${label}: Oil Quick Fill leaked into Compare`);
  assert.equal(state.oilAdvancedSame, true, `${label}: Oil Advanced Tools leaked into Compare`);
  assert.equal(state.oilBuilderSame, true, `${label}: Oil builder moved or was replaced`);
}

await assertStable('initial mount');

// Compare controls must be independent from Oil controls and state.
await page.locator('[data-v524="separate"]').click();
await page.locator('#compareLayoutMole').fill('20');
await page.locator('#compareLayoutFruit').fill('30');
await page.locator('#compareLayoutLikes').fill('400');
await page.locator('#compareLayoutX2 [data-layoutx2="2"]').click();
await page.locator('[data-ab-layout="B"]').click();
await wait(80);
await page.locator('#compareLayoutMole').fill('80');
await page.locator('#compareLayoutFruit').fill('90');
await page.locator('#compareLayoutLikes').fill('900');
await page.locator('#compareLayoutX2 [data-layoutx2="1"]').click();
await page.locator('[data-ab-layout="A"]').click();
await wait(120);
await assertStable('after A/B switch');

const compare = await page.evaluate(() => window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.equal(String(compare.A.setup.mole), '20', 'Preset A Mole not independent');
assert.equal(String(compare.B.setup.mole), '80', 'Preset B Mole not independent');
assert.equal(String(compare.A.setup.likes), '400', 'Preset A Likes not independent');
assert.equal(String(compare.B.setup.likes), '900', 'Preset B Likes not independent');

await wait(900);
await assertStable('after legacy reorder window');
await wait(2600);
await assertStable('after long idle');

await page.locator('.tabs button[data-view="oil"]').click();
await wait(250);
const oilUnchanged = await page.evaluate(() => JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().singleState) === JSON.stringify(window.__stage3OilSnapshot));
assert.equal(oilUnchanged, true, 'Compare edits changed Oil / Hour state');
await page.evaluate(() => { window.__stage3OrderViolations = 0; });
await page.locator('.tabs button[data-view="layoutcompare"]').click();
await wait(900);
await assertStable('after re-entry');

await page.evaluate(() => window.__stage3OrderObserver?.disconnect());
console.log(`STAGE 3 ISOLATED COMPARE REGRESSION PASS (${process.env.STOT_BROWSER || 'chromium'} ${mobile ? 'mobile' : 'desktop'})`);
await browser.close();
