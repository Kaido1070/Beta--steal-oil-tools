#!/usr/bin/env bash
set -euo pipefail

VERSION="5.77"
LAST_UPDATED="Sep 2 2026"
SOURCE_COMMIT="aec48cd084062e3791d523b72cb65618948508c7"
BASE_URL="https://raw.githubusercontent.com/Kaido1070/Steal-The-Oil-Tools/${SOURCE_COMMIT}/index.html"

CSS_FILES=(
  css/main.css
  css/v539-01.css
  css/v539-02.css
  css/v539-03.css
  css/beta-first-visit.css
  css/beta-image-atlas-fix.css
  css/beta-preset-visuals.css
)

DATABASE_CSS_FILES=(
  css/beta-database-images.css
  css/beta-database-redesign.css
)

PATCH_FILES=(
  js/v539-01.js
  js/v539-02.js
  js/v539-03.js
  js/v539-04.js
  js/v539-05.js
  js/v539-06.js
  js/v539-07.js
  js/v539-08.js
  js/v539-09.js
  js/v539-10.js
  js/v539-11.js
  js/beta-oil-order.js
  js/beta-first-visit.js
  js/beta-image-atlas-fix.js
  js/beta-preset-visuals.js
)

DATABASE_PATCH_FILES=(
  js/beta-database-images.js
  js/beta-database-redesign.js
)

for file in "${CSS_FILES[@]}" "${DATABASE_CSS_FILES[@]}" "${PATCH_FILES[@]}" "${DATABASE_PATCH_FILES[@]}" js/app.js; do
  test -f "$file" || { echo "Missing required file: $file" >&2; exit 1; }
done

# Step 2: keep mutable game/database values outside the application logic.
python3 <<'PY'
from pathlib import Path

app_path = Path('js/app.js')
data_path = Path('js/game-data.js')
app = app_path.read_text(encoding='utf-8')
marker = 'const slugifyName='
loader = '''/* STOT core runtime: game values live in js/game-data.js */
if(!window.STOT_GAME_DATA) throw new Error("STOT game data failed to load");
const {drills,pets,refineries,solarPanels,totems,decorations,lootboxes}=window.STOT_GAME_DATA;

'''
keys = ['drills','pets','refineries','solarPanels','totems','decorations','lootboxes']

if app.startswith('const drills=['):
    if marker not in app:
        raise SystemExit('Could not locate the end of the game-data block')
    split_at = app.index(marker)
    data_block = app[:split_at].rstrip()
    core = app[split_at:]
    for key in keys:
        if f'const {key}=[' not in data_block:
            raise SystemExit(f'Missing expected data collection: {key}')
    wrapped = (
        '/* STEAL THE OIL TYCOON — game/database data */\n'
        '/* Edit game values here; application logic stays in js/app.js. */\n'
        'window.STOT_GAME_DATA=(()=>{\n'
        + data_block + '\n\n'
        + 'return {drills,pets,refineries,solarPanels,totems,decorations,lootboxes};\n'
        + '})();\n'
    )
    data_path.write_text(wrapped, encoding='utf-8')
    app_path.write_text(loader + core, encoding='utf-8')
else:
    if not data_path.exists():
        raise SystemExit('js/app.js is already separated but js/game-data.js is missing')
    if 'window.STOT_GAME_DATA' not in app[:500]:
        raise SystemExit('js/app.js does not contain the expected game-data loader')
    data = data_path.read_text(encoding='utf-8')
    for key in keys:
        if f'const {key}=[' not in data:
            raise SystemExit(f'js/game-data.js is missing: {key}')
PY

# Step 3A: move Database behavior out of app.js.
# The database page keeps its own filters, cards, pet checker and subsection navigation.
python3 <<'PY'
from pathlib import Path

app_path = Path('js/app.js')
core_path = Path('js/pages/database-core.js')
core_path.parent.mkdir(parents=True, exist_ok=True)
app = app_path.read_text(encoding='utf-8')
start_marker = '/* database */'
end_marker = '\nlet compareA='

