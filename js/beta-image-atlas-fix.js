(() => {
  if (window.__STOT_BETA_IMAGE_ATLAS_FIX__) return;
  window.__STOT_BETA_IMAGE_ATLAS_FIX__ = true;

  const DRILL_IDS = [
    'basic','strong','enhanced','speed','reinforced','industrial','double-industrial','turbo','mega','ice','lava','rocket','mega-laser','scifi-double','scifi-quad','lunar','alien-tech','ufo','solar','antimatter','black-hole','angel','demonic','candy','volcano','disco','hacker','super-rocket','pagoda','drake','ketchup-mustard','heart','clock','banana'
  ];
  const PET_NAMES = ['Penny','Snooze','Breezy','Bandit','Clover','Vault','Dash','Sunny','Tank','Mole','Astro','Nova','Piper','Volt','Fruit'];
  const drillIndex = Object.fromEntries(DRILL_IDS.map((id,i)=>[id,i]));
  const petIndex = Object.fromEntries(PET_NAMES.map((name,i)=>[name.toLowerCase(),i]));

  function setAtlas(el, kind, index) {
    if (!el || !Number.isInteger(index) || index < 0) return;
    const cols = kind === 'drill' ? 6 : 5;
    const rows = kind === 'drill' ? 6 : 3;
    const col = index % cols;
    const row = Math.floor(index / cols);
    el.classList.add('v546-atlas-thumb', `v546-${kind}-thumb`);
    el.style.backgroundImage = `url('assets/images/${kind === 'drill' ? 'drills/drills-atlas.webp' : 'pets/pets-atlas.webp'}?v=5.46')`;
    el.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    el.style.backgroundPosition = `${cols === 1 ? 0 : (col / (cols - 1)) * 100}% ${rows === 1 ? 0 : (row / (rows - 1)) * 100}%`;
    el.innerHTML = '';
  }

  function decorateDrillDatabase() {
    document.querySelectorAll('#drillList .drill-card').forEach(card => {
      const name = card.querySelector('.drill-info strong')?.textContent?.trim();
      if (!name || typeof drills === 'undefined') return;
      const d = drills.find(x => (x.name || '').trim() === name);
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

  function decoratePresetRows() {
    document.querySelectorAll('.plot-row').forEach(row => {
      const sel = row.querySelector('select[data-rowdrill]');
      if (!sel) return;
      let thumb = row.querySelector('.v546-preset-thumb');
      if (!thumb) {
        const oldWrap = row.querySelector('.v544-drill-choice');
        if (oldWrap) {
          thumb = oldWrap.querySelector('.v544-drill-thumb');
          if (thumb) thumb.classList.add('v546-preset-thumb');
        }
      }
      if (!thumb) return;
      const idx = drillIndex[sel.value];
      if (Number.isInteger(idx)) setAtlas(thumb, 'drill', idx);
      if (!sel.dataset.v546AtlasBound) {
        sel.dataset.v546AtlasBound = '1';
        sel.addEventListener('change', () => {
          const next = drillIndex[sel.value];
          if (Number.isInteger(next)) setAtlas(thumb, 'drill', next);
        });
      }
    });
  }

  function decorateCompare() {
    const cards = document.querySelectorAll('#compareCards .compare-card');
    const ids = [window.compareA, window.compareB];
    cards.forEach((card,i) => {
      let id = ids[i];
      if (!id) {
        const name = card.querySelector('h3')?.textContent?.trim();
        if (name && typeof drills !== 'undefined') id = drills.find(d => d.name === name)?.id;
      }
      const idx = drillIndex[id];
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

  function refresh() {
    decorateDrillDatabase();
    decorateDrillPicker();
    decoratePresetRows();
    decorateCompare();
    decoratePets();
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; refresh(); });
  });
  observer.observe(document.body, {childList:true, subtree:true});

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once:true});
  else refresh();
  setTimeout(refresh, 120);
  setTimeout(refresh, 400);
})();
