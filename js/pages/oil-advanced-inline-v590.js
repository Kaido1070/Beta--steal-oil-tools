/* STOT compact Advanced Tools bar — v5.94 */
(()=>{
  if(window.__STOT_ADVANCED_INLINE_V594__)return;
  window.__STOT_ADVANCED_INLINE_V594__=true;

  function apply(){
    const tools=document.getElementById('v536AdvancedTools');
    if(!tools)return false;

    tools.open=true;
    tools.classList.add('v590-advanced-inline');

    const summary=tools.querySelector(':scope > summary');
    if(summary && summary.textContent.trim()!=='Advanced Tools')summary.textContent='Advanced Tools';

    const empty=document.getElementById('layoutPasteEmpty');
    const all=document.getElementById('layoutPasteAll');
    const clear=document.getElementById('layoutClearAll');
    if(empty && empty.textContent!=='Paste Empty')empty.textContent='Paste Empty';
    if(all && all.textContent!=='Paste All')all.textContent='Paste All';
    if(clear && clear.textContent!=='Clear All')clear.textContent='Clear All';
    return !!(empty&&all&&clear);
  }

  function mountRebirthBoost(){
    const boosts=document.querySelector('#oilView .v520-boosts');
    const input=document.getElementById('layoutRebirth');
    if(!boosts||!input)return false;

    let item=document.getElementById('v520Rebirth');
    if(!item){
      item=document.createElement('div');
      item.id='v520Rebirth';
      item.className='v520-boost-item';
      item.innerHTML='<span class="v520-label">Rebirth Level <small id="v520RebirthBonus">+0% Production</small></span>';
      boosts.appendChild(item);
    }
    if(input.parentElement!==item)item.appendChild(input);

    const source=document.getElementById('layoutRebirthField');
    if(source&&source!==item)source.remove();

    const sync=()=>{
      const level=window.STOT_LAYOUT_PRODUCTION?.rebirthLevel
        ? window.STOT_LAYOUT_PRODUCTION.rebirthLevel(input.value)
        : Math.max(0,Math.min(50,Math.trunc(Number(input.value)||0)));
      const bonus=window.STOT_LAYOUT_PRODUCTION?.rebirthBonusPercent
        ? window.STOT_LAYOUT_PRODUCTION.rebirthBonusPercent(level)
        : level*10;
      const label=document.getElementById('v520RebirthBonus');
      if(label)label.textContent=`+${bonus}% Production`;
    };
    sync();
    if(input.dataset.v594RebirthUi!=='1'){
      input.dataset.v594RebirthUi='1';
      input.addEventListener('input',sync);
      input.addEventListener('change',sync);
    }
    return true;
  }

  function start(){
    let tries=0;
    const retry=()=>{
      const ready=apply();
      mountRebirthBoost();
      if((ready&&document.getElementById('v520Rebirth')) || tries>=12)return;
      tries++;
      setTimeout(retry,120);
    };
    retry();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();

  document.querySelectorAll('.tabs button[data-view="oil"],.tabs button[data-view="layoutcompare"]').forEach(btn=>{
    btn.addEventListener('click',()=>setTimeout(()=>{apply();mountRebirthBoost();},0));
  });

  /* Oil Preset share preview: one-screen mobile layout, no observers. */
  const originalOpen=window.openSharePreview;
  if(typeof originalOpen==='function' && !window.__STOT_OIL_SHARE_COMPACT_V592__){
    window.__STOT_OIL_SHARE_COMPACT_V592__=true;
    window.openSharePreview=function(title,html,text){
      const result=originalOpen.call(this,title,html,text);
      const preview=document.getElementById('sharePreview');
      if(preview){
        const isOil=/\bOil\s+(Layout|Preset)\b/i.test(String(title||'')) || (String(html||'').includes('share-setup-grid') && String(html||'').includes('Production'));
        preview.classList.toggle('v592-oil-share-compact',isOil);
      }
      return result;
    };
  }

  /* v5.94 Oil page flow polish. Runs only on load/view entry; no observers. */
  if(!document.getElementById('v594OilFlowStyle')){
    const style=document.createElement('style');
    style.id='v594OilFlowStyle';
    style.textContent=`
      #oilView .v539-hidden-shell,
      #oilView .v533-obsolete-empty,
      #oilView .v539-empty-controls,
      #oilView .v593-empty-oil-shell,
      #layoutcompareView .v539-hidden-shell,
      #layoutcompareView .v533-obsolete-empty,
      #layoutcompareView .v539-empty-controls{display:none!important}

      #oilView .v593-question-title{margin:0 0 2px!important;font-size:17px!important;line-height:1.08!important;letter-spacing:-.1px!important}
      #oilView .v593-question-copy{margin:0 0 7px!important;color:#a3adbf!important;font-size:10px!important;line-height:1.25!important}
      #oilView .v593-calc-card{padding:10px!important;border-radius:17px!important}
      #oilView #layoutModeTabs.v593-mode-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;margin:5px 0 8px!important}
      #oilView #layoutModeTabs .v593-mode-choice{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-height:56px!important;height:56px!important;padding:7px 9px!important;border-radius:12px!important;text-align:center!important;line-height:1.05!important;white-space:normal!important}
      #oilView #layoutModeTabs .v593-mode-choice strong{display:block!important;font-size:14px!important;line-height:1.05!important;font-weight:950!important;white-space:nowrap!important}
      #oilView #layoutModeTabs .v593-mode-choice small{display:block!important;margin-top:4px!important;font-size:8.5px!important;line-height:1.1!important;font-weight:650!important;opacity:.72!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important}
      #oilView #layoutModeTabs .v593-mode-choice.active small{opacity:.9!important}
      #oilView .v593-runtime-field{grid-template-columns:minmax(0,1fr) 112px!important;align-items:center!important;gap:10px!important;min-height:64px!important;padding:8px 10px!important;border-radius:14px!important}
      #oilView .v593-runtime-field .field-head{margin:0!important}
      #oilView .v593-runtime-field input{height:44px!important;min-height:44px!important;font-size:18px!important;border-radius:12px!important}
      #oilView .v520-boosts{margin-bottom:9px!important}
      #oilView #v536QuickFill.v593-quick-flow{margin-top:0!important;padding:12px!important;border-radius:17px!important}
      #oilView #v536QuickFill.v593-quick-flow .v536-qf-head{margin-bottom:9px!important}
      #oilView #v536QuickFill.v593-quick-flow .v537-template-head{margin-bottom:6px!important}
      #oilView #v536QuickFill.v593-quick-flow #v537AddTemplateRow{min-height:39px!important;margin-top:6px!important;border-radius:10px!important}
      #oilView #v536QuickFill.v593-quick-flow .v537-template-fit{margin:6px 0!important;padding:6px 0!important}

      @media(max-width:620px){
        #oilView .v593-question-title{font-size:15px!important}
        #oilView .v593-question-copy{font-size:9px!important;margin-bottom:6px!important}
        #oilView .v593-calc-card{padding:9px!important}
        #oilView #layoutModeTabs.v593-mode-grid{gap:6px!important;margin:4px 0 7px!important}
        #oilView #layoutModeTabs .v593-mode-choice{min-height:52px!important;height:52px!important;padding:6px 7px!important;border-radius:11px!important}
        #oilView #layoutModeTabs .v593-mode-choice strong{font-size:13px!important}
        #oilView #layoutModeTabs .v593-mode-choice small{font-size:7.5px!important;margin-top:3px!important}
        #oilView .v593-runtime-field{grid-template-columns:minmax(0,1fr) 102px!important;min-height:58px!important;padding:7px 9px!important}
        #oilView .v593-runtime-field input{height:42px!important;min-height:42px!important;font-size:17px!important}
        #oilView #v536QuickFill.v593-quick-flow{padding:10px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function markOilFlow(){
    const oil=document.getElementById('oilView');
    if(!oil || !oil.classList.contains('active'))return false;

    mountRebirthBoost();

    const modeTabs=document.getElementById('layoutModeTabs');
    if(modeTabs){
      modeTabs.classList.add('v593-mode-grid');
      const timeBtn=modeTabs.querySelector('[data-layoutmode="time"]');
      const targetBtn=modeTabs.querySelector('[data-layoutmode="target"]');
      if(timeBtn){
        timeBtn.classList.add('v593-mode-choice');
        timeBtn.innerHTML='<strong>Time → Oil</strong><small>How much oil you’ll make</small>';
        timeBtn.setAttribute('aria-label','Time to Oil: calculate how much oil you will make');
      }
      if(targetBtn){
        targetBtn.classList.add('v593-mode-choice');
        targetBtn.innerHTML='<strong>Oil → Time</strong><small>When you’ll reach your target</small>';
        targetBtn.setAttribute('aria-label','Oil to Time: calculate when you will reach your target');
      }
      modeTabs.closest('.layout-control-card')?.classList.add('v593-calc-card');
    }

    document.getElementById('layoutHours')?.closest('.field')?.classList.add('v593-runtime-field');
    document.getElementById('v536QuickFill')?.classList.add('v593-quick-flow');

    const intro=oil.querySelector('.v543-calc-intro');
    if(intro){
      const title=intro.querySelector('strong');
      const copy=intro.querySelector('span');
      if(title){title.textContent='Choose a calculation';title.classList.add('v593-question-title');}
      if(copy){copy.textContent='You can switch anytime.';copy.classList.add('v593-question-copy');}
    }

    const isVisible=node=>{
      if(!node)return false;
      const cs=getComputedStyle(node);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
      const r=node.getBoundingClientRect();
      return r.width>0&&r.height>0;
    };
    const hasVisibleMeaningful=el=>{
      if([...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return true;
      return [...el.querySelectorAll('*')].some(node=>{
        if(!isVisible(node))return false;
        if(node.matches('input,select,textarea,button,img,svg,canvas'))return true;
        return [...node.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
      });
    };

    const protectedEls=[
      modeTabs?.closest('.layout-control-card'),
      document.querySelector('#oilView .v520-boosts'),
      document.getElementById('v536QuickFill'),
      document.getElementById('v536AdvancedTools'),
      document.getElementById('layoutVisualBuilder'),
      document.querySelector('#oilView .v519-combined-summary')
    ].filter(Boolean);

    const candidates=[
      ...oil.querySelectorAll(':scope > .panel, :scope > .layout-controls, :scope > .layout-control-card'),
      ...oil.querySelectorAll(':scope > .layout-controls > .layout-control-card')
    ];
    candidates.forEach(el=>{
      el.classList.remove('v593-empty-oil-shell');
      if(protectedEls.some(p=>p===el||el.contains(p)||p.contains(el)))return;
      if(!hasVisibleMeaningful(el))el.classList.add('v593-empty-oil-shell');
    });
    return true;
  }

  function scheduleOilFlow(){
    setTimeout(markOilFlow,0);
    setTimeout(markOilFlow,120);
    setTimeout(markOilFlow,320);
  }

  document.querySelector('.tabs button[data-view="oil"]')?.addEventListener('click',scheduleOilFlow);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleOilFlow,{once:true});
  else scheduleOilFlow();
})();