import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL = process.env.STOT_TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
const consoleErrors = [];
const knownIssues = [];
page.on('pageerror', e => pageErrors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

const wait = (ms=100)=>page.waitForTimeout(ms);
const txt = async sel => ((await page.locator(sel).textContent()) || '').replace(/\s+/g,' ').trim();
async function nav(view,id){
  await page.locator(`.tabs button[data-view="${view}"]`).click();
  await wait(140);
  assert.ok(await page.locator(id).evaluate(el=>el.classList.contains('active')),`${id} not active`);
  assert.equal(await page.locator('.view.active').count(),1,`Multiple active views after ${view}`);
}
async function known(name,fn){try{await fn();console.log(`KNOWN CHECK PASSING: ${name}`)}catch(e){knownIssues.push(`${name}: ${e.message}`);console.log(`KNOWN CURRENT BUG: ${name}: ${e.message}`)}}

await page.goto(BASE_URL,{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});
await wait(250);
assert.notEqual(await page.locator('body').evaluate(el=>getComputedStyle(el).visibility),'hidden');

for(const [view,id] of [['sale','#saleView'],['oil','#oilView'],['drills','#drillsView'],['compare','#compareView'],['layoutcompare','#layoutcompareView'],['database','#databaseView'],['events','#eventsView'],['codes','#codesView']]) await nav(view,id);

// Drills page.
await nav('drills','#drillsView');
const basicRate=await txt('#drillMainRate');
await page.locator('#tierButtons [data-tier="10"]').click(); await wait(70);
const galaxyRate=await txt('#drillMainRate');
assert.notEqual(galaxyRate,basicRate,'Changing Drill Tier did not change production');
await page.locator('#areaButtons [data-area="10"]').click(); await wait(70);
assert.notEqual(await txt('#drillMainRate'),galaxyRate,'Changing Production Area did not change production');
await page.locator('#drillPickerBtn').click();
await page.locator('#pickerSearch').fill('Clock'); await wait(80);
assert.equal(await page.locator('#pickerList [data-pick="clock"]').count(),1,'Clock Drill was not found in picker');
await page.locator('#pickerList [data-pick="clock"]').click(); await wait(80);
assert.match(await txt('#drillPickerBtn'),/Clock/i,'Drill picker did not select Clock Drill');
await page.locator('#drillHours').fill('2'); await wait(80);
assert.match(await txt('#drillMainLabel'),/Rate After/i,'Dynamic Clock Drill calculation did not activate');

// Oil / Hour baseline and permanent node identities.
await nav('oil','#oilView');
assert.equal(await page.locator('#v536QuickFill').count(),1,'Oil Quick Fill missing');
assert.equal(await page.locator('#v536AdvancedTools').count(),1,'Oil Advanced Tools missing');
for(const id of ['#layoutPasteEmpty','#layoutPasteAll','#layoutClearAll']) assert.equal(await page.locator(id).count(),1,`${id} missing`);
await page.evaluate(()=>{
  window.__desktopOilRefs={
    controls:document.querySelector('#oilView .layout-controls'),
    areas:document.getElementById('layoutAreas'),
    quick:document.getElementById('v536QuickFill'),
    advanced:document.getElementById('v536AdvancedTools'),
    builder:document.getElementById('layoutVisualBuilder')
  };
});

await page.evaluate(()=>window.STOT_VISUAL_PLOT_BUILDER?.open('forest-1'));
await wait(80);
assert.equal(await page.locator('#v572PlotEditor.open').count(),1,'Oil Plot editor did not open');
await page.locator('#v572PlotEditor [data-vadd]').click();
await wait(140);
assert.notEqual(await txt('#layoutNowRate'),'0/s','Added Oil drill did not affect production');
await page.locator('#v572PlotEditor [data-vclose]').click();
await wait(80);

await page.locator('#layoutHours').fill('1'); await wait(80); const oil1=await txt('#layoutTimeOil');
await page.locator('#layoutHours').fill('2'); await wait(80); const oil2=await txt('#layoutTimeOil');
assert.notEqual(oil1,oil2,'Oil Run Time did not change Oil Gained');
assert.notEqual(await txt('#layoutTimeEnd'),'0/s','Oil End rate did not update');

await page.locator('#layoutModeTabs [data-layoutmode="target"]').click(); await wait(80);
assert.equal(await page.locator('#layoutTargetPane.active').count(),1,'Oil → Time not active');
await page.locator('#layoutTarget').fill('1');
await page.locator('#layoutTargetUnits [data-layouttarget="1000"]').click(); await wait(60);
assert.match(await txt('#layoutTargetDisplay'),/K$/i);
await page.locator('#layoutTargetUnits [data-layouttarget="1000000000000"]').click(); await wait(60);
assert.match(await txt('#layoutTargetDisplay'),/T$/i);
assert.ok((await txt('#layoutTargetTime')).length>0,'Oil Time Needed missing');
await page.locator('#layoutModeTabs [data-layoutmode="time"]').click();

assert.equal(await page.locator('#v575StickyRate').count(),1,'Current Production sticky missing');
assert.equal(await txt('#v575StickyRate [data-v575-rate]'),await txt('#layoutNowRate'),'Current Production sticky stale');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView','Oil builder left Oil / Hour');

const oilStateBeforeCompare=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().singleState));

