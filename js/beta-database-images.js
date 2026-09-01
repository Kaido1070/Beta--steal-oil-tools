(() => {
  if (window.__STOT_BETA_DATABASE_IMAGES__) return;
  window.__STOT_BETA_DATABASE_IMAGES__ = true;

  const VERSION = '5.56';
  const norm = value => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  const groups = {
    refinery: {
      root: '#refineryList',
      base: 'assets/images/refineries/',
      files: {
        'Basic Refinery':'basic.webp','Enhanced Refinery':'enhanced.webp','Reinforced Refinery':'reinforced.webp','Advanced Refinery':'advanced.webp',
        'Plasma Refinery':'plasma.webp','Industrial Refinery':'industrial.webp','Energy Refinery':'energy.webp','Mega Refinery':'mega.webp',
        'Quantum Refinery':'quantum.webp','Ice Refinery':'ice.webp','Hell Refinery':'hell.webp','Nuclear Power Plant Refinery':'nuclear-power-plant.webp',
        'Nuclear Reactor Refinery':'nuclear-reactor.webp','Photon Refinery':'photon.webp','Crystal Core Refinery':'crystal-core.webp','Moon Base Refinery':'moon-base.webp',
        'Solar Refinery':'solar.webp','Antimatter Refinery':'antimatter.webp','Black Hole Refinery':'black-hole.webp','Angel Refinery':'angel.webp',
        'Demonic Refinery':'demonic.webp','Pagoda Refinery':'pagoda.webp','Castle Refinery':'castle.webp','Burger Refinery':'burger.webp',
        'Infinity Refinery':'infinity.webp','Infinite Refinery':'infinity.webp','Fruit Basket Refinery':'fruit-basket.webp'
      }
    },
    solar: {
      root: '#solarList',
      base: 'assets/images/solar/',
      files: {
        'Copper Solar Panel':'wood-solar.webp','Wood Solar Panel':'wood-solar.webp','Iron Solar Panel':'iron-solar.webp',
        'Golden Solar Panel':'gold-solar.webp','Gold Solar Panel':'gold-solar.webp','Emerald Solar Panel':'emerald-solar.webp'
      }
    },
    decoration: {
      root: '#decorationList',
      base: 'assets/images/decorations/',
      files: {
        'Radio Station':'radio-tower.webp','Radio Tower':'radio-tower.webp','Shuttle Station':'shuttle-station.webp',
        'Fusion Radio':'radio-bm.webp','Black Market Radio':'radio-bm.webp','Lootbox Radio':'radio-lb.webp','Loot Box Radio':'radio-lb.webp',
        'Wood Wind Turbine':'wood-wind-turbine.webp','Iron Wind Turbine':'iron-wind-turbine.webp','Gold Wind Turbine':'gold-wind-turbine.webp','Golden Wind Turbine':'gold-wind-turbine.webp',
        'Emerald Wind Turbine':'emerald-wind-turbine.webp','Basic Incubator':'basic-incubator.webp','Heated Incubator':'heated-incubator.webp',
        'Genetic Incubator':'genetic-incubator.webp','Work Station':'work-station.webp','Workstation':'work-station.webp'
      }
    },
    lootbox: {
      root: '#lootboxList',
      base: 'assets/images/lootboxes/',
      files: {
        'Basic Drill Lootbox':'basic-drill.webp','Gold Drill Lootbox':'gold-drill.webp','Diamond Drill Lootbox':'diamond-drill.webp',
        'Rainbow Drill Lootbox':'rainbow-drill.webp','Galaxy Drill Lootbox':'galaxy-drill.webp','Burger Drill Lootbox':'burger-drill.webp','Clock Drill Lootbox':'clock.webp',
        'Basic Refinery Lootbox':'basic-refinery.webp','Gold Refinery Lootbox':'gold-refinery.webp','Diamond Refinery Lootbox':'diamond-refinery.webp',
        'Rainbow Refinery Lootbox':'rainbow-refinery.webp','Galaxy Refinery Lootbox':'galaxy-refinery.webp','Burger Refinery Lootbox':'burger-refinery.webp'
      }
    }
  };

  Object.values(groups).forEach(group => {
    group.lookup = new Map(Object.entries(group.files).map(([name,file]) => [norm(name), file]));
  });

  function decorateGroup(group, kind) {
    const root = document.querySelector(group.root);
    if (!root) return;
    root.querySelectorAll('.drill-card').forEach(card => {
      const name = card.querySelector('.drill-info strong')?.textContent;
      const file = group.lookup.get(norm(name));
      const logo = card.querySelector('.drill-logo');
      if (!file || !logo) return;
      const expected = `${group.base}${file}?v=${VERSION}`;
      let img = logo.querySelector('img.v556-db-image');
      if (!img) {
        logo.textContent = '';
        img = document.createElement('img');
        img.className = 'v556-db-image';
        img.loading = 'lazy';
        img.decoding = 'async';
        logo.appendChild(img);
      }
      if (!img.src.endsWith(expected)) img.src = expected;
      img.alt = name || '';
      logo.classList.add('v556-db-logo', `v556-${kind}-logo`);
    });
  }

  function refresh() {
    Object.entries(groups).forEach(([kind, group]) => decorateGroup(group, kind));
  }

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {childList:true, subtree:true});
  document.addEventListener('input', schedule, true);
  document.addEventListener('change', schedule, true);
  document.addEventListener('click', () => setTimeout(schedule, 0), true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once:true});
  else refresh();
  setTimeout(refresh, 120);
  setTimeout(refresh, 450);
})();
