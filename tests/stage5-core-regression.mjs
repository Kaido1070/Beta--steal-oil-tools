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

await page.goto(BASE_URL,{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});
await page.waitForFunction(()=>!!window.STOT_LAYOUT_GEOMETRY&&!!window.STOT_LAYOUT_ROWS&&!!window.STOT_LAYOUT_PRODUCTION&&!!window.__STOT_OIL_USES_CORE_GEOMETRY__&&!!window.__STOT_COMPARE_USES_CORE_GEOMETRY__&&!!window.__STOT_OIL_USES_CORE_ROWS__&&!!window.__STOT_COMPARE_USES_CORE_ROWS__&&!!window.__STOT_OIL_USES_CORE_PRODUCTION__&&!!window.__STOT_COMPARE_USES_CORE_PRODUCTION__,{timeout:10000});

assert.equal(await page.locator('script[data-stot-layout-geometry]').count(),1,'Stage 5 geometry core script must load exactly once');
assert.equal(await page.locator('script[data-stot-layout-rows]').count(),1,'Stage 5 row core script must load exactly once');
assert.equal(await page.locator('script[data-stot-layout-production]').count(),1,'Stage 5 production core script must load exactly once');
const contract=await page.evaluate(()=>({
  geometryFrozen:Object.isFrozen(window.STOT_LAYOUT_GEOMETRY),
  geometryPure:window.STOT_LAYOUT_GEOMETRY?.pure,
  geometryVersion:window.STOT_LAYOUT_GEOMETRY?.version,
  rowsFrozen:Object.isFrozen(window.STOT_LAYOUT_ROWS),
  rowsPure:window.STOT_LAYOUT_ROWS?.pure,
  rowsVersion:window.STOT_LAYOUT_ROWS?.version,
  productionFrozen:Object.isFrozen(window.STOT_LAYOUT_PRODUCTION),
  productionPure:window.STOT_LAYOUT_PRODUCTION?.pure,
  productionVersion:window.STOT_LAYOUT_PRODUCTION?.version,
  oilGeometry:window.__STOT_OIL_USES_CORE_GEOMETRY__,
  compareGeometry:window.__STOT_COMPARE_USES_CORE_GEOMETRY__,
  oilRows:window.__STOT_OIL_USES_CORE_ROWS__,
  compareRows:window.__STOT_COMPARE_USES_CORE_ROWS__,
  compareReserve:window.__STOT_COMPARE_USES_CORE_RESERVE__,
  oilProduction:window.__STOT_OIL_USES_CORE_PRODUCTION__,
  compareProduction:window.__STOT_COMPARE_USES_CORE_PRODUCTION__,
  oilGeometryOwner:window.STOT_OIL_QUICK_FILL?.geometryOwner,
  oilRowsOwner:window.STOT_OIL_QUICK_FILL?.rowsOwner,
  oilReserveOwner:window.STOT_OIL_QUICK_FILL?.reserveFitOwner,
  oilProductionOwner:window.STOT_OIL_QUICK_FILL?.productionOwner
}));
assert.deepEqual(contract,{
  geometryFrozen:true,geometryPure:true,geometryVersion:1,
  rowsFrozen:true,rowsPure:true,rowsVersion:1,
  productionFrozen:true,productionPure:true,productionVersion:1,
  oilGeometry:true,compareGeometry:true,oilRows:true,compareRows:true,compareReserve:true,
  oilProduction:true,compareProduction:true,
  oilGeometryOwner:'core',oilRowsOwner:'core',oilReserveOwner:'core',oilProductionOwner:'core'
},'Stage 5 core/consumer ownership contract is wrong');

