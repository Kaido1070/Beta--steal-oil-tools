/* STOT core runtime: game values live in js/game-data.js */
if(!window.STOT_GAME_DATA) throw new Error("STOT game data failed to load");
const {drills,pets,refineries,solarPanels,totems,decorations,lootboxes}=window.STOT_GAME_DATA;

const slugifyName=name=>name.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
pets.forEach(p=>{p.id=p.id||slugifyName(p.name);p.nameKey=`pets.${p.id}`});
drills.forEach(d=>{d.nameKey=`drills.${d.id}`});
refineries.forEach(x=>{x.id=x.id||slugifyName(x.name);x.nameKey=`refineries.${x.id}`});
solarPanels.forEach(x=>{x.id=x.id||slugifyName(x.name);x.nameKey=`solar.${x.id}`});
totems.forEach(x=>{x.id=x.id||slugifyName(x.name);x.nameKey=`totems.${x.id}`});
decorations.forEach(x=>{x.id=x.id||slugifyName(x.name);x.nameKey=`decorations.${x.id}`});
lootboxes.forEach(x=>{x.id=x.id||slugifyName(x.name);x.nameKey=`lootboxes.${x.id}`});

window.STOT_LOCALES=window.STOT_LOCALES||{};
window.STOT_LOCALES.en={
  "nav.sale":"Sale",
  "nav.oil":"Oil / Hour",
  "nav.drills":"Drills",
  "nav.compare":"Compare",
  "nav.database":"Database",
  "nav.events":"Events",
  "events.localTimes":"Times are shown in your local timezone",
  "compare.title":"Drill Compare"
};

const I18N={
  language:"en",
  setLanguage(lang){
    this.language=window.STOT_LOCALES?.[lang]?lang:"en";
    document.documentElement.lang=this.language;
    document.documentElement.dir=["ar","he","fa","ur"].includes(this.language)?"rtl":"ltr";
    document.querySelectorAll("[data-i18n]").forEach(el=>{const v=this.t(el.dataset.i18n);if(v)el.textContent=v});
  },
  t(key,fallback=""){return window.STOT_LOCALES?.[this.language]?.[key]??window.STOT_LOCALES?.en?.[key]??fallback},
  itemName(item){return this.t(item?.nameKey,item?.name||"")}
};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const trimZeros=s=>s.includes(".")?s.replace(/0+$/,"").replace(/\.$/,""):s;
const fmt=n=>{
  if(!Number.isFinite(n))return"—";
  const a=Math.abs(n),u=[["Dc",1e33],["No",1e30],["Oc",1e27],["Sp",1e24],["Sx",1e21],["Qi",1e18],["Qa",1e15],["T",1e12],["B",1e9],["M",1e6],["K",1e3]];
  for(const [s,v] of u)if(a>=v){let x=n/v;return trimZeros(Math.abs(x)>=100?x.toFixed(0):Math.abs(x)>=10?x.toFixed(1):x.toFixed(2))+s}
  return trimZeros(a>=100?n.toFixed(0):a>=10?n.toFixed(1):n.toFixed(2));
};
const rateFmt=n=>{
  if(!Number.isFinite(n))return"—";
  const a=Math.abs(n),u=[["Dc",1e33],["No",1e30],["Oc",1e27],["Sp",1e24],["Sx",1e21],["Qi",1e18],["Qa",1e15],["T",1e12],["B",1e9],["M",1e6],["K",1e3]];
  for(const [s,v] of u)if(a>=v){
    const x=n/v;
    return Number.isInteger(x) ? String(x)+s : String(x)+s;
  }
  return String(n);
};
const money=n=>"$"+fmt(n);
function activate(container,selector,value){
  container.querySelectorAll("button").forEach(b=>b.classList.toggle("active",String(b.dataset[selector])===String(value)));
}

