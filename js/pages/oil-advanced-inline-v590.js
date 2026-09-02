/* STOT compact Advanced Tools bar — v5.93 */
(()=>{
  if(window.__STOT_ADVANCED_INLINE_V593__)return;
  window.__STOT_ADVANCED_INLINE_V593__=true;

  function apply(){
    const tools=document.getElementById('v536AdvancedTools');
    if(!tools)return false;

    tools.open=true;
    tools.classList.add('v590-advanced-inline');

    const summary=tools.querySelector(':scope > summary');
    if(summary && summary.textContent.trim()!=='Advanced Tools')summary.textContent='Advanced Tools';

    const empty=document.getElementById('layoutPasteEmpty');
    const all=document.getElementById('layoutPasteAll');
    const clear=document.getElementById('layoutClearAll');
    if(empty && empty.textContent!=='Paste Empty')empty.textContent='Paste Empty';
    if(all && all.textContent!=='Paste All')all.textContent='Paste All';
    if(clear && clear.textContent!=='Clear All')clear.textContent='Clear All';
    return !!(empty&&all&&clear);
  }

  function start(){
    let tries=0;
    const retry=()=>{
      if(apply() || tries>=12)return;
      tries++;
      setTimeout(retry,120);
    };
    retry();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();

  document.querySelectorAll('.tabs button[data-view="oil"],.tabs button[data-view="layoutcompare"]').forEach(btn=>{
    btn.addEventListener('click',()=>setTimeout(apply,0));
  });

  /* Oil Preset share preview: one-screen mobile layout, no observers. */
  const originalOpen=window.openSharePreview;
  if(typeof originalOpen==='function' && !window.__STOT_OIL_SHARE_COMPACT_V592__){
    window.__STOT_OIL_SHARE_COMPACT_V592__=true;
    window.openSharePreview=function(title,html,text){
      const result=originalOpen.call(this,title,html,text);
      const preview=document.getElementById('sharePreview');
      if(preview){
        const isOil=/\bOil\s+(Layout|Preset)\b/i.test(String(title||'')) || (String(html||'').includes('share-setup-grid') && String(html||'').includes('Production'));
        preview.classList.toggle('v592-oil-share-compact',isOil);
      }
      return result;
    };
  }

  /* v5.93 Oil page flow polish. Runs only on load/view entry; no observers. */
  if(!document.getElementById('v593OilFlowStyle')){
    const style=document.createElement('style');
    style.id='v593OilFlowStyle';
    style.textContent=`
      #oilView .v539-hidden-shell,
      #oilView .v533-obsolete-empty,
      #oilView .v539-empty-controls,
      #oilView .v593-empty-oil-shell,
      #layoutcompareView .v539-hidden-shell,
      #layoutcompareView .v533-obsolete-empty,
      #layoutcompareView .v539-empty-controls{display:none!important}

      #oilView .v593-question-title{margin:0 0 4px!important;font-size:20px!important;line-height:1.08!important;letter-spacing:-.2px!important}
      #oilView .v593-question-copy{margin:0 0 10px!important;color:#a3adbf!important;font-size:12px!important;line-height:1.35!important}
      #oilView .v593-calc-card{padding:12px!important;border-radius:17px!important}
      #oilView #layoutModeTabs.v593-mode-grid{gap:8px!important;margin:7px 0 10px!important}
      #oilView #layoutModeTabs .v593-mode-choice{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;min-height:82px!important;height:auto!important;padding:11px 13px!important;border-radius:14px!important;text-align:left!important;line-height:1.15!important}
      #oilView #layoutModeTabs .v593-mode-choice strong,
      #oilView #layoutModeTabs .v593-mode-choice b{font-size:17px!important;line-height:1.05!important}
      #oilView #layoutModeTabs .v593-mode-choice small,
      #oilView #layoutModeTabs .v593-mode-choice span{line-height:1.25!important}
      #oilView .v593-runtime-field{grid-template-columns:minmax(0,1fr) 112px!important;align-items:center!important;gap:10px!important;min-height:70px!important;padding:9px 11px!important;border-radius:14px!important}
      #oilView .v593-runtime-field .field-head{margin:0!important}
      #oilView .v593-runtime-field input{height:48px!important;min-height:48px!important;font-size:18px!important;border-radius:12px!important}
      #oilView .v520-boosts{margin-bottom:9px!important}
      #oilView #v536QuickFill.v593-quick-flow{margin-top:0!important;padding:12px!important;border-radius:17px!important}
      #oilView #v536QuickFill.v593-quick-flow .v536-qf-head{margin-bottom:9px!important}
      #oilView #v536QuickFill.v593-quick-flow .v537-template-head{margin-bottom:6px!important}
      #oilView #v536QuickFill.v593-quick-flow #v537AddTemplateRow{min-height:39px!important;margin-top:6px!important;border-radius:10px!important}
      #oilView #v536QuickFill.v593-quick-flow .v537-template-fit{margin:6px 0!important;padding:6px 0!important}

      @media(max-width:620px){
        #oilView .v593-question-title{font-size:18px!important}
        #oilView .v593-question-copy{font-size:11px!important;margin-bottom:8px!important}
        #oilView .v593-calc-card{padding:10px!important}
        #oilView #layoutModeTabs.v593-mode-grid{gap:7px!important;margin:6px 0 8px!important}
        #oilView #layoutModeTabs .v593-mode-choice{min-height:72px!important;padding:9px 11px!important;border-radius:12px!important}
        #oilView #layoutModeTabs .v593-mode-choice strong,
        #oilView #layoutModeTabs .v593-mode-choice b{font-size:15px!important}
        #oilView #layoutModeTabs .v593-mode-choice small,
        #oilView #layoutModeTabs .v593-mode-choice span{font-size:10px!important}
        #oilView .v593-runtime-field{grid-template-columns:minmax(0,1fr) 102px!important;min-height:62px!important;padding:8px 10px!important}
        #oilView .v593-runtime-field input{height:44px!important;min-height:44px!important;font-size:17px!important}
        #oilView #v536QuickFill.v593-quick-flow{padding:10px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function markOilFlow(){
    const oil=document.getElementById('oilView');
    if(!oil || !oil.classList.contains('active'))return false;

    const modeTabs=document.getElementById('layoutModeTabs');
    if(modeTabs){
      modeTabs.classList.add('v593-mode-grid');
      modeTabs.querySelectorAll('button').forEach(btn=>btn.classList.add('v593-mode-choice'));
      modeTabs.closest('.layout-control-card')?.classList.add('v593-calc-card');
    }

    document.getElementById('layoutHours')?.closest('.field')?.classList.add('v593-runtime-field');
    document.getElementById('v536QuickFill')?.classList.add('v593-quick-flow');

    const textNodes=[...oil.querySelectorAll('h1,h2,h3,h4,p,strong,span')];
    const question=textNodes.find(el=>el.textContent?.trim()==='What do you want to know?');
    if(question)question.classList.add('v593-question-title');
    const copy=textNodes.find(el=>el.textContent?.trim().startsWith('Choose one'));
    if(copy)copy.classList.add('v593-question-copy');

    const isVisible=node=>{
      if(!node)return false;
      const cs=getComputedStyle(node);
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
      const r=node.getBoundingClientRect();
      return r.width>0&&r.height>0;
    };
    const hasVisibleMeaningful=el=>{
      if([...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return true;
      return [...el.querySelectorAll('*')].some(node=>{
        if(!isVisible(node))return false;
        if(node.matches('input,select,textarea,button,img,svg,canvas'))return true;
        return [...node.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
      });
    };

    const protectedEls=[
      modeTabs?.closest('.layout-control-card'),
      document.querySelector('#oilView .v520-boosts'),
      document.getElementById('v536QuickFill'),
      document.getElementById('v536AdvancedTools'),
      document.getElementById('layoutVisualBuilder'),
      document.querySelector('#oilView .v519-combined-summary')
    ].filter(Boolean);

    const candidates=[
      ...oil.querySelectorAll(':scope > .panel, :scope > .layout-controls, :scope > .layout-control-card'),
      ...oil.querySelectorAll(':scope > .layout-controls > .layout-control-card')
    ];
    candidates.forEach(el=>{
      el.classList.remove('v593-empty-oil-shell');
      if(protectedEls.some(p=>p===el||el.contains(p)||p.contains(el)))return;
      if(!hasVisibleMeaningful(el))el.classList.add('v593-empty-oil-shell');
    });
    return true;
  }

  function scheduleOilFlow(){
    setTimeout(markOilFlow,0);
    setTimeout(markOilFlow,120);
    setTimeout(markOilFlow,320);
  }

  document.querySelector('.tabs button[data-view="oil"]')?.addEventListener('click',scheduleOilFlow);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleOilFlow,{once:true});
  else scheduleOilFlow();
})();