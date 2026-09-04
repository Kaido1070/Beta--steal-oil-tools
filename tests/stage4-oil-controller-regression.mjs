import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL=process.env.STOT_TEST_URL||'http://127.0.0.1:4173/';
const engineName=(process.env.STOT_BROWSER||'chromium').toLowerCase();
const mobile=process.env.STOT_MOBILE==='1';
const engine=engineName==='webkit'?webkit:chromium;
const browser=await engine.launch({headless:true});
const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const wait=(ms=100)=>page.waitForTimeout(ms);
async function nav(view,id){await page.locator(`.tabs button[data-view="${view}"]`).click();await wait(180);assert.equal(await page.locator(id).evaluate(el=>el.classList.contains('active')),true,`${id} not active`)}
const text=async sel=>((await page.locator(sel).textContent())||'').replace(/\s+/g,' ').trim();

await page.goto(BASE_URL,{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});
await nav('oil','#oilView');
await page.waitForFunction(()=>!!window.STOT_OIL_PAGE_CONTROLLER?.ownsOilShell&&!!window.STOT_OIL_QUICK_FILL,{timeout:10000});
await page.evaluate(()=>{window.STOT_OIL_QUICK_FILL.mount();window.STOT_OIL_PAGE_CONTROLLER.sync()});
await wait(650);

const retired=await page.evaluate(()=>({
  list:[...(window.__STOT_STAGE4_RETIRED_OIL_PATCHES__||[])],
  order:window.__STOT_BETA_OIL_ORDER__,first:window.__STOT_BETA_FIRST_VISIT__,v539:window.__STOT_V539_UI__,advanced:window.__STOT_ADVANCED_INLINE_V594__,
  build:window.__STOT_V536_BUILD_UX__,quickLegacy:window.__STOT_V537_QUICK_FILL__,quickStage4:window.__STOT_OIL_QUICK_FILL_STAGE4__,share:window.__STOT_OIL_SHARE_COMPACT_V592__
}));
assert.deepEqual(retired.list,['beta-oil-order','beta-first-visit','v539-10-oil-compat','oil-advanced-inline-v594','v536-build-ux','v537-quick-fill'],'Stage 4 retired-patch marker is wrong');
for(const key of ['order','first','v539','advanced','build','quickLegacy','quickStage4'])assert.equal(retired[key],true,`${key} runtime ownership flag is wrong`);
assert.equal(retired.share,true,'Stage 4 controller did not absorb Oil share-preview wrapper');
assert.equal(await page.locator('link[data-stot-oil-stage4-ui]').count(),1,'Stage 4 Oil CSS is not loaded');
assert.equal(await page.locator('#v594OilFlowStyle').count(),0,'Retired advanced-inline runtime still injected its legacy style element');

assert.equal(await page.locator('#oilView').getAttribute('data-stage4-oil-owner'),'controller','Oil controller ownership marker missing');
assert.equal(await page.locator('#layoutVisualBuilder').getAttribute('data-stage4-oil-owner'),'builder','Oil builder is not owned by Stage 4 shell');
assert.equal(await page.locator('#v536QuickFill').getAttribute('data-stage4-oil-owner'),'quick','Oil Quick Fill ownership marker missing');
assert.equal(await page.locator('#v536QuickFill').getAttribute('data-stage4-quick-fill'),'1','Stage 4 Quick Fill component did not own the Oil Quick Fill DOM');
assert.equal(await page.locator('#v536AdvancedTools').getAttribute('data-stage4-oil-owner'),'advanced','Oil Advanced Tools ownership marker missing');
assert.equal(await page.locator('#layoutPasteEmpty').getAttribute('data-stage4-advanced-owner'),'1','Paste Empty still has legacy runtime ownership');
assert.equal(await page.locator('#layoutPasteAll').getAttribute('data-stage4-advanced-owner'),'1','Paste All still has legacy runtime ownership');
assert.equal(await page.locator('#layoutClearAll').getAttribute('data-stage4-advanced-owner'),'1','Clear All still has legacy runtime ownership');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView','Oil builder left Oil');

const snap=await page.evaluate(()=>window.STOT_OIL_PAGE_CONTROLLER.snapshot());
for(const key of ['calculator','quick','advanced','builder','areas'])assert.ok(snap[key]>=0,`${key} is not a direct Oil child after Stage 4 ordering`);
assert.ok(snap.calculator<snap.quick,'Calculator must be before Quick Fill');
assert.ok(snap.quick<snap.advanced,'Quick Fill must be before Advanced Tools');
assert.ok(snap.advanced<snap.builder,'Advanced Tools must be before Visual Plot Builder');
assert.ok(snap.builder<snap.areas,'Visual Plot Builder must be before legacy layout host');
if(snap.boosts>=0)assert.ok(snap.calculator<snap.boosts&&snap.boosts<snap.quick,'Preset Boosts order is wrong');