/* shared numeric/share helpers used by Sale and Oil */
function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]))}
function finiteNonNegative(value){const n=Number(value);return Number.isFinite(n)&&n>0?n:0}
async function copyText(text,button,restore){try{await navigator.clipboard.writeText(text)}catch(e){const t=document.createElement("textarea");t.value=text;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove()}if(button){const old=restore||button.textContent;button.textContent="Copied";setTimeout(()=>button.textContent=old,1100)}}
let sharePreviewText="";
function openSharePreview(title,html,text){sharePreviewText=text;$("#sharePreviewTitle").textContent=title;$("#sharePreviewContent").innerHTML=html;$("#sharePreview").classList.add("open");$("#sharePreview").setAttribute("aria-hidden","false")}
function closeSharePreview(){$("#sharePreview").classList.remove("open");$("#sharePreview").setAttribute("aria-hidden","true")}
$("#sharePreviewClose").onclick=closeSharePreview;$("#sharePreviewDone").onclick=closeSharePreview;$("#sharePreview").onclick=e=>{if(e.target===$("#sharePreview"))closeSharePreview()};$("#sharePreviewCopy").onclick=()=>copyText(sharePreviewText,$("#sharePreviewCopy"),"Copy Summary");
let currentView="sale";
const HELP_UNITS=`<div class="help-units-inline"><strong>Number Units</strong><span><b>K</b> = Thousand · <b>M</b> = Million · <b>B</b> = Billion · <b>T</b> = Trillion</span></div>`;
const HELP_CONTENT={
 sale:`<section class="help-card"><h3>Sale Setup</h3><div class="help-item"><strong>Oil Amount</strong><span>Enter the amount of oil you want to sell, then choose its unit.</span></div><div class="help-item"><strong>Cash Boost</strong><span>Enter your current Cash Boost. 100% is the normal baseline.</span></div><div class="help-item"><strong>Friend Boost</strong><span>Choose the friend bonus active in your lobby.</span></div><div class="help-item"><strong>Sell Price</strong><span>Enter the current cash value for each Oil.</span></div></section><section class="help-card"><h3>Results</h3><div class="help-item"><strong>Sale Value</strong><span>Your estimated cash after the selected boosts.</span></div><div class="help-item"><strong>Cash per Oil</strong><span>How much cash each Oil is worth with your setup.</span></div><div class="help-item"><strong>Total Boost</strong><span>Cash Boost and Friend Boost combined.</span></div><div class="help-item"><strong>Share / Copy</strong><span>Preview the result or copy a short summary.</span></div></section>`,
 oil:`<section class="help-card"><h3>Oil Layout</h3><div class="help-item"><strong>Plots</strong><span>The layout has 15 fixed plots. Each plot is 5×5 with 25 cells.</span></div><div class="help-item"><strong>Add Drill</strong><span>Choose the drill, tier and count for that plot.</span></div><div class="help-item"><strong>Copy Plot</strong><span>Copies the full drill setup from that plot.</span></div><div class="help-item"><strong>Paste</strong><span>Replaces a plot with the copied setup.</span></div><div class="help-item"><strong>Paste to All Empty</strong><span>Fills every empty plot with the copied setup.</span></div><div class="help-item"><strong>Fit</strong><span>Drills can rotate, but they cannot cross into another plot.</span></div><div class="help-item"><strong>Area ×</strong><span>Each map area has its own production multiplier.</span></div></section><section class="help-card"><h3>Pet Boosts</h3><div class="help-item"><strong>Mole Level</strong><span>Enter any level from 0 to 100. Applies to all drills.</span></div><div class="help-item"><strong>Fruit Level</strong><span>Enter any level from 0 to 100. Only affects Banana Drill.</span></div><div class="help-item"><strong>Heart Drill Likes</strong><span>One Likes value is used exactly for every Heart Drill in the layout.</span></div><div class="help-item"><strong>Weekend x2</strong><span>Turn it on only while you are still in an x2 lobby.</span></div></section><section class="help-card"><h3>Oil Calculator</h3><div class="help-item"><strong>Time → Oil</strong><span>Enter Run Time to see how much oil the layout makes.</span></div><div class="help-item"><strong>Oil/s at Start</strong><span>Your production rate when the timer starts.</span></div><div class="help-item"><strong>Oil/s at End</strong><span>Your rate at the end of the selected time.</span></div><div class="help-item"><strong>Oil Gained</strong><span>Total oil made during that time.</span></div><div class="help-item"><strong>Oil → Time</strong><span>Enter Target Oil to see how long the layout needs to reach it.</span></div><div class="help-item"><strong>Clock Drill</strong><span>Its Oil/s grows every second. The calculator includes that growth automatically.</span></div></section><section class="help-card"><h3>Layout Summary</h3><div class="help-item"><strong>Current Oil / Second</strong><span>Your layout production right now.</span></div><div class="help-item"><strong>After 1 Hour</strong><span>Your Oil/s after one hour, including Clock Drill growth.</span></div><div class="help-item"><strong>Oil in 1 Hour</strong><span>Total oil produced during the next hour.</span></div><div class="help-item"><strong>Plots / Cells Used</strong><span>Shows how much of the full layout is being used.</span></div></section>`,
 drills:`<section class="help-card"><h3>Drill Setup</h3><div class="help-item"><strong>Drill</strong><span>Choose the drill you want to calculate.</span></div><div class="help-item"><strong>Drill Tier</strong><span>Choose Basic, Gold, Diamond, Rainbow or Galaxy.</span></div><div class="help-item"><strong>Production Area</strong><span>Choose the multiplier for the area where the drill is placed.</span></div><div class="help-item"><strong>Mole</strong><span>Enter the Mole level. Use 0 if you are not using it.</span></div><div class="help-item"><strong>Fruit</strong><span>Shown for Banana Drill and applies its Fruit bonus.</span></div><div class="help-item"><strong>Number of Drills</strong><span>How many identical drills you want to calculate together.</span></div><div class="help-item"><strong>Run Time</strong><span>How many hours the drills will run.</span></div></section><section class="help-card"><h3>Special Drills</h3><div class="help-item"><strong>Heart Drill</strong><span>Enter Current Likes. It makes 1 Oil/s per Like before multipliers.</span></div><div class="help-item"><strong>Hacker Drill</strong><span>Choose Min, Avg or Max rate because its production is random.</span></div><div class="help-item"><strong>Clock Drill</strong><span>Its Oil/s grows every second, so the result changes with Run Time.</span></div></section><section class="help-card"><h3>Results</h3><div class="help-item"><strong>Production Rate</strong><span>Current Oil/s for your full setup.</span></div><div class="help-item"><strong>Oil / Hour</strong><span>Production over one hour.</span></div><div class="help-item"><strong>Total Oil</strong><span>Total production for the selected Run Time.</span></div><div class="help-item"><strong>Combined Multiplier</strong><span>The multipliers currently applied to the drill.</span></div></section>`,
 compare:`<section class="help-card"><h3>Choose Drills</h3><div class="help-item"><strong>Drill A / Drill B</strong><span>Choose the two drills you want to compare.</span></div><div class="help-item"><strong>⇄</strong><span>Swaps Drill A and Drill B.</span></div></section><section class="help-card"><h3>Production Setup</h3><div class="help-item"><strong>Drill Tier</strong><span>The same tier is used for both drills.</span></div><div class="help-item"><strong>Production Area</strong><span>The same area multiplier is used for both drills.</span></div><div class="help-item"><strong>Mole Level</strong><span>Applies the Mole bonus to both drills.</span></div><div class="help-item"><strong>Fruit Level</strong><span>Only affects Banana Drill.</span></div><div class="help-item"><strong>Heart Drill Likes</strong><span>Appears when Heart Drill is selected.</span></div></section><section class="help-card"><h3>Counts & Time</h3><div class="help-item"><strong>Drill Counts</strong><span>Set a different amount for each drill.</span></div><div class="help-item"><strong>Comparison Time</strong><span>The same Run Time is used for both sides.</span></div><div class="help-item"><strong>Results</strong><span>Compare starting rate, rate after time, total oil and space used.</span></div><div class="help-item"><strong>Clock Drill</strong><span>Its growth over time is included automatically.</span></div></section>`,
 database:`<section class="help-card"><h3>Game Database</h3><div class="help-item"><strong>Categories</strong><span>Switch between Pets, Drills, Decorations, Solar, Refineries, Totems and Lootboxes.</span></div><div class="help-item"><strong>Search</strong><span>Type an item name to find it quickly.</span></div><div class="help-item"><strong>Filters</strong><span>Narrow the list by type, rarity or other available options.</span></div><div class="help-item"><strong>Sort</strong><span>Change the order when sorting is available.</span></div><div class="help-item"><strong>Item Card</strong><span>Tap a card to open its full details.</span></div></section><section class="help-card"><h3>Pets</h3><div class="help-item"><strong>Pet Bonus Checker</strong><span>Choose a pet and level to see its bonus at that level.</span></div><div class="help-item"><strong>Pet Level</strong><span>Use any level from 1 to 100.</span></div></section>`,
 events:`<section class="help-card"><h3>Events</h3><div class="help-item"><strong>Your Timezone</strong><span>All event times are converted to your local date and time.</span></div><div class="help-item"><strong>Next Event</strong><span>Shows the next event and its start time.</span></div><div class="help-item"><strong>Countdown</strong><span>Shows how long is left until that event starts.</span></div><div class="help-item"><strong>Event List</strong><span>Shows the upcoming times for each regular event.</span></div><div class="help-item"><strong>Admin Abuse</strong><span>Shows the weekend Admin Abuse times in your local time.</span></div></section>`,
 codes:`<section class="help-card"><h3>Codes</h3><div class="help-item"><strong>Search</strong><span>Search by code number or reward.</span></div><div class="help-item"><strong>Filters</strong><span>Show All, Cash, Gasoline, Energy or Item codes.</span></div><div class="help-item"><strong>Code Card</strong><span>Shows the code and what it gives you.</span></div><div class="help-item"><strong>Copy</strong><span>Copies the code so you can enter it in game.</span></div><div class="help-item"><strong>Badges</strong><span>Daily or expiry notes appear when a code has them.</span></div></section>`
};
const HELP_WITH_UNITS=new Set(["sale","oil","drills","compare"]);
function openHelpPreview(){
  $("#helpTitle").textContent=`${viewBadges[currentView]||"How It Works"} — Help`;
  $("#helpContent").innerHTML=(HELP_WITH_UNITS.has(currentView)?HELP_UNITS:"")+(HELP_CONTENT[currentView]||"");
  $("#helpPreview").classList.add("open");$("#helpPreview").setAttribute("aria-hidden","false");
  $("#helpPreview .help-sheet").scrollTop=0;
}
$("#helpBtn").onclick=openHelpPreview;
function closeHelpPreview(){$("#helpPreview").classList.remove("open");$("#helpPreview").setAttribute("aria-hidden","true")}
$("#helpClose").onclick=closeHelpPreview;
$("#helpPreview").onclick=e=>{if(e.target===$("#helpPreview"))closeHelpPreview()};

