(() => {
  if (window.__STOT_BETA_FIRST_VISIT__) return;
  window.__STOT_BETA_FIRST_VISIT__ = true;

  const $ = s => document.querySelector(s);

  function friendlyOilEntry() {
    const oil = $('#oilView');
    if (!oil) return;

    const tabs = $('#layoutModeTabs');
    const calc = tabs?.closest('.layout-control-card');
    if (!tabs || !calc) return;

    calc.classList.add('v543-friendly-calc');

    let welcome = calc.querySelector('.v543-calc-intro');
    if (!welcome) {
      welcome = document.createElement('div');
      welcome.className = 'v543-calc-intro';
      welcome.innerHTML = '<strong>What do you want to know?</strong><span>Choose one — you can change it anytime.</span>';
      calc.insertBefore(welcome, calc.firstChild);
    }

    const modeButtons = [...tabs.querySelectorAll('button')];
    for (const btn of modeButtons) {
      const text = (btn.textContent || '').trim();
      if (/Time\s*→\s*Oil/i.test(text)) {
        btn.innerHTML = '<strong>How much oil?</strong><small>See what your preset makes over time</small>';
        btn.setAttribute('aria-label', 'Calculate how much oil your preset makes over time');
      } else if (/Oil\s*→\s*Time/i.test(text)) {
        btn.innerHTML = '<strong>How long?</strong><small>See when you will reach your oil target</small>';
        btn.setAttribute('aria-label', 'Calculate how long it takes to reach your oil target');
      }
    }

    const boosts = $('.v520-boosts');
    if (boosts) {
      boosts.classList.add('v543-friendly-boosts');
      const title = boosts.querySelector('.v520-boosts-title');
      if (title) {
        const first = title.querySelector('strong');
        if (first) first.textContent = 'Preset Boosts';
        let hint = title.querySelector('.v543-optional-hint');
        if (!hint) {
          hint = document.createElement('span');
          hint.className = 'v543-optional-hint';
          hint.textContent = 'Optional — leave these as they are if you do not use boosts';
          title.appendChild(hint);
        }
      }
    }
  }

  function run() {
    friendlyOilEntry();
    setTimeout(friendlyOilEntry, 80);
    setTimeout(friendlyOilEntry, 220);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
})();
