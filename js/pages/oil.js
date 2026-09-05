/* STOT Oil / Hour page runtime — version from js/site-config.js — extracted from js/app.js  */
/* oil layout */
const LAYOUT_AREAS=[
  {id:"forest",name:"Forest",mult:1,plots:6},
  {id:"desert",name:"Desert",mult:2,plots:3},
  {id:"volcano-side",name:"Volcano Sides",mult:3,plots:2},
  {id:"volcano-core",name:"Volcano Core",mult:5,plots:1},
  {id:"mountain-side",name:"Mountain Sides",mult:6,plots:2},
  {id:"mountain-summit",name:"Mountain Summit",mult:10,plots:1}
];
const TIER_OPTIONS=[{name:"Basic",mult:1},{name:"Gold",mult:2},{name:"Diamond",mult:3},{name:"Rainbow",mult:5},{name:"Galaxy",mult:10}];
const layoutForgedData=window.STOT_FORGED_DRILLS||null;
const layoutCelestial=layoutForgedData?.celestial||null;
const layoutForgedTiers=layoutForgedData?.tiers||["Default","Gold","Diamond","Rainbow","Galaxy"];
let layoutTargetUnit=1e9;
let layoutLobbyMult=1;
let layoutCopiedRows=null;
const layoutPlots=[];
LAYOUT_AREAS.forEach(area=>{for(let i=1;i<=area.plots;i++)layoutPlots.push({id:`${area.id}-${i}`,area:area.id,areaName:area.name,mult:area.mult,index:i,rows:[]})});

const layoutProductionCore=window.STOT_LAYOUT_PRODUCTION;
function layoutRebirthLevel(){const raw=$("#layoutRebirth")?.value;return layoutProductionCore?.rebirthLevel?layoutProductionCore.rebirthLevel(raw):Math.max(0,Math.min(50,Math.trunc(Number(raw)||0)))}
function layoutRebirthBonus(){return layoutProductionCore?.rebirthBonusPercent?layoutProductionCore.rebirthBonusPercent(layoutRebirthLevel()):layoutRebirthLevel()*10}
function layoutRebirthMultiplier(){return layoutProductionCore?.rebirthMultiplier?layoutProductionCore.rebirthMultiplier(layoutRebirthLevel()):1+(layoutRebirthBonus()/100)}
function ensureLayoutRebirthControl(){
  if($("#layoutRebirth"))return;
  const mole=$("#layoutMole"),card=mole?.closest(".layout-control-card"),likes=$("#layoutLikes")?.closest("label.field");
  if(!card)return;
  const field=document.createElement("label");field.id="layoutRebirthField";field.className="field";field.style.marginTop="9px";
  field.innerHTML='<div class="field-head"><div class="labels"><strong>Rebirth Level</strong><small id="layoutRebirthBonus">Production Bonus: +0%</small></div></div><input id="layoutRebirth" type="number" min="0" max="50" step="1" value="0" inputmode="numeric" placeholder="0 - 50">';
  if(likes&&likes.parentElement===card)card.insertBefore(field,likes);else card.appendChild(field);
}
function syncLayoutRebirthUI(){const el=$("#layoutRebirth"),bonus=$("#layoutRebirthBonus");if(!el)return 0;const level=layoutRebirthLevel();if(String(el.value)!==String(level))el.value=level;if(bonus)bonus.textContent=`Production Bonus: +${layoutRebirthBonus()}%`;return level}

