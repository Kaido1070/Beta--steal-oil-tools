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

await page.locator('.tabs button[data-view="layoutcompare"]').click();
await wait(120);
assert.equal(await page.locator('#layoutcompareView').evaluate(el => el.classList.contains('active')), true, 'Compare Presets did not open');
assert.equal(await page.locator('#layoutcompareView').getAttribute('data-stage3-compare-owner'), '1', 'Stage 3 Compare controller did not claim ownership');

await page.evaluate(() => {
  window.__stage3OrderViolations = 0;
  const view = document.getElementById('layoutcompareView');
  const valid = () => {
    const advanced = view?.querySelector('#v536AdvancedTools');
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
    const advanced = view.querySelector('#v536AdvancedTools');
    const builder = view.querySelector('#layoutVisualBuilderCompare');
    const comparison = view.querySelector('.ab-compare');
    const sticky = document.getElementById('v601CompareSticky');
    const css = sticky ? getComputedStyle(sticky) : null;
    return {
      advanced: !!advanced,
      builder: !!builder,
      comparison: !!comparison,
      sameParent: !!advanced && !!builder && advanced.parentElement === builder.parentElement,
      builderAfterAdvanced: !!advanced && !!builder && builder.previousElementSibling === advanced,
      comparisonAfterBuilder: !!builder && !!comparison && !!(builder.compareDocumentPosition(comparison) & Node.DOCUMENT_POSITION_FOLLOWING),
      stickyBody: sticky?.parentElement === document.body,
      stickyPosition: css?.position || '',
      stickyTop: css?.top || '',
      violations: window.__stage3OrderViolations || 0
    };
  });
  assert.equal(state.advanced, true, `${label}: Advanced Tools missing`);
  assert.equal(state.builder, true, `${label}: Compare Visual Plot Builder missing`);
  assert.equal(state.comparison, true, `${label}: Preset Comparison missing`);
  assert.equal(state.sameParent, true, `${label}: Advanced Tools and builder left the same flow`);
  assert.equal(state.builderAfterAdvanced, true, `${label}: builder is not directly below Advanced Tools`);
  assert.equal(state.comparisonAfterBuilder, true, `${label}: Preset Comparison moved above builder`);
  assert.equal(state.stickyBody, true, `${label}: sticky results bar is not a direct child of body`);
  assert.equal(state.stickyPosition, 'fixed', `${label}: sticky results bar is not fixed`);
  assert.equal(state.violations, 0, `${label}: legacy reorder became externally visible`);
}

await assertStable('initial mount');

await page.locator('[data-ab-layout="B"]').click();
await wait(80);
await page.locator('[data-ab-layout="A"]').click();
await wait(80);
await assertStable('after A/B switch');

// Let every known legacy delayed reorder (0/35/100/120/180/220/260/520ms)
// fire. The Stage 3 controller must keep one externally stable DOM order.
await wait(900);
await assertStable('after legacy reorder window');
await wait(2600);
await assertStable('after long idle');

// Re-enter Compare so tab-driven legacy handlers run again.
await page.locator('.tabs button[data-view="oil"]').click();
await wait(100);
await page.locator('.tabs button[data-view="layoutcompare"]').click();
await wait(900);
await assertStable('after re-entry');

await page.evaluate(() => window.__stage3OrderObserver?.disconnect());
console.log(`STAGE 3 COMPARE CONTROLLER REGRESSION PASS (${process.env.STOT_BROWSER || 'chromium'} ${mobile ? 'mobile' : 'desktop'})`);
await browser.close();
