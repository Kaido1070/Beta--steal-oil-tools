from pathlib import Path

build=Path('scripts/consolidate-beta.sh')
s=build.read_text(encoding='utf-8')
if 'VERSION="5.69"' not in s:
    raise SystemExit('Expected v5.69 build pipeline')
s=s.replace('VERSION="5.69"','VERSION="5.70"',1)
s=s.replace('VERSION="5.70"\n','VERSION="5.70"\nLAST_UPDATED="Sep 2 2026"\n',1)

old_call='python3 - "$VERSION" "$SOURCE_COMMIT" <<\'PY_CONFIG\''
new_call='python3 - "$VERSION" "$SOURCE_COMMIT" "$LAST_UPDATED" <<\'PY_CONFIG\''
if old_call not in s:
    raise SystemExit('Could not locate config generator call')
s=s.replace(old_call,new_call,1)

old_args='version, source_commit = sys.argv[1:3]'
if old_args not in s:
    raise SystemExit('Could not locate config generator args')
s=s.replace(old_args,'version, source_commit, last_updated = sys.argv[1:4]',1)

marker='  sourceCommit:"{source_commit}",\n'
if marker not in s:
    raise SystemExit('Could not locate sourceCommit config field')
s=s.replace(marker,marker+'  lastUpdated:"{last_updated}",\n',1)

guard="""          elif 'const STOT_CONFIG=window.STOT_CONFIG;' not in app:
              raise SystemExit('Could not centralize app config loader')
"""
addition="""          elif 'const STOT_CONFIG=window.STOT_CONFIG;' not in app:
              raise SystemExit('Could not centralize app config loader')
          if 'STOT_CONFIG.lastUpdated' not in app:
              app=app.replace('const STOT_CONFIG=window.STOT_CONFIG;','const STOT_CONFIG=window.STOT_CONFIG;\\ndocument.addEventListener(\"DOMContentLoaded\",()=>{const footer=document.querySelector(\".footer\");if(footer)footer.textContent=`Community tool • Game values may change with updates • Last updated ${STOT_CONFIG.lastUpdated}`;},{once:true});',1)
"""
if guard not in s:
    raise SystemExit('Could not locate central config loader guard')
s=s.replace(guard,addition,1)
build.write_text(s,encoding='utf-8')

t=Path('tests/smoke-beta.mjs')
test=t.read_text(encoding='utf-8').replace('5.69','5.70')
if 'lastUpdated: window.STOT_CONFIG?.lastUpdated' not in test:
    test=test.replace(
        'sourceCommit: window.STOT_CONFIG?.sourceCommit,',
        'sourceCommit: window.STOT_CONFIG?.sourceCommit,\n            lastUpdated: window.STOT_CONFIG?.lastUpdated,',1)
    test=test.replace(
        "sourceCommit: 'aec48cd084062e3791d523b72cb65618948508c7',",
        "sourceCommit: 'aec48cd084062e3791d523b72cb65618948508c7',\n            lastUpdated: 'Sep 2 2026',",1)
footer_assert="assert.equal((await page.locator('.footer').textContent())?.trim(), 'Community tool • Game values may change with updates • Last updated Sep 2 2026');"
if footer_assert not in test:
    smoke_marker="assert.equal(legacyRequests.length, 0, `Legacy public runtime request detected: ${legacyRequests.join(', ')}`);"
    if smoke_marker not in test:
        raise SystemExit('Could not locate footer smoke-test marker')
    test=test.replace(smoke_marker,smoke_marker+'\n'+footer_assert,1)
t.write_text(test,encoding='utf-8')