function fpSize(fp){const m=String(fp||"1x1").match(/^(\d+)x(\d+)$/);return m?[+m[1],+m[2]]:[1,1]}
function layoutDrill(id){if(layoutCelestial&&id===layoutCelestial.id)return layoutCelestial;return drills.find(x=>x.id===id)}
function isLayoutForged(d){return Boolean(d&&d.category==="forged")}
function layoutRowLimit(row){return isLayoutForged(layoutDrill(row?.drill))?1:25}
function layoutLevel(row){return Math.max(1,Math.min(5,Math.trunc(Number(row?.level)||1)))}
function layoutForgedLevelData(row){return layoutCelestial?.levels?.find(x=>x.level===layoutLevel(row))||layoutCelestial?.levels?.[0]||null}
function rowOilBase(d,row){if(isLayoutForged(d)){const level=layoutForgedLevelData(row);return Number(level?.production?.[Number(row.tier)||0])||0}if(d.special==="heart")return Math.max(0,Number($("#layoutLikes")?.value)||0);if(d.special==="hacker")return Math.max(0,Number(row.hacker)||550);return Number(d.oil)||0}
function clonePlotRows(rows){return rows.map(r=>{const copy={drill:r.drill,tier:Number(r.tier)||0,level:layoutLevel(r),count:Math.max(1,Math.min(layoutRowLimit(r),Math.floor(Number(r.count)||1))),hacker:Math.max(0,Number(r.hacker)||550)};if(isLayoutForged(layoutDrill(copy.drill)))copy.count=1;return copy})}
function updateCopyUI(){const has=Array.isArray(layoutCopiedRows);const allEmpty=$("#layoutPasteEmpty");if(allEmpty)allEmpty.disabled=!has;const status=$("#layoutCopyStatus");if(status)status.textContent=has?`Plot copied • ${layoutCopiedRows.length} drill row${layoutCopiedRows.length===1?"":"s"}`:"Copy a plot to reuse its drill setup.";$$('[data-paste]').forEach(b=>b.disabled=!has)}
function rowTierMult(row){return TIER_OPTIONS[Number(row.tier)||0]?.mult||1}
function pieceList(plot){
  const pieces=[];let ones=0,area=0;
  for(const row of plot.rows){const d=layoutDrill(row.drill);if(!d)continue;const count=isLayoutForged(d)?1:Math.max(0,Math.floor(Number(row.count)||0));const [w,h]=fpSize(d.footprint);area+=w*h*count;if(w===1&&h===1){ones+=count;continue}for(let i=0;i<count;i++)pieces.push([w,h])}
  pieces.sort((a,b)=>(b[0]*b[1])-(a[0]*a[1])||Math.max(b[0],b[1])-Math.max(a[0],a[1]));
  return {pieces,ones,area};
}
function canPack5x5(plot){
  const {pieces,ones,area}=pieceList(plot);if(area>25)return false;if(!pieces.length)return ones<=25;
  const grid=Array(25).fill(false);
  function fits(w,h,x,y){if(x+w>5||y+h>5)return false;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;return true}
  function setp(w,h,x,y,v){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=v}
  const memo=new Set();
  function dfs(i){
    if(i===pieces.length)return grid.filter(v=>!v).length>=ones;
    const key=i+":"+grid.map(v=>v?1:0).join("");if(memo.has(key))return false;
    const [a,b]=pieces[i],orients=a===b?[[a,b]]:[[a,b],[b,a]];
    for(const [w,h] of orients){for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){if(!fits(w,h,x,y))continue;setp(w,h,x,y,true);if(dfs(i+1))return true;setp(w,h,x,y,false)}}
    memo.add(key);return false;
  }
  return dfs(0);
}
function layoutPetMult(d){const ml=Math.max(0,Math.min(100,Number($("#layoutMole")?.value)||0)),fl=Math.max(0,Math.min(100,Number($("#layoutFruit")?.value)||0));const mole=ml?petValue(pets.find(p=>p.id==="mole"),ml)/100:0,fruit=(d.id==="banana"&&fl)?petValue(pets.find(p=>p.id==="fruit"),fl)/100:0;return(1+mole)*(1+fruit)}
function plotStats(plot,t=0){let staticRate=0,clockGrowth=0;for(const row of plot.rows){const d=layoutDrill(row.drill);if(!d)continue;const count=isLayoutForged(d)?1:Math.max(0,Math.floor(Number(row.count)||0));const tierMult=isLayoutForged(d)?1:rowTierMult(row);const mult=tierMult*plot.mult*count*layoutPetMult(d)*layoutLobbyMult*layoutRebirthMultiplier();if(d.special==="clock")clockGrowth+=mult;else staticRate+=rowOilBase(d,row)*mult}return{rate:staticRate+clockGrowth*(Math.floor(t)+1),staticRate,clockGrowth}}
function totalOilForSeconds(staticRate,clockGrowth,seconds){const s=Math.max(0,Math.floor(seconds));return staticRate*s+clockGrowth*s*(s+1)/2}
function timeForTarget(staticRate,clockGrowth,target){
  if(target<=0)return 0;if(staticRate<=0&&clockGrowth<=0)return Infinity;
  if(clockGrowth<=0)return target/staticRate;
  // g*s^2 + (g+2r)*s - 2T = 0
  const b=clockGrowth+2*staticRate;const root=Math.sqrt(b*b+8*clockGrowth*target);return Math.max(0,(4*target)/(root+b));
}
function timeText(sec){if(!Number.isFinite(sec))return "—";let s=Math.ceil(sec);const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);s%=60;return [d?`${d}d`:"",h?`${h}h`:"",m?`${m}m`:"",`${s}s`].filter(Boolean).join(" ")}
function drillOptions(selected){const regular=drills.map(d=>`<option value="${d.id}" ${d.id===selected?"selected":""}>${d.name} • ${d.footprint}</option>`);if(layoutCelestial)regular.push(`<option value="${layoutCelestial.id}" ${layoutCelestial.id===selected?"selected":""}>${layoutCelestial.name} • ${layoutCelestial.footprint}</option>`);return regular.join("")}
function tierOptions(selected,d){if(isLayoutForged(d))return layoutForgedTiers.map((name,i)=>`<option value="${i}" ${i===selected?"selected":""}>${name}</option>`).join("");return TIER_OPTIONS.map((t,i)=>`<option value="${i}" ${i===selected?"selected":""}>${t.name} ×${t.mult}</option>`).join("")}
function forgedLevelOptions(row){return (layoutCelestial?.levels||[]).map(level=>`<option value="${level.level}" ${level.level===layoutLevel(row)?"selected":""}>Level ${level.level}</option>`).join("")}
function renderLayout(){
  const host=$("#layoutAreas");
  const existing=$$(".area-group",host),hadExisting=existing.length>0;
  const openAreas=new Set(existing.filter(d=>d.open).map(d=>d.dataset.area));
  host.innerHTML=LAYOUT_AREAS.map((area,ai)=>{
    const plots=layoutPlots.filter(p=>p.area===area.id);
    const isOpen=hadExisting?openAreas.has(area.id):ai<2;
    return `<details class="area-group" data-area="${area.id}" ${isOpen?"open":""}><summary><span>${area.name}</span><span class="area-summary-meta"><span>${area.plots} Plot${area.plots>1?"s":""}</span><span class="area-mult">×${area.mult}</span></span></summary><div class="area-plots">${plots.map(plotHtml).join("")}</div></details>`
  }).join("");
  bindLayoutUI();calcLayout();
}
function plotHtml(plot){
  const used=pieceList(plot).area,ok=canPack5x5(plot),st=plotStats(plot,0);
  return `<div class="plot-card" data-plot="${plot.id}"><div class="plot-head"><div class="plot-title"><span>Plot ${plot.index}</span><span class="area-mult">×${plot.mult}</span></div><span class="plot-status ${ok?"ok":"bad"}">${ok?`${used} / 25 cells`:`Doesn't fit`}</span></div><div class="plot-rows">${plot.rows.map((r,i)=>rowHtml(plot,r,i)).join("")}</div><button class="plot-add" data-add="${plot.id}">+ Add Drill</button><div class="plot-actions"><button class="plot-action" data-copy="${plot.id}" type="button">Copy Plot</button><button class="plot-action" data-paste="${plot.id}" type="button" ${layoutCopiedRows?"":"disabled"}>Paste</button></div><div class="plot-foot"><span>Current production</span><strong>${ok?fmt(st.rate)+"/s":"—"}</strong></div></div>`
}
function rowHtml(plot,row,i){const d=layoutDrill(row.drill)||drills[0];const forged=isLayoutForged(d),extra=d.special==="hacker"||forged,limit=forged?1:25;if(forged)row.count=1;const level=forged?layoutForgedLevelData(row):null;const extraHtml=d.special==="hacker"?`<input data-hacker inputmode="numeric" value="${row.hacker||550}" placeholder="550"><span class="labels"><small>Hacker Oil/s (default avg 550)</small></span>`:forged?`<select data-forgedlevel aria-label="Celestial level">${forgedLevelOptions(row)}</select><span class="labels"><small>${level?`Level ${level.level} • ${level.cost}${level.costLabel?` • ${level.costLabel}`:""}`:""}</small></span>`:"";return `<div class="plot-row" data-row="${i}"><select data-rowdrill>${drillOptions(row.drill)}</select><select data-rowtier>${tierOptions(Number(row.tier)||0,d)}</select><input data-rowcount type="number" min="1" max="${limit}" value="${forged?1:row.count}" ${forged?"disabled":""}><button class="plot-remove" data-remove title="Remove">×</button><div class="plot-extra ${extra?"show":""}">${extraHtml}</div></div>`}
function refreshPlotRows(card,p){
  card.querySelector(".plot-rows").innerHTML=p.rows.map((r,i)=>rowHtml(p,r,i)).join("");
  bindPlotRows(card,p);
}
function refreshRowExtra(rowEl,row,card,p){
  refreshPlotRows(card,p);
}
function bindPlotRows(card,p){
  card.querySelectorAll(".plot-row").forEach(rowEl=>{
    const i=+rowEl.dataset.row,row=p.rows[i];if(!row)return;
    rowEl.querySelector("[data-rowdrill]").onchange=e=>{row.drill=e.target.value;row.tier=0;row.level=1;if(isLayoutForged(layoutDrill(row.drill)))row.count=1;refreshPlotRows(card,p);updatePlotCard(card,p)};
    rowEl.querySelector("[data-rowtier]").onchange=e=>{row.tier=+e.target.value;updatePlotCard(card,p)};
    const count=rowEl.querySelector("[data-rowcount]");if(count&&!count.disabled)count.oninput=e=>{row.count=Math.max(1,Math.min(layoutRowLimit(row),Math.floor(+e.target.value||1)));updatePlotCard(card,p)};
    rowEl.querySelector("[data-remove]").onclick=()=>{p.rows.splice(i,1);refreshPlotRows(card,p);updatePlotCard(card,p)};
    const hacker=rowEl.querySelector("[data-hacker]");if(hacker)hacker.oninput=e=>{row.hacker=Math.max(0,+e.target.value||550);updatePlotCard(card,p)};
    const level=rowEl.querySelector("[data-forgedlevel]");if(level)level.onchange=e=>{row.level=layoutLevel({level:e.target.value});refreshPlotRows(card,p);updatePlotCard(card,p)};
  });
}
function bindLayoutUI(){
  $$("[data-add]").forEach(b=>b.onclick=()=>{
    const p=layoutPlots.find(x=>x.id===b.dataset.add),card=b.closest(".plot-card");
    p.rows.push({drill:"demonic",tier:0,level:1,count:1,hacker:550});
    refreshPlotRows(card,p);updatePlotCard(card,p);
  });
  $$("[data-copy]").forEach(b=>b.onclick=()=>{
    const p=layoutPlots.find(x=>x.id===b.dataset.copy);
    layoutCopiedRows=clonePlotRows(p.rows);updateCopyUI();
    const old=b.textContent;b.textContent="Copied";setTimeout(()=>{if(document.body.contains(b))b.textContent=old},900);
  });
  $$("[data-paste]").forEach(b=>b.onclick=()=>{
    if(!layoutCopiedRows)return;const p=layoutPlots.find(x=>x.id===b.dataset.paste),card=b.closest(".plot-card");
    p.rows=clonePlotRows(layoutCopiedRows);refreshPlotRows(card,p);updatePlotCard(card,p);
  });
  $$(".plot-card").forEach(card=>{const p=layoutPlots.find(x=>x.id===card.dataset.plot);bindPlotRows(card,p)});
  updateCopyUI();
}
function updatePlotCard(card,p){const used=pieceList(p).area,ok=canPack5x5(p),st=plotStats(p,0),status=card.querySelector(".plot-status");status.className="plot-status "+(ok?"ok":"bad");status.textContent=ok?`${used} / 25 cells`:`Doesn't fit`;card.querySelector(".plot-foot strong").textContent=ok?rateFmt(st.rate)+"/s":"—";calcLayout()}
function calcLayout(){syncLayoutRebirthUI();let staticRate=0,clockGrowth=0,cells=0,usedPlots=0,valid=true;for(const p of layoutPlots){const info=pieceList(p);if(info.area>0)usedPlots++;cells+=Math.min(info.area,25);if(!canPack5x5(p)){valid=false;continue}const st=plotStats(p,0);staticRate+=st.staticRate;clockGrowth+=st.clockGrowth}$("#layoutError").classList.toggle("show",!valid);$("#layoutPlotsUsed").textContent=`${usedPlots} / 15`;$("#layoutCellsUsed").textContent=`${cells} / 375`;$("#layoutLobbyMult").textContent=`×${layoutLobbyMult}`;const target=finiteNonNegative($("#layoutTarget").value)*layoutTargetUnit;$("#layoutTargetDisplay").textContent=fmt(target);if(!valid){["#layoutNowRate","#layoutHourRate","#layoutHourOil","#layoutTargetTime","#layoutTimeStart","#layoutTimeEnd","#layoutTimeOil"].forEach(id=>$(id).textContent="—");return}const now=staticRate+clockGrowth,after=staticRate+clockGrowth*3601,hour=totalOilForSeconds(staticRate,clockGrowth,3600),hours=finiteNonNegative($("#layoutHours").value),seconds=hours*3600,end=staticRate+clockGrowth*(Math.floor(seconds)+1),oil=totalOilForSeconds(staticRate,clockGrowth,seconds);$("#layoutNowRate").textContent=rateFmt(now)+"/s";$("#layoutHourRate").textContent=rateFmt(after)+"/s";$("#layoutHourOil").textContent=fmt(hour);$("#layoutTimeStart").textContent=rateFmt(now)+"/s";$("#layoutTimeEnd").textContent=rateFmt(end)+"/s";$("#layoutTimeOil").textContent=fmt(oil);$("#layoutTargetTime").textContent=timeText(timeForTarget(staticRate,clockGrowth,target))}
$("#layoutLikes").addEventListener("input",e=>{let v=Math.max(0,Math.floor(Number(e.target.value)||0));if(String(e.target.value)!==String(v))e.target.value=v;renderLayout()});
$("#layoutPasteEmpty").onclick=()=>{if(!layoutCopiedRows)return;let changed=0;for(const p of layoutPlots){if(p.rows.length===0){p.rows=clonePlotRows(layoutCopiedRows);changed++}}if(changed)renderLayout();const status=$("#layoutCopyStatus");if(status)status.textContent=changed?`Pasted to ${changed} empty plot${changed===1?"":"s"}`:"No empty plots to paste into."};
$("#layoutTarget").addEventListener("input",calcLayout);$("#layoutHours").addEventListener("input",calcLayout);["layoutMole","layoutFruit"].forEach(id=>{const el=$("#"+id);el.addEventListener("input",()=>{const n=Number(el.value);if(Number.isFinite(n))el.value=Math.max(0,Math.min(100,Math.trunc(n)));renderLayout()});el.addEventListener("blur",()=>{let n=Number(el.value);if(!Number.isFinite(n))n=0;el.value=Math.max(0,Math.min(100,Math.trunc(n)));renderLayout()})});$("#layoutTargetUnits").onclick=e=>{const b=e.target.closest("[data-layouttarget]");if(!b)return;layoutTargetUnit=Number(b.dataset.layouttarget);activate($("#layoutTargetUnits"),"layouttarget",b.dataset.layouttarget);calcLayout()};$("#layoutX2").onclick=e=>{const b=e.target.closest("[data-layoutx2]");if(!b)return;layoutLobbyMult=Number(b.dataset.layoutx2)||1;activate($("#layoutX2"),"layoutx2",b.dataset.layoutx2);renderLayout()};$("#layoutModeTabs").onclick=e=>{const b=e.target.closest("[data-layoutmode]");if(!b)return;activate($("#layoutModeTabs"),"layoutmode",b.dataset.layoutmode);const time=b.dataset.layoutmode==="time";$("#layoutTimePane").classList.toggle("active",time);$("#layoutTargetPane").classList.toggle("active",!time)};

