/* STOT Compare Presets — Oil feature parity, isolated A/B implementation */
(()=>{
  if(window.__STOT_COMPARE_FEATURE_PARITY__)return;
  window.__STOT_COMPARE_FEATURE_PARITY__=true;

  const byId=id=>document.getElementById(id);
  const clone=value=>JSON.parse(JSON.stringify(value));
  const clamp=(value,min,max,fallback=min)=>{const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):fallback};
  const esc=value=>String(value??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const drillIndex=()=>typeof drills!=='undefined'&&Array.isArray(drills)?drills:[];
  const refineryIndex=()=>typeof refineries!=='undefined'&&Array.isArray(refineries)?refineries:[];
  const tiers=()=>typeof TIER_OPTIONS!=='undefined'&&Array.isArray(TIER_OPTIONS)?TIER_OPTIONS:[];

  let template=[{drill:'demonic',tier:0,count:1,hacker:550}];
  let plotClipboard=null;
  let selectedPlotId=null;
  const reserveMeta={A:null,B:null};

  function activeSide(){return window.STOT_COMPARE_PRESETS_ISOLATED?.activeSide==='B'?'B':'A'}
  function snapshot(){return window.STOT_LAYOUT_PERSIST?.exportState?.()||null}
  function commit(saved){
    if(!saved||!window.STOT_LAYOUT_PERSIST?.importState)return false;
    window.STOT_LAYOUT_PERSIST.importState(saved);
    byId('layoutcompareView')?.dispatchEvent(new Event('change',{bubbles:true}));
    setTimeout(()=>{decorateReservedPlot();enhanceEditor();syncAdvancedButtons()},0);
    return true;
  }
  function activeState(saved=snapshot()){return saved?.compareStates?.[activeSide()]||null}
  function cleanRows(rows){
    return (Array.isArray(rows)?rows:[]).map(r=>({
      drill:drillIndex().some(d=>d.id===r?.drill)?r.drill:'demonic',
      tier:clamp(r?.tier,0,4,0),
      count:clamp(r?.count,1,25,1),
      hacker:Math.max(0,Number(r?.hacker)||550)
    }));
  }
  function fp(value){const m=String(value||'1x1').match(/^(\d+)x(\d+)$/);return m?[Number(m[1]),Number(m[2])]:[1,1]}
  function piecesFromRows(rows){
    const out=[];
    for(const row of cleanRows(rows)){
      const d=drillIndex().find(x=>x.id===row.drill);if(!d)continue;
      const [w,h]=fp(d.footprint);
      for(let i=0;i<row.count;i++)out.push([w,h]);
    }
    return out;
  }
  function canPackPieces5x5(input){
    const pieces=input.map(([w,h])=>[Number(w),Number(h)]);
    const area=pieces.reduce((sum,[w,h])=>sum+w*h,0);
    if(area>25)return false;
    pieces.sort((a,b)=>(b[0]*b[1])-(a[0]*a[1])||Math.max(b[0],b[1])-Math.max(a[0],a[1]));
    const grid=Array(25).fill(false),memo=new Set();
    const fits=(w,h,x,y)=>{if(x+w>5||y+h>5)return false;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;return true};
    const set=(w,h,x,y,value)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=value};
    function dfs(i){
      if(i===pieces.length)return true;
      const key=i+':'+grid.map(v=>v?1:0).join('');
      if(memo.has(key))return false;
      const [a,b]=pieces[i],orients=a===b?[[a,b]]:[[a,b],[b,a]];
      for(const [w,h] of orients)for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){
        if(!fits(w,h,x,y))continue;
        set(w,h,x,y,true);if(dfs(i+1))return true;set(w,h,x,y,false);
      }
      memo.add(key);return false;
    }
    return dfs(0);
  }
  function templateInfo(){
    const pieces=piecesFromRows(template);
    return {cells:pieces.reduce((sum,[w,h])=>sum+w*h,0),ok:canPackPieces5x5(pieces)};
  }
  function refineryPieces(ref,qty){const [w,h]=fp(ref?.footprint);return Array.from({length:qty},()=>[w,h])}

  function petMultiplier(d,setup){
    let mult=1;
    try{
      if(typeof pets!=='undefined'&&typeof petValue==='function'){
        const moleLevel=clamp(setup?.mole,0,100,0),fruitLevel=clamp(setup?.fruit,0,100,0);
        const mole=Array.isArray(pets)?pets.find(p=>p.id==='mole'):null;
        const fruit=Array.isArray(pets)?pets.find(p=>p.id==='fruit'):null;
        if(mole&&moleLevel)mult*=1+petValue(mole,moleLevel)/100;
        if(d?.id==='banana'&&fruit&&fruitLevel)mult*=1+petValue(fruit,fruitLevel)/100;
      }
    }catch(_){}
    return mult;
  }
  function rowLoss(row,setup){
    const d=drillIndex().find(x=>x.id===row.drill);if(!d)return 0;
    const tier=Number(tiers()[clamp(row.tier,0,4,0)]?.mult)||1;
    let base=Number(d.oil)||0;
    if(d.special==='heart')base=Math.max(0,Number(setup?.likes)||0);
    if(d.special==='hacker')base=Math.max(0,Number(row.hacker)||550);
    if(d.special==='clock')base=1;
    return base*tier*petMultiplier(d,setup);
  }
  function reservedVariant(rows,ref,qty,setup){
    const reserve=refineryPieces(ref,qty),reservedCells=reserve.reduce((sum,[w,h])=>sum+w*h,0);
    if(!canPackPieces5x5(reserve))return{ok:false,reason:'That refinery quantity cannot fit inside one 5×5 plot by itself.'};
    const original=cleanRows(rows),fitsRows=value=>canPackPieces5x5([...piecesFromRows(value),...reserve]);
    if(fitsRows(original))return{ok:true,rows:original,removed:0,reservedCells};
    const counts=original.map(r=>r.count),losses=original.map(r=>Math.max(0,rowLoss(r,setup))),start=counts.map(()=>0),key=v=>v.join(',');
    let frontier=[{v:start,loss:0}],seen=new Set([key(start)]);
    const maxRemoved=counts.reduce((a,b)=>a+b,0);
    for(let depth=1;depth<=maxRemoved;depth++){
      const next=[];
      for(const state of frontier){
        for(let i=0;i<counts.length;i++){
          if(state.v[i]>=counts[i])continue;
          const v=state.v.slice();v[i]++;const k=key(v);if(seen.has(k))continue;seen.add(k);
          next.push({v,loss:state.loss+losses[i]});
        }
      }
      next.sort((a,b)=>a.loss-b.loss);
      for(const state of next){
        const candidate=[];
        for(let i=0;i<original.length;i++){const remain=counts[i]-state.v[i];if(remain>0)candidate.push({...original[i],count:remain})}
        if(fitsRows(candidate))return{ok:true,rows:candidate,removed:depth,reservedCells};
      }
      frontier=next;if(!frontier.length)break;
    }
    return{ok:false,reason:'Could not create a valid reserved space in Plot 1 for that refinery setup.'};
  }

  function drillOptions(selected){return drillIndex().map(d=>`<option value="${esc(d.id)}" ${d.id===selected?'selected':''}>${esc(d.name)} • ${esc(d.footprint)}</option>`).join('')}
  function tierOptions(selected){return tiers().map((t,i)=>`<option value="${i}" ${i===Number(selected)?'selected':''}>${esc(t.name)} ×${t.mult}</option>`).join('')}
  function rowMarkup(row,index){
    const compat=index===0?{drill:' id="compareQuickDrill"',tier:' id="compareQuickTier"',count:' id="compareQuickCount"'}:{drill:'',tier:'',count:''};
    return `<div class="v537-template-row" data-compare-template-row="${index}"><label>Drill<select${compat.drill} data-compare-template-drill>${drillOptions(row.drill)}</select></label><label>Tier<select${compat.tier} data-compare-template-tier>${tierOptions(row.tier)}</select></label><label>Count<input${compat.count} data-compare-template-count type="number" min="1" max="25" step="1" value="${row.count}" inputmode="numeric"></label><button class="v537-template-remove" data-compare-template-remove type="button" title="Remove">×</button></div>`;
  }
  function renderTemplate(box){
    const host=box.querySelector('#compareTemplateRows');if(!host)return;
    host.innerHTML=template.map(rowMarkup).join('');
    host.querySelectorAll('[data-compare-template-row]').forEach(el=>{
      const i=Number(el.dataset.compareTemplateRow),row=template[i];if(!row)return;
      el.querySelector('[data-compare-template-drill]').onchange=e=>{row.drill=e.target.value;updateTemplateFit(box)};
      el.querySelector('[data-compare-template-tier]').onchange=e=>{row.tier=clamp(e.target.value,0,4,0);updateTemplateFit(box)};
      el.querySelector('[data-compare-template-count]').oninput=e=>{row.count=clamp(e.target.value,1,25,1);e.target.value=row.count;updateTemplateFit(box)};
      el.querySelector('[data-compare-template-remove]').onclick=()=>{if(template.length===1)template[0]={drill:'demonic',tier:0,count:1,hacker:550};else template.splice(i,1);renderTemplate(box)};
    });
    updateTemplateFit(box);
  }
  function updateTemplateFit(box){
    const info=templateInfo(),fit=box.querySelector('#compareTemplateFit'),apply=box.querySelector('#compareQuickApply');
    if(fit)fit.innerHTML=`<span>Template Plot</span><strong class="${info.ok?'':'bad'}">${info.ok?`${info.cells} / 25 cells`:`Doesn't fit 5×5`}</strong>`;
    if(apply)apply.disabled=!info.ok;
  }

  function quickFill(box){
    const saved=snapshot(),side=activeSide(),state=saved?.compareStates?.[side],status=box.querySelector('#compareQuickStatus');
    if(!state||!Array.isArray(state.rows)){status.textContent='Compare state is not ready yet.';status.className='bad';return}
    const info=templateInfo();if(!template.length||!info.ok){status.textContent='Fix the Template Plot first — it must fit inside one 5×5 plot.';status.className='bad';return}
    const target=box.querySelector('#compareQuickTarget')?.value||'all',reserveOn=!!box.querySelector('#compareReserveToggle')?.checked;
    const forest1=state.rows.find(p=>p.id==='forest-1'),selectionIncludesForest=target==='all'||target==='forest';
    let reserved=null;
    if(reserveOn){
      if(!selectionIncludesForest){status.textContent='Refinery space can only be reserved when All Areas or Forest is selected.';status.className='bad';return}
      if(!forest1){status.textContent='Could not find ×1 Plot 1.';status.className='bad';return}
      if(forest1.rows.length){status.textContent='×1 Plot 1 is not empty. Clear it first so Quick Fill can create the reserved space safely.';status.className='bad';return}
      const refs=refineryIndex(),idx=clamp(box.querySelector('#compareRefinery')?.value,0,Math.max(0,refs.length-1),0),ref=refs[idx];
      if(!ref){status.textContent='No refinery data is available.';status.className='bad';return}
      const qty=clamp(box.querySelector('#compareRefineryQty')?.value,1,25,1);box.querySelector('#compareRefineryQty').value=qty;
      reserved=reservedVariant(template,ref,qty,state.setup);
      if(!reserved.ok){status.textContent=reserved.reason;status.className='bad';return}
      reserved.ref=ref;reserved.qty=qty;
    }
    const targets=state.rows.filter(entry=>Array.isArray(entry.rows)&&entry.rows.length===0&&(target==='all'||String(entry.id).replace(/-\d+$/,'')===target));
    if(!targets.length){status.textContent='No empty plots found in that selection.';status.className='bad';return}
    for(const entry of targets)entry.rows=reserveOn&&entry.id==='forest-1'?cleanRows(reserved.rows):cleanRows(template);
    reserveMeta[side]=reserveOn?{plotId:'forest-1',cells:reserved.reservedCells,qty:reserved.qty,name:reserved.ref.name,removed:reserved.removed}:null;
    commit(saved);
    let msg=`Filled ${targets.length} empty plot${targets.length===1?'':'s'} in Preset ${side} from the template.`;
    if(reserveOn)msg+=` ×1 Plot 1 kept ${reserved.reservedCells} cells for ${reserved.qty} × ${reserved.ref.name}${reserved.removed?` by removing ${reserved.removed} drill${reserved.removed===1?'':'s'} there only`:''}.`;
    status.textContent=msg;status.className='ok';
  }

  function mountQuickFill(){
    const box=byId('v536QuickFillCompare');if(!box||box.dataset.featureParity==='1')return false;
    box.dataset.featureParity='1';box.classList.add('v537-quick-fill','v593-quick-flow');
    const refs=refineryIndex();
    const refOptions=refs.map((r,i)=>`<option value="${i}" ${r.name==='Infinity Refinery'?'selected':''}>${esc(r.name)} • ${esc(r.footprint)}</option>`).join('');
    box.innerHTML=`<div class="v536-qf-head"><strong>Quick Fill</strong><span>Build one plot template, then reuse it</span></div><div class="v537-template-head"><strong>Template Plot</strong><span>Add one or more drill rows</span></div><div id="compareTemplateRows"></div><button id="compareTemplateAdd" type="button">+ Add Drill to Template</button><div class="v537-template-fit" id="compareTemplateFit"></div><div class="v537-reserve"><label class="v537-checkline"><input id="compareReserveToggle" type="checkbox" ${refs.length?'':'disabled'}> Reserve space for Refinery in ×1 Plot 1</label><div id="compareReserveFields"><label>Refinery Type<select id="compareRefinery">${refOptions}</select></label><label>Quantity<input id="compareRefineryQty" type="number" min="1" max="25" step="1" value="1" inputmode="numeric"></label></div><div class="v537-reserve-note">Optional. The refinery is not added to the preset; Quick Fill only leaves enough real 5×5 space for it in Forest Plot 1.</div></div><div class="v537-qf-target"><label>Fill empty plots in<select id="compareQuickTarget"><option value="all">All Areas</option><option value="forest">Forest only</option><option value="desert">Desert only</option><option value="volcano-side">Volcano Sides only</option><option value="volcano-core">Volcano Core only</option><option value="mountain-side">Mountain Sides only</option><option value="mountain-summit">Mountain Summit only</option></select></label><button id="compareQuickApply" type="button">Fill Empty Plots</button></div><div id="compareQuickStatus">Only the active preset's empty plots are changed.</div>`;
    box.querySelector('#compareTemplateAdd').onclick=()=>{template.push({drill:'demonic',tier:0,count:1,hacker:550});renderTemplate(box)};
    const toggle=box.querySelector('#compareReserveToggle'),fields=box.querySelector('#compareReserveFields');
    toggle.onchange=()=>fields.classList.toggle('show',toggle.checked);
    box.querySelector('#compareQuickApply').onclick=()=>quickFill(box);
    renderTemplate(box);return true;
  }

  function enhanceBoosts(){
    const panel=byId('v520BoostsCompare');if(!panel||panel.dataset.featureParity==='1')return false;
    panel.dataset.featureParity='1';panel.classList.add('v543-friendly-boosts');
    const title=panel.querySelector('.v520-boosts-title');
    if(title){
      title.querySelector('strong').textContent='Preset Boosts';
      const hint=title.querySelector('span:not(.v524-shared-badge)');if(hint)hint.textContent='Mole • Fruit • Heart Likes • x2';
      const note=document.createElement('div');note.className='compare-boost-hint';note.textContent='Optional — leave these as they are if you do not use boosts';title.insertAdjacentElement('afterend',note);
    }
    const labels=[['compareLayoutMole','Mole Level'],['compareLayoutFruit','Fruit Level'],['compareLayoutLikes','Heart Likes']];
    for(const [id,text] of labels){const input=byId(id),label=input?.closest('label');if(!label)continue;label.classList.add('compare-boost-card');const node=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.nodeValue=text;}
    byId('compareLayoutX2')?.closest('label')?.classList.add('compare-boost-card');
    return true;
  }

  function enhanceCalculator(){
    const tabs=byId('compareLayoutModeTabs');if(!tabs||tabs.dataset.featureParity==='1')return false;
    tabs.dataset.featureParity='1';tabs.classList.add('v593-mode-grid');
    const time=tabs.querySelector('[data-layoutmode="time"]'),target=tabs.querySelector('[data-layoutmode="target"]');
    if(time){time.classList.add('v593-mode-choice');time.innerHTML='<strong>Time → Oil</strong><small>How much oil you’ll make</small>';}
    if(target){target.classList.add('v593-mode-choice');target.innerHTML='<strong>Oil → Time</strong><small>When you’ll reach your target</small>';}
    return true;
  }

  function syncAdvancedButtons(){
    ['comparePasteEmpty','comparePasteAll'].forEach(id=>{const btn=byId(id);if(btn)btn.disabled=!Array.isArray(plotClipboard)});
    const status=byId('compareAdvancedStatus');if(status&&!plotClipboard)status.textContent='Copy a plot from the Visual Plot Builder first.';
  }
  function applyClipboard(mode){
    if(!Array.isArray(plotClipboard))return;
    const saved=snapshot(),side=activeSide(),state=saved?.compareStates?.[side],status=byId('compareAdvancedStatus');if(!state)return;
    let changed=0;
    for(const entry of state.rows){
      if(mode==='empty'&&entry.rows.length)continue;
      entry.rows=cleanRows(plotClipboard);changed++;
    }
    reserveMeta[side]=null;commit(saved);
    if(status)status.textContent=`${mode==='empty'?'Pasted to':'Replaced'} ${changed} plot${changed===1?'':'s'} in Preset ${side}.`;
  }
  function clearAll(){
    const saved=snapshot(),side=activeSide(),state=saved?.compareStates?.[side],status=byId('compareAdvancedStatus');if(!state)return;
    state.rows.forEach(entry=>entry.rows=[]);reserveMeta[side]=null;commit(saved);
    if(status)status.textContent=`Cleared all 15 plots in Preset ${side}.`;
  }
  function mountAdvanced(){
    const tools=byId('v536AdvancedToolsCompare');if(!tools||tools.dataset.featureParity==='1')return false;
    tools.dataset.featureParity='1';tools.open=true;tools.classList.add('v590-advanced-inline');
    tools.innerHTML='<summary>Advanced Tools</summary><div class="v603-advanced-body"><button id="comparePasteEmpty" type="button">Paste Empty</button><button id="comparePasteAll" type="button">Paste All</button><button id="compareClearAll" type="button">Clear All</button></div><small id="compareAdvancedStatus">Copy a plot from the Visual Plot Builder first.</small>';
    byId('comparePasteEmpty').onclick=()=>applyClipboard('empty');byId('comparePasteAll').onclick=()=>applyClipboard('all');byId('compareClearAll').onclick=clearAll;syncAdvancedButtons();return true;
  }

  function enhanceEditor(){
    const modal=byId('v603ComparePlotEditor');if(!modal?.classList.contains('open')||!selectedPlotId)return false;
    const actions=modal.querySelector('.v572-editor-actions');if(!actions)return false;
    let copyBtn=actions.querySelector('[data-compare-copy-plot]');
    if(!copyBtn){
      copyBtn=document.createElement('button');copyBtn.type='button';copyBtn.dataset.compareCopyPlot='1';copyBtn.textContent='Copy Plot';
      actions.insertBefore(copyBtn,actions.querySelector('[data-clear]')||null);
      copyBtn.onclick=()=>{
        const state=activeState(),entry=state?.rows?.find(p=>p.id===selectedPlotId);if(!entry)return;
        plotClipboard=cleanRows(entry.rows);copyBtn.textContent='Copied';setTimeout(()=>{if(copyBtn.isConnected)copyBtn.textContent='Copy Plot'},700);syncAdvancedButtons();
        const status=byId('compareAdvancedStatus');if(status)status.textContent=`Copied ${selectedPlotId} from Preset ${activeSide()}.`;
      };
    }
    return true;
  }
  function decorateReservedPlot(){
    const meta=reserveMeta[activeSide()];if(!meta)return;
    const card=document.querySelector(`#layoutVisualBuilderCompare [data-compare-plot="${meta.plotId}"]`),foot=card?.querySelector('.v572-plot-foot');if(!foot||foot.querySelector('.compare-reserved-note'))return;
    const note=document.createElement('small');note.className='compare-reserved-note';note.textContent=`${meta.cells} cells reserved • refinery not added`;foot.appendChild(note);
  }

  function bindViewEvents(){
    const view=byId('layoutcompareView');if(!view||view.dataset.featureParityEvents==='1')return false;view.dataset.featureParityEvents='1';
    view.addEventListener('click',event=>{
      const plot=event.target.closest('[data-compare-plot]');if(plot){selectedPlotId=plot.dataset.comparePlot;setTimeout(enhanceEditor,0)}
      if(event.target.closest('[data-ab-layout]'))setTimeout(()=>{decorateReservedPlot();enhanceBoosts();syncAdvancedButtons()},0);
      if(event.target.closest('#v603ComparePlotEditor [data-add],#v603ComparePlotEditor [data-vremove],#v603ComparePlotEditor [data-clear]'))setTimeout(enhanceEditor,0);
    },true);
    return true;
  }

  function mount(){
    if(!byId('layoutcompareView')||!window.STOT_COMPARE_PRESETS_CONTROLLER)return false;
    enhanceCalculator();enhanceBoosts();mountQuickFill();mountAdvanced();bindViewEvents();decorateReservedPlot();return true;
  }
  function boot(){
    let tries=0;const run=()=>{tries++;if(mount()||tries>=100)return;setTimeout(run,80)};run();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