if start_marker in app:
    start = app.index(start_marker)
    end = app.index(end_marker, start)
    block = app[start:end].strip()

    # initials() is also used by Drill Compare, so it remains a shared core helper.
    lines = block.splitlines()
    initials_line = next((line for line in lines if line.startswith('function initials(')), None)
    if not initials_line:
        raise SystemExit('Could not locate shared initials() helper in Database block')
    block = '\n'.join(line for line in lines if line != initials_line)

    # Database tab changes should never rerender the unrelated Codes page.
    block = block.replace('\nrenderCodes();\n', '\n')

    page_core = (
        '/* STOT Database page core — extracted from js/app.js */\n'
        + block + '\n\n'
        + '/* Initial Database render; visual enhancements load after this core. */\n'
        + 'renderDb();\n'
        + 'renderRefineries();\n'
        + 'renderSolar();\n'
        + 'renderTotems();\n'
        + 'renderDecorations();\n'
        + 'renderLootboxes();\n'
        + 'renderPets();\n'
        + 'calcPet();\n'
    )
    core_path.write_text(page_core, encoding='utf-8')

    shared = '/* shared visual helper used by Compare and Database */\n' + initials_line + '\n\n'
    app = app[:start] + shared + app[end+1:]

    startup_db = (
        'renderDb();\n'
        'renderRefineries();\n'
        'renderSolar();\n'
        'renderTotems();\n'
        'renderCodes();\n'
        'renderDecorations();\n'
        'renderLootboxes();\n'
        'renderPets();\n'
        'calcPet();\n'
    )
    if startup_db not in app:
        raise SystemExit('Could not locate Database startup sequence in js/app.js')
    app = app.replace(startup_db, 'renderCodes();\n', 1)
    app_path.write_text(app, encoding='utf-8')
else:
    if not core_path.exists():
        raise SystemExit('Database already removed from app.js but js/pages/database-core.js is missing')
    if 'function renderDb()' in app or 'function renderRefineries()' in app:
        raise SystemExit('Database functions still remain in js/app.js')
PY

# Step 4: move Events behavior and styles out of the shared core.
python3 <<'PY_EVENTS'
from pathlib import Path

app_path = Path('js/app.js')
events_path = Path('js/pages/events.js')
events_path.parent.mkdir(parents=True, exist_ok=True)
app = app_path.read_text(encoding='utf-8')
start_marker = 'const mapEvents=['
end_marker = '\nconst GAME_CODES=['

if start_marker in app:
    start = app.index(start_marker)
    end = app.index(end_marker, start)
    block = app[start:end].strip()
    events_path.write_text(
        '/* STOT Events page runtime v5.62 — extracted from js/app.js */\n'
        + block
        + '\n\n/* Initial Events render now belongs to this page module. */\n'
        + 'renderEvents();\n'
        + 'document.documentElement.dataset.stotEventsPage="5.62";\n',
        encoding='utf-8'
    )
    app = app[:start] + app[end+1:]
    startup = 'renderCodes();\nrenderCompare();\nrenderEvents();'
    if startup not in app:
        raise SystemExit('Could not locate Events startup call in js/app.js')
    app = app.replace(startup, 'renderCodes();\nrenderCompare();', 1)
    app_path.write_text(app, encoding='utf-8')
else:
    if not events_path.exists():
        raise SystemExit('Events already removed from app.js but js/pages/events.js is missing')
    if 'function renderEvents()' in app or 'const mapEvents=[' in app:
        raise SystemExit('Events runtime still remains in js/app.js')

css_path = Path('css/main.css')
page_css = Path('css/pages/events.css')
css = css_path.read_text(encoding='utf-8')
css_start = '/* Events */'
css_end = '\n.codes-toolbar'
if css_start in css:
    start = css.index(css_start)
    end = css.index(css_end, start)
    block = css[start:end].strip()
    page_css.parent.mkdir(parents=True, exist_ok=True)
    page_css.write_text('/* STOT Events page CSS v5.62 */\n' + block + '\n', encoding='utf-8')
    css_path.write_text(css[:start] + css[end+1:], encoding='utf-8')
elif not page_css.exists():
    raise SystemExit('Events CSS already removed from css/main.css but css/pages/events.css is missing')
PY_EVENTS

# Step 5: move Codes behavior and styles out of the shared core.
python3 <<'PY_CODES'
from pathlib import Path

