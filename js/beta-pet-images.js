(() => {
  if (window.__STOT_BETA_PET_IMAGES__) return;
  window.__STOT_BETA_PET_IMAGES__ = true;

  const PET_ORDER = [
    'Penny','Snooze','Breezy','Bandit','Clover',
    'Vault','Dash','Sunny','Tank','Mole',
    'Astro','Nova','Piper','Volt','Fruit'
  ];

  function decoratePetCards() {
    const cards = document.querySelectorAll('#petList .drill-card[data-pet-index]');
    cards.forEach(card => {
      const index = Number(card.dataset.petIndex);
      if (!Number.isInteger(index) || index < 0 || index >= PET_ORDER.length) return;
      const logo = card.querySelector('.drill-logo');
      if (!logo) return;
      logo.classList.add('v545-pet-logo');
      logo.style.setProperty('--pet-index', index);
      logo.setAttribute('aria-label', PET_ORDER[index]);
      logo.textContent = '';
    });
  }

  function refresh() {
    try {
      if (typeof renderPets === 'function') renderPets();
    } catch (_) {}
    decoratePetCards();
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      decoratePetCards();
    });
  });

  const start = () => {
    const list = document.querySelector('#petList');
    if (list) observer.observe(list, { childList: true, subtree: true });
    refresh();
    setTimeout(refresh, 120);
    setTimeout(refresh, 350);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
