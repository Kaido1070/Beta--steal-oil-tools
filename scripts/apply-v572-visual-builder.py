from pathlib import Path

VERSION='5.72'
DATE='Sep 2 2026'

build=Path('scripts/consolidate-beta.sh')
s=build.read_text(encoding='utf-8')
if 'VERSION="5.71"' not in s:
    raise SystemExit('Expected v5.71 build pipeline')
s=s.replace('VERSION="5.71"','VERSION="5.72"',1)

style_anchor='f\'<link rel="stylesheet" href="css/app.bundle.css?v={version}">\\n<link rel="stylesheet" href="css/pages/drills.css?v={version}">'
style_repl='f\'<link rel="stylesheet" href="css/app.bundle.css?v={version}">\\n<link rel="stylesheet" href="css/pages/oil-visual-builder.css?v={version}">\\n<link rel="stylesheet" href="css/pages/drills.css?v={version}">'
if style_anchor not in s:
    raise SystemExit('Could not locate stylesheet injection')
s=s.replace(style_anchor,style_repl,1)

script_anchor='f\'<script defer src="js/pages/oil.js?v={version}"></script>\\n\'\n    f\'<script defer src="js/pages/drills.js?v={version}"></script>\\n\''
script_repl='f\'<script defer src="js/pages/oil.js?v={version}"></script>\\n\'\n    f\'<script defer src="js/pages/oil-visual-builder.js?v={version}"></script>\\n\'\n    f\'<script defer src="js/pages/drills.js?v={version}"></script>\\n\''
if script_anchor not in s:
    raise SystemExit('Could not locate Oil script injection')
s=s.replace(script_anchor,script_repl,1)

if 'node --check js/pages/oil-visual-builder.js' not in s:
    s=s.replace('node --check js/pages/oil.js\n','node --check js/pages/oil.js\nnode --check js/pages/oil-visual-builder.js\n',1)

index_anchor='grep -q "js/changelog.js?v=${VERSION}" index.html\n'
if index_anchor in s and 'oil-visual-builder.js?v=${VERSION}' not in s:
    s=s.replace(index_anchor,index_anchor+'grep -q "js/pages/oil-visual-builder.js?v=${VERSION}" index.html\ngrep -q "css/pages/oil-visual-builder.css?v=${VERSION}" index.html\n',1)

build.write_text(s,encoding='utf-8')

# Changelog: latest release must match central version/date.
ch=Path('js/changelog.js')
c=ch.read_text(encoding='utf-8')
entry='''  Object.freeze({version:"5.72",date:"Sep 2 2026",changes:Object.freeze([\n    "Added a visual 2D 5×5 plot builder for all 15 Oil plots",\n    "Plot colors now match Forest, Desert, Volcano and Mountain areas",\n    "Tapping a plot opens a compact editor and placed drills are drawn with their footprint and name"\n  ])}),\n'''
marker='window.STOT_CHANGELOG=Object.freeze([\n'
if 'version:"5.72"' not in c:
    if marker not in c: raise SystemExit('Could not locate changelog array')
    c=c.replace(marker,marker+entry,1)
ch.write_text(c,encoding='utf-8')

# Smoke test: version, script/style order, 15 maps, no cell numbers, editor + placement reflection.
t=Path('tests/smoke-beta.mjs')
test=t.read_text(encoding='utf-8').replace('5.71','5.72')
old_scripts="assert.deepEqual(scriptSrcs, ['/js/site-config.js', '/js/changelog.js', '/js/game-data.js', '/js/app.js', '/js/pages/sale.js', '/js/pages/oil.js', '/js/pages/drills.js', '/js/pages/compare.js', '/js/pages/database.js', '/js/pages/events.js', '/js/pages/codes.js', '/js/beta-patches.bundle.js']);"
new_scripts="assert.deepEqual(scriptSrcs, ['/js/site-config.js', '/js/changelog.js', '/js/game-data.js', '/js/app.js', '/js/pages/sale.js', '/js/pages/oil.js', '/js/pages/oil-visual-builder.js', '/js/pages/drills.js', '/js/pages/compare.js', '/js/pages/database.js', '/js/pages/events.js', '/js/pages/codes.js', '/js/beta-patches.bundle.js']);"
if old_scripts not in test: raise SystemExit('Could not patch script order test')
test=test.replace(old_scripts,new_scripts,1)
old_styles="assert.deepEqual(styleHrefs, ['/css/app.bundle.css', '/css/pages/drills.css', '/css/pages/compare.css', '/css/pages/database.css', '/css/pages/events.css', '/css/pages/codes.css']);"
new_styles="assert.deepEqual(styleHrefs, ['/css/app.bundle.css', '/css/pages/oil-visual-builder.css', '/css/pages/drills.css', '/css/pages/compare.css', '/css/pages/database.css', '/css/pages/events.css', '/css/pages/codes.css']);"
if old_styles not in test: raise SystemExit('Could not patch style order test')
test=test.replace(old_styles,new_styles,1)

marker="assert.equal(await page.evaluate(() => typeof renderCompare), 'function');\n"
extra='''assert.equal(await page.locator('html').getAttribute('data-stot-visual-builder'), '5.72');\nassert.equal(await page.locator('#layoutVisualBuilder .v572-plot-card').count(), 15);\nassert.equal(await page.locator('#layoutVisualBuilder .v572-grid-cells').first().locator('span').count(), 25);\nassert.equal((await page.locator('#layoutVisualBuilder .v572-grid-cells').first().textContent())?.trim(), '');\nassert.ok(await page.locator('#layoutAreas').evaluate(el => el.classList.contains('v572-legacy-layout')));\nawait page.evaluate(() => window.STOT_VISUAL_PLOT_BUILDER.open('forest-1'));\nawait page.waitForTimeout(40);\nassert.ok(await page.locator('#v572PlotEditor').evaluate(el => el.classList.contains('open')));\nawait page.locator('#v572PlotEditor [data-vadd]').click();\nawait page.waitForTimeout(80);\nassert.ok(await page.locator('[data-visual-plot="forest-1"] .v572-drill-block').count() >= 1, 'Added drill did not appear on visual grid');\nassert.ok(((await page.locator('[data-visual-plot="forest-1"] .v572-drill-block').first().textContent()) || '').trim().length > 0, 'Visual drill block has no name');\nawait page.locator('#v572PlotEditor [data-vclear]').click();\nawait page.locator('#v572PlotEditor [data-vclose]').click();\n\n'''
if marker not in test: raise SystemExit('Could not insert visual builder smoke checks')
test=test.replace(marker,marker+extra,1)
t.write_text(test,encoding='utf-8')
