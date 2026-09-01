from pathlib import Path
import re

BUILD = Path('scripts/consolidate-beta.sh')
TEST = Path('tests/smoke-beta.mjs')

s = BUILD.read_text(encoding='utf-8')
if 'VERSION="5.68"' not in s:
    raise SystemExit('Expected v5.68 pipeline')
s = s.replace('VERSION="5.68"', 'VERSION="5.69"', 1)

anchor = '# Keep already-separated page module version markers aligned with this build.'
step = r'''# Step 10: centralize runtime site settings/version/storage namespace.
python3 - "$VERSION" "$SOURCE_COMMIT" <<'PY_CONFIG'
from pathlib import Path
import re, sys

version, source_commit = sys.argv[1:3]
config = f''' + "'''" + r'''/* STEAL THE OIL TYCOON — central site settings */
window.STOT_CONFIG=Object.freeze({{
  version:"{version}",
  sourceCommit:"{source_commit}",
  storageNamespace:"stot",
  storageSchema:1,
  defaultLanguage:"en",
  pageBadges:Object.freeze({{
    sale:"Sale Calculator",
    oil:"Oil Layout",
    drills:"Drill Calculator",
    compare:"Drill Compare",
    layoutcompare:"Layout Compare",
    database:"Game Database",
    events:"Events",
    codes:"Codes"
  }}),
  storageKey(scope,suffix="v1"){{return `${{this.storageNamespace}}-v${{this.version}}-${{scope}}-${{suffix}}`;}}
}});
''' + "'''" + r'''
Path('js/site-config.js').write_text(config,encoding='utf-8')

app_path=Path('js/app.js')
app=app_path.read_text(encoding='utf-8')
loader=''' + "'''" + r'''/* STOT core runtime: game values live in js/game-data.js */
if(!window.STOT_GAME_DATA) throw new Error("STOT game data failed to load");
const {drills,pets,refineries,solarPanels,totems,decorations,lootboxes}=window.STOT_GAME_DATA;''' + "'''" + r'''
replacement=''' + "'''" + r'''/* STOT core runtime: shared settings + game values */
if(!window.STOT_CONFIG) throw new Error("STOT site config failed to load");
const STOT_CONFIG=window.STOT_CONFIG;
if(!window.STOT_GAME_DATA) throw new Error("STOT game data failed to load");
const {drills,pets,refineries,solarPanels,totems,decorations,lootboxes}=window.STOT_GAME_DATA;''' + "'''" + r'''
if loader in app:
    app=app.replace(loader,replacement,1)
elif 'const STOT_CONFIG=window.STOT_CONFIG;' not in app:
    raise SystemExit('Could not centralize app config loader')
old='const viewBadges={sale:"Sale Calculator",oil:"Oil Layout",drills:"Drill Calculator",compare:"Drill Compare",database:"Game Database",events:"Events",codes:"Codes"};'
if old in app:
    app=app.replace(old,'const viewBadges={...STOT_CONFIG.pageBadges};',1)
elif 'const viewBadges={...STOT_CONFIG.pageBadges};' not in app:
    raise SystemExit('Could not centralize page badges')
if 'I18N.setLanguage("en");' in app:
    app=app.replace('I18N.setLanguage("en");','I18N.setLanguage(STOT_CONFIG.defaultLanguage);',1)
app_path.write_text(app,encoding='utf-8')

pages=[
  ('js/pages/events.js','stotEventsPage'),
  ('js/pages/codes.js','stotCodesPage'),
  ('js/pages/compare.js','stotComparePage'),
  ('js/pages/drills.js','stotDrillsPage'),
  ('js/pages/sale.js','stotSalePage'),
  ('js/pages/oil.js','stotOilPage'),
]
for path,attr in pages:
    p=Path(path); text=p.read_text(encoding='utf-8')
    text=re.sub(r'/\* (STOT .*? page runtime) v5\.\d+(.*?)\*/',r'/* \1 — version from js/site-config.js\2 */',text,count=1)
    text=re.sub(rf'document\.documentElement\.dataset\.{attr}="5\.\d+";',rf'document.documentElement.dataset.{attr}=STOT_CONFIG.version;',text)
    p.write_text(text,encoding='utf-8')

patch=Path('js/v539-04.js')
text=patch.read_text(encoding='utf-8')
old='const BUILD_VERSION=document.querySelector(\'meta[name="stot-local-version"]\')?.content||window.__STOT_CONSOLIDATED_RUNTIME__||"unknown",KEY=`stot-v${BUILD_VERSION}-layout-save-v1`'
new='const BUILD_VERSION=window.STOT_CONFIG?.version||document.querySelector(\'meta[name="stot-local-version"]\')?.content||window.__STOT_CONSOLIDATED_RUNTIME__||"unknown",KEY=window.STOT_CONFIG?.storageKey?.("layout-save")||`stot-v${BUILD_VERSION}-layout-save-v1`'
if old in text:
    text=text.replace(old,new,1)
elif 'STOT_CONFIG?.storageKey?.("layout-save")' not in text:
    raise SystemExit('Could not centralize layout storage key')
patch.write_text(text,encoding='utf-8')
PY_CONFIG

'''
if anchor not in s:
    raise SystemExit('Could not locate config insertion point')
