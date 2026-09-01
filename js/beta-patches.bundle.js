/* STOT Beta consolidated patch runtime v5.59 */
window.__STOT_CONSOLIDATED_RUNTIME__='5.59';

/* ===== js/v539-01.js ===== */
try {
(() => {
  const AB_VERSION = "5.4";
  const cloneRows = rows => rows.map(r => ({drill:r.drill,tier:Number(r.tier)||0,count:Math.max(1,Math.min(25,Math.floor(Number(r.count)||1))),hacker:Math.max(0,Number(r.hacker)||550)}));
  function snapshotPlots(){return layoutPlots.map(p=>({id:p.id,rows:cloneRows(p.rows)}));}
  function applySnapshot(snapshot){const byId=new Map(snapshot.map(x=>[x.id,x.rows]));for(const p of layoutPlots)p.rows=cloneRows(byId.get(p.id)||[]);}
  const states={A:snapshotPlots(),B:snapshotPlots()};let activeLayout="A",switching=false;
  const css=document.createElement("style");css.textContent=`.ab-layout-switch{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ab-layout-switch button{min-height:46px;border:1px solid var(--border,#2a3245);border-radius:12px;background:var(--panel-2,#171c27);color:inherit;font-weight:800;font-size:14px}.ab-layout-switch button.active{background:var(--text,#f3f6ff);color:var(--bg,#0b0d14);border-color:transparent}.ab-editing{text-align:center;margin-top:8px;color:var(--muted,#98a2b8);font-size:12px;font-weight:700}.ab-compare{margin-bottom:12px}.ab-compare-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}.ab-compare-head strong{font-size:15px}.ab-compare-head small{color:var(--muted,#98a2b8)}.ab-scores{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ab-score{border:1px solid var(--border,#2a3245);border-radius:12px;padding:11px;background:var(--panel-2,#171c27)}.ab-score span,.ab-metric span{display:block;color:var(--muted,#98a2b8);font-size:11px}.ab-score strong{display:block;margin-top:4px;font-size:19px}.ab-winner{margin-top:8px;border-radius:12px;padding:10px;text-align:center;background:var(--panel-2,#171c27);font-weight:850}.ab-diff{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px}.ab-metric{border:1px solid var(--border,#2a3245);border-radius:11px;padding:9px}.ab-metric strong{display:block;margin-top:3px;font-size:13px}@media(max-width:620px){.ab-diff{grid-template-columns:1fr 1fr}.ab-diff .ab-metric:last-child{grid-column:1/-1}}.help-preview{height:100dvh;max-height:100dvh;padding-top:max(10px,env(safe-area-inset-top));padding-bottom:max(10px,env(safe-area-inset-bottom))}.help-sheet{max-height:calc(100dvh - max(20px,env(safe-area-inset-top)) - max(20px,env(safe-area-inset-bottom)));display:flex;flex-direction:column;overflow:hidden}.help-head{flex:0 0 auto}.help-content{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding-bottom:max(18px,env(safe-area-inset-bottom))}@supports not (height:100dvh){.help-preview{height:100vh;max-height:100vh}.help-sheet{max-height:calc(100vh - 20px)}}`;document.head.appendChild(css);
  const intro=document.querySelector("#oilView .oil-layout-intro");if(intro){const title=intro.querySelector("h2"),desc=intro.querySelector("p"),badge=intro.querySelector(".layout-badge");if(title)title.textContent="Oil Layout Compare";if(desc)desc.textContent="Build two layouts and compare them instantly.";if(badge)badge.textContent="A / B";}
  const firstOilPanel=document.querySelector("#oilView > .panel.step"),switchPanel=document.createElement("div");switchPanel.className="panel";switchPanel.innerHTML=`<div class="ab-layout-switch"><button type="button" data-ab-layout="A" class="active">Layout A</button><button type="button" data-ab-layout="B">Layout B</button></div><div class="ab-editing" id="abEditing">Editing Layout A</div>`;
  const comparePanel=document.createElement("div");comparePanel.className="panel ab-compare";comparePanel.innerHTML=`<div class="ab-compare-head"><strong>Layout Comparison</strong><small>Updates instantly</small></div><div class="ab-scores"><div class="ab-score"><span>Layout A</span><strong id="abRateA">0/s</strong></div><div class="ab-score"><span>Layout B</span><strong id="abRateB">0/s</strong></div></div><div class="ab-winner" id="abWinner">Add drills to A and B to compare</div><div class="ab-diff"><div class="ab-metric"><span>Difference / Second</span><strong id="abDiffRate">0/s</strong></div><div class="ab-metric"><span>Difference / 1 Hour</span><strong id="abDiffHour">0</strong></div><div class="ab-metric"><span>Cells A / B</span><strong id="abCells">0 / 0</strong></div></div>`;if(firstOilPanel){firstOilPanel.insertAdjacentElement("afterend",switchPanel);switchPanel.insertAdjacentElement("afterend",comparePanel);}
  function currentStateSummary(snapshot){let staticRate=0,clockGrowth=0,cells=0,usedPlots=0,valid=true;for(const basePlot of layoutPlots){const snap=snapshot.find(x=>x.id===basePlot.id),p={id:basePlot.id,area:basePlot.area,areaName:basePlot.areaName,mult:basePlot.mult,index:basePlot.index,rows:cloneRows(snap?.rows||[])};const info=pieceList(p);if(info.area>0)usedPlots++;cells+=Math.min(info.area,25);if(!canPack5x5(p)){valid=false;continue}for(const row of p.rows){const d=drills.find(x=>x.id===row.drill);if(!d)continue;const count=Math.max(0,Math.floor(Number(row.count)||0)),mult=rowTierMult(row)*p.mult*count*layoutPetMult(d)*layoutLobbyMult;if(d.special==="clock")clockGrowth+=mult;else staticRate+=rowOilBase(d,row)*mult;}}const now=valid?staticRate+clockGrowth:NaN,hourOil=valid?totalOilForSeconds(staticRate,clockGrowth,3600):NaN;return{valid,now,hourOil,cells,usedPlots};}
  function syncActive(){if(!switching)states[activeLayout]=snapshotPlots();}function signedFmt(n,suffix=""){if(!Number.isFinite(n))return"—";const sign=n>0?"+":n<0?"−":"";return sign+fmt(Math.abs(n))+suffix;}
  function renderComparison(){syncActive();const a=currentStateSummary(states.A),b=currentStateSummary(states.B);document.querySelector("#abRateA").textContent=a.valid?rateFmt(a.now)+"/s":"—";document.querySelector("#abRateB").textContent=b.valid?rateFmt(b.now)+"/s":"—";document.querySelector("#abCells").textContent=`${a.cells} / ${b.cells}`;const winner=document.querySelector("#abWinner"),diffRate=document.querySelector("#abDiffRate"),diffHour=document.querySelector("#abDiffHour");if(!a.valid||!b.valid){winner.textContent="Fix the over-capacity plot before comparing";diffRate.textContent="—";diffHour.textContent="—";return}const dRate=b.now-a.now,dHour=b.hourOil-a.hourOil;diffRate.textContent=signedFmt(dRate,"/s");diffHour.textContent=signedFmt(dHour);if(a.now===0&&b.now===0)winner.textContent="Add drills to A and B to compare";else if(Math.abs(a.now-b.now)<1e-9)winner.textContent="Layout A and B are equal";else{const best=b.now>a.now?"B":"A",high=Math.max(a.now,b.now),low=Math.min(a.now,b.now);winner.textContent=low<=0?`Layout ${best} is better`:`Layout ${best} is +${(((high-low)/low)*100).toFixed(1)}% better`;}}
  function switchTo(next){if(next===activeLayout)return;syncActive();switching=true;activeLayout=next;applySnapshot(states[activeLayout]);document.querySelectorAll("[data-ab-layout]").forEach(b=>b.classList.toggle("active",b.dataset.abLayout===activeLayout));document.querySelector("#abEditing").textContent=`Editing Layout ${activeLayout}`;const share=document.querySelector("#layoutShare");if(share)share.textContent=`Share Layout ${activeLayout}`;renderLayout();switching=false;renderComparison();}
  document.querySelectorAll("[data-ab-layout]").forEach(b=>b.addEventListener("click",()=>switchTo(b.dataset.abLayout)));const originalCalcLayout=calcLayout;calcLayout=function(){if(!switching)syncActive();const result=originalCalcLayout.apply(this,arguments);if(!switching)renderComparison();return result;};const share=document.querySelector("#layoutShare");if(share)share.textContent="Share Layout A";document.querySelectorAll(".layout-compare-panel,.quick-layout-compare,.qlc-panel").forEach(el=>el.remove());renderComparison();console.info(`STOT local A/B layout update v${AB_VERSION}`);
})();

(() => {const oil=document.querySelector("#oilView");if(!oil||oil.dataset.v56==="1")return;oil.dataset.v56="1";oil.classList.add("v56-single");const intro=oil.querySelector(".oil-layout-intro");if(intro){intro.classList.add("v56-single-only");intro.innerHTML=`<div class="v56-hero" style="width:100%"><div class="v56-hero-copy"><h2>Oil / Hour</h2><p>Build your layout, see your production per hour, and calculate how long you need to reach your goal.</p></div><button class="v56-compare-open" id="v56OpenCompare" type="button">Compare Layouts</button></div>`;}const controls=oil.querySelector(".layout-controls");if(!controls)return;const summary=document.createElement("div");summary.className="panel v56-summary v56-single-only";summary.innerHTML=`<div class="v56-summary-title"><strong>Your Production</strong><span>Updates instantly</span></div><div class="v56-summary-grid"><div class="v56-stat"><span>Current Oil / Second</span><strong id="v56Now">0/s</strong></div><div class="v56-stat"><span>Oil / Hour</span><strong id="v56Hour">0</strong></div><div class="v56-stat"><span>Oil in Selected Time</span><strong id="v56Timed">0</strong></div></div><div class="v56-goal"><div class="v56-stat"><span>Target Oil</span><strong id="v56Target">—</strong></div><div class="v56-stat"><span>Time to Reach Target</span><strong id="v56TargetTime">—</strong></div></div><button class="v56-share" id="v56ShareSingle" type="button">Share Layout Result</button>`;controls.parentNode.insertBefore(summary,controls);const editorHead=document.createElement("div");editorHead.className="v56-editor-head v56-single-only";editorHead.innerHTML="<strong>Oil Layout · 15 Plots</strong><span>Add drills below</span>";controls.parentNode.insertBefore(editorHead,controls);const comparePage=document.createElement("div");comparePage.className="v56-compare-page";comparePage.innerHTML=`<div class="panel v56-compare-intro"><div class="v56-hero"><div class="v56-hero-copy"><h2>Layout Compare</h2><p>Build Layout A and Layout B separately, then compare their production instantly.</p></div><button class="v56-back" id="v56Back" type="button">Back</button></div></div>`;const firstPanel=oil.querySelector(":scope > .panel.step");if(firstPanel)firstPanel.insertAdjacentElement("afterend",comparePage);const switchPanel=oil.querySelector(".ab-layout-switch")?.parentElement,comparePanel=oil.querySelector(".ab-compare");if(switchPanel)comparePage.appendChild(switchPanel);if(comparePanel)comparePage.appendChild(comparePanel);const actions=document.createElement("div");actions.className="v56-compare-actions";actions.innerHTML=`<button class="v56-a" id="v56GoA" type="button">Edit Layout A</button><button class="v56-share-compare" id="v56ShareCompare" type="button">Share Comparison</button>`;comparePage.appendChild(actions);function readText(selectors,fallback="—"){for(const s of selectors){const el=document.querySelector(s);if(el&&el.textContent.trim())return el.textContent.trim()}return fallback;}function updateSummary(){document.querySelector("#v56Now").textContent=readText(["#layoutNowRate",".layout-now-rate"],"0/s");document.querySelector("#v56Hour").textContent=readText(["#layoutHourOil",".layout-hour-oil"],"0");document.querySelector("#v56Timed").textContent=readText(["#layoutTimeOil",".layout-time-oil"],"0");document.querySelector("#v56Target").textContent=readText(["#layoutTargetDisplay",".layout-target-display","#layoutTarget"],"—");document.querySelector("#v56TargetTime").textContent=readText(["#layoutTargetTime",".layout-target-time"],"—");}function single(){oil.classList.remove("v56-compare");oil.classList.add("v56-single");const sh=document.querySelector("#layoutShare");if(sh)sh.style.display="";updateSummary();window.scrollTo({top:Math.max(0,oil.offsetTop-8),behavior:"smooth"});}function compare(){oil.classList.remove("v56-single");oil.classList.add("v56-compare");const sh=document.querySelector("#layoutShare");if(sh)sh.style.display="none";window.scrollTo({top:Math.max(0,oil.offsetTop-8),behavior:"smooth"});}document.querySelector("#v56OpenCompare")?.addEventListener("click",compare);document.querySelector("#v56Back")?.addEventListener("click",single);document.querySelector("#v56GoA")?.addEventListener("click",()=>document.querySelector('[data-ab-layout="A"]')?.click());document.querySelector("#v56ShareSingle")?.addEventListener("click",()=>document.querySelector("#layoutShare")?.click());document.querySelector("#v56ShareCompare")?.addEventListener("click",()=>{const a=readText(["#abRateA"],"—"),b=readText(["#abRateB"],"—"),win=readText(["#abWinner"],"—"),dr=readText(["#abDiffRate"],"—"),dh=readText(["#abDiffHour"],"—"),cells=readText(["#abCells"],"—"),esc=typeof escapeHTML==="function"?escapeHTML:(x=>String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))),body=`<div class="share-section"><div class="share-section-title">Layout Comparison</div><div class="share-line"><span>Layout A</span><strong>${esc(a)}</strong></div><div class="share-line"><span>Layout B</span><strong>${esc(b)}</strong></div><div class="share-line"><span>Result</span><strong>${esc(win)}</strong></div></div><div class="share-section"><div class="share-section-title">Difference</div><div class="share-line"><span>Per Second</span><strong>${esc(dr)}</strong></div><div class="share-line"><span>Per Hour</span><strong>${esc(dh)}</strong></div><div class="share-line"><span>Cells A / B</span><strong>${esc(cells)}</strong></div></div>`,text=["Layout Comparison",`Layout A: ${a}`,`Layout B: ${b}`,`Result: ${win}`,`Difference / Second: ${dr}`,`Difference / Hour: ${dh}`,`Cells A / B: ${cells}`].join("\n");if(typeof openSharePreview==="function")openSharePreview("Layout Comparison",body,text);});const obs=new MutationObserver(updateSummary);["#layoutNowRate","#layoutHourOil","#layoutTimeOil","#layoutTargetDisplay","#layoutTargetTime"].forEach(s=>{const el=document.querySelector(s);if(el)obs.observe(el,{subtree:true,childList:true,characterData:true});});oil.addEventListener("input",()=>setTimeout(updateSummary,0));oil.addEventListener("change",()=>setTimeout(updateSummary,0));updateSummary();})();
} catch (error) { console.error("STOT patch failed: js/v539-01.js", error); }

