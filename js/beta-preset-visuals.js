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
