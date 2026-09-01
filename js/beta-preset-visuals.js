(() => {
  if (window.__STOT_BETA_PRESET_VISUALS__) return;
  window.__STOT_BETA_PRESET_VISUALS__ = true;

  const VERSION = '5.47';
  const PET_INDEX = { mole: 9, fruit: 14 };

  function petAtlas(index) {
    const group = index < 8 ? 0 : 1;
    const local = index - group * 8;
    return {
      src: `assets/images/pets/pets-${group}.webp?v=${VERSION}`,
      cols: 4,
      rows: 2,
      local
    };
  }

  function paintPet(el, id) {
    const index = PET_INDEX[id];
    if (!el || !Number.isInteger(index)) return;
    const {src, cols, rows, local} = petAtlas(index);
    const col = local % cols;
    const row = Math.floor(local / cols);
    el.style.backgroundImage = `url('${src}')`;
    el.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    el.style.backgroundPosition = `${col * 100 / (cols - 1)}% ${row * 100 / (rows - 1)}%`;
  }

  function decorateBoost(inputId, petId, labelText) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const host = input.closest('label') || input.parentElement;
    if (!host || host.dataset.v547PetVisual === petId) return;
    host.dataset.v547PetVisual = petId;
    host.classList.add('v547-pet-boost');

    const thumb = document.createElement('span');
    thumb.className = 'v547-pet-boost-thumb';
    thumb.setAttribute('aria-hidden', 'true');
    paintPet(thumb, petId);
    host.insertBefore(thumb, host.firstChild);

    const textNode = [...host.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (textNode && labelText) textNode.textContent = ` ${labelText} `;
  }

  function refresh() {
    decorateBoost('layoutMole', 'mole', 'Mole Level');
    decorateBoost('layoutFruit', 'fruit', 'Fruit Level');
  }

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; refresh(); });
  }).observe(document.body, {childList:true, subtree:true});

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once:true});
  else refresh();
  setTimeout(refresh, 150);
  setTimeout(refresh, 500);
})();
