import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL=process.env.STOT_TEST_URL||'http://127.0.0.1:4173/';
const engineName=(process.env.STOT_BROWSER||'chromium').toLowerCase();
const mobile=process.env.STOT_MOBILE==='1';
const engine=engineName==='webkit'?webkit:chromium;
const browser=await engine.launch({headless:true});
const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1280,height:900},isMobile:mobile,hasTouch:mobile});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const wait=(ms=80)=>page.waitForTimeout(ms);
const text=async sel=>((await page.locator(sel).textContent())||'').replace(/\s+/g,' ').trim();
async function nav(view,id){await page.locator(`.tabs button[data-view="${view}"]`).click();await wait(140);assert.equal(await page.locator(id).evaluate(el=>el.classList.contains('active')),true,`${id} not active`)}

await page.goto(BASE_URL,{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});
await nav('oil','#oilView');
const oilBefore=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().singleState));
assert.equal(await page.locator('#layoutVisualBuilder').count(),1,'Oil builder missing');

await nav('layoutcompare','#layoutcompareView');
await page.locator('#compareTemplateAdd').waitFor({state:'visible',timeout:10000});

// Oil-like calculator and boosts while preserving Compare-only A/B controls.
assert.equal(await page.locator('#v524CompareSettings').count(),1,'Different Base Settings missing');
assert.equal(await page.locator('[data-ab-layout="A"]').count(),1,'Preset A missing');
assert.equal(await page.locator('[data-ab-layout="B"]').count(),1,'Preset B missing');
assert.match(await text('#compareLayoutModeTabs [data-layoutmode="time"]'),/Time → Oil.*How much oil/i);
assert.match(await text('#compareLayoutModeTabs [data-layoutmode="target"]'),/Oil → Time.*reach your target/i);
assert.match(await text('#v520BoostsCompare'),/Optional.*Mole Level.*Fruit Level.*Heart Likes.*Admin Event Lobby/i);
const boostLayout=await page.evaluate(()=>{
  const panel=document.querySelector('#v520BoostsCompare');
  const hint=panel?.querySelector('.compare-boost-hint');
  const grid=panel?.querySelector('.v603-boost-grid');
  const cards=[...(grid?.querySelectorAll('.compare-boost-card')||[])];
  const rect=el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};
  return{panel:panel?rect(panel):null,hint:hint?rect(hint):null,grid:grid?rect(grid):null,cards:cards.map(rect)};
});
assert.equal(boostLayout.cards.length,4,'Preset Boosts must contain four equal cards');
assert.ok(boostLayout.grid.width>boostLayout.panel.width*.85,'Preset Boosts grid is squeezed into one column of the panel');
assert.ok(boostLayout.hint.width>boostLayout.panel.width*.75,'Optional boost hint is not a full-width row');
if(mobile){
  assert.ok(Math.abs(boostLayout.cards[0].y-boostLayout.cards[1].y)<4,'Mole and Fruit are not on the same mobile row');
  assert.ok(Math.abs(boostLayout.cards[2].y-boostLayout.cards[3].y)<4,'Heart Likes and Admin Event are not on the same mobile row');
  assert.ok(boostLayout.cards[2].y>boostLayout.cards[0].y+8,'Preset Boosts did not form a 2x2 mobile grid');
  assert.ok(Math.abs(boostLayout.cards[0].width-boostLayout.cards[1].width)<4,'Mobile boost cards are not equal width');
}else{
  assert.ok(boostLayout.cards.every(r=>Math.abs(r.y-boostLayout.cards[0].y)<4),'Desktop boost cards are not on one row');
}

// Quick Fill parity: multi-row template + real 5x5 fit + refinery reservation.
assert.equal(await page.locator('[data-compare-template-row]').count(),1);
await page.locator('#compareTemplateAdd').click();
assert.equal(await page.locator('[data-compare-template-row]').count(),2,'Add Drill to Template failed');
await page.locator('[data-compare-template-row="1"] [data-compare-template-drill]').selectOption('basic');
await page.locator('[data-compare-template-row="1"] [data-compare-template-count]').fill('1');
await wait();
assert.match(await text('#compareTemplateFit'),/\/ 25 cells|Doesn't fit 5×5/,'Template fit indicator missing');
assert.equal(await page.locator('#compareQuickApply').isDisabled(),false,'Valid template was rejected');
assert.equal(await page.locator('#compareReserveToggle').isDisabled(),false,'Refinery reservation unavailable');
await page.locator('#compareReserveToggle').check();
assert.equal(await page.locator('#compareReserveFields').evaluate(el=>el.classList.contains('show')),true,'Refinery fields did not open');
assert.ok(await page.locator('#compareRefinery option').count()>0,'Refinery list is empty');
await page.locator('#compareQuickTarget').selectOption('all');
await page.locator('#compareQuickApply').click();
await wait(180);
assert.match(await text('#compareQuickStatus'),/Filled .*Preset A/i,'Quick Fill did not report Preset A');
const afterA=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST.exportState());
assert.equal(afterA.compareStates.A.rows.filter(p=>p.rows.length).length,15,'Preset A was not filled');
assert.equal(afterA.compareStates.B.rows.filter(p=>p.rows.length).length,0,'Quick Fill leaked from A into B');
assert.match(await text('#layoutVisualBuilderCompare [data-compare-plot="forest-1"]'),/reserved|cells/i,'Reserved Plot 1 is not decorated');

