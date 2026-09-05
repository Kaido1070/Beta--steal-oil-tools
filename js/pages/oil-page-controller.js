/* Stage 4 — authoritative Oil / Hour page controller.
   Owns Oil-only shell/order/presentation and Advanced Tools behavior.
   Calculation modules remain intact; Compare Presets state/DOM is never shared. */
(()=>{
  if(window.__STOT_STAGE4_OIL_PAGE_CONTROLLER__)return;
  window.__STOT_STAGE4_OIL_PAGE_CONTROLLER__=true;

  const byId=id=>document.getElementById(id);
  const oil=()=>byId('oilView');
  const insideOil=node=>!!node&&!!oil()?.contains(node);

  function cloneRows(rows){
    if(typeof clonePlotRows==='function')return clonePlotRows(rows||[]);
    return (Array.isArray(rows)?rows:[]).map(r=>({drill:r.drill,tier:Number(r.tier)||0,count:Math.max(1,Math.min(25,Math.floor(Number(r.count)||1))),hacker:Math.max(0,Number(r.hacker)||550)}));
  }

  function ensureBuildShells(){
    const view=oil();if(!view)return{};
    let quick=byId('v536QuickFill');
    if(!quick){quick=document.createElement('div');quick.id='v536QuickFill';quick.className='panel v536-quick-fill';view.appendChild(quick)}
    let advanced=byId('v536AdvancedTools');
    if(!advanced){
      advanced=document.createElement('details');advanced.id='v536AdvancedTools';advanced.className='v536-advanced';
      advanced.innerHTML='<summary>Advanced Tools</summary><div id="v536AdvancedHost"></div>';
      view.appendChild(advanced);
    }
    let host=advanced.querySelector('#v536AdvancedHost');
    if(!host){host=document.createElement('div');host.id='v536AdvancedHost';advanced.appendChild(host)}

    let bar=byId('layoutCopyBar');
    if(!bar){
      bar=document.createElement('div');bar.id='layoutCopyBar';bar.className='panel layout-copy-bar';
      bar.innerHTML='<div><strong>Plot Copy</strong><small id="layoutCopyStatus">Copy a plot to reuse its drill setup.</small></div>';
    }
    if(!bar.querySelector('#layoutCopyStatus')){
      const copy=document.createElement('div');copy.innerHTML='<strong>Plot Copy</strong><small id="layoutCopyStatus">Copy a plot to reuse its drill setup.</small>';bar.prepend(copy);
    }
    const buttonDefs=[['layoutPasteEmpty','Paste Empty',true],['layoutPasteAll','Paste All',true],['layoutClearAll','Clear All',false]];
    for(const [id,label,disabled] of buttonDefs){
      if(byId(id))continue;
      const btn=document.createElement('button');btn.id=id;btn.type='button';btn.textContent=label;btn.disabled=disabled;bar.appendChild(btn);
    }
    if(bar.parentElement!==host)host.appendChild(bar);
    return{quick,advanced};
  }

  function ensureVisualBuilder(){
    const view=oil();if(!view)return null;
    let builder=byId('layoutVisualBuilder');
    if(!builder&&window.STOT_VISUAL_PLOT_BUILDER?.mount){try{builder=window.STOT_VISUAL_PLOT_BUILDER.mount()}catch(_){}}
    if(builder&&builder.parentElement!==view)view.appendChild(builder);
    return builder;
  }

  function nodes(){
    const view=oil();if(!view)return null;
    const shells=ensureBuildShells(),tabs=byId('layoutModeTabs');
    const calculator=insideOil(tabs)?tabs.closest('.layout-control-card'):null;
    const boosts=view.querySelector('.v520-boosts'),builder=ensureVisualBuilder(),areas=byId('layoutAreas');
    return {
      view,intro:view.querySelector(':scope > .panel.step'),calculator,boosts,
      quick:insideOil(shells.quick)?shells.quick:null,
      advanced:insideOil(shells.advanced)?shells.advanced:null,
      builder:insideOil(builder)?builder:null,
      areas:insideOil(areas)?areas:null,
      note:view.querySelector('.layout-note'),
      summary:view.querySelector('.v519-combined-summary')||view.querySelector('.v56-summary')||view.querySelector('.panel.result')
    };
  }

  function hideKnownLegacyShells(view){
    if(!view)return;
    ['v527Workflow','v528Condition','v529Condition','v528LayoutSettings','v529LayoutSetup'].forEach(id=>{const el=byId(id);if(el&&view.contains(el))el.classList.add('v539-hidden-shell')});
    view.querySelectorAll('.v519-old-result,.v528-remove-empty,.v533-obsolete-empty').forEach(el=>el.classList.add('v539-hidden-shell'));
  }

  function syncCalculatorPresentation(parts=nodes()){
    const view=parts?.view,tabs=byId('layoutModeTabs'),calc=parts?.calculator;if(!view||!tabs||!calc||!view.contains(tabs))return false;
    calc.classList.add('v543-friendly-calc','v593-calc-card');
    let intro=calc.querySelector('.v543-calc-intro');
    if(!intro){intro=document.createElement('div');intro.className='v543-calc-intro';intro.innerHTML='<strong>Choose a calculation</strong><span>You can switch anytime.</span>';calc.insertBefore(intro,calc.firstChild)}
    const title=intro.querySelector('strong'),copy=intro.querySelector('span');
    if(title){title.textContent='Choose a calculation';title.classList.add('v593-question-title')}
    if(copy){copy.textContent='You can switch anytime.';copy.classList.add('v593-question-copy')}
    tabs.classList.add('v593-mode-grid');
    const time=tabs.querySelector('[data-layoutmode="time"]'),target=tabs.querySelector('[data-layoutmode="target"]');
    if(time){time.classList.add('v593-mode-choice');time.innerHTML='<strong>Time → Oil</strong><small>How much oil you’ll make</small>';time.setAttribute('aria-label','Time to Oil: calculate how much oil you will make')}
    if(target){target.classList.add('v593-mode-choice');target.innerHTML='<strong>Oil → Time</strong><small>When you’ll reach your target</small>';target.setAttribute('aria-label','Oil to Time: calculate when you will reach your target')}
    byId('layoutHours')?.closest('.field')?.classList.add('v593-runtime-field');return true;
  }

  function syncBoostPresentation(parts=nodes()){
    const boosts=parts?.boosts;if(!boosts)return false;
    boosts.classList.add('v543-friendly-boosts','v539-oil-boosts');boosts.classList.remove('v539-compare-boosts');
    const title=boosts.querySelector('.v520-boosts-title');if(!title)return true;
    const strong=title.querySelector('strong');if(strong)strong.textContent='Preset Boosts';
    let hint=title.querySelector('.v543-optional-hint');if(!hint){hint=document.createElement('span');hint.className='v543-optional-hint';title.appendChild(hint)}
    hint.textContent='Optional — leave these as they are if you do not use boosts';
    const rebirth=byId('layoutRebirthField');
    if(rebirth){
      rebirth.classList.add('compare-boost-card','v604-oil-rebirth');
      rebirth.style.marginTop='9px';
      if(rebirth.parentElement!==boosts)boosts.appendChild(rebirth);
    }
    return true;
  }

  function syncQuickPresentation(parts=nodes()){
    const quick=parts?.quick;if(!quick)return false;quick.classList.add('v593-quick-flow');return true;
  }

  function copiedRowsAvailable(){return typeof layoutCopiedRows!=='undefined'&&Array.isArray(layoutCopiedRows)}
  function syncAdvancedButtons(){
    const has=copiedRowsAvailable();for(const id of['layoutPasteEmpty','layoutPasteAll']){const btn=byId(id);if(btn)btn.disabled=!has}
  }
  function clearRefineryReserve(){window.STOT_REFINERY_RESERVE=null}
  function pasteCopied(mode){
    if(!copiedRowsAvailable()||typeof layoutPlots==='undefined')return;
    let changed=0;
    for(const p of layoutPlots){if(mode==='empty'&&Array.isArray(p.rows)&&p.rows.length)continue;p.rows=cloneRows(layoutCopiedRows);changed++}
    clearRefineryReserve();if(typeof renderLayout==='function')renderLayout();
    const status=byId('layoutCopyStatus');if(status)status.textContent=mode==='empty'?`Pasted to ${changed} empty plot${changed===1?'':'s'}`:'Pasted to all 15 plots';
    syncAdvancedButtons();
  }
  function clearAllPlots(){
    if(typeof layoutPlots==='undefined')return;
    const has=layoutPlots.some(p=>Array.isArray(p.rows)&&p.rows.length),status=byId('layoutCopyStatus');
    if(!has){if(status)status.textContent='Layout is already empty';return}
    if(!window.confirm('Clear all drills from this layout?'))return;
    for(const p of layoutPlots)p.rows=[];clearRefineryReserve();if(typeof renderLayout==='function')renderLayout();
    if(status)status.textContent='All 15 plots cleared';
    setTimeout(()=>oil()?.dispatchEvent(new Event('change',{bubbles:true})),0);
  }
  function ownAdvancedButton(id,text,handler){
    let btn=byId(id);if(!btn)return false;
    if(btn.dataset.stage4AdvancedOwner!=='1'){
      const fresh=btn.cloneNode(true);fresh.dataset.stage4AdvancedOwner='1';fresh.textContent=text;btn.replaceWith(fresh);btn=fresh;btn.addEventListener('click',handler);
    }else btn.textContent=text;
    return true;
  }
  function syncAdvancedPresentation(parts=nodes()){
    const tools=parts?.advanced;if(!tools)return false;tools.open=true;tools.classList.add('v590-advanced-inline');
    const summary=tools.querySelector(':scope > summary');if(summary)summary.textContent='Advanced Tools';
    ownAdvancedButton('layoutPasteEmpty','Paste Empty',()=>pasteCopied('empty'));
    ownAdvancedButton('layoutPasteAll','Paste All',()=>pasteCopied('all'));
    ownAdvancedButton('layoutClearAll','Clear All',clearAllPlots);
    syncAdvancedButtons();return !!(byId('layoutPasteEmpty')&&byId('layoutPasteAll')&&byId('layoutClearAll'));
  }

  function enhancePlotButtons(){
    if(typeof layoutPlots==='undefined')return false;
    document.querySelectorAll('#layoutAreas .plot-card').forEach(card=>{
      const actions=card.querySelector('.plot-actions');if(!actions)return;actions.classList.add('v536-three');
      actions.querySelectorAll('[data-v536-duplicate]').forEach(el=>el.remove());
      if(actions.querySelector('[data-stage4-duplicate]'))return;
      const id=card.dataset.plot,index=layoutPlots.findIndex(p=>p.id===id),btn=document.createElement('button');
      btn.type='button';btn.className='plot-action v536-duplicate';btn.dataset.stage4Duplicate=id;btn.textContent='Duplicate → Next';btn.disabled=index<0||index>=layoutPlots.length-1;
      btn.addEventListener('click',()=>{
        const current=layoutPlots.findIndex(p=>p.id===id);if(current<0||current>=layoutPlots.length-1)return;
        const src=layoutPlots[current],next=layoutPlots[current+1];
        if(next.rows.length&&!window.confirm(`Plot ${next.index} already has drills. Replace it with this plot?`))return;
        next.rows=cloneRows(src.rows);const nextId=next.id;if(typeof renderLayout==='function')renderLayout();
        requestAnimationFrame(()=>{const nextCard=document.querySelector(`#layoutAreas .plot-card[data-plot="${nextId}"]`),group=nextCard?.closest('details.area-group');if(group)group.open=true;nextCard?.scrollIntoView({behavior:'smooth',block:'center'})});
      });actions.appendChild(btn);
    });return true;
  }

  function syncSummaryPresentation(parts=nodes()){
    const summary=parts?.summary;if(!summary)return false;if(summary.classList.contains('v519-combined-summary'))summary.classList.add('panel','v541-summary-panel');return true;
  }

  function hideEmptyOilShells(parts=nodes()){
    const view=parts?.view;if(!view)return false;
    const isVisible=node=>{if(!node)return false;const cs=getComputedStyle(node);if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;const r=node.getBoundingClientRect();return r.width>0&&r.height>0};
    const hasVisibleMeaningful=el=>{if([...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return true;return[...el.querySelectorAll('*')].some(node=>isVisible(node)&&(node.matches('input,select,textarea,button,img,svg,canvas')||[...node.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())))};
    const protectedEls=[parts.calculator,parts.boosts,parts.quick,parts.advanced,parts.builder,parts.summary].filter(Boolean);
    const candidates=[...view.querySelectorAll(':scope > .panel, :scope > .layout-controls, :scope > .layout-control-card'),...view.querySelectorAll(':scope > .layout-controls > .layout-control-card')];
    candidates.forEach(el=>{el.classList.remove('v593-empty-oil-shell');if(protectedEls.some(p=>p===el||el.contains(p)||p.contains(el)))return;if(!hasVisibleMeaningful(el))el.classList.add('v593-empty-oil-shell')});return true;
  }

  function installSharePreview(){
    if(window.__STOT_OIL_SHARE_COMPACT_V592__)return true;const original=window.openSharePreview;if(typeof original!=='function')return false;
    window.__STOT_OIL_SHARE_COMPACT_V592__=true;
    window.openSharePreview=function(title,html,text){const result=original.call(this,title,html,text),preview=byId('sharePreview');if(preview){const isOil=/\bOil\s+(Layout|Preset)\b/i.test(String(title||''))||(String(html||'').includes('share-setup-grid')&&String(html||'').includes('Production'));preview.classList.toggle('v592-oil-share-compact',isOil)}return result};return true;
  }

  function installRenderHook(){
    if(typeof renderLayout!=='function'||renderLayout.__stage4OilControllerWrapped)return false;
    const original=renderLayout,wrapped=function(){const result=original.apply(this,arguments);setTimeout(sync,0);return result};wrapped.__stage4OilControllerWrapped=true;renderLayout=wrapped;return true;
  }

  function markOwnership(parts){
    if(!parts?.view)return;parts.view.dataset.stage4OilOwner='controller';
    for(const role of['calculator','boosts','quick','advanced','builder','areas','note','summary']){const node=parts[role];if(node)node.dataset.stage4OilOwner=role}
    document.documentElement.dataset.stotOilController='stage4';
  }

  function syncOrder(parts=nodes()){
    const view=parts?.view,intro=parts?.intro;if(!view||!intro)return false;
    const order=[parts.calculator,parts.boosts,parts.quick,parts.advanced,parts.builder,parts.areas,parts.note,parts.summary].filter((node,index,list)=>node&&view.contains(node)&&list.indexOf(node)===index&&node!==intro);
    let anchor=intro;for(const node of order){if(anchor.nextElementSibling!==node)anchor.insertAdjacentElement('afterend',node);anchor=node}
    return !!(parts.calculator&&parts.quick&&parts.advanced&&parts.builder);
  }

  function sync(){
    const parts=nodes();if(!parts?.view)return false;
    hideKnownLegacyShells(parts.view);syncCalculatorPresentation(parts);syncBoostPresentation(parts);syncQuickPresentation(parts);syncAdvancedPresentation(parts);enhancePlotButtons();syncSummaryPresentation(parts);installSharePreview();installRenderHook();
    const ordered=syncOrder(parts);hideEmptyOilShells(parts);markOwnership(parts);return ordered;
  }

  function schedule(){for(const delay of[0,90,260,560])setTimeout(sync,delay)}
  function snapshot(){const parts=nodes();if(!parts)return null;const direct=[...parts.view.children],index=node=>node?direct.indexOf(node):-1;return{owner:parts.view.dataset.stage4OilOwner||'',calculator:index(parts.calculator),boosts:index(parts.boosts),quick:index(parts.quick),advanced:index(parts.advanced),builder:index(parts.builder),areas:index(parts.areas),note:index(parts.note),summary:index(parts.summary)}}

  window.STOT_OIL_PAGE_CONTROLLER=Object.freeze({
    mount:sync,sync,syncOrder:()=>syncOrder(nodes()),syncAdvanced:()=>syncAdvancedPresentation(nodes()),syncCalculator:()=>syncCalculatorPresentation(nodes()),syncBoosts:()=>syncBoostPresentation(nodes()),syncQuick:()=>syncQuickPresentation(nodes()),snapshot,ownsOilShell:true,ownsAdvancedTools:true,compareStateShared:false
  });

  document.addEventListener('click',e=>{const target=e.target instanceof Element?e.target:null;if(target?.closest('#oilView [data-copy]'))setTimeout(syncAdvancedButtons,0)},true);
  document.querySelector('.tabs button[data-view="oil"]')?.addEventListener('click',schedule);
  function boot(){let tries=0;const run=()=>{tries++;const ready=sync();if((ready&&installSharePreview())||tries>=100)return;setTimeout(run,80)};run()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
