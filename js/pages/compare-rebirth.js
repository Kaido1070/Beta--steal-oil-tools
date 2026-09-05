/* STOT Compare Presets Rebirth — isolated compare-page production factor */
(() => {
  if (window.__STOT_COMPARE_REBIRTH_V604__) return;
  window.__STOT_COMPARE_REBIRTH_V604__ = true;

  const byId = id => document.getElementById(id);
  const core = window.STOT_LAYOUT_PRODUCTION;
  const levelOf = value => core?.rebirthLevel ? core.rebirthLevel(value) : Math.max(0, Math.min(50, Math.trunc(Number(value) || 0)));
  const bonusOf = value => core?.rebirthBonusPercent ? core.rebirthBonusPercent(value) : levelOf(value) * 10;
  const multOf = value => core?.rebirthMultiplier ? core.rebirthMultiplier(value) : 1 + bonusOf(value) / 100;
  let rebirth = 0;

  function ensureControl(){
    const view = byId('layoutcompareView');
    const grid = view?.querySelector('#v520BoostsCompare .v603-boost-grid');
    if (!view || !grid) return false;
    let field = byId('comparePresetRebirthField');
    if (!field){
      field = document.createElement('label');
      field.id = 'comparePresetRebirthField';
      field.innerHTML = '<span>Rebirth Level <small id="comparePresetRebirthBonus">+0% Production</small></span><input id="comparePresetRebirth" type="number" min="0" max="50" step="1" value="0" inputmode="numeric" placeholder="0 - 50">';
      grid.appendChild(field);
      const input = byId('comparePresetRebirth');
      const update = () => {
        rebirth = levelOf(input.value);
        input.value = String(rebirth);
        syncBonus();
        scheduleRefresh();
      };
      input.addEventListener('input', update);
      input.addEventListener('change', update);
      input.addEventListener('blur', update);
    }
    syncBonus();
    return true;
  }

  function syncBonus(){
    const bonus = byId('comparePresetRebirthBonus');
    if (bonus) bonus.textContent = `+${bonusOf(rebirth)}% Production`;
  }

  function statePair(){
    const isolated = window.STOT_COMPARE_PRESETS_ISOLATED;
    if (!isolated?.exportCompare) return null;
    const states = isolated.exportCompare();
    return states?.A && states?.B ? states : null;
  }

  function petMult(drill, setup){
    const ml = Math.max(0, Math.min(100, Number(setup?.mole) || 0));
    const fl = Math.max(0, Math.min(100, Number(setup?.fruit) || 0));
    const molePet = typeof pets !== 'undefined' ? pets.find(p => p.id === 'mole') : null;
    const fruitPet = typeof pets !== 'undefined' ? pets.find(p => p.id === 'fruit') : null;
    const mole = ml && molePet && typeof petValue === 'function' ? petValue(molePet, ml) / 100 : 0;
    const fruit = drill?.id === 'banana' && fl && fruitPet && typeof petValue === 'function' ? petValue(fruitPet, fl) / 100 : 0;
    return (1 + mole) * (1 + fruit);
  }

  function metaFor(id){
    if (typeof layoutPlots === 'undefined') return null;
    return layoutPlots.find(p => p.id === id) || null;
  }

  function statsFor(state){
    const setup = state?.setup || {};
    let staticRate = 0, clockGrowth = 0, cells = 0, valid = true;
    for (const entry of (state?.rows || [])){
      const meta = metaFor(entry.id);
      if (!meta) continue;
      const plot = {...meta, rows: Array.isArray(entry.rows) ? entry.rows : []};
      const info = typeof pieceList === 'function' ? pieceList(plot) : {area:0};
      cells += Math.min(Number(info.area) || 0, 25);
      if (typeof canPack5x5 === 'function' && !canPack5x5(plot)){ valid = false; continue; }
      for (const row of plot.rows){
        const drill = typeof drills !== 'undefined' ? drills.find(d => d.id === row.drill) : null;
        if (!drill) continue;
        const count = Math.max(1, Math.min(25, Math.trunc(Number(row.count) || 1)));
        const tier = typeof TIER_OPTIONS !== 'undefined' ? (TIER_OPTIONS[Number(row.tier) || 0]?.mult || 1) : 1;
        let base = Number(drill.oil) || 0;
        if (drill.special === 'heart') base = Math.max(0, Number(setup.likes) || 0);
        else if (drill.special === 'hacker') base = Math.max(0, Number(row.hacker) || 550);
        const mult = tier * (Number(meta.mult) || 1) * count * petMult(drill, setup) * (Number(setup.lobby) === 2 ? 2 : 1) * multOf(rebirth);
        if (drill.special === 'clock') clockGrowth += mult;
        else staticRate += base * mult;
      }
    }
    return {valid, staticRate, clockGrowth, now: valid ? staticRate + clockGrowth : NaN, cells};
  }

  const signedFmt = n => !Number.isFinite(n) ? '—' : (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n));

  function render(){
    const view = byId('layoutcompareView');
    if (!view || !view.classList.contains('active')) return false;
    if (!ensureControl()) return false;
    const states = statePair();
    if (!states) return false;
    const a = statsFor(states.A), b = statsFor(states.B);
    const setup = states.A?.setup || {};
    byId('abRateA').textContent = a.valid ? rateFmt(a.now) + '/s' : '—';
    byId('abRateB').textContent = b.valid ? rateFmt(b.now) + '/s' : '—';
    byId('abCells').textContent = `${a.cells} / ${b.cells}`;
    if (!a.valid || !b.valid){
      byId('abWinner').textContent = 'Fix the over-capacity plot before comparing';
      byId('abDiffRate').textContent = '—';
      byId('abDiffHour').textContent = '—';
      syncSticky();
      return true;
    }
    byId('abDiffRate').textContent = signedFmt(b.now - a.now) + '/s';
    if (setup.mode === 'target'){
      const target = Math.max(0, Number(setup.target) || 0) * (Number(setup.targetUnit) || 1e9);
      const sa = timeForTarget(a.staticRate, a.clockGrowth, target);
      const sb = timeForTarget(b.staticRate, b.clockGrowth, target);
      const targetText = fmt(target);
      byId('v523ModeBadge').textContent = 'Oil → Time';
      byId('v523LabelA').textContent = `Time to ${targetText}`;
      byId('v523LabelB').textContent = `Time to ${targetText}`;
      byId('v523ValueA').textContent = timeText(sa);
      byId('v523ValueB').textContent = timeText(sb);
      byId('v523ExtraA').textContent = `Current: ${rateFmt(a.now)}/s`;
      byId('v523ExtraB').textContent = `Current: ${rateFmt(b.now)}/s`;
      byId('v523Context').textContent = `Both presets use target ${targetText} · Rebirth ${rebirth} (+${bonusOf(rebirth)}%).`;
      byId('v523DiffLabel').textContent = 'Time Difference';
      byId('abDiffHour').textContent = Number.isFinite(sa) && Number.isFinite(sb) ? timeText(Math.abs(sa - sb)) : '—';
      byId('abWinner').textContent = sa === sb ? 'Preset A and B reach the target at the same time' : `Preset ${sa < sb ? 'A' : 'B'} reaches the target faster`;
    } else {
      const hours = Math.max(0, Number(setup.hours) || 0);
      const seconds = Math.floor(hours * 3600);
      const oa = totalOilForSeconds(a.staticRate, a.clockGrowth, seconds);
      const ob = totalOilForSeconds(b.staticRate, b.clockGrowth, seconds);
      const ea = a.staticRate + a.clockGrowth * (seconds + 1);
      const eb = b.staticRate + b.clockGrowth * (seconds + 1);
      const label = Math.abs(hours - 1) < 1e-9 ? '1 Hour' : `${hours} Hours`;
      byId('v523ModeBadge').textContent = 'Time → Oil';
      byId('v523LabelA').textContent = `Oil in ${label}`;
      byId('v523LabelB').textContent = `Oil in ${label}`;
      byId('v523ValueA').textContent = fmt(oa);
      byId('v523ValueB').textContent = fmt(ob);
      byId('v523ExtraA').textContent = `End rate: ${rateFmt(ea)}/s`;
      byId('v523ExtraB').textContent = `End rate: ${rateFmt(eb)}/s`;
      byId('v523Context').textContent = `Both presets use the same run time: ${label} · Rebirth ${rebirth} (+${bonusOf(rebirth)}%).`;
      byId('v523DiffLabel').textContent = 'Oil Difference';
      byId('abDiffHour').textContent = signedFmt(ob - oa);
      if (oa === 0 && ob === 0) byId('abWinner').textContent = 'Add drills to A and B to compare';
      else if (Math.abs(oa - ob) < 1e-9) byId('abWinner').textContent = 'Preset A and B produce the same oil';
      else {
        const best = ob > oa ? 'B' : 'A', hi = Math.max(oa, ob), lo = Math.min(oa, ob);
        byId('abWinner').textContent = lo > 0 ? `Preset ${best} produces +${(((hi - lo) / lo) * 100).toFixed(1)}% more` : `Preset ${best} produces more`;
      }
    }
    syncSticky();
    return true;
  }

  function syncSticky(){
    const bar = byId('v601CompareSticky');
    if (!bar) return;
    const a = bar.querySelector('[data-v601-a]'), b = bar.querySelector('[data-v601-b]');
    if (a) a.textContent = byId('abRateA')?.textContent || '0/s';
    if (b) b.textContent = byId('abRateB')?.textContent || '0/s';
  }

  function scheduleRefresh(){
    requestAnimationFrame(() => requestAnimationFrame(render));
    setTimeout(render, 0);
    setTimeout(render, 80);
  }

  function interceptShare(){
    const btn = byId('v56ShareCompare');
    if (!btn || btn.dataset.rebirthShareBound === '1') return;
    btn.dataset.rebirthShareBound = '1';
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      render();
      const rows = [
        ['Rebirth', `${rebirth} (+${bonusOf(rebirth)}% Production)`],
        ['Preset A', byId('abRateA')?.textContent || '—'],
        [byId('v523LabelA')?.textContent || 'Result A', byId('v523ValueA')?.textContent || '—'],
        ['Preset B', byId('abRateB')?.textContent || '—'],
        [byId('v523LabelB')?.textContent || 'Result B', byId('v523ValueB')?.textContent || '—'],
        ['Result', byId('abWinner')?.textContent || '—'],
        ['Cells A / B', byId('abCells')?.textContent || '—']
      ];
      const esc = typeof escapeHTML === 'function' ? escapeHTML : x => String(x);
      const body = `<div class="share-section"><div class="share-section-title">Preset Comparison</div>${rows.map(([a,b])=>`<div class="share-line"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div>`;
      const text = ['Preset Comparison', ...rows.map(([a,b]) => `${a}: ${b}`)].join('\n');
      if (typeof openSharePreview === 'function') openSharePreview('Preset Comparison', body, text);
    }, true);
  }

  function bind(){
    const view = byId('layoutcompareView');
    if (!view) return false;
    ensureControl();
    interceptShare();
    ['input','change','click'].forEach(evt => view.addEventListener(evt, scheduleRefresh, true));
    document.querySelector('.tabs button[data-view="layoutcompare"]')?.addEventListener('click', scheduleRefresh);
    scheduleRefresh();
    return true;
  }

  function start(){
    let tries = 0;
    const retry = () => {
      if (bind() || tries >= 20) return;
      tries++;
      setTimeout(retry, 50);
    };
    retry();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