/* ===== js/v539-02.js ===== */
try {
(()=>{const oil=document.querySelector("#oilView"),drillsCompareBtn=document.querySelector('.tabs button[data-view="compare"]');if(!oil||!drillsCompareBtn||document.querySelector('[data-view="layoutcompare"]'))return;drillsCompareBtn.textContent="Compare Drills";const layoutBtn=document.createElement("button");layoutBtn.type="button";layoutBtn.dataset.view="layoutcompare";layoutBtn.textContent="Compare Layouts";drillsCompareBtn.insertAdjacentElement("afterend",layoutBtn);const layoutView=document.createElement("section");layoutView.id="layoutcompareView";layoutView.className="view";const databaseView=document.querySelector("#databaseView");(databaseView?.parentNode||document.querySelector("main")).insertBefore(layoutView,databaseView||null);const comparePage=oil.querySelector(".v56-compare-page");if(comparePage){comparePage.querySelector("h2").textContent="Compare Layouts";const p=comparePage.querySelector("p");if(p)p.textContent="Build Layout A and Layout B separately, then compare their production instantly.";layoutView.appendChild(comparePage);}const note=document.createElement("div");note.className="v57-view-note";note.textContent="A and B are separate layouts. Switch between them, edit the same 15 plots, and the comparison updates automatically.";if(comparePage)comparePage.insertAdjacentElement("afterend",note);else layoutView.appendChild(note);const editorHead=document.createElement("div");editorHead.className="v57-editor-head";editorHead.innerHTML='<strong id="v57Editing">Editing Layout A</strong><span>Same 15-plot editor</span>';layoutView.appendChild(editorHead);const controls=oil.querySelector(".layout-controls"),result=oil.querySelector(".result"),copyBar=oil.querySelector("#layoutCopyBar"),areas=oil.querySelector("#layoutAreas"),layoutNote=oil.querySelector(".layout-note"),editorParts=[controls,result,copyBar,areas,layoutNote].filter(Boolean),anchor=document.createElement("div");anchor.id="v57OilEditorAnchor";anchor.hidden=true;if(controls)controls.parentNode.insertBefore(anchor,controls);const compareHost=document.createElement("div");compareHost.id="v57CompareEditorHost";layoutView.appendChild(compareHost);const cloneRows=rows=>rows.map(r=>({drill:r.drill,tier:Number(r.tier)||0,count:Math.max(1,Math.min(25,Math.floor(Number(r.count)||1))),hacker:Math.max(0,Number(r.hacker)||550)})),snapRows=()=>layoutPlots.map(p=>({id:p.id,rows:cloneRows(p.rows)})),applyRows=snapshot=>{const map=new Map(snapshot.map(x=>[x.id,x.rows]));for(const p of layoutPlots)p.rows=cloneRows(map.get(p.id)||[]);},captureSetup=()=>({mole:document.querySelector("#layoutMole")?.value??"0",fruit:document.querySelector("#layoutFruit")?.value??"0",likes:document.querySelector("#layoutLikes")?.value??"0",hours:document.querySelector("#layoutHours")?.value??"1",target:document.querySelector("#layoutTarget")?.value??"1",lobby:typeof layoutLobbyMult!=="undefined"?layoutLobbyMult:1,targetUnit:typeof layoutTargetUnit!=="undefined"?layoutTargetUnit:1e9,mode:document.querySelector("#layoutTimePane")?.classList.contains("active")?"time":"target"}),applySetup=s=>{const set=(id,v)=>{const el=document.querySelector(id);if(el)el.value=v};set("#layoutMole",s.mole);set("#layoutFruit",s.fruit);set("#layoutLikes",s.likes);set("#layoutHours",s.hours);set("#layoutTarget",s.target);if(typeof layoutLobbyMult!=="undefined")layoutLobbyMult=Number(s.lobby)||1;if(typeof layoutTargetUnit!=="undefined")layoutTargetUnit=Number(s.targetUnit)||1e9;if(typeof activate==="function"){const x2=document.querySelector("#layoutX2");if(x2)activate(x2,"layoutx2",String(s.lobby));const tu=document.querySelector("#layoutTargetUnits");if(tu)activate(tu,"layouttarget",String(s.targetUnit));const mt=document.querySelector("#layoutModeTabs");if(mt)activate(mt,"layoutmode",s.mode);}const tp=document.querySelector("#layoutTimePane"),gp=document.querySelector("#layoutTargetPane");if(tp)tp.classList.toggle("active",s.mode==="time");if(gp)gp.classList.toggle("active",s.mode!=="time");};const emptyRows=snapRows().map(x=>({id:x.id,rows:[]}));let singleState={rows:snapRows(),setup:captureSetup()},compareStates={A:{rows:emptyRows.map(x=>({id:x.id,rows:[]})),setup:captureSetup()},B:{rows:emptyRows.map(x=>({id:x.id,rows:[]})),setup:captureSetup()}},activeCompare="A",mode="single";const saveCurrent=()=>{const state={rows:snapRows(),setup:captureSetup()};if(mode==="single")singleState=state;else compareStates[activeCompare]=state;},restoreState=state=>{applyRows(state.rows);applySetup(state.setup);renderLayout();},statFor=state=>{const currentRows=snapRows(),currentSetup=captureSetup();applyRows(state.rows);applySetup(state.setup);let staticRate=0,clockGrowth=0,cells=0,valid=true;for(const p of layoutPlots){const info=pieceList(p);cells+=Math.min(info.area,25);if(!canPack5x5(p)){valid=false;continue}const st=plotStats(p,0);staticRate+=st.staticRate;clockGrowth+=st.clockGrowth;}const now=valid?staticRate+clockGrowth:NaN,hour=valid?totalOilForSeconds(staticRate,clockGrowth,3600):NaN;applyRows(currentRows);applySetup(currentSetup);return{valid,now,hour,cells};},signed=n=>!Number.isFinite(n)?"—":(n>0?"+":n<0?"−":"")+fmt(Math.abs(n)),renderCompare=()=>{saveCurrent();const a=statFor(compareStates.A),b=statFor(compareStates.B),A=document.querySelector("#abRateA"),B=document.querySelector("#abRateB"),winner=document.querySelector("#abWinner"),dr=document.querySelector("#abDiffRate"),dh=document.querySelector("#abDiffHour"),cells=document.querySelector("#abCells");if(A)A.textContent=a.valid?rateFmt(a.now)+"/s":"—";if(B)B.textContent=b.valid?rateFmt(b.now)+"/s":"—";if(cells)cells.textContent=`${a.cells} / ${b.cells}`;if(!a.valid||!b.valid){if(winner)winner.textContent="Fix the over-capacity plot before comparing";if(dr)dr.textContent="—";if(dh)dh.textContent="—";return}if(dr)dr.textContent=signed(b.now-a.now)+"/s";if(dh)dh.textContent=signed(b.hour-a.hour);if(winner){if(a.now===0&&b.now===0)winner.textContent="Add drills to A and B to compare";else if(Math.abs(a.now-b.now)<1e-9)winner.textContent="Layout A and B are equal";else{const best=b.now>a.now?"B":"A",high=Math.max(a.now,b.now),low=Math.min(a.now,b.now);winner.textContent=low>0?`Layout ${best} is +${(((high-low)/low)*100).toFixed(1)}% better`:`Layout ${best} is better`;}}},setCompareSide=side=>{if(mode!=="compare"||side===activeCompare)return;compareStates[activeCompare]={rows:snapRows(),setup:captureSetup()};activeCompare=side;restoreState(compareStates[side]);document.querySelectorAll("[data-ab-layout]").forEach(b=>b.classList.toggle("active",b.dataset.abLayout===side));const e=document.querySelector("#abEditing");if(e)e.textContent=`Editing Layout ${side}`;const v=document.querySelector("#v57Editing");if(v)v.textContent=`Editing Layout ${side}`;renderCompare();};document.querySelectorAll("[data-ab-layout]").forEach(btn=>btn.addEventListener("click",e=>{if(mode!=="compare")return;e.preventDefault();e.stopImmediatePropagation();setCompareSide(btn.dataset.abLayout);},true));const moveToCompare=()=>editorParts.forEach(el=>compareHost.appendChild(el)),moveToOil=()=>{let ref=anchor;editorParts.forEach(el=>{ref.insertAdjacentElement("afterend",el);ref=el;});},showView=key=>{document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("active",x.dataset.view===key));document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));const view=document.querySelector("#"+key+"View");if(view)view.classList.add("active");const badge=document.querySelector("#badge");if(badge)badge.textContent=key==="layoutcompare"?"Layout Compare":key==="compare"?"Drill Compare":(typeof viewBadges!=="undefined"?viewBadges[key]:"Community Tools");};layoutBtn.onclick=()=>{saveCurrent();mode="compare";moveToCompare();restoreState(compareStates[activeCompare]);showView("layoutcompare");renderCompare();window.scrollTo({top:0,behavior:"smooth"});};document.querySelectorAll('.tabs button:not([data-view="layoutcompare"])').forEach(btn=>{const key=btn.dataset.view;btn.onclick=()=>{if(mode==="compare"){saveCurrent();mode="single";moveToOil();restoreState(singleState);}if(typeof openView==="function")openView(key);if(key==="compare")document.querySelector("#badge").textContent="Drill Compare";};});const shareBtn=document.querySelector("#v56ShareCompare");if(shareBtn){shareBtn.textContent="Share Comparison";shareBtn.addEventListener("click",()=>setTimeout(renderCompare,0),true);}layoutView.addEventListener("input",()=>setTimeout(()=>{if(mode==="compare")renderCompare()},0));layoutView.addEventListener("change",()=>setTimeout(()=>{if(mode==="compare")renderCompare()},0));layoutView.addEventListener("click",e=>{if(e.target.closest("[data-ab-layout]"))return;setTimeout(()=>{if(mode==="compare")renderCompare()},0);});window.STOT_LAYOUT_PERSIST={exportState(){saveCurrent();const clone=value=>JSON.parse(JSON.stringify(value));return{singleState:clone(singleState),compareStates:clone(compareStates),activeCompare};},importState(saved){if(!saved||typeof saved!=="object")return false;if(saved.singleState)singleState=saved.singleState;if(saved.compareStates?.A&&saved.compareStates?.B)compareStates={A:saved.compareStates.A,B:saved.compareStates.B};activeCompare=saved.activeCompare==="B"?"B":"A";if(mode==="single")restoreState(singleState);else restoreState(compareStates[activeCompare]);document.querySelectorAll("[data-ab-layout]").forEach(b=>b.classList.toggle("active",b.dataset.abLayout===activeCompare));const e=document.querySelector("#abEditing");if(e)e.textContent=`Editing Layout ${activeCompare}`;const v=document.querySelector("#v57Editing");if(v)v.textContent=`Editing Layout ${activeCompare}`;renderCompare();return true;}};oil.classList.remove("v56-compare");oil.classList.add("v56-single");const oldOpen=document.querySelector("#v56OpenCompare");if(oldOpen)oldOpen.remove();if(typeof viewBadges!=="undefined"){viewBadges.compare="Drill Compare";viewBadges.layoutcompare="Layout Compare";}})();

(()=>{if(document.documentElement.dataset.v59==="1")return;document.documentElement.dataset.v59="1";const editBtn=document.querySelector("#v56GoA"),editorHost=document.querySelector("#v57CompareEditorHost"),activeSide=()=>document.querySelector('[data-ab-layout].active')?.dataset.abLayout||(/Layout B/i.test(document.querySelector("#v57Editing")?.textContent||"")?"B":"A"),syncEditButton=()=>{if(editBtn)editBtn.textContent=`Edit Layout ${activeSide()}`;};document.querySelectorAll("[data-ab-layout]").forEach(btn=>btn.addEventListener("click",()=>setTimeout(syncEditButton,0)));if(editBtn)editBtn.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();syncEditButton();(editorHost||document.querySelector("#v57Editing"))?.scrollIntoView({behavior:"smooth",block:"start"});},true);syncEditButton();const refreshVisitorTimezone=()=>{const detected=Intl.DateTimeFormat().resolvedOptions().timeZone||"Local time",label=document.querySelector("#localTimezone");if(label)label.textContent=detected;if(typeof renderEvents==="function")renderEvents();};document.querySelector('.tabs button[data-view="events"]')?.addEventListener("click",()=>setTimeout(refreshVisitorTimezone,0));document.addEventListener("visibilitychange",()=>{if(!document.hidden&&document.querySelector("#eventsView.active"))refreshVisitorTimezone();});const drillView=document.querySelector("#drillsView"),drillResult=drillView?.querySelector(".result");if(drillView&&drillResult&&!document.querySelector("#v59DrillShare")){const btn=document.createElement("button");btn.id="v59DrillShare";btn.className="v59-drill-share";btn.type="button";btn.textContent="Share Drill Result";drillResult.appendChild(btn);btn.addEventListener("click",()=>{const textOf=(sel,fallback="—")=>document.querySelector(sel)?.textContent?.trim()||fallback,valOf=(sel,fallback="—")=>document.querySelector(sel)?.value??fallback,drill=typeof getDrill==="function"?getDrill():null,drillName=drill?.name||textOf("#drillPickerBtn"),tier=document.querySelector("#tierButtons .active")?.textContent?.trim()||"—",area=document.querySelector("#areaButtons .active")?.textContent?.trim()||"—",mole=valOf("#moleLevel","0"),fruit=valOf("#fruitLevel","0"),count=valOf("#drillCount","1"),hours=valOf("#drillHours","0"),rate=textOf("#drillMainRate"),perHour=textOf("#drillPerHour"),total=textOf("#drillTotal"),base=textOf("#drillBase"),mult=textOf("#drillMultiplier"),esc=typeof escapeHTML==="function"?escapeHTML:x=>String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m])),rows=[["Drill",drillName],["Tier",tier],["Production Area",area],["Mole Level",mole],["Fruit Level",fruit],["Number of Drills",count],["Run Time",`${hours}h`],["Production Rate",rate],["Oil / Hour",perHour],["Total Oil",total],["Base Drill",base],["Combined Multiplier",mult]],body=`<div class="share-section"><div class="share-section-title">Drill Result</div>${rows.map(([a,b])=>`<div class="share-line"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join("")}</div>`,plain=["Drill Result",...rows.map(([a,b])=>`${a}: ${b}`)].join("\n");if(typeof openSharePreview==="function")openSharePreview("Drill Result",body,plain);});}})();
} catch (error) { console.error("STOT patch failed: js/v539-02.js", error); }

/* ===== js/v539-03.js ===== */
try {
(()=>{const editBtn=document.querySelector("#v56GoA"),editingLabel=document.querySelector("#v57Editing"),abEditing=document.querySelector("#abEditing");if(!editBtn)return;const currentSide=()=>{const txt=`${editingLabel?.textContent||""} ${abEditing?.textContent||""}`;if(/Layout B/i.test(txt))return"B";if(/Layout A/i.test(txt))return"A";return document.querySelector('[data-ab-layout].active')?.dataset.abLayout||"A";},sync=()=>{editBtn.textContent=`Edit Layout ${currentSide()}`;};[editingLabel,abEditing].filter(Boolean).forEach(el=>new MutationObserver(sync).observe(el,{childList:true,characterData:true,subtree:true}));document.querySelectorAll("[data-ab-layout]").forEach(btn=>new MutationObserver(sync).observe(btn,{attributes:true,attributeFilter:["class"]}));sync();})();

(()=>{const shareBtn=document.querySelector("#layoutShare"),compareView=document.querySelector("#layoutcompareView"),editingLabel=document.querySelector("#v57Editing"),abEditing=document.querySelector("#abEditing");if(!shareBtn)return;const side=()=>{const txt=`${editingLabel?.textContent||""} ${abEditing?.textContent||""}`;if(/Layout B/i.test(txt))return"B";if(/Layout A/i.test(txt))return"A";return document.querySelector('[data-ab-layout].active')?.dataset.abLayout||"A";},inCompare=()=>compareView?.classList.contains("active"),syncShare=()=>{shareBtn.textContent=inCompare()?`Share Layout ${side()}`:"Share Layout";};[editingLabel,abEditing].filter(Boolean).forEach(el=>new MutationObserver(syncShare).observe(el,{childList:true,characterData:true,subtree:true}));document.querySelectorAll("[data-ab-layout]").forEach(btn=>new MutationObserver(syncShare).observe(btn,{attributes:true,attributeFilter:["class"]}));new MutationObserver(syncShare).observe(compareView,{attributes:true,attributeFilter:["class"]});syncShare();})();

(()=>{const areas=document.querySelector("#layoutAreas");if(!areas||typeof layoutPlots==="undefined")return;const cloneRowsV512=rows=>rows.map(r=>({drill:r.drill,tier:Number(r.tier)||0,count:Math.max(1,Math.min(25,Math.floor(Number(r.count)||1))),hacker:Math.max(0,Number(r.hacker)||550)}));function syncCardFromDom(card){const p=layoutPlots.find(x=>x.id===card?.dataset.plot);if(!p)return null;card.querySelectorAll(".plot-row").forEach(rowEl=>{const i=Number(rowEl.dataset.row),row=p.rows[i];if(!row)return;const drill=rowEl.querySelector("[data-rowdrill]"),tier=rowEl.querySelector("[data-rowtier]"),count=rowEl.querySelector("[data-rowcount]"),hacker=rowEl.querySelector("[data-hacker]");if(drill)row.drill=drill.value;if(tier)row.tier=Number(tier.value)||0;if(count){let n=Math.floor(Number(count.value));if(!Number.isFinite(n)||n<1)n=1;n=Math.min(25,n);row.count=n;if(String(count.value)!==String(n))count.value=n;}if(hacker)row.hacker=Math.max(0,Number(hacker.value)||550);});return p;}function refreshRealCells(card,p){if(!card||!p||typeof pieceList!=="function"||typeof canPack5x5!=="function")return;const used=pieceList(p).area,ok=canPack5x5(p),status=card.querySelector(".plot-status");if(status){status.className="plot-status "+(ok?"ok":"bad");status.textContent=ok?`${used} / 25 cells`:`${used} / 25 cells · Doesn't fit`;}}function refreshTotalRealCells(){const el=document.querySelector("#layoutCellsUsed");if(!el||typeof pieceList!=="function")return;const total=layoutPlots.reduce((sum,p)=>sum+pieceList(p).area,0);el.textContent=`${total} / 375`;}areas.addEventListener("input",e=>{const input=e.target.closest("[data-rowcount],[data-rowdrill],[data-rowtier],[data-hacker]");if(!input)return;const card=input.closest(".plot-card"),p=syncCardFromDom(card);if(!p)return;setTimeout(()=>{if(typeof updatePlotCard==="function")updatePlotCard(card,p);refreshRealCells(card,p);refreshTotalRealCells();},0);},true);areas.addEventListener("change",e=>{const input=e.target.closest("[data-rowcount],[data-rowdrill],[data-rowtier],[data-hacker]");if(!input)return;const card=input.closest(".plot-card"),p=syncCardFromDom(card);if(!p)return;setTimeout(()=>{if(typeof updatePlotCard==="function")updatePlotCard(card,p);refreshRealCells(card,p);refreshTotalRealCells();},0);},true);document.addEventListener("click",e=>{if(!e.target.closest("[data-add],[data-remove],[data-paste],#layoutPasteEmpty,#layoutPasteAll,[data-copy]"))return;setTimeout(()=>{document.querySelectorAll("#layoutAreas .plot-card").forEach(card=>{const p=layoutPlots.find(x=>x.id===card.dataset.plot);if(p)refreshRealCells(card,p);});refreshTotalRealCells();},0);});const emptyBtn=document.querySelector("#layoutPasteEmpty");if(emptyBtn&&!document.querySelector("#layoutPasteAll")){const allBtn=document.createElement("button");allBtn.id="layoutPasteAll";allBtn.type="button";allBtn.textContent="Paste to All Plots";allBtn.disabled=!Array.isArray(layoutCopiedRows);emptyBtn.insertAdjacentElement("afterend",allBtn);const syncPasteButtons=()=>{allBtn.disabled=!Array.isArray(layoutCopiedRows);};document.addEventListener("click",e=>{if(e.target.closest("[data-copy]"))setTimeout(syncPasteButtons,0);});allBtn.addEventListener("click",()=>{if(!Array.isArray(layoutCopiedRows))return;const copied=cloneRowsV512(layoutCopiedRows);for(const p of layoutPlots)p.rows=cloneRowsV512(copied);if(typeof renderLayout==="function")renderLayout();const status=document.querySelector("#layoutCopyStatus");if(status)status.textContent="Pasted to all 15 plots";syncPasteButtons();});}document.querySelectorAll("#layoutAreas .plot-card").forEach(card=>{const p=layoutPlots.find(x=>x.id===card.dataset.plot);if(p)refreshRealCells(card,p);});refreshTotalRealCells();})();
} catch (error) { console.error("STOT patch failed: js/v539-03.js", error); }