s = s.replace(anchor, step + anchor, 1)

start = s.index(anchor)
end = s.index('# Fix a stale startup call left in the pinned core.', start)
s = s[:start] + '# Page modules now read their runtime version from js/site-config.js.\n# No per-page runtime version rewriting is needed.\n\n' + s[end:]

old_scripts = "    f'\\n<script defer src=\"js/game-data.js?v={version}\"></script>\\n'"
new_scripts = "    f'\\n<script defer src=\"js/site-config.js?v={version}\"></script>\\n'\n    f'<script defer src=\"js/game-data.js?v={version}\"></script>\\n'"
if old_scripts not in s:
    raise SystemExit('Could not add site-config to generated index')
s = s.replace(old_scripts, new_scripts, 1)

s = s.replace('node --check js/game-data.js', 'node --check js/site-config.js\nnode --check js/game-data.js', 1)
s = s.replace("grep -q '^window.STOT_GAME_DATA=' js/game-data.js", "grep -q '^window.STOT_CONFIG=' js/site-config.js\ngrep -q '^window.STOT_GAME_DATA=' js/game-data.js", 1)
s = s.replace('grep -q "js/game-data.js?v=${VERSION}" index.html', 'grep -q "js/site-config.js?v=${VERSION}" index.html\ngrep -q "js/game-data.js?v=${VERSION}" index.html', 1)
s = s.replace('Database, Events, Codes, Drill Compare, Drills, Sale and Oil separated into page modules', 'page modules separated with centralized runtime settings', 1)
BUILD.write_text(s, encoding='utf-8')

test = TEST.read_text(encoding='utf-8').replace('5.68', '5.69')
old = "assert.deepEqual(scriptSrcs, ['/js/game-data.js', '/js/app.js', '/js/pages/sale.js', '/js/pages/oil.js', '/js/pages/drills.js', '/js/pages/compare.js', '/js/pages/database.js', '/js/pages/events.js', '/js/pages/codes.js', '/js/beta-patches.bundle.js']);"
new = "assert.deepEqual(scriptSrcs, ['/js/site-config.js', '/js/game-data.js', '/js/app.js', '/js/pages/sale.js', '/js/pages/oil.js', '/js/pages/drills.js', '/js/pages/compare.js', '/js/pages/database.js', '/js/pages/events.js', '/js/pages/codes.js', '/js/beta-patches.bundle.js']);"
if old not in test:
    raise SystemExit('Could not update config script request order')
test = test.replace(old, new, 1)
marker = "assert.equal(legacyRequests.length, 0, `Legacy public runtime request detected: ${legacyRequests.join(', ')}`);"
insert = """
const configSnapshot = await page.evaluate(() => ({
  version: window.STOT_CONFIG?.version,
  sourceCommit: window.STOT_CONFIG?.sourceCommit,
  storageNamespace: window.STOT_CONFIG?.storageNamespace,
  storageSchema: window.STOT_CONFIG?.storageSchema,
  defaultLanguage: window.STOT_CONFIG?.defaultLanguage,
  saleBadge: window.STOT_CONFIG?.pageBadges?.sale,
  oilBadge: window.STOT_CONFIG?.pageBadges?.oil,
  storageKey: window.STOT_CONFIG?.storageKey?.('layout-save'),
}));
assert.deepEqual(configSnapshot, {
  version: '5.69',
  sourceCommit: 'aec48cd084062e3791d523b72cb65618948508c7',
  storageNamespace: 'stot',
  storageSchema: 1,
  defaultLanguage: 'en',
  saleBadge: 'Sale Calculator',
  oilBadge: 'Oil Layout',
  storageKey: 'stot-v5.69-layout-save-v1',
});
"""
if marker not in test:
    raise SystemExit('Could not insert config smoke test')
test = test.replace(marker, marker + '\n' + insert, 1)
test = test.replace('Database + Events + Codes + Drill Compare + Drills + Sale + Oil separated', 'Central config + separated page modules')
TEST.write_text(test, encoding='utf-8')
