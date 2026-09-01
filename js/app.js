const drills=[
{id:"basic",name:"Basic Drill",category:"regular",rarity:"Common",oil:1,cash:"$500",vbucks:"50",footprint:"1x1"},
{id:"strong",name:"Strong Drill",category:"regular",rarity:"Common",oil:3,cash:"$1.8K",vbucks:"100",footprint:"1x1"},
{id:"enhanced",name:"Enhanced Drill",category:"regular",rarity:"Common",oil:4,cash:"$3.6K",vbucks:"150",footprint:"1x1"},
{id:"speed",name:"Speed Drill",category:"regular",rarity:"Common",oil:6,cash:"$7.2K",vbucks:"200",footprint:"1x1"},
{id:"reinforced",name:"Reinforced Drill",category:"regular",rarity:"Uncommon",oil:8,cash:"$12K",vbucks:"250",footprint:"1x1"},
{id:"industrial",name:"Industrial Drill",category:"regular",rarity:"Uncommon",oil:10,cash:"$20K",vbucks:"300",footprint:"1x1"},
{id:"double-industrial",name:"Double Industrial Drill",category:"regular",rarity:"Uncommon",oil:12,cash:"$30K",vbucks:"350",footprint:"2x1"},
{id:"turbo",name:"Turbo Drill",category:"regular",rarity:"Rare",oil:16,cash:"$80K",vbucks:"400",footprint:"1x1"},
{id:"mega",name:"Mega Drill",category:"regular",rarity:"Rare",oil:20,cash:"$140K",vbucks:"450",footprint:"1x1"},
{id:"ice",name:"Ice Drill",category:"regular",rarity:"Rare",oil:25,cash:"$400K",vbucks:"500",footprint:"1x1"},
{id:"lava",name:"Lava Drill",category:"regular",rarity:"Legendary",oil:35,cash:"$1.22M",vbucks:"550",footprint:"1x1"},
{id:"rocket",name:"Rocket Drill",category:"regular",rarity:"Legendary",oil:50,cash:"$4.5M",vbucks:"650",footprint:"1x1"},
{id:"mega-laser",name:"Mega Laser Drill",category:"regular",rarity:"Legendary",oil:220,cash:"$40M",vbucks:"700",footprint:"2x2"},
{id:"scifi-double",name:"Scifi Double Drill",category:"regular",rarity:"Mythical",oil:275,cash:"$95M",vbucks:"800",footprint:"2x1"},
{id:"scifi-quad",name:"Scifi Quad Drill",category:"regular",rarity:"Mythical",oil:350,cash:"$280M",vbucks:"850",footprint:"2x2"},
{id:"lunar",name:"Lunar Drill",category:"regular",rarity:"Mythical",oil:600,cash:"$900M",vbucks:"950",footprint:"2x2"},
{id:"alien-tech",name:"Alien Tech Drill",category:"regular",rarity:"Mythical",oil:800,cash:"$2.4B",vbucks:"1K",footprint:"2x2"},
{id:"ufo",name:"UFO Drill",category:"regular",rarity:"Mythical",oil:1500,cash:"$9B",vbucks:"1.1K",footprint:"2x2"},
{id:"solar",name:"Solar Drill",category:"regular",rarity:"Divine",oil:2750,cash:"$27.5B",vbucks:"1.15K",footprint:"2x2"},
{id:"antimatter",name:"Antimatter Drill",category:"regular",rarity:"Divine",oil:4500,cash:"$85.5B",vbucks:"1.3K",footprint:"2x2"},
{id:"black-hole",name:"Black Hole Drill",category:"regular",rarity:"Divine",oil:7500,cash:"$187.5B",vbucks:"1.45K",footprint:"2x2"},
{id:"angel",name:"Angel Drill",category:"regular",rarity:"Divine",oil:12500,cash:"$437.5B",vbucks:"1.6K",footprint:"2x2"},
{id:"demonic",name:"Demonic Drill",category:"regular",rarity:"Prismatic",oil:32000,cash:"$2T",vbucks:"1.85K",footprint:"3x2"},
{id:"candy",name:"Candy Drill",category:"event",rarity:"Special",oil:67,eventPrice:"50 Candy",footprint:"1x1"},
{id:"volcano",name:"Volcano Drill",category:"event",rarity:"Special",oil:83,eventPrice:"62 Lava Crystals",footprint:"1x1"},
{id:"disco",name:"Disco Drill",category:"event",rarity:"Special",oil:104,eventPrice:"78 Music Notes",footprint:"1x1"},
{id:"hacker",name:"Hacker Drill",category:"event",rarity:"Special",oil:550,minOil:100,maxOil:1000,eventPrice:"N/A",footprint:"2x2",special:"hacker",notes:"Given away during the admin event. Produces a random 100–1K Oil/s each second; average 550 Oil/s."},
{id:"super-rocket",name:"Super Rocket Drill",category:"special",rarity:"Legendary",oil:220,vbucks:"700",footprint:"1x1",notes:"Legacy item. Unobtainable. Created with a 1x1 footprint but 2x2 stats, then removed and replaced by the Mega Laser Drill."},
{id:"pagoda",name:"Pagoda Drill",category:"special",rarity:"Special",oil:500,vbucks:"550",footprint:"2x2"},
{id:"drake",name:"Drake Drill",category:"special",rarity:"Special",oil:520,vbucks:"550",footprint:"2x1"},
{id:"ketchup-mustard",name:"Ketchup and Mustard Drill",category:"special",rarity:"Special",oil:275,vbucks:"N/A",footprint:"1x1",notes:"Exclusive to lootbox drops."},
{id:"heart",name:"Heart Drill",category:"special",rarity:"Special",oil:null,vbucks:"N/A",footprint:"1x1",special:"heart",notes:"Achievement reward. Production scales with Likes at 1 Oil/s per Like."},
{id:"clock",name:"Clock Drill",category:"special",rarity:"Special",oil:null,vbucks:"N/A",footprint:"1x1",special:"clock",notes:"Production increases by 1 Oil/s for every second spent in the current session. Exclusive to lootbox drops (0.2% jackpot)."},
{id:"banana",name:"Banana Drill",category:"special",rarity:"Special",oil:5000,vbucks:"N/A",footprint:"2x2",notes:"Reward from the Season 1 Season Pass."}
];

