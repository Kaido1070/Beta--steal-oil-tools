/* STOT Compare Presets — Stage 3 isolated page controller */
(() => {
  if (window.__STOT_COMPARE_PRESETS_STAGE3__) return;
  window.__STOT_COMPARE_PRESETS_STAGE3__ = true;

  const clone = value => JSON.parse(JSON.stringify(value));
  const byId = id => document.getElementById(id);
  const clampInt = (value, min, max, fallback=min) => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.trunc(n))) : fallback;
  };
  const forgedData=window.STOT_FORGED_DRILLS||null;
  const celestial=forgedData?.celestial||null;
  const forgedTiers=forgedData?.tiers||['Default','Gold','Diamond','Rainbow','Galaxy'];
  const compareDrill=id=>celestial&&id===celestial.id?celestial:drills.find(d=>d.id===id);
  const isForged=d=>Boolean(d&&d.category==='forged');
  const compareDrills=()=>celestial?[...drills,celestial]:drills.slice();
  const rowLevel=row=>clampInt(row?.level,1,5,1);
  const forgedLevelData=row=>celestial?.levels?.find(x=>x.level===rowLevel(row))||celestial?.levels?.[0]||null;
  const rowLimit=row=>isForged(compareDrill(row?.drill))?1:25;
  const cloneRows = rows => (Array.isArray(rows) ? rows : []).map(r => {
    const id=compareDrill(r?.drill)?r.drill:'demonic';
    const forged=isForged(compareDrill(id));
    return {
      drill:id,
      tier:clampInt(r?.tier,0,4,0),
      level:rowLevel(r),
      count:forged?1:clampInt(r?.count,1,25,1),
      hacker:Math.max(0,Number(r?.hacker)||550)
    };
  });

  const PLOTS = [
    ['forest-1','Forest',1],['forest-2','Forest',1],['forest-3','Forest',1],['forest-4','Forest',1],['forest-5','Forest',1],['forest-6','Forest',1],
    ['desert-1','Desert',2],['desert-2','Desert',2],['desert-3','Desert',2],
    ['volcano-side-1','Volcano Sides',3],['volcano-side-2','Volcano Sides',3],['volcano-core-1','Volcano Core',5],
    ['mountain-side-1','Mountain Sides',6],['mountain-side-2','Mountain Sides',6],['mountain-summit-1','Mountain Summit',10]
  ].map(([id,areaName,mult],index) => ({id,areaName,mult,index:index+1}));
  const PLOT_IDS = new Set(PLOTS.map(p => p.id));

  function emptyRowsState(){ return PLOTS.map(p => ({id:p.id,rows:[]})); }
  function cleanSetup(setup){
    setup = setup && typeof setup === 'object' ? setup : {};
    return {
      mole:String(clampInt(setup.mole,0,100,0)),
      fruit:String(clampInt(setup.fruit,0,100,0)),
      likes:String(Math.max(0,Math.trunc(Number(setup.likes)||0))),
      hours:String(Math.max(0,Number(setup.hours)||1)),
      target:String(Math.max(0,Number(setup.target)||1)),
      lobby:Number(setup.lobby)===2?2:1,
      targetUnit:[1e3,1e6,1e9,1e12].includes(Number(setup.targetUnit))?Number(setup.targetUnit):1e9,
      mode:setup.mode==='target'?'target':'time'
    };
  }
  function cleanState(state){
    const by = new Map((Array.isArray(state?.rows)?state.rows:[]).filter(x=>PLOT_IDS.has(x?.id)).map(x=>[x.id,cloneRows(x.rows)]));
    return {rows:PLOTS.map(p=>({id:p.id,rows:by.get(p.id)||[]})),setup:cleanSetup(state?.setup)};
  }

  function restoreOilOwnership(){
    const oil=byId('oilView');
    if(!oil)return;
    const intro=oil.querySelector(':scope > .panel.step');
    const controls=document.querySelector('.layout-controls');
    const modeTabs=byId('layoutModeTabs');
    const calc=modeTabs?.closest('.layout-control-card');
    if(controls&&controls.parentElement!==oil) oil.appendChild(controls);
    if(calc&&controls&&calc.parentElement!==controls) controls.appendChild(calc);

    const boosts=document.querySelector('.v520-boosts');
    const quick=byId('v536QuickFill');
    const advanced=byId('v536AdvancedTools');
    const areas=byId('layoutAreas');
    const note=document.querySelector('.layout-note');
    const parts=[boosts,controls,quick,advanced,areas,note].filter(Boolean);
    let anchor=intro;
    for(const el of parts){
      if(!anchor)break;
      if(el!==anchor.nextElementSibling) anchor.insertAdjacentElement('afterend',el);
      anchor=el;
    }
    controls?.classList.remove('v539-empty-controls');
    boosts?.classList.remove('v539-compare-boosts');
    boosts?.classList.add('v539-oil-boosts');
  }

  restoreOilOwnership();

  const legacyView=byId('layoutcompareView');
  if(!legacyView)return;
  const view=document.createElement('section');
  view.id='layoutcompareView';
  view.className='view';
  legacyView.replaceWith(view);

  const legacyPersist=window.STOT_LAYOUT_PERSIST;
  const legacyExport=legacyPersist?.exportState?.bind(legacyPersist);
  const legacyImport=legacyPersist?.importState?.bind(legacyPersist);
  const loaded=legacyExport?.()||{};
  let compareStates={
    A:cleanState(loaded.compareStates?.A),
    B:cleanState(loaded.compareStates?.B)
  };
  let compareRebirth={A:0,B:0};
  let activeSide=loaded.activeCompare==='B'?'B':'A';
  const BUILD_VERSION=window.STOT_CONFIG?.version||document.querySelector('meta[name="stot-local-version"]')?.content||'5.77';
  const SEPARATE_KEY=`stot-v${BUILD_VERSION}-compare-separate-boosts-v1`;
  let separate=false;
  try{separate=localStorage.getItem(SEPARATE_KEY)==='1'}catch(_){}
  let compareClipboard=null;
  let selectedPlotId=null;
  let mounting=false;
  const productionCore=window.STOT_LAYOUT_PRODUCTION;
  const rebirthLevel=value=>productionCore?.rebirthLevel?productionCore.rebirthLevel(value):clampInt(value,0,50,0);
  const rebirthBonus=value=>productionCore?.rebirthBonusPercent?productionCore.rebirthBonusPercent(value):rebirthLevel(value)*10;
  const rebirthMultiplier=value=>productionCore?.rebirthMultiplier?productionCore.rebirthMultiplier(value):1+(rebirthBonus(value)/100);

  if(legacyPersist){
    legacyPersist.exportState=function(){
      const base=legacyExport?.()||{};
      return {...base,compareStates:clone(compareStates),activeCompare:activeSide};
    };
    legacyPersist.importState=function(saved){
      if(!saved||typeof saved!=='object')return false;
      if(saved.compareStates?.A&&saved.compareStates?.B){
        compareStates={A:cleanState(saved.compareStates.A),B:cleanState(saved.compareStates.B)};
        activeSide=saved.activeCompare==='B'?'B':'A';
      }
      if(!view.classList.contains('active')&&saved.singleState&&legacyImport){
        const current=legacyExport?.()||{};
        legacyImport({singleState:saved.singleState,compareStates:current.compareStates||loaded.compareStates,activeCompare:current.activeCompare||'A'});
      }
      syncAll();
      return true;
    };
  }

  const style=document.createElement('style');
  style.textContent=`
    #layoutcompareView .v603-condition-grid{display:grid;gap:9px}
    #layoutcompareView .v603-mode-tabs,#layoutcompareView .v603-toggle{display:grid;grid-template-columns:1fr 1fr;gap:7px}
    #layoutcompareView .v603-mode-tabs button,#layoutcompareView .v603-toggle button{min-height:40px;border:1px solid var(--border,#2a3245);border-radius:10px;background:var(--panel-2,#171c27);color:inherit;font-weight:850}
    #layoutcompareView .v603-mode-tabs button.active,#layoutcompareView .v603-toggle button.active{background:var(--text,#f3f6ff);color:var(--bg,#0b0d14)}
    #layoutcompareView .v603-condition-pane{display:none}.v603-condition-pane.active{display:block!important}
    #layoutcompareView .v603-boost-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    #layoutcompareView .v603-boost-grid label,#layoutcompareView .v603-condition-pane label{display:grid;gap:5px;font-size:12px;color:var(--muted,#98a2b8)}
    #layoutcompareView .v603-boost-grid label small{font-size:9px;color:var(--muted,#98a2b8)}
    #layoutcompareView .v603-boost-grid input,#layoutcompareView .v603-condition-pane input{width:100%;min-height:42px}
    #layoutcompareView .v603-x2{display:flex;gap:6px;margin-top:8px}.v603-x2 button{flex:1;min-height:38px}
    #layoutcompareView .v603-qf-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:7px}.v603-qf-grid label{display:grid;gap:4px;font-size:11px;color:var(--muted,#98a2b8)}
    #layoutcompareView .v603-qf-actions{display:grid;grid-template-columns:1fr auto;gap:7px;margin-top:8px}
    #layoutcompareView .v603-advanced-body{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;padding-top:9px}
    #layoutcompareView .v603-note{color:var(--muted,#98a2b8);font-size:12px;padding:0 4px}
    #layoutcompareView .v572-plot-card{cursor:pointer}
    #v603ComparePlotEditor{position:fixed;inset:0;z-index:2147483005;display:none;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.62);padding:12px}
    #v603ComparePlotEditor.open{display:flex}
    #v603ComparePlotEditor .v572-editor-sheet{width:min(680px,100%);max-height:88dvh;overflow:auto}
    #v601CompareSticky{position:fixed!important;z-index:2147482999!important;left:50%!important;right:auto!important;top:auto!important;bottom:max(6px,env(safe-area-inset-bottom))!important;margin:0!important;transform:translate(-50%,calc(100% + 22px));width:min(470px,calc(100vw - 28px));min-height:48px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) auto;align-items:center;gap:8px;padding:6px 8px 6px 10px;border:1px solid rgba(157,92,255,.72);border-radius:13px;background:rgba(8,13,23,.96);box-shadow:0 12px 34px rgba(0,0,0,.34);color:#f4f2ff;opacity:0;pointer-events:none;transition:transform .2s ease,opacity .2s ease}
    #v601CompareSticky.show{transform:translate(-50%,0);opacity:1;pointer-events:auto}
    #v601CompareSticky .v601-side{display:flex;min-width:0;align-items:baseline;gap:6px}#v601CompareSticky small{font-size:8px;color:#9aa6bb;font-weight:850}#v601CompareSticky strong{font-size:16px;white-space:nowrap}#v601CompareSticky i{font-style:normal;border-radius:9px;background:#211b3e;color:#cfbdff;padding:8px 9px;font-size:8px;font-weight:950}
    @media(max-width:620px){#layoutcompareView .v603-boost-grid{grid-template-columns:1fr}#layoutcompareView .v603-qf-grid{grid-template-columns:1fr 1fr}#layoutcompareView .v603-qf-grid label:first-child{grid-column:1/-1}#layoutcompareView .v603-advanced-body{grid-template-columns:1fr}#v601CompareSticky{width:calc(100vw - 24px)}}
  `;
  document.head.appendChild(style);

  view.innerHTML=`
    <div class="panel v56-compare-intro"><div class="v56-hero"><div class="v56-hero-copy"><h2>Compare Presets</h2><p>Build Preset A and Preset B independently. Nothing on this page moves or changes your Oil / Hour workspace.</p></div></div></div>
    <div class="panel" id="v603PresetSwitch"><div class="ab-layout-switch"><button type="button" data-ab-layout="A">Preset A</button><button type="button" data-ab-layout="B">Preset B</button></div><div class="ab-editing" id="abEditing">Editing Preset A</div></div>
    <div class="panel v533-condition" id="v533Condition"><div class="v533-condition-head"><strong>Comparison Condition</strong><span>Shared by A and B</span></div><div id="v533ConditionHost"></div></div>
    <div class="panel v524-settings" id="v524CompareSettings"><div class="v524-settings-head"><div class="v524-settings-copy"><strong>Different Base Settings</strong><small>Keep Off to use the same boosts for both presets.</small></div><div class="v603-toggle" id="v603SeparateToggle"><button type="button" data-v524="shared">Off</button><button type="button" data-v524="separate">On</button></div></div><div class="v524-status" id="v524Status"></div></div>
    <div class="panel" id="v526EditorSwitch"><strong id="v526EditorHint">Editing Preset A · isolated visual editor</strong></div>
    <div class="panel v520-boosts" id="v520BoostsCompare"><div class="v520-boosts-title"><strong>Preset Boosts</strong><span></span><span class="v524-shared-badge"></span></div><div class="v603-boost-grid"><label>Mole Level<input id="compareLayoutMole" type="number" min="0" max="100" value="0"></label><label>Fruit Level<input id="compareLayoutFruit" type="number" min="0" max="100" value="0"></label><label>Heart Drill Likes<input id="compareLayoutLikes" type="number" min="0" value="0"></label><label>Rebirth Level <small id="compareLayoutRebirthBonus">+0% Production</small><input id="compareLayoutRebirth" type="number" min="0" max="50" step="1" value="0" inputmode="numeric" placeholder="0 - 50"></label><label>Admin Event Lobby<div class="v603-x2" id="compareLayoutX2"><button type="button" data-layoutx2="1">Off</button><button type="button" data-layoutx2="2">x2</button></div></label></div></div>
    <div class="panel v536-quick-fill" id="v536QuickFillCompare"><div class="v536-qf-head"><strong>Quick Fill</strong><span>Compare-only preset builder</span></div><div class="v603-qf-grid"><label>Drill<select id="compareQuickDrill"></select></label><label>Tier<select id="compareQuickTier"></select></label><label id="compareQuickLevelField" hidden>Level<select id="compareQuickLevel"></select></label><label>Count<input id="compareQuickCount" type="number" min="1" max="25" value="1"></label></div><div class="v603-qf-actions"><select id="compareQuickTarget"><option value="all">All Areas</option><option value="forest">Forest</option><option value="desert">Desert</option><option value="volcano-side">Volcano Sides</option><option value="volcano-core">Volcano Core</option><option value="mountain-side">Mountain Sides</option><option value="mountain-summit">Mountain Summit</option></select><button id="compareQuickApply" type="button">Fill Empty Plots</button></div><div id="compareQuickStatus">Only the active preset is changed.</div></div>
    <details class="v536-advanced" id="v536AdvancedToolsCompare"><summary>Advanced Tools <span>Compare-only copy • paste • clear</span></summary><div class="v603-advanced-body"><button id="compareCopyPreset" type="button">Copy Preset</button><button id="comparePastePreset" type="button">Paste Preset</button><button id="compareClearPreset" type="button">Clear Preset</button></div></details>
    <section class="panel v572-visual-builder" id="layoutVisualBuilderCompare" data-builder-scope="compare"></section>
    <div class="v603-note">Compare Presets has its own A/B data, boosts, calculator and editor. Oil / Hour remains untouched.</div>
    <div class="panel ab-compare"><div class="ab-compare-head"><strong>Preset Comparison</strong><small id="v523ModeBadge">Time → Oil</small></div><div class="v523-sides"><div class="v523-side"><span class="v523-side-name">Preset A</span><strong class="v523-current" id="abRateA">0/s</strong><span class="v523-mode-label" id="v523LabelA">Oil in 1 Hour</span><strong class="v523-mode-value" id="v523ValueA">0</strong><span class="v523-extra" id="v523ExtraA">End rate: 0/s</span></div><div class="v523-side"><span class="v523-side-name">Preset B</span><strong class="v523-current" id="abRateB">0/s</strong><span class="v523-mode-label" id="v523LabelB">Oil in 1 Hour</span><strong class="v523-mode-value" id="v523ValueB">0</strong><span class="v523-extra" id="v523ExtraB">End rate: 0/s</span></div></div><div class="v523-compare-context" id="v523Context"></div><div class="ab-winner" id="abWinner">Add drills to A and B to compare</div><div class="v523-diff"><div class="ab-metric"><span>Current Difference</span><strong id="abDiffRate">0/s</strong></div><div class="ab-metric"><span id="v523DiffLabel">Oil Difference</span><strong id="abDiffHour">0</strong></div><div class="ab-metric"><span>Cells A / B</span><strong id="abCells">0 / 0</strong></div></div></div>
    <div class="v56-compare-actions"><button class="v56-share-compare" id="v56ShareCompare" type="button">Share Comparison</button></div>`;

  const conditionHost=byId('v533ConditionHost');
  conditionHost.innerHTML=`<div class="v603-condition-grid"><div class="v603-mode-tabs" id="compareLayoutModeTabs"><button type="button" data-layoutmode="time">Time → Oil</button><button type="button" data-layoutmode="target">Oil → Time</button></div><div class="v603-condition-pane" id="compareLayoutTimePane"><label>Run Time (hours)<input id="compareLayoutHours" inputmode="decimal" value="1"></label></div><div class="v603-condition-pane" id="compareLayoutTargetPane"><label>Target Oil<input id="compareLayoutTarget" inputmode="decimal" value="1"></label><div class="presets units" id="compareLayoutTargetUnits"><button class="chip" data-layouttarget="1000">K</button><button class="chip" data-layouttarget="1000000">M</button><button class="chip" data-layouttarget="1000000000">B</button><button class="chip" data-layouttarget="1000000000000">T</button></div></div></div>`;

  function compareDrillOptions(selected){return compareDrills().map(d=>`<option value="${d.id}" ${d.id===selected?'selected':''}>${escapeHTML(d.name)} • ${d.footprint}</option>`).join('')}
  function compareTierOptions(selected,d){if(isForged(d))return forgedTiers.map((name,i)=>`<option value="${i}" ${i===Number(selected)?'selected':''}>${name}</option>`).join('');return TIER_OPTIONS.map((t,i)=>`<option value="${i}" ${i===Number(selected)?'selected':''}>${t.name} ×${t.mult}</option>`).join('')}
  function compareLevelOptions(selected){return (celestial?.levels||[]).map(x=>`<option value="${x.level}" ${x.level===Number(selected)?'selected':''}>Level ${x.level} • ${x.cost}</option>`).join('')}
  byId('compareQuickDrill').innerHTML=compareDrillOptions('demonic');
  byId('compareQuickLevel').innerHTML=compareLevelOptions(1);
  function syncQuickForged(){const d=compareDrill(byId('compareQuickDrill').value),forged=isForged(d);byId('compareQuickTier').innerHTML=compareTierOptions(clampInt(byId('compareQuickTier').value,0,4,0),d);byId('compareQuickLevelField').hidden=!forged;const count=byId('compareQuickCount');if(forged){count.value='1';count.max='1';count.disabled=true}else{count.max='25';count.disabled=false}}
  byId('compareQuickDrill').onchange=()=>{byId('compareQuickTier').value='0';syncQuickForged()};
  syncQuickForged();

  function activeState(){return compareStates[activeSide]}
  function rowsFor(state,id){return state.rows.find(x=>x.id===id)?.rows||[]}
  function plotModel(state,meta){return {...meta,rows:cloneRows(rowsFor(state,meta.id))}}
  function saveActiveRows(id,rows){const state=activeState(),entry=state.rows.find(x=>x.id===id);if(entry)entry.rows=cloneRows(rows);syncAll();view.dispatchEvent(new Event('change',{bubbles:true}));}
  function setupFor(side=activeSide){return compareStates[side].setup}

  function petMult(drill,setup){
    const ml=clampInt(setup.mole,0,100,0),fl=clampInt(setup.fruit,0,100,0);
    const mole=ml?petValue(pets.find(p=>p.id==='mole'),ml)/100:0;
    const fruit=(drill.id==='banana'&&fl)?petValue(pets.find(p=>p.id==='fruit'),fl)/100:0;
    return(1+mole)*(1+fruit);
  }
  function statsFor(state,side){
    const setup=state.setup;let staticRate=0,clockGrowth=0,cells=0,valid=true;
    const rebirth=rebirthMultiplier(compareRebirth[side]||0);
    for(const meta of PLOTS){
      const p=plotModel(state,meta),info=pieceList(p);cells+=Math.min(info.area,25);if(!canPack5x5(p)){valid=false;continue;}
      for(const row of p.rows){
        const d=compareDrill(row.drill);if(!d)continue;
        const forged=isForged(d),count=forged?1:clampInt(row.count,1,25,1);let base=Number(d.oil)||0;
        if(forged)base=Number(forgedLevelData(row)?.production?.[clampInt(row.tier,0,4,0)])||0;
        else if(d.special==='heart')base=Math.max(0,Number(setup.likes)||0);else if(d.special==='hacker')base=Math.max(0,Number(row.hacker)||550);
        const tierMult=forged?1:(TIER_OPTIONS[Number(row.tier)||0]?.mult||1);
        const mult=tierMult*meta.mult*count*petMult(d,setup)*(Number(setup.lobby)===2?2:1)*rebirth;
        if(d.special==='clock')clockGrowth+=mult;else staticRate+=base*mult;
      }
    }
    return{valid,staticRate,clockGrowth,now:valid?staticRate+clockGrowth:NaN,cells};
  }

  function packPlot(plot){
    const pieces=[];for(const row of plot.rows){const d=compareDrill(row.drill);if(!d)continue;const [w,h]=fpSize(d.footprint),count=isForged(d)?1:clampInt(row.count,1,25,1);for(let i=0;i<count;i++)pieces.push({row,d,w,h});}
    pieces.sort((a,b)=>(b.w*b.h)-(a.w*a.h));const grid=Array(25).fill(false),placed=[];
    const fits=(w,h,x,y)=>{if(x+w>5||y+h>5)return false;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;return true};
    const set=(w,h,x,y,v)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=v};
    function dfs(i){if(i===pieces.length)return true;const p=pieces[i],orients=p.w===p.h?[[p.w,p.h]]:[[p.w,p.h],[p.h,p.w]];for(const [w,h] of orients)for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){if(!fits(w,h,x,y))continue;set(w,h,x,y,true);placed[i]={...p,x,y,w,h};if(dfs(i+1))return true;placed[i]=null;set(w,h,x,y,false);}return false;}
    return dfs(0)?placed.filter(Boolean):null;
  }
  const cellsHtml=()=>'<div class="v572-grid-cells">'+Array.from({length:25},()=>'<span></span>').join('')+'</div>';
  function placementHtml(item){const name=String(item.d.name||'Drill').replace(/\s+Drill$/i,'').slice(0,7);return`<span class="v572-drill-block" style="grid-column:${item.x+1}/span ${item.w};grid-row:${item.y+1}/span ${item.h}"><b>${escapeHTML(name)}</b><small>${item.w}×${item.h}</small></span>`}
  function renderBuilder(){
    const shell=byId('layoutVisualBuilderCompare');if(!shell)return;const state=activeState();
    shell.innerHTML=`<div class="v572-builder-head"><div><h2>Visual Plot Builder</h2><p>Preset ${activeSide} has its own 15 plots. Tap a plot to edit it.</p></div><span>${state.rows.filter(p=>p.rows.length).length}/15 used</span></div><div class="v572-plot-map">${PLOTS.map(meta=>{const p=plotModel(state,meta),packed=packPlot(p),used=pieceList(p).area,ok=packed!==null;return`<button class="v572-plot-card ${ok?'':'invalid'}" data-compare-plot="${meta.id}" type="button"><span class="v572-plot-head"><strong>${meta.index} <em>${escapeHTML(meta.areaName)}</em></strong><i>×${meta.mult}</i></span><span class="v572-grid-stage">${cellsHtml()}<span class="v572-grid-placements">${(packed||[]).map(placementHtml).join('')}</span>${ok?'':'<span class="v572-invalid-label">Doesn\'t fit</span>'}</span><span class="v572-plot-foot"><span>${used?`${used}/25 cells`:'Empty'}</span><span>${p.rows.length?`${p.rows.length} drill type${p.rows.length===1?'':'s'}`:'Tap to build'}</span></span></button>`}).join('')}</div>`;
    shell.querySelectorAll('[data-compare-plot]').forEach(btn=>btn.onclick=()=>openEditor(btn.dataset.comparePlot));
  }

  function ensureEditor(){let modal=byId('v603ComparePlotEditor');if(modal)return modal;modal=document.createElement('div');modal.id='v603ComparePlotEditor';modal.innerHTML='<div class="v572-editor-sheet"><div id="v603CompareEditorBody"></div></div>';document.body.appendChild(modal);modal.addEventListener('click',e=>{if(e.target===modal)closeEditor()});return modal;}
  function editorRow(row,index){const d=compareDrill(row.drill)||drills[0],forged=isForged(d),level=forged?forgedLevelData(row):null;return`<div class="v572-editor-row" data-vrow="${index}"><label><span>Drill</span><select data-vdrill>${compareDrillOptions(row.drill)}</select></label><div class="v572-row-two"><label><span>Tier</span><select data-vtier>${compareTierOptions(row.tier,d)}</select></label><label><span>Count</span><input data-vcount type="number" min="1" max="${forged?1:25}" value="${forged?1:row.count}" ${forged?'disabled':''}></label></div>${forged?`<label><span>Level</span><select data-vlevel>${compareLevelOptions(rowLevel(row))}</select><small>${level?`${level.cost}${level.costLabel?` • ${level.costLabel}`:''}`:''}</small></label>`:d.special==='hacker'?`<label><span>Hacker Oil/s</span><input data-vhacker type="number" min="0" value="${row.hacker||550}"></label>`:''}<button class="v572-remove-row" data-vremove type="button">Remove</button></div>`}
  function renderEditor(){if(!selectedPlotId)return;const state=activeState(),meta=PLOTS.find(p=>p.id===selectedPlotId);if(!meta)return;const rows=cloneRows(rowsFor(state,meta.id)),model={...meta,rows},used=pieceList(model).area,ok=canPack5x5(model),body=ensureEditor().querySelector('#v603CompareEditorBody');body.innerHTML=`<div class="v572-editor-head"><div><small>Preset ${activeSide}</small><h3>${meta.index} ${escapeHTML(meta.areaName)} <span>×${meta.mult}</span></h3></div><button data-close type="button">×</button></div><div class="v572-editor-status ${ok?'ok':'bad'}"><strong>${ok?`${used} / 25 cells`:'Doesn\'t fit in 5×5'}</strong></div><div class="v572-editor-rows">${rows.length?rows.map(editorRow).join(''):'<div class="v572-empty-editor">No drills yet.</div>'}</div><div class="v572-editor-actions"><button data-add class="primary" type="button">+ Add Drill</button><button data-clear type="button">Clear Plot</button></div>`;
    body.querySelector('[data-close]').onclick=closeEditor;body.querySelector('[data-add]').onclick=()=>{rows.push({drill:'demonic',tier:0,level:1,count:1,hacker:550});saveActiveRows(meta.id,rows);renderEditor()};body.querySelector('[data-clear]').onclick=()=>{saveActiveRows(meta.id,[]);renderEditor()};
    body.querySelectorAll('[data-vrow]').forEach(el=>{const i=Number(el.dataset.vrow),row=rows[i];el.querySelector('[data-vdrill]').onchange=e=>{row.drill=e.target.value;row.tier=0;row.level=1;if(isForged(compareDrill(row.drill)))row.count=1;saveActiveRows(meta.id,rows);renderEditor()};el.querySelector('[data-vtier]').onchange=e=>{row.tier=Number(e.target.value)||0;saveActiveRows(meta.id,rows);renderEditor()};const count=el.querySelector('[data-vcount]');if(count&&!count.disabled)count.onchange=e=>{row.count=clampInt(e.target.value,1,rowLimit(row),1);saveActiveRows(meta.id,rows);renderEditor()};el.querySelector('[data-vremove]').onclick=()=>{rows.splice(i,1);saveActiveRows(meta.id,rows);renderEditor()};const h=el.querySelector('[data-vhacker]');if(h)h.onchange=e=>{row.hacker=Math.max(0,Number(e.target.value)||550);saveActiveRows(meta.id,rows)};const level=el.querySelector('[data-vlevel]');if(level)level.onchange=e=>{row.level=rowLevel({level:e.target.value});saveActiveRows(meta.id,rows);renderEditor()}});
  }
  function openEditor(id){selectedPlotId=id;ensureEditor().classList.add('open');renderEditor()}
  function closeEditor(){selectedPlotId=null;byId('v603ComparePlotEditor')?.classList.remove('open')}

  function syncSetupDom(){
    const setup=setupFor();byId('compareLayoutMole').value=setup.mole;byId('compareLayoutFruit').value=setup.fruit;byId('compareLayoutLikes').value=setup.likes;byId('compareLayoutRebirth').value=rebirthLevel(compareRebirth[activeSide]);byId('compareLayoutRebirthBonus').textContent=`+${rebirthBonus(compareRebirth[activeSide])}% Production`;byId('compareLayoutHours').value=setup.hours;byId('compareLayoutTarget').value=setup.target;
    view.querySelectorAll('#compareLayoutX2 [data-layoutx2]').forEach(b=>b.classList.toggle('active',Number(b.dataset.layoutx2)===Number(setup.lobby)));
    view.querySelectorAll('#compareLayoutModeTabs [data-layoutmode]').forEach(b=>b.classList.toggle('active',b.dataset.layoutmode===setup.mode));
    byId('compareLayoutTimePane').classList.toggle('active',setup.mode==='time');byId('compareLayoutTargetPane').classList.toggle('active',setup.mode==='target');
    view.querySelectorAll('#compareLayoutTargetUnits [data-layouttarget]').forEach(b=>b.classList.toggle('active',Number(b.dataset.layouttarget)===Number(setup.targetUnit)));
    view.querySelectorAll('[data-ab-layout]').forEach(b=>b.classList.toggle('active',b.dataset.abLayout===activeSide));
    byId('abEditing').textContent=`Editing Preset ${activeSide}`;byId('v526EditorHint').textContent=`Editing Preset ${activeSide} · isolated visual editor`;
    const badge=view.querySelector('.v524-shared-badge');if(badge)badge.textContent=separate?`Preset ${activeSide} settings`:'Shared A + B';
    const hint=view.querySelector('#v520BoostsCompare .v520-boosts-title span:not(.v524-shared-badge)');if(hint)hint.textContent=separate?'Boosts can differ by preset':'Same boosts applied to both presets';
    view.querySelectorAll('#v603SeparateToggle [data-v524]').forEach(b=>b.classList.toggle('active',b.dataset.v524===(separate?'separate':'shared')));
    byId('v524Status').innerHTML=separate?'<strong>Separate settings are On.</strong> A and B keep independent boosts.':'<strong>Shared settings are active.</strong> Boost changes are applied to both presets.';
  }

  function renderComparison(){
    const a=statsFor(compareStates.A,'A'),b=statsFor(compareStates.B,'B'),setup=setupFor();
    byId('abRateA').textContent=a.valid?rateFmt(a.now)+'/s':'—';byId('abRateB').textContent=b.valid?rateFmt(b.now)+'/s':'—';byId('abCells').textContent=`${a.cells} / ${b.cells}`;
    if(!a.valid||!b.valid){byId('abWinner').textContent='Fix the over-capacity plot before comparing';byId('abDiffRate').textContent='—';byId('abDiffHour').textContent='—';return;}
    const signed=n=>(n>0?'+':n<0?'−':'')+fmt(Math.abs(n));byId('abDiffRate').textContent=signed(b.now-a.now)+'/s';
    if(setup.mode==='target'){
      const target=Math.max(0,Number(setup.target)||0)*Number(setup.targetUnit),sa=timeForTarget(a.staticRate,a.clockGrowth,target),sb=timeForTarget(b.staticRate,b.clockGrowth,target),targetText=fmt(target);
      byId('v523ModeBadge').textContent='Oil → Time';byId('v523LabelA').textContent=`Time to ${targetText}`;byId('v523LabelB').textContent=`Time to ${targetText}`;byId('v523ValueA').textContent=timeText(sa);byId('v523ValueB').textContent=timeText(sb);byId('v523ExtraA').textContent=`Current: ${rateFmt(a.now)}/s`;byId('v523ExtraB').textContent=`Current: ${rateFmt(b.now)}/s`;byId('v523Context').textContent=`Both presets use target ${targetText}.`;byId('v523DiffLabel').textContent='Time Difference';byId('abDiffHour').textContent=Number.isFinite(sa)&&Number.isFinite(sb)?timeText(Math.abs(sa-sb)):'—';byId('abWinner').textContent=sa===sb?'Preset A and B reach the target at the same time':`Preset ${sa<sb?'A':'B'} reaches the target faster`;
    }else{
      const hours=Math.max(0,Number(setup.hours)||0),seconds=Math.floor(hours*3600),oa=totalOilForSeconds(a.staticRate,a.clockGrowth,seconds),ob=totalOilForSeconds(b.staticRate,b.clockGrowth,seconds),ea=a.staticRate+a.clockGrowth*(seconds+1),eb=b.staticRate+b.clockGrowth*(seconds+1),label=Math.abs(hours-1)<1e-9?'1 Hour':`${hours} Hours`;
      byId('v523ModeBadge').textContent='Time → Oil';byId('v523LabelA').textContent=`Oil in ${label}`;byId('v523LabelB').textContent=`Oil in ${label}`;byId('v523ValueA').textContent=fmt(oa);byId('v523ValueB').textContent=fmt(ob);byId('v523ExtraA').textContent=`End rate: ${rateFmt(ea)}/s`;byId('v523ExtraB').textContent=`End rate: ${rateFmt(eb)}/s`;byId('v523Context').textContent=`Both presets use the same run time: ${label}.`;byId('v523DiffLabel').textContent='Oil Difference';byId('abDiffHour').textContent=signed(ob-oa);if(oa===0&&ob===0)byId('abWinner').textContent='Add drills to A and B to compare';else if(Math.abs(oa-ob)<1e-9)byId('abWinner').textContent='Preset A and B produce the same oil';else{const best=ob>oa?'B':'A',hi=Math.max(oa,ob),lo=Math.min(oa,ob);byId('abWinner').textContent=lo>0?`Preset ${best} produces +${(((hi-lo)/lo)*100).toFixed(1)}% more`:`Preset ${best} produces more`;}
    }
  }

  function syncSticky(){const bar=ensureSticky(),target=view.querySelector('.ab-compare');bar.querySelector('[data-v601-a]').textContent=byId('abRateA')?.textContent||'0/s';bar.querySelector('[data-v601-b]').textContent=byId('abRateB')?.textContent||'0/s';let visible=false;if(target){const r=target.getBoundingClientRect();visible=r.bottom>64&&r.top<innerHeight-40;}bar.classList.toggle('show',view.classList.contains('active')&&!visible)}
  function ensureSticky(){let bar=byId('v601CompareSticky');if(!bar){bar=document.createElement('button');bar.id='v601CompareSticky';bar.type='button';bar.innerHTML='<span class="v601-side"><small>PRESET A</small><strong data-v601-a>0/s</strong></span><span class="v601-side"><small>PRESET B</small><strong data-v601-b>0/s</strong></span><i>Details ↓</i>';document.body.appendChild(bar);bar.onclick=()=>view.querySelector('.ab-compare')?.scrollIntoView({behavior:'smooth',block:'center'});}if(bar.parentElement!==document.body)document.body.appendChild(bar);return bar;}

  function syncAll(){if(mounting)return;mounting=true;try{syncSetupDom();renderBuilder();renderComparison();syncSticky();view.dataset.stage3CompareOwner='1';}finally{mounting=false}}

  view.querySelectorAll('[data-ab-layout]').forEach(btn=>btn.onclick=()=>{activeSide=btn.dataset.abLayout==='B'?'B':'A';closeEditor();syncAll();view.dispatchEvent(new Event('change',{bubbles:true}))});
  ['Mole','Fruit','Likes'].forEach(key=>{byId(`compareLayout${key}`).oninput=e=>{const prop=key.toLowerCase(),value=key==='Likes'?String(Math.max(0,Math.trunc(Number(e.target.value)||0))):String(clampInt(e.target.value,0,100,0));e.target.value=value;if(separate)compareStates[activeSide].setup[prop]=value;else{compareStates.A.setup[prop]=value;compareStates.B.setup[prop]=value;}syncAll()}});
  byId('compareLayoutRebirth').oninput=e=>{const value=rebirthLevel(e.target.value);e.target.value=String(value);if(separate)compareRebirth[activeSide]=value;else{compareRebirth.A=value;compareRebirth.B=value;}syncAll()};
  view.querySelectorAll('#compareLayoutX2 [data-layoutx2]').forEach(btn=>btn.onclick=()=>{const value=Number(btn.dataset.layoutx2)===2?2:1;if(separate)compareStates[activeSide].setup.lobby=value;else{compareStates.A.setup.lobby=value;compareStates.B.setup.lobby=value;}syncAll()});
  view.querySelectorAll('#compareLayoutModeTabs [data-layoutmode]').forEach(btn=>btn.onclick=()=>{const mode=btn.dataset.layoutmode==='target'?'target':'time';compareStates.A.setup.mode=mode;compareStates.B.setup.mode=mode;syncAll()});
  byId('compareLayoutHours').oninput=e=>{const value=String(Math.max(0,Number(e.target.value)||0));compareStates.A.setup.hours=value;compareStates.B.setup.hours=value;renderComparison();syncSticky()};
  byId('compareLayoutTarget').oninput=e=>{const value=String(Math.max(0,Number(e.target.value)||0));compareStates.A.setup.target=value;compareStates.B.setup.target=value;renderComparison();syncSticky()};
  view.querySelectorAll('#compareLayoutTargetUnits [data-layouttarget]').forEach(btn=>btn.onclick=()=>{const value=Number(btn.dataset.layouttarget);compareStates.A.setup.targetUnit=value;compareStates.B.setup.targetUnit=value;syncAll()});
  view.querySelectorAll('#v603SeparateToggle [data-v524]').forEach(btn=>btn.onclick=()=>{const next=btn.dataset.v524==='separate';if(next===separate)return;const source=clone(compareStates[activeSide].setup),sourceRebirth=rebirthLevel(compareRebirth[activeSide]);compareStates.A.setup={...compareStates.A.setup,mole:source.mole,fruit:source.fruit,likes:source.likes,lobby:source.lobby};compareStates.B.setup={...compareStates.B.setup,mole:source.mole,fruit:source.fruit,likes:source.likes,lobby:source.lobby};compareRebirth.A=sourceRebirth;compareRebirth.B=sourceRebirth;separate=next;try{localStorage.setItem(SEPARATE_KEY,separate?'1':'0')}catch(_){}syncAll()});
  byId('compareQuickApply').onclick=()=>{const state=activeState(),drill=byId('compareQuickDrill').value,d=compareDrill(drill),forged=isForged(d),tier=clampInt(byId('compareQuickTier').value,0,4,0),level=forged?rowLevel({level:byId('compareQuickLevel').value}):1,count=forged?1:clampInt(byId('compareQuickCount').value,1,25,1),target=byId('compareQuickTarget').value,row={drill,tier,level,count,hacker:550},probe={rows:[row]},status=byId('compareQuickStatus');if(!canPack5x5(probe)){status.textContent='This setup does not fit inside one 5×5 plot.';return;}let changed=0;for(const meta of PLOTS){const entry=state.rows.find(x=>x.id===meta.id);const area=meta.id.replace(/-\d+$/,'');if(entry&&!entry.rows.length&&(target==='all'||area===target)){entry.rows=cloneRows([row]);changed++;}}status.textContent=changed?`Filled ${changed} empty plot${changed===1?'':'s'} in Preset ${activeSide}.`:'No empty plots found.';syncAll();view.dispatchEvent(new Event('change',{bubbles:true}))};
  byId('compareCopyPreset').onclick=()=>{compareClipboard=clone(activeState());byId('compareCopyPreset').textContent='Copied';setTimeout(()=>{if(byId('compareCopyPreset'))byId('compareCopyPreset').textContent='Copy Preset'},700)};
  byId('comparePastePreset').onclick=()=>{if(!compareClipboard)return;compareStates[activeSide]=cleanState(compareClipboard);syncAll();view.dispatchEvent(new Event('change',{bubbles:true}))};
  byId('compareClearPreset').onclick=()=>{compareStates[activeSide].rows=emptyRowsState();closeEditor();syncAll();view.dispatchEvent(new Event('change',{bubbles:true}))};
  byId('v56ShareCompare').onclick=()=>{renderComparison();const rows=[['Preset A',byId('abRateA').textContent],[byId('v523LabelA').textContent,byId('v523ValueA').textContent],['Preset B',byId('abRateB').textContent],[byId('v523LabelB').textContent,byId('v523ValueB').textContent],['Result',byId('abWinner').textContent],['Cells A / B',byId('abCells').textContent]],body=`<div class="share-section"><div class="share-section-title">Preset Comparison</div>${rows.map(([a,b])=>`<div class="share-line"><span>${escapeHTML(a)}</span><strong>${escapeHTML(b)}</strong></div>`).join('')}</div>`,text=['Preset Comparison',...rows.map(([a,b])=>`${a}: ${b}`)].join('\n');openSharePreview('Preset Comparison',body,text)};

  const layoutTab=document.querySelector('.tabs button[data-view="layoutcompare"]');
  if(layoutTab){layoutTab.textContent='Compare Presets';layoutTab.onclick=()=>{openView('layoutcompare');syncAll();window.scrollTo({top:0,behavior:'smooth'})};}
  if(typeof viewBadges!=='undefined')viewBadges.layoutcompare='Compare Presets';

  const legacyVisual=window.STOT_VISUAL_PLOT_BUILDER;
  if(legacyVisual){window.STOT_VISUAL_PLOT_BUILDER={...legacyVisual,mount(){legacyVisual.mount?.();return byId('layoutVisualBuilderCompare')},render(){if(view.classList.contains('active'))renderBuilder();else legacyVisual.render?.()},open(id){if(view.classList.contains('active'))openEditor(id);else legacyVisual.open?.(id)},close(){if(view.classList.contains('active'))closeEditor();else legacyVisual.close?.()}};}

  window.STOT_COMPARE_PRESETS_CONTROLLER=Object.freeze({mount(){syncAll();return true},syncSticky,pinSticky(){ensureSticky()}});
  window.STOT_COMPARE_PRESETS_ISOLATED=Object.freeze({get activeSide(){return activeSide},exportCompare(){return clone(compareStates)},oilNodesStayInOil:true});
  view.addEventListener('input',()=>requestAnimationFrame(syncSticky),true);view.addEventListener('change',()=>requestAnimationFrame(syncSticky),true);window.addEventListener('scroll',()=>requestAnimationFrame(syncSticky),{passive:true});window.addEventListener('resize',()=>requestAnimationFrame(syncSticky),{passive:true});
  ensureSticky();syncAll();
})();