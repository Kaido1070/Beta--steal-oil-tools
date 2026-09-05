/* Stage 5 — pure shared layout production helpers.
   No DOM access. No Oil/Compare mutable state access. */
(()=>{
  if(window.STOT_LAYOUT_PRODUCTION)return;

  const finiteNumber=(value,fallback=0)=>{
    const n=Number(value);
    return Number.isFinite(n)?n:fallback;
  };

  function rowBaseRate({special='',oil=0,heartLikes=0,hackerOil=550}={}){
    if(special==='heart')return Math.max(0,finiteNumber(heartLikes,0));
    if(special==='hacker')return Math.max(0,finiteNumber(hackerOil,550));
    if(special==='clock')return 1;
    return finiteNumber(oil,0);
  }

  function rowLoss({special='',oil=0,heartLikes=0,hackerOil=550,tierMultiplier=1,petMultiplier=1}={}){
    const tier=finiteNumber(tierMultiplier,1)||1;
    const pet=finiteNumber(petMultiplier,1)||1;
    return rowBaseRate({special,oil,heartLikes,hackerOil})*tier*pet;
  }

  window.STOT_LAYOUT_PRODUCTION=Object.freeze({
    version:1,
    pure:true,
    rowBaseRate,
    rowLoss
  });
})();
