(() => {
  if (window.__STOT_BETA_DRILL_IMAGES__) return;
  window.__STOT_BETA_DRILL_IMAGES__ = true;
  if (typeof drills === "undefined" || !Array.isArray(drills)) return;

  const POS = {
    basic:[0,0],strong:[1,0],enhanced:[2,0],speed:[3,0],reinforced:[4,0],industrial:[5,0],
    "double-industrial":[0,1],turbo:[1,1],mega:[2,1],ice:[3,1],lava:[4,1],rocket:[5,1],
    "mega-laser":[0,2],"scifi-double":[1,2],"scifi-quad":[2,2],lunar:[3,2],"alien-tech":[4,2],ufo:[5,2],
    solar:[0,3],antimatter:[1,3],"black-hole":[2,3],angel:[3,3],demonic:[4,3],candy:[5,3],
    volcano:[0,4],disco:[1,4],hacker:[2,4],"super-rocket":[3,4],pagoda:[4,4],drake:[5,4],
    "ketchup-mustard":[0,5],heart:[1,5],clock:[2,5],banana:[3,5]
  };

  const nameToId = new Map(drills.flatMap(d => {
    const names = [d.name];
    try { if (typeof I18N !== "undefined" && I18N.itemName) names.push(I18N.itemName(d)); } catch (_) {}
    return names.filter(Boolean).map(name => [String(name).trim(), d.id]);
  }));

  function sprite(id, extra="") {
    const p = POS[id];
    if (!p) return "";
    const x = p[0] * 20;
    const y = p[1] * 20;
    return `<span class="v544-sprite ${extra}" data-drill-sprite="${id}" style="--v544-x:${x}%;--v544-y:${y}%" aria-hidden="true"></span>`;
  }

  function setSprite(host,id,extra="") {
    if (!host || !POS[id] || host.dataset.v544Sprite === id) return;
    host.innerHTML = sprite(id,extra);
    host.dataset.v544Sprite = id;
  }

  function decoratePicker() {
    document.querySelectorAll('.pick-item[data-pick]').forEach(item => {
      const id = item.dataset.pick;
      setSprite(item.querySelector('.pick-mark'), id, 'v544-picker-sprite');
    });
  }

  function decorateDatabase() {
    document.querySelectorAll('#drillList .drill-card').forEach(card => {
      const name = card.querySelector('.drill-info strong')?.textContent?.trim();
      const id = nameToId.get(name);
      if (id) setSprite(card.querySelector('.drill-logo'), id, 'v544-db-sprite');
    });
  }

  function decorateCompare() {
    document.querySelectorAll('.compare-card').forEach(card => {
      const name = card.querySelector('h3')?.textContent?.trim();
      const id = nameToId.get(name);
      if (id) setSprite(card.querySelector('.compare-logo'), id, 'v544-compare-sprite');
    });
  }

  function decoratePresetRow(row) {
    if (!row) return;
    const select = row.querySelector('select[data-rowdrill]');
    if (!select) return;
    let wrap = row.querySelector('.v544-drill-choice');
    let thumb;
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'v544-drill-choice';
      thumb = document.createElement('span');
      thumb.className = 'v544-drill-thumb';
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(thumb);
      wrap.appendChild(select);
      select.addEventListener('change', () => setSprite(thumb, select.value, 'v544-row-sprite'));
    } else {
      thumb = wrap.querySelector('.v544-drill-thumb');
    }
    if (thumb) setSprite(thumb, select.value, 'v544-row-sprite');
  }

  function decorateAll() {
    decoratePicker();
    decorateDatabase();
    decorateCompare();
    document.querySelectorAll('.plot-row').forEach(decoratePresetRow);
  }

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; decorateAll(); });
  };

  const observer = new MutationObserver(queue);
  observer.observe(document.body, {childList:true, subtree:true});
  document.addEventListener('input', queue, true);
  document.addEventListener('change', queue, true);
  document.addEventListener('click', queue, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', queue, {once:true});
  else queue();
  setTimeout(decorateAll, 120);
  setTimeout(decorateAll, 350);
})();
