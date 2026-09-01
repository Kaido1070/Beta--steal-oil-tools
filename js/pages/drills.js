/* STOT Drills page runtime v5.68 — extracted from js/app.js */
/* drills */
const ds={id:"basic",tier:1,area:1,hacker:550};
const getDrill=()=>drills.find(d=>d.id===ds.id)||drills[0];
function calcDrill(){
  const d=getDrill(),count=Math.max(1,Math.floor(Number($("#drillCount").value)||1)),hours=Math.max(0,Number($("#drillHours").value)||0),seconds=hours*3600;
  let base=d.oil||0;
  if(d.special==="heart")base=Math.max(0,Number($("#likesInput").value)||0);
  if(d.special==="hacker")base=ds.hacker;
  const moleLevel=Math.max(0,Math.min(100,Math.floor(Number($("#moleLevel").value)||0)));
  const fruitLevel=Math.max(0,Math.min(100,Math.floor(Number($("#fruitLevel").value)||0)));
  const moleBonus=moleLevel>0 ? petValue(pets.find(p=>p.id==="mole"),moleLevel)/100 : 0;
  const fruitBonus=(d.id==="banana" && fruitLevel>0) ? petValue(pets.find(p=>p.id==="fruit"),fruitLevel)/100 : 0;
  const petMult=(1+moleBonus)*(1+fruitBonus);
  const mult=ds.tier*ds.area*count;
  let rate,total,perHour,label="Production Rate";
  if(d.special==="clock"){
    const sec=Math.floor(seconds),growth=mult*petMult;
    rate=growth*(sec+1);total=growth*sec*(sec+1)/2;perHour=hours?total/hours:0;label=`Rate After ${fmt(hours)}H`;base=1;
  }else{rate=base*mult*petMult;perHour=rate*3600;total=rate*seconds}
  $("#drillMainLabel").textContent=label;$("#drillMainRate").textContent=fmt(rate)+"/s";$("#drillPerHour").textContent=fmt(perHour);$("#drillTotal").textContent=fmt(total);$("#drillBase").textContent=fmt(base)+"/s";$("#drillMultiplier").textContent="×"+fmt(mult*petMult);
  $("#drillPickerBtn").textContent=d.name;
  $("#heartControl").classList.toggle("show",d.special==="heart");$("#hackerControl").classList.toggle("show",d.special==="hacker");
  $("#fruitLevelField").style.display=d.id==="banana"?"grid":"none";
}
$("#tierButtons").onclick=e=>{let b=e.target.closest("[data-tier]");if(!b)return;ds.tier=Number(b.dataset.tier);activate($("#tierButtons"),"tier",b.dataset.tier);calcDrill()};
$("#areaButtons").onclick=e=>{let b=e.target.closest("[data-area]");if(!b)return;ds.area=Number(b.dataset.area);activate($("#areaButtons"),"area",b.dataset.area);calcDrill()};
$("#drillTimes").onclick=e=>{let b=e.target.closest("[data-drilltime]");if(!b)return;$("#drillHours").value=b.dataset.drilltime;activate($("#drillTimes"),"drilltime",b.dataset.drilltime);calcDrill()};
$("#hackerButtons").onclick=e=>{let b=e.target.closest("[data-hacker]");if(!b)return;ds.hacker=Number(b.dataset.hacker);activate($("#hackerButtons"),"hacker",b.dataset.hacker);calcDrill()};
$("#moleLevels").onclick=e=>{let b=e.target.closest("[data-molelevel]");if(!b)return;$("#moleLevel").value=b.dataset.molelevel;activate($("#moleLevels"),"molelevel",b.dataset.molelevel);calcDrill()};
$("#fruitLevels").onclick=e=>{let b=e.target.closest("[data-fruitlevel]");if(!b)return;$("#fruitLevel").value=b.dataset.fruitlevel;activate($("#fruitLevels"),"fruitlevel",b.dataset.fruitlevel);calcDrill()};
$("#moleLevel").addEventListener("input",()=>{const v=Math.max(0,Math.min(100,Math.floor(Number($("#moleLevel").value)||0)));const match=[0,20,40,60,80,100].includes(v)?v:null;$("#moleLevels").querySelectorAll("button").forEach(b=>b.classList.toggle("active",match!==null&&Number(b.dataset.molelevel)===match));calcDrill()});
$("#fruitLevel").addEventListener("input",()=>{const v=Math.max(0,Math.min(100,Math.floor(Number($("#fruitLevel").value)||0)));const match=[0,20,40,60,80,100].includes(v)?v:null;$("#fruitLevels").querySelectorAll("button").forEach(b=>b.classList.toggle("active",match!==null&&Number(b.dataset.fruitlevel)===match));calcDrill()});
["#drillCount","#drillHours","#likesInput"].forEach(s=>$(s).addEventListener("input",calcDrill));

/* picker */
function renderPicker(){
  const q=$("#pickerSearch").value.trim().toLowerCase();
  $("#pickerList").innerHTML=drills.filter(d=>d.name.toLowerCase().includes(q)).map(d=>`
  <button class="pick-item ${d.id===ds.id?"selected":""}" data-pick="${d.id}">
    <span class="pick-mark">${d.image?`<img src="${d.image}" alt="${I18N.itemName(d)}">`:initials(I18N.itemName(d))}</span>
    <span class="pick-copy"><strong>${I18N.itemName(d)}</strong><small>${d.rarity} • ${catLabel(d.category)}</small></span>
    <span class="pick-rate">${d.oil==null?"Dynamic":fmt(d.oil)+"/s"}</span>
  </button>`).join("")
}
$("#drillPickerBtn").onclick=()=>{$("#pickerBackdrop").classList.add("show");$("#pickerSearch").value="";renderPicker();setTimeout(()=>$("#pickerSearch").focus(),80)};
$("#pickerClose").onclick=()=>$("#pickerBackdrop").classList.remove("show");
$("#pickerBackdrop").onclick=e=>{if(e.target===$("#pickerBackdrop"))$("#pickerBackdrop").classList.remove("show")};
$("#pickerSearch").oninput=renderPicker;
$("#pickerList").onclick=e=>{let b=e.target.closest("[data-pick]");if(!b)return;ds.id=b.dataset.pick;$("#pickerBackdrop").classList.remove("show");calcDrill()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#pickerBackdrop").classList.remove("show")});

/* Initial Drills render now belongs to this page module. */
calcDrill();
document.documentElement.dataset.stotDrillsPage="5.68";
