/* STOT Database page runtime v5.76 */
/* STOT Database page core — extracted from js/app.js */
/* database */

function itemVisual(item,type="item"){
  const name=I18N.itemName(item);
  if(item.image)return `<img src="${item.image}" alt="${name}" loading="lazy">`;
  return initials(name);
}
function renderActiveDatabasePane(){
  const active=$("#databaseTabs [data-dbview].active")?.dataset.dbview||"pets";
  ({drills:renderDb,refineries:renderRefineries,solar:renderSolar,totems:renderTotems,decorations:renderDecorations,lootboxes:renderLootboxes,pets:()=>{renderPets();calcPet()}})[active]?.();
}

function renderDb(){
  const q=$("#dbSearch").value.trim().toLowerCase(),cat=$("#categoryFilter").value,rar=$("#rarityFilter").value,sort=$("#sortFilter").value;
  let list=drills.filter(d=>(!q||d.name.toLowerCase().includes(q)||d.rarity.toLowerCase().includes(q))&&(cat==="all"||d.category===cat)&&(rar==="all"||d.rarity===rar));
  if(sort==="oil-desc")list.sort((a,b)=>(b.oil??-1)-(a.oil??-1));if(sort==="oil-asc")list.sort((a,b)=>(a.oil??Infinity)-(b.oil??Infinity));if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
  $("#dbCount").textContent=`${list.length} drill${list.length===1?"":"s"}`;
  $("#drillList").innerHTML=list.map(d=>`
  <article class="drill-card">
    <div class="drill-head">
      <div class="drill-logo">${itemVisual(d,"drill")}</div>
      <div class="drill-info"><strong>${I18N.itemName(d)}</strong><div class="meta"><span class="pill">${d.rarity}</span><span class="pill">${catLabel(d.category)}</span><span class="pill">${d.footprint}</span></div></div>
      <div class="oil-rate"><strong>${d.oil==null?"Dynamic":fmt(d.oil)}</strong><small>OIL / SEC</small></div>
    </div>
    <div class="details">
      <div class="detail"><span>Cash / Event Price</span><strong>${d.cash||d.eventPrice||"—"}</strong></div>
      <div class="detail"><span>V-Bucks</span><strong>${d.vbucks||"—"}</strong></div>
      <div class="detail"><span>Footprint</span><strong>${d.footprint}</strong></div>
      <div class="detail"><span>Base Oil/s</span><strong>${d.oil==null?"Dynamic":fmt(d.oil)}</strong></div>
      ${d.notes?`<div class="details-note">${d.notes}</div>`:""}
    </div>
  </article>`).join("")||'<div class="panel" style="padding:25px;text-align:center;color:#7f899c;font-size:11px">No drills found.</div>';
}
["#dbSearch","#categoryFilter","#rarityFilter","#sortFilter"].forEach(s=>$(s).addEventListener("input",renderDb));
$("#drillList").onclick=e=>{const c=e.target.closest(".drill-card");if(c)c.classList.toggle("open")};


function genericCard(name,rarity,badges,headline,headlineLabel,details,notes=""){
  return `<article class="drill-card">
    <div class="drill-head">
      <div class="drill-logo">${initials(name)}</div>
      <div class="drill-info"><strong>${name}</strong><div class="meta">${badges.map(x=>`<span class="pill">${x}</span>`).join("")}</div></div>
      <div class="oil-rate"><strong>${headline}</strong><small>${headlineLabel}</small></div>
    </div>
    <div class="details">
      ${details.map(([k,v])=>`<div class="detail"><span>${k}</span><strong>${v??"—"}</strong></div>`).join("")}
      ${notes?`<div class="details-note">${notes}</div>`:""}
    </div>
  </article>`;
}
function wireCards(listSelector){$(listSelector).onclick=e=>{const c=e.target.closest(".drill-card");if(c)c.classList.toggle("open")}}