const pets=[
{name:"Penny",rarity:"Common",effect:"Generates flat Cash per second",min:5,max:1000000,kind:"flat",unit:"Cash/s"},
{name:"Snooze",rarity:"Common",effect:"+% offline gains",min:1,max:150,kind:"percent",unit:"Offline gains"},
{name:"Breezy",rarity:"Rare",effect:"+% Wind Turbine output",min:1,max:100,kind:"percent",unit:"Wind Turbine"},
{name:"Bandit",rarity:"Rare",effect:"+% steal rewards from raiding",min:1,max:50,kind:"percent",unit:"Steal rewards"},
{name:"Clover",rarity:"Rare",effect:"Multiply Rare Lootbox drop odds by X",min:1.1,max:2,kind:"multiplier",unit:"Rare Lootbox odds"},
{name:"Vault",rarity:"Legendary",effect:"+% gasoline market sell price",min:1,max:100,kind:"percent",unit:"Market sell price"},
{name:"Dash",rarity:"Legendary",effect:"-% to all active timers",min:1,max:30,kind:"percentMinus",unit:"Active timers"},
{name:"Sunny",rarity:"Legendary",effect:"Generates flat Energy per second",min:1,max:200,kind:"flat",unit:"Energy/s"},
{name:"Tank",rarity:"Mythical",effect:"+% Refinery max capacity",min:1,max:100,kind:"percent",unit:"Refinery capacity"},
{name:"Mole",rarity:"Mythical",effect:"+% Drill production speed",min:1,max:50,kind:"percent",unit:"Drill production"},
{name:"Astro",rarity:"Mythical",effect:"+% Shuttle Station rewards",min:1,max:100,kind:"percent",unit:"Shuttle rewards"},
{name:"Nova",rarity:"Divine",effect:"Generates flat Pearls per minute",min:1,max:10,kind:"flat",unit:"Pearls/min"},
{name:"Piper",rarity:"Divine",effect:"Auto-collects from Refineries",min:200,max:50000000,kind:"flat",unit:"Gas/trip"},
{name:"Volt",rarity:"Divine",effect:"Auto-collects from Solar Panels",min:50,max:25000,kind:"flat",unit:"Energy/trip"},
{name:"Fruit",rarity:"Special",effect:"+% Banana Drill & Fruit Basket Refinery output",min:5,max:500,kind:"percent",unit:"Banana/Fruit output"}
];

const refineries=[
{name:"Basic Refinery",type:"regular",rarity:"Common",capacity:"50",cash:"$500",vbucks:"50",footprint:"1x1"},
{name:"Enhanced Refinery",type:"regular",rarity:"Common",capacity:"150",cash:"$2.5K",vbucks:"100",footprint:"1x1"},
{name:"Reinforced Refinery",type:"regular",rarity:"Common",capacity:"250",cash:"$6.25K",vbucks:"150",footprint:"1x1"},
{name:"Advanced Refinery",type:"regular",rarity:"Common",capacity:"500",cash:"$20K",vbucks:"200",footprint:"1x1"},
{name:"Plasma Refinery",type:"regular",rarity:"Uncommon",capacity:"800",cash:"$50K",vbucks:"250",footprint:"1x1"},
{name:"Industrial Refinery",type:"regular",rarity:"Uncommon",capacity:"1.5K",cash:"$200K",vbucks:"300",footprint:"2x1"},
{name:"Energy Refinery",type:"regular",rarity:"Uncommon",capacity:"2K",cash:"$700K",vbucks:"550",footprint:"1x1"},
{name:"Mega Refinery",type:"regular",rarity:"Rare",capacity:"5K",cash:"$3M",vbucks:"700",footprint:"2x1"},
{name:"Quantum Refinery",type:"regular",rarity:"Rare",capacity:"7.5K",cash:"$5M",vbucks:"800",footprint:"1x1"},
{name:"Ice Refinery",type:"regular",rarity:"Legendary",capacity:"12.5K",cash:"$8M",vbucks:"850",footprint:"1x1"},
{name:"Hell Refinery",type:"regular",rarity:"Legendary",capacity:"20K",cash:"$16M",vbucks:"950",footprint:"1x1"},
{name:"Nuclear Power Plant Refinery",type:"regular",rarity:"Legendary",capacity:"100K",cash:"$90M",vbucks:"1K",footprint:"2x1"},
{name:"Nuclear Reactor Refinery",type:"regular",rarity:"Legendary",capacity:"150K",cash:"$150M",vbucks:"1.1K",footprint:"2x2"},
{name:"Photon Refinery",type:"regular",rarity:"Mythical",capacity:"275K",cash:"$360M",vbucks:"1.15K",footprint:"2x2"},
{name:"Crystal Core Refinery",type:"regular",rarity:"Mythical",capacity:"400K",cash:"$600M",vbucks:"1.3K",footprint:"2x2"},
{name:"Moon Base Refinery",type:"regular",rarity:"Mythical",capacity:"1M",cash:"$5B",vbucks:"1.35K",footprint:"2x2"},
{name:"Solar Refinery",type:"regular",rarity:"Divine",capacity:"5M",cash:"$50B",vbucks:"1.45K",footprint:"2x2"},
{name:"Antimatter Refinery",type:"regular",rarity:"Divine",capacity:"15M",cash:"$285B",vbucks:"1.5K",footprint:"2x2"},
{name:"Black Hole Refinery",type:"regular",rarity:"Divine",capacity:"25M",cash:"$625B",vbucks:"1.6K",footprint:"2x2"},
{name:"Angel Refinery",type:"regular",rarity:"Divine",capacity:"35M",cash:"$1.1T",vbucks:"1.65K",footprint:"2x2"},
{name:"Demonic Refinery",type:"regular",rarity:"Prismatic",capacity:"100M",cash:"$4T",vbucks:"1.95K",footprint:"3x2"},
{name:"Pagoda Refinery",type:"special",rarity:"Special",capacity:"50K",vbucks:"600",footprint:"2x2"},
{name:"Castle Refinery",type:"special",rarity:"Special",capacity:"75K",vbucks:"600",footprint:"2x1"},
{name:"Burger Refinery",type:"special",rarity:"Special",capacity:"850K",vbucks:"N/A",footprint:"1x1",notes:"Exclusive to lootbox drops."},
{name:"Infinity Refinery",type:"special",rarity:"Special",capacity:"∞",vbucks:"5,000",footprint:"2x2",notes:"Premium item. Infinite storage, immune to stealing, cannot be sold back."},
{name:"Fruit Basket Refinery",type:"special",rarity:"Special",capacity:"22.5M",vbucks:"N/A",footprint:"2x2",notes:"Reward from the Season 1 Season Pass."}
];