app_path = Path('js/app.js')
codes_path = Path('js/pages/codes.js')
codes_path.parent.mkdir(parents=True, exist_ok=True)
app = app_path.read_text(encoding='utf-8')
start_marker = 'const GAME_CODES=['
end_marker = '\nconst viewBadges='

if start_marker in app:
    start = app.index(start_marker)
    end = app.index(end_marker, start)
    block = app[start:end].strip()
    codes_path.write_text(
        '/* STOT Codes page runtime v5.63 — extracted from js/app.js */\n'
        + block
        + '\n\n/* Initial Codes render now belongs to this page module. */\n'
        + 'renderCodes();\n'
        + 'document.documentElement.dataset.stotCodesPage="5.63";\n',
        encoding='utf-8'
    )
    app = app[:start] + app[end+1:]
    startup = 'calcDrill();\nrenderCodes();\nrenderCompare();'
    if startup not in app:
        raise SystemExit('Could not locate Codes startup call in js/app.js')
    app = app.replace(startup, 'calcDrill();\nrenderCompare();', 1)
    app_path.write_text(app, encoding='utf-8')
else:
    if not codes_path.exists():
        raise SystemExit('Codes already removed from app.js but js/pages/codes.js is missing')
    if 'function renderCodes()' in app or 'const GAME_CODES=[' in app:
        raise SystemExit('Codes runtime still remains in js/app.js')

css_path = Path('css/main.css')
page_css = Path('css/pages/codes.css')
css = css_path.read_text(encoding='utf-8')
css_start = '.codes-toolbar'
css_end = '\n\n@media(min-width:700px)'
if css_start in css:
    start = css.index(css_start)
    end = css.index(css_end, start)
    block = css[start:end].strip()
    page_css.parent.mkdir(parents=True, exist_ok=True)
    page_css.write_text('/* STOT Codes page CSS v5.63 */\n' + block + '\n', encoding='utf-8')
    css_path.write_text(css[:start] + css[end:], encoding='utf-8')
elif not page_css.exists():
    raise SystemExit('Codes CSS already removed from css/main.css but css/pages/codes.css is missing')
PY_CODES

# Step 6: move Drill Compare behavior and styles out of the shared core.
python3 <<'PY_COMPARE'
from pathlib import Path
import re

app_path=Path('js/app.js')
compare_path=Path('js/pages/compare.js')
compare_path.parent.mkdir(parents=True,exist_ok=True)
app=app_path.read_text(encoding='utf-8')
start_marker='let compareA='
end_marker='\nconst viewBadges='

if start_marker in app:
    start=app.index(start_marker)
    end=app.index(end_marker,start)
    block=app[start:end].strip()
    compare_path.write_text(
        '/* STOT Drill Compare page runtime v5.65 — extracted from js/app.js */\n'
        + block
        + '\n\n/* Initial Drill Compare render now belongs to this page module. */\n'
        + 'renderCompare();\n'
        + 'document.documentElement.dataset.stotComparePage="5.65";\n',
        encoding='utf-8'
    )
    app=app[:start]+app[end+1:]
    startup='calcDrill();\nrenderCompare();'
    if startup not in app:
        raise SystemExit('Could not locate Compare startup call in js/app.js')
    app=app.replace(startup,'calcDrill();',1)
    app_path.write_text(app,encoding='utf-8')
else:
    if not compare_path.exists():
        raise SystemExit('Compare already removed from app.js but js/pages/compare.js is missing')
    if 'function renderCompare()' in app or 'let compareA=' in app:
        raise SystemExit('Compare runtime still remains in js/app.js')

