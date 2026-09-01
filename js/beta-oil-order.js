(() => {
  if (window.__STOT_BETA_OIL_ORDER__) return;
  window.__STOT_BETA_OIL_ORDER__ = true;

  const byId = id => document.getElementById(id);
  const later = fn => {
    setTimeout(fn, 0);
    setTimeout(fn, 60);
    setTimeout(fn, 180);
    requestAnimationFrame(() => requestAnimationFrame(fn));
  };

  function getSummary() {
    return document.querySelector('.v519-combined-summary');
  }

  function separateSummary(oil) {
    const summary = getSummary();
    if (!summary) return null;

    // v5.19 merged the result into the calculator card. v5.41 deliberately
    // reverses that merge so the result is its own final section.
    summary.classList.add('panel', 'v541-summary-panel');
    if (summary.parentElement !== oil) oil.appendChild(summary);
    return summary;
  }

  function applyOilOrder() {
    const oil = byId('oilView');
    if (!oil || !oil.classList.contains('active')) return;

    const introPanel = oil.querySelector(':scope > .panel.step');
    const modeTabs = byId('layoutModeTabs');
    const calc = modeTabs?.closest('.layout-control-card');
    const boosts = document.querySelector('.v520-boosts');
    const controls = oil.querySelector('.layout-controls');
    const quick = byId('v536QuickFill');
    const advanced = byId('v536AdvancedTools');
    const areas = byId('layoutAreas');
    const note = oil.querySelector('.layout-note');

    if (!introPanel || !calc) return;

    const summary = separateSummary(oil);

    // 1) Calculation choice and its relevant input first.
    introPanel.insertAdjacentElement('afterend', calc);
    let anchor = calc;

    // 2) Boosts, preset controls and building tools.
    for (const el of [boosts, controls, quick, advanced, areas, note]) {
      if (!el || el === calc || el === summary) continue;
      anchor.insertAdjacentElement('afterend', el);
      anchor = el;
    }

    // 3) Preset Summary is a completely separate final section.
    if (summary) oil.appendChild(summary);
  }

  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.addEventListener('click', () => later(applyOilOrder));
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => later(applyOilOrder), { once: true });
  } else {
    later(applyOilOrder);
  }
})();