// Compare Presets: completely isolated DOM + A/B state.
await nav('layoutcompare','#layoutcompareView'); await wait(220);
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView','Oil builder moved into Compare Presets');
assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(),1,'Compare builder is not inside Compare Presets');
assert.equal(await page.evaluate(()=>{
  const r=window.__desktopOilRefs||{},view=document.getElementById('layoutcompareView');
  return r.controls===document.querySelector('#oilView .layout-controls') &&
    r.areas===document.getElementById('layoutAreas') && document.getElementById('layoutAreas')?.parentElement?.id==='oilView' &&
    r.quick===document.getElementById('v536QuickFill') && !view?.contains(r.quick) &&
    r.advanced===document.getElementById('v536AdvancedTools') && !view?.contains(r.advanced) &&
    r.builder===document.getElementById('layoutVisualBuilder');
}),true,'Oil workspace leaked into Compare Presets');

const compareOrderOk=await page.evaluate(()=>{
  const view=document.getElementById('layoutcompareView');
  const advanced=view?.querySelector('#v536AdvancedToolsCompare');
  const builder=view?.querySelector('#layoutVisualBuilderCompare');
  const comparison=view?.querySelector('.ab-compare');
  return !!advanced&&!!builder&&!!comparison&&builder.parentElement===advanced.parentElement&&builder.previousElementSibling===advanced&&!!(builder.compareDocumentPosition(comparison)&Node.DOCUMENT_POSITION_FOLLOWING);
});
assert.equal(compareOrderOk,true,'Compare order must be Compare Advanced Tools -> Visual Plot Builder -> Preset Comparison');
assert.equal(await page.locator('#layoutVisualBuilderCompare .v572-plot-card').count(),15,'Compare builder does not contain 15 plot cards');
assert.equal(await page.locator('#v536QuickFillCompare').count(),1,'Compare Quick Fill missing');
assert.equal(await page.locator('#v536AdvancedToolsCompare').count(),1,'Compare Advanced Tools missing');

await page.locator('[data-v524="separate"]').click(); await wait(100);
await page.locator('[data-ab-layout="B"]').click(); await wait(120);
assert.equal(await txt('.v524-shared-badge'),'Preset B settings','Preset B label wrong');
await page.locator('[data-ab-layout="A"]').click(); await wait(120);
assert.equal(await txt('.v524-shared-badge'),'Preset A settings','Preset A label wrong');

// Preset A independent boost setup.
await page.locator('#compareLayoutMole').fill('20');
await page.locator('#compareLayoutFruit').fill('30');
await page.locator('#compareLayoutLikes').fill('400');
await page.locator('#compareLayoutX2 [data-layoutx2="2"]').click();
await wait(100);

// Preset B independent boost setup.
await page.locator('[data-ab-layout="B"]').click(); await wait(100);
await page.locator('#compareLayoutMole').fill('80');
await page.locator('#compareLayoutFruit').fill('90');
await page.locator('#compareLayoutLikes').fill('900');
await page.locator('#compareLayoutX2 [data-layoutx2="1"]').click();
await wait(120);

const states=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.ok(states?.A&&states?.B,'Compare state unavailable');
for(const [key,a,b] of [['mole','20','80'],['fruit','30','90'],['likes','400','900']]){
  assert.equal(String(states.A.setup?.[key]),a,`Preset A ${key} not independent`);
  assert.equal(String(states.B.setup?.[key]),b,`Preset B ${key} not independent`);
}
assert.equal(Number(states.A.setup?.lobby),2,'Preset A lobby setting not independent');
assert.equal(Number(states.B.setup?.lobby),1,'Preset B lobby setting not independent');

await page.locator('[data-v524="shared"]').click(); await wait(120);
assert.equal(await txt('.v524-shared-badge'),'Shared A + B');
const shared=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
for(const key of ['mole','fruit','likes','lobby']) assert.equal(String(shared.A.setup?.[key]),String(shared.B.setup?.[key]),`Shared mode did not synchronize ${key}`);

await page.locator('#compareLayoutModeTabs [data-layoutmode="time"]').click();
await page.locator('#compareLayoutHours').fill('1'); await wait(100);
assert.equal(await txt('#v523ModeBadge'),'Time → Oil');
assert.ok((await txt('#abRateA')).length>0 && (await txt('#abRateB')).length>0,'A/B rates missing');
await page.locator('#compareLayoutModeTabs [data-layoutmode="target"]').click(); await wait(100);
assert.equal(await txt('#v523ModeBadge'),'Oil → Time');
assert.equal(await page.locator('#compareLayoutTargetPane.active').count(),1,'Compare target pane not active');
assert.equal(await page.locator('#v601CompareSticky').count(),1,'Compare Presets sticky missing');
assert.equal(await txt('#v601CompareSticky [data-v601-a]'),await txt('#abRateA'),'Compare sticky A rate stale');
assert.equal(await txt('#v601CompareSticky [data-v601-b]'),await txt('#abRateB'),'Compare sticky B rate stale');