/* ===== js/v539-04.js ===== */
try {
(()=>{if(typeof HELP_CONTENT==="undefined")return;HELP_CONTENT.layoutcompare=`<section class="help-card"><h3>Compare Layouts</h3><div class="help-item"><strong>What it does</strong><span>Build two completely separate 15-plot layouts and compare their production without changing your normal Oil / Hour layout.</span></div><div class="help-item"><strong>Layout A / Layout B</strong><span>Tap A or B to choose which layout you are editing. Each side keeps its own drills, tiers, quantities and plot setup.</span></div><div class="help-item"><strong>Editing Layout</strong><span>The label under the A / B buttons shows which side the 15-plot editor currently belongs to.</span></div><div class="help-item"><strong>Switching sides</strong><span>Your current side is saved automatically before the other layout is loaded, so you can move between A and B without rebuilding them.</span></div></section><section class="help-card"><h3>Building Each Layout</h3><div class="help-item"><strong>15 Plots</strong><span>Each layout has the same 15 game plots. Every plot has its own 5×5 boundary with a maximum of 25 cells.</span></div><div class="help-item"><strong>Area Multipliers</strong><span>Forest ×1, Desert ×2, Volcano Sides ×3, Volcano Core ×5, Mountain Sides ×6 and Mountain Summit ×10.</span></div><div class="help-item"><strong>Add Drill</strong><span>Add one or more drill rows to a plot, then choose the drill, tier and quantity.</span></div><div class="help-item"><strong>Cells / Fit</strong><span>The calculator uses each drill footprint and quantity. A plot can use up to 25 cells, but the shapes must also physically fit inside a 5×5 plot.</span></div><div class="help-item"><strong>Copy Plot</strong><span>Copies every drill row from one plot, including drill type, tier and quantity.</span></div><div class="help-item"><strong>Paste</strong><span>Replaces one selected plot with the copied setup.</span></div><div class="help-item"><strong>Paste to All Empty</strong><span>Copies that setup only into plots that currently have no drills.</span></div><div class="help-item"><strong>Paste to All Plots</strong><span>Overwrites all 15 plots with the copied setup. Use this when you want to repeat the same layout again after the plots are already filled.</span></div></section><section class="help-card"><h3>Boosts & Dynamic Drills</h3><div class="help-item"><strong>Mole Level</strong><span>Enter 0–100. Mole boosts all drills in the layout.</span></div><div class="help-item"><strong>Fruit Level</strong><span>Enter 0–100. Fruit only boosts Banana Drill production.</span></div><div class="help-item"><strong>Heart Drill Likes</strong><span>The entered Likes value is used as the base Oil/s for every Heart Drill in that layout.</span></div><div class="help-item"><strong>Weekend x2</strong><span>Use x2 only while that layout is being calculated for an active x2 lobby.</span></div><div class="help-item"><strong>Clock Drill</strong><span>Clock starts at 1 Oil/s and gains +1 Oil/s every second before the selected multipliers. Its growth is included in totals automatically.</span></div><div class="help-item"><strong>Hacker Drill</strong><span>Uses the Hacker Oil/s value entered on its row because its in-game output is variable.</span></div></section><section class="help-card"><h3>Comparison Results</h3><div class="help-item"><strong>Layout A / B</strong><span>Shows the current Oil/s for both complete layouts.</span></div><div class="help-item"><strong>Winner</strong><span>Shows which layout currently produces more and, when possible, the percentage advantage.</span></div><div class="help-item"><strong>Difference / Second</strong><span>The production gap between Layout A and Layout B each second.</span></div><div class="help-item"><strong>Difference / 1 Hour</strong><span>The difference in total oil produced over one hour, including dynamic Clock Drill growth.</span></div><div class="help-item"><strong>Cells A / B</strong><span>Total occupied cells for each full 15-plot layout.</span></div><div class="help-item"><strong>Edit Layout A / B</strong><span>Jumps down to the editor for the side you currently selected.</span></div><div class="help-item"><strong>Share Layout A / B</strong><span>Shares the detailed result for the layout you are currently editing.</span></div><div class="help-item"><strong>Share Comparison</strong><span>Creates one summary containing the important A vs B comparison results.</span></div></section>`;HELP_CONTENT.database=`<section class="help-card"><h3>Game Database</h3><div class="help-item"><strong>What is here</strong><span>This is the game's reference library inside the tool. It includes Pets, Drills, Decorations, Solar Panels, Refineries, Totems and Lootboxes with their recorded game values and details.</span></div><div class="help-item"><strong>Categories</strong><span>Use the category buttons at the top to switch between the different item databases.</span></div><div class="help-item"><strong>Search</strong><span>Search is specific to the category you opened. You can search item names and, where supported, other information such as rarity or effects.</span></div><div class="help-item"><strong>Filters</strong><span>Some categories include rarity, type or source filters so you can narrow large lists quickly.</span></div><div class="help-item"><strong>Sort</strong><span>Where available, sort by game order, name, rarity or production values.</span></div><div class="help-item"><strong>Item Cards</strong><span>The first line gives the main value at a glance. Tap a card to expand the rest of the recorded details.</span></div></section><section class="help-card"><h3>Pets</h3><div class="help-item"><strong>Pet List</strong><span>Shows each pet, rarity, bonus type and its value at Level 100. Tap a pet to see Level 1, Level 100 and its effect.</span></div><div class="help-item"><strong>Pet Bonus Checker</strong><span>Select any pet and enter a level from 1 to 100 to calculate that pet's bonus at the exact level.</span></div><div class="help-item"><strong>Effects</strong><span>The card explains what the pet affects, such as oil production or another game bonus. Different pets do not all use the same bonus type.</span></div><div class="help-item"><strong>Search / Rarity</strong><span>Search by pet name, effect or rarity, then filter or sort the list.</span></div></section><section class="help-card"><h3>Drills</h3><div class="help-item"><strong>Oil / Second</strong><span>Shows the drill's recorded base production before tier, area and pet multipliers.</span></div><div class="help-item"><strong>Footprint</strong><span>Shows how much physical plot space the drill uses, such as 1×1, 2×2 or 3×2. This is the same footprint used by Oil Layout.</span></div><div class="help-item"><strong>Rarity</strong><span>Shows the item's recorded rarity.</span></div><div class="help-item"><strong>Source / Category</strong><span>Separates Regular Shop, Event, Special and Legacy drills where that information is available.</span></div><div class="help-item"><strong>Price / Special Values</strong><span>Expanded cards can include recorded cash price, event price, V-Bucks value or special notes when the drill uses them.</span></div><div class="help-item"><strong>Dynamic Drills</strong><span>Heart, Hacker and Clock do not behave like a fixed Oil/s drill. Their special production rules are handled by the calculators.</span></div><div class="help-item"><strong>Filters / Sort</strong><span>Filter drills by category and rarity, or sort by game order, Oil/s or name.</span></div></section><section class="help-card"><h3>Refineries</h3><div class="help-item"><strong>Refinery List</strong><span>Contains the recorded regular and special refineries in the game.</span></div><div class="help-item"><strong>Card Details</strong><span>Open a refinery card to see the values stored for that refinery, including its rarity, type and refinery-specific stats or notes.</span></div><div class="help-item"><strong>Special Refineries</strong><span>Special entries such as event or unique refineries are separated from the regular shop when applicable.</span></div><div class="help-item"><strong>Search / Filters</strong><span>Search by refinery name and filter by type or rarity.</span></div></section><section class="help-card"><h3>Solar Panels</h3><div class="help-item"><strong>Solar List</strong><span>Shows the solar panels recorded in the database.</span></div><div class="help-item"><strong>Card Details</strong><span>Tap a solar panel to view its stored production, price, rarity, footprint or other available game information.</span></div><div class="help-item"><strong>Search</strong><span>Use the Solar search box to find a panel directly by name.</span></div></section><section class="help-card"><h3>Totems</h3><div class="help-item"><strong>Totem List</strong><span>Contains Cash, AFK, Event and Special totems recorded by the tool.</span></div><div class="help-item"><strong>Effect</strong><span>Open the card to see what the totem does and the values recorded for that effect.</span></div><div class="help-item"><strong>Type Filter</strong><span>Filter the list between Cash, AFK and Event / Special types.</span></div><div class="help-item"><strong>Search</strong><span>Search by totem name or related stored information.</span></div></section><section class="help-card"><h3>Decorations & Structures</h3><div class="help-item"><strong>Structures</strong><span>This category includes Utility & Info structures, Wind Turbines and Pet Structures recorded in the game data.</span></div><div class="help-item"><strong>Cost</strong><span>Shows the recorded cash cost when the structure has one.</span></div><div class="help-item"><strong>Footprint</strong><span>Shows how much space the structure occupies when a footprint is available.</span></div><div class="help-item"><strong>Effect</strong><span>Tap the card to see the structure's recorded purpose or effect. Wind Turbines can show their cash production value.</span></div><div class="help-item"><strong>Type Filter</strong><span>Use the type filter to narrow the list to the kind of structure you need.</span></div></section><section class="help-card"><h3>Lootboxes</h3><div class="help-item"><strong>Drill / Refinery Boxes</strong><span>Lootboxes are separated by whether they contain drills or refineries.</span></div><div class="help-item"><strong>Cash Price</strong><span>Shows the recorded price of the lootbox.</span></div><div class="help-item"><strong>Drop List</strong><span>Open a lootbox card to see the items recorded as possible drops and the value or chance stored next to each drop.</span></div><div class="help-item"><strong>Search</strong><span>You can search not only the lootbox name but also the names of items inside its drop list.</span></div><div class="help-item"><strong>Type Filter</strong><span>Filter between Drill Lootboxes and Refinery Lootboxes.</span></div></section>`;if(typeof HELP_WITH_UNITS!=="undefined")HELP_WITH_UNITS.add("layoutcompare");if(typeof viewBadges!=="undefined")viewBadges.layoutcompare="Layout Compare";document.querySelector('.tabs button[data-view="layoutcompare"]')?.addEventListener("click",()=>{currentView="layoutcompare";},true);})();

(()=>{const KEY="stot-v5.39-layout-save-v1",API=window.STOT_LAYOUT_PERSIST;if(!API||typeof localStorage==="undefined")return;const ids=new Set(typeof layoutPlots!=="undefined"?layoutPlots.map(p=>p.id):[]),drillIds=new Set(typeof drills!=="undefined"?drills.map(d=>d.id):[]),allowedLobby=new Set([1,2]),allowedUnits=new Set([1e3,1e6,1e9,1e12]),num=(v,min,max,fallback)=>{const n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;};function cleanRows(rows){if(!Array.isArray(rows))return[];return rows.slice(0,20).map(r=>({drill:drillIds.has(r?.drill)?r.drill:"demonic",tier:Math.round(num(r?.tier,0,4,0)),count:Math.round(num(r?.count,1,25,1)),hacker:num(r?.hacker,0,1e6,550)}));}function cleanPlots(rows){if(!Array.isArray(rows))return[];const byId=new Map;for(const p of rows){if(!p||!ids.has(p.id)||byId.has(p.id))continue;byId.set(p.id,{id:p.id,rows:cleanRows(p.rows)});}return[...ids].map(id=>byId.get(id)||{id,rows:[]});}function cleanSetup(s){s=s&&typeof s==="object"?s:{};const lobby=Number(s.lobby),unit=Number(s.targetUnit);return{mole:String(Math.round(num(s.mole,0,100,0))),fruit:String(Math.round(num(s.fruit,0,100,0))),likes:String(Math.round(num(s.likes,0,1e9,0))),hours:String(num(s.hours,0,1e5,1)),target:String(num(s.target,0,1e15,1)),lobby:allowedLobby.has(lobby)?lobby:1,targetUnit:allowedUnits.has(unit)?unit:1e9,mode:s.mode==="target"?"target":"time"};}function cleanState(state){state=state&&typeof state==="object"?state:{};return{rows:cleanPlots(state.rows),setup:cleanSetup(state.setup)};}function sanitize(raw){if(!raw||typeof raw!=="object"||raw.version!==1)return null;return{singleState:cleanState(raw.singleState),compareStates:{A:cleanState(raw.compareStates?.A),B:cleanState(raw.compareStates?.B)},activeCompare:raw.activeCompare==="B"?"B":"A"};}function saveNow(){try{const state=API.exportState(),safe=sanitize({version:1,singleState:state.singleState,compareStates:state.compareStates,activeCompare:state.activeCompare});if(!safe)return;localStorage.setItem(KEY,JSON.stringify({version:1,...safe}));}catch(_){}}let timer=0;function queueSave(){clearTimeout(timer);timer=setTimeout(saveNow,180);}try{const raw=localStorage.getItem(KEY);if(raw){const safe=sanitize(JSON.parse(raw));if(safe)API.importState(safe);}}catch(_){try{localStorage.removeItem(KEY)}catch(__){}}document.addEventListener("input",e=>{if(e.target.closest("#oilView,#layoutcompareView"))queueSave();},true);document.addEventListener("change",e=>{if(e.target.closest("#oilView,#layoutcompareView"))queueSave();},true);document.addEventListener("click",e=>{if(e.target.closest("#oilView,#layoutcompareView"))queueSave();},true);window.addEventListener("pagehide",saveNow);document.addEventListener("visibilitychange",()=>{if(document.hidden)saveNow();});window.STOT_CLEAR_SAVED_LAYOUTS=()=>{try{localStorage.removeItem(KEY);return true}catch(_){return false}};})();

(()=>{const bar=document.querySelector("#layoutCopyBar"),pasteAll=document.querySelector("#layoutPasteAll");if(!bar||document.querySelector("#layoutClearAll"))return;const btn=document.createElement("button");btn.id="layoutClearAll";btn.type="button";btn.textContent="Clear All Plots";if(pasteAll)pasteAll.insertAdjacentElement("afterend",btn);else bar.appendChild(btn);btn.addEventListener("click",()=>{const hasDrills=typeof layoutPlots!=="undefined"&&layoutPlots.some(p=>Array.isArray(p.rows)&&p.rows.length);if(!hasDrills){const status=document.querySelector("#layoutCopyStatus");if(status)status.textContent="Layout is already empty";return}if(!window.confirm("Clear all drills from this layout?"))return;for(const p of layoutPlots)p.rows=[];if(typeof renderLayout==="function")renderLayout();const status=document.querySelector("#layoutCopyStatus");if(status)status.textContent="All 15 plots cleared";setTimeout(()=>{if(window.STOT_LAYOUT_PERSIST?.exportState)document.dispatchEvent(new Event("change",{bubbles:true}));},0);});})();
} catch (error) { console.error("STOT patch failed: js/v539-04.js", error); }

/* ===== js/v539-05.js ===== */
try {
(()=>{const hoursInput=document.querySelector("#layoutHours"),hourRate=document.querySelector("#layoutHourRate"),hourOil=document.querySelector("#layoutHourOil"),timeEnd=document.querySelector("#layoutTimeEnd"),timeOil=document.querySelector("#layoutTimeOil");if(!hoursInput||!hourRate||!hourOil||!timeEnd||!timeOil)return;const rateLabel=hourRate.closest(".metric")?.querySelector("span"),oilLabel=hourOil.closest(".metric")?.querySelector("span");function selectedTimeText(){const h=Number(hoursInput.value);if(!Number.isFinite(h)||h<0)return"Selected Time";if(Math.abs(h-1)<1e-9)return"1 Hour";return`${h} Hours`;}function syncSummaryToSelectedTime(){const t=selectedTimeText();if(rateLabel)rateLabel.textContent=`After ${t}`;if(oilLabel)oilLabel.textContent=`Oil in ${t}`;hourRate.textContent=timeEnd.textContent;hourOil.textContent=timeOil.textContent;}["input","change"].forEach(evt=>hoursInput.addEventListener(evt,()=>setTimeout(syncSummaryToSelectedTime,0)));[timeEnd,timeOil].forEach(el=>new MutationObserver(syncSummaryToSelectedTime).observe(el,{childList:true,characterData:true,subtree:true}));document.addEventListener("input",e=>{if(e.target.closest("#oilView,#layoutcompareView"))setTimeout(syncSummaryToSelectedTime,0);},true);document.addEventListener("change",e=>{if(e.target.closest("#oilView,#layoutcompareView"))setTimeout(syncSummaryToSelectedTime,0);},true);document.addEventListener("click",e=>{if(e.target.closest("#oilView,#layoutcompareView"))setTimeout(syncSummaryToSelectedTime,0);},true);syncSummaryToSelectedTime();})();

(()=>{const modeTabs=document.querySelector("#layoutModeTabs"),current=document.querySelector("#layoutNowRate");if(!modeTabs||!current||document.querySelector(".v519-combined-summary"))return;const calculatorCard=modeTabs.closest(".layout-control-card"),oldResult=current.closest(".panel.result");if(!calculatorCard||!oldResult)return;const wrap=document.createElement("div");wrap.className="v519-combined-summary";wrap.innerHTML=`<div class="v519-summary-head"><strong>Layout Summary</strong><span>Updates with selected time</span></div>`;[oldResult.querySelector(".result-main"),oldResult.querySelector(".layout-summary"),oldResult.querySelector(".result-mini"),oldResult.querySelector(".actions"),oldResult.querySelector("#layoutError")].filter(Boolean).forEach(el=>wrap.appendChild(el));calculatorCard.appendChild(wrap);oldResult.classList.add("v519-old-result");})();

(()=>{const oil=document.querySelector("#oilView"),controls=oil?.querySelector(".layout-controls"),calcCard=document.querySelector("#layoutModeTabs")?.closest(".layout-control-card"),summary=calcCard?.querySelector(".v519-combined-summary");if(!oil||!controls||!calcCard||!summary||document.querySelector(".v520-boosts"))return;const mole=document.querySelector("#layoutMole"),fruit=document.querySelector("#layoutFruit"),likes=document.querySelector("#layoutLikes"),x2=document.querySelector("#layoutX2"),petCard=mole?.closest(".layout-control-card"),x2Card=x2?.closest(".layout-control-card"),compact=document.createElement("div");compact.className="v520-boosts";compact.innerHTML=`<div class="v520-boosts-title"><strong>Layout Boosts</strong><span>Optional · applies to whole layout</span></div><div class="v520-boost-item" id="v520Mole"><span class="v520-label">Mole Level</span></div><div class="v520-boost-item" id="v520Fruit"><span class="v520-label">Fruit Level</span></div><div class="v520-boost-item" id="v520Likes"><span class="v520-label">Heart Likes</span></div><div class="v520-boost-item" id="v520X2"><span class="v520-label">Admin Event Lobby</span></div>`;summary.insertAdjacentElement("afterend",compact);if(mole)document.querySelector("#v520Mole").appendChild(mole);if(fruit)document.querySelector("#v520Fruit").appendChild(fruit);if(likes)document.querySelector("#v520Likes").appendChild(likes);if(x2)document.querySelector("#v520X2").appendChild(x2);petCard?.classList.add("v520-source-hidden");x2Card?.classList.add("v520-source-hidden");const modeTabs2=document.querySelector("#layoutModeTabs"),hours=document.querySelector("#layoutHours"),targetDisplay=document.querySelector("#layoutTargetDisplay"),targetTime=document.querySelector("#layoutTargetTime"),timeEnd=document.querySelector("#layoutTimeEnd"),timeOil=document.querySelector("#layoutTimeOil"),metricRate=document.querySelector("#layoutHourRate"),metricOil=document.querySelector("#layoutHourOil"),labelRate=metricRate?.closest(".metric")?.querySelector("span"),labelOil=metricOil?.closest(".metric")?.querySelector("span"),summaryHint=summary.querySelector(".v519-summary-head span");function isTarget(){return document.querySelector("#layoutTargetPane")?.classList.contains("active");}function timeLabel(){const h=Number(hours?.value);if(!Number.isFinite(h)||h<0)return"Selected Time";if(Math.abs(h-1)<1e-9)return"1 Hour";return`${h} Hours`;}function syncAdaptive(){if(!metricRate||!metricOil)return;if(isTarget()){if(labelRate)labelRate.textContent="Target Oil";if(labelOil)labelOil.textContent="Time Needed";metricRate.textContent=targetDisplay?.textContent||"—";metricOil.textContent=targetTime?.textContent||"—";if(summaryHint)summaryHint.textContent="Target → time";}else{const t=timeLabel();if(labelRate)labelRate.textContent=`After ${t}`;if(labelOil)labelOil.textContent=`Oil in ${t}`;metricRate.textContent=timeEnd?.textContent||"—";metricOil.textContent=timeOil?.textContent||"—";if(summaryHint)summaryHint.textContent="Time → oil";}}["input","change"].forEach(evt=>oil.addEventListener(evt,()=>setTimeout(syncAdaptive,0),true));oil.addEventListener("click",e=>{if(e.target.closest("#layoutModeTabs,#layoutTargetUnits,#layoutX2,[data-add],[data-remove],[data-paste]"))setTimeout(syncAdaptive,0);},true);[targetDisplay,targetTime,timeEnd,timeOil].filter(Boolean).forEach(el=>new MutationObserver(syncAdaptive).observe(el,{childList:true,characterData:true,subtree:true}));syncAdaptive();})();
} catch (error) { console.error("STOT patch failed: js/v539-05.js", error); }