function renderRefineries(){
  const q=$("#refinerySearch").value.trim().toLowerCase(),type=$("#refineryTypeFilter").value,rar=$("#refineryRarityFilter").value;
  const list=refineries.filter(x=>(!q||x.name.toLowerCase().includes(q)||x.rarity.toLowerCase().includes(q))&&(type==="all"||x.type===type)&&(rar==="all"||x.rarity===rar));
  $("#refineryCount").textContent=`${list.length} refiner${list.length===1?"y":"ies"}`;
  $("#refineryList").innerHTML=list.map(x=>genericCard(x.name,x.rarity,[x.rarity,x.type==="regular"?"Regular Shop":"Special",x.footprint],x.capacity,"CAPACITY",[["Cash Price",x.cash||"—"],["V-Bucks",x.vbucks||"—"],["Footprint",x.footprint],["Storage",x.capacity]],x.notes||"")).join("")||'<div class="panel empty">No refineries found.</div>';
}
function renderSolar(){
  const q=$("#solarSearch").value.trim().toLowerCase();
  const list=solarPanels.filter(x=>!q||x.name.toLowerCase().includes(q)||x.rarity.toLowerCase().includes(q));
  $("#solarCount").textContent=`${list.length} solar panel${list.length===1?"":"s"}`;
  $("#solarList").innerHTML=list.map(x=>genericCard(x.name,x.rarity,[x.rarity],x.generation,"GENERATION",[["Max Storage",x.storage],["Gasoline Price",x.gasoline],["V-Bucks",x.vbucks],["Generation",x.generation]])).join("")||'<div class="panel empty">No solar panels found.</div>';
}
function renderTotems(){
  const q=$("#totemSearch").value.trim().toLowerCase(),type=$("#totemTypeFilter").value;
  const list=totems.filter(x=>(!q||x.name.toLowerCase().includes(q)||x.rarity.toLowerCase().includes(q)||x.boost.toLowerCase().includes(q))&&(type==="all"||x.type===type));
  $("#totemCount").textContent=`${list.length} totem${list.length===1?"":"s"}`;
  $("#totemList").innerHTML=list.map(x=>genericCard(x.name,x.rarity,[x.rarity,x.type==="cash"?"Cash":x.type==="afk"?"AFK":"Special",x.footprint],x.boost,x.type==="afk"?"AFK BOOST":x.type==="cash"?"CASH BOOST":"BOOST",[["Gasoline Price",x.price],["Footprint",x.footprint],["Rarity",x.rarity],["Boost",x.boost]],x.notes||"")).join("")||'<div class="panel empty">No totems found.</div>';
}
function renderDecorations(){
  const q=$("#decorationSearch").value.trim().toLowerCase(),type=$("#decorationTypeFilter").value;
  const list=decorations.filter(x=>(!q||x.name.toLowerCase().includes(q)||x.rarity.toLowerCase().includes(q)||x.effect.toLowerCase().includes(q))&&(type==="all"||x.type===type));
  $("#decorationCount").textContent=`${list.length} structure${list.length===1?"":"s"}`;
  $("#decorationList").innerHTML=list.map(x=>{
    const typeLabel=x.type==="utility"?"Utility & Info":x.type==="turbine"?"Wind Turbine":"Pet Structure";
    const badges=[x.rarity,typeLabel,x.footprint].filter(v=>v&&v!=="—");
    const headline=x.type==="turbine"?x.effect:x.cash;
    const headlineLabel=x.type==="turbine"?"CASH / SEC":x.type==="pet"?"COST":"CASH PRICE";
    return genericCard(x.name,x.rarity,badges,headline,headlineLabel,[["Cost",x.cash],["Footprint",x.footprint],["Rarity",x.rarity],["Type",typeLabel]],x.effect);
  }).join("")||'<div class="panel empty">No structures found.</div>';
}
function renderLootboxes(){
  const q=$("#lootboxSearch").value.trim().toLowerCase(),type=$("#lootboxTypeFilter").value;
  const list=lootboxes.filter(x=>(!q||x.name.toLowerCase().includes(q)||x.rarity.toLowerCase().includes(q)||x.drops.some(d=>d[0].toLowerCase().includes(q)))&&(type==="all"||x.type===type));
  $("#lootboxCount").textContent=`${list.length} lootbox${list.length===1?"":"es"}`;
  $("#lootboxList").innerHTML=list.map(x=>{
    const drops=`<div class="drop-list">${x.drops.map(d=>`<div><span>${d[0]}</span><b>${d[1]}</b></div>`).join("")}</div>`;
    return `<article class="drill-card">
      <div class="drill-head">
        <div class="drill-logo">${initials(x.name)}</div>
        <div class="drill-info"><strong>${x.name}</strong><div class="meta"><span class="pill">${x.rarity}</span><span class="pill">${x.type==="drill"?"Drill":"Refinery"}</span></div></div>
        <div class="oil-rate"><strong>${x.cash}</strong><small>CASH PRICE</small></div>
      </div>
      <div class="details">
        <div class="detail"><span>Rarity</span><strong>${x.rarity}</strong></div>
        <div class="detail"><span>Type</span><strong>${x.type==="drill"?"Drill Lootbox":"Refinery Lootbox"}</strong></div>
        ${drops}
      </div>
    </article>`;
  }).join("")||'<div class="panel empty">No lootboxes found.</div>';
}

