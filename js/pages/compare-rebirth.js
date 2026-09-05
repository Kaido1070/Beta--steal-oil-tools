/* Compare Presets Rebirth layout only.
   Rebirth state, UI value, and production math are owned by compare-preset-sticky.js. */
(() => {
  const apply=()=>{
    const input=document.getElementById('compareLayoutRebirth');
    const field=input?.closest('#v520BoostsCompare label');
    if(!field)return false;
    field.style.order='5';
    field.style.gridColumn='1 / -1';
    return true;
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,0),{once:true});
  else setTimeout(apply,0);
  document.querySelector('.tabs button[data-view="layoutcompare"]')?.addEventListener('click',()=>setTimeout(apply,0));
})();
