/* Stage 5 — pure shared layout geometry helpers.
   No DOM access. No Oil/Compare state access. */
(()=>{
  if(window.STOT_LAYOUT_GEOMETRY)return;

  function parseFootprint(value){
    const match=String(value||'1x1').match(/^(\d+)x(\d+)$/);
    return match?[Number(match[1]),Number(match[2])]:[1,1];
  }

  function piecesArea(input){
    return (Array.isArray(input)?input:[]).reduce((sum,pair)=>sum+(Number(pair?.[0])||0)*(Number(pair?.[1])||0),0);
  }

  function canPackPieces5x5(input){
    const pieces=(Array.isArray(input)?input:[]).map(pair=>[Number(pair?.[0]),Number(pair?.[1])]);
    if(piecesArea(pieces)>25)return false;

    pieces.sort((a,b)=>(b[0]*b[1])-(a[0]*a[1])||Math.max(b[0],b[1])-Math.max(a[0],a[1]));
    const grid=Array(25).fill(false),memo=new Set();
    const fits=(w,h,x,y)=>{
      if(x+w>5||y+h>5)return false;
      for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;
      return true;
    };
    const set=(w,h,x,y,value)=>{
      for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=value;
    };
    function dfs(i){
      if(i===pieces.length)return true;
      const key=i+':'+grid.map(v=>v?1:0).join('');
      if(memo.has(key))return false;
      const [a,b]=pieces[i],orients=a===b?[[a,b]]:[[a,b],[b,a]];
      for(const [w,h] of orients)for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){
        if(!fits(w,h,x,y))continue;
        set(w,h,x,y,true);
        if(dfs(i+1))return true;
        set(w,h,x,y,false);
      }
      memo.add(key);
      return false;
    }
    return dfs(0);
  }

  window.STOT_LAYOUT_GEOMETRY=Object.freeze({
    version:1,
    pure:true,
    parseFootprint,
    piecesArea,
    canPackPieces5x5
  });
})();
