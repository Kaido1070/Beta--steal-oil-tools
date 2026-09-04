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
await page.waitForFunction(()=>!!window.STOT_LAYOUT_GEOMETRY&&!!window.__STOT_OIL_USES_CORE_GEOMETRY__&&!!window.__STOT_COMPARE_USES_CORE_GEOMETRY__,{timeout:10000});

assert.equal(await page.locator('script[data-stot-layout-geometry]').count(),1,'Stage 5 geometry core script must load exactly once');
const contract=await page.evaluate(()=>({
  frozen:Object.isFrozen(window.STOT_LAYOUT_GEOMETRY),
  pure:window.STOT_LAYOUT_GEOMETRY?.pure,
  version:window.STOT_LAYOUT_GEOMETRY?.version,
  oil:window.__STOT_OIL_USES_CORE_GEOMETRY__,
  compare:window.__STOT_COMPARE_USES_CORE_GEOMETRY__,
  oilOwner:window.STOT_OIL_QUICK_FILL?.geometryOwner
}));
assert.deepEqual(contract,{frozen:true,pure:true,version:1,oil:true,compare:true,oilOwner:'core'},'Stage 5 core/consumer ownership contract is wrong');

const audit=await page.evaluate(()=>{
  const g=window.STOT_LAYOUT_GEOMETRY;
  const stateBefore=JSON.stringify(window.STOT_LAYOUT_PERSIST?.exportState?.());
  const input=[[3,2],[2,3],[1,1]];
  const inputBefore=JSON.stringify(input);
  const basic={
    fallback:g.parseFootprint('bad-value'),
    parsed:g.parseFootprint('3x2'),
    area:g.piecesArea([[3,2],[2,2],[1,1]]),
    fits25:g.canPackPieces5x5(Array.from({length:25},()=>[1,1])),
    rejects26:g.canPackPieces5x5(Array.from({length:26},()=>[1,1])),
    rotates:g.canPackPieces5x5([[4,2],[3,1],[2,3],[1,2]]),
    inputStable:(g.canPackPieces5x5(input),JSON.stringify(input)===inputBefore)
  };

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
  return{basic,mismatches,stateStable:stateBefore===stateAfter};
});
assert.deepEqual(audit.basic.fallback,[1,1],'Invalid footprint fallback changed');
assert.deepEqual(audit.basic.parsed,[3,2],'Footprint parsing changed');
assert.equal(audit.basic.area,11,'Piece area is wrong');
assert.equal(audit.basic.fits25,true,'25 x 1x1 pieces should fit');
assert.equal(audit.basic.rejects26,false,'26 x 1x1 pieces must not fit');
assert.equal(audit.basic.rotates,true,'Core packing lost rotation support');
assert.equal(audit.basic.inputStable,true,'Core packing mutated caller input');
assert.deepEqual(audit.mismatches,[],'Stage 5 core packing diverges from legacy Oil packing samples');
assert.equal(audit.stateStable,true,'Pure Stage 5 geometry calls mutated persisted Oil/Compare state');

await page.locator('.tabs button[data-view="oil"]').click();await wait(250);
assert.equal(await page.locator('#v536QuickFill').count(),1,'Oil Quick Fill missing after Stage 5 core cutover');
assert.equal(await page.locator('#v537QuickApply').isEnabled(),true,'Oil Quick Fill template unexpectedly invalid after core cutover');
await page.locator('.tabs button[data-view="layoutcompare"]').click();await wait(300);
assert.equal(await page.locator('#v536QuickFillCompare').count(),1,'Compare Quick Fill missing after Stage 5 core cutover');
assert.equal(await page.locator('#compareQuickApply').isEnabled(),true,'Compare Quick Fill template unexpectedly invalid after core cutover');

assert.equal(errors.length,0,`Page errors (${engineName}${mobile?' mobile':''}):\n${errors.join('\n')}`);
console.log(`STAGE 5 CORE PASS (${engineName}${mobile?' mobile':''}): pure shared 5x5 geometry loaded once, Oil/Compare consumers migrated, state isolated`);
await browser.close();
