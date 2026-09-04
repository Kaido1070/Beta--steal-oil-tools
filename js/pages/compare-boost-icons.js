/* Compare Presets boost icons — Compare-only atlas decoration */
(()=>{
  if(window.__STOT_COMPARE_BOOST_ICONS__)return;
  window.__STOT_COMPARE_BOOST_ICONS__=true;

  const ATLAS_VERSION='5.55';
  const specs=[
    {key:'mole',input:'compareLayoutMole',text:'Mole Level',kind:'pet',index:9},
    {key:'fruit',input:'compareLayoutFruit',text:'Fruit Level',kind:'pet',index:14},
    {key:'heart',input:'compareLayoutLikes',text:'Heart Likes',kind:'drill',index:31}
  ];

  function atlasInfo(kind,index){
    if(kind==='drill'){
      const starts=[0,9,18,26];
      const group=index<9?0:index<18?1:index<26?2:3;
      return{src:`assets/images/drills/drills-${group}.webp?v=${ATLAS_VERSION}`,cols:3,rows:3,local:index-starts[group]};
    }
    const group=index<8?0:1;
    return{src:`assets/images/pets/pets-${group}.webp?v=${ATLAS_VERSION}`,cols:4,rows:2,local:index-group*8};
  }

  function paint(icon,kind,index){
    const {src,cols,rows,local}=atlasInfo(kind,index);
    const col=local%cols,row=Math.floor(local/cols);
    icon.style.backgroundImage=`url('${src}')`;
    icon.style.backgroundSize=`${cols*100}% ${rows*100}%`;
    icon.style.backgroundPosition=`${cols===1?0:col*100/(cols-1)}% ${rows===1?0:row*100/(rows-1)}%`;
  }

  function decorate(spec){
    const input=document.getElementById(spec.input);
    const label=input?.closest('#v520BoostsCompare label');
    if(!input||!label)return false;

    let head=label.querySelector(`:scope > .compare-boost-label[data-boost-icon="${spec.key}"]`);
    if(!head){
      [...label.childNodes].forEach(node=>{
        if(node.nodeType===Node.TEXT_NODE&&node.textContent.trim())node.remove();
      });
      head=document.createElement('span');
      head.className='compare-boost-label';
      head.dataset.boostIcon=spec.key;
      const icon=document.createElement('span');
      icon.className='compare-boost-icon';
      icon.setAttribute('aria-hidden','true');
      const text=document.createElement('span');
      text.className='compare-boost-label-text';
      text.textContent=spec.text;
      head.append(icon,text);
      label.insertBefore(head,input);
    }
    const icon=head.querySelector('.compare-boost-icon');
    if(icon)paint(icon,spec.kind,spec.index);
    return true;
  }

  function apply(){
    const panel=document.getElementById('v520BoostsCompare');
    if(!panel)return false;
    const done=specs.map(decorate).every(Boolean);
    if(done)panel.dataset.boostIcons='1';
    return done;
  }

  function boot(){
    let tries=0;
    const run=()=>{
      tries++;
      if(apply()||tries>=100)return;
      setTimeout(run,80);
    };
    run();
  }

  document.addEventListener('click',event=>{
    if(event.target.closest('.tabs button[data-view="layoutcompare"],[data-ab-layout]'))setTimeout(apply,0);
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();