/* ===== js/v539-06.js ===== */
try {
(()=>{const view=document.querySelector("#layoutcompareView"),panel=view?.querySelector(".ab-compare"),API=window.STOT_LAYOUT_PERSIST;if(!view||!panel||!API||panel.dataset.v523==="1")return;panel.dataset.v523="1";panel.innerHTML=`<div class="ab-compare-head"><strong>Layout Comparison</strong><small id="v523ModeBadge">Time → Oil</small></div><div class="v523-sides"><div class="v523-side"><span class="v523-side-name">Layout A</span><strong class="v523-current" id="abRateA">0/s</strong><span class="v523-mode-label" id="v523LabelA">Oil in 1 Hour</span><strong class="v523-mode-value" id="v523ValueA">0</strong><span class="v523-extra" id="v523ExtraA">End rate: 0/s</span></div><div class="v523-side"><span class="v523-side-name">Layout B</span><strong class="v523-current" id="abRateB">0/s</strong><span class="v523-mode-label" id="v523LabelB">Oil in 1 Hour</span><strong class="v523-mode-value" id="v523ValueB">0</strong><span class="v523-extra" id="v523ExtraB">End rate: 0/s</span></div></div><div class="v523-compare-context" id="v523Context">Both layouts use the same comparison time.</div><div class="ab-winner" id="abWinner">Add drills to A and B to compare</div><div class="v523-diff"><div class="ab-metric"><span>Current Difference</span><strong id="abDiffRate">0/s</strong></div><div class="ab-metric"><span id="v523DiffLabel">Oil Difference</span><strong id="abDiffHour">0</strong></div><div class="ab-metric"><span>Cells A / B</span><strong id="abCells">0 / 0</strong></div></div>`;const num=(v,f=0)=>{const n=Number(v);return Number.isFinite(n)?n:f},setupOf=s=>s&&typeof s==="object"?s:{},tierMult=i=>TIER_OPTIONS?.[Number(i)||0]?.mult||1;function petMult(d,setup){const ml=Math.max(0,Math.min(100,num(setup.mole,0))),fl=Math.max(0,Math.min(100,num(setup.fruit,0))),mole=ml?petValue(pets.find(p=>p.id==="mole"),ml)/100:0,fruit=(d.id==="banana"&&fl)?petValue(pets.find(p=>p.id==="fruit"),fl)/100:0;return(1+mole)*(1+fruit);}function stats(state,shared){const setup=setupOf(state?.setup);let staticRate=0,clockGrowth=0,cells=0,usedPlots=0,valid=true;for(const base of layoutPlots){const snap=state?.rows?.find(x=>x.id===base.id),rows=Array.isArray(snap?.rows)?snap.rows:[],p={...base,rows},info=pieceList(p);if(info.area>0)usedPlots++;cells+=info.area;if(!canPack5x5(p)){valid=false;continue}for(const row of rows){const d=drills.find(x=>x.id===row.drill);if(!d)continue;const count=Math.max(0,Math.floor(num(row.count,0)));let baseOil=0;if(d.special==="heart")baseOil=Math.max(0,num(setup.likes,0));else if(d.special==="hacker")baseOil=Math.max(0,num(row.hacker,550));else baseOil=Math.max(0,num(d.oil,0));const mult=tierMult(row.tier)*base.mult*count*petMult(d,setup)*(num(setup.lobby,1)||1);if(d.special==="clock")clockGrowth+=mult;else staticRate+=baseOil*mult;}}const now=valid?staticRate+clockGrowth:NaN;if(shared.mode==="target"){const seconds=valid?timeForTarget(staticRate,clockGrowth,shared.target):NaN;return{valid,now,cells,usedPlots,seconds};}const seconds=Math.max(0,Math.floor(shared.hours*3600)),end=valid?staticRate+clockGrowth*(seconds+1):NaN,oil=valid?totalOilForSeconds(staticRate,clockGrowth,seconds):NaN;return{valid,now,cells,usedPlots,end,oil,seconds};}function sharedCondition(){const targetMode=document.querySelector("#layoutTargetPane")?.classList.contains("active"),hours=Math.max(0,num(document.querySelector("#layoutHours")?.value,1)),target=num(document.querySelector("#layoutTarget")?.value,1)*(typeof layoutTargetUnit!=="undefined"?layoutTargetUnit:1e9);return{mode:targetMode?"target":"time",hours,target};}const signed=(n,suffix="")=>!Number.isFinite(n)?"—":(n>0?"+":n<0?"−":"")+fmt(Math.abs(n))+suffix,formatHours=h=>Math.abs(h-1)<1e-9?"1 Hour":`${h} Hours`;function render(){if(!view.classList.contains("active"))return;const saved=API.exportState(),shared=sharedCondition(),a=stats(saved.compareStates.A,shared),b=stats(saved.compareStates.B,shared),$=s=>document.querySelector(s);$("#abRateA").textContent=a.valid?rateFmt(a.now)+"/s":"—";$("#abRateB").textContent=b.valid?rateFmt(b.now)+"/s":"—";$("#abCells").textContent=`${a.cells} / ${b.cells}`;if(!a.valid||!b.valid){$("#abWinner").textContent="Fix the over-capacity plot before comparing";$("#abDiffRate").textContent="—";$("#abDiffHour").textContent="—";return}$("#abDiffRate").textContent=signed(b.now-a.now,"/s");if(shared.mode==="target"){const targetText=fmt(shared.target);$("#v523ModeBadge").textContent="Oil → Time";$("#v523LabelA").textContent=`Time to ${targetText}`;$("#v523LabelB").textContent=`Time to ${targetText}`;$("#v523ValueA").textContent=timeText(a.seconds);$("#v523ValueB").textContent=timeText(b.seconds);$("#v523ExtraA").textContent=`Current: ${rateFmt(a.now)}/s`;$("#v523ExtraB").textContent=`Current: ${rateFmt(b.now)}/s`;$("#v523Context").textContent=`Both layouts are compared against the same target: ${targetText}.`;$("#v523DiffLabel").textContent="Time Difference";if(Number.isFinite(a.seconds)&&Number.isFinite(b.seconds)){$("#abDiffHour").textContent=timeText(Math.abs(a.seconds-b.seconds));$("#abWinner").textContent=a.seconds===b.seconds?"Layout A and B reach the target at the same time":`Layout ${a.seconds<b.seconds?"A":"B"} reaches the target faster`;}else{$("#abDiffHour").textContent="—";$("#abWinner").textContent="One or both layouts cannot reach this target";}}else{const tl=formatHours(shared.hours);$("#v523ModeBadge").textContent="Time → Oil";$("#v523LabelA").textContent=`Oil in ${tl}`;$("#v523LabelB").textContent=`Oil in ${tl}`;$("#v523ValueA").textContent=fmt(a.oil);$("#v523ValueB").textContent=fmt(b.oil);$("#v523ExtraA").textContent=`End rate: ${rateFmt(a.end)}/s`;$("#v523ExtraB").textContent=`End rate: ${rateFmt(b.end)}/s`;$("#v523Context").textContent=`Both layouts are compared over the same run time: ${tl}.`;$("#v523DiffLabel").textContent="Oil Difference";$("#abDiffHour").textContent=signed(b.oil-a.oil);if(a.oil===0&&b.oil===0)$("#abWinner").textContent="Add drills to A and B to compare";else if(Math.abs(a.oil-b.oil)<1e-9)$("#abWinner").textContent="Layout A and B produce the same oil";else{const best=b.oil>a.oil?"B":"A",high=Math.max(a.oil,b.oil),low=Math.min(a.oil,b.oil);$("#abWinner").textContent=low>0?`Layout ${best} produces +${(((high-low)/low)*100).toFixed(1)}% more`:`Layout ${best} produces more`;}}}function syncSharedToBoth(){if(!view.classList.contains("active"))return;const saved=API.exportState(),current=sharedCondition(),unit=typeof layoutTargetUnit!=="undefined"?layoutTargetUnit:1e9;for(const side of["A","B"]){if(!saved.compareStates[side].setup)saved.compareStates[side].setup={};saved.compareStates[side].setup.hours=String(current.hours);saved.compareStates[side].setup.target=String(num(document.querySelector("#layoutTarget")?.value,1));saved.compareStates[side].setup.targetUnit=unit;saved.compareStates[side].setup.mode=current.mode;}API.importState(saved);}["#layoutHours","#layoutTarget"].forEach(sel=>document.querySelector(sel)?.addEventListener("input",()=>setTimeout(()=>{syncSharedToBoth();render();},0)));document.querySelector("#layoutModeTabs")?.addEventListener("click",()=>setTimeout(()=>{syncSharedToBoth();render();},0));document.querySelector("#layoutTargetUnits")?.addEventListener("click",()=>setTimeout(()=>{syncSharedToBoth();render();},0));view.addEventListener("input",()=>setTimeout(render,0));view.addEventListener("change",()=>setTimeout(render,0));view.addEventListener("click",()=>setTimeout(render,0));const share=document.querySelector("#v56ShareCompare");if(share)share.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();render();const $=s=>document.querySelector(s),mode=$("#v523ModeBadge").textContent,body=`<div class="share-section"><div class="share-section-title">Layout Comparison</div><div class="share-line"><span>Mode</span><strong>${mode}</strong></div><div class="share-line"><span>Layout A</span><strong>${$("#abRateA").textContent}</strong></div><div class="share-line"><span>${$("#v523LabelA").textContent}</span><strong>${$("#v523ValueA").textContent}</strong></div><div class="share-line"><span>Layout B</span><strong>${$("#abRateB").textContent}</strong></div><div class="share-line"><span>${$("#v523LabelB").textContent}</span><strong>${$("#v523ValueB").textContent}</strong></div><div class="share-line"><span>Result</span><strong>${$("#abWinner").textContent}</strong></div><div class="share-line"><span>Cells A / B</span><strong>${$("#abCells").textContent}</strong></div></div>`,text=["Layout Comparison",`Mode: ${mode}`,`Layout A: ${$("#abRateA").textContent}`,`${$("#v523LabelA").textContent}: ${$("#v523ValueA").textContent}`,`Layout B: ${$("#abRateB").textContent}`,`${$("#v523LabelB").textContent}: ${$("#v523ValueB").textContent}`,`Result: ${$("#abWinner").textContent}`,`Cells A / B: ${$("#abCells").textContent}`].join("\n");if(typeof openSharePreview==="function")openSharePreview("Layout Comparison",body,text);},true);render();})();

(()=>{const view=document.querySelector("#layoutcompareView"),API=window.STOT_LAYOUT_PERSIST;if(!view||!API||document.querySelector("#v524CompareSettings"))return;const STORE_KEY="stot-v5.32-compare-separate-boosts-v1";let separate=false,applying=false;try{separate=localStorage.getItem(STORE_KEY)==="1"}catch(_){}const note=view.querySelector(".v57-view-note"),editorHead=view.querySelector(".v57-editor-head"),panel=document.createElement("div");panel.id="v524CompareSettings";panel.className="panel v524-settings";panel.innerHTML=`<div class="v524-settings-head"><div class="v524-settings-copy"><strong>Different Base Settings</strong><small>Keep this Off for a normal layout comparison. Turn it On only if Layout A and Layout B use different Mole, Fruit, Heart Likes or Admin Event Lobby settings.</small></div><div class="v524-toggle" id="v524Toggle"><button type="button" data-v524="shared">Off</button><button type="button" data-v524="separate">On</button></div></div><div class="v524-status" id="v524Status"></div>`;if(note)note.insertAdjacentElement("afterend",panel);else if(editorHead)editorHead.insertAdjacentElement("beforebegin",panel);else view.prepend(panel);const status=panel.querySelector("#v524Status");function activeSide(){const txt=`${document.querySelector("#v57Editing")?.textContent||""} ${document.querySelector("#abEditing")?.textContent||""}`;return/Layout B/i.test(txt)?"B":"A";}function boostSubset(setup){setup=setup&&typeof setup==="object"?setup:{};return{mole:String(setup.mole??"0"),fruit:String(setup.fruit??"0"),likes:String(setup.likes??"0"),lobby:Number(setup.lobby)===2?2:1};}function writeBoosts(setup,values){setup=setup&&typeof setup==="object"?setup:{};setup.mole=String(values.mole);setup.fruit=String(values.fruit);setup.likes=String(values.likes);setup.lobby=Number(values.lobby)===2?2:1;return setup;}function currentDomBoosts(){return{mole:String(document.querySelector("#layoutMole")?.value??"0"),fruit:String(document.querySelector("#layoutFruit")?.value??"0"),likes:String(document.querySelector("#layoutLikes")?.value??"0"),lobby:document.querySelector('#layoutX2 [data-layoutx2="2"]')?.classList.contains("active")?2:1};}function applySaved(saved){if(applying)return;applying=true;try{API.importState(saved)}finally{setTimeout(()=>{applying=false},0)}}function makeSharedFrom(side){if(applying)return;const saved=API.exportState(),source=boostSubset(saved.compareStates[side]?.setup);saved.compareStates.A.setup=writeBoosts(saved.compareStates.A.setup,source);saved.compareStates.B.setup=writeBoosts(saved.compareStates.B.setup,source);applySaved(saved);}function syncDomToBoth(){if(separate||!view.classList.contains("active")||applying)return;const saved=API.exportState(),values=currentDomBoosts();saved.compareStates.A.setup=writeBoosts(saved.compareStates.A.setup,values);saved.compareStates.B.setup=writeBoosts(saved.compareStates.B.setup,values);applySaved(saved);}function updateBoostHeader(){const title=view.querySelector(".v520-boosts-title");if(!title)return;let badge=title.querySelector(".v524-shared-badge");if(!badge){badge=document.createElement("span");badge.className="v524-shared-badge";title.appendChild(badge);}badge.textContent=separate?`Layout ${activeSide()} settings`:"Shared A + B";const hint=title.querySelector("span:not(.v524-shared-badge)");if(hint)hint.textContent=separate?"Separate settings for this layout":"Same settings applied to both layouts";}function renderMode(){panel.querySelectorAll("[data-v524]").forEach(btn=>btn.classList.toggle("active",btn.dataset.v524===(separate?"separate":"shared")));status.innerHTML=separate?`<strong>Separate settings are On.</strong> Mole, Fruit, Heart Likes and Admin Event Lobby can be different for Layout A and Layout B.`:`<strong>Shared settings are active.</strong> Mole, Fruit, Heart Likes and Admin Event Lobby are the same for Layout A and Layout B.`;updateBoostHeader();}panel.querySelector("#v524Toggle").addEventListener("click",e=>{const btn=e.target.closest("[data-v524]");if(!btn)return;const nextSeparate=btn.dataset.v524==="separate";if(nextSeparate===separate)return;if(nextSeparate){makeSharedFrom(activeSide());separate=true}else{separate=false;makeSharedFrom(activeSide())}try{localStorage.setItem(STORE_KEY,separate?"1":"0")}catch(_){}renderMode();});["#layoutMole","#layoutFruit","#layoutLikes"].forEach(sel=>{document.querySelector(sel)?.addEventListener("input",()=>setTimeout(()=>{syncDomToBoth();updateBoostHeader()},0));document.querySelector(sel)?.addEventListener("change",()=>setTimeout(()=>{syncDomToBoth();updateBoostHeader()},0));});document.querySelector("#layoutX2")?.addEventListener("click",()=>setTimeout(()=>{syncDomToBoth();updateBoostHeader()},0));[document.querySelector("#v57Editing"),document.querySelector("#abEditing")].filter(Boolean).forEach(el=>new MutationObserver(()=>{if(!applying)updateBoostHeader();}).observe(el,{childList:true,characterData:true,subtree:true}));if(!separate)makeSharedFrom("A");renderMode();if(typeof HELP_CONTENT!=="undefined"&&HELP_CONTENT.layoutcompare)HELP_CONTENT.layoutcompare=HELP_CONTENT.layoutcompare.replace(`<section class="help-card"><h3>Building Each Layout</h3>`,`<section class="help-card"><h3>Comparison Settings</h3><div class="help-item"><strong>Different Base Settings — Off</strong><span>Normal mode. Mole, Fruit, Heart Likes and Admin Event Lobby are shared and applied to both Layout A and Layout B.</span></div><div class="help-item"><strong>Different Base Settings — On</strong><span>Use this only when comparing two different bases or accounts with different boost settings. A and B then keep separate values.</span></div></section><section class="help-card"><h3>Building Each Layout</h3>`);})();
} catch (error) { console.error("STOT patch failed: js/v539-06.js", error); }

