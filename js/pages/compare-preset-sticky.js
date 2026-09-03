/* STOT Compare Presets live production bar v6.10 */
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

    /* v6.06: Target Oil is a compact standalone row, matching Run Time separation. */
    #layoutcompareView #layoutTargetPane .target-box{
      display:grid!important;
      grid-template-columns:minmax(88px,1fr) 64px auto!important;
      align-items:center!important;
      gap:7px!important;
      margin:10px 0 0!important;
      padding:9px 10px!important;
      border:1px solid rgba(109,122,151,.38)!important;
      border-radius:14px!important;
      background:rgba(15,21,33,.62)!important;
      box-shadow:none!important;
    }
    #layoutcompareView #layoutTargetPane .target-box>.field{display:contents!important}
    #layoutcompareView #layoutTargetPane .target-box .field-head{
      grid-column:1!important;
      display:block!important;
      margin:0!important;
      padding:0!important;
      min-width:0!important;
      border:0!important;
      background:none!important;
    }
    #layoutcompareView #layoutTargetPane .target-box .field-head .icon{display:none!important}
    #layoutcompareView #layoutTargetPane .target-box .labels{display:block!important;min-width:0!important}
    #layoutcompareView #layoutTargetPane .target-box .labels strong{
      display:block!important;
      font-size:13px!important;
      line-height:1!important;
      white-space:nowrap!important;
      color:#f3f5fb!important;
    }
    #layoutcompareView #layoutTargetPane .target-box .labels small{display:none!important}
    #layoutcompareView #layoutTargetPane #layoutTarget{
      grid-column:2!important;
      width:64px!important;
      min-width:64px!important;
      min-height:38px!important;
      height:38px!important;
      margin:0!important;
      padding:0 7px!important;
      border-radius:10px!important;
      text-align:center!important;
      font-size:16px!important;
      font-weight:900!important;
    }
    #layoutcompareView #layoutTargetPane #layoutTargetUnits{
      grid-column:3!important;
      display:flex!important;
      align-items:center!important;
      gap:0!important;
      width:auto!important;
      margin:0!important;
      padding:2px!important;
      border:1px solid rgba(109,122,151,.38)!important;
      border-radius:11px!important;
      background:#0b101b!important;
      overflow:hidden!important;
    }
    #layoutcompareView #layoutTargetPane #layoutTargetUnits .chip{
      width:31px!important;
      min-width:31px!important;
      height:34px!important;
      min-height:34px!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      border-radius:8px!important;
      background:transparent!important;
      box-shadow:none!important;
      font-size:12px!important;
      font-weight:900!important;
      line-height:1!important;
      color:#aab3c5!important;
    }
    #layoutcompareView #layoutTargetPane #layoutTargetUnits .chip.active{
      background:linear-gradient(135deg,#6c356f,#5a3d7a)!important;
      color:#fff!important;
      box-shadow:inset 0 0 0 1px rgba(190,133,255,.55)!important;
    }

    /* v6.09: full runtime unit with correct singular/plural. */
    #layoutcompareView #layoutTimePane>.field{position:relative!important}
    #layoutcompareView #layoutTimePane>.field .labels small{display:none!important}
    #layoutcompareView #layoutTimePane #layoutHours{padding-right:58px!important}
    #layoutcompareView #layoutTimePane>.field::after{
      content:attr(data-runtime-unit);
      position:absolute;
      right:18px;
      top:50%;
      transform:translateY(-50%);
      color:#9ea8bc;
      font-size:11px;
      font-weight:850;
      line-height:1;
      pointer-events:none;
    }

    @media(max-width:430px){
      #v601CompareSticky{width:calc(100vw - 24px);gap:6px;padding-left:8px}
      #v601CompareSticky .v601-side{display:grid;gap:2px}
      #v601CompareSticky strong{font-size:14px}
      #v601CompareSticky i{padding:8px 7px}
      #layoutcompareView #layoutTargetPane .target-box{grid-template-columns:minmax(80px,1fr) 58px auto!important;gap:6px!important;padding:8px 9px!important}
      #layoutcompareView #layoutTargetPane #layoutTarget{width:58px!important;min-width:58px!important}
      #layoutcompareView #layoutTargetPane #layoutTargetUnits .chip{width:28px!important;min-width:28px!important;font-size:11px!important}
      #layoutcompareView #layoutTimePane #layoutHours{padding-right:54px!important}
      #layoutcompareView #layoutTimePane>.field::after{right:16px;font-size:10px}
    }
  `;
  document.head.appendChild(style);

  function syncPresetLabels(view) {
    if (!view) return;
    const side = view.querySelector('[data-ab-layout].active')?.dataset.abLayout || 'A';
    const separate = view.querySelector('[data-v524="separate"]')?.classList.contains('active');

    const badge = view.querySelector('.v524-shared-badge');
    if (badge) badge.textContent = separate ? `Preset ${side} settings` : 'Shared A + B';

    const boostsTitle = view.querySelector('.v520-boosts-title');
    const boostHint = boostsTitle?.querySelector('span:not(.v524-shared-badge)');
    if (boostHint) boostHint.textContent = separate ? `Separate settings for Preset ${side}` : 'Same settings applied to both presets';

    const editorHint = view.querySelector('#v526EditorHint');
    if (editorHint) editorHint.textContent = separate ? `Editing Preset ${side} · boosts can differ` : `Editing Preset ${side} · boosts shared A + B`;

    const status = view.querySelector('#v524Status');
    if (status) {
      status.innerHTML = separate
        ? '<strong>Separate settings are On.</strong> Mole, Fruit, Heart Likes and Admin Event Lobby can be different for Preset A and Preset B.'
        : '<strong>Shared settings are active.</strong> Mole, Fruit, Heart Likes and Admin Event Lobby are the same for Preset A and Preset B.';
    }
  }

  function directChildOf(root, node) {
    let current = node;
    while (current && current.parentElement !== root) current = current.parentElement;
    return current?.parentElement === root ? current : null;
  }

  function enforceCompareOrder(view) {
    const advanced = directChildOf(view, view?.querySelector('#v536AdvancedTools'));
    const builder = directChildOf(view, view?.querySelector('#layoutVisualBuilderCompare'));
    const comparison = directChildOf(view, view?.querySelector('.ab-compare'));
    const actions = directChildOf(view, view?.querySelector('.v56-compare-actions'));

    // Required visible order in Compare Presets:
    // Advanced Tools -> Visual Plot Builder -> Preset Comparison.
    if (advanced && builder && builder.previousElementSibling !== advanced) {
      advanced.insertAdjacentElement('afterend', builder);
    }
    if (builder && comparison) {
      const comparisonFollowsBuilder = !!(builder.compareDocumentPosition(comparison) & Node.DOCUMENT_POSITION_FOLLOWING);
      if (!comparisonFollowsBuilder) builder.insertAdjacentElement('afterend', comparison);
    }
    if (comparison && actions && actions.previousElementSibling !== comparison) {
      comparison.insertAdjacentElement('afterend', actions);
    }
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
      // Ordering and builder rendering are deliberately separate. The Visual
      // Builder owns its own rendering; this component only keeps Compare's
      // top-level sections in the requested visible order.
      enforceCompareOrder(view);
      syncPresetLabels(view);
      const a = document.getElementById('abRateA');
      const b = document.getElementById('abRateB');
      const outA = bar.querySelector('[data-v601-a]');
      const outB = bar.querySelector('[data-v601-b]');
      if (outA) outA.textContent = a?.textContent?.trim() || '0/s';
      if (outB) outB.textContent = b?.textContent?.trim() || '0/s';

      const runtimeField = view.querySelector('#layoutTimePane>.field');
      const runtimeInput = document.getElementById('layoutHours');
      if (runtimeField) runtimeField.dataset.runtimeUnit = Number(runtimeInput?.value) === 1 ? 'hour' : 'hours';

      const active = view.classList.contains('active');
      const target = view.querySelector('.ab-compare');
      let targetOnScreen = false;
      if (target) {
        const r = target.getBoundingClientRect();
        targetOnScreen = r.bottom > 64 && r.top < window.innerHeight - 40;
      }
      bar.classList.toggle('show', active && !!target && !targetOnScreen);
    };

    const scheduleSync = () => {
      requestAnimationFrame(sync);
      setTimeout(sync, 0);
      setTimeout(sync, 35);
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
      view.addEventListener('input',scheduleSync,true);
      view.addEventListener('change',scheduleSync,true);
      view.addEventListener('click',scheduleSync,true);
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