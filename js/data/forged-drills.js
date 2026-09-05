/* STEAL THE OIL TYCOON — Forged Drill canonical data */
window.STOT_FORGED_DRILLS=Object.freeze({
  tiers:Object.freeze(["Default","Gold","Diamond","Rainbow","Galaxy"]),
  celestial:Object.freeze({
    id:"celestial",
    name:"Celestial Drill",
    category:"forged",
    rarity:"Forged",
    footprint:"3x3",
    maxOwned:1,
    maxLevel:5,
    scrap:null,
    notes:"Scrap ≠ Value",
    levels:Object.freeze([
      Object.freeze({level:1,cost:"10 Qa",costLabel:"Initial Buy",production:Object.freeze([100000,200000,400000,600000,800000]),image:null}),
      Object.freeze({level:2,cost:"20 Qa",production:Object.freeze([1000000,1200000,1400000,1600000,1800000]),image:null}),
      Object.freeze({level:3,cost:"30 Qa",production:Object.freeze([2000000,2200000,2400000,2600000,2800000]),image:null}),
      Object.freeze({level:4,cost:"40 Qa",production:Object.freeze([3000000,3200000,3400000,3600000,3800000]),image:null}),
      Object.freeze({level:5,cost:"50 Qa",production:Object.freeze([4000000,4300000,4600000,4800000,5000000]),image:null})
    ])
  })
});