const audit=await page.evaluate(()=>{
  const g=window.STOT_LAYOUT_GEOMETRY,r=window.STOT_LAYOUT_ROWS,p=window.STOT_LAYOUT_PRODUCTION;
  const stateBefore=JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.());
  const input=[[3,2],[2,3],[1,1]];
  const inputBefore=JSON.stringify(input);
  const productionInput={special:'heart',oil:999,heartLikes:250,hackerOil:700,tierMultiplier:10,petMultiplier:1.5};
  const productionInputBefore=JSON.stringify(productionInput);
  const basic={
    fallback:g.parseFootprint('bad-value'),
    parsed:g.parseFootprint('3x2'),
    area:g.piecesArea([[3,2],[2,2],[1,1]]),
    fits25:g.canPackPieces5x5(Array.from({length:25},()=>[1,1])),
    rejects26:g.canPackPieces5x5(Array.from({length:26},()=>[1,1])),
    rotates:g.canPackPieces5x5([[4,2],[3,1],[2,3],[1,2]]),
    inputStable:(g.canPackPieces5x5(input),JSON.stringify(input)===inputBefore)
  };
  const production={
    regularBase:p.rowBaseRate({special:'',oil:320}),
    heartBase:p.rowBaseRate({special:'heart',oil:999,heartLikes:250}),
    hackerBase:p.rowBaseRate({special:'hacker',oil:999,hackerOil:700}),
    clockBase:p.rowBaseRate({special:'clock',oil:999}),
    regularLoss:p.rowLoss({oil:320,tierMultiplier:10,petMultiplier:1.5}),
    heartLoss:p.rowLoss(productionInput),
    hackerLoss:p.rowLoss({special:'hacker',hackerOil:700,tierMultiplier:5,petMultiplier:2}),
    clockLoss:p.rowLoss({special:'clock',oil:999,tierMultiplier:3,petMultiplier:2}),
    inputStable:(p.rowLoss(productionInput),JSON.stringify(productionInput)===productionInputBefore)
  };

  const normalizedDefault=r.normalizeRows([{drill:'unknown',tier:9,count:99,hacker:-5}]);
  const normalizedCompare=r.normalizeRows([{drill:'unknown',tier:9.8,count:0,hacker:'bad'}],{
    validDrillIds:['demonic','basic'],fallbackDrill:'demonic',tierMin:0,tierMax:4
  });
  const syntheticDrills=[{id:'a',footprint:'1x1'},{id:'b',footprint:'1x1'},{id:'wide',footprint:'2x3'}];
  const rowPieces=r.piecesFromRows([{drill:'wide',tier:0,count:2,hacker:550}],syntheticDrills);
  const footprintPieces=r.footprintPieces('2x3',2);
  const reserveInput=[{drill:'a',tier:0,count:24,hacker:550},{drill:'b',tier:0,count:1,hacker:550}];
  const reserveInputBefore=JSON.stringify(reserveInput);
  const reserve=r.bestFitWithReserve({
    rows:reserveInput,
    reservePieces:[[1,1]],
    drillList:syntheticDrills,
    losses:[100,1]
  });

  const mismatches=[];
  if(typeof canPack5x5==='function'&&Array.isArray(window.drills)){
    const sample=window.drills.slice(0,Math.min(20,window.drills.length));
    for(const d of sample){
      const [w,h]=g.parseFootprint(d.footprint),area=Math.max(1,w*h),max=Math.min(25,Math.ceil(25/area)+2);
      for(let count=1;count<=max;count++){
        const row={drill:d.id,tier:0,count,hacker:550};
        const legacy=!!canPack5x5({rows:[row]});
        const core=g.canPackPieces5x5(Array.from({length:count},()=>[w,h]));
        if(legacy!==core)mismatches.push(`${d.id}:${count}:${legacy}/${core}`);
      }
    }
  }
  const stateAfter=JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.());
  return{
    basic,production,normalizedDefault,normalizedCompare,rowPieces,footprintPieces,reserve,
    reserveInputStable:JSON.stringify(reserveInput)===reserveInputBefore,
    mismatches,stateStable:stateBefore===stateAfter
  };
});
assert.deepEqual(audit.basic.fallback,[1,1],'Invalid footprint fallback changed');
assert.deepEqual(audit.basic.parsed,[3,2],'Footprint parsing changed');
assert.equal(audit.basic.area,11,'Piece area is wrong');
assert.equal(audit.basic.fits25,true,'25 x 1x1 pieces should fit');
assert.equal(audit.basic.rejects26,false,'26 x 1x1 pieces must not fit');
assert.equal(audit.basic.rotates,true,'Core packing lost rotation support');
assert.equal(audit.basic.inputStable,true,'Core packing mutated caller input');
assert.deepEqual(audit.production,{regularBase:320,heartBase:250,hackerBase:700,clockBase:1,regularLoss:4800,heartLoss:3750,hackerLoss:7000,clockLoss:6,inputStable:true},'Shared production-loss arithmetic changed');
assert.deepEqual(audit.normalizedDefault,[{drill:'unknown',tier:9,count:25,hacker:0}],'Oil-compatible row normalization changed');
assert.deepEqual(audit.normalizedCompare,[{drill:'demonic',tier:4,count:1,hacker:550}],'Compare-compatible row normalization changed');
assert.deepEqual(audit.rowPieces,[[2,3],[2,3]],'Row-to-piece conversion is wrong');
assert.deepEqual(audit.footprintPieces,[[2,3],[2,3]],'Footprint piece expansion is wrong');
assert.equal(audit.reserve.ok,true,'Shared reserve-fit search rejected a valid layout');
assert.equal(audit.reserve.removed,1,'Shared reserve-fit search removed the wrong number of drills');
assert.equal(audit.reserve.reservedCells,1,'Shared reserve-fit search reported wrong reserved cells');
assert.deepEqual(audit.reserve.rows,[{drill:'a',tier:0,count:24,hacker:550}],'Shared reserve-fit search did not remove the lowest-loss row');
assert.equal(audit.reserveInputStable,true,'Shared row/reserve core mutated caller rows');
assert.deepEqual(audit.mismatches,[],'Stage 5 core packing diverges from legacy Oil packing samples');
assert.equal(audit.stateStable,true,'Pure Stage 5 core calls mutated persisted Oil/Compare state');

await page.locator('.tabs button[data-view="oil"]').click();await wait(250);
assert.equal(await page.locator('#v536QuickFill').count(),1,'Oil Quick Fill missing after Stage 5 core cutover');
assert.equal(await page.locator('#v537QuickApply').isEnabled(),true,'Oil Quick Fill template unexpectedly invalid after core cutover');
await page.locator('.tabs button[data-view="layoutcompare"]').click();await wait(300);
assert.equal(await page.locator('#v536QuickFillCompare').count(),1,'Compare Quick Fill missing after Stage 5 core cutover');
assert.equal(await page.locator('#compareQuickApply').isEnabled(),true,'Compare Quick Fill template unexpectedly invalid after core cutover');

assert.equal(errors.length,0,`Page errors (${engineName}${mobile?' mobile':''}):\n${errors.join('\n')}`);
console.log(`STAGE 5 CORE PASS (${engineName}${mobile?' mobile':''}): geometry + row/reserve + production cores shared, Oil/Compare state isolated`);
await browser.close();
