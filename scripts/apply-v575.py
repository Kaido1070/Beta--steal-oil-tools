from pathlib import Path

js=Path('js/pages/oil-visual-builder.js')
s=js.read_text(encoding='utf-8')
s=s.replace('/* STOT Oil visual plot builder — v5.73 */','/* STOT Oil visual plot builder — v5.75 */',1)
marker="  window.STOT_VISUAL_PLOT_BUILDER=Object.freeze({render:renderVisualBuilder,open:openVisualPlotEditor,close:closeVisualPlotEditor,pack:packVisual});document.documentElement.dataset.stotVisualBuilder=STOT_CONFIG.version;"
addition='''
  function ensureStickyRate(){
    let bar=document.getElementById('v575StickyRate');
    const rate=document.getElementById('layoutNowRate');
    const details=rate?.closest('.panel.result');
    if(!rate||!details)return null;
    details.id='layoutResultDetails';
    details.classList.add('v575-result-details');
    if(!bar){
      bar=document.createElement('button');
      bar.id='v575StickyRate';
      bar.className='v575-sticky-rate';
      bar.type='button';
      bar.setAttribute('aria-label','Current oil production. Tap to view details.');
      bar.innerHTML='<span><small>Current Production</small><strong data-v575-rate>0/s</strong></span><i>Details ↓</i>';
      document.body.appendChild(bar);
      bar.addEventListener('click',()=>{
        details.scrollIntoView({behavior:'smooth',block:'center'});
        details.classList.remove('v575-result-focus');
        requestAnimationFrame(()=>details.classList.add('v575-result-focus'));
        setTimeout(()=>details.classList.remove('v575-result-focus'),900);
      });
    }
    const sync=()=>{
      const out=bar.querySelector('[data-v575-rate]');
      if(out)out.textContent=rate.textContent?.trim()||'0/s';
      bar.classList.toggle('show',document.getElementById('oilView')?.classList.contains('active')===true);
    };
    sync();
    if(!bar.dataset.bound){
      bar.dataset.bound='1';
      new MutationObserver(sync).observe(rate,{childList:true,characterData:true,subtree:true});
      new MutationObserver(sync).observe(document.getElementById('oilView'),{attributes:true,attributeFilter:['class']});
      document.addEventListener('click',e=>{if(e.target.closest?.('[data-view]'))queueMicrotask(sync)});
    }
    return bar;
  }
'''
if 'function ensureStickyRate()' not in s:
    if marker not in s:
        raise SystemExit('sticky marker missing')
    s=s.replace(marker,addition+'\n'+marker.replace('document.documentElement.dataset.stotVisualBuilder=STOT_CONFIG.version;','document.documentElement.dataset.stotVisualBuilder=STOT_CONFIG.version;ensureStickyRate();'),1)
js.write_text(s,encoding='utf-8')

css=Path('css/pages/oil-visual-builder.css')
c=css.read_text(encoding='utf-8').replace('/* STOT Oil visual plot builder — v5.74 */','/* STOT Oil visual plot builder — v5.75 */',1)
add='''
/* v5.75: compact sticky production result; full details stay in the existing result card. */
.v575-sticky-rate{position:fixed;z-index:1080;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translate(-50%,calc(100% + 26px));width:min(420px,calc(100vw - 24px));min-height:54px;padding:7px 9px 7px 12px;display:flex;align-items:center;justify-content:space-between;gap:14px;border:1px solid rgba(154,102,255,.58);border-radius:14px;background:rgba(12,16,27,.94);box-shadow:0 12px 34px rgba(0,0,0,.42),inset 0 0 0 1px rgba(255,255,255,.035);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:#f5f7ff;opacity:0;pointer-events:none;transition:transform .2s ease,opacity .2s ease,border-color .2s ease;cursor:pointer;text-align:left}.v575-sticky-rate.show{transform:translate(-50%,0);opacity:1;pointer-events:auto}.v575-sticky-rate:hover{border-color:#ae84ff}.v575-sticky-rate>span{display:grid;gap:1px;min-width:0}.v575-sticky-rate small{color:#9ea8ba;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.v575-sticky-rate strong{font-size:21px;line-height:1.05;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v575-sticky-rate i{font-style:normal;flex:0 0 auto;padding:7px 9px;border-radius:9px;background:rgba(142,91,255,.14);color:#cebaff;font-size:10px;font-weight:900}.v575-result-details{scroll-margin:86px}.v575-result-details.v575-result-focus{animation:v575ResultFocus .9s ease}@keyframes v575ResultFocus{0%,100%{box-shadow:inherit}35%{box-shadow:0 0 0 2px rgba(155,101,255,.5),0 0 24px rgba(125,72,238,.18)}}
@media(max-width:520px){.v575-sticky-rate{width:calc(100vw - 18px);bottom:max(8px,env(safe-area-inset-bottom));min-height:50px;border-radius:13px}.v575-sticky-rate strong{font-size:19px}.v575-sticky-rate i{padding:6px 8px}}
'''
if 'v575-sticky-rate' not in c:
    c+='\n'+add
css.write_text(c,encoding='utf-8')

build=Path('scripts/consolidate-beta.sh')
b=build.read_text(encoding='utf-8')
if 'VERSION="5.74"' not in b:
    raise SystemExit('Expected v5.74 build')
build.write_text(b.replace('VERSION="5.74"','VERSION="5.75"',1),encoding='utf-8')

ch=Path('js/changelog.js')
data=ch.read_text(encoding='utf-8')
entry='''  Object.freeze({version:"5.75",date:"Sep 2 2026",changes:Object.freeze([\n    "Added a compact sticky Current Production card to Oil / Hour",\n    "Sticky Oil/s stays visible while building and jumps to the full result details when tapped"\n  ])}),\n'''
ch_marker='window.STOT_CHANGELOG=Object.freeze([\n'
if 'version:"5.75"' not in data:
    data=data.replace(ch_marker,ch_marker+entry,1)
ch.write_text(data,encoding='utf-8')

test=Path('tests/smoke-beta.mjs')
t=test.read_text(encoding='utf-8')
t=t.replace("'5.74'","'5.75'").replace('stot-v5.74-layout-save-v1','stot-v5.75-layout-save-v1')
anchor="assert.ok(await page.locator('#layoutAreas').evaluate(el => el.classList.contains('v572-legacy-layout')));\n"
checks='''assert.equal(await page.locator('#v575StickyRate').count(), 1);\nawait page.locator('.tabs button[data-view="oil"]').click();\nawait page.waitForTimeout(80);\nassert.ok(await page.locator('#v575StickyRate').evaluate(el => el.classList.contains('show')));\nassert.equal((await page.locator('#v575StickyRate [data-v575-rate]').textContent())?.trim(), (await page.locator('#layoutNowRate').textContent())?.trim());\nassert.equal(await page.locator('#layoutResultDetails').count(), 1);\nawait page.locator('#v575StickyRate').click();\nawait page.waitForTimeout(80);\nassert.ok(await page.locator('#layoutResultDetails').evaluate(el => el.classList.contains('v575-result-focus')));\n'''
if checks not in t:
    t=t.replace(anchor,anchor+checks,1)
test.write_text(t,encoding='utf-8')
