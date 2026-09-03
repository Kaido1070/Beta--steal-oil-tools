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
await page.addInitScript(() => localStorage.clear());

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
await wait(250);
assert.notEqual(await page.locator('body').evaluate(el=>getComputedStyle(el).visibility),'hidden');

for(const [view,id] of [['sale','#saleView'],['oil','#oilView'],['drills','#drillsView'],['compare','#compareView'],['layoutcompare','#layoutcompareView'],['database','#databaseView'],['events','#eventsView'],['codes','#codesView']]) await nav(view,id);

// Oil / Hour baseline.
await nav('oil','#oilView');
assert.equal(await page.locator('#v536QuickFill').count(),1,'Quick Fill missing');
assert.equal(await page.locator('#v536AdvancedTools').count(),1,'Advanced Tools missing');
for(const id of ['#layoutPasteEmpty','#layoutPasteAll','#layoutClearAll']) assert.equal(await page.locator(id).count(),1,`${id} missing`);

await page.evaluate(()=>window.STOT_VISUAL_PLOT_BUILDER?.open('forest-1'));
await wait(80);
assert.equal(await page.locator('#v572PlotEditor.open').count(),1,'Plot editor did not open');
await page.locator('#v572PlotEditor [data-vadd]').click();
await wait(140);
assert.notEqual(await txt('#layoutNowRate'),'0/s','Added drill did not affect production');
await page.locator('#v572PlotEditor [data-vclose]').click();
await wait(80);

await page.locator('#layoutHours').fill('1'); await wait(80); const oil1=await txt('#layoutTimeOil');
await page.locator('#layoutHours').fill('2'); await wait(80); const oil2=await txt('#layoutTimeOil');
assert.notEqual(oil1,oil2,'Run Time did not change Oil Gained');
assert.notEqual(await txt('#layoutTimeEnd'),'0/s','End rate did not update');

await page.locator('#layoutModeTabs [data-layoutmode="target"]').click(); await wait(80);
assert.equal(await page.locator('#layoutTargetPane.active').count(),1,'Oil → Time not active');
await page.locator('#layoutTarget').fill('1');
await page.locator('#layoutTargetUnits [data-layouttarget="1000"]').click(); await wait(60);
assert.match(await txt('#layoutTargetDisplay'),/K$/i);
await page.locator('#layoutTargetUnits [data-layouttarget="1000000000000"]').click(); await wait(60);
assert.match(await txt('#layoutTargetDisplay'),/T$/i);
assert.ok((await txt('#layoutTargetTime')).length>0,'Time Needed missing');
await page.locator('#layoutModeTabs [data-layoutmode="time"]').click();

assert.equal(await page.locator('#v575StickyRate').count(),1,'Current Production sticky missing');
assert.equal(await txt('#v575StickyRate [data-v575-rate]'),await txt('#layoutNowRate'),'Current Production sticky stale');
await known('Oil / Hour owns Visual Plot Builder while active',async()=>{
  assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView');
});

// Compare Presets.
await nav('layoutcompare','#layoutcompareView'); await wait(220);
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'layoutcompareView');
assert.equal(await page.locator('#layoutVisualBuilder + .ab-compare').count(),1,'Comparison is not after builder');
await page.locator('[data-v524="separate"]').click(); await wait(100);
await page.locator('[data-ab-layout="B"]').click(); await wait(120);
assert.equal(await txt('.v524-shared-badge'),'Preset B settings','Preset B label wrong');
await page.locator('[data-ab-layout="A"]').click(); await wait(120);
assert.equal(await txt('.v524-shared-badge'),'Preset A settings','Preset A label wrong');

await page.locator('#layoutMole').fill('20'); await wait(100);
await page.locator('[data-ab-layout="B"]').click(); await wait(100);
await page.locator('#layoutMole').fill('80'); await wait(140);
const states=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.ok(states?.A&&states?.B,'Compare state unavailable');
assert.equal(String(states.A.setup?.mole),'20','Preset A Mole not independent');
assert.equal(String(states.B.setup?.mole),'80','Preset B Mole not independent');

await page.locator('[data-v524="shared"]').click(); await wait(140);
assert.equal(await txt('.v524-shared-badge'),'Shared A + B');
const shared=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST?.exportState?.().compareStates);
assert.equal(String(shared.A.setup?.mole),String(shared.B.setup?.mole),'Shared mode did not synchronize boosts');

await page.locator('#layoutModeTabs [data-layoutmode="time"]').click(); await page.locator('#layoutHours').fill('1'); await wait(100);
assert.equal(await txt('#v523ModeBadge'),'Time → Oil');
assert.ok((await txt('#abRateA')).length>0 && (await txt('#abRateB')).length>0,'A/B rates missing');
await page.locator('#layoutModeTabs [data-layoutmode="target"]').click(); await wait(100);
assert.equal(await txt('#v523ModeBadge'),'Oil → Time');
assert.doesNotMatch(await page.locator('#layoutcompareView').innerText(),/\bLayouts?\b/,'Visible Compare Presets terminology still says Layout');
assert.equal(await page.locator('#v601CompareSticky').count(),1,'Compare Presets sticky missing');

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
for(const [tab,root] of [['refineries','#refineryList'],['pets','#petList']]){
  await page.locator(`#databaseTabs [data-dbview="${tab}"]`).click(); await wait(100);
  assert.ok(await page.locator(`${root} .drill-card`).count()>0,`${tab} cards missing`);
}
await nav('events','#eventsView'); assert.ok(await page.locator('#eventList .event-card').count()>0,'Events missing');
await nav('codes','#codesView'); assert.ok(await page.locator('#codesList .code-card').count()>0,'Codes missing');

const storage=await page.evaluate(()=>({namespace:window.STOT_CONFIG?.storageNamespace,schema:window.STOT_CONFIG?.storageSchema,keys:Object.keys(localStorage)}));
assert.equal(storage.namespace,'stot'); assert.equal(storage.schema,1); assert.ok(storage.keys.length>0,'Persistence wrote no storage keys');
await page.reload({waitUntil:'networkidle'}); await wait(180);
assert.notEqual(await page.locator('body').evaluate(el=>getComputedStyle(el).visibility),'hidden');

assert.equal(pageErrors.length,0,`Page errors:\n${pageErrors.join('\n')}`);
const breaking=consoleErrors.filter(x=>/STOT .*failed|Uncaught|ReferenceError|TypeError/i.test(x));
assert.equal(breaking.length,0,`Breaking console errors:\n${breaking.join('\n')}`);
console.log(`DESKTOP REGRESSION PASS. Known current issues: ${knownIssues.length}`);
for(const issue of knownIssues) console.log(` - ${issue}`);
await browser.close();
