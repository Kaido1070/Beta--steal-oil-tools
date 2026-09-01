from pathlib import Path

CHANGELOG = '''/* STEAL THE OIL TYCOON — internal release changelog */
/* Newest release must stay first. Dates are null where an exact historical release date was not recorded here. */
window.STOT_CHANGELOG=Object.freeze([
  Object.freeze({version:"5.71",date:"Sep 2 2026",changes:Object.freeze([
    "Added a centralized release changelog",
    "Added build and browser checks that require the changelog version and date to match STOT_CONFIG",
    "Kept the website UI and calculator behavior unchanged"
  ])}),
  Object.freeze({version:"5.70",date:"Sep 2 2026",changes:Object.freeze([
    "Centralized the visible Last updated footer date",
    "Footer now reads its release date from STOT_CONFIG"
  ])}),
  Object.freeze({version:"5.69",date:null,changes:Object.freeze([
    "Centralized runtime site settings, version, page badges, language default, and storage namespace"
  ])}),
  Object.freeze({version:"5.68",date:null,changes:Object.freeze([
    "Separated the Oil / Hour runtime into js/pages/oil.js"
  ])}),
  Object.freeze({version:"5.67",date:null,changes:Object.freeze([
    "Separated the Sale Calculator runtime into js/pages/sale.js"
  ])}),
  Object.freeze({version:"5.66",date:null,changes:Object.freeze([
    "Separated the Drills runtime and picker into js/pages/drills.js"
  ])}),
  Object.freeze({version:"5.65",date:null,changes:Object.freeze([
    "Separated the Drill Compare base runtime into js/pages/compare.js"
  ])}),
  Object.freeze({version:"5.64",date:null,changes:Object.freeze([
    "Fixed Database pet atlas thumbnails being hidden by a CSS background shorthand"
  ])}),
  Object.freeze({version:"5.63",date:null,changes:Object.freeze([
    "Separated Codes into its own page runtime and stylesheet"
  ])}),
  Object.freeze({version:"5.62",date:null,changes:Object.freeze([
    "Separated Events into its own page runtime and stylesheet"
  ])}),
  Object.freeze({version:"5.61",date:null,changes:Object.freeze([
    "Scoped saved Preset state to the current build version"
  ])}),
  Object.freeze({version:"5.60",date:null,changes:Object.freeze([
    "Separated Database into page-owned runtime and styles"
  ])}),
  Object.freeze({version:"5.59",date:null,changes:Object.freeze([
    "Separated mutable game and database values into js/game-data.js"
  ])}),
  Object.freeze({version:"5.58",date:null,changes:Object.freeze([
    "Removed the remote public runtime bootstrap and switched Beta to a local consolidated runtime"
  ])})
]);
'''

Path('js/changelog.js').write_text(CHANGELOG, encoding='utf-8')

build = Path('scripts/consolidate-beta.sh')
s = build.read_text(encoding='utf-8')
if 'VERSION="5.70"' not in s:
    raise SystemExit('Expected v5.70 build pipeline')
s = s.replace('VERSION="5.70"', 'VERSION="5.71"', 1)

old = "    f'\\n<script defer src=\"js/site-config.js?v={version}\"></script>\\n'\n    f'<script defer src=\"js/game-data.js?v={version}\"></script>\\n'"
new = "    f'\\n<script defer src=\"js/site-config.js?v={version}\"></script>\\n'\n    f'<script defer src=\"js/changelog.js?v={version}\"></script>\\n'\n    f'<script defer src=\"js/game-data.js?v={version}\"></script>\\n'"
if old not in s:
    raise SystemExit('Could not add changelog script to generated index')
s = s.replace(old, new, 1)

if 'node --check js/changelog.js' not in s:
    s = s.replace('node --check js/site-config.js\n', 'node --check js/site-config.js\nnode --check js/changelog.js\n', 1)