css_path=Path('css/main.css')
page_css=Path('css/pages/compare.css')
css=css_path.read_text(encoding='utf-8')
css_start='/* Compare */'
css_end='\n\n@media(min-width:700px)'
if css_start in css:
    start=css.index(css_start)
    end=css.index(css_end,start)
    block=css[start:end].strip()
    page_css.parent.mkdir(parents=True,exist_ok=True)
    page_css.write_text(
        '/* STOT Drill Compare page CSS v5.65 */\n'
        + block
        + '\n@media(min-width:700px){.compare-setup-grid{grid-template-columns:repeat(4,1fr)}.compare-card{padding:16px}.compare-logo{width:58px;height:58px}}\n',
        encoding='utf-8'
    )
    css=css[:start]+css[end:]
    old='@media(min-width:700px){.drill-list{grid-template-columns:1fr 1fr}.drill-card.open{grid-column:span 1}.compare-setup-grid{grid-template-columns:repeat(4,1fr)}.compare-card{padding:16px}.compare-logo{width:58px;height:58px}.event-list{grid-template-columns:1fr 1fr}.admin-card{margin-top:8px}}'
    new='@media(min-width:700px){.drill-list{grid-template-columns:1fr 1fr}.drill-card.open{grid-column:span 1}.event-list{grid-template-columns:1fr 1fr}.admin-card{margin-top:8px}}'
    if old in css:
        css=css.replace(old,new,1)
    elif '.compare-setup-grid{grid-template-columns:repeat(4,1fr)}' in css:
        raise SystemExit('Compare media rules still remain in css/main.css')
    css_path.write_text(css,encoding='utf-8')
elif not page_css.exists():
    raise SystemExit('Compare CSS already removed from css/main.css but css/pages/compare.css is missing')
PY_COMPARE

# Step 7: move Drills calculator and picker out of the shared core.
python3 <<'PY_DRILLS'
from pathlib import Path

app_path=Path('js/app.js')
drills_path=Path('js/pages/drills.js')
drills_path.parent.mkdir(parents=True,exist_ok=True)
app=app_path.read_text(encoding='utf-8')
start_marker='/* drills */'
picker_marker='/* picker */'
shared_marker='/* shared visual helper used by Compare and Database */'

if start_marker in app:
    start=app.index(start_marker)
    picker=app.index(picker_marker,start)
    shared=app.index(shared_marker,picker)
    render_picker=app.index('function renderPicker()',picker)
    calc_block=app[start:picker].strip()
    helper_block=app[picker+len(picker_marker):render_picker].strip()
    picker_block=app[render_picker:shared].strip()
    drills_path.write_text(
        '/* STOT Drills page runtime v5.66 — extracted from js/app.js */\n'
        + calc_block + '\n\n/* picker */\n' + picker_block
        + '\n\n/* Initial Drills render now belongs to this page module. */\n'
        + 'calcDrill();\n'
        + 'document.documentElement.dataset.stotDrillsPage="5.66";\n',
        encoding='utf-8'
    )
    shared_helpers='/* shared drill/catalog helpers */\n'+helper_block+'\n\n'
    app=app[:start]+shared_helpers+app[shared:]
    startup='if(typeof calcProduction==="function")calcProduction();\ncalcDrill();'
    if startup not in app:
        raise SystemExit('Could not locate Drills startup call in js/app.js')
    app=app.replace(startup,'if(typeof calcProduction==="function")calcProduction();',1)
    app_path.write_text(app,encoding='utf-8')
else:
    if not drills_path.exists():
        raise SystemExit('Drills already removed from app.js but js/pages/drills.js is missing')
    if 'function calcDrill()' in app or 'const ds=' in app or 'function renderPicker()' in app:
        raise SystemExit('Drills runtime still remains in js/app.js')

css_path=Path('css/main.css')
page_css=Path('css/pages/drills.css')
css=css_path.read_text(encoding='utf-8')
chunks=[]
a='.picker-btn{'; b='.db-category-tabs{'
if a in css:
    start=css.index(a); end=css.index(b,start)
    chunks.append(css[start:end].strip()); css=css[:start]+css[end:]
a='.picker-backdrop{'; b='.footer{'
if a in css:
    start=css.index(a); end=css.index(b,start)
    chunks.append(css[start:end].strip()); css=css[:start]+css[end:]
desktop='@media(min-width:700px){\n  body{padding-top:18px}.picker{border-radius:22px;max-height:75vh;margin:20px}.picker-backdrop{align-items:center}\n}'
if desktop in css:
    css=css.replace(desktop,'@media(min-width:700px){\n  body{padding-top:18px}\n}',1)
    chunks.append('@media(min-width:700px){.picker{border-radius:22px;max-height:75vh;margin:20px}.picker-backdrop{align-items:center}}')
