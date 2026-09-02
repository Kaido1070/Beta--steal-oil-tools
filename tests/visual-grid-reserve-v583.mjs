import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:775,height:900}});
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await page.locator('.tabs button[data-view="oil"]').click();
await page.waitForTimeout(250);

const result=await page.evaluate(()=>{
  const api=window.STOT_VISUAL_PLOT_BUILDER;
  const original=layoutPlots[0].rows.map(r=>({...r}));
  function has2x2(placed){
    const used=Array(25).fill(false);
    for(const p of placed||[])for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)used[y*5+x]=true;
    for(let y=0;y<4;y++)for(let x=0;x<4;x++)if(!used[y*5+x]&&!used[y*5+x+1]&&!used[(y+1)*5+x]&&!used[(y+1)*5+x+1])return true;
    return false;
  }
  const tests=[];
  // Screenshot case: 4 Banana (4 cells each) + 5 Clock (1 cell each) = 21/25.
  layoutPlots[0].rows=[{drill:'banana',tier:0,count:4,hacker:550},{drill:'clock',tier:0,count:5,hacker:550}];
  const p1=api.pack(layoutPlots[0]);tests.push({area:pieceList(layoutPlots[0]).area,reserve:has2x2(p1)});
  // Screenshot case: 3 Demonic (6 cells each) + 1 Clock = 19/25.
  layoutPlots[0].rows=[{drill:'demonic',tier:0,count:3,hacker:550},{drill:'clock',tier:0,count:1,hacker:550}];
  const p2=api.pack(layoutPlots[0]);tests.push({area:pieceList(layoutPlots[0]).area,reserve:has2x2(p2)});
  layoutPlots[0].rows=original;
  return tests;
});

assert.deepEqual(result.map(x=>x.area),[21,19],JSON.stringify(result));
assert.ok(result[0].reserve,JSON.stringify(result[0]));
assert.ok(result[1].reserve,JSON.stringify(result[1]));
await browser.close();
console.log('2x2 reserve tests passed',result);
