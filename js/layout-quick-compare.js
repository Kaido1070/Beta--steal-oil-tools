(() => {
  const VERSION = "5.49";
  const styles = ["css/v539-01.css", "css/v539-02.css", "css/v539-03.css", "css/beta-first-visit.css", "css/beta-image-atlas-fix.css", "css/beta-preset-visuals.css"];
  for (const href of styles) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${href}?v=${VERSION}`;
    document.head.appendChild(link);
  }

  const scripts = [
    ...Array.from({length: 10}, (_, i) => `js/v539-${String(i + 1).padStart(2, "0")}.js`),
    "js/v539-11.js",
    "js/beta-oil-order.js",
    "js/beta-first-visit.js",
    "js/beta-image-atlas-fix.js",
    "js/beta-preset-visuals.js"
  ];
  let index = 0;
  const loadNext = () => {
    if (index >= scripts.length) {
      document.documentElement.dataset.stotBetaReady = VERSION;
      console.info(`STOT Beta v${VERSION} loaded`);
      return;
    }
    const script = document.createElement("script");
    script.src = `${scripts[index++]}?v=${VERSION}`;
    script.onload = loadNext;
    script.onerror = () => console.error("Failed to load STOT beta update:", script.src);
    document.body.appendChild(script);
  };
  loadNext();
})();
