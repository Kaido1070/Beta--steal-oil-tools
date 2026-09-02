/* STOT compact Advanced Tools bar — v5.90 */
(()=>{
  if(window.__STOT_ADVANCED_INLINE_V590__)return;
  window.__STOT_ADVANCED_INLINE_V590__=true;

  function apply(){
    const tools=document.getElementById('v536AdvancedTools');
    if(!tools)return false;
    tools.open=true;
    tools.classList.add('v590-advanced-inline');

    const summary=tools.querySelector(':scope > summary');
    if(summary && summary.textContent.trim()!=='Advanced Tools'){
      summary.textContent='Advanced Tools';
    }

    const empty=document.getElementById('layoutPasteEmpty');
    const all=document.getElementById('layoutPasteAll');
    const clear=document.getElementById('layoutClearAll');
    if(empty && empty.textContent!=='Paste Empty')empty.textContent='Paste Empty';
    if(all && all.textContent!=='Paste All')all.textContent='Paste All';
    if(clear && clear.textContent!=='Clear All')clear.textContent='Clear All';
    return !!(empty&&all&&clear);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();

  const observer=new MutationObserver(()=>apply());
  observer.observe(document.documentElement,{subtree:true,childList:true});
  [0,80,220,500,1000].forEach(ms=>setTimeout(apply,ms));
})();