if chunks:
    page_css.parent.mkdir(parents=True,exist_ok=True)
    page_css.write_text('/* STOT Drills page CSS v5.66 */\n'+'\n'.join(chunks)+'\n',encoding='utf-8')
    css_path.write_text(css,encoding='utf-8')
elif not page_css.exists():
    raise SystemExit('Drills CSS already removed from css/main.css but css/pages/drills.css is missing')
PY_DRILLS

# Step 8: move Sale calculator behavior out of the shared core.
# Sale uses the shared field/result/action component styles, so no duplicate page CSS is created here.
python3 <<'PY_SALE'
from pathlib import Path

app_path=Path('js/app.js')
sale_path=Path('js/pages/sale.js')
sale_path.parent.mkdir(parents=True,exist_ok=True)
app=app_path.read_text(encoding='utf-8')
sale_start='let saleUnit=1,friendBoost=50;'
shared_start='async function copyText'
share_start='$("#saleCopy").onclick='
oil_marker='/* oil layout */'

if sale_start in app:
    start=app.index(sale_start)
    end=app.index(shared_start,start)
    calc_block=app[start:end].strip()
    app=app[:start]+app[end:]

    share_pos=app.index(share_start)
    oil_pos=app.index(oil_marker,share_pos)
    share_block=app[share_pos:oil_pos].strip()
    app=app[:share_pos]+app[oil_pos:]

    startup='calcSale();\nif(typeof calcProduction==="function")calcProduction();'
    if startup not in app:
        raise SystemExit('Could not locate Sale startup call in js/app.js')
    app=app.replace(startup,'if(typeof calcProduction==="function")calcProduction();',1)
    app=app.replace('/* sale */\nfunction escapeHTML','/* shared numeric/share helpers used by Sale and Oil */\nfunction escapeHTML',1)

    sale_path.write_text(
        '/* STOT Sale page runtime v5.67 — extracted from js/app.js */\n'
        + calc_block + '\n\n'
        + share_block
        + '\n\n/* Initial Sale render now belongs to this page module. */\n'
        + 'calcSale();\n'
        + 'document.documentElement.dataset.stotSalePage="5.67";\n',
        encoding='utf-8'
    )
    app_path.write_text(app,encoding='utf-8')
else:
    if not sale_path.exists():
        raise SystemExit('Sale already removed from app.js but js/pages/sale.js is missing')
    if 'function calcSale()' in app or 'let saleUnit=' in app or 'function saleSummaryText()' in app:
        raise SystemExit('Sale runtime still remains in js/app.js')
PY_SALE

# Step 9: move Oil / Hour layout calculator out of the shared core.
# Historical Oil presentation patches still live in the consolidated patch bundle for now;
# this step gives the base Oil calculator/runtime a single page owner without changing UX.
python3 <<'PY_OIL'
from pathlib import Path

app_path=Path('js/app.js')
oil_path=Path('js/pages/oil.js')
oil_path.parent.mkdir(parents=True,exist_ok=True)
app=app_path.read_text(encoding='utf-8')
start_marker='/* oil layout */'
end_marker='/* shared drill/catalog helpers */'

if start_marker in app:
    start=app.index(start_marker)
    end=app.index(end_marker,start)
    block=app[start:end].strip()
    oil_path.write_text(
        '/* STOT Oil / Hour page runtime v5.68 — extracted from js/app.js */\n'
        + block + '\n\n'
        + 'document.documentElement.dataset.stotOilPage="5.68";\n',
        encoding='utf-8'
    )
    app=app[:start]+app[end:]
    stale='if(typeof calcProduction==="function")calcProduction();'
    if stale in app:
        app=app.replace(stale,'',1)
    app_path.write_text(app,encoding='utf-8')
else:
    if not oil_path.exists():
        raise SystemExit('Oil already removed from app.js but js/pages/oil.js is missing')
    if 'const LAYOUT_AREAS=' in app or 'function renderLayout()' in app or 'function calcLayout()' in app:
        raise SystemExit('Oil runtime still remains in js/app.js')
PY_OIL

# Step 10: centralize runtime site settings/version/storage namespace.
python3 - "$VERSION" "$SOURCE_COMMIT" "$LAST_UPDATED" <<'PY_CONFIG'
from pathlib import Path
import re, sys