/* ===== js/v539-07.js ===== */
try {
(()=>{const view=document.querySelector("#layoutcompareView"),settings=document.querySelector("#v524CompareSettings"),switchWrap=view?.querySelector(".ab-layout-switch")?.parentElement;if(!view||!settings||!switchWrap||document.querySelector("#v526EditorSwitch"))return;const switcher=switchWrap.querySelector(".ab-layout-switch");if(!switcher)return;const panel=document.createElement("div");panel.id="v526EditorSwitch";panel.className="panel v526-editor-switch";panel.innerHTML=`<div class="v526-editor-switch-head"><strong>Edit Layout</strong><span id="v526EditorHint">Choose which drill layout to edit</span></div>`;panel.appendChild(switcher);settings.insertAdjacentElement("afterend",panel);if(switchWrap&&!switchWrap.children.length)switchWrap.remove();document.querySelector("#v56GoA")?.remove();const separateBtn=document.querySelector('[data-v524="separate"]'),sharedBtn=document.querySelector('[data-v524="shared"]'),hint=document.querySelector("#v526EditorHint"),separateMode=()=>separateBtn?.classList.contains("active"),side=()=>document.querySelector('[data-ab-layout].active')?.dataset.abLayout||"A";function refresh(){if(hint)hint.textContent=separateMode()?`Editing Layout ${side()} · boosts can differ`:`Editing Layout ${side()} · boosts shared A + B`;const badge=view.querySelector(".v524-shared-badge");if(badge)badge.textContent=separateMode()?`Layout ${side()} settings`:"Shared A + B";}document.querySelectorAll("[data-ab-layout]").forEach(btn=>{btn.addEventListener("click",()=>setTimeout(refresh,0));new MutationObserver(refresh).observe(btn,{attributes:true,attributeFilter:["class"]});});[sharedBtn,separateBtn].filter(Boolean).forEach(btn=>{btn.addEventListener("click",()=>setTimeout(refresh,0));new MutationObserver(refresh).observe(btn,{attributes:true,attributeFilter:["class"]});});refresh();})();

(()=>{const view=document.querySelector("#layoutcompareView"),comparison=view?.querySelector(".ab-compare"),settings=document.querySelector("#v524CompareSettings"),editorSwitch=document.querySelector("#v526EditorSwitch"),calcCard=view?.querySelector(".layout-control-card:has(#layoutModeTabs)"),boosts=view?.querySelector(".v520-boosts"),copyBar=view?.querySelector("#layoutCopyBar");if(!view||!comparison||!settings||!editorSwitch||!calcCard||!boosts||document.querySelector("#v527Workflow"))return;const intro=view.querySelector(".v56-compare-intro");if(intro){const p=intro.querySelector("p");if(p)p.textContent="Build A and B, then compare them using the same time or target.";}const workflow=document.createElement("div");workflow.id="v527Workflow";workflow.className="panel v527-workflow";workflow.innerHTML=`<div class="v527-head"><strong>Comparison Setup</strong><span>Set once, then build A and B</span></div><div class="v527-step"><span class="v527-num">1</span><span>Choose what you want to compare</span></div><div id="v527Condition"></div><div class="v527-divider"></div><div class="v527-step"><span class="v527-num">2</span><span>Choose boost behavior</span></div><div id="v527Settings"></div><div class="v527-divider"></div><div class="v527-step"><span class="v527-num">3</span><span>Choose the layout to edit</span></div><div id="v527Editor"></div><div class="v527-divider"></div><div id="v527Boosts"></div>`;const compareActions=view.querySelector(".v56-compare-actions"),note=view.querySelector(".v57-view-note"),insertAfter=note||compareActions||comparison;insertAfter.insertAdjacentElement("afterend",workflow);workflow.querySelector("#v527Condition").appendChild(calcCard);workflow.querySelector("#v527Settings").appendChild(settings);workflow.querySelector("#v527Editor").appendChild(editorSwitch);workflow.querySelector("#v527Boosts").appendChild(boosts);const settingsTitle=settings.querySelector(".v524-settings-copy strong"),settingsHelp=settings.querySelector(".v524-settings-copy small");if(settingsTitle)settingsTitle.textContent="Use different boosts for A and B?";if(settingsHelp)settingsHelp.textContent="Leave Off for a normal comparison. Turn On only if the two bases use different boosts.";const off=settings.querySelector('[data-v524="shared"]'),on=settings.querySelector('[data-v524="separate"]');if(off)off.textContent="No";if(on)on.textContent="Yes";function simplifyStatus(){const status=settings.querySelector("#v524Status");if(!status)return;const isSeparate=on?.classList.contains("active");status.innerHTML=isSeparate?`<strong>Separate boosts.</strong> A and B can use different Mole, Fruit, Heart Likes and Admin Event Lobby values.`:`<strong>Same boosts.</strong> Mole, Fruit, Heart Likes and Admin Event Lobby are applied to both A and B.`;}[off,on].filter(Boolean).forEach(btn=>{btn.addEventListener("click",()=>setTimeout(simplifyStatus,0));new MutationObserver(simplifyStatus).observe(btn,{attributes:true,attributeFilter:["class"]});});simplifyStatus();view.querySelectorAll("[data-ab-layout]").forEach(btn=>{btn.textContent=`Edit Layout ${btn.dataset.abLayout}`;});if(note)note.style.display="none";})();

(()=>{const view=document.querySelector("#layoutcompareView"),comparison=view?.querySelector(".ab-compare"),compareActions=view?.querySelector(".v56-compare-actions"),calcCard=view?.querySelector(".layout-control-card:has(#layoutModeTabs)"),settings=document.querySelector("#v524CompareSettings"),editorSwitch=document.querySelector("#v526EditorSwitch"),boosts=view?.querySelector(".v520-boosts"),oldWorkflow=document.querySelector("#v527Workflow");if(!view||!comparison||!calcCard||!settings||!editorSwitch||!boosts||document.querySelector("#v528Condition"))return;view.querySelectorAll(".panel").forEach(panel=>{if(panel===comparison||panel===settings||panel===editorSwitch||panel===oldWorkflow)return;const visibleText=(panel.textContent||"").trim(),hasUseful=panel.querySelector("input,select,textarea,button:not([style*='display:none']),#layoutModeTabs,.ab-compare,.v56-compare-intro");if(!visibleText&&!hasUseful)panel.classList.add("v528-remove-empty");});const orphanEditing=view.querySelector(".ab-editing"),orphanPanel=orphanEditing?.closest(".panel");if(orphanPanel&&!orphanPanel.querySelector(".ab-layout-switch"))orphanPanel.classList.add("v528-remove-empty");const condition=document.createElement("div");condition.id="v528Condition";condition.className="panel v528-condition";condition.innerHTML=`<div class="v528-section-head"><strong>Comparison Condition</strong><span>Choose one condition for both layouts</span></div><div id="v528ConditionHost"></div>`;condition.querySelector("#v528ConditionHost").appendChild(calcCard);const intro=view.querySelector(".v56-compare-intro");if(intro)intro.insertAdjacentElement("afterend",condition);else comparison.insertAdjacentElement("beforebegin",condition);const layoutSettings=document.createElement("div");layoutSettings.id="v528LayoutSettings";layoutSettings.className="panel v528-layout-settings";layoutSettings.innerHTML=`<div class="v528-section-head"><strong>Layout Setup</strong><span>Choose A or B, then build the plots below</span></div><div id="v528SettingsHost"></div><div class="v528-divider"></div><div id="v528EditorHost"></div><div class="v528-divider"></div><div id="v528BoostHost"></div>`;layoutSettings.querySelector("#v528SettingsHost").appendChild(settings);layoutSettings.querySelector("#v528EditorHost").appendChild(editorSwitch);layoutSettings.querySelector("#v528BoostHost").appendChild(boosts);(compareActions||comparison).insertAdjacentElement("afterend",layoutSettings);if(oldWorkflow)oldWorkflow.remove();const title=settings.querySelector(".v524-settings-copy strong"),help=settings.querySelector(".v524-settings-copy small");if(title)title.textContent="Different boosts for A and B?";if(help)help.textContent="No = same boosts on both. Yes = each layout keeps its own boost values.";const off=settings.querySelector('[data-v524="shared"]'),on=settings.querySelector('[data-v524="separate"]');if(off)off.textContent="No";if(on)on.textContent="Yes";view.querySelectorAll("[data-ab-layout]").forEach(btn=>{btn.textContent=`Layout ${btn.dataset.abLayout}`;});const introText=intro?.querySelector("p");if(introText)introText.textContent="Choose the comparison condition, build A and B, then compare the results.";})();

(()=>{const view=document.getElementById("layoutcompareView");if(!view||document.getElementById("v529Condition"))return;const intro=view.querySelector(".v56-compare-intro"),comparison=view.querySelector(".ab-compare"),actions=view.querySelector(".v56-compare-actions"),modeTabs=document.getElementById("layoutModeTabs"),calcCard=modeTabs?.closest(".layout-control-card"),settings=document.getElementById("v524CompareSettings"),editor=document.getElementById("v526EditorSwitch"),boosts=view.querySelector(".v520-boosts");if(!intro||!comparison||!calcCard||!settings||!editor||!boosts)return;document.getElementById("v527Workflow")?.remove();view.querySelectorAll(".panel").forEach(p=>{if(p===intro||p===comparison||p===settings||p===editor||p===calcCard)return;if(p.querySelector(".ab-editing")&&!p.querySelector(".ab-layout-switch"))p.classList.add("v529-hidden");});const condition=document.createElement("div");condition.id="v529Condition";condition.className="panel v529-condition";condition.innerHTML=`<div class="v529-head"><strong>Comparison Condition</strong><span>Same time or target for A and B</span></div><div id="v529ConditionHost"></div>`;condition.querySelector("#v529ConditionHost").appendChild(calcCard);intro.insertAdjacentElement("afterend",condition);condition.insertAdjacentElement("afterend",comparison);if(actions)comparison.insertAdjacentElement("afterend",actions);const setup=document.createElement("div");setup.id="v529LayoutSetup";setup.className="panel v529-layout-setup";setup.innerHTML=`<div class="v529-head"><strong>Layout Setup</strong><span>Choose A or B, then edit the plots below</span></div><div id="v529SettingsHost"></div><div class="v529-divider"></div><div id="v529EditorHost"></div><div class="v529-divider"></div><div id="v529BoostHost"></div>`;setup.querySelector("#v529SettingsHost").appendChild(settings);setup.querySelector("#v529EditorHost").appendChild(editor);setup.querySelector("#v529BoostHost").appendChild(boosts);(actions||comparison).insertAdjacentElement("afterend",setup);const title=settings.querySelector(".v524-settings-copy strong"),help=settings.querySelector(".v524-settings-copy small");if(title)title.textContent="Different boosts for A and B?";if(help)help.textContent="No = same boosts on both. Yes = each layout keeps its own boost values.";settings.querySelector('[data-v524="shared"]')?.replaceChildren(document.createTextNode("No"));settings.querySelector('[data-v524="separate"]')?.replaceChildren(document.createTextNode("Yes"));view.querySelectorAll("[data-ab-layout]").forEach(btn=>{btn.textContent=`Layout ${btn.dataset.abLayout}`;});const p=intro.querySelector("p");if(p)p.textContent="Choose the condition first, then build Layout A and Layout B.";})();

(()=>{function placeCompareConditionFirst(){const view=document.getElementById("layoutcompareView");if(!view)return;const intro=view.querySelector(".v56-compare-intro"),condition=document.getElementById("v529Condition"),comparison=view.querySelector(".ab-compare");if(!condition||!comparison)return;if(intro)intro.insertAdjacentElement("afterend",condition);else view.insertBefore(condition,view.firstElementChild);condition.insertAdjacentElement("afterend",comparison);}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",placeCompareConditionFirst,{once:true});else placeCompareConditionFirst();requestAnimationFrame(()=>requestAnimationFrame(placeCompareConditionFirst));setTimeout(placeCompareConditionFirst,100);})();
} catch (error) { console.error("STOT patch failed: js/v539-07.js", error); }

/* ===== js/v539-08.js ===== */
try {
(()=>{function placeConditionInTopSlot(){const view=document.getElementById("layoutcompareView");if(!view)return;const intro=view.querySelector(".v56-compare-intro"),comparison=view.querySelector(".ab-compare"),modeTabs=document.getElementById("layoutModeTabs"),calcCard=modeTabs?.closest(".layout-control-card");if(!intro||!comparison||!calcCard)return;let box=document.getElementById("v533Condition");if(!box){box=document.createElement("div");box.id="v533Condition";box.className="panel v533-condition";box.innerHTML=`<div class="v533-condition-head"><strong>Comparison Condition</strong><span>Same time or target for A and B</span></div><div id="v533ConditionHost"></div>`;}intro.insertAdjacentElement("afterend",box);box.querySelector("#v533ConditionHost").appendChild(calcCard);box.insertAdjacentElement("afterend",comparison);["v528Condition","v529Condition"].forEach(id=>{const old=document.getElementById(id);if(old&&old!==box&&!old.contains(calcCard))old.classList.add("v533-obsolete-empty");});let node=intro.nextElementSibling;while(node&&node!==comparison){const next=node.nextElementSibling;if(node!==box&&node.classList.contains("panel")){const hasInteractive=node.querySelector("input,select,textarea,button"),hasMeaningful=(node.textContent||"").trim();if(!hasInteractive&&!hasMeaningful)node.classList.add("v533-obsolete-empty");}node=next;}}const layoutTab=document.querySelector('.tabs button[data-view="layoutcompare"]');layoutTab?.addEventListener("click",()=>{setTimeout(placeConditionInTopSlot,0);requestAnimationFrame(()=>requestAnimationFrame(placeConditionInTopSlot));});if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",placeConditionInTopSlot,{once:true});else placeConditionInTopSlot();})();

(()=>{function arrangeCompareLayout(){const view=document.getElementById("layoutcompareView");if(!view)return;const intro=view.querySelector(".v56-compare-intro"),condition=document.getElementById("v533Condition")||document.getElementById("v529Condition"),comparison=view.querySelector(".ab-compare"),actions=view.querySelector(".v56-compare-actions"),settings=document.getElementById("v524CompareSettings"),editor=document.getElementById("v526EditorSwitch"),boosts=view.querySelector(".v520-boosts"),copyBar=document.getElementById("layoutCopyBar");if(!intro||!condition||!comparison||!settings||!editor||!boosts)return;["v528LayoutSettings","v529LayoutSetup","v527Workflow"].forEach(id=>{const old=document.getElementById(id);if(old){if(old.contains(settings))view.insertBefore(settings,old);if(old.contains(editor))view.insertBefore(editor,old);if(old.contains(boosts))view.insertBefore(boosts,old);old.remove();}});intro.insertAdjacentElement("afterend",condition);condition.insertAdjacentElement("afterend",comparison);let anchor=comparison;if(actions){anchor.insertAdjacentElement("afterend",actions);anchor=actions;}anchor.insertAdjacentElement("afterend",settings);settings.insertAdjacentElement("afterend",editor);editor.insertAdjacentElement("afterend",boosts);if(copyBar)boosts.insertAdjacentElement("afterend",copyBar);["v528Condition","v529Condition"].forEach(id=>{const el=document.getElementById(id);if(el&&el!==condition&&!(el.textContent||"").trim()&&!el.querySelector("input,button,select"))el.remove();});}const tab=document.querySelector('.tabs button[data-view="layoutcompare"]');tab?.addEventListener("click",()=>{setTimeout(arrangeCompareLayout,0);requestAnimationFrame(()=>requestAnimationFrame(arrangeCompareLayout));});if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",arrangeCompareLayout,{once:true});else arrangeCompareLayout();setTimeout(arrangeCompareLayout,120);})();

(()=>{function arrangeCompareWorkflow(){const view=document.getElementById("layoutcompareView");if(!view)return;const intro=view.querySelector(".v56-compare-intro"),condition=document.getElementById("v533Condition")||document.getElementById("v529Condition"),settings=document.getElementById("v524CompareSettings"),editor=document.getElementById("v526EditorSwitch"),boosts=view.querySelector(".v520-boosts"),copyBar=document.getElementById("layoutCopyBar"),comparison=view.querySelector(".ab-compare"),actions=view.querySelector(".v56-compare-actions");if(!intro||!condition||!settings||!editor||!boosts||!comparison)return;let anchor=intro;for(const el of[condition,settings,editor,boosts,copyBar,comparison,actions]){if(!el)continue;anchor.insertAdjacentElement("afterend",el);anchor=el;}}const tab=document.querySelector('.tabs button[data-view="layoutcompare"]');tab?.addEventListener("click",()=>{setTimeout(arrangeCompareWorkflow,0);requestAnimationFrame(()=>requestAnimationFrame(arrangeCompareWorkflow));});if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",arrangeCompareWorkflow,{once:true});else arrangeCompareWorkflow();setTimeout(arrangeCompareWorkflow,180);})();

(()=>{if(window.__STOT_V536_BUILD_UX__)return;window.__STOT_V536_BUILD_UX__=true;const makeQuickFill=()=>{let box=document.getElementById("v536QuickFill");if(box)return box;box=document.createElement("div");box.id="v536QuickFill";box.className="panel v536-quick-fill";const areaOptions=(typeof LAYOUT_AREAS!=="undefined"?LAYOUT_AREAS:[]).map(a=>`<option value="${a.id}">${a.name} only</option>`).join(""),drillOpts=(typeof drills!=="undefined"?drills:[]).map(d=>`<option value="${d.id}" ${d.id==="demonic"?"selected":""}>${d.name} • ${d.footprint}</option>`).join(""),tierOpts=(typeof TIER_OPTIONS!=="undefined"?TIER_OPTIONS:[]).map((t,i)=>`<option value="${i}" ${i===0?"selected":""}>${t.name} ×${t.mult}</option>`).join("");box.innerHTML=`<div class="v536-qf-head"><strong>Quick Fill</strong><span>Fill empty plots without rebuilding the same setup</span></div><div class="v536-qf-grid"><label>Drill<select id="v536QuickDrill">${drillOpts}</select></label><label>Tier<select id="v536QuickTier">${tierOpts}</select></label><label>Count<input id="v536QuickCount" type="number" min="1" max="25" step="1" value="1" inputmode="numeric"></label></div><div class="v536-qf-target"><label>Fill empty plots in<select id="v536QuickTarget"><option value="all">All Areas</option>${areaOptions}</select></label><button id="v536QuickApply" type="button">Fill Empty Plots</button></div><div id="v536QuickStatus">Only empty plots are changed.</div>`;box.querySelector("#v536QuickApply").addEventListener("click",()=>{if(typeof layoutPlots==="undefined"||typeof clonePlotRows!=="function")return;const drill=box.querySelector("#v536QuickDrill").value,tier=Math.max(0,Number(box.querySelector("#v536QuickTier").value)||0),count=Math.max(1,Math.min(25,Math.floor(Number(box.querySelector("#v536QuickCount").value)||1)));box.querySelector("#v536QuickCount").value=count;const area=box.querySelector("#v536QuickTarget").value,row={drill,tier,count,hacker:550},probe={rows:clonePlotRows([row])},status=box.querySelector("#v536QuickStatus");status.className="";if(typeof canPack5x5==="function"&&!canPack5x5(probe)){status.textContent="This drill/count does not fit inside one 5×5 plot.";status.classList.add("bad");return;}const targets=layoutPlots.filter(p=>p.rows.length===0&&(area==="all"||p.area===area));if(!targets.length){status.textContent="No empty plots found in that selection.";status.classList.add("bad");return;}targets.forEach(p=>{p.rows=clonePlotRows([row]);});if(typeof renderLayout==="function")renderLayout();status.textContent=`Filled ${targets.length} empty plot${targets.length===1?"":"s"}.`;status.classList.add("ok");});return box;},makeAdvanced=()=>{let details=document.getElementById("v536AdvancedTools");if(!details){details=document.createElement("details");details.id="v536AdvancedTools";details.className="v536-advanced";details.innerHTML='<summary>Advanced Tools <span>Copy • paste • clear layout</span></summary><div id="v536AdvancedHost"></div>';}const bar=document.getElementById("layoutCopyBar"),host=details.querySelector("#v536AdvancedHost");if(bar&&host&&bar.parentElement!==host)host.appendChild(bar);return details;},enhancePlotButtons=()=>{if(typeof layoutPlots==="undefined")return;document.querySelectorAll("#layoutAreas .plot-card").forEach(card=>{const actions=card.querySelector(".plot-actions");if(!actions)return;actions.classList.add("v536-three");if(actions.querySelector("[data-v536-duplicate]"))return;const id=card.dataset.plot,index=layoutPlots.findIndex(p=>p.id===id),btn=document.createElement("button");btn.type="button";btn.className="plot-action v536-duplicate";btn.dataset.v536Duplicate=id;btn.textContent="Duplicate → Next";btn.disabled=index<0||index>=layoutPlots.length-1;btn.addEventListener("click",()=>{const currentIndex=layoutPlots.findIndex(p=>p.id===id);if(currentIndex<0||currentIndex>=layoutPlots.length-1)return;const src=layoutPlots[currentIndex],next=layoutPlots[currentIndex+1];if(next.rows.length&&!window.confirm(`Plot ${next.index} already has drills. Replace it with this plot?`))return;next.rows=clonePlotRows(src.rows);const nextId=next.id;if(typeof renderLayout==="function")renderLayout();requestAnimationFrame(()=>{const nextCard=document.querySelector(`#layoutAreas .plot-card[data-plot="${nextId}"]`),group=nextCard?.closest("details.area-group");if(group)group.open=true;nextCard?.scrollIntoView({behavior:"smooth",block:"center"});});});actions.appendChild(btn);});},arrangeBuilderUX=()=>{const areas=document.getElementById("layoutAreas");if(!areas)return;const quick=makeQuickFill(),advanced=makeAdvanced(),parent=areas.parentElement;if(parent){parent.insertBefore(quick,areas);parent.insertBefore(advanced,areas);}enhancePlotButtons();const view=document.getElementById("layoutcompareView");if(view&&view.contains(areas)){const intro=view.querySelector(".v56-compare-intro"),condition=document.getElementById("v533Condition")||document.getElementById("v529Condition"),settings=document.getElementById("v524CompareSettings"),editor=document.getElementById("v526EditorSwitch"),boosts=view.querySelector(".v520-boosts"),note=view.querySelector(".layout-note"),comparison=view.querySelector(".ab-compare"),actions=view.querySelector(".v56-compare-actions");if(intro&&condition&&settings&&editor&&boosts&&comparison){let anchor=intro;for(const el of[condition,settings,editor,boosts,quick,advanced,areas,note,comparison,actions]){if(!el)continue;anchor.insertAdjacentElement("afterend",el);anchor=el;}}}};if(typeof renderLayout==="function"){const originalRender=renderLayout;renderLayout=function(){const result=originalRender.apply(this,arguments);enhancePlotButtons();return result;};}document.querySelectorAll('.tabs button[data-view="oil"],.tabs button[data-view="layoutcompare"]').forEach(tab=>tab.addEventListener("click",()=>{setTimeout(arrangeBuilderUX,0);requestAnimationFrame(()=>requestAnimationFrame(arrangeBuilderUX));}));if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",arrangeBuilderUX,{once:true});else arrangeBuilderUX();setTimeout(arrangeBuilderUX,220);})();
} catch (error) { console.error("STOT patch failed: js/v539-08.js", error); }

/* ===== js/v539-09.js ===== */
try {
(()=>{if(window.__STOT_V537_QUICK_FILL__)return;window.__STOT_V537_QUICK_FILL__=true;const qRows=[{drill:"demonic",tier:0,count:1,hacker:550}];let lastReserve=null;const esc=s=>String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])),refineryIndex=()=>typeof refineries!=="undefined"?refineries:[],drillIndex=()=>typeof drills!=="undefined"?drills:[];function cloneRows(rows){if(typeof clonePlotRows==="function")return clonePlotRows(rows);return rows.map(r=>({drill:r.drill,tier:+r.tier||0,count:Math.max(1,Math.min(25,Math.floor(+r.count||1))),hacker:Math.max(0,+r.hacker||550)}));}function fp(v){if(typeof fpSize==="function")return fpSize(v);const m=String(v||"1x1").match(/^(\d+)x(\d+)$/);return m?[+m[1],+m[2]]:[1,1];}function piecesFromRows(rows){const pieces=[];for(const r of rows){const d=drillIndex().find(x=>x.id===r.drill);if(!d)continue;const[w,h]=fp(d.footprint),n=Math.max(0,Math.floor(+r.count||0));for(let i=0;i<n;i++)pieces.push([w,h]);}return pieces;}function canPackPieces5x5(input){const pieces=input.map(x=>[+x[0],+x[1]]),area=pieces.reduce((a,[w,h])=>a+w*h,0);if(area>25)return false;pieces.sort((a,b)=>(b[0]*b[1])-(a[0]*a[1])||Math.max(b[0],b[1])-Math.max(a[0],a[1]));const grid=Array(25).fill(false),memo=new Set, fits=(w,h,x,y)=>{if(x+w>5||y+h>5)return false;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(grid[yy*5+xx])return false;return true},setp=(w,h,x,y,v)=>{for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)grid[yy*5+xx]=v};function dfs(i){if(i===pieces.length)return true;const key=i+":"+grid.map(v=>v?1:0).join("");if(memo.has(key))return false;const[a,b]=pieces[i],orients=a===b?[[a,b]]:[[a,b],[b,a]];for(const[w,h]of orients)for(let y=0;y<=5-h;y++)for(let x=0;x<=5-w;x++){if(!fits(w,h,x,y))continue;setp(w,h,x,y,true);if(dfs(i+1))return true;setp(w,h,x,y,false);}memo.add(key);return false;}return dfs(0);}function refineryPieces(ref,qty){const[w,h]=fp(ref?.footprint),out=[];for(let i=0;i<qty;i++)out.push([w,h]);return out;}function rowLoss(row){const d=drillIndex().find(x=>x.id===row.drill);if(!d)return 0;const tier=(typeof TIER_OPTIONS!=="undefined"?TIER_OPTIONS[+row.tier||0]?.mult:1)||1;let base=Number(d.oil)||0;if(d.special==="heart")base=Math.max(0,Number(document.querySelector("#layoutLikes")?.value)||0);if(d.special==="hacker")base=Math.max(0,Number(row.hacker)||550);if(d.special==="clock")base=1;let pet=1;try{if(typeof layoutPetMult==="function")pet=layoutPetMult(d)||1}catch(e){}return base*tier*pet;}function reservedVariant(template,ref,qty){const reserve=refineryPieces(ref,qty),reservedCells=reserve.reduce((a,[w,h])=>a+w*h,0);if(!canPackPieces5x5(reserve))return{ok:false,reason:"That refinery quantity cannot fit inside one 5×5 plot by itself."};const original=cloneRows(template),fitsRows=rows=>canPackPieces5x5([...piecesFromRows(rows),...reserve]);if(fitsRows(original))return{ok:true,rows:original,removed:0,reservedCells};const counts=original.map(r=>Math.max(0,Math.floor(+r.count||0))),losses=original.map(r=>Math.max(0,rowLoss(r))),start=counts.map(()=>0),key=v=>v.join(',');let frontier=[{v:start,removed:0,loss:0}];const seen=new Set([key(start)]),maxRemoved=counts.reduce((a,b)=>a+b,0);for(let depth=1;depth<=maxRemoved;depth++){const next=[];for(const state of frontier){for(let i=0;i<counts.length;i++){if(state.v[i]>=counts[i])continue;const v=state.v.slice();v[i]++;const k=key(v);if(seen.has(k))continue;seen.add(k);next.push({v,removed:depth,loss:state.loss+losses[i]});}}next.sort((a,b)=>a.loss-b.loss);for(const state of next){const rows=[];for(let i=0;i<original.length;i++){const remain=counts[i]-state.v[i];if(remain>0)rows.push({...original[i],count:remain});}if(fitsRows(rows))return{ok:true,rows,removed:depth,reservedCells};}frontier=next;if(!frontier.length)break;}return{ok:false,reason:"Could not create a valid reserved space in Plot 1 for that refinery setup."};}function rowMarkup(r,i){const dOpts=drillIndex().map(d=>`<option value="${esc(d.id)}" ${d.id===r.drill?"selected":""}>${esc(d.name)} • ${esc(d.footprint)}</option>`).join(""),tOpts=(typeof TIER_OPTIONS!=="undefined"?TIER_OPTIONS:[]).map((t,j)=>`<option value="${j}" ${j===+r.tier?"selected":""}>${esc(t.name)} ×${t.mult}</option>`).join("");return`<div class="v537-template-row" data-v537-row="${i}"><label>Drill<select data-v537-drill>${dOpts}</select></label><label>Tier<select data-v537-tier>${tOpts}</select></label><label>Count<input data-v537-count type="number" min="1" max="25" step="1" value="${Math.max(1,+r.count||1)}" inputmode="numeric"></label><button class="v537-template-remove" data-v537-remove type="button" title="Remove">×</button></div>`;}function templateInfo(){const temp={rows:cloneRows(qRows)};let cells=0;try{cells=typeof pieceList==="function"?pieceList(temp).area:piecesFromRows(temp.rows).reduce((a,[w,h])=>a+w*h,0)}catch(e){}const ok=typeof canPack5x5==="function"?canPack5x5(temp):canPackPieces5x5(piecesFromRows(temp.rows));return{cells,ok};}function renderTemplate(box){const host=box.querySelector("#v537TemplateRows");if(!host)return;host.innerHTML=qRows.map(rowMarkup).join("");host.querySelectorAll("[data-v537-row]").forEach(el=>{const i=+el.dataset.v537Row,r=qRows[i];if(!r)return;el.querySelector("[data-v537-drill]").onchange=e=>{r.drill=e.target.value;updateTemplateFit(box)};el.querySelector("[data-v537-tier]").onchange=e=>{r.tier=+e.target.value||0;updateTemplateFit(box)};el.querySelector("[data-v537-count]").oninput=e=>{r.count=Math.max(1,Math.min(25,Math.floor(+e.target.value||1)));e.target.value=r.count;updateTemplateFit(box)};el.querySelector("[data-v537-remove]").onclick=()=>{if(qRows.length===1)qRows[0]={drill:"demonic",tier:0,count:1,hacker:550};else qRows.splice(i,1);renderTemplate(box);updateTemplateFit(box)};});updateTemplateFit(box);}function updateTemplateFit(box){const info=templateInfo(),el=box.querySelector("#v537TemplateFit");if(!el)return;el.innerHTML=`<span>Template Plot</span><strong>${info.ok?`${info.cells} / 25 cells`:`Doesn't fit 5×5`}</strong>`;el.querySelector("strong").style.color=info.ok?"":"#ff9aaf";}function buildUI(){const box=document.getElementById("v536QuickFill");if(!box||box.dataset.v537==="1")return box;box.dataset.v537="1";box.classList.add("v537-quick-fill");const areaOptions=(typeof LAYOUT_AREAS!=="undefined"?LAYOUT_AREAS:[]).map(a=>`<option value="${esc(a.id)}">${esc(a.name)} only</option>`).join(""),refs=refineryIndex().map((r,i)=>`<option value="${i}" ${r.name==="Infinity Refinery"?"selected":""}>${esc(r.name)} • ${esc(r.footprint)}</option>`).join("");box.innerHTML=`<div class="v536-qf-head"><strong>Quick Fill</strong><span>Build one plot template, then reuse it</span></div><div class="v537-template-head"><strong>Template Plot</strong><span>Add one or more drill rows</span></div><div id="v537TemplateRows"></div><button id="v537AddTemplateRow" type="button">+ Add Drill to Template</button><div class="v537-template-fit" id="v537TemplateFit"></div><div class="v537-reserve"><label class="v537-checkline"><input id="v537ReserveToggle" type="checkbox"> Reserve space for Refinery in ×1 Plot 1</label><div id="v537ReserveFields"><label>Refinery Type<select id="v537Refinery">${refs}</select></label><label>Quantity<input id="v537RefineryQty" type="number" min="1" max="25" step="1" value="1" inputmode="numeric"></label></div><div class="v537-reserve-note">Optional. The refinery is not added to the layout; Quick Fill only leaves enough real 5×5 space for it in Forest Plot 1.</div></div><div class="v537-qf-target"><label>Fill empty plots in<select id="v537QuickTarget"><option value="all">All Areas</option>${areaOptions}</select></label><button id="v537QuickApply" type="button">Fill Empty Plots</button></div><div id="v537QuickStatus">Only empty plots are changed.</div>`;renderTemplate(box);box.querySelector("#v537AddTemplateRow").onclick=()=>{qRows.push({drill:"demonic",tier:0,count:1,hacker:550});renderTemplate(box)};const toggle=box.querySelector("#v537ReserveToggle"),fields=box.querySelector("#v537ReserveFields");toggle.onchange=()=>fields.classList.toggle("show",toggle.checked);box.querySelector("#v537QuickApply").onclick=()=>applyQuickFill(box);return box;}function applyQuickFill(box){const status=box.querySelector("#v537QuickStatus");status.className="";if(typeof layoutPlots==="undefined")return;const info=templateInfo();if(!qRows.length||!info.ok){status.textContent="Fix the Template Plot first — it must fit inside one 5×5 plot.";status.classList.add("bad");return;}const area=box.querySelector("#v537QuickTarget").value,reserveOn=box.querySelector("#v537ReserveToggle").checked;let reserved=null;const forestPlot1=layoutPlots.find(p=>p.area==="forest"&&+p.index===1)||layoutPlots.find(p=>+p.mult===1&&+p.index===1),selectionIncludesForest=area==="all"||area==="forest";if(reserveOn){if(!selectionIncludesForest){status.textContent="Refinery space can only be reserved when All Areas or Forest is selected.";status.classList.add("bad");return;}if(!forestPlot1){status.textContent="Could not find ×1 Plot 1.";status.classList.add("bad");return;}if(forestPlot1.rows.length){status.textContent="×1 Plot 1 is not empty. Clear it first so Quick Fill can create the reserved space safely.";status.classList.add("bad");return;}const idx=Math.max(0,Math.min(refineryIndex().length-1,+box.querySelector("#v537Refinery").value||0)),ref=refineryIndex()[idx],qty=Math.max(1,Math.min(25,Math.floor(+box.querySelector("#v537RefineryQty").value||1)));box.querySelector("#v537RefineryQty").value=qty;reserved=reservedVariant(qRows,ref,qty);if(!reserved.ok){status.textContent=reserved.reason;status.classList.add("bad");return;}reserved.ref=ref;reserved.qty=qty;}const targets=layoutPlots.filter(p=>p.rows.length===0&&(area==="all"||p.area===area));if(!targets.length){status.textContent="No empty plots found in that selection.";status.classList.add("bad");return;}for(const p of targets)p.rows=reserveOn&&p===forestPlot1?cloneRows(reserved.rows):cloneRows(qRows);lastReserve=reserveOn?{plotId:forestPlot1.id,cells:reserved.reservedCells,qty:reserved.qty,name:reserved.ref.name,removed:reserved.removed}:null;if(typeof renderLayout==="function")renderLayout();decorateReservedPlot();let msg=`Filled ${targets.length} empty plot${targets.length===1?"":"s"} from the template.`;if(reserveOn)msg+=` ×1 Plot 1 kept ${reserved.reservedCells} cells of usable 5×5 space for ${reserved.qty} × ${reserved.ref.name}${reserved.removed?` by removing ${reserved.removed} drill${reserved.removed===1?"":"s"} there only`:""}.`;status.textContent=msg;status.classList.add("ok");}function decorateReservedPlot(){if(!lastReserve)return;const card=document.querySelector(`#layoutAreas .plot-card[data-plot="${lastReserve.plotId}"]`);if(!card)return;const st=card.querySelector(".plot-status");if(!st)return;st.classList.add("v537-reserved");if(!st.querySelector("small"))st.insertAdjacentHTML("beforeend",`<small>${lastReserve.cells} cells reserved • refinery not added</small>`);}function ensure(){const box=buildUI();if(!box)return;decorateReservedPlot();}document.querySelector('.tabs button[data-view="layoutcompare"]')?.addEventListener("click",()=>setTimeout(ensure,0));if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(ensure,0),{once:true});else setTimeout(ensure,0);setTimeout(ensure,250);if(typeof renderLayout==="function"&&!renderLayout.__v537Wrapped){const original=renderLayout,wrapped=function(){const r=original.apply(this,arguments);setTimeout(decorateReservedPlot,0);return r};wrapped.__v537Wrapped=true;renderLayout=wrapped;}})();
} catch (error) { console.error("STOT patch failed: js/v539-09.js", error); }

/* ===== js/v539-10.js ===== */
try {
(() => {
  /* v5.39 — Older compare-layout patches physically moved the calculator and
     boosts out of Oil / Hour. Keep one real set of controls, but mount it in
     the correct page every time the user switches views. */
  if(window.__STOT_V539_UI__) return;
  window.__STOT_V539_UI__=true;

  const byId=id=>document.getElementById(id);
  const nextFrames=fn=>{setTimeout(fn,0);setTimeout(fn,40);requestAnimationFrame(()=>requestAnimationFrame(fn));};

  function liveParts(){
    const modeTabs=byId('layoutModeTabs');
    return {
      calc:modeTabs?.closest('.layout-control-card')||null,
      boosts:document.querySelector('.v520-boosts'),
      controls:document.querySelector('.layout-controls'),
      quick:byId('v536QuickFill'),
      advanced:byId('v536AdvancedTools'),
      areas:byId('layoutAreas'),
      note:document.querySelector('.layout-note')
    };
  }

  function hideKnownLegacyShells(root,preserve=null){
    if(!root) return;
    ['v527Workflow','v528Condition','v529Condition','v528LayoutSettings','v529LayoutSetup'].forEach(id=>{
      const el=byId(id);
      if(el && el!==preserve && root.contains(el)) el.classList.add('v539-hidden-shell');
    });
    root.querySelectorAll('.v519-old-result,.v528-remove-empty,.v533-obsolete-empty').forEach(el=>el.classList.add('v539-hidden-shell'));

    root.querySelectorAll(':scope > .panel').forEach(panel=>{
      if(panel.classList.contains('ab-compare')) return;
      if(panel.querySelector('.ab-editing') && !panel.querySelector('.ab-layout-switch')){
        panel.classList.add('v539-hidden-shell');
        return;
      }
      const useful=panel.querySelector('input:not([type="hidden"]),select,textarea,button:not([hidden]),#layoutModeTabs,.ab-compare,.v56-compare-intro,.v520-boosts');
      const text=(panel.innerText||'').trim();
      if(!useful && !text) panel.classList.add('v539-hidden-shell');
    });
  }

  function mountOil(){
    const oil=byId('oilView'); if(!oil) return;
    const {calc,boosts,controls,quick,advanced,areas,note}=liveParts();
    if(!calc || !boosts || !controls) return;

    if(calc.parentElement!==controls) controls.appendChild(calc);
    controls.classList.remove('v539-empty-controls');

    boosts.classList.remove('v539-compare-boosts');
    boosts.classList.add('v539-oil-boosts');
    const title=boosts.querySelector('.v520-boosts-title strong');
    const hint=boosts.querySelector('.v520-boosts-title span');
    if(title) title.textContent='Layout Boosts';
    if(hint) hint.textContent='Mole • Fruit • Heart Likes • x2';

    const introPanel=oil.querySelector(':scope > .panel.step');
    const intro=oil.querySelector('.oil-layout-intro');
    if(intro){
      const h=intro.querySelector('h2'); const p=intro.querySelector('p'); const badge=intro.querySelector('.layout-badge');
      if(h) h.textContent='Oil / Hour';
      if(p) p.textContent='Build one layout, set your boosts, and see its production or time to target.';
      if(badge) badge.textContent='1 Layout';
    }

    let anchor=introPanel;
    for(const el of [boosts,controls,quick,advanced,areas,note]){
      if(!el || !anchor) continue;
      anchor.insertAdjacentElement('afterend',el); anchor=el;
    }
    hideKnownLegacyShells(oil);
  }

  function mountCompare(){
    const view=byId('layoutcompareView'); if(!view) return;
    const {calc,boosts,controls,quick,advanced,areas,note}=liveParts();
    const intro=view.querySelector('.v56-compare-intro');
    const condition=byId('v533Condition')||byId('v529Condition');
    const conditionHost=byId('v533ConditionHost')||byId('v529ConditionHost');
    const settings=byId('v524CompareSettings');
    const editor=byId('v526EditorSwitch');
    const comparison=view.querySelector('.ab-compare');
    const actions=view.querySelector('.v56-compare-actions');
    if(!intro || !condition || !calc || !settings || !editor || !boosts || !comparison) return;

    if(conditionHost && calc.parentElement!==conditionHost) conditionHost.appendChild(calc);
    if(controls) controls.classList.add('v539-empty-controls');
    boosts.classList.remove('v539-oil-boosts');
    boosts.classList.add('v539-compare-boosts');

    let anchor=intro;
    for(const el of [condition,settings,editor,boosts,quick,advanced,areas,note,comparison,actions]){
      if(!el) continue;
      anchor.insertAdjacentElement('afterend',el); anchor=el;
    }
    hideKnownLegacyShells(view,condition);
  }

  function syncActiveView(){
    const compare=byId('layoutcompareView');
    if(compare?.classList.contains('active')) mountCompare();
    else if(byId('oilView')?.classList.contains('active')) mountOil();
  }

  document.querySelectorAll('.tabs button').forEach(btn=>{
    btn.addEventListener('click',()=>nextFrames(syncActiveView));
  });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>nextFrames(syncActiveView),{once:true});
  else nextFrames(syncActiveView);
})();
} catch (error) { console.error("STOT patch failed: js/v539-10.js", error); }

/* ===== js/v539-11.js ===== */
try {
(() => {
  if (window.__STOT_PRESET_TERMINOLOGY__) return;
  window.__STOT_PRESET_TERMINOLOGY__ = true;

  const replacements = [
    [/\bLayouts\b/g, "Presets"],
    [/\bLayout\b/g, "Preset"],
    [/\blayouts\b/g, "presets"],
    [/\blayout\b/g, "preset"]
  ];

  const replaceText = value => {
    let next = String(value ?? "");
    for (const [pattern, replacement] of replacements) next = next.replace(pattern, replacement);
    return next;
  };

  const updateElement = el => {
    if (!(el instanceof Element)) return;
    for (const attr of ["title", "aria-label", "placeholder", "value"]) {
      if (!el.hasAttribute(attr)) continue;
      const current = el.getAttribute(attr) || "";
      const next = replaceText(current);
      if (next !== current) el.setAttribute(attr, next);
    }
  };

  const updateTree = root => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const next = replaceText(root.nodeValue || "");
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    if (root.nodeType === Node.ELEMENT_NODE) updateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) {
        const next = replaceText(node.nodeValue || "");
        if (next !== node.nodeValue) node.nodeValue = next;
      } else updateElement(node);
    }
  };

  let queued = false;
  const apply = () => updateTree(document.body);
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  };

  // Run after the consolidated UI has been built and after the few delayed
  // compatibility passes. User interactions schedule another lightweight pass;
  // no permanent whole-document MutationObserver is needed anymore.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply, {once:true});
  else apply();
  [0, 80, 220, 520].forEach(ms => setTimeout(apply, ms));
  document.addEventListener("click", schedule, true);
  document.addEventListener("change", schedule, true);
  document.addEventListener("input", schedule, true);
})();

} catch (error) { console.error("STOT patch failed: js/v539-11.js", error); }

/* ===== js/beta-oil-order.js ===== */
try {
(() => {
  if (window.__STOT_BETA_OIL_ORDER__) return;
  window.__STOT_BETA_OIL_ORDER__ = true;

  const byId = id => document.getElementById(id);
  const later = fn => {
    setTimeout(fn, 0);
    setTimeout(fn, 60);
    setTimeout(fn, 180);
    requestAnimationFrame(() => requestAnimationFrame(fn));
  };

  function getSummary() {
    return document.querySelector('.v519-combined-summary');
  }

  function separateSummary(oil) {
    const summary = getSummary();
    if (!summary) return null;
    summary.classList.add('panel', 'v541-summary-panel');
    if (summary.parentElement !== oil) oil.appendChild(summary);
    return summary;
  }

  function syncCompareOnlyBoostUI() {
    const compareActive = byId('layoutcompareView')?.classList.contains('active');
    const badge = document.querySelector('.v524-shared-badge');
    if (badge) badge.style.display = compareActive ? '' : 'none';
  }

  function applyOilOrder() {
    const oil = byId('oilView');
    syncCompareOnlyBoostUI();
    if (!oil || !oil.classList.contains('active')) return;

    const introPanel = oil.querySelector(':scope > .panel.step');
    const modeTabs = byId('layoutModeTabs');
    const calc = modeTabs?.closest('.layout-control-card');
    const boosts = document.querySelector('.v520-boosts');
    const controls = oil.querySelector('.layout-controls');
    const quick = byId('v536QuickFill');
    const advanced = byId('v536AdvancedTools');
    const areas = byId('layoutAreas');
    const note = oil.querySelector('.layout-note');

    if (!introPanel || !calc) return;

    const summary = separateSummary(oil);
    introPanel.insertAdjacentElement('afterend', calc);
    let anchor = calc;

    for (const el of [boosts, controls, quick, advanced, areas, note]) {
      if (!el || el === calc || el === summary) continue;
      anchor.insertAdjacentElement('afterend', el);
      anchor = el;
    }

    if (summary) oil.appendChild(summary);
    syncCompareOnlyBoostUI();
  }

  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.addEventListener('click', () => later(() => {
      syncCompareOnlyBoostUI();
      applyOilOrder();
    }));
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => later(applyOilOrder), { once: true });
  } else {
    later(applyOilOrder);
  }
})();

} catch (error) { console.error("STOT patch failed: js/beta-oil-order.js", error); }

/* ===== js/beta-first-visit.js ===== */
try {
(() => {
  if (window.__STOT_BETA_FIRST_VISIT__) return;
  window.__STOT_BETA_FIRST_VISIT__ = true;

  const $ = s => document.querySelector(s);

  function friendlyOilEntry() {
    const oil = $('#oilView');
    if (!oil) return;

    const tabs = $('#layoutModeTabs');
    const calc = tabs?.closest('.layout-control-card');
    if (!tabs || !calc) return;

    calc.classList.add('v543-friendly-calc');

    let welcome = calc.querySelector('.v543-calc-intro');
    if (!welcome) {
      welcome = document.createElement('div');
      welcome.className = 'v543-calc-intro';
      welcome.innerHTML = '<strong>What do you want to know?</strong><span>Choose one — you can change it anytime.</span>';
      calc.insertBefore(welcome, calc.firstChild);
    }

    const modeButtons = [...tabs.querySelectorAll('button')];
    for (const btn of modeButtons) {
      const text = (btn.textContent || '').trim();
      if (/Time\s*→\s*Oil/i.test(text)) {
        btn.innerHTML = '<strong>How much oil?</strong><small>See what your preset makes over time</small>';
        btn.setAttribute('aria-label', 'Calculate how much oil your preset makes over time');
      } else if (/Oil\s*→\s*Time/i.test(text)) {
        btn.innerHTML = '<strong>How long?</strong><small>See when you will reach your oil target</small>';
        btn.setAttribute('aria-label', 'Calculate how long it takes to reach your oil target');
      }
    }

    const boosts = $('.v520-boosts');
    if (boosts) {
      boosts.classList.add('v543-friendly-boosts');
      const title = boosts.querySelector('.v520-boosts-title');
      if (title) {
        const first = title.querySelector('strong');
        if (first) first.textContent = 'Preset Boosts';
        let hint = title.querySelector('.v543-optional-hint');
        if (!hint) {
          hint = document.createElement('span');
          hint.className = 'v543-optional-hint';
          hint.textContent = 'Optional — leave these as they are if you do not use boosts';
          title.appendChild(hint);
        }
      }
    }
  }

  function run() {
    friendlyOilEntry();
    setTimeout(friendlyOilEntry, 80);
    setTimeout(friendlyOilEntry, 220);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();

} catch (error) { console.error("STOT patch failed: js/beta-first-visit.js", error); }

/* ===== js/beta-image-atlas-fix.js ===== */
try {
(() => {
  if (window.__STOT_BETA_IMAGE_ATLAS_FIX__) return;
  window.__STOT_BETA_IMAGE_ATLAS_FIX__ = true;

  const VERSION = '5.55';
  const DRILL_IDS = [
    'basic','strong','enhanced','speed','reinforced','industrial','double-industrial','turbo','mega','ice','lava','rocket','mega-laser','scifi-double','scifi-quad','lunar','alien-tech','ufo','solar','antimatter','black-hole','angel','demonic','candy','volcano','disco','hacker','super-rocket','pagoda','drake','ketchup-mustard','heart','clock','banana'
  ];
  const PET_NAMES = ['Penny','Snooze','Breezy','Bandit','Clover','Vault','Dash','Sunny','Tank','Mole','Astro','Nova','Piper','Volt','Fruit'];
  const drillIndex = Object.fromEntries(DRILL_IDS.map((id,i)=>[id,i]));
  const petIndex = Object.fromEntries(PET_NAMES.map((name,i)=>[name.toLowerCase(),i]));

  function atlasInfo(kind, index) {
    if (kind === 'drill') {
      const starts = [0,9,18,26];
      const group = index < 9 ? 0 : index < 18 ? 1 : index < 26 ? 2 : 3;
      const local = index - starts[group];
      return {src:`assets/images/drills/drills-${group}.webp?v=${VERSION}`, cols:3, rows:3, local};
    }
    const group = index < 8 ? 0 : 1;
    const local = index - group * 8;
    return {src:`assets/images/pets/pets-${group}.webp?v=${VERSION}`, cols:4, rows:2, local};
  }

  function setAtlas(el, kind, index) {
    if (!el || !Number.isInteger(index) || index < 0) return;
    const {src,cols,rows,local} = atlasInfo(kind,index);
    const col = local % cols;
    const row = Math.floor(local / cols);
    el.classList.add('v546-atlas-thumb', `v546-${kind}-thumb`);
    el.style.backgroundImage = `url('${src}')`;
    el.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    el.style.backgroundPosition = `${cols === 1 ? 0 : col * 100 / (cols - 1)}% ${rows === 1 ? 0 : row * 100 / (rows - 1)}%`;
    el.innerHTML = '';
  }

  function drillByVisibleName(name) {
    if (typeof drills === 'undefined' || !Array.isArray(drills)) return null;
    return drills.find(d => (d.name || '').trim() === name?.trim()) || null;
  }

  function decorateDrillDatabase() {
    document.querySelectorAll('#drillList .drill-card').forEach(card => {
      const d = drillByVisibleName(card.querySelector('.drill-info strong')?.textContent);
      const idx = d ? drillIndex[d.id] : undefined;
      if (Number.isInteger(idx)) setAtlas(card.querySelector('.drill-logo'), 'drill', idx);
    });
  }

  function decorateDrillPicker() {
    document.querySelectorAll('#pickerList [data-pick]').forEach(item => {
      const idx = drillIndex[item.dataset.pick];
      if (Number.isInteger(idx)) setAtlas(item.querySelector('.pick-mark'), 'drill', idx);
    });
  }

  function ensurePresetThumb(row, select) {
    let wrap = row.querySelector('.v546-drill-choice');
    let thumb = wrap?.querySelector('.v546-preset-thumb');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'v546-drill-choice';
      thumb = document.createElement('span');
      thumb.className = 'v546-preset-thumb';
      select.parentNode.insertBefore(wrap, select);
      wrap.append(thumb, select);
    }
    return thumb;
  }

  function decoratePresetRows() {
    document.querySelectorAll('.plot-row').forEach(row => {
      const select = row.querySelector('select[data-rowdrill]');
      if (!select) return;
      const thumb = ensurePresetThumb(row, select);
      const paint = () => {
        const idx = drillIndex[select.value];
        if (Number.isInteger(idx)) setAtlas(thumb, 'drill', idx);
      };
      paint();
      if (!select.dataset.v546AtlasBound) {
        select.dataset.v546AtlasBound = '1';
        select.addEventListener('change', paint);
      }
    });
  }

  function decorateCompare() {
    document.querySelectorAll('#compareCards .compare-card').forEach(card => {
      const d = drillByVisibleName(card.querySelector('h3')?.textContent);
      const idx = d ? drillIndex[d.id] : undefined;
      if (Number.isInteger(idx)) setAtlas(card.querySelector('.compare-logo'), 'drill', idx);
    });
  }

  function decoratePets() {
    document.querySelectorAll('#petList .drill-card').forEach(card => {
      const name = card.querySelector('.drill-info strong')?.textContent?.trim()?.toLowerCase();
      const idx = petIndex[name];
      if (Number.isInteger(idx)) setAtlas(card.querySelector('.drill-logo'), 'pet', idx);
    });
  }

  function decoratePetChecker() {
    const select = document.getElementById('petSelect');
    if (!select) return;
    const field = select.closest('.field');
    const icon = field?.querySelector('.field-head .icon');
    const name = select.options?.[select.selectedIndex]?.textContent?.trim()?.toLowerCase();
    const idx = petIndex[name];
    if (icon && Number.isInteger(idx)) {
      icon.classList.add('v555-pet-checker-icon');
      setAtlas(icon, 'pet', idx);
    }
    const levelIcon = document.getElementById('petLevel')?.closest('.field')?.querySelector('.field-head .icon');
    if (levelIcon?.classList.contains('v546-atlas-thumb')) {
      levelIcon.className = 'icon';
      levelIcon.removeAttribute('style');
      levelIcon.textContent = 'L';
    }
  }

  function refresh() {
    decorateDrillDatabase();
    decorateDrillPicker();
    decoratePresetRows();
    decorateCompare();
    decoratePets();
    decoratePetChecker();
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; refresh(); });
  });
  observer.observe(document.body, {childList:true, subtree:true});

  document.addEventListener('change', e => {
    if (e.target?.id === 'petSelect') requestAnimationFrame(decoratePetChecker);
  });
  document.addEventListener('click', () => setTimeout(decoratePetChecker, 0));

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once:true});
  else refresh();
  setTimeout(refresh, 120);
  setTimeout(refresh, 400);
})();

} catch (error) { console.error("STOT patch failed: js/beta-image-atlas-fix.js", error); }