// B can be filled independently and reservation can be disabled.
await page.locator('[data-ab-layout="B"]').click();await wait(120);
await page.locator('#compareReserveToggle').uncheck();
await page.locator('#compareQuickTarget').selectOption('desert');
await page.locator('#compareQuickApply').click();await wait(150);
const afterB=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST.exportState());
assert.equal(afterB.compareStates.B.rows.filter(p=>p.rows.length).length,3,'Preset B Desert Quick Fill wrong');
assert.equal(afterB.compareStates.A.rows.filter(p=>p.rows.length).length,15,'Editing B changed A');

// Copy Plot -> Paste Empty / Paste All / Clear All, matching Oil Advanced Tools semantics.
await page.locator('#layoutVisualBuilderCompare [data-compare-plot="desert-1"]').click();await wait(120);
await page.locator('#v603ComparePlotEditor [data-compare-copy-plot]').waitFor({state:'visible'});
await page.locator('#v603ComparePlotEditor [data-compare-copy-plot]').click();
await page.locator('#v603ComparePlotEditor [data-close]').click();await wait(80);
assert.equal(await page.locator('#comparePasteEmpty').isDisabled(),false,'Paste Empty stayed disabled after Copy Plot');
await page.locator('#comparePasteEmpty').click();await wait(140);
let advanced=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST.exportState().compareStates.B);
assert.equal(advanced.rows.filter(p=>p.rows.length).length,15,'Paste Empty did not fill B empty plots');
await page.locator('#compareClearAll').click();await wait(140);
advanced=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST.exportState().compareStates.B);
assert.equal(advanced.rows.filter(p=>p.rows.length).length,0,'Clear All did not clear active preset');
await page.locator('#comparePasteAll').click();await wait(140);
advanced=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST.exportState().compareStates.B);
assert.equal(advanced.rows.filter(p=>p.rows.length).length,15,'Paste All did not replace all active preset plots');

// Different Base Settings remains functional and stored separately from Oil.
await page.locator('[data-v524="separate"]').click();await wait(100);
await page.locator('[data-ab-layout="A"]').click();await page.locator('#compareLayoutMole').fill('20');await wait(80);
await page.locator('[data-ab-layout="B"]').click();await page.locator('#compareLayoutMole').fill('80');await wait(80);
const separate=await page.evaluate(()=>window.STOT_LAYOUT_PERSIST.exportState().compareStates);
assert.equal(String(separate.A.setup.mole),'20');
assert.equal(String(separate.B.setup.mole),'80');
const separateKey=await page.evaluate(()=>Object.keys(localStorage).find(k=>k.includes('compare-separate-boosts-v1'))||'');
assert.ok(separateKey,'Different Base Settings storage key missing');
assert.equal(await page.evaluate(k=>localStorage.getItem(k),separateKey),'1','Different Base Settings preference not persisted');

// Core isolation contract: Oil mutable state and Oil DOM stay untouched.
await nav('oil','#oilView');await wait(120);
const oilAfter=await page.evaluate(()=>JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.().singleState));
assert.equal(oilAfter,oilBefore,'Compare feature parity changed Oil / Hour state');
assert.equal(await page.locator('#layoutVisualBuilder').evaluate(el=>el.parentElement?.id||''),'oilView','Oil builder moved out of Oil');
assert.equal(await page.locator('#layoutcompareView #layoutVisualBuilderCompare').count(),1,'Compare builder left Compare');

assert.equal(errors.length,0,`Page errors (${engineName}${mobile?' mobile':''}):\n${errors.join('\n')}`);
console.log(`COMPARE FEATURE PARITY PASS (${engineName}${mobile?' mobile':''}): Quick Fill, refinery reserve, Advanced Tools, A/B boosts and Oil isolation`);
await browser.close();
