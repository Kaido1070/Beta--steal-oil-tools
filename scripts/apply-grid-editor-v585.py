from pathlib import Path

index=Path('index.html')
text=index.read_text()
css_old='<link rel="stylesheet" href="css/pages/oil-visual-builder.css?v=5.83">'
css_new=css_old+'\n<link rel="stylesheet" href="css/pages/oil-grid-editor-v585.css?v=5.85">'
if 'oil-grid-editor-v585.css' not in text:
    if css_old not in text:
        raise SystemExit('oil visual builder CSS anchor not found')
    text=text.replace(css_old,css_new,1)
script_old='<script defer src="js/beta-patches.bundle.js?v=5.83"></script>'
script_new=script_old+'\n<script defer src="js/pages/oil-grid-editor-v585.js?v=5.85"></script>'
if 'oil-grid-editor-v585.js' not in text:
    if script_old not in text:
        raise SystemExit('beta patch bundle script anchor not found')
    text=text.replace(script_old,script_new,1)
index.write_text(text)
