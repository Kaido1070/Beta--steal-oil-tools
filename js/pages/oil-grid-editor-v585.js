/* STOT Oil grid editor — v5.85 */
(()=>{
  if(window.__STOT_GRID_EDITOR_V585__)return;
  window.__STOT_GRID_EDITOR_V585__=true;

  const GRID=5;
  const stateByKey=new Map();
  let scheduled=false;
  let dragging=null;

  const esc=v=>String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const shortName=name=>String(name||'Drill').replace(/\s+Drill$/i,'');
  const getFp=drill=>{
    if(typeof fpSize==='function')return fpSize(drill?.footprint);
    const m=String(drill?.footprint||'1x1').match(/^(\d+)x(\d+)$/);
    return m?[+m[1],+m[2]]:[1,1];
  };
  const activeLayoutKey=()=>{
    const compare=document.getElementById('layoutcompareView');
    if(compare?.classList.contains('active')){
      const active=document.querySelector('[data-ab-layout].active')?.dataset.abLayout;
      if(active==='A'||active==='B')return `compare-${active}`;
      const text=`${document.getElementById('v57Editing')?.textContent||''} ${document.getElementById('abEditing')?.textContent||''}`;
      return /Layout B/i.test(text)?'compare-B':'compare-A';
    }
    return 'single';
  };
  const stateKey=plot=>`${activeLayoutKey()}:${plot.id}`;
  const getState=plot=>{
    const key=stateKey(plot);
    if(!stateByKey.has(key))stateByKey.set(key,{positions:new Map(),locked:new Set(),selected:null});
    return stateByKey.get(key);
  };

  function buildPieces(plot,includeReserve=true){
    const pieces=[];
    (plot.rows||[]).forEach((row,rowIndex)=>{
      const drill=typeof drills!=='undefined'?drills.find(d=>d.id===row.drill):null;
      if(!drill)return;
      const [baseW,baseH]=getFp(drill),count=Math.max(0,Math.floor(Number(row.count)||0));
      for(let instance=0;instance<count;instance++){
        pieces.push({key:`r${rowIndex}i${instance}`,row,rowIndex,instance,drill,baseW,baseH,reserve:false});
      }
    });
    if(includeReserve){
      const reserve=window.STOT_REFINERY_RESERVE;
      if(reserve?.plotId===plot.id&&Array.isArray(reserve.pieces)){
        reserve.pieces.forEach((dims,index)=>{
          const baseW=Math.max(1,Number(dims?.[0])||1),baseH=Math.max(1,Number(dims?.[1])||1);
          pieces.push({key:`reserve${index}`,baseW,baseH,reserve:true,reserveIndex:index});
        });
      }
    }
    return pieces;
  }

  function compatible(piece,pos){
    if(!pos)return false;
    const w=Number(pos.w),h=Number(pos.h);
    return (w===piece.baseW&&h===piece.baseH)||(w===piece.baseH&&h===piece.baseW);
  }

  function packing(pieces,anchors=new Map()){
    const total=pieces.reduce((sum,p)=>sum+p.baseW*p.baseH,0);
    if(total>25)return null;
    const grid=Array(25).fill(false),placed=new Map();
    const fits=(w,h,x,y)=>{
      if(x<0||y<0||x+w>GRID||y+h>GRID)return false;
      for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*GRID+xx])return false;
      return true;
    };
    const mark=(w,h,x,y,value)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*GRID+xx]=value};

    for(const piece of pieces){
      const pos=anchors.get(piece.key);
      if(!pos||!compatible(piece,pos))continue;
      const x=Math.floor(Number(pos.x)),y=Math.floor(Number(pos.y)),w=Math.floor(Number(pos.w)),h=Math.floor(Number(pos.h));
      if(!fits(w,h,x,y))return null;
      mark(w,h,x,y,true);
      placed.set(piece.key,{...piece,x,y,w,h});
    }

    const rest=pieces.filter(p=>!placed.has(p.key)).sort((a,b)=>(b.baseW*b.baseH)-(a.baseW*a.baseH)||Number(b.reserve)-Number(a.reserve)||Math.max(b.baseW,b.baseH)-Math.max(a.baseW,a.baseH)||a.rowIndex-b.rowIndex||a.instance-b.instance);
    const memo=new Set();
    function dfs(i){
      if(i===rest.length)return true;
      const key=i+':'+grid.map(v=>v?'1':'0').join('');
      if(memo.has(key))return false;
      const piece=rest[i],orients=piece.baseW===piece.baseH?[[piece.baseW,piece.baseH]]:[[piece.baseW,piece.baseH],[piece.baseH,piece.baseW]];
      for(const [w,h] of orients){
        for(let y=0;y<=GRID-h;y++)for(let x=0;x<=GRID-w;x++){
          if(!fits(w,h,x,y))continue;
          mark(w,h,x,y,true);placed.set(piece.key,{...piece,x,y,w,h});
          if(dfs(i+1))return true;
          placed.delete(piece.key);mark(w,h,x,y,false);
        }
      }
      memo.add(key);return false;
    }
    if(!dfs(0))return null;
    return pieces.map(p=>placed.get(p.key)).filter(Boolean);
  }

  function packPlot(plot){
    const state=getState(plot),allPieces=buildPieces(plot,true),visiblePieces=allPieces.filter(p=>!p.reserve);
    const activeKeys=new Set(visiblePieces.map(p=>p.key));
    for(const key of [...state.locked])if(!activeKeys.has(key))state.locked.delete(key);
    for(const key of [...state.positions.keys()])if(!activeKeys.has(key))state.positions.delete(key);
    if(state.selected&&!activeKeys.has(state.selected))state.selected=null;

    const anchors=new Map();
    for(const key of state.locked){const pos=state.positions.get(key);if(pos)anchors.set(key,pos);}
    let placed=packing(allPieces,anchors),reserveConflict=false;
    if(!placed){
      // Never hide a valid drill layout just because an old refinery reserve no longer fits.
      placed=packing(visiblePieces,anchors);
      reserveConflict=!!placed&&allPieces.some(p=>p.reserve);
    }
    if(!placed&&anchors.size){
      state.locked.clear();
      placed=packing(allPieces,new Map());
      if(!placed){placed=packing(visiblePieces,new Map());reserveConflict=!!placed&&allPieces.some(p=>p.reserve);}
    }
    if(!placed)return {placed:null,reserveConflict:false};
    for(const item of placed)if(!item.reserve)state.positions.set(item.key,{x:item.x,y:item.y,w:item.w,h:item.h});
    return {placed:placed.filter(p=>!p.reserve),reserveConflict};
  }

  function pieceHtml(item,interactive=false,selected=false){
    const tier=typeof TIER_OPTIONS!=='undefined'?(TIER_OPTIONS[Number(item.row?.tier)||0]?.name||'Basic'):'Basic';
    const name=shortName(item.drill?.name),label=item.w*item.h===1?name.slice(0,7):name;
    const attrs=interactive?` data-v585-piece="${esc(item.key)}" role="button" tabindex="0" aria-label="${esc(item.drill?.name||'Drill')} ${item.w} by ${item.h}. Drag, tap, or rotate to reposition."`:'';
    return `<span class="v572-drill-block v585-drill-block${selected?' selected':''}"${attrs} style="grid-column:${item.x+1}/span ${item.w};grid-row:${item.y+1}/span ${item.h}" title="${esc(item.drill?.name||'Drill')} • ${esc(tier)} • ${item.w}×${item.h}"><b>${esc(label)}</b><small>${item.w}×${item.h}</small></span>`;
  }

  function warning(stage,on){
    let el=stage.querySelector('.v585-reserve-warning');
    if(on&&!el){el=document.createElement('span');el.className='v585-reserve-warning';el.textContent='Refinery reserve no longer fits';stage.appendChild(el);}
    else if(!on&&el)el.remove();
  }

  function paintStage(stage,plot,interactive=false){
    const placements=stage.querySelector('.v572-grid-placements');
    if(!placements)return;
    const {placed,reserveConflict}=packPlot(plot),state=getState(plot);
    if(!placed)return;
    const html=placed.map(item=>pieceHtml(item,interactive,state.selected===item.key)).join('');
    if(placements.innerHTML!==html)placements.innerHTML=html;
    stage.querySelector('.v572-invalid-label')?.remove();
    warning(stage,reserveConflict);
    if(stage.closest('.v572-plot-card'))stage.closest('.v572-plot-card').classList.remove('invalid');
  }

  function selectedPlot(){
    const id=document.querySelector('.v572-plot-card.selected')?.dataset.visualPlot;
    return typeof layoutPlots!=='undefined'?layoutPlots.find(p=>p.id===id):null;
  }

  function status(text,type=''){
    const el=document.querySelector('#v585GridTools [data-v585-status]');
    if(!el)return;
    el.textContent=text;
    el.className=type?`v585-grid-status ${type}`:'v585-grid-status';
  }

  function currentItem(plot,key){
    const result=packPlot(plot).placed||[];
    return result.find(p=>p.key===key)||null;
  }

  function applyAnchor(plot,key,target,preferKeepLocks=true){
    const state=getState(plot),pieces=buildPieces(plot,true),visible=pieces.filter(p=>!p.reserve),piece=visible.find(p=>p.key===key);
    if(!piece)return false;
    const candidates=[];
    const keep=new Map();
    if(preferKeepLocks){
      for(const locked of state.locked){if(locked===key)continue;const pos=state.positions.get(locked);if(pos)keep.set(locked,pos);}
    }
    keep.set(key,target);candidates.push({anchors:keep,locked:new Set([...keep.keys()]),msg:''});
    const only=new Map([[key,target]]);candidates.push({anchors:only,locked:new Set([key]),msg:'Other drills were rearranged to make room.'});
    for(const candidate of candidates){
      let packed=packing(pieces,candidate.anchors),reserveConflict=false;
      if(!packed){packed=packing(visible,candidate.anchors);reserveConflict=!!packed&&pieces.some(p=>p.reserve);}
      if(!packed)continue;
      state.locked=candidate.locked;
      for(const item of packed)if(!item.reserve)state.positions.set(item.key,{x:item.x,y:item.y,w:item.w,h:item.h});
      state.selected=key;
      schedule();
      status(candidate.msg||(reserveConflict?'Moved. Refinery reserve no longer fits this arrangement.':'Moved.'),reserveConflict?'warn':'ok');
      return true;
    }
    status('That position cannot fit this drill in the 5×5 plot.','bad');
    return false;
  }

  function cellFromPoint(stage,clientX,clientY){
    const grid=stage.querySelector('.v572-grid-placements');
    if(!grid)return null;
    const r=grid.getBoundingClientRect();
    if(!r.width||!r.height)return null;
    const x=Math.max(0,Math.min(4,Math.floor((clientX-r.left)/r.width*5)));
    const y=Math.max(0,Math.min(4,Math.floor((clientY-r.top)/r.height*5)));
    return {x,y};
  }

  function moveSelectedToPoint(stage,clientX,clientY){
    const plot=selectedPlot();if(!plot)return;
    const state=getState(plot),key=state.selected;if(!key)return;
    const item=currentItem(plot,key),cell=cellFromPoint(stage,clientX,clientY);if(!item||!cell)return;
    applyAnchor(plot,key,{x:cell.x,y:cell.y,w:item.w,h:item.h});
  }

  function rotateSelected(){
    const plot=selectedPlot();if(!plot)return;
    const state=getState(plot),key=state.selected;if(!key){status('Select a drill first.','bad');return;}
    const item=currentItem(plot,key);if(!item)return;
    if(item.w===item.h){status('This drill is square, so rotation does not change it.');return;}
    const target={x:item.x,y:item.y,w:item.h,h:item.w};
    if(applyAnchor(plot,key,target)){status('Rotated 90°.','ok');return;}
    // Try the nearest valid top-left position with the rotated footprint.
    const spots=[];
    for(let y=0;y<=5-target.h;y++)for(let x=0;x<=5-target.w;x++)spots.push({x,y,d:Math.abs(x-item.x)+Math.abs(y-item.y)});
    spots.sort((a,b)=>a.d-b.d||a.y-b.y||a.x-b.x);
    for(const spot of spots){if(applyAnchor(plot,key,{x:spot.x,y:spot.y,w:target.w,h:target.h},false)){status('Rotated and moved to the nearest valid position.','ok');return;}}
    status('No valid rotated position is available.','bad');
  }

  function autoArrange(){
    const plot=selectedPlot();if(!plot)return;
    const state=getState(plot);state.locked.clear();state.positions.clear();
    const packed=packPlot(plot).placed;
    if(packed){for(const item of packed)state.positions.set(item.key,{x:item.x,y:item.y,w:item.w,h:item.h});status('Auto arranged.','ok');schedule();}
  }

  function ensureTools(){
    const preview=document.querySelector('.v572-editor-grid-preview');
    const plot=selectedPlot();
    if(!preview||!plot)return;
    paintStage(preview,plot,true);
    let tools=document.getElementById('v585GridTools');
    if(!tools){
      tools=document.createElement('div');tools.id='v585GridTools';tools.className='v585-grid-tools';
      tools.innerHTML=`<div class="v585-grid-help"><strong>Arrange drills</strong><span>Drag a drill, or tap it then tap a grid cell. Rotate keeps the same drill and production.</span></div><div class="v585-grid-actions"><button type="button" data-v585-rotate>↻ Rotate 90°</button><button type="button" data-v585-auto>Auto Arrange</button></div><div class="v585-grid-status" data-v585-status>Select a drill to move or rotate it.</div>`;
      preview.insertAdjacentElement('afterend',tools);
      tools.querySelector('[data-v585-rotate]').onclick=rotateSelected;
      tools.querySelector('[data-v585-auto]').onclick=autoArrange;
    }
    const state=getState(plot);
    tools.querySelector('[data-v585-rotate]').disabled=!state.selected;
  }

  function bindEditor(){
    const preview=document.querySelector('.v572-editor-grid-preview');
    const plot=selectedPlot();if(!preview||!plot)return;
    ensureTools();
    if(preview.dataset.v585Bound==='1')return;
    preview.dataset.v585Bound='1';
    preview.addEventListener('click',e=>{
      const current=selectedPlot();if(!current)return;
      const state=getState(current),block=e.target.closest('[data-v585-piece]');
      if(block){
        state.selected=block.dataset.v585Piece;status('Selected. Drag it, tap a destination cell, or rotate it.');schedule();return;
      }
      if(state.selected)moveSelectedToPoint(preview,e.clientX,e.clientY);
    });
    preview.addEventListener('pointerdown',e=>{
      const block=e.target.closest('[data-v585-piece]');if(!block)return;
      const current=selectedPlot();if(!current)return;
      const state=getState(current);state.selected=block.dataset.v585Piece;
      dragging={pointerId:e.pointerId,key:block.dataset.v585Piece,startX:e.clientX,startY:e.clientY};
      try{block.setPointerCapture(e.pointerId)}catch(_){}
      e.preventDefault();schedule();
    });
    preview.addEventListener('pointerup',e=>{
      if(!dragging||dragging.pointerId!==e.pointerId)return;
      const moved=Math.hypot(e.clientX-dragging.startX,e.clientY-dragging.startY)>5;
      dragging=null;
      if(moved)moveSelectedToPoint(preview,e.clientX,e.clientY);
    });
    preview.addEventListener('keydown',e=>{
      const block=e.target.closest('[data-v585-piece]');if(!block)return;
      if(e.key==='Enter'||e.key===' '){const current=selectedPlot();if(!current)return;getState(current).selected=block.dataset.v585Piece;e.preventDefault();status('Selected. Use Rotate or tap a destination cell.');schedule();}
    });
  }

  function enhanceAll(){
    scheduled=false;
    if(typeof layoutPlots==='undefined')return;
    document.querySelectorAll('.v572-plot-card[data-visual-plot]').forEach(card=>{
      const plot=layoutPlots.find(p=>p.id===card.dataset.visualPlot),stage=card.querySelector('.v572-grid-stage');
      if(plot&&stage)paintStage(stage,plot,false);
    });
    const plot=selectedPlot(),preview=document.querySelector('.v572-editor-grid-preview');
    if(plot&&preview){paintStage(preview,plot,true);bindEditor();ensureTools();}
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhanceAll);}

  const observer=new MutationObserver(()=>schedule());
  observer.observe(document.body,{subtree:true,childList:true});
  ['input','change','click'].forEach(type=>document.addEventListener(type,e=>{
    if(e.target.closest('#oilView,#layoutcompareView,#v572PlotEditor'))setTimeout(schedule,0);
  },true));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  window.STOT_GRID_EDITOR={refresh:schedule,resetPlot(plotId){for(const key of [...stateByKey.keys()])if(key.endsWith(`:${plotId}`))stateByKey.delete(key);schedule();}};
  schedule();
})();
