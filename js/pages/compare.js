/* STOT Drill Compare page runtime — version from js/site-config.js — extracted from js/app.js  */
let compareA="demonic",compareB="angel";
const compareState={tier:1,area:1,mole:0,fruit:0,countA:1,countB:1,hours:5,likes:0};
function compareValue(d,key){
  if(key==="oil")return d.oil==null?"Dynamic":fmt(d.oil)+"/s";
  if(key==="price")return d.cash||d.eventPrice||"—";
  if(key==="vbucks")return d.vbucks||"—";
  if(key==="source")return catLabel(d.category);
  return d[key]??"—";
}
function compareVisual(d){
  const img=d.image?`<img src="${d.image}" alt="${I18N.itemName(d)}" loading="lazy">`:initials(I18N.itemName(d));
  return `<div class="compare-logo">${img}</div>`;
}
function comparePetMultiplier(d){
  const mole=compareState.mole>0?petValue(pets.find(p=>p.id==="mole"),compareState.mole)/100:0;
  const fruit=(d.id==="banana"&&compareState.fruit>0)?petValue(pets.find(p=>p.id==="fruit"),compareState.fruit)/100:0;
  return (1+mole)*(1+fruit);
}
function compareBase(d){
  if(d.special==="heart")return Math.max(0,compareState.likes||0);
  if(d.special==="hacker")return 550;
  if(d.special==="clock")return 1;
  return Math.max(0,Number(d.oil)||0);
}
function compareStats(d,side){
  const count=Math.max(1,Math.floor(compareState[side==="A"?"countA":"countB"]||1));
  const hours=Math.max(0,Math.min(20,compareState.hours||0));
  const seconds=Math.floor(hours*3600);
  const setup=compareState.tier*compareState.area*count*comparePetMultiplier(d);
  const base=compareBase(d);
  if(d.special==="clock"){
    const start=setup;
    const end=setup*(seconds+1);
    const total=setup*seconds*(seconds+1)/2;
    return {base,start,end,total,seconds,dynamic:true,setup,count};
  }
  const rate=base*setup;
  return {base,start:rate,end:rate,total:rate*seconds,seconds,dynamic:false,setup,count};
}
function compareCard(d,label,stats){
  const endLabel=stats.seconds?`AFTER ${fmt(stats.seconds/3600)}H`:"CURRENT";
  return `<article class="panel compare-card">
    <div class="compare-side-label">${label}</div>
    ${compareVisual(d)}
    <h3>${I18N.itemName(d)}</h3>
    <div class="meta compare-meta"><span class="pill">${d.rarity}</span><span class="pill">${catLabel(d.category)}</span></div>
    <div class="compare-rate">${fmt(stats.end)}/s<small>${endLabel}</small></div>
    <div class="compare-card-stats">
      <div class="compare-card-stat"><span>START</span><strong>${fmt(stats.start)}/s</strong></div>
      <div class="compare-card-stat"><span>TOTAL</span><strong>${fmt(stats.total)}</strong></div>
    </div>
  </article>`;
}
function durationText(seconds){
  seconds=Math.max(0,Math.floor(seconds));
  const d=Math.floor(seconds/86400),h=Math.floor((seconds%86400)/3600),m=Math.floor((seconds%3600)/60),s=seconds%60;
  return [d?`${d}d`:"",h?`${h}h`:"",m?`${m}m`:"",(!d&&!h&&s)?`${s}s`:""].filter(Boolean).join(" ")||"0s";
}
function crossoverText(a,b,sa,sb){
  const aClock=a.special==="clock",bClock=b.special==="clock";
  if(!aClock&&!bClock)return "";
  if(aClock&&bClock)return sa.setup===sb.setup?"Both Clock Drills grow at the same rate with this setup.":`${sa.setup>sb.setup?I18N.itemName(a):I18N.itemName(b)} stays ahead because both Clock Drills grow linearly.`;
  const clock=aClock?a:b,other=aClock?b:a,sc=aClock?sa:sb,so=aClock?sb:sa;
  if(sc.start>so.start)return `${I18N.itemName(clock)} starts ahead of ${I18N.itemName(other)} with this setup.`;
  if(sc.setup<=0)return "";
  const cross=Math.floor(so.start/sc.setup);
  if(cross<=0)return `${I18N.itemName(clock)} starts level with ${I18N.itemName(other)} and pulls ahead almost immediately.`;
  const within=cross<=sc.seconds;
  return `${I18N.itemName(clock)} surpasses ${I18N.itemName(other)} after ${durationText(cross)}${within?"":" • after the selected run time"}.`;
}
function compareSpace(d,count){
  const raw=String(d.footprint||"").toLowerCase().replace(/\s/g,"");
  const m=raw.match(/^([0-9.]+)x([0-9.]+)$/);
  if(!m)return `${count} × ${d.footprint||"—"}`;
  const each=Number(m[1])*Number(m[2]),total=each*count;
  return `${count} × ${d.footprint} • ${fmt(total)} cell${total===1?"":"s"}`;
}
function renderCompare(){
  const a=drills.find(d=>d.id===compareA)||drills[0],b=drills.find(d=>d.id===compareB)||drills[1];
  $("#compareA").innerHTML=drills.map(d=>`<option value="${d.id}" ${d.id===a.id?"selected":""}>${I18N.itemName(d)}</option>`).join("");
  $("#compareB").innerHTML=drills.map(d=>`<option value="${d.id}" ${d.id===b.id?"selected":""}>${I18N.itemName(d)}</option>`).join("");
  $("#compareHeartField").classList.toggle("show",a.special==="heart"||b.special==="heart");
  const sa=compareStats(a,"A"),sb=compareStats(b,"B");
  $("#compareCards").innerHTML=compareCard(a,"DRILL A",sa)+`<div class="compare-vs">VS</div>`+compareCard(b,"DRILL B",sb);
  const rows=[
    ["Start Oil/s",fmt(sa.start)+"/s",fmt(sb.start)+"/s"],
    [`Oil/s After ${fmt(compareState.hours)}H`,fmt(sa.end)+"/s",fmt(sb.end)+"/s"],
    [`Total Oil • ${fmt(compareState.hours)}H`,fmt(sa.total),fmt(sb.total)],
    ["Base Oil/s",a.special==="clock"?"+1/s each sec":a.special==="heart"?fmt(sa.base)+"/s (Likes)":a.special==="hacker"?"550/s avg":fmt(sa.base)+"/s",b.special==="clock"?"+1/s each sec":b.special==="heart"?fmt(sb.base)+"/s (Likes)":b.special==="hacker"?"550/s avg":fmt(sb.base)+"/s"],
    ["Rarity",a.rarity,b.rarity],
    ["Source",compareValue(a,"source"),compareValue(b,"source")],
    ["Footprint",a.footprint,b.footprint],
    ["Total Space",compareSpace(a,sa.count),compareSpace(b,sb.count)]
  ];
  $("#compareTable").innerHTML=rows.map(r=>`<div class="compare-row"><strong>${r[1]}</strong><span>${r[0]}</span><strong>${r[2]}</strong></div>`).join("");
  let insight=crossoverText(a,b,sa,sb);
  if(!insight){
    if(sa.total===sb.total)insight="Both drills produce the same total oil with this setup.";
    else{
      const high=sa.total>sb.total?a:b,low=sa.total>sb.total?b:a,highStats=sa.total>sb.total?sa:sb,lowStats=sa.total>sb.total?sb:sa;
      const pct=lowStats.total>0?((highStats.total/lowStats.total-1)*100):0;
      insight=`${I18N.itemName(high)} produces ${fmt(pct)}% more total oil over ${fmt(compareState.hours)}h with this setup.`;
    }
  }
  $("#compareInsight").innerHTML=`<strong>Result:</strong> ${insight}`;
}
$("#compareA").addEventListener("change",e=>{compareA=e.target.value;renderCompare()});
$("#compareB").addEventListener("change",e=>{compareB=e.target.value;renderCompare()});
$("#swapCompare").onclick=()=>{[compareA,compareB]=[compareB,compareA];renderCompare()};
[["#compareTier","tier"],["#compareArea","area"]].forEach(([sel,key])=>$(sel).addEventListener("change",e=>{compareState[key]=Number(e.target.value)||0;renderCompare()}));
[["#compareMole","mole"],["#compareFruit","fruit"]].forEach(([sel,key])=>$(sel).addEventListener("input",e=>{let raw=Number(e.target.value);if(!Number.isFinite(raw))raw=0;let v=Math.round(raw);v=Math.max(0,Math.min(100,v));compareState[key]=v;if(String(e.target.value)!==String(v))e.target.value=v;renderCompare()}));
[["#compareCountA","countA"],["#compareCountB","countB"],["#compareHours","hours"],["#compareLikes","likes"]].forEach(([sel,key])=>$(sel).addEventListener("input",e=>{let raw=Number(e.target.value);if(!Number.isFinite(raw))raw=0;let v=Math.max(0,raw);if(key==="countA"||key==="countB")v=Math.max(1,Math.floor(v));if(key==="hours")v=Math.min(20,v);compareState[key]=v;if(String(e.target.value)!==String(v))e.target.value=v;renderCompare()}));
$("#compareShare").onclick=()=>{const a=drills.find(d=>d.id===compareA)||drills[0],b=drills.find(d=>d.id===compareB)||drills[1];const sa=compareStats(a,"A"),sb=compareStats(b,"B");const tierName={1:"Basic",2:"Gold",3:"Diamond",5:"Rainbow",10:"Galaxy"}[compareState.tier]||`×${compareState.tier}`;const crossover=crossoverText(a,b,sa,sb);const lines=["Drill Compare",`${I18N.itemName(a)} ×${sa.count} vs ${I18N.itemName(b)} ×${sb.count}`,`Tier: ${tierName}`,`Production Area: ×${compareState.area}`,`Mole: ${compareState.mole||"None"}`,`Fruit: ${compareState.fruit||"None"}`,`Run Time: ${fmt(compareState.hours)}h`,`${I18N.itemName(a)} — Start ${fmt(sa.start)}/s • End ${fmt(sa.end)}/s • Total ${fmt(sa.total)} • Space ${compareSpace(a,sa.count)}`,`${I18N.itemName(b)} — Start ${fmt(sb.start)}/s • End ${fmt(sb.end)}/s • Total ${fmt(sb.total)} • Space ${compareSpace(b,sb.count)}`,crossover?`Crossover: ${crossover}`:""] .filter(Boolean);const html=`<div class="share-section"><div class="share-section-title">Comparison Setup</div><div class="share-setup-grid"><div class="share-setup-item"><span>Drill Tier</span><strong>${tierName}</strong></div><div class="share-setup-item"><span>Production Area</span><strong>×${compareState.area}</strong></div><div class="share-setup-item"><span>Mole</span><strong>${compareState.mole||"None"}</strong></div><div class="share-setup-item"><span>Fruit</span><strong>${compareState.fruit||"None"}</strong></div><div class="share-setup-item"><span>Run Time</span><strong>${fmt(compareState.hours)}h</strong></div></div></div><div class="share-drill-columns"><div class="share-drill-card"><div class="share-drill-title">${I18N.itemName(a)} ×${sa.count}</div><div class="share-line"><span>Start Oil/s</span><strong>${fmt(sa.start)}/s</strong></div><div class="share-line"><span>After Time</span><strong>${fmt(sa.end)}/s</strong></div><div class="share-line"><span>Total Oil</span><strong>${fmt(sa.total)}</strong></div><div class="share-line"><span>Total Space</span><strong>${compareSpace(a,sa.count)}</strong></div></div><div class="share-drill-card"><div class="share-drill-title">${I18N.itemName(b)} ×${sb.count}</div><div class="share-line"><span>Start Oil/s</span><strong>${fmt(sb.start)}/s</strong></div><div class="share-line"><span>After Time</span><strong>${fmt(sb.end)}/s</strong></div><div class="share-line"><span>Total Oil</span><strong>${fmt(sb.total)}</strong></div><div class="share-line"><span>Total Space</span><strong>${compareSpace(b,sb.count)}</strong></div></div></div>${crossover?`<div class="share-section share-crossover"><strong>${crossover}</strong></div>`:""}`;openSharePreview("Drill Comparison",html,lines.join("\n"))};

/* Initial Drill Compare render now belongs to this page module. */
renderCompare();
document.documentElement.dataset.stotComparePage=STOT_CONFIG.version;
