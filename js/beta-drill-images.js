(() => {
  if (window.__STOT_BETA_DRILL_IMAGES__) return;
  window.__STOT_BETA_DRILL_IMAGES__ = true;

  const IMAGE_MAP = {
    basic: "assets/images/drills/basic.webp",
    enhanced: "assets/images/drills/enhanced.webp",
    industrial: "assets/images/drills/industrial.webp",
    "double-industrial": "assets/images/drills/double-industrial.webp",
    demonic: "assets/images/drills/demonic.webp",
    heart: "assets/images/drills/heart.webp"
  };

  if (typeof drills === "undefined" || !Array.isArray(drills)) return;

  drills.forEach(drill => {
    const src = IMAGE_MAP[drill.id];
    if (src) drill.image = src;
  });

  const fallbackText = drill => {
    if (typeof initials === "function") return initials(drill?.name || "Drill");
    return String(drill?.name || "D").slice(0, 2).toUpperCase();
  };

  function setThumb(thumb, select) {
    const drill = drills.find(d => d.id === select.value) || drills[0];
    if (!drill) return;
    thumb.innerHTML = drill.image
      ? `<img src="${drill.image}" alt="${drill.name}" loading="lazy">`
      : `<span>${fallbackText(drill)}</span>`;
    thumb.classList.toggle("has-image", !!drill.image);
  }

  function decoratePresetRow(row) {
    if (!row || row.dataset.v544Image === "1") return;
    const select = row.querySelector("select[data-rowdrill]");
    if (!select) return;

    const wrap = document.createElement("div");
    wrap.className = "v544-drill-choice";
    const thumb = document.createElement("span");
    thumb.className = "v544-drill-thumb";

    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(thumb);
    wrap.appendChild(select);
    row.dataset.v544Image = "1";

    setThumb(thumb, select);
    select.addEventListener("change", () => setThumb(thumb, select));
  }

  function refresh() {
    document.querySelectorAll(".plot-row").forEach(decoratePresetRow);
    try {
      if (typeof renderDb === "function") renderDb();
      if (typeof renderCompare === "function") renderCompare();
    } catch (_) {}
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      document.querySelectorAll(".plot-row").forEach(decoratePresetRow);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh, { once: true });
  } else {
    refresh();
  }
  setTimeout(refresh, 120);
})();
