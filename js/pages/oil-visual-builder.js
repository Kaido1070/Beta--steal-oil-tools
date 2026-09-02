/* STOT Oil visual plot builder — v5.75 */
(()=>{
  const AREA_CLASS={forest:'forest',desert:'desert','volcano-side':'volcano-side','volcano-core':'volcano-core','mountain-side':'mountain-side','mountain-summit':'mountain-summit'};
  const PLOT_DISPLAY_MAP={1:['forest','Forest',1],2:['forest','Forest',1],3:['forest','Forest',1],4:['forest','Forest',1],5:['forest','Forest',1],6:['forest','Forest',1],7:['desert','Desert',2],8:['desert','Desert',2],9:['desert','Desert',2],10:['volcano-side','Volcano Sides',3],11:['volcano-core','Volcano Core',5],12:['volcano-side','Volcano Sides',3],13:['mountain-side','Mountain Sides',6],14:['mountain-summit','Mountain Summit',10],15:['mountain-side','Mountain Sides',6]};
  let selectedPlotId=null;
  let visualRendering=false;
  function esc(v){return escapeHTML(String(v??''))}
  function plotNumber(plot){return layoutPlots.indexOf(plot)+1}
  function displayMeta(plot){const n=plotNumber(plot),m=PLOT_DISPLAY_MAP[n];return m?{area:m[0],areaName:m[1],mult:m[2]}:{area:plot.area||'forest',areaName:plot.areaName||'Forest',mult:plot.mult||1}}
  function areaClass(plot){return AREA_CLASS[displayMeta(plot).area]||'forest'}
  function shortName(name){return String(name||'Drill').replace(/\s+Drill$/i,'')}
  function packVisual(plot){
    const pieces=[];let totalArea=0;
    plot.rows.forEach((row,rowIndex)=>{const drill=drills.find(d=>d.id===row.drill);if(!drill)return;const [baseW,baseH]=fpSize(drill.footprint),count=Math.max(0,Math.floor(Number(row.count)||0));totalArea+=baseW*baseH*count;for(let instance=0;instance<count;instance++)pieces.push({row,rowIndex,drill,instance,baseW,baseH})});
    if(totalArea>25)return null;
    pieces.sort((a,b)=>(b.baseW*b.baseH)-(a.baseW*a.baseH)||Math.max(b.baseW,b.baseH)-Math.max(a.baseW,a.baseH)||a.rowIndex-b.rowIndex);
    const grid=Array(25).fill(false),placed=[];
    const fits=(w,h,x,y)=>{if(x+w>5||y+h>5)return false;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;return true};
    const set=(w,h,x,y,value)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=value};
    const memo=new Set();
    function dfs(i){if(i===pieces.length)return true;const key=i+':'+grid.map(v=>v?'1':'0').join('');if(memo.has(key))return false;const piece=pieces[i],orients=piece.baseW===piece.baseH?[[piece.baseW,piece.baseH]]:[[piece.baseW,piece.baseH],[piece.baseH,piece.baseW]];for(const [w,h] of orients){for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){if(!fits(w,h,x,y))continue;set(w,h,x,y,true);placed[i]={...piece,x,y,w,h};if(dfs(i+1))return true;placed[i]=null;set(w,h,x,y,false)}}memo.add(key);return false}
    return dfs(0)?placed.filter(Boolean):null;
  }
  function gridCells(){return '<div class="v572-grid-cells">'+Array.from({length:25},()=>'<span></span>').join('')+'</div>'}
  function placementHtml(item){const name=shortName(item.drill.name),tier=TIER_OPTIONS[Number(item.row.tier)||0]?.name||'Basic',label=item.w*item.h===1?name.slice(0,7):name;return `<span class="v572-drill-block" style="grid-column:${item.x+1}/span ${item.w};grid-row:${item.y+1}/span ${item.h}" title="${esc(item.drill.name)} • ${tier} • ${item.w}×${item.h}"><b>${esc(label)}</b><small>${item.w}×${item.h}</small></span>`}
  function visualPlotHtml(plot){const number=plotNumber(plot),meta=displayMeta(plot),packed=packVisual(plot),used=pieceList(plot).area,valid=packed!==null,occupied=valid?packed.map(placementHtml).join(''):'';return `<button class="v572-plot-card ${areaClass(plot)}${selectedPlotId===plot.id?' selected':''}${valid?'':' invalid'}" data-visual-plot="${plot.id}" type="button" aria-label="Edit plot ${number}, ${esc(meta.areaName)}"><span class="v572-plot-head"><strong>${number} <em>${esc(meta.areaName)}</em></strong><i>×${meta.mult}</i></span><span class="v572-grid-stage">${gridCells()}<span class="v572-grid-placements">${occupied}</span>${valid?'':`<span class="v572-invalid-label">Doesn't fit</span>`}</span><span class="v572-plot-foot"><span>${used?`${used}/25 cells`:'Empty'}</span><span>${plot.rows.length?`${plot.rows.length} drill type${plot.rows.length===1?'':'s'}`:'Tap to build'}</span></span></button>`}
  function summaryHtml(){return `<div class="v572-map-summary">${LAYOUT_AREAS.map(area=>`<span class="v572-summary-item ${AREA_CLASS[area.id]||''}"><i></i><b>${esc(area.name)}</b><small>${area.plots} Plot${area.plots===1?'':'s'} · ×${area.mult}</small></span>`).join('')}</div>`}
  function ensureShell(){let shell=document.getElementById('layoutVisualBuilder');if(!shell){shell=document.createElement('section');shell.id='layoutVisualBuilder';shell.className='panel v572-visual-builder';const host=document.getElementById('layoutAreas');host?.parentNode?.insertBefore(shell,host)}document.getElementById('layoutAreas')?.classList.add('v572-legacy-layout');return shell}
  function renderVisualBuilder(){if(visualRendering)return;visualRendering=true;try{const shell=ensureShell();if(!shell)return;shell.innerHTML=`<div class="v572-builder-head"><div><h2>Visual Plot Builder</h2><p>Tap any plot to add drills. The 5×5 map updates instantly with the space each drill uses.</p></div><span>${layoutPlots.filter(p=>p.rows.length).length}/15 used</span></div>${summaryHtml()}<div class="v572-plot-map">${layoutPlots.map(visualPlotHtml).join('')}</div>`;shell.querySelectorAll('[data-visual-plot]').forEach(btn=>btn.onclick=()=>openVisualPlotEditor(btn.dataset.visualPlot))}finally{visualRendering=false}}
  function editorRowHtml(plot,row,index){const drill=drills.find(d=>d.id===row.drill)||drills[0],[w,h]=fpSize(drill.footprint);return `<div class="v572-editor-row" data-vrow="${index}"><label><span>Drill</span><select data-vdrill>${drillOptions(row.drill)}</select></label><div class="v572-row-two"><label><span>Tier</span><select data-vtier>${tierOptions(row.tier)}</select></label><label><span>Count</span><input data-vcount type="number" min="1" max="25" value="${row.count}" inputmode="numeric"></label></div><div class="v572-row-meta"><span>${esc(drill.name)}</span><b>${w}×${h} · ${w*h} cell${w*h===1?'':'s'} each</b></div>${drill.special==='hacker'?`<label><span>Hacker Oil/s</span><input data-vhacker type="number" min="0" value="${row.hacker||550}" inputmode="numeric"></label>`:''}<button class="v572-remove-row" data-vremove type="button">Remove</button></div>`}
  function ensureEditor(){let modal=document.getElementById('v572PlotEditor');if(modal)return modal;modal=document.createElement('div');modal.id='v572PlotEditor';modal.className='v572-editor-backdrop';modal.setAttribute('aria-hidden','true');modal.innerHTML='<div class="v572-editor-sheet" role="dialog" aria-modal="true" aria-labelledby="v572EditorTitle"><div id="v572EditorBody"></div></div>';document.body.appendChild(modal);modal.addEventListener('click',e=>{if(e.target===modal)closeVisualPlotEditor()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selectedPlotId)closeVisualPlotEditor()});return modal}
  function renderVisualEditor(){if(!selectedPlotId)return;const plot=layoutPlots.find(p=>p.id===selectedPlotId);if(!plot)return;const modal=ensureEditor(),body=modal.querySelector('#v572EditorBody'),used=pieceList(plot).area,valid=canPack5x5(plot),number=plotNumber(plot);body.innerHTML=`<div class="v572-editor-head"><div><small>Selected Plot</small><h3 id="v572EditorTitle">${number} ${esc(displayMeta(plot).areaName)} <span>×${displayMeta(plot).mult}</span></h3></div><button data-vclose type="button" aria-label="Close">×</button></div><div class="v572-editor-status ${valid?'ok':'bad'}"><strong>${valid?`${used} / 25 cells`:`Doesn't fit in 5×5`}</strong><span>${plot.rows.length?`${plot.rows.length} drill type${plot.rows.length===1?'':'s'}`:'Empty plot'}</span></div><div class="v572-editor-grid-preview">${gridCells()}<span class="v572-grid-placements">${(packVisual(plot)||[]).map(placementHtml).join('')}</span></div><div class="v572-editor-rows">${plot.rows.length?plot.rows.map((row,i)=>editorRowHtml(plot,row,i)).join(''):'<div class="v572-empty-editor">No drills yet. Add one below.</div>'}</div><div class="v572-editor-actions"><button data-vadd class="primary" type="button">+ Add Drill</button><button data-vcopy type="button">Copy Plot</button><button data-vpaste type="button" ${layoutCopiedRows?'':'disabled'}>Paste</button><button data-vclear type="button" ${plot.rows.length?'':'disabled'}>Clear Plot</button></div>`;
    body.querySelector('[data-vclose]').onclick=closeVisualPlotEditor;body.querySelector('[data-vadd]').onclick=()=>{plot.rows.push({drill:'demonic',tier:0,count:1,hacker:550});commitVisualEdit()};body.querySelector('[data-vcopy]').onclick=e=>{layoutCopiedRows=clonePlotRows(plot.rows);updateCopyUI();e.currentTarget.textContent='Copied';setTimeout(()=>{if(selectedPlotId)renderVisualEditor()},650)};body.querySelector('[data-vpaste]').onclick=()=>{if(!layoutCopiedRows)return;plot.rows=clonePlotRows(layoutCopiedRows);commitVisualEdit()};body.querySelector('[data-vclear]').onclick=()=>{plot.rows=[];commitVisualEdit()};
    body.querySelectorAll('.v572-editor-row').forEach(rowEl=>{const index=Number(rowEl.dataset.vrow),row=plot.rows[index];if(!row)return;rowEl.querySelector('[data-vdrill]').onchange=e=>{row.drill=e.target.value;commitVisualEdit()};rowEl.querySelector('[data-vtier]').onchange=e=>{row.tier=Number(e.target.value)||0;commitVisualEdit()};rowEl.querySelector('[data-vcount]').onchange=e=>{row.count=Math.max(1,Math.min(25,Math.floor(Number(e.target.value)||1)));commitVisualEdit()};rowEl.querySelector('[data-vremove]').onclick=()=>{plot.rows.splice(index,1);commitVisualEdit()};const hacker=rowEl.querySelector('[data-vhacker]');if(hacker)hacker.onchange=e=>{row.hacker=Math.max(0,Number(e.target.value)||550);commitVisualEdit()}})
  }
  function openVisualPlotEditor(id){if(!layoutPlots.some(p=>p.id===id))return;selectedPlotId=id;const modal=ensureEditor();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('v572-editor-open');renderVisualBuilder();renderVisualEditor()}
  function closeVisualPlotEditor(){selectedPlotId=null;const modal=document.getElementById('v572PlotEditor');modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');document.body.classList.remove('v572-editor-open');renderVisualBuilder()}
  function commitVisualEdit(){if(typeof renderLayout==='function')renderLayout();else if(typeof calcLayout==='function')calcLayout();renderVisualBuilder();renderVisualEditor()}
  const legacyRenderLayout=typeof renderLayout==='function'?renderLayout:null;if(legacyRenderLayout){renderLayout=function(){const value=legacyRenderLayout.apply(this,arguments);queueMicrotask(renderVisualBuilder);return value}}
  const legacyUpdatePlotCard=typeof updatePlotCard==='function'?updatePlotCard:null;if(legacyUpdatePlotCard){updatePlotCard=function(){const value=legacyUpdatePlotCard.apply(this,arguments);queueMicrotask(()=>{renderVisualBuilder();if(selectedPlotId)renderVisualEditor()});return value}}

  function ensureStickyRate(){
    let bar=document.getElementById('v575StickyRate');
    const rate=document.getElementById('layoutNowRate');
    const details=rate?.closest('.panel.result');
    if(!rate||!details)return null;
    let navigatingToResult=false;
    details.id='layoutResultDetails';
    details.classList.add('v575-result-details');
    if(!bar){
      bar=document.createElement('button');
      bar.id='v575StickyRate';
      bar.className='v575-sticky-rate';
      bar.type='button';
      bar.setAttribute('aria-label','Current oil production. Tap to view details.');
      bar.innerHTML='<span><small>Current Production</small><strong data-v575-rate>0/s</strong></span><i>Details ↓</i>';
      document.body.appendChild(bar);
      bar.addEventListener('click',()=>{
        navigatingToResult=true;
        bar.classList.remove('show');
        details.scrollIntoView({behavior:'smooth',block:'center'});
        details.classList.remove('v575-result-focus');
        requestAnimationFrame(()=>details.classList.add('v575-result-focus'));
        setTimeout(()=>details.classList.remove('v575-result-focus'),900);
      });
    }
    const sync=()=>{
      const out=bar.querySelector('[data-v575-rate]');
      if(out)out.textContent=rate.textContent?.trim()||'0/s';
      const oilActive=document.getElementById('oilView')?.classList.contains('active')===true;
      const beforeResult=details.getBoundingClientRect().top>window.innerHeight*.62;
      if(!beforeResult)navigatingToResult=false;
      bar.classList.toggle('show',oilActive&&beforeResult&&!navigatingToResult);
    };
    sync();
    if(!bar.dataset.bound){
      bar.dataset.bound='1';
      new MutationObserver(sync).observe(rate,{childList:true,characterData:true,subtree:true});
      new MutationObserver(sync).observe(document.getElementById('oilView'),{attributes:true,attributeFilter:['class']});
      document.addEventListener('click',e=>{if(e.target.closest?.('[data-view]'))queueMicrotask(sync)});
      window.addEventListener('scroll',sync,{passive:true});
      window.addEventListener('resize',sync,{passive:true});
    }
    return bar;
  }


  window.STOT_VISUAL_PLOT_BUILDER=Object.freeze({render:renderVisualBuilder,open:openVisualPlotEditor,close:closeVisualPlotEditor,pack:packVisual});document.documentElement.dataset.stotVisualBuilder=STOT_CONFIG.version;ensureStickyRate();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderVisualBuilder,{once:true});else renderVisualBuilder();
})();