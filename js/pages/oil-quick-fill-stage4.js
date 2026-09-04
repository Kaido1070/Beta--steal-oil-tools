/* Stage 4 — authoritative Oil / Hour Quick Fill component. */
(()=>{
  if(window.__STOT_OIL_QUICK_FILL_STAGE4__)return;
  window.__STOT_OIL_QUICK_FILL_STAGE4__=true;

  const byId=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const drillIndex=()=>typeof drills!=='undefined'&&Array.isArray(drills)?drills:[];
  const refineryIndex=()=>typeof refineries!=='undefined'&&Array.isArray(refineries)?refineries:[];
  const tierIndex=()=>typeof TIER_OPTIONS!=='undefined'&&Array.isArray(TIER_OPTIONS)?TIER_OPTIONS:[];
  const rows=[{drill:'demonic',tier:0,count:1,hacker:550}];
  let reserveMeta=null;

  function cloneRows(input){
    if(typeof clonePlotRows==='function')return clonePlotRows(input||[]);
    return (Array.isArray(input)?input:[]).map(r=>({drill:r.drill,tier:Number(r.tier)||0,count:Math.max(1,Math.min(25,Math.floor(Number(r.count)||1))),hacker:Math.max(0,Number(r.hacker)||550)}));
  }
  function fp(value){
    if(typeof fpSize==='function')return fpSize(value);
    const m=String(value||'1x1').match(/^(\d+)x(\d+)$/);return m?[Number(m[1]),Number(m[2])]:[1,1];
  }
  function piecesFromRows(input){
    const pieces=[];
    for(const row of cloneRows(input)){
      const d=drillIndex().find(x=>x.id===row.drill);if(!d)continue;
      const [w,h]=fp(d.footprint),count=Math.max(0,Math.floor(Number(row.count)||0));
      for(let i=0;i<count;i++)pieces.push([w,h]);
    }
    return pieces;
  }
  function canPackPieces5x5(input){
    const pieces=input.map(([w,h])=>[Number(w),Number(h)]),area=pieces.reduce((sum,[w,h])=>sum+w*h,0);
    if(area>25)return false;
    pieces.sort((a,b)=>(b[0]*b[1])-(a[0]*a[1])||Math.max(b[0],b[1])-Math.max(a[0],a[1]));
    const grid=Array(25).fill(false),memo=new Set();
    const fits=(w,h,x,y)=>{if(x+w>5||y+h>5)return false;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;return true};
    const set=(w,h,x,y,value)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=value};
    function dfs(i){
      if(i===pieces.length)return true;
      const key=i+':'+grid.map(v=>v?1:0).join('');if(memo.has(key))return false;
      const [a,b]=pieces[i],orients=a===b?[[a,b]]:[[a,b],[b,a]];
      for(const [w,h] of orients)for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){
        if(!fits(w,h,x,y))continue;set(w,h,x,y,true);if(dfs(i+1))return true;set(w,h,x,y,false);
      }
      memo.add(key);return false;
    }
    return dfs(0);
  }
  function templateInfo(){
    const temp={rows:cloneRows(rows)};let cells=0;
    try{cells=typeof pieceList==='function'?pieceList(temp).area:piecesFromRows(temp.rows).reduce((sum,[w,h])=>sum+w*h,0)}catch(_){}
    const ok=typeof canPack5x5==='function'?canPack5x5(temp):canPackPieces5x5(piecesFromRows(temp.rows));
    return{cells,ok};
  }
  function refineryPieces(ref,qty){const [w,h]=fp(ref?.footprint);return Array.from({length:qty},()=>[w,h])}
  function rowLoss(row){
    const d=drillIndex().find(x=>x.id===row.drill);if(!d)return 0;
    const tier=Number(tierIndex()[Number(row.tier)||0]?.mult)||1;let base=Number(d.oil)||0;
    if(d.special==='heart')base=Math.max(0,Number(byId('layoutLikes')?.value)||0);
    if(d.special==='hacker')base=Math.max(0,Number(row.hacker)||550);
    if(d.special==='clock')base=1;
    let pet=1;try{if(typeof layoutPetMult==='function')pet=layoutPetMult(d)||1}catch(_){}
    return base*tier*pet;
  }
  function reservedVariant(template,ref,qty){
    const reserve=refineryPieces(ref,qty),reservedCells=reserve.reduce((sum,[w,h])=>sum+w*h,0);
    if(!canPackPieces5x5(reserve))return{ok:false,reason:'That refinery quantity cannot fit inside one 5×5 plot by itself.'};
    const original=cloneRows(template),fitsRows=value=>canPackPieces5x5([...piecesFromRows(value),...reserve]);
    if(fitsRows(original))return{ok:true,rows:original,removed:0,reservedCells};
    const counts=original.map(r=>r.count),losses=original.map(row=>Math.max(0,rowLoss(row))),start=counts.map(()=>0),key=v=>v.join(',');
    let frontier=[{v:start,loss:0}],seen=new Set([key(start)]),maxRemoved=counts.reduce((a,b)=>a+b,0);
    for(let depth=1;depth<=maxRemoved;depth++){
      const next=[];
      for(const state of frontier)for(let i=0;i<counts.length;i++){
        if(state.v[i]>=counts[i])continue;const v=state.v.slice();v[i]++;const k=key(v);if(seen.has(k))continue;seen.add(k);next.push({v,loss:state.loss+losses[i]});
      }
      next.sort((a,b)=>a.loss-b.loss);
      for(const state of next){
        const candidate=[];for(let i=0;i<original.length;i++){const remain=counts[i]-state.v[i];if(remain>0)candidate.push({...original[i],count:remain})}
        if(fitsRows(candidate))return{ok:true,rows:candidate,removed:depth,reservedCells};
      }
      frontier=next;if(!frontier.length)break;
    }
    return{ok:false,reason:'Could not create a valid reserved space in Plot 1 for that refinery setup.'};
  }

  function drillOptions(selected){return drillIndex().map(d=>`<option value="${esc(d.id)}" ${d.id===selected?'selected':''}>${esc(d.name)} • ${esc(d.footprint)}</option>`).join('')}
  function tierOptions(selected){return tierIndex().map((t,i)=>`<option value="${i}" ${i===Number(selected)?'selected':''}>${esc(t.name)} ×${t.mult}</option>`).join('')}
  function rowMarkup(row,index){
    return `<div class="v537-template-row" data-v537-row="${index}"><label>Drill<select data-v537-drill>${drillOptions(row.drill)}</select></label><label>Tier<select data-v537-tier>${tierOptions(row.tier)}</select></label><label>Count<input data-v537-count type="number" min="1" max="25" step="1" value="${row.count}" inputmode="numeric"></label><button class="v537-template-remove" data-v537-remove type="button" title="Remove">×</button></div>`;
  }
  function renderTemplate(box){
    const host=box.querySelector('#v537TemplateRows');if(!host)return;
    host.innerHTML=rows.map(rowMarkup).join('');
    host.querySelectorAll('[data-v537-row]').forEach(el=>{
      const i=Number(el.dataset.v537Row),row=rows[i];if(!row)return;
      el.querySelector('[data-v537-drill]').onchange=e=>{row.drill=e.target.value;updateTemplateFit(box)};
      el.querySelector('[data-v537-tier]').onchange=e=>{row.tier=Math.max(0,Math.min(4,Number(e.target.value)||0));updateTemplateFit(box)};
      el.querySelector('[data-v537-count]').oninput=e=>{row.count=Math.max(1,Math.min(25,Math.floor(Number(e.target.value)||1)));e.target.value=row.count;updateTemplateFit(box)};
      el.querySelector('[data-v537-remove]').onclick=()=>{if(rows.length===1)rows[0]={drill:'demonic',tier:0,count:1,hacker:550};else rows.splice(i,1);renderTemplate(box)};
    });
    updateTemplateFit(box);
  }
  function updateTemplateFit(box){
    const info=templateInfo(),el=box.querySelector('#v537TemplateFit'),apply=box.querySelector('#v537QuickApply');if(!el)return;
    el.innerHTML=`<span>Template Plot</span><strong>${info.ok?`${info.cells} / 25 cells`:`Doesn't fit 5×5`}</strong>`;
    const strong=el.querySelector('strong');if(strong)strong.style.color=info.ok?'':'#ff9aaf';if(apply)apply.disabled=!info.ok;
  }

  function ensureBox(){
    const view=byId('oilView');if(!view)return null;
    let box=byId('v536QuickFill');
    if(!box){box=document.createElement('div');box.id='v536QuickFill';box.className='panel v536-quick-fill';view.appendChild(box)}
    return box;
  }
  function buildUI(){
    const box=ensureBox();if(!box)return null;
    if(box.dataset.stage4QuickFill==='1')return box;
    box.dataset.stage4QuickFill='1';box.dataset.v537='stage4';box.classList.add('v537-quick-fill','v593-quick-flow');
    const areas=(typeof LAYOUT_AREAS!=='undefined'?LAYOUT_AREAS:[]).map(a=>`<option value="${esc(a.id)}">${esc(a.name)} only</option>`).join('');
    const refs=refineryIndex().map((r,i)=>`<option value="${i}" ${r.name==='Infinity Refinery'?'selected':''}>${esc(r.name)} • ${esc(r.footprint)}</option>`).join('');
    box.innerHTML=`<div class="v536-qf-head"><strong>Quick Fill</strong><span>Build one plot template, then reuse it</span></div><div class="v537-template-head"><strong>Template Plot</strong><span>Add one or more drill rows</span></div><div id="v537TemplateRows"></div><button id="v537AddTemplateRow" type="button">+ Add Drill to Template</button><div class="v537-template-fit" id="v537TemplateFit"></div><div class="v537-reserve"><label class="v537-checkline"><input id="v537ReserveToggle" type="checkbox"> Reserve space for Refinery in ×1 Plot 1</label><div id="v537ReserveFields"><label>Refinery Type<select id="v537Refinery">${refs}</select></label><label>Quantity<input id="v537RefineryQty" type="number" min="1" max="25" step="1" value="1" inputmode="numeric"></label></div><div class="v537-reserve-note">Optional. The refinery is not added to the layout; Quick Fill only leaves enough real 5×5 space for it in Forest Plot 1.</div></div><div class="v537-qf-target"><label>Fill empty plots in<select id="v537QuickTarget"><option value="all">All Areas</option>${areas}</select></label><button id="v537QuickApply" type="button">Fill Empty Plots</button></div><div id="v537QuickStatus">Only empty plots are changed.</div>`;
    renderTemplate(box);
    box.querySelector('#v537AddTemplateRow').onclick=()=>{rows.push({drill:'demonic',tier:0,count:1,hacker:550});renderTemplate(box)};
    const toggle=box.querySelector('#v537ReserveToggle'),fields=box.querySelector('#v537ReserveFields');toggle.onchange=()=>fields.classList.toggle('show',toggle.checked);
    box.querySelector('#v537QuickApply').onclick=()=>applyQuickFill(box);
    return box;
  }

  function applyQuickFill(box){
    const status=box.querySelector('#v537QuickStatus');status.className='';
    if(typeof layoutPlots==='undefined'){status.textContent='Oil layout is not ready yet.';status.classList.add('bad');return}
    const info=templateInfo();if(!rows.length||!info.ok){status.textContent='Fix the Template Plot first — it must fit inside one 5×5 plot.';status.classList.add('bad');return}
    const area=box.querySelector('#v537QuickTarget').value,reserveOn=box.querySelector('#v537ReserveToggle').checked;
    const forest1=layoutPlots.find(p=>p.area==='forest'&&Number(p.index)===1)||layoutPlots.find(p=>Number(p.mult)===1&&Number(p.index)===1);
    let reserved=null;
    if(reserveOn){
      if(area!=='all'&&area!=='forest'){status.textContent='Refinery space can only be reserved when All Areas or Forest is selected.';status.classList.add('bad');return}
      if(!forest1){status.textContent='Could not find ×1 Plot 1.';status.classList.add('bad');return}
      if(forest1.rows.length){status.textContent='×1 Plot 1 is not empty. Clear it first so Quick Fill can create the reserved space safely.';status.classList.add('bad');return}
      const refs=refineryIndex(),idx=Math.max(0,Math.min(refs.length-1,Number(box.querySelector('#v537Refinery').value)||0)),ref=refs[idx];
      const qty=Math.max(1,Math.min(25,Math.floor(Number(box.querySelector('#v537RefineryQty').value)||1)));box.querySelector('#v537RefineryQty').value=qty;
      if(!ref){status.textContent='No refinery data is available.';status.classList.add('bad');return}
      reserved=reservedVariant(rows,ref,qty);if(!reserved.ok){status.textContent=reserved.reason;status.classList.add('bad');return}reserved.ref=ref;reserved.qty=qty;
    }
    const targets=layoutPlots.filter(p=>p.rows.length===0&&(area==='all'||p.area===area));
    if(!targets.length){status.textContent='No empty plots found in that selection.';status.classList.add('bad');return}
    for(const p of targets)p.rows=reserveOn&&p===forest1?cloneRows(reserved.rows):cloneRows(rows);
    reserveMeta=reserveOn?{plotId:forest1.id,cells:reserved.reservedCells,qty:reserved.qty,name:reserved.ref.name,removed:reserved.removed}:null;
    window.STOT_REFINERY_RESERVE=reserveOn?{plotId:forest1.id,pieces:refineryPieces(reserved.ref,reserved.qty),qty:reserved.qty,name:reserved.ref.name}:null;
    if(typeof renderLayout==='function')renderLayout();decorateReservedPlot();
    let message=`Filled ${targets.length} empty plot${targets.length===1?'':'s'} from the template.`;
    if(reserveOn)message+=` ×1 Plot 1 kept ${reserved.reservedCells} cells of usable 5×5 space for ${reserved.qty} × ${reserved.ref.name}${reserved.removed?` by removing ${reserved.removed} drill${reserved.removed===1?'':'s'} there only`:''}.`;
    status.textContent=message;status.classList.add('ok');
    window.STOT_OIL_PAGE_CONTROLLER?.sync?.();
  }

  function decorateReservedPlot(){
    if(!reserveMeta)return;
    const card=document.querySelector(`#layoutAreas .plot-card[data-plot="${reserveMeta.plotId}"]`),status=card?.querySelector('.plot-status');if(!status)return;
    status.classList.add('v537-reserved');if(!status.querySelector('small'))status.insertAdjacentHTML('beforeend',`<small>${reserveMeta.cells} cells reserved • refinery not added</small>`);
  }
  function installRenderHook(){
    if(typeof renderLayout!=='function'||renderLayout.__stage4QuickFillWrapped)return false;
    const original=renderLayout,wrapped=function(){const result=original.apply(this,arguments);setTimeout(decorateReservedPlot,0);return result};wrapped.__stage4QuickFillWrapped=true;renderLayout=wrapped;return true;
  }
  function mount(){const box=buildUI();if(!box)return false;installRenderHook();decorateReservedPlot();window.STOT_OIL_PAGE_CONTROLLER?.sync?.();return true}
  function boot(){let tries=0;const run=()=>{tries++;if(mount()||tries>=100)return;setTimeout(run,80)};run()}

  window.STOT_OIL_QUICK_FILL=Object.freeze({mount,refresh:()=>renderTemplate(buildUI()),get template(){return cloneRows(rows)},get reserve(){return reserveMeta?{...reserveMeta}:null}});
  document.querySelector('.tabs button[data-view="oil"]')?.addEventListener('click',()=>setTimeout(mount,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
