import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE_URL = (process.env.STOT_DEPLOYED_URL || 'https://kaido1070.github.io/Beta--steal-oil-tools/').replace(/\/?$/, '/');
const markerResponse = await fetch(new URL(`build-version.json?verify=${Date.now()}`, BASE_URL), { cache: 'no-store' });
assert.equal(markerResponse.status, 200, 'build-version.json is not available');
const marker = await markerResponse.json();
assert.match(String(marker.build || ''), /^[0-9a-f]{40}$/i, 'build-version.json does not contain a full commit SHA');

const indexResponse = await fetch(new URL(`?verify=${Date.now()}`, BASE_URL), { cache: 'no-store' });
assert.equal(indexResponse.status, 200, 'Deployed index is unavailable');
const html = await indexResponse.text();
const source = html.match(/<meta name="stot-source-commit" content="([^"]+)">/i)?.[1] || '';
assert.equal(source, marker.build, 'Deployed index SHA does not match build-version.json');
assert.ok(html.includes('id="stot-build-guard"'), 'stot-build-guard is missing from deployed index');
assert.ok(!html.includes('aec48cd084062e3791d523b72cb65618948508c7'), 'Retired baseline commit is still present in deployed HTML');
const short = marker.build.slice(0, 12);
assert.match(html, new RegExp(`href="[^"]+\\.css\\?v=${short}"`), 'No commit-versioned CSS asset found');
assert.match(html, new RegExp(`src="[^"]+\\.js\\?v=${short}"`), 'No commit-versioned JS asset found');

// Browser-level guard sanity check: same build must not create a reload loop.
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
let mainNavigations = 0;
page.on('framenavigated', frame => {
  if (frame === page.mainFrame()) mainNavigations++;
});
await page.goto(BASE_URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(2200);
assert.ok(mainNavigations <= 2, `Possible build-guard reload loop detected (${mainNavigations} main-frame navigations)`);
const pageSource = await page.locator('meta[name="stot-source-commit"]').getAttribute('content');
assert.equal(pageSource, marker.build, 'Browser loaded a different deployed build than build-version.json');
await browser.close();

console.log(`DEPLOYMENT REGRESSION PASS: ${marker.build}`);
