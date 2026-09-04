/* Compare Presets selector position hotfix.
   Move the A/B selector into the former editor-status slot without changing Compare state ownership. */
(()=>{
  if(window.__STOT_COMPARE_PRESET_SWITCH_POSITION__)return;
  window.__STOT_COMPARE_PRESET_SWITCH_POSITION__=true;

  let attempts=0;
  const place=()=>{
    const view=document.getElementById('layoutcompareView');
    const switchPanel=document.getElementById('v603PresetSwitch');
    const settings=document.getElementById('v524CompareSettings');
    const editorStatus=document.getElementById('v526EditorSwitch');

    if(!view||!switchPanel||!settings||!editorStatus){
      if(++attempts<160)setTimeout(place,50);
      return;
    }

    const editing=switchPanel.querySelector('.ab-editing');
    if(editing)editing.style.display='none';

    settings.insertAdjacentElement('afterend',switchPanel);
    editorStatus.hidden=true;
    editorStatus.setAttribute('aria-hidden','true');
    editorStatus.style.display='none';
  };

  place();
})();
