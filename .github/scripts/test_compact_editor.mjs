import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const b=await chromium.launch({headless:true});
const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
await p.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
await p.locator('.tabs button[data-view="oil"]').click();
await p.waitForTimeout(500);
await p.locator('.v572-plot-card[data-visual-plot]').first().click();
await p.waitForTimeout(250);
await p.locator('[data-vadd]').click();
await p.waitForTimeout(500);

const row=p.locator('.v572-editor-row').first();
const rowBox=await row.boundingBox();
assert.ok(rowBox,'compact drill row missing');
assert.ok(rowBox.height<105,`drill row still too tall: ${rowBox.height}`);

const arrows=p.locator('#v585GridTools [data-v585-move]');
assert.equal(await arrows.count(),4,'expected four directional controls');
assert.equal(await p.locator('#v585GridTools [data-v585-rotate]').count(),1,'rotate button missing');

await p.locator('.v572-editor-grid-preview [data-v585-piece]').first().click();
await p.waitForTimeout(150);
const selected=p.locator('.v572-editor-grid-preview [data-v585-piece].selected');
assert.equal(await selected.count(),1,'drill was not selected');
const before=await selected.evaluate(el=>getComputedStyle(el).gridColumnStart);
const right=p.locator('#v585GridTools [data-v585-move="1,0"]');
assert.equal(await right.isDisabled(),false,'right arrow should be available on initial placement');
await right.click();
await p.waitForTimeout(250);
const after=await p.locator('.v572-editor-grid-preview [data-v585-piece].selected').evaluate(el=>getComputedStyle(el).gridColumnStart);
assert.notEqual(after,before,`right arrow did not move the drill: ${before} -> ${after}`);

const toolsBox=await p.locator('#v585GridTools').boundingBox();
assert.ok(toolsBox,'controls missing');
assert.ok(toolsBox.height<145,`controls are too tall: ${toolsBox.height}`);

await b.close();
console.log(`compact row ${rowBox.height}px; controls ${toolsBox.height}px; move ${before}->${after}`);
