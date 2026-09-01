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