const solarPanels=[
{name:"Copper Solar Panel",rarity:"Legendary",generation:"1/s",storage:"50",gasoline:"10M",vbucks:"250"},
{name:"Iron Solar Panel",rarity:"Mythical",generation:"10/s",storage:"750",gasoline:"250M",vbucks:"500"},
{name:"Golden Solar Panel",rarity:"Divine",generation:"50/s",storage:"5,000",gasoline:"5B",vbucks:"950"},
{name:"Emerald Solar Panel",rarity:"Prismatic",generation:"250/s",storage:"15,000",gasoline:"125B",vbucks:"1,350"}
];

const totems=[
{name:"Wooden Cash Totem",type:"cash",rarity:"Common",boost:"+5%",price:"FREE",footprint:"1x1"},
{name:"Stone Cash Totem",type:"cash",rarity:"Uncommon",boost:"+10%",price:"2.5K",footprint:"1x1"},
{name:"Copper Cash Totem",type:"cash",rarity:"Uncommon",boost:"+20%",price:"15K",footprint:"1x1"},
{name:"Iron Cash Totem",type:"cash",rarity:"Rare",boost:"+25%",price:"100K",footprint:"1x1"},
{name:"Golden Cash Totem",type:"cash",rarity:"Legendary",boost:"+50%",price:"350K",footprint:"2x2"},
{name:"Ruby Cash Totem",type:"cash",rarity:"Mythical",boost:"+75%",price:"1.5M",footprint:"2.5x2.5"},
{name:"Angel Cash Totem",type:"cash",rarity:"Divine",boost:"+100%",price:"100M",footprint:"2.5x2.5"},
{name:"Wooden AFK Totem",type:"afk",rarity:"Common",boost:"+15%",price:"200",footprint:"1x1"},
{name:"Stone AFK Totem",type:"afk",rarity:"Uncommon",boost:"+35%",price:"2.5K",footprint:"1x1"},
{name:"Copper AFK Totem",type:"afk",rarity:"Uncommon",boost:"+50%",price:"15K",footprint:"1x1"},
{name:"Iron AFK Totem",type:"afk",rarity:"Rare",boost:"+100%",price:"100K",footprint:"1x1"},
{name:"Golden AFK Totem",type:"afk",rarity:"Legendary",boost:"+200%",price:"350K",footprint:"2x2"},
{name:"Ruby AFK Totem",type:"afk",rarity:"Mythical",boost:"+300%",price:"1.5M",footprint:"2.5x2.5"},
{name:"Angel AFK Totem",type:"afk",rarity:"Divine",boost:"+500%",price:"100M",footprint:"2.5x2.5"},
{name:"Hacker Totem",type:"special",rarity:"Special",boost:"+15% Energy Boost",price:"N/A",footprint:"1x1",notes:"Given away as a reward for attending the admin event."}
];

const decorations=[
{name:"Radio Station",type:"utility",rarity:"Legendary",effect:"Notifies you when the market price changes.",cash:"$1M",footprint:"1x1"},
{name:"Shuttle Station",type:"utility",rarity:"Mythical",effect:"Interactive mission station for exclusive loot and Galaxy Pearls for the Black Market. Requires Energy to operate.",cash:"$1B",footprint:"2x2"},
{name:"Fusion Radio",type:"utility",rarity:"Mythical",effect:"Notifies you when your machine fusion is finished.",cash:"$1.5B",footprint:"1x1"},
{name:"Lootbox Radio",type:"utility",rarity:"Mythical",effect:"Notifies you when a selected lootbox spawns.",cash:"$1.5B",footprint:"1x1"},
{name:"Wood Wind Turbine",type:"turbine",rarity:"Uncommon",effect:"+$250/s",cash:"$900K",footprint:"1x2"},
{name:"Iron Wind Turbine",type:"turbine",rarity:"Rare",effect:"+$1K/s",cash:"$5.4M",footprint:"1x2"},
{name:"Gold Wind Turbine",type:"turbine",rarity:"Legendary",effect:"+$10K/s",cash:"$60M",footprint:"2x2"},
{name:"Emerald Wind Turbine",type:"turbine",rarity:"Mythical",effect:"+$100K/s",cash:"$600M",footprint:"2x3"},
{name:"Basic Incubator",type:"pet",rarity:"—",effect:"Hatches eggs at standard timers.",cash:"5M Cash",footprint:"—"},
{name:"Heated Incubator",type:"pet",rarity:"—",effect:"Halves the total incubation time.",cash:"200K Energy",footprint:"—"},
{name:"Genetic Incubator",type:"pet",rarity:"—",effect:"Increases the odds of hatching a higher Tier pet. Incubation timer is unchanged.",cash:"500 Pearls",footprint:"—"},
{name:"Work Station",type:"pet",rarity:"—",effect:"Permanent structure. Assign pets here to passively bake Biscuits.",cash:"10B Gasoline",footprint:"—"}
];

