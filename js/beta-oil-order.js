(() => {
  if (window.__STOT_BETA_OIL_ORDER__) return;
  window.__STOT_BETA_OIL_ORDER__ = true;

  const byId = id => document.getElementById(id);
  const later = fn => {
    setTimeout(fn, 0);
    setTimeout(fn, 60);
    requestAnimationFrame(() => requestAnimationFrame(fn));
  };

  function findSummary(oil) {
    const headings = [...oil.querySelectorAll('h1,h2,h3,h4,strong')];
    const heading = headings.find(el => /Preset Summary|Layout Summary/i.test((el.textContent || '').trim()));
    if (!heading) return null;
    return heading.closest('.panel,.layout-summary,.v519-result,.v539-summary') || heading.parentElement;
  }

  function applyOilOrder() {
    const oil = byId('oilView');
    if (!oil || !oil.classList.contains('active')) return;

    const introPanel = oil.querySelector(':scope > .panel.step');
    const modeTabs = byId('layoutModeTabs');
    const calc = modeTabs?.closest('.layout-control-card');
    const boosts = oil.querySelector('.v520-boosts');
    const controls = oil.querySelector('.layout-controls');
    const quick = byId('v536QuickFill');
    const advanced = byId('v536AdvancedTools');
    const areas = byId('layoutAreas');
    const note = oil.querySelector('.layout-note');
    const summary = findSummary(oil);

    if (!introPanel || !calc) return;

    // Start with the user's goal: Time -> Oil or Oil -> Time.
    introPanel.insertAdjacentElement('afterend', calc);
    let anchor = calc;

    // Then conditions/boosts, followed by the preset-building tools.
    for (const el of [boosts, controls, quick, advanced, areas, note]) {
      if (!el || el === calc || el === summary) continue;
      anchor.insertAdjacentElement('afterend', el);
      anchor = el;
    }

    // Final result belongs at the very bottom of Oil / Hour.
    if (summary) oil.appendChild(summary);
  }

  document.querySelectorAll('.tabs button').forEach(btn => btn.addEventListener('click', () => later(applyOilOrder)));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => later(applyOilOrder), { once: true });
  } else {
    later(applyOilOrder);
  }
})();
