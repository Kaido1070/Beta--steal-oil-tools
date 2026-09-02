/* STOT compact Advanced Tools bar — v5.92 */
(()=>{
  if(window.__STOT_ADVANCED_INLINE_V592__)return;
  window.__STOT_ADVANCED_INLINE_V592__=true;

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
})();