const lootboxes=[
{name:"Basic Drill Lootbox",type:"drill",rarity:"Common",cash:"$5.7K",drops:[["Strong Drill","45%"],["Enhanced Drill","30%"],["Speed Drill","17%"],["Reinforced Drill","7%"],["Industrial Drill [Gold Variant]","1%"]]},
{name:"Gold Drill Lootbox",type:"drill",rarity:"Uncommon",cash:"$31.7K",drops:[["Reinforced Drill","45%"],["Industrial Drill","30%"],["Double Industrial Drill","18%"],["Turbo Drill","6%"],["Mega Drill [Gold Variant]","1%"]]},
{name:"Diamond Drill Lootbox",type:"drill",rarity:"Rare",cash:"$358.1K",drops:[["Turbo Drill","45%"],["Mega Drill","32%"],["Ice Drill","18%"],["Lava Drill","4.5%"],["Rocket Drill [Diamond Variant]","0.5%"]]},
{name:"Rainbow Drill Lootbox",type:"drill",rarity:"Legendary",cash:"$9.71M",drops:[["Ice Drill","44%"],["Lava Drill","33%"],["Rocket Drill","18%"],["Mega Laser Drill","4.7%"],["Scifi Quad Drill [Rainbow Variant]","0.3%"]]},
{name:"Galaxy Drill Lootbox",type:"drill",rarity:"Mythical",cash:"$650.72M",drops:[["Scifi Double Drill","45%"],["Scifi Quad Drill","30%"],["Lunar Drill","18%"],["Alien Tech Drill","6.95%"],["UFO Drill [Galaxy Variant]","0.05%"]]},
{name:"Burger Drill Lootbox",type:"drill",rarity:"Special",cash:"$2.5B",drops:[["Lunar Drill","40%"],["Alien Tech Drill","35%"],["UFO Drill","20%"],["Antimatter Drill","4.5%"],["Mustard and Mayo Drill","0.5%"]]},
{name:"Clock Drill Lootbox",type:"drill",rarity:"Special",cash:"$120B",drops:[["Solar Drill","45%"],["Antimatter Drill","35%"],["Black Hole Drill","17%"],["Angel Drill","2.8%"],["Clock Drill","0.2%"]]},
{name:"Basic Refinery Lootbox",type:"refinery",rarity:"Common",cash:"$15.5K",drops:[["Enhanced Refinery","45%"],["Reinforced Refinery","30%"],["Advanced Refinery","17%"],["Plasma Refinery","7%"],["Industrial Refinery","1%"]]},
{name:"Gold Refinery Lootbox",type:"refinery",rarity:"Uncommon",cash:"$171.6K",drops:[["Advanced Refinery","45%"],["Plasma Refinery","30%"],["Industrial Refinery","18%"],["Energy Refinery","6%"],["Mega Refinery","1%"]]},
{name:"Diamond Refinery Lootbox",type:"refinery",rarity:"Rare",cash:"$7.23M",drops:[["Mega Refinery","45%"],["Quantum Refinery","32%"],["Ice Refinery","18%"],["Lava Refinery","4.5%"],["Nuclear Power Plant Refinery","0.5%"]]},
{name:"Rainbow Refinery Lootbox",type:"refinery",rarity:"Legendary",cash:"$107.2M",drops:[["Lava Refinery","44%"],["Nuclear Power Plant Refinery","33%"],["Nuclear Reactor Refinery","18%"],["Photon Refinery","4.7%"],["Crystal Core Refinery","0.3%"]]},
{name:"Galaxy Refinery Lootbox",type:"refinery",rarity:"Mythical",cash:"$6.54B",drops:[["Photon Refinery","45%"],["Crystal Core Refinery","30%"],["Moon Base Refinery","18%"],["Solar Refinery","6.95%"],["Black Hole Refinery","0.05%"]]},
{name:"Burger Refinery Lootbox",type:"refinery",rarity:"Special",cash:"$1.7B",drops:[["Nuclear Reactor Refinery","30%"],["Photon Refinery","30%"],["Crystal Core Refinery","20%"],["Moon Base Refinery","18%"],["Burger Refinery","2%"]]}
];


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