/* ===== js/beta-preset-visuals.js ===== */
try {
(() => {
  if (window.__STOT_BETA_PRESET_VISUALS__) return;
  window.__STOT_BETA_PRESET_VISUALS__ = true;

  const VERSION = '5.48';
  const PET_INDEX = { mole: 9, fruit: 14 };
  const DRILL_IDS = [
    'basic','strong','enhanced','speed','reinforced','industrial','double-industrial','turbo','mega','ice','lava','rocket','mega-laser','scifi-double','scifi-quad','lunar','alien-tech','ufo','solar','antimatter','black-hole','angel','demonic','candy','volcano','disco','hacker','super-rocket','pagoda','drake','ketchup-mustard','heart','clock','banana'
  ];
  const drillIndex = Object.fromEntries(DRILL_IDS.map((id,i)=>[id,i]));

  function atlasInfo(kind, index) {
    if (kind === 'drill') {
      const starts = [0,9,18,26];
      const group = index < 9 ? 0 : index < 18 ? 1 : index < 26 ? 2 : 3;
      const local = index - starts[group];
      return {src:`assets/images/drills/drills-${group}.webp?v=${VERSION}`, cols:3, rows:3, local};
    }
    const group = index < 8 ? 0 : 1;
    const local = index - group * 8;
    return {src:`assets/images/pets/pets-${group}.webp?v=${VERSION}`, cols:4, rows:2, local};
  }

  function paintAtlas(el, kind, index) {
    if (!el || !Number.isInteger(index) || index < 0) return;
    const {src,cols,rows,local} = atlasInfo(kind,index);
    const col = local % cols;
    const row = Math.floor(local / cols);
    el.style.backgroundImage = `url('${src}')`;
    el.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    el.style.backgroundPosition = `${col * 100 / (cols - 1)}% ${row * 100 / (rows - 1)}%`;
    el.style.backgroundRepeat = 'no-repeat';
  }

  function decorateLayoutBoost(inputId, petId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const host = input.closest('label') || input.parentElement;
    if (!host) return;
    host.classList.add('v547-pet-boost');
    let thumb = host.querySelector('.v547-pet-boost-thumb');
    if (!thumb) {
      thumb = document.createElement('span');
      thumb.className = 'v547-pet-boost-thumb';
      thumb.setAttribute('aria-hidden','true');
      host.insertBefore(thumb, host.firstChild);
    }
    paintAtlas(thumb, 'pet', PET_INDEX[petId]);
  }

  function decorateDrillPetRow(inputId, petId) {
    const input = document.getElementById(inputId);
    const row = input?.closest('.compact-row');
    const label = row?.querySelector('.compact-label');
    if (!label) return;
    label.classList.add('v548-visual-label');
    let thumb = label.querySelector('.v548-inline-pet-thumb');
    if (!thumb) {
      thumb = document.createElement('span');
      thumb.className = 'v548-inline-pet-thumb';
      thumb.setAttribute('aria-hidden','true');
      label.prepend(thumb);
    }
    paintAtlas(thumb, 'pet', PET_INDEX[petId]);
  }

  function selectedDrill() {
    const btn = document.getElementById('drillPickerBtn');
    if (!btn || typeof drills === 'undefined') return null;
    const name = btn.querySelector('.v548-picker-name')?.textContent?.trim() || btn.textContent.trim();
    return drills.find(d => d.name === name) || null;
  }

  function decorateSelectedDrill() {
    const btn = document.getElementById('drillPickerBtn');
    if (!btn) return;
    const d = selectedDrill();
    if (!d) return;
    const index = drillIndex[d.id];
    if (!Number.isInteger(index)) return;

    const field = btn.closest('.field');
    const icon = field?.querySelector('.field-head .icon');
    if (icon) {
      icon.classList.add('v548-selected-drill-icon');
      icon.textContent = '';
      paintAtlas(icon, 'drill', index);
    }

    let thumb = btn.querySelector('.v548-picker-thumb');
    let name = btn.querySelector('.v548-picker-name');
    if (!thumb || !name) {
      const visibleName = d.name;
      btn.textContent = '';
      thumb = document.createElement('span');
      thumb.className = 'v548-picker-thumb';
      thumb.setAttribute('aria-hidden','true');
      name = document.createElement('span');
      name.className = 'v548-picker-name';
      name.textContent = visibleName;
      btn.append(thumb,name);
    }
    paintAtlas(thumb, 'drill', index);
  }

  function refresh() {
    decorateLayoutBoost('layoutMole', 'mole');
    decorateLayoutBoost('layoutFruit', 'fruit');
    decorateDrillPetRow('moleLevel', 'mole');
    decorateDrillPetRow('fruitLevel', 'fruit');
    decorateSelectedDrill();
  }

  document.addEventListener('click', () => setTimeout(refresh, 0));
  document.addEventListener('input', () => setTimeout(refresh, 0));
  document.addEventListener('change', () => setTimeout(refresh, 0));

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once:true});
  else refresh();
  setTimeout(refresh, 120);
  setTimeout(refresh, 350);
})();

} catch (error) { console.error("STOT patch failed: js/beta-preset-visuals.js", error); }