marker = "grep -q '^window.STOT_CONFIG=' js/site-config.js\n"
check = """grep -q '^window.STOT_CONFIG=' js/site-config.js
node - \"$VERSION\" \"$LAST_UPDATED\" <<'NODE_CHANGELOG'
global.window={};
require('./js/changelog.js');
const [expectedVersion,expectedDate]=process.argv.slice(2);
const entries=window.STOT_CHANGELOG;
if(!Array.isArray(entries)||entries.length===0) throw new Error('STOT_CHANGELOG is empty');
const latest=entries[0];
if(latest.version!==expectedVersion) throw new Error(`Changelog latest version ${latest.version} does not match build ${expectedVersion}`);
if(latest.date!==expectedDate) throw new Error(`Changelog latest date ${latest.date} does not match ${expectedDate}`);
if(!Array.isArray(latest.changes)||latest.changes.length===0) throw new Error('Latest changelog entry has no changes');
const versions=entries.map(x=>x.version);
if(new Set(versions).size!==versions.length) throw new Error('Duplicate changelog versions');
for(const entry of entries){if(!entry.version||!Array.isArray(entry.changes)||entry.changes.length===0) throw new Error('Invalid changelog entry');}
NODE_CHANGELOG
"""
if marker not in s:
    raise SystemExit('Could not insert changelog build guard')
s = s.replace(marker, check, 1)

anchor = 'grep -q "js/site-config.js?v=${VERSION}" index.html\n'
if 'grep -q "js/changelog.js?v=${VERSION}" index.html' not in s:
    if anchor not in s:
        raise SystemExit('Could not add changelog index guard')
    s = s.replace(anchor, anchor + 'grep -q "js/changelog.js?v=${VERSION}" index.html\n', 1)

build.write_text(s, encoding='utf-8')

test_path = Path('tests/smoke-beta.mjs')
test = test_path.read_text(encoding='utf-8').replace('5.70', '5.71')
old_scripts = "assert.deepEqual(scriptSrcs, ['/js/site-config.js', '/js/game-data.js', '/js/app.js', '/js/pages/sale.js', '/js/pages/oil.js', '/js/pages/drills.js', '/js/pages/compare.js', '/js/pages/database.js', '/js/pages/events.js', '/js/pages/codes.js', '/js/beta-patches.bundle.js']);"
new_scripts = "assert.deepEqual(scriptSrcs, ['/js/site-config.js', '/js/changelog.js', '/js/game-data.js', '/js/app.js', '/js/pages/sale.js', '/js/pages/oil.js', '/js/pages/drills.js', '/js/pages/compare.js', '/js/pages/database.js', '/js/pages/events.js', '/js/pages/codes.js', '/js/beta-patches.bundle.js']);"
if old_scripts not in test:
    raise SystemExit('Could not update smoke script order')
test = test.replace(old_scripts, new_scripts, 1)

insertion = """const changelogSnapshot = await page.evaluate(() => ({
  latestVersion: window.STOT_CHANGELOG?.[0]?.version,
  latestDate: window.STOT_CHANGELOG?.[0]?.date,
  latestChanges: window.STOT_CHANGELOG?.[0]?.changes?.length,
  versions: window.STOT_CHANGELOG?.map(entry => entry.version),
}));
assert.equal(changelogSnapshot.latestVersion, '5.71');
assert.equal(changelogSnapshot.latestDate, 'Sep 2 2026');
assert.ok(changelogSnapshot.latestChanges >= 1, 'Latest changelog entry has no changes');
assert.equal(new Set(changelogSnapshot.versions).size, changelogSnapshot.versions.length, 'Duplicate changelog versions');

"""
script_marker = "const scriptSrcs = await page.locator('script[src]').evaluateAll(nodes => nodes.map(n => new URL(n.src).pathname));"
if script_marker not in test:
    raise SystemExit('Could not insert browser changelog checks')
test = test.replace(script_marker, insertion + script_marker, 1)
test_path.write_text(test, encoding='utf-8')