/* sale */
function escapeHTML(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]))}
function finiteNonNegative(value){const n=Number(value);return Number.isFinite(n)&&n>0?n:0}
let saleUnit=1,friendBoost=50;
function calcSale(){
  const oil=finiteNonNegative($("#saleOil").value)*saleUnit;
  const cash=finiteNonNegative($("#cashBoost").value);
  const price=finiteNonNegative($("#sellPrice").value);
  const bonus=(cash+friendBoost)/100;
  const cpo=price*bonus;
  $("#cashPerOil").textContent=money(cpo);
  $("#saleValue").textContent=money(oil*cpo);
  $("#totalBoost").textContent=fmt(cash+friendBoost)+"%";
}
$("#saleUnits").onclick=e=>{let b=e.target.closest("[data-unit]");if(!b)return;saleUnit=Number(b.dataset.unit);activate($("#saleUnits"),"unit",b.dataset.unit);calcSale()};
$("#friendBoosts").onclick=e=>{let b=e.target.closest("[data-friend]");if(!b)return;friendBoost=Number(b.dataset.friend);activate($("#friendBoosts"),"friend",b.dataset.friend);calcSale()};
$("#sellPrices").onclick=e=>{let b=e.target.closest("[data-price]");if(!b)return;$("#sellPrice").value=b.dataset.price;activate($("#sellPrices"),"price",b.dataset.price);calcSale()};
["#saleOil","#cashBoost","#sellPrice"].forEach(s=>$(s).addEventListener("input",calcSale));
$("#saleReset").onclick=()=>{$("#saleOil").value=50;saleUnit=1;$("#cashBoost").value=100;friendBoost=0;$("#sellPrice").value=15;activate($("#saleUnits"),"unit",1);activate($("#friendBoosts"),"friend",0);activate($("#sellPrices"),"price",15);calcSale()};
function saleOilDisplay(){const suffix={1:"",1000:"K",1000000:"M",1000000000:"B",1000000000000:"T"}[saleUnit]??"";return `${finiteNonNegative($("#saleOil").value)}${suffix}`}
function saleSummaryText(){return `Sale Result
Oil: ${saleOilDisplay()}
Sell Price: $${finiteNonNegative($("#sellPrice").value)}
Cash Boost: ${finiteNonNegative($("#cashBoost").value)}%
Friend Boost: ${friendBoost}%
Cash per Oil: ${$("#cashPerOil").textContent}
Sale Value: ${$("#saleValue").textContent}`}
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

$("#saleCopy").onclick=()=>copyText(saleSummaryText(),$("#saleCopy"),"Copy Summary");
$("#saleShare").onclick=()=>{const oilText=escapeHTML(saleOilDisplay()),priceText=escapeHTML(finiteNonNegative($("#sellPrice").value)),cashText=escapeHTML(finiteNonNegative($("#cashBoost").value));const html=`<div class="share-section"><div class="share-section-title">Sale Setup</div><div class="share-line"><span>Oil Amount</span><strong>${oilText}</strong></div><div class="share-line"><span>Sell Price</span><strong>$${priceText}</strong></div><div class="share-line"><span>Cash Boost</span><strong>${cashText}%</strong></div><div class="share-line"><span>Friend Boost</span><strong>${friendBoost}%</strong></div></div><div class="share-section"><div class="share-section-title">Result</div><div class="share-line"><span>Cash per Oil</span><strong>${escapeHTML($("#cashPerOil").textContent)}</strong></div><div class="share-line"><span>Sale Value</span><strong>${escapeHTML($("#saleValue").textContent)}</strong></div></div>`;openSharePreview("Sale Result",html,saleSummaryText())};

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
let layoutTargetUnit=1e9;
let layoutLobbyMult=1;
let layoutCopiedRows=null;
const layoutPlots=[];
LAYOUT_AREAS.forEach(area=>{for(let i=1;i<=area.plots;i++)layoutPlots.push({id:`${area.id}-${i}`,area:area.id,areaName:area.name,mult:area.mult,index:i,rows:[]})});