["#refinerySearch","#refineryTypeFilter","#refineryRarityFilter"].forEach(s=>$(s).addEventListener("input",renderRefineries));
$("#solarSearch").addEventListener("input",renderSolar);
["#totemSearch","#totemTypeFilter"].forEach(s=>$(s).addEventListener("input",renderTotems));
["#decorationSearch","#decorationTypeFilter"].forEach(s=>$(s).addEventListener("input",renderDecorations));
["#lootboxSearch","#lootboxTypeFilter"].forEach(s=>$(s).addEventListener("input",renderLootboxes));
wireCards("#refineryList");wireCards("#solarList");wireCards("#totemList");wireCards("#decorationList");wireCards("#lootboxList");

/* pet database */
$("#petSelect").innerHTML=pets.map((p,i)=>`<option value="${i}">${p.name}</option>`).join("");
function calcPet(){
  const p=pets[Number($("#petSelect").value)||0];
  const level=Math.max(1,Math.min(100,Math.floor(Number($("#petLevel").value)||1)));
  $("#petLevel").value=level;
  $("#petResultLabel").textContent=p.unit;
  $("#petResultValue").textContent=petValueText(p,level);
  $("#petResultName").textContent=p.name;
  $("#petResultRarity").textContent=p.rarity;
}
function renderPets(){
  const q=$("#petSearch").value.trim().toLowerCase(),rar=$("#petRarityFilter").value,sort=$("#petSortFilter").value;
  let list=pets.map((p,i)=>({...p,index:i})).filter(p=>(!q||p.name.toLowerCase().includes(q)||p.effect.toLowerCase().includes(q)||p.rarity.toLowerCase().includes(q))&&(rar==="all"||p.rarity===rar));
  if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
  if(sort==="rarity")list.sort((a,b)=>rarityRank(a.rarity)-rarityRank(b.rarity)||a.name.localeCompare(b.name));
  $("#petCount").textContent=`${list.length} pet${list.length===1?"":"s"}`;
  $("#petList").innerHTML=list.map(p=>`
  <article class="drill-card" data-pet-index="${p.index}">
    <div class="drill-head">
      <div class="drill-logo">${itemVisual(p,"pet")}</div>
      <div class="drill-info"><strong>${I18N.itemName(p)}</strong><div class="meta"><span class="pill">${p.rarity}</span><span class="pill">${p.unit}</span></div></div>
      <div class="oil-rate"><strong>${petValueText(p,100)}</strong><small>LV100</small></div>
    </div>
    <div class="details">
      <div class="detail"><span>Level 1</span><strong>${petValueText(p,1)}</strong></div>
      <div class="detail"><span>Level 100</span><strong>${petValueText(p,100)}</strong></div>
      <div class="details-note">${p.effect}</div>
    </div>
  </article>`).join("")||'<div class="panel" style="padding:25px;text-align:center;color:#7f899c;font-size:11px">No pets found.</div>';
}
$("#databaseTabs").onclick=e=>{
  const b=e.target.closest("[data-dbview]"); if(!b)return;
  $$("[data-dbview]").forEach(x=>x.classList.toggle("active",x===b));
  const key=b.dataset.dbview;
  const panes={drills:"#drillDbPane",refineries:"#refineriesDbPane",solar:"#solarDbPane",totems:"#totemsDbPane",decorations:"#decorationsDbPane",lootboxes:"#lootboxesDbPane",pets:"#petDbPane"};
  Object.values(panes).forEach(sel=>$(sel).style.display="none");
  $(panes[key]).style.display="block";
  if(key==="drills")renderDb();
  if(key==="refineries")renderRefineries();
  if(key==="solar")renderSolar();
  if(key==="totems")renderTotems();
  if(key==="decorations")renderDecorations();
  if(key==="lootboxes")renderLootboxes();
  if(key==="pets"){renderPets();calcPet()}
};
$("#petSelect").addEventListener("change",calcPet);
$("#petLevel").addEventListener("input",calcPet);
["#petSearch","#petRarityFilter","#petSortFilter"].forEach(s=>$(s).addEventListener("input",renderPets));
$("#petList").onclick=e=>{
  const c=e.target.closest(".drill-card");
  if(!c)return;
  c.classList.toggle("open");
  if(e.target.closest(".drill-head")){
    const idx=Number(c.dataset.petIndex);
    if(Number.isInteger(idx)){
      $("#petSelect").value=idx;
      calcPet();
    }
  }
};