// Compare Visual Plot editor must change Compare only.
await page.locator('#layoutVisualBuilderCompare [data-compare-plot="forest-1"]').click();
await wait(80);
assert.equal(await page.locator('#v603ComparePlotEditor.open').count(),1,'Compare plot editor did not open');
await page.locator('#v603ComparePlotEditor [data-add]').click();
await wait(120);
await page.locator('#v603ComparePlotEditor [data-close]').click();
await wait(100);
const compareAfterEdit=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.ok(compareAfterEdit.B.rows.some(p=>p.rows.length)||compareAfterEdit.A.rows.some(p=>p.rows.length),'Compare plot edit was not saved');

// Leaving Compare must reveal unchanged Oil state and exact original nodes.
await nav('oil','#oilView'); await wait(180);
const oilStateAfterCompare=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().singleState));
assert.equal(oilStateAfterCompare,oilStateBeforeCompare,'Compare Presets changed Oil / Hour state');
assert.equal(await page.evaluate(()=>{
  const r=window.__desktopOilRefs||{};
  return r.controls===document.querySelector('#oilView .layout-controls')&&r.areas===document.getElementById('layoutAreas')&&r.quick===document.getElementById('v536QuickFill')&&r.advanced===document.getElementById('v536AdvancedTools')&&r.builder===document.getElementById('layoutVisualBuilder');
}),true,'Oil workspace nodes were replaced after Compare');

// Compare Drills.
await nav('compare','#compareView');
await page.locator('#compareA').selectOption('clock'); await page.locator('#compareB').selectOption('basic'); await wait(120);
assert.match(await txt('#compareCards'),/Clock/i);
assert.match(await txt('#compareInsight'),/Result:/i);
for(const id of ['#compareAThumb','#compareBThumb']){
  assert.equal(await page.locator(id).count(),1,`${id} missing`);
  assert.notEqual(await page.locator(id).evaluate(el=>getComputedStyle(el).backgroundImage),'none',`${id} atlas image missing`);
}
const largeVisuals=await page.locator('#compareCards .compare-logo').evaluateAll(nodes=>nodes.map(el=>{
  const img=el.querySelector('img');
  return {imgOk:!!img&&img.complete&&img.naturalWidth>0,bg:getComputedStyle(el).backgroundImage};
}));
assert.equal(largeVisuals.length,2,'Expected two large Compare Drill visuals');
assert.ok(largeVisuals.every(v=>v.imgOk||v.bg!=='none'),'A large Compare Drill visual is missing');

// Database / Events / Codes.
await nav('database','#databaseView');
assert.ok(await page.locator('#drillList .drill-card').count()>0,'Database drill cards missing');
for(const [tab,root] of [['refineries','#refineryList'],['pets','#petList']]){
  await page.locator(`#databaseTabs [data-dbview="${tab}"]`).click(); await wait(100);
  assert.ok(await page.locator(`${root} .drill-card`).count()>0,`${tab} cards missing`);
}
await nav('events','#eventsView'); assert.ok(await page.locator('#eventList .event-card').count()>0,'Events missing');
await nav('codes','#codesView'); assert.ok(await page.locator('#codesList .code-card').count()>0,'Codes missing');

// Current storage contract remains stable.
const storage=await page.evaluate(()=>({namespace:window.STOT_CONFIG?.storageNamespace,schema:window.STOT_CONFIG?.storageSchema,keys:Object.keys(localStorage).sort()}));
assert.equal(storage.namespace,'stot');
assert.equal(storage.schema,1);
assert.ok(storage.keys.length>0,'Persistence wrote no storage keys');
const keysBeforeReload=storage.keys;
await page.reload({waitUntil:'networkidle'}); await wait(180);
assert.notEqual(await page.locator('body').evaluate(el=>getComputedStyle(el).visibility),'hidden');
const keysAfterReload=await page.evaluate(()=>Object.keys(localStorage).sort());
for(const key of keysBeforeReload) assert.ok(keysAfterReload.includes(key),`Storage key disappeared after reload: ${key}`);

assert.equal(pageErrors.length,0,`Page errors:\n${pageErrors.join('\n')}`);
const breaking=consoleErrors.filter(x=>/STOT .*failed|Uncaught|ReferenceError|TypeError/i.test(x));
assert.equal(breaking.length,0,`Breaking console errors:\n${breaking.join('\n')}`);
console.log(`DESKTOP REGRESSION PASS. Known current issues: ${knownIssues.length}`);
for(const issue of knownIssues) console.log(` - ${issue}`);
await browser.close();
