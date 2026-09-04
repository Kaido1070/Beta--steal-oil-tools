/* Stage 5 — pure shared layout row/template helpers.
   No DOM access. No Oil/Compare mutable state access. */
(()=>{
  if(window.STOT_LAYOUT_ROWS)return;
  const geometry=window.STOT_LAYOUT_GEOMETRY;
  if(!geometry)throw new Error('STOT_LAYOUT_GEOMETRY must load before STOT_LAYOUT_ROWS');

  function clampInt(value,min,max,fallback=min){
    const n=Number(value);
    return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):fallback;
  }

  function normalizeRows(input,options={}){
    const source=Array.isArray(input)?input:[];
    const valid=options.validDrillIds instanceof Set
      ?options.validDrillIds
      :Array.isArray(options.validDrillIds)?new Set(options.validDrillIds):null;
    const fallbackDrill=options.fallbackDrill;
    const hasTierRange=Number.isFinite(Number(options.tierMin))&&Number.isFinite(Number(options.tierMax));
    const tierMin=hasTierRange?Number(options.tierMin):0;
    const tierMax=hasTierRange?Number(options.tierMax):0;
    const defaultHacker=Math.max(0,Number(options.defaultHacker)||550);

    return source.map(row=>{
      let drill=row?.drill;
      if(valid&&fallbackDrill!==undefined&&!valid.has(drill))drill=fallbackDrill;
      let tier=Number(row?.tier)||0;
      if(hasTierRange)tier=clampInt(tier,tierMin,tierMax,tierMin);
      return{
        drill,
        tier,
        count:clampInt(row?.count,1,25,1),
        hacker:Math.max(0,Number(row?.hacker)||defaultHacker)
      };
    });
  }

  function piecesFromRows(rows,drillList){
    const drills=Array.isArray(drillList)?drillList:[];
    const out=[];
    for(const row of Array.isArray(rows)?rows:[]){
      const drill=drills.find(item=>item?.id===row?.drill);
      if(!drill)continue;
      const [w,h]=geometry.parseFootprint(drill.footprint);
      const count=Math.max(0,Math.floor(Number(row?.count)||0));
      for(let i=0;i<count;i++)out.push([w,h]);
    }
    return out;
  }

  function footprintPieces(footprint,qty){
    const [w,h]=geometry.parseFootprint(footprint);
    const count=Math.max(0,Math.trunc(Number(qty)||0));
    return Array.from({length:count},()=>[w,h]);
  }

  function bestFitWithReserve({rows,reservePieces,drillList,losses,normalizeOptions}={}){
    const reserve=(Array.isArray(reservePieces)?reservePieces:[]).map(pair=>[Number(pair?.[0]),Number(pair?.[1])]);
    const reservedCells=geometry.piecesArea(reserve);
    if(!geometry.canPackPieces5x5(reserve)){
      return{ok:false,reason:'That refinery quantity cannot fit inside one 5×5 plot by itself.'};
    }

    const original=normalizeRows(rows,normalizeOptions);
    const rowLosses=original.map((_,i)=>Math.max(0,Number(losses?.[i])||0));
    const fitsRows=value=>geometry.canPackPieces5x5([...piecesFromRows(value,drillList),...reserve]);
    if(fitsRows(original))return{ok:true,rows:original,removed:0,reservedCells};

    const counts=original.map(row=>row.count);
    const start=counts.map(()=>0);
    const key=value=>value.join(',');
    let frontier=[{v:start,loss:0}],seen=new Set([key(start)]);
    const maxRemoved=counts.reduce((sum,count)=>sum+count,0);

    for(let depth=1;depth<=maxRemoved;depth++){
      const next=[];
      for(const state of frontier){
        for(let i=0;i<counts.length;i++){
          if(state.v[i]>=counts[i])continue;
          const v=state.v.slice();v[i]++;
          const k=key(v);if(seen.has(k))continue;
          seen.add(k);next.push({v,loss:state.loss+rowLosses[i]});
        }
      }
      next.sort((a,b)=>a.loss-b.loss);
      for(const state of next){
        const candidate=[];
        for(let i=0;i<original.length;i++){
          const remain=counts[i]-state.v[i];
          if(remain>0)candidate.push({...original[i],count:remain});
        }
        if(fitsRows(candidate))return{ok:true,rows:candidate,removed:depth,reservedCells};
      }
      frontier=next;
      if(!frontier.length)break;
    }

    return{ok:false,reason:'Could not create a valid reserved space in Plot 1 for that refinery setup.'};
  }

  window.STOT_LAYOUT_ROWS=Object.freeze({
    version:1,
    pure:true,
    clampInt,
    normalizeRows,
    piecesFromRows,
    footprintPieces,
    bestFitWithReserve
  });
})();
