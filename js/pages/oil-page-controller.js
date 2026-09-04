/* Stage 4 — authoritative Oil / Hour page shell controller.
   This controller owns Oil-only presentation/order. It does not own calculations
   and never reads or mutates Compare Presets state/DOM. */
(()=>{
  if(window.__STOT_STAGE4_OIL_PAGE_CONTROLLER__)return;
  window.__STOT_STAGE4_OIL_PAGE_CONTROLLER__=true;

  const byId=id=>document.getElementById(id);
  const oil=()=>byId('oilView');
  const insideOil=node=>!!node&&!!oil()?.contains(node);

  function ensureVisualBuilder(){
    const view=oil();if(!view)return null;
    let builder=byId('layoutVisualBuilder');
    if(!builder&&window.STOT_VISUAL_PLOT_BUILDER?.mount){
      try{builder=window.STOT_VISUAL_PLOT_BUILDER.mount()}catch(_){}
    }
    if(builder&&builder.parentElement!==view)view.appendChild(builder);
    return builder;
  }

  function nodes(){
    const view=oil();if(!view)return null;
    const tabs=byId('layoutModeTabs');
    const calculator=insideOil(tabs)?tabs.closest('.layout-control-card'):null;
    const boosts=view.querySelector('.v520-boosts');
    const quick=byId('v536QuickFill');
    const advanced=byId('v536AdvancedTools');
    const builder=ensureVisualBuilder();
    const areas=byId('layoutAreas');
    const note=view.querySelector('.layout-note');
    const summary=view.querySelector('.v519-combined-summary')||view.querySelector('.v56-summary')||view.querySelector('.panel.result');
    const intro=view.querySelector(':scope > .panel.step');
    return {
      view,intro,calculator,boosts,
      quick:insideOil(quick)?quick:null,
      advanced:insideOil(advanced)?advanced:null,
      builder:insideOil(builder)?builder:null,
      areas:insideOil(areas)?areas:null,
      note,summary
    };
  }

  function syncCalculatorPresentation(parts=nodes()){
    const view=parts?.view,tabs=byId('layoutModeTabs');
    if(!view||!tabs||!view.contains(tabs))return false;
    tabs.classList.add('v593-mode-grid');
    const time=tabs.querySelector('[data-layoutmode="time"]');
    const target=tabs.querySelector('[data-layoutmode="target"]');
    if(time){
      time.classList.add('v593-mode-choice');
      time.innerHTML='<strong>Time → Oil</strong><small>How much oil you’ll make</small>';
      time.setAttribute('aria-label','Time to Oil: calculate how much oil you will make');
    }
    if(target){
      target.classList.add('v593-mode-choice');
      target.innerHTML='<strong>Oil → Time</strong><small>When you’ll reach your target</small>';
      target.setAttribute('aria-label','Oil to Time: calculate when you will reach your target');
    }
    parts.calculator?.classList.add('v593-calc-card');
    byId('layoutHours')?.closest('.field')?.classList.add('v593-runtime-field');
    const intro=view.querySelector('.v543-calc-intro');
    if(intro){
      const title=intro.querySelector('strong'),copy=intro.querySelector('span');
      if(title){title.textContent='Choose a calculation';title.classList.add('v593-question-title')}
      if(copy){copy.textContent='You can switch anytime.';copy.classList.add('v593-question-copy')}
    }
    return true;
  }

  function syncAdvancedPresentation(parts=nodes()){
    const tools=parts?.advanced;if(!tools)return false;
    tools.open=true;
    tools.classList.add('v590-advanced-inline');
    const summary=tools.querySelector(':scope > summary');
    if(summary)summary.textContent='Advanced Tools';
    const labels=[
      ['layoutPasteEmpty','Paste Empty'],
      ['layoutPasteAll','Paste All'],
      ['layoutClearAll','Clear All']
    ];
    for(const [id,text] of labels){const btn=byId(id);if(btn&&tools.contains(btn))btn.textContent=text}
    return labels.every(([id])=>{const btn=byId(id);return !!btn&&tools.contains(btn)});
  }

  function markOwnership(parts){
    if(!parts?.view)return;
    parts.view.dataset.stage4OilOwner='controller';
    const roles=['calculator','boosts','quick','advanced','builder','areas','note','summary'];
    for(const role of roles){const node=parts[role];if(node)node.dataset.stage4OilOwner=role}
    document.documentElement.dataset.stotOilController='stage4';
  }

  function syncOrder(parts=nodes()){
    const view=parts?.view;if(!view)return false;
    const intro=parts.intro;
    if(!intro)return false;
    // Canonical Oil flow. Unknown/legacy shells are deliberately not destroyed;
    // known Oil components are simply placed in their final authoritative order.
    const order=[parts.calculator,parts.boosts,parts.quick,parts.advanced,parts.builder,parts.areas,parts.note,parts.summary]
      .filter((node,index,list)=>node&&view.contains(node)&&list.indexOf(node)===index&&node!==intro);
    let anchor=intro;
    for(const node of order){
      if(anchor.nextElementSibling!==node)anchor.insertAdjacentElement('afterend',node);
      anchor=node;
    }
    return !!(parts.calculator&&parts.quick&&parts.advanced&&parts.builder);
  }

  function sync(){
    const parts=nodes();if(!parts?.view)return false;
    syncCalculatorPresentation(parts);
    syncAdvancedPresentation(parts);
    const ordered=syncOrder(parts);
    markOwnership(parts);
    return ordered;
  }

  function schedule(){
    for(const delay of [0,90,260,560])setTimeout(sync,delay);
  }

  function snapshot(){
    const parts=nodes();if(!parts)return null;
    const direct=[...parts.view.children];
    const index=node=>node?direct.indexOf(node):-1;
    return {
      owner:parts.view.dataset.stage4OilOwner||'',
      calculator:index(parts.calculator),boosts:index(parts.boosts),quick:index(parts.quick),
      advanced:index(parts.advanced),builder:index(parts.builder),areas:index(parts.areas),
      note:index(parts.note),summary:index(parts.summary)
    };
  }

  window.STOT_OIL_PAGE_CONTROLLER=Object.freeze({
    mount:sync,
    sync,
    syncOrder:()=>syncOrder(nodes()),
    syncAdvanced:()=>syncAdvancedPresentation(nodes()),
    syncCalculator:()=>syncCalculatorPresentation(nodes()),
    snapshot,
    ownsOilShell:true,
    compareStateShared:false
  });

  document.querySelector('.tabs button[data-view="oil"]')?.addEventListener('click',schedule);
  function boot(){let tries=0;const run=()=>{tries++;if(sync()||tries>=100)return;setTimeout(run,80)};run();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