function fpSize(fp){const m=String(fp||"1x1").match(/^(\d+)x(\d+)$/);return m?[+m[1],+m[2]]:[1,1]}
function rowOilBase(d,row){if(d.special==="heart")return Math.max(0,Number($("#layoutLikes")?.value)||0);if(d.special==="hacker")return Math.max(0,Number(row.hacker)||550);return Number(d.oil)||0}
function clonePlotRows(rows){return rows.map(r=>({drill:r.drill,tier:Number(r.tier)||0,count:Math.max(1,Math.min(25,Math.floor(Number(r.count)||1))),hacker:Math.max(0,Number(r.hacker)||550)}))}
function updateCopyUI(){const has=Array.isArray(layoutCopiedRows);const allEmpty=$("#layoutPasteEmpty");if(allEmpty)allEmpty.disabled=!has;const status=$("#layoutCopyStatus");if(status)status.textContent=has?`Plot copied • ${layoutCopiedRows.length} drill row${layoutCopiedRows.length===1?"":"s"}`:"Copy a plot to reuse its drill setup.";$$('[data-paste]').forEach(b=>b.disabled=!has)}
function rowTierMult(row){return TIER_OPTIONS[Number(row.tier)||0]?.mult||1}
function pieceList(plot){
  const pieces=[];let ones=0,area=0;
  for(const row of plot.rows){const d=drills.find(x=>x.id===row.drill);if(!d)continue;const count=Math.max(0,Math.floor(Number(row.count)||0));const [w,h]=fpSize(d.footprint);area+=w*h*count;if(w===1&&h===1){ones+=count;continue}for(let i=0;i<count;i++)pieces.push([w,h])}
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
function plotStats(plot,t=0){let staticRate=0,clockGrowth=0;for(const row of plot.rows){const d=drills.find(x=>x.id===row.drill);if(!d)continue;const count=Math.max(0,Math.floor(Number(row.count)||0));const mult=rowTierMult(row)*plot.mult*count*layoutPetMult(d)*layoutLobbyMult;if(d.special==="clock")clockGrowth+=mult;else staticRate+=rowOilBase(d,row)*mult}return{rate:staticRate+clockGrowth*(Math.floor(t)+1),staticRate,clockGrowth}}
function totalOilForSeconds(staticRate,clockGrowth,seconds){const s=Math.max(0,Math.floor(seconds));return staticRate*s+clockGrowth*s*(s+1)/2}
function timeForTarget(staticRate,clockGrowth,target){
  if(target<=0)return 0;if(staticRate<=0&&clockGrowth<=0)return Infinity;
  if(clockGrowth<=0)return target/staticRate;
  // g*s^2 + (g+2r)*s - 2T = 0
  const b=clockGrowth+2*staticRate;const root=Math.sqrt(b*b+8*clockGrowth*target);return Math.max(0,(4*target)/(root+b));
}
function timeText(sec){if(!Number.isFinite(sec))return "—";let s=Math.ceil(sec);const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);s%=60;return [d?`${d}d`:"",h?`${h}h`:"",m?`${m}m`:"",`${s}s`].filter(Boolean).join(" ")}
function drillOptions(selected){return drills.map(d=>`<option value="${d.id}" ${d.id===selected?"selected":""}>${d.name} • ${d.footprint}</option>`).join("")}
function tierOptions(selected){return TIER_OPTIONS.map((t,i)=>`<option value="${i}" ${i===selected?"selected":""}>${t.name} ×${t.mult}</option>`).join("")}
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
function rowHtml(plot,row,i){const d=drills.find(x=>x.id===row.drill)||drills[0];const extra=d.special==="hacker";return `<div class="plot-row" data-row="${i}"><select data-rowdrill>${drillOptions(row.drill)}</select><select data-rowtier>${tierOptions(row.tier)}</select><input data-rowcount type="number" min="1" max="25" value="${row.count}"><button class="plot-remove" data-remove title="Remove">×</button><div class="plot-extra ${extra?"show":""}">${d.special==="hacker"?`<input data-hacker inputmode="numeric" value="${row.hacker||550}" placeholder="550"><span class="labels"><small>Hacker Oil/s (default avg 550)</small></span>`:""}</div></div>`}
function refreshPlotRows(card,p){
  card.querySelector(".plot-rows").innerHTML=p.rows.map((r,i)=>rowHtml(p,r,i)).join("");
  bindPlotRows(card,p);
}
function refreshRowExtra(rowEl,row,card,p){
  const d=drills.find(x=>x.id===row.drill)||drills[0],extra=rowEl.querySelector(".plot-extra");
  if(d.special==="hacker"){
    extra.classList.add("show");
    extra.innerHTML=`<input data-hacker inputmode="numeric" value="${row.hacker||550}" placeholder="550"><span class="labels"><small>Hacker Oil/s (default avg 550)</small></span>`;
    extra.querySelector("[data-hacker]").oninput=e=>{row.hacker=Math.max(0,+e.target.value||550);updatePlotCard(card,p)};
  }else{
    extra.classList.remove("show");extra.innerHTML="";
  }
}
function bindPlotRows(card,p){
  card.querySelectorAll(".plot-row").forEach(rowEl=>{
    const i=+rowEl.dataset.row,row=p.rows[i];if(!row)return;
    rowEl.querySelector("[data-rowdrill]").onchange=e=>{row.drill=e.target.value;refreshRowExtra(rowEl,row,card,p);updatePlotCard(card,p)};
    rowEl.querySelector("[data-rowtier]").onchange=e=>{row.tier=+e.target.value;updatePlotCard(card,p)};
    rowEl.querySelector("[data-rowcount]").oninput=e=>{row.count=Math.max(1,Math.min(25,Math.floor(+e.target.value||1)));updatePlotCard(card,p)};
    rowEl.querySelector("[data-remove]").onclick=()=>{p.rows.splice(i,1);refreshPlotRows(card,p);updatePlotCard(card,p)};
    const hacker=rowEl.querySelector("[data-hacker]");if(hacker)hacker.oninput=e=>{row.hacker=Math.max(0,+e.target.value||550);updatePlotCard(card,p)};
  });
}
function bindLayoutUI(){
  $$("[data-add]").forEach(b=>b.onclick=()=>{
    const p=layoutPlots.find(x=>x.id===b.dataset.add),card=b.closest(".plot-card");
    p.rows.push({drill:"demonic",tier:0,count:1,hacker:550});
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
function calcLayout(){let staticRate=0,clockGrowth=0,cells=0,usedPlots=0,valid=true;for(const p of layoutPlots){const info=pieceList(p);if(info.area>0)usedPlots++;cells+=Math.min(info.area,25);if(!canPack5x5(p)){valid=false;continue}const st=plotStats(p,0);staticRate+=st.staticRate;clockGrowth+=st.clockGrowth}$("#layoutError").classList.toggle("show",!valid);$("#layoutPlotsUsed").textContent=`${usedPlots} / 15`;$("#layoutCellsUsed").textContent=`${cells} / 375`;$("#layoutLobbyMult").textContent=`×${layoutLobbyMult}`;const target=finiteNonNegative($("#layoutTarget").value)*layoutTargetUnit;$("#layoutTargetDisplay").textContent=fmt(target);if(!valid){["#layoutNowRate","#layoutHourRate","#layoutHourOil","#layoutTargetTime","#layoutTimeStart","#layoutTimeEnd","#layoutTimeOil"].forEach(id=>$(id).textContent="—");return}const now=staticRate+clockGrowth,after=staticRate+clockGrowth*3601,hour=totalOilForSeconds(staticRate,clockGrowth,3600),hours=finiteNonNegative($("#layoutHours").value),seconds=hours*3600,end=staticRate+clockGrowth*(Math.floor(seconds)+1),oil=totalOilForSeconds(staticRate,clockGrowth,seconds);$("#layoutNowRate").textContent=rateFmt(now)+"/s";$("#layoutHourRate").textContent=rateFmt(after)+"/s";$("#layoutHourOil").textContent=fmt(hour);$("#layoutTimeStart").textContent=rateFmt(now)+"/s";$("#layoutTimeEnd").textContent=rateFmt(end)+"/s";$("#layoutTimeOil").textContent=fmt(oil);$("#layoutTargetTime").textContent=timeText(timeForTarget(staticRate,clockGrowth,target))}
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
      const d=drills.find(x=>x.id===r.drill);
      if(!d)return "";
      const tier=TIER_OPTIONS[Number(r.tier)||0]?.name||"Basic";
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
  const heartLikes=Math.max(0,Number($("#layoutLikes").value)||0);
  const setup=`<div class="share-section"><div class="share-section-title">Layout Setup</div><div class="share-setup-grid"><div class="share-setup-item"><span>Mole</span><strong>${mole}</strong></div><div class="share-setup-item"><span>Fruit</span><strong>${fruit}</strong></div><div class="share-setup-item"><span>Heart Likes</span><strong>${fmt(heartLikes)}</strong></div><div class="share-setup-item"><span>Weekend Lobby</span><strong>×${layoutLobbyMult}</strong></div><div class="share-setup-item"><span>Plots Used</span><strong>${d.usedPlots} / 15</strong></div><div class="share-setup-item"><span>Cells Used</span><strong>${d.cells} / 375</strong></div></div></div>`;
  const results=d.valid?`<div class="share-section"><div class="share-section-title">Production</div><div class="share-line"><span>Current Oil/s</span><strong>${rateFmt(d.now)}/s</strong></div><div class="share-line"><span>After 1 Hour</span><strong>${rateFmt(d.hourRate)}/s</strong></div><div class="share-line"><span>Oil in 1 Hour</span><strong>${fmt(d.hourOil)}</strong></div>${d.mode==="time"?`<div class="share-line"><span>Run Time</span><strong>${fmt(d.hours)}h</strong></div><div class="share-line"><span>Oil/s at End</span><strong>${rateFmt(d.end)}/s</strong></div><div class="share-line"><span>Oil Gained</span><strong>${fmt(d.timedOil)}</strong></div>`:`<div class="share-line"><span>Target Oil</span><strong>${fmt(d.target)}</strong></div><div class="share-line"><span>Time Needed</span><strong>${d.targetTime}</strong></div>`}</div>`:`<div class="share-section"><div class="share-section-title">Production</div><div class="share-line"><span>Status</span><strong>Fix plots that do not fit</strong></div></div>`;
  const plots=d.used.length?`<div class="share-section"><div class="share-section-title">Used Plots</div><div class="share-layout-plots">${d.used.map(p=>`<div class="share-layout-plot"><div class="share-layout-plot-head"><span>${p.name}</span><strong>×${p.mult} • ${p.cells}/25</strong></div><div class="share-layout-plot-meta">${p.rows.join("<br>")}${p.ok?"":"<br>Doesn't fit"}</div></div>`).join("")}</div></div>`:"";
  const lines=[
    "Oil Layout",
    `Mole: ${mole}`,
    `Fruit: ${fruit}`,
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
renderLayout();

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


function initials(name){return name.split(/\s+/).filter(x=>!["Drill","Refinery","Panel","Totem","Lootbox","Station","Turbine"].includes(x)).slice(0,2).map(x=>x[0]).join("").toUpperCase()||name.slice(0,2).toUpperCase()}
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
renderCodes();
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

const mapEvents=[
  {id:"candy",name:"Candy Event",schedule:[{h:3,m:0},{h:9,m:0},{h:15,m:0},{h:21,m:0}],objective:"Collect candies that spawn across the map.",unlock:"Candy Drill • 67/s • Cost: 50 Candy",effect:"Gasoline market price is locked at $15."},
  {id:"lava",name:"Lava Event",schedule:[{h:4,m:0},{h:10,m:0},{h:16,m:0},{h:22,m:0}],objective:"Collect Lava Crystals that spawn across the map.",unlock:"Volcano Drill • 83/s • Cost: 62 Lava Crystals",effect:"Fusion Machine processing timers are reduced by half."},
  {id:"disco",name:"Disco Event",schedule:[{h:5,m:0},{h:11,m:0},{h:17,m:0},{h:23,m:0}],objective:"Earn Music Notes during the event.",unlock:"Disco Drill • 104/s • Cost: 78 Music Notes",effect:"Lootbox incubation is reduced to 1 minute and rare drop chance is doubled."},
  {id:"happy",name:"Happy Hour",schedule:[{h:6,m:0},{h:18,m:0}],objective:"",unlock:"",effect:"The normal $15 market cap is lifted and the market can reach $20 for the hour."}
];
const adminSchedule=[
  {dow:6,h:1,m:30,label:"Saturday"},{dow:6,h:10,m:30,label:"Saturday"},{dow:6,h:18,m:30,label:"Saturday"},
  {dow:0,h:1,m:30,label:"Sunday"},{dow:0,h:10,m:30,label:"Sunday"},{dow:0,h:18,m:30,label:"Sunday"}
];
const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone||"Local time";
function localStamp(date){
  return new Intl.DateTimeFormat("en-US",{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(date);
}
function relativeDay(date){
  const now=new Date(),a=new Date(now.getFullYear(),now.getMonth(),now.getDate()),b=new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const diff=Math.round((b-a)/86400000),time=new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(date);
  if(diff===0)return `Today • ${time}`;if(diff===1)return `Tomorrow • ${time}`;
  return localStamp(date);
}
function nextDailySlots(schedule,count=4){
  const now=new Date(),items=[];
  for(let day=0;day<4;day++)for(const s of schedule){
    const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+day,s.h,s.m));
    if(d>now)items.push(d);
  }
  return items.sort((a,b)=>a-b).slice(0,count);
}
function nextWeeklySlots(entries,count=6){
  const now=new Date(),items=[];
  for(let add=0;add<15;add++){
    const base=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+add));
    const dow=base.getUTCDay();
    for(const e of entries)if(e.dow===dow){
      const d=new Date(Date.UTC(base.getUTCFullYear(),base.getUTCMonth(),base.getUTCDate(),e.h,e.m));
      if(d>now)items.push({date:d,label:e.label});
    }
  }
  return items.sort((a,b)=>a.date-b.date).slice(0,count);
}
function allUpcomingStarts(){
  const list=[];
  mapEvents.forEach(e=>nextDailySlots(e.schedule,1).forEach(d=>list.push({name:e.name,date:d,id:e.id})));
  nextWeeklySlots(adminSchedule,1).forEach(x=>list.push({name:"Admin Abuse",date:x.date,id:"admin"}));
  return list.sort((a,b)=>a.date-b.date);
}
function countdownText(ms){
  if(ms<=0)return"Starting now";
  const s=Math.floor(ms/1000),d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return [d?`${d}d`:"",h?`${h}h`:"",m?`${m}m`:"",`${sec}s`].filter(Boolean).join(" ");
}
function eventCard(e){
  const slots=nextDailySlots(e.schedule,4);
  const timeOnly=d=>new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(d);
  return `<article class="panel event-card">
    <div class="event-head"><div><h3>${e.name}</h3></div><span class="event-next">Next • ${relativeDay(slots[0])}</span></div>
    <div class="event-times">${slots.map(d=>`<span>${timeOnly(d)}</span>`).join("")}</div>
  </article>`;
}
function renderEvents(){
  $("#localTimezone").textContent=timezone;
  const next=allUpcomingStarts()[0];
  if(next){
    $("#nextEventName").textContent=next.name;
    $("#nextEventTime").textContent=relativeDay(next.date);
    $("#nextEventCountdown").dataset.time=String(next.date.getTime());
  }
  $("#eventList").innerHTML=mapEvents.map(eventCard).join("");
  const admin=nextWeeklySlots(adminSchedule,6);
  const grouped={};
  admin.forEach(x=>{const day=new Intl.DateTimeFormat("en-US",{weekday:"long"}).format(x.date);(grouped[day]??=[]).push(x.date)});
  $("#adminTimes").innerHTML=Object.entries(grouped).map(([day,dates])=>`<div class="admin-day"><div class="admin-day-head"><strong>${day}</strong></div><div class="admin-chips">${dates.map(d=>`<span>${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(d)}</span>`).join("")}</div></div>`).join("");
  updateEventCountdown();
}
function updateEventCountdown(){
  const el=$("#nextEventCountdown");if(!el||!el.dataset.time)return;
  el.textContent=countdownText(Number(el.dataset.time)-Date.now());
  if(Number(el.dataset.time)<=Date.now())renderEvents();
}
setInterval(updateEventCountdown,1000);

const GAME_CODES=[
  {code:"8962",type:"cash",reward:"10,000 Cash"},
  {code:"5219",type:"cash",reward:"75,000 Cash"},
  {code:"24",type:"cash",reward:"50,000 Cash",daily:true},
  {code:"6743",type:"cash",reward:"50,000 Cash"},
  {code:"1586",type:"cash",reward:"25,000 Cash"},
  {code:"7485",type:"cash",reward:"20,000 Cash"},
  {code:"6158",type:"gasoline",reward:"50,000 Gasoline"},
  {code:"6904",type:"gasoline",reward:"50,000 Gasoline"},
  {code:"3472",type:"gasoline",reward:"25,000 Gasoline"},
  {code:"7823",type:"gasoline",reward:"20,000 Gasoline"},
  {code:"8195",type:"gasoline",reward:"10,000 Gasoline"},
  {code:"1234",type:"gasoline",reward:"1,234 Gasoline"},
  {code:"9274",type:"energy",reward:"10,000 Energy"},
  {code:"67",type:"items",reward:"Industrial Refinery"},
  {code:"2828",type:"items",reward:"Wooden Wind"},
  {code:"4627",type:"items",reward:"Nuclear Reactor Refinery"},
  {code:"9351",type:"items",reward:"Super Rocket Drill"},
  {code:"2849",type:"items",reward:"Rocket Drill"},
  {code:"2026",type:"items",reward:"Hell Drill",expires:"Jan 1 2027"},
  {code:"7164",type:"items",reward:"Hell Drill"},
  {code:"5938",type:"items",reward:"Ice Drill"}
];
let codeFilter="all";
function renderCodes(){
  const q=(document.querySelector("#codesSearch")?.value||"").trim().toLowerCase();
  const rows=GAME_CODES.filter(x=>(codeFilter==="all"||x.type===codeFilter)&&(!q||x.code.includes(q)||x.reward.toLowerCase().includes(q)));
  document.querySelector("#codesCount").textContent=`${rows.length} ${rows.length===1?"code":"codes"}`;
  document.querySelector("#codesList").innerHTML=rows.map(x=>`<article class="panel code-card"><div class="code-main"><div class="code-top"><span class="code-value">${x.code}</span></div><div class="code-reward">${x.reward}</div><div class="code-tags"><span class="code-tag">${x.type==="items"?"Item":x.type[0].toUpperCase()+x.type.slice(1)}</span>${x.daily?'<span class="code-tag daily">Daily</span>':''}${x.expires?`<span class="code-tag expiry">Expires ${x.expires}</span>`:''}</div></div><button class="code-copy" data-copy-code="${x.code}">Copy</button></article>`).join("");
  document.querySelectorAll("[data-copy-code]").forEach(btn=>btn.onclick=async()=>{try{await navigator.clipboard.writeText(btn.dataset.copyCode)}catch(e){const t=document.createElement("textarea");t.value=btn.dataset.copyCode;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove()}btn.textContent="Copied";btn.classList.add("copied");setTimeout(()=>{btn.textContent="Copy";btn.classList.remove("copied")},1200)});
}
document.querySelector("#codesSearch")?.addEventListener("input",renderCodes);
document.querySelectorAll("[data-code-filter]").forEach(b=>b.onclick=()=>{codeFilter=b.dataset.codeFilter;document.querySelectorAll("[data-code-filter]").forEach(x=>x.classList.toggle("active",x===b));renderCodes()});

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
calcSale();
calcProduction();
calcDrill();
renderDb();
renderRefineries();
renderSolar();
renderTotems();
renderCodes();
renderDecorations();
renderLootboxes();
renderPets();
calcPet();
renderCompare();
renderEvents();
