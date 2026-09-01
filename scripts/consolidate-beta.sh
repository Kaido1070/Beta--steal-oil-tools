#!/usr/bin/env bash
set -euo pipefail

VERSION="5.58"
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
  js/beta-database-images.js
  js/beta-database-redesign.js
)

for file in "${CSS_FILES[@]}" "${PATCH_FILES[@]}" js/app.js; do
  test -f "$file" || { echo "Missing required file: $file" >&2; exit 1; }
done

# Fix a stale startup call left in the pinned core. calcProduction no longer exists;
# leaving the call unguarded aborts the remaining initial renders.
python3 <<'PY'
from pathlib import Path
p = Path('js/app.js')
s = p.read_text(encoding='utf-8')
old = 'calcSale();\ncalcProduction();\ncalcDrill();'
new = 'calcSale();\nif(typeof calcProduction==="function")calcProduction();\ncalcDrill();'
if old in s:
    s = s.replace(old, new, 1)
elif new not in s:
    raise SystemExit('Could not locate expected startup sequence in js/app.js')
p.write_text(s, encoding='utf-8')
PY

# Keep the exact CSS cascade that v5.57 used, but serve it as one local file.
{
  echo "/* STOT Beta consolidated CSS v${VERSION} */"
  for file in "${CSS_FILES[@]}"; do
    printf '\n/* ===== %s ===== */\n' "$file"
    cat "$file"
    printf '\n'
  done
} > css/app.bundle.css

# Keep each historical patch isolated so one optional UI patch cannot prevent later patches.
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

curl -fsSL "$BASE_URL" -o /tmp/stot-base-index.html

python3 - "$VERSION" "$SOURCE_COMMIT" <<'PY'
from pathlib import Path
import re, sys

version, source_commit = sys.argv[1:3]
html = Path('/tmp/stot-base-index.html').read_text(encoding='utf-8')

# Stable terminology already used by the Beta UI.
html = html.replace('Weekend x2 Lobby', 'Admin Event Lobby')

# One CSS request: base styles + the current Beta cascade in exact order.
html = re.sub(
    r'<link\s+rel=["\']stylesheet["\']\s+href=["\']css/main\.css(?:\?[^"\']*)?["\']\s*/?>',
    f'<link rel="stylesheet" href="css/app.bundle.css?v={version}">',
    html,
    count=1,
    flags=re.I,
)

# Remove the old script entry points. The original public quick-compare path was
# repurposed as a Beta patch loader, so it must not run in the consolidated page.
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
    f'\n<script defer src="js/app.js?v={version}"></script>\n'
    f'<script defer src="js/beta-patches.bundle.js?v={version}"></script>\n'
)
html = html.replace('</body>', scripts + '</body>', 1)

Path('index.html').write_text(html, encoding='utf-8')
PY

# Static safety checks for the generated runtime.
node --check js/app.js
node --check js/beta-patches.bundle.js
! grep -q 'raw.githubusercontent.com/Kaido1070/Steal-The-Oil-Tools' index.html
! grep -q 'document.write' index.html
! grep -q '^calcProduction();$' js/app.js
grep -q 'css/app.bundle.css?v=5.58' index.html
grep -q 'js/beta-patches.bundle.js?v=5.58' index.html
grep -q 'stot-local-version" content="5.58' index.html

echo "Consolidated Beta v${VERSION}: generated index.html, css/app.bundle.css, js/app.js, js/beta-patches.bundle.js"