version, source_commit, last_updated = sys.argv[1:4]
config = f'''/* STEAL THE OIL TYCOON — central site settings */
window.STOT_CONFIG=Object.freeze({{
  version:"{version}",
  sourceCommit:"{source_commit}",
  lastUpdated:"{last_updated}",
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
'''
Path('js/site-config.js').write_text(config,encoding='utf-8')

app_path=Path('js/app.js')
app=app_path.read_text(encoding='utf-8')
loader='''/* STOT core runtime: game values live in js/game-data.js */
if(!window.STOT_GAME_DATA) throw new Error("STOT game data failed to load");
const {drills,pets,refineries,solarPanels,totems,decorations,lootboxes}=window.STOT_GAME_DATA;'''
replacement='''/* STOT core runtime: shared settings + game values */
if(!window.STOT_CONFIG) throw new Error("STOT site config failed to load");
const STOT_CONFIG=window.STOT_CONFIG;
if(!window.STOT_GAME_DATA) throw new Error("STOT game data failed to load");
const {drills,pets,refineries,solarPanels,totems,decorations,lootboxes}=window.STOT_GAME_DATA;'''
if loader in app:
    app=app.replace(loader,replacement,1)
elif 'const STOT_CONFIG=window.STOT_CONFIG;' not in app:
    raise SystemExit('Could not centralize app config loader')
if 'STOT_CONFIG.lastUpdated' not in app:
    app=app.replace('const STOT_CONFIG=window.STOT_CONFIG;','const STOT_CONFIG=window.STOT_CONFIG;\ndocument.addEventListener("DOMContentLoaded",()=>{const footer=document.querySelector(".footer");if(footer)footer.textContent=`Community tool • Game values may change with updates • Last updated ${STOT_CONFIG.lastUpdated}`;},{once:true});',1)
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

# Page modules now read their runtime version from js/site-config.js.
# No per-page runtime version rewriting is needed.

# Fix a stale startup call left in the pinned core.
python3 <<'PY'
from pathlib import Path
p = Path('js/app.js')
s = p.read_text(encoding='utf-8')
old = 'calcSale();\ncalcProduction();\ncalcDrill();'
safe_with_drill = 'calcSale();\nif(typeof calcProduction==="function")calcProduction();\ncalcDrill();'
safe_without_drill = 'calcSale();\nif(typeof calcProduction==="function")calcProduction();'
if old in s:
    s = s.replace(old, safe_with_drill, 1)
elif safe_with_drill in s or safe_without_drill in s or 'if(typeof calcProduction==="function")calcProduction();' in s:
    pass
elif 'const viewBadges=' in s:
    pass
else:
    raise SystemExit('Could not locate expected startup sequence in js/app.js')
p.write_text(s, encoding='utf-8')
PY

# Core/global CSS stays in one file.
{
  echo "/* STOT Beta consolidated CSS v${VERSION} */"
  for file in "${CSS_FILES[@]}"; do
    printf '\n/* ===== %s ===== */\n' "$file"
    cat "$file"
    printf '\n'
  done
} > css/app.bundle.css

# Database-only CSS now has a clear owner.
mkdir -p css/pages
{
  echo "/* STOT Database page CSS v${VERSION} */"
  for file in "${DATABASE_CSS_FILES[@]}"; do
    printf '\n/* ===== %s ===== */\n' "$file"
    cat "$file"
    printf '\n'
  done
} > css/pages/database.css

# Shared historical patches no longer contain Database-only patches.
{
  echo "/* STOT Beta consolidated patch runtime v${VERSION} */"
  echo "window.__STOT_CONSOLIDATED_RUNTIME__='${VERSION}';"
  for file in "${PATCH_FILES[@]}"; do
    printf '\n/* ===== %s ===== */\n' "$file"
    printf 'try {\n'
    cat "$file"
    printf '\n} catch (error) { console.error("STOT patch failed: %s", error); }\n' "$file"
  done
  printf '\ndocument.documentElement.dataset.stotBetaReady="%s";\n' "$VERSION"
} > js/beta-patches.bundle.js