/* ===== js/beta-database-images.js ===== */
try {
(() => {
  if (window.__STOT_BETA_DATABASE_IMAGES__) return;
  window.__STOT_BETA_DATABASE_IMAGES__ = true;

  const VERSION = '5.56';
  const norm = value => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const groups = {
    refinery: {
      root: '#refineryList',
      base: 'assets/images/refineries/',
      files: {
        'Basic Refinery':'basic.webp','Enhanced Refinery':'enhanced.webp','Reinforced Refinery':'reinforced.webp','Advanced Refinery':'advanced.webp',
        'Plasma Refinery':'plasma.webp','Industrial Refinery':'industrial.webp','Energy Refinery':'energy.webp','Mega Refinery':'mega.webp',
        'Quantum Refinery':'quantum.webp','Ice Refinery':'ice.webp','Hell Refinery':'hell.webp','Nuclear Power Plant Refinery':'nuclear-power-plant.webp',
        'Nuclear Reactor Refinery':'nuclear-reactor.webp','Photon Refinery':'photon.webp','Crystal Core Refinery':'crystal-core.webp','Moon Base Refinery':'moon-base.webp',
        'Solar Refinery':'solar.webp','Antimatter Refinery':'antimatter.webp','Black Hole Refinery':'black-hole.webp','Angel Refinery':'angel.webp',
        'Demonic Refinery':'demonic.webp','Pagoda Refinery':'pagoda.webp','Castle Refinery':'castle.webp','Burger Refinery':'burger.webp',
        'Infinity Refinery':'infinity.webp','Infinite Refinery':'infinity.webp','Fruit Basket Refinery':'fruit-basket.webp'
      }
    },
    solar: {
      root: '#solarList',
      base: 'assets/images/solar/',
      files: {
        'Copper Solar Panel':'wood-solar.webp','Wood Solar Panel':'wood-solar.webp','Iron Solar Panel':'iron-solar.webp',
        'Golden Solar Panel':'gold-solar.webp','Gold Solar Panel':'gold-solar.webp','Emerald Solar Panel':'emerald-solar.webp'
      }
    },
    decoration: {
      root: '#decorationList',
      base: 'assets/images/decorations/',
      files: {
        'Radio Station':'radio-tower.webp','Radio Tower':'radio-tower.webp','Shuttle Station':'shuttle-station.webp',
        'Fusion Radio':'radio-bm.webp','Black Market Radio':'radio-bm.webp','Lootbox Radio':'radio-lb.webp','Loot Box Radio':'radio-lb.webp',
        'Wood Wind Turbine':'wood-wind-turbine.webp','Iron Wind Turbine':'iron-wind-turbine.webp','Gold Wind Turbine':'gold-wind-turbine.webp','Golden Wind Turbine':'gold-wind-turbine.webp',
        'Emerald Wind Turbine':'emerald-wind-turbine.webp','Basic Incubator':'basic-incubator.webp','Heated Incubator':'heated-incubator.webp',
        'Genetic Incubator':'genetic-incubator.webp','Work Station':'work-station.webp','Workstation':'work-station.webp'
      }
    },
    lootbox: {
      root: '#lootboxList',
      base: 'assets/images/lootboxes/',
      files: {
        'Basic Drill Lootbox':'basic-drill.webp','Gold Drill Lootbox':'gold-drill.webp','Diamond Drill Lootbox':'diamond-drill.webp',
        'Rainbow Drill Lootbox':'rainbow-drill.webp','Galaxy Drill Lootbox':'galaxy-drill.webp','Burger Drill Lootbox':'burger-drill.webp','Clock Drill Lootbox':'clock.webp',
        'Basic Refinery Lootbox':'basic-refinery.webp','Gold Refinery Lootbox':'gold-refinery.webp','Diamond Refinery Lootbox':'diamond-refinery.webp',
        'Rainbow Refinery Lootbox':'rainbow-refinery.webp','Galaxy Refinery Lootbox':'galaxy-refinery.webp','Burger Refinery Lootbox':'burger-refinery.webp'
      }
    }
  };

  Object.values(groups).forEach(group => {
    group.lookup = new Map(Object.entries(group.files).map(([name,file]) => [norm(name), file]));
  });

  function decorateGroup(group, kind) {
    const root = document.querySelector(group.root);
    if (!root) return;
    root.querySelectorAll('.drill-card').forEach(card => {
      const name = card.querySelector('.drill-info strong')?.textContent;
      const file = group.lookup.get(norm(name));
      const logo = card.querySelector('.drill-logo');
      if (!file || !logo) return;
      const expected = `${group.base}${file}?v=${VERSION}`;
      let img = logo.querySelector('img.v556-db-image');
      if (!img) {
        logo.textContent = '';
        img = document.createElement('img');
        img.className = 'v556-db-image';
        img.loading = 'lazy';
        img.decoding = 'async';
        logo.appendChild(img);
      }
      if (!img.src.endsWith(expected)) img.src = expected;
      img.alt = name || '';
      logo.classList.add('v556-db-logo', `v556-${kind}-logo`);
    });
  }

  function refresh() {
    Object.entries(groups).forEach(([kind, group]) => decorateGroup(group, kind));
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {childList:true, subtree:true});
  document.addEventListener('input', schedule, true);
  document.addEventListener('change', schedule, true);
  document.addEventListener('click', () => setTimeout(schedule, 0), true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once:true});
  else refresh();
  setTimeout(refresh, 120);
  setTimeout(refresh, 450);
})();

} catch (error) { console.error("STOT patch failed: js/beta-database-images.js", error); }

