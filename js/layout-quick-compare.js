(() => {
  const AB_VERSION = "5.4";
  const cloneRows = rows => rows.map(r => ({
    drill: r.drill,
    tier: Number(r.tier) || 0,
    count: Math.max(1, Math.min(25, Math.floor(Number(r.count) || 1))),
    hacker: Math.max(0, Number(r.hacker) || 550)
  }));

  function snapshotPlots() {
    return layoutPlots.map(p => ({
      id: p.id,
      rows: cloneRows(p.rows)
    }));
  }

  function applySnapshot(snapshot) {
    const byId = new Map(snapshot.map(x => [x.id, x.rows]));
    for (const p of layoutPlots) p.rows = cloneRows(byId.get(p.id) || []);
  }

  const states = {
    A: snapshotPlots(),
    B: snapshotPlots()
  };

  let activeLayout = "A";
  let switching = false;

  const css = document.createElement("style");
  css.textContent = `
    .ab-layout-switch{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .ab-layout-switch button{min-height:46px;border:1px solid var(--border,#2a3245);border-radius:12px;background:var(--panel-2,#171c27);color:inherit;font-weight:800;font-size:14px}
    .ab-layout-switch button.active{background:var(--text,#f3f6ff);color:var(--bg,#0b0d14);border-color:transparent}
    .ab-editing{text-align:center;margin-top:8px;color:var(--muted,#98a2b8);font-size:12px;font-weight:700}
    .ab-compare{margin-bottom:12px}
    .ab-compare-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
    .ab-compare-head strong{font-size:15px}.ab-compare-head small{color:var(--muted,#98a2b8)}
    .ab-scores{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .ab-score{border:1px solid var(--border,#2a3245);border-radius:12px;padding:11px;background:var(--panel-2,#171c27)}
    .ab-score span,.ab-metric span{display:block;color:var(--muted,#98a2b8);font-size:11px}
    .ab-score strong{display:block;margin-top:4px;font-size:19px}
    .ab-winner{margin-top:8px;border-radius:12px;padding:10px;text-align:center;background:var(--panel-2,#171c27);font-weight:850}
    .ab-diff{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px}
    .ab-metric{border:1px solid var(--border,#2a3245);border-radius:11px;padding:9px}
    .ab-metric strong{display:block;margin-top:3px;font-size:13px}
    @media(max-width:620px){.ab-diff{grid-template-columns:1fr 1fr}.ab-diff .ab-metric:last-child{grid-column:1/-1}}
    /* Keep the current Safari-safe Help behavior while replacing the old quick-compare script */
    .help-preview{height:100dvh;max-height:100dvh;padding-top:max(10px,env(safe-area-inset-top));padding-bottom:max(10px,env(safe-area-inset-bottom))}
    .help-sheet{max-height:calc(100dvh - max(20px,env(safe-area-inset-top)) - max(20px,env(safe-area-inset-bottom)));display:flex;flex-direction:column;overflow:hidden}
    .help-head{flex:0 0 auto}
    .help-content{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding-bottom:max(18px,env(safe-area-inset-bottom))}
    @supports not (height:100dvh){.help-preview{height:100vh;max-height:100vh}.help-sheet{max-height:calc(100vh - 20px)}}
  `;
  document.head.appendChild(css);

  const intro = document.querySelector("#oilView .oil-layout-intro");
  if (intro) {
    const title = intro.querySelector("h2");
    const desc = intro.querySelector("p");
    const badge = intro.querySelector(".layout-badge");
    if (title) title.textContent = "Oil Layout Compare";
    if (desc) desc.textContent = "Build two layouts and compare them instantly.";
    if (badge) badge.textContent = "A / B";
  }

  const firstOilPanel = document.querySelector("#oilView > .panel.step");
  const switchPanel = document.createElement("div");
  switchPanel.className = "panel";
  switchPanel.innerHTML = `
    <div class="ab-layout-switch">
      <button type="button" data-ab-layout="A" class="active">Layout A</button>
      <button type="button" data-ab-layout="B">Layout B</button>
    </div>
    <div class="ab-editing" id="abEditing">Editing Layout A</div>
  `;

  const comparePanel = document.createElement("div");
  comparePanel.className = "panel ab-compare";
  comparePanel.innerHTML = `
    <div class="ab-compare-head">
      <strong>Layout Comparison</strong>
      <small>Updates instantly</small>
    </div>
    <div class="ab-scores">
      <div class="ab-score"><span>Layout A</span><strong id="abRateA">0/s</strong></div>
      <div class="ab-score"><span>Layout B</span><strong id="abRateB">0/s</strong></div>
    </div>
    <div class="ab-winner" id="abWinner">Add drills to A and B to compare</div>
    <div class="ab-diff">
      <div class="ab-metric"><span>Difference / Second</span><strong id="abDiffRate">0/s</strong></div>
      <div class="ab-metric"><span>Difference / 1 Hour</span><strong id="abDiffHour">0</strong></div>
      <div class="ab-metric"><span>Cells A / B</span><strong id="abCells">0 / 0</strong></div>
    </div>
  `;

  if (firstOilPanel) {
    firstOilPanel.insertAdjacentElement("afterend", switchPanel);
    switchPanel.insertAdjacentElement("afterend", comparePanel);
  }

  function currentStateSummary(snapshot) {
    let staticRate = 0, clockGrowth = 0, cells = 0, usedPlots = 0, valid = true;

    for (const basePlot of layoutPlots) {
      const snap = snapshot.find(x => x.id === basePlot.id);
      const p = {
        id: basePlot.id,
        area: basePlot.area,
        areaName: basePlot.areaName,
        mult: basePlot.mult,
        index: basePlot.index,
        rows: cloneRows(snap?.rows || [])
      };

      const info = pieceList(p);
      if (info.area > 0) usedPlots++;
      cells += Math.min(info.area, 25);

      if (!canPack5x5(p)) {
        valid = false;
        continue;
      }

      for (const row of p.rows) {
        const d = drills.find(x => x.id === row.drill);
        if (!d) continue;
        const count = Math.max(0, Math.floor(Number(row.count) || 0));
        const mult = rowTierMult(row) * p.mult * count * layoutPetMult(d) * layoutLobbyMult;
        if (d.special === "clock") clockGrowth += mult;
        else staticRate += rowOilBase(d, row) * mult;
      }
    }

    const now = valid ? staticRate + clockGrowth : NaN;
    const hourOil = valid ? totalOilForSeconds(staticRate, clockGrowth, 3600) : NaN;
    return { valid, now, hourOil, cells, usedPlots };
  }

  function syncActive() {
    if (!switching) states[activeLayout] = snapshotPlots();
  }

  function signedFmt(n, suffix="") {
    if (!Number.isFinite(n)) return "—";
    const sign = n > 0 ? "+" : n < 0 ? "−" : "";
    return sign + fmt(Math.abs(n)) + suffix;
  }

  function renderComparison() {
    syncActive();
    const a = currentStateSummary(states.A);
    const b = currentStateSummary(states.B);

    document.querySelector("#abRateA").textContent = a.valid ? rateFmt(a.now) + "/s" : "—";
    document.querySelector("#abRateB").textContent = b.valid ? rateFmt(b.now) + "/s" : "—";
    document.querySelector("#abCells").textContent = `${a.cells} / ${b.cells}`;

    const winner = document.querySelector("#abWinner");
    const diffRate = document.querySelector("#abDiffRate");
    const diffHour = document.querySelector("#abDiffHour");

    if (!a.valid || !b.valid) {
      winner.textContent = "Fix the over-capacity plot before comparing";
      diffRate.textContent = "—";
      diffHour.textContent = "—";
      return;
    }

    const dRate = b.now - a.now;
    const dHour = b.hourOil - a.hourOil;
    diffRate.textContent = signedFmt(dRate, "/s");
    diffHour.textContent = signedFmt(dHour);

    if (a.now === 0 && b.now === 0) {
      winner.textContent = "Add drills to A and B to compare";
    } else if (Math.abs(a.now - b.now) < 1e-9) {
      winner.textContent = "Layout A and B are equal";
    } else {
      const best = b.now > a.now ? "B" : "A";
      const high = Math.max(a.now, b.now);
      const low = Math.min(a.now, b.now);
      if (low <= 0) winner.textContent = `Layout ${best} is better`;
      else winner.textContent = `Layout ${best} is +${(((high - low) / low) * 100).toFixed(1)}% better`;
    }
  }

  function switchTo(next) {
    if (next === activeLayout) return;
    syncActive();
    switching = true;
    activeLayout = next;
    applySnapshot(states[activeLayout]);

    document.querySelectorAll("[data-ab-layout]").forEach(b => {
      b.classList.toggle("active", b.dataset.abLayout === activeLayout);
    });
    document.querySelector("#abEditing").textContent = `Editing Layout ${activeLayout}`;

    const share = document.querySelector("#layoutShare");
    if (share) share.textContent = `Share Layout ${activeLayout}`;

    renderLayout();
    switching = false;
    renderComparison();
  }

  document.querySelectorAll("[data-ab-layout]").forEach(b => {
    b.addEventListener("click", () => switchTo(b.dataset.abLayout));
  });

  const originalCalcLayout = calcLayout;
  calcLayout = function() {
    if (!switching) syncActive();
    const result = originalCalcLayout.apply(this, arguments);
    if (!switching) renderComparison();
    return result;
  };

  const share = document.querySelector("#layoutShare");
  if (share) share.textContent = "Share Layout A";

  /* Remove any old Quick Layout Compare panel if the page source changes and it appears. */
  document.querySelectorAll(".layout-compare-panel,.quick-layout-compare,.qlc-panel").forEach(el => el.remove());

  renderComparison();
  console.info(`STOT local A/B layout update v${AB_VERSION}`);
})();