/* Initial Database render; visual enhancements load after this core. */
renderDb();
renderRefineries();
renderSolar();
renderTotems();
renderDecorations();
renderLootboxes();
renderPets();
calcPet();

/* ===== js/beta-database-images.js ===== */
try {
(() => {
  if (window.__STOT_BETA_DATABASE_IMAGES__) return;
  window.__STOT_BETA_DATABASE_IMAGES__ = true;

  const VERSION = '5.56';
  const norm = value => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const groups = {
    refinery: {
      root: '#refineryList',
      base: 'assets/images/refineries/',
      files: {
        'Basic Refinery':'basic.webp','Enhanced Refinery':'enhanced.webp','Reinforced Refinery':'reinforced.webp','Advanced Refinery':'advanced.webp',
        'Plasma Refinery':'plasma.webp','Industrial Refinery':'industrial.webp','Energy Refinery':'energy.webp','Mega Refinery':'mega.webp',
        'Quantum Refinery':'quantum.webp','Ice Refinery':'ice.webp','Hell Refinery':'hell.webp','Nuclear Power Plant Refinery':'nuclear-power-plant.webp',
        'Nuclear Reactor Refinery':'nuclear-reactor.webp','Photon Refinery':'photon.webp','Crystal Core Refinery':'crystal-core.webp','Moon Base Refinery':'moon-base.webp',
        'Solar Refinery':'solar.webp','Antimatter Refinery':'antimatter.webp','Black Hole Refinery':'black-hole.webp','Angel Refinery':'angel.webp',
        'Demonic Refinery':'demonic.webp','Pagoda Refinery':'pagoda.webp','Castle Refinery':'castle.webp','Burger Refinery':'burger.webp',
        'Infinity Refinery':'infinity.webp','Infinite Refinery':'infinity.webp','Fruit Basket Refinery':'fruit-basket.webp'
      }
    },
    solar: {
      root: '#solarList',
      base: 'assets/images/solar/',
      files: {
        'Copper Solar Panel':'wood-solar.webp','Wood Solar Panel':'wood-solar.webp','Iron Solar Panel':'iron-solar.webp',
        'Golden Solar Panel':'gold-solar.webp','Gold Solar Panel':'gold-solar.webp','Emerald Solar Panel':'emerald-solar.webp'
      }
    },
    decoration: {
      root: '#decorationList',
      base: 'assets/images/decorations/',
      files: {
        'Radio Station':'radio-tower.webp','Radio Tower':'radio-tower.webp','Shuttle Station':'shuttle-station.webp',
        'Fusion Radio':'radio-bm.webp','Black Market Radio':'radio-bm.webp','Lootbox Radio':'radio-lb.webp','Loot Box Radio':'radio-lb.webp',
        'Wood Wind Turbine':'wood-wind-turbine.webp','Iron Wind Turbine':'iron-wind-turbine.webp','Gold Wind Turbine':'gold-wind-turbine.webp','Golden Wind Turbine':'gold-wind-turbine.webp',
        'Emerald Wind Turbine':'emerald-wind-turbine.webp','Basic Incubator':'basic-incubator.webp','Heated Incubator':'heated-incubator.webp',
        'Genetic Incubator':'genetic-incubator.webp','Work Station':'work-station.webp','Workstation':'work-station.webp'
      }
    },
    lootbox: {
      root: '#lootboxList',
      base: 'assets/images/lootboxes/',
      files: {
        'Basic Drill Lootbox':'basic-drill.webp','Gold Drill Lootbox':'gold-drill.webp','Diamond Drill Lootbox':'diamond-drill.webp',
        'Rainbow Drill Lootbox':'rainbow-drill.webp','Galaxy Drill Lootbox':'galaxy-drill.webp','Burger Drill Lootbox':'burger-drill.webp','Clock Drill Lootbox':'clock.webp',
        'Basic Refinery Lootbox':'basic-refinery.webp','Gold Refinery Lootbox':'gold-refinery.webp','Diamond Refinery Lootbox':'diamond-refinery.webp',
        'Rainbow Refinery Lootbox':'rainbow-refinery.webp','Galaxy Refinery Lootbox':'galaxy-refinery.webp','Burger Refinery Lootbox':'burger-refinery.webp'
      }
    }
  };

  Object.values(groups).forEach(group => {
    group.lookup = new Map(Object.entries(group.files).map(([name,file]) => [norm(name), file]));
  });

  function decorateGroup(group, kind) {
    const root = document.querySelector(group.root);
    if (!root) return;
    root.querySelectorAll('.drill-card').forEach(card => {
      const name = card.querySelector('.drill-info strong')?.textContent;
      const file = group.lookup.get(norm(name));
      const logo = card.querySelector('.drill-logo');
      if (!file || !logo) return;
      const expected = `${group.base}${file}?v=${VERSION}`;
      let img = logo.querySelector('img.v556-db-image');
      if (!img) {
        logo.textContent = '';
        img = document.createElement('img');
        img.className = 'v556-db-image';
        img.loading = 'lazy';
        img.decoding = 'async';
        logo.appendChild(img);
      }
      if (!img.src.endsWith(expected)) img.src = expected;
      img.alt = name || '';
      logo.classList.add('v556-db-logo', `v556-${kind}-logo`);
    });
  }

  function refresh() {
    Object.entries(groups).forEach(([kind, group]) => decorateGroup(group, kind));
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {childList:true, subtree:true});
  document.addEventListener('input', schedule, true);
  document.addEventListener('change', schedule, true);
  document.addEventListener('click', () => setTimeout(schedule, 0), true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once:true});
  else refresh();
  setTimeout(refresh, 120);
  setTimeout(refresh, 450);
})();

} catch (error) { console.error("STOT Database patch failed: js/beta-database-images.js", error); }

/* ===== js/beta-database-redesign.js ===== */
try {
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

  function ensureSourceNote(){
    const intro=view.querySelector('.section-intro > div');
    if(!intro||intro.querySelector('.v557-db-source')) return;
    const note=document.createElement('p');
    note.className='v557-db-source';
    note.style.marginTop='7px';
    note.style.fontSize='9px';
    note.style.lineHeight='1.45';
    note.style.color='var(--muted,#98a2b8)';
    note.style.overflowWrap='anywhere';
    note.textContent='Data source: https://oil-tycoon-fortnite.fandom.com/wiki/STEAL_THE_OIL_TYCOON_-_FORTNITE_Wiki';
    intro.appendChild(note);
  }

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
    ensureSourceNote();
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

} catch (error) { console.error("STOT Database patch failed: js/beta-database-redesign.js", error); }

document.documentElement.dataset.stotDatabasePage="5.76";
