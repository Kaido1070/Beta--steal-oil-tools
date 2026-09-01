(() => {
  if (window.__STOT_BETA_DATABASE_REDESIGN__) return;
  window.__STOT_BETA_DATABASE_REDESIGN__ = true;

  const VERSION='5.57';
  const view=document.getElementById('databaseView');
  if(!view) return;
  view.classList.add('v557-db');

  const config={
    drills:{root:'#drillList',count:'#drillCount',label:'Drills'},
    refineries:{root:'#refineryList',count:'#refineryCount',label:'Refineries'},
    solar:{root:'#solarList',count:'#solarCount',label:'Solar'},
    totems:{root:'#totemList',count:'#totemCount',label:'Totems'},
    decorations:{root:'#decorationList',count:'#decorationCount',label:'Decorations'},
    lootboxes:{root:'#lootboxList',count:'#lootboxCount',label:'Lootboxes'},
    pets:{root:'#petList',count:'#petCount',label:'Pets'}
  };

  function cardCount(root){return root?.querySelectorAll('.drill-card').length||0}
  function enhanceList(key){
    const cfg=config[key];
    if(!cfg) return;
    const root=document.querySelector(cfg.root);
    if(!root) return;
    root.classList.add('v557-db-list',`v557-${key}-list`);
    root.querySelectorAll('.drill-card').forEach(card=>{
      card.classList.add('v557-db-card',`v557-${key}-card`);
      const logo=card.querySelector('.drill-logo');
      if(logo && !logo.querySelector('img') && !logo.classList.contains('v546-atlas-thumb')) card.classList.add('v557-no-image');
      else card.classList.remove('v557-no-image');
      const head=card.querySelector('.drill-head');
      if(head && !head.dataset.v557A11y){
        head.dataset.v557A11y='1';
        head.setAttribute('role','button');
        head.setAttribute('tabindex','0');
        head.setAttribute('aria-expanded',card.classList.contains('open')?'true':'false');
        head.addEventListener('keydown',e=>{
          if(e.key==='Enter'||e.key===' '){e.preventDefault();head.click();setTimeout(()=>head.setAttribute('aria-expanded',card.classList.contains('open')?'true':'false'),0)}
        });
      }
    });
  }

  function activeKey(){return document.querySelector('#databaseTabs [data-dbview].active')?.dataset.dbview||'drills'}

  function syncTabs(){
    const tabs=document.getElementById('databaseTabs');
    if(!tabs) return;
    tabs.querySelectorAll('[data-dbview]').forEach(btn=>{
      const key=btn.dataset.dbview;
      const cfg=config[key];
      if(!cfg) return;
      const root=document.querySelector(cfg.root);
      btn.dataset.v557Count=String(cardCount(root));
      if(!btn.dataset.v557Label){btn.dataset.v557Label='1';btn.title=cfg.label||key}
    });
  }

  function ensureToolbar(){
    const tabs=document.getElementById('databaseTabs');
    if(!tabs||document.getElementById('v557DbToolbar')) return;
    const bar=document.createElement('div');
    bar.id='v557DbToolbar';bar.className='v557-db-toolbar';
    bar.innerHTML='<div><strong id="v557DbTitle">Database</strong><span id="v557DbHint">Browse items and tap a card for full details.</span></div><span id="v557DbVisible"></span>';
    tabs.insertAdjacentElement('afterend',bar);
  }

  function syncToolbar(){
    const key=activeKey(),cfg=config[key];
    const title=document.getElementById('v557DbTitle');
    const visible=document.getElementById('v557DbVisible');
    const root=cfg?document.querySelector(cfg.root):null;
    if(title) title.textContent=cfg?.label||'Database';
    if(visible) visible.textContent=`${cardCount(root)} shown`;
  }

  function refresh(){
    Object.keys(config).forEach(enhanceList);
    ensureToolbar();
    syncTabs();syncToolbar();
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})};
  const observer=new MutationObserver(schedule);
  observer.observe(view,{childList:true,subtree:true});
  view.addEventListener('click',e=>{
    const head=e.target.closest('.v557-db-card .drill-head');
    if(head) setTimeout(()=>head.setAttribute('aria-expanded',head.closest('.drill-card')?.classList.contains('open')?'true':'false'),0);
    if(e.target.closest('#databaseTabs [data-dbview]')) setTimeout(schedule,0);
  },true);
  view.addEventListener('input',schedule,true);
  view.addEventListener('change',schedule,true);

  refresh();setTimeout(refresh,120);setTimeout(refresh,450);
})();
