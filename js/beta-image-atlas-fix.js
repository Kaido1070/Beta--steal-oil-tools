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