/* shared drill/catalog helpers */
function catLabel(c){return c==="regular"?"Regular Shop":c==="event"?"Event":"Special & Legacy"}
function petValue(p,level){
  const l=Math.max(1,Math.min(100,Math.floor(Number(level)||1)));
  return p.min+((p.max-p.min)*(l-1)/99);
}
function petValueText(p,level){
  const v=petValue(p,level);
  if(p.kind==="percent") return "+"+fmt(v)+"%";
  if(p.kind==="percentMinus") return "-"+fmt(v)+"%";
  if(p.kind==="multiplier") return "×"+(Math.round(v*100)/100).toFixed(2).replace(/0+$/,"").replace(/\.$/,"");
  return fmt(v)+" "+p.unit;
}
function rarityRank(r){return ({Common:1,Rare:2,Legendary:3,Mythical:4,Divine:5,Special:6})[r]||99}

/* shared visual helper used by Compare and Database */
function initials(name){return name.split(/\s+/).filter(x=>!["Drill","Refinery","Panel","Totem","Lootbox","Station","Turbine"].includes(x)).slice(0,2).map(x=>x[0]).join("").toUpperCase()||name.slice(0,2).toUpperCase()}

const viewBadges={sale:"Sale Calculator",oil:"Oil Layout",drills:"Drill Calculator",compare:"Drill Compare",database:"Game Database",events:"Events",codes:"Codes"};
function openView(key){
  currentView=key;
  $$(".tabs button").forEach(x=>x.classList.toggle("active",x.dataset.view===key));
  $$(".view").forEach(v=>v.classList.remove("active"));
  const view=$("#"+key+"View"); if(view)view.classList.add("active");
  $("#badge").textContent=viewBadges[key]||"Community Tools";
  if(key==="database")renderActiveDatabasePane();
  if(key==="compare")renderCompare();
  if(key==="events")renderEvents();
  if(key==="codes")renderCodes();
}
$$('.tabs button').forEach(b=>b.onclick=()=>openView(b.dataset.view));

I18N.setLanguage("en");

