/* STOT compact Advanced Tools bar — v5.91 performance fix */
(()=>{
  if(window.__STOT_ADVANCED_INLINE_V591__)return;
  window.__STOT_ADVANCED_INLINE_V591__=true;

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
})();
