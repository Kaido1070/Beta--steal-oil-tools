import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1408,height:1056}});
await page.goto('http://127.0.0.1:4173/', {waitUntil:'networkidle'});

const tab = page.locator('.tabs button[data-view="layoutcompare"]');
assert.equal(await tab.count(), 1, 'layout compare tab missing');
await tab.click();

const label = page.locator('#v536QuickFill .v537-reserve > .v537-checkline');
const reserve = page.locator('#v536QuickFill .v537-reserve');
const toggle = page.locator('#v537ReserveToggle');
await label.waitFor({state:'visible'});

const boxes = await page.evaluate(() => {
  const l = document.querySelector('#v536QuickFill .v537-reserve > .v537-checkline').getBoundingClientRect();
  const r = document.querySelector('#v536QuickFill .v537-reserve').getBoundingClientRect();
  const style = getComputedStyle(document.querySelector('#v536QuickFill .v537-reserve > .v537-checkline'));
  return {
    label:{left:l.left,right:l.right,top:l.top,bottom:l.bottom,width:l.width,height:l.height},
    reserve:{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height},
    display:style.display,
    width:style.width
  };
});

assert.equal(boxes.display, 'inline-flex', JSON.stringify(boxes));
assert.ok(boxes.label.right < boxes.reserve.right - 80, 'label still stretches into empty right side: '+JSON.stringify(boxes));
assert.equal(await toggle.isChecked(), false);

// Click the empty area on the same horizontal line as the label.
const emptyX = boxes.reserve.right - 18;
const labelY = boxes.label.top + boxes.label.height / 2;
assert.ok(emptyX > boxes.label.right + 20, 'no real empty area available for hitbox test');
await page.mouse.click(emptyX, labelY);
await page.waitForTimeout(80);
assert.equal(await toggle.isChecked(), false, 'empty right area incorrectly toggled refinery reserve');

// Click the actual checkbox + text hitbox.
await page.mouse.click(boxes.label.left + boxes.label.width / 2, labelY);
await page.waitForTimeout(80);
assert.equal(await toggle.isChecked(), true, 'actual label hitbox did not toggle refinery reserve');

await browser.close();
console.log('reserve hitbox test passed', boxes);
