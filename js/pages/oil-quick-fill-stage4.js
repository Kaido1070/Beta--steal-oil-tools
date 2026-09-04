/* Stage 4 — authoritative Oil / Hour Quick Fill component. */
(()=>{
  if(window.__STOT_OIL_QUICK_FILL_STAGE4__)return;
  const geometry=window.STOT_LAYOUT_GEOMETRY,rowCore=window.STOT_LAYOUT_ROWS;
  if(!geometry||!rowCore){console.error('STOT Stage 5 layout cores are missing before Oil Quick Fill');return;}
  window.__STOT_OIL_QUICK_FILL_STAGE4__=true;
  window.__STOT_OIL_USES_CORE_GEOMETRY__=true;
  window.__STOT_OIL_USES_CORE_ROWS__=true;

  const byId=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const drillIndex=()=>typeof drills!=='undefined'&&Array.isArray(drills)?drills:[];
  const refineryIndex=()=>typeof refineries!=='undefined'&&Array.isArray(refineries)?refineries:[];
  const tierIndex=()=>typeof TIER_OPTIONS!=='undefined'&&Array.isArray(TIER_OPTIONS)?TIER_OPTIONS:[];
  const canPackPieces5x5=geometry.canPackPieces5x5;
  const rows=[{drill:'demonic',tier:0,count:1,hacker:550}];
  let reserveMeta=null;

  const cloneRows=input=>rowCore.normalizeRows(input);
  const piecesFromRows=input=>rowCore.piecesFromRows(cloneRows(input),drillIndex());
  function templateInfo(){
    const temp={rows:cloneRows(rows)},pieces=piecesFromRows(rows);let cells=0;
    try{cells=typeof pieceList==='function'?pieceList(temp).area:geometry.piecesArea(pieces)}catch(_){cells=geometry.piecesArea(pieces)}
    return{cells,ok:canPackPieces5x5(pieces)};
  }
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
    const original=cloneRows(template);
    return rowCore.bestFitWithReserve({
      rows:original,
      reservePieces:rowCore.footprintPieces(ref?.footprint,qty),
      drillList:drillIndex(),
      losses:original.map(row=>Math.max(0,rowLoss(row)))
    });
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
    window.STOT_REFINERY_RESERVE=reserveOn?{plotId:forest1.id,pieces:rowCore.footprintPieces(reserved.ref?.footprint,reserved.qty),qty:reserved.qty,name:reserved.ref.name}:null;
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

  window.STOT_OIL_QUICK_FILL=Object.freeze({mount,refresh:()=>renderTemplate(buildUI()),geometryOwner:'core',rowsOwner:'core',reserveFitOwner:'core',get template(){return cloneRows(rows)},get reserve(){return reserveMeta?{...reserveMeta}:null}});
  document.querySelector('.tabs button[data-view="oil"]')?.addEventListener('click',()=>setTimeout(mount,0));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
