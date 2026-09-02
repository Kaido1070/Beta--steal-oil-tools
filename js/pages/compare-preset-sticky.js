/* STOT Compare Presets live production bar v6.03 */
(() => {
  if (window.__STOT_COMPARE_PRESET_STICKY__) return;
  window.__STOT_COMPARE_PRESET_STICKY__ = true;

  const style = document.createElement('style');
  style.textContent = `
    #v601CompareSticky{
      position:fixed;z-index:2147482999;left:50%;bottom:max(6px,env(safe-area-inset-bottom));
      transform:translate(-50%,calc(100% + 22px));
      width:min(470px,calc(100vw - 28px));min-height:48px;
      display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;align-items:center;gap:8px;
      padding:6px 8px 6px 10px;border:1px solid rgba(157,92,255,.72);border-radius:13px;
      background:rgba(8,13,23,.96);box-shadow:0 12px 34px rgba(0,0,0,.34);
      color:#f4f2ff;opacity:0;pointer-events:none;transition:transform .2s ease,opacity .2s ease;
      -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);text-align:left;touch-action:manipulation;
    }
    #v601CompareSticky.show{transform:translate(-50%,0);opacity:1;pointer-events:auto}
    #v601CompareSticky>*{pointer-events:none;user-select:none;-webkit-user-select:none}
    #v601CompareSticky .v601-side{display:flex;min-width:0;align-items:baseline;gap:6px;padding-right:7px;border-right:1px solid rgba(130,141,164,.18)}
    #v601CompareSticky .v601-side:nth-child(2){border-right:0}
    #v601CompareSticky small{font-size:8px;line-height:1;color:#9aa6bb;font-weight:850;letter-spacing:.06em;white-space:nowrap}
    #v601CompareSticky strong{font-size:16px;line-height:1.05;color:#f7f8ff;font-weight:1000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #v601CompareSticky i{font-style:normal;border-radius:9px;background:#211b3e;color:#cfbdff;padding:8px 9px;font-size:8px;font-weight:950;white-space:nowrap}
    @media(max-width:430px){
      #v601CompareSticky{width:calc(100vw - 24px);gap:6px;padding-left:8px}
      #v601CompareSticky .v601-side{display:grid;gap:2px}
      #v601CompareSticky strong{font-size:14px}
      #v601CompareSticky i{padding:8px 7px}
    }
  `;
  document.head.appendChild(style);

  function enforceCompareOrder(view) {
    const builder = document.getElementById('layoutVisualBuilder');
    const comparison = view?.querySelector('.ab-compare');
    const actions = view?.querySelector('.v56-compare-actions');
    if (!view || !builder || !comparison) return;

    if (builder.parentElement !== view) view.appendChild(builder);
    if (comparison.previousElementSibling !== builder) builder.insertAdjacentElement('afterend', comparison);
    if (actions && actions.previousElementSibling !== comparison) comparison.insertAdjacentElement('afterend', actions);
  }

  function setup() {
    const view = document.getElementById('layoutcompareView');
    if (!view) return false;

    let bar = document.getElementById('v601CompareSticky');
    if (!bar) {
      bar = document.createElement('button');
      bar.id = 'v601CompareSticky';
      bar.type = 'button';
      bar.setAttribute('aria-label', 'Preset A and Preset B production. Tap to view comparison details.');
      bar.innerHTML = '<span class="v601-side"><small>PRESET A</small><strong data-v601-a>0/s</strong></span><span class="v601-side"><small>PRESET B</small><strong data-v601-b>0/s</strong></span><i>Details ↓</i>';
      document.body.appendChild(bar);
      bar.addEventListener('click', () => {
        enforceCompareOrder(view);
        const target = view.querySelector('.ab-compare');
        if (!target) return;
        bar.classList.remove('show');
        target.scrollIntoView({behavior:'smooth',block:'center'});
      });
    }

    const sync = () => {
      enforceCompareOrder(view);
      const a = document.getElementById('abRateA');
      const b = document.getElementById('abRateB');
      const outA = bar.querySelector('[data-v601-a]');
      const outB = bar.querySelector('[data-v601-b]');
      if (outA) outA.textContent = a?.textContent?.trim() || '0/s';
      if (outB) outB.textContent = b?.textContent?.trim() || '0/s';

      const active = view.classList.contains('active');
      const target = view.querySelector('.ab-compare');
      let targetOnScreen = false;
      if (target) {
        const r = target.getBoundingClientRect();
        targetOnScreen = r.bottom > 64 && r.top < window.innerHeight - 40;
      }
      bar.classList.toggle('show', active && !!target && !targetOnScreen);
    };

    const watchText = el => {
      if (!el || el.dataset.v601Watched) return;
      el.dataset.v601Watched = '1';
      new MutationObserver(sync).observe(el,{subtree:true,childList:true,characterData:true});
    };
    watchText(document.getElementById('abRateA'));
    watchText(document.getElementById('abRateB'));

    if (!view.dataset.v601Bound) {
      view.dataset.v601Bound = '1';
      new MutationObserver(sync).observe(view,{attributes:true,attributeFilter:['class']});
      view.addEventListener('input',()=>requestAnimationFrame(sync),true);
      view.addEventListener('change',()=>requestAnimationFrame(sync),true);
      view.addEventListener('click',()=>requestAnimationFrame(sync),true);
      window.addEventListener('scroll',sync,{passive:true});
      window.addEventListener('resize',sync,{passive:true});
      document.querySelectorAll('.tabs button').forEach(btn=>btn.addEventListener('click',()=>{
        setTimeout(sync,0);
        setTimeout(sync,100);
        setTimeout(sync,260);
      }));
    }

    sync();
    setTimeout(sync,80);
    setTimeout(sync,220);
    setTimeout(sync,520);
    return true;
  }

  const run = () => {
    if (setup()) return;
    [80,220,520].forEach(ms => setTimeout(setup,ms));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