function layoutShareData(){
  let staticRate=0,clockGrowth=0,valid=true,cells=0,usedPlots=0;
  const used=[];
  for(const p of layoutPlots){
    const info=pieceList(p);
    if(info.area<=0)continue;
    usedPlots++;cells+=Math.min(info.area,25);
    const ok=canPack5x5(p);if(!ok)valid=false;
    if(ok){const st=plotStats(p,0);staticRate+=st.staticRate;clockGrowth+=st.clockGrowth}
    const rows=p.rows.map(r=>{
      const d=layoutDrill(r.drill);
      if(!d)return "";
      const forged=isLayoutForged(d),tier=forged?(layoutForgedTiers[Number(r.tier)||0]||"Default"):(TIER_OPTIONS[Number(r.tier)||0]?.name||"Basic");
      if(forged){const level=layoutForgedLevelData(r);return `${d.name} • Level ${layoutLevel(r)} • ${tier}${level?` • ${level.cost}`:""}`}
      return `${d.name} ×${r.count} • ${tier}`;
    }).filter(Boolean);
    used.push({name:`${p.areaName} — Plot ${p.index}`,mult:p.mult,cells:info.area,ok,rows});
  }
  const now=valid?staticRate+clockGrowth:NaN;
  const hourRate=valid?staticRate+clockGrowth*3601:NaN;
  const hourOil=valid?totalOilForSeconds(staticRate,clockGrowth,3600):NaN;
  const hours=finiteNonNegative($("#layoutHours").value),seconds=hours*3600;
  const end=valid?staticRate+clockGrowth*(Math.floor(seconds)+1):NaN;
  const timedOil=valid?totalOilForSeconds(staticRate,clockGrowth,seconds):NaN;
  const target=finiteNonNegative($("#layoutTarget").value)*layoutTargetUnit;
  const targetTime=valid?timeText(timeForTarget(staticRate,clockGrowth,target)):"—";
  const mode=$("#layoutTimePane").classList.contains("active")?"time":"target";
  return {valid,used,usedPlots,cells,now,hourRate,hourOil,hours,end,timedOil,target,targetTime,mode};
}
$("#layoutShare").onclick=()=>{
  const d=layoutShareData();
  const mole=$("#layoutMole").value==="0"?"None":`Lv${$("#layoutMole").value}`;
  const fruit=$("#layoutFruit").value==="0"?"None":`Lv${$("#layoutFruit").value}`;
  const rebirth=layoutRebirthLevel(),rebirthBonus=layoutRebirthBonus();
  const heartLikes=Math.max(0,Number($("#layoutLikes").value)||0);
  const setup=`<div class="share-section"><div class="share-section-title">Layout Setup</div><div class="share-setup-grid"><div class="share-setup-item"><span>Mole</span><strong>${mole}</strong></div><div class="share-setup-item"><span>Fruit</span><strong>${fruit}</strong></div><div class="share-setup-item"><span>Rebirth</span><strong>${rebirth} • +${rebirthBonus}%</strong></div><div class="share-setup-item"><span>Heart Likes</span><strong>${fmt(heartLikes)}</strong></div><div class="share-setup-item"><span>Weekend Lobby</span><strong>×${layoutLobbyMult}</strong></div><div class="share-setup-item"><span>Plots Used</span><strong>${d.usedPlots} / 15</strong></div><div class="share-setup-item"><span>Cells Used</span><strong>${d.cells} / 375</strong></div></div></div>`;
  const results=d.valid?`<div class="share-section"><div class="share-section-title">Production</div><div class="share-line"><span>Current Oil/s</span><strong>${rateFmt(d.now)}/s</strong></div><div class="share-line"><span>After 1 Hour</span><strong>${rateFmt(d.hourRate)}/s</strong></div><div class="share-line"><span>Oil in 1 Hour</span><strong>${fmt(d.hourOil)}</strong></div>${d.mode==="time"?`<div class="share-line"><span>Run Time</span><strong>${fmt(d.hours)}h</strong></div><div class="share-line"><span>Oil/s at End</span><strong>${rateFmt(d.end)}/s</strong></div><div class="share-line"><span>Oil Gained</span><strong>${fmt(d.timedOil)}</strong></div>`:`<div class="share-line"><span>Target Oil</span><strong>${fmt(d.target)}</strong></div><div class="share-line"><span>Time Needed</span><strong>${d.targetTime}</strong></div>`}</div>`:`<div class="share-section"><div class="share-section-title">Production</div><div class="share-line"><span>Status</span><strong>Fix plots that do not fit</strong></div></div>`;
  const plots=d.used.length?`<div class="share-section"><div class="share-section-title">Used Plots</div><div class="share-layout-plots">${d.used.map(p=>`<div class="share-layout-plot"><div class="share-layout-plot-head"><span>${p.name}</span><strong>×${p.mult} • ${p.cells}/25</strong></div><div class="share-layout-plot-meta">${p.rows.join("<br>")}${p.ok?"":"<br>Doesn't fit"}</div></div>`).join("")}</div></div>`:"";
  const lines=[
    "Oil Layout",
    `Mole: ${mole}`,
    `Fruit: ${fruit}`,
    `Rebirth: ${rebirth} (+${rebirthBonus}% Production)`,
    `Heart Likes: ${fmt(heartLikes)}`,
    `Weekend Lobby: ×${layoutLobbyMult}`,
    `Plots Used: ${d.usedPlots}/15`,
    `Cells Used: ${d.cells}/375`,
    d.valid?`Current Oil/s: ${rateFmt(d.now)}/s`:"Layout has a plot that does not fit",
    d.valid?`After 1 Hour: ${fmt(d.hourRate)}/s`:"",
    d.valid?`Oil in 1 Hour: ${fmt(d.hourOil)}`:"",
    d.valid&&d.mode==="time"?`Run Time: ${fmt(d.hours)}h`:"",
    d.valid&&d.mode==="time"?`Oil/s at End: ${rateFmt(d.end)}/s`:"",
    d.valid&&d.mode==="time"?`Oil Gained: ${fmt(d.timedOil)}`:"",
    d.valid&&d.mode==="target"?`Target: ${fmt(d.target)}`:"",
    d.valid&&d.mode==="target"?`Time Needed: ${d.targetTime}`:""
  ].filter(Boolean);
  openSharePreview("Oil Layout",setup+results+plots,lines.join("\n"));
};
ensureLayoutRebirthControl();
$("#layoutRebirth")?.addEventListener("input",()=>{syncLayoutRebirthUI();renderLayout()});
$("#layoutRebirth")?.addEventListener("blur",()=>{syncLayoutRebirthUI();renderLayout()});
syncLayoutRebirthUI();
renderLayout();

document.documentElement.dataset.stotOilPage=STOT_CONFIG.version;