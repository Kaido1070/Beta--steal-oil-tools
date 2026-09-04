(() => {
  /* v5.39 compatibility — Stage 3 isolation
     Oil / Hour owns its DOM permanently. Compare Presets owns a separate DOM
     and state through STOT_COMPARE_PRESETS_CONTROLLER. Nothing is transferred
     between the two pages. */
  if(window.__STOT_V539_UI__) return;
  window.__STOT_V539_UI__=true;

  const byId=id=>document.getElementById(id);
  const nextFrames=fn=>{requestAnimationFrame(()=>requestAnimationFrame(fn));};

  function hideKnownLegacyShells(root,preserve=null){
    if(!root) return;
    ['v527Workflow','v528Condition','v529Condition','v528LayoutSettings','v529LayoutSetup'].forEach(id=>{
      const el=byId(id);
      if(el && el!==preserve && root.contains(el)) el.classList.add('v539-hidden-shell');
    });
    root.querySelectorAll('.v519-old-result,.v528-remove-empty,.v533-obsolete-empty').forEach(el=>el.classList.add('v539-hidden-shell'));
  }

  function mountOil(){
    const oil=byId('oilView'); if(!oil) return;
    const controls=document.querySelector('.layout-controls');
    const calc=byId('layoutModeTabs')?.closest('.layout-control-card')||null;
    const boosts=document.querySelector('.v520-boosts');
    const quick=byId('v536QuickFill');
    const advanced=byId('v536AdvancedTools');
    const areas=byId('layoutAreas');
    const note=document.querySelector('.layout-note');
    if(!controls) return;

    if(controls.parentElement!==oil) oil.appendChild(controls);
    if(calc && calc.parentElement!==controls) controls.appendChild(calc);
    controls.classList.remove('v539-empty-controls');

    if(boosts){
      boosts.classList.remove('v539-compare-boosts');
      boosts.classList.add('v539-oil-boosts');
      const title=boosts.querySelector('.v520-boosts-title strong');
      const hint=boosts.querySelector('.v520-boosts-title span');
      if(title) title.textContent='Layout Boosts';
      if(hint) hint.textContent='Mole • Fruit • Heart Likes • x2';
    }

    const introPanel=oil.querySelector(':scope > .panel.step');
    let anchor=introPanel;
    for(const el of [boosts,controls,quick,advanced,areas,note]){
      if(!el || !anchor) continue;
      if(el!==anchor.nextElementSibling) anchor.insertAdjacentElement('afterend',el);
      anchor=el;
    }
    hideKnownLegacyShells(oil);
  }

  function lockCompareVisualOwnership(){
    const controller=window.STOT_COMPARE_PRESETS_CONTROLLER;
    const visual=window.STOT_VISUAL_PLOT_BUILDER;
    if(!controller||!visual||visual.__stage3CompareIsolated===true) return;

    /* The legacy Visual Builder is Oil-owned. Its old mount() still knows how
       to reposition #layoutVisualBuilderCompare using Oil-era rules. Never let
       that mount path run while Stage 3 owns Compare. Preserve render/open/close
       routing already installed by the Stage 3 controller. */
    visual.mount=()=>byId('layoutVisualBuilderCompare');
    visual.__stage3CompareIsolated=true;
  }

  function keepCompareCoreContiguous(){
    const view=byId('layoutcompareView');
    const builder=byId('layoutVisualBuilderCompare');
    const comparison=view?.querySelector('.ab-compare');
    const note=view?.querySelector('.v603-note');
    if(!view||!builder||!comparison) return;
    /* The explanatory note must not split the tested/visible core sequence:
       Advanced Tools -> Visual Plot Builder -> Preset Comparison. */
    if(note && builder.nextElementSibling===note && note.nextElementSibling===comparison){
      comparison.insertAdjacentElement('afterend',note);
    }
  }

  function mountCompare(){
    /* Stage 3 owns Compare completely. Never move or mount an Oil-owned node here. */
    lockCompareVisualOwnership();
    window.STOT_COMPARE_PRESETS_CONTROLLER?.mount?.();
    keepCompareCoreContiguous();
  }

  function syncActiveView(){
    const compare=byId('layoutcompareView');
    if(compare?.classList.contains('active')) mountCompare();
    else if(byId('oilView')?.classList.contains('active')) mountOil();
  }

  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.addEventListener('click',()=>nextFrames(syncActiveView));
  });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>nextFrames(syncActiveView),{once:true});
  else nextFrames(syncActiveView);
})();