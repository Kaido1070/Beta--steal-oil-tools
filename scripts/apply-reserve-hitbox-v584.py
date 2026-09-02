from pathlib import Path
import re

RULE = """

/* v5.84: reserve toggle hitbox stops at checkbox + label text. */
#v536QuickFill .v537-reserve > .v537-checkline{
  display:inline-flex!important;
  width:fit-content!important;
  max-width:100%!important;
  justify-self:start!important;
  align-self:flex-start!important;
  align-items:center!important;
}
"""

for filename in ('css/app.bundle.css', 'css/v539-03.css'):
    p = Path(filename)
    s = p.read_text(encoding='utf-8')
    marker = '/* v5.84: reserve toggle hitbox stops at checkbox + label text. */'
    if marker not in s:
        s += RULE
    p.write_text(s, encoding='utf-8')

p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = re.sub(r'(css/app\.bundle\.css\?v=)[0-9.]+', r'\g<1>5.84', s)
p.write_text(s, encoding='utf-8')
