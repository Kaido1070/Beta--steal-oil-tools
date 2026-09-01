/* STEAL THE OIL TYCOON — game/database data */
/* Edit game values here; application logic stays in js/app.js. */
window.STOT_GAME_DATA=(()=>{
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

return {drills,pets,refineries,solarPanels,totems,decorations,lootboxes};
})();
