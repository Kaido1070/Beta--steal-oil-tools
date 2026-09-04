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
await page.waitForFunction(()=>!!window.STOT_OIL_PAGE_CONTROLLER?.ownsOilShell,{timeout:10000});
await page.evaluate(()=>window.STOT_OIL_PAGE_CONTROLLER.sync());
await wait(650); // final Stage 4 pass runs after legacy ordering timers.

assert.equal(await page.locator('#oilView').getAttribute('data-stage4-oil-owner'),'controller','Oil controller ownership marker missing');
assert.equal(await page.locator('#layoutVisualBuilder').getAttribute('data-stage4-oil-owner'),'builder','Oil builder is not owned by Stage 4 shell');
assert.equal(await page.locator('#v536QuickFill').getAttribute('data-stage4-oil-owner'),'quick','Oil Quick Fill ownership marker missing');
assert.equal(await page.locator('#v536AdvancedTools').getAttribute('data-stage4-oil-owner'),'advanced','Oil Advanced Tools ownership marker missing');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView','Oil builder left Oil');

const snap=await page.evaluate(()=>window.STOT_OIL_PAGE_CONTROLLER.snapshot());
for(const key of ['calculator','quick','advanced','builder','areas']) assert.ok(snap[key]>=0,`${key} is not a direct Oil child after Stage 4 ordering`);
assert.ok(snap.calculator<snap.quick,'Calculator must be before Quick Fill');
assert.ok(snap.quick<snap.advanced,'Quick Fill must be before Advanced Tools');
assert.ok(snap.advanced<snap.builder,'Advanced Tools must be before Visual Plot Builder');
assert.ok(snap.builder<snap.areas,'Visual Plot Builder must be before legacy layout host');
if(snap.boosts>=0)assert.ok(snap.calculator<snap.boosts&&snap.boosts<snap.quick,'Preset Boosts order is wrong');

assert.match(await text('#layoutModeTabs [data-layoutmode="time"]'),/Time → Oil.*How much oil/i,'Stage 4 calculator presentation missing');
assert.match(await text('#layoutModeTabs [data-layoutmode="target"]'),/Oil → Time.*reach your target/i,'Stage 4 target presentation missing');
assert.equal(await text('#v536AdvancedTools > summary'),'Advanced Tools');
assert.equal(await text('#layoutPasteEmpty'),'Paste Empty');
assert.equal(await text('#layoutPasteAll'),'Paste All');
assert.equal(await text('#layoutClearAll'),'Clear All');

// The shell controller must be presentation-only: explicit resync cannot mutate Oil or Compare persisted state.
const stateBefore=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.()));
await page.evaluate(()=>{window.STOT_OIL_PAGE_CONTROLLER.syncCalculator();window.STOT_OIL_PAGE_CONTROLLER.syncAdvanced();window.STOT_OIL_PAGE_CONTROLLER.syncOrder();});
await wait(120);
const stateAfter=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.()));
assert.equal(stateAfter,stateBefore,'Stage 4 Oil shell controller mutated persisted state');

// Compare remains completely outside Stage 4 Oil ownership.
await nav('layoutcompare','#layoutcompareView');await wait(220);
assert.equal(await page.locator('#layoutcompareView [data-stage4-oil-owner]').count(),0,'Stage 4 Oil ownership leaked into Compare');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView','Oil builder moved into Compare');
assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(),1,'Compare builder missing after Stage 4 Oil controller');
const compareStateBefore=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates));
await page.evaluate(()=>window.STOT_OIL_PAGE_CONTROLLER.sync());
await wait(100);
const compareStateAfter=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates));
assert.equal(compareStateAfter,compareStateBefore,'Oil controller changed Compare A/B state');

await nav('oil','#oilView');await wait(650);
const snapAgain=await page.evaluate(()=>window.STOT_OIL_PAGE_CONTROLLER.snapshot());
assert.ok(snapAgain.calculator<snapAgain.quick&&snapAgain.quick<snapAgain.advanced&&snapAgain.advanced<snapAgain.builder&&snapAgain.builder<snapAgain.areas,'Oil canonical order was not restored after navigation');
assert.equal(errors.length,0,`Page errors (${engineName}${mobile?' mobile':''}):\n${errors.join('\n')}`);
console.log(`STAGE 4 OIL CONTROLLER PASS (${engineName}${mobile?' mobile':''}): authoritative Oil shell, stable state, Compare isolated`);
await browser.close();
