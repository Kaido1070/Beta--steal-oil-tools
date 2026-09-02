import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:775,height:900}});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.locator('.tabs button[data-view="oil"]').click();
await page.waitForTimeout(250);

const result=await page.evaluate(()=>{
  const api=window.STOT_VISUAL_PLOT_BUILDER;
  const plot=layoutPlots[0];
  const original=plot.rows.map(r=>({...r}));
  const originalReserve=window.STOT_REFINERY_RESERVE;

  function has2x2(placed){
    const used=Array(25).fill(false);
    for(const p of placed||[])for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)used[y*5+x]=true;
    for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(!used[y*5+x]&&!used[y*5+x+1]&&!used[(y+1)*5+x]&&!used[(y+1)*5+x+1])return true;
    return false;
  }

  const tests=[];
  // Quick Fill must reduce an impossible 4-Banana template before this point.
  // These are valid reserved rows: 3 Banana + 5 Clock, with one real 2x2 refinery reserved.
  plot.rows=[{drill:'banana',tier:0,count:3,hacker:550},{drill:'clock',tier:0,count:5,hacker:550}];
  window.STOT_REFINERY_RESERVE={plotId:plot.id,pieces:[[2,2]],qty:1,name:'Test 2x2 Refinery'};
  const p1=api.pack(plot);
  tests.push({area:pieceList(plot).area,reserve:has2x2(p1),packed:!!p1});

  // The 19/25 Demonic screenshot case should also draw around the same 2x2 reserve when feasible.
  plot.rows=[{drill:'demonic',tier:0,count:3,hacker:550},{drill:'clock',tier:0,count:1,hacker:550}];
  const p2=api.pack(plot);
  tests.push({area:pieceList(plot).area,reserve:has2x2(p2),packed:!!p2});

  plot.rows=original;
  window.STOT_REFINERY_RESERVE=originalReserve;
  return tests;
});

assert.ok(result[0].packed && result[0].reserve,JSON.stringify(result[0]));
assert.ok(result[1].packed && result[1].reserve,JSON.stringify(result[1]));
await browser.close();
console.log('refinery-aware visual packing passed',result);