/* ===== js/beta-database-redesign.js ===== */
try {
(() => {
  if (window.__STOT_BETA_DATABASE_REDESIGN__) return;
  window.__STOT_BETA_DATABASE_REDESIGN__ = true;

  const VERSION='5.57';
  const view=document.getElementById('databaseView');
  if(!view) return;
  view.classList.add('v557-db');

  const config={
    drills:{root:'#drillList',count:'#drillCount',label:'Drills'},
    refineries:{root:'#refineryList',count:'#refineryCount',label:'Refineries'},
    solar:{root:'#solarList',count:'#solarCount',label:'Solar'},
    totems:{root:'#totemList',count:'#totemCount',label:'Totems'},
    decorations:{root:'#decorationList',count:'#decorationCount',label:'Decorations'},
    lootboxes:{root:'#lootboxList',count:'#lootboxCount',label:'Lootboxes'},
    pets:{root:'#petList',count:'#petCount',label:'Pets'}
  };

  function cardCount(root){return root?.querySelectorAll('.drill-card').length||0}
  function enhanceList(key){
    const cfg=config[key];
    if(!cfg) return;
    const root=document.querySelector(cfg.root);
    if(!root) return;
    root.classList.add('v557-db-list',`v557-${key}-list`);
    root.querySelectorAll('.drill-card').forEach(card=>{
      card.classList.add('v557-db-card',`v557-${key}-card`);
      const logo=card.querySelector('.drill-logo');
      if(logo && !logo.querySelector('img') && !logo.classList.contains('v546-atlas-thumb')) card.classList.add('v557-no-image');
      else card.classList.remove('v557-no-image');
      const head=card.querySelector('.drill-head');
      if(head && !head.dataset.v557A11y){
        head.dataset.v557A11y='1';
        head.setAttribute('role','button');
        head.setAttribute('tabindex','0');
        head.setAttribute('aria-expanded',card.classList.contains('open')?'true':'false');
        head.addEventListener('keydown',e=>{
          if(e.key==='Enter'||e.key===' '){e.preventDefault();head.click();setTimeout(()=>head.setAttribute('aria-expanded',card.classList.contains('open')?'true':'false'),0)}
        });
      }
    });
  }

  function activeKey(){return document.querySelector('#databaseTabs [data-dbview].active')?.dataset.dbview||'drills'}

  function ensureSourceNote(){
    const intro=view.querySelector('.section-intro > div');
    if(!intro||intro.querySelector('.v557-db-source')) return;
    const note=document.createElement('p');
    note.className='v557-db-source';
    note.style.marginTop='7px';
    note.style.fontSize='9px';
    note.style.lineHeight='1.45';
    note.style.color='var(--muted,#98a2b8)';
    note.style.overflowWrap='anywhere';
    note.textContent='Data source: https://oil-tycoon-fortnite.fandom.com/wiki/STEAL_THE_OIL_TYCOON_-_FORTNITE_Wiki';
    intro.appendChild(note);
  }

  function syncTabs(){
    const tabs=document.getElementById('databaseTabs');
    if(!tabs) return;
    tabs.querySelectorAll('[data-dbview]').forEach(btn=>{
      const key=btn.dataset.dbview;
      const cfg=config[key];
      if(!cfg) return;
      const root=document.querySelector(cfg.root);
      btn.dataset.v557Count=String(cardCount(root));
      if(!btn.dataset.v557Label){btn.dataset.v557Label='1';btn.title=cfg.label||key}
    });
  }

  function ensureToolbar(){
    const tabs=document.getElementById('databaseTabs');
    if(!tabs||document.getElementById('v557DbToolbar')) return;
    const bar=document.createElement('div');
    bar.id='v557DbToolbar';bar.className='v557-db-toolbar';
    bar.innerHTML='<div><strong id="v557DbTitle">Database</strong><span id="v557DbHint">Browse items and tap a card for full details.</span></div><span id="v557DbVisible"></span>';
    tabs.insertAdjacentElement('afterend',bar);
  }

  function syncToolbar(){
    const key=activeKey(),cfg=config[key];
    const title=document.getElementById('v557DbTitle');
    const visible=document.getElementById('v557DbVisible');
    const root=cfg?document.querySelector(cfg.root):null;
    if(title) title.textContent=cfg?.label||'Database';
    if(visible) visible.textContent=`${cardCount(root)} shown`;
  }

  function refresh(){
    Object.keys(config).forEach(enhanceList);
    ensureSourceNote();
    ensureToolbar();
    syncTabs();syncToolbar();
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})};
  const observer=new MutationObserver(schedule);
  observer.observe(view,{childList:true,subtree:true});
  view.addEventListener('click',e=>{
    const head=e.target.closest('.v557-db-card .drill-head');
    if(head) setTimeout(()=>head.setAttribute('aria-expanded',head.closest('.drill-card')?.classList.contains('open')?'true':'false'),0);
    if(e.target.closest('#databaseTabs [data-dbview]')) setTimeout(schedule,0);
  },true);
  view.addEventListener('input',schedule,true);
  view.addEventListener('change',schedule,true);

  refresh();setTimeout(refresh,120);setTimeout(refresh,450);
})();

} catch (error) { console.error("STOT patch failed: js/beta-database-redesign.js", error); }

document.documentElement.dataset.stotBetaReady="5.59";