assert.match(await text('#oilView .v543-calc-intro'),/Choose a calculation.*switch anytime/i,'Stage 4 did not absorb first-visit calculator intro');
assert.match(await text('#layoutModeTabs [data-layoutmode="time"]'),/Time → Oil.*How much oil/i,'Stage 4 calculator presentation missing');
assert.match(await text('#layoutModeTabs [data-layoutmode="target"]'),/Oil → Time.*reach your target/i,'Stage 4 target presentation missing');
assert.match(await text('#oilView .v520-boosts'),/Preset Boosts.*Optional.*leave these as they are/i,'Stage 4 did not absorb first-visit boosts presentation');
assert.equal(await page.locator('#v536QuickFill').evaluate(el=>el.classList.contains('v593-quick-flow')),true,'Stage 4 did not absorb Quick Fill flow class');
assert.equal(await text('#v536AdvancedTools > summary'),'Advanced Tools');
assert.equal(await text('#layoutPasteEmpty'),'Paste Empty');
assert.equal(await text('#layoutPasteAll'),'Paste All');
assert.equal(await text('#layoutClearAll'),'Clear All');

// Stage 4 Quick Fill owns multi-row templates and refinery reservation.
assert.equal(await page.locator('[data-v537-row]').count(),1,'Oil Quick Fill default template row missing');
await page.locator('#v537AddTemplateRow').click();
assert.equal(await page.locator('[data-v537-row]').count(),2,'Oil Stage 4 Quick Fill could not add a template row');
await page.locator('[data-v537-row="1"] [data-v537-drill]').selectOption('basic');
await page.locator('[data-v537-row="1"] [data-v537-count]').fill('1');
assert.match(await text('#v537TemplateFit'),/\/ 25 cells|Doesn't fit 5×5/,'Oil template packing indicator missing');
await page.locator('#v537ReserveToggle').check();
assert.equal(await page.locator('#v537ReserveFields').evaluate(el=>el.classList.contains('show')),true,'Oil refinery reservation fields did not open');
await page.locator('#v537QuickTarget').selectOption('all');
await page.locator('#v537QuickApply').click();await wait(180);
assert.match(await text('#v537QuickStatus'),/Filled .*empty plot/i,'Stage 4 Oil Quick Fill did not execute');
assert.ok(await page.evaluate(()=>Array.isArray(window.STOT_REFINERY_RESERVE?.pieces)&&window.STOT_REFINERY_RESERVE.pieces.length>0),'Stage 4 Oil Quick Fill did not publish refinery reserve geometry');

// Advanced Tools are now Stage 4-owned behavior: clear the filled layout and the refinery reserve.
page.once('dialog',dialog=>dialog.accept());
await page.locator('#layoutClearAll').click();await wait(180);
assert.equal(await page.evaluate(()=>layoutPlots.some(p=>p.rows.length)),false,'Stage 4 Clear All did not clear Oil plots');
assert.equal(await page.evaluate(()=>window.STOT_REFINERY_RESERVE),null,'Stage 4 Clear All did not clear refinery reservation');

// Controller resync must be presentation-only.
const stateBefore=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.()));
await page.evaluate(()=>{window.STOT_OIL_PAGE_CONTROLLER.syncCalculator();window.STOT_OIL_PAGE_CONTROLLER.syncBoosts();window.STOT_OIL_PAGE_CONTROLLER.syncQuick();window.STOT_OIL_PAGE_CONTROLLER.syncAdvanced();window.STOT_OIL_PAGE_CONTROLLER.syncOrder();});
await wait(120);
const stateAfter=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.()));
assert.equal(stateAfter,stateBefore,'Stage 4 Oil shell controller mutated persisted state during resync');

// Compare remains completely outside Stage 4 Oil ownership with legacy v539-10 retired.
await nav('layoutcompare','#layoutcompareView');await wait(220);
assert.equal(await page.locator('#layoutcompareView [data-stage4-oil-owner]').count(),0,'Stage 4 Oil ownership leaked into Compare');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView','Oil builder moved into Compare');
assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(),1,'Compare builder missing after Stage 4 Oil controller');
const compareStateBefore=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates));
await page.evaluate(()=>window.STOT_OIL_PAGE_CONTROLLER.sync());await wait(100);
const compareStateAfter=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates));
assert.equal(compareStateAfter,compareStateBefore,'Oil controller changed Compare A/B state');

await nav('oil','#oilView');await wait(650);
const snapAgain=await page.evaluate(()=>window.STOT_OIL_PAGE_CONTROLLER.snapshot());
assert.ok(snapAgain.calculator<snapAgain.quick&&snapAgain.quick<snapAgain.advanced&&snapAgain.advanced<snapAgain.builder&&snapAgain.builder<snapAgain.areas,'Oil canonical order was not restored after navigation');
assert.equal(errors.length,0,`Page errors (${engineName}${mobile?' mobile':''}):\n${errors.join('\n')}`);
console.log(`STAGE 4 OIL CONTROLLER PASS (${engineName}${mobile?' mobile':''}): authoritative shell, Quick Fill and Advanced ownership, six legacy runtimes retired, Compare isolated`);
await browser.close();
