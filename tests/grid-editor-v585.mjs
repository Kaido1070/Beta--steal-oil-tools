import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1180,height:900}});
const base='http://127.0.0.1:4173/';

async function openOil(){
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('.tabs button[data-view="oil"]').click();
  await page.waitForSelector('#v536QuickFill');
  await page.waitForSelector('#layoutVisualBuilder');
}

await openOil();
const firstRow=page.locator('#v537TemplateRows [data-v537-row="0"]');
await firstRow.locator('[data-v537-drill]').selectOption('demonic');
await firstRow.locator('[data-v537-count]').fill('4');
await page.locator('#v537AddTemplateRow').click();
const secondRow=page.locator('#v537TemplateRows [data-v537-row="1"]');
await secondRow.locator('[data-v537-drill]').selectOption('clock');
await secondRow.locator('[data-v537-count]').fill('1');
const reserve=page.locator('#v537ReserveToggle');
if(await reserve.isChecked())await reserve.uncheck();
await page.locator('#v537QuickApply').click();
await page.waitForTimeout(120);

const firstCard=page.locator('#layoutVisualBuilder .v572-plot-card[data-visual-plot]').first();
const cardBlocks=firstCard.locator('.v572-drill-block');
if(await cardBlocks.count()!==5)throw new Error(`Quick Fill grid expected 5 drill blocks, got ${await cardBlocks.count()}`);
await firstCard.click();
await page.waitForSelector('#v572PlotEditor.open');
const previewBlocks=page.locator('.v572-editor-grid-preview [data-v585-piece]');
if(await previewBlocks.count()!==5)throw new Error(`Editor preview expected 5 interactive blocks, got ${await previewBlocks.count()}`);
const demonic=page.locator('.v572-editor-grid-preview [data-v585-piece^="r0i"]').first();
await demonic.click();
const beforeTitle=await demonic.getAttribute('title');
await page.locator('#v585GridTools [data-v585-rotate]').click();
await page.waitForTimeout(80);
const afterTitle=await page.locator('.v572-editor-grid-preview [data-v585-piece^="r0i"]').first().getAttribute('title');
if(beforeTitle===afterTitle)throw new Error('Rotate did not change Demonic orientation');

// Separate sparse-layout move test.
await page.reload({waitUntil:'networkidle'});
await page.locator('.tabs button[data-view="oil"]').click();
await page.waitForSelector('#layoutVisualBuilder');
const emptyCard=page.locator('#layoutVisualBuilder .v572-plot-card[data-visual-plot]').first();
await emptyCard.click();
await page.waitForSelector('#v572PlotEditor.open');
await page.locator('[data-vadd]').click();
await page.waitForTimeout(80);
let block=page.locator('.v572-editor-grid-preview [data-v585-piece="r0i0"]');
await block.click();
const beforeStyle=await block.getAttribute('style');
const grid=page.locator('.v572-editor-grid-preview .v572-grid-placements');
const box=await grid.boundingBox();
if(!box)throw new Error('Missing grid bounds');
// Place top-left at cell (2,3), a valid destination for a 3x2 drill.
await page.mouse.click(box.x+box.width*(2.5/5),box.y+box.height*(3.5/5));
await page.waitForTimeout(80);
block=page.locator('.v572-editor-grid-preview [data-v585-piece="r0i0"]');
const afterStyle=await block.getAttribute('style');
if(beforeStyle===afterStyle)throw new Error('Tap-to-move did not reposition the drill');

console.log('grid-editor-v585: quick-fill rendering, rotation, and movement passed');
await browser.close();
