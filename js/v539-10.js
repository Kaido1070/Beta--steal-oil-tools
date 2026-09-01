(() => {
  /* v5.39 — Older compare-layout patches physically moved the calculator and
     boosts out of Oil / Hour. Keep one real set of controls, but mount it in
     the correct page every time the user switches views. */
  if(window.__STOT_V539_UI__) return;
  window.__STOT_V539_UI__=true;

  const byId=id=>document.getElementById(id);
  const nextFrames=fn=>{setTimeout(fn,0);setTimeout(fn,40);requestAnimationFrame(()=>requestAnimationFrame(fn));};

  function liveParts(){
    const modeTabs=byId('layoutModeTabs');
    return {
      calc:modeTabs?.closest('.layout-control-card')||null,
      boosts:document.querySelector('.v520-boosts'),
      controls:document.querySelector('.layout-controls'),
      quick:byId('v536QuickFill'),
      advanced:byId('v536AdvancedTools'),
      areas:byId('layoutAreas'),
      note:document.querySelector('.layout-note')
    };
  }

  function hideKnownLegacyShells(root,preserve=null){
    if(!root) return;
    ['v527Workflow','v528Condition','v529Condition','v528LayoutSettings','v529LayoutSetup'].forEach(id=>{
      const el=byId(id);
      if(el && el!==preserve && root.contains(el)) el.classList.add('v539-hidden-shell');
    });
    root.querySelectorAll('.v519-old-result,.v528-remove-empty,.v533-obsolete-empty').forEach(el=>el.classList.add('v539-hidden-shell'));

    root.querySelectorAll(':scope > .panel').forEach(panel=>{
      if(panel.classList.contains('ab-compare')) return;
      if(panel.querySelector('.ab-editing') && !panel.querySelector('.ab-layout-switch')){
        panel.classList.add('v539-hidden-shell');
        return;
      }
      const useful=panel.querySelector('input:not([type="hidden"]),select,textarea,button:not([hidden]),#layoutModeTabs,.ab-compare,.v56-compare-intro,.v520-boosts');
      const text=(panel.innerText||'').trim();
      if(!useful && !text) panel.classList.add('v539-hidden-shell');
    });
  }

  function mountOil(){
    const oil=byId('oilView'); if(!oil) return;
    const {calc,boosts,controls,quick,advanced,areas,note}=liveParts();
    if(!calc || !boosts || !controls) return;

    if(calc.parentElement!==controls) controls.appendChild(calc);
    controls.classList.remove('v539-empty-controls');

    boosts.classList.remove('v539-compare-boosts');
    boosts.classList.add('v539-oil-boosts');
    const title=boosts.querySelector('.v520-boosts-title strong');
    const hint=boosts.querySelector('.v520-boosts-title span');
    if(title) title.textContent='Layout Boosts';
    if(hint) hint.textContent='Mole • Fruit • Heart Likes • x2';

    const introPanel=oil.querySelector(':scope > .panel.step');
    const intro=oil.querySelector('.oil-layout-intro');
    if(intro){
      const h=intro.querySelector('h2'); const p=intro.querySelector('p'); const badge=intro.querySelector('.layout-badge');
      if(h) h.textContent='Oil / Hour';
      if(p) p.textContent='Build one layout, set your boosts, and see its production or time to target.';
      if(badge) badge.textContent='1 Layout';
    }

    let anchor=introPanel;
    for(const el of [boosts,controls,quick,advanced,areas,note]){
      if(!el || !anchor) continue;
      anchor.insertAdjacentElement('afterend',el); anchor=el;
    }
    hideKnownLegacyShells(oil);
  }

  function mountCompare(){
    const view=byId('layoutcompareView'); if(!view) return;
    const {calc,boosts,controls,quick,advanced,areas,note}=liveParts();
    const intro=view.querySelector('.v56-compare-intro');
    const condition=byId('v533Condition')||byId('v529Condition');
    const conditionHost=byId('v533ConditionHost')||byId('v529ConditionHost');
    const settings=byId('v524CompareSettings');
    const editor=byId('v526EditorSwitch');
    const comparison=view.querySelector('.ab-compare');
    const actions=view.querySelector('.v56-compare-actions');
    if(!intro || !condition || !calc || !settings || !editor || !boosts || !comparison) return;

    if(conditionHost && calc.parentElement!==conditionHost) conditionHost.appendChild(calc);
    if(controls) controls.classList.add('v539-empty-controls');
    boosts.classList.remove('v539-oil-boosts');
    boosts.classList.add('v539-compare-boosts');

    let anchor=intro;
    for(const el of [condition,settings,editor,boosts,quick,advanced,areas,note,comparison,actions]){
      if(!el) continue;
      anchor.insertAdjacentElement('afterend',el); anchor=el;
    }
    hideKnownLegacyShells(view,condition);
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