# Database core + its two visual enhancements are served as one page-owned runtime.
mkdir -p js/pages
{
  echo "/* STOT Database page runtime v${VERSION} */"
  cat js/pages/database-core.js
  for file in "${DATABASE_PATCH_FILES[@]}"; do
    printf '\n/* ===== %s ===== */\n' "$file"
    printf 'try {\n'
    cat "$file"
    printf '\n} catch (error) { console.error("STOT Database patch failed: %s", error); }\n' "$file"
  done
  printf '\ndocument.documentElement.dataset.stotDatabasePage="%s";\n' "$VERSION"
} > js/pages/database.js

curl -fsSL "$BASE_URL" -o /tmp/stot-base-index.html

python3 - "$VERSION" "$SOURCE_COMMIT" <<'PY'
from pathlib import Path
import re, sys

version, source_commit = sys.argv[1:3]
html = Path('/tmp/stot-base-index.html').read_text(encoding='utf-8')
html = html.replace('Weekend x2 Lobby', 'Admin Event Lobby')
html = re.sub(
    r'<link\s+rel=["\']stylesheet["\']\s+href=["\']css/main\.css(?:\?[^"\']*)?["\']\s*/?>',
    f'<link rel="stylesheet" href="css/app.bundle.css?v={version}">\n<link rel="stylesheet" href="css/pages/oil-visual-builder.css?v={version}">\n<link rel="stylesheet" href="css/pages/drills.css?v={version}">\n<link rel="stylesheet" href="css/pages/compare.css?v={version}">\n<link rel="stylesheet" href="css/pages/database.css?v={version}">\n<link rel="stylesheet" href="css/pages/events.css?v={version}">\n<link rel="stylesheet" href="css/pages/codes.css?v={version}">',
    html,
    count=1,
    flags=re.I,
)
html = re.sub(r'\s*<script\s+src=["\']js/app\.js(?:\?[^"\']*)?["\']\s*></script>', '', html, flags=re.I)
html = re.sub(r'\s*<script\s+src=["\']js/layout-quick-compare\.js(?:\?[^"\']*)?["\']\s*></script>', '', html, flags=re.I)

meta = (
    f'<meta name="stot-local-version" content="{version}">\n'
    f'<meta name="stot-source-commit" content="{source_commit}">\n'
    '<style id="stot-first-paint">html,body{background:#0b0d14}body{visibility:hidden}</style>\n'
    '<noscript><style>body{visibility:visible!important}</style></noscript>\n'
    '<script>document.addEventListener("DOMContentLoaded",()=>requestAnimationFrame(()=>{document.body.style.visibility="visible";document.getElementById("stot-first-paint")?.remove()}),{once:true});</script>\n'
)
html = html.replace('<head>', '<head>\n' + meta, 1)

scripts = (
    f'\n<script defer src="js/site-config.js?v={version}"></script>\n'
    f'<script defer src="js/changelog.js?v={version}"></script>\n'
    f'<script defer src="js/game-data.js?v={version}"></script>\n'
    f'<script defer src="js/app.js?v={version}"></script>\n'
    f'<script defer src="js/pages/sale.js?v={version}"></script>\n'
    f'<script defer src="js/pages/oil.js?v={version}"></script>\n'
    f'<script defer src="js/pages/oil-visual-builder.js?v={version}"></script>\n'
    f'<script defer src="js/pages/drills.js?v={version}"></script>\n'
    f'<script defer src="js/pages/compare.js?v={version}"></script>\n'
    f'<script defer src="js/pages/database.js?v={version}"></script>\n'
    f'<script defer src="js/pages/events.js?v={version}"></script>\n'
    f'<script defer src="js/pages/codes.js?v={version}"></script>\n'
    f'<script defer src="js/beta-patches.bundle.js?v={version}"></script>\n'
)
html = html.replace('</body>', scripts + '</body>', 1)
Path('index.html').write_text(html, encoding='utf-8')
PY

# Static safety checks.
node --check js/site-config.js
node --check js/changelog.js
node --check js/game-data.js
node --check js/app.js
node --check js/pages/sale.js
node --check js/pages/oil.js
node --check js/pages/oil-visual-builder.js
node --check js/pages/database-core.js
node --check js/pages/database.js
node --check js/pages/events.js
node --check js/pages/codes.js
node --check js/pages/compare.js
node --check js/pages/drills.js
node --check js/beta-patches.bundle.js
! grep -q 'raw.githubusercontent.com/Kaido1070/Steal-The-Oil-Tools' index.html
! grep -q 'document.write' index.html
! grep -q '^const drills=' js/app.js
grep -q '^window.STOT_CONFIG=' js/site-config.js
node - "$VERSION" "$LAST_UPDATED" <<'NODE_CHANGELOG'
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
grep -q '^window.STOT_GAME_DATA=' js/game-data.js
! grep -q '^calcProduction();$' js/app.js
! grep -q 'function renderDb()' js/app.js
! grep -q 'function renderEvents()' js/app.js
! grep -q 'const mapEvents=\[' js/app.js
! grep -q 'function renderCodes()' js/app.js
! grep -q 'const GAME_CODES=\[' js/app.js
! grep -q 'function renderCompare()' js/app.js
! grep -q 'let compareA=' js/app.js
! grep -q 'function calcDrill()' js/app.js
! grep -q 'function calcSale()' js/app.js
! grep -q 'const LAYOUT_AREAS=' js/app.js
! grep -q 'function renderLayout()' js/app.js
! grep -q 'function calcLayout()' js/app.js
! grep -q 'let saleUnit=' js/app.js
! grep -q 'function saleSummaryText()' js/app.js
! grep -q 'function renderPicker()' js/app.js
! grep -q 'const ds=' js/app.js
grep -q 'function renderDb()' js/pages/database-core.js
grep -q 'function renderEvents()' js/pages/events.js
grep -q 'const mapEvents=\[' js/pages/events.js
grep -q 'function renderCodes()' js/pages/codes.js
grep -q 'const GAME_CODES=\[' js/pages/codes.js
grep -q 'function renderCompare()' js/pages/compare.js
grep -q 'let compareA=' js/pages/compare.js
grep -q 'function calcDrill()' js/pages/drills.js
grep -q 'function calcSale()' js/pages/sale.js
grep -q 'const LAYOUT_AREAS=' js/pages/oil.js
grep -q 'function renderLayout()' js/pages/oil.js
grep -q 'function calcLayout()' js/pages/oil.js
grep -q 'let saleUnit=' js/pages/sale.js
grep -q 'function saleSummaryText()' js/pages/sale.js
grep -q 'function renderPicker()' js/pages/drills.js
grep -q 'const ds=' js/pages/drills.js
grep -q 'beta-database-images.js' js/pages/database.js
grep -q 'beta-database-redesign.js' js/pages/database.js
! grep -q 'beta-database-images.js' js/beta-patches.bundle.js
! grep -q 'beta-database-redesign.js' js/beta-patches.bundle.js
grep -q "css/app.bundle.css?v=${VERSION}" index.html
grep -q "css/pages/database.css?v=${VERSION}" index.html
grep -q "css/pages/events.css?v=${VERSION}" index.html
grep -q "css/pages/codes.css?v=${VERSION}" index.html
grep -q "css/pages/compare.css?v=${VERSION}" index.html
grep -q "css/pages/drills.css?v=${VERSION}" index.html
grep -q "js/site-config.js?v=${VERSION}" index.html
grep -q "js/changelog.js?v=${VERSION}" index.html
grep -q "js/pages/oil-visual-builder.js?v=${VERSION}" index.html
grep -q "css/pages/oil-visual-builder.css?v=${VERSION}" index.html
grep -q "js/game-data.js?v=${VERSION}" index.html
grep -q "js/app.js?v=${VERSION}" index.html
grep -q "js/pages/sale.js?v=${VERSION}" index.html
grep -q "js/pages/oil.js?v=${VERSION}" index.html
grep -q "js/pages/database.js?v=${VERSION}" index.html
grep -q "js/pages/events.js?v=${VERSION}" index.html
grep -q "js/pages/codes.js?v=${VERSION}" index.html
grep -q "js/pages/compare.js?v=${VERSION}" index.html
grep -q "js/pages/drills.js?v=${VERSION}" index.html
grep -q "js/beta-patches.bundle.js?v=${VERSION}" index.html
grep -q "stot-local-version\" content=\"${VERSION}" index.html

echo "Consolidated Beta v${VERSION}: page modules separated with centralized runtime settings"